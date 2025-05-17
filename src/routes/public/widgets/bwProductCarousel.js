$.widget("bw.bwProductCarousel", {
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
        This is the bwProductCarousel.js jQuery Widget. 
        ===========================================================

            [more to follow]
                          
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

            [put your stuff here]

        ===========================================================
       
        */

        // This value identifies the slides that will be displayed by this widget. This allows multiple bwProductCarousel.js widgets to be displayed at the same time, as long as they each specify a different value here. 
        // The expected value is the slide set guid which appears in the admin (bwSlideshowAdmin.js). This value can be specified when instantiated. eg: $('#divBwProductCarousel').bwProductCarousel({ PublishedSlideSetId: '995e4852-66c9-4c80-bb43-b5343b6404a8' });
        PublishedSlideSetId: null,

        // This is where we store all of the slides and their metadata. This powers the slideshow.
        PublishedSlideSet: {
            FilesAndFolders: null
        },

        // This is a custom guid which gets appended to element id's, making sure this widget keeps to itself.
        elementIdSuffix: null,


        carouselImageTracker: null,
        carouselTagline: [],
        carouselHeaderText: [],
        audio: null,
        audioMuted: true, // Default to the audio being turned off.
        slideTransitionTime: 6, // This is where we set the transition time between slides.
        slideTransitionLastSystemTime: 0, // This is used to make sure that the slides are switched a consistent number of seconds.
        timerObject: null,


        //canvas: null,
        smallsquare: { // This is the red square that follows the cursor, and displays the magnified image.
            //x: null,
            //y: null,
            width: 75,
            height: 75//,

            //update: function () {
            //    //if (keystate[UpArrow]) this.y -= 7;
            //    //if (keystate[DownArrow]) this.y += 7;
            //},

            //draw: function () {
            //    try {

            //        //divSmallImageSquare.style.top = (rect.top + window.scrollY) + 'px';
            //        //divSmallImageSquare.style.left = rect.left + 'px';

            //    } catch (e) {
            //        console.log('Exception in smallsquare.draw(): ' + e.message + ', ' + e.stack);
            //    }
            //}
        },

        value: 0,
        displayOnCreation: false,
        json: null,
        //jsonTreeState: null, // This contains the org structure and roles.
        //DraftOrgStructureAndRoles: null, // This contains the org structure and roles.
        workflow: null, // Storing it here so we can use it to see which roles are available. I think the workflow should be the origin for roles, but we will see if that is the case in the end... :)
        store: null, // Contains Global and DraftGlobal. These contains the org structure and roles.
        color: {
            Default: 'black',
            Active: '#ff0000', // red // used for hover etc.
            Inactive: 'lightgrey', //'aqua', // red // used for hover etc.
            Global: '#0066ff', // blue
            Division: '#0066ff', // blue
            Group: '#ffff00', // yellow
            LegalEntity: '#ff9900', // orange
            LegalEntity2: '#29685F', // galapagos green
            Location: '#009933', // green
            ChildNode: '#95b1d3' // that nice light blue/grey color also using at top of section pages...
        },
        Checklists: null,
        bwTenantId: null,
        bwWorkflowAppId: null,
        bwEnabledRequestTypes: null, // An array of the following: ['Budget Request', 'Quote Request', 'Reimbursement Request', 'Recurring Expense', 'Capital Plan Project', 'Work Order']
        operationUriPrefix: null,
        //ajaxTimeout: 15000,

        //quill: null,
        //quillSubjectEditor: null,

        //quillErrorOrSuggestionDialogSubjectEditor: null,
        //quillErrorOrSuggestionDialogBodyEditor: null,

        displayOrgRolesPicker: false, //true, // Should be false by default but this is good for now.
        displayRoleIdColumn: false,
        autoSenseDeviceType: false // Automatic UI based on device type. Alpha version so far.
    },
    _create: function (assignmentRowChanged_ElementId) {
        this.element.addClass("bwProductCarousel");
        var thiz = this; // Need this because of the asynchronous operations below.

        try {

            selfDiscoverOperationUri(thiz); // This sets this.options.operationUriPrefix correctly.

            var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
            this.options.elementIdSuffix = guid;

            // 
            // Load this object first so we don't have to keep making web service calls.
            //
            if (this.options.PublishedSlideSet.FilesAndFolders != null) {

                this.renderSlideSets();

            } else {

                this.loadFoldersAndFiles();

            }

            //thiz.startCarouselTimer(); // 12-22-2022
            //alert('In bwProductCarousel._create(). The widget has been initialized.');
            console.log('In bwProductCarousel._create(). The widget has been initialized.');

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">bwProductCarousel: CANNOT RENDER THE WIDGET</span>';
            html += '<br />';
            html += '<span style="">Exception in bwProductCarousel.Create(): ' + e.message + ', ' + e.stack + '</span>';
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
            .removeClass("bwWorkflowEditor")
            .text("");
    },

    loadFoldersAndFiles: function () {
        try {
            console.log('In bwProductCarousel.js.loadFoldersAndFiles().');
            //alert('In bwProductCarousel.js.loadFoldersAndFiles().');
            var thiz = this;

            //var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
            var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');
            //var externallyFacingUrlForAttachmentsSourceFolder = $('.bwAuthentication').bwAuthentication('option', 'externallyFacingUrlForAttachmentsSourceFolder');

            var data = {
                //bwWorkflowAppId: workflowAppId,
                bwParticipantId: participantId,
                bwParticipantEmail: participantEmail,
                bwParticipantFriendlyName: participantFriendlyName,
                PublishedSlideSetId: this.options.PublishedSlideSetId
                //externallyFacingUrlForAttachmentsSourceFolder: externallyFacingUrlForAttachmentsSourceFolder
            };
            $.ajax({
                url: thiz.options.operationUriPrefix + "_files/slideshowslidesets",
                type: 'GET',
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: function (result) {
                    try {
                        //console.log('In bwProductCarousel.js.loadFoldersAndFiles(). Got data from _files/slideshowslidesets().'); // ' + JSON.stringify(result));

                        //CurrentSlides: {
                        //    SlideSets: {
                        //        PublishedSlideSet: null,
                        //        FilesAndFolders: null
                        //    }
                        //},

                        if (!result.filesandfolders) {

                            displayAlertDialog('No slides available. result: ' + JSON.stringify(result));

                        } else {
                            var SlideSets = result.filesandfolders;

                            if (!(SlideSets.FilesAndFolders && SlideSets.FilesAndFolders.length)) {

                                console.log('In bwProductCarousel.js._create(). NO SLIDES TO DISPLAY.');

                            } else {

                                //
                                // Here is where we decide which slide set we are going to display.
                                //
                                var foundTheSlideset = false;

                                if (thiz.options.PublishedSlideSetId) {

                                    // A slide set has been specified for this widget.

                                    for (var i = 0; i < SlideSets.FilesAndFolders.length; i++) {
                                        if (SlideSets.FilesAndFolders[i].folderName) {
                                            if (thiz.options.PublishedSlideSetId == SlideSets.FilesAndFolders[i].folderName) {
                                                thiz.options.PublishedSlideSet.FilesAndFolders = SlideSets.FilesAndFolders[i]; // We have found the published slide set.
                                                foundTheSlideset = true;
                                            }
                                        }
                                    }

                                    if (foundTheSlideset != true) {
                                        console.log('xcx21314-2 There is no published slide set.');
                                    }

                                } else {

                                    // No slide set has been specified for this widget, so use the one that is marked as published in the bwSLideshowAdmin.js widget in the admin.
                                    console.log('xcx21314-3 There is no published slide set.');

                                }

                                //
                                // end: Here is where we decide which slide set we are going to display.
                                //

                                if (foundTheSlideset == true) {

                                    //displayAlertDialog_Persistent('xcx123423556 ' + JSON.stringify(SlideSets.FilesAndFolders, null, 2)); // pretty print.
                                    //console.log('xcx123423556 ' + JSON.stringify(SlideSets.FilesAndFolders, null, 2)); // pretty print.

                                    if (thiz.options.PublishedSlideSet.FilesAndFolders && thiz.options.PublishedSlideSet.FilesAndFolders.files) {
                                        // Sort by sortOrder.
                                        thiz.options.PublishedSlideSet.FilesAndFolders.files = thiz.options.PublishedSlideSet.FilesAndFolders.files.sort(function (a, b) {
                                            var nameA = a.sortOrder;
                                            var nameB = b.sortOrder;
                                            if (nameA < nameB) {
                                                return -1; //nameA comes first
                                            }
                                            if (nameA > nameB) {
                                                return 1; // nameB comes first
                                            }
                                            return 0;  // names must be equal
                                        });
                                    }

                                    thiz.renderSlideSets();


                                    //timerObject = setTimeout(startCarouselTimer(), 25000); // xx milliseconds. THIS IS WHERE THE TIMER GETS TURNED ON. 1-23-2023.
                                }


                                console.log('In bwProductCarousel.js._create(). FINISHED DISPLAYING, called startCarouselTimer(). <<<<<<<<<<<<<<<<');
                            }

                        }

                    } catch (e) {
                        console.log('Exception in bwProductCarousel.js.loadFoldersAndFiles():2: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwProductCarousel.js.loadFoldersAndFiles():2: ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    console.log('Error in bwProductCarousel.js.loadFoldersAndFiles.GetExternallySharedFiles():1: ' + errorCode + ', ' + errorMessage);
                    //displayAlertDialog('Error in bwProductCarousel.js.loadFoldersAndFiles.GetExternallySharedFiles():1: ' + errorCode + ', ' + errorMessage); // Don't want this to show up. Most likely caused by files services being unavailable.
                }
            });

        } catch (e) {
            console.log('Exception in bwProductCarousel.js.loadFoldersAndFiles(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwProductCarousel.js.loadFoldersAndFiles(): ' + e.message + ', ' + e.stack);
        }
    },
    renderSlideSets: function () {
        try {
            console.log('In bwProductCarousel.js.renderSlideSets().');
            //alert('In bwProductCarousel.js.renderSlideSets().');

            if (this.options.PublishedSlideSet.FilesAndFolders && this.options.PublishedSlideSet.FilesAndFolders.files && this.options.PublishedSlideSet.FilesAndFolders.files.length && (this.options.PublishedSlideSet.FilesAndFolders.files.length > 0)) {

                var thiz = this;

                //
                // THIS IS WHERE THE WHOLE SLIDESHOW GETS CONFIGURED.
                //

                this.carouselImageTracker = -1; // This is zero based.
                this.carouselTagline = []; //new Array(10); // The spanCarouselTagline DOM object displays this.
                this.carouselTagline.push('Start using it now. It\'s free!!');
                this.carouselTagline.push('Invite participants!');
                this.carouselTagline.push('Create a new budget request!');
                this.carouselTagline.push('What are financial areas?');
                this.carouselTagline.push('Selecting approvers and setting budget thresholds.');
                this.carouselTagline.push('Slide#6 tag line.');
                this.carouselTagline.push('Slide#7 tag line.');
                this.carouselTagline.push('Slide#8 tag line.');
                this.carouselTagline.push('Slide#9 tag line.');
                this.carouselTagline.push('Slide#10 tag line.');

                //this.carouselHeaderText = []; //new Array(10); // The spanCarouselTagline DOM object displays this.
                //this.carouselHeaderText.push('1. Create, review, and approve budget requests.');
                //this.carouselHeaderText.push('2. Review budget request details.');
                //this.carouselHeaderText.push('3. Review cost, spend, and payback financials.');
                //this.carouselHeaderText.push('4. Configure organizational locations, roles, and role memberships.');
                //this.carouselHeaderText.push('5. Add people, change security roles, and reassign responsibilities.');
                //this.carouselHeaderText.push('6. Edit the workflows behind the requests.');
                //this.carouselHeaderText.push('7. Edit the checklists.');
                //this.carouselHeaderText.push('8. Edit the forms.');
                //this.carouselHeaderText.push('9. Moderate emails and monitor activity.');
                //this.carouselHeaderText.push('10. Track Spending.');

                //var audio;
                //var audioMuted = true; // Default to the audio being turned off.
                //var slideTransitionTime = 6; // This is where we set the transition time between slides.
                //var slideTransitionLastSystemTime = 0; // This is used to make sure that the slides are switched a consistent number of seconds.
                //alert('In bwProductCarousel.js._create(). Getting ready to display zczcvdsfgdsfhg');
                this.element.html(this.displayHowDoesItWorkScreen());

                //this.initializeProductHover(); // 

                //this.element.html('FINISHED DISPLAYING XCX324345365264564');
                //this.startCarouselTimer(); // 12-22-2022



                //PublishedSlideSet: {
                //        FilesAndFolders: null
                //},


                //if (thiz.carouselImageTracker < (thiz.carouselHeaderText.length)) thiz.carouselImageTracker += 1;
                if (thiz.options.PublishedSlideSet.FilesAndFolders && thiz.options.PublishedSlideSet.FilesAndFolders.files && (thiz.carouselImageTracker < (thiz.options.PublishedSlideSet.FilesAndFolders.files.length))) thiz.carouselImageTracker += 1;
                else thiz.carouselImageTracker = 0;


                thiz.setCarouselImageTracker();


                // These change the style of the carousel when hovered over, highlighting the buttons. It is just some nice feedback!
                $('#tableHowDoesItWorkCarousel1_' + thiz.options.elementIdSuffix).bind('mouseenter', function () {
                    // Make the buttons more visible.
                    document.getElementById('divLeftNavigationArrow_' + thiz.options.elementIdSuffix).className = 'carouselLeftNavigationArrowActive';
                    document.getElementById('divRightNavigationArrow_' + thiz.options.elementIdSuffix).className = 'carouselRightNavigationArrowActive';

                    //document.getElementById('divCarouselPausePlay2').className = 'carouselPausePlayActive'; //.style.backgroundColor = '#6682b5';

                });


                $('#tableHowDoesItWorkCarousel1_' + thiz.options.elementIdSuffix).bind('mouseleave', function () {
                    // Make the buttons less visible.
                    document.getElementById('divLeftNavigationArrow_' + thiz.options.elementIdSuffix).className = 'carouselLeftNavigationArrow';
                    document.getElementById('divRightNavigationArrow_' + thiz.options.elementIdSuffix).className = 'carouselRightNavigationArrow';

                    //document.getElementById('divCarouselPausePlay2').className = 'carouselPausePlay'; //.style.backgroundColor = '';
                });

            }

        } catch (e) {
            console.log('Exception in renderSlideSets(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in renderSlideSets(): ' + e.message + ', ' + e.stack);
        }
    },
    displayHowDoesItWorkScreen: function () {
        try {
            console.log('In bwProductCarousel.js.displayHowDoesItWorkScreen().');
            //alert('In bwProductCarousel.js.displayHowDoesItWorkScreen().');

            var html = '';

            html += '<table style="background-color:whitesmoke;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
            html += '    <tr style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
            html += '        <td style="text-align:center;vertical-align:middle;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';

            html += '            <table id="tableHowDoesItWorkCarousel1_' + this.options.elementIdSuffix + '" style="background-color:whitesmoke;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">'; //width:' + x + 'px;">'; // THIS IS WHERE THE WIDTH IS SET.
            html += '                <tr>';
            html += '                    <td></td>';
            html += '                    <td style="text-align:center;">';
            html += '                        <table style="width:100%">';
            html += '                            <tr>';
            html += '                                <td style="width:15%;"></td>';
            html += '                                <td style="width:70%;">';

            if (this.options.PublishedSlideSet.FilesAndFolders && this.options.PublishedSlideSet.FilesAndFolders.files) {
                var index = 0;
                for (var i = 0; i < (this.options.PublishedSlideSet.FilesAndFolders.files.length); i++) {
                    if (!this.options.PublishedSlideSet.FilesAndFolders.files[i].MasterSlide_FileId) { // Only display the "Main Slides" to begin with. After this loop, we will go through the files again and display the sub-slides.
                        html += '                           <span id="spanCarouselImageIndicator_' + this.options.elementIdSuffix + (index + 1) + '" onclick="$(\'.bwProductCarousel\').bwProductCarousel(\'cmdCarouselImageIndicatorClick\', \'' + index + '\', \'' + this.options.elementIdSuffix + '\');" class="spanCarouselImageIndicatorDisabled" title="Slide #' + (index + 1) + '">&#183;' + (index + 1) + '</span>&nbsp;';
                        index += 1;
                    }
                }
            }

            html += '                                </td>';
            html += '                                <td style="width:15%;">';
            html += '                                    <span id="spanAudioOnOff" onclick="cmdAudioToggleOnOff();" style="text-align:left;cursor:pointer;"></span>';
            html += '                                    <div id="divCarouselPausePlay">';
            //
            // This is where we display the play/pause button. 1-31-2023
            //
            //html += '                                       <div id="divCarouselPausePlay2" class="carouselPausePlay" onclick="$(\'.bwProductCarousel\').bwProductCarousel(\'startCarouselTimer\');" style="cursor:pointer;white-space:nowrap;">play slideshow<div>';
            html += '                                    </div>';
            html += '                                </td>';
            html += '                            </tr>';
            html += '                        </table>';
            html += '                    </td>';
            html += '                    <td></td>';
            html += '                </tr>';
            html += '                <tr>';

            html += '                    <td style="padding-top:0;padding-right:0;padding-bottom:0;padding-left:0;margin:0 0 0 0;border-width:0 0 0 0;vertical-align:top;">';
            html += '                        <div id="divLeftNavigationArrow_' + this.options.elementIdSuffix + '" class="carouselLeftNavigationArrow" onclick="$(\'.bwProductCarousel\').bwProductCarousel(\'cmdCarouselNavigateLeft\', \'' + this.options.elementIdSuffix + '\');">&lt;</div>';
            html += '                    </td>';


            html += '                    <td id="xcxTHISISTHEELEMENTFORSETTINGTHEWIDTHxcx2" >';
            //html += '                        <span id="spanCarouselHeaderText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 25pt;font-weight:bold;"></span>'; // 8-11-2022 THIS IS THE HEADER TEXT <<<<<<
            //html += '                        <br /><br />';
            //html += '                        <span id="spanCarouselImage" style=""></span>';

            html += '<table>';
            html += '<tr>';
            html += '<td style="vertical-align:top;">';
            html += '                        <span id="spanCarouselImage_' + this.options.elementIdSuffix + '" style="width:800px;" ></span>';
            html += '</td>';
            html += '<td style="width:50px;"></td>';
            html += '<td style="vertical-align:top;">';


            // The header text etc.
            html += '                        <div xcx="xcx123124255" id="spanCarouselHeaderText_' + this.options.elementIdSuffix + '" style="color: #3f3f3f;font-size:49px;color:black;white-space:nowrap;margin-top:-5px;font-weight:bold;overflow:hidden;"></div>'; // 8-11-2022 THIS IS THE HEADER TEXT <<<<<<
            html += '<br />';
            html += '                        <span xcx="xcx123124255" id="spanCarouselDescriptionText_' + this.options.elementIdSuffix + '" style="font-family: SFProDisplay-Regular, Helvetica, Arial, sans-serif;font-size: 38px;font-weight: normal;"></span>'; // 8-11-2022 THIS IS THE HEADER TEXT <<<<<<
            html += '<br /><br /><br />';
            html += '<div class="bwSubSlides_' + this.options.elementIdSuffix + '" xcx="xcx3458"></div>';

            html += '</td>';
            html += '</tr>';
            html += '</table>';



            html += '                    </td>';


            html += '                    <td style="padding-top:0;padding-right:0;padding-bottom:0;padding-left:0;margin:0 0 0 0;border-width:0 0 0 0;vertical-align:top;">';
            html += '                        <div id="divRightNavigationArrow_' + this.options.elementIdSuffix + '" class="carouselRightNavigationArrow" onclick="$(\'.bwProductCarousel\').bwProductCarousel(\'cmdCarouselNavigateRight\', \'' + this.options.elementIdSuffix + '\');">&gt;</div>';
            html += '                    </td>';

            html += '                </tr>';
            html += '                <tr>';
            html += '                    <td style="height:27px;">&nbsp;</td>';
            html += '                    <td></td>';
            html += '                    <td></td>';
            html += '                </tr>';
            html += '            </table>';
            html += '        </td>';
            html += '    </tr>';
            html += '</table>';
            html += '<br />';
            html += '<br />';

            html += '</span>';

            return html;

            //thiz.startCarouselTimer();
            //if (thiz.carouselImageTracker < (thiz.carouselHeaderText.length)) thiz.carouselImageTracker += 1;
            //else thiz.carouselImageTracker = 0;

            //thiz.setCarouselImageTracker();


            //// These change the style of the carousel when hovered over, highlighting the buttons. It is just some nice feedback!
            //$('#tableHowDoesItWorkCarousel1').bind('mouseenter', function () {
            //    // Make the buttons more visible.
            //    document.getElementById('divLeftNavigationArrow').className = 'carouselLeftNavigationArrowActive';
            //    document.getElementById('divRightNavigationArrow').className = 'carouselRightNavigationArrowActive';

            //    //document.getElementById('divCarouselPausePlay2').className = 'carouselPausePlayActive'; //.style.backgroundColor = '#6682b5';

            //});


            //$('#tableHowDoesItWorkCarousel1').bind('mouseleave', function () {
            //    // Make the buttons less visible.
            //    document.getElementById('divLeftNavigationArrow').className = 'carouselLeftNavigationArrow';
            //    document.getElementById('divRightNavigationArrow').className = 'carouselRightNavigationArrow';

            //    //document.getElementById('divCarouselPausePlay2').className = 'carouselPausePlay'; //.style.backgroundColor = '';
            //});

        } catch (e) {
            console.log('Exception in bwProductCarousel.js.displayHowDoesItWorkScreen(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwProductCarousel.js.displayHowDoesItWorkScreen(): ' + e.message + ', ' + e.stack);
        }
    },


    cmdCarouselNavigateLeft: function (elementIdSuffix) {
        try {
            console.log('In cmdCarouselNavigateLeft().');

            if (elementIdSuffix == this.options.elementIdSuffix) {

                if (this.carouselImageTracker > 0) {
                    this.carouselImageTracker = this.carouselImageTracker - 1;
                } else {
                    this.carouselImageTracker = this.options.PublishedSlideSet.FilesAndFolders.files.length - 1;
                }

                //document.getElementById('spanCarouselPausePlay').innerHTML = '<span onclick="startCarouselTimer();" style="cursor:pointer;white-space:nowrap;">click to play<span>';
                //document.getElementById('divCarouselPausePlay').innerHTML = '<div id="divCarouselPausePlay2" class="carouselPausePlay" onclick="startCarouselTimer();" style="cursor:pointer;white-space:nowrap;">play slideshow<div>';

                this.setCarouselImageTracker();

            }

        } catch (e) {
            console.log('Exception in cmdCarouselNavigateLeft(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in cmdCarouselNavigateLeft(): ' + e.message + ', ' + e.stack);
        }
    },
    cmdCarouselNavigateRight: function (elementIdSuffix) {
        try {
            console.log('In cmdCarouselNavigateRight().');

            if (elementIdSuffix == this.options.elementIdSuffix) {

                if ((this.options.PublishedSlideSet.FilesAndFolders && this.options.PublishedSlideSet.FilesAndFolders.files && this.options.PublishedSlideSet.FilesAndFolders.files.length) && (this.carouselImageTracker < ((this.options.PublishedSlideSet.FilesAndFolders.files.length - 1)))) {
                    this.carouselImageTracker += 1;
                } else {
                    this.carouselImageTracker = 0;
                }

                //document.getElementById('spanCarouselPausePlay').innerHTML = '<span onclick="startCarouselTimer();" style="cursor:pointer;white-space:nowrap;">play slideshow<span>';
                //document.getElementById('divCarouselPausePlay').innerHTML = '<div id="divCarouselPausePlay2" class="carouselPausePlay" onclick="startCarouselTimer();" style="cursor:pointer;white-space:nowrap;">play slideshow<div>';

                this.setCarouselImageTracker();

            }

        } catch (e) {
            console.log('Exception in cmdCarouselNavigateRight(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in cmdCarouselNavigateRight(): ' + e.message + ', ' + e.stack);
        }
    },



    showProductHoverDetails: function (elementIdSuffix, element, slideIndex) {
        try {
            // If task is true, then we lookup the request below to get details from the bwRequestJson (which is not immediately available to a task).
            console.log('In bwProductCarousel.js.showProductHoverDetails().');

            if (elementIdSuffix == this.options.elementIdSuffix) {

                var html = '';
                html += '<img src="' + $(element).find('img')[0].src + '" style="width:800px;" />';
                $('#spanCarouselImage_' + this.options.elementIdSuffix).html(html);

                                
                // Make the sub slide header and description text stand out, since the user is hovering over the slide.
                var headerText_ElementId = 'bwSubSlide_HeaderText_' + this.options.elementIdSuffix + '_' + slideIndex;
                var headerText_Element = document.getElementById(headerText_ElementId);
                if (headerText_Element) {
                    headerText_Element.style.fontWeight = 'bold';
                }

                var descriptionText_ElementId = 'bwSubSlide_DescriptionText_' + this.options.elementIdSuffix + '_' + slideIndex;
                var descriptionText_Element = document.getElementById(descriptionText_ElementId);
                if (descriptionText_Element) {
                    descriptionText_Element.style.fontWeight = 'bold';
                }

                // Make the main title lightgray.
                var carouselHeaderText_ElementId = 'spanCarouselHeaderText_' + this.options.elementIdSuffix;
                var carouselHeaderText_Element = document.getElementById(carouselHeaderText_ElementId);
                if (carouselHeaderText_Element) {
                    carouselHeaderText_Element.style.color = 'lightgray';
                }

                // Make the main sub-title lightgray.
                var carouselDescriptionText_ElementId = 'spanCarouselDescriptionText_' + this.options.elementIdSuffix;
                var carouselDescriptionText_Element = document.getElementById(carouselDescriptionText_ElementId);
                if (carouselDescriptionText_Element) {
                    carouselDescriptionText_Element.style.color = 'lightgray';
                }

                // Dont do this, it makes the screen jump around too much.
                //$('#spanCarouselHeaderText_' + this.options.elementIdSuffix).html(this.options.PublishedSlideSet.FilesAndFolders.files[slideIndex].headerText);
                //$('#spanCarouselDescriptionText_' + this.options.elementIdSuffix).html(this.options.PublishedSlideSet.FilesAndFolders.files[slideIndex].descriptionText);

            }

        } catch (e) {
            console.log('Exception in bwProductCarousel.js.showProductHoverDetails(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwProductCarousel.js.showProductHoverDetails(): ' + e.message + ', ' + e.stack);
        }
    },

    hideProductHoverDetails: function (elementIdSuffix, carouselImageTracker, slideIndex) {
        try {
            console.log('In bwProductCarousel.js.hideProductHoverDetails().');

            if (elementIdSuffix == this.options.elementIdSuffix) {

                var filePath = this.options.operationUriPrefix + '_slidesets/' + this.options.PublishedSlideSet.FilesAndFolders.folderName + '/' + this.options.PublishedSlideSet.FilesAndFolders.files[carouselImageTracker].fileName;

                var html = '';
                html += '<img src="' + filePath + '" style="width:800px;" />';
                $('#spanCarouselImage_' + this.options.elementIdSuffix).html(html);

                // Make the sub slide header and description text stand out, since the user is hovering over the slide.
                var headerText_ElementId = 'bwSubSlide_HeaderText_' + this.options.elementIdSuffix + '_' + slideIndex;
                var headerText_Element = document.getElementById(headerText_ElementId);
                debugger;
                if (headerText_Element) {
                    headerText_Element.style.fontWeight = 'normal';
                }

                var descriptionText_ElementId = 'bwSubSlide_DescriptionText_' + this.options.elementIdSuffix + '_' + slideIndex;
                var descriptionText_Element = document.getElementById(descriptionText_ElementId);
                if (descriptionText_Element) {
                    descriptionText_Element.style.fontWeight = 'normal';
                }

                // Make the main title black.
                var carouselHeaderText_ElementId = 'spanCarouselHeaderText_' + this.options.elementIdSuffix;
                var carouselHeaderText_Element = document.getElementById(carouselHeaderText_ElementId);
                if (carouselHeaderText_Element) {
                    carouselHeaderText_Element.style.color = 'black';
                }

                // Make the main sub-title black.
                var carouselDescriptionText_ElementId = 'spanCarouselDescriptionText_' + this.options.elementIdSuffix;
                var carouselDescriptionText_Element = document.getElementById(carouselDescriptionText_ElementId);
                if (carouselDescriptionText_Element) {
                    carouselDescriptionText_Element.style.color = 'black';
                }

                // Dont do this, it makes the screen jump around too much.
                //$('#spanCarouselHeaderText_' + this.options.elementIdSuffix).html(this.options.PublishedSlideSet.FilesAndFolders.files[slideIndex].headerText);
                //$('#spanCarouselDescriptionText_' + this.options.elementIdSuffix).html(this.options.PublishedSlideSet.FilesAndFolders.files[slideIndex].descriptionText);

            }

        } catch (e) {
            console.log('Exception in bwProductCarousel.js.hideProductHoverDetails(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwProductCarousel.js.hideProductHoverDetails(): ' + e.message + ', ' + e.stack);
        }
    },







    setCarouselImageTracker: function () {
        try {
            console.log('In setCarouselImageTracker(). this.carouselImageTracker: ' + this.carouselImageTracker);
            //alert('In setCarouselImageTracker(). this.carouselImageTracker: ' + this.carouselImageTracker);
            var thiz = this;

            // Rebase the this.carouselImageTracker.
            var slideIndex;
            if (this.options.PublishedSlideSet.FilesAndFolders && this.options.PublishedSlideSet.FilesAndFolders.files && this.options.PublishedSlideSet.FilesAndFolders.files[Number(this.carouselImageTracker)] && (this.options.PublishedSlideSet.FilesAndFolders.files[Number(this.carouselImageTracker)].MasterSlide_FileId)) {
                // This means this is a subslide. We need to get the next slide.
                var foundTheSlide = false;
                for (var i = Number(this.carouselImageTracker) ; i < this.options.PublishedSlideSet.FilesAndFolders.files.length; i++) {
                    if (!this.options.PublishedSlideSet.FilesAndFolders.files[i].MasterSlide_FileId) { // The slides we are looking for (the master slides) do not have a value for "MasterSlide_FileId".
                        // Found the next slide.
                        slideIndex = i;
                        break;
                    }
                }
            } else {
                slideIndex = this.carouselImageTracker;
            }

            if ((slideIndex != 0) && !slideIndex) {
                // It must have been at the end. Start from the beginning!
                var foundTheSlide = false;
                for (var i = 0; i < this.options.PublishedSlideSet.FilesAndFolders.files.length; i++) {
                    if (!this.options.PublishedSlideSet.FilesAndFolders.files[i].MasterSlide_FileId) { // The slides we are looking for (the master slides) do not have a value for "MasterSlide_FileId".
                        // Found the next slide.
                        slideIndex = i;
                        break;
                    }
                }
            }

            if ((slideIndex != 0) && !slideIndex) {

                var msg = 'xcx21435 Invalid value for slideIndex: ' + slideIndex;
                console.log(msg);
                displayAlertDialog(msg);

            } else {

                this.carouselImageTracker = slideIndex; // We found the next slide, considering the way we store slides, ignoring subslides.
                //alert('In setCarouselImageTracker(). next this.carouselImageTracker: ' + this.carouselImageTracker);

                // The header text etc.
                if (this.options.PublishedSlideSet.FilesAndFolders && this.options.PublishedSlideSet.FilesAndFolders.files && this.options.PublishedSlideSet.FilesAndFolders.files[Number(this.carouselImageTracker)]) {
                    //displayAlertDialog('xcx123441 this.carouselImageTracker: ' + this.carouselImageTracker + ', this.options.PublishedSlideSet.FilesAndFolders.files[Number(this.carouselImageTracker)]: ' + JSON.stringify(this.options.PublishedSlideSet.FilesAndFolders));
                    document.getElementById('spanCarouselHeaderText_' + this.options.elementIdSuffix).innerHTML = this.options.PublishedSlideSet.FilesAndFolders.files[Number(this.carouselImageTracker)].headerText; // xcx123124255
                    document.getElementById('spanCarouselDescriptionText_' + this.options.elementIdSuffix).innerHTML = this.options.PublishedSlideSet.FilesAndFolders.files[Number(this.carouselImageTracker)].descriptionText; // xcx123124255

                    var subslides = [];
                    var fileId = this.options.PublishedSlideSet.FilesAndFolders.files[Number(this.carouselImageTracker)].FileId;
                    for (var i = 0; i < this.options.PublishedSlideSet.FilesAndFolders.files.length; i++) {
                        if (this.options.PublishedSlideSet.FilesAndFolders.files[Number(i)].MasterSlide_FileId && (this.options.PublishedSlideSet.FilesAndFolders.files[Number(i)].MasterSlide_FileId == fileId)) {
                            // Found a sub slide.
                            subslides.push(this.options.PublishedSlideSet.FilesAndFolders.files[Number(i)]);
                        }
                    }


                    // Order the subslides.
                    if (subslides && subslides.length) {
                        // Validate that our sortOrder is Ok everywhere.
                        for (var i = 0; i < subslides.length; i++) {
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
                            for (var j = 0; j < subslides.length; j++) {
                                subslides[j].SortOrder = j;
                            }
                        }
                    }




                    // Display the subslides.
                    var html = '';
                    for (var j = 0; j < subslides.length; j++) {

                        //
                        //
                        // ALL FILES ARE SECURED ON THE fileservices SERVER. HOW DO WE LET THESE ONES WORK UNAUTHENTICATED? 8-13-2024. <<<<<<<<<<<<<
                        //
                        //
                        console.log('ALL FILES ARE SECURED ON THE fileservices SERVER. HOW DO WE LET THESE ONES WORK UNAUTHENTICATED? 8-13-2024. <<<<<<<<<<<<<');
                        debugger;
                        var filePath = this.options.operationUriPrefix + '_slidesets/' + this.options.PublishedSlideSet.FilesAndFolders.folderName + '/' + subslides[j].fileName;

                        html += '<div>';

                        html += '   <table>';
                        html += '       <tr>';
                        //html += '           <td style="vertical-align:top;">';
                        html += '           <td style="vertical-align:top;border:1px solid aliceblue;"';
                        //html += '   onmouseenter="$(\'.bwProductCarousel\').bwProductCarousel(\'showProductHoverDetails\', \'' + this.options.elementIdSuffix + '\', this);this.style.backgroundColor=\'lightgoldenrodyellow\';" ';
                        //html += '   onmouseleave="$(\'.bwProductCarousel\').bwProductCarousel(\'hideProductHoverDetails\', \'' + this.options.elementIdSuffix + '\', \'' + this.carouselImageTracker + '\');this.style.backgroundColor=\'white\';" ';
                        //html += '   onclick="" ';
                        html += '>';
                        // <td style="padding: 15px; background-color: white;"   ><img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg"></td>


                        var slideIndex;
                        for (var k = 0; k < this.options.PublishedSlideSet.FilesAndFolders.files.length; k++) {
                            if (subslides[j].FileId == this.options.PublishedSlideSet.FilesAndFolders.files[k].FileId) {
                                slideIndex = k;
                                break;
                            }
                        }

                        html += '<div id="" xcx="xcx4323235" style="border:3px solid green;" ';
                        html += '    onmouseenter="$(\'.bwProductCarousel\').bwProductCarousel(\'showProductHoverDetails\', \'' + this.options.elementIdSuffix + '\', this, \'' + (slideIndex - 1) + '\');" ';
                        html += '    onmouseleave="$(\'.bwProductCarousel\').bwProductCarousel(\'hideProductHoverDetails\', \'' + this.options.elementIdSuffix + '\', \'' + this.carouselImageTracker + '\', \'' + (slideIndex - 1) + '\');" ';
                        //html += '    onmouseleave="$(\'.bwProductCarousel\').bwProductCarousel(\'hideProductHoverDetails\', \'' + this.options.elementIdSuffix + '\', \'' + slideIndex + '\');" ';
                        //html += '    onmousemove="$(\'.bwProductCarousel\').bwProductCarousel(\'handleMouseMove\', \'' + this.options.elementIdSuffix + '\', this);" ';
                        //html += '    onmouseleave="alert(\'onmouseleave xcx2134462\');" ';
                        html += '>';
                        html += '               <img xcx="xcx2143887" src="' + filePath + '" style="width:250px;cursor:pointer;"  ';
                        html += '                   onclick="$(\'.bwSlideshowAdmin\').bwSlideshowAdmin(\'displaySlidePropertiesInDialog\', \'' + filePath + '\', \'' + subslides[j].fileName + '\', \'' + subslides[j].descriptionText + '\', \'\', \'' + subslides[j].headerText + '\', \'' + subslides[j].folderName + '\');" ';
                        //html += '                   onmouseleave="alert(\'onmouseleave xcx2134462\');" ';
                        html += '/>';
                        html += '</div>';
                        html += '           </td>';
                        html += '           <td style="vertical-align:top;">';
                        html += '               <div id="bwSubSlide_HeaderText_' + this.options.elementIdSuffix + '_' + j + '" style="" >';
                        html += subslides[j].headerText;
                        html += '               </div>';
                        //html += '                   <br />';
                        html += '               <div id="bwSubSlide_DescriptionText_' + this.options.elementIdSuffix + '_' + j + '" style="" >';
                        html += subslides[j].descriptionText;
                        html += '               </div>';
                        html += '           </td>';
                        html += '       </tr>';
                        html += '   </table>';

                        html += '</div>';

                    }

                    //$('.bwSlide[bwslide_fileid="' + displayJson[i].MasterSlide_FileId + '"]').find('.bwSubSlides').html(html);
                    $('.bwSubSlides_' + this.options.elementIdSuffix).html(html);

                }




                // Show the new image.
                var elemCarouselImage = document.getElementById('spanCarouselImage_' + this.options.elementIdSuffix);
                //
                // We need to resize the image while maintaining the aspect ratio. 9-7-2020.
                //
                //alert('this.carouselImageTracker + 1: ' + Number(this.carouselImageTracker + 1));

                var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });

                //if (this.carouselImageTracker < (this.carouselHeaderText.length)) { // 

                if (this.options.PublishedSlideSet.FilesAndFolders && this.options.PublishedSlideSet.FilesAndFolders.files) {
                    if (this.carouselImageTracker < (this.options.PublishedSlideSet.FilesAndFolders.files.length)) {

                        //alert('xcx34234 this.options.PublishedSlideSet: ' + JSON.stringify(this.options.PublishedSlideSet));
                        //xcx34234 this.options.PublishedSlideSet: {"FilesAndFolders":{"folderName":"15cc4ba7-d055-48a5-af27-f7d25e905f1a","files":[{"fileName":"slide1.png","sortOrder":0},{"fileName":"slide30-1.png","sortOrder":1},{"fileName":"slide30-2.png","sortOrder":2},{"fileName":"slide30-3.png","sortOrder":3},{"fileName":"slide30-4.png","sortOrder":4},{"fileName":"slide30-5.png","sortOrder":5},{"fileName":"slide30-6.png","sortOrder":6},{"fileName":"slide30-7.png","sortOrder":7},{"fileName":"slide30-8.png","sortOrder":8},{"fileName":"slide30-9.png","sortOrder":9},{"fileName":"slide30-10.png","sortOrder":10}]}}

                        //PublishedSlideSet: {
                        //    FilesAndFolders: {
                        //        folderName: null,
                        //        files: []
                        //    }
                        //}

                        var folderName = this.options.PublishedSlideSet.FilesAndFolders.folderName;
                        var fileName = this.options.PublishedSlideSet.FilesAndFolders.files[this.carouselImageTracker].fileName;
                        var slideImagePath = this.options.operationUriPrefix + '_slidesets/' + folderName + '/' + fileName;


                        //var filepath = 'slide30-' + Number(this.carouselImageTracker + 1) + '.png?v=' + guid;
                        //var slideImagePath = this.options.operationUriPrefix + 'slides/slides20/' + filepath;



                        $.get(slideImagePath).done(function () {
                            try {
                                var img = new Image();
                                img.src = slideImagePath;
                                img.onload = function (e) {
                                    try {
                                        // This maintains the aspect ration. eg: circles are round!
                                        var displayWidth, displayHeight;
                                        //var width = 850;
                                        //var height = 550;
                                        //var width = 1500; // 8-11-2020 todd
                                        //var height = 1000; // 8-11-2020 todd
                                        var width = document.getElementById('divPageContent1').getBoundingClientRect().width - 300;
                                        var height = (width / 3) * 2;
                                        var widthDivisor = this.width / width;

                                        var heightCheckNumber = this.height / widthDivisor;
                                        if (heightCheckNumber <= height) {
                                            // Yay! The image will work with this divisor.
                                            displayWidth = this.width / widthDivisor;
                                            displayHeight = this.height / widthDivisor;
                                        } else {
                                            // Use the height divisor.
                                            var heightDivisor = this.height / height;
                                            displayWidth = this.width / heightDivisor;
                                            displayHeight = this.height / heightDivisor;
                                        }

                                        var imageRatio = displayWidth / displayHeight;

                                        var width = Number(window.innerWidth);
                                        width = (width - 450) / 3;

                                        var height = width / imageRatio; //1.47;

                                        var html = '<img id="imgHowDoesItWorkCarousel1_' + thiz.options.elementIdSuffix + '" src="' + slideImagePath + '" alt="" style="width:' + width + 'px;height:' + height + 'px;" />';

                                        if (document.getElementById('tableHowDoesItWorkCarousel1_' + thiz.options.elementIdSuffix) && document.getElementById('tableHowDoesItWorkCarousel1_' + thiz.options.elementIdSuffix).style) {
                                            document.getElementById('tableHowDoesItWorkCarousel1_' + thiz.options.elementIdSuffix).style.height = height;

                                            elemCarouselImage.innerHTML = html;
                                            thiz.fadeIn(elemCarouselImage, 250);

                                            // Set the left and right navigation arrows.
                                            var leftArrowTdElement = $('#divLeftNavigationArrow_' + thiz.options.elementIdSuffix).closest('td')[0];
                                            var leftArrowPadding = $(leftArrowTdElement).css('padding-top');
                                            if (leftArrowPadding == '0px') { // Only do this upon load to position them correctly to start with.
                                                var imageHeight = document.getElementById('imgHowDoesItWorkCarousel1_' + thiz.options.elementIdSuffix).getBoundingClientRect().height;
                                                $(leftArrowTdElement).css('padding-top', imageHeight / 2);

                                                var rightArrowTdElement = $('#divRightNavigationArrow_' + thiz.options.elementIdSuffix).closest('td')[0];
                                                $(rightArrowTdElement).css('padding-top', imageHeight / 2);
                                            }
                                        }
                                    } catch (e) {
                                        console.log('Exception in setCarouselImageTracker().img.onload(): ' + e.message + ', ' + e.stack);
                                        displayAlertDialog('Exception in setCarouselImageTracker().img.onload(): ' + e.message + ', ' + e.stack);
                                    }
                                }
                            } catch (e) {
                                console.log('Exception in setCarouselImageTracker().img.onload():2: ' + e.message + ', ' + e.stack);
                                displayAlertDialog('Exception in setCarouselImageTracker().img.onload():2: ' + e.message + ', ' + e.stack);
                            }
                        }).fail(function () {
                            console.log('In setCarouselImageTracker().get(slideImagePath).fail.');
                            //displayAlertDialog('In setCarouselImageTracker().get(slideImagePath).fail.');
                        });

                        // Now show the tagline.
                        //document.getElementById('spanCarouselTagline').innerHTML = carouselTagline[this.carouselImageTracker];
                        // Now set the indicator.
                        //for (var i = 0; i < (this.carouselHeaderText.length + 1) ; i++) { // 



                        // This is a bit complicated lol! But we just want the numbered links at the top to line up, so doing it this way.
                        var masterSlideIndex = 0;
                        var sequentiallyNumbered_carouselImageTracker_slideindex;
                        for (var i = 0; i < this.options.PublishedSlideSet.FilesAndFolders.files.length; i++) {
                            if (!this.options.PublishedSlideSet.FilesAndFolders.files[i].MasterSlide_FileId) { // The slides we are looking for (the master slides) do not have a value for "MasterSlide_FileId".
                                // Found the next slide.
                                if (i == this.carouselImageTracker) {
                                    sequentiallyNumbered_carouselImageTracker_slideindex = i;
                                    masterSlideIndex += 1;
                                    break;
                                } else {
                                    masterSlideIndex += 1;
                                }
                            }

                        }







                        var index = 0;
                        for (var i = 0; i < (this.options.PublishedSlideSet.FilesAndFolders.files.length) ; i++) {
                            if (!this.options.PublishedSlideSet.FilesAndFolders.files[i].MasterSlide_FileId) { // Only display the "Main Slides" to begin with. After this loop, we will go through the files again and display the sub-slides.
                                //if (i > 0) {
                                //var elementId = 'spanCarouselImageIndicator'.concat((Number(i) + 1).toString());
                                var elementId = ('spanCarouselImageIndicator_' + this.options.elementIdSuffix).concat((Number(index + 1)).toString()); // 12-22-2022

                                if (sequentiallyNumbered_carouselImageTracker_slideindex == this.carouselImageTracker) {
                                    //alert('xcx12324323 i: ' + i);
                                    if (document.getElementById(elementId) && document.getElementById(elementId).style) {
                                        document.getElementById(elementId).style.color = '#066B8B';
                                        document.getElementById(elementId).style.cursor = 'default';
                                    }
                                } else {
                                    if (document.getElementById(elementId) && document.getElementById(elementId).style) {
                                        document.getElementById(elementId).style.color = 'white';
                                        document.getElementById(elementId).style.cursor = 'pointer';
                                    } else {
                                        console.log('xcx2353153 couldnt find element. elementId: ' + elementId);
                                        displayAlertDialog('xcx2353153 couldnt find element. elementId: ' + elementId);
                                    }
                                }
                                //}
                                index += 1;
                            }
                        }
                        //// Now play the audio.
                        //if (audioMuted == false) {
                        //    var audioFilename = 'slides/slide4-' + Number(this.carouselImageTracker + 1) + '.mp3';
                        //    audio = new Audio(audioFilename);
                        //    audio.play();
                        //}
                    }
                }
            }

        } catch (e) {
            console.log('Exception in bwProductCarousel.js.setCarouselImageTracker(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwProductCarousel.js.setCarouselImageTracker(): ' + e.message + ', ' + e.stack);
        }
    },
    startCarouselTimer: function () {
        try {
            console.log('In bwProductCarousel.js.startCarouselTimer().');
            //alert('In bwProductCarousel.js.startCarouselTimer().');
            var thiz = this;

            // This is what switches the slides.
            // Make sure thiz things starts again in 1/2 a second.
            //timerObject = setTimeout('startCarouselTimer()', 250); // 1/4 a second.

            thiz.options.timerObject = setTimeout(thiz.startCarouselTimer2(thiz), 5000); // 5 seconds.

            if (thiz.slideTransitionLastSystemTime > 0) {
                // Calculate if [slideTransitionTime] seconds have gone by. If so, show the next slide.
                var tempSystemTimeInSeconds = new Date().getTime() / 1000;
                var slideTransitionTimeElapsed = tempSystemTimeInSeconds - thiz.slideTransitionLastSystemTime;
                if (slideTransitionTimeElapsed > thiz.slideTransitionTime) {
                    thiz.carouselImageTracker += 1;
                    //if (thiz.carouselImageTracker > 8) thiz.carouselImageTracker = 0;

                    if (thiz.carouselImageTracker > 2) thiz.carouselImageTracker = 0;

                    //document.getElementById('spanCarouselPausePlay').innerHTML = '<span onclick="cmdCarouselImageIndicatorClick(\'' + thiz.carouselImageTracker + '\');" style="cursor:pointer;white-space:nowrap;">pause slideshow<span>';
                    document.getElementById('divCarouselPausePlay').innerHTML = '<div id="divCarouselPausePlay2" class="carouselPausePlay" onclick="cmdCarouselImageIndicatorClick(\'' + thiz.carouselImageTracker + '\', \'' + thiz.options.elementIdSuffix + '\');" style="cursor:pointer;white-space:nowrap;">pause slideshow<div>';
                    thiz.setCarouselImageTracker();
                    thiz.slideTransitionLastSystemTime = new Date().getTime() / 1000; // Set thiz value for the next time through!
                }
            } else {
                // This is the first time through!
                thiz.carouselImageTracker += 1;
                if (thiz.carouselImageTracker > 8) thiz.carouselImageTracker = 0;

                if (thiz.carouselImageTracker > 2) thiz.carouselImageTracker = 0;


                //document.getElementById('spanCarouselPausePlay').innerHTML = '<span onclick="cmdCarouselImageIndicatorClick(\'' + thiz.carouselImageTracker + '\');" style="cursor:pointer;white-space:nowrap;">pause slideshow<span>';
                var html = '<div id="divCarouselPausePlay2" class="carouselPausePlay" onclick="cmdCarouselImageIndicatorClick(\'' + thiz.carouselImageTracker + '\', \'' + thiz.options.elementIdSuffix + '\');" style="cursor:pointer;white-space:nowrap;">pause slideshow<div>';
                $('#divCarouselPausePlay').html(html);
                //document.getElementById('divCarouselPausePlay')[0].innerHTML = '<div id="divCarouselPausePlay2" class="carouselPausePlay" onclick="cmdCarouselImageIndicatorClick(\'' + thiz.carouselImageTracker + '\');" style="cursor:pointer;white-space:nowrap;">pause slideshow<div>';
                thiz.setCarouselImageTracker();
                // Initialize thiz variable.
                thiz.slideTransitionLastSystemTime = new Date().getTime() / 1000;
            }
        } catch (e) {
            console.log('Exception in bwProductCarousel.js.startCarouselTimer(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwProductCarousel.js.startCarouselTimer(): ' + e.message + ', ' + e.stack);
        }
    },
    startCarouselTimer2: function () {
        try {
            console.log('In bwProductCarousel.js.startCarouselTimer2().');
            //alert('In bwProductCarousel.js.startCarouselTimer2().');
            var thiz = this;

            // This is what switches the slides.
            // Make sure thiz things starts again in 1/2 a second.
            //timerObject = setTimeout('startCarouselTimer()', 250); // 1/4 a second.

            //thiz.options.timerObject = setTimeout(thiz.startCarouselTimer(thiz), 5000); // 5 seconds.

            if (thiz.slideTransitionLastSystemTime > 0) {
                // Calculate if [slideTransitionTime] seconds have gone by. If so, show the next slide.
                var tempSystemTimeInSeconds = new Date().getTime() / 1000;
                var slideTransitionTimeElapsed = tempSystemTimeInSeconds - thiz.slideTransitionLastSystemTime;
                if (slideTransitionTimeElapsed > thiz.slideTransitionTime) {
                    thiz.carouselImageTracker += 1;
                    //if (thiz.carouselImageTracker > 8) thiz.carouselImageTracker = 0;

                    if (thiz.carouselImageTracker > 2) thiz.carouselImageTracker = 0;

                    //document.getElementById('spanCarouselPausePlay').innerHTML = '<span onclick="cmdCarouselImageIndicatorClick(\'' + thiz.carouselImageTracker + '\');" style="cursor:pointer;white-space:nowrap;">pause slideshow<span>';
                    document.getElementById('divCarouselPausePlay').innerHTML = '<div id="divCarouselPausePlay2" class="carouselPausePlay" onclick="cmdCarouselImageIndicatorClick(\'' + thiz.carouselImageTracker + '\', \'' + thiz.options.elementIdSuffix + '\');" style="cursor:pointer;white-space:nowrap;">pause slideshow<div>';
                    thiz.setCarouselImageTracker();
                    thiz.slideTransitionLastSystemTime = new Date().getTime() / 1000; // Set thiz value for the next time through!
                }
            } else {
                // This is the first time through!
                thiz.carouselImageTracker += 1;
                if (thiz.carouselImageTracker > 8) thiz.carouselImageTracker = 0;

                if (thiz.carouselImageTracker > 2) thiz.carouselImageTracker = 0;


                //document.getElementById('spanCarouselPausePlay').innerHTML = '<span onclick="cmdCarouselImageIndicatorClick(\'' + thiz.carouselImageTracker + '\');" style="cursor:pointer;white-space:nowrap;">pause slideshow<span>';
                var html = '<div id="divCarouselPausePlay2" class="carouselPausePlay" onclick="cmdCarouselImageIndicatorClick(\'' + thiz.carouselImageTracker + '\', \'' + thiz.options.elementIdSuffix + '\');" style="cursor:pointer;white-space:nowrap;">pause slideshow<div>';
                $('#divCarouselPausePlay').html(html);
                //document.getElementById('divCarouselPausePlay')[0].innerHTML = '<div id="divCarouselPausePlay2" class="carouselPausePlay" onclick="cmdCarouselImageIndicatorClick(\'' + thiz.carouselImageTracker + '\');" style="cursor:pointer;white-space:nowrap;">pause slideshow<div>';
                thiz.setCarouselImageTracker();
                // Initialize thiz variable.
                thiz.slideTransitionLastSystemTime = new Date().getTime() / 1000;
            }
        } catch (e) {
            console.log('Exception in bwProductCarousel.js.startCarouselTimer2(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwProductCarousel.js.startCarouselTimer2(): ' + e.message + ', ' + e.stack);
        }
    },

  
    displayHowDoesItWorkDialog: function () {
        try {
            console.log('In displayHowDoesItWorkDialog().');
            var thiz = this;

            var requestDialogId = 'divHowDoesItWorkDialog';

            if ($('#' + requestDialogId).is(':visible')) {
                $('#' + requestDialogId).dialog('close');
            }

            var html = '';
            //html += '<div style="display:none;" id="divRequestFormDialog">';
            html += '        <table style="width:100%;">';
            html += '            <tr>';
            html += '                <td style="width:90%;">';
            //html += '                    <span id="divRequestWorkflowAuditTrailContent"></span>';
            html += '                    <span id="divHowDoesItWorkDialogContent"></span>';
            html += '                </td>';
            html += '            </tr>';
            html += '        </table>';
            html += '        <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and zooming in on the iPhone. -->';
            html += '        <br /><br />';
            //html += '    </div>';

            //
            // THIS IS PART OF THE PIN FUNCTIONALITY 4-1-2020
            //
            var div = document.getElementById(requestDialogId); // 4-1-2020 12-28pm adt.
            if (!div) { // for some reason this gets added twice to the DOM. Figure this out someday, but for now this seems to fix it and is a good safety I suppose.
                div = document.createElement('div');
                div.id = requestDialogId;
                document.body.appendChild(div); // to place at end of document
            }
            div.innerHTML = html;
            // Now that it is part of the DOM, we can display it!
            $('#' + requestDialogId).dialog({
                position: {
                    my: 'center',
                    at: 'center',
                    of: '#spanHomePageStatusText'
                },
                modal: true,
                resizable: true,
                closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                width: '950px',
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                //resizable: true, // NOT SURE THIS IS A GOOD IDEA. 4-5-2020.
                open: function () {
                    try {

                        var element2 = document.getElementById(requestDialogId).parentNode; // This is the best way to get a handle on the jquery dialog.
                        var requestDialogParentId = requestDialogId + '_Parent'; // We need to have an id value so we can refer to this. It doesn't have one unless we add it here.
                        element2.id = requestDialogParentId; // We need to have an id value so we can refer to this. It doesn't have one unless we add it here.

                        // This creates the custom header/draggable bar on the dialog!!! 4-2-2020. // ☈ ☇ https://www.toptal.com/designers/htmlarrows/symbols/thunderstorm/
                        var html = '';
                        html += '<table style="width:100%;" onclick="$(\'.bwRequest\').bwRequest(\'pinRequestDialog\');">'; // This click event is like "pin". Once the user clicks the header of the request dialog, it no longer is modal and persists on the screen until they choose to close it.
                        html += '   <tr>';
                        html += '       <td style="width:95%;">';
                        //html += '           <div id="slider_' + requestDialogId + '" style="width:20%;cursor:pointer;">[' + 'slider_' + requestDialogId + ']</div>';
                        html += '           <div id="slider_' + requestDialogId + '" style="width:20%;cursor:pointer;"></div>';
                        html += '       </td>';
                        html += '       <td>';
                        html += '           <span class="dialogXButton" style="font-size:25pt;cursor:pointer;width:100%;" onclick="window.location=\'https://budgetworkflow.com/\';">X</span>'; // This goes back to the home page because the screen/window size may have gotten wider, and this just resets everything nicely.
                        html += '       </td>';
                        html += '   </tr>';
                        html += '</table>';

                        document.getElementById(requestDialogId).parentNode.querySelector(".ui-dialog-titlebar").innerHTML = html;

                        html = '';
                        html += '<span id="' + requestDialogParentId + '_Content">';

                        html += '<table style="background-color:whitesmoke;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                        html += '    <tr style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                        html += '        <td style="text-align:center;vertical-align:middle;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                        html += '            <table id="tableHowDoesItWorkCarousel1_' + thiz.options.elementIdSuffix + '" style="background-color:whitesmoke;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;width:850px;">';
                        html += '                <tr>';
                        html += '                    <td></td>';
                        html += '                    <td style="text-align:center;">';
                        html += '                        <table style="width:100%">';
                        html += '                            <tr>';
                        html += '                                <td style="width:15%;"></td>';
                        html += '                                <td style="width:70%;">';


                        //PublishedSlideSet: {
                        //        FilesAndFolders: null
                        //},
                        //if (thiz.carouselImageTracker < (thiz.options.PublishedSlideSet.FilesAndFolders.files.length)) thiz.carouselImageTracker += 1;

                        //alert('xcx1231234315');

                        for (var i = 0; i < (thiz.options.PublishedSlideSet.FilesAndFolders.files.length) ; i++) {
                            html += '                                    <span id="spanCarouselImageIndicator_' + thiz.options.elementIdSuffix + (i + 1) + '" onclick="cmdCarouselImageIndicatorClick(\'' + i + '\', \'' + thiz.options.elementIdSuffix + '\');" class="spanCarouselImageIndicatorDisabled" title="Slide #' + (i + 1) + '">&#183;' + (i + 1) + '</span>&nbsp;';
                        }

                        //html += '                                    <span id="spanCarouselImageIndicator1" onclick="cmdCarouselImageIndicatorClick(\'0\');" class="spanCarouselImageIndicatorEnabled" title="Slide #1">&#183;1</span>&nbsp;';
                        //html += '                                    <span id="spanCarouselImageIndicator2" onclick="cmdCarouselImageIndicatorClick(\'1\');" class="spanCarouselImageIndicatorDisabled" title="Slide #2">&#183;2</span>&nbsp;';
                        //html += '                                    <span id="spanCarouselImageIndicator3" onclick="cmdCarouselImageIndicatorClick(\'2\');" class="spanCarouselImageIndicatorDisabled" title="Slide #3">&#183;3</span>&nbsp;';
                        //html += '                                    <span id="spanCarouselImageIndicator4" onclick="cmdCarouselImageIndicatorClick(\'3\');" class="spanCarouselImageIndicatorDisabled" title="Slide #4">&#183;4</span>&nbsp;';
                        //html += '                                    <span id="spanCarouselImageIndicator5" onclick="cmdCarouselImageIndicatorClick(\'4\');" class="spanCarouselImageIndicatorDisabled" title="Slide #5">&#183;5</span>&nbsp;';
                        //html += '                                    <span id="spanCarouselImageIndicator6" onclick="cmdCarouselImageIndicatorClick(\'5\');" class="spanCarouselImageIndicatorDisabled" title="Slide #6">&#183;6</span>&nbsp;';
                        //html += '                                    <span id="spanCarouselImageIndicator7" onclick="cmdCarouselImageIndicatorClick(\'6\');" class="spanCarouselImageIndicatorDisabled" title="Slide #7">&#183;7</span>&nbsp;';
                        //html += '                                    <span id="spanCarouselImageIndicator8" onclick="cmdCarouselImageIndicatorClick(\'7\');" class="spanCarouselImageIndicatorDisabled" title="Slide #8">&#183;8</span>&nbsp;';
                        //html += '                                    <span id="spanCarouselImageIndicator9" onclick="cmdCarouselImageIndicatorClick(\'8\');" class="spanCarouselImageIndicatorDisabled" title="Slide #9">&#183;9</span>';
                        html += '                                </td>';
                        html += '                                <td style="width:15%;">';
                        html += '                                    <span id="spanAudioOnOff" onclick="cmdAudioToggleOnOff();" style="text-align:left;cursor:pointer;"></span>';
                        html += '                                    <div id="divCarouselPausePlay">';
                        //html += '                                       <div id="divCarouselPausePlay2" class="carouselPausePlay" onclick="startCarouselTimer();" style="cursor:pointer;white-space:nowrap;">play slideshow<div>';
                        html += '                                    </div>';
                        html += '                                </td>';
                        html += '                            </tr>';
                        html += '                        </table>';
                        html += '                    </td>';
                        html += '                    <td></td>';
                        html += '                </tr>';
                        html += '                <tr>';
                        html += '                    <td style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                        html += '                        <div id="divLeftNavigationArrow_' + thiz.options.elementIdSuffix + '" class="carouselLeftNavigationArrow" onclick="$(\'.bwProductCarousel\').bwProductCarousel(\'cmdCarouselNavigateLeft\', \'' + thiz.options.elementIdSuffix + '\');">&lt;</div>';
                        html += '                    </td>';
                        html += '                    <td>';
                        html += '                        <span id="spanCarouselHeaderText_' + thiz.options.elementIdSuffix + '" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 15pt;"></span>';
                        html += '                        <br /><br />';
                        html += '                        <span id="spanCarouselImage_' + thiz.options.elementIdSuffix + '" style="width:800px;" ></span>';
                        html += '                    </td>';
                        html += '                    <td style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                        html += '                        <div id="divRightNavigationArrow_' + thiz.options.elementIdSuffix + '" class="carouselRightNavigationArrow" onclick="$(\'.bwProductCarousel\').bwProductCarousel(\'cmdCarouselNavigateRight\', \'' + thiz.options.elementIdSuffix + '\');">&gt;</div>';
                        html += '                    </td>';
                        html += '                </tr>';
                        html += '                <tr>';
                        html += '                    <td style="height:27px;">&nbsp;</td>';
                        html += '                    <td></td>';
                        html += '                    <td></td>';
                        html += '                </tr>';
                        html += '            </table>';
                        html += '        </td>';
                        html += '    </tr>';
                        html += '</table>';
                        html += '<br />';
                        html += '<br />';

                        html += '</span>';
                        document.getElementById(requestDialogId).innerHTML = html;

                        $("#slider_" + requestDialogId).slider({
                            min: 50,
                            max: 200,
                            value: 100, // It starts off 100 = 50% size, so the user can make it bigger if they want.
                            slide: function (event, ui) {
                                thiz.setZoom(ui.value, requestDialogId);
                            }//,
                            //change: function (event, ui) {
                            //    thiz.setZoom(ui.value, requestDialogId);
                            //}
                        });
                        thiz.setZoom(100, requestDialogId);

                        $('.ui-widget-overlay').bind('click', function () {
                            $('#' + requestDialogId).dialog('close');
                        });

                        //var promise = thiz.loadWorkflowsAndCurrentWorkflow2(bwRequestType); // This is the default.
                        //promise.then(function (result) {
                        //    try {

                        //        //var orgPathClickable = renderTheOrgBreadcrumb2(thiz.options.store.Global, locationId);
                        //        //document.getElementById(requestDialogId + '_requestOrgClickableBreadcrumb').innerHTML = orgPathClickable;



                        //        //thiz.renderNewRequestWorkflowParticipants(requestDialogParentId, bwRequestType, brTitle, title, bwBudgetRequestId, bwWorkflowId, bwOrgId);

                        //        thiz.renderNewRequestWorkflowParticipants(requestDialogParentId, result.bwWorkflowId, bwBudgetRequestId, bwOrgId); // result.bwRequestType
                        //    } catch (e) {
                        //        console.log('Exception in bwWorkflowEditor._create().loadWorkflowsAndCurrentWorkflow(): ' + e.message + ', ' + e.stack);
                        //    }
                        //});
                        //document.getElementById('#divHowDoesItWorkDialog_Parent_Content').innerHTML = 'TODD TESTING!!!!!!!!!!!!!';

                        //PublishedSlideSet: {
                        //        FilesAndFolders: null
                        //},
                        //if (thiz.carouselImageTracker < (thiz.options.PublishedSlideSet.FilesAndFolders.files.length)) thiz.carouselImageTracker += 1;


                        //thiz.startCarouselTimer();
                        //if (thiz.carouselImageTracker < (thiz.carouselHeaderText.length)) thiz.carouselImageTracker += 1;
                        if (thiz.carouselImageTracker < (thiz.options.PublishedSlideSet.FilesAndFolders.files.length)) thiz.carouselImageTracker += 1;
                        else thiz.carouselImageTracker = 0;

                        thiz.setCarouselImageTracker();


                        // These change the style of the carousel when hovered over, highlighting the buttons. It is just some nice feedback!
                        $('#tableHowDoesItWorkCarousel1_' + thiz.options.elementIdSuffix).bind('mouseenter', function () {
                            // Make the buttons more visible.
                            document.getElementById('divLeftNavigationArrow_' + thiz.options.elementIdSuffix).className = 'carouselLeftNavigationArrowActive';
                            document.getElementById('divRightNavigationArrow_' + thiz.options.elementIdSuffix).className = 'carouselRightNavigationArrowActive';

                            //document.getElementById('divCarouselPausePlay2').className = 'carouselPausePlayActive'; //.style.backgroundColor = '#6682b5';

                        });


                        $('#tableHowDoesItWorkCarousel1_' + thiz.options.elementIdSuffix).bind('mouseleave', function () {
                            // Make the buttons less visible.
                            document.getElementById('divLeftNavigationArrow_' + thiz.options.elementIdSuffix).className = 'carouselLeftNavigationArrow';
                            document.getElementById('divRightNavigationArrow_' + thiz.options.elementIdSuffix).className = 'carouselRightNavigationArrow';

                            //document.getElementById('divCarouselPausePlay2').className = 'carouselPausePlay'; //.style.backgroundColor = '';
                        });



                    } catch (e) {
                        console.log('Exception in displayNewRequestWorkflowParticipantsDialog().dialog.open(): ' + e.message + ', ' + e.stack);
                    }
                }
            });
            try {
                $('.ui-widget-overlay')[0].style.zIndex = 9;
                $('#' + requestDialogId).dialog().parents('.ui-dialog')[0].style.zIndex = 10; // THIS IS A HACK ?? IS THIS THE BEST PLACE FOR THIS ?? >>>>>>>>>>>>>>>>>>>>>>>>>>>> 2-15-2020
            } catch (e) {

            }

        } catch (e) {
            console.log('Exception in displayHowDoesItWorkDialog(): ' + e.message + ', ' + e.stack);
        }
    },



    cmdCarouselImageIndicatorClick: function (imageIndex, elementIdSuffix) {
        try {
            console.log('In cmdCarouselImageIndicatorClick(). imageIndex: ' + imageIndex);
            //alert('In cmdCarouselImageIndicatorClick(). imageIndex: ' + imageIndex);

            if (elementIdSuffix == this.options.elementIdSuffix) {

                // The person clicked on the square to change which image is displayed in the carousel.
                clearInterval(this.options.timerObject);

                //document.getElementById('spanCarouselPausePlay').innerHTML = '<span onclick="startCarouselTimer();" style="cursor:pointer;white-space:nowrap;">play slideshow<span>';
                //document.getElementById('divCarouselPausePlay').innerHTML = '<div id="divCarouselPausePlay2" class="carouselPausePlay" onclick="startCarouselTimer();" style="cursor:pointer;white-space:nowrap;">play slideshow<div>';
                this.carouselImageTracker = Number(imageIndex);
                this.setCarouselImageTracker();

            }

        } catch (e) {
            console.log('Exception in cmdCarouselImageIndicatorClick(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in cmdCarouselImageIndicatorClick(): ' + e.message + ', ' + e.stack);
        }
    },

    fadeIn: function (elem, ms) {
        if (!elem)
            return;

        elem.style.opacity = 0;
        elem.style.filter = "alpha(opacity=0)";
        elem.style.display = "inline-block";
        elem.style.visibility = "visible";

        if (ms) {
            var opacity = 0;
            var timer = setInterval(function () {
                opacity += 50 / ms;
                if (opacity >= 1) {
                    clearInterval(timer);
                    opacity = 1;
                }
                elem.style.opacity = opacity;
                elem.style.filter = "alpha(opacity=" + opacity * 100 + ")";
            }, 50);
        }
        else {
            elem.style.opacity = 1;
            elem.style.filter = "alpha(opacity=1)";
        }
    },

    cmdAudioToggleOnOff: function () {
        if (audioMuted == true) {
            audioMuted = false;
            var html = '';
            //html += 'mute audio';
            document.getElementById('spanAudioOnOff').innerHTML = html;

            var audioFilename = 'slide4-' + Number(this.carouselImageTracker + 1) + '.mp3';
            audio = new Audio(audioFilename);
            audio.play();


        } else {
            audioMuted = true;
            var html = '';
            //html += 'audio muted';
            document.getElementById('spanAudioOnOff').innerHTML = html;
            audio.pause();
        }
    },




    pinRequestDialog: function () {
        try {
            console.log('In pinRequestDialog().');
            // This makes the dialog non-modal, so that it can be dragged around and the underlying functionality accessible. This removes the overlay that makes the dialog modal, and also removes the click event which would have originally closed the request dialog.
            // The idea is to be able to have multiple requests open at once!
            $('.ui-widget-overlay').unbind('click');
            $(".ui-widget-overlay").remove();

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
            console.log('Exception in pinRequestDialog(): ' + e.message + ', ' + e.stack);

        }
    },
    setZoom: function (originalZoom, elementId) {
        try {
            console.log('In setZoom(' + originalZoom + ', ' + elementId + ')');
            var thiz = this;
            if (originalZoom > 20) { // Don't make any smaller than this!
                var zoom = originalZoom / 100;
                elementId = elementId.replace('_Parent', '');
                elementId += '_Parent'; // This just makes sure it is here! :)
                var el = document.getElementById(elementId); //("#elementId"); //.slider("element");

                transformOrigin = [0, 0];
                //try {
                //    el = el || instance.getContainer();
                //} catch(e) { }

                var p = ["webkit", "moz", "ms", "o"],
                    s = "scale(" + zoom + ")",
                    oString = (transformOrigin[0] * 100) + "% " + (transformOrigin[1] * 100) + "%";

                for (var i = 0; i < p.length; i++) {
                    el.style[p[i] + "Transform"] = s;
                    el.style[p[i] + "TransformOrigin"] = oString;
                }

                el.style["transform"] = s;
                el.style["transformOrigin"] = oString;


                this.pinRequestDialog(); // Gets rid of the clickable greyed out background... Makes the dialog not-modal.

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
            console.log('Exception in setZoom(): ' + e.message + ', ' + e.stack);
        }
    },

    displayAlertDialog: function (errorMessage) {
        try {
            document.getElementById('spanErrorMessage').innerHTML = errorMessage;
            $("#divAlertDialog").dialog({
                modal: true,
                resizable: false,
                //closeText: "Cancel",
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                //title: 'Add a New Person',
                width: '800',
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {
                    $('.ui-widget-overlay').bind('click', function () {
                        $("#divAlertDialog").dialog('close');
                    });
                },
                close: function () {
                    //$(this).dialog('destroy').remove();
                }
            });
            $("#divAlertDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
        } catch (e) {
            console.log('Exception in bwProductCarousel.displayAlertDialog(): ' + e.message + ', ' + e.stack);
        }
    }


    //windowresize: function () {
    //    try {
    //        console.log('In bwProductCarousel.js.windowresize().');
    //        //alert('In bwProductCarousel.js.windowresize().');

    //        if (document.getElementById('imgHowDoesItWorkCarousel1') && document.getElementById('imgHowDoesItWorkCarousel1').style && document.getElementById('xcxTHISISTHEELEMENTFORSETTINGTHEWIDTHxcx2') && document.getElementById('xcxTHISISTHEELEMENTFORSETTINGTHEWIDTHxcx2').style) {

    //            document.getElementById('xcxTHISISTHEELEMENTFORSETTINGTHEWIDTHxcx2').style.verticalAlign = 'top'; // Vertical align: top.

    //            var width = Number(window.innerWidth);
    //            width = width - 450;

    //            //document.getElementById('tableHowDoesItWorkCarousel1').style.width = width + 'px'; // Change the width of the containing table.
    //            //if (document.getElementById('imgHowDoesItWorkCarousel1') && document.getElementById('imgHowDoesItWorkCarousel1').style) {
    //            document.getElementById('imgHowDoesItWorkCarousel1').style.width = width + 'px'; // Change the width of the image.
    //            //}
    //            console.log('Setting [xcxTHISISTHEELEMENTFORSETTINGTHEWIDTHxcx2] to width: ' + width + 'px.');
    //            document.getElementById('xcxTHISISTHEELEMENTFORSETTINGTHEWIDTHxcx2').style.width = width + 'px'; // Change the width of the td element.

    //            // 1.47 ratio?
    //            var height = width / 1.47;
    //            document.getElementById('imgHowDoesItWorkCarousel1').style.height = height + 'px'; // Change the width of the image.
    //            document.getElementById('xcxTHISISTHEELEMENTFORSETTINGTHEWIDTHxcx2').style.height = height + 'px'; // Change the width of the td element.

    //            console.log('Set [xcxTHISISTHEELEMENTFORSETTINGTHEWIDTHxcx2] to height: ' + height + 'px, width: ' + width + 'px.');



    //            // Set the left and right navigation arrows.
    //            var leftArrowTdElement = $('#divLeftNavigationArrow').closest('td')[0];
    //            $(leftArrowTdElement).css('padding-top', height / 2);

    //            var rightArrowTdElement = $('#divRightNavigationArrow').closest('td')[0];
    //            $(rightArrowTdElement).css('padding-top', height / 2);

    //        }

    //    } catch (e) {
    //        console.log('Exception in bwProductCarousel.js.windowresize(): ' + e.message + ', ' + e.stack);
    //        displayAlertDialog('Exception in bwProductCarousel.js.windowresize(): ' + e.message + ', ' + e.stack);
    //    }
    //},

    //showProductHoverDetails: function (elementIdSuffix, element) { // THIS WAS THE AMAZON HOVER SQUARE
    //    try {
    //        // If task is true, then we lookup the request below to get details from the bwRequestJson (which is not immediately available to a task).
    //        console.log('In bwProductCarousel.js.showProductHoverDetails().');

    //        if (elementIdSuffix == this.options.elementIdSuffix) {

    //            var id = 'imgHowDoesItWorkCarousel1_' + this.options.elementIdSuffix;

    //            var divSmallImageSquare;
    //            var context, keystate, canvas;
    //            var DownArrow = 40, UpArrow = 38;
    //            var square, smallsquare;

    //            var img = document.getElementById(id);
    //            var rect = img.getBoundingClientRect();

    //            var WIDTH = img.width;
    //            var HEIGHT = img.height;

    //            var IMGWIDTH;
    //            var IMGHEIGHT;

    //            // create a new image object
    //            // tell the image to call init() after it's fully loaded
    //            img.onload = function () {
    //                console.log('xcx21312312 img.onload().');

    //                init();
    //            }
    //            // tell the image where to get its source
    //            img.src = $(element).find('img')[0].src; //'https://dl.dropboxusercontent.com/u/139992952/multple/sun.png';
    //            //img.src = $(element).src; //'https://dl.dropboxusercontent.com/u/139992952/multple/sun.png';

    //            square =
    //              {
    //                  x: null,
    //                  y: null,
    //                  width: 200,
    //                  height: 150,

    //                  update: function () {
    //                      //if (keystate[UpArrow]) this.y -= 7;
    //                      //if (keystate[DownArrow]) this.y += 7;
    //                  },

    //                  draw: function (srcimage) {
    //                      try {

    //                          // Draw on the large image.
    //                          context.clearRect(0, 0, WIDTH, HEIGHT); // Clear the canvas. Need this for dragging to make it look ok.

    //                          IMGWIDTH = srcimage.naturalWidth;
    //                          IMGHEIGHT = srcimage.naturalHeight;

    //                          context.drawImage(srcimage, this.x, this.y);







    //                          // Now update the div square on the small image.


    //                      } catch (e) {
    //                          console.log('Exception in square.draw(): ' + e.message + ', ' + e.stack);
    //                      }
    //                  }
    //              }

    //            smallsquare =
    //              {
    //                  x: null,
    //                  y: null,
    //                  width: 75,
    //                  height: 75,

    //                  update: function () {
    //                      //if (keystate[UpArrow]) this.y -= 7;
    //                      //if (keystate[DownArrow]) this.y += 7;
    //                  },

    //                  draw: function () {
    //                      try {

    //                          //divSmallImageSquare.style.top = (rect.top + window.scrollY) + 'px';
    //                          //divSmallImageSquare.style.left = rect.left + 'px';

    //                      } catch (e) {
    //                          console.log('Exception in smallsquare.draw(): ' + e.message + ', ' + e.stack);
    //                      }
    //                  }
    //              }

    //            function init() {
    //                console.log('xcx21312342 init().');
    //                square.x = WIDTH / 2;
    //                square.y = HEIGHT / 2;


    //                sourceImg = $(element).find('img')[0];
    //                //sourceImg = $(element);

    //                //
    //                // Small image divSmallImageSquare.
    //                //
    //                divSmallImageSquare = document.getElementById('divSmallImageSquare');
    //                if (!divSmallImageSquare) {
    //                    divSmallImageSquare = document.createElement('div');
    //                    divSmallImageSquare.id = 'divSmallImageSquare';
    //                    //div.style.display = 'none';
    //                    divSmallImageSquare.style.position = 'absolute';
    //                    divSmallImageSquare.style.border = '5px solid red';
    //                    divSmallImageSquare.style.height = smallsquare.height + 'px';
    //                    divSmallImageSquare.style.width = smallsquare.width + 'px';
    //                    document.body.appendChild(divSmallImageSquare); // Place at end of document
    //                }
    //                //
    //                // end: Small image divSmallImageSquare.
    //                //

    //                document.onmousemove = handleMouseMove;
    //                function handleMouseMove(event) {
    //                    console.log('xcx1231241 handleMouseMove().');
    //                    var eventDoc, doc, body;

    //                    event = event || window.event; // IE-ism

    //                    // If pageX/Y aren't available and clientX/Y are,
    //                    // calculate pageX/Y - logic taken from jQuery.
    //                    // (This is to support old IE)
    //                    if (event.pageX == null && event.clientX != null) {
    //                        eventDoc = (event.target && event.target.ownerDocument) || document;
    //                        doc = eventDoc.documentElement;
    //                        body = eventDoc.body;

    //                        event.pageX = event.clientX +
    //                          (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
    //                          (doc && doc.clientLeft || body && body.clientLeft || 0);
    //                        event.pageY = event.clientY +
    //                          (doc && doc.scrollTop || body && body.scrollTop || 0) -
    //                          (doc && doc.clientTop || body && body.clientTop || 0);
    //                    }

    //                    var rect = sourceImg.getBoundingClientRect();

    //                    var left = rect.left;
    //                    var right = rect.right;
    //                    var top = rect.top;
    //                    var bottom = rect.bottom;
    //                    var width = right - left;
    //                    var height = bottom - top;

    //                    var mouse_x = event.pageX;
    //                    var mouse_y = event.pageY;

    //                    if ((mouse_x > left) && (mouse_x < right)) { // && (mouse_y > top) && (mouse_y < bottom)) {

    //                        // we are hovering over the small image.
    //                        var x_scale = IMGWIDTH / (width);
    //                        var y_scale = IMGHEIGHT / (height);

    //                        //var pos_x = ((mouse_x - left) * -1 + window.scrollX) * x_scale;
    //                        //var pos_y = ((mouse_y - top) * -1 + window.scrollY) * y_scale;


    //                        var pos_x = (((mouse_x - left) * -1 + window.scrollX) * x_scale) + square.width;
    //                        var pos_y = (((mouse_y - top) * -1 + window.scrollY) * y_scale) + square.height;

    //                        //console.log('xcx1231234 we are hovering over the small image. IMGWIDTH: ' + IMGWIDTH + ', IMGHEIGHT: ' + IMGHEIGHT + ', width: ' + width + ', x_scale: ' + x_scale + ', top: ' + top + ', mouse_y: ' + mouse_y + '. Setting pos_y to ' + pos_y.toFixed(0));


    //                        square.x = pos_x;
    //                        square.y = pos_y;

    //                        square.draw(sourceImg);

    //                        //
    //                        // smallsquare
    //                        //
    //                        divSmallImageSquare.style.display = 'block';
    //                        divSmallImageSquare.style.left = (mouse_x - (smallsquare.width / 2)) + 'px';
    //                        divSmallImageSquare.style.top = (mouse_y - (smallsquare.height / 2)) + 'px';

    //                    } else {

    //                        console.log('xcx2131234 HIDE SMALLSQUARE');
    //                        //divSmallImageSquare.style.display = 'none';

    //                    }

    //                }

    //            }

    //            function update() {
    //                square.update();
    //            }

    //            function draw() {

    //                square.draw();

    //            }

    //            function main() {
    //                // Put a canvas over top of it.
    //                var canvas = document.getElementById('canvasProductCarousel');
    //                if (!canvas) {

    //                    canvas = document.createElement('canvas');
    //                    canvas.id = 'canvasProductCarousel';
    //                    //canvas.style.display = 'none';
    //                    document.body.appendChild(canvas); // Place at end of document

    //                }

    //                canvas.width = WIDTH;
    //                canvas.height = HEIGHT;

    //                canvas.style.position = 'absolute';
    //                canvas.style.top = (rect.top + window.scrollY) + 'px';
    //                canvas.style.left = rect.left + 'px';

    //                canvas.style.border = '3px solid blue';

    //                // Draw an image on the canvas.
    //                context = canvas.getContext("2d");

    //            }

    //            main();

    //        }

    //    } catch (e) {
    //        console.log('Exception in bwProductCarousel.js.showProductHoverDetails(): ' + e.message + ', ' + e.stack);
    //        displayAlertDialog('Exception in bwProductCarousel.js.showProductHoverDetails(): ' + e.message + ', ' + e.stack);
    //    }
    //},

    //hideProductHoverDetails: function (elementIdSuffix, slideIndex) {
    //    try {
    //        console.log('In bwProductCarousel.js.hideProductHoverDetails().');

    //        if (elementIdSuffix == this.options.elementIdSuffix) {

    //            //    //document.onmousemove = null;

    //            //var canvas = document.getElementById('canvasProductCarousel');
    //            //if (canvas) {
    //            //    var ctx = canvas.getContext("2d");
    //            //    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas of it's lines
    //            //}





    //            var filePath = this.options.operationUriPrefix + '_files/slidesets/' + this.options.PublishedSlideSet.FilesAndFolders.folderName + '/' + this.options.PublishedSlideSet.FilesAndFolders.files[slideIndex].fileName;

    //            var id = 'imgHowDoesItWorkCarousel1_' + this.options.elementIdSuffix;
    //            document.getElementById(id).src = filePath;

    //        }

    //    } catch (e) {
    //        console.log('Exception in bwProductCarousel.js.hideProductHoverDetails(): ' + e.message + ', ' + e.stack);
    //        displayAlertDialog('Exception in bwProductCarousel.js.hideProductHoverDetails(): ' + e.message + ', ' + e.stack);
    //    }
    //},



});