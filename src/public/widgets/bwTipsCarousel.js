$.widget("bw.bwTipsCarousel", {
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
        This is the bwTipsCarousel.js jQuery Widget. 
        ===========================================================

            [more to follow]
                          
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

            [put your stuff here]

        ===========================================================
       
        */

        carouselImageTracker: null,
        carouselTagline: [],
        carouselHeaderText: [],
        audio: null,
        audioMuted: true, // Default to the audio being turned off.
        slideTransitionTime: 6, // This is where we set the transition time between slides.
        slideTransitionLastSystemTime: 0, // This is used to make sure that the slides are switched a consistent number of seconds.
        timerObject: null,

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
        ajaxTimeout: 15000,

        quill: null,
        quillSubjectEditor: null,

        quillErrorOrSuggestionDialogSubjectEditor: null,
        quillErrorOrSuggestionDialogBodyEditor: null,

        displayOrgRolesPicker: false, //true, // Should be false by default but this is good for now.
        displayRoleIdColumn: false,
        autoSenseDeviceType: false // Automatic UI based on device type. Alpha version so far.
    },
    _create: function (assignmentRowChanged_ElementId) {
        this.element.addClass("bwTipsCarousel");
        var thiz = this; // Need this because of the asynchronous operations below.
        //debugger;
        try {
            if (this.options.operationUriPrefix == null) {
                // This formulates the operationUri, which is used throughout.
                var url1 = window.location.href.split('https://')[1];
                var url2 = url1.split('/')[0];
                this.options.operationUriPrefix = 'https://' + url2 + '/';
            }

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

            this.carouselHeaderText = []; //new Array(10); // The spanCarouselTagline DOM object displays this.
            this.carouselHeaderText.push('1. Create, review, and approve budget requests.');
            this.carouselHeaderText.push('2. Review budget request details.');
            this.carouselHeaderText.push('3. Review cost, spend, and payback financials.');
            this.carouselHeaderText.push('4. Configure organizational locations, roles, and role memberships.');
            this.carouselHeaderText.push('5. Add people, change security roles, and reassign responsibilities.');
            this.carouselHeaderText.push('6. Edit the workflows behind the requests.');
            this.carouselHeaderText.push('7. Edit the checklists.');
            this.carouselHeaderText.push('8. Edit the forms.');
            this.carouselHeaderText.push('9. Moderate emails and monitor activity.');
            this.carouselHeaderText.push('10. Track Spending.');

            //var audio;
            //var audioMuted = true; // Default to the audio being turned off.
            //var slideTransitionTime = 6; // This is where we set the transition time between slides.
            //var slideTransitionLastSystemTime = 0; // This is used to make sure that the slides are switched a consistent number of seconds.







            var html = '';
            //
            // 2-10-2022 This is the "Tips" section at the top of the home page.
            //
            html += '<br />';
            html += '<div id="divInvitationSectionOnHomePage" style="border:2px solid lightgray;border-radius:20px 20px 20px 20px;padding:20px;width:75%;">'; // This defines the rounded lightgray div.
            //if (displayInvitationsOnHomePageDisplayOn == true) {
            html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 22pt;">';




            // 2-11-2022 Collapse and expand thingy??
            //html += '<img title="collapse" id="xcx323454" style="cursor:pointer;width:60px;height:60px;vertical-align:middle;float:none;" src="images/drawer-close.png" />';
            //html += '&nbsp;';
            //html += '<strong>Here are some tips to help you get the most out of this software:<br /><br />';






            //html += '<select onchange="$(\'.bwTipsCarousel\').bwTipsCarousel(\'displayHowDoesItWorkDialog\');" style="cursor:pointer;font-weight:bold;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 1em;">';
            //html += '<option>Tip#1: Add a Participant</option>';
            //html += '<option selected>Tip#2: Create a Request</option>';
            //html += '<option>Tip#3: Customize Forms</option>';
            //html += '<option>Tip#4: Customize Workflows</option>';
            //html += '<option>Tip#5: Create Checklists</option>';
            //html += '<option>Tip#6: Manage Roles</option>';
            //html += '<option>Tip#7: Monitor and Moderate Activity</option>';
            //html += '<option>Tip#8: Troubleshoot</option>';
            //html += '<option>Tip#9: xx</option>';
            //html += '<option>Tip#10: xx</option>';
            //html += '<option>Tip#11: xx</option>';






            //// 2-11-2022
            //html += '</select>';
            //html += ' [link: turn this off] [link: show me the next one] <br />';
            //html += '&nbsp;&nbsp;<img src="images/down-arrow-png.png" style="width:30px;height:30px;cursor:pointer;" title="View next tip..." alt="View next tip..." />View Next Tip';

            //html += '&nbsp;&nbsp;<img src="images/down-arrow-png.png" style="width:30px;height:30px;cursor:pointer;" title="View previous tip..." alt="View previous tip..." />View Previous Tip';


            //html += '&nbsp;&nbsp;<img src="images/down-arrow-png.png" style="width:30px;height:30px;cursor:pointer;" title="on/off slider..." alt="on/off slider..." />[switchbutton] Collapse Tips';

            //html += '<br />';
            //html += '<br />';






            html += 'Add a Person/Participant/Vendor:'; // 3-5-2022
            html += '</span>';
            html += '<br />';
            html += '<br />';
            html += '<span class="emailEditor_newMessageButton" onclick="$(\'.bwAuthentication\').bwAuthentication(\'inviteNewParticipant\');">';
            html += '     &nbsp;&nbsp;✉&nbsp;Create the invitation...&nbsp;&nbsp;';
            html += '</span>';


            html += '</div><br />';
            html += '<span id="invitationLink2"></span>';
            html += '<br />'; //<br />';

            this.element.html(html);


























            console.log('In bwTipsCarousel._create(). The widget has been initialized.');

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">bwTipsCarousel: CANNOT RENDER THE WIDGET</span>';
            html += '<br />';
            html += '<span style="">Exception in bwTipsCarousel.Create(): ' + e.message + ', ' + e.stack + '</span>';
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
                //position: {
                //    my: 'center',
                //    at: 'center',
                //    of: '#spanHomePageStatusText'
                //},
                position: {
                    my: "middle top+12",
                    at: "middle top",
                    of: window
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
                        html += '           <span class="dialogXButton" style="font-size:25pt;cursor:pointer;width:100%;" onclick="$(\'#divHowDoesItWorkDialog\').dialog(\'close\');">X</span>'; // This goes back to the home page because the screen/window size may have gotten wider, and this just resets everything nicely.
                        html += '       </td>';
                        html += '   </tr>';
                        html += '</table>';

                        document.getElementById(requestDialogId).parentNode.querySelector(".ui-dialog-titlebar").innerHTML = html;

                        html = '';
                        html += '<span id="' + requestDialogParentId + '_Content">';

                        html += '<table style="background-color:whitesmoke;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                        html += '    <tr style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                        html += '        <td style="text-align:center;vertical-align:middle;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                        html += '            <table id="tableCarousel" style="background-color:whitesmoke;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;width:850px;">';
                        html += '                <tr>';
                        html += '                    <td></td>';
                        html += '                    <td style="text-align:center;">';
                        html += '                        <table style="width:100%">';
                        html += '                            <tr>';
                        html += '                                <td style="width:15%;"></td>';
                        html += '                                <td style="width:70%;">';

                        for (var i = 0; i < (thiz.carouselHeaderText.length); i++) {
                            html += '                                    <span id="spanCarouselImageIndicator' + (i + 1) + '" onclick="cmdCarouselImageIndicatorClick(\'' + i + '\');" class="spanCarouselImageIndicatorDisabled" title="Slide #' + (i + 1) + '">&#183;' + (i + 1) + '</span>&nbsp;';
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
                        html += '                                    <div id="divCarouselPausePlay"></div>';
                        html += '                                </td>';
                        html += '                            </tr>';
                        html += '                        </table>';
                        html += '                    </td>';
                        html += '                    <td></td>';
                        html += '                </tr>';
                        html += '                <tr>';
                        html += '                    <td style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                        html += '                        <div id="divLeftNavigationArrow" class="carouselLeftNavigationArrow" onclick="$(\'.bwTipsCarousel\').bwTipsCarousel(\'cmdCarouselNavigateLeft\');">&lt;</div>';
                        html += '                    </td>';
                        html += '                    <td>';
                        html += '                        <span id="spanCarouselHeaderText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 15pt;"></span>';
                        html += '                        <br /><br />';
                        html += '                        <span id="spanCarouselImage" style="width:850px;height:550px;"></span>';
                        html += '                    </td>';
                        html += '                    <td style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                        html += '                        <div id="divRightNavigationArrow" class="carouselRightNavigationArrow" onclick="$(\'.bwTipsCarousel\').bwTipsCarousel(\'cmdCarouselNavigateRight\');">&gt;</div>';
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
                        //debugger;
                        //var promise = thiz.loadWorkflowsAndCurrentWorkflow2(bwRequestType); // This is the default.
                        //promise.then(function (result) {
                        //    try {
                        //        //debugger;
                        //        //var orgPathClickable = renderTheOrgBreadcrumb2(thiz.options.store.Global, locationId);
                        //        //document.getElementById(requestDialogId + '_requestOrgClickableBreadcrumb').innerHTML = orgPathClickable;



                        //        //thiz.renderNewRequestWorkflowParticipants(requestDialogParentId, bwRequestType, brTitle, title, bwBudgetRequestId, bwWorkflowId, bwOrgId);
                        //        //debugger;
                        //        thiz.renderNewRequestWorkflowParticipants(requestDialogParentId, result.bwWorkflowId, bwBudgetRequestId, bwOrgId); // result.bwRequestType
                        //    } catch (e) {
                        //        console.log('Exception in bwWorkflowEditor._create().loadWorkflowsAndCurrentWorkflow(): ' + e.message + ', ' + e.stack);
                        //    }
                        //});
                        //document.getElementById('#divHowDoesItWorkDialog_Parent_Content').innerHTML = 'TODD TESTING!!!!!!!!!!!!!';



                        //thiz.startCarouselTimer();
                        if (thiz.carouselImageTracker < (thiz.carouselHeaderText.length)) thiz.carouselImageTracker += 1;
                        else thiz.carouselImageTracker = 0;

                        thiz.setCarouselImageTracker();


                        // These change the style of the carousel when hovered over, highlighting the buttons. It is just some nice feedback!
                        $('#tableCarousel').bind('mouseenter', function () {
                            // Make the buttons more visible.
                            document.getElementById('divLeftNavigationArrow').className = 'carouselLeftNavigationArrowActive';
                            document.getElementById('divRightNavigationArrow').className = 'carouselRightNavigationArrowActive';

                            //document.getElementById('divCarouselPausePlay2').className = 'carouselPausePlayActive'; //.style.backgroundColor = '#6682b5';

                        });


                        $('#tableCarousel').bind('mouseleave', function () {
                            // Make the buttons less visible.
                            document.getElementById('divLeftNavigationArrow').className = 'carouselLeftNavigationArrow';
                            document.getElementById('divRightNavigationArrow').className = 'carouselRightNavigationArrow';

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



    cmdCarouselNavigateLeft: function () {
        if (this.carouselImageTracker > 0) this.carouselImageTracker = this.carouselImageTracker - 1;
        else this.carouselImageTracker = this.carouselHeaderText.length - 1;
        //clearInterval(timerObject);
        //document.getElementById('spanCarouselPausePlay').innerHTML = '<span onclick="startCarouselTimer();" style="cursor:pointer;white-space:nowrap;">click to play<span>';
        //document.getElementById('divCarouselPausePlay').innerHTML = '<div id="divCarouselPausePlay2" class="carouselPausePlay" onclick="startCarouselTimer();" style="cursor:pointer;white-space:nowrap;">play slideshow<div>';
        this.setCarouselImageTracker();
    },

    cmdCarouselNavigateRight: function () {
        if (this.carouselImageTracker < ((this.carouselHeaderText.length - 1))) this.carouselImageTracker += 1;
        else this.carouselImageTracker = 0;

        //if (this.carouselImageTracker < 2) this.carouselImageTracker += 1;
        //else this.carouselImageTracker = 0;

        //clearInterval(timerObject);
        //document.getElementById('spanCarouselPausePlay').innerHTML = '<span onclick="startCarouselTimer();" style="cursor:pointer;white-space:nowrap;">play slideshow<span>';
        //document.getElementById('divCarouselPausePlay').innerHTML = '<div id="divCarouselPausePlay2" class="carouselPausePlay" onclick="startCarouselTimer();" style="cursor:pointer;white-space:nowrap;">play slideshow<div>';
        this.setCarouselImageTracker();
    },

    setCarouselImageTracker: function () {
        var thiz = this;
        // Show the new header text.
        document.getElementById('spanCarouselHeaderText').innerHTML = this.carouselHeaderText[Number(this.carouselImageTracker)];

        // Show the new image.
        var elemCarouselImage = document.getElementById('spanCarouselImage');
        debugger;
        //
        // We need to resize the image while maintaining the aspect ratio. 9-7-2020.
        //
        //alert('this.carouselImageTracker + 1: ' + Number(this.carouselImageTracker + 1));
        if (this.carouselImageTracker < (this.carouselHeaderText.length)) {
            var filepath = 'slide20-' + Number(this.carouselImageTracker + 1) + '.png';
            var slideImagePath = this.options.operationUriPrefix + 'slides/slides20/' + filepath;
            $.get(slideImagePath).done(function () {
                debugger;
                var img = new Image();
                img.src = slideImagePath;
                img.onload = function (e) {
                    try {
                        // This maintains the aspect ration. eg: circles are round!
                        var displayWidth, displayHeight;
                        var width = 850;
                        var height = 550;
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

                        var html = '<img src="slides/' + filepath + '" alt="" width="' + displayWidth + 'px" height="' + displayHeight + 'px" />';
                        elemCarouselImage.innerHTML = html;
                        thiz.fadeIn(elemCarouselImage, 250);

                    } catch (e) {
                        console.log('Exception in setCarouselImageTracker().img.onload(): ' + e.message + ', ' + e.stack);
                        thiz.displayAlertDialog('Exception in setCarouselImageTracker().img.onload(): ' + e.message + ', ' + e.stack);
                    }
                }
            }).fail(function () {
                console.log('In setCarouselImageTracker().get(slideImagePath).fail.');
                thiz.displayAlertDialog('In setCarouselImageTracker().get(slideImagePath).fail.');
            });

            // Now show the tagline.
            //document.getElementById('spanCarouselTagline').innerHTML = carouselTagline[this.carouselImageTracker];
            // Now set the indicator.
            for (var i = 0; i < (this.carouselHeaderText.length + 1) ; i++) {
                var elementId = 'spanCarouselImageIndicator'.concat((Number(i) + 1).toString());
                if (i == this.carouselImageTracker) {
                    document.getElementById(elementId).style.color = '#066B8B';
                    document.getElementById(elementId).style.cursor = 'default';
                } else {
                    document.getElementById(elementId).style.color = 'white';
                    document.getElementById(elementId).style.cursor = 'pointer';
                }
            }
            //// Now play the audio.
            //if (audioMuted == false) {
            //    var audioFilename = 'slides/slide4-' + Number(this.carouselImageTracker + 1) + '.mp3';
            //    audio = new Audio(audioFilename);
            //    audio.play();
            //}
        }
    },

    //startCarouselTimer: function () {
    //    // This is what switches the slides.
    //    // Make sure this things starts again in 1/2 a second.
    //    timerObject = setTimeout('startCarouselTimer()', 250); // 1/4 a second.
    //    if (this.slideTransitionLastSystemTime > 0) {
    //        // Calculate if [slideTransitionTime] seconds have gone by. If so, show the next slide.
    //        var tempSystemTimeInSeconds = new Date().getTime() / 1000;
    //        var slideTransitionTimeElapsed = tempSystemTimeInSeconds - this.slideTransitionLastSystemTime;
    //        if (slideTransitionTimeElapsed > this.slideTransitionTime) {
    //            this.carouselImageTracker += 1;
    //            //if (this.carouselImageTracker > 8) this.carouselImageTracker = 0;

    //            if (this.carouselImageTracker > 2) this.carouselImageTracker = 0;

    //            //document.getElementById('spanCarouselPausePlay').innerHTML = '<span onclick="cmdCarouselImageIndicatorClick(\'' + this.carouselImageTracker + '\');" style="cursor:pointer;white-space:nowrap;">pause slideshow<span>';
    //            document.getElementById('divCarouselPausePlay').innerHTML = '<div id="divCarouselPausePlay2" class="carouselPausePlay" onclick="cmdCarouselImageIndicatorClick(\'' + this.carouselImageTracker + '\');" style="cursor:pointer;white-space:nowrap;">pause slideshow<div>';
    //            this.setCarouselImageTracker();
    //            this.slideTransitionLastSystemTime = new Date().getTime() / 1000; // Set this value for the next time through!
    //        }
    //    } else {
    //        // This is the first time through!
    //        this.carouselImageTracker += 1;
    //        if (this.carouselImageTracker > 8) this.carouselImageTracker = 0;

    //        if (this.carouselImageTracker > 2) this.carouselImageTracker = 0;


    //        //document.getElementById('spanCarouselPausePlay').innerHTML = '<span onclick="cmdCarouselImageIndicatorClick(\'' + this.carouselImageTracker + '\');" style="cursor:pointer;white-space:nowrap;">pause slideshow<span>';
    //        document.getElementById('divCarouselPausePlay').innerHTML = '<div id="divCarouselPausePlay2" class="carouselPausePlay" onclick="cmdCarouselImageIndicatorClick(\'' + this.carouselImageTracker + '\');" style="cursor:pointer;white-space:nowrap;">pause slideshow<div>';
    //        this.setCarouselImageTracker();
    //        // Initialize this variable.
    //        this.slideTransitionLastSystemTime = new Date().getTime() / 1000;
    //    }
    //},

    cmdCarouselImageIndicatorClick: function (imageIndex) {
        // The person clicked on the square to change which image is displayed in the carousel.
        clearInterval(timerObject);
        //document.getElementById('spanCarouselPausePlay').innerHTML = '<span onclick="startCarouselTimer();" style="cursor:pointer;white-space:nowrap;">play slideshow<span>';
        //document.getElementById('divCarouselPausePlay').innerHTML = '<div id="divCarouselPausePlay2" class="carouselPausePlay" onclick="startCarouselTimer();" style="cursor:pointer;white-space:nowrap;">play slideshow<div>';
        this.carouselImageTracker = Number(imageIndex);
        this.setCarouselImageTracker();
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
            console.log('Exception in bwTipsCarousel.displayAlertDialog(): ' + e.message + ', ' + e.stack);
        }
    }

});