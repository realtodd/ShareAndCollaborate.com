$.widget("bw.bwKeypressAndMouseEventHandler_ForAdmin", {
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
        This is the bwKeypressAndMouseEventHandler_ForAdmin.js jQuery Widget. 
        ===========================================================

            [more to follow]
                          
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

            [put your stuff here]

        ===========================================================
       
        */

        CustomBehavior: null,
        DisplayVerboseBrowserConsoleLogs: true, // This is not implemented yet.

        divUploadANewSmallCircleImageDialog_JustWentBlur: false // this helps us show and hide the activity spinner 1-6-2022

        //LastKeydown_KeyCode: null // This helps with detecting cntrl-key keypress.
    },
    _create: function () {
        this.element.addClass("bwKeypressAndMouseEventHandler_ForAdmin");
        try {
            console.log('In bwKeypressAndMouseEventHandler_ForAdmin._create(). The widget has been initialized. CustomBehavior: ' + this.options.CustomBehavior + ', DisplayVerboseBrowserConsoleLogs: ' + this.options.DisplayVerboseBrowserConsoleLogs);
            var thiz = this;

            //
            // THE INTENTION OF THIS WIDGET IS TO HAVE ALL THE GLOBAL KEYPRESS TYPE STUFF HANDLED HERE. 
            // This should help ensure we destroy/detach events when required, so that the new handlers work properly. Javascript lets you add event handlers willy nilly!
            //

            //var html = '';
            //html += '<style>';
            //html += '   .bwKeypressAndMouseEventHandler_ForAdminStyle_OrangeBorderForElementOn_Focus_Active:focus, active, focus-visible {'; // This style makes the border orange for an active element.
            //html += '       border:solid !important;';
            //html += '       border-color: orange !important;';
            //html += '       border-width: 3px !important;';
            //html += '   }';
            //html += '</style>';

            //this.element.html(html); // Injecting this style into the page, as the content of this div element.

            //$(document).click(function (event) {
            //    try {
            //        console.log('In bwKeypressAndMouseEventHandler_ForAdmin.js._create().document.click().');

            //        //
            //        // This element is in the bwCircleDialog for uploading org or participant images: inputFile_ForIdentifyingImage
            //        // This is the best place to catch this event without creating spaghetti.
            //        //
            //        if (event.target.id == 'inputFile_ForIdentifyingImage') {
            //            console.log('');
            //            console.log('******************');
            //            console.log('In bwKeypressAndMouseEventHandler_ForAdmin.js._create().document.click(). Calling ShowActivitySpinner() for event.target.id: ' + event.target.id);
            //            console.log('******************');
            //            console.log('');

            //            ShowActivitySpinner_FileUpload('Uploading file. This may take a while...');

            //        }





            //    } catch (e) {
            //        console.log('Exception in bwKeypressAndMouseEventHandler_ForAdmin.js.document.click(): ' + e.stack);
            //    }
            //});

            //$(window).resize(function (event) {
            //    try {
            //        console.log('In bwKeypressAndMouseEventHandler_ForAdmin.js.window.resize().');

            //        // Check if the slides are being displayed. If so, lets resize them to accomodate the current screen size. Slick!! :)
            //        if (document.getElementById('tableHowDoesItWorkCarousel1')) {
            //            console.log('In bwKeypressAndMouseEventHandler_ForAdmin.js.window.resize(). The carousel is displayed, so calling bwHowDoesItWorkCarousel.js.windowresize().');
            //            $('.bwHowDoesItWorkCarousel').bwHowDoesItWorkCarousel2('windowresize'); // Call this so the carousel can resize itself to accomodate the new window size.
            //        }

            //        console.log('In bwKeypressAndMouseEventHandler_ForAdmin.js.window.resize(). Calling adjustLeftSideMenu().');
            //        $('.bwActiveMenu').bwActiveMenu('adjustLeftSideMenu');

            //    } catch (e) {
            //        console.log('Exception in bwKeypressAndMouseEventHandler_ForAdmin.js._create().window.resize(): ' + e.message + ', ' + e.stack);
            //        displayAlertDialog('Exception in bwKeypressAndMouseEventHandler_ForAdmin.js._create().window.resize(): ' + e.message + ', ' + e.stack);
            //    }
            //});

            //$(window).blur(function (event) {
            //    try {

            //        var x = $('#divUploadANewSmallCircleImageDialog').is(':visible');

            //        console.log('In bwKeypressAndMouseEventHandler_ForAdmin.js._create().window.blur(). divUploadANewSmallCircleImageDialog visible: ' + x);

            //        //var x = $('#divUploadANewSmallCircleImageDialog').is(':visible');
            //        debugger;
            //        ////
            //        //// This element is in the bwCircleDialog for uploading org or participant images: inputFile_ForIdentifyingImage
            //        //// This is the best place to catch this event without creating spaghetti.
            //        ////
            //        if ($('#divUploadANewSmallCircleImageDialog').is(':visible')) {
            //            //    console.log('');
            //            //    console.log('******************');
            //            //    console.log('Calling HideActivitySpinner() because divUploadANewSmallCircleImageDialog is visible.');
            //            //    console.log('******************');
            //            //    console.log('');

            //            //    HideActivitySpinner();









            //            // 8-13-2022

            //            // ShowActivitySpinner_FileUpload(); // 8-13-2022 got rid of this, popping up at a weird time in some cases

            //            // IDEA <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< 8-13-2022
            //            // if (activity spinner is displayed) {
            //            //     hide it
            //            // } else {
            //            //     show it
            //            // }
            //            console.log('In bwKeypressAndMouseEventHandler_ForAdmin.js.window.blur(). Doing a check: if activity spinner is displayed, hide it, else show it. xcx1234788 8-13-2022');
            //            var activityDialog = document.getElementsByClassName('bwActivitySpinner');
            //            if (activityDialog && activityDialog[0] && $(activityDialog[0]).is(':visible')) {
            //                HideActivitySpinner_FileUpload();
            //            } else {
            //                ShowActivitySpinner_FileUpload();
            //            }











            //            console.log('Setting divUploadANewSmallCircleImageDialog_JustWentBlur = true');
            //            thiz.options.divUploadANewSmallCircleImageDialog_JustWentBlur = true;

            //        }






            //    } catch (e) {
            //        console.log('Exception in bwKeypressAndMouseEventHandler_ForAdmin.js._create().window.blur(): ' + e.stack);
            //    }
            //});

            //$(window).focus(function (event) {
            //    try {

            //        var x = $('#divUploadANewSmallCircleImageDialog').is(':visible');

            //        console.log('In bwKeypressAndMouseEventHandler_ForAdmin.js._create().window.focus(). divUploadANewSmallCircleImageDialog visible: ' + x);





            //        //3-12-2022 Hide the file upload activity spinner. When this event happens it is likely that the user has clicked the "Cancel" button on the file upload dialog.
            //        //HideActivitySpinner_FileUpload(); // In bwKeypressAndMouseEventHandler_ForAdmin.js._create().window.focus(). divUploadANewSmallCircleImageDialog visible: true






            //        debugger;
            //        //
            //        // This element is in the bwCircleDialog for uploading org or participant images: inputFile_ForIdentifyingImage
            //        // This is the best place to catch this event without creating spaghetti.
            //        //
            //        if ($('#divUploadANewSmallCircleImageDialog').is(':visible')) {

            //            if (thiz.options.divUploadANewSmallCircleImageDialog_JustWentBlur == true) {

            //                //console.log('');
            //                //console.log('******************');
            //                //console.log('In bwKeypressAndMouseEventHandler_ForAdmin.js._create().window.focus(). Calling HideActivitySpinner() because divUploadANewSmallCircleImageDialog is visible.');
            //                //console.log('******************');
            //                //console.log('');

            //                //HideActivitySpinner();

            //                //thiz.options.divUploadANewSmallCircleImageDialog_JustWentBlur = false;
            //            }





            //        }






            //    } catch (e) {
            //        console.log('Exception in bwKeypressAndMouseEventHandler_ForAdmin.js._create().window.focus(): ' + e.stack);
            //    }
            //});





            //$(document).scroll(function (event) {
            //    try { // codemarker 4-10-2021
            //        //console.log('In document.scroll(). event.target: ' + event.target);

            //    } catch (e) {
            //        console.log('Exception in xx(): ' + e.stack);
            //    }
            //});

            $(document).keydown(function (event) {
                try { // codemarker 4-10-2021
                    console.log('In document.keydown().');
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

                    if (event.keyCode == 13) {
                        console.log('Enter key was pressed.'); 
                        //if (document.getElementById('divCircleDialog') && document.getElementById('divCustomLogonDialog')) { 
                        if (document.getElementById('txtCustomLogonEmail') && document.getElementById('txtCustomLogonPassword')) { 
                            // The logon dialog is displayed, so now lets check if the username and password is filled out.
                            if ($(event.target).is("input") || $(event.target).is("body")) {
                                console.log('In bwKeypressAndMouseEventHandler_ForAdmin.js.document.keydown(). Enter key was pressed, logging in the user.');
                                $('.bwAuthentication').bwAuthentication('logonWith_BudgetWorkflow');
                            } 
                        } 
                    }


                    //var isEditable = $(document.activeElement).is("input") || $(document.activeElement).is("textarea");
                    //if (event.keyCode === 8 && !isEditable) { // 8 = Backspace. Disable backspace key for navigation. Allow backspace key when editing text.
                    //    console.log('In bwKeypressAndMouseEventHandler_ForAdmin.keydown(). Backspace key has been pressed.'); // Catching and calling displayHelpWindow().');
                    //    return false;
                    //} else if ($(event.target).is("textarea") && (event.keyCode == 38 || event.keyCode == 40 || event.keyCode == 37 || event.keyCode == 39 || (event.keyCode == 17 && event.keyCode == 65))) { // 38 = UP arrow, 40 = DOWN arrow, 37 = left arrow, 39 = right arrow, 17&65 = cntrl-a.
                    //    console.log('ALLOWING these keys in a TEXTAREA element. 38 = UP arrow, 40 = DOWN arrow, 37 = left arrow, 39 = right arrow, cntrl-a.');
                    //    event.stopPropagation();
                    //} else if (event.keyCode == 112) { // F1 key pressed
                    //    console.log('In bwKeypressAndMouseEventHandler_ForAdmin.keydown(). F1 key has been pressed. Catching and calling displayHelpWindow().');
                    //    event.stopPropagation();
                    //    event.preventDefault();
                    //    displayHelpWindow();
                    //}

                    //if ($('.dataTable').length && ($('.dataTable').css('display') == 'table')) { // If display == 'table' it means it is currently displayed on the screen.
                    //    console.log('In bwKeypressAndMouseEventHandler_ForAdmin(). Datatable detected, so attaching mousedown event.');
                    //    $('.dataTable').bind('mousedown', function (event) {
                    //        try {
                    //            console.log('In .dataTable.mousedown().');
                    //            // This makes sure when the user selects a row, all the row selected cells get coordinated.
                    //            var selectedTrElement = $(event.target).closest('tr'); // This finds the selected row in the datatable.
                    //            if (selectedTrElement.attr('id') && typeof selectedTrElement.click == "function") {
                    //                console.log('In bwKeypressAndMouseEventHandler_ForAdmin._create.dataTable.mousedown(). Calling click event for row ' + selectedTrElement.attr('id'));
                    //                selectedTrElement.click.apply(selectedTrElement);
                    //                selectedTrElement.addClass('selected');
                    //            }
                    //        } catch (e) {
                    //            console.log('Exception in bwKeypressAndMouseEventHandler_ForAdmin._create.dataTable.document.keydown(): ' + e.stack);
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
                    //                    console.log('In bwKeypressAndMouseEventHandler_ForAdmin(). User does not have permission to search credential. authorizations: ' + JSON.stringify(authorizations));
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
                    console.log('Exception in xx(): ' + e.stack);
                }
            });

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT INITIALIZE bwKeypressAndMouseEventHandler_ForAdmin</span>';
            html += '<br />';
            html += '<span style="">Exception in bwKeypressAndMouseEventHandler_ForAdmin.Create(): ' + e.message + ', ' + e.stack + '</span>';
            this.element.html(html);
        }
    },
    attachKeypressHandlerFor: function (filename) {
        try {
            console.log('In bwKeypressAndMouseEventHandler_ForAdmin.js.attachKeypressHandlerFor(). filename: ' + filename);

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
                                    console.log('In bwKeypressAndMouseEventHandler_ForAdmin.attachKeypressHandlerFor.document.keydown(). TAB key has been pressed. The element is id: ' + elementId);
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
                                            if ($('#' + dialogId).find('#' + ourButtonsArray[i]).hasClass('bwKeypressAndMouseEventHandler_ForAdminStyle_OrangeBorderForElementOn_Focus_Active') != true) {
                                                $('#' + dialogId).find('#' + ourButtonsArray[i]).addClass('bwKeypressAndMouseEventHandler_ForAdminStyle_OrangeBorderForElementOn_Focus_Active'); // Add the class to all of these. Then when they are active, our orange border will be applied.
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
                                            $('#' + ourButtonsArray[i]).addClass('bwKeypressAndMouseEventHandler_ForAdminStyle_OrangeBorderForElementOn_Focus_Active'); // Add the class to all of these. Then when they are active, our orange border will be applied.
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
                            console.log('Exception in bwKeypressAndMouseEventHandler_ForAdmin.js.attachKeypressHandlerFor(): ' + e.stack);
                        }
                    });
                    break;

                default:
                    console.log('Error in bwKeypressAndMouseEventHandler_ForAdmin.js.attachKeypressHandlerFor(). Unexpected value for filename: ' + filename);
                    break;
            }

        } catch (e) {
            console.log('Exception in bwKeypressAndMouseEventHandler_ForAdmin.js.attachKeypressHandlerFor(): ' + e.stack);
        }
    }
});
