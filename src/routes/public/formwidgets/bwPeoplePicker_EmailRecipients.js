$.widget("bw.bwPeoplePicker_EmailRecipients", {
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
        This is the bwPeoplePicker_EmailRecipients.js jQuery Widget. 
        ===========================================================

            [more to follow]
                          
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

            [put your stuff here]

        ===========================================================
       
        */

        bwBudgetRequestId: null,

        elementIdSuffix: null, // This is a custom guid which gets appended to element id's, making sure this widget keeps to itself.

        parentElementIdSuffix: null, // This gets passed in so that this widget can find everything it needs. 6-15-2022



        fieldTitle: 'Project Manager', // This is the title, which shows up on the form in the left column.

        jsonData: null,

        allowRequestModifications: false,
        renderAsARequiredField: null, // If this is true, then just display the red asterisk.

        inFormsEditor: null, // This is when forms are being designed. This prevents the widget from hitting the database (going asynchronous) when this is true. If that happens, a race condition may occur and addition to the toolbox may partially fail.

        requestDialogId: null, // This is the unique id of the request dialog being displayed. We prepend this to id's in order to make sure we can display many dialogs at one time on screen and make them unique in the dom.
        commentsAreRequired: false, // If comments are required the background is that light blue color to indicate data entry is required. 
        consolidatedCommentsJson: null,

        bwTenantId: null,
        bwWorkflowAppId: null,

        operationUriPrefix: null,
        ajaxTimeout: 15000,
        autoSenseDeviceType: false // Automatic UI based on device type. Alpha version so far.
    },
    _create: function () {
        this.element.addClass("bwPeoplePicker_EmailRecipients");
        var thiz = this; // Need this because of the asynchronous operations below.
        try {

            selfDiscoverOperationUri(thiz); // This sets this.options.operationUriPrefix correctly.

            var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
            this.options.elementIdSuffix = guid;

            this.renderAndPopulatePeoplePicker();

            console.log('In bwPeoplePicker_EmailRecipients._create(). The widget has been initialized.');

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwPeoplePicker_EmailRecipients</span>';
            html += '<br />';
            html += '<span style="">Exception in bwPeoplePicker_EmailRecipients.Create(): ' + e.message + ', ' + e.stack + '</span>';
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
            .removeClass("bwPeoplePicker_EmailRecipients")
            .text("");
    },
    getData: function () {
        try {
            console.log('In bwPeoplePicker_EmailRecipients.getData().');
            //debugger;
            //Come back and build out the JSON for this!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 7-27-2020
            //var value = $(this.element).find('#txtProjectManagerName_' + this.options.elementIdSuffix)[0].value;

            //var element = document.getElementById('spanCustomerList_' + this.options.parentElementIdSuffix); // spanCustomerList_8a78b500-298f-4f09-ad95-f2ee80ed83a1_3a9dbbb6-f426-4a6d-8395-1d615f9ce43a
            debugger;
            //var customers = element.getElementsByClassName('divPeoplePicker_Participant');


            var element = document.getElementById('spanCustomerList_' + this.options.parentElementIdSuffix);
            var customers = element.getElementsByClassName('divPeoplePicker_Participant');

            var customersJson = [];
            for (var i = 0; i < customers.length; i++) {
                //html += '&nbsp;' + customers[i].outerHTML; // + '&nbsp;'; // This loop rebuilds the UI, so that we don't get extra spaces all over the place. Instead of using append() below, we use html() to replace all the html for the element.
                debugger;
                //var customer = document.getElementById(customers[i].id);
                //var customer = $('#' + customers[i].id);
                //var participantId = customers[i].id.split('_')[2];

                var customer = customers[i];

                //var xx = customer.getElementsByClassName('bwParticipantId');

                var participantId = customer.getElementsByClassName('bwParticipantId')[0].value;//         $(customer).find('.bwParticipantId').value;
                var participantEmail = customer.getElementsByClassName('bwParticipantEmail')[0].value;  //$(customer).find('.bwParticipantEmail').value;
                var participantFriendlyName = customer.getElementsByClassName('bwParticipantFriendlyName')[0].innerHTML;  // $(customer).find('.bwParticipantFriendlyName').innerHTML;

                var customerJson = {
                    //bwDataRequired: true,
                    //tagName: 'span',
                    ParticipantId: participantId,
                    ParticipantEmail: participantEmail,
                    ParticipantFriendlyName: participantFriendlyName
                }
                customersJson.push(customerJson);
            }

            var value = JSON.stringify(customersJson);
            return value;

        } catch (e) {
            console.log('Exception in bwPeoplePicker_EmailRecipients.getData(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwPeoplePicker_EmailRecipients.getData(): ' + e.message + ', ' + e.stack);
        }
    },
    isARequiredField: function () {
        try {
            console.log('In bwPeoplePicker_EmailRecipients.isARequiredField().');
            return this.options.renderAsARequiredField;
        } catch (e) {
            console.log('Exception in bwPeoplePicker_EmailRecipients.isARequiredField(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwPeoplePicker_EmailRecipients.isARequiredField(): ' + e.message + ', ' + e.stack);
        }
    },
    getfieldTitle: function () {
        try {
            console.log('In bwPeoplePicker_EmailRecipients.getfieldTitle().');
            return this.options.fieldTitle;
        } catch (e) {
            console.log('Exception in bwPeoplePicker_EmailRecipients.getfieldTitle(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwPeoplePicker_EmailRecipients.getfieldTitle(): ' + e.message + ', ' + e.stack);
        }
    },
    displayPeoplePickerDialog: function (friendlyNameSourceField, idSourceField, emailSourceField, buttonToEnable, peopleType, elementIdSuffix) {
        try {
            console.log('In displayPeoplePickerDialog(). elementIdSuffix: ' + elementIdSuffix);
            var thiz = this;

            if (peopleType && (peopleType == 'emailrecipient')) {

                $('#txtPeoplePickerDialogSearchBox_' + this.options.elementIdSuffix).empty(); // Clear the search text box.
                $('#PeoplePickerDialog_' + this.options.elementIdSuffix).dialog({
                    modal: true,
                    resizable: false,
                    closeText: "Cancel",
                    closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                    //title: "Select a person...", //"Enter your early adopter code...",
                    width: "570px",
                    dialogClass: "no-close", // No close button in the upper right corner.
                    hide: false, // This means when hiding just disappear with no effects.
                    open: function () {
                        $('.ui-widget-overlay').bind('click', function () {
                            $('#PeoplePickerDialog_' + thiz.options.elementIdSuffix).dialog('close');
                        });
                    } // This allows the dialog to close when clicked outside of the dialog. Only works for modal dialogs.
                });
                $('#PeoplePickerDialog_' + this.options.elementIdSuffix).dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

                $('#spanPeoplePickerDialogTitle_' + this.options.elementIdSuffix).html('Select an email recipient...');

                // Now we can hook up the Participant text box for autocomplete.
                $('#txtPeoplePickerDialogSearchBox_' + this.options.elementIdSuffix).autocomplete({
                    source: function (request, response) {
                        if (request.term == '') {
                            thiz.renderAllEmailRecipientsInThePeoplePicker(); // Nothing is in the search box, so show all participants.
                        } else {
                            $.ajax({
                                //url: appweburl + "/tenant/" + tenantId + "/participants/" + request.term,
                                url: webserviceurl + "/workflow/" + workflowAppId + "/participants/" + request.term,
                                dataType: "json",
                                success: function (data) {
                                    $('#spanPeoplePickerParticipantsList_' + thiz.options.elementIdSuffix).empty();
                                    var html = '';
                                    if (data.participants.length > 0) {
                                        //var searchArray = [];
                                        for (var i = 0; i < data.participants.length; i++) {
                                            //searchArray[i] = data.participants[i].participant;
                                            //var strParticipant = '<a href="">' + data.participants[i].participant.split('|')[0] + ' <i>(' + data.participants[i].participant.split('|')[2] + ')</i></a>';
                                            debugger; // do we ever get here?
                                            html += '<a style="cursor:pointer;" onclick="$(\'.bwRequest\').bwRequest(\'cmdReturnParticipantIdToField_ForEmailRecipients\', \'' + friendlyNameSourceField + '\', \'' + idSourceField + '\', \'' + emailSourceField + '\', \'' + data.participants[i].participant.split('|')[0] + '\', \'' + data.participants[i].participant.split('|')[1] + '\', \'' + data.participants[i].participant.split('|')[2] + '\', \'' + buttonToEnable + '\', \'' + elementIdSuffix + '\');">' + data.participants[i].participant.split('|')[0] + '&nbsp;&nbsp;<i>(' + data.participants[i].participant.split('|')[2] + ')</i></a>';


                                            //html += strParticipant; //data.participants[i].participant;
                                            html += '<br />';
                                            //response(searchArray);
                                        }
                                    } else {
                                        // There were no results.
                                        html += '<span><i>There were no results</i></span>';
                                    }
                                    $('#spanPeoplePickerParticipantsList_' + thiz.options.elementIdSuffix).append(html);
                                }
                            });
                        }
                    },
                    minLength: 0, // minLength specifies how many characters have to be typed before this gets invoked.
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
                        var peoplePickerParticipantName = this.value.split('|')[0];
                        var peoplePickerParticipantId = this.value.split('|')[1];
                        var peoplePickerParticipantEmail = this.value.split('|')[2];

                        if (peoplePickerParticipantName.indexOf('undefined') > -1) {
                            document.getElementById('txtPeoplePickerDialogSearchBox_' + thiz.options.elementIdSuffix).value = '';
                            document.getElementById('txtPeoplePickerDialogParticipantId_' + thiz.options.elementIdSuffix).value = '';
                            document.getElementById('txtPeoplePickerDialogParticipantEmail_' + thiz.options.elementIdSuffix).value = '';
                        } else {
                            document.getElementById('txtPeoplePickerDialogSearchBox_' + thiz.options.elementIdSuffix).value = peoplePickerParticipantName; //this.value.split(' ')[0] + ' ' + this.value.split(' ')[1]; // Just shows the Loan Number parameter (removing the borrower name) so it fits in the text box.
                            document.getElementById('txtPeoplePickerDialogParticipantId_' + thiz.options.elementIdSuffix).value = peoplePickerParticipantId;
                            document.getElementById('txtPeoplePickerDialogParticipantEmail_' + thiz.options.elementIdSuffix).value = peoplePickerParticipantEmail;
                        }
                    }
                });

                // List all participants.
                this.renderAllEmailRecipientsInThePeoplePicker(friendlyNameSourceField, idSourceField, emailSourceField, buttonToEnable, elementIdSuffix); // We do this the first time to make sure they are all displayed.

            } else if (peopleType && (peopleType == 'customer')) {

                $('#txtPeoplePickerDialogSearchBox_' + this.options.elementIdSuffix).empty(); // Clear the search text box.
                $('#PeoplePickerDialog_' + this.options.elementIdSuffix).dialog({
                    modal: true,
                    resizable: false,
                    closeText: "Cancel",
                    closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                    //title: "Select a person...", //"Enter your early adopter code...",
                    width: "570px",
                    dialogClass: "no-close", // No close button in the upper right corner.
                    hide: false, // This means when hiding just disappear with no effects.
                    open: function () {
                        $('.ui-widget-overlay').bind('click', function () {
                            $('#PeoplePickerDialog_' + thiz.options.elementIdSuffix).dialog('close');
                        });
                    } // This allows the dialog to close when clicked outside of the dialog. Only works for modal dialogs.
                });
                $('#PeoplePickerDialog_' + this.options.elementIdSuffix).dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

                $('#spanPeoplePickerDialogTitle_' + this.options.elementIdSuffix).html('Select a customer...');

                // Now we can hook up the Participant text box for autocomplete.
                $('#txtPeoplePickerDialogSearchBox_' + this.options.elementIdSuffix).autocomplete({
                    source: function (request, response) {
                        if (request.term == '') {
                            thiz.renderAllCustomersInThePeoplePicker(); // Nothing is in the search box, so show all participants.
                        } else {
                            $.ajax({
                                //url: appweburl + "/tenant/" + tenantId + "/participants/" + request.term,
                                url: webserviceurl + "/workflow/" + workflowAppId + "/participants/" + request.term,
                                dataType: "json",
                                success: function (data) {
                                    $('#spanPeoplePickerParticipantsList_' + thiz.options.elementIdSuffix).empty();
                                    var html = '';
                                    if (data.participants.length > 0) {
                                        //var searchArray = [];
                                        for (var i = 0; i < data.participants.length; i++) {
                                            //searchArray[i] = data.participants[i].participant;
                                            //var strParticipant = '<a href="">' + data.participants[i].participant.split('|')[0] + ' <i>(' + data.participants[i].participant.split('|')[2] + ')</i></a>';
                                            debugger; // do we ever get here?
                                            html += '<a onclick="$(\'.bwRequest\').bwRequest(\'cmdReturnParticipantIdToField_ForCustomer\', \'' + friendlyNameSourceField + '\', \'' + idSourceField + '\', \'' + emailSourceField + '\', \'' + data.participants[i].participant.split('|')[0] + '\', \'' + data.participants[i].participant.split('|')[1] + '\', \'' + data.participants[i].participant.split('|')[2] + '\', \'' + buttonToEnable + '\');">' + data.participants[i].participant.split('|')[0] + '&nbsp;&nbsp;<i>(' + data.participants[i].participant.split('|')[2] + ')</i></a>';


                                            //html += strParticipant; //data.participants[i].participant;
                                            html += '<br />';
                                            //response(searchArray);
                                        }
                                    } else {
                                        // There were no results.
                                        html += '<span><i>There were no results</i></span>';
                                    }
                                    $('#spanPeoplePickerParticipantsList_' + thiz.options.elementIdSuffix).append(html);
                                }
                            });
                        }
                    },
                    minLength: 0, // minLength specifies how many characters have to be typed before this gets invoked.
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
                        var peoplePickerParticipantName = this.value.split('|')[0];
                        var peoplePickerParticipantId = this.value.split('|')[1];
                        var peoplePickerParticipantEmail = this.value.split('|')[2];

                        if (peoplePickerParticipantName.indexOf('undefined') > -1) {
                            document.getElementById('txtPeoplePickerDialogSearchBox_' + this.options.elementIdSuffix).value = '';
                            document.getElementById('txtPeoplePickerDialogParticipantId_' + this.options.elementIdSuffix).value = '';
                            document.getElementById('txtPeoplePickerDialogParticipantEmail_' + this.options.elementIdSuffix).value = '';
                        } else {
                            document.getElementById('txtPeoplePickerDialogSearchBox_' + this.options.elementIdSuffix).value = peoplePickerParticipantName; //this.value.split(' ')[0] + ' ' + this.value.split(' ')[1]; // Just shows the Loan Number parameter (removing the borrower name) so it fits in the text box.
                            document.getElementById('txtPeoplePickerDialogParticipantId_' + this.options.elementIdSuffix).value = peoplePickerParticipantId;
                            document.getElementById('txtPeoplePickerDialogParticipantEmail_' + this.options.elementIdSuffix).value = peoplePickerParticipantEmail;
                        }
                    }
                });

                // List all participants.
                this.renderAllCustomersInThePeoplePicker(friendlyNameSourceField, idSourceField, emailSourceField, buttonToEnable); // We do this the first time to make sure they are all displayed.

            } else {
                $('#txtPeoplePickerDialogSearchBox_' + this.options.elementIdSuffix).empty(); // Clear the search text box.
                $('#PeoplePickerDialog_' + this.options.elementIdSuffix).dialog({
                    modal: true,
                    resizable: false,
                    closeText: "Cancel",
                    closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                    //title: "Select a person...", //"Enter your early adopter code...",
                    width: "570px",
                    dialogClass: "no-close", // No close button in the upper right corner.
                    hide: false, // This means when hiding just disappear with no effects.
                    open: function () {
                        $('.ui-widget-overlay').bind('click', function () {
                            $('#PeoplePickerDialog_' + thiz.options.elementIdSuffix).dialog('close');
                        });
                    } // This allows the dialog to close when clicked outside of the dialog. Only works for modal dialogs.
                });
                $('#PeoplePickerDialog_' + this.options.elementIdSuffix).dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

                $('#spanPeoplePickerDialogTitle_' + this.options.elementIdSuffix).html('Select a person...');

                // Now we can hook up the Participant text box for autocomplete.
                $('#txtPeoplePickerDialogSearchBox_' + this.options.elementIdSuffix).autocomplete({
                    source: function (request, response) {
                        if (request.term == '') {
                            thiz.renderAllParticipantsInThePeoplePicker(); // Nothing is in the search box, so show all participants.
                        } else {
                            $.ajax({
                                //url: appweburl + "/tenant/" + tenantId + "/participants/" + request.term,
                                url: webserviceurl + "/workflow/" + workflowAppId + "/participants/" + request.term,
                                dataType: "json",
                                success: function (data) {
                                    $('#spanPeoplePickerParticipantsList_' + thiz.options.elementIdSuffix).empty();
                                    var html = '';
                                    if (data.participants.length > 0) {
                                        //var searchArray = [];
                                        for (var i = 0; i < data.participants.length; i++) {
                                            //searchArray[i] = data.participants[i].participant;
                                            //var strParticipant = '<a href="">' + data.participants[i].participant.split('|')[0] + ' <i>(' + data.participants[i].participant.split('|')[2] + ')</i></a>';
                                            debugger; // do we ever get here?
                                            html += '<a onclick="$(\'.bwRequest\').bwRequest(\'cmdReturnParticipantIdToField\', \'' + friendlyNameSourceField + '\', \'' + idSourceField + '\', \'' + emailSourceField + '\', \'' + data.participants[i].participant.split('|')[0] + '\', \'' + data.participants[i].participant.split('|')[1] + '\', \'' + data.participants[i].participant.split('|')[2] + '\', \'' + buttonToEnable + '\');">' + data.participants[i].participant.split('|')[0] + '&nbsp;&nbsp;<i>(' + data.participants[i].participant.split('|')[2] + ')</i></a>';


                                            //html += strParticipant; //data.participants[i].participant;
                                            html += '<br />';
                                            //response(searchArray);
                                        }
                                    } else {
                                        // There were no results.
                                        html += '<span><i>There were no results</i></span>';
                                    }
                                    $('#spanPeoplePickerParticipantsList_' + this.options.elementIdSuffix).append(html);
                                }
                            });
                        }
                    },
                    minLength: 0, // minLength specifies how many characters have to be typed before this gets invoked.
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
                        var peoplePickerParticipantName = this.value.split('|')[0];
                        var peoplePickerParticipantId = this.value.split('|')[1];
                        var peoplePickerParticipantEmail = this.value.split('|')[2];

                        if (peoplePickerParticipantName.indexOf('undefined') > -1) {
                            document.getElementById('txtPeoplePickerDialogSearchBox_' + thiz.options.elementIdSuffix).value = '';
                            document.getElementById('txtPeoplePickerDialogParticipantId_' + thiz.options.elementIdSuffix).value = '';
                            document.getElementById('txtPeoplePickerDialogParticipantEmail_' + thiz.options.elementIdSuffix).value = '';
                        } else {
                            document.getElementById('txtPeoplePickerDialogSearchBox_' + thiz.options.elementIdSuffix).value = peoplePickerParticipantName; //this.value.split(' ')[0] + ' ' + this.value.split(' ')[1]; // Just shows the Loan Number parameter (removing the borrower name) so it fits in the text box.
                            document.getElementById('txtPeoplePickerDialogParticipantId_' + thiz.options.elementIdSuffix).value = peoplePickerParticipantId;
                            document.getElementById('txtPeoplePickerDialogParticipantEmail_' + thiz.options.elementIdSuffix).value = peoplePickerParticipantEmail;
                        }
                    }
                });

                // List all participants.
                this.renderAllParticipantsInThePeoplePicker(friendlyNameSourceField, idSourceField, emailSourceField, buttonToEnable); // We do this the first time to make sure they are all displayed.
            }

        } catch (e) {
            console.log('Exception in displayPeoplePickerDialog(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in displayPeoplePickerDialog(): ' + e.message + ', ' + e.stack);
        }
    },
    renderAllParticipantsInThePeoplePicker: function (friendlyNameSourceField, idSourceField, emailSourceField, buttonToEnable) {
        try {
            console.log('In bwRequest.js.renderAllParticipantsInThePeoplePicker().');

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            $('#spanPeoplePickerParticipantsList_' + this.options.elementIdSuffix).empty();
            var data = {
                "bwWorkflowAppId": workflowAppId
            };
            $.ajax({
                url: webserviceurl + "/workflow/participants",
                type: "DELETE",
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: function (data1) {
                    var data = data1.BwWorkflowUsers;
                    var html = '';
                    for (var i = 0; i < data.length; i++) {
                        html += '<a onclick="$(\'.bwRequest\').bwRequest(\'cmdReturnParticipantIdToField\', \'' + friendlyNameSourceField + '\', \'' + idSourceField + '\', \'' + emailSourceField + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantEmail + '\', \'' + buttonToEnable + '\');">' + data[i].bwParticipantFriendlyName + '&nbsp;&nbsp;<i>(' + data[i].bwParticipantEmail + ')</i></a>';
                        html += '<br />';
                    }
                    $('#spanPeoplePickerParticipantsList_' + thiz.options.elementIdSuffix).append(html);
                },
                error: function (data, errorCode, errorMessage) {
                    displayAlertDialog('Error in my.js.renderAllParticipantsInThePeoplePicker():' + errorCode + ', ' + errorMessage);
                }
            });
        } catch (e) {
            console.log('Exception in renderAllParticipantsInThePeoplePicker(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in renderAllParticipantsInThePeoplePicker(): ' + e.message + ', ' + e.stack);
        }
    },
    renderAllCustomersInThePeoplePicker: function (friendlyNameSourceField, idSourceField, emailSourceField, buttonToEnable) {
        try {
            console.log('In bwRequest.js.renderAllCustomersInThePeoplePicker().');

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            $('#spanPeoplePickerParticipantsList_' + this.options.elementIdSuffix).empty();
            var data = {
                "bwWorkflowAppId": workflowAppId
            };
            $.ajax({
                url: webserviceurl + "/workflow/participants",
                type: "DELETE",
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: function (data1) {
                    //debugger;
                    var data = data1.BwWorkflowUsers;
                    var html = '';

                    var thereAreSomeCustomers = false;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].bwParticipantRole == 'customer') {
                            thereAreSomeCustomers = true;
                            html += '<a onclick="$(\'.bwRequest\').bwRequest(\'cmdReturnParticipantIdToField_ForCustomer\', \'' + friendlyNameSourceField + '\', \'' + idSourceField + '\', \'' + emailSourceField + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantEmail + '\', \'' + buttonToEnable + '\');">' + data[i].bwParticipantFriendlyName + '&nbsp;&nbsp;<i>(' + data[i].bwParticipantEmail + ')</i></a>';
                            html += '<br />';
                        }
                    }

                    if (thereAreSomeCustomers == false) {
                        html += 'There are no customers in this organization.';
                    }
                    $('#spanPeoplePickerParticipantsList_' + thiz.options.elementIdSuffix).append(html);
                },
                error: function (data, errorCode, errorMessage) {
                    displayAlertDialog('Error in my.js.renderAllCustomersInThePeoplePicker():xcx23123: ' + errorCode + ', ' + errorMessage);
                }
            });
        } catch (e) {
            console.log('Exception in renderAllCustomersInThePeoplePicker(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in renderAllCustomersInThePeoplePicker(): ' + e.message + ', ' + e.stack);
        }
    },
    renderAllEmailRecipientsInThePeoplePicker: function (friendlyNameSourceField, idSourceField, emailSourceField, buttonToEnable, elementIdSuffix) {
        try {
            console.log('In bwRequest.js.renderAllEmailRecipientsInThePeoplePicker(). elementIdSuffix: ' + elementIdSuffix);
            var thiz = this;

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

            $('#spanPeoplePickerParticipantsList_' + this.options.elementIdSuffix).empty();
           
            var data = {
                bwParticipantId_LoggedIn: participantId,
                bwActiveStateIdentifier: activeStateIdentifier,
                bwWorkflowAppId_LoggedIn: workflowAppId,

                bwWorkflowAppId: workflowAppId
            };
            $.ajax({
                url: webserviceurl + "/workflow/participants",
                type: "POST",
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: function (result) {
                    try {

                        var data = result.BwWorkflowUsers;
                        var html = '';

                        var thereAreSomeCustomers = false;
                        for (var i = 0; i < data.length; i++) {
                            if ((data[i].bwParticipantRole == 'customer') || (data[i].bwParticipantRole == 'emailrecipient')) {
                                thereAreSomeCustomers = true;
                                html += '<a style="cursor:pointer;" onclick="$(\'.bwRequest\').bwRequest(\'cmdReturnParticipantIdToField_ForEmailRecipient\', \'' + friendlyNameSourceField + '\', \'' + idSourceField + '\', \'' + emailSourceField + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantEmail + '\', \'' + buttonToEnable + '\', \'' + elementIdSuffix + '\');">' + data[i].bwParticipantFriendlyName + '&nbsp;&nbsp;<i>(' + data[i].bwParticipantEmail + ')</i></a>';
                                html += '<br />';
                            }
                        }

                        if (thereAreSomeCustomers == false) {
                            html += 'There are no email recipients in this organization.';
                        }
                        $('#spanPeoplePickerParticipantsList_' + thiz.options.elementIdSuffix).append(html);

                    } catch (e) {
                        console.log('Exception in bwRequest.js.renderAllEmailRecipientsInThePeoplePicker():2: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwRequest.js.renderAllEmailRecipientsInThePeoplePicker():2: ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    displayAlertDialog('Error in bwRequest.js.renderAllEmailRecipientsInThePeoplePicker():' + errorCode + ', ' + errorMessage);
                }
            });
        } catch (e) {
            console.log('Exception in bwRequest.js.renderAllEmailRecipientsInThePeoplePicker(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwRequest.js.renderAllEmailRecipientsInThePeoplePicker(): ' + e.message + ', ' + e.stack);
        }
    },




    saveANewEmailRecipient: function (bwBudgetRequestId) {
        try {
            console.log('In bwPeoplePicker_EmailRecipients.js.saveANewEmailRecipient().');
            if (!bwBudgetRequestId) {
                // We need this in order to populate the email recipients list.
                console.log('Error in bwPeoplePicker_EmailRecipients.js.saveANewEmailRecipient(): Invalid value for bwBudgetRequestId.');
                displayAlertDialog('Error in bwPeoplePicker_EmailRecipients.js.saveANewEmailRecipient(): Invalid value for bwBudgetRequestId.');

            } else {
                var thiz = this;

                var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                var workflowAppTitle = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTitle');

                var newUserFriendlyName = document.getElementById('txtAddANewEmailRecipientDialogFriendlyName').value; // txtAddANewPersonDialogFriendlyName
                var newUserEmailAddress = document.getElementById('txtAddANewEmailRecipientDialogEmail').value;
                if (newUserFriendlyName.trim() == '') {
                    displayAlertDialog('Please enter a Name.');
                    document.getElementById('txtAddANewEmailRecipientDialogFriendlyName').focus();
                } else if (newUserEmailAddress.trim() == '') {
                    displayAlertDialog('Please enter an Email Address.');
                    document.getElementById('txtAddANewEmailRecipientDialogEmail').focus();
                } else {

                    var data = [];
                    data = {
                        newUserFriendlyName: newUserFriendlyName,
                        newUserEmailAddress: newUserEmailAddress,
                        appweburl: this.options.operationUriPrefix,
                        addedByFriendlyName: participantFriendlyName,
                        addedByEmailAddress: participantEmail,
                        addedToBwWorkflowAppId: workflowAppId,
                        addedToBwWorkflowAppTitle: workflowAppTitle
                    };
                    var operationUri = this.options.operationUriPrefix + "_bw/addanewemailrecipient"; // Don't turn this on until we are certain the web service is working 100%. 7-6-2022
                    $.ajax({
                        url: operationUri,
                        type: "POST",
                        data: data,
                        headers: {
                            "Accept": "application/json; odata=verbose"
                        },
                        success: function (data) {
                            try {
                                if (data.message == 'This email address is already in use') {
                                    displayAlertDialog('This email address is already registered with us. Please enter a different one, or login using the existing credentials.');
                                    document.getElementById('txtAddANewPersonDialogEmail').focus();
                                } else if (data.message == 'SUCCESS') {

                                    var selectedParticipantId = data.bwParticipantId;
                                    var selectedParticipantEmail = data.bwParticipantEmail;
                                    var selectedParticipantFriendlyName = data.bwParticipantFriendlyName;

                                    displayAlertDialog('The email recipient has been added successfully.'); //, and they have been notified.');

                                    //$('.bwCircleDialog').bwCircleDialog('hideAndDestroyCircleDialog');
                                    $('.bwCircleDialog').bwCircleDialog('hideCircleDialog');

                                    // This performa almost exactly he same functionality as addEmailRecipient, below.
                                    var elementIdSuffix = thiz.options.parentElementIdSuffix;

                                    var customerElement = document.getElementById('spanEmailRecipient_' + bwBudgetRequestId + '_' + selectedParticipantId + '_' + elementIdSuffix);
                                    if (customerElement) {
                                        // The customer has already been selected, so do nothing.
                                    } else {

                                        var html = '';

                                        var element = document.getElementById('spanCustomerList_' + thiz.options.parentElementIdSuffix); // spanCustomerList_8a78b500-298f-4f09-ad95-f2ee80ed83a1_3a9dbbb6-f426-4a6d-8395-1d615f9ce43a

                                        var customers = element.getElementsByClassName('divPeoplePicker_Participant');

                                        for (var i = 0; i < customers.length; i++) {
                                            html += customers[i].outerHTML + '&nbsp;'; // + '&nbsp;'; // This loop rebuilds the UI, so that we don't get extra spaces all over the place. Instead of using append() below, we use html() to replace all the html for the element.
                                        }

                                        html += '                   <span id="spanEmailRecipient_' + bwBudgetRequestId + '_' + selectedParticipantId + '_' + elementIdSuffix + '" title="' + selectedParticipantEmail + '" alt="' + selectedParticipantEmail + '" class="divPeoplePicker_Participant" bwfieldname="ParticipantFriendlyName" style="font-size:15pt;border:1px solid skyblue;background-color:lightgoldenrodyellow;cursor:help;">';
                                        html += '                       <span class="bwParticipantFriendlyName" id="txtProjectManagerName_' + bwBudgetRequestId + '_' + selectedParticipantId + '_' + elementIdSuffix + '">' + selectedParticipantFriendlyName + '</span>&nbsp;<span class="divPeoplePicker_Participant_Delete" style="color:red;display:inline-block;cursor:pointer !important;" ';
                                        html += '                           onclick="$(\'.bwPeoplePicker_EmailRecipients\').bwPeoplePicker_EmailRecipients(\'removeCustomer\', \'' + '' + '\', \'' + '' + '\', \'' + '' + '\', \'' + selectedParticipantFriendlyName + '\', \'' + selectedParticipantId + '\', \'' + selectedParticipantEmail + '\', \'' + '' + '\');">X</span>&nbsp;';
                                        //html += '                       <input id="2txtProjectManagerName_' + elementIdSuffix + '" bwfieldname="ParticipantId" style="display:none;" />';
                                        html += '                       <input class="bwParticipantId" id="txtProjectManagerId_' + bwBudgetRequestId + '_' + selectedParticipantId + '_' + elementIdSuffix + '" bwfieldname="ParticipantId" style="display:none;" value="' + selectedParticipantId + '" />';
                                        html += '                       <input class="bwParticipantEmail" id="txtProjectManagerEmail_' + bwBudgetRequestId + '_' + selectedParticipantId + '_' + elementIdSuffix + '" bwfieldname="ParticipantEmail" style="display:none;" value="' + selectedParticipantEmail + '" />';
                                        html += '                   </span>';

                                        $('#spanCustomerList_' + elementIdSuffix).html(html);
                                    }

                                } else {
                                    displayAlertDialog(data.message);
                                }
                            } catch (e) {
                                console.log('Exception in bwPeoplePicker_EmailRecipients.js.saveANewEmailRecipient.success(): ' + e.message + ', ' + e.stack);
                                displayAlertDialog('Exception in bwPeoplePicker_EmailRecipients.js.saveANewEmailRecipient.success(): ' + e.message + ', ' + e.stack);
                            }
                        },
                        error: function (data, errorCode, errorMessage) {
                            //handleExceptionWithAlert('Error in Start.js.displayConnectedWorkflows()', '1:' + errorCode + ', ' + errorMessage);
                            displayAlertDialog('Error in bwPeoplePicker_EmailRecipients.js.saveANewEmailRecipient(): ' + errorMessage);
                        }
                    });
                }
            }

        } catch (e) {
            console.log('Exception in bwPeoplePicker_EmailRecipients.js.saveANewEmailRecipient(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwPeoplePicker_EmailRecipients.js.saveANewEmailRecipient(): ' + e.message + ', ' + e.stack);
        }
    },
    addEmailRecipient: function (friendlyNameSourceField, idSourceField, emailSourceField, selectedParticipantFriendlyName, selectedParticipantId, selectedParticipantEmail, bwBudgetRequestId) { //elementIdSuffix will let us find everything!
        try {
            var elementIdSuffix = this.options.parentElementIdSuffix;

            console.log('In bwPeoplePicker_EmailRecipients.js.addEmailRecipient(). : ' + elementIdSuffix);
            //alert('In bwPeoplePicker_EmailRecipients.js.addEmailRecipient(). elementIdSuffix: ' + elementIdSuffix);

            //var elementIdSuffix = friendlyNameSourceField.split('_')[2]; // This ensures this method call works with the correct request form!!!
            var elementIdSuffix = this.options.parentElementIdSuffix;

            var customerElement = document.getElementById('spanEmailRecipient_' + bwBudgetRequestId + '_' + selectedParticipantId + '_' + elementIdSuffix);
            if (customerElement) {
                // The customer has already been selected, so do nothing.
            } else {

                var html = '';

                var element = document.getElementById('spanCustomerList_' + this.options.parentElementIdSuffix); // spanCustomerList_8a78b500-298f-4f09-ad95-f2ee80ed83a1_3a9dbbb6-f426-4a6d-8395-1d615f9ce43a
                debugger;
                var customers = element.getElementsByClassName('divPeoplePicker_Participant');

                for (var i = 0; i < customers.length; i++) {
                    html += customers[i].outerHTML + '&nbsp;'; // + '&nbsp;'; // This loop rebuilds the UI, so that we don't get extra spaces all over the place. Instead of using append() below, we use html() to replace all the html for the element.
                }

                html += '                   <span id="spanEmailRecipient_' + bwBudgetRequestId + '_' + selectedParticipantId + '_' + elementIdSuffix + '" title="' + selectedParticipantEmail + '" alt="' + selectedParticipantEmail + '" class="divPeoplePicker_Participant" bwfieldname="ParticipantFriendlyName" style="font-size:15pt;border:1px solid skyblue;background-color:lightgoldenrodyellow;cursor:help;">';
                html += '                       <span class="bwParticipantFriendlyName" id="txtProjectManagerName_' + bwBudgetRequestId + '_' + selectedParticipantId + '_' + elementIdSuffix + '">' + selectedParticipantFriendlyName + '</span>&nbsp;<span class="divPeoplePicker_Participant_Delete" style="color:red;display:inline-block;cursor:pointer !important;" ';
                html += '                           onclick="$(\'.bwPeoplePicker_EmailRecipients\').bwPeoplePicker_EmailRecipients(\'removeCustomer\', \'' + friendlyNameSourceField + '\', \'' + idSourceField + '\', \'' + emailSourceField + '\', \'' + selectedParticipantFriendlyName + '\', \'' + selectedParticipantId + '\', \'' + selectedParticipantEmail + '\', \'' + bwBudgetRequestId + '\');">X</span>&nbsp;';
                //html += '                       <input id="2txtProjectManagerName_' + elementIdSuffix + '" bwfieldname="ParticipantId" style="display:none;" />';
                html += '                       <input class="bwParticipantId" id="txtProjectManagerId_' + bwBudgetRequestId + '_' + selectedParticipantId + '_' + elementIdSuffix + '" bwfieldname="ParticipantId" style="display:none;" value="' + selectedParticipantId + '" />';
                html += '                       <input class="bwParticipantEmail" id="txtProjectManagerEmail_' + bwBudgetRequestId + '_' + selectedParticipantId + '_' + elementIdSuffix + '" bwfieldname="ParticipantEmail" style="display:none;" value="' + selectedParticipantEmail + '" />';
                html += '                   </span>';

                $('#spanCustomerList_' + elementIdSuffix).html(html);
            }

            $('#PeoplePickerDialog_' + this.options.elementIdSuffix).dialog('close');

        } catch (e) {
            console.log('Exception in bwPeoplePicker_EmailRecipients..js.addEmailRecipient(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwPeoplePicker_EmailRecipients.js.addEmailRecipient(): ' + e.message + ', ' + e.stack);
        }
    },
    removeCustomer: function (friendlyNameSourceField, idSourceField, emailSourceField, selectedParticipantFriendlyName, selectedParticipantId, selectedParticipantEmail, bwBudgetRequestId) { //elementIdSuffix will let us find everything!
        try {
            console.log('In bwPeoplePicker_EmailRecipients.removeCustomer(). elementIdSuffix: ' + this.options.elementIdSuffix + ', parentElementIdSuffix: ' + this.options.parentElementIdSuffix);

            //var budgetrequestform;
            //var budgetrequestforms = $('#budgetrequestform');
            //for (var i = 0; i < budgetrequestforms.length; i++) {
            //    var _budgetRequestId = $(budgetrequestforms[i])[0].getAttribute('bwbudgetrequestid');
            //    if (bwBudgetRequestId == bwBudgetRequestId) {
            //        // We found the form.
            //        budgetrequestform = $(budgetrequestforms[i])[0];
            //        break;
            //    }
            //}

            //if (!budgetrequestform) {

            //    displayAlertDialog('Error in removeCustomer(). Unexpected value for budgetrequestform: ' + budgetrequestform);

            //} else {


            //var elementIdSuffix = friendlyNameSourceField.split('_')[2]; // This ensures this method call works with the correct request form!!!
            //var elementIdSuffix = this.options.parentElementIdSuffix;

            console.log('Attempt to remove element: ' + '#spanCustomer_' + this.options.parentElementIdSuffix + '_' + selectedParticipantId + '_' + this.options.parentElementIdSuffix);

            $('#spanEmailRecipient_' + this.options.parentElementIdSuffix + '_' + selectedParticipantId + '_' + this.options.parentElementIdSuffix).remove(); // Remove the customer from the list.

            var html = '';

            var element = document.getElementById('spanCustomerList_' + this.options.parentElementIdSuffix);
            var customers = element.getElementsByClassName('divPeoplePicker_Participant');

            for (var i = 0; i < customers.length; i++) {
                html += customers[i].outerHTML + '&nbsp;'; // + '&nbsp;'; // This loop rebuilds the UI, so that we don't get extra spaces all over the place. Instead of using append() below, we use html() to replace all the html for the element.
            }

            //html += '                   &nbsp;';
            //html += '                   <span id="spanCustomer_' + selectedParticipantId + '_' + elementIdSuffix + '" title="' + selectedParticipantEmail + '" alt="' + selectedParticipantEmail + '" class="divPeoplePicker_Participant" bwfieldname="ParticipantFriendlyName" style="font-size:15pt;border:1px solid skyblue;background-color:lightgoldenrodyellow;cursor:help;">';
            //html += '                       <span id="txtProjectManagerName_' + elementIdSuffix + '">' + selectedParticipantFriendlyName + '</span>&nbsp;<span class="divPeoplePicker_Participant_Delete" style="color:red;display:inline-block;cursor:pointer !important;" ';
            //html += ' onclick="$(\'.bwPeoplePicker_EmailRecipients\').bwPeoplePicker_EmailRecipients(\'removeCustomer\', \'' + friendlyNameSourceField + '\', \'' + idSourceField + '\', \'' + emailSourceField + '\', \'' + selectedParticipantFriendlyName + '\', \'' + selectedParticipantId + '\', \'' + selectedParticipantEmail + '\');">X</span>&nbsp;';
            //html += '                       <input id="2txtProjectManagerName_' + elementIdSuffix + '" bwfieldname="ParticipantId" style="display:none;" />';
            //html += '                       <input id="txtProjectManagerId_' + elementIdSuffix + '" bwfieldname="ParticipantId" style="display:none;" />';
            //html += '                       <input id="txtProjectManagerEmail_' + elementIdSuffix + '" bwfieldname="ParticipantEmail" style="display:none;" />';
            //html += '                   </span>';
            ////html += '                   &nbsp;';

            $('#spanCustomerList_' + this.options.parentElementIdSuffix).html(html);
            //}

        } catch (e) {
            console.log('Exception in bwPeoplePicker_EmailRecipients.removeCustomer(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwPeoplePicker_EmailRecipients.removeCustomer(): ' + e.message + ', ' + e.stack);
        }
    },
    renderAndPopulatePeoplePicker: function () {
        try {
            console.log('In renderAndPopulatePeoplePicker().');
            var thiz = this;

            var html = '';

            html += '<div style="display:none;" id="PeoplePickerDialog_' + this.options.elementIdSuffix + '">';
            html += '        <table style="width:100%;">';
            html += '            <tr>';
            html += '                <td style="width:90%;">';
            html += '                    <span id="spanPeoplePickerDialogTitle_' + this.options.elementIdSuffix + '" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;font-weight:bold;"></span>';
            html += '                </td>';
            html += '                <td style="width:9%;"></td>';
            html += '                <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '                    <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 30pt;font-weight:bold;" onclick="$(\'#PeoplePickerDialog_' + this.options.elementIdSuffix + '\').dialog(\'close\');">X</span>';
            html += '                </td>';
            html += '            </tr>';
            html += '        </table>';
            //html += '        <br />';

            html += '        <input type="checkbox" checked disabled />&nbsp;Email recipients';
            html += '        <br />';
            html += '        <input type="checkbox" disabled />&nbsp;Customers/Vendors';
            html += '        <br />';
            html += '        <input type="checkbox" disabled />&nbsp;All members of this organization';
            html += '        <br />';

            html += '        <br />';
            html += '        <input id="txtPeoplePickerDialogSearchBox_' + this.options.elementIdSuffix + '" title="Type the first name and select from the list below..." style="WIDTH: 85%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;TEXT-ALIGN: left;" /><input id="txtPeoplePickerDialogParticipantId_' + this.options.elementIdSuffix + '" style="display:none;" /><input id="txtPeoplePickerDialogParticipantEmail_' + this.options.elementIdSuffix + '" style="display:none;" />';
            html += '        <img src="images/magnifying-glass.jpg" style="width:25px;height:25px;" />';
            html += '        <hr />';
            html += '        <span id="spanPeoplePickerParticipantsList_' + this.options.elementIdSuffix + '"></span>';
            html += '        <br /><br />';
            html += '        <div id="xxxx" class="divSignInButton" style="width:90%;text-align:center;line-height:0.8em;font-weight:bold;" onclick="$(\'#PeoplePickerDialog_' + this.options.elementIdSuffix + '\').dialog(\'close\');">';
            html += '            Close';
            html += '        </div>';
            html += '        <br />';
            html += '    </div>';


            html += '<table style="width:100%;">';
            html += '<tbody>';
            html += '   <tr>';
            html += '   <td>';
            html += '       <span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
            html += '           Recipients:';
            html += '       </span>';
            html == '       <br />';
            html += '   </td>';
            html += '</tr>';
            html += '   <tr class="xdTableOffsetRow xdTableOffsetRow" bwwidgetname="bwPeoplePicker_EmailRecipients">';
            //html += '       <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px">';
            //html += '           <span class="xdlabel" id="spanRequestForm_ManagerTitle" title="" alt="" style="cursor:help;" >';
            //html += '               Email recipients';
            //html += '           </span><span class="xdlabel">:</span>';
            //html += '       </td>';
            html += '       <td class="xdTableOffsetCellComponent" style="white-space:nowrap;text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px;">';
            html += '           <span class="bwRequestJsonxx" bwfieldname="bwPeoplePicker_EmailRecipients" bwdatatype="customer" bwdatarequired="true">';
            html += '               <span id="spanCustomerList_' + this.options.parentElementIdSuffix + '" style="border:1px solid gray;height:30px;padding:5px 5px 10px 5px;background-color:white;width:450px;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;"></span>';
            html += '               &nbsp;';

            // divEmailAttachmentsDialog_bwAttachments_e7e506db-0b20-406a-b1ca-9c9e3142aaee
            // 'divEmailAttachmentsDialog_bwAttachments_bwPeoplePicker_EmailRecipients_' + thiz.options.elementIdSuffix;


            debugger;
            //html += '               <img style="width:35px;height:35px;vertical-align:text-bottom;cursor:pointer;" onclick="$(\'.bwPeoplePicker_EmailRecipients\').bwPeoplePicker_EmailRecipients(\'displayPeoplePickerDialog\', \'txtProjectManagerName_' + this.options.bwBudgetRequestId + '_' + this.options.elementIdSuffix + '\', \'txtProjectManagerId_' + this.options.bwBudgetRequestId + '_' + this.options.elementIdSuffix + '\', \'txtProjectManagerEmail_' + this.options.bwBudgetRequestId + '_' + this.options.elementIdSuffix + '\', \'\', \'emailrecipient\', \'' + this.options.parentElementIdSuffix + '\');" src="images/addressbook-icon35x35.png" />';
            html += '               <img style="width:35px;height:35px;vertical-align:text-bottom;cursor:pointer;" onclick="$(\'#divEmailAttachmentsDialog_bwAttachments_bwPeoplePicker_EmailRecipients_' + this.options.parentElementIdSuffix + '\').bwPeoplePicker_EmailRecipients(\'displayPeoplePickerDialog\', \'txtProjectManagerName_' + this.options.bwBudgetRequestId + '_' + this.options.elementIdSuffix + '\', \'txtProjectManagerId_' + this.options.bwBudgetRequestId + '_' + this.options.elementIdSuffix + '\', \'txtProjectManagerEmail_' + this.options.bwBudgetRequestId + '_' + this.options.elementIdSuffix + '\', \'\', \'emailrecipient\', \'' + this.options.parentElementIdSuffix + '\');" src="images/addressbook-icon35x35.png" />';



            html += '&nbsp;&nbsp;';
            html += '<input style="padding:5px 10px 5px 10px;vertical-align:text-bottom;cursor:pointer;" onclick="$(\'.bwCircleDialog\').bwCircleDialog(\'displayAddANewEmailRecipientInACircle\', true, \'' + this.options.bwBudgetRequestId + '\');" type="button" value="Add a new recipient">';


            html += '           </span>';
            html += '       </td>';
            html += '   </tr>';
            html += '</tbody>';
            html += '</table>';

            // Render the html.
            this.element.html(html);

            // Now we can hook up the Participant text box for autocomplete.
            //$(formElement).find('#txtProjectManagerName_' + this.options.bwBudgetRequestId + '_' + this.options.elementIdSuffix).autocomplete({
            //    source: function (request, response) {
            //        $.ajax({
            //            url: thiz.options.operationUriPrefix + "_bw/workflow/" + workflowAppId + "/participants/" + request.term,
            //            dataType: "json",
            //            success: function (data) {
            //                try {
            //                    var searchArray = [];
            //                    for (var i = 0; i < data.participants.length; i++) {
            //                        searchArray[i] = data.participants[i].participant;
            //                    }
            //                    response(searchArray);
            //                } catch (e) {
            //                    console.log('Exception in bwPeoplePicker_EmailRecipients.renderAndPopulatePeoplePicker().autocomplete.source(): ' + e.message + ', ' + e.stack);
            //                }
            //            }
            //        });
            //    },
            //    minLength: 1, // minLength specifies how many characters have to be typed before this gets invoked.
            //    select: function (event, ui) {
            //        //log(ui.item ? "Selected: " + ui.item.label : "Nothing selected, input was " + this.value);
            //        //document.getElementById('btnSearch').disabled = false; // Enable the search button when there is valid content in it.
            //    },
            //    open: function () {
            //        //$(this).removeClass("ui-corner-all").addClass("ui-corner-top");
            //        //document.getElementById('btnSearch').disabled = true; // Disable the search button until there is valid content in it.
            //    },
            //    close: function () {
            //        try {
            //            //$(this).removeClass("ui-corner-top").addClass("ui-corner-all");
            //            var projectManagerName = this.value.split('|')[0];
            //            var projectManagerId = this.value.split('|')[1];
            //            var projectManagerEmail = this.value.split('|')[2];

            //            if (projectManagerName.indexOf('undefined') > -1) {
            //                document.getElementById('txtProjectManagerName_' + this.options.bwBudgetRequestId + '_' + thiz.options.elementIdSuffix).value = '';
            //                document.getElementById('txtProjectManagerId_' + this.options.bwBudgetRequestId + '_' + this.options.elementIdSuffix).value = '';
            //                document.getElementById('txtProjectManagerEmail_' + this.options.bwBudgetRequestId + '_' + this.options.elementIdSuffix).value = '';
            //            } else {
            //                document.getElementById('txtProjectManagerName_' + this.options.bwBudgetRequestId + '_' + thiz.options.elementIdSuffix).value = projectManagerName; //this.value.split(' ')[0] + ' ' + this.value.split(' ')[1]; // Just shows the Loan Number parameter (removing the borrower name) so it fits in the text box.
            //                document.getElementById('txtProjectManagerId_' + this.options.bwBudgetRequestId + '_' + this.options.elementIdSuffix).value = projectManagerId;
            //                document.getElementById('txtProjectManagerEmail_' + this.options.bwBudgetRequestId + '_' + this.options.elementIdSuffix).value = projectManagerEmail;
            //            }
            //        } catch (e) {
            //            console.log('Exception in bwPeoplePicker_EmailRecipients.renderAndPopulatePeoplePicker().autocomplete.close(): ' + e.message + ', ' + e.stack);
            //        }
            //    }
            //});

            // If we have jsonData, populate the element.
            //if (this.options.jsonData != null) {
            //    console.log('In bwPeoplePicker_EmailRecipients.renderAndPopulatePeoplePicker(). WE HAVE JSON DATA!!!!');

            //    debugger;
            //    var dataElement = $(this.element).find('.bwRequestJsonxx')[0];
            //    var bwFieldName = dataElement.getAttribute('bwfieldname');

            //    if (!(this.options.jsonData[bwFieldName] && this.options.jsonData[bwFieldName].value)) {

            //        //console.log('There is no json data to display.');

            //    } else {
            //        var customers = JSON.parse(this.options.jsonData[bwFieldName].value);

            //        var elementIdSuffix = this.options.elementIdSuffix;
            //        var bwBudgetRequestId = this.options.bwBudgetRequestId;

            //        var html = '';

            //        //var element = document.getElementById('spanCustomerList_' + bwBudgetRequestId + '_' + elementIdSuffix); // spanCustomerList_8a78b500-298f-4f09-ad95-f2ee80ed83a1_3a9dbbb6-f426-4a6d-8395-1d615f9ce43a
            //        //debugger;
            //        //var customers = element.getElementsByClassName('divPeoplePicker_Participant');

            //        for (var i = 0; i < customers.length; i++) {
            //            //    html += customers[i].outerHTML + '&nbsp;'; // + '&nbsp;'; // This loop rebuilds the UI, so that we don't get extra spaces all over the place. Instead of using append() below, we use html() to replace all the html for the element.
            //            //}
            //            debugger;
            //            var selectedParticipantId = customers[i].ParticipantId;
            //            var selectedParticipantEmail = customers[i].ParticipantEmail;
            //            var selectedParticipantFriendlyName = customers[i].ParticipantFriendlyName;

            //            var friendlyNameSourceField = 'txtProjectManagerName_' + this.options.bwBudgetRequestId + '_' + this.options.elementIdSuffix;
            //            var idSourceField = 'txtProjectManagerId_' + this.options.bwBudgetRequestId + '_' + this.options.elementIdSuffix;
            //            var emailSourceField = 'txtProjectManagerEmail_' + this.options.bwBudgetRequestId + '_' + this.options.elementIdSuffix;

            //            html += '                   <span onclick="alert(\'xcx3425hdjh-1\');" id="spanCustomer_' + bwBudgetRequestId + '_' + selectedParticipantId + '_' + elementIdSuffix + '" title="' + selectedParticipantEmail + '" alt="' + selectedParticipantEmail + '" class="divPeoplePicker_Participant" bwfieldname="ParticipantFriendlyName" style="font-size:15pt;border:1px solid skyblue;background-color:lightgoldenrodyellow;cursor:help;">';

            //            // Delete/X
            //            html += '                       <span class="bwParticipantFriendlyName" id="txtProjectManagerName_' + bwBudgetRequestId + '_' + selectedParticipantId + '_' + elementIdSuffix + '">' + selectedParticipantFriendlyName + '</span>&nbsp;<span class="divPeoplePicker_Participant_Delete" style="color:red;display:inline-block;cursor:pointer !important;" ';
            //            html += '                           onclick="$(\'.bwPeoplePicker_EmailRecipients\').bwPeoplePicker_EmailRecipients(\'removeCustomer\', \'' + friendlyNameSourceField + '\', \'' + idSourceField + '\', \'' + emailSourceField + '\', \'' + selectedParticipantFriendlyName + '\', \'' + selectedParticipantId + '\', \'' + selectedParticipantEmail + '\', \'' + bwBudgetRequestId + '\');">X</span>&nbsp;';

            //            html += '                       <input class="bwParticipantId" id="txtProjectManagerId_' + bwBudgetRequestId + '_' + selectedParticipantId + '_' + elementIdSuffix + '" bwfieldname="ParticipantId" style="display:none;" value="' + selectedParticipantId + '" />';
            //            html += '                       <input class="bwParticipantEmail" id="txtProjectManagerEmail_' + bwBudgetRequestId + '_' + selectedParticipantId + '_' + elementIdSuffix + '" bwfieldname="ParticipantEmail" style="display:none;" value="' + selectedParticipantEmail + '" />';
            //            html += '                   </span>';
            //            html += '&nbsp;';
            //        }

            //        $('#spanCustomerList_' + bwBudgetRequestId + '_' + elementIdSuffix).html(html);

            //    }
            //}
            //}

        } catch (e) {
            console.log('Exception in renderAndPopulatePeoplePicker: ' + e.message + ', ' + e.stack);
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwPeoplePicker_EmailRecipients</span>';
            html += '<br />';
            html += '<span style="">Exception in bwPeoplePicker_EmailRecipients.renderAndPopulatePeoplePicker(): ' + e.message + ', ' + e.stack + '</span>';
            thiz.element.html(html);
        }
    },

    renderAndPopulatePeoplePicker_ReadOnly: function () {
        try {
            console.log('In renderAndPopulatePeoplePicker_ReadOnly().');
            var thiz = this;

            var html = '';
            html += '<table style="width:100%;">';
            html += '<tbody>';
            html += '   <tr class="xdTableOffsetRow xdTableOffsetRow-editor" id="toolboxdraggablerow_2" draggable="true" bwwidgetname="bwPeoplePicker_EmailRecipients">';
            html += '       <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px">';
            html += '           <span class="xdlabel" id="spanRequestForm_ManagerTitle">';
            html += '               Email recipients';
            html += '           </span><span class="xdlabel">:</span>';
            if (this.options.inFormsEditor == true) {
                html += '                               <span class="ToggleRequiredAsterisk" title="Select this asterick to make this a required field." onclick="$(\'.bwFormsEditor\').bwFormsEditor(\'toggleFormRequiredField\', this);">*</span>';
            } else if (this.options.renderAsARequiredField == true) {
                html += '                               <span style="color:red;font-size:medium;">*</span>';
            } else if (this.options.renderAsARequiredField == false) {
                //
            }
            html += '       </td>';
            html += '       <td class="xdTableOffsetCellComponent" style="white-space:nowrap;text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px;">';
            html += '           <span class="bwRequestJsonxx" bwfieldname="bwPeoplePicker_EmailRecipients" bwdatatype="Participant" bwdatarequired="true">';
            html += '           <span id="spanCustomerList_' + this.options.bwBudgetRequestId + '_' + this.options.elementIdSuffix + '" style="border:1px solid gray;height:30px;padding:5px 5px 10px 5px;background-color:white;width:450px;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;"></span>';
            //html += '               &nbsp;';
            //html += '               <img style="width:35px;height:35px;vertical-align:text-bottom;cursor:pointer;" onclick="$(\'.bwRequest\').bwRequest(\'displayPeoplePickerDialog\', \'txtProjectManagerName_' + this.options.bwBudgetRequestId + '_' + this.options.elementIdSuffix + '\', \'txtProjectManagerId_' + this.options.bwBudgetRequestId + '_' + this.options.elementIdSuffix + '\', \'txtProjectManagerEmail_' + this.options.bwBudgetRequestId + '_' + this.options.elementIdSuffix + '\', \'\', \'customer\');" src="images/addressbook-icon35x35.png">';
            html += '           </span>';
            html += '       </td>';
            html += '   </tr>';
            html += '</tbody>';
            html += '</table>';

            // Render the html.
            if (this.options.inFormsEditor != true) {
                // THIS IS VERY IMPORTANT AND NEEDS TO BE IN EVERY WIDGET!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 7-12-2020
                // Even though the widget regenerates itself (re-renders), the parent TR tag gets missed!!! Therefore we have to handle getting rid of our form editor draggable attribute here.
                this.element.closest('tr').removeAttr('draggable');
            }
            this.element.html(html);

            // If we have jsonData, populate the element.
            if (this.options.jsonData != null) {
                console.log('In bwPeoplePicker_EmailRecipients.renderAndPopulatePeoplePicker_ReadOnly(). WE HAVE JSON DATA!!!!');

                

                debugger;
                //var dataElement = $(this.element).find('.bwRequestJsonxx')[0];
                //var bwFieldName = dataElement.getAttribute('bwfieldname');
                var dataElement = $(this.element).find('.bwRequestJson:first');
                var bwFieldName = $(dataElement).attr('bwfieldname');

                if (!(this.options.jsonData[bwFieldName] && this.options.jsonData[bwFieldName].value)) {

                    //console.log('There is no json data to display.');

                } else {
                    var customers = JSON.parse(this.options.jsonData[bwFieldName].value);

                    var elementIdSuffix = this.options.elementIdSuffix;
                    var bwBudgetRequestId = this.options.bwBudgetRequestId;

                    var html = '';

                    for (var i = 0; i < customers.length; i++) {
                        var selectedParticipantId = customers[i].ParticipantId;
                        var selectedParticipantEmail = customers[i].ParticipantEmail;
                        var selectedParticipantFriendlyName = customers[i].ParticipantFriendlyName;

                        var friendlyNameSourceField = 'txtProjectManagerName_' + this.options.bwBudgetRequestId + '_' + this.options.elementIdSuffix;
                        var idSourceField = 'txtProjectManagerId_' + this.options.bwBudgetRequestId + '_' + this.options.elementIdSuffix;
                        var emailSourceField = 'txtProjectManagerEmail_' + this.options.bwBudgetRequestId + '_' + this.options.elementIdSuffix;

                        html += '                   <span onclick="alert(\'xcx3425hdjh-2\');" id="spanCustomer_' + bwBudgetRequestId + '_' + selectedParticipantId + '_' + elementIdSuffix + '" title="' + selectedParticipantEmail + '" alt="' + selectedParticipantEmail + '" class="divPeoplePicker_Participant" bwfieldname="ParticipantFriendlyName" style="font-size:15pt;border:1px solid skyblue;background-color:lightgoldenrodyellow;cursor:help;">';


                        html += '                       <span class="bwParticipantFriendlyName" id="txtProjectManagerName_' + bwBudgetRequestId + '_' + selectedParticipantId + '_' + elementIdSuffix + '">' + selectedParticipantFriendlyName + '</span>&nbsp;';

                        html += '                       <input class="bwParticipantId" id="txtProjectManagerId_' + bwBudgetRequestId + '_' + selectedParticipantId + '_' + elementIdSuffix + '" bwfieldname="ParticipantId" style="display:none;" value="' + selectedParticipantId + '" />';
                        html += '                       <input class="bwParticipantEmail" id="txtProjectManagerEmail_' + bwBudgetRequestId + '_' + selectedParticipantId + '_' + elementIdSuffix + '" bwfieldname="ParticipantEmail" style="display:none;" value="' + selectedParticipantEmail + '" />';
                        html += '                   </span>';
                        html += '&nbsp;';
                    }

                    $('#spanCustomerList_' + bwBudgetRequestId + '_' + elementIdSuffix).html(html);

                }
            }


        } catch (e) {
            console.log('Exception in renderAndPopulatePeoplePicker_ReadOnly: ' + e.message + ', ' + e.stack);
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwPeoplePicker_EmailRecipients</span>';
            html += '<br />';
            html += '<span style="">Exception in bwPeoplePicker_EmailRecipients.renderAndPopulatePeoplePicker_ReadOnly(): ' + e.message + ', ' + e.stack + '</span>';
            thiz.element.html(html);
        }
    }



});