$.widget("bw.bwInvoiceGrid", {
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
        This is the bwInvoiceGrid.js jQuery Widget. 
        ===========================================================

            [more to follow]
                          
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

            [put your stuff here]

        ===========================================================
       
        */

        displayContext: null,


        elementIdSuffix: null, // This is a custom guid which gets appended to element id's, making sure this widget keeps to itself.

        invoiceHasBeenIssued: null, // true or false. This should only be allowed to happen once. 6-30-2023.

        fieldTitle: 'Invoice Items', // This is the title, which shows up on the form in the left column.

        jsonData: [],

        bwBudgetRequestId: null,

        requestDialogId: null, // This is the id of the container where this form widget is displayed.

        allowRequestModifications: false,
        renderAsARequiredField: null, // If this is true, then just display the red asterisk.

        inFormsEditor: null, // This is when forms are being designed. This prevents the widget from hitting the database (going asynchronous) when this is true. If that happens, a race condition may occur and addition to the toolbox may partially fail.

        operationUriPrefix: null,
        //ajaxTimeout: 15000,
        autoSenseDeviceType: false // Automatic UI based on device type. Alpha version so far.

        // SAMPLE JSON:
        // "bwInvoiceGrid":{"value":[
        // {"Description":"Aug 15 Owls head ","Amount":250,"Tax":0,"Total":250},
        // {"Description":"Aug 16 Owls head","Amount":250,"Tax":0,"Total":250},
        // {"Description":"Aug 17 Owls head","Amount":250,"Tax":0,"Total":250},
        // {"Description":"Aug 22 Owls head","Amount":250,"Tax":0,"Total":250},
        // {"Description":"Aug 23 Owls head","Amount":250,"Tax":0,"Total":250},
        // {"Description":"Aug 24 Owls head","Amount":250,"Tax":0,"Total":250}],
        // "isPaid":false,
        // "bwDataRequired":false,
        // "bwDataType":"invoice",
        // "tagName":"bwInvoiceGrid"},

        // THIS WIDGET NEEDS ADDITIONAL PROPERTIES:
        //   - status: { isPaid: false, datePaid: xx, hasBeenIssued: false, issuedDate: xx, history: [{THIS IS THE HISTORY OF ISSUING AND PAYMENTS}] }

    },
    //
    // _create(displayContext): We endeavor to always instantiate a widget when displaying/rendering a new instance. This makes it easier for the programmer to bring the widget to life in different scenarios.
    //
    // displayContext allows us to render depending on where this widget is going. Possible values:
    //      - 'form'. This is when the invoice widget is displayed in a request form, along with other form widgets. If no value is specified, then the default is 'form'.
    //      - 'dialog'. This is when the invoice widget is displayed in it's own dialog. This happens when the user is viewing a request, and clicks the magnifying glass button invoking viewInLargeWindow().
    //      - 'window'. This is when the user selects the '↸' button to view in a popped-out window, invoking LaunchIntoSeparateWindow().
    //      - 'printed_invoice1'. This is when the user selects the 'Issue Invoice' button when viewing a request, invoking issueInvoice().
    //
    //
    _create: function () {
        this.element.addClass('bwInvoiceGrid');
        var thiz = this; // Need this because of the asynchronous operations below.
        try {

            //alert('cx2231 IN _CREATE() for bwInvoiceGrid.js.');

            if (this.options.operationUriPrefix == null) {
                // This formulates the operationUri, which is used throughout.
                var url1 = window.location.href.split('https://')[1];
                var url2 = url1.split('/')[0];
                this.options.operationUriPrefix = 'https://' + url2 + '/';
            }

            var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
            this.options.elementIdSuffix = guid;

            if (!this.options.jsonData) {
                this.options.jsonData = [];
            }

            if (this.options.jsonData.length == 0) {
                this.options.jsonData['bwInvoiceGrid'] = {}; // Instantiate the data object. bwInvoiceGrid
            }








            if (this.options.inFormsEditor == true) {

                console.log('In bwInvoiceGrid.js._create().option.inFormsEditor == true.');
                //this.renderAndPopulateAttachments_ReadOnly(); // Need to render, not allowing the user to make modifications.
                this.renderAndPopulateInvoiceGrid();

            } else if (this.options.allowRequestModifications == false) {

                console.log('In bwInvoiceGrid.js._create().option.allowRequestModifications == false.');
                //this.renderAndPopulateAttachments_ReadOnly(); // Need to render, not allowing the user to make modifications.
                this.renderAndPopulateInvoiceGrid();

            } else if (this.options.allowRequestModifications == true) {

                console.log('In bwInvoiceGrid.js._create().option.allowRequestModifications == true.');
                //this.renderAndPopulateAttachments();
                this.renderAndPopulateInvoiceGrid();

            } else {
                var html = '';
                html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwInvoiceGrid</span>';
                html += '<br />';
                html += '<span style="">Invalid value for allowRequestModifications: ' + this.options.allowRequestModifications + '</span>';
                this.element.html(html);
            }







            ////
            //// CAN THE FOLLOWING BE BROUGHT TOGETHER? SHOULD THEY BE? IT REMAINS TO BE SEEN.... 11-18-2023.
            ////

            ////this.options.displayContext

            //if (this.options.customRenderingInstructions) {

            //    var customRenderingInstruction;
            //    for (var i = 0; i < this.options.customRenderingInstructions.length; i++) {
            //        if (this.options.customRenderingInstructions[i].bwInvoiceGrid) {
            //            customRenderingInstruction = this.options.customRenderingInstructions[i].bwInvoiceGrid.CustomRenderingInstruction;
            //            break;
            //        }
            //    }

            //    if (customRenderingInstruction) {
            //        this.renderAndPopulateInvoiceGrid(customRenderingInstruction);
            //    } else {
            //        this.renderAndPopulateInvoiceGrid();
            //    }

            //} else {
            //    this.renderAndPopulateInvoiceGrid();
            //}

            console.log('In bwInvoiceGrid._create(). The widget has been initialized.');

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwInvoiceGrid</span>';
            html += '<br />';
            html += '<span style="">Exception in bwInvoiceGrid.Create(): ' + e.message + ', ' + e.stack + '</span>';
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
            .removeClass("bwInvoiceGrid")
            .text("");
    },
    getDataType: function () {
        try {
            console.log('In bwInvoiceGrid.js.getDataType().');

            return 'invoice';

        } catch (e) {
            console.log('Exception in bwInvoiceGrid.js.getDataType(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwInvoiceGrid.js.getDataType(): ' + e.message + ', ' + e.stack);
        }
    },
    getData: function () {
        try {
            console.log('In bwInvoiceGrid.js.getData().');

            var data = $(this.element).find('#jsGridCosts_small').jsGrid('option', 'data');

            if (data.length < 1) {
                return null;
            } else {
                //alert('xcx999285 in getData(). data: ' + JSON.stringify(data));
                return data;
            }
        } catch (e) {
            console.log('Exception in bwInvoiceGrid.getData(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwInvoiceGrid.getData(): ' + e.message + ', ' + e.stack);
        }
    },
    isARequiredField: function () {
        try {
            console.log('In bwInvoiceGrid.isARequiredField().');
            return this.options.renderAsARequiredField;
        } catch (e) {
            console.log('Exception in bwInvoiceGrid.isARequiredField(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwInvoiceGrid.isARequiredField(): ' + e.message + ', ' + e.stack);
        }
    },
    getfieldTitle: function () {
        try {
            console.log('In bwInvoiceGrid.getfieldTitle().');
            return this.options.fieldTitle;
        } catch (e) {
            console.log('Exception in bwInvoiceGrid.getfieldTitle(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwInvoiceGrid.getfieldTitle(): ' + e.message + ', ' + e.stack);
        }
    },
    getIsPaid: function () {
        try {
            console.log('In bwInvoiceGrid.getIsPaid().');

            var isPaid = this.options.jsonData["bwInvoiceGrid"]["isPaid"];
            //alert('xcx1231241 isPaid: ' + isPaid + ', this.options.jsonData: ' + JSON.stringify(this.options.jsonData));

            if (!isPaid) {
                isPaid = false;
            }
            return isPaid;

        } catch (e) {
            console.log('Exception in bwInvoiceGrid.getIsPaid(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwInvoiceGrid.getIsPaid(): ' + e.message + ', ' + e.stack);
        }
    },

    pinRequestDialog: function () {
        try {
            console.log('In pinRequestDialog().');
            // This makes the dialog non-modal, so that it can be dragged around and the underlying functionality accessible. This removes the overlay that makes the dialog modal, and also removes the click event which would have originally closed the request dialog.
            // The idea is to be able to have multiple requests open at once!
            $('.ui-widget-overlay').unbind('click');
            $(".ui-widget-overlay").remove();

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
            console.log('Exception in pinRequestDialog(): ' + e.message + ', ' + e.stack);

        }
    },
    setZoom: function (originalZoom, elementId) {
        try {
            console.log('In setZoom(' + originalZoom + ', ' + elementId + ')');
            var thiz = this;
            if (originalZoom > 20) { // Don't make any smaller than this!
                var zoom = originalZoom / 100;
                elementId = elementId.replace('_Parent', '');
                elementId += '_Parent'; // This just makes sure it is here! :)
                var el = document.getElementById(elementId); //("#elementId"); //.slider("element");

                transformOrigin = [0, 0];
                //try {
                //    el = el || instance.getContainer();
                //} catch(e) { }

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
        }
    },
    saveAsPdfAttachment: function (bwBudgetRequestId, requestTitle) {
        try {
            console.log('In bwInvoiceGrid.js.saveAsPdfAttachment(). bwBudgetRequestId: ' + bwBudgetRequestId);
            alert('In bwInvoiceGrid.js.saveAsPdfAttachment(). This functionality is incomplete. Coming soon!');
            //var thiz = this;

            //ShowActivitySpinner('Printing receipts...');

           

        } catch (e) {

            var msg = 'Exception in bwInvoiceGrid.js.saveAsPdfAttachment(): ' + e.message + ', ' + e.stack;
            console.log(msg);
            displayAlertDialog(msg);

        }
    },
    printReceipts: function (bwBudgetRequestId, requestTitle) {
        try {
            console.log('In bwInvoiceGrid.js.printReceipts(). bwBudgetRequestId: ' + bwBudgetRequestId);
            var thiz = this;

            ShowActivitySpinner('Printing receipts...');

            var div = document.getElementById('divPrintReceiptsDialog');
            if (!div) {

                console.log('In issueInvoice(). adding element to the dom: ' + 'divPrintReceiptsDialog');

                div = document.createElement('div');
                div.id = 'divPrintReceiptsDialog';
                div.style.display = 'none';
                document.body.appendChild(div); // Place at end of document

                var html = '';

                //html += '        <table style="width:100%;">';
                //html += '            <tr>';
                //html += '                <td style="width:90%;">';
                //html += '                    <span id="spanDeleteAnAttachmentOfflineDialogTitlexx" style="color: #3f3f3f;font-size: 60pt;font-weight:bold;">Issue Invoice</span>';
                //html += '                </td>';
                //html += '                <td style="width:9%;"></td>';
                //html += '                <td style="width:1%;cursor:pointer;vertical-align:top;">';
                //html += '                    <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 120pt;font-weight:bold;" onclick="$(\'#divIssueAnInvoiceDialog\').dialog(\'close\');">X</span>';
                //html += '                </td>';
                //html += '            </tr>';
                //html += '        </table>';
                //html += '        <br /><br />';
                //html += '        <!--<span id="spanDeleteAnAttachmentOfflineDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 40pt;font-weight:bold;">Delete Slide</span>';
                //html += '        <br /><br />-->';
                html += '        <span id="span_PrintReceiptsDialog_ReceiptsHtml" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;"></span>';
                html += '        <br />';
                html += '        <span id="spanDeleteAnAttachmentOfflineDialogTopMessagexx"></span>';
                html += '        <br />';
                html += '        <div class="divDialogButton" onclick="$(\'#divPrintReceiptsDialog\').dialog(\'close\');">';
                html += '           Close';
                html += '        </div>';
                html += '        <br /><br />';
                html += '        <br /><br />';

                div.innerHTML = html;
            }


            $('#divPrintReceiptsDialog').dialog({
                modal: true,
                resizable: false,
                closeText: "Cancel",
                closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                width: "1000", //"570px",
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {
                    try {
                        //$('.ui-widget-overlay').bind('click', function () {
                        //    $("#divIssueAnInvoiceDialog").dialog('close');
                        //});

                        var html = '';

                        html += '<div id="" xcx="xcx123426666" bwwidgetname="bwInvoiceGrid" bwHint="RENDER_FOR_PRINTED_INVOICE"></div>' // <tr class="xdTableOffsetRow bwJustificationDetailsField" bwwidgetname="bwJustificationDetailsField" id="draggablerow_3">                                                    <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px">                                <span class="xdlabel">                                    Justification Details:<br><a onclick="$('#divRequestFormDialog_98e12651-de75-4d35-afb1-0e79bcf7290c').find('.bwJustificationDetailsField').bwJustificationDetailsField('ToggleExpandJustificationDetails');">   <img id="imgExpandJustificationDetails" src="../images/plus-sign.png" style="text-align:left; cursor:pointer;width:35px;height:35px;"></a>                                </span>                            </td>                            <td class="xdTableOffsetCellComponent" style="white-space:nowrap;text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px;">                                      <div>                                        <table width="100%">                                          <tbody><tr>                                            <td colspan="2">                                              <span id="JustificationDetails" class="xdTextBoxRequired bwRequestJson" contenteditable="false" bwdatarequired="false" bwfieldname="JustificationDetails" title="" style="WORD-WRAP: break-word; HEIGHT: 90px; WHITE-SPACE: normal; OVERFLOW-X: auto; OVERFLOW-Y: auto; WIDTH: 100%;BACKGROUND-COLOR: white;font-family: 'Segoe UI Light','Segoe UI','Segoe',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 15pt;">Items included in this invoice:<br>- Video uploads, conversions, and hosting.<br>- Paid in full. Deposited check #001636 on 6-25-2023.<br><br></span>                                            </td>                                          </tr>                                        </tbody></table>                                      </div>                            </td>                                            </tr>

                        $('#span_IssueAnInvoiceDialog_InvoiceHtml').html(html);

                        var promise = $('.bwRequest').bwRequest('scrapeBwRequestJson', bwBudgetRequestId);
                        promise.then(function (results) {
                            try {
                                var bwRequestJson = JSON.stringify(results.bwRequestJson);

                                //
                                // formWidget_CustomRenderingInstructions of 'RENDER_FOR_PRINTED_INVOICE' makes the bwInvoiceGrid.js form widget render in a format that is good for printing the invoice.
                                //
                                var formWidget_CustomRenderingInstructions = [];

                                var instruction1 = {
                                    bwInvoiceGrid: {
                                        CustomRenderingInstruction: 'RENDER_FOR_PRINTED_INVOICE'
                                    }
                                };
                                formWidget_CustomRenderingInstructions.push(instruction1);

                                //var instruction2 = {
                                //    bwCommentsField: {
                                //        CustomRenderingInstruction: 'RENDER_FOR_PRINTED_INVOICE'
                                //    }
                                //};
                                //formWidget_CustomRenderingInstructions.push(instruction2);

                                $('.bwRequest').bwRequest('populateRequestForm', 'span_IssueAnInvoiceDialog_InvoiceHtml', bwRequestJson, false, formWidget_CustomRenderingInstructions); // requestDialogId, bwRequestJson, allowRequestModifications, formWidget_CustomRenderingInstructions.

                                //$('.bwRequest').bwRequest('initializeRequestFormWidgets', 'span_IssueAnInvoiceDialog_InvoiceHtml', bwRequestJson, false, false); // requestDialogId, bwRequestJson, allowRequestModifications, attachmentsAreStoredInIndexDb

                                HideActivitySpinner();

                            } catch (e) {
                                HideActivitySpinner();
                                console.log('Exception in issueInvoice():3: ' + e.message + ', ' + e.stack);
                                displayAlertDialog('Exception in issueInvoice():3: ' + e.message + ', ' + e.stack);
                            }
                        });

                    } catch (e) {
                        HideActivitySpinner();
                        console.log('Exception in issueInvoice():2: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in issueInvoice():2: ' + e.message + ', ' + e.stack);
                    }
                }
            });

            var html = '';

            html += '<table xcx="xcx3249-2" style="width:100%;" onclick="$(\'.bwRequest\').bwRequest(\'pinRequestDialog\');" ondblclick="$(\'.bwRequest\').bwRequest(\'zoomAndCenter\', \'' + 'divPrintReceiptsDialog' + '\');" >'; // This click event is like "pin". Once the user clicks the header of the request dialog, it no longer is modal and persists on the screen until they choose to close it.
            html += '   <tr>';
            html += '       <td style="width:95%;">';
            html += '           <div id="slider_' + bwBudgetRequestId + '" style="width:20%;cursor:pointer;"></div>';
            html += '       </td>';


            html += '       <td style="vertical-align:middle;width:5%;padding:0;border:0;margin:0;">';

            html += '       </td>';


            // Refresh button. This is good if you want to refresh and see the state of the file conversion from vob to mp4, for instance. 9-7-2022
            html += '       <td style="vertical-align:top;width:5%;padding:0;border:0;margin:0;">';
            html += '       </td>';

            html += '       <td style="vertical-align:top;width:5%;padding:0;border:0;margin:0;">';

            html += '       </td>';
            html += '       <td style="vertical-align:middle;width:5%;padding:0;border:0;margin:0;">';
            html += '           <span title="print" class="printButton" dev="xcx32424-1-0" style="font-size:18pt;cursor:pointer !important;" onclick="$(\'.bwPrintButton\').bwPrintButton(\'PrintReceipts\', \'' + 'divPrintReceiptsDialog' + '\', \'' + requestTitle + '\');">';
            html += '               <img src="/images/iosprinter_blue.png" style="width:50px;height:50px;cursor:pointer !important;" />';
            html += '           </span>';
            html += '       </td>';
            html += '       <td>&nbsp;&nbsp;</td>';
            html += '       <td>';
            html += '           <span class="dialogXButton" style="font-size:25pt;cursor:pointer;width:100%;font-weight:bold;" onclick="$(\'.bwPageScrollingHandler\').bwPageScrollingHandler(\'CloseDialogAndPreventNextWindowScrollEvent\', \'' + ('divPrintReceiptsDialog').replace('_Parent', '') + '\');">X</span>';
            html += '       </td>';
            html += '   </tr>';
            html += '</table>';

            document.getElementById('divPrintReceiptsDialog').parentNode.querySelector(".ui-dialog-titlebar").innerHTML = html;

            var html = '';

            html += '<div style="float:left;font-size:40pt;font-weight:bold;font-family:Calibri;color:gray;opacity:50%;">Receipts for ' + requestTitle + '</div>';
            html += '<br /><br />';

            //
            // Call the web service to get the list of all the attachments.
            //

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

            var data = {
                bwParticipantId_LoggedIn: participantId,
                bwActiveStateIdentifier: activeStateIdentifier,
                bwWorkflowAppId_LoggedIn: workflowAppId,

                bwWorkflowAppId: workflowAppId,
                bwBudgetRequestId: bwBudgetRequestId
            };

            var operationUri = globalUrlPrefix + globalUrlForWebServices + '/_files/' + 'getlistofattachmentsforbudgetrequest';
            $.ajax({
                url: operationUri,
                type: 'POST',
                data: data,
                timeout: 15000, // This is done because file services may need more time. 
                headers: { "Accept": "application/json; odata=verbose" },
                success: function (results) {
                    try {

                        if (results.status != 'SUCCESS') {

                            html += '<span xcx="xcx22945-1" style="color:tomato;">' + results.message + '</span>';

                        } else {

                            if (results.data.length <= 0) {

                                var msg = 'Error in xx(). Unexpected response: ' + JSON.stringify(results);
                                console.log(msg);
                                displayAlertDialog(msg);

                            } else {

                                var preventCachingGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                                    return v.toString(16);
                                });

                                for (var i = 0; i < results.data.length; i++) {

                                    var extensionIndex = results.data[i].Display_Filename.split('.').length - 1;
                                    var fileExtension = results.data[i].Display_Filename.toLowerCase().split('.')[extensionIndex];

                                    if (fileExtension == 'png' || fileExtension == 'jpg' || fileExtension == 'jpeg' || fileExtension == 'jfif' || fileExtension == 'webp' || fileExtension == 'gif') {

                                        var description = encodeURI(results.data[i].Description);
                                        //var size = results.data[i].Size;
                                        ////if (size && size.toLowerCase() && (size.toLowerCase() != 'na')) {
                                        //try {
                                        //    size = (Number(size) / 1000000).toFixed(2);
                                        //} catch (e) { }
                                        ////}

                                        var timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(results.data[i].Birthtime);
                                        var birthtime = timestamp4.toString();

                                        var fileUrl;
                                        var fileUrl_Printable;

                                        var activeStateIdentifier2 = JSON.parse(activeStateIdentifier);

                                        if (activeStateIdentifier2.status != 'SUCCESS') {

                                            html += '[No image. Unauthorized. xcx213124-3]';

                                        } else {

                                            fileUrl = "_files/" + workflowAppId + "/" + bwBudgetRequestId + "/" + encodeURI(results.data[i].Display_Filename) + '?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier2.ActiveStateIdentifier;
                                            //fileUrl_Thumbnail = "_files/" + workflowAppId + "/" + bwBudgetRequestId + "/" + encodeURI(results.data[i].Actual_Filename) + '?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier2.ActiveStateIdentifier;

                                            if (results.data[i].Printable_Filename) {
                                                fileUrl_Printable = "_files/" + workflowAppId + "/" + bwBudgetRequestId + "/" + encodeURI(results.data[i].Printable_Filename) + '?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier2.ActiveStateIdentifier;
                                            } else {
                                                console.log('In xcx231312. Everything should have a Printable_Filename but not so. 12-3-2023.');

                                                var extensionIndex = results.data[i].Display_Filename.split('.').length - 1;
                                                var fileExtension = results.data[i].Display_Filename.toLowerCase().split('.')[extensionIndex];

                                                var printable_Filename = results.data[i].Display_Filename + '_320px_.' + fileExtension; // We are downsizing the quality here to the 320px version. Fix this in the future, when we always generate a Printable_Filename/version. 12-12-2023.

                                                fileUrl_Printable = "_files/" + workflowAppId + "/" + bwBudgetRequestId + "/" + encodeURI(printable_Filename) + '?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier2.ActiveStateIdentifier;
                                            }
                                            

                                        }

                                        // Centered on the screen.
                                        var width = 800;
                                        var height = 600;
                                        var left = (screen.width - width) / 2;
                                        var top = (screen.height - height) / 2;

                                        html += '<table style="width:100%;">';
                                        html += '  <tr>';
                                        html += '    <td style="width:10%;">';

                                        html += '<img id="attachmentstest1" xcx="xcx2312-2-2-1" src="' + thiz.options.operationUriPrefix + fileUrl_Printable + '" style="height:450px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;border:1px solid gray;" alt="" ';
                                        html += 'onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + results.data[i].Display_Filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');" ';
                                        html += ' />';

                                        html += '    </td>';
                                        html += '    <td style="width:90%;white-space:normal;">';

                                        html += '<div xcx="xcx21342346-5" class="attachmentsSectionFileLink" style="cursor:pointer;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + + fileUrl + '\', \'' + results.data[i].Display_Filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');">';

                                        html += '<span style="font-size:25pt;">' + decodeURI(description) + '</span>';

                                        html += '<br />';
                                        html += '<br />';

                                        html += '<span style="font-size:12pt;">Uploaded by ' + results.data[i].bwParticipantFriendlyName + ' on ' + birthtime + '.</span>';

                                        html += '</div>';

                                        html += '</br>';

                                        html += '    </td>';
                                        html += '  </tr>';
                                        html += '</table>';

                                    }

                                }

                            }

                        }

                        $('#span_PrintReceiptsDialog_ReceiptsHtml').html(html);

                    } catch (e) {

                        var msg = 'Exception in bwInvoiceGrid.js.printReceipts.getlistofattachmentsforbudgetrequest(): ' + e.message + ', ' + e.stack;
                        console.log(msg);
                        displayAlertDialog(msg);

                    }
                },
                error: function (data, errorCode, errorMessage) {

                    if (errorCode === 'timeout' && errorMessage === 'timeout') {
                        console.log('In bwInvoiceGrid.js.printReceipts.getlistofattachmentsforbudgetrequest(). SERVICE UNAVAILABLE. File services is not responding. communication timeout is set at ' + ajaxTimeout / 1000 + ' seconds: ' + errorCode + ', ' + errorMessage);
                        displayAlertDialog('In bwInvoiceGrid.js.printReceipts.getlistofattachmentsforbudgetrequest(). SERVICE UNAVAILABLE. File services is not responding. communication timeout is set at ' + ajaxTimeout / 1000 + ' seconds: ' + errorCode + ', ' + errorMessage);
                        //$(thiz.element).find('#newrequestattachments')[0].innerHTML = '<span style="color:tomato;">File services is not responding. communication timeout is set at ' + ajaxTimeout / 1000 + ' seconds: ' + errorCode + ', ' + errorMessage + '</span>';
                        //$(attachmentWidget).find('#newrequestattachments')[0].innerHTML = '<span style="color:tomato;">File services is not responding. communication timeout is set at ' + ajaxTimeout / 1000 + ' seconds: ' + errorCode + ', ' + errorMessage + '</span>';
                    } else {

                        var msg = 'Error in bwInvoiceGrid.js.printReceipts.getlistofattachmentsforbudgetrequest(): ' + errorMessage + '.'; // A common error at the moment is "Backend fetch failed". 10-13-2022

                        console.log(msg + ' xcx123123 data: ' + JSON.stringify(data));
                        displayAlertDialog(msg);

                        //$(attachmentWidget).find('#newrequestattachments')[0].innerHTML = '<span style="color:tomato;">' + msg + '</span>';

                        //displayAlertDialog('Error in bwAttachments.js.populateAttachments():2:xcx2 ' + errorCode + ', ' + errorMessage + ', ' + JSON.stringify(data));
                        // The latest error 1-17-2018 is errorCode:'error' and errorMessage:'Not Found'.
                        // What does this mean? You can replicate this error!
                        // at Url: https://budgetworkflow.com/ios8.html, view an offline (Un-submitted) request, and try to add an attachment.

                    }
                }
            });

        } catch (e) {

            var msg = 'Exception in bwInvoiceGrid.js.printReceipts(): ' + e.message + ', ' + e.stack;
            console.log(msg);
            displayAlertDialog(msg);

        }
    },
    FFMPEGConvertAndUploadMultipleVideoFiles: function (file, bwBudgetRequestId, dialogId) {
        var thiz = this;
        return new Promise(function (resolve, reject) {
            try {
                console.log('In bwAttachments.js.FFMPEGConvertAndUploadMultipleVideoFiles().');

                //
                //
                // FFMPEG/WASM: https://ffmpegwasm.netlify.app/docs/api/ffmpeg/classes/FFmpeg#off
                //
                // What is the maximum size of input file? 2 GB, which is a hard limit in WebAssembly.Might become 4 GB in the future.
                //
                //

                var ffmpeg;
                const baseURL = 'https://shareandcollaborate.com/wasm/ffmpeg/umd';

                var loadTheFFMPEGWebAssembly = async function (file) {
                    try {
                        console.log('In loadTheFFMPEGWebAssembly(). xcx213123.');
                        //const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.1/dist/umd';
                        //const baseURL = 'https://shareandcollaborate.com/wasm/ffmpeg/umd';
                        ffmpeg = new FFmpeg();

                        ShowActivitySpinner('Loading the FFMPEG web assembly...');

                        var coreBlob = await fetch(baseURL + '/ffmpeg-core.js').then(r => r.blob());
                        var coreUrl = URL.createObjectURL(coreBlob, { type: 'text/javascript' });

                        var wasmBlob = await fetch(baseURL + '/ffmpeg-core.wasm').then(r => r.blob());
                        var wasmUrl = URL.createObjectURL(wasmBlob, { type: 'application/wasm' });

                        await ffmpeg.load({
                            coreURL: coreUrl,
                            wasmURL: wasmUrl
                        });

                        loaded = true;

                        transcode(file);

                    } catch (e) {

                        HideActivitySpinner();

                        var msg = 'Exception xcx2143235-5. Failed in loadTheFFMPEGWebAssembly(): ' + e.message + ', ' + e.stack;
                        alert(msg);

                        var result = {
                            status: 'EXCEPTION',
                            message: msg
                        }
                        reject(result);

                    }
                }

                var transcode = async function (file) { // changed from arrows 11-11-2023
                    try {

                        HideActivitySpinner();
                        ShowActivitySpinner('Launching the process for file "' + file.name + '"...');

                        function load_file(file) {
                            try {

                                var reader = new FileReader();

                                reader.addEventListener('loadend', print_file);
                                reader.filename = file.name;

                                reader.readAsArrayBuffer(file);

                            } catch (e) {

                                HideActivitySpinner();
                                var msg = 'Exception xcx23499534235: ' + e.message + ', ' + e.stack;

                                alert(msg);

                                var result = {
                                    status: 'EXCEPTION',
                                    message: msg
                                }
                                reject(msg);

                            }
                        }

                        async function print_file(files) {
                            try {

                                var inputFilename = files.currentTarget.filename;

                                var extensionIndex = inputFilename.split('.').length - 1;
                                var tmp = '';
                                for (var i = 0; i < extensionIndex; i++) {
                                    tmp += inputFilename.split('.')[i];
                                }
                                var outputFilename = tmp + '.mp4';

                                var result = files.currentTarget.result;

                                if (!result) {

                                    displayAlertDialog_Persistent('FATAL ERROR! NO result in print_file(). files.currentTarget.result: ' + files.currentTarget.result + '. Putting the file back into the retry list. inputFilename: ' + inputFilename + ', bwBudgetRequestId: ' + bwBudgetRequestId);

                                    //
                                    // THIS FILE FAILED, SO ADD IT BACK TO THE LIST.
                                    //

                                    //
                                    // SINCE WE ARE OUT OF SCOPE, WE WILL FIND OUR WIDGET IN THE DOM.
                                    //

                                    var forms = $(document).find('.budgetrequestform');
                                    var form;
                                    for (var i = 0; i < forms.length; i++) {
                                        var attrBwBudgetRequestId = $(forms[i]).attr('bwbudgetrequestid');
                                        if (attrBwBudgetRequestId == bwBudgetRequestId) {
                                            form = forms[i];
                                            break;
                                        }
                                    }

                                    if (!form) {

                                        var msg = 'In bwAttachments.js.FFMPEGConvertAndUploadMultipleVideoFiles.transcode.print_file.ffmpeg.writeFile.exec.readFile.catch(). COULD NOT FIND budgetrequestform for bwBudgetRequestId: ' + bwBudgetRequestId;
                                        console.log(msg);
                                        alert(msg);
                                        displayAlertDialog_Persistent(msg);

                                    } else {

                                        var strJson = $('#FFMPEGMultiFile_ProcessFailures_Json').html();

                                        var json = JSON.parse(strJson);

                                        var uploadFailure = {
                                            //status: 'EXCEPTION',
                                            //message: msg,
                                            inputFilename: inputFilename,
                                            outputFilename: outputFilename,
                                            //executionString: executionString,
                                            bwBudgetRequestId: bwBudgetRequestId
                                        }

                                        json.push(uploadFailure); // Add our new one.

                                        $('#FFMPEGMultiFile_ProcessFailures_Json').html(JSON.stringify(json)); // Since we are running this one again, remove it from our list.

                                    }

                                } else {

                                    var uint8_view = new Uint8Array(result); // Reads the file as an ArrayBuffer and then uses a Uint8Array view of that buffer to write the file to Emscripten's MEMFS:

                                    if (!uint8_view) {
                                        alert('FATAL ERROR! NO uint8_view. xcxq234324232');
                                    }

                                    //HideActivitySpinner();
                                    //ShowActivitySpinner('Loading video into FFMPEG...2');

                                    // Listen to progress event instead of log.
                                    ffmpeg.on("progress", function ({ progress }) { //, time }) {
                                        try {

                                            HideActivitySpinner();

                                            var percentComplete = Math.round(progress * 100);

                                            ShowActivitySpinner_FileUpload('Processing the file "' + inputFilename + '"');

                                            $("#divBwActivitySpinner_FileUpload_ProgressBar").width(percentComplete + '%');
                                            $("#divBwActivitySpinner_FileUpload_ProgressBar").html(Math.round(percentComplete) + '%');

                                        } catch (e) {
                                            alert('Exception xcx99458886: ' + e.message + ', ' + e.stack);
                                        }
                                    });

                                    ffmpeg.on("log", function ({ type, message }) {
                                        console.log('FFMPEG type: ' + type + ', message: ' + message);
                                    });

                                    ffmpeg.writeFile(inputFilename, uint8_view).then(function (data) {
                                        try {

                                            // That refers to the Constant Rate Factor (crf).
                                            // As others have pointed out (Thanks all), the values will depend on which encoder you're using.
                                            // For x264 your valid range is 0-51:
                                            // The range of the quantizer scale is 0-51: where 0 is lossless, 23 is default, and 51 is worst possible. A lower value is a higher quality and a
                                            // subjectively sane range is 18-28. Consider 18 to be visually lossless or nearly so: it should look the same or nearly the same as the input but it
                                            // isn't technically lossless.
                                            // 23 is default.
                                            var executionString = ['-i', inputFilename, '-preset', 'ultrafast', '-c:v', 'libx264', '-crf', '18', '-pix_fmt', 'yuv420p', '-map_metadata', '0', '-movflags', 'faststart', outputFilename];

                                            //
                                            // -nostdin not '-y', may mean some errors are raised which we want to know about... such as "the file already exists". 11-11-2023.
                                            //
                                            //var executionString = ['-i', inputFilename, '-nostdin', '-n', '-preset', 'ultrafast', '-c:v', 'libx264', '-crf', '18', '-pix_fmt', 'yuv420p', '-map_metadata', '0', '-movflags', 'faststart', outputFilename];
                                            ffmpeg.exec(executionString).then(function (data) {
                                                try {

                                                    ffmpeg.deleteFile(inputFilename).then(function (data) {
                                                        try {

                                                            if (data != true) {

                                                                HideActivitySpinner();

                                                                displayAlertDialog_Persistent('xcx231233112-1. Error ffmpeg.deleteFile returned false.');

                                                            } else {

                                                                ffmpeg.readFile(outputFilename).then(function (data) {
                                                                    try {

                                                                        if (!data || !data.buffer) {
                                                                            alert('FATAL ERROR NO buffer data. xcx4444332.');
                                                                        }

                                                                        var blob2 = new Blob([data.buffer], { type: 'video/mp4' });

                                                                        var outFile = new File([blob2], outputFilename);

                                                                        if (!outFile) {
                                                                            alert('FATAL ERROR xcx213125555. No outFile.');
                                                                        }

                                                                        //await ffmpeg.deleteFile( // This doesnt help free up any resources from what I can tell.... 11-11-2023.
                                                                        //    inputFilename
                                                                        //);

                                                                        //await ffmpeg.deleteFile( // This doesnt help free up any resources from what I can tell.... 11-11-2023.
                                                                        //    outputFilename
                                                                        //);

                                                                        HideActivitySpinner();

                                                                        thiz.performUpload3(outFile, outputFilename, bwBudgetRequestId, null, false).then(function (data) {

                                                                            //
                                                                            // NOW THAT THE UPLOAD IS COMPLETE, DELETE THE FILES FROM FFMPEG IN ORDER TO FREE UP RESOURCES.
                                                                            //

                                                                            ffmpeg.deleteFile(outputFilename).then(function (data) {
                                                                                try {

                                                                                    HideActivitySpinner();

                                                                                    if (data != true) {

                                                                                        displayAlertDialog_Persistent('xcx231233112-2. Error ffmpeg.deleteFile returned false.');

                                                                                    } else {

                                                                                        console.log('THE FILE HAS BEEN UPLOADED AND DELETED FROM FFMPEG [' + inputFilename + ']. data: ' + JSON.stringify(data));

                                                                                        //
                                                                                        //
                                                                                        // NOW THAT WE HAVE FREED UP SOME RESOURCES, RE-TRY A FILE.
                                                                                        //
                                                                                        //

                                                                                        var strJson = $('#FFMPEGMultiFile_ProcessFailures_Json').html();

                                                                                        var json = JSON.parse(strJson);

                                                                                        if (json.length && (json.length > 0)) {

                                                                                            //
                                                                                            // If we get here, it means there is at least one file that we can re-try.
                                                                                            //

                                                                                            var inputFileAttachmentsElement = $('#inputFile_' + bwBudgetRequestId)[0];

                                                                                            if (!(inputFileAttachmentsElement.files && inputFileAttachmentsElement.files.length && (inputFileAttachmentsElement.files.length > 0))) {

                                                                                                displayAlertDialog('In bwAttachments.js.xcx213132(). NO FILES ARE ATTACHED.');

                                                                                            } else {

                                                                                                for (var i = 0; i < inputFileAttachmentsElement.files.length; i++) {

                                                                                                    if (inputFileAttachmentsElement.files[i].name && (inputFileAttachmentsElement.files[i].name == json[0].inputFilename)) { // Just pick the first one.

                                                                                                        load_file(inputFileAttachmentsElement.files[i]);

                                                                                                        json.splice(0, 1); // Since we are running this one again, remove it from our list.

                                                                                                        displayAlertDialog_Persistent('Called load_file to re-try this file: ' + json[0].inputFilename + '. Removed from the list. The new list: ' + JSON.stringify(json));

                                                                                                        $('#FFMPEGMultiFile_ProcessFailures_Json').html(JSON.stringify(json)); // Since we are running this one again, remove it from our list.

                                                                                                        break;

                                                                                                    }

                                                                                                }

                                                                                            }

                                                                                        }

                                                                                    }

                                                                                } catch (e) {
                                                                                    //alert('xcx7777890-1');
                                                                                    var msg = 'Exception in bwAttachments.js.FFMPEGConvertAndUploadMultipleVideoFiles.transcode.print_file.ffmpeg.writeFile.exec.readFile():2: ' + e.message + ', ' + e.stack;
                                                                                    console.log(msg);
                                                                                    alert(msg);
                                                                                }

                                                                            }).catch(function (e) {

                                                                                var msg = 'Exception in bwAttachments.js.FFMPEGConvertAndUploadMultipleVideoFiles.transcode.print_file.ffmpeg.writeFile.exec.readFile.catch():1-2: ' + JSON.stringify(e);
                                                                                console.log(msg);
                                                                                alert(msg);

                                                                            });

                                                                        }).catch(function (e) {
                                                                            alert('xcx21312312355');
                                                                        });

                                                                    } catch (e) {
                                                                        alert('xcx7777890-2');
                                                                        var msg = 'Exception in bwAttachments.js.FFMPEGConvertAndUploadMultipleVideoFiles.transcode.print_file.ffmpeg.writeFile.exec.readFile():2: ' + e.message + ', ' + e.stack;
                                                                        console.log(msg);
                                                                        alert(msg);
                                                                    }

                                                                }).catch(function (e) {

                                                                    var msg = 'Exception in bwAttachments.js.FFMPEGConvertAndUploadMultipleVideoFiles.transcode.print_file.ffmpeg.writeFile.exec.readFile.catch():1: ' + JSON.stringify(e);
                                                                    console.log(msg);

                                                                    var uploadFailure = {
                                                                        //status: 'EXCEPTION',
                                                                        //message: msg,
                                                                        inputFilename: inputFilename,
                                                                        outputFilename: outputFilename,
                                                                        //executionString: executionString,
                                                                        bwBudgetRequestId: bwBudgetRequestId
                                                                    }

                                                                    var msg = 'Exception in bwAttachments.js.FFMPEGConvertAndUploadMultipleVideoFiles.transcode.print_file.ffmpeg.writeFile.exec.readFile():1-2: FATAL EXCEPTION. PUTTING THE FILE IN THE RETRY LIST. JSON.stringify(e): ' + JSON.stringify(e) + '. uploadFailure: ' + JSON.stringify(uploadFailure);
                                                                    console.log(msg);
                                                                    displayAlertDialog_Persistent(msg);

                                                                    //
                                                                    // SINCE WE ARE OUT OF SCOPE, WE WILL FIND OUR WIDGET IN THE DOM.
                                                                    //

                                                                    var forms = $(document).find('.budgetrequestform');
                                                                    var form;
                                                                    for (var i = 0; i < forms.length; i++) {
                                                                        var attrBwBudgetRequestId = $(forms[i]).attr('bwbudgetrequestid');
                                                                        if (attrBwBudgetRequestId == bwBudgetRequestId) {
                                                                            form = forms[i];
                                                                            break;
                                                                        }
                                                                    }

                                                                    if (!form) {

                                                                        var msg = 'In bwAttachments.js.FFMPEGConvertAndUploadMultipleVideoFiles.transcode.print_file.ffmpeg.writeFile.exec.readFile.catch(). COULD NOT FIND budgetrequestform for bwBudgetRequestId: ' + bwBudgetRequestId;
                                                                        console.log(msg);
                                                                        alert(msg);
                                                                        displayAlertDialog_Persistent(msg);

                                                                    } else {

                                                                        var tmpStrJson = $('#FFMPEGMultiFile_ProcessFailures_Json').html(); // Get existing, if there is any.
                                                                        var tmpJson;

                                                                        try {
                                                                            tmpJson = JSON.parse(tmpStrJson); // Validate that it is valid JSON.
                                                                        } catch (e) {
                                                                            tmpJson = []; // If it's not valid JSON, start a new array.
                                                                        }

                                                                        tmpJson.push(uploadFailure); // Add our new one.
                                                                        $('#FFMPEGMultiFile_ProcessFailures_Json').html(JSON.stringify(tmpJson)); // Store it all back into the element.

                                                                        document.getElementById(dialogId + '_ffmpegMultiFileConvertAndUpload_retrythesefailedfiles').style.display = 'block'; // Display the button.

                                                                        var html = '';

                                                                        html += 'These files encountered an error. Click to retry: <br />';

                                                                        for (var i = 0; i < tmpJson.length; i++) {
                                                                            if (i > 0) {
                                                                                html += ', ';
                                                                            }
                                                                            html += tmpJson[i].inputFilename;
                                                                        }

                                                                        $('#FFMPEGMultiFile_ProcessFailures_Text').html(html);

                                                                    }

                                                                });

                                                            }

                                                        } catch (e) {
                                                            alert('xcx7777890-3');
                                                            var msg = 'Exception in bwAttachments.js.FFMPEGConvertAndUploadMultipleVideoFiles.transcode.print_file.ffmpeg.writeFile.exec.readFile():2: ' + e.message + ', ' + e.stack;
                                                            console.log(msg);
                                                            alert(msg);
                                                        }

                                                    }).catch(function (e) {

                                                        var msg = 'Exception in bwAttachments.js.FFMPEGConvertAndUploadMultipleVideoFiles.transcode.print_file.ffmpeg.writeFile.exec.readFile.catch():1-2: ' + JSON.stringify(e);
                                                        console.log(msg);
                                                        alert(msg);

                                                    });

                                                } catch (e) {
                                                    alert('xcx2122');
                                                    var msg = 'Exception in bwAttachments.js.FFMPEGConvertAndUploadMultipleVideoFiles.transcode.print_file.ffmpeg.writeFile.exec():2: ' + e.message + ', ' + e.stack;
                                                    console.log(msg);
                                                    alert(msg);
                                                }

                                            }).catch(function (e) {
                                                try {

                                                    //var uploadFailure = {
                                                    //    status: 'EXCEPTION',
                                                    //    message: msg,
                                                    //    inputFilename: inputFilename,
                                                    //    outputFilename: outputFilename,
                                                    //    executionString: executionString,
                                                    //    bwBudgetRequestId: bwBudgetRequestId
                                                    //}

                                                    var uploadFailure = {
                                                        //status: 'EXCEPTION',
                                                        //message: msg,
                                                        inputFilename: inputFilename,
                                                        outputFilename: outputFilename,
                                                        //executionString: executionString,
                                                        bwBudgetRequestId: bwBudgetRequestId
                                                    }

                                                    var msg = 'Exception in bwAttachments.js.FFMPEGConvertAndUploadMultipleVideoFiles.transcode.print_file.ffmpeg.writeFile.exec():1-2: FATAL EXCEPTION. PUTTING THE FILE IN THE RETRY LIST. JSON.stringify(e): ' + JSON.stringify(e) + '. uploadFailure: ' + JSON.stringify(uploadFailure);
                                                    console.log(msg);
                                                    displayAlertDialog_Persistent(msg);

                                                    //
                                                    // SINCE WE ARE OUT OF SCOPE, WE WILL FIND OUR WIDGET IN THE DOM.
                                                    //

                                                    var forms = $(document).find('.budgetrequestform');
                                                    var form;
                                                    for (var i = 0; i < forms.length; i++) {
                                                        var attrBwBudgetRequestId = $(forms[i]).attr('bwbudgetrequestid');
                                                        if (attrBwBudgetRequestId == bwBudgetRequestId) {
                                                            form = forms[i];
                                                            break;
                                                        }
                                                    }

                                                    if (!form) {

                                                        var msg = 'In bwAttachments.js.FFMPEGConvertAndUploadMultipleVideoFiles.transcode.print_file.ffmpeg.writeFile.exec.catch(). COULD NOT FIND budgetrequestform for bwBudgetRequestId: ' + bwBudgetRequestId;
                                                        console.log(msg);
                                                        alert(msg);
                                                        displayAlertDialog_Persistent(msg);

                                                    } else {

                                                        var tmpStrJson = $('#FFMPEGMultiFile_ProcessFailures_Json').html(); // Get existing, if there is any.
                                                        var tmpJson;

                                                        try {
                                                            tmpJson = JSON.parse(tmpStrJson); // Validate that it is valid JSON.
                                                        } catch (e) {
                                                            tmpJson = []; // If it's not valid JSON, start a new array.
                                                        }

                                                        tmpJson.push(uploadFailure); // Add our new one.
                                                        $('#FFMPEGMultiFile_ProcessFailures_Json').html(JSON.stringify(tmpJson)); // Store it all back into the element.

                                                        document.getElementById(dialogId + '_ffmpegMultiFileConvertAndUpload_retrythesefailedfiles').style.display = 'block'; // Display the button.

                                                        var html = '';

                                                        html += 'These files encountered an error. Click to retry: <br />';

                                                        for (var i = 0; i < tmpJson.length; i++) {
                                                            if (i > 0) {
                                                                html += ', ';
                                                            }
                                                            html += tmpJson[i].inputFilename;
                                                        }

                                                        $('#FFMPEGMultiFile_ProcessFailures_Text').html(html);

                                                    }

                                                } catch (e) {

                                                    alert('xcx44444444444');
                                                    var msg = 'Exception in bwAttachments.js.FFMPEGConvertAndUploadMultipleVideoFiles.transcode.print_file.ffmpeg.writeFile.catch(): ' + e.message + ', ' + e.stack;
                                                    console.log(msg);
                                                    alert(msg);
                                                    displayAlertDialog_Persistent(msg);

                                                }
                                            });

                                        } catch (e) {

                                            alert('xcx444578. EXCEPTION!!!!!!!!!!!');
                                            var msg = 'Exception in bwAttachments.js.FFMPEGConvertAndUploadMultipleVideoFiles.transcode.print_file.ffmpeg.writeFile():2: ' + e.message + ', ' + e.stack;
                                            console.log(msg);
                                            alert(msg);

                                        }

                                    }).catch(function (e) {

                                        //alert('xcx44432 EXCEPTION!!!!!!!!!!!!!');
                                        var msg = 'Exception in bwAttachments.js.FFMPEGConvertAndUploadMultipleVideoFiles.transcode.print_file.ffmpeg.writeFile():1: ' + JSON.stringify(e);
                                        console.log(msg);
                                        alert(msg);

                                    });

                                }

                            } catch (e) {

                                alert('xcx66668');
                                HideActivitySpinner();

                                var msg = 'Exception in bwAttachments.js.FFMPEGConvertAndUploadMultipleVideoFiles.transcode.print_file(): ' + e.message + ', ' + e.stack;
                                alert(msg);
                                displayAlertDialog(msg);

                                var result = {
                                    status: 'EXCEPTION',
                                    message: msg
                                }
                                reject(msg);

                            }

                        }

                        load_file(file);

                    } catch (e) {
                        alert('xcx99965');
                        var msg = 'Exception in bwAttachments.js.FFMPEGConvertAndUploadMultipleVideoFiles.transcode(): ' + e.message + ', ' + e.stack;
                        console.log(msg);

                        alert(msg);

                        var result = {
                            status: 'EXCEPTION',
                            message: msg
                        }
                        reject(msg);

                    }
                }

                loadTheFFMPEGWebAssembly(file);


            } catch (e) {
                alert('xcx999475');
                HideActivitySpinner();

                var msg = 'Exception in bwAttachments.js.FFMPEGConvertAndUploadMultipleVideoFiles(): ' + e.message + ', ' + e.stack;
                console.log(msg);

                alert(msg);

                var result = {
                    status: 'EXCEPTION',
                    message: msg
                }
                reject(msg);

            }
        });
    },

    issueInvoice: function (bwBudgetRequestId, requestTitle) {
        try {
            console.log('In issueInvoice(). bwBudgetRequestId: ' + bwBudgetRequestId);
            //alert('In issueInvoice(). bwBudgetRequestId: ' + bwBudgetRequestId);

            ShowActivitySpinner('Creating invoice...');

            var div = document.getElementById('divIssueAnInvoiceDialog');
            if (!div) {

                console.log('In issueInvoice(). adding element to the dom: ' + 'divIssueAnInvoiceDialog');

                div = document.createElement('div');
                div.id = 'divIssueAnInvoiceDialog';
                div.style.display = 'none';
                document.body.appendChild(div); // Place at end of document

                var html = '';

                //html += '        <table style="width:100%;">';
                //html += '            <tr>';
                //html += '                <td style="width:90%;">';
                //html += '                    <span id="spanDeleteAnAttachmentOfflineDialogTitlexx" style="color: #3f3f3f;font-size: 60pt;font-weight:bold;">Issue Invoice</span>';
                //html += '                </td>';
                //html += '                <td style="width:9%;"></td>';
                //html += '                <td style="width:1%;cursor:pointer;vertical-align:top;">';
                //html += '                    <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 120pt;font-weight:bold;" onclick="$(\'#divIssueAnInvoiceDialog\').dialog(\'close\');">X</span>';
                //html += '                </td>';
                //html += '            </tr>';
                //html += '        </table>';
                //html += '        <br /><br />';
                //html += '        <!--<span id="spanDeleteAnAttachmentOfflineDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 40pt;font-weight:bold;">Delete Slide</span>';
                //html += '        <br /><br />-->';
                html += '        <span id="span_IssueAnInvoiceDialog_InvoiceHtml" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;"></span>';
                html += '        <br />';
                html += '        <span id="spanDeleteAnAttachmentOfflineDialogTopMessagexx"></span>';
                html += '        <br />';
                html += '        <div class="divDialogButton" onclick="$(\'.bwInvoiceGrid\').bwInvoiceGrid(\'saveAsPdfAttachment\', \'' + bwBudgetRequestId + '\', \'' + requestTitle + '\');">';
                html += '           Save as PDF Attachment';
                html += '        </div>';
                html += '        <br /><br />';
                html += '        <div class="divDialogButton" onclick="$(\'.bwInvoiceGrid\').bwInvoiceGrid(\'printReceipts\', \'' + bwBudgetRequestId + '\', \'' + requestTitle + '\');">';
                html += '           Print Receipts';
                html += '        </div>';
                html += '        <br /><br />';
                html += '        <div class="divDialogButton" onclick="$(\'#divIssueAnInvoiceDialog\').dialog(\'close\');">';
                html += '           Close';
                html += '        </div>';
                html += '        <br /><br />';
                html += '        <br /><br />';

                div.innerHTML = html;
            }


            $('#divIssueAnInvoiceDialog').dialog({
                modal: true,
                resizable: false,
                closeText: "Cancel",
                closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                width: "1000", //"570px",
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {
                    try {
                        //$('.ui-widget-overlay').bind('click', function () {
                        //    $("#divIssueAnInvoiceDialog").dialog('close');
                        //});


                        console.log('xcx2132556 In divIssueAnInvoiceDialog.open().');
                        debugger;
                        var html = '';

                        html += '<div id="" xcx="xcx123426666" bwwidgetname="bwInvoiceGrid" bwHint="RENDER_FOR_PRINTED_INVOICE"></div>' // <tr class="xdTableOffsetRow bwJustificationDetailsField" bwwidgetname="bwJustificationDetailsField" id="draggablerow_3">                                                    <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px">                                <span class="xdlabel">                                    Justification Details:<br><a onclick="$('#divRequestFormDialog_98e12651-de75-4d35-afb1-0e79bcf7290c').find('.bwJustificationDetailsField').bwJustificationDetailsField('ToggleExpandJustificationDetails');">   <img id="imgExpandJustificationDetails" src="../images/plus-sign.png" style="text-align:left; cursor:pointer;width:35px;height:35px;"></a>                                </span>                            </td>                            <td class="xdTableOffsetCellComponent" style="white-space:nowrap;text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px;">                                      <div>                                        <table width="100%">                                          <tbody><tr>                                            <td colspan="2">                                              <span id="JustificationDetails" class="xdTextBoxRequired bwRequestJson" contenteditable="false" bwdatarequired="false" bwfieldname="JustificationDetails" title="" style="WORD-WRAP: break-word; HEIGHT: 90px; WHITE-SPACE: normal; OVERFLOW-X: auto; OVERFLOW-Y: auto; WIDTH: 100%;BACKGROUND-COLOR: white;font-family: 'Segoe UI Light','Segoe UI','Segoe',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 15pt;">Items included in this invoice:<br>- Video uploads, conversions, and hosting.<br>- Paid in full. Deposited check #001636 on 6-25-2023.<br><br></span>                                            </td>                                          </tr>                                        </tbody></table>                                      </div>                            </td>                                            </tr>

                        $('#span_IssueAnInvoiceDialog_InvoiceHtml').html(html);

                        var promise = $('.bwRequest').bwRequest('scrapeBwRequestJson', bwBudgetRequestId);
                        promise.then(function (results) {
                            try {
                                var bwRequestJson = JSON.stringify(results.bwRequestJson);

                                //
                                // formWidget_CustomRenderingInstructions of 'RENDER_FOR_PRINTED_INVOICE' makes the bwInvoiceGrid.js form widget render in a format that is good for printing the invoice.
                                //
                                var formWidget_CustomRenderingInstructions = [];

                                var instruction1 = {
                                    bwInvoiceGrid: {
                                        CustomRenderingInstruction: 'RENDER_FOR_PRINTED_INVOICE'
                                    }
                                };
                                formWidget_CustomRenderingInstructions.push(instruction1);

                                //var instruction2 = {
                                //    bwCommentsField: {
                                //        CustomRenderingInstruction: 'RENDER_FOR_PRINTED_INVOICE'
                                //    }
                                //};
                                //formWidget_CustomRenderingInstructions.push(instruction2);

                                $('.bwRequest').bwRequest('populateRequestForm', 'span_IssueAnInvoiceDialog_InvoiceHtml', bwRequestJson, false, formWidget_CustomRenderingInstructions); // requestDialogId, bwRequestJson, allowRequestModifications, formWidget_CustomRenderingInstructions.

                                //$('.bwRequest').bwRequest('initializeRequestFormWidgets', 'span_IssueAnInvoiceDialog_InvoiceHtml', bwRequestJson, false, false); // requestDialogId, bwRequestJson, allowRequestModifications, attachmentsAreStoredInIndexDb

                                HideActivitySpinner();

                            } catch (e) {
                                HideActivitySpinner();
                                console.log('Exception in issueInvoice():3: ' + e.message + ', ' + e.stack);
                                displayAlertDialog('Exception in issueInvoice():3: ' + e.message + ', ' + e.stack);
                            }
                        });

                    } catch (e) {
                        HideActivitySpinner();
                        console.log('Exception in issueInvoice():2: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in issueInvoice():2: ' + e.message + ', ' + e.stack);
                    }
                }
            });

            var html = '';

            html += '<table xcx="xcx3249-2" style="width:100%;" onclick="$(\'.bwRequest\').bwRequest(\'pinRequestDialog\');" ondblclick="$(\'.bwRequest\').bwRequest(\'zoomAndCenter\', \'' + 'divIssueAnInvoiceDialog' + '\');" >'; // This click event is like "pin". Once the user clicks the header of the request dialog, it no longer is modal and persists on the screen until they choose to close it.
            html += '   <tr>';
            html += '       <td style="width:95%;">';
            html += '           <div id="slider_' + bwBudgetRequestId + '" style="width:20%;cursor:pointer;"></div>';
            html += '       </td>';


            html += '       <td style="vertical-align:middle;width:5%;padding:0;border:0;margin:0;">';

            html += '       </td>';


            // Refresh button. This is good if you want to refresh and see the state of the file conversion from vob to mp4, for instance. 9-7-2022
            html += '       <td style="vertical-align:top;width:5%;padding:0;border:0;margin:0;">';
            html += '       </td>';

            html += '       <td style="vertical-align:top;width:5%;padding:0;border:0;margin:0;">';

            html += '       </td>';
            html += '       <td style="vertical-align:middle;width:5%;padding:0;border:0;margin:0;">';
            html += '           <span title="print" class="printButton" dev="xcx32424-1-0" style="font-size:18pt;cursor:pointer !important;" onclick="$(\'.bwPrintButton\').bwPrintButton(\'PrintInvoice\', \'' + 'divIssueAnInvoiceDialog' + '\', \'' + requestTitle + '\');">';
            html += '               <img src="/images/iosprinter_blue.png" style="width:50px;height:50px;cursor:pointer !important;" />';
            html += '           </span>';
            html += '       </td>';
            html += '       <td>&nbsp;&nbsp;</td>';
            html += '       <td>';
            html += '           <span class="dialogXButton" style="font-size:25pt;cursor:pointer;width:100%;font-weight:bold;" onclick="$(\'.bwPageScrollingHandler\').bwPageScrollingHandler(\'CloseDialogAndPreventNextWindowScrollEvent\', \'' + ('divIssueAnInvoiceDialog').replace('_Parent', '') + '\');">X</span>';
            html += '       </td>';
            html += '   </tr>';
            html += '</table>';
            document.getElementById('divIssueAnInvoiceDialog').parentNode.querySelector(".ui-dialog-titlebar").innerHTML = html;

            // Hide the title bar.
            //$("#divIssueAnInvoiceDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
            // Set the title.
            //document.getElementById('spanDeleteAnAttachmentOfflineDialogTitle').innerHTML = 'Delete ' + fileName;

            //// Set the click event for the Delete button.
            //$('#divDeleteAnAttachmentOfflineDialogDeleteRequestButton').off('click').click(function (error) {
            //    try {
            //        var fileserviceurl = globalUrlPrefix + globalUrlForWebServices + '/_files';
            //        var data = {
            //            FolderName: folderName,
            //            FileName: fileName
            //        };
            //        var operationUri = fileserviceurl + "/deleteaslide";
            //        $.ajax({
            //            url: operationUri,
            //            type: "POST",
            //            data: data,
            //            headers: {
            //                "Accept": "application/json; odata=verbose"
            //            },
            //            success: function (data) {
            //                try {
            //                    $("#divIssueAnInvoiceDialog").dialog('close');

            //                    if (JSON.stringify(data).toUpperCase().indexOf('THE SLIDE WAS DELETED') > -1) {

            //                        $('.bwSlideshowAdmin').bwSlideshowAdmin('loadFoldersAndFiles'); // Reload and redraw.

            //                    } else {

            //                        alert(data);
            //                        $('.bwSlideshowAdmin').bwSlideshowAdmin('loadFoldersAndFiles'); // Reload and redraw.

            //                    }
            //                } catch (e) {
            //                    console.log('Exception in bwCampaign.js.deleteSlide.post.removeattachment.success(): ' + e.message + ', ' + e.stack);
            //                    displayAlertDialog('Exception in bwCampaign.js.deleteSlide.post.removeattachment.success(): ' + e.message + ', ' + e.stack);
            //                }
            //            },
            //            error: function (data, errorCode, errorMessage) {
            //                console.log('Error in bwCampaign.js.deleteSlide.post.removeattachment.error(): ' + e.message + ', ' + e.stack);
            //                displayAlertDialog('Error in bwCampaign.js.deleteSlide.post.removeattachment.error(): bwBudgetRequestId: ' + bwBudgetRequestId + ', filename: ' + filename + ', errorMessage: ' + errorMessage);
            //            }
            //        });
            //    } catch (e) {
            //        console.log('Exception in bwCampaign.js.cmdDeleteSlide.deletebutton.click(): ' + e.message + ', ' + e.stack);
            //        displayAlertDialog('Exception in bwCampaign.js.cmdDeleteSlide.deletebutton.click(): ' + e.message + ', ' + e.stack);
            //    }
            //});

        } catch (e) {
            HideActivitySpinner();
            console.log('Exception in issueInvoice(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in issueInvoice(): ' + e.message + ', ' + e.stack);
        }
    },
    markAsPaid_OnChange: function (element) {
        try {
            console.log('In markAsPaid_OnChange().');

            var isPaid = element.checked;

            this.options.jsonData["bwInvoiceGrid"]["isPaid"] = isPaid;

            if (isPaid == true) {

                document.getElementById('bwInvoiceGrid_PaidInFullSection_' + this.options.elementIdSuffix).style.display = 'inline';

            } else {

                document.getElementById('bwInvoiceGrid_PaidInFullSection_' + this.options.elementIdSuffix).style.display = 'none';

            }

            //displayAlertDialog('this.options.jsonData["bwInvoiceGrid"]: ' + JSON.stringify(this.options.jsonData["bwInvoiceGrid"]));

        } catch (e) {
            console.log('Exception in markAsPaid_OnChange(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in markAsPaid_OnChange(): ' + e.message + ', ' + e.stack);
        }
    },
  
    renderAndPopulateInvoiceGrid: function () {
        try {
            console.log('In renderAndPopulateInvoiceGrid().');

            //widgetOptions = {
            //    displayContext: 'printed_invoice1',
            //    jsonData: jsonData, // this only send the data required for the particular widget.
            //    allowRequestModifications: allowRequestModifications,
            //    bwRequestJson: bwRequestJson,
            //    renderAsARequiredField: renderAsARequiredField,
            //    customRenderingInstructions: formWidget_CustomRenderingInstructions
            //    //attachmentsAreStoredInIndexDb: attachmentsAreStoredInIndexDb // attachmentsAreStoredInIndexDb is being passed to the bwAttachments widget... need to know if using file services of IndexDb.
            //};


            //alert('In renderAndPopulateInvoiceGrid(). this.options.customRenderingInstructions: ' + JSON.stringify(this.options.customRenderingInstructions) + ', this.options.displayContext: ' + this.options.displayContext);
            var thiz = this;
            var html = '';

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            debugger; // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
            if (this.options.customRenderingInstruction && (this.options.customRenderingInstruction == 'RENDER_FOR_PRINTED_INVOICE')) {

                var workflowAppTitle = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTitle');

                var requestNumber = this.options.bwRequestJson.Title.split('-')[1];

                var imagePath;

                var preventCachingGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });

                var activeStateIdentifier = JSON.parse($('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier'));

                if (activeStateIdentifier.status != 'SUCCESS') {

                    imagePath += '[No image. Unauthorized. xcx213124-3-6664323]';

                } else {

                    imagePath = thiz.options.operationUriPrefix + '_files/' + workflowAppId + '/orgimages/root/orgimage.png?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier;

                }

                var invoiceDate = bwCommonScripts.getBudgetWorkflowStandardizedDate_NoTime(new Date());

                html += `<table style="width: 950px; background-color: white; background: #ffffff none repeat scroll 0 0; border-bottom: 12px solid #333333; border-top: 12px solid #9f181c; margin-top: 50px; margin-bottom: 50px; padding: 40px 30px !important; position: relative; box-shadow: 0 1px 21px #acacac; color: #333333; font-family: open sans;">
        <tr>
            <td style="float:right;font-size:40pt;font-weight:bold;font-family:Calibri;color:gray;opacity:50%;">INVOICE # ` + requestNumber + `</td>
        </tr>
        <tr>
            <td style="float: right; font-size: 20pt; font-weight: bold; font-family: Calibri; color: black; opacity: 50%;">
                Date: <input id="bwInvoiceGrid_InvoiceIssuedDate_` + this.options.elementIdSuffix + `" type="text" value="` + invoiceDate + `" style="font-size: 20pt; font-weight: bold; font-family: Calibri; color: black; opacity: 50%;" />
            </td>
        </tr>
        <tr>
            <td>&nbsp;</td>
        </tr>
        <tr>
            <td>&nbsp;</td>
        </tr>
        <tr>
            <td>
                <div style="float: left; font-size: 15pt; font-weight: bold; font-family: Calibri; color: black; ">
                    FROM: ` + workflowAppTitle + `<br />
                    61 Crescent Avenue, Kentville,<br />
                    Nova Scotia, Canada. B4N 1R1<br />
                    Tel/text 902-385-1968<br />
                    todd_hiltz@hotmail.com<br />
                </div>
                <div style="float: right; font-size: 15pt; font-weight: bold; font-family: Calibri; color: black; ">
                    TO: Huntley's Diving & Marine Services<br />
                    245 Main Street, Kentville,<br />
                    Nova Scotia, Canada. B4N 1J6<br />
                </div>
            </td>
        </tr>
        <tr>
            <td>&nbsp;</td>
        </tr>
        <tr>
            <td>&nbsp;</td>
        </tr>
        <tr>
            <td>
                <table style="width:100%;">
                    <thead>
                        <tr style="font-size: 30pt; font-family: Calibri; color: white; background-color:lightsteelblue;">
                            <th style="text-align: left; padding-left: 25px; width: 40%; ">Description</th>
                            <th style="width: 20%; text-align: right;padding:0 10px 0 10px;">Amount</th>
                            <th style="width: 20%; text-align: right; padding: 0 10px 0 10px;">Tax</th>
                            <th style="width: 20%; text-align: right; padding: 0 10px 0 10px;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>`;

                var totalDue = 0;
                for (var i = 0; i < this.options.bwRequestJson.bwInvoiceGrid.value.length; i++) {

                    html += `
                        <tr>
                            <td style="font-size: 20pt; font-weight: bold; font-family: Calibri; color: gray; padding-left: 25px; padding-top: 10px; text-align: left;">` + this.options.bwRequestJson.bwInvoiceGrid.value[i].Description + `</td>
                            <td style="font-size: 20pt; font-weight: bold; font-family: Calibri; color: gray; margin-right: 25px; text-align: right;">` + formatCurrency(this.options.bwRequestJson.bwInvoiceGrid.value[i].Amount) + `</td>
                            <td style="font-size: 20pt; font-weight: bold; font-family: Calibri; color: gray; margin-right: 25px; text-align: right;">` + formatCurrency(this.options.bwRequestJson.bwInvoiceGrid.value[i].Tax) + `</td>
                            <td style="font-size: 20pt; font-weight: bold; font-family: Calibri; color: gray; margin-right: 25px; text-align: right;">` + formatCurrency(this.options.bwRequestJson.bwInvoiceGrid.value[i].Total) + `</td>                            
                        </tr>`;

                    totalDue += this.options.bwRequestJson.bwInvoiceGrid.value[i].Total;
                }

                html += `
                        </tr>
                        <tr>
                            <td colspan="4">&nbsp;</td>
                        </tr>
                        <tr>
                            <td colspan="3" style="font-size: 20pt; font-weight: bold; font-family: Calibri; color: gray; padding-left: 25px; text-align: left; text-align: right;">Total Due</td>
                            <td style="font-size: 20pt; font-weight: bold; font-family: Calibri; color: gray; margin-right: 25px; text-align: right;">` + formatCurrency(totalDue) + `</td>
                        </tr>
                    </tbody>
                </table>
                <br />
                <hr />`;

                if (this.options.bwRequestJson.bwInvoiceGrid.isPaid == true) {

                    html += `Paid in full on July xx, 2023.`;

                }


                html += `
            </td>
        </tr>
    </table>`;


                // Render the html.
                if (this.options.inFormsEditor != true) {
                    // THIS IS VERY IMPORTANT AND NEEDS TO BE IN EVERY WIDGET!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 7-12-2020
                    // Even though the widget regenerates itself (re-renders), the parent TR tag gets missed!!! Therefore we have to handle getting rid of our form editor draggable attribute here.
                    this.element.closest('tr').removeAttr('draggable');
                }
                this.element.html(html);

                $('#bwInvoiceGrid_InvoiceIssuedDate_' + this.options.elementIdSuffix).datepicker();

            } else {


                //
                //
                // this.options.displayContext 11-18-2023
                //
                //


                // displayContext allows us to render depending on where this widget is going. Possible values:
                //      - 'form'. This is when the invoice widget is displayed in a request form, along with other form widgets. If no value is specified, then the default is 'form'.
                //      - 'dialog'. This is when the invoice widget is displayed in it's own dialog. This happens when the user is viewing a request, and clicks the magnifying glass button invoking viewInLargeWindow().
                //      - 'window'. This is when the user selects the '↸' button to view in a popped-out window, invoking LaunchIntoSeparateWindow().
                //      - 'printed_invoice1'. This is when the user selects the 'Issue Invoice' button when viewing a request, invoking issueInvoice().

                var displayContexts = ['form', 'dialog', 'window', 'printed_invoice1'];




                //this.options.displayContext = 'form';


                //alert('xcx21341 this.options.displayContext: ' + this.options.displayContext);

                if (!(this.options.displayContext && (displayContexts.indexOf(this.options.displayContext) > -1))) {

                    console.log('****** Error in bwInvoiceGrid.js.renderAndPopulateInvoiceGrid(). Invalid value for displayContext: ' + this.options.displayContext);
                    //alert('Error in bwInvoiceGrid.js.renderAndPopulateInvoiceGrid(). Invalid value for displayContext: ' + this.options.displayContext);

                } else if (this.options.displayContext === 'form') {

                    //
                    //
                    // THIS IS WHERE WE RENDER TEH WIDGET FOR displayContext == 'form'.
                    //
                    //


                    // This is our data grid section. THE WIDTH IS SET HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                    //html += '<table style="width:100px;">';
                    //html += '<tbody>';
                    //html += '   <tr class="xdTableOffsetRow xdTableOffsetRow-editor" id="toolboxdraggablerow_2" draggable="true" bwwidgetname="bwInvoiceGrid" bwfieldname="bwInvoiceGrid">';
                    //html += '       <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px;white-space:nowrap;">';

                    // COMMENTED OUT THE ABOVE AND RELACED HERE 10-24-2023.
                    html += '<table style="height:100%;vertical-align:top;">';
                    html += '   <tbody>';
                    html += '       <tr xcx="xcx21342526-1-3" id="xcx21342526-1-3" class="xdTableOffsetRow xdTableOffsetRow-editor" id="toolboxdraggablerow_2" draggable="true" bwwidgetname="bwInvoiceGrid">';
                    html += '           <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px;height:100%;">';

                    //html += '           <span class="xdlabel">';
                    //html += '               Invoice Items:';
                    //html += '           </span>';
                    //if (this.options.inFormsEditor == true) {
                    //    html += '       <span class="ToggleRequiredAsterisk" title="Select this asterick to make this a required field." onclick="$(\'.bwFormsEditor\').bwFormsEditor(\'toggleFormRequiredField\', this);">*</span>';
                    //} else if (this.options.renderAsARequiredField == true) {
                    //    html += '       <span style="color:red;font-size:medium;">*</span>';
                    //} else if (this.options.renderAsARequiredField == false) {
                    //    //
                    //}

                    html += '               <table style="height:100%;">';
                    html += '                   <tr style="height:1%;">';
                    html += '                       <td style="vertical-align:top;">';
                    html += '                           <span class="xdlabel" style="color:black;">';
                    html += '                               Invoice Items:';
                    html += '                           </span>';
                    if (this.options.inFormsEditor == true) {
                        html += '       <span class="ToggleRequiredAsterisk" title="Select this asterick to make this a required field." onclick="$(\'.bwFormsEditor\').bwFormsEditor(\'toggleFormRequiredField\', this);">*</span>';
                    } else if (this.options.renderAsARequiredField == true) {
                        html += '       <span style="color:red;font-size:medium;">*</span>';
                    } else if (this.options.renderAsARequiredField == false) {
                        //
                    }
                    html += '                       </td>';
                    html += '                   </tr>';
                    html += '                   <tr style="height:99%;">';
                    html += '                       <td style="vertical-align:top;">';

                    if (/(iPad|iPhone|iPod)/g.test(navigator.userAgent)) {
                        // Don't display this section on iPad, iPhone, iPod.
                    } else {

                        html += '                           <table id="dropzone1" contenteditable="true" style="height:100%;border:1px solid goldenrod;background-color:#f6f6f6;color:gray;font-size:10pt;">';
                        html += '                               <tr>';
                        html += '                                   <td style="vertical-align:middle;">';
                        html += '                                       <span style="color:goldenrod;">Drag-and-drop, or right-click to paste attachments here.</span>';
                        html += '                                   </td>';
                        html += '                               </tr>';
                        html += '                           </table>';

                    }

                    html += '                       </td>';
                    html += '                   </tr>';
                    html += '               </table>';

                    html += '       </td>';
                    html += '       <td class="xdTableOffsetCellComponent" style="white-space:nowrap;text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px;">';
                    html += '           <table>';
                    html += '               <tr>';
                    html += '                   <td>';
                    html += '                       <div id="jsGridCosts_small" style="font-size:60%;"></div>';
                    html += '                   </td>';
                    html += '                   <td style="vertical-align:top;">';
                    if (this.options.inFormsEditor != true) {
                        //var bwBudgetRequestId = $(thiz.element).closest('#budgetrequestform')[0].getAttribute('bwbudgetrequestid');
                        //var requestDialogId = 'divRequestFormDialog_' + bwBudgetRequestId;

                        //alert('xcx2131234123 this.options.jsonData: ' + JSON.stringify(this.options.jsonData));
                        html += '                       <span style="font-size:20pt;cursor:zoom-in;" onclick="$(\'#' + this.options.jsonData.requestDialogId + '\').find(\'.bwInvoiceGrid\').bwInvoiceGrid(\'viewInLargeWindow\');"><img class="gridMagnifyingGlass" src="/images/zoom.jpg" style="width:50px;height:50px;" /></span>';
                    }
                    html += '                   </td>';
                    html += '               </tr>';

                    html += '<tr>';
                    html += '   <td>';
                    html += '       <span class="xdlabel" id="spanBwCostsGrid_Error" style="color:tomato;white-space:normal;" hidefocus="1"></span>'; // Errors and exceptions get displayed here.
                    html += '   </td>';
                    html += '</tr>';


                    html += '               <tr class="xdTableOffsetRow2">';
                    html += '                   <td class="xdTableOffsetCellLabel" style="text-align:right; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px;BORDER-BOTTOM: #d8d8d8 1pt solid;">';
                    html += '                       <span class="xdlabel" style="font-size:12pt;">Invoice Total:</span>';
                    html += '                           &nbsp;&nbsp;';
                    html += '                           <input id="grandTotal_small" disabled contenteditable="false" style="color:orange;font-weight:bold;WIDTH: 140px;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 18pt;TEXT-ALIGN: right;" type="text" />';
                    html += '                   </td>';
                    html += '               </tr>';

                    html += '               <tr>';
                    html += '                   <td>';

                    html += '<div style="float:left;">';
                    if (thiz.options.jsonData["bwInvoiceGrid"] && thiz.options.jsonData["bwInvoiceGrid"].isPaid) {
                        // Thi sinvoice has been paid, so indicate that with the checkox.
                        html += '<input id="checkbox_BwInvoiceGrid" type="checkbox" checked="checked" style="cursor:pointer;font-size: 14pt;" onclick="$(\'.bwInvoiceGrid\').bwInvoiceGrid(\'markAsPaid_OnChange\', this);">';
                    } else {
                        // no data yet
                        html += '<input id="checkbox_BwInvoiceGrid" type="checkbox" style="cursor:pointer;font-size: 14pt;" onclick="$(\'.bwInvoiceGrid\').bwInvoiceGrid(\'markAsPaid_OnChange\', this);">';
                    }
                    html += '&nbsp;';
                    html += 'Mark as paid in full<br />';

                    html += `<div id="bwInvoiceGrid_PaidInFullSection_` + this.options.elementIdSuffix + `">Paid on 
                            <input autocomplete="off" id="dtInvoicePaidDate_` + this.options.elementIdSuffix + `" style="cursor:pointer;WIDTH: 135px;font-family: 'Segoe UI Light','Segoe UI','Segoe',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;TEXT-ALIGN: left;" type="text" >
                            <br />
                            <div id="">
                                <input id="divRequestFormDialog_aa70fb13-b937-487c-918a-49c51d64c1a0_buttonEmailAttachmentsExternally" type="button" style="display: inline; padding: 5px 10px;" value="Select image(s) to display on the invoice..." title="" class="BwButton450" 
                                    onclick="$('.bwInvoiceGrid').bwInvoiceGrid('copyAttachmentsToInvoice', this);">
                            </div>
                        </div>`;

                    html += '</div>';

                    html += '<div style="float:right;">';


                    var bwBudgetRequestId;
                    if ($(thiz.element).closest('#budgetrequestform')[0]) {
                        bwBudgetRequestId = $(thiz.element).closest('#budgetrequestform')[0].getAttribute('bwbudgetrequestid');
                    }
                    //var bwBudgetRequestId = $(thiz.element).closest('#budgetrequestform')[0].getAttribute('bwbudgetrequestid');

                    if (this.options.bwRequestJson && this.options.bwRequestJson.Title) {
                        html += '<input type="button" style="cursor:pointer;font-size: 14pt;" value="Issue Invoice" onclick="$(\'.bwInvoiceGrid\').bwInvoiceGrid(\'issueInvoice\', \'' + bwBudgetRequestId + '\', \'' + this.options.bwRequestJson.Title + '\');">';
                    }
                    html += '</div>';

                    html += '                   </td>';
                    html += '               </tr>';

                    html += '           </table>';
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
                    debugger;
                    this.element.html(html);

                    //var dateElement = $('#dtInvoicePaidDate_' + this.options.elementIdSuffix);
                    $('#dtInvoicePaidDate_' + this.options.elementIdSuffix).datepicker({ dateFormat: 'd MM y' }); // { dateFormat: 'd MM y' }); // MM d, y // Why can't I get this to work????? Maybe it is just for output?? Hmmmm......

                    setTimeout(function () {
                        try {
                            $('#dtInvoicePaidDate_' + thiz.options.elementIdSuffix).on('change', function (e) {
                                try {
                                    alert('xcx1234235');
                                    var val = $(this).val();

                                    alert('xcx33335678 In in bwInvoiceGrid.js.dtInvoicePaidDate_.change(). val: ' + val);
                                } catch (e) {
                                    console.log('Exception in bwInvoiceGrid.js.dtInvoicePaidDate_.change(): ' + e.message + ', ' + e.stack);
                                    alert('Exception in bwInvoiceGrid.js.dtInvoicePaidDate_.change(): ' + e.message + ', ' + e.stack);
                                }
                            });
                        } catch (e) {
                            console.log('Exception in bwInvoiceGrid.js.dtInvoicePaidDate_.change(): ' + e.message + ', ' + e.stack);
                            alert('Exception in bwInvoiceGrid.js.dtInvoicePaidDate_.change(): ' + e.message + ', ' + e.stack);
                        }
                    }, 5000);


                    //$('#dtInvoicePaidDate_' + this.options.elementIdSuffix).input(function (e) {
                    //    try {
                    //        alert('xcx1234235');
                    //        var val = $(this).val();

                    //        alert('xcx33335678 In in bwInvoiceGrid.js.dtInvoicePaidDate_.change(). val: ' + val);

                    //        ////debugger; // This needs to check if it has to re-render the spend forecast!
                    //        //console.log('In dtEstimatedStartDate.change()xcx1. This needs to check if it has to re-render the spend forecast! value: ' + e.target.value);
                    //        //var startDate = thiz.getData();
                    //        ////var endDate = $(this.element).find("#dtEstimatedEndDate").datepicker('getData');
                    //        //var endDate = $('.bwEndDatePicker').bwEndDatePicker('getData');
                    //        //if (startDate !== null && endDate !== null) { // if any date selected in datepicker
                    //        //    var daysTotal = Date.daysBetween(startDate, endDate);
                    //        //    console.log('daysTotal: ' + daysTotal);
                    //        //    if (daysTotal == -1)
                    //        //        //lblDateRange.SetText("Invalid date range");
                    //        //        //document.getElementById('numberOfDays').value = 'Invalid date range';
                    //        //        console.log('Invalid date range');
                    //        //    else
                    //        //        //lblDateRange.SetText(daysTotal + " days");
                    //        //        //document.getElementById('numberOfDays').value = daysTotal + ' days';
                    //        //        console.log(daysTotal + ' days');
                    //        //}
                    //        ////thiz.options.store.EstimatedStartDate = startDate;
                    //        //$('.bwSpendGrid').bwSpendGrid('renderAndPopulateSpendGrid');

                    //        //thiz.recalculate(); // 7-12-2020

                    //    } catch (e) {
                    //        console.log('Exception in bwInvoiceGrid.js.dtInvoicePaidDate_.change(): ' + e.message + ', ' + e.stack);
                    //        alert('Exception in bwInvoiceGrid.js.dtInvoicePaidDate_.change(): ' + e.message + ', ' + e.stack);
                    //    }
                    //});



                    var dropzone = $(this.element).find('#dropzone1');

                    // We haven't put the 'paste' event here yet.... find it in bwAttachments.....it may not be finished... 10-24-2023.

                    $(dropzone).off('drop').on('drop', function (e) {
                        try {
                            console.log('In bwInvoiceGrid.js.renderAndPopulateInvoiceGrid.dropzone.drop().');

                            setTimeout(function () {
                                try {
                                    var imgElement = $(thiz.element).find('#dropzone1 img');
                                    var imgSrc = $(thiz.element).find('#dropzone1 img')[0].src;

                                    var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                                        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                                        return v.toString(16);
                                    });

                                    // https://bl.ocks.org/nolanlawson/0eac306e4dac2114c752 
                                    var dataUrl = imgSrc.split(',')
                                    var base64 = dataUrl[1];

                                    if (!base64) {

                                        console.log('In bwInvoiceGrid.js.renderAndPopulateInvoiceGrid.dropzone.drop(). No base64 in the img src or this element. It must be a http reference... imgSrc: ' + imgSrc);

                                        //
                                        // Here we check to see if the URL is an internal URL. If so, we are copying a file from one request, and pasting it into another.
                                        // In other words, this means the user has dragged a file from one request, to another request. We will make this a CUT operation, because it seems this is th euse case.
                                        // Use case: A receipt image is attached to a request type of "Invoice". The user drag-and-drops it to another request. Therefore a CUT operation.
                                        //

                                        // Example imgSrc: https://shareandcollaborate.com/_files/c48535a4-9a6b-4b95-9d67-c6569e9695d8/8b6e9b8f-5b06-4cd7-ae10-340242abd47f/receipt%20-%2010-11-2023%20-%20breakfast%20-%20a%20whopper%20from%20burger%20king.jpg_320px_.jpg?v=5f511b64-b8ad-4bcf-86bc-398223003556&ActiveStateIdentifier=4710a0b6-aa6e-4414-b593-db8a37326558

                                        var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

                                        var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                                        var strUrlWithWorkflowAppId = 'https://shareandcollaborate.com/_files/' + workflowAppId + '/';
                                        var strActiveStateIdentifierInUrl = '&ActiveStateIdentifier=' + JSON.parse(activeStateIdentifier).ActiveStateIdentifier;

                                        if ((imgSrc.indexOf(strUrlWithWorkflowAppId) > -1) && (imgSrc.indexOf(strActiveStateIdentifierInUrl) > -1)) {

                                            //
                                            // Yes, the user is dragging and dropping an attachment from one request to another. 10-22-2023.
                                            //
                                            // CALL THIS METHOD:
                                            // router.put('/_files/bwCutAndPaste_Attachment', function (request, response) {
                                            //

                                            console.log('In bwInvoiceGrid.js.renderAndPopulateInvoiceGrid.dropzone.drop(). Yes the user is dragging and dropping an attachment from one request to another. This is a CUT operation... imgSrc: ' + imgSrc);

                                            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
                                            var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');
                                            var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');

                                            var tmp1 = imgSrc.split(strUrlWithWorkflowAppId)[1];
                                            var bwBudgetRequestId_Origin = tmp1.split('/')[0];
                                            var fileNameToCutAndPaste_Thumbnail = tmp1.split('/')[1].split('?')[0];

                                            //alert('xcx12132123-1. In bwInvoiceGrid.js.renderAndPopulateInvoiceGrid.dropzone.drop(). bwBudgetRequestId_Origin: ' + bwBudgetRequestId_Origin + ', fileNameToCutAndPaste_Thumbnail: ' + fileNameToCutAndPaste_Thumbnail + '. THE URL HAS THE THUMBNAIL... WE NEED TO PARSE THE FILE NAME AND GET THE ORIGINAL FILE NAME.');

                                            //
                                            //  Example fileNameToCutAndPaste: 20231022_101929.mp4_thumbnail_.jpg
                                            //
                                            // THE URL HAS THE THUMBNAIL... WE NEED TO PARSE THE FILE NAME AND GET THE ORIGINAL FILE NAME. 10-23-2023
                                            //
                                            //
                                            var fileNameToCutAndPaste = fileNameToCutAndPaste_Thumbnail;

                                            if (fileNameToCutAndPaste_Thumbnail.indexOf('_thumbnail_.jpg') > -1) {
                                                fileNameToCutAndPaste = fileNameToCutAndPaste_Thumbnail.split('_thumbnail_.jpg')[0];
                                            } else if (fileNameToCutAndPaste_Thumbnail.indexOf('_320px_.png') > -1) {
                                                fileNameToCutAndPaste = fileNameToCutAndPaste_Thumbnail.split('_320px_.png')[0];
                                            }

                                            var form = $(thiz.element).closest('.budgetrequestform')[0];
                                            var bwBudgetRequestId_Destination = $(form)[0].getAttribute('bwbudgetrequestid');

                                            console.log('DEV: READY TO CALL WEB SERVICE [bwCutAndPaste_Attachment]. In bwInvoiceGrid.js.renderAndPopulateInvoiceGrid.dropzone.drop(). fileNameToCutAndPaste: ' + fileNameToCutAndPaste + ', bwBudgetRequestId_Origin: ' + bwBudgetRequestId_Origin + ', bwBudgetRequestId_Destination: ' + bwBudgetRequestId_Destination);

                                            var data = {
                                                bwParticipantId_LoggedIn: participantId,
                                                bwActiveStateIdentifier: activeStateIdentifier,
                                                bwWorkflowAppId_LoggedIn: workflowAppId,

                                                bwWorkflowAppId: workflowAppId,

                                                FileNameToCutAndPaste: fileNameToCutAndPaste,
                                                bwBudgetRequestId_Origin: bwBudgetRequestId_Origin,
                                                bwBudgetRequestId_Destination: bwBudgetRequestId_Destination,

                                                bwParticipantId: participantId,
                                                bwParticipantFriendlyName: participantFriendlyName,
                                                bwParticipantEmail: participantEmail
                                            };

                                            var operationUri = thiz.options.operationUriPrefix + '_files/' + 'bwCutAndPaste_Attachment'; // _files allows us to use nginx to route these to a dedicated file server.
                                            $.ajax({
                                                url: operationUri,
                                                type: 'POST',
                                                data: data,
                                                headers: { "Accept": "application/json; odata=verbose" },
                                                success: function (results) {
                                                    try {

                                                        // Now we have to call "renderAndPopulateAttachments()" for both of the requests.

                                                        var requestCounter = 0;

                                                        var forms = $(document).find('.budgetrequestform');

                                                        for (var i = 0; i < forms.length; i++) {
                                                            var bwBudgetRequestId_Temp = $(forms)[i].getAttribute('bwbudgetrequestid');
                                                            if ((bwBudgetRequestId_Temp == bwBudgetRequestId_Origin) || (bwBudgetRequestId_Temp == bwBudgetRequestId_Destination)) {
                                                                requestCounter += 1;
                                                                $(forms[i]).find('.bwAttachments').bwAttachments('renderAndPopulateAttachments'); // Call this method for this specific widget. This will re-generate the gold colored drag-and-drop section... etc...
                                                            }
                                                        }

                                                        if (requestCounter == 2) {
                                                            displayAlertDialog('COMPLETED CUT AND PASTE xcx90809898. requestCounter: ' + requestCounter + ', results: ' + JSON.stringify(results));
                                                        } else {
                                                            console.log('ERROR COMPLETING CUT AND PASTE xcx90809898. Expected a value of 2 for requestCounter: ' + requestCounter + ', results: ' + JSON.stringify(results));
                                                            alert('ERROR COMPLETING CUT AND PASTE xcx90809898. Expected a value of 2 for requestCounter: ' + requestCounter + ', results: ' + JSON.stringify(results));
                                                        }

                                                    } catch (e) {
                                                        console.log('Exception in bwInvoiceGrid.js.renderAndPopulateInvoiceGrid.dropzone.drop():2: ' + e.message + ', ' + e.stack);
                                                        displayAlertDialog('Exception in bwInvoiceGrid.js.renderAndPopulateInvoiceGrid.dropzone.drop():2: ' + e.message + ', ' + e.stack);
                                                        $(this.element).find('#newrequestattachments')[0].innerHTML = 'Exception in bwInvoiceGrid.js.renderAndPopulateInvoiceGrid.dropzone.drop():2: ' + e.message + ', ' + e.stack;
                                                    }
                                                },
                                                error: function (data, errorCode, errorMessage) {
                                                    $('#divWorkingOnItDialog').dialog('close'); // Close the "Working on it..." dialog.
                                                    console.log('Error in bwInvoiceGrid.js.renderAndPopulateInvoiceGrid.dropzone.drop(): ' + errorMessage);
                                                    debugger;
                                                    if (errorMessage == 'timeout') {
                                                        displayAlertDialog('The file server could not be contacted. Please try again in a few minutes.');
                                                    } else {
                                                        displayAlertDialog('Error in bwInvoiceGrid.js.renderAndPopulateInvoiceGrid.dropzone.drop(): ' + errorMessage);
                                                    }
                                                }
                                            });

                                        } else {

                                            fetch(imgSrc)
                                                .then(function (res) {
                                                    try {
                                                        res.blob();
                                                    } catch (e) {
                                                        alert('Exception xcx21312312 ' + e.message + ', ' + e.stack);

                                                        imgElement.remove(); // Remove the img element which is displaying the pasted image.
                                                    }
                                                })
                                                .then(function (blob) {
                                                    try {
                                                        const f = new File([blob], 'dot.png', blob);

                                                        var fileInput = document.getElementById('inputFile_' + bwBudgetRequestId);

                                                        if (!fileInput) {

                                                            var imgSrc2 = $(thiz.element).find('#dropzone1 img')[0].src;

                                                            alert('Error in bwInvoiceGrid.js.renderAndPopulateInvoiceGrid.dropzone.drop(). Cannot find element: inputFile_' + bwBudgetRequestId + ', imgSrc2: ' + imgSrc2);


                                                        }

                                                        var tst = new DataTransfer();
                                                        tst.items.add(f);
                                                        fileInput.files = tst.files;

                                                        console.log('fileInput.files.length: ' + fileInput.files.length);

                                                        //imgElement.remove(); // Remove the img element which is displaying the pasted image.

                                                        thiz.uploadAttachment('newrequestattachments', requestDialogId, bwBudgetRequestId);

                                                    } catch (e) {
                                                        alert('Exception in bwInvoiceGrid.js.renderAndPopulateInvoiceGrid.dropzone.drop(). xcx215343: ' + e.message + ', ' + e.stack);

                                                        imgElement.remove(); // Remove the img element which is displaying the pasted image.
                                                    }

                                                })
                                                .catch(function (e) {

                                                    alert('Exception from psomise xcx87987 ' + e + ', Exception when fetching "' + imgSrc + '".');
                                                    imgElement.remove(); // Remove the img element which is displaying the pasted image.

                                                });

                                        }

                                    } else {

                                        var mime = dataUrl[0].match(/:(.*?);/)[1];
                                        var bin = atob(base64);
                                        var length = bin.length;
                                        // From http://stackoverflow.com/questions/14967647/ (continues on next line)
                                        // encode-decode-image-with-base64-breaks-image (2013-04-21)
                                        var buf = new ArrayBuffer(length);
                                        var arr = new Uint8Array(buf);
                                        bin
                                            .split('')
                                            .forEach(function (e, i) { arr[i] = e.charCodeAt(0) });


                                        var f = new File([buf], guid, { type: mime }); // note: [buf] //let f = new File([buf],'filename',{type:mime}); // note: [buf]
                                        var blobUrl = URL.createObjectURL(f);
                                        //let link = document.createElement("a"); 
                                        //link.href = blobUrl;
                                        //link.download = guid; //link.download = "filename";
                                        //link.innerHTML = "Download file.";
                                        //document.getElementById("url1").appendChild(link);

                                        imgElement.remove(); // Remove the img element which is displaying the pasted image.

                                        var fileInput = document.getElementById('inputFile_' + bwBudgetRequestId);


                                        var tst = new DataTransfer();
                                        tst.items.add(f);
                                        fileInput.files = tst.files;



                                        console.log('fileInput.files.length: ' + fileInput.files.length);

                                        thiz.uploadAttachment('newrequestattachments', requestDialogId, bwBudgetRequestId);

                                    }

                                    //fileInput.files = e.dataTransfer.files;

                                    //const myFile = new File(['Hello World!'], 'myFile.txt', {
                                    //    type: 'text/plain',
                                    //    lastModified: new Date(),
                                    //});

                                    //// Now let's create a DataTransfer to get a FileList
                                    //const dataTransfer = new DataTransfer();
                                    //dataTransfer.items.add(myFile);
                                    //fileInput.files = dataTransfer.files;





                                } catch (e) {
                                    alert('Exception in drop xcx1214124: ' + e.message + ', ' + e.stack);
                                }
                            }, 1000);

                        } catch (e) {
                            alert('Exception in drop xcx123124235: ' + e.message + ', ' + e.stack);
                        }
                    });

                    //$('#dtInvoicePaidDate_' + this.options.elementIdSuffix).datepicker('option', 'dateFormat', 'MM d, y'); // MM d, y

                    // If we have jsonData, populate the element.
                    if (thiz.options.jsonData["bwInvoiceGrid"]) {
                        // already have data
                        if (thiz.options.jsonData["bwInvoiceGrid"].value) {

                        } else {
                            thiz.options.jsonData["bwInvoiceGrid"]["value"] = [];
                        }
                    } else {
                        // no data yet
                        thiz.options.jsonData["bwInvoiceGrid"] = {
                            value: []
                        }
                    }

                    $(this.element).find("#jsGridCosts_small").jsGrid({
                        width: "100%",
                        maxHeight: 'auto',

                        inserting: true,
                        editing: true,
                        sorting: true,
                        paging: true,

                        confirmDeleting: false, // false prevents the alert from popping up

                        data: thiz.options.jsonData["bwInvoiceGrid"].value, //json, // clients
                        noDataContent: "Click the \"Plus\" (<span style='color:green;font-weight:bold;font-size:x-large;'>+</span>) sign to add a Cost item...",

                        onInit: function () {
                            try {
                                //debugger;
                                console.log('In bwInvoiceGrid.onInit-small().');
                                //var grandTotal = Number(0);
                                //for (var i = 0; i < this.data.length; i++) { // Iterate through the rows and calculate the totals and grand total.
                                //    var total = Number(0);
                                //    if (this.data[i].Lease) total += Number(this.data[i].Lease);
                                //    if (this.data[i].Expense) total += Number(this.data[i].Expense);
                                //    if (this.data[i].Capital) total += Number(this.data[i].Capital);
                                //    this.data[i].Total = total;
                                //    grandTotal += Number(total);
                                //}
                                //$(thiz.element).closest('#budgetrequestform').find("#grandTotal_small")[0].value = formatCurrencyNoDecimal(grandTotal); // Update the smaller grid grand total.

                            } catch (e) {
                                console.log('Exception in bwInvoiceGrid.onInit: ' + e.message + ', ' + e.stack);
                            }
                        },

                        onRefreshed: function (args) { // jsGridCosts_small
                            try {

                                if (thiz.options.inFormsEditor != true) {

                                    var totalAmount = Number(0);
                                    var totalTax = Number(0);
                                    if (this.data && this.data.forEach) {
                                        this.data.forEach(function (item) {
                                            var total = Number(0);
                                            if (item.Amount) {
                                                totalAmount += Number(item.Amount);
                                                total += Number(item.Amount);
                                            }
                                            if (item.Tax) {
                                                totalTax += Number(item.Tax);
                                                total += Number(item.Tax);
                                            }
                                            if (item.Total) {
                                                item.Total = total;
                                            }
                                        });
                                    }
                                    var grandTotal = totalAmount + totalTax;

                                    var html = '';
                                    html += '<tr>';

                                    html += '<td>';
                                    html == 'Invoice Total';
                                    html += '</td>';

                                    html += '<td class="jsgrid-cell" style="text-align:right;">';
                                    html += formatCurrency(totalAmount);
                                    html += '</td>';

                                    html += '<td class="jsgrid-cell" style="text-align:right;">';
                                    html += formatCurrency(totalTax);
                                    html += '</td>';

                                    html += '<td class="jsgrid-cell" style="text-align:right;">';
                                    html += formatCurrency(grandTotal);
                                    html += '</td>';

                                    html += '</tr>';
                                    this._content.append(html);

                                    //alert('xcx5556 this.data: ' + JSON.stringify(this.data));

                                    thiz.options.jsonData["bwInvoiceGrid"].value = this.data; // Store in the widget.

                                    $(thiz.element).closest('#budgetrequestform').find("#grandTotal_small")[0].value = formatCurrency(grandTotal); // Update the smaller grid grand total.

                                    var bwBudgetRequestId = $(thiz.element).closest('#budgetrequestform')[0].getAttribute('bwbudgetrequestid');
                                    var requestDialogId = 'divZoomedBwCostsGridDialog_' + bwBudgetRequestId;
                                    if ($('#' + requestDialogId).find('#jsGridCosts_large')) { // If the large one is displayed, update it!
                                        if ($('#' + requestDialogId).find('#grandTotal_large')[0]) {
                                            $('#' + requestDialogId).find('#grandTotal_large')[0].value = formatCurrency(grandTotal); // Update the grand total in the large window.
                                        }
                                    }
                                }
                            } catch (e) {
                                console.log('Exception in bwInvoiceGrid.onRefreshed:xcx4323-1: ' + e.message + ', ' + e.stack);
                                $('#spanBwCostsGrid_Error')[0].innerHTML = 'Exception in bwInvoiceGrid.onRefreshed:xcx4323-1: ' + e.message + ', ' + e.stack;
                            }
                        },

                        onItemInserted: function () { // jsGridCosts_small
                            try {
                                var bwBudgetRequestId = $(thiz.element).closest('#budgetrequestform')[0].getAttribute('bwbudgetrequestid');
                                var requestDialogId = 'divZoomedBwCostsGridDialog_' + bwBudgetRequestId;
                                if ($('#' + requestDialogId).find('#jsGridCosts_large')) { // If the large one is displayed, update it!
                                    $('#' + requestDialogId).find("#jsGridCosts_large").jsGrid("option", "data", thiz.options.jsonData["bwInvoiceGrid"].value); // Update the larger grid.
                                }

                            } catch (e) {
                                console.log('Exception in bwInvoiceGrid.onItemInserted: ' + e.message + ', ' + e.stack);
                                $('#spanBwCostsGrid_Error')[0].innerHTML = 'Exception in bwInvoiceGrid.onItemInserted: ' + e.message + ', ' + e.stack;
                            }
                        },
                        onItemUpdated: function () { // jsGridCosts_small
                            try {
                                //console.log('In bwInvoiceGrid.onItemInserted().');
                                var bwBudgetRequestId = $(thiz.element).closest('#budgetrequestform')[0].getAttribute('bwbudgetrequestid');
                                var requestDialogId = 'divZoomedBwCostsGridDialog_' + bwBudgetRequestId;
                                if ($('#' + requestDialogId).find('#jsGridCosts_large')) { // If the large one is displayed, update it!
                                    $('#' + requestDialogId).find("#jsGridCosts_large").jsGrid("option", "data", thiz.options.jsonData["bwInvoiceGrid"].value); // Update the larger grid.
                                }

                            } catch (e) {
                                console.log('Exception in bwInvoiceGrid.onItemInserted: ' + e.message + ', ' + e.stack);
                                $('#spanBwCostsGrid_Error')[0].innerHTML = 'Exception in bwInvoiceGrid.onItemUpdated: ' + e.message + ', ' + e.stack;
                            }
                        },
                        onItemDeleted: function () { // jsGridCosts_small
                            try {
                                //console.log('In bwInvoiceGrid.onItemInserted().');
                                var bwBudgetRequestId = $(thiz.element).closest('#budgetrequestform')[0].getAttribute('bwbudgetrequestid');
                                var requestDialogId = 'divZoomedBwCostsGridDialog_' + bwBudgetRequestId;
                                if ($('#' + requestDialogId).find('#jsGridCosts_large')) { // If the large one is displayed, update it!
                                    $('#' + requestDialogId).find("#jsGridCosts_large").jsGrid("option", "data", thiz.options.jsonData["bwInvoiceGrid"].value); // Update the larger grid.
                                }

                            } catch (e) {
                                console.log('Exception in bwInvoiceGrid.onItemInserted: ' + e.message + ', ' + e.stack);
                                $('#spanBwCostsGrid_Error')[0].innerHTML = 'Exception in bwInvoiceGrid.onItemDeleted: ' + e.message + ', ' + e.stack;
                            }
                        },
                        fields: [
                            {
                                name: "Description", type: "text", width: 150, validate: "required"
                            },
                            {
                                name: "Amount", type: "money", width: 50, editing: true,
                                itemTemplate: function (value) {
                                    if (value) {
                                        return formatCurrency(value);
                                    } else {
                                        return '';
                                    }
                                },
                            },
                            {
                                name: "Tax", type: "money", width: 50, editing: true,
                                itemTemplate: function (value) {
                                    if (value) {
                                        return formatCurrency(value);
                                    } else {
                                        return '';
                                    }
                                },
                            },
                            {
                                name: "Total", type: "money", width: 50, editing: false,
                                itemTemplate: function (value) {
                                    if (value) {
                                        return formatCurrency(value);
                                    } else {
                                        return '';
                                    }
                                },
                            },
                            //{
                            //    type: "control", width: "10%", editButton: false,
                            //    itemTemplate: function (_, item) {
                            //        if (item.IsTotal)
                            //            return "";
                            //        return jsGrid.fields.control.prototype.itemTemplate.apply(this, arguments);
                            //    }
                            //}
                            { type: "control" }
                        ]
                    });

                } else if (this.options.displayContext === 'dialog') {

                    var bwBudgetRequestId = this.options.bwBudgetRequestId;
                    var bwWorkflowTaskItemId = this.options.bwWorkflowTaskItemId;

                    var requestDialogId = 'divZoomedBwCostsGridDialog_' + bwBudgetRequestId;

                    var bwOrgId = this.options.bwOrgId;
                    var bwOrgName = this.options.bwOrgName;

                    var bwRequestTitle = this.options.bwRequestTitle;

                    var requestDialogParentId = this.options.requestDialogParentId;

                    // This creates the custom header/draggable bar on the dialog!!! 4-2-2020. // ☈ ☇ https://www.toptal.com/designers/htmlarrows/symbols/thunderstorm/
                    var html = '';
                    html += '<table xcx="xcx3249-2-1" style="width:100%;" onclick="$(\'.bwRequest\').bwRequest(\'pinRequestDialog\');" ondblclick="$(\'.bwRequest\').bwRequest(\'zoomAndCenter\', \'' + requestDialogId + '\');" >'; // This click event is like "pin". Once the user clicks the header of the request dialog, it no longer is modal and persists on the screen until they choose to close it.
                    html += '   <tr>';
                    html += '       <td style="width:95%;">';
                    html += '           <div id="slider_' + requestDialogId + '" style="width:20%;cursor:pointer;"></div>';
                    html += '       </td>';


                    html += '       <td style="vertical-align:middle;width:5%;padding:0;border:0;margin:0;">';

                    // This is where we display the "Pin". If it is pinned, or if it is not pinned.
                    var pinned = false;
                    var pinnedRequests = $('.bwAuthentication:first').bwAuthentication('option', 'PINNED_REQUESTS');
                    if (pinnedRequests && pinnedRequests.length) {
                        for (var i = 0; i < pinnedRequests.length; i++) {
                            if (pinnedRequests[i].bwBudgetRequestId == bwBudgetRequestId) {
                                pinned = true;
                            }
                        }
                    }
                    if (pinned != true) {
                        html += '           <div title="pin" class="pinButton" style="display:inline-block;font-size:18pt;cursor:pointer !important;" onclick="$(\'.bwRequest\').bwRequest(\'pinRequest\', \'' + bwBudgetRequestId + '\', \'' + requestDialogId + '\', true);"><img src="/images/pin.png" style="width:50px;height:50px;cursor:pointer !important;" /></div>';
                    } else {
                        html += '           <div title="un-pin" class="pinButton" style="display:inline-block;font-size:18pt;cursor:pointer !important;" onclick="$(\'.bwRequest\').bwRequest(\'pinRequest\', \'' + bwBudgetRequestId + '\', \'' + requestDialogId + '\', false);"><img src="/images/unpin.png" style="width:50px;height:50px;cursor:pointer !important;" /></div>';
                    }

                    //displayAlertDialog('pinnedRequests: ' + JSON.stringify(pinnedRequests));
                    //if (pinnedRequests && pinnedRequests.length) {
                    //    if (pinnedRequests.indexOf(bwBudgetRequestId) > -1) {
                    //        html += '           <div title="un-pin" class="pinButton" style="display:inline-block;font-size:18pt;cursor:pointer !important;" onclick="$(\'.bwRequest\').bwRequest(\'pinRequest\', \'' + bwBudgetRequestId + '\', \'' + requestDialogId + '\', false);"><img src="/images/unpin.png" style="width:50px;height:50px;cursor:pointer !important;" /></div>';
                    //    } else {
                    //        html += '           <div title="pin" class="pinButton" style="display:inline-block;font-size:18pt;cursor:pointer !important;" onclick="$(\'.bwRequest\').bwRequest(\'pinRequest\', \'' + bwBudgetRequestId + '\', \'' + requestDialogId + '\', true);"><img src="/images/pin.png" style="width:50px;height:50px;cursor:pointer !important;" /></div>';
                    //    }
                    //} else {
                    //    html += '           <div title="pin" class="pinButton" style="display:inline-block;font-size:18pt;cursor:pointer !important;" onclick="$(\'.bwRequest\').bwRequest(\'pinRequest\', \'' + bwBudgetRequestId + '\', \'' + requestDialogId + '\', true);"><img src="/images/pin.png" style="width:50px;height:50px;cursor:pointer !important;" /></div>';
                    //}


                    html += '       </td>';


                    // Refresh button. This is good if you want to refresh and see the state of the file conversion from vob to mp4, for instance. 9-7-2022
                    html += '       <td style="vertical-align:top;width:5%;padding:0;border:0;margin:0;">';
                    html += '           <span id="' + requestDialogId + '_spanRequestPrintButton" style="text-align:right;cursor:pointer;font-size:30pt;" onclick="$(\'.bwRequest\').bwRequest(\'reloadAndRefreshTheRequest\', \'' + requestDialogId + '\', \'' + bwBudgetRequestId + '\', \'' + bwWorkflowTaskItemId + '\');">';
                    html += '               ♻';
                    html += '           </span>';
                    //html += '           <A HREF="#" onClick="window.open(\'https://budgetworkflow.com\', \'Sample\',\'toolbar=no,width=190,height=190,left=500,top=200,status=no,scrollbars=no,resize=no\');return false">[...]</A>.';
                    html += '       </td>';

                    html += '       <td style="vertical-align:top;width:5%;padding:0;border:0;margin:0;">';
                    //var activeStateIdentifier = '';
                    //try {
                    //    activeStateIdentifier = this.getUrlParams()['ActiveStateIdentifier'].toString().split('#')[0];
                    //} catch (e) { }


                    if (window.opener) {

                        html += '                   <span id="' + requestDialogId + '_spanRequestPrintButton" style="text-align:right;cursor:pointer;font-size:30pt;" onclick="$(\'.bwInvoiceGrid\').bwInvoiceGrid(\'LaunchIntoHomeWindow\', \'' + bwBudgetRequestId + '\');">';
                        html += '                       ☈';
                        html += '                   </span>';

                    } else {

                        html += '           <span id="' + requestDialogId + '_spanRequestPrintButton" style="text-align:right;cursor:pointer;font-size:30pt;" onclick="$(\'.bwInvoiceGrid\').bwInvoiceGrid(\'LaunchIntoSeparateWindow\', \'' + requestDialogId + '\', \'' + bwBudgetRequestId + '\', \'' + bwWorkflowTaskItemId + '\');">';
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
                            thiz.setZoom(ui.value, requestDialogId);
                        }//,
                        //change: function (event, ui) {
                        //    thiz.setZoom(ui.value, requestDialogId);
                        //}
                    });
                    thiz.setZoom(100, requestDialogId);

                    // Render the Print button.
                    //var printButtonOptions = {
                    //    reportType: 'IndividualRequestReport',
                    //    store: thiz.options.store,
                    //    bwWorkflowAppId: thiz.options.bwWorkflowAppId
                    //    //bwBudgetRequestId: this.options.bwBudgetRequestId
                    //};
                    //var $printbutton = $('#' + requestDialogId + '_spanRequestPrintButton').bwPrintButton(printButtonOptions);

                    $('.ui-widget-overlay').bind('click', function () {
                        $('#' + requestDialogId).dialog('close');
                    });

























                    //// This creates the custom header/draggable bar on the dialog!!! 4-2-2020. // ☈ ☇ https://www.toptal.com/designers/htmlarrows/symbols/thunderstorm/
                    //var html = '';
                    //html += '<table style="width:100%;" onclick="$(\'.bwRequest\').bwRequest(\'pinRequestDialog\');" ondblclick="$(\'.bwRequest\').bwRequest(\'zoomAndCenter\', \'' + requestDialogId + '\');">'; // This click event is like "pin". Once the user clicks the header of the request dialog, it no longer is modal and persists on the screen until they choose to close it.
                    //html += '   <tr>';
                    //html += '       <td style="width:95%;">';
                    //html += '           <div id="slider_' + requestDialogId + '" style="width:20%;cursor:pointer;"></div>';
                    //html += '       </td>';
                    //html += '       <td>';
                    //html += '           <span class="dialogXButton" style="font-size:25pt;cursor:pointer;width:100%;font-weight:bold;" onclick="$(\'#' + requestDialogId.replace('_Parent', '') + '\').dialog(\'close\');">X</span>';
                    //html += '       </td>';
                    //html += '   </tr>';
                    //html += '</table>';

                    //document.getElementById(requestDialogId).parentNode.querySelector(".ui-dialog-titlebar").innerHTML = html;

                    html = '';
                    //var form = $('#divNewRequest').find('#budgetrequestform'); // var bwBudgetRequestId = $(element).closest('#budgetrequestform')[0].getAttribute('bwbudgetrequestid');
                    //var bwOrgId = $(thiz.element).closest('#budgetrequestform')[0].getAttribute('bworgid'); // $('#' + requestDialogId).find('#budgetrequestform')[0].getAttribute('bworgid'); // document.getElementById('budgetrequestform').getAttribute('bworgid'); // selected OrgId on the new request form: txtLocationPickerFilter attribute bworgid
                    //var bwOrgName = $(thiz.element).closest('#budgetrequestform')[0].getAttribute('bworgname'); // document.getElementById('budgetrequestform').getAttribute('bworgname'); // selected OrgId on the new request form: txtLocationPickerFilter attribute bworgid

                    html += '<div id="budgetrequestworkflowparticipantsdialog" class="context-menu-newrequesteditorxx" align="left" bwbudgetrequestid="" bwrequesttype="" orgid="" orgname="">';
                    html += '<table style="BORDER-TOP-STYLE: none; WORD-WRAP: break-word; BORDER-LEFT-STYLE: none; BORDER-COLLAPSE: collapse; TABLE-LAYOUT: fixed; BORDER-BOTTOM-STYLE: none; BORDER-RIGHT-STYLE: none; " class="xdFormLayout">';
                    html += '    <colgroup>';
                    html += '        <col style="" />';
                    html += '    </colgroup>';
                    html += '    <tbody>';
                    html += '        <tr class="xdTableContentRow">';
                    html += '            <td style="display:block;BORDER-TOP: #d8d8d8 1pt solid; BORDER-RIGHT: #d8d8d8 1pt solid; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 0px; PADDING-TOP: 0px; PADDING-LEFT: 0px; BORDER-LEFT: #d8d8d8 1pt solid; PADDING-RIGHT: 0px" class="xdTableContentCell">';
                    html += '                <div />';
                    html += '                <table style="width:100%;">';
                    html += '                    <tr>';
                    html += '                        <td colspan="4">';
                    html += '                           <span id="' + requestDialogId + '_requestOrgClickableBreadcrumb" style="color:purple;font-size:8pt;">' + bwOrgName + '</span>';
                    html += '                       </td>';
                    html += '                    </tr>';
                    html += '                    <tr>';
                    html += '                        <td width="5px"></td>';
                    html += '                        <td>';
                    html += '                   <span>';
                    html += '<img id="' + requestDialogId + '_imgRequestOrgImage" src="' + thiz.options.operationUriPrefix + 'images/corporeal.png" style="width:150px;height:150px;"/>';




                    // Try to get a custom image. If none found, use the OOB one.
                    var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');


                    var imagePath;

                    var preventCachingGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                    });

                    var activeStateIdentifier = JSON.parse($('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier'));

                    if (activeStateIdentifier.status != 'SUCCESS') {

                        imagePath += '[No image. Unauthorized. xcx213124-3-6664323]';

                    } else {

                        imagePath = thiz.options.operationUriPrefix + '_files/' + workflowAppId + '/orgimages/' + bwOrgId + '/' + 'orgimage.png?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier;

                    }

                    $.get(imagePath).done(function () {
                        setTimeout(function () { // Only needs to happen for Chrome.
                            $('#' + requestDialogId + '_imgRequestOrgImage').attr('src', imagePath);
                        }, 500);
                    }).fail(function () {
                        //alert("This org has no image."); // do nothing 
                    });
                    // End: Getting the custom image






                    html += '                   </span>';
                    html += '                        </td>';
                    html += '                        <td colspan="2" style="text-align:left;vertical-align:top;">';

                    //html += '                           <span id="' + requestDialogParentId + '_BwRequestType" style="font-size:1em;">';
                    //html += '                               [._BwRequestType]';
                    //html += '                           </span>';
                    html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 40pt;font-weight:bold;">Costs</span>';

                    html += '                           <br />';
                    //html += '                           <span id="' + requestDialogParentId + '_WorkflowGuid" style="color:gray;">[._WorkflowGuid]</span>';
                    if (bwRequestTitle == 'New') {
                        html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 25pt;font-weight:bold;">for New Budget Request</span>';
                    } else {
                        html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 25pt;font-weight:bold;cursor:pointer;text-decoration:underline;" '; // + '</span>';
                        html += 'onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'' + bwBudgetRequestId + '\', \'' + bwRequestTitle + '\', \'\', \'' + bwRequestTitle + '\', \'\');" >';
                        html += 'for Budget Request: ' + bwRequestTitle + '</span>';
                    }

                    html += '                        </td>';
                    html += '                    </tr>';


                    html += '<tr>';
                    html += '   <td colspan="4" style="height:15px;">';
                    html += '       <span class="xdlabel" id="spanBwCostsGrid_Error" style="color:tomato;" hidefocus="1"></span>'; // Errors and exceptions get displayed here.
                    html += '   </td>';
                    html += '</tr>';



                    html += '                </table>';

                    html += '<span id="' + requestDialogParentId + '_Content"></span>';
                    document.getElementById(requestDialogId).innerHTML = html;

                    $("#slider_" + requestDialogId).slider({
                        min: 50,
                        max: 200,
                        value: 100, // It starts off full size.
                        slide: function (event, ui) {
                            thiz.setZoom(ui.value, requestDialogId);
                        }//,
                        //change: function (event, ui) {
                        //    thiz.setZoom(ui.value, requestDialogId);
                        //}
                    });
                    thiz.setZoom(100, requestDialogId);

                    var html = '';
                    html += '   <table>';
                    html += '       <tr>';
                    html += '           <td>';
                    html += '               <div id="jsGridCosts_large" style="font-size:60%;"></div>';
                    html += '           </td>';
                    html += '       </tr>';
                    html += '       <tr>';
                    html += '           <td style="text-align:right;">';
                    html += '<br />';
                    html += '               <span class="xdlabel" style="font-size:15pt;font-weight:bold;">Invoice Total:</span>';
                    html += '               <input id="grandTotal_large" disabled style="color:black;WIDTH: 140px;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 18pt;TEXT-ALIGN: right;" type="text">';
                    html += '               &nbsp;&nbsp;';
                    html += '               <br /><br /><br />';
                    html += '           </td>';
                    html += '       </tr>';
                    html += '   </table';
                    document.getElementById(requestDialogParentId + '_Content').innerHTML = html;

                    // If we have jsonData, populate the element.
                    if (thiz.options.jsonData["bwInvoiceGrid"]) {
                        // already have data
                    } else {
                        // no data yet
                        thiz.options.jsonData["bwInvoiceGrid"] = {
                            value: null
                        }
                    }

                    $('#' + requestDialogParentId + '_Content').find("#jsGridCosts_large").jsGrid({
                        width: "100%",
                        //height: "100%", 
                        maxHeight: 'auto',

                        inserting: true,
                        editing: true,
                        sorting: true,
                        paging: true,

                        confirmDeleting: false, // false prevents the alert from popping up

                        data: thiz.options.jsonData["bwInvoiceGrid"].value,
                        noDataContent: "Click the \"Plus\" (<span style='color:green;font-weight:bold;font-size:x-large;'>+</span>) sign to add a Cost item...",

                        onInit: function () {
                            try {
                                console.log('In bwInvoiceGrid.onInit-large().');

                                console.log('In bwInvoiceGrid.onInit-large(). xcx333433 In onInit(). this.data: ' + JSON.stringify(this.data));

                                var grandTotal = Number(0);
                                for (var i = 0; i < this.data.length; i++) { // Iterate through the rows and calculate the totals and grand total.
                                    var total = Number(0);
                                    if (this.data[i].Amount) total += Number(this.data[i].Amount);
                                    //if (this.data[i].Expense) total += Number(this.data[i].Expense);
                                    if (this.data[i].Tax) total += Number(this.data[i].Tax);
                                    this.data[i].Total = total;
                                    grandTotal += Number(total);
                                }
                                if ($('#' + requestDialogParentId + '_Content').find('#grandTotal_large')[0]) {
                                    $('#' + requestDialogParentId + '_Content').find('#grandTotal_large')[0].value = formatCurrencyNoDecimal(grandTotal); // Update the grand total in the large window.
                                }
                                //$(thiz.element).closest('#budgetrequestform').find("#grandTotal")[0].value = formatCurrencyNoDecimal(grandTotal); // Update the smaller grid grand total.
                            } catch (e) {
                                console.log('Exception in bwInvoiceGrid.onInit: ' + e.message + ', ' + e.stack);
                            }
                        },

                        onRefreshed: function (args) { // jsGridCosts_large
                            try {

                                console.log('xcx3334 In bwInvoiceGrid.onRefreshed(). this.data: ' + JSON.stringify(this.data));

                                var totalAmount = Number(0);
                                var totalTax = Number(0);
                                if (this.data && this.data.forEach) {
                                    this.data.forEach(function (item) {
                                        var total = Number(0);
                                        if (item.Amount) {
                                            totalAmount += Number(item.Amount);
                                            total += Number(item.Amount);
                                        }
                                        if (item.Tax) {
                                            totalTax += Number(item.Tax);
                                            total += Number(item.Tax);
                                        }
                                        if (item.Total) {
                                            item.Total = total;
                                        }
                                    });
                                }
                                var grandTotal = totalAmount + totalTax;

                                var html = '';
                                html += '<tr>';

                                html += '<td>';
                                html == 'Invoice Total';
                                html += '</td>';

                                html += '<td class="jsgrid-cell" style="text-align:right;">';
                                html += formatCurrency(totalAmount);
                                html += '</td>';

                                html += '<td class="jsgrid-cell" style="text-align:right;">';
                                html += formatCurrency(totalTax);
                                html += '</td>';

                                html += '<td class="jsgrid-cell" style="text-align:right;">';
                                html += formatCurrency(grandTotal);
                                html += '</td>';

                                html += '</tr>';
                                this._content.append(html);

                                thiz.options.jsonData["bwInvoiceGrid"].value = this.data; // Store in the widget.

                                $(thiz.element).closest('#budgetrequestform').find("#grandTotal_small")[0].value = formatCurrency(grandTotal); // Update the smaller grid grand total.

                            } catch (e) {
                                console.log('Exception in bwInvoiceGrid.onRefreshed:xcx4323-2: ' + e.message + ', ' + e.stack);
                                $('#spanBwCostsGrid_Error')[0].innerHTML = 'Exception in bwInvoiceGrid.onRefreshed:xcx4323-2: ' + e.message + ', ' + e.stack;
                            }
                        },

                        onItemInserted: function () { // jsGridCosts_large
                            try {

                                console.log('xcx123423525-1 In onItemInserted(). thiz.options.jsonData["bwInvoiceGrid"]: ' + JSON.stringify(thiz.options.jsonData["bwInvoiceGrid"]));

                                //console.log('In bwInvoiceGrid.onItemInserted().');
                                //        var grandTotal = Number(0);
                                //        for (var i = 0; i < this.data.length; i++) { // Iterate through the rows and calculate the totals and grand total.
                                //            var total = Number(0);
                                //            if (this.data[i].Lease) total += Number(this.data[i].Lease);
                                //            if (this.data[i].Expense) total += Number(this.data[i].Expense);
                                //            if (this.data[i].Capital) total += Number(this.data[i].Capital);
                                //            this.data[i].Total = total;
                                //            grandTotal += Number(total);
                                //        }
                                //        thiz.options.jsonData["bwInvoiceGrid"].value = this.data; // Store in the widget.
                                //        $('#' + requestDialogParentId + '_Content').find('#grandTotal_large')[0].value = formatCurrencyNoDecimal(grandTotal); // Update the grand total in the large window.
                                $(thiz.element).closest('#budgetrequestform').find("#jsGridCosts_small").jsGrid("option", "data", thiz.options.jsonData["bwInvoiceGrid"].value); // Update the smaller grid.
                                //        $(thiz.element).closest('#budgetrequestform').find("#grandTotal_small")[0].value = formatCurrencyNoDecimal(grandTotal); // Update the smaller grid grand total.

                            } catch (e) {
                                console.log('Exception in bwInvoiceGrid.onItemInserted: ' + e.message + ', ' + e.stack);
                                $('#spanBwCostsGrid_Error')[0].innerHTML = 'Exception in bwInvoiceGrid.onItemInserted: ' + e.message + ', ' + e.stack;
                            }
                        },
                        onItemUpdated: function () { // jsGridCosts_large
                            try {

                                console.log('xcx3334331 In onItemUpdated(). this.data: ' + JSON.stringify(this.data));

                                //console.log('In bwInvoiceGrid.onItemInserted().');
                                //        var grandTotal = Number(0);
                                //        for (var i = 0; i < this.data.length; i++) { // Iterate through the rows and calculate the totals and grand total.
                                //            var total = Number(0);
                                //            if (this.data[i].Lease) total += Number(this.data[i].Lease);
                                //            if (this.data[i].Expense) total += Number(this.data[i].Expense);
                                //            if (this.data[i].Capital) total += Number(this.data[i].Capital);
                                //            this.data[i].Total = total;
                                //            grandTotal += Number(total);
                                //        }
                                //        thiz.options.jsonData["bwInvoiceGrid"].value = this.data; // Store in the widget.
                                //        $('#' + requestDialogParentId + '_Content').find('#grandTotal_large')[0].value = formatCurrencyNoDecimal(grandTotal); // Update the grand total in the large window.
                                $(thiz.element).closest('#budgetrequestform').find("#jsGridCosts_small").jsGrid("option", "data", thiz.options.jsonData["bwInvoiceGrid"].value); // Update the smaller grid.
                                //        $(thiz.element).closest('#budgetrequestform').find("#grandTotal_small")[0].value = formatCurrencyNoDecimal(grandTotal); // Update the smaller grid grand total.

                            } catch (e) {
                                console.log('Exception in bwInvoiceGrid.onItemInserted: ' + e.message + ', ' + e.stack);
                                $('#spanBwCostsGrid_Error')[0].innerHTML = 'Exception in bwInvoiceGrid.onItemUpdated: ' + e.message + ', ' + e.stack;
                            }
                        },
                        onItemDeleted: function () { // jsGridCosts_large
                            try {

                                alert('xcx3334331 In onItemDeleted(). this.data: ' + JSON.stringify(this.data));

                                //console.log('In bwInvoiceGrid.onItemInserted().');
                                //        var grandTotal = Number(0);
                                //        for (var i = 0; i < this.data.length; i++) { // Iterate through the rows and calculate the totals and grand total.
                                //            var total = Number(0);
                                //            if (this.data[i].Lease) total += Number(this.data[i].Lease);
                                //            if (this.data[i].Expense) total += Number(this.data[i].Expense);
                                //            if (this.data[i].Capital) total += Number(this.data[i].Capital);
                                //            this.data[i].Total = total;
                                //            grandTotal += Number(total);
                                //        }
                                //        thiz.options.jsonData["bwInvoiceGrid"].value = this.data; // Store in the widget.
                                //        $('#' + requestDialogParentId + '_Content').find('#grandTotal_large')[0].value = formatCurrencyNoDecimal(grandTotal); // Update the grand total in the large window.
                                $(thiz.element).closest('#budgetrequestform').find("#jsGridCosts_small").jsGrid("option", "data", thiz.options.jsonData["bwInvoiceGrid"].value); // Update the smaller grid.
                                //        $(thiz.element).closest('#budgetrequestform').find("#grandTotal_small")[0].value = formatCurrencyNoDecimal(grandTotal); // Update the smaller grid grand total.

                            } catch (e) {
                                console.log('Exception in bwInvoiceGrid.onItemInserted: ' + e.message + ', ' + e.stack);
                                $('#spanBwCostsGrid_Error')[0].innerHTML = 'Exception in bwInvoiceGrid.onItemDeleted: ' + e.message + ', ' + e.stack;
                            }
                        },
                        fields: [
                            {
                                name: "Description", type: "text", width: 150, validate: "required", editing: true
                            },
                            {
                                name: "Amount", type: "money", step: "0.01", width: 50, editing: true,
                                itemTemplate: function (value) {
                                    if (value) {
                                        //return formatCurrencyNoDecimalNoDollarSign(value);
                                        return formatCurrency(value);
                                    } else {
                                        return '';
                                    }
                                },
                            },
                            {
                                name: "Tax", type: "money", step: "0.01", width: 50, editing: true,
                                itemTemplate: function (value) {
                                    if (value) {
                                        return formatCurrency(value);
                                    } else {
                                        return '';
                                    }
                                },
                            },
                            {
                                name: "Total", type: "money", step: "0.01", width: 50, editing: false,
                                itemTemplate: function (value) {
                                    if (value) {
                                        return formatCurrency(value);
                                    } else {
                                        return '';
                                    }
                                },
                            },
                            { type: "control" }
                        ]
                    });

                    //{ JSGRID DOCS:
                    //    onDataLoading: function(args) {},    // before controller.loadData
                    //    onDataLoaded: function(args) {},     // on done of controller.loadData

                    //    onError: function(args) {},          // on fail of any controller call
                    //    onInit: function(args) {},           // after grid initialization

                    //    onItemInserting: function(args) {},  // before controller.insertItem
                    //    onItemInserted: function(args) {},   // on done of controller.insertItem
                    //    onItemUpdating: function(args) {},   // before controller.updateItem
                    //    onItemUpdated: function(args) {},    // on done of controller.updateItem
                    //    onItemDeleting: function(args) {},   // before controller.deleteItem
                    //    onItemDeleted: function(args) {},    // on done of controller.deleteItem
                    //    onItemInvalid: function(args) {},    // after item validation, in case data is invalid

                    //    onOptionChanging: function(args) {}, // before changing the grid option
                    //    onOptionChanged: function(args) {},  // after changing the grid option

                    //    onPageChanged: function(args) {},    // after changing the current page

                    //    onRefreshing: function(args) {},     // before grid refresh
                    //    onRefreshed: function(args) {},      // after grid refresh
                    //    }


                } else if (this.options.displayContext === 'window') {



                    console.log('xcx122 In bwInvoiceGrid.js.renderAndPopulateInvoiceGrid(). STARTING TO PUT CODE HERE FOR "window" (popped-out window).');

                    var bwBudgetRequestId = this.options.bwBudgetRequestId;
                    var bwWorkflowTaskItemId = this.options.bwWorkflowTaskItemId;

                    var bwOrgId = this.options.bwOrgId;
                    var bwOrgName = this.options.bwOrgName;

                    var bwRequestTitle = this.options.bwRequestTitle;

                    var requestDialogParentId = this.options.requestDialogParentId;

                    var requestDialogId = 'bwInvoiceGrid_PoppedOutWindow_' + bwBudgetRequestId;

                    var div = document.getElementById(requestDialogId); // 4-1-2020 12-28pm adt.
                    if (!div) { // for some reason this gets added twice to the DOM. Figure this out someday, but for now this seems to fix it and is a good safety I suppose.
                        div = document.createElement('div');
                        div.id = requestDialogId;
                        document.body.appendChild(div); // to place at end of document
                    }
                    div.innerHTML = html;

                    $('#' + requestDialogId).dialog({
                        modal: false,
                        resizable: true,
                        closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                        width: '100%', // We are doing this because we want to take up most of the screen. This allows the user to view detailed entries easily. 11-16-2023.
                        dialogClass: "no-close", // No close button in the upper right corner.
                        hide: false, // This means when hiding just disappear with no effects.
                        position: {
                            my: "middle top+12",
                            at: "middle top",
                            of: window
                        },
                        open: function () {
                            try {
                                var element2 = document.getElementById(requestDialogId).parentNode; // This is the best way to get a handle on the jquery dialog.
                                var requestDialogParentId = requestDialogId + '_Parent'; // We need to have an id value so we can refer to this. It doesn't have one unless we add it here.
                                element2.id = requestDialogParentId; // We need to have an id value so we can refer to this. It doesn't have one unless we add it here.






















                                // This creates the custom header/draggable bar on the dialog!!! 4-2-2020. // ☈ ☇ https://www.toptal.com/designers/htmlarrows/symbols/thunderstorm/
                                var html = '';
                                html += '<table xcx="xcx3249-2-1" style="width:100%;" onclick="$(\'.bwRequest\').bwRequest(\'pinRequestDialog\');" ondblclick="$(\'.bwRequest\').bwRequest(\'zoomAndCenter\', \'' + requestDialogId + '\');" >'; // This click event is like "pin". Once the user clicks the header of the request dialog, it no longer is modal and persists on the screen until they choose to close it.
                                html += '   <tr>';
                                html += '       <td style="width:95%;">';
                                html += '           <div id="slider_' + requestDialogId + '" style="width:20%;cursor:pointer;"></div>';
                                html += '       </td>';


                                html += '       <td style="vertical-align:middle;width:5%;padding:0;border:0;margin:0;">';

                                // This is where we display the "Pin". If it is pinned, or if it is not pinned.
                                var pinned = false;
                                var pinnedRequests = $('.bwAuthentication:first').bwAuthentication('option', 'PINNED_REQUESTS');
                                if (pinnedRequests && pinnedRequests.length) {
                                    for (var i = 0; i < pinnedRequests.length; i++) {
                                        if (pinnedRequests[i].bwBudgetRequestId == bwBudgetRequestId) {
                                            pinned = true;
                                        }
                                    }
                                }
                                if (pinned != true) {
                                    html += '           <div title="pin" class="pinButton" style="display:inline-block;font-size:18pt;cursor:pointer !important;" onclick="$(\'.bwRequest\').bwRequest(\'pinRequest\', \'' + bwBudgetRequestId + '\', \'' + requestDialogId + '\', true);"><img src="/images/pin.png" style="width:50px;height:50px;cursor:pointer !important;" /></div>';
                                } else {
                                    html += '           <div title="un-pin" class="pinButton" style="display:inline-block;font-size:18pt;cursor:pointer !important;" onclick="$(\'.bwRequest\').bwRequest(\'pinRequest\', \'' + bwBudgetRequestId + '\', \'' + requestDialogId + '\', false);"><img src="/images/unpin.png" style="width:50px;height:50px;cursor:pointer !important;" /></div>';
                                }

                                //displayAlertDialog('pinnedRequests: ' + JSON.stringify(pinnedRequests));
                                //if (pinnedRequests && pinnedRequests.length) {
                                //    if (pinnedRequests.indexOf(bwBudgetRequestId) > -1) {
                                //        html += '           <div title="un-pin" class="pinButton" style="display:inline-block;font-size:18pt;cursor:pointer !important;" onclick="$(\'.bwRequest\').bwRequest(\'pinRequest\', \'' + bwBudgetRequestId + '\', \'' + requestDialogId + '\', false);"><img src="/images/unpin.png" style="width:50px;height:50px;cursor:pointer !important;" /></div>';
                                //    } else {
                                //        html += '           <div title="pin" class="pinButton" style="display:inline-block;font-size:18pt;cursor:pointer !important;" onclick="$(\'.bwRequest\').bwRequest(\'pinRequest\', \'' + bwBudgetRequestId + '\', \'' + requestDialogId + '\', true);"><img src="/images/pin.png" style="width:50px;height:50px;cursor:pointer !important;" /></div>';
                                //    }
                                //} else {
                                //    html += '           <div title="pin" class="pinButton" style="display:inline-block;font-size:18pt;cursor:pointer !important;" onclick="$(\'.bwRequest\').bwRequest(\'pinRequest\', \'' + bwBudgetRequestId + '\', \'' + requestDialogId + '\', true);"><img src="/images/pin.png" style="width:50px;height:50px;cursor:pointer !important;" /></div>';
                                //}


                                html += '       </td>';


                                // Refresh button. This is good if you want to refresh and see the state of the file conversion from vob to mp4, for instance. 9-7-2022
                                html += '       <td style="vertical-align:top;width:5%;padding:0;border:0;margin:0;">';
                                html += '           <span id="' + requestDialogId + '_spanRequestPrintButton" style="text-align:right;cursor:pointer;font-size:30pt;" onclick="$(\'.bwRequest\').bwRequest(\'reloadAndRefreshTheRequest\', \'' + requestDialogId + '\', \'' + bwBudgetRequestId + '\', \'' + bwWorkflowTaskItemId + '\');">';
                                html += '               ♻';
                                html += '           </span>';
                                //html += '           <A HREF="#" onClick="window.open(\'https://budgetworkflow.com\', \'Sample\',\'toolbar=no,width=190,height=190,left=500,top=200,status=no,scrollbars=no,resize=no\');return false">[...]</A>.';
                                html += '       </td>';

                                html += '       <td style="vertical-align:top;width:5%;padding:0;border:0;margin:0;">';
                                //var activeStateIdentifier = '';
                                //try {
                                //    activeStateIdentifier = this.getUrlParams()['ActiveStateIdentifier'].toString().split('#')[0];
                                //} catch (e) { }


                                if (window.opener) {

                                    html += '                   <span id="' + requestDialogId + '_spanRequestPrintButton" style="text-align:right;cursor:pointer;font-size:30pt;" onclick="$(\'.bwInvoiceGrid\').bwInvoiceGrid(\'LaunchIntoHomeWindow\', \'' + bwBudgetRequestId + '\');">';
                                    html += '                       ☈';
                                    html += '                   </span>';

                                } else {

                                    html += '           <span id="' + requestDialogId + '_spanRequestPrintButton" style="text-align:right;cursor:pointer;font-size:30pt;" onclick="$(\'.bwInvoiceGrid\').bwInvoiceGrid(\'LaunchIntoSeparateWindow\', \'' + requestDialogId + '\', \'' + bwBudgetRequestId + '\', \'' + bwWorkflowTaskItemId + '\');">';
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
                                        thiz.setZoom(ui.value, requestDialogId);
                                    }//,
                                    //change: function (event, ui) {
                                    //    thiz.setZoom(ui.value, requestDialogId);
                                    //}
                                });
                                thiz.setZoom(100, requestDialogId);

                                // Render the Print button.
                                //var printButtonOptions = {
                                //    reportType: 'IndividualRequestReport',
                                //    store: thiz.options.store,
                                //    bwWorkflowAppId: thiz.options.bwWorkflowAppId
                                //    //bwBudgetRequestId: this.options.bwBudgetRequestId
                                //};
                                //var $printbutton = $('#' + requestDialogId + '_spanRequestPrintButton').bwPrintButton(printButtonOptions);

                                $('.ui-widget-overlay').bind('click', function () {
                                    $('#' + requestDialogId).dialog('close');
                                });

























                                //// This creates the custom header/draggable bar on the dialog!!! 4-2-2020. // ☈ ☇ https://www.toptal.com/designers/htmlarrows/symbols/thunderstorm/
                                //var html = '';
                                //html += '<table style="width:100%;" onclick="$(\'.bwRequest\').bwRequest(\'pinRequestDialog\');" ondblclick="$(\'.bwRequest\').bwRequest(\'zoomAndCenter\', \'' + requestDialogId + '\');">'; // This click event is like "pin". Once the user clicks the header of the request dialog, it no longer is modal and persists on the screen until they choose to close it.
                                //html += '   <tr>';
                                //html += '       <td style="width:95%;">';
                                //html += '           <div id="slider_' + requestDialogId + '" style="width:20%;cursor:pointer;"></div>';
                                //html += '       </td>';
                                //html += '       <td>';
                                //html += '           <span class="dialogXButton" style="font-size:25pt;cursor:pointer;width:100%;font-weight:bold;" onclick="$(\'#' + requestDialogId.replace('_Parent', '') + '\').dialog(\'close\');">X</span>';
                                //html += '       </td>';
                                //html += '   </tr>';
                                //html += '</table>';

                                //document.getElementById(requestDialogId).parentNode.querySelector(".ui-dialog-titlebar").innerHTML = html;

                                html = '';

                                html += '<div id="budgetrequestworkflowparticipantsdialog" class="context-menu-newrequesteditorxx" align="left" bwbudgetrequestid="" bwrequesttype="" orgid="" orgname="">';
                                html += '<table style="BORDER-TOP-STYLE: none; WORD-WRAP: break-word; BORDER-LEFT-STYLE: none; BORDER-COLLAPSE: collapse; TABLE-LAYOUT: fixed; BORDER-BOTTOM-STYLE: none; BORDER-RIGHT-STYLE: none; " class="xdFormLayout">';
                                html += '    <colgroup>';
                                html += '        <col style="" />';
                                html += '    </colgroup>';
                                html += '    <tbody>';
                                html += '        <tr class="xdTableContentRow">';
                                html += '            <td style="display:block;BORDER-TOP: #d8d8d8 1pt solid; BORDER-RIGHT: #d8d8d8 1pt solid; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 0px; PADDING-TOP: 0px; PADDING-LEFT: 0px; BORDER-LEFT: #d8d8d8 1pt solid; PADDING-RIGHT: 0px" class="xdTableContentCell">';
                                html += '                <div />';
                                html += '                <table style="width:100%;">';
                                html += '                    <tr>';
                                html += '                        <td colspan="4">';
                                html += '                           <span id="' + requestDialogId + '_requestOrgClickableBreadcrumb" style="color:purple;font-size:8pt;">' + bwOrgName + '</span>';
                                html += '                       </td>';
                                html += '                    </tr>';
                                html += '                    <tr>';
                                html += '                        <td width="5px"></td>';
                                html += '                        <td>';
                                html += '                   <span>';
                                html += '<img id="' + requestDialogId + '_imgRequestOrgImage" src="' + thiz.options.operationUriPrefix + 'images/corporeal.png" style="width:150px;height:150px;"/>';




                                // Try to get a custom image. If none found, use the OOB one.
                                var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');


                                var imagePath;

                                var preventCachingGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                                    return v.toString(16);
                                });

                                var activeStateIdentifier = JSON.parse($('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier'));

                                if (activeStateIdentifier.status != 'SUCCESS') {

                                    imagePath += '[No image. Unauthorized. xcx213124-3-6664323]';

                                } else {

                                    imagePath = thiz.options.operationUriPrefix + '_files/' + workflowAppId + '/orgimages/' + bwOrgId + '/' + 'orgimage.png?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier;

                                }

                                $.get(imagePath).done(function () {
                                    setTimeout(function () { // Only needs to happen for Chrome.
                                        $('#' + requestDialogId + '_imgRequestOrgImage').attr('src', imagePath);
                                    }, 500);
                                }).fail(function () {
                                    //alert("This org has no image."); // do nothing 
                                });
                                // End: Getting the custom image






                                html += '                   </span>';
                                html += '                        </td>';
                                html += '                        <td colspan="2" style="text-align:left;vertical-align:top;">';

                                //html += '                           <span id="' + requestDialogParentId + '_BwRequestType" style="font-size:1em;">';
                                //html += '                               [._BwRequestType]';
                                //html += '                           </span>';
                                html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 40pt;font-weight:bold;">Costs</span>';

                                html += '                           <br />';
                                //html += '                           <span id="' + requestDialogParentId + '_WorkflowGuid" style="color:gray;">[._WorkflowGuid]</span>';
                                if (bwRequestTitle == 'New') {
                                    html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 25pt;font-weight:bold;">for New Budget Request</span>';
                                } else {
                                    html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 25pt;font-weight:bold;cursor:pointer;text-decoration:underline;" '; // + '</span>';
                                    html += 'onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'' + bwBudgetRequestId + '\', \'' + bwRequestTitle + '\', \'\', \'' + bwRequestTitle + '\', \'\');" >';
                                    html += 'for Budget Request: ' + bwRequestTitle + '</span>';
                                }

                                html += '                        </td>';
                                html += '                    </tr>';


                                html += '<tr>';
                                html += '   <td colspan="4" style="height:15px;">';
                                html += '       <span class="xdlabel" id="spanBwCostsGrid_Error" style="color:tomato;" hidefocus="1"></span>'; // Errors and exceptions get displayed here.
                                html += '   </td>';
                                html += '</tr>';



                                html += '                </table>';

                                html += '<span id="' + requestDialogParentId + '_Content"></span>';
                                document.getElementById(requestDialogId).innerHTML = html;

                                $("#slider_" + requestDialogId).slider({
                                    min: 50,
                                    max: 200,
                                    value: 100, // It starts off full size.
                                    slide: function (event, ui) {
                                        thiz.setZoom(ui.value, requestDialogId);
                                    }//,
                                    //change: function (event, ui) {
                                    //    thiz.setZoom(ui.value, requestDialogId);
                                    //}
                                });
                                thiz.setZoom(100, requestDialogId);

                                var html = '';
                                html += '   <table>';
                                html += '       <tr>';
                                html += '           <td>';
                                html += '               <div id="jsGridCosts_large" style="font-size:60%;"></div>';
                                html += '           </td>';
                                html += '       </tr>';
                                html += '       <tr>';
                                html += '           <td style="text-align:right;">';
                                html += '<br />';
                                html += '               <span class="xdlabel" style="font-size:15pt;font-weight:bold;">Invoice Total:</span>';
                                html += '               <input id="grandTotal_large" disabled style="color:black;WIDTH: 140px;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 18pt;TEXT-ALIGN: right;" type="text">';
                                html += '               &nbsp;&nbsp;';
                                html += '               <br /><br /><br />';
                                html += '           </td>';
                                html += '       </tr>';
                                html += '   </table';
                                document.getElementById(requestDialogParentId + '_Content').innerHTML = html;

                                // If we have jsonData, populate the element.
                                if (thiz.options.jsonData["bwInvoiceGrid"]) {
                                    // already have data
                                } else {
                                    // no data yet
                                    thiz.options.jsonData["bwInvoiceGrid"] = {
                                        value: null
                                    }
                                }

                                $('#' + requestDialogParentId + '_Content').find("#jsGridCosts_large").jsGrid({
                                    width: "100%",
                                    //height: "100%", 
                                    maxHeight: 'auto',

                                    inserting: true,
                                    editing: true,
                                    sorting: true,
                                    paging: true,

                                    confirmDeleting: false, // false prevents the alert from popping up

                                    data: thiz.options.jsonData["bwInvoiceGrid"].value,
                                    noDataContent: "Click the \"Plus\" (<span style='color:green;font-weight:bold;font-size:x-large;'>+</span>) sign to add a Cost item...",

                                    onInit: function () {
                                        try {
                                            console.log('In bwInvoiceGrid.onInit-large().');

                                            console.log('In bwInvoiceGrid.onInit-large(). xcx333433 In onInit(). this.data: ' + JSON.stringify(this.data));

                                            var grandTotal = Number(0);
                                            for (var i = 0; i < this.data.length; i++) { // Iterate through the rows and calculate the totals and grand total.
                                                var total = Number(0);
                                                if (this.data[i].Amount) total += Number(this.data[i].Amount);
                                                //if (this.data[i].Expense) total += Number(this.data[i].Expense);
                                                if (this.data[i].Tax) total += Number(this.data[i].Tax);
                                                this.data[i].Total = total;
                                                grandTotal += Number(total);
                                            }
                                            if ($('#' + requestDialogParentId + '_Content').find('#grandTotal_large')[0]) {
                                                $('#' + requestDialogParentId + '_Content').find('#grandTotal_large')[0].value = formatCurrencyNoDecimal(grandTotal); // Update the grand total in the large window.
                                            }
                                            //$(thiz.element).closest('#budgetrequestform').find("#grandTotal")[0].value = formatCurrencyNoDecimal(grandTotal); // Update the smaller grid grand total.
                                        } catch (e) {
                                            console.log('Exception in bwInvoiceGrid.onInit: ' + e.message + ', ' + e.stack);
                                        }
                                    },

                                    onRefreshed: function (args) { // jsGridCosts_large
                                        try {

                                            console.log('xcx3334 In bwInvoiceGrid.onRefreshed(). this.data: ' + JSON.stringify(this.data));

                                            var totalAmount = Number(0);
                                            var totalTax = Number(0);
                                            if (this.data && this.data.forEach) {
                                                this.data.forEach(function (item) {
                                                    var total = Number(0);
                                                    if (item.Amount) {
                                                        totalAmount += Number(item.Amount);
                                                        total += Number(item.Amount);
                                                    }
                                                    if (item.Tax) {
                                                        totalTax += Number(item.Tax);
                                                        total += Number(item.Tax);
                                                    }
                                                    if (item.Total) {
                                                        item.Total = total;
                                                    }
                                                });
                                            }
                                            var grandTotal = totalAmount + totalTax;

                                            var html = '';
                                            html += '<tr>';

                                            html += '<td>';
                                            html == 'Invoice Total';
                                            html += '</td>';

                                            html += '<td class="jsgrid-cell" style="text-align:right;">';
                                            html += formatCurrency(totalAmount);
                                            html += '</td>';

                                            html += '<td class="jsgrid-cell" style="text-align:right;">';
                                            html += formatCurrency(totalTax);
                                            html += '</td>';

                                            html += '<td class="jsgrid-cell" style="text-align:right;">';
                                            html += formatCurrency(grandTotal);
                                            html += '</td>';

                                            html += '</tr>';
                                            this._content.append(html);

                                            thiz.options.jsonData["bwInvoiceGrid"].value = this.data; // Store in the widget.


                                            //$(thiz.element).closest('#budgetrequestform').find("#grandTotal_small")[0].value = formatCurrency(grandTotal); // Update the smaller grid grand total.

                                        } catch (e) {
                                            console.log('Exception in bwInvoiceGrid.onRefreshed:xcx4323-2: ' + e.message + ', ' + e.stack);
                                            $('#spanBwCostsGrid_Error')[0].innerHTML = 'Exception in bwInvoiceGrid.onRefreshed:xcx4323-2: ' + e.message + ', ' + e.stack;
                                        }
                                    },

                                    onItemInserted: function () { // jsGridCosts_large
                                        try {

                                            console.log('xcx123423525-1 In onItemInserted(). thiz.options.jsonData["bwInvoiceGrid"]: ' + JSON.stringify(thiz.options.jsonData["bwInvoiceGrid"]));

                                            //console.log('In bwInvoiceGrid.onItemInserted().');
                                            //        var grandTotal = Number(0);
                                            //        for (var i = 0; i < this.data.length; i++) { // Iterate through the rows and calculate the totals and grand total.
                                            //            var total = Number(0);
                                            //            if (this.data[i].Lease) total += Number(this.data[i].Lease);
                                            //            if (this.data[i].Expense) total += Number(this.data[i].Expense);
                                            //            if (this.data[i].Capital) total += Number(this.data[i].Capital);
                                            //            this.data[i].Total = total;
                                            //            grandTotal += Number(total);
                                            //        }
                                            //        thiz.options.jsonData["bwInvoiceGrid"].value = this.data; // Store in the widget.
                                            //        $('#' + requestDialogParentId + '_Content').find('#grandTotal_large')[0].value = formatCurrencyNoDecimal(grandTotal); // Update the grand total in the large window.
                                            $(thiz.element).closest('#budgetrequestform').find("#jsGridCosts_small").jsGrid("option", "data", thiz.options.jsonData["bwInvoiceGrid"].value); // Update the smaller grid.
                                            //        $(thiz.element).closest('#budgetrequestform').find("#grandTotal_small")[0].value = formatCurrencyNoDecimal(grandTotal); // Update the smaller grid grand total.

                                        } catch (e) {
                                            console.log('Exception in bwInvoiceGrid.onItemInserted: ' + e.message + ', ' + e.stack);
                                            $('#spanBwCostsGrid_Error')[0].innerHTML = 'Exception in bwInvoiceGrid.onItemInserted: ' + e.message + ', ' + e.stack;
                                        }
                                    },
                                    onItemUpdated: function () { // jsGridCosts_large
                                        try {

                                            console.log('xcx3334331 In onItemUpdated(). this.data: ' + JSON.stringify(this.data));

                                            //console.log('In bwInvoiceGrid.onItemInserted().');
                                            //        var grandTotal = Number(0);
                                            //        for (var i = 0; i < this.data.length; i++) { // Iterate through the rows and calculate the totals and grand total.
                                            //            var total = Number(0);
                                            //            if (this.data[i].Lease) total += Number(this.data[i].Lease);
                                            //            if (this.data[i].Expense) total += Number(this.data[i].Expense);
                                            //            if (this.data[i].Capital) total += Number(this.data[i].Capital);
                                            //            this.data[i].Total = total;
                                            //            grandTotal += Number(total);
                                            //        }
                                            //        thiz.options.jsonData["bwInvoiceGrid"].value = this.data; // Store in the widget.
                                            //        $('#' + requestDialogParentId + '_Content').find('#grandTotal_large')[0].value = formatCurrencyNoDecimal(grandTotal); // Update the grand total in the large window.
                                            $(thiz.element).closest('#budgetrequestform').find("#jsGridCosts_small").jsGrid("option", "data", thiz.options.jsonData["bwInvoiceGrid"].value); // Update the smaller grid.
                                            //        $(thiz.element).closest('#budgetrequestform').find("#grandTotal_small")[0].value = formatCurrencyNoDecimal(grandTotal); // Update the smaller grid grand total.

                                        } catch (e) {
                                            console.log('Exception in bwInvoiceGrid.onItemInserted: ' + e.message + ', ' + e.stack);
                                            $('#spanBwCostsGrid_Error')[0].innerHTML = 'Exception in bwInvoiceGrid.onItemUpdated: ' + e.message + ', ' + e.stack;
                                        }
                                    },
                                    onItemDeleted: function () { // jsGridCosts_large
                                        try {

                                            alert('xcx3334331 In onItemDeleted(). this.data: ' + JSON.stringify(this.data));

                                            //console.log('In bwInvoiceGrid.onItemInserted().');
                                            //        var grandTotal = Number(0);
                                            //        for (var i = 0; i < this.data.length; i++) { // Iterate through the rows and calculate the totals and grand total.
                                            //            var total = Number(0);
                                            //            if (this.data[i].Lease) total += Number(this.data[i].Lease);
                                            //            if (this.data[i].Expense) total += Number(this.data[i].Expense);
                                            //            if (this.data[i].Capital) total += Number(this.data[i].Capital);
                                            //            this.data[i].Total = total;
                                            //            grandTotal += Number(total);
                                            //        }
                                            //        thiz.options.jsonData["bwInvoiceGrid"].value = this.data; // Store in the widget.
                                            //        $('#' + requestDialogParentId + '_Content').find('#grandTotal_large')[0].value = formatCurrencyNoDecimal(grandTotal); // Update the grand total in the large window.
                                            $(thiz.element).closest('#budgetrequestform').find("#jsGridCosts_small").jsGrid("option", "data", thiz.options.jsonData["bwInvoiceGrid"].value); // Update the smaller grid.
                                            //        $(thiz.element).closest('#budgetrequestform').find("#grandTotal_small")[0].value = formatCurrencyNoDecimal(grandTotal); // Update the smaller grid grand total.

                                        } catch (e) {
                                            console.log('Exception in bwInvoiceGrid.onItemInserted: ' + e.message + ', ' + e.stack);
                                            $('#spanBwCostsGrid_Error')[0].innerHTML = 'Exception in bwInvoiceGrid.onItemDeleted: ' + e.message + ', ' + e.stack;
                                        }
                                    },
                                    fields: [
                                        {
                                            name: "Description", type: "text", width: 150, validate: "required", editing: true
                                        },
                                        {
                                            name: "Amount", type: "money", step: "0.01", width: 50, editing: true,
                                            itemTemplate: function (value) {
                                                if (value) {
                                                    //return formatCurrencyNoDecimalNoDollarSign(value);
                                                    return formatCurrency(value);
                                                } else {
                                                    return '';
                                                }
                                            },
                                        },
                                        {
                                            name: "Tax", type: "money", step: "0.01", width: 50, editing: true,
                                            itemTemplate: function (value) {
                                                if (value) {
                                                    return formatCurrency(value);
                                                } else {
                                                    return '';
                                                }
                                            },
                                        },
                                        {
                                            name: "Total", type: "money", step: "0.01", width: 50, editing: false,
                                            itemTemplate: function (value) {
                                                if (value) {
                                                    return formatCurrency(value);
                                                } else {
                                                    return '';
                                                }
                                            },
                                        },
                                        { type: "control" }
                                    ]
                                });

                                //{ JSGRID DOCS:
                                //    onDataLoading: function(args) {},    // before controller.loadData
                                //    onDataLoaded: function(args) {},     // on done of controller.loadData

                                //    onError: function(args) {},          // on fail of any controller call
                                //    onInit: function(args) {},           // after grid initialization

                                //    onItemInserting: function(args) {},  // before controller.insertItem
                                //    onItemInserted: function(args) {},   // on done of controller.insertItem
                                //    onItemUpdating: function(args) {},   // before controller.updateItem
                                //    onItemUpdated: function(args) {},    // on done of controller.updateItem
                                //    onItemDeleting: function(args) {},   // before controller.deleteItem
                                //    onItemDeleted: function(args) {},    // on done of controller.deleteItem
                                //    onItemInvalid: function(args) {},    // after item validation, in case data is invalid

                                //    onOptionChanging: function(args) {}, // before changing the grid option
                                //    onOptionChanged: function(args) {},  // after changing the grid option

                                //    onPageChanged: function(args) {},    // after changing the current page

                                //    onRefreshing: function(args) {},     // before grid refresh
                                //    onRefreshed: function(args) {},      // after grid refresh
                                //    }


                            } catch (e) {
                                console.log('Exception in bwInvoiceGrid.js.renderAndPopulateInvoiceGrid().dialog.open(): ' + e.message + ', ' + e.stack);
                                alert('Exception in bwInvoiceGrid.js.renderAndPopulateInvoiceGrid().dialog.open(): ' + e.message + ', ' + e.stack);
                                $('#spanBwCostsGrid_Error')[0].innerHTML = 'Exception in bwInvoiceGrid.js.renderAndPopulateInvoiceGrid().dialog.open(): ' + e.message + ', ' + e.stack;
                            }
                        }
                    });



















                } else {

                    var msg = 'Error in bwInvoiceGrid.js.renderAndPopulateInvoiceGrid(). Unexpected value. xcx21312580089567.';

                    console.log(msg);
                    displayAlertDialog(msg);

                }

            }

        } catch (e) {
            console.log('Exception in renderAndPopulateInvoiceGrid: ' + e.message + ', ' + e.stack);
            var html = '';
            html += '<span style="font-size:2pt;color:red;">CANNOT RENDER bwInvoiceGrid</span>';
            html += '<br />';
            html += '<span style="">Exception in bwInvoiceGrid.renderAndPopulateInvoiceGrid(): ' + e.message + ', ' + e.stack + '</span>';
            thiz.element.html(html);
        }
    },

    copyAttachmentsToInvoice: function (element) {
        try {
            console.log('In bwInvoiceGrid.js.copyAttachmentsToInvoice().');
            // alert('In bwInvoiceGrid.js.copyAttachmentsToInvoice().');
            var thiz = this;

            var budgetrequestform = $(element).closest('#budgetrequestform')[0];
            var bwBudgetRequestId = budgetrequestform.getAttribute('bwbudgetrequestid');
            //var bwRequestTypeId = budgetrequestform.getAttribute('bwrequesttypeid');

            //alert('In bwInvoiceGrid.js.copyAttachmentsToInvoice(). bwBudgetRequestId: ' + bwBudgetRequestId);






            var dialogId = 'divEmailAttachmentsDialog_bwAttachments_' + this.options.elementIdSuffix;
            var div = document.getElementById(dialogId); // 4-1-2020 12-28pm adt.
            if (!div) {
                //alert('In bwAttachments.js.copyAttachmentsToInvoice(). Adding ' + dialogId + ' to the DOM.');
                div = document.createElement('div');
                div.id = dialogId;
                div.style.display = 'none';
                document.body.appendChild(div); // to place at end of document
            } else {
                try {
                    $(div).dialog('close');
                } catch (e) { }
            }



            //if (!div) {
            //    div = document.createElement('div');
            //    div.id = dialogId;
            //    div.style.display = 'none';
            //    document.body.appendChild(div); // to place at end of document

            var html = '';
            //html += '<table style="width:100%;">';
            //html += '   <tr>';
            //html += '       <td style="width:90%;">';
            //html += '           <span id="spanConfigureEmailNotificationsDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:30pt;font-weight:bold;">';
            //html += '               Copy attachments to ' + externallyFacingUrlForAttachments + '';
            //html += '           </span>';
            //html += '           <br />';
            //html += '           <span id="spanConfigureEmailNotificationsDialogSubTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:15pt;font-weight:normal;">';
            //html += '               The recipients of this email will be able to access the attachments using the included links.';
            //html += '           </span>';
            //html += '           <span id="spanConfigureEmailNotificationsDialogInstructionText_EditButton"></span>';
            //html += '       </td>';
            //html += '       <td style="width:9%;"></td>';
            //html += '       <td style="width:1%;cursor:pointer;vertical-align:top;">';
            //html += '           <span class="dialogXButton" style="font-size:35pt;cursor:pointer;width:100%;font-weight:bold;" onclick="$(\'#' + dialogId + '\').dialog(\'close\');">X</span>';
            //html += '       </td>';
            //html += '   </tr>';
            //html += '</table>';
            //html += '<input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
            //html += '<br />';

            //var divEmailRecipients = 'divEmailAttachmentsDialog_bwAttachments_bwPeoplePicker_EmailRecipients_' + this.options.elementIdSuffix;
            //html += '<div id="' + divEmailRecipients + '"></div>';
            //html += '<br />';

            //html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
            //html += '   Subject:';
            //html += '</span>';
            //html == '<br />';
            ////html += '<input type="text" id="' + dialogId + '_SubjectEditor" style="WIDTH: 100%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 12pt;">';
            //html += '<input type="text" id="' + dialogId + '_SubjectEditor" style="WIDTH: 100%;font-family:sans-serif;color: #262626;font-size: 14pt;" />';
            //html += '<br /><br />';
            //html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:12pt;font-weight:bold;">';
            //html += '   Body:';
            //html += '</span>';
            //html == '<br />';
            html += '<div id="' + dialogId + '_BodyEditor" style="height:500px;"></div>'; // Quill. // This is where we set the height of the editor.
            html += '<br />';

            //html += '<div style="white-space:nowrap;">';
            //html += '<div class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" onclick="$(\'.bwAttachments\').bwAttachments(\'emailAttachments\',\'newrequestattachments\', \'' + requestDialogId + '\', \'' + bwBudgetRequestId + '\', \'' + bwRequestTitle + '\', \'' + bwRequestTypeId + '\');">';

            //html += '<div class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" onclick="$(\'.bwInvoiceGrid\').bwInvoiceGrid(\'copyFiles\',\'newrequestattachments\', \'' + requestDialogId + '\', \'' + bwBudgetRequestId + '\', \'' + bwRequestTitle + '\', \'' + bwRequestTypeId + '\');">';


            //html += 'Copy Selected Files to '; // + externallyFacingUrlForAttachments;
            //html += '</div>'; // ☑
            //html += '&nbsp;&nbsp;';
            /*html += '<div class="divSignInButton_Disabled" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" onclick="$(\'.bwAttachments\').bwAttachments(\'sendEmail\', \'' + requestDialogId + '\', \'' + bwBudgetRequestId + '\');">';*/
            //html += 'Send Email';
            //html += '</div>'; // ☑
            //html += '</div>';

            html += '<br />';
            html += '<div class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" onclick="">Close</div>'; // ☑ 

            html += '<br />';
            html += '<div class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;" onclick="$(\'#' + dialogId + '\').dialog(\'close\');">Close</div>'; // ☑ 
            html += '<br /><br />';

            div.innerHTML = html;
            //}



            //alert('xcx32423124 displaying dialog ' + dialogId);
            $('#' + dialogId).dialog({
                modal: true,
                resizable: false,
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                width: '1100',
                dialogClass: 'no-close', // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                close: function () {
                    //$('#' + dialogId).dialog('destroy');
                    $(this).dialog('destroy');
                },
                open: function () {
                    try {
                        //var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                        var workflowAppTitle = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTitle');
                        var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');
                        var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');

                        //var bwEnabledRequestTypes = $('.bwAuthentication').bwAuthentication('option', 'bwEnabledRequestTypes').EnabledItems;

                        //var selectedRequestType_SingletonName;
                        //for (var i = 0; i < bwEnabledRequestTypes.length; i++) {
                        //    if (bwRequestTypeId == bwEnabledRequestTypes[i].bwRequestTypeId) {
                        //        selectedRequestType_SingletonName = bwEnabledRequestTypes[i].SingletonName;
                        //    }
                        //}





                        //alert('xcx098098098098098098');

                        // 11-8-2022
                        var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                        var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

                        var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                        var data = {
                            bwParticipantId_LoggedIn: participantId,
                            bwActiveStateIdentifier: activeStateIdentifier,
                            bwWorkflowAppId_LoggedIn: workflowAppId,

                            bwWorkflowAppId: workflowAppId,
                            bwBudgetRequestId: bwBudgetRequestId
                        };

                        var operationUri = globalUrlPrefix + globalUrlForWebServices + '/_files/' + 'getlistofattachmentsforbudgetrequest';
                        $.ajax({
                            url: operationUri,
                            type: 'POST',
                            data: data,
                            timeout: 15000, // This is done because file services may need more time. 
                            headers: { "Accept": "application/json; odata=verbose" },
                            success: function (results) {
                                try {

                                    var data = results.data;

                                    if (results.status != 'SUCCESS') {
                                        //alert('xcx231234234-2 data: ' + JSON.stringify(data));
                                        $('#' + dialogId + '_BodyEditor').html('<span style="color:tomato;">[Unexpected response from the file server]</span>');

                                    } else if (results.message.indexOf('ENOENT') > -1) {
                                        //alert('xcx231234234-3 data: ' + JSON.stringify(data));
                                        // No such file or directory
                                        console.log('[Server response: No such file or directory: ' + data.path + ']. This is probably Ok.?');

                                    } else if (data && data.length && (data.length > 0)) {
                                        //alert('xcx231234234-4 data: ' + JSON.stringify(data));
                                        //alert('xcx231234234 data: ' + JSON.stringify(data));

                                        var html = '';
                                        var now = new Date();
                                        var folderName = now.toLocaleDateString().replace(/\//g, '-');

                                        //html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:25pt;font-weight:bold;">';
                                        //html += '   Choose a name for the sub-folder:&nbsp;&nbsp;<input id="txtSubfolder_' + thiz.options.elementIdSuffix + '" type="text" value="' + folderName + '" />';
                                        //html += '</span>';
                                        //html += '<br />';
                                        html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:25pt;font-weight:bold;">';
                                        html += '   Select the file(s) you wish to display on the invoice.';
                                        html += '</span>';
                                        $('#' + dialogId + '_BodyEditor').html(html); // It worked, and here were attachments, so get rid of the message.

                                        //
                                        // Display the image thumbnail.
                                        //
                                        var displayImageThumbnail = function (imgId, thumbnailUrl) {
                                            $.get(thumbnailUrl).done(function () {
                                                //debugger;
                                                var img = new Image();
                                                img.src = thumbnailUrl;
                                                img.onload = function (e) {
                                                    try {

                                                        //alert('Displaying thumbnail 2: ' + thumbnailUrl);
                                                        document.getElementById(imgId).src = thumbnailUrl; // There is a thumbnail, so display it.
                                                        //displayAlertDialog('Displayed the thumbnail xcx2357 imgId: ' + imgId + ', thumbnailUrl: ' + thumbnailUrl);
                                                    } catch (e) {

                                                        alert('xcx2312 exception 2: ' + e.message + ', ' + e.stack);

                                                        console.log('Exception in bwInvoiceGrid.js.copyAttachmentsToInvoice.displayImageThumbnail(): ' + e.message + ', ' + e.stack);
                                                        displayAlertDialog('Exception in bwInvoiceGrid.js.copyAttachmentsToInvoice.displayImageThumbnail(): ' + e.message + ', ' + e.stack);
                                                        document.getElementById(imgId).src = globalUrlPrefix + globalUrl + '/images/mp4.jfif'; // There is no thumbnail, so display the icon.
                                                    }


                                                    //try {
                                                    //    alert('Displaying thumbnail 2: ' + thumbnailUrl);
                                                    //    document.getElementById(imgId).src = thumbnailUrl; // There is a thumbnail, so display it.
                                                    //} catch (e) {
                                                    //    alert('xcx2312 exception 2: ' + e.message + ', ' + e.stack);
                                                    //    document.getElementById(imgId).src = globalUrlPrefix + globalUrl + '/images/mp4.jfif'; // There is no thumbnail, so display the icon.
                                                    //}
                                                }
                                            }).fail(function (result) {

                                                alert('fail in Displaying thumbnail 1: ' + thumbnailUrl);

                                                console.log('Fail in bwInvoiceGrid.js.copyAttachmentsToInvoice.displayImageThumbnail(): ' + JSON.stringify(result));
                                                displayAlertDialog('Fail in bwInvoiceGrid.js.copyAttachmentsToInvoice.displayImageThumbnail(): ' + JSON.stringify(result));
                                                document.getElementById(imgId).src = globalUrlPrefix + globalUrl + '/images/mp4.jfif'; // There is no thumbnail, so display the icon.
                                            });
                                        }







                                        var html = '';

                                        html += '<div id="' + dialogId + '_BodyEditor_Attachments" style="overflow-y:scroll;scroll-behavior:smooth;max-height:500px;padding-left:20px;">'; // Need auto-scroll here.
                                        html += '</div>';

                                        $('#' + dialogId + '_BodyEditor').append(html);





                                        for (var i = 0; i < data.length; i++) {



                                            //alert('xcx444432 data[i]: ' + JSON.stringify(data[i]));


                                            var filename = data[i].Display_Filename;
                                            if (filename.indexOf('_thumbnail_') > -1) {

                                                // This is a thumbnail. Do not display as an attachment.

                                            } else {

                                                // This is an actual attachment. Display it!
                                                var description = data[i].Description;
                                                var size = data[i].Size;
                                                if (size && size.toLowerCase && (size.toLowerCase() != 'na')) {
                                                    size = (Number(size) / 1000000).toFixed(1);
                                                }

                                                //var fileUrl = "_files/" + workflowAppId + "/" + bwBudgetRequestId + "/" + filename;

                                                var fileUrl;


                                                var activeStateIdentifier = JSON.parse($('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier'));

                                                if (activeStateIdentifier.status != 'SUCCESS') {

                                                    //html += '[No image. Unauthorized. xcx213124-3-22]';

                                                    fileUrl = '[No image. Unauthorized. xcx213124-3-22x]';


                                                } else {

                                                    //var imagePath = thiz.options.operationUriPrefix + '_files/' + workflowAppId + '/inventoryimages/' + thiz.options.InventoryItems[i].bwInventoryItemId + '/inventoryimage.png?v=' + guid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier;
                                                    //html += '<img xcx="xcx2342462" id="orgImage_' + i + '" src="' + imagePath + '" style="height:120px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;" alt="" onclick="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'btnEdit_OnClick\', \'' + thiz.options.InventoryItems[i].bwInventoryItemId + '\');">';


                                                    //fileUrl = "_files/" + workflowAppId + "/" + bwBudgetRequestId + "/" + filename + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier;

                                                    //  var filename = data[i].Display_Filename;
                                                    fileUrl = "_files/" + workflowAppId + "/" + bwBudgetRequestId + "/" + data[i].Actual_Filename + '?ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier; // 6-2-2023

                                                }












                                                // Centered on the screen.
                                                var width = 800;
                                                var height = 600;
                                                var left = (screen.width - width) / 2;
                                                var top = (screen.height - height) / 2;

                                                var html = '';

                                                html += '<table style="width:100%;" xcx="xcx3254367">';
                                                html += '  <tr>';
                                                html += '    <td style="width:10%;">';




                                                html += '<table>';
                                                html += '   <tr>';
                                                html += '       <td>';
                                                html += '           <input style="transform: scale(3);" bwfilename="' + filename + '" bwfiledescription="' + description + '" bwfilesize="' + size + '" class="cbAttachment" type="checkbox" />';
                                                html += '       </td>';
                                                html += '       <td>&nbsp;&nbsp;</td>';
                                                html += '       <td>';

                                                var extensionIndex = filename.split('.').length - 1;
                                                var fileExtension = filename.toLowerCase().split('.')[extensionIndex];

                                                if (fileExtension == 'png' || fileExtension == 'jpg' || fileExtension == 'jpeg' || fileExtension == 'jfif' || fileExtension == 'webp' || fileExtension == 'gif') {

                                                    html += '<img id="attachmentstest1" xcx="xcx2312-1" src="' + thiz.options.operationUriPrefix + fileUrl + '" style="height:120px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;" alt="" ';
                                                    if (Platform == 'IOS8') {
                                                        html += 'onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');"';
                                                    } else {
                                                        html += 'onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');" ';
                                                    }
                                                    html += ' />';
                                                } else if (fileExtension == 'xlsx' || fileExtension == 'xls') {

                                                    // We need an if statement here to choose between iOS and Windows.
                                                    if (Platform == 'IOS8') {
                                                        html += '<img src="images/excelicon.png" style="width:100px;cursor:pointer;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');" />';
                                                        //html += '<div class="attachmentsSectionFileLink" style="height:50px;border:1px thin red;" onclick="displayAttachmentInDialog(\'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');">';
                                                    } else {
                                                        html += '<img src="images/excelicon.png" style="width:100px;cursor:pointer;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');" />';
                                                        //html += '<div style="cursor:pointer;" class="attachmentsSectionFileLink" onclick="displayAttachmentInDialog(\'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');">';
                                                    }

                                                } else if (fileExtension == 'pdf') {

                                                    //html += '<img src="images/pdf.png" style="width:100px;cursor:pointer;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');" />';

                                                    ////html += '<img src="images/excelicon.png" style="width:100px;height:46px;" />';
                                                    //// We need an if statement here to choose between iOS and Windows.
                                                    ////if (Platform == 'IOS8') {
                                                    ////    html += '<img src="images/excelicon.png" style="width:100px;height:46px;cursor:pointer;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');" />';
                                                    ////    //html += '<div class="attachmentsSectionFileLink" style="height:50px;border:1px thin red;" onclick="displayAttachmentInDialog(\'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');">';
                                                    ////} else {
                                                    //html += '<img src="images/pdf.png" style="width:100px;cursor:pointer;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');" />';
                                                    ////html += '<div style="cursor:pointer;" class="attachmentsSectionFileLink" onclick="displayAttachmentInDialog(\'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');">';
                                                    ////}


                                                    var imgId = 'img_bwAttachments_' + thiz.options.elementIdSuffix + '_' + bwBudgetRequestId + '_' + i;

                                                    var thumbnailUrl = thiz.options.operationUriPrefix + "_files/" + workflowAppId + "/" + bwBudgetRequestId + "/" + filename + '_thumbnail_320px_pdf_' + '.png';

                                                    html += '<img xcx="xcx3396048" id="' + imgId + '" style="height:120px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;" alt="" src="' + thumbnailUrl + '" ';
                                                    html += '   onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');" ';
                                                    html += ' />';
                                                    //var thumbnailUrl = "_files/" + workflowAppId + "/" + bwBudgetRequestId + "/" + filename + '_thumbnail_' + '.jpg'; // thiz.options.operationUriPrefix

                                                    //var thumbnailUrl = thiz.options.operationUriPrefix + "_files/" + workflowAppId + "/" + bwBudgetRequestId + "/" + filename + '_thumbnail_' + '.jpg';
                                                    //alert('xcx1111111 thumbnailUrl: ' + thumbnailUrl);
                                                    //alert('imgId: ' + imgId);
                                                    displayImageThumbnail(imgId, thumbnailUrl);


                                                } else if (fileExtension == 'mp4') {

                                                    var imgId = 'img_bwAttachments_' + thiz.options.elementIdSuffix + '_' + bwBudgetRequestId + '_' + i;

                                                    var thumbnailUrl = thiz.options.operationUriPrefix + "_files/" + workflowAppId + "/" + bwBudgetRequestId + "/" + filename + '_thumbnail_' + '.jpg';

                                                    html += '<img xcx="xcx3396048" id="' + imgId + '" style="height:120px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;" alt="" src="' + thumbnailUrl + '" ';
                                                    html += '   onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');" ';
                                                    html += ' />';
                                                    //var thumbnailUrl = "_files/" + workflowAppId + "/" + bwBudgetRequestId + "/" + filename + '_thumbnail_' + '.jpg'; // thiz.options.operationUriPrefix

                                                    //var thumbnailUrl = thiz.options.operationUriPrefix + "_files/" + workflowAppId + "/" + bwBudgetRequestId + "/" + filename + '_thumbnail_' + '.jpg';
                                                    //alert('xcx1111111 thumbnailUrl: ' + thumbnailUrl);
                                                    //alert('imgId: ' + imgId);
                                                    displayImageThumbnail(imgId, thumbnailUrl);

                                                } else if (fileExtension == 'rtf') {

                                                    html += '<img src="images/rtf.png" style="width:50px;cursor:pointer;" ';

                                                    html += 'onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');" ';
                                                    html += ' />';
                                                } else if (fileExtension == 'vob') {

                                                    html += '<img src="images/vob.png" style="width:50px;cursor:pointer;" ';

                                                    html += 'onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');" ';
                                                    html += ' />';
                                                } else if (fileExtension == 'mp3') {

                                                    html += '<img src="images/mp3.png" style="width:50px;cursor:pointer;" ';

                                                    html += 'onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');" ';
                                                    html += ' />';
                                                }

                                                html += '       </td>';
                                                html += '   </tr>';
                                                html += '</table>';





                                                html += '    </td>';
                                                html += '    <td style="width:90%;white-space:normal;">';

                                                // We need an if statement here to choose between iOS and Windows.
                                                if (Platform == 'IOS8') {
                                                    html += '<div xcx="xcx21342346-1" class="attachmentsSectionFileLink" style="height:50px;border:1px thin red;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');">';
                                                } else {
                                                    html += '<div xcx="xcx21342346-2" class="attachmentsSectionFileLink" style="cursor:pointer;white-space:nowrap;width:250px;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');">';
                                                }

                                                html += filename;

                                                // Display the file attachment description.
                                                if (description.length > 0) {
                                                    //$('#' + attachmentsSectionId).append('&nbsp;&nbsp;<span class="attachmentsSectionDescription"> - "' + description + '"</span>');

                                                    html += '<br /><span class="attachmentsSectionDescription"> - "' + description + '"</span>';
                                                    //html += '<br /><span class="attachmentsSectionSize"> - ' + size + ' mb</span>';
                                                } else {
                                                    //$('#' + attachmentsSectionId).append('&nbsp;&nbsp;<span class="attachmentsSectionDescription"> - [no description]' + description + '</span>'); // Leave the description variable here because then we will know if something unexpected happens.

                                                    html += '<br /><span class="attachmentsSectionDescription"> - [no description]' + description + '</span>';

                                                }

                                                if (size && size.toLowerCase && (size.toLowerCase() != 'na')) {
                                                    html += '<br /><span class="attachmentsSectionDescription">' + size + ' MB</span>';
                                                } else {
                                                    html += '<br /><span class="attachmentsSectionDescription" style="">[size unavailable]</span>';
                                                }

                                                //if (showRemoveAttachmentButton && (showRemoveAttachmentButton == 'true')) {
                                                //    //$('#' + attachmentsSectionId).append("&nbsp;&nbsp;<input type=\"button\" style=\"cursor:pointer;\" id=\"removeBudgetRequestAttachment" + i + "\" value=\"Remove\" onclick=\"removeAttachment('" + filename + "', '" + attachmentsSectionId + "', '" + _workflowAppId + "', '" + _budgetRequestId + "');\" />");

                                                //    html += '&nbsp;&nbsp;<input type="button" style="cursor:pointer;" id="removeBudgetRequestAttachment' + i + '" value="Remove" onclick="removeAttachment(\'' + filename + '\', \'' + attachmentsTagId + '\', \'' + bwWorkflowAppId + '\', \'' + bwBudgetRequestId + '\');" />';
                                                //}

                                                html += '</div>';

                                                html += '</br>';

                                                $('#' + dialogId + '_BodyEditor_Attachments').append(html);

                                            }
                                        }





                                    } else if (data) {
                                        //alert('xcx231234234-5 data: ' + JSON.stringify(data));
                                        $('#' + dialogId + '_BodyEditor').innerHTML = '<span xcx="xcx22945-1" style="color:tomato;">No attachments found: ' + JSON.stringify(data) + '</span>';

                                    } else {
                                        //displayAlertDialog('xcx231234234-6 data: ' + JSON.stringify(data));
                                        $('#' + dialogId + '_BodyEditor').innerHTML = '<span xcx="xcx22945-1" style="color:tomato;">ERROR: Unexpected response: ' + JSON.stringify(data) + '</span>';
                                    }
                                } catch (e) {
                                    console.log('Exception in bwInvoiceGrid.js.copyAttachmentsToInvoice.dialog.open.ajax.success(): ' + e.message + ', ' + e.stack);
                                    displayAlertDialog('Exception in bwInvoiceGrid.js.copyAttachmentsToInvoice.dialog.open.ajax.success(): ' + e.message + ', ' + e.stack);
                                }

                            },
                            error: function (data, errorCode, errorMessage) {
                                console.log('Error in bwInvoiceGrid.js.copyAttachmentsToInvoice.dialog.open.ajax.error(): ' + errorMessage + ', workflowAppId: ' + workflowAppId + ', bwBudgetRequestId: ' + bwBudgetRequestId + ', participantId: ' + participantId);
                                displayAlertDialog('Error in bwInvoiceGrid.js.copyAttachmentsToInvoice.dialog.open.ajax.error(): ' + errorMessage + ', workflowAppId: ' + workflowAppId + ', bwBudgetRequestId: ' + bwBudgetRequestId + ', participantId: ' + participantId);
                            }
                        });
                    } catch (e) {
                        console.log('Exception in bwInvoiceGrid.js.copyAttachmentsToInvoice.dialog.open(): ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwInvoiceGrid.js.copyAttachmentsToInvoice.dialog.open(): ' + e.message + ', ' + e.stack);
                    }
                }
            });
            //$('#divConfigureEmailNotificationsDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();


        } catch (e) {
            console.log('Exception in bwInvoiceGrid.js.copyAttachmentsToInvoice(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwInvoiceGrid.js.copyAttachmentsToInvoice(): ' + e.message + ', ' + e.stack);
        }
    },

    viewInLargeWindow: function () {
        try {
            console.log('In bwInvoiceGrid.js.viewInLargeWindow().');
            var thiz = this;

            window.scrollTo(0, 0);
            $('.bwActiveMenu').bwActiveMenu('adjustLeftSideMenu'); // This makes sure our new stretchy-left-menu redraws Ok.

            var bwBudgetRequestId = $(this.element).closest('#budgetrequestform')[0].getAttribute('bwbudgetrequestid');
            var bwWorkflowTaskItemId = $(this.element).closest('#budgetrequestform')[0].getAttribute('bwworkflowtaskitemid');
            //var bwRequestType = $(this.element).closest('#budgetrequestform')[0].getAttribute('bwrequesttype');
            var bwRequestTitle = $(this.element).closest('#budgetrequestform')[0].getAttribute('bwrequesttitle');

            var bwOrgId = $(this.element).closest('#budgetrequestform')[0].getAttribute('bworgid');
            var bwOrgName = $(this.element).closest('#budgetrequestform')[0].getAttribute('bworgname');

            this.pinRequestDialog();
            var requestDialogId = 'divZoomedBwCostsGridDialog_' + bwBudgetRequestId;
            if ($('#' + requestDialogId).is(':visible')) {
                $('#' + requestDialogId).dialog('close');
            }
            var html = '';
            //html += '<div style="display:none;" id="divRequestFormDialog">';
            html += '        <table style="width:100%;">';
            html += '            <tr>';
            html += '                <td style="width:90%;">';
            //html += '                    <span id="divRequestWorkflowAuditTrailContent"></span>';
            html += '                    <span id="divRequestFormContent"></span>';
            html += '                </td>';
            html += '            </tr>';
            html += '        </table>';
            html += '        <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and zooming in on the iPhone. -->';
            html += '        <br /><br />';
            //html += '    </div>';

            //
            // THIS IS PART OF THE PIN FUNCTIONALITY 4-1-2020
            //

            var div = document.getElementById(requestDialogId); // 4-1-2020 12-28pm adt.
            if (!div) { // for some reason this gets added twice to the DOM. Figure this out someday, but for now this seems to fix it and is a good safety I suppose.
                div = document.createElement('div');
                div.id = requestDialogId;

                //
                // This is a new thing 11-18-2023.
                // Adding .bwInvoiceGrid to the class for this div. This way we can identify the widget. Not the best way to do this maybe but doing it this way for now. Maybe the widget should be instantiating itself, but anyways...
                //
                //div.classList.add('bwInvoiceGrid');


                document.body.appendChild(div); // to place at end of document

            }
            div.innerHTML = html;

            $('#' + requestDialogId).dialog({
                modal: false,
                resizable: true,
                closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                width: '90%', // We are doing this because we want to take up most of the screen. This allows the user to view detailed entries easily. 11-16-2023.
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                position: {
                    my: "middle top+12",
                    at: "middle top",
                    of: window
                },
                open: function () {
                    try {
                        var element2 = document.getElementById(requestDialogId).parentNode; // This is the best way to get a handle on the jquery dialog.
                        var requestDialogParentId = requestDialogId + '_Parent'; // We need to have an id value so we can refer to this. It doesn't have one unless we add it here.
                        element2.id = requestDialogParentId; // We need to have an id value so we can refer to this. It doesn't have one unless we add it here.

                        var widgetOptions = {
                            displayContext: 'dialog',
                            bwBudgetRequestId: bwBudgetRequestId,
                            bwWorkflowTaskItemId: bwWorkflowTaskItemId,
                            bwOrgId: bwOrgId,
                            bwOrgName: bwOrgName,
                            bwRequestTitle: bwRequestTitle,
                            requestDialogParentId: requestDialogParentId,
                            jsonData: thiz.options.jsonData, // this only send the data required for the particular widget.
                            allowRequestModifications: thiz.options.allowRequestModifications,
                            bwRequestJson: thiz.options.bwRequestJson,
                            renderAsARequiredField: thiz.options.renderAsARequiredField,
                            customRenderingInstructions: thiz.options.formWidget_CustomRenderingInstructions
                        };

                        var element = $(div).find('#divRequestFormContent')[0];

                        $(element).bwInvoiceGrid(widgetOptions); // Instantiate the widget with displayContext of "dialog".

                    } catch (e) {
                        console.log('Exception in bwInvoiceGrid.viewInLargeWindow().dialog.open(): ' + e.message + ', ' + e.stack);
                        $('#spanBwCostsGrid_Error')[0].innerHTML = 'Exception in bwInvoiceGrid.viewInLargeWindow().dialog.open(): ' + e.message + ', ' + e.stack;
                    }
                }
            });
            try {
                $('.ui-widget-overlay')[0].style.zIndex = 9;
                $('#' + requestDialogId).dialog().parents('.ui-dialog')[0].style.zIndex = 10; // THIS IS A HACK ?? IS THIS THE BEST PLACE FOR THIS ?? >>>>>>>>>>>>>>>>>>>>>>>>>>>> 2-15-2020
            } catch (e) {

            }
        } catch (e) {
            console.log('Exception in bwInvoiceGrid.viewInLargeWindow(): ' + e.message + ', ' + e.stack);
            $('#spanBwCostsGrid_Error')[0].innerHTML = 'Exception in bwInvoiceGrid.viewInLargeWindow(): ' + e.message + ', ' + e.stack;
        }
    },


    viewInLargeWindow_original_11_18_2023: function () {
        try {
            console.log('In bwInvoiceGrid.js.viewInLargeWindow().');
            var thiz = this;

            window.scrollTo(0, 0);
            $('.bwActiveMenu').bwActiveMenu('adjustLeftSideMenu'); // This makes sure our new stretchy-left-menu redraws Ok.

            var bwBudgetRequestId = $(this.element).closest('#budgetrequestform')[0].getAttribute('bwbudgetrequestid');
            var bwWorkflowTaskItemId = $(this.element).closest('#budgetrequestform')[0].getAttribute('bwworkflowtaskitemid');
            var bwRequestType = $(this.element).closest('#budgetrequestform')[0].getAttribute('bwrequesttype');
            var bwRequestTitle = $(this.element).closest('#budgetrequestform')[0].getAttribute('bwrequesttitle');
            this.pinRequestDialog();
            var requestDialogId = 'divZoomedBwCostsGridDialog_' + bwBudgetRequestId;
            if ($('#' + requestDialogId).is(':visible')) {
                $('#' + requestDialogId).dialog('close');
            }
            var html = '';
            //html += '<div style="display:none;" id="divRequestFormDialog">';
            html += '        <table style="width:100%;">';
            html += '            <tr>';
            html += '                <td style="width:90%;">';
            //html += '                    <span id="divRequestWorkflowAuditTrailContent"></span>';
            html += '                    <span id="divRequestFormContent"></span>';
            html += '                </td>';
            html += '            </tr>';
            html += '        </table>';
            html += '        <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and zooming in on the iPhone. -->';
            html += '        <br /><br />';
            //html += '    </div>';

            //
            // THIS IS PART OF THE PIN FUNCTIONALITY 4-1-2020
            //

            var div = document.getElementById(requestDialogId); // 4-1-2020 12-28pm adt.
            if (!div) { // for some reason this gets added twice to the DOM. Figure this out someday, but for now this seems to fix it and is a good safety I suppose.
                div = document.createElement('div');
                div.id = requestDialogId;

                //
                // This is a new thing 11-18-2023.
                // Adding .bwInvoiceGrid to the class for this div. This way we can identify the widget. Not the best way to do this maybe but doing it this way for now. Maybe the widget should be instantiating itself, but anyways...
                //
                //div.classList.add('bwInvoiceGrid');


                document.body.appendChild(div); // to place at end of document

            }
            div.innerHTML = html;

            $('#' + requestDialogId).dialog({
                modal: false,
                resizable: true,
                closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                width: '90%', // We are doing this because we want to take up most of the screen. This allows the user to view detailed entries easily. 11-16-2023.
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                position: {
                    my: "middle top+12",
                    at: "middle top",
                    of: window
                },
                open: function () {
                    try {
                        var element2 = document.getElementById(requestDialogId).parentNode; // This is the best way to get a handle on the jquery dialog.
                        var requestDialogParentId = requestDialogId + '_Parent'; // We need to have an id value so we can refer to this. It doesn't have one unless we add it here.
                        element2.id = requestDialogParentId; // We need to have an id value so we can refer to this. It doesn't have one unless we add it here.







                        // This creates the custom header/draggable bar on the dialog!!! 4-2-2020. // ☈ ☇ https://www.toptal.com/designers/htmlarrows/symbols/thunderstorm/
                        var html = '';
                        html += '<table xcx="xcx3249-2-1" style="width:100%;" onclick="$(\'.bwRequest\').bwRequest(\'pinRequestDialog\');" ondblclick="$(\'.bwRequest\').bwRequest(\'zoomAndCenter\', \'' + requestDialogId + '\');" >'; // This click event is like "pin". Once the user clicks the header of the request dialog, it no longer is modal and persists on the screen until they choose to close it.
                        html += '   <tr>';
                        html += '       <td style="width:95%;">';
                        html += '           <div id="slider_' + requestDialogId + '" style="width:20%;cursor:pointer;"></div>';
                        html += '       </td>';


                        html += '       <td style="vertical-align:middle;width:5%;padding:0;border:0;margin:0;">';

                        // This is where we display the "Pin". If it is pinned, or if it is not pinned.
                        var pinned = false;
                        var pinnedRequests = $('.bwAuthentication:first').bwAuthentication('option', 'PINNED_REQUESTS');
                        if (pinnedRequests && pinnedRequests.length) {
                            for (var i = 0; i < pinnedRequests.length; i++) {
                                if (pinnedRequests[i].bwBudgetRequestId == bwBudgetRequestId) {
                                    pinned = true;
                                }
                            }
                        }
                        if (pinned != true) {
                            html += '           <div title="pin" class="pinButton" style="display:inline-block;font-size:18pt;cursor:pointer !important;" onclick="$(\'.bwRequest\').bwRequest(\'pinRequest\', \'' + bwBudgetRequestId + '\', \'' + requestDialogId + '\', true);"><img src="/images/pin.png" style="width:50px;height:50px;cursor:pointer !important;" /></div>';
                        } else {
                            html += '           <div title="un-pin" class="pinButton" style="display:inline-block;font-size:18pt;cursor:pointer !important;" onclick="$(\'.bwRequest\').bwRequest(\'pinRequest\', \'' + bwBudgetRequestId + '\', \'' + requestDialogId + '\', false);"><img src="/images/unpin.png" style="width:50px;height:50px;cursor:pointer !important;" /></div>';
                        }

                        //displayAlertDialog('pinnedRequests: ' + JSON.stringify(pinnedRequests));
                        //if (pinnedRequests && pinnedRequests.length) {
                        //    if (pinnedRequests.indexOf(bwBudgetRequestId) > -1) {
                        //        html += '           <div title="un-pin" class="pinButton" style="display:inline-block;font-size:18pt;cursor:pointer !important;" onclick="$(\'.bwRequest\').bwRequest(\'pinRequest\', \'' + bwBudgetRequestId + '\', \'' + requestDialogId + '\', false);"><img src="/images/unpin.png" style="width:50px;height:50px;cursor:pointer !important;" /></div>';
                        //    } else {
                        //        html += '           <div title="pin" class="pinButton" style="display:inline-block;font-size:18pt;cursor:pointer !important;" onclick="$(\'.bwRequest\').bwRequest(\'pinRequest\', \'' + bwBudgetRequestId + '\', \'' + requestDialogId + '\', true);"><img src="/images/pin.png" style="width:50px;height:50px;cursor:pointer !important;" /></div>';
                        //    }
                        //} else {
                        //    html += '           <div title="pin" class="pinButton" style="display:inline-block;font-size:18pt;cursor:pointer !important;" onclick="$(\'.bwRequest\').bwRequest(\'pinRequest\', \'' + bwBudgetRequestId + '\', \'' + requestDialogId + '\', true);"><img src="/images/pin.png" style="width:50px;height:50px;cursor:pointer !important;" /></div>';
                        //}


                        html += '       </td>';


                        // Refresh button. This is good if you want to refresh and see the state of the file conversion from vob to mp4, for instance. 9-7-2022
                        html += '       <td style="vertical-align:top;width:5%;padding:0;border:0;margin:0;">';
                        html += '           <span id="' + requestDialogId + '_spanRequestPrintButton" style="text-align:right;cursor:pointer;font-size:30pt;" onclick="$(\'.bwRequest\').bwRequest(\'reloadAndRefreshTheRequest\', \'' + requestDialogId + '\', \'' + bwBudgetRequestId + '\', \'' + bwWorkflowTaskItemId + '\');">';
                        html += '               ♻';
                        html += '           </span>';
                        //html += '           <A HREF="#" onClick="window.open(\'https://budgetworkflow.com\', \'Sample\',\'toolbar=no,width=190,height=190,left=500,top=200,status=no,scrollbars=no,resize=no\');return false">[...]</A>.';
                        html += '       </td>';

                        html += '       <td style="vertical-align:top;width:5%;padding:0;border:0;margin:0;">';
                        //var activeStateIdentifier = '';
                        //try {
                        //    activeStateIdentifier = this.getUrlParams()['ActiveStateIdentifier'].toString().split('#')[0];
                        //} catch (e) { }


                        if (window.opener) {

                            html += '                   <span id="' + requestDialogId + '_spanRequestPrintButton" style="text-align:right;cursor:pointer;font-size:30pt;" onclick="$(\'.bwInvoiceGrid\').bwInvoiceGrid(\'LaunchIntoHomeWindow\', \'' + bwBudgetRequestId + '\');">';
                            html += '                       ☈';
                            html += '                   </span>';

                        } else {

                            html += '           <span id="' + requestDialogId + '_spanRequestPrintButton" style="text-align:right;cursor:pointer;font-size:30pt;" onclick="$(\'.bwInvoiceGrid\').bwInvoiceGrid(\'LaunchIntoSeparateWindow\', \'' + requestDialogId + '\', \'' + bwBudgetRequestId + '\', \'' + bwWorkflowTaskItemId + '\');">';
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
                                thiz.setZoom(ui.value, requestDialogId);
                            }//,
                            //change: function (event, ui) {
                            //    thiz.setZoom(ui.value, requestDialogId);
                            //}
                        });
                        thiz.setZoom(100, requestDialogId);

                        // Render the Print button.
                        //var printButtonOptions = {
                        //    reportType: 'IndividualRequestReport',
                        //    store: thiz.options.store,
                        //    bwWorkflowAppId: thiz.options.bwWorkflowAppId
                        //    //bwBudgetRequestId: this.options.bwBudgetRequestId
                        //};
                        //var $printbutton = $('#' + requestDialogId + '_spanRequestPrintButton').bwPrintButton(printButtonOptions);

                        $('.ui-widget-overlay').bind('click', function () {
                            $('#' + requestDialogId).dialog('close');
                        });

























                        //// This creates the custom header/draggable bar on the dialog!!! 4-2-2020. // ☈ ☇ https://www.toptal.com/designers/htmlarrows/symbols/thunderstorm/
                        //var html = '';
                        //html += '<table style="width:100%;" onclick="$(\'.bwRequest\').bwRequest(\'pinRequestDialog\');" ondblclick="$(\'.bwRequest\').bwRequest(\'zoomAndCenter\', \'' + requestDialogId + '\');">'; // This click event is like "pin". Once the user clicks the header of the request dialog, it no longer is modal and persists on the screen until they choose to close it.
                        //html += '   <tr>';
                        //html += '       <td style="width:95%;">';
                        //html += '           <div id="slider_' + requestDialogId + '" style="width:20%;cursor:pointer;"></div>';
                        //html += '       </td>';
                        //html += '       <td>';
                        //html += '           <span class="dialogXButton" style="font-size:25pt;cursor:pointer;width:100%;font-weight:bold;" onclick="$(\'#' + requestDialogId.replace('_Parent', '') + '\').dialog(\'close\');">X</span>';
                        //html += '       </td>';
                        //html += '   </tr>';
                        //html += '</table>';

                        //document.getElementById(requestDialogId).parentNode.querySelector(".ui-dialog-titlebar").innerHTML = html;

                        html = '';
                        //var form = $('#divNewRequest').find('#budgetrequestform'); // var bwBudgetRequestId = $(element).closest('#budgetrequestform')[0].getAttribute('bwbudgetrequestid');
                        var bwOrgId = $(thiz.element).closest('#budgetrequestform')[0].getAttribute('bworgid'); // $('#' + requestDialogId).find('#budgetrequestform')[0].getAttribute('bworgid'); // document.getElementById('budgetrequestform').getAttribute('bworgid'); // selected OrgId on the new request form: txtLocationPickerFilter attribute bworgid
                        var bwOrgName = $(thiz.element).closest('#budgetrequestform')[0].getAttribute('bworgname'); // document.getElementById('budgetrequestform').getAttribute('bworgname'); // selected OrgId on the new request form: txtLocationPickerFilter attribute bworgid

                        html += '<div id="budgetrequestworkflowparticipantsdialog" class="context-menu-newrequesteditorxx" align="left" bwbudgetrequestid="" bwrequesttype="" orgid="" orgname="">';
                        html += '<table style="BORDER-TOP-STYLE: none; WORD-WRAP: break-word; BORDER-LEFT-STYLE: none; BORDER-COLLAPSE: collapse; TABLE-LAYOUT: fixed; BORDER-BOTTOM-STYLE: none; BORDER-RIGHT-STYLE: none; " class="xdFormLayout">';
                        html += '    <colgroup>';
                        html += '        <col style="" />';
                        html += '    </colgroup>';
                        html += '    <tbody>';
                        html += '        <tr class="xdTableContentRow">';
                        html += '            <td style="display:block;BORDER-TOP: #d8d8d8 1pt solid; BORDER-RIGHT: #d8d8d8 1pt solid; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 0px; PADDING-TOP: 0px; PADDING-LEFT: 0px; BORDER-LEFT: #d8d8d8 1pt solid; PADDING-RIGHT: 0px" class="xdTableContentCell">';
                        html += '                <div />';
                        html += '                <table style="width:100%;">';
                        html += '                    <tr>';
                        html += '                        <td colspan="4">';
                        html += '                           <span id="' + requestDialogId + '_requestOrgClickableBreadcrumb" style="color:purple;font-size:8pt;">' + bwOrgName + '</span>';
                        html += '                       </td>';
                        html += '                    </tr>';
                        html += '                    <tr>';
                        html += '                        <td width="5px"></td>';
                        html += '                        <td>';
                        html += '                   <span>';
                        html += '<img id="' + requestDialogId + '_imgRequestOrgImage" src="' + thiz.options.operationUriPrefix + 'images/corporeal.png" style="width:150px;height:150px;"/>';




                        // Try to get a custom image. If none found, use the OOB one.
                        var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');


                        var imagePath;

                        var preventCachingGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                            return v.toString(16);
                        });

                        var activeStateIdentifier = JSON.parse($('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier'));

                        if (activeStateIdentifier.status != 'SUCCESS') {

                            imagePath += '[No image. Unauthorized. xcx213124-3-6664323]';

                        } else {

                            imagePath = thiz.options.operationUriPrefix + '_files/' + workflowAppId + '/orgimages/' + bwOrgId + '/' + 'orgimage.png?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier;

                        }

                        $.get(imagePath).done(function () {
                            setTimeout(function () { // Only needs to happen for Chrome.
                                $('#' + requestDialogId + '_imgRequestOrgImage').attr('src', imagePath);
                            }, 500);
                        }).fail(function () {
                            //alert("This org has no image."); // do nothing 
                        });
                        // End: Getting the custom image






                        html += '                   </span>';
                        html += '                        </td>';
                        html += '                        <td colspan="2" style="text-align:left;vertical-align:top;">';

                        //html += '                           <span id="' + requestDialogParentId + '_BwRequestType" style="font-size:1em;">';
                        //html += '                               [._BwRequestType]';
                        //html += '                           </span>';
                        html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 40pt;font-weight:bold;">Costs</span>';

                        html += '                           <br />';
                        //html += '                           <span id="' + requestDialogParentId + '_WorkflowGuid" style="color:gray;">[._WorkflowGuid]</span>';
                        if (bwRequestTitle == 'New') {
                            html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 25pt;font-weight:bold;">for New Budget Request</span>';
                        } else {
                            html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 25pt;font-weight:bold;cursor:pointer;text-decoration:underline;" '; // + '</span>';
                            html += 'onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'' + bwBudgetRequestId + '\', \'' + bwRequestTitle + '\', \'\', \'' + bwRequestTitle + '\', \'\');" >';
                            html += 'for Budget Request: ' + bwRequestTitle + '</span>';
                        }

                        html += '                        </td>';
                        html += '                    </tr>';


                        html += '<tr>';
                        html += '   <td colspan="4" style="height:15px;">';
                        html += '       <span class="xdlabel" id="spanBwCostsGrid_Error" style="color:tomato;" hidefocus="1"></span>'; // Errors and exceptions get displayed here.
                        html += '   </td>';
                        html += '</tr>';



                        html += '                </table>';

                        html += '<span id="' + requestDialogParentId + '_Content"></span>';
                        document.getElementById(requestDialogId).innerHTML = html;

                        $("#slider_" + requestDialogId).slider({
                            min: 50,
                            max: 200,
                            value: 100, // It starts off full size.
                            slide: function (event, ui) {
                                thiz.setZoom(ui.value, requestDialogId);
                            }//,
                            //change: function (event, ui) {
                            //    thiz.setZoom(ui.value, requestDialogId);
                            //}
                        });
                        thiz.setZoom(100, requestDialogId);

                        var html = '';
                        html += '   <table>';
                        html += '       <tr>';
                        html += '           <td>';
                        html += '               <div id="jsGridCosts_large" style="font-size:60%;"></div>';
                        html += '           </td>';
                        html += '       </tr>';
                        html += '       <tr>';
                        html += '           <td style="text-align:right;">';
                        html += '<br />';
                        html += '               <span class="xdlabel" style="font-size:15pt;font-weight:bold;">Invoice Total:</span>';
                        html += '               <input id="grandTotal_large" disabled style="color:black;WIDTH: 140px;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 18pt;TEXT-ALIGN: right;" type="text">';
                        html += '               &nbsp;&nbsp;';
                        html += '               <br /><br /><br />';
                        html += '           </td>';
                        html += '       </tr>';
                        html += '   </table';
                        document.getElementById(requestDialogParentId + '_Content').innerHTML = html;

                        // If we have jsonData, populate the element.
                        if (thiz.options.jsonData["bwInvoiceGrid"]) {
                            // already have data
                        } else {
                            // no data yet
                            thiz.options.jsonData["bwInvoiceGrid"] = {
                                value: null
                            }
                        }

                        $('#' + requestDialogParentId + '_Content').find("#jsGridCosts_large").jsGrid({
                            width: "100%",
                            //height: "100%", 
                            maxHeight: 'auto',

                            inserting: true,
                            editing: true,
                            sorting: true,
                            paging: true,

                            confirmDeleting: false, // false prevents the alert from popping up

                            data: thiz.options.jsonData["bwInvoiceGrid"].value,
                            noDataContent: "Click the \"Plus\" (<span style='color:green;font-weight:bold;font-size:x-large;'>+</span>) sign to add a Cost item...",

                            onInit: function () {
                                try {
                                    console.log('In bwInvoiceGrid.onInit-large().');

                                    console.log('In bwInvoiceGrid.onInit-large(). xcx333433 In onInit(). this.data: ' + JSON.stringify(this.data));

                                    var grandTotal = Number(0);
                                    for (var i = 0; i < this.data.length; i++) { // Iterate through the rows and calculate the totals and grand total.
                                        var total = Number(0);
                                        if (this.data[i].Amount) total += Number(this.data[i].Amount);
                                        //if (this.data[i].Expense) total += Number(this.data[i].Expense);
                                        if (this.data[i].Tax) total += Number(this.data[i].Tax);
                                        this.data[i].Total = total;
                                        grandTotal += Number(total);
                                    }
                                    if ($('#' + requestDialogParentId + '_Content').find('#grandTotal_large')[0]) {
                                        $('#' + requestDialogParentId + '_Content').find('#grandTotal_large')[0].value = formatCurrencyNoDecimal(grandTotal); // Update the grand total in the large window.
                                    }
                                    //$(thiz.element).closest('#budgetrequestform').find("#grandTotal")[0].value = formatCurrencyNoDecimal(grandTotal); // Update the smaller grid grand total.
                                } catch (e) {
                                    console.log('Exception in bwInvoiceGrid.onInit: ' + e.message + ', ' + e.stack);
                                }
                            },

                            onRefreshed: function (args) { // jsGridCosts_large
                                try {

                                    console.log('xcx3334 In bwInvoiceGrid.onRefreshed(). this.data: ' + JSON.stringify(this.data));

                                    var totalAmount = Number(0);
                                    var totalTax = Number(0);
                                    if (this.data && this.data.forEach) {
                                        this.data.forEach(function (item) {
                                            var total = Number(0);
                                            if (item.Amount) {
                                                totalAmount += Number(item.Amount);
                                                total += Number(item.Amount);
                                            }
                                            if (item.Tax) {
                                                totalTax += Number(item.Tax);
                                                total += Number(item.Tax);
                                            }
                                            if (item.Total) {
                                                item.Total = total;
                                            }
                                        });
                                    }
                                    var grandTotal = totalAmount + totalTax;

                                    var html = '';
                                    html += '<tr>';

                                    html += '<td>';
                                    html == 'Invoice Total';
                                    html += '</td>';

                                    html += '<td class="jsgrid-cell" style="text-align:right;">';
                                    html += formatCurrency(totalAmount);
                                    html += '</td>';

                                    html += '<td class="jsgrid-cell" style="text-align:right;">';
                                    html += formatCurrency(totalTax);
                                    html += '</td>';

                                    html += '<td class="jsgrid-cell" style="text-align:right;">';
                                    html += formatCurrency(grandTotal);
                                    html += '</td>';

                                    html += '</tr>';
                                    this._content.append(html);

                                    thiz.options.jsonData["bwInvoiceGrid"].value = this.data; // Store in the widget.

                                    $(thiz.element).closest('#budgetrequestform').find("#grandTotal_small")[0].value = formatCurrency(grandTotal); // Update the smaller grid grand total.

                                } catch (e) {
                                    console.log('Exception in bwInvoiceGrid.onRefreshed:xcx4323-2: ' + e.message + ', ' + e.stack);
                                    $('#spanBwCostsGrid_Error')[0].innerHTML = 'Exception in bwInvoiceGrid.onRefreshed:xcx4323-2: ' + e.message + ', ' + e.stack;
                                }
                            },

                            onItemInserted: function () { // jsGridCosts_large
                                try {

                                    console.log('xcx123423525-1 In onItemInserted(). thiz.options.jsonData["bwInvoiceGrid"]: ' + JSON.stringify(thiz.options.jsonData["bwInvoiceGrid"]));

                                    //console.log('In bwInvoiceGrid.onItemInserted().');
                                    //        var grandTotal = Number(0);
                                    //        for (var i = 0; i < this.data.length; i++) { // Iterate through the rows and calculate the totals and grand total.
                                    //            var total = Number(0);
                                    //            if (this.data[i].Lease) total += Number(this.data[i].Lease);
                                    //            if (this.data[i].Expense) total += Number(this.data[i].Expense);
                                    //            if (this.data[i].Capital) total += Number(this.data[i].Capital);
                                    //            this.data[i].Total = total;
                                    //            grandTotal += Number(total);
                                    //        }
                                    //        thiz.options.jsonData["bwInvoiceGrid"].value = this.data; // Store in the widget.
                                    //        $('#' + requestDialogParentId + '_Content').find('#grandTotal_large')[0].value = formatCurrencyNoDecimal(grandTotal); // Update the grand total in the large window.
                                    $(thiz.element).closest('#budgetrequestform').find("#jsGridCosts_small").jsGrid("option", "data", thiz.options.jsonData["bwInvoiceGrid"].value); // Update the smaller grid.
                                    //        $(thiz.element).closest('#budgetrequestform').find("#grandTotal_small")[0].value = formatCurrencyNoDecimal(grandTotal); // Update the smaller grid grand total.

                                } catch (e) {
                                    console.log('Exception in bwInvoiceGrid.onItemInserted: ' + e.message + ', ' + e.stack);
                                    $('#spanBwCostsGrid_Error')[0].innerHTML = 'Exception in bwInvoiceGrid.onItemInserted: ' + e.message + ', ' + e.stack;
                                }
                            },
                            onItemUpdated: function () { // jsGridCosts_large
                                try {

                                    console.log('xcx3334331 In onItemUpdated(). this.data: ' + JSON.stringify(this.data));

                                    //console.log('In bwInvoiceGrid.onItemInserted().');
                                    //        var grandTotal = Number(0);
                                    //        for (var i = 0; i < this.data.length; i++) { // Iterate through the rows and calculate the totals and grand total.
                                    //            var total = Number(0);
                                    //            if (this.data[i].Lease) total += Number(this.data[i].Lease);
                                    //            if (this.data[i].Expense) total += Number(this.data[i].Expense);
                                    //            if (this.data[i].Capital) total += Number(this.data[i].Capital);
                                    //            this.data[i].Total = total;
                                    //            grandTotal += Number(total);
                                    //        }
                                    //        thiz.options.jsonData["bwInvoiceGrid"].value = this.data; // Store in the widget.
                                    //        $('#' + requestDialogParentId + '_Content').find('#grandTotal_large')[0].value = formatCurrencyNoDecimal(grandTotal); // Update the grand total in the large window.
                                    $(thiz.element).closest('#budgetrequestform').find("#jsGridCosts_small").jsGrid("option", "data", thiz.options.jsonData["bwInvoiceGrid"].value); // Update the smaller grid.
                                    //        $(thiz.element).closest('#budgetrequestform').find("#grandTotal_small")[0].value = formatCurrencyNoDecimal(grandTotal); // Update the smaller grid grand total.

                                } catch (e) {
                                    console.log('Exception in bwInvoiceGrid.onItemInserted: ' + e.message + ', ' + e.stack);
                                    $('#spanBwCostsGrid_Error')[0].innerHTML = 'Exception in bwInvoiceGrid.onItemUpdated: ' + e.message + ', ' + e.stack;
                                }
                            },
                            onItemDeleted: function () { // jsGridCosts_large
                                try {

                                    alert('xcx3334331 In onItemDeleted(). this.data: ' + JSON.stringify(this.data));

                                    //console.log('In bwInvoiceGrid.onItemInserted().');
                                    //        var grandTotal = Number(0);
                                    //        for (var i = 0; i < this.data.length; i++) { // Iterate through the rows and calculate the totals and grand total.
                                    //            var total = Number(0);
                                    //            if (this.data[i].Lease) total += Number(this.data[i].Lease);
                                    //            if (this.data[i].Expense) total += Number(this.data[i].Expense);
                                    //            if (this.data[i].Capital) total += Number(this.data[i].Capital);
                                    //            this.data[i].Total = total;
                                    //            grandTotal += Number(total);
                                    //        }
                                    //        thiz.options.jsonData["bwInvoiceGrid"].value = this.data; // Store in the widget.
                                    //        $('#' + requestDialogParentId + '_Content').find('#grandTotal_large')[0].value = formatCurrencyNoDecimal(grandTotal); // Update the grand total in the large window.
                                    $(thiz.element).closest('#budgetrequestform').find("#jsGridCosts_small").jsGrid("option", "data", thiz.options.jsonData["bwInvoiceGrid"].value); // Update the smaller grid.
                                    //        $(thiz.element).closest('#budgetrequestform').find("#grandTotal_small")[0].value = formatCurrencyNoDecimal(grandTotal); // Update the smaller grid grand total.

                                } catch (e) {
                                    console.log('Exception in bwInvoiceGrid.onItemInserted: ' + e.message + ', ' + e.stack);
                                    $('#spanBwCostsGrid_Error')[0].innerHTML = 'Exception in bwInvoiceGrid.onItemDeleted: ' + e.message + ', ' + e.stack;
                                }
                            },
                            fields: [
                                {
                                    name: "Description", type: "text", width: 150, validate: "required", editing: true
                                },
                                {
                                    name: "Amount", type: "money", step: "0.01", width: 50, editing: true,
                                    itemTemplate: function (value) {
                                        if (value) {
                                            //return formatCurrencyNoDecimalNoDollarSign(value);
                                            return formatCurrency(value);
                                        } else {
                                            return '';
                                        }
                                    },
                                },
                                {
                                    name: "Tax", type: "money", step: "0.01", width: 50, editing: true,
                                    itemTemplate: function (value) {
                                        if (value) {
                                            return formatCurrency(value);
                                        } else {
                                            return '';
                                        }
                                    },
                                },
                                {
                                    name: "Total", type: "money", step: "0.01", width: 50, editing: false,
                                    itemTemplate: function (value) {
                                        if (value) {
                                            return formatCurrency(value);
                                        } else {
                                            return '';
                                        }
                                    },
                                },
                                { type: "control" }
                            ]
                        });

                        //{ JSGRID DOCS:
                        //    onDataLoading: function(args) {},    // before controller.loadData
                        //    onDataLoaded: function(args) {},     // on done of controller.loadData

                        //    onError: function(args) {},          // on fail of any controller call
                        //    onInit: function(args) {},           // after grid initialization 

                        //    onItemInserting: function(args) {},  // before controller.insertItem
                        //    onItemInserted: function(args) {},   // on done of controller.insertItem
                        //    onItemUpdating: function(args) {},   // before controller.updateItem
                        //    onItemUpdated: function(args) {},    // on done of controller.updateItem
                        //    onItemDeleting: function(args) {},   // before controller.deleteItem
                        //    onItemDeleted: function(args) {},    // on done of controller.deleteItem
                        //    onItemInvalid: function(args) {},    // after item validation, in case data is invalid

                        //    onOptionChanging: function(args) {}, // before changing the grid option
                        //    onOptionChanged: function(args) {},  // after changing the grid option

                        //    onPageChanged: function(args) {},    // after changing the current page    

                        //    onRefreshing: function(args) {},     // before grid refresh
                        //    onRefreshed: function(args) {},      // after grid refresh
                        //    }

                    } catch (e) {
                        console.log('Exception in bwInvoiceGrid.viewInLargeWindow().dialog.open(): ' + e.message + ', ' + e.stack);
                        $('#spanBwCostsGrid_Error')[0].innerHTML = 'Exception in bwInvoiceGrid.viewInLargeWindow().dialog.open(): ' + e.message + ', ' + e.stack;
                    }
                }
            });
            try {
                $('.ui-widget-overlay')[0].style.zIndex = 9;
                $('#' + requestDialogId).dialog().parents('.ui-dialog')[0].style.zIndex = 10; // THIS IS A HACK ?? IS THIS THE BEST PLACE FOR THIS ?? >>>>>>>>>>>>>>>>>>>>>>>>>>>> 2-15-2020
            } catch (e) {

            }
        } catch (e) {
            console.log('Exception in bwInvoiceGrid.viewInLargeWindow(): ' + e.message + ', ' + e.stack);
            $('#spanBwCostsGrid_Error')[0].innerHTML = 'Exception in bwInvoiceGrid.viewInLargeWindow(): ' + e.message + ', ' + e.stack;
        }
    },

    LaunchIntoSeparateWindow: function (requestDialogId, bwBudgetRequestId, bwWorkflowTaskItemId) { // See also method displayRequestFormInNewBrowserWindow().
        try {
            console.log('');
            console.log('/////////////////////////////////////');
            console.log('In bwInvoiceGrid.js.LaunchIntoSeparateWindow(). EXPERIMENTAL.');
            console.log('/////////////////////////////////////');
            console.log('');
            displayAlertDialog_Persistent('In bwInvoiceGrid.js.LaunchIntoSeparateWindow(). EXPERIMENTAL. requestDialogId: ' + requestDialogId + ', bwBudgetRequestId: ' + bwBudgetRequestId + ', bwWorkflowTaskItemId: ' + bwWorkflowTaskItemId);


            // First, we have to set this flag in the dialog so that we aren't prompted to have to save the request before it is closed. Doing it t the beginning so it has time to take effect and avoid a race condition? I am not sure yet.
            //
            // The _setOption function is called when setting the option externally, like $('#my-widget1').colorize("option", "red", 0});

            //alert('In bwInvoiceGrid.js.LaunchIntoSeparateWindow(). WE NEED TO SCRAPE THE REQUEST before displaying it in the new window. Otherwise force it to save. xcx993357.');
            //$('#' + requestDialogId).dialog('option', 'bwForceClose', true); // changed 4-3-2023



            // end

            var rect = document.getElementById(requestDialogId).getBoundingClientRect();
            var height = rect.bottom - rect.top;
            var width = rect.right - rect.left;

            // When opening a request in a new browser window, we need to use a distinct url. For example: https://budgetworkflow.com/?ActiveStateIdentifier=3e4e2de9-7d5b-476f-a34e-a4eaa0472b44&request=4691d358-c148-4df8-aa1b-70ee1bde0cc0

            var activeStateIdentifier = JSON.parse($('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier')).ActiveStateIdentifier;

            var url = this.options.operationUriPrefix + '?ActiveStateIdentifier=' + activeStateIdentifier + '&request=' + bwBudgetRequestId + '&taskid=' + bwWorkflowTaskItemId + '&openrequest=1';

            // When the window.open is called, bwAuthentication.js.checkIfAuthenticatedAndProcessQuerystringParameters() handles the loading of the request form... by calling bwRequest.js.displayRequestFormInNewBrowserWindow().
            //$('#' + requestDialogId).dialog({ bwForceClose: true }); // Doing this at the top so we avoid a race condition. Keep this here for readability.
            var windowObjectReference = window.open(url, requestDialogId, 'toolbar=no,width=' + width + ',height=' + height + ',left=500,top=200,status=no,scrollbars=no,resize=no,location=0');

            if (!windowObjectReference) {

                // The window wasn't allowed to open. This is likely caused by built-in popup blockers.
                console.log('The window wasn\'t allowed to open. This is likely caused by built-in popup blockers.');
                displayAlertDialog('The window wasn\'t allowed to open. This is likely caused by built-in popup blockers.');

            } else {

                // Store this instance of a popped-out window in bwAuthentication.options.poppedOutRequestWindows
                var poppedOutRequestWindows = $('.bwAuthentication:first').bwAuthentication('option', 'poppedOutRequestWindows');
                if (!(poppedOutRequestWindows && poppedOutRequestWindows.length)) {
                    poppedOutRequestWindows = [];
                }
                var poppedOutWindow = {
                    windowWidgetType: 'bwInvoiceGrid',
                    jsonData: this.options.jsonData,
                    bwOrgId: this.options.bwOrgId,
                    bwOrgName: this.options.bwOrgName,
                    bwRequestTitle: this.options.bwRequestTitle,

                    originWidgetObjectReference: this.element,
                    requestDialogId: requestDialogId,
                    bwBudgetRequestId: bwBudgetRequestId,
                    bwWorkflowTaskItemId: bwWorkflowTaskItemId,
                    windowObjectReference: windowObjectReference
                }
                poppedOutRequestWindows.push(poppedOutWindow);
                $('.bwAuthentication:first').bwAuthentication({ poppedOutRequestWindows: poppedOutRequestWindows });

            }

        } catch (e) {
            console.log('Exception in bwInvoiceGrid.js.LaunchIntoSeparateWindow(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwInvoiceGrid.js.LaunchIntoSeparateWindow(): ' + e.message + ', ' + e.stack);
        }
    },
    LaunchIntoHomeWindow: function (bwBudgetRequestId) {
        try {
            console.log('In bwInvoiceGrid.js.LaunchIntoHomeWindow(). bwBudgetRequestId: ' + bwBudgetRequestId);
            //alert('In bwInvoiceGrid.js.LaunchIntoHomeWindow(). bwBudgetRequestId: ' + bwBudgetRequestId);
            var thiz = this;



            var msg = 'In bwInvoiceGrid.js.LaunchIntoHomeWindow(). EXPERIMENTAL. THERE IS SOME WORK TO DO HERE: 1. Check if the request is open, or any dialogs related to it. 2. If not, check if these values need to be saved independantly to the database. Has anything changed? Can we save it Ok?';
            alert(msg);







            //// Scrape the JSON from the popped-out request form.
            //console.log('Calling bwRequest.js.scrapeBwRequestJson(). xcx1231242-4');
            //var promise = $('.bwRequest').bwRequest('scrapeBwRequestJson', bwBudgetRequestId);
            //promise.then(function (bwRequestJson) {
            //    try {

            //        console.log('Returning from scrapeBwRequestJson(). xcx2131241-4');
            //        //thiz.populateNewRequestForm('divPageContent1', bwRequestTypeId, JSON.stringify(bwRequestJson));



            //        var bwWorkflowTaskItemId;
            //        try {
            //            bwWorkflowTaskItemId = $('.bwAuthentication').bwAuthentication('getUrlParams')['taskid'].toString().split('#')[0]; // getUrlParams()['taskid'].toString().split('#')[0];
            //        } catch (e) {
            //            console.log('Caught exception in bwInvoiceGrid.js.LaunchIntoHomeWindow(): Cannot set bwWorkflowTaskItemId, url param [taskid] is not present.');
            //        }

            //        console.log('In bwInvoiceGrid.js.LaunchIntoHomeWindow(). Calling displayArInDialog from a popped-out window.... bwBudgetRequestId: ' + bwBudgetRequestId + ', bwWorkflowTaskItemId: ' + bwWorkflowTaskItemId + ', bwRequestJson: ' + JSON.stringify(bwRequestJson));





            //        // 1-15-2023
            //        // Since we are returning this popped-out window to the home browser window, we need to remove it from this list.
            //        var poppedOutRequestWindows = window.opener.$('.bwAuthentication:first').bwAuthentication('option', 'poppedOutRequestWindows');

            //        var alreadyDisplayingTheRequest = false;
            //        if (poppedOutRequestWindows && poppedOutRequestWindows.length && (poppedOutRequestWindows.length > 0)) {
            //            for (var i = 0; i < poppedOutRequestWindows.length; i++) {
            //                if (poppedOutRequestWindows[i].bwBudgetRequestId == bwBudgetRequestId) {
            //                    alreadyDisplayingTheRequest = true;
            //                    poppedOutRequestWindows.splice(i, 1); // This removes it from the list. It needs to be removed from the list for it to be displayed, because we never display the same request twice!!!! :)
            //                    $('.bwAuthentication:first').bwAuthentication({ poppedOutRequestWindows: poppedOutRequestWindows });
            //                    break;
            //                }
            //            }
            //        }

            //        if (alreadyDisplayingTheRequest != true) {

            //            var msg = 'Unrecoverable error in bwInvoiceGrid.js.LaunchIntoHomeWindow(). The request window did not exist in the poppedOutRequestWindows array. bwBudgetRequestId: ' + bwBudgetRequestId;
            //            console.log(msg);
            //            displayAlertDialog(msg);

            //        } else {

            //            // This closes the exploded window, and re-displays it within the website main browser window.
            //            window.opener.$('.bwRequest').bwRequest('displayArInDialog', 'https://budgetworkflow.com', bwBudgetRequestId, '', '', '', '', bwWorkflowTaskItemId, bwRequestJson); // bwWorkflowTaskItemId
            //            window.close(); // close the popup window.

            //        }

            //    } catch (e) {
            //        console.log('Exception in bwInvoiceGrid.js.LaunchIntoHomeWindow.scrapeBwRequestJson(): ' + e.message + ', ' + e.stack);
            //        displayAlertDialog('Exception in bwInvoiceGrid.js.LaunchIntoHomeWindow.scrapeBwRequestJson(): ' + e.message + ', ' + e.stack);
            //    }
            //})
            //    .catch(function (result) {

            //        alert('In LaunchIntoHomeWindow(). Promise returned exception: ' + result.message);

            //    });

        } catch (e) {
            console.log('Exception in bwInvoiceGrid.js.LaunchIntoHomeWindow(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwInvoiceGrid.js.LaunchIntoHomeWindow(): ' + e.message + ', ' + e.stack);
        }
    }

});