$.widget("bw.bwAdvancedProductSearch", {
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
       This is the bwAdvancedProductSearch.js jQuery Widget. 
       ===========================================================

          [more to follow] 
                          
       ===========================================================
       ===========================================================
       MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

          [put your stuff here]

       ===========================================================
       
      */

        bwBudgetRequestId: null, // This is set in displayProductAdvancedSearchModalDialog() and re-used throughout.
        DisplayConfigurationInventory: false, // This lets us know in the _create function whether this is in a dialog or on the Configuration > Inventory screen.

        SearchingForModule: null, // 'Distributor', 'OTO' or 'EndUser'. This is used throughout to determine the web services to call.

        latestSelectedProductSegment: null, // This keeps track of which selection the user has made so we can refresh the screen in the same place they left it.
        latestSelectedProductSubClass: null, // This keeps track of which selection the user has made so we can refresh the screen in the same place they left it.

        operationUriPrefix: null,

        BWCustomer: null, // Defined as:
        //string CustomerIdentifier 
        //string Description 
        //int Level 
        //string LevelDescription 
        //string City 
        //string State 
        //string CurrencyCode 
        //string CompanyNumber 
        //string SellingChannel 
        //string ERP 

        ERP: null, // This is the source ERP system, which will be x or x.

        Bundles: null, // This is where we store the bundles, so that we can highlight them in the bundle column.

        json: null, // This is where the data is stored.


        SegmentsAndSubclasses: null,



        filters: null, // When we regenerate the result set, we have the filters readily available.
        productSegments: null, // An array containing the product segments.
        productSubClasses: null, // An array containing the product subclasses for the currently elected product segment.
        searchBoxEvent_keyup: null // Need a global reference to this because to removeeventlistener, a reference to the function is always required.
 
    },
    _create: function () {
        try {
            console.log('In bwAdvancedProductSearch._create().');
            this.element.addClass("bwAdvancedProductSearch");
            var thiz = this;

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            selfDiscoverOperationUri(thiz); // This sets this.options.operationUriPrefix correctly.

            var html = '';

            var erp = this.options.ERP.toUpperCase();
            var searchingForModule = this.options.SearchingForModule.toUpperCase();
            if (!(searchingForModule && (searchingForModule == 'DISTRIBUTOR' || searchingForModule == 'OTO' || searchingForModule == 'ENDUSER'))) {
                alert('Error: Unexpected value for SearchingForModule of "' + searchingForModule + '".');
            } else if (!(erp && (erp == 'BW1' || erp == 'BW2'))) {
                alert('Error: Unexpected value for ERP of "' + erp + '".');
            } else {

                //html += '<style>';
                //html += '.dataGridTable { border: 1px solid gainsboro; font-size:14px; font-family: "Helvetica Neue","Segoe UI",Helvetica,Verdana,sans-serif; }';
                //html += '.dataGridTable td { border-left: 0px; border-right: 1px solid gainsboro; }';
                //html += '.headerRow { background-color:white; color:gray;border-bottom:1px solid gainsboro; }';
                //html += '.headerRow td { border-bottom:1px solid gainsboro; padding-top:3px;padding-bottom:5px;padding-right:10px;padding-left:10px; }';
                //html += '.filterRow td { border-bottom:1px solid whitesmoke; padding-top:3px;padding-bottom:5px;padding-right:10px;padding-left:10px; }';
                //html += '.alternatingRowLight { background-color:white; }';
                //html += '.alternatingRowLight:hover { background-color:lightgoldenrodyellow; }';
                //html += '.alternatingRowDark { background-color:whitesmoke; }';
                //html += '.alternatingRowDark:hover { background-color:lightgoldenrodyellow; }';
                //html += '</style>';

                //html += '<style>';
                //html += '     .nonSelectableText {';
                //html += '        -webkit - touch - callout: none !important; /* iOS Safari */';
                //html += '        -webkit-user-select: none !important; /* Chrome/Safari/Opera */';
                //html += '        -khtml-user-select: none !important; /* Konqueror */';
                //html += '        -moz-user-select: none !important; /* Firefox */';
                //html += '        -ms-user-select: none !important; /* Internet Explorer/Edge */';
                //html += '        user-select: none !important; /* Non-prefixed version, currently not supported by any browser */';
                //html += '    }';
                //html += '</style>';
                //html += '    <div id="bwProductCatalog1" style="display:none;">';
                //html += '        <div id="divBwAdvancedProductSearch1"></div>';
                //html += '    </div>';
                //html += '&nbsp;&nbsp;';

                //alert('Adding divAddInventoryItemDialog xcx231234');

                //// The new inventory item dialog
                //html += '<div style="display:none;" id="divAddInventoryItemDialog">'; //  overflow-x: hidden; 
                //html += '            <table style="">';
                //html += '                <tr>';
                //html += '                    <td style="">';
                //html += '                        <span id="divAddInventoryItemDialogContent">[divAddInventoryItemDialogContent]</span>';
                //html += '                    </td>';
                //html += '                </tr>';
                //html += '            </table>';
                //html += '            <br /><br />';
                //html += '        </div>';


                //html += '<div style="display:none;" id="divConfirmFileUploadDialog_ForInventoryItemImage">';
                //html += '            <table style="width:100%;">';
                //html += '                <tr>';
                //html += '                    <td style="width:90%;">';
                //html += '                        <span id="spanConfirmFileUploadDialogTitle" style="color: #3f3f3f;font-size: 60pt;font-weight:bold;">';
                //html += '                            Select the \'Upload\' button...';
                //html += '                        </span>';
                //html += '                    </td>';
                //html += '                    <td style="width:9%;"></td>';
                //html += '                    <td style="width:1%;cursor:pointer;vertical-align:top;">';
                //html += '                        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 120pt;font-weight:bold;" onclick="$(\'#divConfirmFileUploadDialog_ForInventoryItemImage\').dialog(\'close\');">X</span>';
                //html += '                    </td>';
                //html += '                </tr>';
                //html += '            </table>';
                //html += '            <br /><br />';
                //html += '            <span style="font-style:italic;color:gray;font-size:15pt;">The image will look the best if it is a 400 pixel (or greater) square.</span>';
                //html += '            <br /><br />';

                //html += '            <img id="ConfirmFileUploadDialog_ForInventoryItemImage_ImagePreview" src="#" alt="your image" />';

                //html += '            <!--<div id="btnUploadTheFileNow" class="divDialogButton" title="Click here to upload the attachment.">';
                //html += '                Upload';
                //html += '            </div>';
                //html += '            <br /><br />';
                //html += '            <div id="btnCancelUploadTheFileNow" class="divDialogButton" onclick="$(\'#divConfirmFileUploadDialog\').dialog(\'close\');">';
                //html += '                Cancel';
                //html += '            </div>-->';
                //html += '        </div>';

                //html += '<div style="display:none;" id="divAddAProductSegmentDialog">';
                //html += '   <table style="width:100%;">';
                //html += '       <tr>';
                //html += '           <td style="width:90%;">';
                //html += '               <span id="divAddAProductSegmentDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;font-weight:bold;">Add a new Segment</span>';
                //html += '           </td>';
                //html += '           <td style="width:9%;"></td>';
                //html += '           <td style="width:1%;cursor:pointer;vertical-align:top;">';
                //html += '               <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 30pt;font-weight:bold;" onclick="$(\'#divAddAProductSegmentDialog\').dialog(\'close\');">X</span>';
                //html += '           </td>';
                //html += '       </tr>';
                //html += '   </table>';
                //html += '   <br /><br />';
                //html += '   <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
                //html += '   <span id="spanAddAnOrgItemDialogInvitationDescriptionText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 20pt;"></span>';
                //html += '   <span style="font-family: calibri;">Name</span>';
                //html += '   <br />';
                //html += '   <input type="text" id="textDivAddAProductSegmentDialog_SegmentName" style="WIDTH: 95%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" />';
                //html += '   <br /><br /><br />';
                //html += '   <div id="divAddAnOrgItemDialogSubmitButton" onclick="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'addTheSegment\');" class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;">';
                //html += '       Add the Segment';
                //html += '   </div>';
                //html += '   <br /><br />';
                //html += '   <div class="divSignInButton" style="width: 90%; text-align: center; line-height: 1.1em; font-weight: bold;" onclick="$(\'#divAddAProductSegmentDialog\').dialog(\'close\');">';
                //html += '       Close';
                //html += '   </div>';
                //html += '   <br /><br />';
                //html += '</div>';

                //html += '<div style="display:none;" id="divAddAProductSubclassDialog">';
                //html += '   <table style="width:100%;">';
                //html += '       <tr>';
                //html += '           <td style="width:90%;">';
                //html += '               <span id="divAddAProductSegmentDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;font-weight:bold;">Add a new Subclass</span>';
                //html += '           </td>';
                //html += '           <td style="width:9%;"></td>';
                //html += '           <td style="width:1%;cursor:pointer;vertical-align:top;">';
                //html += '               <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 30pt;font-weight:bold;" onclick="$(\'#divAddAProductSubclassDialog\').dialog(\'close\');">X</span>';
                //html += '           </td>';
                //html += '       </tr>';
                //html += '   </table>';
                //html += '   <br /><br />';
                //html += '   <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
                //html += '   <span id="spanAddAnOrgItemDialogInvitationDescriptionText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 20pt;"></span>';
                //html += '   <span style="font-family: calibri;">Name</span>';
                //html += '   <br />';
                //html += '   <input type="text" id="textDivAddAProductSubclassDialog_SubclassName" style="WIDTH: 95%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" />';
                //html += '   <br /><br /><br />';
                //html += '   <div id="divAddAnOrgItemDialogSubmitButton" onclick="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'addTheSubclass\');" class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;">';
                //html += '       Add the Subclass';
                //html += '   </div>';
                //html += '   <br /><br />';
                //html += '   <div class="divSignInButton" style="width: 90%; text-align: center; line-height: 1.1em; font-weight: bold;" onclick="$(\'#divAddAProductSubclassDialog\').dialog(\'close\');">';
                //html += '       Close';
                //html += '   </div>';
                //html += '   <br /><br />';
                //html += '</div>';

                if (thiz.options.DisplayConfigurationInventory != true) {
                    html += '<div style="display:inline-block;">';
                    html += '    <input id="btnAdvancedProductSearch" class="button-blue nonSelectableText" style="cursor:pointer;width:100px;" onclick="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'displayProductAdvancedSearchModalDialog\', \'' + erp + '\');" value="Search" />';
                    //html += '    <div style="display:inline-block;font-size:8pt;font-weight:bold;color:yellowgreen;vertical-align:top;cursor:default;">NEW!</div>';
                    html += '</div>';
                }
            }






            this.element.html(html);


            //
            // Load from the BwInventoryItem table for this bwWorkflowAppId. Put the results in thiz.options.json.
            //
            // workflowAppId
            $.ajax({
                url: webserviceurl + "/getallinventory/" + workflowAppId,
                type: "GET",
                contentType: 'application/json',
                success: function (data) {
                    try {

                        thiz.options.json = data;

                        //displayAlertDialog('inventory: ' + JSON.stringify(data));

                        // Create our list of Segments and Subclasses, so that we can display them in the select elements below.
                        //var data = thiz.options.json;
                        thiz.options.SegmentsAndSubclasses = [];
                        for (var i = 0; i < data.length; i++) {
                            if (!data[i].Segment) {
                                data[i].Segment = 'NA';
                                data[i].Subclass = 'NA';
                            }
                            var thisSegmentExistsAlready = false;
                            for (var j = 0; j < thiz.options.SegmentsAndSubclasses.length; j++) {
                                if (data[i].Segment == thiz.options.SegmentsAndSubclasses[j].Segment) {
                                    if (data[i].Subclass == thiz.options.SegmentsAndSubclasses[j].Subclass) {
                                        thisSegmentExistsAlready = true
                                    }
                                }
                            }
                            if (thisSegmentExistsAlready == false) {
                                // We need to add it.
                                var json = {
                                    Segment: data[i].Segment,
                                    Subclass: data[i].Subclass
                                }
                                thiz.options.SegmentsAndSubclasses.push(json);
                            }
                            //}
                        }

                        if (thiz.options.DisplayConfigurationInventory == true) {
                            thiz.renderConfigurationInventoryScreen('divBwInventory'); // 4-7-2023 Not sure this is the correct element (divBwInventory) but used this one elsewhere so probably ok...
                        }


                        //displayAlertDialog('Inventory json: ' + JSON.stringify(thiz.options.json));


                    } catch (e) {
                        console.log('Exception in bwAdvancedProductSearch.js._create():2: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwAdvancedProductSearch.js._create():2: ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    console.log('Error in bwAdvancedProductSearch.js._create():xcx1: ' + errorCode + ', ' + errorMessage);
                    displayAlertDialog('Error in bwAdvancedProductSearch.js._create():xcx1: ' + errorCode + ', ' + errorMessage);
                }
            });

            console.log('In bwAdvancedProductSearch._create( { ERP: "' + erp + '" } ). The widget has been initialized.');

        } catch (e) {
            var msg = 'Exception in bwAdvancedProductSearch._create(): ' + e.message + ', ' + e.stack;
            console.log(msg);
            this.element.html(msg);
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

    displayAddASegmentDialog: function () {
        try {
            console.log('In displayAddASegmentDialog().');
            var thiz = this;

            $('#divAddAProductSegmentDialog').dialog({
                modal: true,
                resizable: false,
                closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                width: '500',
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                close: function () {
                    $('#divAddAProductSegmentDialog').dialog('destroy');
                },
                open: function () {
                    try {
                        $('.ui-widget-overlay').bind('click', function () {
                            $("#divAddAProductSegmentDialog").dialog('close');
                        });

                    } catch (e) {
                        console.log('Exception in displayAddASegmentDialog.divAddAProductSegmentDialog.open(): ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in displayAddASegmentDialog.divAddAProductSegmentDialog.open(): ' + e.message + ', ' + e.stack);
                    }
                }
            });
            //$("#divAddAnOrgItemDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
        } catch (e) {
            console.log('Exception in displayAddASegmentDialog(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in displayAddASegmentDialog(): ' + e.message + ', ' + e.stack);
        }
    },
    addTheSegment: function () {
        try {
            console.log('In addTheSegment().');

            var segmentName = $('#textDivAddAProductSegmentDialog_SegmentName').val().trim();

            var html = '';
            html += '<option value="' + segmentName + '">' + segmentName + '</option>';

            $('#selectEditInventoryItemDialog_ProductSegments').append(html); // Add the new segment to the list

            $('#selectEditInventoryItemDialog_ProductSegments').val(segmentName) // Make it the selected item. 

            $("#divAddAProductSegmentDialog").dialog('close'); // Close the dialog.

        } catch (e) {
            console.log('Exception in addTheSegment(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in addTheSegment(): ' + e.message + ', ' + e.stack);
        }
    },

    displayAddASubclassDialog: function () {
        try {
            console.log('In displayAddASubclassDialog().');
            var thiz = this;

            $('#divAddAProductSubclassDialog').dialog({
                modal: true,
                resizable: false,
                closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                width: '500',
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                close: function () {
                    $('#divAddAProductSubclassDialog').dialog('destroy');
                },
                open: function () {
                    try {
                        $('.ui-widget-overlay').bind('click', function () {
                            $("#divAddAProductSubclassDialog").dialog('close');
                        });

                    } catch (e) {
                        console.log('Exception in displayAddASubclassDialog.divAddAProductSubclassDialog.open(): ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in displayAddASubclassDialog.divAddAProductSubclassDialog.open(): ' + e.message + ', ' + e.stack);
                    }
                }
            });
            //$("#divAddAnOrgItemDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
        } catch (e) {
            console.log('Exception in displayAddASubclassDialog(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in displayAddASubclassDialog(): ' + e.message + ', ' + e.stack);
        }
    },
    addTheSubclass: function () {
        try {
            console.log('In addTheSubclass().');

            var subclassName = $('#textDivAddAProductSubclassDialog_SubclassName').val().trim();

            var html = '';
            html += '<option value="' + subclassName + '">' + subclassName + '</option>';

            $('#selectEditInventoryItemDialog_ProductSubclasses').append(html); // Add the new segment to the list

            $('#selectEditInventoryItemDialog_ProductSubclasses').val(subclassName) // Make it the selected item. 

            $("#divAddAProductSubclassDialog").dialog('close'); // Close the dialog.

        } catch (e) {
            console.log('Exception in addTheSubclass(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in addTheSubclass(): ' + e.message + ', ' + e.stack);
        }
    },

    displayAddInventoryItemDialog: function () {
        try {
            console.log('In displayAddInventoryItemDialog().');
            var thiz = this;

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            window.scrollTo(0, 0); // Scroll to top on button click. This makes sure things render Ok, and also just seems like a nicer user experience.
            $('.bwActiveMenu').bwActiveMenu('adjustLeftSideMenu'); // This makes sure our new stretchy-left-menu redraws Ok.

            $('#divAddInventoryItemDialog').dialog({
                modal: true,
                resizable: false,
                closeText: "Cancel",
                closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                width: "1000px",
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                position: {
                    my: "middle top+150", // This 115 is a rough good spot.... 3-27-2022
                    at: "middle top",
                    of: window
                },
                close: function () {
                    HideActivitySpinner();
                    $("#divAddInventoryItemDialog").dialog('destroy');
                },
                open: function () {
                    try {
                        $('.ui-widget-overlay').bind('click', function () {
                            $("#divAddInventoryItemDialog").dialog('close');
                        });
                        //HideActivitySpinner();

                        //debugger; // 1-8-2022
                        var requestDialogId = 'divAddInventoryItemDialog';

                        $('#' + requestDialogId).css('overflow', 'hidden'); // This keeps the scroll bars from showing up on the form dialog!!!!!!!! 7-13-2020

                        var element = document.getElementById(requestDialogId).parentNode; // This is the best way to get a handle on the jquery dialog.
                        var requestDialogParentId = requestDialogId + '_Parent'; // We need to have an id value so we can refer to this. It doesn't have one unless we add it here.
                        element.id = requestDialogParentId; // We need to have an id value so we can refer to this. It doesn't have one unless we add it here.

                        // This creates the custom header/draggable bar on the dialog!!! 4-2-2020. // ☈ ☇ https://www.toptal.com/designers/htmlarrows/symbols/thunderstorm/
                        var html = '';

                        html += '<table style="width:100%;cursor:pointer;" onclick="$(\'.bwRequest\').bwRequest(\'pinRequestDialog\');" ondblclick="$(\'.bwRequest\').bwRequest(\'zoomAndCenter\', \'' + requestDialogId + '\');">'; // This click event is like "pin". Once the user clicks the header of the request dialog, it no longer is modal and persists on the screen until they choose to close it.
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
                        try {
                            document.getElementById(requestDialogId).parentNode.querySelector(".ui-dialog-titlebar").innerHTML = html;
                        } catch (e) {

                        }

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
                        console.log('Exception in bwAdvancedProductSearch.js.displayAddInventoryItemDialog.dialog.open(participant): ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwAdvancedProductSearch.js.displayAddInventoryItemDialog.dialog.open(participant): ' + e.message + ', ' + e.stack);
                    }
                }
            });
            //$("#divUploadANewSmallCircleImageDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

            var html = '';

            html += '<div id="inventoryitemform" bwinventoryitemid="">'; // This is where we keep track of the bwInventoryItemId.
            html += '<table>';
            html += '   <tr>';
            html += '       <td style="vertical-align:top;cursor:pointer;" ondblclick="$(\'.bwRequest\').bwRequest(\'zoomAndCenter\', \'divAddInventoryItemDialog\');">'; // 3-27-2023



            html += '<span style="font-size:30pt;font-weight:bold;color:lightgray;">Inventory Item</span>';
            html += '           <br />';
            html += '           <br />';


            alert('Replace image here xcx123123412-1');

            html += '           <img id="divUploadANewSmallCircleImageDialogContentImage" style="width:400px;float:left;padding-right:20px;" src="https://budgetworkflow.com/images/inventory_400w.png">';

            html += '       </td>';

            html += '       <td style="vertical-align:top;">';
            html += '           <br />';

            //Title: String,
            //ProductCode: String,
            //Description: String,
            //ExtendedDescription: String,
            //Price: Number,
            html += '<table class="xdFormLayout xdTableStyleTwoCol" style="BORDER-TOP-STYLE: none; WORD-WRAP: break-word; BORDER-LEFT-STYLE: none; BORDER-COLLAPSE: collapse; TABLE-LAYOUT: fixed; BORDER-BOTTOM-STYLE: none; BORDER-RIGHT-STYLE: none;width:100%;">';
            html += '   <colgroup>';
            html += '       <col style="WIDTH: 195px" />';
            html += '       <col style="" />';
            html += '   </colgroup>';
            html += '<tbody valign="top">';

            html += '   <tr class="xdTableOffsetRow2">';
            html += '       <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px;BORDER-BOTTOM: #d8d8d8 1pt solid;">';
            html += '           <span class="xdlabel" style="color:gray;font-size:12pt;"><span style="color:red;">*</span>Title:</span>';
            html += '       </td>';
            html += '       <td class="xdTableOffsetCellComponent" style="text-align:left; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px">';
            html += '                           <input id="inputInventoryItem_Title" contentEditable="false" style="WIDTH: 300px;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 18pt;TEXT-ALIGN: left;" type="text" />';

            html += '       </td>';
            html += '   </tr>';

            html += '   <tr class="xdTableOffsetRow2">';
            html += '       <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px;BORDER-BOTTOM: #d8d8d8 1pt solid;">';
            html += '           <span class="xdlabel" style="color:gray;font-size:12pt;"><span style="color:red;">*</span>Description:</span>';
            html += '       </td>';
            html += '       <td class="xdTableOffsetCellComponent" style="text-align:left; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px">';
            html += '                           <input id="inputInventoryItem_Description" contentEditable="false" style="WIDTH: 300px;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 18pt;TEXT-ALIGN: left;" type="text" />';

            html += '       </td>';
            html += '   </tr>';

            html += '   <tr class="xdTableOffsetRow2">';
            html += '       <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px;BORDER-BOTTOM: #d8d8d8 1pt solid;">';
            html += '           <span class="xdlabel" style="color:gray;font-size:12pt;"><span style="color:red;">*</span>Price:</span>';
            html += '       </td>';
            html += '       <td class="xdTableOffsetCellComponent" style="text-align:left; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px">';
            html += '                           <input id="inputInventoryItem_Price" contentEditable="false" style="WIDTH: 300px;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 18pt;TEXT-ALIGN: right;" type="text" />';

            html += '       </td>';
            html += '   </tr>';



            html += '   <tr class="xdTableOffsetRow2">';
            html += '       <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px;BORDER-BOTTOM: #d8d8d8 1pt solid;">';
            html += '           <span class="xdlabel" style="color:gray;font-size:12pt;">Product Code:</span>';
            html += '       </td>';
            html += '       <td class="xdTableOffsetCellComponent" style="text-align:left; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px">';
            html += '                           <input id="inputInventoryItem_ProductCode" contentEditable="false" style="WIDTH: 300px;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 18pt;TEXT-ALIGN: left;" type="text" />';

            html += '       </td>';
            html += '   </tr>';

            html += '   <tr class="xdTableOffsetRow2">';
            html += '       <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px;BORDER-BOTTOM: #d8d8d8 1pt solid;">';
            html += '           <span class="xdlabel" style="color:gray;font-size:12pt;">Extended Description:</span>';
            html += '       </td>';
            html += '       <td class="xdTableOffsetCellComponent" style="text-align:left; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px">';
            html += '                           <input id="inputInventoryItem_ExtendedDescription" contentEditable="false" style="WIDTH: 300px;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 18pt;TEXT-ALIGN: left;" type="text" />';
            html += '       </td>';
            html += '   </tr>';

            html += '</tbody>';
            html += '</table>';























            html += '           <br />';
            html += '           <br />';
            //html += '<br />';
            //html += '<div class="divSignInButton" style="height:55px;text-align:center;background-color:#f6f6f6;padding-left:0;">';
            html += '           <div style="height:55px;text-align:center;padding-left:0;">';
            html += '               <label class="divSignInButton" style="font-style:normal;width:365px;height:100%;text-align:center;line-height:1.65em;font-size:23pt;border-radius: 5px 5px 5px 5px;display:inline-block;padding-left:0;padding-top:0;" for="inputFile_ForInventoryItemImage">';
            html += '               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Choose file...&nbsp;📁&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
            html == '               </label>          ';

            //html += '  <input class="upload" id="inputFile_ForInventoryItemImage" style="visibility:hidden;display:none;" onchange="$(\'.bwCoreComponent\').bwCoreComponent(\'uploadAttachment_IdentifyingImage\',\'xcxnewrequestattachments\');" type="file">'; 
            html += '               <input class="upload" id="inputFile_ForInventoryItemImage" style="visibility:hidden;display:none;" onfocus="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'uploadAttachment_InventoryItemImage_Focus\');" onblur="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'uploadAttachment_InventoryItemImage_Blur\');" onchange="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'uploadAttachment_InventoryItemImage\', \'xcxnewrequestattachments\', \'' + 'identityType' + '\', \'' + 'parm1' + '\', \'' + 'parm2' + '\', \'' + 'parm3' + '\');" type="file">';

            html += '           </div>';

            html += '       </td>';
            html += '   </tr>';

            html += '   <tr>';
            html += '       <td></td>';
            html += '       <td>';
            html += '           <div class="divSignInButton" xcx="xcx23513-1" style="width:90%;text-align:center;line-height:0.8em;font-weight:bold;" onclick="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'saveInventoryItem\');">'; // bwInventoryItemId
            html += '           Save';
            html += '           </div>';

            html += '           <br />';
            //html += '<br />';

            html += '           <div class="divSignInButton" style="width:90%;text-align:center;line-height:0.8em;font-weight:bold;" onclick="$(\'#divAddInventoryItemDialog\').dialog(\'close\');">';
            html += '           Close';
            html += '           </div>';
            html += '       </td>';
            html += '   </tr>';
            html += '</table>';
            html += '</div>';


            document.getElementById('divAddInventoryItemDialogContent').innerHTML = html;



            var bwInventoryItemId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
            $('#divAddInventoryItemDialog').find('#inventoryitemform')[0].setAttribute('bwinventoryitemid', bwInventoryItemId);




            alert('xcx21312442-1 Loading userimage here, not sure why.......');

            //
            // This is where it will get displayed:
            // <img id="divUploadANewSmallCircleImageDialogContentImage" style="width:200px;height:200px;float:left;padding-right:20px;" src="https://budgetworkflow.com/images/corporeal.png"

            //var imagePath = this.options.operationUriPrefix + '_files/' + workflowAppId + '/participantimages/' + 'bwParticipantId' + '/' + 'userimage.png';



            var preventCachingGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
            
            var imagePath;

            var activeStateIdentifier = JSON.parse($('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier'));

            if (activeStateIdentifier.status != 'SUCCESS') {

                imagePath = '[No image. Unauthorized. xcx213124-34556-555-556]';

            } else {

                imagePath = this.options.operationUriPrefix + '_files/' + workflowAppId + '/participantimages/' + 'bwParticipantId' + '/' + 'userimage.png?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier;

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

        } catch (e) {
            console.log('Exception in bwAdvancedProductSearch.js.displayAddInventoryItemDialog(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwAdvancedProductSearch.js.displayAddInventoryItemDialog(): ' + e.message + ', ' + e.stack);
        }
    },

    displayEditInventoryItemDialog: function (productId) {
        try {
            console.log('In displayEditInventoryItemDialog().');
            //alert('In displayEditInventoryItemDialog(). productId: ' + productId);
            var thiz = this;

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            window.scrollTo(0, 0); // Scroll to top on button click. This makes sure things render Ok, and also just seems like a nicer user experience.
            $('.bwActiveMenu').bwActiveMenu('adjustLeftSideMenu'); // This makes sure our new stretchy-left-menu redraws Ok.

            $('#divAddInventoryItemDialog').dialog({
                modal: true,
                resizable: false,
                closeText: "Cancel",
                closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                width: "1000px",
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                position: {
                    my: "middle top+150", // This 115 is a rough good spot.... 3-27-2022
                    at: "middle top",
                    of: window
                },
                close: function () {
                    HideActivitySpinner();
                    $("#divAddInventoryItemDialog").dialog('destroy');
                },
                open: function () {
                    try {
                        $('.ui-widget-overlay').bind('click', function () {
                            $("#divAddInventoryItemDialog").dialog('close');
                        });
                        //HideActivitySpinner();

                        //debugger; // 1-8-2022
                        var requestDialogId = 'divAddInventoryItemDialog';

                        $('#' + requestDialogId).css('overflow', 'hidden'); // This keeps the scroll bars from showing up on the form dialog!!!!!!!! 7-13-2020

                        var element = document.getElementById(requestDialogId).parentNode; // This is the best way to get a handle on the jquery dialog.
                        var requestDialogParentId = requestDialogId + '_Parent'; // We need to have an id value so we can refer to this. It doesn't have one unless we add it here.
                        element.id = requestDialogParentId; // We need to have an id value so we can refer to this. It doesn't have one unless we add it here.

                        // This creates the custom header/draggable bar on the dialog!!! 4-2-2020. // ☈ ☇ https://www.toptal.com/designers/htmlarrows/symbols/thunderstorm/
                        var html = '';

                        html += '<table style="width:100%;cursor:pointer;" onclick="$(\'.bwRequest\').bwRequest(\'pinRequestDialog\');" ondblclick="$(\'.bwRequest\').bwRequest(\'zoomAndCenter\', \'' + requestDialogId + '\');">'; // This click event is like "pin". Once the user clicks the header of the request dialog, it no longer is modal and persists on the screen until they choose to close it.
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
                }
            });
            //$("#divUploadANewSmallCircleImageDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

            var html = '';

            html += '<div id="inventoryitemform" bwinventoryitemid="">'; // This is where we keep track of the bwInventoryItemId.
            html += '<table>';
            html += '   <tr>';
            html += '       <td style="vertical-align:top;cursor:pointer;" ondblclick="$(\'.bwRequest\').bwRequest(\'zoomAndCenter\', \'divAddInventoryItemDialog\');">'; // 3-27-2023



            html += '<span style="font-size:30pt;font-weight:bold;color:lightgray;">Inventory Item</span>';
            html += '           <br />';
            html += '           <br />';


            //alert('Replace image here xcx123123412-2');

            //html += '           <img id="divUploadANewSmallCircleImageDialogContentImage" style="width:400px;float:left;padding-right:20px;" src="https://budgetworkflow.com/images/inventory_400w.png">';
            html += '           <img id="divUploadANewSmallCircleImageDialogContentImage" style="width:400px;float:left;padding-right:20px;" src="' + this.options.operationUriPrefix + 'images/noimageavailable.png">';

            html += '       </td>';

            html += '       <td style="vertical-align:top;">';
            html += '           <br />';

            //Title: String,
            //ProductCode: String,
            //Description: String,
            //ExtendedDescription: String,
            //Price: Number,
            html += '<table class="xdFormLayout xdTableStyleTwoCol" style="BORDER-TOP-STYLE: none; WORD-WRAP: break-word; BORDER-LEFT-STYLE: none; BORDER-COLLAPSE: collapse; TABLE-LAYOUT: fixed; BORDER-BOTTOM-STYLE: none; BORDER-RIGHT-STYLE: none;width:100%;">';
            html += '   <colgroup>';
            html += '       <col style="WIDTH: 195px" />';
            html += '       <col style="" />';
            html += '   </colgroup>';
            html += '<tbody valign="top">';

            html += '   <tr class="xdTableOffsetRow2">';
            html += '       <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px;BORDER-BOTTOM: #d8d8d8 1pt solid;">';
            html += '           <span class="xdlabel" style="color:gray;font-size:12pt;"><span style="color:red;">*</span>Title:</span>';
            html += '       </td>';
            html += '       <td class="xdTableOffsetCellComponent" style="text-align:left; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px">';
            html += '                           <input id="inputInventoryItem_Title" contentEditable="false" style="WIDTH: 300px;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 18pt;TEXT-ALIGN: left;" type="text" />';

            html += '       </td>';
            html += '   </tr>';

            html += '   <tr class="xdTableOffsetRow2">';
            html += '       <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px;BORDER-BOTTOM: #d8d8d8 1pt solid;">';
            html += '           <span class="xdlabel" style="color:gray;font-size:12pt;"><span style="color:red;">*</span>Description:</span>';
            html += '       </td>';
            html += '       <td class="xdTableOffsetCellComponent" style="text-align:left; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px">';
            html += '                           <input id="inputInventoryItem_Description" contentEditable="false" style="WIDTH: 300px;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 18pt;TEXT-ALIGN: left;" type="text" />';

            html += '       </td>';
            html += '   </tr>';

            html += '   <tr class="xdTableOffsetRow2">';
            html += '       <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px;BORDER-BOTTOM: #d8d8d8 1pt solid;">';
            html += '           <span class="xdlabel" style="color:gray;font-size:12pt;"><span style="color:red;">*</span>Price:</span>';
            html += '       </td>';
            html += '       <td class="xdTableOffsetCellComponent" style="text-align:left; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px">';
            html += '                           <input id="inputInventoryItem_Price" contentEditable="false" style="WIDTH: 300px;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 18pt;TEXT-ALIGN: right;" type="text" />';

            html += '       </td>';
            html += '   </tr>';



            html += '   <tr class="xdTableOffsetRow2">';
            html += '       <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px;BORDER-BOTTOM: #d8d8d8 1pt solid;">';
            html += '           <span class="xdlabel" style="color:gray;font-size:12pt;">Product Code:</span>';
            html += '       </td>';
            html += '       <td class="xdTableOffsetCellComponent" style="text-align:left; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px">';
            html += '                           <input id="inputInventoryItem_ProductCode" contentEditable="false" style="WIDTH: 300px;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 18pt;TEXT-ALIGN: left;" type="text" />';

            html += '       </td>';
            html += '   </tr>';

            html += '   <tr class="xdTableOffsetRow2">';
            html += '       <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px;BORDER-BOTTOM: #d8d8d8 1pt solid;">';
            html += '           <span class="xdlabel" style="color:gray;font-size:12pt;">Extended Description:</span>';
            html += '       </td>';
            html += '       <td class="xdTableOffsetCellComponent" style="text-align:left; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px">';
            html += '                           <input id="inputInventoryItem_ExtendedDescription" contentEditable="false" style="WIDTH: 300px;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 18pt;TEXT-ALIGN: left;" type="text" />';
            html += '       </td>';
            html += '   </tr>';



            //displayAlertDialog('SegmentsAndSubclasses: ' + JSON.stringify(this.options.SegmentsAndSubclasses));


            // 3-31-2022 Adding drop downs for product segment and subclass.
            html += '   <tr class="xdTableOffsetRow2">';
            html += '       <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px;BORDER-BOTTOM: #d8d8d8 1pt solid;">';
            html += '           <span class="xdlabel" style="color:gray;font-size:12pt;">Category:</span>';
            html += '       </td>';
            html += '       <td class="xdTableOffsetCellComponent" style="text-align:left; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px">';
            html += '           <select id="selectEditInventoryItemDialog_ProductSegments" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 18pt;TEXT-ALIGN: left;">';
            html += '               <option value=""></option>'; // We need this empty entry to reflect if the product doesn't have a Segment specified yet.
            for (var i = 0; i < this.options.SegmentsAndSubclasses.length; i++) {
                html += '<option value="' + this.options.SegmentsAndSubclasses[i].Segment + '">' + this.options.SegmentsAndSubclasses[i].Segment + '</option>';
            }
            html += '           </select>';
            html += '           &nbsp;';
            html += '           <input type="button" value="Add Category" onclick="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'displayAddASegmentDialog\');" />';
            html += '       </td>';
            html += '   </tr>';

            html += '   <tr class="xdTableOffsetRow2">';
            html += '       <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px;BORDER-BOTTOM: #d8d8d8 1pt solid;">';
            html += '           <span class="xdlabel" style="color:gray;font-size:12pt;">Subcategory:</span>';
            html += '       </td>';
            html += '       <td class="xdTableOffsetCellComponent" style="text-align:left; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px">';
            html += '           <select id="selectEditInventoryItemDialog_ProductSubclasses" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 18pt;TEXT-ALIGN: left;">';
            html += '               <option value=""></option>'; // We need this empty entry to reflect if the product doesn't have a Subclass specified yet.
            for (var i = 0; i < this.options.SegmentsAndSubclasses.length; i++) {
                html += '<option value="' + this.options.SegmentsAndSubclasses[i].Subclass + '">' + this.options.SegmentsAndSubclasses[i].Subclass + '</option>';
            }
            html += '           </select>';
            html += '           &nbsp;<input type="button" value="Add Subcategory" onclick="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'displayAddASubclassDialog\');" />';
            html += '       </td>';
            html += '   </tr>';


            html += '</tbody>';
            html += '</table>';
            

            html += '           <br />';
            html += '           <br />';
            //html += '<br />';
            //html += '<div class="divSignInButton" style="height:55px;text-align:center;background-color:#f6f6f6;padding-left:0;">';
            html += '           <div style="height:55px;text-align:center;padding-left:0;">';
            html += '               <label class="divSignInButton" style="font-style:normal;width:365px;height:100%;text-align:center;line-height:1.65em;font-size:23pt;border-radius: 5px 5px 5px 5px;display:inline-block;padding-left:0;padding-top:0;" for="inputFile_ForInventoryItemImage">';
            html += '               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Choose file...&nbsp;📁&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
            html == '               </label>          ';

            //html += '  <input class="upload" id="inputFile_ForInventoryItemImage" style="visibility:hidden;display:none;" onchange="$(\'.bwCoreComponent\').bwCoreComponent(\'uploadAttachment_IdentifyingImage\',\'xcxnewrequestattachments\');" type="file">'; 
            html += '               <input class="upload" id="inputFile_ForInventoryItemImage" style="visibility:hidden;display:none;" onfocus="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'uploadAttachment_InventoryItemImage_Focus\');" onblur="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'uploadAttachment_InventoryItemImage_Blur\');" onchange="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'uploadAttachment_InventoryItemImage\', \'xcxnewrequestattachments\', \'' + 'identityType' + '\', \'' + 'parm1' + '\', \'' + 'parm2' + '\', \'' + 'parm3' + '\');" type="file">';

            html += '           </div>';

            html += '       </td>';
            html += '   </tr>';

            html += '   <tr>';
            html += '       <td></td>';
            html += '       <td>';
            html += '           <div class="divSignInButton" xcx="xcx23513-2" style="width:90%;text-align:center;line-height:0.8em;font-weight:bold;" onclick="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'saveInventoryItem\');">'; // bwInventoryItemId
            html += '           Save';
            html += '           </div>';

            html += '           <br />';
            //html += '<br />';

            html += '           <div class="divSignInButton" xcx="xcx23513-2" style="width:90%;text-align:center;line-height:0.8em;font-weight:bold;" onclick="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'deleteInventoryItem\');">'; // bwInventoryItemId
            html += '           Delete';
            html += '           </div>';

            html += '           <br />';

            html += '           <div class="divSignInButton" style="width:90%;text-align:center;line-height:0.8em;font-weight:bold;" onclick="$(\'#divAddInventoryItemDialog\').dialog(\'close\');">';
            html += '           Close';
            html += '           </div>';
            html += '       </td>';
            html += '   </tr>';
            html += '</table>';
            html += '</div>';

            //document.getElementById('divAddInventoryItemDialogContent').innerHTML = html; 
            document.getElementById('divAddInventoryItemDialog').innerHTML = html; 

            var data = this.options.json;

            var product;
            for (var i = 0; i < data.length; i++) {
                if (productId == data[i].bwInventoryItemId) {
                    // This is the product we have to add.
                    product = data[i];
                    //if (!sessionId) {

                    //    HideActivitySpinner();

                    //    console.log('Error in btnEdit_OnClick(). Invalid sessionId: ' + sessionId);
                    //    document.getElementById('bwAdvancedProductSearch_Error').innerHTML = 'Error in btnEdit_OnClick(). Invalid sessionId: ' + sessionId;
                    //} else {
                    //var operationUri = '/Distributor/GetPricing2?productCode=' + product.ProductId + '&sessionid=' + sessionId;
                    //debugger; // 
                    //if (!product.bwInventoryItemId) {
                    //    alert('INVALID PRODUCT ID.');
                    //} else {
                    //    // do nothing.
                    //}
                }
            }

            $('#divAddInventoryItemDialog_Parent').find('#inventoryitemform')[0].setAttribute('bwinventoryitemid', productId);

            if (product && product.Title) {
                //debugger; // 4-2-2022
                $('#inputInventoryItem_Title').val(product.Title);
                $('#inputInventoryItem_Description').val(product.Description);
                $('#inputInventoryItem_Price').val(product.Price);
                $('#inputInventoryItem_ProductCode').val(product.ProductCode);
                $('#inputInventoryItem_ExtendedDescription').val(product.ExtendedDescription);

                // The Segment and Subclass drop-downs.
                $('#selectEditInventoryItemDialog_ProductSegments').val('');
                if (product.Segment) {
                    var thisSegmentIsInTheList = false;
                    for (var i = 0; i < this.options.SegmentsAndSubclasses.length; i++) {
                        if (product.Segment == this.options.SegmentsAndSubclasses[i].Segment) {
                            thisSegmentIsInTheList = true;
                        }
                    }
                    if (thisSegmentIsInTheList == false) {
                        displayAlertDialog('Error: This product has a segment [' + product.Segment + '] which doesn\'t exist in the master list for some reason. ' + JSON.stringify(this.options.SegmentsAndSubclasses));
                    } else {
                        $('#selectEditInventoryItemDialog_ProductSegments').val(product.Segment);


                        $('#selectEditInventoryItemDialog_ProductSubclasses').val(product.Subclass);




                    }
                }
                //if (product.Subclass) { // 

                //} else {

                //}


            } else {
                alert('xcx123469 Unexpected value for product: ' + JSON.stringify(product));
            }






            //alert('xcx21312442-1 add activestateidentifier to this image path...');

            //
            // This is where it will get displayed:
            // <img id="divUploadANewSmallCircleImageDialogContentImage" style="width:200px;height:200px;float:left;padding-right:20px;" src="https://budgetworkflow.com/images/corporeal.png"
            //var imagePath = this.options.operationUriPrefix + '_files/' + workflowAppId + '/participantimages/' + 'bwParticipantId' + '/' + 'userimage.png';


            //var imagePath = thiz.options.operationUriPrefix + '_files/' + workflowAppId + '/inventoryimages/' + productId + '/inventoryimage.png?v=' + guid;

            var preventCachingGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });

            var imagePath;

            var activeStateIdentifier = JSON.parse($('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier'));

            if (activeStateIdentifier.status != 'SUCCESS') {

                imagePath = '[No image. Unauthorized. xcx213124-34556-555-556-33]';

            } else {

                imagePath = thiz.options.operationUriPrefix + '_files/' + workflowAppId + '/inventoryimages/' + productId + '/inventoryimage.png?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier;

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

        } catch (e) {
            console.log('Exception in bwAdvancedProductSearch.js.displayEditInventoryItemDialog(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwAdvancedProductSearch.js.displayEditInventoryItemDialog(): ' + e.message + ', ' + e.stack);
        }
    },

    saveInventoryItem: function () {
        try {
            console.log('In saveInventoryItem().');
            var thiz = this;

            var tenantId = $('.bwAuthentication').bwAuthentication('option', 'tenantId');
            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
            var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

            var bwInventoryItemId = $('#divAddInventoryItemDialog').find('#inventoryitemform')[0].getAttribute('bwinventoryitemid');

            var title = $('#inputInventoryItem_Title').val();
            var productCode = $('#inputInventoryItem_ProductCode').val();
            var description = $('#inputInventoryItem_Description').val();
            var extendedDescription = $('#inputInventoryItem_ExtendedDescription').val();
            var price = $('#inputInventoryItem_Price').val();
            var segment = $('#selectEditInventoryItemDialog_ProductSegments').val();
            var subclass = $('#selectEditInventoryItemDialog_ProductSubclasses').val();

            var validData = true;
            if (!(title.length > 0)) {
                displayAlertDialog('Please enter a value for "Title".');
                validData = false;
            }
            if (!(description.length > 0)) {
                displayAlertDialog('Please enter a value for "Description".');
                validData = false;
            }
            if (!(Number(price) > 0)) {
                displayAlertDialog('Please enter a value for "Price".');
                validData = false;
            }

            if (validData == true) {

                data = {
                    bwTenantId: tenantId,
                    bwWorkflowAppId: workflowAppId,
                    bwInventoryItemId: bwInventoryItemId,
                    Title: title,
                    ProductCode: productCode,
                    Description: description,
                    ExtendedDescription: extendedDescription,
                    Price: price,
                    Segment: segment,
                    Subclass: subclass,
                    bwParticipantId: participantId,
                    bwParticipantEmail: participantEmail,
                    bwParticipantFriendlyName: participantFriendlyName
                };
                var operationUri = webserviceurl + "/saveinventoryitem";
                $.ajax({
                    url: operationUri,
                    type: "POST",
                    data: data,
                    headers: {
                        "Accept": "application/json; odata=verbose"
                    },
                    success: function (result) {
                        try {
                            debugger;
                            if (result.message != 'SUCCESS') {
                                displayAlertDialog(result.message);
                            } else {



                                // if (result.mod.nModified == 1) { // 1-19-2022 WE DONT GET nModified BACK WHEN IT IS SAVED (only on Update) SO THIS IS GOOD for now.

                                console.log('In saveInventoryItem(). The inventory item was saved successfully. xcx324 bwInventoryItemId: ' + bwInventoryItemId);

                                $('#divAddInventoryItemDialog').dialog('close');


                                // Update in the locally stored json.
                                for (var i = 0; i < thiz.options.json.length; i++) {
                                    if (thiz.options.json[i].bwInventoryItemId == bwInventoryItemId) {
                                        thiz.options.json[i].Title = title;
                                        thiz.options.json[i].ProductCode = productCode;
                                        thiz.options.json[i].Description = description;
                                        thiz.options.json[i].ExtendedDescription = extendedDescription;
                                        thiz.options.json[i].Price = price;
                                        thiz.options.json[i].Segment = segment;
                                        thiz.options.json[i].Subclass = subclass;

                                    }
                                }

                                thiz.renderFilterAndProductsSections(segment, subclass);



                                //} else {
                                //    console.log('Error in saveInventoryItem(). result.message: ' + result.message + ', mod: ' + JSON.stringify(result.mod) + ' xcx92385');
                                //    displayAlertDialog('Error in saveInventoryItem(). result.message: ' + result.message + ', mod: ' + JSON.stringify(result.mod) + ' xcx92385');
                                //}




                            }
                        } catch (e) {
                            console.log('Exception in saveInventoryItem():2: ' + e.message + ', ' + e.stack);
                            alert('Exception in saveInventoryItem():2: ' + e.message + ', ' + e.stack);
                        }
                    },
                    error: function (data, errorCode, errorMessage) {
                        debugger;
                        console.log('Error in my.js.saveInventoryItem(): ' + errorCode + ' ' + errorMessage);
                        alert('Error in my.js.saveInventoryItem(): ' + errorCode + ' ' + errorMessage);
                        displayAlertDialog('Error in my.js.saveInventoryItem(): ' + errorCode + ' ' + errorMessage);
                    }
                });

            }

        } catch (e) {
            console.log('Exception in saveInventoryItem(): ' + e.message + ', ' + e.stack);
            alert('Exception in saveInventoryItem(): ' + e.message + ', ' + e.stack);
        }
    },
    uploadAttachment_InventoryItemImage: function (displayAttachmentsTagName, identityType, parm1, parm2, parm3) { // identityType: ['participant', 'org']
        try {
            console.log('In bwAdvancedProductSearch.js.uploadAttachment_InventoryItemImage().');

            console.log('xxxxxxxxxxxxxxxxxxxxxxxx4667354');

            //HideActivitySpinner();

            debugger;
            //if (identityType == 'participant') {
            //    // The user is uploading a participant image.
            //    var identityJson = {
            //        bwParticipantId: parm1,
            //        bwParticipantFriendlyName: parm2,
            //        bwParticipantEmail: parm3
            //    };

            //} else {
            //    // The user must be uploading an org image.
            //    var identityJson = {
            //        bwOrgId: parm1,
            //        bwOrgName: parm2,
            //        bwOrgPath: parm3
            //    };


            //}

            var identityJson = {};

            //debugger;
            //var _budgetRequestId = this.options.bwBudgetRequestId; // document.getElementById('BudgetRequestId').innerHTML; //$('span[xd\\:binding = "my:BudgetRequestId"]')[0].innerHTML;

            //displayAlertDialog('uploadAttachment() _budgetRequestId: ' + _budgetRequestId);
            var x = document.getElementById('inputFile_ForInventoryItemImage');
            var file = x.files[0];
            if (file.size > 100000000) {
                // Don't allow files over 5MB.
                displayAlertDialog('Currently the system does not allow files over 100MB.');
                $('#inputFile_ForInventoryItemImage').replaceWith($('#inputFile_ForInventoryItemImage').clone()); // Clear the file upload box. May not work in all browsers doing it this way.
            } else {
                //HideActivitySpinner();
                this.cmdDisplayConfirmFileUploadDialog_ForInventoryItemImage(displayAttachmentsTagName, identityType, identityJson); // identityType: ['participant', 'org']
                //displayAlertDialog('In uploadAttachment(). Result: ' + upload);

                //var upload = confirm("Click OK to upload the file...");
                //if (upload) {
                //    $("#divWorkingOnItDialog").dialog({
                //        modal: true,
                //        resizable: false,
                //        //closeText: "Cancel",
                //        closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                //        title: 'Working on it...',
                //        width: "360",
                //        dialogClass: "no-close", // No close button in the upper right corner.
                //        hide: false//, // This means when hiding just disappear with no effects.
                //        //buttons: {
                //        //    "Close": function () {
                //        //        $(this).dialog("close");
                //        //    }
                //        //}
                //    });
                //    $("#divWorkingOnItDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

                //    ProcessUpload(displayAttachmentsTagName, _budgetRequestId);
                //} else {
                //    $('#inputFile').replaceWith($('#inputFile').clone()); // Clear the file upload box. May not work in all browsers doing it this way.
                //    //populateAttachments();
                //}
            }
        } catch (e) {
            displayAlertDialog('Exception in bwAdvancedProductSearch.js.uploadAttachment_IdentifyingImage(' + displayAttachmentsTagName + '): ' + e.message + ', ' + e.stack);
            HideActivitySpinner();
        }
        // TODD: MAY HAVE TO ADD THIS LATER!!!!
        //// Ensure the HTML5 FileReader API is supported
        //if (window.FileReader) {
        //    var parts = document.getElementById("inputFile").value.split("\\");
        //    var filename = parts[parts.length - 1];
        //    file = document.getElementById("inputFile").files[0];
        //    //BW.Jsom.Libs.upload("Documents", filename, file);

        //    var fr = new FileReader();
        //    fr.onload = receivedBinary;
        //    fr.readAsDataURL(file);

        //} else {
        //    displayAlertDialog("The HTML5 FileSystem APIs are not fully supported in this browser.");
        //}

    },
    cmdDisplayConfirmFileUploadDialog_ForInventoryItemImage: function (displayAttachmentsTagName, identityType, identityJson) { // identityType: ['participant', 'org']
        try {
            console.log('In bwCoreComponent.js.cmdDisplayConfirmFileUploadDialog_ForInventoryItemImage().');
            var thiz = this;

            // Populate the filename text box!
            var x = document.getElementById('inputFile_ForInventoryItemImage');
            var file = x.files[0];
            var originalFilename = file.name.trim().split('.')[0];
            //document.getElementById('txtConfirmFileUploadDialogFilename').value = originalFilename;

            // Clear the description, because this may have the description from the last time it was displayed.
            //document.getElementById('txtConfirmFileUploadDialogFileDescription').innerHTML = '';
            //debugger;
            $("#divConfirmFileUploadDialog_ForInventoryItemImage").dialog({
                modal: true,
                resizable: false,
                closeText: "Cancel",
                closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                title: '',
                width: "720px",
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                buttons: {
                    "xxxx": {
                        text: 'Upload',
                        id: 'btnUploadTheFileNow',
                        //disabled: 'false',
                        click: function () {
                            try {
                                //var proceed = confirm('This action cannot be undone.\n\n\nClick the OK button to proceed...');
                                //if (proceed) {
                                //    cmdDeleteBudgetRequest(requestId);
                                //displayAlertDialog('This functionality is incomplete. Coming soon!');



                                $(this).dialog("close"); // PUT THIS BACK!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                                ShowActivitySpinner();
                                //$("#divWorkingOnItDialog").dialog({
                                //    modal: true,
                                //    resizable: false,
                                //    //closeText: "Cancel",
                                //    closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                                //    title: 'Working on it...',
                                //    width: "800",
                                //    dialogClass: "no-close", // No close button in the upper right corner.
                                //    hide: false//, // This means when hiding just disappear with no effects.
                                //    //buttons: {
                                //    //    "Close": function () {
                                //    //        $(this).dialog("close");
                                //    //    }
                                //    //}
                                //});
                                //$("#divWorkingOnItDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();


                                //var x = document.getElementById('inputFile');
                                //var file = x.files[0];

                                //// Check if the user specified a new filename. If so, make sure the file extension is the same!
                                //var originalFilename = file.name;
                                //var filename;
                                //if (document.getElementById('txtConfirmFileUploadDialogFilename').value.trim() == '') {
                                //    filename = file.name;
                                //} else {
                                //    filename = document.getElementById('txtConfirmFileUploadDialogFilename').value.trim().split('.')[0] + '.' + originalFilename.split('.')[1]; // Put the same extension on it.
                                //}




                                //var _budgetRequestId = document.getElementById('BudgetRequestId').innerHTML;
                                //debugger;
                                thiz.processUpload_ForInventoryItemImage(displayAttachmentsTagName, identityType, identityJson); // identityType: ['participant', 'org']

                                //return true;
                                //}
                            } catch (e) {
                                console.log('Exception in cmdDisplayConfirmFileUploadDialog_ForInventoryItemImage.divConfirmFileUploadDialog_ForInventoryItemImage.click(): ' + e.message + ', ' + e.stack);
                                thiz.displayAlertDialog('Exception in cmdDisplayConfirmFileUploadDialog_ForInventoryItemImage.divConfirmFileUploadDialog_ForInventoryItemImage.click(): ' + e.message + ', ' + e.stack);
                            }
                        }
                    },
                    "Cancel": function () {
                        try {
                            $(this).dialog("close");

                            $('#inputFile_ForInventoryItemImage').replaceWith($('#inputFile_ForInventoryItemImage').clone()); // Clear the file upload box. May not work in all browsers doing it this way.
                            //return false;
                        } catch (e) {
                            console.log('Exception in cmdDisplayConfirmFileUploadDialog_ForInventoryItemImage.divConfirmFileUploadDialog_ForInventoryItemImage.click.cancel(): ' + e.message + ', ' + e.stack);
                            thiz.displayAlertDialog('Exception in cmdDisplayConfirmFileUploadDialog_ForInventoryItemImage.divConfirmFileUploadDialog_ForInventoryItemImage.click.cancel(): ' + e.message + ', ' + e.stack);
                        }
                    }
                },
                open: function (event, ui) {
                    $('.ui-widget-overlay').bind('click', function () {
                        $('#divConfirmFileUploadDialog_ForInventoryItemImage').dialog('close');
                    });

                    // 1-24-2020 ToDo: Display the image prior to uploading!
                    var x = document.getElementById('inputFile_ForInventoryItemImage');
                    var file = x.files[0];

                    //
                    // First get the dimensions of the image.
                    var _URL = window.URL || window.webkitURL;
                    var img;
                    //if ((file = this.files[0])) {
                    img = new Image();
                    var objectUrl = _URL.createObjectURL(file);
                    img.onload = function () {
                        //alert(this.width + " " + this.height);
                        _URL.revokeObjectURL(objectUrl);


                        //if (this.width < 400 || this.height < 400) {
                        if (this.width < 50 || this.height < 50) {
                            $('#divConfirmFileUploadDialog_ForInventoryItemImage').dialog('close');
                            //alert('The image must be a 400px square. This image is too small.');
                            alert('The image must be a 50px square. This image is too small.');
                        } else {
                            // Now display it.
                            var reader = new FileReader();
                            reader.onload = function (e) {
                                $('#ConfirmFileUploadDialog_ForInventoryItemImage_ImagePreview').attr('src', e.target.result);
                                $('#ConfirmFileUploadDialog_ForInventoryItemImage_ImagePreview').attr('style', 'height:400px;');
                            }
                            reader.readAsDataURL(file);
                        }
                    };
                    img.src = objectUrl;
                    //}




                    //// Now display it.
                    //var reader = new FileReader();

                    //reader.onload = function (e) {
                    //    $('#ConfirmFileUploadDialog_ForInventoryItemImage_ImagePreview').attr('src', e.target.result);
                    //}

                    //reader.readAsDataURL(file);




                } // This allows the dialog to close when clicked outside of the dialog. Only works for modal dialogs.

            });

            // Hide the title bar.
            $("#divConfirmFileUploadDialog_ForInventoryItemImage").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
            // Set the title.
            //document.getElementById('spanDeleteABudgetRequestDialogTitle').innerHTML = 'Confirm file uploadx';

            //$('#btnUploadTheFileNow').bind('click', function (error) { 
            //    try {
            //        console.log('Preparing to call ProcessUpload(' + displayAttachmentsTagName + ', ' + _budgetRequestId);
            //        $('#divConfirmFileUploadDialog').dialog('close');
            //        ProcessUpload(displayAttachmentsTagName, _budgetRequestId);
            //    } catch (e) {
            //        displayAlertDialog('Exception in my.js.xx.btnUploadTheFileNow.click: ' + e.message);
            //    }
            //});

            //$('#btnCancelUploadTheFileNow').bind('click', function (error) {  
            //    try {
            //        console.log('In my.js.xx.btnCancelUploadTheFileNow.click().');
            //        $('#divConfirmFileUploadDialog').dialog('close');
            //        $('#inputFile').replaceWith($('#inputFile').clone()); // Clear the file upload box. May not work in all browsers doing it this way.
            //    } catch (e) {
            //        displayAlertDialog('Exception in my.js.xx.btnCancelUploadTheFileNow.click: ' + e.message);
            //    }
            //});
        } catch (e) {
            console.log('Exception in bwAdvancedProductSearch.js.cmdDisplayConfirmFileUploadDialog_ForInventoryItemImage(): ' + e.message);
            displayAlertDialog('Exception in bwAdvancedProductSearch.js.cmdDisplayConfirmFileUploadDialog_ForInventoryItemImage(): ' + e.message);
        }
    },
    processUpload_ForInventoryItemImage: function (displayAttachmentsTagName, identityType, identityJson) { // identityType: ['participant', 'org']
        try {
            console.log('In processUpload_ForInventoryItemImage(). identityType: ' + identityType + ', identityJson: ' + JSON.stringify(identityJson));
            var thiz = this;

            //
            // The user has clicked the "Upload now" button. This is the identifying image which shows up in the small circle of a circle dialog.
            //
            //debugger;

            var x = document.getElementById('inputFile_ForInventoryItemImage');
            var file = x.files[0];















            // Check if the user specified a new filename. If so, make sure the file extension is the same!
            var originalFilename = file.name;
            var filename;
            if (document.getElementById('txtConfirmFileUploadDialogFilename') && document.getElementById('txtConfirmFileUploadDialogFilename').value.trim() == '') {
                filename = file.name;
            } else if (document.getElementById('txtConfirmFileUploadDialogFilename')) {
                filename = document.getElementById('txtConfirmFileUploadDialogFilename').value.trim().split('.')[0] + '.' + originalFilename.split('.')[1]; // Put the same extension on it.
            } else {
                //var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                //    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                //    return v.toString(16);
                //});
                filename = originalFilename; //guid;
            }

            if (filename.indexOf('.xml') > 0) {
                // XML files add 3 characters to the start of the file when using readAsArrayBuffer, so using readAsText instead!
                var reader = new FileReader();
                reader.onload = function (event) {
                    var fileData = reader.result;
                    //displayAlertDialog('fileData prior to ws call:' + fileData);
                    debugger;
                    thiz.performUpload_ForInventoryItemImage(fileData, filename, displayAttachmentsTagName, identityType, identityJson); // identityType: ['participant', 'org']
                };
                reader.readAsText(file);
            } else {



                //
                // This is where we should be resizing the file. Assume it is a .png for the moment.
                //
                var calculateAspectRatioFit = function (srcWidth, srcHeight, maxWidth, maxHeight) {
                    var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

                    var width = srcWidth * ratio;
                    var height = srcHeight * ratio;

                    var dx = 0;
                    if (width < maxWidth) dx = (maxWidth - width) / 2;
                    var dy = 0;
                    if (height < maxHeight) dy = (maxHeight - height) / 2;


                    //return { width: srcWidth * ratio, height: srcHeight * ratio, sx: 150, sy: 150 }; // sx and sy place the image in the center of the 512 x 512 square we are working with.
                    return { width: width, height: height, dx: dx, dy: dy }; // sx and sy place the image in the center of the 512 x 512 square we are working with.
                };

                var fileReader = new FileReader();
                var filterType = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;

                fileReader.onload = function (event) {
                    var image = new Image();

                    image.onload = function () {
                        //debugger;
                        document.getElementById("ConfirmFileUploadDialog_ForInventoryItemImage_ImagePreview").src = image.src;
                        var canvas = document.createElement("canvas");
                        var ctx = canvas.getContext("2d");

                        var resizedImage = calculateAspectRatioFit(image.width, image.height, 512, 512);

                        canvas.width = 512; //resizedImage.width;
                        canvas.height = 512; //resizedImage.height;

                        //var smallCircleRadius = 256;
                        //var smallCircleCenterX = 256;
                        //var smallCircleCenterY = 256;
                        //ctx.arc(smallCircleCenterX, smallCircleCenterY, smallCircleRadius, 0, 2 * Math.PI);
                        //ctx.stroke();
                        //ctx.fillStyle = 'aliceblue';
                        //ctx.fill();
                        //ctx.closePath();
                        //ctx.clip();

                        ctx.drawImage(image,
                            0, // ok. We want to resize the entire image.
                            0, // ok. We want to resize the entire image.
                            image.width, // ok. We want to resize the entire image.
                            image.height, // ok We want to resize the entire image.
                            resizedImage.dx, // x destination
                            resizedImage.dy, // y destination
                            resizedImage.width, // width scaling value
                            resizedImage.height // height scaling value
                        );
                        //debugger;
                        //ctx.arc(smallCircleCenterX, smallCircleCenterY, smallCircleRadius, 0, 2 * Math.PI);
                        //ctx.clip();
                        //ctx.closePath();
                        //ctx.restore();

                        //debugger;
                        //document.getElementById("ConfirmFileUploadDialog_ForInventoryItemImage_ImagePreview2").src = canvas.toDataURL();

                        var dataURL = canvas.toDataURL();
                        var blobBin = atob(dataURL.split(',')[1]);
                        var array = [];
                        for (var i = 0; i < blobBin.length; i++) {
                            array.push(blobBin.charCodeAt(i));
                        }
                        var file2 = new Blob([new Uint8Array(array)], { type: 'image/png' });



                        ////// THIS WORKS JUST COMMENTING OUT FOR A MOMENT
                        var reader = new FileReader();
                        reader.onload = function (event) {
                            var fileData = '';
                            var buffer = event.target.result;
                            var byteArray = new Uint8Array(buffer);
                            for (var i = 0; i < byteArray.byteLength; i++) {
                                fileData += String.fromCharCode(byteArray[i])
                            }
                            //displayAlertDialog('fileData prior to ws call:' + fileData);
                            //displayAlertDialog('size2: ' + fileData.length);
                            //PerformUpload(fileData, file.name, displayAttachmentsTagName, _budgetRequestId);
                            //debugger;
                            thiz.performUpload_ForInventoryItemImage(fileData, filename, displayAttachmentsTagName, identityType, identityJson); // identityType: ['participant', 'org']
                        };
                        reader.readAsArrayBuffer(file2); // This works for text. 
                        //var img2 = canvas.toDataURL();
                        //// Convert Base64 image to binary
                        ////var file2 = dataURItoBlob(img2);
                        //reader.readAsArrayBuffer(file2); // This works for text. 











                        //// At this point we have the image displayed to the user, but we need to convert it to a file then an array buffer to send to the server.
                        //var fileReader2 = new FileReader();
                        //fileReader2.onload = function (event) {
                        //    var fileData = '';
                        //    var buffer = event.target.result;
                        //    var byteArray = new Uint8Array(buffer);
                        //    for (var i = 0; i < byteArray.byteLength; i++) {
                        //        fileData += String.fromCharCode(byteArray[i])
                        //    }
                        //    //displayAlertDialog('fileData prior to ws call:' + fileData);
                        //    //displayAlertDialog('size2: ' + fileData.length);
                        //    //PerformUpload(fileData, file.name, displayAttachmentsTagName, _budgetRequestId);
                        //    debugger;
                        //    thiz.performUpload_ForInventoryItemImage(fileData, filename, displayAttachmentsTagName, identityType, identityJson); // identityType: ['participant', 'org']
                        //};
                        //debugger;
                        ////var x = document.getElementById("ConfirmFileUploadDialog_ForInventoryItemImage_ImagePreview2");
                        //// Use the resized image to do what you want
                        //var x = canvas.toDataURL("image/png");
                        ////fileReader2.readAsDataURL(x);
                        //thiz.performUpload_ForInventoryItemImage(x, filename, displayAttachmentsTagName, identityType, identityJson); // identityType: ['participant', 'org']




                        //var buffer = canvas.toDataURL();
                        //var byteArray = new Uint8Array(buffer);
                        //for (var i = 0; i < byteArray.byteLength; i++) {
                        //    fileData += String.fromCharCode(byteArray[i])
                        //}
                        //debugger;
                        //thiz.performUpload_ForInventoryItemImage(fileData, filename, displayAttachmentsTagName, identityType, identityJson); // identityType: ['participant', 'org']






                        ////// THIS WORKS JUST COMMENTING OUT FOR A MOMENT
                        //var reader = new FileReader();
                        //reader.onload = function (event) {
                        //    var fileData = '';
                        //    var buffer = event.target.result;
                        //    var byteArray = new Uint8Array(buffer);
                        //    for (var i = 0; i < byteArray.byteLength; i++) {
                        //        fileData += String.fromCharCode(byteArray[i])
                        //    }
                        //    //displayAlertDialog('fileData prior to ws call:' + fileData);
                        //    //displayAlertDialog('size2: ' + fileData.length);
                        //    //PerformUpload(fileData, file.name, displayAttachmentsTagName, _budgetRequestId);
                        //    //debugger;
                        //    thiz.performUpload_ForInventoryItemImage(fileData, filename, displayAttachmentsTagName, identityType, identityJson); // identityType: ['participant', 'org']
                        //};
                        //reader.readAsArrayBuffer(file); // This works for text. 
                        //var img2 = canvas.toDataURL();
                        //// Convert Base64 image to binary
                        ////var file2 = dataURItoBlob(img2);
                        //reader.readAsArrayBuffer(file2); // This works for text. 















                    }
                    image.src = event.target.result;
                };

                var loadImageFile = function () {
                    try {
                        var uploadImage = document.getElementById("inputFile_ForInventoryItemImage");

                        //check and retuns the length of uploded file.
                        if (uploadImage.files.length === 0) {
                            return;
                        }

                        //Is Used for validate a valid file.
                        var uploadFile = document.getElementById("inputFile_ForInventoryItemImage").files[0];
                        if (!filterType.test(uploadFile.type)) {
                            HideActivitySpinner();
                            alert("Please select a valid image.");
                            return;
                        }

                        fileReader.readAsDataURL(uploadFile);
                    } catch (e) {
                        console.log('Exception in bwAdvancedProductSearch.js.loadImageFile(): ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwAdvancedProductSearch.js.loadImageFile(): ' + e.message + ', ' + e.stack);
                    }
                }

                //debugger;
                loadImageFile();





                ////// THIS WORKS JUST COMMENTING OUT FOR A MOMENT
                //var reader = new FileReader();
                //reader.onload = function (event) {
                //    var fileData = '';
                //    var buffer = event.target.result;
                //    var byteArray = new Uint8Array(buffer);
                //    for (var i = 0; i < byteArray.byteLength; i++) {
                //        fileData += String.fromCharCode(byteArray[i])
                //    }
                //    //displayAlertDialog('fileData prior to ws call:' + fileData);
                //    //displayAlertDialog('size2: ' + fileData.length);
                //    //PerformUpload(fileData, file.name, displayAttachmentsTagName, _budgetRequestId);
                //    debugger;
                //    thiz.performUpload_ForInventoryItemImage(fileData, filename, displayAttachmentsTagName, identityType, identityJson); // identityType: ['participant', 'org']
                //};
                //reader.readAsArrayBuffer(file); // This works for text. 
            }


        } catch (e) {
            console.log('Exception in processUpload_ForInventoryItemImage() catch for second attempt...: ' + e.message + ', ' + e.stack);
            try {
                //displayAlertDialog('bw.initar.ore.js.ProcessUpload():2');
                // this section is here to support older IE browsers.
                //var filePath = f:\oo.txt;
                var fso = new ActiveXObject("Scripting.FileSystemObject");
                var textStream = fso.OpenTextFile(fileInput);
                var fileData = file.ReadAll();

                //var fileName = '',
                //     libraryName = '',
                //     fileData = '';

                //var byteArray = new Uint8Array(result.target.result)
                //for (var i = 0; i < byteArray.byteLength; i++) {
                //    fileData += String.fromCharCode(byteArray[i])
                //}

                // once we have the file perform the actual upload
                debugger; // TODD: Do we ever get here? does this even work?
                thiz.performUpload_ForInventoryItemImage(fileData);
            } catch (e2) {
                HideActivitySpinner();
                //window.waitDialog.close();
                //try {
                //    $('#divWorkingOnItDialog').dialog('close'); // Close the create your account dialog.
                //} catch (e) { }
                displayAlertDialog('Exception in processUpload_ForInventoryItemImage(): Uploading files doesn\'t seem to be supported in your browser: ' + e2.number + ': ' + e2.message + ', ' + e2.stack);
            }
        }
    },
    performUpload_ForInventoryItemImage: function (fileData, filename, displayAttachmentsTagName, identityType, identityJson) { // identityType: ['participant', 'org']
        try {
            console.log('In performUpload_ForInventoryItemImage().'); //: identityJson: ' + JSON.stringify(identityJson));
            var thiz = this;

            ShowActivitySpinner();

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
            var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

            //var bwInventoryItemId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            //    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            //    return v.toString(16);
            //});
            var bwInventoryItemId = $('#divAddInventoryItemDialog').find('#inventoryitemform')[0].getAttribute('bwinventoryitemid');

            debugger;
            //
            // This is where the actual upload happens.
            //

            // The user is uploading a participant image.
            var description = 'This inventory image saved by bwParticipantId: ' + participantId + '. ' + participantFriendlyName + ' (' + participantEmail + ')';

            //debugger;
            data = {
                bwWorkflowAppId: workflowAppId,
                bwInventoryItemId: bwInventoryItemId,
                bwParticipantId: participantId,
                bwParticipantEmail: participantEmail,
                bwParticipantFriendlyName: participantFriendlyName,
                Filename: 'inventoryimage.png', // 'userimage.png', //filename,
                FileContent: fileData,
                Description: description
            };

            //displayAlertDialog('fileData from json object:' + data.FileContent);
            //alert('In bwAdvancedProductSearch.js.performUpload_ForInventoryItemImage(). size: ' + fileData.length);
            //debugger;


            var operationUri = this.options.operationUriPrefix + '_files/' + 'uploadidentifyingimageforinventoryitem'; // 'uploadattachment'; // _files allows us to use nginx to route these to a dedicated file server.



            //var operationUri = this.options.operationUriPrefix + '_files/' + 'uploadidentifyingimagefororg';
            //var operationUri = this.options.operationUriPrefix + '_files/' + 'uploadidentifyingimageforrequesttype';
            $.ajax({
                url: operationUri,
                type: "PUT",
                //contentType: "image/png",
                data: data,
                headers: { "Accept": "application/json; odata=verbose" },
                timeout: 15000,
                success: function (data) {
                    try {
                        //displayAlertDialog('bw.initar.core.js.PerformUpload(): ' + JSON.stringify(data));
                        HideActivitySpinner();
                        //debugger;

                        //displayAlertDialog("Success! Your file was uploaded to SharePoint.");
                        //$('#divWorkingOnItDialog').dialog('close'); // Close the "Working on it..." dialog.
                        $('#inputFile_ForInventoryItemImage').replaceWith($('#inputFile_ForInventoryItemImage').clone()); // Clear the file upload box. May not work in all browsers doing it this way.

                        //thiz.populateAttachments(thiz.options.bwWorkflowAppId, thiz.options.bwBudgetRequestId, 'newrequestattachments', true); //'attachments'); // This lists the attachments in the <p> tag with id='attachments'.

                        // Close the dialog.
                        //$('#divUploadANewSmallCircleImageDialog').dialog('close');

                        // 1-24-2020 ToDo: Update the circle dialog with the new small circle image!


                        //alert('xcx21312442-2 add activestateidentifier to this image path...');

                        //
                        // This prevents caching of participant image when uploading a new one!
                        //
                        // https://budgetworkflow.com/_files/6f308d4e-66fd-4e6f-925e-714b3135fef3/orgimages/root/orgimage.png


                        var preventCachingGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                            return v.toString(16);
                        });

                        //var imageUrl = thiz.options.operationUriPrefix + '_files/' + workflowAppId + '/inventoryimages/' + bwInventoryItemId + '/inventoryimage.png?v=' + guid;

                        var imageUrl;

                        var activeStateIdentifier = JSON.parse($('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier'));

                        if (activeStateIdentifier.status != 'SUCCESS') {

                            imageUrl += '[No image. Unauthorized. xcx213124-3-443]';

                        } else {

                            imageUrl = thiz.options.operationUriPrefix + '_files/' + workflowAppId + '/inventoryimages/' + bwInventoryItemId + '/inventoryimage.png?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier;
                            
                        }









                        document.getElementById("divUploadANewSmallCircleImageDialogContentImage").src = imageUrl;



                        //document.getElementById("orgImage_root_blueheaderbar2").src = imageUrl;
                        //document.getElementById("orgImage_root_blueheaderbar3").src = imageUrl;
                        //document.getElementById("orgImage_root_blueheaderbar4").src = imageUrl;
                        //document.getElementById("orgImage_root_blueheaderbar5").src = imageUrl;
                        //document.getElementById("orgImage_root_blueheaderbar6").src = imageUrl;
                        // end: This prevents caching of image when uploading a new one!



                        //// https://budgetworkflow.com/_files/6f308d4e-66fd-4e6f-925e-714b3135fef3/orgimages/root/orgimage.png
                        //var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                        //    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                        //    return v.toString(16);
                        //});
                        //var imageUrl = thiz.options.operationUriPrefix + thiz.options.bwWorkflowAppId + '/orgimages/root/orgimage.png?v=' + guid;
                        //var reader = new FileReader();
                        //reader.onload = function (event) {
                        //    debugger;
                        //    var fileData = '';
                        //    //var buffer = event.target.result;
                        //    //var byteArray = new Uint8Array(buffer);
                        //    //for (var i = 0; i < byteArray.byteLength; i++) {
                        //    //    fileData += String.fromCharCode(byteArray[i])
                        //    //}
                        //    //displayAlertDialog('fileData prior to ws call:' + fileData);
                        //    //displayAlertDialog('size2: ' + fileData.length);
                        //    //PerformUpload(fileData, file.name, displayAttachmentsTagName, _budgetRequestId);
                        //    //debugger;
                        //    //thiz.performUpload_ForInventoryItemImage(fileData, filename, displayAttachmentsTagName, identityType, identityJson); // identityType: ['participant', 'org']
                        //};
                        //reader.readAsArrayBuffer(imageUrl);







                    } catch (e) {
                        HideActivitySpinner();
                        console.log('Exception in performUpload_ForInventoryItemImage():2: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in performUpload_ForInventoryItemImage():2: ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    try {
                        //$('#divWorkingOnItDialog').dialog('close'); // Close the "Working on it..." dialog.
                        HideActivitySpinner();
                        console.log('Error in performUpload(): ' + errorMessage);
                        debugger;
                        if (errorMessage == 'timeout') {
                            displayAlertDialog('The file server could not be contacted. Please try again in a few minutes.');
                        } else {
                            displayAlertDialog('Error in performUpload_ForInventoryItemImage():xcx1: ' + errorMessage);
                        }
                    } catch (e) {
                        console.log('Exception in performUpload_ForInventoryItemImage():3: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in performUpload_ForInventoryItemImage():3: ' + e.message + ', ' + e.stack);
                    }
                }
            });

        } catch (e) {
            HideActivitySpinner();
            console.log('Exception in performUpload_ForInventoryItemImage(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in performUpload_ForInventoryItemImage(): ' + e.message + ', ' + e.stack);
        }
    },


    uploadAttachment_InventoryItemImage_Blur: function () { // identityType: ['participant', 'org']
        try {
            console.log('In uploadAttachment_IdentifyingImage_Blur().');

            HideActivitySpinner();

        } catch (e) {
            console.log('Error in uploadAttachment_IdentifyingImage_Blur(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Error in uploadAttachment_IdentifyingImage_Blur(): ' + e.message + ', ' + e.stack);
            HideActivitySpinner();
        }

    },
    uploadAttachment_InventoryItemImage_Focus: function () { // identityType: ['participant', 'org']
        try {
            console.log('In uploadAttachment_IdentifyingImage_Focus().');

            HideActivitySpinner();

        } catch (e) {
            console.log('Error in uploadAttachment_IdentifyingImage_Focus(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Error in uploadAttachment_IdentifyingImage_Focus(): ' + e.message + ', ' + e.stack);
            HideActivitySpinner();
        }

    },










    renderConfigurationInventoryScreen: function (renderElementId) { //renderProductSearchScreen: function () {
        try {
            console.log('In bwAdvancedProductSearch.js.renderConfigurationInventoryScreen().');
            //alert('In bwAdvancedProductSearch.js.renderConfigurationInventoryScreen().');
            var thiz = this;
            //ShowActivitySpinner();

            if (!renderElementId) {

                var msg = 'Error in bwAdvancedProductSearch.js.renderConfigurationInventoryScreen(). Invalid value for renderElementId: ' + renderElementId;
                console.log(msg);
                displayAlertDialog(msg);

            } else {

                if (!this.options.ERP.toUpperCase()) {
                    alert('Error: Customer ERP value is undefined. This process cannot continue.');
                } else {

                    var bundles = [
                        {
                            BundleDescription: "Todd Test 1 - 2-27-2021",
                            BundleId: 1,
                            BundleItemId: 2,
                            CurrencyCode: "USD",
                            CustomerId: 4242,
                            CustomerLevel: "2",
                            EFFixer: null,
                            Expr1: null,
                            ProductCode: "XCX12394",
                            Description: "xcx23423469",
                            ProductId: "xcx324892349",
                            QuantityBreak: 9,
                            QuoteId: null,
                            UOM: "SF",
                            UnitOfMeasureId: null
                        }
                    ];

                    try {

                        //try {
                        thiz.options.Bundles = bundles;

                        //for (var i = 0; i < thiz.options.json.length; i++) {
                        //    this.options.json[i]["Segment"] = this.options.json[i].Segment;
                        //    this.options.json[i]["SubClassDescription"] = this.options.json[i].SubClassDescription;
                        //    this.options.json[i]["Subclass"] = this.options.json[i].Subclass;
                        //    //this.options.json[i]["SubClass"] = '30';

                        //    this.options.json[i]["ProductId"] = this.options.json[i].bwInventoryItemId;
                        //    //this.options.json[i]["ProductId"] = this.options.json[i].bwInventoryItemId;

                        //    //this.options.json[i]["ProductCode"] = '30';
                        //    this.options.json[i]["ProductDescription"] = this.options.json[i].Description;

                        //    this.options.json[i]["Style"] = 'xcx7756';
                        //    this.options.json[i]["Color"] = 'BLUE';
                        //    this.options.json[i]["UnitWidthUOM"] = 'mm';
                        //    this.options.json[i]["UnitHeightUOM"] = 'mm';
                        //    this.options.json[i]["UnitLengthUOM"] = 'mm';
                        //    this.options.json[i]["OrderUOM"] = 'QTY';
                        //    this.options.json[i]["UnitWidth"] = '1';
                        //    this.options.json[i]["UnitHeight"] = '1';
                        //    this.options.json[i]["UnitLength"] = '1';
                        //    this.options.json[i]["MinOrderQty"] = '1';
                        //    this.options.json[i]["PrintTypeCode"] = '1';
                        //    this.options.json[i]["PrintTypeDescription"] = '1';
                        //    this.options.json[i]["PrivateLabel"] = '1';
                        //    this.options.json[i]["ConsumerItem"] = '1';
                        //    this.options.json[i]["BundleId"] = '1';
                        //    this.options.json[i]["BundleItemId"] = '1';

                        //}

                        //ProductId: data[i].ProductId,
                        //ProductCode: data[i].ProductCode,
                        //ProductDescription: data[i].Description,
                        //Style: data[i].Style,
                        //Color: data[i].Color,
                        //UnitWidthUOM: data[i].UnitWidthUOM,
                        //UnitHeightUOM: data[i].UnitHeightUOM,
                        //UnitLengthUOM: data[i].UnitLengthUOM,
                        //OrderUOM: data[i].OrderUOM,
                        //UnitWidth: data[i].UnitWidth,
                        //UnitHeight: data[i].UnitHeight,
                        //UnitLength: data[i].UnitLength,
                        //MinOrderQty: data[i].MinOrderQty,
                        //PrintTypeCode: data[i].PrintTypeCode,
                        //PrintTypeDescription: data[i].PrintTypeDescription,
                        //ExtendedDescription: data[i].ExtendedDescription,
                        //PrivateLabel: data[i].PrivateLabel,
                        //ConsumerItem: data[i].ConsumerItem,
                        //ERP: data[i].ERP,
                        //BundleId: data[i].BundleId,
                        //BundleItemId: data[i].BundleItemId
                        //debugger;
                        var productSegments = [];
                        for (var i = 0; i < this.options.json.length; i++) {
                            if (this.options.json[i].Segment) {
                                if (!(productSegments.indexOf(this.options.json[i].Segment) > -1)) {
                                    productSegments.push(this.options.json[i].Segment);
                                }
                            }
                        }
                        thiz.options.productSegments = productSegments;
                        //debugger;
                        var html = '';

                        html += '<style>';
                        html += '.bwHoverLink1:hover {';
                        html += '    color:red;';
                        html += '    cursor:pointer;';
                        html += '}';
                        html += '.ui-autocomplete {';
                        html += '   max-height: 800px;';
                        html += '   overflow-y: auto;';
                        html += '   overflow-x: hidden;';
                        html += '}';
                        html += '</style>';














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

                        html += '<style>';


                        //html += '     .nonSelectableText {';
                        //html += '        -webkit - touch - callout: none !important; /* iOS Safari */';
                        //html += '        -webkit-user-select: none !important; /* Chrome/Safari/Opera */';
                        //html += '        -khtml-user-select: none !important; /* Konqueror */';
                        //html += '        -moz-user-select: none !important; /* Firefox */';
                        //html += '        -ms-user-select: none !important; /* Internet Explorer/Edge */';
                        //html += '        user-select: none !important; /* Non-prefixed version, currently not supported by any browser */';
                        //html += '    }';


                        html += '</style>';
                        html += '    <div id="bwProductCatalog1" style="display:none;">';
                        html += '        <div id="divBwAdvancedProductSearch1"></div>';
                        html += '    </div>';
                        html += '&nbsp;&nbsp;';

                        console.log('In bwAdvancedProductSearch.js widget. Adding divAddInventoryItemDialog xcx231234');

                        // The new inventory item dialog
                        html += '<div style="display:none;" id="divAddInventoryItemDialog">'; //  overflow-x: hidden; 
                        html += '            <table style="">';
                        html += '                <tr>';
                        html += '                    <td style="">';
                        html += '                        <span id="divAddInventoryItemDialogContent">[divAddInventoryItemDialogContent]</span>';
                        html += '                    </td>';
                        html += '                </tr>';
                        html += '            </table>';
                        html += '            <br /><br />';
                        html += '        </div>';


                        html += '<div style="display:none;" id="divConfirmFileUploadDialog_ForInventoryItemImage">';
                        html += '            <table style="width:100%;">';
                        html += '                <tr>';
                        html += '                    <td style="width:90%;">';
                        html += '                        <span id="spanConfirmFileUploadDialogTitle" style="color: #3f3f3f;font-size: 60pt;font-weight:bold;">';
                        html += '                            Select the \'Upload\' button...';
                        html += '                        </span>';
                        html += '                    </td>';
                        html += '                    <td style="width:9%;"></td>';
                        html += '                    <td style="width:1%;cursor:pointer;vertical-align:top;">';
                        html += '                        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 120pt;font-weight:bold;" onclick="$(\'#divConfirmFileUploadDialog_ForInventoryItemImage\').dialog(\'close\');">X</span>';
                        html += '                    </td>';
                        html += '                </tr>';
                        html += '            </table>';
                        html += '            <br /><br />';
                        html += '            <span style="font-style:italic;color:gray;font-size:15pt;">The image will look the best if it is a 400 pixel (or greater) square.</span>';
                        html += '            <br /><br />';

                        html += '            <img id="ConfirmFileUploadDialog_ForInventoryItemImage_ImagePreview" src="#" alt="your image" />';

                        html += '            <!--<div id="btnUploadTheFileNow" class="divDialogButton" title="Click here to upload the attachment.">';
                        html += '                Upload';
                        html += '            </div>';
                        html += '            <br /><br />';
                        html += '            <div id="btnCancelUploadTheFileNow" class="divDialogButton" onclick="$(\'#divConfirmFileUploadDialog\').dialog(\'close\');">';
                        html += '                Cancel';
                        html += '            </div>-->';
                        html += '        </div>';

                        html += '<div style="display:none;" id="divAddAProductSegmentDialog">';
                        html += '   <table style="width:100%;">';
                        html += '       <tr>';
                        html += '           <td style="width:90%;">';
                        html += '               <span id="divAddAProductSegmentDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;font-weight:bold;">Add a new Segment</span>';
                        html += '           </td>';
                        html += '           <td style="width:9%;"></td>';
                        html += '           <td style="width:1%;cursor:pointer;vertical-align:top;">';
                        html += '               <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 30pt;font-weight:bold;" onclick="$(\'#divAddAProductSegmentDialog\').dialog(\'close\');">X</span>';
                        html += '           </td>';
                        html += '       </tr>';
                        html += '   </table>';
                        html += '   <br /><br />';
                        html += '   <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
                        html += '   <span id="spanAddAnOrgItemDialogInvitationDescriptionText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 20pt;"></span>';
                        html += '   <span style="font-family: calibri;">Name</span>';
                        html += '   <br />';
                        html += '   <input type="text" id="textDivAddAProductSegmentDialog_SegmentName" style="WIDTH: 95%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" />';
                        html += '   <br /><br /><br />';
                        html += '   <div id="divAddAnOrgItemDialogSubmitButton" onclick="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'addTheSegment\');" class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;">';
                        html += '       Add the Segment';
                        html += '   </div>';
                        html += '   <br /><br />';
                        html += '   <div class="divSignInButton" style="width: 90%; text-align: center; line-height: 1.1em; font-weight: bold;" onclick="$(\'#divAddAProductSegmentDialog\').dialog(\'close\');">';
                        html += '       Close';
                        html += '   </div>';
                        html += '   <br /><br />';
                        html += '</div>';

                        html += '<div style="display:none;" id="divAddAProductSubclassDialog">';
                        html += '   <table style="width:100%;">';
                        html += '       <tr>';
                        html += '           <td style="width:90%;">';
                        html += '               <span id="divAddAProductSegmentDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;font-weight:bold;">Add a new Subclass</span>';
                        html += '           </td>';
                        html += '           <td style="width:9%;"></td>';
                        html += '           <td style="width:1%;cursor:pointer;vertical-align:top;">';
                        html += '               <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 30pt;font-weight:bold;" onclick="$(\'#divAddAProductSubclassDialog\').dialog(\'close\');">X</span>';
                        html += '           </td>';
                        html += '       </tr>';
                        html += '   </table>';
                        html += '   <br /><br />';
                        html += '   <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
                        html += '   <span id="spanAddAnOrgItemDialogInvitationDescriptionText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 20pt;"></span>';
                        html += '   <span style="font-family: calibri;">Name</span>';
                        html += '   <br />';
                        html += '   <input type="text" id="textDivAddAProductSubclassDialog_SubclassName" style="WIDTH: 95%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" />';
                        html += '   <br /><br /><br />';
                        html += '   <div id="divAddAnOrgItemDialogSubmitButton" onclick="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'addTheSubclass\');" class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;">';
                        html += '       Add the Subclass';
                        html += '   </div>';
                        html += '   <br /><br />';
                        html += '   <div class="divSignInButton" style="width: 90%; text-align: center; line-height: 1.1em; font-weight: bold;" onclick="$(\'#divAddAProductSubclassDialog\').dialog(\'close\');">';
                        html += '       Close';
                        html += '   </div>';
                        html += '   <br /><br />';
                        html += '</div>';











































                        html += '<div id="bwAdvancedProductSearch_Error" style="color:tomato;font-size:10pt;font-weight:bold;font-style:italic;"></div>'; // Errors get displayed here.

                        html += '<form>';
                        html += '   <label>Product Search</label>';
                        html += '   <br />';



                        html += '   <input class="focus bwRequestJson" id="txtAdvancedProductSearch" name="txtAdvancedProductSearch" placeholder="Enter the product name or item number" type="text" value="" style="width:350px;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size:15pt;" />';
                        //html += '<input type="text" class="bwRequestJson" bwdatarequired="true" bwdatatype="string" bwfieldname="ProjectTitle" id="strProjectTitle" onkeyup="$('.bwRequest').bwRequest('editTextbox_OnKeyUp', this);" style="WIDTH: 100%;font-family: 'Segoe UI Light','Segoe UI','Segoe',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;">';




                        html += '&nbsp;&nbsp;';
                        html += '<input type="input" class="button-blue" onclick="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'clearTheSearchBox\');" value="Clear" style="width:100px;" />';

                        html += '<div style="float:right;"><input type="input" class="button-blue" onclick="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'displayAddInventoryItemDialog\');" value="Add inventory item" style="width:200px;" /></div>';

                        html += '</form>';

                        if (productSegments.length == 1) {
                            // Since there is only one product segment, we won't display the segment top menu bar. This happens for Polyair at the moment.
                        } else {
                            html += '<span id="productSegmentTopMenubar">';
                            for (var i = 0; i < productSegments.length; i++) {
                                html += '| <span style="cursor:pointer;" class="bwHoverLink1" onclick="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'productSegment_Click\', \'' + productSegments[i] + '\');">' + productSegments[i] + '</span> ';
                            }
                            html += '|</span>';
                            html += '<br />';
                        }

                        html += '<hr />';
                        html += '<span id="productSubclassTopMenubar" style="padding-left:40px;font-size:12pt;"></span>';
                        html += '<br />';
                        html += '<hr />';
                        html += '<table>';
                        html += '   <tr>';
                        html += '       <td colspan="2">';
                        html += '           <span id="productBreadcrumbAndTitleMenubar">';
                        html += '           </span>';
                        html += '       </td>';
                        html += '   </tr>';
                        html += '   <tr>';
                        html += '       <td id="tdProductFilterSection" style="width:15%;vertical-align:top;">';
                        //html += '           FILTER SECTION';
                        html += '       </td>';
                        html += '       <td style="width:85%;vertical-align:top;">';
                        html += '           <span id="productsContentSections">';
                        //html += '               CONTENT SECTION';
                        html += '           </span>';
                        html += '       </td>';
                        html += '   </tr>';
                        html += '</table>';

                        // Render the html.
                        //$('#divPageContent3').append(html);  // $('#divBwAdvancedProductSearch1').html(html); // renderElementId
                        $('#' + renderElementId).append(html); // 4-4-2023

                        if (document.getElementById('productSubclassTopMenubar') && document.getElementById('productSubclassTopMenubar').innerHTML) {
                            document.getElementById('productSubclassTopMenubar').innerHTML = '';
                        }
                        if (document.getElementById('productBreadcrumbAndTitleMenubar') && document.getElementById('productBreadcrumbAndTitleMenubar').innerHTML) {
                            document.getElementById('productBreadcrumbAndTitleMenubar').innerHTML = '';
                        }

                        var basicSearchValue = $('#txtProdSrch').val();
                        $('#txtAdvancedProductSearch').val(basicSearchValue); // Carryover from the basic search form page.

                        //
                        // We always select the first product segment and subclass in the top menu bar. This just gives the user a better experince, because they see the "default landing page for the catalog".
                        //
                        //debugger;
                        thiz.options.latestSelectedProductSegment = thiz.options.productSegments[0];
                        thiz.renderSegmentTopMenuBar(thiz.options.productSegments[0]);
                        thiz.renderSubClassTopMenuBar(thiz.options.productSegments[0], '0'); // 0 means it will display the root node
                        thiz.renderBreadcrumbTopMenuBar(thiz.options.productSegments[0], thiz.options.productSubClasses[0]);
                        thiz.options.filters = null; // We need to reset the filters when the user navigates to a new subclass.
                        //debugger;
                        //thiz.renderFilterAndProductsSections_InventoryManagement(thiz.options.productSegments[0], thiz.options.productSubClasses[0]);
                        thiz.renderFilterAndProductsSections(thiz.options.productSegments[0], thiz.options.productSubClasses[0]);

                        $("#txtAdvancedProductSearch").autocomplete({
                            source: function (request, response) {
                                try {
                                    console.log('In bwAdvancedProductSearch.txtAdvancedProductSearch.autocomplete.source().');
                                    //ShowActivitySpinner();

                                    var searchTerm = request.term.trim().toLowerCase();

                                    // Now that we have a search term, go through the products and find the ones that match.
                                    var data = thiz.options.json;
                                    var searchResultsArray = [];
                                    for (var i = 0; i < data.length; i++) {
                                        var thisIsAMatch = false;
                                        if (data[i].ProductCode.toLowerCase().indexOf(searchTerm) > -1) {
                                            // First, look in the product code.
                                            thisIsAMatch = true;
                                        }
                                        if (thisIsAMatch == false) {
                                            // Now look in the product description.
                                            if (data[i].Description.toLowerCase().indexOf(searchTerm) > -1) {
                                                thisIsAMatch = true;
                                            }
                                        }
                                        if (thisIsAMatch == false) {
                                            // Now look in the extended description.
                                            var tmpExtendedDescription = data[i].ExtendedDescription.trim().toLowerCase();
                                            if (tmpExtendedDescription && tmpExtendedDescription.indexOf(searchTerm) > -1) {
                                                thisIsAMatch = true;
                                            }
                                        }
                                        if (thisIsAMatch == false) {
                                            // Now look in the ConsumerItem.
                                            var tmpConsumerItem = data[i].ConsumerItem.trim().toLowerCase();
                                            if (tmpConsumerItem && tmpConsumerItem.indexOf(searchTerm) > -1) {
                                                thisIsAMatch = true;
                                            }
                                        }
                                        if (thisIsAMatch == true) {
                                            var item = {
                                                ProductCode: data[i].ProductCode,
                                                ProductDescription: data[i].Description
                                            }
                                            searchResultsArray.push(item);
                                        }
                                    }

                                    // Sort alphabetically, and numerically. For instance "602" appears before "A00123".
                                    searchResultsArray = searchResultsArray.sort(function (a, b) {
                                        var nameA = a.ProductCode.toUpperCase();
                                        var nameB = b.ProductCode.toUpperCase();
                                        if (nameA < nameB) {
                                            return -1; //nameA comes first
                                        }
                                        if (nameA > nameB) {
                                            return 1; // nameB comes first
                                        }
                                        return 0;  // names must be equal
                                    });

                                    var searchResultsArray2 = [];
                                    for (var i = 0; i < searchResultsArray.length; i++) {
                                        searchResultsArray2.push(searchResultsArray[i].ProductCode + ' - ' + searchResultsArray[i].Description);
                                    }

                                    response(searchResultsArray2);

                                } catch (e) {
                                    //HideActivitySpinner();
                                    console.log('Exception in bwAdvancedProductSearch.txtAdvancedProductSearch.autocomplete.source(): ' + e.message + ', ' + e.stack);
                                    document.getElementById('bwAdvancedProductSearch_Error').innerHTML = 'Exception in bwAdvancedProductSearch.txtAdvancedProductSearch.autocomplete.source(): ' + e.message + ', ' + e.stack;
                                }
                            },
                            minLength: 1, // minLength specifies how many characters have to be typed before this gets invoked.
                            select: function (event, ui) {
                                try {
                                    console.log('In bwAdvancedProductSearch.txtAdvancedProductSearch.autocomplete.select().');

                                    var selectedValue = ui.item.value;
                                    var data = thiz.options.json;
                                    var product;
                                    for (var i = 0; i < data.length; i++) {
                                        if ((data[i].ProductCode + ' - ' + data[i].Description) == selectedValue) {
                                            product = data[i];
                                        }
                                    }
                                    if (product) {

                                        thiz.options.filters = []; // First we set the filters so the individual product is displayed.

                                        // Color
                                        var colorFilter = {
                                            filtersectionname: 'Color',
                                            filtertext: product.Color
                                        };
                                        thiz.options.filters.push(colorFilter);

                                        // Height
                                        var heightFilter = {
                                            filtersectionname: 'Height',
                                            filtertext: product.UnitHeight + ' ' + product.UnitHeightUOM
                                        };
                                        thiz.options.filters.push(heightFilter);

                                        // Length
                                        var lengthFilter = {
                                            filtersectionname: 'Length',
                                            filtertext: product.UnitLength + ' ' + product.UnitLengthUOM
                                        };
                                        thiz.options.filters.push(lengthFilter);

                                        // Printing
                                        var printingFilter = {
                                            filtersectionname: 'Printing',
                                            filtertext: product.PrintTypeDescription
                                        };
                                        thiz.options.filters.push(printingFilter);

                                        // Private Label
                                        var privateLabelFilterText;
                                        if (product.PrivateLabel == true) {
                                            privateLabelFilterText = 'YES';
                                        } else if (product.PrivateLabel == false) {
                                            privateLabelFilterText = 'NO';
                                        }
                                        if (privateLabelFilterText) {
                                            var privateLabelFilter = {
                                                filtersectionname: 'PrivateLabel',
                                                filtertext: privateLabelFilterText
                                            };
                                            thiz.options.filters.push(privateLabelFilter);
                                        }

                                        // Style
                                        var styleFilter = {
                                            filtersectionname: 'Style',
                                            filtertext: product.Style
                                        };
                                        thiz.options.filters.push(styleFilter);

                                        // Width
                                        var widthFilter = {
                                            filtersectionname: 'Width',
                                            filtertext: product.UnitWidth + ' ' + product.UnitWidthUOM
                                        };
                                        thiz.options.filters.push(widthFilter);

                                        //debugger;
                                        thiz.renderSegmentTopMenuBar(product.Segment);
                                        thiz.renderSubClassTopMenuBar(product.Segment, product.SubClassDescription);
                                        thiz.renderBreadcrumbTopMenuBar(product.Segment, product.SubClassDescription);

                                        thiz.options.latestSelectedProductSegment = product.Segment;
                                        thiz.options.latestSelectedProductSubClass = product.SubClassDescription;

                                        var highlightThisProductCode = selectedValue.split('-')[0].trim(); // If we get a value here, pass it on, so we can highlight those ones!!
                                        //thiz.renderFilterAndProductsSections_InventoryManagement(product.Segment, product.SubClassDescription, highlightThisProductCode); // Now render everything.
                                        thiz.renderFilterAndProductsSections(product.Segment, product.SubClassDescription, highlightThisProductCode); // Now render everything.

                                        document.getElementById('txtAdvancedProductSearch').style.color = 'red'; // When the search box has valid search text, it should be red.

                                    } else {
                                        // Error: Could not find product. This should never happen.
                                        console.log('Error in bwAdvancedProductSearch.txtAdvancedProductSearch.autocomplete.select():. Could not find product: ' + selectedValue);
                                        document.getElementById('bwAdvancedProductSearch_Error').innerHTML = 'Error in bwAdvancedProductSearch.txtAdvancedProductSearch.autocomplete.select():. Could not find product: ' + selectedValue;
                                    }
                                } catch (e) {
                                    //HideActivitySpinner();
                                    console.log('Exception in bwAdvancedProductSearch._create.txtAdvancedProductSearch.autocomplete.select(): ' + e.message + ', ' + e.stack);
                                    document.getElementById('bwAdvancedProductSearch_Error').innerHTML = 'Exception in bwAdvancedProductSearch.txtAdvancedProductSearch.autocomplete.select(): ' + e.message + ', ' + e.stack;
                                }
                            },
                            open: function () {
                                console.log('In bwAdvancedProductSearch.txtAdvancedProductSearch.autocomplete.open().');

                            },
                            close: function () {
                                try {
                                    //HideActivitySpinner();

                                    if (!thiz.options.searchBoxEvent_keyup) {
                                        // This makes sure we only attach this event handler one time only.
                                        var element = document.getElementById('txtAdvancedProductSearch');
                                        element.addEventListener("keyup", function searchBoxEvent_keyup() {
                                            console.log('In element.addEventListener.keyup().');

                                            // Need a global reference to this because to removeeventlistener, a reference to the function is always required.
                                            thiz.options.searchBoxEvent_keyup = searchBoxEvent_keyup;

                                            thiz.clearTheSearchBox(element);

                                        }, false);
                                    }
                                } catch (e) {
                                    //HideActivitySpinner();
                                    console.log('Exception in bwAdvancedProductSearch.txtAdvancedProductSearch.autocomplete.close(): ' + e.message + ', ' + e.stack);
                                    document.getElementById('bwAdvancedProductSearch_Error').innerHTML = 'Exception in bwAdvancedProductSearch.txtAdvancedProductSearch.autocomplete.close(): ' + e.message + ', ' + e.stack;
                                }
                            }
                        });

                        //debugger;
                        HideActivitySpinner();

                        //} catch (e) {
                        //    HideActivitySpinner();

                        //    console.log('Exception in renderConfigurationInventoryScreen.api/BundleItems(): ' + e.message + ', ' + e.stack);
                        //    displayAlertDialog('Exception in renderConfigurationInventoryScreen.api/BundleItems(): ' + e.message + ', ' + e.stack);
                        //    if (document.getElementById('bwAdvancedProductSearch_Error')) {
                        //        document.getElementById('bwAdvancedProductSearch_Error').innerHTML = 'Exception in renderConfigurationInventoryScreen.api/BundleItems():2: ' + e.message + ', ' + e.stack;
                        //    }
                        //}
                        //    },
                        //    error: function (data, errorCode, errorMessage) {
                        //        HideActivitySpinner();

                        //        console.log('Error getting data from the server (api/BundleItems). Try refreshing the page. Error details: ' + errorMessage + ', ' + data.responseText);
                        //        document.getElementById('bwAdvancedProductSearch_Error').innerHTML = 'Error getting data from the server (api/BundleItems). Try refreshing the page. Error details: ' + errorMessage + ', ' + data.responseText;
                        //    }
                        //});


                    } catch (e) {
                        HideActivitySpinner();

                        console.log('Exception in renderConfigurationInventoryScreen(): ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in renderConfigurationInventoryScreen(): ' + e.message + ', ' + e.stack);
                        if (document.getElementById('bwAdvancedProductSearch_Error')) {
                            document.getElementById('bwAdvancedProductSearch_Error').innerHTML = 'Exception in renderConfigurationInventoryScreen():2: ' + e.message + ', ' + e.stack;
                        }
                    }
                    //    },
                    //    error: function (data, errorCode, errorMessage) {
                    //        HideActivitySpinner();

                    //        console.log('Error getting data from the server. Probably because the server application variable containing the catalog data has not completed loading. It takes 10-20 seconds and this only happens when the application has been reset. operationUri: ' + operationUri + ' Error details: ' + errorMessage + ', ' + data.responseText);
                    //        $('#bwProductCatalog1').dialog('close'); // Since it didn't load, close the dialog.
                    //        document.getElementById('divFlashDialog_Content').innerHTML = 'The product catalog has not completed loading. Please try again in a few seconds.';
                    //        $('#divFlashDialog').dialog({
                    //            modal: true,
                    //            resizable: true,
                    //            closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                    //            dialogClass: "no-close", // No close button in the upper right corner.
                    //            hide: false, // This means when hiding just disappear with no effects.
                    //            height: 200,
                    //            width: 1200,
                    //            open: function () {
                    //                try {
                    //                    setTimeout(function () {
                    //                        $('#divFlashDialog').dialog('close');
                    //                    }, 4000);
                    //                } catch (e) {
                    //                    console.log('Exception in divFlashDialog.open(): ' + e.message + ', ' + e.stack);
                    //                }
                    //            }
                    //        });
                    //        $("#divFlashDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

                    //    }
                    //});
                }

            }

        } catch (e) {
            //HideActivitySpinner();

            console.log('Exception in renderConfigurationInventoryScreen(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in renderConfigurationInventoryScreen(): ' + e.message + ', ' + e.stack);
            if (document.getElementById('bwAdvancedProductSearch_Error')) {
                document.getElementById('bwAdvancedProductSearch_Error').innerHTML = 'Exception in renderConfigurationInventoryScreen(): ' + e.message + ', ' + e.stack;
            }
        }
    },



    reloadBundlesAndReRenderTheDialog: function () {
        try {
            // This is called when a bundle has an item added or deleted, so that it is immediately reflected in the "Advanced Search" dialog bundle column.
            console.log('In reloadBundlesAndReRenderTheDialog().');
            var thiz = this;

            // Now get the bundles for this customer.
            var operationUri = '/api/BundleItems?CustomerId=' + thiz.options.BWCustomer.CustomerIdentifier;
            $.ajax({
                url: operationUri,
                type: "GET",
                contentType: 'application/json',
                timeout: thiz.options.ajaxTimeout,
                success: function (bundles) {
                    try {

                        thiz.options.Bundles = bundles;
                        try {
                            //if (thiz.options.latestSelectedProductSegment) {
                            //debugger;
                            thiz.renderSubClassTopMenuBar(thiz.options.latestSelectedProductSegment, thiz.options.latestSelectedProductSubClass);
                            thiz.renderBreadcrumbTopMenuBar(thiz.options.latestSelectedProductSegment, thiz.options.latestSelectedProductSubClass);
                            thiz.renderFilterAndProductsSections(thiz.options.latestSelectedProductSegment, thiz.options.latestSelectedProductSubClass);
                            //}
                        } catch (e) {
                            // Do nothing. This catch is here in case the window is not displayed.
                        }

                    } catch (e) {
                        thiz.hideActivitySpinner();

                        console.log('Exception in reloadBundlesAndReRenderTheDialog.api/BundleItems(): ' + e.message + ', ' + e.stack);
                        //document.getElementById('bwAdvancedProductSearch_Error').innerHTML = 'Exception in reloadBundlesAndReRenderTheDialog.api/BundleItems():2: ' + e.message + ', ' + e.stack;
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    thiz.hideActivitySpinner();

                    console.log('Error getting data from the server (api/BundleItems). Try refreshing the page. Error details: ' + errorMessage + ', ' + data.responseText);
                    //document.getElementById('bwAdvancedProductSearch_Error').innerHTML = 'Error getting data from the server (api/BundleItems). Try refreshing the page. Error details: ' + errorMessage + ', ' + data.responseText;
                }
            });

        } catch (e) {
            thiz.hideActivitySpinner();

            console.log('Exception in reloadBundlesAndReRenderTheDialog(): ' + e.message + ', ' + e.stack);
            //document.getElementById('bwAdvancedProductSearch_Error').innerHTML = 'Exception in reloadBundlesAndReRenderTheDialog(): ' + e.message + ', ' + e.stack;
        }
    },
    productSegment_Click: function (productSegment) {
        try {
            console.log('In productSegment_Click(). productSegment: ' + productSegment);

            this.options.latestSelectedProductSegment = productSegment;
            this.options.latestSelectedProductSubClass = null;

            this.renderSegmentTopMenuBar(productSegment);
            this.renderSubClassTopMenuBar(productSegment, null);

            document.getElementById('productBreadcrumbAndTitleMenubar').innerHTML = '';
            document.getElementById('tdProductFilterSection').innerHTML = '';
            document.getElementById('productsContentSections').innerHTML = '';

        } catch (e) {
            console.log('Exception in productSegment_Click(): ' + e.message + ', ' + e.stack);
            document.getElementById('bwAdvancedProductSearch_Error').innerHTML = 'Exception in productSegment_Click(): ' + e.message + ', ' + e.stack;
        }
    },
    productSubClass_Click: function (productSegment, productSubClass) {
        try {
            console.log('In productSubClass_Click(). productSegment: ' + productSegment + ', productSubClass: ' + productSubClass);
            var thiz = this;
            ShowActivitySpinner();

            this.options.latestSelectedProductSegment = productSegment;
            this.options.latestSelectedProductSubClass = productSubClass;

            setTimeout(function () {
                thiz.clearTheSearchBox();

                document.getElementById('productBreadcrumbAndTitleMenubar').innerHTML = '';
                document.getElementById('tdProductFilterSection').innerHTML = '';
                document.getElementById('productsContentSections').innerHTML = '';

                thiz.renderSubClassTopMenuBar(productSegment, productSubClass);

                thiz.renderBreadcrumbTopMenuBar(productSegment, productSubClass);

                thiz.options.filters = null; // We need to reset the filters when the user navigates to a new subclass.
                thiz.renderFilterAndProductsSections(productSegment, productSubClass);
            }, 0);

        } catch (e) {
            HideActivitySpinner();
            console.log('Exception in productSubClass_Click(): ' + e.message + ', ' + e.stack);
            document.getElementById('bwAdvancedProductSearch_Error').innerHTML = 'Exception in productSubClass_Click(): ' + e.message + ', ' + e.stack;
        }
    },

    renderFilterAndProductsSections: function (productSegment, productSubClass, highlightThisProductCode) {
        try {
            console.log('In renderFilterAndProductsSections(). productSegment: ' + productSegment + ', productSubClass: ' + productSubClass + ', highlightThisProductCode: ' + highlightThisProductCode);

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            document.getElementById('productsContentSections').innerHTML = '';

            // Get our pre-filter product list for product segment and subclass.
            var data = this.options.json;

            //debugger; // 1-19-2022 THIS IS WHERE WE HAVE OUR DATA FROM THE DB.

            //if (!(data && data.length && (data.length > 0))) {
            //    alert('xcx12312412343 no data');
            //} else {
            //    alert('xcx213123423 sata: ' + JSON.stringify(data));
            //}
            //if (productSubClass == 'NA') {
            //    productSubClass = ''; // This solves our NO SUBCLASS issue. // 4-1-2022
            //}


            var products = [];
            for (var i = 0; i < data.length; i++) {
                if (productSegment && data[i].Segment) {
                    if (productSegment.trim() == data[i].Segment.trim()) {



                        if (((productSubClass == 'NA') && (data[i].Subclass == '')) || (productSubClass.trim() == data[i].Subclass.trim())) {

                            //}
                            //debugger;
                            //if (productSubClass.trim() == data[i].Subclass.trim()) {
                            var bundles = this.options.Bundles;

                            var product = {
                                ProductId: data[i].bwInventoryItemId, // <<< Not sure why I ended up calling this data item different things... :/
                                ProductCode: data[i].ProductCode,
                                Description: data[i].Description,
                                Segment: data[i].Segment,
                                Subclass: data[i].Subclass,
                                Style: data[i].Style,
                                Color: data[i].Color,
                                UnitWidthUOM: data[i].UnitWidthUOM,
                                UnitHeightUOM: data[i].UnitHeightUOM,
                                UnitLengthUOM: data[i].UnitLengthUOM,
                                OrderUOM: data[i].OrderUOM,
                                UnitWidth: data[i].UnitWidth,
                                UnitHeight: data[i].UnitHeight,
                                UnitLength: data[i].UnitLength,
                                MinOrderQty: data[i].MinOrderQty,
                                PrintTypeCode: data[i].PrintTypeCode,
                                PrintTypeDescription: data[i].PrintTypeDescription,
                                ExtendedDescription: data[i].ExtendedDescription,
                                PrivateLabel: data[i].PrivateLabel,
                                ConsumerItem: data[i].ConsumerItem,
                                ERP: data[i].ERP,
                                BundleId: data[i].BundleId,
                                BundleItemId: data[i].BundleItemId
                            }
                            products.push(product);
                        }
                    }
                } else {
                    var product = {
                        ProductId: data[i].bwInventoryItemId, // <<< Not sure why I ended up calling this data item different things... :/
                        ProductCode: data[i].ProductCode,
                        Description: data[i].Description,
                        Segment: 'NA',
                        Subclass: 'NA',
                        Style: data[i].Style,
                        Color: data[i].Color,
                        UnitWidthUOM: data[i].UnitWidthUOM,
                        UnitHeightUOM: data[i].UnitHeightUOM,
                        UnitLengthUOM: data[i].UnitLengthUOM,
                        OrderUOM: data[i].OrderUOM,
                        UnitWidth: data[i].UnitWidth,
                        UnitHeight: data[i].UnitHeight,
                        UnitLength: data[i].UnitLength,
                        MinOrderQty: data[i].MinOrderQty,
                        PrintTypeCode: data[i].PrintTypeCode,
                        PrintTypeDescription: data[i].PrintTypeDescription,
                        ExtendedDescription: data[i].ExtendedDescription,
                        PrivateLabel: data[i].PrivateLabel,
                        ConsumerItem: data[i].ConsumerItem,
                        ERP: data[i].ERP,
                        BundleId: data[i].BundleId,
                        BundleItemId: data[i].BundleItemId
                    }
                    products.push(product);
                }
            }

            if (this.options.filters && this.options.filters.length > 0) {
                console.log('Filters to apply to this display: ' + JSON.stringify(this.options.filters));
                products = this.applyFilters(products);
            }

            if (products.length == 0) {

                console.log('Error: No products loaded. WHY ARE WE HERE?');
                //alert('Error: No products loaded. WHY ARE WE HERE?');
                document.getElementById('bwAdvancedProductSearch_Error').innerHTML = 'No products loaded. Click the "Add inventory item" button to add inventory items.';
            }

            var html = '';
            html += '           <span class="bwHoverLink1" style="cursor:pointer;" onclick="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'clearFilters\', \'' + productSegment + '\', \'' + productSubClass + '\');">CLEAR FILTERS</span>';
            html += '           <br />';
            // FILTER SECTION
            html += '           <div id="divProductFilterSection_Color" style="border:1px solid grey;padding: 10px 10px 10px 10px;cursor:default;">';
            html += '           </div>';
            html += '           <div id="divProductFilterSection_Height" style="border:1px solid grey;padding: 10px 10px 10px 10px;cursor:default;">';
            html += '           </div>';
            html += '           <div id="divProductFilterSection_Length" style="border:1px solid grey;padding: 10px 10px 10px 10px;cursor:default;">';
            html += '           </div>';
            html += '           <div id="divProductFilterSection_Print" style="border:1px solid grey;padding: 10px 10px 10px 10px;cursor:default;">';
            html += '           </div>';
            html += '           <div id="divProductFilterSection_PrivateLabel" style="border:1px solid grey;padding: 10px 10px 10px 10px;cursor:default;">';
            html += '           </div>';
            html += '           <div id="divProductFilterSection_Style" style="border:1px solid grey;padding: 10px 10px 10px 10px;cursor:default;">';
            html += '           </div>';
            html += '           <div id="divProductFilterSection_Width" style="border:1px solid grey;padding: 10px 10px 10px 10px;cursor:default;">';
            html += '           </div>';

            document.getElementById('tdProductFilterSection').innerHTML = html;

            //
            // NOW WE HAVE TO RENDER THE CUSTOM FILTER SECTIONS.
            //
            // Print filter section.
            var html = '';
            var uoms = [];
            for (var i = 0; i < products.length; i++) {
                if (products[i].PrintTypeCode) {
                    if (products[i].PrintTypeDescription) {
                        if (!(uoms.indexOf(products[i].PrintTypeDescription) > -1)) {
                            uoms.push(products[i].PrintTypeDescription);
                        }
                    } else {
                        // There was a PrintTypeCode but no PrintTypeDescription. 
                        if (!(uoms.indexOf(products[i].PrintTypeCode) > -1)) {
                            uoms.push(products[i].PrintTypeCode);
                        }
                    }
                }
            }
            if (uoms.length > 0) {
                html += '               <span style="font-size:12pt;font-weight:bold;">Printing</span>';
                html += '               <br />';
                html += '               <br />';
                uoms = uoms.sort();
                for (var i = 0; i < uoms.length; i++) {
                    var selected = '';
                    if (this.options.filters) {
                        for (var j = 0; j < this.options.filters.length; j++) {
                            if (this.options.filters[j].filtersectionname == 'Printing') {
                                if (this.options.filters[j].filtertext == uoms[i]) {
                                    selected = ' checked ';
                                    break;
                                }
                            }
                        }
                    }
                    html += '               <span style="white-space:nowrap;"><input class="bwFilterCheckbox" filtersectionname="Printing" filtertext="' + uoms[i] + '" type="checkbox" ' + selected + ' style="cursor:pointer;" onchange="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'filter_OnChange\', \'Printing\', \'' + uoms[i] + '\', \'' + productSegment + '\', \'' + productSubClass + '\', \'' + highlightThisProductCode + '\');" />&nbsp;&nbsp;' + uoms[i] + '</span>';
                    html += '               <br />';
                }
                html += '               <br />';
            }
            document.getElementById('divProductFilterSection_Print').innerHTML = html;

            //// Private Label filter section.
            //var html = '';
            //var plbls = [];
            //for (var i = 0; i < products.length; i++) {
            //    if (products[i].Style) {
            //        if (!(styles.indexOf(products[i].Style) > -1)) {
            //            plbls.push(products[i].Style);
            //        }
            //    }
            //}
            //html += '               <span style="font-size:12pt;font-weight:bold;">Manufacturer Labelxcx1</span>';
            //html += '               <br />';
            //html += '               <br />';
            //var selected = '';
            //var filtertext = 'YES';
            //if (this.options.filters) {
            //    for (var j = 0; j < this.options.filters.length; j++) {
            //        if (this.options.filters[j].filtersectionname == 'PrivateLabel') {
            //            if (this.options.filters[j].filtertext == 'YES') {
            //                selected = ' checked ';
            //                filtertext = 'YES';
            //                break;
            //            }
            //        }
            //    }
            //}
            //html += '               <span style="white-space:nowrap;"><input class="bwFilterCheckbox" filtersectionname="PrivateLabel" filtertext="' + filtertext + '" type="checkbox" ' + selected + ' style="cursor:pointer;" onchange="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'filter_OnChange\', \'PrivateLabel\', \'' + filtertext + '\', \'' + productSegment + '\', \'' + productSubClass + '\', \'' + highlightThisProductCode + '\');" />&nbsp;&nbsp;' + 'YES' + '</span>';
            //html += '               <br />';
            //html += '               <br />';
            //document.getElementById('divProductFilterSection_PrivateLabel').innerHTML = html;

            // Style filter section.
            var html = '';
            var styles = [];
            for (var i = 0; i < products.length; i++) {
                if (products[i].Style) {
                    if (!(styles.indexOf(products[i].Style) > -1)) {
                        styles.push(products[i].Style);
                    }
                }
            }
            if (styles.length > 0) {
                html += '               <span style="font-size:12pt;font-weight:bold;">Style</span>';
                html += '               <br />';
                html += '               <br />';
                styles = styles.sort();
                for (var i = 0; i < styles.length; i++) {
                    var selected = '';
                    if (this.options.filters) {
                        for (var j = 0; j < this.options.filters.length; j++) {
                            if (this.options.filters[j].filtersectionname == 'Style') {
                                if (this.options.filters[j].filtertext == styles[i]) {
                                    selected = ' checked ';
                                    break;
                                }
                            }
                        }
                    }
                    html += '               <span style="white-space:nowrap;"><input class="bwFilterCheckbox" filtersectionname="Style" filtertext="' + styles[i] + '" type="checkbox" ' + selected + ' style="cursor:pointer;" onchange="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'filter_OnChange\', \'Style\', \'' + styles[i] + '\', \'' + productSegment + '\', \'' + productSubClass + '\', \'' + highlightThisProductCode + '\');" />&nbsp;&nbsp;' + styles[i] + '</span>';
                    html += '               <br />';
                }
                html += '               <br />';
            }
            document.getElementById('divProductFilterSection_Style').innerHTML = html;

            // Color filter section.
            var html = '';
            var colors = [];
            for (var i = 0; i < products.length; i++) {
                if (products[i].Color) {
                    if (!(colors.indexOf(products[i].Color) > -1)) {
                        colors.push(products[i].Color);
                    }
                }
            }
            if (colors.length > 0) {
                html += '               <span style="font-size:12pt;font-weight:bold;">Color</span>';
                html += '               <br />';
                html += '               <br />';
                colors = colors.sort();
                for (var i = 0; i < colors.length; i++) {
                    var selected = '';
                    if (this.options.filters) {
                        for (var j = 0; j < this.options.filters.length; j++) {
                            if (this.options.filters[j].filtersectionname == 'Color') {
                                if (this.options.filters[j].filtertext == colors[i]) {
                                    selected = ' checked ';
                                    break;
                                }
                            }
                        }
                    }
                    html += '               <span style="white-space:nowrap;"><input class="bwFilterCheckbox" filtersectionname="Color" filtertext="' + colors[i] + '" type="checkbox" ' + selected + ' style="cursor:pointer;" onchange="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'filter_OnChange\', \'Color\', \'' + colors[i] + '\', \'' + productSegment + '\', \'' + productSubClass + '\', \'' + highlightThisProductCode + '\');" />&nbsp;&nbsp;' + colors[i] + '</span>';
                    html += '               <br />';
                }
                html += '               <br />';
            }
            document.getElementById('divProductFilterSection_Color').innerHTML = html;

            // UnitWidthUOM filter section.
            var html = '';
            var uoms = [];
            for (var i = 0; i < products.length; i++) {
                if (products[i].UnitWidthUOM) {
                    if (!(uoms.indexOf(products[i].UnitWidth + ' ' + products[i].UnitWidthUOM) > -1)) {
                        uoms.push(products[i].UnitWidth + ' ' + products[i].UnitWidthUOM);
                    }
                }
            }
            if (uoms.length > 0) {
                html += '               <span style="font-size:12pt;font-weight:bold;">Width</span>';
                html += '               <br />';
                html += '               <br />';
                uoms = uoms.sort(function (a, b) { // Sort alpha-numerically.?
                    try {
                        var a2 = Number(a.split(' ')[0]);
                        var b2 = Number(b.split(' ')[0]);
                        return a2 - b2
                    } catch (e) {
                        document.getElementById('bwAdvancedProductSearch_Error').innerHTML = 'Exception in bwAdvancedProductSearch.renderFilterAndProductsSections.sort.Width: ' + e.message + ', ' + e.stack;
                    }
                });
                for (var i = 0; i < uoms.length; i++) {

                    var selected = '';
                    if (this.options.filters) {
                        for (var j = 0; j < this.options.filters.length; j++) {
                            if (this.options.filters[j].filtersectionname == 'Width') {
                                if (this.options.filters[j].filtertext == uoms[i]) {
                                    selected = ' checked ';
                                    break;
                                }
                            }
                        }
                    }
                    html += '               <span style="white-space:nowrap;"><input class="bwFilterCheckbox" filtersectionname="Width" filtertext="' + uoms[i] + '" type="checkbox" ' + selected + ' style="cursor:pointer;" onchange="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'filter_OnChange\', \'Width\', \'' + uoms[i] + '\', \'' + productSegment + '\', \'' + productSubClass + '\', \'' + highlightThisProductCode + '\');" />&nbsp;&nbsp;' + uoms[i] + '</span>';
                    html += '               <br />';
                }
                html += '               <br />';
            }
            document.getElementById('divProductFilterSection_Width').innerHTML = html;

            // UnitHeightUOM filter section.
            var html = '';
            var uoms = [];
            for (var i = 0; i < products.length; i++) {
                if (products[i].UnitHeightUOM) {
                    if (!(uoms.indexOf(products[i].UnitHeight + ' ' + products[i].UnitHeightUOM) > -1)) {
                        uoms.push(products[i].UnitHeight + ' ' + products[i].UnitHeightUOM);
                    }
                }
            }
            if (uoms.length > 0) {
                html += '               <span style="font-size:12pt;font-weight:bold;">Height</span>';
                html += '               <br />';
                html += '               <br />';
                uoms = uoms.sort(function (a, b) { // Sort alpha-numerically.?
                    try {
                        var a2 = Number(a.split(' ')[0]);
                        var b2 = Number(b.split(' ')[0]);
                        return a2 - b2
                    } catch (e) {
                        document.getElementById('bwAdvancedProductSearch_Error').innerHTML = 'Exception in bwAdvancedProductSearch.renderFilterAndProductsSections.sort.Height: ' + e.message + ', ' + e.stack;
                    }
                });
                for (var i = 0; i < uoms.length; i++) {

                    var selected = '';
                    if (this.options.filters) {
                        for (var j = 0; j < this.options.filters.length; j++) {
                            if (this.options.filters[j].filtersectionname == 'Height') {
                                if (this.options.filters[j].filtertext == uoms[i]) {
                                    selected = ' checked ';
                                    break;
                                }
                            }
                        }
                    }
                    html += '               <span style="white-space:nowrap;"><input class="bwFilterCheckbox" filtersectionname="Height" filtertext="' + uoms[i] + '" type="checkbox" ' + selected + ' style="cursor:pointer;" onchange="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'filter_OnChange\', \'Height\', \'' + uoms[i] + '\', \'' + productSegment + '\', \'' + productSubClass + '\', \'' + highlightThisProductCode + '\');" />&nbsp;&nbsp;' + uoms[i] + '</span>';
                    html += '               <br />';
                }
                html += '               <br />';
            }
            document.getElementById('divProductFilterSection_Height').innerHTML = html;

            // UnitLengthUOM filter section.
            var html = '';
            var uoms = [];
            for (var i = 0; i < products.length; i++) {
                if (products[i].UnitLengthUOM) {
                    if (!(uoms.indexOf(products[i].UnitLength + ' ' + products[i].UnitLengthUOM) > -1)) {
                        uoms.push(products[i].UnitLength + ' ' + products[i].UnitLengthUOM);
                    }
                }
            }
            if (uoms.length > 0) {
                html += '               <span style="font-size:12pt;font-weight:bold;">Length</span>';
                html += '               <br />';
                html += '               <br />';
                uoms = uoms.sort(function (a, b) { // Sort alpha-numerically.?
                    try {
                        var a2 = Number(a.split(' ')[0]);
                        var b2 = Number(b.split(' ')[0]);
                        return a2 - b2
                    } catch (e) {
                        document.getElementById('bwAdvancedProductSearch_Error').innerHTML = 'Exception in bwAdvancedProductSearch.renderFilterAndProductsSections.sort.Length: ' + e.message + ', ' + e.stack;
                    }
                });
                for (var i = 0; i < uoms.length; i++) {

                    var selected = '';
                    if (this.options.filters) {
                        for (var j = 0; j < this.options.filters.length; j++) {
                            if (this.options.filters[j].filtersectionname == 'Length') {
                                if (this.options.filters[j].filtertext == uoms[i]) {
                                    selected = ' checked ';
                                    break;
                                }
                            }
                        }
                    }
                    html += '               <span style="white-space:nowrap;"><input class="bwFilterCheckbox" filtersectionname="Length" filtertext="' + uoms[i] + '" type="checkbox" ' + selected + ' style="cursor:pointer;" onchange="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'filter_OnChange\', \'Length\', \'' + uoms[i] + '\', \'' + productSegment + '\', \'' + productSubClass + '\', \'' + highlightThisProductCode + '\');" />&nbsp;&nbsp;' + uoms[i] + '</span>';
                    html += '               <br />';
                }
                html += '               <br />';
            }
            document.getElementById('divProductFilterSection_Length').innerHTML = html;

            //
            // LIST ALL OF THE PRODUCTS. 
            //
            document.getElementById('productsContentSections').innerHTML = '';
            var html = '';
            html += '<div id="divFilteredProductsListInformationSummaryHeader"></div>';

            // The "Add All Filtered Products" button.
            if (this.options.filters && this.options.filters.length > 0 && products.length > 1) { // We only want to display when there is at least 1 filter selected, and more than 1 product is being displayed.
                var buttonText = '';
                buttonText += 'ADD ALL';
                for (var i = 0; i < this.options.filters.length; i++) {
                    buttonText += ' > ';
                    buttonText += this.options.filters[i].filtersectionname;
                    buttonText += ': ';
                    buttonText += this.options.filters[i].filtertext;
                }
                html += '<div id="divAddAllFilteredProducts" style="float:right;">';
                html += '   <br />';
                var _filters = encodeURI(JSON.stringify(this.options.filters)).replace(/'/g, "%27"); // The replace encodes single quotes. For some reason encodeURI may not do single quotes??
                var _products = encodeURI(JSON.stringify(products)).replace(/'/g, "%27"); // The replace encodes single quotes. For some reason encodeURI may not do single quotes??
                html += '   <span style="white-space:nowrap;" type="text" class="button-blue" onclick="$(\'.bwDistributorDiscounting\').bwDistributorDiscounting(\'addAllFilteredProducts\', \'' + productSegment + '\', \'' + productSubClass + '\', \'' + _filters + '\', \'' + _products + '\');" >' + buttonText + '</span>';
                html += '</div>';
            }

            html += '<table class="dataGridTable">';
            html += '   <tr class="headerRow">';
            html += '       <td>';
            html += '           Product Codexcx1';
            html += '       </td>';
            html += '       <td>';
            html += '           Product Description';
            html += '       </td>';
            html += '       <td>';
            html += '           Extended Description';
            html += '       </td>';
            //if (this.options.SearchingForModule == 'Distributor') { // Bundling is only displayed for the Distributor module.
            //    html += '   <td>';
            //    html += 'Bundle';
            //    html += '   </td>';
            //}
            html += '       <td>';
            html += '           Style';
            html += '       </td>';
            html += '       <td>';
            html += '           Color';
            html += '       </td>';
            html += '       <td>';
            html += '           Width';
            html += '       </td>';
            //html += '   <td>';
            //html += 'Height';
            //html += '   </td>';
            //html += '   <td>';
            //html += 'Length';
            //html += '   </td>';
            //html += '   <td>';
            //html += 'Minimum Order';
            //html += '   </td>';
            //html += '   <td>';
            //html += 'Print Type';
            //html += '   </td>';
            html += '       <td>';
            html += '           Item #';
            html += '       </td>';
            //html += '       <td>';
            //html += '           Manufacturer Label';
            //html += '       </td>';
            html += '       <td>';
            html += '           Image';
            html += '       </td>';
            html += '       <td>';
            html += '';
            html += '       </td>';
            html += '   </tr>';

            var thisProductDescription = '';
            for (var i = 0; i < products.length; i++) {
                if (highlightThisProductCode && (highlightThisProductCode == products[i].ProductCode)) {
                    thisProductDescription = products[i].Description;
                }
            }


            //debugger; // does this work? todd do we need this? Is it obsolete?
            var sessionId = $('#SessionId').val();
            if (!sessionId) {
                console.log('In renderFilterAndProductsSections(). Invalid sessionId: ' + sessionId);
                //var error1 = new Error('Error in renderFilterAndProductsSections(). Invalid sessionId: ' + sessionId);
                //document.getElementById('bwAdvancedProductSearch_Error').innerHTML = error1.message + ', ' + error1.stack;
            }

            var productsImageFetchingInformation = [];
            var alternatingRow = 'light'; // Use this to color the rows.
            for (var i = 0; i < products.length; i++) {

                if (alternatingRow == 'light') {
                    html += '  <tr class="alternatingRowLight" style="cursor:pointer;" >';
                    alternatingRow = 'dark';
                } else {
                    html += '  <tr class="alternatingRowDark" style="cursor:pointer;" >'; //onclick="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'btnEdit_OnClick\', \'' + products[i].ProductId + '\');" >';
                    alternatingRow = 'light';
                }

                html += '   <td style="white-space:nowrap;"  onclick="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'btnEdit_OnClick\', \'' + products[i].ProductId + '\');" >';
                var makeThisOneRed = false;
                // If there is content in the product search box, then make sure we identify and highlight the selected text in this product row!!! Maybe highlight in yellow highlighter!!!!
                if (highlightThisProductCode && (highlightThisProductCode == products[i].ProductCode)) {
                    html += '<span style="color:red;font-weight:bold;">' + products[i].ProductCode + '</span>';
                    makeThisOneRed = true;
                    thisProductDescription = products[i].Description;
                } else {
                    html += products[i].ProductCode;
                }
                html += '   </td>';
                html += '   <td style="white-space:nowrap;"  onclick="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'btnEdit_OnClick\', \'' + products[i].ProductId + '\');" >';


                // If there is content in the product search box, then make sure we identify and highlight the selected text in this product row!!! Maybe highlight in yellow highlighter!!!!
                if (thisProductDescription && (thisProductDescription == products[i].Description)) {
                    html += '<span style="color:black;font-weight:bold;">' + products[i].Description + '</span>';
                } else {
                    html += products[i].Description;
                }
                html += '   </td>';
                html += '   <td  onclick="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'btnEdit_OnClick\', \'' + products[i].ProductId + '\');" >';
                html += products[i].ExtendedDescription;
                html += '   </td>';

                //if (this.options.SearchingForModule == 'Distributor') { // Bundling is only displayed for the Distributor module.
                //    html += '   <td>';

                //    // This determines if this product belongs to a bundle.
                //    var bundleId, bundleItemId, bundleDescription;
                //    var thisProductIsInABundle = false;
                //    for (var b = 0; b < this.options.Bundles.length; b++) {
                //        if (this.options.Bundles[b].ProductId == products[i].ProductId) {
                //            //debugger;
                //            thisProductIsInABundle = true;
                //            bundleId = this.options.Bundles[b].BundleId;
                //            bundleItemId = this.options.Bundles[b].BundleItemId;
                //            bundleDescription = this.options.Bundles[b].BundleDescription;
                //            break;
                //        }
                //    }
                //    if (thisProductIsInABundle == true) {
                //        // If we get here, the product belongs to a bundle. Only show the "View" link, not the "Add" link, because a product can only belong to 1 bundle at a time.
                //        //html += '       <span title="Click here to add this product to a Bundle." id="spanAdvancedSearchProductBundleLink" style="cursor:pointer;text-decoration:underline;" onclick="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'addProductToBundle\', \'' + products[i].ProductId + '\', \'' + products[i].Description.replace(/["']/g, "") + '\');" onmouseover="" onmouseout="" >';
                //        //html += '           Add';
                //        //html += '       </span>';
                //        //html += ' / ';
                //        html += '       <span title="This product belongs to bundle \'' + bundleDescription + '\'. Click here to view the Bundle." id="spanAdvancedSearchProductBundleLink" style="cursor:pointer;text-decoration:underline;color:tomato;" onclick="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'viewBundleForProduct\', \'' + products[i].ProductId + '\', \'' + bundleId + '\', \'' + bundleItemId + '\');" onmouseover="" onmouseout="" >';
                //        html += '           View';
                //        html += '       </span>';
                //    } else {
                //        if (products[i].Description) {
                //            html += '       <span title="Click here to add this product to a Bundle." id="spanAdvancedSearchProductBundleLink" style="cursor:pointer;text-decoration:underline;" onclick="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'addProductToBundle\', \'' + products[i].ProductId + '\', \'' + products[i].ProductCode + '\', \'' + products[i].Description.replace(/["']/g, "") + '\');" onmouseover="" onmouseout="" >';
                //        } else {
                //            html += '       <span title="Click here to add this product to a Bundle." id="spanAdvancedSearchProductBundleLink" style="cursor:pointer;text-decoration:underline;" onclick="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'addProductToBundle\', \'' + products[i].ProductId + '\', \'' + products[i].ProductCode + '\', \'' + '' + '\');" onmouseover="" onmouseout="" >';
                //        }

                //        html += '           Add';
                //        html += '       </span>';
                //        html += ' / ';
                //        html += '       <span title="Click here to view and manage all of your Bundles." id="spanAdvancedSearchProductBundleLink" style="cursor:pointer;text-decoration:underline;" onclick="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'viewBundleForProduct\', \'' + products[i].ProductId + '\', \'' + bundleId + '\', \'' + bundleItemId + '\');" onmouseover="" onmouseout="" >';
                //        html += '           View';
                //        html += '       </span>';
                //    }

                //    html += '   </td>';
                //}


                html += '   <td  onclick="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'btnEdit_OnClick\', \'' + products[i].ProductId + '\');" >';
                if (products[i].Style) {
                    html += products[i].Style;
                }
                html += '   </td>';
                html += '   <td  onclick="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'btnEdit_OnClick\', \'' + products[i].ProductId + '\');" >';
                if (products[i].Color) {
                    html += products[i].Color;
                }
                html += '   </td>';
                html += '   <td  onclick="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'btnEdit_OnClick\', \'' + products[i].ProductId + '\');" >';
                if (products[i].UnitWidth && products[i].UnitWidthUOM) {
                    html += products[i].UnitWidth + ' ' + products[i].UnitWidthUOM;
                }
                html += '   </td>';
                //html += '   <td >';
                //html += products[i].UnitHeight + ' ' + products[i].UnitHeightUOM;
                //html += '   </td>';
                //html += '   <td >';
                //html += products[i].UnitLength + ' ' + products[i].UnitLengthUOM;
                //html += '   </td>';
                //html += '   <td >';
                //html += products[i].MinOrderQty + ' ' + products[i].OrderUOM;
                //html += '   </td>';
                //html += '   <td >';
                //html += products[i].PrintTypeDescription + ' (' + products[i].PrintTypeCode + ')';
                //html += '   </td>';
                html += '   <td  onclick="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'btnEdit_OnClick\', \'' + products[i].ProductId + '\');" >';
                if (products[i].ConsumerItem) {
                    html += products[i].ConsumerItem;
                }
                html += '   </td>';
                //html += '   <td>';
                //if (products[i].PrivateLabel == true) {
                //    html += 'YES';
                //} else {
                //    html += 'NO';
                //}
                //html += '   </td>';

               


                html += '   <td style="cursor:pointer;"  onclick="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'btnEdit_OnClick\', \'' + products[i].ProductId + '\');" >';


                //var preventCachingGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                //    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                //    return v.toString(16);
                //});

                //var imagePath;

                //var activeStateIdentifier = JSON.parse($('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier'));

                //if (activeStateIdentifier.status != 'SUCCESS') {

                //    imagePath = '[No image. Unauthorized. xcx213124-34556-555-99]';

                //} else {

                //    imagePath = this.options.operationUriPrefix + '_files/' + workflowAppId + '/inventoryimages/' + products[i].ProductId + '/' + 'inventoryimage.png?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier;

                //}







                //html += '<img xcx="xcx234534578" id="orgImage_' + i + '" src="' + imagePath + '" style="height:120px;display:block;margin-left:auto;margin-right:auto;cursor:pointer !important;" alt="" onclick="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'btnEdit_OnClick\', \'' + products[i].ProductId + '\');">';

                html += '<img xcx="xcx234534578" id="orgImage_' + i + '" src="images/noimageavailable.png" style="height:120px;display:block;margin-left:auto;margin-right:auto;cursor:pointer !important;" alt="" onclick="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'btnEdit_OnClick\', \'' + products[i].ProductId + '\');">';

                // Use this to retrieve the images after the fact, farther below in this code.
                var productImageFetchingInformation = {
                    imageId: 'orgImage_' + i,
                    ProductId: products[i].ProductId
                };
                productsImageFetchingInformation.push(productImageFetchingInformation);


                html += '   </td>';

                html += '</tr>';


            }
            html += '</table>';
            document.getElementById('productsContentSections').innerHTML = html;

            var html = '';
            html += '<span style="">DISPLAYING ' + products.length + ' OF ' + this.options.json.length + ' PRODUCTS.</span>';
            document.getElementById('divFilteredProductsListInformationSummaryHeader').innerHTML = html;

            HideActivitySpinner();





            //
            // Render the custom product images
            //
            for (var i = 0; i < productsImageFetchingInformation.length; i++) {
                if (productsImageFetchingInformation[i].ProductId) {





                    var imagePath; 

                    var preventCachingGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                    });

                    var activeStateIdentifier = JSON.parse($('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier'));

                    if (activeStateIdentifier.status != 'SUCCESS') {

                        imagePath = '[No image. Unauthorized. xcx213124-34556-55]';

                    } else {

                        imagePath = this.options.operationUriPrefix + '_files/' + workflowAppId + '/inventoryimages/' + productsImageFetchingInformation[i].ProductId + '/' + 'inventoryimage.png?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier;
                    }

                    // <img id="divUploadANewSmallCircleImageDialogContentImage" style="width:400px;float:left;padding-right:20px;" src="https://shareandcollaborate.com/_files/0b302302-4401-44c7-8793-29fb4d630232/inventoryimages/de89bc0d-ab3f-4b65-9f16-61cf87ea88c7/inventoryimage.png?v=8c342dfb-d764-47f8-beb8-abc0525b2d6b&amp;ActiveStateIdentifier=5de64361-c8e2-49b9-861b-d1d32981e456">



                    var lookForProductImage = function (imagePath, i) {
                        return new Promise(function (resolve, reject) {
                            $.get(imagePath).done(function () {
                                var img = new Image();
                                img.src = imagePath;
                                img.onload = function (e) {
                                    try {
                                        document.getElementById(productsImageFetchingInformation[i].imageId).src = imagePath;
                                        resolve();
                                    } catch (e) {
                                        // The code gets here if the user switches pages quickly.
                                        console.log('Exception in renderFilterAndProductsSections().img.onload(). The code gets here if the user switches pages quickly: ' + e.message + ', ' + e.stack);
                                        //alert('Exception in renderParticipantsEditor().img.onload(): ' + e.message + ', ' + e.stack);
                                        reject();
                                    }
                                }
                            }).fail(function () {
                                // do nothing, it just didn't find an image.
                                resolve();
                            });
                        });
                    }
                    lookForProductImage(imagePath, i);
                }
            }








        } catch (e) {
            HideActivitySpinner();

            console.log('Exception in renderFilterAndProductsSections(): ' + e.message + ', ' + e.stack);

            if (document.getElementById('bwAdvancedProductSearch_Error') && document.getElementById('bwAdvancedProductSearch_Error').innerHTML) {
                document.getElementById('bwAdvancedProductSearch_Error').innerHTML = 'Exception in renderFilterAndProductsSections(): ' + e.message + ', ' + e.stack;
            }
        }
    },

    renderFilterAndProductsSections_InventoryManagement: function (productSegment, productSubClass, highlightThisProductCode) {
        try {
            console.log('In renderFilterAndProductsSections_InventoryManagement(). productSegment: ' + productSegment + ', productSubClass: ' + productSubClass + ', highlightThisProductCode: ' + highlightThisProductCode);

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            document.getElementById('productsContentSections').innerHTML = '';

            // Get our pre-filter product list for product segment and subclass.
            var data = this.options.json;

            debugger; // 1-19-2022 THIS IS WHERE WE HAVE OUR DATA FROM THE DB.

            var products = [];
            for (var i = 0; i < data.length; i++) {
                if (data[i].Segment) {
                    if (productSegment.trim() == data[i].Segment.trim()) {
                        if (productSubClass && (productSubClass.trim() == data[i].Subclass.trim())) {
                            var bundles = this.options.Bundles;

                            var product = {
                                ProductId: data[i].ProductId,
                                ProductCode: data[i].ProductCode,
                                Description: data[i].Description,
                                Segment: data[i].Segment,
                                Subclass: data[i].Subclass,
                                Style: data[i].Style,
                                Color: data[i].Color,
                                UnitWidthUOM: data[i].UnitWidthUOM,
                                UnitHeightUOM: data[i].UnitHeightUOM,
                                UnitLengthUOM: data[i].UnitLengthUOM,
                                OrderUOM: data[i].OrderUOM,
                                UnitWidth: data[i].UnitWidth,
                                UnitHeight: data[i].UnitHeight,
                                UnitLength: data[i].UnitLength,
                                MinOrderQty: data[i].MinOrderQty,
                                PrintTypeCode: data[i].PrintTypeCode,
                                PrintTypeDescription: data[i].PrintTypeDescription,
                                ExtendedDescription: data[i].ExtendedDescription,
                                PrivateLabel: data[i].PrivateLabel,
                                ConsumerItem: data[i].ConsumerItem,
                                ERP: data[i].ERP,
                                BundleId: data[i].BundleId,
                                BundleItemId: data[i].BundleItemId
                            }
                            products.push(product);
                        }
                    }
                }
            }

            if (this.options.filters && this.options.filters.length > 0) {
                console.log('Filters to apply to this display: ' + JSON.stringify(this.options.filters));
                products = this.applyFilters(products);
            }

            if (products.length == 0) {
                debugger;
                console.log('Error: No products loaded. WHY ARE WE HERE?');
                document.getElementById('bwAdvancedProductSearch_Error').innerHTML = 'Error: No products loaded.xcx2';
            }

            var html = '';
            html += '           <span class="bwHoverLink1" style="cursor:pointer;" onclick="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'clearFilters\', \'' + productSegment + '\', \'' + productSubClass + '\');">CLEAR FILTERS</span>';
            html += '           <br />';
            // FILTER SECTION
            html += '           <div id="divProductFilterSection_Color" style="border:1px solid grey;padding: 10px 10px 10px 10px;cursor:default;">';
            html += '           </div>';
            html += '           <div id="divProductFilterSection_Height" style="border:1px solid grey;padding: 10px 10px 10px 10px;cursor:default;">';
            html += '           </div>';
            html += '           <div id="divProductFilterSection_Length" style="border:1px solid grey;padding: 10px 10px 10px 10px;cursor:default;">';
            html += '           </div>';
            html += '           <div id="divProductFilterSection_Print" style="border:1px solid grey;padding: 10px 10px 10px 10px;cursor:default;">';
            html += '           </div>';
            html += '           <div id="divProductFilterSection_PrivateLabel" style="border:1px solid grey;padding: 10px 10px 10px 10px;cursor:default;">';
            html += '           </div>';
            html += '           <div id="divProductFilterSection_Style" style="border:1px solid grey;padding: 10px 10px 10px 10px;cursor:default;">';
            html += '           </div>';
            html += '           <div id="divProductFilterSection_Width" style="border:1px solid grey;padding: 10px 10px 10px 10px;cursor:default;">';
            html += '           </div>';

            document.getElementById('tdProductFilterSection').innerHTML = html;

            //
            // NOW WE HAVE TO RENDER THE CUSTOM FILTER SECTIONS.
            //
            // Print filter section.
            var html = '';
            var uoms = [];
            for (var i = 0; i < products.length; i++) {
                if (products[i].PrintTypeCode) {
                    if (products[i].PrintTypeDescription) {
                        if (!(uoms.indexOf(products[i].PrintTypeDescription) > -1)) {
                            uoms.push(products[i].PrintTypeDescription);
                        }
                    } else {
                        // There was a PrintTypeCode but no PrintTypeDescription. 
                        if (!(uoms.indexOf(products[i].PrintTypeCode) > -1)) {
                            uoms.push(products[i].PrintTypeCode);
                        }
                    }
                }
            }
            if (uoms.length > 0) {
                html += '               <span style="font-size:12pt;font-weight:bold;">Printing</span>';
                html += '               <br />';
                html += '               <br />';
                uoms = uoms.sort();
                for (var i = 0; i < uoms.length; i++) {
                    var selected = '';
                    if (this.options.filters) {
                        for (var j = 0; j < this.options.filters.length; j++) {
                            if (this.options.filters[j].filtersectionname == 'Printing') {
                                if (this.options.filters[j].filtertext == uoms[i]) {
                                    selected = ' checked ';
                                    break;
                                }
                            }
                        }
                    }
                    html += '               <span style="white-space:nowrap;"><input class="bwFilterCheckbox" filtersectionname="Printing" filtertext="' + uoms[i] + '" type="checkbox" ' + selected + ' style="cursor:pointer;" onchange="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'filter_OnChange\', \'Printing\', \'' + uoms[i] + '\', \'' + productSegment + '\', \'' + productSubClass + '\', \'' + highlightThisProductCode + '\');" />&nbsp;&nbsp;' + uoms[i] + '</span>';
                    html += '               <br />';
                }
                html += '               <br />';
            }
            document.getElementById('divProductFilterSection_Print').innerHTML = html;

            // Manufacturer Label filter section.
            var html = '';
            html += '               <span style="font-size:12pt;font-weight:bold;">Manufacturer Labelxcx2</span>';
            html += '               <br />';
            html += '               <br />';
            var selected = '';
            var filtertext = 'YES';
            if (this.options.filters) {
                for (var j = 0; j < this.options.filters.length; j++) {
                    if (this.options.filters[j].filtersectionname == 'PrivateLabel') {
                        if (this.options.filters[j].filtertext == 'YES') {
                            selected = ' checked ';
                            filtertext = 'YES';
                            break;
                        }
                    }
                }
            }
            html += '               <span style="white-space:nowrap;"><input class="bwFilterCheckbox" filtersectionname="PrivateLabel" filtertext="' + filtertext + '" type="checkbox" ' + selected + ' style="cursor:pointer;" onchange="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'filter_OnChange\', \'PrivateLabel\', \'' + filtertext + '\', \'' + productSegment + '\', \'' + productSubClass + '\', \'' + highlightThisProductCode + '\');" />&nbsp;&nbsp;' + 'YES' + '</span>';
            html += '               <br />';
            html += '               <br />';
            document.getElementById('divProductFilterSection_PrivateLabel').innerHTML = html;

            // Style filter section.
            var html = '';
            var styles = [];
            for (var i = 0; i < products.length; i++) {
                if (products[i].Style) {
                    if (!(styles.indexOf(products[i].Style) > -1)) {
                        styles.push(products[i].Style);
                    }
                }
            }
            if (styles.length > 0) {
                html += '               <span style="font-size:12pt;font-weight:bold;">Style</span>';
                html += '               <br />';
                html += '               <br />';
                styles = styles.sort();
                for (var i = 0; i < styles.length; i++) {
                    var selected = '';
                    if (this.options.filters) {
                        for (var j = 0; j < this.options.filters.length; j++) {
                            if (this.options.filters[j].filtersectionname == 'Style') {
                                if (this.options.filters[j].filtertext == styles[i]) {
                                    selected = ' checked ';
                                    break;
                                }
                            }
                        }
                    }
                    html += '               <span style="white-space:nowrap;"><input class="bwFilterCheckbox" filtersectionname="Style" filtertext="' + styles[i] + '" type="checkbox" ' + selected + ' style="cursor:pointer;" onchange="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'filter_OnChange\', \'Style\', \'' + styles[i] + '\', \'' + productSegment + '\', \'' + productSubClass + '\', \'' + highlightThisProductCode + '\');" />&nbsp;&nbsp;' + styles[i] + '</span>';
                    html += '               <br />';
                }
                html += '               <br />';
            }
            document.getElementById('divProductFilterSection_Style').innerHTML = html;

            // Color filter section.
            var html = '';
            var colors = [];
            for (var i = 0; i < products.length; i++) {
                if (products[i].Color) {
                    if (!(colors.indexOf(products[i].Color) > -1)) {
                        colors.push(products[i].Color);
                    }
                }
            }
            if (colors.length > 0) {
                html += '               <span style="font-size:12pt;font-weight:bold;">Color</span>';
                html += '               <br />';
                html += '               <br />';
                colors = colors.sort();
                for (var i = 0; i < colors.length; i++) {
                    var selected = '';
                    if (this.options.filters) {
                        for (var j = 0; j < this.options.filters.length; j++) {
                            if (this.options.filters[j].filtersectionname == 'Color') {
                                if (this.options.filters[j].filtertext == colors[i]) {
                                    selected = ' checked ';
                                    break;
                                }
                            }
                        }
                    }
                    html += '               <span style="white-space:nowrap;"><input class="bwFilterCheckbox" filtersectionname="Color" filtertext="' + colors[i] + '" type="checkbox" ' + selected + ' style="cursor:pointer;" onchange="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'filter_OnChange\', \'Color\', \'' + colors[i] + '\', \'' + productSegment + '\', \'' + productSubClass + '\', \'' + highlightThisProductCode + '\');" />&nbsp;&nbsp;' + colors[i] + '</span>';
                    html += '               <br />';
                }
                html += '               <br />';
            }
            document.getElementById('divProductFilterSection_Color').innerHTML = html;

            // UnitWidthUOM filter section.
            var html = '';
            var uoms = [];
            for (var i = 0; i < products.length; i++) {
                if (products[i].UnitWidthUOM) {
                    if (!(uoms.indexOf(products[i].UnitWidth + ' ' + products[i].UnitWidthUOM) > -1)) {
                        uoms.push(products[i].UnitWidth + ' ' + products[i].UnitWidthUOM);
                    }
                }
            }
            if (uoms.length > 0) {
                html += '               <span style="font-size:12pt;font-weight:bold;">Width</span>';
                html += '               <br />';
                html += '               <br />';
                uoms = uoms.sort(function (a, b) { // Sort alpha-numerically.?
                    try {
                        var a2 = Number(a.split(' ')[0]);
                        var b2 = Number(b.split(' ')[0]);
                        return a2 - b2
                    } catch (e) {
                        document.getElementById('bwAdvancedProductSearch_Error').innerHTML = 'Exception in bwAdvancedProductSearch.renderFilterAndProductsSections_InventoryManagement.sort.Width: ' + e.message + ', ' + e.stack;
                    }
                });
                for (var i = 0; i < uoms.length; i++) {

                    var selected = '';
                    if (this.options.filters) {
                        for (var j = 0; j < this.options.filters.length; j++) {
                            if (this.options.filters[j].filtersectionname == 'Width') {
                                if (this.options.filters[j].filtertext == uoms[i]) {
                                    selected = ' checked ';
                                    break;
                                }
                            }
                        }
                    }
                    html += '               <span style="white-space:nowrap;"><input class="bwFilterCheckbox" filtersectionname="Width" filtertext="' + uoms[i] + '" type="checkbox" ' + selected + ' style="cursor:pointer;" onchange="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'filter_OnChange\', \'Width\', \'' + uoms[i] + '\', \'' + productSegment + '\', \'' + productSubClass + '\', \'' + highlightThisProductCode + '\');" />&nbsp;&nbsp;' + uoms[i] + '</span>';
                    html += '               <br />';
                }
                html += '               <br />';
            }
            document.getElementById('divProductFilterSection_Width').innerHTML = html;

            // UnitHeightUOM filter section.
            var html = '';
            var uoms = [];
            for (var i = 0; i < products.length; i++) {
                if (products[i].UnitHeightUOM) {
                    if (!(uoms.indexOf(products[i].UnitHeight + ' ' + products[i].UnitHeightUOM) > -1)) {
                        uoms.push(products[i].UnitHeight + ' ' + products[i].UnitHeightUOM);
                    }
                }
            }
            if (uoms.length > 0) {
                html += '               <span style="font-size:12pt;font-weight:bold;">Height</span>';
                html += '               <br />';
                html += '               <br />';
                uoms = uoms.sort(function (a, b) { // Sort alpha-numerically.?
                    try {
                        var a2 = Number(a.split(' ')[0]);
                        var b2 = Number(b.split(' ')[0]);
                        return a2 - b2
                    } catch (e) {
                        document.getElementById('bwAdvancedProductSearch_Error').innerHTML = 'Exception in bwAdvancedProductSearch.renderFilterAndProductsSections_InventoryManagement.sort.Height: ' + e.message + ', ' + e.stack;
                    }
                });
                for (var i = 0; i < uoms.length; i++) {

                    var selected = '';
                    if (this.options.filters) {
                        for (var j = 0; j < this.options.filters.length; j++) {
                            if (this.options.filters[j].filtersectionname == 'Height') {
                                if (this.options.filters[j].filtertext == uoms[i]) {
                                    selected = ' checked ';
                                    break;
                                }
                            }
                        }
                    }
                    html += '               <span style="white-space:nowrap;"><input class="bwFilterCheckbox" filtersectionname="Height" filtertext="' + uoms[i] + '" type="checkbox" ' + selected + ' style="cursor:pointer;" onchange="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'filter_OnChange\', \'Height\', \'' + uoms[i] + '\', \'' + productSegment + '\', \'' + productSubClass + '\', \'' + highlightThisProductCode + '\');" />&nbsp;&nbsp;' + uoms[i] + '</span>';
                    html += '               <br />';
                }
                html += '               <br />';
            }
            document.getElementById('divProductFilterSection_Height').innerHTML = html;

            // UnitLengthUOM filter section.
            var html = '';
            var uoms = [];
            for (var i = 0; i < products.length; i++) {
                if (products[i].UnitLengthUOM) {
                    if (!(uoms.indexOf(products[i].UnitLength + ' ' + products[i].UnitLengthUOM) > -1)) {
                        uoms.push(products[i].UnitLength + ' ' + products[i].UnitLengthUOM);
                    }
                }
            }
            if (uoms.length > 0) {
                html += '               <span style="font-size:12pt;font-weight:bold;">Length</span>';
                html += '               <br />';
                html += '               <br />';
                uoms = uoms.sort(function (a, b) { // Sort alpha-numerically.?
                    try {
                        var a2 = Number(a.split(' ')[0]);
                        var b2 = Number(b.split(' ')[0]);
                        return a2 - b2
                    } catch (e) {
                        document.getElementById('bwAdvancedProductSearch_Error').innerHTML = 'Exception in bwAdvancedProductSearch.renderFilterAndProductsSections_InventoryManagement.sort.Length: ' + e.message + ', ' + e.stack;
                    }
                });
                for (var i = 0; i < uoms.length; i++) {

                    var selected = '';
                    if (this.options.filters) {
                        for (var j = 0; j < this.options.filters.length; j++) {
                            if (this.options.filters[j].filtersectionname == 'Length') {
                                if (this.options.filters[j].filtertext == uoms[i]) {
                                    selected = ' checked ';
                                    break;
                                }
                            }
                        }
                    }
                    html += '               <span style="white-space:nowrap;"><input class="bwFilterCheckbox" filtersectionname="Length" filtertext="' + uoms[i] + '" type="checkbox" ' + selected + ' style="cursor:pointer;" onchange="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'filter_OnChange\', \'Length\', \'' + uoms[i] + '\', \'' + productSegment + '\', \'' + productSubClass + '\', \'' + highlightThisProductCode + '\');" />&nbsp;&nbsp;' + uoms[i] + '</span>';
                    html += '               <br />';
                }
                html += '               <br />';
            }
            document.getElementById('divProductFilterSection_Length').innerHTML = html;

            //
            // LIST ALL OF THE PRODUCTS. 
            //
            document.getElementById('productsContentSections').innerHTML = '';
            var html = '';
            html += '<div id="divFilteredProductsListInformationSummaryHeader"></div>';

            // The "Add All Filtered Products" button.
            if (this.options.filters && this.options.filters.length > 0 && products.length > 1) { // We only want to display when there is at least 1 filter selected, and more than 1 product is being displayed.
                var buttonText = '';
                buttonText += 'ADD ALL';
                for (var i = 0; i < this.options.filters.length; i++) {
                    buttonText += ' > ';
                    buttonText += this.options.filters[i].filtersectionname;
                    buttonText += ': ';
                    buttonText += this.options.filters[i].filtertext;
                }
                html += '<div id="divAddAllFilteredProducts" style="float:right;">';
                html += '   <br />';
                var _filters = encodeURI(JSON.stringify(this.options.filters)).replace(/'/g, "%27"); // The replace encodes single quotes. For some reason encodeURI may not do single quotes??
                var _products = encodeURI(JSON.stringify(products)).replace(/'/g, "%27"); // The replace encodes single quotes. For some reason encodeURI may not do single quotes??
                html += '   <span style="white-space:nowrap;" type="text" class="button-blue" onclick="$(\'.bwDistributorDiscounting\').bwDistributorDiscounting(\'addAllFilteredProducts\', \'' + productSegment + '\', \'' + productSubClass + '\', \'' + _filters + '\', \'' + _products + '\');" >' + buttonText + '</span>';
                html += '</div>';
            }

            html += '<table>';
            html += '<tr>';
            html += '   <td>';
            html += 'Product Codexcx2';
            html += '   </td>';
            html += '   <td>';
            html += 'Product Descriptionxcx2';
            html += '   </td>';
            html += '   <td>';
            html += 'Extended Description';
            html += '   </td>';

            if (this.options.SearchingForModule == 'Distributor') { // Bundling is only displayed for the Distributor module.
                html += '   <td>';
                html += 'Bundle';
                html += '   </td>';
            }

            html += '   <td>';
            html += 'Style';
            html += '   </td>';
            html += '   <td>';
            html += 'Color';
            html += '   </td>';
            html += '   <td>';
            html += 'Width';
            html += '   </td>';
            //html += '   <td>';
            //html += 'Height';
            //html += '   </td>';
            //html += '   <td>';
            //html += 'Length';
            //html += '   </td>';
            //html += '   <td>';
            //html += 'Minimum Order';
            //html += '   </td>';
            //html += '   <td>';
            //html += 'Print Type';
            //html += '   </td>';
            html += '   <td>';
            html += 'Item #';
            html += '   </td>';
            html += '   <td>';
            html += 'Manufacturer Label';
            html += '   </td>';
            html += '   <td>';
            html += 'Image';
            html += '   </td>';
            html += '   <td>';
            html += '';
            html += '   </td>';
            html += '</tr>';

            var thisProductDescription = '';
            for (var i = 0; i < products.length; i++) {
                if (highlightThisProductCode && highlightThisProductCode == products[i].ProductCode) {
                    thisProductDescription = products[i].Description;
                }
            }


            //debugger; // does this work? todd do we need this? Is it obsolete?
            var sessionId = $('#SessionId').val();
            if (!sessionId) {
                console.log('In renderFilterAndProductsSections_InventoryManagement(). Invalid sessionId: ' + sessionId);
                //var error1 = new Error('Error in renderFilterAndProductsSections(). Invalid sessionId: ' + sessionId);
                //document.getElementById('bwAdvancedProductSearch_Error').innerHTML = error1.message + ', ' + error1.stack;
            }


            for (var i = 0; i < products.length; i++) {
                html += '<tr>';

                html += '   <td style="white-space:nowrap;" >';

                var makeThisOneRed = false;
                // If there is content in the product search box, then make sure we identify and highlight the selected text in this product row!!! Maybe highlight in yellow highlighter!!!!
                if (highlightThisProductCode && highlightThisProductCode == products[i].ProductCode) {
                    html += '<span style="color:red;font-weight:bold;">' + products[i].ProductCode + '</span>';
                    makeThisOneRed = true;
                    thisProductDescription = products[i].Description;
                } else {
                    html += products[i].ProductCode;
                }
                html += '   </td>';



                alert('xcx21312442-4 add activestateidentifier to this image path...');

                // Image.
                var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
                //var imagePath = thiz.options.operationUriPrefix + '_files/' + workflowAppId + '/inventoryimages/' + thiz.options.InventoryItems[i].bwInventoryItemId + '/inventoryimage.png?v=' + guid;
                debugger;
                var imagePath = this.options.operationUriPrefix + '_files/' + workflowAppId + '/inventoryimages/' + products[i].ProductId + '/inventoryimage.png?v=' + guid;
                html += '   <td style="white-space:nowrap;" >';



                //html += '       <img id="attachmentstest1" src="' + imagePath + '" style="height:120px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;" alt="" onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayAttachmentInDialog\', \'' + imagePath + '\', \'donair.png\', \'\', \'9027e5d7-d3af-40e8-b692-07b29a8ce03b\');">';

                html += '       <img id="attachmentstest1" src="' + imagePath + '" style="height:120px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;" alt="" onclick="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'btnEdit_OnClick\', \'' + products[i].ProductId + '\');">';

                // <img id="orgImage_0" src="https://budgetworkflow.com/_files/6e650ae7-81d0-48ab-86d1-1183d3126a18/inventoryimages/f19a77eb-7d7c-40bf-90dd-b9747e994070/inventoryimage.png?v=27457e15-ab20-4829-bd0b-e98c6af7c79b" style="height:120px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;" alt="" onclick="$('.bwAdvancedProductSearch').bwAdvancedProductSearch('btnEdit_OnClick', 'f19a77eb-7d7c-40bf-90dd-b9747e994070');">






                html += '   </td>';





                html += '   <td style="white-space:nowrap;" >';
                // If there is content in the product search box, then make sure we identify and highlight the selected text in this product row!!! Maybe highlight in yellow highlighter!!!!
                if (thisProductDescription && (thisProductDescription == products[i].Description)) {
                    html += '<span style="color:black;font-weight:bold;">' + products[i].Description + '</span>';
                } else {
                    html += products[i].Description;
                }
                html += '   </td>';
                html += '   <td>';
                html += products[i].ExtendedDescription;
                html += '   </td>';


                if (this.options.SearchingForModule == 'Distributor') { // Bundling is only displayed for the Distributor module.
                    html += '   <td>';

                    // This determines if this product belongs to a bundle.
                    var bundleId, bundleItemId, bundleDescription;
                    var thisProductIsInABundle = false;
                    for (var b = 0; b < this.options.Bundles.length; b++) {
                        if (this.options.Bundles[b].ProductId == products[i].ProductId) {
                            //debugger;
                            thisProductIsInABundle = true;
                            bundleId = this.options.Bundles[b].BundleId;
                            bundleItemId = this.options.Bundles[b].BundleItemId;
                            bundleDescription = this.options.Bundles[b].BundleDescription;
                            break;
                        }
                    }
                    if (thisProductIsInABundle == true) {
                        // If we get here, the product belongs to a bundle. Only show the "View" link, not the "Add" link, because a product can only belong to 1 bundle at a time.
                        //html += '       <span title="Click here to add this product to a Bundle." id="spanAdvancedSearchProductBundleLink" style="cursor:pointer;text-decoration:underline;" onclick="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'addProductToBundle\', \'' + products[i].ProductId + '\', \'' + products[i].Description.replace(/["']/g, "") + '\');" onmouseover="" onmouseout="" >';
                        //html += '           Add';
                        //html += '       </span>';
                        //html += ' / ';
                        html += '       <span title="This product belongs to bundle \'' + bundleDescription + '\'. Click here to view the Bundle." id="spanAdvancedSearchProductBundleLink" style="cursor:pointer;text-decoration:underline;color:tomato;" onclick="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'viewBundleForProduct\', \'' + products[i].ProductId + '\', \'' + bundleId + '\', \'' + bundleItemId + '\');" onmouseover="" onmouseout="" >';
                        html += '           View';
                        html += '       </span>';
                    } else {

                        if (products[i].Description) {
                            html += '       <span title="Click here to add this product to a Bundle." id="spanAdvancedSearchProductBundleLink" style="cursor:pointer;text-decoration:underline;" onclick="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'addProductToBundle\', \'' + products[i].ProductId + '\', \'' + products[i].ProductCode + '\', \'' + products[i].Description.replace(/["']/g, "") + '\');" onmouseover="" onmouseout="" >';
                        } else {
                            html += '       <span title="Click here to add this product to a Bundle." id="spanAdvancedSearchProductBundleLink" style="cursor:pointer;text-decoration:underline;" onclick="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'addProductToBundle\', \'' + products[i].ProductId + '\', \'' + products[i].ProductCode + '\', \'' + '' + '\');" onmouseover="" onmouseout="" >';
                        }

                        html += '           Add';
                        html += '       </span>';
                        html += ' / ';
                        html += '       <span title="Click here to view and manage all of your Bundles." id="spanAdvancedSearchProductBundleLink" style="cursor:pointer;text-decoration:underline;" onclick="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'viewBundleForProduct\', \'' + products[i].ProductId + '\', \'' + bundleId + '\', \'' + bundleItemId + '\');" onmouseover="" onmouseout="" >';
                        html += '           View';
                        html += '       </span>';
                    }

                    html += '   </td>';
                }


                html += '   <td>';
                html += products[i].Style;
                html += '   </td>';
                html += '   <td>';
                html += products[i].Color;
                html += '   </td>';
                html += '   <td>';
                html += products[i].UnitWidth + ' ' + products[i].UnitWidthUOM;
                html += '   </td>';
                //html += '   <td >';
                //html += products[i].UnitHeight + ' ' + products[i].UnitHeightUOM;
                //html += '   </td>';
                //html += '   <td >';
                //html += products[i].UnitLength + ' ' + products[i].UnitLengthUOM;
                //html += '   </td>';
                //html += '   <td >';
                //html += products[i].MinOrderQty + ' ' + products[i].OrderUOM;
                //html += '   </td>';
                //html += '   <td >';
                //html += products[i].PrintTypeDescription + ' (' + products[i].PrintTypeCode + ')';
                //html += '   </td>';
                html += '   <td>';
                html += products[i].ConsumerItem;
                html += '   </td>';
                html += '   <td>';
                if (products[i].PrivateLabel == true) {
                    html += 'YES';
                } else {
                    html += 'NO';
                }
                html += '   </td>';




                html += '   <td>';
                html += 'xcx1234123254-2';
                html += '   </td>';







                html += '   <td>';
                //debugger;
                html += '<input type="button" value="Edit" class="button-blue" onclick="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'btnEdit_OnClick\', \'' + products[i].ProductId + '\');" />';

                html += '&nbsp;';
                html += '<input type="button" value="Delete" class="button-blue" onclick="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'btnDelete_OnClick\', \'' + products[i].ProductId + '\');" />';



                // <a class="button-blue" data-ajax="true" data-ajax-begin="ShowBusyProduct" data-ajax-complete="HideBusyProduct" data-ajax-method="GET" data-ajax-mode="replace" 
                //data - ajax - update="#SelectedSku" href = "/Distributor/GetPricing/238715/a6bfa57e-5e5f-42de-b614-b9fdd0c10dfe" src = "~/Images/icon-right.png" > Add</a >

                html += '   </td>';
                html += '</tr>';

                //// Make the rows alternate.
                //if (rowClass == 'tableRowHoverHighlighted') {
                //    rowClass = '';
                //} else {
                //    rowClass = 'tableRowHoverHighlighted';
                //}
            }
            html += '</table>';
            document.getElementById('productsContentSections').innerHTML = html;

            var html = '';
            html += '<span style="">DISPLAYING ' + products.length + ' OF ' + this.options.json.length + ' PRODUCTS.</span>';
            document.getElementById('divFilteredProductsListInformationSummaryHeader').innerHTML = html;

            HideActivitySpinner();

        } catch (e) {
            HideActivitySpinner();

            console.log('Exception in renderFilterAndProductsSections_InventoryManagement(): ' + e.message + ', ' + e.stack);
            document.getElementById('bwAdvancedProductSearch_Error').innerHTML = 'Exception in renderFilterAndProductsSections_InventoryManagement(): ' + e.message + ', ' + e.stack;
        }
    },

    filter_OnChange: function (filterType, filterDescription, productSegment, productSubClass, highlightThisProductCode) {
        try {
            console.log('In filter_OnChange(). filterType: ' + filterType + ', filterDescription:' + filterDescription);
            var thiz = this;
            ShowActivitySpinner();

            setTimeout(function () {
                var data = thiz.options.json;

                // Create json representation of the selected filters. Do this by referring to class .bwFilterCheckbox and attributes 'filtersectionname' and 'filtertext'.
                var checkboxes = document.getElementsByClassName('bwFilterCheckbox');
                var filters = [];
                for (var i = 0; i < checkboxes.length; i++) {
                    if (checkboxes[i].checked == true) {
                        var filter = {
                            filtersectionname: checkboxes[i].getAttribute('filtersectionname'),
                            filtertext: checkboxes[i].getAttribute('filtertext')
                        }
                        filters.push(filter);
                    }
                }

                thiz.options.filters = filters;

                thiz.renderFilterAndProductsSections(productSegment, productSubClass, highlightThisProductCode); // THIS HAS TO HAPPEN BECAUSE A FILTER CAN AFFECT ANY OTHER FILTER, IF IT DISPLAYS< OR IF OTHERS NEED TO DISPLAY!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
            }, 0);

        } catch (e) {
            HideActivitySpinner();
            console.log('Exception in filter_OnChange(): ' + e.message + ', ' + e.stack);
            document.getElementById('bwAdvancedProductSearch_Error').innerHTML = 'Exception in filter_OnChange(): ' + e.message + ', ' + e.stack;
        }
    },
    applyFilters: function (products) {
        try {
            console.log('In applyFilters().');
            var filteredProductsList = [];
            var filters = this.options.filters;
            // Start: Break out the filters into their own arrays.
            var colorFilters = [];
            for (var i = 0; i < filters.length; i++) {
                if (filters[i].filtersectionname == 'Color') {
                    colorFilters.push(filters[i]);
                }
            }
            var heightFilters = [];
            for (var i = 0; i < filters.length; i++) {
                if (filters[i].filtersectionname == 'Height') {
                    heightFilters.push(filters[i]);
                }
            }
            var lengthFilters = [];
            for (var i = 0; i < filters.length; i++) {
                if (filters[i].filtersectionname == 'Length') {
                    lengthFilters.push(filters[i]);
                }
            }
            var minimumOrderFilters = [];
            for (var i = 0; i < filters.length; i++) {
                if (filters[i].filtersectionname == 'Minimum Order') {
                    minimumOrderFilters.push(filters[i]);
                }
            }
            var printingFilters = [];
            for (var i = 0; i < filters.length; i++) {
                if (filters[i].filtersectionname == 'Printing') {
                    printingFilters.push(filters[i]);
                }
            }
            var privateLabelFilters = [];
            for (var i = 0; i < filters.length; i++) {
                if (filters[i].filtersectionname == 'PrivateLabel') {
                    privateLabelFilters.push(filters[i]);
                }
            }
            var styleFilters = [];
            for (var i = 0; i < filters.length; i++) {
                if (filters[i].filtersectionname == 'Style') {
                    styleFilters.push(filters[i]);
                }
            }
            var widthFilters = [];
            for (var i = 0; i < filters.length; i++) {
                if (filters[i].filtersectionname == 'Width') {
                    widthFilters.push(filters[i]);
                }
            }
            // End: Break out the filters into their own arrays.

            //
            // Apply the filters to the products array.
            //
            //Company
            //Color
            //Height
            //Length
            //Printing
            //Private Label
            //Style
            //Width
            filteredProductsList = JSON.parse(JSON.stringify(products)); // This clones the list.
            // First we are going to apply the "Color" filters.
            if (colorFilters.length > 0) {
                var filteredProductsList2 = [];
                for (var i = 0; i < filteredProductsList.length; i++) {
                    var isThisProductTheCorrectColor = false;
                    for (var j = 0; j < colorFilters.length; j++) {
                        if (colorFilters[j].filtertext == filteredProductsList[i].Color) {
                            isThisProductTheCorrectColor = true;
                        }
                    }
                    if (isThisProductTheCorrectColor == true) {
                        filteredProductsList2.push(filteredProductsList[i]);
                    }
                }
                filteredProductsList = JSON.parse(JSON.stringify(filteredProductsList2)); // This clones the list.
            }
            // Second we are going to apply the "Height" filters.
            if (heightFilters.length > 0) {
                var filteredProductsList2 = [];
                for (var i = 0; i < filteredProductsList.length; i++) {
                    var isThisProductTheCorrectHeight = false;
                    for (var j = 0; j < heightFilters.length; j++) {
                        if (heightFilters[j].filtertext.indexOf(filteredProductsList[i].UnitHeight + ' ' + filteredProductsList[i].UnitHeightUOM.trim()) > -1) {
                            isThisProductTheCorrectHeight = true;
                        }
                    }
                    if (isThisProductTheCorrectHeight == true) {
                        filteredProductsList2.push(filteredProductsList[i]);
                    }
                }
                filteredProductsList = filteredProductsList2;
            }
            // Third, we are going to apply the "Length" filters.
            if (lengthFilters.length > 0) {
                var filteredProductsList2 = [];
                for (var i = 0; i < filteredProductsList.length; i++) {
                    var isThisProductTheCorrectLength = false;
                    for (var j = 0; j < lengthFilters.length; j++) {
                        if (lengthFilters[j].filtertext.indexOf(filteredProductsList[i].UnitLength + ' ' + filteredProductsList[i].UnitLengthUOM.trim()) > -1) {
                            isThisProductTheCorrectLength = true;
                        }
                    }
                    if (isThisProductTheCorrectLength == true) {
                        filteredProductsList2.push(filteredProductsList[i]);
                    }
                }
                filteredProductsList = filteredProductsList2;
            }
            // Fourth, we are going to apply the "MinimumOrder" filters.
            if (minimumOrderFilters.length > 0) {
                var filteredProductsList2 = [];
                for (var i = 0; i < filteredProductsList.length; i++) {
                    var isThisProductTheCorrectMinimumOrder = false;
                    for (var j = 0; j < minimumOrderFilters.length; j++) {
                        if (minimumOrderFilters[j].filtertext.indexOf(filteredProductsList[i].MinOrderQty + ' ' + filteredProductsList[i].OrderUOM.trim()) > -1) {
                            isThisProductTheCorrectMinimumOrder = true;
                        }
                    }
                    if (isThisProductTheCorrectMinimumOrder == true) {
                        filteredProductsList2.push(filteredProductsList[i]);
                    }
                }
                filteredProductsList = filteredProductsList2;
            }
            // Fifth, we are going to apply the "Printing" filters.
            if (printingFilters.length > 0) {
                var filteredProductsList2 = [];
                for (var i = 0; i < filteredProductsList.length; i++) {
                    var isThisProductTheCorrectPrinting = false;
                    for (var j = 0; j < printingFilters.length; j++) {
                        if (printingFilters[j].filtertext.indexOf(filteredProductsList[i].PrintTypeDescription.trim()) > -1) {
                            isThisProductTheCorrectPrinting = true;
                        }
                    }
                    if (isThisProductTheCorrectPrinting == true) {
                        filteredProductsList2.push(filteredProductsList[i]);
                    }
                }
                filteredProductsList = filteredProductsList2;
            }
            // Sixth, we are going to apply the "Private Label" filters.
            if (privateLabelFilters.length > 0) {
                var filteredProductsList2 = [];
                for (var i = 0; i < filteredProductsList.length; i++) {
                    var isThisProductTheCorrectPrivateLabel = false;
                    for (var j = 0; j < privateLabelFilters.length; j++) {
                        var privateLabelValue = 'NO';
                        if (filteredProductsList[i].PrivateLabel == true) {
                            privateLabelValue = 'YES';
                        }
                        if (privateLabelFilters[j].filtertext == privateLabelValue) {
                            isThisProductTheCorrectPrivateLabel = true;
                        }
                    }
                    if (isThisProductTheCorrectPrivateLabel == true) {
                        filteredProductsList2.push(filteredProductsList[i]);
                    }
                }
                filteredProductsList = filteredProductsList2;
            }
            // Seventh, we are going to apply the "Style" filters.
            if (styleFilters.length > 0) {
                var filteredProductsList2 = [];
                for (var i = 0; i < filteredProductsList.length; i++) {
                    var isThisProductTheCorrectStyle = false;
                    for (var j = 0; j < styleFilters.length; j++) {
                        if (styleFilters[j].filtertext == filteredProductsList[i].Style) {
                            isThisProductTheCorrectStyle = true;
                        }
                    }
                    if (isThisProductTheCorrectStyle == true) {
                        filteredProductsList2.push(filteredProductsList[i]);
                    }
                }
                filteredProductsList = filteredProductsList2;
            }
            // Eight, we are going to apply the "Width" filters.
            if (widthFilters.length > 0) {
                var filteredProductsList2 = [];
                for (var i = 0; i < filteredProductsList.length; i++) {
                    var isThisProductTheCorrectWidth = false;
                    for (var j = 0; j < widthFilters.length; j++) {
                        if (widthFilters[j].filtertext.indexOf(filteredProductsList[i].UnitWidth + ' ' + filteredProductsList[i].UnitWidthUOM.trim()) > -1) {
                            isThisProductTheCorrectWidth = true;
                        }
                    }
                    if (isThisProductTheCorrectWidth == true) {
                        filteredProductsList2.push(filteredProductsList[i]);
                    }
                }
                filteredProductsList = filteredProductsList2;
            }

            // There, we are done! The resulting list is filtered.

        } catch (e) {
            console.log('Exception in applyFilters(): ' + e.message + ', ' + e.stack);
            document.getElementById('bwAdvancedProductSearch_Error').innerHTML = 'Exception in applyFilters(): ' + e.message + ', ' + e.stack;
        } finally {
            return filteredProductsList;
        }
    },
    clearFilters: function (productSegment, productSubClass) {
        try {
            console.log('In clearFilters().');
            var thiz = this;
            ShowActivitySpinner();

            setTimeout(function () {
                thiz.clearTheSearchBox();
                thiz.options.filters = null;
                thiz.renderFilterAndProductsSections(productSegment, productSubClass);
            }, 0);

        } catch (e) {
            console.log('Exception in clearFilters(): ' + e.message + ', ' + e.stack);
        }
    },

    renderSegmentTopMenuBar: function (productSegment) {
        try {
            console.log('In renderSegmentTopMenuBar(). productSegment: ' + productSegment);

            this.clearTheSearchBox();

            this.options.productSubClasses = null; // When we render the segment, we have to reset the subclass menu bar.
            //document.getElementById('productSegmentTopMenubar').innerHTML = '';

            var productSegments = this.options.productSegments;
            if (productSegments.length == 1) {
                // Since there is only one product segment, we won't display the segment top menu bar. This happens for Polyair at the moment.
            } else {
                var html = '';

                html += '<hr />';
                for (var i = 0; i < productSegments.length; i++) {
                    if (productSegments[i] == productSegment) {
                        // Display the link in a style that indicates it has been selected.
                        html += '| <span style="cursor:pointer;color:blue;font-weight:bold;" onclick="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'productSegment_Click\', \'' + productSegments[i] + '\');">' + productSegments[i] + '</span> ';
                    } else {
                        html += '| <span style="cursor:pointer;" class="bwHoverLink1" onclick="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'productSegment_Click\', \'' + productSegments[i] + '\');">' + productSegments[i] + '</span> ';
                    }
                }
                html += '|';
                document.getElementById('productSegmentTopMenubar').innerHTML = html;
            }
            document.getElementById('productSubclassTopMenubar').innerHTML = ''; // Reset this one!

        } catch (e) {
            console.log('Exception in renderSegmentTopMenuBar(): ' + e.message + ', ' + e.stack);
        }
    },

    renderSubClassTopMenuBar: function (productSegment, productSubClass) {
        try {
            console.log('In renderSubClassTopMenuBar(). productSegment: ' + productSegment + ', productSubClass: ' + productSubClass);

            if (document.getElementById('productSubclassTopMenubar') && document.getElementById('productSubclassTopMenubar').innerHTML) {
                document.getElementById('productSubclassTopMenubar').innerHTML = '';
            }

            // Since the user selected a product segment, we now have to redraw the product subclass menu bar.
            var data = this.options.json;
            var html = '';

            if (!this.options.productSubClasses) { // If this isn't populated, we will do that now.
                var productSubClasses = [];
                for (var i = 0; i < data.length; i++) {
                    if (data[i].Segment) {
                        if (productSegment && (productSegment.trim() == data[i].Segment.trim())) {
                            if (data[i].Subclass) {
                                if (!(productSubClasses.indexOf(data[i].Subclass.trim()) > -1)) {
                                    productSubClasses.push(data[i].Subclass.trim());
                                }
                            } else {
                                if (!(productSubClasses.indexOf('NA') > -1)) {
                                    productSubClasses.push('NA');
                                }
                            }
                        }
                    }
                }
                this.options.productSubClasses = productSubClasses;
            }

            if (productSubClass == '0') {
                productSubClass = this.options.productSubClasses[0];
            }

            for (var i = 0; i < this.options.productSubClasses.length; i++) {
                if (productSubClass && productSubClass == this.options.productSubClasses[i]) {
                    html += '| <span style="cursor:pointer;font-size:12pt;color:blue;cursor:pointer;" class="bwHoverLink1" onclick="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'productSubClass_Click\', \'' + productSegment + '\', \'' + this.options.productSubClasses[i] + '\');">' + this.options.productSubClasses[i] + '</span> ';
                } else {
                    html += '| <span style="cursor:pointer;font-size:12pt;" class="bwHoverLink1" onclick="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'productSubClass_Click\', \'' + productSegment + '\', \'' + this.options.productSubClasses[i] + '\');">' + this.options.productSubClasses[i] + '</span> ';
                }
            }
            html += '|';

            if (document.getElementById('productSubclassTopMenubar') && document.getElementById('productSubclassTopMenubar').innerHTML) {
                document.getElementById('productSubclassTopMenubar').innerHTML = html;
            }

        } catch (e) {
            console.log('Exception in renderSubClassTopMenuBar(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in renderSubClassTopMenuBar(): ' + e.message + ', ' + e.stack);
        }
    },

    renderBreadcrumbTopMenuBar: function (productSegment, productSubClass) {
        try {
            console.log('In renderBreadcrumbTopMenuBar(). ' + productSegment + ', productSubClass: ' + productSubClass);
            // Render the breadcrumb.
            document.getElementById('productBreadcrumbAndTitleMenubar').innerHTML = '';
            var html = '';
            html += '               <span style="color:blue;font-size:10pt;white-space:nowrap;">' + '<span style="cursor:pointer;" class="bwHoverLink1" onclick="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'productSegment_Click\', \'' + productSegment + '\');">' + productSegment + '</span>' + ' > ' + productSubClass + '</span>';
            html += '               <br />';
            html += '               <span style="font-size:15pt;font-weight:bold;">' + productSubClass + '</span>';
            document.getElementById('productBreadcrumbAndTitleMenubar').innerHTML = html;
        } catch (e) {
            console.log('Exception in renderBreadcrumbTopMenuBar(): ' + e.message + ', ' + e.stack);
        }
    },









    btnEdit_OnClick: function (productId) {
        try {
            console.log('In btnEdit_OnClick(). productId: ' + productId);
            var thiz = this;

            //ShowActivitySpinner();
            //var data = this.options.json;
            //var product;
            //for (var i = 0; i < data.length; i++) {
            //    if (data[i].ProductId == productId) {
            //        // This is the product we have to add.
            //        product = data[i];
            //        //if (!sessionId) {

            //        //    HideActivitySpinner();

            //        //    console.log('Error in btnEdit_OnClick(). Invalid sessionId: ' + sessionId);
            //        //    document.getElementById('bwAdvancedProductSearch_Error').innerHTML = 'Error in btnEdit_OnClick(). Invalid sessionId: ' + sessionId;
            //        //} else {
            //        //var operationUri = '/Distributor/GetPricing2?productCode=' + product.ProductId + '&sessionid=' + sessionId;
            //        debugger; // 
            //        if (!product.ProductId) {
            //            alert('INVALID PRODUCT ID.');
            //        } else {

            //            this.displayEditInventoryItemDialog(productId);



            //        }
            //    }
            //}

            this.displayEditInventoryItemDialog(productId);

        } catch (e) {

            //HideActivitySpinner();

            console.log('Exception in btnEdit_OnClick(): ' + e.message + ', ' + e.stack);
            document.getElementById('bwAdvancedProductSearch_Error').innerHTML = 'Exception in btnEdit_OnClick(): ' + e.message + ', ' + e.stack;
        }
    },

    btnDelete_OnClick: function (productId) {
        try {
            console.log('In btnDelete_OnClick(). productId: ' + productId);
            var thiz = this;

            alert('In btnDelete_OnClick(). productId: ' + productId + '. This functionality is incomplete. Coming soon!');
            //ShowActivitySpinner();
            //var data = this.options.json;
            //var product;
            //for (var i = 0; i < data.length; i++) {
            //    if (data[i].ProductId == productId) {
            //        // This is the product we have to add.
            //        product = data[i];
            //        //if (!sessionId) {

            //        //    HideActivitySpinner();

            //        //    console.log('Error in btnEdit_OnClick(). Invalid sessionId: ' + sessionId);
            //        //    document.getElementById('bwAdvancedProductSearch_Error').innerHTML = 'Error in btnEdit_OnClick(). Invalid sessionId: ' + sessionId;
            //        //} else {
            //        //var operationUri = '/Distributor/GetPricing2?productCode=' + product.ProductId + '&sessionid=' + sessionId;
            //        debugger; // 
            //        if (!product.ProductId) {
            //            alert('INVALID PRODUCT ID.');
            //        } else {

            //            this.displayEditInventoryItemDialog(productId);



            //        }
            //    }
            //}

            //this.displayEditInventoryItemDialog(productId);

        } catch (e) {

            //HideActivitySpinner();

            console.log('Exception in btnDelete_OnClick(): ' + e.message + ', ' + e.stack);
            document.getElementById('bwAdvancedProductSearch_Error').innerHTML = 'Exception in btnDelete_OnClick(): ' + e.message + ', ' + e.stack;
        }
    },

    viewBundleForProduct: function (productId, bundleId, bundleItemId) {
        try {
            console.log('In viewBundleForProduct(). productId: ' + productId + ', bundleId: ' + bundleId);

            $('.bwDistributorBundling').bwDistributorBundling('displaySelectABundleDialog', productId, bundleId); // Display the bundle.

        } catch (e) {

            HideActivitySpinner();

            console.log('Exception in viewBundleForProduct(): ' + e.message + ', ' + e.stack);
            document.getElementById('bwAdvancedProductSearch_Error').innerHTML = 'Exception in viewBundleForProduct(): ' + e.message + ', ' + e.stack;
        }
    },
    addProductToBundle: function (productId, productCode, productDescription) {
        try {
            console.log('In addProductToBundle(). productId: ' + productId);

            $('.bwDistributorBundling').bwDistributorBundling('displayAddProductToABundleDialog', productId, productCode, productDescription); // Display the bundle.

        } catch (e) {

            HideActivitySpinner();

            console.log('Exception in addProductToBundle(): ' + e.message + ', ' + e.stack);
            document.getElementById('bwAdvancedProductSearch_Error').innerHTML = 'Exception in addProductToBundle(): ' + e.message + ', ' + e.stack;
        }
    },
    displayActivitySpinner: function () {
        try {
            console.log('In displayActivitySpinner().');
            ShowActivitySpinner();
        } catch (e) {
            console.log('Exception in displayActivitySpinner(): ' + e.message + ', ' + e.stack);
        }
    },
    hideActivitySpinner: function () {
        try {
            console.log('In hideActivitySpinner().');
            HideActivitySpinner();
        } catch (e) {
            console.log('Exception in hideActivitySpinner(): ' + e.message + ', ' + e.stack);
        }
    },
    clearTheSearchBox: function (element) {
        try {
            console.log('In clearTheSearchBox().');

            if (!element) {
                element = document.getElementById('txtAdvancedProductSearch');
            }

            var contents = $(element).val();
            if (contents && contents.length > 1) {
                // Only clear the box when there is more than 1 character in it.
                $(element).val('');
            }

            element.style.color = ''; // When the search box has valid search text, it should be red, but here we want to revert to default.

            if (this.options.searchBoxEvent_keyup) {
                // Need a global reference to this because to removeeventlistener, a reference to the function is always required.
                element.removeEventListener("keyup", this.options.searchBoxEvent_keyup, false);
                this.options.searchBoxEvent_keyup = null;
            }

            $(element).focus();

        } catch (e) {
            console.log('Exception in clearTheSearchBox(): ' + e.message + ', ' + e.stack);
        }
    },

});