$.widget("bw.bwSelectInventoryItems", {
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
        This is the bwSelectInventoryItems.js jQuery Widget. 
        ===========================================================

            [more to follow]
                          
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

            [put your stuff here]

        ===========================================================
       
        */

        //json: null, // This is where the data is stored.

        fieldTitle: 'Select Inventory Items', // This is the title, which shows up on the form in the left column.

        elementIdSuffix: null, // This is a custom guid which gets appended to element id's, making sure this widget keeps to itself.

        bwBudgetRequestId: null, // This is set in _create on and re-used throughout.
        InventoryItems: [],

        jsonData: [], // This is what gets passed in the beginning and is bwRequestJson 1-22-2022 THROUGHTOUT OUR WIDGETS THIS SHOULD PROB BE RENAMED bwRequestJson in order to be consistent.

        requestDialogId: null, // This is the id of the container where this form widget is displayed.

        allowRequestModifications: false,
        renderAsARequiredField: null, // If this is true, then just display the red asterisk.

        inFormsEditor: null, // This is when forms are being designed. This prevents the widget from hitting the database (going asynchronous) when this is true. If that happens, a race condition may occur and addition to the toolbox may partially fail.

        operationUriPrefix: null,
        ajaxTimeout: 15000,
        autoSenseDeviceType: false // Automatic UI based on device type. Alpha version so far.
    },
    _create: function () {
        this.element.addClass("bwSelectInventoryItems");
        var thiz = this; // Need this because of the asynchronous operations below.
        try {

            // This gets set here and re-used throughout this widget. Not needed for the forms editor.
            try {
                var bwBudgetRequestId = $(thiz.element).closest('#budgetrequestform')[0].getAttribute('bwbudgetrequestid');
                this.options.bwBudgetRequestId = bwBudgetRequestId;
            } catch (e) {
                // Not needed for the forms editor.
            }

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

            //if (!this.options.jsonData) {
            //    this.options.jsonData = [];
            //}

            if (this.options.jsonData && this.options.jsonData.bwSelectInventoryItems && this.options.jsonData.bwSelectInventoryItems.value && (this.options.jsonData.bwSelectInventoryItems.value.length == 0)) {
                // No inventory items so just create the json envelope.
                this.options.jsonData['bwSelectInventoryItems'] = {}; // Instantiate the data object. bwSelectInventoryItems
            } else if (this.options.jsonData && this.options.jsonData.bwSelectInventoryItems && this.options.jsonData.bwSelectInventoryItems.value && this.options.jsonData.bwSelectInventoryItems.value.length && (this.options.jsonData.bwSelectInventoryItems.value.length > 0)) {
                // There inventory items, so put it in the correct place.
                this.options.InventoryItems = this.options.jsonData.bwSelectInventoryItems.value;
            } else if (this.options.jsonData) { // 3-1-2022 // && (this.options.jsonData.length == 0)) {
                // No inventory items so just create the json envelope.
                this.options.jsonData['bwSelectInventoryItems'] = {}; // Instantiate the data object. bwSelectInventoryItems
            } else {
                displayAlertDialog('Error in bwSelectInventoryItems.js._create(). Unexpected value for jsonData: ' + JSON.stringify(this.options.jsonData));
            }

            this.renderAndPopulateSelectedInventoryItemsGrid();


            var form = $(this.element).closest('.budgetrequestform')[0];

            this.renderInventoryItems(this.options.bwBudgetRequestId); //addInventoryItemToThisForm(); // This populates the form from the this.options.InventoryItems


            //
            // This is where we instantiate our single Inventory container. It loads up to ~10-20K of inventory items, and persists so the user has a wonderful inventory experience. :)
            // It could be renamed or broken out from the bwAdvancedProductSearch.js in the future, but as long as it works it is goo dfor th eitme being... 3-29-2023.
            //
            var div = document.getElementsByClassName('bwAdvancedProductSearch')[0];
            if (!div) {

                console.log('In bwSelectInventoryItems.js._create(). Instantiating bwAdvancedProductSearch.js. xcx23142425')
                var elementId = 'divBwAdvancedProductSearch_For_bwSelectInventoryItems_widgets';
                console.log('In bwSelectInventoryItems.js._create(). Adding element to the dom: ' + elementId);
                div = document.createElement('div');
                div.id = elementId;
                div.style.display = 'none';
                document.body.appendChild(div); // Place at end of document

                var BWCustomer = {
                    "CustomerIdentifier": "xx",
                    "Description": "xx_BW CO.",
                    "Level": 2,
                    "LevelDescription": "2",
                    "City": "NOVA SCOTIA",
                    "State": "NS",
                    "CurrencyCode": "CAD",
                    "CompanyNumber": "23",
                    "SellingChannel": "BWINC",
                    "ERP": "BW1"
                }

                var options = {
                    SearchingForModule: 'Distributor',
                    ERP: 'BW1',
                    BWCustomer: BWCustomer,
                    DisplayConfigurationInventory: true
                };
                $(div).bwAdvancedProductSearch(options);

            }

            console.log('In bwSelectInventoryItems._create(). The dialog has been initialized.');

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwSelectInventoryItems</span>';
            html += '<br />';
            html += '<span style="">Exception in bwSelectInventoryItems.Create(): ' + e.message + ', ' + e.stack + '</span>';
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
            .removeClass("bwSelectInventoryItems")
            .text("");
    },
    getDataType: function () {
        try {
            console.log('In bwSelectInventoryItems.js.getDataType().');

            return 'spreadsheet';
        } catch (e) {
            console.log('Exception in bwSelectInventoryItems.js.getDataType(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwSelectInventoryItems.js.getDataType(): ' + e.message + ', ' + e.stack);
        }
    },
    getData: function () {
        try {
            console.log('In bwSelectInventoryItems.js.getData().');

            return this.options.InventoryItems;

            //var data = $(this.element).find('#jsGridSpend_small').jsGrid('option', 'data');
            //if (data.length < 1) {
            //    return null;
            //} else {
            //    try {
            //        JSON.stringify(data); // If this fails, return null. It most likely means that the columns have not been generated for the grid yet... which in turn means that the start and end dates have not been selected.
            //        return data;
            //    } catch (e) {
            //        return null;
            //    }
            //}
        } catch (e) {
            console.log('Exception in bwSelectInventoryItems.getData(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwSelectInventoryItems.getData(): ' + e.message + ', ' + e.stack);
        }
    },
    isARequiredField: function () {
        try {
            console.log('In bwSelectInventoryItems.isARequiredField().');
            return this.options.renderAsARequiredField;
        } catch (e) {
            console.log('Exception in bwSelectInventoryItems.isARequiredField(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwSelectInventoryItems.isARequiredField(): ' + e.message + ', ' + e.stack);
        }
    },
    getfieldTitle: function () {
        try {
            console.log('In bwSelectInventoryItems.getfieldTitle().');
            return this.options.fieldTitle;
        } catch (e) {
            console.log('Exception in bwSelectInventoryItems.getfieldTitle(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwSelectInventoryItems.getfieldTitle(): ' + e.message + ', ' + e.stack);
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

    renderInventoryItems: function (bwBudgetRequestId) {
        try {

            if (bwBudgetRequestId != this.options.bwBudgetRequestId) {

                // Wrong widget. Carry on looking!

            } else {

                console.log('In bwSelectInventoryItems.renderInventoryItems(). bwBudgetRequestId: ' + bwBudgetRequestId);
                var thiz = this;

                var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

                var html = '';

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

                html += '<div id="divDataGridTable" style="overflow-y: scroll;" onscroll="$(\'.bwDataGrid\').bwDataGrid(\'dataGrid_OnScroll\', this);">';

                html += '<table id="dataGridTable" class="dataGridTable" bwworkflowappid="' + 'workflowAppId' + '" style="width:100%;" >';

                html += '  <tr class="headerRow">';
                html += '    <td></td>';
                html += '    <td>Image</td>';
                html += '    <td>Description</td>';
                html += '    <td>Quantity</td>';
                html += '    <td>Price</td>';
                html += '    <td>Total</td>';
                html += '    <td></td>';
                html += '  </tr>';

                html += '  <tr class="filterRow">';
                html += '    <td></td>'; // Magnifying glass.
                html += '    <td></td>';
                html += '    <td></td>';
                html += '    <td></td>';
                html += '    <td></td>';
                html += '    <td></td>';
                html += '    <td></td>'; // Trash bin.
                html += '  </tr>';

                var alternatingRow = 'light'; // Use this to color the rows.
                for (var i = 0; i < thiz.options.InventoryItems.length; i++) {

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
                    //html += ' onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'' + budgetRequests[i].Title + '\', \'' + budgetRequests[i].ProjectTitle + '\', \'' + BriefDescriptionOfProject + '\', \'' + bwWorkflowAppId + '\', \'' + bwBudgetRequestId + '\', \'' + budgetRequests[i].OrgId + '\', \'' + budgetRequests[i].OrgName + '\');this.style.backgroundColor=\'lightgoldenrodyellow\';" ';
                    html += ' onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');this.style.backgroundColor=\'white\';"';
                    html += '   ><img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">';
                    html += '</td>';






                    // Image.
                    var preventCachingGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                    });


                    html += '   <td style="padding:5px;" ';
                    //html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + thiz.options.operationUriPrefix + '\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + budgetRequests[i].Title + '\', \'' + budgetRequests[i].ProjectTitle + '\', \'' + budgetRequests[i].Title + '\');"';
                    html += '   >';






                    //html += '<img xcx="xcx2342462" id="orgImage_' + i + '" src="' + imagePath + '" style="height:120px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;" alt="" onclick="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'btnEdit_OnClick\', \'' + thiz.options.InventoryItems[i].bwInventoryItemId + '\');">';


                    var activeStateIdentifier = JSON.parse($('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier'));

                    if (activeStateIdentifier.status != 'SUCCESS') {

                        html += '[No image. Unauthorized. xcx213124-3]';

                    } else {

                        //html += '<img id="attachmentstest1" xcx="xcx2312-2-2" src="' + thiz.options.operationUriPrefix + fileUrl_Thumbnail + '?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier + '" style="height:120px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;max-width:250px;border:1px solid gray;border-radius:0 30px 0 0;" alt="" ';

                        var imagePath = thiz.options.operationUriPrefix + '_files/' + workflowAppId + '/inventoryimages/' + thiz.options.InventoryItems[i].bwInventoryItemId + '/inventoryimage.png?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier;
                        html += '<img xcx="xcx2342462" id="orgImage_' + i + '" src="' + imagePath + '" style="height:120px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;" alt="" onclick="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'btnEdit_OnClick\', \'' + thiz.options.InventoryItems[i].bwInventoryItemId + '\');">';

                    }







                    //html += budgetRequests[i].OrgName;
                    html += '   </td>';

                    // Use this to retrieve the images after the fact, farther below in this code.
                    //var orgImageFetchingInformation = {
                    //    imageId: 'orgImage_' + i,
                    //    bwOrgId: budgetRequests[i].OrgId
                    //};
                    //orgsImageFetchingInformation.push(orgImageFetchingInformation);





                    // Description
                    //html += '      <td style="padding:5px;" onclick="$(\'.bwRequest\').bwRequest(\'displayRequestFormDialog\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + participantId + '\', \'' + budgetRequests[i].Title + '\');">' + budgetRequests[i].ProjectTitle + '</td>';
                    //html += '      <td style="padding:5px;">' + budgetRequests[i].ProjectTitle + '</td>';
                    html += '   <td style="padding:5px;" ';
                    //html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + thiz.options.operationUriPrefix + '\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + budgetRequests[i].Title + '\', \'' + budgetRequests[i].ProjectTitle + '\', \'' + budgetRequests[i].Title + '\');"';
                    html += '   >' + thiz.options.InventoryItems[i].Title + '</td>';


                    // Quantity.
                    html += '   <td style="padding:5px;" >';
                    html += '       <input class="InventoryItemQuantity" id="inputInventoryItemQuantity_' + thiz.options.InventoryItems[i].bwInventoryItemId + '" style="WIDTH: 40px;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 18pt;TEXT-ALIGN: right;" onchange="$(\'.bwSelectInventoryItems\').bwSelectInventoryItems(\'calculateSelectedInventoryItems\', this, \'' + thiz.options.InventoryItems[i].bwInventoryItemId + '\');" type="text">'; // formatRequestedCapital_InitBudgetRequest
                    html += '   </td>';


                    // Price.
                    //html += '      <td style="padding:5px;" onclick="$(\'.bwRequest\').bwRequest(\'displayRequestFormDialog\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + participantId + '\', \'' + budgetRequests[i].Title + '\');">' + getFriendlyDateAndTime(budgetRequests[i].Created) + '</td>';
                    //html += '      <td style="padding:5px;">' + getFriendlyDateAndTime(budgetRequests[i].Created) + '</td>';
                    html += '   <td style="padding:5px;" ';
                    //html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + thiz.options.operationUriPrefix + '\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + budgetRequests[i].Title + '\', \'' + budgetRequests[i].ProjectTitle + '\', \'' + budgetRequests[i].Title + '\');"';
                    html += '   ><span id="InventoryItemPrice" >' + thiz.options.InventoryItems[i].Price + '</span></td>';

                    // Total
                    //html += '    <td style="padding:5px;" onclick="$(\'.bwRequest\').bwRequest(\'displayRequestFormDialog\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + participantId + '\', \'' + budgetRequests[i].Title + '\');">' + budgetRequests[i].BudgetWorkflowStatus + '</td>';
                    //html += '    <td style="padding:5px;">' + budgetRequests[i].BudgetWorkflowStatus + '</td>';
                    html += '   <td style="padding:5px;" ';
                    //html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + thiz.options.operationUriPrefix + '\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + budgetRequests[i].Title + '\', \'' + budgetRequests[i].ProjectTitle + '\', \'' + budgetRequests[i].Title + '\');"';
                    html += '   ><span id="InventoryItemTotal" style="width:100px;float:right;">' + 'Totalxcx66' + '</span></td>';




                    // Trash Bin
                    html += '<td style="padding:5px;">';
                    //html += 'onclick="$(\'.bwDataGrid\').bwDataGrid(\'cmdDisplayDeleteBudgetRequestDialog\', \'' + budgetRequests[i].bwBudgetRequestId + '\', \'' + budgetRequests[i].Title + '\');">';
                    html += '  <img src="images/trash-can.png" title="Delete" style="cursor:pointer;" onclick="$(\'.bwSelectInventoryItems\').bwSelectInventoryItems(\'removeInventoryItemFromThisRequest\', \'' + thiz.options.InventoryItems[i].bwInventoryItemId + '\', \'' + bwBudgetRequestId + '\');" />';
                    html += '</td>';





                    html += '  </tr>';


                }
                html += '<tr><td colspan="12"></td></tr>'; // DONE
                html += '</table>';


                html += '</div>';



                //html += JSON.stringify(inventoryItemJson, null, 2); // Pretty print.

                $(this.element).find('#bwGridInventory_small').html(html);
                //$(form).find('#bwGridInventory_small').html(html);

            }

        } catch (e) {
            console.log('Exception in bwSelectInventoryItems.renderInventoryItems(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwSelectInventoryItems.renderInventoryItems(): ' + e.message + ', ' + e.stack);
        }
    },
    addInventoryItemToThisForm: function (inventoryItemJson, bwBudgetRequestId) {
        try {

            if (bwBudgetRequestId != this.options.bwBudgetRequestId) {

                // Wrong widget. Keep on looking.

            } else {

                console.log('In bwSelectInventoryItems.addInventoryItemToThisForm(). bwBudgetRequestId: ' + bwBudgetRequestId + ', inventoryItemJson: ' + JSON.stringify(inventoryItemJson));
                //alert('In bwSelectInventoryItems.addInventoryItemToThisForm(). inventoryItemJson: ' + JSON.stringify(inventoryItemJson));
                var thiz = this;

                var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

                if (inventoryItemJson) {
                    // Add this item to the list.
                    this.options.InventoryItems.push(inventoryItemJson);

                    //this.options.InventoryItems = [];
                    //this.options.InventoryItems.push(inventoryItemJson);

                } else {
                    // Do nothing. If we get here it means this is the initial rendering and population of this widget.
                }

                this.renderInventoryItems(bwBudgetRequestId);

            }

        } catch (e) {
            console.log('Exception in bwSelectInventoryItems.addInventoryItemToThisForm(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwSelectInventoryItems.addInventoryItemToThisForm(): ' + e.message + ', ' + e.stack);
        }
    },
    removeInventoryItemFromThisRequest: function (bwInventoryItemId, bwBudgetRequestId) {
        try {

            if (bwBudgetRequestId != this.options.bwBudgetRequestId) {

                // Wrong widget. Keep on looking.

            } else {

                console.log('In bwSelectInventoryItems.removeInventoryItemFromThisRequest(). bwBudgetRequestId: ' + bwBudgetRequestId + ', bwInventoryItemId: ' + bwInventoryItemId);
                var thiz = this;

                var inventoryItemsArray = [];
                for (var i = 0; i < this.options.InventoryItems.length; i++) {
                    if (bwInventoryItemId == this.options.InventoryItems[i].bwInventoryItemId) {
                        // We found it. Now we have to remove it from the json and save it back, then re-render this widget.
                        //delete this.options.InventoryItems[i]; // This doesn't clean up the array, so not using this approach. Making a new array is better.
                    } else {
                        inventoryItemsArray.push(this.options.InventoryItems[i]); // Only push the ones which aren't the one specified... backwards but it works.
                    }
                }
                this.options.InventoryItems = inventoryItemsArray;

                this.renderInventoryItems(bwBudgetRequestId);

            }

        } catch (e) {
            console.log('Exception in bwSelectInventoryItems.removeInventoryItemFromThisRequest(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwSelectInventoryItems.removeInventoryItemFromThisRequest(): ' + e.message + ', ' + e.stack);
        }
    },
    calculateSelectedInventoryItems: function (element, bwInventoryItemId) {
        try {
            console.log('In calculateSelectedInventoryItems().');

            //alert('In calculateSelectedInventoryItems().');

            var quantity = Number($(element).val());
            var inventoryItemPrice = Number($(element).closest('tr').find('#InventoryItemPrice')[0].innerHTML);

            var total = quantity * inventoryItemPrice;

            $(element).closest('tr').find('#InventoryItemTotal')[0].innerHTML = total.toFixed(2);

            //
            // Now, calculate the sub-total of all items.
            //
            var subTotal = 0;

            var rows = $(element).closest('table').find('tr');
            for (var i = 0; i < rows.length; i++) {
                var _total = 0;
                if ($(rows[i]).find('.InventoryItemQuantity') && $(rows[i]).find('.InventoryItemQuantity').length) {
                    var _quantity = $(rows[i]).find('.InventoryItemQuantity').val();
                    if (_quantity) {
                        var _price = Number($(rows[i]).find('#InventoryItemPrice')[0].innerHTML);
                        if (_price) {
                            _total = Number(_quantity) * Number(_price);
                            subTotal += _total;
                        }
                    }
                }
            }
            $('#projectedCapitalSpending_small').val(subTotal.toFixed(2));


            var taxRate = 15;
            $('#inputTaxRate').val(taxRate.toFixed(0) + ' %');

            var totalTax = (taxRate * 0.01) * subTotal;
            $('#inputTotalTax').val(totalTax.toFixed(2));

            var grandTotal = subTotal + totalTax;
            $('#inputGrandTotal').val(grandTotal.toFixed(2));


        } catch (e) {
            console.log('Exception in calculateSelectedInventoryItems(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in calculateSelectedInventoryItems(): ' + e.message + ', ' + e.stack);
        }
    },
    renderAndPopulateSelectedInventoryItemsGrid: function (requestDialogId) {
        try {
            console.log('In renderAndPopulateSelectedInventoryItemsGrid().');
            var thiz = this;
            var html = '';

            //alert('In bwSelectInventoryItems.js.renderAndPopulateSelectedInventoryItemsGrid(). bwBudgetRequestId: ' + this.options.bwBudgetRequestId);


            html += '<div id="divBwInventory" style="display:none;"></div>';
            html += '<div id="divBwInventoryBundling" style="display:none;">></div>';



            // This is our data grid section. THE WIDTH IS SET HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            html += '                       <table style="width:100px;">';
            html += '                        <tbody><tr class="xdTableOffsetRow xdTableOffsetRow-editor" id="toolboxdraggablerow_2" draggable="true" bwwidgetname="bwSelectInventoryItems" bwfieldname="bwSelectInventoryItems">';
            html += '                            <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px;white-space:nowrap;">';
            //html += '                               <span style="font-size:20pt;cursor:zoom-in;" onclick="$(\'.bwSelectInventoryItems\').bwSelectInventoryItems(\'viewInLargeWindow\');"><img src="/images/zoom.jpg" style="width:20px;height:20px;" /></span>';
            html += '                                <span class="xdlabel">';
            html += '                                    Inventory Items:';
            html += '                                </span>';
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

            html += '<div id="divGridContainer">';
            html += '<table>';
            html += '<tr>';
            html += '<td>';

            html += '                                                    <div id="bwGridInventory_small" style="font-size:60%;"></div>'; // overflow-x:scroll;




            html += '<div style="float:right;">';
            html += '   <input type="button" style="cursor:pointer;font-size: 14pt;" value="View inventory..." onclick="$(\'.bwSelectInventoryItems\').bwSelectInventoryItems(\'displayProductAdvancedSearchModalDialog_ForInventoryFormWidget\', \'' + thiz.options.bwBudgetRequestId + '\');" />';
            html += '</div>';






            html += '<br />';




            //html += '                                                    <div id="jsGridSpend_small" style="font-size:60%;"></div>'; // overflow-x:scroll;

            html += '<br />';

            //html += '<div style="float:right;">';
            html += '<table class="xdFormLayout xdTableStyleTwoCol" style="BORDER-TOP-STYLE: none; WORD-WRAP: break-word; BORDER-LEFT-STYLE: none; BORDER-COLLAPSE: collapse; TABLE-LAYOUT: fixed; BORDER-BOTTOM-STYLE: none; BORDER-RIGHT-STYLE: none;width:100%;">';
            html += '   <colgroup>';
            //html += '       <col style="width: 60%;" />';
            //html += '       <col style="width: 30%;" />';
            //html += '       <col style="width: 10%;" />';
            html += '        <col style="width:97px;" />';
            html += '        <col style="" />';
            html += '        <col style="" />';
            html += '   </colgroup>';
            html += '<tbody valign="top">';

            html += '   <tr class="xdTableOffsetRow2">';
            html += '       <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px;BORDER-BOTTOM: #d8d8d8 1pt solid;">';
            html += '           <span id="spanInventoryItems_Total" class="xdlabel" style="color:gray;font-size:10pt;">Total:</span>';
            html += '       </td>';
            html += '       <td class="xdTableOffsetCellComponent" style="text-align:left; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px">';
            html += '                           <input id="projectedCapitalSpending_small" contentEditable="false" style="WIDTH: 140px;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 18pt;TEXT-ALIGN: right;" type="text" />';

            html += '       </td>';
            html += '       <td></td>';
            html += '   </tr>';
            html += '   <tr class="xdTableOffsetRow2">';
            html += '       <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px;BORDER-BOTTOM: #d8d8d8 1pt solid;">';
            html += '           <span class="xdlabel" style="color:gray;font-size:10pt;">Tax Rate (%):</span>';
            html += '       </td>';
            html += '       <td class="xdTableOffsetCellComponent" style="text-align:left; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px">';
            html += '           <div>';
            html += '               <input id="inputTaxRate" style="WIDTH: 140px;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 18pt;TEXT-ALIGN: right;" onblur="$(\'.bwRequest\').bwRequest(\'formatRequestedCapital_InitBudgetRequest\');" type="text">';
            html += '           </div>';
            html += '       </td>';
            html += '       <td></td>';
            html += '   </tr>';
            html += '   <tr class="xdTableOffsetRow2">';
            html += '       <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px;BORDER-BOTTOM: #d8d8d8 1pt solid;">';
            html += '           <span class="xdlabel" style="color:gray;font-size:10pt;">Total Tax:</span>';
            html += '       </td>';
            html += '       <td class="xdTableOffsetCellComponent" style="text-align:left; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px">';
            html += '           <div>';
            html += '               <input id="inputTotalTax" style="WIDTH: 140px;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 18pt;TEXT-ALIGN: right;" onblur="$(\'.bwRequest\').bwRequest(\'formatRequestedCapital_InitBudgetRequest\');" type="text">';
            html += '           </div>';
            html += '       </td>';
            html += '       <td></td>';
            html += '   </tr>';
            html += '   <tr class="xdTableOffsetRow2">';
            html += '       <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px;BORDER-BOTTOM: #d8d8d8 1pt solid;">';
            html += '           <span class="xdlabel" style="color:gray;font-size:10pt;">Grand Total:</span>';
            html += '       </td>';
            html += '       <td class="xdTableOffsetCellComponent" style="text-align:left; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px">';
            html += '           <div>';
            html += '               <input id="inputGrandTotal" style="WIDTH: 140px;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 18pt;TEXT-ALIGN: right;" onblur="$(\'.bwRequest\').bwRequest(\'formatRequestedCapital_InitBudgetRequest\');" type="text" value="">';
            html += '           </div>';
            html += '       </td>';



            html += '<td style="vertical-align:top;float:right;">';
            //if (this.options.inFormsEditor != true) {
            //var bwBudgetRequestId = $(thiz.element).closest('#budgetrequestform')[0].getAttribute('bwbudgetrequestid');
            //var requestDialogId = 'divRequestFormDialog_' + bwBudgetRequestId;
            html += '                               <div style="font-size:20pt;cursor:zoom-in;" onclick="$(\'#' + this.options.jsonData.requestDialogId + '\').find(\'.bwSelectInventoryItems\').bwSelectInventoryItems(\'viewInLargeWindow\');"><img class="gridMagnifyingGlass" src="/images/zoom.jpg" style="width:50px;height:50px;" /></div>';
            //}
            html += '</td>';







            html += '   </tr>';
            html += '</tbody>';
            html += '</table>';
            //html += '</div>';

            html += '</td>';
            // was

            html += '</tr>';

            html += '<tr>';
            html += '   <td>';
            html += '       <span class="xdlabel" id="spanbwSelectInventoryItems_Error" style="color:tomato;white-space:normal;" hidefocus="1"></span>'; // Errors and exceptions get displayed here.
            html += '   </td>';
            html += '</tr>';

            html += '</table>';

            html += '                            </td>';
            html += '                        </tr>';
            html += '                    </tbody>';
            html += '</table>';
            html += '</div>';
            // Render the html.
            if (this.options.inFormsEditor != true) {
                // THIS IS VERY IMPORTANT AND NEEDS TO BE IN EVERY WIDGET!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 7-12-2020
                // Even though the widget regenerates itself (re-renders), the parent TR tag gets missed!!! Therefore we have to handle getting rid of our form editor draggable attribute here.
                this.element.closest('tr').removeAttr('draggable');
            }
            this.element.html(html);




            //var startDate = $('.bwStartDatePicker').bwStartDatePicker('getData');
            //var endDate = $('.bwEndDatePicker').bwEndDatePicker('getData');
            //if ((!startDate || !endDate) || (startDate == null || endDate == null)) {
            //    // do nothing.
            //    //var html = '';
            //    //html += '<span style="color:tomato;font-size:12pt;">Select a new quote itemxcx1 <input type="button" style="cursor:pointer;" value="Search" onclick="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'displayProductAdvancedSearchModalDialog\', \'' + thiz.options.bwBudgetRequestId + '\');" /></select>';
            //    //$(this.element).find('#jsGridSpend_small')[0].innerHTML = html;

            //} else {
            //    // If we have jsonData, populate the element.
            //    //var bwFieldName = 'bwSelectInventoryItems';
            //    //var json = this.options.jsonData['bwSelectInventoryItems'].value;

            //    var months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
            //    var columns = [
            //        //{ name: "SpendingRowId", type: "text", width: 150, validate: "required" },
            //        { name: "Description", type: "text", width: 150 },
            //        { name: "Total", type: "number", width: 50 }//,
            //        //{ type: "control" }
            //    ];
            //    //for (var dt = startDate; dt < endDate.addDays(1) ; dt.setMonth(dt.getMonth() + 1)) {
            //    //    var columnName = months[dt.getMonth()] + ' ' + dt.getFullYear();
            //    //    var row = { name: columnName, type: "number", width: 50 };
            //    //    columns.push(row);
            //    //}
            //    var editColumn = { type: "control" };
            //    columns.push(editColumn);

            //    //if (thiz.options.jsonData["bwSelectInventoryItems"]) {
            //    //    // already have data
            //    //    //var value = this.options.jsonData['bwCostsGrid'].value;
            //    //    //dataElement.value = value;
            //    //    //debugger;
            //    //    if (thiz.options.jsonData["bwSelectInventoryItems"].value) {

            //    //    } else {
            //    //        thiz.options.jsonData["bwSelectInventoryItems"]["value"] = [];
            //    //    }
            //    //} else {
            //    //    // no data yet
            //    //    thiz.options.jsonData["bwSelectInventoryItems"] = {
            //    //        value: []
            //    //    }
            //    //}

            //    var html = '';
            //    //html += '<span style="color:tomato;font-size:12pt;">Select a new quote itemxcx1 <input type="button" value="Search" style="cursor:pointer;" onclick="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'displayProductAdvancedSearchModalDialog\', \'BW1\');" /></select>';
            //    html += '<span style="color:tomato;font-size:12pt;">Select a new quote itemxcx1 <input type="button" value="Search" style="cursor:pointer;" onclick="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'displayProductAdvancedSearchModalDialog\', \'' + thiz.options.bwBudgetRequestId + '\');" /></select>';


            //}

            //$(this.element).find('#gridSummaryFields')[0].innerHTML = html;

        } catch (e) {
            console.log('Exception in renderAndPopulateSelectedInventoryItemsGrid: ' + e.message + ', ' + e.stack);
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwSelectInventoryItems</span>';
            html += '<br />';
            html += '<span style="">Exception in bwSelectInventoryItems.renderAndPopulateSelectedInventoryItemsGrid(): ' + e.message + ', ' + e.stack + '</span>';
            thiz.element.html(html);
        }
    },
    viewInLargeWindow: function () {
        try {
            console.log('In bwCostsGrid.viewInLargeWindow().');
            var thiz = this;

            window.scrollTo(0, 0);
            $('.bwActiveMenu').bwActiveMenu('adjustLeftSideMenu'); // This makes sure our new stretchy-left-menu redraws Ok.

            //var bwBudgetRequestId = $(this.element).closest('#budgetrequestform')[0].getAttribute('bwbudgetrequestid');
            var bwRequestType = $(this.element).closest('#budgetrequestform')[0].getAttribute('bwrequesttype');
            var bwRequestTitle = $(this.element).closest('#budgetrequestform')[0].getAttribute('bwrequesttitle');
            this.pinRequestDialog();
            var requestDialogId = 'divZoomedbwSelectInventoryItemsDialog_' + thiz.options.bwBudgetRequestId;
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
                document.body.appendChild(div); // to place at end of document
            }
            div.innerHTML = html;
            // Now that it is part of the DOM, we can display it!
            $('#' + requestDialogId).dialog({
                modal: false,
                resizable: true,
                closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                width: '1200px',
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
                        html += '<table style="width:100%;" onclick="$(\'.bwRequest\').bwRequest(\'pinRequestDialog\');" ondblclick="$(\'.bwRequest\').bwRequest(\'zoomAndCenter\', \'' + requestDialogId + '\');">'; // This click event is like "pin". Once the user clicks the header of the request dialog, it no longer is modal and persists on the screen until they choose to close it.
                        html += '   <tr>';
                        html += '       <td style="width:95%;">';
                        //html += '           <div id="slider_' + requestDialogId + '" style="width:20%;cursor:pointer;">[' + 'slider_' + requestDialogId + ']</div>';
                        html += '           <div id="slider_' + requestDialogId + '" style="width:20%;cursor:pointer;"></div>';
                        html += '       </td>';
                        html += '       <td style="float:right;">';
                        //html += '           <span class="dialogXButton" style="font-size:25pt;cursor:pointer;width:100%;" onclick="$(\'#' + requestDialogId.replace('_Parent', '') + '\').dialog(\'close\');">X</span>';
                        html += '           <span class="dialogXButton" style="font-size:25pt;cursor:pointer;width:100%;font-weight:bold;" onclick="$(\'.bwPageScrollingHandler\').bwPageScrollingHandler(\'CloseDialogAndPreventNextWindowScrollEvent\', \'' + requestDialogId.replace('_Parent', '') + '\');">X</span>';
                        html += '       </td>';
                        html += '   </tr>';
                        html += '</table>';

                        document.getElementById(requestDialogId).parentNode.querySelector(".ui-dialog-titlebar").innerHTML = html;

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
                        html += '<img id="' + requestDialogId + '_imgRequestOrgImage" src="' + thiz.options.operationUriPrefix + 'images/corporeal.png" style="width:100px;height:100px;"/>';


                        //alert('xcx213121243214234-3 fix the image url here....');

                        // Try to get a custom image. If none found, use the OOB one.
                        //var imagePath2 = thiz.options.operationUriPrefix + '_files/' + workflowAppId + '/orgimages/' + bwOrgId + '/' + 'orgimage.png';

                        var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

                        var preventCachingGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                            return v.toString(16);
                        });

                        var imagePath2;

                        var activeStateIdentifier = JSON.parse($('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier'));

                        if (activeStateIdentifier.status != 'SUCCESS') {

                            imagePath2 = '[No image. Unauthorized. xcx213124-34556-555-556-33]';

                        } else {

                            imagePath2 = thiz.options.operationUriPrefix + '_files/' + workflowAppId + '/orgimages/' + bwOrgId + '/orgimage.png?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier;

                        }











                        $.get(imagePath2).done(function () {
                            setTimeout(function () { // Only needs to happen for Chrome.
                                $('#' + requestDialogId + '_imgRequestOrgImage').attr('src', imagePath2);
                            }, 500);
                        }).fail(function () {
                            //alert("This org has no image."); // do nothing 
                        });
                        // End: Getting the custom image
                        html += '                   </span>';
                        html += '                        </td>';
                        html += '                        <td colspan="2" style="text-align:left;vertical-align:top;">';
                        //html += '                           &nbsp;&nbsp;<span id="' + requestDialogParentId + '_BwRequestType" style="font-size:1em;">';
                        //html += '                               [._BwRequestType]';
                        //html += '                           </span>';
                        html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 40pt;font-weight:bold;">Select Inventory Items</span>';
                        html += '                           <br />';
                        //html += '                           <span id="' + requestDialogParentId + '_WorkflowGuid" style="color:gray;">[._WorkflowGuid]</span>';
                        if (bwRequestTitle == 'New') {
                            html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 25pt;font-weight:bold;">for New Budget Request</span>';
                        } else {
                            html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 25pt;font-weight:bold;cursor:pointer;text-decoration:underline;" '; //>for Budget Request: ' + bwRequestTitle + '</span>';
                            html += 'onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'' + thiz.options.bwBudgetRequestId + '\', \'' + bwRequestTitle + '\', \'\', \'' + bwRequestTitle + '\', \'\');" >';
                            html += 'for Budget Request: ' + bwRequestTitle + '</span>';
                        }
                        //html += '                           <br />';
                        //html += '                           <span style="text-decoration:underline;cursor:pointer;" onclick="$(\'.bwRequest\').bwRequest(\'displayNewRequestWorkflowParticipantsDialog\');" >View Workflow/Participants</span>';
                        html += '                        </td>';
                        html += '                    </tr>';
                        //html += '<tr><td colspan="4" style="height:15px;"></td></tr>';


                        html += '<tr>';
                        html += '   <td colspan="4" style="height:15px;">';
                        html += '       <span class="xdlabel" id="spanbwSelectInventoryItems_Error" style="color:tomato;" hidefocus="1"></span>'; // Errors and exceptions get displayed here.
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
                        html += '               <div id="jsGridSpend_large" style="font-size:60%;"></div>';
                        html += '           </td>';
                        //html += '           <td style="vertical-align:top;">';
                        //html += '               <span style="font-size:20pt;cursor:zoom-in;" onclick="$(\'.bwCostsGrid\').bwCostsGrid(\'viewInLargeWindow\');"><img class="gridMagnifyingGlass" src="/images/zoom.jpg" style="width:50px;height:50px;" /></span>';
                        //html += '           </td>';
                        html += '       </tr>';
                        html += '       <tr>';
                        html += '           <td>';



                        html += '<table class="xdFormLayout xdTableStyleTwoCol" style="BORDER-TOP-STYLE: none; WORD-WRAP: break-word; BORDER-LEFT-STYLE: none; BORDER-COLLAPSE: collapse; TABLE-LAYOUT: fixed; BORDER-BOTTOM-STYLE: none; BORDER-RIGHT-STYLE: none;">';
                        html += '   <colgroup>';
                        html += '       <col style="WIDTH: 195px" />';
                        html += '       <col style="" />';
                        html += '       <col style="" />';
                        html += '   </colgroup>';
                        html += '<tbody valign="top">';

                        html += '   <tr class="xdTableOffsetRow2">';
                        html += '       <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px;BORDER-BOTTOM: #d8d8d8 1pt solid;">';
                        html += '           <span class="xdlabel" style="color:gray;font-size:10pt;">Projected Capital Spending:</span>';
                        html += '       </td>';
                        html += '       <td class="xdTableOffsetCellComponent" style="text-align:left; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px">';
                        html += '           <div>';
                        html += '               <input id="projectedCapitalSpending_large" style="WIDTH: 140px;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 13pt;TEXT-ALIGN: right;" onblur="$(\'.bwRequest\').bwRequest(\'formatRequestedCapital_InitBudgetRequest\');" type="text">';
                        html += '           </div>';
                        html += '       </td>';
                        //html += '       <td></td>';
                        html += '   </tr>';
                        html += '   <tr class="xdTableOffsetRow2">';
                        html += '       <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px;BORDER-BOTTOM: #d8d8d8 1pt solid;">';
                        html += '           <span class="xdlabel" style="color:gray;font-size:10pt;">Amount Forecast:</span>';
                        html += '       </td>';
                        html += '       <td class="xdTableOffsetCellComponent" style="text-align:left; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px">';
                        html += '           <div>';
                        html += '               <input id="inputTaxRate" style="WIDTH: 140px;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 13pt;TEXT-ALIGN: right;" onblur="$(\'.bwRequest\').bwRequest(\'formatRequestedCapital_InitBudgetRequest\');" type="text">';
                        html += '           </div>';
                        html += '       </td>';
                        //html += '       <td></td>';
                        html += '   </tr>';
                        html += '   <tr class="xdTableOffsetRow2">';
                        html += '       <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px;BORDER-BOTTOM: #d8d8d8 1pt solid;">';
                        html += '           <span class="xdlabel" style="color:gray;font-size:10pt;">Amount left to forecast:</span>';
                        html += '       </td>';
                        html += '       <td class="xdTableOffsetCellComponent" style="text-align:left; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px">';
                        html += '           <div>';
                        html += '               <input id="inputTotalTax" style="WIDTH: 140px;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 13pt;TEXT-ALIGN: right;" onblur="$(\'.bwRequest\').bwRequest(\'formatRequestedCapital_InitBudgetRequest\');" type="text">';
                        html += '           </div>';
                        html += '       </td>';
                        //html += '       <td></td>';
                        html += '   </tr>';
                        html += '   <tr class="xdTableOffsetRow2">';
                        html += '       <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px;BORDER-BOTTOM: #d8d8d8 1pt solid;">';
                        html += '           <span class="xdlabel" style="color:gray;font-size:10pt;">Capitalized Interest Rate (%):</span>';
                        html += '       </td>';
                        html += '       <td class="xdTableOffsetCellComponent" style="text-align:left; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px">';
                        html += '           <div>';
                        html += '               xcx123414<input id="inputGrandTotal" style="WIDTH: 140px;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 13pt;TEXT-ALIGN: right;" onblur="$(\'.bwRequest\').bwRequest(\'formatRequestedCapital_InitBudgetRequest\');" type="text" value="">';
                        html += '           </div>';
                        html += '       </td>';



                        html += '   </tr>';
                        html += '</tbody>';
                        html += '</table>';




                        html += '               <br /><br />';
                        html += '           </td>';
                        html += '       </tr>';
                        html += '   </table';
                        document.getElementById(requestDialogParentId + '_Content').innerHTML = html;

                        // If we have jsonData, populate the element.
                        //if (thiz.options.jsonData["bwSelectInventoryItems"]) {
                        //    // already have data
                        //} else {
                        //    // no data yet
                        //    thiz.options.jsonData["bwSelectInventoryItems"] = {
                        //        value: null
                        //    }
                        //}

                        //var startDate = $('.bwStartDatePicker').bwStartDatePicker('getData');
                        //var endDate = $('.bwEndDatePicker').bwEndDatePicker('getData');
                        //if (startDate == null || endDate == null) {
                        // do nothing.
                        //var html = '';




                        //html += '<span style="color:tomato;font-size:12pt;">Select a new quote itemxcx2 <input type="button" value="Search" style="cursor:pointer;" onclick="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'displayProductAdvancedSearchModalDialog\', \'BW1\');" /></select>';





                        //$('#' + requestDialogParentId + '_Content').find('#jsGridSpend_large')[0].innerHTML = html;
                        //$(this.element).find('#divGridContainer')[0].innerHTML = html;
                        //} else {
                        // If we have jsonData, populate the element.
                        //var bwFieldName = 'bwSelectInventoryItems';
                        //var json = this.options.jsonData['bwSelectInventoryItems'].value;

                        //// If we have jsonData, populate the element.
                        //if (thiz.options.jsonData["bwSelectInventoryItems"]) {
                        //    // already have data
                        //} else {
                        //    // no data yet
                        //    thiz.options.jsonData["bwSelectInventoryItems"] = {
                        //        value: null
                        //    }
                        //}

                        var months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
                        var columns = [
                            //{ name: "SpendingRowId", type: "text", width: 150, validate: "required" },
                            { name: "Description", type: "text", width: 150 },
                            { name: "Total", type: "number", width: 50 }//,
                            //{ type: "control" }
                        ];
                        //for (var dt = startDate; dt < endDate.addDays(1) ; dt.setMonth(dt.getMonth() + 1)) {
                        //    var columnName = months[dt.getMonth()] + ' ' + dt.getFullYear();
                        //    var row = { name: columnName, type: "number", width: 50 };
                        //    columns.push(row);
                        //}
                        var editColumn = { type: "control" };
                        columns.push(editColumn);

                        var html = '';
                        //html += '<span style="color:tomato;font-size:12pt;">Select a new quote itemxcx2 <input type="button" value="Search" style="cursor:pointer;" onclick="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'displayProductAdvancedSearchModalDialog\', \'BW1\');" /></select>';
                        html += '<span style="color:tomato;font-size:12pt;">Select a new quote itemxcx2 <input type="button" value="Search" style="cursor:pointer;" onclick="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'displayProductAdvancedSearchModalDialog\', \'' + thiz.options.bwBudgetRequestId + '\');" /></select>';

                        $('#' + requestDialogParentId + '_Content').find("#jsGridSpend_large").jsGrid({
                            width: "100%",
                            //height: "400px",

                            //width: "auto",
                            height: "auto",

                            confirmDeleting: false, // false prevents the alert from popping up

                            inserting: true,
                            editing: true,
                            sorting: true,
                            paging: true,

                            data: thiz.options.jsonData["bwSelectInventoryItems"].value, // json,
                            noDataContent: html, //"Click the \"Plus\" (+) sign to add a Spend item...",

                            onRefreshed: function (args) { // jsGridCosts_small
                                try {
                                    //debugger;
                                    var grandTotal = Number(0);
                                    for (var i = 0; i < this.data.length; i++) {
                                        // Now iterate through all the months and add them up. Just ignore "Description" and "Total" fields!!
                                        for (var c = 0; c < columns.length; c++) {
                                            if (columns[c].type == 'number' && columns[c].name != 'Total') {
                                                var columnName = columns[c].name;
                                                var columnValue = this.data[i][columnName];
                                                if (columnValue) {
                                                    grandTotal += Number(columnValue);
                                                }
                                            }
                                        }
                                        this.data[i].Total = grandTotal;
                                    }

                                    //var totalLease = Number(0);
                                    //var totalExpense = Number(0);
                                    //var totalCapital = Number(0);
                                    //this.data.forEach(function (item) {
                                    //    var total = Number(0);
                                    //    if (item.Lease) {
                                    //        totalLease += Number(item.Lease);
                                    //        total += Number(item.Lease);
                                    //    }
                                    //    if (item.Expense) {
                                    //        totalExpense += Number(item.Expense);
                                    //        total += Number(item.Expense);
                                    //    }
                                    //    if (item.Capital) {
                                    //        totalCapital += Number(item.Capital);
                                    //        total += Number(item.Capital);
                                    //    }
                                    //    if (item.Total) {
                                    //        item.Total = total;
                                    //    }
                                    //});
                                    //var grandTotal = totalLease + totalExpense + totalCapital;

                                    //var html = '';
                                    //html += '<tr>';

                                    //html += '<td>';
                                    //html == 'Total Costs';
                                    //html += '</td>';

                                    //html += '<td class="jsgrid-cell" style="text-align:right;">';
                                    //html += formatCurrencyNoDecimalNoDollarSign(totalLease);
                                    //html += '</td>';

                                    //html += '<td class="jsgrid-cell" style="text-align:right;">';
                                    //html += formatCurrencyNoDecimalNoDollarSign(totalExpense);
                                    //html += '</td>';

                                    //html += '<td class="jsgrid-cell" style="text-align:right;">';
                                    //html += formatCurrencyNoDecimalNoDollarSign(totalCapital);
                                    //html += '</td>';

                                    //html += '<td class="jsgrid-cell" style="text-align:right;">';
                                    //html += formatCurrencyNoDecimalNoDollarSign(grandTotal);
                                    //html += '</td>';

                                    //html += '</tr>';
                                    //this._content.append(html);

                                    thiz.options.jsonData["bwSelectInventoryItems"].value = this.data; // Store in the widget.

                                    //var bwBudgetRequestId = $(thiz.element).closest('#budgetrequestform')[0].getAttribute('bwbudgetrequestid');
                                    var requestDialogId = 'divZoomedbwSelectInventoryItemsDialog_' + thiz.options.bwBudgetRequestId;
                                    $('#' + requestDialogId).find('#projectedCapitalSpending_large')[0].value = formatCurrencyNoDecimal(grandTotal); // Update the smaller grid grand total.
                                    $('#' + requestDialogId).find('#amountForecast')[0].value = formatCurrencyNoDecimal(grandTotal); // Update the smaller grid grand total.
                                    $('#' + requestDialogId).find('#amountLeftToForecast')[0].value = formatCurrencyNoDecimal(grandTotal); // Update the smaller grid grand total.
                                    $('#' + requestDialogId).find('#interestRate')[0].value = formatCurrencyNoDecimal(grandTotal); // Update the smaller grid grand total.


                                    //document.getElementById('projectedCapitalSpending_small').value = formatCurrencyNoDecimal(grandTotal);
                                    //debugger;
                                    //$("#projectedCapitalSpending_small").value = formatCurrencyNoDecimal(grandTotal); // Update the smaller grid grand total.

                                    //if ($(thiz.element).closest('#budgetrequestform').find("#projectedCapitalSpending_small")[0]) {
                                    //$(thiz.element).closest('#budgetrequestform').find('#projectedCapitalSpending_small')[0].value = formatCurrencyNoDecimal(grandTotal); // Update the smaller grid grand total.
                                    //}

                                    //var bwBudgetRequestId = $(thiz.element).closest('#budgetrequestform')[0].getAttribute('bwbudgetrequestid');
                                    //var requestDialogId = 'divZoomedBwCostsGridDialog_' + bwBudgetRequestId;
                                    //if ($('#' + requestDialogId).find('#jsGridCosts_large')) { // If the large one is displayed, update it!
                                    //    if ($('#' + requestDialogId).find('#grandTotal_large')[0]) {
                                    //        $('#' + requestDialogId).find('#grandTotal_large')[0].value = formatCurrencyNoDecimal(grandTotal); // Update the grand total in the large window.
                                    //    }
                                    //}

                                } catch (e) {
                                    console.log('Exception in bwSelectInventoryItems.onRefreshed: ' + e.message + ', ' + e.stack);
                                    $('#spanbwSelectInventoryItems_Error')[0].innerHTML = 'Exception in bwSelectInventoryItems.onRefreshed: ' + e.message + ', ' + e.stack;
                                }
                            },
                            onItemInserted: function () {
                                try {
                                    //console.log('In bwCostsGrid.onItemInserted().');
                                    thiz.options.jsonData["bwSelectInventoryItems"].value = this.data; // Store in the widget.
                                    $(thiz.element).closest('#budgetrequestform').find("#jsGridSpend_small").jsGrid("option", "data", thiz.options.jsonData["bwSelectInventoryItems"].value); // Update the smaller grid.
                                } catch (e) {
                                    console.log('Exception in bwCostsGrid.onItemInserted: ' + e.message + ', ' + e.stack);
                                }
                            },
                            onItemUpdated: function () {
                                try {
                                    //console.log('In bwCostsGrid.onItemInserted().');
                                    thiz.options.jsonData["bwSelectInventoryItems"].value = this.data; // Store in the widget.
                                    $(thiz.element).closest('#budgetrequestform').find("#jsGridSpend_small").jsGrid("option", "data", thiz.options.jsonData["bwSelectInventoryItems"].value); // Update the smaller grid.
                                } catch (e) {
                                    console.log('Exception in bwCostsGrid.onItemInserted: ' + e.message + ', ' + e.stack);
                                }
                            },
                            onItemDeleted: function () {
                                try {
                                    //console.log('In bwCostsGrid.onItemInserted().');
                                    thiz.options.jsonData["bwSelectInventoryItems"].value = this.data; // Store in the widget.
                                    $(thiz.element).closest('#budgetrequestform').find("#jsGridSpend_small").jsGrid("option", "data", thiz.options.jsonData["bwSelectInventoryItems"].value); // Update the smaller grid.
                                } catch (e) {
                                    console.log('Exception in bwCostsGrid.onItemInserted: ' + e.message + ', ' + e.stack);
                                }
                            },

                            fields: columns
                        });
                        //}

                    } catch (e) {
                        console.log('Exception in bwSelectInventoryItems.viewInLargeWindow().dialog.open(): ' + e.message + ', ' + e.stack);
                    }
                }
            });
            try {
                $('.ui-widget-overlay')[0].style.zIndex = 9;
                $('#' + requestDialogId).dialog().parents('.ui-dialog')[0].style.zIndex = 10; // THIS IS A HACK ?? IS THIS THE BEST PLACE FOR THIS ?? >>>>>>>>>>>>>>>>>>>>>>>>>>>> 2-15-2020
            } catch (e) {

            }
        } catch (e) {
            console.log('Exception in bwSelectInventoryItems.viewInLargeWindow(): ' + e.message + ', ' + e.stack);
        }
    },




    displayProductAdvancedSearchModalDialog_ForInventoryFormWidget: function (bwBudgetRequestId) { // erp) {
        try {
            console.log('In displayProductAdvancedSearchModalDialog(). bwBudgetRequestId: ' + bwBudgetRequestId);
            var thiz = this;

            this.options.bwBudgetRequestId = bwBudgetRequestId;

            //this.options.ERP = 'BW2'; //erp.toUpperCase(); // 1-19-2022 GET RID OF THIS eventually.
            $('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'ERP', 'BW2');


            var dialogId = 'bwAdvancedProductSearch_ProductCatalog_ForInventoryFormWidget';
            var div = document.getElementById(dialogId);
            if (!div) {

                console.log('In displayProductAdvancedSearchModalDialog_ForInventoryFormWidget(). Adding element to the dom: ' + dialogId);

                div = document.createElement('div');
                div.id = dialogId;
                div.style.display = 'none';
                div.style.backgroundColor = '#f5f6fa'; // space white
                document.body.appendChild(div); // Place at end of document

                $(div).dialog({
                    modal: false,
                    resizable: true,
                    closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                    hide: false, // This means when hiding just disappear with no effects.
                    height: 1200,
                    width: 1400,
                    open: function () {
                        try {

                            thiz.renderProductSearchScreen_ForInventoryFormWidget(bwBudgetRequestId); // thiz.renderProductSearchScreen();

                        } catch (e) {
                            console.log('Exception in displayProductAdvancedSearchModalDialog.open(): ' + e.message + ', ' + e.stack);
                            displayAlertDialog('Exception in displayProductAdvancedSearchModalDialog.open(): ' + e.message + ', ' + e.stack);
                        }
                    },
                    close: function () {
                        try {

                            //$(this).dialog('destroy');

                        } catch (e) {
                            console.log('Exception in displayProductAdvancedSearchModalDialog.close(): ' + e.message + ', ' + e.stack);
                        }
                    }
                });
                //$("#bwProductCatalog1").closest(".ui-dialog").children(".ui-dialog-titlebar").css("background", "lightblue"); // This sets the color of the title bar.

            } else {

                $(div).dialog({
                    modal: false,
                    resizable: true,
                    closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                    hide: false, // This means when hiding just disappear with no effects.
                    height: 1200,
                    width: 1400,
                    open: function () {
                        try {

                            // Dont do this it has already been rendered. 4-7-2023.
                            thiz.renderProductSearchScreen_ForInventoryFormWidget(bwBudgetRequestId); // thiz.renderProductSearchScreen();

                        } catch (e) {
                            console.log('Exception in displayProductAdvancedSearchModalDialog.open(): ' + e.message + ', ' + e.stack);
                            displayAlertDialog('Exception in displayProductAdvancedSearchModalDialog.open(): ' + e.message + ', ' + e.stack);
                        }
                    },
                    close: function () {
                        try {

                            //$(this).dialog('destroy');

                        } catch (e) {
                            console.log('Exception in displayProductAdvancedSearchModalDialog.close(): ' + e.message + ', ' + e.stack);
                        }
                    }
                });
                //$("#bwProductCatalog1").closest(".ui-dialog").children(".ui-dialog-titlebar").css("background", "lightblue"); // This sets the color of the title bar.

            }



            $('#btnAdvancedProductSearch').blur(); // Weird behavior of the cursor ending up in the button. This fixes it.

            //$('#divBwAdvancedProductSearch1').html(''); // Clear the display.
            //$(div).html('');

            //alert('Displaying dialog bwProductCatalog1 xcx123123122');
            //$('#bwProductCatalog1').dialog({
            //$(div).dialog({
            //    modal: false,
            //    resizable: true,
            //    closeOnEscape: true, // Hit the ESC key to hide! Yeah!
            //    //dialogClass: "no-close", // No close button in the upper right corner.
            //    hide: false, // This means when hiding just disappear with no effects.
            //    height: 1200,
            //    width: 1400,

            //    //containment: false,

            //    //position: {
            //    //    my: "right-20 top-70",
            //    //    at: "left top",
            //    //    of: "#createnewquoteform"
            //    //},
            //    //position: {
            //    //    my: "middle top+12",
            //    //    at: "middle top",
            //    //    of: window //"#btnAdvancedProductSearch"
            //    //},
            //    open: function () {
            //        try {

            //            //$('#bwProductCatalog1').dialog("widget").draggable({ containment: false }); // This lets the user drag the modal dialog outside of the page, which is great because it allows them to see more of the screen if they need to.

            //            thiz.renderProductSearchScreen_ForInventoryFormWidget(); // thiz.renderProductSearchScreen();

            //        } catch (e) {
            //            console.log('Exception in displayProductAdvancedSearchModalDialog.open(): ' + e.message + ', ' + e.stack);
            //            displayAlertDialog('Exception in displayProductAdvancedSearchModalDialog.open(): ' + e.message + ', ' + e.stack);
            //        }
            //    },
            //    close: function () {
            //        try {

            //            //$('#bwProductCatalog1').dialog('destroy'); // Get rid of the widget. This calls it's _destroy() method.

            //            //$('#bwProductCatalog1').dialog('destroy'); // 7-5-2020 THIS IS THE PREFFERED SYNTAX FOR THIS FROM NOW ON!!!!!!!!!!!!!!!!!!!!!!!!! // 1-24-2022 ????????????

            //        } catch (e) {
            //            console.log('Exception in displayProductAdvancedSearchModalDialog.close(): ' + e.message + ', ' + e.stack);
            //        }
            //    }
            //});
            ////$("#bwProductCatalog1").closest(".ui-dialog").children(".ui-dialog-titlebar").css("background", "lightblue"); // This sets the color of the title bar.

        } catch (e) {
            console.log('Exception in displayProductAdvancedSearchModalDialog(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in displayProductAdvancedSearchModalDialog(): ' + e.message + ', ' + e.stack);
        }
    },

    renderProductSearchScreen_ForInventoryFormWidget: function (bwBudgetRequestId) {
        try {
            console.log('');
            console.log('In bwAdvancedProductSearch.js.renderProductSearchScreen_ForInventoryFormWidget(). bwBudgetRequestId: ' + bwBudgetRequestId);
            console.log('');
            //alert('In bwAdvancedProductSearch.js.renderProductSearchScreen_ForInventoryFormWidget(). bwBudgetRequestId: ' + bwBudgetRequestId);
            var thiz = this;
            ShowActivitySpinner();

            //if (!this.options.ERP.toUpperCase()) { 
            if (!$('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'ERP').toUpperCase()) {
                alert('Error: Customer ERP value is undefined. This process cannot continue.');
            } else {
                //
                // For now we are hardcoding the data objects, until I get them into a form in the database.
                // This just lets us execute the widget for the time being. :) 
                //
                //var data = [
                //    {
                //        ActiveProductId: "2134-556-557",
                //        Color: "RED",
                //        ConsumerItem: "",
                //        ExtendedDescription: "DEAD WEIGHT: 3.79 LBS. GROSS WEIGHT: 6.05 LBS.",
                //        MinOrderQty: 4,
                //        OrderUOM: "CS",
                //        PrintTypeCode: "NP",
                //        PrintTypeDescription: "NO PRINT",
                //        PrivateLabel: false,
                //        ProductCode: "2134-556-557",
                //        ProductDescription: "2134 RED 610MMX33M UPPER PNL 1of6",
                //        ProductId: 1014,
                //        Segment: "Panels",
                //        SourceSystem: "Prism",
                //        Style: "4118",
                //        SubClass: "30",
                //        SubClassDescription: "PANELS",
                //        UnitHeight: 0,
                //        UnitHeightUOM: "  ",
                //        UnitLength: 33,
                //        UnitLengthUOM: "M ",
                //        UnitWidth: 610,
                //        UnitWidthUOM: "MM"
                //    },
                //    {
                //        ActiveProductId: "2134-556-558",
                //        Color: "WHITE",
                //        ConsumerItem: "",
                //        ExtendedDescription: "DEAD WEIGHT: 3.79 LBS. GROSS WEIGHT: 6.05 LBS.",
                //        MinOrderQty: 4,
                //        OrderUOM: "CS",
                //        PrintTypeCode: "NP",
                //        PrintTypeDescription: "NO PRINT",
                //        PrivateLabel: false,
                //        ProductCode: "2134-556-558",
                //        ProductDescription: "2134 WHITE 610MMX33M UPPER PNL 2of6",
                //        ProductId: 1014,
                //        Segment: "Panels",
                //        SourceSystem: "Prism",
                //        Style: "4119",
                //        SubClass: "30",
                //        SubClassDescription: "PANELS",
                //        UnitHeight: 0,
                //        UnitHeightUOM: "  ",
                //        UnitLength: 33,
                //        UnitLengthUOM: "M ",
                //        UnitWidth: 610,
                //        UnitWidthUOM: "MM"
                //    },
                //    {
                //        ActiveProductId: "2134-556-559",
                //        Color: "BLUE",
                //        ConsumerItem: "",
                //        ExtendedDescription: "DEAD WEIGHT: 3.79 LBS. GROSS WEIGHT: 6.05 LBS.",
                //        MinOrderQty: 4,
                //        OrderUOM: "CS",
                //        PrintTypeCode: "NP",
                //        PrintTypeDescription: "NO PRINT",
                //        PrivateLabel: false,
                //        ProductCode: "2134-556-559",
                //        ProductDescription: "2134 BLUE 610MMX33M UPPER PNL 3of6",
                //        ProductId: 1014,
                //        Segment: "Panels",
                //        SourceSystem: "Prism",
                //        Style: "xcx7756",
                //        SubClass: "30",
                //        SubClassDescription: "PANELS",
                //        UnitHeight: 0,
                //        UnitHeightUOM: "  ",
                //        UnitLength: 33,
                //        UnitLengthUOM: "M ",
                //        UnitWidth: 610,
                //        UnitWidthUOM: "MM"
                //    }
                //];

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
                        ProductCode: "K7000G",
                        Description: "240 NAT 72MMX450 CENTRAL 10",
                        ProductId: "238715",
                        QuantityBreak: 9,
                        QuoteId: null,
                        UOM: "SF",
                        UnitOfMeasureId: null
                    }
                ];


                //var operationUri = '/Distributor/AdvancedProductSearch?erp=' + this.options.ERP.toUpperCase(); // 'BW2', 'BW1'.
                //$.ajax({
                //    url: operationUri,
                //    type: "GET",
                //    contentType: 'application/json',
                //    timeout: this.options.ajaxTimeout,
                //    success: function (data) {
                //try {

                //debugger;
                // Now get the bundles for this customer.
                //var operationUri = '/api/BundleItems?CustomerId=' + thiz.options.BWCustomer.CustomerIdentifier;
                //$.ajax({
                //    url: operationUri,
                //    type: "GET",
                //    contentType: 'application/json',
                //    timeout: thiz.options.ajaxTimeout,
                //    success: function (bundles) {
                try {
                    //thiz.options.Bundles = bundles;
                    $('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'Bundles', bundles);



                    //thiz.options.json = data;




                    //for (var i = 0; i < thiz.options.json.length; i++) {
                    //    this.options.json[i]["Segment"] = 'Hamburgers';
                    //    this.options.json[i]["SubClassDescription"] = 'HAMBURGERS';
                    //    this.options.json[i]["SubClass"] = '30';

                    //    this.options.json[i]["ProductId"] = this.options.json[i].bwInventoryItemId;
                    //    //this.options.json[i]["ProductId"] = this.options.json[i].bwInventoryItemId;

                    //    //this.options.json[i]["ProductCode"] = '30';
                    //    this.options.json[i]["Description"] = this.options.json[i].Description;

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







                    var json = $('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'json');



                    var productSegments = [];
                    //for (var i = 0; i < this.options.json.length; i++) {
                    for (var i = 0; i < json.length; i++) {
                        if (!(productSegments.indexOf(json[i].Segment) > -1)) {
                            productSegments.push(json[i].Segment);
                        }
                    }
                    //thiz.options.productSegments = productSegments;
                    $('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'productSegments', productSegments);

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

                    html += '<div id="bwAdvancedProductSearch_ProductCatalog_ForInventoryFormWidget_bwAdvancedProductSearch_Error" style="color:tomato;font-size:10pt;font-weight:bold;font-style:italic;background-color:white;"></div>'; // Errors get displayed here.

                    // HARDCODED xcx1!!!!!!! REPLACING the source system/erp with a friendly name. 
                    var companyName = '';
                    //switch (thiz.options.ERP.toUpperCase()) {
                    switch ($('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'ERP').toUpperCase()) {
                        case "BW1":
                            companyName = 'Polyair';
                            break;
                            //case "M2M":
                            //    companyName = 'xcx336790';
                            //    break;
                        case "BW2":
                            companyName = 'Stark Enterprises xcx1';
                            break;
                        default:
                            alert('ERROR: Unexpected value for thiz.options.ERP: [' + $('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'ERP') + '].');
                    }
                    html += '<br />';
                    html += '<span style="font-size:20pt;font-weight:bold;color:blue;">' + companyName + '</span>';
                    html += '<br />';
                    html += '<br />';
                    html += '<form>';
                    html += '   <label>Product Searchxcx2</label>';
                    html += '   <br />';
                    html += '   <input class="focus" id="bwAdvancedProductSearch_ProductCatalog_ForInventoryFormWidget_txtAdvancedProductSearch" name="bwAdvancedProductSearch_ProductCatalog_ForInventoryFormWidget_txtAdvancedProductSearch" placeholder="Enter the product name or item numberxcx2" type="text" value="" style="width:350px;" />';
                    html += '&nbsp;&nbsp;';
                    html += '<input type="input" class="button-blue" onclick="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'clearTheSearchBox_ForInventoryFormWidget\');" value="Clear" style="width:100px;" />';

                    //html += '<div style="float:right;"><input type="input" class="button-blue" onclick="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'displayAddInventoryItemDialog\');" value="Add inventory item" style="width:200px;" /></div>';


                    html += '</form>';

                    if (productSegments.length == 1) {
                        // Since there is only one product segment, we won't display the segment top menu bar. This happens for Polyair at the moment.
                    } else {
                        html += '<span id="bwAdvancedProductSearch_ProductCatalog_ForInventoryFormWidget_productSegmentTopMenubar">';
                        for (var i = 0; i < productSegments.length; i++) {
                            html += '| <span style="cursor:pointer;" class="bwHoverLink1" onclick="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'productSegment_Click\', \'' + productSegments[i] + '\');">' + productSegments[i] + '</span> ';
                        }
                        html += '|</span>';
                        html += '<br />';
                    }

                    html += '<hr />';
                    html += '<span id="bwAdvancedProductSearch_ProductCatalog_ForInventoryFormWidget_productSubclassTopMenubar" style="padding-left:40px;font-size:12pt;"></span>';
                    html += '<br />';
                    html += '<hr />';
                    html += '<table>';
                    html += '   <tr>';
                    html += '       <td colspan="2">';
                    html += '           <span id="bwAdvancedProductSearch_ProductCatalog_ForInventoryFormWidget_productBreadcrumbAndTitleMenubar">';
                    html += '           </span>';
                    html += '       </td>';
                    html += '   </tr>';
                    html += '   <tr>';
                    html += '       <td id="bwAdvancedProductSearch_ProductCatalog_ForInventoryFormWidget_tdProductFilterSection" style="width:15%;vertical-align:top;">';
                    //html += '           FILTER SECTION';
                    html += '       </td>';
                    html += '       <td style="width:85%;vertical-align:top;">';
                    html += '           <span id="bwAdvancedProductSearch_ProductCatalog_ForInventoryFormWidget_productsContentSections">';
                    //html += '               CONTENT SECTION';
                    html += '           </span>';
                    html += '       </td>';
                    html += '   </tr>';
                    html += '</table>';

                    // Render the html.
                    //$('#divBwAdvancedProductSearch1').html(html);
                    $('#bwAdvancedProductSearch_ProductCatalog_ForInventoryFormWidget').html(html);

                    //alert('xcx23123 Rendered the html. Did it show up in element [bwAdvancedProductSearch_ProductCatalog_ForInventoryFormWidget]? html: ' + html);

                    document.getElementById('bwAdvancedProductSearch_ProductCatalog_ForInventoryFormWidget_productSubclassTopMenubar').innerHTML = '';
                    document.getElementById('bwAdvancedProductSearch_ProductCatalog_ForInventoryFormWidget_productBreadcrumbAndTitleMenubar').innerHTML = '';

                    var basicSearchValue = $('#txtProdSrch').val();
                    $('#bwAdvancedProductSearch_ProductCatalog_ForInventoryFormWidget_txtAdvancedProductSearch').val(basicSearchValue); // Carryover from the basic search form page.

                    //
                    // We always select the first product segment and subclass in the top menu bar. This just gives the user a better experince, because they see the "default landing page for the catalog".
                    //
                    //debugger;
                    //thiz.options.latestSelectedProductSegment = thiz.options.productSegments[0];
                    $('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'latestSelectedProductSegment', $('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'productSegments')[0])

                    //thiz.renderSegmentTopMenuBar(thiz.options.productSegments[0]);
                    //thiz.renderSubClassTopMenuBar(thiz.options.productSegments[0], '0'); // 0 means it will display the root node

                    // 3-27-2023
                    //thiz.renderSegmentTopMenuBar_ForInventoryFormWidget(thiz.options.productSegments[0]);
                    //thiz.renderSubClassTopMenuBar_ForInventoryFormWidget(thiz.options.productSegments[0], '0'); // 0 means it will display the root node
                    thiz.renderSegmentTopMenuBar_ForInventoryFormWidget($('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'productSegments')[0]);
                    thiz.renderSubClassTopMenuBar_ForInventoryFormWidget($('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'productSegments')[0], '0'); // 0 means it will display the root node



                    //thiz.renderBreadcrumbTopMenuBar_ForInventoryFormWidget(thiz.options.productSegments[0], thiz.options.productSubClasses[0]);
                    //thiz.options.filters = null; // We need to reset the filters when the user navigates to a new subclass.
                    thiz.renderBreadcrumbTopMenuBar_ForInventoryFormWidget($('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'productSegments')[0], $('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'productSubClasses')[0]);
                    $('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'filters', null); // We need to reset the filters when the user navigates to a new subclass.
                    //debugger;


                    thiz.renderFilterAndProductsSections_ForInventoryFormWidget($('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'productSegments')[0], $('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'productSubClasses')[0], false, bwBudgetRequestId);

                    $("#bwAdvancedProductSearch_ProductCatalog_ForInventoryFormWidget_txtAdvancedProductSearch").autocomplete({
                        source: function (request, response) {
                            try {
                                console.log('In bwAdvancedProductSearch.bwAdvancedProductSearch_ProductCatalog_ForInventoryFormWidget_txtAdvancedProductSearch.autocomplete.source().');
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
                                            Description: data[i].Description
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
                                console.log('Exception in bwAdvancedProductSearch.bwAdvancedProductSearch_ProductCatalog_ForInventoryFormWidget_txtAdvancedProductSearch.autocomplete.source(): ' + e.message + ', ' + e.stack);
                                document.getElementById('bwAdvancedProductSearch_ProductCatalog_ForInventoryFormWidget_bwAdvancedProductSearch_Error').innerHTML = 'Exception in bwAdvancedProductSearch.bwAdvancedProductSearch_ProductCatalog_ForInventoryFormWidget_txtAdvancedProductSearch.autocomplete.source(): ' + e.message + ', ' + e.stack;
                            }
                        },
                        minLength: 1, // minLength specifies how many characters have to be typed before this gets invoked.
                        select: function (event, ui) {
                            try {
                                console.log('In bwAdvancedProductSearch.bwAdvancedProductSearch_ProductCatalog_ForInventoryFormWidget_txtAdvancedProductSearch.autocomplete.select().');

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
                                    thiz.renderSegmentTopMenuBar_ForInventoryFormWidget(product.Segment);
                                    thiz.renderSubClassTopMenuBar_ForInventoryFormWidget(product.Segment, product.SubClassDescription);
                                    thiz.renderBreadcrumbTopMenuBar_ForInventoryFormWidget(product.Segment, product.SubClassDescription);

                                    thiz.options.latestSelectedProductSegment = product.Segment;
                                    thiz.options.latestSelectedProductSubClass = product.SubClassDescription;

                                    var highlightThisProductCode = selectedValue.split('-')[0].trim(); // If we get a value here, pass it on, so we can highlight those ones!!

                                    //thiz.renderFilterAndProductsSections(product.Segment, product.SubClassDescription, highlightThisProductCode); // Now render everything.
                                    thiz.renderFilterAndProductsSections_ForInventoryFormWidget(product.Segment, product.SubClassDescription, highlightThisProductCode); // Now render everything.

                                    document.getElementById('bwAdvancedProductSearch_ProductCatalog_ForInventoryFormWidget_txtAdvancedProductSearch').style.color = 'red'; // When the search box has valid search text, it should be red.

                                } else {
                                    // Error: Could not find product. This should never happen.
                                    console.log('Error in bwAdvancedProductSearch.bwAdvancedProductSearch_ProductCatalog_ForInventoryFormWidget_txtAdvancedProductSearch.autocomplete.select():. Could not find product: ' + selectedValue);
                                    document.getElementById('bwAdvancedProductSearch_ProductCatalog_ForInventoryFormWidget_bwAdvancedProductSearch_Error').innerHTML = 'Error in bwAdvancedProductSearch.bwAdvancedProductSearch_ProductCatalog_ForInventoryFormWidget_txtAdvancedProductSearch.autocomplete.select():. Could not find product: ' + selectedValue;
                                }
                            } catch (e) {
                                //HideActivitySpinner();
                                console.log('Exception in bwAdvancedProductSearch._create.bwAdvancedProductSearch_ProductCatalog_ForInventoryFormWidget_txtAdvancedProductSearch.autocomplete.select(): ' + e.message + ', ' + e.stack);
                                document.getElementById('bwAdvancedProductSearch_ProductCatalog_ForInventoryFormWidget_bwAdvancedProductSearch_Error').innerHTML = 'Exception in bwAdvancedProductSearch.bwAdvancedProductSearch_ProductCatalog_ForInventoryFormWidget_txtAdvancedProductSearch.autocomplete.select(): ' + e.message + ', ' + e.stack;
                            }
                        },
                        open: function () {
                            console.log('In bwAdvancedProductSearch.bwAdvancedProductSearch_ProductCatalog_ForInventoryFormWidget_txtAdvancedProductSearch.autocomplete.open().');

                        },
                        close: function () {
                            try {
                                //HideActivitySpinner();

                                if (!thiz.options.searchBoxEvent_keyup) {
                                    // This makes sure we only attach this event handler one time only.
                                    var element = document.getElementById('bwAdvancedProductSearch_ProductCatalog_ForInventoryFormWidget_txtAdvancedProductSearch');
                                    element.addEventListener("keyup", function searchBoxEvent_keyup() {
                                        console.log('In element.addEventListener.keyup().');

                                        // Need a global reference to this because to removeeventlistener, a reference to the function is always required.
                                        thiz.options.searchBoxEvent_keyup = searchBoxEvent_keyup;

                                        thiz.clearTheSearchBox_ForInventoryFormWidget(element);

                                    }, false);
                                }
                            } catch (e) {
                                //HideActivitySpinner();
                                console.log('Exception in bwAdvancedProductSearch.bwAdvancedProductSearch_ProductCatalog_ForInventoryFormWidget_txtAdvancedProductSearch.autocomplete.close(): ' + e.message + ', ' + e.stack);
                                document.getElementById('bwAdvancedProductSearch_ProductCatalog_ForInventoryFormWidget_bwAdvancedProductSearch_Error').innerHTML = 'Exception in bwAdvancedProductSearch.bwAdvancedProductSearch_ProductCatalog_ForInventoryFormWidget_txtAdvancedProductSearch.autocomplete.close(): ' + e.message + ', ' + e.stack;
                            }
                        }
                    });

                    //debugger;
                    HideActivitySpinner();

                } catch (e) {
                    HideActivitySpinner();

                    console.log('Exception in renderProductSearchScreen.api/BundleItems(): ' + e.message + ', ' + e.stack);
                    displayAlertDialog('Exception in renderProductSearchScreen.api/BundleItems(): ' + e.message + ', ' + e.stack);

                    alert('Exception in renderProductSearchScreen.api/BundleItems(): ' + e.message + ', ' + e.stack);

                    if (document.getElementById('bwAdvancedProductSearch_ProductCatalog_ForInventoryFormWidget_bwAdvancedProductSearch_Error')) {
                        document.getElementById('bwAdvancedProductSearch_ProductCatalog_ForInventoryFormWidget_bwAdvancedProductSearch_Error').innerHTML = 'Exception in renderProductSearchScreen.api/BundleItems():2: ' + e.message + ', ' + e.stack;
                    }
                }
                //    },
                //    error: function (data, errorCode, errorMessage) {
                //        HideActivitySpinner();

                //        console.log('Error getting data from the server (api/BundleItems). Try refreshing the page. Error details: ' + errorMessage + ', ' + data.responseText);
                //        document.getElementById('bwAdvancedProductSearch_Error').innerHTML = 'Error getting data from the server (api/BundleItems). Try refreshing the page. Error details: ' + errorMessage + ', ' + data.responseText;
                //    }
                //});


                //} catch (e) {
                //    HideActivitySpinner();

                //    console.log('Exception in renderProductSearchScreen(): ' + e.message + ', ' + e.stack);
                //    displayAlertDialog('Exception in renderProductSearchScreen(): ' + e.message + ', ' + e.stack);
                //    try {
                //        document.getElementById('bwAdvancedProductSearch_ProductCatalog_ForInventoryFormWidget_bwAdvancedProductSearch_Error').innerHTML = 'Exception in renderProductSearchScreen():2: ' + e.message + ', ' + e.stack;
                //    } catch (e) { }
                //}
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

        } catch (e) {
            HideActivitySpinner();

            console.log('Exception in renderProductSearchScreen(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in renderProductSearchScreen(): ' + e.message + ', ' + e.stack);
            try {
                document.getElementById('bwAdvancedProductSearch_ProductCatalog_ForInventoryFormWidget_bwAdvancedProductSearch_Error').innerHTML = 'Exception in renderProductSearchScreen(): ' + e.message + ', ' + e.stack;
            } catch (e) { }
        }
    },

    renderFilterAndProductsSections_ForInventoryFormWidget: function (productSegment, productSubClass, highlightThisProductCode, bwBudgetRequestId) {
        try {
            console.log('In renderFilterAndProductsSections_ForInventoryFormWidget(). productSegment: ' + productSegment + ', productSubClass: ' + productSubClass + ', highlightThisProductCode: ' + highlightThisProductCode + ', bwBudgetRequestId: ' + bwBudgetRequestId);

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            //document.getElementById('productsContentSections').innerHTML = '';
            document.getElementById('bwAdvancedProductSearch_ProductCatalog_ForInventoryFormWidget_productsContentSections').innerHTML = '';

            // Get our pre-filter product list for product segment and subclass.
            //var data = this.options.json;
            var data = $('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'json');

            //debugger; // 1-19-2022 THIS IS WHERE WE HAVE OUR DATA FROM THE DB.

            if (!(data && data.length && (data.length > 0))) {
                displayAlertDialog('xcx12312412343 no data');
            } //else {
            //alert('xcx213123423 sata: ' + JSON.stringify(data));
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
                            //var bundles = this.options.Bundles;
                            var bundles = $('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'Bundles');

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

            //if (this.options.filters && this.options.filters.length > 0) {
            if ($('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'filters') && $('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'filters').length > 0) {
                console.log('Filters to apply to this display: ' + JSON.stringify($('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'filters')));
                products = this.applyFilters(products);
            }

            if (products.length == 0) {

                console.log('Error: No products loaded. WHY ARE WE HERE?');
                //alert('Error: No products loaded. WHY ARE WE HERE?');
                document.getElementById('bwAdvancedProductSearch_ProductCatalog_ForInventoryFormWidget_bwAdvancedProductSearch_Error').innerHTML = 'No products loaded. Click the "Add inventory item" button to add inventory items.';
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

            document.getElementById('bwAdvancedProductSearch_ProductCatalog_ForInventoryFormWidget_tdProductFilterSection').innerHTML = html;

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
                    //if (this.options.filters) {
                    if ($('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'filters')) {
                        for (var j = 0; j < $('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'filters').length; j++) {
                            if ($('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'filters')[j].filtersectionname == 'Printing') {
                                if ($('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'filters')[j].filtertext == uoms[i]) {
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
                    if ($('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'filters')) {
                        for (var j = 0; j < $('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'filters').length; j++) {
                            if ($('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'filters')[j].filtersectionname == 'Style') {
                                if ($('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'filters')[j].filtertext == styles[i]) {
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
                    if ($('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'filters')) {
                        for (var j = 0; j < $('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'filters').length; j++) {
                            if ($('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'filters')[j].filtersectionname == 'Color') {
                                if ($('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'filters')[j].filtertext == colors[i]) {
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
                        document.getElementById('bwAdvancedProductSearch_Error').innerHTML = 'Exception in bwAdvancedProductSearch.renderFilterAndProductsSections_ForInventoryFormWidget.sort.Width: ' + e.message + ', ' + e.stack;
                    }
                });
                for (var i = 0; i < uoms.length; i++) {

                    var selected = '';
                    if ($('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'filters')) {
                        for (var j = 0; j < $('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'filters').length; j++) {
                            if ($('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'filters')[j].filtersectionname == 'Width') {
                                if ($('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'filters')[j].filtertext == uoms[i]) {
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
                        document.getElementById('bwAdvancedProductSearch_Error').innerHTML = 'Exception in bwAdvancedProductSearch.renderFilterAndProductsSections_ForInventoryFormWidget.sort.Height: ' + e.message + ', ' + e.stack;
                    }
                });
                for (var i = 0; i < uoms.length; i++) {

                    var selected = '';
                    if ($('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'filters')) {
                        for (var j = 0; j < $('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'filters').length; j++) {
                            if ($('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'filters')[j].filtersectionname == 'Height') {
                                if ($('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'filters')[j].filtertext == uoms[i]) {
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
                        document.getElementById('bwAdvancedProductSearch_Error').innerHTML = 'Exception in bwAdvancedProductSearch.renderFilterAndProductsSections_ForInventoryFormWidget.sort.Length: ' + e.message + ', ' + e.stack;
                    }
                });
                for (var i = 0; i < uoms.length; i++) {

                    var selected = '';
                    if ($('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'filters')) {
                        for (var j = 0; j < $('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'filters').length; j++) {
                            if ($('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'filters')[j].filtersectionname == 'Length') {
                                if ($('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'filters')[j].filtertext == uoms[i]) {
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
            document.getElementById('bwAdvancedProductSearch_ProductCatalog_ForInventoryFormWidget_productsContentSections').innerHTML = '';
            var html = '';
            html += '<div id="divFilteredProductsListInformationSummaryHeader"></div>';

            // The "Add All Filtered Products" button.
            if ($('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'filters') && $('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'filters').length > 0 && products.length > 1) { // We only want to display when there is at least 1 filter selected, and more than 1 product is being displayed.
                var buttonText = '';
                buttonText += 'ADD ALL';
                for (var i = 0; i < $('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'filters').length; i++) {
                    buttonText += ' > ';
                    buttonText += $('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'filters')[i].filtersectionname;
                    buttonText += ': ';
                    buttonText += $('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'filters')[i].filtertext;
                }
                html += '<div id="divAddAllFilteredProducts" style="float:right;">';
                html += '   <br />';
                var _filters = encodeURI(JSON.stringify($('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'filters'))).replace(/'/g, "%27"); // The replace encodes single quotes. For some reason encodeURI may not do single quotes??
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
                console.log('In renderFilterAndProductsSections_ForInventoryFormWidget(). Invalid sessionId: ' + sessionId);
                //var error1 = new Error('Error in renderFilterAndProductsSections(). Invalid sessionId: ' + sessionId);
                //document.getElementById('bwAdvancedProductSearch_Error').innerHTML = error1.message + ', ' + error1.stack;
            }

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

                // Image.
                var preventCachingGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });


                //var imagePath = this.options.operationUriPrefix + '_files/' + workflowAppId + '/inventoryimages/' + products[i].ProductId + '/inventoryimage.png?v=' + preventCachingGuid;


                var imagePath;

                var activeStateIdentifier = JSON.parse($('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier'));

                if (activeStateIdentifier.status != 'SUCCESS') {

                    imagePath = '[No image. Unauthorized. xcx213124-34556-555-556-33-66]';

                } else {

                    imagePath = this.options.operationUriPrefix + '_files/' + workflowAppId + '/inventoryimages/' + products[i].ProductId + '/inventoryimage.png?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier;

                }









                html += '<img xcx="xcx3435688" id="orgImage_' + i + '" src="' + imagePath + '" style="height:120px;display:block;margin-left:auto;margin-right:auto;cursor:pointer !important;" alt="" onclick="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'btnEdit_OnClick\', \'' + products[i].ProductId + '\');">';


                html += '   </td>';







                html += '   <td>';
                //debugger;
                html += '<input type="button" value="Add" class="button-blue" onclick="$(\'.bwSelectInventoryItems\').bwSelectInventoryItems(\'btnAdd_OnClick\', \'' + products[i].ProductId + '\', \'' + bwBudgetRequestId + '\', \'' + sessionId + '\');" />'; // 
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
            document.getElementById('bwAdvancedProductSearch_ProductCatalog_ForInventoryFormWidget_productsContentSections').innerHTML = html;

            var html = '';
            var data = $('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'json');
            html += '<span style="">DISPLAYING ' + products.length + ' OF ' + data.length + ' PRODUCTS.</span>';
            document.getElementById('divFilteredProductsListInformationSummaryHeader').innerHTML = html;

            HideActivitySpinner();

        } catch (e) {
            HideActivitySpinner();

            console.log('Exception in renderFilterAndProductsSections_ForInventoryFormWidget(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in renderFilterAndProductsSections_ForInventoryFormWidget(): ' + e.message + ', ' + e.stack);
            //document.getElementById('bwAdvancedProductSearch_Error').innerHTML = 'Exception in renderFilterAndProductsSections_ForInventoryFormWidget(): ' + e.message + ', ' + e.stack;
        }
    },
    clearFilters_ForInventoryFormWidget: function (productSegment, productSubClass) {
        try {
            console.log('In clearFilters_ForInventoryFormWidget().');
            var thiz = this;
            ShowActivitySpinner();

            setTimeout(function () {
                thiz.clearTheSearchBox_ForInventoryFormWidget();
                thiz.options.filters = null;
                thiz.renderFilterAndProductsSections_ForInventoryFormWidget(productSegment, productSubClass);
            }, 0);

        } catch (e) {
            console.log('Exception in clearFilters_ForInventoryFormWidget(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in clearFilters_ForInventoryFormWidget(): ' + e.message + ', ' + e.stack);
        }
    },
    renderSegmentTopMenuBar_ForInventoryFormWidget: function (productSegment) {
        try {
            console.log('In renderSegmentTopMenuBar_ForInventoryFormWidget(). productSegment: ' + productSegment);

            this.clearTheSearchBox_ForInventoryFormWidget();

            //this.options.productSubClasses = null; // When we render the segment, we have to reset the subclass menu bar.
            $('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'productSubClasses', null);; // When we render the segment, we have to reset the subclass menu bar.
            //document.getElementById('productSegmentTopMenubar').innerHTML = '';

            //var productSegments = this.options.productSegments;
            var productSegments = $('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'productSegments');
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
                document.getElementById('bwAdvancedProductSearch_ProductCatalog_ForInventoryFormWidget_productSegmentTopMenubar').innerHTML = html;

            }
            document.getElementById('bwAdvancedProductSearch_ProductCatalog_ForInventoryFormWidget_productSubclassTopMenubar').innerHTML = ''; // Reset this one!

        } catch (e) {
            console.log('Exception in renderSegmentTopMenuBar_ForInventoryFormWidget(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in renderSegmentTopMenuBar_ForInventoryFormWidget(): ' + e.message + ', ' + e.stack);
        }
    },
    renderSubClassTopMenuBar_ForInventoryFormWidget: function (productSegment, productSubClass) {
        try {
            console.log('In renderSubClassTopMenuBar_ForInventoryFormWidget(). productSegment: ' + productSegment + ', productSubClass: ' + productSubClass);
            document.getElementById('bwAdvancedProductSearch_ProductCatalog_ForInventoryFormWidget_productSubclassTopMenubar').innerHTML = '';

            // Since the user selected a product segment, we now have to redraw the product subclass menu bar.
            //var data = this.options.json;
            var data = $('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'json');
            var html = '';

            //if (!this.options.productSubClasses) { // If this isn't populated, we will do that now.
            if (!$('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'productSubClasses')) { // If this isn't populated, we will do that now.
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
                //this.options.productSubClasses = productSubClasses;
                $('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'productSubClasses', productSubClasses);
            }

            if (productSubClass == '0') {
                //productSubClass = this.options.productSubClasses[0];
                productSubClass = $('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'productSubClasses')[0];
            }

            //for (var i = 0; i < this.options.productSubClasses.length; i++) {
            for (var i = 0; i < $('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'productSubClasses').length; i++) {
                if (productSubClass && productSubClass == $('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'productSubClasses')[i]) {
                    html += '| <span style="cursor:pointer;font-size:12pt;color:blue;cursor:pointer;" class="bwHoverLink1" onclick="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'productSubClass_Click\', \'' + productSegment + '\', \'' + $('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'productSubClasses')[i] + '\');">' + $('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'productSubClasses')[i] + '</span> ';
                } else {
                    html += '| <span style="cursor:pointer;font-size:12pt;" class="bwHoverLink1" onclick="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'productSubClass_Click\', \'' + productSegment + '\', \'' + $('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'productSubClasses')[i] + '\');">' + $('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'productSubClasses')[i] + '</span> ';
                }
            }
            html += '|';
            document.getElementById('bwAdvancedProductSearch_ProductCatalog_ForInventoryFormWidget_productSubclassTopMenubar').innerHTML = html;

        } catch (e) {
            console.log('Exception in renderSubClassTopMenuBar_ForInventoryFormWidget(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in renderSubClassTopMenuBar_ForInventoryFormWidget(): ' + e.message + ', ' + e.stack);
        }
    },
    renderBreadcrumbTopMenuBar_ForInventoryFormWidget: function (productSegment, productSubClass) {
        try {
            console.log('In renderBreadcrumbTopMenuBar_ForInventoryFormWidget(). ' + productSegment + ', productSubClass: ' + productSubClass);
            // Render the breadcrumb.
            document.getElementById('bwAdvancedProductSearch_ProductCatalog_ForInventoryFormWidget_productBreadcrumbAndTitleMenubar').innerHTML = '';
            var html = '';
            html += '               <span style="color:blue;font-size:10pt;white-space:nowrap;">' + '<span style="cursor:pointer;" class="bwHoverLink1" onclick="$(\'.bwAdvancedProductSearch\').bwAdvancedProductSearch(\'productSegment_Click\', \'' + productSegment + '\');">' + productSegment + '</span>' + ' > ' + productSubClass + '</span>';
            html += '               <br />';
            html += '               <span style="font-size:15pt;font-weight:bold;">' + productSubClass + '</span>';
            document.getElementById('bwAdvancedProductSearch_ProductCatalog_ForInventoryFormWidget_productBreadcrumbAndTitleMenubar').innerHTML = html;
        } catch (e) {
            console.log('Exception in renderBreadcrumbTopMenuBar_ForInventoryFormWidget(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in renderBreadcrumbTopMenuBar_ForInventoryFormWidget(): ' + e.message + ', ' + e.stack);
        }
    },
    clearTheSearchBox_ForInventoryFormWidget: function (element) {
        try {
            console.log('In clearTheSearchBox_ForInventoryFormWidget().');

            if (!element) {
                element = document.getElementById('bwAdvancedProductSearch_ProductCatalog_ForInventoryFormWidget_txtAdvancedProductSearch');
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
            console.log('Exception in clearTheSearchBox_ForInventoryFormWidget(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in clearTheSearchBox_ForInventoryFormWidget(): ' + e.message + ', ' + e.stack);
        }
    },


    btnAdd_OnClick: function (productId, bwBudgetRequestId, sessionId) {
        try {

            if (bwBudgetRequestId != this.options.bwBudgetRequestId) {

                // This is not the widget. Keep looking.

            } else {

                console.log('In btnAdd_OnClick(). SearchingForModule: ' + this.options.SearchingForModule + ', productId: ' + productId + ', bwBudgetRequestId: ' + bwBudgetRequestId + ', sessionId: ' + sessionId);
                //alert('In btnAdd_OnClick(). SearchingForModule: ' + this.options.SearchingForModule + ', productId: ' + productId + ', bwBudgetRequestId: ' + bwBudgetRequestId + ', sessionId: ' + sessionId);
                var thiz = this;

                //ShowActivitySpinner();
                //var data = this.options.json; 
                var data = $('.bwAdvancedProductSearch').bwAdvancedProductSearch('option', 'json');
                var product;

                //alert('In btnAdd_OnClick(). productId: ' + productId + ', bwBudgetRequestId: ' + bwBudgetRequestId + ', data: ' + JSON.stringify(data));


                for (var i = 0; i < data.length; i++) {
                    if (data[i].bwInventoryItemId == productId) {
                        // This is the product we have to add.
                        product = data[i];
                        product['ProductId'] = data[i].bwInventoryItemId;
                        //if (!sessionId) {

                        //    HideActivitySpinner();

                        //    console.log('Error in btnAdd_OnClick(). Invalid sessionId: ' + sessionId);
                        //    document.getElementById('bwAdvancedProductSearch_Error').innerHTML = 'Error in btnAdd_OnClick(). Invalid sessionId: ' + sessionId;
                        //} else {
                        //var operationUri = '/Distributor/GetPricing2?productCode=' + product.ProductId + '&sessionid=' + sessionId;

                        if (!product.ProductId) {
                            alert('INVALID PRODUCT ID.');
                        } else {

                            //alert('THIS IS WHERE WE PASS THIS INVENTORY ITEM TO THE FORMWIDGET. data.length: ' + data.length + ', product.ProductId: ' + product.ProductId + ', bwBudgetRequestId: ' + thiz.options.bwBudgetRequestId);



                            console.log('THIS IS WHERE WE PASS THIS INVENTORY ITEM TO THE FORMWIDGET. product.ProductId: ' + product.ProductId + ', bwBudgetRequestId: ' + thiz.options.bwBudgetRequestId);

                            //// Add the inventory item by calling this method.
                            //var form;
                            //var forms = $(document.body).find('.budgetrequestform');
                            //for (var j = 0; j < forms.length; j++) {
                            //    //if (forms[i].getAttribute('bwbudgetrequestid') == thiz.options.bwBudgetRequestId) {
                            //    if (forms[j].getAttribute('bwbudgetrequestid') == bwBudgetRequestId) {
                            //        console.log('In bwAdvancedProductSearch.js.btnAdd_OnClick(). FOUND THE FORM');
                            //        form = forms[j];
                            //    }
                            //}
                            //if (!form) {
                            //    displayAlertDialog('Error in bwAdvancedProductSearch.js.btnAdd_OnClick(). NO FORM FOUND for bwBudgetRequestId: ' + bwBudgetRequestId);
                            //} else {


                            $('#bwAdvancedProductSearch_ProductCatalog_ForInventoryFormWidget').dialog('close');

                            //var formwidget = $(this.element).find('.bwSelectInventoryItems')[0]; // Find the formwidget, then we will invoke the method to add the inventory item to the form json.

                            //var inventoryItemJson = {
                            //    ProductId
                            //}

                            $(this.element).bwSelectInventoryItems('addInventoryItemToThisForm', product, bwBudgetRequestId);

                            break;
                            //}







                            //if (this.options.SearchingForModule == 'Distributor') {
                            //    var operationUri = '/Distributor/GetPricing?productCode=' + product.ProductId; // + '&sessionid=' + sessionId;
                            //    $.ajax({
                            //        url: operationUri,
                            //        type: "GET",
                            //        contentType: 'application/json',
                            //        timeout: this.options.ajaxTimeout,
                            //        success: function (html) {
                            //            try {






                            //                debugger; // Todd: Whn we add a bundle, then come bakc to add multiple filter items, we get an exception, Unexpected token '<', SyntaxError: Unexpected token '<' at eval () at http://localhost:21932/Scripts/www-google-com/jquery/1-10-2/jquery.js:612:21 at Function.globalEval
                            //                $('#SelectedSku').html(html);
                            //                $("#btnAnalyze").prop("disabled", false); // This is the "Next" button.
                            //                debugger; // THIS IS IT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                            //                $('.bwDistributorBundling').bwDistributorBundling('renderSelectedBundleForThisQuote2'); // This refreshes the Bundle section on the page.








                            //                HideActivitySpinner();

                            //            } catch (e) {

                            //                HideActivitySpinner();

                            //                console.log('Exception in btnAdd_OnClick():2: ' + e.message + ', ' + e.stack);
                            //                document.getElementById('bwAdvancedProductSearch_Error').innerHTML = 'Exception in btnAdd_OnClick():2: ' + e.message + ', ' + e.stack;
                            //            }
                            //        },
                            //        error: function (data, errorCode, errorMessage) {

                            //            HideActivitySpinner();

                            //            console.log('Error in btnAdd_OnClick():' + errorMessage + ', ' + data.responseText);
                            //            document.getElementById('bwAdvancedProductSearch_Error').innerHTML = 'Error in btnAdd_OnClick():' + errorMessage + ', ' + data.responseText;
                            //        }
                            //    });
                            //} else if (this.options.SearchingForModule == 'OTO') {
                            //    debugger;
                            //    var operationUri = '/OTO/GetPricing?productCode=' + product.ProductId; // + '&sessionid=' + sessionId;
                            //    $.ajax({
                            //        url: operationUri,
                            //        type: "GET",
                            //        contentType: 'application/json',
                            //        timeout: this.options.ajaxTimeout,
                            //        success: function (html) {
                            //            try {
                            //                debugger;
                            //                $('#SelectedSku').html(html);
                            //                $("#btnAnalyze").prop("disabled", false); // This is the "Next" button.

                            //                HideActivitySpinner();

                            //                //alert('This does not work yet for BW1! We may need to get the ispPR_GetProductAndMarketDetails stored procedure returning BW1 products.');

                            //            } catch (e) {

                            //                HideActivitySpinner();

                            //                console.log('Exception in btnAdd_OnClick():3: ' + e.message + ', ' + e.stack);
                            //                document.getElementById('bwAdvancedProductSearch_Error').innerHTML = 'Exception in btnAdd_OnClick():3: ' + e.message + ', ' + e.stack;
                            //            }
                            //        },
                            //        error: function (data, errorCode, errorMessage) {

                            //            HideActivitySpinner();

                            //            console.log('Error in btnAdd_OnClick():' + errorMessage + ', ' + data.responseText);
                            //            document.getElementById('bwAdvancedProductSearch_Error').innerHTML = 'Error in btnAdd_OnClick():' + errorMessage + ', ' + data.responseText;
                            //        }
                            //    });
                            //} else if (this.options.SearchingForModule == 'EndUser') {
                            //    var sessionId = $('#SkuSessionId').val();
                            //    var operationUri = '/EndUserNew/MoveProductToWorking?productCode=' + product.ProductId + '&sessionid=' + sessionId;
                            //    $.ajax({
                            //        url: operationUri,
                            //        type: "GET",
                            //        contentType: 'application/json',
                            //        timeout: this.options.ajaxTimeout,
                            //        success: function (html) {
                            //            try {
                            //                $('#SelectedSku').html(html);
                            //                $("#btnAnalyze").prop("disabled", false); // This is the "Next" button.

                            //                HideActivitySpinner();

                            //                //alert('This does not work yet for BW1! We may need to get the ispPR_GetProductAndMarketDetails stored procedure returning BW1 products.');

                            //            } catch (e) {

                            //                HideActivitySpinner();

                            //                console.log('Exception in btnAdd_OnClick():3: ' + e.message + ', ' + e.stack);
                            //                document.getElementById('bwAdvancedProductSearch_Error').innerHTML = 'Exception in btnAdd_OnClick():3: ' + e.message + ', ' + e.stack;
                            //            }
                            //        },
                            //        error: function (data, errorCode, errorMessage) {

                            //            HideActivitySpinner();

                            //            console.log('Error in btnAdd_OnClick():' + errorMessage + ', ' + data.responseText);
                            //            document.getElementById('bwAdvancedProductSearch_Error').innerHTML = 'Error in btnAdd_OnClick():' + errorMessage + ', ' + data.responseText;
                            //        }
                            //    });
                            //} else {
                            //    alert('In btnAdd_OnClick(). Unexpected value for SearchingForModule: ' + this.options.SearchingForModule);
                            //}
                        }
                        //}
                    }
                }

            }

        } catch (e) {

            //HideActivitySpinner();

            console.log('Exception in btnAdd_OnClick(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in btnAdd_OnClick(): ' + e.message + ', ' + e.stack);
            document.getElementById('bwAdvancedProductSearch_Error').innerHTML = 'Exception in btnAdd_OnClick(): ' + e.message + ', ' + e.stack;
        }
    },





});