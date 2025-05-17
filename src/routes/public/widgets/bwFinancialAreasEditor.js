$.widget("bw.bwFinancialAreasEditor", {
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
        This is the bwFinancialAreasEditor.js jQuery Widget. 
        ===========================================================

           [more to follow]
                           
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

           [put your stuff here]

        ===========================================================
        
       */

        operationUriPrefix: null,
        ajaxTimeout: 15000,

        financialAreas: null,

        autoSenseDeviceType: false // Automatic UI based on device type. Alpha version so far.
    },
    _create: function (assignmentRowChanged_ElementId) {
        this.element.addClass("bwFinancialAreasEditor");
        var thiz = this; // Need this because of the asynchronous operations below.

        try {

            //thiz.generateFunctionalAreasListButtons();

            selfDiscoverOperationUri(thiz); // This sets this.options.operationUriPrefix correctly.

            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

            //// 
            //// Load this object first so we don't have to keep making web service calls.
            ////
            //if (this.options.requestTypes != null) {
            //    this.renderRequestTypeEditor();
            //} else {

            var data = {
                bwParticipantId_LoggedIn: participantId,
                bwActiveStateIdentifier: activeStateIdentifier,
                bwWorkflowAppId_LoggedIn: workflowAppId,

                bwWorkflowAppId: workflowAppId
            }
            var operationUri = this.options.operationUriPrefix + "_bw/FinancialAreas";
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

                            var html = '';
                            html += '<span style="font-size:24pt;color:red;">bwFinancialAreasEditor: CANNOT RENDER</span>';
                            html += '<br />';
                            html += '<span style="">Error in bwFinancialAreasEditor.Create(): ' + results.message + '</span>';
                            thiz.element.html(html);

                        } else {

                            thiz.options.financialAreas = results.FinancialAreas;
                            //thiz.renderFinancialAreasEditor();
                            thiz.generateFunctionalAreasListButtons();

                        }
                    } catch (e) {
                        console.log('Exception in bwFinancialAreasEditor._create().xx.Get:1: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwFinancialAreasEditor._create().xx.Get:1: ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {

                    debugger;
                    console.log('In bwFinancialAreasEditor._create.RequestTypes.error(): ' + JSON.stringify(data));
                    var msg;
                    if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                        msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                    } else {
                        msg = JSON.stringify(data);
                    }
                    alert('Exception in bwFinancialAreasEditor._create().xx.Get:2: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                    console.log('Exception in bwFinancialAreasEditor._create().xx.Get:2: ' + JSON.stringify(data));
                    //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                    //var error = JSON.parse(data.responseText)["odata.error"];
                    //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
                }
            });
            //}

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">bwFinancialAreasEditor: CANNOT RENDER</span>';
            html += '<br />';
            html += '<span style="">Exception in bwFinancialAreasEditor.Create(): ' + e.message + ', ' + e.stack + '</span>';
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

    cmdDisplayPeoplePickerDialog: function (friendlyNameSourceField, idSourceField, emailSourceField, buttonToEnable) {
        try {
            console.log('In bwFinancialAreasEditor.js.cmdDisplayPeoplePickerDialog().');
            alert('In bwFinancialAreasEditor.js.cmdDisplayPeoplePickerDialog().');

            $('#txtPeoplePickerDialogSearchBox').empty(); // Clear the search text box.
            $("#PeoplePickerDialog").dialog({
                modal: true,
                resizable: false,
                closeText: "Cancel",
                closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                //title: "Select a person...", //"Enter your early adopter code...",
                width: "570px",
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function (event, ui) { $('.ui-widget-overlay').bind('click', function () { $("#PeoplePickerDialog").dialog('close'); }); } // This allows the dialog to close when clicked outside of the dialog. Only works for modal dialogs.
            });
            $("#PeoplePickerDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

            $('#spanPeoplePickerDialogTitle').html('Select a person...');

            // Now we can hook up the Participant text box for autocomplete.
            $("#txtPeoplePickerDialogSearchBox").autocomplete({
                source: function (request, response) {
                    if (request.term == '') {
                        $('.bwCoreComponent').bwCoreComponent('renderAllParticipantsInThePeoplePicker'); // Nothing is in the search box, so show all participants.
                    } else {
                        $.ajax({
                            //url: appweburl + "/tenant/" + tenantId + "/participants/" + request.term,
                            url: webserviceurl + "/workflow/" + workflowAppId + "/participants/" + request.term,
                            dataType: "json",
                            success: function (data) {
                                $('#spanPeoplePickerParticipantsList').empty();
                                var html = '';
                                if (data.participants.length > 0) {
                                    //var searchArray = [];
                                    for (var i = 0; i < data.participants.length; i++) {
                                        //searchArray[i] = data.participants[i].participant;
                                        //var strParticipant = '<a href="">' + data.participants[i].participant.split('|')[0] + ' <i>(' + data.participants[i].participant.split('|')[2] + ')</i></a>';

                                        //html += '<a href="javascript:cmdReturnParticipantIdToField(\'' + friendlyNameSourceField + '\', \'' + idSourceField + '\', \'' + emailSourceField + '\', \'' + data.participants[i].participant.split('|')[0] + '\', \'' + data.participants[i].participant.split('|')[1] + '\', \'' + data.participants[i].participant.split('|')[2] + '\', \'' + buttonToEnable + '\');">' + data.participants[i].participant.split('|')[0] + '&nbsp;&nbsp;<i>(' + data.participants[i].participant.split('|')[2] + ')</i></a>';
                                        html += '<a href="javascript:$(\'.bwCoreComponent\').bwCoreComponent(\'cmdReturnParticipantIdToField\', \'' + friendlyNameSourceField + '\', \'' + idSourceField + '\', \'' + emailSourceField + '\', \'' + data.participants[i].participant.split('|')[0] + '\', \'' + data.participants[i].participant.split('|')[1] + '\', \'' + data.participants[i].participant.split('|')[2] + '\', \'' + buttonToEnable + '\');">' + data.participants[i].participant.split('|')[0] + '&nbsp;&nbsp;<i>(' + data.participants[i].participant.split('|')[2] + ')</i></a>';


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
            $('.bwCoreComponent').bwCoreComponent('renderAllParticipantsInThePeoplePicker', friendlyNameSourceField, idSourceField, emailSourceField, buttonToEnable); // We do this the first time to make sure they are all displayed.

        } catch (e) {
            var msg = 'Exception in bwFinancialAreasEditor.js.cmdDisplayPeoplePickerDialog(): ' + e.message + ', ' + e.stack;
            console.log(msg);
            displayAlertDialog(msg);
        }
    },

    generateFunctionalAreasListButtons: function () {
        try {
            console.log('In bwFinancialAreasEditor.js.generateFunctionalAreasListButtons().');
            //disableFinancialAreasButton();

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');


            // Set the main menu title bar.
            var html = '';
            html += '<table style="border-width: 0px; margin: 0px; padding: 0px; width: 100%;"><tbody><tr style="border-width: 0px; margin: 0px; padding: 0px;"><td style="border-width: 0px; margin: 0px; padding: 0px;">';
            //html += 'Financial Areas... xcx123453647 in bwFinancialAreasEditor.js widget underway... <<<<<<< Uses/should use the BwFunctionalArea table.';
            html += '</td></tr></tbody></table>';
            $('#divPageContent3').html(html);
            //// Change the title of the section to the top financial area.
            //$('#divFunctionalAreasMasterSubMenuDiv').text('Add a financial areaxx:');
            //$('#divFunctionalAreasMasterSubMenuDiv').show(); // This shows the header right-rounder bar in case it was hidden.
            //


            var html = '';
            html += '<table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
            html += '    <tr>';
            html += '        <td style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
            html += '            <table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
            html += '                <tr>';
            html += '                    <td style="width:170px;vertical-align:top;padding:0 0 0 0;margin:0 0 0 0;border-width:0 1px 0 0;">';
            html += '                        <div id="divFunctionalAreasListButtons"></div>';
            html += '                    </td>';
            html += '                    <td style="border-right:1px solid grey;width:15px;padding:0 0 0 0;margin:0 0 0 0;border-width:0 1px 0 0;">&nbsp;</td>';
            html += '                    <td style="width:15px;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;"></td>';
            html += '                    <td>';
            html += '                        <table>';
            html += '                            <tr>';
            html += '                                <td>';
            html += '                                    <div id="divFunctionalAreaSection"></div>';
            html += '                                </td>';
            html += '                            </tr>';
            html += '                        </table>';
            html += '                    </td>';
            html += '                </tr>';
            html += '            </table>';
            html += '        </td>';
            html += '    </tr>';
            html += '</table>';
            $('#divPageContent3').append(html);


            // Display the functional area form.
            $('#divFunctionalAreaSection').html($('#divFunctionalAreaTemplate').html());
            $('#divFunctionalAreaSection').show();


            //
            //
            // The year we are using for comparison should be the year selected in the Configuration > Organization Settings.
            //
            //
            var workflowAppFiscalYear = $('.bwAuthentication').bwAuthentication('option', 'workflowAppFiscalYear');

            //var year = '2016'; // todd hardcoded.
            //var year = new Date().getFullYear().toString(); // todd hardcoded.

            var years = [];
            for (var i = 0; i < this.options.financialAreas.length; i++) {
                if (!(years.indexOf(this.options.financialAreas[i].bwFunctionalAreaYear) > -1)) {
                    years.push(this.options.financialAreas[i].bwFunctionalAreaYear);
                }
            }

            console.log('Displaying Financial Areas for the currently selected fiscal year: ' + workflowAppFiscalYear + '. Financial Areas are available for these years: ' + JSON.stringify(years));

            var html = '';
            html += '<table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';

            // BEGIN: DO A WEB SERVICE CALL TO GET THE FUNCTIONAL AREAS AND THEN ITERATE THROUGH THEM ALL HERE
            var hasTopButtonBeenDisplayed = false;
            var topButtonFinancialAreaId;

            for (var i = 0; i < this.options.financialAreas.length; i++) {
                debugger;
                if ((this.options.financialAreas[i].bwWorkflowAppId == workflowAppId) && (this.options.financialAreas[i].bwFunctionalAreaYear == workflowAppFiscalYear)) {
                    if (hasTopButtonBeenDisplayed == false) {
                        // Change the title of the section to the top financial area.
                        $('#divFunctionalAreasMasterSubMenuDiv').text(this.options.financialAreas[i].bwFunctionalAreaTitle); //'Add a financial areaxx:');
                        $('#divFunctionalAreasMasterSubMenuDiv').show(); // This shows the header right-rounder bar in case it was hidden.
                        html += '    <tr>';
                        html += '        <td style="padding:0 0 0 10px;margin:0 0 0 0;border-width:0 0 0 0;">';
                        //html += '            <div id="divFunctionalAreaMasterDiv' + BWMData[0][0][4][i][0].toString() + '" style="outline: rgb(59, 103, 142) dashed 1px;color: rgb(220, 220, 220);height:28px;width:92%;white-space:nowrap;border-radius:0 0 0 0;padding:12px 0 0 20px;margin:0 0 0 0;border-width:0 0 0 0;background-color: rgb(255, 255, 255);" class="evaluationChecklistAccordionLink">' + BWMData[0][0][4][i][1].toString() + '&nbsp;&nbsp;&nbsp;&nbsp;</div>';
                        html += '            <div id="divFunctionalAreaMasterDiv' + this.options.financialAreas[i].bwFunctionalAreaId + '" class="divLeftButtonSelected">' + this.options.financialAreas[i].bwFunctionalAreaTitle + '&nbsp;&nbsp;&nbsp;&nbsp;</div>';
                        html += '        </td>';
                        html += '    </tr>';
                        html += '    <tr><td></td></tr>';
                        hasTopButtonBeenDisplayed = true;
                        topButtonFinancialAreaId = this.options.financialAreas[i].bwFunctionalAreaId;
                    } else {
                        html += '    <tr>';
                        html += '        <td style="padding:0 0 0 10px;margin:0 0 0 0;border-width:0 0 0 0;">';
                        //html += '            <div id="divFunctionalAreaMasterDiv' + BWMData[0][x][4][i][0].toString(ListItemId of the Functional Area) + '" class="divLeftButton" onclick="renderFunctionalAreaDetails(\'' + BWMData[0][x][4][i][0].toString(ListItemId of the Functional Area) + '\');">' + BWMData[0][x][4][i][1].toString(Title of the Functional Area) + '&nbsp;&nbsp;&nbsp;&nbsp;</div>';
                        html += '            <div id="divFunctionalAreaMasterDiv' + this.options.financialAreas[i].bwFunctionalAreaId + '" class="divLeftButton" onclick="renderFunctionalAreaDetails(\'' + this.options.financialAreas[i].bwFunctionalAreaId + '\');">' + this.options.financialAreas[i].bwFunctionalAreaTitle + '&nbsp;&nbsp;&nbsp;&nbsp;</div>';
                        html += '        </td>';
                        html += '    </tr>';
                        html += '    <tr><td></td></tr>';
                    }
                }
            }

            html += '    <tr>';
            html += '        <td style="padding:0 0 0 10px;margin:0 0 0 0;border-width:0 0 0 0;">';
            html += '            <div id="divMenuMasterDivAddAFunctionalArea" class="divLeftButton" onclick="renderFunctionalAreaDetails(\'AddAFinancialArea\');"><!--<img src="/images/plus.png" alt="" />-->+ Add a functional area&nbsp;&nbsp;&nbsp;&nbsp;</div>';
            html += '        </td>';
            html += '    </tr>';
            html += '    <tr><td></td></tr>';

            html += '</table>';

            ////
            $('#divFunctionalAreasListButtons').html(html);

            if (!topButtonFinancialAreaId) topButtonFinancialAreaId = 'AddAFinancialArea'; // We do this in case there are no Financial Areas tat have bee created yet. This happens when Dec 31 turns to Jan 1.
            this.renderFunctionalAreaDetails(topButtonFinancialAreaId);

            ////$('#divFunctionalAreasSubSubMenus').html(html);





            ////$('#divFunctionalAreasSubSubMenus').empty();


            ////$('#divFunctionalAreasMasterDiv').empty(); // Clear the div and rebuild it with out new 'Departments' title.
            ////$('#divFunctionalAreasMasterSubMenuDiv').hide(); //This is the top bar which we want to hide in this case.









            ////populateStartPageItem('divAddAFunctionalArea', 'Reports', '');
            //$('#divFunctionalAreasMasterSubMenuDiv').text('Creating a new Financial Area:'); // Change the title of the section.
            //$('#btnFunctionalAreaDelete').hide();
            //$('#divFunctionalAreaSection').html($('#divFunctionalAreaTemplate').html()); // Display the functional area form.
            //$('#divFunctionalAreasMasterSubMenuDiv').show(); // This shows the header right-rounder bar in case it was hidden.

            this.hookUpThePeoplePickers(); // This hooks up the Approver #1 and #2 people pickers.



            //$('#divMenuMasterDivAddAFunctionalArea').css({
            //    'border-width': '0px', 'margin': '0px 0px 0px 0px', 'padding': '12px 0px 0px 20px', 'outline': 'rgb(59, 103, 142) dashed 1px', 'border-radius': '0px', 'width': '92%', 'height': '28px', 'color': '#dcdcdc', 'background-color': 'white'
            //});

        } catch (e) {
            var msg = 'Exception in bwFinancialAreasEditor.js.generateFunctionalAreasListButtons(): ' + e.message + ', ' + e.stack;
            console.log(msg);
            displayAlertDialog(msg);
        }
    },



    hookUpThePeoplePickers: function () {
        try {
            console.log('In hookUpThePeoplePickers().');

            // Now we can hook up the Participant text box for autocomplete.
            //var tenantId = '1';
            // Now we can hook up the Participant text box for autocomplete.
            $("#txtApprover1FriendlyName").autocomplete({
                source: function (request, response) {
                    //weburl = _spPageContextInfo.siteAbsoluteUrl;
                    $.ajax({
                        url: webserviceurl + "/tenant/" + tenantId + "/participants/" + request.term,
                        dataType: "json",
                        success: function (data) {
                            var searchArray = [];
                            for (var i = 0; i < data.participants.length; i++) {
                                searchArray[i] = data.participants[i].participant;
                            }
                            response(searchArray);
                        }
                    });
                },
                minLength: 1, // minLength specifies how many characters have to be typed before this gets invoked.
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
                    //var searchValue = this.value.split(' ')[0] + ' ' + this.value.split(' ')[1

                    var approverName = this.value.split('|')[0];
                    var approverId = this.value.split('|')[1];
                    var approverEmail = this.value.split('|')[2];

                    if (approverName.indexOf('undefined') > -1) {
                        document.getElementById('txtApprover1FriendlyName').value = '';
                        document.getElementById('txtApprover1Id').value = '';
                        document.getElementById('txtApprover1Email').value = '';
                    } else {
                        document.getElementById('txtApprover1FriendlyName').value = approverName; //this.value.split(' ')[0] + ' ' + this.value.split(' ')[1]; // Just shows the Loan Number parameter (removing the borrower name) so it fits in the text box.
                        document.getElementById('txtApprover1FriendlyName').setAttribute('title', approverEmail);
                        document.getElementById('txtApprover1Id').value = approverId;
                        document.getElementById('txtApprover1Email').value = approverEmail;
                    }
                }
            });

            $("#txtApprover2FriendlyName").autocomplete({
                source: function (request, response) {
                    //weburl = _spPageContextInfo.siteAbsoluteUrl;
                    $.ajax({
                        url: webserviceurl + "/tenant/" + tenantId + "/participants/" + request.term,
                        dataType: "json",
                        success: function (data) {
                            var searchArray = [];
                            for (var i = 0; i < data.participants.length; i++) {
                                searchArray[i] = data.participants[i].participant;
                            }
                            response(searchArray);
                        }
                    });
                },
                minLength: 1, // minLength specifies how many characters have to be typed before this gets invoked.
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
                    //var searchValue = this.value.split(' ')[0] + ' ' + this.value.split(' ')[1];
                    //if (searchValue.indexOf('undefined') > -1) document.getElementById('txtApprover2Name').value = '';
                    //else document.getElementById('txtApprover2Name').value = searchValue; //this.value.split(' ')[0] + ' ' + this.value.split(' ')[1]; // Just shows the Loan Number parameter (removing the borrower name) so it fits in the text box.

                    var approverName = this.value.split('|')[0];
                    var approverId = this.value.split('|')[1];
                    var approverEmail = this.value.split('|')[2];

                    if (approverName.indexOf('undefined') > -1) {
                        document.getElementById('txtApprover2FriendlyName').value = '';
                        document.getElementById('txtApprover2Id').value = '';
                        document.getElementById('txtApprover2Email').value = '';
                    } else {
                        document.getElementById('txtApprover2FriendlyName').value = approverName;
                        document.getElementById('txtApprover2FriendlyName').setAttribute('title', approverEmail);
                        document.getElementById('txtApprover2Id').value = approverId;
                        document.getElementById('txtApprover2Email').value = approverEmail;
                    }
                }
            });

        } catch (e) {
            var msg = 'Exception in bwFinancialAreasEditor.js.hookUpThePeoplePickers(): ' + e.message + ', ' + e.stack;
            console.log(msg);
            displayAlertDialog(msg);
        }
    },

    renderFunctionalAreaDetails: function (functionalAreaId) {
        try {
            console.log('In bwFinancialAreasEditor.js.renderFunctionalAreaDetails().');

            //var year = '2016'; // todd hardcoded.
            var year = new Date().getFullYear().toString(); // todd hardcoded.
            var appIndex;

            var functionalAreaQuote = false; // We will get this value below.

            var functionalAreaTitle = '';
            if (functionalAreaId == 'AddAFinancialArea') { // This is the exception, is the '+ Add a financial area' button.

                functionalAreaTitle = 'Add a functional area:';

            } else {
                for (var i = 0; i < this.options.financialAreas.length; i++) {
                    if (this.options.financialAreas[i].bwFunctionalAreaId == functionalAreaId) {
                        functionalAreaTitle = this.options.financialAreas[i].bwFunctionalAreaTitle;
                        //
                        // Todd 1-20-2024. Do we need this Quote idea? I can't remember what it was used for. Keeping it here for now.
                        //
                        //if (BWMData[0][appIndex][4][i][2] == 'true') { // Yields a bool, true or false.
                        //    functionalAreaQuote = true;
                        //}

                    }
                }
            }
            $('#divFunctionalAreasMasterSubMenuDiv').text(functionalAreaTitle); // Change the title of the section.
            $('#divFunctionalAreasMasterSubMenuDiv').show(); // This shows the header rounded bar in case it was hidden.

            ////////////
            // Regenerate the buttons being displayed, leaving out the one we have just put in the title bar above them!
            var html = '';
            html += '<table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
            html += '    <tr>';
            html += '        <td style="padding:0 0 0 10px;margin:0 0 0 0;border-width:0 0 0 0;">';
            //html += '            <div id="divMenuMasterDivAddAFunctionalArea" style="height:28px;width:92%;white-space:nowrap;border-radius:0 0 0 0;padding:12px 0 0 20px;margin:0 0 0 0;border-width:0 0 0 0;background-color:#6682b5;" onclick="renderFunctionalAreaDetails(\'AddAFinancialArea\');" class="evaluationChecklistAccordionLink"><!--<img src="/images/plus.png" alt="" />-->+ Add a financial area&nbsp;&nbsp;&nbsp;&nbsp;</div>';
            html += '            <div id="divMenuMasterDivAddAFunctionalArea" class="divLeftButton" onclick="renderFunctionalAreaDetails(\'AddAFinancialArea\');"><!--<img src="/images/plus.png" alt="" />-->+ Add a functional area&nbsp;&nbsp;&nbsp;&nbsp;</div>';


            html += '        </td>';
            html += '    </tr>';
            html += '    <tr><td></td></tr>';

            //
            //
            // The year we are using for comparison should be the year selected in the Configuration > Organization Settings.
            //
            //
            var workflowAppFiscalYear = $('.bwAuthentication').bwAuthentication('option', 'workflowAppFiscalYear');

            // Commented out 1-20-2024.
            for (var i = 0; i < this.options.financialAreas.length; i++) {
                if (this.options.financialAreas[i].bwFunctionalAreaYear == workflowAppFiscalYear) {
                    html += '    <tr>';
                    html += '        <td style="padding:0 0 0 10px;margin:0 0 0 0;border-width:0 0 0 0;">';
                    //html += '            <div id="divFunctionalAreaMasterDiv' + BWMData[0][0][4][i][0].toString() + '" style="height:28px;width:92%;white-space:nowrap;border-radius:0 0 0 0;padding:12px 0 0 20px;margin:0 0 0 0;border-width:0 0 0 0;background-color:#6682b5;" onclick="renderFunctionalAreaDetails(\'' + BWMData[0][0][4][i][0].toString() + '\');" class="evaluationChecklistAccordionLink">' + BWMData[0][0][4][i][1].toString() + '&nbsp;&nbsp;&nbsp;&nbsp;</div>';
                    html += '            <div id="divFunctionalAreaMasterDiv' + this.options.financialAreas[i].bwFunctionalAreaId + '" class="divLeftButton" onclick="renderFunctionalAreaDetails(\'' + this.options.financialAreas[i].bwFunctionalAreaId + '\');">' + this.options.financialAreas[i].bwFunctionalAreaTitle + '&nbsp;&nbsp;&nbsp;&nbsp;</div>';
                    html += '        </td>';
                    html += '    </tr>';
                    html += '    <tr><td></td></tr>';
                }
            }
            html += '</table>';
            $('#divFunctionalAreasListButtons').html(html);
            // End Regenerate
            ///////////
            //displayAlertDialog('functionalAreaId:' + functionalAreaId);
            // Set the active button with the dotted line outline etc.
            if (functionalAreaId == 'AddAFinancialArea') { // The '+ add a financial area' button again. 
                document.getElementById('divMenuMasterDivAddAFunctionalArea').className = 'divLeftButtonSelected';
                //$('#divMenuMasterDivAddAFunctionalArea').css({
                //    'border-width': '0px', 'margin': '0px 0px 0px 0px', 'padding': '12px 0px 0px 20px', 'outline': 'rgb(59, 103, 142) dashed 1px', 'border-radius': '0px', 'width': '92%', 'height': '28px', 'color': '#dcdcdc', 'background-color': 'white'
                //});

            } else {
                document.getElementById('divFunctionalAreaMasterDiv' + functionalAreaId).className = 'divLeftButtonSelected';
                //$('#divFunctionalAreaMasterDiv' + functionalAreaId).css({
                //    'border-width': '0px', 'margin': '0px 0px 0px 0px', 'padding': '12px 0px 0px 20px', 'outline': 'rgb(59, 103, 142) dashed 1px', 'border-radius': '0px', 'width': '92%', 'height': '28px', 'color': '#dcdcdc', 'background-color': 'white'
                //});
            }

            ///////////
            // Now we display the Functional Area details.
            $('#divFunctionalAreaSection').html($('#divFunctionalAreaTemplate').html()); // Display the functional area form.
            var html = '';
            html += '<span xd:binding="my:FunctionalAreaId" style="display:none;">' + functionalAreaId + '</span>';
            html += '<table>';


            // Commented out 1-20-2024.
            for (var i = 0; i < this.options.financialAreas.length; i++) {
                if (this.options.financialAreas[i].bwFunctionalAreaId == functionalAreaId) {

                    debugger;
                    //if (BWMData[0][appIndex][4][i][7][0][1]) {
                    //    html += '<tr>';
                    //    html += '  <td></td>';
                    //    //html += '      <span style="color:cornflowerblue;font-size:x-small;">Approver</span>';
                    //    html += '  <td></td>';
                    //    html += '  <td style="text-align:center;">';
                    //    html += '    <span style="color:cornflowerblue;font-size:x-small;">Budget Threshold</span>';
                    //    html += '  </td>';
                    //    html += '  <td></td>';
                    //    html += '</tr>';
                    //}
                    //for (var x = 0; x < BWMData[0][appIndex][4][i][7].length; x++) {
                    //    if (BWMData[0][appIndex][4][i][7][x][1]) { // If there is no entry, stop rendering the Approvers for this financial area.

                    for (var x = 3; x < 11; x++) { // Approvers 3 to 10. We have a maximum of 10 approvers for Financial Areas.

                        var approverUserId_FieldName = 'Approver' + x + 'Id';
                        if (this.options.financialAreas[i][approverUserId_FieldName]) {

                            html += '<tr>';
                            html += '  <td class="bwComTitleCell">Approver #' + x + '</td>';
                            html += '  <td class="bwChartCalculatorLightCurrencyTableCell" style="white-space:nowrap;">';
                            var approverNumber = x;

                            var approverEmail_FieldName = 'Approver' + x + 'Email';
                            var approverFriendlyName_FieldName = 'Approver' + x + 'FriendlyName';
                            var approverBudgetThreshold_FieldName = 'Approval' + x + 'BudgetThreshold';

                            //var ApproverEmail
                            //html += '    <input style="padding:5px 5px 5px 5px;" id="txtApprover' + approverNumber + 'FriendlyName" onfocus="this.blur();" contenteditable="false" onclick="cmdDisplayPeoplePickerDialog(\'txtApprover' + approverNumber + 'FriendlyName\', \'txtApprover' + approverNumber + 'Id\', \'txtApprover' + approverNumber + 'Email\');" title="' + this.options.financialAreas[i][approverEmail_FieldName] + '" value="' + this.options.financialAreas[i][approverFriendlyName_FieldName] + '" />';
                            //html += '    <img src="images/addressbook-icon18x18.png" style="width:18px;height:18px;cursor:pointer;vertical-align:text-bottom;" onclick="cmdDisplayPeoplePickerDialog(\'txtApprover' + approverNumber + 'FriendlyName\', \'txtApprover' + approverNumber + 'Id\', \'txtApprover' + approverNumber + 'Email\');" />';

                            html += '    <input style="padding:5px 5px 5px 5px;" id="txtApprover' + approverNumber + 'FriendlyName" onfocus="this.blur();" contenteditable="false" onclick="$(\'.bwFinancialAreasEditor\').bwFinancialAreasEditor(\'cmdDisplayPeoplePickerDialog\', \'txtApprover' + approverNumber + 'FriendlyName\', \'txtApprover' + approverNumber + 'Id\', \'txtApprover' + approverNumber + 'Email\');" title="' + this.options.financialAreas[i][approverEmail_FieldName] + '" value="' + this.options.financialAreas[i][approverFriendlyName_FieldName] + '" />';
                            html += '    <img src="images/addressbook-icon18x18.png" style="width:18px;height:18px;cursor:pointer;vertical-align:text-bottom;" onclick="$(\'.bwFinancialAreasEditor\').bwFinancialAreasEditor(\'cmdDisplayPeoplePickerDialog\', \'txtApprover' + approverNumber + 'FriendlyName\', \'txtApprover' + approverNumber + 'Id\', \'txtApprover' + approverNumber + 'Email\');" />';

                            //if (BWMData[0][0][4][i][7].length == (x + 1)) {
                            //    // This is the last one in the list, and we put a delete x here. The user can only delete the bottom one at the moment.
                            //    html += '&nbsp;<span style="font-weight:bold;color:red;cursor:pointer;" title="Delete">X</span>';
                            //}
                            html += '    <input id="txtApprover' + approverNumber + 'Id" style="display:none;" value="' + this.options.financialAreas[i][approverUserId_FieldName] + '" />';
                            html += '    <input id="txtApprover' + approverNumber + 'Email" style="display:none;" value="' + this.options.financialAreas[i][approverEmail_FieldName] + '" />';
                            html += '  </td>';
                            html += '  <td class="bwChartCalculatorLightCurrencyTableCell">';
                            html += '    <span style="padding:5px 5px 5px 5px;" xd:binding="my:Approval' + approverNumber + 'BudgetThreshold" class="bwCurrencyTextBox" contenteditable="true" tabindex="0">' + formatCurrency(this.options.financialAreas[i][approverBudgetThreshold_FieldName]) + '</span>';
                            html += '  </td>';

                            html += '<td><img src="images/trash-can.png" onclick="cmdDeleteApproverFromFinancialArea(\'' + approverNumber + '\');" title="Delete" style="cursor:pointer;" /></td>';

                            html += '</tr>';
                        }
                    }
                    html += '</table>';
                    $('#divFunctionalAreasApproverDataEntryFields').html(html);

                    // Now that it is displayed, we have to fill in the missing data!
                    //displayAlertDialog('displaying:' + BWMData[0][appIndex][4][i][0]);
                    $('#txtFunctionalAreaId').val(this.options.financialAreas[i].bwFunctionalAreaId);
                    $('#txtFunctionalAreaTitle').val(this.options.financialAreas[i].bwFunctionalAreaTitle);

                    //displayAlertDialog('functionalAreaQuote: ' + functionalAreaQuote);

                    if (functionalAreaQuote == true) document.getElementById('cbFunctionalAreaQuote').checked = true;
                    else document.getElementById('cbFunctionalAreaQuote').checked = false;

                    var faHtml = '';
                    faHtml += '<select style="padding:5px 5px 5px 5px;" id="txtFunctionalAreaYear">';
                    faHtml += '<option value="' + this.options.financialAreas[i].bwFunctionalAreaYear + '" selected>' + this.options.financialAreas[i].bwFunctionalAreaYear + '</option>';
                    faHtml += '</select>';
                    document.getElementById('spanFunctionalAreaYear').innerHTML = faHtml;

                    //$('#txtFunctionalAreaYear').val(BWMData[0][0][4][i][3]);


                    $('#txtFunctionalAreaYearlyBudget').val(this.options.financialAreas[i].bwFunctionalAreaYearlyBudget);

                    //var a1 = BWMData[0][0][4][i][5][1];
                    //var a2 = BWMData[0][0][4][i][6][1];
                    //$('#txtApprover1Name').val(a1);
                    //$('#txtApprover2Name').val(a2);



                    //$('#txtApprover1Name').val(BWMData[0][0][4][i][5][1]);
                    //document.getElementById('txtApprover1Name').setAttribute('title', BWMData[0][0][4][i][5][2]); // This sets the title attribute to the participant email address.
                    //$('#txtApprover2Name').val(BWMData[0][0][4][i][6][1]);
                    //document.getElementById('txtApprover2Name').setAttribute('title', BWMData[0][0][4][i][5][2]); // This sets the title attribute to the participant email address.


                    document.getElementById('txtApprover1FriendlyName').value = this.options.financialAreas[i].Approver1FriendlyName;
                    document.getElementById('txtApprover1FriendlyName').setAttribute('title', this.options.financialAreas[i].Approver1FriendlyName);
                    document.getElementById('txtApprover1Id').value = this.options.financialAreas[i].Approver1Id;
                    document.getElementById('txtApprover1Email').value = this.options.financialAreas[i].Approver1Email;

                    document.getElementById('txtApprover2FriendlyName').value = this.options.financialAreas[i].Approver2FriendlyName;
                    document.getElementById('txtApprover2FriendlyName').setAttribute('title', this.options.financialAreas[i].Approver2FriendlyName);
                    document.getElementById('txtApprover2Id').value = this.options.financialAreas[i].Approver2Id;
                    document.getElementById('txtApprover2Email').value = this.options.financialAreas[i].Approver2Email;



                    //$('span[xd\\:binding = "my:Approver1Name"]')[0].innerHTML = BWMData[0][0][4][i][5]; // my:Approver1Name
                    //$('span[xd\\:binding = "my:Approver2Name"]')[0].innerHTML = BWMData[0][0][4][i][6]; // my:Approver2Name
                    // find the friendly names for approvers 3-10 (my:Approver3Name)
                    // formatCurrency for the budget thresholds 3-10 (my:Approval3BudgetThreshold)
                    //formatCurrency2('my:FunctionalAreaYearlyBudget');
                    var faYearlyBudget = $('#txtFunctionalAreaYearlyBudget').val();
                    $('#txtFunctionalAreaYearlyBudget').val(formatCurrency(faYearlyBudget));
                    //formatCurrency2('my:Approval3BudgetThreshold');
                    //formatCurrency2('my:Approval4BudgetThreshold');
                    //formatCurrency2('my:Approval5BudgetThreshold');
                    //formatCurrency2('my:Approval6BudgetThreshold');
                    //formatCurrency2('my:Approval7BudgetThreshold');
                    //formatCurrency2('my:Approval8BudgetThreshold');
                    //formatCurrency2('my:Approval9BudgetThreshold');
                    //formatCurrency2('my:Approval10BudgetThreshold');


                    // If this is marked as Hidden, we need to replace the delete button with the "Un-Hide" button.
                    //if (BWMData[0][appIndex][4][i][13] == 'true') {
                    //    var html = '';
                    //    html += '<input type="button" value="Un-Hide" id="btnFunctionalAreaUnHide" onclick="cmdUnHideFunctionalArea(\'' + functionalAreaId + '\');" class="BwSmallButton" />';
                    //    html += '&nbsp;';
                    //    html += '<input style="padding:5px 10px 5px 10px;" type="button" value="Save" onclick="cmdSaveFunctionalArea();" class="BwSmallButton" />';
                    //    html += '&nbsp;';
                    //    html += '<input style="padding:5px 10px 5px 10px;" type="button" value="Cancel" onclick="populateStartPageItem(\'divFunctionalAreas\', \'Reports\', \'\');" class="BwSmallButton" />';
                    //    document.getElementById('spanFunctionalAreaDetailsBottomButtonSection').innerHTML = html;
                    //} else {
                    var html = '';
                    html += '<input style="padding:5px 10px 5px 10px;" type="button" value="Delete" id="btnFunctionalAreaDelete" onclick="cmdDeleteFunctionalArea(\'' + functionalAreaId + '\');" class="BwSmallButton" />';
                    html += '&nbsp;';
                    html += '<input style="padding:5px 10px 5px 10px;" type="button" value="Save" onclick="cmdSaveFunctionalArea();" class="BwSmallButton" />';
                    html += '&nbsp;';
                    html += '<input style="padding:5px 10px 5px 10px;" type="button" value="Cancel" onclick="populateStartPageItem(\'divFunctionalAreas\', \'Reports\', \'\');" class="BwSmallButton" />';
                    document.getElementById('spanFunctionalAreaDetailsBottomButtonSection').innerHTML = html;
                    //}

                    this.hookUpThePeoplePickers();
                }
            }
            // End display Functional Area
            ///////////

            if (functionalAreaId == 'AddAFinancialArea') {
                //var year = new Date().getFullYear().toString(); // todd hardcoded.
                //var yearHtml = '';
                //yearHtml += year; // todd: hardcoded.
                document.getElementById('spanFunctionalAreaYear').innerHTML = workflowAppFiscalYear;

                var html = '';
                //html += '<input type="button" value="Delete" id="btnFunctionalAreaDelete" onclick="cmdDeleteFunctionalArea(\'' + functionalAreaId + '\');" class="BwSmallButton" />';
                //html += '&nbsp;';
                html += '<input style="padding:5px 10px 5px 10px;" type="button" value="Save" onclick="cmdSaveFunctionalArea();" class="BwSmallButton" />';
                html += '&nbsp;';
                html += '<input style="padding:5px 10px 5px 10px;" type="button" value="Cancel" onclick="populateStartPageItem(\'divFunctionalAreas\', \'Reports\', \'\');" class="BwSmallButton" />';
                document.getElementById('spanFunctionalAreaDetailsBottomButtonSection').innerHTML = html;
            }

            //generateFunctionalAreasApproverDataEntryFields();
            //var e1 = document.getElementById('divFunctionalAreas');
            //e1.style.borderRadius = '20px 0 0 20px';

        } catch (e) {
            var msg = 'Exception in bwFinancialAreasEditor.js.renderFunctionalAreaDetails(' + functionalAreaId + '): ' + e.message + ', ' + e.stack;
            console.log(msg);
            displayAlertDialog(msg);
        }
    },

    generateFunctionalAreasApproverDataEntryFields: function () {
        //
        var html = '';
        html += '<table>';
        html += '    <tr>';
        html += '        <td>';

        html += '<table>';
        //html += '    <tr>';
        //html += '        <td>Approver #2-1</td>';
        //html += '    </tr>';
        //html += '    <tr>';
        //html += '        <td>';
        //html += '            <table>';
        //html += '                <tr>';
        //html += '                    <td style="text-align:left;" class="bwFADrillDownLinkCell">Name</td>';
        //html += '                    <td class="bwChartCalculatorLightCurrencyTableCell">';
        //html += '                        <span xd:binding="my:xxxx" class="bwCurrencyTextBox" contenteditable="true" onblur="//formatCurrency($(this).attr(xd:binding));" onfocusin="//currencySpanOnFocusIn(this);" onkeyup="//currencySpanOnKeyUp(this);" tabindex="0" />';
        //html += '                    </td>';
        //html += '                </tr>';
        //html += '            </table>';
        //html += '        </td>';
        //html += '    </tr>';

        // BEGIN: DO A WEB SERVICE CALL TO GET THE FUNCTIONAL AREAS AND THEN ITERATE THROUGH THEM ALL HERE
        var functionalAreaAdditionalApprovers = BWMData; //[0][xxxx][4][7];
        for (var i = 0; i < functionalAreaAdditionalApprovers.length; i++) {
            html += '    <tr>';
            html += '        <td>Approver #' + i.toString() + '-1</td>';
            html += '    </tr>';
            html += '    <tr>';
            html += '        <td>';
            html += '            <table>';
            html += '                <tr>';
            html += '                    <td style="text-align:left;" class="bwFADrillDownLinkCell">Name</td>';
            html += '                    <td class="bwChartCalculatorLightCurrencyTableCell">';
            html += '                        <span xd:binding="my:xxxx" class="bwCurrencyTextBox" contenteditable="true" onblur="//formatCurrency($(this).attr(xd:binding));" onfocusin="//currencySpanOnFocusIn(this);" onkeyup="//currencySpanOnKeyUp(this);" tabindex="0" />';
            html += '                    </td>';
            html += '                </tr>';
            html += '                <tr>';
            html += '                    <td style="text-align:left;" class="bwFADrillDownLinkCell">Budget threshold</td>';
            html += '                    <td class="bwChartCalculatorLightCurrencyTableCell">';
            html += '                        <span xd:binding="my:xxxx" class="bwCurrencyTextBox" contenteditable="true" onblur="//formatCurrency($(this).attr(xd:binding));" onfocusin="//currencySpanOnFocusIn(this);" onkeyup="//currencySpanOnKeyUp(this);" tabindex="0" />';
            html += '                    </td>';
            html += '                </tr>';
            html += '            </table>';
            html += '        </td>';
            html += '    </tr>';
        }
        // END: DO A WEB SERVICE CALL TO GET THE FUNCTIONAL AREAS AND THEN ITERATE THROUGH THEM ALL HERE

        html += '</table>';

        html += '        </td>';
        html += '    </tr>';
        html += '</table>';

        $('#divFunctionalAreasApproverDataEntryFields').html(html);
    },
    cmdDeleteApproverFromFinancialArea: function (approverNumber) {
        try {
            var displayedApprover = approverNumber - 1; // There is an offset from the titles.
            // Step 1: First we are going to load an array with the currently displayed values.
            var approvers = [];
            approvers = new Array();
            for (var i = 3; i < 11; i++) {
                var friendlyNameField = $('#txtApprover' + i + 'FriendlyName');
                if (friendlyNameField.val()) {
                    // If this field exists, so will the other ones.
                    var userId = $('#txtApprover' + i + 'Id').val();
                    var userEmail = $('#txtApprover' + i + 'Email').val();
                    var userFriendlyName = $('#txtApprover' + i + 'FriendlyName').val();
                    var tmpVal = $('span[xd\\:binding="my:Approval' + i + 'BudgetThreshold"]')[0].innerHTML;
                    var userBudgetThreshold = parseFloat(tmpVal.replace(/[^0-9-.]/g, ''));
                    var userInfo = [];
                    userInfo = new Array(4);
                    userInfo[0] = userId;
                    userInfo[1] = userEmail;
                    userInfo[2] = userFriendlyName;
                    userInfo[3] = userBudgetThreshold;
                    approvers.push(userInfo);
                }
            }
            //displayAlertDialog(JSON.stringify(approvers));

            // Step 2: Then we will remove the one specified.
            approvers.splice((approverNumber - 3), 1);
            //displayAlertDialog(JSON.stringify(approvers));

            // Step 3: Then we will render the screen using the array!
            var html = '';
            html += '<table>';
            if (approvers.length > 0) {
                html += '<tr>';
                html += '  <td></td>';
                //html += '      <span style="color:cornflowerblue;font-size:x-small;">Approver</span>';
                html += '  <td></td>';
                html += '  <td style="text-align:center;">';
                html += '    <span style="color:cornflowerblue;font-size:x-small;">Budget Threshold</span>';
                html += '  </td>';
                html += '  <td></td>';
                html += '</tr>';
            }
            for (var x = 0; x < approvers.length; x++) {
                if (approvers[x][0]) { // If there is no entry, stop rendering the Approvers for this financial area.
                    html += '<tr>';
                    html += '  <td class="bwComTitleCell">Approver #' + (x + 2).toString() + '</td>';
                    html += '  <td class="bwChartCalculatorLightCurrencyTableCell" style="white-space:nowrap;">';
                    var approverNumber = x + 3;
                    html += '    <input style="padding:5px 5px 5px 5px;" id="txtApprover' + approverNumber + 'FriendlyName" title="' + approvers[x][1] + '" value="' + approvers[x][2] + '" />';
                    html += '    <img src="images/addressbook-icon18x18.png" style="width:18px;height:18px;cursor:pointer;vertical-align:text-bottom;" onclick="$(\'.bwFinancialAreasEditor\').bwFinancialAreasEditor(\'cmdDisplayPeoplePickerDialog\', \'txtApprover' + approverNumber + 'FriendlyName\', \'txtApprover' + approverNumber + 'Id\', \'txtApprover' + approverNumber + 'Email\');" />';
                    html += '    <input id="txtApprover' + approverNumber + 'Id" style="display:none;" value="' + approvers[x][0] + '" />';
                    html += '    <input id="txtApprover' + approverNumber + 'Email" style="display:none;" value="' + approvers[x][1] + '" />';
                    html += '  </td>';
                    html += '  <td class="bwChartCalculatorLightCurrencyTableCell">';
                    html += '    <span style="padding:5px 5px 5px 5px;" xd:binding="my:Approval' + approverNumber + 'BudgetThreshold" class="bwCurrencyTextBox" contenteditable="true" tabindex="0">' + formatCurrency(approvers[x][3]) + '</span>';
                    html += '  </td>';

                    html += '<td><img src="images/trash-can.png" onclick="cmdDeleteApproverFromFinancialArea(\'' + approverNumber + '\');" title="Delete" style="cursor:pointer;" /></td>';

                    html += '</tr>';
                }
            }

            //if (BWMData[0][0][4][i][7][0][1]) {
            //    html += '<tr>';
            //    html += '  <td></td>';
            //    //html += '      <span style="color:cornflowerblue;font-size:x-small;">Approver</span>';
            //    html += '  <td></td>';
            //    html += '  <td style="text-align:center;">';
            //    html += '    <span style="color:cornflowerblue;font-size:x-small;">Budget Threshold</span>';
            //    html += '  </td>';
            //    html += '  <td></td>';
            //    html += '</tr>';
            //}
            //for (var x = 0; x < BWMData[0][0][4][i][7].length; x++) {
            //    if (BWMData[0][0][4][i][7][x][1]) { // If there is no entry, stop rendering the Approvers for this financial area.
            //        html += '<tr>';
            //        html += '  <td class="bwComTitleCell">Approver #' + (x + 2).toString() + '</td>';
            //        html += '  <td class="bwChartCalculatorLightCurrencyTableCell" style="white-space:nowrap;">';
            //        var approverNumber = x + 3;
            //        html += '    <input id="txtApprover' + approverNumber + 'FriendlyName" title="' + BWMData[0][0][4][i][7][x][2] + '" value="' + BWMData[0][0][4][i][7][x][1] + '" />';
            //        html += '    <img src="images/addressbook-icon18x18.png" style="width:18px;height:18px;cursor:pointer;vertical-align:text-bottom;" onclick="cmdDisplayPeoplePickerDialog(\'txtApprover' + approverNumber + 'FriendlyName\', \'txtApprover' + approverNumber + 'Id\', \'txtApprover' + approverNumber + 'Email\');" />';
            //        html += '    <input id="txtApprover' + approverNumber + 'Id" style="display:none;" value="' + BWMData[0][0][4][i][7][x][0] + '" />';
            //        html += '    <input id="txtApprover' + approverNumber + 'Email" style="display:none;" value="' + BWMData[0][0][4][i][7][x][2] + '" />';
            //        html += '  </td>';
            //        html += '  <td class="bwChartCalculatorLightCurrencyTableCell">';
            //        html += '    <span xd:binding="my:Approval' + approverNumber + 'BudgetThreshold" class="bwCurrencyTextBox" contenteditable="true" tabindex="0">' + formatCurrency(BWMData[0][0][4][i][7][x][3]) + '</span>';
            //        html += '  </td>';

            //        html += '<td><img src="images/trash-can.png" onclick="cmdDeleteApproverFromFinancialArea(\'' + approverNumber + '\');" title="Delete" style="cursor:pointer;" /></td>';

            //        html += '</tr>';
            //    }
            //}
            html += '</table>';

            document.getElementById('divFunctionalAreasApproverDataEntryFields').innerHTML = html;
        } catch (e) {
            displayAlertDialog('Error in cmdDeleteApproverFromFinancialArea(): ' + e.message);
        }
    },

    cmdUnHideFunctionalArea: function (_functionalAreaId) {
        var data = [];
        data = {
            bwFunctionalAreaId: _functionalAreaId,
            IsHidden: 'false', // This is the value which hides the Financial Area.
            ModifiedByFriendlyName: participantFriendlyName,
            ModifiedById: participantId,
            ModifiedByEmail: participantEmail
        };
        var operationUri = webserviceurl + "/bwfunctionalareas/hideorshowfunctionalarea";
        $.ajax({
            url: operationUri,
            type: "POST", timeout: ajaxTimeout,
            data: data,
            headers: {
                "Accept": "application/json; odata=verbose"
            },
            success: function (data) {
                displayAlertDialog(data);
                //renderFunctionalAreaDetails(_functionalAreaId);
                populateStartPageItem('divFunctionalAreas', 'Reports', '');

            },
            error: function (data, errorCode, errorMessage) {
                //handleExceptionWithAlert('Error in Start.js.displayConnectedWorkflows()', '1:' + errorCode + ', ' + errorMessage);
                displayAlertDialog('Error in my.js.cmdImmediatelyHideFunctionalArea(): ' + errorMessage);
            }
        });
    },


    renderFinancialAreasEditor: function () {
        try {
            console.log('In renderFinancialAreasEditor().');
            var thiz = this;
            var html = '';

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
            var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

            html += '<div style="display:none;" id="divManageRequestTypeDialog">';
            html += '   <table style="width:100%;">';
            html += '       <tr>';
            html += '           <td style="width:90%;">';
            html += '               <span id="spanAddAnOrgItemDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;font-weight:bold;">[spanAddAnOrgItemDialogTitle]</span>';
            html += '           </td>';
            html += '           <td style="width:9%;"></td>';
            html += '           <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '               <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 30pt;font-weight:bold;" onclick="$(\'#divManageRequestTypeDialog\').dialog(\'close\');">X</span>';
            html += '           </td>';
            html += '       </tr>';
            html += '   </table>';
            html += '   <br /><br />';
            html += '   <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
            html += '   <span id="spanAddAnOrgItemDialogInvitationDescriptionText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 20pt;"></span>';
            //html += '   <span style="font-family: calibri;">Name</span>';
            //html += '   <br />';
            //html += '   <input type="text" id="txtManageRequestTypeDialog_Name" style="WIDTH: 95%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" />';
            //html += '   <br /><br />';

            // 12-31-2021
            html += '   <span style="font-family: calibri;">Singleton name</span>';
            html += '   <br />';
            html += '   <input type="text" id="txtManageRequestTypeDialog_SingletonName" style="WIDTH: 95%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" />';
            html += '   <br />';
            html += '   <span style="font-family: calibri;">Plural name</span>';
            html += '   <br />';
            html += '   <input type="text" id="txtManageRequestTypeDialog_PluralName" style="WIDTH: 95%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" />';
            html += '   <br /><br />';


            html += '   <span style="font-family: calibri;">Abbreviation</span>';
            html += '   <br />';
            html += '   <input type="text" id="txtManageRequestTypeDialog_Abbreviation" style="width:25%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" />';
            html += '   <br /><br />';
            html += '   <span style="font-family: calibri;">Id</span>';
            html += '   <br />';
            html += '   <input id="txtManageRequestTypeDialog_Id" type="text" disabled style="WIDTH: 95%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" /><br />';

            // added 8-9-2023.
            html += '   <br /><br />';
            html += '   <span style="white-space:nowrap;"><input id="checkboxManageRequestTypeDialog_HasWorkflow" type="checkbox" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" />Has a workflow</span>';

            html += '   <br /><br />';
            html += '   <span style="white-space:nowrap;"><input id="checkboxManageRequestTypeDialog_Active" type="checkbox" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" />Active</span>';

            html += '   <br /><br /><br />';
            html += '   <div id="divManageRequestTypeDialogSubmitButton" class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;">';
            html += '       Add the xx';
            html += '   </div>';
            html += '   <br /><br />';
            html += '   <div class="divSignInButton" style="width: 90%; text-align: center; line-height: 1.1em; font-weight: bold;" onclick="$(\'#divManageRequestTypeDialog\').dialog(\'close\');">';
            html += '       Close';
            html += '   </div>';
            html += '   <br /><br />';
            html += '</div>';


            //html += '<br /><br />';
            html += '<table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
            html += '  <tr>';
            html += '    <td>';
            //html += '        <span style="font-size:small;font-style:italic;">The title of the person responsible for completing the details of a New Request. This is displayed on the Budget Request forms. The default is "Manager".</span>';
            html += '       <span style="font-size:small;font-style:italic;">The request types you wish to enable:</span>';
            html += '    </td></tr>';
            html += '</table>';
            html += '<table>';
            html += '  <tr>';
            html += '    <td style="text-align:left;vertical-align:top;" class="bwSliderTitleCell">';
            html += '       Request Types:&nbsp;';
            html += '    </td>';
            html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';

            html += '<style>';
            html += '.dataGridTable { border: 1px solid gainsboro; font-size:14px; font-family: "Helvetica Neue","Segoe UI",Helvetica,Verdana,sans-serif; }';
            html += '.dataGridTable td { border-left: 0px; border-right: 1px solid gainsboro; }';
            html += '.headerRow { background-color:white; color:gray;border-bottom:1px solid gainsboro; }';
            html += '.headerRow td { border-bottom:1px solid gainsboro; padding-top:3px;padding-bottom:5px;padding-right:10px;padding-left:10px; }';
            html += '.filterRow td { border-bottom:1px solid whitesmoke; padding-top:3px;padding-bottom:5px;padding-right:10px;padding-left:10px; }';
            html += '.alternatingRowLight { background-color:white; }';
            html += '.alternatingRowLight td { padding-top:3px;padding-bottom:5px;padding-right:10px;padding-left:10px; }';
            html += '.alternatingRowLight:hover { background-color:lightgoldenrodyellow; }';
            html += '.alternatingRowDark { background-color:whitesmoke; }';
            html += '.alternatingRowDark td { padding-top:3px;padding-bottom:5px;padding-right:10px;padding-left:10px; }';
            html += '.alternatingRowDark:hover { background-color:lightgoldenrodyellow; }';
            html += '</style>';

            html += '<table class="dataGridTable">';
            html += '  <tr class="headerRow">';
            html += '    <td>Abbreviation</td>';
            html += '    <td>SingletonName</td>';
            html += '    <td>PluralName</td>';
            html += '    <td>isActive</td>';
            html += '    <td>hasWorkflow</td>';
            html += '    <td>supplementalsEnabled</td>';
            html += '    <td>closeoutsEnabled</td>';
            html += '    <td>bwRequestTypeId</td>';
            html += '    <td></td>';
            html += '    <td></td>';
            html += '  </tr>';

            var alternatingRow = 'light'; // Use this to color the rows.
            //debugger;
            if (!thiz.options.financialAreas) {
                html += '  <tr class="alternatingRowLight" style="cursor:pointer;">';
                html += '   <td colspan="5"><span style="color:tomato;">No data. Is the webservice responding correctly?</span></td>';
                html += '  </tr>';
            } else if (thiz.options.financialAreas.length == 0) {
                html += '  <tr class="alternatingRowLight" style="cursor:pointer;">';
                html += '   <td colspan="4"><span style="color:tomato;">No request types exist in the database.</span></td>';
                html += '  </tr>';
            } else {
                for (var i = 0; i < thiz.options.financialAreas.length; i++) {
                    if (alternatingRow == 'light') {
                        html += '  <tr class="alternatingRowLight" style="cursor:pointer;">';
                        alternatingRow = 'dark';
                    } else {
                        html += '  <tr class="alternatingRowDark" style="cursor:pointer;">';
                        alternatingRow = 'light';
                    }
                    html += '    <td>' + thiz.options.financialAreas[i].Abbreviation + '</td>';
                    html += '    <td>' + thiz.options.financialAreas[i].SingletonName + '</td>';
                    html += '    <td>' + thiz.options.financialAreas[i].PluralName + '</td>';



                    // id="switchbutton_bwFinancialAreasEditor_IsActive_bwRequestTypeId". 3-24-2023.

                    // Original, for isActive:
                    //html += '    <td>';
                    //html += '       <label for="configurationBehaviorEnable' + thiz.options.financialAreas[i].bwRequestTypeId + 'Slider"></label><input type="checkbox" name="configurationBehaviorEnable' + thiz.options.requestTypes[i].bwRequestTypeId + 'Slider" id="configurationBehaviorEnable' + thiz.options.requestTypes[i].bwRequestTypeId + 'Slider" />';
                    //html += '    </td>';


                    html += '    <td>';
                    html += '       <label for="switchbutton_bwFinancialAreasEditor_IsActive_bwRequestTypeId' + thiz.options.financialAreas[i].bwRequestTypeId + 'Slider"></label><input type="checkbox" name="switchbutton_bwFinancialAreasEditor_IsActive_bwRequestTypeId' + thiz.options.financialAreas[i].bwRequestTypeId + 'Slider" id="switchbutton_bwFinancialAreasEditor_IsActive_bwRequestTypeId' + thiz.options.financialAreas[i].bwRequestTypeId + 'Slider" />';
                    html += '    </td>';

                    // Added 8-10-2023.
                    html += '    <td>';
                    html += '       <label for="switchbutton_bwFinancialAreasEditor_HasWorkflow_bwRequestTypeId' + thiz.options.financialAreas[i].bwRequestTypeId + 'Slider"></label><input type="checkbox" name="switchbutton_bwFinancialAreasEditor_HasWorkflow_bwRequestTypeId' + thiz.options.financialAreas[i].bwRequestTypeId + 'Slider" id="switchbutton_bwFinancialAreasEditor_HasWorkflow_bwRequestTypeId' + thiz.options.financialAreas[i].bwRequestTypeId + 'Slider" />';
                    html += '    </td>';

                    html += '    <td>';
                    html += '       <label for="switchbutton_bwFinancialAreasEditor_SupplementalsEnabled_bwRequestTypeId' + thiz.options.financialAreas[i].bwRequestTypeId + 'Slider"></label><input type="checkbox" name="switchbutton_bwFinancialAreasEditor_SupplementalsEnabled_bwRequestTypeId' + thiz.options.financialAreas[i].bwRequestTypeId + 'Slider" id="switchbutton_bwFinancialAreasEditor_SupplementalsEnabled_bwRequestTypeId' + thiz.options.financialAreas[i].bwRequestTypeId + 'Slider" />';
                    html += '    </td>';

                    html += '    <td>';
                    html += '       <label for="switchbutton_bwFinancialAreasEditor_CloseoutsEnabled_bwRequestTypeId' + thiz.options.financialAreas[i].bwRequestTypeId + 'Slider"></label><input type="checkbox" name="switchbutton_bwFinancialAreasEditor_CloseoutsEnabled_bwRequestTypeId' + thiz.options.financialAreas[i].bwRequestTypeId + 'Slider" id="switchbutton_bwFinancialAreasEditor_CloseoutsEnabled_bwRequestTypeId' + thiz.options.financialAreas[i].bwRequestTypeId + 'Slider" />';
                    html += '    </td>';

                    html += '    <td>' + thiz.options.financialAreas[i].bwRequestTypeId + '</td>';

                    var isActive;
                    if (thiz.options.financialAreas[i].hasOwnProperty('isActive')) {
                        isActive = thiz.options.financialAreas[i].isActive;
                    }

                    var hasWorkflow; // This is how we are integrating this new field, which was added 8-9-2023.
                    if (thiz.options.financialAreas[i].hasOwnProperty('hasWorkflow')) {
                        hasWorkflow = thiz.options.financialAreas[i].hasWorkflow;

                        //alert('HAD THE PROPERTY hasWorkflow: ' + thiz.options.requestTypes[i].hasWorkflow);

                    } else {

                        // Keep this here because we have old data that needs to be detected and fixed up.
                        console.log('NO PROPERTY hasWorkflow for ' + thiz.options.financialAreas[i].Abbreviation + ': ' + thiz.options.financialAreas[i].hasWorkflow + '. THIS MUST BE OLDER DATA. TO REMEDIATE, RE-SAVE THIS REQUEST TYPE. 8-10-2023.');
                        displayAlertDialog('NO PROPERTY hasWorkflow for ' + thiz.options.financialAreas[i].Abbreviation + ': ' + thiz.options.financialAreas[i].hasWorkflow + '. THIS MUST BE OLDER DATA. TO REMEDIATE, RE-SAVE THIS REQUEST TYPE. 8-10-2023.');

                    }

                    html += '    <td><button class="BwSmallButton" onclick="$(\'.bwFinancialAreasEditor\').bwFinancialAreasEditor(\'editARequestType\', \'' + thiz.options.financialAreas[i].bwRequestTypeId + '\', \'' + isActive + '\', \'' + hasWorkflow + '\', \'' + thiz.options.financialAreas[i].Abbreviation + '\', \'' + thiz.options.financialAreas[i].SingletonName + '\', \'' + thiz.options.financialAreas[i].PluralName + '\');">edit</button></td>';
                    html += '    <td><img src="images/trash-can.png" onclick="$(\'.bwFinancialAreasEditor\').bwFinancialAreasEditor(\'deleteARequestType\', \'' + thiz.options.financialAreas[i].bwRequestTypeId + '\', \'' + isActive + '\', \'' + hasWorkflow + '\', \'' + thiz.options.financialAreas[i].Abbreviation + '\', \'' + thiz.options.financialAreas[i].SingletonName + '\', \'' + thiz.options.financialAreas[i].PluralName + '\');" title="Delete" style="cursor:pointer;" /></td>';
                    html += '  </tr>';
                }
            }
            html += '</table>';
            html += '<br />';
            html += '<input style="padding:5px 10px 5px 10px;" id="btnCreateRole2" onclick="$(\'.bwFinancialAreasEditor\').bwFinancialAreasEditor(\'addARequestType\');" type="button" value="Add a Request type...">';

            // Render the html. THIS WAY IS PREFERABLE COME BACK AND FIX SOMETIME
            thiz.element.html(html);

            // Hook up the switch buttons.
            for (var i = 0; i < thiz.options.financialAreas.length; i++) {


                //
                // IsActive slider/checkbox. 8-10-2023.
                //
                var configurationBehaviorOptions = {
                    checked: thiz.options.financialAreas[i].isActive, //bwEnabledRequestTypes.Details.BudgetRequests.Enabled, //quotingEnabled,
                    show_labels: true,         // Should we show the on and off labels?
                    labels_placement: "left",  // Position of the labels: "both", "left" or "right"
                    on_label: "YES",            // Text to be displayed when checked
                    off_label: "NO",          // Text to be displayed when unchecked
                    width: 50,                 // Width of the button in pixels
                    height: 22,                // Height of the button in pixels
                    button_width: 24,         // Width of the sliding part in pixels
                    clear_after: null         // Override the element after which the clearing div should be inserted 
                };
                $('input#switchbutton_bwFinancialAreasEditor_IsActive_bwRequestTypeId' + thiz.options.financialAreas[i].bwRequestTypeId + 'Slider').switchButton(configurationBehaviorOptions);

                $('#switchbutton_bwFinancialAreasEditor_IsActive_bwRequestTypeId' + thiz.options.financialAreas[i].bwRequestTypeId + 'Slider').change(function () {
                    try {

                        // Save this configuration change back to the database immediately. Don't notify the user unless an error is raised.
                        var bwRequestTypeId = this.id.split('switchbutton_bwFinancialAreasEditor_IsActive_bwRequestTypeId')[1].split('Slider')[0]; //'switchbutton_bwFinancialAreasEditor_IsActive_bwRequestTypeId' + thiz.options.financialAreas[i].bwRequestTypeId + 'Slider';
                        var isActive = this.checked; // This is what the user has just chosen to do.

                        var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                        requestTypeDetails = {
                            bwParticipantId_LoggedIn: participantId,
                            bwActiveStateIdentifier: activeStateIdentifier,
                            bwWorkflowAppId_LoggedIn: workflowAppId,

                            bwWorkflowAppId: workflowAppId,
                            bwRequestTypeId: bwRequestTypeId,
                            isActive: isActive, // This is the single property.
                            bwParticipantId: participantId,
                            bwParticipantFriendlyName: participantFriendlyName,
                            bwParticipantEmail: participantEmail
                        };

                        var operationUri = thiz.options.operationUriPrefix + "_bw/UpdateRequestTypeStatus_ForSingleProperty"; //bwworkflow/updateworkflowconfigurationbehaviorquotingenabled";
                        $.ajax({
                            url: operationUri,
                            type: "POST",
                            data: requestTypeDetails,
                            headers: {
                                "Accept": "application/json; odata=verbose"
                            },
                            success: function (result) {
                                try {

                                    if (result.message != 'SUCCESS') {
                                        displayAlertDialog(result.message);
                                    } else {

                                        //
                                        // THIS IS THE ONLY PLACE WE SHOULD BE READING IN ENABLED REQUEST TYPES. THIS IS A GLOBAL VARIABLE AND SHOULD BE REFERENCED EVERYWHERE ELSE!!!!!!!!!!!!!!!!!!!!!!!! 7-8-2020. my.renderWelcomeScreen()
                                        // (actually this also happens in Configuration > Settings, when the request types are turned on or off.)
                                        //
                                        //debugger;
                                        //bwEnabledRequestTypes.EnabledItems = [];
                                        //for (var rt = 0; rt < RequestTypesResult.RequestTypes.length; rt++) {
                                        //    if (RequestTypesResult.RequestTypes[rt].isActive == true) {
                                        //        var request = [RequestTypesResult.RequestTypes[rt].Abbreviation, RequestTypesResult.RequestTypes[rt].RequestType, RequestTypesResult.RequestTypes[rt].isActive, RequestTypesResult.RequestTypes[rt].bwRequestTypeId];
                                        //        bwEnabledRequestTypes.EnabledItems.push(request);
                                        //    }
                                        //}


                                        debugger;
                                        var bwEnabledRequestTypes = {
                                            EnabledItems: []
                                        }
                                        for (var rt = 0; rt < result.RequestTypes.length; rt++) {
                                            if (result.RequestTypes[rt].isActive == true) {
                                                //debugger;
                                                //var request = [RequestTypesResult.RequestTypes[rt].Abbreviation, RequestTypesResult.RequestTypes[rt].RequestType, RequestTypesResult.RequestTypes[rt].isActive, RequestTypesResult.RequestTypes[rt].bwRequestTypeId];
                                                var request = {
                                                    bwRequestTypeId: result.RequestTypes[rt].bwRequestTypeId,
                                                    isActive: result.RequestTypes[rt].isActive,
                                                    hasWorkflow: result.RequestTypes[rt].hasWorkflow,
                                                    Abbreviation: result.RequestTypes[rt].Abbreviation,
                                                    SingletonName: result.RequestTypes[rt].SingletonName,
                                                    PluralName: result.RequestTypes[rt].PluralName
                                                    //RequestType: RequestTypesResult.RequestTypes[rt].RequestType, // Removed 1-1-2022

                                                }
                                                bwEnabledRequestTypes.EnabledItems.push(request);
                                            }
                                        }
                                        // bwAuthentication is our source for this information, so update it .
                                        $('.bwAuthentication').bwAuthentication({ bwEnabledRequestTypes: bwEnabledRequestTypes });



                                    }
                                } catch (e) {
                                    console.log('Exception in renderFinancialAreasEditor.switchbutton_bwFinancialAreasEditor_IsActive_bwRequestTypeId.change():2: ' + e.message + ', ' + e.stack);
                                    displayAlertDialog('Exception in renderFinancialAreasEditor.switchbutton_bwFinancialAreasEditor_IsActive_bwRequestTypeId.change():2: ' + e.message + ', ' + e.stack);
                                }
                            },
                            error: function (data, errorCode, errorMessage) {
                                displayAlertDialog('Error in bwFinancialAreasEditor.renderFinancialAreasEditor.switchbutton_bwFinancialAreasEditor_IsActive_bwRequestTypeId.change():1: ' + errorCode + ' ' + errorMessage);
                            }
                        });
                    } catch (e) {
                        console.log('Exception in renderFinancialAreasEditor.switchbutton_bwFinancialAreasEditor_IsActive_bwRequestTypeId.change(): ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in renderFinancialAreasEditor.switchbutton_bwFinancialAreasEditor_IsActive_bwRequestTypeId.change(): ' + e.message + ', ' + e.stack);
                    }
                });
                //
                // end: IsActive slider/checkbox. 8-10-2023.
                //

                //
                // HasWorkflow slider/checkbox. 8-10-2023.
                //
                var configurationBehaviorOptions = {
                    checked: thiz.options.financialAreas[i].hasWorkflow, //bwEnabledRequestTypes.Details.BudgetRequests.Enabled, //quotingEnabled,
                    show_labels: true,         // Should we show the on and off labels?
                    labels_placement: "left",  // Position of the labels: "both", "left" or "right"
                    on_label: "YES",            // Text to be displayed when checked
                    off_label: "NO",          // Text to be displayed when unchecked
                    width: 50,                 // Width of the button in pixels
                    height: 22,                // Height of the button in pixels
                    button_width: 24,         // Width of the sliding part in pixels
                    clear_after: null         // Override the element after which the clearing div should be inserted 
                };
                $('input#switchbutton_bwFinancialAreasEditor_HasWorkflow_bwRequestTypeId' + thiz.options.financialAreas[i].bwRequestTypeId + 'Slider').switchButton(configurationBehaviorOptions);

                $('#switchbutton_bwFinancialAreasEditor_HasWorkflow_bwRequestTypeId' + thiz.options.financialAreas[i].bwRequestTypeId + 'Slider').change(function () {
                    try {

                        // Save this configuration change back to the database immediately. Don't notify the user unless an error is raised.
                        var bwRequestTypeId = this.id.split('switchbutton_bwFinancialAreasEditor_HasWorkflow_bwRequestTypeId')[1].split('Slider')[0];
                        var hasWorkflow = this.checked; // This is what the user has just chosen to do.

                        var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                        requestTypeDetails = {
                            bwParticipantId_LoggedIn: participantId,
                            bwActiveStateIdentifier: activeStateIdentifier,
                            bwWorkflowAppId_LoggedIn: workflowAppId,

                            bwWorkflowAppId: workflowAppId,
                            bwRequestTypeId: bwRequestTypeId,
                            hasWorkflow: hasWorkflow, // This is the single property.
                            bwParticipantId: participantId,
                            bwParticipantFriendlyName: participantFriendlyName,
                            bwParticipantEmail: participantEmail
                        };

                        var operationUri = thiz.options.operationUriPrefix + "_bw/UpdateRequestTypeStatus_ForSingleProperty";
                        $.ajax({
                            url: operationUri,
                            type: "POST",
                            data: requestTypeDetails,
                            headers: {
                                "Accept": "application/json; odata=verbose"
                            },
                            success: function (result) {
                                try {

                                    if (result.message != 'SUCCESS') {
                                        displayAlertDialog(result.message);
                                    } else {

                                        //
                                        // THIS IS THE ONLY PLACE WE SHOULD BE READING IN ENABLED REQUEST TYPES. THIS IS A GLOBAL VARIABLE AND SHOULD BE REFERENCED EVERYWHERE ELSE!!!!!!!!!!!!!!!!!!!!!!!! 7-8-2020. my.renderWelcomeScreen()
                                        // (actually this also happens in Configuration > Settings, when the request types are turned on or off.)
                                        //
                                        //debugger;
                                        //bwEnabledRequestTypes.EnabledItems = [];
                                        //for (var rt = 0; rt < RequestTypesResult.RequestTypes.length; rt++) {
                                        //    if (RequestTypesResult.RequestTypes[rt].isActive == true) {
                                        //        var request = [RequestTypesResult.RequestTypes[rt].Abbreviation, RequestTypesResult.RequestTypes[rt].RequestType, RequestTypesResult.RequestTypes[rt].isActive, RequestTypesResult.RequestTypes[rt].bwRequestTypeId];
                                        //        bwEnabledRequestTypes.EnabledItems.push(request);
                                        //    }
                                        //}


                                        debugger;
                                        var bwEnabledRequestTypes = {
                                            EnabledItems: []
                                        }
                                        for (var rt = 0; rt < result.RequestTypes.length; rt++) {
                                            if (result.RequestTypes[rt].isActive == true) {
                                                //debugger;
                                                //var request = [RequestTypesResult.RequestTypes[rt].Abbreviation, RequestTypesResult.RequestTypes[rt].RequestType, RequestTypesResult.RequestTypes[rt].isActive, RequestTypesResult.RequestTypes[rt].bwRequestTypeId];
                                                var request = {
                                                    bwRequestTypeId: result.RequestTypes[rt].bwRequestTypeId,
                                                    isActive: result.RequestTypes[rt].isActive,
                                                    hasWorkflow: result.RequestTypes[rt].hasWorkflow,
                                                    Abbreviation: result.RequestTypes[rt].Abbreviation,
                                                    SingletonName: result.RequestTypes[rt].SingletonName,
                                                    PluralName: result.RequestTypes[rt].PluralName
                                                    //RequestType: RequestTypesResult.RequestTypes[rt].RequestType, // Removed 1-1-2022

                                                }
                                                bwEnabledRequestTypes.EnabledItems.push(request);
                                            }
                                        }
                                        // bwAuthentication is our source for this information, so update it .
                                        $('.bwAuthentication').bwAuthentication({ bwEnabledRequestTypes: bwEnabledRequestTypes });

                                    }
                                } catch (e) {
                                    console.log('Exception in renderFinancialAreasEditor.switchbutton_bwFinancialAreasEditor_IsActive_bwRequestTypeId.change():2: ' + e.message + ', ' + e.stack);
                                    displayAlertDialog('Exception in renderFinancialAreasEditor.switchbutton_bwFinancialAreasEditor_IsActive_bwRequestTypeId.change():2: ' + e.message + ', ' + e.stack);
                                }
                            },
                            error: function (data, errorCode, errorMessage) {
                                displayAlertDialog('Error in bwFinancialAreasEditor.renderFinancialAreasEditor.switchbutton_bwFinancialAreasEditor_IsActive_bwRequestTypeId.change():2: ' + errorCode + ' ' + errorMessage);
                            }
                        });
                    } catch (e) {
                        console.log('Exception in renderFinancialAreasEditor.switchbutton_bwFinancialAreasEditor_IsActive_bwRequestTypeId.change(): ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in renderFinancialAreasEditor.switchbutton_bwFinancialAreasEditor_IsActive_bwRequestTypeId.change(): ' + e.message + ', ' + e.stack);
                    }
                });
                //
                // end: HasWorkflow slider/checkbox.
                //












                //
                // switchbutton_bwFinancialAreasEditor_SupplementalsEnabled_bwRequestTypeId
                //

                var configurationBehaviorOptions = {
                    checked: thiz.options.financialAreas[i].supplementalsEnabled, //bwEnabledRequestTypes.Details.BudgetRequests.Enabled, //quotingEnabled,
                    show_labels: true,         // Should we show the on and off labels?
                    labels_placement: "left",  // Position of the labels: "both", "left" or "right"
                    on_label: "YES",            // Text to be displayed when checked
                    off_label: "NO",          // Text to be displayed when unchecked
                    width: 50,                 // Width of the button in pixels
                    height: 22,                // Height of the button in pixels
                    button_width: 24,         // Width of the sliding part in pixels
                    clear_after: null         // Override the element after which the clearing div should be inserted 
                };
                $('input#switchbutton_bwFinancialAreasEditor_SupplementalsEnabled_bwRequestTypeId' + thiz.options.financialAreas[i].bwRequestTypeId + 'Slider').switchButton(configurationBehaviorOptions);

                $('#switchbutton_bwFinancialAreasEditor_SupplementalsEnabled_bwRequestTypeId' + thiz.options.financialAreas[i].bwRequestTypeId + 'Slider').change(function () {
                    try {

                        // Save this configuration change back to the database immediately. Don't notify the user unless an error is raised.
                        var bwRequestTypeId = this.id.split('switchbutton_bwFinancialAreasEditor_SupplementalsEnabled_bwRequestTypeId')[1].split('Slider')[0];
                        var supplementalsEnabled = this.checked; // This is what the user has just chosen to do.

                        var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
                        var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                        var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                        // Save this configuration change back to the database immediately. Don't notify the user unless an error is raised.
                        var bwRequestTypeId = this.id.split('switchbutton_bwFinancialAreasEditor_SupplementalsEnabled_bwRequestTypeId')[1].split('Slider')[0];
                        var closeoutsEnabled = this.checked; // This is what the user has just chosen to do.

                        requestTypeDetails = {
                            bwParticipantId_LoggedIn: participantId,
                            bwActiveStateIdentifier: activeStateIdentifier,
                            bwWorkflowAppId_LoggedIn: workflowAppId,

                            bwWorkflowAppId: workflowAppId,
                            bwRequestTypeId: bwRequestTypeId,
                            supplementalsEnabled: supplementalsEnabled,
                            bwParticipantId: participantId,
                            bwParticipantFriendlyName: participantFriendlyName,
                            bwParticipantEmail: participantEmail
                        };

                        var operationUri = thiz.options.operationUriPrefix + "_bw/UpdateRequestTypeStatus_ForSingleProperty";
                        $.ajax({
                            url: operationUri,
                            type: "POST",
                            data: requestTypeDetails,
                            headers: {
                                "Accept": "application/json; odata=verbose"
                            },
                            success: function (results) {
                                try {
                                    debugger;
                                    if (results.message != 'SUCCESS') {
                                        displayAlertDialog(results.message);
                                    } else {

                                        var bwEnabledRequestTypes = {
                                            EnabledItems: []
                                        }
                                        for (var rt = 0; rt < results.RequestTypes.length; rt++) {
                                            if (results.RequestTypes[rt].isActive == true) {
                                                //debugger;
                                                //var request = [RequestTypesResult.RequestTypes[rt].Abbreviation, RequestTypesResult.RequestTypes[rt].RequestType, RequestTypesResult.RequestTypes[rt].isActive, RequestTypesResult.RequestTypes[rt].bwRequestTypeId];
                                                var request = {
                                                    bwRequestTypeId: results.RequestTypes[rt].bwRequestTypeId,
                                                    isActive: results.RequestTypes[rt].isActive,
                                                    hasWorkflow: results.RequestTypes[rt].hasWorkflow,
                                                    supplementalsEnabled: results.RequestTypes[rt].supplementalsEnabled,
                                                    closeoutsEnabled: results.RequestTypes[rt].closeoutsEnabled,
                                                    Abbreviation: results.RequestTypes[rt].Abbreviation,
                                                    SingletonName: results.RequestTypes[rt].SingletonName,
                                                    PluralName: results.RequestTypes[rt].PluralName
                                                    //RequestType: RequestTypesResult.RequestTypes[rt].RequestType, // Removed 1-1-2022

                                                }
                                                bwEnabledRequestTypes.EnabledItems.push(request);
                                            }
                                        }

                                        var msg = 'xcx23123 set supplementalsEnabled: ' + supplementalsEnabled;
                                        // bwAuthentication is our source for this information, so update it .
                                        $('.bwAuthentication').bwAuthentication({ bwEnabledRequestTypes: bwEnabledRequestTypes });

                                    }
                                } catch (e) {
                                    console.log('Exception in renderFinancialAreasEditor.switchbutton_bwFinancialAreasEditor_SupplementalsEnabled_bwRequestTypeId.change():2: ' + e.message + ', ' + e.stack);
                                    displayAlertDialog('Exception in renderFinancialAreasEditor.switchbutton_bwFinancialAreasEditor_SupplementalsEnabled_bwRequestTypeId.change():2: ' + e.message + ', ' + e.stack);
                                }
                            },
                            error: function (data, errorCode, errorMessage) {
                                displayAlertDialog('Error in bwFinancialAreasEditor.renderFinancialAreasEditor.switchbutton_bwFinancialAreasEditor_SupplementalsEnabled_bwRequestTypeId.change(): ' + errorCode + ' ' + errorMessage);
                            }
                        });

                    } catch (e) {
                        console.log('Exception in renderFinancialAreasEditor.switchbutton_bwFinancialAreasEditor_SupplementalsEnabled_bwRequestTypeId.change(): ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in renderFinancialAreasEditor.switchbutton_bwFinancialAreasEditor_SupplementalsEnabled_bwRequestTypeId.change(): ' + e.message + ', ' + e.stack);
                    }
                });

                //
                // switchbutton_bwFinancialAreasEditor_CloseoutsEnabled_bwRequestTypeId
                //

                //var configurationBehaviorOptions = {
                //    checked: thiz.options.financialAreas[i].closeoutsEnabled, //bwEnabledRequestTypes.Details.BudgetRequests.Enabled, //quotingEnabled,
                //    show_labels: true,         // Should we show the on and off labels?
                //    labels_placement: "left",  // Position of the labels: "both", "left" or "right"
                //    on_label: "YES",            // Text to be displayed when checked
                //    off_label: "NO",          // Text to be displayed when unchecked
                //    width: 50,                 // Width of the button in pixels
                //    height: 22,                // Height of the button in pixels
                //    button_width: 24,         // Width of the sliding part in pixels
                //    clear_after: null         // Override the element after which the clearing div should be inserted 
                //};
                //$('input#switchbutton_bwFinancialAreasEditor_CloseoutsEnabled_bwRequestTypeId' + thiz.options.requestTypes[i].bwRequestTypeId + 'Slider').switchButton(configurationBehaviorOptions);

                //$('#switchbutton_bwFinancialAreasEditor_CloseoutsEnabled_bwRequestTypeId' + thiz.options.requestTypes[i].bwRequestTypeId + 'Slider').change(function () {
                //    try {

                //        var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
                //        var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                //        var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                //        // Save this configuration change back to the database immediately. Don't notify the user unless an error is raised.
                //        var bwRequestTypeId = this.id.split('switchbutton_bwFinancialAreasEditor_CloseoutsEnabled_bwRequestTypeId')[1].split('Slider')[0];
                //        var closeoutsEnabled = this.checked; // This is what the user has just chosen to do.

                //        requestTypeDetails = {
                //            bwParticipantId_LoggedIn: participantId,
                //            bwActiveStateIdentifier: activeStateIdentifier,
                //            bwWorkflowAppId_LoggedIn: workflowAppId,

                //            bwWorkflowAppId: workflowAppId,
                //            bwRequestTypeId: bwRequestTypeId,
                //            closeoutsEnabled: closeoutsEnabled,
                //            bwParticipantId: participantId,
                //            bwParticipantFriendlyName: participantFriendlyName,
                //            bwParticipantEmail: participantEmail
                //        };

                //        var operationUri = thiz.options.operationUriPrefix + "_bw/UpdateRequestTypeStatus_ForSingleProperty";
                //        $.ajax({
                //            url: operationUri,
                //            type: "POST",
                //            data: requestTypeDetails,
                //            headers: {
                //                "Accept": "application/json; odata=verbose"
                //            },
                //            success: function (results) {
                //                try {
                //                    debugger;
                //                    if (results.message != 'SUCCESS') {
                //                        displayAlertDialog(results.message);
                //                    } else {

                //                        var bwEnabledRequestTypes = {
                //                            EnabledItems: []
                //                        }
                //                        for (var rt = 0; rt < results.RequestTypes.length; rt++) {
                //                            if (results.RequestTypes[rt].isActive == true) {
                //                                //debugger;
                //                                //var request = [RequestTypesResult.RequestTypes[rt].Abbreviation, RequestTypesResult.RequestTypes[rt].RequestType, RequestTypesResult.RequestTypes[rt].isActive, RequestTypesResult.RequestTypes[rt].bwRequestTypeId];
                //                                var request = {
                //                                    bwRequestTypeId: results.RequestTypes[rt].bwRequestTypeId,
                //                                    isActive: results.RequestTypes[rt].isActive,
                //                                    hasWorkflow: results.RequestTypes[rt].hasWorkflow,
                //                                    supplementalsEnabled: results.RequestTypes[rt].supplementalsEnabled,
                //                                    closeoutsEnabled: results.RequestTypes[rt].closeoutsEnabled,
                //                                    Abbreviation: results.RequestTypes[rt].Abbreviation,
                //                                    SingletonName: results.RequestTypes[rt].SingletonName,
                //                                    PluralName: results.RequestTypes[rt].PluralName
                //                                    //RequestType: RequestTypesResult.RequestTypes[rt].RequestType, // Removed 1-1-2022

                //                                }
                //                                bwEnabledRequestTypes.EnabledItems.push(request);
                //                            }
                //                        }

                //                        var msg = 'xcx23123 set closeoutsEnabled: ' + closeoutsEnabled;
                //                        // bwAuthentication is our source for this information, so update it .
                //                        $('.bwAuthentication').bwAuthentication({ bwEnabledRequestTypes: bwEnabledRequestTypes });

                //                    }
                //                } catch (e) {
                //                    console.log('Exception in renderFinancialAreasEditor.switchbutton_bwFinancialAreasEditor_CloseoutsEnabled_bwRequestTypeId.change():2: ' + e.message + ', ' + e.stack);
                //                    displayAlertDialog('Exception in renderFinancialAreasEditor.switchbutton_bwFinancialAreasEditor_CloseoutsEnabled_bwRequestTypeId.change():2: ' + e.message + ', ' + e.stack);
                //                }
                //            },
                //            error: function (data, errorCode, errorMessage) {
                //                displayAlertDialog('Error in bwFinancialAreasEditor.renderFinancialAreasEditor.switchbutton_bwFinancialAreasEditor_CloseoutsEnabled_bwRequestTypeId.change(): ' + errorCode + ' ' + errorMessage);
                //            }
                //        });

                //    } catch (e) {
                //        console.log('Exception in renderFinancialAreasEditor.switchbutton_bwFinancialAreasEditor_CloseoutsEnabled_bwRequestTypeId.change(): ' + e.message + ', ' + e.stack);
                //        displayAlertDialog('Exception in renderFinancialAreasEditor.switchbutton_bwFinancialAreasEditor_CloseoutsEnabled_bwRequestTypeId.change(): ' + e.message + ', ' + e.stack);
                //    }
                //});

            }

        } catch (e) {
            console.log('Exception in renderFinancialAreasEditor(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in renderFinancialAreasEditor(): ' + e.message + ', ' + e.stack);
        }
    },
    cmdSaveFunctionalArea: function () {
        var ajaxSaveOperationType;
        //var successMessage;
        var errorMessage;
        var _functionalAreaId = '';
        //try {
        _functionalAreaId = $('#txtFunctionalAreaId').val();
        //displayAlertDialog('_functionalAreaId: ' + _functionalAreaId);
        //_functionalAreaId = $('span[xd\\:binding = "my:FunctionalAreaId"]')[0].innerHTML;

        // Convert this to an input box throughout.
        // It will be next to the title field, input box id=txtFunctionalAreaTitle


        if (_functionalAreaId != '') {
            ajaxSaveOperationType = 'POST';
            //successMessage = 'The functional area has been updated.';
            errorMessage = 'Error updating the functional area.';
        } else {
            ajaxSaveOperationType = 'PUT'; // The field doesn't exists so we are making a new one.
            //successMessage = 'The functional area has been created.';
            errorMessage = 'Error creating the functional area.';
        }


        //displayAlertDialog('ajaxSaveOperationType:' + ajaxSaveOperationType);


        //ajaxSaveOperationType = 'POST'; // POST is for updating.
        //successMessage = 'The functional area has been updated.';
        //errorMessage = 'Error updating the functional area.';
        //} catch (e) {
        //    ajaxSaveOperationType = 'PUT'; // The field doesn't exists so we are making a new one.
        //    //successMessage = 'The functional area has been created.';
        //    errorMessage = 'Error creating the functional area.';
        //}
        try {
            var title = $('#txtFunctionalAreaTitle').val();

            var isQuote = 'false';
            if (document.getElementById('cbFunctionalAreaQuote').checked) { // Yields a bool, true or false.
                isQuote = 'true';
            }

            //var year = 2016; // $('#txtFunctionalAreaYear').val(); todd:hardcoded.
            var year = new Date().getFullYear().toString(); // todd hardcoded.
            var yearlyBudget = $('#txtFunctionalAreaYearlyBudget').val().replace(/[^0-9-.]/g, '');

            //
            //
            // THE 2 VARIABLES BELOW NEED TO GET THE USER ID #. IT NEEDS TO BE STORED SOMEWHERE ON THE PAGE SO WE CAN GET AT IT!!!!!!!
            //
            //
            var approver1Id = $('#txtApprover1Id').val();
            var approver1FriendlyName = $('#txtApprover1FriendlyName').val();
            var approver1Email = $('#txtApprover1Email').val();
            var approver2Id = $('#txtApprover2Id').val();
            var approver2FriendlyName = $('#txtApprover2FriendlyName').val();
            var approver2Email = $('#txtApprover2Email').val();
            var approver3Id;
            var approver3FriendlyName;
            var approver3Email;
            var approver4Id;
            var approver4FriendlyName;
            var approver4Email;
            var approver5Id;
            var approver5FriendlyName;
            var approver5Email;
            var approver6Id;
            var approver6FriendlyName;
            var approver6Email;
            var approver7Id;
            var approver7FriendlyName;
            var approver7Email;
            var approver8Id;
            var approver8FriendlyName;
            var approver8Email;
            var approver9Id;
            var approver9FriendlyName;
            var approver9Email;
            var approver10Id;
            var approver10FriendlyName;
            var approver10Email;
            var approval3BudgetThreshold;
            var approval4BudgetThreshold;
            var approval5BudgetThreshold;
            var approval6BudgetThreshold;
            var approval7BudgetThreshold;
            var approval8BudgetThreshold;
            var approval9BudgetThreshold;
            var approval10BudgetThreshold;
            // Now populate the values for what has been entered.
            try {
                for (var i = 3; i < 11; i++) {
                    //var idFieldName = 'approver' + i + 'Id';
                    //var budgetThresholdFieldName = 'approval' + i + 'BudgetThreshold';
                    //var friendlyNameFieldName = 'approver' + i + 'FriendlyName';
                    //var emailFieldName = 'approver' + i + 'Email';
                    if (i == 3) {
                        if (document.getElementById('txtApprover3Id') != null) {
                            approver3Id = $('#txtApprover' + i + 'Id').val();
                            approver3FriendlyName = $('#txtApprover' + i + 'FriendlyName').val();
                            approver3Email = $('#txtApprover' + i + 'Email').val();
                            //approval3BudgetThreshold = $('#txtApprover' + i + 'BudgetThreshold').val();
                            //approval3BudgetThreshold = parseFloat($('#txtApprover' + i + 'BudgetThreshold').val().replace(/[^0-9-.]/g, ''));
                            approval3BudgetThreshold = parseFloat($('span[xd\\:binding="my:Approval' + i + 'BudgetThreshold"]')[0].innerHTML.replace(/[^0-9-.]/g, ''));
                        }
                    } else if (i == 4) {
                        if (document.getElementById('txtApprover4Id') != null) {
                            approver4Id = $('#txtApprover' + i + 'Id').val();
                            approver4FriendlyName = $('#txtApprover' + i + 'FriendlyName').val();
                            approver4Email = $('#txtApprover' + i + 'Email').val();
                            //approval4BudgetThreshold = $('#txtApprover' + i + 'BudgetThreshold').val();
                            //approval4BudgetThreshold = parseFloat($('#txtApprover' + i + 'BudgetThreshold').val().replace(/[^0-9-.]/g, ''));
                            approval4BudgetThreshold = parseFloat($('span[xd\\:binding="my:Approval' + i + 'BudgetThreshold"]')[0].innerHTML.replace(/[^0-9-.]/g, ''));
                        }
                    }
                    else if (i == 5) {
                        if (document.getElementById('txtApprover5Id') != null) {
                            approver5Id = $('#txtApprover' + i + 'Id').val();
                            approver5FriendlyName = $('#txtApprover' + i + 'FriendlyName').val();
                            approver5Email = $('#txtApprover' + i + 'Email').val();
                            //approval5BudgetThreshold = $('#txtApprover' + i + 'BudgetThreshold').val();
                            //approval5BudgetThreshold = parseFloat($('#txtApprover' + i + 'BudgetThreshold').val().replace(/[^0-9-.]/g, ''));
                            approval5BudgetThreshold = parseFloat($('span[xd\\:binding="my:Approval' + i + 'BudgetThreshold"]')[0].innerHTML.replace(/[^0-9-.]/g, ''));
                        }
                    }
                    else if (i == 6) {
                        if (document.getElementById('txtApprover6Id') != null) {
                            approver6Id = $('#txtApprover' + i + 'Id').val();
                            approver6FriendlyName = $('#txtApprover' + i + 'FriendlyName').val();
                            approver6Email = $('#txtApprover' + i + 'Email').val();
                            //approval6BudgetThreshold = $('#txtApprover' + i + 'BudgetThreshold').val();
                            //approval6BudgetThreshold = parseFloat($('#txtApprover' + i + 'BudgetThreshold').val().replace(/[^0-9-.]/g, ''));
                            approval6BudgetThreshold = parseFloat($('span[xd\\:binding="my:Approval' + i + 'BudgetThreshold"]')[0].innerHTML.replace(/[^0-9-.]/g, ''));
                        }
                    }
                    else if (i == 7) {
                        if (document.getElementById('txtApprover7Id') != null) {
                            approver7Id = $('#txtApprover' + i + 'Id').val();
                            approver7FriendlyName = $('#txtApprover' + i + 'FriendlyName').val();
                            approver7Email = $('#txtApprover' + i + 'Email').val();
                            //approval7BudgetThreshold = $('#txtApprover' + i + 'BudgetThreshold').val();
                            //approval7BudgetThreshold = parseFloat($('#txtApprover' + i + 'BudgetThreshold').val().replace(/[^0-9-.]/g, ''));
                            approval7BudgetThreshold = parseFloat($('span[xd\\:binding="my:Approval' + i + 'BudgetThreshold"]')[0].innerHTML.replace(/[^0-9-.]/g, ''));
                        }
                    }
                    else if (i == 8) {
                        if (document.getElementById('txtApprover8Id') != null) {
                            approver8Id = $('#txtApprover' + i + 'Id').val();
                            approver8FriendlyName = $('#txtApprover' + i + 'FriendlyName').val();
                            approver8Email = $('#txtApprover' + i + 'Email').val();
                            //approval8BudgetThreshold = $('#txtApprover' + i + 'BudgetThreshold').val();
                            //approval8BudgetThreshold = parseFloat($('#txtApprover' + i + 'BudgetThreshold').val().replace(/[^0-9-.]/g, ''));
                            approval8BudgetThreshold = parseFloat($('span[xd\\:binding="my:Approval' + i + 'BudgetThreshold"]')[0].innerHTML.replace(/[^0-9-.]/g, ''));
                        }
                    }
                    else if (i == 9) {
                        if (document.getElementById('txtApprover9Id') != null) {
                            approver9Id = $('#txtApprover' + i + 'Id').val();
                            approver9FriendlyName = $('#txtApprover' + i + 'FriendlyName').val();
                            approver9Email = $('#txtApprover' + i + 'Email').val();
                            //approval9BudgetThreshold = $('#txtApprover' + i + 'BudgetThreshold').val();
                            //approval9BudgetThreshold = parseFloat($('#txtApprover' + i + 'BudgetThreshold').val().replace(/[^0-9-.]/g, ''));
                            approval9BudgetThreshold = parseFloat($('span[xd\\:binding="my:Approval' + i + 'BudgetThreshold"]')[0].innerHTML.replace(/[^0-9-.]/g, ''));
                        }
                    }
                    else if (i == 10) {
                        if (document.getElementById('txtApprover10Id') != null) {
                            approver10Id = $('#txtApprover' + i + 'Id').val();
                            approver10FriendlyName = $('#txtApprover' + i + 'FriendlyName').val();
                            approver10Email = $('#txtApprover' + i + 'Email').val();
                            //approval10BudgetThreshold = parseFloat($('#txtApprover' + i + 'BudgetThreshold').val().replace(/[^0-9-.]/g, ''));
                            approval10BudgetThreshold = parseFloat($('span[xd\\:binding="my:Approval' + i + 'BudgetThreshold"]')[0].innerHTML.replace(/[^0-9-.]/g, ''));
                        }
                    }
                }
            } catch (e) {
                // Todd: We may need to do something here, not sure.
                handleExceptionWithAlert('Error in my.js.cmdSaveFunctionalArea():1:', e.message);
            }
            // Now that we have all the values that were entered, save them!
            var _functionalArea = [];
            _functionalArea = {
                bwFunctionalAreaId: _functionalAreaId,
                bwTenantId: tenantId,
                bwWorkflowAppId: workflowAppId,
                bwFunctionalAreaTitle: title,
                bwFunctionalAreaQuote: isQuote,
                bwFunctionalAreaYear: year,
                bwFunctionalAreaYearlyBudget: yearlyBudget,
                Approver1Id: approver1Id,
                Approver1FriendlyName: approver1FriendlyName,
                Approver1Email: approver1Email,
                Approver2Id: approver2Id,
                Approver2FriendlyName: approver2FriendlyName,
                Approver2Email: approver2Email,
                Approver3Id: approver3Id,
                Approver3FriendlyName: approver3FriendlyName,
                Approver3Email: approver3Email,
                Approver4Id: approver4Id,
                Approver4FriendlyName: approver4FriendlyName,
                Approver4Email: approver4Email,
                Approver5Id: approver5Id,
                Approver5FriendlyName: approver5FriendlyName,
                Approver5Email: approver5Email,
                Approver6Id: approver6Id,
                Approver6FriendlyName: approver6FriendlyName,
                Approver6Email: approver6Email,
                Approver7Id: approver7Id,
                Approver7FriendlyName: approver7FriendlyName,
                Approver7Email: approver7Email,
                Approver8Id: approver8Id,
                Approver8FriendlyName: approver8FriendlyName,
                Approver8Email: approver8Email,
                Approver9Id: approver9Id,
                Approver9FriendlyName: approver9FriendlyName,
                Approver9Email: approver9Email,
                Approver10Id: approver10Id,
                Approver10FriendlyName: approver10FriendlyName,
                Approver10Email: approver10Email,
                Approval3BudgetThreshold: approval3BudgetThreshold,
                Approval4BudgetThreshold: approval4BudgetThreshold,
                Approval5BudgetThreshold: approval5BudgetThreshold,
                Approval6BudgetThreshold: approval6BudgetThreshold,
                Approval7BudgetThreshold: approval7BudgetThreshold,
                Approval8BudgetThreshold: approval8BudgetThreshold,
                Approval9BudgetThreshold: approval9BudgetThreshold,
                Approval10BudgetThreshold: approval10BudgetThreshold
            };
            var operationUri = webserviceurl + "/bwfunctionalareas";
            $.ajax({
                url: operationUri,
                //type: "POST", timeout: ajaxTimeout,
                type: ajaxSaveOperationType,
                data: _functionalArea,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (data) {
                    displayAlertDialog(data);
                    // NOW WE NEED TO UPDATE THE FA IN BWMData.
                    for (var i = 0; i < BWMData[0].length; i++) {
                        if (BWMData[0][i][0] == workflowAppId) {
                            for (var x = 0; x < BWMData[0][i][4].length; x++) {
                                if (BWMData[0][i][4][x][0] == _functionalAreaId) {
                                    // This is the FInancial Area we have been looking for.
                                    var approver1item = [approver1Id, approver1FriendlyName, approver1Email];
                                    var approver2item = [approver2Id, approver2FriendlyName, approver2Email];
                                    var approver3item = [approver3Id, approver3FriendlyName, approver3Email, approval3BudgetThreshold];
                                    var approver4item = [approver4Id, approver4FriendlyName, approver4Email, approval4BudgetThreshold];
                                    var approver5item = [approver5Id, approver5FriendlyName, approver5Email, approval5BudgetThreshold];
                                    var approver6item = [approver6Id, approver6FriendlyName, approver6Email, approval6BudgetThreshold];
                                    var approver7item = [approver7Id, approver7FriendlyName, approver7Email, approval7BudgetThreshold];
                                    var approver8item = [approver8Id, approver8FriendlyName, approver8Email, approval8BudgetThreshold];
                                    var approver9item = [approver9Id, approver9FriendlyName, approver9Email, approval9BudgetThreshold];
                                    var approver10item = [approver10Id, approver10FriendlyName, approver10Email, approval10BudgetThreshold];
                                    var _additionalApprovers = [approver3item, approver4item, approver5item, approver6item, approver7item, approver8item, approver9item, approver10item];
                                    //
                                    BWMData[0][i][4][x][1] = title;
                                    BWMData[0][i][4][x][2] = quote;
                                    BWMData[0][i][4][x][4] = yearlyBudget;
                                    BWMData[0][i][4][x][5] = approver1item;
                                    BWMData[0][i][4][x][6] = approver2item;
                                    BWMData[0][i][4][x][7] = _additionalApprovers;

                                    //var faItem = [faData.d.results[i].bwFunctionalAreaId, faData.d.results[i].bwFunctionalAreaTitle, faData.d.results[i].bwFunctionalAreaQuote, Number(faData.d.results[i].bwFunctionalAreaYear), Number(faData.d.results[i].bwFunctionalAreaYearlyBudget), approver1item, approver2item, _additionalApprovers, 0, 0, 0, _overdueTasks];
                                    //BWMData[0][deferredIndex][4][i] = faItem;
                                }
                            }
                        }
                    }
                    // AT THIS POINT WE NEED TO RE-RENDER THE FINANCIAL AREAS SECTION.
                    populateStartPageItem('divFunctionalAreas', 'Reports', '');
                },
                error: function (data, errorCode, errorMessage) {
                    displayAlertDialog('Error in my.js.cmdSaveFunctionalArea():2:' + errorMessage + ' ' + JSON.stringify(data));
                    //WriteToErrorLog('Error in InitBudgetRequest.js.cmdCreateBudgetRequest()', 'Error creating the budget request in budgetrequests library: ' + errorCode + ', ' + errorMessage);
                }
            });
        } catch (e) {
            handleExceptionWithAlert('Error in my.js.cmdSaveFunctionalArea():3:', e.message);
        }
    },
    cmdImmediatelyDeleteFunctionalArea: function (_functionalAreaId) {
        var data = [];
        data = {
            bwFunctionalAreaId: _functionalAreaId
        };
        var operationUri = webserviceurl + "/bwfunctionalareas/deletefunctionalarea";
        $.ajax({
            url: operationUri,
            type: "POST", timeout: ajaxTimeout,
            data: data,
            headers: {
                "Accept": "application/json; odata=verbose"
            },
            success: function (data) {
                displayAlertDialog(data);
            },
            error: function (data, errorCode, errorMessage) {
                //handleExceptionWithAlert('Error in Start.js.displayConnectedWorkflows()', '1:' + errorCode + ', ' + errorMessage);
                displayAlertDialog('Error in my.js.cmdImmediatelyDeleteFunctionalArea(): ' + errorMessage);
            }
        });
    },
    cmdImmediatelyHideFunctionalArea: function (_functionalAreaId) {
        var data = [];
        data = {
            bwFunctionalAreaId: _functionalAreaId,
            IsHidden: 'true', // This is the value which hides the Financial Area.
            ModifiedByFriendlyName: participantFriendlyName,
            ModifiedById: participantId,
            ModifiedByEmail: participantEmail
        };
        var operationUri = webserviceurl + "/bwfunctionalareas/hideorshowfunctionalarea";
        $.ajax({
            url: operationUri,
            type: "POST", timeout: ajaxTimeout,
            data: data,
            headers: {
                "Accept": "application/json; odata=verbose"
            },
            success: function (data) {
                displayAlertDialog(data);
            },
            error: function (data, errorCode, errorMessage) {
                //handleExceptionWithAlert('Error in Start.js.displayConnectedWorkflows()', '1:' + errorCode + ', ' + errorMessage);
                displayAlertDialog('Error in my.js.cmdImmediatelyHideFunctionalArea(): ' + errorMessage);
            }
        });
    },
    cmdDeleteFunctionalArea: function () {
        try {
            var _functionalAreaId = $('span[xd\\:binding = "my:FunctionalAreaId"]')[0].innerHTML;
            //displayAlertDialog('faid:' + _functionalAreaId);
            var data = [];
            data = {
                bwFunctionalAreaId: _functionalAreaId
            };
            var operationUri = webserviceurl + "/bwworkflow/removeafinancialarea";
            $.ajax({
                url: operationUri,
                type: "POST", timeout: ajaxTimeout,
                data: data,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (data) {
                    if (data.NumberOfBudgetRequests == 0) {
                        // There are no dependencies, so delete it.
                        var proceed = confirm('This action cannot be undone.\n\n\nClick the OK button to delete this Financial Area...');
                        if (proceed) {
                            cmdImmediatelyDeleteFunctionalArea(_functionalAreaId);
                            populateStartPageItem('divFunctionalAreas', 'Reports', '');
                        }
                    } else {
                        // There are Budget Requests, so all we can do is hide it.
                        var proceed = confirm('There are ' + data.NumberOfBudgetRequests + ' Budget Request(s) that use this Financial Area.\n\nTherefore you can\'t delete it, but you can prevent it from showing up on New Budget Requests.\n\n\nClick the OK button to HIDE this Financial Area...');
                        if (proceed) {
                            cmdImmediatelyHideFunctionalArea(_functionalAreaId);
                            populateStartPageItem('divFunctionalAreas', 'Reports', '');
                        }
                    }

                    //resultText += 'There are ' + brResult.length + ' Budget Requests that use this Financial Area.\n\n';
                    //resultText += 'You cannot delete this Financial Area, but you can choose to hide it so that it is not used in the future.\n\n';
                    //response.send(resultText);
                },
                error: function (data, errorCode, errorMessage) {
                    //handleExceptionWithAlert('Error in Start.js.displayConnectedWorkflows()', '1:' + errorCode + ', ' + errorMessage);
                    displayAlertDialog('Error in my.js.cmdDeleteFunctionalArea(): ' + errorMessage);
                }
            });
        } catch (e) {
            displayAlertDialog('Error in cmdDeleteFunctionalArea(): ' + e.message);
        }
    },

































    addARequestType: function () {
        try {
            console.log('In addARequestType().');
            var thiz = this;
            $('#divManageRequestTypeDialog').find('#spanAddAnOrgItemDialogTitle')[0].innerHTML = 'Add a new Request Type';
            $('#divManageRequestTypeDialog').find('#divManageRequestTypeDialogSubmitButton')[0].innerHTML = 'Add the new Request Type';

            $('#divManageRequestTypeDialog').find('#txtManageRequestTypeDialog_SingletonName')[0].value = '';
            $('#divManageRequestTypeDialog').find('#txtManageRequestTypeDialog_PluralName')[0].value = '';

            $('#divManageRequestTypeDialog').find('#txtManageRequestTypeDialog_Abbreviation')[0].value = '';
            $('#divManageRequestTypeDialog').find('#txtManageRequestTypeDialog_Id')[0].value = '';

            var abbreviationElement = $('#divManageRequestTypeDialog').find('#txtManageRequestTypeDialog_Abbreviation');
            $(abbreviationElement).removeAttr('disabled');

            //
            // ToDo: Add the click event to this Save button!
            //
            $("#divManageRequestTypeDialog").dialog({
                modal: true,
                resizable: false,
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                width: '500',
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {
                    $('.ui-widget-overlay').bind('click', function () {
                        $("#divManageRequestTypeDialog").dialog('close');
                    });
                },
                close: function () {
                    $('#divManageRequestTypeDialog').dialog('destroy');
                }
            });
            //$("#divManageRequestTypeDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

            $('#divManageRequestTypeDialogSubmitButton').off('click').click(function (error) {
                try {
                    debugger;
                    console.log('In bwFinancialAreasEditor.js.addARequestType.divManageRequestTypeDialogSubmitButton.click(). xcx246-1');

                    var isActive = document.getElementById('checkboxManageRequestTypeDialog_Active').checked;
                    var hasWorkflow = document.getElementById('checkboxManageRequestTypeDialog_HasWorkflow').checked;

                    var SingletonName = $('#divManageRequestTypeDialog').find('#txtManageRequestTypeDialog_SingletonName').val().trim();
                    var PluralName = $('#divManageRequestTypeDialog').find('#txtManageRequestTypeDialog_PluralName').val().trim();

                    var abbreviation = $('#divManageRequestTypeDialog').find('#txtManageRequestTypeDialog_Abbreviation').val().trim();
                    if (SingletonName.length > 2 && PluralName.length > 2 && abbreviation.length > 1) {
                        // Save the new project type entry.

                        //var tenantId = $('.bwAuthentication').bwAuthentication('option', 'tenantId');
                        var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                        var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
                        var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
                        var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

                        var bwRequestTypeId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                            return v.toString(16);
                        });

                        var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                        var data = {
                            bwParticipantId_LoggedIn: participantId,
                            bwActiveStateIdentifier: activeStateIdentifier,
                            bwWorkflowAppId_LoggedIn: workflowAppId,

                            //bwTenantId: tenantId,
                            bwWorkflowAppId: workflowAppId,
                            bwParticipantId: participantId,
                            bwParticipantFriendlyName: participantFriendlyName,
                            bwParticipantEmail: participantEmail,
                            bwRequestTypeId: bwRequestTypeId,
                            Abbreviation: abbreviation,
                            //RequestType: requestType,

                            isActive: isActive,
                            hasWorkflow: hasWorkflow,

                            SingletonName: SingletonName,
                            PluralName: PluralName
                        };
                        $.ajax({
                            url: thiz.options.operationUriPrefix + "_bw/AddARequestType", // SaveRequestType", // changed 8-11-2023.
                            type: "Post",
                            data: data,
                            headers: {
                                "Accept": "application/json; odata=verbose"
                            }
                        }).success(function (results) {
                            try {

                                if (results.status != 'SUCCESS') {

                                    thiz.displayAlertDialog('ERROR: ' + results.message);

                                } else {
                                    //thiz.options.requestTypes.push(requestTypeJson); // This updates the widget data.

                                    thiz.options.requestTypes = results.data;

                                    $("#divManageRequestTypeDialog").dialog('close');
                                    thiz.renderRequestTypeEditor();
                                }
                            } catch (e) {
                                console.log('Exception in addARequestType.SaveRequestType: ' + e.message + ', ' + e.stack);
                                alert('Exception in addARequestType.SaveRequestType: ' + e.message + ', ' + e.stack);
                            }
                        }).error(function (data, errorCode, errorMessage) {
                            //thiz.hideProgress();
                            var msg;
                            if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                                msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                            } else {
                                msg = JSON.stringify(data) + ', json: ' + JSON.stringify(json);
                            }
                            console.log('Fail in addARequestType.SaveRequestType: ' + JSON.stringify(data) + ', json: ' + JSON.stringify(json));
                            alert('Fail in addARequestType.SaveRequestType: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                            //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                            //var error = JSON.parse(data.responseText)["odata.error"];
                            //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
                        });
                    } else {
                        alert('Please enter names (3 characters or more) and an abbreviation (2 characters or more).');
                    }
                } catch (e) {
                    console.log('Exception in addARequestType.click(): ' + e.message + ', ' + e.stack);
                    displayAlertDialog('Exception in addARequestType.click(): ' + e.message + ', ' + e.stack);
                }
            });

        } catch (e) {
            console.log('Exception in addARequestType(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in addARequestType(): ' + e.message + ', ' + e.stack);
        }
    },
    editARequestType: function (bwRequestTypeId, isActive, hasWorkflow, Abbreviation, SingletonName, PluralName) {
        try {
            console.log('In editARequestType(). bwRequestTypeId: ' + bwRequestTypeId);
            var thiz = this;

            $('#divManageRequestTypeDialog').find('#spanAddAnOrgItemDialogTitle')[0].innerHTML = 'Edit this Request Type';
            $('#divManageRequestTypeDialog').find('#divManageRequestTypeDialogSubmitButton')[0].innerHTML = 'Save the Request Type';

            //$('#divManageRequestTypeDialog').find('#txtManageRequestTypeDialog_Name')[0].value = RequestType;

            $('#divManageRequestTypeDialog').find('#txtManageRequestTypeDialog_SingletonName')[0].value = SingletonName; // 12-31-2021
            $('#divManageRequestTypeDialog').find('#txtManageRequestTypeDialog_PluralName')[0].value = PluralName; // 12-31-2021

            $('#divManageRequestTypeDialog').find('#txtManageRequestTypeDialog_Abbreviation')[0].value = Abbreviation;
            $('#divManageRequestTypeDialog').find('#txtManageRequestTypeDialog_Id')[0].value = bwRequestTypeId;

            if (hasWorkflow == 'true') {
                document.getElementById('checkboxManageRequestTypeDialog_HasWorkflow').setAttribute('checked', 'checked');
            } else {
                document.getElementById('checkboxManageRequestTypeDialog_HasWorkflow').removeAttribute('checked');
            }

            if (isActive == 'true') {
                document.getElementById('checkboxManageRequestTypeDialog_Active').setAttribute('checked', 'checked');
            } else {
                document.getElementById('checkboxManageRequestTypeDialog_Active').removeAttribute('checked');
            }

            var abbreviationElement = $('#divManageRequestTypeDialog').find('#txtManageRequestTypeDialog_Abbreviation');
            $(abbreviationElement).attr('disabled', 'disabled');

            //
            // ToDo: Add the click event to this Save button!
            //
            $("#divManageRequestTypeDialog").dialog({
                modal: true,
                resizable: false,
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                width: '500',
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {
                    $('.ui-widget-overlay').bind('click', function () {
                        $("#divManageRequestTypeDialog").dialog('close');
                    });
                },
                close: function () {
                    $('#divManageRequestTypeDialog').dialog('destroy');
                }
            });
            //$("#divManageRequestTypeDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

            $('#divManageRequestTypeDialogSubmitButton').off('click').click(function (error) {
                try {
                    console.log('In editARequestType.divManageRequestTypeDialogSubmitButton.click().');

                    var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                    var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
                    var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
                    var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

                    var isActive = document.getElementById('checkboxManageRequestTypeDialog_Active').checked;
                    var hasWorkflow = document.getElementById('checkboxManageRequestTypeDialog_HasWorkflow').checked;

                    var SingletonName = $('#divManageRequestTypeDialog').find('#txtManageRequestTypeDialog_SingletonName').val().trim(); // 12-31-2021
                    var PluralName = $('#divManageRequestTypeDialog').find('#txtManageRequestTypeDialog_PluralName').val().trim(); // 12-31-2021

                    var abbreviation = $('#divManageRequestTypeDialog').find('#txtManageRequestTypeDialog_Abbreviation').val().trim();
                    var bwRequestTypeId = $('#divManageRequestTypeDialog').find('#txtManageRequestTypeDialog_Id').val().trim();

                    if (SingletonName.length > 2 && PluralName.length > 2 && abbreviation.length > 1) {

                        var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                        var data = {
                            bwParticipantId_LoggedIn: participantId,
                            bwActiveStateIdentifier: activeStateIdentifier,
                            bwWorkflowAppId_LoggedIn: workflowAppId,

                            bwWorkflowAppId: workflowAppId,
                            bwParticipantId: participantId,
                            bwParticipantFriendlyName: participantFriendlyName,
                            bwParticipantEmail: participantEmail,
                            bwRequestTypeId: bwRequestTypeId,
                            Abbreviation: abbreviation,

                            SingletonName: SingletonName,
                            PluralName: PluralName,

                            isActive: isActive,
                            hasWorkflow: hasWorkflow
                        };

                        $.ajax({
                            url: thiz.options.operationUriPrefix + "_bw/EditRequestType",
                            type: "Post",
                            data: data,
                            headers: {
                                "Accept": "application/json; odata=verbose"
                            }
                        }).success(function (results) {
                            try {

                                if (results.status == 'CONFIRM_DELETION') {

                                    alert(results.message);

                                } else if (results.status != 'SUCCESS') {

                                    thiz.displayAlertDialog('ERROR: ' + results.message);

                                } else {

                                    // SUCCESS

                                    thiz.displayAlertDialog('Saved successfully.'); // ' + JSON.stringify(results.mod));

                                    // This updates the widget data.
                                    //for (var i = 0; i < thiz.options.requestTypes.length; i++) {
                                    //    if (thiz.options.requestTypes[i].bwRequestTypeId == bwRequestTypeId) {
                                    //        thiz.options.requestTypes[i].Abbreviation = abbreviation;
                                    //        thiz.options.requestTypes[i].RequestType = requestType;

                                    //        thiz.options.requestTypes[i].SingletonName = SingletonName;
                                    //        thiz.options.requestTypes[i].PluralName = PluralName;
                                    //        break;
                                    //    }
                                    //}
                                    thiz.options.requestTypes = results.data;

                                    $("#divManageRequestTypeDialog").dialog('close');
                                    thiz.renderRequestTypeEditor();

                                }
                            } catch (e) {
                                console.log('Exception in editARequestType.SaveRequestType: ' + e.message + ', ' + e.stack);
                                alert('Exception in editARequestType.SaveRequestType: ' + e.message + ', ' + e.stack);
                            }
                        }).error(function (data, errorCode, errorMessage) {

                            var msg;
                            if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                                msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                            } else {
                                msg = JSON.stringify(data) + ', json: ' + JSON.stringify(json);
                            }
                            console.log('Fail in editARequestType.SaveRequestType: ' + JSON.stringify(data) + ', json: ' + JSON.stringify(json));
                            alert('Fail in editARequestType.SaveRequestType: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                            //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                            //var error = JSON.parse(data.responseText)["odata.error"];
                            //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
                        });
                    } else {
                        alert('Please enter names (3 characters or more) and an abbreviation (2 characters or more).');
                    }
                } catch (e) {
                    console.log('Exception in editARequestType.click(): ' + e.message + ', ' + e.stack);
                    displayAlertDialog('Exception in editARequestType.click(): ' + e.message + ', ' + e.stack);
                }
            });

        } catch (e) {
            console.log('Exception in editARequestType(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in editARequestType(): ' + e.message + ', ' + e.stack);
        }
    },
    deleteARequestType: function (bwRequestTypeId, isActive, hasWorkflow, Abbreviation, SingletonName, PluralName) {
        try {
            console.log('In deleteARequestType(). bwRequestTypeId: ' + bwRequestTypeId);
            var thiz = this;

            $('#divManageRequestTypeDialog').find('#spanAddAnOrgItemDialogTitle')[0].innerHTML = 'Delete this Request Type';
            $('#divManageRequestTypeDialog').find('#divManageRequestTypeDialogSubmitButton')[0].innerHTML = 'Delete the Request Type';

            //$('#divManageRequestTypeDialog').find('#txtManageRequestTypeDialog_Name')[0].value = RequestType;
            $('#divManageRequestTypeDialog').find('#txtManageRequestTypeDialog_SingletonName')[0].value = SingletonName;
            $('#divManageRequestTypeDialog').find('#txtManageRequestTypeDialog_PluralName')[0].value = PluralName;

            $('#divManageRequestTypeDialog').find('#txtManageRequestTypeDialog_Abbreviation')[0].value = Abbreviation;
            $('#divManageRequestTypeDialog').find('#txtManageRequestTypeDialog_Id')[0].value = bwRequestTypeId;

            if (hasWorkflow == 'true') {
                document.getElementById('checkboxManageRequestTypeDialog_HasWorkflow').setAttribute('checked', 'checked');
            } else {
                document.getElementById('checkboxManageRequestTypeDialog_HasWorkflow').removeAttribute('checked');
            }

            if (isActive == 'true') {
                document.getElementById('checkboxManageRequestTypeDialog_Active').setAttribute('checked', 'checked');
            } else {
                document.getElementById('checkboxManageRequestTypeDialog_Active').removeAttribute('checked');
            }

            //
            // ToDo: Add the click event to this Save button!
            //
            $("#divManageRequestTypeDialog").dialog({
                modal: true,
                resizable: false,
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                width: '500',
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {
                    $('.ui-widget-overlay').bind('click', function () {
                        $("#divManageRequestTypeDialog").dialog('close');
                    });
                },
                close: function () {
                    $('#divManageRequestTypeDialog').dialog('destroy');
                }
            });
            //$("#divManageRequestTypeDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

            $('#divManageRequestTypeDialogSubmitButton').off('click').click(function (error) {
                try {
                    console.log('In deleteARequestType.divManageRequestTypeDialogSubmitButton.click().');

                    var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                    var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
                    var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
                    var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

                    var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                    var data = {
                        bwParticipantId_LoggedIn: participantId,
                        bwActiveStateIdentifier: activeStateIdentifier,
                        bwWorkflowAppId_LoggedIn: workflowAppId,

                        bwWorkflowAppId: workflowAppId,
                        bwRequestTypeId: bwRequestTypeId,
                        bwParticipantId: participantId,
                        bwParticipantEmail: participantEmail,
                        bwParticipantFriendlyName: participantFriendlyName
                    };

                    $.ajax({
                        url: thiz.options.operationUriPrefix + "_bw/DeleteRequestType",
                        type: 'POST',
                        data: data,
                        headers: {
                            "Accept": "application/json; odata=verbose"
                        }
                    }).success(function (results) {
                        try {

                            if (results.status != 'SUCCESS') {

                                displayAlertDialog('ERROR: ' + results.message);

                            } else {

                                displayAlertDialog(results.message);

                                thiz.options.requestTypes = results.data;

                                $('#divManageRequestTypeDialog').dialog('close');
                                thiz.renderRequestTypeEditor();

                            }

                        } catch (e) {
                            console.log('Exception in deleteARequestType(): ' + e.message + ', ' + e.stack);
                            displayAlertDialog('Exception in deleteARequestType(): ' + e.message + ', ' + e.stack);
                        }
                    }).error(function (data, errorCode, errorMessage) {

                        console.log('Error in deleteARequestType(). errorMessage: ' + errorMessage + ', errorCode: ' + errorCode + ', data: ' + JSON.stringify(data));
                        displayAlertDialog('Error in deleteARequestType(). errorMessage: ' + errorMessage + ', errorCode: ' + errorCode + ', data: ' + JSON.stringify(data));

                    });

                } catch (e) {
                    console.log('Exception in deleteARequestType(): ' + e.message + ', ' + e.stack);
                    displayAlertDialog('Exception in deleteARequestType(): ' + e.message + ', ' + e.stack);
                }
            });

        } catch (e) {
            console.log('Exception in deleteARequestType(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in deleteARequestType(): ' + e.message + ', ' + e.stack);
        }
    },

    displayAlertDialog: function (errorMessage) {
        try {
            //debugger;
            var element = $("#divAlertDialog");
            $(element).find('#spanErrorMessage')[0].innerHTML = errorMessage;
            $(element).dialog({
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
            $(element).dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
        } catch (e) {
            console.log('Exception in bwAttachments.displayAlertDialog(): ' + e.message + ', ' + e.stack);
        }
    }


});