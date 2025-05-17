$.widget("bw.bwKeypressAndMouseEventHandler", {
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
        This is the bwKeypressAndMouseEventHandler.js jQuery Widget. 
        ===========================================================
 
           [more to follow]
                           
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.
 
           [put your stuff here]
 
        ===========================================================
        
       */

        documentScrollEvent: {
            lastKnownScrollPosition: 0,
            ticking: false
        },

        allowScrollAdjustments: true, // 8-9-2023

        //divWelcomeButton_LastKnownHeight: null,
        LastKnownScrollPosition: 0,


        lastZoom: 1, // Using this to make sure we don't trigger the resize event a million times.

        CustomBehavior: null,
        DisplayVerboseBrowserConsoleLogs: true, // This is not implemented yet.

        divUploadANewSmallCircleImageDialog_JustWentBlur: false // this helps us show and hide the activity spinner 1-6-2022

        //LastKeydown_KeyCode: null // This helps with detecting cntrl-key keypress.
    },
    _create: function () {
        this.element.addClass("bwKeypressAndMouseEventHandler");
        try {
            console.log('In bwKeypressAndMouseEventHandler._create(). The widget has been initialized. CustomBehavior: ' + this.options.CustomBehavior + ', DisplayVerboseBrowserConsoleLogs: ' + this.options.DisplayVerboseBrowserConsoleLogs);
            //alert('In bwKeypressAndMouseEventHandler._create(). The widget has been initialized. CustomBehavior: ' + this.options.CustomBehavior + ', DisplayVerboseBrowserConsoleLogs: ' + this.options.DisplayVerboseBrowserConsoleLogs);
            var thiz = this;

            //
            // THE INTENTION OF THIS WIDGET IS TO HAVE ALL THE GLOBAL KEYPRESS TYPE STUFF HANDLED HERE. 
            // This should help ensure we destroy/detach events when required, so that the new handlers work properly. Javascript lets you add event handlers willy nilly!
            //

            var html = '';
            html += '<style>';
            html += '   .bwKeypressAndMouseEventHandlerStyle_OrangeBorderForElementOn_Focus_Active:focus, active, focus-visible {'; // This style makes the border orange for an active element.
            html += '       border:solid !important;';
            html += '       border-color: orange !important;';
            html += '       border-width: 3px !important;';
            html += '   }';
            html += '</style>';

            this.element.html(html); // Injecting this style into the page, as the content of this div element.

            //
            // This is the only place where we check if the user is going to be losing anything by closing their browser window. 4-3-2023.
            //
            console.log('In bwKeypressAndMouseEventHandler._create(). Hooking up events so that the user doesn\'t inadvertently close the browser window and lose their changes.');

            $(document).on('mouseenter', (function () {
                console.log('window.mouseenter(). xcx23234');
                window.onbeforeunload = null;
            }));
            $(document).on('mouseleave', (function () {
                console.log('window.mouseleave(). xcx23234');
                window.onbeforeunload = ConfirmLeave; // Doing this here because it will take a few milliseconds to get a response back from the promise "checkIfThereHaveBeenAnyChanges"... this makes 100% sure a fast user doesn't get around our check for changes.
                CheckIfAnythingNeedsToBeSaved();
            }));
            var prevKey = "";
            $(document).keydown(function (e) {
                if (e.key == "F5") {
                    console.log('In bwKeypressAndMouseEventHandler._create.document.keydown(). F5 key was pressed.');
                    CheckIfAnythingNeedsToBeSaved();
                }
                else if (e.key.toUpperCase() == "W" && prevKey == "CONTROL") {
                    console.log('In bwKeypressAndMouseEventHandler._create.document.keydown(). Cntrl-W keys were pressed.');
                    CheckIfAnythingNeedsToBeSaved();
                }
                else if (e.key.toUpperCase() == "R" && prevKey == "CONTROL") {
                    console.log('In bwKeypressAndMouseEventHandler._create.document.keydown(). Cntrl-R keys were pressed.');
                    CheckIfAnythingNeedsToBeSaved();
                }
                else if (e.key.toUpperCase() == "F4" && (prevKey == "ALT" || prevKey == "CONTROL")) {
                    console.log('In bwKeypressAndMouseEventHandler._create.document.keydown(). Cntrl-F4 or Alt-F4 keys were pressed.');
                    CheckIfAnythingNeedsToBeSaved();
                }
                prevKey = e.key.toUpperCase();
            });

            function ConfirmLeave() {
                // The browser displays it's own dialog to warn the user that the window is going to be closed. This cannot be changed as far as I know.
                return false;
            }

            function CheckIfAnythingNeedsToBeSaved() {
                try {
                    console.log('In bwKeypressAndMouseEventHandler.js.CheckIfAnythingNeedsToBeSaved().');
                    //alert('In bwKeypressAndMouseEventHandler.js.CheckIfAnythingNeedsToBeSaved().');
                    // We check all of the open requests to make sure there isn't one of them that needs to have it's changes saved.

                    var promiseArray = [];
                    var forms = $('.budgetrequestform');
                    for (var i = 0; i < forms.length; i++) {
                        var budgetRequestId = forms[i].getAttribute('bwbudgetrequestid');
                        var promise = $('.bwRequest:first').bwRequest('checkIfThereHaveBeenAnyChanges', budgetRequestId);
                        promiseArray.push(promise);
                    }
                    Promise.all(promiseArray).then(function (results) {
                        try {

                            var thereAreChangesToSave = false;
                            for (var i = 0; i < results.length; i++) {
                                if (results[i].results == 'YES_CHANGES_TO_SAVE') {
                                    thereAreChangesToSave = true;
                                }
                            }

                            if (thereAreChangesToSave == true) {
                                window.onbeforeunload = ConfirmLeave;
                            } else {
                                window.onbeforeunload = null;
                            }

                        } catch (e) {
                            console.log('In bwKeypressAndMouseEventHandler.js.CheckIfAnythingNeedsToBeSaved.promise.all.catch():1: ' + e.message + ', ' + e.stack);
                            alert('In bwKeypressAndMouseEventHandler.js.CheckIfAnythingNeedsToBeSaved.promise.all.catch():1: ' + e.message + ', ' + e.stack);
                        }
                    }).catch(function (e) {

                        console.log('In bwKeypressAndMouseEventHandler.js.CheckIfAnythingNeedsToBeSaved.promise.all.catch(). e: ' + JSON.stringify(e));
                        displayAlertDialog('In bwKeypressAndMouseEventHandler.js.CheckIfAnythingNeedsToBeSaved.promise.all.catch(). e: ' + JSON.stringify(e));

                        window.onbeforeunload = ConfirmLeave; // In the event of an exception do this. Better safe than sorry!

                    });

                } catch (e) {

                    console.log('In bwKeypressAndMouseEventHandler.js.CheckIfAnythingNeedsToBeSaved.promise.all.catch():2: ' + e.message + ', ' + e.stack);
                    alert('In bwKeypressAndMouseEventHandler.js.CheckIfAnythingNeedsToBeSaved.promise.all.catch():2: ' + e.message + ', ' + e.stack);

                    window.onbeforeunload = ConfirmLeave; // In the event of an exception do this. Better safe than sorry!

                }
            }
            //
            // end: This is the only place where we check if the user is going to be losing anything by closing their browser window. 4-3-2023.
            //

            $(document).click(function (event) {
                try {
                    console.log('In bwKeypressAndMouseEventHandler.js._create().document.click().');

                    //
                    // This element is in the bwCircleDialog for uploading org or participant images: inputFile_ForIdentifyingImage
                    // This is the best place to catch this event without creating spaghetti.
                    //
                    if (event.target.id == 'inputFile_ForIdentifyingImage') {
                        console.log('');
                        console.log('******************');
                        console.log('In bwKeypressAndMouseEventHandler.js._create().document.click(). Calling ShowActivitySpinner() for event.target.id: ' + event.target.id);
                        console.log('******************');
                        console.log('');

                        ShowActivitySpinner_FileUpload('Uploading file. This may take a while...');

                    }

                } catch (e) {
                    console.log('Exception in bwKeypressAndMouseEventHandler.js.document.click(): ' + e.message + ', ' + e.stack);
                    displayAlertDialog('Exception in bwKeypressAndMouseEventHandler.js.document.click(): ' + e.message + ', ' + e.stack);
                }
            });

            //
            // This event handler needs to be here.... when it was farther down in the code, it didn't work. 1-31-2023.
            //
            $(document).keydown(function (event) {
                try { // codemarker 4-10-2021
                    console.log('In document.keydown().');
                    //alert('In document.keydown().');
                    if (event.ctrlKey && event.keyCode == 65) {
                        //console.log('cntrl-a was presed.');
                        //console.log('is:span: ' + $(event.target).is("span"));
                        //console.log('hasAttribute: ' + $(event.target)[0].hasAttribute);
                        //console.log('contenteditable: ' + $(event.target)[0].hasAttribute("contenteditable"));
                        if ($(event.target).is("textarea") || $(event.target).is("input") || ($(event.target).is("span") && $(event.target)[0].hasAttribute && $(event.target)[0].hasAttribute("contenteditable"))) {
                            // do nothing let the cntrl-a work as expected.
                            console.log('User selected all contents of the element using cntrl-a.');
                        } else {
                            console.log('User tried to select all contents of the element using cntrl-a, but was denied by this code.');
                            event.stopPropagation(); // This prevents the user from clicking cntrl-a and selecting the entire page.
                            event.preventDefault();
                        }
                    }

                    if (event.ctrlKey && event.key.toUpperCase() == 'S') {

                        console.log('In bwKeypressAndMouseEventHandler.js.document.keydown.cntrl-s(). Cntrl-S key was pressed.');

                        var request = $(document.activeElement).closest('.budgetrequestform');

                        if (request) {

                            var bwrequesttitle = $(request)[0].getAttribute('bwrequesttitle');
                            var bwBudgetRequestId = $(request)[0].getAttribute('bwbudgetrequestid');
                            $('.bwRequest:first').bwRequest('saveAndPublishTheRequest', 'divRequestFormDialog_' + bwBudgetRequestId, 'true', '');

                            displayAlertDialog_QuickNotice('Request ' + bwrequesttitle + ' has been saved/published.');

                            event.stopPropagation(); // This prevents the user from clicking cntrl-a and selecting the entire page.
                            event.preventDefault();

                        } else {
                            console.log('In bwKeypressAndMouseEventHandler.js.document.keydown.cntrl-s(). Could not find the request that you want to save.');
                        }

                    }

                    //if (event.ctrlKey && event.key.toUpperCase() == 'W') {

                    //    // DOESN'T WORK, CNTRL-W must be a special case and not possible to interfere with or block. 1-13-2023

                    //    event.stopImmediatePropagation(); // This is required in this case.
                    //    event.stopPropagation(); // This prevents the user from clicking cntrl-w and closing the entire browser.
                    //    event.preventDefault();

                    //}


                    //if (event.ctrlKey && event.key.toUpperCase() == 'F') {

                    //    console.log('Cntrl-F key was pressed.');
                    //    alert('Cntrl-F key was pressed.');

                    //    event.stopPropagation(); // This prevents the user from clicking cntrl-a and selecting the entire page.
                    //    event.preventDefault();

                    //}

                    //if (event.ctrlKey && event.key.toUpperCase() == 'C') {

                    //    console.log('Cntrl-C key was pressed.');
                    //    alert('Cntrl-C key was pressed.');

                    //    event.stopPropagation(); // This prevents the user from clicking cntrl-a and selecting the entire page.
                    //    event.preventDefault();

                    //}

                    if (event.keyCode == 13) {

                        if (event.target && event.target.id && (event.target.id == 'inputBwAuthentication_SearchBox')) {

                            // This is necessary. Do not need to do anything. This definately needs to be here though. 6-21-2024.
                            console.log('This is necessary. Do not need to do anything. This definately needs to be here though. Facilitates entering search criteria, and clicking the enter button. xcx2123555. 6-21-2024.');

                            //var x = $('#inputBwAuthentication_SearchBox').val();

                            //alert('SEARCHING FOR xx: ' + x);

                        } else {

                            console.log('Enter key was pressed. In bwKeypressAndMouseEventHandler.js.xcx453267777568969(). event.target.id: ' + event.target.id);


                            debugger;


                            //if (document.getElementById('divCircleDialog') && document.getElementById('divCustomLogonDialog')) { 
                            if (document.getElementById('txtCustomLogonEmail') && document.getElementById('txtCustomLogonPassword')) {
                                // The logon dialog is displayed, so now lets check if the username and password is filled out.
                                if ($(event.target).is("input") || $(event.target).is("body")) {
                                    console.log('In bwKeypressAndMouseEventHandler.js.document.keydown(). Enter key was pressed, logging in the user.');
                                    $('.bwAuthentication').bwAuthentication('logonWith_BudgetWorkflow');
                                }
                            }

                        }

                    }


                    //var isEditable = $(document.activeElement).is("input") || $(document.activeElement).is("textarea");
                    //if (event.keyCode === 8 && !isEditable) { // 8 = Backspace. Disable backspace key for navigation. Allow backspace key when editing text.
                    //    console.log('In bwKeypressAndMouseEventHandler.keydown(). Backspace key has been pressed.'); // Catching and calling displayHelpWindow().');
                    //    return false;
                    //} else if ($(event.target).is("textarea") && (event.keyCode == 38 || event.keyCode == 40 || event.keyCode == 37 || event.keyCode == 39 || (event.keyCode == 17 && event.keyCode == 65))) { // 38 = UP arrow, 40 = DOWN arrow, 37 = left arrow, 39 = right arrow, 17&65 = cntrl-a.
                    //    console.log('ALLOWING these keys in a TEXTAREA element. 38 = UP arrow, 40 = DOWN arrow, 37 = left arrow, 39 = right arrow, cntrl-a.');
                    //    event.stopPropagation();
                    //} else if (event.keyCode == 112) { // F1 key pressed
                    //    console.log('In bwKeypressAndMouseEventHandler.keydown(). F1 key has been pressed. Catching and calling displayHelpWindow().');
                    //    event.stopPropagation();
                    //    event.preventDefault();
                    //    displayHelpWindow();
                    //}

                    //if ($('.dataTable').length && ($('.dataTable').css('display') == 'table')) { // If display == 'table' it means it is currently displayed on the screen.
                    //    console.log('In bwKeypressAndMouseEventHandler(). Datatable detected, so attaching mousedown event.');
                    //    $('.dataTable').bind('mousedown', function (event) {
                    //        try {
                    //            console.log('In .dataTable.mousedown().');
                    //            // This makes sure when the user selects a row, all the row selected cells get coordinated.
                    //            var selectedTrElement = $(event.target).closest('tr'); // This finds the selected row in the datatable.
                    //            if (selectedTrElement.attr('id') && typeof selectedTrElement.click == "function") {
                    //                console.log('In bwKeypressAndMouseEventHandler._create.dataTable.mousedown(). Calling click event for row ' + selectedTrElement.attr('id'));
                    //                selectedTrElement.click.apply(selectedTrElement);
                    //                selectedTrElement.addClass('selected');
                    //            }
                    //        } catch (e) {
                    //            console.log('Exception in bwKeypressAndMouseEventHandler._create.dataTable.document.keydown(): ' + e.stack);
                    //        }
                    //    });
                    //}

                    //if ($('#execute-search').length && $('#execute-search').is(':visible')) { // The top search bar.
                    //    switch (event.keyCode) {
                    //        case 13: // Enter key.
                    //            var elementId = $(event.target).attr('id');
                    //            var searchBarElementsArray = ['card-types', 'card-num-select', 'client-id-select', 'surname-select', 'given-name-select', 'match-types'];
                    //            if (searchBarElementsArray.indexOf(elementId) > -1) {
                    //                console.log('ENTER key pressed in the top search bar.');
                    //                if (!authorizations['view_credential_search']) {
                    //                    console.log('In bwKeypressAndMouseEventHandler(). User does not have permission to search credential. authorizations: ' + JSON.stringify(authorizations));
                    //                    ShowUserError('User does not have permission to search credential.');
                    //                    return;
                    //                } else {
                    //                    GetCredentials();
                    //                }
                    //            } else {
                    //                // do nothing.
                    //            }
                    //            break;
                    //    }
                    //}

                    //if ($('.dataTable').length && ($('.dataTable').css('display') == 'table') && $('.dataTable').is(':visible')) { // If display == 'table' it means it is currently displayed on the screen.
                    //    var dataTableElement = $(event.target).closest('.dataTable');
                    //    if (dataTableElement) {
                    //        switch (event.keyCode) {
                    //            case 38: // Up arrow.
                    //                console.log('UP arrow key pressed in the datatable.');
                    //                var element = $(":focus");
                    //                if (element) element.blur(); // If an element has the focus, call blur. This just makes this work better.
                    //                var selectedTrElement = $('.dataTable').find('.selected')[0]; // This finds the selected row in the datatable.
                    //                var newRowToSelect;
                    //                if (!selectedTrElement) {
                    //                    console.log('No row was selected, so selecting the first row.');
                    //                    newRowToSelect = $('.dataTable').find('tbody tr').first();
                    //                } else {
                    //                    newRowToSelect = $(selectedTrElement).prev('tr');
                    //                }
                    //                if (typeof newRowToSelect.click == "function") {
                    //                    console.log('UP arrow key was pressed. Calling click event for row ' + newRowToSelect.attr('id'));
                    //                    newRowToSelect.click.apply(newRowToSelect);
                    //                }
                    //                break;
                    //            case 40: // Down arrow.
                    //                console.log('DOWN arrow key pressed in the datatable.');
                    //                var element = $(":focus");
                    //                if (element) element.blur(); // If an element has the focus, call blur. This just makes this work better.
                    //                var selectedTrElement = $('.dataTable').find('.selected')[0]; // This finds the selected row in the datatable.
                    //                var newRowToSelect;
                    //                if (!selectedTrElement) {
                    //                    console.log('No row was selected, so selecting the first row.');
                    //                    newRowToSelect = $('.dataTable').find('tbody tr').first();
                    //                } else {
                    //                    var newRowToSelect = $(selectedTrElement).next('tr');
                    //                }
                    //                if (typeof newRowToSelect.click == "function") {
                    //                    console.log('DOWN arrow key was pressed. Calling click event for row ' + newRowToSelect.attr('id'));
                    //                    newRowToSelect.click.apply(newRowToSelect);
                    //                }
                    //                break;
                    //            case 13: // Enter key.
                    //                console.log('ENTER key pressed in the datatable. css.display: ' + $('.dataTable').css('display'));
                    //                var selectedTrElement = $(event.target).find('.selected'); // This finds the selected row in the datatable.
                    //                if (typeof selectedTrElement.dblclick == "function") {
                    //                    console.log('ENTER key has been pressed in the datatable. Calling dblclick for the selected row.');
                    //                    selectedTrElement.dblclick.apply(selectedTrElement);
                    //                }
                    //                break;
                    //        }
                    //    }
                    //}

                    //if ($('#view-details-container').css('display') == 'block') {
                    //    var element = $(event.target).closest('#view-details-container');
                    //    if (element) {
                    //        if (event.ctrlKey) {
                    //            if (event.keyCode === 37) { //ctrl-arrowleft
                    //                console.log('CNTRL-LEFT ARROW keys pressed in view-details-container.');
                    //                btnFirstTarget_Click();
                    //            } else if (event.keyCode === 39) { //ctrl-arrowright
                    //                console.log('CNTRL-RIGHT ARROW keys pressed in view-details-container.');
                    //                btnLastTarget_Click();
                    //            } else if (event.keyCode === 77) { //ctrl-m
                    //                console.log('CNTRL-M keys pressed in view-details-container.');
                    //                btnMatch_Click();
                    //            } else if (event.keyCode === 78) { //ctrl-n
                    //                console.log('CNTRL-N keys pressed in view-details-container.');
                    //                btnNoMatch_Click();
                    //            } else {
                    //                if (event.keyCode === 37) { //arrow left
                    //                    console.log('LEFT ARROW key pressed in view-details-container.');
                    //                    btnPrevTarget_Click();
                    //                } else if (event.keyCode === 39) { //arrow right
                    //                    console.log('RIGHT ARROW key pressed in view-details-container.');
                    //                    btnNextTarget_Click();
                    //                }
                    //            }
                    //        }
                    //    }
                    //}

                    //if ($('#view-table-container').css('display') == 'block') {
                    //    var element = $(event.target).closest('#view-table-container');
                    //    if (element) {
                    //        if (event.keyCode === 13) { //enter
                    //            console.log('ENTER key pressed in view-table-container.');
                    //            if (typeof selectedCredential != 'undefined') {
                    //                bwAdapter.InsertAuditEvent(selectedCredential, "Lead Direct Selected", null, null, null);
                    //                bwAdapter.lockCredential(selectedCredential.credentialInstanceId, onLockCredentialSuccess, onLockCredentialFail)
                    //            }
                    //        }
                    //    }
                    //}

                } catch (e) {
                    console.log('Exception in document.keydown(): ' + e.message + ', ' + e.stack);
                    displayAlertDialog('Exception in document.keydown(): ' + e.message + ', ' + e.stack);
                }
            });

            // https://developer.mozilla.org/en-US/docs/Web/API/Window/pagehide_event
            // The best event to use to signal the end of a user's session is the visibilitychange event. In browsers that don't support visibilitychange the pagehide event is the next-best alternative.
            window.onpagehide = function (event) {
                console.log('In bwKeypressAndMouseEventHandler.js.window.onpagehide().');

                event.stopImmediatePropagation(); // This is required in this case.
                event.stopPropagation(); // This prevents the user from clicking cntrl-w and closing the entire browser.
                event.preventDefault();


                //if (event.persisted) {
                //    /* the page isn't being discarded, so it can be reused later */
                //}


                //displayAlertDialog_QuickNotice('In bwKeypressAndMouseEventHandler.js.window.onpagehide().');

            };

            document.onvisibilitychange = function (event) {
                console.log('In bwKeypressAndMouseEventHandler.js.document.onvisibilitychange().');
                // https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilitychange_event

                event.stopImmediatePropagation(); // This is required in this case.
                event.stopPropagation(); // This prevents the user from clicking cntrl-w and closing the entire browser.
                event.preventDefault();


                //if (event.persisted) {
                //    /* the page isn't being discarded, so it can be reused later */
                //}


                //displayAlertDialog_QuickNotice('In bwKeypressAndMouseEventHandler.js.window.onpagehide().');

            };

            document.onunload = function (event) {

                event.stopImmediatePropagation(); // This is required in this case.
                event.stopPropagation(); // This prevents the user from clicking cntrl-w and closing the entire browser.
                event.preventDefault();


                //if (event.persisted) {
                //    /* the page isn't being discarded, so it can be reused later */
                //}

                alert('In bwKeypressAndMouseEventHandler.js.window.onunload().');
                //displayAlertDialog_QuickNotice('In bwKeypressAndMouseEventHandler.js.window.onunload().');

            };

            $(window).resize(function (event) { // THIS IS ALSO IN bwCircleDialog.js.renderCanvas(). SHOULD WE REMOVE IT FROM THERE?????????? 4-25-2023.
                try {
                    console.log('In bwKeypressAndMouseEventHandler.js.window.resize().');
                    //alert('In bwKeypressAndMouseEventHandler.js.window.resize().');





                    // Check if the slides are being displayed. If so, lets resize them to accomodate the current screen size. Slick!! :) 
                    // TURNED OFF/COMMENTED OUT 2-14-2023.
                    //if (document.getElementById('tableHowDoesItWorkCarousel1')) {
                    //    console.log('In bwKeypressAndMouseEventHandler.js.window.resize(). The carousel is displayed, so calling bwHowDoesItWorkCarousel.js.windowresize().');
                    //    $('.bwHowDoesItWorkCarousel3').bwHowDoesItWorkCarousel3('windowresize'); // Call this so the carousel can resize itself to accomodate the new window size. 
                    //}

                    // 12-23-2022 COMMENTED OUT THE displayAlertDialog() HERE. SEEMS OK?????????? <<<<<<<<<<<<<<<<<<<<<<
                    console.log('In bwKeypressAndMouseEventHandler.js.window.resize(). Calling adjustLeftSideMenu().');
                    //displayAlertDialog('Calling bwActiveMenu.adjustLeftSideMenu(). xcx123423521-8. THIS EVENT MAY GET CALLED A BUNCH OF TIMES, SO putting in this dialog so it can continue without the alert blocking... <<');
                    $('.bwActiveMenu').bwActiveMenu('adjustLeftSideMenu');


                    var widget = document.getElementsByClassName('bwEmailClient_Haraka');
                    if (!(widget.length && (widget.length > 0))) {
                        // It has not been instantiated.
                    } else {
                        $('.bwEmailClient_Haraka').bwEmailClient_Haraka('resize'); // If this widget is instantiated, it will get passed this event.
                    }





                    //if (window.opener) { // REMOVED THIS SECTION 4-25-2023.

                    //    //
                    //    // If we get here it is because this is a popped-out window, and the thing is being resized.
                    //    //

                    //    console.log('In bwKeypressAndMaouseEventHandler.js.window.resize(). Found window.opener!!!!!!!!!!!!!!!!!!! xcx12456');

                    //    var zoom = ((window.outerWidth) / (window.innerWidth + 10)).toFixed(2);
                    //    if (zoom != thiz.options.lastZoom) { // Using this to make sure we don't trigger the resize event a million times.

                    //        thiz.options.lastZoom = zoom;

                    //        // Now get the bounding rect, and resize the entire window...
                    //        //var rectElement = $(window.document).find('.budgetrequestform:first').find('.xdFormLayout')[0];
                    //        var rectElement = $('#budgetrequestform').find('.xdFormLayout')[0];

                    //        var rect = rectElement.getBoundingClientRect();

                    //        var height_not_baselined = rect.bottom - rect.top;
                    //        var width_not_baselined = rect.right - rect.left + 50; // Adding 50px to make up for the right scrollbar..?

                    //        var height = height_not_baselined * zoom;
                    //        var width = width_not_baselined * zoom;

                    //        window.resizeTo(width, height);

                    //        console.log('In bwKeypressAndMouseEventHandler.js.window.resize(). window.resizeTo width: ' + width + ', height: ' + height + ', zoom: ' + zoom);
                    //    }

                    //}


                } catch (e) {
                    console.log('Exception in bwKeypressAndMouseEventHandler.js._create().window.resize(): ' + e.message + ', ' + e.stack);
                    displayAlertDialog('Exception in bwKeypressAndMouseEventHandler.js._create().window.resize(): ' + e.message + ', ' + e.stack);
                }
            });

            $(window).blur(function (event) {
                try {

                    console.log('In bwKeypressAndMouseEventHandler._create.window.blur(). ?is this true? >> The request form is being closed. We need to check if the user may be losing any changes. This functionality is incomplete. Coming soon! xcx12312-3');
                    //alert('In bwKeypressAndMouseEventHandler._create.window.blur(). ?is this true? >> The request form is being closed. We need to check if the user may be losing any changes. This functionality is incomplete. Coming soon! xcx12312-3');

                    var x = $('#divUploadANewSmallCircleImageDialog').is(':visible');

                    console.log('In bwKeypressAndMouseEventHandler.js._create().window.blur(). divUploadANewSmallCircleImageDialog visible: ' + x);

                    //var x = $('#divUploadANewSmallCircleImageDialog').is(':visible');
                    //debugger;
                    ////
                    //// This element is in the bwCircleDialog for uploading org or participant images: inputFile_ForIdentifyingImage
                    //// This is the best place to catch this event without creating spaghetti.
                    ////
                    if ($('#divUploadANewSmallCircleImageDialog').is(':visible')) {
                        //    console.log('');
                        //    console.log('******************');
                        //    console.log('Calling HideActivitySpinner() because divUploadANewSmallCircleImageDialog is visible.');
                        //    console.log('******************');
                        //    console.log('');

                        //    HideActivitySpinner();









                        // 8-13-2022

                        // ShowActivitySpinner_FileUpload(); // 8-13-2022 got rid of this, popping up at a weird time in some cases

                        // IDEA <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< 8-13-2022
                        // if (activity spinner is displayed) {
                        //     hide it
                        // } else {
                        //     show it
                        // }
                        console.log('In bwKeypressAndMouseEventHandler.js.window.blur(). Doing a check: if activity spinner is displayed, hide it, else show it. xcx1234788 8-13-2022');
                        var activityDialog = document.getElementsByClassName('bwActivitySpinner');
                        if (activityDialog && activityDialog[0] && $(activityDialog[0]).is(':visible')) {
                            HideActivitySpinner_FileUpload();
                        } else {
                            //ShowActivitySpinner_FileUpload(); // removed this 12-6-2022
                        }











                        console.log('Setting divUploadANewSmallCircleImageDialog_JustWentBlur = true');
                        thiz.options.divUploadANewSmallCircleImageDialog_JustWentBlur = true;

                    }






                } catch (e) {
                    console.log('Exception in bwKeypressAndMouseEventHandler.js._create().window.blur(): ' + e.stack);
                    displayAlertDialog('Exception in bwKeypressAndMouseEventHandler.js._create().window.blur(): ' + e.stack);
                }
            });

            $(window).focus(function (event) {
                try {

                    var x = $('#divUploadANewSmallCircleImageDialog').is(':visible');

                    console.log('In bwKeypressAndMouseEventHandler.js._create().window.focus(). divUploadANewSmallCircleImageDialog visible: ' + x);





                    //3-12-2022 Hide the file upload activity spinner. When this event happens it is likely that the user has clicked the "Cancel" button on the file upload dialog.
                    //HideActivitySpinner_FileUpload(); // In bwKeypressAndMouseEventHandler.js._create().window.focus(). divUploadANewSmallCircleImageDialog visible: true






                    //debugger;
                    //
                    // This element is in the bwCircleDialog for uploading org or participant images: inputFile_ForIdentifyingImage
                    // This is the best place to catch this event without creating spaghetti.
                    //
                    if ($('#divUploadANewSmallCircleImageDialog').is(':visible')) {

                        if (thiz.options.divUploadANewSmallCircleImageDialog_JustWentBlur == true) {

                            //console.log('');
                            //console.log('******************');
                            //console.log('In bwKeypressAndMouseEventHandler.js._create().window.focus(). Calling HideActivitySpinner() because divUploadANewSmallCircleImageDialog is visible.');
                            //console.log('******************');
                            //console.log('');

                            //HideActivitySpinner();

                            //thiz.options.divUploadANewSmallCircleImageDialog_JustWentBlur = false;
                        }





                    }






                } catch (e) {
                    console.log('Exception in bwKeypressAndMouseEventHandler.js._create().window.focus(): ' + e.stack);
                    displayAlertDialog('Exception in bwKeypressAndMouseEventHandler.js._create().window.focus(): ' + e.stack);
                }
            });


            //function setHomeAndPersonalSettingsButtonHeights() {
            //    try {

            //        var y = window.scrollY;

            //        var divWelcomeButton_OriginalHeight = $('.bwActiveMenu').bwActiveMenu('option', 'divWelcomeButton_OriginalHeight');
            //        var divInnerLeftMenuButton_PersonalBehavior_OriginalHeight = $('.bwActiveMenu').bwActiveMenu('option', 'divInnerLeftMenuButton_PersonalBehavior_OriginalHeight');

            //        console.log('In bwKeypressAndMouseEventHandler.js.setHomeAndPersonalSettingsButtonHeights(). divWelcomeButton_OriginalHeight: ' + divWelcomeButton_OriginalHeight + ', divInnerLeftMenuButton_PersonalBehavior_OriginalHeight: ' + divInnerLeftMenuButton_PersonalBehavior_OriginalHeight + ', y: ' + y);

            //        var welcomeButton = document.getElementById('divWelcomeButton');
            //        var personalSettingsButton = document.getElementById('divInnerLeftMenuButton_PersonalBehavior');

            //        if (welcomeButton) {
            //            welcomeButton.style.height = String(divWelcomeButton_OriginalHeight + y) + 'px';
            //        }
            //        if (personalSettingsButton) {
            //            personalSettingsButton.style.height = String(divInnerLeftMenuButton_PersonalBehavior_OriginalHeight + y) + 'px';
            //        }

            //        thiz.options.documentScrollEvent.ticking = true;

            //    } catch (e) {
            //        console.log('Exception in bwKeypressAndMouseEventHandler.js.setHomeAndPersonalSettingsButtonHeights(): ' + e.message + ', ' + e.stack);
            //        displayAlertDialog('Exception in bwKeypressAndMouseEventHandler.js.setHomeAndPersonalSettingsButtonHeights(): ' + e.message + ', ' + e.stack);
            //    }
            //}

            //
            // This is supposed to work for mobile browsers to prevent our out of control scrolling issue... 11-4-2023. COMMENTED OUT 5-22-2024. <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
            //
            //$(document).on('touchmove', function (e) {
            //    try {
            //        // Yes this appears to work on the S23. 11-4-2023.

            //        e.returnValue = false;
            //        e.cancelBubble = true;
            //        e.preventDefault();
            //        e.stopPropagation();
            //        return false;

            //    } catch (e) {
            //        alert('Exception in touchmove: ' + e.message + ', ' + e.stack);
            //    }
            //});



            //
            // 5-22-2024.
            //
            //
            // THIS NEEDS MORE WORK. SEE HERE: https://developer.mozilla.org/en-US/docs/Web/API/Touch_events
            //

            document.addEventListener('touchstart', handleTouchStart, { passive: false }); // Since mobile Chrome >= 56 event listeners are passive by default and passive event listeners can't prevent defaults anymore. See here You have to use active event listeners instead like so: https://stackoverflow.com/questions/36212722/how-to-prevent-pull-down-to-refresh-of-mobile-chrome#42509310
            document.addEventListener('touchmove', handleTouchMove, { passive: false });

            var xDown = null;
            var yDown = null;

            var stopScrolling = false;

            function getTouches(e) {
                return e.touches ||             // browser API
                    e.originalEvent.touches; // jQuery
            }

            function handleTouchStart(e) {
                const firstTouch = getTouches(e)[0];
                xDown = firstTouch.clientX;
                yDown = firstTouch.clientY;
            };

            function displayPullDownPanel(touch_clientY) {
                return new Promise(function (resolve, reject) {
                    try {

                        //displayAlertDialog('DOWN SWIPE');
                        var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

                        var div = document.getElementById('divBwSwipeFromTopPanel');
                        if (!div) {
                            div = document.createElement('div');
                            div.id = 'divBwSwipeFromTopPanel';
                            div.style.display = 'none';
                            document.body.appendChild(div); // Place at end of document
                        }


                        var rect1 = document.body.getBoundingClientRect();

                        var html = '';

                        if (!participantId) {

                            // Not logged in. But, if the user is here, they likely expect that their username and password is set for this device (in localStorage) in the selected web browser.
                            //   This means they can:
                            //     - Auto-login and do these actions:
                            //       - Have audio notifications turned on for the device on this browser.
                            //       - All the other stuff listed below...
                            //
                            // Security-wise, it can SMS or email message the user every so often to let them know there has been this type of logon, and give them the opportunity to shut it down.
                            //   - It will shut it down immediately.
                            //

                            ////html += '<div id="divBwSwipeFromTopPanel_Panel" style="font-size:50pt;overflow:scroll;height:1500px;opacity:0.1;">SWIPE DOWN MENU'; // opacity is on the text, not the dialog grey background. Fix this! 5-26-2024. <<<<<<<<<<<<
                            //html += '<div id="divBwSwipeFromTopPanel_Panel" style="font-size:50pt;overflow:scroll;height:1500px;">SWIPE DOWN MENU1';
                            //html += '<br />';

                            //// Sign in.
                            //html += '<div style="font-weight:normal;color:skyblue;font-size:90pt;font-family:Courier New,Courier,Lucida Sans Typewriter,Lucida Typewriter,monospace;" ';
                            //html += ' onclick="$(\'.bwAuthentication\').bwAuthentication(\'logonWith_BudgetWorkflow_autologon\', \'VIEW_HOME\');$(\'#divBwSwipeFromTopPanel\').dialog(\'close\');">';
                            //html += 'Sign Inxcx6</div>';
                            //html += '<br />';

                            //// View Email.
                            //html += '<div style="font-weight:normal;color:cornflowerblue;font-size:90pt;font-family:Courier New,Courier,Lucida Sans Typewriter,Lucida Typewriter,monospace;" ';
                            //html += ' onclick="$(\'.bwAuthentication\').bwAuthentication(\'logonWith_BudgetWorkflow_autologon\', \'VIEW_EMAIL_INBOX\');$(\'#divBwSwipeFromTopPanel\').dialog(\'close\');">';
                            //html += 'View Email</div>';
                            //html += '<br />';

                            //// New Email.
                            //html += '<div style="font-weight:normal;color:royalblue;font-size:90pt;font-family:Courier New,Courier,Lucida Sans Typewriter,Lucida Typewriter,monospace;" ';
                            //html += ' onclick="$(\'.bwAuthentication\').bwAuthentication(\'logonWith_BudgetWorkflow_autologon\', \'VIEW_EMAIL_NEW\');$(\'#divBwSwipeFromTopPanel\').dialog(\'close\');">';
                            //html += 'New Email</div>';
                            //html += '<br />';

                            //// Paste Here
                            //html += '<div style="font-weight:normal;color:blue;font-size:90pt;font-family:Courier New,Courier,Lucida Sans Typewriter,Lucida Typewriter,monospace;" ';
                            //html += ' onclick="$(\'.bwAuthentication\').bwAuthentication(\'xxlogonWith_BudgetWorkflow_autologon\', \'xxVIEW_EMAIL_NEW\');$(\'#divBwSwipeFromTopPanel\').dialog(\'close\');">';
                            //html += 'PASTE HERE</div>';
                            //html += '<br />';

                            //// View User.
                            //html += '<div style="font-weight:normal;color:royalblue;font-size:90pt;font-family:Courier New,Courier,Lucida Sans Typewriter,Lucida Typewriter,monospace;" ';
                            //html += ' onclick="$(\'.bwAuthentication\').bwAuthentication(\'quickMenu_ViewUser\');$(\'#divBwSwipeFromTopPanel\').dialog(\'close\');">';
                            //html += 'View User</div>';
                            //html += '<br />';

                            //// Logout.
                            //html += '<div style="font-weight:normal;color:royalblue;font-size:90pt;font-family:Courier New,Courier,Lucida Sans Typewriter,Lucida Typewriter,monospace;" ';
                            //html += ' onclick="$(\'.bwAuthentication\').bwAuthentication(\'quickMenu_FavoriteLinks\');$(\'#divBwSwipeFromTopPanel\').dialog(\'close\');">';
                            //html += 'Favorite Links</div>';
                            //html += '<br />';

                            //// Play Music.
                            //html += '<div style="font-weight:normal;color:royalblue;font-size:90pt;font-family:Courier New,Courier,Lucida Sans Typewriter,Lucida Typewriter,monospace;" ';
                            //html += ' onclick="$(\'.bwAuthentication\').bwAuthentication(\'quickMenu_PlayMusic\');$(\'#divBwSwipeFromTopPanel\').dialog(\'close\');">';
                            //html += 'Play Music</div>';
                            //html += '<br />';

                            //// Watch Video.
                            //html += '<div style="font-weight:normal;color:royalblue;font-size:90pt;font-family:Courier New,Courier,Lucida Sans Typewriter,Lucida Typewriter,monospace;" ';
                            //html += ' onclick="$(\'.bwAuthentication\').bwAuthentication(\'quickMenu_WatchVideo\');$(\'#divBwSwipeFromTopPanel\').dialog(\'close\');">';
                            //html += 'Watch Video</div>';

                            //html += '<br />';
                            //html += '<br />';
                            //html += '<br />';
                            //html += '<span style="font-size:12pt;">';
                            //html += 'window.scrollY: ' + window.scrollY;
                            //html += '<br />'; //
                            //html += 'USE THIS TO FINE TUNE? <br />touch_clientY: ' + touch_clientY;
                            //html += '<br />'; // touch_clientY
                            ////html += 'window.pageYOffset: ' + window.pageYOffset;
                            ////html += '<br />';
                            ////html += 'document.scrollTop: ' + document.scrollTop;
                            ////html += '<br />';
                            ////html += 'document.offsetTop: ' + document.offsetTop;
                            ////html += '<br />';
                            ////html += 'document.documentElement.scrollTop: ' + document.documentElement.scrollTop;
                            ////html += '<br />';
                            //html += 'rect1.top: ' + rect1.top;
                            //html += '</span>';
                            //html += '<br />';
                            //html += '<br />';
                            //html += '<br />';
                            //html += '[now we need to decide what is going here...]';
                            //html += '<br />';
                            //html += '<br />';
                            //html += '<br />';
                            //html += '</div>';





























                            html += '<div id="divBwSwipeFromTopPanel_Panel" style="font-size:50pt;overflow:scroll;height:1500px;">';

                //            html += `<span style="color:black;font-size:10pt;">Your username and password have been remembered in this browser, so that you can quickly access these things: <br /> [customize these things...]</span><br /><br />


                //    <table><tr><td style="vertical-align:top;">


                //`;

                            html += `           <table >
                                <tr onclick="$('.bwAuthentication').bwAuthentication('logonWith_BudgetWorkflow_autologon', 'VIEW_HOME');" style="cursor:pointer;">
                                    <td style="height:105px;width:15px;display:inline-block;" class="brushedAluminum_orange">&nbsp;</td>
                                    <td style="height:105px;width:5px;opacity:0;display:inline-block;">&nbsp;</td>
                                    <td style="height:61px;width:315px;display:inline-block;padding-left:15px;padding-top:25px;padding-bottom:0;color:white;font-size:24pt;" class="brushedAluminum_orange">HOME</td>
                                </tr>
                                </table>`;

                            html += '       <br />';
                            //html += '       <br />';

                            html += `           <table >
                                <tr onclick="$('.bwAuthentication').bwAuthentication('logonWith_BudgetWorkflow_autologon', 'VIEW_EMAIL_INBOX');" style="cursor:pointer;">
                                    <td style="height:105px;width:15px;display:inline-block;" class="brushedAluminum_orange">&nbsp;</td>
                                    <td style="height:105px;width:5px;opacity:0;display:inline-block;">&nbsp;</td>
                                    <td style="height:61px;width:315px;display:inline-block;padding-left:15px;padding-top:25px;padding-bottom:0;color:white;font-size:24pt;" class="brushedAluminum_orange">EMAIL</td>
                                </tr>
                                </table>`;

                            html += '       <br />';
                            //html += '       <br />';


                            html += `           <table >
                                <tr onclick="$('.bwAuthentication').bwAuthentication('quickMenu_PlayMusic');" style="cursor:pointer;">
                                    <td style="height:105px;width:15px;display:inline-block;" class="brushedAluminum_orange">&nbsp;</td>
                                    <td style="height:105px;width:5px;opacity:0;display:inline-block;">&nbsp;</td>
                                    <td style="height:61px;width:315px;display:inline-block;padding-left:15px;padding-top:25px;padding-bottom:0;color:white;font-size:24pt;" class="brushedAluminum_orange">MUSIC</td>
                                </tr>
                                </table>`;

                            html += '       <br />';
                            //html += '       <br />';

                            html += `           <table >
                                <tr onclick="$('.bwAuthentication').bwAuthentication('displaySignInDialog', true);" style="cursor:pointer;">
                                    <td style="height:105px;width:15px;display:inline-block;" class="brushedAluminum_orange">&nbsp;</td>
                                    <td style="height:105px;width:5px;opacity:0;display:inline-block;">&nbsp;</td>
                                    <td style="height:61px;width:315px;display:inline-block;padding-left:15px;padding-top:25px;padding-bottom:0;color:white;font-size:24pt;" class="brushedAluminum_orange">SIGN IN</td>
                                </tr>
                                </table>`;


                            html += '       <br />';
                            //html += '       <br />';

                            html += `           <table >
                                <tr onclick="$('.bwAuthentication').bwAuthentication('displayCreateFreeAccountDialog', true);" style="cursor:pointer;">
                                    <td style="height:105px;width:15px;display:inline-block;" class="brushedAluminum_orange">&nbsp;</td>
                                    <td style="height:105px;width:5px;opacity:0;display:inline-block;">&nbsp;</td>
                                    <td style="height:61px;width:315px;display:inline-block;padding-left:15px;padding-top:25px;padding-bottom:0;color:white;font-size:24pt;" class="brushedAluminum_orange">SIGN UP</td>
                                </tr>
                                </table>`;

                            html += '       <br />';
                            //html += '       <br />';

                            html += `           <table >
                                <tr onclick="window.location='https://patreon.com/shareandcollaborate';" style="cursor:pointer;">
                                    <td style="height:105px;width:15px;display:inline-block;" class="brushedAluminum_orange">&nbsp;</td>
                                    <td style="height:105px;width:5px;opacity:0;display:inline-block;">&nbsp;</td>
                                    <td style="height:61px;width:315px;display:inline-block;padding-left:15px;padding-top:25px;padding-bottom:0;color:white;font-size:24pt;" class="brushedAluminum_orange">Follow at Patreon</td>
                                </tr>
                                </table>`;

                            html += '<br />';

                            //html += `           <table >
                            //    <tr onclick="window.location='https://patreon.com/shareandcollaborate';" style="cursor:pointer;">
                            //        <td style="height:105px;width:15px;display:inline-block;" class="brushedAluminum_orange">&nbsp;</td>
                            //        <td style="height:105px;width:5px;opacity:0;display:inline-block;">&nbsp;</td>
                            //        <td style="height:61px;width:315px;display:inline-block;padding-left:15px;padding-top:25px;padding-bottom:0;color:white;font-size:24pt;" class="brushedAluminum_orange">Set Alarm/Training Schedule.</td>
                            //    </tr>
                            //    </table>`;

                       


                            html += '</div>';

                        } else {

                            //
                            //
                            // Logged in.
                            //
                            //

                            html += '<div id="divBwSwipeFromTopPanel_Panel" style="font-size:50pt;overflow:scroll;height:1500px;">';

                            //            html += `<span style="color:black;font-size:10pt;">Your username and password have been remembered in this browser, so that you can quickly access these things: <br /> [customize these things...]</span><br /><br />


                            //    <table><tr><td style="vertical-align:top;">


                            //`;

                            html += `           <table >
                                <tr onclick="$('.bwAuthentication').bwAuthentication('cmdSignOut');" style="cursor:pointer;">
                                    <td style="height:105px;width:15px;display:inline-block;" class="brushedAluminum_orange">&nbsp;</td>
                                    <td style="height:105px;width:5px;opacity:0;display:inline-block;">&nbsp;</td>
                                    <td style="height:61px;width:315px;display:inline-block;padding-left:15px;padding-top:25px;padding-bottom:0;color:white;font-size:24pt;" class="brushedAluminum_orange">SIGN OUT</td>
                                </tr>
                                </table>`;

                            html += '       <br />';
                            //html += '       <br />';

                            html += `           <table >
                                <tr onclick="$('.bwActiveMenu').bwActiveMenu('RenderContentForButton', this, 'MESSAGING2');$('#divBwSwipeFromTopPanel').dialog('close');" style="cursor:pointer;">
                                    <td style="height:105px;width:15px;display:inline-block;" class="brushedAluminum_orange">&nbsp;</td>
                                    <td style="height:105px;width:5px;opacity:0;display:inline-block;">&nbsp;</td>
                                    <td style="height:61px;width:315px;display:inline-block;padding-left:15px;padding-top:25px;padding-bottom:0;color:white;font-size:24pt;" class="brushedAluminum_orange">VIEW EMAIL</td>
                                </tr>
                                </table>`;

                            html += '       <br />';
                            //html += '       <br />';


                            html += `           <table >
                                <tr onclick="$('.bwAuthentication').bwAuthentication('logonWith_BudgetWorkflow_autologon', 'VIEW_EMAIL_NEW');$('#divBwSwipeFromTopPanel').dialog('close');" style="cursor:pointer;">
                                    <td style="height:105px;width:15px;display:inline-block;" class="brushedAluminum_orange">&nbsp;</td>
                                    <td style="height:105px;width:5px;opacity:0;display:inline-block;">&nbsp;</td>
                                    <td style="height:61px;width:315px;display:inline-block;padding-left:15px;padding-top:25px;padding-bottom:0;color:white;font-size:24pt;" class="brushedAluminum_orange">NEW EMAIL</td>
                                </tr>
                                </table>`;

                            html += '       <br />';
                            //html += '       <br />';

                            html += `           <table >
                                <tr onclick="$('.bwNotificationSound').bwNotificationSound('slideOutAndDisplayNotificationsPanel');$('#divBwSwipeFromTopPanel').dialog('close');" style="cursor:pointer;">
                                    <td style="height:105px;width:15px;display:inline-block;" class="brushedAluminum_orange">&nbsp;</td>
                                    <td style="height:105px;width:5px;opacity:0;display:inline-block;">&nbsp;</td>
                                    <td style="height:61px;width:315px;display:inline-block;padding-left:15px;padding-top:25px;padding-bottom:0;color:white;font-size:24pt;" class="brushedAluminum_orange">NOTIFICATIONS</td>
                                </tr>
                                </table>`;


                            html += '       <br />';
                            //html += '       <br />';

                            html += `           <table >
                                <tr onclick="" style="cursor:pointer;">
                                    <td style="height:105px;width:15px;display:inline-block;" class="brushedAluminum_orange">&nbsp;</td>
                                    <td style="height:105px;width:5px;opacity:0;display:inline-block;">&nbsp;</td>
                                    <td style="height:61px;width:315px;display:inline-block;padding-left:15px;padding-top:25px;padding-bottom:0;color:white;font-size:24pt;" class="brushedAluminum_orange">MUTE/UNMUTE</td>
                                </tr>
                                </table>`;

                            html += '       <br />';
                            //html += '       <br />';

                            html += `           <table >
                                <tr onclick="$('.bwNotificationSound').bwNotificationSound('volumeControl_OnClick');$('#divBwSwipeFromTopPanel').dialog('close');" style="cursor:pointer;">
                                    <td style="height:105px;width:15px;display:inline-block;" class="brushedAluminum_orange">&nbsp;</td>
                                    <td style="height:105px;width:5px;opacity:0;display:inline-block;">&nbsp;</td>
                                    <td style="height:61px;width:315px;display:inline-block;padding-left:15px;padding-top:25px;padding-bottom:0;color:white;font-size:24pt;" class="brushedAluminum_orange">VOLUME CONTROL</td>
                                </tr>
                                </table>`;

                            html += '<br />';

                            //html += `           <table >
                            //    <tr onclick="window.location='https://patreon.com/shareandcollaborate';" style="cursor:pointer;">
                            //        <td style="height:105px;width:15px;display:inline-block;" class="brushedAluminum_orange">&nbsp;</td>
                            //        <td style="height:105px;width:5px;opacity:0;display:inline-block;">&nbsp;</td>
                            //        <td style="height:61px;width:315px;display:inline-block;padding-left:15px;padding-top:25px;padding-bottom:0;color:white;font-size:24pt;" class="brushedAluminum_orange">Set Alarm/Training Schedule.</td>
                            //    </tr>
                            //    </table>`;




                            html += '</div>';







                            //html += '<div id="divBwSwipeFromTopPanel_Panel" style="font-size:50pt;overflow:scroll;height:1500px;">SWIPE DOWN MENU2';
                            //html += '<br />';
                            //html += '<br />';
                            //html += '<div style="font-weight:normal;color:skyblue;font-size:90pt;font-family:Courier New,Courier,Lucida Sans Typewriter,Lucida Typewriter,monospace" onclick="$(\'.bwAuthentication\').bwAuthentication(\'cmdSignOut\');">Sign Out</div>';
                            //html += '<br />';
                            //html += '<br />';
                            //html += '<div style="font-weight:normal;color:cornflowerblue;font-size:90pt;font-family:Courier New,Courier,Lucida Sans Typewriter,Lucida Typewriter,monospace" onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForButton\', this, \'MESSAGING2\');$(\'#divBwSwipeFromTopPanel\').dialog(\'close\');">View Email</div>';
                            //html += '<br />';
                            //html += '<br />';
                            //html += '<div style="font-weight:normal;color:royalblue;font-size:90pt;font-family:Courier New,Courier,Lucida Sans Typewriter,Lucida Typewriter,monospace" onclick="$(\'.bwAuthentication\').bwAuthentication(\'logonWith_BudgetWorkflow_autologon\', \'VIEW_EMAIL_NEW\');$(\'#divBwSwipeFromTopPanel\').dialog(\'close\');">New Email</div>';
                            //html += '<br />';
                            //html += '<br />';
                            //html += '<div style="font-weight:bold;color:blue;" onclick="$(\'.bwNotificationSound\').bwNotificationSound(\'slideOutAndDisplayNotificationsPanel\');$(\'#divBwSwipeFromTopPanel\').dialog(\'close\');">[VIEW NOTIFICATIONS]</div>';
                            //html += '<br />';
                            //html += '<br />';
                            //html += '<div style="font-weight:bold;color:blue;" onclick="$(\'.bwNotificationSound\').bwNotificationSound(\'volumeControl_OnClick\');$(\'#divBwSwipeFromTopPanel\').dialog(\'close\');">[MUTE/UNMUTE]</div>[VOLUME CONTROL]';
                            //html += '<br />';
                            //html += '<br />';
                            //html += '<div style="font-weight:bold;color:blue;" onclick="alert(\'This functionality is incomplete. Coming soon!\');$(\'#divBwSwipeFromTopPanel\').dialog(\'close\');">[xxx]</div>';
                            //html += '<br />';
                            //html += '<br />';
                            //html += '<span style="font-size:12pt;">';
                            //html += 'window.scrollY: ' + window.scrollY;
                            //html += '<br />'; // 
                            //html += 'USE THIS TO FINE TUNE? <br />touch_clientY: ' + touch_clientY;
                            //html += '<br />'; // touch_clientY
                            ////html += 'window.pageYOffset: ' + window.pageYOffset; 
                            ////html += '<br />';
                            ////html += 'document.scrollTop: ' + document.scrollTop;
                            ////html += '<br />';
                            ////html += 'document.offsetTop: ' + document.offsetTop; 
                            ////html += '<br />';
                            ////html += 'document.documentElement.scrollTop: ' + document.documentElement.scrollTop;
                            ////html += '<br />';
                            //html += 'rect1.top: ' + rect1.top;
                            //html += '</span>';
                            //html += '<br />';
                            //html += '<br />';
                            //html += '<br />';
                            //html += '[now we need to decide what is going here...]';
                            //html += '<br />';
                            //html += '<br />';
                            //html += '<br />';
                            //html += '</div>';

                        }

                        div.innerHTML = html;

                        $('#divBwSwipeFromTopPanel').dialog({
                            modal: true,
                            resizable: false,
                            draggable: false,
                            width: "500",
                            show: { effect: 'slide', direction: 'up' },
                            position: {
                                my: "left top",
                                //at: "right-100 bottom",
                                at: "right+15 bottom",
                                of: $('#divLeftMenuHeader')
                            },
                            open: function (event, ui) {





                                $('.ui-widget-overlay').bind('click', function () { $("#divBwSwipeFromTopPanel").dialog('close'); });





                            }, // This allows the dialog to close when clicked outside of the dialog. Only works for modal dialogs.
                            close: function () {
                                $('#divBwSwipeFromTopPanel').dialog('destroy');
                            }
                        });
                        $('#divBwSwipeFromTopPanel').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();

                        $('#divBwSwipeFromTopPanel').dialog().parents('.ui-dialog').css('opacity', '0.85'); // This is the opacity of the dialog. It makes it semi-transparent, which is how a top bar swipe-down menu should be. :) 5-26-2024.
                        $('#divBwSwipeFromTopPanel').dialog().parents('.ui-dialog').css('background-color', 'black'); // 'cornflowerblue'); // This is the opacity of the dialog. It makes it semi-transparent, which is how a top bar swipe-down menu should be. :) 5-26-2024.

                        //div.requestFullscreen();


                    } catch (e) {

                        var msg = 'Exception in bwKeypressAndMouseEventHandler.js.displayPullDownPanel(): ' + e.message + ', ' + e.stack;
                        console.log(msg);
                        displayAlertDialog(msg);

                        var result = {
                            status: 'EXCEPTION',
                            message: msg
                        }
                        reject(result);

                    }

                })

            }

            function handleTouchMove(e) {
                if (!xDown || !yDown) {
                    return;
                }

                var xUp = e.touches[0].clientX;
                var yUp = e.touches[0].clientY;

                var xDiff = xDown - xUp;
                var yDiff = yDown - yUp;

                if (Math.abs(xDiff) > Math.abs(yDiff)) {/*most significant*/
                    if (xDiff > 0) {
                        /* left swipe */
                        console.log('LEFT SWIPE xcx231242');
                    } else {
                        /* right swipe */
                        console.log('RIGHT SWIPE xcx231242');
                    }
                } else {
                    if (yDiff > 0) {
                        /* up swipe */
                        //console.log('UP SWIPE xcx231242');
                        //displayAlertDialog('UP SWIPE');


                        var div = document.getElementById('divBwSwipeFromTopPanel_Panel');
                        if (div) {

                            document.body.scrollIntoView();

                            function handleScroll1(e) {

                                //displayAlertDialog('IN div SCROLL.');

                                $("#divBwSwipeFromTopPanel").dialog('close');

                                e.cancelBubble = true; // << NOT THIS ONE
                                e.preventDefault(); // << NOT THIS ONE
                                e.stopPropagation(); // << NOT THIS ONE
                                e.returnValue = false; // Both of these are required to prevent the pull down to refresh behavior on mobile.
                                return false; // Both of these are required to prevent the pull down to refresh behavior on mobile.



                            }


                            // Attach to the element scroll event, so that we can stop the propogation of it.
                            div.addEventListener('scroll', handleScroll1, { passive: false });




                            //$("#divBwSwipeFromTopPanel").dialog('close');

                            //stopScrolling = true;







                            setTimeout(function () {

                                div.removeEventListener('scroll', handleScroll1, { passive: false });

                                //stopScrolling = false; // Let scrolling resume.

                            }, 1000);

                            //e.cancelBubble = true; // << NOT THIS ONE
                            //e.preventDefault(); // << NOT THIS ONE
                            //e.stopPropagation(); // << NOT THIS ONE
                            //e.returnValue = false; // Both of these are required to prevent the pull down to refresh behavior on mobile.
                            //return false; // Both of these are required to prevent the pull down to refresh behavior on mobile.


                        }










                    } else {
                        /* down swipe */


                        // One of these is what works. Along with { passive: false } in the addEventListener.
                        //e.cancelBubble = true; // << NOT THIS ONE
                        //e.preventDefault(); // << NOT THIS ONE
                        //e.stopPropagation(); // << NOT THIS ONE

                        //
                        //
                        // THIS IS HOW WE PREVENT THE SCROLL-DOWN-TO-REFRESH-BROWSER behavior. 5-22-2024.
                        //
                        //
                        //if (window.scrollY < 10) {
                        //if (window.pageYOffset < 5) {

                        //if (window.scrollY < 10) {
                        //if (window.scrollY == 0) {

                        var rect1 = document.body.getBoundingClientRect();
                        if ((window.scrollY < 10) || (!window.scrollY && (rect1.top < 10))) {

                            //
                            //
                            // THIS IS WHERE WE DISPLAY THE DRAG-FROM-TOP SCREEN. 5-22-2024.
                            //
                            //
                            //

                            //window.scrollTo(0, 0); // Get rid of the last little bit at the top.
                            document.body.scrollIntoView();

                            if (e.touches[0].clientY < 150) { // THIS ENSURES THE USER HAS TO SWIPE AT THE TOP. 150 seems Ok on my S23.
                                displayPullDownPanel(e.touches[0].clientY);
                            }

                            e.returnValue = false; // Both of these are required to prevent the pull down to refresh behavior on mobile.
                            return false; // Both of these are required to prevent the pull down to refresh behavior on mobile.

                        } else if (document.scrollTop && (document.scrollTop < 10)) {

                            displayAlertDialog('xcx231231 document.scrollTop: ' + document.scrollTop);
                            window.scrollTo(0, 0); // Get rid of the last little bit at the top.

                            e.returnValue = false; // Both of these are required to prevent the pull down to refresh behavior on mobile.
                            return false; // Both of these are required to prevent the pull down to refresh behavior on mobile.

                        } else {

                            //displayAlertDialog('DOWN SWIPE xcx34-12');




                        }

                    }
                }
                /* reset values */
                xDown = null;
                yDown = null;
            };



            //$(document).scroll(function (e) {

            //    if (stopScrolling == true) {

            //        document.body.scrollIntoView();

            //        e.cancelBubble = true; // << NOT THIS ONE
            //        e.preventDefault(); // << NOT THIS ONE
            //        e.stopPropagation(); // << NOT THIS ONE
            //        e.returnValue = false; // Both of these are required to prevent the pull down to refresh behavior on mobile.
            //        return false; // Both of these are required to prevent the pull down to refresh behavior on mobile.


            //    }
            //    //displayAlertDialog('scroll');
            //    //e.cancelBubble = true; // << NOT THIS ONE
            //    //e.preventDefault(); // << NOT THIS ONE
            //    //e.stopPropagation(); // << NOT THIS ONE
            //    //e.returnValue = false; // Both of these are required to prevent the pull down to refresh behavior on mobile.
            //    //return false; // Both of these are required to prevent the pull down to refresh behavior on mobile.

            //});

            //document.addEventListener('scroll', handleScroll, { passive: false });

            //function handleScroll(e) {
            //    console.log('xcx12312431 In handleScroll().');
            //    //displayAlertDialog('SCROLL');


            //    //
            //    //IF THE PANEL IS BEING DISPLAYED, PREVENT SCROLLING.
            //    //

            //    //if (stopScrolling == true) {

            //        e.cancelBubble = true; // << NOT THIS ONE
            //        e.preventDefault(); // << NOT THIS ONE
            //        e.stopPropagation(); // << NOT THIS ONE
            //        e.returnValue = false; // Both of these are required to prevent the pull down to refresh behavior on mobile.
            //        return false; // Both of these are required to prevent the pull down to refresh behavior on mobile.

            //    //}

            //}









            //
            //
            // COMMENTED THE CODE OUT BELOW. DO WE STILL NEED SOME OF IT???? 5-22-2024.
            //
            //

            $(document).scroll(function (event) {
                try {
                    console.log('In bwKeypressAndMouseEventHandler.js.document.scroll(). thiz.options.allowScrollAdjustments: ' + thiz.options.allowScrollAdjustments); // event.target: ' + event.target);

                    





                    // IMPROVED THIS SO IT DOESN't AUTO-SCROLL on a small device. 8-9-2023.
                    if (thiz.options.allowScrollAdjustments == null) {

                        thiz.options.allowScrollAdjustments = true; // Using this value as a 3-state.

                        // This is in /css/my.css.
                        //.stop-scrolling {
                        //    height: 100 %;
                        //    overflow: hidden;
                        //}

                        //Add the class then remove when you want to re-enable scrolling, tested in IE, FF, Safari and Chrome.

                        $('body').addClass('stop-scrolling');
                        //$('body').bind('touchmove', function (e) { e.preventDefault() });
                        var welcomeButton = document.getElementById('divWelcomeButton');
                        var divWelcomeButton_OriginalHeight = $('.bwActiveMenu').bwActiveMenu('option', 'divWelcomeButton_OriginalHeight');
                        var y = window.scrollY;
                        welcomeButton.style.height = String(divWelcomeButton_OriginalHeight + y - 50) + 'px'; // 11-4-2023

                        //setTimeout(function () {
                        $('body').removeClass('stop-scrolling');
                        //}, 10);




                    } else if (thiz.options.allowScrollAdjustments == true) {

                        thiz.options.allowScrollAdjustments = false;

                        // CURRENTLY THE LEFT MENU ONLY WORKS ON SCROLL ON THE WELCOME SCREEN.
                        console.log('CURRENTLY THE LEFT MENU ONLY WORKS ON SCROLL ON THE WELCOME SCREEN.');

                        var welcomeButton = document.getElementById('divWelcomeButton');
                        if (welcomeButton) {

                            var y = window.scrollY;

                            if (y < thiz.options.LastKnownScrollPosition) {

                                // SCROLLING UP.
                                //console.log('In bwKeypressAndMouseEventHandler.js.document.scroll(). SCROLLING UP.');

                            } else {

                                //displayAlertDialog('xcx23132 LastKnownScrollPosition: ' + thiz.options.LastKnownScrollPosition + ', y: ' + y);
                                // SCROLLING DOWN.

                                //
                                // This is where we need to figure out if we need to call the web service to download more requests.
                                //

                                // For example, is this element currently on the screen?
                                // <div id="divBwExecutiveSummariesCarousel_MyPendingTasks" class="bwAccordionDrawer" bwaccordiondrawertype="MY_PENDING_TASKS" style="display: inline;">

                                var drawerElement = document.getElementById('divBwExecutiveSummariesCarousel_MyPendingTasks');
                                if (!(drawerElement && drawerElement.getBoundingClientRect())) {

                                    //var msg = 'Error! xcx21325999. !(drawerElement && drawerElement.getBoundingClientRect()).';
                                    //console.log(msg);

                                } else {
                                    var drawerRect = drawerElement.getBoundingClientRect();

                                    if ((y > drawerRect.top) && (y < drawerRect.bottom)) {

                                        //
                                        // When the top of the drawer hits the top of the screen, we start thinking about getting more data...
                                        //

                                        console.log('When the top of the drawer hits the top of the screen, we start thinking about getting more data... SCROLLING MY PENDING TASKS. GET READY TO GET MORE DATA.');


                                        var executiveSummaries = $('#divBwExecutiveSummariesCarousel_MyPendingTasks').find('.executiveSummaryInCarousel');
                                        //for (var i = 0; i < executiveSummaries.length; i++) {
                                        for (var i = (executiveSummaries.length - 1); i > -1; i--) {

                                            var rect = executiveSummaries[i].getBoundingClientRect();
                                            if ((y > rect.top) && (y < rect.bottom)) {

                                                //
                                                // When the top of the executive summary hits the top of the screen...
                                                //

                                                //displayAlertDialog('Executive summary count: ' + i + '. THIS Executive Summary is being displayed: ' + executiveSummaries[i].getAttribute('bwbudgetrequestid'));
                                                console.log('Executive summary count: ' + i + '. THIS Executive Summary is being displayed: ' + executiveSummaries[i].getAttribute('bwbudgetrequestid'));


                                                var recordsLength = 25;
                                                if ((i + 15) > recordsLength) {

                                                    displayAlertDialog_Persistent('Executive summary count: ' + i + '. recordsLength: ' + recordsLength + '. IT IS TIME TO LOAD THE NEXT PAGE OF REQUESTS.');

                                                }



                                                break;

                                            }

                                        }

                                    } else {

                                        console.log('In bwKeypressAndMouseEventHandler.js.document.scroll(). y: ' + y + ', window.innerHeight: ' + window.innerHeight + ', rect: ' + JSON.stringify(rect) + '. SCROLLING DOWN. This is where we need to figure out if we need to call the web service to download more requests.');

                                    }

                                }

                            }

                            // Scrolling down. We need to lengthen the Welcome button.

                            var divWelcomeButton_OriginalHeight = $('.bwActiveMenu').bwActiveMenu('option', 'divWelcomeButton_OriginalHeight');

                            //console.log('divWelcomeButton_OriginalHeight: ' + divWelcomeButton_OriginalHeight);


                            //
                            //
                            //console.log('WE USED TO DISPLAY THIS IN THE TOP BAR. PUT THIS BACK FOR TROUBLESHOOTING. 12-13-2023.');
                            //$('#divTopBar_Long_Error').html('divWelcomeButton_LastKnownHeight: ' + divWelcomeButton_OriginalHeight + ', scrollY: ' + y);
                            //
                            //



                            //
                            //
                            // This is a very important line, because it is resolved after a lot of troubleshooting. Note that we are subtracting "25" in this equation...
                            //    this prevents the left side menu from getting too long and forcing a scroll event, which produces a very undesireable auto-scroll effect. This is the fix!
                            //
                            // >>>>>>>> WELL NOT QUITE - THIS DEPENDS ON THE ZOOM LEVEL THE USER HAS SELECTED IN THE BROWSER, WHICH RESULTS IN DIFFERENT BEHAVIOUR. <<<<<<<<<<<
                            //
                            // ALSO THE VALUE FOR THIS setTimeout(), which is at 1000 at the moment. 11-4-2023.
                            //
                            // From: https://stackoverflow.com/questions/4770025/how-to-disable-scrolling-temporarily
                            //
                            // Do it simply by adding a class to the body:
                            // .stop-scrolling {
                            //   height: 100%;
                            //   overflow: hidden;
                            // }
                            // Add the class then remove when you want to re-enable scrolling, tested in IE, FF, Safari and Chrome.
                            // $('body').addClass('stop-scrolling')
                            //
                            // For mobile devices, you'll need to handle the touchmove event:
                            // $('body').bind('touchmove', function(e){e.preventDefault()})
                            //
                            // And unbind to re-enable scrolling. Tested in iOS6 and Android 2.3.3
                            // $('body').unbind('touchmove')
                            //
                            $('body').addClass('stop-scrolling');
                            //$('body').bind('touchmove', function (e) { e.preventDefault() });

                            var height = Number(divWelcomeButton_OriginalHeight) + Number(y) - 50;

                            console.log('Setting divWelcomeButton height: ' + height + ', original height: ' + divWelcomeButton_OriginalHeight + ', y: ' + y);

                            welcomeButton.style.height = String(height) + 'px'; // 11-4-2023

                            //setTimeout(function () {
                            $('body').removeClass('stop-scrolling');
                            //$('body').unbind('touchmove');
                            //}, 10);


                            thiz.options.LastKnownScrollPosition = y;

                            thiz.options.allowScrollAdjustments = null;

                        }




                        var personalSettingsButton = document.getElementById('divInnerLeftMenuButton_PersonalBehavior');
                        if (personalSettingsButton) {

                            var y = window.scrollY;

                            if (y < thiz.options.LastKnownScrollPosition) {

                                // SCROLLING UP.
                                //console.log('In bwKeypressAndMouseEventHandler.js.document.scroll(). SCROLLING UP.');

                            } else {

                                //displayAlertDialog('xcx23132 LastKnownScrollPosition: ' + thiz.options.LastKnownScrollPosition + ', y: ' + y);
                                // SCROLLING DOWN.


                            }

                            // Scrolling down. We need to lengthen the Welcome button.

                            var divInnerLeftMenuButton_PersonalBehavior_OriginalHeight = $('.bwActiveMenu').bwActiveMenu('option', 'divInnerLeftMenuButton_PersonalBehavior_OriginalHeight');

                            //console.log('divInnerLeftMenuButton_PersonalBehavior_OriginalHeight: ' + divInnerLeftMenuButton_PersonalBehavior_OriginalHeight);


                            //
                            //
                            //console.log('WE USED TO DISPLAY THIS IN THE TOP BAR. PUT THIS BACK FOR TROUBLESHOOTING. 12-13-2023.');
                            //$('#divTopBar_Long_Error').html('divWelcomeButton_LastKnownHeight: ' + divInnerLeftMenuButton_PersonalBehavior_OriginalHeight + ', scrollY: ' + y);
                            //
                            //



                            //
                            //
                            // This is a very important line, because it is resolved after a lot of troubleshooting. Note that we are subtracting "25" in this equation...
                            //    this prevents the left side menu from getting too long and forcing a scroll event, which produces a very undesireable auto-scroll effect. This is the fix!
                            //
                            // >>>>>>>> WELL NOT QUITE - THIS DEPENDS ON THE ZOOM LEVEL THE USER HAS SELECTED IN THE BROWSER, WHICH RESULTS IN DIFFERENT BEHAVIOUR. <<<<<<<<<<<
                            //
                            // ALSO THE VALUE FOR THIS setTimeout(), which is at 1000 at the moment. 11-4-2023.
                            //
                            // From: https://stackoverflow.com/questions/4770025/how-to-disable-scrolling-temporarily
                            //
                            // Do it simply by adding a class to the body:
                            // .stop-scrolling {
                            //   height: 100%;
                            //   overflow: hidden;
                            // }
                            // Add the class then remove when you want to re-enable scrolling, tested in IE, FF, Safari and Chrome.
                            // $('body').addClass('stop-scrolling')
                            //
                            // For mobile devices, you'll need to handle the touchmove event:
                            // $('body').bind('touchmove', function(e){e.preventDefault()})
                            //
                            // And unbind to re-enable scrolling. Tested in iOS6 and Android 2.3.3
                            // $('body').unbind('touchmove')
                            //
                            $('body').addClass('stop-scrolling');
                            //$('body').bind('touchmove', function (e) { e.preventDefault() });

                            var height = Number(divInnerLeftMenuButton_PersonalBehavior_OriginalHeight) + Number(y) - 50;
                            if (height < divInnerLeftMenuButton_PersonalBehavior_OriginalHeight) {
                                // Just set the height to the original height.
                                personalSettingsButton.style.height = String(divInnerLeftMenuButton_PersonalBehavior_OriginalHeight) + 'px';
                            } else {
                                personalSettingsButton.style.height = String(height) + 'px';
                            }

                            console.log('Setting divInnerLeftMenuButton_PersonalBehavior height: ' + height + ', original height: ' + divInnerLeftMenuButton_PersonalBehavior_OriginalHeight + ', y: ' + y);

                            //personalSettingsButton.style.height = String(height) + 'px'; // 11-4-2023

                            //setTimeout(function () {
                            $('body').removeClass('stop-scrolling');
                            //$('body').unbind('touchmove');
                            //}, 10);


                            thiz.options.LastKnownScrollPosition = y;

                            thiz.options.allowScrollAdjustments = null;

                        }





                        //
                        //
                        // Messaging > New Message button in bwEMailClient_haraka.js. 6-25-2024.
                        //
                        //

                        var messagingNewMessageButton = document.getElementById('divInnerLeftMenuButton_NewMessage');
                        if (messagingNewMessageButton) {

                            var y = window.scrollY;

                            if (y < thiz.options.LastKnownScrollPosition) {

                                // SCROLLING UP.
                                //console.log('In bwKeypressAndMouseEventHandler.js.document.scroll(). SCROLLING UP.');

                            } else {

                                //displayAlertDialog('xcx23132 LastKnownScrollPosition: ' + thiz.options.LastKnownScrollPosition + ', y: ' + y);
                                // SCROLLING DOWN.


                            }

                            // Scrolling down. We need to lengthen the Welcome button.

                            //var divInnerLeftMenuButton_PersonalBehavior_OriginalHeight = $('.bwActiveMenu').bwActiveMenu('option', 'divInnerLeftMenuButton_PersonalBehavior_OriginalHeight');
                            var divInnerLeftMenuButton_NewMessage_OriginalHeight = $('.bwActiveMenu').bwActiveMenu('option', 'divInnerLeftMenuButton_NewMessage_OriginalHeight');

                            //console.log('divInnerLeftMenuButton_PersonalBehavior_OriginalHeight: ' + divInnerLeftMenuButton_PersonalBehavior_OriginalHeight);


                            //
                            //
                            //console.log('WE USED TO DISPLAY THIS IN THE TOP BAR. PUT THIS BACK FOR TROUBLESHOOTING. 12-13-2023.');
                            //$('#divTopBar_Long_Error').html('divWelcomeButton_LastKnownHeight: ' + divInnerLeftMenuButton_PersonalBehavior_OriginalHeight + ', scrollY: ' + y);
                            //
                            //



                            //
                            //
                            // This is a very important line, because it is resolved after a lot of troubleshooting. Note that we are subtracting "25" in this equation...
                            //    this prevents the left side menu from getting too long and forcing a scroll event, which produces a very undesireable auto-scroll effect. This is the fix!
                            //
                            // >>>>>>>> WELL NOT QUITE - THIS DEPENDS ON THE ZOOM LEVEL THE USER HAS SELECTED IN THE BROWSER, WHICH RESULTS IN DIFFERENT BEHAVIOUR. <<<<<<<<<<<
                            //
                            // ALSO THE VALUE FOR THIS setTimeout(), which is at 1000 at the moment. 11-4-2023.
                            //
                            // From: https://stackoverflow.com/questions/4770025/how-to-disable-scrolling-temporarily
                            //
                            // Do it simply by adding a class to the body:
                            // .stop-scrolling {
                            //   height: 100%;
                            //   overflow: hidden;
                            // }
                            // Add the class then remove when you want to re-enable scrolling, tested in IE, FF, Safari and Chrome.
                            // $('body').addClass('stop-scrolling')
                            //
                            // For mobile devices, you'll need to handle the touchmove event:
                            // $('body').bind('touchmove', function(e){e.preventDefault()})
                            //
                            // And unbind to re-enable scrolling. Tested in iOS6 and Android 2.3.3
                            // $('body').unbind('touchmove')
                            //
                            $('body').addClass('stop-scrolling');
                            //$('body').bind('touchmove', function (e) { e.preventDefault() });

                            var height = Number(divInnerLeftMenuButton_NewMessage_OriginalHeight) + Number(y) - 50;
                            if (height < divInnerLeftMenuButton_NewMessage_OriginalHeight) {
                                // Just set the height to the original height.
                                messagingNewMessageButton.style.height = String(divInnerLeftMenuButton_NewMessage_OriginalHeight) + 'px';
                            } else {
                                messagingNewMessageButton.style.height = String(height) + 'px';
                            }

                            //console.log('Setting divInnerLeftMenuButton_PersonalBehavior height xcx1-2: ' + height + ', original height: ' + divInnerLeftMenuButton_NewMessage_OriginalHeight + ', y: ' + y);
                            console.log('Setting divInnerLeftMenuButton_NewMessage height: ' + height + ', original height: ' + divInnerLeftMenuButton_NewMessage_OriginalHeight + ', y: ' + y);

                            //messagingNewMessageButton.style.height = String(height) + 'px'; // 11-4-2023

                            //setTimeout(function () {
                            $('body').removeClass('stop-scrolling');
                            //$('body').unbind('touchmove');
                            //}, 10);


                            thiz.options.LastKnownScrollPosition = y;

                            thiz.options.allowScrollAdjustments = null;

                        }











                        var documentationIntroductionButton = document.getElementById('divInnerLeftMenuButton_Introduction');
                        if (documentationIntroductionButton) {

                            var y = window.scrollY;

                            if (y < thiz.options.LastKnownScrollPosition) {

                                // SCROLLING UP.
                                //console.log('In bwKeypressAndMouseEventHandler.js.document.scroll(). SCROLLING UP.');

                            } else {

                                //displayAlertDialog('xcx23132 LastKnownScrollPosition: ' + thiz.options.LastKnownScrollPosition + ', y: ' + y);
                                // SCROLLING DOWN.


                            }

                            // Scrolling down. We need to lengthen the Welcome button.

                            var divInnerLeftMenuButton_Introduction_OriginalHeight = $('.bwActiveMenu').bwActiveMenu('option', 'divInnerLeftMenuButton_Introduction_OriginalHeight');

                            //console.log('divInnerLeftMenuButton_PersonalBehavior_OriginalHeight: ' + divInnerLeftMenuButton_PersonalBehavior_OriginalHeight);


                            //
                            //
                            //console.log('WE USED TO DISPLAY THIS IN THE TOP BAR. PUT THIS BACK FOR TROUBLESHOOTING. 12-13-2023.');
                            //$('#divTopBar_Long_Error').html('divWelcomeButton_LastKnownHeight: ' + divInnerLeftMenuButton_PersonalBehavior_OriginalHeight + ', scrollY: ' + y);
                            //
                            //



                            //
                            //
                            // This is a very important line, because it is resolved after a lot of troubleshooting. Note that we are subtracting "25" in this equation...
                            //    this prevents the left side menu from getting too long and forcing a scroll event, which produces a very undesireable auto-scroll effect. This is the fix!
                            //
                            // >>>>>>>> WELL NOT QUITE - THIS DEPENDS ON THE ZOOM LEVEL THE USER HAS SELECTED IN THE BROWSER, WHICH RESULTS IN DIFFERENT BEHAVIOUR. <<<<<<<<<<<
                            //
                            // ALSO THE VALUE FOR THIS setTimeout(), which is at 1000 at the moment. 11-4-2023.
                            //
                            // From: https://stackoverflow.com/questions/4770025/how-to-disable-scrolling-temporarily
                            //
                            // Do it simply by adding a class to the body:
                            // .stop-scrolling {
                            //   height: 100%;
                            //   overflow: hidden;
                            // }
                            // Add the class then remove when you want to re-enable scrolling, tested in IE, FF, Safari and Chrome.
                            // $('body').addClass('stop-scrolling')
                            //
                            // For mobile devices, you'll need to handle the touchmove event:
                            // $('body').bind('touchmove', function(e){e.preventDefault()})
                            //
                            // And unbind to re-enable scrolling. Tested in iOS6 and Android 2.3.3
                            // $('body').unbind('touchmove')
                            //
                            $('body').addClass('stop-scrolling');
                            //$('body').bind('touchmove', function (e) { e.preventDefault() });

                            var height = Number(divInnerLeftMenuButton_Introduction_OriginalHeight) + Number(y) - 50;
                            if (height < divInnerLeftMenuButton_Introduction_OriginalHeight) {
                                // Just set the height to the original height.
                                documentationIntroductionButton.style.height = String(divInnerLeftMenuButton_Introduction_OriginalHeight) + 'px';
                            } else {
                                documentationIntroductionButton.style.height = String(height) + 'px';
                            }

                            console.log('Setting divInnerLeftMenuButton_Introduction height: ' + height + ', original height: ' + divInnerLeftMenuButton_Introduction_OriginalHeight + ', y: ' + y);

                            //personalSettingsButton.style.height = String(height) + 'px'; // 11-4-2023

                            //setTimeout(function () {
                            $('body').removeClass('stop-scrolling');
                            //$('body').unbind('touchmove');
                            //}, 10);


                            thiz.options.LastKnownScrollPosition = y;

                            thiz.options.allowScrollAdjustments = null;

                        }






















                        //setTimeout(function () {

                        //var welcomeButton = document.getElementById('divWelcomeButton');
                        //if (welcomeButton) {

                        //    var y = window.scrollY;

                        //    if (y < thiz.options.LastKnownScrollPosition) {

                        //        // SCROLLING UP.
                        //        //console.log('In bwKeypressAndMouseEventHandler.js.document.scroll(). SCROLLING UP.');

                        //    } else {

                        //        //displayAlertDialog('xcx23132 LastKnownScrollPosition: ' + thiz.options.LastKnownScrollPosition + ', y: ' + y);
                        //        // SCROLLING DOWN.

                        //        //
                        //        // This is where we need to figure out if we need to call the web service to download more requests.
                        //        //

                        //        // For example, is this element currently on the screen?
                        //        // <div id="divBwExecutiveSummariesCarousel_MyPendingTasks" class="bwAccordionDrawer" bwaccordiondrawertype="MY_PENDING_TASKS" style="display: inline;">

                        //        var drawerElement = document.getElementById('divBwExecutiveSummariesCarousel_MyPendingTasks');
                        //        var drawerRect = drawerElement.getBoundingClientRect();

                        //        if ((y > drawerRect.top) && (y < drawerRect.bottom)) {

                        //            //
                        //            // When the top of the drawer hits the top of the screen, we start thinking about getting more data...
                        //            //

                        //            console.log('When the top of the drawer hits the top of the screen, we start thinking about getting more data... SCROLLING MY PENDING TASKS. GET READY TO GET MORE DATA.');


                        //            var executiveSummaries = $('#divBwExecutiveSummariesCarousel_MyPendingTasks').find('.executiveSummaryInCarousel');
                        //            //for (var i = 0; i < executiveSummaries.length; i++) {
                        //            for (var i = (executiveSummaries.length - 1); i > -1; i--) {

                        //                var rect = executiveSummaries[i].getBoundingClientRect();
                        //                if ((y > rect.top) && (y < rect.bottom)) {

                        //                    //
                        //                    // When the top of the executive summary hits the top of the screen...
                        //                    //

                        //                    //displayAlertDialog('Executive summary count: ' + i + '. THIS Executive Summary is being displayed: ' + executiveSummaries[i].getAttribute('bwbudgetrequestid'));
                        //                    console.log('Executive summary count: ' + i + '. THIS Executive Summary is being displayed: ' + executiveSummaries[i].getAttribute('bwbudgetrequestid'));


                        //                    var recordsLength = 25;
                        //                    if ((i + 15) > recordsLength) {

                        //                        displayAlertDialog_Persistent('Executive summary count: ' + i + '. recordsLength: ' + recordsLength + '. IT IS TIME TO LOAD THE NEXT PAGE OF REQUESTS.');

                        //                    }



                        //                    break;

                        //                }

                        //            }

                        //        } else {

                        //            console.log('In bwKeypressAndMouseEventHandler.js.document.scroll(). y: ' + y + ', window.innerHeight: ' + window.innerHeight + ', rect: ' + JSON.stringify(rect) + '. SCROLLING DOWN. This is where we need to figure out if we need to call the web service to download more requests.');

                        //        }

                        //    }

                        //    // Scrolling down. We need to lengthen the Welcome button.

                        //    var divWelcomeButton_OriginalHeight = $('.bwActiveMenu').bwActiveMenu('option', 'divWelcomeButton_OriginalHeight');

                        //    console.log('divWelcomeButton_OriginalHeight: ' + divWelcomeButton_OriginalHeight);

                        //    $('#divTopBar_Long_Error').html('divWelcomeButton_LastKnownHeight: ' + divWelcomeButton_OriginalHeight + ', scrollY: ' + y);

                        //    //
                        //    //
                        //    // This is a very important line, because it is resolved after a lot of troubleshooting. Note that we are subtracting "25" in this equation...
                        //    //    this prevents the left side menu from getting too long and forcing a scroll event, which produces a very undesireable auto-scroll effect. This is the fix!
                        //    //
                        //    // >>>>>>>> WELL NOT QUITE - THIS DEPENDS ON THE ZOOM LEVEL THE USER HAS SELECTED IN THE BROWSER, WHICH RESULTS IN DIFFERENT BEHAVIOUR. <<<<<<<<<<<
                        //    //
                        //    // ALSO THE VALUE FOR THIS setTimeout(), which is at 1000 at the moment. 11-4-2023.
                        //    //
                        //    $('body').addClass('stop-scrolling');
                        //    welcomeButton.style.height = String(divWelcomeButton_OriginalHeight + y - 50) + 'px'; // 11-4-2023

                        //    //setTimeout(function () {
                        //    //    $('body').removeClass('stop-scrolling');
                        //    //}, 10);


                        //    thiz.options.LastKnownScrollPosition = y;

                        //    thiz.options.allowScrollAdjustments = null;

                        //}

                        //}, 1000); // 1000);

                    }


                    //var welcomeButton = document.getElementById('divWelcomeButton');
                    //if (welcomeButton) {

                    //    var y = window.scrollY;
                    //    var divWelcomeButton_OriginalHeight = $('.bwActiveMenu').bwActiveMenu('option', 'divWelcomeButton_OriginalHeight');

                    //    if (!thiz.options.divWelcomeButton_LastKnownHeight) { 
                    //        thiz.options.divWelcomeButton_LastKnownHeight = Number(welcomeButton.style.height.split('px')[0]); // Initialize the value.
                    //    }


                    //    console.log('LastKnownHeight: ' + thiz.options.divWelcomeButton_LastKnownHeight);

                    //    if ((divWelcomeButton_OriginalHeight + y) > thiz.options.divWelcomeButton_LastKnownHeight) {
                    //        welcomeButton.style.height = String(divWelcomeButton_OriginalHeight + y) + 'px';
                    //        thiz.options.divWelcomeButton_LastKnownHeight = Number(divWelcomeButton_OriginalHeight + y); // Remember the latest value.
                    //    }

                    //}

                    //}

                    //if (!thiz.options.documentScrollEvent.ticking) {

                    //    thiz.options.documentScrollEvent.ticking = true; // This stops things...

                    //    //var lastKnownScrollPosition = window.scrollY;

                    //    window.requestAnimationFrame(function () {
                    //        setHomeAndPersonalSettingsButtonHeights();

                    //    });



                    //}



                    // old removed 8-9-2023.
                    //var y = window.scrollY;

                    //if (y) {

                    //    var divWelcomeButton_OriginalHeight = $('.bwActiveMenu').bwActiveMenu('option', 'divWelcomeButton_OriginalHeight');
                    //    var divInnerLeftMenuButton_PersonalBehavior_OriginalHeight = $('.bwActiveMenu').bwActiveMenu('option', 'divInnerLeftMenuButton_PersonalBehavior_OriginalHeight');

                    //    console.log('In bwKeypressAndMouseEventHandler.js.document.scroll(). event.target: ' + event.target + ', divWelcomeButton_OriginalHeight: ' + divWelcomeButton_OriginalHeight + ', divInnerLeftMenuButton_PersonalBehavior_OriginalHeight: ' + divInnerLeftMenuButton_PersonalBehavior_OriginalHeight + ', window.scrollY: ' + window.scrollY);

                    //    var welcomeButton = document.getElementById('divWelcomeButton');
                    //    var personalSettingsButton = document.getElementById('divInnerLeftMenuButton_PersonalBehavior');

                    //    if (welcomeButton) {
                    //        welcomeButton.style.height = String(divWelcomeButton_OriginalHeight + y) + 'px';
                    //    }
                    //    if (personalSettingsButton) {
                    //        personalSettingsButton.style.height = String(divInnerLeftMenuButton_PersonalBehavior_OriginalHeight + y) + 'px';
                    //    }

                    //}

                } catch (e) {
                    console.log('Exception in bwKeypressAndMouseEventHandler.js.document.scroll(): ' + e.message + ', ' + e.stack);
                    displayAlertDialog('Exception in bwKeypressAndMouseEventHandler.js.document.scroll(): ' + e.message + ', ' + e.stack);
                }
            });




        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT INITIALIZE bwKeypressAndMouseEventHandler</span>';
            html += '<br />';
            html += '<span style="">Exception in bwKeypressAndMouseEventHandler.Create(): ' + e.message + ', ' + e.stack + '</span>';

            displayAlertDialog(html);

            this.element.html(html);
        }
    },


    //    function swipedetect(el, callback) {
    //    displayAlertDialog('swipedetect');
    //    var touchsurface = el,
    //    swipedir,
    //    startX,
    //    startY,
    //    distX,
    //    distY,
    //    threshold = 150, //required min distance traveled to be considered swipe
    //    restraint = 100, // maximum distance allowed at the same time in perpendicular direction
    //    allowedTime = 300, // maximum time allowed to travel that distance
    //    elapsedTime,
    //    startTime,
    //    handleswipe = callback || function (swipedir) {
    //    }

    //    touchsurface.addEventListener('touchstart', function (e) {
    //        var touchobj = e.changedTouches[0]
    //        swipedir = 'none'
    //        dist = 0
    //        startX = touchobj.pageX
    //        startY = touchobj.pageY
    //        startTime = new Date().getTime() // record time when finger first makes contact with surface
    //        e.preventDefault()
    //    }, false)

    //    touchsurface.addEventListener('touchmove', function (e) {
    //        e.preventDefault() // prevent scrolling when inside DIV
    //    }, false)

    //    touchsurface.addEventListener('touchend', function (e) {
    //        var touchobj = e.changedTouches[0]
    //        distX = touchobj.pageX - startX // get horizontal dist traveled by finger while in contact with surface
    //        distY = touchobj.pageY - startY // get vertical dist traveled by finger while in contact with surface
    //        elapsedTime = new Date().getTime() - startTime // get time elapsed
    //        if (elapsedTime <= allowedTime) { // first condition for awipe met
    //            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) { // 2nd condition for horizontal swipe met
    //                swipedir = (distX < 0) ? 'left' : 'right' // if dist traveled is negative, it indicates left swipe
    //            }
    //            else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) { // 2nd condition for vertical swipe met
    //                swipedir = (distY < 0) ? 'up' : 'down' // if dist traveled is negative, it indicates up swipe
    //            }
    //        }
    //        handleswipe(swipedir)
    //        e.preventDefault()
    //    }, false)
    //}

    ////USAGE:
    //    /*
    //    var el = document.getElementById('someel')
    //    swipedetect(el, function(swipedir){
    //        swipedir contains either "none", "left", "right", "top", or "down"
    //        if (swipedir =='left')
    //            displayAlertDialog('You just swiped left!')
    //    })
    //    */






    // TODD: ADD A CATCH FOR F5!!!!<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    //function carriagereturnpress(e, functioncall) {
    //console.log('In index.js.carriagereturnpress(). This method has been disabled, using bwKeypresAndMouseEventHandler.js widget instead.');
    //alert('In index.js.carriagereturnpress(). This method has been disabled, using bwKeypresAndMouseEventHandler.js widget instead.');
    //// This is used for the custom logon.
    //var evt = e || window.event
    //// "e" is the standard behavior (FF, Chrome, Safari, Opera),
    //// while "window.event" (or "event") is IE's behavior
    //if (evt.keyCode === 13) {
    //    // Do something
    //    //logonWith_BudgetWorkflow();
    //    eval(functioncall)(); // Call the specified method.
    //    // You can disable the form submission this way:
    //    //return false
    //}
    //}



    //    function fadeIn(elem, ms) {
    //    if(!elem)
    //        return;

    //    elem.style.opacity = 0;
    //    elem.style.filter = "alpha(opacity=0)";
    //    elem.style.display = "inline-block";
    //    elem.style.visibility = "visible";

    //    if(ms) {
    //        var opacity = 0;
    //        var timer = setInterval(function () {
    //            opacity += 50 / ms;
    //            if (opacity >= 1) {
    //                clearInterval(timer);
    //                opacity = 1;
    //            }
    //            elem.style.opacity = opacity;
    //            elem.style.filter = "alpha(opacity=" + opacity * 100 + ")";
    //        }, 50);
    //    }
    //    else {
    //        elem.style.opacity = 1;
    //        elem.style.filter = "alpha(opacity=1)";
    //    }
    //}


    attachScrollEventHandlerForBwFormsEditorToolbox: function (dialogElement, positioningTargetId) { // positioningTargetId: 'budgetrequestform'
        try {
            console.log('In bwKeypressAndMouseEventHandler.js.attachScrollEventHandlerForBwFormsEditorToolbox(). THIS IS THE ONLY PLACE WHERE WE HANDLE THE scroll event so that we keep the forms editor toolbox on the screen and in the optimum position for dragging and dropping. The TrashBin always needs to be available!');
            var thiz = this;

            var targetRect = document.getElementById(positioningTargetId).getBoundingClientRect();
            var targetRight = targetRect.right;
            var targetTop = targetRect.top;

            if (targetTop > 100) { // 100 is the offset from the top of the window.
                // Initialize the position of the toolbox.
                $(dialogElement).parent().position({ my: 'left top', at: targetRight + ' ' + targetTop, of: $(document) });
            }

            document.addEventListener("scroll", function (event) {
                thiz.options.documentScrollEvent.lastKnownScrollPosition = window.scrollY;

                console.log('1:In bwKeypressAndMouseEventHandler.js.attachScrollEventHandlerForBwFormsEditorToolbox.document.scroll(). lastKnownScrollPosition: ' + thiz.options.documentScrollEvent.lastKnownScrollPosition);

                var targetRect = document.getElementById(positioningTargetId).getBoundingClientRect();
                var targetRight = targetRect.right;
                var targetTop = targetRect.top;

                var toolbox = $(dialogElement).parent();
                var toolboxPosition = toolbox.position();
                var toolboxTop = toolboxPosition.top;

                if (targetTop > 100) { // 100 is the offset from the top of the window.
                    // Do nothing, let the toolbox stick where it is...
                } else {
                    //$(dialogElement).parent().position({ my: 'left top', at: targetRight + '-100' + ' top+100', of: $(window) }); // 100 is the offset from the top of the window.
                    $(dialogElement).parent().position({ my: 'left top', at: targetRight + ' top+100', of: $(window) }); // 100 is the offset from the top of the window.
                }

                console.log('xcx213123-2 targetTop: ' + targetTop + ', toolboxTop: ' + toolboxTop);

                if (!thiz.options.documentScrollEvent.ticking) {
                    //window.requestAnimationFrame(function () {
                    //    doSomething(lastKnownScrollPosition);
                    //    thiz.documentScrollEvent.ticking = false;
                    //});
                    console.log('2:In bwKeypressAndMouseEventHandler.js.attachScrollEventHandlerForBwFormsEditorToolbox.document.scroll(). lastKnownScrollPosition: ' + thiz.options.documentScrollEvent.lastKnownScrollPosition);

                    thiz.options.documentScrollEvent.ticking = false; // This starts things..
                }
            });

            return true;

        } catch (e) {
            console.log('Exception in bwKeypressAndMouseEventHandler.js.attachScrollEventHandlerForBwFormsEditorToolbox(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwKeypressAndMouseEventHandler.js.attachScrollEventHandlerForBwFormsEditorToolbox(): ' + e.message + ', ' + e.stack);
            return false;
        }
    },
    attachKeypressHandlerFor: function (filename) {
        try {
            console.log('In bwKeypressAndMouseEventHandler.js.attachKeypressHandlerFor(). filename: ' + filename);

            switch (filename) {
                case 'bw-adjudication.js':

                    $(document).bind('keydown', function (event) { // We are using keydown because that is the only way to find out what element we are coming from. We use event.preventDefault() below to prevent the keyup from happening.
                        try {
                            var elementId = $(event.target).attr('id');
                            if (!elementId) {
                                elementId = 'undefined';
                            }
                            switch (event.keyCode) {
                                case 9: // TAB key.
                                    // We are catching the tab key so the user can navigate through the screen ok.
                                    console.log('In bwKeypressAndMouseEventHandler.attachKeypressHandlerFor.document.keydown(). TAB key has been pressed. The element is id: ' + elementId);
                                    // CHECK HERE FOR THE "Release" modal dialog. We want nice tabbing in the dialog as well. :)
                                    var releaseModalDialog;
                                    var dialogId;
                                    if (elementId == 'undefined') {
                                        // Check if the modal dialog is displayed. This only happens when the focus is off of the modal dialog.
                                        var allDialogs = $(document).find('.ui-dialog');
                                        for (var i = 0; i < allDialogs.length; i++) {
                                            tmpDialogId = $(allDialogs[i]).attr('aria-describedby');
                                            if (tmpDialogId && (['dlgAdj1Approve', 'dlgAdj2Approve', 'dlgInvApprove'].indexOf(tmpDialogId) > -1)) {
                                                if ($('#' + tmpDialogId).css('display') == 'block') {
                                                    console.log('Dialog "' + tmpDialogId + '" is currently displayed.');
                                                    dialogId = tmpDialogId;
                                                    break;
                                                }
                                            }
                                        }
                                    } else {
                                        // This is where the focus is on the modal dialog.
                                        releaseModalDialog = $('#' + elementId).closest('.ui-dialog');
                                        dialogId = $(releaseModalDialog).attr('aria-describedby');
                                    }

                                    if (dialogId && (['dlgAdj1Approve', 'dlgAdj2Approve', 'dlgInvApprove'].indexOf(dialogId) > -1)) {
                                        // The modal dialog is displayed! Now lets figure out which button should be selected.
                                        console.log('The modal dialog "' + dialogId + '" is displayed, so handle the TAB key appropriately.');
                                        var ourButtonsArray = ['redirectToDLIO', 'btnOnlyPrimary', 'btnOnlyAlt', 'btnBoth', 'cancel'];
                                        for (var i = 0; i < ourButtonsArray.length; i++) {
                                            if ($('#' + dialogId).find('#' + ourButtonsArray[i]).hasClass('bwKeypressAndMouseEventHandlerStyle_OrangeBorderForElementOn_Focus_Active') != true) {
                                                $('#' + dialogId).find('#' + ourButtonsArray[i]).addClass('bwKeypressAndMouseEventHandlerStyle_OrangeBorderForElementOn_Focus_Active'); // Add the class to all of these. Then when they are active, our orange border will be applied.
                                            }
                                        }
                                        if (ourButtonsArray.indexOf(elementId) > -1) {
                                            // do nothing
                                        } else {
                                            elementId = 'undefined';
                                        }
                                        switch (elementId) { // We know which element we are coming from, so here we determine which will be the next element selected.
                                            case 'undefined':
                                                // do nothing.
                                                break;
                                            case 'redirectToDLIO':
                                                if ($('#' + dialogId).find('#btnOnlyPrimary').length) {
                                                    console.log('Setting focus on btnOnlyPrimary. $(releaseModalDialog): ' + $('#' + dialogId).html());
                                                    $('#' + dialogId).find('#btnOnlyPrimary').focus();
                                                    event.preventDefault(); // This stops the keyup from happening.
                                                } else if ($('#' + dialogId).find('#btnOnlyAlt').length) {
                                                    console.log('Setting focus on btnOnlyAlt.');
                                                    $('#' + dialogId).find('#btnOnlyAlt').focus();
                                                    event.preventDefault(); // This stops the keyup from happening.
                                                } else if ($('#' + dialogId).find('#btnBoth').length) {
                                                    console.log('Setting focus on btnBoth.');
                                                    $('#' + dialogId).find('#btnBoth').focus();
                                                    event.preventDefault(); // This stops the keyup from happening.
                                                } else if ($('#' + dialogId).find('#cancel').length) {
                                                    console.log('Setting focus on cancel.');
                                                    $('#' + dialogId).find('#cancel').focus();
                                                    event.preventDefault(); // This stops the keyup from happening.
                                                }
                                                break;
                                            case 'btnOnlyPrimary':
                                                if ($('#' + dialogId).find('#btnOnlyAlt').length) {
                                                    console.log('Setting focus on btnOnlyAlt.');
                                                    $('#' + dialogId).find('#btnOnlyAlt').focus(); // 3
                                                    event.preventDefault(); // This stops the keyup from happening.
                                                } else if ($('#' + dialogId).find('#btnBoth').length) {
                                                    console.log('Setting focus on btnBoth.');
                                                    $('#' + dialogId).find('#btnBoth').focus(); // 3
                                                    event.preventDefault(); // This stops the keyup from happening.
                                                } else if ($('#' + dialogId).find('#cancel').length) {
                                                    console.log('Setting focus on cancel.');
                                                    $('#' + dialogId).find('#cancel').focus(); // 3
                                                    event.preventDefault(); // This stops the keyup from happening.
                                                }
                                                break;
                                            case 'btnOnlyAlt':
                                                if ($('#' + dialogId).find('#btnBoth').length) {
                                                    console.log('Setting focus on btnBoth.');
                                                    $('#' + dialogId).find('#btnBoth').focus(); // 3
                                                    event.preventDefault(); // This stops the keyup from happening.
                                                } else if ($('#' + dialogId).find('#cancel').length) {
                                                    console.log('Setting focus on cancel.');
                                                    $('#' + dialogId).find('#cancel').focus(); // 3
                                                    event.preventDefault(); // This stops the keyup from happening.
                                                }
                                                break;
                                            case 'btnBoth':
                                                if ($('#' + dialogId).find('#btnBoth').length) {
                                                    console.log('Setting focus on btnBoth.');
                                                    $('#' + dialogId).find('#btnBoth').focus(); // 3
                                                    event.preventDefault(); // This stops the keyup from happening.
                                                } else if ($('#' + dialogId).find('#cancel').length) {
                                                    console.log('Setting focus on cancel.');
                                                    $('#' + dialogId).find('#cancel').focus(); // 3
                                                    event.preventDefault(); // This stops the keyup from happening.
                                                }
                                                break;
                                            case 'cancel':
                                                // do nothing
                                                break;
                                        }
                                    } else {
                                        // THERE IS NO MODAL DIALIOG, so handle the screen elements accordingly.
                                        console.log('THERE IS NO MODAL DIALOG, so handle the screen elements accordingly.');
                                        // Here is the tab order from the requirements  
                                        // btnMatch // 1 may not be present
                                        // btnNoMatch // 2 may not be present
                                        // btnAdjApprove // 3 always present
                                        // btnAdjEscalate // 4 always present
                                        // btnLeadTypeN // 5 may not be present
                                        // btnLeadTypeR // 6 may not be present
                                        // ProbeNewNote // 7 always present
                                        // btnProbeSaveNote // 8 always present
                                        var ourButtonsArray = ['btnMatch', 'btnNoMatch', 'btnAdjApprove', 'btnAdjEscalate', 'btnLeadTypeN', 'btnLeadTypeR', 'ProbeNewNote', 'btnProbeSaveNote'];
                                        for (var i = 0; i < ourButtonsArray.length; i++) {
                                            $('#' + ourButtonsArray[i]).addClass('bwKeypressAndMouseEventHandlerStyle_OrangeBorderForElementOn_Focus_Active'); // Add the class to all of these. Then when they are active, our orange border will be applied.
                                        }
                                        if (ourButtonsArray.indexOf(elementId) > -1) {
                                            // do nothing
                                        } else {
                                            elementId = 'undefined';
                                        }
                                        switch (elementId) { // We know which element we are coming from, so here we determine which will be the next element selected.
                                            case 'undefined':
                                                if ($('#btnMatch').length) {
                                                    console.log('Setting focus on btnMatch.');
                                                    $('#btnMatch').focus(); // 3
                                                    event.preventDefault(); // This stops the keyup from happening.
                                                } else if ($('#btnNoMatch').length) {
                                                    console.log('Setting focus on btnNoMatch.');
                                                    $('#btnNoMatch').focus(); // 3
                                                    event.preventDefault(); // This stops the keyup from happening.
                                                } else {
                                                    console.log('Setting focus on btnAdjApprove.');
                                                    $('#btnAdjApprove').focus(); // 3
                                                    event.preventDefault(); // This stops the keyup from happening.
                                                }
                                                break;
                                            case 'btnMatch':
                                                if ($('#btnNoMatch').length) {
                                                    console.log('Setting focus on btnNoMatch.');
                                                    $('#btnNoMatch').focus(); // 3
                                                    event.preventDefault(); // This stops the keyup from happening.
                                                } else {
                                                    console.log('Setting focus on btnAdjApprove.');
                                                    $('#btnAdjApprove').focus(); // 3
                                                    event.preventDefault(); // This stops the keyup from happening.
                                                }
                                                break;
                                            case 'btnNoMatch':
                                                console.log('Setting focus on btnAdjApprove.');
                                                $('#btnAdjApprove').focus(); // 3
                                                event.preventDefault(); // This stops the keyup from happening.
                                                break;
                                            case 'btnAdjApprove':
                                                console.log('Setting focus on btnAdjEscalate.');
                                                $('#btnAdjEscalate').focus(); // 4
                                                event.preventDefault(); // This stops the keyup from happening.
                                                break;
                                            case 'btnAdjEscalate':
                                                if ($('#btnLeadTypeN').length) {
                                                    console.log('Setting focus on btnLeadTypeN.');
                                                    $('#btnLeadTypeN').focus(); // 3
                                                    event.preventDefault(); // This stops the keyup from happening.
                                                } else if ($('#btnLeadTypeR').length) {
                                                    console.log('Setting focus on btnLeadTypeR.');
                                                    $('#btnLeadTypeR').focus(); // 3
                                                    event.preventDefault(); // This stops the keyup from happening.
                                                } else {
                                                    console.log('Setting focus on ProbeNewNote.');
                                                    $('#ProbeNewNote').focus(); // 7
                                                    event.preventDefault(); // This stops the keyup from happening.
                                                }
                                                break;
                                            case 'btnLeadTypeN':
                                                if ($('#btnLeadTypeR').length) {
                                                    console.log('Setting focus on btnLeadTypeR.');
                                                    $('#btnLeadTypeR').focus(); // 3
                                                    event.preventDefault(); // This stops the keyup from happening.
                                                } else {
                                                    console.log('Setting focus on ProbeNewNote.');
                                                    $('#ProbeNewNote').focus(); // 7
                                                    event.preventDefault(); // This stops the keyup from happening.
                                                }
                                                break;
                                            case 'btnLeadTypeR':
                                                console.log('Setting focus on ProbeNewNote.');
                                                $('#ProbeNewNote').focus(); // 7
                                                event.preventDefault(); // This stops the keyup from happening.
                                                break;
                                            case 'ProbeNewNote':
                                                console.log('Setting focus on btnProbeSaveNote.');
                                                $('#btnProbeSaveNote').focus(); // 8
                                                event.preventDefault(); // This stops the keyup from happening.
                                                break;
                                            case 'btnProbeSaveNote':
                                                if ($('#btnMatch').length) {
                                                    console.log('Setting focus on btnMatch.');
                                                    $('#btnMatch').focus(); // 3
                                                    event.preventDefault(); // This stops the keyup from happening.
                                                } else if ($('#btnNoMatch').length) {
                                                    console.log('Setting focus on btnNoMatch.');
                                                    $('#btnNoMatch').focus(); // 3
                                                    event.preventDefault(); // This stops the keyup from happening.
                                                } else {
                                                    console.log('Setting focus on btnAdjApprove.');
                                                    $('#btnAdjApprove').focus(); // 3
                                                    event.preventDefault(); // This stops the keyup from happening.
                                                }
                                                break;
                                        }
                                    }
                                    break;
                            }

                        } catch (e) {
                            console.log('Exception in bwKeypressAndMouseEventHandler.js.attachKeypressHandlerFor(): ' + e.stack);
                        }
                    });
                    break;

                default:
                    console.log('Error in bwKeypressAndMouseEventHandler.js.attachKeypressHandlerFor(). Unexpected value for filename: ' + filename);
                    break;
            }

        } catch (e) {
            console.log('Exception in bwKeypressAndMouseEventHandler.js.attachKeypressHandlerFor(): ' + e.stack);
        }
    }
});
