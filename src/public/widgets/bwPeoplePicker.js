$.widget("bw.bwPeoplePicker", {
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
        This is the bwPeoplePicker.js jQuery Widget. 
        ===========================================================

            [more to follow]
                          
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

            [put your stuff here]

        ===========================================================
       
        */

        fieldTitle: 'Select email Recipient(s)', // This is the title, which shows up on the form in the left column.

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
        ajaxTimeout: 30000,
        autoSenseDeviceType: false // Automatic UI based on device type. Alpha version so far.
    },
    _create: function () {
        this.element.addClass("bwPeoplePicker");
        var thiz = this; // Need this because of the asynchronous operations below.
        try {
            if (this.options.operationUriPrefix == null) {
                // This formulates the operationUri, which is used throughout.
                if (window.location.href.indexOf('https://') > -1) {
                    var url1 = window.location.href.split('https://')[1];
                    var url2 = url1.split('/')[0];
                    this.options.operationUriPrefix = 'https://' + url2 + '/';
                } else {
                    var url1 = window.location.href.split('http://')[1];
                    var url2 = url1.split('/')[0];
                    this.options.operationUriPrefix = 'http://' + url2 + '/';
                }
            }

            //if (this.options.inFormsEditor == true) {
            //    //this.options.store = {}; // Need to provide this because if it tries to hit the database and poopulate, it won't render in time to be used in the toolbox!!!! 6-28-2020
            //    this.renderAndPopulatePeoplePicker_ReadOnly(); // Need to render, not allowing the user to make modifications.
            //} else if (this.options.allowRequestModifications == false) {
            //    this.renderAndPopulatePeoplePicker_ReadOnly(); // Need to render, not allowing the user to make modifications.
            //} else if (this.options.allowRequestModifications == true) {
            this.renderAndPopulatePeoplePicker();
            //} else {
            //    var html = '';
            //    html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwPeoplePicker</span>';
            //    html += '<br />';
            //    html += '<span style="">Invalid value for allowRequestModifications: ' + this.options.allowRequestModifications + '</span>';
            //    this.element.html(html);
            //}

            console.log('In bwPeoplePicker._create(). The widget has been initialized.');

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwPeoplePicker</span>';
            html += '<br />';
            html += '<span style="">Exception in bwPeoplePicker.Create(): ' + e.message + ', ' + e.stack + '</span>';
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
            .removeClass("bwPeoplePicker")
            .text("");
    },
    getData: function () {
        try {
            console.log('In bwPeoplePicker.getData().');
            //debugger;
            //Come back and build out the JSON for this!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 7-27-2020
            var value = $(this.element).find('#txtProjectManagerName')[0].value;
            return value;
        } catch (e) {
            console.log('Exception in bwPeoplePicker.getData(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwPeoplePicker.getData(): ' + e.message + ', ' + e.stack);
        }
    },
    isARequiredField: function () {
        try {
            console.log('In bwPeoplePicker.isARequiredField().');
            return this.options.renderAsARequiredField;
        } catch (e) {
            console.log('Exception in bwPeoplePicker.isARequiredField(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwPeoplePicker.isARequiredField(): ' + e.message + ', ' + e.stack);
        }
    },
    getfieldTitle: function () {
        try {
            console.log('In bwPeoplePicker.getfieldTitle().');
            return this.options.fieldTitle;
        } catch (e) {
            console.log('Exception in bwPeoplePicker.getfieldTitle(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwPeoplePicker.getfieldTitle(): ' + e.message + ', ' + e.stack);
        }
    },
    renderAndPopulatePeoplePicker: function () {
        try {
            console.log('In bwPeoplePicker.js.renderAndPopulatePeoplePicker().');
            alert('In bwPeoplePicker.js.renderAndPopulatePeoplePicker().');
            var thiz = this;

            var html = '';

            html += '<div style="display:none;" id="PeoplePickerDialog">';
            html += '    <br />';
            //html += '    <br />';
            html += '                <span id="spanPeoplePickerDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 25pt;font-weight:bold;"></span>';
            html += '                <br />';
            html += '                <span id="spanPeoplePickerDialogTitle2" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 10pt;font-weight:bold;"></span>';
            html += '    <br />';
            html += '    <br />';
            html += '    <br />';
            html += '     <input autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" id="txtPeoplePickerDialogSearchBox" title="Type the first name and select from the list below..." style="WIDTH: 85%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;TEXT-ALIGN: left;" /><input id="txtPeoplePickerDialogParticipantId" style="display:none;" /><input id="txtPeoplePickerDialogParticipantEmail" style="display:none;" />';
            html += '    <hr />';
            html += '    <span id="spanPeoplePickerParticipantsList"></span>';
            html += '    <br /><br />';
            html += '    <div id="xxxx" class="divSignInButton" style="width:90%;text-align:center;line-height:0.8em;font-weight:bold;" onclick="$(\'#PeoplePickerDialog\').dialog(\'close\');">';
            html += '        <input class="button-blue" type="button" value="Close" />';
            html += '    </div>';
            html += '    <br />';
            html += '</div>';

            html += '                                <span class="xdlabel" id="spanRequestForm_ManagerTitle">';
            html += this.options.fieldTitle;
            html += '                                :</span><span class="xdlabel"></span>';
            html += '                                <span class="bwRequestJson" bwfieldname="ProjectManager" bwdatatype="Participant" bwdatarequired="true">';
            html += '                                    <input id="txtEmailAddresses" bwfieldname="txtEmailAddresses" title="Type the first name. This is the person who does the initial approval." class="ui-autocomplete-input" style="WIDTH: 1000px;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 15pt;TEXT-ALIGN: left;" autocomplete="off">';
            html += '                                    <input id="txtProjectManagerId" bwfieldname="ParticipantId" style="display:none;">';
            html += '                                    <input id="txtProjectManagerEmail" bwfieldname="ParticipantEmail" style="display:none;">';
            html += '                                </span>';
            html += '                                <img style="width:35px;height:35px;vertical-align:text-bottom;cursor:pointer;" onclick="$(\'.bwPeoplePicker\').bwPeoplePicker(\'displayPeoplePickerDialog\', \'txtEmailAddresses\', \'txtProjectManagerId\', \'txtProjectManagerEmail\');" src="/Images/addressbook-icon35x35.png">';

            this.element.html(html);

            alert('xcx231423. Dev: Change this web service call.');

            // Now we can hook up the Participant text box for autocomplete.
            $("#txtProjectManagerName").autocomplete({
                source: function (request, response) {
                    debugger;
                    $.ajax({
                        url: thiz.options.operationUriPrefix + "xcx344234 '" + request.term + "')",
                        dataType: "json",
                        success: function (data) {
                            try {
                                var searchArray = [];
                                var searchArrayIndex = 0;
                                for (var i = 0; i < data.value.length; i++) {
                                    try {
                                        if (data.value[i].DOCTYPE && data.value[i].METHOD && data.value[i].DOCTYPE == 'COM' && data.value[i].METHOD == 'E') {
                                            searchArray[searchArrayIndex] = data.value[i].CUINET;
                                            searchArrayIndex += 1;
                                        }
                                    } catch (e) {
                                        // do nothing
                                    }
                                }
                                response(searchArray);
                            } catch (e) {
                                console.log('Exception in bwPeoplePicker.renderAndPopulatePeoplePicker().autocomplete.source(): ' + e.message + ', ' + e.stack);
                            }
                        }
                    });
                },
                minLength: 1, // minLength specifies how many characters have to be typed before this gets invoked.
                select: function (event, ui) {
                    debugger;
                    //log(ui.item ? "Selected: " + ui.item.label : "Nothing selected, input was " + this.value);
                    //document.getElementById('btnSearch').disabled = false; // Enable the search button when there is valid content in it.
                },
                open: function () {
                    debugger;
                    //$(this).removeClass("ui-corner-all").addClass("ui-corner-top");
                    //document.getElementById('btnSearch').disabled = true; // Disable the search button until there is valid content in it.
                },
                close: function () {
                    debugger;
                    try {
                        //$(this).removeClass("ui-corner-top").addClass("ui-corner-all");
                        var projectManagerName = this.value.split('|')[0];
                        var projectManagerId = this.value.split('|')[1];
                        var projectManagerEmail = this.value.split('|')[2];

                        if (projectManagerName.indexOf('undefined') > -1) {
                            document.getElementById('txtProjectManagerName').value = '';
                            document.getElementById('txtProjectManagerId').value = '';
                            document.getElementById('txtProjectManagerEmail').value = '';
                        } else {
                            document.getElementById('txtProjectManagerName').value = projectManagerName; //this.value.split(' ')[0] + ' ' + this.value.split(' ')[1]; // Just shows the Loan Number parameter (removing the borrower name) so it fits in the text box.
                            document.getElementById('txtProjectManagerId').value = projectManagerId;
                            document.getElementById('txtProjectManagerEmail').value = projectManagerEmail;
                        }
                    } catch (e) {
                        console.log('Exception in bwPeoplePicker.renderAndPopulatePeoplePicker().autocomplete.close(): ' + e.message + ', ' + e.stack);
                    }
                }
            });

            // If we have jsonData, populate the element.
            if (this.options.jsonData != null) {

                

                //var dataElement = $(this.element).find('.bwRequestJson')[0];
                //var bwFieldName = dataElement.getAttribute('bwfieldname');
                var dataElement = $(this.element).find('.bwRequestJson:first');
                var bwFieldName = $(dataElement).attr('bwfieldname');

                //debugger;
                var Participant = this.options.jsonData[bwFieldName];
                var ParticipantFriendlyName = Participant.ParticipantFriendlyName; //this.options.jsonData[bwFieldName].value;
                var ParticipantId = Participant.ParticipantId; //this.options.jsonData[bwFieldName].value;
                var ParticipantEmail = Participant.ParticipantEmail; //this.options.jsonData[bwFieldName].value;

                var ParticipantFriendlyNameField = $(dataElement).find('#txtProjectManagerName')[0];
                var ParticipantIdField = $(dataElement).find('#txtProjectManagerId')[0];
                var ParticipantEmailField = $(dataElement).find('#txtProjectManagerEmail')[0];

                ParticipantFriendlyNameField.value = ParticipantFriendlyName;
                ParticipantIdField.value = ParticipantId;
                ParticipantEmailField.value = ParticipantEmail;
            }


        } catch (e) {
            console.log('Exception in renderAndPopulatePeoplePicker: ' + e.message + ', ' + e.stack);
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwPeoplePicker</span>';
            html += '<br />';
            html += '<span style="">Exception in bwPeoplePicker.renderAndPopulatePeoplePicker(): ' + e.message + ', ' + e.stack + '</span>';
            thiz.element.html(html);
        }
    },

    displayPeoplePickerDialog: function (friendlyNameSourceField, idSourceField, emailSourceField, buttonToEnable) {
        try {
            console.log('In bwPeoplePicker.js.displayPeoplePickerDialog().');
            var thiz = this;

            $('#PeoplePickerDialog').dialog({
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
                        $("#PeoplePickerDialog").dialog('close');
                    });
                } // This allows the dialog to close when clicked outside of the dialog. Only works for modal dialogs.
            });
            //$("#PeoplePickerDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

            $('#spanPeoplePickerDialogTitle').html('Additional email recipients...');
            $('#spanPeoplePickerDialogTitle2').html('Type the first few characters, then select the recipient from the list.');

         
            $('#txtPeoplePickerDialogSearchBox').val(''); //.empty(); // Clear the search text box.
            $('#spanPeoplePickerParticipantsList').empty();

            // Now we can hook up the Participant text box for autocomplete.
            $("#txtPeoplePickerDialogSearchBox").autocomplete({
                source: function (request, response) {
                    if (request.term == '') {
                        //thiz.renderAllParticipantsInThePeoplePicker(); // Nothing is in the search box, so show all participants.
                    } else {
                        $.ajax({
                            url: thiz.options.operationUriPrefix + "odata/xcx756886 '" + request.term + "')",
                            dataType: "json",
                            success: function (data) {
                                $('#spanPeoplePickerParticipantsList').empty();
                                var html = '';
                                if (data.value.length > 0) {
                                    //var searchArray = [];
                                    for (var i = 0; i < data.value.length; i++) {
                                        //searchArray[i] = data.participants[i].participant;
                                        //var strParticipant = '<a href="">' + data.participants[i].participant.split('|')[0] + ' <i>(' + data.participants[i].participant.split('|')[2] + ')</i></a>';
                                        //debugger; // do we ever get here?
                                        html += '<a href="javascript:$(\'.bwPeoplePicker\').bwPeoplePicker(\'cmdReturnParticipantIdToField\', \'' + friendlyNameSourceField + '\', \'' + idSourceField + '\', \'' + emailSourceField + '\', \'' + data.value[i].CUINET + '\', \'' + data.value[i].CUINET + '\', \'' + data.value[i].CUINET + '\', \'' + buttonToEnable + '\');">' + data.value[i].CUINET + '&nbsp;&nbsp;<i>(' + data.value[i].CUINET + ')</i></a>';


                                        //html += strParticipant; //data.participants[i].participant;
                                        html += '<br />';
                                        //response(searchArray);
                                    }
                                } else {
                                    // There were no results.
                                    html += '<span><i>There were no results</i></span>';
                                }
                                $('#spanPeoplePickerParticipantsList').append(html);
                            }
                        });
                    }
                },
                minLength: 3, // minLength specifies how many characters have to be typed before this gets invoked.
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
                        document.getElementById('txtPeoplePickerDialogSearchBox').value = '';
                        document.getElementById('txtPeoplePickerDialogParticipantId').value = '';
                        document.getElementById('txtPeoplePickerDialogParticipantEmail').value = '';
                    } else {
                        document.getElementById('txtPeoplePickerDialogSearchBox').value = peoplePickerParticipantName; //this.value.split(' ')[0] + ' ' + this.value.split(' ')[1]; // Just shows the Loan Number parameter (removing the borrower name) so it fits in the text box.
                        document.getElementById('txtPeoplePickerDialogParticipantId').value = peoplePickerParticipantId;
                        document.getElementById('txtPeoplePickerDialogParticipantEmail').value = peoplePickerParticipantEmail;
                    }
                }
            });

            // List all participants.
            //this.renderAllParticipantsInThePeoplePicker(friendlyNameSourceField, idSourceField, emailSourceField, buttonToEnable); // We do this the first time to make sure they are all displayed.
        } catch (e) {
            console.log('Exception in displayPeoplePickerDialog: ' + e.message + ', ' + e.stack);
        }
    },

    renderAllParticipantsInThePeoplePicker: function (friendlyNameSourceField, idSourceField, emailSourceField, buttonToEnable) {
        try {
            var thiz = this;
            $('#spanPeoplePickerParticipantsList').empty();
            var data = {
                //"bwWorkflowId": workflowAppId
            };
            $.ajax({
                // url: thiz.options.operationUriPrefix + "/workflow/participants",
                url: thiz.options.operationUriPrefix + "odata/xcx4534654", ///" + request.term,
                type: "GET",
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: function (data1) {
                    debugger;
                    var data = data1.value; //.BwWorkflowUsers;
                    var html = '';
                    for (var i = 0; i < data.length; i++) {
                        html += '<a href="javascript:$(\'.bwPeoplePicker\').bwPeoplePicker(\'cmdReturnParticipantIdToField\', \'' + friendlyNameSourceField + '\', \'' + idSourceField + '\', \'' + emailSourceField + '\', \'' + data[i].CUINET + '\', \'' + data[i].CUCUSN + '\', \'' + data[i].CUINET + '\', \'' + buttonToEnable + '\');">' + data[i].CUINET + '&nbsp;&nbsp;<i>(' + data[i].CUINET + ')</i></a>';
                        html += '<br />';
                    }


                    $('#spanPeoplePickerParticipantsList').append(html);
                },
                error: function (data, errorCode, errorMessage) {
                    thiz.displayAlertDialog('Error in my.js.renderAllParticipantsInThePeoplePicker():' + errorCode + ', ' + errorMessage);
                }
            });
        } catch (e) {
            console.log('Exception in renderAllParticipantsInThePeoplePicker(): ' + e.message + ', ' + e.stack);
        }
    },

    cmdReturnParticipantIdToField: function (friendlyNameSourceField, idSourceField, emailSourceField, selectedParticipantFriendlyName, selectedParticipantId, selectedParticipantEmail, buttonToEnable) {
        try {
            console.log('In cmdReturnParticipantIdToField().');
            // The people picker calls this and 
            //displayAlertDialog('You selected participant ' + selectedParticipantFriendlyName + ' to go in friendly name field ' + friendlyNameSourceField + '.\n\nThis functionality is incomplete. Coming soon!');

            $('#txtPeoplePickerDialogSearchBox').empty(); // Clear the search text box.

            // This just makes sure the semicolon gets placed correctly.
            var emailAddresses = document.getElementById(friendlyNameSourceField).value;
            if (emailAddresses.trim().length > 0) {
                var emailTmp = emailAddresses.trim();
                var startIndex = emailTmp.length - 1;
                var endIndex = emailTmp.length;
                if (emailAddresses.substring(startIndex, endIndex) != ';') {
                    emailAddresses = emailTmp + '; ';
                    document.getElementById(friendlyNameSourceField).value = emailAddresses;
                }
            }
            document.getElementById(friendlyNameSourceField).value += selectedParticipantFriendlyName + '; ';
            document.getElementById(friendlyNameSourceField).setAttribute('title', selectedParticipantEmail);
            document.getElementById(idSourceField).value = selectedParticipantId;
            document.getElementById(emailSourceField).value = selectedParticipantEmail;
            //debugger;
            //this.options.store.ProjectManager = {
            //    Person: {
            //        AccountId: selectedParticipantId,
            //        FriendlyName: selectedParticipantFriendlyName,
            //        Email: selectedParticipantEmail,
            //        AccountType: null
            //    }
            //}

            // This enables the save button that may be next to the text box.
            if (buttonToEnable && buttonToEnable != 'undefined') document.getElementById(buttonToEnable).disabled = false;

            $('#PeoplePickerDialog').dialog('close');

            // The following doesn't work for some reason.
            //$('#' + friendlyNameSourceField).blur(); // Removes the focus from the field so that the user can't type in it.
            //document.getElementById(friendlyNameSourceField).blur();
        } catch (e) {
            console.log('Exception in cmdReturnParticipantIdToField(): ' + e.message + ', ' + e.stack);
        }
    },


    displayAlertDialog: function (errorMessage) {
        try {
            //document.getElementById('spanErrorMessage').innerHTML = errorMessage;
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

                    var element2 = $(this).find('#spanErrorMessage')[0]; //
                    element2.innerHTML = errorMessage;
                },
                close: function () {
                    //$(this).dialog('destroy').remove();
                }
            });
            $("#divAlertDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
        } catch (e) {
            console.log('Exception in WorkflowEditor.js.displayAlertDialog(): ' + e.message + ', ' + e.stack);
        }
    },










    renderAndPopulatePeoplePicker_ReadOnly: function () {
        try {
            //debugger;
            console.log('In renderAndPopulatePeoplePicker_ReadOnly().');
            var thiz = this;
            var html = '';
            html += '<table style="width:100%;">';
            html += '                        <tbody><tr class="xdTableOffsetRow xdTableOffsetRow-editor" id="toolboxdraggablerow_2" draggable="true" bwwidgetname="bwPeoplePicker">';
            html += '                            <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px">';
            html += '                                <span class="xdlabel" id="spanRequestForm_ManagerTitle">';
            //html += '                                    [spanRequestForm_ManagerTitle]';
            html += this.options.fieldTitle; //newBudgetRequestManagerTitle;
            html += '                                </span><span class="xdlabel">:</span>';
            //html += '                                <span style="color:red;font-size:medium;">*</span>';

            if (this.options.inFormsEditor == true) {
                html += '                               <span class="ToggleRequiredAsterisk" title="Select this asterick to make this a required field." onclick="$(\'.bwFormsEditor\').bwFormsEditor(\'toggleFormRequiredField\', this);">*</span>';
            } else if (this.options.renderAsARequiredField == true) {
                html += '                               <span style="color:red;font-size:medium;">*</span>';
            } else if (this.options.renderAsARequiredField == false) {
                //
            }



            html += '                            </td>';
            html += '                            <td class="xdTableOffsetCellComponent" style="white-space:nowrap;text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px;">';
            html += '                                <span class="bwRequestJson" bwfieldname="ProjectManager" bwdatatype="Participant" bwdatarequired="true">';
            html += '                                    <input id="txtProjectManagerName" contentEditable="false" disabled bwfieldname="ParticipantFriendlyName" title="Type the first name. This is the person who does the initial approval." class="ui-autocomplete-input" style="WIDTH: 85%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;TEXT-ALIGN: left;" autocomplete="off">';
            html += '                                    <input id="txtProjectManagerId" bwfieldname="ParticipantId" style="display:none;">';
            html += '                                    <input id="txtProjectManagerEmail" bwfieldname="ParticipantEmail" style="display:none;">';
            html += '                                </span>';
            //html += '                                <img style="width:35px;height:35px;vertical-align:text-bottom;cursor:pointer;" onclick="$(\'.bwRequest\').bwRequest(\'displayPeoplePickerDialog\', \'txtProjectManagerName\', \'txtProjectManagerId\', \'txtProjectManagerEmail\');" src="images/addressbook-icon35x35.png">';
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

            //debugger;
            //var formElement = this.element.closest("#budgetrequestform");


            // If we have jsonData, populate the element.
            if (this.options.jsonData != null) {

                

                //var dataElement = $(this.element).find('.bwRequestJson')[0];
                //var bwFieldName = dataElement.getAttribute('bwfieldname');
                var dataElement = $(this.element).find('.bwRequestJson:first');
                var bwFieldName = $(dataElement).attr('bwfieldname');

                //debugger;
                var Participant = this.options.jsonData[bwFieldName];
                var ParticipantFriendlyName = Participant.ParticipantFriendlyName; //this.options.jsonData[bwFieldName].value;
                var ParticipantId = Participant.ParticipantId; //this.options.jsonData[bwFieldName].value;
                var ParticipantEmail = Participant.ParticipantEmail; //this.options.jsonData[bwFieldName].value;

                var ParticipantFriendlyNameField = $(dataElement).find('#txtProjectManagerName')[0];
                var ParticipantIdField = $(dataElement).find('#txtProjectManagerId')[0];
                var ParticipantEmailField = $(dataElement).find('#txtProjectManagerEmail')[0];

                ParticipantFriendlyNameField.value = ParticipantFriendlyName;
                ParticipantIdField.value = ParticipantId;
                ParticipantEmailField.value = ParticipantEmail;
            }


        } catch (e) {
            console.log('Exception in renderAndPopulatePeoplePicker_ReadOnly: ' + e.message + ', ' + e.stack);
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwPeoplePicker</span>';
            html += '<br />';
            html += '<span style="">Exception in bwPeoplePicker.renderAndPopulatePeoplePicker_ReadOnly(): ' + e.message + ', ' + e.stack + '</span>';
            thiz.element.html(html);
        }
    }



});