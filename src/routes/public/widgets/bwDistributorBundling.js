$.widget("bw.bwDistributorBundling", {
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
        This is the bwDistributorBundling.js jQuery Widget. 
        ===========================================================

           [more to follow]
                           
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

           [put your stuff here]

        ===========================================================
        
       */

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

        

        BundleId: null, // This is the selected bundle id.
        BundleItems: null, // This is an array of the BundleItems that belong to the bundle.

        selectedBundleDescription: null,
        selectedBreakQuantity: null,
        selectedUom: null

        //json: null, // This is where the data is stored.
        //filters: null, // When we regenerate the result set, we have the filters readily available.
        //productSegments: null, // An array containing the product segments.
        //productSubClasses: null, // An array containing the product subclasses for the currently elected product segment.
        //searchBoxEvent_keyup: null, // Need a global reference to this because to removeeventlistener, a reference to the function is always required.

    },
    _create: function () {
        try {
            this.element.addClass("bwDistributorBundling");

            var html = '';

            html += '<div id="divAddOrCreateBundleDialog" style="display:none;">';
            html += '   <br />';
            html += '   <span style="font-size:25pt;">';
            html += '       Select or Create a Bundle';
            html += '   </span>';
            html += '   <br />';
            html += '   <span style="font-size:10pt;">';
            html += '       Select or create a bundle for this quote. Only 1 bundle per quote.<br /><span style="font-style:italic;">To add items to a bundle, go to the "Advanced Search", and select the "Add" link in the Bundle column for that product.</span>';
            html += '   </span>';
            html += '   <br />';
            html += '   <br />';
            html += '   <div style="float:right;">';
            html += '       <input class="button-blue" type="button" style="cursor:pointer;" value="Create a new Bundle" onclick="$(\'.bwDistributorBundling\').bwDistributorBundling(\'createANewBundle\');" />';
            html += '       &nbsp;&nbsp;';
            html += '       <input class="button-blue" type="button" style="cursor:pointer;" value="Close" onclick="$(\'.bwDistributorBundling\').bwDistributorBundling(\'closeBundleSummaryListDialog\');" />';
            html += '   </div>';
            html += '   <br />';
            html += '   <div id="divBundleDialog_BundleTable"></div>';
            html += '   <br />';
            html += '   <br />';
            html += '   <br />';
            html += '</div>';

            html += '<div id="divAddedToBundle" style="display:none;">';
            html += '   <br />';
            html += '   <br />';
            html += '   <br />';
            html += '   <div id="divAddedToBundle_Content" style="font-size:25pt;float:center;">';
            html += '       [divAddedToBundle_Content]';
            html += '   </div>';
            html += '   <br />';
            html += '</div>';

            html += '<div id="divAddAProductToBundle" style="display:none;">';
            html += '   <br />';
            html += '   <span id="divAddAProductToBundle_Title" style="font-size:25pt;">';
            html += 'Add Product to a Bundle';
            html += '   </span>';
            html += '   <br />';
            html += '   <br />';
            html += '   <span id="divAddAProductToBundle_Product" style="font-size:15pt;">';
            html += '[divAddAProductToBundle_Product]';
            html += '   </span>';
            html += '   <br />';
            html += '   <br />';
            html += '   <span id="spanAddAProductToBundle_Dropdown" style="" >';
            html += '       [spanAddAProductToBundle_Dropdown]';
            html += '   </span>';
            html += '   &nbsp;&nbsp;';
            html += '   <span id="spanAddAProductToBundle_Button" style="" >';
            html += '       [spanAddAProductToBundle_Button]';
            html += '   </span>';
            html += '   <br />';
            html += '   <br />';
            html += '   <br />';
            html += '   <div style="float:right;">';
            html += '       <input class="button-blue" type="button" style="cursor:pointer;" value="Create a new Bundle" onclick="$(\'.bwDistributorBundling\').bwDistributorBundling(\'createANewBundle\');" />';
            html += '       &nbsp;&nbsp;';
            html += '       <input class="button-blue" type="button" style="cursor:pointer;" value="Close" onclick="$(\'.bwDistributorBundling\').bwDistributorBundling(\'closeAddAProductToBundleDialog\');" />'; 
            html += '   </div>';
            html += '   <br />';
            html += '</div>';

            html += '<div id="divViewABundleDialog" style="display:none;">';
            html += '   <br />';
            html += '   <span style="font-size:25pt;">';
            //html += '       Bundle: "VL Masking Bundlexcx1"';
            html += '   </span>';
            html += '   <br />';
            html += '   <span style="font-size:10pt;">';
            //html += '       Bundle for product xx.';
            html += '   </span>';
            html += '   <br />';
            html += '   <br />';
            html += '   <br />';
            html += '   <table>';
            html += '       <tr>';
            html += '           <td>';
            html += '               Title:';
            html += '           </td>';
            html += '           <td>';
            html += '               <input value="" id="txtBundleDescription" class="ui-autocomplete-input" type="text" style="WIDTH: 280px;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 15pt;TEXT-ALIGN: left;" autocomplete="off" />';
            html += '           </td>';
            html += '       </tr>';
            html += '       <tr>';
            html += '           <td>';
            html += '               Quantity break:';
            html += '           </td>';
            html += '           <td>';
            html += '               <input id="txtQuantityBreak" class="ui-autocomplete-input" type="text" style="WIDTH: 35px;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 15pt;TEXT-ALIGN: left;"  autocomplete="off" />';
            html += '           </td>';
            html += '       </tr>';
            html += '       <tr>';
            html += '           <td>';
            html += '               Unit of measurement (UOM):';
            html += '           </td>';
            html += '           <td>';
            //html += '               <div id="divBundlingUOMDropDown1">[divBundlingUOMDropDown1]</div>';
            html += '           </td>';
            html += '       </tr>';
            html += '   </table>';
            html += '   <br />';
            html += '   <br />';
            html += '   <div id="divViewABundleDialog_Content"></div>';


            html += '   <br />';
            html += '   <br />';
            html += '   <div style="float:right;">';
            html += '       <input class="button-blue" type="button" style="cursor:pointer;" value="Save" onclick="$(\'.bwDistributorBundling\').bwDistributorBundling(\'saveTheNewBundle\');" />';
            html += '       <input class="button-blue" type="button" style="cursor:pointer;" value="Close" onclick="$(\'.bwDistributorBundling\').bwDistributorBundling(\'closeCreateANewBundleDialog\');" />';
            html += '   </div>';

            html += '   <br />';
            html += '   <br />';
            html += '   <div style="float:right;">';
            html += '       <input class="button-blue" type="button" style="cursor:pointer;" value="Create a new Bundle" onclick="$(\'.bwDistributorBundling\').bwDistributorBundling(\'createANewBundle\');" />';
            html += '       &nbsp;&nbsp;&nbsp;&nbsp;';
            html += '       <input class="button-blue" type="button" style="cursor:pointer;" value="Close" onclick="$(\'.bwDistributorBundling\').bwDistributorBundling(\'closeBundleSummaryListDialog\');" />';
            html += '   </div>';
            html += '   <br />';
            html += '</div>';

            html += '<div id="divCreateBundleDialog" style="display:none;">';
            html += '   <br />';
            html += '   <span style="font-size:25pt;">';
            html += '       Create a new Bundle';
            html += '   </span>';
            html += '   <br />';
            html += '   <span style="font-size:10pt;">';
            html += '       Enter the details for the new Bundle, then click the \'Save\' button.<br /><span style="font-style:italic;">To add items to a bundle, go to the "Advanced Search", and select the "Add" link in the Bundle column.</span>';
            html += '   </span>';
            html += '   <br />';
            html += '   <br />';
            html += '   <br />';
            html += '   <br />';
            html += '   <table>';
            html += '       <tr>';
            html += '           <td>';
            html += '               Title:';
            html += '           </td>';
            html += '           <td>';
            html += '               <input id="txtBundleDescription" class="ui-autocomplete-input" type="text" style="WIDTH: 180px;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 15pt;TEXT-ALIGN: left;" autocomplete="off" />';
            html += '           </td>';
            html += '       </tr>';
            html += '       <tr>';
            html += '           <td>';
            html += '               Quantity break:';
            html += '           </td>';
            html += '           <td>';
            html += '               <input id="txtQuantityBreak" class="ui-autocomplete-input" type="text" style="WIDTH: 35px;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 15pt;TEXT-ALIGN: left;"  autocomplete="off" />';
            html += '           </td>';
            html += '       </tr>';
            html += '       <tr>';
            html += '           <td>';
            html += '               Unit of measurement (UOM):';
            html += '           </td>';
            html += '           <td>';
            html += '               <div id="divBundlingUOMDropDown1">[divBundlingUOMDropDown1]</div>';
            html += '           </td>';
            html += '       </tr>';
            html += '   </table>';
            html += '   <br />';
            html += '   <br />';
            html += '   <div style="float:right;">';
            html += '       <input class="button-blue" type="button" style="cursor:pointer;" value="Save" onclick="$(\'.bwDistributorBundling\').bwDistributorBundling(\'saveTheNewBundle\');" />';
            html += '       <input class="button-blue" type="button" style="cursor:pointer;" value="Close" onclick="$(\'.bwDistributorBundling\').bwDistributorBundling(\'closeCreateANewBundleDialog\');" />';
            html += '   </div>';
            html += '</div>';

            html += '<div id="divEditBundleDialog" style="display:none;">';
            html += '   <br />';
            html += '   <span style="font-size:25pt;">';
            html += '       Edit a Bundle';
            html += '   </span>';
            html += '   <br />';
            html += '   <span style="font-size:10pt;">';
            html += '       Edit the details for the Bundle, then click the \'Save\' button.';
            html += '   </span>';
            html += '   <br />';
            html += '   <input id="divEditBundleDialog_BundleId" type="hidden" />';
            html += '   <br />';
            html += '   <br />';
            html += '   <br />';
            html += '   <table>';
            html += '       <tr>';
            html += '           <td>';
            html += '               Title:';
            html += '           </td>';
            html += '           <td>';
            html += '               <input id="divEditBundleDialog_txtBundleDescription" class="ui-autocomplete-input" type="text" style="WIDTH: 180px;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 15pt;TEXT-ALIGN: left;" autocomplete="off" />';
            html += '           </td>';
            html += '       </tr>';
            html += '       <tr>';
            html += '           <td>';
            html += '               Quantity break:';
            html += '           </td>';
            html += '           <td>';
            html += '               <input id="divEditBundleDialog_txtQuantityBreak" class="ui-autocomplete-input" type="text" style="WIDTH: 35px;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 15pt;TEXT-ALIGN: left;"  autocomplete="off" />';
            html += '           </td>';
            html += '       </tr>';
            html += '       <tr>';
            html += '           <td>';
            html += '               Unit of measurement (UOM):';
            html += '           </td>';
            html += '           <td>';
            html += '               <div id="divEditBundleDialog_divBundlingUOMDropDown1">[divEditBundleDialog_divBundlingUOMDropDown1]</div>';
            html += '           </td>';
            html += '       </tr>';
            html += '   </table>';
            html += '   <br />';
            html += '   <br />';
            html += '   <div style="float:right;">';
            html += '       <input id="btnEditABundle" class="button-blue" type="button" style="cursor:pointer;" value="Save" onclick="$(\'.bwDistributorBundling\').bwDistributorBundling(\'saveTheEditedBundle\');" />'; //saveTheNewBundlexx\');" />';
            html += '       <input class="button-blue" type="button" style="cursor:pointer;" value="Close" onclick="$(\'.bwDistributorBundling\').bwDistributorBundling(\'closeEditABundleDialog\');" />';
            html += '   </div>';
            html += '</div>';

            html += '<label>Bundle:</label>';
            html += '   <div style="font-size:10pt;">';
            html += '       <input class="button-blue" type="button" style="cursor:pointer;" value="Select or Create a Bundle" onclick="$(\'.bwDistributorBundling\').bwDistributorBundling(\'displaySelectABundleDialog\');" />';
            html += '       &nbsp;&nbsp;';
            html += '       <input class="button-blue" type="button" style="cursor:pointer;" value="Clear" onclick="$(\'.bwDistributorBundling\').bwDistributorBundling(\'clearBundle\');" />';
            html += '       <br />';
            html += '       <div id="divBundleSummary"></div>';
            html += '   </div>';

            this.element.html(html);
            //this.element.show();

            var html = '';
            html += '<span style="color:red;">No bundle selected</span>';
            $('#divBundleSummary').html(html);

            this.enableOrDisableBundleItemSelectionCheckboxes();

            console.log('In bwDistributorBundling._create(). The widget has been initialized with BWCustomer: ' + JSON.stringify(this.options.BWCustomer, null, 2));

        } catch (e) {
            //thiz.hideActivitySpinner();

            console.log('Exception in bwDistributorBundling._create(): ' + e.message + ', ' + e.stack);
            document.getElementById('bwDistributorBundling_Error').innerHTML = 'Exception in bwDistributorBundling._create(): ' + e.message + ', ' + e.stack;
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
    expandOrCollapseBundleSection: function (cellElement) { // collapsibleRowId = steprow-' + stepName.toLowerCase() + '_' + i + '_' + '0'
        try {
            console.log('In expandOrCollapseAlertsSection().'); // + rowId + ', ' + imageId + ', ' + collapsibleRowId + ').');
            //debugger;
            var rowElement = $(cellElement).closest('tr');
            var nextRowElement = $(rowElement).next('tr');
            var imageElement = $(cellElement).find('img:first');
            var imageSrc = $(imageElement).attr('src').toLowerCase();
            if (imageSrc.indexOf('drawer-open') > -1) {
                // This means we have to expand.
                $(nextRowElement).attr('style', 'display:table-row;');
                $(imageElement).attr('src', '/images/drawer-close.png');
                $(imageElement).attr('title', 'collapse');
            } else {
                // This means we have to collapse.
                $(nextRowElement).attr('style', 'display:none;');
                $(imageElement).attr('src', '/images/drawer-open.png');
                $(imageElement).attr('title', 'expand');
            }






            //var elementIds = ['', 'alertSectionRow_1_1', 'alertSectionRow_1_2', 'alertSectionRow_1_3'];
            //var imageElementIds = ['', 'alertSectionImage_1_1', 'alertSectionImage_1_2', 'alertSectionImage_1_3'];
            //var selectedIndex = collapsibleRowId.split('_')[2];
            //var img = document.getElementById(imageId);
            //var urlClose = 'images/drawer-close.png';
            //var urlOpen = 'images/drawer-open.png';

            //if (img.src.indexOf(urlClose) > -1) {
            //    document.getElementById(collapsibleRowId).style.display = 'none';
            //    document.getElementById(imageId).src = urlOpen;
            //} else {
            //    document.getElementById(collapsibleRowId).style.display = 'table-row';
            //    document.getElementById(imageId).src = urlClose;
            //}


        } catch (e) {
            console.log('Exception in expandOrCollapseAlertsSection(): ' + e.message + ', ' + e.stack);
        }
    },
    addOrRemoveProductFromBundle: function (element, productId, productDescription) {
        try {
            console.log('In addOrRemoveProductFromBundle().');
            var thiz = this;
            //debugger;
            if (element.checked) {
                // Add this item to the bundle.
                this.addProductToABundle(productId, productDescription, this.options.BundleId)
                document.getElementById('divAddedToBundle_Content').innerHTML = 'The product was added to the bundle.';
                thiz.renderSelectedBundleForThisQuote2();

                //var bundleItem = {
                //    BundleId: this.options.BundleId,
                //    ProductId: productId
                //}
                ////debugger;
                //var operationUri = '/pr_bundleitems';
                //$.ajax({
                //    type: "POST",
                //    url: operationUri,
                //    data: bundleItem,
                //    error: function (xhr, status, error) {
                //        debugger;
                //        alert('Error in saveTheNewBundle(): ' + error.Message);

                //    },
                //    success: function (data) {
                //        try {
                //            debugger;
                //            console.log('In saveTheNewBundle(). BundleId: ' + data.BundleId);

                //            //$('#divCreateBundleDialog').dialog('close');

                //            //thiz.renderBundleList();
                //            //var bundleDescription = $('#txtBundleDescription').val();
                //            //var quantityBreak = $('#txtQuantityBreak').val();
                //            //var uom = $('#selectBundleUnitOfMeasure').val();
                //            thiz.renderSelectedBundleForThisQuote2(); //thiz.options.selectedBundleDescription, thiz.options.selectedBreakQuantity, thiz.options.selectedUom)

                //            //$('#divAddOrCreateBundleDialog').dialog('close');
                //        } catch (e) {
                //            console.log('Exception in addProductToBundle./pr_bundleitems.success(): ' + e.message + ', ' + e.stack);
                //            alert('Exception in addProductToBundle./pr_bundleitems.success(): ' + e.message + ', ' + e.stack);
                //        }
                //    }
                //});
                $('#divAddedToBundle').dialog({
                    modal: true,
                    resizable: true,
                    closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                    dialogClass: "no-close", // No close button in the upper right corner.
                    hide: false, // This means when hiding just disappear with no effects.
                    height: 200,
                    width: 800,
                    open: function () {
                        try {
                            setTimeout(function () {
                                $('#divAddedToBundle').dialog('close');
                            }, 2000);
                        } catch (e) {
                            console.log('Exception in divAddedToBundle.open(): ' + e.message + ', ' + e.stack);
                        }
                    },
                    close: function () {
                        try {

                        } catch (e) {
                            console.log('Exception in divAddedToBundle.close(): ' + e.message + ', ' + e.stack);
                        }
                    }

                });
                $("#divAddedToBundle").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

            } else {
                // Remove this item from the bundle. 
                this.removeProductFromABundle(this.options.BundleId, productId)
                document.getElementById('divAddedToBundle_Content').innerHTML = 'The product was removed from the bundle.';
                thiz.renderSelectedBundleForThisQuote2();



                //THIS IS INCOMPLETE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                //document.getElementById('divAddedToBundle_Content').innerHTML = 'The product was removed from the bundle.';

                $('#divAddedToBundle').dialog({
                    modal: true,
                    resizable: true,
                    closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                    dialogClass: "no-close", // No close button in the upper right corner.
                    hide: false, // This means when hiding just disappear with no effects.
                    height: 200,
                    width: 800,
                    open: function () {
                        try {
                            setTimeout(function () {
                                $('#divAddedToBundle').dialog('close');
                            }, 2000);
                        } catch (e) {
                            console.log('Exception in divAddedToBundle.open(): ' + e.message + ', ' + e.stack);
                        }
                    },
                    close: function () {
                        try {

                        } catch (e) {
                            console.log('Exception in divAddedToBundle.close(): ' + e.message + ', ' + e.stack);
                        }
                    }

                });
                $("#divAddedToBundle").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

            }

            //$("#divAddedToBundle").closest(".ui-dialog").children(".ui-dialog-titlebar").css("background", "lightblue"); // This sets the color of the title bar.


        } catch (e) {
            console.log('Exception in addOrRemoveProductFromBundle(): ' + e.message + ', ' + e.stack);
            alert('Exception in addOrRemoveProductFromBundle(): ' + e.message + ', ' + e.stack);
        }
    },
    addProductToABundle: function (productId, productDescription, bundleId) {
        try {
            console.log('In addProductToABundle(). productId: ' + productId);
            var thiz = this;
            if (bundleId) {
                // do nothing
            } else {
                bundleId = $('#selectAddAProductToBundle option:selected').val(); // This gets the user selected value from the drop down.
            }
            //var bundleDescription = $('#selectAddAProductToBundle option:selected').text();




            var bundleItem = {
                BundleId: bundleId,
                ProductId: productId,
                ProductDescription: productDescription
            }
            var operationUri = '/pr_bundleitems/';
            $.ajax({
                type: "POST",
                url: operationUri,
                data: bundleItem,
                error: function (xhr, status, error) {
                    debugger;
                    alert('Error in addProductToABundle(): ' + error.Message);
                },
                success: function (data) {
                    try {
                        var thereWasAnError = false;
                        try {
                            // Kind of an ugly way to catch an error but I am in a hurry.
                            if (data && data.toLowerCase() && data.toLowerCase().indexOf('error:') > -1) {
                                thereWasAnError = true;
                            }
                        } catch (e) { }

                        if (thereWasAnError == true) {
                            console.log('Error in addProductToABundle(): ' + data);
                            alert('Error in addProductToABundle(): ' + data);

                            $('#divAddAProductToBundle').dialog('close');
                        } else {
                            console.log('In addProductToABundle(). BundleId: ' + data.BundleId);
                            document.getElementById('divAddedToBundle_Content').innerHTML = 'The product was added to the bundle.';

                            //$('#divCreateBundleDialog').dialog('close');

                            //thiz.renderBundleList();
                            //var bundleDescription = $('#txtBundleDescription').val();
                            //var quantityBreak = $('#txtQuantityBreak').val();
                            //var uom = $('#selectBundleUnitOfMeasure').val();
                            //thiz.renderSelectedBundleForThisQuote2(); //thiz.options.selectedBundleDescription, thiz.options.selectedBreakQuantity, thiz.options.selectedUom)

                            //$('#divAddOrCreateBundleDialog').dialog('close');


                            //thiz.renderBundlesInBundleDialog(productId, bundleId, null);
                            try {
                                $('#divAddAProductToBundle').dialog('close');
                            } catch (e) { }

                            $('.bwAdvancedProductSearch').bwAdvancedProductSearch('reloadBundlesAndReRenderTheDialog'); // Refresh the contents of the "Advanced Search" dialog so that the Bundles column has the correct links in it.

                            $('#divAddedToBundle').dialog({
                                modal: true,
                                resizable: true,
                                closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                                dialogClass: "no-close", // No close button in the upper right corner.
                                hide: false, // This means when hiding just disappear with no effects.
                                height: 200,
                                width: 800,
                                open: function () {
                                    try {
                                        setTimeout(function () {
                                            $('#divAddedToBundle').dialog('close');
                                        }, 2000);
                                    } catch (e) {
                                        console.log('Exception in divAddedToBundle.open(): ' + e.message + ', ' + e.stack);
                                    }
                                },
                                close: function () {
                                    try {

                                    } catch (e) {
                                        console.log('Exception in divAddedToBundle.close(): ' + e.message + ', ' + e.stack);
                                    }
                                }

                            });
                            $("#divAddedToBundle").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
                            //$("#divAddedToBundle").closest(".ui-dialog").children(".ui-dialog-titlebar").css("background", "lightblue"); // This sets the color of the title bar.





                        }

                    } catch (e) {
                        console.log('Exception in addProductToABundle./pr_bundleitems.success(): ' + e.message + ', ' + e.stack);
                        alert('Exception in addProductToABundle./pr_bundleitems.success(): ' + e.message + ', ' + e.stack);
                    }
                }
            });
        } catch (e) {
            console.log('Exception in addProductToABundle(): ' + e.message + ', ' + e.stack);
            alert('Exception in addProductToABundle(): ' + e.message + ', ' + e.stack);
        }
    },
    removeProductFromABundle: function (bundleId, productId) {
        try {
            console.log('In removeProductFromABundle().');
            var thiz = this;

            //debugger;
            var operationUri = '/pr_bundleitems?BundleId=' + bundleId + '&ProductId=' + productId;
            $.ajax({
                type: "DELETE",
                url: operationUri,
                //data: bundleItem,
                error: function (xhr, status, error) {
                    debugger;
                    alert('Error in removeProductFromABundle(): ' + error.Message);
                },
                success: function (data) {
                    try {
                        //debugger;
                        if (data != 'SUCCESS') {
                            alert('Error in removeProductFromABundle.delete.pr_bundleitems.success(): ' + data);
                        } else {
                            console.log('In removeProductFromABundle(). bundleId: ' + bundleId);

                            thiz.renderSelectedBundleForThisQuote2(); //thiz.options.selectedBundleDescription, thiz.options.selectedBreakQuantity, thiz.options.selectedUom)

                            thiz.renderBundlesInBundleDialog(productId, bundleId, null); // Refresh the contents of the bundle dialog to reflect the deleted product.

                            $('.bwAdvancedProductSearch').bwAdvancedProductSearch('reloadBundlesAndReRenderTheDialog'); // Refresh the contents of the "Advanced Search" dialog so that the Bundles column has the correct links in it.

                            document.getElementById('divAddedToBundle_Content').innerHTML = 'The product was removed from the bundle.';
                            $('#divAddedToBundle').dialog({
                                modal: true,
                                resizable: true,
                                closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                                dialogClass: "no-close", // No close button in the upper right corner.
                                hide: false, // This means when hiding just disappear with no effects.
                                height: 200,
                                width: 800,
                                open: function () {
                                    try {
                                        setTimeout(function () {
                                            $('#divAddedToBundle').dialog('close');
                                        }, 2000);
                                    } catch (e) {
                                        console.log('Exception in divAddedToBundle.open(): ' + e.message + ', ' + e.stack);
                                    }
                                },
                                close: function () {
                                    try {

                                    } catch (e) {
                                        console.log('Exception in divAddedToBundle.close(): ' + e.message + ', ' + e.stack);
                                    }
                                }

                            });
                            $("#divAddedToBundle").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
                            //$("#divAddedToBundle").closest(".ui-dialog").children(".ui-dialog-titlebar").css("background", "lightblue"); // This sets the color of the title bar.
                        }

                    } catch (e) {
                        console.log('Exception in removeProductFromABundle./pr_bundleitems.success(): ' + e.message + ', ' + e.stack);
                        alert('Exception in removeProductFromABundle./pr_bundleitems.success(): ' + e.message + ', ' + e.stack);
                    }
                }
            });

        } catch (e) {
            console.log('Exception in removeProductFromABundle(): ' + e.message + ', ' + e.stack);
            alert('Exception in removeProductFromABundle(): ' + e.message + ', ' + e.stack);
        }
    },
    enableOrDisableBundleItemSelectionCheckboxes: function () {
        try {
            // This handles the checkboxes in the Bundle column in the webgrid.
            console.log('In enableOrDisableBundleItemSelectionCheckboxes().');
            var elements = $('.divSelectedSku-BundleColumnCell');
            if (elements.length > 0) {
                //debugger;
                if (this.options.BundleId) { // Since we have BundleId, the user has selected a bundle.
                    // Enable the checkboxes.
                    for (var i = 0; i < elements.length; i++) {
                        elements[i].style.color = 'black'; // black text make it look enabled.
                        $(elements[i]).find('input[type=checkbox]').removeAttr('disabled'); // Enable the checkbox.
                        $(elements[i]).find('input[type=checkbox]').removeAttr('checked'); // Initially we reset all of them then select them afterwards. This makes sure we don't have inadvertently selected checkboxes.

                        // Now we have to select the checkboxes for the ones that are in the bundle.
                        if (this.options.BundleItems) {
                            var productCode = $(elements[i]).attr('productcode');
                            if (productCode) {
                                //debugger;
                                for (var j = 0; j < this.options.BundleItems.length; j++) {
                                    // We can find some data to compare here somewhere.....
                                    if (productCode == this.options.BundleItems[j].ProductId) {
                                        //debugger;
                                        $(elements[i]).find('input[type=checkbox]').prop('checked', true);
                                    }
                                }
                            } else {
                                console.log('Error in enableOrDisableBundleItemSelectionCheckboxes(). Could not find attribute productid.');
                                alert('Error in enableOrDisableBundleItemSelectionCheckboxes(). Could not find attribute productid.');
                            }
                        }

                    }
                } else {
                    // Disable the checkboxes.
                    for (var i = 0; i < elements.length; i++) {
                        elements[i].style.color = 'lightgrey'; // black text make it look enabled.
                        $(elements[i]).find('input[type=checkbox]').attr('disabled', true); // Enable the checkbox.
                        $(elements[i]).find('input[type=checkbox]').removeAttr('checked'); // Un-check the checkbox.
                    }
                }
            } else {
                // do nothing. There are no elements to enable or disable.
            }

        } catch (e) {
            console.log('Exception in enableOrDisableBundleItemSelectionCheckboxes(): ' + e.message + ', ' + e.stack);
            alert('Exception in enableOrDisableBundleItemSelectionCheckboxes(): ' + e.message + ', ' + e.stack);
        }
    },
    renderBundlingDropDown: function () {
        try {
            //console.log('In renderBundlingDropDown().');




        } catch (e) {
            //thiz.hideActivitySpinner();

            console.log('Exception in renderBundlingDropDown(): ' + e.message + ', ' + e.stack);
            document.getElementById('bwDistributorBundling_Error').innerHTML = 'Exception in renderBundlingDropDown(): ' + e.message + ', ' + e.stack;
        }
    },
    editBundle: function (bundleId, bundleDescription, quantityBreak, uom) {
        try {
            console.log('In editBundle().');
            var thiz = this;

            ShowActivitySpinner();

            $('#divEditBundleDialog').dialog({
                modal: true,
                resizable: true,
                closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                height: 400,
                width: 500,
                open: function () {
                    try {
                        // Call the web service to get the UOMs.
                        var operationUri = '/UOM/GetValidUOMs/';
                        $.ajax({
                            url: operationUri,
                            type: "GET",
                            contentType: 'application/json',
                            timeout: thiz.options.ajaxTimeout,
                            success: function (data) {
                                try {

                                    $('#divEditBundleDialog_BundleId').val(bundleId);
                                    $('#divEditBundleDialog_txtBundleDescription').val(bundleDescription);
                                    $('#divEditBundleDialog_txtQuantityBreak').val(quantityBreak);

                                    var html = '';
                                    html += '               <select id="divEditBundleDialog_selectBundleUnitOfMeasure" style="padding: 9px;border: solid 1px #517B97;outline: 0;background: -webkit-gradient(linear, left top, left 25, from(#FFFFFF), color-stop(4 %, #CAD9E3), to(#FFFFFF));background: -moz-linear-gradient(top, #FFFFFF, #CAD9E3 1px, #FFFFFF 25px);box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 8px;-moz-box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 8px;-webkit-box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 8px;" >';
                                    html += '                   <option value="">Select a Unit of Measure</option>';
                                    // Call the webservice to get the valid UOMs so we can display in the drop down. todd 11-29-2020
                                    for (var i = 0; i < data.length; i++) {
                                        if (uom == data[i].UOM) {
                                            html += '                   <option selected value="' + data[i].UOM + '">' + data[i].UOM + ' - ' + data[i].UOMDescription + '</option>';
                                        } else {
                                            html += '                   <option value="' + data[i].UOM + '">' + data[i].UOM + ' - ' + data[i].UOMDescription + '</option>';
                                        }
                                    }
                                    html += '               </select>';
                                    $('#divEditBundleDialog_divBundlingUOMDropDown1').html(html);

                                    HideActivitySpinner();

                                } catch (e) {
                                    HideActivitySpinner();

                                    console.log('Exception in editBundle(): ' + e.message + ', ' + e.stack);
                                    document.getElementById('bwAdvancedProductSearch_Error').innerHTML = 'Exception in editBundle():2: ' + e.message + ', ' + e.stack;
                                }
                            },
                            error: function (data, errorCode, errorMessage) {
                                HideActivitySpinner();

                                console.log('Error in editBundle(): ' + errorMessage + ', ' + data.responseText);
                                document.getElementById('bwAdvancedProductSearch_Error').innerHTML = 'Error in editBundle(): ' + errorMessage + ', ' + data.responseText;
                            }
                        });

                    } catch (e) {
                        HideActivitySpinner();

                        console.log('Exception in editBundle.dialog.open(): ' + e.message + ', ' + e.stack);
                    }
                },
                close: function () {
                    try {

                        //$('#divBwAdvancedProductSearch1').bwAdvancedProductSearch('destroy'); // Get rid of the bwAdvancedProductSearch widget. This calls it's _destroy() method.

                    } catch (e) {
                        console.log('Exception in editBundle.close(): ' + e.message + ', ' + e.stack);
                    }
                }
            });
            //$("#divCreateBundleDialog").closest(".ui-dialog").children(".ui-dialog-titlebar").css("background", "lightblue"); // This sets the color of the title bar.

        } catch (e) {
            HideActivitySpinner();

            console.log('Exception in editBundle(): ' + e.message + ', ' + e.stack);
        }
    },
    createANewBundle: function () {
        try {
            console.log('In createANewBundle().');
            var thiz = this;

            try {
                $('#divAddAProductToBundle').dialog('close');
            } catch (e) { }

            $('#divCreateBundleDialog').dialog({
                modal: true,
                resizable: true,
                closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                height: 400,
                width: 500,
                //position: {
                //    my: "right-20 top-70",
                //    at: "left top",
                //    of: "#createnewquoteform"
                //},
                //position: {
                //    my: "middle top+12",
                //    at: "middle top",
                //    of: window //"#btnAdvancedProductSearch"
                //},
                open: function () {
                    try {


                        // Call the web service to get the UOMs.
                        var operationUri = '/UOM/GetValidUOMs/';
                        $.ajax({
                            url: operationUri,
                            type: "GET",
                            contentType: 'application/json',
                            timeout: thiz.options.ajaxTimeout,
                            success: function (data) {
                                try {
                                    //debugger; // 12-1-2020 did we get the UOMDescription back here? We need to put it into the drop down.
                                    //this.displayActivitySpinner();
                                    var html = '';


                                    html += '               <select id="selectBundleUnitOfMeasure" style="padding: 9px;border: solid 1px #517B97;outline: 0;background: -webkit-gradient(linear, left top, left 25, from(#FFFFFF), color-stop(4 %, #CAD9E3), to(#FFFFFF));background: -moz-linear-gradient(top, #FFFFFF, #CAD9E3 1px, #FFFFFF 25px);box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 8px;-moz-box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 8px;-webkit-box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 8px;" >';
                                    html += '                   <option value="">Select a Unit of Measure</option>';
                                    // Call the webservice to get the valid UOMs so we can display in the drop down. todd 11-29-2020
                                    for (var i = 0; i < data.length; i++) {
                                        html += '                   <option value="' + data[i].UOM + '">' + data[i].UOM + ' - ' + data[i].UOMDescription + '</option>';
                                    }
                                    html += '               </select>';

                                    $('#divBundlingUOMDropDown1').html(html);


                                    //debugger;
                                    //thiz.hideActivitySpinner();

                                } catch (e) {
                                    //thiz.hideActivitySpinner();

                                    console.log('Exception in renderProductSearchScreen(): ' + e.message + ', ' + e.stack);
                                    document.getElementById('bwAdvancedProductSearch_Error').innerHTML = 'Exception in renderProductSearchScreen():2: ' + e.message + ', ' + e.stack;
                                }
                            },
                            error: function (data, errorCode, errorMessage) {
                                debugger;
                                //thiz.hideActivitySpinner();

                                console.log('Error getting data from the server. Try refreshing the page. Error details: ' + errorMessage + ', ' + data.responseText);
                                document.getElementById('bwAdvancedProductSearch_Error').innerHTML = 'Error getting data from the server. Try refreshing the page. Error details: ' + errorMessage + ', ' + data.responseText;
                            }
                        });




                    } catch (e) {
                        console.log('Exception in createANewBundle.open(): ' + e.message + ', ' + e.stack);
                    }
                },
                close: function () {
                    try {

                        //$('#divBwAdvancedProductSearch1').bwAdvancedProductSearch('destroy'); // Get rid of the bwAdvancedProductSearch widget. This calls it's _destroy() method.

                    } catch (e) {
                        console.log('Exception in createANewBundle.close(): ' + e.message + ', ' + e.stack);
                    }
                }
            });
            //$("#divCreateBundleDialog").closest(".ui-dialog").children(".ui-dialog-titlebar").css("background", "lightblue"); // This sets the color of the title bar.


        } catch (e) {
            console.log('Exception in createANewBundle(): ' + e.message + ', ' + e.stack);
            document.getElementById('bwDistributorBundling_Error').innerHTML = 'Exception in createANewBundle(): ' + e.message + ', ' + e.stack;
        }
    },
    clearBundle: function () {
        try {
            console.log('In clearBundle().');
            document.getElementById('divBundleSummary').innerHTML = '';

            var html = '';
            html += '<span style="color:red;">No bundle selected</span>';
            $('#divBundleSummary').html(html);

            this.options.BundleId = null;
            this.options.selectedBundleDescription = null;
            this.options.selectedBreakQuantity = null;
            this.options.selectedUom = null;

            this.enableOrDisableBundleItemSelectionCheckboxes();

        } catch (e) {
            console.log('Exception in clearBundle(): ' + e.message + ', ' + e.stack);
            document.getElementById('bwDistributorBundling_Error').innerHTML = 'Exception in clearBundle(): ' + e.message + ', ' + e.stack;
        }
    },
    closeCreateANewBundleDialog: function () {
        try {
            console.log('In closeCreateANewBundleDialog().');

            $('#divCreateBundleDialog').dialog('close');

        } catch (e) {
            console.log('Exception in closeCreateANewBundleDialog(): ' + e.message + ', ' + e.stack);
            document.getElementById('bwDistributorBundling_Error').innerHTML = 'Exception in closeCreateANewBundleDialog(): ' + e.message + ', ' + e.stack;
        }
    },
    closeEditABundleDialog: function () {
        try {
            console.log('In closeEditABundleDialog().');

            $('#divEditBundleDialog').dialog('close');

        } catch (e) {
            console.log('Exception in closeEditABundleDialog(): ' + e.message + ', ' + e.stack);
            document.getElementById('bwDistributorBundling_Error').innerHTML = 'Exception in closeEditABundleDialog(): ' + e.message + ', ' + e.stack;
        }
    },
    closeAddAProductToBundleDialog: function () {
        try {
            console.log('In closeAddAProductToBundleDialog().');

            $('#divAddAProductToBundle').dialog('close'); 

        } catch (e) {
            console.log('Exception in closeAddAProductToBundleDialog(): ' + e.message + ', ' + e.stack);
            document.getElementById('bwDistributorBundling_Error').innerHTML = 'Exception in closeAddAProductToBundleDialog(): ' + e.message + ', ' + e.stack;
        }
    },
    closeBundleSummaryListDialog: function () {
        try {
            console.log('In closeBundleSummaryListDialog().');

            $('#divAddOrCreateBundleDialog').dialog('close'); // divAddAProductToBundle

        } catch (e) {
            console.log('Exception in closeBundleSummaryListDialog(): ' + e.message + ', ' + e.stack);
            document.getElementById('bwDistributorBundling_Error').innerHTML = 'Exception in closeBundleSummaryListDialog(): ' + e.message + ', ' + e.stack;
        }
    },
    selectBundleForThisQuote: function (element, bundleId) {
        try {
            // The user has clicked the "Select" button.
            console.log('In selectBundleForThisQuote().');
            var thiz = this;
            ShowActivitySpinner();

            // Get the table row.
            var row = $(element).closest('tr');
            var cells = $(row).find('td');
            this.options.selectedBundleDescription = cells[2].innerHTML;
            this.options.selectedBreakQuantity = cells[3].innerHTML;
            this.options.selectedUom = cells[4].innerHTML;

            this.options.BundleId = bundleId;

            // This is where we have to add the contents of the Bundle to the Quote.
            var operationUri = '/Distributor/AddBundleToQuote?bundleId=' + bundleId;
            $.ajax({
                url: operationUri,
                type: "POST",
                contentType: 'application/json',
                timeout: this.options.ajaxTimeout,
                success: function (html) {
                    try {
                        //debugger;
                        $('#SelectedSku').html(html);
                        //$("#btnAnalyze").prop("disabled", false); // This is the "Next" button.
                        //debugger; // THIS IS IT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                        //$('.bwDistributorBundling').bwDistributorBundling('renderSelectedBundleForThisQuote2'); // This refreshes the Bundle section on the page.

                        thiz.renderSelectedBundleForThisQuote2();

                        $('#divAddOrCreateBundleDialog').dialog('close');

                        try {
                            $('#bwProductCatalog1').dialog('close'); // If the user came from the "Advanced Search", then they probably want to have this window closed automatically as well. Catching the exception in case the dialog wasn't displayed.
                        } catch (e) {}

                        HideActivitySpinner();

                    } catch (e) {

                        HideActivitySpinner();

                        console.log('Exception in btnAdd_OnClick():2: ' + e.message + ', ' + e.stack);
                        document.getElementById('bwAdvancedProductSearch_Error').innerHTML = 'Exception in btnAdd_OnClick():2: ' + e.message + ', ' + e.stack;
                    }
                },
                error: function (data, errorCode, errorMessage) {

                    HideActivitySpinner();

                    console.log('Error in btnAdd_OnClick():' + errorMessage + ', ' + data.responseText);
                    document.getElementById('bwAdvancedProductSearch_Error').innerHTML = 'Error in btnAdd_OnClick():' + errorMessage + ', ' + data.responseText;
                }
            });

            //this.renderSelectedBundleForThisQuote2();

            //$('#divAddOrCreateBundleDialog').dialog('close');

        } catch (e) {
            HideActivitySpinner();
            console.log('Exception in selectBundleForThisQuote(): ' + e.message + ', ' + e.stack);
            document.getElementById('bwDistributorBundling_Error').innerHTML = 'Exception in selectBundleForThisQuote(): ' + e.message + ', ' + e.stack;
        }
    },
    renderSelectedBundleForThisQuote2: function () {
        try {
            console.log('In renderSelectedBundleForThisQuote2().');
            var thiz = this;
            if (this.options.BundleId) {
                var operationUri = '/pr_bundleitems?BundleId=' + this.options.BundleId;
                $.ajax({
                    type: "GET",
                    url: operationUri,
                    error: function (xhr, status, error) {
                        debugger;
                        HideActivitySpinner();
                        alert('Error in renderSelectedBundleForThisQuote2(): ' + error.Message);
                    },
                    success: function (data) {
                        try {
                            var html = '';

                            html += 'Bundle: ' + thiz.options.selectedBundleDescription + ' - ' + thiz.options.selectedBreakQuantity + ' / ' + thiz.options.selectedUom;
                            html += '<br />';

                            thiz.options.BundleItems = [];
                            if (data.length == 0) {
                                html += '<span style="color:tomato;">No items in this bundle</span>';
                            } else {
                                //html += '<span style="font-weight:bold;">Items in bundle: </span>';
                                //html += '<br />';

                                //var thereAreItemsInTheBundle = false;
                                for (var i = 0; i < data.length; i++) {
                                    //    html += 'ProductId:' + data[i].ProductId + ': ' + data[i].ProductDescription + ' <span style="cursor:pointer;background-color:tomato;color:white;font-weight:bold;" title="Remove this item from the bundle" onclick="alert(\'This functionality is incomplete. Coming soon!\');" >&nbsp;x&nbsp;</span>';
                                    //    html += '<br />';
                                    //    thereAreItemsInTheBundle = true;
                                    var bundle = {
                                        ProductId: data[i].ProductId,
                                        ProductCode: data[i].ProductCode,
                                        ProductDescription: data[i].ProductDescription
                                    }
                                    //debugger;
                                    thiz.options.BundleItems.push(bundle);
                                }
                                console.log('In renderSelectedBundleForThisQuote2(). Reloaded this.options.BundleItems with ' + thiz.options.BundleItems.length + ' items.');
                                //if (thereAreItemsInTheBundle == false) {
                                //    html += '<span style="color:tomato;">No items in this bundle</span>';
                                //}

                            }
                            document.getElementById('divBundleSummary').innerHTML = html;

                            thiz.enableOrDisableBundleItemSelectionCheckboxes();

                            HideActivitySpinner();

                        } catch (e) {
                            HideActivitySpinner();
                            console.log('Exception in renderSelectedBundleForThisQuote2.pr_bundleitems.success(): ' + e.message + ', ' + e.stack);
                            alert('Exception in renderSelectedBundleForThisQuote2.pr_bundleitems.success(): ' + e.message + ', ' + e.stack);
                        }
                    }
                });
            }
        } catch (e) {
            HideActivitySpinner();
            console.log('Exception in renderSelectedBundleForThisQuote2(): ' + e.message + ', ' + e.stack);
            document.getElementById('bwDistributorBundling_Error').innerHTML = 'Exception in renderSelectedBundleForThisQuote2(): ' + e.message + ', ' + e.stack;
        }
    },
    displayAddProductToABundleDialog: function (productId, productCode, productDescription) {
        try {
            console.log('In displayAddProductToABundleDialog(). productId: ' + productId);
            var thiz = this;
            //debugger;
            $('#divAddAProductToBundle').dialog({
                modal: true,
                resizable: true,
                closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                height: 300,
                width: 600,
                //position: {
                //    my: "right-20 top-70",
                //    at: "left top",
                //    of: "#createnewquoteform"
                //},
                position: {
                    my: "middle top+12",
                    at: "middle top",
                    of: window //"#btnAdvancedProductSearch"
                },
                open: function () {
                    try {

                        // Populate the drop down: selectAddAProductToBundle
                        var operationUri = '/api/BundleItems?CustomerId=' + thiz.options.BWCustomer.CustomerIdentifier;
                        $.ajax({
                            type: "GET",
                            url: operationUri,
                            error: function (xhr, status, error) {
                                //var err = eval("(" + xhr.responseText + ")");
                                debugger;
                                alert('Error in displayAddProductToABundleDialog(): ' + error.Message);
                            },
                            success: function (data) {
                                //debugger; // We should be getting ivwPR_BundleItems result here!!!!!!!!!!!!!!!!!!!!!!!!!!! 12-29-2020
                                console.log('In displayAddProductToABundleDialog().');

                                var uniqueBundles = []; // Create the list of unique bundle names.
                                for (var i = 0; i < data.length; i++) {
                                    var isInUniqueBundles = false;
                                    for (var j = 0; j < uniqueBundles.length; j++) {
                                        if (data[i].BundleId == uniqueBundles[j].BundleId) {
                                            isInUniqueBundles = true;
                                            break;
                                        }
                                    }
                                    if (isInUniqueBundles == false) {
                                        var bundle = {
                                            BundleId: data[i].BundleId,
                                            BundleDescription: data[i].BundleDescription,
                                            QuantityBreak: data[i].QuantityBreak,
                                            UOM: data[i].UOM
                                        }
                                        uniqueBundles.push(bundle); // Add it to the array.
                                    }
                                }

                                var html = '';
                                html += productCode + ' - ' + productDescription;
                                $('#divAddAProductToBundle_Product').html(html);

                                html = '';
                                html += '<select class="bundleDropDown" id="selectAddAProductToBundle" >';
                                html += '<option value="">Select a Bundle...</option>';
                                for (var i = 0; i < uniqueBundles.length; i++) {
                                    html += '<option value="' + uniqueBundles[i].BundleId + '">' + uniqueBundles[i].BundleDescription + '</option>';
                                }
                                html += '</select>';
                                $('#spanAddAProductToBundle_Dropdown').html(html);

                                html = '';
                                html += '<input type="button" class="button-blue" value="Add to Bundle" onclick="$(\'.bwDistributorBundling\').bwDistributorBundling(\'addProductToABundle\', \'' + productId + '\', \'' + productDescription + '\');" />';
                                $('#spanAddAProductToBundle_Button').html(html);

                            }
                        });

                    } catch (e) {
                        console.log('Exception in displayAddProductToABundleDialog.open(): ' + e.message + ', ' + e.stack);
                    }
                },
                close: function () {
                    try {

                        //$('#divBwAdvancedProductSearch1').bwAdvancedProductSearch('destroy'); // Get rid of the bwAdvancedProductSearch widget. This calls it's _destroy() method.

                    } catch (e) {
                        console.log('Exception in displayAddProductToABundleDialog.close(): ' + e.message + ', ' + e.stack);
                    }
                }
            });
            //$("#divAddAProductToBundle").closest(".ui-dialog").children(".ui-dialog-titlebar").css("background", "lightblue"); // This sets the color of the title bar.

        } catch (e) {
            console.log('Exception in displayAddProductToABundleDialog(): ' + e.message + ', ' + e.stack);
            //document.getElementById('bwDistributorBundling_Error').innerHTML = 'Exception in displayAddProductToABundleDialog(): ' + e.message + ', ' + e.stack;
            alert('Exception in displayAddProductToABundleDialog(): ' + e.message + ', ' + e.stack);
        }
    },
    displaySelectABundleDialog: function (productId, bundleId, bundleItemId) {
        try {
            debugger;
            console.log('In displaySelectABundleDialog(). productId: ' + productId + ', bundleId: ' + bundleId + ', bundleItemId: ' + bundleItemId);
            var thiz = this;
            //debugger;
            $('#divAddOrCreateBundleDialog').dialog({
                modal: true,
                resizable: true,
                closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                height: 600,
                width: 900,
                //position: {
                //    my: "right-20 top-70",
                //    at: "left top",
                //    of: "#createnewquoteform"
                //},
                position: {
                    my: "middle top+12",
                    at: "middle top",
                    of: window //"#btnAdvancedProductSearch"
                },
                open: function () {
                    try {

                        thiz.renderBundlesInBundleDialog(productId, bundleId, bundleItemId);

                    } catch (e) {
                        console.log('Exception in displaySelectABundleDialog.open(): ' + e.message + ', ' + e.stack);
                    }
                },
                close: function () {
                    try {

                        //$('#divBwAdvancedProductSearch1').bwAdvancedProductSearch('destroy'); // Get rid of the bwAdvancedProductSearch widget. This calls it's _destroy() method.

                    } catch (e) {
                        console.log('Exception in displaySelectABundleDialog.close(): ' + e.message + ', ' + e.stack);
                    }
                }
            });
            //$("#divAddOrCreateBundleDialog").closest(".ui-dialog").children(".ui-dialog-titlebar").css("background", "lightblue"); // This sets the color of the title bar.

        } catch (e) {
            console.log('Exception in displaySelectABundleDialog(): ' + e.message + ', ' + e.stack);
            document.getElementById('bwDistributorBundling_Error').innerHTML = 'Exception in rbEnableBundlingOnThisQuote_OnChange(): ' + e.message + ', ' + e.stack;
        }
    },
    renderBundlesInBundleDialog: function (productId, bundleId, bundleItemId) {
        try {
            console.log('In renderBundlesInBundleDialog(). productId: ' + productId + ', bundleId: ' + bundleId + ', bundleItemId: ' + bundleItemId);
            var thiz = this;
            if (!bundleId) {
                bundleId = this.options.BundleId;
            }
            try {
                var operationUri = '/api/BundleItems?CustomerId=' + thiz.options.BWCustomer.CustomerIdentifier;
                $.ajax({
                    type: "GET",
                    url: operationUri,
                    error: function (xhr, status, error) {
                        //var err = eval("(" + xhr.responseText + ")");
                        debugger;
                        alert('Error in displaySelectABundleDialog(): ' + error.Message);
                    },
                    success: function (data) {
                        //debugger; // We should be getting ivwPR_BundleItems result here!!!!!!!!!!!!!!!!!!!!!!!!!!! 12-29-2020
                        console.log('In displaySelectABundleDialog().');

                        var uniqueBundles = []; // Create the list of unique bundle names.
                        for (var i = 0; i < data.length; i++) {
                            var isInUniqueBundles = false;
                            for (var j = 0; j < uniqueBundles.length; j++) {
                                if (data[i].BundleId == uniqueBundles[j].BundleId) {
                                    isInUniqueBundles = true;
                                    break;
                                }
                            }
                            if (isInUniqueBundles == false) {
                                var bundle = {
                                    BundleId: data[i].BundleId,
                                    BundleDescription: data[i].BundleDescription,
                                    QuantityBreak: data[i].QuantityBreak,
                                    UOM: data[i].UOM
                                }
                                uniqueBundles.push(bundle); // Add it to the array.
                            }
                        }

                        var html = '';
                        html += '   <table>';
                        html += '       <tr>';
                        html += '           <td></td>';
                        html += '           <td></td>';
                        html += '           <td>Description</td>';
                        html += '           <td>Break Qty</td>';
                        html += '           <td>Unit of Measure (UOM)</td>';
                        html += '           <td>';
                        html += '           </td> ';

                        html += '       </tr>';
                        for (var i = 0; i < uniqueBundles.length; i++) {
                            html += '       <tr>';
                            html += '           <td onclick="$(\'.bwDistributorBundling\').bwDistributorBundling(\'expandOrCollapseBundleSection\', this);" >';
                            //debugger;
                            if (bundleId && bundleId == uniqueBundles[i].BundleId) {
                                html += '               <img title="collapse" style="cursor:pointer;width:35px;height:35px;vertical-align:middle;" src="/images/drawer-close.png"> ';
                            } else {
                                html += '               <img title="expand" style="cursor:pointer;width:35px;height:35px;vertical-align:middle;" src="/images/drawer-open.png"> ';
                            }
                            html += '           </td>';
                            html += '           <td></td>';
                            html += '           <td>' + uniqueBundles[i].BundleDescription + '</td>';
                            html += '           <td>' + uniqueBundles[i].QuantityBreak + '</td>';
                            html += '           <td>' + uniqueBundles[i].UOM + '</td>';
                            html += '           <td>';
                            html += '               <input id="btnViewBundling" class="button-blue" type="button" style="cursor:pointer;" value="Select" onclick="$(\'.bwDistributorBundling\').bwDistributorBundling(\'selectBundleForThisQuote\', this, \'' + uniqueBundles[i].BundleId + '\');" />';
                            html += '               &nbsp;&nbsp;';
                            html += '               <input id="btnEditBundleType" class="button-blue" type="button" style="cursor:pointer;" value="Edit" onclick="$(\'.bwDistributorBundling\').bwDistributorBundling(\'editBundle\', \'' + uniqueBundles[i].BundleId + '\', \'' + uniqueBundles[i].BundleDescription + '\', \'' + uniqueBundles[i].QuantityBreak + '\', \'' + uniqueBundles[i].UOM + '\');" />';
                            html += '               &nbsp;&nbsp;';
                            html += '               <span class="button-red" style="color:white;" src="~/Images/icon-right.png" onclick="$(\'.bwDistributorBundling\').bwDistributorBundling(\'deleteABundle\', \'' + uniqueBundles[i].BundleId + '\');" >X</span>';
                            html += '           </td> ';

                            html += '       </tr>';
                            if (bundleId && bundleId == uniqueBundles[i].BundleId) {
                                html += '       <tr style="display:table-row;" >';
                            } else {
                                html += '       <tr style="display:none;" >';
                            }
                            html += '           <td colspan="2"></td>';
                            html += '           <td colspan="4">';

                            if (data.length > -1) {
                                html += '<table>';
                            }
                            var thereWereItemsInTheBundle = false;
                            for (var j = 0; j < data.length; j++) {

                                //debugger;
                                if ((uniqueBundles[i].BundleId == data[j].BundleId) && data[j].ProductId) {
                                    if (productId && productId == data[j].ProductId) {
                                        html += '<tr>';
                                        html += '   <td style="width:150px;">';
                                        html += '       <span style="color:tomato;">' + data[j].ProductCode + '</span>';
                                        html += '   </td>';
                                        html += '   <td style="width:250px;">';
                                        html += '       <span style="color:tomato;">' + data[j].ProductDescription + '</span>';
                                        html += '   </td>';
                                        html += '   <td>';
                                        html += '       <span style="color:white;cursor:pointer;" onclick="$(\'.bwDistributorBundling\').bwDistributorBundling(\'removeProductFromABundle\', \'' + data[j].BundleId + '\', \'' + data[j].ProductId + '\');" >';
                                        html += '           <span class="button-red" style="color:white;" src="~/Images/icon-right.png">X</span>';
                                        html += '       </span>';
                                        html += '   </td>';
                                        html += '</tr>';
                                    } else {
                                        html += '<tr>';
                                        html += '   <td style="width:150px;">';
                                        html += '       <span style="color:black;">' + data[j].ProductCode + '</span>';
                                        html += '   </td>';
                                        html += '   <td style="width:250px;">';
                                        html += '       <span style="color:black;">' + data[j].ProductDescription + '</span>';
                                        html += '   </td>';
                                        html += '   <td>';
                                        html += '       <span style="color:white;cursor:pointer;" onclick="$(\'.bwDistributorBundling\').bwDistributorBundling(\'removeProductFromABundle\', \'' + data[j].BundleId + '\', \'' + data[j].ProductId + '\');" >';
                                        html += '           <span class="button-red" style="color:white;" src="~/Images/icon-right.png">X</span>';
                                        html += '       </span>';
                                        html += '   </td>';
                                        html += '</tr>';
                                    }
                                    thereWereItemsInTheBundle = true;
                                }

                            }
                            if (data.length > -1) {
                                html += '</table>';
                            }

                            if (thereWereItemsInTheBundle == false) {
                                html += '       <span style="color:red;">No items in this bundle</span>';
                                html += '       <br />';
                            }

                            //html += '           <br />';
                            //html += '           <br />';
                            html += '           </td>';
                            html += '       </tr>';
                        }
                        html += '   </table>';

                        //alert('In displaySelectABundleDialog(). Setting divBundleDialog_BundleTable html.');
                        $('#divBundleDialog_BundleTable').html(html);

                        //debugger;
                        thiz.enableOrDisableBundleItemSelectionCheckboxes(); // This enables the checkboxes so that items can be removed or added to the bundle.

                    }
                });


            } catch (e) {
                console.log('Exception in displaySelectABundleDialog.open(): ' + e.message + ', ' + e.stack);
            }

        } catch (e) {
            console.log('Exception in displaySelectABundleDialog(): ' + e.message + ', ' + e.stack);
            document.getElementById('bwDistributorBundling_Error').innerHTML = 'Exception in rbEnableBundlingOnThisQuote_OnChange(): ' + e.message + ', ' + e.stack;
        }
    },
    displayViewABundleDialog: function () {
        try {
            console.log('In displayViewABundleDialog().');
            debugger;
            $('#divViewABundleDialog_Content').html('');
            $('#divViewABundleDialog').dialog({
                modal: true,
                resizable: true,
                closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                height: 600,
                width: 900,
                //position: {
                //    my: "right-20 top-70",
                //    at: "left top",
                //    of: "#createnewquoteform"
                //},
                position: {
                    my: "middle top+12",
                    at: "middle top",
                    of: window //"#btnAdvancedProductSearch"
                },
                open: function () {
                    try {

                        var operationUri = '/api/BundleType';
                        $.ajax({
                            type: "GET",
                            url: operationUri,
                            error: function (xhr, status, error) {
                                //var err = eval("(" + xhr.responseText + ")");
                                debugger;
                                alert('Error in displayViewABundleDialog(): ' + xhr); //error.Message);
                            },
                            success: function (data) {
                                debugger;
                                console.log('In displaySelectABundleDialog().');

                                var html = '';
                                html += '   <table>';
                                html += '       <tr>';
                                html += '           <td></td>';
                                html += '           <td>Description</td>';
                                html += '           <td>Break Qty</td>';
                                html += '           <td>Unit of Measure (UOM)</td>';
                                html += '           <td>';
                                html += '           </td> ';
                                html += '           <td>';
                                html += '           </td> ';
                                html += '       </tr>';
                                for (var i = 0; i < data.length; i++) {
                                    html += '       <tr>';
                                    html += '           <td>';
                                    html += '               <input id="btnEditBundleType" class="button-blue" type="button" style="cursor:pointer;" value="Edit" onclick="$(\'.bwDistributorBundling\').bwDistributorBundling(\'editBundle\', \'' + data[i].BundleId + '\', \'' + data[i].BundleDescription + '\', \'' + data[i].QuantityBreak + '\', \'' + data[i].UOM + '\');" />';
                                    html += '           </td>';
                                    html += '           <td>' + data[i].BundleDescription + '</td>';
                                    html += '           <td>' + data[i].QuantityBreak + '</td>';
                                    html += '           <td>' + data[i].UOM + '</td>';
                                    html += '           <td>';
                                    html += '               <input id="btnViewBundling" class="button-blue" type="button" style="cursor:pointer;" value="Select" onclick="$(\'.bwDistributorBundling\').bwDistributorBundling(\'selectBundleForThisQuote\', this, \'' + data[i].BundleId + '\');" />';
                                    html += '           </td> ';
                                    html += '           <td>';
                                    html += '               <a class="button-red" style="color:white;" data-ajax="true" data-ajax-method="POST" data-ajax-mode="replace" href="" src="~/Images/icon-right.png">X</a>';
                                    html += '           </td> ';
                                    html += '       </tr>';
                                }
                                html += '   </table>';

                                $('#divViewABundleDialog_Content').html(html);

                            }
                        });


                    } catch (e) {
                        console.log('Exception in displayViewABundleDialog.open(): ' + e.message + ', ' + e.stack);
                    }
                },
                close: function () {
                    try {


                    } catch (e) {
                        console.log('Exception in displaySelectABundleDialog.close(): ' + e.message + ', ' + e.stack);
                    }
                }
            });
            //$("#divViewABundleDialog").closest(".ui-dialog").children(".ui-dialog-titlebar").css("background", "lightblue"); // This sets the color of the title bar.

        } catch (e) {
            console.log('Exception in displayViewABundleDialog(): ' + e.message + ', ' + e.stack);
            document.getElementById('bwDistributorBundling_Error').innerHTML = 'Exception in displayViewABundleDialog(): ' + e.message + ', ' + e.stack;
        }
    },
    saveTheNewBundle: function (element) {
        try {
            console.log('In saveTheNewBundle().');
            var thiz = this;
            var bundleDescription = $('#divCreateBundleDialog').find('#txtBundleDescription').val();
            var quantityBreak = $('#divCreateBundleDialog').find('#txtQuantityBreak').val();
            var uom = $('#divCreateBundleDialog').find('#selectBundleUnitOfMeasure').val();

            var validationResult = this.validateTheBundlePriorToSaving(bundleDescription, quantityBreak, uom);
            if (validationResult != "") {
                document.getElementById('divAddedToBundle_Content').innerHTML = validationResult;
                $('#divAddedToBundle').dialog({
                    modal: true,
                    resizable: true,
                    closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                    dialogClass: "no-close", // No close button in the upper right corner.
                    hide: false, // This means when hiding just disappear with no effects.
                    height: 200,
                    width: 800,
                    open: function () {
                        try {
                            setTimeout(function () {
                                $('#divAddedToBundle').dialog('close');
                            }, 2000);
                        } catch (e) {
                            console.log('Exception in saveTheEditedBundle.open(): ' + e.message + ', ' + e.stack);
                        }
                    },
                    close: function () {
                        try {

                        } catch (e) {
                            console.log('Exception in saveTheEditedBundle.close(): ' + e.message + ', ' + e.stack);
                        }
                    }

                });
                $("#divAddedToBundle").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

            } else {
                var bundle = {
                    BundleDescription: bundleDescription,
                    CurrencyCode: this.options.BWCustomer.CurrencyCode,
                    CustomerId: this.options.BWCustomer.CustomerIdentifier, // todd verify we need this
                    CustomerLevel: this.options.BWCustomer.Level,
                    QuantityBreak: quantityBreak,
                    QuoteId: null,
                    UOM: uom,
                    UnitOfMeasureId: null
                }
                //debugger;
                var operationUri = '/pr_bundles';
                $.ajax({
                    type: "POST",
                    url: operationUri,
                    data: bundle,
                    error: function (xhr, status, error) {
                        debugger;
                        alert('Error in saveTheNewBundle(): ' + error.Message);

                    },
                    success: function (data) {
                        console.log('In saveTheNewBundle(). BundleId: ' + data.BundleId);

                        $('#divCreateBundleDialog').dialog('close');
                        thiz.renderBundlesInBundleDialog();
                        thiz.renderSelectedBundleForThisQuote2(); 

                    }
                });
            }

        } catch (e) {
            console.log('Exception in saveTheNewBundle(): ' + e.message + ', ' + e.stack);
            document.getElementById('bwDistributorBundling_Error').innerHTML = 'Exception in saveTheNewBundle(): ' + e.message + ', ' + e.stack;
        }
    },
    saveTheEditedBundle: function (element) {
        try {
            console.log('In saveTheEditedBundle().');
            var thiz = this;
            var bundleId = $('#divEditBundleDialog').find('#divEditBundleDialog_BundleId').val();
            var bundleDescription = $('#divEditBundleDialog').find('#divEditBundleDialog_txtBundleDescription').val();
            var quantityBreak = $('#divEditBundleDialog').find('#divEditBundleDialog_txtQuantityBreak').val();
            var uom = $('#divEditBundleDialog').find('#divEditBundleDialog_selectBundleUnitOfMeasure').val();

            var validationResult = this.validateTheBundlePriorToSaving(bundleDescription, quantityBreak, uom);
            if (validationResult != "") {

                document.getElementById('divAddedToBundle_Content').innerHTML = validationResult;
                $('#divAddedToBundle').dialog({
                    modal: true,
                    resizable: true,
                    closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                    dialogClass: "no-close", // No close button in the upper right corner.
                    hide: false, // This means when hiding just disappear with no effects.
                    height: 200,
                    width: 800,
                    open: function () {
                        try {
                            setTimeout(function () {
                                $('#divAddedToBundle').dialog('close');
                            }, 2000);
                        } catch (e) {
                            console.log('Exception in saveTheEditedBundle.open(): ' + e.message + ', ' + e.stack);
                        }
                    },
                    close: function () {
                        try {

                        } catch (e) {
                            console.log('Exception in saveTheEditedBundle.close(): ' + e.message + ', ' + e.stack);
                        }
                    }

                });
                $("#divAddedToBundle").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

            } else {
                var bundle = {
                    BundleId: Number(bundleId),
                    CustomerId: Number(this.options.BWCustomer.CustomerIdentifier), // todd verify we need this
                    BundleDescription: bundleDescription,
                    UOM: uom,
                    CustomerLevel: this.options.BWCustomer.Level,
                    CurrencyCode: this.options.BWCustomer.CurrencyCode,
                    QuantityBreak: Number(quantityBreak),
                    QuoteId: null,
                    UnitOfMeasureId: null
                }

                //public int BundleId { get; set; }
                //public int CustomerId { get; set; }
                //public Nullable < int > QuoteId { get; set; }
                //public string BundleDescription { get; set; }
                //public Nullable < int > QuantityBreak { get; set; }
                //public Nullable < int > UnitOfMeasureId { get; set; }
                //public string UOM { get; set; }
                //public string CustomerLevel { get; set; }
                //public string CurrencyCode { get; set; }

                var operationUri = '/pr_bundles';
                $.ajax({
                    type: "PUT",
                    url: operationUri,
                    data: bundle,
                    error: function (xhr, status, error) {
                        debugger;
                        alert('Error in saveTheEditedBundle(): ' + error.Message);
                    },
                    success: function (data) {
                        console.log('In saveTheEditedBundle().'); 

                        $('#divEditBundleDialog').dialog('close');
                        thiz.renderBundlesInBundleDialog();
                        thiz.renderSelectedBundleForThisQuote2(); 

                    }
                });
            }

        } catch (e) {
            console.log('Exception in saveTheEditedBundle(): ' + e.message + ', ' + e.stack);
            document.getElementById('bwDistributorBundling_Error').innerHTML = 'Exception in saveTheEditedBundle(): ' + e.message + ', ' + e.stack;
        }
    },
    validateTheBundlePriorToSaving: function (bundleDescription, quantityBreak, uom) {
        try {

            // No empty strings, make sure quantity break is a number above 0.
            var result = "";
            var numberValidationPattern = /^\d+$/;
            if (!bundleDescription || !quantityBreak || !uom) {
                result = 'Values are required for all fields.';
            } else if (!bundleDescription.length || (bundleDescription.length < 4)) {
                result = 'The "Bundle Description" has to be at least 3 characters long.';
            } else if (numberValidationPattern.test(quantityBreak) == false) {
                result = 'The "Quantity break" needs to be a number.';
            } 
            return result;

        } catch (e) {
            console.log('Exception in validateTheBundlePriorToSaving(): ' + e.message + ', ' + e.stack);
            alert('Exception in validateTheBundlePriorToSaving(): ' + e.message + ', ' + e.stack);
        }
    },
    deleteABundle: function (bundleId) {
        try {
            console.log('In deleteABundle().');
            var thiz = this;

            //debugger;
            //alert('In deleteABundle(). This functionality is incomplete. Coming soon!');
            var operationUri = '/pr_bundles?BundleId=' + bundleId;
            $.ajax({
                type: "DELETE",
                url: operationUri,
                error: function (xhr, status, error) {
                    debugger;
                    alert('Error in deleteABundle(): ' + error.Message);
                },
                success: function (data) {
                    try {
                        //debugger;
                        //if (data != 'SUCCESS') {
                        //    alert('Error in deleteABundle.delete.pr_bundles.success(): ' + data);
                        //} else {
                        console.log('In deleteABundle(). bundleId: ' + bundleId);
                        thiz.renderBundlesInBundleDialog();
                        //thiz.renderSelectedBundleForThisQuote2(); //thiz.options.selectedBundleDescription, thiz.options.selectedBreakQuantity, thiz.options.selectedUom)

                        //thiz.renderBundlesInBundleDialog(productId, bundleId, null); // Refresh the contents of the bundle dialog to reflect the deleted product.

                        //$('.bwAdvancedProductSearch').bwAdvancedProductSearch('reloadBundlesAndReRenderTheDialog'); // Refresh the contents of the "Advanced Search" dialog so that the Bundles column has the correct links in it.

                        document.getElementById('divAddedToBundle_Content').innerHTML = 'The bundle has been deleted.';
                        $('#divAddedToBundle').dialog({
                            modal: true,
                            resizable: true,
                            closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                            dialogClass: "no-close", // No close button in the upper right corner.
                            hide: false, // This means when hiding just disappear with no effects.
                            height: 200,
                            width: 800,
                            open: function () {
                                try {
                                    setTimeout(function () {
                                        $('#divAddedToBundle').dialog('close');
                                    }, 2000);
                                } catch (e) {
                                    console.log('Exception in deleteABundle.open(): ' + e.message + ', ' + e.stack);
                                }
                            },
                            close: function () {
                                try {

                                } catch (e) {
                                    console.log('Exception in deleteABundle.close(): ' + e.message + ', ' + e.stack);
                                }
                            }

                        });
                        $("#divAddedToBundle").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
                        //$("#divAddedToBundle").closest(".ui-dialog").children(".ui-dialog-titlebar").css("background", "lightblue"); // This sets the color of the title bar.
                        //}

                    } catch (e) {
                        console.log('Exception in deleteABundle./pr_bundleitems.success(): ' + e.message + ', ' + e.stack);
                        alert('Exception in deleteABundle./pr_bundleitems.success(): ' + e.message + ', ' + e.stack);
                    }
                }
            });

        } catch (e) {
            console.log('Exception in deleteABundle(): ' + e.message + ', ' + e.stack);
            document.getElementById('bwDistributorBundling_Error').innerHTML = 'Exception in deleteABundle(): ' + e.message + ', ' + e.stack;
        }
    },

    

    selectDistributorQuoteBundle1_OnChange: function (productSegment) {
        try {
            var selectedValue = document.getElementById('selectDistributorQuoteBundle1').value;
            console.log('In selectDistributorQuoteBundle1_OnChange(). selectedValue: ' + selectedValue);
            if (selectedValue == 'CreateANewBundle') {
                alert('In selectDistributorQuoteBundle1_OnChange(). <<<<<<<<<<<<<< display MODAL DIALOG!!!!!!!!!!!!!');


                // divAddOrCreateBundleDialog








            } else {
                alert('In selectDistributorQuoteBundle1_OnChange(). selectedValue: ' + selectedValue);
            }

        } catch (e) {
            console.log('Exception in selectDistributorQuoteBundle1_OnChange(): ' + e.message + ', ' + e.stack);
            document.getElementById('bwDistributorBundling_Error').innerHTML = 'Exception in selectDistributorQuoteBundle1_OnChange(): ' + e.message + ', ' + e.stack;
        }
    }

});