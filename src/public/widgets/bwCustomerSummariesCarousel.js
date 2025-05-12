$.widget("bw.bwCustomerSummariesCarousel", {
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
        This is the bwCustomerSummariesCarousel.js jQuery Widget. 
        ===========================================================

           [more to follow]
                           
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

           [put your stuff here]

        ===========================================================
        
       */

        BudgetRequests: null,
        operationUriPrefix: null,

        DisplayType: 'carousel', // Expected values: 'carousel', 'detailedlist'. Determines if requests are displayed as the "Executive Summaries Carousel", or a "Detailed List". 

        //invitationData: null,
        //taskData: null, // This is what we use to decide what tasks get displayed... the most recent 5.
        //tenantData: null,
        //participantsData: null,
        //brData: null, // We use this to get the bwRequestJson for a request, so that we can display the inventory item images. In particular useful for the "Restaurant" use case.
        

        deferredIndex: 'bwCustomerSummariesCarousel', // This helps us keep our widget contained within itself. Used to be a promise for multiple bwWorkflowApps, so that is why it is named this way. Keep this name for now, we may use this approach again in the future.

        HasBeenInitialized: null
    },
    _create: function () {
        this.element.addClass("bwCustomerSummariesCarousel");
        var thiz = this; // Need this because of the asynchronous operations below.
        try {

            if (this.options.operationUriPrefix == null) {
                // This formulates the operationUri, which is used throughout.
                var url1 = window.location.href.split('https://')[1];
                var url2 = url1.split('/')[0];
                this.options.operationUriPrefix = 'https://' + url2 + '/';
            }

            var html = '';

            html += '<style>';
            html += '.executiveSummaryInCarousel { ';
            html += '   min-width: 300px;'; // This is where the minimum size of the carousel tasks is set.
            html += '   min-height: 300px;'; // This is where the minimum size of the carousel tasks is set.
            html += '   border:2px solid lightgray;border-radius:30px 30px 30px 30px;padding:0 10px 20px 10px;';
            html += '   vertical-align:top;';
            html += '   background-color:white;';
            html += '}';
            html += '.executiveSummaryInCarousel:hover { ';
            html += '   background-color:aliceblue;';
            html += '   border:2px solid skyblue;';
            html += '   cursor:pointer !important;';
            html += '}';


            html += '.divCarouselButton {';
            html += '    width: 15px;';
            html += '    height: 15px;';
            html += '    padding: 3px 3px 3px 3px;';
            html += '    border: 4px solid lightgray;';
            html += '}';

            html += '.divCarouselButton:hover {';
            html += '    background-color: gray;';
            html += '    cursor: pointer;';
            html += '}';


            html += '.divCarouselButton_Selected {';
            html += '    width: 15px;';
            html += '    height: 15px;';
            html += '    padding: 3px 3px 3px 3px;';
            html += '    border: 4px solid purple;';
            html += '}';

            html += '.divCarouselButton_Selected:hover {';
            html += '    background-color: gray;';
            html += '    cursor: pointer;';
            html += '}';




            html += '.divCarouselButton_SmallButton {';
            html += '    width: 10px;';
            html += '    height: 16px;';
            html += '    border: 2px solid lightgray;';
            html += '    border-radius: 5px 5px 5px 5px;';
            html += '}';

            html += '.divCarouselButton_SmallButton:hover {';
            //html += '    background-color: lightgray;';
            html += '}';

            html += '.divCarouselButton_SmallButton2 {';
            html += '    width: 6px;';
            html += '    height: 6px;';
            html += '    border: 2px solid lightgray;';
            html += '}';

            html += '.divCarouselButton_SmallButton2:hover {';
            html += '    background-color: lightgray;';
            html += '}';

            html += '.divCarouselButton_SmallButton3 {';
            html += '    width: 10px;';
            html += '     height: 2px;';
            html += '    border: 2px solid lightgray;';
            html += '}';

            html += '.divCarouselButton_SmallButton3:hover {';
            html += '     background-color: lightgray;';
            html += '}';

            html += '</style>';



            $(this.element).html(html);


            //if (this.options.taskData && this.options.taskData.length && this.options.taskData.length > 0) {
            this.loadAndRenderCustomerRequests();

            //var html = this.generateHomePageNotificationScreenHtml();
            //$(this.element).append(html.html);


            //var display = 'carousel';
            //if (display == 'carousel') { // Display the items as text, not the executive summary carousel.
            //    this.getTheLatestRequestsAndRender();
            //}


            //}

            this.options.HasBeenInitialized = true;

            console.log('In bwCustomerSummariesCarousel._create(). The widget has been initialized.');

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwCustomerSummariesCarousel</span>';
            html += '<br />';
            html += '<span style="">Exception in bwCustomerSummariesCarousel.Create(): ' + e.message + ', ' + e.stack + '</span>';
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
            .removeClass("bwCustomerSummariesCarousel")
            .text("");
    },

    loadAndRenderCustomerRequests: function () {
        try {
            console.log('In loadAndRenderCustomerRequests().');
            var thiz = this;
            
            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

            var data = {
                bwParticipantId_LoggedIn: participantId,
                bwActiveStateIdentifier: activeStateIdentifier,
                bwWorkflowAppId_LoggedIn: workflowAppId,

                bwWorkflowAppId: workflowAppId,
                bwCustomerParticipantId: participantId
            };
           
            var operationUri = thiz.options.operationUriPrefix + "_bw/bwbudgetrequests/customersharedrequests";
            $.ajax({
                url: operationUri,
                type: "POST",
                data: data,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (result) {
                    try {
                        if (!(result.message == 'SUCCESS')) {

                            displayAlertDialog(result.message);

                        } else {
                            //debugger;
                            thiz.options.BudgetRequests = result.data;
                            thiz.displayExecutiveSummaries();

                        }

                    } catch (e) {
                        console.log('Exception in loadAndRenderCustomerRequests():2: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in loadAndRenderCustomerRequests():2: ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    console.log('Error in bwCustomerSummariesCarousel.js.loadAndRenderCustomerRequests.ajax.error(): ' + errorMessage);
                    displayAlertDialog('Exception in bwCustomerSummariesCarousel.jsloadAndRenderCustomerRequests.ajax.error(): ' + data + ', ' + errorCode + ', ' + errorMessage);
                }
            });

        } catch (e) {
            console.log('Exception in bwCustomerSummariesCarousel.jsloadAndRenderCustomerRequests():1: ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwCustomerSummariesCarousel.jsloadAndRenderCustomerRequests():1: ' + e.message + ', ' + e.stack);
        }
    },

    // The parameter [executiveSummaryElement] is the element with class name of "executiveSummaryInCarousel". This is the executive summary for the request.
    renderExecutiveSummaryForRequest: function (bwBudgetRequest, executiveSummaryElement) { // accordionDrawerElement) { // This method may be duplicated in webservices.start.js.renderExecutiveSummaryForRequest().
        try {
            console.log('In bwCustomerSummariesCarousel.js.renderExecutiveSummaryForRequest().');
            //alert('In bwCustomerSummariesCarousel.js.renderExecutiveSummaryForRequest(). bwBudgetRequest: ' + JSON.stringify(bwBudgetRequest));
            var thiz = this;
            return new Promise(function (resolve, reject) {
                try {

                    if (!bwBudgetRequest) {

                        var msg = 'Error in renderExecutiveSummaryForRequest(). Invalid value for bwBudgetRequest: ' + bwBudgetRequest;
                        console.log(msg);
                        displayAlertDialog(msg);

                        reject(msg);

                    } else {

                        window.scrollTo(0, 0); // Scroll to top on button click. This makes sure things render Ok, and also just seems like a nicer user experience.
                        $('.bwActiveMenu').bwActiveMenu('adjustLeftSideMenu'); // This makes sure our new stretchy-left-menu redraws Ok.
                        //debugger;

                        alert('Calling bwCommonScripts.getExecutiveSummaryHtml(). xcx1-5.');
                        var promise = bwCommonScripts.getExecutiveSummaryHtml(bwBudgetRequest, 'bwBudgetRequest', executiveSummaryElement);
                        promise.then(function (results) {
                            try {

                                $(results.executiveSummaryElement).html(results.html);

                                if (!results.bwBudgetRequest.bwRequestJson) {
                                    //console.log('Error in bwCustomerSummariesCarousel.js.renderExecutiveSummaryForRequest(). Invalid JSON detected: ' + results.bwBudgetRequest);
                                    console.log('####################Error in bwCustomerSummariesCarousel.js.renderExecutiveSummaryForRequest(). Invalid JSON detected: ' + results.bwBudgetRequest);
                                }

                                var promise2 = bwCommonScripts.renderInventoryItems_ForExecutiveSummary(results.bwBudgetRequest.bwBudgetRequestId, results.bwBudgetRequest, results.executiveSummaryElement);
                                promise2.then(function (results) {
                                    try {

                                        console.log('In bwCustomerSummariesCarousel.js.renderExecutiveSummaryForRequest(). Returned from call to bwCommonScripts.renderInventoryItems_ForExecutiveSummary.');

                                        var promise3 = bwCommonScripts.renderAttachments_ForExecutiveSummary(results.bwBudgetRequestId, results.bwBudgetRequest, results.executiveSummaryElement);
                                        promise3.then(function (results) {
                                            try {

                                                console.log('In bwCustomerSummariesCarousel.js.renderExecutiveSummaryForRequest(). Returned from call to bwCommonScripts.renderAttachments_ForExecutiveSummary.');
                                                //alert('In bwCustomerSummariesCarousel.js.renderExecutiveSummaryForRequest(). Returned from call to bwCommonScripts.renderAttachments_ForExecutiveSummary.');












                                                //
                                                //
                                                // 2-19-2024 THIS LOOKS LIKE A GOOD SPOT TO BACKFILL THE WORKFLOW current owner(s)/approvers/collaborators/informed.???????????<<<<<<<<<<<<<<<<<<
                                                //
                                                //

                                                //var currentOwner = results.bwBudgetRequest.CurrentOwner;

                                                //var orgId = results.bwBudgetRequest.OrgId;
                                                //var bwRequesTypeId = results.bwBudgetRequest.bwRequesTypeId;
                                                //var budgetWorkflowStatus = results.bwBudgetRequest.BudgetWorkflowStatus;

                                                //// AT THIS POINT WE HAVE ENOUGH INFORMATION TO FIND OUT WHO THE participants are who are currently participating in the workflow.

                                                //debugger; // Does this have the values we are looking for?

                                                //var workflows = $('.bwOrganizationEditor').bwOrganizationEditor('option', 'Workflows');
                                                //var bwWorkflowJson = JSON.parse(workflows[0].bwWorkflowJson);

                                                //// Then we populate this way:
                                                //var html = 'Current owner(s): xcxcurrentowners';
                                                //$(results.executiveSummaryElement).find('.current_owners').html(html);
                                                //html = 'Approver(s): xcxapprovers';
                                                //$(results.executiveSummaryElement).find('.approvers').html(html);
                                                //html = 'Collaborator(s): xcxcollaborators';
                                                //$(results.executiveSummaryElement).find('.collaborators').html(html);
                                                //html = 'Informed: xcxinformed';
                                                //$(results.executiveSummaryElement).find('.informed').html(html);











                                            } catch (e) {

                                                var msg = 'Exception in bwCustomerSummariesCarousel.js.renderExecutiveSummaryForRequest():2-2-2: ' + e.message + ', ' + e.stack;
                                                console.log(msg);
                                                alert(msg);
                                                var result = {
                                                    status: 'EXCEPTION',
                                                    message: msg
                                                }
                                                reject(result);

                                            }
                                        }).catch(function (e) {

                                            var msg = 'Exception in bwCustomerSummariesCarousel.js.renderExecutiveSummaryForRequest():2-2-2: ' + JSON.stringify(e);
                                            console.log(msg);
                                            alert(msg);
                                            var result = {
                                                status: 'EXCEPTION',
                                                message: msg
                                            }
                                            reject(result);

                                        });

                                    } catch (e) {

                                        var msg = 'Exception in bwCustomerSummariesCarousel.js.renderExecutiveSummaryForRequest():2-2-2-3: ' + e.message + ', ' + e.stack;
                                        console.log(msg);
                                        alert(msg);
                                        var result = {
                                            status: 'EXCEPTION',
                                            message: msg
                                        }
                                        reject(result);

                                    }
                                }).catch(function (e) {

                                    var msg = 'Exception in bwCustomerSummariesCarousel.js.renderExecutiveSummaryForRequest():2-2-2-3: ' + JSON.stringify(e);
                                    console.log(msg);
                                    alert(msg);
                                    var result = {
                                        status: 'EXCEPTION',
                                        message: msg
                                    }
                                    reject(result);

                                });

                            } catch (e) {
                                var msg = 'Exception in bwCustomerSummariesCarousel.js.renderExecutiveSummaryForRequest():xcx2131234234: ' + e.message + ', ' + e.stack;
                                console.log(msg);
                                alert(msg);
                                var result = {
                                    status: 'EXCEPTION',
                                    message: msg
                                }
                                reject(result);

                            }

                        }).catch(function (e) {
                            debugger;
                            var msg = 'Exception in bwCustomerSummariesCarousel.js.renderExecutiveSummaryForRequest():2-2-2: ' + JSON.stringify(e);
                            console.log(msg);
                            alert(msg);
                            var result = {
                                status: 'EXCEPTION',
                                message: msg
                            }
                            reject(result);

                        });

                    }

                } catch (e) {
                    var msg = 'Exception in bwCustomerSummariesCarousel.js.renderExecutiveSummaryForRequest():2: ' + e.message + ', ' + e.stack;
                    console.log(msg);
                    displayAlertDialog(msg);

                    reject(msg);
                }
            });

        } catch (e) {
            var msg = 'Exception in bwCustomerSummariesCarousel.js.renderExecutiveSummaryForRequest(): ' + e.message + ', ' + e.stack;
            console.log(msg);
            displayAlertDialog(msg);

            reject(msg);
        }
    },

    displayExecutiveSummaries: function () {
        try {
            console.log('In bwCustomerSummariesCarousel.js.displayExecutiveSummaries().');
            var thiz = this;

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            
            if (!this.options.BudgetRequests) {
                displayAlertDialog('In bwCustomerSummariesCarousel.js.displayExecutiveSummaries(). This functionality is incomplete. Coming soon!');
            } else {
                $('#divDataGridTable').html('');
                $('#divDataGridTable').height('auto');

                var accordionDrawerElement = $('#divBwExecutiveSummariesCarousel2');

                //for (var i = 0; i < this.options.BudgetRequests.length; i++) { 
                for (var i = this.options.BudgetRequests.length - 1; i > -1; i--) { // Doing it backwards so that the most recent is at the top.
                    if (i < 100) { // This is where we set how many tasks we will display in the carousel. Zero-based, so < 5 means display 5 tasks.

                        var title = 'Executive Summary for: ' + this.options.BudgetRequests[i].Title + '. ' + encodeURI(this.options.BudgetRequests[i].ProjectTitle); // ProjectTitle_clean;

                        var executiveSummaryElement = document.createElement('div');
                        executiveSummaryElement.classList.add('executiveSummaryInCarousel');
                        executiveSummaryElement.setAttribute('bwbudgetrequestid', this.options.BudgetRequests[i].bwBudgetRequestId);
                        executiveSummaryElement.title = title;
                        executiveSummaryElement.alt = title;
                        executiveSummaryElement.style.minWidth = '300px';
                        executiveSummaryElement.style.maxWidth = '550px';
                        executiveSummaryElement.style.display = 'inline-block';
                        executiveSummaryElement.style.whiteSpace = 'nowrap';
                        executiveSummaryElement.style.color = 'rgb(38, 38, 38)';
                        executiveSummaryElement.style.fontFamily = '"Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif';
                        executiveSummaryElement.style.fontSize = '1.25em';

                        executiveSummaryElement.setAttribute('onclick', '$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'' + this.options.BudgetRequests[i].bwBudgetRequestId + '\', \'' + this.options.BudgetRequests[i].Title + '\', \'' + encodeURI(this.options.BudgetRequests[i].ProjectTitle) + '\', \'' + this.options.BudgetRequests[i].Title + '\', \'' + this.options.BudgetRequests[i].bwAssignedToRaciRoleAbbreviation + '\', \'' + '7777xcx7777777-324-1-445' + '\');');

                        $(accordionDrawerElement).append(executiveSummaryElement);

                        console.log('Calling renderExecutiveSummaryForRequest(). xcx332-6');

                        var promise = thiz.renderExecutiveSummaryForRequest(this.options.BudgetRequests[i], executiveSummaryElement);
                        promise.then(function (result) {
                            // Do nothing.
                        }).catch(function (e) {
                            alert('Exception xcx33995-2-1-4325: ' + e);
                        });

                    } else {
                        break;
                    }

                }






















                //var carouselItemIndex = 0;
                //for (var i = (this.options.BudgetRequests.length - 1) ; i > -1; i--) {
                //    if (carouselItemIndex < 100) { // This is where we set how many tasks we will display in the carousel. Zero-based, so < 5 means display 5 tasks.

                //        var bwBudgetRequestId = this.options.BudgetRequests[i].bwBudgetRequestId;
                //        //var bwWorkflowTaskItemId = this.options.BudgetRequests[i].bwWorkflowTaskItemId;

                //        var carouselItem_Id = 'bwExecutiveSummariesCarousel2_executiveSummaryInCarousel_' + carouselItemIndex;


                //        //
                //        // THIS WAS THE OLD CODE FOR GENERATINMG THE EXECUTIVE SUMMARIES.
                //        //

                //        //var html = '';

                //        //html += '<div id="' + carouselItem_Id + '" xcx="xcx33456-1" class="executiveSummaryInCarousel" bwbudgetrequestid="" style="min-width:300px;display:inline-block;white-space:nowrap;color: rgb(38, 38, 38); font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif; font-size: 1.25em;" ';
                //        ////this.carouselItem_AddOnClick(carouselItem_Id, bwBudgetRequestId, this.options.taskData[i].Title, this.options.taskData[i].ProjectTitle, this.options.taskData[i].bwAssignedToRaciRoleAbbreviation, bwWorkflowTaskItemId);
                //        //html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'' + bwBudgetRequestId + '\', \'' + encodeHtmlAttribute(this.options.BudgetRequests[i].Title) + '\', \'' + encodeHtmlAttribute(this.options.BudgetRequests[i].ProjectTitle) + '\', \'' + encodeHtmlAttribute(this.options.BudgetRequests[i].Title) + '\', \'' + this.options.BudgetRequests[i].bwAssignedToRaciRoleAbbreviation + '\', \'' + bwBudgetRequestId + '\');" ';
                //        //html += '   >';

                //        //html += '<br />';

                //        //// Adding the request type to the title 3-29-2022
                //        //var singletonName = '';
                //        //var requestTypes = $('.bwAuthentication').bwAuthentication('option', 'bwEnabledRequestTypes').EnabledItems; // Global, populated in the beginning when the app loads.
                //        //for (var j = 0; j < requestTypes.length; j++) {
                //        //    if (requestTypes[j].bwRequestTypeId == this.options.BudgetRequests[i].bwRequestTypeId) {
                //        //        singletonName = requestTypes[j].SingletonName;
                //        //        break;
                //        //    }
                //        //}

                //        //html += '   ' + singletonName + ': <span style="font-size:12pt;"><span style="color:goldenrod;font-size:18pt;font-weight:bold;">' + this.options.BudgetRequests[i].Title + '</span></span>';
                //        //html += '   <br />';
                //        //html += '   Title: <span style="color:goldenrod;font-size:18pt;font-weight:bold;">' + this.options.BudgetRequests[i].ProjectTitle + '</span>';
                //        //html += '   <br />';
                //        //html += '   <span style="color:black;font-size:12pt;font-weight:normal;">Requested by: ' + this.options.BudgetRequests[i].CreatedBy + '</span>';
                //        //html += '   <br />';

                //        ////var RequestedCapital_cleaned = $('.bwAuthentication').bwAuthentication('getBudgetWorkflowStandardizedCurrency', this.options.BudgetRequests[i].RequestedCapital);
                //        //var RequestedCapital_cleaned = bwCommonScripts.getBudgetWorkflowStandardizedCurrency(this.options.BudgetRequests[i].RequestedCapital);
                //        //html += '   <span style="color:black;font-size:12pt;font-weight:normal;">Requested capital: <span style="color:purple;font-size:18pt;">' + RequestedCapital_cleaned + '</span></span>';
                //        //html += '   <br />';
                //        //var timestamp4;
                //        //var requestCreatedDate;
                //        //requestCreatedDate = this.options.BudgetRequests[i].Created;
                //        //if (requestCreatedDate) {
                //        //    //timestamp4 = $('.bwAuthentication').bwAuthentication('getBudgetWorkflowStandardizedDate', requestCreatedDate);
                //        //    var timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(requestCreatedDate);
                //        //} else {
                //        //    timestamp4 = '[not available]';
                //        //}
                //        //html += '   <span style="color:black;font-size:12pt;font-weight:normal;">Request created: ' + timestamp4 + '</span>';
                //        //html += '   <br />';
                //        //html += '   <span style="color:black;font-size:12pt;font-weight:normal;">Org: <span style="">' + this.options.BudgetRequests[i].OrgName + '</span></span>';
                //        //html += '   <br />';
                //        //html += '   <br />';

                //        //html += '   <div id="bwExecutiveSummariesCarousel_spanBwExecutiveSummariesCarouselPrimaryImages_' + bwBudgetRequestId + '" style="text-align: center;"></div>';


                //        //// Customers don't see the current workflow step and details.
                //        ////html += '   <hr style="color:skyblue;" />';

                //        ////if (this.options.BudgetRequests[i].BudgetWorkflowStatus.toString().toLowerCase() == 'collaboration') {
                //        ////    html += '<span style="color:goldenrod;font-size:18pt;font-weight:bold;">Workflow step: ' + this.options.BudgetRequests[i].BudgetWorkflowStatus + '</span>';
                //        ////} else {
                //        ////    html += '<span style="color:goldenrod;font-size:18pt;font-weight:bold;">Workflow step: ' + this.options.BudgetRequests[i].BudgetWorkflowStatus + '</span>';
                //        ////}
                //        ////html += '   <br />';
                //        ////html += '   <span style="color:black;font-size:12pt;font-weight:normal;">Approvers: [xcxappovers]</span>';
                //        ////html += '   <br />';
                //        ////html += '   <span style="color:black;font-size:12pt;font-weight:normal;">Collaborators: [xcxcollaborators]</span>';
                //        ////html += '   <br />';
                //        ////html += '   <span style="color:black;font-size:12pt;font-weight:normal;">Informed: [xcxinformed]</span>';
                //        ////html += '   <br />';









                //        //html += '</div>';

                //        //$('#divBwExecutiveSummariesCarousel2').append(html); // Create the html in the div tag.


                //        console.log('Calling carouselItem_AddOnClick() xcx124254235');
                //        // Now add the onclick event.
                //        //var bwWorkflowTaskItemId = this.options.taskData[i].bwWorkflowTaskItemId;
                //        //this.carouselItem_AddOnClick(carouselItem_Id, bwBudgetRequestId, this.options.taskData[i].Title, this.options.taskData[i].ProjectTitle, this.options.taskData[i].bwAssignedToRaciRoleAbbreviation, bwWorkflowTaskItemId);

                //        carouselItemIndex += 1;





                //        //
                //        // Display inventory images
                //        //
                //        // 

                //        var InventoryItems = [];
                //        for (var j = 0; j < this.options.BudgetRequests.length; j++) {
                //            //debugger;
                //            //var x = '';
                //            if (bwBudgetRequestId == this.options.BudgetRequests[j].bwBudgetRequestId) {
                //                //debugger;
                //                var tmpJson = this.options.BudgetRequests[j].bwRequestJson;
                //                var json = JSON.parse(tmpJson);
                //                //debugger;


                //                if (json && json.bwSelectInventoryItems && json.bwSelectInventoryItems.value) {
                //                    InventoryItems = json.bwSelectInventoryItems.value; //this.options.brData.PendingBudgetRequests[j].bwRequestJson;
                //                }
                //                break;
                //            }
                //        }

                //        if (InventoryItems.length > 0) {
                //            var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                //                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                //                return v.toString(16);
                //            });
                //            for (var j = 0; j < InventoryItems.length; j++) {
                //                //debugger;
                //                var html = '';

                //                //var imagePath = thiz.options.operationUriPrefix + '_files/' + workflowAppId + '/inventoryimages/' + InventoryItems[j].bwInventoryItemId + '/inventoryimage.png?v=' + guid;
                //                var imagePath = globalUrlPrefix + globalUrl + '/_files/' + workflowAppId + '/inventoryimages/' + InventoryItems[j].bwInventoryItemId + '/inventoryimage.png?v=' + guid;
                //                html += '<img src="' + imagePath + '" style="height:150px;" />';
                //                html += '<br />';

                //                //$('#bwExecutiveSummariesCarousel_spanBwExecutiveSummariesCarouselPrimaryImages_' + bwWorkflowTaskItemId).append(html);
                //                $('#bwExecutiveSummariesCarousel_spanBwExecutiveSummariesCarouselPrimaryImages_' + bwBudgetRequestId).append(html);

                //            }
                //        }

                //        //
                //        // end: Display inventory images
                //        //


                //        var renderAttachments = function (bwBudgetRequestId) {
                //            try {
                //                //debugger;

                //                console.log('In xcx1231234 renderAttachments(). workflowAppId: ' + workflowAppId + ', bwBudgetRequestId: ' + bwBudgetRequestId);
                //                //alert('In xcx1231234 renderAttachments(). workflowAppId: ' + workflowAppId + ', bwBudgetRequestId: ' + bwBudgetRequestId);

                //                //var operationUri = globalUrlPrefix + globalUrl + '/_files/' + 'getprimaryimageforbudgetrequest/' + workflowAppId + '/' + bwBudgetRequestId; // _files allows us to use nginx to route these to a dedicated file server.
                //                var operationUri = globalUrlPrefix + globalUrl + '/_files/' + 'getprimaryimageforbudgetrequest_64bitString/' + workflowAppId + '/' + bwBudgetRequestId + '/' + 'dsaffsdhg980023497235kjl;gdfs98g734985ytgadfhjfgjkgdhkdgf3e5346t356j'; // _files allows us to use nginx to route these to a dedicated file server.

                //                $.ajax({
                //                    url: operationUri,
                //                    method: "GET",
                //                    headers: {
                //                        "Accept": "application/json; odata=verbose"
                //                    },
                //                    success: function (results) {
                //                        try {

                //                            console.log('xcx2112456566-1 In bwCustomerSummarriesCarousel.js.displayExecutiveSummaries.renderAttachments() success results: ' + JSON.stringify(results));
                //                            //alert('xcx2112456566-1 success results: ' + JSON.stringify(results));










                //                            var bwBudgetRequestId;
                //                            if (results[0]) {
                //                                bwBudgetRequestId = results[0].bwBudgetRequestId;
                //                            }
                //                            var html = '';
                //                            try {
                //                                for (var i = 0; i < results.length; i++) {
                //                                    if (bwBudgetRequestId) {
                //                                        var fileName = results[i].Filename;
                //                                        if ((fileName.toUpperCase().indexOf('.XLSX') > -1) || (fileName.toUpperCase().indexOf('.XLS') > -1)) {

                //                                            html += '<img src="images/excelicon.png" style="width:100px;height:46px;cursor:pointer;" />';

                //                                        } else if (fileName.toUpperCase().indexOf('.MP4') > -1) {

                //                                            html += '<img src="images/mp4.jfif" style="width:100px;cursor:pointer;" />';

                //                                        } else if (fileName.toUpperCase().indexOf('.VOB') > -1) {

                //                                            // We don't show customers .vob files.
                //                                            //html += '<img src="images/mp4.jfif" style="width:100px;cursor:pointer;" />';

                //                                        } else {

                //                                            var imageUrl = globalUrlPrefix + globalUrl + '/_files/' + workflowAppId + '/' + bwBudgetRequestId + '/' + fileName;
                //                                            html += '<img src="' + imageUrl + '" style="height:150px;" />';
                //                                            html += '<br />';

                //                                        }
                //                                    }
                //                                }

                //                            } catch (e) {
                //                                console.log('Didn\'t find an image for results: ' + JSON.stringify(results));
                //                                html = '[no image found]';
                //                                //document.getElementById('spanExecutiveSummaryPrimaryImages_' + bwBudgetRequestId).innerHTML = html;
                //                            }
                //                            if (bwBudgetRequestId) {
                //                                //document.getElementById('bwExecutiveSummariesCarousel_spanBwExecutiveSummariesCarouselPrimaryImages_' + bwBudgetRequestId).innerHTML = html;
                //                                $('#bwExecutiveSummariesCarousel_spanBwExecutiveSummariesCarouselPrimaryImages_' + bwBudgetRequestId).append(html); // 1-25-2022  bwBudgetRequestId).append(html);
                //                            }
                //                        } catch (e) {
                //                            if (e.number) {
                //                                displayAlertDialog('Error in populateAttachments():1-1: ' + e.number + ', "' + e.message + '", ' + e.stack);
                //                            } else {
                //                                // This most likely means that the folders are there on the file services server, but there is nothing in them.
                //                                //
                //                                // Fileservices has an error, so show nothing! We will put a red exclamation pin in the attachments section eventually! - 10-1-17 todd
                //                                //displayAlertDialog('Fileservices has an error: ' + ' "' + e.message + '"');
                //                            }
                //                        }
                //                    },
                //                    error: function (data, errorCode, errorMessage) {

                //                        alert('xcx2112456566-1 error');

                //                        if (errorCode === 'timeout' && errorMessage === 'timeout') {
                //                            displayAlertDialog('SERVICE UNAVAILABLE. File services is not respondingxcx2. communication timeout is set at ' + ajaxTimeout / 1000 + ' seconds: ' + errorCode + ', ' + errorMessage);
                //                        } else {


                //                            console.log('');
                //                            console.log('********************************************************************');
                //                            console.log('Error in bwEecutiveSummariesCarousel.js.showRowHoverDetails:2:3 ' + errorCode + ', ' + errorMessage);
                //                            console.log('********************************************************************');
                //                            console.log('');

                //                            displayAlertDialog('Error in bwEecutiveSummariesCarousel.js.showRowHoverDetails:2:3 ' + errorCode + ', ' + errorMessage);





                //                            // The latest error 1-17-2018 is errorCode:'error' and errorMessage:'Not Found'.
                //                            // What does this mean? You can replicate this error!
                //                            // at Url: https://budgetworkflow.com/ios8.html, view an offline (Un-submitted) request, and try to add an attachment.
                //                        }
                //                    }
                //                });
                //            } catch (e) {
                //                console.log('Exception in bwExecutiveSummariesCarousel2.js.renderAttachments(): ' + e.message + ', ' + e.stack);
                //                alert('Exception in bwExecutiveSummariesCarousel2.js.renderAttachments(): ' + e.message + ', ' + e.stack);
                //            }
                //        }

                //        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Calling renderAttachments(). bwBudgetRequestId: ' + bwBudgetRequestId);
                //        //alert('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Calling renderAttachments(). bwBudgetRequestId: ' + bwBudgetRequestId);

                //        renderAttachments(bwBudgetRequestId);

                //    } else {
                //        break;
                //    }
                //}



            }

        } catch (e) {
            console.log('Exception in bwCustomerSummariesCarousel.js.displayExecutiveSummaries(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwCustomerSummariesCarousel.j.sdisplayExecutiveSummaries(): ' + e.message + ', ' + e.stack);
        }
    },

    displayExecutiveSummaries2: function () {
        try {
            console.log('In displayExecutiveSummaries().');

            document.getElementById('buttonDisplayRequestsAsTiles').classList.remove('divCarouselButton');
            document.getElementById('buttonDisplayRequestsAsTiles').classList.add('divCarouselButton_Selected');

            document.getElementById('buttonDisplayRequestsAsDetailedList').classList.remove('divCarouselButton_Selected');
            document.getElementById('buttonDisplayRequestsAsDetailedList').classList.add('divCarouselButton');

            $('#divBwExecutiveSummariesCarousel222').html('');

            this.getTheLatestRequestsAndRender();

        } catch (e) {
            console.log('Exception in displayExecutiveSummaries(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in displayExecutiveSummaries(): ' + e.message + ', ' + e.stack);
        }
    },
    displayDetailedList: function () {
        try {
            console.log('In displayDetailedList().');

            // displayDetailedList // divCarouselButton_Selected
            // buttonDisplayRequestsAsTiles
            // buttonDisplayRequestsAsDetailedList

            document.getElementById('buttonDisplayRequestsAsTiles').classList.remove('divCarouselButton_Selected');
            document.getElementById('buttonDisplayRequestsAsTiles').classList.add('divCarouselButton');

            document.getElementById('buttonDisplayRequestsAsDetailedList').classList.remove('divCarouselButton');
            document.getElementById('buttonDisplayRequestsAsDetailedList').classList.add('divCarouselButton_Selected');

            var html = '';

            //html += this.generateHomePageNotificationScreenHtml_new();



            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            var bwRequestTypeId = $('#selectRequestTypeDropDown option:selected').val(); // This is the drop-down at the top of the page.

            html += '<style>';
            html += '.dataGridTable { border: 1px solid gainsboro; font-size:14px; font-family: "Helvetica Neue","Segoe UI",Helvetica,Verdana,sans-serif; }';
            html += '.dataGridTable td { border-left: 0px; border-right: 1px solid gainsboro; }';
            html += '.headerRow { background-color:white; color:gray;border-bottom:1px solid gainsboro; }';
            html += '.headerRow td { border-bottom:1px solid gainsboro; padding-top:3px;padding-bottom:5px;padding-right:10px;padding-left:10px; }';
            html += '.filterRow td { border-bottom:1px solid whitesmoke; padding-top:3px;padding-bottom:5px;padding-right:10px;padding-left:10px; }';
            html += '.alternatingRowLight { background-color:white; }';
            html += '.alternatingRowLight:hover { background-color:lightgoldenrodyellow; }';
            html += '.alternatingRowDark { background-color:whitesmoke; }';
            html += '.alternatingRowDark:hover { background-color:lightgoldenrodyellow; }';
            html += '</style>';


            //html += '<div style="height:800px;overflow-y: scroll;" onscroll="$(\'.bwDataGrid\').bwDataGrid(\'dataGrid_OnScroll\', this);">';
            html += '<div id="divDataGridTable" style="overflow-y: scroll;" onscroll="$(\'.bwDataGrid\').bwDataGrid(\'dataGrid_OnScroll\', this, \'' + bwRequestTypeId + '\');">';

            //html += '                               <span id="spanEmailPicker"></span>';
            //html += '                           </div>';











            html += '<table id="dataGridTable" class="dataGridTable" bwworkflowappid="' + workflowAppId + '" >';

            html += '  <tr class="headerRow">';
            html += '    <td></td>';

            // "Location" column header.
            html += '   <td style="white-space:nowrap;">';
            //html += '       Location';
            html += '       <div style="vertical-align:middle;display:inline-block;">Location&nbsp;</div>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'OrgName\', \'descending\', this);">';
            html += '           <img src="images/descending.png" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'OrgName\', \'ascending\', this);">';
            html += '           <img src="images/ascending.png" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '   </td>';

            // "Title" column header.
            html += '    <td style="white-space:nowrap;">';
            html += '       <div style="vertical-align:middle;display:inline-block;">Title&nbsp;</div>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'Title\', \'descending\', this);">';
            html += '           <img src="images/descending.png" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'Title\', \'ascending\', this);">';
            html += '           <img src="images/ascending.png" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '   </td>';

            // "Description" column header.
            html += '    <td style="white-space:nowrap;">';
            html += '       <div style="vertical-align:middle;display:inline-block;">Description&nbsp;</div>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'ProjectTitle\', \'descending\', this);">';
            html += '           <img src="images/descending.png" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'ProjectTitle\', \'ascending\', this);">';
            html += '           <img src="images/ascending.png" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '   </td>';

            // "Fiscal year" column header.
            html += '    <td style="white-space:nowrap;">';
            html += '       <div style="vertical-align:middle;display:inline-block;">Fiscal year&nbsp;</div>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'bwFiscalYear\', \'descending\', this);">';
            html += '           <img src="images/descending.png" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'bwFiscalYear\', \'ascending\', this);">';
            html += '           <img src="images/ascending.png" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '   </td>';

            html += '    <td>Request Type Id</td>';

            // "Created Date" column header.
            html += '    <td style="white-space:nowrap;">';
            html += '       <div style="vertical-align:middle;display:inline-block;">Created Date&nbsp;</div>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'Created\', \'descending\', this);">';
            html += '           <img src="images/descending.png" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'Created\', \'ascending\', this);">';
            html += '           <img src="images/ascending.png" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '   </td>';


            html += '    <td style="white-space:nowrap;">Financial Area</td>';
            html += '    <td>OrgId</td>';

            // "Status" column header.
            //html += '    <td>Status</td>';
            html += '    <td style="white-space:nowrap;">';
            html += '       <div style="vertical-align:middle;display:inline-block;">Status&nbsp;</div>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'BudgetWorkflowStatus\', \'descending\', this);">';
            html += '           <img src="images/descending.png" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'BudgetWorkflowStatus\', \'ascending\', this);">';
            html += '           <img src="images/ascending.png" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '   </td>';

            // "AR Status" column header.
            html += '    <td style="white-space:nowrap;">';
            html += '       <div style="vertical-align:middle;display:inline-block;">Status&nbsp;</div>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'ARStatus\', \'descending\', this);">';
            html += '           <img src="images/descending.png" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'ARStatus\', \'ascending\', this);">';
            html += '           <img src="images/ascending.png" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '   </td>';

            // "Current Owner(s)" column header. 
            html += '    <td style="white-space:nowrap;">';
            html += '       <div style="vertical-align:middle;display:inline-block;">Current Owner(s)&nbsp;</div>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'CurrentOwner\', \'descending\', this);">';
            html += '           <img src="images/descending.png" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'CurrentOwner\', \'ascending\', this);">';
            html += '           <img src="images/ascending.png" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '   </td>';

            // "Capital Cost" column header. 
            html += '    <td style="white-space:nowrap;">';
            html += '       <div style="vertical-align:middle;display:inline-block;">Capital Cost&nbsp;</div>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'RequestedCapital\', \'descending\', this);">';
            html += '           <img src="images/descending.png" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'RequestedCapital\', \'ascending\', this);">';
            html += '           <img src="images/ascending.png" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '   </td>';

            // "Expense" column header.
            html += '    <td style="white-space:nowrap;">';
            html += '       <div style="vertical-align:middle;display:inline-block;">Expense&nbsp;</div>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'RequestedExpense\', \'descending\', this);">';
            html += '           <img src="images/descending.png" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'RequestedExpense\', \'ascending\', this);">';
            html += '           <img src="images/ascending.png" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '   </td>';

            html += '    <td>Lease</td>';
            html += '    <td>Total</td>';
            html += '    <td>Simple Payback</td>';

            // "Modified Date" column header. 
            //html += '    <td>Modified Date</td>';
            html += '    <td style="white-space:nowrap;">';
            html += '       <div style="vertical-align:middle;display:inline-block;">Modified Date&nbsp;</div>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'Modified\', \'descending\', this);">';
            html += '           <img src="images/descending.png" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="$(\'.bwDataGrid\').bwDataGrid(\'sortDataGrid\', \'Modified\', \'ascending\', this);">';
            html += '           <img src="images/ascending.png" style="width:25px;vertical-align:middle;" />';
            html += '       </span>';
            html += '   </td>';

            html += '    <td></td>';
            html += '  </tr>';

            html += '  <tr class="filterRow">';
            // Magnifying glass
            html += '    <td></td>';

            // Location
            html += '    <td></td>';

            // Request #
            //html += '    <td style="white-space:nowrap;"><span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="alert(\'Order ascending...\');">☝</span><span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="alert(\'Order descending...\');">☟</span></td>';
            html += '    <td style="white-space:nowrap;">';
            //html += '       <span style="cursor:pointer;font-size:20pt;" title="Order descending..." onclick="alert(\'Order descending...\');">';
            //html += '           <img src="images/descending.png" style="width:25px;" />';
            //html += '       </span>';
            //html += '       <span style="cursor:pointer;font-size:20pt;" title="Order ascending..." onclick="alert(\'Order ascending...\');">';
            //html += '           <img src="images/ascending.png" style="width:25px;" />';
            //html += '       </span>';
            html += '   </td>';


            // Description
            html += '   <td style="white-space:nowrap;">';
            html += '       <input type="text" id="txtArchivePageDescriptionFilter" class="archivePageFilterBox" title="Type here to limit search results, using * as a wildcard character."/>';
            html += '   </td>';

            // Fiscal year
            html += '   <td style="white-space:nowrap;">';
            html += '       <input type="text" id="txtArchivePageDescriptionFilter" class="archivePageFilterBox" title="Type here to limit search results, using * as a wildcard character."/>';
            html += '   </td>';

            // Request Type.
            html += '    <td></td>';

            // Created Date
            html += '    <td></td>';
            // Financial Areas.
            html += '    <td style="white-space:nowrap;">';
            html += '      <select id="ddlArchivePageFinancialAreaDropDownFilter" class="archivePageFilterDropDown" title="Select here to limit the search results.">';
            for (var x = 0; x < BWMData[0].length; x++) {
                if (BWMData[0][x][0] == workflowAppId) {
                    // Now put the empty option.
                    html += '<option value="" class="archivePageFilterOptionDropDown">Show all...</option>';
                    for (var y = 0; y < BWMData[0][x][4].length; y++) {
                        var faId = BWMData[0][x][4][y][0];
                        var faTitle = BWMData[0][x][4][y][1];
                        html += '<option value="' + faId + '" class="archivePageFilterOptionDropDown">';
                        html += faTitle;
                        html += '</option>';
                    }

                }
            }
            html += '      </select>';
            html += '    </td>';

            // OrgId
            html += '    <td></td>';


            // Status
            html += '    <td style="white-space:nowrap;">';
            html += '<select id="selectArchivePageFilterDropDown" class="archivePageFilterDropDown" title="Select here to limit the search results.">';
            // Now put the empty option.
            html += '<option value="" class="archivePageFilterOptionDropDown">Show all...</option>';
            // statusesForTheStatusDropdown

            var statusesForTheStatusDropdown = ['firststatus', 'secondstatus', 'thirdstatus'];

            for (var s = 0; s < statusesForTheStatusDropdown.length; s++) {
                html += '<option value="' + statusesForTheStatusDropdown[s] + '" class="archivePageFilterOptionDropDown">' + statusesForTheStatusDropdown[s] + '</option>';
            }
            html += '</select>&nbsp;<img src="images/icon-down.png" title="Sort order" style="cursor:pointer;" />';
            html += '    </td>';



            // ARStatus
            html += '    <td></td>';
            // Current Owner(s)
            html += '    <td></td>';
            // Capital Cost
            html += '    <td></td>';
            // Expense
            html += '    <td></td>';
            // Lease
            html += '    <td></td>';
            // Total
            html += '    <td style="white-space:nowrap;"><input type="text" id="txtArchivePageBudgetAmountFilter" class="archivePageFilterBox" title="Enter a number. Shows all equal to or greater than."/>&nbsp;<img src="images/icon-down.png" title="Sort order" style="cursor:pointer;" /></td>';
            // Simple Payback
            html += '    <td>[simplepaybackfilter]</td>';
            // Modified Date
            html += '    <td></td>';
            // Trash Bin
            html += '    <td></td>';

            html += '  </tr>';

            var orgsImageFetchingInformation = [];


            var budgetRequests = []; // 3-12-2022 just trying to get code going needs lots more work...





            var alternatingRow = 'light'; // Use this to color the rows.
            for (var i = 0; i < budgetRequests.length; i++) {
                //debugger;
                //var imageUrl = 'https://budgetworkflow.com/_files/af316d1a-ca6d-4c1d-bf8d-66b05920292f/ac778618-4412-48c5-a282-5850e972fd36/edthetalkinghorse.jpg';

                // 2-8-2022
                var ProjectTitle_clean = String(budgetRequests[i].ProjectTitle).replace(/["]/g, '&quot;').replace(/[']/g, '&#39;'); // This is done because if the ProjectTitle (description) has a quote in it, there will be issues! The click event will fail to invoke the method. 


                var bwWorkflowAppId = budgetRequests[i].bwWorkflowAppId;
                var bwBudgetRequestId = budgetRequests[i].bwBudgetRequestId;
                var BriefDescriptionOfProject;
                if (budgetRequests[i].bwRequestJson) {
                    BriefDescriptionOfProject = JSON.parse(budgetRequests[i].bwRequestJson).BriefDescriptionOfProject;
                } else {
                    BriefDescriptionOfProject = 'ERROR: Invalid bwRequestJson.';
                }

                if (alternatingRow == 'light') {
                    html += '<tr class="alternatingRowLight" style="cursor:pointer;" ';
                    //html += ' onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'' + budgetRequests[i].Title + '\', \'' + budgetRequests[i].ProjectTitle + '\', \'' + BriefDescriptionOfProject + '\', \'' + bwWorkflowAppId + '\', \'' + bwBudgetRequestId + '\', \'' + budgetRequests[i].OrgId + '\', \'' + budgetRequests[i].OrgName + '\');this.style.backgroundColor=\'lightgoldenrodyellow\';" ';
                    //html += ' onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');this.style.backgroundColor=\'white\';"';
                    //html += ' onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + thiz.options.operationUriPrefix + '\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + budgetRequests[i].Title + '\', \'' + budgetRequests[i].ProjectTitle + '\', \'' + budgetRequests[i].Title + '\');"';
                    html += '>';
                    alternatingRow = 'dark';
                } else {
                    //html += '  <tr class="alternatingRowDark" style="cursor:pointer;" onmouseover="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'' + budgetRequests[i].Title + '\', \'' + budgetRequests[i].ProjectTitle + '\', \'' + JSON.parse(budgetRequests[i].bwRequestJson).BriefDescriptionOfProject + '\', \'' + bwWorkflowAppId + '\', \'' + bwBudgetRequestId + '\', \'' + budgetRequests[i].OrgId + '\', \'' + budgetRequests[i].OrgName + '\');"  >';
                    html += '<tr class="alternatingRowDark" style="cursor:pointer;" ';
                    //html += ' onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'' + budgetRequests[i].Title + '\', \'' + budgetRequests[i].ProjectTitle + '\', \'' + BriefDescriptionOfProject + '\', \'' + bwWorkflowAppId + '\', \'' + bwBudgetRequestId + '\', \'' + budgetRequests[i].OrgId + '\', \'' + budgetRequests[i].OrgName + '\');this.style.backgroundColor=\'lightgoldenrodyellow\';" ';
                    //html += ' onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');this.style.backgroundColor=\'whitesmoke\';"';
                    //html += ' onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + thiz.options.operationUriPrefix + '\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + budgetRequests[i].Title + '\', \'' + budgetRequests[i].ProjectTitle + '\', \'' + budgetRequests[i].Title + '\');"';
                    html += '>';
                    alternatingRow = 'light';
                }

                // Magnifying glass.
                html += '   <td style="padding:5px;" ';
                html += ' onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'' + budgetRequests[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + BriefDescriptionOfProject + '\', \'' + bwWorkflowAppId + '\', \'' + bwBudgetRequestId + '\', \'' + budgetRequests[i].OrgId + '\', \'' + budgetRequests[i].OrgName + '\');this.style.backgroundColor=\'lightgoldenrodyellow\';" ';
                html += ' onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');this.style.backgroundColor=\'white\';"';
                html += '   ><img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg"></td>';


                // Location
                //html += '      <td style="padding:5px;" onclick="$(\'.bwRequest\').bwRequest(\'displayRequestFormDialog\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + participantId + '\', \'' + budgetRequests[i].Title + '\');">';
                //html += '      <td style="padding:5px;" ';
                //html += '       <img id="orgImage_' + i + '" style="width:40px;height:40px;" src="' + thiz.options.operationUriPrefix + 'images/corporeal.png" />';
                //html += budgetRequests[i].OrgName;
                //html += '       </td>';
                html += '   <td style="padding:5px;" ';
                html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + thiz.options.operationUriPrefix + '\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + budgetRequests[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + budgetRequests[i].Title + '\');"';
                html += '   >';
                html += '       <img id="orgImage_' + i + '" style="width:40px;height:40px;" src="' + thiz.options.operationUriPrefix + 'images/corporeal.png" />';
                html += budgetRequests[i].OrgName;
                html += '   </td>';












                // Request #
                //html += '      <td style="padding:5px;" onclick="$(\'.bwRequest\').bwRequest(\'displayRequestFormDialog\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + participantId + '\', \'' + budgetRequests[i].Title + '\');">' + budgetRequests[i].Title + '</td>';
                //html += '      <td style="padding:5px;">' + budgetRequests[i].Title + '</td>';
                html += '   <td style="padding:5px;" ';
                html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + thiz.options.operationUriPrefix + '\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + budgetRequests[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + budgetRequests[i].Title + '\');"';
                html += '   >' + '<span style="white-space:nowrap;">' + budgetRequests[i].Title + '</span></td>';



                // Description
                //html += '      <td style="padding:5px;" onclick="$(\'.bwRequest\').bwRequest(\'displayRequestFormDialog\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + participantId + '\', \'' + budgetRequests[i].Title + '\');">' + budgetRequests[i].ProjectTitle + '</td>';
                //html += '      <td style="padding:5px;">' + budgetRequests[i].ProjectTitle + '</td>';
                html += '   <td style="padding:5px;" ';
                html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + thiz.options.operationUriPrefix + '\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + budgetRequests[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + budgetRequests[i].Title + '\');"';

                // 2-8-2022
                html += '   >' + ProjectTitle_clean + '</td>';
                //var ProjectTitle_clean = budgetRequests[i].ProjectTitle.replace((/["]/g, '&quot;'));
                //html += '   >' + ProjectTitle_clean + '</td>';



                // Fiscal year
                html += '   <td style="padding:5px;" ';
                html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + thiz.options.operationUriPrefix + '\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + budgetRequests[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + budgetRequests[i].Title + '\');"';
                html += '   >' + budgetRequests[i].bwFiscalYear + '</td>';





                // Request Type Id.
                //html += '      <td style="padding:5px;" onclick="$(\'.bwRequest\').bwRequest(\'displayRequestFormDialog\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + participantId + '\', \'' + budgetRequests[i].Title + '\');">' + budgetRequests[i].bwRequestType + '</td>';
                //html += '      <td style="padding:5px;">' + budgetRequests[i].bwRequestType + '</td>';
                html += '   <td style="padding:5px;" ';
                html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + thiz.options.operationUriPrefix + '\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + budgetRequests[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + budgetRequests[i].Title + '\');"';
                html += '   >' + budgetRequests[i].bwRequestTypeId + '</td>';


                // Created Date
                var timestamp4 = $('.bwAuthentication').bwAuthentication('getBudgetWorkflowStandardizedDate', budgetRequests[i].Created);
                html += '   <td style="padding:5px;" ';
                html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + thiz.options.operationUriPrefix + '\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + budgetRequests[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + budgetRequests[i].Title + '\');"';
                //html += '   >' + getFriendlyDateAndTime(budgetRequests[i].Created) + '</td>';
                html += '   >' + timestamp4 + '</td>';



                // Financial Area
                var displayFinancialArea = false;
                for (var x = 0; x < BWMData[0].length; x++) {
                    if (BWMData[0][x][0] == workflowAppId) {
                        for (var y = 0; y < BWMData[0][x][4].length; y++) {
                            if (displayFinancialArea == false && BWMData[0][x][4][y][0] == budgetRequests[i].FunctionalAreaId) {
                                // We have found the financial area, so we have the title! Yay!
                                var faTitle = BWMData[0][x][4][y][1];
                                //html += '<td style="padding:5px;" onclick="$(\'.bwRequest\').bwRequest(\'displayRequestFormDialog\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + participantId + '\', \'' + budgetRequests[i].Title + '\');" >';
                                //html += '<td style="padding:5px;">';
                                //html += faTitle;
                                //html += '</td>';
                                html += '   <td style="padding:5px;" ';
                                html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + thiz.options.operationUriPrefix + '\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + budgetRequests[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + budgetRequests[i].Title + '\');"';
                                html += '   >' + faTitle + '</td>';
                                displayFinancialArea = true;
                            }
                        }
                    }
                }

                if (displayFinancialArea == false) {
                    //html += '<td style="padding:5px;"></td>';
                    html += '   <td style="padding:5px;" ';
                    html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + thiz.options.operationUriPrefix + '\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + budgetRequests[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + budgetRequests[i].Title + '\');"';
                    html += '   ></td>';
                }



                // Org Id
                html += '   <td style="padding:5px;" ';
                html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + thiz.options.operationUriPrefix + '\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + budgetRequests[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + budgetRequests[i].Title + '\');"';
                html += '   >';
                //html += '       <img id="orgImage_' + i + '" style="width:40px;height:40px;" src="' + thiz.options.operationUriPrefix + 'images/corporeal.png" />';
                html += budgetRequests[i].OrgId;
                html += '   </td>';




                // Use this to retrieve the images after the fact, farther below in this code.
                var orgImageFetchingInformation = {
                    imageId: 'orgImage_' + i,
                    bwOrgId: budgetRequests[i].OrgId
                };
                orgsImageFetchingInformation.push(orgImageFetchingInformation);



                // Status
                //html += '    <td style="padding:5px;" onclick="$(\'.bwRequest\').bwRequest(\'displayRequestFormDialog\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + participantId + '\', \'' + budgetRequests[i].Title + '\');">' + budgetRequests[i].BudgetWorkflowStatus + '</td>';
                //html += '    <td style="padding:5px;">' + budgetRequests[i].BudgetWorkflowStatus + '</td>';
                html += '   <td style="padding:5px;" ';
                html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + thiz.options.operationUriPrefix + '\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + budgetRequests[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + budgetRequests[i].Title + '\');"';
                html += '   >' + budgetRequests[i].BudgetWorkflowStatus + '</td>';

                // ARStatus
                //html += '    <td style="padding:5px;" onclick="$(\'.bwRequest\').bwRequest(\'displayRequestFormDialog\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + participantId + '\', \'' + budgetRequests[i].Title + '\');">' + budgetRequests[i].ARStatus + '</td>';
                //html += '    <td style="padding:5px;">' + budgetRequests[i].ARStatus + '</td>';
                html += '   <td style="padding:5px;" ';
                html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + thiz.options.operationUriPrefix + '\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + budgetRequests[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + budgetRequests[i].Title + '\');"';
                html += '   >' + budgetRequests[i].ARStatus + '</td>';

                // Current Owner(s)
                //html += '    <td style="padding:5px;" onclick="$(\'.bwRequest\').bwRequest(\'displayRequestFormDialog\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + participantId + '\', \'' + budgetRequests[i].Title + '\');">' + budgetRequests[i].CurrentOwner + '</td>';
                //html += '    <td style="padding:5px;">' + budgetRequests[i].CurrentOwner + '</td>';
                html += '   <td style="padding:5px;" ';
                html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + thiz.options.operationUriPrefix + '\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + budgetRequests[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + budgetRequests[i].Title + '\');"';
                html += '   ><span style="color:purple;font-weight:bold;">' + budgetRequests[i].CurrentOwner + '</span></td>';

                // Capital Cost
                html += '    <td style="text-align:right;">';
                html += formatCurrency(budgetRequests[i].RequestedCapital);
                html += '   </td>';
                // Expense
                html += '    <td style="text-align:right;">';
                html += formatCurrency(budgetRequests[i].RequestedExpense);
                html += '</td>';
                // Lease
                html += '    <td>na</td>';
                // Total. Strikethrough the budget amount for a rejected AR.
                if (budgetRequests[i].ARStatus == 'Rejected') {
                    //html += '    <td style="text-align:right;padding:5px;" onclick="$(\'.bwRequest\').bwRequest(\'displayRequestFormDialog\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + participantId + '\', \'' + budgetRequests[i].Title + '\');"><strike>' + formatCurrency(budgetRequests[i].BudgetAmount) + '</strike></td>';
                    //html += '    <td style="text-align:right;padding:5px;"><strike>' + formatCurrency(budgetRequests[i].BudgetAmount) + '</strike></td>';
                    html += '   <td style="text-align:right;padding:5px;" ';
                    html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + thiz.options.operationUriPrefix + '\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + budgetRequests[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + budgetRequests[i].Title + '\');"';
                    html += '   >' + '<strike>' + formatCurrency(budgetRequests[i].BudgetAmount) + '</strike>' + '</td>';

                } else {
                    //html += '    <td style="text-align:right;padding:5px;" onclick="$(\'.bwRequest\').bwRequest(\'displayRequestFormDialog\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + participantId + '\', \'' + budgetRequests[i].Title + '\');">' + formatCurrency(budgetRequests[i].BudgetAmount) + '</td>';
                    //html += '    <td style="text-align:right;padding:5px;">' + formatCurrency(budgetRequests[i].BudgetAmount) + '</td>';
                    html += '   <td style="text-align:right;padding:5px;" ';
                    html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + thiz.options.operationUriPrefix + '\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + budgetRequests[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + budgetRequests[i].Title + '\');"';
                    html += '   >' + formatCurrency(budgetRequests[i].BudgetAmount) + '</td>';

                }

                //html += '    <td>';
                //tempCloseOutXml = budgetRequests[i].bwDocumentXml;
                //html += '       <a href="javascript:displayForm_DisplayCloseOut();" style="white-space:nowrap;">Close Out</a>';
                //html += '    </td>';

                // Simple Payback
                html += '    <td style="text-align:center;">Nox</td>';





                // Modified Date
                var timestamp4 = $('.bwAuthentication').bwAuthentication('getBudgetWorkflowStandardizedDate', budgetRequests[i].Modified);
                //html += '    <td style="text-align:center;">' + getFriendlyDateAndTime(budgetRequests[i].Modified) + '</td>';
                html += '    <td style="text-align:center;">' + timestamp4 + '</td>';




                // Trash Bin
                html += '<td style="padding:5px;" onclick="$(\'.bwDataGrid\').bwDataGrid(\'cmdDisplayDeleteBudgetRequestDialog\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + budgetRequests[i].Title + '\');">';
                html += '  <img src="images/trash-can.png" title="Delete" style="cursor:pointer;" />';
                html += '</td>';

                html += '  </tr>';
                for (var x = 0; x < supplementals[i].length; x++) {
                    // Display the supplementals.
                    html += '  <tr style="font-style:italic;font-size:small;">';
                    //html += '      <td><a href="javascript:displayArOnTheHomePage(\'' + supplementals[i][x].bwBudgetRequestId + '\', \'' + participantId + '\', \'' + supplementals[i][x].Title + '\');">' + supplementals[i][x].ProjectTitle + '</a></td>';
                    html += '      <td><a onclick="$(\'.bwRequest\').bwRequest(\'displayRequestFormDialog\', \'' + supplementals[i][x].bwBudgetRequestId + '\', \'' + participantId + '\', \'' + supplementals[i][x].Title + '\');">' + supplementals[i][x].ProjectTitle + '</a></td>';
                    for (var x2 = 0; x2 < BWMData[0].length; x2++) {
                        if (BWMData[0][x2][0] == workflowAppId) {
                            for (var y = 0; y < BWMData[0][x2][4].length; y++) {
                                if (BWMData[0][x2][4][y][0] == supplementals[i][x].FunctionalAreaId) {
                                    // We have found the financial area, so we have the title! Yay!
                                    var faTitle = BWMData[0][x2][4][y][1];
                                    html += '<td>';
                                    html += faTitle;
                                    html += '</td>';
                                }
                            }
                        }
                    }
                    html += '    <td style="text-align:right;">' + supplementals[i][x].BudgetAmount + '</td>';
                    html += '    <td>' + supplementals[i][x].BudgetWorkflowStatus + '</td>';
                    html += '    <td></td>';
                    html += '    <td>' + supplementals[i][x].CurrentOwner + '</td>';
                    html += '  </tr>';
                }
            }
            html += '<tr><td colspan="12"></td></tr>'; // DONE
            html += '</table>';



            html += '</div>';






            html += this.generateHomePageNotificationScreenHtml_new();






            $('#divBwExecutiveSummariesCarousel222').html(html);

        } catch (e) {
            console.log('Exception in displayDetailedList(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in displayDetailedList(): ' + e.message + ', ' + e.stack);
        }
    },


    generateHomePageNotificationScreenHtml_new: function () {
        try {

            var taskData = this.options.taskData;
            var brData = this.options.brData;
            var myBrData = this.options.myBrData
            var serverside = false;
            var deferredIndex = this.options.deferredIndex;
            var bwWorkflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var invitationData = null;

            //// Change the page title to indicate the # of tasks. This will show up in the browser tab and is a cool way to show the user they have alerts.
            //if (taskData.length > 0) {
            //    //debugger;
            //    if (myBrData && myBrData.MyRequests && myBrData.MyRequests.length & myBrData.MyRequests.length > 0) {
            //        document.title = myBrData.MyRequests[0].OrgName + ' (' + taskData.length + ')';
            //    } else {
            //        //document.title = 'Budget items (' + taskData.length + ')';
            //        document.title = taskData.length + ' budget items';
            //    }

            //    // Change the css to red/orange.
            //    //swapStyleSheet("css/bw.core.colors.red.orange.css");
           
            //} else {
            //    document.title = 'No budget items'; //'My Budgetsxcx2';
            //    // Change the css to blue/blue.
            //    //swapStyleSheet("css/bw.core.colors.blue.blue.css");
     
            //}
            //} catch (e) { }

            var html = '';

            //html += '<style>';
            //html += '.bwCustomerSummariesCarousel_SelectorButton {';
            ////html += '   border:2px solid gray;';
            ////html += '   padding:3px 3px 3px 3px;';
            ////html += '   border-radius:20px 20px 20px 20px;';
            ////html += '   width:25px;height:25px;';
            ////html += '   display:inline-block;';
            //html += '   cursor:pointer;';
            //html += '}';
            //html += '.bwCustomerSummariesCarousel_SelectorButton:hover {';
            //html += '   border:2px solid red;';
            //html += '}';
            //html += '</style>';
            //
            // Display the pending tasks.
            //
            //if (taskData.length == 0 && brData.PendingBudgetRequests.length == 0 && brData.PendingPOBudgetRequests.length == 0) {
            //    html += 'You have no pending tasks, and there are no pending budget requests.';
            //}

            //if (serverside && serverside == true) {
            //    html += '<table id="tblHomePageAlertSectionForWorkflow' + deferredIndex.toString() + '" style="cursor:default;opacity:0.5;" >'; // Makes the email/serverside rendering have an opacity setting.
            //} else {
            //html += '<table id="tblHomePageAlertSectionForWorkflow' + deferredIndex.toString() + '" style="cursor:default;" >';
            //}
            ////html += '<tbody>';













            //
            // Top row, "My Tasks" summary.
            //
            //var rowId = 'functionalAreaRow_' + deferredIndex.toString() + '_1';
            //var imageId = 'alertSectionImage_' + deferredIndex.toString() + '_1';
            //var collapsibleRowId = 'alertSectionRow_' + deferredIndex.toString() + '_1';

            //html += '<tr id="' + rowId + '" class="bwFunctionalAreaRow bwNoUserSelect" >';
            //if (taskData.length > 0) {
            //    if (taskData.length == 1) {
            //        html += '<td style="width:11px;vertical-align:top;" class="bwNoUserSelect" onclick="$(\'.bwCustomerSummariesCarousel\').bwCustomerSummariesCarousel(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" ><img src="' + imageRootPath + '/images/red-dot.png" width="11" height="11" alt="" style="cursor:pointer;vertical-align:top;float:right;" /></td>';
            //        html += '<td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwCustomerSummariesCarousel\').bwCustomerSummariesCarousel(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" >';
            //        html += '   <img title="expand" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="' + imageRootPath + '/images/drawer-open.png">';
            //    } else {
            //        html += '<td style="width:11px;vertical-align:top;" class="bwNoUserSelect" onclick="$(\'.bwCustomerSummariesCarousel\').bwCustomerSummariesCarousel(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" ><img src="' + imageRootPath + '/images/red-dot.png" width="11" height="11" alt="" style="cursor:pointer;vertical-align:top;float:right;" /></td>';
            //        html += '<td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwCustomerSummariesCarousel\').bwCustomerSummariesCarousel(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" >';
            //        html += '   <img title="expand" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;float:none;" src="' + imageRootPath + '/images/drawer-open.png">';
            //    }
            //} else {
            //    html += '   <td style="width:11px;" class="bwNoUserSelect" onclick="$(\'.bwCustomerSummariesCarousel\').bwCustomerSummariesCarousel(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" ></td>';
            //    html += '   <td style="padding-left:60px;height:45px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwCustomerSummariesCarousel\').bwCustomerSummariesCarousel(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');"  >';
            //}
            //html += '           <span class="bwNoUserSelect"  >';
            //if (taskData.length == 1) {
            //    html += 'You have ' + taskData.length + ' pending task.';
            //} else {
            //    html += 'You have ' + taskData.length + ' pending tasks.';
            //}
            //html += '           </span>';


            //html += '       </td>';
            //html += '       <td style="width:2%;" class="bwHPNDrillDownLinkCell2">';
            ////html += '           <div style="float:right;padding-top:10px;">';// The new Expand/Collapse button for the executive summaries and image display. 10-15-2020.
            ////html += '               <span id="spanExpandOrCollapseRightSliderPaneButton" style="cursor:pointer;" onclick="bwCommonScripts.expandOrCollapseExecutiveSummaries();">';
            ////html += '                   <span title="View executive summaries..." style="width:200px;padding:5px 10px 5px 10px;margin:0 0 0 20px;white-space:nowrap;vertical-align:top;border:1px solid lightblue;cursor:pointer;font-weight:normal;font-size:20pt;">';
            ////html += '                       <span style="display:inline-block;">+/- Executive Summaries</span>';
            ////html += '                   </span>';
            ////html += '                   <span id="divEmailEditorHorizontalSliderPane" style="width:200px;display:inline;"></span>';
            ////html += '               </span>';
            ////html += '           </div>';
            //html += '       </td>';
            //html += '</tr>';


            //// Top row, "My Tasks" details.
            ////html += '<tr id="' + collapsibleRowId + '" style="display:table-row;">'; // style="display:none;"
            //html += '<tr id="' + collapsibleRowId + '" style="display:none;">';
            //html += '   <td style="vertical-align:top;">';

            ////html += '       <div class="bwCustomerSummariesCarousel_SelectorButton" onclick="$(\'.bwCustomerSummariesCarousel\').bwCustomerSummariesCarousel(\'displayExecutiveSummaries\');" title="Display executive summaries..." >';
            ////html += '           <img src="/images/tiles.png" style="width:50px;height:50px;" />';
            ////html += '       </div>';
            ////html += '       &nbsp;';
            ////html += '       <div class="bwCustomerSummariesCarousel_SelectorButton" onclick="$(\'.bwCustomerSummariesCarousel\').bwCustomerSummariesCarousel(\'displayDetailedList\');" title="Display detailed list..." >';
            ////html += '           <img src="/images/detailedlist.png" style="width:50px;height:50px;" />';
            ////html += '       </div>';

            //html += '   </td>';
            //html += '   <td colspan="2">';

            //html += '<table><tr><td style="vertical-align:top;width:60px;">';
            //html += '       <div class="bwCustomerSummariesCarousel_SelectorButton" onclick="$(\'.bwCustomerSummariesCarousel\').bwCustomerSummariesCarousel(\'displayExecutiveSummaries\');" title="Display executive summaries..." >';
            ////html += '       <div onclick="$(\'.bwCustomerSummariesCarousel\').bwCustomerSummariesCarousel(\'displayExecutiveSummaries\');" title="Display executive summaries..." >';
            //html += '           <img src="/images/tiles.png" style="width:50px;height:50px;" />';
            //html += '       </div>';






            ////// 2-20-2022 This is the new button I am working on.
            ////html += '<style>';
            ////html += '   .divCarouselButton {';
            ////html += '       transform: scale(0.25);';
            ////html += '       padding:20px 20px 20px 20px;';
            ////html += '       border:2px solid gray;';
            ////html += '       width:200px;';
            ////html += '   }';
            ////html += '   .divCarouselButton:hover {';
            ////html += '       background-color:goldenrod;';
            ////html += '       cursor:pointer;';
            ////html += '   }';
            ////html += '   .divCarouselButton_SmallButton {';
            ////html += '       border:5px solid skyblue;';
            ////html += '       border-radius:20px 20px 20px 20px;';
            ////html += '       width:80px;height:80px;';
            ////html += '   }';
            ////html += '   .divCarouselButton_SmallButton:hover {';
            ////html += '       background-color:skyblue;';
            ////html += '   }';
            ////html += '</style>';
            ////html += '       <div style="display:inline:block;" onclick="$(\'.bwCustomerSummariesCarousel\').bwCustomerSummariesCarousel(\'displayExecutiveSummaries\');" title="Display executive summaries..." >';
            ////html += '           <div class="divCarouselButton" style="">';
            ////html += '               <table>';
            ////html += '                   <tr>';
            ////html += '                       <td>';
            ////html += '                           <div class="divCarouselButton_SmallButton" ></div>';
            ////html += '                       </td>';
            ////html += '                       <td>';
            ////html += '                           <div class="divCarouselButton_SmallButton" ></div>';
            ////html += '                       </td>';
            ////html += '                   </tr>';
            ////html += '                   <tr>';
            ////html += '                       <td>';
            ////html += '                           <div class="divCarouselButton_SmallButton" ></div>';
            ////html += '                       </td>';
            ////html += '                       <td>';
            ////html += '                           <div class="divCarouselButton_SmallButton" ></div>';
            ////html += '                       </td>';
            ////html += '                   </tr>';
            ////html += '               </table>';
            ////html += '           </div>';
            ////html += '       </div>';







            //html += '       &nbsp;';
            //html += '       <div class="bwCustomerSummariesCarousel_SelectorButton" onclick="$(\'.bwCustomerSummariesCarousel\').bwCustomerSummariesCarousel(\'displayDetailedList\');" title="Display detailed list..." >';
            ////html += '       <div onclick="$(\'.bwCustomerSummariesCarousel\').bwCustomerSummariesCarousel(\'displayDetailedList\');" title="Display detailed list..." >';
            //html += '           <img src="/images/detailedlist.png" style="width:50px;height:50px;" />';
            //html += '       </div>';

            //html += '</td><td>';


            //var display = 'carousel';
            //if (display == 'displaytext') { // Display the items as text, not the executive summary carousel.
            html += '       <table><tbody>';
            for (var i = 0; i < taskData.length; i++) {
                var bwWorkflowTaskItemId = taskData[i].bwWorkflowTaskItemId; // added 12-23-2021
                var taskTitle = taskData[i].bwTaskTitle;
                var appWebUrl = appweburl;
                var budgetRequestId = taskData[i].bwRelatedItemId;
                var arName = taskData[i].Title; // DUPLICATE
                var brTitle = taskData[i].ProjectTitle;
                var title = taskData[i].Title;
                var budgetAmount = taskData[i].BudgetAmount;
                var requestedCapital = taskData[i].RequestedCapital;
                var requestedExpense = taskData[i].RequestedExpense;
                var taskType = taskData[i].TaskType;
                var bwAssignedToRaciRoleAbbreviation = taskData[i].bwAssignedToRaciRoleAbbreviation;
                var bwAssignedToRaciRoleName = taskData[i].bwAssignedToRaciRoleName;
                var orgId = taskData[i].OrgId;
                var orgName = taskData[i].OrgName;
                var currentAmount = 0;
                if (budgetAmount == 'null') {
                    currentAmount = Number(requestedCapital) + Number(requestedExpense);
                } else {
                    currentAmount = budgetAmount;
                }
                var daysSinceTaskCreated = 0;
                debugger; // 3-1-2022
                if (taskData[i].Created) {
                    var cd = taskData[i].Created;
                    var year = cd.split('-')[0];
                    var month = cd.split('-')[1];
                    var day = cd.split('-')[2].split('T')[0];
                    var taskCreatedDate = new Date(Number(year), Number(month) - 1, Number(day) - 1); // +1 because we're using overdue date.
                    var todaysDate = new Date();
                    var utc1 = Date.UTC(taskCreatedDate.getFullYear(), taskCreatedDate.getMonth(), taskCreatedDate.getDate());
                    var utc2 = Date.UTC(todaysDate.getFullYear(), todaysDate.getMonth(), todaysDate.getDate());
                    var _MS_PER_DAY = 1000 * 60 * 60 * 24;
                    daysSinceTaskCreated = Math.floor((utc2 - utc1) / _MS_PER_DAY);
                } else {
                    daysSinceTaskCreated = '<span title="This is likely an old task, created before the Create date format was changed." alt="This is likely an old task, created before the Create date format was changed.">[error xcx232135-1-3-1]</span>';
                }

                html += '       <tr>';
                html += '           <td style="width:10px;"></td>';
                html += '           <td style="width:10px;"></td>';
                var functionalAreaId = taskData[i].FinancialAreaId; // Find the functional area name.
                var functionalAreaName = '';
                try {
                    if (BWMData[0]) {
                        for (var x = 0; x < BWMData[0].length; x++) {
                            if (BWMData[0][x][0] = bwWorkflowAppId) { // We have the correct workflow!
                                for (var fai = 0; fai < BWMData[0][x][4].length; fai++) {
                                    if (functionalAreaId == BWMData[0][x][4][fai][0]) {
                                        functionalAreaName = BWMData[0][x][4][fai][1];
                                    }
                                }
                            }
                        }
                    }
                } catch (e) {
                }
                if (taskType == 'RECURRING_EXPENSE_NOTIFICATION_TASK') {
                    html += '       <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;" colspan="5">';
                    html += '           <div style="display:inline-block;">';
                    html += '               <a style="cursor:pointer;" onclick="displayRecurringExpenseOnTheHomePage(\'' + budgetRequestId + '\', \'' + participantId + '\', \'' + title + '\');" target="_blank" title="Click to view the recurring expense...">' + daysSinceTaskCreated.toString() + ' days overduexcx1: Recurring expense <em>(' + brTitle + ' - ' + functionalAreaName + ') is due to be submitted</em></a>';
                    html += '           </div>';
                    html += '       </td>';
                } else if (taskType == 'BUDGET_REQUEST_WORKFLOW_TASK') {
                    html += '       <td style="width:45px;"></td>';
                    html += '       <td style="background-color:white;" ';
                    html += '           onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'' + title + '\', \'' + brTitle + '\', \'' + '' + '\', \'' + bwWorkflowAppId + '\', \'' + budgetRequestId + '\', \'' + orgId + '\', \'' + orgName + '\', this);" ';
                    html += '           onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');" ';
                    html += '>';
                    html += '           <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="' + imageRootPath + '/images/zoom.jpg" />';
                    html += '       </td>';
                    html += '       <td colspan="3" style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" ';
                    html += '           onmouseenter="this.style.backgroundColor=\'lightgoldenrodyellow\';bwCommonScripts.highlightExecutiveSummaryForRequest(\'' + budgetRequestId + '\');" ';
                    html += '           onmouseleave="this.style.backgroundColor=\'#d8d8d8\';bwCommonScripts.unHighlightExecutiveSummaryForRequest(\'' + budgetRequestId + '\');"  ';
                    html += '           onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'' + appWebUrl + '\', \'' + budgetRequestId + '\', \'' + arName + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\', \'' + bwAssignedToRaciRoleAbbreviation + '\', \'' + bwWorkflowTaskItemId + '\');" ';
                    html += '>';
                    html += '           <div style="display:inline-block;" bwtrace="xcx778451">';
                    if (daysSinceTaskCreated == 1) {
                        html += '           &nbsp;&nbsp;' + daysSinceTaskCreated.toString() + ' day overduexcx1: ';
                    } else {
                        html += '           &nbsp;&nbsp;' + daysSinceTaskCreated.toString() + ' days overduexcx2: ';
                    }
                    html += '               <em>';
                    html += title + ' - ' + brTitle + ' - ' + formatCurrency(currentAmount) + ' - ' + functionalAreaName + ' ' + '[(' + bwAssignedToRaciRoleAbbreviation + ') ' + bwAssignedToRaciRoleName + ']';
                    html += '               </em>';
                    html += '           </div>';
                    html += '       </td>';
                } else {
                    html += '       <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;" colspan="5">UNKNOWN TASK TYPE</td>';
                }
                html += '       </tr>';
            }
            html += '       </tbody></table>';

            //} else {
            //    // Display as the executive summary carousel.

            //    debugger;
            //    html += '<div id="divBwExecutiveSummariesCarousel222"></div>';



            //}



            //html += '</td></tr></table>';


            //html += '   </td>';
            //html += '</tr>';






















            ////
            //// Second row, "Active Requests" summary.
            ////
            //var rowId = 'functionalAreaRow_' + deferredIndex.toString() + '_2';
            //var imageId = 'alertSectionImage_' + deferredIndex.toString() + '_2';
            //var collapsibleRowId = 'alertSectionRow_' + deferredIndex.toString() + '_2';
            //html += '<tr style="white-space:nowrap;" id="' + rowId + '" class="bwFunctionalAreaRow bwNoUserSelect" onclick="$(\'.bwCustomerSummariesCarousel\').bwCustomerSummariesCarousel(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" >';
            //if (brData.PendingBudgetRequests.length > 0) {
            //    if (brData.PendingBudgetRequests.length == 1) {
            //        html += '<td style="width:11px;vertical-align:top;" class="bwNoUserSelect" onclick="$(\'.bwCustomerSummariesCarousel\').bwCustomerSummariesCarousel(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');"></td>';
            //        html += '<td style="padding-left:11px;white-space:nowrap;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwCustomerSummariesCarousel\').bwCustomerSummariesCarousel(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');">';
            //        html += '<img title="expand" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="' + imageRootPath + '/images/drawer-open.png">';
            //    } else {
            //        html += '<td style="width:11px;vertical-align:top;white-space:nowrap;" class="bwNoUserSelect" onclick="$(\'.bwCustomerSummariesCarousel\').bwCustomerSummariesCarousel(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');"></td><td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwCustomerSummariesCarousel\').bwCustomerSummariesCarousel(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');">';
            //        html += '<img title="expand" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="' + imageRootPath + '/images/drawer-open.png">';
            //    }
            //} else {
            //    html += '<td style="width:11px;" class="bwNoUserSelect" onclick="$(\'.bwCustomerSummariesCarousel\').bwCustomerSummariesCarousel(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');"></td>';
            //    html += '<td style="padding-left:60px;height:45px;white-space:nowrap;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwCustomerSummariesCarousel\').bwCustomerSummariesCarousel(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');">';
            //}
            //html += '       <span class="bwNoUserSelect" onclick="$(\'.bwCustomerSummariesCarousel\').bwCustomerSummariesCarousel(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');">';
            //if (brData.PendingBudgetRequests.length == 1) {
            //    html += 'There is ' + brData.PendingBudgetRequests.length + ' budget request going through the approval process.';
            //} else {
            //    html += 'There are ' + brData.PendingBudgetRequests.length + ' budget requests going through the approval process.';
            //}
            //html += '       </span>';
            //html += '   </td>';


            //html += '<td class="bwHPNDrillDownLinkCell2"></td>';


            //html += '</tr>';


            //// Second row, "Active Requests" details.
            //html += '<tr id="' + collapsibleRowId + '" style="display:none;">';
            //html += '<td></td>';
            //html += '<td colspan="2"><table><tbody>';
            //for (var i = 0; i < brData.PendingBudgetRequests.length; i++) {
            //    var appWebUrl = appweburl;
            //    var budgetRequestId = brData.PendingBudgetRequests[i].bwBudgetRequestId;
            //    var projectTitle = brData.PendingBudgetRequests[i].ProjectTitle;
            //    var title = brData.PendingBudgetRequests[i].Title;
            //    var budgetAmount = brData.PendingBudgetRequests[i].BudgetAmount;
            //    var requestedCapital = brData.PendingBudgetRequests[i].RequestedCapital;
            //    var requestedExpense = brData.PendingBudgetRequests[i].RequestedExpense;
            //    var currentAmount = 0;
            //    if (budgetAmount == 'null') {
            //        currentAmount = Number(requestedCapital) + Number(requestedExpense);
            //    } else {
            //        currentAmount = budgetAmount;
            //    }
            //    html += '   <tr>';
            //    html += '       <td style="width:10px;"></td>';
            //    html += '       <td style="width:10px;"></td>';
            //    var functionalAreaId = brData.PendingBudgetRequests[i].FinancialAreaId; // Find the functional area name.
            //    var functionalAreaName = '';
            //    try {
            //        if (BWMData[0]) {
            //            for (var x = 0; x < BWMData[0].length; x++) {
            //                if (BWMData[0][x][0] = bwWorkflowAppId) { // We have the correct workflow!
            //                    for (var fai = 0; fai < BWMData[0][x][4].length; fai++) {
            //                        if (functionalAreaId == BWMData[0][x][4][fai][0]) {
            //                            functionalAreaName = BWMData[0][x][4][fai][1];
            //                        }
            //                    }
            //                }
            //            }
            //        }
            //    } catch (e) {
            //    }
            //    if (currentAmount == 0) {
            //        html += '<td style="width:45px;"></td>';
            //        html += '    <td style="background-color:white;" ';
            //        html += 'onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'' + title + '\', \'' + projectTitle + '\', \'' + '' + '\', \'' + bwWorkflowAppId + '\', \'' + budgetRequestId + '\', \'' + orgId + '\', \'' + orgName + '\', this);" ';
            //        html += 'onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');" ';
            //        html += '>';
            //        html += '       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="' + imageRootPath + '/images/zoom.jpg" />';
            //        html += '    </td>';

            //        html += '            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="4" ';
            //        html += 'onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + appWebUrl + '\', \'' + budgetRequestId + '\', \'' + title + '\', \'' + encodeHtmlAttribute(projectTitle) + '\', \'' + title + '\', \'' + '' + '\', \'' + bwWorkflowTaskItemId + '\');" target="_blank" >';
            //        html += '' + title + ': <em>' + projectTitle + ' - ' + 'no budget assigned' + ' - ' + functionalAreaName + '</em>';
            //        html += '</td>';
            //    } else {
            //        html += '<td style="width:45px;"></td>';
            //        html += '    <td style="background-color:white;" ';
            //        html += 'onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'' + title + '\', \'' + projectTitle + '\', \'' + '' + '\', \'' + bwWorkflowAppId + '\', \'' + budgetRequestId + '\', \'' + orgId + '\', \'' + orgName + '\', this);" ';
            //        html += 'onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');" ';
            //        html += '>';
            //        html += '       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="' + imageRootPath + '/images/zoom.jpg" />';
            //        html += '    </td>';

            //        html += '            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="4" ';
            //        html == 'onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + appWebUrl + '\', \'' + budgetRequestId + '\', \'' + title + '\', \'' + encodeHtmlAttribute(projectTitle) + '\', \'' + title + '\', \'' + '' + '\', \'' + bwWorkflowTaskItemId + '\');" target="_blank" >' + title + ': <em>' + projectTitle + ' - ' + formatCurrency(currentAmount) + ' - ' + functionalAreaName + ' - waiting for ' + participantFriendlyName + '(' + 'participantEmailAddress xcx342' + ')' + ' to complete their task.' + '</em></td>';
            //        html += '            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="4" >';
            //        html += '' + title + ': <em>' + projectTitle + ' - ' + 'no budget assigned' + ' - ' + functionalAreaName + '</em>';
            //        html += '</td>';
            //    }
            //    html += '</tr>';
            //}
            //html += '</table></td>';
            //html += '</tr>';


            ////
            //// Third row, "Unclaimed Invitations" summary.
            ////
            //if (invitationData && invitationData.length && (invitationData.length != 0)) { // Only display this section if there is more than 0 invitations. If there are none, don't even bother displaying.
            //    var rowId = 'functionalAreaRow_' + deferredIndex.toString() + '_3';
            //    var imageId = 'alertSectionImage_' + deferredIndex.toString() + '_3';
            //    var collapsibleRowId = 'alertSectionRow_' + deferredIndex.toString() + '_3';
            //    html += '<tr id="' + rowId + '" class="bwFunctionalAreaRow" onclick="$(\'.bwCustomerSummariesCarousel\').bwCustomerSummariesCarousel(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" >';
            //    if (invitationData.length > 0) {
            //        if (invitationData.length == 1) {
            //            html += '<td style="width:11px;vertical-align:top;"></td>';
            //            html += '<td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2">';
            //            html += '<img title="expand" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="' + imageRootPath + '/images/drawer-open.png">';
            //        } else {
            //            html += '<td style="width:11px;vertical-align:top;"></td><td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2">';
            //            html += '<img title="expand" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="' + imageRootPath + '/images/drawer-open.png">';
            //        }
            //    } else {
            //        html += '<td style="width:11px;"></td>';
            //        html += '<td style="padding-left:60px;height:45px;" class="bwHPNDrillDownLinkCell2">';
            //    }
            //    html += '       <span>';
            //    if (invitationData.length == 1) {
            //        html += 'There is ' + invitationData.length + ' unclaimed invitation.';
            //    } else if (invitationData.length > 0) {
            //        html += 'There are ' + invitationData.length + ' unclaimed invitations.';
            //    } else {
            //        html += 'There are ' + invitationData.length + ' unclaimed invitations. Dont display this...';
            //    }
            //    html += '       </span>';
            //    html += '   </td>';

            //    html += '<td class="bwHPNDrillDownLinkCell2"></td>';


            //    html += '</tr>';
            //    // Third row, "Unclaimed Invitations" details.
            //    html += '<tr id="' + collapsibleRowId + '" style="display:none;">';
            //    html += '<td></td>';
            //    html += '<td colspan="2"><table><tbody>';
            //    for (var i = 0; i < invitationData.length; i++) {
            //        html += '   <tr>';
            //        html += '       <td style="width:10px;"></td>';
            //        html += '       <td style="width:10px;"></td>';
            //        html += '            <td style="width:90px;"></td>';
            //        html += '            <td>&nbsp;&nbsp;</td>';
            //        var invitationChar = (globalUrlPrefix + globalUrl + '?invitation=' + invitationData[i].bwInvitationId).indexOf('=') + 1; // notifications[ntypeindex][2][pi][0].indexOf('=') + 1;
            //        var invitationGuid = (globalUrlPrefix + globalUrl + '?invitation=' + invitationData[i].bwInvitationId).substring(invitationChar);
            //        html += '            <td colspan="5" class="tdHomePageSubNotificationIos8"><div id="tdUnclaimedInvitationLinkSwipeEnabled' + i + '"><a style="cursor:pointer;" onclick="cmdViewInvitation(\'' + invitationGuid + '\');" target="_blank" title="Send this link in an email to invite someone to participate in this workflow. You will be notified when they have confirmed their participation.">' + globalUrlPrefix + globalUrl + '?invitation=' + invitationData[i].bwInvitationId + '</a></div></td>';
            //        html += '        </tr>';
            //    }
            //    html += '</tbody></table></td>';
            //    html += '</tr>';
            //}

            ////
            //// Fourth section, "My Requests" summary.
            ////
            //var rowId = 'functionalAreaRow_' + deferredIndex.toString() + '_4';
            //var imageId = 'alertSectionImage_' + deferredIndex.toString() + '_4';
            //var collapsibleRowId = 'alertSectionRow_' + deferredIndex.toString() + '_4';
            //html += '<tr id="' + rowId + '" class="bwFunctionalAreaRow" onclick="$(\'.bwCustomerSummariesCarousel\').bwCustomerSummariesCarousel(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" >';
            //if (myBrData && myBrData.MyRequests && myBrData.MyRequests.length && (myBrData.MyRequests.length > 0)) {
            //    if (myBrData.MyRequests.length == 1) {
            //        html += '<td style="width:11px;vertical-align:top;"></td>';
            //        html += '<td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2">';
            //        html += '<img title="collapse" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="' + imageRootPath + '/images/drawer-open.png">';
            //    } else {
            //        html += '<td style="width:11px;vertical-align:top;"></td>';
            //        html += '<td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2">';
            //        html += '<img title="collapse" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="' + imageRootPath + '/images/drawer-open.png">';
            //    }
            //} else {
            //    html += '<td style="width:11px;"></td>';
            //    html += '<td style="padding-left:60px;height:45px;" class="bwHPNDrillDownLinkCell2">';
            //}
            //html += '       <span>';
            //if (myBrData && myBrData.MyRequests && myBrData.MyRequests.length && (myBrData.MyRequests.length == 1)) {
            //    html += 'You have submitted ' + myBrData.MyRequests.length + ' request.';
            //} else {
            //    html += 'You have submitted ' + myBrData.MyRequests.length + ' requests.';
            //}
            //html += '       </span>';
            //html += '   </td>';

            //html += '<td class="bwHPNDrillDownLinkCell2"></td>';

            //html += '</tr>';


            //// Fourth section, "My Requests" details.
            //html += '<tr id="' + collapsibleRowId + '" style="display:none;">';
            //html += '   <td></td>';
            //html += '   <td colspan="2"><table><tbody>';
            //if (myBrData && myBrData.MyRequests && myBrData.MyRequests.length && (myBrData.MyRequests.length > 0)) {
            //    for (var i = 0; i < myBrData.MyRequests.length; i++) {
            //        var taskTitle = myBrData.MyRequests[i].bwTaskTitle;
            //        var appWebUrl = appweburl;
            //        var budgetRequestId = myBrData.MyRequests[i].bwBudgetRequestId;
            //        var arName = myBrData.MyRequests[i].Title; // DUPLICATE
            //        var brTitle = myBrData.MyRequests[i].ProjectTitle;
            //        var title = myBrData.MyRequests[i].Title;
            //        var budgetAmount = myBrData.MyRequests[i].BudgetAmount;
            //        var requestedCapital = myBrData.MyRequests[i].RequestedCapital;
            //        var requestedExpense = myBrData.MyRequests[i].RequestedExpense;
            //        var taskType = myBrData.MyRequests[i].TaskType;
            //        var bwAssignedToRaciRoleAbbreviation = myBrData.MyRequests[i].bwAssignedToRaciRoleAbbreviation;
            //        var bwAssignedToRaciRoleName = myBrData.MyRequests[i].bwAssignedToRaciRoleName;
            //        var orgId = myBrData.MyRequests[i].OrgId;
            //        var orgName = myBrData.MyRequests[i].OrgName;
            //        var currentAmount = 0;
            //        if (budgetAmount == 'null') {
            //            currentAmount = Number(requestedCapital) + Number(requestedExpense);
            //        } else {
            //            currentAmount = budgetAmount;
            //        }
            //        var daysSinceTaskCreated = 0;
            //        try {
            //            var cd = myBrData.MyRequests[i].bwDueDate;
            //            var year = cd.split('-')[0];
            //            var month = cd.split('-')[1];
            //            var day = cd.split('-')[2].split('T')[0];
            //            var taskCreatedDate = new Date(Number(year), Number(month) - 1, Number(day) - 1); // +1 because we're using overdue date.
            //            var todaysDate = new Date();
            //            var utc1 = Date.UTC(taskCreatedDate.getFullYear(), taskCreatedDate.getMonth(), taskCreatedDate.getDate());
            //            var utc2 = Date.UTC(todaysDate.getFullYear(), todaysDate.getMonth(), todaysDate.getDate());
            //            var _MS_PER_DAY = 1000 * 60 * 60 * 24;
            //            daysSinceTaskCreated = Math.floor((utc2 - utc1) / _MS_PER_DAY);
            //        } catch (e) {
            //            // TODD: THIS NEEDS TO BE REEXAMINED, we are catching this error when the new recurring tasks came into play! //thisMustBeADifferentKindOfTask = true;
            //        }
            //        html += '   <tr>';
            //        html += '       <td style="width:10px;"></td>';
            //        html += '       <td style="width:10px;"></td>';
            //        var functionalAreaId = myBrData.MyRequests[i].FinancialAreaId; // Find the functional area name.
            //        var functionalAreaName = '';
            //        try {
            //            if (BWMData[0]) {
            //                for (var x = 0; x < BWMData[0].length; x++) {
            //                    if (BWMData[0][x][0] = bwWorkflowAppId) { // We have the correct workflow!
            //                        for (var fai = 0; fai < BWMData[0][x][4].length; fai++) {
            //                            if (functionalAreaId == BWMData[0][x][4][fai][0]) {
            //                                functionalAreaName = BWMData[0][x][4][fai][1];
            //                            }
            //                        }
            //                    }
            //                }
            //            }
            //        } catch (e) {
            //        }
            //        html += '<td style="width:45px;"></td>';
            //        html += '    <td style="background-color:white;" ';
            //        //html += 'style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" ';
            //        html += '       onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'' + title + '\', \'' + brTitle + '\', \'' + '' + '\', \'' + bwWorkflowAppId + '\', \'' + budgetRequestId + '\', \'' + orgId + '\', \'' + orgName + '\', this);" ';
            //        html += '       onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');"  ';
            //        //html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'' + appWebUrl + '\', \'' + budgetRequestId + '\', \'' + arName + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\', \'' + bwAssignedToRaciRoleAbbreviation + '\');" ';
            //        html += '>';


            //        html += '       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="' + imageRootPath + '/images/zoom.jpg" />';
            //        html += '    </td>';

            //        html += '            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="3" ';
            //        html += 'onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'' + appWebUrl + '\', \'' + budgetRequestId + '\', \'' + arName + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\', \'' + bwAssignedToRaciRoleAbbreviation + '\', \'' + bwWorkflowTaskItemId + '\');" >';



            //        html += '    <div style="display:inline-block;" bwtrace="xcx778451">';
            //        html += daysSinceTaskCreated.toString() + ' days overduexcx3: ';
            //        html += '        <em>';
            //        html += title + ' - ' + brTitle + ' - ' + formatCurrency(currentAmount) + ' - ' + functionalAreaName + ' ' + '[(' + bwAssignedToRaciRoleAbbreviation + ') ' + bwAssignedToRaciRoleName + ']';
            //        html += '        </em>';
            //        html += '    </div>';
            //        html += '</td>';

            //        html += '</tr>';
            //    }
            //}
            //html += '</tbody></table>';
            //html += '</td>';
            //html += '</tr>';



            ////
            //// Render all but the Fifth section.
            ////
            //var unitTable1 = '';
            //unitTable1 += '<div id="BWFunctionalAreaDiv' + deferredIndex.toString() + '" style="cursor:pointer;" >';
            //unitTable1 += '<table id="BWFunctionalArea' + deferredIndex.toString() + '" style="vertical-align:top;width:100%;">';
            //unitTable1 += html;
            //unitTable1 += '</tbody></table>';
            //unitTable1 += '</div>';




            //var test = '<div id="BWFunctionalAreaDiv1" style="cursor:pointer;"><table id="BWFunctionalArea1" style="vertical-align:top;width:100%;"></table><table id="tblHomePageAlertSectionForWorkflow1" style="cursor:default;"><tbody><tr id="functionalAreaRow_1_1" class="bwFunctionalAreaRow" onclick="expandOrCollapseAlertsSection(\'functionalAreaRow_1_1\', \'alertSectionImage_1_1\', \'alertSectionRow_1_1\');"><td style="width:11px;vertical-align:top;"><img src="/images/red-dot.png" width="11" height="11" alt="" style="cursor:pointer;vertical-align:top;"></td><td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2"><img title="collapse" id="alertSectionImage_1_1" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="images/drawer-close.png">       <span>You have 10 pending tasks.       </span>   </td></tr><tr id="alertSectionRow_1_1" style="display:table-row;">   <td></td>   <td><table>   <tbody><tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200002\', \'Pizza\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'c7c7836b-fb17-4d46-9f62-5bfac6795cea\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td><td colspan="3" style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" onmouseenter="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseleave="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'c7c7836b-fb17-4d46-9f62-5bfac6795cea\', \'BR-200002\', \'Pizza\', \'BR-200002\', \'ADMIN\');">       <div style="display:inline-block;" bwtrace="xcx778451">       &nbsp;&nbsp;34 days overdue:        <em>BR-200002 - Pizza - $0.00 -  [(ADMIN) ADMIN]       </em>       </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200003\', \'Tractor\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'cd2bf528-aaf7-4a66-8fa7-09235108244f\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td><td colspan="3" style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" onmouseenter="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseleave="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'cd2bf528-aaf7-4a66-8fa7-09235108244f\', \'BR-200003\', \'Tractor\', \'BR-200003\', \'ADMIN\');">       <div style="display:inline-block;" bwtrace="xcx778451">       &nbsp;&nbsp;34 days overdue:        <em>BR-200003 - Tractor - $0.00 -  [(ADMIN) ADMIN]       </em>       </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200004\', \'Car\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'4335e979-e768-4020-a74a-4041ecff56ee\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td><td colspan="3" style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" onmouseenter="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseleave="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'4335e979-e768-4020-a74a-4041ecff56ee\', \'BR-200004\', \'Car\', \'BR-200004\', \'ADMIN\');">       <div style="display:inline-block;" bwtrace="xcx778451">       &nbsp;&nbsp;24 days overdue:        <em>BR-200004 - Car - $0.00 -  [(ADMIN) ADMIN]       </em>       </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200005\', \'Supper\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'8827c5cc-4231-445c-8fb3-56895cdf1395\', \'xxxx-xxx-xcxccx-xxxxxx13\', \'Kentville\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td><td colspan="3" style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" onmouseenter="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseleave="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'8827c5cc-4231-445c-8fb3-56895cdf1395\', \'BR-200005\', \'Supper\', \'BR-200005\', \'ADMIN\');">       <div style="display:inline-block;" bwtrace="xcx778451">       &nbsp;&nbsp;24 days overdue:        <em>BR-200005 - Supper - $0.00 -  [(ADMIN) ADMIN]       </em>       </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200003\', \'Cupcake\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'2f8d6164-1dad-42e6-9853-c15cbc88c8c7\', \'94837554-76e3-4766-8fde-c95005ba110e\', \'Truro\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td><td colspan="3" style="background-color: rgb(216, 216, 216); padding: 10px; cursor: pointer;" onmouseenter="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseleave="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'2f8d6164-1dad-42e6-9853-c15cbc88c8c7\', \'BR-200003\', \'Cupcake\', \'BR-200003\', \'AVP\');">       <div style="display:inline-block;" bwtrace="xcx778451">       &nbsp;&nbsp;13 days overdue:        <em>BR-200003 - Cupcake - $0.00 -  [(AVP) Assistant Vice President]       </em>       </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200003\', \'Cupcake\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'2f8d6164-1dad-42e6-9853-c15cbc88c8c7\', \'94837554-76e3-4766-8fde-c95005ba110e\', \'Truro\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td><td colspan="3" style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" onmouseenter="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseleave="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'2f8d6164-1dad-42e6-9853-c15cbc88c8c7\', \'BR-200003\', \'Cupcake\', \'BR-200003\', \'VP\');">       <div style="display:inline-block;" bwtrace="xcx778451">       &nbsp;&nbsp;13 days overdue:        <em>BR-200003 - Cupcake - $0.00 -  [(VP) Vice President]       </em>       </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200003\', \'Cupcake\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'2f8d6164-1dad-42e6-9853-c15cbc88c8c7\', \'94837554-76e3-4766-8fde-c95005ba110e\', \'Truro\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td><td colspan="3" style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" onmouseenter="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseleave="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'2f8d6164-1dad-42e6-9853-c15cbc88c8c7\', \'BR-200003\', \'Cupcake\', \'BR-200003\', \'CIO\');">       <div style="display:inline-block;" bwtrace="xcx778451">       &nbsp;&nbsp;13 days overdue:        <em>BR-200003 - Cupcake - $0.00 -  [(CIO) Chief Information Officer]       </em>       </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200006\', \'35lb barbell\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'8ef7510d-a604-4d6a-83c5-88d5935486f5\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td><td colspan="3" style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" onmouseenter="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseleave="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'8ef7510d-a604-4d6a-83c5-88d5935486f5\', \'BR-200006\', \'35lb barbell\', \'BR-200006\', \'ADMIN\');">       <div style="display:inline-block;" bwtrace="xcx778451">       &nbsp;&nbsp;8 days overdue:        <em>BR-200006 - 35lb barbell - $0.00 -  [(ADMIN) ADMIN]       </em>       </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200007\', \'test of bwWorkflowId\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'b50b80e1-8812-4e02-8425-b6c7e1fb261c\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td><td colspan="3" style="background-color: rgb(216, 216, 216); padding: 10px; cursor: pointer;" onmouseenter="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseleave="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'b50b80e1-8812-4e02-8425-b6c7e1fb261c\', \'BR-200007\', \'test of bwWorkflowId\', \'BR-200007\', \'ADMIN\');">       <div style="display:inline-block;" bwtrace="xcx778451">       &nbsp;&nbsp;3 days overdue:        <em>BR-200007 - test of bwWorkflowId - $0.00 -  [(ADMIN) ADMIN]       </em>       </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200008\', \'Oatmeal\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'ce1c2c0b-3be5-4b96-8c99-837bd52c8211\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td><td colspan="3" style="background-color: rgb(216, 216, 216); padding: 10px; cursor: pointer;" onmouseenter="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseleave="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'ce1c2c0b-3be5-4b96-8c99-837bd52c8211\', \'BR-200008\', \'Oatmeal\', \'BR-200008\', \'ADMIN\');">       <div style="display:inline-block;" bwtrace="xcx778451">       &nbsp;&nbsp;1 day overdue:        <em>BR-200008 - Oatmeal - $0.00 -  [(ADMIN) ADMIN]       </em>       </div></td></tr></tbody></table></td></tr><tr id="functionalAreaRow_1_2" class="bwFunctionalAreaRow" onclick="expandOrCollapseAlertsSection(\'functionalAreaRow_1_2\', \'alertSectionImage_1_2\', \'alertSectionRow_1_2\');"><td style="width:11px;vertical-align:top;"></td><td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2"><img title="expand" id="alertSectionImage_1_2" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="images/drawer-open.png">       <span>There are 8 budget requests going through the approval process.       </span>   </td></tr><tr id="alertSectionRow_1_2" style="display:none;"><td></td><td><table>   <tbody><tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200003\', \'Cupcake\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'2f8d6164-1dad-42e6-9853-c15cbc88c8c7\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="4" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'2f8d6164-1dad-42e6-9853-c15cbc88c8c7\', \'BR-200003\', \'Cupcake\', \'BR-200003\');" target="_blank">BR-200003: <em>Cupcake - no budget assigned - </em></td>        </tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200002\', \'Pizza\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'c7c7836b-fb17-4d46-9f62-5bfac6795cea\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="4" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'c7c7836b-fb17-4d46-9f62-5bfac6795cea\', \'BR-200002\', \'Pizza\', \'BR-200002\');" target="_blank">BR-200002: <em>Pizza - no budget assigned - </em></td>        </tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200003\', \'Tractor\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'cd2bf528-aaf7-4a66-8fa7-09235108244f\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="4" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'cd2bf528-aaf7-4a66-8fa7-09235108244f\', \'BR-200003\', \'Tractor\', \'BR-200003\');" target="_blank">BR-200003: <em>Tractor - no budget assigned - </em></td>        </tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200005\', \'Supper\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'8827c5cc-4231-445c-8fb3-56895cdf1395\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="4" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'8827c5cc-4231-445c-8fb3-56895cdf1395\', \'BR-200005\', \'Supper\', \'BR-200005\');" target="_blank">BR-200005: <em>Supper - no budget assigned - </em></td>        </tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200004\', \'Car\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'4335e979-e768-4020-a74a-4041ecff56ee\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="4" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'4335e979-e768-4020-a74a-4041ecff56ee\', \'BR-200004\', \'Car\', \'BR-200004\');" target="_blank">BR-200004: <em>Car - no budget assigned - </em></td>        </tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200006\', \'35lb barbell\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'8ef7510d-a604-4d6a-83c5-88d5935486f5\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="4" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'8ef7510d-a604-4d6a-83c5-88d5935486f5\', \'BR-200006\', \'35lb barbell\', \'BR-200006\');" target="_blank">BR-200006: <em>35lb barbell - no budget assigned - </em></td>        </tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200007\', \'test of bwWorkflowId\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'b50b80e1-8812-4e02-8425-b6c7e1fb261c\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="4" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'b50b80e1-8812-4e02-8425-b6c7e1fb261c\', \'BR-200007\', \'test of bwWorkflowId\', \'BR-200007\');" target="_blank">BR-200007: <em>test of bwWorkflowId - no budget assigned - </em></td>        </tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200008\', \'Oatmeal\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'ce1c2c0b-3be5-4b96-8c99-837bd52c8211\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="4" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'ce1c2c0b-3be5-4b96-8c99-837bd52c8211\', \'BR-200008\', \'Oatmeal\', \'BR-200008\');" target="_blank">BR-200008: <em>Oatmeal - no budget assigned - </em></td>        </tr></tbody></table></td></tr><tr id="functionalAreaRow_1_3" class="bwFunctionalAreaRow" onclick="expandOrCollapseAlertsSection(\'functionalAreaRow_1_3\', \'alertSectionImage_1_3\', \'alertSectionRow_1_3\');"><td style="width:11px;vertical-align:top;"></td><td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2"><img title="expand" id="alertSectionImage_1_3" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="images/drawer-open.png">       <span>There are 2 unclaimed invitations.       </span>   </td></tr><tr id="alertSectionRow_1_3" style="display:none;"><td></td><td><table>   <tbody><tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td>            <td style="width:90px;"></td>            <td>&nbsp;&nbsp;</td>            <td colspan="5" class="tdHomePageSubNotificationIos8"><div id="tdUnclaimedInvitationLinkSwipeEnabled0"><a style="cursor:pointer;" onclick="cmdViewInvitation(\'df6eb834-644d-4158-aba7-4f1cd6e7fc28\');" target="_blank" title="Send this link in an email to invite someone to participate in this workflow. You will be notified when they have confirmed their participation.">https://budgetworkflow.com?invitation=df6eb834-644d-4158-aba7-4f1cd6e7fc28</a></div></td>        </tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td>            <td style="width:90px;"></td>            <td>&nbsp;&nbsp;</td>            <td colspan="5" class="tdHomePageSubNotificationIos8"><div id="tdUnclaimedInvitationLinkSwipeEnabled1"><a style="cursor:pointer;" onclick="cmdViewInvitation(\'155f6e08-15da-437f-b413-4816ef1d81b7\');" target="_blank" title="Send this link in an email to invite someone to participate in this workflow. You will be notified when they have confirmed their participation.">https://budgetworkflow.com?invitation=155f6e08-15da-437f-b413-4816ef1d81b7</a></div></td>        </tr></tbody></table></td></tr><tr id="functionalAreaRow_1_4" class="bwFunctionalAreaRow" onclick="expandOrCollapseAlertsSection(\'functionalAreaRow_1_4\', \'alertSectionImage_1_4\', \'alertSectionRow_1_4\');"><td style="width:11px;vertical-align:top;"></td><td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2"><img title="collapse" id="alertSectionImage_1_4" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="images/drawer-open.png">       <span>You have submitted 8 requests.       </span>   </td></tr><tr id="alertSectionRow_1_4" style="display:none;">   <td></td>   <td><table>   <tbody><tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200003\', \'Cupcake\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'2f8d6164-1dad-42e6-9853-c15cbc88c8c7\', \'94837554-76e3-4766-8fde-c95005ba110e\', \'Truro\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="3" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'2f8d6164-1dad-42e6-9853-c15cbc88c8c7\', \'BR-200003\', \'Cupcake\', \'BR-200003\', \'undefined\');">    <div style="display:inline-block;" bwtrace="xcx778451">0 days overduexcx3:         <em>BR-200003 - Cupcake - $0.00 -  [(undefined) undefined]        </em>    </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200002\', \'Pizza\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'c7c7836b-fb17-4d46-9f62-5bfac6795cea\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="3" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'c7c7836b-fb17-4d46-9f62-5bfac6795cea\', \'BR-200002\', \'Pizza\', \'BR-200002\', \'undefined\');">    <div style="display:inline-block;" bwtrace="xcx778451">0 days overduexcx3:         <em>BR-200002 - Pizza - $0.00 -  [(undefined) undefined]        </em>    </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200003\', \'Tractor\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'cd2bf528-aaf7-4a66-8fa7-09235108244f\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="3" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'cd2bf528-aaf7-4a66-8fa7-09235108244f\', \'BR-200003\', \'Tractor\', \'BR-200003\', \'undefined\');">    <div style="display:inline-block;" bwtrace="xcx778451">0 days overduexcx3:         <em>BR-200003 - Tractor - $0.00 -  [(undefined) undefined]        </em>    </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200005\', \'Supper\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'8827c5cc-4231-445c-8fb3-56895cdf1395\', \'xxxx-xxx-xcxccx-xxxxxx13\', \'Kentville\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="3" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'8827c5cc-4231-445c-8fb3-56895cdf1395\', \'BR-200005\', \'Supper\', \'BR-200005\', \'undefined\');">    <div style="display:inline-block;" bwtrace="xcx778451">0 days overduexcx3:         <em>BR-200005 - Supper - $0.00 -  [(undefined) undefined]        </em>    </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200004\', \'Car\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'4335e979-e768-4020-a74a-4041ecff56ee\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="3" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'4335e979-e768-4020-a74a-4041ecff56ee\', \'BR-200004\', \'Car\', \'BR-200004\', \'undefined\');">    <div style="display:inline-block;" bwtrace="xcx778451">0 days overduexcx3:         <em>BR-200004 - Car - $0.00 -  [(undefined) undefined]        </em>    </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200006\', \'35lb barbell\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'8ef7510d-a604-4d6a-83c5-88d5935486f5\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="3" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'8ef7510d-a604-4d6a-83c5-88d5935486f5\', \'BR-200006\', \'35lb barbell\', \'BR-200006\', \'undefined\');">    <div style="display:inline-block;" bwtrace="xcx778451">0 days overduexcx3:         <em>BR-200006 - 35lb barbell - $0.00 -  [(undefined) undefined]        </em>    </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200007\', \'test of bwWorkflowId\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'b50b80e1-8812-4e02-8425-b6c7e1fb261c\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="3" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'b50b80e1-8812-4e02-8425-b6c7e1fb261c\', \'BR-200007\', \'test of bwWorkflowId\', \'BR-200007\', \'undefined\');">    <div style="display:inline-block;" bwtrace="xcx778451">0 days overduexcx3:         <em>BR-200007 - test of bwWorkflowId - $0.00 -  [(undefined) undefined]        </em>    </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200008\', \'Oatmeal\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'ce1c2c0b-3be5-4b96-8c99-837bd52c8211\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="3" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'ce1c2c0b-3be5-4b96-8c99-837bd52c8211\', \'BR-200008\', \'Oatmeal\', \'BR-200008\', \'undefined\');">    <div style="display:inline-block;" bwtrace="xcx778451">0 days overduexcx3:         <em>BR-200008 - Oatmeal - $0.00 -  [(undefined) undefined]        </em>    </div></td></tr></tbody></table></td></tr></tbody></table></div>';





            //var result = {
            //    html: unitTable1
            //}
            return html;

            //} catch (e) {
            //    console.log('Exception in generateHomePageNotificationScreenHtml():1335-1: ' + e.message + ', ' + e.stack);
            //    displayAlertDialog('Exception in generateHomePageNotificationScreenHtml():1335-1: ' + e.message + ', ' + e.stack);
            //    var result = {
            //        html: 'Exception in generateHomePageNotificationScreenHtml():1335-1: ' + e.message + ', ' + e.stack
            //    }
            //    return result;
            //}
        } catch (e) {
            console.log('Exception in generateHomePageNotificationScreenHtml_new():1335-1: ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in generateHomePageNotificationScreenHtml_new():1335-1: ' + e.message + ', ' + e.stack);
            var result = {
                html: 'Exception in generateHomePageNotificationScreenHtml_new():1335-1: ' + e.message + ', ' + e.stack
            }
            return result;
        }
    },




    generateHomePageNotificationScreenHtml: function () {
        try {
            console.log('In bwCustomerSummariesCarousel.js.generateHomePageNotificationScreenHtml().');

            var myBrData = this.options.myBrData
            var serverside = false;
            var deferredIndex = this.options.deferredIndex;
            var bwWorkflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');


            var html = '';

            html += '<style>';
            html += '.bwCustomerSummariesCarousel_SelectorButton {';
            //html += '   border:2px solid gray;';
            //html += '   padding:3px 3px 3px 3px;';
            //html += '   border-radius:20px 20px 20px 20px;';
            //html += '   width:25px;height:25px;';
            //html += '   display:inline-block;';
            html += '   cursor:pointer;';
            html += '}';
            html += '.bwCustomerSummariesCarousel_SelectorButton:hover {';
            html += '   border:2px solid red;';
            html += '}';
            html += '</style>';
            //
            // Display the pending tasks.
            //
            if (myBrData && myBrData.length && (myBrData.length == 0)) {
                html += 'You have no items. xcx1';
                alert('You have no items. xcx1');
            } else {
                html += 'You have no items. xcx2';
                console.log('You have no items. xcx2');
            }

            if (serverside && serverside == true) {
                html += '<table id="tblHomePageAlertSectionForWorkflow' + deferredIndex.toString() + '" style="cursor:default;opacity:0.5;" >'; // Makes the email/serverside rendering have an opacity setting.
            } else {
                html += '<table id="tblHomePageAlertSectionForWorkflow' + deferredIndex.toString() + '" style="cursor:default;" >';
            }
            //html += '<tbody>';


            //
            // Fourth section, "My Requests" summary.
            //
            var rowId = 'functionalAreaRow_' + deferredIndex.toString() + '_4';
            var imageId = 'alertSectionImage_' + deferredIndex.toString() + '_4';
            var collapsibleRowId = 'alertSectionRow_' + deferredIndex.toString() + '_4';
            html += '<tr id="' + rowId + '" class="bwFunctionalAreaRow" onclick="$(\'.bwCustomerSummariesCarousel\').bwCustomerSummariesCarousel(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" >';
            if (myBrData && myBrData.MyRequests && myBrData.MyRequests.length && (myBrData.MyRequests.length > 0)) {
                if (myBrData.MyRequests.length == 1) {
                    html += '<td style="width:11px;vertical-align:top;"></td>';
                    html += '<td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2">';
                    html += '<img title="collapse" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="' + imageRootPath + '/images/drawer-open.png">';
                } else {
                    html += '<td style="width:11px;vertical-align:top;"></td>';
                    html += '<td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2">';
                    html += '<img title="collapse" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="' + imageRootPath + '/images/drawer-open.png">';
                }
            } else {
                html += '<td style="width:11px;"></td>';
                html += '<td style="padding-left:60px;height:45px;" class="bwHPNDrillDownLinkCell2">';
            }
            html += '       <span>';
            if (myBrData && myBrData.MyRequests && myBrData.MyRequests.length && (myBrData.MyRequests.length == 1)) {
                html += 'You have submitted ' + myBrData.MyRequests.length + ' request.';
            } else {
                html += 'You have submitted ' + myBrData.MyRequests.length + ' requests.';
            }
            html += '       </span>';
            html += '   </td>';

            html += '<td class="bwHPNDrillDownLinkCell2"></td>';

            html += '</tr>';


            // Fourth section, "My Requests" details.
            html += '<tr id="' + collapsibleRowId + '" style="display:none;">';
            html += '   <td></td>';
            html += '   <td colspan="2"><table><tbody>';
            if (myBrData && myBrData.MyRequests && myBrData.MyRequests.length && (myBrData.MyRequests.length > 0)) {
                for (var i = 0; i < myBrData.MyRequests.length; i++) {
                    var taskTitle = myBrData.MyRequests[i].bwTaskTitle;
                    var appWebUrl = appweburl;
                    var budgetRequestId = myBrData.MyRequests[i].bwBudgetRequestId;
                    var arName = myBrData.MyRequests[i].Title; // DUPLICATE
                    var brTitle = myBrData.MyRequests[i].ProjectTitle;
                    var title = myBrData.MyRequests[i].Title;
                    var budgetAmount = myBrData.MyRequests[i].BudgetAmount;
                    var requestedCapital = myBrData.MyRequests[i].RequestedCapital;
                    var requestedExpense = myBrData.MyRequests[i].RequestedExpense;
                    var taskType = myBrData.MyRequests[i].TaskType;
                    var bwAssignedToRaciRoleAbbreviation = myBrData.MyRequests[i].bwAssignedToRaciRoleAbbreviation;
                    var bwAssignedToRaciRoleName = myBrData.MyRequests[i].bwAssignedToRaciRoleName;
                    var orgId = myBrData.MyRequests[i].OrgId;
                    var orgName = myBrData.MyRequests[i].OrgName;
                    var currentAmount = 0;
                    if (budgetAmount == 'null') {
                        currentAmount = Number(requestedCapital) + Number(requestedExpense);
                    } else {
                        currentAmount = budgetAmount;
                    }
                    var daysSinceTaskCreated = 0;
                    try {
                        var cd = myBrData.MyRequests[i].bwDueDate;
                        var year = cd.split('-')[0];
                        var month = cd.split('-')[1];
                        var day = cd.split('-')[2].split('T')[0];
                        var taskCreatedDate = new Date(Number(year), Number(month) - 1, Number(day) - 1); // +1 because we're using overdue date.
                        var todaysDate = new Date();
                        var utc1 = Date.UTC(taskCreatedDate.getFullYear(), taskCreatedDate.getMonth(), taskCreatedDate.getDate());
                        var utc2 = Date.UTC(todaysDate.getFullYear(), todaysDate.getMonth(), todaysDate.getDate());
                        var _MS_PER_DAY = 1000 * 60 * 60 * 24;
                        daysSinceTaskCreated = Math.floor((utc2 - utc1) / _MS_PER_DAY);
                    } catch (e) {
                        // TODD: THIS NEEDS TO BE REEXAMINED, we are catching this error when the new recurring tasks came into play! //thisMustBeADifferentKindOfTask = true;
                    }
                    html += '   <tr>';
                    html += '       <td style="width:10px;"></td>';
                    html += '       <td style="width:10px;"></td>';
                    var functionalAreaId = myBrData.MyRequests[i].FinancialAreaId; // Find the functional area name.
                    var functionalAreaName = '';
                    try {
                        if (BWMData[0]) {
                            for (var x = 0; x < BWMData[0].length; x++) {
                                if (BWMData[0][x][0] = bwWorkflowAppId) { // We have the correct workflow!
                                    for (var fai = 0; fai < BWMData[0][x][4].length; fai++) {
                                        if (functionalAreaId == BWMData[0][x][4][fai][0]) {
                                            functionalAreaName = BWMData[0][x][4][fai][1];
                                        }
                                    }
                                }
                            }
                        }
                    } catch (e) {
                    }
                    html += '<td style="width:45px;"></td>';
                    html += '    <td style="background-color:white;" ';
                    //html += 'style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" ';
                    html += '       onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'' + title + '\', \'' + brTitle + '\', \'' + '' + '\', \'' + bwWorkflowAppId + '\', \'' + budgetRequestId + '\', \'' + orgId + '\', \'' + orgName + '\', this);" ';
                    html += '       onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');"  ';
                    //html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'' + appWebUrl + '\', \'' + budgetRequestId + '\', \'' + arName + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\', \'' + bwAssignedToRaciRoleAbbreviation + '\');" ';
                    html += '>';


                    html += '       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="' + imageRootPath + '/images/zoom.jpg" />';
                    html += '    </td>';

                    html += '            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="3" ';
                    html += 'onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'' + appWebUrl + '\', \'' + budgetRequestId + '\', \'' + arName + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\', \'' + bwAssignedToRaciRoleAbbreviation + '\', \'' + bwWorkflowTaskItemId + '\');" >';



                    html += '    <div style="display:inline-block;" bwtrace="xcx778451">';
                    html += daysSinceTaskCreated.toString() + ' days overduexcx3: ';
                    html += '        <em>';
                    html += title + ' - ' + brTitle + ' - ' + formatCurrency(currentAmount) + ' - ' + functionalAreaName + ' ' + '[(' + bwAssignedToRaciRoleAbbreviation + ') ' + bwAssignedToRaciRoleName + ']';
                    html += '        </em>';
                    html += '    </div>';
                    html += '</td>';

                    html += '</tr>';
                }
            }
            html += '</tbody></table>';
            html += '</td>';
            html += '</tr>';



            //
            // Render all but the Fifth section.
            //
            var unitTable1 = '';
            unitTable1 += '<div id="BWFunctionalAreaDiv' + deferredIndex.toString() + '" style="cursor:pointer;" >';
            unitTable1 += '<table id="BWFunctionalArea' + deferredIndex.toString() + '" style="vertical-align:top;width:100%;">';
            unitTable1 += html;
            unitTable1 += '</tbody></table>';
            unitTable1 += '</div>';




            //var test = '<div id="BWFunctionalAreaDiv1" style="cursor:pointer;"><table id="BWFunctionalArea1" style="vertical-align:top;width:100%;"></table><table id="tblHomePageAlertSectionForWorkflow1" style="cursor:default;"><tbody><tr id="functionalAreaRow_1_1" class="bwFunctionalAreaRow" onclick="expandOrCollapseAlertsSection(\'functionalAreaRow_1_1\', \'alertSectionImage_1_1\', \'alertSectionRow_1_1\');"><td style="width:11px;vertical-align:top;"><img src="/images/red-dot.png" width="11" height="11" alt="" style="cursor:pointer;vertical-align:top;"></td><td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2"><img title="collapse" id="alertSectionImage_1_1" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="images/drawer-close.png">       <span>You have 10 pending tasks.       </span>   </td></tr><tr id="alertSectionRow_1_1" style="display:table-row;">   <td></td>   <td><table>   <tbody><tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200002\', \'Pizza\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'c7c7836b-fb17-4d46-9f62-5bfac6795cea\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td><td colspan="3" style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" onmouseenter="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseleave="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'c7c7836b-fb17-4d46-9f62-5bfac6795cea\', \'BR-200002\', \'Pizza\', \'BR-200002\', \'ADMIN\');">       <div style="display:inline-block;" bwtrace="xcx778451">       &nbsp;&nbsp;34 days overdue:        <em>BR-200002 - Pizza - $0.00 -  [(ADMIN) ADMIN]       </em>       </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200003\', \'Tractor\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'cd2bf528-aaf7-4a66-8fa7-09235108244f\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td><td colspan="3" style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" onmouseenter="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseleave="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'cd2bf528-aaf7-4a66-8fa7-09235108244f\', \'BR-200003\', \'Tractor\', \'BR-200003\', \'ADMIN\');">       <div style="display:inline-block;" bwtrace="xcx778451">       &nbsp;&nbsp;34 days overdue:        <em>BR-200003 - Tractor - $0.00 -  [(ADMIN) ADMIN]       </em>       </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200004\', \'Car\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'4335e979-e768-4020-a74a-4041ecff56ee\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td><td colspan="3" style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" onmouseenter="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseleave="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'4335e979-e768-4020-a74a-4041ecff56ee\', \'BR-200004\', \'Car\', \'BR-200004\', \'ADMIN\');">       <div style="display:inline-block;" bwtrace="xcx778451">       &nbsp;&nbsp;24 days overdue:        <em>BR-200004 - Car - $0.00 -  [(ADMIN) ADMIN]       </em>       </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200005\', \'Supper\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'8827c5cc-4231-445c-8fb3-56895cdf1395\', \'xxxx-xxx-xcxccx-xxxxxx13\', \'Kentville\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td><td colspan="3" style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" onmouseenter="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseleave="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'8827c5cc-4231-445c-8fb3-56895cdf1395\', \'BR-200005\', \'Supper\', \'BR-200005\', \'ADMIN\');">       <div style="display:inline-block;" bwtrace="xcx778451">       &nbsp;&nbsp;24 days overdue:        <em>BR-200005 - Supper - $0.00 -  [(ADMIN) ADMIN]       </em>       </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200003\', \'Cupcake\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'2f8d6164-1dad-42e6-9853-c15cbc88c8c7\', \'94837554-76e3-4766-8fde-c95005ba110e\', \'Truro\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td><td colspan="3" style="background-color: rgb(216, 216, 216); padding: 10px; cursor: pointer;" onmouseenter="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseleave="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'2f8d6164-1dad-42e6-9853-c15cbc88c8c7\', \'BR-200003\', \'Cupcake\', \'BR-200003\', \'AVP\');">       <div style="display:inline-block;" bwtrace="xcx778451">       &nbsp;&nbsp;13 days overdue:        <em>BR-200003 - Cupcake - $0.00 -  [(AVP) Assistant Vice President]       </em>       </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200003\', \'Cupcake\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'2f8d6164-1dad-42e6-9853-c15cbc88c8c7\', \'94837554-76e3-4766-8fde-c95005ba110e\', \'Truro\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td><td colspan="3" style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" onmouseenter="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseleave="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'2f8d6164-1dad-42e6-9853-c15cbc88c8c7\', \'BR-200003\', \'Cupcake\', \'BR-200003\', \'VP\');">       <div style="display:inline-block;" bwtrace="xcx778451">       &nbsp;&nbsp;13 days overdue:        <em>BR-200003 - Cupcake - $0.00 -  [(VP) Vice President]       </em>       </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200003\', \'Cupcake\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'2f8d6164-1dad-42e6-9853-c15cbc88c8c7\', \'94837554-76e3-4766-8fde-c95005ba110e\', \'Truro\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td><td colspan="3" style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" onmouseenter="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseleave="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'2f8d6164-1dad-42e6-9853-c15cbc88c8c7\', \'BR-200003\', \'Cupcake\', \'BR-200003\', \'CIO\');">       <div style="display:inline-block;" bwtrace="xcx778451">       &nbsp;&nbsp;13 days overdue:        <em>BR-200003 - Cupcake - $0.00 -  [(CIO) Chief Information Officer]       </em>       </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200006\', \'35lb barbell\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'8ef7510d-a604-4d6a-83c5-88d5935486f5\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td><td colspan="3" style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" onmouseenter="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseleave="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'8ef7510d-a604-4d6a-83c5-88d5935486f5\', \'BR-200006\', \'35lb barbell\', \'BR-200006\', \'ADMIN\');">       <div style="display:inline-block;" bwtrace="xcx778451">       &nbsp;&nbsp;8 days overdue:        <em>BR-200006 - 35lb barbell - $0.00 -  [(ADMIN) ADMIN]       </em>       </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200007\', \'test of bwWorkflowId\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'b50b80e1-8812-4e02-8425-b6c7e1fb261c\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td><td colspan="3" style="background-color: rgb(216, 216, 216); padding: 10px; cursor: pointer;" onmouseenter="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseleave="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'b50b80e1-8812-4e02-8425-b6c7e1fb261c\', \'BR-200007\', \'test of bwWorkflowId\', \'BR-200007\', \'ADMIN\');">       <div style="display:inline-block;" bwtrace="xcx778451">       &nbsp;&nbsp;3 days overdue:        <em>BR-200007 - test of bwWorkflowId - $0.00 -  [(ADMIN) ADMIN]       </em>       </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200008\', \'Oatmeal\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'ce1c2c0b-3be5-4b96-8c99-837bd52c8211\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td><td colspan="3" style="background-color: rgb(216, 216, 216); padding: 10px; cursor: pointer;" onmouseenter="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseleave="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'ce1c2c0b-3be5-4b96-8c99-837bd52c8211\', \'BR-200008\', \'Oatmeal\', \'BR-200008\', \'ADMIN\');">       <div style="display:inline-block;" bwtrace="xcx778451">       &nbsp;&nbsp;1 day overdue:        <em>BR-200008 - Oatmeal - $0.00 -  [(ADMIN) ADMIN]       </em>       </div></td></tr></tbody></table></td></tr><tr id="functionalAreaRow_1_2" class="bwFunctionalAreaRow" onclick="expandOrCollapseAlertsSection(\'functionalAreaRow_1_2\', \'alertSectionImage_1_2\', \'alertSectionRow_1_2\');"><td style="width:11px;vertical-align:top;"></td><td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2"><img title="expand" id="alertSectionImage_1_2" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="images/drawer-open.png">       <span>There are 8 budget requests going through the approval process.       </span>   </td></tr><tr id="alertSectionRow_1_2" style="display:none;"><td></td><td><table>   <tbody><tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200003\', \'Cupcake\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'2f8d6164-1dad-42e6-9853-c15cbc88c8c7\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="4" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'2f8d6164-1dad-42e6-9853-c15cbc88c8c7\', \'BR-200003\', \'Cupcake\', \'BR-200003\');" target="_blank">BR-200003: <em>Cupcake - no budget assigned - </em></td>        </tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200002\', \'Pizza\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'c7c7836b-fb17-4d46-9f62-5bfac6795cea\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="4" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'c7c7836b-fb17-4d46-9f62-5bfac6795cea\', \'BR-200002\', \'Pizza\', \'BR-200002\');" target="_blank">BR-200002: <em>Pizza - no budget assigned - </em></td>        </tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200003\', \'Tractor\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'cd2bf528-aaf7-4a66-8fa7-09235108244f\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="4" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'cd2bf528-aaf7-4a66-8fa7-09235108244f\', \'BR-200003\', \'Tractor\', \'BR-200003\');" target="_blank">BR-200003: <em>Tractor - no budget assigned - </em></td>        </tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200005\', \'Supper\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'8827c5cc-4231-445c-8fb3-56895cdf1395\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="4" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'8827c5cc-4231-445c-8fb3-56895cdf1395\', \'BR-200005\', \'Supper\', \'BR-200005\');" target="_blank">BR-200005: <em>Supper - no budget assigned - </em></td>        </tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200004\', \'Car\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'4335e979-e768-4020-a74a-4041ecff56ee\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="4" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'4335e979-e768-4020-a74a-4041ecff56ee\', \'BR-200004\', \'Car\', \'BR-200004\');" target="_blank">BR-200004: <em>Car - no budget assigned - </em></td>        </tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200006\', \'35lb barbell\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'8ef7510d-a604-4d6a-83c5-88d5935486f5\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="4" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'8ef7510d-a604-4d6a-83c5-88d5935486f5\', \'BR-200006\', \'35lb barbell\', \'BR-200006\');" target="_blank">BR-200006: <em>35lb barbell - no budget assigned - </em></td>        </tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200007\', \'test of bwWorkflowId\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'b50b80e1-8812-4e02-8425-b6c7e1fb261c\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="4" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'b50b80e1-8812-4e02-8425-b6c7e1fb261c\', \'BR-200007\', \'test of bwWorkflowId\', \'BR-200007\');" target="_blank">BR-200007: <em>test of bwWorkflowId - no budget assigned - </em></td>        </tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200008\', \'Oatmeal\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'ce1c2c0b-3be5-4b96-8c99-837bd52c8211\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="4" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'ce1c2c0b-3be5-4b96-8c99-837bd52c8211\', \'BR-200008\', \'Oatmeal\', \'BR-200008\');" target="_blank">BR-200008: <em>Oatmeal - no budget assigned - </em></td>        </tr></tbody></table></td></tr><tr id="functionalAreaRow_1_3" class="bwFunctionalAreaRow" onclick="expandOrCollapseAlertsSection(\'functionalAreaRow_1_3\', \'alertSectionImage_1_3\', \'alertSectionRow_1_3\');"><td style="width:11px;vertical-align:top;"></td><td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2"><img title="expand" id="alertSectionImage_1_3" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="images/drawer-open.png">       <span>There are 2 unclaimed invitations.       </span>   </td></tr><tr id="alertSectionRow_1_3" style="display:none;"><td></td><td><table>   <tbody><tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td>            <td style="width:90px;"></td>            <td>&nbsp;&nbsp;</td>            <td colspan="5" class="tdHomePageSubNotificationIos8"><div id="tdUnclaimedInvitationLinkSwipeEnabled0"><a style="cursor:pointer;" onclick="cmdViewInvitation(\'df6eb834-644d-4158-aba7-4f1cd6e7fc28\');" target="_blank" title="Send this link in an email to invite someone to participate in this workflow. You will be notified when they have confirmed their participation.">https://budgetworkflow.com?invitation=df6eb834-644d-4158-aba7-4f1cd6e7fc28</a></div></td>        </tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td>            <td style="width:90px;"></td>            <td>&nbsp;&nbsp;</td>            <td colspan="5" class="tdHomePageSubNotificationIos8"><div id="tdUnclaimedInvitationLinkSwipeEnabled1"><a style="cursor:pointer;" onclick="cmdViewInvitation(\'155f6e08-15da-437f-b413-4816ef1d81b7\');" target="_blank" title="Send this link in an email to invite someone to participate in this workflow. You will be notified when they have confirmed their participation.">https://budgetworkflow.com?invitation=155f6e08-15da-437f-b413-4816ef1d81b7</a></div></td>        </tr></tbody></table></td></tr><tr id="functionalAreaRow_1_4" class="bwFunctionalAreaRow" onclick="expandOrCollapseAlertsSection(\'functionalAreaRow_1_4\', \'alertSectionImage_1_4\', \'alertSectionRow_1_4\');"><td style="width:11px;vertical-align:top;"></td><td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2"><img title="collapse" id="alertSectionImage_1_4" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="images/drawer-open.png">       <span>You have submitted 8 requests.       </span>   </td></tr><tr id="alertSectionRow_1_4" style="display:none;">   <td></td>   <td><table>   <tbody><tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200003\', \'Cupcake\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'2f8d6164-1dad-42e6-9853-c15cbc88c8c7\', \'94837554-76e3-4766-8fde-c95005ba110e\', \'Truro\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="3" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'2f8d6164-1dad-42e6-9853-c15cbc88c8c7\', \'BR-200003\', \'Cupcake\', \'BR-200003\', \'undefined\');">    <div style="display:inline-block;" bwtrace="xcx778451">0 days overduexcx3:         <em>BR-200003 - Cupcake - $0.00 -  [(undefined) undefined]        </em>    </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200002\', \'Pizza\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'c7c7836b-fb17-4d46-9f62-5bfac6795cea\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="3" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'c7c7836b-fb17-4d46-9f62-5bfac6795cea\', \'BR-200002\', \'Pizza\', \'BR-200002\', \'undefined\');">    <div style="display:inline-block;" bwtrace="xcx778451">0 days overduexcx3:         <em>BR-200002 - Pizza - $0.00 -  [(undefined) undefined]        </em>    </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200003\', \'Tractor\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'cd2bf528-aaf7-4a66-8fa7-09235108244f\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="3" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'cd2bf528-aaf7-4a66-8fa7-09235108244f\', \'BR-200003\', \'Tractor\', \'BR-200003\', \'undefined\');">    <div style="display:inline-block;" bwtrace="xcx778451">0 days overduexcx3:         <em>BR-200003 - Tractor - $0.00 -  [(undefined) undefined]        </em>    </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200005\', \'Supper\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'8827c5cc-4231-445c-8fb3-56895cdf1395\', \'xxxx-xxx-xcxccx-xxxxxx13\', \'Kentville\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="3" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'8827c5cc-4231-445c-8fb3-56895cdf1395\', \'BR-200005\', \'Supper\', \'BR-200005\', \'undefined\');">    <div style="display:inline-block;" bwtrace="xcx778451">0 days overduexcx3:         <em>BR-200005 - Supper - $0.00 -  [(undefined) undefined]        </em>    </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200004\', \'Car\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'4335e979-e768-4020-a74a-4041ecff56ee\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="3" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'4335e979-e768-4020-a74a-4041ecff56ee\', \'BR-200004\', \'Car\', \'BR-200004\', \'undefined\');">    <div style="display:inline-block;" bwtrace="xcx778451">0 days overduexcx3:         <em>BR-200004 - Car - $0.00 -  [(undefined) undefined]        </em>    </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200006\', \'35lb barbell\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'8ef7510d-a604-4d6a-83c5-88d5935486f5\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="3" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'8ef7510d-a604-4d6a-83c5-88d5935486f5\', \'BR-200006\', \'35lb barbell\', \'BR-200006\', \'undefined\');">    <div style="display:inline-block;" bwtrace="xcx778451">0 days overduexcx3:         <em>BR-200006 - 35lb barbell - $0.00 -  [(undefined) undefined]        </em>    </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200007\', \'test of bwWorkflowId\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'b50b80e1-8812-4e02-8425-b6c7e1fb261c\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="3" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'b50b80e1-8812-4e02-8425-b6c7e1fb261c\', \'BR-200007\', \'test of bwWorkflowId\', \'BR-200007\', \'undefined\');">    <div style="display:inline-block;" bwtrace="xcx778451">0 days overduexcx3:         <em>BR-200007 - test of bwWorkflowId - $0.00 -  [(undefined) undefined]        </em>    </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200008\', \'Oatmeal\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'ce1c2c0b-3be5-4b96-8c99-837bd52c8211\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="3" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'ce1c2c0b-3be5-4b96-8c99-837bd52c8211\', \'BR-200008\', \'Oatmeal\', \'BR-200008\', \'undefined\');">    <div style="display:inline-block;" bwtrace="xcx778451">0 days overduexcx3:         <em>BR-200008 - Oatmeal - $0.00 -  [(undefined) undefined]        </em>    </div></td></tr></tbody></table></td></tr></tbody></table></div>';





            var result = {
                html: unitTable1
            }
            return result;

            //} catch (e) {
            //    console.log('Exception in generateHomePageNotificationScreenHtml():1335-1: ' + e.message + ', ' + e.stack);
            //    displayAlertDialog('Exception in generateHomePageNotificationScreenHtml():1335-1: ' + e.message + ', ' + e.stack);
            //    var result = {
            //        html: 'Exception in generateHomePageNotificationScreenHtml():1335-1: ' + e.message + ', ' + e.stack
            //    }
            //    return result;
            //}
        } catch (e) {
            console.log('Exception in generateHomePageNotificationScreenHtml():1335-1: ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in generateHomePageNotificationScreenHtml():1335-1: ' + e.message + ', ' + e.stack);
            var result = {
                html: 'Exception in generateHomePageNotificationScreenHtml():1335-1: ' + e.message + ', ' + e.stack
            }
            return result;
        }
    },


    _create_old: function () {
        this.element.addClass("bwCustomerSummariesCarousel");
        var thiz = this; // Need this because of the asynchronous operations below.
        try {
            alert('WHAT?????????????????????????????????????????????????????????????');
            var html = '';

            html += '<style>';
            html += '.executiveSummaryInCarousel { ';
            html += '   min-width: 300px;'; // This is where the minimum size of the carousel tasks is set.
            html += '   min-height: 300px;'; // This is where the minimum size of the carousel tasks is set.
            html += '   border:2px solid lightgray;border-radius:30px 30px 30px 30px;padding:0 10px 20px 10px;';
            html += '   vertical-align:top;';
            html += '   background-color:white;';
            html += '}';
            html += '.executiveSummaryInCarousel:hover { ';
            html += '   background-color:aliceblue;';
            html += '   border:2px solid skyblue;';
            html += '   cursor:pointer !important;';
            html += '}';
            html += '</style>';




















            //html += '<table style="background-color:whitesmoke;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">    <tbody>';
            //html += '   <tr style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">        ';
            //html += '       <td style="text-align:center;vertical-align:middle;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">            ';
            //html += '           <table id="tableCarousel" style="background-color:whitesmoke;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;width:850px;">                <tbody>';
            //html += '               <tr>                    ';
            //html += '                   <td></td>                    ';
            //html += '                   <td style="text-align:center;">                        ';
            //html += '                       <table style="width:100%">                            <tbody>';
            //html += '                           <tr>                                ';
            //html += '                               <td style="width:15%;"></td>                                ';
            //html += '                               <td style="width:70%;">                                    ';
            //html += '                                   <span id="spanCarouselImageIndicator1" onclick="cmdCarouselImageIndicatorClick('0');" class="spanCarouselImageIndicatorDisabled" title="Slide #1" style="color: rgb(6, 107, 139); cursor: default;">·1</span>&nbsp;';
            //html += '                                   <span id="spanCarouselImageIndicator2" onclick="cmdCarouselImageIndicatorClick('1');" class="spanCarouselImageIndicatorDisabled" title="Slide #2" style="color: white; cursor: pointer;">·2</span>&nbsp;                                    ';
            //html += '                                   <span id="spanCarouselImageIndicator3" onclick="cmdCarouselImageIndicatorClick('2');" class="spanCarouselImageIndicatorDisabled" title="Slide #3" style="color: white; cursor: pointer;">·3</span>&nbsp;                                    ';
            //html += '                                   <span id="spanCarouselImageIndicator4" onclick="cmdCarouselImageIndicatorClick('3');" class="spanCarouselImageIndicatorDisabled" title="Slide #4" style="color: white; cursor: pointer;">·4</span>&nbsp;                                    ';
            //html += '                                   <span id="spanCarouselImageIndicator5" onclick="cmdCarouselImageIndicatorClick('4');" class="spanCarouselImageIndicatorDisabled" title="Slide #5" style="color: white; cursor: pointer;">·5</span>&nbsp;                                    ';
            //html += '                                   <span id="spanCarouselImageIndicator6" onclick="cmdCarouselImageIndicatorClick('5');" class="spanCarouselImageIndicatorDisabled" title="Slide #6" style="color: white; cursor: pointer;">·6</span>&nbsp;                                    ';
            //html += '                                   <span id="spanCarouselImageIndicator7" onclick="cmdCarouselImageIndicatorClick('6');" class="spanCarouselImageIndicatorDisabled" title="Slide #7" style="color: white; cursor: pointer;">·7</span>&nbsp;                                    ';
            //html += '                                   <span id="spanCarouselImageIndicator8" onclick="cmdCarouselImageIndicatorClick('7');" class="spanCarouselImageIndicatorDisabled" title="Slide #8" style="color: white; cursor: pointer;">·8</span>&nbsp;                                    ';
            //html += '                                   <span id="spanCarouselImageIndicator9" onclick="cmdCarouselImageIndicatorClick('8');" class="spanCarouselImageIndicatorDisabled" title="Slide #9" style="color: white; cursor: pointer;">·9</span>&nbsp;                                    ';
            //html += '                                   <span id="spanCarouselImageIndicator10" onclick="cmdCarouselImageIndicatorClick('9');" class="spanCarouselImageIndicatorDisabled" title="Slide #10" style="color: white; cursor: pointer;">·10</span>&nbsp;                                </td>                                <td style="width:15%;">                                    ';
            //html += '                                   <span id="spanAudioOnOff" onclick="cmdAudioToggleOnOff();" style="text-align:left;cursor:pointer;"></span>                                    '; 
            //html += '                                   <div id="divCarouselPausePlay"></div>                                ';
            //html += '                               </td>                            ';
            //html += '                           </tr>                        ';
            //html += '                       </tbody></table>                    ';
            //html += '                   </td>                    ';
            //html += '                   <td></td>                ';
            //html += '               </tr>                ';
            //html += '               <tr>                    ';
            //html += '                   <td style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">                        ';
            //html += '                       <div id="divLeftNavigationArrow" class="carouselLeftNavigationArrow" onclick="$('.bwHowDoesItWorkCarousel').bwHowDoesItWorkCarousel('cmdCarouselNavigateLeft');">&lt;</div>                    ';
            //html += '                   </td>                    ';
            //html += '                   <td>                        ';
            //html += '                       <span id="spanCarouselHeaderText" style="font-family: 'Segoe UI Light','Segoe UI','Segoe',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 15pt;">1. Create, review, and approve budget requests.</span>                        <br><br>                        <span id="spanCarouselImage" style="width: 850px; height: 550px; opacity: 1; display: inline-block; visibility: visible;"><img src="slides/slide20-1.png" alt="" width="632.6116373477672px" height="550px"></span>                    </td>                    <td style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">                        ';
            //html += '                       <div id="divRightNavigationArrow" class="carouselRightNavigationArrow" onclick="$('.bwHowDoesItWorkCarousel').bwHowDoesItWorkCarousel('cmdCarouselNavigateRight');">&gt;</div>                    ';
            //html += '                   </td>                ';
            //html += '               </tr>                ';
            //html += '               <tr>                    ';
            //html += '                   <td style="height:27px;">&nbsp;</td>                    ';
            //html += '                   <td></td>                    ';
            //html += '                   <td></td>                ';
            //html += '               </tr>            ';
            //html += '           </tbody></table>        ';
            //html += '       </td>    ';
            //html += '   </tr>';
            //html += '</tbody></table>';



            //
            // 2-12-2022 Rendering left and right carousel navigation arrow buttons. Not placed correctly yet.
            //
            console.log('2-12-2022 Rendering left and right carousel navigation arrow buttons. Not placed correctly yet.');
            html += '<div  style="vertical-align:middle;overflow-x: scroll;white-space:nowrap;max-width:1900px;border:2px solid lightgray;border-radius:30px 30px 30px 30px;padding:0 10px 20px 10px;">';
            html += '   <table>';
            html += '       <tr>';
            html += '           <td>';
            html += '               <div id="divLeftNavigationArrow" style="width:50px;height:50px;float:left;vertical-align:middle;" class="carouselLeftNavigationArrow" onclick="$(\'.bwHowDoesItWorkCarousel\').bwHowDoesItWorkCarousel(\'cmdCarouselNavigateLeft\');">';
            html += '                   &lt;';
            html += '               </div>';
            html += '           </td>';
            html += '           <td>';
            html += '               <div id="divBwExecutiveSummariesCarousel2">';
            html += '                   <br />';
            html += '                   <img title="collapse" id="xcx323454" style="cursor:pointer;width:60px;height:60px;vertical-align:middle;float:none;" src="images/drawer-close.png" />';
            html += '                   &nbsp;';
            html += '                   <span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 22pt;">';
            html += '                       <strong>You have xx pending tasks.:</strong><br /><br />';
            html += '                   </span>';
            html += '               </div>';
            html += '           </td>';
            html += '           <td>';
            html += '               <div id="divRightNavigationArrow" class="carouselRightNavigationArrow" onclick="$(\'.bwHowDoesItWorkCarousel\').bwHowDoesItWorkCarousel(\'cmdCarouselNavigateRight\');">';
            html += '                   &gt;xcx34278';
            html += '               </div>';
            html += '           </td>';
            html += '       </tr>';
            html += '   </table>';
            html += '</div>'; // This is where we set the max-width of the carousel display. It scrolls to see all items.






            if (this.options.taskData && this.options.taskData.length && this.options.taskData.length > 0) {
                $(this.element).html(html);

                this.getTheLatestRequestsAndRender();
            }








            this.options.HasBeenInitialized = true;

            console.log('In bwCustomerSummariesCarousel._create(). The widget has been initialized.');

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwCustomerSummariesCarousel</span>';
            html += '<br />';
            html += '<span style="">Exception in bwCustomerSummariesCarousel.Create(): ' + e.message + ', ' + e.stack + '</span>';
            thiz.element.html(html);
        }
    },

    //carouselItem_AddOnClick: function (carouselItem_Id, bwBudgetRequestId, Title, ProjectTitle, bwAssignedToRaciRoleAbbreviation, bwWorkflowTaskItemId) {
    //    try {
    //        console.log('In carouselItem_AddOnClick().');

    //        $('#' + carouselItem_Id).bind('click', function () {
    //            try {
    //                console.log('In bwCustomerSummariesCarousel.js.' + carouselItem_Id + '.click().');

    //                $('.bwRequest').bwRequest('displayArInDialog', 'https://budgetworkflow.com', bwBudgetRequestId, Title, ProjectTitle, Title, bwAssignedToRaciRoleAbbreviation, bwWorkflowTaskItemId);

    //            } catch (e) {
    //                console.log('Exception in bwCustomerSummariesCarousel.js.' + carouselItem_Id + '.click(): ' + e.message + ' , ' + e.stack);
    //                displayAlertDialog('Exception in bwCustomerSummariesCarousel.js.' + carouselItem_Id + '.click(): ' + e.message + ' , ' + e.stack);
    //            }
    //        });

    //    } catch (e) {
    //        console.log('Exception in carouselItem_AddOnClick(): ' + e.message + ', ' + e.stack);
    //        displayAlertDialog('Exception in carouselItem_AddOnClick(): ' + e.message + ', ' + e.stack);
    //    }
    //},



    getTheLatestRequestsAndRender: function (spinnerText) {
        try {
            console.log('In bwCustomerSummariesCarousel.getTheLatestRequestsAndRender().');
            var thiz = this;

            debugger;
            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            var carouselItemIndex = 0;
            if (!(this.options.myBrData && this.options.myBrData.length && (this.options.myBrData.length > 0))) { 

                console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> There is no this.options.myBrData.');

            } else {

                for (var i = (this.options.myBrData.length - 1) ; i > -1; i--) {
                    if (carouselItemIndex < 100) { // This is where we set how many tasks we will display in the carousel. Zero-based, so < 5 means display 5 tasks.

                        var bwBudgetRequestId = this.options.myBrData[i].bwBudgetRequestId;
                        //var bwWorkflowTaskItemId = this.options.taskData[i].bwWorkflowTaskItemId;

                        var carouselItem_Id = 'bwCustomerSummariesCarousel_executiveSummaryInCarousel_' + carouselItemIndex;

                        var html = '';

                        html += '   <div id="' + carouselItem_Id + '" xcx="xcx33456-2" class="executiveSummaryInCarousel" bwbudgetrequestid="" style="min-width:300px;display:inline-block;white-space:nowrap;color: rgb(38, 38, 38); font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif; font-size: 1.25em;" ';
                        //this.carouselItem_AddOnClick(carouselItem_Id, bwBudgetRequestId, this.options.taskData[i].Title, this.options.taskData[i].ProjectTitle, this.options.taskData[i].bwAssignedToRaciRoleAbbreviation, bwWorkflowTaskItemId);

                        var ProjectTitle_clean = String(this.options.myBrData[i].ProjectTitle).replace(/["]/g, '&quot;').replace(/[']/g, '\\&#39;'); //&#39;'); // This is done because if the ProjectTitle (description) has a quote in it, there will be issues! The click event will fail to invoke the method. 

                        html += '   xcx="342523326-1"    onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'' + bwBudgetRequestId + '\', \'' + this.options.myBrData[i].Title + '\', \'' + ProjectTitle_clean + '\', \'' + this.options.myBrData[i].Title + '\', \'' + this.options.myBrData[i].bwAssignedToRaciRoleAbbreviation + '\', \'' + bwWorkflowTaskItemId + '\');" ';
                        html += '   >';


                        html += '<br />';
                        //html += '<span style="font-size:18pt;color:purple;font-weight:bold;">Task: <span style="color:goldenrod;font-size:18pt;font-weight:bold;">' + this.options.taskData[i].bwTaskTitle + '</span></span>'; // font-family: 'Segoe UI Light','Segoe UI','Segoe',Tahoma,Helvetica,Arial,sans-serif;
                        html += '<span style="color:goldenrod;font-size:18pt;font-weight:bold;">' + this.options.myBrData[i].bwTaskTitle + '</span>'; // font-family: 'Segoe UI Light','Segoe UI','Segoe',Tahoma,Helvetica,Arial,sans-serif;










                        html += '<br />';
                        html += '<span style="color:black;font-size:12pt;font-weight:normal;">Your role: <span style="font-weight:bold;">' + this.options.taskData[i].bwAssignedToRaciRoleName + ' (' + this.options.taskData[i].bwAssignedToRaciRoleAbbreviation + ')</span></span>';



                        html += '<br />';
                        var timestamp4 = $('.bwAuthentication').bwAuthentication('getBudgetWorkflowStandardizedDate', this.options.taskData[i].Created);
                        html += '<span style="color:black;font-size:12pt;font-weight:normal;">Task created: ' + timestamp4.toString() + '</span>';



                        html += '<br />';
                        if (this.options.taskData[i].bwStatus.toString().toLowerCase() == 'collaboration') {
                            html += '<span style="font-size:12pt;color:black;font-weight:normal;">bwStatus: <span style="font-weight:bold;">' + this.options.taskData[i].bwStatus + ' </span><span style="color:black;font-size:12pt;font-weight:normal;">[xx time left]</span></span>'; // font-family: 'Segoe UI Light','Segoe UI','Segoe',Tahoma,Helvetica,Arial,sans-serif;
                        } else {
                            html += '<span style="font-size:12pt;color:black;font-weight:normal;">bwStatus: <span style="font-weight:bold;">' + this.options.taskData[i].bwStatus + ' </span><span style="color:black;font-size:12pt;font-weight:normal;">[xx days old]</span></span>'; // font-family: 'Segoe UI Light','Segoe UI','Segoe',Tahoma,Helvetica,Arial,sans-serif;
                            // bwStatus, bwRelatedItemId, bwWorkflowTaskItemId
                        }


                        html += '<br />';
                        var timestamp4 = $('.bwAuthentication').bwAuthentication('getBudgetWorkflowStandardizedDate', this.options.taskData[i].DailyOverdueTaskNotificationDate);
                        html += '<span style="font-size:12pt;color:black;font-weight:normal;cursor:help !important;" title="This is when the next reminder is scheduled to be sent..." alt="This is when the next reminder is scheduled to be sent...">Reminder: <span style="font-weight:normal;">' + timestamp4 + ' </span></span>'; // font-family: 'Segoe UI Light','Segoe UI','Segoe',Tahoma,Helvetica,Arial,sans-serif;






                        html += '<br />';
                        html += '<hr style="color:skyblue;" />';

                        html += '<span style="font-size:12pt;"><span style="color:goldenrod;font-size:18pt;font-weight:bold;">' + this.options.taskData[i].Title + '</span></span>';
                        html += '<br />';
                        //html += '<span style="font-size:12pt;">Description: <span style="color:goldenrod;font-size:18pt;font-weight:bold;">' + this.options.taskData[i].ProjectTitle + '</span></span>';
                        html += '<span style="color:goldenrod;font-size:18pt;font-weight:bold;">' + this.options.taskData[i].ProjectTitle + '</span>';
                        html += '<br />';

                        html += '<span style="color:black;font-size:12pt;font-weight:normal;">Requested by: ' + this.options.taskData[i].CreatedBy + '</span>';
                        html += '<br />';




                        // 2-8-2022
                        var RequestedCapital_cleaned = $('.bwAuthentication').bwAuthentication('getBudgetWorkflowStandardizedCurrency', this.options.taskData[i].RequestedCapital);
                        html += '<span style="color:black;font-size:12pt;font-weight:normal;">Requested capital: <span style="color:purple;font-size:18pt;">' + RequestedCapital_cleaned + '</span></span>';
                        html += '<br />';




                        debugger;
                        var timestamp4;
                        var requestCreatedDate;
                        for (var r = 0; r < this.options.brData.PendingBudgetRequests.length; r++) {
                            if (bwBudgetRequestId == this.options.brData.PendingBudgetRequests[r].bwBudgetRequestId) {
                                // We found it!
                                requestCreatedDate = this.options.brData.PendingBudgetRequests[r].Created;
                            }
                        }
                        if (requestCreatedDate) {
                            timestamp4 = $('.bwAuthentication').bwAuthentication('getBudgetWorkflowStandardizedDate', requestCreatedDate);
                        } else {
                            timestamp4 = '[not available]';
                        }
                        html += '<span style="color:black;font-size:12pt;font-weight:normal;">Request created: ' + timestamp4 + '</span>';
                        html += '<br />';





                        html += '<span style="color:black;font-size:12pt;font-weight:normal;">Org: <span style="">' + this.options.taskData[i].OrgName + '</span></span>';
                        html += '<br />';
                        html += '<br />';

                        var bwWorkflowTaskItemId = this.options.taskData[i].bwWorkflowTaskItemId;
                        html += '        <div id="bwExecutiveSummariesCarousel_spanBwExecutiveSummariesCarouselPrimaryImages_' + bwWorkflowTaskItemId + '" style="text-align: center;">';
                        html += '        </div>';
                        html += '   </div>';

                        //debugger;
                        $('#divBwExecutiveSummariesCarousel222').append(html); // Create the html in the div tag.

                        console.log('Calling carouselItem_AddOnClick() xcx124254235');
                        // Now add the onclick event.
                        //var bwWorkflowTaskItemId = this.options.taskData[i].bwWorkflowTaskItemId;
                        //this.carouselItem_AddOnClick(carouselItem_Id, bwBudgetRequestId, this.options.taskData[i].Title, this.options.taskData[i].ProjectTitle, this.options.taskData[i].bwAssignedToRaciRoleAbbreviation, bwWorkflowTaskItemId);

                        carouselItemIndex += 1;





                        //
                        // Display inventory images
                        //
                        // 

                        var InventoryItems = [];
                        for (var j = 0; j < this.options.brData.PendingBudgetRequests.length; j++) {
                            //debugger;
                            //var x = '';
                            if (bwBudgetRequestId == this.options.brData.PendingBudgetRequests[j].bwBudgetRequestId) {
                                //debugger;
                                var tmpJson = this.options.brData.PendingBudgetRequests[j].bwRequestJson;
                                var json = JSON.parse(tmpJson);
                                //debugger;


                                if (json && json.bwSelectInventoryItems && json.bwSelectInventoryItems.value) {
                                    InventoryItems = json.bwSelectInventoryItems.value; //this.options.brData.PendingBudgetRequests[j].bwRequestJson;
                                }
                                break;
                            }
                        }

                        if (InventoryItems.length > 0) {
                            var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                                return v.toString(16);
                            });
                            for (var j = 0; j < InventoryItems.length; j++) {
                                //debugger;
                                var html = '';

                                //var imagePath = thiz.options.operationUriPrefix + '_files/' + workflowAppId + '/inventoryimages/' + InventoryItems[j].bwInventoryItemId + '/inventoryimage.png?v=' + guid;
                                var imagePath = globalUrlPrefix + globalUrl + '/_files/' + workflowAppId + '/inventoryimages/' + InventoryItems[j].bwInventoryItemId + '/inventoryimage.png?v=' + guid;
                                html += '<img src="' + imagePath + '" style="height:150px;" />';
                                html += '<br />';

                                $('#bwExecutiveSummariesCarousel_spanBwExecutiveSummariesCarouselPrimaryImages_' + bwWorkflowTaskItemId).append(html);

                            }
                        }

                        //
                        // end: Display inventory images
                        //


                        var renderAttachments = function (bwWorkflowTaskItemId) {
                            try {
                                //debugger;
                                var operationUri = globalUrlPrefix + globalUrl + '/_files/' + 'getprimaryimageforbudgetrequest/' + workflowAppId + '/' + bwBudgetRequestId; // _files allows us to use nginx to route these to a dedicated file server.
                                $.ajax({
                                    url: operationUri,
                                    method: "GET",
                                    headers: {
                                        "Accept": "application/json; odata=verbose"
                                    },
                                    success: function (data) {
                                        try {

                                            var bwBudgetRequestId;
                                            if (data[0]) {
                                                bwBudgetRequestId = data[0].bwBudgetRequestId;
                                            }
                                            var html = '';
                                            try {
                                                for (var i = 0; i < data.length; i++) {
                                                    if (bwBudgetRequestId) {
                                                        var fileName = data[i].Filename;
                                                        if ((fileName.toUpperCase().indexOf('.XLSX') > -1) || (fileName.toUpperCase().indexOf('.XLS') > -1)) {

                                                            html += '<img src="images/excelicon.png" style="width:100px;height:46px;cursor:pointer;" />';

                                                        } else if (fileName.toUpperCase().indexOf('.MP4') > -1) {

                                                            html += '<img src="images/mp4.jfif" style="width:100px;cursor:pointer;" />';

                                                        } else if (fileName.toUpperCase().indexOf('.VOB') > -1) {

                                                            // We don't show customers .vob files.
                                                            //html += '<img src="images/vob.png" style="width:100px;cursor:pointer;" />';

                                                        } else if (fileName.toUpperCase().indexOf('.MP3') > -1) {

                                                            html += '<img src="images/mp3.png" style="width:100px;cursor:pointer;" />';

                                                        } else {

                                                            var imageUrl = globalUrlPrefix + globalUrl + '/_files/' + workflowAppId + '/' + bwBudgetRequestId + '/' + fileName;
                                                            html += '<img src="' + imageUrl + '" style="height:150px;" />';
                                                            html += '<br />';

                                                        }
                                                    }
                                                }

                                            } catch (e) {
                                                console.log('Didn\'t find an image for data: ' + JSON.stringify(data));
                                                html = '[no image found]';
                                                //document.getElementById('spanExecutiveSummaryPrimaryImages_' + bwBudgetRequestId).innerHTML = html;
                                            }
                                            if (bwBudgetRequestId) {
                                                //document.getElementById('bwExecutiveSummariesCarousel_spanBwExecutiveSummariesCarouselPrimaryImages_' + bwBudgetRequestId).innerHTML = html;
                                                $('#bwExecutiveSummariesCarousel_spanBwExecutiveSummariesCarouselPrimaryImages_' + bwWorkflowTaskItemId).append(html); // 1-25-2022  bwBudgetRequestId).append(html);
                                            }
                                        } catch (e) {
                                            if (e.number) {
                                                displayAlertDialog('Error in populateAttachments():1-1: ' + e.number + ', "' + e.message + '", ' + e.stack);
                                            } else {
                                                // This most likely means that the folders are there on the file services server, but there is nothing in them.
                                                //
                                                // Fileservices has an error, so show nothing! We will put a red exclamation pin in the attachments section eventually! - 10-1-17 todd
                                                //displayAlertDialog('Fileservices has an error: ' + ' "' + e.message + '"');
                                            }
                                        }
                                    },
                                    error: function (data, errorCode, errorMessage) {
                                        if (errorCode === 'timeout' && errorMessage === 'timeout') {
                                            displayAlertDialog('SERVICE UNAVAILABLE. File services is not respondingxcx2. communication timeout is set at ' + ajaxTimeout / 1000 + ' seconds: ' + errorCode + ', ' + errorMessage);
                                        } else {


                                            console.log('');
                                            console.log('********************************************************************');
                                            console.log('Error in bwEecutiveSummariesCarousel.js.showRowHoverDetails:2:3 ' + errorCode + ', ' + errorMessage);
                                            console.log('********************************************************************');
                                            console.log('');

                                            //displayAlertDialog('Error in showRowHoverDetails:2:3 ' + errorCode + ', ' + errorMessage);





                                            // The latest error 1-17-2018 is errorCode:'error' and errorMessage:'Not Found'.
                                            // What does this mean? You can replicate this error!
                                            // at Url: https://budgetworkflow.com/ios8.html, view an offline (Un-submitted) request, and try to add an attachment.
                                        }
                                    }
                                });
                            } catch (e) {
                                console.log('Exception in bwCustomerSummariesCarousel.js.renderAttachments(): ' + e.message + ', ' + e.stack);
                                displayAlertDialog('Exception in bwCustomerSummariesCarousel.js.renderAttachments(): ' + e.message + ', ' + e.stack);
                            }
                        }

                        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Calling renderAttachments(). bwWorkflowTaskItemId: ' + bwWorkflowTaskItemId);
                        renderAttachments(bwWorkflowTaskItemId);

                    } else {
                        break;
                    }
                }
            }

        } catch (e) {
            //debugger;
            console.log('Exception in bwCustomerSummariesCarousel.getTheLatestRequestsAndRender(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwCustomerSummariesCarousel.getTheLatestRequestsAndRender(): ' + e.message + ', ' + e.stack);
        }
    },


    expandOrCollapseAlertsSection: function (rowId, imageId, collapsibleRowId) {
        try {
            console.log('In bwCustomerSummariesCarousel.js.expandOrCollapseAlertsSection(' + rowId + ', ' + imageId + ', ' + collapsibleRowId + ').');

            var elementIds = ['', 'alertSectionRow_1_1', 'alertSectionRow_1_2', 'alertSectionRow_1_3'];
            var imageElementIds = ['', 'alertSectionImage_1_1', 'alertSectionImage_1_2', 'alertSectionImage_1_3'];
            var selectedIndex = collapsibleRowId.split('_')[2];
            var img = document.getElementById(imageId);

            if (!img) {
                // This most likely means there are no tasks for this user ("My Tasks"). Do nothing.
            } else {
                var urlClose = 'images/drawer-close.png';
                var urlOpen = 'images/drawer-open.png';

                if (img.src.indexOf(urlClose) > -1) {
                    document.getElementById(collapsibleRowId).style.display = 'none';
                    document.getElementById(imageId).src = urlOpen;
                } else {
                    document.getElementById(collapsibleRowId).style.display = 'table-row';
                    document.getElementById(imageId).src = urlClose;

                    //alert('We need to figure out flip-to-top here. collapsibleRowId: ' + collapsibleRowId); // For example, collapsibleRowId = 'alertSectionRow_0_1'.
                    // <tr id="functionalAreaRow_0_1" ...
                    //      functionalAreaRow_0_2
                    //      functionalAreaRow_0_3
                    //      functionalAreaRow_0_4
                    //      functionalAreaRow_0_5

                    var table = $('#' + collapsibleRowId).closest('table');
                    var rows = $(table).find('tr');
                    var rowIndexArray = [];
                    // First we have to find our rows which we need to re-order. There will be 3 or 4 of them.
                    for (var i = 0; i < rows.length; i++) {
                        var row = $(rows)[i];
                        var id = $(row).attr('id');
                        if (id) {
                            if (id.indexOf('functionalAreaRow_') > -1) {
                                //rowArray.push(row);
                                var index = id.split('_')[2];
                                rowIndexArray.push(index); // We only need the indexes.
                            }
                        }
                    }
                    // Now we have to determine if the row is under the one we expanded. If so, we have to flip-to-top, so that all the bottom rows show up on top of ht eone we just expanded. This lets the user see everything easily without having to scroll to the bottom of the page.
                    var weHaveFoundTheRowWeJustExpanded = false;
                    var selectedRowIndex = collapsibleRowId.split('_')[2];

                    var startRowIndexArrayAt;
                    for (var i = 0; i < rowIndexArray.length; i++) {
                        if (weHaveFoundTheRowWeJustExpanded == true) {
                            //// Now we have to prepend all this to the top. flip-to-top! :)
                            //var thisBottomRow_Id = 'functionalAreaRow_0_' + rowIndexArray[i];
                            //var thisBottomRow_alertSectionRow_Id = 'alertSectionRow_0_' + rowIndexArray[i];  

                            //// Save them.
                            //var thisBottomRow_Html = document.getElementById(thisBottomRow_Id).outerHTML;
                            //var thisBottomRow_alertSectionRow_Html = document.getElementById(thisBottomRow_alertSectionRow_Id).outerHTML;
                            //// Remove them.
                            //$('#' + thisBottomRow_Id).remove();
                            //$('#' + thisBottomRow_alertSectionRow_Id).remove();
                            //// Add them back prepended.
                            //$(table).prepend(thisBottomRow_alertSectionRow_Html);
                            //$(table).prepend(thisBottomRow_Html);

                            //// Make sure it is collapsed.
                            //var imageId = 'alertSectionImage_0_' + rowIndexArray[i];
                            //document.getElementById(thisBottomRow_alertSectionRow_Id).style.display = 'none';
                            //document.getElementById(imageId).src = urlOpen;

                        } else {
                            var thisRowIndex = $(rowIndexArray)[i];
                            if (thisRowIndex == selectedRowIndex) {
                                weHaveFoundTheRowWeJustExpanded = true; // Now that this is true, everything under this row needs to be flipped to the top.
                                startRowIndexArrayAt = i;
                                break;
                            }
                        }
                    }
                    //
                    // We have to go through them 1 last time, as we have to add them backwards so that it looks ok to the user and is not confusing. THIS doesn't work 100% correctly but leaving for now. 2-19-2022
                    //
                    for (var i = (rowIndexArray.length - 1) ; i > startRowIndexArrayAt; i--) {

                        // Now we have to prepend all this to the top. flip-to-top! :)
                        var thisBottomRow_Id = 'functionalAreaRow_' + this.options.deferredIndex.toString() + '_' + rowIndexArray[i];
                        var thisBottomRow_alertSectionRow_Id = 'alertSectionRow_' + this.options.deferredIndex.toString() + '_' + rowIndexArray[i];

                        // Save them.
                        //alert('thisBottomRow_Id: ' + thisBottomRow_Id);
                        var thisBottomRow_Html = document.getElementById(thisBottomRow_Id).outerHTML;
                        var thisBottomRow_alertSectionRow_Html = document.getElementById(thisBottomRow_alertSectionRow_Id).outerHTML;
                        // Remove them.
                        $('#' + thisBottomRow_Id).remove();
                        $('#' + thisBottomRow_alertSectionRow_Id).remove();
                        // Add them back prepended.
                        $(table).prepend(thisBottomRow_alertSectionRow_Html);
                        $(table).prepend(thisBottomRow_Html);

                        // Make sure it is collapsed.
                        var imageId = 'alertSectionImage_' + this.options.deferredIndex + '_' + rowIndexArray[i];
                        document.getElementById(thisBottomRow_alertSectionRow_Id).style.display = 'none';
                        if (!document.getElementById(imageId)) {
                            // This means that this user has created no requests, and hence no image! :)
                        } else {
                            document.getElementById(imageId).src = urlOpen;
                        }

                    }

                }


                //if (img.src.indexOf(urlClose) > -1) {
                //    // collapsing
                //    if (selectedIndex == 1) {
                //        document.getElementById(elementIds[2]).style.display = 'table-row';
                //        document.getElementById(imageElementIds[2]).src = urlClose;
                //    } else if (selectedIndex == 2) {
                //        document.getElementById(elementIds[1]).style.display = 'table-row';
                //        document.getElementById(imageElementIds[1]).src = urlClose;
                //    } else if (selectedIndex == 3) {
                //        document.getElementById(elementIds[1]).style.display = 'table-row';
                //        document.getElementById(imageElementIds[1]).src = urlClose;
                //    }
                //    document.getElementById(collapsibleRowId).style.display = 'none';
                //    document.getElementById(imageId).src = urlOpen;
                //} else {
                //    // expanding
                //    if (selectedIndex == 1) {
                //        document.getElementById(elementIds[2]).style.display = 'none';
                //        document.getElementById(imageElementIds[2]).src = urlOpen;
                //        document.getElementById(elementIds[1]).style.display = 'none';
                //        document.getElementById(imageElementIds[1]).src = urlOpen;
                //    } else if (selectedIndex == 2) {
                //        document.getElementById(elementIds[1]).style.display = 'none';
                //        try {
                //            document.getElementById(imageElementIds[1]).src = urlOpen;
                //        } catch (e) { }
                //        document.getElementById(elementIds[2]).style.display = 'none';
                //        document.getElementById(imageElementIds[2]).src = urlOpen;
                //    } else if (selectedIndex == 3) {
                //        document.getElementById(elementIds[1]).style.display = 'none';
                //        document.getElementById(imageElementIds[1]).src = urlOpen;
                //        document.getElementById(elementIds[2]).style.display = 'none';
                //        document.getElementById(imageElementIds[2]).src = urlOpen;
                //    }
                //    document.getElementById(collapsibleRowId).style.display = 'table-row';
                //    document.getElementById(imageId).src = urlClose;
                //}




            }

        } catch (e) {
            console.log('Exception in bwCustomerSummariesCarousel.js.expandOrCollapseAlertsSection(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwCustomerSummariesCarousel.js.expandOrCollapseAlertsSection(): ' + e.message + ', ' + e.stack);
        }
    },

    //hide: function () {
    //    try {
    //        //console.log('In bwCustomerSummariesCarousel.hide().');

    //        //$(this.element).style.display = 'none';
    //        try {
    //            $("#divActivitySpinner_WorkingOnItDialog").dialog('close');
    //        } catch (e) {
    //            // do nothing
    //        }

    //    } catch (e) {
    //        console.log('Exception in bwCustomerSummariesCarousel.hide(): ' + e.message + ', ' + e.stack);
    //        alert('Exception in bwCustomerSummariesCarousel.hide(): ' + e.message + ', ' + e.stack);
    //    }
    //}

});