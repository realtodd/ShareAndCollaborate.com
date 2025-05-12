$.widget("bw.bwSlideSet", {
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
        This is the bwSlideSet.js jQuery Widget. 
        ===========================================================

            [more to follow]
                          
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

            [put your stuff here]

        ===========================================================
       
        */

        operationUriPrefix: null,
        elementIdSuffix: null, // This is a custom guid which gets appended to element id's, making sure this widget keeps to itself.

        folderAndFiles: null,

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
        inFormsEditor: false, // This is when forms are being designed. This prevents the widget from hitting the database (going asynchronous) when this is true. If that happens, a race condition may occur and addition to the toolbox may partially fail.

        requestDialogId: null // This is the unique id of the request dialog being displayed. We prepend this to id's in order to make sure we can display many dialogs at one time on screen and make them unique in the dom.

        //attachmentsAreStoredInIndexDb: null // We need to know if attachments get stored in IndexDb, or by calling the file service web service.

        //autoSenseDeviceType: false // Automatic UI based on device type. Alpha version so far.
    },
    _create: function () {
        console.log('In bwSlideSet.js._create().');
        this.element.addClass("bwSlideSet");
        var thiz = this; // Need this because of the asynchronous operations below.
        try {
            if (this.options.operationUriPrefix == null) {
                // This formulates the operationUri, which is used throughout.
                var url1 = window.location.href.split('https://')[1];
                var url2 = url1.split('/')[0];
                this.options.operationUriPrefix = 'https://' + url2 + '/';
            }

            if (this.options.elementIdSuffix) {

                this.renderAndPopulateAttachments();

            } else {

                var html = '';
                html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwSlideSet</span>';
                html += '<br />';
                html += '<span style="">Invalid value for elementIdSuffix: ' + this.options.elementIdSuffix + '</span>';
                this.element.html(html);

            }

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwSlideSet</span>';
            html += '<br />';
            html += '<span style="">Exception in bwSlideSet.Create(): ' + e.message + ', ' + e.stack + '</span>';
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
            .removeClass("bwSlideSet")
            .text("");
    },
    getData: function () {
        try {
            console.log('In bwSlideSet.getData().');
            var value = $(this.element).find('#newrequestattachments')[0].innerHTML.trim();
            if (value != '') {
                return 'has attachments';
            } else {
                return null;
            }
        } catch (e) {
            console.log('Exception in bwSlideSet.getData(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwSlideSet.getData(): ' + e.message + ', ' + e.stack);
        }
    },
    isARequiredField: function () {
        try {
            console.log('In bwSlideSet.isARequiredField().');
            return this.options.renderAsARequiredField;
        } catch (e) {
            console.log('Exception in bwSlideSet.isARequiredField(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwSlideSet.isARequiredField(): ' + e.message + ', ' + e.stack);
        }
    },
    getfieldTitle: function () {
        try {
            console.log('In bwSlideSet.getfieldTitle().');
            return this.options.fieldTitle;
        } catch (e) {
            console.log('Exception in bwSlideSet.getfieldTitle(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwSlideSet.getfieldTitle(): ' + e.message + ', ' + e.stack);
        }
    },
    //selectThisSlideSetAsThePubishedOne: function (slideSetName) {
    //    try {
            //console.log('In selectThisSlideSetAsThePubishedOne(). slideSetName: ' + slideSetName);

            //if (slideSetName == this.options.elementIdSuffix) { // Yes this is the correct bwSlideSet.js widget.

            //    var CurrentSlides = JSON.parse(JSON.stringify($('.bwSlideshowAdmin').bwSlideshowAdmin('option', 'CurrentSlides')));
            //    CurrentSlides.DraftSlideSets["PublishedSlideSet"] = slideSetName;
            //    $('.bwSlideshowAdmin').bwSlideshowAdmin('option', 'CurrentSlides', CurrentSlides);

            //    $('.bwSlideshowAdmin').bwSlideshowAdmin('checkIfWeHaveToDisplayThePublishChangesButton');

            //}

    //    } catch (e) {
    //        console.log('Exception in bwSlideSet.js.selectThisSlideSetAsThePubishedOne(): ' + e.message + ', ' + e.stack);
    //        displayAlertDialog('Exception in bwSlideSet.js.selectThisSlideSetAsThePubishedOne(): ' + e.message + ', ' + e.stack);
    //    }
    //},
    moveSubSlideUp: function (fileId, elementIdSuffix) {
        try {
            console.log('In moveSubSlideUp(). fileId: ' + fileId);

            if (elementIdSuffix == this.options.elementIdSuffix) {

                var CurrentSlides = JSON.parse(JSON.stringify($('.bwSlideshowAdmin').bwSlideshowAdmin('option', 'CurrentSlides')));

                var MasterSlide_FileId;
                for (var i = 0; i < CurrentSlides.DraftSlideSets.FilesAndFolders.length; i++) {
                    for (var j = 0; j < CurrentSlides.DraftSlideSets.FilesAndFolders[i].files.length; j++) {
                        if (fileId == CurrentSlides.DraftSlideSets.FilesAndFolders[i].files[j].FileId) {
                            MasterSlide_FileId = CurrentSlides.DraftSlideSets.FilesAndFolders[i].files[j].MasterSlide_FileId;
                            break;
                        }
                    }
                }

                if ((MasterSlide_FileId != 0) && !MasterSlide_FileId) {

                    var msg = 'Error in moveSubSlideUp(). Invalid value for MasterSlide_FileId: ' + MasterSlide_FileId;
                    console.log(msg);
                    displayAlertDialog(msg);

                } else {

                    var subslides = [];
                    for (var i = 0; i < CurrentSlides.DraftSlideSets.FilesAndFolders.length; i++) {
                        for (var j = 0; j < CurrentSlides.DraftSlideSets.FilesAndFolders[i].files.length; j++) {
                            if (MasterSlide_FileId == CurrentSlides.DraftSlideSets.FilesAndFolders[i].files[j].MasterSlide_FileId) {
                                subslides.push(CurrentSlides.DraftSlideSets.FilesAndFolders[i].files[j]);
                            }
                        }
                    }

                    // Now that we have the subslides, lets make sure they are in order etc.
                    // Sort the files in this folder by sortOrder.
                    subslides = subslides.sort(function (a, b) {
                        var nameA = a.SortOrder;
                        var nameB = b.SortOrder;
                        if (nameA < nameB) {
                            return -1; //nameA comes first
                        }
                        if (nameA > nameB) {
                            return 1; // nameB comes first
                        }
                        return 0;  // names must be equal
                    });

                    // Now that it is sorted, lets re-number to make sure it is Ok.
                    for (var i = 0; i < subslides.length; i++) {
                        subslides[i].SortOrder = i;
                    }

                    //
                    // Now we can move it "Up".
                    //
                    for (var i = 0; i < subslides.length; i++) {
                        if (subslides[i].FileId == fileId) {
                            // Moving it down.
                            if (i > 0) {
                                // Yes, it isn't already at the top.
                                var sortOrder = Number(subslides[i - 1].SortOrder);
                                subslides[i - 1].SortOrder = sortOrder + 1; // Move the next one up.
                                subslides[i].SortOrder = sortOrder; // Move the selected one down.
                            }
                            break;
                        }
                    }

                    // Reload these back into the original list. Now they are sorted!
                    for (var i = 0; i < CurrentSlides.DraftSlideSets.FilesAndFolders.length; i++) {
                        for (var j = 0; j < CurrentSlides.DraftSlideSets.FilesAndFolders[i].files.length; j++) {
                            for (var k = 0; k < subslides.length; k++) {
                                if (subslides[k].FileId == CurrentSlides.DraftSlideSets.FilesAndFolders[i].files[j].FileId) {
                                    CurrentSlides.DraftSlideSets.FilesAndFolders[i].files[j] = subslides[k];
                                }
                            }
                        }
                    }

                }

                $('.bwSlideshowAdmin').bwSlideshowAdmin('option', 'CurrentSlides', CurrentSlides);
                $('.bwSlideshowAdmin').bwSlideshowAdmin('renderSlideSets');

            }

        } catch (e) {
            console.log('Exception in moveSubSlideUp(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in moveSubSlideUp(): ' + e.message + ', ' + e.stack);
        }
    },
    moveSubSlideDown: function (fileId, elementIdSuffix) {
        try {
            console.log('In moveSubSlideDown(). fileId: ' + fileId);

            if (elementIdSuffix == this.options.elementIdSuffix) {

                var CurrentSlides = JSON.parse(JSON.stringify($('.bwSlideshowAdmin').bwSlideshowAdmin('option', 'CurrentSlides')));

                var MasterSlide_FileId;
                for (var i = 0; i < CurrentSlides.DraftSlideSets.FilesAndFolders.length; i++) {
                    for (var j = 0; j < CurrentSlides.DraftSlideSets.FilesAndFolders[i].files.length; j++) {
                        if (fileId == CurrentSlides.DraftSlideSets.FilesAndFolders[i].files[j].FileId) {
                            MasterSlide_FileId = CurrentSlides.DraftSlideSets.FilesAndFolders[i].files[j].MasterSlide_FileId;
                            break;
                        }
                    }
                }

                if ((MasterSlide_FileId != 0) && !MasterSlide_FileId) {

                    var msg = 'Error in moveSubSlideDown(). Invalid value for MasterSlide_FileId: ' + MasterSlide_FileId;
                    console.log(msg);
                    displayAlertDialog(msg);

                } else {

                    var subslides = [];
                    for (var i = 0; i < CurrentSlides.DraftSlideSets.FilesAndFolders.length; i++) {
                        for (var j = 0; j < CurrentSlides.DraftSlideSets.FilesAndFolders[i].files.length; j++) {
                            if (MasterSlide_FileId == CurrentSlides.DraftSlideSets.FilesAndFolders[i].files[j].MasterSlide_FileId) {
                                subslides.push(CurrentSlides.DraftSlideSets.FilesAndFolders[i].files[j]);
                            }
                        }
                    }

                    // Now that we have the subslides, lets make sure they are in order etc.
                    // Sort the files in this folder by sortOrder.
                    subslides = subslides.sort(function (a, b) {
                        var nameA = a.SortOrder;
                        var nameB = b.SortOrder;
                        if (nameA < nameB) {
                            return -1; //nameA comes first
                        }
                        if (nameA > nameB) {
                            return 1; // nameB comes first
                        }
                        return 0;  // names must be equal
                    });

                    // Now that it is sorted, lets re-number to make sure it is Ok.
                    for (var i = 0; i < subslides.length; i++) {
                        subslides[i].SortOrder = i;
                    }

                    //
                    // Now we can move it "Down".
                    //
                    for (var i = 0; i < subslides.length; i++) {
                        if (subslides[i].FileId == fileId) {
                            // Moving it down.
                            if (i < (subslides.length - 1)) {
                                // Yes, it isn't already at the end.
                                var sortOrder = Number(subslides[i + 1].SortOrder);
                                subslides[i + 1].SortOrder = sortOrder - 1; // Move the next one up.
                                subslides[i].SortOrder = sortOrder; // Move the selected one down.
                            }
                            break;
                        }
                    }

                    // Reload these back into the original list. Now they are sorted!
                    for (var i = 0; i < CurrentSlides.DraftSlideSets.FilesAndFolders.length; i++) {
                        for (var j = 0; j < CurrentSlides.DraftSlideSets.FilesAndFolders[i].files.length; j++) {
                            for (var k = 0; k < subslides.length; k++) {
                                if (subslides[k].FileId == CurrentSlides.DraftSlideSets.FilesAndFolders[i].files[j].FileId) {
                                    CurrentSlides.DraftSlideSets.FilesAndFolders[i].files[j] = subslides[k];
                                }
                            }
                        }
                    }

                }

                $('.bwSlideshowAdmin').bwSlideshowAdmin('option', 'CurrentSlides', CurrentSlides);
                $('.bwSlideshowAdmin').bwSlideshowAdmin('renderSlideSets');

            }

        } catch (e) {
            console.log('Exception in moveSubSlideDown(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in moveSubSlideDown(): ' + e.message + ', ' + e.stack);
        }
    },
    moveSlideRight: function (fileId, elementIdSuffix) {
        try {
            console.log('In moveSlideRight(). fileId: ' + fileId);

            if (elementIdSuffix == this.options.elementIdSuffix) {

                var CurrentSlides = JSON.parse(JSON.stringify($('.bwSlideshowAdmin').bwSlideshowAdmin('option', 'CurrentSlides')));

                // First we need to get the slide-set that this file belongs to.
                var slideSetIndex;
                for (var i = 0; i < CurrentSlides.DraftSlideSets.FilesAndFolders.length; i++) {
                    for (var j = 0; j < CurrentSlides.DraftSlideSets.FilesAndFolders[i].files.length; j++) {
                        if (fileId == CurrentSlides.DraftSlideSets.FilesAndFolders[i].files[j].FileId) {
                            slideSetIndex = i;
                        }
                    }
                }

                // Next we need to get all the master slides in this slide-set.
                var masterslides = [];
                for (var j = 0; j < CurrentSlides.DraftSlideSets.FilesAndFolders[slideSetIndex].files.length; j++) {
                    if (!CurrentSlides.DraftSlideSets.FilesAndFolders[slideSetIndex].files[j].MasterSlide_FileId) {
                        masterslides.push(CurrentSlides.DraftSlideSets.FilesAndFolders[slideSetIndex].files[j]);
                    }
                }

                // Now that we have the masterslides, lets make sure they are in order. Sort the files in this folder by sortOrder.
                masterslides = masterslides.sort(function (a, b) {
                    var nameA = a.SortOrder;
                    var nameB = b.SortOrder;
                    if (nameA < nameB) {
                        return -1; //nameA comes first
                    }
                    if (nameA > nameB) {
                        return 1; // nameB comes first
                    }
                    return 0;  // names must be equal
                });

                // Now that it is sorted, lets re-number to make sure it is Ok.
                for (var i = 0; i < masterslides.length; i++) {
                    masterslides[i].SortOrder = i;
                }
                debugger;
                //
                // Now we can move it "Right".
                //
                for (var i = 0; i < masterslides.length; i++) {
                    if (masterslides[i].FileId == fileId) {
                        // Moving it right.
                        if (i < (masterslides.length - 1)) {
                            // Yes, it isn't already at the end.
                            var sortOrder = Number(masterslides[i + 1].SortOrder);
                            masterslides[i + 1].SortOrder = sortOrder - 1; // Move the next one left.
                            masterslides[i].SortOrder = sortOrder; // Move the selected one right.
                        }
                        break;
                    }
                }

                // Now we set the SortOrder in the original JSON.
                for (var i = 0; i < masterslides.length; i++) {
                    for (var j = 0; j < CurrentSlides.DraftSlideSets.FilesAndFolders[slideSetIndex].files.length; j++) {
                        if (masterslides[i].FileId == CurrentSlides.DraftSlideSets.FilesAndFolders[slideSetIndex].files[j].FileId) {
                            CurrentSlides.DraftSlideSets.FilesAndFolders[slideSetIndex].files[j].SortOrder = masterslides[i].SortOrder;
                        }
                    }
                }
                debugger;
                $('.bwSlideshowAdmin').bwSlideshowAdmin('option', 'CurrentSlides', CurrentSlides);
                $('.bwSlideshowAdmin').bwSlideshowAdmin('renderSlideSets');

            }

        } catch (e) {
            console.log('Exception in bwSlideSet.js.moveSlideRight(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwSlideSet.js.moveSlideRight(): ' + e.message + ', ' + e.stack);
        }
    },
    moveSlideLeft: function (fileId, elementIdSuffix) {
        try {
            console.log('In moveSlideLeft(). fileId: ' + fileId);
            debugger;
            if (elementIdSuffix == this.options.elementIdSuffix) {

                var CurrentSlides = JSON.parse(JSON.stringify($('.bwSlideshowAdmin').bwSlideshowAdmin('option', 'CurrentSlides')));

                // First we need to get the slide-set that this file belongs to.
                var slideSetIndex;
                for (var i = 0; i < CurrentSlides.DraftSlideSets.FilesAndFolders.length; i++) {
                    for (var j = 0; j < CurrentSlides.DraftSlideSets.FilesAndFolders[i].files.length; j++) {
                        if (fileId == CurrentSlides.DraftSlideSets.FilesAndFolders[i].files[j].FileId) {
                            slideSetIndex = i;
                        }
                    }
                }

                // Next we need to get all the master slides in this slide-set.
                var masterslides = [];
                for (var j = 0; j < CurrentSlides.DraftSlideSets.FilesAndFolders[slideSetIndex].files.length; j++) {
                    if (!CurrentSlides.DraftSlideSets.FilesAndFolders[slideSetIndex].files[j].MasterSlide_FileId) {
                        masterslides.push(CurrentSlides.DraftSlideSets.FilesAndFolders[slideSetIndex].files[j]);
                    }
                }

                // Now that we have the masterslides, lets make sure they are in order. Sort the files in this folder by sortOrder.
                masterslides = masterslides.sort(function (a, b) {
                    var nameA = a.SortOrder;
                    var nameB = b.SortOrder;
                    if (nameA < nameB) {
                        return -1; //nameA comes first
                    }
                    if (nameA > nameB) {
                        return 1; // nameB comes first
                    }
                    return 0;  // names must be equal
                });

                // Now that it is sorted, lets re-number to make sure it is Ok.
                for (var i = 0; i < masterslides.length; i++) {
                    masterslides[i].SortOrder = i;
                }
                debugger;
                //
                // Now we can move it "Left".
                //
                for (var i = 0; i < masterslides.length; i++) {
                    if (masterslides[i].FileId == fileId) {
                        // Moving it left.
                        if (i > 0) {
                            // Yes, it isn't already at the beginning.
                            var sortOrder = Number(masterslides[i - 1].SortOrder);
                            masterslides[i - 1].SortOrder = sortOrder + 1; // Move the next one right.
                            masterslides[i].SortOrder = sortOrder; // Move the selected one left.
                        }
                        break;
                    }
                }

                // Now we set the SortOrder in the original JSON.
                for (var i = 0; i < masterslides.length; i++) {
                    for (var j = 0; j < CurrentSlides.DraftSlideSets.FilesAndFolders[slideSetIndex].files.length; j++) {
                        if (masterslides[i].FileId == CurrentSlides.DraftSlideSets.FilesAndFolders[slideSetIndex].files[j].FileId) {
                            CurrentSlides.DraftSlideSets.FilesAndFolders[slideSetIndex].files[j].SortOrder = masterslides[i].SortOrder;
                        }
                    }
                }
                debugger;
                $('.bwSlideshowAdmin').bwSlideshowAdmin('option', 'CurrentSlides', CurrentSlides);
                $('.bwSlideshowAdmin').bwSlideshowAdmin('renderSlideSets');

            }

        } catch (e) {
            console.log('Exception in bwSlideSet.js.moveSlideLeft(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwSlideSet.js.moveSlideLeft(): ' + e.message + ', ' + e.stack);
        }
    },
    deleteSlide: function (folderName, fileName) {
        try {
            console.log('In bwSlideSet.js.deleteSlide().');

            if (folderName == this.options.elementIdSuffix) {

                var div = document.getElementById('divDeleteASlideDialog');
                if (!div) {

                    console.log('In bwSlideSet.js.deleteSlide(). adding element to the dom: ' + 'divDeleteASlideDialog');

                    div = document.createElement('div');
                    div.id = 'divDeleteASlideDialog';
                    div.style.display = 'none';
                    document.body.appendChild(div); // Place at end of document

                    var html = '';

                    html += '        <table style="width:100%;">';
                    html += '            <tr>';
                    html += '                <td style="width:90%;">';
                    html += '                    <span id="spanDeleteAnAttachmentOfflineDialogTitle" style="color: #3f3f3f;font-size: 60pt;font-weight:bold;">Delete Slide</span>';
                    html += '                </td>';
                    html += '                <td style="width:9%;"></td>';
                    html += '                <td style="width:1%;cursor:pointer;vertical-align:top;">';
                    html += '                    <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 120pt;font-weight:bold;" onclick="$(\'#divDeleteASlideDialog\').dialog(\'close\');">X</span>';
                    html += '                </td>';
                    html += '            </tr>';
                    html += '        </table>';
                    html += '        <br /><br />';
                    html += '        <!--<span id="spanDeleteAnAttachmentOfflineDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 40pt;font-weight:bold;">Delete Slide</span>';
                    html += '        <br /><br />-->';
                    html += '        <span id="spanDeleteAnAttachmentOfflineDialogDependencyDetails" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;"></span>';
                    html += '        <br />';
                    html += '        <span id="spanDeleteAnAttachmentOfflineDialogTopMessage"></span>';
                    html += '        <br />';
                    html += '        <div id="divDeleteAnAttachmentOfflineDialogDeleteRequestButton" class="divDialogButton">';
                    html += '            Delete';
                    html += '        </div>';
                    html += '        <br /><br />';
                    html += '       <div class="divDialogButton" onclick="$(\'#divDeleteASlideDialog\').dialog(\'close\');">';
                    html += '           Close';
                    html += '        </div>';
                    html += '        <br /><br />';
                    html += '        <br /><br />';

                    div.innerHTML = html;
                }

                $('#divDeleteASlideDialog').dialog({
                    modal: true,
                    resizable: false,
                    closeText: "Cancel",
                    closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                    width: "1000", //"570px",
                    dialogClass: "no-close", // No close button in the upper right corner.
                    hide: false, // This means when hiding just disappear with no effects.
                    open: function () {
                        $('.ui-widget-overlay').bind('click', function () {
                            $("#divDeleteASlideDialog").dialog('close');
                        });
                    }
                });

                // Hide the title bar.
                $("#divDeleteASlideDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
                // Set the title.
                //document.getElementById('spanDeleteAnAttachmentOfflineDialogTitle').innerHTML = 'Delete ' + fileName;

                // Set the click event for the Delete button.
                $('#divDeleteAnAttachmentOfflineDialogDeleteRequestButton').off('click').click(function (error) {
                    try {
                        var fileserviceurl = globalUrlPrefix + globalUrlForWebServices + '/_files';
                        var data = {
                            FolderName: folderName,
                            FileName: fileName
                        };
                        var operationUri = fileserviceurl + "/deleteaslide";
                        $.ajax({
                            url: operationUri,
                            type: "POST",
                            data: data,
                            headers: {
                                "Accept": "application/json; odata=verbose"
                            },
                            success: function (data) {
                                try {
                                    $("#divDeleteASlideDialog").dialog('close');

                                    if (JSON.stringify(data).toUpperCase().indexOf('THE SLIDE WAS DELETED') > -1) {

                                        $('.bwSlideshowAdmin').bwSlideshowAdmin('loadFoldersAndFiles'); // Reload and redraw.

                                    } else {

                                        alert(data);
                                        $('.bwSlideshowAdmin').bwSlideshowAdmin('loadFoldersAndFiles'); // Reload and redraw.

                                    }
                                } catch (e) {
                                    console.log('Exception in bwSlideSet.js.deleteSlide.post.removeattachment.success(): ' + e.message + ', ' + e.stack);
                                    displayAlertDialog('Exception in bwSlideSet.js.deleteSlide.post.removeattachment.success(): ' + e.message + ', ' + e.stack);
                                }
                            },
                            error: function (data, errorCode, errorMessage) {
                                console.log('Error in bwSlideSet.js.deleteSlide.post.removeattachment.error(): ' + e.message + ', ' + e.stack);
                                displayAlertDialog('Error in bwSlideSet.js.deleteSlide.post.removeattachment.error(): bwBudgetRequestId: ' + bwBudgetRequestId + ', filename: ' + filename + ', errorMessage: ' + errorMessage);
                            }
                        });
                    } catch (e) {
                        console.log('Exception in bwSlideSet.js.cmdDeleteSlide.deletebutton.click(): ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwSlideSet.js.cmdDeleteSlide.deletebutton.click(): ' + e.message + ', ' + e.stack);
                    }
                });

            }

        } catch (e) {
            console.log('Exception in bwSlideSet.js.deleteSlide(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwSlideSet.js.deleteSlide(): ' + e.message + ', ' + e.stack);
        }
    },
    deleteSlide_subslide: function (folderName, fileName) {
        try {
            console.log('In deleteSlide_subslide().');

            if (folderName == this.options.elementIdSuffix) {

                var div = document.getElementById('divDeleteASlideDialog');
                if (!div) {

                    console.log('In deleteSlide_subslide(). adding element to the dom: ' + 'divDeleteASlideDialog');

                    div = document.createElement('div');
                    div.id = 'divDeleteASlideDialog';
                    div.style.display = 'none';
                    document.body.appendChild(div); // Place at end of document

                    var html = '';

                    html += '        <table style="width:100%;">';
                    html += '            <tr>';
                    html += '                <td style="width:90%;">';
                    html += '                    <span id="spanDeleteAnAttachmentOfflineDialogTitle" style="color: #3f3f3f;font-size: 60pt;font-weight:bold;">Delete Slide</span>';
                    html += '                </td>';
                    html += '                <td style="width:9%;"></td>';
                    html += '                <td style="width:1%;cursor:pointer;vertical-align:top;">';
                    html += '                    <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 120pt;font-weight:bold;" onclick="$(\'#divDeleteASlideDialog\').dialog(\'close\');">X</span>';
                    html += '                </td>';
                    html += '            </tr>';
                    html += '        </table>';
                    html += '        <br /><br />';
                    html += '        <!--<span id="spanDeleteAnAttachmentOfflineDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 40pt;font-weight:bold;">Delete Slide</span>';
                    html += '        <br /><br />-->';
                    html += '        <span id="spanDeleteAnAttachmentOfflineDialogDependencyDetails" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;"></span>';
                    html += '        <br />';
                    html += '        <span id="spanDeleteAnAttachmentOfflineDialogTopMessage"></span>';
                    html += '        <br />';
                    html += '        <div id="divDeleteAnAttachmentOfflineDialogDeleteRequestButton" class="divDialogButton">';
                    html += '            Delete';
                    html += '        </div>';
                    html += '        <br /><br />';
                    html += '       <div class="divDialogButton" onclick="$(\'#divDeleteASlideDialog\').dialog(\'close\');">';
                    html += '           Close';
                    html += '        </div>';
                    html += '        <br /><br />';
                    html += '        <br /><br />';

                    div.innerHTML = html;
                }

                $('#divDeleteASlideDialog').dialog({
                    modal: true,
                    resizable: false,
                    closeText: "Cancel",
                    closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                    width: "1000", //"570px",
                    dialogClass: "no-close", // No close button in the upper right corner.
                    hide: false, // This means when hiding just disappear with no effects.
                    open: function () {
                        $('.ui-widget-overlay').bind('click', function () {
                            $("#divDeleteASlideDialog").dialog('close');
                        });
                    }
                });

                // Hide the title bar.
                $("#divDeleteASlideDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
                // Set the title.
                //document.getElementById('spanDeleteAnAttachmentOfflineDialogTitle').innerHTML = 'Delete ' + fileName;

                // Set the click event for the Delete button.
                $('#divDeleteAnAttachmentOfflineDialogDeleteRequestButton').off('click').click(function (error) {
                    try {
                        var fileserviceurl = globalUrlPrefix + globalUrlForWebServices + '/_files';
                        var data = {
                            FolderName: folderName,
                            FileName: fileName
                        };
                        var operationUri = fileserviceurl + "/deleteaslide";
                        $.ajax({
                            url: operationUri,
                            type: "POST",
                            data: data,
                            headers: {
                                "Accept": "application/json; odata=verbose"
                            },
                            success: function (data) {
                                try {
                                    $("#divDeleteASlideDialog").dialog('close');

                                    if (JSON.stringify(data).toUpperCase().indexOf('THE SLIDE WAS DELETED') > -1) {

                                        $('.bwSlideshowAdmin').bwSlideshowAdmin('loadFoldersAndFiles'); // Reload and redraw.

                                    } else {

                                        alert(data);
                                        $('.bwSlideshowAdmin').bwSlideshowAdmin('loadFoldersAndFiles'); // Reload and redraw.

                                    }
                                } catch (e) {
                                    console.log('Exception in bwSlideSet.js.deleteSlide_subslide.post.removeattachment.success(): ' + e.message + ', ' + e.stack);
                                    displayAlertDialog('Exception in bwSlideSet.js.deleteSlide_subslide.post.removeattachment.success(): ' + e.message + ', ' + e.stack);
                                }
                            },
                            error: function (data, errorCode, errorMessage) {
                                console.log('Error in bwSlideSet.js.deleteSlide_subslide.post.removeattachment.error(): ' + e.message + ', ' + e.stack);
                                displayAlertDialog('Error in bwSlideSet.js.deleteSlide_subslide.post.removeattachment.error(): bwBudgetRequestId: ' + bwBudgetRequestId + ', filename: ' + filename + ', errorMessage: ' + errorMessage);
                            }
                        });
                    } catch (e) {
                        console.log('Exception in bwSlideSet.js.cmdDeleteSlide.deletebutton.click(): ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwSlideSet.js.cmdDeleteSlide.deletebutton.click(): ' + e.message + ', ' + e.stack);
                    }
                });

            }

        } catch (e) {
            console.log('Exception in bwSlideSet.js.deleteSlide_subslide(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwSlideSet.js.deleteSlide_subslide(): ' + e.message + ', ' + e.stack);
        }
    },
    saveSlideToDisk: function (folderName, fileName) {
        try {
            console.log('In saveSlideToDisk().');

            if (folderName == this.options.elementIdSuffix) {

                displayAlertDialog('The slide has been saved to your downloads folder. Alternatively, you can right-click the image, and choose "Save image as..." to choose the download location.');

                //var CurrentSlides = JSON.parse(JSON.stringify($('.bwSlideshowAdmin').bwSlideshowAdmin('option', 'CurrentSlides')));

                //for (var i = 0; i < CurrentSlides.DraftSlideSets.FilesAndFolders.length; i++) {
                //    if (folderName == CurrentSlides.DraftSlideSets.FilesAndFolders[i].folderName) {
                //        for (var j = 0; j < CurrentSlides.DraftSlideSets.FilesAndFolders[i].files.length; j++) {
                //            if (fileName == CurrentSlides.DraftSlideSets.FilesAndFolders[i].files[j].fileName) {
                //                //var newSortOrder = Number(CurrentSlides.DraftSlideSets.FilesAndFolders[i].files[j].sortOrder) - 1; // Move this one back.
                //                //CurrentSlides.DraftSlideSets.FilesAndFolders[i].files[j].sortOrder = newSortOrder;




                //            }
                //        }
                //    }
                //}

                //$('.bwSlideshowAdmin').bwSlideshowAdmin('option', 'CurrentSlides', CurrentSlides);
                //$('.bwSlideshowAdmin').bwSlideshowAdmin('renderSlideSets');

                //var div = document.getElementById('divDeleteASlideDialog');
                //if (!div) {

                //    console.log('In deleteSlide(). adding element to the dom: ' + 'divDeleteASlideDialog');

                //    div = document.createElement('div');
                //    div.id = 'divDeleteASlideDialog';
                //    div.style.display = 'none';
                //    document.body.appendChild(div); // Place at end of document

                //    var html = '';

                //    html += '        <table style="width:100%;">';
                //    html += '            <tr>';
                //    html += '                <td style="width:90%;">';
                //    html += '                    <span id="spanDeleteAnAttachmentOfflineDialogTitle" style="color: #3f3f3f;font-size: 60pt;font-weight:bold;">Delete Slide</span>';
                //    html += '                </td>';
                //    html += '                <td style="width:9%;"></td>';
                //    html += '                <td style="width:1%;cursor:pointer;vertical-align:top;">';
                //    html += '                    <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 120pt;font-weight:bold;" onclick="$(\'#divDeleteASlideDialog\').dialog(\'close\');">X</span>';
                //    html += '                </td>';
                //    html += '            </tr>';
                //    html += '        </table>';
                //    html += '        <br /><br />';
                //    html += '        <!--<span id="spanDeleteAnAttachmentOfflineDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 40pt;font-weight:bold;">Delete Slide</span>';
                //    html += '        <br /><br />-->';
                //    html += '        <span id="spanDeleteAnAttachmentOfflineDialogDependencyDetails" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;"></span>';
                //    html += '        <br />';
                //    html += '        <span id="spanDeleteAnAttachmentOfflineDialogTopMessage"></span>';
                //    html += '        <br />';
                //    html += '        <div id="divDeleteAnAttachmentOfflineDialogDeleteRequestButton" class="divDialogButton">';
                //    html += '            Delete';
                //    html += '        </div>';
                //    html += '        <br /><br />';
                //    html += '       <div class="divDialogButton" onclick="$(\'#divDeleteASlideDialog\').dialog(\'close\');">';
                //    html += '           Close';
                //    html += '        </div>';
                //    html += '        <br /><br />';
                //    html += '        <br /><br />';

                //    div.innerHTML = html;
                //}


                //$('#divDeleteASlideDialog').dialog({
                //    modal: true,
                //    resizable: false,
                //    closeText: "Cancel",
                //    closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                //    width: "1000", //"570px",
                //    dialogClass: "no-close", // No close button in the upper right corner.
                //    hide: false, // This means when hiding just disappear with no effects.
                //    open: function () {
                //        $('.ui-widget-overlay').bind('click', function () {
                //            $("#divDeleteASlideDialog").dialog('close');
                //        });
                //    }
                //});

                //// Hide the title bar.
                //$("#divDeleteASlideDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
                //// Set the title.
                ////document.getElementById('spanDeleteAnAttachmentOfflineDialogTitle').innerHTML = 'Delete ' + fileName;

                //// Set the click event for the Delete button.
                //$('#divDeleteAnAttachmentOfflineDialogDeleteRequestButton').click(function (error) {
                //    try {
                //        var fileserviceurl = globalUrlPrefix + globalUrlForWebServices + '/_files';
                //        var data = {
                //            FolderName: folderName,
                //            FileName: fileName
                //        };
                //        var operationUri = fileserviceurl + "/deleteaslide";
                //        $.ajax({
                //            url: operationUri,
                //            type: "POST",
                //            data: data,
                //            headers: {
                //                "Accept": "application/json; odata=verbose"
                //            },
                //            success: function (data) {
                //                try {
                //                    $("#divDeleteASlideDialog").dialog('close');

                //                    if (JSON.stringify(data).toUpperCase().indexOf('THE SLIDE WAS DELETED') > -1) {

                //                        $('.bwSlideshowAdmin').bwSlideshowAdmin('loadFoldersAndFiles'); // Reload and redraw.

                //                    } else {

                //                        alert(data);
                //                        $('.bwSlideshowAdmin').bwSlideshowAdmin('loadFoldersAndFiles'); // Reload and redraw.

                //                    }
                //                } catch (e) {
                //                    console.log('Exception in bwSlideSet.js.deleteSlide.post.removeattachment.success(): ' + e.message + ', ' + e.stack);
                //                    displayAlertDialog('Exception in bwSlideSet.js.deleteSlide.post.removeattachment.success(): ' + e.message + ', ' + e.stack);
                //                }
                //            },
                //            error: function (data, errorCode, errorMessage) {
                //                console.log('Error in bwSlideSet.js.deleteSlide.post.removeattachment.error(): ' + e.message + ', ' + e.stack);
                //                displayAlertDialog('Error in bwSlideSet.js.deleteSlide.post.removeattachment.error(): bwBudgetRequestId: ' + bwBudgetRequestId + ', filename: ' + filename + ', errorMessage: ' + errorMessage);
                //            }
                //        });
                //    } catch (e) {
                //        console.log('Exception in bwSlideSet.js.cmdDeleteSlide.deletebutton.click(): ' + e.message + ', ' + e.stack);
                //        displayAlertDialog('Exception in bwSlideSet.js.cmdDeleteSlide.deletebutton.click(): ' + e.message + ', ' + e.stack);
                //    }
                //});

            }

        } catch (e) {
            console.log('Exception in bwSlideSet.js.saveSlideToDisk(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwSlideSet.js.saveSlideToDisk(): ' + e.message + ', ' + e.stack);
        }
    },
    changeSlideSize: function (size, folderName) {
        try {
            console.log('In changeSlideSize(). size: ' + size + ', folderName: ' + folderName);

            if (folderName == this.options.elementIdSuffix) { // Yes this is the correct widget.

                var className = 'slideSetImageClass_' + folderName;

                switch (size) {
                    case 'small':
                        $('.' + className).attr('style', 'width:200px;');
                        break;
                    case 'large':
                        $('.' + className).attr('style', 'width:750px;');
                        break;
                    case 'larger':
                        $('.' + className).attr('style', 'width:1000px;');
                        break;
                    case 'largest':
                        $('.' + className).attr('style', 'width:2000px;');
                        break;
                    default:
                        $('.' + className).attr('style', 'width:200px;');
                        break;
                        break;
                }

            }

        } catch (e) {
            console.log('Exception in changeSlideSize(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in changeSlideSize(): ' + e.message + ', ' + e.stack);
        }
    },

    renderAndPopulateAttachments: function () {
        try {
            console.log('');
            console.log('##################################');
            console.log('In bwSlideSet.js.renderAndPopulateAttachments().');
            console.log('##################################');
            console.log('');

            var requestDialogId = 'divCreateRequestFormContent'; // This is the name of the dialog.

            var html = '';

            var isTheCopyBufferPopulated = false;
            html += '<style>';
            html += '   .bwCopyAndPaste_Disabled {';
            html += '        pointer-events: none;'; // Disable an element interaction, so it will not respond any event.
            html += '        color: #ccc;'; // Gray out the text color to signify being disabled.
            html += '        cursor: not-allowed;';
            html += '   }';
            html += '   .bwCopyAndPaste_Enabled{';
            html += '        pointer-events: auto;'; // Enable an element interaction, so it will not respond any event.
            html += '        color: black;'; // Gray out the text color to signify being disabled.
            html += '        cursor: pointer;';
            html += '   }';
            html += '</style>';


            html += '<table style="width:100%;">';
            html += '   <tbody>';

            html += '       <tr colspan="2" class="xdTableOffsetRow" bwwidgetname="bwSlideSet">';
            html += '           <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px">';
            html += '               <div style="display:inline-block;height:55px;text-align:center;background-color:#f6f6f6;padding-left:0;vertical-align:top;font-size:20pt;">';
            // Check if this radio button needs to be selected.
            var CurrentSlides = $('.bwSlideshowAdmin').bwSlideshowAdmin('option', 'CurrentSlides');
            if (CurrentSlides.DraftSlideSets.PublishedSlideSet == this.options.elementIdSuffix) {
                //html += '<div style="display:inline-block;"><input type="radio" checked name="radioSelectPublishedSlideSet" onchange="$(\'.bwSlideSet\').bwSlideSet(\'selectThisSlideSetAsThePubishedOne\', \'' + this.options.elementIdSuffix + '\');" style="transform: scale(3);" /></div>';
                html += '<div style="display:inline-block;"><input type="radio" checked name="radioSelectPublishedSlideSet" style="transform: scale(3);" /></div>';

            } else {
                //html += '<div style="display:inline-block;"><input type="radio" name="radioSelectPublishedSlideSet" onchange="$(\'.bwSlideSet\').bwSlideSet(\'selectThisSlideSetAsThePubishedOne\', \'' + this.options.elementIdSuffix + '\');" style="transform: scale(3);" /></div>';
                html += '<div style="display:inline-block;"><input type="radio" name="radioSelectPublishedSlideSet" style="transform: scale(3);" /></div>';
            }
            html += '                   Slide set: ' + this.options.elementIdSuffix + '&nbsp;&nbsp;&nbsp;&nbsp;';
            html += '<input type="text" class="spanButton" value="small" style="" onclick="$(\'.bwSlideSet\').bwSlideSet(\'changeSlideSize\', \'small\', \'' + this.options.elementIdSuffix + '\');">';
            //html += '[small]';
            html += '&nbsp;&nbsp;';
            html += '<input type="text" class="spanButton" value="large" style="" onclick="$(\'.bwSlideSet\').bwSlideSet(\'changeSlideSize\', \'large\', \'' + this.options.elementIdSuffix + '\');">';
            //html += '[large]';
            html += '&nbsp;&nbsp;';
            html += '<input type="text" class="spanButton" value="larger" style="" onclick="$(\'.bwSlideSet\').bwSlideSet(\'changeSlideSize\', \'larger\', \'' + this.options.elementIdSuffix + '\');">';
            //html += '[larger]';
            html += '&nbsp;&nbsp;';
            html += '<input type="text" class="spanButton" value="largest" style="" onclick="$(\'.bwSlideSet\').bwSlideSet(\'changeSlideSize\', \'largest\', \'' + this.options.elementIdSuffix + '\');">';
            //html += '[largest]';
            html += '               </div>';
            html += '           </td>';
            html += '       </tr>';

            html += '       <tr class="xdTableOffsetRow" bwwidgetname="bwSlideSet">';
            html += '           <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px">';
            html += '               <span class="xdlabel">';
            //html += '                   Slides: ';

            console.log('In bwSlideSet.js.renderAndPopulateAttachments(). Getting ready to add img elements>>>>>>>>>>>>> this.options.folderAndFiles: ' + JSON.stringify(this.options.folderAndFiles));
            //displayAlertDialog('*********In bwSlideSet.js.renderAndPopulateAttachments(). xcx213124 this.options.folderAndFiles: ' + JSON.stringify(this.options.folderAndFiles));

            //
            // Now that we have the masterslides, lets make sure they are in order. Sort the files in this folder by sortOrder.
            //
            this.options.folderAndFiles.files = this.options.folderAndFiles.files.sort(function (a, b) {
                var nameA = a.SortOrder;
                var nameB = b.SortOrder;
                if (nameA < nameB) {
                    return -1; //nameA comes first
                }
                if (nameA > nameB) {
                    return 1; // nameB comes first
                }
                return 0;  // names must be equal
            });
            //
            // end: Now that we have the masterslides, lets make sure they are in order. Sort the files in this folder by sortOrder.
            //

            for (var i = 0; i < this.options.folderAndFiles.files.length; i++) { // Only display the "Main Slides" to begin with. After this loop, we will go through the files again and display the sub-slides.
                if (this.options.folderAndFiles.files[i].fileName.indexOf('.metadata') > -1) {
                    // Don't display this file.
                } else {
                    var filePath = this.options.operationUriPrefix + '_slidesets/' + this.options.folderAndFiles.folderName + '/' + this.options.folderAndFiles.files[i].fileName;
                    var folderAndFile = this.options.folderAndFiles.folderName + '/' + this.options.folderAndFiles.files[i].fileName;

                    if (!this.options.folderAndFiles.files[i].MasterSlide_FileId) { // Only display the "Main Slides" to begin with. After this loop, we will go through the files again and display the sub-slides.

                        if (!this.options.folderAndFiles.files[i].FileId) {
                            console.log('Error in bwSlideSet.js.renderAndPopulateAttachments(). Invalid value for FileId: ' + this.options.folderAndFiles.files[i].FileId);
                            alert('Error in bwSlideSet.js.renderAndPopulateAttachments(). Invalid value for FileId: ' + this.options.folderAndFiles.files[i].FileId + ', this.options.folderAndFiles.files[i]: ' + JSON.stringify(this.options.folderAndFiles.files[i]));

                            html += '<div class="bwSlide" bwslide_fileid="' + '' + '" style="display:inline-block;">';

                        } else {
                            html += '<div xcx="xcx339956" class="bwSlide" bwslide_fileid="' + this.options.folderAndFiles.files[i].FileId + '" style="display:inline-block;">';
                        }

                        html += '   <div style="border:2px solid blue;cursor:pointer;">';

                        html += '<table>';
                        html += '<tr>';
                        html += '<td style="vertical-align:top;">';
                        html += '       <img class="slideSetImageClass_' + this.options.elementIdSuffix + '" style="width:200px;" src="' + filePath + '" ';
                        html += '           onclick="$(\'.bwSlideshowAdmin\').bwSlideshowAdmin(\'displaySlidePropertiesInDialog\', \'' + filePath + '\', \'' + this.options.folderAndFiles.files[i].fileName + '\', \'' + this.options.folderAndFiles.files[i].descriptionText + '\', \'\', \'' + this.options.folderAndFiles.files[i].headerText + '\', \'' + this.options.folderAndFiles.folderName + '\');" />';
                        html += '</td>';
                        html += '<td style="vertical-align:top;">';


                        // 
                        html += '<div xcx="9922567">';
                        debugger;
                        html += this.options.folderAndFiles.files[i].headerText;
                        html += '   <br />';
                        html += this.options.folderAndFiles.files[i].descriptionText;
                        html += '</div>';


                        html += '<div class="bwSubSlides"></div>';


                        html += '</td>';
                        html += '</tr>';
                        html += '</table>';

                        // 8-16-2022 copy and paste.
                        html += '<div>';
                        html += '<input type="button" class="bwCopyAndPaste_Copy bwCopyAndPaste_Disabled" value="copy" onclick="$(\'.bwSlideshowAdmin\').bwSlideshowAdmin(\'copyAndPaste_Copy\', \'' + folderAndFile + '\');" />';
                        html += '&nbsp;&nbsp;';
                        html += '<input type="button" class="bwCopyAndPaste_Paste bwCopyAndPaste_Disabled" value="paste" onclick="$(\'.bwSlideshowAdmin\').bwSlideshowAdmin(\'copyAndPaste_Paste\', \'' + this.options.folderAndFiles.folderName + '\');" />';
                        html += '&nbsp;&nbsp;';
                        html += '<input type="button" class="bwCopyAndPaste_Clear bwCopyAndPaste_Disabled" value="clear" onclick="$(\'.bwSlideshowAdmin\').bwSlideshowAdmin(\'copyAndPaste_Clear\');" />';
                        html += '&nbsp;&nbsp;';

                        //html += '<input type="button" class="bwCopyAndPaste_Clear bwCopyAndPaste_Enabled" value="ADD SUB-SLIDE" onclick="$(\'.bwSlideshowAdmin\').bwSlideshowAdmin(\'addSubSlide\');" />';

                        html += '           <div id="dropzone1_subSlide" style="display:inline-block;width:200px;height:35px;text-align:center;background-color:#f6f6f6;padding-left:0;vertical-align:bottom;">';
                        html += '               <label for="inputFile_subSlide_' + this.options.folderAndFiles.folderName + '_' + this.options.folderAndFiles.files[i].FileId + '" class="divSignInButton" style="font-style:normal;width:100%;height:100%;text-align:center;line-height:1.65em;font-size:15pt;border-radius: 5px 5px 5px 5px;display:inline-block;padding-left:0;padding-top:0;">';
                        html += '                   Add sub-slide...&nbsp;&nbsp;&nbsp;&#128193;';
                        html += '               </label>';
                        html += '<form id="uploadForm_subSlide_' + this.options.folderAndFiles.folderName + '_' + this.options.folderAndFiles.files[i].FileId + '" action="/" enctype="multipart/form-data" method="post">';
                        // These empty fields need to be here so they are forced to get sent to the web service before the file(s). This is important because we need these values to determine where we are saving the files.
                        html += '<input type="hidden" name="elementIdSuffix" value="" />';
                        html += '<input type="hidden" name="MasterSlide_FileId" value="" />'; // This is only populated for sub-slides.
                        html += '<input type="hidden" name="bwBudgetRequestId" value="" />';
                        html += '<input type="hidden" name="bwParticipantId" value="" />';
                        html += '<input type="hidden" name="bwParticipantEmail" value="" />';
                        html += '<input type="hidden" name="bwParticipantFriendlyName" value="" />';
                        html += '<input type="hidden" name="Filename" value="" />';
                        html += '<input type="hidden" name="HeaderText" value="" />';
                        html += '<input type="hidden" name="Description" value="" />';
                        html += '<input type="hidden" name="Size" value="" />';
                        html += '<input type="hidden" name="FileId" value="" />';
                        // The "multiple" attribute in the input/file element below turns on the ability to select multiple items for the upload. 6-11-2022
                        html += '<input type="file" multiple name="multerFileUploadIdentifier" id="inputFile_subSlide_' + this.options.folderAndFiles.folderName + '_' + this.options.folderAndFiles.files[i].FileId + '" class="upload" style="visibility:hidden;" onchange="$(\'.bwSlideSet\').bwSlideSet(\'uploadAttachment_subSlide\',\'newrequestattachments\', \'' + requestDialogId + '\', \'' + this.options.elementIdSuffix + '\', \'' + this.options.folderAndFiles.files[i].FileId + '\');" />';
                        //html += '<input type="file" name="multi-files" accept="image/*" multiple>';
                        //html += '<input type="submit" value="Upload">';
                        html += '</form>  ';
                        html += '           </div>';

                        html += '</div>';

                        html += '   </div>';
                        html += '   <div xcx="xcx21343678" style="border:2px solid green">';

                        html += '       <span style="cursor:pointer;font-size:30pt;" onclick="$(\'.bwSlideSet\').bwSlideSet(\'moveSlideLeft\', \'' + this.options.folderAndFiles.files[i].FileId + '\', \'' + this.options.elementIdSuffix + '\');">[ < ]</span>'; // 

                        html += '       <span style="cursor:pointer;font-size:30pt;" onclick="$(\'.bwSlideSet\').bwSlideSet(\'moveSlideRight\', \'' + this.options.folderAndFiles.files[i].FileId + '\', \'' + this.options.elementIdSuffix + '\');">[ > ]</span>';

                        html += '       <span style="cursor:pointer;border-left:15px;" onclick="$(\'.bwSlideSet\').bwSlideSet(\'deleteSlide\', \'' + this.options.folderAndFiles.folderName + '\', \'' + this.options.folderAndFiles.files[i].fileName + '\', ' + this.options.folderAndFiles.files[i].SortOrder + ');">';
                        //html += '           [trashbin]';
                        html += '           <img src="images/trashbin.png?v=1" title="Delete this slide..." />';
                        html += '       </span>';

                        html += '       <span style="cursor:pointer;border-left:15px;" onclick="$(\'.bwSlideSet\').bwSlideSet(\'saveSlideToDisk\', \'' + this.options.folderAndFiles.folderName + '\', \'' + this.options.folderAndFiles.files[i].fileName + '\', ' + this.options.folderAndFiles.files[i].SortOrder + ');">';
                        //html += '           [save to disk]';
                        html += '       <a href="' + filePath + '" download>';
                        html += '           <img src="images/savetodisk.png?v=1" style="width:50px;height:50px;" title="Save this slide to disk..." />';
                        html += '       </a>';
                        html += '       </span>';

                        html += '<br />';
                        html += '<span xcx="xcx553221096">Sort order: ' + this.options.folderAndFiles.files[i].SortOrder + '</span>';
                        html += '<br />';
                        html += 'File name: ' + this.options.folderAndFiles.files[i].fileName;
                        //html += '<br />';
                        //html += 'Header text: ' + this.options.folderAndFiles.files[i].headerText;
                        //html += '<br />';
                        //html += 'Description text: ' + this.options.folderAndFiles.files[i].descriptionText;

                        html += '   </div>';
                        html += '</div>';

                    }

                }
            }

            html += '                                </span>';

            // ABILITY TO DROP AN ATTACHMENT FROM ANOTHE isplayed request dialog! 4-8-2020
            html += '           <div id="dropzone1" style="display:inline-block;width:240px;height:55px;text-align:center;background-color:#f6f6f6;padding-left:0;vertical-align:bottom;">';
            html += '               <label for="inputFile_' + this.options.elementIdSuffix + '" class="divSignInButton" style="font-style:normal;width:100%;height:100%;text-align:center;line-height:1.65em;font-size:23pt;border-radius: 5px 5px 5px 5px;display:inline-block;padding-left:0;padding-top:0;">';
            html += '                   Add slide...&nbsp;&nbsp;&nbsp;&#128193;';
            html += '               </label>';
            html += '<form id="uploadForm_' + this.options.elementIdSuffix + '" action="/" enctype="multipart/form-data" method="post">';
            // These empty fields need to be here so they are forced to get sent to the web service before the file(s). This is important because we need these values to determine where we are saving the files.
            html += '<input type="hidden" name="elementIdSuffix" value="" />';
            html += '<input type="hidden" name="bwBudgetRequestId" value="" />';
            html += '<input type="hidden" name="bwParticipantId" value="" />';
            html += '<input type="hidden" name="bwParticipantEmail" value="" />';
            html += '<input type="hidden" name="bwParticipantFriendlyName" value="" />';
            html += '<input type="hidden" name="Filename" value="" />';
            html += '<input type="hidden" name="HeaderText" value="" />';
            html += '<input type="hidden" name="Description" value="" />';
            html += '<input type="hidden" name="Size" value="" />';
            html += '<input type="hidden" name="FileId" value="" />';
            // The "multiple" attribute in the input/file element below turns on the ability to select multiple items for the upload. 6-11-2022
            html += '<input type="file" multiple name="multerFileUploadIdentifier" id="inputFile_' + this.options.elementIdSuffix + '" class="upload" style="visibility:hidden;" onchange="$(\'.bwSlideSet\').bwSlideSet(\'uploadAttachment\',\'newrequestattachments\', \'' + requestDialogId + '\', \'' + this.options.elementIdSuffix + '\');" />';
            //html += '<input type="file" name="multi-files" accept="image/*" multiple>';
            //html += '<input type="submit" value="Upload">';
            html += '</form>  ';
            html += '           </div>';

            html += '                            </td>';
            html += '                            <td class="xdTableOffsetCellComponent" style="white-space:nowrap;text-align:left; VERTICAL-ALIGN: top; PADDING-LEFT: 5px; PADDING-RIGHT: 22px;">';


            //html += '           <!--<br />';
            //html += '           <button name="recordMemoButton" title="Click here to record a memo." class="BwButton200" id="recordMemoButton" onclick="displayRecordAVoiceMemoDialog();">Start Recording Memo...</button>-->';
            //html += '           <!--<a href="https://budgetworkflow.com?memo=startrecordingaudio" target="_blank" style="font-size:40pt;">Click here to record a memo.</a>-->';

            //html += '           <br />';

            html += '           <p id="newrequestattachments"></p>';

            html += '           <br />';
            html += '           <br />';

            var bwRequestTitle = 'xcx3456775'; //$(this.element).closest('#budgetrequestform')[0].getAttribute('bwrequesttitle');
            var bwRequestTypeId = 'xcx32423888'; //$(this.element).closest('#budgetrequestform')[0].getAttribute('bwrequesttypeid');

            // "Email attachments externally..." button.
            html += '           <input id="' + requestDialogId + '_buttonEmailAttachmentsExternally" type="button" style="display:none;padding:5px 10px 5px 10px;" value="Email attachment(s) externally..." title="Email attachments to a customer using your internet facing url, which is configured in the organization settings." class="BwButton350" ';
            html += '               onclick="$(\'.bwSlideSet\').bwSlideSet(\'copyAttachments\',\'newrequestattachments\', \'' + requestDialogId + '\', \'' + this.options.elementIdSuffix + '\', \'' + bwRequestTitle + '\', \'' + bwRequestTypeId + '\');" />';

            html += '                            </td>';
            html += '                        </tr>';
            html += '                    </tbody>';
            html += '</table>';

            // Render the html.
            //if (this.options.inFormsEditor != true) {
            //    // THIS IS VERY IMPORTANT AND NEEDS TO BE IN EVERY WIDGET!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 7-12-2020
            //    // Even though the widget regenerates itself (re-renders), the parent TR tag gets missed!!! Therefore we have to handle getting rid of our form editor draggable attribute here.
            //    this.element.closest('tr').removeAttr('draggable');
            //}
            this.element.html(html);







            //
            //
            // Now we can populate the sub-slides. We do this by creating the ordered JSON, then rendering it all at once.
            //
            //

            var displayJson = [];
            for (var i = 0; i < this.options.folderAndFiles.files.length; i++) { // Go through the files and display the sub-slides.
                if (this.options.folderAndFiles.files[i].fileName.indexOf('.metadata') > -1) {
                    // Don't display this file.
                } else {

                    //var filePath = this.options.operationUriPrefix + '_files/slidesets/' + this.options.folderAndFiles.folderName + '/' + this.options.folderAndFiles.files[i].fileName;
                    //var folderAndFile = this.options.folderAndFiles.folderName + '/' + this.options.folderAndFiles.files[i].fileName;

                    if (this.options.folderAndFiles.files[i].MasterSlide_FileId) { // Displaying the sub slides.

                        // Check if the "MasterSlide_FileId" is in the "displayJson" array yet.
                        var foundTheMasterSlide = false;
                        var masterSlideIndex = -1;
                        for (var j = 0; j < displayJson.length; j++) {
                            if (displayJson[j].MasterSlide_FileId == this.options.folderAndFiles.files[i].MasterSlide_FileId) {
                                foundTheMasterSlide = true;
                                masterSlideIndex = j;
                            }
                        }

                        if (foundTheMasterSlide == true) {

                            // Yes, it was already in the "displayJson" array.
                            var fileJson = {
                                MasterSlide_FileId: this.options.folderAndFiles.files[i].MasterSlide_FileId,
                                FileId: this.options.folderAndFiles.files[i].FileId,
                                folderName: this.options.folderAndFiles.folderName,
                                fileName: this.options.folderAndFiles.files[i].fileName,
                                headerText: this.options.folderAndFiles.files[i].headerText,
                                descriptionText: this.options.folderAndFiles.files[i].descriptionText,
                                SortOrder: this.options.folderAndFiles.files[i].SortOrder
                            };

                            displayJson[masterSlideIndex].files.push(fileJson); // Still need to add sort order at some point.

                        } else {

                            // This is the first one.
                            var masterSlideJson = {
                                MasterSlide_FileId: this.options.folderAndFiles.files[i].MasterSlide_FileId,
                                files: [
                                    {
                                        MasterSlide_FileId: this.options.folderAndFiles.files[i].MasterSlide_FileId,
                                        FileId: this.options.folderAndFiles.files[i].FileId,
                                        folderName: this.options.folderAndFiles.folderName,
                                        fileName: this.options.folderAndFiles.files[i].fileName,
                                        headerText: this.options.folderAndFiles.files[i].headerText,
                                        descriptionText: this.options.folderAndFiles.files[i].descriptionText,
                                        SortOrder: this.options.folderAndFiles.files[i].SortOrder
                                    }
                                ]
                            }

                            displayJson.push(masterSlideJson);

                        }

                    }

                }
            }



            debugger;
            for (var x = 0; x < displayJson.length; x++) {
                if (displayJson[x] && displayJson[x].files && displayJson[x].files.length) {
                    // Validate that our sortOrder is Ok everywhere.
                    for (var i = 0; i < displayJson[x].files.length; i++) {
                        // Sort the files in this folder by sortOrder.
                        displayJson[x].files = displayJson[x].files.sort(function (a, b) {
                            var nameA = a.SortOrder;
                            var nameB = b.SortOrder;
                            if (nameA < nameB) {
                                return -1; //nameA comes first
                            }
                            if (nameA > nameB) {
                                return 1; // nameB comes first
                            }
                            return 0;  // names must be equal
                        });
                        // Now that it is sorted, lets re-number to make sure it is Ok.
                        for (var j = 0; j < displayJson[x].files.length; j++) {
                            displayJson[x].files[j].SortOrder = j;
                        }
                    }
                }
            }


            debugger;


            for (var i = 0; i < displayJson.length; i++) {

                var html = '';






                for (var j = 0; j < displayJson[i].files.length; j++) {

                    var filePath = this.options.operationUriPrefix + '_slidesets/' + displayJson[i].files[j].folderName + '/' + displayJson[i].files[j].fileName;

                    html += '<div>';

                    html += '   <table>';
                    html += '       <tr>';
                    html += '           <td style="vertical-align:top;">';
                    html += '               <img src="' + filePath + '" style="width:75px;" ';
                    html += '                   onclick="$(\'.bwSlideshowAdmin\').bwSlideshowAdmin(\'displaySlidePropertiesInDialog_subslide\', \'' + filePath + '\', \'' + displayJson[i].files[j].fileName + '\', \'' + displayJson[i].files[j].descriptionText + '\', \'' + displayJson[i].files[j].FileId + '\', \'' + displayJson[i].files[j].headerText + '\', \'' + displayJson[i].files[j].folderName + '\');" />';
                    html += '           </td>';
                    html += '           <td style="vertical-align:top;">';
                    html += '               <div>';
                    html += displayJson[i].files[j].headerText;
                    html += '                   <br />';
                    html += displayJson[i].files[j].descriptionText;
                    html += '               </div>';
                    html += '           </td>';
                    html += '           <td>';
                    html += '               <span style="cursor:pointer;border-left:15px;" onclick="$(\'.bwSlideSet\').bwSlideSet(\'deleteSlide_subslide\', \'' + displayJson[i].files[j].folderName + '\', \'' + displayJson[i].files[j].fileName + '\', 3);">';
                    html += '                   <img src="images/trashbin.png?v=1" title="Delete this slide...">';
                    html += '               </span>';

                    html += '<span id="" onclick="$(\'.bwSlideSet\').bwSlideSet(\'moveSubSlideUp\', \'' + displayJson[i].files[j].FileId + '\', \'' + this.options.elementIdSuffix + '\');">[↑]</span>';
                    html += '<span id="" onclick="$(\'.bwSlideSet\').bwSlideSet(\'moveSubSlideDown\', \'' + displayJson[i].files[j].FileId + '\', \'' + this.options.elementIdSuffix + '\');">[↓]</span>';
                    html += ' Sort order: ' + displayJson[i].files[j].SortOrder;


                    html += '           </td>';
                    html += '       </tr>';
                    html += '   </table>';

                    html += '</div>';

                }

                $('.bwSlide[bwslide_fileid="' + displayJson[i].MasterSlide_FileId + '"]').find('.bwSubSlides').html(html);

            }

            ////
            //// Now that we have made sure the sort order is ok, lets put it back into the main storage variable, and check if changes need to be published. Is this too complicated? maybe but it works.
            ////
            //for (var i = 0; i < CurrentSlides.DraftSlideSets.FilesAndFolders.length; i++) {
            //    for (var j = 0; j < CurrentSlides.DraftSlideSets.FilesAndFolders[i].files.length; j++) {
            //        if (displayJson[masterSlideIndex] && displayJson[masterSlideIndex].files && displayJson[masterSlideIndex].files.length) {
            //            for (var k = 0; k < displayJson[masterSlideIndex].files.length; k++) {
            //                if (CurrentSlides.DraftSlideSets.FilesAndFolders[i].files[j].FileId == displayJson[masterSlideIndex].files[k].FileId) {
            //                    CurrentSlides.DraftSlideSets.FilesAndFolders[i].files[j] = displayJson[masterSlideIndex].files[k]; // Moving this back into the original storage container....
            //                }
            //            }
            //        }
            //    }
            //}

            //$('.bwSlideshowAdmin').bwSlideshowAdmin('option', 'CurrentSlides', CurrentSlides);

            //$('.bwSlideshowAdmin').bwSlideshowAdmin('checkIfWeHaveToDisplayThePublishChangesButton');


            ////
            ////
            //// end: Now we can populate the sub-slides. We do this by creating the ordered JSON, then rendering it all at once.
            ////
            ////









            $(this.element).find('#newrequestattachments')[0].innerHTML = '<span style="color:tomato;"></span>';

        } catch (e) {
            console.log('Exception in bwSlideSet.js.renderAndPopulateAttachments: ' + e.message + ', ' + e.stack);
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwSlideSet</span>';
            html += '<br />';
            html += '<span style="">Exception in bwSlideSet.renderAndPopulateAttachments(): ' + e.message + ', ' + e.stack + '</span>';
            this.element.html(html);
        }
    },

    renderAndPopulateAttachments_ReadOnly: function (requestDialogId) {
        try {
            console.log('In bwSlideSet.js.renderAndPopulateAttachments_ReadOnly().');
            //var thiz = this;
            var html = '';

            html += '<table style="width:100%;">';
            //html += '                        <tbody><tr class="xdTableOffsetRow xdTableOffsetRow-editor" id="toolboxdraggablerow_2" draggable="true" bwwidgetname="bwSlideSet">';
            html += '                        <tbody><tr class="xdTableOffsetRow" bwwidgetname="bwSlideSet">';
            html += '                            <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px">';
            html += '                                <span class="xdlabel">';
            html += '                                    Slides_ReadOnly:';
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
            //html += '               <input type="file" id="inputFile" class="upload" style="visibility:hidden;" onchange="$(\'.bwSlideSet\').bwSlideSet(\'uploadAttachment\',\'newrequestattachments\');" />';
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
            //if (this.options.inFormsEditor != true) {
            //    // THIS IS VERY IMPORTANT AND NEEDS TO BE IN EVERY WIDGET!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 7-12-2020
            //    // Even though the widget regenerates itself (re-renders), the parent TR tag gets missed!!! Therefore we have to handle getting rid of our form editor draggable attribute here.
            //    this.element.closest('tr').removeAttr('draggable');
            //}
            this.element.html(html);

            //var bwBudgetRequestId = $(this.element).closest('#budgetrequestform')[0].getAttribute('bwbudgetrequestid');
            //var requestDialogId = null;
            //this.populateAttachments(workflowAppId, bwBudgetRequestId, 'newrequestattachments', true, requestDialogId);

            //$(this.element).find('#newrequestattachments')[0].innerHTML = '<span style="color:tomato;">[newrequestattachments]</span>';
            $(this.element).find('#newrequestattachments')[0].innerHTML = '<span style="color:tomato;"></span>';

        } catch (e) {
            console.log('Exception in bwSlideSet.js.renderAndPopulateAttachments_ReadOnly: ' + e.message + ', ' + e.stack);

            //renderAndPopulateAttachments
            //$(this.element).find('#newrequestattachments')[0].innerHTML = 'Exception in bwSlideSet.renderAndPopulateAttachments_ReadOnly: ' + e.message + ', ' + e.stack;
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwSlideSet</span>';
            html += '<br />';
            html += '<span style="">Exception in bwSlideSet.js.renderAndPopulateAttachments_ReadOnly(): ' + e.message + ', ' + e.stack + '</span>';
            thiz.element.html(html);
        }
    },

    uploadAttachment: function (displayAttachmentsTagName, requestDialogId, folderName) { // $('.bwSlideSet').bwSlideSet('uploadAttachment','newrequestattachments', 'divCreateRequestFormContent', 'blahblah');
        try {
            console.log('In bwSlideSet.js.uploadAttachment(). folderName: ' + folderName); // attachmentsAreStoredInIndexDb: ' + this.options.attachmentsAreStoredInIndexDb + ', bwBudgetRequestId: ' + bwBudgetRequestId);

            if (folderName == this.options.elementIdSuffix) {

                var x = $('#inputFile_' + folderName)[0]; 
                var file = x.files; 
                if (!file) { // Don't like doing this but sometimes file is undefined... is this a race condition or a duplicate DOM element?? 6-23-2020

                    displayAlertDialog('There was an error attaching this file. Please try again.');

                } else {

                    if (file.size > 100000000) {

                        // Don't allow files over xxxMB.
                        this.displayAlertDialog('Currently the system does not allow files over 100MB.');
                        x.replaceWith($('#inputFile_' + folderName).clone()); // Clear the file upload box. May not work in all browsers doing it this way.

                    } else {

                        this.cmdDisplayConfirmFileUploadDialog(displayAttachmentsTagName, folderName, requestDialogId, x);
                        
                    }

                }

            }

        } catch (e) {
            console.log('Error in bwSlideSet.js.uploadAttachment(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Error in bwSlideSet.js.uploadAttachment(): ' + e.message + ', ' + e.stack);
            $(this.element).find('#newrequestattachments')[0].innerHTML = 'Exception in bwSlideSet.uploadAttachment: ' + e.message + ', ' + e.stack;
        }
    },
    uploadAttachment_subSlide: function (displayAttachmentsTagName, requestDialogId, folderName, fileId) { // fileName specifies which file this new file is a sub-slide of...
        try {
            console.log('In bwSlideSet.js.uploadAttachment_subSlide(). folderName: ' + folderName + ', fileId: ' + fileId);

            if (folderName == this.options.elementIdSuffix) {

                var x = $('#inputFile_subSlide_' + folderName + '_' + fileId)[0];
                var file = x.files;
                if (!file) { // Don't like doing this but sometimes file is undefined... is this a race condition or a duplicate DOM element?? 6-23-2020

                    displayAlertDialog('In uploadAttachment_subSlide(). There was an error attaching this file. Please try again.');

                } else {

                    if (file.size > 100000000) {
                        // Don't allow files over xxxMB.
                        displayAlertDialog('In uploadAttachment_subSlide(). Currently the system does not allow files over 100MB.');
                        x.replaceWith($('#inputFile_subSlide_' + folderName + '_' + fileId).clone()); // Clear the file upload box. May not work in all browsers doing it this way.
                    } else {

                        this.cmdDisplayConfirmFileUploadDialog_subSlide(displayAttachmentsTagName, folderName, requestDialogId, x, fileId);

                    }

                }

            }

        } catch (e) {
            console.log('Error in bwSlideSet.js.uploadAttachment_subSlide(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Error in bwSlideSet.js.uploadAttachment_subSlide(): ' + e.message + ', ' + e.stack);
        }
    },

    UploadButton_OnClick: function (elementIdSuffix) {
        try {
            console.log('In UploadButton_OnClick().');

            //this.processUpload(displayAttachmentsTagName, elementIdSuffix, file);
            this.processUpload('', elementIdSuffix, '');

        } catch (e) {
            console.log('Exception in UploadButton_OnClick(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in UploadButton_OnClick(): ' + e.message + ', ' + e.stack);
        }
    },
    CancelButton_OnClick: function () {
        $('#divConfirmFileUploadDialog_ForAttachments').dialog('close');
    },
    cmdDisplayConfirmFileUploadDialog: function (displayAttachmentsTagName, elementIdSuffix, requestDialogId, element) {
        try {
            console.log('In bwSlideSet.js.cmdDisplayConfirmFileUploadDialog().');
            var thiz = this;

            var dialogId = 'divConfirmFileUploadDialog_ForSlideshow';

            var div = document.getElementById(dialogId);
            if (!div) {

                console.log('In cmdDisplayConfirmFileUploadDialog(). adding element to the dom: ' + dialogId);

                div = document.createElement('div');
                div.id = dialogId;
                div.style.display = 'none';
                document.body.appendChild(div); // Place at end of document

                var html = '';

                html += '   <table style="width:100%;">';
                html += '       <tr>';
                html += '           <td style="width:90%;">';
                html += '               <span id="spanConfirmFileUploadDialogTitle" style="color: #3f3f3f;font-size: 60pt;font-weight:bold;">';
                html += '                   Select the \'Upload\' button...';
                html += '               </span>';
                html += '           </td>';
                html += '           <td style="width:9%;"></td>';
                html += '           <td style="width:1%;cursor:pointer;vertical-align:top;">';
                html += '               <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 120pt;font-weight:bold;" onclick="$(\'#divConfirmFileUploadDialog_ForAttachments\').dialog(\'close\');">X</span>';
                html += '           </td>';
                html += '       </tr>';
                html += '   </table>';
                html += '   <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
                html += '   <br /><br />';
                html += '   <span style="font-style:italic;color:gray;font-size:15pt;">The file name and description are not required because they can be changed later on.' + '<br />xcx66574</span>';
                html += '   <br /><br />';
                html += '   <img id="divConfirmFileUploadDialog_ForSlideshow_ImagePreview" src="#" alt="your image" />';
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
                html += '   <div id="btnUploadTheFileNow" class="divDialogButton" title="Click here to upload the attachment.">'; 
                html += '       Upload';
                html += '   </div>';
                html += '   <br /><br />';
                html += '   <div id="btnCancelUploadTheFileNow" class="divDialogButton" onclick="$(\'.bwAttachments\').bwAttachments(\'CancelButton_OnClick\');">';
                html += '       Cancel';
                html += '   </div>';

                div.innerHTML = html;
            }

            var imagePreviewElement = document.getElementById('divConfirmFileUploadDialog_ForSlideshow_ImagePreview');

            $(imagePreviewElement).src = '';
           
            // Populate the filename text box!
            var x = element;
            var file = x.files[0];
            var originalFilename = file.name.trim().split('.')[0];

            // 1-11-2022
            var tempFilename = $('#' + dialogId).find('#txtConfirmFileUploadDialogFilename');
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
            $('#' + dialogId).find('#txtConfirmFileUploadDialogFileDescription')[0].innerHTML = ''; //'xcx32467';

            $('#' + dialogId).dialog({
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
                            $('#' + dialogId).dialog('close');
                        });

                        // 1-24-2020 ToDo: Display the image prior to uploading!
                        var x = document.getElementById('inputFile_' + elementIdSuffix); // This element is on the request form with the "Choose File" button, not the attachments dialog.
                        var file = x.files[0];

                        //
                        // First get the dimensions of the image.
                        var _URL = window.URL || window.webkitURL;
                        var img;
                        img = new Image();
                        var objectUrl = _URL.createObjectURL(file);
                        img.onload = function () {
                            try {
                               
                                _URL.revokeObjectURL(objectUrl);

                                if (this.width < 50 || this.height < 50) {
                                    $('#' + dialogId).dialog('close');
                                    alert('The image must be a 50px square. This image is too small.');
                                } else {
                                    // Now display it.
                                    var reader = new FileReader();
                                    reader.onload = function (e) {
                                        try {

                                            $('#divConfirmFileUploadDialog_ForSlideshow_ImagePreview').attr('src', e.target.result);
                                            $('#divConfirmFileUploadDialog_ForSlideshow_ImagePreview').attr('style', 'width:400px;'); // 3-12-2022 only specify 1 dimension so that the image is not distorted. // height:400px;');

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

                                var description = $('#divConfirmFileUploadDialog_ForSlideshow').find('#txtConfirmFileUploadDialogFileDescription').val();

                                $('#' + dialogId).dialog('close');
 
                                thiz.processUpload(displayAttachmentsTagName, elementIdSuffix, file, description);

                            } catch (e) {
                                console.log('Exception in btnUploadTheFileNow.click(): ' + e.message + ', ' + e.stack);
                                displayAlertDialog('Exception in btnUploadTheFileNow.click(): ' + e.message + ', ' + e.stack);
                            }
                        });

                    } catch (e) {
                        console.log('Exception in cmdDisplayConfirmFileUploadDialog.divConfirmFileUploadDialog.open(): ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in cmdDisplayConfirmFileUploadDialog.divConfirmFileUploadDialog.open(): ' + e.message + ', ' + e.stack);
                    }
                }, // This allows the dialog to close when clicked outside of the dialog. Only works for modal dialogs.
                close: function () {
                    $(this).dialog('destroy'); // 7-5-2020 THIS IS THE PREFFERED SYNTAX FOR THIS FROM NOW ON!!!!!!!!!!!!!!!!!!!!!!!!!!!! REPLACE EVERYWHERE AND TEST!!!!!!!!!!
                }
                
            });

            // Hide the title bar.
            $('#' + dialogId).dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
            
        } catch (e) {
            console.log('Exception in bwSlideSet.js.cmdDisplayConfirmFileUploadDialog(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwSlideSet.js.cmdDisplayConfirmFileUploadDialog(): ' + e.message + ', ' + e.stack);
        }
    },
    cmdDisplayConfirmFileUploadDialog_subSlide: function (displayAttachmentsTagName, elementIdSuffix, requestDialogId, element, fileId) {
        try {
            console.log('In bwSlideSet.js.cmdDisplayConfirmFileUploadDialog_subSlide().');
            //alert('In bwSlideSet.js.cmdDisplayConfirmFileUploadDialog_subSlide().');
            var thiz = this;

            var dialogId = 'divConfirmFileUploadDialog_ForSlideshow_subSlide';

            var div = document.getElementById(dialogId);
            if (!div) {

                console.log('In cmdDisplayConfirmFileUploadDialog_subSlide(). adding element to the dom: ' + dialogId);

                div = document.createElement('div');
                div.id = dialogId;
                div.style.display = 'none';
                document.body.appendChild(div); // Place at end of document

                var html = '';

                html += '   <table style="width:100%;">';
                html += '       <tr>';
                html += '           <td style="width:90%;">';
                html += '               <span id="spanConfirmFileUploadDialogTitle_subSlide" style="color: #3f3f3f;font-size: 60pt;font-weight:bold;">';
                html += '                   Select the \'Upload\' button...';
                html += '               </span>';
                html += '           </td>';
                html += '           <td style="width:9%;"></td>';
                html += '           <td style="width:1%;cursor:pointer;vertical-align:top;">';
                html += '               <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 120pt;font-weight:bold;" onclick="$(\'#divConfirmFileUploadDialog_ForSlideshow_subSlide\').dialog(\'close\');">X</span>';
                html += '           </td>';
                html += '       </tr>';
                html += '   </table>';
                html += '   <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
                html += '   <br /><br />';
                html += '   <span style="font-style:italic;color:gray;font-size:15pt;">The file name and description are not required because they can be changed later on.' + '<br />xcx66574</span>';
                html += '   <br /><br />';
                html += '   <img id="divConfirmFileUploadDialog_ForSlideshow_subSlide_ImagePreview" src="#" alt="your image" />';
                html += '   <table>';
                html += '       <tr>';
                html += '           <td><span style="font-style:italic;color:gray;font-size:20pt;">file name:</span></td>';
                html += '           <td>';
                html += '               <input type="text" id="txtConfirmFileUploadDialogFilename_subSlide" style="width:380px;font-size:20pt;" />&nbsp;<span style="font-style:italic;font-size:11pt;color:gray;">';
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
                html += '           <td><textarea id="txtConfirmFileUploadDialogFileDescription_subSlide" style="overflow:hidden;font-size:20pt;" rows="4" cols="30"></textarea></td>';
                html += '       </tr>';
                html += '   </table>';
                html += '   <div id="btnUploadTheFileNow_subSlide" class="divDialogButton" title="Click here to upload the attachment.">'; // onclick="$(\'.bwSlideSet\').bwSlideSet(\'UploadButton_OnClick\', \'' + elementIdSuffix + '\');">';
                html += '       Upload';
                html += '   </div>';
                html += '   <br /><br />';
                html += '   <div id="btnCancelUploadTheFileNow" class="divDialogButton" onclick="$(\'.bwAttachments\').bwAttachments(\'CancelButton_OnClick\');">';
                html += '       Cancel';
                html += '   </div>';

                div.innerHTML = html;
            }

            var imagePreviewElement = document.getElementById('divConfirmFileUploadDialog_ForSlideshow_subSlide_ImagePreview');

            $(imagePreviewElement).src = '';

            // Populate the filename text box!
            var x = element;
            var file = x.files[0];
            var originalFilename = file.name.trim().split('.')[0];


            // 1-11-2022
            var tempFilename = $('#' + dialogId).find('#txtConfirmFileUploadDialogFilename_subSlide');
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
            $('#' + dialogId).find('#txtConfirmFileUploadDialogFileDescription_subSlide')[0].innerHTML = ''; //'xcx32467';

            $('#' + dialogId).dialog({
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
                            $('#' + dialogId).dialog('close');
                        });


                        //alert('xcx234324: ' + thiz.options.elementIdSuffix);

                        // 1-24-2020 ToDo: Display the image prior to uploading!
                        var x = document.getElementById('inputFile_subSlide_' + elementIdSuffix + '_' + fileId); // This element is on the request form with the "Choose File" button, not the attachments dialog.
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
                                    $('#' + dialogId).dialog('close');
                                    //alert('The image must be a 400px square. This image is too small.');
                                    alert('The image must be a 50px square. This image is too small.');
                                } else {
                                    // Now display it.
                                    var reader = new FileReader();
                                    reader.onload = function (e) {
                                        try {

                                            $('#divConfirmFileUploadDialog_ForSlideshow_subSlide_ImagePreview').attr('src', e.target.result);
                                            $('#divConfirmFileUploadDialog_ForSlideshow_subSlide_ImagePreview').attr('style', 'width:400px;'); // 3-12-2022 only specify 1 dimension so that the image is not distorted. // height:400px;');

                                        } catch (e) {
                                            console.log('Exception in cmdDisplayConfirmFileUploadDialog_subSlide.divConfirmFileUploadDialog.open.img.onload.reader.onload(): ' + e.message + ', ' + e.stack);
                                            displayAlertDialog('Exception in cmdDisplayConfirmFileUploadDialog_subSlide.divConfirmFileUploadDialog.open.img.onload.reader.onload(): ' + e.message + ', ' + e.stack);
                                        }
                                    }
                                    reader.readAsDataURL(file);
                                }
                            } catch (e) {
                                console.log('Exception in cmdDisplayConfirmFileUploadDialog_subSlide.divConfirmFileUploadDialog.open.img.onload(): ' + e.message + ', ' + e.stack);
                                displayAlertDialog('Exception in cmdDisplayConfirmFileUploadDialog_subSlide.divConfirmFileUploadDialog.open.img.onload(): ' + e.message + ', ' + e.stack);
                            }
                        };
                        img.src = objectUrl;


                        //
                        // ADD THE BUTTON ONCLICK EVENTS HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! Then we have access to displayAttachmentsTagName etc. 2-4-2022
                        //

                        $('#btnUploadTheFileNow_subSlide').off('click').click(function () {
                            try {
                                console.log('In UploadButton_OnClick().');

                                var description = $('#divConfirmFileUploadDialog_ForSlideshow_subSlide').find('#txtConfirmFileUploadDialogFileDescription_subSlide').val();

                                $('#' + dialogId).dialog('close');

                                thiz.processUpload_subSlide(displayAttachmentsTagName, elementIdSuffix, file, description, fileId);

                            } catch (e) {
                                console.log('Exception in btnUploadTheFileNow_subSlide.click(): ' + e.message + ', ' + e.stack);
                                displayAlertDialog('Exception in btnUploadTheFileNow_subSlide.click(): ' + e.message + ', ' + e.stack);
                            }
                        });

                    } catch (e) {
                        console.log('Exception in cmdDisplayConfirmFileUploadDialog_subSlide.divConfirmFileUploadDialog.open(): ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in cmdDisplayConfirmFileUploadDialog_subSlide.divConfirmFileUploadDialog.open(): ' + e.message + ', ' + e.stack);
                    }
                }, // This allows the dialog to close when clicked outside of the dialog. Only works for modal dialogs.
                close: function () {
                    $(this).dialog('destroy'); // 7-5-2020 THIS IS THE PREFFERED SYNTAX FOR THIS FROM NOW ON!!!!!!!!!!!!!!!!!!!!!!!!!!!! REPLACE EVERYWHERE AND TEST!!!!!!!!!!
                }

            });

            // Hide the title bar.
            $('#' + dialogId).dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

        } catch (e) {
            console.log('Exception in bwSlideSet.js.cmdDisplayConfirmFileUploadDialog_subSlide(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwSlideSet.js.cmdDisplayConfirmFileUploadDialog_subSlide(): ' + e.message + ', ' + e.stack);
        }
    },
    processUpload_subSlide: function (displayAttachmentsTagName, elementIdSuffix, file, description, fileId) {
        try {
            console.log('In bwSlideSet.js.processUpload_subSlide(). description: ' + description);
            //alert('In bwSlideSet.js.processUpload_subSlide(). description: ' + description);
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

                if (filename.indexOf('.xml') > 0) {
                    // XML files add 3 characters to the start of the file when using readAsArrayBuffer, so using readAsText instead!
                    var reader = new FileReader();
                    reader.onload = function (event) {
                        var fileData = reader.result;
                        //displayAlertDialog('fileData prior to ws call:' + fileData);
                        //debugger;
                        thiz.performUpload_subSlide(fileData, filename, displayAttachmentsTagName, elementIdSuffix, description, fileId); // _budgetRequestId);
                    };
                    reader.readAsText(file);
                } else {

                    console.log('In bwSlideSet.js.processUpload_subSlide(). xcx1');

                    thiz.performUpload_subSlide(fileData, filename, displayAttachmentsTagName, elementIdSuffix, description, fileId);

                }

            }
        } catch (e) {
            console.log('In processUpload_subSlide() catch for second attempt...: ' + e.message + ', ' + e.stack);
            try {
                //displayAlertDialog('bw.initar.ore.js.ProcessUpload():2');
                // this section is here to support older IE browsers.
                //var filePath = f:\oo.txt;
                var fso = new ActiveXObject("Scripting.FileSystemObject");
                var textStream = fso.OpenTextFile(fileInput);
                var fileData = file.ReadAll();

                // once we have the file perform the actual upload
                debugger; // TODD: Do we ever get here? does this even work?
                thiz.performUpload(fileData);
            } catch (e2) {
                try {
                    $('#divWorkingOnItDialog').dialog('close'); // Close the create your account dialog.
                } catch (e) { }
                displayAlertDialog('Exception in processUpload_subSlide(): Uploading files doesn\'t seem to be supported in your browser: ' + e2.number + ': ' + e2.message);
            }
        }
    },

    processUpload: function (displayAttachmentsTagName, elementIdSuffix, file, description) {
        try {
            console.log('In bwSlideSet.js.processUpload(). description: ' + description);
            var thiz = this;

            if (!file || file.length == 0) {
                displayAlertDialog('There was an error. Zero files returned.');
            } else {
                // Check if the user specified a new filename. If so, make sure the file extension is the same!
                var originalFilename = file.name;
                var filename = file.name;
 
                var filenameElement = $(this.element).find('#txtConfirmFileUploadDialogFilename');
                if (filenameElement && filenameElement.value && filenameElement.value.trim().length > 1) {
                    filename = filenameElement.value.trim().split('.')[0] + '.' + originalFilename.split('.')[1]; // Put the same extension on it.
                }

                if (filename.indexOf('.xml') > 0) {
                    // XML files add 3 characters to the start of the file when using readAsArrayBuffer, so using readAsText instead!
                    var reader = new FileReader();
                    reader.onload = function (event) {
                        var fileData = reader.result;
                        thiz.performUpload(fileData, filename, displayAttachmentsTagName, elementIdSuffix); 
                    };
                    reader.readAsText(file);
                } else {

                    console.log('In bwSlideSet.js.processUpload(). xcx1');
                    thiz.performUpload(fileData, filename, displayAttachmentsTagName, elementIdSuffix, description);
                   
                }

            }
        } catch (e) {
            console.log('In processUpload() catch for second attempt...: ' + e.message + ', ' + e.stack);
            try {
                // this section is here to support older IE browsers.
                var fso = new ActiveXObject("Scripting.FileSystemObject");
                var textStream = fso.OpenTextFile(fileInput);
                var fileData = file.ReadAll();

                // once we have the file perform the actual upload
                debugger; // TODD: Do we ever get here? does this even work?
                thiz.performUpload(fileData);
            } catch (e2) {
                try {
                    $('#divWorkingOnItDialog').dialog('close'); // Close the create your account dialog.
                } catch (e) { }
                thiz.displayAlertDialog('Exception in processUpload(): Uploading files doesn\'t seem to be supported in your browser: ' + e2.number + ': ' + e2.message);
            }
        }
    },
    performUpload: function (fileData, filename, displayAttachmentsTagName, elementIdSuffix, description) {
        try {
            console.log('In bwSlideSet.js.performUpload().');
            var thiz = this;

            var largeFileUploadEnabled = $('.bwAuthentication').bwAuthentication('option', 'largeFileUploadEnabled');

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
            var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

            //var description = '';
            //var descriptionElement = $(this.element).find('#txtConfirmFileUploadDialogFileDescription');
            //if (descriptionElement && descriptionElement.innerHTML && descriptionElement.innerHTML.trim().length > 1) {
            //    description = descriptionElement.innerHTML.trim();
            //}

            var size = 0;
            var fileElementId = 'inputFile_' + elementIdSuffix;
            var fileElement = $('#' + fileElementId)[0];
            if (fileElement && fileElement.files && fileElement.files[0] && fileElement.files[0].size) {
                size = fileElement.files[0].size;
            }
            console.log('size: ' + size + ', fileElement: ' + fileElement);

            if (!size) {
                //alert('xcx1234234 size: ' + size);
                alert('fileElement: ' + JSON.stringify(fileElement));
                console.log('fileElement: ' + JSON.stringify(fileElement));
                debugger;
            }

            // 2-4-2022
            console.log('In bwSlideSet.js.performUpload(). workflowAppId: ' + workflowAppId + ', elementIdSuffix: ' + elementIdSuffix);

            var elementId = 'uploadForm_' + elementIdSuffix;
            var element = $('#' + elementId)[0];
            var formData = new FormData(element);

            // It is important to prepend these values, so that they get read immediately and not be undefined in the web service.
            //formData.set('bwWorkflowAppId', workflowAppId);
            //alert('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>In bwSlideSet.js.performUpload(). SETTING formData(elementIdSuffix): ' + elementIdSuffix);

            //var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            //    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            //    return v.toString(16);
            //});

            formData.set('elementIdSuffix', elementIdSuffix);
            formData.set('bwParticipantId', participantId);
            formData.set('bwParticipantEmail', participantEmail);
            formData.set('bwParticipantFriendlyName', participantFriendlyName);
            formData.set('Filename', filename);
            formData.set('HeaderText', ''); //'xcx123436464-1');
            formData.set('Description', ''); //'xcx123436464-1'); // description);
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
                    xhrAbortMessage = 'The file upload has stalled for ' + String(Number(fileUploadTimer_Interval) / 1000) + ' seconds. The upload has been cancelled. Unknown error.';
                    xhr.abort();

                    console.log('');
                    console.log(xhrAbortMessage);
                    console.log('');

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

                var operationUri = this.options.operationUriPrefix + '_files/' + 'uploadhomepageslide';
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

                                    console.log('');
                                    console.log('progress ' + Math.round(percentComplete) + '% elementIdSuffix: ' + elementIdSuffix);
                                    console.log('');

                                }
                            }, false);

                            xhr.upload.addEventListener("loadstart", function (evt) {
                                console.log('');
                                console.log('loadstart elementIdSuffix: ' + elementIdSuffix);
                                console.log('');

                            }, false);

                            xhr.upload.addEventListener("abort", function (evt) {

                                console.log('');
                                console.log('abort message: ' + xhrAbortMessage + ',  elementIdSuffix: ' + elementIdSuffix);
                                console.log('');

                            }, false);

                            xhr.upload.addEventListener("error", function (evt) {

                                console.log('');
                                console.log('error elementIdSuffix: ' + elementIdSuffix);
                                console.log('');

                                displayAlertDialog('error');

                            }, false);

                            xhr.upload.addEventListener("load", function (evt) {
                                console.log('');
                                console.log('load elementIdSuffix: ' + elementIdSuffix);
                                console.log('');

                                console.log('The file has uploaded successfully. Or has it? xcx2134124. evt: ' + JSON.stringify(evt));

                                clearInterval(fileUploadTimer);
                                fileUploadTimer = 'stopped';

                            }, false);

                            xhr.upload.addEventListener("timeout", function (evt) {

                                console.log('');
                                console.log('timeout elementIdSuffix: ' + elementIdSuffix);
                                console.log('');

                                displayAlertDialog('timeout');

                            }, false);

                            xhr.upload.addEventListener("loadend", function (evt) {
                                console.log('');
                                console.log('loadend elementIdSuffix: ' + elementIdSuffix);
                                console.log('');

                                HideActivitySpinner_FileUpload();

                            }, false);

                            return xhr;
                        } catch (e) {

                            console.log('');
                            console.log('Exception in POST uploadattachment_large.ajax.xhr(). elementIdSuffix: ' + elementIdSuffix + ', ' + e.message + ', ' + e.stack);
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
                        console.log('POST success elementIdSuffix: ' + elementIdSuffix);
                        console.log('');

                        displayAlertDialog('The file has uploaded successfully.'); // data: ' + JSON.stringify(data));

                        if (data.result == 'SLIDE_SAVED') {

                            displayAlertDialog('The file has uploaded successfully.');
                            $('.bwSlideshowAdmin').bwSlideshowAdmin('loadFoldersAndFiles'); // Reload and redraw.

                        } else {

                            displayAlertDialog(data.message);
                        }

                    },
                    error: function (e) {
                        HideActivitySpinner();
                        if (xhrAbortMessage && xhrAbortMessage != '') {
                            // This means we intentionally aborted.
                            console.log('');
                            console.log('POST error. Intentional abort: ' + xhrAbortMessage);
                            console.log('');

                            displayAlertDialog('POST error. Intentional abort: ' + xhrAbortMessage);

                        } else {
                            // It was unexpected.
                            console.log('');
                            console.log('POST error. Unexpected error: ' + JSON.stringify(e));
                            console.log('');

                            console.log('There was an unexpected error saving the slide. xcx32345346.');
                            displayAlertDialog('There was an unexpected error saving the slide. xcx32345346.');

                        }
                    }
                });
            }

        } catch (e) {
            console.log('Exception in bwSlideSet.js.performUpload(): ' + e.message + ', ' + e.stack);
            $(this.element).find('#newrequestattachments')[0].innerHTML = 'Exception in bwSlideSet.performUpload(): ' + e.message + ', ' + e.stack;
            displayAlertDialog('Exception in bwSlideSet.js.performUpload(): ' + e.message + ', ' + e.stack);
        }
    },
    performUpload_subSlide: function (fileData, filename, displayAttachmentsTagName, folderName, description, MasterSlide_FileId) {
        try {
            console.log('In bwSlideSet.js.performUpload_subSlide().');
            //alert('>>>In bwSlideSet.js.performUpload_subSlide(). folderName: ' + folderName + ', fileId: ' + fileId);
            var thiz = this;


            var largeFileUploadEnabled = $('.bwAuthentication').bwAuthentication('option', 'largeFileUploadEnabled');

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
            var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

            //var description = '';
            //var descriptionElement = $(this.element).find('#txtConfirmFileUploadDialogFileDescription');
            //if (descriptionElement && descriptionElement.innerHTML && descriptionElement.innerHTML.trim().length > 1) {
            //    description = descriptionElement.innerHTML.trim();
            //}

            var size = 0;
            var fileElementId = 'inputFile_subSlide_' + folderName + '_' + MasterSlide_FileId;
            var fileElement = $('#' + fileElementId)[0];
            if (fileElement && fileElement.files && fileElement.files[0] && fileElement.files[0].size) {
                size = fileElement.files[0].size;
            }
            console.log('size: ' + size + ', fileElement: ' + fileElement);

            if (!size) {
                //alert('xcx1234234 size: ' + size);
                alert('fileElement: ' + JSON.stringify(fileElement));
                console.log('fileElement: ' + JSON.stringify(fileElement));
                debugger;
            }

            // 2-4-2022
            console.log('In bwSlideSet.js.performUpload_subSlide(). workflowAppId: ' + workflowAppId + ', folderName: ' + folderName + ', MasterSlide_FileId: ' + MasterSlide_FileId);

            var elementId = 'uploadForm_subSlide_' + folderName + '_' + MasterSlide_FileId;
            var element = $('#' + elementId)[0];
            var formData = new FormData(element);

            // It is important to prepend these values, so that they get read immediately and not be undefined in the web service.
            //formData.set('bwWorkflowAppId', workflowAppId);
            //alert('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>In performUpload_subSlide(). SETTING formData(elementIdSuffix): ' + elementIdSuffix);

            //var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            //    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            //    return v.toString(16);
            //});

            console.log('>>>In bwSlideSet.js.performUpload_subSlide(). Setting MasterSlide_FileId: ' + MasterSlide_FileId + ', folderName: ' + folderName);
            //alert('>>>In bwSlideSet.js.performUpload_subSlide(). Setting MasterSlide_FileId: ' + MasterSlide_FileId + ', folderName: ' + folderName);

            formData.set('elementIdSuffix', folderName);
            formData.set('MasterSlide_FileId', MasterSlide_FileId);
            formData.set('bwParticipantId', participantId);
            formData.set('bwParticipantEmail', participantEmail);
            formData.set('bwParticipantFriendlyName', participantFriendlyName);
            formData.set('Filename', filename);
            //formData.set('Description', description);
            formData.set('HeaderText', ''); //'xcx123436464-2');
            formData.set('Description', ''); //'xcx123436464-2'); // description);
            formData.set('Size', size);
            //formData.set('FileId', guid);

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
                    xhrAbortMessage = 'The file upload has stalled for ' + String(Number(fileUploadTimer_Interval) / 1000) + ' seconds. The upload has been cancelled. Unknown error.';
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

                //var operationUri = this.options.operationUriPrefix + '_files/' + 'uploadattachment_large';
                var operationUri = this.options.operationUriPrefix + '_files/' + 'uploadhomepageslide_subslide';
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
                                    console.log('progress ' + Math.round(percentComplete) + '% folderName: ' + folderName);
                                    console.log('');

                                }
                            }, false);

                            xhr.upload.addEventListener("loadstart", function (evt) {
                                console.log('');
                                console.log('loadstart folderName: ' + folderName);
                                console.log('');

                                //displayAlertDialog('loadstart');

                            }, false);

                            xhr.upload.addEventListener("abort", function (evt) {

                                console.log('');
                                console.log('abort message: ' + xhrAbortMessage + ',  folderName: ' + folderName);
                                console.log('');

                                //alert('abort message: ' + evt.message);

                            }, false);

                            xhr.upload.addEventListener("error", function (evt) {

                                console.log('');
                                console.log('error folderName: ' + folderName);
                                console.log('');

                                displayAlertDialog('error');

                            }, false);

                            xhr.upload.addEventListener("load", function (evt) {
                                console.log('');
                                console.log('load folderName: ' + folderName);
                                console.log('');


                                console.log('The file has uploaded successfully. Or has it? xcx2134124. evt: ' + JSON.stringify(evt));
                                //console.log('The file has uploaded successfully.');

                                clearInterval(fileUploadTimer);
                                fileUploadTimer = 'stopped';

                                // Now we need to redraw this bwSLideSet widget so that it displays the latest uploaded slide.

                                //alert('In bwSlideSet.js.performUpload_subSlide.uploadhomepageslide.load(). Now we need to redraw this bwSLideSet widget so that it displays the latest uploaded slide.');




                            }, false);

                            xhr.upload.addEventListener("timeout", function (evt) {

                                console.log('');
                                console.log('timeout folderName: ' + folderName);
                                console.log('');


                                displayAlertDialog('timeout');

                            }, false);

                            xhr.upload.addEventListener("loadend", function (evt) {
                                console.log('');
                                console.log('loadend folderName: ' + folderName);
                                console.log('');

                                HideActivitySpinner_FileUpload();

                                //displayAlertDialog('loadend');

                            }, false);

                            return xhr;
                        } catch (e) {

                            console.log('');
                            console.log('Exception in POST uploadattachment_large.ajax.xhr(). folderName: ' + folderName + ', ' + e.message + ', ' + e.stack);
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
                        console.log('POST success folderName: ' + folderName);
                        console.log('');



                        displayAlertDialog('The file has uploaded successfully.'); // data: ' + JSON.stringify(data));
                        $('.bwSlideshowAdmin').bwSlideshowAdmin('loadFoldersAndFiles'); // Reload and redraw.
                        //HideActivitySpinner(); 8-6-2022

                        if (data.result == 'SUCCESS') {
                            // Do nothing.

                            //alert('xcx2143234215');
                            thiz.populateAttachments(workflowAppId, folderName, displayAttachmentsTagName, true); // This lists the attachments in the <p> tag with id='attachments'.


                        } else if (data.result == 'NO_REQUEST_SAVED') {

                            // This means it must have been the first attachment uploaded for a new request. In this case, we will call back to the server and create the new request, so that it is not lost.
                            //alert('xcx2143234215 This means it must have been the first attachment uploaded for a new request.');

                            console.log('');
                            console.log('xcx2143234215 This means it must have been the first attachment uploaded for a new request. In this case, we will call back to the server and create the new request, so that it is not lost. Calling bwRequest.js.saveAndPublishTheRequest().');
                            console.log('');

                            var bwRequestTypeId = $('#' + 'divPageContent1').find('#budgetrequestform')[0].getAttribute('bwrequesttypeid');
                            $('.bwRequest').bwRequest('saveAndPublishTheRequest', 'divPageContent1', true, folderName, bwRequestTypeId);

                            thiz.populateAttachments(workflowAppId, folderName, displayAttachmentsTagName, true); // This lists the attachments in the <p> tag with id='attachments'.

                        } else {

                            //$('.bwSlideSet').bwSlideSet('renderAndPopulateAttachments'); // displayAttachmentsTagName

                            displayAlertDialog(data.message);
                        }

                    },
                    error: function (e) {
                        HideActivitySpinner();
                        if (xhrAbortMessage && xhrAbortMessage != '') {
                            // This means we intentionally aborted.
                            console.log('');
                            console.log('POST error. Intentional abort: ' + xhrAbortMessage);
                            console.log('');

                            alert('POST error. Intentional abort: ' + xhrAbortMessage + ', folderName: ' + folderName);

                        } else {
                            // It was unexpected.
                            console.log('');
                            console.log('POST error. Unexpected error: ' + JSON.stringify(e));
                            console.log('');

                            alert('POST error. folderName: ' + folderName + ', Unexpected error: ' + JSON.stringify(e)); //e.responseText)

                        }
                    }
                });
            }

        } catch (e) {
            console.log('Exception in bwSlideSet.js.performUpload_subSlide(): ' + e.message + ', ' + e.stack);
            $(this.element).find('#newrequestattachments')[0].innerHTML = 'Exception in bwSlideSet.performUpload_subSlide(): ' + e.message + ', ' + e.stack;
            displayAlertDialog('Exception in bwSlideSet.js.performUpload_subSlide(): ' + e.message + ', ' + e.stack);
        }
    },

    //populateAttachments: function (bwWorkflowAppId, _budgetRequestId, attachmentsTagId, showRemoveAttachmentButton, requestDialogId) {
    //    try {
    //        console.log('In bwSlideSet.js.populateAttachments().); // _budgetRequestId: ' + _budgetRequestId);
    //        //alert('In bwSlideSet.js.populateAttachments(). _budgetRequestId: ' + _budgetRequestId);
    //        var thiz = this;

    //        //alert('In populateAttachments(). attachmentsTagId: ' + attachmentsTagId);

    //        //if (!attachmentsTagId) {
    //        //    if (document.getElementById('newrequestattachments')) {
    //        //        attachmentsTagId = 'attachmentsTagId';
    //        //    }
    //        //}

    //        //alert('In populateAttachments(). attachmentsTagId: ' + attachmentsTagId);

    //        var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

    //        $(this.element).find('#newrequestattachments')[0].innerHTML = '<span style="font-style:italic;font-size:8pt;">There are no attachments</span>';

    //        var bwBudgetRequestId = $(this.element).closest('#budgetrequestform')[0].getAttribute('bwbudgetrequestid');
    //        if (!bwBudgetRequestId) {
    //            console.log('ERROR IN bwSlideSet.js.populateAttachments(). Unexpected value for bwBudgetRequestId: ' + bwBudgetRequestId);
    //            displayAlertDialog('ERROR IN bwSlideSet.js.populateAttachments(). Unexpected value for bwBudgetRequestId: ' + bwBudgetRequestId);
    //        } else {



    //            console.log('In populateAttachments(). workflowAppId: ' + workflowAppId + ', bwBudgetRequestId: ' + bwBudgetRequestId + ', attachmentsTagId: ' + attachmentsTagId + ', showRemoveAttachmentButton: ' + showRemoveAttachmentButton + ').');
    //            //alert('In populateAttachments(). workflowAppId: ' + workflowAppId + ', bwBudgetRequestId: ' + bwBudgetRequestId + ', attachmentsTagId: ' + attachmentsTagId + ', showRemoveAttachmentButton: ' + showRemoveAttachmentButton + ').');

    //            //debugger;
    //            // removed 1-11-2022 // var operationUri = this.options.operationUriPrefix + '_files/' + 'getlistofattachmentsforbudgetrequest/' + workflowAppId + '/' + bwBudgetRequestId; // _files allows us to use nginx to route these to a dedicated file server.

    //            var operationUri = globalUrlPrefix + globalUrlForWebServices + '/_files/' + 'getlistofattachmentsforbudgetrequest/' + workflowAppId + '/' + bwBudgetRequestId;
    //            $.ajax({
    //                url: operationUri,
    //                method: "GET",
    //                timeout: 15000, // This is done because file services may need more time. 
    //                headers: { "Accept": "application/json; odata=verbose" },
    //                success: function (data) {
    //                    try {
    //                        //debugger;
    //                        //alert('data: ' + JSON.stringify(data));
    //                        if (!data) {
    //                            $(thiz.element).find('#newrequestattachments')[0].innerHTML = '<span style="color:tomato;">[Unexpected response from the file server]</span>';
    //                        } else if (data.code == 'ENOENT') {
    //                            // No such file or directory

    //                            console.log('[Server response: No such file or directory: ' + data.path + ']. This is probably Ok.?');

    //                        } else if (data && data.length > 0) {

    //                            $(thiz.element).find('#newrequestattachments')[0].innerHTML = ''; // It worked, and here were attachments, so get rid of the message.

    //                            // There are attachments, so display the button.
    //                            var requestDialogId = 'divRequestFormDialog_' + bwBudgetRequestId;
    //                            var buttonId = requestDialogId + '_buttonEmailAttachmentsExternally'; // eg: divRequestFormDialog_c8704c8c-8128-4600-a4fd-1ff30220e2ed_buttonEmailAttachmentsExternally
    //                            if (document.getElementById(buttonId) && document.getElementById(buttonId).style && document.getElementById(buttonId).style.display) {
    //                                document.getElementById(buttonId).style.display = 'inline';
    //                            }

    //                            //
    //                            // Display the image thumbnail.
    //                            //
    //                            var displayImageThumbnail = function (imgId, thumbnailUrl) {
    //                                $.get(thumbnailUrl).done(function () {
    //                                    var img = new Image();
    //                                    img.src = thumbnailUrl;
    //                                    img.onload = function (e) {
    //                                        try {
    //                                            document.getElementById(imgId).src = thumbnailUrl; // There is a thumbnail, so display it.
    //                                        } catch (e) {
    //                                            document.getElementById(imgId).src = globalUrlPrefix + globalUrl + '/images/mp4.jfif'; // There is no thumbnail, so display the icon.
    //                                        }
    //                                    }
    //                                }).fail(function () {
    //                                    document.getElementById(imgId).src = globalUrlPrefix + globalUrl + '/images/mp4.jfif'; // There is no thumbnail, so display the icon.
    //                                });
    //                            }

    //                            for (var i = 0; i < data.length; i++) {

    //                                //Filename: filename,
    //                                //Description: description

    //                                var filename = data[i].Filename;
    //                                if (filename.indexOf('_thumbnail_') > -1) {
    //                                    //
    //                                    // This is a thumbnail. Do not display as an attachment.
    //                                    //
    //                                } else {
    //                                    // This is an actual attachment. Display it!
    //                                    var description = data[i].Description;
    //                                    var size = data[i].Size;
    //                                    if (size.toLowerCase() != 'na') {
    //                                        size = (Number(size) / 1000000).toFixed(1);
    //                                    }

    //                                    console.log('In populateAttachments(). description: ' + description);

    //                                    var fileUrl = "_files/" + workflowAppId + "/" + bwBudgetRequestId + "/" + filename;

    //                                    // Centered on the screen.
    //                                    var width = 800;
    //                                    var height = 600;
    //                                    var left = (screen.width - width) / 2;
    //                                    var top = (screen.height - height) / 2;

    //                                    var html = '';

    //                                    html += '<table style="width:100%;">';
    //                                    html += '  <tr>';
    //                                    html += '    <td style="width:10%;">';



    //                                    var extensionIndex = filename.split('.').length - 1;
    //                                    var fileExtension = filename.toLowerCase().split('.')[extensionIndex];
    //                                    //alert('filename: ' + filename + ', fileExtension: ' + fileExtension);
    //                                    if (fileExtension == 'png' || fileExtension == 'jpg' || fileExtension == 'jpeg' || fileExtension == 'jfif' || fileExtension == 'webp' || fileExtension == 'gif') {
    //                                        //debugger;
    //                                        html += '<img id="attachmentstest1"  src="' + thiz.options.operationUriPrefix + fileUrl + '" style="height:120px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;" alt="" ';
    //                                        if (Platform == 'IOS8') {
    //                                            html += 'onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');"';
    //                                        } else {
    //                                            html += 'onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');" ';
    //                                        }
    //                                        html += ' />';
    //                                    } else if (fileExtension == 'xlsx' || fileExtension == 'xls') {
    //                                        //html += '<img src="images/excelicon.png" style="width:100px;height:46px;" />';
    //                                        // We need an if statement here to choose between iOS and Windows.
    //                                        if (Platform == 'IOS8') {
    //                                            html += '<img src="images/excelicon.png" style="width:100px;cursor:pointer;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');" />';
    //                                            //html += '<div class="attachmentsSectionFileLink" style="height:50px;border:1px thin red;" onclick="displayAttachmentInDialog(\'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');">';
    //                                        } else {
    //                                            html += '<img src="images/excelicon.png" style="width:100px;cursor:pointer;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');" />';
    //                                            //html += '<div style="cursor:pointer;" class="attachmentsSectionFileLink" onclick="displayAttachmentInDialog(\'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');">';
    //                                        }

    //                                    } else if (fileExtension == 'pdf') {
    //                                        //html += '<img src="images/excelicon.png" style="width:100px;height:46px;" />';
    //                                        // We need an if statement here to choose between iOS and Windows.
    //                                        //if (Platform == 'IOS8') {
    //                                        //    html += '<img src="images/excelicon.png" style="width:100px;height:46px;cursor:pointer;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');" />';
    //                                        //    //html += '<div class="attachmentsSectionFileLink" style="height:50px;border:1px thin red;" onclick="displayAttachmentInDialog(\'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');">';
    //                                        //} else {
    //                                        html += '<img src="images/pdf.png" style="width:100px;cursor:pointer;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');" />';
    //                                        //html += '<div style="cursor:pointer;" class="attachmentsSectionFileLink" onclick="displayAttachmentInDialog(\'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');">';
    //                                        //}

    //                                    } else if (fileExtension == 'mp4') {

    //                                        var imgId = 'img_bwSlideSet_' + thiz.options.elementIdSuffix + '_' + bwBudgetRequestId + '_' + i;
    //                                        html += '<img id="' + imgId + '" style="height:120px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;" alt="" ';
    //                                        html += '   onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');" ';
    //                                        html += ' />';
    //                                        var thumbnailUrl = "_files/" + workflowAppId + "/" + bwBudgetRequestId + "/" + filename + '_thumbnail_' + '.jpg';
    //                                        displayImageThumbnail(imgId, thumbnailUrl);

    //                                    } else if (fileExtension == 'rtf') {

    //                                        html += '<img src="images/rtf.png" style="width:50px;cursor:pointer;" ';

    //                                        html += 'onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');" ';
    //                                        html += ' />';
    //                                    } else if (fileExtension == 'vob') {

    //                                        html += '<img src="images/vob.png" style="width:50px;cursor:pointer;" ';

    //                                        html += 'onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');" ';
    //                                        html += ' />';
    //                                    } else if (fileExtension == 'mp3') {

    //                                        html += '<img src="images/mp3.png" style="width:50px;cursor:pointer;" ';

    //                                        html += 'onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');" ';
    //                                        html += ' />';
    //                                    }

    //                                    html += '    </td>';
    //                                    html += '    <td style="width:90%;white-space:normal;">';

    //                                    // We need an if statement here to choose between iOS and Windows.
    //                                    if (Platform == 'IOS8') {
    //                                        html += '<div class="attachmentsSectionFileLink" style="height:50px;border:1px thin red;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');">';
    //                                    } else {
    //                                        html += '<div class="attachmentsSectionFileLink" style="cursor:pointer;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');">';
    //                                    }

    //                                    html += filename;

    //                                    // Display the file attachment description.
    //                                    if (description.length > 0) {
    //                                        //$('#' + attachmentsSectionId).append('&nbsp;&nbsp;<span class="attachmentsSectionDescription"> - "' + description + '"</span>');

    //                                        html += '<br /><span class="attachmentsSectionDescription"> - "' + description + '"</span>';
    //                                        //html += '<br /><span class="attachmentsSectionSize"> - ' + size + ' mb</span>';
    //                                    } else {
    //                                        //$('#' + attachmentsSectionId).append('&nbsp;&nbsp;<span class="attachmentsSectionDescription"> - [no description]' + description + '</span>'); // Leave the description variable here because then we will know if something unexpected happens.

    //                                        html += '<br /><span class="attachmentsSectionDescription"> - [no description]' + description + '</span>';

    //                                    }

    //                                    if (size.toLowerCase() == 'na') {
    //                                        html += '<br /><span class="attachmentsSectionDescription" style="">[size unavailable]</span>';
    //                                    } else {
    //                                        html += '<br /><span class="attachmentsSectionDescription">' + size + ' MB</span>';
    //                                    }




    //                                    if (showRemoveAttachmentButton && (showRemoveAttachmentButton == 'true')) {
    //                                        //$('#' + attachmentsSectionId).append("&nbsp;&nbsp;<input type=\"button\" style=\"cursor:pointer;\" id=\"removeBudgetRequestAttachment" + i + "\" value=\"Remove\" onclick=\"removeAttachment('" + filename + "', '" + attachmentsSectionId + "', '" + _workflowAppId + "', '" + _budgetRequestId + "');\" />");

    //                                        html += '&nbsp;&nbsp;<input type="button" style="cursor:pointer;" id="removeBudgetRequestAttachment' + i + '" value="Remove" onclick="removeAttachment(\'' + filename + '\', \'' + attachmentsTagId + '\', \'' + bwWorkflowAppId + '\', \'' + bwBudgetRequestId + '\');" />';
    //                                    }

    //                                    //$('#' + attachmentsSectionId).append("</br>");
    //                                    //html += '</br>';

    //                                    html += '</div>';

    //                                    html += '</br>';
    //                                    //$('#' + attachmentsSectionId).append('</div>');

    //                                    //$('#' + attachmentsTagId).append(html);
    //                                    //debugger;
    //                                    $(thiz.element).find('#newrequestattachments').append(html);





    //                                    function handleDragStart(e) {
    //                                        try {
    //                                            console.log('In handleDragStart().<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
    //                                            //this.style.opacity = '0.4';  // this / e.target is the source node.

    //                                            thiz.options.dragSourceAttachmentElement = this;

    //                                            e.dataTransfer.effectAllowed = 'copy';
    //                                            e.dataTransfer.dropEffect = 'copy';
    //                                            e.dataTransfer.setData('text/html', this.src); //.innerHTML);
    //                                        } catch (e) {
    //                                            console.log('Exception in handleDragStart(): ' + e.message + ', ' + e.stack);
    //                                        }
    //                                    }
    //                                    //function handleDragOver(e) {
    //                                    //    console.log('In handleDragOver().');
    //                                    //    if (e.preventDefault) {
    //                                    //        e.preventDefault(); // Necessary. Allows us to drop.
    //                                    //    }
    //                                    //    e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
    //                                    //    return false;
    //                                    //}
    //                                    //function handleDragEnter(e) {
    //                                    //    console.log('In handleDragEnter().');
    //                                    //    // this / e.target is the current hover target.
    //                                    //    this.classList.add('over');
    //                                    //}
    //                                    //function handleDragLeave(e) {
    //                                    //    console.log('In handleDragLeave().');
    //                                    //    this.classList.remove('over');  // this / e.target is previous target element.
    //                                    //}
    //                                    // dragstart="$(\'.bwRequest\').bwRequest(\'dragstart\');"
    //                                    //document.getElementById('attachmentstest1').addEventListener('dragstart', $('.bwRequest').bwRequest('dragstart'), false);
    //                                    //var element1 = document.getElementById('attachmentstest1'); // $('#' + requestDialogId).find('#budgetrequestform')[0].getAttribute('bwbudgetrequestid');
    //                                    try {
    //                                        console.log('Adding event listener dragstart: <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
    //                                        var element1 = $(thiz.element).find('#attachmentstest1'); // document.getElementById('attachmentstest1');
    //                                        element1.addEventListener('dragstart', handleDragStart, false);
    //                                    } catch (e) { }

    //                                    //element1.addEventListener('dragenter', handleDragEnter, false);
    //                                    //element1.addEventListener('dragover', handleDragOver, false);
    //                                    //element1.addEventListener('dragleave', handleDragLeave, false);

    //                                    //var element2 = document.getElementById('dropzone1');
    //                                    //element2.addEventListener('dragstart', handleDragStart, false);
    //                                }
    //                            }





    //                        } else if (data) {

    //                            $(thiz.element).find('#newrequestattachments')[0].innerHTML = '<span style="color:tomato;">No attachments found: ' + JSON.stringify(data) + '</span>';

    //                        } else {
    //                            $(thiz.element).find('#newrequestattachments')[0].innerHTML = '<span style="color:tomato;">ERROR: Unexpected response: ' + JSON.stringify(data) + '</span>';
    //                        }
    //                    } catch (e) {
    //                        $(thiz.element).find('#newrequestattachments')[0].innerHTML = '<span style="color:tomato;">Exception in bwSlideSet.populateAttachments:1: ' + e.message + ', ' + e.stack + '</span>';
    //                        if (e.number) {
    //                            displayAlertDialog('Error in bwRequest.populateAttachments():1: ' + e.message + ', ' + e.stack);
    //                        } else {
    //                            // This most likely means that the folders are there on the file services server, but there is nothing in them.
    //                            //
    //                            // Fileservices has an error, so show nothing! We will put a red exclamation pin in the attachments section eventually! - 10-1-17 todd
    //                            //displayAlertDialog('Fileservices has an error: ' + ' "' + e.message + '"');
    //                        }
    //                    }
    //                    //}
    //                },
    //                error: function (data, errorCode, errorMessage) {

    //                    if (errorCode === 'timeout' && errorMessage === 'timeout') {
    //                        displayAlertDialog('SERVICE UNAVAILABLE. File services is not responding. communication timeout is set at ' + ajaxTimeout / 1000 + ' seconds: ' + errorCode + ', ' + errorMessage);
    //                        $(thiz.element).find('#newrequestattachments')[0].innerHTML = '<span style="color:tomato;">File services is not responding. communication timeout is set at ' + ajaxTimeout / 1000 + ' seconds: ' + errorCode + ', ' + errorMessage + '</span>';
    //                    } else {

    //                        var msg = 'Error in bwSlideSet.js.populateAttachments():2: ' + errorCode + ', ' + errorMessage + ', operationUri: ' + operationUri;

    //                        console.log(msg);

    //                        $(thiz.element).find('#newrequestattachments')[0].innerHTML = '<span style="color:tomato;">' + msg + '</span>';

    //                        displayAlertDialog('Error in bw.initar.core.js.populateAttachments():2: ' + errorCode + ', ' + errorMessage);
    //                        // The latest error 1-17-2018 is errorCode:'error' and errorMessage:'Not Found'.
    //                        // What does this mean? You can replicate this error!
    //                        // at Url: https://budgetworkflow.com/ios8.html, view an offline (Un-submitted) request, and try to add an attachment.


    //                    }
    //                }
    //            });
    //        }
    //    } catch (e) {
    //        console.log('Exception in populateAttachments: ' + e.message + ', ' + e.stack);

    //        //renderAndPopulateAttachments
    //        $(thiz.element).find('#newrequestattachments')[0].innerHTML = '<span style="color:tomato;">Exception in bwSlideSet.populateAttachments: ' + e.message + ', ' + e.stack + '</span>';

    //    }
    //},








    //cmdDeleteSlide: function (bwBudgetRequestId, filename) {
    //    try {
    //        console.log('In bwSlideSet.js.cmdDeleteSlide(' + bwBudgetRequestId + ', ' + filename + ').');
    //        var thiz = this;

    //        var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');






    //        $("#divDeleteAnAttachmentOfflineDialog").dialog({
    //            modal: true,
    //            resizable: false,
    //            closeText: "Cancel",
    //            closeOnEscape: true, // Hit the ESC key to hide! Yeah!
    //            width: "1000", //"570px",
    //            dialogClass: "no-close", // No close button in the upper right corner.
    //            hide: false, // This means when hiding just disappear with no effects.
    //            open: function () {
    //                $('.ui-widget-overlay').bind('click', function () {
    //                    $("#divDeleteAnAttachmentOfflineDialog").dialog('close');
    //                });
    //            }
    //        });

    //        // Hide the title bar.
    //        $("#divDeleteAnAttachmentOfflineDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
    //        // Set the title.
    //        document.getElementById('spanDeleteAnAttachmentOfflineDialogTitle').innerHTML = 'Delete ' + filename;

    //        // Set the click event for the Delete button.
    //        $('#divDeleteAnAttachmentOfflineDialogDeleteRequestButton').click(function (error) {
    //            try {
    //                debugger;
    //                var fileserviceurl = globalUrlPrefix + globalUrlForWebServices + '/_files';
    //                var data = [];
    //                data = {
    //                    bwBudgetRequestId: bwBudgetRequestId,
    //                    Filename: filename
    //                };
    //                var operationUri = fileserviceurl + "/removeattachment";
    //                $.ajax({
    //                    url: operationUri,
    //                    type: "POST",
    //                    data: data,
    //                    headers: {
    //                        "Accept": "application/json; odata=verbose"
    //                    },
    //                    success: function (data) {
    //                        try {
    //                            $("#divDeleteAnAttachmentOfflineDialog").dialog('close');

    //                            if (JSON.stringify(data).toUpperCase().indexOf('THE FILE WAS DELETED') > -1) {
    //                                try {
    //                                    $('#AttachmentsDialog1').dialog('close');
    //                                } catch (e) { }
    //                                thiz.populateAttachments(workflowAppId, bwBudgetRequestId, 'attachmentsInXslForm', true);
    //                            } else {


    //                                // 3-23-2022 this may need a revisit someday

    //                                console.log('There was an error deleting the file: ' + JSON.stringify(data));
    //                                try {
    //                                    $('#AttachmentsDialog1').dialog('close');
    //                                } catch (e) { }
    //                                thiz.populateAttachments(workflowAppId, bwBudgetRequestId, 'attachmentsInXslForm', true);



    //                            }
    //                        } catch (e) {
    //                            debugger;
    //                            console.log('Exception in bwSlideSet.js.cmdDeleteSlide.post.removeattachment.success(): ' + e.message + ', ' + e.stack);
    //                            displayAlertDialog('Exception in bwSlideSet.js.cmdDeleteSlide.post.removeattachment.success(): ' + e.message + ', ' + e.stack);
    //                        }
    //                    },
    //                    error: function (data, errorCode, errorMessage) {
    //                        debugger;
    //                        console.log('Error in bwSlideSet.js.cmdDeleteSlide.post.removeattachment.error(): ' + e.message + ', ' + e.stack);
    //                        displayAlertDialog('Error in bwSlideSet.js.cmdDeleteSlide.post.removeattachment.error(): bwBudgetRequestId: ' + bwBudgetRequestId + ', filename: ' + filename + ', errorMessage: ' + errorMessage);
    //                    }
    //                });
    //            } catch (e) {
    //                debugger;
    //                console.log('Exception in bwSlideSet.js.cmdDeleteSlide.deletebutton.click(): ' + e.message + ', ' + e.stack);
    //                displayAlertDialog('Exception in bwSlideSet.js.cmdDeleteSlide.deletebutton.click(): ' + e.message + ', ' + e.stack);
    //            }
    //        });

    //    } catch (e) {
    //        debugger;
    //        console.log('Exception in bwSlideSet.js.cmdDeleteSlide():2: ' + e.message + ', ' + e.stack);
    //        displayAlertDialog('Exception in bwSlideSet.js.cmdDeleteSlide():2: ' + e.message + ', ' + e.stack);
    //    }
    //},


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
    //        console.log('Exception in bwSlideSet.displayAlertDialog(): ' + e.message + ', ' + e.stack);
    //    }
    //}

});