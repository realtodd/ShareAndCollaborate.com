$.widget("bw.bwAttachments_MusicPlaylist", {
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
        This is the bwAttachments_MusicPlaylist.js jQuery Widget. 
        ===========================================================

            [more to follow]
                          
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

            [put your stuff here]

        ===========================================================
       
        */

        selectedAudioElement: null, // This is the handle for th ecurrently playing audio element.
        selectedAudioElement_ended: null, // This is a handle on the ended event so we can dispose of it when we want to.
        continueToPlay: false, // This value gets set from the "Continue to play..." checkbox. If a user has this selected, the music will continue to play through their playlist.





        elementIdSuffix: null, // This is a custom guid which gets appended to element id's, making sure this widget keeps to itself.

        jsonData: null,

        fieldTitle: 'Attachments', // This is the title, which shows up on the form in the left column.


        MultiFileUploadFailures: [],

        smallFileBatchArray: null,


        ActivitySpinner_FileUpload_ProgressBar_StatusText: '',
        smallFileArray_TotalSize: null,


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

        STAND_ALONE: false, // This is here to support including this widget in the bwEMailClient_Haraka.js widget, and others that may be created in the future. This makes this widget very re-usable. 4-19-2024.

        requestDialogId: null, // This is the unique id of the request dialog being displayed. We prepend this to id's in order to make sure we can display many dialogs at one time on screen and make them unique in the dom.

        attachmentsAreStoredInIndexDb: null, // We need to know if attachments get stored in IndexDb, or by calling the file service web service.

        operationUriPrefix: null,
        ajaxTimeout: 15000,
        autoSenseDeviceType: false // Automatic UI based on device type. Alpha version so far.
    },
    _create: function () {
        console.log('In bwAttachments_MusicPlaylist.js._create().');
        //alert('In bwAttachments_MusicPlaylist.js._create().');
        this.element.addClass("bwAttachments_MusicPlaylist");
        var thiz = this; // Need this because of the asynchronous operations below.
        try {
            if (this.options.operationUriPrefix == null) {
                // This formulates the operationUri, which is used throughout.
                var url1 = window.location.href.split('https://')[1];
                var url2 = url1.split('/')[0];
                this.options.operationUriPrefix = 'https://' + url2 + '/';
            }

            var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
            this.options.elementIdSuffix = guid;

            if (this.options.inFormsEditor == true) {

                console.log('In bwAttachments_MusicPlaylist.js._create().option.inFormsEditor == true.');
                this.renderAndPopulateAttachments_ReadOnly(); // Need to render, not allowing the user to make modifications.

            } else if (this.options.STAND_ALONE == true) {

                //
                // This is here to support bwEmailClient_Haraka.js and others in the future. 4-19-2024.
                //

                console.log('In bwAttachments_MusicPlaylist.js._create().option.STAND_ALONE == true.');
                this.renderAndPopulateAttachments_STANDALONE(); // Need to render, not allowing the user to make modifications.

            } else if (this.options.allowRequestModifications == false) {

                console.log('In bwAttachments_MusicPlaylist.js._create().option.allowRequestModifications == false.');
                this.renderAndPopulateAttachments_ReadOnly(); // Need to render, not allowing the user to make modifications.

            } else if (this.options.allowRequestModifications == true) {

                console.log('In bwAttachments_MusicPlaylist.js._create().option.allowRequestModifications == true.');
                this.renderAndPopulateAttachments();

            } else {
                var html = '';
                html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwAttachments_MusicPlaylist</span>';
                html += '<br />';
                html += '<span style="">Invalid value for allowRequestModifications: ' + this.options.allowRequestModifications + '</span>';
                this.element.html(html);
            }



        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwAttachments_MusicPlaylist</span>';
            html += '<br />';
            html += '<span style="">Exception in bwAttachments_MusicPlaylist.Create(): ' + e.message + ', ' + e.stack + '</span>';
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
            .removeClass("bwAttachments_MusicPlaylist")
            .text("");
    },
    getDataType: function () {
        try {
            console.log('In bwAttachments_MusicPlaylist.js.getDataType().');

            return 'attachments';
        } catch (e) {
            console.log('Exception in bwAttachments_MusicPlaylist.js.getDataType(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwAttachments_MusicPlaylist.js.getDataType(): ' + e.message + ', ' + e.stack);
        }
    },
    getData: function () {
        try {
            console.log('In bwAttachments_MusicPlaylist.getData().');
            var value = $(this.element).find('#newrequestattachments')[0].innerHTML.trim();
            if (value != '') {
                return 'has attachments';
            } else {
                return null;
            }
        } catch (e) {
            console.log('Exception in bwAttachments_MusicPlaylist.getData(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwAttachments_MusicPlaylist.getData(): ' + e.message + ', ' + e.stack);
        }
    },
    isARequiredField: function () {
        try {
            console.log('In bwAttachments_MusicPlaylist.isARequiredField().');
            return this.options.renderAsARequiredField;
        } catch (e) {
            console.log('Exception in bwAttachments_MusicPlaylist.isARequiredField(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwAttachments_MusicPlaylist.isARequiredField(): ' + e.message + ', ' + e.stack);
        }
    },
    getfieldTitle: function () {
        try {
            console.log('In bwAttachments_MusicPlaylist.getfieldTitle().');
            return this.options.fieldTitle;
        } catch (e) {
            console.log('Exception in bwAttachments_MusicPlaylist.getfieldTitle(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwAttachments_MusicPlaylist.getfieldTitle(): ' + e.message + ', ' + e.stack);
        }
    },



    stopAudio: function (audioElementId) {
        try {
            console.log('In bwAttachments_MusicPlaylist.stopAudio().');

            // This works for 1 audio element, but I think it may be better to find all of them in the DOM and stop them all. This makes it better for the user as well, because they may choose the wrong STOP/PAUSE button,
            // and eliminates confusion.
            //var audioElement = document.getElementById(audioElementId);
            //audioElement.pause();

            // Dispose of the event listener.
            this.options.selectedAudioElement_ended = null;

            var audioElements = document.getElementsByTagName('audio');
            for (var i = 0; i < audioElements.length; i++) {
                audioElements[i].pause();
            }

        } catch (e) {
            console.log('Exception in bwAttachments_MusicPlaylist.stopAudio(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwAttachments_MusicPlaylist.stopAudio(): ' + e.message + ', ' + e.stack);
        }
    },
    selectedAudioElement_ended: function () {
        try {
            console.log('In bwAttachments_MusicPlaylist.selectedAudioElement_ended().');
            var thiz = this;

            // Check if "Continue to play...".
            if (this.options.continueToPlay === true) {

                // Find the next audio element in the playlist, and play it!
                var audioElements = document.getElementsByTagName('audio');

                for (var i = 0; i < audioElements.length - 1; i++) {

                    if (audioElements[i] === this.options.selectedAudioElement) {
 
                        if ((i + 1) < audioElements.length) {

                            //
                            // Before we add the event listener, make sure we removed a previous one.
                            //
                            if (this.options.selectedAudioElement) {
                                this.options.selectedAudioElement.removeEventListener("ended", function (e) {});
                            }

                            this.options.selectedAudioElement = audioElements[i + 1];
                            this.options.selectedAudioElement.play();
                            
                            this.options.selectedAudioElement_ended = this.options.selectedAudioElement.addEventListener("ended", function (e) {
                                thiz.selectedAudioElement_ended();
                            });

                        } else {
                            console.log('In bwAttachments_MusicPlaylist.selectedAudioElement_ended(). WE MUST BE AT THE END OF THE PLAYLIST.');
                        }
                        break;

                    }
                }

            }

        } catch (e) {
            console.log('Exception in bwAttachments_MusicPlaylist.selectedAudioElement_ended(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwAttachments_MusicPlaylist.selectedAudioElement_ended(): ' + e.message + ', ' + e.stack);
        }
    },
    playAudio: function (audioElementId) {
        try {
            console.log('In bwAttachments_MusicPlaylist.playAudio().');
            var thiz = this;
            debugger;
            var continueToPlayCheckboxElement = $(this.element).find('.continueToPlayCheckbox')[0];
            if (continueToPlayCheckboxElement.checked) {
                this.options.continueToPlay = true;
            } else {
                this.options.continueToPlay = false;
            }

            var audioElement = document.getElementById(audioElementId);
            audioElement.play();

            //
            // Before we add the event listener, make sure we removed a previous one.
            //
            if (this.options.selectedAudioElement) {
                this.options.selectedAudioElement.removeEventListener("ended", function (e) { });
            }

            this.options.selectedAudioElement = audioElement;

            this.options.selectedAudioElement_ended =  audioElement.addEventListener("ended", function (e) {
                
                thiz.selectedAudioElement_ended();

            });

        } catch (e) {
            console.log('Exception in bwAttachments_MusicPlaylist.playAudio(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwAttachments_MusicPlaylist.playAudio(): ' + e.message + ', ' + e.stack);
        }
    },
    continueToPlay: function (element) {
        try {
            console.log('In bwAttachments_MusicPlaylist.js.continueToPlay().');
            //alert('In bwAttachments_MusicPlaylist.js.continueToPlay().');
            //var thiz = this;

            if (element.checked) {
                this.options.continueToPlay = true;
            } else {
                this.options.continueToPlay = false;
            }


        } catch (e) {
            console.log('Exception in bwAttachments_MusicPlaylist.js.continueToPlay(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwAttachments_MusicPlaylist.js.continueToPlay(): ' + e.message + ', ' + e.stack);
        }
    },




    downloadZippedFiles: function (bwBudgetRequestId, bwRequestTitle) {
        try {
            console.log('In bwAttachments_MusicPlaylist.js.downloadZippedFiles().');
            //alert('In bwAttachments_MusicPlaylist.js.downloadZippedFiles().');
            var thiz = this;

            ShowActivitySpinner('Preparing zip for download. This may take a while...');

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

            var data = {
                bwParticipantId_LoggedIn: participantId,
                bwActiveStateIdentifier: activeStateIdentifier,
                bwWorkflowAppId_LoggedIn: workflowAppId,

                bwWorkflowAppId: workflowAppId,
                bwBudgetRequestId: bwBudgetRequestId,
                bwRequestTitle: bwRequestTitle
            };

            var operationUri = this.options.operationUriPrefix + '_files/' + 'DownloadAllFilesZippedForBudgetRequest';
            $.ajax({
                url: operationUri,
                type: 'POST',
                data: data,
                timeout: 60000, // It may take a while for the server to produce the zip file.
                headers: { "Accept": "application/json; odata=verbose" },
                success: function (results) {
                    try {

                        if (results.status != 'SUCCESS') {

                            var msg = 'Error in bwAttachments_MusicPlaylist.js.downloadZippedFiles(). ' + results.status + ': ' + results.message;
                            console.log(msg);
                            displayAlertDialog(msg);

                        } else {

                            HideActivitySpinner();

                            //displayAlertDialog(results.message);// The status is 'SUCCESS', so we don't need to say it again. They will see th eifle show up

                            thiz.populateAttachments(workflowAppId, bwBudgetRequestId, 'newrequestattachments');

                            ////
                            //// We need to give the server a second to catch up.
                            ////
                            //setTimeout(function () {

                            //    HideActivitySpinner();

                            //    const link = document.createElement('a')

                            //    link.setAttribute('href', results.Url);
                            //    link.setAttribute('download', results.Filename)
                            //    link.style.display = 'none'

                            //    document.body.appendChild(link);

                            //    link.click(); // This is what invokes the download window.

                            //    document.body.removeChild(link); // Clean up.

                            //}, 2000);

                        }

                    } catch (e) {

                        HideActivitySpinner();

                        var msg = 'Exception in bwAttachments_MusicPlaylist.js.downloadZippedFiles.DownloadAllFilesZippedForBudgetRequest(): ' + e.message + ', ' + e.stack;
                        console.log(msg);
                        displayAlertDialog(msg);
                        $(this.element).find('#newrequestattachments')[0].innerHTML = msg;
                    }
                },
                error: function (data, errorCode, errorMessage) {

                    HideActivitySpinner();

                    var msg = 'Error in bwAttachments_MusicPlaylist.js.downloadZippedFiles.DownloadAllFilesZippedForBudgetRequest(): ' + errorMessage;
                    console.log(msg);
                    displayAlertDialog(msg);

                    //$('#divWorkingOnItDialog').dialog('close'); // Close the "Working on it..." dialog.
                    //console.log('Error in bwAttachments_MusicPlaylist.js.renderAndPopulateAttachments.dropzone.drop(): ' + errorMessage);
                    //debugger;
                    //if (errorMessage == 'timeout') {
                    //    displayAlertDialog('The file server could not be contacted. Please try again in a few minutes.');
                    //} else {
                    //    displayAlertDialog('Error in bwAttachments_MusicPlaylist.js.renderAndPopulateAttachments.dropzone.drop(): ' + errorMessage);
                    //}
                }
            });

        } catch (e) {

            HideActivitySpinner();

            var msg = 'Exception in bwAttachments_MusicPlaylist.js.downloadZippedFiles(): ' + e.message + ', ' + e.stack;
            console.log(msg);
            alert(msg);

        }
    },

    dodrop: function (event, bwBudgetRequestId) {
        try {
            console.log('In bwAttachments_MusicPlaylist.js.dodrop().');
            var thiz = this;

            //alert('In bwAttachments_MusicPlaylist.js.xx(). xcx232131244. event.dataTransfer.types: ' + event.dataTransfer.types + ' :: event.clipboardData: ' + event.clipboardData + ', event.dataTransfer: ' + event.dataTransfer);

            if (event.clipboardData) {

                console.log('In bwAttachments_MusicPlaylist.js.dodrop(). THIS IS clipboardData.');

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

                console.log('In bwAttachments_MusicPlaylist.js.dodrop(). THIS IS dataTransfer.');

                if ((event.dataTransfer.types.indexOf('Files') > -1) && (event.dataTransfer.types.length == 1)) {

                    alert('xcx123123124-1. These are files dragged from outside of the browser window. For example, Windows Explorer, or the Desktop.');

                    //
                    // These are files dragged from outside of the browser window. For example, Windows Explorer, or the Desktop.
                    //
                    this.uploadAttachment('newrequestattachments', null, bwBudgetRequestId, event.dataTransfer);

                } else if ((event.dataTransfer.types.indexOf('text/uri-list') > -1)) {

                    //alert('xcx123123124-2. These are files dragged within the browser window. For example, from one request bwAttachments_MusicPlaylist widget to another requests bwAttachments_MusicPlaylist widget. event.dataTransfer: ' + JSON.stringify(event.dataTransfer));

                    //
                    // These are files dragged within the browser window. For example, from one request bwAttachments_MusicPlaylist widget to another requests bwAttachments_MusicPlaylist widget.
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

                        console.log('In bwAttachments_MusicPlaylist.js.dodrop(). Yes the user is dragging and dropping an attachment from one request to another. This is a CUT operation... imageData: ' + imageData);

                        var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
                        var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');
                        var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');

                        var tmp1 = imageData.split(strUrlWithWorkflowAppId)[1];
                        var bwBudgetRequestId_Origin = tmp1.split('/')[0];
                        var fileNameToCutAndPaste_Thumbnail = tmp1.split('/')[1].split('?')[0];

                        var form = $(thiz.element).closest('.budgetrequestform')[0];
                        var bwBudgetRequestId_Destination = $(form)[0].getAttribute('bwbudgetrequestid');

                        console.log('In bwAttachments_MusicPlaylist.js.dodrop(). fileNameToCutAndPaste_Thumbnail: ' + fileNameToCutAndPaste_Thumbnail + ', bwBudgetRequestId_Origin: ' + bwBudgetRequestId_Origin + ', bwBudgetRequestId_Destination: ' + bwBudgetRequestId_Destination);
                        //displayAlertDialog('In bwAttachments_MusicPlaylist.js.dodrop(). fileNameToCutAndPaste_Thumbnail: ' + fileNameToCutAndPaste_Thumbnail + ', bwBudgetRequestId_Origin: ' + bwBudgetRequestId_Origin + ', bwBudgetRequestId_Destination: ' + bwBudgetRequestId_Destination);

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

                                        var msg = 'Error in bwAttachments_MusicPlaylist.js.dodrop.bwCutAndPaste_Attachment(). ' + results.status + ': ' + results.message;
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
                                            $(forms[i]).find('.bwAttachments_MusicPlaylist').bwAttachments_MusicPlaylist('renderAndPopulateAttachments'); // Call this method for this specific widget. This will re-generate the gold colored drag-and-drop section... etc...
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
                                    console.log('Exception in bwAttachments_MusicPlaylist.js.dodrop():2: ' + e.message + ', ' + e.stack);
                                    displayAlertDialog('Exception in bwAttachments_MusicPlaylist.js.dodrop():2: ' + e.message + ', ' + e.stack);
                                    $(this.element).find('#newrequestattachments')[0].innerHTML = 'Exception in bwAttachments_MusicPlaylist.js.dodrop():2: ' + e.message + ', ' + e.stack;
                                }
                            },
                            error: function (data, errorCode, errorMessage) {
                                $('#divWorkingOnItDialog').dialog('close'); // Close the "Working on it..." dialog.
                                console.log('Error in bwAttachments_MusicPlaylist.js.dodrop(): ' + errorMessage);
                                debugger;
                                if (errorMessage == 'timeout') {
                                    displayAlertDialog('The file server could not be contacted. Please try again in a few minutes.');
                                } else {
                                    displayAlertDialog('Error in bwAttachments_MusicPlaylist.js.dodrop(): ' + errorMessage);
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

                                        alert('Error in bwAttachments_MusicPlaylist.js.dodrop(). Cannot find element: inputFile_' + bwBudgetRequestId + ', imgSrc2: ' + imgSrc2);







                                    }

                                    var tst = new DataTransfer();
                                    tst.items.add(f);
                                    fileInput.files = tst.files;

                                    console.log('fileInput.files.length: ' + fileInput.files.length);

                                    //imgElement.remove(); // Remove the img element which is displaying the pasted image.

                                    //thiz.uploadAttachment('newrequestattachments', requestDialogId, bwBudgetRequestId);
                                    thiz.uploadAttachment('newrequestattachments', null, bwBudgetRequestId);

                                } catch (e) {
                                    alert('Exception in bwAttachments_MusicPlaylist.js.dodrop(). xcx215343: ' + e.message + ', ' + e.stack);

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

                displayAlertDialog('Error in bwAttachments_MusicPlaylist.js.dodrop(). Could not find a valid DataTransfer object.');

            }



            //alert('In bwAttachments_MusicPlaylist.js.dodrop().');

            //alert('In bwAttachments_MusicPlaylist.js.dodrop(). dt.types: ' + dt.types);

            //if ((dt.types.indexOf('text/uri-list') > -1) && (dt.types.indexOf('Files') > -1)) {

            //    alert('Urls and Files.');

            //    //
            //    // These are files dragged within the browser window. For example, from one request bwAttachments_MusicPlaylist widget to another requests bwAttachments_MusicPlaylist widget.
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

            //        console.log('In bwAttachments_MusicPlaylist.js.renderAndPopulateAttachments.dropzone.drop(). Yes the user is dragging and dropping an attachment from one request to another. This is a CUT operation... imageData: ' + imageData);

            //        var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            //        var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');
            //        var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');

            //        var tmp1 = imageData.split(strUrlWithWorkflowAppId)[1];
            //        var bwBudgetRequestId_Origin = tmp1.split('/')[0];
            //        var fileNameToCutAndPaste_Thumbnail = tmp1.split('/')[1].split('?')[0];

            //        var form = $(thiz.element).closest('.budgetrequestform')[0];
            //        var bwBudgetRequestId_Destination = $(form)[0].getAttribute('bwbudgetrequestid');

            //        console.log('DEV: READY TO CALL WEB SERVICE [bwCutAndPaste_Attachment]. In bwAttachments_MusicPlaylist.js.renderAndPopulateAttachments.dropzone.drop(). fileNameToCutAndPaste_Thumbnail: ' + fileNameToCutAndPaste_Thumbnail + ', bwBudgetRequestId_Origin: ' + bwBudgetRequestId_Origin + ', bwBudgetRequestId_Destination: ' + bwBudgetRequestId_Destination);

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

            //                        var msg = 'Error in bwAttachments_MusicPlaylist.js.renderAndPopulateAttachments.dropzone.drop.bwCutAndPaste_Attachment(). ' + results.status + ': ' + results.message;
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
            //                            $(forms[i]).find('.bwAttachments_MusicPlaylist').bwAttachments_MusicPlaylist('renderAndPopulateAttachments'); // Call this method for this specific widget. This will re-generate the gold colored drag-and-drop section... etc...
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
            //                    console.log('Exception in bwAttachments_MusicPlaylist.js.renderAndPopulateAttachments.dropzone.drop():2: ' + e.message + ', ' + e.stack);
            //                    displayAlertDialog('Exception in bwAttachments_MusicPlaylist.js.renderAndPopulateAttachments.dropzone.drop():2: ' + e.message + ', ' + e.stack);
            //                    $(this.element).find('#newrequestattachments')[0].innerHTML = 'Exception in bwAttachments_MusicPlaylist.js.renderAndPopulateAttachments.dropzone.drop():2: ' + e.message + ', ' + e.stack;
            //                }
            //            },
            //            error: function (data, errorCode, errorMessage) {
            //                $('#divWorkingOnItDialog').dialog('close'); // Close the "Working on it..." dialog.
            //                console.log('Error in bwAttachments_MusicPlaylist.js.renderAndPopulateAttachments.dropzone.drop(): ' + errorMessage);
            //                debugger;
            //                if (errorMessage == 'timeout') {
            //                    displayAlertDialog('The file server could not be contacted. Please try again in a few minutes.');
            //                } else {
            //                    displayAlertDialog('Error in bwAttachments_MusicPlaylist.js.renderAndPopulateAttachments.dropzone.drop(): ' + errorMessage);
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

            //                        alert('Error in bwAttachments_MusicPlaylist.js.renderAndPopulateAttachments.dropzone.drop(). Cannot find element: inputFile_' + bwBudgetRequestId + ', imgSrc2: ' + imgSrc2);







            //                    }

            //                    var tst = new DataTransfer();
            //                    tst.items.add(f);
            //                    fileInput.files = tst.files;

            //                    console.log('fileInput.files.length: ' + fileInput.files.length);

            //                    //imgElement.remove(); // Remove the img element which is displaying the pasted image.

            //                    //thiz.uploadAttachment('newrequestattachments', requestDialogId, bwBudgetRequestId);
            //                    thiz.uploadAttachment('newrequestattachments', null, bwBudgetRequestId);

            //                } catch (e) {
            //                    alert('Exception in bwAttachments_MusicPlaylist.js.renderAndPopulateAttachments.dropzone.drop(). xcx215343: ' + e.message + ', ' + e.stack);

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

            //    console.log('In bwAttachments_MusicPlaylist.js.renderAndPopulateAttachments.dropzone.drop(). No base64 in the img src or this element. It must be a http reference... imgSrc: ' + imgSrc);

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

            //        console.log('In bwAttachments_MusicPlaylist.js.renderAndPopulateAttachments.dropzone.drop(). Yes the user is dragging and dropping an attachment from one request to another. This is a CUT operation... imgSrc: ' + imgSrc);

            //        var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            //        var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');
            //        var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');

            //        var tmp1 = imgSrc.split(strUrlWithWorkflowAppId)[1];
            //        var bwBudgetRequestId_Origin = tmp1.split('/')[0];
            //        var fileNameToCutAndPaste_Thumbnail = tmp1.split('/')[1].split('?')[0];

            //        var form = $(thiz.element).closest('.budgetrequestform')[0];
            //        var bwBudgetRequestId_Destination = $(form)[0].getAttribute('bwbudgetrequestid');

            //        console.log('DEV: READY TO CALL WEB SERVICE [bwCutAndPaste_Attachment]. In bwAttachments_MusicPlaylist.js.renderAndPopulateAttachments.dropzone.drop(). fileNameToCutAndPaste_Thumbnail: ' + fileNameToCutAndPaste_Thumbnail + ', bwBudgetRequestId_Origin: ' + bwBudgetRequestId_Origin + ', bwBudgetRequestId_Destination: ' + bwBudgetRequestId_Destination);

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

            //                        var msg = 'Error in bwAttachments_MusicPlaylist.js.renderAndPopulateAttachments.dropzone.drop.bwCutAndPaste_Attachment(). ' + results.status + ': ' + results.message;
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
            //                            $(forms[i]).find('.bwAttachments_MusicPlaylist').bwAttachments_MusicPlaylist('renderAndPopulateAttachments'); // Call this method for this specific widget. This will re-generate the gold colored drag-and-drop section... etc...
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
            //                    console.log('Exception in bwAttachments_MusicPlaylist.js.renderAndPopulateAttachments.dropzone.drop():2: ' + e.message + ', ' + e.stack);
            //                    displayAlertDialog('Exception in bwAttachments_MusicPlaylist.js.renderAndPopulateAttachments.dropzone.drop():2: ' + e.message + ', ' + e.stack);
            //                    $(this.element).find('#newrequestattachments')[0].innerHTML = 'Exception in bwAttachments_MusicPlaylist.js.renderAndPopulateAttachments.dropzone.drop():2: ' + e.message + ', ' + e.stack;
            //                }
            //            },
            //            error: function (data, errorCode, errorMessage) {
            //                $('#divWorkingOnItDialog').dialog('close'); // Close the "Working on it..." dialog.
            //                console.log('Error in bwAttachments_MusicPlaylist.js.renderAndPopulateAttachments.dropzone.drop(): ' + errorMessage);
            //                debugger;
            //                if (errorMessage == 'timeout') {
            //                    displayAlertDialog('The file server could not be contacted. Please try again in a few minutes.');
            //                } else {
            //                    displayAlertDialog('Error in bwAttachments_MusicPlaylist.js.renderAndPopulateAttachments.dropzone.drop(): ' + errorMessage);
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

            //                        alert('Error in bwAttachments_MusicPlaylist.js.renderAndPopulateAttachments.dropzone.drop(). Cannot find element: inputFile_' + bwBudgetRequestId + ', imgSrc2: ' + imgSrc2);







            //                    }

            //                    var tst = new DataTransfer();
            //                    tst.items.add(f);
            //                    fileInput.files = tst.files;

            //                    console.log('fileInput.files.length: ' + fileInput.files.length);

            //                    //imgElement.remove(); // Remove the img element which is displaying the pasted image.

            //                    //thiz.uploadAttachment('newrequestattachments', requestDialogId, bwBudgetRequestId);
            //                    thiz.uploadAttachment('newrequestattachments', null, bwBudgetRequestId);

            //                } catch (e) {
            //                    alert('Exception in bwAttachments_MusicPlaylist.js.renderAndPopulateAttachments.dropzone.drop(). xcx215343: ' + e.message + ', ' + e.stack);

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

    renderAndPopulateAttachments: function () {
        try {
            var thiz = this;
            console.log('In bwAttachments_MusicPlaylist.js.renderAndPopulateAttachments().');
            //alert('In bwAttachments_MusicPlaylist.js.renderAndPopulateAttachments().');

            var requestDialogId;

            var bwBudgetRequestId;
            var bwRequestTitle;
            var bwRequestTypeId;

            try {
                bwBudgetRequestId = $(this.element).closest('#budgetrequestform')[0].getAttribute('bwbudgetrequestid');
                bwRequestTitle = $(this.element).closest('#budgetrequestform')[0].getAttribute('bwrequesttitle');

                //var bwRequestTitle = $(this.element).closest('#budgetrequestform')[0].getAttribute('bwrequesttitle');
                bwRequestTypeId = $(this.element).closest('#budgetrequestform')[0].getAttribute('bwrequesttypeid');

            } catch (e) {

                bwBudgetRequestId = 'standalone';
                bwRequestTitle = 'standalone';
                bwRequestTypeId = 'standalone';

            }

            if (!bwBudgetRequestId) {

                alert('Error in bwAttachments_MusicPlaylist.js.xx(). Unexpected value for bwBudgetRequestId: ' + bwBudgetRequestId);
                displayAlertDialog('Error in bwAttachments_MusicPlaylist.js.xx(). Unexpected value for bwBudgetRequestId: ' + bwBudgetRequestId);

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
                html += '       <tr xcx="xcx21342526-1" id="xcx21342526-1" class="xdTableOffsetRow xdTableOffsetRow-editor" id="toolboxdraggablerow_2" draggable="true" bwwidgetname="bwAttachments_MusicPlaylist">';
                html += '           <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px;height:100%;">';
                html += '               <table style="height:100%;">';
                html += '                   <tr style="height:1%;">';
                html += '                       <td style="vertical-align:top;">';
                html += '                           <span class="xdlabel" style="color:black;">';
                html += '                               Music Playlist:';
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

                if (/(iPad|iPhone|iPod)/g.test(navigator.userAgent)) {
                    // Don't display this section on iPad, iPhone, iPod.
                } else {

                    var inputFileElementId = 'inputFile_' + bwBudgetRequestId;
                    //html += '                           <table id="dropzone1" onclick="document.getElementById(\'' + inputFileElementId + '\').click();" contenteditable="true" style="height:100%;border:1px solid goldenrod;background-color:#f6f6f6;color:gray;font-size:10pt;cursor:pointer;">';
                    //html += '                               <tr>';
                    //html += '                                   <td style="vertical-align:middle;">';
                    //html += '                                       <span style="color:goldenrod;">Click, right-click, or drag-and-drop here to upload files.<img src="/images/upload_arrow_icon.png" style="width:130px;text-align:center;" /></span>';
                    //html += '                                   </td>';
                    //html += '                               </tr>';
                    //html += '                           </table>';
                    //html += '                           <br /><br />';
                    //html += '                           <table id="dropzone1xx" onclick="$(\'.bwAttachments_MusicPlaylist\').bwAttachments_MusicPlaylist(\'downloadZippedFiles\', \'' + bwBudgetRequestId + '\', \'' + bwRequestTitle + '\');" contenteditable="true" style="height:100%;border:1px solid goldenrod;background-color:#f6f6f6;color:gray;font-size:10pt;cursor:pointer;">';
                    //html += '                               <tr>';
                    //html += '                                   <td style="vertical-align:middle;">';
                    //html += '                                       <span style="color:goldenrod;">Click to download these files as a zip archive.<img src="/images/download_arrow_icon.png" style="width:130px;text-align:center;" /></span>';
                    //html += '                                   </td>';
                    //html += '                               </tr>';
                    //html += '                           </table>';


                    html += '                           <br /><br />';

                    //
                    // allow="clipboard-read;clipboard-write;" MAY BE VERY IMPORTANT!!!!!!!!!! 11-27-2023 3-20pm ast.
                    //
                    html += '                           <div id="bwAttachments_MusicPlaylist_dropzone_' + bwBudgetRequestId + '" allow="clipboard-read;clipboard-write;" onclick="document.getElementById(\'' + inputFileElementId + '\').click();" contenteditable="true" style="height:180px;border:1px solid goldenrod;background-color:#f6f6f6;color:gray;font-size:10pt;cursor:pointer;background-image:url(\'/images/upload_arrow_icon.png\');background-repeat: no-repeat;background-size: 130px;text-align: center;padding: 5px; background-position: center bottom;" >';
                    html += '                               <div style="color:goldenrod;">Click, right-click, or drag-and-drop to upload files.</div>';
                    html += '                           </div>';


                    if (bwBudgetRequestId != 'standalone') { // 4-19-2024.

                        html += '                           <br /><br />';

                        html += '<div id="bwAttachment_divClickToDownloadTheseFilesAsAZipArchive" style="display:none;">';
                        html += '                           <div onclick="$(\'.bwAttachments_MusicPlaylist\').bwAttachments_MusicPlaylist(\'downloadZippedFiles\', \'' + bwBudgetRequestId + '\', \'' + bwRequestTitle + '\');" contenteditable="false" style="height:180px;border:1px solid goldenrod;background-color:#f6f6f6;color:gray;font-size:10pt;cursor:pointer;background-image:url(\'/images/download_arrow_icon.png\');background-repeat: no-repeat;background-size: 130px;text-align: center;padding: 5px; background-position: center bottom;" >';
                        html += '                               <div style="color:goldenrod;">Click to download these files as a zip archive.</div>';
                        html += '                           </div>';
                        html += '</div>';

                    }

                }

                html += '                       </td>';
                html += '                   </tr>';
                html += '               </table>';
                html += '           </td>';
                html += '           <td class="xdTableOffsetCellComponent" style="white-space:nowrap;text-align:left; VERTICAL-ALIGN: top; PADDING-LEFT: 5px; PADDING-RIGHT: 22px;">';

                // ABILITY TO DROP AN ATTACHMENT FROM ANOTHE isplayed request dialog! 4-8-2020
                //html += '           <div id="dropzone1" style="width:365px;height:55px;text-align:center;background-color:#f6f6f6;padding-left:0;">';
                html += '               <div style="width:365px;height:55px;text-align:center;background-color:#f6f6f6;padding-left:0;">';
                html += '                   <label for="inputFile_' + bwBudgetRequestId + '" class="divSignInButton" style="font-style:normal;width:100%;height:100%;text-align:center;line-height:1.65em;font-size:23pt;border-radius: 5px 5px 5px 5px;display:inline-block;padding-left:0;padding-top:0;">Choose file(s)...&nbsp;&nbsp;&nbsp;&#128193;</label>';

                html += '<form id="uploadForm_' + bwBudgetRequestId + '" action="/" enctype="multipart/form-data" method="post">';

                // These empty fields need to be here so they are forced to get sent to the web service before the file(s). This is important because we need these values to determine where we are saving the files.
                html += '<input type="hidden" name="bwWorkflowAppId" value="" />';
                html += '<input type="hidden" name="bwBudgetRequestId" value="" />';
                html += '<input type="hidden" name="bwParticipantId" value="" />';
                html += '<input type="hidden" name="bwParticipantEmail" value="" />';
                html += '<input type="hidden" name="bwParticipantFriendlyName" value="" />';
                html += '<input type="hidden" name="bwActiveStateIdentifier" value="" />';
                html += '<input type="hidden" name="Filename" value="" />';
                html += '<input type="hidden" name="Description" value="" />';
                html += '<input type="hidden" name="ConvertToAPdf" value="" />';
                //html += '<input type="hidden" name="Size" value="" />';
                //html += '<input type="hidden" name="Birthtime" value="" />';

                //
                // Changed to multiple 9-8-2023.
                //
                // The "multiple" attribute in the input/file element below turns on the ability to select multiple items for the upload. THIS IS TURNED OFF FOR THE MOMENT UNTILL WE UPGRADE THE WEB SERVICE ETC. 4-15-2023.
                //
                console.log('The "multiple" attribute in the input/file element below turns on the ability to select multiple items for the upload. THIS IS TURNED OFF FOR THE MOMENT UNTILL WE UPGRADE THE WEB SERVICE ETC. 4-15-2023.');
                html += '<input type="file" multiple name="multerFileUploadIdentifier_original" id="inputFile_' + bwBudgetRequestId + '" class="upload" style="visibility:hidden;" onchange="$(\'.bwAttachments_MusicPlaylist:first\').bwAttachments_MusicPlaylist(\'uploadAttachment\',\'newrequestattachments\', \'' + requestDialogId + '\', \'' + bwBudgetRequestId + '\');" />';
                //html += '<input type="file" name="multerFileUploadIdentifier_original" id="inputFile_' + bwBudgetRequestId + '" class="upload" style="visibility:hidden;" onchange="$(\'.bwAttachments_MusicPlaylist:first\').bwAttachments_MusicPlaylist(\'uploadAttachment\',\'newrequestattachments\', \'' + requestDialogId + '\', \'' + bwBudgetRequestId + '\');" />';





                //alert('Rendering onchange .bwAttachments_MusicPlaylist:closest uploadAttachment().')

                //html += '<input type="file" name="multi-files" accept="image" multiple>';
                //html += '<input type="submit" value="Upload">';

                html += '</form>  ';

                html += '           </div>';


                // "Continue to play..." checkbox.
                html += '           <input checked="checked" style="transform: scale(3);" class="continueToPlayCheckbox" id="' + requestDialogId + '_buttonEmailAttachmentsExternally" type="checkbox" style="display:none;padding:5px 10px 5px 10px;" value="Continue to play..." title="" ';
                html += '               onclick="$(\'.bwAttachments_MusicPlaylist:first\').bwAttachments_MusicPlaylist(\'continueToPlay\', this);" />';
                html == '&nbsp;Continue to play...'



                html += '           <br />';
                html += '           <br />';


                html += '           <p id="newrequestattachments" xcx="xcx448-1-3" style="word-break:break-all;white-space:normal;"></p>';


                html += '           <br />';
                html += '           <br />';





                // "Email attachments externally..." button.
                html += '           <input id="' + requestDialogId + '_buttonEmailAttachmentsExternally" type="button" style="display:none;padding:5px 10px 5px 10px;" value="Email attachment(s) externally..." title="Email attachments to a customer using your internet facing url, which is configured in the organization settings." class="BwButton350" ';
                html += '               onclick="$(\'.bwAttachments_MusicPlaylist:first\').bwAttachments_MusicPlaylist(\'copyAttachments\',\'newrequestattachments\', \'' + requestDialogId + '\', \'' + bwBudgetRequestId + '\', \'' + bwRequestTitle + '\', \'' + bwRequestTypeId + '\');" />';

                html += '           <br />';
                html += '           <br />';

                // "OCR attachments..." button.
                html += '           <input id="' + requestDialogId + '_buttonOCRAttachments" type="button" style="display:none;padding:5px 10px 5px 10px;" value="OCR attachment(s)..." title="Perform OCR on multiple attachments at one time." class="BwButton350" ';
                html += '               onclick="$(\'.bwAttachments_MusicPlaylist:first\').bwAttachments_MusicPlaylist(\'performOCR_MultipleImages\', \'' + requestDialogId + '\', \'' + bwBudgetRequestId + '\', \'' + bwRequestTitle + '\', \'' + bwRequestTypeId + '\');" />';

                html += '           <br />';
                html += '           <br />';

                // "CHATGPT attachments..." button. THIS IS WHERE IT IS HAPPENING. 10-20-2024.
                html += '           <input id="' + requestDialogId + '_buttonCHATGPTAttachments" type="button" style="display:inline;padding:5px 10px 5px 10px;" value="CHATGPT attachment(s)..." title="Perform CHATGPT on multiple attachments at one time." class="BwButton350" ';
                html += '               onclick="$(\'.bwAttachments_MusicPlaylist:first\').bwAttachments_MusicPlaylist(\'performCHATGPT_MultipleImages\', \'' + requestDialogId + '\', \'' + bwBudgetRequestId + '\', \'' + bwRequestTitle + '\', \'' + bwRequestTypeId + '\');" />';


                html += '                            </td>';
                html += '                        </tr>';
                html += '                    </tbody>';
                html += '</table>';

                this.element.html(html);

                // Render the html.
                if (this.options.inFormsEditor != true) {
                    // THIS IS VERY IMPORTANT AND NEEDS TO BE IN EVERY WIDGET!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 7-12-2020
                    // Even though the widget regenerates itself (re-renders), the parent TR tag gets missed!!! Therefore we have to handle getting rid of our form editor draggable attribute here.
                    //this.element.closest('tr').removeAttr('draggable');


                    //debugger;
                    //var element = $('.bwAttachments_MusicPlaylist:first').find('.xdTableOffsetRow');

                    $('.bwAttachments_MusicPlaylist:first').find('.xdTableOffsetRow').removeAttr('draggable'); // 4-19-2024. 
                    $('.bwAttachments_MusicPlaylist:first').find('.xdTableOffsetRow').removeClass('xdTableOffsetRow-editor');

                }




                $(this.element).find('#newrequestattachments')[0].innerHTML = '<span style="color:tomato;"></span>';

                var dropzone = document.getElementById('bwAttachments_MusicPlaylist_dropzone_' + bwBudgetRequestId);


                //var rect = dropzone.getBoundingClientRect();
                //var height = rect.height;
                //var width = rect.width;

                //alert('xcx1231231412 dropzone size width: ' + width + ', height: ' + height + ', rect: ' + JSON.stringify(rect));

                //var input = document.createElement('input');
                //input.type = 'file';
                //input.style.height = height;
                //input.style.width = width;
                //dropzone.appendChild(input);


                //inp.onpaste = evt =>
                //    console.log(evt.clipboardData.getData('text'));

                //<input id="inp">


                //.input-element{
                //    height: 100px!important;
                //    width: 400px;
                //}


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

                dropzone.addEventListener('drop', function (e) {
                    try {
                        console.log('In renderAndPopulateAttachments.dropzone.drop().');
                        displayAlertDialog_Persistent('In renderAndPopulateAttachments.dropzone.drop(). xcx23124.');
                        e.preventDefault();

                        var gotData;
                        if (e.clipboardData) {
                            console.log('In renderAndPopulateAttachments.dropzone.drop(). Object is event.clipboardData.');
                            gotData = true;
                        } else if (e.dataTransfer) {
                            console.log('In renderAndPopulateAttachments.dropzone.drop(). Object is event.dataTransfer.');
                            gotData = true;
                        } else if (window.clipboardData) {
                            console.log('In renderAndPopulateAttachments.dropzone.drop(). Object is window.clipboardData.');
                            gotData = true;
                        } else {

                            if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
                                alert('FIREFOX BROWSER CANNOT DRAG-AND-DROP EXTERNAL FILES. THERE IS A WORK-AROUND: Please right click on your source file, and choose "COPY". Subsequently, right click here and choose "PASTE".');
                            } else {
                                alert('Error in bwAttachments_MusicPlaylist.js.dropzone.drop(). Could not find a valid DataTransfer object. e: ' + JSON.stringify(e) + ', navigator.userAgent: ' + navigator.userAgent);
                            }

                        }

                        if (gotData == true) {
                            thiz.dodrop(e, bwBudgetRequestId);
                        } else {
                            alert('Error in bwAttachments_MusicPlaylist.js.dropzone.drop(). Could not find a valid DataTransfer object.');
                        }

                    } catch (e) {
                        var msg = 'Exception in bwAttachments_MusicPlaylist.js.dropzone.drop(): ' + e.message + ', ' + e.stack;
                        console.log(msg);
                        alert(msg);
                    }
                });

                dropzone.addEventListener('paste', function (e) {
                    try {
                        console.log('In renderAndPopulateAttachments.dropzone.paste().');
                        e.preventDefault();

                        var gotData;
                        if (e.clipboardData) {
                            console.log('In renderAndPopulateAttachments.dropzone.paste(). Object is event.clipboardData.');
                            gotData = true;
                        } else if (e.dataTransfer) {
                            console.log('In renderAndPopulateAttachments.dropzone.paste(). Object is event.dataTransfer.');
                            gotData = true;
                        } else if (window.clipboardData) {
                            console.log('In renderAndPopulateAttachments.dropzone.paste(). Object is window.clipboardData.');
                            gotData = true;
                        } else {

                            if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
                                alert('FIREFOX BROWSER CANNOT DRAG-AND-DROP EXTERNAL FILES. THERE IS A WORK-AROUND: Please right click on your source file, and choose "COPY". Subsequently, right click here and choose "PASTE".');
                            } else {
                                alert('Error in bwAttachments_MusicPlaylist.js.dropzone.paste(). Could not find a valid DataTransfer object. e: ' + JSON.stringify(e) + ', navigator.userAgent: ' + navigator.userAgent);
                            }

                        }

                        if (gotData == true) {
                            thiz.dodrop(e, bwBudgetRequestId);
                        } else {
                            alert('Error in bwAttachments_MusicPlaylist.js.dropzone.paste(). Could not find a valid DataTransfer object.');
                        }

                    } catch (e) {
                        var msg = 'Exception in bwAttachments_MusicPlaylist.js.dropzone.paste(): ' + e.message + ', ' + e.stack;
                        console.log(msg);
                        alert(msg);
                    }
                });


                //var dropzone = $(this.element).find('#dropzone1');
                //$(dropzone).off('paste').on('paste', function (e) {
                //    try {
                //        console.log('paste');
                //        alert('xcx213123. paste');

                //        setTimeout(function () {
                //            try {
                //                var imgElement = $(thiz.element).find('#dropzone1 img');
                //                var imgSrc = $(thiz.element).find('#dropzone1 img')[0].src;

                //                var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                //                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                //                    return v.toString(16);
                //                });

                //                // https://bl.ocks.org/nolanlawson/0eac306e4dac2114c752 
                //                var dataUrl = imgSrc.split(',');
                //                var base64 = dataUrl[1];

                //                if (!base64) {

                //                    console.log('In bwAttachments_MusicPlaylist.js.renderAndPopulateAttachments.dropzone.paste(). No base64 in the img src or this element. It must be a http reference... imgSrc: ' + imgSrc);

                //                    //
                //                    // Here we check to see if the URL is an internal URL. If so, we are copying a file from one request, and pasting it into another.
                //                    // In other words, this means the user has dragged a file from one request, to another request. We will make this a CUT operation, because it seems this is th euse case.
                //                    // Use case: A receipt image is attached to a request type of "Invoice". The user drag-and-drops it to another request. Therefore a CUT operation.
                //                    //

                //                    // Example imgSrc: https://shareandcollaborate.com/_files/c48535a4-9a6b-4b95-9d67-c6569e9695d8/8b6e9b8f-5b06-4cd7-ae10-340242abd47f/receipt%20-%2010-11-2023%20-%20breakfast%20-%20a%20whopper%20from%20burger%20king.jpg_320px_.jpg?v=5f511b64-b8ad-4bcf-86bc-398223003556&ActiveStateIdentifier=4710a0b6-aa6e-4414-b593-db8a37326558

                //                    var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

                //                    var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                //                    var strUrlWithWorkflowAppId = 'https://shareandcollaborate.com/_files/' + workflowAppId + '/';
                //                    var strActiveStateIdentifierInUrl = '&ActiveStateIdentifier=' + activeStateIdentifier;

                //                    if ((imgSrc.indexOf(strUrlWithWorkflowAppId) > -1) && (imgSrc.indexOf(strActiveStateIdentifierInUrl) > -1)) {

                //                        //
                //                        // Yes, the user is dragging and dropping an attachment from one request to another. 10-22-2023.
                //                        //
                //                        // CALL THIS METHOD:
                //                        // router.put('/_files/bwCutAndPaste_Attachment', function (request, response) {
                //                        //

                //                        console.log('In bwAttachments_MusicPlaylist.js.renderAndPopulateAttachments.dropzone.drop(). Yes the user is dragging and dropping an attachment from one request to another. This is a CUT operation... imgSrc: ' + imgSrc);

                //                        var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
                //                        var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');
                //                        var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');

                //                        var tmp1 = imgSrc.split(strUrlWithWorkflowAppId)[1];
                //                        var bwBudgetRequestId = tmp1.split('/')[0];
                //                        var fileNameToCutAndPaste = tmp1.split('/')[1].split('?')[0];

                //                        alert('In bwAttachments_MusicPlaylist.js.renderAndPopulateAttachments.dropzone.drop(). xcx12132123-2. tmp1: ' + tmp1 + ', bwBudgetRequestId: ' + bwBudgetRequestId + ', fileNameToCutAndPaste: ' + fileNameToCutAndPaste);

                //                        var data = {
                //                            bwParticipantId_LoggedIn: participantId,
                //                            bwActiveStateIdentifier: activeStateIdentifier,
                //                            bwWorkflowAppId_LoggedIn: workflowAppId,

                //                            bwWorkflowAppId: workflowAppId,

                //                            FileNameToCutAndPaste: fileNameToCutAndPaste,
                //                            bwBudgetRequestId_Origin: bwBudgetRequestId,
                //                            bwBudgetRequestId_Destination: bwBudgetRequestId,

                //                            bwParticipantId: participantId,
                //                            bwParticipantFriendlyName: participantFriendlyName,
                //                            bwParticipantEmail: participantEmail
                //                        };

                //                        var operationUri = thiz.options.operationUriPrefix + '_files/' + 'bwCutAndPaste_Attachment'; // _files allows us to use nginx to route these to a dedicated file server.
                //                        $.ajax({
                //                            url: operationUri,
                //                            type: 'PUT',
                //                            data: data,
                //                            headers: { "Accept": "application/json; odata=verbose" },
                //                            success: function (data) {
                //                                try {




                //                                    alert('xcx123123132 paste. Unfinished code here....');





                //                                } catch (e) {
                //                                    console.log('Exception in bwAttachments_MusicPlaylist.js.renderAndPopulateAttachments.dropzone.drop():2: ' + e.message + ', ' + e.stack);
                //                                    displayAlertDialog('Exception in bwAttachments_MusicPlaylist.js.renderAndPopulateAttachments.dropzone.drop():2: ' + e.message + ', ' + e.stack);
                //                                    $(this.element).find('#newrequestattachments')[0].innerHTML = 'Exception in bwAttachments_MusicPlaylist.js.renderAndPopulateAttachments.dropzone.drop():2: ' + e.message + ', ' + e.stack;
                //                                }
                //                            },
                //                            error: function (data, errorCode, errorMessage) {
                //                                $('#divWorkingOnItDialog').dialog('close'); // Close the "Working on it..." dialog.
                //                                console.log('Error in bwAttachments_MusicPlaylist.js.renderAndPopulateAttachments.dropzone.drop(): ' + errorMessage);
                //                                debugger;
                //                                if (errorMessage == 'timeout') {
                //                                    displayAlertDialog('The file server could not be contacted. Please try again in a few minutes.');
                //                                } else {
                //                                    displayAlertDialog('Error in bwAttachments_MusicPlaylist.js.renderAndPopulateAttachments.dropzone.drop(): ' + errorMessage);
                //                                }
                //                            }
                //                        });













                //                    } else {










                //                        fetch(imgSrc)
                //                            .then(function (res) {
                //                                try {
                //                                    res.blob();
                //                                } catch (e) {
                //                                    alert('Exception xcx21312312 ' + e.message + ', ' + e.stack);

                //                                    imgElement.remove(); // Remove the img element which is displaying the pasted image.
                //                                }
                //                            })
                //                            .then(function (blob) {
                //                                try {
                //                                    const f = new File([blob], 'dot.png', blob);

                //                                    var fileInput = document.getElementById('inputFile_' + bwBudgetRequestId);

                //                                    var tst = new DataTransfer();
                //                                    tst.items.add(f);
                //                                    fileInput.files = tst.files;

                //                                    console.log('fileInput.files.length: ' + fileInput.files.length);

                //                                    imgElement.remove(); // Remove the img element which is displaying the pasted image.

                //                                    thiz.uploadAttachment('newrequestattachments', requestDialogId, bwBudgetRequestId);

                //                                } catch (e) {
                //                                    alert('Exception in bwAttachments_MusicPlaylist.js.renderAndPopulateAttachments.dropzone.drop(). xcx215343: ' + e.message + ', ' + e.stack);

                //                                    imgElement.remove(); // Remove the img element which is displaying the pasted image.
                //                                }

                //                            })
                //                            .catch(function (e) {

                //                                alert('Exception in bwAttachments_MusicPlaylist.js.renderAndPopulateAttachments.dropzone.drop(). from psomise xcx87987 ' + e + ', Exception when fetching "' + imgSrc + '".');
                //                                imgElement.remove(); // Remove the img element which is displaying the pasted image.

                //                            });

                //                    }

                //                } else {

                //                    var mime = dataUrl[0].match(/:(.*?);/)[1];
                //                    var bin = atob(base64);
                //                    var length = bin.length;
                //                    // From http://stackoverflow.com/questions/14967647/ (continues on next line)
                //                    // encode-decode-image-with-base64-breaks-image (2013-04-21)
                //                    var buf = new ArrayBuffer(length);
                //                    var arr = new Uint8Array(buf);
                //                    bin
                //                        .split('')
                //                        .forEach(function (e, i) { arr[i] = e.charCodeAt(0) });


                //                    var f = new File([buf], guid, { type: mime }); // note: [buf] //let f = new File([buf],'filename',{type:mime}); // note: [buf]
                //                    var blobUrl = URL.createObjectURL(f);

                //                    imgElement.remove(); // Remove the img element which is displaying the pasted image.

                //                    var fileInput = document.getElementById('inputFile_' + bwBudgetRequestId);

                //                    var tst = new DataTransfer();
                //                    tst.items.add(f);

                //                    //
                //                    // When we get here, we may have a drag-and-dropped file which was dropped on the bwAttachments_MusicPlaylist form widget... we need to get it by Blob "CreateUrl()" maybe....????
                //                    //

                //                    var msg = 'When we get here, we may have a drag-and-dropped file which was dropped on the bwAttachments_MusicPlaylist form widget... we need to get it by Blob "CreateUrl()" maybe....????';
                //                    displayAlertDialog_Persistent(msg);

                //                    fileInput.files = tst.files;

                //                    console.log('fileInput.files.length: ' + fileInput.files.length);

                //                    thiz.uploadAttachment('newrequestattachments', requestDialogId, bwBudgetRequestId);
                //                }

                //            } catch (e) {
                //                alert('Exception in xcx1214124-2: ' + e.message + ', ' + e.stack);
                //            }
                //        }, 1000);

                //    } catch (e) {
                //        alert('Exception xcx123124235: ' + e.message + ', ' + e.stack);
                //    }
                //});


                //$(dropzone).off('drop').on('drop', function (e) {
                //    try {
                //        console.log('In bwAttachments_MusicPlaylist.js.renderAndPopulateAttachments.dropzone.drop().');

                //        var dt = e.dataTransfer;
                //        var files = dt.files;

                //        alert('in drop xcx12312 files.length: ' + files.length);

                //        /////////// experimental 11-27-2023
                //        //e.dataTransfer.dropEffect = 'copy';

                //        // e.dataTransfer.files.length
                //        // DataTransfer.items

                //        displayAlertDialog('xcx23123 drop e: ' + JSON.stringify(e) + '. e.dataTransfer.items: ' + JSON.stringify(e.dataTransfer.items)); // var files = e.dataTransfer.files;
                //        e.preventDefault();
                //        /////////// end experimental

                //        setTimeout(function () {
                //            try {
                //                var imgElement = $(thiz.element).find('#dropzone1 img');
                //                var imgSrc = $(thiz.element).find('#dropzone1 img')[0].src;

                //                alert('xcx21312 drop elements.length: ' + imgElement.length);
                //                //
                //                // We need to make sure this doesn't include our upload arrow image, "https://shareandcollaborate.com/images/upload_arrow_icon.png". ??
                //                //

                //                var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                //                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                //                    return v.toString(16);
                //                });

                //                // https://bl.ocks.org/nolanlawson/0eac306e4dac2114c752 
                //                var dataUrl = imgSrc.split(',')
                //                var base64 = dataUrl[1];

                //                if (!base64) {

                //                    console.log('In bwAttachments_MusicPlaylist.js.renderAndPopulateAttachments.dropzone.drop(). No base64 in the img src or this element. It must be a http reference... imgSrc: ' + imgSrc);

                //                    //
                //                    // Here we check to see if the URL is an internal URL. If so, we are copying a file from one request, and pasting it into another.
                //                    // In other words, this means the user has dragged a file from one request, to another request. We will make this a CUT operation, because it seems this is th euse case.
                //                    // Use case: A receipt image is attached to a request type of "Invoice". The user drag-and-drops it to another request. Therefore a CUT operation.
                //                    //

                //                    // Example imgSrc: https://shareandcollaborate.com/_files/c48535a4-9a6b-4b95-9d67-c6569e9695d8/8b6e9b8f-5b06-4cd7-ae10-340242abd47f/receipt%20-%2010-11-2023%20-%20breakfast%20-%20a%20whopper%20from%20burger%20king.jpg_320px_.jpg?v=5f511b64-b8ad-4bcf-86bc-398223003556&ActiveStateIdentifier=4710a0b6-aa6e-4414-b593-db8a37326558

                //                    var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

                //                    var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                //                    var strUrlWithWorkflowAppId = 'https://shareandcollaborate.com/_files/' + workflowAppId + '/';
                //                    var strActiveStateIdentifierInUrl = '&ActiveStateIdentifier=' + JSON.parse(activeStateIdentifier).ActiveStateIdentifier;

                //                    if ((imgSrc.indexOf(strUrlWithWorkflowAppId) > -1) && (imgSrc.indexOf(strActiveStateIdentifierInUrl) > -1)) {

                //                        //
                //                        // Yes, the user is dragging and dropping an attachment from one request to another. 10-22-2023.
                //                        //
                //                        // CALL THIS METHOD:
                //                        // router.put('/_files/bwCutAndPaste_Attachment', function (request, response) {
                //                        //

                //                        console.log('In bwAttachments_MusicPlaylist.js.renderAndPopulateAttachments.dropzone.drop(). Yes the user is dragging and dropping an attachment from one request to another. This is a CUT operation... imgSrc: ' + imgSrc);

                //                        var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
                //                        var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');
                //                        var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');

                //                        var tmp1 = imgSrc.split(strUrlWithWorkflowAppId)[1];
                //                        var bwBudgetRequestId_Origin = tmp1.split('/')[0];
                //                        var fileNameToCutAndPaste_Thumbnail = tmp1.split('/')[1].split('?')[0];

                //                        var form = $(thiz.element).closest('.budgetrequestform')[0];
                //                        var bwBudgetRequestId_Destination = $(form)[0].getAttribute('bwbudgetrequestid');

                //                        console.log('DEV: READY TO CALL WEB SERVICE [bwCutAndPaste_Attachment]. In bwAttachments_MusicPlaylist.js.renderAndPopulateAttachments.dropzone.drop(). fileNameToCutAndPaste_Thumbnail: ' + fileNameToCutAndPaste_Thumbnail + ', bwBudgetRequestId_Origin: ' + bwBudgetRequestId_Origin + ', bwBudgetRequestId_Destination: ' + bwBudgetRequestId_Destination);

                //                        var data = {
                //                            bwParticipantId_LoggedIn: participantId,
                //                            bwActiveStateIdentifier: activeStateIdentifier,
                //                            bwWorkflowAppId_LoggedIn: workflowAppId,

                //                            bwWorkflowAppId: workflowAppId,

                //                            FileNameToCutAndPaste: fileNameToCutAndPaste_Thumbnail,
                //                            bwBudgetRequestId_Origin: bwBudgetRequestId_Origin,
                //                            bwBudgetRequestId_Destination: bwBudgetRequestId_Destination,

                //                            bwParticipantId: participantId,
                //                            bwParticipantFriendlyName: participantFriendlyName,
                //                            bwParticipantEmail: participantEmail
                //                        };

                //                        var operationUri = thiz.options.operationUriPrefix + '_files/' + 'bwCutAndPaste_Attachment'; // _files allows us to use nginx to route these to a dedicated file server.
                //                        $.ajax({
                //                            url: operationUri,
                //                            type: 'POST',
                //                            data: data,
                //                            headers: { "Accept": "application/json; odata=verbose" },
                //                            success: function (results) {
                //                                try {

                //                                    if (results.status != 'SUCCESS') {

                //                                        var msg = 'Error in bwAttachments_MusicPlaylist.js.renderAndPopulateAttachments.dropzone.drop.bwCutAndPaste_Attachment(). ' + results.status + ': ' + results.message;
                //                                        console.log(msg);
                //                                        displayAlertDialog_Persistent(msg);

                //                                    }

                //                                    //
                //                                    // Now we have to call "renderAndPopulateAttachments()" for both of the requests.
                //                                    //

                //                                    var requestCounter = 0;

                //                                    var forms = $(document).find('.budgetrequestform');

                //                                    for (var i = 0; i < forms.length; i++) {
                //                                        var bwBudgetRequestId_Temp = $(forms)[i].getAttribute('bwbudgetrequestid');
                //                                        if ((bwBudgetRequestId_Temp == bwBudgetRequestId_Origin) || (bwBudgetRequestId_Temp == bwBudgetRequestId_Destination)) {
                //                                            requestCounter += 1;
                //                                            $(forms[i]).find('.bwAttachments_MusicPlaylist').bwAttachments_MusicPlaylist('renderAndPopulateAttachments'); // Call this method for this specific widget. This will re-generate the gold colored drag-and-drop section... etc...
                //                                        }
                //                                    }

                //                                    if (requestCounter == 2) {

                //                                        // No need to indicate anything to the user. They will get visual feedback when the request attachments are rendered.
                //                                        console.log('COMPLETED CUT AND PASTE xcx90809898. requestCounter: ' + requestCounter + ', results: ' + JSON.stringify(results));

                //                                    } else {
                //                                        console.log('ERROR COMPLETING CUT AND PASTE xcx90809898. Expected a value of 2 for requestCounter: ' + requestCounter + ', results: ' + JSON.stringify(results));
                //                                        alert('ERROR COMPLETING CUT AND PASTE xcx90809898. Expected a value of 2 for requestCounter: ' + requestCounter + ', results: ' + JSON.stringify(results));
                //                                    }

                //                                } catch (e) {
                //                                    console.log('Exception in bwAttachments_MusicPlaylist.js.renderAndPopulateAttachments.dropzone.drop():2: ' + e.message + ', ' + e.stack);
                //                                    displayAlertDialog('Exception in bwAttachments_MusicPlaylist.js.renderAndPopulateAttachments.dropzone.drop():2: ' + e.message + ', ' + e.stack);
                //                                    $(this.element).find('#newrequestattachments')[0].innerHTML = 'Exception in bwAttachments_MusicPlaylist.js.renderAndPopulateAttachments.dropzone.drop():2: ' + e.message + ', ' + e.stack;
                //                                }
                //                            },
                //                            error: function (data, errorCode, errorMessage) {
                //                                $('#divWorkingOnItDialog').dialog('close'); // Close the "Working on it..." dialog.
                //                                console.log('Error in bwAttachments_MusicPlaylist.js.renderAndPopulateAttachments.dropzone.drop(): ' + errorMessage);
                //                                debugger;
                //                                if (errorMessage == 'timeout') {
                //                                    displayAlertDialog('The file server could not be contacted. Please try again in a few minutes.');
                //                                } else {
                //                                    displayAlertDialog('Error in bwAttachments_MusicPlaylist.js.renderAndPopulateAttachments.dropzone.drop(): ' + errorMessage);
                //                                }
                //                            }
                //                        });

                //                    } else {

                //                        fetch(imgSrc)
                //                            .then(function (res) {
                //                                try {
                //                                    res.blob();
                //                                } catch (e) {
                //                                    alert('Exception xcx21312312 ' + e.message + ', ' + e.stack);

                //                                    imgElement.remove(); // Remove the img element which is displaying the pasted image.
                //                                }
                //                            })
                //                            .then(function (blob) {
                //                                try {
                //                                    const f = new File([blob], 'dot.png', blob);

                //                                    var fileInput = document.getElementById('inputFile_' + bwBudgetRequestId);

                //                                    if (!fileInput) {

                //                                        var imgSrc2 = $(thiz.element).find('#dropzone1 img')[0].src;

                //                                        alert('Error in bwAttachments_MusicPlaylist.js.renderAndPopulateAttachments.dropzone.drop(). Cannot find element: inputFile_' + bwBudgetRequestId + ', imgSrc2: ' + imgSrc2);







                //                                    }

                //                                    var tst = new DataTransfer();
                //                                    tst.items.add(f);
                //                                    fileInput.files = tst.files;

                //                                    console.log('fileInput.files.length: ' + fileInput.files.length);

                //                                    //imgElement.remove(); // Remove the img element which is displaying the pasted image.

                //                                    thiz.uploadAttachment('newrequestattachments', requestDialogId, bwBudgetRequestId);

                //                                } catch (e) {
                //                                    alert('Exception in bwAttachments_MusicPlaylist.js.renderAndPopulateAttachments.dropzone.drop(). xcx215343: ' + e.message + ', ' + e.stack);

                //                                    imgElement.remove(); // Remove the img element which is displaying the pasted image.
                //                                }

                //                            })
                //                            .catch(function (e) {

                //                                alert('Exception from psomise xcx87987 ' + e + ', Exception when fetching "' + imgSrc + '".');
                //                                imgElement.remove(); // Remove the img element which is displaying the pasted image.

                //                            });

                //                    }

                //                } else {




                //                    var mime = dataUrl[0].match(/:(.*?);/)[1];
                //                    var bin = atob(base64);
                //                    var length = bin.length;
                //                    // From http://stackoverflow.com/questions/14967647/ (continues on next line)
                //                    // encode-decode-image-with-base64-breaks-image (2013-04-21)
                //                    var buf = new ArrayBuffer(length);
                //                    var arr = new Uint8Array(buf);
                //                    bin
                //                        .split('')
                //                        .forEach(function (e, i) { arr[i] = e.charCodeAt(0) });


                //                    var f = new File([buf], guid, { type: mime }); // note: [buf] //let f = new File([buf],'filename',{type:mime}); // note: [buf]
                //                    var blobUrl = URL.createObjectURL(f);
                //                    //let link = document.createElement("a"); 
                //                    //link.href = blobUrl;
                //                    //link.download = guid; //link.download = "filename";
                //                    //link.innerHTML = "Download file.";
                //                    //document.getElementById("url1").appendChild(link);

                //                    imgElement.remove(); // Remove the img element which is displaying the pasted image.

                //                    var fileInput = document.getElementById('inputFile_' + bwBudgetRequestId);


                //                    var tst = new DataTransfer();
                //                    tst.items.add(f);
                //                    fileInput.files = tst.files;



                //                    console.log('fileInput.files.length: ' + fileInput.files.length);

                //                    thiz.uploadAttachment('newrequestattachments', requestDialogId, bwBudgetRequestId);

                //                }

                //                //fileInput.files = e.dataTransfer.files;

                //                //const myFile = new File(['Hello World!'], 'myFile.txt', {
                //                //    type: 'text/plain',
                //                //    lastModified: new Date(),
                //                //});

                //                //// Now let's create a DataTransfer to get a FileList
                //                //const dataTransfer = new DataTransfer();
                //                //dataTransfer.items.add(myFile);
                //                //fileInput.files = dataTransfer.files;





                //            } catch (e) {
                //                alert('Exception in drop xcx1214124: ' + e.message + ', ' + e.stack);
                //            }
                //        }, 1000);

                //    } catch (e) {
                //        alert('Exception in drop xcx123124235: ' + e.message + ', ' + e.stack);
                //    }
                //});






                //
                // If we have jsonData, populate the element.
                //
                if (this.options.jsonData) {

                    ////alert('In bwAttachments_MusicPlaylist.js.renderAndPopulateAttachments(). this.options.jsonData.bwBudgetRequestId: ' + this.options.jsonData.bwBudgetRequestId + ', this.options.jsonData: ' + JSON.stringify(this.options.jsonData));
                    console.log('Calling bwAttachments_MusicPlaylist.js.populateAttachments(). xcx13124-1');
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
            console.log('Exception in renderAndPopulateAttachments(): ' + e.message + ', ' + e.stack);
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwAttachments_MusicPlaylist</span>';
            html += '<br />';
            html += '<span style="">Exception in bwAttachments_MusicPlaylist.renderAndPopulateAttachments(): ' + e.message + ', ' + e.stack + '</span>';
            this.element.html(html);
        }
    },
    renderAndPopulateAttachments_STANDALONE: function () {
        try {
            console.log('');
            console.log('##################################');
            console.log('In bwAttachments_MusicPlaylist.js.renderAndPopulateAttachments_STANDALONE().');
            console.log('##################################');
            console.log('');
            var thiz = this;

            var requestDialogId;

            var bwBudgetRequestId;
            var bwRequestTitle;
            var bwRequestTypeId;

            try {
                bwBudgetRequestId = $(this.element).closest('#budgetrequestform')[0].getAttribute('bwbudgetrequestid');
                bwRequestTitle = $(this.element).closest('#budgetrequestform')[0].getAttribute('bwrequesttitle');

                //var bwRequestTitle = $(this.element).closest('#budgetrequestform')[0].getAttribute('bwrequesttitle');
                bwRequestTypeId = $(this.element).closest('#budgetrequestform')[0].getAttribute('bwrequesttypeid');

            } catch (e) {

                bwBudgetRequestId = 'standalone';
                bwRequestTitle = 'standalone';
                bwRequestTypeId = 'standalone';

            }

            if (!bwBudgetRequestId) {

                alert('Error in bwAttachments_MusicPlaylist.js.xx(). Unexpected value for bwBudgetRequestId: ' + bwBudgetRequestId);
                displayAlertDialog('Error in bwAttachments_MusicPlaylist.js.xx(). Unexpected value for bwBudgetRequestId: ' + bwBudgetRequestId);

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
                html += '       <tr xcx="xcx21342526-1" id="xcx21342526-1" class="xdTableOffsetRow xdTableOffsetRow-editor" id="toolboxdraggablerow_2" draggable="true" bwwidgetname="bwAttachments_MusicPlaylist">';
                html += '           <td style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px;height:100%;">';
                html += '               <table style="height:100%;">';
                //html += '                   <tr style="height:1%;">';
                //html += '                       <td style="vertical-align:top;">';
                ////html += '                           <span class="xdlabel" style="color:black;">';
                ////html += '                               Attachments:';
                ////html += '                           </span>';
                ////if (this.options.renderAsARequiredField == true) {
                ////    html += '                       <span style="color:red;font-size:medium;">*</span>';
                ////} else if (this.options.renderAsARequiredField == false) {
                ////    //
                ////} else {
                ////    html += '                       <span class="ToggleRequiredAsterisk" title="Select this asterick to make this a required field." onclick="$(\'.bwFormsEditor\').bwFormsEditor(\'toggleFormRequiredField\', this);">*</span>';
                ////}
                //html += '                       </td>';
                //html += '                   </tr>';
                html += '                   <tr style="height:99%;">';
                html += '                       <td style="vertical-align:top;">';

                if (/(iPad|iPhone|iPod)/g.test(navigator.userAgent)) {
                    // Don't display this section on iPad, iPhone, iPod.
                } else {

                    var inputFileElementId = 'inputFile_' + bwBudgetRequestId;
                    //html += '                           <table id="dropzone1" onclick="document.getElementById(\'' + inputFileElementId + '\').click();" contenteditable="true" style="height:100%;border:1px solid goldenrod;background-color:#f6f6f6;color:gray;font-size:10pt;cursor:pointer;">';
                    //html += '                               <tr>';
                    //html += '                                   <td style="vertical-align:middle;">';
                    //html += '                                       <span style="color:goldenrod;">Click, right-click, or drag-and-drop here to upload files.<img src="/images/upload_arrow_icon.png" style="width:130px;text-align:center;" /></span>';
                    //html += '                                   </td>';
                    //html += '                               </tr>';
                    //html += '                           </table>';
                    //html += '                           <br /><br />';
                    //html += '                           <table id="dropzone1xx" onclick="$(\'.bwAttachments_MusicPlaylist\').bwAttachments_MusicPlaylist(\'downloadZippedFiles\', \'' + bwBudgetRequestId + '\', \'' + bwRequestTitle + '\');" contenteditable="true" style="height:100%;border:1px solid goldenrod;background-color:#f6f6f6;color:gray;font-size:10pt;cursor:pointer;">';
                    //html += '                               <tr>';
                    //html += '                                   <td style="vertical-align:middle;">';
                    //html += '                                       <span style="color:goldenrod;">Click to download these files as a zip archive.<img src="/images/download_arrow_icon.png" style="width:130px;text-align:center;" /></span>';
                    //html += '                                   </td>';
                    //html += '                               </tr>';
                    //html += '                           </table>';


                    //html += '                           <br /><br />';

                    //
                    // allow="clipboard-read;clipboard-write;" MAY BE VERY IMPORTANT!!!!!!!!!! 11-27-2023 3-20pm ast.
                    //
                    html += '                           <div id="bwAttachments_MusicPlaylist_dropzone_' + bwBudgetRequestId + '" allow="clipboard-read;clipboard-write;" onclick="document.getElementById(\'' + inputFileElementId + '\').click();" contenteditable="true" style="height:180px;width:120px;border:1px solid goldenrod;background-color:#f6f6f6;color:gray;font-size:10pt;cursor:pointer;background-image:url(\'/images/upload_arrow_icon.png\');background-repeat: no-repeat;background-size: 130px;text-align: center;padding: 5px; background-position: center bottom;" >';
                    html += '                               <div style="color:goldenrod;">Click, right-click, or drag-and-drop to upload files.</div>';
                    html += '                           </div>';


                    //if (bwBudgetRequestId != 'standalone') { // 4-19-2024.

                    //    html += '                           <br /><br />';

                    //    html += '                           <div id="dropzone1xx" onclick="$(\'.bwAttachments_MusicPlaylist\').bwAttachments_MusicPlaylist(\'downloadZippedFiles\', \'' + bwBudgetRequestId + '\', \'' + bwRequestTitle + '\');" contenteditable="false" style="height:180px;border:1px solid goldenrod;background-color:#f6f6f6;color:gray;font-size:10pt;cursor:pointer;background-image:url(\'/images/download_arrow_icon.png\');background-repeat: no-repeat;background-size: 130px;text-align: center;padding: 5px; background-position: center bottom;" >';
                    //    html += '                               <div style="color:goldenrod;">Click to download these files as a zip archive.</div>';
                    //    html += '                           </div>';

                    //}

                }

                html += '                       </td>';
                html += '                   </tr>';
                html += '               </table>';
                html += '           </td>';
                //html += '           <td class="xdTableOffsetCellComponent" style="white-space:nowrap;text-align:left; VERTICAL-ALIGN: top; PADDING-LEFT: 5px; PADDING-RIGHT: 22px;">';

                html += '           <td  style="">';

                // ABILITY TO DROP AN ATTACHMENT FROM ANOTHE isplayed request dialog! 4-8-2020
                //html += '           <div id="dropzone1" style="width:365px;height:55px;text-align:center;background-color:#f6f6f6;padding-left:0;">';
                //html += '               <div style="width:365px;height:55px;text-align:center;background-color:#f6f6f6;padding-left:0;">';
                //html += '                   <label for="inputFile_' + bwBudgetRequestId + '" class="divSignInButton" style="font-style:normal;width:100%;height:100%;text-align:center;line-height:1.65em;font-size:23pt;border-radius: 5px 5px 5px 5px;display:inline-block;padding-left:0;padding-top:0;">Choose file(s)...&nbsp;&nbsp;&nbsp;&#128193;</label>';

                html += '               <div style="">';

                html += '<form id="uploadForm_' + bwBudgetRequestId + '" action="/" enctype="multipart/form-data" method="post">';

                // These empty fields need to be here so they are forced to get sent to the web service before the file(s). This is important because we need these values to determine where we are saving the files.
                html += '<input type="hidden" name="bwWorkflowAppId" value="" />';
                html += '<input type="hidden" name="bwBudgetRequestId" value="" />';
                html += '<input type="hidden" name="bwParticipantId" value="" />';
                html += '<input type="hidden" name="bwParticipantEmail" value="" />';
                html += '<input type="hidden" name="bwParticipantFriendlyName" value="" />';
                html += '<input type="hidden" name="bwActiveStateIdentifier" value="" />';
                html += '<input type="hidden" name="Filename" value="" />';
                html += '<input type="hidden" name="Description" value="" />';
                html += '<input type="hidden" name="ConvertToAPdf" value="" />';
                //html += '<input type="hidden" name="Size" value="" />';
                //html += '<input type="hidden" name="Birthtime" value="" />';



                alert('Do we get here xcx312312-2.');

                //
                // CHanged to multiple 9-8-2023.
                //
                // The "multiple" attribute in the input/file element below turns on the ability to select multiple items for the upload. THIS IS TURNED OFF FOR THE MOMENT UNTILL WE UPGRADE THE WEB SERVICE ETC. 4-15-2023.
                //
                console.log('The "multiple" attribute in the input/file element below turns on the ability to select multiple items for the upload. THIS IS TURNED OFF FOR THE MOMENT UNTILL WE UPGRADE THE WEB SERVICE ETC. 4-15-2023.');
                html += '<input type="file" multiple name="multerFileUploadIdentifier_original" id="inputFile_' + bwBudgetRequestId + '" class="upload" style="visibility:hidden;" onchange="$(\'.bwAttachments_MusicPlaylist:first\').bwAttachments_MusicPlaylist(\'uploadAttachment\',\'newrequestattachments\', \'' + requestDialogId + '\', \'' + bwBudgetRequestId + '\');" />';
                //html += '<input type="file" name="multerFileUploadIdentifier_original" id="inputFile_' + bwBudgetRequestId + '" class="upload" style="visibility:hidden;" onchange="$(\'.bwAttachments_MusicPlaylist:first\').bwAttachments_MusicPlaylist(\'uploadAttachment\',\'newrequestattachments\', \'' + requestDialogId + '\', \'' + bwBudgetRequestId + '\');" />';





                //alert('Rendering onchange .bwAttachments_MusicPlaylist:closest uploadAttachment().')

                //html += '<input type="file" name="multi-files" accept="image" multiple>';
                //html += '<input type="submit" value="Upload">';

                html += '</form>  ';

                html += '           </div>';

                html += '           <p id="newrequestattachments" xcx="xcx448-1-4" style="word-break:break-all;white-space:normal;"></p>';

                html += '           <br />';
                html += '           <br />';



                // "Email attachments externally..." button.
                html += '           <input id="' + requestDialogId + '_buttonEmailAttachmentsExternally" type="button" style="display:none;padding:5px 10px 5px 10px;" value="Email attachment(s) externally..." title="Email attachments to a customer using your internet facing url, which is configured in the organization settings." class="BwButton350" ';
                html += '               onclick="$(\'.bwAttachments_MusicPlaylist:first\').bwAttachments_MusicPlaylist(\'copyAttachments\',\'newrequestattachments\', \'' + requestDialogId + '\', \'' + bwBudgetRequestId + '\', \'' + bwRequestTitle + '\', \'' + bwRequestTypeId + '\');" />';

                html += '           <br />';
                html += '           <br />';

                // "OCR attachments..." button.
                html += '           <input id="' + requestDialogId + '_buttonOCRAttachments" type="button" style="display:none;padding:5px 10px 5px 10px;" value="OCR attachment(s)..." title="Perform OCR on multiple attachments at one time." class="BwButton350" ';
                html += '               onclick="$(\'.bwAttachments_MusicPlaylist:first\').bwAttachments_MusicPlaylist(\'performOCR_MultipleImages\', \'' + requestDialogId + '\', \'' + bwBudgetRequestId + '\', \'' + bwRequestTitle + '\', \'' + bwRequestTypeId + '\');" />';

                html += '           <br />';
                html += '           <br />';

                // "CHATGPT attachments..." button.
                html += '           <input id="' + requestDialogId + '_buttonCHATGPTAttachments" type="button" style="display:inline;padding:5px 10px 5px 10px;" value="CHATGPT attachment(s)..." title="Perform CHATGPT on multiple attachments at one time." class="BwButton350" ';
                html += '               onclick="$(\'.bwAttachments_MusicPlaylist:first\').bwAttachments_MusicPlaylist(\'performCHATGPT_MultipleImages\', \'' + requestDialogId + '\', \'' + bwBudgetRequestId + '\', \'' + bwRequestTitle + '\', \'' + bwRequestTypeId + '\');" />';


                html += '                            </td>';
                html += '                        </tr>';
                html += '                    </tbody>';
                html += '</table>';


                this.element.html(html);


                // Render the html.
                if (this.options.inFormsEditor != true) {
                    // THIS IS VERY IMPORTANT AND NEEDS TO BE IN EVERY WIDGET!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 7-12-2020
                    // Even though the widget regenerates itself (re-renders), the parent TR tag gets missed!!! Therefore we have to handle getting rid of our form editor draggable attribute here.
                    //this.element.closest('tr').removeAttr('draggable');


                    //debugger;
                    //var element = $('.bwAttachments_MusicPlaylist:first').find('.xdTableOffsetRow');

                    $('.bwAttachments_MusicPlaylist:first').find('.xdTableOffsetRow').removeAttr('draggable'); // 4-19-2024. 
                    $('.bwAttachments_MusicPlaylist:first').find('.xdTableOffsetRow').removeClass('xdTableOffsetRow-editor');

                }




                $(this.element).find('#newrequestattachments')[0].innerHTML = '<span style="color:tomato;"></span>';

                var dropzone = document.getElementById('bwAttachments_MusicPlaylist_dropzone_' + bwBudgetRequestId);


                //var rect = dropzone.getBoundingClientRect();
                //var height = rect.height;
                //var width = rect.width;

                //alert('xcx1231231412 dropzone size width: ' + width + ', height: ' + height + ', rect: ' + JSON.stringify(rect));

                //var input = document.createElement('input');
                //input.type = 'file';
                //input.style.height = height;
                //input.style.width = width;
                //dropzone.appendChild(input);


                //inp.onpaste = evt =>
                //    console.log(evt.clipboardData.getData('text'));

                //<input id="inp">


                //.input-element{
                //    height: 100px!important;
                //    width: 400px;
                //}


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

                dropzone.addEventListener('drop', function (e) {
                    try {
                        console.log('In renderAndPopulateAttachments_STANDALONE.dropzone.drop().');
                        displayAlertDialog_Persistent('In renderAndPopulateAttachments.dropzone.drop(). xcx23124-2.');
                        e.preventDefault();

                        var gotData;
                        if (e.clipboardData) {
                            console.log('In renderAndPopulateAttachments_STANDALONE.dropzone.drop(). Object is event.clipboardData.');
                            gotData = true;
                        } else if (e.dataTransfer) {
                            console.log('In renderAndPopulateAttachments_STANDALONE.dropzone.drop(). Object is event.dataTransfer.');
                            gotData = true;
                        } else if (window.clipboardData) {
                            console.log('In renderAndPopulateAttachments_STANDALONE.dropzone.drop(). Object is window.clipboardData.');
                            gotData = true;
                        } else {

                            if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
                                alert('FIREFOX BROWSER CANNOT DRAG-AND-DROP EXTERNAL FILES. THERE IS A WORK-AROUND: Please right click on your source file, and choose "COPY". Subsequently, right click here and choose "PASTE".');
                            } else {
                                alert('Error in bwAttachments_MusicPlaylist.js.dropzone.drop(). Could not find a valid DataTransfer object. e: ' + JSON.stringify(e) + ', navigator.userAgent: ' + navigator.userAgent);
                            }

                        }

                        if (gotData == true) {
                            thiz.dodrop(e, bwBudgetRequestId);
                        } else {
                            alert('Error in bwAttachments_MusicPlaylist.js.dropzone.drop(). Could not find a valid DataTransfer object.');
                        }

                    } catch (e) {
                        var msg = 'Exception in bwAttachments_MusicPlaylist.js.dropzone.drop(): ' + e.message + ', ' + e.stack;
                        console.log(msg);
                        alert(msg);
                    }
                });

                dropzone.addEventListener('paste', function (e) {
                    try {
                        console.log('In renderAndPopulateAttachments_STANDALONE.dropzone.paste().');
                        e.preventDefault();

                        var gotData;
                        if (e.clipboardData) {
                            console.log('In renderAndPopulateAttachments_STANDALONE.dropzone.paste(). Object is event.clipboardData.');
                            gotData = true;
                        } else if (e.dataTransfer) {
                            console.log('In renderAndPopulateAttachments_STANDALONE.dropzone.paste(). Object is event.dataTransfer.');
                            gotData = true;
                        } else if (window.clipboardData) {
                            console.log('In renderAndPopulateAttachments_STANDALONE.dropzone.paste(). Object is window.clipboardData.');
                            gotData = true;
                        } else {

                            if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
                                alert('FIREFOX BROWSER CANNOT DRAG-AND-DROP EXTERNAL FILES. THERE IS A WORK-AROUND: Please right click on your source file, and choose "COPY". Subsequently, right click here and choose "PASTE".');
                            } else {
                                alert('Error in bwAttachments_MusicPlaylist.js.dropzone.paste(). Could not find a valid DataTransfer object. e: ' + JSON.stringify(e) + ', navigator.userAgent: ' + navigator.userAgent);
                            }

                        }

                        if (gotData == true) {
                            thiz.dodrop(e, bwBudgetRequestId);
                        } else {
                            alert('Error in bwAttachments_MusicPlaylist.js.dropzone.paste(). Could not find a valid DataTransfer object.');
                        }

                    } catch (e) {
                        var msg = 'Exception in bwAttachments_MusicPlaylist.js.dropzone.paste(): ' + e.message + ', ' + e.stack;
                        console.log(msg);
                        alert(msg);
                    }
                });






                //
                // If we have jsonData, populate the element.
                //
                if (this.options.jsonData) {

                    ////alert('In bwAttachments_MusicPlaylist.js.renderAndPopulateAttachments(). this.options.jsonData.bwBudgetRequestId: ' + this.options.jsonData.bwBudgetRequestId + ', this.options.jsonData: ' + JSON.stringify(this.options.jsonData));
                    console.log('Calling bwAttachments_MusicPlaylist.js.populateAttachments(). xcx13124-1');
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
            console.log('Exception in renderAndPopulateAttachments_STANDALONE(): ' + e.message + ', ' + e.stack);
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwAttachments_MusicPlaylist</span>';
            html += '<br />';
            html += '<span style="">Exception in bwAttachments_MusicPlaylist.renderAndPopulateAttachments_STANDALONE(): ' + e.message + ', ' + e.stack + '</span>';
            this.element.html(html);
        }
    },
    ConvertMediaFileToBaselineShareable: function (bwBudgetRequestId, filename) {
        try {
            console.log('In bwAttachments_MusicPlaylist.js.ConvertMediaFileToBaselineShareable().');
            var thiz = this;

            //
            // This calls the file service "/_files/ConvertMediaFileToBaselineShareable". <<< OLD NAME: "/_files/launchFileConversion"
            //      - this copies the file using SCP, to the FFMPEG /_fileconversion server.
            //      - when the file copy has been completed, it calls a web service on the FFMPEG server to launch the conversion process.
            //      - subsequently, the bwAttachments_MusicPlaylist.js widget gets progress/status updates by calling /_fileconversion/GetMediaFileConversionProgress.
            //
            //
            //

            ShowActivitySpinner('Copying file(s) to media conversion server...');

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');
            var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');

            var data = {
                bwParticipantId_LoggedIn: participantId,
                bwActiveStateIdentifier: activeStateIdentifier,
                bwWorkflowAppId_LoggedIn: workflowAppId,

                bwWorkflowAppId: workflowAppId,
                bwBudgetRequestId: bwBudgetRequestId,

                Filename: filename,

                bwParticipantId: participantId,
                bwParticipantFriendlyName: participantFriendlyName,
                bwParticipantEmail: participantEmail
            };

            var fileserviceurl = globalUrlPrefix + globalUrlForWebServices + '/_files';
            var operationUri = fileserviceurl + "/ConvertMediaFileToBaselineShareable";
            $.ajax({
                url: operationUri,
                type: "POST",
                data: data,
                timeout: 300000, // 300000 = 5 minutes.
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (results) {
                    try {

                        HideActivitySpinner();

                        if (results.status != 'SUCCESS') {

                            displayAlertDialog('In bwAttachments_MusicPlaylist.js.ConvertMediaFileToBaselineShareable.success(): ' + results.status + ', ' + results.message);

                        } else {

                            $('#AttachmentsDialog1').dialog('close');

                            thiz.populateAttachments(workflowAppId, bwBudgetRequestId, 'newrequestattachments');

                            displayAlertDialog('The file(s) have been successfully added to the conversion queue. This may take a while. Status updates will be visible on the budget request.');

                        }

                    } catch (e) {

                        HideActivitySpinner();

                        console.log('Exception in bwAttachments_MusicPlaylist.js.ConvertMediaFileToBaselineShareable.success(): ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwAttachments_MusicPlaylist.js.ConvertMediaFileToBaselineShareable.success(): ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {

                    HideActivitySpinner();

                    console.log('Error in bwAttachments_MusicPlaylist.js.ConvertMediaFileToBaselineShareable.error(): ' + errorMessage);
                    displayAlertDialog('Error in bwAttachments_MusicPlaylist.js.ConvertMediaFileToBaselineShareable.error(): ' + errorMessage);
                }
            });


        } catch (e) {

            HideActivitySpinner();

            var msg = 'Exception in bwAttachments_MusicPlaylist.js.ConvertMediaFileToBaselineShareable(): ' + e.message + ', ' + e.stack;
            console.log(msg);
            displayAlertDialog(msg);
        }
    },

    launchFileConversion: function (bwBudgetRequestId, filename) {
        try {
            console.log('In bwAttachments_MusicPlaylist.js.launchFileConversion().');
            var thiz = this;

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            var fileserviceurl = globalUrlPrefix + globalUrlForWebServices + '/_files';
            var data = {
                bwWorkflowAppId: workflowAppId,
                bwBudgetRequestId: bwBudgetRequestId,
                Filename: filename
            };
            var operationUri = fileserviceurl + "/launchFileConversion";
            $.ajax({
                url: operationUri,
                type: "POST",
                data: data,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (data) {
                    try {

                        if (data != 'SUCCESS') {

                            displayAlertDialog(data);

                        } else {

                            displayAlertDialog('File conversion has been launched for this bwBudgetRequestId: ' + bwBudgetRequestId);

                        }

                    } catch (e) {
                        console.log('Exception in bwAttachments_MusicPlaylist.js.launchFileConversion.success(): ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwAttachments_MusicPlaylist.js.launchFileConversion.success(): ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    console.log('Error in bwAttachments_MusicPlaylist.js.launchFileConversion.error(): ' + e.message + ', ' + e.stack);
                    displayAlertDialog('Error in bwAttachments_MusicPlaylist.js.launchFileConversion.error(): bwBudgetRequestId: ' + bwBudgetRequestId + ', filename: ' + filename + ', errorMessage: ' + errorMessage);
                }
            });

        } catch (e) {
            console.log('Exception in bwAttachments_MusicPlaylist.js.launchFileConversion(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwAttachments_MusicPlaylist.js.launchFileConversion(): ' + e.message + ', ' + e.stack);
        }
    },
    getExifData: function (bwBudgetRequestId, filename) {
        try {
            console.log('In bwAttachments_MusicPlaylist.js.getExifData().');
            var thiz = this;

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            var fileserviceurl = globalUrlPrefix + globalUrlForWebServices + '/_files';
            var data = {
                bwWorkflowAppId: workflowAppId,
                bwBudgetRequestId: bwBudgetRequestId,
                Filename: filename
            };
            var operationUri = fileserviceurl + "/getExifData";
            $.ajax({
                url: operationUri,
                type: "POST",
                data: data,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (results) {
                    try {

                        if (results.status != 'SUCCESS') {

                            displayAlertDialog(results.message);

                        } else {

                            var dialogId = 'divImageAnalysisDialog_' + thiz.options.elementIdSuffix;

                            var div = document.getElementById(dialogId);
                            if (!div) {

                                div = document.createElement('div');
                                div.id = dialogId;
                                div.style.display = 'none';
                                document.body.appendChild(div); // Place at end of document

                                var html = '';

                                //html += '<div style="display:none;" id="' + dialogId + '">';
                                html += '  <table style="width:100%;">';
                                html += '    <tr>';
                                html += '      <td style="width:90%;">';
                                html += '        <span style="color: #3f3f3f;font-size:30pt;font-weight:bold;">Image Analysis</span>';
                                html += '      </td>';
                                html += '      <td style="width:9%;"></td>';
                                html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
                                html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#' + dialogId + '\').dialog(\'close\');">X</span>';
                                html += '      </td>';
                                html += '    </tr>';
                                html += '  </table>';
                                html += '  <br /><br />';
                                html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
                                //html += '  <span id="" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:20pt;">xcx3241234214</span>';
                                html += '  <br />';
                                html += '  <br />';
                                // Copy to clipboard.
                                html += '<div class="tooltip">';
                                html += '   <button onclick="copyToClipboard(\'txtDisplayJsonDialogJSON\', \'spanDisplayJsonDialogCopyJsonTooltip\')" onmouseout="copyToClipboardMouseout(\'spanDisplayJsonDialogCopyJsonTooltip\')">';
                                html += '       <span class="tooltiptext" id="spanDisplayJsonDialogCopyJsonTooltip">Copy JSON to the clipboard</span>';
                                html += '       Copy'; // JSON...';
                                html += '   </button>';
                                html += '</div>';
                                // end Copy to clipboard.
                                html += '  <textarea id="spanImageAnalysisContent_' + thiz.options.elementIdSuffix + '" rows="30" cols="130" style="padding-top:4px;font-size:8pt;"></textarea>';
                                //html += '  <pre id="txtDisplayJsonDialogJSON" style="overflow:auto;padding-top:4px;font-size:8pt;width:98%;height:300px;border:1px solid gainsboro;"></pre>';
                                //html += '  <br />';
                                //html += '  <br />';
                                //html += '  <div id="btnRunDiagnostics" class="divDialogButton" title="Click here to run diagnostics...">';
                                //html += '   Run Diagnostics...';
                                //html += '  </div>';
                                html += '  <br /><br />';
                                html += '  <div class="divDialogButton" onclick="$(\'#' + dialogId + '\').dialog(\'close\');">';
                                html += '   Close';
                                html += '  </div>';
                                html += '  <br />';
                                html += '  <br />';
                                //html += '</div>';

                                div.innerHTML = html;
                            }

                            // Display a dialog box with a big textarea so that the contents can be copied and pasted.
                            $('#' + dialogId).dialog({
                                modal: true,
                                resizable: false,
                                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                                width: "820",
                                dialogClass: "no-close", // No close button in the upper right corner.
                                hide: false,//, // This means when hiding just disappear with no effects.
                                open: function (event, ui) {
                                    $('.ui-widget-overlay').bind('click', function () {
                                        $('#' + dialogId).dialog('close');
                                    });

                                    $('#spanImageAnalysisContent_' + thiz.options.elementIdSuffix).val(JSON.stringify(results.data, null, 2));


                                }, // This allows the dialog to close when clicked outside of the dialog. Only works for modal dialogs.
                                close: function () {
                                    $('#' + dialogId).dialog('destroy');
                                }
                            });
                            //$("#divDisplayJsonDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

                        }

                    } catch (e) {
                        console.log('Exception in bwAttachments_MusicPlaylist.js.getExifData.success(): ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwAttachments_MusicPlaylist.js.getExifData.success(): ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    console.log('Error in bwAttachments_MusicPlaylist.js.getExifData.error(): ' + e.message + ', ' + e.stack);
                    displayAlertDialog('Error in bwAttachments_MusicPlaylist.js.getExifData.error(): bwBudgetRequestId: ' + bwBudgetRequestId + ', filename: ' + filename + ', errorMessage: ' + errorMessage);
                }
            });

        } catch (e) {
            console.log('Exception in bwAttachments_MusicPlaylist.js.getExifData(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwAttachments_MusicPlaylist.js.getExifData(): ' + e.message + ', ' + e.stack);
        }
    },

    performOCR: function (bwBudgetRequestId, filename) {
        try {
            console.log('In bwAttachments_MusicPlaylist.js.performOCR().');

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

            var preventCachingGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });

            var image1 = this.options.operationUriPrefix + '_files/' + workflowAppId + '/' + bwBudgetRequestId + '/' + filename + '?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + JSON.parse(activeStateIdentifier).ActiveStateIdentifier;

            ShowActivitySpinner('Performing Optical Character Recognition (OCR)...');

            Tesseract.recognize(image1, 'eng', { logger: function (m) { console.log(m); } })
                .then(function (results) {
                    HideActivitySpinner();
                    var ocrResult = results.data.text;

                    console.log(ocrResult);
                    displayAlertDialog(ocrResult);

                }).catch(function (e, f, g) {
                    HideActivitySpinner();
                    console.log('EXCEPTION XCX322342354 ' + JSON.stringify(e));
                    displayAlertDialog('EXCEPTION XCX322342354 image1: ' + image1 + ', ' + JSON.stringify(e) + ', f: ' + +JSON.stringify(f) + ', g: ' + +JSON.stringify(g));

                });

        } catch (e) {
            console.log('Exception in bwAttachments_MusicPlaylist.js.performOCR(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwAttachments_MusicPlaylist.js.performOCR(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwAttachments_MusicPlaylist.js.performOCR(): ' + e.message + ', ' + e.stack);
        }
    },

    performOCR_MultipleImages: function (requestDialogId, bwBudgetRequestId, bwRequestTitle, bwRequestTypeId) { // filename) {
        try {
            console.log('In bwAttachments_MusicPlaylist.js.performOCR_MultipleImages().');
            var thiz = this;
            //alert('In bwAttachments_MusicPlaylist.js.performOCR_MultipleImages(). bwBudgetRequestId: ' + bwBudgetRequestId + ', filename: ' + filename);

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

            var preventCachingGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });

            //var image1 = 'https://shareandcollaborate.com/_files/2bb5ff65-cbe4-4c4c-8708-f7643a3724b2/526f867f-a089-40e6-a7b3-6d9c398ffc89/ocrtest3.png?v=19c1a061-6b14-420c-bb95-92d94682754e&ActiveStateIdentifier=6db5cf08-d134-4fb0-9e7b-d4ddc48b717e';
            //var image1 = 'https://shareandcollaborate.com/_files/2bb5ff65-cbe4-4c4c-8708-f7643a3724b2/526f867f-a089-40e6-a7b3-6d9c398ffc89/ocrtest3.png';

            //var image1 = this.options.operationUriPrefix + '_files/' + workflowAppId + '/' + bwBudgetRequestId + '/' + filename + '?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + JSON.parse(activeStateIdentifier).ActiveStateIdentifier;



            ShowActivitySpinner('Performing Optical Character Recognition (OCR)...performOCR_MultipleImages()...');

            //Tesseract.recognize(image1, 'eng', { logger: function (m) { console.log(m); } })
            //    .then(function (results) {
            //        HideActivitySpinner();
            //        var ocrResult = results.data.text;

            //        console.log(ocrResult);
            //        displayAlertDialog(ocrResult);

            //    }).catch(function (e, f, g) {
            //        HideActivitySpinner();
            //        console.log('EXCEPTION XCX322342354 ' + JSON.stringify(e));
            //        displayAlertDialog('EXCEPTION XCX322342354 image1: ' + image1 + ', ' + JSON.stringify(e) + ', f: ' + +JSON.stringify(f) + ', g: ' + +JSON.stringify(g));

            //    });











            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

            var preventCachingGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });

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

                        var data = results.data;

                        if (results.status != 'SUCCESS') {
                            //alert('xcx231234234-2 data: ' + JSON.stringify(data));
                            $('#' + dialogId + '_BodyEditor').html('<span style="color:tomato;">[Unexpected response from the file server]</span>');

                        } else if (results.message.indexOf('ENOENT') > -1) {
                            //alert('xcx231234234-3 data: ' + JSON.stringify(data));
                            // No such file or directory
                            console.log('[Server response: No such file or directory: ' + data.path + ']. This is probably Ok.?');

                        } else if (data && data.length && (data.length > 0)) {

                            var promiseArray = [];

                            for (var i = 0; i < data.length; i++) {

                                var image1 = thiz.options.operationUriPrefix + '_files/' + workflowAppId + '/' + bwBudgetRequestId + '/' + data[i].Display_Filename + '?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + JSON.parse(activeStateIdentifier).ActiveStateIdentifier;

                                var promise = Tesseract.recognize(image1, 'eng', { logger: function (m) { console.log(m); } })
                                    .then(function (results) {
                                        try {
                                            displayAlertDialog_Persistent(results.data.text); // + ', confidence: ' + results.data.confidence); // + ', ImageUrl: ' + results.results.data.ImageUrl);

                                            //var ocrResult = results.data.text;
                                            //console.log('OCR result xcx21312312. path: ' + image1 + ', ocrResult: ' + ocrResult);

                                            //var result = {
                                            //    status: 'SUCCESS',
                                            //    results: {
                                            //        ImageUrl: image1,
                                            //        Text: ocrResult
                                            //    }
                                            //}
                                            //return result;
                                        } catch (e) {

                                            console.log('EXCEPTION xcx123123: ' + e.message + ', ' + e.stack);
                                            displayAlertDialog('EXCEPTION xcx123123: ' + e.message + ', ' + e.stack);

                                        }
                                    }).catch(function (e, f, g) {

                                        console.log('EXCEPTION XCX32234235455 ' + JSON.stringify(e));
                                        displayAlertDialog('EXCEPTION XCX32234235455 image1: ' + image1 + ', ' + JSON.stringify(e) + ', f: ' + +JSON.stringify(f) + ', g: ' + +JSON.stringify(g));

                                    });

                                promiseArray.push(promise);

                            }

                            Promise.all(promiseArray)
                                .then(function (results) {

                                    HideActivitySpinner();

                                    //var html = '';

                                    //html += '<table>';

                                    //for (var i = 0; i < results.length; i++) {
                                    //    html += '<tr>';
                                    //    html += '   <td>';
                                    //    html += '       <img src="' + results[i].results.ImageUrl + '" />';
                                    //    html += '   </td>';

                                    //    html += '   <td>';
                                    //    html += results[i].results.Text;
                                    //    html += '   </td>';

                                    //    html += '</tr>';
                                    //}

                                    //html += '</table>';



                                    //displayAlertDialog(html);

                                }).catch(function (e, f, g) {

                                    HideActivitySpinner();
                                    alert('Exception xcx9087089: ' + JSON.stringify(e));

                                });



                            //var html = '';
                            //var now = new Date();
                            //var folderName = now.toLocaleDateString().replace(/\//g, '-');

                            //html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:25pt;font-weight:bold;">';
                            //html += '   Choose a name for the sub-folder:&nbsp;&nbsp;<input id="txtSubfolder_' + thiz.options.elementIdSuffix + '" type="text" value="' + folderName + '" />';
                            //html += '</span>';
                            //html += '<br />';
                            //html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:25pt;font-weight:bold;">';
                            //html += '   Select the file(s) you wish to copy to the external URL, then click the "Copy" button.';
                            //html += '</span>';
                            //$('#' + dialogId + '_BodyEditor').html(html); // It worked, and here were attachments, so get rid of the message.

                            ////
                            //// Display the image thumbnail.
                            ////
                            //var displayImageThumbnail = function (imgId, thumbnailUrl) {
                            //    $.get(thumbnailUrl).done(function () {
                            //        //debugger;
                            //        var img = new Image();
                            //        img.src = thumbnailUrl;
                            //        img.onload = function (e) {
                            //            try {

                            //                //alert('Displaying thumbnail 2: ' + thumbnailUrl);
                            //                document.getElementById(imgId).src = thumbnailUrl; // There is a thumbnail, so display it.
                            //                //displayAlertDialog('Displayed the thumbnail xcx2357 imgId: ' + imgId + ', thumbnailUrl: ' + thumbnailUrl);
                            //            } catch (e) {

                            //                alert('xcx2312 exception 2: ' + e.message + ', ' + e.stack);

                            //                console.log('Exception in bwAttachments_MusicPlaylist.js.copyAttachments.displayImageThumbnail(): ' + e.message + ', ' + e.stack);
                            //                displayAlertDialog('Exception in bwAttachments_MusicPlaylist.js.copyAttachments.displayImageThumbnail(): ' + e.message + ', ' + e.stack);
                            //                document.getElementById(imgId).src = globalUrlPrefix + globalUrl + '/images/mp4.jfif'; // There is no thumbnail, so display the icon.
                            //            }


                            //            //try {
                            //            //    alert('Displaying thumbnail 2: ' + thumbnailUrl);
                            //            //    document.getElementById(imgId).src = thumbnailUrl; // There is a thumbnail, so display it.
                            //            //} catch (e) {
                            //            //    alert('xcx2312 exception 2: ' + e.message + ', ' + e.stack);
                            //            //    document.getElementById(imgId).src = globalUrlPrefix + globalUrl + '/images/mp4.jfif'; // There is no thumbnail, so display the icon.
                            //            //}
                            //        }
                            //    }).fail(function (result) {

                            //        alert('fail in Displaying thumbnail 1: ' + thumbnailUrl);

                            //        console.log('Fail in bwAttachments_MusicPlaylist.js.copyAttachments.displayImageThumbnail(): ' + JSON.stringify(result));
                            //        displayAlertDialog('Fail in bwAttachments_MusicPlaylist.js.copyAttachments.displayImageThumbnail(): ' + JSON.stringify(result));
                            //        document.getElementById(imgId).src = globalUrlPrefix + globalUrl + '/images/mp4.jfif'; // There is no thumbnail, so display the icon.
                            //    });
                            //}







                            //var html = '';

                            //html += '<div id="' + dialogId + '_BodyEditor_Attachments" style="overflow-y:scroll;scroll-behavior:smooth;max-height:500px;padding-left:20px;">'; // Need auto-scroll here.
                            //html += '</div>';

                            //$('#' + dialogId + '_BodyEditor').append(html);





                            //for (var i = 0; i < data.length; i++) {



                            //    //alert('xcx444432 data[i]: ' + JSON.stringify(data[i]));


                            //    var filename = data[i].Display_Filename;
                            //    if (filename.indexOf('_thumbnail_') > -1) {

                            //        // This is a thumbnail. Do not display as an attachment.

                            //    } else {

                            //        // This is an actual attachment. Display it!
                            //        var description = data[i].Description;
                            //        var size = data[i].Size;
                            //        if (size && size.toLowerCase && (size.toLowerCase() != 'na')) {
                            //            size = (Number(size) / 1000000).toFixed(1);
                            //        }

                            //        //var fileUrl = "_files/" + workflowAppId + "/" + bwBudgetRequestId + "/" + filename;

                            //        var fileUrl;


                            //        var activeStateIdentifier = JSON.parse($('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier'));

                            //        if (activeStateIdentifier.status != 'SUCCESS') {

                            //            //html += '[No image. Unauthorized. xcx213124-3-22]';

                            //            fileUrl = '[No image. Unauthorized. xcx213124-3-22x]';


                            //        } else {

                            //            //var imagePath = thiz.options.operationUriPrefix + '_files/' + workflowAppId + '/inventoryimages/' + thiz.options.InventoryItems[i].bwInventoryItemId + '/inventoryimage.png?v=' + guid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier;
                            //            //html += '<img xcx="xcx2342462" id="orgImage_' + i + '" src="' + imagePath + '" style="height:120px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;" alt="" onclick="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'btnEdit_OnClick\', \'' + thiz.options.InventoryItems[i].bwInventoryItemId + '\');">';


                            //            //fileUrl = "_files/" + workflowAppId + "/" + bwBudgetRequestId + "/" + filename + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier;

                            //            //  var filename = data[i].Display_Filename;
                            //            fileUrl = "_files/" + workflowAppId + "/" + bwBudgetRequestId + "/" + data[i].Actual_Filename + '?ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier; // 6-2-2023

                            //        }












                            //        // Centered on the screen.
                            //        var width = 800;
                            //        var height = 600;
                            //        var left = (screen.width - width) / 2;
                            //        var top = (screen.height - height) / 2;

                            //        var html = '';

                            //        html += '<table style="width:100%;" xcx="xcx3254367">';
                            //        html += '  <tr>';
                            //        html += '    <td style="width:10%;">';




                            //        html += '<table>';
                            //        html += '   <tr>';
                            //        html += '       <td>';
                            //        html += '           <input style="transform: scale(3);" bwfilename="' + filename + '" bwfiledescription="' + description + '" bwfilesize="' + size + '" class="cbAttachment" type="checkbox" />';
                            //        html += '       </td>';
                            //        html += '       <td>&nbsp;&nbsp;</td>';
                            //        html += '       <td>';

                            //        var extensionIndex = filename.split('.').length - 1;
                            //        var fileExtension = filename.toLowerCase().split('.')[extensionIndex];

                            //        if (fileExtension == 'png' || fileExtension == 'jpg' || fileExtension == 'jpeg' || fileExtension == 'jfif' || fileExtension == 'webp' || fileExtension == 'gif') {

                            //            html += '<img id="attachmentstest1" xcx="xcx2312-1" src="' + thiz.options.operationUriPrefix + fileUrl + '" style="height:120px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;" alt="" ';
                            //            if (Platform == 'IOS8') {
                            //                html += 'onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');"';
                            //            } else {
                            //                html += 'onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');" ';
                            //            }
                            //            html += ' />';
                            //        } else if (fileExtension == 'xlsx' || fileExtension == 'xls') {

                            //            // We need an if statement here to choose between iOS and Windows.
                            //            if (Platform == 'IOS8') {
                            //                html += '<img src="images/excelicon.png" style="width:100px;cursor:pointer;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');" />';
                            //                //html += '<div class="attachmentsSectionFileLink" style="height:50px;border:1px thin red;" onclick="displayAttachmentInDialog(\'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');">';
                            //            } else {
                            //                html += '<img src="images/excelicon.png" style="width:100px;cursor:pointer;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');" />';
                            //                //html += '<div style="cursor:pointer;" class="attachmentsSectionFileLink" onclick="displayAttachmentInDialog(\'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');">';
                            //            }

                            //        } else if (fileExtension == 'pdf') {

                            //            //html += '<img src="images/pdf.png" style="width:100px;cursor:pointer;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');" />';

                            //            ////html += '<img src="images/excelicon.png" style="width:100px;height:46px;" />';
                            //            //// We need an if statement here to choose between iOS and Windows.
                            //            ////if (Platform == 'IOS8') {
                            //            ////    html += '<img src="images/excelicon.png" style="width:100px;height:46px;cursor:pointer;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');" />';
                            //            ////    //html += '<div class="attachmentsSectionFileLink" style="height:50px;border:1px thin red;" onclick="displayAttachmentInDialog(\'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');">';
                            //            ////} else {
                            //            //html += '<img src="images/pdf.png" style="width:100px;cursor:pointer;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');" />';
                            //            ////html += '<div style="cursor:pointer;" class="attachmentsSectionFileLink" onclick="displayAttachmentInDialog(\'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');">';
                            //            ////}


                            //            var imgId = 'img_bwAttachments_MusicPlaylist_' + thiz.options.elementIdSuffix + '_' + bwBudgetRequestId + '_' + i;

                            //            var thumbnailUrl = thiz.options.operationUriPrefix + "_files/" + workflowAppId + "/" + bwBudgetRequestId + "/" + filename + '_thumbnail_320px_pdf_' + '.png';

                            //            html += '<img xcx="xcx3396048" id="' + imgId + '" style="height:120px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;" alt="" src="' + thumbnailUrl + '" ';
                            //            html += '   onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');" ';
                            //            html += ' />';
                            //            //var thumbnailUrl = "_files/" + workflowAppId + "/" + bwBudgetRequestId + "/" + filename + '_thumbnail_' + '.jpg'; // thiz.options.operationUriPrefix

                            //            //var thumbnailUrl = thiz.options.operationUriPrefix + "_files/" + workflowAppId + "/" + bwBudgetRequestId + "/" + filename + '_thumbnail_' + '.jpg';
                            //            //alert('xcx1111111 thumbnailUrl: ' + thumbnailUrl);
                            //            //alert('imgId: ' + imgId);
                            //            displayImageThumbnail(imgId, thumbnailUrl);


                            //        } else if (fileExtension == 'mp4') {

                            //            var imgId = 'img_bwAttachments_MusicPlaylist_' + thiz.options.elementIdSuffix + '_' + bwBudgetRequestId + '_' + i;

                            //            var thumbnailUrl = thiz.options.operationUriPrefix + "_files/" + workflowAppId + "/" + bwBudgetRequestId + "/" + filename + '_thumbnail_' + '.jpg';

                            //            html += '<img xcx="xcx3396048" id="' + imgId + '" style="height:120px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;" alt="" src="' + thumbnailUrl + '" ';
                            //            html += '   onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');" ';
                            //            html += ' />';
                            //            //var thumbnailUrl = "_files/" + workflowAppId + "/" + bwBudgetRequestId + "/" + filename + '_thumbnail_' + '.jpg'; // thiz.options.operationUriPrefix

                            //            //var thumbnailUrl = thiz.options.operationUriPrefix + "_files/" + workflowAppId + "/" + bwBudgetRequestId + "/" + filename + '_thumbnail_' + '.jpg';
                            //            //alert('xcx1111111 thumbnailUrl: ' + thumbnailUrl);
                            //            //alert('imgId: ' + imgId);
                            //            displayImageThumbnail(imgId, thumbnailUrl);

                            //        } else if (fileExtension == 'rtf') {

                            //            html += '<img src="images/rtf.png" style="width:50px;cursor:pointer;" ';

                            //            html += 'onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');" ';
                            //            html += ' />';
                            //        } else if (fileExtension == 'vob') {

                            //            html += '<img src="images/vob.png" style="width:50px;cursor:pointer;" ';

                            //            html += 'onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');" ';
                            //            html += ' />';
                            //        } else if (fileExtension == 'mp3') {

                            //            html += '<img src="images/mp3.png" style="width:50px;cursor:pointer;" ';

                            //            html += 'onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');" ';
                            //            html += ' />';
                            //        }

                            //        html += '       </td>';
                            //        html += '   </tr>';
                            //        html += '</table>';





                            //        html += '    </td>';
                            //        html += '    <td style="width:90%;white-space:normal;">';

                            //        // We need an if statement here to choose between iOS and Windows.
                            //        if (Platform == 'IOS8') {
                            //            html += '<div xcx="xcx21342346-1" class="attachmentsSectionFileLink" style="height:50px;border:1px thin red;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');">';
                            //        } else {
                            //            html += '<div xcx="xcx21342346-2" class="attachmentsSectionFileLink" style="cursor:pointer;white-space:nowrap;width:250px;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');">';
                            //        }

                            //        html += filename;

                            //        // Display the file attachment description.
                            //        if (description.length > 0) {
                            //            //$('#' + attachmentsSectionId).append('&nbsp;&nbsp;<span class="attachmentsSectionDescription"> - "' + description + '"</span>');

                            //            html += '<br /><span class="attachmentsSectionDescription"> - "' + description + '"</span>';
                            //            //html += '<br /><span class="attachmentsSectionSize"> - ' + size + ' mb</span>';
                            //        } else {
                            //            //$('#' + attachmentsSectionId).append('&nbsp;&nbsp;<span class="attachmentsSectionDescription"> - [no description]' + description + '</span>'); // Leave the description variable here because then we will know if something unexpected happens.

                            //            html += '<br /><span class="attachmentsSectionDescription"> - [no description]' + description + '</span>';

                            //        }

                            //        if (size && size.toLowerCase && (size.toLowerCase() != 'na')) {
                            //            html += '<br /><span class="attachmentsSectionDescription">' + size + ' MB</span>';
                            //        } else {
                            //            html += '<br /><span class="attachmentsSectionDescription" style="">[size unavailable]</span>';
                            //        }

                            //        //if (showRemoveAttachmentButton && (showRemoveAttachmentButton == 'true')) {
                            //        //    //$('#' + attachmentsSectionId).append("&nbsp;&nbsp;<input type=\"button\" style=\"cursor:pointer;\" id=\"removeBudgetRequestAttachment" + i + "\" value=\"Remove\" onclick=\"removeAttachment('" + filename + "', '" + attachmentsSectionId + "', '" + _workflowAppId + "', '" + _budgetRequestId + "');\" />");

                            //        //    html += '&nbsp;&nbsp;<input type="button" style="cursor:pointer;" id="removeBudgetRequestAttachment' + i + '" value="Remove" onclick="removeAttachment(\'' + filename + '\', \'' + attachmentsTagId + '\', \'' + bwWorkflowAppId + '\', \'' + bwBudgetRequestId + '\');" />';
                            //        //}

                            //        html += '</div>';

                            //        html += '</br>';

                            //        $('#' + dialogId + '_BodyEditor_Attachments').append(html);

                            //    }
                            //}





                        } else if (data) {
                            //alert('xcx231234234-5 data: ' + JSON.stringify(data));
                            $('#' + dialogId + '_BodyEditor').innerHTML = '<span xcx="xcx22945-1" style="color:tomato;">No attachments found: ' + JSON.stringify(data) + '</span>';

                        } else {
                            //displayAlertDialog('xcx231234234-6 data: ' + JSON.stringify(data));
                            $('#' + dialogId + '_BodyEditor').innerHTML = '<span xcx="xcx22945-1" style="color:tomato;">ERROR: Unexpected response: ' + JSON.stringify(data) + '</span>';
                        }
                    } catch (e) {
                        console.log('Exception in bwAttachments_MusicPlaylist.js.copyAttachments.dialog.open.ajax.success(): ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwAttachments_MusicPlaylist.js.copyAttachments.dialog.open.ajax.success(): ' + e.message + ', ' + e.stack);
                    }

                },
                error: function (data, errorCode, errorMessage) {
                    console.log('Error in bwAttachments_MusicPlaylist.js.copyAttachments.dialog.open.ajax.error(): ' + errorMessage + ', workflowAppId: ' + workflowAppId + ', bwBudgetRequestId: ' + bwBudgetRequestId + ', participantId: ' + participantId);
                    displayAlertDialog('Error in bwAttachments_MusicPlaylist.js.copyAttachments.dialog.open.ajax.error(): ' + errorMessage + ', workflowAppId: ' + workflowAppId + ', bwBudgetRequestId: ' + bwBudgetRequestId + ', participantId: ' + participantId);
                }
            });

        } catch (e) {
            console.log('Exception in bwAttachments_MusicPlaylist.js.performOCR_MultipleImages(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwAttachments_MusicPlaylist.js.performOCR_MultipleImages(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwAttachments_MusicPlaylist.js.performOCR_MultipleImages(): ' + e.message + ', ' + e.stack);
        }
    },

    performCHATGPT_MultipleImages: function (requestDialogId, bwBudgetRequestId, bwRequestTitle, bwRequestTypeId) { // filename) {
        try {
            console.log('In bwAttachments_MusicPlaylist.js.performCHATGPT_MultipleImages().');
            var thiz = this;
            //alert('In bwAttachments_MusicPlaylist.js.performCHATGPT_MultipleImages().'); // bwBudgetRequestId: ' + bwBudgetRequestId + ', filename: ' + filename);

            //
            // We need to display a dialog which has a place for the user to ask their question. Maybe put in a default question to start with (see below).
            //   - "Should I use npm to start a node.js application?"
            //

            var dialogId = 'divPerformCHATGPT_MultipleImages_' + thiz.options.elementIdSuffix;

            var div = document.getElementById(dialogId);
            if (!div) {

                div = document.createElement('div');
                div.id = dialogId;
                div.style.display = 'none';
                document.body.appendChild(div); // Place at end of document

                var html = '';

                //html += '<div style="display:none;" id="' + dialogId + '">';
                html += '  <table style="width:100%;">';
                html += '    <tr>';
                html += '      <td style="width:90%;">';
                html += '        <span style="color: #3f3f3f;font-size:30pt;font-weight:bold;">LLMxcx1</span>';
                html += '      </td>';
                html += '      <td style="width:9%;"></td>';
                html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
                html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#' + dialogId + '\').dialog(\'close\');">X</span>';
                html += '      </td>';
                html += '    </tr>';
                html += '  </table>';
                html += '  <br />';
                html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
                html += '  <br />';
                html += 'Enter your question:<br />';
                html += '  <input type="text" id="spanAttachmentAnalysisContent_' + thiz.options.elementIdSuffix + '" style="padding:8px 8px 8px 8px;font-size:15pt;width:500px;"></input>';
                html += '  <br /><br />';
                //html += 'Response:<br />';
                html += '  <div id="spanAttachmentAnalysisResponseContent_' + thiz.options.elementIdSuffix + '" style="padding:20px 20px 20px 20px;font-size:18pt;border:grey 1px solid;"></div>';
                html += '  <br /><br />';
                html += '  <div id="btnRunDiagnostics" onclick="$(\'.bwAttachments_MusicPlaylist:first\').bwAttachments_MusicPlaylist(\'performCHATGPT_MultipleImages_Invoke\');" class="divDialogButton" title="Click here to run the large language model...">';
                html += '   Click here to ask the question...';
                html += '  </div>';
                html += '  <br /><br />';
                html += '  <div class="divDialogButton" onclick="$(\'#' + dialogId + '\').dialog(\'close\');">';
                html += '   Close';
                html += '  </div>';
                html += '  <br />';
                html += '  <br />';
                //html += '</div>';

                div.innerHTML = html;
            }

            // Display a dialog box with a big textarea so that the contents can be copied and pasted.
            $('#' + dialogId).dialog({
                modal: true,
                resizable: false,
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                width: "820",
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false,//, // This means when hiding just disappear with no effects.
                open: function (event, ui) {
                    $('.ui-widget-overlay').bind('click', function () {
                        $('#' + dialogId).dialog('close');
                    });

                    var element = document.getElementById('spanAttachmentAnalysisContent_' + thiz.options.elementIdSuffix);
                    element.value = 'Should I use npm to start a node.js application';

                }, // This allows the dialog to close when clicked outside of the dialog. Only works for modal dialogs.
                close: function () {
                    $('#' + dialogId).dialog('destroy');
                }
            });
            //$("#divDisplayJsonDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

        } catch (e) {
            HideActivitySpinner();
            console.log('Exception in bwAttachments_MusicPlaylist.js.performCHATGPT_MultipleImages(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwAttachments_MusicPlaylist.js.performCHATGPT_MultipleImages(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwAttachments_MusicPlaylist.js.performCHATGPT_MultipleImages(): ' + e.message + ', ' + e.stack);
        }
    },
    performCHATGPT_MultipleImages_Invoke: function () {
        try {
            var thiz = this;
            ShowActivitySpinner("Processing your question...");

            var element = document.getElementById('spanAttachmentAnalysisContent_' + thiz.options.elementIdSuffix);
            var question = element.value

            //alert('ASKING THE QUESTION: ' + question);




            //var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            //var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

            //var preventCachingGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            //    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            //    return v.toString(16);
            //});

            //ShowActivitySpinner('Performing Optical Character Recognition (OCR)...performCHATGPT_MultipleImages()...');

            //var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            //var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            //var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

            //var preventCachingGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            //    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            //    return v.toString(16);
            //});

            //var data = {
            //    bwParticipantId_LoggedIn: participantId,
            //    bwActiveStateIdentifier: activeStateIdentifier,
            //    bwWorkflowAppId_LoggedIn: workflowAppId,

            //    bwWorkflowAppId: workflowAppId,
            //    bwBudgetRequestId: bwBudgetRequestId
            //};

            var data = {
                question: question
            }
            debugger;
            var operationUri = this.options.operationUriPrefix + '_llm/test';
            $.ajax({
                url: operationUri,
                type: 'POST',
                data: data,
                //timeout: 15000, // This is done because file services may need more time. 
                headers: { "Accept": "application/json; odata=verbose" },
                success: function (results) {
                    try {
                        debugger;
                        //var data = results.data;
                        HideActivitySpinner();

                        setTimeout(function () {
                            //alert('RETURNED: ' + JSON.stringify(results));
                            // THIS IS WHERE WE DISPLAY THE ANSWER TO THE USER.
                            var element = document.getElementById('spanAttachmentAnalysisResponseContent_' + thiz.options.elementIdSuffix);

                            element.innerHTML = results.answer + '<br />';

                        }, 100);


                        //if (results.status != 'SUCCESS') {
                        //    //alert('xcx231234234-2 data: ' + JSON.stringify(data));
                        //    $('#' + dialogId + '_BodyEditor').html('<span style="color:tomato;">[Unexpected response from the file server]</span>');

                        //} else if (results.message.indexOf('ENOENT') > -1) {
                        //    //alert('xcx231234234-3 data: ' + JSON.stringify(data));
                        //    // No such file or directory
                        //    console.log('[Server response: No such file or directory: ' + data.path + ']. This is probably Ok.?');

                        //} else if (data && data.length && (data.length > 0)) {

                        //    var promiseArray = [];

                        //    for (var i = 0; i < data.length; i++) {

                        //        var image1 = thiz.options.operationUriPrefix + '_files/' + workflowAppId + '/' + bwBudgetRequestId + '/' + data[i].Display_Filename + '?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + JSON.parse(activeStateIdentifier).ActiveStateIdentifier;

                        //        var promise = Tesseract.recognize(image1, 'eng', { logger: function (m) { console.log(m); } })
                        //            .then(function (results) {
                        //                try {
                        //                    displayAlertDialog_Persistent(results.data.text); // + ', confidence: ' + results.data.confidence); // + ', ImageUrl: ' + results.results.data.ImageUrl);

                        //                } catch (e) {

                        //                    console.log('EXCEPTION xcx123123: ' + e.message + ', ' + e.stack);
                        //                    displayAlertDialog('EXCEPTION xcx123123: ' + e.message + ', ' + e.stack);

                        //                }
                        //            }).catch(function (e, f, g) {

                        //                console.log('EXCEPTION XCX32234235455 ' + JSON.stringify(e));
                        //                displayAlertDialog('EXCEPTION XCX32234235455 image1: ' + image1 + ', ' + JSON.stringify(e) + ', f: ' + +JSON.stringify(f) + ', g: ' + +JSON.stringify(g));

                        //            });

                        //        promiseArray.push(promise);

                        //    }

                        //    Promise.all(promiseArray)
                        //        .then(function (results) {

                        //            HideActivitySpinner();

                        //        }).catch(function (e, f, g) {

                        //            HideActivitySpinner();
                        //            alert('Exception xcx9087089: ' + JSON.stringify(e));

                        //        });



                        //} else if (data) {
                        //    //alert('xcx231234234-5 data: ' + JSON.stringify(data));
                        //    $('#' + dialogId + '_BodyEditor').innerHTML = '<span xcx="xcx22945-1" style="color:tomato;">No attachments found: ' + JSON.stringify(data) + '</span>';

                        //} else {
                        //    //displayAlertDialog('xcx231234234-6 data: ' + JSON.stringify(data));
                        //    $('#' + dialogId + '_BodyEditor').innerHTML = '<span xcx="xcx22945-1" style="color:tomato;">ERROR: Unexpected response: ' + JSON.stringify(data) + '</span>';
                        //}
                    } catch (e) {
                        HideActivitySpinner();
                        console.log('Exception in bwAttachments_MusicPlaylist.js.copyAttachments.dialog.open.ajax.success(): ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwAttachments_MusicPlaylist.js.copyAttachments.dialog.open.ajax.success(): ' + e.message + ', ' + e.stack);
                    }

                },
                error: function (data, errorCode, errorMessage) {
                    HideActivitySpinner();
                    debugger;
                    console.log('Error in bwAttachments_MusicPlaylist.js.copyAttachments.dialog.open.ajax.error(): ' + errorMessage + ', workflowAppId: ' + workflowAppId + ', bwBudgetRequestId: ' + bwBudgetRequestId + ', participantId: ' + participantId);
                    displayAlertDialog('Error in bwAttachments_MusicPlaylist.js.copyAttachments.dialog.open.ajax.error(): ' + errorMessage + ', workflowAppId: ' + workflowAppId + ', bwBudgetRequestId: ' + bwBudgetRequestId + ', participantId: ' + participantId);
                }
            });


        } catch (e) {
            HideActivitySpinner();
            console.log('Exception in bwAttachments_MusicPlaylist.js.performCHATGPT_MultipleImages_Invoke(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwAttachments_MusicPlaylist.js.performCHATGPT_MultipleImages_Invoke(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwAttachments_MusicPlaylist.js.performCHATGPT_MultipleImages_Invoke(): ' + e.message + ', ' + e.stack);
        }
    },


    repairFileType: function (bwBudgetRequestId, originalFilename) {
        try {
            console.log('In bwAttachments_MusicPlaylist.js.repairFileType().');
            var thiz = this;

            // Attempt to repair this file by entering a new file name, with the correct extension:

            var div = document.getElementById('divRepairFileTypeDialog');
            if (!div) {

                console.log('In bwAttachments_MusicPlaylist.js.repairFileType(). adding element to the dom: ' + 'divRepairFileTypeDialog');

                div = document.createElement('div');
                div.id = 'divRepairFileTypeDialog';
                div.style.display = 'none';
                document.body.appendChild(div); // Place at end of document

            }

            var html = '';

            html += '        <table style="width:100%;">';
            html += '            <tr>';
            html += '                <td style="width:90%;">';
            html += '                    <span id="spanDeleteAnAttachmentOfflineDialogTitlexcx21312" style="color: #3f3f3f;font-size: 60pt;font-weight:bold;">Rename File</span>';
            html += '                </td>';
            html += '                <td style="width:9%;"></td>';
            html += '                <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '                    <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 120pt;font-weight:bold;" onclick="$(\'#divRepairFileTypeDialog\').dialog(\'close\');">X</span>';
            html += '                </td>';
            html += '            </tr>';
            html += '        </table>';
            html += '        <br />';
            html += '        <span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;">';
            html += ' Attempt to repair this file by entering a new file name, with the correct extension:';
            html += '        </span>';
            html += '        <br />';
            html += '        <input type="text" id="divRepairFileTypeDialog_NewFilename" style="width:900px;font-size:18pt;" value="' + originalFilename + '" />';
            html += '        <br />';
            html += '        <br />';
            html += '        <div id="divRepairFileTypeDialog_RenameFileButton" class="divDialogButton">';
            html += '            Rename';
            html += '        </div>';
            html += '        <br /><br />';
            html += '       <div class="divDialogButton" onclick="$(\'#divRepairFileTypeDialog\').dialog(\'close\');">';
            html += '           Close';
            html += '        </div>';
            html += '        <br /><br />';
            html += '        <br /><br />';

            div.innerHTML = html;

            $('#divRepairFileTypeDialog').dialog({
                modal: true,
                resizable: false,
                closeText: "Cancel",
                closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                width: "1000", //"570px",
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {
                    $('.ui-widget-overlay').bind('click', function () {
                        $("#divRepairFileTypeDialog").dialog('close');
                    });
                }
            });

            // Hide the title bar.
            $("#divRepairFileTypeDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

            // Set the click event for the Rename button.
            $('#divRepairFileTypeDialog_RenameFileButton').off('click').click(function (error) {
                try {

                    var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                    var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
                    var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                    var data = {
                        bwWorkflowAppId_LoggedIn: workflowAppId,
                        bwParticipantId_LoggedIn: participantId,
                        bwActiveStateIdentifier: activeStateIdentifier,

                        bwWorkflowAppId: workflowAppId,
                        bwBudgetRequestId: bwBudgetRequestId,
                        OriginalFilename: originalFilename,
                        NewFilename: $('#divRepairFileTypeDialog_NewFilename').val()
                    };
                    var operationUri = thiz.options.operationUriPrefix + "_files/renameafile";
                    $.ajax({
                        url: operationUri,
                        type: "POST",
                        data: data,
                        headers: {
                            "Accept": "application/json; odata=verbose"
                        },
                        success: function (results) {
                            try {

                                $("#divRepairFileTypeDialog").dialog('close');

                                if (results.status != 'SUCCESS') {

                                    displayAlertDialog(results.message);

                                } else {

                                    displayAlertDialog(results.message);

                                }

                            } catch (e) {
                                console.log('Exception in bwAttachments_MusicPlaylist.js.repairFileType.post.removeattachment.success(): ' + e.message + ', ' + e.stack);
                                displayAlertDialog('Exception in bwAttachments_MusicPlaylist.js.repairFileType.post.removeattachment.success(): ' + e.message + ', ' + e.stack);
                            }
                        },
                        error: function (data, errorCode, errorMessage) {
                            console.log('Error in bwAttachments_MusicPlaylist.js.repairFileType.post.removeattachment.error(): ' + e.message + ', ' + e.stack);
                            displayAlertDialog('Error in bwAttachments_MusicPlaylist.js.repairFileType.post.removeattachment.error(): bwBudgetRequestId: ' + bwBudgetRequestId + ', filename: ' + filename + ', errorMessage: ' + errorMessage);
                        }
                    });
                } catch (e) {
                    console.log('Exception in bwAttachments_MusicPlaylist.js.repairFileType.deletebutton.click(): ' + e.message + ', ' + e.stack);
                    displayAlertDialog('Exception in bwAttachments_MusicPlaylist.js.repairFileType.deletebutton.click(): ' + e.message + ', ' + e.stack);
                }
            });


        } catch (e) {
            console.log('Exception in bwAttachments_MusicPlaylist.js.repairFileType(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwAttachments_MusicPlaylist.js.repairFileType(): ' + e.message + ', ' + e.stack);
        }
    },


    copyAttachments: function (attachmentsElementId, requestDialogId, bwBudgetRequestId, bwRequestTitle, bwRequestTypeId) { // bwrequesttitle, bwrequesttypeid
        try {
            console.log('In bwAttachments_MusicPlaylist.js.copyAttachments().');
            //alert('In bwAttachments_MusicPlaylist.js.copyAttachments().');
            var thiz = this;

            var externallyFacingUrlForAttachments = $('.bwAuthentication').bwAuthentication('option', 'externallyFacingUrlForAttachments');
            //var externallyFacingUrlForAttachmentsSourceFolder = $('.bwAuthentication').bwAuthentication('option', 'externallyFacingUrlForAttachmentsSourceFolder');

            if (!externallyFacingUrlForAttachments) {

                // This functionality is not currently available. An external URL has to be configured in the "Configuration > Organization Settings".
                displayAlertDialog('This functionality is not currently available. An external URL has to be configured in the "Configuration > Organization Settings".');

            } else {

                var dialogId = 'divEmailAttachmentsDialog_bwAttachments_MusicPlaylist_' + this.options.elementIdSuffix;
                var div = document.getElementById(dialogId); // 4-1-2020 12-28pm adt.
                if (!div) {
                    //alert('In bwAttachments_MusicPlaylist.js.copyAttachments(). Adding ' + dialogId + ' to the DOM.');
                    div = document.createElement('div');
                    div.id = dialogId;
                    div.style.display = 'none';
                    document.body.appendChild(div); // to place at end of document
                } else {
                    try {
                        $(div).dialog('close');
                    } catch (e) { }
                }



                //if (!div) {
                //    div = document.createElement('div');
                //    div.id = dialogId;
                //    div.style.display = 'none';
                //    document.body.appendChild(div); // to place at end of document

                var html = '';
                html += '<table>';
                html += '   <tr>';
                html += '       <td>';
                html += '           <span id="spanConfigureEmailNotificationsDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:30pt;font-weight:bold;">';
                html += '               Copy attachments to ' + externallyFacingUrlForAttachments + '';
                html += '           </span>';
                html += '           <br />';
                html += '           <span id="spanConfigureEmailNotificationsDialogSubTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:15pt;font-weight:normal;">';
                html += '               The recipients of this email will be able to access the attachments using the included links. xcx123124-1.';
                html += '           </span>';
                html += '           <span id="spanConfigureEmailNotificationsDialogInstructionText_EditButton"></span>';
                html += '       </td>';
                html += '       <td style="width:9%;"></td>';
                html += '       <td style="width:1%;cursor:pointer;vertical-align:top;">';
                html += '           <span class="dialogXButton" style="font-size:35pt;cursor:pointer;width:100%;font-weight:bold;" onclick="$(\'#' + dialogId + '\').dialog(\'close\');">X</span>';
                html += '       </td>';
                html += '   </tr>';
                html += '</table>';
                html += '<input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
                html += '<br />';

                //var divEmailRecipients = 'divEmailAttachmentsDialog_bwAttachments_MusicPlaylist_bwPeoplePicker_EmailRecipients_' + this.options.elementIdSuffix;
                //html += '<div id="' + divEmailRecipients + '"></div>';
                //html += '<br />';

                //html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
                //html += '   Subject:';
                //html += '</span>';
                //html == '<br />';
                ////html += '<input type="text" id="' + dialogId + '_SubjectEditor" style="WIDTH: 100%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 12pt;">';
                //html += '<input type="text" id="' + dialogId + '_SubjectEditor" style="WIDTH: 100%;font-family:sans-serif;color: #262626;font-size: 14pt;" />';
                //html += '<br /><br />';
                //html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
                //html += '   Body:';
                //html += '</span>';
                //html == '<br />';
                html += '<div id="' + dialogId + '_BodyEditor" style="height:500px;"></div>'; // Quill. // This is where we set the height of the editor.
                html += '<br />';

                html += '<div style="white-space:nowrap;">';
                //html += '<div class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" onclick="$(\'.bwAttachments_MusicPlaylist\').bwAttachments_MusicPlaylist(\'emailAttachments\',\'newrequestattachments\', \'' + requestDialogId + '\', \'' + bwBudgetRequestId + '\', \'' + bwRequestTitle + '\', \'' + bwRequestTypeId + '\');">';

                html += '<div class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" onclick="$(\'.bwAttachments_MusicPlaylist\').bwAttachments_MusicPlaylist(\'copyFiles\',\'newrequestattachments\', \'' + requestDialogId + '\', \'' + bwBudgetRequestId + '\', \'' + bwRequestTitle + '\', \'' + bwRequestTypeId + '\');">';


                html += 'Copy Selected Files to ' + externallyFacingUrlForAttachments;
                html += '</div>'; // ☑ 
                //html += '&nbsp;&nbsp;';
                //html += '<div class="divSignInButton_Disabled" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" onclick="$(\'.bwAttachments_MusicPlaylist\').bwAttachments_MusicPlaylist(\'sendEmail\', \'' + requestDialogId + '\', \'' + bwBudgetRequestId + '\');">';
                //html += 'Send Email';
                //html += '</div>'; // ☑ 
                html += '</div>';

                html += '<br />';
                html += '<div class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" onclick="$(\'#' + dialogId + '\').dialog(\'close\');">Cancel</div>'; // ☑ 
                html += '<br /><br />';

                div.innerHTML = html;
                //}



                //alert('xcx32423124 displaying dialog ' + dialogId);
                $('#' + dialogId).dialog({
                    modal: true,
                    resizable: false,
                    closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                    width: '650px', // THIS ALWAYS HAS TO BE LESS THAT THE WIDTH OF A SMALL DEVICE, OTHERWISE THE MOST IMPOORTANT FUNCTIONALITY DOESN'T WORK. 8-4-2023.
                    dialogClass: 'no-close', // No close button in the upper right corner.
                    hide: false, // This means when hiding just disappear with no effects.
                    close: function () {
                        //$('#' + dialogId).dialog('destroy');
                        $(this).dialog('destroy');
                    },
                    open: function () {
                        try {
                            //var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                            var workflowAppTitle = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTitle');
                            var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');
                            var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');

                            var bwEnabledRequestTypes = $('.bwAuthentication').bwAuthentication('option', 'bwEnabledRequestTypes').EnabledItems;

                            var selectedRequestType_SingletonName;
                            for (var i = 0; i < bwEnabledRequestTypes.length; i++) {
                                if (bwRequestTypeId == bwEnabledRequestTypes[i].bwRequestTypeId) {
                                    selectedRequestType_SingletonName = bwEnabledRequestTypes[i].SingletonName;
                                }
                            }





                            //alert('xcx098098098098098098');

                            // 11-8-2022
                            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

                            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

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

                                        var data = results.data;

                                        if (results.status != 'SUCCESS') {
                                            //alert('xcx231234234-2 data: ' + JSON.stringify(data));
                                            $('#' + dialogId + '_BodyEditor').html('<span style="color:tomato;">[Unexpected response from the file server]</span>');

                                        } else if (results.message.indexOf('ENOENT') > -1) {
                                            //alert('xcx231234234-3 data: ' + JSON.stringify(data));
                                            // No such file or directory
                                            console.log('[Server response: No such file or directory: ' + data.path + ']. This is probably Ok.?');

                                        } else if (data && data.length && (data.length > 0)) {
                                            //alert('xcx231234234-4 data: ' + JSON.stringify(data));
                                            //alert('xcx231234234 data: ' + JSON.stringify(data));

                                            var html = '';
                                            var now = new Date();
                                            var folderName = now.toLocaleDateString().replace(/\//g, '-');

                                            html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:25pt;font-weight:bold;">';
                                            html += '   Choose a name for the sub-folder:&nbsp;&nbsp;<input id="txtSubfolder_' + thiz.options.elementIdSuffix + '" type="text" value="' + folderName + '" />';
                                            html += '</span>';
                                            html += '<br />';
                                            html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:25pt;font-weight:bold;">';
                                            html += '   Select the file(s) you wish to copy to the external URL, then click the "Copy" button.';
                                            html += '</span>';
                                            $('#' + dialogId + '_BodyEditor').html(html); // It worked, and here were attachments, so get rid of the message.

                                            //
                                            // Display the image thumbnail.
                                            //
                                            var displayImageThumbnail = function (imgId, thumbnailUrl) {
                                                $.get(thumbnailUrl).done(function () {
                                                    //debugger;
                                                    var img = new Image();
                                                    img.src = thumbnailUrl;
                                                    img.onload = function (e) {
                                                        try {

                                                            //alert('Displaying thumbnail 2: ' + thumbnailUrl);
                                                            document.getElementById(imgId).src = thumbnailUrl; // There is a thumbnail, so display it.
                                                            //displayAlertDialog('Displayed the thumbnail xcx2357 imgId: ' + imgId + ', thumbnailUrl: ' + thumbnailUrl);
                                                        } catch (e) {

                                                            alert('xcx2312 exception 2: ' + e.message + ', ' + e.stack);

                                                            console.log('Exception in bwAttachments_MusicPlaylist.js.copyAttachments.displayImageThumbnail(): ' + e.message + ', ' + e.stack);
                                                            displayAlertDialog('Exception in bwAttachments_MusicPlaylist.js.copyAttachments.displayImageThumbnail(): ' + e.message + ', ' + e.stack);
                                                            document.getElementById(imgId).src = globalUrlPrefix + globalUrl + '/images/mp4.jfif'; // There is no thumbnail, so display the icon.
                                                        }


                                                        //try {
                                                        //    alert('Displaying thumbnail 2: ' + thumbnailUrl);
                                                        //    document.getElementById(imgId).src = thumbnailUrl; // There is a thumbnail, so display it.
                                                        //} catch (e) {
                                                        //    alert('xcx2312 exception 2: ' + e.message + ', ' + e.stack);
                                                        //    document.getElementById(imgId).src = globalUrlPrefix + globalUrl + '/images/mp4.jfif'; // There is no thumbnail, so display the icon.
                                                        //}
                                                    }
                                                }).fail(function (result) {

                                                    alert('fail in Displaying thumbnail 1: ' + thumbnailUrl);

                                                    console.log('Fail in bwAttachments_MusicPlaylist.js.copyAttachments.displayImageThumbnail(): ' + JSON.stringify(result));
                                                    displayAlertDialog('Fail in bwAttachments_MusicPlaylist.js.copyAttachments.displayImageThumbnail(): ' + JSON.stringify(result));
                                                    document.getElementById(imgId).src = globalUrlPrefix + globalUrl + '/images/mp4.jfif'; // There is no thumbnail, so display the icon.
                                                });
                                            }







                                            var html = '';

                                            html += '<div id="' + dialogId + '_BodyEditor_Attachments" style="overflow-y:scroll;scroll-behavior:smooth;max-height:500px;padding-left:20px;">'; // Need auto-scroll here.
                                            html += '</div>';

                                            $('#' + dialogId + '_BodyEditor').append(html);





                                            for (var i = 0; i < data.length; i++) {



                                                //alert('xcx444432 data[i]: ' + JSON.stringify(data[i]));


                                                var filename = data[i].Display_Filename;
                                                if (filename.indexOf('_thumbnail_') > -1) {

                                                    // This is a thumbnail. Do not display as an attachment.

                                                } else {
                                                    console.log('xcx123123 description');
                                                    // This is an actual attachment. Display it!
                                                    var description = data[i].Description;
                                                    var size = data[i].Size;
                                                    if (size && size.toLowerCase && (size.toLowerCase() != 'na')) {
                                                        size = (Number(size) / 1000000).toFixed(1);
                                                    }

                                                    //var fileUrl = "_files/" + workflowAppId + "/" + bwBudgetRequestId + "/" + filename;

                                                    var fileUrl;


                                                    var activeStateIdentifier = JSON.parse($('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier'));

                                                    if (activeStateIdentifier.status != 'SUCCESS') {

                                                        //html += '[No image. Unauthorized. xcx213124-3-22]';

                                                        fileUrl = '[No image. Unauthorized. xcx213124-3-22x]';


                                                    } else {

                                                        //var imagePath = thiz.options.operationUriPrefix + '_files/' + workflowAppId + '/inventoryimages/' + thiz.options.InventoryItems[i].bwInventoryItemId + '/inventoryimage.png?v=' + guid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier;
                                                        //html += '<img xcx="xcx2342462" id="orgImage_' + i + '" src="' + imagePath + '" style="height:120px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;" alt="" onclick="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'btnEdit_OnClick\', \'' + thiz.options.InventoryItems[i].bwInventoryItemId + '\');">';


                                                        //fileUrl = "_files/" + workflowAppId + "/" + bwBudgetRequestId + "/" + filename + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier;

                                                        //  var filename = data[i].Display_Filename;
                                                        fileUrl = "_files/" + workflowAppId + "/" + bwBudgetRequestId + "/" + data[i].Actual_Filename + '?ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier; // 6-2-2023

                                                    }












                                                    // Centered on the screen.
                                                    var width = 800;
                                                    var height = 600;
                                                    var left = (screen.width - width) / 2;
                                                    var top = (screen.height - height) / 2;

                                                    var html = '';

                                                    html += '<table style="width:100%;" xcx="xcx3254367">';
                                                    html += '  <tr>';
                                                    html += '    <td style="width:10%;">';




                                                    html += '<table>';
                                                    html += '   <tr>';
                                                    html += '       <td>';
                                                    html += '           <input style="transform: scale(3);" bwfilename="' + filename + '" bwfiledescription="' + description + '" bwfilesize="' + size + '" class="cbAttachment" type="checkbox" />';
                                                    html += '       </td>';
                                                    html += '       <td>&nbsp;&nbsp;</td>';
                                                    html += '       <td>';

                                                    var extensionIndex = filename.split('.').length - 1;
                                                    var fileExtension = filename.toLowerCase().split('.')[extensionIndex];

                                                    if (fileExtension == 'png' || fileExtension == 'jpg' || fileExtension == 'jpeg' || fileExtension == 'jfif' || fileExtension == 'webp' || fileExtension == 'gif') {

                                                        html += '<img id="attachmentstest1" xcx="xcx2312-1" src="' + thiz.options.operationUriPrefix + fileUrl + '" style="height:120px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;" alt="" ';
                                                        if (Platform == 'IOS8') {
                                                            html += 'onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');"';
                                                        } else {
                                                            html += 'onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');" ';
                                                        }
                                                        html += ' />';
                                                    } else if (fileExtension == 'xlsx' || fileExtension == 'xls') {

                                                        // We need an if statement here to choose between iOS and Windows.
                                                        if (Platform == 'IOS8') {
                                                            html += '<img src="images/excelicon.png" style="width:100px;cursor:pointer;" onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');" />';
                                                            //html += '<div class="attachmentsSectionFileLink" style="height:50px;border:1px thin red;" onclick="displayAttachmentInDialog(\'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');">';
                                                        } else {
                                                            html += '<img src="images/excelicon.png" style="width:100px;cursor:pointer;" onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');" />';
                                                            //html += '<div style="cursor:pointer;" class="attachmentsSectionFileLink" onclick="displayAttachmentInDialog(\'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');">';
                                                        }

                                                    } else if (fileExtension == 'pdf') {

                                                        //html += '<img src="images/pdf.png" style="width:100px;cursor:pointer;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');" />';

                                                        ////html += '<img src="images/excelicon.png" style="width:100px;height:46px;" />';
                                                        //// We need an if statement here to choose between iOS and Windows.
                                                        ////if (Platform == 'IOS8') {
                                                        ////    html += '<img src="images/excelicon.png" style="width:100px;height:46px;cursor:pointer;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');" />';
                                                        ////    //html += '<div class="attachmentsSectionFileLink" style="height:50px;border:1px thin red;" onclick="displayAttachmentInDialog(\'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');">';
                                                        ////} else {
                                                        //html += '<img src="images/pdf.png" style="width:100px;cursor:pointer;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');" />';
                                                        ////html += '<div style="cursor:pointer;" class="attachmentsSectionFileLink" onclick="displayAttachmentInDialog(\'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');">';
                                                        ////}


                                                        var imgId = 'img_bwAttachments_MusicPlaylist_' + thiz.options.elementIdSuffix + '_' + bwBudgetRequestId + '_' + i;

                                                        //
                                                        //
                                                        // THIS THUMBNAIL COULD BE A WHOLE LOT SMALLER 11-10-2023.
                                                        //
                                                        //
                                                        var thumbnailUrl = thiz.options.operationUriPrefix + "_files/" + workflowAppId + "/" + bwBudgetRequestId + "/" + filename + '_thumbnail_320px_pdf_.png';

                                                        html += '<img xcx="xcx3396048" id="' + imgId + '" style="height:120px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;" alt="" src="' + thumbnailUrl + '" ';
                                                        html += '   onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');" ';
                                                        html += ' />';
                                                        //var thumbnailUrl = "_files/" + workflowAppId + "/" + bwBudgetRequestId + "/" + filename + '_thumbnail_' + '.jpg'; // thiz.options.operationUriPrefix

                                                        //var thumbnailUrl = thiz.options.operationUriPrefix + "_files/" + workflowAppId + "/" + bwBudgetRequestId + "/" + filename + '_thumbnail_' + '.jpg';
                                                        //alert('xcx1111111 thumbnailUrl: ' + thumbnailUrl);
                                                        //alert('imgId: ' + imgId);
                                                        displayImageThumbnail(imgId, thumbnailUrl);


                                                    } else if (fileExtension == 'mp4') {

                                                        var imgId = 'img_bwAttachments_MusicPlaylist_' + thiz.options.elementIdSuffix + '_' + bwBudgetRequestId + '_' + i;

                                                        var thumbnailUrl = thiz.options.operationUriPrefix + "_files/" + workflowAppId + "/" + bwBudgetRequestId + "/" + filename + '_thumbnail_.png'; // ' + '.jpg';

                                                        html += '<img xcx="xcx3396048" id="' + imgId + '" style="height:120px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;" alt="" src="' + thumbnailUrl + '" ';
                                                        html += '   onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');" ';
                                                        html += ' />';
                                                        //var thumbnailUrl = "_files/" + workflowAppId + "/" + bwBudgetRequestId + "/" + filename + '_thumbnail_' + '.jpg'; // thiz.options.operationUriPrefix

                                                        //var thumbnailUrl = thiz.options.operationUriPrefix + "_files/" + workflowAppId + "/" + bwBudgetRequestId + "/" + filename + '_thumbnail_' + '.jpg';
                                                        //alert('xcx1111111 thumbnailUrl: ' + thumbnailUrl);
                                                        //alert('imgId: ' + imgId);
                                                        displayImageThumbnail(imgId, thumbnailUrl);

                                                    } else if (fileExtension == 'rtf') {

                                                        html += '<img src="images/rtf.png" style="width:50px;cursor:pointer;" ';

                                                        html += 'onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');" ';
                                                        html += ' />';
                                                    } else if (fileExtension == 'vob') {

                                                        html += '<img src="images/vob.png" style="width:50px;cursor:pointer;" ';

                                                        html += 'onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');" ';
                                                        html += ' />';
                                                    } else if (fileExtension == 'mp3') {

                                                        html += '<img src="images/mp3.png" style="width:50px;cursor:pointer;" ';

                                                        html += 'onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');" ';
                                                        html += ' />';
                                                    }

                                                    html += '       </td>';
                                                    html += '   </tr>';
                                                    html += '</table>';





                                                    html += '    </td>';
                                                    html += '    <td style="width:90%;white-space:normal;">';

                                                    // We need an if statement here to choose between iOS and Windows.
                                                    if (Platform == 'IOS8') {
                                                        html += '<div xcx="xcx21342346-1" class="attachmentsSectionFileLink" style="height:50px;border:1px thin red;" onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');">';
                                                    } else {
                                                        html += '<div xcx="xcx21342346-2" class="attachmentsSectionFileLink" style="cursor:pointer;white-space:nowrap;width:250px;" onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');">';
                                                    }

                                                    html += filename;

                                                    // Display the file attachment description.
                                                    if (description.length > 0) {
                                                        html += '<br /><span class="attachmentsSectionDescription"> - "' + description + '"</span>';
                                                    } else {
                                                        html += '<br /><span class="attachmentsSectionDescription"> - [no description]' + description + '</span>';
                                                    }

                                                    if (size && size.toLowerCase && (size.toLowerCase() != 'na')) {
                                                        html += '<br /><span class="attachmentsSectionDescription">' + size + ' MB</span>';
                                                    } else {
                                                        html += '<br /><span class="attachmentsSectionDescription" style="">[size unavailable]</span>';
                                                    }

                                                    //if (showRemoveAttachmentButton && (showRemoveAttachmentButton == 'true')) {
                                                    //    //$('#' + attachmentsSectionId).append("&nbsp;&nbsp;<input type=\"button\" style=\"cursor:pointer;\" id=\"removeBudgetRequestAttachment" + i + "\" value=\"Remove\" onclick=\"removeAttachment('" + filename + "', '" + attachmentsSectionId + "', '" + _workflowAppId + "', '" + _budgetRequestId + "');\" />");

                                                    //    html += '&nbsp;&nbsp;<input type="button" style="cursor:pointer;" id="removeBudgetRequestAttachment' + i + '" value="Remove" onclick="removeAttachment(\'' + filename + '\', \'' + attachmentsTagId + '\', \'' + bwWorkflowAppId + '\', \'' + bwBudgetRequestId + '\');" />';
                                                    //}

                                                    html += '</div>';







                                                    html += '</br>';

                                                    $('#' + dialogId + '_BodyEditor_Attachments').append(html);

                                                }
                                            }





                                        } else if (data) {
                                            //alert('xcx231234234-5 data: ' + JSON.stringify(data));
                                            $('#' + dialogId + '_BodyEditor').innerHTML = '<span xcx="xcx22945-1" style="color:tomato;">No attachments found: ' + JSON.stringify(data) + '</span>';

                                        } else {
                                            //displayAlertDialog('xcx231234234-6 data: ' + JSON.stringify(data));
                                            $('#' + dialogId + '_BodyEditor').innerHTML = '<span xcx="xcx22945-1" style="color:tomato;">ERROR: Unexpected response: ' + JSON.stringify(data) + '</span>';
                                        }
                                    } catch (e) {
                                        console.log('Exception in bwAttachments_MusicPlaylist.js.copyAttachments.dialog.open.ajax.success(): ' + e.message + ', ' + e.stack);
                                        displayAlertDialog('Exception in bwAttachments_MusicPlaylist.js.copyAttachments.dialog.open.ajax.success(): ' + e.message + ', ' + e.stack);
                                    }

                                },
                                error: function (data, errorCode, errorMessage) {
                                    console.log('Error in bwAttachments_MusicPlaylist.js.copyAttachments.dialog.open.ajax.error(): ' + errorMessage + ', workflowAppId: ' + workflowAppId + ', bwBudgetRequestId: ' + bwBudgetRequestId + ', participantId: ' + participantId);
                                    displayAlertDialog('Error in bwAttachments_MusicPlaylist.js.copyAttachments.dialog.open.ajax.error(): ' + errorMessage + ', workflowAppId: ' + workflowAppId + ', bwBudgetRequestId: ' + bwBudgetRequestId + ', participantId: ' + participantId);
                                }
                            });
                        } catch (e) {
                            console.log('Exception in bwAttachments_MusicPlaylist.js.copyAttachments.dialog.open(): ' + e.message + ', ' + e.stack);
                            displayAlertDialog('Exception in bwAttachments_MusicPlaylist.js.copyAttachments.dialog.open(): ' + e.message + ', ' + e.stack);
                        }
                    }
                });
                //$('#divConfigureEmailNotificationsDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();
            }

        } catch (e) {
            console.log('Exception in bwAttachments_MusicPlaylist.js.copyAttachments(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwAttachments_MusicPlaylist.js.copyAttachments(): ' + e.message + ', ' + e.stack);
        }
    },
    copyFiles: function (attachmentsElementId, requestDialogId, bwBudgetRequestId, bwRequestTitle, bwRequestTypeId) {
        try {
            console.log('In bwAttachments_MusicPlaylist.js.copyFiles().');
            var thiz = this;

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');
            var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');

            var externallyFacingUrlForAttachments = $('.bwAuthentication').bwAuthentication('option', 'externallyFacingUrlForAttachments');

            var subfolder = document.getElementById('txtSubfolder_' + this.options.elementIdSuffix).value;

            var attachments = [];
            //var checkboxArray = [];
            var checkboxes = $('.cbAttachment');
            if (checkboxes && checkboxes.length) {
                for (var i = 0; i < checkboxes.length; i++) {
                    if (checkboxes[i].checked) {


                        // img_bwAttachments_MusicPlaylist_4143c511-8afa-4023-87fc-cac61c765957_8cad99af-1797-4d1b-9b9e-e98bb173b058_0


                        var img = $(checkboxes[i]).closest('tr').find('img')[0]; // added 6-2-2023.

                        if (!img) {

                            //displayAlertDialog('Error in bwAttachments_MusicPlaylist.js.copyFiles(). Could not locate the img element. Doing it anyway. xcx21345677-1');

                            //var subfolder = checkboxes[i].getAttribute('bwsubfolder');
                            var filename = checkboxes[i].getAttribute('bwfilename');
                            var description = checkboxes[i].getAttribute('bwfiledescription');
                            var size = checkboxes[i].getAttribute('bwfilesize');
                            var attachment = {
                                bwWorkflowAppId: workflowAppId,
                                bwBudgetRequestId: bwBudgetRequestId,
                                subfolder: subfolder,
                                Filename: filename,
                                Description: description,
                                Size: size,
                                File64bit: null // added 6-2-2023. // // Outlook (or rather Word, which renders HTML messages in Outlook), does not support embedded base64 encoded images. You would need to add image attachments, set their Content-id MIME header, and refer to images like that through the cid attribute (<img src="cid:xyz">)
                            }
                            attachments.push(attachment);

                        } else {

                            var c = document.createElement('canvas');
                            c.height = img.naturalHeight;
                            c.width = img.naturalWidth;
                            var ctx = c.getContext('2d');

                            ctx.drawImage(img, 0, 0, c.width, c.height);
                            var file64bit = c.toDataURL();

                            c.remove(); // We are done with it so remove it from the DOM.


                            //var subfolder = checkboxes[i].getAttribute('bwsubfolder');
                            var filename = checkboxes[i].getAttribute('bwfilename');
                            var description = checkboxes[i].getAttribute('bwfiledescription');
                            var size = checkboxes[i].getAttribute('bwfilesize');
                            var attachment = {
                                bwWorkflowAppId: workflowAppId,
                                bwBudgetRequestId: bwBudgetRequestId,
                                subfolder: subfolder,
                                Filename: filename,
                                Description: description,
                                Size: size,
                                File64bit: file64bit // added 6-2-2023. // // Outlook (or rather Word, which renders HTML messages in Outlook), does not support embedded base64 encoded images. You would need to add image attachments, set their Content-id MIME header, and refer to images like that through the cid attribute (<img src="cid:xyz">)
                            }
                            attachments.push(attachment);

                            //
                            // 4-14-2024
                            //
                            // Outlook (or rather Word, which renders HTML messages in Outlook), does not support embedded base64 encoded images.
                            // You would need to add image attachments, set their Content-id MIME header, and refer to images like that through the cid attribute (<img src="cid:xyz">)
                            //
                            // Maybe this? >> https://stackoverflow.com/questions/922898/embedding-attached-images-in-html-emails
                            //
                            // Not much here >> https://serverfault.com/questions/398962/does-the-presence-of-a-content-id-header-in-an-email-mime-mean-that-the-attachme

                        }

                    }
                }
            }

            // This is how the attachments are defined. These need to get copied to the "external attachments url", which is set in the "Organization settings". 
            //
            //var attachment = {
            //    bwWorkflowAppId: bwWorkflowAppId,
            //    subfolder: bwsubfolder,
            //    Filename: bwfilename
            //    Description: description,
            //    Size: size
            //}
            //attachments.push(attachment);


            //alert('attachments: ' + JSON.stringify(attachments));


            if (!(attachments.length > 0)) {

                displayAlertDialog('You have not selected any attachments.');
                HideActivitySpinner();

            } else {
                ShowActivitySpinner('Copying files to ' + externallyFacingUrlForAttachments);

                var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                data = {
                    bwParticipantId_LoggedIn: participantId,
                    bwActiveStateIdentifier: activeStateIdentifier,
                    bwWorkflowAppId_LoggedIn: workflowAppId,

                    bwWorkflowAppId: workflowAppId,
                    bwParticipantId: participantId,
                    bwParticipantFriendlyName: participantFriendlyName,
                    bwParticipantEmail: participantEmail,
                    //to: recipients,
                    //subject: subject,
                    //body: body,
                    attachments: JSON.stringify(attachments)
                };

                var operationUri = this.options.operationUriPrefix + "_files/emailattachmentsexternally";
                $.ajax({
                    url: operationUri,
                    type: "POST",
                    data: data,
                    timeout: 600000, // 10 minutes should be ample time. Although, sometimes the files are really large.
                    headers: {
                        "Accept": "application/json; odata=verbose"
                    },
                    success: function (results) {
                        try {

                            HideActivitySpinner();

                            if (results.status != 'SUCCESS') {

                                displayAlertDialog(results.message);

                            } else {

                                thiz.emailAttachments(attachmentsElementId, requestDialogId, bwBudgetRequestId, bwRequestTitle, bwRequestTypeId, attachments);

                            }
                        } catch (e) {
                            HideActivitySpinner();
                            console.log('Exception in bwAttachments_MusicPlaylist.js.copyFiles():1: ' + e.message + ', ' + e.stack);
                            displayAlertDialog('Exception in bwAttachments_MusicPlaylist.js.copyFiles():1: ' + e.message + ', ' + e.stack);
                        }
                    },
                    error: function (data, errorCode, errorMessage) {
                        HideActivitySpinner();
                        console.log('Error in bwAttachments_MusicPlaylist.js.copyFiles(): ' + errorCode + ' ' + errorMessage + ', data: ' + JSON.stringify(data));
                        displayAlertDialog('Error in bwAttachments_MusicPlaylist.js.copyFiles(): ' + errorCode + ' ' + errorMessage + ', data: ' + JSON.stringify(data));
                    }
                });

            }
        } catch (e) {
            HideActivitySpinner();
            console.log('Exception in bwAttachments_MusicPlaylist.js.copyFiles(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwAttachments_MusicPlaylist.js.copyFiles(): ' + e.message + ', ' + e.stack);
        }
    },
    emailAttachments: function (attachmentsElementId, requestDialogId, bwBudgetRequestId, bwRequestTitle, bwRequestTypeId, attachments) { // bwrequesttitle, bwrequesttypeid
        try {
            console.log('In bwAttachments_MusicPlaylist.js.emailAttachments().');
            //alert('In bwAttachments_MusicPlaylist.js.emailAttachments().');
            var thiz = this;

            var externallyFacingUrlForAttachments = $('.bwAuthentication').bwAuthentication('option', 'externallyFacingUrlForAttachments');
            //var externallyFacingUrlForAttachmentsSourceFolder = $('.bwAuthentication').bwAuthentication('option', 'externallyFacingUrlForAttachmentsSourceFolder');

            if (!externallyFacingUrlForAttachments) {

                // This functionality is not currently available. An external URL has to be configured in the "Configuration > Organization Settings".
                displayAlertDialog('This functionality is not currently available. An external URL has to be configured in the "Configuration > Organization Settings".');

            } else {

                var dialogId = 'divEmailAttachmentsDialog_bwAttachments_MusicPlaylist_' + this.options.elementIdSuffix;
                var div = document.getElementById(dialogId); // 4-1-2020 12-28pm adt.
                if (!div) {
                    div = document.createElement('div');
                    div.id = dialogId;
                    div.style.display = 'none';
                    document.body.appendChild(div); // to place at end of document
                } else {
                    $(div).dialog('close');
                }
                var html = '';
                html += '<table style="width:100%;">';
                html += '   <tr>';
                html += '       <td style="width:90%;">';
                html += '           <span id="spanConfigureEmailNotificationsDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:30pt;font-weight:bold;">';
                html += '               Email attachments as public links to ' + externallyFacingUrlForAttachments + '';
                html += '           </span>';
                html += '           <br />';
                html += '           <span id="spanConfigureEmailNotificationsDialogSubTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:15pt;font-weight:normal;">';
                html += '               The recipients of this email will be able to access the attachments using the included links. xcx123124-2.';
                html += '           </span>';
                html += '           <span id="spanConfigureEmailNotificationsDialogInstructionText_EditButton"></span>';
                html += '       </td>';
                html += '       <td style="width:9%;"></td>';
                html += '       <td style="width:1%;cursor:pointer;vertical-align:top;">';
                html += '           <span class="dialogXButton" style="font-size:35pt;cursor:pointer;width:100%;font-weight:bold;" onclick="$(\'#' + dialogId + '\').dialog(\'close\');">X</span>';
                html += '       </td>';
                html += '   </tr>';
                html += '</table>';
                html += '<input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
                html += '<br />';

                var divEmailRecipients = 'divEmailAttachmentsDialog_bwAttachments_MusicPlaylist_bwPeoplePicker_EmailRecipients_' + this.options.elementIdSuffix;
                html += '<div id="' + divEmailRecipients + '"></div>';
                html += '<br />';

                html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
                html += '   Subject:';
                html += '</span>';
                html == '<br />';
                //html += '<input type="text" id="' + dialogId + '_SubjectEditor" style="WIDTH: 100%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 12pt;">';
                html += '<input type="text" id="' + dialogId + '_SubjectEditor" style="WIDTH: 100%;font-family:sans-serif;color: #262626;font-size: 14pt;" />';
                html += '<br /><br />';
                html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
                html += '   Body:';
                html += '</span>';
                html == '<br />';
                html += '<div id="' + dialogId + '_BodyEditor" style="height:500px;"></div>'; // Quill. // This is where we set the height of the editor.
                html += '<br />';

                html += '<div style="white-space:nowrap;">';
                //html += '<div class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" onclick="$(\'.bwAttachments_MusicPlaylist\').bwAttachments_MusicPlaylist(\'sendEmail\', \'' + requestDialogId + '\', \'' + bwBudgetRequestId + '\');">';
                //html += 'Copy Selected Files to External Location';
                //html += '</div>'; // ☑ 
                //html += '&nbsp;&nbsp;';
                html += '<div class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" onclick="$(\'.bwAttachments_MusicPlaylist\').bwAttachments_MusicPlaylist(\'sendEmail\', \'' + requestDialogId + '\', \'' + bwBudgetRequestId + '\');">';
                html += 'Send Email';
                html += '</div>'; // ☑ 
                html += '</div>';

                html += '<br />';
                html += '<div class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" onclick="$(\'#' + dialogId + '\').dialog(\'close\');">Cancel</div>'; // ☑ 
                html += '<br /><br />';

                div.innerHTML = html;
                //}

                $('#' + dialogId).dialog({
                    modal: true,
                    resizable: false,
                    closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                    width: '1100',
                    dialogClass: 'no-close', // No close button in the upper right corner.
                    hide: false, // This means when hiding just disappear with no effects.
                    open: function () {
                        try {
                            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                            var workflowAppTitle = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTitle');
                            var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');
                            var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');

                            var bwEnabledRequestTypes = $('.bwAuthentication').bwAuthentication('option', 'bwEnabledRequestTypes').EnabledItems;

                            var selectedRequestType_SingletonName;
                            for (var i = 0; i < bwEnabledRequestTypes.length; i++) {
                                if (bwRequestTypeId == bwEnabledRequestTypes[i].bwRequestTypeId) {
                                    selectedRequestType_SingletonName = bwEnabledRequestTypes[i].SingletonName;
                                }
                            }

                            var divEmailRecipients = 'divEmailAttachmentsDialog_bwAttachments_MusicPlaylist_bwPeoplePicker_EmailRecipients_' + thiz.options.elementIdSuffix;
                            $('#' + divEmailRecipients).bwPeoplePicker_EmailRecipients({ parentElementIdSuffix: thiz.options.elementIdSuffix });

                            var subject = 'Attachment links for ' + selectedRequestType_SingletonName + ' ' + bwRequestTitle;

                            $('#' + dialogId + '_SubjectEditor')[0].value = subject;

                            var body = '';

                            body += '<div style="background-color:white;">';
                            body += 'Hi,';
                            body += '<br /><br />';
                            body += 'Here are the attachment links for ' + selectedRequestType_SingletonName + ' ' + bwRequestTitle + ':';
                            body += '<br /><br />';
                            body += '<div id="' + dialogId + '_BodyEditor_AttachmentsLinks">';
                            body += '   <img src="/images/ajax-loader.gif" width="50px" />';
                            body += '</div>'; // This gets populated from the web service call below...
                            body += '<br /><br />';
                            body += 'Sincerely,';
                            body += '<br /><br />';
                            body += participantFriendlyName.split(' ')[0];
                            body += '<br /><br />';
                            body += participantFriendlyName;
                            body += '<br />';
                            body += participantEmail;
                            body += '<br />';
                            body += workflowAppTitle;
                            body += '<br /><br />';
                            body += '</div>';

                            $('#' + dialogId + '_BodyEditor').summernote({
                                dialogsInBody: true, // Use this if hosting the summernote widget in a dialog, or if generally having dialog issues when using the toolbar.
                                placeholder: '',
                                tabsize: 2,
                                height: 450,
                                //airMode: true,
                                toolbar: [
                                    ['style', ['style']],
                                    ['font', ['bold', 'underline', 'clear']],
                                    ['color', ['color']],
                                    ['para', ['ul', 'ol', 'paragraph']],
                                    ['table', ['table']],
                                    ['insert', ['link']], //, 'picture', 'video']],
                                    ['view', ['codeview', 'help']]
                                ]
                            });

                            $('#' + dialogId + '_BodyEditor').summernote('code', body);

                            if (!bwBudgetRequestId) {
                                console.log('ERROR IN bwAttachments_MusicPlaylist.js.emailAttachments(). Unexpected value for bwBudgetRequestId: ' + bwBudgetRequestId);
                                displayAlertDialog('ERROR IN bwAttachments_MusicPlaylist.js.emailAttachments(). Unexpected value for bwBudgetRequestId: ' + bwBudgetRequestId);
                            } else {

                                $('#' + dialogId + '_BodyEditor_AttachmentsLinks').html(''); // It worked, and here were attachments, so get rid of the message.

                                //
                                // Display the image thumbnail.
                                //
                                //var displayImageThumbnail = function (imgId, thumbnailUrl) {
                                //    $.get(thumbnailUrl).done(function () {
                                //        var img = new Image();
                                //        img.src = thumbnailUrl;
                                //        img.onload = function (e) {
                                //            try {
                                //                document.getElementById(imgId).src = thumbnailUrl; // There is a thumbnail, so display it.
                                //            } catch (e) {
                                //                document.getElementById(imgId).src = globalUrlPrefix + globalUrl + '/images/mp4.jfif'; // There is no thumbnail, so display the icon.
                                //            }
                                //        }
                                //    }).fail(function () {
                                //        document.getElementById(imgId).src = globalUrlPrefix + globalUrl + '/images/mp4.jfif'; // There is no thumbnail, so display the icon.
                                //    });
                                //}
                                //alert('attachments: ' + JSON.stringify(attachments));
                                // Filename, Description, Size, 
                                for (var i = 0; i < attachments.length; i++) {

                                    var filename = attachments[i].Filename;
                                    if (filename.indexOf('_thumbnail_') > -1) {
                                        //
                                        // This is a thumbnail. Do not display as an attachment.
                                        //
                                    } else {

                                        console.log('xcx66654 description');
                                        //
                                        // This is an actual attachment. Display it!
                                        //
                                        var description = attachments[i].Description;
                                        var size = attachments[i].Size;
                                        if (size.toLowerCase() != 'na') {
                                            size = (Number(size) / 1000000).toFixed(1);
                                        }

                                        var fileUrl = externallyFacingUrlForAttachments + "/" + encodeURIComponent(attachments[i].subfolder) + "/" + encodeURIComponent(filename);

                                        var html = '';
                                        html += '<div style="white-space:nowrap;">';
                                        html += '   <a href="' + fileUrl + '" target="_blank" style="cursor:pointer;">';


                                        //html += '       <img src="' + attachments[i].File64bit + '" alt="' + description + '" title="' + description + '" style="height:120px;display:block;cursor:pointer;max-width:250px;border:1px solid gray;" />';

                                        //
                                        //
                                        // The following is where I tried to embed a [attachments[i].File64bit]. This does not work!! In order to insert an inline image, the emal spec requires that is is an attachment (which can be 64bit characters), with a reference to it, as an attachment. 4-16-2024.
                                        //
                                        //

                                        html += '       <img src="' + attachments[i].File64bit + '" xcx="xcx1232567-11"alt="' + description + '" title="' + description + '" style="height:120px;display:block;cursor:pointer;max-width:250px;border:1px solid gray;" />';
                                        //html += '       <img xcx="xcx1232567-11" src="' + fileUrl + '" alt="' + description + '" title="' + description + '" style="height:120px;display:block;cursor:pointer;max-width:250px;border:1px solid gray;" />';
                                        //var fileUrl_thumbnail = fileUrl + '_320px_.jpg';
                                        //fileUrl_thumbnail.replace('http://', 'https://');

                                        //var preventCachingGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                                        //    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                                        //    return v.toString(16);
                                        //});

                                        //var fileUrl_thumbnail = fileUrl + '_thumbnail_.jpg?v=' + preventCachingGuid;
                                        //html += '       <img xcx="xcx1232567-11" crossorigin="anonymous" src="' + fileUrl_thumbnail + '" alt="' + description + '" title="' + description + '" style="height:120px;display:block;cursor:pointer;max-width:250px;border:1px solid gray;" />';



                                        html += '   </a>';
                                        html += '   <br />';
                                        html += '   <a href="' + fileUrl + '" target="_blank" style="cursor:pointer;">' + fileUrl + '</a>';
                                        html += '</div>';
                                        html += '<br />';
                                        $('#' + dialogId + '_BodyEditor_AttachmentsLinks').append(html);

                                    }
                                }

                            }

                        } catch (e) {
                            console.log('Exception in bwAttachments_MusicPlaylist.js.emailAttachments():2: ' + e.message + ', ' + e.stack);
                            displayAlertDialog('Exception in bwAttachments_MusicPlaylist.js.emailAttachments():2: ' + e.message + ', ' + e.stack);
                        }

                    },
                    close: function () {
                        //$('#' + dialogId).dialog('destroy');
                        $(this).dialog('destroy');
                    }
                });
                //$('#divConfigureEmailNotificationsDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();
            }

        } catch (e) {
            console.log('Exception in bwAttachments_MusicPlaylist.js.emailAttachments(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwAttachments_MusicPlaylist.js.emailAttachments(): ' + e.message + ', ' + e.stack);
        }
    },
    sendEmail: function (attachmentsElementId, requestDialogId, bwBudgetRequestId, bwRequestTitle, bwRequestTypeId) {
        try {
            console.log('In sendEmail().');
            var thiz = this;

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
            var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

            var widgetId = 'divEmailAttachmentsDialog_bwAttachments_MusicPlaylist_bwPeoplePicker_EmailRecipients_' + this.options.elementIdSuffix;
            var widgetData = JSON.parse($('#' + widgetId).bwPeoplePicker_EmailRecipients('getData')); // This is what the json looks like: "[{"ParticipantId":"158a2035-e6e8-4772-a9ea-cfcfde9d35ea","ParticipantEmail":"customer2@budgetworkflow.com","ParticipantFriendlyName":"Betty Rubble"}]"

            if (!(widgetData && widgetData.length && (widgetData.length > 0))) {

                displayAlertDialog('Select at least 1 email recipient before sending this email.');

            } else {

                var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                //var to = widgetData[0].ParticipantEmail; // ONLY GETTING THE FIRST ONE SO FAR!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                var to = '';
                for (var i = 0; i < widgetData.length; i++) {
                    //to.push(widgetData[i].ParticipantEmail);
                    if (i > 0) {
                        to += ',';
                    }
                    to += widgetData[i].ParticipantEmail;
                }

                var cc = '';
                var bcc = '';

                var dialogId = 'divEmailAttachmentsDialog_bwAttachments_MusicPlaylist_' + this.options.elementIdSuffix;
                var subject = $('#' + dialogId + '_SubjectEditor')[0].value;
                var body = $('#' + dialogId + '_BodyEditor').summernote('code');

                var data = {
                    bwParticipantId_LoggedIn: participantId,
                    bwActiveStateIdentifier: activeStateIdentifier,
                    bwWorkflowAppId_LoggedIn: workflowAppId,

                    bwWorkflowAppId: workflowAppId,
                    bwParticipantId: participantId,
                    bwParticipantEmail: participantEmail,
                    bwParticipantFriendlyName: participantFriendlyName,
                    to: to, // This needs to look like "['email1', 'email2', 'etcemail']". Note that everyone will see each others emails. In order to use Personalizations, and change this behaviour, go here: https://stackoverflow.com/questions/40956191/how-to-email-multiple-recipients-in-sendgrid-v3-node-js#56935023 and here: https://docs.sendgrid.com/for-developers/sending-email/personalizations
                    cc: cc,
                    bcc: bcc,
                    subject: subject,
                    body: body
                }

                var operationUri = this.options.operationUriPrefix + "_bw/sendemail";
                $.ajax({
                    url: operationUri,
                    type: "POST",
                    data: data,
                    headers: {
                        "Accept": "application/json; odata=verbose"
                    },
                    success: function (result) {
                        try {
                            HideActivitySpinner();
                            if (result.message != 'SUCCESS') {
                                displayAlertDialog(result.message);
                            } else {

                                $('#' + dialogId).dialog('close');
                                displayAlertDialog('This email has been queued. If email is turned on for this organization, it will be sent shortly, otherwise it will be put in the Pending email queue, and will be sent when email is enabled for this organization.');

                            }
                        } catch (e) {
                            HideActivitySpinner();
                            console.log('Exception in bwAttachments_MusicPlaylist.js.sendEmail():1: ' + e.message + ', ' + e.stack);
                            displayAlertDialog('Exception in bwAttachments_MusicPlaylist.js.sendEmail():1: ' + e.message + ', ' + e.stack);
                        }
                    },
                    error: function (data, errorCode, errorMessage) {
                        HideActivitySpinner();
                        console.log('Error in bwAttachments_MusicPlaylist.js.sendEmail(): ' + errorCode + ' ' + errorMessage);
                        displayAlertDialog('Error in bwAttachments_MusicPlaylist.js.sendEmail(): ' + errorCode + ' ' + errorMessage);
                    }
                });
            }

        } catch (e) {
            console.log('Exception in sendEmail(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in sendEmail(): ' + e.message + ', ' + e.stack);
        }

    },


    renderAndPopulateAttachments_ReadOnly: function (requestDialogId) {
        try {
            console.log('In bwAttachments_MusicPlaylist.js.renderAndPopulateAttachments_ReadOnly().');
            //alert('In bwAttachments_MusicPlaylist.js.renderAndPopulateAttachments_ReadOnly(). This method may need some work.');
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
            html += '       <tr xcx="xcx21342526-1" id="xcx21342526-1" class="xdTableOffsetRow xdTableOffsetRow-editor" id="toolboxdraggablerow_2" draggable="true" bwwidgetname="bwAttachments_MusicPlaylist">';
            html += '           <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px;height:100%;">';
            html += '               <table style="height:100%;">';
            html += '                   <tr style="height:1%;">';
            html += '                       <td style="vertical-align:top;">';
            html += '                           <span class="xdlabel" style="color:black;">';
            html += '                               Music Playlist:';
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
                html += '               <label for="inputFile_' + 'bwBudgetRequestId' + '" class="divSignInButton" style="font-style:normal;width:100%;height:100%;text-align:center;line-height:1.65em;font-size:23pt;border-radius: 5px 5px 5px 5px;display:inline-block;padding-left:0;padding-top:0;">Choose file(s) xcx23124-2...&nbsp;&nbsp;&nbsp;&#128193;</label>';
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
            //html += '<input type="file" multiple name="multerFileUploadIdentifier" id="inputFile_' + bwBudgetRequestId + '" class="upload" style="visibility:hidden;" onchange="$(\'.bwAttachments_MusicPlaylist:first\').bwAttachments_MusicPlaylist(\'uploadAttachment\',\'newrequestattachments\', \'' + requestDialogId + '\', \'' + bwBudgetRequestId + '\');" />';


            //html += '</form>  ';

            //html += '           </div>';

            html += '           <p id="newrequestattachments" xcx="xcx448-1-2" style="word-break:break-all;white-space:normal;"></p>';

            //html += '           <br />';
            //html += '           <br />';

            if (this.options.inFormsEditor != true) {

                var bwRequestTitle = $(this.element).closest('#budgetrequestform')[0].getAttribute('bwrequesttitle');
                var bwRequestTypeId = $(this.element).closest('#budgetrequestform')[0].getAttribute('bwrequesttypeid');

            }

            // "Email attachments externally..." button.
            //html += '           <input id="' + requestDialogId + '_buttonEmailAttachmentsExternally" type="button" style="display:none;padding:5px 10px 5px 10px;" value="Email attachment(s) externally..." title="Email attachments to a customer using your internet facing url, which is configured in the organization settings." class="BwButton350" ';
            //html += '               onclick="$(\'.bwAttachments_MusicPlaylist:first\').bwAttachments_MusicPlaylist(\'copyAttachments\',\'newrequestattachments\', \'' + requestDialogId + '\', \'' + bwBudgetRequestId + '\', \'' + bwRequestTitle + '\', \'' + bwRequestTypeId + '\');" />';





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

                console.log('Calling bwAttachments_MusicPlaylist.js.populateAttachments(). xcx13124-2');
                //alert('xcx213234-18 calling populateAttachments().');
                this.populateAttachments(this.options.jsonData.bwWorkflowAppId, this.options.jsonData.bwBudgetRequestId, 'newrequestattachments');

            }
            //
            // end: If we have jsonData, populate the element.
            //





        } catch (e) {
            console.log('Exception in renderAndPopulateAttachments_ReadOnly: ' + e.message + ', ' + e.stack);
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwAttachments_MusicPlaylist</span>';
            html += '<br />';
            html += '<span style="">Exception in bwAttachments_MusicPlaylist.renderAndPopulateAttachments_ReadOnly(): ' + e.message + ', ' + e.stack + '</span>';
            this.element.html(html);
        }
        //try {
        //    console.log('In bwAttachments_MusicPlaylist.js.renderAndPopulateAttachments_ReadOnly().');
        //    alert('In bwAttachments_MusicPlaylist.js.renderAndPopulateAttachments_ReadOnly().');
        //    //var thiz = this;
        //    var html = '';

        //    html += '<table style="width:100%;">';
        //    html += '                        <tbody><tr  xcx="xcx21342526-2" id="xcx21342526-2" class="xdTableOffsetRow xdTableOffsetRow-editor" id="toolboxdraggablerow_2" draggable="true" bwwidgetname="bwAttachments_MusicPlaylist">';
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
        //    //html += '               <input type="file" id="inputFile" class="upload" style="visibility:hidden;" onchange="$(\'.bwAttachments_MusicPlaylist\').bwAttachments_MusicPlaylist(\'uploadAttachment\',\'newrequestattachments\');" />';
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
        //    console.log('Exception in bwAttachments_MusicPlaylist.js.renderAndPopulateAttachments_ReadOnly: ' + e.message + ', ' + e.stack);

        //    //renderAndPopulateAttachments
        //    //$(this.element).find('#newrequestattachments')[0].innerHTML = 'Exception in bwAttachments_MusicPlaylist.renderAndPopulateAttachments_ReadOnly: ' + e.message + ', ' + e.stack;
        //    var html = '';
        //    html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwAttachments_MusicPlaylist</span>';
        //    html += '<br />';
        //    html += '<span style="">Exception in bwAttachments_MusicPlaylist.js.renderAndPopulateAttachments_ReadOnly(): ' + e.message + ', ' + e.stack + '</span>';
        //    thiz.element.html(html);
        //}
    },

    uploadAttachment: function (displayAttachmentsTagName, requestDialogId, bwBudgetRequestId, objDataTransfer) {
        try {
            console.log('In bwAttachments_MusicPlaylist.js.uploadAttachment(). attachmentsAreStoredInIndexDb: ' + this.options.attachmentsAreStoredInIndexDb + ', bwBudgetRequestId: ' + bwBudgetRequestId + ', elementIdSuffix: ' + this.options.elementIdSuffix + ', displayAttachmentsTagName: ' + displayAttachmentsTagName + ', requestDialogId: ' + requestDialogId);
            //displayAlertDialog('In bwAttachments_MusicPlaylist.js.uploadAttachment(). attachmentsAreStoredInIndexDb: ' + this.options.attachmentsAreStoredInIndexDb + ', bwBudgetRequestId: ' + bwBudgetRequestId + ', elementIdSuffix: ' + this.options.elementIdSuffix + ', displayAttachmentsTagName: ' + displayAttachmentsTagName + ', requestDialogId: ' + requestDialogId);

            if (objDataTransfer) {

                console.log('In uploadAttachment(). Got a DataTransfer object with ' + objDataTransfer.files.length + ' files.');

                this.cmdDisplayMultiFileUploadDialog(displayAttachmentsTagName, bwBudgetRequestId, objDataTransfer.files); // Changed from cmdDisplayConfirmFileUploadDialog_zip_wasm() <<< DONT FORGET THIS CODE!

            } else {

                var inputFileAttachmentsElement = $('#inputFile_' + bwBudgetRequestId)[0];

                if (!(inputFileAttachmentsElement && inputFileAttachmentsElement.files && inputFileAttachmentsElement.files.length && (inputFileAttachmentsElement.files.length > 0))) {

                    console.log('In bwAttachments_MusicPlaylist.js.uploadAttachment(). NO FILES ARE ATTACHED.');

                } else {

                    //
                    // THERE ARE MULTIPLE FILES TO UPLOAD.
                    //
                    console.log('In bwAttachments_MusicPlaylist.js.uploadAttachment(). THERE ARE MULTIPLE FILES TO UPLOAD. Number of files attached: ' + inputFileAttachmentsElement.files.length);

                    this.cmdDisplayMultiFileUploadDialog(displayAttachmentsTagName, bwBudgetRequestId, inputFileAttachmentsElement.files); // Changed from cmdDisplayConfirmFileUploadDialog_zip_wasm() <<< DONT FORGET THIS CODE!

                }

            }

            //
            // This resets the value of the input file element so that is the same file is selected a second time, it behaves as expected. THIS CAN CAUSE A DIFFICULT TO TROUBLESHOOT ISSUE. DON'T LET IT TRIP YOU UP! :) 11-10-2023.
            //
            console.log('This resets the value of the input file attachments element so that is the same file is selected a second time, it behaves as expected. THIS CAN CAUSE A DIFFICULT TO TROUBLESHOOT ISSUE. DONT LET IT TRIP YOU UP! :) 11-10-2023. CURRENTLY DISABLED BUT HERE IF YOU NEED IT...');
            //inputFileAttachmentsElement.value = ''; // This resets the value of the input file element so that is the same file is selected a second time, it behaves as expected. 10-20-2023.

        } catch (e) {
            console.log('Error in bwAttachments_MusicPlaylist.js.uploadAttachment(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Error in bwAttachments_MusicPlaylist.js.uploadAttachment(): ' + e.message + ', ' + e.stack);
            $(this.element).find('#newrequestattachments')[0].innerHTML = 'Exception in bwAttachments_MusicPlaylist.uploadAttachment(): ' + e.message + ', ' + e.stack;
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

    uploadPastedAttachment: function (imgSrc) {
        try {
            //console.log('In bwAttachments_MusicPlaylist.js.uploadPastedAttachment(). attachmentsAreStoredInIndexDb: ' + this.options.attachmentsAreStoredInIndexDb + ', bwBudgetRequestId: ' + bwBudgetRequestId);
            //console.log('In uploadPastedAttachment().  Using .bwAttachments_MusicPlaylist:closest.  bwBudgetRequestId: ' + bwBudgetRequestId + ', elementIdSuffix: ' + this.options.elementIdSuffix + ', displayAttachmentsTagName: ' + displayAttachmentsTagName + ', requestDialogId: ' + requestDialogId);

            alert('In uploadPastedAttachment(). imgSrc: ' + imgSrc);

            var reader = new FileReader();
            reader.onload = function (event) {
                try {
                    //document.getElementById("container").src = event.target.result;

                    alert('In reader.onload()');

                    var file = event.target.result;

                    alert('In reader.onload size: ' + file.size);

                } catch (e) {
                    alert('Exception in xcx213123: ' + e.message + ', ' + e.stack);
                }
            };

            reader.readAsDataURL(imgSrc); //blob);

            //var item = pasteEvent.clipboardData.items[0];

            //if (item.type.indexOf("image") === 0) {
            //    var blob = item.getAsFile();

            //    var reader = new FileReader();
            //    reader.onload = function (event) {
            //        try {
            //            //document.getElementById("container").src = event.target.result;


            //            var file = event.target.result;

            //            alert('size: ' + file.size);

            //        } catch (e) {
            //            alert('Exception in xcx213123: ' + e.message + ', ' + e.stack);
            //        }
            //    };

            //    reader.readAsDataURL(blob);
            //}




            ////var _budgetRequestId = this.options.bwBudgetRequestId; // document.getElementById('BudgetRequestId').innerHTML; //$('span[xd\\:binding = "my:BudgetRequestId"]')[0].innerHTML;
            ////var _budgetRequestId = $(this.element).closest('#budgetrequestform')[0].getAttribute('bwbudgetrequestid');
            ////debugger;
            ////displayAlertDialog('uploadAttachment() _budgetRequestId: ' + _budgetRequestId);
            //var x = $('#inputFile_' + bwBudgetRequestId)[0]; // $('#' + requestDialogId).find('#inputFile')[0];
            //var file = x.files; //[0]; //[0];
            //if (!file) { // Don't like doing this but sometimes file is undefined... is this a race condition or a duplicate DOM element?? 6-23-2020
            //    this.displayAlertDialog('There was an error attaching this file. Please try again.');

            //} else {
            //    if (file.size > 100000000) {
            //        // Don't allow files over xxxMB.
            //        this.displayAlertDialog('Currently the system does not allow files over 100MB.');
            //        x.replaceWith($('#inputFile_' + bwBudgetRequestId).clone()); //$('#' + requestDialogId).find('#inputFile').replaceWith($('#inputFile').clone()); // Clear the file upload box. May not work in all browsers doing it this way.
            //    } else {


            //        console.log('xcx99334 Calling cmdDisplayConfirmFileUploadDialog(). bwBudgetRequestId: ' + bwBudgetRequestId);

            //        this.cmdDisplayConfirmFileUploadDialog(displayAttachmentsTagName, bwBudgetRequestId, requestDialogId, x);


















            //        //displayAlertDialog('In uploadAttachment(). Result: ' + upload);

            //        //var upload = confirm("Click OK to upload the file...");
            //        //if (upload) {
            //        //    $("#divWorkingOnItDialog").dialog({
            //        //        modal: true,
            //        //        resizable: false,
            //        //        //closeText: "Cancel",
            //        //        closeOnEscape: false, // Hit the ESC key to hide! Yeah!
            //        //        title: 'Working on it...',
            //        //        width: "360",
            //        //        dialogClass: "no-close", // No close button in the upper right corner.
            //        //        hide: false//, // This means when hiding just disappear with no effects.
            //        //        //buttons: {
            //        //        //    "Close": function () {
            //        //        //        $(this).dialog("close");
            //        //        //    }
            //        //        //}
            //        //    });
            //        //    $("#divWorkingOnItDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

            //        //    ProcessUpload(displayAttachmentsTagName, _budgetRequestId);
            //        //} else {
            //        //    $('#inputFile').replaceWith($('#inputFile').clone()); // Clear the file upload box. May not work in all browsers doing it this way.
            //        //    //populateAttachments();
            //        //}
            //    }
            //}
        } catch (e) {
            displayAlertDialog('Error in bwAttachments_MusicPlaylist.js.uploadAttachment(): ' + e.message + ', ' + e.stack);
            $(this.element).find('#newrequestattachments')[0].innerHTML = 'Exception in bwAttachments_MusicPlaylist.uploadAttachment(): ' + e.message + ', ' + e.stack;
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
        $('#divConfirmFileUploadDialog_ForAttachments').dialog('close');
    },
    cmdDisplayConfirmFileUploadDialog: function (displayAttachmentsTagName, bwBudgetRequestId, requestDialogId, element) { // element is >>> var x = $('#inputFile_' + bwBudgetRequestId)[0]; // $('#' + requestDialogId).find('#inputFile')[0];
        try {
            console.log('In bwAttachments_MusicPlaylist.js.cmdDisplayConfirmFileUploadDialog(). bwBudgetRequestId: ' + bwBudgetRequestId);

            var thiz = this;

            var dialogId = 'divConfirmFileUploadDialog_ForAttachments_' + bwBudgetRequestId;

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
            html += '                   Select the \'Upload\' button...';
            html += '               </span>';
            html += '           </td>';
            html += '           <td style="width:9%;"></td>';
            html += '           <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '               <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 120pt;font-weight:bold;" onclick="$(\'#' + dialogId + '\').dialog(\'close\');">X</span>';
            html += '           </td>';
            html += '       </tr>';
            html += '   </table>';
            html += '   <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
            html += '   <br /><br />';
            html += '   <span style="font-style:italic;color:gray;font-size:15pt;">The file name and description are not required because they can be changed later on.</span>';
            html += '   <br /><br />';
            html += '   <input type="checkbox" id="ConfirmFileUploadDialog_ConvertToAPdfCheckbox_' + bwBudgetRequestId + '" />&nbsp;<span style="font-style:italic;color:gray;font-size:15pt;">Convert to a pdf</span>';
            html += '   <br /><br />';
            html += '   <img xcx="xcx445776" id="ConfirmFileUploadDialog_ImagePreview_' + bwBudgetRequestId + '" src="#" alt="your image" />';
            html += '   <table>';
            html += '       <tr>';
            html += '           <td><span style="font-style:italic;color:gray;font-size:20pt;">file name:</span></td>';
            html += '           <td>';
            html += '               <input type="text" id="txtConfirmFileUploadDialogFilename" style="width:380px;font-size:20pt;" />&nbsp;<span style="font-style:italic;font-size:11pt;color:gray;">';
            html += '               <br />(don\'t include a file extension)';
            html += '               </span>';
            html += '           </td>';
            html += '       </tr>';
            html += '       <tr>';
            html += '           <td></td>';
            html += '           <td></td>';
            html += '       </tr>';
            html += '       <tr>';
            html += '           <td style="vertical-align:top;"><span style="font-style:italic;font-size:20pt;color:gray;">description:</span></td>';
            html += '           <td><textarea id="txtConfirmFileUploadDialogFileDescription" style="overflow:hidden;font-size:20pt;" rows="4" cols="30"></textarea></td>';
            html += '       </tr>';
            html += '   </table>';
            html += '   <br /><br />';
            html += '   <div id="' + dialogId + '_btnInitializeFfmpegWasm" class="divDialogButton" title="Click here to initialize ffmpeg.wasm....">';
            html += '       Initialize FFMPEG.WASM';
            html += '   </div>';
            html += '   <div id="' + dialogId + '_btnUploadTheFileNow" class="divDialogButton" title="Click here to upload the attachment.">';
            html += '       Upload';
            html += '   </div>';
            html += '   <br /><br />';
            html += '   <div id="btnCancelUploadTheFileNow" class="divDialogButton" onclick="$(\'#' + dialogId + '\').dialog(\'close\');">';
            html += '       Cancel';
            html += '   </div>';
            //html += '</div>';

            div.innerHTML = html;

            $('#ConfirmFileUploadDialog_ImagePreview_' + bwBudgetRequestId).attr('src', '');
            $('#' + dialogId).find('#txtConfirmFileUploadDialogFileDescription')[0].innerHTML = ''; // Clear the description, because this may have the description from the last time it was displayed.


            var x = $('#inputFile_' + bwBudgetRequestId)[0]; // $('#' + requestDialogId).find('#inputFile')[0];

            if (!(x && x.files && x.files.length && (x.files.length > 0))) {

                alert('xcx3124 Fatal error in bwAttachments_MusicPlaylist.js.cmdDisplayConfirmFileUploadDialog(). NO FILES FOR ELEMENT [' + 'inputFile_' + bwBudgetRequestId + '].')

            } else {


                var file = x.files; //[0]; //[0];
                if (!file) { // Don't like doing this but sometimes file is undefined... is this a race condition or a duplicate DOM element?? 6-23-2020
                    console.log('xcx121312 There was an error attaching this file. Please try again.');
                    displayAlertDialog('xcx121312 There was an error attaching this file. Please try again.');

                } else {
                    if (file.size > 100000000) {

                        console.log('xcx121312 Currently the system does not allow files over 100MB.'); // Don't allow files over xxxMB.
                        displayAlertDialog('xcx121312 Currently the system does not allow files over 100MB.');

                        console.log('In xcx23124232342-5 Calling clone.');
                        alert('In xcx23124232342-5 Calling clone.');

                        x.replaceWith($('#inputFile_' + bwBudgetRequestId).clone()); //$('#' + requestDialogId).find('#inputFile').replaceWith($('#inputFile').clone()); // Clear the file upload box. May not work in all browsers doing it this way.

                    } else {

                        console.log('>>>> In bwAttachments_MusicPlaylist.js.uploadAttachment(). Calling .dialog(). bwBudgetRequestId: ' + bwBudgetRequestId + ', file.length: ' + file.length);

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
                            //close: function () {
                            //    try {

                            //    } catch (e) {
                            //        console.log('Exception in cmdDisplayConfirmFileUploadDialog.divConfirmFileUploadDialog.close(): ' + e.message + ', ' + e.stack);
                            //        displayAlertDialog('Exception in cmdDisplayConfirmFileUploadDialog.divConfirmFileUploadDialog.close(): ' + e.message + ', ' + e.stack);
                            //    }
                            //},
                            open: function (event, ui) {
                                try {
                                    $('.ui-widget-overlay').bind('click', function () {
                                        $('#' + dialogId).dialog('close');
                                    });

                                    console.log('>>>>>>>>>>>>>>>>In $(' + dialogId + 'dialogId).dialog.open().');

                                    // Display the image prior to the user clicking the "Upload" button.
                                    var x = document.getElementById('inputFile_' + bwBudgetRequestId); // This element is on the request form with the "Choose File" button, not the attachments dialog.

                                    console.log('>>>>>>>>>>>>>xcx23213 x.files.length: ' + x.files.length);

                                    var file = x.files[0]; // 11-12-2022







                                    //
                                    // If there is a file.name, display it in the text box [txtConfirmFileUploadDialogFilename]. 4-15-2023.
                                    //
                                    var originalFilename;
                                    if (file.name) {

                                        //
                                        // Remove the extension before putting the filename in the text box. 6-8-2023.
                                        //
                                        originalFilename = file.name.substring(0, file.name.lastIndexOf('.'));

                                    } else {
                                        alert('xcx213123 NO file.name!!!');
                                        var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                                            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                                            return v.toString(16);
                                        });
                                        originalFilename = guid;
                                    }
                                    var tempFilename = $('#' + dialogId).find('#txtConfirmFileUploadDialogFilename');
                                    if (tempFilename && tempFilename[0] && ((tempFilename[0].value == '') || tempFilename[0].value)) {
                                        tempFilename[0].value = originalFilename;
                                    } else {
                                        console.log('');
                                        console.log('CANNOT find element divConfirmFileUploadDialog_ForAttachments. xcx999246.');
                                        console.log('');

                                        alert('CANNOT find element divConfirmFileUploadDialog_ForAttachments. xcx999246.');

                                    }
                                    //
                                    // end: If there is a file.name, display it in the text box [txtConfirmFileUploadDialogFilename].
                                    //
























                                    var uploadButton = $('#' + dialogId + '_btnUploadTheFileNow');
                                    if (!uploadButton) {

                                        alert('xcx214252523 Error: Could not locate element [' + dialogId + '_btnUploadTheFileNow' + '] to attach upload button event...');

                                    } else {

                                        //alert('xcx214231 THIS SHOULD ONLY BE 1. uploadButton.length: ' + $(uploadButton).length);


                                        $(this).ready(function () {

                                            //alert('Dialog is ready(), attaching events to elements.');
                                            console.log('Dialog is ready(). xcx234 adding click event for element: ' + dialogId + '_btnUploadTheFileNow');

                                            var originalFilename = file.name;
                                            var filename = file.name;

                                            var extensionIndex_original = originalFilename.split('.').length - 1;
                                            var fileExtension_original = originalFilename.toLowerCase().split('.')[extensionIndex_original];


                                            //alert('fileExtension_original: ' + fileExtension_original);
                                            // Images display in the "Upload Attachment" dialog Ok, but there are some other cases to handle here.
                                            console.log('Images display in the "Upload Attachment" dialog Ok, but there are some other cases to handle here. fileExtension_original: ' + fileExtension_original);
                                            if (fileExtension_original.toLowerCase() == 'vob') {
                                                $('#' + dialogId).find('#ConfirmFileUploadDialog_ImagePreview_' + bwBudgetRequestId).attr('src', 'images/vob.png');
                                            }




                                            $('#' + dialogId + '_btnUploadTheFileNow').off('click').click(function () { // divConfirmFileUploadDialog_ForAttachments_78ebbdca-32d7-4019-9c53-cdc55e11a775_btnUploadTheFileNow
                                                try {
                                                    console.log('In bwAttachments_MusicPlaylist.js.UploadButton_OnClick(). displayAttachmentsTagName: ' + displayAttachmentsTagName + ', bwBudgetRequestId: ' + bwBudgetRequestId);
                                                    alert('THIS IS THE ONE... xcx11 In bwAttachments_MusicPlaylist.js.UploadButton_OnClick(). displayAttachmentsTagName: ' + displayAttachmentsTagName + ', bwBudgetRequestId: ' + bwBudgetRequestId);

                                                    // Check if the user specified a new filename. If so, make sure the file extension is the same!
                                                    var filenameElement = $('#' + dialogId).find('#txtConfirmFileUploadDialogFilename')[0];
                                                    if (filenameElement && filenameElement.value && filenameElement.value.trim().length > 1) {
                                                        //
                                                        // This makes sure that if the user specified a new file name, that we put the correct file extension at the end. // 6-8-2023.
                                                        //

                                                        var extensionIndex_new = filenameElement.value.trim().split('.').length - 1;
                                                        var fileExtension_new = filenameElement.value.trim().toLowerCase().split('.')[extensionIndex_new];

                                                        if (fileExtension_original == fileExtension_new) {
                                                            // It already has the correct file extension, so don't do anything to it.
                                                        } else {

                                                            // It doesn't already have the correct file extension, so we will add it here.
                                                            filename = filenameElement.value.trim() + '.' + fileExtension_original; // Put the same extension on it.

                                                        }
                                                    }

                                                    var convertToAPdfElement = $('#' + dialogId).find('#ConfirmFileUploadDialog_ConvertToAPdfCheckbox_' + bwBudgetRequestId)[0];
                                                    var convertToAPdf = convertToAPdfElement.checked; // Returns true or false.

                                                    $('#' + dialogId).dialog('close');

                                                    console.log('In bwAttachments_MusicPlaylist.js.UploadButton_OnClick(). Getting ready to call processUpload(). filename: ' + filename + ', file.name: ' + file.name); //              displayAttachmentsTagName: ' + displayAttachmentsTagName + ', bwBudgetRequestId: ' + bwBudgetRequestId);
                                                    //alert('In bwAttachments_MusicPlaylist.js.UploadButton_OnClick(). Getting ready to call processUpload(). filename: ' + filename + ', file.name: ' + file.name); //              displayAttachmentsTagName: ' + displayAttachmentsTagName + ', bwBudgetRequestId: ' + bwBudgetRequestId);

                                                    thiz.processUpload(displayAttachmentsTagName, bwBudgetRequestId, file, filename, convertToAPdf);

                                                } catch (e) {
                                                    console.log('Exception in bwAttachments_MusicPlaylist.js.btnUploadTheFileNow.click(): ' + e.message + ', ' + e.stack);
                                                    alert('Exception in bwAttachments_MusicPlaylist.js.btnUploadTheFileNow.click(): ' + e.message + ', ' + e.stack);
                                                }
                                            });
                                        });

                                    }

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



                                    console.log('>>>>>>>>>>>>xcx999934 file name: ' + file.name + ', size: ' + file.size);



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
                                                $('#' + dialogId).dialog('close');
                                                //alert('The image must be a 400px square. This image is too small.');
                                                alert('The image must be a 50px square. This image is too small.1');
                                            } else {
                                                // Now display it.
                                                var reader = new FileReader();
                                                reader.onload = function (e) {
                                                    try {

                                                        //alert('xcx3336678-1');


                                                        $('#' + dialogId).find('#ConfirmFileUploadDialog_ImagePreview_' + bwBudgetRequestId).attr('src', e.target.result);
                                                        $('#' + dialogId).find('#ConfirmFileUploadDialog_ImagePreview_' + bwBudgetRequestId).attr('style', 'width:400px;'); // 3-12-2022 only specify 1 dimension so that the image is not distorted. // height:400px;');
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



                                } catch (e) {
                                    console.log('Exception in cmdDisplayConfirmFileUploadDialog.divConfirmFileUploadDialog.open(): ' + e.message + ', ' + e.stack);
                                    displayAlertDialog('Exception in cmdDisplayConfirmFileUploadDialog.divConfirmFileUploadDialog.open(): ' + e.message + ', ' + e.stack);
                                }
                            }

                        });


                    }
                }




            }









            //// Populate the filename text box!
            //var x = element;

            //alert('xcx897778  x.length: ' + x.length);


            //var file = x.files[0]; 
            //var originalFilename = file.name.trim().split('.')[0];


            //// 1-11-2022
            //var tempFilename = $('#' + dialogId).find('#txtConfirmFileUploadDialogFilename');
            //debugger;
            //if (tempFilename && tempFilename[0] && ((tempFilename[0].value == '') || tempFilename[0].value)) {
            //    tempFilename[0].value = originalFilename;
            //} else {
            //    console.log('');
            //    console.log('CANNOT find element divConfirmFileUploadDialog_ForAttachments. xcx999246.');
            //    console.log('');

            //    alert('CANNOT find element divConfirmFileUploadDialog_ForAttachments. xcx999246.');

            //}


            //// Clear the description, because this may have the description from the last time it was displayed.
            //$('#' + dialogId).find('#txtConfirmFileUploadDialogFileDescription')[0].innerHTML = ''; //'xcx32467';



            //$('#' + dialogId).dialog({
            //    modal: true,
            //    resizable: false,
            //    closeText: "Cancel",
            //    closeOnEscape: true, // Hit the ESC key to hide! Yeah!
            //    width: "720px",
            //    dialogClass: "no-close", // No close button in the upper right corner.
            //    hide: false, // This means when hiding just disappear with no effects.
            //    position: {
            //        my: "middle top+12",
            //        at: "middle top",
            //        of: window
            //    },
            //    // This allows the dialog to close when clicked outside of the dialog. Only works for modal dialogs.
            //    close: function () {
            //        try {

            //            $(this).dialog('destroy'); // 7-5-2020 THIS IS THE PREFFERED SYNTAX FOR THIS FROM NOW ON!!!!!!!!!!!!!!!!!!!!!!!!!!!! REPLACE EVERYWHERE AND TEST!!!!!!!!!!

            //            $(dialogId).remove();



            //        } catch (e) {
            //            console.log('Exception in cmdDisplayConfirmFileUploadDialog.divConfirmFileUploadDialog.close(): ' + e.message + ', ' + e.stack);
            //            displayAlertDialog('Exception in cmdDisplayConfirmFileUploadDialog.divConfirmFileUploadDialog.close(): ' + e.message + ', ' + e.stack);
            //        }
            //    },
            //    open: function (event, ui) {
            //        try {
            //            $('.ui-widget-overlay').bind('click', function () {
            //                $('#' + dialogId).dialog('close');
            //            });


            //            console.log('>>>>>>>>>>>>>>>>In $(' + dialogId + 'dialogId).dialog.open().');

            //            //alert('>>>>>>>>>>>>>>>>In $(' + dialogId + 'dialogId).dialog.open().');



            //            // 1-24-2020 ToDo: Display the image prior to uploading!
            //            var x = document.getElementById('inputFile_' + bwBudgetRequestId); // This element is on the request form with the "Choose File" button, not the attachments dialog.
            //            //var x = $('#divConfirmFileUploadDialog_ForAttachments').find('#inputFile_' + bwBudgetRequestId)[0];
            //            var file = x.files[0];






            //            ////
            //            //// ADD THE BUTTON ONCLICK EVENTS HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! Then we have access to displayAttachmentsTagName etc. 2-4-2022
            //            ////
            //            //console.log('xcx234 in uploadAttachment(). adding click event for element: ' + dialogId + '_btnUploadTheFileNow');
            //            //alert('xcx234 adding click event for element: ' + dialogId + '_btnUploadTheFileNow');
            //            //var button1 = document.getElementById(dialogId + '_btnUploadTheFileNow'); //.innerHTML;


            //            //alert('element btnUploadTheFileNow: ' + button1.innerHTML + ' <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');

            //            //button1.addEventListener("click", function () {
            //            //    try {
            //            //        alert('BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB');
            //            //        console.log('In bwAttachments_MusicPlaylist.js.UploadButton_OnClick(). displayAttachmentsTagName: ' + displayAttachmentsTagName + ', bwBudgetRequestId: ' + bwBudgetRequestId);
            //            //        alert('In bwAttachments_MusicPlaylist.js.UploadButton_OnClick(). displayAttachmentsTagName: ' + displayAttachmentsTagName + ', bwBudgetRequestId: ' + bwBudgetRequestId);

            //            //        $('#' + dialogId).dialog('close');

            //            //        //$("#divWorkingOnItDialog").dialog({
            //            //        //    modal: true,
            //            //        //    resizable: false,
            //            //        //    closeOnEscape: false, // Hit the ESC key to hide! Yeah!
            //            //        //    title: 'Working on it...',
            //            //        //    width: "800",
            //            //        //    dialogClass: "no-close", // No close button in the upper right corner.
            //            //        //    hide: false//, // This means when hiding just disappear with no effects.
            //            //        //});
            //            //        //$("#divWorkingOnItDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

            //            //        thiz.processUpload(displayAttachmentsTagName, bwBudgetRequestId, file);

            //            //    } catch (e) {
            //            //        console.log('Exception in bwAttachments_MusicPlaylist.js.btnUploadTheFileNow.click(): ' + e.message + ', ' + e.stack);
            //            //        alert('Exception in bwAttachments_MusicPlaylist.js.btnUploadTheFileNow.click(): ' + e.message + ', ' + e.stack);
            //            //    }
            //            //});

            //            //$(button1).click(function () { // divConfirmFileUploadDialog_ForAttachments_78ebbdca-32d7-4019-9c53-cdc55e11a775_btnUploadTheFileNow
            //            //    try {
            //            //        alert('BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB');
            //            //        console.log('In bwAttachments_MusicPlaylist.js.UploadButton_OnClick(). displayAttachmentsTagName: ' + displayAttachmentsTagName + ', bwBudgetRequestId: ' + bwBudgetRequestId);
            //            //        alert('In bwAttachments_MusicPlaylist.js.UploadButton_OnClick(). displayAttachmentsTagName: ' + displayAttachmentsTagName + ', bwBudgetRequestId: ' + bwBudgetRequestId);

            //            //        $('#' + dialogId).dialog('close');

            //            //        //$("#divWorkingOnItDialog").dialog({
            //            //        //    modal: true,
            //            //        //    resizable: false,
            //            //        //    closeOnEscape: false, // Hit the ESC key to hide! Yeah!
            //            //        //    title: 'Working on it...',
            //            //        //    width: "800",
            //            //        //    dialogClass: "no-close", // No close button in the upper right corner.
            //            //        //    hide: false//, // This means when hiding just disappear with no effects.
            //            //        //});
            //            //        //$("#divWorkingOnItDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

            //            //        thiz.processUpload(displayAttachmentsTagName, bwBudgetRequestId, file);

            //            //    } catch (e) {
            //            //        console.log('Exception in bwAttachments_MusicPlaylist.js.btnUploadTheFileNow.click(): ' + e.message + ', ' + e.stack);
            //            //        alert('Exception in bwAttachments_MusicPlaylist.js.btnUploadTheFileNow.click(): ' + e.message + ', ' + e.stack);
            //            //    }
            //            //});


            //            //
            //            // ADD THE BUTTON ONCLICK EVENTS HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! Then we have access to displayAttachmentsTagName etc. 2-4-2022
            //            //

            //            //alert('xcx234 adding click event for element: ' + dialogId + '_btnUploadTheFileNow');


            //            var uploadButton = $('#' + dialogId + '_btnUploadTheFileNow');
            //            if (!uploadButton) {

            //                alert('xcx214252523 Error: Could not locate element [' + dialogId + '_btnUploadTheFileNow' + '] to attach upload button event...');

            //            } else {

            //                //alert('xcx214231 THIS SHOULD ONLY BE 1. uploadButton.length: ' + $(uploadButton).length);


            //                $(this).ready(function () {

            //                    //alert('Dialog is ready(), attaching events to elements.');
            //                    console.log('Dialog is ready(). xcx234 adding click event for element: ' + dialogId + '_btnUploadTheFileNow');


            //                    //$('#' + dialogId + '_btnUploadTheFileNow').off('click').click(function () { // divConfirmFileUploadDialog_ForAttachments_78ebbdca-32d7-4019-9c53-cdc55e11a775_btnUploadTheFileNow
            //                    $('#' + dialogId + '_btnUploadTheFileNow').off('click').click(function () { // divConfirmFileUploadDialog_ForAttachments_78ebbdca-32d7-4019-9c53-cdc55e11a775_btnUploadTheFileNow
            //                        //$(document).on('click', dialogId + '_btnUploadTheFileNow', function () {
            //                        //document.getElementById(dialogId + '_btnUploadTheFileNow').addEventListener('click', function () { // divConfirmFileUploadDialog_ForAttachments_5407bd5e-f00e-4e97-9f56-d1c9a86723c2_btnUploadTheFileNow
            //                        try {
            //                            console.log('In bwAttachments_MusicPlaylist.js.UploadButton_OnClick(). displayAttachmentsTagName: ' + displayAttachmentsTagName + ', bwBudgetRequestId: ' + bwBudgetRequestId);
            //                            //alert('In bwAttachments_MusicPlaylist.js.UploadButton_OnClick(). displayAttachmentsTagName: ' + displayAttachmentsTagName + ', bwBudgetRequestId: ' + bwBudgetRequestId);

            //                            // Check if the user specified a new filename. If so, make sure the file extension is the same!
            //                            var originalFilename = file.name;
            //                            var filename = file.name;
            //                            //debugger;
            //                            //var filenameElement = $(this.element).find('#txtConfirmFileUploadDialogFilename'); // removed 8-5-2022
            //                            var filenameElement = $('#' + dialogId).find('#txtConfirmFileUploadDialogFilename')[0];
            //                            if (filenameElement && filenameElement.value && filenameElement.value.trim().length > 1) {
            //                                filename = filenameElement.value.trim().split('.')[0] + '.' + originalFilename.split('.')[1]; // Put the same extension on it.
            //                            }

            //                            //alert('xcx425 filename: ' + filename + ', dialogId: ' + dialogId);



            //                            //var newfilename;
            //                            //var filenameElement = $('#' + dialogId).find('#txtConfirmFileUploadDialogFilename');
            //                            //if (filenameElement && filenameElement.value && filenameElement.value.trim().length > 1) {
            //                            //    newfilename = filenameElement.value.trim().split('.')[0] + '.' + originalFilename.split('.')[1]; // Put the same extension on it.
            //                            //}

            //                            //var newfilename = $('#' + dialogId).find('#txtConfirmFileUploadDialogFilename').val(); // divConfirmFileUploadDialog_ForAttachments_f437a8b6-ce77-45ac-a3ca-ed3568cae536.find txtConfirmFileUploadDialogFilename

            //                            $('#' + dialogId).dialog('close');

            //                            //$("#divWorkingOnItDialog").dialog({
            //                            //    modal: true,
            //                            //    resizable: false,
            //                            //    closeOnEscape: false, // Hit the ESC key to hide! Yeah!
            //                            //    title: 'Working on it...',
            //                            //    width: "800",
            //                            //    dialogClass: "no-close", // No close button in the upper right corner.
            //                            //    hide: false//, // This means when hiding just disappear with no effects.
            //                            //});
            //                            //$("#divWorkingOnItDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();



            //                            thiz.processUpload(displayAttachmentsTagName, bwBudgetRequestId, file, filename);

            //                        } catch (e) {
            //                            console.log('Exception in bwAttachments_MusicPlaylist.js.btnUploadTheFileNow.click(): ' + e.message + ', ' + e.stack);
            //                            alert('Exception in bwAttachments_MusicPlaylist.js.btnUploadTheFileNow.click(): ' + e.message + ', ' + e.stack);
            //                        }
            //                    });
            //                });

            //            }

            //            $('#btnCancelUploadTheFileNow').off('click').click(function () {
            //                try {
            //                    //$(this).dialog("close");

            //                    //$('#inputFile_' + bwBudgetRequestId).replaceWith($('#inputFile_' + bwBudgetRequestId).clone());
            //                    ////$(this.element).find('#inputFile').replaceWith($('#inputFile').clone()); // Clear the file upload box. May not work in all browsers doing it this way.
            //                    ////return false;
            //                } catch (e) {
            //                    console.log('Exception in btnCancelUploadTheFileNow.click(): ' + e.message + ', ' + e.stack);
            //                    displayAlertDialog('Exception in btnCancelUploadTheFileNow.click(): ' + e.message + ', ' + e.stack);
            //                }
            //            });









            //            //
            //            // First get the dimensions of the image.
            //            var _URL = window.URL || window.webkitURL;
            //            var img;
            //            //if ((file = this.files[0])) {
            //            img = new Image();
            //            var objectUrl = _URL.createObjectURL(file);
            //            img.onload = function () {
            //                try {
            //                    //alert(this.width + " " + this.height);
            //                    _URL.revokeObjectURL(objectUrl);


            //                    //if (this.width < 400 || this.height < 400) {
            //                    if (this.width < 50 || this.height < 50) {
            //                        $('#' + dialogId).dialog('close');
            //                        //alert('The image must be a 400px square. This image is too small.');
            //                        alert('The image must be a 50px square. This image is too small.');
            //                    } else {
            //                        // Now display it.
            //                        var reader = new FileReader();
            //                        reader.onload = function (e) {
            //                            try {
            //                                $('#' + dialogId).find('#ConfirmFileUploadDialog_ImagePreview_' + bwBudgetRequestId).attr('src', e.target.result);
            //                                $('#' + dialogId).find('#ConfirmFileUploadDialog_ImagePreview_' + bwBudgetRequestId).attr('style', 'width:400px;'); // 3-12-2022 only specify 1 dimension so that the image is not distorted. // height:400px;');
            //                            } catch (e) {
            //                                console.log('Exception in cmdDisplayConfirmFileUploadDialog.divConfirmFileUploadDialog.open.img.onload.reader.onload(): ' + e.message + ', ' + e.stack);
            //                                displayAlertDialog('Exception in cmdDisplayConfirmFileUploadDialog.divConfirmFileUploadDialog.open.img.onload.reader.onload(): ' + e.message + ', ' + e.stack);
            //                            }
            //                        }
            //                        reader.readAsDataURL(file);
            //                    }
            //                } catch (e) {
            //                    console.log('Exception in cmdDisplayConfirmFileUploadDialog.divConfirmFileUploadDialog.open.img.onload(): ' + e.message + ', ' + e.stack);
            //                    displayAlertDialog('Exception in cmdDisplayConfirmFileUploadDialog.divConfirmFileUploadDialog.open.img.onload(): ' + e.message + ', ' + e.stack);
            //                }
            //            };
            //            img.src = objectUrl;



            //        } catch (e) {
            //            console.log('Exception in cmdDisplayConfirmFileUploadDialog.divConfirmFileUploadDialog.open(): ' + e.message + ', ' + e.stack);
            //            displayAlertDialog('Exception in cmdDisplayConfirmFileUploadDialog.divConfirmFileUploadDialog.open(): ' + e.message + ', ' + e.stack);
            //        }
            //    }
            //    //buttons: {
            //    //    "xxxx": {
            //    //        text: 'Upload',
            //    //        id: 'btnUploadTheFileNow',
            //    //        //disabled: 'false',
            //    //        click: function () {
            //    //            //try {
            //    //            //    //var proceed = confirm('This action cannot be undone.\n\n\nClick the OK button to proceed...');
            //    //            //    //if (proceed) {
            //    //            //    //    cmdDeleteBudgetRequest(requestId);
            //    //            //    //displayAlertDialog('This functionality is incomplete. Coming soon!');
            //    //            //    $(this).dialog("close");

            //    //            //    $("#divWorkingOnItDialog").dialog({
            //    //            //        modal: true,
            //    //            //        resizable: false,
            //    //            //        //closeText: "Cancel",
            //    //            //        closeOnEscape: false, // Hit the ESC key to hide! Yeah!
            //    //            //        title: 'Working on it...',
            //    //            //        width: "800",
            //    //            //        dialogClass: "no-close", // No close button in the upper right corner.
            //    //            //        hide: false//, // This means when hiding just disappear with no effects.
            //    //            //        //buttons: {
            //    //            //        //    "Close": function () {
            //    //            //        //        $(this).dialog("close");
            //    //            //        //    }
            //    //            //        //}
            //    //            //    });
            //    //            //    $("#divWorkingOnItDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();


            //    //            //    //var x = document.getElementById('inputFile');
            //    //            //    //var file = x.files[0];

            //    //            //    //// Check if the user specified a new filename. If so, make sure the file extension is the same!
            //    //            //    //var originalFilename = file.name;
            //    //            //    //var filename;
            //    //            //    //if (document.getElementById('txtConfirmFileUploadDialogFilename').value.trim() == '') {
            //    //            //    //    filename = file.name;
            //    //            //    //} else {
            //    //            //    //    filename = document.getElementById('txtConfirmFileUploadDialogFilename').value.trim().split('.')[0] + '.' + originalFilename.split('.')[1]; // Put the same extension on it.
            //    //            //    //}






            //    //            //    //var _budgetRequestId = document.getElementById('BudgetRequestId').innerHTML;
            //    //            //    //debugger;
            //    //            //    thiz.processUpload(displayAttachmentsTagName, bwBudgetRequestId, file);

            //    //            //    //return true;
            //    //            //    //}
            //    //            //} catch (e) {
            //    //            //    console.log('Exception in cmdDisplayConfirmFileUploadDialog.divConfirmFileUploadDialog.click(): ' + e.message + ', ' + e.stack);
            //    //            //    thiz.displayAlertDialog('Exception in cmdDisplayConfirmFileUploadDialog.divConfirmFileUploadDialog.click(): ' + e.message + ', ' + e.stack);
            //    //            //}
            //    //        }
            //    //    },
            //    //    "Cancel": function () {
            //    //        try {
            //    //            //$(this).dialog("close");

            //    //            //$('#inputFile_' + bwBudgetRequestId).replaceWith($('#inputFile_' + bwBudgetRequestId).clone());
            //    //            ////$(this.element).find('#inputFile').replaceWith($('#inputFile').clone()); // Clear the file upload box. May not work in all browsers doing it this way.
            //    //            ////return false;
            //    //        } catch (e) {
            //    //            console.log('Exception in cmdDisplayConfirmFileUploadDialog.divConfirmFileUploadDialog.cancel(): ' + e.message + ', ' + e.stack);
            //    //            thiz.displayAlertDialog('Exception in cmdDisplayConfirmFileUploadDialog.divConfirmFileUploadDialog.cancel(): ' + e.message + ', ' + e.stack);
            //    //        }
            //    //    }
            //    //}

            //});

            // Hide the title bar.
            $('#' + dialogId).dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
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
            console.log('Exception in bwAttachments_MusicPlaylist.js.cmdDisplayConfirmFileUploadDialog(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwAttachments_MusicPlaylist.js.cmdDisplayConfirmFileUploadDialog(): ' + e.message + ', ' + e.stack);
        }
    },


    cmdDisplayConfirmFileUploadDialog_ffmpeg_wasm: async function (displayAttachmentsTagName, bwBudgetRequestId, requestDialogId, element, file) { // element is >>> var x = $('#inputFile_' + bwBudgetRequestId)[0]; // $('#' + requestDialogId).find('#inputFile')[0];
        try {

            HideActivitySpinner();

            console.log('In bwAttachments_MusicPlaylist.js.cmdDisplayConfirmFileUploadDialog_ffmpeg_wasm(). bwBudgetRequestId: ' + bwBudgetRequestId);
            //alert('###########In bwAttachments_MusicPlaylist.js.cmdDisplayConfirmFileUploadDialog_ffmpeg_wasm(). bwBudgetRequestId: ' + bwBudgetRequestId);

            //var fileElement = $('#inputFile_' + bwBudgetRequestId)[0]; // $('#' + requestDialogId).find('#inputFile')[0];
            ////var files = x.files;
            ////var file = x.files[0];

            //alert('xxx: ' + files.length);

            var thiz = this;
            debugger;
            var dialogId = 'divConfirmFileUploadDialog_ForAttachments_ffmpeg_wasm_' + bwBudgetRequestId;

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
            //html += '                   Select the \'Upload\' button...';
            html += '                   FFMPEG.WASM';
            html += '               </span>';
            html += '           </td>';
            html += '           <td style="width:9%;"></td>';
            html += '           <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '               <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 120pt;font-weight:bold;" onclick="$(\'#' + dialogId + '\').dialog(\'close\');">X</span>';
            html += '           </td>';
            html += '       </tr>';
            html += '   </table>';
            html += '   <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
            //html += '   <br /><br />';




            //html += '   <br /><br />';
            //html += '   <br /><br />';

            html += '<video id="xcx2342345365654" controls="controls" ></video><br />';
            //html += '<button onClick="">Transcode avi to mp4</button>';
            //html += '<p></p>';

            //html += '   <br /><br />';
            html += '   <br /><br />';







            html += '   <span style="font-style:italic;color:gray;font-size:15pt;">The file name and description are not required because they can be changed later on.</span>';



            html += '   <br /><br />';
            html += '   <input type="checkbox" id="ConfirmFileUploadDialog_ConvertToAPdfCheckbox_' + bwBudgetRequestId + '" />&nbsp;<span style="font-style:italic;color:gray;font-size:15pt;">Convert to a pdf</span>';


            html += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
            html += '   <input type="checkbox" id="ConfirmFileUploadDialog_AddLogoToVideoWithFFMPEG_' + bwBudgetRequestId + '" />&nbsp;<span style="font-style:italic;color:gray;font-size:15pt;">Add logo to the video</span>';



            html += '   <br /><br />';
            html += '   <img xcx="xcx445776" id="ConfirmFileUploadDialog_ImagePreview_' + bwBudgetRequestId + '" src="#" alt="your image" />';
            html += '   <table>';
            html += '       <tr>';
            html += '           <td><span style="font-style:italic;color:gray;font-size:20pt;">file name:</span></td>';
            html += '           <td>';
            html += '               <input type="text" id="txtConfirmFileUploadDialogFilename" style="width:380px;font-size:20pt;" />&nbsp;<span style="font-style:italic;font-size:11pt;color:gray;">';
            html += '               <br />(don\'t include a file extension)';
            html += '               </span>';
            html += '           </td>';
            html += '       </tr>';
            html += '       <tr>';
            html += '           <td></td>';
            html += '           <td></td>';
            html += '       </tr>';
            html += '       <tr>';
            html += '           <td style="vertical-align:top;"><span style="font-style:italic;font-size:20pt;color:gray;">description:</span></td>';
            html += '           <td><textarea id="txtConfirmFileUploadDialogFileDescription" style="overflow:hidden;font-size:20pt;" rows="4" cols="30"></textarea></td>';
            html += '       </tr>';
            html += '   </table>';


            //html += '   <span style="font-style:italic;color:gray;font-size:15pt;font-weight:bold;">Do you wish to execute the FFMPEG file converter on your device? It will take a few minutes to complete...</span>';
            html += '   <div id="' + dialogId + '_btnInitializeFfmpegWasm" class="divDialogButton" title="Click here to initialize ffmpeg.wasm....">';
            html += '       FFMPEG and UPLOAD...';
            html += '   </div>';

            html += '   <br /><br />';
            html += '   <div id="' + dialogId + '_btnUploadTheFileNow" class="divDialogButton" title="Click here to upload the attachment.">';
            html += '       Upload';
            html += '   </div>';
            html += '   <br /><br />';
            html += '   <div id="btnCancelUploadTheFileNow" class="divDialogButton" onclick="$(\'#' + dialogId + '\').dialog(\'close\');">';
            html += '       Cancel';
            html += '   </div>';
            //html += '</div>';

            div.innerHTML = html;

            $('#' + dialogId).dialog({
                //options: { x: x },
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

                        var uploadButton = $('#' + dialogId + '_btnUploadTheFileNow');
                        if (!uploadButton) {

                            alert('xcx214252523 Error: Could not locate element [' + dialogId + '_btnUploadTheFileNow' + '] to attach upload button event...');

                        } else {

                            //alert('xcx214231 THIS SHOULD ONLY BE 1. uploadButton.length: ' + $(uploadButton).length);



                            //$(this).ready(function () {
                            //    try {
                            //alert('Dialog is ready(), attaching events to elements.');
                            console.log('Dialog is ready(). xcx234 adding click events for element: ' + dialogId + '_btnUploadTheFileNow etc.');


                            //
                            // "UPLOAD" button.
                            //
                            $('#' + dialogId + '_btnUploadTheFileNow').off('click').click(function () { // divConfirmFileUploadDialog_ForAttachments_78ebbdca-32d7-4019-9c53-cdc55e11a775_btnUploadTheFileNow

                                //var x = $('#inputFile_' + bwBudgetRequestId)[0]; // $('#' + requestDialogId).find('#inputFile')[0];
                                //var file = x.files[0];

                                //var x = this.options.x;

                                alert('#>>>>In bwAttachments_MusicPlaylist.js.cmdDisplayConfirmFileUploadDialog_ffmpeg_wasm.dialog.open(). xcx23123142. file.name: ' + file.name + '. Element id: ' + 'inputFile_' + bwBudgetRequestId);






                                //alert('xcx21321312. In bwAttachments_MusicPlaylist.js.UploadButton_OnClick(). displayAttachmentsTagName: ' + displayAttachmentsTagName + ', bwBudgetRequestId: ' + bwBudgetRequestId);


                                //$(document).on('click', dialogId + '_btnUploadTheFileNow', function () {
                                //document.getElementById(dialogId + '_btnUploadTheFileNow').addEventListener('click', function () { // divConfirmFileUploadDialog_ForAttachments_5407bd5e-f00e-4e97-9f56-d1c9a86723c2_btnUploadTheFileNow
                                try {
                                    console.log('In bwAttachments_MusicPlaylist.js.UploadButton_OnClick(). displayAttachmentsTagName: ' + displayAttachmentsTagName + ', bwBudgetRequestId: ' + bwBudgetRequestId);
                                    //alert('In bwAttachments_MusicPlaylist.js.UploadButton_OnClick(). displayAttachmentsTagName: ' + displayAttachmentsTagName + ', bwBudgetRequestId: ' + bwBudgetRequestId);

                                    // Check if the user specified a new filename. If so, make sure the file extension is the same!
                                    var originalFilename = file.name;
                                    var filename = file.name;
                                    //debugger;
                                    //var filenameElement = $(this.element).find('#txtConfirmFileUploadDialogFilename'); // removed 8-5-2022
                                    var filenameElement = $('#' + dialogId).find('#txtConfirmFileUploadDialogFilename')[0];
                                    if (filenameElement && filenameElement.value && filenameElement.value.trim().length > 1) {
                                        filename = filenameElement.value.trim().split('.')[0] + '.' + originalFilename.split('.')[1]; // Put the same extension on it.
                                    }

                                    //alert('xcx425 filename: ' + filename + ', dialogId: ' + dialogId);



                                    //var newfilename;
                                    //var filenameElement = $('#' + dialogId).find('#txtConfirmFileUploadDialogFilename');
                                    //if (filenameElement && filenameElement.value && filenameElement.value.trim().length > 1) {
                                    //    newfilename = filenameElement.value.trim().split('.')[0] + '.' + originalFilename.split('.')[1]; // Put the same extension on it.
                                    //}

                                    //var newfilename = $('#' + dialogId).find('#txtConfirmFileUploadDialogFilename').val(); // divConfirmFileUploadDialog_ForAttachments_f437a8b6-ce77-45ac-a3ca-ed3568cae536.find txtConfirmFileUploadDialogFilename

                                    $('#' + dialogId).dialog('close');

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


                                    alert('xcx1112 Calling processUpload for file.name: ' + file.name);
                                    thiz.processUpload(displayAttachmentsTagName, bwBudgetRequestId, file, filename);

                                } catch (e) {
                                    console.log('Exception in bwAttachments_MusicPlaylist.js.btnUploadTheFileNow.click(): ' + e.message + ', ' + e.stack);
                                    alert('Exception in bwAttachments_MusicPlaylist.js.btnUploadTheFileNow.click(): ' + e.message + ', ' + e.stack);
                                }
                            });


                            //
                            // "Cancel" button.
                            //
                            $('#btnCancelUploadTheFileNow').off('click').click(function () {
                                try {
                                    //$(this).dialog("close");

                                    //$('#inputFile_' + bwBudgetRequestId).replaceWith($('#inputFile_' + bwBudgetRequestId).clone());
                                    ////$(this.element).find('#inputFile').replaceWith($('#inputFile').clone()); // Clear the file upload box. May not work in all browsers doing it this way.
                                    ////return false;
                                } catch (e) {
                                    console.log('Exception in btnCancelUploadTheFileNow.click(): ' + e.message + ', ' + e.stack);
                                    alert('Exception in btnCancelUploadTheFileNow.click(): ' + e.message + ', ' + e.stack);
                                }
                            });

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
                            //        if (this.width < 50 || this.height < 50) {
                            //            $('#' + dialogId).dialog('close');
                            //            //alert('The image must be a 400px square. This image is too small.');
                            //            alert('The image must be a 50px square. This image is too small.');
                            //        } else {
                            //            // Now display it.
                            //            var reader = new FileReader();
                            //            reader.onload = function (e) {
                            //                try {
                            //                    $('#' + dialogId).find('#ConfirmFileUploadDialog_ImagePreview_' + bwBudgetRequestId).attr('src', e.target.result);
                            //                    $('#' + dialogId).find('#ConfirmFileUploadDialog_ImagePreview_' + bwBudgetRequestId).attr('style', 'width:400px;'); // 3-12-2022 only specify 1 dimension so that the image is not distorted. // height:400px;');
                            //                } catch (e) {
                            //                    console.log('Exception in cmdDisplayConfirmFileUploadDialog.divConfirmFileUploadDialog.open.img.onload.reader.onload(): ' + e.message + ', ' + e.stack);
                            //                    alert('Exception in cmdDisplayConfirmFileUploadDialog.divConfirmFileUploadDialog.open.img.onload.reader.onload(): ' + e.message + ', ' + e.stack);
                            //                }
                            //            }
                            //            reader.readAsDataURL(file);
                            //        }
                            //    } catch (e) {
                            //        console.log('Exception in cmdDisplayConfirmFileUploadDialog.divConfirmFileUploadDialog.open.img.onload(): ' + e.message + ', ' + e.stack);
                            //        alert('Exception in cmdDisplayConfirmFileUploadDialog.divConfirmFileUploadDialog.open.img.onload(): ' + e.message + ', ' + e.stack);
                            //    }
                            //};
                            //img.src = objectUrl;

                            //    } catch (e) {
                            //        console.log('Exception in cmdDisplayConfirmFileUploadDialog.divConfirmFileUploadDialog.open():2: ' + e.message + ', ' + e.stack);
                            //        alert('Exception in cmdDisplayConfirmFileUploadDialog.divConfirmFileUploadDialog.open():2: ' + e.message + ', ' + e.stack);
                            //    }

                            //});

                        }

                    } catch (e) {
                        console.log('Exception in cmdDisplayConfirmFileUploadDialog.divConfirmFileUploadDialog.open(): ' + e.message + ', ' + e.stack);
                        alert('Exception in cmdDisplayConfirmFileUploadDialog.divConfirmFileUploadDialog.open(): ' + e.message + ', ' + e.stack);
                    }
                }

            });

            // Hide the title bar.
            $('#' + dialogId).dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

            //
            // "FFMPEG AND UPLOAD" button.
            //
            $('#' + dialogId + '_btnInitializeFfmpegWasm').off('click').click(function (x) {
                try {

                    //var inputFileId = 'inputFile_' + bwBudgetRequestId;
                    //var x = document.getElementById(inputFileId);


                    var x2 = $('#inputFile_' + bwBudgetRequestId); // $('#' + requestDialogId).find('#inputFile')[0];
                    ////var files = x.files;
                    //var file = x2.files[0];

                    alert('#>>>>In bwAttachments_MusicPlaylist.js.cmdDisplayConfirmFileUploadDialog_ffmpeg_wasm.xxxxxxxxxx(). x.length: ' + x2.length + '. Element id: ' + 'inputFile_' + bwBudgetRequestId);



                    //alert('#>>>>$$$$$$$$$$$In bwAttachments_MusicPlaylist.js.cmdDisplayConfirmFileUploadDialog_ffmpeg_wasm.dialog.open(). files.length: ' + files.length + '. Element id: ' + 'inputFile_' + bwBudgetRequestId);



                    //alert('###$$$$$$In bwAttachments_MusicPlaylist.js.cmdDisplayConfirmFileUploadDialog_ffmpeg_wasm._btnInitializeFfmpegWasm.click(). files.length: ' + files.length + '. Element id: ' + 'inputFile_' + bwBudgetRequestId);

                    //var formId = 'uploadForm_' + bwBudgetRequestId; 
                    //var form = document.getElementById(formId);

                    //alert('xcx123132 formId: ' + formId + '. form: ' + JSON.stringify(form));

                    if (!(x && x.files && x.files.length && (x.files.length > 0))) {

                        alert('xcx3124 Fatal error in bwAttachments_MusicPlaylist.js.cmdDisplayConfirmFileUploadDialog_ffmpeg_wasm(). NO FILES FOR ELEMENT xcx12345364 [' + 'inputFile_' + bwBudgetRequestId + '].')

                    } else {

                        //var file = x.files[0]; // 11-12-2022

                        //var lastModifiedDate = new Date(file.lastModified);

                        function doit() {
                            try {

                                var ffmpeg;
                                const baseURL = 'https://shareandcollaborate.com/wasm/ffmpeg/umd';

                                var loadTheFFMPEGWebAssembly = async () => {
                                    try {

                                        //const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.1/dist/umd';
                                        //const baseURL = 'https://shareandcollaborate.com/wasm/ffmpeg/umd';
                                        ffmpeg = new FFmpeg();

                                        //// Listen to progress event instead of log.
                                        //ffmpeg.on("progress", ({ progress }) => {
                                        //    alert('xcx3333333333333333333333333. ffmpeg.on.progress().');
                                        //    HideActivitySpinner();
                                        //    ShowActivitySpinner('Processing the file: ' + (progress * 100) + ' %');
                                        //});

                                        ShowActivitySpinner('Loading the FFMPEG web assembly...');

                                        var coreBlob = await fetch(baseURL + '/ffmpeg-core.js').then(r => r.blob());
                                        var coreUrl = URL.createObjectURL(coreBlob, { type: 'text/javascript' });

                                        var wasmBlob = await fetch(baseURL + '/ffmpeg-core.wasm').then(r => r.blob());
                                        var wasmUrl = URL.createObjectURL(wasmBlob, { type: 'application/wasm' });

                                        await ffmpeg.load({
                                            coreURL: coreUrl,
                                            wasmURL: wasmUrl
                                        });

                                        loaded = true;
                                        transcode();

                                        //var promise3 = ShowActivitySpinner('Loading FFMPEG web assembly...');
                                        //promise3.then(function (e) {
                                        //    try {
                                        //        var coreBlob = await fetch(baseURL + '/ffmpeg-core.js').then(r => r.blob());
                                        //        var coreUrl = URL.createObjectURL(coreBlob, { type: 'text/javascript' });

                                        //        var wasmBlob = await fetch(baseURL + '/ffmpeg-core.wasm').then(r => r.blob());
                                        //        var wasmUrl = URL.createObjectURL(wasmBlob, { type: 'application/wasm' });

                                        //        await ffmpeg.load({
                                        //            coreURL: coreUrl,
                                        //            wasmURL: wasmUrl
                                        //        });

                                        //        loaded = true;
                                        //        transcode();

                                        //    } catch (e) {

                                        //        HideActivitySpinner();
                                        //        alert('Exception xcx2143235-333: ' + e.message + ', ' + e.stack);

                                        //    }

                                        //}).catch(function (e) {

                                        //    HideActivitySpinner();
                                        //    alert('Exception xcx2143235-444: ' + JSON.stringify(e));

                                        //});

                                    } catch (e) {
                                        HideActivitySpinner();
                                        alert('Exception xcx2143235-1: ' + e.message + ', ' + e.stack);
                                    }
                                }

                                var transcode = async () => {
                                    try {
                                        HideActivitySpinner();
                                        ShowActivitySpinner('Loading the overlay file...');

                                        // reads the file as an ArrayBuffer and then uses a Uint8Array view of that buffer to write the file to Emscripten's MEMFS:
                                        var reader = new FileReader();

                                        function load_file() {
                                            try {

                                                reader.addEventListener('loadend', print_file);
                                                reader.readAsArrayBuffer(file);

                                            } catch (e) {
                                                HideActivitySpinner();
                                                alert('Exception xcx23499534235-1: ' + e.message + ', ' + e.stack);
                                            }
                                        }

                                        async function print_file(e) {
                                            try {
                                                alert('xcx2134544444');
                                                var result = reader.result;

                                                if (!result) {
                                                    alert('FATAL ERROR! NO result. xcxq234324232-1');
                                                }

                                                //
                                                // Get the video dimensions here. We use these to proportionally set the size of the overlay image.
                                                //

                                                var v = document.createElement('video');
                                                var blob2 = new Blob([result], { type: 'video/mp4' });
                                                var vUrl = URL.createObjectURL(blob2);
                                                v.src = vUrl;
                                                v.play();

                                                var videoWidth;
                                                await v.addEventListener("resize", function (ev) {

                                                    if (!v.videoWidth) {
                                                        videoWidth = 640; // The samsung galaxy tab doesn't return videoWidth.... :/ 8-5-2023.
                                                    } else {
                                                        videoWidth = v.videoWidth;
                                                    }
                                                    v.pause();
                                                    v.remove();

                                                });

                                                //
                                                // end: Get the video dimensions here. We use these to proportionally set the size of the overlay image.
                                                //

                                                const uint8_view = new Uint8Array(result); // Reads the file as an ArrayBuffer and then uses a Uint8Array view of that buffer to write the file to Emscripten's MEMFS:

                                                if (!uint8_view) {
                                                    alert('FATAL ERROR! NO uint8_view. xcxq234324232');
                                                }

                                                HideActivitySpinner();
                                                ShowActivitySpinner('Loading video into FFMPEG...1');

                                                await ffmpeg.writeFile(
                                                    "input.avi", uint8_view
                                                );

                                                // Try to get a custom image. If none found, use the OOB one.
                                                var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

                                                var imagePath;

                                                var preventCachingGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                                                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                                                    return v.toString(16);
                                                });

                                                var activeStateIdentifier = JSON.parse($('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier'));

                                                if (activeStateIdentifier.status != 'SUCCESS') {

                                                    imagePath += '[No image. Unauthorized. xcx213124-3-6664323-3]';

                                                } else {

                                                    imagePath = thiz.options.operationUriPrefix + '_files/' + workflowAppId + '/orgimages/' + 'root' + '/' + 'orgimage.png?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier;

                                                }

                                                HideActivitySpinner();
                                                ShowActivitySpinner('Creating overlay...');

                                                var canvas = document.createElement('canvas');
                                                var ctx = canvas.getContext("2d");
                                                var img = new Image();

                                                var canvasCopy = document.createElement("canvas"); // We use this canvas for the resizing of the image.
                                                var copyContext = canvasCopy.getContext("2d");

                                                img.onload = async function () {
                                                    try {
                                                        console.log('img.onload(). imagePath: ' + imagePath + '. xcx6788889.');





                                                        //alert('xcx2839214 videoWidth: ' + videoWidth);

                                                        //
                                                        // THIS IS WHERE WE DECIDE HOW LARGE THE LOGO OVERLAY WILL BE.
                                                        //
                                                        var canvasWidth;
                                                        if (!videoWidth) {
                                                            canvasWidth = 250; // SMALL
                                                        } else if (videoWidth < 700) {
                                                            canvasWidth = 250; // SMALL
                                                        } else if (videoWidth < 1400) {
                                                            canvasWidth = 350; // MEDIUM.
                                                        } else if (videoWidth < 2100) {
                                                            canvasWidth = 400; // MEDIUM.
                                                        } else if (videoWidth < 2800) {
                                                            canvasWidth = 450; // MEDIUM.
                                                        } else {
                                                            canvasWidth = 500; // LARGE
                                                        }


                                                        var ratio = canvasWidth / img.width;

                                                        var canvasHeight = img.height * ratio;



                                                        //var ratio = 1;

                                                        //if (img.width > canvasWidth)
                                                        //    ratio = maxWidth / img.width;
                                                        //else if (img.height > canvasHeight)
                                                        //    ratio = maxHeight / img.height;

                                                        ////ratio = maxWidth / img.width;

                                                        canvasCopy.width = img.width;
                                                        canvasCopy.height = img.height;
                                                        copyContext.drawImage(img, 0, 0);

                                                        //alert('xcx21354 videoWidth: ' + videoWidth + ', canvasWidth: ' + canvasWidth + ', canvasHeight: ' + canvasHeight);

                                                        canvas.width = canvasWidth; // img.width * ratio;
                                                        canvas.height = canvasHeight; // img.height * ratio;
                                                        ctx.drawImage(canvasCopy, 0, 0, canvasCopy.width, canvasCopy.height, 0, 0, canvas.width, canvas.height);

                                                        canvas.toBlob(async (blob) => {
                                                            try {
                                                                var file5 = URL.createObjectURL(blob);

                                                                // Write the image to the ffmpeg object.
                                                                await ffmpeg.writeFile(
                                                                    "image.png",
                                                                    await fetchFile(file5) //  'https://shareandcollaborate.com/images/corporeal.png')
                                                                );

                                                                HideActivitySpinner();
                                                                ShowActivitySpinner('Transcoding the video...1');

                                                                // ultrafast , superfast , veryfast , faster , fast , medium , slow , slower , veryslow , and placebo
                                                                //await ffmpeg.exec(['-i', 'input.avi', '-preset', 'superfast', '-c:v', 'libx264', '-crf', '35', '-vf', 'scale=640x480', '-movflags', 'faststart', 'output.mp4']);
                                                                //await ffmpeg.exec(['-i', 'input.avi', '-preset', 'ultrafast', '-c:v', 'libx264', '-crf', '35', '-movflags', 'faststart', 'output.mp4']); // '-vf', 'scale=640x480',
                                                                // .addOption('-vf', "drawtext=fontfile=/path/to/font.ttf:text='MP4':fontcolor=white:fontsize=400:box=1:boxcolor=black@0.5:boxborderw=5:x=(w-text_w)/2:y=(h-text_h)/2")
                                                                // ffmpeg -i video.mp4 -i image.png -filter_complex "[0:v][1:v] overlay=25:25:enable='between(t,0,20)'" -pix_fmt yuv420p -c:a copy output.mp4
                                                                //await ffmpeg.exec(['-i', 'input.avi', '-i', 'image.png', '-preset', 'ultrafast', '-c:v', 'libx264', '-crf', '35', '-filter_complex', "[0:v][1:v] overlay=(W-w)/2:(H-h)/2:enable='between(t,0,20)'", '-pix_fmt', 'yuv420p', '-c:a', 'copy', '-movflags', 'faststart', 'output.mp4']); // '-vf', 'scale=640x480',
                                                                // Middle of the screen.
                                                                //ffmpeg.exec(['-i', 'input.avi', '-i', 'image.png', '-preset', 'ultrafast', '-c:v', 'libx264', '-crf', '35', '-filter_complex', '[0:v][1:v] overlay=(W-w)/2:(H-h)/2:', '-pix_fmt', 'yuv420p', '-movflags', 'faststart', 'output.mp4']).then(function (results) {
                                                                // Bottom left of the screen.
                                                                //ffmpeg.exec(['-i', 'input.avi', '-i', 'image.png', '-preset', 'ultrafast', '-c:v', 'libx264', '-crf', '35', '-filter_complex', '[0:v][1:v] overlay=0:(H-h)', '-pix_fmt', 'yuv420p', '-movflags', 'faststart', 'output.mp4']).then(function (results) {
                                                                // [1:v]format=argb,geq=r='r(X,Y)':a='0.5*alpha(X,Y)'[zork]; [0:v][zork]overlay
                                                                //ffmpeg.exec(['-i', 'input.avi', '-i', 'image.png', '-preset', 'ultrafast', '-c:v', 'libx264', '-crf', '35', '-filter_complex', '[0:v][1:v] overlay=0:(H-h)', '-pix_fmt', 'yuv420p', '-movflags', 'faststart', 'output.mp4']).then(function (results) {
                                                                // [1]format=yuva444p,colorchannelmixer=aa=0.5[in2];[0][in2]overlay
                                                                //ffmpeg.exec(['-i', 'input.avi', '-i', 'image.png', '-preset', 'ultrafast', '-c:v', 'libx264', '-crf', '35', '-filter_complex', '[1]format=yuva444p,colorchannelmixer=aa=0.5[image.png];[0][image.png]overlay', '-pix_fmt', 'yuv420p', '-movflags', 'faststart', 'output.mp4']).then(function (results) {
                                                                //ffmpeg.exec(['-i', 'input.avi', '-i', 'image.png', '-preset', 'ultrafast', '-c:v', 'libx264', '-crf', '35', '-filter_complex', '[1]format=yuva444p,colorchannelmixer=aa=0.5[image.png];[0][image.png]overlay=0:(H-h)', '-pix_fmt', 'yuv420p', '-movflags', 'faststart', 'output.mp4']).then(function (results) {
                                                                //    // x=-w+((W+w)/N)*t
                                                                //    // scale the image height to 1/8th the video's height
                                                                //    // scale2ref=oh*mdar:ih/8
                                                                // THIS QWORKS 8-2-2023!!!!!!!!!!!!!!!!!
                                                                //await ffmpeg.exec(['-i', 'input.avi', '-i', 'image.png', '-preset', 'ultrafast', '-c:v', 'libx264', '-crf', '35', '-filter_complex', '[1]format=yuva444p,colorchannelmixer=aa=0.5[image.png];[0][image.png]overlay=0:(H-h)', '-pix_fmt', 'yuv420p', '-movflags', 'faststart', 'output.mp4']);
                                                                //await ffmpeg.exec(['-i', 'input.avi', 'output.mp4']);






                                                                //
                                                                //
                                                                // THIS FORMAT HAS BEEN TESTED A LOT. yuva444p for instance is needed for transparency fo the overlay.
                                                                //
                                                                //

                                                                // "overlay" originates top-left corner. (0,0).

                                                                //var imageHeight = '250'; // Thsi is in pixels.
                                                                //var executionString = `['-i', 'input.avi', '-i', 'image.png', '-preset', 'ultrafast', '-c:v', 'libx264', '-crf', '35', '-filter_complex', '[1]format=yuva444p,colorchannelmixer=aa=0.5[image.png];[0][image.png]overlay=0:(H-` + imageHeight + `)', '-pix_fmt', 'yuv420p', '-movflags', 'faststart', 'output.mp4']`;



                                                                // Listen to progress event instead of log.
                                                                ffmpeg.on("progress", ({ progress }) => {
                                                                    HideActivitySpinner();
                                                                    ShowActivitySpinner('Processing the file: ' + (progress * 100) + ' %');
                                                                });

                                                                // lastModifiedDate

                                                                // Execute the FFMPEG transcoding.
                                                                //var executionString = ['-i', 'input.avi', '-i', 'image.png', '-preset', 'ultrafast', '-c:v', 'libx264', '-crf', '35', '-filter_complex', '[1]format=yuva444p,colorchannelmixer=aa=0.5[image.png];[0][image.png]overlay=0:H-h', '-pix_fmt', 'yuv420p', '-movflags', 'faststart', 'output.mp4'];

                                                                // Good but removed overlay
                                                                //var executionString = ['-i', 'input.avi', '-i', 'image.png', '-preset', 'ultrafast', '-c:v', 'libx264', '-crf', '35', '-filter_complex', '[1]format=yuva444p,colorchannelmixer=aa=0.5[image.png];[0][image.png]overlay=0:H-h', '-pix_fmt', 'yuv420p', '-map_metadata', '0', '-movflags', 'faststart', 'output.mp4'];




                                                                // That refers to the Constant Rate Factor (crf).

                                                                // As others have pointed out (Thanks all), the values will depend on which encoder you're using.

                                                                // For x264 your valid range is 0-51:

                                                                // The range of the quantizer scale is 0-51: where 0 is lossless, 23 is default, and 51 is worst possible. A lower value is a higher quality and a
                                                                // subjectively sane range is 18-28. Consider 18 to be visually lossless or nearly so: it should look the same or nearly the same as the input but it
                                                                // isn't technically lossless.
                                                                // 23 is default.
                                                                var executionString = ['-i', 'input.avi', '-preset', 'ultrafast', '-c:v', 'libx264', '-crf', '18', '-pix_fmt', 'yuv420p', '-map_metadata', '0', '-movflags', 'faststart', 'output.mp4'];
                                                                //var executionString = ['-i', 'input.avi', '-preset', 'ultrafast', '-c:v', 'libx264', '-crf', '35', '-pix_fmt', 'yuv420p', '-map_metadata', '0', '-movflags', 'faststart', 'output.mp4'];
                                                                await ffmpeg.exec(executionString);

                                                                // Get the resulting image from FFMPEG.
                                                                var data = await ffmpeg.readFile('output.mp4'); // This returns this error in the console: 814.ffmpeg.js:1 Uncaught (in promise) DOMException: Failed to execute 'postMessage' on 'DedicatedWorkerGlobalScope': function(errno){this.errno=errno} could not be cloned.

                                                                if (!data || !data.buffer) {
                                                                    alert('FATAL ERROR NO buffer data. xcx4444332.');
                                                                }

                                                                var blob2 = new Blob([data.buffer], { type: 'video/mp4' });
                                                                var objectUrl = URL.createObjectURL(blob2);

                                                                document.getElementById('xcx2342345365654').src = objectUrl; // URL.createObjectURL(blob);

                                                                console.log('In bwAttachments_MusicPlaylist.js.UploadButton_OnClick(). xcx124677'); // displayAttachmentsTagName: ' + displayAttachmentsTagName + ', bwBudgetRequestId: ' + bwBudgetRequestId);

                                                                var filename = file.name;

                                                                var extensionIndex = filename.split('.').length - 1;
                                                                var tmp = '';
                                                                for (var i = 0; i < extensionIndex; i++) {
                                                                    tmp += filename.split('.')[i];
                                                                }
                                                                filename = tmp + '.mp4';

                                                                //alert('filename: ' + filename);

                                                                // Check if the user specified a new filename. If so, make sure the file extension is the same!
                                                                //var filenameElement = $('#' + dialogId).find('#txtConfirmFileUploadDialogFilename')[0];
                                                                //if (filenameElement && filenameElement.value && filenameElement.value.trim().length > 1) {
                                                                //    //
                                                                //    // This makes sure that if the user specified a new file name, that we put the correct file extension at the end. // 6-8-2023.
                                                                //    //

                                                                //    var extensionIndex_new = filenameElement.value.trim().split('.').length - 1;
                                                                //    var fileExtension_new = filenameElement.value.trim().toLowerCase().split('.')[extensionIndex_new];

                                                                //    //if (fileExtension_original == fileExtension_new) {
                                                                //    //    // It already has the correct file extension, so don't do anything to it.
                                                                //    //} else {

                                                                //    //    // It doesn't already have the correct file extension, so we will add it here.
                                                                //    //    filename = filenameElement.value.trim() + '.' + 'mp4'; // fileExtension_original; // Put the same extension on it.

                                                                //    //}
                                                                //}

                                                                var convertToAPdfElement = $('#' + dialogId).find('#ConfirmFileUploadDialog_ConvertToAPdfCheckbox_' + bwBudgetRequestId)[0];
                                                                var convertToAPdf = convertToAPdfElement.checked; // Returns true or false.

                                                                $('#' + dialogId).dialog('close');

                                                                console.log('In bwAttachments_MusicPlaylist.js.UploadButton_OnClick(). Getting ready to call processUpload(). filename: ' + filename + ', file.name: ' + file.name); //              displayAttachmentsTagName: ' + displayAttachmentsTagName + ', bwBudgetRequestId: ' + bwBudgetRequestId);
                                                                //alert('In bwAttachments_MusicPlaylist.js.UploadButton_OnClick(). Getting ready to call processUpload(). filename: ' + filename + ', file.name: ' + file.name); //              displayAttachmentsTagName: ' + displayAttachmentsTagName + ', bwBudgetRequestId: ' + bwBudgetRequestId);

                                                                var outFile = new File([blob2], filename);

                                                                HideActivitySpinner();

                                                                if (!outFile) {
                                                                    alert('FATAL ERROR xcx213125555. No outFile.');
                                                                }

                                                                thiz.processUpload(displayAttachmentsTagName, bwBudgetRequestId, outFile, outFile.name, convertToAPdf);

                                                            } catch (e) {
                                                                HideActivitySpinner();
                                                                alert('Exception xcx332114343255235777L ' + e.message + ', ' + e.stack);
                                                            }
                                                        });




                                                    } catch (e) {
                                                        HideActivitySpinner();
                                                        alert('Exception xcx332114343255: ' + e.message + ', ' + e.stack);
                                                    }
                                                }
                                                img.src = imagePath;



                                            } catch (e) {
                                                HideActivitySpinner();
                                                alert('Exception xcx234995-1: ' + e.message + ', ' + e.stack);
                                            }

                                        }

                                        load_file();

                                    } catch (e) {
                                        alert('Exception xcx332114: ' + e.message + ', ' + e.stack);
                                    }
                                }

                                loadTheFFMPEGWebAssembly();


                            } catch (e) {
                                HideActivitySpinner();
                                alert('Exception xcx2143235d324324234-3: ' + e.message + ', ' + e.stack);
                            }
                        };


                        // Find out if the file type is '.vob', '.avi', '.mp4', '.m4v', ...? 10-20-2023.

                        //var filename = file.name;

                        //var extensionIndex = filename.split('.').length - 1;
                        //var extension = '';
                        //for (var i = 0; i < extensionIndex; i++) {
                        //    extension += filename.split('.')[i];
                        //}
                        ////filename = tmp + '.mp4';

                        //alert('xcx23213 extension: ' + extension);
                        alert('xcx232115123677357876345');
                        doit();

                    }

                } catch (e) {
                    alert('Exception in bwAttachments_MusicPlaylist.js.cmdDisplayConfirmFileUploadDialog_ffmpeg_wasm.button.click(): ' + e.message + ', ' + e.stack);
                    console.log('Exception in bwAttachments_MusicPlaylist.js.cmdDisplayConfirmFileUploadDialog_ffmpeg_wasm.button.click(): ' + e.message + ', ' + e.stack);
                    displayAlertDialog('Exception in bwAttachments_MusicPlaylist.js.cmdDisplayConfirmFileUploadDialog_ffmpeg_wasm.button.click(): ' + e.message + ', ' + e.stack);

                }
            });

        } catch (e) {
            console.log('Exception in bwAttachments_MusicPlaylist.js.cmdDisplayConfirmFileUploadDialog_ffmpeg_wasm(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwAttachments_MusicPlaylist.js.cmdDisplayConfirmFileUploadDialog_ffmpeg_wasm(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwAttachments_MusicPlaylist.js.cmdDisplayConfirmFileUploadDialog_ffmpeg_wasm(): ' + e.message + ', ' + e.stack);
        }
    },


    downloadLargeFile: function (bwBudgetRequestId, filename) {
        try {
            console.log('In bwAttachments_MusicPlaylist.js.downloadLargeFile().');
            alert('In bwAttachments_MusicPlaylist.js.downloadLargeFile().');

            var thiz = this;

            //ShowActivitySpinner('Preparing zip for download. This may take a while...');

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

            //var data = {
            //    bwParticipantId_LoggedIn: participantId,
            //    bwActiveStateIdentifier: activeStateIdentifier,
            //    bwWorkflowAppId_LoggedIn: workflowAppId,

            //    bwWorkflowAppId: workflowAppId,
            //    bwBudgetRequestId: bwBudgetRequestId,
            //    filename: filename
            //};

            var operationUri = this.options.operationUriPrefix + '_files/' + 'download' + '/' + participantId + '/' + activeStateIdentifier + '/' + workflowAppId + '/' + workflowAppId + '/' + bwBudgetRequestId + '/' + filename;
            $.ajax({
                url: operationUri,
                type: 'GET',
                headers: { "Content-Type": "application/octet-stream", "Content-Disposition": "attachment;filename=\"' + filename + '\"" },
                //contentType: 'application/json',

                timeout: 60000,
                success: function (results) {
                    try {

                        if (results.status != 'SUCCESS') {

                            var msg = 'Error in bwAttachments_MusicPlaylist.js.downloadLargeFile(). ' + results.status + ': ' + results.message;
                            console.log(msg);
                            displayAlertDialog(msg);

                        } else {

                            displayAlertDialog('SUCCES');

                            //HideActivitySpinner();

                            //displayAlertDialog(results.message);// The status is 'SUCCESS', so we don't need to say it again. They will see th eifle show up

                            //thiz.populateAttachments(workflowAppId, bwBudgetRequestId, 'newrequestattachments');

                            ////
                            //// We need to give the server a second to catch up.
                            ////
                            //setTimeout(function () {

                            //    HideActivitySpinner();

                            //    const link = document.createElement('a')

                            //    link.setAttribute('href', results.Url);
                            //    link.setAttribute('download', results.Filename)
                            //    link.style.display = 'none'

                            //    document.body.appendChild(link);

                            //    link.click(); // This is what invokes the download window.

                            //    document.body.removeChild(link); // Clean up.

                            //}, 2000);

                        }

                    } catch (e) {

                        //HideActivitySpinner();

                        var msg = 'Exception in bwAttachments_MusicPlaylist.js.downloadLargeFile.download(): ' + e.message + ', ' + e.stack;
                        console.log(msg);
                        displayAlertDialog(msg);
                        //$(this.element).find('#newrequestattachments')[0].innerHTML = msg;
                    }
                },
                error: function (data, errorCode, errorMessage) {

                    //HideActivitySpinner();

                    var msg = 'Error in bwAttachments_MusicPlaylist.js.downloadLargeFile.download(): errorMessage: ' + errorMessage + ', errorCode: ' + errorCode + ', data: ' + JSON.stringify(data) + ', operationUri: ' + operationUri;
                    console.log(msg);
                    displayAlertDialog(msg);

                    //$('#divWorkingOnItDialog').dialog('close'); // Close the "Working on it..." dialog.
                    //console.log('Error in bwAttachments_MusicPlaylist.js.renderAndPopulateAttachments.dropzone.drop(): ' + errorMessage);
                    //debugger;
                    //if (errorMessage == 'timeout') {
                    //    displayAlertDialog('The file server could not be contacted. Please try again in a few minutes.');
                    //} else {
                    //    displayAlertDialog('Error in bwAttachments_MusicPlaylist.js.renderAndPopulateAttachments.dropzone.drop(): ' + errorMessage);
                    //}
                }
            });



        } catch (e) {
            var msg = 'Exception in bwAttachments_MusicPlaylist.js.downloadLargeFile(): ' + e.message + ', ' + e.stack;
            console.log(msg);
            displayAlertDialog(msg);
        }
    },

    cmdDisplayConfirmFileUploadDialog_zip_wasm: async function (displayAttachmentsTagName, bwBudgetRequestId, requestDialogId, element) { // element is >>> var x = $('#inputFile_' + bwBudgetRequestId)[0]; // $('#' + requestDialogId).find('#inputFile')[0];
        try {

            //
            //
            // Decided on this zip wasm: https://bpajk.github.io/WasmZip/ It's 470KB in total, which is amazingly small. It is also amazingly fast with slightly better compression than windows! Woop! :)
            //
            //

            HideActivitySpinner();

            console.log('In bwAttachments_MusicPlaylist.js.cmdDisplayConfirmFileUploadDialog_zip_wasm(). bwBudgetRequestId: ' + bwBudgetRequestId);
            alert('In bwAttachments_MusicPlaylist.js.cmdDisplayConfirmFileUploadDialog_zip_wasm(). bwBudgetRequestId: ' + bwBudgetRequestId);

            var thiz = this;
            debugger;
            var dialogId = 'divConfirmFileUploadDialog_ForAttachments_zip_wasm_' + bwBudgetRequestId;

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
            //html += '                   Select the \'Upload\' button...';
            html += '                   ZIP.WASM';
            html += '               </span>';
            html += '           </td>';
            html += '           <td style="width:9%;"></td>';
            html += '           <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '               <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 120pt;font-weight:bold;" onclick="$(\'#' + dialogId + '\').dialog(\'close\');">X</span>';
            html += '           </td>';
            html += '       </tr>';
            html += '   </table>';
            html += '   <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
            //html += '   <br /><br />';




            //html += '   <br /><br />';
            //html += '   <br /><br />';

            html += '<div id="xcx2342345365654-2" ></div><br />'; // This is where we display the attachments before zipping them up.
            //html += '<button onClick="">Transcode avi to mp4</button>';
            //html += '<p></p>';

            //html += '   <br /><br />';
            html += '   <br /><br />';







            html += '   <span style="font-style:italic;color:gray;font-size:15pt;">The file name and description are not required because they can be changed later on.</span>';



            html += '   <br /><br />';
            html += '   <input type="checkbox" id="ConfirmFileUploadDialog_ConvertToAPdfCheckbox_' + bwBudgetRequestId + '" />&nbsp;<span style="font-style:italic;color:gray;font-size:15pt;">Convert to a pdf</span>';


            html += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
            html += '   <input type="checkbox" id="ConfirmFileUploadDialog_AddLogoToVideoWithFFMPEG_' + bwBudgetRequestId + '" />&nbsp;<span style="font-style:italic;color:gray;font-size:15pt;">Add logo to the video</span>';



            html += '   <br /><br />';
            html += '   <img xcx="xcx445776" id="ConfirmFileUploadDialog_ImagePreview_' + bwBudgetRequestId + '" src="#" alt="your image" />';
            html += '   <table>';
            html += '       <tr>';
            html += '           <td><span style="font-style:italic;color:gray;font-size:20pt;">file name:</span></td>';
            html += '           <td>';
            html += '               <input type="text" id="txtConfirmFileUploadDialogFilename" style="width:380px;font-size:20pt;" />&nbsp;<span style="font-style:italic;font-size:11pt;color:gray;">';
            html += '               <br />(don\'t include a file extension)';
            html += '               </span>';
            html += '           </td>';
            html += '       </tr>';
            html += '       <tr>';
            html += '           <td></td>';
            html += '           <td></td>';
            html += '       </tr>';
            html += '       <tr>';
            html += '           <td style="vertical-align:top;"><span style="font-style:italic;font-size:20pt;color:gray;">description:</span></td>';
            html += '           <td><textarea id="txtConfirmFileUploadDialogFileDescription" style="overflow:hidden;font-size:20pt;" rows="4" cols="30"></textarea></td>';
            html += '       </tr>';
            html += '   </table>';


            //html += '   <span style="font-style:italic;color:gray;font-size:15pt;font-weight:bold;">Do you wish to execute the FFMPEG file converter on your device? It will take a few minutes to complete...</span>';
            html += '   <div id="' + dialogId + '_btnInitializeZipWasm" class="divDialogButton" title="Click here to initialize ffmpeg.wasm....">';
            html += '       ZIP and UPLOAD...';
            html += '   </div>';

            html += '   <br /><br />';
            html += '   <div id="' + dialogId + '_btnUploadTheFileNow" class="divDialogButton" title="Click here to upload the attachment.">';
            html += '       Upload';
            html += '   </div>';
            html += '   <br /><br />';
            html += '   <div id="btnCancelUploadTheFileNow" class="divDialogButton" onclick="$(\'#' + dialogId + '\').dialog(\'close\');">';
            html += '       Cancel';
            html += '   </div>';
            //html += '</div>';

            div.innerHTML = html;

            //function uploadZipFile(data, fileName, bwBudgetRequestId) { // data: Int8Array
            //    try {

            //        HideActivitySpinner();

            //        var file = new File([data], { type: "octet/stream" });
            //        file.name = fileName;
            //        thiz.performUpload2(file, fileName, bwBudgetRequestId, null, false); // data: Int8Array >>> convert to input type="file" element....

            //    } catch (e) {
            //        console.log('Exception in bwAttachments_MusicPlaylist.js.uploadZipFile(): ' + e.message + ', ' + e.stack);
            //        alert('Exception in bwAttachments_MusicPlaylist.js.uploadZipFile(): ' + e.message + ', ' + e.stack);
            //        displayAlertDialog('Exception in bwAttachments_MusicPlaylist.js.uploadZipFile(): ' + e.message + ', ' + e.stack);
            //    }
            //}



            //
            // FOR SOME reason it always seems to load on time. Maybe we don't have to pre-load, like I did for FFMPEG WASM... 9-9-2023.
            //
            // wait for the WebAssembly module to load
            //Module['onRuntimeInitialized'] = () => {

            $('#' + dialogId + '_btnInitializeZipWasm').off('click').click(function (error) {
                try {

                    ShowActivitySpinner('Compressing the files for upload...');

                    var x = $('#inputFile_' + bwBudgetRequestId)[0];

                    var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

                    var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                    });

                    //var archiveFileName = 'ZIPPEDFILES_' + workflowAppId + '_' + bwBudgetRequestId + '_' + guid + '.zip'; // We are using a guid for the filename in order to circumvent (on mobile Samsung, "Are you sure you wish to download this file again?").
                    var archiveFileName = 'ZIPPEDFILES_' + guid + '.zip'; // We are using a guid for the filename in order to circumvent (on mobile Samsung, "Are you sure you wish to download this file again?").
                    var zip = new Module.Zip(archiveFileName);
                    var files = x.files;

                    var trackingArray = []; // We use this to keep track if all of the files have been added to the zip file.
                    for (var i = 0; i < files.length; i++) {
                        trackingArray.push(files[i].name);
                    }

                    console.log('In bwAttachments_MusicPlaylist.js.cmdDisplayConfirmFileUploadDialog_zip_wasm.button.click(). PREPARING TO ZIP THESE FILES AND UPLOAD TO THE SERVER: ' + JSON.stringify(trackingArray));

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
                                console.log('Exception in bwAttachments_MusicPlaylist.js.cmdDisplayConfirmFileUploadDialog_zip_wasm.button.click.reader.load(): ' + e.message + ', ' + e.stack);
                                displayAlertDialog('Exception in bwAttachments_MusicPlaylist.js.cmdDisplayConfirmFileUploadDialog_zip_wasm.button.click.reader.load(): ' + e.message + ', ' + e.stack);
                                alert('Exception in bwAttachments_MusicPlaylist.js.cmdDisplayConfirmFileUploadDialog_zip_wasm.button.click.reader.load(): ' + e.message + ', ' + e.stack);
                            }
                        };

                        reader.readAsArrayBuffer(file);

                    }

                } catch (e) {
                    console.log('Exception in bwAttachments_MusicPlaylist.js.cmdDisplayConfirmFileUploadDialog_zip_wasm.button.click(): ' + e.message + ', ' + e.stack);
                    displayAlertDialog('Exception in bwAttachments_MusicPlaylist.js.cmdDisplayConfirmFileUploadDialog_zip_wasm.button.click(): ' + e.message + ', ' + e.stack);
                    alert('Exception in bwAttachments_MusicPlaylist.js.cmdDisplayConfirmFileUploadDialog_zip_wasm.button.click(): ' + e.message + ', ' + e.stack);
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
                        var x = document.getElementById('inputFile_' + bwBudgetRequestId); // This element is on the request form with the "Choose File" button, not the attachments dialog.
                        //var x = $('#divConfirmFileUploadDialog_ForAttachments').find('#inputFile_' + bwBudgetRequestId)[0];
                        var file = x.files[0];

                        var uploadButton = $('#' + dialogId + '_btnUploadTheFileNow');
                        if (!uploadButton) {

                            alert('xcx214252523 Error: Could not locate element [' + dialogId + '_btnUploadTheFileNow' + '] to attach upload button event...');

                        } else {

                            //alert('xcx214231 THIS SHOULD ONLY BE 1. uploadButton.length: ' + $(uploadButton).length);


                            $(this).ready(function () {

                                //alert('Dialog is ready(), attaching events to elements.');
                                console.log('Dialog is ready(). xcx234 adding click event for element: ' + dialogId + '_btnUploadTheFileNow');


                                //$('#' + dialogId + '_btnUploadTheFileNow').off('click').click(function () { // divConfirmFileUploadDialog_ForAttachments_78ebbdca-32d7-4019-9c53-cdc55e11a775_btnUploadTheFileNow
                                $('#' + dialogId + '_btnUploadTheFileNow').off('click').click(function () { // divConfirmFileUploadDialog_ForAttachments_78ebbdca-32d7-4019-9c53-cdc55e11a775_btnUploadTheFileNow
                                    //$(document).on('click', dialogId + '_btnUploadTheFileNow', function () {
                                    //document.getElementById(dialogId + '_btnUploadTheFileNow').addEventListener('click', function () { // divConfirmFileUploadDialog_ForAttachments_5407bd5e-f00e-4e97-9f56-d1c9a86723c2_btnUploadTheFileNow

                                    alert('xcx999994-1. In bwAttachments_MusicPlaylist.js.UploadButton_OnClick(). displayAttachmentsTagName: ' + displayAttachmentsTagName + ', bwBudgetRequestId: ' + bwBudgetRequestId);

                                    try {
                                        console.log('In bwAttachments_MusicPlaylist.js.UploadButton_OnClick(). displayAttachmentsTagName: ' + displayAttachmentsTagName + ', bwBudgetRequestId: ' + bwBudgetRequestId);
                                        //alert('In bwAttachments_MusicPlaylist.js.UploadButton_OnClick(). displayAttachmentsTagName: ' + displayAttachmentsTagName + ', bwBudgetRequestId: ' + bwBudgetRequestId);

                                        // Check if the user specified a new filename. If so, make sure the file extension is the same!
                                        var originalFilename = file.name;
                                        var filename = file.name;
                                        //debugger;
                                        //var filenameElement = $(this.element).find('#txtConfirmFileUploadDialogFilename'); // removed 8-5-2022
                                        var filenameElement = $('#' + dialogId).find('#txtConfirmFileUploadDialogFilename')[0];
                                        if (filenameElement && filenameElement.value && filenameElement.value.trim().length > 1) {
                                            filename = filenameElement.value.trim().split('.')[0] + '.' + originalFilename.split('.')[1]; // Put the same extension on it.
                                        }

                                        //alert('xcx425 filename: ' + filename + ', dialogId: ' + dialogId);



                                        //var newfilename;
                                        //var filenameElement = $('#' + dialogId).find('#txtConfirmFileUploadDialogFilename');
                                        //if (filenameElement && filenameElement.value && filenameElement.value.trim().length > 1) {
                                        //    newfilename = filenameElement.value.trim().split('.')[0] + '.' + originalFilename.split('.')[1]; // Put the same extension on it.
                                        //}

                                        //var newfilename = $('#' + dialogId).find('#txtConfirmFileUploadDialogFilename').val(); // divConfirmFileUploadDialog_ForAttachments_f437a8b6-ce77-45ac-a3ca-ed3568cae536.find txtConfirmFileUploadDialogFilename

                                        $('#' + dialogId).dialog('close');

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



                                        thiz.processUpload(displayAttachmentsTagName, bwBudgetRequestId, file, filename);

                                    } catch (e) {
                                        console.log('Exception in bwAttachments_MusicPlaylist.js.btnUploadTheFileNow.click(): ' + e.message + ', ' + e.stack);
                                        alert('Exception in bwAttachments_MusicPlaylist.js.btnUploadTheFileNow.click(): ' + e.message + ', ' + e.stack);
                                    }
                                });
                            });

                        }

                        $('#btnCancelUploadTheFileNow').off('click').click(function () {
                            try {
                                //$(this).dialog("close");

                                //$('#inputFile_' + bwBudgetRequestId).replaceWith($('#inputFile_' + bwBudgetRequestId).clone());
                                ////$(this.element).find('#inputFile').replaceWith($('#inputFile').clone()); // Clear the file upload box. May not work in all browsers doing it this way.
                                ////return false;
                            } catch (e) {
                                console.log('Exception in btnCancelUploadTheFileNow.click(): ' + e.message + ', ' + e.stack);
                                alert('Exception in btnCancelUploadTheFileNow.click(): ' + e.message + ', ' + e.stack);
                            }
                        });

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
                                    $('#' + dialogId).dialog('close');
                                    //alert('The image must be a 400px square. This image is too small.');
                                    alert('The image must be a 50px square. This image is too small.2');
                                } else {
                                    // Now display it.
                                    var reader = new FileReader();
                                    reader.onload = function (e) {
                                        try {
                                            $('#' + dialogId).find('#ConfirmFileUploadDialog_ImagePreview_' + bwBudgetRequestId).attr('src', e.target.result);
                                            $('#' + dialogId).find('#ConfirmFileUploadDialog_ImagePreview_' + bwBudgetRequestId).attr('style', 'width:400px;'); // 3-12-2022 only specify 1 dimension so that the image is not distorted. // height:400px;');
                                        } catch (e) {
                                            console.log('Exception in cmdDisplayConfirmFileUploadDialog.divConfirmFileUploadDialog.open.img.onload.reader.onload(): ' + e.message + ', ' + e.stack);
                                            alert('Exception in cmdDisplayConfirmFileUploadDialog.divConfirmFileUploadDialog.open.img.onload.reader.onload(): ' + e.message + ', ' + e.stack);
                                        }
                                    }
                                    reader.readAsDataURL(file);
                                }
                            } catch (e) {
                                console.log('Exception in cmdDisplayConfirmFileUploadDialog.divConfirmFileUploadDialog.open.img.onload(): ' + e.message + ', ' + e.stack);
                                alert('Exception in cmdDisplayConfirmFileUploadDialog.divConfirmFileUploadDialog.open.img.onload(): ' + e.message + ', ' + e.stack);
                            }
                        };
                        img.src = objectUrl;



                    } catch (e) {
                        console.log('Exception in cmdDisplayConfirmFileUploadDialog.divConfirmFileUploadDialog.open(): ' + e.message + ', ' + e.stack);
                        alert('Exception in cmdDisplayConfirmFileUploadDialog.divConfirmFileUploadDialog.open(): ' + e.message + ', ' + e.stack);
                    }
                }

            });

            // Hide the title bar.
            $('#' + dialogId).dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

        } catch (e) {
            console.log('Exception in bwAttachments_MusicPlaylist.js.cmdDisplayConfirmFileUploadDialog_zip_wasm(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwAttachments_MusicPlaylist.js.cmdDisplayConfirmFileUploadDialog_zip_wasm(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwAttachments_MusicPlaylist.js.cmdDisplayConfirmFileUploadDialog_zip_wasm(): ' + e.message + ', ' + e.stack);
        }
    },

    ffmpegMultiFileMergeAndUpload: async function (bwBudgetRequestId, inputFileAttachmentsElement) {
        try {
            console.log('In bwAttachments_MusicPlaylist.js.ffmpegMultiFileMergeAndUpload(). bwBudgetRequestId: ' + bwBudgetRequestId);
            alert('In bwAttachments_MusicPlaylist.js.ffmpegMultiFileMergeAndUpload(). bwBudgetRequestId: ' + bwBudgetRequestId + ', files.length: ' + inputFileAttachmentsElement.files.length);

            alert('more to do here xcx213123.');



        } catch (e) {
            console.log('Exception in bwAttachments_MusicPlaylist.js.ffmpegMultiFileMergeAndUpload(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwAttachments_MusicPlaylist.js.ffmpegMultiFileMergeAndUpload(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwAttachments_MusicPlaylist.js.ffmpegMultiFileMergeAndUpload(): ' + e.message + ', ' + e.stack);
        }
    },

    FFMPEGConvertAndUploadMultipleVideoFiles_Batch: function (x, bwBudgetRequestId, dialogId) {
        var thiz = this;
        return new Promise(function (resolve, reject) {
            try {
                console.log('In bwAttachments_MusicPlaylist.js.FFMPEGConvertAndUploadMultipleVideoFiles_Batch().');

                console.log('');
                console.log('**********');
                console.log('**********');
                console.log('Starting a new file conversion batch.');
                console.log('**********');
                console.log('**********');
                console.log('');

                var promiseArray = [];
                for (var i = 0; i < thiz.options.smallFileBatchArray[x].length; i++) {

                    var promise = thiz.FFMPEGConvertAndUploadVideoFile(thiz.options.smallFileBatchArray[x][i], bwBudgetRequestId, dialogId).then(function (results) {

                        var result = {
                            status: 'SUCCESS',
                            message: 'SUCCESS'
                        }
                        resolve(result);

                    }).catch(function (e) {

                        alert('Exception in bwAttachments_MusicPlaylist.js.FFMPEGConvertAndUploadMultipleVideoFiles_Batch(). xcx4567. e.FailedFileName: ' + e.FailedFileName + ', JSON.stringify(e): ' + JSON.stringify(e));
                        var msg = 'Exception in bwAttachments_MusicPlaylist.js.FFMPEGConvertAndUploadMultipleVideoFiles_Batch():3: e.FailedFileName: ' + e.FailedFileName + ', JSON.stringify(e): ' + JSON.stringify(e);

                        var result = {
                            status: 'EXCEPTION',
                            message: msg,
                            FailedFileName: e.FailedFileName

                        }
                        reject(result);

                    });

                    promiseArray.push(promise);

                }
                Promise.all(promiseArray)
                    .then(function (results) {

                        console.log('');
                        console.log('**********');
                        console.log('**********');
                        console.log('Completed uploading the file conversion batch.');
                        console.log('**********');
                        console.log('**********');
                        console.log('');

                        //displayAlertDialog_Persistent('Completed uploading the file conversion batch.');

                        var result = {
                            status: 'SUCCESS',
                            message: 'SUCCESS'
                        }
                        resolve(result);

                    }).catch(function (e) {


                        var msg = 'Exception in bwAttachments_MusicPlaylist.js.FFMPEGConvertAndUploadMultipleVideoFiles_Batch():2: ' + JSON.stringify(e);
                        alert(msg);
                        var result = {
                            status: 'EXCEPTION',
                            message: msg
                        }
                        reject(result);

                    });

            } catch (e) {

                var msg = 'Exception in bwAttachments_MusicPlaylist.js.FFMPEGConvertAndUploadMultipleVideoFiles_Batch():1: ' + e.message + ', ' + e.stack;

                var result = {
                    status: 'EXCEPTION',
                    message: msg
                }
                reject(result);

            }
        });
    },

    FFMPEGConvertAndUploadVideoFile: function (file, bwBudgetRequestId, dialogId) {
        var thiz = this;
        return new Promise(function (resolve, reject) {
            try {
                console.log('In bwAttachments_MusicPlaylist.js.FFMPEGConvertAndUploadVideoFile().');
                //alert('In bwAttachments_MusicPlaylist.js.FFMPEGConvertAndUploadVideoFile(). file.name: ' + file.name);

                //
                //
                // FFMPEG/WASM: https://ffmpegwasm.netlify.app/docs/api/ffmpeg/classes/FFmpeg#off
                //
                // What is the maximum size of input file? 2 GB, which is a hard limit in WebAssembly.Might become 4 GB in the future.
                //
                //

                var ffmpeg;
                const baseURL = 'https://shareandcollaborate.com/wasm/ffmpeg/umd';

                var loadTheFFMPEGWebAssembly = async function (file) {
                    try {
                        console.log('In loadTheFFMPEGWebAssembly(). xcx213123.');
                        //const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.1/dist/umd';
                        //const baseURL = 'https://shareandcollaborate.com/wasm/ffmpeg/umd';
                        ffmpeg = new FFmpeg();

                        ShowActivitySpinner('Loading the FFMPEG web assembly... ' + baseURL + '/ffmpeg-core.js');
                        console.log('Loading the FFMPEG web assembly... ' + baseURL + '/ffmpeg-core.js');

                        var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');
                        debugger;
                        await ffmpeg.load({
                            coreURL: baseURL + '/ffmpeg-core.js?ActiveStateIdentifier=' + JSON.parse(activeStateIdentifier).ActiveStateIdentifier,
                            wasmURL: baseURL + '/ffmpeg-core.wasm?ActiveStateIdentifier=' + JSON.parse(activeStateIdentifier).ActiveStateIdentifier
                        });

                        transcode(file);


                        //var coreBlob = await fetch(baseURL + '/ffmpeg-core.js').then(r => r.blob());
                        //var coreUrl = URL.createObjectURL(coreBlob, { type: 'text/javascript' });
                        ////debugger;
                        ////var wasmBlob = await fetch(baseURL + '/ffmpeg-core.wasm').then(r => r.blob());
                        ////var wasmUrl = URL.createObjectURL(wasmBlob, { type: 'application/wasm' });

                        //await ffmpeg.load({
                        //    coreURL: coreUrl,
                        //    wasmURL: wasmUrl
                        //});

                        //loaded = true;

                        //transcode(file);

                    } catch (e) {

                        HideActivitySpinner();

                        var msg = 'Exception xcx2143235-5. Failed in loadTheFFMPEGWebAssembly(). NOTE THIS WILL FAIL IF THE WASM AND THE FILE EXCEEDS THE WASM 2GB LIMIT: ' + e.message + ', ' + e.stack;
                        displayAlertDialog_Persistent(msg);
                        alert(msg);

                        var result = {
                            status: 'EXCEPTION',
                            message: msg
                        }
                        reject(result);

                    }
                }

                var transcode = async function (file) { // changed from arrows 11-11-2023
                    try {

                        HideActivitySpinner();
                        ShowActivitySpinner('Launching the process for file "' + file.name + '"...');

                        function load_file(file) {
                            try {

                                var reader = new FileReader();

                                reader.addEventListener('loadend', print_file);
                                reader.filename = file.name;

                                reader.readAsArrayBuffer(file);

                            } catch (e) {

                                HideActivitySpinner();
                                var msg = 'Exception in bwAttachments_MusicPlaylist.js.FFMPEGConvertAndUploadVideoFile.transcode.load_file(): ' + e.message + ', ' + e.stack;
                                console.log(msg);
                                alert(msg);

                                var result = {
                                    status: 'EXCEPTION',
                                    message: msg
                                }
                                reject(result);

                            }
                        }

                        async function print_file(files) {
                            try {

                                var inputFilename = files.currentTarget.filename;

                                var extensionIndex = inputFilename.split('.').length - 1;
                                var tmp = '';
                                for (var i = 0; i < extensionIndex; i++) {
                                    tmp += inputFilename.split('.')[i];
                                }

                                var outputFilename;
                                var fileExtension = inputFilename.toLowerCase().split('.')[extensionIndex];
                                if (fileExtension == 'mp4') {
                                    outputFilename = tmp + '(processed)' + '.mp4'; // If the source is a .mp4, we have the same input and output filename, which doesn't work. So, we are adding (processed) to the end of the output filename.
                                } else {
                                    outputFilename = tmp + '.mp4';
                                }

                                var result = files.currentTarget.result;

                                if (!result) {

                                    //
                                    // THIS FILE FAILED, SO ADD IT BACK TO THE LIST.
                                    //

                                    displayAlertDialog_Persistent('Error in bwAttachments_MusicPlaylist.js.FFMPEGConvertAndUploadVideoFile.transcode.print_file(). files.currentTarget.result: ' + files.currentTarget.result + ', inputFilename: ' + inputFilename + ', bwBudgetRequestId: ' + bwBudgetRequestId);

                                    var msg = 'Error in bwAttachments_MusicPlaylist.js.FFMPEGConvertAndUploadVideoFile.transcode.print_file(). FATAL ERROR! NO result in print_file(). result: ' + result;
                                    console.log(msg);
                                    alert(msg);

                                    var result = {
                                        status: 'EXCEPTION',
                                        message: msg
                                    }
                                    reject(result);

                                } else {

                                    var uint8_view = new Uint8Array(result); // Reads the file as an ArrayBuffer and then uses a Uint8Array view of that buffer to write the file to Emscripten's MEMFS:

                                    if (!uint8_view) {
                                        alert('FATAL ERROR! NO uint8_view. xcxq234324232');
                                    }

                                    ffmpeg.on("progress", function ({ progress }) { //, time }) {
                                        try {

                                            HideActivitySpinner();

                                            var percentComplete = Math.round(progress * 100);

                                            ShowActivitySpinner_FileUpload('Processing the file "' + inputFilename + '"');

                                            $("#divBwActivitySpinner_FileUpload_ProgressBar").width(percentComplete + '%');
                                            $("#divBwActivitySpinner_FileUpload_ProgressBar").html(Math.round(percentComplete) + '%');

                                            $("#divBwActivitySpinner_FileUpload_ProgressBar_StatusText").html(thiz.options.ActivitySpinner_FileUpload_ProgressBar_StatusText);

                                        } catch (e) {
                                            alert('Exception xcx99458886: ' + e.message + ', ' + e.stack);
                                        }
                                    });

                                    ffmpeg.on("log", function ({ type, message }) {
                                        console.log('FFMPEG type: ' + type + ', message: ' + message);
                                    });

                                    ffmpeg.writeFile(inputFilename, uint8_view).then(function (data) {
                                        try {

                                            // That refers to the Constant Rate Factor (crf).
                                            // As others have pointed out (Thanks all), the values will depend on which encoder you're using.
                                            // For x264 your valid range is 0-51:
                                            // The range of the quantizer scale is 0-51: where 0 is lossless, 23 is default, and 51 is worst possible. A lower value is a higher quality and a
                                            // subjectively sane range is 18-28. Consider 18 to be visually lossless or nearly so: it should look the same or nearly the same as the input but it
                                            // isn't technically lossless.
                                            // 23 is default.
                                            //var executionString = ['-i', inputFilename, '-preset', 'ultrafast', '-c:v', 'libx264', '-crf', '18', '-pix_fmt', 'yuv420p', '-map_metadata', '0', '-movflags', 'faststart', outputFilename];




                                            // 5-30-2024.
                                            //var executionString = ['-i', inputFilename, '-preset', 'ultrafast', '-c:v', 'libx264', '-crf', '18', '-pix_fmt', 'yuv420p', '-vf', 'scale=720:-1', '-map_metadata', '0', '-movflags', 'faststart', outputFilename];


                                            //
                                            //
                                            // EWITH ALL THE MESING AROUND, THE BEST SOLUTION SHOULD MAYBE UST BE A UPLOAD PROGRESS IDICATOR< DISPLAYING HOW LONG UNTIL THE VIDEO IS PLAYED.... 7-7-2024
                                            //
                                            //

                                            //
                                            // 7-7-2024. The one above was good! (5-30-2024) But due to slowness on the client, I am proposing that we just do 1 thing... that is run this with faststart. Fast start will provide the most amount of benefit and help out the UI a lot.
                                            //
                                            var executionString = ['-i', inputFilename, '-preset', 'superfast', '-c:v', 'libx264', '-movflags', '+faststart', outputFilename]; // This reduced a file from 362.6MB to 83.1MB.
                                            //var executionString = ['-i', inputFilename, '-preset', 'ultrafast', '-movflags', '+faststart', outputFilename];




                                            //
                                            // -nostdin not '-y', may mean some errors are raised which we want to know about... such as "the file already exists". 11-11-2023.
                                            //
                                            //var executionString = ['-i', inputFilename, '-nostdin', '-n', '-preset', 'ultrafast', '-c:v', 'libx264', '-crf', '18', '-pix_fmt', 'yuv420p', '-map_metadata', '0', '-movflags', 'faststart', outputFilename];
                                            ffmpeg.exec(executionString).then(function (data) {
                                                try {

                                                    ffmpeg.deleteFile(inputFilename).then(function (data) {
                                                        try {

                                                            if (data != true) {

                                                                HideActivitySpinner();

                                                                displayAlertDialog_Persistent('xcx231233112-1. Error ffmpeg.deleteFile returned false.');

                                                            } else {

                                                                ffmpeg.readFile(outputFilename).then(function (data) {
                                                                    try {

                                                                        if (!data || !data.buffer) {
                                                                            alert('FATAL ERROR NO buffer data. xcx4444332.');
                                                                        }

                                                                        var blob2 = new Blob([data.buffer], { type: 'video/mp4' });

                                                                        var outFile = new File([blob2], outputFilename);

                                                                        if (!outFile) {
                                                                            alert('FATAL ERROR xcx213125555. No outFile.');
                                                                        }

                                                                        //await ffmpeg.deleteFile( // This doesnt help free up any resources from what I can tell.... 11-11-2023.
                                                                        //    inputFilename
                                                                        //);

                                                                        //await ffmpeg.deleteFile( // This doesnt help free up any resources from what I can tell.... 11-11-2023.
                                                                        //    outputFilename
                                                                        //);

                                                                        HideActivitySpinner();

                                                                        thiz.performUpload3(outFile, outputFilename, bwBudgetRequestId, null, false).then(function (data) {

                                                                            //
                                                                            // NOW THAT THE UPLOAD IS COMPLETE, DELETE THE FILES FROM FFMPEG IN ORDER TO FREE UP RESOURCES.
                                                                            //

                                                                            console.log('NOW THAT THE UPLOAD IS COMPLETE, DELETE THE FILES FROM FFMPEG IN ORDER TO FREE UP RESOURCES.');

                                                                            var result = {
                                                                                status: 'SUCCESS',
                                                                                message: 'SUCCESS'
                                                                            }
                                                                            resolve(result);

                                                                            ffmpeg.deleteFile(inputFilename).then(function (data) {
                                                                                try {

                                                                                    if (data != true) {

                                                                                        HideActivitySpinner();

                                                                                        displayAlertDialog_Persistent('xcx231233112-1-xcx1. Error ffmpeg.deleteFile returned false.');

                                                                                    } else {

                                                                                        ffmpeg.deleteFile(outputFilename).then(function (data) {
                                                                                            try {

                                                                                                if (data != true) {

                                                                                                    HideActivitySpinner();

                                                                                                    displayAlertDialog_Persistent('xcx231233112-2-xcx1. Error ffmpeg.deleteFile returned false.');

                                                                                                } else {

                                                                                                    console.log('THE FILE HAS BEEN UPLOADED AND DELETED FROM FFMPEG [' + inputFilename + ', ' + outputFilename + ']. data: ' + JSON.stringify(data));

                                                                                                    displayAlertDialog_Persistent('THE FILE HAS BEEN UPLOADED AND DELETED FROM FFMPEG [' + inputFilename + ', ' + outputFilename + ']. data: ' + JSON.stringify(data));

                                                                                                }

                                                                                            } catch (e) {
                                                                                                var msg = 'Exception in bwAttachments_MusicPlaylist.js.FFMPEGConvertAndUploadVideoFile.transcode.print_file.ffmpeg.writeFile.exec.readFile():2-xcx1: ' + e.message + ', ' + e.stack;
                                                                                                console.log(msg);
                                                                                                alert(msg);
                                                                                            }

                                                                                        }).catch(function (e) {

                                                                                            var msg = 'Exception in bwAttachments_MusicPlaylist.js.FFMPEGConvertAndUploadVideoFile.transcode.print_file.ffmpeg.writeFile.exec.readFile.catch():1-2-1-xcx1: ' + JSON.stringify(e);
                                                                                            console.log(msg);
                                                                                            alert(msg);

                                                                                        });

                                                                                    }

                                                                                } catch (e) {

                                                                                    var msg = 'Exception in bwAttachments_MusicPlaylist.js.FFMPEGConvertAndUploadVideoFile.transcode.print_file.ffmpeg.writeFile.exec.readFile():2-xcx1: ' + e.message + ', ' + e.stack;
                                                                                    console.log(msg);
                                                                                    alert(msg);

                                                                                }

                                                                            }).catch(function (e) {

                                                                                var msg = 'Exception in bwAttachments_MusicPlaylist.js.FFMPEGConvertAndUploadVideoFile.transcode.print_file.ffmpeg.writeFile.exec.readFile.catch():1-2-2-xcx1: ' + JSON.stringify(e);
                                                                                console.log(msg);
                                                                                alert(msg);

                                                                            });

                                                                        }).catch(function (e) {
                                                                            alert('xcx21312312355');
                                                                        });

                                                                    } catch (e) {

                                                                        var msg = 'Exception in bwAttachments_MusicPlaylist.js.FFMPEGConvertAndUploadVideoFile.transcode.print_file.ffmpeg.writeFile.exec.readFile():2: ' + e.message + ', ' + e.stack;
                                                                        console.log(msg);
                                                                        alert(msg);

                                                                    }

                                                                }).catch(function (e) {

                                                                    var msg = 'WILL THIS BUBBLE TO THE TOP1? Exception in bwAttachments_MusicPlaylist.js.FFMPEGConvertAndUploadVideoFile.transcode.print_file.ffmpeg.writeFile.exec.readFile.catch():1: FATAL EXCEPTION. PUTTING THE FILE IN THE RETRY LIST1. JSON.stringify(e): ' + JSON.stringify(e);
                                                                    console.log(msg);
                                                                    alert(msg);
                                                                    displayAlertDialog_Persistent(msg);

                                                                    var result = {
                                                                        status: 'EXCEPTION',
                                                                        message: msg,
                                                                        FailedFileName: inputFilename
                                                                    }
                                                                    reject(result);

                                                                });

                                                            }

                                                        } catch (e) {

                                                            var msg = 'Exception in bwAttachments_MusicPlaylist.js.FFMPEGConvertAndUploadVideoFile.transcode.print_file.ffmpeg.writeFile.exec.readFile():2: ' + e.message + ', ' + e.stack;
                                                            console.log(msg);
                                                            alert(msg);
                                                        }

                                                    }).catch(function (e) {

                                                        var msg = 'Exception in bwAttachments_MusicPlaylist.js.FFMPEGConvertAndUploadVideoFile.transcode.print_file.ffmpeg.writeFile.exec.readFile.catch():1-2-2: ' + JSON.stringify(e);
                                                        console.log(msg);
                                                        alert(msg);

                                                    });

                                                } catch (e) {

                                                    var msg = 'Exception in bwAttachments_MusicPlaylist.js.FFMPEGConvertAndUploadVideoFile.transcode.print_file.ffmpeg.writeFile.exec():2: ' + e.message + ', ' + e.stack;
                                                    console.log(msg);
                                                    alert(msg);

                                                }

                                            }).catch(function (e) {
                                                try {

                                                    //
                                                    //
                                                    // ffmpeg.exec has failed. Deleting the files and adding the file back to the queue.
                                                    //
                                                    //

                                                    var msg = 'ffmpeg.exec has failed. Deleting the files and adding the file back to the queue.';
                                                    console.log(msg);
                                                    alert(msg);

                                                    ffmpeg.deleteFile(inputFilename).then(function (data) {
                                                        try {

                                                            if (data != true) {

                                                                displayAlertDialog_Persistent('xcx231233112-1-xcx1. Error ffmpeg.deleteFile returned false.');

                                                            } else {

                                                                ffmpeg.deleteFile(outputFilename).then(function (data) {
                                                                    try {

                                                                        if (data != true) {

                                                                            displayAlertDialog_Persistent('xcx231233112-2-xcx1. Error ffmpeg.deleteFile returned false.');

                                                                        } else {

                                                                            console.log('THE FILE HAS BEEN DELETED FROM FFMPEG [' + inputFilename + ']. data: ' + JSON.stringify(data));

                                                                            var msg = 'xcx12345. ffmpeg.exec has failed. Deleting the files and adding the file back to the queue. inputFilename: ' + inputFilename + ',  NO VALUE NEEDED/POSSIBLE/ITSOK FOR THIS: e.FailedFileName: ' + e.FailedFileName + ', outputFilename: ' + outputFilename;
                                                                            console.log(msg);
                                                                            alert(msg);
                                                                            displayAlertDialog_Persistent(msg);

                                                                            var result = {
                                                                                status: 'EXCEPTION',
                                                                                message: msg,
                                                                                FailedFileName: inputFilename
                                                                            }
                                                                            reject(result);

                                                                        }

                                                                    } catch (e) {

                                                                        var msg = 'Exception in bwAttachments_MusicPlaylist.js.FFMPEGConvertAndUploadVideoFile.transcode.print_file.ffmpeg.writeFile.exec.readFile():2-xcx1: ' + e.message + ', ' + e.stack;
                                                                        console.log(msg);
                                                                        alert(msg);
                                                                    }

                                                                }).catch(function (e) {

                                                                    var msg = 'Exception in bwAttachments_MusicPlaylist.js.FFMPEGConvertAndUploadVideoFile.transcode.print_file.ffmpeg.writeFile.exec.readFile.catch():1-2-1-xcx1: ' + JSON.stringify(e);
                                                                    console.log(msg);
                                                                    alert(msg);

                                                                });

                                                            }

                                                        } catch (e) {

                                                            var msg = 'Exception in bwAttachments_MusicPlaylist.js.FFMPEGConvertAndUploadVideoFile.transcode.print_file.ffmpeg.writeFile.exec.readFile():2-xcx1: ' + e.message + ', ' + e.stack;
                                                            console.log(msg);
                                                            alert(msg);

                                                        }

                                                    }).catch(function (e) {

                                                        var msg = 'Exception in bwAttachments_MusicPlaylist.js.FFMPEGConvertAndUploadVideoFile.transcode.print_file.ffmpeg.writeFile.exec.readFile.catch():1-2-2-xcx1: ' + JSON.stringify(e);
                                                        console.log(msg);
                                                        alert(msg);

                                                    });

                                                } catch (e) {

                                                    var msg = 'Exception in bwAttachments_MusicPlaylist.js.FFMPEGConvertAndUploadVideoFile.transcode.print_file.ffmpeg.writeFile.catch(): ' + e.message + ', ' + e.stack;
                                                    console.log(msg);
                                                    alert(msg);
                                                    displayAlertDialog_Persistent(msg);

                                                }
                                            });

                                        } catch (e) {

                                            var msg = 'Exception in bwAttachments_MusicPlaylist.js.FFMPEGConvertAndUploadVideoFile.transcode.print_file.ffmpeg.writeFile():2: ' + e.message + ', ' + e.stack;
                                            console.log(msg);
                                            alert(msg);

                                        }

                                    }).catch(function (e) {

                                        var msg = 'Exception in bwAttachments_MusicPlaylist.js.FFMPEGConvertAndUploadVideoFile.transcode.print_file.ffmpeg.writeFile():1: ' + JSON.stringify(e);
                                        console.log(msg);
                                        alert(msg);

                                    });

                                }

                            } catch (e) {

                                HideActivitySpinner();

                                var msg = 'Exception in bwAttachments_MusicPlaylist.js.FFMPEGConvertAndUploadVideoFile.transcode.print_file(): ' + e.message + ', ' + e.stack;
                                console.log(msg);
                                alert(msg);
                                displayAlertDialog(msg);

                                var result = {
                                    status: 'EXCEPTION',
                                    message: msg
                                }
                                reject(msg);

                            }

                        }

                        load_file(file);

                    } catch (e) {

                        var msg = 'Exception in bwAttachments_MusicPlaylist.js.FFMPEGConvertAndUploadVideoFile.transcode(): ' + e.message + ', ' + e.stack;
                        console.log(msg);
                        alert(msg);

                        var result = {
                            status: 'EXCEPTION',
                            message: msg
                        }
                        reject(result);

                    }
                }

                loadTheFFMPEGWebAssembly(file);

            } catch (e) {

                HideActivitySpinner();

                var msg = 'Exception in bwAttachments_MusicPlaylist.js.FFMPEGConvertAndUploadVideoFile(): ' + e.message + ', ' + e.stack;
                console.log(msg);

                alert(msg);

                var result = {
                    status: 'EXCEPTION',
                    message: msg
                }
                reject(msg);

            }
        });
    },

    CloseDialog_btnCancelUploadTheFileNow: function (bwBudgetRequestId, dialogId) {
        try {
            console.log('In bwAttachments_MusicPlaylist.js.CloseDialog_btnCancelUploadTheFileNow().');

            //
            // This resets the value of the input file element so that if the same file is selected a second time, it behaves as expected. 11-29-2023.
            // This should only happen in populateAttachments() and in CloseDialog_btnCancelUploadTheFileNow().
            //
            console.log('This resets the value of the input file element so that if the same file is selected a second time, it behaves as expected. This should only happen in populateAttachments() and in CloseDialog_btnCancelUploadTheFileNow().');
            var inputFileAttachmentsElement = $('#inputFile_' + bwBudgetRequestId)[0];
            inputFileAttachmentsElement.value = '';
            //
            //
            //

            $('#' + dialogId).dialog('close');

        } catch (e) {
            var msg = 'Exception in bwAttachments_MusicPlaylist.js.CloseDialog_btnCancelUploadTheFileNow(): ' + e.message + ', ' + e.stack;
            console.log(msg);
            displayAlertDialog(msg);
        }
    },

    cmdDisplayMultiFileUploadDialog: function (displayAttachmentsTagName, bwBudgetRequestId, files) {
        try {
            console.log('In bwAttachments_MusicPlaylist.js.cmdDisplayMultiFileUploadDialog(). bwBudgetRequestId: ' + bwBudgetRequestId);
            //alert('In bwAttachments_MusicPlaylist.js.cmdDisplayMultiFileUploadDialog(). bwBudgetRequestId: ' + bwBudgetRequestId);
            var thiz = this;

            var dialogId = 'divConfirmFileUploadDialog_MultiFile_' + bwBudgetRequestId;

            //
            //
            // This is the new method which replaces cmdDisplayConfirmFileUploadDialog_zip_wasm. DONT LOSE THAT CODE!!!!!!!!!!!!! Also realize the async nature of it's function definition...11-10-2023.
            //
            // bwAttachments_MusicPlaylist.js.uploadAttachment() has the line which resets/clears the input file element which has the attachments. THIS MAY NEED TO GO SOMEWHERE IN THE NEAR FUTURE S THAT A USER CAN RETRY TO LOAD THE SAME FILE. 11-10-2023.
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

                    console.log('In bwAttachments_MusicPlaylist.js.cmdDisplayMultiFileUploadDialog.button.click(). PREPARING TO ZIP THESE FILES AND UPLOAD TO THE SERVER: ' + JSON.stringify(trackingArray));

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
                                console.log('Exception in bwAttachments_MusicPlaylist.js.cmdDisplayMultiFileUploadDialog.CompressAndUploadImages(): ' + e.message + ', ' + e.stack);
                                displayAlertDialog('Exception in bwAttachments_MusicPlaylist.js.cmdDisplayMultiFileUploadDialog.CompressAndUploadImages(): ' + e.message + ', ' + e.stack);
                                alert('Exception in bwAttachments_MusicPlaylist.js.cmdDisplayMultiFileUploadDialog.CompressAndUploadImages(): ' + e.message + ', ' + e.stack);
                            }
                        };

                        reader.readAsArrayBuffer(file);

                    }

                } catch (e) {
                    alert('Exception in bwAttachments_MusicPlaylist.js.cmdDisplayMultiFileUploadDialog.CompressAndUploadImages(): ' + e.message + ', ' + e.stack);
                    console.log('Exception in bwAttachments_MusicPlaylist.js.cmdDisplayMultiFileUploadDialog.CompressAndUploadImages(): ' + e.message + ', ' + e.stack);
                    displayAlertDialog('Exception in bwAttachments_MusicPlaylist.js.cmdDisplayMultiFileUploadDialog.CompressAndUploadImages(): ' + e.message + ', ' + e.stack);
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
                    alert('Exception in bwAttachments_MusicPlaylist.js.cmdDisplayMultiFileUploadDialog.UploadMultipleFiles(): ' + e.message + ', ' + e.stack);
                    console.log('Exception in bwAttachments_MusicPlaylist.js.cmdDisplayMultiFileUploadDialog.UploadMultipleFiles(): ' + e.message + ', ' + e.stack);
                    displayAlertDialog('Exception in bwAttachments_MusicPlaylist.js.cmdDisplayMultiFileUploadDialog.UploadMultipleFiles(): ' + e.message + ', ' + e.stack);
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

                    alert('xcx3124 Fatal error in bwAttachments_MusicPlaylist.js.cmdDisplayMultiFileUploadDialog(). NO FILES. files.length: ' + files.length); // FOR ELEMENT xcx12345364-2 [' + 'inputFile_' + bwBudgetRequestId + '].')

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
                html += '               <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 120pt;font-weight:bold;" onclick="$(\'.bwAttachments_MusicPlaylist\').bwAttachments_MusicPlaylist(\'CloseDialog_btnCancelUploadTheFileNow\', \'' + bwBudgetRequestId + '\', \'' + dialogId + '\');">X</span>';
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
                ////html += '   <div id="' + dialogId + '_ffmpegMultiFileMergeAndUpload" class="divDialogButton" title="Click here to initialize ffmpeg.wasm...." >'; // onclick="$(\'bwAttachments_MusicPlaylist\').bwAttachments_MusicPlaylist(\'ffmpegMultiFileMergeAndUpload\', bwBudgetRequestId, files);">';
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
                html += '   <div id="btnCancelUploadTheFileNow" class="divDialogButton" onclick="$(\'.bwAttachments_MusicPlaylist\').bwAttachments_MusicPlaylist(\'CloseDialog_btnCancelUploadTheFileNow\', \'' + bwBudgetRequestId + '\', \'' + dialogId + '\');" >';
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
                    console.log('Exception in bwAttachments_MusicPlaylist.js.cmdDisplayMultiFileUploadDialog.FFMPEGConvertAndUploadMultipleVideoFiles_CreateAndRunBatches(): ' + e.message + ', ' + e.stack);
                    alert('Exception in bwAttachments_MusicPlaylist.js.cmdDisplayMultiFileUploadDialog.FFMPEGConvertAndUploadMultipleVideoFiles_CreateAndRunBatches(): ' + e.message + ', ' + e.stack);
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
                                console.log('In bwAttachments_MusicPlaylist.js.cmdDisplayMultiFileUploadDialog.promise.all.catch():1: ' + e.message + ', ' + e.stack);
                                alert('In bwAttachments_MusicPlaylist.js.cmdDisplayMultiFileUploadDialog.promise.all.catch():1: ' + e.message + ', ' + e.stack);
                            }

                        }).catch(function (e) {

                            console.log('In bwAttachments_MusicPlaylist.js.cmdDisplayMultiFileUploadDialog.promise.all.catch(). e: ' + JSON.stringify(e));
                            displayAlertDialog('In bwAttachments_MusicPlaylist.js.cmdDisplayMultiFileUploadDialog.promise.all.catch(). e: ' + JSON.stringify(e));

                        });

                    } else {

                        FFMPEGConvertAndUploadMultipleVideoFiles_CreateAndRunBatches(smallFileArray);

                    }

                } catch (e) {
                    alert('Exception in bwAttachments_MusicPlaylist.js.cmdDisplayMultiFileUploadDialog.ConvertAndUploadVideoFiles(): ' + e.message + ', ' + e.stack);
                    console.log('Exception in bwAttachments_MusicPlaylist.js.cmdDisplayMultiFileUploadDialog.ConvertAndUploadVideoFiles(): ' + e.message + ', ' + e.stack);
                    displayAlertDialog('Exception in bwAttachments_MusicPlaylist.js.cmdDisplayMultiFileUploadDialog.ConvertAndUploadVideoFiles(): ' + e.message + ', ' + e.stack);
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

                        alert('xcx3124 Fatal error in bwAttachments_MusicPlaylist.js.cmdDisplayMultiFileUploadDialog._btnSmartUpload(). NO FILES. files.length: ' + files.length); // FOR ELEMENT xcx12345364-2 [' + 'inputFile_' + bwBudgetRequestId + '].')

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
                    console.log('Exception in bwAttachments_MusicPlaylist.js._btnSmartUpload.button.click(): ' + e.message + ', ' + e.stack);
                    displayAlertDialog('Exception in bwAttachments_MusicPlaylist.js._btnSmartUpload.button.click(): ' + e.message + ', ' + e.stack);
                    alert('Exception in bwAttachments_MusicPlaylist.js._btnSmartUpload.button.click(): ' + e.message + ', ' + e.stack);
                }
            });

            $('#' + dialogId + '_btnUploadNoProcessing').off('click').click(function (error) {
                try {

                    if (!(files && files.length)) {

                        alert('xcx3124 Fatal error in bwAttachments_MusicPlaylist.js.cmdDisplayMultiFileUploadDialog._btnUploadNoProcessing(). NO FILES FOR ELEMENT xcx12345364-2 [' + 'inputFile_' + bwBudgetRequestId + '].')

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
                    console.log('Exception in bwAttachments_MusicPlaylist.js._btnUploadNoProcessing.button.click(): ' + e.message + ', ' + e.stack);
                    displayAlertDialog('Exception in bwAttachments_MusicPlaylist.js._btnUploadNoProcessing.button.click(): ' + e.message + ', ' + e.stack);
                    alert('Exception in bwAttachments_MusicPlaylist.js._btnUploadNoProcessing.button.click(): ' + e.message + ', ' + e.stack);
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

                        //        //    alert('xcx999994-2. In bwAttachments_MusicPlaylist.js.UploadButton_OnClick(). displayAttachmentsTagName: ' + displayAttachmentsTagName + ', bwBudgetRequestId: ' + bwBudgetRequestId);

                        //        //    try {
                        //        //        console.log('In bwAttachments_MusicPlaylist.js.UploadButton_OnClick(). displayAttachmentsTagName: ' + displayAttachmentsTagName + ', bwBudgetRequestId: ' + bwBudgetRequestId);
                        //        //        //alert('In bwAttachments_MusicPlaylist.js.UploadButton_OnClick(). displayAttachmentsTagName: ' + displayAttachmentsTagName + ', bwBudgetRequestId: ' + bwBudgetRequestId);

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
                        //        //        console.log('Exception in bwAttachments_MusicPlaylist.js.btnUploadTheFileNow.click(): ' + e.message + ', ' + e.stack);
                        //        //        alert('Exception in bwAttachments_MusicPlaylist.js.btnUploadTheFileNow.click(): ' + e.message + ', ' + e.stack);
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
            console.log('Exception in bwAttachments_MusicPlaylist.js.cmdDisplayMultiFileUploadDialog(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwAttachments_MusicPlaylist.js.cmdDisplayMultiFileUploadDialog(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwAttachments_MusicPlaylist.js.cmdDisplayMultiFileUploadDialog(): ' + e.message + ', ' + e.stack);
        }
    },

    processUpload: function (displayAttachmentsTagName, _budgetRequestId, file, filename, convertToAPdf) { // convertToAPdf means that we will attempt to put the attachment into a pdf and save it as a pdf file.
        try {
            console.log('In bwAttachments_MusicPlaylist.js.processUpload().');
            //alert('In bwAttachments_MusicPlaylist.js.processUpload(). filename: ' + filename);
            var thiz = this;

            if (!file || file.length == 0) {

                displayAlertDialog('There was an error. Zero files returned.');

            } else {

                console.log('In bwAttachments_MusicPlaylist.js.processUpload(). filename: ' + filename);
                //alert('In bwAttachments_MusicPlaylist.js.processUpload(). filename: ' + filename);

                if (filename.indexOf('.xml') > 0) {
                    // XML files add 3 characters to the start of the file when using readAsArrayBuffer, so using readAsText instead!
                    var reader = new FileReader();
                    reader.onload = function (event) {
                        var fileData = reader.result;
                        //displayAlertDialog('fileData prior to ws call:' + fileData);
                        //debugger;
                        thiz.performUpload(fileData, filename, displayAttachmentsTagName, _budgetRequestId, convertToAPdf); // _budgetRequestId);
                    };
                    reader.readAsText(file);
                } else {

                    console.log('In bwAttachments_MusicPlaylist.js.processUpload(). Calling performUpload().');
                    thiz.performUpload(file, filename, displayAttachmentsTagName, _budgetRequestId, convertToAPdf);

                }

            }
        } catch (e) {
            console.log('In processUpload() catch for second attempt...: ' + e.message + ', ' + e.stack);
            alert('In processUpload() catch for second attempt...: ' + e.message + ', ' + e.stack);
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
                displayAlertDialog('Exception in processUpload(): Uploading files doesn\'t seem to be supported in your browser: ' + e2.number + ': ' + e2.message);
            }
        }
    },
    performUpload: function (outFile, filename, displayAttachmentsTagName, bwBudgetRequestId, convertToAPdf) { // convertToAPdf means that we will attempt to put the attachment into a pdf and save it as a pdf file.
        try {
            console.log('In bwAttachments_MusicPlaylist.js.performUpload().');
            console.log('In bwAttachments_MusicPlaylist.js.performUpload(). ARE WE STILL USING THIS METHOD? filename: ' + filename + ', outFile.name: ' + outFile.name);
            var thiz = this;

            var largeFileUploadEnabled = $('.bwAuthentication').bwAuthentication('option', 'largeFileUploadEnabled');

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
            var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

            console.log('In performUpload(). IS THIS POPULATED AND CORRECT? IF SO THIS IS THE FIX: ' + bwBudgetRequestId);

            // Description
            var dialogId = 'divConfirmFileUploadDialog_ForAttachments_' + bwBudgetRequestId;
            var description = $('#' + dialogId).find('#txtConfirmFileUploadDialogFileDescription').val();

            var size = 0;
            var fileElementId = 'inputFile_' + bwBudgetRequestId;
            var fileElement = $('#' + fileElementId)[0];
            if (fileElement && fileElement.files && fileElement.files[0] && fileElement.files[0].size) {
                size = fileElement.files[0].size;
            }
            console.log('size: ' + size + ', fileElement: ' + fileElement);

            if (!size) {
                //alert('xcx1234234 size: ' + size);
                //alert('fileElement: ' + JSON.stringify(fileElement));
                console.log('fileElement: ' + JSON.stringify(fileElement));
                debugger;
            }

            // 2-4-2022
            console.log('In bwAttachments_MusicPlaylist.js.performUpload(). workflowAppId: ' + workflowAppId + ', bwBudgetRequestId: ' + bwBudgetRequestId);

            var elementId = 'uploadForm_' + bwBudgetRequestId;
            var element = $('#' + elementId)[0];
            var formData = new FormData(element);

            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

            if (!(formData && formData.set)) {



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
                            Filename: filename,
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
                            type: "PUT",
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
                                    console.log('In bwAttachments_MusicPlaylist.js.xx(). This resets the file input for uploading, so the onchange/change event fires as expected. xcx86984.');
                                    //alert('render bwAttachments_MusicPlaylist and maybe xxxxxx');
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

                                        console.log('Calling bwAttachments_MusicPlaylist.js.populateAttachments(). xcx13124-3');
                                        alert('xcx213234-17 calling populateAttachments().');
                                        thiz.populateAttachments(workflowAppId, bwBudgetRequestId, displayAttachmentsTagName, true); // This lists the attachments in the <p> tag with id='attachments'.

                                    } else if (data.status == 'NO_REQUEST_SAVED') {

                                        console.log('xcx23235NO_REQUEST_SAVED  data.result: ' + data.result); // 9-8-2022

                                        // This means it must have been the first attachment uploaded for a new request. In this case, we will call back to the server and create the new request, so that it is not lost.
                                        console.log('xcx2143234215 This means it must have been the first attachment uploaded for a new request. <<< IS THIS TRUE???????????????????????');

                                        console.log('');
                                        console.log('xcx2143234215 This means it must have been the first attachment uploaded for a new request. In this case, we will call back to the server and create the new request, so that it is not lost. Calling bwRequest.js.saveAndPublishTheRequest().');
                                        console.log('');



                                        console.log('8-23-2022 FIXED THIS, remove this log entry once the bwAttachments_MusicPlaylist.js widget works 100%. xcx1236899 bwBudgetRequestId: ' + bwBudgetRequestId);
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

                                            displayAlertDialog('In bwAttachments_MusicPlaylist.js.performUpload(). Could not find budgetrequestform with bwBudgetRequestId: ' + bwBudgetRequestId);

                                        } else {

                                            //$('.bwRequest').bwRequest('saveAndPublishTheRequest', 'divPageContent1', true, bwBudgetRequestId, bwRequestTypeId); // This saves and publishes the New Request for the first time. 9-8-2022

                                            // 1-6-2022
                                            $('.bwRequest').bwRequest('saveAndPublishTheRequest', 'divPageContent1', true, bwBudgetRequestId, bwRequestTypeId) // This saves and publishes the New Request for the first time. 9-8-2022
                                                .then(function (results) {

                                                    if (results.status != 'SUCCESS') {

                                                        var msg = 'Error in bwAttachments_MusicPlaylist.js.performUpload(). xcx21345-1: ' + results.status + ', ' + results.message;
                                                        displayAlertDialog(msg);

                                                    } else {

                                                        console.log('Calling bwAttachments_MusicPlaylist.js.populateAttachments(). xcx13124-4');
                                                        alert('xcx213234-16 calling populateAttachments().');
                                                        thiz.populateAttachments(workflowAppId, bwBudgetRequestId, displayAttachmentsTagName, true); // This lists the attachments in the <p> tag with id='attachments'.

                                                    }

                                                }).catch(function (e) {

                                                    console.log('Calling bwAttachments_MusicPlaylist.js.populateAttachments(). xcx13124-5');
                                                    alert('xcx213234-15 calling populateAttachments().');
                                                    thiz.populateAttachments(workflowAppId, bwBudgetRequestId, displayAttachmentsTagName, true); // This lists the attachments in the <p> tag with id='attachments'.
                                                    console.log('Exception from Promise in bwAttachments_MusicPlaylist.js.performUpload(). xcx21345-2: ' + JSON.stringify(e));

                                                });

                                        }

                                    } else if (data.status == 'ERROR') {

                                        if (data.message.indexOf('gmError: Error: Command failed: identify-im6.q16: no decode delegate for this image format `M4A') > -1) {

                                            // In this case, for uploaded M4A files, return success, because it has uploaded successfully.... and the "File Conversion Timer" will pick it up and convert it to a mp3 file.
                                            var msg = 'The file has uploaded successfully. It will be converted and available as a .mp3 file shortly.';
                                            displayAlertDialog(msg);

                                            console.log('Calling bwAttachments_MusicPlaylist.js.populateAttachments(). xcx13124-6');
                                            alert('xcx213234-14 calling populateAttachments().');
                                            thiz.populateAttachments(workflowAppId, bwBudgetRequestId, displayAttachmentsTagName, true); // This lists the attachments in the <p> tag with id='attachments'.

                                        } else {

                                            var msg = data.status + ' in bwAttachments_MusicPlaylist.js.performUpload() xcx02856-1: ' + data.message;
                                            console.log(msg);
                                            displayAlertDialog(msg);

                                        }

                                    } else if (data.status == 'EXCEPTION') {

                                        var msg = data.status + ' in bwAttachments_MusicPlaylist.js.performUpload() xcx02856-2: ' + data.message;
                                        console.log(msg);
                                        displayAlertDialog(msg);

                                    } else {

                                        //$('.bwAttachments_MusicPlaylist').bwAttachments_MusicPlaylist('renderAndPopulateAttachments'); // displayAttachmentsTagName
                                        alert('xcx2131234-1 Unexpected response. data: ' + JSON.stringify(data));

                                        displayAlertDialog(data.message);
                                    }









                                } catch (e) {
                                    console.log('Exception in performUpload():2: ' + e.message + ', ' + e.stack);
                                    displayAlertDialog('Exception in performUpload():2: ' + e.message + ', ' + e.stack);
                                    $(this.element).find('#newrequestattachments')[0].innerHTML = 'Exception in bwAttachments_MusicPlaylist.performUpload():2: ' + e.message + ', ' + e.stack;
                                }
                            },
                            error: function (data, errorCode, errorMessage) {
                                $('#divWorkingOnItDialog').dialog('close'); // Close the "Working on it..." dialog.
                                console.log('Error in performUpload(): ' + errorMessage);
                                debugger;
                                if (errorMessage == 'timeout') {
                                    displayAlertDialog('The file server could not be contacted. Please try again in a few minutes.');
                                } else {
                                    displayAlertDialog('Error in performUpload(): ' + errorMessage);
                                }
                            }
                        });
                    } catch (e) {

                        console.log('Exception in performUpload():2:xcx3243246 ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in performUpload():2:xcx3243246 ' + e.message + ', ' + e.stack);
                        $(this.element).find('#newrequestattachments')[0].innerHTML = 'Exception in bwAttachments_MusicPlaylist.performUpload():2: ' + e.message + ', ' + e.stack;

                    }
                };
                reader.readAsArrayBuffer(outFile); // This works for text. 





            } else {

                console.log('xcx333 formData is an object with a set function!!! <<<<<<<<<<<<<<<<< WOOP!');
                //alert('xcx333 formData is an object with a set function!!! <<<<<<<<<<<<<<<<< WOOP!');

                debugger; // 1
                // It is important to prepend these values, so that they get read immediately and not be undefined in the web service.
                formData.set('bwWorkflowAppId', workflowAppId);
                formData.set('bwBudgetRequestId', bwBudgetRequestId);
                formData.set('bwParticipantId', participantId);
                formData.set('bwParticipantEmail', participantEmail);
                formData.set('bwParticipantFriendlyName', participantFriendlyName);
                formData.set('bwActiveStateIdentifier', activeStateIdentifier);
                formData.set('Filename', filename);
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
                if ((largeFileUploadEnabled != true) && (size > largeFileSizeMinBytes)) {

                    displayAlertDialog('Large file uploads are not currently enabled for this organization. This file cannot be uploaded. The limit is ' + largeFileSizeMinBytes + ' bytes, and this file size is: ' + size + ' bytes.');

                } else {

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

                                    //alert('abort message: ' + evt.message);

                                }, false);

                                xhr.upload.addEventListener("error", function (evt) {
                                    try {

                                        var msg = 'Error in bwAttachments_MusicPlaylist.js.performUpload.xhr.upload.error():xcx1-1: workflowAppId: ' + workflowAppId + ', bwBudgetRequestId: ' + bwBudgetRequestId + ', evt: ' + JSON.stringify(evt);

                                        console.log('');
                                        console.log(msg);
                                        console.log('');

                                        displayAlertDialog(msg);
                                        alert(msg);

                                    } catch (e) {
                                        console.log('Exception in bwAttachments_MusicPlaylist.js.performUpload.xhr.upload.error():xcx1-2: ' + e.message + ', ' + e.stack);
                                        alert('Exception in bwAttachments_MusicPlaylist.js.performUpload.xhr.upload.error():xcx1-2: ' + e.message + ', ' + e.stack);
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


                                    displayAlertDialog('timeout');

                                }, false);

                                xhr.upload.addEventListener("loadend", function (evt) {
                                    console.log('');
                                    console.log('loadend workflowAppId: ' + workflowAppId + ', bwBudgetRequestId: ' + bwBudgetRequestId);
                                    console.log('');

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
                                console.log('POST success workflowAppId: ' + workflowAppId + ', bwBudgetRequestId: ' + bwBudgetRequestId);
                                console.log('');


                                //
                                // When we get here, the file has been 100% uploaded onto the file services server. 9-8-2022
                                //
                                HideActivitySpinner_FileUpload(); // 9-8-2022




                                // This resets the file input for uploading, so the onchange/change event fires as expected.
                                console.log('In bwAttachments_MusicPlaylist.js.xx(). This resets the file input for uploading, so the onchange/change event fires as expected. xcx86984.');
                                //alert('render bwAttachments_MusicPlaylist and maybe xxxxxx');
                                var x = $('#inputFile_' + bwBudgetRequestId)[0];
                                //var fileList = new FileList();
                                x.files = null; //fileList; // Clear the file upload input element.





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

                                    displayAlertDialog_QuickNotice('The file has uploaded successfully.');

                                    console.log('Calling bwAttachments_MusicPlaylist.js.populateAttachments(). xcx13124-3');
                                    //alert('xcx213234-13 calling populateAttachments().');
                                    thiz.populateAttachments(workflowAppId, bwBudgetRequestId, displayAttachmentsTagName, true); // This lists the attachments in the <p> tag with id='attachments'.

                                } else if (data.status == 'NO_REQUEST_SAVED') {

                                    console.log('xcx23235NO_REQUEST_SAVED  data.result: ' + data.result); // 9-8-2022

                                    // This means it must have been the first attachment uploaded for a new request. In this case, we will call back to the server and create the new request, so that it is not lost.
                                    console.log('xcx2143234215 This means it must have been the first attachment uploaded for a new request. <<< IS THIS TRUE???????????????????????');

                                    console.log('');
                                    console.log('xcx2143234215 This means it must have been the first attachment uploaded for a new request. In this case, we will call back to the server and create the new request, so that it is not lost. Calling bwRequest.js.saveAndPublishTheRequest().');
                                    console.log('');



                                    console.log('8-23-2022 FIXED THIS, remove this log entry once the bwAttachments_MusicPlaylist.js widget works 100%. xcx1236899 bwBudgetRequestId: ' + bwBudgetRequestId);
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

                                        displayAlertDialog('In bwAttachments_MusicPlaylist.js.performUpload(). Could not find budgetrequestform with bwBudgetRequestId: ' + bwBudgetRequestId);

                                    } else {

                                        //$('.bwRequest').bwRequest('saveAndPublishTheRequest', 'divPageContent1', true, bwBudgetRequestId, bwRequestTypeId); // This saves and publishes the New Request for the first time. 9-8-2022



                                        alert('This saves and publishes the New Request for the first time. 5-4-2022');




                                        // 1-6-2022
                                        $('.bwRequest').bwRequest('saveAndPublishTheRequest', 'divPageContent1', true, bwBudgetRequestId, bwRequestTypeId) // This saves and publishes the New Request for the first time. 9-8-2022
                                            .then(function (results) {

                                                if (results.status != 'SUCCESS') {

                                                    var msg = 'Error in bwAttachments_MusicPlaylist.js.performUpload(). xcx21345-1: ' + results.status + ', ' + results.message;
                                                    displayAlertDialog(msg);

                                                } else {

                                                    console.log('Calling bwAttachments_MusicPlaylist.js.populateAttachments(). xcx13124-4');
                                                    alert('xcx213234-12 calling populateAttachments().');
                                                    thiz.populateAttachments(workflowAppId, bwBudgetRequestId, displayAttachmentsTagName, true); // This lists the attachments in the <p> tag with id='attachments'.

                                                }

                                            }).catch(function (e) {

                                                console.log('Calling bwAttachments_MusicPlaylist.js.populateAttachments(). xcx13124-5');
                                                alert('xcx213234-11 calling populateAttachments().');
                                                thiz.populateAttachments(workflowAppId, bwBudgetRequestId, displayAttachmentsTagName, true); // This lists the attachments in the <p> tag with id='attachments'.
                                                console.log('Exception from Promise in bwAttachments_MusicPlaylist.js.performUpload(). xcx21345-2: ' + JSON.stringify(e));

                                            });

                                    }

                                } else if (data.status == 'ERROR') {

                                    if (data.message.indexOf('gmError: Error: Command failed: identify-im6.q16: no decode delegate for this image format `M4A') > -1) {

                                        // In this case, for uploaded M4A files, return success, because it has uploaded successfully.... and the "File Conversion Timer" will pick it up and convert it to a mp3 file.
                                        var msg = 'The file has uploaded successfully. It will be converted and available as a .mp3 file shortly.';
                                        displayAlertDialog(msg);

                                        console.log('Calling bwAttachments_MusicPlaylist.js.populateAttachments(). xcx13124-6');
                                        alert('xcx213234-10 calling populateAttachments().');
                                        thiz.populateAttachments(workflowAppId, bwBudgetRequestId, displayAttachmentsTagName, true); // This lists the attachments in the <p> tag with id='attachments'.

                                    } else {

                                        var msg = data.status + ' in bwAttachments_MusicPlaylist.js.performUpload() xcx02856-1: ' + data.message;
                                        console.log(msg);
                                        displayAlertDialog(msg);

                                    }

                                } else if (data.status == 'EXCEPTION') {

                                    var msg = data.status + ' in bwAttachments_MusicPlaylist.js.performUpload() xcx02856-2: ' + data.message;
                                    console.log(msg);
                                    displayAlertDialog(msg);

                                } else {

                                    //$('.bwAttachments_MusicPlaylist').bwAttachments_MusicPlaylist('renderAndPopulateAttachments'); // displayAttachmentsTagName
                                    alert('xcx2131234-2 Unexpected response. data: ' + JSON.stringify(data));

                                    displayAlertDialog(data.message);
                                }
                            } catch (e) {
                                console.log('Exception in bwAttachments_MusicPlaylist.js.performUpload():xcx33: ' + e.message + ', ' + e.stack);
                                alert('Exception in bwAttachments_MusicPlaylist.js.performUpload():xcx33: ' + e.message + ', ' + e.stack);
                                //$(this.element).find('#newrequestattachments')[0].innerHTML = 'Exception in bwAttachments_MusicPlaylist.performUpload():xcx33: ' + e.message + ', ' + e.stack;
                                //displayAlertDialog('Exception in bwAttachments_MusicPlaylist.js.performUpload():xcx33: ' + e.message + ', ' + e.stack);
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

                                displayAlertDialog('POST unexpected error. xcx1242525-2 workflowAppId: ' + workflowAppId + ', bwBudgetRequestId: ' + bwBudgetRequestId + ', Unexpected error: ' + JSON.stringify(e)); //e.responseText)

                            }

                        }
                    });
                }

            }

        } catch (e) {
            console.log('Exception in bwAttachments_MusicPlaylist.js.performUpload(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwAttachments_MusicPlaylist.js.performUpload(): ' + e.message + ', ' + e.stack);
            $(this.element).find('#newrequestattachments')[0].innerHTML = 'Exception in bwAttachments_MusicPlaylist.performUpload(): ' + e.message + ', ' + e.stack;
        }
    },


    //performUpload2: function (outFile, filename, displayAttachmentsTagName, bwBudgetRequestId, convertToAPdf) { // convertToAPdf means that we will attempt to put the attachment into a pdf and save it as a pdf file.
    performUpload2: function (outFile, fileName, bwBudgetRequestId, displayAttachmentsTagName, convertToAPdf) { // convertToAPdf means that we will attempt to put the attachment into a pdf and save it as a pdf file.
        //
        // data: Int8Array
        //
        try {
            console.log('In bwAttachments_MusicPlaylist.js.performUpload2(). fileName: ' + fileName);
            //alert('In bwAttachments_MusicPlaylist.js.performUpload2(). fileName: ' + fileName);
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
                                    console.log('In bwAttachments_MusicPlaylist.js.xx(). This resets the file input for uploading, so the onchange/change event fires as expected. xcx86984.');
                                    //alert('render bwAttachments_MusicPlaylist and maybe xxxxxx');
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

                                        console.log('Calling bwAttachments_MusicPlaylist.js.populateAttachments(). xcx13124-3');
                                        alert('xcx213234-17 calling populateAttachments().');
                                        thiz.populateAttachments(workflowAppId, bwBudgetRequestId, displayAttachmentsTagName, true); // This lists the attachments in the <p> tag with id='attachments'.

                                    } else if (data.status == 'NO_REQUEST_SAVED') {

                                        console.log('xcx23235NO_REQUEST_SAVED  data.result: ' + data.result); // 9-8-2022

                                        // This means it must have been the first attachment uploaded for a new request. In this case, we will call back to the server and create the new request, so that it is not lost.
                                        console.log('xcx2143234215 This means it must have been the first attachment uploaded for a new request. <<< IS THIS TRUE???????????????????????');

                                        console.log('');
                                        console.log('xcx2143234215 This means it must have been the first attachment uploaded for a new request. In this case, we will call back to the server and create the new request, so that it is not lost. Calling bwRequest.js.saveAndPublishTheRequest().');
                                        console.log('');



                                        console.log('8-23-2022 FIXED THIS, remove this log entry once the bwAttachments_MusicPlaylist.js widget works 100%. xcx1236899 bwBudgetRequestId: ' + bwBudgetRequestId);
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

                                            displayAlertDialog('In bwAttachments_MusicPlaylist.js.performUpload2(). Could not find budgetrequestform with bwBudgetRequestId: ' + bwBudgetRequestId);

                                        } else {

                                            //$('.bwRequest').bwRequest('saveAndPublishTheRequest', 'divPageContent1', true, bwBudgetRequestId, bwRequestTypeId); // This saves and publishes the New Request for the first time. 9-8-2022

                                            // 1-6-2022
                                            $('.bwRequest').bwRequest('saveAndPublishTheRequest', 'divPageContent1', true, bwBudgetRequestId, bwRequestTypeId) // This saves and publishes the New Request for the first time. 9-8-2022
                                                .then(function (results) {

                                                    if (results.status != 'SUCCESS') {

                                                        var msg = 'Error in bwAttachments_MusicPlaylist.js.performUpload2(). xcx21345-1: ' + results.status + ', ' + results.message;
                                                        displayAlertDialog(msg);

                                                    } else {

                                                        console.log('Calling bwAttachments_MusicPlaylist.js.populateAttachments(). xcx13124-4');
                                                        alert('xcx213234-16 calling populateAttachments().');
                                                        thiz.populateAttachments(workflowAppId, bwBudgetRequestId, displayAttachmentsTagName, true); // This lists the attachments in the <p> tag with id='attachments'.

                                                    }

                                                }).catch(function (e) {

                                                    console.log('Calling bwAttachments_MusicPlaylist.js.populateAttachments(). xcx13124-5');
                                                    alert('xcx213234-15 calling populateAttachments().');
                                                    thiz.populateAttachments(workflowAppId, bwBudgetRequestId, displayAttachmentsTagName, true); // This lists the attachments in the <p> tag with id='attachments'.
                                                    console.log('Exception from Promise in bwAttachments_MusicPlaylist.js.performUpload2(). xcx21345-2: ' + JSON.stringify(e));

                                                });

                                        }

                                    } else if (data.status == 'ERROR') {

                                        if (data.message.indexOf('gmError: Error: Command failed: identify-im6.q16: no decode delegate for this image format `M4A') > -1) {

                                            // In this case, for uploaded M4A files, return success, because it has uploaded successfully.... and the "File Conversion Timer" will pick it up and convert it to a mp3 file.
                                            var msg = 'The file has uploaded successfully. It will be converted and available as a .mp3 file shortly.';
                                            displayAlertDialog(msg);

                                            console.log('Calling bwAttachments_MusicPlaylist.js.populateAttachments(). xcx13124-6');
                                            alert('xcx213234-14 calling populateAttachments().');
                                            thiz.populateAttachments(workflowAppId, bwBudgetRequestId, displayAttachmentsTagName, true); // This lists the attachments in the <p> tag with id='attachments'.

                                        } else {

                                            var msg = data.status + ' in bwAttachments_MusicPlaylist.js.performUpload2() xcx02856-1: ' + data.message;
                                            console.log(msg);
                                            displayAlertDialog(msg);

                                        }

                                    } else if (data.status == 'EXCEPTION') {

                                        var msg = data.status + ' in bwAttachments_MusicPlaylist.js.performUpload2() xcx02856-2-1: ' + data.message;
                                        console.log(msg);
                                        displayAlertDialog(msg);

                                    } else {

                                        //$('.bwAttachments_MusicPlaylist').bwAttachments_MusicPlaylist('renderAndPopulateAttachments'); // displayAttachmentsTagName
                                        alert('xcx2131234-3 Unexpected response. data: ' + JSON.stringify(data));

                                        displayAlertDialog(data.message);
                                    }

                                } catch (e) {
                                    console.log('Exception in performUpload2():2: ' + e.message + ', ' + e.stack);
                                    displayAlertDialog('Exception in performUpload2():2: ' + e.message + ', ' + e.stack);
                                    $(this.element).find('#newrequestattachments')[0].innerHTML = 'Exception in bwAttachments_MusicPlaylist.performUpload2:2: ' + e.message + ', ' + e.stack;
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
                        $(this.element).find('#newrequestattachments')[0].innerHTML = 'Exception in bwAttachments_MusicPlaylist.performUpload2:2: ' + e.message + ', ' + e.stack;

                    }
                };
                reader.readAsArrayBuffer(outFile); // This works for text. 





            } else {

                console.log('In bwAttachments_MusicPlaylist.js.performUpload2(). formData is an object with a set function.');

                debugger; // 2
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

                                        var msg = 'Error in bwAttachments_MusicPlaylist.js.performUpload.xhr.upload.error():xcx1-2-1: workflowAppId: ' + workflowAppId + ', bwBudgetRequestId: ' + bwBudgetRequestId + ', evt: ' + JSON.stringify(evt);

                                        console.log('');
                                        console.log(msg);
                                        console.log('');

                                        displayAlertDialog_Persistent(msg);
                                        //alert(msg);

                                    } catch (e) {
                                        console.log('Exception in bwAttachments_MusicPlaylist.js.performUpload.xhr.upload.error():xcx1-2: ' + e.message + ', ' + e.stack);
                                        alert('Exception in bwAttachments_MusicPlaylist.js.performUpload.xhr.upload.error():xcx1-2: ' + e.message + ', ' + e.stack);
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
                                console.log('In bwAttachments_MusicPlaylist.js.performUpload2(). POST success workflowAppId: ' + workflowAppId + ', bwBudgetRequestId: ' + bwBudgetRequestId + ', operationUri: ' + operationUri);
                                console.log('');


                                //
                                // When we get here, the file has been 100% uploaded onto the file services server. 9-8-2022
                                //
                                HideActivitySpinner_FileUpload(); // 9-8-2022




                                // This resets the file input for uploading, so the onchange/change event fires as expected.
                                console.log('In bwAttachments_MusicPlaylist.js.xx(). This resets the file input for uploading, so the onchange/change event fires as expected. xcx86984.');
                                //alert('render bwAttachments_MusicPlaylist and maybe xxxxxx');



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

                                    console.log('Calling bwAttachments_MusicPlaylist.js.populateAttachments(). xcx13124-3');
                                    //alert('xcx213234-13 calling populateAttachments().');
                                    thiz.populateAttachments(workflowAppId, bwBudgetRequestId, displayAttachmentsTagName, true); // This lists the attachments in the <p> tag with id='attachments'.

                                } else if (data.status == 'NO_REQUEST_SAVED') {

                                    console.log('xcx23235NO_REQUEST_SAVED  data.result: ' + data.result); // 9-8-2022

                                    // This means it must have been the first attachment uploaded for a new request. In this case, we will call back to the server and create the new request, so that it is not lost.
                                    console.log('xcx2143234215 This means it must have been the first attachment uploaded for a new request. <<< IS THIS TRUE???????????????????????');

                                    console.log('');
                                    console.log('xcx2143234215 This means it must have been the first attachment uploaded for a new request. In this case, we will call back to the server and create the new request, so that it is not lost. Calling bwRequest.js.saveAndPublishTheRequest().');
                                    console.log('');



                                    console.log('8-23-2022 FIXED THIS, remove this log entry once the bwAttachments_MusicPlaylist.js widget works 100%. xcx1236899 bwBudgetRequestId: ' + bwBudgetRequestId);
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

                                        displayAlertDialog('In bwAttachments_MusicPlaylist.js.performUpload2(). Could not find budgetrequestform with bwBudgetRequestId: ' + bwBudgetRequestId);

                                    } else {

                                        //$('.bwRequest').bwRequest('saveAndPublishTheRequest', 'divPageContent1', true, bwBudgetRequestId, bwRequestTypeId); // This saves and publishes the New Request for the first time. 9-8-2022



                                        alert('This saves and publishes the New Request for the first time. 5-4-2022');




                                        // 1-6-2022
                                        $('.bwRequest').bwRequest('saveAndPublishTheRequest', 'divPageContent1', true, bwBudgetRequestId, bwRequestTypeId) // This saves and publishes the New Request for the first time. 9-8-2022
                                            .then(function (results) {

                                                if (results.status != 'SUCCESS') {

                                                    var msg = 'Error in bwAttachments_MusicPlaylist.js.performUpload2(). xcx21345-1: ' + results.status + ', ' + results.message;
                                                    displayAlertDialog(msg);

                                                } else {

                                                    console.log('Calling bwAttachments_MusicPlaylist.js.populateAttachments(). xcx13124-4');
                                                    //alert('xcx213234-12 calling populateAttachments().');
                                                    thiz.populateAttachments(workflowAppId, bwBudgetRequestId, displayAttachmentsTagName, true); // This lists the attachments in the <p> tag with id='attachments'.

                                                }

                                            }).catch(function (e) {

                                                console.log('Calling bwAttachments_MusicPlaylist.js.populateAttachments(). xcx13124-5');
                                                alert('xcx213234-11 calling populateAttachments().');
                                                thiz.populateAttachments(workflowAppId, bwBudgetRequestId, displayAttachmentsTagName, true); // This lists the attachments in the <p> tag with id='attachments'.
                                                console.log('Exception from Promise in bwAttachments_MusicPlaylist.js.performUpload2(). xcx21345-2: ' + JSON.stringify(e));

                                            });

                                    }

                                } else if (data.status == 'ERROR') {

                                    if (data.message.indexOf('gmError: Error: Command failed: identify-im6.q16: no decode delegate for this image format `M4A') > -1) {

                                        // In this case, for uploaded M4A files, return success, because it has uploaded successfully.... and the "File Conversion Timer" will pick it up and convert it to a mp3 file.
                                        var msg = 'The file has uploaded successfully. It will be converted and available as a .mp3 file shortly.';
                                        displayAlertDialog(msg);

                                        console.log('Calling bwAttachments_MusicPlaylist.js.populateAttachments(). xcx13124-6');
                                        alert('xcx213234-10 calling populateAttachments().');
                                        thiz.populateAttachments(workflowAppId, bwBudgetRequestId, displayAttachmentsTagName, true); // This lists the attachments in the <p> tag with id='attachments'.

                                    } else {

                                        var msg = data.status + ' in bwAttachments_MusicPlaylist.js.performUpload2() xcx02856-1: ' + data.message;
                                        console.log(msg);
                                        displayAlertDialog(msg);

                                    }

                                } else if (data.status == 'EXCEPTION') {

                                    var msg = data.status + ' in bwAttachments_MusicPlaylist.js.performUpload2() xcx02856-2-2: ' + data.message;
                                    console.log(msg);
                                    displayAlertDialog(msg);

                                } else {

                                    //$('.bwAttachments_MusicPlaylist').bwAttachments_MusicPlaylist('renderAndPopulateAttachments'); // displayAttachmentsTagName
                                    alert('xcx2131234-4-11 Unexpected response. data: ' + JSON.stringify(data));

                                    displayAlertDialog(data.message);
                                }
                            } catch (e) {
                                console.log('Exception in bwAttachments_MusicPlaylist.js.performUpload2():xcx33: ' + e.message + ', ' + e.stack);
                                alert('Exception in bwAttachments_MusicPlaylist.js.performUpload2():xcx33: ' + e.message + ', ' + e.stack);
                                //$(this.element).find('#newrequestattachments')[0].innerHTML = 'Exception in bwAttachments_MusicPlaylist.performUpload2:xcx33: ' + e.message + ', ' + e.stack;
                                //displayAlertDialog('Exception in bwAttachments_MusicPlaylist.js.performUpload2():xcx33: ' + e.message + ', ' + e.stack);
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

                                displayAlertDialog('POST unexpected error. xcx1242525-2 workflowAppId: ' + workflowAppId + ', bwBudgetRequestId: ' + bwBudgetRequestId + ', Unexpected error: ' + JSON.stringify(e)); //e.responseText)

                            }

                        }
                    });
                }

            }

        } catch (e) {
            console.log('Exception in bwAttachments_MusicPlaylist.js.performUpload2(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwAttachments_MusicPlaylist.js.performUpload2(): ' + e.message + ', ' + e.stack);
            $(this.element).find('#newrequestattachments')[0].innerHTML = 'Exception in bwAttachments_MusicPlaylist.performUpload2: ' + e.message + ', ' + e.stack;
        }
    },

    performUpload3: function (outFile, fileName, bwBudgetRequestId, displayAttachmentsTagName, convertToAPdf, forEmail) { // convertToAPdf means that we will attempt to put the attachment into a pdf and save it as a pdf file.
        var thiz = this;
        return new Promise(function (resolve, reject) {
            //
            // data: Int8Array
            //
            try {
                console.log('In bwAttachments_MusicPlaylist.js.performUpload3(). fileName: ' + fileName);
                //alert('In bwAttachments_MusicPlaylist.js.performUpload2(). fileName: ' + fileName);


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

                //if (!(formData && formData.set)) { // forEmail // 5-17-2024. <<<<
                if (forEmail) {

                    alert('xcx11222233-2 There is no formData!!!!! This is a fatal error.');

                    // This is for the iPad 2. 4-21-2023.
                    ShowActivitySpinner_FileUpload('Uploading the file "' + fileName + '"...');

                    //var x = document.getElementById('inputFile_' + bwBudgetRequestId); // This element is on the request form with the "Choose File" button, not the attachments dialog.
                    //var file = x.files[0]; // Disabled this, we are now using the file passed to this function.








                    // // xcx121312 completedSentence: young system present student lot experiment strong crease sun company hurry remember milk us repeat clothe against meant history indicate pitch print bread 
                    //var element = document.getElementById('inputFile_' + bwBudgetRequestId);

                    ////var element = document.getElementById('input_type_file_element');
                    //var file = element.files[0];

                    //var reader = new FileReader();
                    //reader.onload = function (event) {
                    //    var fileData = '';
                    //    var buffer = event.target.result;
                    //    var byteArray = new Uint8Array(buffer);
                    //    for (var i = 0; i < byteArray.byteLength; i++) {
                    //        fileData += String.fromCharCode(byteArray[i])
                    //    }

                    //    var textByLine = fileData.split("\n")
                    //    var orderedLinesArray = [];
                    //    for (var i = 0; i < (textByLine.length - 1); i++) {
                    //        orderedLinesArray.push({
                    //            Number: Number(textByLine[i].split(' ')[0]), // Make sure this is a number so that it sorts Ok.
                    //            Text: textByLine[i].split(' ')[1].replaceAll('\r', '') + ' '
                    //        });
                    //    }

                    //    orderedLinesArray.sort(function (a, b) {
                    //        if (a.Number < b.Number) { return -1; }
                    //        if (a.Number > b.Number) { return 1; }
                    //        return 0;
                    //    });

                    //    var completedSentence = '';
                    //    var pyramidSum = 0;

                    //    for (var i = 1; i < orderedLinesArray.length; i++) {

                    //        pyramidSum += i;

                    //        if (pyramidSum > (orderedLinesArray.length - 1)) {
                    //            break;
                    //        }

                    //        completedSentence += orderedLinesArray[pyramidSum - 1].Text;

                    //    }

                    //    alert('completedSentence: ' + completedSentence);

                    //}

                    //reader.readAsArrayBuffer(file);






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
                                        console.log('In bwAttachments_MusicPlaylist.js.xx(). This resets the file input for uploading, so the onchange/change event fires as expected. xcx86984.');
                                        //alert('render bwAttachments_MusicPlaylist and maybe xxxxxx');
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

                                            console.log('Calling bwAttachments_MusicPlaylist.js.populateAttachments(). xcx13124-3');
                                            alert('xcx213234-17 calling populateAttachments().');
                                            thiz.populateAttachments(workflowAppId, bwBudgetRequestId, displayAttachmentsTagName, true); // This lists the attachments in the <p> tag with id='attachments'.

                                        } else if (data.status == 'NO_REQUEST_SAVED') {

                                            console.log('xcx23235NO_REQUEST_SAVED  data.result: ' + data.result); // 9-8-2022

                                            // This means it must have been the first attachment uploaded for a new request. In this case, we will call back to the server and create the new request, so that it is not lost.
                                            console.log('xcx2143234215 This means it must have been the first attachment uploaded for a new request. <<< IS THIS TRUE???????????????????????');

                                            console.log('');
                                            console.log('xcx2143234215 This means it must have been the first attachment uploaded for a new request. In this case, we will call back to the server and create the new request, so that it is not lost. Calling bwRequest.js.saveAndPublishTheRequest().');
                                            console.log('');



                                            console.log('8-23-2022 FIXED THIS, remove this log entry once the bwAttachments_MusicPlaylist.js widget works 100%. xcx1236899 bwBudgetRequestId: ' + bwBudgetRequestId);
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

                                                displayAlertDialog('In bwAttachments_MusicPlaylist.js.performUpload2(). Could not find budgetrequestform with bwBudgetRequestId: ' + bwBudgetRequestId);

                                            } else {

                                                //$('.bwRequest').bwRequest('saveAndPublishTheRequest', 'divPageContent1', true, bwBudgetRequestId, bwRequestTypeId); // This saves and publishes the New Request for the first time. 9-8-2022

                                                // 1-6-2022
                                                $('.bwRequest').bwRequest('saveAndPublishTheRequest', 'divPageContent1', true, bwBudgetRequestId, bwRequestTypeId) // This saves and publishes the New Request for the first time. 9-8-2022
                                                    .then(function (results) {

                                                        if (results.status != 'SUCCESS') {

                                                            var msg = 'Error in bwAttachments_MusicPlaylist.js.performUpload2(). xcx21345-1: ' + results.status + ', ' + results.message;
                                                            displayAlertDialog(msg);

                                                        } else {

                                                            console.log('Calling bwAttachments_MusicPlaylist.js.populateAttachments(). xcx13124-4');
                                                            alert('xcx213234-16 calling populateAttachments().');
                                                            thiz.populateAttachments(workflowAppId, bwBudgetRequestId, displayAttachmentsTagName, true); // This lists the attachments in the <p> tag with id='attachments'.

                                                        }

                                                    }).catch(function (e) {

                                                        console.log('Calling bwAttachments_MusicPlaylist.js.populateAttachments(). xcx13124-5');
                                                        alert('xcx213234-15 calling populateAttachments().');
                                                        thiz.populateAttachments(workflowAppId, bwBudgetRequestId, displayAttachmentsTagName, true); // This lists the attachments in the <p> tag with id='attachments'.
                                                        console.log('Exception from Promise in bwAttachments_MusicPlaylist.js.performUpload2(). xcx21345-2: ' + JSON.stringify(e));

                                                    });

                                            }

                                        } else if (data.status == 'ERROR') {

                                            if (data.message.indexOf('gmError: Error: Command failed: identify-im6.q16: no decode delegate for this image format `M4A') > -1) {

                                                // In this case, for uploaded M4A files, return success, because it has uploaded successfully.... and the "File Conversion Timer" will pick it up and convert it to a mp3 file.
                                                var msg = 'The file has uploaded successfully. It will be converted and available as a .mp3 file shortly.';
                                                displayAlertDialog(msg);

                                                console.log('Calling bwAttachments_MusicPlaylist.js.populateAttachments(). xcx13124-6');
                                                alert('xcx213234-14 calling populateAttachments().');
                                                thiz.populateAttachments(workflowAppId, bwBudgetRequestId, displayAttachmentsTagName, true); // This lists the attachments in the <p> tag with id='attachments'.

                                            } else {

                                                var msg = data.status + ' in bwAttachments_MusicPlaylist.js.performUpload2() xcx02856-1: ' + data.message;
                                                console.log(msg);
                                                displayAlertDialog(msg);

                                            }

                                        } else if (data.status == 'EXCEPTION') {

                                            var msg = data.status + ' in bwAttachments_MusicPlaylist.js.performUpload2() xcx02856-2-3: ' + data.message;
                                            console.log(msg);
                                            displayAlertDialog(msg);

                                        } else {

                                            //$('.bwAttachments_MusicPlaylist').bwAttachments_MusicPlaylist('renderAndPopulateAttachments'); // displayAttachmentsTagName
                                            alert('xcx2131234-3 Unexpected response. data: ' + JSON.stringify(data));

                                            displayAlertDialog(data.message);
                                        }

                                    } catch (e) {
                                        console.log('Exception in performUpload2():2: ' + e.message + ', ' + e.stack);
                                        displayAlertDialog('Exception in performUpload2():2: ' + e.message + ', ' + e.stack);
                                        $(thiz.element).find('#newrequestattachments')[0].innerHTML = 'Exception in bwAttachments_MusicPlaylist.performUpload2:2: ' + e.message + ', ' + e.stack;
                                    }
                                },
                                error: function (data, errorCode, errorMessage) {

                                    HideActivitySpinner_FileUpload(); // 9-8-2022

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
                            $(thiz.element).find('#newrequestattachments')[0].innerHTML = 'Exception in bwAttachments_MusicPlaylist.performUpload2:2: ' + e.message + ', ' + e.stack;

                        }
                    };
                    reader.readAsArrayBuffer(outFile); // This works for text. 





                } else {

                    console.log('xcx333 formData is an object with a set function!!! <<<<<<<<<<<<<<<<< WOOP!');
                    //alert('xcx333 formData is an object with a set function!!! <<<<<<<<<<<<<<<<< WOOP!');
                    //debugger;
                    debugger; // 3
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

                    //alert('xcx112223333 ')

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

                        displayAlertDialog('Large file uploads are not currently enabled for this organization. This file cannot be uploaded. The limit is ' + largeFileSizeMinBytes + ' bytes, and this file size is: ' + outFile.size + ' bytes.');

                    } else {

                        HideActivitySpinner();

                        ShowActivitySpinner_FileUpload('Uploading the file "' + fileName + '"...');

                        //
                        //
                        // WE HAVE TO CREATE THE input-file element "xx" here so that it can be uploaded. The server looks for this element. We have to dynamically add it because it may have been created with FFMPEG WASM. 8-2-2023.
                        //
                        //



                        debugger;
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

                                            HideActivitySpinner();

                                            ShowActivitySpinner_FileUpload('Uploading the file "' + fileName + '"...');

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

                                        displayAlertDialog('Error: xcx2314234-2 abort message: ' + evt.message);

                                    }, false);

                                    xhr.upload.addEventListener("error", function (evt) {
                                        try {

                                            // See the MDN docs for the error event: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequestUpload/error_event
                                            var msg = 'Error in bwAttachments_MusicPlaylist.js.performUpload.xhr.upload.error():xcx1-2-2: workflowAppId: ' + workflowAppId + ', bwBudgetRequestId: ' + bwBudgetRequestId + ', evt: ' + JSON.stringify(evt) + ', evt.type: ' + evt.type + ', lengthComputable: ' + evt.lengthComputable + ', loaded: ' + evt.loaded + ', total: ' + evt.total;

                                            console.log('');
                                            console.log(msg);
                                            console.log('');

                                            displayAlertDialog_Persistent(msg);
                                            //alert(msg);

                                        } catch (e) {
                                            console.log('Exception in bwAttachments_MusicPlaylist.js.performUpload.xhr.upload.error():xcx1-2: ' + e.message + ', ' + e.stack);
                                            alert('Exception in bwAttachments_MusicPlaylist.js.performUpload.xhr.upload.error():xcx1-2: ' + e.message + ', ' + e.stack);
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
                                    console.log('POST success workflowAppId: ' + workflowAppId + ', bwBudgetRequestId: ' + bwBudgetRequestId);
                                    console.log('');


                                    //
                                    // When we get here, the file has been 100% uploaded onto the file services server. 9-8-2022
                                    //
                                    HideActivitySpinner_FileUpload(); // 9-8-2022




                                    // This resets the file input for uploading, so the onchange/change event fires as expected.
                                    console.log('In bwAttachments_MusicPlaylist.js.xx(). This resets the file input for uploading, so the onchange/change event fires as expected. xcx86984.');
                                    //alert('render bwAttachments_MusicPlaylist and maybe xxxxxx');



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

                                        console.log('Calling bwAttachments_MusicPlaylist.js.populateAttachments(). xcx13124-3');
                                        //alert('xcx213234-13 calling populateAttachments().');
                                        thiz.populateAttachments(workflowAppId, bwBudgetRequestId, displayAttachmentsTagName, true); // This lists the attachments in the <p> tag with id='attachments'.

                                        var msg = 'The file has uploaded successfully.';

                                        var result = {
                                            status: 'SUCCESS',
                                            message: msg
                                        }
                                        resolve(result);

                                    } else if (data.status == 'NO_REQUEST_SAVED') {

                                        console.log('xcx23235NO_REQUEST_SAVED  data.result: ' + data.result); // 9-8-2022

                                        // This means it must have been the first attachment uploaded for a new request. In this case, we will call back to the server and create the new request, so that it is not lost.
                                        console.log('xcx2143234215 This means it must have been the first attachment uploaded for a new request. <<< IS THIS TRUE???????????????????????');

                                        console.log('');
                                        console.log('xcx2143234215 This means it must have been the first attachment uploaded for a new request. In this case, we will call back to the server and create the new request, so that it is not lost. Calling bwRequest.js.saveAndPublishTheRequest().');
                                        console.log('');



                                        console.log('8-23-2022 FIXED THIS, remove this log entry once the bwAttachments_MusicPlaylist.js widget works 100%. xcx1236899 bwBudgetRequestId: ' + bwBudgetRequestId);
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

                                            displayAlertDialog('In bwAttachments_MusicPlaylist.js.performUpload2(). Could not find budgetrequestform with bwBudgetRequestId: ' + bwBudgetRequestId);

                                        } else {

                                            //$('.bwRequest').bwRequest('saveAndPublishTheRequest', 'divPageContent1', true, bwBudgetRequestId, bwRequestTypeId); // This saves and publishes the New Request for the first time. 9-8-2022



                                            alert('This saves and publishes the New Request for the first time. 5-4-2022');




                                            // 1-6-2022
                                            $('.bwRequest').bwRequest('saveAndPublishTheRequest', 'divPageContent1', true, bwBudgetRequestId, bwRequestTypeId) // This saves and publishes the New Request for the first time. 9-8-2022
                                                .then(function (results) {

                                                    if (results.status != 'SUCCESS') {

                                                        var msg = 'Error in bwAttachments_MusicPlaylist.js.performUpload2(). xcx21345-1: ' + results.status + ', ' + results.message;
                                                        displayAlertDialog(msg);

                                                    } else {

                                                        console.log('Calling bwAttachments_MusicPlaylist.js.populateAttachments(). xcx13124-4');
                                                        //alert('xcx213234-12 calling populateAttachments().');
                                                        thiz.populateAttachments(workflowAppId, bwBudgetRequestId, displayAttachmentsTagName, true); // This lists the attachments in the <p> tag with id='attachments'.

                                                    }

                                                }).catch(function (e) {

                                                    console.log('Calling bwAttachments_MusicPlaylist.js.populateAttachments(). xcx13124-5');
                                                    alert('xcx213234-11 calling populateAttachments().');
                                                    thiz.populateAttachments(workflowAppId, bwBudgetRequestId, displayAttachmentsTagName, true); // This lists the attachments in the <p> tag with id='attachments'.
                                                    console.log('Exception from Promise in bwAttachments_MusicPlaylist.js.performUpload2(). xcx21345-2: ' + JSON.stringify(e));

                                                });

                                        }

                                    } else if (data.status == 'ERROR') {

                                        if (data.message.indexOf('gmError: Error: Command failed: identify-im6.q16: no decode delegate for this image format `M4A') > -1) {

                                            // In this case, for uploaded M4A files, return success, because it has uploaded successfully.... and the "File Conversion Timer" will pick it up and convert it to a mp3 file.
                                            var msg = 'The file has uploaded successfully. It will be converted and available as a .mp3 file shortly.';
                                            displayAlertDialog(msg);

                                            console.log('Calling bwAttachments_MusicPlaylist.js.populateAttachments(). xcx13124-6');
                                            alert('xcx213234-10 calling populateAttachments().');
                                            thiz.populateAttachments(workflowAppId, bwBudgetRequestId, displayAttachmentsTagName, true); // This lists the attachments in the <p> tag with id='attachments'.

                                        } else {

                                            var msg = data.status + ' in bwAttachments_MusicPlaylist.js.performUpload2() xcx02856-1: ' + data.message;
                                            console.log(msg);
                                            displayAlertDialog(msg);

                                        }

                                    } else if (data.status == 'EXCEPTION') {

                                        var msg = data.status + ' in bwAttachments_MusicPlaylist.js.performUpload2() xcx02856-2-4: ' + data.message;
                                        console.log(msg);
                                        displayAlertDialog(msg);

                                    } else {

                                        //$('.bwAttachments_MusicPlaylist').bwAttachments_MusicPlaylist('renderAndPopulateAttachments'); // displayAttachmentsTagName
                                        alert('xcx2131234-4-22 Unexpected response. data: ' + JSON.stringify(data));

                                        displayAlertDialog(data.message);
                                    }
                                } catch (e) {
                                    console.log('Exception in bwAttachments_MusicPlaylist.js.performUpload2():xcx33: ' + e.message + ', ' + e.stack);
                                    alert('Exception in bwAttachments_MusicPlaylist.js.performUpload2():xcx33: ' + e.message + ', ' + e.stack);
                                    //$(thiz.element).find('#newrequestattachments')[0].innerHTML = 'Exception in bwAttachments_MusicPlaylist.performUpload2:xcx33: ' + e.message + ', ' + e.stack;
                                    //displayAlertDialog('Exception in bwAttachments_MusicPlaylist.js.performUpload2():xcx33: ' + e.message + ', ' + e.stack);
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

                                    displayAlertDialog('POST unexpected error. xcx1242525-2 workflowAppId: ' + workflowAppId + ', bwBudgetRequestId: ' + bwBudgetRequestId + ', Unexpected error: ' + JSON.stringify(e)); //e.responseText)

                                }

                            }
                        });
                    }

                }

            } catch (e) {
                console.log('Exception in bwAttachments_MusicPlaylist.js.performUpload2(): ' + e.message + ', ' + e.stack);
                displayAlertDialog('Exception in bwAttachments_MusicPlaylist.js.performUpload2(): ' + e.message + ', ' + e.stack);
                $(thiz.element).find('#newrequestattachments')[0].innerHTML = 'Exception in bwAttachments_MusicPlaylist.performUpload2: ' + e.message + ', ' + e.stack;
            }
        });
    },

    GetStatusUpdateForMediaFileConversion: function (json, bwWorkflowAppId, bwBudgetRequestId) {
        try {
            console.log('In bwAttachments_MusicPlaylist.js.GetStatusUpdateForMediaFileConversion().');
            var thiz = this;
            var filename = JSON.parse(decodeURI(json)).Display_Filename;

            //alert('filename: ' + filename);
            //displayAlertDialog_Persistent('In bwAttachments_MusicPlaylist.js.GetStatusUpdateForMediaFileConversion(). bwWorkflowAppId: ' + bwWorkflowAppId + ', bwBudgetRequestId: ' + bwBudgetRequestId + ', json: ' + decodeURI(json));

            //
            //
            // The user has requested that we reach out using SCP to get the latest file conversion status.
            //
            //

            ShowActivitySpinner('Communicating with the media conversion server...');

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');
            var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');

            var data = {
                bwParticipantId_LoggedIn: participantId,
                bwActiveStateIdentifier: activeStateIdentifier,
                bwWorkflowAppId_LoggedIn: workflowAppId,

                bwWorkflowAppId: bwWorkflowAppId,
                bwBudgetRequestId: bwBudgetRequestId,

                Filename: filename,

                bwParticipantId: participantId,
                bwParticipantFriendlyName: participantFriendlyName,
                bwParticipantEmail: participantEmail
            };

            var fileserviceurl = globalUrlPrefix + globalUrlForWebServices + '/_files';
            var operationUri = fileserviceurl + "/GetStatusUpdateForMediaFileConversion";
            $.ajax({
                url: operationUri,
                type: "POST",
                data: data,
                timeout: 60000, // 60000 = 1 minute.
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (results) {
                    try {

                        HideActivitySpinner();

                        if (results.status != 'SUCCESS') {

                            displayAlertDialog('Error in bwAttachments_MusicPlaylist.js.GetStatusUpdateForMediaFileConversion.success(): ' + results.status + ', ' + results.message);

                        } else {

                            //displayAlertDialog_Persistent(JSON.stringify(results));

                            thiz.populateAttachments(workflowAppId, bwBudgetRequestId, 'newrequestattachments');

                            //displayAlertDialog('The file(s) have been successfully added to the conversion queue. This may take a while. Status updates will be visible on the budget request.');

                        }

                    } catch (e) {

                        HideActivitySpinner();

                        console.log('Exception in bwAttachments_MusicPlaylist.js.GetStatusUpdateForMediaFileConversion.success(): ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwAttachments_MusicPlaylist.js.GetStatusUpdateForMediaFileConversion.success(): ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {

                    HideActivitySpinner();

                    console.log('Error in bwAttachments_MusicPlaylist.js.GetStatusUpdateForMediaFileConversion.error(): ' + errorMessage);
                    displayAlertDialog('Error in bwAttachments_MusicPlaylist.js.GetStatusUpdateForMediaFileConversion.error(): ' + errorMessage);
                }
            });

        } catch (e) {
            var msg = 'Exception in bwAttachments_MusicPlaylist.js.GetStatusUpdateForMediaFileConversion(): ' + e.message + ', ' + e.stack;
            console.log(msg);
            displayAlertDialog(msg);
        }
    },


    populateAttachments: function (bwWorkflowAppId, bwBudgetRequestId, attachmentsTagId, showRemoveAttachmentButton, requestDialogId) {
        try {
            console.log('In bwAttachments_MusicPlaylist.js.populateAttachments(). bwBudgetRequestId: ' + bwBudgetRequestId);
            //alert('In bwAttachments_MusicPlaylist.js.populateAttachments(). It would be nice to know where this was called from. bwBudgetRequestId: ' + bwBudgetRequestId);
            var thiz = this;

            if (!bwBudgetRequestId) {

                var msg = 'Error in bwAttachments_MusicPlaylist.js.populateAttachments. Unexpected value for bwBudgetRequestId: ' + bwBudgetRequestId;
                console.log(msg);
                displayAlertDialog(msg);

            } else {

                if (bwBudgetRequestId == 'standalone') {


                    alert('xcx21313123 standalone');


                } else {

                    //
                    // This resets the value of the input file element so that if the same file is selected a second time, it behaves as expected. 11-29-2023.
                    // This should only happen in populateAttachments() and in CloseDialog_btnCancelUploadTheFileNow().
                    //
                    console.log('This resets the value of the input file element so that if the same file is selected a second time, it behaves as expected. This should only happen in populateAttachments() and in CloseDialog_btnCancelUploadTheFileNow().');
                    var inputFileAttachmentsElement = $('#inputFile_' + bwBudgetRequestId)[0];
                    if (!inputFileAttachmentsElement) {
                        console.log('Error in bwAttachments_MusicPlaylist.js.populateAttachments(). This error is most likely because this was rendered with renderAndPopulateAttachments_ReadOnly(). It is readonly. DEV: This needs some work. Proceed from here.')
                        //displayAlertDialog('Error in bwAttachments_MusicPlaylist.js.populateAttachments(). This error is most likely because this was rendered with renderAndPopulateAttachments_ReadOnly(). It is readonly. DEV: This needs some work. Proceed from here.')
                    } else {
                        inputFileAttachmentsElement.value = '';
                    }
                    //
                    //

                    var forms = $('.budgetrequestform');
                    var form;
                    for (var i = 0; i < forms.length; i++) {
                        if (forms[i].getAttribute('bwbudgetrequestid') == bwBudgetRequestId) {
                            console.log('In bwAttachments_MusicPlaylist.js.populateAttachments(). FOUND THE FORM');
                            form = forms[i];
                        }
                    }
                    if (!form) {

                        console.log('Error in bwAttachments_MusicPlaylist.js.populateAttachments(). NO FORM FOUND for bwBudgetRequestId: ' + bwBudgetRequestId);
                        displayAlertDialog('Error in bwAttachments_MusicPlaylist.js.populateAttachments(). NO FORM FOUND for bwBudgetRequestId: ' + bwBudgetRequestId);

                    } else {

                        var attachmentWidget = $(form).find('.bwAttachments_MusicPlaylist')[0];

                        if (!attachmentWidget) {

                            console.log('Error in bwAttachments_MusicPlaylist.js.populateAttachments(). Could not locate the bwAttachment widget. xcx32425263. bwBudgetRequestId: ' + bwBudgetRequestId);
                            displayAlertDialog('Error in bwAttachments_MusicPlaylist.js.populateAttachments(). Could not locate the bwAttachment widget. xcx32425263. bwBudgetRequestId: ' + bwBudgetRequestId);

                        } else {

                            console.log('In bwAttachments_MusicPlaylist.js.populateAttachments(). workflowAppId: ' + workflowAppId + ', bwBudgetRequestId: ' + bwBudgetRequestId + ', attachmentsTagId: ' + attachmentsTagId + ', showRemoveAttachmentButton: ' + showRemoveAttachmentButton + ').');

                            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

                            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

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

                                        var html = $('.bwCoreComponent:first').bwCoreComponent('createHtmlToDisplayTheListOfAttachments_ForBwAttachments_MusicPlaylistWidget', thiz.options.elementIdSuffix, workflowAppId, bwBudgetRequestId, results);

                                        $(attachmentWidget).find('#newrequestattachments')[0].innerHTML = ''; // It worked, and here were attachments, so get rid of the message.

                                        $(attachmentWidget).find('#newrequestattachments').append(html);

                                    } catch (e) {

                                        $(attachmentWidget).find('#newrequestattachments')[0].innerHTML = '<span style="color:tomato;">Exception in bwAttachments_MusicPlaylist.populateAttachments():1: ' + e.message + ', ' + e.stack + '</span>';
                                        if (e.number) {
                                            console.log('Exception in bwAttachments_MusicPlaylist.js.populateAttachments():1: ' + e.message + ', ' + e.stack);
                                            displayAlertDialog('Exception in bwAttachments_MusicPlaylist.js.populateAttachments():1: ' + e.message + ', ' + e.stack);
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
                                        displayAlertDialog('In bwAttachments_MusicPlaylist.js.populateAttachments(). SERVICE UNAVAILABLE. File services is not responding. communication timeout is set at ' + ajaxTimeout / 1000 + ' seconds: ' + errorCode + ', ' + errorMessage);
                                        $(attachmentWidget).find('#newrequestattachments')[0].innerHTML = '<span style="color:tomato;">File services is not responding. communication timeout is set at ' + ajaxTimeout / 1000 + ' seconds: ' + errorCode + ', ' + errorMessage + '</span>';
                                    } else {

                                        var msg = 'Error in bwAttachments_MusicPlaylist.js.populateAttachments(): ' + errorMessage + '.'; // A common error at the moment is "Backend fetch failed". 10-13-2022

                                        console.log(msg + ' xcx123123 data: ' + JSON.stringify(data));

                                        $(attachmentWidget).find('#newrequestattachments')[0].innerHTML = '<span style="color:tomato;">' + msg + '</span>';

                                        //displayAlertDialog('Error in bwAttachments_MusicPlaylist.js.populateAttachments():2:xcx2 ' + errorCode + ', ' + errorMessage + ', ' + JSON.stringify(data));
                                        // The latest error 1-17-2018 is errorCode:'error' and errorMessage:'Not Found'.
                                        // What does this mean? You can replicate this error!
                                        // at Url: https://budgetworkflow.com/ios8.html, view an offline (Un-submitted) request, and try to add an attachment.

                                    }
                                }
                            });
                        }

                    }

                }

            }

        } catch (e) {
            console.log('Exception in bwAttachments_MusicPlaylist.js.populateAttachments(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwAttachments_MusicPlaylist.js.populateAttachments(): ' + e.message + ', ' + e.stack);

            //renderAndPopulateAttachments
            //$(thiz.element).find('#newrequestattachments')[0].innerHTML = '<span style="color:tomato;">Exception in bwAttachments_MusicPlaylist.populateAttachments(): ' + e.message + ', ' + e.stack + '</span>';
            //$(attachmentWidget).find('#newrequestattachments')[0].innerHTML = '<span style="color:tomato;">Exception in bwAttachments_MusicPlaylist.populateAttachments(): ' + e.message + ', ' + e.stack + '</span>';

        }
    },






    cmdSaveAttachmentMetadata: function (bwBudgetRequestId, originalFilename) {
        try {
            console.log('In bwAttachments_MusicPlaylist.js.cmdSaveAttachmentMetadata().');
            var thiz = this;

            var newFilename = document.getElementById('txtAttachmentsDialog1Filename').value + document.getElementById('spanAttachmentsDialog1FileExtension').innerHTML;
            var description = document.getElementById('txtAttachmentsDialog1FileDescription').value.replace(/["']/g, '');

            console.log('Saving attachment metadata, bwBudgetRequestId: ' + bwBudgetRequestId + ' filename: ' + filename + ' newFilename: ' + newFilename + ' description: ' + description);

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

            var data = {
                bwParticipantId_LoggedIn: participantId,
                bwActiveStateIdentifier: activeStateIdentifier,
                bwWorkflowAppId_LoggedIn: workflowAppId,

                bwWorkflowAppId: workflowAppId,
                bwBudgetRequestId: bwBudgetRequestId,
                OriginalFilename: originalFilename,
                NewFilename: newFilename,
                Description: description
            };

            var operationUri = globalUrlPrefix + globalUrlForWebServices + '/_files/' + 'saveattachmentmetadata';
            $.ajax({
                url: operationUri,
                type: 'POST',
                data: data,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (results) {
                    try {

                        if (results.status != 'SUCCESS') {

                            displayAlertDialog('Failed to update metadata: ' + results.status + ', ' + results.message);

                        } else {

                            try {
                                $('#AttachmentsDialog1').dialog('close');
                            } catch (e) { }

                            // I named the attachment section differently depending on if it is a new request or not. This may not have been necessary, but for now this addresses the issue.
                            if (document.getElementById('attachmentsInXslForm')) {

                                console.log('Calling bwAttachments_MusicPlaylist.js.populateAttachments(). xcx13124-7');
                                alert('xcx213234-4 calling populateAttachments().');
                                thiz.populateAttachments(workflowAppId, bwBudgetRequestId, 'attachmentsInXslForm', true);
                            } else {

                                console.log('Calling bwAttachments_MusicPlaylist.js.populateAttachments(). xcx13124-8');
                                //alert('xcx213234-5 calling populateAttachments().');
                                thiz.populateAttachments(workflowAppId, bwBudgetRequestId, 'newrequestattachments', true);
                            }


                        }

                    } catch (e) {
                        console.log('Exception in bwAttachments_MusicPlaylist.js.cmdSaveAttachmentMetadata(): ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwAttachments_MusicPlaylist.js.cmdSaveAttachmentMetadata(): ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {

                    $('#AttachmentsDialog1').dialog('close');

                    //displayAlertDialog('Error in Start.js.displayConnectedWorkflows()', '1:' + errorCode + ', ' + errorMessage);
                    displayAlertDialog('Error in bwAttachments_MusicPlaylist.js.cmdSaveAttachmentMetadata().saveattachmentmetadata: ' + JSON.stringify(data) + ', ' + errorMessage);
                }
            });
        } catch (e) {
            console.log('Exception in bwAttachments_MusicPlaylist.js.cmdSaveAttachmentMetadata():2: ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwAttachments_MusicPlaylist.js.cmdSaveAttachmentMetadata():2: ' + e.message + ', ' + e.stack);
        }
    },

    cmdDeleteAttachment: function (bwBudgetRequestId, filename) {
        try {
            console.log('In bwAttachments_MusicPlaylist.js.cmdDeleteAttachment(' + bwBudgetRequestId + ', ' + filename + ').');
            //alert('In bwAttachments_MusicPlaylist.js.cmdDeleteAttachment(' + bwBudgetRequestId + ', ' + filename + ').');
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


            //alert('xcx23123123 <<<<< filename: ' + filename);

            // Set the title.
            document.getElementById('spanDeleteAnAttachmentOfflineDialogTitle').innerHTML = 'Delete ' + filename;

            // Set the click event for the Delete button.
            $('#divDeleteAnAttachmentOfflineDialogDeleteRequestButton').off('click').click(function (error) {
                try {

                    console.log('In bwAttachments_MusicPlaylist.js.cmdDeleteAttachment.divDeleteAnAttachmentOfflineDialogDeleteRequestButton.click(). bwBudgetRequestId: ' + bwBudgetRequestId + ', filename: ' + filename);

                    var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                    var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

                    var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                    var data = {
                        bwParticipantId_LoggedIn: participantId,
                        bwActiveStateIdentifier: activeStateIdentifier,
                        bwWorkflowAppId_LoggedIn: workflowAppId,

                        bwBudgetRequestId: bwBudgetRequestId,
                        Filename: filename
                    };

                    var fileserviceurl = globalUrlPrefix + globalUrlForWebServices + '/_files';
                    var operationUri = fileserviceurl + "/removeattachment";
                    $.ajax({
                        url: operationUri,
                        type: 'POST',
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

                                        $('.bwAuthentication').bwAuthentication('checkIfWeNeedToUpdateTheHomepage', bwBudgetRequestId);

                                    } catch (e) { }

                                    console.log('Calling bwAttachments_MusicPlaylist.js.populateAttachments(). xcx13124-9');
                                    console.log('xcx213234-6 calling populateAttachments().');
                                    thiz.populateAttachments(workflowAppId, bwBudgetRequestId, 'attachmentsInXslForm', true);
                                } else {


                                    // 3-23-2022 this may need a revisit someday

                                    console.log('There was an error deleting the file: ' + JSON.stringify(data));
                                    try {
                                        $('#AttachmentsDialog1').dialog('close');
                                    } catch (e) { }

                                    console.log('Calling bwAttachments_MusicPlaylist.js.populateAttachments(). xcx13124-10');
                                    alert('xcx213234-7 calling populateAttachments().');
                                    thiz.populateAttachments(workflowAppId, bwBudgetRequestId, 'attachmentsInXslForm', true);



                                }
                            } catch (e) {
                                debugger;
                                console.log('Exception in bwAttachments_MusicPlaylist.js.cmdDeleteAttachment.post.removeattachment.success(): ' + e.message + ', ' + e.stack);
                                displayAlertDialog('Exception in bwAttachments_MusicPlaylist.js.cmdDeleteAttachment.post.removeattachment.success(): ' + e.message + ', ' + e.stack);
                            }
                        },
                        error: function (data, errorCode, errorMessage) {
                            debugger;
                            console.log('Error in bwAttachments_MusicPlaylist.js.cmdDeleteAttachment.post.removeattachment.error(): ' + e.message + ', ' + e.stack);
                            displayAlertDialog('Error in bwAttachments_MusicPlaylist.js.cmdDeleteAttachment.post.removeattachment.error(): bwBudgetRequestId: ' + bwBudgetRequestId + ', filename: ' + filename + ', errorMessage: ' + errorMessage);
                        }
                    });
                } catch (e) {
                    debugger;
                    console.log('Exception in bwAttachments_MusicPlaylist.js.cmdDeleteAttachment.deletebutton.click(): ' + e.message + ', ' + e.stack);
                    displayAlertDialog('Exception in bwAttachments_MusicPlaylist.js.cmdDeleteAttachment.deletebutton.click(): ' + e.message + ', ' + e.stack);
                }
            });

        } catch (e) {
            debugger;
            console.log('Exception in bwAttachments_MusicPlaylist.js.cmdDeleteAttachment():2: ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwAttachments_MusicPlaylist.js.cmdDeleteAttachment():2: ' + e.message + ', ' + e.stack);
        }
    }



    //
    //
    // ZIPPING A LARGE FILE IS NOT PRACTICAL, AS IT TAKES WAY TOO LONG, AND I SUSPECT THE 2GB WASM LIMIT IS IN PLAY HERE. KEEP THIS CODE AS IT HAS THE PROGRESS BAR FIGURED OUT. 11-21-2023.
    //
    //

    //ShowActivitySpinner('Compressing the file(s) for upload...');

    //var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

    //var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    //    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    //    return v.toString(16);
    //});

    //var archiveFileName = 'ZIPPEDFILES_' + workflowAppId + '_' + bwBudgetRequestId + '_' + guid + '.zip'; // We are using a guid for the filename in order to circumvent (on mobile Samsung, "Are you sure you wish to download this file again?").
    //var zip = new Module.Zip(archiveFileName);
    ////var files = x.files;

    //var trackingArray = []; // We use this to keep track if all of the files have been added to the zip file.
    //for (var i = 0; i < largeFileArray.length; i++) {
    //    trackingArray.push(largeFileArray[i].name);
    //}

    //console.log('In bwAttachments_MusicPlaylist.js.cmdDisplayMultiFileUploadDialog.button.click(). PREPARING TO ZIP THESE FILES AND UPLOAD TO THE SERVER: ' + JSON.stringify(trackingArray));

    //function onAllFilesLoaded() {
    //    try {

    //        alert('xcx2312312323 getting ready to call zip.finish()');

    //        var zipFile = zip.finish(); // finish(): Int8Array
    //        //uploadZipFile(zipFile, archiveFileName, bwBudgetRequestId);

    //        HideActivitySpinner();

    //        var file = new File([zipFile], { type: "octet/stream" });
    //        file.name = archiveFileName;
    //        zip.delete();

    //        ShowActivitySpinner('Completing the .zip file...');

    //        thiz.performUpload2(file, archiveFileName, bwBudgetRequestId, null, false); // data: Int8Array >>> convert to input type="file" element....

    //    } catch (e) {
    //        console.log('Exception in bwAttachments_MusicPlaylist.js.cmdDisplayMultiFileUploadDialog.button.click.onAllFilesLoaded(): ' + e.message + ', ' + e.stack);
    //        displayAlertDialog('Exception in bwAttachments_MusicPlaylist.js.cmdDisplayMultiFileUploadDialog.button.click.onAllFilesLoaded(): ' + e.message + ', ' + e.stack);
    //        alert('Exception in bwAttachments_MusicPlaylist.js.cmdDisplayMultiFileUploadDialog.button.click.onAllFilesLoaded(): ' + e.message + ', ' + e.stack);
    //    }
    //}

    //var total = largeFileArray.length; loaded = 0;
    //for (var i = 0; i < largeFileArray.length; i++) {

    //    var file = largeFileArray[i];
    //    var reader = new FileReader();
    //    reader.fileName = largeFileArray[i].name; // This passes the filename so that scoping of this variable doesn't cause incorrect values... it's async.

    //    reader.onprogress = function (data) {

    //        HideActivitySpinner();

    //        //if (data.lengthComputable) {

    //            var progress = data.loaded / data.total;
    //            var percentComplete = Math.round(progress * 100);

    //            //ShowActivitySpinner_FileUpload('Compressing the file "' + reader.fileName + '" loaded:' + data.loaded + ', total:' + data.total);
    //            ShowActivitySpinner_FileUpload(' loaded:' + data.loaded + ', total:' + data.total);

    //            $("#divBwActivitySpinner_FileUpload_ProgressBar").width(percentComplete + '%');
    //            $("#divBwActivitySpinner_FileUpload_ProgressBar").html(Math.round(percentComplete) + '%');

    //        //}

    //    }



    //    reader.onload = function (event) {
    //        try {

    //            var fileBuffer = new Uint8Array(event.target.result);
    //            var fileName = event.target.fileName; // This passes the filename so that scoping of this variable doesn't cause incorrect values... it's async.

    //            zip.addEntry(fileName, fileBuffer);

    //            loaded++;

    //            if (loaded == total) {
    //                onAllFilesLoaded();
    //            }

    //        } catch (e) {
    //            console.log('Exception in bwAttachments_MusicPlaylist.js.cmdDisplayMultiFileUploadDialog.button.click.reader.load(): ' + e.message + ', ' + e.stack);
    //            displayAlertDialog('Exception in bwAttachments_MusicPlaylist.js.cmdDisplayMultiFileUploadDialog.button.click.reader.load(): ' + e.message + ', ' + e.stack);
    //            alert('Exception in bwAttachments_MusicPlaylist.js.cmdDisplayMultiFileUploadDialog.button.click.reader.load(): ' + e.message + ', ' + e.stack);
    //        }
    //    };

    //    reader.readAsArrayBuffer(file);

    //}



})