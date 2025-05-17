$.widget("bw.bwCircleDialog", {
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
        This is the bwCircleDialog.js jQuery Widget. 
        ===========================================================

           [more to follow]
                           
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

           [put your stuff here]

        ===========================================================
        
       */

        elementIdSuffix: null,
        dialogElementId: null, // The bwCircleDialog widget manages this, so it always knows how to find it in the DOM. This is hardcoded here just to make it nice and simple. :)
        //dialogSmallCircleImagePath: null, // When initially displayed in drawCircle(), the code figures out the path, and stores it here for future use... for instance when a user drags the dialog around on the screen.
        dialogSmallCircleImage: null, // This is an Image object. When initially displayed in drawCircle(), the code figures out the image, and stores it here for future use... for instance when a user drags the dialog around on the screen.
        canvasElementId: null,
        mapWrapperElementId_small: null,
        mapWrapperElementId_large: null,

        value: 0,
        //dialogType: null,
        json: null,
        store: null, // This is where we store our OrgRoles data.
        Canvas: null,
        CanvasContext: null,
        OnResizeDisplayValues: null,
        Checklists: null,
        bwTenantId: null,
        bwWorkflowAppId: null,
        bwOrgId: null,
        bwOrgName: null,
        bwEnabledRequestTypes: null, // An array of the following: ['Budget Request', 'Quote Request', 'Reimbursement Request', 'Recurring Expense', 'Capital Plan Project', 'Work Order']
        operationUriPrefix: null,
        ajaxTimeout: 15000,
        quill: null,
        displayWorkflowPicker: false,
        displayRoleIdColumn: false,
        autoSenseDeviceType: false // Automatic UI based on device type. Alpha version so far.
    },
    _create: function (assignmentRowChanged_ElementId) {
        this.element.addClass("bwCircleDialog");
        var thiz = this; // Need this because of the asynchronous operations below.
        try {

            selfDiscoverOperationUri(thiz); // This sets this.options.operationUriPrefix correctly.

            var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
            this.options.elementIdSuffix = guid;

            this.options.dialogElementId = 'divCircleDialog_' + guid;
            this.options.canvasElementId = 'canvasCircleDialog_' + guid;
            this.options.mapWrapperElementId_small = 'divMapWrapper_small_' + guid;
            //this.options.mapWrapperElementId_large = 'divMapWrapper_large_' + guid;

            // The bwCircleDialog widget manages this, so it always knows how to find it in the DOM.
            var divCircleDialog = document.getElementById(this.options.dialogElementId);
            if (!divCircleDialog) {
                $(document.body).prepend('<div id="' + this.options.dialogElementId + '" style="display:none;"></div>');
            }

            var canvas = document.getElementById(this.options.canvasElementId);
            if (!canvas) {
                //$(document.body).prepend('<canvas id="' + this.options.canvasElementId + '" xcx="xcx1234346" style="position:absolute;z-index:-1;border:1px solid aliceblue;"></canvas>');
                $(document.body).prepend('<canvas id="' + this.options.canvasElementId + '" xcx="xcx1234346" style="position:absolute;z-index:-1;"></canvas>'); // Removed the border 6-11-2024. It seems to be Ok.




                //$(document.body).prepend('<canvas id="' + this.options.canvasElementId + '" style="position:absolute;z-index:20;border:1px solid aliceblue;"></canvas>');
            }




            // html += '<div id="divMapWrapper" style="width:0;height:0;"></div>'; // This is important because it is the element needed for the clickable image map for the small circle. Setting zero for height and width keeps the screen from jumping around. Yeah! 12-6-2021.
            var divMapWrapper = document.getElementById(this.options.mapWrapperElementId_small);
            if (!divMapWrapper) {
                //$(document.body).prepend('<div id="' + this.options.mapWrapperElementId + '" style="width:0;height:0;"></div>');
                $(document.body).prepend('<div id="' + this.options.mapWrapperElementId_small + '" style="width:100;height:100;"></div>');
            }

            // Not using the large circle one at the moment. 4-25-2022
            //var divMapWrapper = document.getElementById(this.options.mapWrapperElementId_large);
            //if (!divMapWrapper) {
            //    //$(document.body).prepend('<div id="' + this.options.mapWrapperElementId + '" style="width:0;height:0;"></div>');
            //    $(document.body).prepend('<div id="' + this.options.mapWrapperElementId_large + '" style="width:100;height:100;background-color:green;"></div>');
            //}




            this.renderCanvas();

            console.log('In bwCircleDialog._create(). The widget has been initialized.');

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">bwCircleDialog: CANNOT INSTANTIATE THIS WIDGET</span>';
            html += '<br />';
            html += '<span style="">Exception in bwCircleDialog.js._create(): ' + e.message + ', ' + e.stack + '</span>';
            displayAlertDialog(html);
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
            .removeClass("bwCircleDialog")
            .text("");
    },
    setWidgetOptionValue: function (key, value) {

        this.options[key] = value;
        this._update();

    },


    setZoom: function (originalZoom, elementId) {
        try {
            console.log('In bwRequest.js.setZoom(' + originalZoom + ', ' + elementId + ')');
            //alert('In bwRequest.js.setZoom(' + originalZoom + ', ' + elementId + ')');
            var thiz = this;

            if (window.opener) {
                // This is a popped-out request wndow... we need to handle zoom differently here.
                console.log('In bwRequest.js.setZoom(). This is a popped-out request wndow... we need to handle zoom differently here. originalZoom: ' + originalZoom + ', elementId: ' + elementId);
            }

            if (originalZoom > 20) { // Don't make any smaller than this!
                var zoom = originalZoom / 100;

                if (window.opener) {
                    // This is a popped-out request wndow... we need to handle zoom differently here.

                    console.log('In setZoom(). This is a popped-out request wndow... we need to handle zoom differently here. originalZoom: ' + originalZoom + ', elementId: ' + elementId);
                    var el = document.body; //.getElementById(elementId);

                    transformOrigin = [0, 0];

                    var p = ["webkit", "moz", "ms", "o"],
                        s = "scale(" + zoom + ")",
                        oString = (transformOrigin[0] * 100) + "% " + (transformOrigin[1] * 100) + "%";

                    for (var i = 0; i < p.length; i++) {
                        el.style[p[i] + "Transform"] = s;
                        el.style[p[i] + "TransformOrigin"] = oString;
                    }

                    el.style["transform"] = s;
                    el.style["transformOrigin"] = oString;



                    // weird fix, elementId coming in a variety of ways. 4-3-2023
                    var rectElement_Id = '';
                    if (elementId.indexOf('divRequestFormDialog_') > -1) {
                        rectElement_Id = elementId + '_Parent';
                    } else {
                        rectElement_Id = 'divRequestFormDialog_' + elementId + '_Parent';
                    }



                    // Now get the bounding rect, and resize the entire window...
                    //var rectElement = $('#budgetrequestform').find('.xdFormLayout')[0]; 
                    var rectElement = document.getElementById(rectElement_Id); // ('#' + rectElement_Id); // The request dialog.

                    console.log('xcx888 popped out window sizing happening here rectElement_Id: ' + rectElement_Id);
                    if (rectElement) {
                        var rect = rectElement.getBoundingClientRect();

                        var height_not_baselined = rect.bottom - rect.top;
                        var width_not_baselined = rect.right - rect.left + 40; // 20px for horizontal scroll bar.

                        var height = height_not_baselined * zoom;
                        var width = width_not_baselined * zoom;

                        console.log('xcx21312342 rectElement: ' + rectElement + '. weird fix for poppede out window, the window was getting too small and just disturbing ui/flash. 4-3-2023 xcx6665 width_not_baselined: ' + width_not_baselined + ', width: ' + width + ', zoom: ' + zoom);
                        //alert('height: ' + height);
                        if (height < 200) { // weird fix, the window was getting too small and just disturbing ui/flash. 4-3-2023 xcx6665
                            height = 1000;
                        }

                        window.resizeTo(width, height);

                        console.log('xcx21335 In setZoom(' + originalZoom + ', ' + elementId + '). window.resizeTo width: ' + width + ', height: ' + height);
                    }

                } else {
                    console.log('In setZoom(' + originalZoom + ', ' + elementId + ')');

                    //elementId = elementId.replace('_Parent', '');
                    //elementId += '_Parent'; // This just makes sure it is here! :)

                    var el = document.getElementById(elementId);
                    
                    transformOrigin = [0, 0];

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
                }

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
            displayAlertDialog('Exception in setZoom(): ' + e.message + ', ' + e.stack);
        }
    },
    pinRequestDialog: function () {
        try {
            console.log('In bwCircleDialog.js.pinRequestDialog().');
            // This makes the dialog non-modal, so that it can be dragged around and the underlying functionality accessible. This removes the overlay that makes the dialog modal, and also removes the click event which would have originally closed the request dialog.
            // The idea is to be able to have multiple requests open at once!
            $('.ui-widget-overlay').unbind('click');
            $(".ui-widget-overlay").remove();

            console.log('In bwCircleDialog.js.pinRequestDialog(). Scrolling window to top. This is experimental. Added a setTimeout to prevent race condition... 11-17-2022');
            //setTimeout(function () {
            $(window).scrollTop(0);
            //}, 1);


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
            console.log('Exception in bwCircleDialog.js.pinRequestDialog(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwCircleDialog.js.pinRequestDialog(): ' + e.message + ', ' + e.stack);
        }
    },
    displayDialog: function (identityJson, dialogElement) { // 11-28-2022 added dialogElement parameter.
        try {
            console.log('In bwCircleDialog.js.displayDialog().');
            //alert('In bwCircleDialog.js.displayDialog(). ');
            var thiz = this;

            var canvas = document.getElementById(this.options.canvasElementId);
            canvas.width = document.documentElement.clientWidth;
            canvas.height = document.documentElement.clientHeight;
            var ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas.
            //this.options.Canvas = canvas; // Save this for reuse. A speed thing! 
            this.options.CanvasContext = ctx; // Save this for reuse. A speed thing! 

            this.options.dialogSmallCircleImage = null; //Clear the image.

            var imagePath;
            var displayClickableSmallCircle = true;
            if (identityJson && identityJson.bwParticipantId) {
                imagePath = 'images/businesswoman2.png';
            } else if (identityJson && identityJson.bwOrgId) {
                imagePath = 'images/corporeal.png';
            } else {
                //imagePath = 'images/businesswoman2.png'; //'apple-touch-iphone4.png';
                displayClickableSmallCircle = false;
            }

            this.drawCircle(null, imagePath, 512, 512, displayClickableSmallCircle, identityJson, null, null, dialogElement);

            //
            // NEW: 7-24-2024.
            //

            if (dialogElement && dialogElement.id) {

                // This is the top header bar of the dialog with slider etc. 7-24-2024.
                var requestDialogId = dialogElement.id; // this.options.dialogElementId;
                var budgetRequestId = identityJson.bwParticipantId;
                var bwWorkflowTaskItemId = '';

                // This creates the custom header/draggable bar on the dialog!!! 4-2-2020. // ☈ ☇ https://www.toptal.com/designers/htmlarrows/symbols/thunderstorm/
                var html = '';
                html += '<table xcx="xcx3249-2-1" style="width:100%;" onclick="$(\'.bwRequest\').bwRequest(\'pinRequestDialog\');" ondblclick="$(\'.bwRequest\').bwRequest(\'zoomAndCenter\', \'' + requestDialogId + '\');" >'; // This click event is like "pin". Once the user clicks the header of the request dialog, it no longer is modal and persists on the screen until they choose to close it.
                html += '   <tr>';
                html += '       <td style="width:95%;">';
                html += '           <div id="slider_' + budgetRequestId + '" style="width:20%;cursor:pointer;"></div>';
                html += '       </td>';

                html += '       <td style="vertical-align:top;width:5%;padding:0;border:0;margin:0;">';

                if (window.opener) {

                    html += '                   <span id="' + requestDialogId + '_spanRequestPrintButton" style="text-align:right;cursor:pointer;font-size:30pt;" onclick="$(\'.bwRequest\').bwRequest(\'LaunchIntoHomeWindow\', \'' + budgetRequestId + '\');">';
                    html += '                       ☈';
                    html += '                   </span>';

                } else {

                    html += '           <span id="' + requestDialogId + '_spanRequestPrintButton" style="text-align:right;cursor:pointer;font-size:30pt;" onclick="$(\'.bwRequest\').bwRequest(\'LaunchIntoSeparateWindow\', \'' + requestDialogId + '\', \'' + budgetRequestId + '\', \'' + bwWorkflowTaskItemId + '\');">';
                    html += '               ↸';
                    html += '           </span>';

                }

                //html += '           <A HREF="#" onClick="window.open(\'https://budgetworkflow.com\', \'Sample\',\'toolbar=no,width=190,height=190,left=500,top=200,status=no,scrollbars=no,resize=no\');return false">[...]</A>.';
                html += '       </td>';
                html += '       <td style="vertical-align:middle;width:5%;padding:0;border:0;margin:0;">';
                html += '           <span title="print" class="printButton" dev="xcx32424-1-1" style="font-size:18pt;cursor:pointer !important;" onclick="$(\'.bwPrintButton\').bwPrintButton(\'PrintIndividualRequestReport\', \'' + requestDialogId + '\');">';
                html += '               <img src="/images/iosprinter_blue.png" style="width:50px;height:50px;cursor:pointer !important;" />';
                html += '           </span>';
                html += '       </td>';
                html += '       <td>&nbsp;&nbsp;</td>';
                html += '       <td>';
                html += '           <span class="dialogXButton" style="font-size:25pt;cursor:pointer;width:100%;font-weight:bold;" onclick="$(\'.bwCircleDialog\').bwCircleDialog(\'hideCircleDialog\');">X</span>';
                html += '       </td>';
                html += '   </tr>';
                html += '</table>';
                document.getElementById(requestDialogId).parentNode.querySelector(".ui-dialog-titlebar").innerHTML = html;

                $("#slider_" + budgetRequestId).slider({
                    min: 50,
                    max: 200,
                    value: 100, // It starts off full size.
                    slide: function (event, ui) {

                        thiz.setZoom(ui.value, requestDialogId);
                        thiz.drawCircle(null, imagePath, 512, 512, displayClickableSmallCircle, identityJson, null, null, dialogElement);

                    }//,
                    //change: function (event, ui) {
                    //    thiz.setZoom(ui.value, requestDialogId);
                    //}
                });
                thiz.setZoom(100, requestDialogId);

            }         

            //try {
            //    alert('CLOSING THE EXISTING DIALOG. 9-25-2023.');
            //    // CLOSING THE EXISTING DIALOG. 9-25-2023.
            //    $('#divAlertDialog').dialog('close'); // 
            //} catch (e) {
            //    alert('FAILED: CLOSING THE EXISTING DIALOG. 9-25-2023. ' + e.message + ', ' + e.stack);

            //}

        } catch (e) {
            console.log('Exception in bwCircleDialog.js.displayDialog(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwCircleDialog.js.displayDialog(): ' + e.message + ', ' + e.stack);
        }
    },





    renderCanvas: function (assignmentRowChanged_ElementId) {
        try {
            console.log('In bwCircleDialog.js.renderCanvas(). <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< 12-5-2021');
            console.log('In bwCircleDialog.js.renderCanvas(). Doing this: window.addEventListener("resize"). Should this be here? This event is in "In bwKeypressAndMouseEventHandler.js.window.resize()." <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< 12-5-2021');
            var thiz = this;





            var html = '';
            //html += '<span id="spanCanvas2" style="padding:0;margin:0;"><canvas id="myCanvas" style="position:absolute;z-index:-1;border:1px solid aliceblue;"></canvas></span>';
            html += '<span id="spanCanvas2" style="padding:0;margin:0;"><canvas id="myCanvas" style="position:absolute;z-index:-1;border:1px solid aliceblue;"></canvas></span>';

            //debugger; // xcx1 working on z-index 7-4-2020
            //html += '<div id="divCircleDialog1" style="display:none;height:600px;width:600px;border:1px solid #066b8b;background-color:white;position:absolute;z-index:10;"></div>'; // overflow:hidden; // Scrollable div wrapper for the role picker. // dark blue border. // position and z-index makes it show up on top and to not move the other elements around.
            //html += '<div id="divCircleDialog1" style="display:none;"></div>';
            //html += '<map name="mapBwClickableImageMap" id="mapBwClickableImageMap" style="z-index:15;"></map>'; // This is our clickable image map which we will set the parameters in code elsewhere.

            //html += '<div id="divMapWrapper" style="width:0;height:0;"></div>'; // This is important because it is the element needed for the clickable image map for the small circle. Setting zero for height and width keeps the screen from jumping around. Yeah! 12-6-2021.
            //html += '<div id="divMapWrapper" style="border:1px solid red;width:100;height:100;"></div>';



            // The "Upload a new small circle image" dialog...
            html += '<div style="display:none;" id="divUploadANewSmallCircleImageDialog">'; //  overflow-x: hidden; 
            //html += '            <table style="width:100%;">';
            html += '            <table style="">';
            html += '                <tr>';
            html += '                    <td style="">';
            html += '                        <span id="divUploadANewSmallCircleImageDialogContent">[divUploadANewSmallCircleImageDialogContent]</span>';
            html += '                    </td>';
            //html += '                    <td style="width:9%;"></td>';
            //html += '                    <td style="width:1%;cursor:pointer;vertical-align:top;">';
            //html += '                        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 120pt;font-weight:bold;" onclick="$(\'#divUploadANewSmallCircleImageDialog\').dialog(\'close\');">X</span>';
            //html += '                    </td>';
            html += '                </tr>';
            html += '            </table>';
            html += '            <br /><br />';
            html += '';
            html += '';
            html += '';
            html += '            <!--<span id="spanErrorMessage" style="font-size:40pt;"></span><br /><br />-->';
            html += '            <!--<div id="divCreateRequestFormDialogCloseButton" class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" onclick="$(\'#divUploadANewSmallCircleImageDialog\').dialog(\'close\');">';
            html += '                Close';
            html += '            </div>';
            html += '            <br /><br />-->';
            html += '        </div>';


            // Render the html.
            this.element.html(html);

            var canvas = document.getElementById('myCanvas');
            //debugger;

            //var xxx = canvas.clientWidth; // THIS DOESN'T WORK
            //var yyy = canvas.clientHeight;

            //canvas.width = window.innerWidth; // tableElement.offsetWidth; // This resizes the bitmap from 300x150 to what we want. This prevents scaling of our drawing...
            //canvas.height = window.innerHeight; //tableElement.offsetHeight; // This resizes the bitmap from 300x150 to what we want. This prevents scaling of our drawing...
            //canvas.width = screen.width; // tableElement.offsetWidth; // This resizes the bitmap from 300x150 to what we want. This prevents scaling of our drawing...
            //canvas.height = screen.height; //tableElement.offsetHeight; // This resizes the bitmap from 300x150 to what we want. This prevents scaling of our drawing...

            //var body = document.getElementsByTagName('body')[0];
            //var clientWidth = body.scrollWidth;
            //var clientHeight = Math.max(
            //            body.scrollHeight, document.documentElement.scrollHeight,
            //            body.offsetHeight, document.documentElement.offsetHeight,
            //            body.clientHeight, document.documentElement.clientHeight, body.scrollHeight, body.getBoundingClientRect().height
            //        );
            //console.log('clientHeight: ' + clientHeight);


            //
            // This doesn't work 100% here because the whole screen has not been rendered yet, so we get an incorrect height value which is much less than the entire length of the page.
            // Therefore we need to remember to resize the canvas when drawing stuff, and use the sizing code from the resize event just below this code, and save it back to this.options.Canvas and this.options.CanvasContext.
            canvas.width = document.documentElement.clientWidth;
            canvas.height = document.documentElement.clientHeight;

            var ctx = canvas.getContext('2d');
            //ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas.

            this.options.Canvas = canvas; // Save this for reuse. A speed thing! 
            this.options.CanvasContext = ctx; // Save this for reuse. A speed thing!



            //var metaTag = document.createElement('meta');
            //metaTag.name = "viewport"
            //metaTag.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
            //document.getElementsByTagName('head')[0].appendChild(metaTag);


            //
            // Listen for resize changes. This should also work for the ios orientationchange event!

            //
            //
            // THIS NEEDS TO hook to bwKeypressAndMouseEventHandler.js.window.resize(). 2-22-2024. See: Code Change: CODE-240050
            //
            //
            window.addEventListener("resize", function () {
                try {
                    console.log('In bwCircleDialog.js.renderCanvas.window.resize().');
                    //alert('In bwCircleDialog.js.renderCanvas.window.resize().');

                    var body = document.getElementsByTagName('body')[0];
                    ////var rect = body.getBoundingClientRect().height
                    var clientWidth = body.scrollWidth; //offsetWidth; //getBoundingClientRect().width +; //body.clientWidth; offsetHeight
                    //var clientHeight = Math.max(body.scrollHeight, document.documentElement.clientHeight, window.innerHeight || 0); //offsetHeight; //getBoundingClientRect().height; //body.clientHeight;
                    var clientHeight = Math.max(
                        body.scrollHeight, document.documentElement.scrollHeight,
                        body.offsetHeight, document.documentElement.offsetHeight,
                        body.clientHeight, document.documentElement.clientHeight
                    );

                    //var viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
                    //var screenWidth = window.screen.width;
                    //var viewportScale = screenWidth / viewportWidth;


                    // LEAVE this in case we need to do more canvas sizing work. Todd: 1-12-2020
                    //document.getElementById('dpr1').innerHTML = viewportWidth;
                    //document.getElementById('width1').innerHTML = clientWidth;
                    //document.getElementById('height1').innerHTML = clientHeight;

                    //} catch (e) {
                    //    //alert('Exception in xxxxx: ' + e.message + ', ' + e.stack);
                    //}






                    //debugger;
                    if (Math.abs(canvas.height - clientHeight) > 10 || Math.abs(canvas.width - clientWidth) > 10) { // THIS threshold is intended to minimize the amount fo times that tis event is launched. Also, on the android the keyboad raises a resize, so we need to make sure that works Ok!! <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                        canvas.width = clientWidth;
                        canvas.height = clientHeight;

                        // THIS ACTUALLY WORKS! NOW WE HAVE TO find out if the circle dialog is being diaplayed. If so, we need to redraw it!!
                        //var divCircleDialog1 = document.getElementById('divCircleDialog1');
                        if (thiz.options.OnResizeDisplayValues != null) {
                            //var displayValues = thiz.options.OnResizeDisplayValues;
                            // EXAMPLE:
                            //var displayValues = {
                            //    DrawCircleDialog: true,
                            //    DisplayMethod: 'displayCreateFreeAccountDialog',
                            //    Image: {
                            //        Path: 'images/userimage.png',
                            //        Width: 512,
                            //        Height: 512
                            //    },
                            //    Html: html
                            //};

                            //debugger;

                            if (thiz.options.OnResizeDisplayValues.DrawCircleDialog == true) {
                                //debugger;
                                if ($('.bwCircleDialog').bwCircleDialog(thiz.options.OnResizeDisplayValues.DisplayMethod != 'displaySignInDialog')) { // THIS SHOULD SOLVE THE ISSUE WHERE "images/userimage.png Email" text shows up in the "Sign In" circle dialog. 5-22-2020.
                                    $('.bwCircleDialog').bwCircleDialog(thiz.options.OnResizeDisplayValues.DisplayMethod, false, thiz.options.OnResizeDisplayValues.Image.Path, thiz.options.OnResizeDisplayValues.Image.Width, thiz.options.OnResizeDisplayValues.Image.Height);
                                }
                            }

                            if (thiz.options.OnResizeDisplayValues.DrawOrganizationLines == true) {
                                //debugger;
                                // Need to get the tree node. Just putting in root for now!!!!!!!!!!!!!!!!!!!!!<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                                $('.bwOrganizationEditor').bwOrganizationEditor('renderOrgRoleConnectorsToWorkflow', true, 'root');
                            }

                        }
                    }

                } catch (e) {
                    console.log('Exception in bwCircleDialog.js.renderCanvas.window.resize(): ' + e.message + ', ' + e.stack);
                    displayAlertDialog('Exception in bwCircleDialog.js.renderCanvas.window.resize(): ' + e.message + ', ' + e.stack);
                }

            }, false);

        } catch (e) {
            console.log('Exception in bwCircleDialog.js.renderCanvas(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwCircleDialog.js.renderCanvas(): ' + e.message + ', ' + e.stack);
        }
    },
    drawCircle: function (divCircleDialog1_unused, imagePath, imageWidth, imageHeight, clickableSmallCircle, identityJson, zIndex, forceSmallImageRedraw, dialogElement) { // identityType: ['participant', 'org'], jsonData: Json to describe the participant or org.
        try {
            console.log('In bwCircleDialog.js.drawCircle().');
            //alert('In bwCircleDialog.js.drawCircle().');
            var thiz = this;

            // 11-28-2022
            if (!(dialogElement || this.options.dialogElementId)) {
                displayAlertDialog('xcx4234 error in drawCircle(). Need a value for dialogElement: ' + dialogElement + '. We need to bedoing our z-index thing here for circle dialogs!!!!');
            } else {
                //alert('In drawCircle(). Got a value for dialogElement: ' + dialogElement + '. Woop!');
                if (!dialogElement) {
                    dialogElement = document.getElementById(this.options.dialogElementId);
                }
                if (!dialogElement) {
                    displayAlertDialog('xcx4234-2 error in drawCircle(). Need a value for dialogElement.');
                }
            }






            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            //var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            //var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
            //var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

            var canvas = document.getElementById(this.options.canvasElementId);
            var ctx = this.options.CanvasContext;
            var dialogTop, dialogLeft, dialogRight, centerX, centerY;
            var ih = window.innerHeight;
            var iw = window.innerWidth;
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas. Need this for dragging to make it look ok.

            // Added 11-28-2022
            var canvas_zIndex = 12; // 12 is the default.
            if (dialogElement) {
                //    // Get the dialog zindex here, then apply that to the circle dialog, so that it can move to the top of the diasplay! woop! 
                $(dialogElement).closest('.ui-front').css('zIndex', canvas_zIndex); // We have to give zIndex a value, so that we can get it again with "moveToTop".
                $(dialogElement).dialog('moveToTop');
                var zIndex = $(dialogElement).closest('.ui-front').css('zIndex'); // This is on top. We move it up even 1 more so we have a zIndex level available for the canvas.
                if (!zIndex) {
                    console.log('***********************************************************');
                    console.log('***********************************************************');
                    console.log('xcx2313 zIndex could not be determined for this dialog.');
                    console.log('***********************************************************');
                    console.log('***********************************************************');
                    zIndex = 12;
                }
                $(dialogElement).closest('.ui-front').css('zIndex', (zIndex + 1));

                canvas_zIndex = Number(zIndex); // We use this below.

                //alert('xcx23123 canvas_zIndex: ' + canvas_zIndex);

                //var canvasElementId = $('.bwCircleDialog').bwCircleDialog('option', 'canvasElementId');
                //var canvasZindex = $('#' + canvasElementId).css('zIndex');
                //$('#' + canvasElementId).css('zIndex', zindex2);
                //var canvasZindex2 = $('#' + canvasElementId).css('zIndex');
            }
            // end: // Added 11-28-2022



            var xx3 = document.getElementById(this.options.dialogElementId).parentNode;
            xx3.style.background = 'transparent';
            xx3.style.border = '0px';
            //xx3.style.zIndex = 12;
            xx3.style.zIndex = canvas_zIndex;


            //
            // NEW 4-25-2022
            //
            var xx2 = document.getElementById(this.options.dialogElementId);
            var yy2 = xx2.getBoundingClientRect();
            var dialogWidthHeight = Number((yy2.bottom - yy2.top).toFixed(0));
            //
            // end: NEW 4-25-2022
            //

            $('#' + this.options.dialogElementId).dialog({
                dragStart: function () {
                    console.log('In bwCircleDialog.js.drawCircle.dialog.dragStart().');
                },
                drag: function () {
                    console.log('In bwCircleDialog.js.drawCircle.dialog.drag().');
                    thiz.drawCircle(divCircleDialog1_unused, imagePath, imageWidth, imageHeight, clickableSmallCircle, identityJson, zIndex, false, dialogElement); //  false 8-15-2022
                },
                dragStop: function () {
                    console.log('In bwCircleDialog.js.drawCircle.dialog.dragStop().');
                }
            });


            // This lets the internal div tag of the dialog be draggable.
            //$('#' + this.options.dialogElementId).css('cursor', 'move'); // Display the 'move' cursor.
            //$('#' + this.options.dialogElementId).draggable({
            //    dragStart: function () {
            //        console.log('xcx NEW drag start');
            //    },
            //    drag: function () {
            //        console.log('xcx NEW drag drag');


            //        //var offset = $(this).offset();
            //        //var xPos = (offset.left) - $(this).offsetParent().offset().left;
            //        //var yPos = (offset.top) - $(this).offsetParent().offset().top;
            //        //console.log(xPos);
            //        //console.log(yPos); // These add up?!

            //        thiz.drawCircle(); // Redraw the circle dialog when the user moves this dialog.
            //    },
            //    dragStop: function () {
            //        console.log('xcx NEW drag stop');
            //    }
            //});

            var zoom = 1; // default
            var largeCircleDiameter = dialogWidthHeight * Math.sqrt(2);



            ///// commented out 10-8-2022
            //// Figure out which zoom level we want to use. 1, 0.75, 0.5. These seems to be the ideal sizes for the devices I have tested upon.
            //if (largeCircleDiameter > ih || largeCircleDiameter > iw) {
            //    zoom = 0.75; // Need to scale down a notch..
            //    var dialogWidthHeightTemp = dialogWidthHeight * zoom;
            //    var largeCircleDiameterTemp = dialogWidthHeightTemp * Math.sqrt(2);
            //    if (largeCircleDiameterTemp > ih || largeCircleDiameterTemp > iw) {
            //        zoom = 0.5; // Need to scale down another notch..
            //    }
            //}







            //
            // Set the scaling values.
            console.log('Scaling the circle dialog to: ' + zoom);
            dialogWidthHeight = dialogWidthHeight * zoom;

            //largeCircleDiameter = dialogWidthHeight * Math.sqrt(2);
            console.log('');
            console.log(' 12-23-2021 THIS SCALES OUT THE CIRCLE DIALOG A BIT TO ENCOMPASS THE JQUERY DIALOG. 70px.');
            console.log('');
            largeCircleDiameter = dialogWidthHeight * Math.sqrt(2) + 70; // 12-23-2021 THIS SCALES OUT THE CIRCLE DIALOG A BIT TO ENCOMPASS THE JQUERY DIALOG.

            //divCircleDialog1.style.zoom = zoom; // Might need this as well: -moz-transform: scale(0.75);
            //divCircleDialog1.style['-moz-transform'] = 'scale(' + zoom + ')'; // CHROME ON WINDOWS DOES NOT NEED THIS!!!!!!!!!!!!!!!!!!!!!!!!!!
            dialogTop = (((ih / 2) - (dialogWidthHeight / 2)) / 2) + window.pageYOffset;


            // This little section makes sure the top of the circle isn't cut off at the top of the page/window.
            //var dialogCenterY = (dialogWidthHeight / 2) + dialogTop; 
            var dialogCenterY = (dialogTop * zoom) + (dialogWidthHeight / 2) + window.pageYOffset;

            var circleTopScreenOverflow = (largeCircleDiameter / 2) - dialogCenterY;


            var fixedYDistanceToAdd = 25;
            if (window.pageYOffset > 0) {
                fixedYDistanceToAdd += window.pageYOffset;
            } else {

            }

            dialogTop = (((ih / 2) - (dialogWidthHeight / 2)) / 2) + window.pageYOffset + fixedYDistanceToAdd;
            //debugger;
            if (circleTopScreenOverflow > 0) {
                //debugger;
                dialogTop = (((ih / 2) - (dialogWidthHeight / 2)) / 2) + window.pageYOffset + (circleTopScreenOverflow + fixedYDistanceToAdd);
            }
            // end


            //alert('This is where the dialog gets displayed, just like invoking .dialog({}).');
            //debugger;
            dialogLeft = (((iw / 2) - (dialogWidthHeight / 2)) / 2) + window.pageXOffset;
            dialogRight = dialogLeft + dialogWidthHeight;
            //divCircleDialog1.style.top = dialogTop + 'px';
            //divCircleDialog1.style.left = dialogLeft + 'px';
            //divCircleDialog1.style.display = 'block'; // This is where the dialog gets displayed, just like invoking .dialog({}).
            //divCircleDialog1.style.background = 'transparent';
            //divCircleDialog1.style.border = '0px';
            //divCircleDialog1.style.zIndex = 12;
            centerX = (dialogLeft * zoom) + (dialogWidthHeight / 2) + window.pageXOffset;
            centerY = (dialogTop * zoom) + (dialogWidthHeight / 2) + window.pageYOffset;

            //
            // NEW 4-25-2022
            //
            var xx = document.getElementById(this.options.dialogElementId);
            var yy = xx.getBoundingClientRect();
            centerX = Number((((yy.right - yy.left) / 2) + yy.left).toFixed(0));
            centerY = Number((((yy.bottom - yy.top) / 2) + yy.top).toFixed(0));
            //
            // end: NEW 4-25-2022
            //

            //
            // Now draw everything. This is the large circle.
            ctx.beginPath();
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#95b1d3';
            ctx.arc(centerX, centerY, largeCircleDiameter / 2, 0, 2 * Math.PI);
            ctx.stroke();
            //ctx.fillStyle = 'white, 0.5';
            ctx.fillStyle = "rgba(255, 255, 255, 0.9)"; // Transparency lets the stuff behind the big circle show through just a little bit... 0.9?..
            ctx.fill();
            // This is the small circle which displays the Org image.
            ctx.beginPath();
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#95b1d3';


            if (clickableSmallCircle == true) {
                //
                // This is the small circle and image.
                var paddedYValueToPreventClipping = 0;
                var smallCircleRadius = Number((((dialogWidthHeight / 4) * Math.sqrt(2)) / 2).toFixed(0));
                var smallCircleCenterX = Number((centerX + (dialogWidthHeight / 2) + smallCircleRadius).toFixed(0));
                var smallCircleCenterY = Number((centerY - (dialogWidthHeight / 2)).toFixed(0));
                ctx.arc(smallCircleCenterX, smallCircleCenterY, smallCircleRadius, 0, 2 * Math.PI);
                ctx.stroke();
                ctx.fillStyle = 'aliceblue';
                ctx.fill();
                // This is where the image is loaded and displayed.
                var dx = smallCircleCenterX - smallCircleRadius;
                var dy = smallCircleCenterY - smallCircleRadius;

                if (!identityJson) {
                    // Use the image path specified when calling this function.
                    var img = new Image();


                    img.src = imagePath;
                    img.onload = function (e) {
                        try {
                            ctx.drawImage(img, 0, 0, imageWidth, imageHeight, dx, dy + paddedYValueToPreventClipping, smallCircleRadius * 2, smallCircleRadius * 2);

                        } catch (e) {
                            console.log('Exception in bwCircleDialog.drawCircle.img.onload():2: ' + e.message + ', ' + e.stack);
                            thiz.displayAlertDialog('Exception in bwCircleDialog.drawCircle.img.onload():2: ' + e.message + ', ' + e.stack);
                        }
                    }


                } else {

                    if (identityJson && identityJson.bwParticipantId) {

                        console.log('In bwCircleDialog.js.drawCircle(). xcx124312 Display Participant image. identityJson: ' + JSON.stringify(identityJson));

                        //
                        // Display Participant image.
                        //
                        if (thiz.options.dialogSmallCircleImage && (forceSmallImageRedraw == false)) {

                            console.log('xcxA2314 no redraw, forceSmallImageRedraw = false');

                            // If we get here, it means that we have figured out which image to use for the small circle.
                            ctx.drawImage(thiz.options.dialogSmallCircleImage, 0, 0, imageWidth, imageHeight, dx, dy + paddedYValueToPreventClipping, smallCircleRadius * 2, smallCircleRadius * 2);

                        } else {

                            console.log('xcxA2314 redraw. forceSmallImageRedraw != false');


                            // When the dialog is initially displayed, we need to figure out the correct image path to use. Then we store it for reuse... for instance when a user drags the dialog around on the screen.
                            var img = new Image();
                            var preventCachingGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                                return v.toString(16);
                            });

                            //var imagePath2 = thiz.options.operationUriPrefix + '_files/' + workflowAppId + '/participantimages/' + identityJson.bwParticipantId + '/' + 'userimage.png?v=' + imageVersionGuid;
                            var imagePath2;

                            var activeStateIdentifier = JSON.parse($('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier'));

                            if (activeStateIdentifier.status != 'SUCCESS') {

                                imagePath2 = '[No image. Unauthorized. xcx213124-34556-34]';

                            } else {

                                //html += '<img id="attachmentstest1" xcx="xcx2312-2-2" src="' + thiz.options.operationUriPrefix + fileUrl_Thumbnail + '?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier + '" style="height:120px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;max-width:250px;border:1px solid gray;border-radius:0 30px 0 0;" alt="" ';

                                imagePath2 = thiz.options.operationUriPrefix + '_files/' + workflowAppId + '/participantimages/' + identityJson.bwParticipantId + '/' + 'userimage.png?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier;

                            }











                            $.get(imagePath2).done(function () {
                                try {
                                    img.src = imagePath2;
                                    img.onload = function (e) {
                                        try {
                                            thiz.options.dialogSmallCircleImage = img;
                                            ctx.drawImage(img, 0, 0, imageWidth, imageHeight, dx, dy + paddedYValueToPreventClipping, smallCircleRadius * 2, smallCircleRadius * 2);
                                        } catch (e) {
                                            console.log('Exception in bwCircleDialog.js.drawCircle.img.onload:xcx334-1-1: ' + e.message + ', ' + e.stack);
                                            displayAlertDialog('Exception in bwCircleDialog.js.drawCircle.img.onload:xcx334-1-1: ' + e.message + ', ' + e.stack);
                                        }
                                    }
                                } catch (e) {
                                    console.log('Exception in bwCircleDialog.js.drawCircle.img.onload:xcx334-1-2: ' + e.message + ', ' + e.stack);
                                    displayAlertDialog('Exception in bwCircleDialog.js.drawCircle.img.onload:xcx334-1-2: ' + e.message + ', ' + e.stack);
                                }
                            }).fail(function () {
                                //
                                // This org has no image, so just use the stock one.
                                //
                                try {
                                    img.src = 'images/businesswoman2.png'
                                    img.onload = function (e) {
                                        try {
                                            thiz.options.dialogSmallCircleImage = img;
                                            ctx.drawImage(img, 0, 0, imageWidth, imageHeight, dx, dy + paddedYValueToPreventClipping, smallCircleRadius * 2, smallCircleRadius * 2);
                                        } catch (e) {
                                            console.log('Exception in bwCircleDialog.js.drawCircle.img.onload:xcx334-1: ' + e.message + ', ' + e.stack);
                                            displayAlertDialog('Exception in bwCircleDialog.js.drawCircle.img.onload:xcx334-1: ' + e.message + ', ' + e.stack);
                                        }
                                    }
                                } catch (e) {
                                    console.log('Exception in bwCircleDialog.js.drawCircle.img.onload:xcx334-2: ' + e.message + ', ' + e.stack);
                                    displayAlertDialog('Exception in bwCircleDialog.js.drawCircle.img.onload:xcx334-2: ' + e.message + ', ' + e.stack);
                                }
                            });

                        }

                    } else if (identityJson && identityJson.bwOrgId) {

                        //
                        // Display Org image.
                        //
                        if (thiz.options.dialogSmallCircleImage && (forceSmallImageRedraw == false)) {

                            console.log('xcxA2314-2 no redraw, forceSmallImageRedraw = false');

                            // If we get here, it means that we have figured out which image to use for the small circle.
                            ctx.drawImage(thiz.options.dialogSmallCircleImage, 0, 0, imageWidth, imageHeight, dx, dy + paddedYValueToPreventClipping, smallCircleRadius * 2, smallCircleRadius * 2);

                        } else {

                            console.log('xcxA2314-2 redraw. forceSmallImageRedraw != false');

                            // When the dialog is initially displayed, we need to figure out the correct image path to use. Then we store it for reuse... for instance when a user drags the dialog around on the screen.
                            var img = new Image();
                            var preventCachingGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                                return v.toString(16);
                            });

                            //var imagePath2 = thiz.options.operationUriPrefix + '_files/' + workflowAppId + '/orgimages/' + identityJson.bwOrgId + '/' + 'orgimage.png?v=' + imageVersionGuid;

                            var imagePath2;

                            var activeStateIdentifier = JSON.parse($('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier'));

                            if (activeStateIdentifier.status != 'SUCCESS') {

                                imagePath2 = '[No image. Unauthorized. xcx213124-34556-34]';

                            } else {

                                //html += '<img id="attachmentstest1" xcx="xcx2312-2-2" src="' + thiz.options.operationUriPrefix + fileUrl_Thumbnail + '?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier + '" style="height:120px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;max-width:250px;border:1px solid gray;border-radius:0 30px 0 0;" alt="" ';

                                imagePath2 = thiz.options.operationUriPrefix + '_files/' + workflowAppId + '/orgimages/' + identityJson.bwOrgId + '/' + 'orgimage.png?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier;

                            }











                            $.get(imagePath2).done(function () {
                                try {
                                    img.src = imagePath2;
                                    img.onload = function (e) {
                                        try {
                                            thiz.options.dialogSmallCircleImage = img;
                                            ctx.drawImage(img, 0, 0, imageWidth, imageHeight, dx, dy + paddedYValueToPreventClipping, smallCircleRadius * 2, smallCircleRadius * 2);
                                        } catch (e) {
                                            console.log('Exception in bwCircleDialog.js.drawCircle.img.onload:xcx334-1-1: ' + e.message + ', ' + e.stack);
                                            displayAlertDialog('Exception in bwCircleDialog.js.drawCircle.img.onload:xcx334-1-1: ' + e.message + ', ' + e.stack);
                                        }
                                    }
                                } catch (e) {
                                    console.log('Exception in bwCircleDialog.js.drawCircle.img.onload:xcx334-1-2: ' + e.message + ', ' + e.stack);
                                    displayAlertDialog('Exception in bwCircleDialog.js.drawCircle.img.onload:xcx334-1-2: ' + e.message + ', ' + e.stack);
                                }
                            }).fail(function () {
                                //
                                // This org has no image, so just use the stock one.
                                //
                                try {
                                    img.src = 'images/corporeal.png';
                                    img.onload = function (e) {
                                        try {
                                            thiz.options.dialogSmallCircleImage = img;
                                            ctx.drawImage(img, 0, 0, imageWidth, imageHeight, dx, dy + paddedYValueToPreventClipping, smallCircleRadius * 2, smallCircleRadius * 2);
                                        } catch (e) {
                                            console.log('Exception in bwCircleDialog.js.drawCircle.img.onload:xcx334-1: ' + e.message + ', ' + e.stack);
                                            displayAlertDialog('Exception in bwCircleDialog.js.drawCircle.img.onload:xcx334-1: ' + e.message + ', ' + e.stack);
                                        }
                                    }
                                } catch (e) {
                                    console.log('Exception in bwCircleDialog.js.drawCircle.img.onload:xcx334-2: ' + e.message + ', ' + e.stack);
                                    displayAlertDialog('Exception in bwCircleDialog.js.drawCircle.img.onload:xcx334-2: ' + e.message + ', ' + e.stack);
                                }
                            });

                        }

                    } else {

                        console.log('Error in bwCircleDialog.js.drawCircle(). Unexpected value for identityJson: ' + identityJson);
                        displayAlertDialog('Error in bwCircleDialog.js.drawCircle(). Unexpected value for identityJson: ' + identityJson);

                    }
                }
            }

            canvas.style.background = 'rgba(240, 248, 255, 0.5)';



            //alert('xcx2112443 getting rady to set canvas zindex. zIndex: ' + zIndex + ', zIndex2: ' + zIndex2);

            if (canvas_zIndex) {

                console.log('xcx2112443 getting ready to set canvas zindex. canvas_zIndex: ' + canvas_zIndex);


                // 7-5-2022 This is done for the external attachments email recipients "" dialog to make sure the circledialog is displayed correctly in front of everything.
                //var zIndex3 = zIndex2 + 1;
                canvas.style.zIndex = canvas_zIndex;

                //var imageMap = document.getElementById('circleDialogSmallCircleClickableImage');
                //if (imageMap) {
                //    alert('Setting z-index for circleDialogSmallCircleClickableImage to ' + (canvas_zIndex + 1));
                //    imageMap.style.zIndex = canvas_zIndex + 1;
                //} else {
                //    alert('Could not find element circleDialogSmallCircleClickableImage in the dom.');
                //}
                //alert('>>>>>>> CUSTOM zIndex in drawCircle(). canvas_zIndex: ' + canvas_zIndex);
            } //else {
            // canvas.style.zIndex = 11; // Bring it to the front!
            //}






            //if (zIndex) {
            //    // 7-5-2022 This is done for the external attachments email recipients "" dialog to make sure the circledialog is displayed correctly in front of everything.
            //    canvas.style.zIndex = zIndex;
            //    console.log('>>>>>>> CUSTOM zIndex in drawCircle(): ' + zIndex);
            //} else {
            //    canvas.style.zIndex = 11; // Bring it to the front!
            //}










            //clickableSmallCircle = true; // 1-18-2022



            if (clickableSmallCircle == true) {
                // Clickable image map for the small circle! This is so simple. We size and position a transparent image over top of the small circle, then put a circle image map on that image. It works!
                // Check out this guy. He has done some very fancy things and also has a MArching Suqares (marching ants) algorithm for tracing. May be useful someday! http://rickluna.com/wp/tag/html-5/
                var top = dy + paddedYValueToPreventClipping;
                var left = smallCircleCenterX - smallCircleRadius;
                console.log('displaying image map: top: ' + top + ', left: ' + left);
                //alert('displaying image map: top: ' + top + ', left: ' + left);

                var html = '';

                html += '<map name="circleDialogSmallCircleClickableImageMap">';
                //debugger;
                //if (!participantId) { //identityJson && identityJson.bwParticipantId) {
                // This means we are displaying a particiant.
                //html += '<area shape="rect" coords="0,0,82,126" href="sun.htm" alt="Sun">';
                //html += '  <area shape="circle" coords="' + smallCircleRadius + ',' + smallCircleRadius + ',' + smallCircleRadius + '" href="javascript:void($(\'.bwCircleDialog\').bwCircleDialog(\'displaySmallCircleDialog\', \'participant\', \'' + identityJson.bwParticipantId + '\', \'' + identityJson.bwParticipantFriendlyName + '\', \'' + identityJson.bwParticipantEmail + '\'));">'; // The void() code is required for Firefox, and may just be good practice for href's.
                //alert('clickable small circle area element');
                //html += '  <area shape="circle" style="cursor:help !important;" coords="' + smallCircleCenterX + ',' + smallCircleCenterY + ',' + smallCircleRadius + '" onclick="$(\'.bwCircleDialog\').bwCircleDialog(\'displaySmallCircleDialog\', \'participant\', \'' + participantId + '\', \'' + participantFriendlyName + '\', \'' + participantEmail + '\');">'; // The void() code is required for Firefox, and may just be good practice for href's.
                //html += '  <area shape="circle" coords="' + smallCircleCenterX + ',' + smallCircleCenterY + ',' + smallCircleRadius + '" href="#" target="_blank" alt="BUDGETWORKFLOWxcx21342533">'; // The void() code is required for Firefox, and may just be good practice for href's.

                // NOTE THAT the area element coords are relative to the image that is using it.











                // 12-6-2022 Shouldn't we have the org id here??? Hmmmm.....
                if (identityJson && identityJson.bwOrgId) {
                    
                    html += '  <area xcx="xcx3437" title="' + identityJson.bwOrgId + '" alt="xcx122354" shape="circle" coords="' + smallCircleRadius + ',' + smallCircleRadius + ',' + smallCircleRadius + '" ';

                } else {

                    console.log('12-6-2022 Shouldnt we have the org id here??? Hmmmm..... xcx232353278');
                    //displayAlertDialog('12-6-2022 Shouldnt we have the org id here??? Hmmmm..... xcx232353278');
                    html += '  <area xcx="xcx3437" title="' + 'xcx232674ue43' + '" alt="xcx122354" shape="circle" coords="' + smallCircleRadius + ',' + smallCircleRadius + ',' + smallCircleRadius + '" ';

                }

                if (identityJson && identityJson.bwParticipantId) {
                    // This means we are displaying a particiant.
                    html += ' href="javascript:void($(\'.bwCircleDialog\').bwCircleDialog(\'displaySmallCircleDialog\', \'participant\', \'' + identityJson.bwParticipantId + '\', \'' + identityJson.bwParticipantFriendlyName + '\', \'' + identityJson.bwParticipantEmail + '\'));">'; // The void() code is required for Firefox, and may just be good practice for href's.
                } else if (identityJson && identityJson.bwOrgName) {



                    


                    // We must be displaying an org.
                    var tempBwOrgName = '';
                    if (identityJson.bwOrgName) {
                        tempBwOrgName = identityJson.bwOrgName.replace("'", "&#39;");
                    }

                    var tempBwOrgPath = identityJson.bwOrgPath.replace("'", "&#39;");



                    console.log('xcx3393845 We must be displaying an org. tempBwOrgName: ' + tempBwOrgName + ', tempBwOrgPath: ' + tempBwOrgPath);






                    html += ' href="javascript:void($(\'.bwCircleDialog\').bwCircleDialog(\'displaySmallCircleDialog\', \'org\', \'' + encodeURIComponent(identityJson.bwOrgId) + '\', \'' + encodeURIComponent(tempBwOrgName) + '\', \'' + encodeURIComponent(tempBwOrgPath) + '\'))">'; // The void() code is required for Firefox, and may just be good practice for href's. // &#39; is a single quote.

                    //    // THIS LINE HAS ALL THE quotes and single quotes backwards!! This is done because the orgname or orgpath may have a single quote in it. 9-6-2021.
                    //    html += "  <area shape='circle' coords='" + smallCircleRadius + "," + smallCircleRadius + "," + smallCircleRadius + "' href='javascript:void($(\".bwCircleDialog\").bwCircleDialog(\"displaySmallCircleDialog\", \"org\", \"" + identityJson.bwOrgId + "\", \"" + tempBwOrgName + "\", \"" + tempBwOrgPath + "\"))'>"; // The void() code is required for Firefox, and may just be good practice for href's. // &#39; is a single quote.

                } else {
                    html += ' href="javascript:alert(\'SMALL CLICKED xcx324254\');" target="_self" alt="BUDGETWORKFLOWxcx21342533">'; // The void() code is required for Firefox, and may just be good practice for href's.
                }
















                //html += '  <area style="border:1px solid red;" shape="circle" coords="' + smallCircleRadius + ',' + smallCircleRadius + ',' + smallCircleRadius + '" href="javascript:alert(\'xx\');">'; // The void() code is required for Firefox, and may just be good practice for href's.
                //} else {
                //    // We must be displaying an org.
                //    //debugger;
                //    var tempBwOrgName = '';
                //    if (identityJson.bwOrgName) {
                //        tempBwOrgName = identityJson.bwOrgName.replace("'", "&#39;");
                //    }

                //    var tempBwOrgPath = identityJson.bwOrgPath.replace("'", "&#39;");
                //    //html += '  <area shape="circle" coords="' + smallCircleRadius + ',' + smallCircleRadius + ',' + smallCircleRadius + '" href="javascript:void($(\'.bwCircleDialog\').bwCircleDialog(\'displaySmallCircleDialog\', \'org\', \'' + identityJson.bwOrgId + '\', \'' + tempBwOrgName + '\', \'' + tempBwOrgPath + '\'))">'; // The void() code is required for Firefox, and may just be good practice for href's. // &#39; is a single quote.

                //    // THIS LINE HAS ALL THE quotes and single quotes backwards!! This is done because the orgname or orgpath may have a single quote in it. 9-6-2021.
                //    html += "  <area shape='circle' coords='" + smallCircleRadius + "," + smallCircleRadius + "," + smallCircleRadius + "' href='javascript:void($(\".bwCircleDialog\").bwCircleDialog(\"displaySmallCircleDialog\", \"org\", \"" + identityJson.bwOrgId + "\", \"" + tempBwOrgName + "\", \"" + tempBwOrgPath + "\"))'>"; // The void() code is required for Firefox, and may just be good practice for href's. // &#39; is a single quote.

                //}

                html += '</map>';
                // If we decide to use hover switch these lines. The 1pixeltransparentimage.png image is much smaller that is why we are using it here. The map always needs an image!
                //html += '<img id="circleDialogSmallCircleClickableImage" usemap="#circleDialogSmallCircleClickableImageMap" src="images/plus-sign.png" style="position:absolute;top:' + top + 'px;left:' + left + 'px;width:' + smallCircleRadius * 2 + 'px;height:' + smallCircleRadius * 2 + 'px;z-index:12;opacity:0;">';

                //debugger; // xcx2 working on z-index 7-4-2020


                var imageMap_zIndex = canvas_zIndex + 1;
                //
                // Our image map for he small circle in the circle dialog makes it clickable, so that we can drill down to the org or participant image, and update it if we want to. This is where we set the z-index. It has to be on top for it to be clickable!
                //
                console.log('In bwCircleDialog.js.drawCircle(). Our image map for the small circle in the circle dialog makes it clickable (circleDialogSmallCircleClickableImage), so that we can drill down to the org or participant image, and update it if we want to. This is where we render the img element and set the z-index. It has to be on top for it to be clickable!');
                html += '<img id="circleDialogSmallCircleClickableImage" usemap="#circleDialogSmallCircleClickableImageMap" src="images/1pixeltransparentimage.png" style="position:absolute;top:' + top + 'px;left:' + left + 'px;width:' + smallCircleRadius * 2 + 'px;height:' + smallCircleRadius * 2 + 'px;z-index:' + imageMap_zIndex + ';opacity:0;" title="xcx1232537568-1" alt="xcx1232537568-2" />'; // z-index was 12 7-4-2020
                //html += '<img id="circleDialogSmallCircleClickableImage" usemap="#circleDialogSmallCircleClickableImageMap" src="images/1pixeltransparentimage.png" style="position:absolute;top:' + top + 'px;left:' + left + 'px;width:' + smallCircleRadius * 2 + 'px;height:' + smallCircleRadius * 2 + 'px;z-index:12;background-color:yellow;">'; //opacity:0;">'; // z-index was 12 7-4-2020

                $('#' + thiz.options.mapWrapperElementId_small).html(html);

                // The following hover behavior is not necessary I don't think! Leaving here just in case we want to present this extra UI hint to the user....
                //$('#circleDialogSmallCircleClickableImage').hover(function () {
                //    alert('In circleDialogSmallCircleClickableImage.hover():1.');
                //    $(this).css({ opacity: 0.2 }); 
                //}, function () {
                //    alert('In circleDialogSmallCircleClickableImage.hover():2.');
                //    $(this).css({ opacity: 0 });
                //});
            }













        } catch (e) {
            console.log('Exception in bwCircleDialog.js.drawCircle(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwCircleDialog.js.drawCircle(): ' + e.message + ', ' + e.stack);
        }
    },
    displaySmallCircleDialog: function (identityType, parm1, parm2, parm3) { // FOR AN ORG IT SHOULD BE: identityType, bwOrgId, BwOrgName, BwOrgPath
        try {
            console.log('In displaySmallCircleDialog(). identityType: ' + identityType + '. THE STUPID BUTTON MAY NOT BE IN THE RIGHT PLACE ARGHHH.');
            //alert('In displaySmallCircleDialog(). identityType: ' + identityType + '. THE STUPID BUTTON MAY NOT BE IN THE RIGHT PLACE ARGHHH.');
            var thiz = this;

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            if (identityType == 'participant') {
                // Displaying a user/participant.
                var bwParticipantId = parm1;
                var bwParticipantFriendlyName = parm2;
                var bwParticipantEmail = parm3;
                $('#divUploadANewSmallCircleImageDialog').dialog({
                    modal: true,
                    resizable: false,
                    closeText: "Cancel",
                    closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                    width: "1000px",
                    dialogClass: "no-close", // No close button in the upper right corner.
                    hide: false, // This means when hiding just disappear with no effects.
                    open: function () {
                        try {
                            $('.ui-widget-overlay').bind('click', function () {
                                $("#divUploadANewSmallCircleImageDialog").dialog('close');
                            });
                            HideActivitySpinner();

                            debugger; // 1-8-2022
                            var requestDialogId = 'divUploadANewSmallCircleImageDialog';

                            $('#' + requestDialogId).css('overflow', 'hidden'); // This keeps the scroll bars from showing up on the form dialog!!!!!!!! 7-13-2020

                            var element = document.getElementById(requestDialogId).parentNode; // This is the best way to get a handle on the jquery dialog.
                            var requestDialogParentId = requestDialogId + '_Parent'; // We need to have an id value so we can refer to this. It doesn't have one unless we add it here.
                            element.id = requestDialogParentId; // We need to have an id value so we can refer to this. It doesn't have one unless we add it here.

                            // This creates the custom header/draggable bar on the dialog!!! 4-2-2020. // ☈ ☇ https://www.toptal.com/designers/htmlarrows/symbols/thunderstorm/
                            var html = '';

                            html += '<table style="width:100%;" onclick="$(\'.bwRequest\').bwRequest(\'pinRequestDialog\');">'; // This click event is like "pin". Once the user clicks the header of the request dialog, it no longer is modal and persists on the screen until they choose to close it.
                            html += '   <tr>';
                            html += '       <td style="width:95%;">';
                            //html += '           <div id="slider_' + budgetRequestId + '" style="width:20%;cursor:pointer;"></div>';
                            html += '           <div id="slider_' + requestDialogId + '" style="width:20%;cursor:pointer;"></div>';
                            html += '       </td>';
                            html += '       <td style="vertical-align:middle;width:5%;padding:0;border:0;margin:0;">';
                            html += '           <span title="print" class="printButton" style="font-size:18pt;cursor:pointer !important;" onclick="$(\'.bwPrintButton\').bwPrintButton(\'PrintIndividualRequestReport\');"><img src="/images/iosprinter_blue.png" style="width:50px;height:50px;cursor:pointer !important;" onclick="$(\'.bwPrintButton\').bwPrintButton(\'PrintIndividualRequestReport\');" /></span>';
                            html += '       </td>';
                            html += '       <td>&nbsp;&nbsp;</td>';
                            html += '       <td>';
                            html += '           <span class="dialogXButton" style="font-size:25pt;cursor:pointer;width:100%;font-weight:bold;" onclick="$(\'.bwPageScrollingHandler\').bwPageScrollingHandler(\'CloseDialogAndPreventNextWindowScrollEvent\', \'' + requestDialogId.replace('_Parent', '') + '\');">X</span>';
                            html += '       </td>';
                            html += '   </tr>';
                            html += '</table>';
                            document.getElementById(requestDialogId).parentNode.querySelector(".ui-dialog-titlebar").innerHTML = html;

                            $("#slider_" + requestDialogId).slider({
                                min: 50,
                                max: 200,
                                value: 100, // It starts off full size.
                                slide: function (event, ui) {
                                    //thiz.setZoom(ui.value, requestDialogId);
                                    $('.bwRequest').bwRequest('setZoom', ui.value, requestDialogId);
                                }//,
                                //change: function (event, ui) {
                                //    thiz.setZoom(ui.value, requestDialogId);
                                //}
                            });
                            $('.bwRequest').bwRequest('setZoom', '100', requestDialogId);

                        } catch (e) {
                            console.log('Exception in bwCircleDialog.js.displaySmallCircleDialog.divUploadANewSmallCircleImageDialog.dialog.open(participant): ' + e.message + ', ' + e.stack);
                            displayAlertDialog('Exception in bwCircleDialog.js.displaySmallCircleDialog.divUploadANewSmallCircleImageDialog.dialog.open(participant): ' + e.message + ', ' + e.stack);
                        }
                    },
                    close: function () {
                        HideActivitySpinner();
                    }
                });
                //$("#divUploadANewSmallCircleImageDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

                var html = '';


                //html += '<img id="divUploadANewSmallCircleImageDialogContentImage" style="width:200px;height:200px;float:left;padding-right:20px;" src="https://budgetworkflow.com/images/corporeal.png">';
                html += '<img xcx="xcx12414-1" id="divUploadANewSmallCircleImageDialogContentImage" style="width:400px;height:400px;float:left;padding-right:20px;" src="https://budgetworkflow.com/images/corporeal.png">';












                html += '<br />';
                html += '<br />';
                //html += '<span>This image represents this Org, and is displayed throughout, including on reports.<br /><br />You can replace this image by clicking the "Choose file...📁" button below.</span>'; // bwOrgName
                html += '<span>This image represents "' + bwParticipantFriendlyName + '", and is displayed throughout, including on reports.<br /><br />You can replace this image by clicking the "Choose file...&nbsp;📁" button below.</span>';
                html += '<br />';
                html += '<br />';

                //html += '<div style="height:55px;text-align:center;padding-left:0;">';
                //html += '  <label class="divSignInButton" style="font-style:normal;width:365px;height:100%;text-align:center;line-height:1.65em;font-size:23pt;border-radius: 5px 5px 5px 5px;display:inline-block;padding-left:0;padding-top:0;" for="inputFile_ForIdentifyingImage">';
                //html += '    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Choose file...&nbsp;📁&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
                //html == '  </label>          ';
                //html += '  <input class="upload" id="inputFile_ForIdentifyingImage" style="visibility:hidden;display:none;" onfocus="$(\'.bwCoreComponent\').bwCoreComponent(\'uploadAttachment_IdentifyingImage_Focus\');" onblur="$(\'.bwCoreComponent\').bwCoreComponent(\'uploadAttachment_IdentifyingImage_Blur\');" onchange="$(\'.bwCoreComponent\').bwCoreComponent(\'uploadAttachment_IdentifyingImage\', \'xcxnewrequestattachments\', \'' + identityType + '\', \'' + parm1 + '\', \'' + parm2 + '\', \'' + parm3 + '\');" type="file">';
                //html += '</div>';

                //html += '<div class="divSignInButton" style="height:55px;text-align:center;background-color:#f6f6f6;padding-left:0;">';
                html += '<div style="height:55px;text-align:center;padding-left:0;">';
                html += '  <label class="divSignInButton" style="font-style:normal;width:365px;height:100%;text-align:center;line-height:1.65em;font-size:23pt;border-radius: 5px 5px 5px 5px;display:inline-block;padding-left:0;padding-top:0;" for="inputFile_ForIdentifyingImage">';
                html += '    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Choose file...&nbsp;📁&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
                html == '  </label>          ';
                html += '  <input type="file" class="upload" id="inputFile_ForIdentifyingImage" style="visibility:hidden;display:none;" onchange="$(\'.bwCoreComponent\').bwCoreComponent(\'uploadAttachment_IdentifyingImage\', \'xcxnewrequestattachments\', \'' + identityType + '\', \'' + encodeURIComponent(parm1) + '\', \'' + encodeURIComponent(parm2) + '\', \'' + encodeURIComponent(parm3) + '\');" >';
                html += '</div>';

                document.getElementById('divUploadANewSmallCircleImageDialogContent').innerHTML = html;

                //
                // This is where it will get displayed:
                // <img id="divUploadANewSmallCircleImageDialogContentImage" style="width:200px;height:200px;float:left;padding-right:20px;" src="https://budgetworkflow.com/images/corporeal.png"

                var preventCachingGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });

                //var imagePath = this.options.operationUriPrefix + '_files/' + workflowAppId + '/participantimages/' + bwParticipantId + '/' + 'userimage.png?v=' + guid;

                var imagePath;

                var activeStateIdentifier = JSON.parse($('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier'));

                if (activeStateIdentifier.status != 'SUCCESS') {

                    imagePath = '[No image. Unauthorized. xcx213124-34556-555]';

                } else {

                    //html += '<img id="attachmentstest1" xcx="xcx2312-2-2" src="' + thiz.options.operationUriPrefix + fileUrl_Thumbnail + '?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier + '" style="height:120px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;max-width:250px;border:1px solid gray;border-radius:0 30px 0 0;" alt="" ';

                    imagePath = this.options.operationUriPrefix + '_files/' + workflowAppId + '/participantimages/' + bwParticipantId + '/' + 'userimage.png?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier;

                }








                //debugger;
                $.get(imagePath).done(function () {
                    //debugger;
                    var img = new Image();
                    img.src = imagePath; //img.src = 'images/userimage.png';
                    img.onload = function (e) {
                        try {
                            //debugger;
                            document.getElementById('divUploadANewSmallCircleImageDialogContentImage').src = imagePath;
                        } catch (e) {
                            console.log('Exception in displaySmallCircleDialog().img.onload(): ' + e.message + ', ' + e.stack);
                            HideActivitySpinner();
                        }
                    }
                }).fail(function () {
                    //debugger;
                    console.log("This participant has no image.2"); // do nothing 
                    HideActivitySpinner();
                    var x = 'failed';
                });

            } else if (identityType == 'org') {
                // We must be displaying an org.
                // Displaying an org.
                var bwOrgId = parm1;
                var bwOrgName = parm2;
                var bwOrgPath = parm3;
                $('#divUploadANewSmallCircleImageDialog').dialog({
                    modal: true,
                    resizable: false,
                    closeText: "Cancel",
                    closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                    width: "1000px",
                    dialogClass: "no-close", // No close button in the upper right corner.
                    hide: false, // This means when hiding just disappear with no effects.
                    open: function () {
                        try {
                            $('.ui-widget-overlay').bind('click', function () {
                                $("#divUploadANewSmallCircleImageDialog").dialog('close');
                            });
                            //HideActivitySpinner();

                            //debugger; // 1-8-2022
                            var requestDialogId = 'divUploadANewSmallCircleImageDialog';

                            $('#' + requestDialogId).css('overflow', 'hidden'); // This keeps the scroll bars from showing up on the form dialog!!!!!!!! 7-13-2020

                            var element = document.getElementById(requestDialogId).parentNode; // This is the best way to get a handle on the jquery dialog.
                            var requestDialogParentId = requestDialogId + '_Parent'; // We need to have an id value so we can refer to this. It doesn't have one unless we add it here.
                            element.id = requestDialogParentId; // We need to have an id value so we can refer to this. It doesn't have one unless we add it here.

                            // This creates the custom header/draggable bar on the dialog!!! 4-2-2020. // ☈ ☇ https://www.toptal.com/designers/htmlarrows/symbols/thunderstorm/
                            var html = '';

                            html += '<table style="width:100%;" onclick="$(\'.bwRequest\').bwRequest(\'pinRequestDialog\');">'; // This click event is like "pin". Once the user clicks the header of the request dialog, it no longer is modal and persists on the screen until they choose to close it.
                            html += '   <tr>';
                            html += '       <td style="width:95%;">';
                            //html += '           <div id="slider_' + budgetRequestId + '" style="width:20%;cursor:pointer;"></div>';
                            html += '           <div id="slider_' + requestDialogId + '" style="width:20%;cursor:pointer;"></div>';
                            html += '       </td>';
                            html += '       <td style="vertical-align:middle;width:5%;padding:0;border:0;margin:0;">';
                            html += '           <span title="print" class="printButton" style="font-size:18pt;cursor:pointer !important;" onclick="$(\'.bwPrintButton\').bwPrintButton(\'PrintIndividualRequestReport\');"><img src="/images/iosprinter_blue.png" style="width:50px;height:50px;cursor:pointer !important;" onclick="$(\'.bwPrintButton\').bwPrintButton(\'PrintIndividualRequestReport\');" /></span>';
                            html += '       </td>';
                            html += '       <td>&nbsp;&nbsp;</td>';
                            html += '       <td>';
                            html += '           <span class="dialogXButton" style="font-size:25pt;cursor:pointer;width:100%;font-weight:bold;" onclick="$(\'.bwPageScrollingHandler\').bwPageScrollingHandler(\'CloseDialogAndPreventNextWindowScrollEvent\', \'' + requestDialogId.replace('_Parent', '') + '\');">X</span>';
                            html += '       </td>';
                            html += '   </tr>';
                            html += '</table>';
                            document.getElementById(requestDialogId).parentNode.querySelector(".ui-dialog-titlebar").innerHTML = html;

                            $("#slider_" + requestDialogId).slider({
                                min: 50,
                                max: 200,
                                value: 100, // It starts off full size.
                                slide: function (event, ui) {
                                    //thiz.setZoom(ui.value, requestDialogId);
                                    $('.bwRequest').bwRequest('setZoom', ui.value, requestDialogId);
                                }//,
                                //change: function (event, ui) {
                                //    thiz.setZoom(ui.value, requestDialogId);
                                //}
                            });
                            $('.bwRequest').bwRequest('setZoom', '100', requestDialogId);

                        } catch (e) {
                            console.log('Exception in bwCircleDialog.js.displaySmallCircleDialog.divUploadANewSmallCircleImageDialog.dialog.open(org): ' + e.message + ', ' + e.stack);
                            displayAlertDialog('Exception in bwCircleDialog.js.displaySmallCircleDialog.divUploadANewSmallCircleImageDialog.dialog.open(org): ' + e.message + ', ' + e.stack);
                        }
                    },
                    close: function () {
                        //HideActivitySpinner();
                    }
                });
                //$("#divUploadANewSmallCircleImageDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

                var html = '';

                //html += '<img id="divUploadANewSmallCircleImageDialogContentImage" style="width:200px;height:200px;float:left;padding-right:20px;" src="https://budgetworkflow.com/images/corporeal.png">';
                html += '<img xcx="xcx12414-2" id="divUploadANewSmallCircleImageDialogContentImage" style="width:400px;height:400px;float:left;padding-right:20px;" src="https://budgetworkflow.com/images/corporeal.png">';

                html += '<br />';
                html += '<br />';
                //html += '<span>This image represents this Org, and is displayed throughout, including on reports.<br /><br />You can replace this image by clicking the "Choose file...📁" button below.</span>'; // bwOrgName


                //html += '<span>This image represents "' + bwOrgId + ', ' + bwOrgName + ', ' + bwOrgPath + '", and is displayed throughout, including on reports.<br /><br />You can replace this image by clicking the "Choose file...&nbsp;📁" button below.</span>';
                html += '<span>This image represents "' + bwOrgPath + '", and is displayed throughout, including on reports.<br /><br />You can replace this image by clicking the "Choose file...&nbsp;📁" button below.</span>';
                html += '<br />';
                html += '<br />';

                //html += '<div class="divSignInButton" style="height:55px;text-align:center;background-color:#f6f6f6;padding-left:0;">';
                html += '<div style="height:55px;text-align:center;padding-left:0;">';
                html += '  <label class="divSignInButton" style="font-style:normal;width:365px;height:100%;text-align:center;line-height:1.65em;font-size:23pt;border-radius: 5px 5px 5px 5px;display:inline-block;padding-left:0;padding-top:0;" for="inputFile_ForIdentifyingImage">';
                html += '    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Choose file...&nbsp;📁&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
                html == '  </label>          ';
                html += '  <input type="file" class="upload" id="inputFile_ForIdentifyingImage" style="visibility:hidden;display:none;" onchange="$(\'.bwCoreComponent\').bwCoreComponent(\'uploadAttachment_IdentifyingImage\', \'xcxnewrequestattachments\', \'' + identityType + '\', \'' + encodeURIComponent(parm1) + '\', \'' + encodeURIComponent(parm2) + '\', \'' + encodeURIComponent(parm3) + '\');" >';
                html += '</div>';

                document.getElementById('divUploadANewSmallCircleImageDialogContent').innerHTML = html;





                //debugger; // 1-6-2022
                //
                // Now that the input element with attribute file has been added to the DOM, can we attach to events so we can display the actiivty spinner during the upload?
                //


















                //
                // This is where it will get displayed:
                // <img id="divUploadANewSmallCircleImageDialogContentImage" style="width:200px;height:200px;float:left;padding-right:20px;" src="https://budgetworkflow.com/images/corporeal.png"
                //debugger;
                var preventCachingGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });

                //var imagePath = this.options.operationUriPrefix + '_files/' + workflowAppId + '/orgimages/' + bwOrgId + '/' + 'orgimage.png?v=' + imageVersionGuid;


                var imagePath;

                var activeStateIdentifier = JSON.parse($('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier'));

                if (activeStateIdentifier.status != 'SUCCESS') {

                    imagePath = '[No image. Unauthorized. xcx213124-34556-555]';

                } else {

                    //html += '<img id="attachmentstest1" xcx="xcx2312-2-2" src="' + thiz.options.operationUriPrefix + fileUrl_Thumbnail + '?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier + '" style="height:120px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;max-width:250px;border:1px solid gray;border-radius:0 30px 0 0;" alt="" ';
                    if (!workflowAppId) {
                        alert('ERROR xcx883934.');
                    }
                    imagePath = this.options.operationUriPrefix + '_files/' + workflowAppId + '/orgimages/' + bwOrgId + '/' + 'orgimage.png?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier;

                    //debugger;
                    $.get(imagePath).done(function () {
                        //debugger;
                        var img = new Image();
                        img.src = imagePath; //img.src = 'images/orgimage.png';
                        img.onload = function (e) {
                            try {
                                //debugger;
                                document.getElementById('divUploadANewSmallCircleImageDialogContentImage').src = imagePath;
                            } catch (e) {
                                console.log('Exception in displaySmallCircleDialog().img.onload(): ' + e.message + ', ' + e.stack);
                                //HideActivitySpinner();
                            }
                        }
                    }).fail(function () {
                        //HideActivitySpinner();
                        //debugger;
                        console.log("This org has no image. xcx2342"); // do nothing 
                        //var x = 'failed';
                    });


                }






              


            } else {
                console.log('In displaySmallCircleDialog(): Unrecognized identityType: ' + identityType);
                displayAlertDialog('In displaySmallCircleDialog(): Unrecognized identityType: ' + identityType);
                //HideActivitySpinner();
            }

        } catch (e) {
            console.log('Exception in displaySmallCircleDialog(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in displaySmallCircleDialog(): ' + e.message + ', ' + e.stack);
            //HideActivitySpinner();
        }
    },

    displaySignInWithSMSCodeDialog: function (resetCachedDisplayValues, customLogonDialogDescriptionText, bwTwoFactorAuthenticationSmsNumber) {
        try {
            console.log('In displaySignInWithSMSCodeDialog().');
            //debugger;
            this.hideCircleDialog(); // Make sure any existing one is closed first.



            //try {
            //    $("#divCustomLogonDialog").dialog('close');
            //} catch (e) { }
            //try {
            //    $("#divCustomSignUpDialog").dialog('close');
            //} catch (e) { }
            try {
                $("#divCustomLogonResetPasswordDialog").dialog('close');
            } catch (e) {
            }
            //try {
            //    $("#divCustomLogonResetPasswordConfirmationDialog").dialog('close');
            //} catch (e) {
            //}

            if (resetCachedDisplayValues == true) {
                this.options.OnResizeDisplayValues = null;
            }

            //initializeTheLogon(); // This displays the jquery dialog.

            var html = '';
            //debugger;
            if (this.options.OnResizeDisplayValues != null && this.options.OnResizeDisplayValues.Html) {
                html = this.options.OnResizeDisplayValues.Html;
            } else {
                //alert('divCustomLogonDialog xcx2');
                html += '<div id="divCustomLogonDialog">';
                html += '        <table style="width:100%;">';
                html += '            <tr>';
                html += '                <td style="width:90%;">';
                html += '                    <span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;font-weight:bold;">Sign in</span>';
                html += '                </td>';
                html += '                <td style="width:9%;"></td>';
                html += '                <td style="width:1%;cursor:pointer;vertical-align:top;">';
                html += '                    <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 30pt;font-weight:bold;" onclick="$(\'.bwCircleDialog\').bwCircleDialog(\'hideCircleDialog\');">X</span>';
                html += '                </td>';
                html += '            </tr>';
                html += '        </table>';
                html += '        <br />';
                html += '        <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
                html += '        <span id="spanCustomLogonDialogInvitationDescriptionText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 20pt;"></span>';


                var maskedSmsNumber = 'xxxx';
                try {
                    maskedSmsNumber = bwTwoFactorAuthenticationSmsNumber.substring(bwTwoFactorAuthenticationSmsNumber.length - 4, bwTwoFactorAuthenticationSmsNumber.length);
                } catch (e) {
                }

                html += '        <span style="font-family: calibri;font-size:30pt;">Enter code sent to xxx-xxx-' + maskedSmsNumber + ':</span>';
                html += '        <br />';
                html += '        <input type="text" id="txtCustomLogonSmsCode" style="WIDTH: 93%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 80pt;" />';
                html += '        <br /><br />';
                //html += '        <span style="font-family: calibri;">Password</span>';
                //html += '        <br />';
                //html += '        <input type="password" id="txtCustomLogonPassword" onkeydown="return carriagereturnpress(event, \'logonWith_BudgetWorkflow\');" style="WIDTH: 93%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" /><br />';
                html += '        <br />';

                //html += 'xcx984375xcx'; // 4-19-2020. Add login "Remember me" checkbox.
                var zoom = 1.25;
                html += '<table style="width:100%;">';
                html += '<tr>';
                html += '<td style="text-align:right;">';
                //html += '   <span style="cursor:help;color:gray;" title="Auto-logon. Your logon information gets saved in localStorage so that you aren\'t subsequently prompted to logon. Clearing your browser data will delete your localStorage." >';
                //html += '        <input onclick="$(\'.bwAuthentication\').bwAuthentication(\'changeRememberMeCheckboxSetting_OnClick\');" id="cbCustomLogonRememberMe" type="checkbox" style="cursor:pointer;zoom: ' + zoom + ';transform: scale(' + zoom + ');-ms-transform: scale(' + zoom + ');-webkit-transform: scale(' + zoom + ');-o-transform: scale(' + zoom + ');-moz-transform: scale(' + zoom + ');transform-origin: 0 0;-ms-transform-origin: 0 0;-webkit-transform-origin: 0 0;-o-transform-origin: 0 0;-moz-transform-origin: 0 0;" checked />';
                //html += '        &nbsp;Remember me';
                //html += '   </span>';
                //html += '        <br />';
                //html += '        <br />';
                html += '</td>';
                html += '</tr>';
                html += '</table>';


                //html += '';
                html += '        <div id="xcx323467" class="divSignInButton" style="width: 75%; text-align: center; line-height: 1.1em; font-weight: bold;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'logonWith_BudgetWorkflow_usingSmsCode\');">';
                html += '            Sign In';
                html += '        </div>';
                html += '        <br /><br />';

                //debugger;
                //if (!hideSignUpAndResetPasswordButtons || hideSignUpAndResetPasswordButtons != true) {
                html += '        <span style="font-family: calibri;font-style:italic;font-size:15pt;">Didn\'t receive a code?</span>';
                html += '        <br /><br />';

                html += '        <div id="xxxx" class="divSignInButton" style="width: 75%; text-align: center; line-height: 1.1em; font-weight: bold;" onclick="$(\'.bwCircleDialog\').bwCircleDialog(\'displaySignInWithEmailCodeDialog\', true);">';
                html += '            I didn\'t receive a code';
                html += '        </div>';
                html += '        <br />';

                //    html += '        <span style="font-family: calibri;font-style:italic;font-size:15pt;">Forgot your password?</span>';
                //    html += '        <br /><br />';

                //    html += '        <div id="xxxx" class="divSignInButton" style="width: 75%; text-align: center; line-height: 1.1em; font-weight: bold;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'cmdDisplayForgottenPasswordDialog\');">';
                //    html += '            Reset password';
                //    html += '        </div>';
                //    html += '        <br /><br />';
                //}





                html += '    </div>';
            }





            //
            // WE NEED the new way of displaying the circle dialog happening here. This is the 2-factor code dialog. 5-7-2022
            //

            //var divCircleDialog1 = document.getElementById('divCircleDialog1');
            //divCircleDialog1.innerHTML = html;


            var dialogElementId = $('.bwCircleDialog').bwCircleDialog('option', 'dialogElementId'); // >>>> STEP1: The bwCircleDialog widget manages this, so it always knows how to find it in the DOM.
            //if ($('#' + dialogElementId).dialog('instance')) {
            //    $('#' + dialogElementId).dialog('close'); // We make sure we start with a new one!
            //}
            //
            // >>>> THIS IS HOW WE should be displaying all of our circle dialogs.
            //
            $('#' + dialogElementId).html(html); // >>>> STEP2: Assign the element all of the html.
            $('#' + dialogElementId).dialog({ // >>>> STEP3: Display the dialog.
                modal: false,
                resizable: false,
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                width: '550',
                dialogClass: 'no-close', // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                position: {
                    my: 'center top', at: 'center top+150', of: window
                },
                close: function () {
                    $('#' + dialogElementId).dialog('destroy');
                },
                open: function () {
                    try {
                        $('.bwCircleDialog').bwCircleDialog('displayDialog'); // >>>> STEP 4: Display the circle dialog.

                        //$('#txtCustomLogonEmail').val(username);
                        //$('#txtCustomLogonPassword').val(password);
                        //if (rememberme == 'selected') {
                        //    // This auto-logs in the user.
                        //    thiz.logonWith_BudgetWorkflow_SwitchToDesktopVersion();
                        //} else {
                        //    document.getElementById('cbCustomLogonRememberMe').checked = false;
                        //}
                    } catch (e) {
                        console.log('Exception in bwCircleDialog.displaySignInWithSMSCodeDialog():2: ' + e.message + ', ' + e.stack); // Change to bwAuthentication <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< 5-7-2022
                        displayAlertDialog('Exception in bwCircleDialog.displaySignInWithSMSCodeDialog():2: ' + e.message + ', ' + e.stack);
                    }
                }
            });
            //$('#' + dialogElementId).dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();





























            if (customLogonDialogDescriptionText) {
                document.getElementById('spanCustomLogonDialogInvitationDescriptionText').innerHTML = customLogonDialogDescriptionText;
                if (customLogonDialogDescriptionText.indexOf('userimage.png') > -1) {
                    console.log('>>>>>>>>> Found images/userimage.png unexpectedly. xcx1-1');
                }
            }

            //$('#txtCustomLogonEmail').val(username);
            //$('#txtCustomLogonPassword').val(password);
            //if (rememberme == 'selected') {
            //    //debugger;

            //    if (window.location.href.indexOf('my.html') > -1) {
            //        $('.bwAuthentication').bwAuthentication('logonWith_BudgetWorkflow_SwitchToDesktopVersion');
            //    } else if (window.location.href.indexOf('ios8.html') > -1) {
            //        $('.bwAuthentication').bwAuthentication('logonWith_BudgetWorkflow_SwitchToMobileVersion');
            //    } else {
            //        // THIS IS THE DEFAULT
            //        $('.bwAuthentication').bwAuthentication('logonWith_BudgetWorkflow_SwitchToDesktopVersion');
            //        //this.displayAlertDialog('Error xcx5: Unexpected window.location. This process cannot proceed.');
            //    }




            //    //$('.bwAuthentication').bwAuthentication('logonWith_BudgetWorkflow_SwitchToDesktopVersion');
            //} else {
            //    document.getElementById('cbCustomLogonRememberMe').checked = false;
            //}




            //debugger;
            this.drawCircle(dialogElementId, 'images/businesswoman2.png', 512, 512, false);
            var displayValues = {
                DrawCircleDialog: true,
                DisplayMethod: 'displaySignInDialog',
                Image: {
                    Path: 'images/userimage.png',
                    Width: 512,
                    Height: 512
                },
                Html: document.getElementById(dialogElementId).innerHTML
            };
            this.options.OnResizeDisplayValues = displayValues;

            var canvas = document.getElementById("myCanvas");
            canvas.style.cursor = 'pointer';
            canvas.onclick = function (e) {
                console.log('CLEAN UP bwCircleDialog! Figure out where the user clicked and respond accordingly. :D');
                //this.hideCircleDialog(); // CLOSE THE WHOLE THING!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! THIS AINT PERFECT, NEEDS WORK!
                $('.bwCircleDialog').bwCircleDialog('hideAndDestroyCircleDialog');
            };

            //setTimeout(function () { // Only needs to happen for Chrome.
            //    debugger;
            //    //
            //    // WHY AREN'T THESE VALUES POPULATING THE SCREEN!!!!!!!!!!!!!!!!!!!!!!!!!!!!! :(((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((
            //    //

            //    //document.getElementById('txtCustomLogonEmail').value = username;
            //    //document.getElementById('txtCustomLogonPassword').value = password;
            //    $('#txtCustomLogonEmail').val(username);
            //    $('#txtCustomLogonPassword').val(password);
            //}, 500);

            $('#txtCustomLogonSmsCode').focus();


        } catch (e) {
            console.log('Exception in bwCircleDialog.displaySignInWithSMSCodeDialog(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwCircleDialog.displaySignInWithSMSCodeDialog(): ' + e.message + ', ' + e.stack);
        }
    },

    displaySignInWithEmailCodeDialog: function (resetCachedDisplayValues, customLogonDialogDescriptionText, bwTwoFactorAuthenticationSmsNumber) {
        try {
            console.log('In displaySignInWithEmailCodeDialog().');
            //debugger;
            this.hideCircleDialog(); // Make sure any existing one is closed first.



            //try {
            //    $("#divCustomLogonDialog").dialog('close');
            //} catch (e) { }
            //try {
            //    $("#divCustomSignUpDialog").dialog('close');
            //} catch (e) { }
            try {
                $("#divCustomLogonResetPasswordDialog").dialog('close');
            } catch (e) {
            }
            //try {
            //    $("#divCustomLogonResetPasswordConfirmationDialog").dialog('close');
            //} catch (e) {
            //}

            if (resetCachedDisplayValues == true) {
                this.options.OnResizeDisplayValues = null;
            }

            //initializeTheLogon(); // This displays the jquery dialog.

            var html = '';
            //debugger;
            if (this.options.OnResizeDisplayValues != null && this.options.OnResizeDisplayValues.Html) {
                html = this.options.OnResizeDisplayValues.Html;
            } else {
                alert('divCustomLogonDialog xcx3');
                html += '<div id="divCustomLogonDialog">';
                html += '        <table style="width:100%;">';
                html += '            <tr>';
                html += '                <td style="width:90%;">';
                html += '                    <span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;font-weight:bold;">Sign in</span>';
                html += '                </td>';
                html += '                <td style="width:9%;"></td>';
                html += '                <td style="width:1%;cursor:pointer;vertical-align:top;">';
                html += '                    <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 30pt;font-weight:bold;" onclick="$(\'.bwCircleDialog\').bwCircleDialog(\'hideCircleDialog\');">X</span>';
                html += '                </td>';
                html += '            </tr>';
                html += '        </table>';
                html += '        <br />';
                html += '        <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
                html += '        <span id="spanCustomLogonDialogInvitationDescriptionText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 20pt;"></span>';


                var sentCodeToEmailAddress = $('#divBwAuthentication').bwAuthentication('getCookie', 'customlogonusername');
                html += '        <span style="font-family: calibri;font-size:30pt;">Enter code sent to ' + sentCodeToEmailAddress + ':</span>';


                html += '        <br />';
                html += '        <input type="text" id="txtCustomLogonEmailCode" style="WIDTH: 93%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 80pt;" />';
                html += '        <br /><br />';
                //html += '        <span style="font-family: calibri;">Password</span>';
                //html += '        <br />';
                //html += '        <input type="password" id="txtCustomLogonPassword" onkeydown="return carriagereturnpress(event, \'logonWith_BudgetWorkflow\');" style="WIDTH: 93%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" /><br />';
                html += '        <br />';

                //html += 'xcx984375xcx'; // 4-19-2020. Add login "Remember me" checkbox.
                var zoom = 1.25;
                html += '<table style="width:100%;">';
                html += '<tr>';
                html += '<td style="text-align:right;">';
                
                //html += '        <br />';
                //html += '        <br />';
                html += '</td>';
                html += '</tr>';
                html += '</table>';


                //html += '';
                html += '        <div id="xcx2312412" class="divSignInButton" style="width: 75%; text-align: center; line-height: 1.1em; font-weight: bold;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'logonWith_BudgetWorkflow_usingEmailCode\');">'; // logonWith_BudgetWorkflow_usingSmsCode
                html += '            Sign In';
                html += '        </div>';
                html += '        <br /><br />';

                //debugger;
                //if (!hideSignUpAndResetPasswordButtons || hideSignUpAndResetPasswordButtons != true) {
                //html += '        <span style="font-family: calibri;font-style:italic;font-size:15pt;">Didn\'t receive a code?</span>';
                //html += '        <br /><br />';

                //html += '        <div id="xxxx" class="divSignInButton" style="width: 75%; text-align: center; line-height: 1.1em; font-weight: bold;" onclick="$(\'.bwCircleDialog\').bwCircleDialog(\'displaySignInWithEmailCodeDialog\', true);">';
                //html += '            I didn\'t receive a code';
                //html += '        </div>';
                //html += '        <br />';

                //    html += '        <span style="font-family: calibri;font-style:italic;font-size:15pt;">Forgot your password?</span>';
                //    html += '        <br /><br />';

                //    html += '        <div id="xxxx" class="divSignInButton" style="width: 75%; text-align: center; line-height: 1.1em; font-weight: bold;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'cmdDisplayForgottenPasswordDialog\');">';
                //    html += '            Reset password';
                //    html += '        </div>';
                //    html += '        <br /><br />';
                //}





                html += '    </div>';
            }

            var divCircleDialog1 = document.getElementById('divCircleDialog1');
            divCircleDialog1.innerHTML = html;

            if (customLogonDialogDescriptionText) {
                document.getElementById('spanCustomLogonDialogInvitationDescriptionText').innerHTML = customLogonDialogDescriptionText;
                if (customLogonDialogDescriptionText.indexOf('userimage.png') > -1) {
                    console.log('>>>>>>>>> Found images/userimage.png unexpectedly. xcx1-1');
                }
            }

            //$('#txtCustomLogonEmail').val(username);
            //$('#txtCustomLogonPassword').val(password);
            //if (rememberme == 'selected') {
            //    //debugger;

            //    if (window.location.href.indexOf('my.html') > -1) {
            //        $('.bwAuthentication').bwAuthentication('logonWith_BudgetWorkflow_SwitchToDesktopVersion');
            //    } else if (window.location.href.indexOf('ios8.html') > -1) {
            //        $('.bwAuthentication').bwAuthentication('logonWith_BudgetWorkflow_SwitchToMobileVersion');
            //    } else {
            //        // THIS IS THE DEFAULT
            //        $('.bwAuthentication').bwAuthentication('logonWith_BudgetWorkflow_SwitchToDesktopVersion');
            //        //this.displayAlertDialog('Error xcx5: Unexpected window.location. This process cannot proceed.');
            //    }




            //    //$('.bwAuthentication').bwAuthentication('logonWith_BudgetWorkflow_SwitchToDesktopVersion');
            //} else {
            //    document.getElementById('cbCustomLogonRememberMe').checked = false;
            //}




            //debugger;
            this.drawCircle(divCircleDialog1, 'images/businesswoman2.png', 512, 512, false);
            var displayValues = {
                DrawCircleDialog: true,
                DisplayMethod: 'displaySignInDialog',
                Image: {
                    Path: 'images/userimage.png',
                    Width: 512,
                    Height: 512
                },
                Html: divCircleDialog1.innerHTML
            };
            this.options.OnResizeDisplayValues = displayValues;

            var canvas = document.getElementById("myCanvas");
            canvas.style.cursor = 'pointer';
            canvas.onclick = function (e) {
                console.log('CLEAN UP bwCircleDialog! Figure out where the user clicked and respond accordingly. :D');
                //this.hideCircleDialog(); // CLOSE THE WHOLE THING!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! THIS AINT PERFECT, NEEDS WORK!
                $('.bwCircleDialog').bwCircleDialog('hideAndDestroyCircleDialog');
            };

            //setTimeout(function () { // Only needs to happen for Chrome.
            //    debugger;
            //    //
            //    // WHY AREN'T THESE VALUES POPULATING THE SCREEN!!!!!!!!!!!!!!!!!!!!!!!!!!!!! :(((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((
            //    //

            //    //document.getElementById('txtCustomLogonEmail').value = username;
            //    //document.getElementById('txtCustomLogonPassword').value = password;
            //    $('#txtCustomLogonEmail').val(username);
            //    $('#txtCustomLogonPassword').val(password);
            //}, 500);

            $('#txtCustomLogonEmailCode').focus();


        } catch (e) {
            console.log('Exception in bwCircleDialog.displaySignInWithEmailCodeDialog(): ' + e.message + ', ' + e.stack);
        }
    },

    displayCustomSignInWithInvitationDialog: function (resetCachedDisplayValues, invitationDescriptionTextHtml) {
        try {
            console.log('In displayCustomSignInWithInvitationDialog().');
            //debugger;
            this.hideCircleDialog(); // Make sure any existing one is closed first.

            //try {
            //    $("#divCustomLogonDialog").dialog('close');
            //} catch (e) { }
            //try {
            //    $("#divCustomSignUpDialog").dialog('close');
            //} catch (e) { }
            try {
                $("#divCustomLogonResetPasswordDialog").dialog('close');
            } catch (e) {
            }
            //try {
            //    $("#divCustomLogonResetPasswordConfirmationDialog").dialog('close');
            //} catch (e) {
            //}

            if (resetCachedDisplayValues == true) {
                this.options.OnResizeDisplayValues = null;
            }

            //initializeTheLogon(); // This displays the jquery dialog.

            var html = '';
            //debugger;
            if (this.options.OnResizeDisplayValues != null && this.options.OnResizeDisplayValues.Html) {
                html = this.options.OnResizeDisplayValues.Html;
            } else {



                //html += '<div style="display:none;" id="divCustomSignUpDialog">';
                html += '<div xcx="xcx9809-4" id="divCustomSignUpDialog">';
                html += '            <table style="width:100%;">';
                html += '                <tr>';
                html += '                    <td style="width:90%;">';
                html += '                        <span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;font-weight:bold;">Create your account</span>';
                html += '                    </td>';
                html += '                    <td style="width:9%;"></td>';
                html += '                    <td style="width:1%;cursor:pointer;vertical-align:top;">';
                html += '                        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 30pt;font-weight:bold;" onclick="$(\'#divCustomSignUpDialog\').dialog(\'close\');">X</span>';
                html += '                    </td>';
                html += '                </tr>';
                html += '            </table>';
                html += '            <br /><br />';
                html += '            <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
                html += '            <span id="spanCustomSignUpDialogInvitationDescriptionText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 20pt;"></span>';
                html += '            <span style="font-family: calibri;">Name</span><br />';
                html += '            <input type="text" id="txtCustomSignUpFriendlyName" style="WIDTH: 95%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" /><br /><br />';
                html += '            <span style="font-family: calibri;">Email Address</span><br />';
                html += '            <input type="text" id="txtCustomSignUpEmail" style="WIDTH: 95%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" /><br /><br />';
                html += '            <span style="font-family: calibri;">Choose a password (4-15 characters)xcx2</span><br />';
                html += '            <input type="password" onkeydown="return carriagereturnpress(event, \'newUserProvisioning_Custom\');" id="txtCustomSignUpPassword" style="WIDTH: 95%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" /><br />';
                html += '            <br />';
                html += '            <!--<input type="checkbox" />Remember me on this device.&nbsp;<a href="">?</a><br />-->';
                html += '            <div id="xxxx" class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'newUserProvisioning_Custom\');">';
                html += '                Create your account now!';
                html += '            </div>';
                html += '            <br />';
                html += '            <span style="font-family: calibri;font-style:italic;">Already have an account? <!--<a href="javascript:cmdSignInNow(\'divCustomSignUpDialog\');">Sign in now.</a>--></span>';
                html += '            <br /><br />';
                //html += '            <div id="xxxx" class="divSignInButton" style="width: 90%; text-align: center; line-height: 1.1em; font-weight: bold;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayCustomLogonDialog\');">';


                //
                // THIS NEEDS TO CALL A DIFFERENT METHOD BECAUSE THIS IS AN INVITATION. ALSO, if a new user, we need to make sure the correct web service is called.
                html += '            <div class="divSignInButton" style="width: 90%; text-align: center; line-height: 1.1em; font-weight: bold;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'logonWith_BudgetWorkflow\');">';
                //




                html += '                Sign In';
                html += '            </div>';
                html += '';
                html += '            <br /><br />';
                html += '            <!--<span style="font-family: calibri;font-style:italic;"><a href="https://budgetworkflow.com">Go back to the home page.</a></span><br /><br />-->';
                html += '        </div>';
                html += '';



                //html += '<div id="divCustomLogonDialog">';
                //html += '        <table style="width:100%;">';
                //html += '            <tr>';
                //html += '                <td style="width:90%;">';
                //html += '                    <span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;font-weight:bold;">Sign in</span>';
                //html += '                </td>';
                //html += '                <td style="width:9%;"></td>';
                //html += '                <td style="width:1%;cursor:pointer;vertical-align:top;">';
                //html += '                    <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 30pt;font-weight:bold;" onclick="$(\'.bwCircleDialog\').bwCircleDialog(\'hideCircleDialog\');">X</span>';
                //html += '                </td>';
                //html += '            </tr>';
                //html += '        </table>';
                //html += '        <br /><br />';
                //html += '        <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
                //html += '        <span id="spanCustomLogonDialogInvitationDescriptionText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 20pt;"></span>';
                //html += '';
                //html += '        <span style="font-family: calibri;">Email</span>';
                //html += '        <br />';
                //html += '        <input type="text" id="txtCustomLogonEmail" style="WIDTH: 93%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" />';
                //html += '        <br /><br />';
                //html += '        <span style="font-family: calibri;">Password</span>';
                //html += '        <br />';
                //html += '        <input type="password" id="txtCustomLogonPassword" onkeydown="return carriagereturnpress(event, \'logonWith_BudgetWorkflow\');" style="WIDTH: 93%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" /><br />';
                //html += '        <br />';
                //html += '';
                //html += '        <div id="xxxx" class="divSignInButton" style="width: 75%; text-align: center; line-height: 1.1em; font-weight: bold;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'logonWith_BudgetWorkflow\');">';
                //html += '            Sign In';
                //html += '        </div>';
                //html += '        <br />';
                //html += '';
                //html += '        <span style="font-family: calibri;font-style:italic;font-size:15pt;">New to BudgetWorkflow.com?<br />Sign up now. It\'s free!</span>';
                //html += '        <br /><br />';
                //html += '';
                //html += '        <div id="xxxx" class="divSignInButton" style="width: 75%; text-align: center; line-height: 1.1em; font-weight: bold;" onclick="$(\'.bwCircleDialog\').bwCircleDialog(\'displayCreateFreeAccountDialog\', true);">';
                //html += '            Sign up now';
                //html += '        </div>';
                //html += '        <br />';
                //html += '';
                //html += '        <span style="font-family: calibri;font-style:italic;font-size:15pt;">Forgot your password?</span>';
                //html += '        <br /><br />';
                //html += '';
                //html += '        <div id="xxxx" class="divSignInButton" style="width: 75%; text-align: center; line-height: 1.1em; font-weight: bold;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'cmdDisplayForgottenPasswordDialog\');">';
                //html += '            Reset password';
                //html += '        </div>';
                //html += '        <br /><br />';
                //html += '';
                //html += '    </div>';
            }

            //var divCircleDialogId = 'divCircleDialog_' + this.options.elementIdSuffix;
            var divCircleDialog1 = document.getElementById(this.options.dialogElementId); //divCircleDialogId);

            //var divCircleDialog1 = document.getElementById('divCircleDialog1');
            divCircleDialog1.innerHTML = html;
            //debugger;
            $('#spanCustomSignUpDialogInvitationDescriptionText').html(invitationDescriptionTextHtml);

            var username = localStorage['customlogonusername'];
            var password = localStorage['customlogonpassword'];
            $('#txtCustomSignUpEmail').val(username);
            $('#txtCustomSignUpPassword').val(password);

            //debugger;
            this.drawCircle(divCircleDialog1, 'images/businesswoman2.png', 512, 512, false);
            var displayValues = {
                DrawCircleDialog: true,
                DisplayMethod: 'displayCustomSignInWithInvitationDialog',
                Image: {
                    Path: 'images/userimage.png',
                    Width: 512,
                    Height: 512
                },
                Html: divCircleDialog1.innerHTML
            };
            this.options.OnResizeDisplayValues = displayValues;

            var canvas = document.getElementById("myCanvas");
            canvas.style.cursor = 'pointer';
            canvas.onclick = function (e) {
                console.log('CLEAN UP bwCircleDialog! Figure out where the user clicked and respond accordingly. :D');
                //this.hideCircleDialog(); // CLOSE THE WHOLE THING!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! THIS AINT PERFECT, NEEDS WORK!
                $('.bwCircleDialog').bwCircleDialog('hideAndDestroyCircleDialog');
            };

        } catch (e) {
            console.log('Exception in bwCircleDialog.displayCustomSignInWithInvitationDialog(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwCircleDialog.displayCustomSignInWithInvitationDialog(): ' + e.message + ', ' + e.stack);
        }
    },


    expandOrCollapseParticipantCircleDialogSection: function (rowId, imageId, collapsibleRowId) { // collapsibleRowId = steprow-' + stepName.toLowerCase() + '_' + i + '_' + '0'
        try {
            console.log('In expandOrCollapseParticipantCircleDialogSection(' + rowId + ', ' + imageId + ', ' + collapsibleRowId + ').');
            var elementIds = ['', 'participantCircleDialogSectionRow_1', 'participantCircleDialogSectionRow_2', 'participantCircleDialogSectionRow_3'];
            var imageElementIds = ['', 'participantCircleDialogSectionImage_1', 'participantCircleDialogSectionImage_2', 'participantCircleDialogSectionImage_3'];
            var selectedIndex = collapsibleRowId.split('_')[1];

            var img = document.getElementById(imageId);
            var urlClose = this.options.operationUriPrefix + 'images/drawer-close.png'; //https://budgetworkflow.com/images/drawer-close.png
            var urlOpen = this.options.operationUriPrefix + 'images/drawer-open.png';
            //debugger;
            if (img.src == urlClose) {
                // collapsing
                if (selectedIndex == 1) {
                    document.getElementById(elementIds[2]).style.display = 'table-row';
                    document.getElementById(imageElementIds[2]).src = urlClose;
                } else if (selectedIndex == 2) {
                    document.getElementById(elementIds[3]).style.display = 'table-row';
                    document.getElementById(imageElementIds[3]).src = urlClose;
                } else if (selectedIndex == 3) {
                    document.getElementById(elementIds[1]).style.display = 'table-row';
                    document.getElementById(imageElementIds[1]).src = urlClose;
                }
                document.getElementById(collapsibleRowId).style.display = 'none';
                document.getElementById(imageId).src = urlOpen;
            } else {
                // expanding
                if (selectedIndex == 1) {
                    document.getElementById(elementIds[2]).style.display = 'none';
                    document.getElementById(imageElementIds[2]).src = urlOpen;
                    document.getElementById(elementIds[3]).style.display = 'none';
                    document.getElementById(imageElementIds[3]).src = urlOpen;
                } else if (selectedIndex == 2) {
                    document.getElementById(elementIds[1]).style.display = 'none';
                    document.getElementById(imageElementIds[1]).src = urlOpen;
                    document.getElementById(elementIds[3]).style.display = 'none';
                    document.getElementById(imageElementIds[3]).src = urlOpen;
                } else if (selectedIndex == 3) {
                    document.getElementById(elementIds[1]).style.display = 'none';
                    document.getElementById(imageElementIds[1]).src = urlOpen;
                    document.getElementById(elementIds[2]).style.display = 'none';
                    document.getElementById(imageElementIds[2]).src = urlOpen;
                }
                document.getElementById(collapsibleRowId).style.display = 'table-row';
                document.getElementById(imageId).src = urlClose;
            }

        } catch (e) {
            console.log('Exception in expandOrCollapseParticipantCircleDialogSection(): ' + e.message + ', ' + e.stack);
        }
    },



    displaySpecifiedUserProfileEditingInACircle: function (resetCachedDisplayValues, participantId, participantFriendlyName, participantEmail) {
        try {
            console.log('In displaySpecifiedUserProfileEditingInACircle().');
            var thiz = this;

            this.hideCircleDialog(); // Make sure any existing one is closed first.

            var tenantId = $('.bwAuthentication').bwAuthentication('option', 'tenantId');
            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            //var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            //var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
            //var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');
            //var participantLogonType = $('.bwAuthentication').bwAuthentication('option', 'participantLogonType');



            window.scrollTo(0, 0); // Scroll to top. This makes sure the canvas lines up with the dialog. A quick fix and probably just a better way to do it. 2-1-2022
            $('.bwActiveMenu').bwActiveMenu('adjustLeftSideMenu'); // This makes sure our new stretchy-left-menu redraws Ok.


            $('#spanLoggedInUserDropDownDialogTitle').html(participantFriendlyName);

            $('#divCircleDialog1').empty(); //var divCircleDialog1 = document.getElementById('divCircleDialog1');')
            //try {
            //    $("#divCustomLogonDialog").dialog('close');
            //} catch (e) { }
            //try {
            //    $("#divCustomSignUpDialog").dialog('close');
            //} catch (e) { }
            //try {
            //    $("#divCustomLogonResetPasswordDialog").dialog('close');
            //} catch (e) { }
            //try {
            //    $("#divCustomLogonResetPasswordConfirmationDialog").dialog('close');
            //} catch (e) {
            //}

            if (resetCachedDisplayValues == true) {
                this.options.OnResizeDisplayValues = null;
            }

            //initializeTheLogon(); // This displays the jquery dialog.

            var html = '';
            //debugger;
            if (this.options.OnResizeDisplayValues != null && this.options.OnResizeDisplayValues.Html) {
                html = this.options.OnResizeDisplayValues.Html;
                //debugger;
                //var divCircleDialog1 = document.getElementById('divCircleDialog1');
                var divCircleDialogId = 'divCircleDialog_' + this.options.elementIdSuffix;
                var divCircleDialog1 = document.getElementById(divCircleDialogId);
                divCircleDialog1.innerHTML = html;

                //document.getElementById('spanSelectedRolesInRolePickerDropdown').innerHTML = selectedRolesHtml; // Display the selected roles.

                var identityJson = {
                    bwParticipantId: participantId,
                    bwParticipantFriendlyName: participantFriendlyName,
                    bwParticipantEmail: participantEmail
                };

                this.drawCircle(divCircleDialog1, 'images/userimage.png', 512, 512, true, identityJson);
                //var displayValues = {
                //    DrawCircleDialog: true,
                //    DisplayMethod: 'displayParticipantRoleMultiPickerInACircle',
                //    Image: {
                //        Path: 'images/userimage.png',
                //        Width: 512,
                //        Height: 512
                //    },
                //    Html: html
                //};
                //thiz.options.OnResizeDisplayValues = displayValues;

                var canvas = document.getElementById("myCanvas");
                canvas.style.cursor = 'pointer';
                canvas.onclick = function (e) {
                    console.log('CLEAN UP bwCircleDialog! Figure out where the user clicked and respond accordingly. :D');
                    //this.hideCircleDialog(); // CLOSE THE WHOLE THING!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! THIS AINT PERFECT, NEEDS WORK!
                    $('.bwCircleDialog').bwCircleDialog('hideAndDestroyCircleDialog');
                };

            } else {


                var html = '';




















                //html += '<div style="display:none;" id="AccountDetailsDialog">';
                html += '            <table style="width:100%;">';
                html += '                <tr>';
                html += '                    <td style="width:90%;">';
                html += '                        <span id="spanAccountDetailsDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;font-weight:bold;"></span>';
                html += '                    </td>';
                html += '                    <td style="width:9%;"></td>';
                html += '                    <td style="width:1%;cursor:pointer;vertical-align:top;">';
                html += '                        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 30pt;font-weight:bold;" onclick="$(\'.bwCircleDialog\').bwCircleDialog(\'hideCircleDialog\');">X</span>';
                html += '                    </td>';
                html += '                </tr>';
                html += '            </table>';
                html += '            <br />';
                html += '            <!--<span id="spanAccountDetailsDialogDetails"></span>-->';
                html += '            <!--<input id="txtPeoplePickerDialogSearchBox" title="Type the first name and select from the list below..." style="WIDTH: 85%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;TEXT-ALIGN: left;" /><input id="txtPeoplePickerDialogParticipantId" style="display:none;" /><input id="txtPeoplePickerDialogParticipantEmail" style="display:none;" />';
                html += '            <img src="images/magnifying-glass.jpg" style="width:25px;height:25px;" />';
                html += '            <hr />';
                html += '            <span id="spanPeoplePickerParticipantsList"></span>-->';
                html += '';
                html += '            <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
                html += '            <span style="font-family: calibri;">Name</span>';
                html += '            <br />';
                html += '            <input type="text" id="txtUserOptionsFriendlyName" style="WIDTH: 93%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" />';
                html += '            <br /><br />';
                html += '            <span style="font-family: calibri;">Email</span>';
                html += '            <br />';
                html += '            <input type="text" id="txtUserOptionsEmail" style="WIDTH: 93%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" />';
                html += '        <br /><br />';


                //html += 'xcx984375xcx'; // 4-19-2020. Add login "Remember me" checkbox.
                var zoom = 1.25;


                html += '            <br />';
                html += '            <div class="divSignInButton" style="width:90%;text-align:center;line-height:0.8em;font-weight:bold;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'cmdSaveUserOptions_ADMIN\', \'' + participantId + '\');">';
                html += '                Save';
                html += '            </div>';
                //debugger;
                //html += '            <br />';
                //html += '            <div class="divSignInButton" style="width:90%;text-align:center;line-height:0.8em;font-weight:bold;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'cmdSignOut\');">';
                //html += '                Sign out';
                //html += '            </div>';

                html += '            <br />';
                html += '            <div class="divSignInButton" style="width:90%;text-align:center;line-height:0.8em;font-weight:bold;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayResetPasswordDialog\', \'' + participantEmail + '\');">';
                html += '                Reset Password';
                html += '            </div>';

                html += '            <br />';
                html += '            <div class="divSignInButton" style="width:90%;text-align:center;line-height:0.8em;font-weight:bold;" onclick="$(\'.bwCircleDialog\').bwCircleDialog(\'hideCircleDialog\');">';
                html += '                Close';
                html += '            </div>';
                html += '            <br /><br />';
                //html += '        </div>';


                //var divParticipantSummaryDialog = document.getElementById('divParticipantSummaryDialog');
                //divParticipantSummaryDialog.innerHTML = html;





                var divCircleDialogId = 'divCircleDialog_' + this.options.elementIdSuffix;
                var divCircleDialog1 = document.getElementById(divCircleDialogId); //'divCircleDialog1');
                divCircleDialog1.innerHTML = html; // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> why is divCircleDialog1 undefined?      This method: displaySpecifiedUserProfileEditingInACircle


                //var divCircleDialog1 = $('#divCircleDialog').find('#divCircleDialog1')[0].html(html); // = html;; // 12-3-2021


                /////////////////////////// ALSO LOOK AT bwAuthentication.js.displayLoggedInUserDropDownInACircle(). <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<






                // Hide the title bar.
                //$("#AccountDetailsDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
                debugger;
                // Set the title.
                //document.getElementById('spanAccountDetailsDialogTitle').innerHTML = 'Update account details for ' + participantFriendlyName + '.<br /><span style="font-size:15pt;color:tomato;">Logon provider: ' + participantLogonType + '</span>';
                document.getElementById('spanAccountDetailsDialogTitle').innerHTML = 'Update account details for ' + participantFriendlyName + '.<br /><span style="font-size:15pt;color:tomato;"></span>'; // 2-1-2022



                $('#txtUserOptionsFriendlyName').val(participantFriendlyName);
                $('#txtUserOptionsEmail').val(participantEmail);



                //document.getElementById('spanSelectedRolesInRolePickerDropdown').innerHTML = selectedRolesHtml; // Display the selected roles.
                var identityJson = {
                    bwParticipantId: participantId,
                    bwParticipantFriendlyName: participantFriendlyName,
                    bwParticipantEmail: participantEmail
                };

                thiz.drawCircle(divCircleDialog1, 'images/userimage.png', 512, 512, true, identityJson);
                var displayValues = {
                    DrawCircleDialog: true,
                    DisplayMethod: 'displaySpecifiedUserProfileEditingInACircle', //'displayParticipantRoleMultiPickerInACircle',
                    Image: {
                        Path: 'images/userimage.png',
                        Width: 512,
                        Height: 512
                    },
                    Html: divCircleDialog1.innerHTML
                };
                thiz.options.OnResizeDisplayValues = displayValues;
                //debugger;
                var canvas = document.getElementById("myCanvas");
                canvas.style.cursor = 'pointer';
                canvas.onclick = function (e) {
                    console.log('CLEAN UP bwCircleDialog! Figure out where the user clicked and respond accordingly. :D');
                    //this.hideCircleDialog(); // CLOSE THE WHOLE THING!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! THIS AINT PERFECT, NEEDS WORK!
                    $('.bwCircleDialog').bwCircleDialog('hideAndDestroyCircleDialog');
                };


            }
        } catch (e) {
            console.log('Exception in bwCircleDialog.displaySpecifiedUserProfileEditingInACircle(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwCircleDialog.displaySpecifiedUserProfileEditingInACircle(): ' + e.message + ', ' + e.stack);
        }
    },







    displaySpecifiedUserDropDownInACircle: function (resetCachedDisplayValues, participantId, participantFriendlyName, participantEmail, bwParticipantRole, participantLogonType) {
        try {
            console.log('In displaySpecifiedUserDropDownInACircle().');
            alert('In displaySpecifiedUserDropDownInACircle(). This functionality is incomplete. Coming soon!');
            var thiz = this;
            this.hideCircleDialog(); // Make sure any existing one is closed first.


            //var tenantId = $('.bwAuthentication').bwAuthentication('option', 'tenantId');
            //var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            //var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            //var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
            //var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');
            //var participantLogonType = $('.bwAuthentication').bwAuthentication('option', 'participantLogonType');


            //try {
            //    $("#divCustomLogonDialog").dialog('close');
            //} catch (e) { }
            //try {
            //    $("#divCustomSignUpDialog").dialog('close');
            //} catch (e) { }
            //try {
            //    $("#divCustomLogonResetPasswordDialog").dialog('close');
            //} catch (e) { }
            //try {
            //    $("#divCustomLogonResetPasswordConfirmationDialog").dialog('close');
            //} catch (e) {
            //}

            if (resetCachedDisplayValues == true) {
                this.options.OnResizeDisplayValues = null;
            }

            //initializeTheLogon(); // This displays the jquery dialog.

            var html = '';
            //debugger;
            //if (this.options.OnResizeDisplayValues != null && this.options.OnResizeDisplayValues.Html) {
            //html = this.options.OnResizeDisplayValues.Html;
            //debugger;
            //var divCircleDialog1 = document.getElementById('divCircleDialog1');
            ////divCircleDialog1.innerHTML = html;

            ////document.getElementById('spanSelectedRolesInRolePickerDropdown').innerHTML = selectedRolesHtml; // Display the selected roles.

            //var identityJson = {
            //    bwParticipantId: participantId,
            //    bwParticipantFriendlyName: participantFriendlyName,
            //    bwParticipantEmail: participantEmail
            //};

            //this.drawCircle(divCircleDialog1, 'images/userimage.png', 512, 512, true, identityJson);
            ////var displayValues = {
            ////    DrawCircleDialog: true,
            ////    DisplayMethod: 'displayParticipantRoleMultiPickerInACircle',
            ////    Image: {
            ////        Path: 'images/userimage.png',
            ////        Width: 512,
            ////        Height: 512
            ////    },
            ////    Html: html
            ////};
            ////thiz.options.OnResizeDisplayValues = displayValues;

            //var canvas = document.getElementById("myCanvas");
            //canvas.style.cursor = 'pointer';
            //canvas.onclick = function (e) {
            //    console.log('CLEAN UP bwCircleDialog! Figure out where the user clicked and respond accordingly. :D');
            //    //this.hideCircleDialog(); // CLOSE THE WHOLE THING!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! THIS AINT PERFECT, NEEDS WORK!
            //    $('.bwCircleDialog').bwCircleDialog('hideAndDestroyCircleDialog');
            //};

            //} else {
            //$.ajax({
            //    url: this.options.operationUriPrefix + "odata/Roles/" + workflowAppId + "/" + participantId,
            //    dataType: "json",
            //    contentType: "application/json",
            //    type: "Get",
            //    timeout: ajaxTimeout
            //}).done(function (result) {
            //    try {
            //if (result.message.indexOf('RETURNING NO WORKFLOW') > -1) {
            //    // Must be a new tenant, because there is no workflow yet. We will use the pre-canned one here. Doing this on the client side.

            //}
            //console.log('In my.js.displayRoleMultiPicker().Get[odata/Roles].done: result.userRoles: ' + JSON.stringify(result.userRoles));
            //
            //debugger;
            //var car = result.workflow;
            ////
            ////debugger;
            //var roles;
            //if (result) {
            //    roles = result.userRoles;
            //} else {
            //    console.log('In displaySpecifiedUserDropDownInACircle my.js.displayRoleMultiPicker().Get[odata/Roles].done: result: bad identifier here, please reword.. ' + JSON.stringify(result));
            //}


            var html = '';

            //html += '<div style="display:none;" id="AccountDetailsDialog">';
            html += '            <table style="width:100%;">';
            html += '                <tr>';
            html += '                    <td style="width:90%;">';
            html += '                        <span id="spanAccountDetailsDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;font-weight:bold;"></span>';
            html += '                    </td>';
            html += '                    <td style="width:9%;"></td>';
            html += '                    <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '                        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 30pt;font-weight:bold;" onclick="$(\'.bwCircleDialog\').bwCircleDialog(\'hideCircleDialog\');">X</span>';
            html += '                    </td>';
            html += '                </tr>';
            html += '            </table>';
            html += '            <br />';
            html += '            <!--<span id="spanAccountDetailsDialogDetails"></span>-->';
            html += '            <!--<input id="txtPeoplePickerDialogSearchBox" title="Type the first name and select from the list below..." style="WIDTH: 85%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;TEXT-ALIGN: left;" /><input id="txtPeoplePickerDialogParticipantId" style="display:none;" /><input id="txtPeoplePickerDialogParticipantEmail" style="display:none;" />';
            html += '            <img src="images/magnifying-glass.jpg" style="width:25px;height:25px;" />';
            html += '            <hr />';
            html += '            <span id="spanPeoplePickerParticipantsList"></span>-->';
            html += '';
            html += '            <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
            html += '            <span style="font-family: calibri;">Name</span>';
            html += '            <br />';
            html += '            <input type="text" id="txtUserOptionsFriendlyName" style="WIDTH: 93%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" />';
            html += '            <br /><br />';
            html += '            <span style="font-family: calibri;">Email</span>';
            html += '            <br />';
            html += '            <input type="text" id="txtUserOptionsEmail" style="WIDTH: 93%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" />';
            html += '        <br /><br />';

            //html += 'xcx984375xcx'; // 4-19-2020. Add login "Remember me" checkbox.
            var zoom = 1.25;
            html += '<table style="width:100%;">';
            html += '<tr>';
            html += '<td style="text-align:right;">';
            html += '   <span style="cursor:help;color:gray;" title="Auto-logon with local storage. Your logon information gets saved in local storage so that you aren\'t subsequently prompted to logon." >';
            html += '        <input onclick="$(\'.bwAuthentication\').bwAuthentication(\'changeRememberMeCheckboxSetting_OnClick\');" id="cbCustomLogonRememberMe" type="checkbox" style="cursor:pointer;zoom: ' + zoom + ';transform: scale(' + zoom + ');-ms-transform: scale(' + zoom + ');-webkit-transform: scale(' + zoom + ');-o-transform: scale(' + zoom + ');-moz-transform: scale(' + zoom + ');transform-origin: 0 0;-ms-transform-origin: 0 0;-webkit-transform-origin: 0 0;-o-transform-origin: 0 0;-moz-transform-origin: 0 0;" checked />';
            html += '        &nbsp;Remember me';
            html += '   </span>';
            //html += '        <br />';
            //html += '        <br />';
            html += '</td>';
            html += '</tr>';
            html += '</table>';


            html += '            <br />';
            html += '            <div class="divSignInButton" style="width:90%;text-align:center;line-height:0.8em;font-weight:bold;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'cmdSaveUserOptions\');">';
            html += '                Save';
            html += '            </div>';
            //debugger;
            html += '            <br />';
            html += '            <div class="divSignInButton" style="width:90%;text-align:center;line-height:0.8em;font-weight:bold;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'cmdSignOut\');">';
            html += '                Sign out';
            html += '            </div>';

            html += '            <br />';
            html += '            <div class="divSignInButton" style="width:90%;text-align:center;line-height:0.8em;font-weight:bold;" onclick="$(\'.bwCircleDialog\').bwCircleDialog(\'hideCircleDialog\');">';
            html += '                Close';
            html += '            </div>';
            html += '            <br /><br />';
            //html += '        </div>';


            //var divParticipantSummaryDialog = document.getElementById('divParticipantSummaryDialog');
            //divParticipantSummaryDialog.innerHTML = html;
            //var divCircleDialog1 = document.getElementById('divCircleDialog1');
            //divCircleDialog1.innerHTML = html;

            var divCircleDialog1 = $('#divCircleDialog').find('#divCircleDialog1')[0].html(html); // = html;; // 12-3-2021
            //$(divCircleDialog1).innerHTML = html;

            // Hide the title bar.
            //$("#AccountDetailsDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
            debugger;
            // Set the title.
            document.getElementById('spanAccountDetailsDialogTitle').innerHTML = 'Update account details for ' + participantFriendlyName + '.<br /><span style="font-size:15pt;color:tomato;">Logon provider: ' + participantLogonType + '</span>';



            $('#txtUserOptionsFriendlyName').val(participantFriendlyName);
            $('#txtUserOptionsEmail').val(participantEmail);



            //document.getElementById('spanSelectedRolesInRolePickerDropdown').innerHTML = selectedRolesHtml; // Display the selected roles.
            var identityJson = {
                bwParticipantId: participantId,
                bwParticipantFriendlyName: participantFriendlyName,
                bwParticipantEmail: participantEmail
            };

            thiz.drawCircle(divCircleDialog1, 'images/userimage.png', 512, 512, true, identityJson);
            var displayValues = {
                DrawCircleDialog: true,
                DisplayMethod: 'displayParticipantRoleMultiPickerInACircle',
                Image: {
                    Path: 'images/userimage.png',
                    Width: 512,
                    Height: 512
                },
                Html: divCircleDialog1.innerHTML
            };
            thiz.options.OnResizeDisplayValues = displayValues;
            //debugger;
            var canvas = document.getElementById("myCanvas");
            canvas.style.cursor = 'pointer';
            canvas.onclick = function (e) {
                console.log('CLEAN UP bwCircleDialog! Figure out where the user clicked and respond accordingly. :D');
                //this.hideCircleDialog(); // CLOSE THE WHOLE THING!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! THIS AINT PERFECT, NEEDS WORK!
                $('.bwCircleDialog').bwCircleDialog('hideAndDestroyCircleDialog');
            };

            //    } catch (e) {
            //        console.log('Exception in raci.html.displaySpecifiedUserDropDownInACircle().Get[odata/Orgs].done: ' + e.message + ', ' + e.stack);
            //    }
            //}).fail(function (data) {
            //    var msg;
            //    if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
            //        msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
            //    } else {
            //        msg = JSON.stringify(data);
            //    }
            //    alert('Error in raci.html.displaySpecifiedUserDropDownInACircle().Get[odata/Orgs].fail: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
            //    console.log('Error in raci.html.displaySpecifiedUserDropDownInACircle().Get[odata/Orgs].fail:' + JSON.stringify(data));
            //    //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
            //    //var error = JSON.parse(data.responseText)["odata.error"];
            //    //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
            //});
            //}



        } catch (e) {
            console.log('Exception in bwCircleDialog.displaySpecifiedUserDropDownInACircle(): ' + e.message + ', ' + e.stack);
        }
    },
    displayAddANewPersonInACircle: function (resetCachedDisplayValues) {
        try {
            console.log('In displayAddANewPersonInACircle().');
            var thiz = this;

            window.scrollTo(0, 0); // Scroll to top on button click. This makes sure things render Ok, and also just seems like a nicer user experience.
            $('.bwActiveMenu').bwActiveMenu('adjustLeftSideMenu'); // This makes sure our new stretchy-left-menu redraws Ok.

            this.hideCircleDialog(); // Make sure any existing one is closed first.

            //try {
            //    $("#divCustomLogonDialog").dialog('close');
            //} catch (e) { }
            //try {
            //    $("#divCustomSignUpDialog").dialog('close');
            //} catch (e) { }
            //try {
            //    $("#divCustomLogonResetPasswordDialog").dialog('close');
            //} catch (e) { }
            //try {
            //    $("#divCustomLogonResetPasswordConfirmationDialog").dialog('close');
            //} catch (e) {
            //}

            if (resetCachedDisplayValues == true) {
                this.options.OnResizeDisplayValues = null;
            }

            //initializeTheLogon(); // This displays the jquery dialog.

            //var html = '';
            //$.ajax({
            //    url: this.options.operationUriPrefix + "odata/Roles/" + workflowAppId + "/" + bwParticipantId,
            //    dataType: "json",
            //    contentType: "application/json",
            //    type: "Get",
            //    timeout: ajaxTimeout
            //}).done(function (result) {
            //    try {
            //if (result.message.indexOf('RETURNING NO WORKFLOW') > -1) {
            //    // Must be a new tenant, because there is no workflow yet. We will use the pre-canned one here. Doing this on the client side.

            var html = '';
            if (this.options.OnResizeDisplayValues != null && this.options.OnResizeDisplayValues.Html) {
                html = this.options.OnResizeDisplayValues.Html;
            } else {

                html += '<div id="divAddANewPersonDialog">';
                html += '        <table style="width:100%;">';
                html += '            <tr>';
                html += '                <td style="width:90%;">';
                html += '                    <span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;font-weight:bold;">Add a new person</span>';
                html += '                </td>';
                html += '                <td style="width:9%;"></td>';
                html += '                <td style="width:1%;cursor:pointer;vertical-align:top;">';
                html += '                    <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 30pt;font-weight:bold;" onclick="$(\'.bwCircleDialog\').bwCircleDialog(\'hideCircleDialog\');">X</span>';
                html += '                </td>';
                html += '            </tr>';
                html += '        </table>';
                html += '        <br />';
                html += '        <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
                html += '        <span id="spanAddANewPersonDialogInvitationDescriptionText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 20pt;"></span>';
                html += '        <span style="font-family: calibri;">Name</span><br />';
                html += '        <input type="text" autocomplete="off" id="txtAddANewPersonDialogFriendlyName" style="WIDTH: 95%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" /><br /><br />';
                html += '        <span style="font-family: calibri;">Email address</span><br />';
                html += '        <input type="text" autocomplete="off" id="txtAddANewPersonDialogEmail" style="WIDTH: 95%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" /><br /><br />';
                html += '        <span style="font-family: calibri;">Choose a password (4-15 characters)</span><br />';
                html += '        <input type="password" autocomplete="off" onkeydown="return carriagereturnpress(event, \'newUserProvisioning_Custom\');" id="txtAddANewPersonDialogPassword" style="WIDTH: 95%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" /><br />';
                html += '        <!--<input type="checkbox" />Remember me on this device.&nbsp;<a href="">?</a><br />-->';


                // 9-6-2022
                html += '       <br />';
                html += '       <span style="font-family: calibri;">Select a security role</span><br />';
                html += '       <select id="selectAddANewPersonDialogRole" style="WIDTH: 95%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;">';
                html += '           <option value="customer">Customer</option>';
                html += '           <option value="vendor">Vendor</option>';
                html += '           <option value="participant" selected>Participant</option>';
                html += '           <option value="archiveviewer">Archive Viewer</option>';
                html += '           <option value="reportviewer">Report Viewer</option>';
                html += '           <option value="configurationmanager">Configuration Manager</option>';
                html += '       </select>';

                html += '       <br />';
                html += '       <br />';
                html += '       <span style="white-space:nowrap;font-family: calibri;"><input type="checkbox" autocomplete="off" id="txtAddANewPersonDialogFriendlyNamexxx" onchange="alert(\'This functionality is incomplete. Coming soon!\');" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;transform:scale(1.75);" />';
                html += '           Require that they change their password when they login.';
                html += '       </span>';

                html += '       <br />';
                html += '       <br />';
                html += '       <span style="white-space:nowrap;font-family: calibri;"><input type="checkbox" autocomplete="off" id="txtAddANewPersonDialogFriendlyName" onchange="alert(\'This functionality is incomplete. Coming soon!\');" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;transform:scale(1.75);" />';
                html += '           Send an email notification.';
                //html += '           <br />You can include an additional message as well.';
                html += '       </span>';
                //html += '       <span style="white-space:nowrap;">';
                //html += '           Otherwise, you will have to let them know they have been added.';
                //html += '       </span>';

                html += '       <br /><br />';
                //html += '        <div class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" onclick="$(\'.bwCoreComponent\').bwCoreComponent(\'addNewPersonAndSendEmailNotification\');">';
                html += '       <div class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'addAUserToThisOrganization\');">';
                html += '           Add the person';
                html += '       </div>';





                html += '       <br />';
                //html += '       <span style="font-family: calibri;font-style:italic;">Alternatively, you can send them an invitation link:</span>';
                html += '       <span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 20pt;font-weight:bold;">Alternatively, you can send them an invitation:</span>';
                html += '        <br /><br />';
                html += '        <div id="xxxx" class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" onclick="$(\'.bwInvitation\').bwInvitation(\'inviteNewParticipant\');">'; //$(\'.bwAuthentication\').bwAuthentication(\'inviteNewParticipant\');">';
                html += '            Generate a new invitation link';
                html += '        </div>';








                html += '        <!--<br />';
                html += '        <span style="font-family: calibri;font-style:italic;">Already have an account?</span>-->';

                html += '        <br /><br />';
                //html += '        <div class="divSignInButton" style="width: 90%; text-align: center; line-height: 1.1em; font-weight: bold;" onclick="$(\'.bwCoreComponent\').bwCoreComponent(\'addNewPersonAndSendEmailNotification\');">';
                //html += '            Add the person and notify via email';
                //html += '        </div>';

                html += '        <br /><br />';
                html += '        <!--<span style="font-family: calibri;font-style:italic;"><a href="https://budgetworkflow.com">Go back to the home page.</a></span><br /><br />-->';
                html += '    </div>';

            }




            //var divCircleDialog1 = document.getElementById('divCircleDialog1');
            //divCircleDialog1.innerHTML = html;
            var dialogElementId = $('.bwCircleDialog').bwCircleDialog('option', 'dialogElementId'); // >>>> STEP1: The bwCircleDialog widget manages this, so it always knows how to find it in the DOM.
            //if ($('#' + dialogElementId).dialog('instance')) {
            //    $('#' + dialogElementId).dialog('close'); // We make sure we start with a new one!
            //}
            //
            // >>>> THIS IS HOW WE should be displaying all of our circle dialogs.
            //
            $('#' + dialogElementId).html(html); // >>>> STEP2: Assign the element all of the html.
            $('#' + dialogElementId).dialog({ // >>>> STEP3: Display the dialog.
                modal: false,
                resizable: false,
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                width: '550',
                dialogClass: 'no-close', // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                position: {
                    my: 'center top', at: 'center top+150', of: window
                },
                close: function () {
                    $('#' + dialogElementId).dialog('destroy');
                },
                open: function () {
                    try {
                        $('.bwCircleDialog').bwCircleDialog('displayDialog'); // >>>> STEP 4: Display the circle dialog.

                        //$('#txtCustomLogonEmail').val(username);
                        //$('#txtCustomLogonPassword').val(password); // txtAddANewPersonDialogEmail, txtAddANewPersonDialogPassword
                        //if (rememberme == 'selected') {
                        //    // This auto-logs in the user.
                        //    thiz.logonWith_BudgetWorkflow_SwitchToDesktopVersion();
                        //} else {
                        //    document.getElementById('cbCustomLogonRememberMe').checked = false;
                        //}
                        //alert('CLEARING xcx213124');
                        //$('#txtAddANewPersonDialogEmail').val('');
                        //$('#txtAddANewPersonDialogPassword').val('');

                    } catch (e) {
                        console.log('Exception in bwCircleDialog.displayAddANewPersonInACircle():2: ' + e.message + ', ' + e.stack); // Change to bwAuthentication <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< 5-7-2022
                        displayAlertDialog('Exception in bwCircleDialog.displayAddANewPersonInACircle():2: ' + e.message + ', ' + e.stack);
                    }
                }
            });
            //$('#' + dialogElementId).dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();


            this.drawCircle(dialogElementId, 'images/userimage.png', 512, 512, false); // This is false so that we don't allow the user to add a participant image here. It is because the bwParticipantId has not yet been issued. Perhaps we can address this in the future but it may require quite a bit of restructuring? 1-24-2020 
            var displayValues = {
                DrawCircleDialog: true,
                DisplayMethod: 'displayAddANewPersonInACircle',
                Image: {
                    Path: 'images/userimage.png',
                    Width: 512,
                    Height: 512
                },
                Html: document.getElementById(dialogElementId).innerHTML
            };
            this.options.OnResizeDisplayValues = displayValues;

            var canvas = document.getElementById("myCanvas");
            canvas.style.cursor = 'pointer';
            canvas.onclick = function (e) {
                console.log('CLEAN UP bwCircleDialog! Figure out where the user clicked and respond accordingly. :D');
                //this.hideCircleDialog(); // CLOSE THE WHOLE THING!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! THIS AINT PERFECT, NEEDS WORK!
                $('.bwCircleDialog').bwCircleDialog('hideAndDestroyCircleDialog');
            };

        } catch (e) {
            console.log('Exception in bwCircleDialog.displayAddANewPersonInACircle(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwCircleDialog.displayAddANewPersonInACircle(): ' + e.message + ', ' + e.stack);
        }
    },
    displayAddANewEmailRecipientInACircle: function (resetCachedDisplayValues, bwBudgetRequestId) {
        try {
            console.log('In displayAddANewEmailRecipientInACircle().');
            var thiz = this;

            this.hideCircleDialog(); // Make sure any existing one is closed first.

            window.scrollTo(0, 0);
            $('.bwActiveMenu').bwActiveMenu('adjustLeftSideMenu'); // This makes sure our new stretchy-left-menu redraws Ok.

            //try {
            //    $("#divCustomLogonDialog").dialog('close');
            //} catch (e) { }
            //try {
            //    $("#divCustomSignUpDialog").dialog('close');
            //} catch (e) { }
            //try {
            //    $("#divCustomLogonResetPasswordDialog").dialog('close');
            //} catch (e) { }
            //try {
            //    $("#divCustomLogonResetPasswordConfirmationDialog").dialog('close');
            //} catch (e) {
            //}

            if (resetCachedDisplayValues == true) {
                this.options.OnResizeDisplayValues = null;
            }

            //initializeTheLogon(); // This displays the jquery dialog.

            //var html = '';
            //$.ajax({
            //    url: this.options.operationUriPrefix + "odata/Roles/" + workflowAppId + "/" + bwParticipantId,
            //    dataType: "json",
            //    contentType: "application/json",
            //    type: "Get",
            //    timeout: ajaxTimeout
            //}).done(function (result) {
            //    try {
            //if (result.message.indexOf('RETURNING NO WORKFLOW') > -1) {
            //    // Must be a new tenant, because there is no workflow yet. We will use the pre-canned one here. Doing this on the client side.

            var html = '';
            if (this.options.OnResizeDisplayValues != null && this.options.OnResizeDisplayValues.Html) {
                html = this.options.OnResizeDisplayValues.Html;
            } else {

                html += '<div id="divAddANewEmailRecipientDialog">';
                html += '        <table style="width:100%;">';
                html += '            <tr>';
                html += '                <td style="width:90%;">';
                html += '                    <span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;font-weight:bold;">Add a new email recipient</span>';
                html += '                </td>';
                html += '                <td style="width:9%;"></td>';
                html += '                <td style="width:1%;cursor:pointer;vertical-align:top;">';
                html += '                    <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 30pt;font-weight:bold;" onclick="$(\'.bwCircleDialog\').bwCircleDialog(\'hideCircleDialog\');">X</span>';
                html += '                </td>';
                html += '            </tr>';
                html += '        </table>';
                html += '        <br /><br />';
                html += '        <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
                html += '        <span id="spanAddANewPersonDialogInvitationDescriptionText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 20pt;"></span>';
                html += '        <span style="font-family: calibri;">Name</span><br />';
                html += '        <input type="text" autocomplete="off" id="txtAddANewEmailRecipientDialogFriendlyName" style="WIDTH: 95%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" /><br /><br />';
                html += '        <span style="font-family: calibri;">Email Address</span><br />';
                html += '        <input type="text" autocomplete="off" id="txtAddANewEmailRecipientDialogEmail" style="WIDTH: 95%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" /><br /><br />';
                //html += '        <span style="font-family: calibri;">Choose a password (4-15 characters)xcx3</span><br />';
                //html += '        <input type="password" autocomplete="off" onkeydown="return carriagereturnpress(event, \'newUserProvisioning_Custom\');" id="txtAddANewPersonDialogPassword" style="WIDTH: 95%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" /><br />';
                //html += '        <!--<input type="checkbox" />Remember me on this device.&nbsp;<a href="">?</a><br />-->';

                html += '        <br /><br />';
                html += '        <div class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" onclick="$(\'.bwPeoplePicker_EmailRecipients\').bwPeoplePicker_EmailRecipients(\'saveANewEmailRecipient\', \'' + bwBudgetRequestId + '\');">';
                html += '            Add the email recipient';
                html += '        </div>';

                //html += '        <br />';
                //html += '        <span style="font-family: calibri;font-style:italic;">You will have to let them know they have been added.</span>';





                //html += '        <br /><br />';
                //html += '        <div id="xxxx" class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'inviteNewParticipant\');">';
                //html += '            Generate a new invitation link';
                //html += '        </div>';








                html += '        <!--<br />';
                html += '        <span style="font-family: calibri;font-style:italic;">Already have an account?</span>-->';

                html += '        <br /><br />';
                //html += '        <div class="divSignInButton" style="width: 90%; text-align: center; line-height: 1.1em; font-weight: bold;" onclick="$(\'.bwCoreComponent\').bwCoreComponent(\'addNewPersonAndSendEmailNotification\');">';
                //html += '            Add the person and notify via email';
                //html += '        </div>';

                html += '        <br /><br />';
                html += '        <!--<span style="font-family: calibri;font-style:italic;"><a href="https://budgetworkflow.com">Go back to the home page.</a></span><br /><br />-->';
                html += '    </div>';

            }

            //}









            //var divCircleDialog1 = document.getElementById('divCircleDialog1');
            //divCircleDialog1.innerHTML = html;
            var dialogElementId = $('.bwCircleDialog').bwCircleDialog('option', 'dialogElementId'); // >>>> STEP1: The bwCircleDialog widget manages this, so it always knows how to find it in the DOM.
            //if ($('#' + dialogElementId).dialog('instance')) {
            //    $('#' + dialogElementId).dialog('close'); // We make sure we start with a new one!
            //}
            //
            // >>>> THIS IS HOW WE should be displaying all of our circle dialogs.
            //
            $('#' + dialogElementId).html(html); // >>>> STEP2: Assign the element all of the html.
            $('#' + dialogElementId).dialog({ // >>>> STEP3: Display the dialog.
                modal: false,
                resizable: false,
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                width: '550',
                dialogClass: 'no-close', // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                position: {
                    my: 'center top', at: 'center top+150', of: window
                },
                close: function () {
                    $('#' + dialogElementId).dialog('destroy');
                },
                open: function () {
                    try {
                        $('.bwCircleDialog').bwCircleDialog('displayDialog'); // >>>> STEP 4: Display the circle dialog.

                        //$('#txtCustomLogonEmail').val(username);
                        //$('#txtCustomLogonPassword').val(password);
                        //if (rememberme == 'selected') {
                        //    // This auto-logs in the user.
                        //    thiz.logonWith_BudgetWorkflow_SwitchToDesktopVersion();
                        //} else {
                        //    document.getElementById('cbCustomLogonRememberMe').checked = false;
                        //}
                    } catch (e) {
                        console.log('Exception in bwCircleDialog.displayAddANewEmailRecipientInACircle():2: ' + e.message + ', ' + e.stack); // Change to bwAuthentication <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< 5-7-2022
                        displayAlertDialog('Exception in bwCircleDialog.displayAddANewEmailRecipientInACircle():2: ' + e.message + ', ' + e.stack);
                    }
                }
            });
            //$('#' + dialogElementId).dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();


            this.drawCircle(dialogElementId, 'images/userimage.png', 512, 512, false, null, 102); // Specify zIndex here because it needs to be on top!!!!!!!!! 7-5-2022  // This is false so that we don't allow the user to add a participant image here. It is because the bwParticipantId has not yet been issued. Perhaps we can address this in the future but it may require quite a bit of restructuring? 1-24-2020 
            var displayValues = {
                DrawCircleDialog: true,
                DisplayMethod: 'displayAddANewPersonInACircle',
                Image: {
                    Path: 'images/userimage.png',
                    Width: 512,
                    Height: 512
                },
                Html: document.getElementById(dialogElementId).innerHTML
            };
            this.options.OnResizeDisplayValues = displayValues;

            var canvas = document.getElementById("myCanvas");
            //canvas.style.zIndex = 1000; // Bring it to the front! // 7-5-2022
            canvas.style.cursor = 'pointer';
            canvas.onclick = function (e) {
                console.log('CLEAN UP bwCircleDialog! Figure out where the user clicked and respond accordingly. :D');
                //this.hideCircleDialog(); // CLOSE THE WHOLE THING!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! THIS AINT PERFECT, NEEDS WORK!
                $('.bwCircleDialog').bwCircleDialog('hideAndDestroyCircleDialog');
            };

        } catch (e) {
            console.log('Exception in bwCircleDialog.displayAddANewEmailRecipientInACircle(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwCircleDialog.displayAddANewEmailRecipientInACircle(): ' + e.message + ', ' + e.stack);
        }
    },


    displayOrgRoleEditorInACircle_ByOrgId: function (resetCachedDisplayValues, orgId) {
        try {
            console.log('In displayOrgRoleEditorInACircle_ByOrgId().');
            var thiz = this;

            //var tenantId = $('.bwAuthentication').bwAuthentication('option', 'tenantId');
            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            //var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
            //var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

            //
            // So far the only time this method gets called is when the use is viewing a request, and clicks on the org name in the top right corner.
            // This is done so that the circle dialog shows up on top of the request.
            //$("#divRequestFormDialog").dialog().parents(".ui-dialog")[0].style.zIndex = 10; // THIS IS A HACK NOT THE BEST PLACE FOR THIS >>>>>>>>>>>>>>>>>>>>>>>>>>>> 2-15-2020
            //
            //


            // We have the OrgId, so now we need to find the location in the json tree!
            //debugger;
            $.ajax({
                url: this.options.operationUriPrefix + "odata/Roles/" + workflowAppId + "/" + participantId,
                dataType: "json",
                contentType: "application/json",
                type: "Get",
                timeout: ajaxTimeout
            }).done(function (result) {
                try {
                    var orgRoles;
                    if (result) {
                        roles = result.userRoles;
                        orgRoles = result.orgRoles;
                    } else {
                        console.log('In displayOrgRoleEditorInACircle_ByOrgId.done: result: bad identifier here, please reword.. ' + JSON.stringify(result));
                    }
                    var json = orgRoles;
                    //debugger;
                    var d1, g1, e1, l1;
                    if (orgId == json.Global.Id) {
                        //orgName = json.Global.Name;
                        d1 = 'root';
                        g1 = undefined;
                        e1 = undefined;
                        l1 = undefined;
                        //debugger;
                    } else {
                        for (var d = 0; d < json.Global.Divisions.Items.length; d++) {
                            if (orgId == json.Global.Divisions.Items[d].Id) {
                                //orgName = json.Global.Divisions.Items[d].Name;
                                d1 = d;
                                g1 = undefined;
                                e1 = undefined;
                                l1 = undefined;
                                break;
                            }
                            for (var g = 0; g < json.Global.Divisions.Items[d].Groups.Items.length; g++) {
                                if (orgId == json.Global.Divisions.Items[d].Groups.Items[g].Id) {
                                    //orgName = json.Global.Divisions.Items[d].Groups.Items[g].Name;
                                    d1 = d;
                                    g1 = g;
                                    e1 = undefined;
                                    l1 = undefined;
                                    break;
                                }
                                for (var e = 0; e < json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items.length; e++) {
                                    if (orgId == json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Id) {
                                        //orgName = json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Name;
                                        d1 = d;
                                        g1 = g;
                                        e1 = e;
                                        l1 = undefined;
                                        break;
                                    }
                                    for (var l = 0; l < json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Items.length; l++) {
                                        if (orgId == json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Items[l].Id) {
                                            //orgName = json.Global.Divisions.Items[d].Groups.Items[g].LegalEntities.Items[e].Locations.Items[l].Name;
                                            d1 = d;
                                            g1 = g;
                                            e1 = e;
                                            l1 = l;
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    thiz.displayOrgRoleEditorInACircle(resetCachedDisplayValues, d1, g1, e1, l1);

                } catch (e) {
                    console.log('Exception in displayOrgRoleEditorInACircle_ByOrgId.done: ' + e.message + ', ' + e.stack);
                }
            }).fail(function (data) {
                var msg;
                if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                    msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                } else {
                    msg = JSON.stringify(data);
                }
                alert('Error in displayOrgRoleEditorInACircle_ByOrgId.fail: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                console.log('Error in displayOrgRoleEditorInACircle_ByOrgId.fail:' + JSON.stringify(data));
                //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                //var error = JSON.parse(data.responseText)["odata.error"];
                //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
            });
        } catch (e) {
            console.log('Exception in displayOrgRoleEditorInACircle_ByOrgId(): ' + e.message + ', ' + e.stack);
        }
    },



    // Enabled this method 8-18-2022.
    displayOrgRoleEditorInACircle: function (resetCachedDisplayValues, divisionIndex, groupIndex, entityIndex, locationIndex) {
        try {
            console.log('In bwCircleDialog.js.displayOrgRoleEditorInACircle().');
            alert('In bwCircleDialog.js.displayOrgRoleEditorInACircle().');
            debugger;
            var thiz = this;
            this.hideCircleDialog(); // Make sure any existing one is closed first.

            //var tenantId = $('.bwAuthentication').bwAuthentication('option', 'tenantId');
            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
            var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

            if (resetCachedDisplayValues == true) {
                this.options.OnResizeDisplayValues = null;
            }

            if (this.options.OnResizeDisplayValues != null && this.options.OnResizeDisplayValues.Html) {
                html = this.options.OnResizeDisplayValues.Html;

                var divCircleDialog1 = document.getElementById('divCircleDialog1');
                divCircleDialog1.innerHTML = html;

                thiz.drawCircle(divCircleDialog1, 'images/corporeal.png', 512, 512, true, 'xqxq2');
                var displayValues = {
                    DrawCircleDialog: true,
                    DisplayMethod: 'displayOrgRoleEditorInACircle',
                    Image: {
                        Path: 'images/userimage.png',
                        Width: 512,
                        Height: 512
                    },
                    Html: divCircleDialog1.innerHTML
                };
                thiz.options.OnResizeDisplayValues = displayValues;

                var canvas = document.getElementById("myCanvas");
                canvas.style.cursor = 'pointer';
                canvas.onclick = function (e) {
                    console.log('CLEAN UP bwCircleDialog! Figure out where the user clicked and respond accordingly. :D');
                    thiz.hideAndDestroyOrgEditorInACircle(divisionIndex, groupIndex, entityIndex, locationIndex);
                };
            } else {








                var renderOrgRoleCircleContents = function (json) {
                    var roles, orgId, orgName, orgPath, orgPathClickable;
                    if ((locationIndex || locationIndex > -1) && locationIndex != 'undefined') {
                        roles = json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Items[locationIndex].Roles;
                        orgId = json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Items[locationIndex].Id;
                        orgName = json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Items[locationIndex].Name;
                        orgPath = json.Global.Name + ' > ' + json.Global.Divisions.Items[divisionIndex].Name + ' > ' + json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Name + ' > ' + json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Name + ' > ' + json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Items[locationIndex].Name;
                        orgPathClickable = '<span style="cursor:pointer;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'displayOrgRoleEditorInACircle\', true, \'' + 'root' + '\');">' + json.Global.Name + '</span>' + ' > ' + '<span style="cursor:pointer;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'displayOrgRoleEditorInACircle\', true, \'' + divisionIndex + '\');">' + json.Global.Divisions.Items[divisionIndex].Name + '</span>' + ' > ' + '<span style="cursor:pointer;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'displayOrgRoleEditorInACircle\', true, \'' + divisionIndex + '\', \'' + groupIndex + '\');">' + json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Name + '</span>' + ' > ' + '<span style="cursor:pointer;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'displayOrgRoleEditorInACircle\', true, \'' + divisionIndex + '\', \'' + groupIndex + '\', \'' + entityIndex + '\');">' + json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Name + '</span>' + ' > ' + json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Items[locationIndex].Name;
                    } else if ((entityIndex || entityIndex > -1) && entityIndex != 'undefined') {
                        roles = json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Roles;
                        orgId = json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Id;
                        orgName = json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Name;
                        orgPath = json.Global.Name + ' > ' + json.Global.Divisions.Items[divisionIndex].Name + ' > ' + json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Name + ' > ' + json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Name;
                        orgPathClickable = '<span style="cursor:pointer;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'displayOrgRoleEditorInACircle\', true, \'' + 'root' + '\');">' + json.Global.Name + '</span>' + ' > ' + '<span style="cursor:pointer;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'displayOrgRoleEditorInACircle\', true, \'' + divisionIndex + '\');">' + json.Global.Divisions.Items[divisionIndex].Name + '</span>' + ' > ' + '<span style="cursor:pointer;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'displayOrgRoleEditorInACircle\', true, \'' + divisionIndex + '\', \'' + groupIndex + '\');">' + json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Name + '</span>' + ' > ' + json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Name;
                    } else if ((groupIndex || groupIndex > -1) && groupIndex != 'undefined') {
                        roles = json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Roles;
                        orgId = json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Id;
                        orgName = json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Name;
                        orgPath = json.Global.Name + ' > ' + json.Global.Divisions.Items[divisionIndex].Name + ' > ' + json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Name;
                        orgPathClickable = '<span style="cursor:pointer;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'displayOrgRoleEditorInACircle\', true, \'' + 'root' + '\');">' + json.Global.Name + '</span>' + ' > ' + '<span style="cursor:pointer;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'displayOrgRoleEditorInACircle\', true, \'' + divisionIndex + '\');">' + json.Global.Divisions.Items[divisionIndex].Name + '</span>' + ' > ' + json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].Name;
                    } else if ((divisionIndex || divisionIndex > -1) && divisionIndex != 'undefined') {
                        if (divisionIndex == 'root') {
                            roles = json.Global.Roles;
                            orgId = json.Global.Id;
                            orgName = json.Global.Name;
                            orgPath = json.Global.Name;
                            orgPathClickable = json.Global.Name;
                        } else {
                            roles = json.Global.Divisions.Items[divisionIndex].Roles;
                            orgId = json.Global.Divisions.Items[divisionIndex].Id;
                            orgName = json.Global.Divisions.Items[divisionIndex].Name;
                            orgPath = json.Global.Name + ' > ' + json.Global.Divisions.Items[divisionIndex].Name;
                            orgPathClickable = '<span style="cursor:pointer;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'displayOrgRoleEditorInACircle\', true, \'' + 'root' + '\');">' + json.Global.Name + '</span>' + ' > ' + json.Global.Divisions.Items[divisionIndex].Name;
                        }
                    } else {
                        debugger;
                        alert('Error: Unexpected parameter in displayOrgRoleEditorInACircle():2:.');
                    }
                    var html = '';
                    html += '  <table style="width:100%;">';
                    html += '    <tr>';
                    html += '      <td style="width:90%;">';
                    html += '        <span style="color: #3f3f3f;font-size:30pt;font-weight:bold;">' + orgName;




                    // 9-6-2021
                    //html += '&nbsp;<input type="button" value="Edit division name" onclick="alert(\'This functionality is incomplete. Coming soon! xcx40055544\');" />';


                    html += '</span>';




                    html += '      </td>';
                    html += '      <td style="width:9%;"></td>';
                    html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
                    html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'.bwCircleDialog\').bwCircleDialog(\'hideAndDestroyOrgEditorInACircle\', \'' + divisionIndex + '\', \'' + groupIndex + '\', \'' + entityIndex + '\', \'' + locationIndex + '\');">X</span>';
                    html += '      </td>';
                    html += '    </tr>';
                    html += '  </table>';
                    html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
                    html += '<span id="spanDivRolePickerDropDown_OrgPath" style="color:purple;font-size:15pt;">';
                    // Put a printer icon here!
                    html += '<span style="vertical-align:middle;float:right;" title="print" class="printButton" onclick="$(\'.bwPrintButton\').bwPrintButton(\'PrintPendingTasksReport\');">🖨</span>'; // bwParticipantId, bwParticipantFriendlyName, bwParticipantEmail
                    html += orgPathClickable;
                    html += '</span>';
                    html += '<br />';
                    html += '<br />';
                    html += '<span id="spanSelectedRolesInRolePickerDropdown"></span>';
                    var selectedRolesHtml = '';
                    if (roles && roles.length) {
                        for (var r = 0; r < roles.length; r++) {
                            if (roles[r].ParticipantIsDirty == true && roles[r].ParticipantIsDirtyAction == 'REMOVE') {
                                // Do nothing. Don't display, this is just so that the user org role gets removed when published back to the server.
                                selectedRolesHtml += '<span style="color:tomato;">';
                                selectedRolesHtml += '*ROLE ' + roles[r].RoleName + ' (' + roles[r].RoleId + ') IS PENDING DELETION ON NEXT PUBLISH*';
                                selectedRolesHtml += '</span>';
                                selectedRolesHtml += '<br />';
                            } else {




                                // 1-16-2022
                                if (roles[r].RoleId == 'ADMIN') {
                                    // The ADMIN does not show the address-book/people picker icon here... that can only be done from Configuration > Roles.

                                    // 1-16-2022 I HAVE DECIDED THAT WE DON'T WANT to see the ADMIN displayed here.
                                    //selectedRolesHtml += roles[r].RoleName + ' (' + roles[r].RoleId + ') - ';
                                    //selectedRolesHtml += '<span style="cursor:pointer;color:purple;" title="' + roles[r].ParticipantEmail + '" ';
                                    //selectedRolesHtml += 'onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayParticipantRoleMultiPickerInACircle\', true, \'\', \'' + roles[r].ParticipantId + '\', \'' + roles[r].ParticipantFriendlyName + '\', \'' + roles[r].ParticipantEmail + '\');">';
                                    //selectedRolesHtml += roles[r].ParticipantFriendlyName;
                                    //selectedRolesHtml += '</span>';
                                    //var stepIndex = -1;
                                    //var roleIndex = -1;

                                    //selectedRolesHtml += '<br />';

                                } else {
                                    // This displays a SECOND circle dialog on top of the org one!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! It doesn't work this way yet... come back and see if this is worthwhile etc.
                                    selectedRolesHtml += roles[r].RoleName + ' (' + roles[r].RoleId + ') - ';
                                    selectedRolesHtml += '<span style="cursor:pointer;color:purple;" title="' + roles[r].ParticipantEmail + '" ';
                                    selectedRolesHtml += 'onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayParticipantRoleMultiPickerInACircle\', true, \'\', \'' + roles[r].ParticipantId + '\', \'' + roles[r].ParticipantFriendlyName + '\', \'' + roles[r].ParticipantEmail + '\');">';
                                    selectedRolesHtml += roles[r].ParticipantFriendlyName;
                                    selectedRolesHtml += '</span>';
                                    var stepIndex = -1;
                                    var roleIndex = -1;

                                    var isBusinessModelEditorVisible = $('.bwOrganizationEditor').is(':visible');
                                    if (isBusinessModelEditorVisible) {
                                        // Only show the people picker dialog for the business model editor.
                                        selectedRolesHtml += '&nbsp;<img style="width:18px;height:18px;cursor:pointer;vertical-align:text-bottom;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'displayPeoplePickerDialogForJson\', \'' + roles[r].RoleId + '\', \'' + roles[r].RoleName + '\', \'' + divisionIndex + '\', \'' + groupIndex + '\', \'' + entityIndex + '\', \'' + locationIndex + '\');" src="images/addressbook-icon18x18.png">';
                                    }

                                    selectedRolesHtml += '<br />';
                                }

                            }
                        }
                    } else {
                        selectedRolesHtml += '<span style="color:tomato;">';
                        selectedRolesHtml += '*NO ROLES SPECIFIED FOR THIS ORG*';
                        selectedRolesHtml += '</span>';
                        selectedRolesHtml += '<br />';
                    }

                    html += '<hr style="border-top: 1px dashed #95b1d3;" />'; // border-top: 1px dashed red;

                    var isBusinessModelEditorVisible = $('.bwOrganizationEditor').is(':visible');
                    if (!isBusinessModelEditorVisible) {
                        // The bwOrganizationEditor must not have been initialized yet! this.options.store was null, so go get it from the database.
                        debugger;
                        var divCircleDialog1 = document.getElementById('divCircleDialog1');
                        divCircleDialog1.innerHTML = html;



                        debugger;


























                        document.getElementById('spanSelectedRolesInRolePickerDropdown').innerHTML = selectedRolesHtml; // Display the selected roles.
                        var identityJson = {
                            bwOrgId: orgId,
                            bwOrgName: orgName,
                            bwOrgPath: orgPath
                        };
                        thiz.drawCircle(divCircleDialog1, 'images/corporeal.png', 512, 512, true, identityJson);
                        var displayValues = {
                            DrawCircleDialog: true,
                            DisplayMethod: 'displayOrgRoleEditorInACircle',
                            Image: {
                                Path: 'images/userimage.png',
                                Width: 512,
                                Height: 512
                            },
                            Html: divCircleDialog1.innerHTML
                        };
                        thiz.options.OnResizeDisplayValues = displayValues;
                        var canvas = document.getElementById("myCanvas");
                        canvas.style.cursor = 'pointer';
                        canvas.onclick = function (e) {
                            console.log('CLEAN UP bwCircleDialog! Figure out where the user clicked and respond accordingly. :D');
                            thiz.hideAndDestroyOrgEditorInACircle(divisionIndex, groupIndex, entityIndex, locationIndex);
                        };

                    } else {


                        debugger;

                        html += '<span style="font-style:italic;">Add or remove roles by using the checkboxes:</span><br />';
                        // This should actually be BwRole table!!!!!!!>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                        var json3 = {
                            bwWorkflowAppId: workflowAppId
                        };
                        $.ajax({
                            url: thiz.options.operationUriPrefix + '_bw/bwroles',
                            type: 'POST',
                            contentType: 'application/json',
                            data: JSON.stringify(json3),
                            success: function (result3) {
                                try {
                                    // Iterate through the steps. Then the informs, then the assigns. Make an array of the roles. { RoleId, RoleName }
                                    var workflowRoles = [];
                                    for (var i = 0; i < result3.data.length; i++) {
                                        var isSelected = false;
                                        if (roles) {
                                            for (var r = 0; r < roles.length; r++) {
                                                if (roles[r].RoleId == result3.data[i].RoleId) {
                                                    isSelected = true;
                                                }
                                            }
                                        }
                                        var shouldWeSaveThisRoleToTheArray = true;
                                        for (var x = 0; x < workflowRoles.length; x++) {
                                            if (workflowRoles[x].RoleId == result3.data[i].RoleId) {
                                                // It is already in the array, so don't save it.
                                                shouldWeSaveThisRoleToTheArray = false;
                                            }
                                        }
                                        if (shouldWeSaveThisRoleToTheArray) {
                                            var workflowRole = {
                                                RoleId: result3.data[i].RoleId,
                                                RoleName: result3.data[i].RoleName,
                                                Selected: isSelected
                                            };
                                            workflowRoles.push(workflowRole);
                                        }
                                    }
                                    // Sort alphabetically.
                                    var prop = 'RoleId';
                                    workflowRoles = workflowRoles.sort(function (a, b) {
                                        if (true) { //asc, false for desc.
                                            if (a[prop] > b[prop]) return 1;
                                            if (a[prop] < b[prop]) return -1;
                                            return 0;
                                        } else {
                                            if (b[prop] > a[prop]) return 1;
                                            if (b[prop] < a[prop]) return -1;
                                            return 0;
                                        }
                                    });
                                    // End: Sort alphabetically.
                                    // Iterate through the "workflow" roles and display the ui.
                                    html += '<div id="divRolePickerDropDown_RolesCheckboxes" style="overflow-y:auto;">'; // Scrollable div containing the available roles.
                                    if (workflowRoles.length) {
                                        html += '<table>';
                                        for (var w = 0; w < workflowRoles.length; w++) {

                                            if (workflowRoles[w].RoleId == 'ADMIN') {

                                                // DECIDED NOT TO display ADMIN role here. // 1-16-2022

                                            } else {




                                                html += '<tr class="orgRow">';
                                                var isSelected = false;
                                                if (roles) {
                                                    for (var r = 0; r < roles.length; r++) {
                                                        if (roles[r].ParticipantIsDirty == true && roles[r].ParticipantIsDirtyAction == 'REMOVE') {
                                                            // Do nothing. Don't display, this is just so that the user org role gets removed when published back to the server.
                                                            html += '<span style="color:tomato;">';
                                                            html += '*ROLE ' + roles[r].RoleName + ' (' + roles[r].RoleId + ') IS PENDING DELETION ON NEXT PUBLISH*';
                                                            html += '</span>';
                                                            html += '<br />';
                                                        } else {
                                                            if (roles[r].RoleId == workflowRoles[w].RoleId) {
                                                                isSelected = true;
                                                            }
                                                        }
                                                    }
                                                }
                                                if (isSelected) {
                                                    html += '<td><input id="' + 'orgRoleCheckbox_' + w + '" type="checkbox" checked onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'OrgRoleCheckbox_Onchange\', \'' + 'orgRoleCheckbox_' + w + '\', \'' + workflowRoles[w].RoleId + '\', \'' + workflowRoles[w].RoleName + '\', \'' + divisionIndex + '\', \'' + groupIndex + '\', \'' + entityIndex + '\', \'' + locationIndex + '\');" /></td>';
                                                } else {
                                                    html += '<td><input id="' + 'orgRoleCheckbox_' + w + '" type="checkbox" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'OrgRoleCheckbox_Onchange\', \'' + 'orgRoleCheckbox_' + w + '\', \'' + workflowRoles[w].RoleId + '\', \'' + workflowRoles[w].RoleName + '\', \'' + divisionIndex + '\', \'' + groupIndex + '\', \'' + entityIndex + '\', \'' + locationIndex + '\');" /></td>';
                                                }
                                                html += '<td class="roleId">' + workflowRoles[w].RoleId + '</td>';
                                                html += '<td>&nbsp;</td>';
                                                html += '<td class="roleName">' + workflowRoles[w].RoleName + '</td>';
                                                html += '</tr>';
                                            }





                                        }
                                        html += '</table>';
                                    } else {
                                        html += '<br /><span style="color:tomato;">Error: No workflow roles to display.xcx2</span><br />';
                                    }
                                    html += '</div>';
                                    html += '<br />';
                                    //html += '&nbsp;<input style="padding:5px 10px 5px 10px;" id="btnCreateRole2" type="button" value="Edit Roles..." onclick="$(\'.bwCoreComponent\').bwCoreComponent(\'displayEditRolesDialog\');" />';
                                    ////
                                    //// This determines which button will be displayed... Add or Edit, etc.
                                    ////
                                    //if (locationIndex || locationIndex > -1) {
                                    //    html += '  <span style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;white-space:nowrap;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'editLocation\', \'' + divisionIndex + '\', \'' + groupIndex + '\', \'' + entityIndex + '\', \'' + locationIndex + '\');">✎<span style="text-decoration:underline;white-space:nowrap;">Edit</span></span>';
                                    //} else if (entityIndex || entityIndex > -1) {
                                    //    html += '  <span style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'editLegalEntity\', \'' + divisionIndex + '\', \'' + groupIndex + '\', \'' + entityIndex + '\');">✎<span style="text-decoration:underline;">Edit</span></span>';
                                    //} else if (groupIndex || groupIndex > -1) {
                                    //    html += '  <span style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'editGroup\', \'' + divisionIndex + '\', \'' + groupIndex + '\');">✎<span style="text-decoration:underline;">Edit</span></span>';
                                    //} else if (divisionIndex || divisionIndex > -1) {



                                    //if (divisionIndex == 'root') {
                                    //    html += '&nbsp;<span title="Add a Division..." id="divisionsRootNode" style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;text-decoration:underline;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'addADivision\');"> ✚ Add a new Division</span>';

                                    //    //        // Add an Edit button here so that the user can rename the root org!
                                    //    html += '  <span style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'editRootOrg\');">✎<span style="text-decoration:underline;">Edit</span></span>';
                                    //} else {
                                    //    html += '  <span style="cursor:pointer;color:tomato;font-size:smaller;border:1px solid goldenrod;padding:3px 13px 5px 13px;" onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'editDivision\', \'' + divisionIndex + '\');">✎<span style="text-decoration:underline;">Edit</span></span>';
                                    //}



                                    //} else {
                                    debugger;
                                    //    alert('Error: Unexpected parameter in displayOrgRoleEditorInACircle():3:.');
                                    //}
                                    var divCircleDialog1 = document.getElementById('divCircleDialog1');
                                    divCircleDialog1.innerHTML = html;
                                    document.getElementById('spanSelectedRolesInRolePickerDropdown').innerHTML = selectedRolesHtml; // Display the selected roles.
                                    var identityJson = {
                                        bwOrgId: orgId,
                                        bwOrgName: orgName,
                                        bwOrgPath: orgPath
                                    };
                                    thiz.drawCircle(divCircleDialog1, 'images/corporeal.png', 512, 512, true, identityJson);
                                    var displayValues = {
                                        DrawCircleDialog: true,
                                        DisplayMethod: 'displayOrgRoleEditorInACircle',
                                        Image: {
                                            Path: 'images/userimage.png',
                                            Width: 512,
                                            Height: 512
                                        },
                                        Html: divCircleDialog1.innerHTML
                                    };
                                    thiz.options.OnResizeDisplayValues = displayValues;
                                    var canvas = document.getElementById("myCanvas");
                                    canvas.style.cursor = 'pointer';
                                    canvas.onclick = function (e) {
                                        console.log('CLEAN UP bwCircleDialog! Figure out where the user clicked and respond accordingly. :D');
                                        thiz.hideAndDestroyOrgEditorInACircle(divisionIndex, groupIndex, entityIndex, locationIndex);
                                    };
                                } catch (e) {
                                    console.log('Exception in bwOrganizationEditor.js.displayOrgRoleEditorInACircle().Get[odata/Orgs].done: ' + e.message + ', ' + e.stack);
                                    displayAlertDialog('Exception in bwOrganizationEditor.js.displayOrgRoleEditorInACircle().Get[odata/Orgs].done: ' + e.message + ', ' + e.stack);
                                }

                            },
                            error: function (data, errorCode, errorMessage) {
                                console.log('Error in displayOrgRoleEditorInACircle(' + '' + '):2:' + errorCode + ', ' + errorMessage);
                                displayAlertDialog('Error in displayOrgRoleEditorInACircle(' + '' + '):2:' + errorCode + ', ' + errorMessage);
                            }
                        });

                    }
























                }

                //
                // DISPLAY THE ROLES INCLUDED IN THE JSON 
                //
                var json = $('.bwOrganizationEditor').bwOrganizationEditor('getDatastore');
                if (json.Global) {

                    renderOrgRoleCircleContents(json);

                } else {




                    alert('xcx444532 calling GET odata/OrgRolesConfiguration().');


                    // The bwOrganizationEditor must not have been initialized yet! this.options.store was null, so go get it from the database.
                    $.ajax({
                        url: this.options.operationUriPrefix + "odata/OrgRolesConfiguration/" + workflowAppId + "/true", //?$filter=Active eq true", //('eCarWorkflow')", // Get the eCarWorkflow json/definition from the database.
                        dataType: "json",
                        contentType: "application/json",
                        type: "Get"
                    }).done(function (result) {
                        try {
                            var orgRoles;
                            if (!participantId) {
                                // The user is not logged in.
                                console.log('The user is not logged in, so displaying the default WorkflowEditor.');
                                orgRoles = result.value[0].ConfigurationValues; // Works when the user is not logged in.  
                            } else {
                                // The user is logged in.
                                orgRoles = result.value; // Works when the user is logged in.
                            }
                            if (!orgRoles.Global) {
                                var x = {
                                    Global: orgRoles
                                };
                                orgRoles = JSON.parse(JSON.stringify(x));
                            }
                            var json = {
                                Global: orgRoles.Global
                            }

                            renderOrgRoleCircleContents(json);

                        } catch (e) {
                            console.log('Exception in bwOrganizationEditor._create().xx.Get:1: ' + e.message + ', ' + e.stack);
                        }
                    }).fail(function (data) {
                        debugger;
                        console.log('In xx.fail(): ' + JSON.stringify(data));
                        var msg;
                        if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                            msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                        } else {
                            msg = JSON.stringify(data);
                        }
                        alert('Exception in bwOrganizationEditor._create().xx.Get:2: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                        console.log('Exception in bwOrganizationEditor._create().xx.Get:2: ' + JSON.stringify(data));
                        //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                        //var error = JSON.parse(data.responseText)["odata.error"];
                        //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
                    });











                }
            }
        } catch (e) {
            console.log('Exception in bwCircleDialog.displayOrgRoleEditorInACircle(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwCircleDialog.displayOrgRoleEditorInACircle(): ' + e.message + ', ' + e.stack);
        }
    },

    hideCircleDialog: function () { //hideParticipantRoleMultiPickerInACircle
        try {
            console.log('In hideCircleDialog().');

            if ($('#' + this.options.dialogElementId) && $('#' + this.options.dialogElementId).dialog()) { // added this line to prevent exception 9-22-2022
                $('#' + this.options.dialogElementId).dialog('close');
            }

            var canvas = document.getElementById(this.options.canvasElementId);
            canvas.style.zIndex = -1; // Important to send it to back, otherwise the user won't be able to interact with the UI.
            var ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.style.background = ''; // Resets the background to the normal behavior. Pretty cool! 

            // Get rid of the image overlay and map which allows the user to click on the small circle.
            //$('#circleDialogSmallCircleClickableImageMap').html(''); // circleDialogSmallCircleClickableImageMap

            $('#' + this.options.mapWrapperElementId_small).html('');

            console.log('In bwCircleDialog.js.hideCircleDialog(). Calling window.scrollTo(0, 0).');
            window.scrollTo(0, 0); // Scroll to top on button click. This makes sure things render Ok, and also just seems like a nicer user experience. In this case, the screen scrolls to the top of the next/focussed dialog, or something like that... 3-23-2023

            // This is here because it causes an exception in the backend admin. (No bwActiveMenu object)
            try {
                $('.bwActiveMenu').bwActiveMenu('adjustLeftSideMenu'); // This makes sure our new stretchy-left-menu redraws Ok.
            } catch (e) {

            }

            //this.renderOrgRoleConnectorsToWorkflow(false, divisionIndex, groupIndex, entityIndex, locationIndex);


            //debugger;
            //this.options.OnResizeDisplayValues = null;


        } catch (e) {
            console.log('Exception in hideCircleDialog(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in hideCircleDialog(): ' + e.message + ', ' + e.stack);
        }
    },
    hideAndDestroyCircleDialog: function () {
        try {
            console.log('In hideCircleDialog().');

            if (document.getElementById('divCircleDialog1')) {
                var divRolePickerDropDown = document.getElementById('divCircleDialog1');
                divRolePickerDropDown.style.display = 'none';
            }

            var canvas = document.getElementById("myCanvas");
            canvas.style.zIndex = -1; // Important to send it to back, otherwise the user won't be able to interact with the UI.
            var ctx = canvas.getContext('2d');

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            //this.renderOrgRoleConnectorsToWorkflow(false, divisionIndex, groupIndex, entityIndex, locationIndex);

            canvas.style.background = ''; // Resets the background to the normal behavior. Pretty cool! 
            //debugger;
            this.options.OnResizeDisplayValues = null;

            // Get rid of the image overlay and map which allows the user to click on the small circle.
            $('#divMapWrapper').html('');

        } catch (e) {
            console.log('Exception in hideCircleDialog(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in hideCircleDialog(): ' + e.message + ', ' + e.stack);
        }
    },
    hideOrgEditorInACircle: function (divisionIndex, groupIndex, entityIndex, locationIndex) {
        try {
            console.log('In hideOrgEditorInACircle().');
            //debugger;
            var divRolePickerDropDown = document.getElementById('divCircleDialog1');
            divRolePickerDropDown.style.display = 'none';

            var canvas = document.getElementById("myCanvas");
            canvas.style.zIndex = -1; // Important to send it to back, otherwise the user won't be able to interact with the UI.
            var ctx = canvas.getContext('2d');

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            canvas.style.background = ''; // Resets the background to the normal behavior. Pretty cool! 

            $('.bwOrganizationEditor').bwOrganizationEditor('renderOrgRoleConnectorsToWorkflow', false, divisionIndex, groupIndex, entityIndex, locationIndex);
            //debugger;
            //this.options.OnResizeDisplayValues = null;

            // Get rid of the image overlay and map which allows the user to click on the small circle.
            $('#divMapWrapper').html('');

        } catch (e) {
            console.log('Exception in hideOrgEditorInACircle(): ' + e.message + ', ' + e.stack);
        }
    },
    hideAndDestroyOrgEditorInACircle: function (divisionIndex, groupIndex, entityIndex, locationIndex) {
        try {
            console.log('In hideOrgEditorInACircle().');
            //debugger;
            var divRolePickerDropDown = document.getElementById('divCircleDialog1');
            divRolePickerDropDown.style.display = 'none';

            var canvas = document.getElementById("myCanvas");
            canvas.style.zIndex = -1; // Important to send it to back, otherwise the user won't be able to interact with the UI.
            var ctx = canvas.getContext('2d');

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            canvas.style.background = ''; // Resets the background to the normal behavior. Pretty cool! 

            $('.bwOrganizationEditor').bwOrganizationEditor('renderOrgRoleConnectorsToWorkflow', false, divisionIndex, groupIndex, entityIndex, locationIndex);
            //debugger;
            //this.options.OnResizeDisplayValues = null;
            this.options.OnResizeDisplayValues.DrawCircleDialog = false;
            this.options.OnResizeDisplayValues.DrawOrganizationLines = true;

            // Get rid of the image overlay and map which allows the user to click on the small circle.
            $('#divMapWrapper').html('');

        } catch (e) {
            console.log('Exception in hideOrgEditorInACircle(): ' + e.message + ', ' + e.stack);
        }
    },


    //displayAlertDialog: function (errorMessage) {
    //    try {
    //        //debugger;
    //        var element = $("#divAlertDialog");
    //        $(element).find('#spanErrorMessage')[0].innerHTML = errorMessage;
    //        $(element).dialog({
    //            modal: true,
    //            resizable: false,
    //            //closeText: "Cancel",
    //            closeOnEscape: false, // Hit the ESC key to hide! Yeah!
    //            //title: 'Add a New Person',
    //            width: '800',
    //            dialogClass: "no-close", // No close button in the upper right corner.
    //            hide: false, // This means when hiding just disappear with no effects.
    //            open: function () {
    //                $('.ui-widget-overlay').bind('click', function () {
    //                    $("#divAlertDialog").dialog('close');
    //                });
    //            },
    //            close: function () {
    //                //$(this).dialog('destroy').remove();
    //            }
    //        });
    //        $(element).dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
    //    } catch (e) {
    //        console.log('Exception in bwAttachments.displayAlertDialog(): ' + e.message + ', ' + e.stack);
    //    }
    //}

});