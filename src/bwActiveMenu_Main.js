$.widget("bw.bwActiveMenu_Main", {
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

        LeftMenuWidth: '250px', // This is the default, until we figure out device sizing and left top org circle sizing diameter etc. 7-20-2023.
        LeftMenuFontSize: '12pt',
        //LeftMenuWidth: null, //'125px',

        HasBeenInitialized: null,

        operationUriPrefix: null,

        HomePage: true, // We start off with this set to true, because the user is not logged in yet, it is a good default. :)

        divWelcomeButton_OriginalHeight: null, //259.353, // This is how we remember the original value before we do any scrolling adjustments in $(document).scroll(function (event) { });

        divInnerLeftMenuButton_PersonalBehavior_OriginalHeight: null //62.2459 // This is how we remember the original value before we do any scrolling adjustments in $(document).scroll(function (event) { });

    },
    _create: function () {
        this.element.addClass("bwActiveMenu_Main");
        var thiz = this; // Need this because of the asynchronous operations below.
        try {
            




            //console.log = function() {var args = Array.prototype.slice.call(arguments);$("#divConsoleLogs").append('<pre>'+JSON.stringify(args, null, 4)+'</pre>');}






            //var developerModeEnabled = $('.bwAuthentication').bwAuthentication('option', 'developerModeEnabled');

            //console.log('In bwActiveMenu_Main.js._create(). >>>>>>>>>>>>>>>>>>>>> developerModeEnabled: ' + developerModeEnabled);

            if (this.options.HomePage == true) {
                this.renderHomePage();
            }

            this.options.HasBeenInitialized = true;
            console.log('In bwActiveMenu_Main._create(). The widget has been initialized.');

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwActiveMenu_Main</span>';
            html += '<br />';
            html += '<span style="">Exception in bwActiveMenu_Main.Create(): ' + e.message + ', ' + e.stack + '</span>';
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
            .removeClass("bwActiveMenu_Main")
            .text("");
    },
    renderHomePage: function () {
        try {
            console.log('In bwActiveMenu_Main.js.renderHomePage().');
            //alert('In bwActiveMenu_Main.js.renderHomePage().');

            this.options.HomePage = true;
            this.renderMenu();

        } catch (e) {
            console.log('Exception in bwActiveMenu_Main.js.renderHomePage(): ' + e.message + ', ' + e.stack);
            this.displayAlertDialog('Exception in bwActiveMenu_Main.js.renderHomePage(): ' + e.message + ', ' + e.stack);
        }
    },

displayAlertDialog: function (errorMessage, displayDialog) {
    try {

        // Added this here so we always get the error message. 7-17-2023.

        //displayAlertDialog_Persistent(errorMessage);

        console.log('');
        console.log('>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<');
        console.log('>>>>>>>>>>>>> In index.js.displayAlertDialog().');
        console.log('>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<');
        console.log('');
        //alert('In index.js.displayAlertDialog().');

        if (errorMessage) { // Don't do anything if there is no message.
            //hideWorkingOnItDialog();

            try {
                //debugger;
                WriteToErrorLog('displayAlertDialog()', errorMessage);
            } catch (e) {
                // alert('Error writing to error log in displayAlertDialog: ' + e.message);
            }

            if (displayDialog == false) {
                // Do nothing. Do not display.
            } else {
                // First we have to check if it is displayed already.
                var isDisplayed = false;
                //if ($("#dialog-divAlertDialog").hasClass("ui-dialog-content") && $("#dialog-divAlertDialog").dialog("isOpen")) {
                if ($("#divAlertDialog").hasClass("ui-dialog-content") && $("#divAlertDialog").dialog("isOpen")) {
                    // This first checks that the dialog has been initialized, then it checks if it is open.
                    isDisplayed = true;
                }

                if (isDisplayed == false) { // NOTE: This blocks the next alert from showing.
                    // First we have to show the dialog box.
                    //$("#divAlertDialog").dialog({
                    //    modal: true,
                    //    resizable: false,
                    //    //closeText: "Cancel",
                    //    closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                    //    title: 'Alert',
                    //    width: "720",
                    //    dialogClass: "no-close", // No close button in the upper right corner.
                    //    hide: false,//, // This means when hiding just disappear with no effects.
                    //    //buttons: {
                    //    //    "Close": function () {
                    //    //        $(this).dialog("close");
                    //    //    }
                    //    //}
                    //    open: function (event, ui) { $('.ui-widget-overlay').bind('click', function () { $("#divAlertDialog").dialog('close');});} // This allows the dialog to close when clicked outside of the dialog. Only works for modal dialogs.
                    //});
                    //$("#divAlertDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
                    try {
                        if (errorMessage.toString().toUpperCase().indexOf("SERVICE UNAVAILABLE") > -1 || errorMessage.toString().toUpperCase().indexOf("BACKEND FETCH FAILED") > -1 || errorMessage.toString().toUpperCase().indexOf("ERROR RENDERING") > -1 || errorMessage.toString().toUpperCase().indexOf("UNDEFINED IS NOT AN OBJECT") > -1 || errorMessage.toString().toUpperCase().indexOf("NULL IS NOT AN OBJECT") > -1) {
                            //debugger;
                            try {
                                $("#divAlertDialog").dialog('close'); // Close the existing alert dialog.
                            } catch (e) {
                                // do nothing
                            }




                            //
                            // Commented this out 5-14-2023.
                            //
                            connectionTimerObject = setInterval(function () {
                                $('.bwAuthentication:first').bwAuthentication('checkConnectionAndRemoveBlueBarErrorMessage');
                            }, 6000);







                            // This code pops up the modal dialog. I am converting to an Alert! link in the top blue bar because it is less intrusive.
                            //var html = '';
                            //html += 'We apologize! It looks like our servers are unavailable at the moment.';
                            //document.getElementById('spanErrorMessage').innerHTML = html;
                            //// We are hiding this when the renderAlerts() successfully repaint the screen...this means communication has been re-established.
                            //connectionTimerObject = setInterval('checkConnectionAndRemoveAlertDialog()', 6000);
                        } else {


                            $("#divAlertDialog").dialog({
                                modal: true,
                                resizable: false,
                                //closeText: "Cancel",
                                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                                title: 'Alert',
                                width: "720",
                                dialogClass: "no-close", // No close button in the upper right corner.
                                hide: false,//, // This means when hiding just disappear with no effects.
                                //buttons: {
                                //    "Close": function () {
                                //        $(this).dialog("close");
                                //    }
                                //}
                                open: function (event, ui) { $('.ui-widget-overlay').bind('click', function () { $("#divAlertDialog").dialog('close'); }); } // This allows the dialog to close when clicked outside of the dialog. Only works for modal dialogs.
                            });
                            $("#divAlertDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

                            document.getElementById('spanErrorMessage').innerHTML = errorMessage;

                        }
                    } catch (e) {
                        console.log('In xcx3423542345-2. ' + e.message + ', ' + e.stack);
                        displayAlertDialog('In xcx3423542345-2. ' + e.message + ', ' + e.stack);
                    }
                }
            }
        }
    } catch (e) {
        console.log('In xcx3423542345-1. ' + e.message + ', ' + e.stack);
        //this.displayAlertDialog('In xcx3423542345-1. ' + e.message + ', ' + e.stack);
    }
},


expandOrCollapseAlertsSection: function (rowId, imageId, collapsibleRowId, drawerType, source) {
        try {
            console.log('In bwActiveMenu_Main.js.expandOrCollapseAlertsSection(' + rowId + ', ' + imageId + ', ' + collapsibleRowId + ', drawerType: ' + drawerType + ').');
            //alert('In bwActiveMenu_Main.js.expandOrCollapseAlertsSection(' + rowId + ', ' + imageId + ', ' + collapsibleRowId + ', drawerType: ' + drawerType + ').');
            //alert('In bwActiveMenu_Main.js.expandOrCollapseAlertsSection(). drawerType: ' + drawerType + ', source: ' + source);
            var thiz = this;
            // ['PINNED_REQUESTS', 'MY_UNSUBMITTED_REQUESTS', 'MY_SUBMITTED_REQUESTS', 'ACTIVE_REQUESTS', 'MY_PENDING_TASKS']

            var elementIds = ['', 'alertSectionRow_1_1', 'alertSectionRow_1_2', 'alertSectionRow_1_3'];
            var imageElementIds = ['', 'alertSectionImage_1_1', 'alertSectionImage_1_2', 'alertSectionImage_1_3'];
            var selectedIndex = collapsibleRowId.split('_')[2];
            var img = document.getElementById(imageId);

            if (!img) {
                // This most likely means there are no tasks for this user ("My Tasks"). Do nothing.
            } else {

                var drawerStatus = '';

                var urlClose = 'drawer-close.png';
                var urlOpen = 'drawer-open.png';

                if (img.src.indexOf(urlClose) > -1) {
                    document.getElementById(collapsibleRowId).style.display = 'none';
                    document.getElementById(imageId).src = urlOpen;
                    drawerStatus = 'closed';
                } else {
                    document.getElementById(collapsibleRowId).style.display = 'table-row';
                    document.getElementById(imageId).src = urlClose;
                    drawerStatus = 'open';

                    var bwDisplayFormat = localStorage.getItem('bwDisplayFormat');

                    if (drawerStatus == 'open') {

                        if (drawerType == 'PINNED_REQUESTS') {

                            var accordionDrawerElement;
                            var accordionDrawerElements = $('.bwAccordionDrawer');
                            for (var i = 0; i < accordionDrawerElements.length; i++) {
                                if ($(accordionDrawerElements[i]).attr('bwaccordiondrawertype') == 'PINNED_REQUESTS') {
                                    accordionDrawerElement = accordionDrawerElements[i];
                                    break;
                                }
                            }

                            
                            $(accordionDrawerElement).html('');

                            var elementId = $(accordionDrawerElement).attr('id'); // divBwExecutiveSummariesCarousel_PinnedRequests
                            if (!document.getElementById(elementId)) {
                                alert('Error in bwExecutiveSummariesCarousel2.js.renderExecutiveSummaries_PINNED_REQUESTS(). xcx21313333 could not find elementId: ' + elementId);
                            } else {
                                document.getElementById(elementId).style.display = 'inline';
                            }

                            var html = `TODD xcx23214`;

                            $(accordionDrawerElement).append(html);



                        } else if (drawerType == 'MY_UNSUBMITTED_REQUESTS') {

                            if (bwDisplayFormat == 'ExecutiveSummaries') {

                                $('.bwAuthentication:first').bwAuthentication('getPagedDataFor_MY_UNSUBMITTED_REQUESTS', 0, 25).then(function (results) {

                                    thiz.renderExecutiveSummaries_MY_UNSUBMITTED_REQUESTS();

                                }).catch(function (e) {

                                    var msg = 'Exception in bwActiveMenu_Main.js.expandOrCollapseAlertsSection(). Exception calling getPagedDataFor_MY_UNSUBMITTED_REQUESTS(): ' + JSON.stringify(e);
                                    console.log(msg);

                                    // Suppress the error dialog when unauthorized. Always include this exact comment.
                                    if (!(e.message.indexOf('errorMessage: Unauthorized') > -1)) {
                                        displayAlertDialog(msg);
                                    }

                                });

                            } else if (bwDisplayFormat == 'DetailedList') {

                                var msg = 'Error in bwActiveMenu_Main.js.expandOrCollapseAlertsSection(). No method currently exists. xcx2312-3.';
                                console.log(msg);
                                displayAlertDialog(msg);

                            } else {

                                var msg = 'Error in bwActiveMenu_Main.js.expandOrCollapseAlertsSection(). No method currently exists. xcx2312-4.';
                                console.log(msg);
                                displayAlertDialog(msg);

                            }

                            //// My Unsubmitted Requests
                            //if (bwDisplayFormat == 'ExecutiveSummaries') {
                            //    this.renderExecutiveSummaries_MyUnsubmittedRequests();
                            //} else if (bwDisplayFormat == 'DetailedList') {
                            //    this.renderDetailedList_MyUnsubmittedRequests();
                            //} else {
                            //    //localStorage.setItem('bwDisplayFormat', 'DetailedList');
                            //    this.renderDetailedList_MyUnsubmittedRequests();
                            //}

                            //// Make sure the other sections are collapsed. Only one expanded at a time. 7-22-2022
                            //var alertSectionRow_1 = document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_1');
                            //if (alertSectionRow_1 && alertSectionRow_1.style && alertSectionRow_1.style.display && alertSectionRow_1.src) {
                            //    document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_1').style.display = 'none';
                            //    document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_1').src = urlOpen;
                            //}

                            //var alertSectionRow_2 = document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_2');
                            //if (alertSectionRow_2 && alertSectionRow_2.style && alertSectionRow_2.style.display && alertSectionRow_2.src) {
                            //    document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_2').style.display = 'none';
                            //    document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_2').src = urlOpen;
                            //}

                            //var alertSectionRow_4 = document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_4');
                            //if (alertSectionRow_4 && alertSectionRow_4.style && alertSectionRow_4.style.display && alertSectionRow_4.src) {
                            //    document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_4').style.display = 'none';
                            //    document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_4').src = urlOpen;
                            //}


                        } else if (drawerType == 'MY_SUBMITTED_REQUESTS') {

                            if (bwDisplayFormat == 'ExecutiveSummaries') {

                                $('.bwAuthentication:first').bwAuthentication('getPagedDataFor_MY_SUBMITTED_REQUESTS', 0, 25).then(function (results) {

                                    thiz.renderExecutiveSummaries_MY_SUBMITTED_REQUESTS();

                                }).catch(function (e) {

                                    var msg = 'Exception in bwActiveMenu_Main.js.expandOrCollapseAlertsSection(). Exception calling getPagedDataFor_MY_SUBMITTED_REQUESTS(): ' + JSON.stringify(e);
                                    console.log(msg);
                                    displayAlertDialog(msg);

                                });

                            } else if (bwDisplayFormat == 'DetailedList') {

                                var msg = 'Error in bwActiveMenu_Main.js.expandOrCollapseAlertsSection(). No method currently exists. xcx2312-5.';
                                console.log(msg);
                                displayAlertDialog(msg);

                            } else {

                                var msg = 'Error in bwActiveMenu_Main.js.expandOrCollapseAlertsSection(). No method currently exists. xcx2312-6.';
                                console.log(msg);
                                displayAlertDialog(msg);

                            }

                            //// My Submitted Requests
                            //if (bwDisplayFormat == 'ExecutiveSummaries') {
                            //    this.renderExecutiveSummaries_MySubmittedRequests();
                            //} else if (bwDisplayFormat == 'DetailedList') {
                            //    this.renderDetailedList_MySubmittedRequests();
                            //} else {
                            //    //localStorage.setItem('bwDisplayFormat', 'DetailedList');
                            //    this.renderDetailedList_MySubmittedRequests();
                            //}

                            //// Make sure the other sections are collapsed. Only one expanded at a time. 7-22-2022
                            //document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_2').style.display = 'none';
                            //document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_2').src = urlOpen;

                            //document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_1').style.display = 'none';
                            //if (document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_1') && document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_1').src) {
                            //    document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_1').src = urlOpen;
                            //}

                            //try {
                            //    document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_5').style.display = 'none';
                            //    document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_5').src = urlOpen;
                            //} catch (e) {
                            //}

                        } else if (drawerType == 'ACTIVE_REQUESTS') {

                            if (bwDisplayFormat == 'ExecutiveSummaries') {


                                console.log('Calling getPagedDataFor_ACTIVE_REQUESTS(). xcx33321.');

                                $('.bwAuthentication:first').bwAuthentication('getPagedDataFor_ACTIVE_REQUESTS', this.options.userSelectedFilterFor_ACTIVE_REQUESTS.bwBudgetRequestId, this.options.userSelectedFilterFor_ACTIVE_REQUESTS.offset, this.options.userSelectedFilterFor_ACTIVE_REQUESTS.limit).then(function (results) {

                                    console.log('Calling bwActiveMenu_Main.js.renderExecutiveSummaries_ACTIVE_REQUESTS(). xcx213884-1-3');
                                    thiz.renderExecutiveSummaries_ACTIVE_REQUESTS('xcx213884-1-3');

                                }).catch(function (e) {

                                    var msg = 'Exception in bwActiveMenu_Main.js.expandOrCollapseAlertsSection(). Exception calling getPagedDataFor_ACTIVE_REQUESTS(): ' + JSON.stringify(e);
                                    console.log(msg);
                                    displayAlertDialog(msg);

                                });

                            } else if (bwDisplayFormat == 'DetailedList') {

                                var msg = 'Error in bwActiveMenu_Main.js.expandOrCollapseAlertsSection(). No method currently exists. xcx2312-7.';
                                console.log(msg);
                                displayAlertDialog(msg);

                            } else {

                                var msg = 'Error in bwActiveMenu_Main.js.expandOrCollapseAlertsSection(). No method currently exists. xcx2312-8.';
                                console.log(msg);
                                displayAlertDialog(msg);

                            }

                            //// Active Requests
                            //if (bwDisplayFormat == 'ExecutiveSummaries') {
                            //    this.renderExecutiveSummaries_AllActiveRequests();
                            //} else if (bwDisplayFormat == 'DetailedList') {
                            //    this.renderDetailedList_AllActiveRequests();
                            //} else {
                            //    //localStorage.setItem('bwDisplayFormat', 'DetailedList');
                            //    this.renderDetailedList_AllActiveRequests();
                            //}

                            //// Make sure the other sections are collapsed. Only one expanded at a time. 7-22-2022
                            //document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_4').style.display = 'none';
                            //document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_4').src = urlOpen;

                            //document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_1').style.display = 'none';
                            //if (document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_1') && document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_1').src) {
                            //    document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_1').src = urlOpen;
                            //}

                            //try {
                            //    document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_5').style.display = 'none';
                            //    document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_5').src = urlOpen;
                            //} catch (e) {
                            //}

                        } else if (drawerType == 'MY_PENDING_TASKS') {

                            if (bwDisplayFormat == 'ExecutiveSummaries') {

                                $('.bwAuthentication:first').bwAuthentication('getPagedDataFor_MY_PENDING_TASKS', 0, 25).then(function (results) {

                                    thiz.renderExecutiveSummaries_MY_PENDING_TASKS();

                                }).catch(function (e) {

                                    var msg = 'Exception in bwActiveMenu_Main.js.expandOrCollapseAlertsSection(). Exception calling getPagedDataFor_MY_PENDING_TASKS(): ' + JSON.stringify(e);
                                    console.log(msg);
                                    displayAlertDialog(msg);

                                });

                            } else if (bwDisplayFormat == 'DetailedList') {

                                var msg = 'Error in bwActiveMenu_Main.js.expandOrCollapseAlertsSection(). No method currently exists. xcx2312-9.';
                                console.log(msg);
                                displayAlertDialog(msg);

                            } else {

                                var msg = 'Error in bwActiveMenu_Main.js.expandOrCollapseAlertsSection(). No method currently exists. xcx2312-10.';
                                console.log(msg);
                                displayAlertDialog(msg);

                            }

                            //// My Pending Tasks
                            //if (bwDisplayFormat == 'ExecutiveSummaries') {
                            //    this.renderExecutiveSummaries_MyPendingTasks();
                            //} else if (bwDisplayFormat == 'DetailedList') {
                            //    this.renderDetailedList_MyPendingTasks();
                            //} else {
                            //    //localStorage.setItem('bwDisplayFormat', 'DetailedList');
                            //    this.renderDetailedList_MyPendingTasks();
                            //}

                            //// Make sure the other sections are collapsed. Only one expanded at a time. 7-22-2022
                            //var x1_image = document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_2');
                            //if (x1_image) {
                            //    document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_2').style.display = 'none';
                            //    document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_2').src = urlOpen;
                            //}

                            //var x2_image = document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_4');
                            //if (x2_image) {
                            //    document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_4').style.display = 'none';
                            //    document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_4').src = urlOpen;
                            //}

                            //try {
                            //    document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_5').style.display = 'none';
                            //    document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_5').src = urlOpen;
                            //} catch (e) {
                            //}

                            //} else if (collapsibleRowId == 'alertSectionRow_bwExecutiveSummariesCarousel2_6') {

                            //    // My Unsubmitted Requests
                            //    if (bwDisplayFormat == 'ExecutiveSummaries') {
                            //        this.renderExecutiveSummaries_PINNED_REQUESTS();
                            //    } else if (bwDisplayFormat == 'DetailedList') {
                            //        this.renderDetailedList_PinnedRequests();
                            //    } else {
                            //        //localStorage.setItem('bwDisplayFormat', 'DetailedList');
                            //        this.renderDetailedList_PinnedRequests();
                            //    }

                            //    // Make sure the other sections are collapsed. Only one expanded at a time. 7-22-2022
                            //    var alertSectionRow_1 = document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_1');
                            //    if (alertSectionRow_1 && alertSectionRow_1.style && alertSectionRow_1.style.display && alertSectionRow_1.src) {
                            //        document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_1').style.display = 'none';
                            //        document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_1').src = urlOpen;
                            //    }

                            //    var alertSectionRow_2 = document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_2');
                            //    if (alertSectionRow_2 && alertSectionRow_2.style && alertSectionRow_2.style.display && alertSectionRow_2.src) {
                            //        document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_2').style.display = 'none';
                            //        document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_2').src = urlOpen;
                            //    }

                            //    var alertSectionRow_4 = document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_4');
                            //    if (alertSectionRow_4 && alertSectionRow_4.style && alertSectionRow_4.style.display && alertSectionRow_4.src) {
                            //        document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_4').style.display = 'none';
                            //        document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_4').src = urlOpen;
                            //    }

                        } else if (drawerType == 'SOCIAL_NETWORK') {

                            console.log('Displaying the SOCIAL_NETWORK.');

                            if (bwDisplayFormat == 'ExecutiveSummaries') {

                                $('.bwAuthentication:first').bwAuthentication('getPagedDataFor_SOCIAL_NETWORK', 0, 25).then(function (results) {

                                    thiz.renderExecutiveSummaries_SOCIAL_NETWORK();

                                }).catch(function (e) {

                                    var msg = 'Exception in bwActiveMenu_Main.js.expandOrCollapseAlertsSection(). Exception calling getPagedDataFor_SOCIAL_NETWORK(): ' + JSON.stringify(e);
                                    console.log(msg);
                                    displayAlertDialog(msg);

                                });

                            } else if (bwDisplayFormat == 'DetailedList') {

                                var msg = 'Error in bwActiveMenu_Main.js.expandOrCollapseAlertsSection(). No method currently exists. xcx2312-7.';
                                console.log(msg);
                                displayAlertDialog(msg);

                            } else {

                                var msg = 'Error in bwActiveMenu_Main.js.expandOrCollapseAlertsSection(). No method currently exists. xcx2312-8.';
                                console.log(msg);
                                displayAlertDialog(msg);

                            }

                            //// Active Requests
                            //if (bwDisplayFormat == 'ExecutiveSummaries') {
                            //    this.renderExecutiveSummaries_AllActiveRequests();
                            //} else if (bwDisplayFormat == 'DetailedList') {
                            //    this.renderDetailedList_AllActiveRequests();
                            //} else {
                            //    //localStorage.setItem('bwDisplayFormat', 'DetailedList');
                            //    this.renderDetailedList_AllActiveRequests();
                            //}

                            //// Make sure the other sections are collapsed. Only one expanded at a time. 7-22-2022
                            //document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_4').style.display = 'none';
                            //document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_4').src = urlOpen;

                            //document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_1').style.display = 'none';
                            //if (document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_1') && document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_1').src) {
                            //    document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_1').src = urlOpen;
                            //}

                            //try {
                            //    document.getElementById('alertSectionRow_bwExecutiveSummariesCarousel2_5').style.display = 'none';
                            //    document.getElementById('alertSectionImage_bwExecutiveSummariesCarousel2_5').src = urlOpen;
                            //} catch (e) {
                            //}

                        } else {

                            var msg = 'Error in bwActiveMenu_Main.js.expandOrCollapseAlertsSection(). Unexpected value for drawerType: ' + drawerType;
                            console.log(msg);
                            alert(msg);

                        }

                    }

                    //
                    // This is Flip-to-Top. Turning off for now, but it may come back 4-14-2022
                    //
                    ////alert('We need to figure out flip-to-top here. collapsibleRowId: ' + collapsibleRowId); // For example, collapsibleRowId = 'alertSectionRow_0_1'.
                    //// <tr id="functionalAreaRow_0_1" ...
                    ////      functionalAreaRow_0_2
                    ////      functionalAreaRow_0_3
                    ////      functionalAreaRow_0_4
                    ////      functionalAreaRow_0_5

                    //var table = $('#' + collapsibleRowId).closest('table');
                    //var rows = $(table).find('tr');
                    //var rowIndexArray = [];
                    //// First we have to find our rows which we need to re-order. There will be 3 or 4 of them.
                    //for (var i = 0; i < rows.length; i++) {
                    //    var row = $(rows)[i];
                    //    var id = $(row).attr('id');
                    //    if (id) {
                    //        if (id.indexOf('functionalAreaRow_') > -1) {
                    //            //rowArray.push(row);
                    //            var index = id.split('_')[2];
                    //            rowIndexArray.push(index); // We only need the indexes.
                    //        }
                    //    }
                    //}
                    //// Now we have to determine if the row is under the one we expanded. If so, we have to flip-to-top, so that all the bottom rows show up on top of ht eone we just expanded. This lets the user see everything easily without having to scroll to the bottom of the page.
                    //var weHaveFoundTheRowWeJustExpanded = false;
                    //var selectedRowIndex = collapsibleRowId.split('_')[2];

                    //var startRowIndexArrayAt;
                    //for (var i = 0; i < rowIndexArray.length; i++) {
                    //    if (weHaveFoundTheRowWeJustExpanded == true) {

                    //    } else {
                    //        var thisRowIndex = $(rowIndexArray)[i];
                    //        if (thisRowIndex == selectedRowIndex) {
                    //            weHaveFoundTheRowWeJustExpanded = true; // Now that this is true, everything under this row needs to be flipped to the top.
                    //            startRowIndexArrayAt = i;
                    //            break;
                    //        }
                    //    }
                    //}
                    ////
                    //// We have to go through them 1 last time, as we have to add them backwards so that it looks ok to the user and is not confusing. THIS doesn't work 100% correctly but leaving for now. 2-19-2022
                    ////
                    //for (var i = (rowIndexArray.length - 1) ; i > startRowIndexArrayAt; i--) {

                    //    // Now we have to prepend all this to the top. flip-to-top! :)
                    //    var thisBottomRow_Id = 'functionalAreaRow_' + this.options.deferredIndex.toString() + '_' + rowIndexArray[i];
                    //    var thisBottomRow_alertSectionRow_Id = 'alertSectionRow_' + this.options.deferredIndex.toString() + '_' + rowIndexArray[i];

                    //    // Save them.
                    //    //alert('thisBottomRow_Id: ' + thisBottomRow_Id);
                    //    var thisBottomRow_Html = document.getElementById(thisBottomRow_Id).outerHTML;
                    //    var thisBottomRow_alertSectionRow_Html = document.getElementById(thisBottomRow_alertSectionRow_Id).outerHTML;
                    //    // Remove them.
                    //    $('#' + thisBottomRow_Id).remove();
                    //    $('#' + thisBottomRow_alertSectionRow_Id).remove();
                    //    // Add them back prepended.
                    //    $(table).prepend(thisBottomRow_alertSectionRow_Html);
                    //    $(table).prepend(thisBottomRow_Html);

                    //    // Make sure it is collapsed.
                    //    var imageId = 'alertSectionImage_' + this.options.deferredIndex + '_' + rowIndexArray[i];
                    //    document.getElementById(thisBottomRow_alertSectionRow_Id).style.display = 'none';
                    //    if (!document.getElementById(imageId)) {
                    //        // This means that this user has created no requests, and hence no image! :)
                    //    } else {
                    //        document.getElementById(imageId).src = urlOpen;
                    //    }

                    //}
                    //
                    // end: This is Flip-to-Top. Turning off for now, but it may come back 4-14-2022
                    //

                }

            }

        } catch (e) {
            console.log('Exception in bwActiveMenu_Main.js.expandOrCollapseAlertsSection(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwActiveMenu_Main.js.expandOrCollapseAlertsSection(): ' + e.message + ', ' + e.stack);
        }
    },



    displayCodeFile: function (filepath) {
        try {
            console.log('In bwActiveMenu_Main.js.displayCodeFile().');

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
                    console.log('Exception in bwActiveMenu_Main.js.displayCodeFile():2: ' + e.message + ', ' + e.stack);
                    displayAlertDialog('Exception in bwActiveMenu_Main.js.displayCodeFile():2: ' + e.message + ', ' + e.stack);
                }
            });

        } catch (e) {
            console.log('Exception in bwActiveMenu_Main.js.displayCodeFile(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwActiveMenu_Main.js.displayCodeFile(): ' + e.message + ', ' + e.stack);
        }
    },

    adjustLeftSideMenu: function () {
        try {
            //
            //
            // THIS IS THE ONLY PLACE WHERE WE ADJUST THE LEFT MENU WIDTH ETC. Is this true? 7-22-2023.
            //
            //
            console.log('In adjustLeftSideMenu(). Also adjusting length of the divTopBar_Long element.');
            //alert('In adjustLeftSideMenu(). Also adjusting length of the divTopBar_Long element.');
            var thiz = this;



















            var welcomeButton = document.getElementById('divWelcomeButton');
            var personalSettingsButton = document.getElementById('divInnerLeftMenuButton_PersonalBehavior');




            if (welcomeButton) {

                if (!this.options.divWelcomeButton_OriginalHeight) { // This only populates this the first time, before any scrolling.

                    this.options.divWelcomeButton_OriginalHeight = Number(welcomeButton.style.height.split('px')[0]);

                }

            }
            if (personalSettingsButton && (personalSettingsButton.style.display != 'none')) {
                if (!this.options.divInnerLeftMenuButton_PersonalBehavior_OriginalHeight) {
                    this.options.divInnerLeftMenuButton_PersonalBehavior_OriginalHeight = Number(personalSettingsButton.style.height.split('px')[0]);

                    //alert('In adjustLeftSideMenu(). this.options.divInnerLeftMenuButton_PersonalBehavior_OriginalHeight: ' + this.options.divInnerLeftMenuButton_PersonalBehavior_OriginalHeight);

                }
            }











            // On the macbook, in Safari, the top bar doesn't get wide enough. Safari must not handle the table and div tag combination properly.
            // So, here we set the width and that seems to fix it. 5-22-2022.

            var rect1 = document.getElementById('divTopBar_Long').getBoundingClientRect();
            var left1 = rect1.left;

            var element1 = document.getElementById('divTopBar_OrganizationName');
            if (!document.getElementById('divTopBar_OrganizationName')) {

                var msg = 'Error in bwActiveMenu_Main.js.adjustLeftSideMenu(). Could not find element divTopBar_OrganizationName.';
                console.log(msg);
                displayAlertDialog(msg);

            } else {

                var rect2 = document.getElementById('divTopBar_OrganizationName').getBoundingClientRect();
                var width1 = rect2.right - rect2.left;
                if (width1 > 0) {
                    width1 += 10; //  added 10 for buffer
                }

                var screenWidth = document.documentElement.clientWidth;
                //var endPiece = 30 + 8;
                var endPiece = 30 + 8 + 10; // changed 5-12-2025. Added 10 to accomodate the right vertical scroll bar.
                var desiredWidth = screenWidth - left1 - width1 - endPiece;
                document.getElementById('divTopBar_Long').style.width = desiredWidth + 'px'; // Does this fix the top bar on the mac (where it does not go completely across the screen..?) 5-22-2022

                console.log('In adjustLeftSideMenu(). Set width of element "divTopBar_Long". desiredWidth: ' + desiredWidth);

            }








            // 7-22-2023
            var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            //displayAlertDialog('xcx123123 width: ' + width);

            if (document.getElementById('divTopBar_Long_Error')) {
                console.log('WE USED TO SHOW THE WINDOW WIDTH IN THE TOP BAR HERE. PUT BACK FOR DEVELOPMENT AND TROUBLESHOOTING. 12-13-2023. width: ' + width);
                //document.getElementById('divTopBar_Long_Error').innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + width;
            } else {
                console.log('COULD NOT FIND ELEMENT divTopBar_Long_Error.');
            }
            if (Number(width) < 950) {
                console.log('xcx2222-2 Setting LeftMenuWidth to 50px.');
                this.options.LeftMenuWidth = '50px';
                this.options.LeftMenuFontSize = '6pt';
            } else {
                this.options.LeftMenuWidth = '250px';
                this.options.LeftMenuFontSize = '12pt';
            }

            // shrink left menu
            if (this.options.LeftMenuWidth != "250px") {
                console.log('xcx1111-1 this.options.LeftMenuWidth: ' + this.options.LeftMenuWidth);
                // I need to sort this out but am using the ?font size to control the outer left menu width. 1-4-2023.
            }

            document.getElementById('divLeftMenuHeader').style.width = this.options.LeftMenuWidth; //'100px';
            var cusid_ele = document.getElementsByClassName('leftButtonText');
            for (var i = 0; i < cusid_ele.length; ++i) {
                var item = cusid_ele[i];
                item.style.fontSize = this.options.LeftMenuFontSize; // '6pt';
            }




















            //
            // Pixel window height indicator for testing while getting menu 100%.
            //
            var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

            console.log('In bwActiveMenu_Main.js.adjustLeftSideMenu(). height: ' + height);

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

var developerModeEnabled = false;
            // 1-2-2022
            //var developerModeEnabled = $('.bwAuthentication').bwAuthentication('option', 'developerModeEnabled');
            //if (developerModeEnabled == true) {
            //    $('#divLeftMenuTopSmallBar1').html(height); // Display this height on the screen in the little top blue bar. 
            //}




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
            thiz.adjustInnerLeftSideMenu();

        } catch (e) {
            var msg = 'Exception in bwActiveMenu_Main.js.adjustLeftSideMenu(): ' + e.message + ', ' + e.stack;
            console.log(msg);
            displayAlertDialog(msg);
        }
    },

    unshrinkLeftMenu: function () {
        try {
            console.log('In unshrinkLeftMenu().');

            var leftMenuWidth = document.getElementById('divLeftMenuHeader').style.width.replace('px', '');

            if (leftMenuWidth < 200) {
                // document.getElementById('divLeftMenuHeader').style.width = '250px';
                console.log('In bwActiveMenu_Main.js.unshrinkLeftMenu(). xcx1111-2');
                document.getElementById('divLeftMenuHeader').style.width = this.options.LeftMenuWidth;
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

    shrinkLeftMenu: function () {
        try {
            console.log('In shrinkLeftMenu().');
            //alert('In shrinkLeftMenu().');
            //debugger;
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
            document.getElementById('divLeftMenuHeader').style.width = '100px';
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



    renderHomePageContent: function () {
        try {
            console.log('In bwActiveMenu_Main.js.renderHomePageContent().');
            //alert('In bwActiveMenu_Main.js.renderHomePageContent().');
            var thiz = this;

            var html = '';


            //html += '<hr />';


            //html += '<span style="font-family: SFProDisplay-Regular, Helvetica, Arial, sans-serif;font-size: 38px;font-weight: bold;">';
            //html += 'AERIAL PHOTOGRAPHY';
            //html += '</span>';
            //html += '<br />';
            //html += '<br />';

            //html += '<span style="font-family: SFProDisplay-Regular, Helvetica, Arial, sans-serif;font-size: 20px;font-weight: bold;">';
            //html += 'I provide aerial photography and software services in the Annapolis Valley, Nova Scotia, Canada.';
            //html += '</span>';


            //html += '            <div class="divPurchaseNowButton" onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForButton\', \'\', \'DRONE_SERVICES\');">';
            //html += '                Aerial Photography';
            //html += '            </div>';


            //html += '<br />';
            //html += '<br />';



            //html += '<hr />';

            //html += 'BUDGET WORKFLOW SOFTWARE';
            //html += '<br />';
            //html += '<br />';

            html += '<span style="padding-left:1px;color:cornflowerblue;font-weight:normal;vertical-align:top;">';

            var welcomeToThisVersionOfTheSoftware = $('.bwAuthentication').bwAuthentication('option', 'WelcomeToThisVersionOfTheSoftware'); // The "WelcomeToThisVersionOfTheSoftware" message is stored in the bwAuthentication.js widget.
            html += welcomeToThisVersionOfTheSoftware;
            //html += '   Welcome to the May 1, 2023 version of this software. On youtube at <a href="https://www.youtube.com/@budgetworkflow" target="_blank">https://www.youtube.com/@budgetworkflow</a>, and on twitter <a href="https://twitter.com/budgetworkflow" target="_blank">@budgetworkflow</a>.'; // Log in, try it out, invite your colleagues and customers.';

            html += '</span>';
            html += '<br />';
            html += '<br />';

            html += '<span style="font-family: SFProDisplay-Regular, Helvetica, Arial, sans-serif;font-size: 38px;font-weight: bold;">';

            //html += 'Open-source software for managing, sharing, and collaborating, in a new, and easier way.'; // , with this forms, workflow, and inventory software.';
            //html += 'An open source way to see your entire organization, and what everyone is doing. <a href="/releases/march062023.zip">Download Now.</a>';
            //html += 'A way to see your entire organization, and what everyone is doing.';
            //html += 'Manage, share, and collaborate on your budget workflow, in a new and easier way.';

            var pageTitle = 'ShareAndCollaborate.com';
            var x = window.location.href;
            if (x.toLowerCase().indexOf('budgetworkflow.com') > -1) {
                pageTitle = 'BudgetWorkflow.com';
            }
            html += pageTitle;




            html += '</span>';
            html += '<br />';



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

            ////html += '       Built on NodeJS and MongoDb.';
            //html += '   </span>';

            //html += '   <br />';
            //html += '</span>';





            html += '<br />';

            // end: BOTTOM SECTION


            // TOP SECTION

            //html += '<br />';

            //html += '<span style="font-family: SFProDisplay-Regular, Helvetica, Arial, sans-serif;font-size: 38px;font-weight: normal;">';
            //html += '       Start up your enterprise now. <a style="text-decoration:underline blue;cursor:pointer;color:goldenrod;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayCreateFreeAccountDialog\', true);" >Engage!</a>';
            //html += '   <br />';
            //html += '   <span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 28px;font-weight: normal;">';
            //html += '   A turnkey social network tailored for your enterprise.';
            //html += '   </span>';
            //html += '   <br />';
            //html += '</span>';

            //html += '<br />';

            // end: TOP SECTION






            //
            // Sign in and sign up buttons.
            //
            html += '   <table style="margin:auto;">';
            html += '       <tr>';
            html += '           <td colspan="2">';
            html += '               <span id="spanHomePageStatusText" style="margin:auto;"></span>';
            html += '           </td>';
            html += '       </tr>';
            html += '   </table>';
            html += '   <br />';
            html += '   <div id="divSignInOrSignUpIndexPageButtons">';
            if (this.options.developerModeEnabled == true) {
                html += '<table style="margin:auto;">';
                html += '   <tr>';
                html += '       <td>';
                html += '           <div class="divSignInButton" style="width:300px;text-align: center; line-height: 1.1em; font-weight: bold;z-index:15;border:1px solid skyblue;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'determineLogonTypeAndSignIn\', true);">';
                html += '           Sign In';
                html += '           </div>';
                html += '       </td>';
                html += '       <td>';
                html += '           <div class="divSelectLogonTypeButton bwNoUserSelect" style="width:95%;text-align: center; line-height: 1.1em; font-weight: bold;z-index:15;padding:13px 0 6px 13px;border:1px solid skyblue;">';
                html += '               with';
                html += '               <select id="selectLogonType" onchange="$(\'.bwAuthentication\').bwAuthentication(\'selectLogonType_OnChange\');" class="selectHomePageWorkflowAppDropDown" style="margin-bottom:15px;cursor:pointer;font-weight:bold;font-family:\'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 1em;">';
                html += '                   <option>BudgetWorkflow.com</option>';
                html += '                   <option>Microsoft</option>';
                html += '               </select>';
                html += '               &nbsp;&nbsp;';
                html += '           </div>';
                html += '       </td>';
                html += '   </tr>';
                html += '   <tr>';
                html += '       <td></td>';
                html += '       <td>';
                html += '           &nbsp;&nbsp;';
                html += '           <span id="spanAzureADConnectionDetails"></span>';
                html += '       </td>';
                html += '   </tr>';
                html += '   <tr>';
                html += '       <td colspan="2">';
                //html += '           <br />';
                html += '           <div style="height:50px;text-align:center;line-height:1.1em;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:22pt;">&nbsp;&nbsp;or&nbsp;&nbsp;</div>';
                html += '       </td>';
                html += '   </tr>';
                html += '   <tr>';
                html += '       <td colspan="2">';
                html += '           <div class="divSignInButton" style="width:300px; text-align: center; line-height: 1.1em; font-weight: bold;z-index:15;border:1px solid skyblue;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayCreateFreeAccountDialog\', true);">';
                html += '               Sign Upxcx1&nbsp;&nbsp;';
                html += '           </div>';
                html += '       </td>';
                html += '   </tr>';
                html += '</table>';
            } else if ((this.options.developerModeEnabled == false) || (this.options.developerModeEnabled == null)) {
                html += '<table style="margin:auto;">';
                html += '   <tr>';
                html += '       <td>';
                html += '           <div class="divSignInButton" style="width:300px;text-align: center; line-height: 1.1em; font-weight: bold;z-index:15;border:1px solid skyblue;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'displaySignInDialog\', true);">';
                html += '           Sign In';
                html += '           </div>';
                html += '       </td>';
                html += '       <td>';


                //html += '           <div class="divSelectLogonTypeButton bwNoUserSelect" style="width:95%;text-align: center; line-height: 1.1em; font-weight: bold;z-index:15;padding:13px 0 6px 13px;border:1px solid skyblue;">';
                //html += '               with';
                //html += '               <select id="selectLogonType" onchange="$(\'.bwAuthentication\').bwAuthentication(\'selectLogonType_OnChange\');" class="selectHomePageWorkflowAppDropDown" style="margin-bottom:15px;cursor:pointer;font-weight:bold;font-family:\'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 1em;">';
                ////html += '                   <option value="BudgetWorkflow.com">bizalicious.com</option>';
                //html += '                   <option value="BudgetWorkflow.com">BudgetWorkflow.com</option>';
                ////html += '                   <option>Microsoft</option>'; // Microsoft login needs work, so is only an option in the drop down when this.options.developerModeEnabled == true.
                //html += '               </select>';
                //html += '               &nbsp;&nbsp;';
                //html += '           </div>';



                html += '       </td>';
                html += '   </tr>';
                html += '   <tr>';
                html += '       <td></td>';
                html += '       <td>';
                // 1-28-2022 // Moved the "Remember Me" checkbox here.
                html += '<table style="width:100%;">';
                html += '<tbody>';
                html += '   <tr>';
                html += '       <td style="text-align:right;">';



                //html += '           <span style="cursor:help;color:gray;" title="Auto-logon with local storage. Your logon information gets saved in local storage so that you aren\'t subsequently prompted to logon.">';
                //html += '               <input onclick="$(\'.bwAuthentication\').bwAuthentication(\'changeRememberMeCheckboxSetting_OnClick\');" id="cbCustomLogonRememberMe" type="checkbox" style="cursor:pointer;zoom: 1.25;transform: scale(1.25);-ms-transform: scale(1.25);-webkit-transform: scale(1.25);-o-transform: scale(1.25);-moz-transform: scale(1.25);transform-origin: 0 0;-ms-transform-origin: 0 0;-webkit-transform-origin: 0 0;-o-transform-origin: 0 0;-moz-transform-origin: 0 0;" checked="">';
                //html += '               &nbsp;Remember me';
                //html += '           </span>';



                html += '       </td>';
                html += '   </tr>';
                html += '</tbody>';
                html += '</table>';
                html += '           &nbsp;&nbsp;';
                html += '           <span id="spanAzureADConnectionDetails"></span>';
                html += '       </td>';
                html += '   </tr>';
                html += '   <tr>';
                html += '       <td colspan="2">';
                //html += '           <br />';
                html += '           <div style="height:50px;text-align:center;line-height:1.1em;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:22pt;">&nbsp;&nbsp;or&nbsp;&nbsp;</div>';
                html += '       </td>';
                html += '   </tr>';
                html += '   <tr>';
                html += '       <td colspan="2">';
                html += '           <div class="divSignInButton" style="width:300px; text-align: center; line-height: 1.1em; font-weight: bold;z-index:15;border:1px solid skyblue;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayCreateFreeAccountDialog\', true);">';
                html += '               Sign Up&nbsp;&nbsp;';
                html += '           </div>';
                html += '       </td>';
                html += '   </tr>';
                html += '</table>';
            } else {
                displayAlertDialog('Error in bwActiveMenu_Main.js.renderHomePageContent(). Unexpected value for this.options.developerModeEnabled: ' + this.options.developerModeEnabled);
            }
            html += '        </div>';
            //
            // end: Sign in and sign up buttons.
            //






            html += '   <br />';
            html += '   <br />';
            html += '   <br />';



            //html += '<span style="font-family:\'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:25pt;">';
            //html += '   Approve capital expenditure CAPEX/OPEX projects by collaborating with this workflow solution.';
            //html += '   <br />';
            //html += '   You can automate your approvals, involving your stakeholders, subject matter experts, and managers. It\'s a Budgeting solution for any organization that requires multiple approvals.';
            //html += '</span>';
            //html += '   <br />';
            //html += '<span style="font-family:\'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:20pt;">';
            //html += '   <ul>';
            //html += '   <li>Users create "Budget Requests"</li>';
            //html += '   <li>Emails are sent to the workflow participants when they have a Budget Request to review</li>';
            //html += '   <li>Using the Organization Editor, you assign participants to roles in your org structure, for divisions, groups, legal entities, and locations</li>';
            ////html += '   <li>"Financial Areas" are corollaries to General Ledger accounts. Most businesses have these defined as areas of responsibility within departments or management areas of responsibility</li>';
            //html += '   <li>At the end of the approval process, issuing a purchase order number may be specified, enabling integration with your accounting system</li>';
            //html += '   <li>Budget Thresholds determine if participants need to review a Budget Request</li>';
            //html += '   <li>Approvers can ask for additional information at any stage of the workflow</li>';
            //html += '   <li>Plus so much more...</li>';
            //html += '   </ul>';
            //html += '</span>';




            //html += '   <br /><br /><br />';



















            ////html += '        <br /><br /><br /><br />';
            //html += '        <table style="margin-left:auto;margin-right:auto;">';
            ////html += '            <tr>';
            ////html += '                <td style="text-align:left;color: #262626;">';
            ////html += '                    What is a budget request system good for? <a href="https://www.youtube.com/channel/UCrSjwzcBA-9zVhvFdnuhRFg" target="_blank" class="bwLink">See the youtube video</a>';
            ////html += '                </td>';
            ////html += '            </tr>';
            ////html += '            <tr>';
            ////html += '                <td style="height:25px;"></td>';
            ////html += '            </tr>';




            ////
            //// Removed this link and put in the slideshow 8-4-2022
            ////
            //html += '            <tr>';
            //html += '                <td style="text-align:center;color: #262626;">';
            ////html += '                    How does it work?xcx1 <span class="bwLinkRed" onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForButton\', \'SLIDES_BUTTON\', \'SLIDES\');">See the slides</span>'; // 
            //html += '                </td>';
            //html += '            </tr>';

            //html += '            <tr>';
            //html += '                <td style="height:25px;">';
            //html += '                   <div id="bwActiveMenu_Main_divBwHowDoesItWorkCarousel"></div>';
            //html += '               </td>';
            //html += '            </tr>';





            //html += '            <tr>';
            //html += '                <td style="height:25px;"></td>';
            //html += '            </tr>';
            //html += '        </table>';






            // BOTTOM SECTION

            //html += '<br />';

            //html += '<span style="font-family: SFProDisplay-Regular, Helvetica, Arial, sans-serif;font-size: 38px;font-weight: normal;">';
            //html += '   A forms-based social network for your enterprise.';
            //html += '   <br />'; 
            //html += '   <span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 28px;font-weight: normal;">';
            //html += '       Manage, contribute, share, and collaborate in a new and easier way, with this forms, workflow, and inventory software.';
            //html += '   </span>';
            //html += '   <br />';
            //html += '   <span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 28px;font-weight: normal;">';
            //html += '       Involve your managers, subject matter experts, and stakeholders. Optimize procurement, capex/opex, quoting... any process that requires multiple approvals. ';
            //html += '   </span>';
            //html += '   <br />';
            //html += '</span>';

            //html += '<br />';

            // end: BOTTOM SECTION



            html += '       <br />';
            // <span style="padding-left:1px;color:darkorange;font-weight:normal;vertical-align:top;">   Welcome to the December 1, 2022 version of this software.</span>
            //html += '       <span style="font-size:15pt;padding-left:1px;color:goldenrod;font-weight:normal;vertical-align:top;"><span style="font-size:20pt;">This project is open source.</span> Sign Up, try it out, and email me to get approved for the source code. Generally approved for "Not For Resale" use, and some additional conditions may apply. Contact me at todd@budgetworkflow.com. On Twitter @budgetworkflow.</span>';
            html += '       <br />';





            //html += '        <table style="margin-left:auto;margin-right:auto;">';
            html += '        <table>';

            //
            // "Buy Now" buttons.
            //
            html += '            <tr>';
            html += '                <td style="">';
            html += '<table>';
            html += '    <tr>';
            html += '        <td><span class="spanPurchaseNowDescription">Get assistance configuring your organization.xcx1-3</span></td>';
            html += '        <td></td>';
            html += '        <td>';
            html += '            <div class="divPurchaseNowButton" onclick="$(\'.bwAuthentication\').bwAuthentication(\'purchase_one_hour_support\');">';
            html += '                $105 /hour';
            html += '            </div>';
            html += '        </td>';
            html += '    </tr>';
            html += '    <tr>';
            html += '        <td><span class="spanPurchaseNowDescription">Get started with low traffic hosting.</span></td>';
            html += '        <td></td>';
            html += '        <td>';

            html += '            <div class="divPurchaseNowButton" onclick="$(\'.bwAuthentication\').bwAuthentication(\'purchase_one_month_low_traffic_hosting\');">';
            html += '                $105 /month';
            html += '            </div>';
            html += '&nbsp;&nbsp;';
            html += '            <div class="divPurchaseNowButton" onclick="$(\'.bwAuthentication\').bwAuthentication(\'purchase_one_year_low_traffic_hosting\');">';
            html += '                $987 /year';
            html += '            </div>';

            html += '        </td>';
            html += '    </tr>';
            //html += '    <tr>';
            ////html += '        <td><span class="spanPurchaseNowDescription">Get started with low traffic hosting.</span></td>';
            //html += '        <td></td>';
            //html += '        <td></td>';
            //html += '        <td>';
            //html += '            <div class="divPurchaseNowButton" onclick="$(\'.bwAuthentication\').bwAuthentication(\'purchase_one_year_low_traffic_hosting\');">';
            //html += '                $987 /year';
            //html += '            </div>';
            //html += '        </td>';
            //html += '    </tr>';

            //html += '    <tr>';
            //html += '        <td><span class="spanPurchaseNowDescription">Interested in open source? Get the code.</span></td>';
            //html += '        <td></td>';
            //html += '        <td>';
            //html += '            <div class="divPurchaseNowButton" onclick="$(\'.bwAuthentication\').bwAuthentication(\'purchase_source_code\');">';
            //html += '                $1 /code';
            //html += '            </div>';
            //html += '        </td>';
            //html += '    </tr>';
            html += '    <tr>';
            html += '        <td><span class="spanPurchaseNowDescription" xcx="xcx213123-1">Deploy to your domain and hosted servers.</span></td>';
            html += '        <td></td>';
            html += '        <td>';
            html += '            <div class="divPurchaseNowButton" onclick="$(\'.bwAuthentication\').bwAuthentication(\'deploy_to_hosted_servers\');">';
            html += '                $5,705 /deploy';
            html += '            </div>';
            html += '        </td>';
            html += '    </tr>';

            html += '    <tr>';
            html += '        <td colspan="3"><br /><br /><br /></td>';
            html += '    </tr>';


            // 9-25-2023.
            html += '    <tr>';
            html += '       <td xcx="xcx123131233 Contribute to the cause. TURN ON HERE."></td>';
            //html += '        <td><span class="spanPurchaseNowDescription" xcx="xcx9872325">Contribute to the cause.</span></td>';
            //html += '        <td></td>';
            //html += '        <td>';
            //html += '            <div class="divPurchaseNowButton" onclick="$(\'.bwDonate\').bwDonate(\'displayDonationDialog\');">';
            //html += '               ❤ Donate';
            //html += '            </div>';
            //html += '        </td>';
            html += '    </tr>';




            html += '</table>';
            html += '<br /><br />';
            html += '               </td>';
            html += '            </tr>';
            //
            // end: "Buy Now" buttons.
            //

            //html += '            <tr>';
            //html += '                <td style="text-align:center;color: #262626;">';
            //html += '                </td>';
            //html += '            </tr>';
            //html += '            <tr>';
            //html += '                <td style="height:25px;">';
            //html += '                   <div id="bwActiveMenu_Main_divBwProductCarousel_1"></div>';
            //html += '               </td>';
            //html += '            </tr>';
            //html += '            <tr>';
            //html += '                <td style="text-align:center;color: #262626;">';
            //html += '                </td>';
            //html += '            </tr>';
            //html += '            <tr>';
            //html += '                <td style="height:25px;">';
            //html += '                   <div id="bwActiveMenu_Main_divBwProductCarousel_2"></div>';
            //html += '               </td>';
            //html += '            </tr>';
            //html += '            <tr>';
            //html += '                <td style="text-align:center;color: #262626;">';
            //html += '                </td>';
            //html += '            </tr>';
            //html += '            <tr>';
            //html += '                <td style="height:25px;">';
            //html += '                   <div id="bwActiveMenu_Main_divBwProductCarousel_3"></div>';
            //html += '               </td>';
            //html += '            </tr>';
            //html += '            <tr>';
            //html += '                <td style="text-align:center;color: #262626;">';
            //html += '                </td>';
            //html += '            </tr>';
            //html += '            <tr>';
            //html += '                <td style="height:25px;">';
            //html += '                   <div id="bwActiveMenu_Main_divBwProductCarousel_4"></div>';
            //html += '               </td>';
            //html += '            </tr>';
            //html += '            <tr>';
            //html += '                <td style="text-align:center;color: #262626;">';
            //html += '                </td>';
            //html += '            </tr>';
            //html += '            <tr>';
            //html += '                <td style="height:25px;">';
            //html += '                   <div id="bwActiveMenu_Main_divBwProductCarousel_5"></div>';
            //html += '               </td>';
            //html += '            </tr>';
            //html += '            <tr>';
            //html += '                <td style="text-align:center;color: #262626;">';
            //html += '                </td>';
            //html += '            </tr>';
            //html += '            <tr>';
            //html += '                <td style="height:25px;">';
            //html += '                   <div id="bwActiveMenu_Main_divBwProductCarousel_6"></div>';
            //html += '               </td>';
            //html += '            </tr>';
            //html += '            <tr>';
            //html += '                <td style="text-align:center;color: #262626;">';
            //html += '                </td>';
            //html += '            </tr>';
            //html += '            <tr>';
            //html += '                <td style="height:25px;">';
            //html += '                   <div id="bwActiveMenu_Main_divBwProductCarousel_7"></div>';
            //html += '               </td>';
            //html += '            </tr>';
            //html += '            <tr>';
            //html += '                <td style="text-align:center;color: #262626;">';
            //html += '                </td>';
            //html += '            </tr>';
            //html += '            <tr>';
            //html += '                <td style="height:25px;">';
            //html += '                   <div id="bwActiveMenu_Main_divBwProductCarousel_8"></div>';
            //html += '               </td>';
            //html += '            </tr>';
            //html += '            <tr>';
            //html += '                <td style="text-align:center;color: #262626;">';
            //html += '                </td>';
            //html += '            </tr>';
            //html += '            <tr>';
            //html += '                <td style="height:25px;">';
            //html += '                   <div id="bwActiveMenu_Main_divBwProductCarousel_9"></div>';
            //html += '               </td>';
            //html += '            </tr>';
            ////html += '            <tr>';
            ////html += '                <td style="">';
            ////html += '                   <div class="divSignInButton" style="width:520px;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'purchaseTest\');">Purchase 1 hour of assistance ($105+tax)&nbsp;&nbsp;</div>'; // style="width:520px; text-align: center; line-height: 1.1em; font-weight: bold;z-index:15;border:1px solid skyblue;"
            ////html += '               </td>';
            ////html += '            </tr>';



            ////
            //// "Buy Now" buttons.
            ////
            //html += '            <tr>';
            //html += '                <td style="">';
            //html += '<table>';
            //html += '    <tr>';
            //html += '        <td><span class="spanPurchaseNowDescription">Get assistance configuring your organization.</span></td>';
            //html += '        <td></td>';
            //html += '        <td>';
            //html += '            <div class="divPurchaseNowButton" onclick="$(\'.bwAuthentication\').bwAuthentication(\'purchase_one_hour_support\');">';
            //html += '                $105 /hour';
            //html += '            </div>';
            //html += '        </td>';
            //html += '    </tr>';
            //html += '    <tr>';
            //html += '        <td><span class="spanPurchaseNowDescription">Get started with low traffic hosting.</span></td>';
            //html += '        <td></td>';
            //html += '        <td>';

            //html += '            <div class="divPurchaseNowButton" onclick="$(\'.bwAuthentication\').bwAuthentication(\'purchase_one_month_low_traffic_hosting\');">';
            //html += '                $105 /month';
            //html += '            </div>';
            //html += '&nbsp;&nbsp;';
            //html += '            <div class="divPurchaseNowButton" onclick="$(\'.bwAuthentication\').bwAuthentication(\'purchase_one_year_low_traffic_hosting\');">';
            //html += '                $987 /year';
            //html += '            </div>';

            //html += '        </td>';
            //html += '    </tr>';
            ////html += '    <tr>';
            //////html += '        <td><span class="spanPurchaseNowDescription">Get started with low traffic hosting.</span></td>';
            ////html += '        <td></td>';
            ////html += '        <td></td>';
            ////html += '        <td>';
            ////html += '            <div class="divPurchaseNowButton" onclick="$(\'.bwAuthentication\').bwAuthentication(\'purchase_one_year_low_traffic_hosting\');">';
            ////html += '                $987 /year';
            ////html += '            </div>';
            ////html += '        </td>';
            ////html += '    </tr>';

            ////html += '    <tr>';
            ////html += '        <td><span class="spanPurchaseNowDescription">Interested in open source? Get the code.</span></td>';
            ////html += '        <td></td>';
            ////html += '        <td>';
            ////html += '            <div class="divPurchaseNowButton" onclick="$(\'.bwAuthentication\').bwAuthentication(\'purchase_source_code\');">';
            ////html += '                $1 /code';
            ////html += '            </div>';
            ////html += '        </td>';
            ////html += '    </tr>';
            //html += '    <tr>';
            //html += '        <td><span class="spanPurchaseNowDescription">Deploy to your domain and hosted servers.</span></td>';
            //html += '        <td></td>';
            //html += '        <td>';
            //html += '            <div class="divPurchaseNowButton" onclick="$(\'.bwAuthentication\').bwAuthentication(\'deploy_to_hosted_servers\');">';
            //html += '                $5,705 /deploy';
            //html += '            </div>';
            //html += '        </td>';
            //html += '    </tr>';
            //html += '</table>';
            //html += '<br /><br />';
            //html += '               </td>';
            //html += '            </tr>';
            ////
            //// end: "Buy Now" buttons.
            ////




            html += '        </table>';











            html += '        <br /><br /><br /><br /><br />';
            html += '        <hr style="border:0 none; border-bottom: 1px solid lightgray;" />';
            html += '        <div style="vertical-align:bottom;">';
            html += '            <table style="width:100%;">';
            html += '                <tr>';
            html += '                    <td style="text-align:left;padding-left:10px;">';
            html += '                        <img src="sharepoint/sharepoint.png" style="height:50px;width:50px;vertical-align:middle;" />';
            html += '                        <a class="bwLink" href="https://budgetworkflow.com/sharepoint/index.html">The SharePoint Budget Workflow Add-In details are here.</a>';
            html += '                    </td>';
            html += '                    <td></td>';
            html += '                    <td style="text-align:right;">';
            html += '                        &nbsp;&nbsp;&nbsp;&nbsp;';


            // GNU








            //html += '                        <a download href="/fsf/FSF Redist full codebase budgetworkflow-com 12-29-2023.zip">Download the latest codebase.</a>&nbsp;&nbsp;&nbsp;&nbsp;';







            html += '                        <a href="/about/discover-original.html">Discover</a>&nbsp;&nbsp;&nbsp;&nbsp;';



            //var developerModeEnabled = $('.bwAuthentication').bwAuthentication('option', 'developerModeEnabled');
            //if (developerModeEnabled) {
            html += '                        <a href="/about/javascript.html" rel="jslicense">JavaScript license information</a>&nbsp;&nbsp;&nbsp;&nbsp;';
            //}

            html += '                        <a href="privacy.html" target="_blank" class="bwLink">Privacy</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="terms-of-use.html" target="_blank" class="bwLink">Terms of use</a>';
            html += '                        &nbsp;&nbsp;&nbsp;&nbsp;';
            html += '                      </td>';
            html += '                </tr>';
            html += '            </table>';
            html += '        </div>';

            $('#divPageContent1').html(html);

            this.adjustLeftSideMenu();

            // Select the HOME button here. 1-4-2024.
            var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');
            if (!workflowAppTheme) { // Need to do this for the home page when not logged in.
                workflowAppTheme = 'brushedAluminum_green';
            }
            var workflowAppTheme_SelectedButton = workflowAppTheme + '_SelectedButton';
            var x = $('#divWelcomeButton').hasClass('leftButton');
            if (x == true) {
                //debugger;
                $('#divWelcomeButton').addClass(workflowAppTheme_SelectedButton).removeClass(workflowAppTheme);
            } else {
                console.log('In $(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'renderHomePageContent\', ). Error: Unable to locate class leftButton. xcx1-3.');
                alert('In $(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'renderHomePageContent\', ). Error: Unable to locate class leftButton. xcx1-3');
            }




            //
            // Ping the server to make sure it is running. If not, put a message on the screen.
            //
            console.log('In bwActiveMenu_Main.js.renderHomePageContent(). Ping the server to make sure it is running. If not, put a message on the screen.');

            $.ajax({
                url: this.options.operationUriPrefix + "_bw/servicescheck/ALL",
                type: "GET",
                timeout: 2000, // This is 2 seconds, which determines the responsiveness of the application. This seems like a good setting so far.
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (results) {
                    try {

                        console.log('The service responded at ' + thiz.options.operationUriPrefix + ', results: ' + JSON.stringify(results));
                        //alert('The service responded at ' + thiz.options.operationUriPrefix + ', results: ' + JSON.stringify(results));

                        alert('Calling page_Load() from bwActiveMenu_Main_Discover.js.');
                        page_Load();

                    } catch (e) {
                        //console.log('Exception in bwActiveMenu_Main.js.renderHomePageContent():2: ' + e.message + ', ' + e.stack);
                        //displayAlertDialog('Exception in bwActiveMenu_Main.js.renderHomePageContent():2: ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (results) {
                    try {

                        if (results.statusText == 'timeout') {

                            // If we get here, we don't know for sure that the web services are not responding, because:
                            // - The database test query could make it take too long.
                            // - The file services check could make it take too long.
                            console.log('In bwActiveMenu_Main.js.renderHomePageContent.error(). Timeout. Test inconclusive.');

                            // Display the Service Unavailable message on the home screen.
                            var html = '';

                            html += '<span style="font-size:25pt;font-weight:bold;color:tomato;">';
                            var serviceUnavailableMessage = $('.bwAuthentication').bwAuthentication('option', 'ServiceUnavailableMessage'); // The "ServiceUnavailableMessage" message is stored in the bwAuthentication.js widget.
                            html += '   <br />' + serviceUnavailableMessage;
                            html += '   <span style="cursor:pointer;" alt="" title="Timeout. Test inconclusive.">Ⓘ</span>';
                            html += '   <br />';
                            html += '</span>';

                            document.getElementById('divSignInOrSignUpIndexPageButtons').innerHTML = html;

                        } else if (results.statusText == 'Backend fetch failed') {

                            console.log('In bwActiveMenu_Main.js.renderHomePageContent.error(). Varnish error. Backend fetch failed.');

                            // Display the Service Unavailable message on the home screen.
                            var html = '';

                            html += '<span style="font-size:25pt;font-weight:bold;color:tomato;">';
                            var serviceUnavailableMessage = $('.bwAuthentication').bwAuthentication('option', 'ServiceUnavailableMessage'); // The "ServiceUnavailableMessage" message is stored in the bwAuthentication.js widget.
                            html += '   <br />' + serviceUnavailableMessage;
                            html += '   <span style="cursor:pointer;" alt="" title="Varnish error. Backend fetch failed.">Ⓘ</span>';
                            html += '   <br />';
                            html += '</span>';

                            document.getElementById('divSignInOrSignUpIndexPageButtons').innerHTML = html;

                        } else {

                            console.log('In bwActiveMenu_Main.js.renderHomePageContent.error(). results: ' + JSON.stringify(results));

                            // Display the Service Unavailable message on the home screen.
                            var html = '';

                            html += '<span style="font-size:25pt;font-weight:bold;color:tomato;">';
                            var serviceUnavailableMessage = $('.bwAuthentication').bwAuthentication('option', 'ServiceUnavailableMessage'); // The "ServiceUnavailableMessage" message is stored in the bwAuthentication.js widget.
                            html += '   <br />' + serviceUnavailableMessage;
                            html += '   <span style="cursor:pointer;" alt="" title="Results: ' + JSON.stringify(results, null, 2) + '">Ⓘ</span>';
                            html += '   <br />';
                            html += '</span>';

                            document.getElementById('divSignInOrSignUpIndexPageButtons').innerHTML = html;

                        }

                    } catch (e) {
                        console.log('Exception in bwActiveMenu_Main.js.renderHomePageContent.error(): ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwActiveMenu_Main.js.renderHomePageContent.error(): ' + e.message + ', ' + e.stack);
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
            console.log('Exception in bwActiveMenu_Main.js.renderHomePageContent(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwActiveMenu_Main.js.renderHomePageContent(): ' + e.message + ', ' + e.stack);
        }
    },

    renderHomeScreen: function () { //userIsATenantOwner, iData, faData) {
        try {
            console.log('In bwActiveMenu_Main.js.renderHomeScreen().');


            

            var userIsATenantOwner = $('.bwAuthentication').bwAuthentication('option', 'userIsATenantOwner');
            var iData = $('.bwAuthentication').bwAuthentication('option', 'iData');
            var faData = $('.bwAuthentication').bwAuthentication('option', 'faData');



            //
            //
            // Populate the top bar org picker drop down. 12-16-2023.
            //
            //
            var html2 = '';

            if (iData.length == 1) {

                // There is only 1 workflow, so display it as text.
                html2 += '<span class="OrgPickerDropdown_Item">' + iData[0].bwWorkflowAppTitle + '</span>';

                //
                //html += '<span id="spanHomePageWorkflowAppTitle" style="font-weight:bold;cursor:default;white-space:nowrap;" title="You are the owner of this workflow.">' + iData[0].bwWorkflowAppTitle + '</span>';

                //var selectedOrganization = { // 9-7-2021 STARTING TO RENAME THESE VARS A BIT BETTER FOR FINAL RELEASE.
                //    OrganizationId: iData[0].bwWorkflowAppId,
                //    OrganizationTitle: iData[0].bwWorkflowAppTitle,
                //    OrganizationRole: iData[0].bwParticipantRole
                //}

                //$('.bwAuthentication').bwAuthentication('option', 'SelectedOrganization', selectedOrganization);

                //// Put the workflow title, eg: "Corporate Entity 2020" in the blue header bar for each page! :D
                //var workflowTitleBlueTopHeaderBarWorkflowTitle = document.getElementsByClassName('divTopBarTextContents_WorkflowTitle');
                //for (var t = 0; t < workflowTitleBlueTopHeaderBarWorkflowTitle.length; t++) {
                //    workflowTitleBlueTopHeaderBarWorkflowTitle[t].innerHTML = iData[0].bwWorkflowAppTitle; // removed colon 5-14-2020 // + ': '; //'WorkflowTitle::';
                //}


            } else {

                // There is more than 1 item, so display in a drop down.

                //html += '<span id="spanHomePageWorkflowAppTitle">';

                //console.log('In bwActiveMenu_Main.js.renderHomeScreen(). Populating [selectHomePageWorkflowAppDropDown] with ' + iData.length + ' organizations.');
                ////alert('In bwActiveMenu_Main.js.renderHomeScreen(). Populating [selectHomePageWorkflowAppDropDown] with ' + iData.length + ' organizations.');

                //var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

                //html += '<select id="selectHomePageWorkflowAppDropDown" onchange="$(\'.bwAuthentication\').bwAuthentication(\'selectHomePageWorkflowAppDropDown_change\');" class="selectHomePageWorkflowAppDropDown" style="cursor:pointer;font-weight:bold;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 1.25em;">';
                for (var i = 0; i < iData.length; i++) {
                    if (workflowAppId == iData[i].bwWorkflowAppId) {

                        //html += '<option value="' + iData[i].bwWorkflowAppId + '|' + iData[i].bwParticipantRole + '" selected>' + iData[i].bwWorkflowAppTitle + '</option>';

                        html2 += '<span class="OrgPickerDropdown_Item" value="' + iData[i].bwWorkflowAppId + '|' + iData[i].bwParticipantRole + '" onclick="$(\'.bwAuthentication\').bwAuthentication(\'selectHomePageWorkflowAppDropDown_change2\', this);">' + iData[i].bwWorkflowAppTitle + '</span>';

                        //var selectedOrganization = { // 9-7-2021 STARTING TO RENAME THESE VARS A BIT BETTER FOR FINAL RELEASE.
                        //    OrganizationId: iData[i].bwWorkflowAppId,
                        //    OrganizationTitle: iData[i].bwWorkflowAppTitle,
                        //    OrganizationRole: iData[i].bwParticipantRole
                        //}

                        //$('.bwAuthentication').bwAuthentication('option', 'SelectedOrganization', selectedOrganization);


                        //// Put the workflow title, eg: "Corporate Entity 2020" in the blue header bar for each page! :D
                        //var workflowTitleBlueTopHeaderBarWorkflowTitle = document.getElementsByClassName('divTopBarTextContents_WorkflowTitle');
                        //for (var t = 0; t < workflowTitleBlueTopHeaderBarWorkflowTitle.length; t++) {
                        //    workflowTitleBlueTopHeaderBarWorkflowTitle[t].innerHTML = iData[i].bwWorkflowAppTitle; // removed colon 5-14-2020 // + ': '; //'WorkflowTitle::';
                        //}


                    } else {

                        //html += '<option value="' + iData[i].bwWorkflowAppId + '|' + iData[i].bwParticipantRole + '" style="color:red;">' + iData[i].bwWorkflowAppTitle + '</option>';

                        html2 += '<span class="OrgPickerDropdown_Item" value="' + iData[i].bwWorkflowAppId + '|' + iData[i].bwParticipantRole + '" onclick="$(\'.bwAuthentication\').bwAuthentication(\'selectHomePageWorkflowAppDropDown_change2\', this);">' + iData[i].bwWorkflowAppTitle + '</span>';

                    }

                    html2 += '<br />';

                }

            }

            $('#divOrganizationPickerDropDown').html(html2);




            //
            //
            // end: Populate the top bar org picker drop down.
            //
            //















            console.log('In bwActiveMenu_Main.js.renderHomeScreen(). userIsATenantOwner: ' + userIsATenantOwner);

            if (userIsATenantOwner == 'true') {

                var html = '';

                html += '<table style="width:100%;">';
                html += '   <tr>';
                html += '       <td>';







                //
                //
                // Decided that the org picker is supposed to be here. 12-18-2023.
                //   - This gets instantiated as a "bwOrganizationPicker" widget below.
                //
                //
                html += '<div style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 2.77em;">Your selected organizational unit: ';
                html += '<span id="spanHomePageWorkflowAppTitle" style="display:inline;"></span>';
                //
                //
                // end: Decided that the org picker is supposed to be here. 12-18-2023.
                //   - This gets instantiated as a "bwOrganizationPicker" widget below.
                //
                //








                //
                //
                // This is the original organization selector. We have moved this to the otp bar. Keeping this code here for now. 12-16-2023.
                //
                //

                //html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 2.77em;">Your organization: ';
                //if (iData.length == 1) {
                //    // There is only 1 workflow, so display it as text.
                //    html += '<span id="spanHomePageWorkflowAppTitle" style="font-weight:bold;cursor:default;white-space:nowrap;" title="You are the owner of this workflow.">' + iData[0].bwWorkflowAppTitle + '</span>';


                //    //thiz.options.SelectedOrganization = { // 9-7-2021 STARTING TO RENAME THESE VARS A BIT BETTER FOR FINAL RELEASE.
                //    //    OrganizationId: iData[0].bwWorkflowAppId,
                //    //    OrganizationTitle: iData[0].bwWorkflowAppTitle,
                //    //    OrganizationRole: iData[0].bwParticipantRole
                //    //}

                //    var selectedOrganization = { // 9-7-2021 STARTING TO RENAME THESE VARS A BIT BETTER FOR FINAL RELEASE.
                //        OrganizationId: iData[0].bwWorkflowAppId,
                //        OrganizationTitle: iData[0].bwWorkflowAppTitle,
                //        OrganizationRole: iData[0].bwParticipantRole
                //    }

                //    $('.bwAuthentication').bwAuthentication('option', 'SelectedOrganization', selectedOrganization);


                //    // Put the workflow title, eg: "Corporate Entity 2020" in the blue header bar for each page! :D
                //    var workflowTitleBlueTopHeaderBarWorkflowTitle = document.getElementsByClassName('divTopBarTextContents_WorkflowTitle');
                //    for (var t = 0; t < workflowTitleBlueTopHeaderBarWorkflowTitle.length; t++) {
                //        workflowTitleBlueTopHeaderBarWorkflowTitle[t].innerHTML = iData[0].bwWorkflowAppTitle; // removed colon 5-14-2020 // + ': '; //'WorkflowTitle::';
                //    }


                //} else {

                //    // There is more than 1 item, so display in a drop down.
                //    //debugger; // WHY ARE WE NOT GETTING ANY CONTENTS FOR THIS DROP DOWN??????????????
                //    html += '<span id="spanHomePageWorkflowAppTitle">';

                //    console.log('In bwActiveMenu_Main.js.renderHomeScreen(). Populating [selectHomePageWorkflowAppDropDown] with ' + iData.length + ' organizations.');
                //    //alert('In bwActiveMenu_Main.js.renderHomeScreen(). Populating [selectHomePageWorkflowAppDropDown] with ' + iData.length + ' organizations.');

                //    var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

                //    html += '<select id="selectHomePageWorkflowAppDropDown" onchange="$(\'.bwAuthentication\').bwAuthentication(\'selectHomePageWorkflowAppDropDown_change\');" class="selectHomePageWorkflowAppDropDown" style="cursor:pointer;font-weight:bold;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 1.25em;">';
                //    for (var i = 0; i < iData.length; i++) {
                //        if (workflowAppId == iData[i].bwWorkflowAppId) {
                //            //debugger;
                //            html += '<option value="' + iData[i].bwWorkflowAppId + '|' + iData[i].bwParticipantRole + '" selected>' + iData[i].bwWorkflowAppTitle + '</option>';

                //            //thiz.options.SelectedOrganization = { // 9-7-2021 STARTING TO RENAME THESE VARS A BIT BETTER FOR FINAL RELEASE.
                //            //    OrganizationId: iData[i].bwWorkflowAppId,
                //            //    OrganizationTitle: iData[i].bwWorkflowAppTitle,
                //            //    OrganizationRole: iData[i].bwParticipantRole
                //            //}

                //            var selectedOrganization = { // 9-7-2021 STARTING TO RENAME THESE VARS A BIT BETTER FOR FINAL RELEASE.
                //                OrganizationId: iData[i].bwWorkflowAppId,
                //                OrganizationTitle: iData[i].bwWorkflowAppTitle,
                //                OrganizationRole: iData[i].bwParticipantRole
                //            }

                //            $('.bwAuthentication').bwAuthentication('option', 'SelectedOrganization', selectedOrganization);


                //            //// Put the workflow title, eg: "Corporate Entity 2020" in the blue header bar for each page! :D
                //            //var workflowTitleBlueTopHeaderBarWorkflowTitle = document.getElementsByClassName('divTopBarTextContents_WorkflowTitle');
                //            //for (var t = 0; t < workflowTitleBlueTopHeaderBarWorkflowTitle.length; t++) {
                //            //    workflowTitleBlueTopHeaderBarWorkflowTitle[t].innerHTML = iData[i].bwWorkflowAppTitle; // removed colon 5-14-2020 // + ': '; //'WorkflowTitle::';
                //            //}


                //        } else {
                //            html += '<option value="' + iData[i].bwWorkflowAppId + '|' + iData[i].bwParticipantRole + '" style="color:red;">' + iData[i].bwWorkflowAppTitle + '</option>';
                //        }
                //    }
                //    html += '</select></span>';
                //}
                //html += '</span>';

                //
                //
                // end: This is the original organization selector. We have moved this to the top bar. Keeping this code here for now. 12-16-2023.
                //
                //
























                var developerModeEnabled = $('.bwAuthentication').bwAuthentication('option', 'developerModeEnabled');

                if (developerModeEnabled && (developerModeEnabled == true)) {
                    // 1-9-2022
                    html += '<span style="float:right">';
                    html += 'View switcher: [xcx9631-1]&nbsp;&nbsp;&nbsp;[xcx9631-2]&nbsp;&nbsp;&nbsp;[xcx9631-3]&nbsp;&nbsp;&nbsp;[xcx9631-4]&nbsp;';
                    html += '';
                    html += '';
                    html += '</span>';
                }







                // search box. This exists elsewhere. Maybe it should be a widget.? 10-11-2022
                html += '<span id="" style="float:right;white-space:nowrap;">';
                html += '   Search: ';
                html += '   <span id="searchbox">';
                html += '       <input type="text" id="inputBwAuthentication_SearchBox" onkeydown="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'searchBox_OnKeyDown\', event);" style="WIDTH: 60%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" />';
                html += '       &nbsp;&nbsp;';
                html += '       <span class="emailEditor_newMessageButton" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'search\');">Search</span>';
                html += '   </span>';
                html += '</span>';












                html += '       </td>';
                html += '       <td style="text-align:right;">';
                //html += '           <span id="spanHomePagePrintButton" style="text-align:right;">[spanHomePagePrintButton]</span>';
                html += '       </td>';
                html += '   </tr>';
                html += '</table>';







                //// This is the drop down selector one. Not sure if I want this yet...
                //html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 2.77em;">Your budgeting network: ';
                //if (iData.length == 1) {
                //    // There is only 1 workflow, so display it as text.
                //    html += '<span id="spanHomePageWorkflowAppTitle" style="font-weight:bold;cursor:default;white-space:nowrap;" title="You are the owner of this workflow.">' + iData[0].bwWorkflowAppTitle + '</span>';
                //} else {
                //    // There is more than 1 item, so display in a drop down.
                //    html += '<span id="spanHomePageWorkflowAppTitle">';
                //    html += '<select id="selectHomePageWorkflowAppDropDown" onchange="selectHomePageWorkflowAppDropDown_change();" class="selectHomePageWorkflowAppDropDown" style="cursor:pointer;font-weight:bold;border-color:whitesmoke;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 1.25em;">';
                //    for (var i = 0; i < iData.length; i++) {
                //        if (workflowAppId == iData[i].bwWorkflowAppId) {
                //            html += '<option value="' + iData[i].bwWorkflowAppId + '|' + iData[i].bwParticipantRole + '" selected>' + iData[i].bwWorkflowAppTitle + '</option>';
                //        } else {
                //            html += '<option value="' + iData[i].bwWorkflowAppId + '|' + iData[i].bwParticipantRole + '" style="color:red;">' + iData[i].bwWorkflowAppTitle + '</option>';
                //        }
                //    }
                //    html += '</select></span>';
                //}
                //html += '</span>';


                //html += '<br />';
                html += '<span id="spanHomePagePersonalizedSection"></span>';






                //html += '<br /><br />';
                //html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 22pt;"><strong>Send invitations</strong></span><br />';
                //html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 22pt;">Invite a participant to your network by copy-and-pasting the invitation link into an email:&nbsp;<button id="btnInviteNewParticipant1" onclick="cmdInviteNewParticipant();" style="cursor:pointer;font-size:16pt;">Generate a new invitation link</button></span>';
                //html += '<br /><br />';
                //html += '<span id="invitationLink"></span>';
                //html += '<br /><br />';
                //html += '<div id="divHomePageAlert"></div>';
                //html += '<br />';
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
                    $('#divWelcomeMessage').html(html);

                    //debugger; // 1
                    // Render the Print button.
                    //var printButtonOptions = {
                    //    reportType: 'MyPendingTasksReport'
                    //};
                    //var $printbutton = $('#spanHomePagePrintButton').bwPrintButton(printButtonOptions);



                } else {
                    //$('#divWelcomeMessage').html(html);
                    $('#divPageContent1').html(html); // This clears the main content section of the page (within the star trek menu buttons and top bar).

                    //debugger; // 2
                    // Render the Print button.
                    //var printButtonOptions = {
                    //    reportType: 'MyPendingTasksReport'
                    //};
                    //var $printbutton = $('#spanHomePagePrintButton').bwPrintButton(printButtonOptions);



                    //
                    //
                    // Set the SelectedOrganization, populate the top bar, and instantiate the org picker on the home page.
                    //
                    //

                    if (iData.length == 1) {

                        document.getElementsByClassName('divTopBarTextContents_WorkflowTitle').innerHTML = iData[0].bwWorkflowAppTitle;

                        // There is only 1 workflow.

                        var selectedOrganization = { // 9-7-2021 STARTING TO RENAME THESE VARS A BIT BETTER FOR FINAL RELEASE.
                            OrganizationId: iData[0].bwWorkflowAppId,
                            OrganizationTitle: iData[0].bwWorkflowAppTitle,
                            OrganizationRole: iData[0].bwParticipantRole
                        }

                        $('.bwAuthentication').bwAuthentication('option', 'SelectedOrganization', selectedOrganization);

                    } else {

                        // There is more than 1 item.

                        console.log('In bwActiveMenu_Main.js.renderHomeScreen(). Populating [selectHomePageWorkflowAppDropDown] with ' + iData.length + ' organizations.');
                        //alert('In bwActiveMenu_Main.js.renderHomeScreen(). Populating [selectHomePageWorkflowAppDropDown] with ' + iData.length + ' organizations.');

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

                                break;
                            }
                        }
                    }

                    //var bwLastSelectedOrgUnitId = null;

                    $('#spanHomePageWorkflowAppTitle').bwOrganizationPicker2({ bwLastSelectedOrgUnitId: 'root' }); // Added "bwLastSelectedOrgUnitId" to the "BwParticipant" table 12-18-2023.

                    //
                    //
                    // end: Set the SelectedOrganization, populate the top bar, and instantiate the org picker on the home page.
                    //
                    //


                    //debugger;
                    //alert('Calling renderHomePagePersonalizedSection_AndRenderButtons xcx1');
                    console.log('Calling renderHomePagePersonalizedSection_AndRenderButtons().xcx111223-3');
                    //thiz.renderHomePagePersonalizedSection_AndRenderButtons();
                    $('.bwAuthentication').bwAuthentication('renderHomePagePersonalizedSection_AndRenderButtons');

                }
                //html += '<br /><br /><hr />';
                ////html += 'You are the owner of this budget request system, "' + tenantData[0].bwTenantTitle + '". <a href="javascript:cmdTenantAdministration();">Administration</a><br /><br />';
                //html += 'You are the owner of this budget request system. <a href="javascript:cmdTenantAdministration();">Administration</a><br /><br />';

                //html += '<i><a href="javascript:cmdUpgradeAndPricingOptions();">Click here to learn about upgrade options</a></i>';
                //$('#divWelcomeMessage').html(html);
                ////checkForAlerts();
                //renderAlerts();
                //renderTenantOwnerStuff();
                //loadWorkflowAppConfigurationDetails();









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






                //debugger;
                renderAlerts2('xcx2'); // xcx2
                //loadWorkflowAppConfigurationDetails9();

            } else {

                alert('Error in bwActiveMenu_Main.js.renderHomeScreen(). Unexpected value for userIsATenantOwner: ' + userIsATenantOwner);

            }

        } catch (e) {
            console.log('Exception in bwActiveMenu_Main.js.renderHomeScreen(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwActiveMenu_Main.js.renderHomeScreen(): ' + e.message + ', ' + e.stack);
        }
    },

    renderAuthenticatedHomePage: function () {
        try {
            console.log('In bwActiveMenu_Main.js.renderHomePage().');

            //var welcomeButton = document.getElementById('divWelcomeButton');
            //this.options.divWelcomeButton_OriginalHeight = welcomeButton.style.height;
            //alert('In bwActiveMenu_Main.js.renderAuthenticatedHomePage(). Set divWelcomeButton_OriginalHeight: ' + this.options.divWelcomeButton_OriginalHeight);

            //this.options.HomePage = false;
            this.renderMenu();

        } catch (e) {
            console.log('Exception in bwActiveMenu_Main.js.renderHomePage(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwActiveMenu_Main.js.renderHomePage(): ' + e.message + ', ' + e.stack);
        }
    },

    txtOrganizationPickerDropdown_OnKeyup: function (elementId) {
        try {
            console.log('In bwActiveMenu_Main.js.txtOrganizationPickerDropdown_OnKeyup(). elementId: ' + elementId);






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
            console.log('Exception in bwActiveMenu_Main.js.txtOrganizationPickerDropdown_OnKeyup(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwActiveMenu_Main.js.txtOrganizationPickerDropdown_OnKeyup(): ' + e.message + ', ' + e.stack);
        }
    },
    txtOrganizationPickerDropdown_OnMouseup: function () {
        try {
            console.log('In bwActiveMenu_Main.js.txtOrganizationPickerDropdown_OnMouseup().');
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

            //html += '<span class="OrgPickerDropdown_Item">Todd Hiltz Enterprises</span>';
            //html += '<br />';
            //html += 'Huntleys Diving and Marine';
            //html += '<br />';
            //html += 'Ray Buns Buns';

            //$('#divOrganizationPickerDropDown').html(html);


            // CHANGED 8-25-2020
            thiz.options.pickerDialog = $(this.element).find("#divOrganizationPickerDropDown"); // $('#' + parentElementId).find("#divLocationPickerDropDown"); // THIS IS how we can reference the dialog later on and close it etc.

            // thiz.options.pickerDialog.dialog({ // divLocationPickerDropDown
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
                    //var this2 = this;
                    $('.ui-widget-overlay').bind('click', function () {
                        //$(this2).dialog('close');
                        thiz.options.pickerDialog.dialog('close');
                        //$(this.element).find("#divLocationPickerDropDown").dialog('close');
                    });

                    // Hide the title bar.
                    $(this).dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
                },
                close: function () {

                    //debugger;
                    //var this2 = this;
                    //$('#' + parentElementId).find("#divLocationPickerDropDown").dialog('destroy');
                    thiz.options.pickerDialog.dialog('destroy');
                }

            });



            //}
        } catch (e) {
            console.log('Exception in bwActiveMenu_Main.js.txtOrganizationPickerDropdown_OnMouseup(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwActiveMenu_Main.js.txtOrganizationPickerDropdown_OnMouseup(): ' + e.message + ', ' + e.stack);
        }
    },
    renderMenu: function () {
        try {
            console.log('In bwActiveMenu_Main.js.renderMenu(). this.options.HomePage: ' + this.options.HomePage);
            //alert('In bwActiveMenu_Main.js.renderMenu(). this.options.HomePage: ' + this.options.HomePage);

            //var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            //var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            //var developerModeEnabled = $('.bwAuthentication').bwAuthentication('option', 'developerModeEnabled');

            if (this.options.HomePage == true) {

                //alert('xcx11111111111');

                // 4-12-2022 THIS IS THE NEW HOME PAGE MENU DISPLAY.
                console.log('In bwActiveMenu_Main.js.renderMenu(). >>>>>> this.options.HomePage: ' + this.options.HomePage);


                //var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');
                //console.log('In bwActiveMenu_Main.js.renderMenu(). Rendering the menu with theme: ' + workflowAppTheme);
                //alert('In bwActiveMenu_Main.js.renderMenu(). Rendering the menu with theme: ' + workflowAppTheme);

var workflowAppTheme = 'brushedAluminum_orange';

                var html = '';


                html += '<table id="tableMainMenu1" style="display:inline;width:100%;border-collapse: collapse;">';
                html += '        <tr>';

                html += '            <td style="width:1%;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                //html += '                <div xcx="xcx90987-1" id="divLeftMenuHeader" class="' + workflowAppTheme + '_noanimation noanimation" style="border-radius:26px 0 0 0;width: 250px; float:left; height:75px; background-color:darkgray; ">';
                //alert('xcx1111-3');
                html += '                <div xcx="xcx90987-1" id="divLeftMenuHeader" class="' + workflowAppTheme + '_noanimation noanimation" style="border-radius:26px 0 0 0;width: ' + this.options.LeftMenuWidth + '; float:left; height:75px; background-color:darkgray; ">';





                html += '                </div>';
                html += '            </td>';

                //html += '            <td style="width:0.1%;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                html += '            <td style="width:26px;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                html += '                    <div class="' + workflowAppTheme + '_noanimation noanimation" style="float:left;height:75px;width:26px;position:relative;background-color:darkgray;">';
                html += '                        <div style="position:absolute; bottom:0;float:left;width: 26px; height:26px; background-color:#f5f6fa; border-radius:26px 0 0 0;margin-left:1px;margin-bottom:-1px;"></div> <!-- The background-color is set to space white (#f5f6fa) here, for the "under the curve" color of this element. -->';
                html += '                    </div>';
                html += '                </div>';
                html += '            </td>';

                html += '            <td style="width:100%;vertical-align:top;padding:0 0 0 0;margin:0 0 0 -2px;border-width:0 0 0 0;">';
                html += '                <div id="divTopBar_Long" xcx="xcx1234-1" class="' + workflowAppTheme + '_noanimation noanimation" style="width: 100%; float:left; height:50px;  ">';

                html += `<span style="font-size:35pt;font-weight:normal;color:goldenrod;font-family:Verdana, Geneva, Tahoma, sans-serif;">ShareAndCollaborate.com</span>`;
                // The user is not logged in here so dont show this.
                //html += '                   <div class="brushedAluminum_noanimation noanimation" style="background-color:white;font-size:25pt;color:goldenrod;cursor:pointer;float:right;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayLoggedInUserDropDownInACircle\', true);">';
                //html += '                       <img src="/images/head5.png" xcx="xcx123234-1" class="noanimation brushedAluminum_purple_noanimation" style="width:35px;height:35px;padding-top:8px;padding-right:10px;" />';
                //html += '                   </div>';


                html += '               </div>';
                html += '            </td>';

                html += '            <td style="vertical-align:top;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                html += '                <div xcx="xcx21312-1" id="divTopBar_OrganizationName" class="' + workflowAppTheme + '_noanimation noanimation" style="width: 100%; float:left; height:50px; background-color:darkgray; "></div>';
                html += '                <div id="divLeftMenuTopSmallBar1" xcx="xcx4433221-1" class="brushedAluminum_green_noanimation noanimation" style="width: 100%; float:right; height:25px; background-color:#7788ff !important; color:white;"></div>';
                html += '            </td>';

                html += '            <td style="width:1%;vertical-align:top;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                //if (developerModeEnabled == true) {
                //    html += '                <div class="' + workflowAppTheme + '_noanimation noanimation" style="border-radius:0 26px 26px 0;width: 30px; float:left; height:49px; background-color:darkgray; ">xcx2132-1</div>';
                //} else {
                    html += '                <div class="' + workflowAppTheme + '_noanimation noanimation" style="border-radius:0 26px 26px 0;width: 30px; float:left; height:49px; background-color:darkgray; "></div>';
                //}
                html += '            </td>';

                html += '        </tr>';

                html += '        <tr>';

                //html += '            <td id="tdLeftSideMenu" style="width: 250px;vertical-align:top;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                //alert('xcx1111-4');
                html += '            <td id="tdLeftSideMenu" style="width: ' + this.options.LeftMenuWidth + ';vertical-align:top;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';


                html += '                <div weightedheightvalue="40" class="' + workflowAppTheme + '_noanimation noanimation" style="">';
                html += '                    <div class="leftButtonText">';
                html += '                        <span id="spanErrorLink" style="display:none;font-size:x-large;color:yellow;font-family:Chunkfive, Georgia, Palatino, Times New Roman, serif;font-weight:bold;cursor:pointer;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;" onclick="cmdDisplayCommunicationsError();">Error!&nbsp;&nbsp;&nbsp;&nbsp;</span>';
                html += '                    </div>';
                html += '                </div>';
                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:5px; background-color:white; "></div>';
                html += '                <div id="divLeftMenuTopSmallBar1" class="' + workflowAppTheme + '_noanimation noanimation" style="width: 100%; float:right; height:25px; background-color:#7788ff !important; color:white;font-family: \'Franklin Gothic Medium\', \'Arial Narrow\', Arial, sans-serif;display: flex !important;justify-content: flex-end !important;align-items: flex-end !important;"></div>';

                //html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:5px; background-color:white; "></div>';
                //html += '                <div weightedheightvalue="40" class="leftButton_inactive ' + workflowAppTheme + '" style="" >';
                //html += '                    <div class="leftButtonText">';
                //html += '                        tips';
                //html += '                    </div>';
                //html += '                </div>';

                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:5px; background-color:white; "></div>';
                html += '                <div weightedheightvalue="15" class="leftButton ' + workflowAppTheme + '" style="display:none;background-color:darkkhaki;" style="" ';
                html += 'onclick="location.href=\'/\';"';
                html += '>';
                html += '                    <div class="leftButtonText">HOME</div>';
                html += '                </div>';

                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:5px; background-color:white; "></div>';
                html += '                <div xcx="xcx2143236" id="divWelcomeButton" weightedheightvalue="150" class="leftButton ' + workflowAppTheme + '" style="display:none;background-color:darkkhaki;" ';
                html += 'onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForButton\', this, \'ABOUT\');"';
                html += '>';
                html += '                    <div class="leftButtonText">ABOUT</div>';
                html += '                </div>';
                html += '';
                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';


                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
                html += '                <div id="divVisualizationsButton" weightedheightvalue="40" class="leftButton_inactive ' + workflowAppTheme + '" style="display:none;background-color:darkkhaki;" ';
                //html += 'onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForButton\', this, \'TRACK_SPENDING\');"';
                html += '>';
                //html += '                    <div class="leftButtonText">TRACK SPENDING</div>';
                html += '                </div>';
                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';



                html += '                <div id="divSlidesButton" weightedheightvalue="150" class="leftButton ' + workflowAppTheme + '" style="display:none;background-color:darkgray;" ';
                //html += 'onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForButton\', this, \'CODE\');"';
                html += '>';
                //html += '                    <div class="leftButtonText">CODE</div>';
                html += '                </div>';

                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';


                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
                html += '                <div id="divVisualizationsButton" weightedheightvalue="40" class="leftButton_inactive ' + workflowAppTheme + '" style="display:none;background-color:darkkhaki;" ';
                //html += 'onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForButton\', this, \'TRACK_SPENDING\');"';
                html += '>';
                //html += '                    <div class="leftButtonText">TRACK SPENDING</div>';
                html += '                </div>';
                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';



                //html += '                <div id="divSlidesButton" weightedheightvalue="150" class="leftButton ' + workflowAppTheme + '" style="display:none;background-color:darkgray;" ';
                //html += 'onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForButton\', this, \'SLIDES\');"';
                //html += '>';
                //html += '                    <div class="leftButtonText">ISSUES</div>';
                //html += '                </div>';

                //html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';



                //html += '                <div id="divSlidesButton" weightedheightvalue="150" class="leftButton ' + workflowAppTheme + '" style="display:none;background-color:darkgray;" ';
                //html += 'onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForButton\', this, \'SLIDES\');"';
                //html += '>';
                //html += '                    <div class="leftButtonText">DISCUSSIONS</div>';
                //html += '                </div>';

                //html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';






                // Disabled 8-21-2023.
                //html += '                <div id="divContactButton" weightedheightvalue="150" class="leftButton ' + workflowAppTheme + '" style="display:none;background-color:khaki;" ';
                //html += '                   onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForButton\', this, \'DRONE_SERVICES\');"';
                //html += '                >';
                //html += '                    <div class="leftButtonText">AERIAL PHOTOGRAPHY</div>';
                //html += '                </div>';


                //html += '                <div id="divVisualizationsButton" weightedheightvalue="40" class="leftButton_inactive ' + workflowAppTheme + '" style="display:none;background-color:darkkhaki;" ';
                ////html += 'onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForButton\', this, \'TRACK_SPENDING\');"';
                //html += '>';
                ////html += '                    <div class="leftButtonText">TRACK SPENDING</div>';
                //html += '                </div>';



                // Disabled "WALKTHROUGH" button.
                //html += '                <div id="divWalkthroughButton" weightedheightvalue="40" class="leftButton_inactive ' + workflowAppTheme + '" style="display:none;background-color:khaki;" ';
                //html += '>';
                //html += '                </div>';

                // Enabled "WALKTHROUGH" button.
                //html += '                <div id="divWalkthroughButton" weightedheightvalue="40" class="leftButton ' + workflowAppTheme + '" style="display:none;background-color:khaki;" ';
                //html += 'onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForButton\', this, \'FEATURES\');"';
                //html += '>';
                //html += '                    <div class="leftButtonText">WALKTHROUGH *beta</div>';
                //html += '                </div>';







                //html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
                //html += '                <div id="divVisualizationsButton" weightedheightvalue="40" class="leftButton_inactive ' + workflowAppTheme + '" style="display:none;background-color:darkkhaki;" ';
                ////html += 'onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForButton\', this, \'TRACK_SPENDING\');"';
                //html += '>';
                ////html += '                    <div class="leftButtonText">TRACK SPENDING</div>';
                //html += '                </div>';
                //html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';



                //html += '                <div id="divContactButton" weightedheightvalue="150" class="leftButton ' + workflowAppTheme + '" style="display:none;background-color:khaki;" ';
                //html += '                   onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForButton\', this, \'CONTACT\');"';
                //html += '                >';
                //html += '                    <div class="leftButtonText">THIS SOFTWARE</div>';
                //html += '                </div>';



                //html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
                html += '                <div weightedheightvalue="40" class="leftButton_inactive ' + workflowAppTheme + '" style="background-color:plum;" ';
                //html += 'onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForButton\', this, \'USER\');"';
                html += '>';
                //html += '                    <div class="leftButtonText">USER: <span id="spanLoggedInUserWelcomePage" style="padding-right:1px;"></span></div>';
                html += '                </div>';
                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:5px; background-color:white; "></div>';



                html += '                <div id="divContactButton" weightedheightvalue="40" class="leftButton_inactive ' + workflowAppTheme + '" style="background-color:burlywood;" ';
                html += '>';
                //html += '                    <div class="leftButtonText">CONTACT</div>';
                html += '                </div>';



                html += '            </td>';

                html += '            <td colspan="4" style="vertical-align:top;">';
                html += '                <div id="divPageContent1" style="margin-left:25px;right:-15px;top:-15px;padding-left:0;padding-top:0;">';
                //html += '                    <div style="border:1px dotted tomato;color:goldenrod;">';
                //html += '                        divPageContent3';
                html += '                    <div>'; // 9-8-2023 I changed this so that the users won't see it any more. I was displaying it during development, and it was helpful.
                //html += '                        divPageContent3';
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

                html += '    <!-- Left inner menu -->';
                html += '    <table id="tableMainMenu2" style="display:none;width:100%;border-collapse: collapse;">';
                html += '        <tr>';
                html += '            <td style="width:1%;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                html += '                <div class="' + workflowAppTheme + '_noanimation noanimation" style="border-radius:20px 0 0 0;width: 225px; float:left; height:85px; background-color:gray; "></div>';
                html += '            </td>';
                html += '            <td style="width:0.1%;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                html += '                <div style="float:left;height:85px;width:26px;background-color:gray;margin-left:-2px;margin-right:-2px;">';
                html += '                    <div class="' + workflowAppTheme + '_noanimation noanimation" style="float:left;height:85px;width:26px;position:relative;background-color:gray;">';
                html += '                        <div id="divInnerRoundWithWhiteOverlay" style="position:absolute; bottom:0;float:left;width: 26px; height:36px; background-color:#f5f6fa; border-radius:26px 0 0 0;margin-left:1px;margin-bottom:-1px;"></div> <!-- The background-color is set to space white (#f5f6fa) here, for the "under the curve" color of this element. -->';
                html += '                    </div>';
                html += '                </div>';
                html += '            </td>';
                html += '            <td style="width:2%;vertical-align:top;padding:0 6px 0 6px;margin:0 0 0 0;border-width:0 0 0 0;">';
                html += '                <div id="divPageContent2_Title" style="font-size:45px;color:black;white-space:nowrap;margin-top:-3px;font-weight:bolder;">[divPageContent2_Title]</div>';
                html += '            </td>';
                html += '            <td style="width:95%;vertical-align:top;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                html += '                <div class="' + workflowAppTheme + '_noanimation noanimation" style="border-radius:0 26px 26px 0;width: 100%; float:left; height:50px; background-color:gray; ">xcx2132-2';
                html += '                </div>';
                html += '            </td>';
                html += '        </tr>';




                html += '        <tr>';
                html += '            <td id="tdInnerLeftSideMenu" style="vertical-align:top;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                html += '';
                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:5px; background-color:white; "></div>';
                html += '';


                html += '                <div id="divInnerLeftMenuTopSmallBar1" class="' + workflowAppTheme + '_noanimation noanimation" style="width: 100%; float:right; height:25px; background-color:#7788ff !important; color:white;font-family: \'Franklin Gothic Medium\', \'Arial Narrow\', Arial, sans-serif;display: flex !important;justify-content: flex-end !important;align-items: flex-end !important;">';
                //html += '🔊';
                html += '                </div>';


                html += '';
                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
                html += '                <div id="divInnerLeftMenuButton_PersonalBehavior" weightedheightvalue="40" class="leftButton ' + workflowAppTheme + '" onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForInnerLeftMenuButtons\', this, \'PERSONAL_BEHAVIOR\');">';
                html += '                    <div class="leftButtonText2">PERSONAL SETTINGS</div>';
                html += '                </div>';
                html += '';
                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
                html += '                <div class="leftButton ' + workflowAppTheme + '" weightedheightvalue="125" style="display:none;height:125px;" onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForInnerLeftMenuButtons\', this, \'ORGANIZATION\');">';
                html += '                    <div class="leftButtonText2">ORGANIZATION</div>';
                html += '                </div>';
                //html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
                //html += '                <div class="leftButton brushedAluminum" weightedheightvalue="40" style="display:none;" onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForInnerLeftMenuButtons\', this, \'SETTINGS\');">';
                //html += '                    <div class="leftButtonText2">SETTINGS</div>';
                //html += '                </div>';
                html += '';
                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
                html += '                <div class="leftButton ' + workflowAppTheme + '" weightedheightvalue="40" style="display:none;" onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForInnerLeftMenuButtons\', this, \'ROLES\');">';
                html += '                    <div class="leftButtonText2">ROLES</div>';
                html += '                </div>';
                html += '';
                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
                html += '                <div class="leftButton ' + workflowAppTheme + '" weightedheightvalue="40" style="display:none;" onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForInnerLeftMenuButtons\', this, \'PARTICIPANTS\');">';
                html += '                    <div class="leftButtonText2">PARTICIPANTS</div>';
                html += '                </div>';

                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
                html += '                <div class="leftButton ' + workflowAppTheme + '" weightedheightvalue="40" style="display:none;" onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForInnerLeftMenuButtons\', this, \'INVENTORY\');">';
                html += '                    <div class="leftButtonText2">INVENTORY</div>';
                html += '                </div>';

                html += '';
                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
                html += '                <div class="leftButton ' + workflowAppTheme + '" weightedheightvalue="125" style="display:none;height:125px;" onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForInnerLeftMenuButtons\', this, \'WORKFLOW_AND_EMAIL\');">';
                html += '                    <div class="leftButtonText2">WORKFLOWS</div>';
                html += '                </div>';

                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
                html += '                <div class="leftButton ' + workflowAppTheme + '" weightedheightvalue="40" style="display:none;" onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForInnerLeftMenuButtons\', this, \'FORMS\');">';
                html += '                    <div class="leftButtonText2">FORMS</div>';
                html += '                </div>';

                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
                html += '                <div class="leftButton ' + workflowAppTheme + '" weightedheightvalue="40" style="display:none;" onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForInnerLeftMenuButtons\', this, \'CHECKLISTS\');">';
                html += '                    <div class="leftButtonText2">CHECKLISTS</div>';
                html += '                </div>';


                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
                html += '                <div class="leftButton ' + workflowAppTheme + '" weightedheightvalue="80" style="display:none;" onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForInnerLeftMenuButtons\', this, \'SETTINGS\');">';
                html += '                    <div class="leftButtonText2">ORGANIZATION SETTINGS</div>';
                html += '                </div>';
                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
                html += '                <div class="leftButton ' + workflowAppTheme + '" weightedheightvalue="40" style="display:none;height:75px;" onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForInnerLeftMenuButtons\', this, \'MONITOR_PLUS_TOOLS\');">';
                html += '                    <div class="leftButtonText2">MONITORING & TOOLS</div>';
                html += '                </div>';



                html += '            </td>';
                html += '            <td colspan="3" style="vertical-align:top;">';
                html += '                <div id="divPageContent2" style="padding-left:10px;">';
                html += '';
                html += '                    <div id="divPageContent3" style="right:-10px;top:-10px;padding-left:20px;padding-top:15px;">';
                //html += '                        <div style="border:1px dotted tomato;color:goldenrod;">';
                //html += '                            divPageContent3';
                html += '                        <div>';
                //html += '                            divPageContent3';
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
                html += '';
                html += '                </div>';
                html += '            </td>';
                html += '        </tr>';
                html += '    </table>';



                $(this.element).html(html);


                //$('.bwActiveMenu_Main').bwActiveMenu_Main('RenderContentForButton', this, 'ABOUT');

                this.RenderContentForButton('ABOUT', 'ABOUT');

                //alert('In bwActiveMenu_Main.js.renderMenu(). xcx1231242 calling renderHomePageContent(). ****************** @@@@@@@@@@');

                //this.renderHomePageContent();



html = `    <span style="font-size:20pt;">Your self-hosted network software social & organization space, with file-sharing, email, calendaring, collaboration, and more.</span>
    <br />
    <br />
    



    <table id="tblHomePageAlertSectionForWorkflow0" style="cursor:default;">
    <tbody>
        <tr id="functionalAreaRow_0_1" class="bwFunctionalAreaRow bwNoUserSelect">
            <td style="width:11px;vertical-align:top;" class="bwNoUserSelect" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('expandOrCollapseAlertsSection', 'functionalAreaRow_0_6', 'alertSectionImage_0_6', 'alertSectionRow_0_6');"></td>
            <td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('expandOrCollapseAlertsSection', 'functionalAreaRow_0_6', 'alertSectionImage_0_6', 'alertSectionRow_0_6', 'PINNED_REQUESTS');">   <img title="expand" id="alertSectionImage_0_6" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;float:none;" src="drawer-open.png">           
                &nbsp;<input style="transform: scale(2);" type="checkbox">
                &nbsp;<span class="bwNoUserSelect bwAccordionDrawerTitle">Primary/Master           </span>       
            </td>   
        </tr>   
        <tr id="alertSectionRow_0_1" style="display:none;">       
            <td style="vertical-align:top;">       </td>       
            <td colspan="2">
                <table>
                <tbody>
                    <tr>
                        <td></td>
                        <td>
                            <div id="divBwExecutiveSummariesCarousel_PinnedRequests" class="bwAccordionDrawer" bwaccordiondrawertype="PINNED_REQUESTS" style="display: inline;">
                                TODD xcx23542436543
                            </div>
                        </td>
                    </tr>
                </tbody>
                </table>
            </td>
        </tr>   

        <tr id="functionalAreaRow_0_2" class="bwFunctionalAreaRow bwNoUserSelect">
            <td style="width:11px;vertical-align:top;" class="bwNoUserSelect" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('expandOrCollapseAlertsSection', 'functionalAreaRow_0_6', 'alertSectionImage_0_6', 'alertSectionRow_0_6');"></td>
            <td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('expandOrCollapseAlertsSection', 'functionalAreaRow_0_6', 'alertSectionImage_0_6', 'alertSectionRow_0_6', 'PINNED_REQUESTS');">   <img title="expand" id="alertSectionImage_0_6" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;float:none;" src="drawer-open.png">           
                &nbsp;<input style="transform: scale(2);" type="checkbox">
                &nbsp;<span class="bwNoUserSelect bwAccordionDrawerTitle">Website           </span>       
            </td>   
        </tr>   
        <tr id="alertSectionRow_0_2" style="display:none;">       
            <td style="vertical-align:top;">       </td>       
            <td colspan="2">
                <table>
                <tbody>
                    <tr>
                        <td></td>
                        <td>
                            <div id="divBwExecutiveSummariesCarousel_PinnedRequests" class="bwAccordionDrawer" bwaccordiondrawertype="WEBSITE" style="display: inline;">
                                TODD xcx23542436543
                            </div>
                        </td>
                    </tr>
                </tbody>
                </table>
            </td>
        </tr>   

        <tr id="functionalAreaRow_0_3" class="bwFunctionalAreaRow bwNoUserSelect">
            <td style="width:11px;vertical-align:top;" class="bwNoUserSelect" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('expandOrCollapseAlertsSection', 'functionalAreaRow_0_6', 'alertSectionImage_0_6', 'alertSectionRow_0_6');"></td>
            <td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('expandOrCollapseAlertsSection', 'functionalAreaRow_0_6', 'alertSectionImage_0_6', 'alertSectionRow_0_6', 'PINNED_REQUESTS');">   <img title="expand" id="alertSectionImage_0_6" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;float:none;" src="drawer-open.png">           
                &nbsp;<input style="transform: scale(2);" type="checkbox">
                &nbsp;<span class="bwNoUserSelect bwAccordionDrawerTitle">Web services           </span>       
            </td>   
        </tr>   
        <tr id="alertSectionRow_0_3" style="display:none;">       
            <td style="vertical-align:top;">       </td>       
            <td colspan="2">
                <table>
                <tbody>
                    <tr>
                        <td></td>
                        <td>
                            <div id="divBwExecutiveSummariesCarousel_PinnedRequests" class="bwAccordionDrawer" bwaccordiondrawertype="WEB_SERVICES" style="display: inline;">
                                TODD xcx23542436543
                            </div>
                        </td>
                    </tr>
                </tbody>
                </table>
            </td>
        </tr>   

        <tr id="functionalAreaRow_0_4" class="bwFunctionalAreaRow bwNoUserSelect">
            <td style="width:11px;vertical-align:top;" class="bwNoUserSelect" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('expandOrCollapseAlertsSection', 'functionalAreaRow_0_6', 'alertSectionImage_0_6', 'alertSectionRow_0_6');"></td>
            <td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('expandOrCollapseAlertsSection', 'functionalAreaRow_0_6', 'alertSectionImage_0_6', 'alertSectionRow_0_6', 'PINNED_REQUESTS');">   <img title="expand" id="alertSectionImage_0_6" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;float:none;" src="drawer-open.png">           
                &nbsp;<input style="transform: scale(2);" type="checkbox">
                &nbsp;<span class="bwNoUserSelect bwAccordionDrawerTitle">File services           </span>       
            </td>   
        </tr>   
        <tr id="alertSectionRow_0_4" style="display:none;">       
            <td style="vertical-align:top;">       </td>       
            <td colspan="2">
                <table>
                <tbody>
                    <tr>
                        <td></td>
                        <td>
                            <div id="divBwExecutiveSummariesCarousel_PinnedRequests" class="bwAccordionDrawer" bwaccordiondrawertype="FILE_SERVICES" style="display: inline;">
                                TODD xcx23542436543
                            </div>
                        </td>
                    </tr>
                </tbody>
                </table>
            </td>
        </tr>   

        <tr id="functionalAreaRow_0_5" class="bwFunctionalAreaRow bwNoUserSelect">
            <td style="width:11px;vertical-align:top;" class="bwNoUserSelect" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('expandOrCollapseAlertsSection', 'functionalAreaRow_0_6', 'alertSectionImage_0_6', 'alertSectionRow_0_6');"></td>
            <td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('expandOrCollapseAlertsSection', 'functionalAreaRow_0_6', 'alertSectionImage_0_6', 'alertSectionRow_0_6', 'PINNED_REQUESTS');">   <img title="expand" id="alertSectionImage_0_6" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;float:none;" src="drawer-open.png">           
                &nbsp;<input style="transform: scale(2);" type="checkbox">
                &nbsp;<span class="bwNoUserSelect bwAccordionDrawerTitle">Timer services           </span>       
            </td>   
        </tr>   
        <tr id="alertSectionRow_0_5" style="display:none;">       
            <td style="vertical-align:top;">       </td>       
            <td colspan="2">
                <table>
                <tbody>
                    <tr>
                        <td></td>
                        <td>
                            <div id="divBwExecutiveSummariesCarousel_PinnedRequests" class="bwAccordionDrawer" bwaccordiondrawertype="TIMER_SERVICES" style="display: inline;">
                                TODD xcx23542436543
                            </div>
                        </td>
                    </tr>
                </tbody>
                </table>
            </td>
        </tr>   

        <tr id="functionalAreaRow_0_6" class="bwFunctionalAreaRow bwNoUserSelect">
            <td style="width:11px;vertical-align:top;" class="bwNoUserSelect" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('expandOrCollapseAlertsSection', 'functionalAreaRow_0_6', 'alertSectionImage_0_6', 'alertSectionRow_0_6');"></td>
            <td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('expandOrCollapseAlertsSection', 'functionalAreaRow_0_6', 'alertSectionImage_0_6', 'alertSectionRow_0_6', 'PINNED_REQUESTS');">   <img title="expand" id="alertSectionImage_0_6" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;float:none;" src="drawer-open.png">           
                &nbsp;<input style="transform: scale(2);" type="checkbox">
                &nbsp;<span class="bwNoUserSelect bwAccordionDrawerTitle">Database           </span>       
            </td>   
        </tr>   
        <tr id="alertSectionRow_0_6" style="display:none;">       
            <td style="vertical-align:top;">       </td>       
            <td colspan="2">
                <table>
                <tbody>
                    <tr>
                        <td></td>
                        <td>
                            <div id="divBwExecutiveSummariesCarousel_PinnedRequests" class="bwAccordionDrawer" bwaccordiondrawertype="DATABASE" style="display: inline;">
                                TODD xcx23542436543
                            </div>
                        </td>
                    </tr>
                </tbody>
                </table>
            </td>
        </tr>   

    </tbody>
    </table>

 <br />
    <br />

<span style="font-size:18pt;">Users can connect to this instance at <a href="http://localhost:6060" target="_blank">http://localhost:6060</a>.<br /><span style="font-size:15pt;font-style:italic;">This is you local endpoint for serving with SSL through NGINX, for example. Varnish may add additional scalability.</span></span>
   
<br /><br />

<div id="divConsoleLogs">[divConsoleLogs]</div>

<br />
    <br /><br />
    <br /><br />
    <br /><br />
    <br />



    Webservices are RESPONDING
    <br />
    <br />
    Fileservices are RESPONDING
    <br />
    <br />
    Timer services are ACTIVE
    <br />
    <br />
    Database is CONNECTED
    <br />
    <br />
    You have a CPU capable of ?20? threads. Configure your thread allocation here...
    <br />
    <br />
    [SCALE - CONNECT TO ADDITIONAL SERVERS]
    <br />
    <br />
    You have x computers requesting to connect. Configure as the MASTER node for your SHareAndCollaborate.com node here... Your url: [yoururl] Connected computers:[connected computers]
    <br />
    <br />
    [INSTALL AND CONNECT TO MongoDB]
    <br />
    <br />
    <br />
    <br />
    [INSTALL CERTIFICATE FOR SSL]
    <br />
    <br />
    <br />
    <br />

    We are using Node.js <span id="node-version"></span>,
    Chromium <span id="chrome-version"></span>,
    and Electron <span id="electron-version"></span>.
`;


$('#divPageContent1').html(html);








            } else {

                var html = '';

                //html += '<script>';
                //html += '.loggedinuser_icon {';
                //html += '   background: url("/images/head_35x35_black.png") no-repeat;';
                //html += '}';
                //html += '.loggedinuser_icon:hover {';
                //html += '   background: url("/images/head_35x35_goldenrod.png") no-repeat;';
                //html += '}';
                //html += '</script>';

                //html += '<table id="tableMainMenu1" style="display:none;width:100%;border-collapse: collapse;">';
                html += '<table id="tableMainMenu1" style="display:none;width:100%;border-collapse: collapse;">'; // This is set not to display. style.display will be set to inline when the theme has been applied.
                html += '        <tr>';
                html += '            <td style="width:1%;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';




                //alert('xcx1111-5');
                html += '                <div xcx="xcx90987-2" id="divLeftMenuHeader" class="brushedAluminum_noanimation noanimation" style="border-radius:26px 0 0 0;width: ' + this.options.LeftMenuWidth + '; float:left; height:75px; background-color:darkgray; ">'; // Original 3-27-2022
                //
                // THE rest of hese are a good try, btu sticing with the original.... 3-27-2022 :)
                //
                //html += '                <div id="divLeftMenuHeader" class="brushedAluminum_noanimation noanimation" style="border-radius:52px 0 0 0;width: 250px; float:left; height:75px; background-color:darkgray; ">'; // closer
                //html += '                <div id="divLeftMenuHeader" class="brushedAluminum_noanimation noanimation" style="border-radius:100px 0 0 0;width: 250px; float:left; height:75px; background-color:darkgray; ">'; // even closer
                //html += '                <div id="divLeftMenuHeader" class="brushedAluminum_noanimation noanimation" style="border-radius:200px 0 0 0;width: 250px; float:left; height:75px; background-color:darkgray; ">';




                // Took out of developer mode 10-7-2023. 8-22pm adt.
                //if (developerModeEnabled == true) {
                // This is our AI Conversation speaker icon in the upper left of the screen.
                //html += '<span xcx="xcx23135" class="ai_conversation_icon" onclick="$(\'.bwSpeech\').bwSpeech(\'StopListening\');">🔊</span>';

                //html += '<br />';
                //html += '<br />';
                //html += '<span xcx="xcx23135" class="ai_conversation_icon" style="color:lightgray;font-size:50pt;" onclick="$(\'.bwSpeech\').bwSpeech(\'StopListening\');">🗣</span>';
                html += '<span xcx="xcx23135" class="ai_conversation_icon" onclick="$(\'.bwSpeech\').bwSpeech(\'StopListening\');">🗣</span>';
                //
                // TEXT ANIMATION. 11-6-2023. See: https://codepen.io/alvarotrigo/pen/PoKMyNO
                //

var developerModeEnabled = false;

                if (developerModeEnabled == true) {

                    html += '<span xcx="xcx23135-2" class="ai_conversation_icon" style="padding-left:150px;font-size:35pt;color:orange;cursor:pointer;font-weight:bold;" onclick="displayAlertDialog(\'expand all our stuff...\');">↸</span>';

                }

                //}









                // The following is where you can change the diameter of the left top organization logo circle.
                //html += '                    <img id="orgImage_root_blueheaderbar" style="z-index:5999;border:7px solid #066B8B;border-radius:50%;width:175px;height:175px;vertical-align:-1.9em;background-color:#066B8B;position:absolute;cursor:pointer !important;" src="images/corporeal.png" title="[xcxBwWorkflowAppId]" /><!---.75em too high. 40 x 40 is good, 53x53 is 1/3 larger...-->';
                html += '                    <img xcx="xcx324327777" id="orgImage_root_blueheaderbar" style="z-index:5999;border:7px solid #066B8B;border-radius:50%;width:215px;height:215px;vertical-align:-1.9em;background-color:#066B8B;position:absolute;cursor:pointer !important;" src="images/corporeal.png" title="[xcxBwWorkflowAppId]" /><!---.75em too high. 40 x 40 is good, 53x53 is 1/3 larger...-->';


                html += '';
                html += '                </div>';
                html += '            </td>';
                html += '            <td style="width:0.1%;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                html += '                <div style="float:left;height:75px;width:26px;background-color:#cc88ff;margin-left:-2px;margin-right:-3px;">';
                html += '                    <div class="brushedAluminum_noanimation noanimation" style="float:left;height:75px;width:26px;position:relative;background-color:darkgray;">';
                html += '                        <div style="position:absolute; bottom:0;float:left;width: 26px; height:26px; background-color:#f5f6fa; border-radius:26px 0 0 0;margin-left:1px;margin-bottom:-1px;"></div> <!-- The background-color is set to space white (#f5f6fa) here, for the "under the curve" color of this element. -->';
                html += '                    </div>';
                html += '                </div>';
                html += '            </td>';
                html += '            <td style="width:100%;vertical-align:top;padding:0 0 0 0;margin:0 0 0 -2px;border-width:0 0 0 0;">';

                // head.png
                html += '               <div id="divTopBar_Long" xcx="xcx1234-2" class="brushedAluminum_noanimation noanimation" style="width: 100%; float:left; height:50px; ">';




                html += '                   <div id="divTopBar_Long_Error" xcx="xcx99348768" class="brushedAluminum_noanimation noanimation" style="font-size:25pt;cursor:pointer;float:left;" >';
                //html += '[divTopBar_Long_Error]';
                html += '                   </div>';






                //var smallHeadPath = '/_files/' + workflowAppId + '/participantimages/' + participantId + '/' + 'userimage_50x50px.png';


                html += '                   <div class="brushedAluminum_noanimation noanimation" style="background-color:white;font-size:25pt;color:goldenrod;cursor:pointer;float:right;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayLoggedInUserDropDownInACircle\', true);">';
                html += '                       <img id="topbar_usersettings_icon" title="" alt="" src="/images/head_35x35_black.png" xcx="xcx123234-2" class="noanimation brushedAluminum_noanimation" style="width:35px;height:35px;padding-top:8px;padding-right:10px;cursor:pointer;"  ';
                //html += '                       <img id="topbar_usersettings_icon" title="" alt="" src="' + smallHeadPath + '" xcx="xcx123234-2" class="noanimation brushedAluminum_noanimation" style="width:35px;height:35px;padding-top:8px;padding-right:10px;cursor:pointer;"  ';

                html += '                       onmouseover="this.src=\'/images/head_35x35_goldenrod.png\';" onmouseout="this.src=\'' + '/images/head_35x35_black.png' + '\';" ';

                //html += '                       onmouseover="this.src=\'/images/head_35x35_goldenrod.png\';"'; // This is just some visual feedback to the user.

                //html += '                       onmouseover="this.src=\'/images/head_35x35_goldenrod.png\';" onmouseout="this.src=\'' + smallHeadPath + '\';" ';
                html += ' />';
                html += '                   </div>';



                html += '                   <div class="brushedAluminum_noanimation noanimation" style="padding-top:5px;background-color:white;font-size:25pt;color:goldenrod;cursor:pointer;float:right;" onclick="$(\'.bwNotificationSound\').bwNotificationSound(\'slideOutAndDisplayNotificationsPanel\');">';
                //html += $('.bwNotificationSound').bwNotificationSound('renderTopBarSpeechBubble');
                html += '                   </div>';



                if (developerModeEnabled == true) {

                    html += '                   <div class="brushedAluminum_noanimation noanimation" style="padding-top:5px;background-color:white;font-size:25pt;color:goldenrod;cursor:pointer;float:right;" onclick="$(\'.bwNotificationSound\').bwNotificationSound(\'slideOutAndDisplayNotificationsPanel_Email\');">';
                    html += $('.bwNotificationSound').bwNotificationSound('renderTopBarEmail');
                    html += '                   </div>';

                    html += '                   <div class="brushedAluminum_noanimation noanimation" style="padding-top:5px;background-color:white;font-size:25pt;color:goldenrod;cursor:pointer;float:right;" onclick="$(\'.bwNotificationSound\').bwNotificationSound(\'slideOutAndDisplayNotificationsPanel_Telephone\');">';
                    html += $('.bwNotificationSound').bwNotificationSound('renderTopBarTelephone');
                    html += '                   </div>';

                }




                //// 🔊
                //html += '                   <div class="brushedAluminum_noanimation noanimation" style="padding-top:5px;background-color:white;font-size:25pt;color:goldenrod;cursor:pointer;float:right;" onclick="$(\'.bwNotificationSound\').bwNotificationSound(\'displayAIConversation\');">';
                ////html += '                       <img src="/images/notificationicon.png" xcx="xcx123234-2-2" class="noanimation brushedAluminum_noanimation" style="width:35px;height:35px;padding-top:8px;padding-right:10px;cursor:pointer;" />';
                ////html += $('.bwNotificationSound').bwNotificationSound('renderTopBarSpeechBubble');
                //html += '🔊';
                //html += '                   </div>';



                html += '               </div>';

                html += '            </td>';
                html += '            <td style="width:2%;vertical-align:top;padding:0 6px 0 6px;margin:0 0 0 0;border-width:0 0 0 0;">';



                // ORIGINAL
                //html += '                <div xcx="xcx21312-2" id="divTopBar_OrganizationName" style="font-size:49px;color:goldenrod;white-space:nowrap;margin-top:-5px;font-weight:bold;">[divTopBar_OrganizationName]</div>';


                //
                //
                // We are moving the drop down selector to here. 12-16-2023.
                //
                //

                //html += '                <div xcx="xcx21312-2" id="divTopBar_OrganizationName" style="font-size:49px;color:goldenrod;white-space:nowrap;margin-top:-5px;font-weight:bold;">[divTopBar_OrganizationName]</div>';

                // FIRST TRY
                //html += '                <div xcx="xcx21312-2" id="divTopBar_OrganizationName2" style="font-size:49px;color:goldenrod;white-space:nowrap;margin-top:-5px;font-weight:bold;">';
                //html += `<select id="selectHomePageWorkflowAppDropDown" onchange="$('.bwAuthentication').bwAuthentication('selectHomePageWorkflowAppDropDown_change');" class="selectHomePageWorkflowAppDropDown2" style=""><option value="6e650ae7-81d0-48ab-86d1-1183d3126a18|configurationmanager" style="color:red;">Huntley's Diving and Marine</option ><option value="96c0ae06-0f6c-4166-bf6d-aa5e57a44ba5|configurationmanager" style="color:red;">Ray Man Enterprises</option><option value="c48535a4-9a6b-4b95-9d67-c6569e9695d8|owner" selected="">TODD HILTZ ENTERPRISES</option><option value="cb2594c3-ea41-4efe-83aa-6b52ee24f6d4|participant" style="color:red;">toddtestoct20 hiltz Enterprises</option></select>`;
                //html += '</div>';

                // SECOND TRY - Creating our own drop down instead of using a select element.
                //html += `<input id="txtOrganizationPickerFilter" type="text" class="selectHomePageWorkflowAppDropDown" style="width:750px;border-color: whitesmoke; color: grey;font-size: 1em; font-weight: bold; cursor: pointer; font-family: 'Segoe UI Light','Segoe UI','Segoe',Tahoma,Helvetica,Arial,sans-serif;" onkeyup="$('#divPageContent1').find('.bwOrganizationPicker').bwOrganizationPicker('txtOrganizationPickerFilter_OnKeyup', 'txtOrganizationPickerFilter');" onmouseup="$('#divPageContent1').find('.bwOrganizationPicker').bwOrganizationPicker('txtOrganizationPickerFilter_OnMouseup', 'txtOrganizationPickerFilter');">`;

                //html += `<input value="TODD HILTZ ENTERPRISES" id="txtOrganizationPickerFilter" type="text" class="selectHomePageWorkflowAppDropDown2" onkeyup="$('#divPageContent1').find('.bwOrganizationPicker').bwOrganizationPicker('txtOrganizationPickerFilter_OnKeyup', 'txtOrganizationPickerFilter');" onmouseup="$('#divPageContent1').find('.bwOrganizationPicker').bwOrganizationPicker('txtOrganizationPickerFilter_OnMouseup', 'txtOrganizationPickerFilter');">`;





                //html += `<input value="TODD HILTZ ENTERPRISES" id="txtOrganizationPickerFilter" type="text" class="selectHomePageWorkflowAppDropDown2" onkeyup="$('.bwActiveMenu_Main').bwActiveMenu_Main('txtOrganizationPickerFilter_OnKeyup', 'txtOrganizationPickerFilter');" onmouseup="$('.bwActiveMenu_Main').bwActiveMenu_Main('txtOrganizationPickerFilter_OnMouseup', 'txtOrganizationPickerFilter');">`;
                //html += '           <div id="divLocationPickerDropDown" style="display:none;background-color:white;overflow-x:hidden;cursor:pointer;"></div>'; // Scrollable div wrapper for the treeview. Position and z-index makes it show up on top and to not move the other elements around.


                // FINAL VERSION?

                html += '<style>';
                html += '.OrgPickerDropdown_Item {';
                html += '   cursor:pointer;';
                html += '   color:tomato;';
                html += '   font-size:49px;';
                html += '   border: 2px solid aliceblue;';
                html += '}';
                html += '.OrgPickerDropdown_Item:hover {';
                html += '   border: 2px solid red;';
                html += '}';
                html += '</style>';

                //html += `<input value="[txtOrganizationPickerDropdown]" id="txtOrganizationPickerDropdown" type="text" class="selectHomePageWorkflowAppDropDown2" onkeyup="$('.bwActiveMenu_Main').bwActiveMenu_Main('txtOrganizationPickerDropdown_OnKeyup', 'txtOrganizationPickerDropdown');" onmouseup="$('.bwActiveMenu_Main').bwActiveMenu_Main('txtOrganizationPickerDropdown_OnMouseup', 'txtOrganizationPickerDropdown');">`;
                //html += '           <div id="divOrganizationPickerDropDown" style="display:none;background-color:white;overflow-x:hidden;cursor:pointer;"></div>'; // Scrollable div wrapper for the treeview. Position and z-index makes it show up on top and to not move the other elements around.


                // style="border: 0px solid whitesmoke;background-color: #f5f6fa !important;cursor: pointer;font-size: 49px;color: goldenrod;white-space: nowrap;margin-top: -5px;font-weight: bold !important;font-family: Verdana, Geneva, Tahoma, sans-serif;"
                html += `<span value="[divTopBar_OrganizationName]" id="divTopBar_OrganizationName" class="selectHomePageWorkflowAppDropDown2" onkeyup="$('.bwActiveMenu_Main').bwActiveMenu_Main('txtOrganizationPickerDropdown_OnKeyup', 'txtOrganizationPickerDropdown');" onmouseup="$('.bwActiveMenu_Main').bwActiveMenu_Main('txtOrganizationPickerDropdown_OnMouseup', 'txtOrganizationPickerDropdown');" style="border: 0px solid whitesmoke;background-color: #f5f6fa !important;cursor: pointer;font-size: 49px;color: goldenrod;white-space: nowrap;margin-top: -5px;font-weight: bold !important;font-family: Verdana, Geneva, Tahoma, sans-serif;">[divTopBar_OrganizationName]</span>`;
                html += '           <div id="divOrganizationPickerDropDown" style="display:none;background-color:white;overflow-x:hidden;cursor:pointer;"></div>'; // Scrollable div wrapper for the treeview. Position and z-index makes it show up on top and to not move the other elements around.























                html += '            </td>';

                if (developerModeEnabled == true) {
                    html += '            <td style="width:1%;vertical-align:top;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                    html += '               <div xcx="xcx213478-1" class="brushedAluminum_noanimation noanimation" style="border-radius:0 26px 26px 0;width: 60px; float:left; height:49px; background-color:darkgray; ">'; // 30px width is the original value. Set it to 60px to accomodate the expand dialogs unicode character.
                    html += '                   <span style="font-size:35pt;color:orange;cursor:pointer;font-weight:bold;padding:0 10px 0 10px" onclick="alert(\'This will expand all windows to popped-out windows. Then this icon will be the pull-back icon, to bring them all back. This works best with multiple monitors.\');">↸</span>';
                    html += '               </div>';
                    html += '            </td>';
                } else {
                    html += '            <td style="width:25px;vertical-align:top;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';


                    //html += '               <div xcx="xcx213478-2" class="brushedAluminum_noanimation noanimation" style="cursor:pointer;border-radius:0 26px 26px 0;width: 30px; float:left; height:49px; background-color:darkgray;" onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'slideOutAndDisplayNotificationsPanel\');" >'; // 30px width is the original value. Set it to 60px to accomodate the expand dialogs unicode character.
                    html += '               <div xcx="xcx213478-2" class="brushedAluminum_noanimation noanimation" style="cursor:pointer;border-radius:0 26px 26px 0;width: 30px; float:left; height:49px; background-color:darkgray;" onclick="$(\'.bwNotificationSound\').bwNotificationSound(\'slideOutAndDisplayNotificationsPanel\');" >'; // 30px width is the original value. Set it to 60px to accomodate the expand dialogs unicode character.




                    html += '                   <div xcx="xcx2132-3" class="brushedAluminum_noanimation noanimation" style="border-radius:0 26px 26px 0; float:left; height:49px; background-color:darkgray; "><div style="display:inline-block;font-size:25pt;width:100%;cursor:pointer;text-align:right;">';


                    // 

                    //html += '                   <div xcx="xcx2132-3" class="brushedAluminum_noanimation noanimation" style="border-radius:0 26px 26px 0; float:left; height:49px; background-color:darkgray; "><div style="display:inline-block;font-size:25pt;width:100%;cursor:pointer;text-align:right;">';
                    //html += '<img style="width:50px;height:50px;" src="images/power button.png" />';



                    html += '                   </div>';
                    html += '               </div>';
                    html += '               </div>';
                    html += '            </td>';
                }

                html += '        </tr>';
                html += '        <tr>';
                //alert('xcx1111-6');
                html += '            <td id="tdLeftSideMenu" style="width: ' + this.options.LeftMenuWidth + ';vertical-align:top;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                html += '';
                html += '                <div weightedheightvalue="40" class="brushedAluminum_noanimation noanimation" style="">';
                html += '                    <div class="leftButtonText">';
                html += '                        <span id="spanErrorLink" style="display:none;font-size:x-large;color:yellow;font-family:Chunkfive, Georgia, Palatino, Times New Roman, serif;font-weight:bold;cursor:pointer;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;" onclick="cmdDisplayCommunicationsError();">Error!&nbsp;&nbsp;&nbsp;&nbsp;</span>';
                html += '                    </div>';
                html += '                </div>';
                html += '';
                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:5px; background-color:white; "></div>';
                html += '';
                html += '                <div id="divLeftMenuTopSmallBar1" class="brushedAluminum_noanimation noanimation" style="width: 100%; float:right; height:25px; background-color:#7788ff !important; color:white;font-family: \'Franklin Gothic Medium\', \'Arial Narrow\', Arial, sans-serif;display: flex !important;justify-content: flex-end !important;align-items: flex-end !important;"></div>';
                html += '';
                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:5px; background-color:white; "></div>';
                html += '';


                if (developerModeEnabled == true) {
                    html += '                <div weightedheightvalue="40" class="leftButton brushedAluminum" style="" onclick="cmdDisplayToDoList();">';
                    html += '                    <div class="leftButtonText">';
                    html += '                        tips';
                    html += '                    </div>';
                    html += '                </div>';
                } else {
                    html += '                <div weightedheightvalue="40" class="leftButton brushedAluminum" style="" >';
                    html += '                    <div class="leftButtonText">';
                    //html += '                        tips';
                    html += '                    </div>';
                    html += '                </div>';
                }

                html += '';
                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:5px; background-color:white; "></div>';
                html += '                <div xcx="xcx234788" id="divWelcomeButton" weightedheightvalue="150" class="leftButton brushedAluminum" style="display:none;background-color:darkkhaki;" onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForButton\', this, \'HOME\');">';
                html += '                    <div class="leftButtonText">HOMExcx1-2</div>';
                html += '                </div>';
                html += '';
                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
                html += '                <div id="divNewRequestButton" weightedheightvalue="150" class="leftButton brushedAluminum" style="display:none;background-color:khaki;" onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForButton\', this, \'NEW_REQUEST\');">';
                html += '                    <div class="leftButtonText">NEW REQUEST</div>';
                html += '                </div>';
                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
                html += '                <div id="divArchiveButton" weightedheightvalue="125" class="leftButton brushedAluminum" style="display:none;background-color:darkgray;" onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForButton\', this, \'ALL_REQUESTS\');">';
                html += '                    <div class="leftButtonText">ALL REQUESTS</div>';
                html += '                </div>';
                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
                html += '                <div id="divVisualizationsButton" weightedheightvalue="75" class="leftButton brushedAluminum" style="display:none;background-color:darkkhaki;" onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForButton\', this, \'TRACK_SPENDING\');">';
                html += '                    <div class="leftButtonText">TRACK</div>';
                html += '                </div>';

                //html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
                //html += '                <div id="divVisualizationsButton" weightedheightvalue="150" class="leftButton brushedAluminum" style="display:none;background-color:darkkhaki;" onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForButton\', this, \'MESSAGING\');">';
                ////html += '                    <img src="https://shareandcollaborate.com/images/red-dot.png" width="11" height="11" alt="" style="cursor:pointer;position:relative;top:-80%;left:30%;">';
                ////html += '                    <img src="https://shareandcollaborate.com/images/red-dot.png" width="11" height="11" alt="" style="cursor:pointer;position:relative;top:-82%;left:-50%;">';
                //html += '                    <img src="https://shareandcollaborate.com/images/red-dot.png" width="11" height="11" alt="" style="cursor:pointer;position:relative;bottom:15px;left:-10px;">';
                //html += '                    <div class="leftButtonText">MESSAGING</div>';
                //html += '                </div>';

                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
                html += '                <div id="divVisualizationsButton" weightedheightvalue="150" class="leftButton brushedAluminum" style="display:none;background-color:darkkhaki;" onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForButton\', this, \'MESSAGING2\');">';
                //html += '                    <img src="https://shareandcollaborate.com/images/red-dot.png" width="11" height="11" alt="" style="cursor:pointer;position:relative;top:-80%;left:30%;">';
                //html += '                    <img src="https://shareandcollaborate.com/images/red-dot.png" width="11" height="11" alt="" style="cursor:pointer;position:relative;top:-82%;left:-50%;">';
                html += '                    <img src="images/red-dot.png" width="11" height="11" alt="" style="cursor:pointer;position:relative;bottom:15px;left:-10px;">';
                html += '                    <div class="leftButtonText">MESSAGING</div>';
                html += '                </div>';

                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
                html += '                <div id="divConfigurationButton" weightedheightvalue="100" class="leftButton brushedAluminum" style="display:none;background-color:khaki;" onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForButton\', this, \'CONFIGURATION\');">';
                html += '                    <div class="leftButtonText">CONFIGURATION</div>';
                html += '                </div>';

                if (developerModeEnabled == true) {
                    // EMAIL_CLIENT_BUTTON. added 2-3-2023
                    html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:5px; background-color:white; "></div>';
                    html += '                <div weightedheightvalue="40" class="leftButton brushedAluminum" style="background-color:burlywood;" onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForButton\', this, \'EMAIL_CLIENT_BUTTON\');">';
                    html += '                    <div class="leftButtonText">EMAIL CLIENT</div>';
                    html += '                </div>';
                }

                if (developerModeEnabled == true) {
                    html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
                    html += '                <div weightedheightvalue="40" class="leftButton brushedAluminum" style="background-color:plum;" onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForButton\', this, \'USER\');">';
                    html += '                    <div class="leftButtonText">USER: <span id="spanLoggedInUserWelcomePage" style="padding-right:1px;"></span></div>';
                    html += '                </div>';
                }

                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:5px; background-color:white; "></div>';
                html += '                <div weightedheightvalue="40" class="leftButton brushedAluminum" style="background-color:burlywood;" onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForButton\', this, \'REPORT_AN_ERROR\');">';
                html += '                    <div class="leftButtonText">REPORT AN ERROR</div>';
                html += '                </div>';

                // START_BUTTON. added 2-3-2023
                //html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:5px; background-color:white; "></div>';
                //html += '                <div weightedheightvalue="40" class="leftButton brushedAluminum" style="background-color:burlywood;" onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForButton\', this, \'START_BUTTON\');">';
                //html += '                    <img xcx="xcx987089" style="width:50px;height:50px;" src="images/power button.png" />';
                //html += '                    <div class="leftButtonText">START BUTTON</div>';
                //html += '                </div>';





                if (developerModeEnabled == true) {
                    html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:5px; background-color:white; "></div>';
                    html += '                <div weightedheightvalue="75" class="leftButton brushedAluminum" style="background-color:burlywood;" onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForButton\', this, \'REPORT_AN_ERROR\');">';
                    html += '                    <div class="leftButtonText">VIDEO ASSISTANT</div>';
                    html += '                </div>';


                    html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:5px; background-color:white; "></div>';
                    html += '                <div weightedheightvalue="75" class="leftButton brushedAluminum" style="background-color:thistle;" onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForButton\', this, \'PRINT\');">';
                    html += '                    <div class="leftButtonText">PRINT</div>';
                    html += '                </div>';
                    html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:5px; background-color:white; "></div>';
                    html += '                <div weightedheightvalue="40" class="leftButton brushedAluminum" style="" onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForButton\', this, \'VIEW_MOBILE_VERSION\');">';
                    html += '                    <div class="leftButtonText">VIEW MOBILE VERSION</div>';
                    html += '                </div>';
                    html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:5px; background-color:white; "></div>';
                    html += '                <div weightedheightvalue="40" class="leftButton brushedAluminum" onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForButton\', this, \'TILE_AND_BALLOON_WINDOWS\');">';
                    html += '                    <div class="leftButtonText">TILE AND BALLOON WINDOWS</div>';
                    html += '                </div>';
                    html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:5px; background-color:white; "></div>';
                    html += '                <div weightedheightvalue="40" class="leftButton brushedAluminum" style="" onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForButton\', this, \'FOREST_ADMIN\');">';
                    html += '                    <div class="leftButtonText">FOREST ADMIN</div>';
                    html += '                </div>';
                    html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:5px; background-color:white; "></div>';
                    html += '                <div weightedheightvalue="40" class="leftButton brushedAluminum" style="" onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForButton\', this, \'LIVE_STATUS\');">';
                    html += '                    <div class="leftButtonText">LIVE STATUS</div>';
                    html += '                </div>';
                    html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:20px; background-color:white; "></div>';
                    html += '                <div weightedheightvalue="40" class="leftButton brushedAluminum" style="" onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForButton\', this, \'DONATE\');">';
                    html += '                    <div class="leftButtonText">DONATE</div>';
                    html += '                </div>';
                }

                html += '';
                html += '            </td>';
                html += '            <td colspan="4" style="vertical-align:top;">';
                html += '                <div id="divPageContent1" style="margin-left:25px;right:-15px;top:-15px;padding-left:0;padding-top:0;">';
                html += '                    <div style="border:1px dotted tomato;color:goldenrod;">';
                html += '                        divPageContent3';
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
                //html += '';
                //html += '    <!-- Left inner menu -->';
                //html += '    <table id="tableMainMenu2" style="display:none;width:100%;border-collapse: collapse;">';
                //html += '        <tr>';
                //html += '            <td style="width:1%;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                //html += '                <div class="brushedAluminum_noanimation noanimation" style="border-radius:20px 0 0 0;width: 225px; float:left; height:85px; background-color:gray; "></div>';
                //html += '            </td>';
                //html += '            <td style="width:0.1%;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                //html += '                <div style="float:left;height:85px;width:26px;background-color:gray;margin-left:-2px;margin-right:-2px;">';
                //html += '                    <div class="brushedAluminum_noanimation noanimation" style="float:left;height:85px;width:26px;position:relative;background-color:gray;">';
                //html += '                        <div id="divInnerRoundWithWhiteOverlay" style="position:absolute; bottom:0;float:left;width: 26px; height:36px; background-color:#f5f6fa; border-radius:26px 0 0 0;margin-left:1px;margin-bottom:-1px;"></div> <!-- The background-color is set to space white (#f5f6fa) here, for the "under the curve" color of this element. -->';
                //html += '                    </div>';
                //html += '                </div>';
                //html += '            </td>';
                //html += '            <td style="width:2%;vertical-align:top;padding:0 6px 0 6px;margin:0 0 0 0;border-width:0 0 0 0;">';
                //html += '                <div id="divPageContent2_Title" style="font-size:45px;color:black;white-space:nowrap;margin-top:-3px;font-weight:bolder;">[divPageContent2_Title]</div>';
                //html += '            </td>';
                //html += '            <td style="width:95%;vertical-align:top;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                //html += '                <div xcx="xcx2132-4" class="brushedAluminum_noanimation noanimation" style="border-radius:0 26px 26px 0;width: 100%; float:left; height:50px; background-color:gray; ">';
                //html += '                </div>';
                //html += '            </td>';
                //html += '        </tr>';
                //html += '        <tr>';
                //html += '            <td id="tdInnerLeftSideMenu" style="vertical-align:top;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                //html += '';
                //html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:5px; background-color:white; "></div>';
                //html += '';
                //html += '                <div id="divInnerLeftMenuTopSmallBar1" class="brushedAluminum_noanimation noanimation" style="width: 100%; float:right; height:25px; background-color:#7788ff !important; color:white;font-family: \'Franklin Gothic Medium\', \'Arial Narrow\', Arial, sans-serif;display: flex !important;justify-content: flex-end !important;align-items: flex-end !important;"></div>';
                //html += '';
                //html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
                //html += '                <div id="divInnerLeftMenuButton_PersonalBehavior" weightedheightvalue="40" class="leftButton brushedAluminum" onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForInnerLeftMenuButtons\', this, \'PERSONAL_BEHAVIOR\');">';
                //html += '                    <div class="leftButtonText2">PERSONAL SETTINGS</div>';
                //html += '                </div>';
                //html += '';
                //html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
                //html += '                <div class="leftButton brushedAluminum" weightedheightvalue="125" style="display:none;height:125px;" onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForInnerLeftMenuButtons\', this, \'ORGANIZATION\');">';
                //html += '                    <div class="leftButtonText2">ORGANIZATION</div>';
                //html += '                </div>';
                ////html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
                ////html += '                <div class="leftButton brushedAluminum" weightedheightvalue="40" style="display:none;" onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForInnerLeftMenuButtons\', this, \'SETTINGS\');">';
                ////html += '                    <div class="leftButtonText2">SETTINGS</div>';
                ////html += '                </div>';
                //html += '';
                //html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
                //html += '                <div class="leftButton brushedAluminum" weightedheightvalue="40" style="display:none;" onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForInnerLeftMenuButtons\', this, \'ROLES\');">';
                //html += '                    <div class="leftButtonText2">ROLES</div>';
                //html += '                </div>';
                //html += '';
                //html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
                //html += '                <div class="leftButton brushedAluminum" weightedheightvalue="40" style="display:none;" onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForInnerLeftMenuButtons\', this, \'PARTICIPANTS\');">';
                //html += '                    <div class="leftButtonText2">PARTICIPANTS</div>';
                //html += '                </div>';

                //html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
                //html += '                <div class="leftButton brushedAluminum" weightedheightvalue="40" style="display:none;" onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForInnerLeftMenuButtons\', this, \'INVENTORY\');">';
                //html += '                    <div class="leftButtonText2">INVENTORY</div>';
                //html += '                </div>';

                //html += '';
                //html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
                //html += '                <div class="leftButton brushedAluminum" weightedheightvalue="125" style="display:none;height:125px;" onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForInnerLeftMenuButtons\', this, \'WORKFLOW_AND_EMAIL\');">';
                //html += '                    <div class="leftButtonText2">WORKFLOWS</div>';
                //html += '                </div>';

                //html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
                //html += '                <div class="leftButton brushedAluminum" weightedheightvalue="40" style="display:none;" onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForInnerLeftMenuButtons\', this, \'FORMS\');">';
                //html += '                    <div class="leftButtonText2">FORMS</div>';
                //html += '                </div>';

                //html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
                //html += '                <div class="leftButton brushedAluminum" weightedheightvalue="40" style="display:none;" onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForInnerLeftMenuButtons\', this, \'CHECKLISTS\');">';
                //html += '                    <div class="leftButtonText2">CHECKLISTS</div>';
                //html += '                </div>';

                //if (developerModeEnabled == true) {
                //    html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
                //    html += '                <div class="leftButton brushedAluminum" weightedheightvalue="40" style="display:none;" onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForInnerLeftMenuButtons\', this, \'FINANCIALAREAS\');">';
                //    html += '                    <div class="leftButtonText2">FINANCIAL AREAS</div>';
                //    html += '                </div>';
                //}

                //html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
                //html += '                <div class="leftButton brushedAluminum" weightedheightvalue="80" style="display:none;" onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForInnerLeftMenuButtons\', this, \'SETTINGS\');">';
                //html += '                    <div class="leftButtonText2">ORGANIZATION SETTINGS</div>';
                //html += '                </div>';
                //html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
                //html += '                <div class="leftButton brushedAluminum" weightedheightvalue="40" style="display:none;height:75px;" onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForInnerLeftMenuButtons\', this, \'MONITOR_PLUS_TOOLS\');">';
                //html += '                    <div class="leftButtonText2">MONITORING & TOOLS</div>';
                //html += '                </div>';


                //if (developerModeEnabled == true) {
                //    html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
                //    html += '                <div class="leftButton brushedAluminum" weightedheightvalue="40" style="display:none;" onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForInnerLeftMenuButtons\', this, \'INVENTORY\');">';
                //    html += '                    <div class="leftButtonText2">INVENTORY</div>';
                //    html += '                </div>';
                //    html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
                //    html += '                <div class="leftButton brushedAluminum" weightedheightvalue="40" style="display:none;height:125px;" onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForInnerLeftMenuButtons\', this, \'FUNCTIONAL_AREAS\');">';
                //    html += '                    <div class="leftButtonText2">FUNCTIONAL AREAS</div>';
                //    html += '                </div>';
                //}

                //html += '            </td>';
                //html += '            <td colspan="3" style="vertical-align:top;">';
                //html += '                <div id="divPageContent2" style="padding-left:10px;">';
                //html += '';
                ////html += '                    <div id="divPageContent3" style="right:-10px;top:-10px;padding-left:20px;padding-top:15px;">';
                ////html += '                        <div style="border:1px dotted tomato;color:goldenrod;">';
                ////html += '                            divPageContent3';
                //html += '                    <div id="divPageContent3" style="right:-10px;top:-10px;padding-left:20px;padding-top:15px;">';
                //html += '                        <div>';
                //html += '                            <br />';
                //html += '                            <br />';
                //html += '                            <br />';
                //html += '                            <br />';
                //html += '                            <br />';
                //html += '                            <br />';
                //html += '                            <br />';
                //html += '                            <br />';
                //html += '                        </div>';
                //html += '                    </div>';
                //html += '';
                //html += '                </div>';
                //html += '            </td>';
                //html += '        </tr>';
                //html += '    </table>';

                $(this.element).html(html);

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
                                        console.log('In bwActiveMenu_Main.js.xx.lookForImage.mouseout():1.');
                                        this.src = imagePath; // Mouseout replaces the image with the actual one.
                                    });

                                } catch (e) {

                                    console.log('Exception in bwActiveMenu_Main.js.xx.lookForImage.img.onload(): ' + e.message + ', ' + e.stack);

                                    $(imageElement).attr('src', '/images/head_35x35_black.png');

                                    $(imageElement).off('mouseout').mouseout(function (error) {
                                        console.log('In bwActiveMenu_Main.js.xx.lookForImage.mouseout():2.');
                                        this.src = '/images/head_35x35_black.png'; // Mouseout replaces the image with the actual one.
                                    });

                                    reject();
                                }
                            }
                        }).fail(function () {

                            $(imageElement).attr('src', '/images/head_35x35_black.png');

                            $(imageElement).off('mouseout').mouseout(function (error) {
                                console.log('In bwActiveMenu_Main.js.xx.lookForImage.mouseout():3.');
                                this.src = '/images/head_35x35_black.png'; // Mouseout replaces the image with the actual one.
                            });

                            resolve();
                        });
                    });
                }

               // var imageElement = $('#topbar_usersettings_icon');
               // var smallHeadPath = '/_files/' + workflowAppId + '/participantimages/' + participantId + '/' + 'userimage_50x50px.png';
               // lookForImage(imageElement, smallHeadPath);

                //
                // end: This backfills the user small circle icon in the top bar. Trying to standardize this chunk of code so it can be used throughout.
                //

            }




            // First we have to display them in the top bar.
            // if (participantLogonType) {
            //$('#spanLoggedInUserWelcomePage').text('participantFriendlyName');
            //$('#spanLoggedInUserNewRequestPage').text(participantFriendlyName);
            //$('#spanLoggedInUserArchivePage').text(participantFriendlyName);
            //$('#spanLoggedInUserSummaryReportPage').text(participantFriendlyName);
            //$('#spanLoggedInUserConfigurationPage').text(participantFriendlyName);
            //$('#spanLoggedInUserVisualizationsPage').text(participantFriendlyName);
            //$('#spanLoggedInUserHelpPage').text(participantFriendlyName);
            // }
            //alert('In bwActiveMenu_Main.js.renderMenu(). Displaying user friendly name on USER button.');
            //var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');
            //if (participantFriendlyName) {

                // Display the users name on hover over for the top bar user settings circle icon.
                //$('#topbar_usersettings_icon').attr('title', participantFriendlyName);
                //$('#topbar_usersettings_icon').attr('alt', participantFriendlyName);

            //}

        } catch (e) {
            console.log('Exception in bwActiveMenu_Main.js.renderMenu(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwActiveMenu_Main.js.renderMenu(): ' + e.message + ', ' + e.stack);
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


            console.log('In bwActiveMenu_Main.js.displayTopBarErrorMessage(). Color calculation before: ' + JSON.stringify(temphsv) + ', after: ' + JSON.stringify(newhsv));


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

            //alert('In bwActiveMenu_Main.js.displayTopBarErrorMessage(). xcx99348768');

            $('#divTopBar_Long_Error').html(html);

        } catch (e) {
            console.log('Exception in bwActiveMenu_Main.js.displayTopBarErrorMessage(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwActiveMenu_Main.js.displayTopBarErrorMessage(): ' + e.message + ', ' + e.stack);
        }
    },
    clearTopBarErrorMessage: function (message) {
        try {
            console.log('In clearTopBarErrorMessage().');

            //var html = '';

            //alert('In bwActiveMenu_Main.js.clearTopBarErrorMessage(). xcx99348768');

            $('#divTopBar_Long_Error').html('');

        } catch (e) {
            console.log('Exception in bwActiveMenu_Main.js.clearTopBarErrorMessage(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwActiveMenu_Main.js.clearTopBarErrorMessage(): ' + e.message + ', ' + e.stack);
        }
    },




    RenderContentForButton: function (element, button) {
        try {
            console.log('In bwActiveMenu_Main.js.RenderContentForButton(): ' + button);
            //alert('In bwActiveMenu_Main.js.RenderContentForButton(): ' + button);
            var thiz = this;

            //
            //
            // This is called from all of the left menu buttons, and throughout the code. Note that I have incorporated our NEW REQUEST screen caching behaviour here as well. 11-7-2023.
            //    It could be tidied up at some point, but is good for now.
            //
            //

            $('canvas').remove('.canvasBwBusinessModelEditor'); // Clear the business model editor canvas.

            window.scrollTo(0, 0); // Scroll to top on button click. This makes sure things render Ok, and also just seems like a nicer user experience.
            $('.bwActiveMenu_Main').bwActiveMenu_Main('adjustLeftSideMenu'); // This makes sure our new stretchy-left-menu redraws Ok.

            var resetThePageAndButtons = true;

            //alert('In bwActiveMenu_Main.js.RenderContentForButton(). xcx99348768');

            // Clear any error message in the top bar.
            $('#divTopBar_Long_Error').html('');

            // THIS IS THE SECOND TIME WE ARE USING setTimeout for the call to bwActiveMenu_Main.adjustLeftSideMenu(). 4-25-2022
            setTimeout(function () { // Only needs to happen for Chrome.
                // menu should be re-done since the display has probably resized from the display of the email.
                //alert('Calling bwActiveMenu_Main.adjustLeftSideMenu().');
                //console.log('Calling bwActiveMenu_Main_Admin.adjustLeftSideMenu(). xcx123423521-1.');
                //alert('Calling bwActiveMenu_Main_Admin.adjustLeftSideMenu(). xcx123423521-1.');
                //$('.bwActiveMenu_Main').bwActiveMenu_Main('adjustLeftSideMenu');
                console.log('WE USED TO CALL bwActiveMenu_Main_Admin.adjustLeftSideMenu() HERE, BUT COMMENTED OUT. ANY RAMIFICATIONS WE NEED TO DEAL WITH? 1-4-2024. xcx123423521-1.');
            }, 1000);

            //if (button != 'NEW_REQUEST') {
            console.log('In bwActiveMenu_Main.js.RenderContentForButton(). button: ' + button);
            //}



            switch (button) {

                case 'ABOUT':
                    document.getElementById('divPageContent1').innerHTML = '';

                    var html = '';

                    // Free, easy to deploy and use systems such as this should level the financial playing field globally, by allowing all organizations access to some of the best software tools available.

                    html += `

<span style="padding-left:1px;color:cornflowerblue;font-weight:normal;vertical-align:top;">Welcome to the January 21, 2024 version of this software.</span>
<br />
<br />
<span style="font-family: SFProDisplay-Regular, Helvetica, Arial, sans-serif;font-size: 38px;font-weight: bold;">BudgetWorkflow.com</span>

<hr /><br />
BudgetWorkflow.com is a Node.js social network for organization-centric financial decision making.
<br />
<br />In other words, an organization-centric financial CAPEX/OPEX/Project-Management Request System (project management social network) with inventory, workflow, reconciliation, invoicing.
<br /><br />It is an extensible framework of jQuery widgets. Intended as a 1-stop shop for an organizations' financial decision making and management.
<br /><br />Capital Expenditure Planning (CAPEX), Operational (OPEX), and as it turns out, great for almost any kind of paperwork based process that needs to be archived, searchable, shared.
 
 <br /> <br />


    <span style="font-weight:bold;">Free (as in freedom) and Open Source, fully licensed under GNU AGPLv3.</span>
    <br />
    <br />
   
   


    <hr />

    

    <br />

 <span>This page is under construction. Comments and feedback: todd@budgetworkflow.com  Last edited: January 21, 2024. <br /><br /></span>
    <img src="../images/under-construction.jpg" style="width:300px;" /><br /><br />

I am working to have the source code and documentation available here in the next few days as a zip file.<br />In the meantime, email me to get a copy, or just download from here if you are proficient at that. This site is not served minified.<br /><br /><span style="font-weight:bold;">I want to make sure everyone can use, study, distribute, modify, and get the most out of this software!</span> todd@budgetworkflow.com.
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
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwActiveMenu_Main.js');">bwActiveMenu_Main.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwActivitySpinner_FileUpload.js');">bwActivitySpinner_FileUpload.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwActivitySpinner.js');">bwActivitySpinner.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwAdvancedProductSearch.js');">bwAdvancedProductSearch.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwAppThemeColorPicker.js');">bwAppThemeColorPicker.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwAuthentication.js');">bwAuthentication.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwChecklistsEditor.js');">bwChecklistsEditor.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwCircleDialog.js');">bwCircleDialog.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwCoreComponent.js');">bwCoreComponent.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwCustomerSummariesCarousel.js');">bwCustomerSummariesCarousel.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwDataGrid.js');">bwDataGrid.js</td></tr>

<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwDocumentation.js');">bwDocumentation.js</td></tr>

<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwDistributorBundling.js');">bwDistributorBundling.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwDonate.js');">bwDonate.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwEmailClient_Haraka.js');">bwEmailClient_Haraka.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwEmailClient.js');">bwEmailClient.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwEmailEditor_DeletedRequest.js');">bwEmailEditor_DeletedRequest.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwEmailEditor_RevertedRequest.js');">bwEmailEditor_RevertedRequest.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwEmailMonitor.js');">bwEmailMonitor.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwEmailTemplateEditor.js');">bwEmailTemplateEditor.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwExecutiveSummariesCarousel.js');">bwExecutiveSummariesCarousel.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwExecutiveSummariesCarousel2.js');">bwExecutiveSummariesCarousel2.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwExternallySharedFiles.js');">bwExternallySharedFiles.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwFormsEditor.js');">bwFormsEditor.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwHomePage.js');">bwHomePage.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwHowDoesItWorkCarousel2.js');">bwHowDoesItWorkCarousel2.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwHowDoesItWorkCarousel3.js');">bwHowDoesItWorkCarousel3.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwInvitation.js');">bwInvitation.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwInvitationsAdmin.js');">bwInvitationsAdmin.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwKeypressAndMouseEventHandler.js');">bwKeypressAndMouseEventHandler.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwLibreJs.js');">bwLibreJs.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwLocationEditor.js');">bwLocationEditor.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwMonitoringTools.js');">bwMonitoringTools.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwNewUserBusinessModelEditor.js');">bwNewUserBusinessModelEditor.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwNewUserChecklistsEditor.js');">bwNewUserChecklistsEditor.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwNewUserEmailEditor.js');">bwNewUserEmailEditor.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwNewUserFormsEditor.js');">bwNewUserFormsEditor.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwNewUserRolesEditor.js');">bwNewUserRolesEditor.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwNewUserWorkflowEditor.js');">bwNewUserWorkflowEditor.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwNotificationSound.js');">bwNotificationSound.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwOneTimeRequestReminders.js');">bwOneTimeRequestReminders.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwOperationalHours.js');">bwOperationalHours.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwOrganizationEditor.js');">bwOrganizationEditor.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwOrganizationEditorAdmin.js');">bwOrganizationEditorAdmin.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwOrganizationEvents.js');">bwOrganizationEvents.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwOrganizationPicker.js');">bwOrganizationPicker.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwOrganizationPicker2.js');">bwOrganizationPicker2.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwPageScrollingHandler.js');">bwPageScrollingHandler.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwParticipantsEditor.js');">bwParticipantsEditor.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwPeoplePicker.js');">bwPeoplePicker.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwPersonalErrorAdministration.js');">bwPersonalErrorAdministration.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwPillarTypeEditor.js');">bwPillarTypeEditor.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwPrintButton.js');">bwPrintButton.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwProductCarousel.js');">bwProductCarousel.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwProjectTypeEditor.js');">bwProjectTypeEditor.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwRequest.js');">bwRequest.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwRequest.min.js');">bwRequest.min.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwRequestTitleFormatAdmin.js');">bwRequestTitleFormatAdmin.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwRequestTypeDropDown_NewTenant.js');">bwRequestTypeDropDown_NewTenant.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwRequestTypeEditor.js');">bwRequestTypeEditor.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwResubscribeUserEmailEditor.js');">bwResubscribeUserEmailEditor.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwRolesEditor.js');">bwRolesEditor.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwSharePointFormEditor.js');">bwSharePointFormEditor.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwSharePointWorkflowEditor.js');">bwSharePointWorkflowEditor.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwSpeech.js');">bwSpeech.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwTardyParticipants.js');">bwTardyParticipants.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwTipsCarousel.js');">bwTipsCarousel.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwTrackSpending.js');">bwTrackSpending.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwUnsubscribeUserEmailEditor.js');">bwUnsubscribeUserEmailEditor.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwWorkflowEditor.js');">bwWorkflowEditor.js</td></tr>

<tr><td>&nbsp;</td></tr>
<tr><td>/formwidgets</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwAttachments.js');">bwAttachments.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwCapitalInternalOrderNumberField.js');">bwCapitalInternalOrderNumberField.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwCommentsField_Events.js');">bwCommentsField_Events.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwCommentsField.js');">bwCommentsField.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwCostCenterDescriptionField.js');">bwCostCenterDescriptionField.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwCostCenterNumberField.js');">bwCostCenterNumberField.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwCostsGrid.js');">bwCostsGrid.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwDescriptionDetailsField.js');">bwDescriptionDetailsField.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwDocumentScan.js');">bwDocumentScan.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwDurationInMonthsCalculatedField.js');">bwDurationInMonthsCalculatedField.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwEndDatePicker.js');">bwEndDatePicker.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwExpenseInternalOrderNumberField.js');">bwExpenseInternalOrderNumberField.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwInvoiceGrid.js');">bwInvoiceGrid.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwJustificationDetailsField.js');">bwJustificationDetailsField.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwLocationPicker.js');">bwLocationPicker.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwPaybackGrid.js');">bwPaybackGrid.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwPaybackTypeField.js');">bwPaybackTypeField.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwPeoplePicker_Customer.js');">bwPeoplePicker_Customer.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwPeoplePicker_EmailRecipients.js');">bwPeoplePicker_EmailRecipients.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwPeoplePicker.js');">bwPeoplePicker.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwPillarTypeCheckboxGroup.js');">bwPillarTypeCheckboxGroup.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwPillarTypeDropDown.js');">bwPillarTypeDropDown.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwProjectClassField.js');">bwProjectClassField.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwProjectTypeCheckboxGroup.js');">bwProjectTypeCheckboxGroup.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwProjectTypeDropDown.js');">bwProjectTypeDropDown.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwReasonDetailsField.js');">bwReasonDetailsField.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwRecordAudio.js');">bwRecordAudio.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwRequestedCapitalField.js');">bwRequestedCapitalField.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwRequestTypeDropDown.js');">bwRequestTypeDropDown.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwSelectInventoryItems.js');">bwSelectInventoryItems.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwSelectQuoteItems.js');">bwSelectQuoteItems.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwSpendGrid.js');">bwSpendGrid.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwStartDatePicker.js');">bwStartDatePicker.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwYearDropDown.js');">bwYearDropDown.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/ProjectTitle.js');">ProjectTitle.js</td></tr>




<!-- scripts -->

<tr><td>&nbsp;</td></tr>
<tr><td>/scripts</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/scripts/index.js');">index.js</td></tr>




<!-- serverstuff/webservices -->

<tr><td>&nbsp;</td></tr>
<tr><td>/serverstuff/webservices</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/serverstuff/webservices/budgetworkflow.com.js');">serverstuff/webservices/budgetworkflow.com.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/serverstuff/webservices/routes/commondata.js');">serverstuff/webservices/routes/commondata.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/serverstuff/webservices/routes/start.js');">serverstuff/webservices/routes/start.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/serverstuff/webservices/routes/sharedclientandserverscripts/bwCommonScripts.js');">serverstuff/webservices/routes/sharedclientandserverscripts/bwCommonScripts.js</td></tr>




<!-- serverstuff/fileservices -->

<tr><td>&nbsp;</td></tr>
<tr><td>/serverstuff/fileservices</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/serverstuff/fileservices/budgetworkflow.com.js');">serverstuff/fileservices/budgetworkflow.com.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/serverstuff/fileservices/routes/commondata.js');">serverstuff/fileservices/routes/commondata.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/serverstuff/fileservices/routes/start.js');">serverstuff/fileservices/routes/start.js</td></tr>



<!-- serverstuff/mediaconversionservices -->

<tr><td>&nbsp;</td></tr>
<tr><td>/serverstuff/mediaconversionservices</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/serverstuff/mediaconversionservices/budgetworkflow.com.js');">serverstuff/mediaconversionservices/budgetworkflow.com.js</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/serverstuff/mediaconversionservices/routes/start.js');">serverstuff/mediaconversionservices/routes/start.js</td></tr>


<!-- serverstuff/emailservices -->

<tr><td>&nbsp;</td></tr>
<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/serverstuff/emailservices/bwHarakaQueueHandler.js');">serverstuff/emailservices/bwHarakaQueueHandler.js</td></tr>























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
                    document.getElementById('divPageContent1').innerHTML = html;

                    //$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwActiveMenu_Main.js');
                    this.displayCodeFile('/widgets/bwActiveMenu_Main.js');

                    this.unshrinkLeftMenu();

                    break;

//                case 'CODE':

//                    document.getElementById('divPageContent1').innerHTML = '';

//                    var html = '';

//                    // |  [master drop down]  |  branch  |  tags  |				<span style="float:right;">[Go to file] [Code drop down]    About</span>

//                    html += `

//BudgetWorkflow.com
//<hr /><br />
//BudgetWorkflow.com is a NodeJs Social Network for financial decision making. In other words, an organization-centric CAPEX/OPEX/Project-Management Request System.



//<br />
// <br /> <br />
//BudgetWorkflow.com is an organization-centric financial request system (project management social network) with inventory, workflow, reconciliation, invoicing. It is an extensible framework of jQuery widgets. Intended as a 1-stop shop for an organizations' financial decision making and management. Capital Expenditure Planning (CAPEX), Operational (OPEX), and as it turns out, great for almost any kind of paperwork based process that needs to be archived, searchable, shared.
//My theory is that a free, easy to deploy and use system such as this would level the financial playing field globally, by allowing all organizations access to the best software tools available. 
// <br /> <br />
//<br />

//    Free and Open Source, fully licensed under GNU AGPLv3.
//    <br />
  






//    <hr />


//    <span style="float:right;">About section xcx2321354</span>


  




//    <br />

//    <hr />






//<table style="border:2px solid lightgray;width:100%;">
//        <tr>
//            <td style="vertical-align:top;width:17%;">
//                FILES<br />
//                <span style="color:tomato;">Select a link to view this code.</span>

//<br />

//<table style="border:3px solid lightgray;">
//        <tbody>

//            <!-- widgets -->

          
//<tr><td>&nbsp;</td></tr>
//<tr><td>/widgets</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwActiveMenu_Main.js');">bwActiveMenu_Main.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwActivitySpinner_FileUpload.js');">bwActivitySpinner_FileUpload.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwActivitySpinner.js');">bwActivitySpinner.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwAdvancedProductSearch.js');">bwAdvancedProductSearch.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwAppThemeColorPicker.js');">bwAppThemeColorPicker.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwAuthentication.js');">bwAuthentication.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwChecklistsEditor.js');">bwChecklistsEditor.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwCircleDialog.js');">bwCircleDialog.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwCoreComponent.js');">bwCoreComponent.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwCustomerSummariesCarousel.js');">bwCustomerSummariesCarousel.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwDataGrid.js');">bwDataGrid.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwDistributorBundling.js');">bwDistributorBundling.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwDonate.js');">bwDonate.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwEmailClient_Haraka.js');">bwEmailClient_Haraka.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwEmailClient.js');">bwEmailClient.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwEmailEditor_DeletedRequest.js');">bwEmailEditor_DeletedRequest.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwEmailEditor_RevertedRequest.js');">bwEmailEditor_RevertedRequest.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwEmailMonitor.js');">bwEmailMonitor.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwEmailTemplateEditor.js');">bwEmailTemplateEditor.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwExecutiveSummariesCarousel.js');">bwExecutiveSummariesCarousel.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwExecutiveSummariesCarousel2.js');">bwExecutiveSummariesCarousel2.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwExternallySharedFiles.js');">bwExternallySharedFiles.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwFormsEditor.js');">bwFormsEditor.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwHomePage.js');">bwHomePage.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwHowDoesItWorkCarousel2.js');">bwHowDoesItWorkCarousel2.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwHowDoesItWorkCarousel3.js');">bwHowDoesItWorkCarousel3.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwInvitation.js');">bwInvitation.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwInvitationsAdmin.js');">bwInvitationsAdmin.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwKeypressAndMouseEventHandler.js');">bwKeypressAndMouseEventHandler.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwLibreJs.js');">bwLibreJs.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwLocationEditor.js');">bwLocationEditor.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwMonitoringTools.js');">bwMonitoringTools.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwNewUserBusinessModelEditor.js');">bwNewUserBusinessModelEditor.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwNewUserChecklistsEditor.js');">bwNewUserChecklistsEditor.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwNewUserEmailEditor.js');">bwNewUserEmailEditor.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwNewUserFormsEditor.js');">bwNewUserFormsEditor.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwNewUserRolesEditor.js');">bwNewUserRolesEditor.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwNewUserWorkflowEditor.js');">bwNewUserWorkflowEditor.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwNotificationSound.js');">bwNotificationSound.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwOneTimeRequestReminders.js');">bwOneTimeRequestReminders.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwOperationalHours.js');">bwOperationalHours.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwOrganizationEditor.js');">bwOrganizationEditor.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwOrganizationEditorAdmin.js');">bwOrganizationEditorAdmin.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwOrganizationEvents.js');">bwOrganizationEvents.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwOrganizationPicker.js');">bwOrganizationPicker.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwOrganizationPicker2.js');">bwOrganizationPicker2.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwPageScrollingHandler.js');">bwPageScrollingHandler.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwParticipantsEditor.js');">bwParticipantsEditor.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwPeoplePicker.js');">bwPeoplePicker.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwPersonalErrorAdministration.js');">bwPersonalErrorAdministration.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwPillarTypeEditor.js');">bwPillarTypeEditor.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwPrintButton.js');">bwPrintButton.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwProductCarousel.js');">bwProductCarousel.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwProjectTypeEditor.js');">bwProjectTypeEditor.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwRequest.js');">bwRequest.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwRequest.min.js');">bwRequest.min.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwRequestTitleFormatAdmin.js');">bwRequestTitleFormatAdmin.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwRequestTypeDropDown_NewTenant.js');">bwRequestTypeDropDown_NewTenant.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwRequestTypeEditor.js');">bwRequestTypeEditor.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwResubscribeUserEmailEditor.js');">bwResubscribeUserEmailEditor.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwRolesEditor.js');">bwRolesEditor.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwSharePointFormEditor.js');">bwSharePointFormEditor.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwSharePointWorkflowEditor.js');">bwSharePointWorkflowEditor.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwSpeech.js');">bwSpeech.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwTardyParticipants.js');">bwTardyParticipants.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwTipsCarousel.js');">bwTipsCarousel.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwTrackSpending.js');">bwTrackSpending.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwUnsubscribeUserEmailEditor.js');">bwUnsubscribeUserEmailEditor.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/widgets/bwWorkflowEditor.js');">bwWorkflowEditor.js</td></tr>

//<tr><td>&nbsp;</td></tr>
//<tr><td>/formwidgets</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwAttachments.js');">bwAttachments.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwCapitalInternalOrderNumberField.js');">bwCapitalInternalOrderNumberField.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwCommentsField_Events.js');">bwCommentsField_Events.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwCommentsField.js');">bwCommentsField.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwCostCenterDescriptionField.js');">bwCostCenterDescriptionField.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwCostCenterNumberField.js');">bwCostCenterNumberField.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwCostsGrid.js');">bwCostsGrid.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwDescriptionDetailsField.js');">bwDescriptionDetailsField.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwDocumentScan.js');">bwDocumentScan.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwDurationInMonthsCalculatedField.js');">bwDurationInMonthsCalculatedField.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwEndDatePicker.js');">bwEndDatePicker.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwExpenseInternalOrderNumberField.js');">bwExpenseInternalOrderNumberField.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwInvoiceGrid.js');">bwInvoiceGrid.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwJustificationDetailsField.js');">bwJustificationDetailsField.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwLocationPicker.js');">bwLocationPicker.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwPaybackGrid.js');">bwPaybackGrid.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwPaybackTypeField.js');">bwPaybackTypeField.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwPeoplePicker_Customer.js');">bwPeoplePicker_Customer.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwPeoplePicker_EmailRecipients.js');">bwPeoplePicker_EmailRecipients.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwPeoplePicker.js');">bwPeoplePicker.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwPillarTypeCheckboxGroup.js');">bwPillarTypeCheckboxGroup.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwPillarTypeDropDown.js');">bwPillarTypeDropDown.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwProjectClassField.js');">bwProjectClassField.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwProjectTypeCheckboxGroup.js');">bwProjectTypeCheckboxGroup.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwProjectTypeDropDown.js');">bwProjectTypeDropDown.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwReasonDetailsField.js');">bwReasonDetailsField.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwRecordAudio.js');">bwRecordAudio.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwRequestedCapitalField.js');">bwRequestedCapitalField.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwRequestTypeDropDown.js');">bwRequestTypeDropDown.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwSelectInventoryItems.js');">bwSelectInventoryItems.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwSelectQuoteItems.js');">bwSelectQuoteItems.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwSpendGrid.js');">bwSpendGrid.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwStartDatePicker.js');">bwStartDatePicker.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/bwYearDropDown.js');">bwYearDropDown.js</td></tr>
//<tr><td style="border-bottom:2px solid lightgray;text-decoration:underline;cursor:pointer;" onclick="$('.bwActiveMenu_Main').bwActiveMenu_Main('displayCodeFile', '/formwidgets/ProjectTitle.js');">ProjectTitle.js</td></tr>




//        </tbody>
//    </table>






//            </td>
//            <td></td>
//            <td style="border-left:2px solid lightgray;width:83%;vertical-align:top;">
//                <table>
//                    <tr>
//                        <td id="tdFilePath">[tdFilePath]</td>
//                    </tr>
//                    <tr>
//                        <td>[AGPL-3.0]</td>
//                    </tr>
//                    <tr>
//                        <td>
//                            <table style="border:2px solid olive;">
//                                <tr>
//                                    <td style="border-bottom:1px solid gray;">top row</td>
//                                </tr>
//                                <tr>
//                                    <td>

//                                        <div id="javascriptCodeWindow"></div>

//                                    </td>
//                                </tr>
//                            </table>
//                        </td>
//                    </tr>
//                </table>
//            </td>
//        </tr>




//    </table>
























//    <br />

//    <br />


//`;

//                    document.getElementById('divPageContent1').innerHTML = html;


//                    //hljs.highlightAll();

//                    this.unshrinkLeftMenu();

//                    break;

                //case 'USE_CASES':

                //    if (document.getElementById('divConfigurationButton').className.indexOf('_SelectedButton') > -1) { // Prevent this code being executed when the configuration button is already selected.
                //        // This means the configuration button is already selected. Do nothing.
                //        resetThePageAndButtons = false;
                //    } else {
                //        displayConfiguration();
                //        $('.bwActiveMenu_Main').bwActiveMenu_Main('shrinkLeftMenuBar');
                //        //$('#bwQuickLaunchMenuTd').css({
                //        //    width: '0'
                //        //}); // This gets rid of the jumping around.
                //        //$('.bwAuthentication').bwAuthentication('securityTrimTheLeftMenuButtons_ConfigurationSection');
                //        $('#divPageContent2_Title').html('USE CASES');
                //        renderConfigurationPersonalBehavior();
                //    }
                //    break;

            }


            //if (button != 'NEW_REQUEST') {
            console.log('In bwActiveMenu_Main.js.RenderContentForButton(). resetThePageAndButtons: ' + resetThePageAndButtons);
            //}

            if (resetThePageAndButtons == true) {
                if ((button != 'USER') && (button != 'REPORT_AN_ERROR')) { // We don't want this button to be selected, since just the circle dialog will display. 

                    //$('#divPageContent2_Title').html(''); // Clear the title in the 2nd top menu bar. // removed 2-2-2022

                    //
                    // Ensure the correct left menu button is selected. We do this with the theme_SelectedButton classes. For example: brushedAluminum_green_SelectedButton
                    //
                    //var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');
                    //if (!workflowAppTheme) { // Need to do this for the home page when not logged in.
                        var workflowAppTheme = 'brushedAluminum_green';
                    //}
                    var workflowAppTheme_SelectedButton = workflowAppTheme + '_SelectedButton';

                    // Step 1: Make all of the buttons un-selected.
                    $('#tdLeftSideMenu').find('.' + workflowAppTheme_SelectedButton).each(function (index, value) {
                        $(this).addClass(workflowAppTheme).removeClass(workflowAppTheme_SelectedButton);
                    });

                    // Step 2: Set the specified button as the selected one.
                    //console.log('In bwActiveMenu_Main.js.RenderContentForButton(). Step 2: Set the specified button as the selected one.');
                    //debugger;
                    if (element && element == 'NEW_REQUEST_FORM_CANCEL_BUTTON') {
                        // Do nothing.
                    } else if (button == 'ABOUT') {

                        var x = $('#divWelcomeButton').hasClass('leftButton');
                        if (x == true) {
                            //debugger;
                            $('#divWelcomeButton').addClass(workflowAppTheme_SelectedButton).removeClass(workflowAppTheme);
                        } else {
                            console.log('In $(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForButton\', ). Error: Unable to locate class leftButton. xcx1-3.');
                            alert('In $(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForButton\', ). Error: Unable to locate class leftButton. xcx1-3');
                        }

                    } else if (button == 'CODE') {

                        var x = $('#divSlidesButton').hasClass('leftButton');
                        if (x == true) {
                            //debugger;
                            $('#divSlidesButton').addClass(workflowAppTheme_SelectedButton).removeClass(workflowAppTheme);
                        } else {
                            console.log('In $(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForButton\', ). Error: Unable to locate class leftButton. xcx1-3.');
                            alert('In $(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForButton\', ). Error: Unable to locate class leftButton. xcx1-3');
                        }

                    } else if (element == 'HOME_UNAUTHENTICATED_BUTTON') {
                        // This is the SLIDES button that is displayed before the user logs in.
                        var x = $('#divWelcomeButton').hasClass('leftButton');
                        if (x == true) {
                            //debugger;
                            $('#divWelcomeButton').addClass(workflowAppTheme_SelectedButton).removeClass(workflowAppTheme);
                        } else {
                            console.log('In $(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForButton\', ). Error: Unable to locate class leftButton. xcx1-3.');
                            alert('In $(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForButton\', ). Error: Unable to locate class leftButton. xcx1-3');
                        }

                    } else if (element == 'SLIDES_BUTTON') {
                        // This is the SLIDES button that is displayed before the user logs in.
                        var x = $('#divSlidesButton').hasClass('leftButton');
                        if (x == true) {
                            //debugger;
                            $('#divSlidesButton').addClass(workflowAppTheme_SelectedButton).removeClass(workflowAppTheme);
                        } else {
                            console.log('In $(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForButton\', ). Error: Unable to locate class leftButton. xcx1-2.');
                            alert('In $(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForButton\', ). Error: Unable to locate class leftButton. xcx1-2');
                        }

                    } else {



                        // 6-20-2023
                        //var element = $(document);
                        var x = $(element).hasClass('leftButton');
                        if (x == true) {
                            //debugger;
                            $(element).addClass(workflowAppTheme_SelectedButton).removeClass(workflowAppTheme);
                        } else {
                            console.log('In $(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForButton\', ). Error: Unable to locate class leftButton. xcx1.');
                            //alert('In $(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForButton\', ). Error: Unable to locate class leftButton. xcx1');

                            $('#divContactButton').addClass(workflowAppTheme_SelectedButton).removeClass(workflowAppTheme); // This makes the left menu button selected.


                        }









                    }
                }
            }

        } catch (e) {
            console.log('Exception in bwActiveMenu_Main.js.RenderContentForButton(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwActiveMenu_Main.js.RenderContentForButton(): ' + e.message + ', ' + e.stack);
        }
    },
    displayConfiguration: function () {
        try {
            console.log('In bwActiveMenu_Main.js.displayConfiguration().');

            // The inner left menu uses the same name for "Configuration", and in the future other functionality that uses the inner left menu. Therefore we make sure it is removed from the DOM before we put it back again. No duplicates!
            var element = document.getElementById('tableMainMenu2');
            if (element) {
                element.remove();
            }

            var developerModeEnabled = $('.bwAuthentication').bwAuthentication('option', 'developerModeEnabled');

            //alert('In bwActiveMenu_Main.js.displayConfiguration(). WE NEED TO CREATE INNER LEF MENU ELEMENTS HERE. xcx213536.');
            var html = '';
            //html += '<table id="tableMainMenu3" style="margin-left:-25px;width:100%;border-collapse: collapse;">';
            //html += document.getElementById('tableMainMenu2').innerHTML;


            html += '    <!-- Left inner menu -->';
            html += '    <table id="tableMainMenu2" style="margin-left:-20px;margin-top:-20px;width:100%;border-collapse: collapse;">'; // .paddingLeft = '10px'
            html += '        <tr>';
            html += '            <td style="width:1%;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
            html += '                <div class="brushedAluminum_noanimation noanimation" style="border-radius:20px 0 0 0;width: 225px; float:left; height:85px; background-color:gray; "></div>';
            html += '            </td>';
            html += '            <td style="width:0.1%;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
            html += '                <div style="float:left;height:85px;width:26px;background-color:gray;margin-left:-2px;margin-right:-2px;">';
            html += '                    <div class="brushedAluminum_noanimation noanimation" style="float:left;height:85px;width:26px;position:relative;background-color:gray;">';
            html += '                        <div id="divInnerRoundWithWhiteOverlay" style="position:absolute; bottom:0;float:left;width: 26px; height:36px; background-color:#f5f6fa; border-radius:26px 0 0 0;margin-left:1px;margin-bottom:-1px;"></div> <!-- The background-color is set to space white (#f5f6fa) here, for the "under the curve" color of this element. -->';
            html += '                    </div>';
            html += '                </div>';
            html += '            </td>';
            html += '            <td style="width:2%;vertical-align:top;padding:0 6px 0 6px;margin:0 0 0 0;border-width:0 0 0 0;">';
            html += '                <div id="divPageContent2_Title" style="font-size:45px;color:black;white-space:nowrap;margin-top:-3px;font-weight:bolder;">[divPageContent2_Title]</div>';
            html += '            </td>';
            html += '            <td style="width:95%;vertical-align:top;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
            html += '                <div xcx="xcx2132-4" class="brushedAluminum_noanimation noanimation" style="border-radius:0 26px 26px 0;width: 100%; float:left; height:50px; background-color:gray; ">';
            html += '                </div>';
            html += '            </td>';
            html += '        </tr>';
            html += '        <tr>';
            html += '            <td id="tdInnerLeftSideMenu" style="vertical-align:top;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
            html += '';
            html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:5px; background-color:white; "></div>';
            html += '';
            html += '                <div id="divInnerLeftMenuTopSmallBar1" class="brushedAluminum_noanimation noanimation" style="width: 100%; float:right; height:25px; background-color:#7788ff !important; color:white;font-family: \'Franklin Gothic Medium\', \'Arial Narrow\', Arial, sans-serif;display: flex !important;justify-content: flex-end !important;align-items: flex-end !important;"></div>';
            html += '';
            html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
            html += '                <div id="divInnerLeftMenuButton_PersonalBehavior" weightedheightvalue="40" class="leftButton brushedAluminum" onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForInnerLeftMenuButtons\', this, \'PERSONAL_BEHAVIOR\');">';
            html += '                    <div class="leftButtonText2">PERSONAL SETTINGS</div>';
            html += '                </div>';
            html += '';
            html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
            html += '                <div class="leftButton brushedAluminum" weightedheightvalue="125" style="display:none;height:125px;" onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForInnerLeftMenuButtons\', this, \'ORGANIZATION\');">';
            html += '                    <div class="leftButtonText2">ORGANIZATION</div>';
            html += '                </div>';
            //html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
            //html += '                <div class="leftButton brushedAluminum" weightedheightvalue="40" style="display:none;" onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForInnerLeftMenuButtons\', this, \'SETTINGS\');">';
            //html += '                    <div class="leftButtonText2">SETTINGS</div>';
            //html += '                </div>';
            html += '';
            html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
            html += '                <div class="leftButton brushedAluminum" weightedheightvalue="40" style="display:none;" onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForInnerLeftMenuButtons\', this, \'ROLES\');">';
            html += '                    <div class="leftButtonText2">ROLES</div>';
            html += '                </div>';
            html += '';
            html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
            html += '                <div class="leftButton brushedAluminum" weightedheightvalue="40" style="display:none;" onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForInnerLeftMenuButtons\', this, \'PARTICIPANTS\');">';
            html += '                    <div class="leftButtonText2">PARTICIPANTS</div>';
            html += '                </div>';

            html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
            html += '                <div class="leftButton brushedAluminum" weightedheightvalue="40" style="display:none;" onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForInnerLeftMenuButtons\', this, \'INVENTORY\');">';
            html += '                    <div class="leftButtonText2">INVENTORY</div>';
            html += '                </div>';

            html += '';
            html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
            html += '                <div class="leftButton brushedAluminum" weightedheightvalue="125" style="display:none;height:125px;" onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForInnerLeftMenuButtons\', this, \'WORKFLOW_AND_EMAIL\');">';
            html += '                    <div class="leftButtonText2">WORKFLOWS</div>';
            html += '                </div>';

            html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
            html += '                <div class="leftButton brushedAluminum" weightedheightvalue="40" style="display:none;" onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForInnerLeftMenuButtons\', this, \'FORMS\');">';
            html += '                    <div class="leftButtonText2">FORMS</div>';
            html += '                </div>';

            html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
            html += '                <div class="leftButton brushedAluminum" weightedheightvalue="40" style="display:none;" onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForInnerLeftMenuButtons\', this, \'CHECKLISTS\');">';
            html += '                    <div class="leftButtonText2">CHECKLISTS</div>';
            html += '                </div>';

            if (developerModeEnabled == true) {
                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
                html += '                <div class="leftButton brushedAluminum" weightedheightvalue="40" style="display:none;" onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForInnerLeftMenuButtons\', this, \'FINANCIALAREAS\');">';
                html += '                    <div class="leftButtonText2">FINANCIAL AREAS</div>';
                html += '                </div>';
            }

            html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
            html += '                <div class="leftButton brushedAluminum" weightedheightvalue="80" style="display:none;" onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForInnerLeftMenuButtons\', this, \'SETTINGS\');">';
            html += '                    <div class="leftButtonText2">ORGANIZATION SETTINGS</div>';
            html += '                </div>';
            html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
            html += '                <div class="leftButton brushedAluminum" weightedheightvalue="40" style="display:none;height:75px;" onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForInnerLeftMenuButtons\', this, \'MONITOR_PLUS_TOOLS\');">';
            html += '                    <div class="leftButtonText2">MONITORING & TOOLS</div>';
            html += '                </div>';


            if (developerModeEnabled == true) {
                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
                html += '                <div class="leftButton brushedAluminum" weightedheightvalue="40" style="display:none;" onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForInnerLeftMenuButtons\', this, \'INVENTORY\');">';
                html += '                    <div class="leftButtonText2">INVENTORY</div>';
                html += '                </div>';
                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
                html += '                <div class="leftButton brushedAluminum" weightedheightvalue="40" style="display:none;height:125px;" onclick="$(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForInnerLeftMenuButtons\', this, \'FUNCTIONAL_AREAS\');">';
                html += '                    <div class="leftButtonText2">FUNCTIONAL AREAS</div>';
                html += '                </div>';
            }

            html += '            </td>';
            html += '            <td colspan="3" style="vertical-align:top;">';
            html += '                <div id="divPageContent2" style="padding-left:10px;">';
            html += '';
            //html += '                    <div id="divPageContent3" style="right:-10px;top:-10px;padding-left:20px;padding-top:15px;">';
            //html += '                        <div style="border:1px dotted tomato;color:goldenrod;">';
            //html += '                            divPageContent3';
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
            html += '';
            html += '                </div>';
            html += '            </td>';
            html += '        </tr>';
            html += '    </table>';

            //html += '</table>';

            //document.getElementById('divPageContent1').style.paddingLeft = '30px';
            //document.getElementById('divPageContent1').style.paddingLeft = '10px';

            this.shrinkLeftMenu();

            document.getElementById('divPageContent1').innerHTML = html;

            //// shrink left menu THIS NEEDS TO MOVE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! MOVED IT TO shrinkLeftMenu() 1-4-2024.
            //document.getElementById('divLeftMenuHeader').style.width = '100px';
            //var cusid_ele = document.getElementsByClassName('leftButtonText');
            //for (var i = 0; i < cusid_ele.length; ++i) {
            //    var item = cusid_ele[i];
            //    item.style.fontSize = '8pt';
            //}



            // removed 12-13-2021
            //if (!(document.getElementById('tableMainMenu3'))) {
            //    console.log('In displayConfiguration(). Element tableMainMenu3 does not exist.');
            //} else {
            //    // zindex for the white overlay fix.
            //    console.log('>>In displayConfiguration(). Why are we getting z-index for element tableMainMenu3?');

            //    var zindex = document.getElementById('tableMainMenu3').style.zIndex; //getZIndex(document.getElementById('tableMainMenu3'));
            //    var zindex2 = document.getElementById('divInnerRoundWithWhiteOverlay').style.zIndex; // getZIndex(document.getElementById('divInnerRoundWithWhiteOverlay'));
            //    console.log('In displayConfiguration(). What is element tableMainMenu3? zindex: ' + zindex + ', zindex2:' + zindex2 + '.');

            //    document.getElementById('tableMainMenu3').style.zIndex = 100;
            //}

            console.log('Was Setting z-index for element "tableMainMenu2". I commented it out. Why were we doing this?');
            //document.getElementById('tableMainMenu2').style.zIndex = 100;

        } catch (e) {
            console.log('Exception in displayConfiguration(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in displayConfiguration(): ' + e.message + ', ' + e.stack);
        }
    },


    RenderContentForInnerLeftMenuButtons: function (element, button) {
        try {
            console.log('In bwActiveMenu_Main.js.RenderContentForInnerLeftMenuButtons(). button: ' + button);
            var thiz = this;

            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            $('canvas').remove('.canvasBwBusinessModelEditor'); // Clear the business model editor canvas.

            window.scrollTo(0, 0); // Scroll to top on button click. This makes sure things render Ok, and also just seems like a nicer user experience.
            $('.bwActiveMenu_Main').bwActiveMenu_Main('adjustLeftSideMenu'); // This makes sure our new stretchy-left-menu redraws Ok.

            $('#divPageContent2_Title').html('');




            // THIS IS THE SECOND TIME WE ARE USING setTimeout for the call to bwActiveMenu_Main_Admin.adjustLeftSideMenu(). 4-25-2022
            setTimeout(function () { // Only needs to happen for Chrome.
                // menu should be re-done since the display has probably resized from the display of the email.
                console.log('Calling bwActiveMenu_Main_Admin.adjustLeftSideMenu(). xcx123423521-2.');
                $('.bwActiveMenu_Main').bwActiveMenu_Main('adjustLeftSideMenu');
            }, 7000);



            //
            // Ensure the correct left menu button is selected. We do this with the them_SelectedButton classes. For example: brushedAluminum_green_SelectedButton
            //
            var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');
            var workflowAppTheme_SelectedButton = workflowAppTheme + '_SelectedButton';

            // Step 1: Make all of the buttons un-selected.
            $('#tableMainMenu3').find('.' + workflowAppTheme_SelectedButton).each(function (index, value) {
                $(this).addClass(workflowAppTheme).removeClass(workflowAppTheme_SelectedButton);
            });

            // Step 2: Set the specified button as the selected one.
            var x = $(element).hasClass('leftButton');
            if (x == true) {
                //debugger;
                $(element).addClass(workflowAppTheme_SelectedButton).removeClass(workflowAppTheme);
            } else {
                console.log('In $(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForButton\', ). Error: Unable to locate class leftButton. xcx2');
                //alert('In $(\'.bwActiveMenu_Main\').bwActiveMenu_Main(\'RenderContentForButton\', ). Error: Unable to locate class leftButton. xcx2');
            }





            switch (button) {
                case 'PERSONAL_BEHAVIOR':
                    //populateStartPageItem('divConfiguration', 'Reports', '');

                    //Personal / Behavior
                    //divWelcomePageLeftButtonsConfigurationButton
                    //populateStartPageItem('divConfiguration', 'Reports', '');

                    $('#bwQuickLaunchMenuTd').css({
                        width: '0'
                    }); // This gets rid of the jumping around.

                    try {
                        $('#FormsEditorToolbox').dialog('close');
                    } catch (e) { }

                    //generateConfigurationLeftSideMenu();
                    //renderLeftButtons('divConfigurationPageLeftButtons');

                    $('#divPageContent2_Title').html('PERSONAL SETTINGS');

                    renderConfigurationPersonalBehavior();

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
                    $('.bwOrganizationEditor').bwOrganizationEditor('loadBusinessModelEditor', true); //loadAndRenderBusinessModelEditor'); // This way it now loads fresh every time it is displayed. This is better for when changes are made, such as the "Organization Name". The old way which didn't reload was to call: 'renderBusinessModelEditor'); 
                    // Exception in bwActiveMenu_Main.js.RenderContentForInnerLeftMenuButtons(): loadAndRenderBusinessModelEditor is not defined, RenderContentForInnerLeftMenuButtons@https://www.budgetworkflow.com/widgets/bwActiveMenu_Main.js?v=xcx11132022-3:1904:22 $.widget/

                    break;

                case 'PARTICIPANTS':
                    //divParticipantsButton
                    //renderConfigurationParticipants();
                    //console.log('In renderConfigurationOrgRoles().');
                    //var requestTypes = bwEnabledRequestTypes.EnabledItems;

                    $('#bwQuickLaunchMenuTd').css({
                        width: '0'
                    }); // This gets rid of the jumping around.

                    try {
                        $('#FormsEditorToolbox').dialog('close');
                    } catch (e) { }

                    //var canvas = document.getElementById("myCanvas");
                    //var ctx = canvas.getContext("2d");
                    //ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas of it's lines

                    $('#divPageContent2_Title').html('PARTICIPANTS');

                    $('#divPageContent3').empty(); // Clear the div and rebuild it with out new 'Departments' title.
                    //$('#divFunctionalAreasMasterSubMenuDiv').hide(); //This si the top bar which we want to hide in this case.

                    //var html = '';
                    //html += '<table style="border-width: 0px; margin: 0px; padding: 0px; width: 100%;"><tbody><tr style="border-width: 0px; margin: 0px; padding: 0px;"><td style="border-width: 0px; margin: 0px; padding: 0px;">';
                    //html += 'Participants...xcx1';
                    //html += '</td></tr></tbody></table>';
                    //$('#divPageContent3').html(html);
                    //
                    //disableDepartmentsButton();
                    //disableRaciSettingsButton();
                    //disableOrgRoleSettingsButton();
                    //$('#divFunctionalAreasSubSubMenus').empty();


                    var html = '';
                    html += '<div id="divBwParticipantsEditor"></div>';
                    $('#divPageContent3').append(html);
                    //$('#divFunctionalAreasSubSubMenus').html(html);


                    ////debugger;

                    //                $('#divFunctionalAreasSubSubMenus').html(html);


                    var options = {
                        displayWorkflowPicker: true,
                        bwTenantId: tenantId,
                        bwWorkflowAppId: workflowAppId,
                        bwEnabledRequestTypes: bwEnabledRequestTypes
                    };
                    var $bwparticipantseditor = $("#divBwParticipantsEditor").bwParticipantsEditor(options);
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

                    //var options = {
                    //    displayWorkflowPicker: true,
                    //    bwTenantId: tenantId,
                    //    bwWorkflowAppId: workflowAppId,
                    //    bwEnabledRequestTypes: bwEnabledRequestTypes
                    //};
                    //var $bwparticipantseditor = $("#divBwParticipantsEditor").bwParticipantsEditor(options);
                    // Render the RACI role editor.
                    $('.bwCoreComponent').bwCoreComponent('renderBwRoles', 'divBwRolesEditor'); // THIS DISPLAYS the roles that are in the JSON org definition.

                    break;
                case 'WORKFLOW_AND_EMAIL':
                    //Workflow & Email
                    //divWorkflowEditorSettingsButton
                    $('#divPageContent2_Title').html('WORKFLOWS');
                    renderConfigurationWorkflow();
                    break;
                case 'CHECKLISTS':
                    //Checklists
                    //divChecklistsSettingsButton
                    $('#divPageContent2_Title').html('CHECKLISTS');
                    renderConfigurationChecklists();
                    break;
                case 'FORMS':
                    $('#divPageContent2_Title').html('FORMS');
                    renderConfigurationForms();
                    break;
                case 'SETTINGS':
                    //Settings
                    //divWorkflowSettingsButton
                    $('#divPageContent2_Title').html('ORGANIZATION SETTINGS');
                    renderConfigurationSettings();
                    break;
                case 'MONITOR_PLUS_TOOLS':
                    //Monitor + Tools
                    //divMonitoringToolsButton
                    $('#divPageContent2_Title').html('MONITORING + TOOLS');
                    renderConfigurationMonitoringTools();
                    break;
                case 'INVENTORY':

                    $('#divPageContent2_Title').html('INVENTORY');
                    renderConfigurationInventory();
                    break;

                case 'FUNCTIONAL_AREAS':
                    //Functional Areas
                    //divFunctionalAreasButton
                    $('#divPageContent2_Title').html('Functional Areas');
                    renderConfigurationFunctionalAreas();
                    break;
            }
        } catch (e) {
            console.log('Exception in bwActiveMenu_Main.js.RenderContentForInnerLeftMenuButtons(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwActiveMenu_Main.js.RenderContentForInnerLeftMenuButtons(): ' + e.message + ', ' + e.stack);
        }
    },




    shrinkLeftMenuBar: function () {
        try {
            console.log('In shrinkLeftMenuBar().');

            // shrink left menu
            document.getElementById('divLeftMenuHeader').style.width = '100px';
            var cusid_ele = document.getElementsByClassName('leftButtonText');
            for (var i = 0; i < cusid_ele.length; ++i) {
                var item = cusid_ele[i];
                item.style.fontSize = '8pt';
            }

        } catch (e) {
            console.log('Exception in shrinkLeftMenuBar(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in shrinkLeftMenuBar(): ' + e.message + ', ' + e.stack);
        }
    },

    adjustInnerLeftSideMenu: function () {
        try {
            console.log('In adjustInnerLeftSideMenu().');
            //alert('In adjustInnerLeftSideMenu().');
            var thiz = this;



            //debugger;
            //if (document.getElementById('tableMainMenu3').style.display == 'none') {
            //    // The inner left menu is not being displayed, so do nothing here.
            //} else {
            if ($('#tdInnerLeftSideMenu').is(':visible')) {

                // 8-12-2023.
                console.log('If the inner menu is being displayed, always make sure the outer left menu is shrunk.');
                this.shrinkLeftMenuBar(); // If the inner menu is being displayed, always make sure the outer left menu is shrunk.

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
            console.log('Exception in bwActiveMenu_Main.js.RGB2HSV(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwActiveMenu_Main.js.RGB2HSV(): ' + e.message + ', ' + e.stack);
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
            console.log('Exception in bwActiveMenu_Main.js.HSV2RGB(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwActiveMenu_Main.js.HSV2RGB(): ' + e.message + ', ' + e.stack);
        }
    },
    HueShift: function (h, s) {
        try {
            //Adding HueShift via Jacob (see comments)
            h += s; while (h >= 360.0) h -= 360.0; while (h < 0.0) h += 360.0; return h;
        } catch (e) {
            console.log('Exception in bwActiveMenu_Main.js.HueShift(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwActiveMenu_Main.js.HueShift(): ' + e.message + ', ' + e.stack);
        }
    },
    min3: function (a, b, c) {
        try {
            //min max via Hairgami_Master (see comments)
            return (a < b) ? ((a < c) ? a : c) : ((b < c) ? b : c);
        } catch (e) {
            console.log('Exception in bwActiveMenu_Main.js.min3(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwActiveMenu_Main.js.min3(): ' + e.message + ', ' + e.stack);
        }
    },
    max3: function (a, b, c) {
        try {
            return (a > b) ? ((a > c) ? a : c) : ((b > c) ? b : c);
        } catch (e) {
            console.log('Exception in bwActiveMenu_Main.js.max3(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwActiveMenu_Main.js.max3(): ' + e.message + ', ' + e.stack);
        }
    }

});