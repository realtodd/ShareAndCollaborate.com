$.widget("bw.bwExecutiveSummariesCarousel", {
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
        This is the bwExecutiveSummariesCarousel.js jQuery Widget. 
        ===========================================================

           [more to follow]
                           
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

           [put your stuff here]

        ===========================================================
        
       */

        taskData: null, // This is what we use to decide what tasks get displayed... the most recent 5.
        brData: null, // We use this to get the bwRequestJson for a request, so that we can display the inventory item images. In particular useful for the "Restaurant" use case.
        HasBeenInitialized: null
    },
    _create: function () {
        this.element.addClass("bwExecutiveSummariesCarousel");
        var thiz = this; // Need this because of the asynchronous operations below.
        try {
            //alert('xcx325673');
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
            html += '               <div id="bwExecutiveSummariesCarousel_divBwExecutiveSummariesCarousel2">';
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
                debugger; // 2-19-2022
                $(this.element).html(html);

                this.getTheLatestRequestsAndRender();
            }








            this.options.HasBeenInitialized = true;

            console.log('In bwExecutiveSummariesCarousel._create(). The widget has been initialized.');

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwExecutiveSummariesCarousel</span>';
            html += '<br />';
            html += '<span style="">Exception in bwExecutiveSummariesCarousel.Create(): ' + e.message + ', ' + e.stack + '</span>';
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
            .removeClass("bwExecutiveSummariesCarousel")
            .text("");
    },
    carouselItem_AddOnClick: function (carouselItem_Id, bwBudgetRequestId, Title, ProjectTitle, bwAssignedToRaciRoleAbbreviation, bwWorkflowTaskItemId) {
        try {
            console.log('In carouselItem_AddOnClick().');

            $('#' + carouselItem_Id).bind('click', function () {
                try {
                    console.log('In bwExecutiveSummariesCarousel.js.' + carouselItem_Id + '.click().');

                    $('.bwRequest').bwRequest('displayArInDialog', 'https://budgetworkflow.com', bwBudgetRequestId, Title, ProjectTitle, Title, bwAssignedToRaciRoleAbbreviation, bwWorkflowTaskItemId);

                } catch (e) {
                    console.log('Exception in bwExecutiveSummariesCarousel.js.' + carouselItem_Id + '.click(): ' + e.message + ' , ' + e.stack);
                    displayAlertDialog('Exception in bwExecutiveSummariesCarousel.js.' + carouselItem_Id + '.click(): ' + e.message + ' , ' + e.stack);
                }
            });

        } catch (e) {
            console.log('Exception in carouselItem_AddOnClick(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in carouselItem_AddOnClick(): ' + e.message + ', ' + e.stack);
        }
    },
    getTheLatestRequestsAndRender: function (spinnerText) {
        try {
            console.log('In bwExecutiveSummariesCarousel.getTheLatestRequestsAndRender().');
            var thiz = this;

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            var carouselItemIndex = 0;
            for (var i = (this.options.taskData.length - 1) ; i > -1; i--) {
                if (carouselItemIndex < 100) { // This is where we set how many tasks we will display in the carousel. Zero-based, so < 5 means display 5 tasks.

                    var bwBudgetRequestId = this.options.taskData[i].bwRelatedItemId;

                    var carouselItem_Id = 'executiveSummaryInCarousel_' + carouselItemIndex;

                    var html = '';

                    html += '   <div id="' + carouselItem_Id + '" class="executiveSummaryInCarousel" bwbudgetrequestid="" style="min-width:300px;display:inline-block;white-space:nowrap;color: rgb(38, 38, 38); font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif; font-size: 1.25em;">';
                   
                    // 2-10-2022
                    //debugger;
                    html += '<br />';
                    if (this.options.taskData[i].bwStatus.toString().toLowerCase() == 'collaboration') {
                        html += '<span style="font-size:18pt;color:purple;font-weight:bold;">Workflow Task bwStatus: ' + this.options.taskData[i].bwStatus + ' <span style="color:black;font-size:12pt;font-weight:normal;">[xx time left]</span></span>'; // font-family: 'Segoe UI Light','Segoe UI','Segoe',Tahoma,Helvetica,Arial,sans-serif;
                    } else {
                        html += '<span style="font-size:18pt;color:purple;font-weight:bold;">Workflow Task bwStatus: ' + this.options.taskData[i].bwStatus + ' <span style="color:black;font-size:12pt;font-weight:normal;">[xx days old]</span></span>'; // font-family: 'Segoe UI Light','Segoe UI','Segoe',Tahoma,Helvetica,Arial,sans-serif;
                        // bwStatus, bwRelatedItemId, bwWorkflowTaskItemId
                    }

                    html += '<br />';
                    html += '<span style="font-size:18pt;color:purple;font-weight:bold;">Task: <span style="color:goldenrod;font-size:18pt;font-weight:normal;">' + this.options.taskData[i].bwTaskTitle + '</span></span>'; // font-family: 'Segoe UI Light','Segoe UI','Segoe',Tahoma,Helvetica,Arial,sans-serif;
                    html += '<br />';
                    html += '<span style="color:black;font-size:12pt;font-weight:normal;">Your role: <span style="font-weight:bold;">' + this.options.taskData[i].bwAssignedToRaciRoleName + ' (' + this.options.taskData[i].bwAssignedToRaciRoleAbbreviation + ')</span></span>';
                    html += '<br />';




                    // 1-28-2022
                    //alert('this.options.taskData[i].Created: ' + this.options.taskData[i].Created);
                    var timestamp4 = $('.bwAuthentication').bwAuthentication('getBudgetWorkflowStandardizedDate', this.options.taskData[i].Created);

                    //html += '<span style="color:black;font-size:12pt;font-weight:normal;">Task created: ' + this.options.taskData[i].Created + '</span>';
                    html += '<span style="color:black;font-size:12pt;font-weight:normal;">Task created: ' + timestamp4.toString() + '</span>';






                    html += '<br />';
                    html += '<hr style="color:skyblue;" />';
                    
                    html += '<span style="font-size:12pt;"><span style="color:goldenrod;font-size:18pt;font-weight:bold;">' + this.options.taskData[i].Title + '</span></span>';
                    html += '<br />';
                    html += '<span style="font-size:12pt;">Description: <span style="color:goldenrod;font-size:18pt;font-weight:bold;">' + this.options.taskData[i].ProjectTitle + '</span></span>';
                    html += '<br />';

                    html += '<span style="color:black;font-size:12pt;font-weight:normal;">Requested by: ' + this.options.taskData[i].CreatedBy + '</span>';
                    html += '<br />';




                    // 2-8-2022
                    var RequestedCapital_cleaned = $('.bwAuthentication').bwAuthentication('getBudgetWorkflowStandardizedCurrency', this.options.taskData[i].RequestedCapital);
                    html += '<span style="color:black;font-size:12pt;font-weight:normal;">Requested capital xcx1-1: <span style="color:purple;font-size:18pt;">' + RequestedCapital_cleaned + '</span></span>';
                    html += '<br />';





                    html += '<span style="color:black;font-size:12pt;font-weight:normal;">Org: <span style="">' + this.options.taskData[i].OrgName + '</span></span>';
                    html += '<br />';
                    html += '<br />';

                    var bwWorkflowTaskItemId = this.options.taskData[i].bwWorkflowTaskItemId;
                    html += '        <div id="spanBwExecutiveSummariesCarouselPrimaryImages_' + bwWorkflowTaskItemId + '" style="text-align: center;">';
                    html += '        </div>';
                    html += '   </div>';

                    $('#bwExecutiveSummariesCarousel_divBwExecutiveSummariesCarousel2').append(html); // Create the html in the div tag.

                    // Now add the onclick event.
                    var bwWorkflowTaskItemId = this.options.taskData[i].bwWorkflowTaskItemId;
                    this.carouselItem_AddOnClick(carouselItem_Id, bwBudgetRequestId, this.options.taskData[i].Title, this.options.taskData[i].ProjectTitle, this.options.taskData[i].bwAssignedToRaciRoleAbbreviation, bwWorkflowTaskItemId);

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

                            $('#spanBwExecutiveSummariesCarouselPrimaryImages_' + bwWorkflowTaskItemId).append(html);

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
                                headers: { "Accept": "application/json; odata=verbose" },
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
                                                    if (fileName.toUpperCase().indexOf('.XLSX') > -1 || fileName.toUpperCase().indexOf('.XLS') > -1) {
                                                        html += '<img src="images/excelicon.png" style="width:100px;height:46px;cursor:pointer;" />';
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
                                            //document.getElementById('spanBwExecutiveSummariesCarouselPrimaryImages_' + bwBudgetRequestId).innerHTML = html;
                                            $('#spanBwExecutiveSummariesCarouselPrimaryImages_' + bwWorkflowTaskItemId).append(html); // 1-25-2022  bwBudgetRequestId).append(html);
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
                            console.log('Exception in bwExecutiveSummariesCarousel.js.renderAttachments(): ' + e.message + ', ' + e.stack);
                            displayAlertDialog('Exception in bwExecutiveSummariesCarousel.js.renderAttachments(): ' + e.message + ', ' + e.stack);
                        }
                    }

                    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Calling renderAttachments(). bwWorkflowTaskItemId: ' + bwWorkflowTaskItemId);
                    renderAttachments(bwWorkflowTaskItemId);

                } else {
                    break;
                }
            }

        } catch (e) {
            //debugger;
            console.log('Exception in bwExecutiveSummariesCarousel.getTheLatestRequestsAndRender(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwExecutiveSummariesCarousel.getTheLatestRequestsAndRender(): ' + e.message + ', ' + e.stack);
        }
    }//,
    //hide: function () {
    //    try {
    //        //console.log('In bwExecutiveSummariesCarousel.hide().');

    //        //$(this.element).style.display = 'none';
    //        try {
    //            $("#divActivitySpinner_WorkingOnItDialog").dialog('close');
    //        } catch (e) {
    //            // do nothing
    //        }

    //    } catch (e) {
    //        console.log('Exception in bwExecutiveSummariesCarousel.hide(): ' + e.message + ', ' + e.stack);
    //        alert('Exception in bwExecutiveSummariesCarousel.hide(): ' + e.message + ', ' + e.stack);
    //    }
    //}

});