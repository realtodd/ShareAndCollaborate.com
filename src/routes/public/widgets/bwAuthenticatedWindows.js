$.widget("bw.bwAuthenticatedWindows", {
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
        This is the bwAuthenticatedWindows.js jQuery Widget. 
        ===========================================================

           [more to follow]
                           
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

           [put your stuff here]

        ===========================================================
        
       */


        value: 0,
        reportType: null, // So far using these values: 'CurrentYearBudgetRequestsReport', 'MyPendingTasksReport', 'InProcessBudgetRequestsReport', 'IndividualRequestReport', 
        json: null,
        store: null, // This is where we store our OrgRoles data.
        //Canvas: null,
        //CanvasContext: null,
        //OnResizeDisplayValues: null,
        //Checklists: null,
        bwTenantId: null,
        bwWorkflowAppId: null,
        //bwOrgId: null,
        //bwOrgName: null,
        bwEnabledRequestTypes: null, // An array of the following: ['Budget Request', 'Quote Request', 'Reimbursement Request', 'Recurring Expense', 'Capital Plan Project', 'Work Order']
        operationUriPrefix: null,
        ajaxTimeout: 15000,
        quill: null,
        displayWorkflowPicker: false,
        displayRoleIdColumn: false,
        autoSenseDeviceType: false // Automatic UI based on device type. Alpha version so far.
    },
    _create: function () {
        //alert('In bwAuthenticatedWindows._create().');
        this.element.addClass("bwAuthenticatedWindows");
        //debugger;
        //var thiz = this; // Need this because of the asynchronous operations below.
        try {

            selfDiscoverOperationUri(thiz); // This sets this.options.operationUriPrefix correctly.

            this.displayAuthenticatedWindows();

            console.log('In bwAuthenticatedWindows._create(). The widget has been initialized.');

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">bwAuthenticatedWindows: CANNOT INITIALIZE widget bwAuthenticatedWindows.js.</span>';
            html += '<br />';
            html += '<span style="">Exception in bwAuthenticatedWindows.Create(): ' + e.message + ', ' + e.stack + '</span>';
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
            .removeClass("bwAuthenticatedWindows")
            .text("");
    },

    deleteparticipantauthentication: function () {
        try {
            console.log('In bwAuthenticatedWindows.js.deleteparticipantauthentication().');
            //alert('In bwAuthenticatedWindows.js.deleteparticipantauthentication().');
            var thiz = this;

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

            var data = {
                bwParticipantId_LoggedIn: participantId,
                bwActiveStateIdentifier: activeStateIdentifier,
                bwWorkflowAppId_LoggedIn: workflowAppId
            };

            $.ajax({
                url: webserviceurl + '/deleteparticipantauthentication',
                type: "POST",
                data: data,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (results) {
                    try {

                        if (results.status != 'SUCCESS') {
                            var msg = 'Error in bwAuthenticatedWindows.js.deleteparticipantauthentication.success(): ' + results.status + ', ' + results.message;
                            console.log(msg);
                            displayAlertDialog(msg);

                        } else {

                            displayAlertDialog(results.pMod);

                        }

                    } catch (e) {
                        var msg = 'Exception in bwAuthenticatedWindows.js.deleteparticipantauthentication():2: ' + e.message + ', ' + e.stack;
                        console.log(msg);
                        displayAlertDialog(msg);
                    }

                },
                error: function (jqXHR, settings, errorThrown) {
                    var msg = 'Error in bwAuthenticatedWindows.js.deleteparticipantauthentication(): ' + settings + ', ' + errorThrown + ', ' + JSON.stringify(jqXHR);
                    console.log(msg);
                    displayAlertDialog(msg);
                }

            });

        } catch (e) {
            console.log('Exception in bwAuthenticatedWindows.js.deleteparticipantauthentication(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwAuthenticatedWindows.js.deleteparticipantauthentication(): ' + e.message + ', ' + e.stack);
        }
    },

    displayAuthenticatedWindows: function () {
        try {
            console.log('In bwAuthenticatedWindows.js.displayAuthenticatedWindows().');
            //alert('In bwAuthenticatedWindows.js.displayAuthenticatedWindows().');
            var thiz = this;

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

            var data = {
                bwParticipantId_LoggedIn: participantId,
                bwActiveStateIdentifier: activeStateIdentifier,
                bwWorkflowAppId_LoggedIn: workflowAppId
            };

            $.ajax({
                url: webserviceurl + '/getauthenticatedwindowsforparticipant',
                type: "POST",
                data: data,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (results) {
                    try {

                        if (results.status != 'SUCCESS') {
                            var msg = 'Error in bwAuthenticatedWindows.js.displayAuthenticatedWindows.success(): ' + results.status + ', ' + results.message;
                            console.log(msg);
                            displayAlertDialog(msg);

                        } else {

                            var html = '';

                            
                            //displayAlertDialog(results.bwActiveStateIdentifierArray_Details);


                            //var x = JSON.parse(results.bwActiveStateIdentifierArray_Details);

                            //var msg = 'SUCCESS in bwAuthenticatedWindows.js.displayAuthenticatedWindows.success(): ' + results.status + ', ' + results.message;
                            //console.log(msg);
                            //displayAlertDialog(msg);

                            html += ` <div class="divSignInButton" style="" onclick="$('.bwAuthenticatedWindows:first').bwAuthenticatedWindows('deleteparticipantauthentication');">[CLEAR THE bwActiveStateIdentifierArray and bwActiveStateIdentifierArray_Details fields for this participant]</div><br /><br />`;

                            //var index = results.bwActiveStateIdentifierArray_Details.length - 1;

                            html += `YOU HAVE ` + results.bwActiveStateIdentifierArray_Details.length + ` LOGGED IN DEVICE-WINDOWS ACTIVE RIGHT NOW.      bwAuthenticatedWindows.js     <br /><br />`;

                            for (var i = 0; i < results.bwActiveStateIdentifierArray_Details.length; i+=1) {

                                var item = JSON.parse(results.bwActiveStateIdentifierArray_Details[i]);

                                html += `   <span style="cursor:pointer;">[ ` + item.activeStateIPAddress + ` ]</span>X  <br />`;

                                debugger;
                                if (JSON.parse(activeStateIdentifier).ActiveStateIdentifier == item.ActiveStateIdentifier) {
                                    html += `ActiveStateIdentifier: <span style="color:tomato;font-weight:bold;">` + item.ActiveStateIdentifier + `</span>                                   <br />`;
                                } else {
                                    html += `ActiveStateIdentifier: ` + item.ActiveStateIdentifier + `                                   [GIVE THIS PROFILE A LABEL to identify the device and browser]<br />`;
                                }
                                
                                html += `ActiveStateIdentifier_FromLocalStorage: ` + item.ActiveStateIdentifier_FromLocalStorage + `                                   <br />
                                ActiveStateIdentifier_ForestAdministratorLoginToTenant: ` + item.ActiveStateIdentifier_ForestAdministratorLoginToTenant + `                                   <br />
                                browserNavigatorUserAgentString: ` + item.browserNavigatorUserAgentString + `                                   <br />
                                lastAuthorizationCheckDate: ` + item.lastAuthorizationCheckDate + `                                   <br />
                                                                                        <br />
                                <span style="cursor:pointer;">[ 192.168.0.55 ]</span>X  <br />
                                Linux;Mozilla4;                                         <br />
                                                                                        <br />
                                <span style="cursor:pointer;">[ 192.168.0.57 ]</span>X  <br />
                                Win10;Edge5;                                            <br />
                                                                                        <br />
                                
                            `;

                            }

                            html += `[drag to switch. This switches the UI among the different devices.][dev: make tiny emulator screens]`;

                            thiz.element.html(html);

                        }

                    } catch (e) {
                        var msg = 'Exception in bwAuthenticatedWindows.js.displayAuthenticatedWindows():2: ' + e.message + ', ' + e.stack;
                        console.log(msg);
                        displayAlertDialog(msg);
                    }

                },
                error: function (jqXHR, settings, errorThrown) {
                    var msg = 'Error in bwAuthenticatedWindows.js.displayAuthenticatedWindows(): ' + settings + ', ' + errorThrown + ', ' + JSON.stringify(jqXHR);
                    console.log(msg);
                    displayAlertDialog(msg);
                }

            });

        } catch (e) {
            console.log('Exception in bwAuthenticatedWindows.js.displayAuthenticatedWindows(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwAuthenticatedWindows.js.displayAuthenticatedWindows(): ' + e.message + ', ' + e.stack);
        }
    }

});