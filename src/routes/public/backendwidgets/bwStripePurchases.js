$.widget("bw.bwStripePurchases", {
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
        This is the bwStripePurchases.js jQuery Widget. 
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

        requestTypes: null,

        autoSenseDeviceType: false // Automatic UI based on device type. Alpha version so far.
    },
    _create: function (assignmentRowChanged_ElementId) {
        this.element.addClass("bwStripePurchases");
        var thiz = this; // Need this because of the asynchronous operations below.
  
        try {
            
            selfDiscoverOperationUri(thiz); // This sets this.options.operationUriPrefix correctly.

            // 
            // Load this object first so we don't have to keep making web service calls.
            //
            if (this.options.requestTypes != null) {
                this.renderRequestTypeEditor();
            } else {
                $.ajax({
                    url: this.options.operationUriPrefix + '_bw/Admin/StripePurchases', 
                    dataType: "json",
                    contentType: "application/json",
                    type: "Get"
                }).success(function (results) {
                    try {

                        if (results.status != 'SUCCESS') {
                            var html = '';
                            html += '<span style="font-size:24pt;color:red;">bwStripePurchases: CANNOT RENDER</span>';
                            html += '<br />';
                            html += '<span style="">Error in bwStripePurchases.Create(): ' + results.message + '</span>';
                            thiz.element.html(html);
                        } else {
                           
                            //displayAlertDialog('xcx12342343. ' + JSON.stringify(results.results));
                            thiz.options.requestTypes = results.results;
                            thiz.renderStripeTransactionEditor();

                        }
                    } catch (e) {
                        console.log('Exception in bwStripePurchases._create().xx.Get:1: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwStripePurchases._create().xx.Get:1: ' + e.message + ', ' + e.stack);
                    }

                }).error(function (data) {
                   
                    console.log('In bwStripePurchases._create.RequestTypes.fail(): ' + JSON.stringify(data));
                    var msg;
                    if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                        msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                    } else {
                        msg = JSON.stringify(data);
                    }
                    alert('Exception in bwStripePurchases._create().xx.Get:2: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                    console.log('Exception in bwStripePurchases._create().xx.Get:2: ' + JSON.stringify(data));
                 
                });
            }
        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">bwStripePurchases: CANNOT RENDER</span>';
            html += '<br />';
            html += '<span style="">Exception in bwStripePurchases.Create(): ' + e.message + ', ' + e.stack + '</span>';
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

    renderStripeTransactionEditor: function () {
        try {
            console.log('In renderStripeTransactionEditor().');
            var thiz = this;
            var html = '';

            //var tenantId = $('.bwAuthentication').bwAuthentication('option', 'tenantId');
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
            html += '       <span style="font-size:small;font-style:italic;">Stripe purchases:</span>';
            html += '    </td>';

            html += '    <td>';
            html += '       <span style="font_weight:bold;color:grey;">';
            html += '           payment_status:&nbsp;';
            html += '           <input type="radio" id="selectBwStripePurchases_PaymentStatus_Other" name="selectBwStripePurchases_PaymentStatus" checked="" onchange="$(\'.bwStripePurchases\').bwStripePurchases(\'selectPaymentStatus_Onchange\');">';
            html += '           &nbsp;other&nbsp;&nbsp;   ';
            html += '           <input type="radio" id="selectBwStripePurchases_PaymentStatus_Unpaid" name="selectBwStripePurchases_PaymentStatus" onchange="$(\'.bwStripePurchases\').bwStripePurchases(\'selectPaymentStatus_Onchange\');">';
            html += '           &nbsp;unpaid';
            html += '       </span> ';
            html += '    </td>';



            html += '</tr>';
            html += '</table>';
            html += '<table>';
            html += '  <tr>';
            html += '    <td style="text-align:left;vertical-align:top;" class="bwSliderTitleCell">';
            html += '       Stripe Purchases. Newest is at the top:&nbsp;';
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

            //Stripe_Purchase_Webservice
            //Stripe_Purchase_GUID
            //Stripe_Purchse_Timestamp
            //Stripe_Purchase_Response_JSON

            html += '<div id="bwStripePurchases_DataGrid"></div>';

            //html += '<br />';
            //html += '<input style="padding:5px 10px 5px 10px;" id="btnCreateRole2" onclick="$(\'.bwStripePurchases\').bwStripePurchases(\'addARequestType\');" type="button" value="Add a Request type...">';

            // Render the html. THIS WAY IS PREFERABLE COME BACK AND FIX SOMETIME
            thiz.element.html(html);

            this.populateStripeTransactions();

        } catch (e) {
            console.log('Exception in renderStripeTransactionEditor(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in renderStripeTransactionEditor(): ' + e.message + ', ' + e.stack);
        }
    },
    populateStripeTransactions: function() {
        try {
            console.log('In bwStripePurchases.js.populateStripeTransactions().');

            var displayUnpaid;
            if (document.getElementById('selectBwStripePurchases_PaymentStatus_Other').checked == true) {
                displayUnpaid = false;
            } else if (document.getElementById('selectBwStripePurchases_PaymentStatus_Unpaid').checked == true) {
                displayUnpaid = true;
            } 

            var html = '';

            html += '<table class="dataGridTable">';
            html += '  <tr class="headerRow">';
            html += '    <td>Stripe_Purchase_Webservice</td>';
            html += '    <td>Stripe_Purchase_GUID</td>';
            html += '    <td>Stripe_Purchase_Timestamp</td>';
            html += '    <td>Stripe_Purchase_Response_JSON</td>';
            //html += '    <td>xcx12345</td>';
            html += '    <td></td>';
            html += '    <td></td>';
            html += '  </tr>';

            var alternatingRow = 'light'; // Use this to color the rows.

            if (!this.options.requestTypes) {
                html += '  <tr class="alternatingRowLight" style="cursor:pointer;">';
                html += '   <td colspan="5"><span style="color:tomato;">No data. Is the webservice responding correctly?</span></td>';
                html += '  </tr>';
            } else if (this.options.requestTypes.length == 0) {
                html += '  <tr class="alternatingRowLight" style="cursor:pointer;">';
                html += '   <td colspan="4"><span style="color:tomato;">No stripe purchases exist in the database.</span></td>';
                html += '  </tr>';
            } else {
                for (var i = 0; i < this.options.requestTypes.length; i++) {

                    var json = JSON.parse(this.options.requestTypes[i].Stripe_Purchase_Response_JSON);
                    var payment_status = json.payment_status; // 'unpaid'

                    if ((payment_status == 'unpaid') && (displayUnpaid == false)) {

                        // Don't display.

                    } else {

                        if (alternatingRow == 'light') {
                            html += '  <tr class="alternatingRowLight" style="cursor:pointer;">';
                            alternatingRow = 'dark';
                        } else {
                            html += '  <tr class="alternatingRowDark" style="cursor:pointer;">';
                            alternatingRow = 'light';
                        }
                        html += '    <td>' + this.options.requestTypes[i].Stripe_Purchase_Webservice + '</td>';
                        html += '    <td>' + this.options.requestTypes[i].Stripe_Purchase_GUID + '</td>';
                        html += '    <td>' + this.options.requestTypes[i].Stripe_Purchase_Timestamp + '</td>';
                        html += '    <td>' + this.options.requestTypes[i].Stripe_Purchase_Response_JSON + '</td>';

                        html += '    <td><button class="BwSmallButton" onclick="$(\'.bwStripePurchases\').bwStripePurchases(\'editARequestTypexx\', \'' + this.options.requestTypes[i].bwRequestTypeId + '\', \'' + this.options.requestTypes[i].RequestType + '\', \'' + this.options.requestTypes[i].Abbreviation + '\', \'' + this.options.requestTypes[i].SingletonName + '\', \'' + this.options.requestTypes[i].PluralName + '\');">edit</button></td>';
                        html += '    <td><img src="images/trash-can.png" onclick="$(\'.bwStripePurchases\').bwStripePurchases(\'deleteAStripeTransaction\', \'' + this.options.requestTypes[i].bwWorkflowAppLicenseId + '\', \'' + this.options.requestTypes[i].Stripe_Purchase_GUID + '\');" title="Delete" style="cursor:pointer;" /></td>';
                        html += '  </tr>';

                    }

                }
            }
            html += '</table>';

            $('#bwStripePurchases_DataGrid').html(html);

        } catch (e) {
            console.log('Exception in bwStripePurchases.js.populateStripeTransactions(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwStripePurchases.js.populateStripeTransactions(): ' + e.message + ', ' + e.stack);
        }
    },
    selectPaymentStatus_Onchange: function() {
        try {
            console.log('In selectPaymentStatus_Onchange().');

            this.populateStripeTransactions();

        } catch (e) {
            console.log('Exception in selectPaymentStatus_Onchange(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in selectPaymentStatus_Onchange(): ' + e.message + ', ' + e.stack);
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
                    console.log('In bwStripePurchases.js.addARequestType.divManageRequestTypeDialogSubmitButton.click(). xcx246-2');

                    var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

                    var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
                    var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
                    var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

                    var SingletonName = $('#divManageRequestTypeDialog').find('#txtManageRequestTypeDialog_SingletonName').val().trim();
                    var PluralName = $('#divManageRequestTypeDialog').find('#txtManageRequestTypeDialog_PluralName').val().trim();
                    var abbreviation = $('#divManageRequestTypeDialog').find('#txtManageRequestTypeDialog_Abbreviation').val().trim();

                    if (SingletonName.length > 4 && PluralName.length > 4 && abbreviation.length > 1) {
                        // Save the new project type entry.
                        var bwRequestTypeId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                            return v.toString(16);
                        });
                        var requestTypeJson = {
                            //bwTenantId: tenantId,
                            bwWorkflowAppId: workflowAppId,
                            bwParticipantId: participantId,
                            bwParticipantFriendlyName: participantFriendlyName,
                            bwParticipantEmail: participantEmail,
                            bwRequestTypeId: bwRequestTypeId,
                            Abbreviation: abbreviation,
                            //RequestType: requestType,
                            isActive: true,
                            SingletonName: SingletonName,
                            PluralName: PluralName
                        };

                        //debugger;
                        // WE NEED TO SAVE THE NEW PROJECT TYPE TO THE DATABASE HERE!!!!!!!!!!!!!!
                        $.ajax({
                            url: thiz.options.operationUriPrefix + "_bw/Admin/SaveRequestType_NewTenant",
                            type: "Post",
                            timeout: thiz.options.ajaxTimeout,
                            data: requestTypeJson,
                            headers: {
                                "Accept": "application/json; odata=verbose"
                            }
                        }).success(function (result) {
                            try {
                                if (result.message != 'SUCCESS') {
                                    thiz.displayAlertDialog('ERROR: ' + result.message);
                                } else {
                                    thiz.options.requestTypes.push(requestTypeJson); // This updates the widget data.
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
                                msg = JSON.stringify(data) + ', requestTypeJson: ' + JSON.stringify(requestTypeJson);
                            }
                            console.log('Fail in addARequestType.SaveRequestType: ' + JSON.stringify(data) + ', requestTypeJson: ' + JSON.stringify(requestTypeJson));
                            alert('Fail in addARequestType.SaveRequestType: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                            //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                            //var error = JSON.parse(data.responseText)["odata.error"];
                            //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
                        });
                    } else {
                        alert('Please enter names (5 characters or more) and an abbreviation (2 characters or more).');
                    }
                } catch (e) {
                    console.log('Exception in addARequestType.click(): ' + e.message + ', ' + e.stack);
                }
            });

        } catch (e) {
            console.log('Exception in addARequestType(): ' + e.message + ', ' + e.stack);
        }
    },
    editARequestType: function (bwRequestTypeId, RequestType, Abbreviation, SingletonName, PluralName) {
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

                    //var requestType = $('#divManageRequestTypeDialog').find('#txtManageRequestTypeDialog_Name').val().trim();

                    var SingletonName = $('#divManageRequestTypeDialog').find('#txtManageRequestTypeDialog_SingletonName').val().trim(); // 12-31-2021
                    var PluralName = $('#divManageRequestTypeDialog').find('#txtManageRequestTypeDialog_PluralName').val().trim(); // 12-31-2021

                    var abbreviation = $('#divManageRequestTypeDialog').find('#txtManageRequestTypeDialog_Abbreviation').val().trim();
                    var bwRequestTypeId = $('#divManageRequestTypeDialog').find('#txtManageRequestTypeDialog_Id').val().trim();
                    if (SingletonName.length > 4 && PluralName.length > 4 && abbreviation.length > 1) {
                        // Save the project type entry.
                        var requestTypeJson = {
                            //bwTenantId: tenantId,
                            bwWorkflowAppId: workflowAppId,
                            bwParticipantId: participantId,
                            bwParticipantFriendlyName: participantFriendlyName,
                            bwParticipantEmail: participantEmail,
                            bwRequestTypeId: bwRequestTypeId,
                            Abbreviation: abbreviation,
                            //RequestType: requestType,

                            SingletonName: SingletonName,
                            PluralName: PluralName,

                            isActive: true
                        };

                        //debugger;
                        //alert('thiz.options.operationUriPrefix: ' + thiz.options.operationUriPrefix);
                        // WE NEED TO SAVE THE NEW PROJECT TYPE TO THE DATABASE HERE!!!!!!!!!!!!!!
                        $.ajax({
                            url: thiz.options.operationUriPrefix + "_bw/Admin/EditRequestType_NewTenant", //SaveRequestType",
                            type: "Post",
                            //timeout: thiz.options.ajaxTimeout,
                            data: requestTypeJson,
                            headers: {
                                "Accept": "application/json; odata=verbose"
                            }
                        }).success(function (result) {
                            try {
                                //debugger;
                                if (result.message != 'SUCCESS') {
                                    thiz.displayAlertDialog('ERROR: ' + result.message);
                                } else {

                                    thiz.displayAlertDialog('Saved: ' + JSON.stringify(result.mod));

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
                                    thiz.options.requestTypes = result.data;

                                    $("#divManageRequestTypeDialog").dialog('close');
                                    thiz.renderRequestTypeEditor();
                                }
                            } catch (e) {
                                console.log('Exception in editARequestType.SaveRequestType: ' + e.message + ', ' + e.stack);
                                alert('Exception in editARequestType.SaveRequestType: ' + e.message + ', ' + e.stack);
                            }
                        }).error(function (data, errorCode, errorMessage) {
                            //thiz.hideProgress();
                            var msg;
                            if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                                msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                            } else {
                                msg = JSON.stringify(data) + ', requestTypeJson: ' + JSON.stringify(requestTypeJson);
                            }
                            console.log('Fail in editARequestType.SaveRequestType: ' + JSON.stringify(data) + ', requestTypeJson: ' + JSON.stringify(requestTypeJson));
                            alert('Fail in editARequestType.SaveRequestType: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                            //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                            //var error = JSON.parse(data.responseText)["odata.error"];
                            //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
                        });
                    } else {
                        alert('Please enter names (5 characters or more) and an abbreviation (2 characters or more).');
                    }
                } catch (e) {
                    console.log('Exception in editARequestType.click(): ' + e.message + ', ' + e.stack);
                }
            });

        } catch (e) {
            console.log('Exception in editARequestType(): ' + e.message + ', ' + e.stack);
        }
    },
    deleteAStripeTransaction: function (bwWorkflowAppLicenseId, Stripe_Purchase_GUID) {
        try {
            console.log('In bwStripePurchases.js.deleteAStripeTransaction(). This functionality is incomplete. Coming soon. Stripe_Purchase_GUID: ' + Stripe_Purchase_GUID + ', bwWorkflowAppLicenseId: ' + bwWorkflowAppLicenseId);
            alert('In bwStripePurchases.js.deleteAStripeTransaction(). This functionality is incomplete. Coming soon. Stripe_Purchase_GUID: ' + Stripe_Purchase_GUID + ', bwWorkflowAppLicenseId: ' + bwWorkflowAppLicenseId);
            //var thiz = this;
            //$('#divManageRequestTypeDialog').find('#spanAddAnOrgItemDialogTitle')[0].innerHTML = 'Delete this Request Type';
            //$('#divManageRequestTypeDialog').find('#divManageRequestTypeDialogSubmitButton')[0].innerHTML = 'Delete the Request Type';

            ////$('#divManageRequestTypeDialog').find('#txtManageRequestTypeDialog_Name')[0].value = RequestType;
            //$('#divManageRequestTypeDialog').find('#txtManageRequestTypeDialog_SingletonName')[0].value = SingletonName;
            //$('#divManageRequestTypeDialog').find('#txtManageRequestTypeDialog_PluralName')[0].value = PluralName;

            //$('#divManageRequestTypeDialog').find('#txtManageRequestTypeDialog_Abbreviation')[0].value = Abbreviation;
            //$('#divManageRequestTypeDialog').find('#txtManageRequestTypeDialog_Id')[0].value = bwRequestTypeId;

            ////
            //// ToDo: Add the click event to this Save button!
            ////
            //$("#divManageRequestTypeDialog").dialog({
            //    modal: true,
            //    resizable: false,
            //    closeOnEscape: false, // Hit the ESC key to hide! Yeah!
            //    width: '500',
            //    dialogClass: "no-close", // No close button in the upper right corner.
            //    hide: false, // This means when hiding just disappear with no effects.
            //    open: function () {
            //        $('.ui-widget-overlay').bind('click', function () {
            //            $("#divManageRequestTypeDialog").dialog('close');
            //        });
            //    },
            //    close: function () {
            //        $('#divManageRequestTypeDialog').dialog('destroy');
            //    }
            //});
            ////$("#divManageRequestTypeDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

            //$('#divManageRequestTypeDialogSubmitButton').off('click').click(function (error) {
            //    try {
            //        console.log('In deleteARequestType.divManageRequestTypeDialogSubmitButton.click().');

            //        var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            //        var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
            //        var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

            //        var bwRequestTypeId = $('#divManageRequestTypeDialog').find('#txtManageRequestTypeDialog_Id').val().trim();

            //        // Save the project type entry.
            //        var requestTypeJson = {
            //            bwParticipantId: participantId,
            //            bwParticipantFriendlyName: participantFriendlyName,
            //            bwParticipantEmail: participantEmail,
            //            bwRequestTypeId: bwRequestTypeId
            //        };

            //        //debugger;
            //        //alert('thiz.options.operationUriPrefix: ' + thiz.options.operationUriPrefix);
            //        // WE NEED TO SAVE THE NEW PROJECT TYPE TO THE DATABASE HERE!!!!!!!!!!!!!!
            //        $.ajax({
            //            url: thiz.options.operationUriPrefix + "_bw/Admin/DeleteRequestType_NewTenant",
            //            type: "Post",
            //            //timeout: thiz.options.ajaxTimeout,
            //            data: requestTypeJson,
            //            headers: {
            //                "Accept": "application/json; odata=verbose"
            //            }
            //        }).success(function (result) {
            //            try {
            //                //debugger;
            //                if (result.message != 'SUCCESS') {
            //                    thiz.displayAlertDialog('ERROR: ' + result.message);
            //                } else {

            //                    thiz.displayAlertDialog('Deleted: ' + JSON.stringify(result.mod));

            //                    // This updates the widget data.
            //                    //for (var i = 0; i < thiz.options.requestTypes.length; i++) {
            //                    //    if (thiz.options.requestTypes[i].bwRequestTypeId == bwRequestTypeId) {
            //                    //        thiz.options.requestTypes[i].Abbreviation = abbreviation;
            //                    //        thiz.options.requestTypes[i].RequestType = requestType;

            //                    //        thiz.options.requestTypes[i].SingletonName = SingletonName;
            //                    //        thiz.options.requestTypes[i].PluralName = PluralName;
            //                    //        break;
            //                    //    }
            //                    //}
            //                    thiz.options.requestTypes = result.data;

            //                    $("#divManageRequestTypeDialog").dialog('close');
            //                    thiz.renderRequestTypeEditor();
            //                }
            //            } catch (e) {
            //                console.log('Exception in editARequestType.deleteARequestType: ' + e.message + ', ' + e.stack);
            //                alert('Exception in editARequestType.deleteARequestType: ' + e.message + ', ' + e.stack);
            //            }
            //        }).error(function (data, errorCode, errorMessage) {
            //            //thiz.hideProgress();
            //            var msg;
            //            if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
            //                msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
            //            } else {
            //                msg = JSON.stringify(data) + ', requestTypeJson: ' + JSON.stringify(requestTypeJson);
            //            }
            //            console.log('Fail in deleteARequestType: ' + JSON.stringify(data) + ', requestTypeJson: ' + JSON.stringify(requestTypeJson));
            //            alert('Fail in deleteARequestType: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
            //            //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
            //            //var error = JSON.parse(data.responseText)["odata.error"];
            //            //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
            //        });

            //    } catch (e) {
            //        console.log('Exception in deleteARequestType.click(): ' + e.message + ', ' + e.stack);
            //    }
            //});

        } catch (e) {
            console.log('Exception in bwStripePurchases.js.deleteAStripeTransaction(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwStripePurchases.js.deleteAStripeTransaction(): ' + e.message + ', ' + e.stack);
        }
    }

   


});