$.widget("bw.bwFormsEditor_NewTenant", {
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
        This is the bwFormsEditor_NewTenant.js jQuery Widget. 
        ===========================================================

            [more to follow]
                          
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

            [put your stuff here]

        ===========================================================
       
        */

        BackendGlobalOfflineFormsEditing: null, // When this is set to true, it will be used to edit the global offline forms.
        BackendGlobalNewTenantFormsEditing: null, // When this is set to true, it will be used to edit the global new tenant forms.

        DisplayAsNewTenantUserConfigurationEditor: null,

        store: null,
        bwTenantId: null,
        bwWorkflowAppId: null,

        operationUriPrefix: null,
        ajaxTimeout: 15000,

        CurrentForm: {
            Form: null,
            DraftForm: null
        },
        ActiveForms: null, // THIS IS WHERE THE FORM (with HTML) IS STORED WHEN THE WIDGET IS INSTANTIATED! THIS COMES FROM THE BwForm TABLE.<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<


        autoSenseDeviceType: false // Automatic UI based on device type. Alpha version so far.
    },
    _create: function (checklistIndex) {
        this.element.addClass("bwFormsEditor_NewTenant");
        var thiz = this; // Need this because of the asynchronous operations below.
        try {
            if (this.options.operationUriPrefix == null) {
                // This formulates the operationUri, which is used throughout.
                var url1 = window.location.href.split('https://')[1];
                var url2 = url1.split('/')[0];
                this.options.operationUriPrefix = 'https://' + url2 + '/';
            }
            //if (this.options.DisplayAsNewTenantUserConfigurationEditor == true) {
            //
            // This is when it is displayed on the administration pages.
            //

            debugger;
            // First load the NewTenantSettings from the database.
            $.ajax({
                url: thiz.options.operationUriPrefix + "_bw/NewTenantFormsSettings",
                dataType: "json",
                contentType: "application/json",
                type: "Get"//,
                //timeout: thiz.options.ajaxTimeout
            }).done(function (result) {
                try {
                    if (result.message != 'SUCCESS') {
                        alert('ERROR: ' + result.message);
                    } else {
                        debugger; // GET THIS CODE WORKING FOR FORMS<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

                        // This code just cleans up garbage. Get rid of it someday when things harden up. just making sure they all have a bwFormId.
                        thiz.options.ActiveForms = [];
                        for (var i = 0; i < result.value.length; i++) {
                            if (result.value[i].bwFormId) {
                                thiz.options.ActiveForms.push(result.value[i]);
                            }
                        }

                        //thiz.options.ActiveForms = result.value;

                        var promise = thiz.getRequestFormHtml('divFormsEditor'); //'xcxFormsEditorElementId');
                        //var promise = thiz.getRequestFormHtml('divFormsEditor');
                        promise.then(function (html) {
                            try {
                                debugger;
                                thiz.options.CurrentForm.Form = html;
                                thiz.options.CurrentForm.DraftForm = html;

                                thiz.renderFormsEditor(); // Render the forms editor.



                            } catch (e) {
                                console.log('Exception in bwFormsEditor_NewTenant._create().NewTenantFormsSettings.done():2: ' + e.message + ', ' + e.stack);
                            }
                        });

                    }
                } catch (e) {
                    //lpSpinner.Hide();
                    console.log('Exception in bwFormsEditor_NewTenant._create().Get.NewTenantFormsSettings.done():1: ' + e.message + ', ' + e.stack);
                }
            }).fail(function (data) {
                //lpSpinner.Hide();
                //debugger;
                //console.log('In xx.fail(): ' + JSON.stringify(data));
                var msg;
                if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                    msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                } else {
                    msg = JSON.stringify(data);
                }
                alert('Error in bwFormsEditor_NewTenant._create().Get.NewTenantFormsSettings.fail(): ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                console.log('Error in bwFormsEditor_NewTenant._create().Get.NewTenantFormsSettings.fail ' + JSON.stringify(data));
                //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                //var error = JSON.parse(data.responseText)["odata.error"];
                //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
            });
            //} else {
            //    // LOAD this.options.ActiveForms HERE!!!!!!!!!! 5-11-2020.
            //    $.ajax({
            //        url: this.options.operationUriPrefix + "odata/FormsConfiguration2/" + thiz.options.bwTenantId + '/' + thiz.options.bwWorkflowAppId + '/' + 'all', //thiz.options.LastSelectedRequestType, //'budgetrequest', //
            //        dataType: "json",
            //        contentType: "application/json",
            //        type: "Get",
            //        timeout: thiz.options.ajaxTimeout
            //    }).done(function (result) {
            //        try {

            //            debugger;
            //            if (result.message != 'SUCCESS') {
            //                alert('ERROR in bwFormsEditor_NewTenant._create(): ' + result.message);
            //            } else {
            //                //debugger; // Get these forms and put in the new user db tables.
            //                thiz.options.ActiveForms = result.value;

            //                //if (this.options.CurrentForm.Form != null && this.options.CurrentForm.DraftForm != null) {
            //                //    thiz.renderFormsEditor(); // Render the forms editor.
            //                //} else {
            //                //debugger;
            //                var promise = thiz.getRequestFormHtml('divFormsEditor'); //'xcxFormsEditorElementId');
            //                //var promise = thiz.getRequestFormHtml('divFormsEditor');
            //                promise.then(function (html) {
            //                    try {
            //                        debugger;
            //                        thiz.options.CurrentForm.Form = html;
            //                        thiz.options.CurrentForm.DraftForm = html;

            //                        thiz.renderFormsEditor(); // Render the forms editor.



            //                    } catch (e) {
            //                        console.log('Exception in bwWorkflowEditor._create().loadWorkflowsAndCurrentWorkflow(): ' + e.message + ', ' + e.stack);
            //                    }
            //                });
            //                //}

            //            }
            //        } catch (e) {
            //            console.log('Exception in bwFormsEditor_NewTenant._create().done: ' + e.message + ', ' + e.stack);
            //            alert('Exception in bwFormsEditor_NewTenant._create().done: ' + e.message + ', ' + e.stack);
            //        }
            //    }).fail(function (data, errorCode) {

            //        //lpSpinner.Hide();
            //        console.log(' : ' + JSON.stringify(data));
            //        var msg;
            //        if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
            //            msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
            //        } else {
            //            msg = JSON.stringify(data);
            //        }
            //        alert('Exception in bwFormsEditor_NewTenant._create().xx.Get: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
            //        console.log('Exception in bwFormsEditor_NewTenant._create().xx.Get: ' + JSON.stringify(data));
            //        //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
            //        //var error = JSON.parse(data.responseText)["odata.error"];
            //        //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
            //    });
            //}
        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">xxxcx1234: CANNOT RENDER THE ??</span>';
            html += '<br />';
            html += '<span style="">Exception in _create(): ' + e.message + ', ' + e.stack + '</span>';
            this.element.html(html);
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
            .removeClass("bwFormsEditor_NewTenant")
            .text("");
    },

    toggleFormRequiredField: function (element) {
        try {
            console.log('In toggleFormRequiredField().');
            if ($(element).hasClass('ToggleRequiredAsterisk')) {
                $(element).removeClass('ToggleRequiredAsterisk');
                $(element).addClass('ToggleRequiredAsterisk-On');
            } else if ($(element).hasClass('ToggleRequiredAsterisk-On')) {
                $(element).removeClass('ToggleRequiredAsterisk-On');
                $(element).addClass('ToggleRequiredAsterisk-Off');
            } else if ($(element).hasClass('ToggleRequiredAsterisk-Off')) {
                $(element).removeClass('ToggleRequiredAsterisk-Off');
                $(element).addClass('ToggleRequiredAsterisk-On');
            }
            this.options.CurrentForm.DraftForm = $(this.element).find('#budgetrequestform')[0].innerHTML;
            this.checkIfWeHaveToDisplayThePublishChangesButton();
        } catch (e) {
            console.log('Exception in toggleFormRequiredField(): ' + e.message + ', ' + e.stack);
        }
    },

    setZoom: function (originalZoom, elementId) {
        try {
            console.log('In setZoom(' + originalZoom + ', ' + elementId + ')');
            var thiz = this;
            if (originalZoom > 20) { // Don't make any smaller than this!
                var zoom = originalZoom / 100;
                //elementId = elementId.replace('_Parent', '');
                //elementId += '_Parent'; // This just makes sure it is here! :)
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


                //this.pinRequestDialog(); // Gets rid of the clickable greyed out background... Makes the dialog not-modal.

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
    renderFormsEditor: function (checklistIndex) {
        try {
            console.log('In renderFormsEditor().');
            //alert('In renderFormsEditor().');
            var thiz = this;
            var html = '';

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            //html += '<style>';
            //html += '.ToggleAsterisk {';
            //html += '   font-size:20pt;';
            //html += '   color:green;';
            //html += '}';
            //html += '.ToggleAsterisk:hover {';
            //html += '   font-size:50pt;';
            //html += '   color:red;';
            //html += '}';
            //html += '</style>';



            html += '<div style="display:none;" id="divFormsConfigurationDialog" class="context-menu-formsconfiguration">';
            html += '  <table style="width:100%;">';
            html += '    <tr>';
            html += '      <td style="width:90%;">';
            html += '        <span id="spanFormsMaintenanceDialogTitle" style="color:#3f3f3f;font-size:30pt;font-weight:bold;">Forms Configuration</span>';
            html += '      </td>';
            html += '      <td style="width:9%;"></td>';
            html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#divFormsConfigurationDialog\').dialog(\'close\');">X</span>';
            html += '      </td>';
            html += '    </tr>';
            html += '  </table>';
            html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
            html += '  <span id="spaFormsMaintenanceDialogDescriptionText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 20pt;">';
            html += 'Configure active forms for: ';
            html += '  </span>';
            html += '<select id="selectFormsRequestTypeDropDownInDialog2" style=\'border-color: whitesmoke; color: grey; font-family: "Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif; font-size: 14pt; font-weight: bold; cursor: pointer;\' onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'WorkflowRequestTypeDropDownInDialog_Onchange\', \'selectFormsRequestTypeDropDownInDialog2\');" "=""><option value="all" selected="">All request types</option><option value="budgetrequest">Budget Requests</option><option value="capitalplanproject">Capital Plan Projects</option><option value="quoterequest">Quote Requests</option><option value="expenserequest">Reimbursement Requests</option><option value="recurringexpense">Recurring Expenses</option><option value="workorder">Work Orders</option>   </select>';
            html += '  <br />';

            //html += '  <br />';
            //html += '  <button onclick="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'jsonMaintenance\');" style="">JSON MAINTENANCE - edit json and re-upload</button>'; // Clean up the json.
            //html += '  <br />';

            html += '  <span id="spanFormsMaintenanceDialogWorkflowActivationSection" style="white-space:nowrap;"></span>';
            html += '  <span id="spanFormsMaintenanceDialogContent"></span>';
            html += '</div>';

            html += '<div style="display:none;" id="divMessageDialog">';
            html += '  <table style="width:100%;">';
            html += '    <tr>';
            html += '      <td style="width:90%;">';
            html += '        <span id="spanMessageDialogTitle" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">[spanMessageDialogTitle]</span>';
            html += '      </td>';
            html += '      <td style="width:9%;"></td>';
            html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#divMessageDialog\').dialog(\'close\');">X</span>';
            html += '      </td>';
            html += '    </tr>';
            html += '  </table>';
            html += '  <br /><br />';
            html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
            html += '  <span id="spanMessageDialogContentTop" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 20pt;">[spanMessageDialogContentTop]</span>';
            html += '    <br />';
            html += '    <br />';
            html += '    <br />';
            html += '    <span id="spanMessageDialogContentBottom" style="font-weight:bold;cursor:pointer;">';
            html += '      [spanMessageDialogContentBottom]';
            html += '    </span>';
            html += '  <br /><br />';
            html += '</div>';

            html += '<div style="display:none;" id="divActivateSelectedFormDialog">';
            html += '        <!--DEV: The replace function is not doing the Manager for a Budget Request yet!!!-->';
            html += '        <table style="width:100%;">';
            html += '            <tr>';
            html += '                <td style="width:90%;">';
            html += '                    <span id="spanActivateSelectedFormDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;font-weight:bold;">Activate this form.</span>';
            html += '                </td>';
            html += '                <td style="width:9%;"></td>';
            html += '                <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '                    <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 30pt;font-weight:bold;" onclick="$(\'#divActivateSelectedFormDialog\').dialog(\'close\');">X</span>';
            html += '                </td>';
            html += '            </tr>';
            html += '        </table>';
            html += '        <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
            html += '        <br />';
            html += '        <span id="spanDeleteAFormDialogContentSection">';
            html += 'Activate as this request type:';
            html += '        </span>';
            html += '<select id="selectFormRequestTypeDropDownInActivateSelectedFormDialog" disabled onchange="alert(\'The ability to deploy to different request types is not complete. Coming soon!\');" style=\'border-color: whitesmoke; color: grey; font-family: "Segoe UI Light","Segoe UI","Segoe",Tahoma,Helvetica,Arial,sans-serif; font-size: 14pt; font-weight: bold; cursor: pointer;\'><option value="all" selected="">All request types</option><option value="budgetrequest" selected="">Budget Requests</option><option value="capitalplanproject">Capital Plan Projects</option><option value="quoterequest">Quote Requests</option><option value="expenserequest">Reimbursement Requests</option><option value="recurringexpense">Recurring Expenses</option><option value="workorder">Work Orders</option>   </select>';
            html += '        <br /><br />';
            html += '            <span id="spanActivateSelectedFormButton">[spanActivateSelectedFormButton]</span>';
            html += '        <br /><br />';
            html += '        <div class="divSignInButton" style="width:90%;text-align:center;line-height:0.8em;font-weight:bold;" onclick="$(\'#divActivateSelectedFormDialog\').dialog(\'close\');">';
            html += '            Close';
            html += '        </div>';
            html += '        <br /><br />';
            html += '    </div>';

            html += '<div style="display:none;" id="divUndoFormActivationDialog">';
            html += '  <table style="width:100%;">';
            html += '    <tr>';
            html += '      <td style="width:90%;">';
            html += '        <span id="spanUndoFormActivationTitle" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">Form PUBLISHED</span>';
            html += '      </td>';
            html += '      <td style="width:9%;"></td>';
            html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#divUndoFormActivationDialog\').dialog(\'close\');">X</span>';
            html += '      </td>';
            html += '    </tr>';
            html += '  </table>';
            html += '  <br /><br />';
            html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
            html += '  <span id="spanUndoFormActivationContent" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:20pt;">';
            html += '    This form has been activated and will immediately appear everywhere.'; // Please keep an eye on potential issues related to your change(s). ';
            html += '    <br />';
            html += '    <br />';
            //html += '    <br />';
            //html += '    <span style="font-weight:bold;cursor:pointer;">';
            //html += '      You can change the "Active Form" using the configuration button at the top of this page';
            //html += '    </span>';
            html += '  </span>';
            html += '  <br /><br />';
            html += '</div>';


            html += '<div style="display:none;" id="FormsEditorToolbox">';
            html += '        <table style="width:100%;">';
            html += '            <tr>';
            html += '                <td style="width:90%;">';
            html += '                    <span id="spanFormsEditorToolboxDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;font-weight:bold;">TOOLBOX</span>';
            html += '                </td>';
            html += '                <td style="width:9%;"></td>';
            html += '                <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '                    <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 30pt;font-weight:bold;" onclick="$(\'#FormsEditorToolbox\').dialog(\'close\');">X</span>';
            html += '                </td>';
            html += '            </tr>';
            html += '        </table>';
            html += '        <span id="spanFormsEditorToolboxError" style="color:tomato;" ></span>';
            html += '        <span id="spanFormsEditorToolboxTrashbin" style="font-size:50pt;cursor:copy;border:4px solid transparent;" title="Drag form elements here to remove them from the form...">&#128465;</span><!-- trashbin -->';
            html += '        <br /><br />';
            html += '        <span id="spanFormsEditorToolboxDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:18pt;font-weight:bold;">';
            html += '            +/- Choose from these header elements:';
            html += '        <br />xxxcx';
            html += '        </span><br /><br />';
            html += '';
            html += '        <span id="spanFormsEditorToolboxDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:18pt;font-weight:bold;">';
            html += '            +/- Choose from these form elements: ';
            html += '        </span><br /><br />';
            html += '';
            html += '<div style="height:500px;overflow-y: scroll;">';
            html += '        <table style="width:100%;">';

            // BEGIN: Toolbox rows.


            html += '            <tr>';
            html += '                <td style="vertical-align:top;">';
            html += '                </td>';
            html += '                <td>';
            html += '<div id="divToolbox_BwDescriptionField"></div>';
            html += '                </td>';
            html += '            </tr>';

            html += '            <tr>';
            html += '                <td style="vertical-align:top;">';
            html += '                </td>';
            html += '                <td>';
            html += '<div id="divToolbox_BwLocationPicker"></div>';
            html += '                </td>';
            html += '            </tr>';

            html += '            <tr>';
            html += '                <td style="vertical-align:top;">';
            //html += '                    Yes/No element:';
            html += '                </td>';
            html += '                <td>';
            html += '                    <table style="width:100%;">';
            html += '                        <tr class="xdTableOffsetRow">';
            html += '                            <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; PADDING-RIGHT: 5px">';
            html += '                                <div>';
            html += '                                    <span class="xdlabel"></span>';
            html += '                                    <span class="xdlabel">Does this require additional resources?</span>';
            html += '                                </div>';
            html += '                            </td>';
            html += '                            <td class="xdTableOffsetCellComponent" style="text-align:left; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 4px; PADDING-RIGHT: 4px">';
            html += '                                <label for="cbDoesThisRequireItResources"></label><input class="bwRequestJson" bwdatarequired="false" bwdatatype="boolean" bwfieldname="DoesThisRequireItResources" type="checkbox" name="cbDoesThisRequireItResources" id="cbDoesThisRequireItResources" />';
            html += '                            </td>';
            html += '                        </tr>';
            html += '                    </table>';
            html += '                </td>';
            html += '            </tr>';


            html += '            <tr>';
            html += '                <td style="vertical-align:top;">';
            html += '                </td>';
            html += '                <td>';
            html += '<div id="divToolbox_BwRequestedCapitalField"></div>';
            html += '                </td>';
            html += '            </tr>';

            html += '';
            html += '            <tr>';
            html += '                <td style="vertical-align:top;">';
            html += '                </td>';
            html += '                <td>';
            html += '<div id="divToolbox_BwCommentsField"></div>';
            html += '                </td>';
            html += '            </tr>';

            html += '            <tr>';
            html += '                <td style="vertical-align:top;">';
            html += '                </td>';
            html += '                <td>';
            html += '<div id="divToolbox_BwPeoplePicker"></div>';
            html += '                </td>';
            html += '            </tr>';

            html += '            <tr>';
            html += '                <td style="vertical-align:top;">';
            html += '                </td>';
            html += '                <td>';
            html += '<div id="divToolbox_BwDescriptionDetailsField"></div>';
            html += '                </td>';
            html += '            </tr>';

            html += '            <tr>';
            html += '                <td style="vertical-align:top;">';
            html += '                </td>';
            html += '                <td>';
            html += '<div id="divToolbox_BwJustificationDetailsField"></div>';
            html += '                </td>';
            html += '            </tr>';

            html += '            <tr>';
            html += '                <td style="vertical-align:top;">';
            html += '                </td>';
            html += '                <td>';
            html += '<div id="divToolbox_BwReasonDetailsField"></div>';
            html += '                </td>';
            html += '            </tr>';

            html += '            <tr>';
            html += '                <td style="vertical-align:top;">';
            html += '                </td>';
            html += '                <td>';
            html += '<div id="divToolbox_BwCapitalInternalOrderNumberField"></div>';
            html += '                </td>';
            html += '            </tr>';

            html += '            <tr>';
            html += '                <td style="vertical-align:top;">';
            html += '                </td>';
            html += '                <td>';
            html += '<div id="divToolbox_BwExpenseInternalOrderNumberField"></div>';
            html += '                </td>';
            html += '            </tr>';

            html += '            <tr>';
            html += '                <td style="vertical-align:top;">';
            html += '                </td>';
            html += '                <td>';
            html += '<div id="divToolbox_BwCostCenterDescriptionField"></div>';
            html += '                </td>';
            html += '            </tr>';

            html += '            <tr>';
            html += '                <td style="vertical-align:top;">';
            html += '                </td>';
            html += '                <td>';
            html += '<div id="divToolbox_BwCostCenterNumberField"></div>';
            html += '                </td>';
            html += '            </tr>';

            html += '            <tr>';
            html += '                <td style="vertical-align:top;">';
            html += '                </td>';
            html += '                <td>';
            html += '<div id="divToolbox_BwProjectClassField"></div>';
            html += '                </td>';
            html += '            </tr>';

            html += '            <tr>';
            html += '                <td style="vertical-align:top;">';
            html += '                </td>';
            html += '                <td>';
            html += '<div id="divToolbox_BwPaybackTypeField"></div>';
            html += '                </td>';
            html += '            </tr>';

            html += '            <tr>';
            html += '                <td style="vertical-align:top;">';
            html += '                </td>';
            html += '                <td>';
            html += '<div id="divToolbox_BwYearDropDown"></div>';
            html += '                </td>';
            html += '            </tr>';

            html += '            <tr>';
            html += '                <td style="vertical-align:top;">';
            html += '                </td>';
            html += '                <td>';
            html += '<div id="divToolbox_BwAttachments"></div>';
            html += '                </td>';
            html += '            </tr>';

            html += '            <tr>';
            html += '                <td style="vertical-align:top;">';
            html += '                </td>';
            html += '                <td>';
            html += '<div id="divToolbox_BwStartDatePicker"></div>';
            html += '                </td>';
            html += '            </tr>';

            html += '            <tr>';
            html += '                <td style="vertical-align:top;">';
            html += '                </td>';
            html += '                <td>';
            html += '<div id="divToolbox_BwEndDatePicker"></div>';
            html += '                </td>';
            html += '            </tr>';

            html += '            <tr>';
            html += '                <td style="vertical-align:top;">';
            html += '                </td>';
            html += '                <td>';
            html += '<div id="divToolbox_BwDurationInMonthsCalculatedField"></div>';
            html += '                </td>';
            html += '            </tr>';

            html += '            <tr>';
            html += '                <td style="vertical-align:top;">';
            html += '                </td>';
            html += '                <td>';
            html += '<div id="divToolbox_BwProjectTypeDropDown"></div>';
            html += '                </td>';
            html += '            </tr>';

            html += '            <tr>';
            html += '                <td style="vertical-align:top;">';
            html += '                </td>';
            html += '                <td>';
            html += '<div id="divToolbox_BwPillarTypeDropDown"></div>';
            html += '                </td>';
            html += '            </tr>';

            html += '            <tr>';
            html += '                <td style="vertical-align:top;">';
            html += '                </td>';
            html += '                <td>';
            html += '<div id="divToolbox_BwInvoiceGrid"></div>';
            html += '                </td>';
            html += '            </tr>';

            html += '            <tr>';
            html += '                <td style="vertical-align:top;">';
            html += '                </td>';
            html += '                <td>';
            html += '<div id="divToolbox_BwCostsGrid"></div>';
            html += '                </td>';
            html += '            </tr>';

            html += '            <tr>';
            html += '                <td style="vertical-align:top;">';
            html += '                </td>';
            html += '                <td>';
            html += '<div id="divToolbox_BwSpendGrid"></div>';
            html += '                </td>';
            html += '            </tr>';

            html += '            <tr>';
            html += '                <td style="vertical-align:top;">';
            html += '                </td>';
            html += '                <td>';
            html += '<div id="divToolbox_BwSelectQuoteItems"></div>';
            html += '                </td>';
            html += '            </tr>';

            html += '            <tr>';
            html += '                <td style="vertical-align:top;">';
            html += '                </td>';
            html += '                <td>';
            html += '<div id="divToolbox_BwPaybackGrid"></div>';
            html += '                </td>';
            html += '            </tr>';
            // END: Toolbox rows.

            html += '';
            html += '        </table>';
            html += '</div>';
            //html += '        <br /><br />';
            html += '</div>';

            if (this.options.BackendGlobalNewTenantFormsEditing == true) {

                html += '<table style="width:100%;">';
                html += '   <tr>';
                html += '       <td>';
                html += '           <h2>';
                html += '           Forms Editor: <span style="color:#95b1d3;">Admin: Configure the global new tenant forms...</span>'; // Velvet Morning is #95b1d3. This was the pantone color of the day for December 9, 2019! :D
                html += '           </h2>';
                html += '       </td>';
                html += '       <td style="text-align:right;">';
                html += '           <span class="printButton" title="print" onclick="cmdPrintForm();">&#x1f5a8;</span>';
                html += '       </td>';
                html += '   </tr>';
                html += '</table>';

            } else if (this.options.BackendGlobalOfflineFormsEditing == true) {

                html += '<table style="width:100%;">';
                html += '   <tr>';
                html += '       <td>';
                html += '           <h2>';
                html += '           Forms Editor: <span style="color:#95b1d3;">Admin: Configure the global offline forms...</span>'; // Velvet Morning is #95b1d3. This was the pantone color of the day for December 9, 2019! :D
                html += '           </h2>';
                html += '       </td>';
                html += '       <td style="text-align:right;">';
                html += '           <span class="printButton" title="print" onclick="cmdPrintForm();">&#x1f5a8;</span>';
                html += '       </td>';
                html += '   </tr>';
                html += '</table>';

            } else if (this.options.DisplayAsNewTenantUserConfigurationEditor != true) {
                html += '<table style="width:100%;">';
                html += '   <tr>';
                html += '       <td>';
                html += '           <h2>';
                html += '           Forms Editor: <span style="color:#95b1d3;">Configure your "' + workflowAppTitle + '" forms...</span>'; // Velvet Morning is #95b1d3. This was the pantone color of the day for December 9, 2019! :D
                html += '           </h2>';
                html += '       </td>';
                html += '       <td style="text-align:right;">';
                html += '           <span class="printButton" title="print" onclick="cmdPrintForm();">&#x1f5a8;</span>';
                html += '       </td>';
                html += '   </tr>';
                html += '</table>';
            }

            // Publish message and button.
            html += '<table>';
            html += '<tr>';
            html += '  <td>';
            html += '';
            html += '  </td>';
            html += '  <td style="text-align:right;">';
            html += '    <span id="spanThereAreChangesToPublishText" style="font-style:italic;color:tomato;"></span>'; //<input value=" There are unsaved changes. Enter a description here and click Save..." type="text" id="txtNewWorkflowDescription" style="width:450px;color:grey;font-style:italic;padding:5px 5px 5px 5px;" onkeyup="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'NewWorkflowDescriptionTextBox_Onkeyup\');" />';
            html += '  </td>';
            html += '  <td>';
            html += '    <span id="spanThereAreChangesToPublishButton"></span>';
            html += '  </td>';
            html += '</tr>';
            html += '</table>';



            // Create the drop down at the top of the page, and select the last used option!
            html += '<table>';
            html += '<tr>';
            html += '  <td colspan="3" style="white-space:nowrap;">';


            html += '   <div style="display:inline-block;vertical-align:middle;" id="divBwRequestTypeDropDown22">[divBwRequestTypeDropDown22]</div>';
            if (this.options.BackendGlobalOfflineFormsEditing == true) {
                html += '   <span title="Form(s) maintenance..." ';
                html += '       style="width:200px;padding:5px 10px 5px 10px;margin:0 0 0 10px;white-space:nowrap;vertical-align:middle;border:1px solid lightblue;cursor:pointer;font-weight:normal;font-size:10pt;" ';
                html += '       onclick="$(\'.bwFormsEditor_NewTenant\').bwFormsEditor_NewTenant(\'displayOfflineFormsConfigurationDialog\');">';
                html += '       <span style="display:inline-block;"> ⚙ </span>';
                html += '   </span>';
            } else {
                html += '   <span title="Form(s) maintenance..." ';
                html += '       style="width:200px;padding:5px 10px 5px 10px;margin:0 0 0 10px;white-space:nowrap;vertical-align:middle;border:1px solid lightblue;cursor:pointer;font-weight:normal;font-size:10pt;" ';
                html += '       onclick="$(\'.bwFormsEditor_NewTenant\').bwFormsEditor_NewTenant(\'displayFormsConfigurationDialog\');">';
                html += '       <span style="display:inline-block;"> ⚙ </span>';
                html += '   </span>';
            }






            html += '<br />';

            html += '<div style="font-size:8pt;color:tomato;" id="spanFormsEditorError"></div>';

            html += '<br />';

            //html += '<style>';
            //html += '.xdTableOffsetRow-editor:hover {';
            //html += '   background-color:orange;';
            //html += '   opacity:.2;';
            //html += '   border:5px dashed purple;';
            //html += '   cursor:grab;';
            //html += '}';
            //html += '</style>';

            //html += '<div id="divYellowOverlay"></div>';

            html += this.options.CurrentForm.DraftForm; // This is the form! Make sure we get the right one in the _create() method.

            html += '</td>';
            html += '</tr>';
            html += '</table>';
            html += '<div style="height:1500px;"></div>'; // This gives us enough space so the toolbox doesn't bottom out on the screen.

            this.element.html(html); // Render the editor.

            $('#divToolbox_BwDescriptionField').bwDescriptionField({ inFormsEditor: true }); // This is when forms are being designed. This prevents the widget from hitting the database (going asynchronous) when this is true. If that happens, a race condition may occur and addition to the toolbox may partially fail.
            $('#divToolbox_BwLocationPicker').bwLocationPicker({ inFormsEditor: true });
            $('#divToolbox_BwRequestedCapitalField').bwRequestedCapitalField({ inFormsEditor: true });
            $('#divToolbox_BwCommentsField').bwCommentsField({ inFormsEditor: true });
            $('#divToolbox_BwPeoplePicker').bwPeoplePicker({ inFormsEditor: true });
            $('#divToolbox_BwDescriptionDetailsField').bwDescriptionDetailsField({ inFormsEditor: true });
            $('#divToolbox_BwJustificationDetailsField').bwJustificationDetailsField({ inFormsEditor: true });
            $('#divToolbox_BwReasonDetailsField').bwReasonDetailsField({ inFormsEditor: true });
            $('#divToolbox_BwCapitalInternalOrderNumberField').bwCapitalInternalOrderNumberField({ inFormsEditor: true });
            $('#divToolbox_BwExpenseInternalOrderNumberField').bwExpenseInternalOrderNumberField({ inFormsEditor: true });
            $('#divToolbox_BwCostCenterDescriptionField').bwCostCenterDescriptionField({ inFormsEditor: true });
            $('#divToolbox_BwCostCenterNumberField').bwCostCenterNumberField({ inFormsEditor: true });
            $('#divToolbox_BwProjectClassField').bwProjectClassField({ inFormsEditor: true });
            $('#divToolbox_BwPaybackTypeField').bwPaybackTypeField({ inFormsEditor: true });
            $('#divToolbox_BwYearDropDown').bwYearDropDown({ inFormsEditor: true });
            $('#divToolbox_BwAttachments').bwAttachments({ inFormsEditor: true });
            $('#divToolbox_BwStartDatePicker').bwStartDatePicker({ inFormsEditor: true });
            $('#divToolbox_BwEndDatePicker').bwEndDatePicker({ inFormsEditor: true });
            $('#divToolbox_BwDurationInMonthsCalculatedField').bwDurationInMonthsCalculatedField({ inFormsEditor: true });
            $('#divToolbox_BwProjectTypeDropDown').bwProjectTypeDropDown({ inFormsEditor: true });
            $('#divToolbox_BwPillarTypeDropDown').bwPillarTypeDropDown({ inFormsEditor: true });

            $('#divToolbox_BwInvoiceGrid').bwInvoiceGrid({ inFormsEditor: true });

            $('#divToolbox_BwCostsGrid').bwCostsGrid({ inFormsEditor: true });

            $('#divToolbox_BwSpendGrid').bwSpendGrid({ inFormsEditor: true });
            //$('#divToolbox_BwSelectQuoteItems').bwSelectQuoteItems({ inFormsEditor: true });
            $('#divToolbox_BwPaybackGrid').bwPaybackGrid({ inFormsEditor: true });


            if (this.options.DisplayAsNewTenantUserConfigurationEditor != true) {
                //
                // Try to get a custom image. If none found, use the OOB one.
                //
                var imagePath2 = thiz.options.operationUriPrefix + '_files/' + workflowAppId + '/orgimages/' + 'root' + '/' + 'orgimage.png'; // thiz.options.store.OrgId
                $.get(imagePath2).done(function () {
                    setTimeout(function () { // Only needs to happen for Chrome.
                        try {
                            $('#divCreateRequestFormContent_imgRequestOrgImage').attr('src', imagePath2);
                        } catch (e) {
                            console.log('Exception in getRequestFormHtml_CapitalPlan().populate divCreateRequestFormContent_imgRequestOrgImage: ' + e.message + ', ' + e.stack);
                        }
                    }, 500);
                }).fail(function () {
                    //alert("This org has no image."); // do nothing 
                });
                // End: Getting the custom image
                //
            }

            var requestTypeDropDownOptions = {
                dropdownChangeEventJavascript: '$(\'.bwFormsEditor_NewTenant\').bwFormsEditor_NewTenant(\'requestTypeDropDown_Onchange\');'
            };
            var $bwRequestTypeDropDown = $(thiz.element).find("#divBwRequestTypeDropDown22").bwRequestTypeDropDown_NewTenant(requestTypeDropDownOptions);

            // Display the toolbox. // IT IS ABSOLUTELY MADDENING BUT THIS IS THE BEST I CAN GET THE POSITION TO WORK. Maybe a newer version of jquery UI will fix it.? Will leave it for now.
            //alert('xcx3478');
            $("#FormsEditorToolbox").dialog({
                modal: false,
                position: {
                    my: 'left top',
                    at: 'right+70 top-100',
                    of: $(thiz.element).find('#tableLeftTopRequestFormSection')
                },
                width: "580px",
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function (event, ui) {
                    try {
                        thiz.checkIfWeHaveToDisplayThePublishChangesButton();

                        var draggableRows = $(thiz.element).find('.xdTableOffsetRow');
                        console.log('thiz.element draggableRows (xdTableOffsetRow): ' + draggableRows.length);
                        for (var i = 0; i < draggableRows.length; i++) {
                            if (draggableRows[i].style.display != 'none') {
                                draggableRows[i].id = 'draggablerow_' + i; // Our approach requires id's.
                                draggableRows[i].classList.add('xdTableOffsetRow-editor'); // This gives us the hover style etc. which help out with the drag and drop.
                                draggableRows[i].draggable = 'true';
                                draggableRows[i].addEventListener('dragstart', thiz.onDragStart, false);
                                draggableRows[i].addEventListener('dragover', thiz.onDragOver, false);
                                draggableRows[i].addEventListener('drop', thiz.onDrop, false);
                            }
                        }

                        var draggableRows = $('#FormsEditorToolbox').find('.xdTableOffsetRow');
                        console.log('FormsEditorToolbox draggableRows (xdTableOffsetRow): ' + draggableRows.length);
                        for (var i = 0; i < draggableRows.length; i++) {
                            if (draggableRows[i].style.display != 'none') {
                                draggableRows[i].id = 'toolboxdraggablerow_' + i; // Our approach requires id's.
                                draggableRows[i].classList.add('xdTableOffsetRow-editor'); // This gives us the hover style etc. which help out with the drag and drop.
                                draggableRows[i].draggable = 'true';
                                draggableRows[i].addEventListener('dragstart', thiz.onDragStart, false);
                                draggableRows[i].addEventListener('dragover', thiz.onDragOver, false);
                                draggableRows[i].addEventListener('drop', thiz.onDrop_FromToolbox, false);
                            }
                        }

                        // Hook up the trashbin. This is where the user deposits elements from the form in order to remove them.
                        var trashbin = document.getElementById('spanFormsEditorToolboxTrashbin'); // $(this.element).find('#spanFormsEditorToolboxTrashbin'); //document.getElementById('spanFormsEditorToolboxTrashbin');
                        trashbin.addEventListener('dragover', function (e) { thiz.onDragOver_InTrashbin(e) }, false);
                        trashbin.addEventListener('dragleave', function (e) { thiz.onDragLeave_InTrashbin(e) }, false);
                        trashbin.addEventListener('drop', function (e) { thiz.onDrop_InTrashbin(e) }, false);

                    } catch (e) {
                        debugger;
                        console.log('Exception in renderFormsEditor.FormsEditorToolbox.open(): ' + e.message + ', ' + e.stack);
                        //$(thiz.element).find('#spanFormsEditorToolboxError')[0].innerHTML = 'Exception in renderFormsEditor.FormsEditorToolbox.open(): ' + e.message + ', ' + e.stack;
                        $(thiz.element).find('#spanFormsEditorError')[0].innerHTML = 'Exception in renderFormsEditor.FormsEditorToolbox.open(): ' + e.message + ', ' + e.stack;
                    }
                },
                close: function () {
                    unFocus();
                    $(this).empty().dialog('destroy'); // 7-5-2020 THIS IS THE PREFFERED SYNTAX FOR THIS FROM NOW ON!!!!!!!!!!!!!!!!!!!!!!!!!

                }
            });
        } catch (e) {
            console.log('Exception in renderFormsEditor: ' + e.message + ', ' + e.stack);
            $(thiz.element).find('#spanFormsEditorError')[0].innerHTML = 'Exception in renderFormsEditor():2: ' + e.message + ', ' + e.stack;
            //alert('Exception in renderFormsEditor: ' + e.message + ', ' + e.stack);
        }
    },


    onDragStart: function (event) {
        try {
            console.log('In onDragStart().xcx1 event.target.id: ' + event.target.id);
            // The following makes sure the trashbin receives the correct row/element id. If this is missing, the trashbin doesn't know which row on the form to throw away.
            event
              .dataTransfer
              .setData('text/plain', event.target.id);
            //debugger;
            //event
            //  .dataTransfer
            //  .setData('text/plain', event.currentTarget.id); // 5-28-2020 7-18am adt

            //event
            //  .currentTarget
            //  .style
            //  .backgroundColor = 'yellow';

            // Make the cursor "grabbing" <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
            var tableRow;
            if ($(event.currentTarget).hasClass('xdTableOffsetRow')) {
                tableRow = event.currentTarget; //toElement;
            } else {
                tableRow = $(event.currentTarget).closest('.xdTableOffsetRow')[0];
            }

            //tableRow.style.border = '5px solid purple';
            tableRow.style.cursor = 'grabbing';

        } catch (e) {
            console.log('Exception in onDragStart(): ' + e.message + ', ' + e.stack);
        }
    },
    onDragOver: function (event) {
        try {
            console.log('In onDragOver().');
            event.preventDefault();
        } catch (e) {
            console.log('Exception in onDragOver(): ' + e.message + ', ' + e.stack);
        }
    },
    onDrop: function (event) {
        try {
            var thiz = $('.bwFormsEditor_NewTenant').bwFormsEditor_NewTenant('instance'); // Because "this" means the event object, we have to do this for these kinds of method calls.

            var id = event
              .dataTransfer
              .getData('text');

            var draggableElement = document.getElementById(id);

            var dropzone;
            if ($(event.target).hasClass('xdTableOffsetRow')) {
                dropzone = e.toElement;
            } else {
                dropzone = $(event.target).closest('.xdTableOffsetRow')[0];
            }

            var destinationRowIndex = dropzone.id.split('_')[1];
            var table = $(event.target).closest('table')[0];
            var destinationRow = table.insertRow(destinationRowIndex);
            destinationRow.innerHTML = draggableElement.innerHTML; // Now we need to add some attributes to the new row. They don't get copied.
            destinationRow.setAttribute('class', 'xdTableOffsetRow xdTableOffsetRow-editor'); // xdTableOffsetRow-editor
            destinationRow.setAttribute('draggable', 'true');
            var bwWidgetName = draggableElement.getAttribute('bwwidgetname');
            destinationRow.setAttribute('bwwidgetname', bwWidgetName);

            // Remove the original row. Do this by iterating through the rows and removing the correct id.
            for (var i = 0; i < table.rows.length; i++) {
                var row = table.rows[i];
                var id2 = row.id;
                if (id == row.id) {
                    table.deleteRow(i);
                }
            }
            // Now we have to go through and recreate the ids of all the rows so that we start fresh for the user.
            var draggableRows = $(thiz.element).find('.xdTableOffsetRow'); //getElementsByClassName('xdTableOffsetRow');
            for (var i = 0; i < draggableRows.length; i++) {
                if (draggableRows[i].style.display != 'none') {
                    draggableRows[i].id = 'draggablerow_' + i; // Our approach requires id's.
                    draggableRows[i].draggable = 'true';
                    draggableRows[i].removeEventListener('dragstart', thiz.onDragStart);
                    draggableRows[i].addEventListener('dragstart', thiz.onDragStart, false);
                    draggableRows[i].removeEventListener('dragover', thiz.onDragOver);
                    draggableRows[i].addEventListener('dragover', thiz.onDragOver, false);
                    draggableRows[i].removeEventListener('drop', thiz.onDrop);
                    draggableRows[i].addEventListener('drop', thiz.onDrop, false);
                }
            }
            console.log('In onDrop(). destinationRowIndex: ' + destinationRowIndex + ', dropzone.id: ' + dropzone.id + ', bwWidgetName: ' + bwWidgetName);
            //debugger;
            thiz.options.CurrentForm.DraftForm = $(thiz.element).find('#budgetrequestform')[0].innerHTML;

            thiz.checkIfWeHaveToDisplayThePublishChangesButton();

            event
              .dataTransfer
              .clearData();
        } catch (e) {
            console.log('Exception in onDrop(): ' + e.message + ', ' + e.stack);
        }
    },
    onDragOver_InTrashbin: function (event) {
        try {
            console.log('In onDragOver_InTrashbin().');

            var trashbin = event.target; // Yes, this is the trashbin.
            trashbin.style.backgroundColor = 'greenyellow';
            trashbin.style.borderStyle = 'dotted dotted dotted dotted';
            trashbin.style.borderColor = 'red';
            trashbin.innerHTML = '🗑'; //'♻';

            event.preventDefault();
        } catch (e) {
            console.log('Exception in onDragOver_InTrashbin(): ' + e.message + ', ' + e.stack);
        }
    },
    onDragLeave_InTrashbin: function (event) {
        try {
            console.log('In onDragLeave_InTrashbin().');

            var trashbin = event.target; // Yes, this is the trashbin.
            trashbin.style.backgroundColor = '';
            trashbin.style.border = '4px solid transparent';
            trashbin.innerHTML = '🗑';

            event.preventDefault();
        } catch (e) {
            console.log('Exception in onDragLeave_InTrashbin(): ' + e.message + ', ' + e.stack);
        }
    },
    onDrop_InTrashbin: function (event) {
        try {
            var thiz = $('.bwFormsEditor_NewTenant').bwFormsEditor_NewTenant('instance'); // Because "this" means the event object, we have to do this for these kinds of method calls.

            var id = event
              .dataTransfer
              .getData('text');
            console.log('In onDrop_InTrashbin(). id: ' + id);
            //debugger;
            // Sometimes the tr tag is not returned, so we fix that here.
            //if (!id) {
            //    debugger;
            //    var xx = $(event.target).closest('table')[0];
            //}
            //debugger;
            ////var id2 = event.currentTarget.id; // trashcan
            //var id2 = event.target.parentNode.id


            var draggableElement = document.getElementById(id); // eg: draggablerow_2
            var trashbin = event.target; // Yes, this is the trashbin.
            trashbin.style.backgroundColor = '';
            trashbin.style.border = '4px solid transparent';
            trashbin.innerHTML = '🗑';

            var bwWidgetName = draggableElement.getAttribute('bwwidgetname');
            if (false) { // bwWidgetName == 'bwRequestedCapitalField' || bwWidgetName == 'bwLocationPicker' || bwWidgetName == 'bwDescriptionField' || bwWidgetName == 'bwCommentsField' || bwWidgetName == 'xxx') {
                thiz.displayAlertDialog('This field cannot be removed. It is always required for budget requests.');
            } else {



                //debugger;
                var table = $(draggableElement).closest('table')[0];
                // Remove the original row. Do this by iterating through the rows and removing the correct id.
                for (var i = 0; i < table.rows.length; i++) {
                    var row = table.rows[i];
                    var id2 = row.id;
                    if (id == row.id) {
                        table.deleteRow(i);
                    }
                }
                // Now we have to go through and recreate the ids of all the rows so that we start fresh for the user.
                //var draggableRows = table.getElementsByClassName('xdTableOffsetRow');
                //for (var i = 0; i < draggableRows.length; i++) {
                //    if (draggableRows[i].style.display != 'none') {

                //        draggableRows[i].id = 'draggablerow_' + i; // Our approach requires id's.

                //        draggableRows[i].draggable = 'true';

                //        draggableRows[i].addEventListener('dragstart', function (e) { thiz.onDragStart(e); }, false);

                //        draggableRows[i].addEventListener('dragover', function (e) { thiz.onDragOver(e) }, false);
                //        debugger; // onDrop xcx3
                //        draggableRows[i].addEventListener('drop', function (e) { thiz.onDrop(e) }, false);

                //    }
                //}

                console.log('In onDrop_InTrashbin(). Deleted element: ' + id);

                thiz.options.CurrentForm.DraftForm = $(thiz.element).find('#budgetrequestform')[0].innerHTML;

                thiz.checkIfWeHaveToDisplayThePublishChangesButton();
            }
            event
              .dataTransfer
              .clearData();
        } catch (e) {
            console.log('Exception in onDrop_InTrashbin(): ' + e.message + ', ' + e.stack);
        }
    },
    onDrop_FromToolbox: function (event) {
        try {
            debugger;
            var id = event
              .dataTransfer
              .getData('text');
            //console.log('In onDrop(). id: ' + id);
            var draggableElement = document.getElementById(id);


            var dropzone;
            if ($(event.target).hasClass('xdTableOffsetRow')) {
                dropzone = e.toElement;
            } else {
                dropzone = $(event.target).closest('.xdTableOffsetRow')[0];
            }


            //const dropzone = event.target;

            //dropzone.appendChild(draggableElement);
            //var sourceRowIndex = id.split('_')[1];
            var destinationRowIndex = dropzone.id.split('_')[1];
            var table = $(event.target).closest('table')[0];
            var destinationRow = table.insertRow(destinationRowIndex);
            destinationRow.innerHTML = draggableElement.innerHTML; // Now we need to add some attributes to the new row. They don't get copied.!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            destinationRow.setAttribute('class', 'xdTableOffsetRow');
            destinationRow.setAttribute('draggable', 'true');
            //debugger;
            //destinationRow.setAttribute('bwwidgetname', draggableElement.getAttribute('bwwidgetname'));

            // Remove the original row. Do this by iterating through the rows and removing the correct id.
            for (var i = 0; i < table.rows.length; i++) {
                var row = table.rows[i];
                var id2 = row.id;
                if (id == row.id) {
                    table.deleteRow(i);
                }
            }
            // Now we have to go through and recreate the ids of all the rows so that we start fresh for the user.
            var draggableRows = $(thiz.element).find('.xdTableOffsetRow'); //getElementsByClassName('xdTableOffsetRow');
            //debugger;
            for (var i = 0; i < draggableRows.length; i++) {
                if (draggableRows[i].style.display != 'none') {

                    //draggableRows[i].addEventListener('mouseover', handleMouseover, false); 
                    draggableRows[i].id = 'draggablerow_' + i; // Our approach requires id's.

                    draggableRows[i].draggable = 'true';
                    debugger; // onDragStart xcx5
                    draggableRows[i].addEventListener('dragstart', function (e) { onDragStart(e); }, false);

                    draggableRows[i].addEventListener('dragover', function (e) { onDragOver(e) }, false);
                    debugger; // onDrop xcx4
                    draggableRows[i].addEventListener('drop', function (e) { onDrop(e) }, false);

                }
            }



            console.log('In onDrop_FromToolbox(). destinationRowIndex: ' + destinationRowIndex + ', dropzone.id: ' + dropzone.id);

            thiz.options.CurrentForm.DraftForm = $(thiz.element).find('#budgetrequestform')[0].innerHTML;

            thiz.checkIfWeHaveToDisplayThePublishChangesButton();

            event
              .dataTransfer
              .clearData();
        } catch (e) {
            console.log('Exception in onDrop_FromToolbox(): ' + e.message + ', ' + e.stack);
        }
    },
    //onDragStart: function (event) {
    //    try {
    //        console.log('In onDragStart().xcx2 event.target.id: ' + event.target.id);
    //        // The following makes sure the trashbin receives the correct row/element id. If this is missing, the trashbin doesn't know which row on the form to throw away.
    //        event
    //          .dataTransfer
    //          .setData('text/plain', event.target.id);
    //        //debugger;
    //        //event
    //        //  .dataTransfer
    //        //  .setData('text/plain', event.currentTarget.id); // 5-28-2020 7-18am adt

    //        //event
    //        //  .currentTarget
    //        //  .style
    //        //  .backgroundColor = 'yellow';

    //        // Make the cursor "grabbing" <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    //        var tableRow;
    //        if ($(event.currentTarget).hasClass('xdTableOffsetRow')) {
    //            tableRow = event.currentTarget; //toElement;
    //        } else {
    //            tableRow = $(event.currentTarget).closest('.xdTableOffsetRow')[0];
    //        }

    //        //tableRow.style.border = '5px solid purple';
    //        tableRow.style.cursor = 'grabbing';

    //    } catch (e) {
    //        console.log('Exception in onDragStart(): ' + e.message + ', ' + e.stack);
    //    }
    //},

    // THIS IS THE ONLY PLACE WHERE WE SHOULD BE RENDERING THE FORM.
    getRequestFormHtml: function (elementId) {
        console.log('bwFormsEditor_NewTenant.js.getRequestFormHtml().');
        alert('bwFormsEditor_NewTenant.js.getRequestFormHtml().');
        var thiz = this;
        return new Promise(function (resolve, reject) {
            try {
                
                // Make sure we don't have another form handing around! This will make it really difficult to troubleshoot because we will have duplicate DOM element Id's.
                debugger;
                var bwRequestType, bwFormId; // = 'budgetrequest'; // This is the default.
                var requestTypeDropdown = $(thiz.element).find('#selectRequestTypeDropDown')[0];
                $(requestTypeDropdown).find('option:selected').each(function (index, element) {
                    //debugger;
                    //bwRequestType = element.value;
                    bwFormId = element.value;
                    bwRequestType = element.text;
                });

                console.log('In bwFormsEditor_NewTenant.getRequestFormHtml(). THIS IS THE ONLY PLACE WHERE WE SHOULD BE RENDERING THE FORM. bwRequestType: ' + bwRequestType + ', bwFormId: ' + bwFormId);

                var html = '';
                html += '<div id="budgetrequestform" class="context-menu-newrequesteditor" align="left" bwbudgetrequestid="" bwrequesttype="' + bwRequestType + '">';

                //debugger;

                if (!bwRequestType) {
                    //alert('In getRequestFormHtml. Fatal error. bwRequestType is an unexpected value: ' + bwRequestType);
                    //resolve('In getRequestFormHtml. Fatal error. bwRequestType is an unexpected value: ' + bwRequestType);
                    if (thiz.options.ActiveForms && thiz.options.ActiveForms.length && thiz.options.ActiveForms[0].bwRequestType) {
                        bwRequestType = thiz.options.ActiveForms[0].bwRequestType;
                    }
                }


                var selectedFormIndex = -1;
                for (var i = 0; i < thiz.options.ActiveForms.length; i++) {
                    if (thiz.options.ActiveForms[i].bwRequestType == bwRequestType) {
                        selectedFormIndex = i;
                        break;
                    }
                }
                debugger; // THIS IS IT CHECK THIS OUT<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                if (selectedFormIndex == -1) {
                    //html += '<span style="color:tomato;">ERROR: CANNOT FIND THE FORM FOR THIS SELECTED REQUEST TYPE IN THE DATABASE. This process cannot proceed. xcx1bwRequestType: ' + bwRequestType + '</span>&nbsp;&nbsp;';
                    //html += '<input type="button" value="CREATE NEW FORM xcx4367" onclick="$(\'.bwFormsEditor_NewTenant\').bwFormsEditor_NewTenant(\'createNewForm\', \'' + bwRequestType + '\');" />';


                    var html2 = '<table class="xdFormLayout" style="BORDER-TOP-STYLE: none; WORD-WRAP: break-word; BORDER-LEFT-STYLE: none; BORDER-COLLAPSE: collapse; TABLE-LAYOUT: fixed; BORDER-BOTTOM-STYLE: none; BORDER-RIGHT-STYLE: none; ">    <colgroup>        <col style="">    </colgroup>    <tbody>        <tr class="xdTableContentRow">            <td class="xdTableContentCell" style="display:block;BORDER-TOP: #d8d8d8 1pt solid; BORDER-RIGHT: #d8d8d8 1pt solid; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 0px; PADDING-TOP: 0px; PADDING-LEFT: 0px; BORDER-LEFT: #d8d8d8 1pt solid; PADDING-RIGHT: 0px">                <div></div>                <!--<span style="color:cornflowerblue;">Your currently selected budgeting network: BudgetWorkflow1</span>-->                <table style="width:100%;">                    <tbody><tr>                        <td colspan="4">                           <span id="divCreateRequestFormContent_requestOrgClickableBreadcrumb" style="color:purple;font-size:8pt;">[divCreateRequestFormContent_requestOrgClickableBreadcrumb]</span>                       </td>                    </tr>                    <tr>                        <td width="5"></td>                        <td>                   <span><img id="divCreateRequestFormContent_imgRequestOrgImage" style="width:100px;height:100px;" src="https://budgetworkflow.com/_files/6f308d4e-66fd-4e6f-925e-714b3135fef3/orgimages/root/orgimage.png">                   </span>                        </td>                        <td style="text-align:right;" colspan="2">                           &nbsp;&nbsp;<span class="xdlabel" id="spanRequestForm_Title">                               [spanRequestForm_Title]                           </span>                           <br>                           <span id="spanViewWorkflowParticipantsLink" style="text-decoration:underline;cursor:pointer;font-size:10pt;color:gray;" onclick="$(\'.bwRequest\').bwRequest(\'displayNewRequestWorkflowParticipantsDialog\', this);">View Workflow/Participants</span>                           <br>                           <span id="spanRequestForm_WorkflowAndRoleDetails">[spanRequestForm_WorkflowAndRoleDetails]</span>                           <span id="spanRequestForm_Checklists"></span>                        </td>                    </tr>                </tbody></table>                <div align="right">                    <span class="xdlabel">                        <em></em>                    </span>                </div>                <div align="right">                    <span class="xdlabel">                        <em>                            <font style="FONT-SIZE: 11pt">                                <span id="spanRequestForm_Instructions">[spanRequestForm_Instructionsxcx2]                                    &nbsp;                                </span>                            </font>                        </em>                    </span>                </div>                <div align="right">                    <span id="spanRequestForm_Buttons">                       [spanRequestForm_Buttons]                        &nbsp;                    </span>                </div>                <div align="right">                    <span title="" class="xdlabel" id="spanRequestForm_Error" style="color:tomato;" hidefocus="1">                        &nbsp;                    </span>                </div>                <div align="center">                    <span class="xdlabel"></span>                </div><div id="tableLeftTopRequestFormSection" style="display:inline-block;vertical-align:top;">                                        <div></div><div></div><div>                                               </div><table class="xdFormLayout xdTableStyleTwoCol" style="display:inline-block;border:1px solid aliceblue;width:765px;">                                            <colgroup>                                                <col style="WIDTH: 169px">                                                <col style="">                                            </colgroup>                                            <tbody valign="top">                                                <tr class="xdTableOffsetRow" id="trNewRequestRecurringExpenseSection" style="display:none;">                                                    <td class="xdTableOffsetCellLabel" style="text-align:left; BORDER-TOP: #d8d8d8 1pt; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px">                                                        <span class="xdlabel" id="spanNewRequestRecurringExpenseSectionTitle">Recurring expense:</span>                                                    </td>                                                    <td class="xdTableOffsetCellComponent" style="BORDER-TOP: #d8d8d8 1pt; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px">                                                        <!--<span id="spanNewRequestRecurringExpenseSecondSection"></span>-->                                                        <input disabled="" id="cbNewRequestRecurringExpenseSubmitImmediately" type="checkbox">                                                        <span style="font-size:10pt;color:lightgray;">Submit the first budget request immediately.</span>                                                        <br>                                                        <!--<span style="font-size:8pt;">This does not create the budget request, it only schedules the reminder for when the budget request should be submitted.</span>                                                        <br />-->                                                        <span style="font-size:10pt;">Reminder date:</span>                                                        <br>                                                        <input id="dtRecurringExpenseReminderDate" style="WIDTH: 60%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;TEXT-ALIGN: left;" type="text">                                                        <br>                                                        <span style="font-size:8pt;">You and the Manager will receive notifications prior to the reminder date so that you can initiate the next new request. Also, if anyone changes the date you will be notified.</span>                                                        <br>                                                    </td>                                                </tr>                                                <tr class="xdTableOffsetRow xdTableOffsetRow-editor" id="draggablerow_1" draggable="true" bwwidgetname="bwCommentsField">                            <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px">                                <span class="xdlabel">                                    Comments:                                </span>                               <span title="Select this asterick to make this a required field." class="ToggleRequiredAsterisk-Off" onclick="$(\'.bwFormsEditor\').bwFormsEditor(\'toggleFormRequiredField\', this);">*</span>                            </td>                            <td class="xdTableOffsetCellComponent" style="white-space:nowrap;text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px;">                                      <div>                                        <table width="100%">                                          <tbody><tr>                                            <td colspan="2">                                              <span title="" disabled="" class="xdTextBoxRequired" id="ReviewerComments" style="WORD-WRAP: break-word; HEIGHT: 90px; WHITE-SPACE: normal; OVERFLOW-X: auto; OVERFLOW-Y: auto; WIDTH: 100%;BACKGROUND-COLOR: white;" contenteditable="false" hidefocus="1" bwfieldname="ReviewerComments" bwdatatype="String" bwdatarequired="false" xd:datafmt="&quot;string&quot;,&quot;plainMultiline&quot;">                                              </span>                                            </td>                                          </tr>                                        </tbody></table>                                      </div>                            </td>                        </tr><tr class="xdTableOffsetRow xdTableOffsetRow-editor" draggable="true" bwwidgetname="bwDescriptionField" id="draggablerow_3">                            <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px">                                <span class="xdlabel">                                    Description:                                </span>                               <span title="Select this asterick to make this a required field." class="ToggleRequiredAsterisk-On" onclick="$(\'.bwFormsEditor\').bwFormsEditor(\'toggleFormRequiredField\', this);">*</span>                            </td>                            <td class="xdTableOffsetCellComponent" style="white-space:nowrap;text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px;">   <input disabled="" class="bwRequestJson" id="strProjectTitle" style="WIDTH: 100%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" contenteditable="false" onkeyup="$(\'.bwRequest\').bwRequest(\'editTextbox_OnKeyUp\', this);" type="text" bwfieldname="ProjectTitle" bwdatatype="string" bwdatarequired="true"> <!-- was 2.77em -->                            </td>                        </tr>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <tr>                                                    <td colspan="2">                                                        <span id="BudgetRequestId" style="visibility:hidden;display:none;"></span>                                                        <span id="RecurringExpenseId" style="visibility:hidden;display:none;"></span>                                                        <span id="OfflineRequestBudgetRequestId" style="visibility:hidden;display:none;"></span>                                                        <span id="OfflineRequestRecurringExpenseId" style="visibility:hidden;display:none;"></span>                                                    </td>                                                </tr>                                                                                                                                                                                                                                                                                                                                                                                         </tbody></table></div>                       <table style="width:750px;">                                               <tbody>                                                                                                                                 </tbody></table>           </td>       </tr>   </tbody></table>';

                    html += html2;


                } else {
                    //debugger;
                    var html2 = thiz.options.ActiveForms[selectedFormIndex].bwFormHtml;

                    //
                    // NOW WE HAVE TO REPLACE SOME CONTENT SO THAT OUR MULTIPLE FORM DISPLAY WORKS OK WITH NO CROSSOVER.
                    //
                    //debugger;
                    //var index = html2.indexOf("$('.bwRequest').bwRequest('displayNewRequestWorkflowParticipantsDialog', 'xcxElementId');");
                    //html2 = html2.replace("$('.bwRequest').bwRequest('displayNewRequestWorkflowParticipantsDialog', 'xcxElementId');", "$('.bwRequest').bwRequest('displayNewRequestWorkflowParticipantsDialog', '" + elementId + "');");
                    //var viewWorkflowParticipantsLink = $(html2).find('#spanViewWorkflowParticipantsLink');
                    //viewWorkflowParticipantsLink.setAttribute('click', '$(\'.bwRequest\').bwRequest(\'displayNewRequestWorkflowParticipantsDialog\', \'' + elementId + '\');');

                    html += html2;
                }

                html += '</div>';

                //console.log('Calling resolve() in getRequestFormHtml_CapitalPlan().');
                resolve(html);

            } catch (e) {
                console.log('Exception in getRequestFormHtml(): ' + e.message + ', ' + e.stack);
                reject();
            }
        })
    },

    createNewForm: function (requestType) {
        try {
            // This creates a simple form.. very simple. The user can add to it.
            console.log('In createNewForm().');
            alert('In createNewForm().');
            var html = '';
            debugger;
            html += '<table class="xdFormLayout" style="BORDER-TOP-STYLE: none; WORD-WRAP: break-word; BORDER-LEFT-STYLE: none; BORDER-COLLAPSE: collapse; TABLE-LAYOUT: fixed; BORDER-BOTTOM-STYLE: none; BORDER-RIGHT-STYLE: none; ">    <colgroup>        <col style="">    </colgroup>    <tbody>        <tr class="xdTableContentRow">            <td class="xdTableContentCell" style="display:block;BORDER-TOP: #d8d8d8 1pt solid; BORDER-RIGHT: #d8d8d8 1pt solid; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 0px; PADDING-TOP: 0px; PADDING-LEFT: 0px; BORDER-LEFT: #d8d8d8 1pt solid; PADDING-RIGHT: 0px">                <div></div>                <!--<span style="color:cornflowerblue;">Your currently selected budgeting network: BudgetWorkflow1</span>-->                <table style="width:100%;">                    <tbody><tr>                        <td colspan="4">                           <span id="divCreateRequestFormContent_requestOrgClickableBreadcrumb" style="color:purple;font-size:8pt;">[divCreateRequestFormContent_requestOrgClickableBreadcrumb]</span>                       </td>                    </tr>                    <tr>                        <td width="5"></td>                        <td>                   <span><img id="divCreateRequestFormContent_imgRequestOrgImage" style="width:100px;height:100px;" src="https://budgetworkflow.com/_files/6f308d4e-66fd-4e6f-925e-714b3135fef3/orgimages/root/orgimage.png">                   </span>                        </td>                        <td style="text-align:right;" colspan="2">                           &nbsp;&nbsp;<span class="xdlabel" id="spanRequestForm_Title">                               [spanRequestForm_Title]                           </span>                           <br>                           <span id="spanViewWorkflowParticipantsLink" style="text-decoration:underline;cursor:pointer;font-size:10pt;color:gray;" onclick="$(\'.bwRequest\').bwRequest(\'displayNewRequestWorkflowParticipantsDialog\', this);">View Workflow/Participants</span>                           <br>                           <span id="spanRequestForm_WorkflowAndRoleDetails">[spanRequestForm_WorkflowAndRoleDetails]</span>                           <span id="spanRequestForm_Checklists"></span>                        </td>                    </tr>                </tbody></table>                <div align="right">                    <span class="xdlabel">                        <em></em>                    </span>                </div>                <div align="right">                    <span class="xdlabel">                        <em>                            <font style="FONT-SIZE: 11pt">                                <span id="spanRequestForm_Instructions">[spanRequestForm_Instructionsxcx2]                                    &nbsp;                                </span>                            </font>                        </em>                    </span>                </div>                <div align="right">                    <span id="spanRequestForm_Buttons">                       [spanRequestForm_Buttons]                        &nbsp;                    </span>                </div>                <div align="right">                    <span title="" class="xdlabel" id="spanRequestForm_Error" style="color:tomato;" hidefocus="1">                        &nbsp;                    </span>                </div>                <div align="center">                    <span class="xdlabel"></span>                </div><div id="tableLeftTopRequestFormSection" style="display:inline-block;vertical-align:top;">                                        <div></div><div></div><div>                                               </div><table class="xdFormLayout xdTableStyleTwoCol" style="display:inline-block;border:1px solid aliceblue;width:765px;">                                            <colgroup>                                                <col style="WIDTH: 169px">                                                <col style="">                                            </colgroup>                                            <tbody valign="top">                                                <tr class="xdTableOffsetRow" id="trNewRequestRecurringExpenseSection" style="display:none;">                                                    <td class="xdTableOffsetCellLabel" style="text-align:left; BORDER-TOP: #d8d8d8 1pt; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px">                                                        <span class="xdlabel" id="spanNewRequestRecurringExpenseSectionTitle">Recurring expense:</span>                                                    </td>                                                    <td class="xdTableOffsetCellComponent" style="BORDER-TOP: #d8d8d8 1pt; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px">                                                        <!--<span id="spanNewRequestRecurringExpenseSecondSection"></span>-->                                                        <input disabled="" id="cbNewRequestRecurringExpenseSubmitImmediately" type="checkbox">                                                        <span style="font-size:10pt;color:lightgray;">Submit the first budget request immediately.</span>                                                        <br>                                                        <!--<span style="font-size:8pt;">This does not create the budget request, it only schedules the reminder for when the budget request should be submitted.</span>                                                        <br />-->                                                        <span style="font-size:10pt;">Reminder date:</span>                                                        <br>                                                        <input id="dtRecurringExpenseReminderDate" style="WIDTH: 60%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;TEXT-ALIGN: left;" type="text">                                                        <br>                                                        <span style="font-size:8pt;">You and the Manager will receive notifications prior to the reminder date so that you can initiate the next new request. Also, if anyone changes the date you will be notified.</span>                                                        <br>                                                    </td>                                                </tr>                                                <tr class="xdTableOffsetRow xdTableOffsetRow-editor" id="draggablerow_1" draggable="true" bwwidgetname="bwCommentsField">                            <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px">                                <span class="xdlabel">                                    Comments:                                </span>                               <span title="Select this asterick to make this a required field." class="ToggleRequiredAsterisk-Off" onclick="$(\'.bwFormsEditor\').bwFormsEditor(\'toggleFormRequiredField\', this);">*</span>                            </td>                            <td class="xdTableOffsetCellComponent" style="white-space:nowrap;text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px;">                                      <div>                                        <table width="100%">                                          <tbody><tr>                                            <td colspan="2">                                              <span title="" disabled="" class="xdTextBoxRequired" id="ReviewerComments" style="WORD-WRAP: break-word; HEIGHT: 90px; WHITE-SPACE: normal; OVERFLOW-X: auto; OVERFLOW-Y: auto; WIDTH: 100%;BACKGROUND-COLOR: white;" contenteditable="false" hidefocus="1" bwfieldname="ReviewerComments" bwdatatype="String" bwdatarequired="false" xd:datafmt="&quot;string&quot;,&quot;plainMultiline&quot;">                                              </span>                                            </td>                                          </tr>                                        </tbody></table>                                      </div>                            </td>                        </tr><tr class="xdTableOffsetRow xdTableOffsetRow-editor" draggable="true" bwwidgetname="bwDescriptionField" id="draggablerow_3">                            <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px">                                <span class="xdlabel">                                    Description:                                </span>                               <span title="Select this asterick to make this a required field." class="ToggleRequiredAsterisk-On" onclick="$(\'.bwFormsEditor\').bwFormsEditor(\'toggleFormRequiredField\', this);">*</span>                            </td>                            <td class="xdTableOffsetCellComponent" style="white-space:nowrap;text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px;">   <input disabled="" class="bwRequestJson" id="strProjectTitle" style="WIDTH: 100%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" contenteditable="false" onkeyup="$(\'.bwRequest\').bwRequest(\'editTextbox_OnKeyUp\', this);" type="text" bwfieldname="ProjectTitle" bwdatatype="string" bwdatarequired="true"> <!-- was 2.77em -->                            </td>                        </tr>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <tr>                                                    <td colspan="2">                                                        <span id="BudgetRequestId" style="visibility:hidden;display:none;"></span>                                                        <span id="RecurringExpenseId" style="visibility:hidden;display:none;"></span>                                                        <span id="OfflineRequestBudgetRequestId" style="visibility:hidden;display:none;"></span>                                                        <span id="OfflineRequestRecurringExpenseId" style="visibility:hidden;display:none;"></span>                                                    </td>                                                </tr>                                                                                                                                                                                                                                                                                                                                                                                         </tbody></table></div>                       <table style="width:750px;">                                               <tbody>                                                                                                                                 </tbody></table>           </td>       </tr>   </tbody></table>';


            this.options.CurrentForm.DraftForm = html;

            this.renderFormsEditor();


            //$(this.element).find('#budgetrequestform')[0].innerHTML = html;

        } catch (e) {
            console.log('Exception in createNewForm(): ' + e.message + ', ' + e.stack);
        }
    },

    activateSelectedForm: function (bwFormId, bwRequestType) {
        try {
            // This is where the user has selected to activate a workflow from the Workflow Configuration dialog.
            //alert('In activateSelectedForm(). This functionality is incomplete. Coming soon!');
            var thiz = this;
            var selectedRequestType;
            $('#selectFormRequestTypeDropDownInActivateSelectedFormDialog').find('option:selected').each(function (index, element) {
                selectedRequestType = element.value;
            });
            debugger; // check the values for selectedRequestType and bwRequestType to make sure they are there!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            console.log('In activateSelectedForm(). selectedRequestType: ' + selectedRequestType + ', bwFormId: ' + bwFormId);
            if (confirm("Are you certain you wish to activate this form?")) {
                //this.showProgress('Activating your Selected Workflow...');
                debugger;
                bwRequestType = selectedRequestType;
                if (selectedRequestType == bwRequestType) {
                    // Just activate the workflow. If they were different, we would have to publish instead.
                    $.ajax({
                        url: thiz.options.operationUriPrefix + "odata/activateform2/" + tenantId + '/' + workflowAppId + '/' + selectedRequestType + '/' + bwFormId,
                        dataType: "json",
                        contentType: "application/json",
                        type: "Get",
                        timeout: thiz.options.ajaxTimeout
                    }).done(function (result) {
                        try {
                            console.log('In activateSelectedForm(). activateform2. result.message: ' + result.message);
                            if (result.message != 'SUCCESS') {
                                thiz.displayAlertDialog(result.message);
                            } else {
                                // Display a dialog with an "Undo" button!!!!
                                //alert('Successfully updated the database. THIS WORKFLOW CHANGE WILL TAKE PLACE IMMEDIATELY!');
                                $("#divUndoFormActivationDialog").dialog({
                                    modal: true,
                                    resizable: false,
                                    closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                                    width: '800',
                                    dialogClass: 'no-close', // No close button in the upper right corner.
                                    hide: false, // This means when hiding just disappear with no effects.
                                    open: function () {
                                        try {
                                            $('.ui-widget-overlay').bind('click', function () {
                                                $('#divUndoFormActivationDialog').dialog('close');
                                            });
                                        } catch (e) {
                                            console.log('Exception in activateSelectedForm().divUndoFormActivationDialog.open(): ' + e.message + ', ' + e.stack);
                                        }
                                    },
                                    close: function () {
                                        //var promise = thiz.loadWorkflowsAndCurrentWorkflow(selectedRequestType);
                                        //promise.then(function (result) {
                                        try {
                                            //$('#divUndoFormActivationDialog').dialog("destroy");
                                            //$('#divActivateSelectedFormDialog').dialog('close');
                                            //$('#divFormsConfigurationDialog').dialog('close');
                                            //thiz.renderWorkflowEditor2();
                                            //thiz.checkIfWeHaveToDisplayThePublishChangesButton();

                                            $('#divUndoFormActivationDialog').dialog("destroy");
                                            $('#divActivateSelectedFormDialog').dialog('close');
                                            $('#divFormsConfigurationDialog').dialog('close');
                                            thiz._create();


                                        } catch (e) {
                                            console.log('Exception in activateSelectedForm().divUndoFormActivationDialog.close(): ' + e.message + ', ' + e.stack);
                                        }
                                        //});
                                    }
                                });
                                $('#divUndoWorkflowActivationDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();
                            }
                        } catch (e) {
                            console.log('Exception in activateSelectedForm().update: ' + e.message + ', ' + e.stack);
                        }
                    }).fail(function (data) {
                        //lpSpinner.Hide();
                        console.log('In xx2.fail(): ' + JSON.stringify(data));
                        var msg;
                        if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                            msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                        } else {
                            msg = JSON.stringify(data);
                        }
                        alert('Exception in activateSelectedForm().Get: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                        console.log('Exception in activateSelectedForm().Get: ' + JSON.stringify(data));
                        //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                        //var error = JSON.parse(data.responseText)["odata.error"];
                        //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
                    });
                } else {
                    // Since the request types are different, we ahve to "Publish". A new workflow will be created and activated for this request type.
                    //alert('Since the request types are different, we have to "Publish". A new workflow will be created and activated for this request type. This functionality is incomplete. Coming soon! eg: publishWorkflowConfigurationAndActivate');
                    //var bwFormHtml; // Find the workflow we are copying from.
                    //for (var i = 0; i < thiz.options.Workflows.length; i++) {
                    //    if (bwFormId == thiz.options.Workflows[i].bwFormId) {
                    //        bwFormHtml = thiz.options.Workflows[i].bwFormHtml;
                    //        break;
                    //    }
                    //}

                    // Get "budgetrequestform" html.
                    var bwFormHtml = $(this.element).find('#budgetrequestform')[0].innerHTML;

                    //var bwBaseFormId = $(this.element).find('#budgetrequestform')[0].getAttribute('bwFormId');

                    //debugger;
                    var json = {
                        bwTenantId: tenantId,
                        bwWorkflowAppId: workflowAppId,
                        CreatedById: participantId,
                        CreatedByFriendlyName: participantFriendlyName,
                        CreatedByEmail: participantEmail,

                        bwBaseFormId: bwFormId, // We need to keep a breadcrumb trail of inheritance going in the db for future reference.
                        bwRequestType: selectedRequestType,
                        bwFormHtml: bwFormHtml //thiz.options.CurrentWorkflow.Workflow), //JSON.stringify(thiz.options.CurrentWorkflow), // WE KNOW WE ARE NOT GETTING THE CORRECT JSON HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                    };
                    $.ajax({
                        url: thiz.options.operationUriPrefix + "odata/publishform3",
                        type: "Post",
                        timeout: thiz.options.ajaxTimeout,
                        data: json,
                        headers: {
                            "Accept": "application/json; odata=verbose"
                        }
                    }).success(function (result) {
                        try {
                            //debugger;
                            console.log('In activateSelectedForm().post: Successfully updated DB. result: ' + JSON.stringify(result)); // using (' + JSON.stringify(json) + ').');
                            // Display a dialog with an "Undo" button!!!!
                            //$("#divUndoWorkflowActivationDialog").dialog({
                            $("#divUndoFormActivationDialog").dialog({
                                modal: true,
                                resizable: false,
                                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                                width: '800',
                                dialogClass: 'no-close', // No close button in the upper right corner.
                                hide: false, // This means when hiding just disappear with no effects.
                                open: function () {
                                    $('.ui-widget-overlay').bind('click', function () {
                                        $('#divUndoFormActivationDialog').dialog('close');
                                    });
                                },
                                close: function () {
                                    //var promise = thiz.loadWorkflowsAndCurrentWorkflow(selectedRequestType);
                                    //promise.then(function (result) {
                                    try {
                                        $('#divUndoFormActivationDialog').dialog("destroy");
                                        $('#divActivateSelectedFormDialog').dialog('close');
                                        $('#divFormsConfigurationDialog').dialog('close');
                                        thiz._create();
                                        //thiz.renderFormsEditor();
                                        //thiz.checkIfWeHaveToDisplayThePublishChangesButton();
                                    } catch (e) {
                                        console.log('Exception in activateSelectedForm(): ' + e.message + ', ' + e.stack);
                                    }
                                    //});
                                }
                            });
                            $('#divUndoFormActivationDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();

                            //thiz.options.CurrentWorkflow.DraftWorkflow = JSON.parse(JSON.stringify(thiz.options.CurrentWorkflow.Workflow)); 
                            //thiz.checkIfWeHaveToDisplayThePublishChangesButton();

                        } catch (e) {
                            console.log('Exception in activateSelectedForm().xx.update: ' + e.message + ', ' + e.stack);
                            alert('Exception in activateSelectedForm().xx.update: ' + e.message + ', ' + e.stack);
                        }
                    }).error(function (data, errorCode, errorMessage) {
                        debugger;
                        //thiz.hideProgress();
                        var msg;
                        if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                            msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                        } else {
                            msg = JSON.stringify(data) + ', json: ' + JSON.stringify(json);
                        }
                        console.log('Fail in activateSelectedForm().xx.update: ' + JSON.stringify(data) + ', json: ' + JSON.stringify(json));
                        alert('Fail in activateSelectedForm().xx.update: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                        //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                        //var error = JSON.parse(data.responseText)["odata.error"];
                        //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
                    });
                }
            }
        } catch (e) {
            console.log('Exception in activateSelectedForm(): ' + e.message + ', ' + e.stack);
        }
    },

    toggleFormConfigurationCheckboxes: function (element) {
        try {
            // This is the top checkbox which the user can use to toggle all of the subsequent checkboxes on or off.
            console.log('In toggleFormConfigurationCheckboxes().');
            var checkboxes = document.getElementsByClassName('formCheckbox');
            if (element.checked == true) {
                for (var i = 0; i < checkboxes.length; i++) {
                    if (!checkboxes[i].disabled) {
                        checkboxes[i].checked = true;
                    }
                }
            } else if (element.checked == false) {
                for (var i = 0; i < checkboxes.length; i++) {
                    if (!checkboxes[i].disabled) {
                        checkboxes[i].checked = false;
                    }
                }
            }
        } catch (e) {
            console.log('Exception in toggleFormConfigurationCheckboxes(): ' + e.message + ', ' + e.stack);
        }
    },
    cmdDisplayDeleteFormsDialog: function () {
        try {
            console.log('In cmdDisplayDeleteFormsDialog().');
            //debugger;
            $("#divDeleteFormsDialog").dialog({
                modal: true,
                resizable: false,
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                width: '500',
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {
                    $('.ui-widget-overlay').bind('click', function () {
                        $("#divDeleteFormsDialog").dialog('close');
                    });
                },
                close: function () {
                    $('#divDeleteFormsDialog').dialog('destroy');
                }
            });
            $("#divDeleteFormsDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

            var forms = document.getElementsByClassName('formCheckbox');
            var selectedForms = [];
            for (var i = 0; i < forms.length; i++) {
                if (forms[i].checked) {
                    selectedForms.push(forms);
                }
            }
            if (selectedForms.length == 0) {
                var html = '';
                html += 'You have not selected any forms to delete. You have to select at least 1.';
                document.getElementById('spanDeleteFormsDialogContentText').innerHTML = html;
            } else {
                var html = '';
                html += 'You have chosen to delete ' + selectedForms.length + ' forms. This action cannot be undone.';
                document.getElementById('spanDeleteFormsDialogContentText').innerHTML = html;
            }

        } catch (e) {
            console.log('Exception in cmdDisplayDeleteFormsDialog(): ' + e.message + ', ' + e.stack);
        }
    },
    deleteSelectedForms: function () {
        try {
            console.log('In deleteSelectedForms().');
            var thiz = this;
            var selectedFormsToDelete = [];
            var forms = document.getElementsByClassName('formCheckbox');
            //debugger;
            for (var i = 0; i < forms.length; i++) {
                if (forms[i].checked == true) {
                    var bwformid = forms[i].getAttribute('bwformid');
                    selectedFormsToDelete.push(bwformid);
                } else {
                    // do nothing.
                }
            }
            //if (selectedFormsToDelete.length > 1) {
            //    alert('Only 1 form at a time may be deleted. Please change your selection before proceeding.');
            //} else if (selectedFormsToDelete.length != 1) {
            //    alert('You chose to delete ' + selectedFormsToDelete.length + ' forms. Only 1 form at a time may be deleted. Please change your selection before proceeding.');
            //} else {
            var json = {
                bwTenantId: tenantId,
                bwWorkflowAppId: workflowAppId,
                bwFormIds: selectedFormsToDelete
            }
            //alert('In deleteSelectedForms(). CANNOT DELETE. WE NEED TO VERIFY THAT THE FORM HAS NO RELATED REQUESTS WHICH MAY BE ORPHANED. COMING SOON!'); //Getting ready to delete ' + selectedWorkflowsToDelete.length + ' workflows. This action cannot be undone. This functionality is incomplete and needs further testing!!!!');
            $.ajax({
                url: this.options.operationUriPrefix + "_bw/deletenewtenantforms", // "_bw/deleteform", // "_bw/deleteworkflows", // Change to deleteform when we want to preserve form audit trail and only allow 1 at a time.
                dataType: "json",
                contentType: "application/json",
                type: "Post",
                data: JSON.stringify(json)
            }).done(function (result) {
                try {
                    console.log('In deleteSelectedForms(): Successfully updated DB.');
                    $("#divMessageDialog").dialog({
                        modal: true,
                        resizable: false,
                        closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                        width: '900',
                        dialogClass: 'no-close', // No close button in the upper right corner.
                        hide: false, // This means when hiding just disappear with no effects.
                        open: function () {
                            //debugger;
                            $('#divDeleteFormsDialog').dialog('close');
                            $('.ui-widget-overlay').bind('click', function () {
                                $('#divMessageDialog').dialog('close');
                            });
                            document.getElementById('spanMessageDialogTitle').innerHTML = 'Forms DELETED';
                            document.getElementById('spanMessageDialogContentTop').innerHTML = 'These forms have been deleted.';

                            thiz.displayFormsConfigurationDialog();

                        },
                        close: function () {
                            //location.reload(); // When the user closes this dialog, we regenerate the screen to reflect the newly created and activated workflow.
                        }
                    });
                    $('#divMessageDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();
                } catch (e) {
                    console.log('Exception in deleteSelectedForms():2: ' + e.message + ', ' + e.stack);
                }
            }).fail(function (data) {
                //debugger;
                var msg;
                if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                    msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                } else {
                    msg = JSON.stringify(data) + ', json: ' + JSON.stringify(selectedFormsToDelete);
                }
                alert('Fail in deleteSelectedForms(): ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                console.log('Fail in deleteSelectedForms(): ' + JSON.stringify(data) + ', json: ' + JSON.stringify(selectedFormsToDelete));
                //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                //var error = JSON.parse(data.responseText)["odata.error"];
                //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
            });
            //}
        } catch (e) {
            console.log('Exception in deleteSelectedForms(): ' + e.message + ', ' + e.stack);
        }
    },






    displayFormsConfigurationDialog: function () {
        try {
            console.log('In displayFormsConfigurationDialog().');
            var thiz = this;

            // NEED TO RELOAD thiz.options.ActiveForms here!!
            // First load the NewTenantSettings from the database.
            $.ajax({
                url: thiz.options.operationUriPrefix + "_bw/NewTenantFormsSettings",
                dataType: "json",
                contentType: "application/json",
                type: "Get"//,
                //timeout: thiz.options.ajaxTimeout
            }).done(function (result) {
                try {
                    if (result.message != 'SUCCESS') {
                        alert('ERROR xcx455476: ' + result.message);
                    } else {
                        debugger; // GET THIS CODE WORKING FOR FORMS<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

                        // This code just cleans up garbage. Get rid of it someday when things harden up. just making sure they all have a bwFormId.
                        thiz.options.ActiveForms = [];
                        for (var i = 0; i < result.value.length; i++) {
                            if (result.value[i].bwFormId) {
                                thiz.options.ActiveForms.push(result.value[i]);
                            }
                        }








                        //alert('This functionality is incomplete. Coming soon! In displayFormsConfigurationDialog().');
                        //debugger;
                        var isOpen = false;
                        var selectedRequestType = 'all';
                        var bwFormId;
                        try {
                            if ($('#divFormsConfigurationDialog').dialog('isOpen')) {
                                isOpen = true;
                                //$('#selectWorkflowRequestTypeDropDownInDialog2').find('option:selected').each(function (index, element) {
                                //    selectedRequestType = element.value;
                                //});
                                //var bwRequestType;
                                debugger;
                                var requestTypeDropdown = $(this.element).find('#selectRequestTypeDropDown')[0];
                                $(requestTypeDropdown).find('option:selected').each(function (index, element) {
                                    debugger;
                                    //selectedRequestType = element.value;
                                    bwFormId = element.value;
                                    selectedRequestType = element.text;
                                });
                            }
                        } catch (e) {
                            // do nothing.
                        }
                        if (isOpen == false) {
                            //debugger;
                            $('#divFormsConfigurationDialog').dialog({
                                modal: true,
                                resizable: false,
                                //position: 'right',
                                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                                width: '1200',
                                dialogClass: "no-close", // No close button in the upper right corner.
                                hide: false, // This means when hiding just disappear with no effects.
                                open: function () {
                                    $('.ui-widget-overlay').bind('click', function () {
                                        $("#divFormsConfigurationDialog").dialog('close');
                                    });

                                    $('#divFormsConfigurationDialog').dialog("option", "position", 'right');

                                    $.contextMenu({
                                        selector: '.context-menu-formsconfiguration',
                                        //trigger: 'hover',
                                        //    delay : 500,
                                        callback: function (key, options) {
                                            //var m = "clicked: " + key;
                                            //window.console && console.log(m) || alert(m);
                                            if (key == 'editformhtml') {
                                                //cmdDisplayArchivePageTrashbinContents();
                                                //alert('This functionality is incomplete. Coming soon! ')
                                                thiz.displayEditFormHtmlDialog('xcxdontknow123');
                                            }
                                        },
                                        items: {
                                            "editformhtml": {
                                                name: "Edit Form HTML", icon: "edit"
                                            }
                                        }
                                    });



                                }
                            });
                            //$("#divCreateANewRoleDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
                        }

                        // This can show up in a few places. On the "Configuration > Participants" page, in a modal dialog, etc.
                        //console.log('In displayWorkflowsConfigurationDialog().'); //' + elementId + ').');

                        var html = '';
                        //debugger;
                        //$.ajax({
                        //    url: thiz.options.operationUriPrefix + + "_bw/NewTenantFormsSettings", // "odata/FormsConfiguration3/" + thiz.options.bwTenantId + '/' + thiz.options.bwWorkflowAppId + '/' + selectedRequestType, //'all', //thiz.options.LastSelectedRequestType, //'budgetrequest', //
                        //    dataType: "json",
                        //    contentType: "application/json",
                        //    type: "Get"//,
                        //   // timeout: thiz.options.ajaxTimeout
                        //}).done(function (result) {
                        //    try {

                        //debugger;
                        //if (result.message != 'SUCCESS') {
                        //    alert('ERROR');
                        //} else {


                        var html = '';
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
                        html += '.alternatingRowDark:hover { background-color:lightgoldenrodyellow; }'; // 
                        html += '.roleName { white-space:nowrap; }';
                        html += '</style>';

                        // File folder UI.
                        html += '<table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                        html += '  <tr>';
                        html += '    <td>';
                        //
                        html += '<br />';
                        html += '<div class="codeSnippetContainer" id="code-snippet-4" xmlns="">';
                        html += '    <div class="codeSnippetContainerTabs">';
                        html += '        <div class="codeSnippetContainerTabSingle" dir="ltr"><a>&nbsp;&nbsp;Forms&nbsp;&nbsp;</a></div>';
                        html += '    </div>';
                        html += '    <div class="codeSnippetContainerCodeContainer">';
                        html += '        <div class="codeSnippetToolBar">';
                        html += '            <div class="codeSnippetToolBarText">';
                        html += '                <a name="CodeSnippetCopyLink" title="Copy to clipboard." style="display: none;" href="javascript:displayAlertDialog(\'Copy support is not yet implemented.\');">Copy</a>';
                        html += '            </div>';
                        html += '        </div>';
                        html += '        <div class="codeSnippetContainerCode" id="CodeSnippetContainerCode_5207fb9c-60fd-402f-8729-5795651a5ad3" dir="ltr">';
                        html += '            <div>';
                        html += '                <span id="spanBwParticipantsConfiguration" style="font-size:x-small;">';
                        // end File folder UI top section.

                        html += '<table class="dataGridTable">';

                        html += '  <tr style="font-size:10pt;font-weight:normal;color:black;">';
                        html += '    <td></td>';
                        html += '    <td colspan="9">';
                        html += '       <span style="padding: 4px 4px 4px 4px;border:1px solid lightblue;cursor:pointer;" onclick="$(\'.bwFormsEditor_NewTenant\').bwFormsEditor_NewTenant(\'cmdDisplayDeleteFormsDialog\');">';
                        html += '           <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png">&nbsp;Delete';
                        html += '       </span>';
                        html += '    </td>';
                        html += '  </tr>';

                        html += '  <tr class="headerRow">';
                        html += '    <td><input type="checkbox" id="checkboxTogglePendingEmailCheckboxes" onchange="$(\'.bwFormsEditor_NewTenant\').bwFormsEditor_NewTenant(\'toggleFormConfigurationCheckboxes\', this);" /></td>';
                        html += '    <td>Request Type</td>';
                        html += '    <td>Active</td>';
                        html += '    <td>^Created Date</td>';
                        html += '    <td>Created By</td>';
                        html += '    <td>Last Modified Date</td>';
                        html += '    <td>Last Modified By</td>';
                        html += '    <td>Description</td>';
                        html += '    <td>bwFormHtml</td>';
                        html += '    <td></td>';
                        html += '    <td></td>';
                        html += '  </tr>';
                        var alternatingRow = 'light'; // Use this to color the rows.
                        debugger;
                        for (var i = 0; i < thiz.options.ActiveForms.length; i++) {
                            if (alternatingRow == 'light') {
                                html += '  <tr class="alternatingRowLight" style="cursor:pointer;" >';
                                alternatingRow = 'dark';
                            } else {
                                html += '  <tr class="alternatingRowDark" style="cursor:pointer;" >';
                                alternatingRow = 'light';
                            }
                            var isTheActiveWorkflow = Boolean(thiz.options.ActiveForms[i].bwFormActive);
                            if (thiz.options.ActiveForms[i].bwFormActive == true) {
                                html += '    <td><input disabled="" type="checkbox" class="formCheckbox" bwFormId="' + thiz.options.ActiveForms[i].bwFormId + '" /></td>';
                            } else {
                                html += '    <td><input type="checkbox" class="formCheckbox" bwFormId="' + thiz.options.ActiveForms[i].bwFormId + '" /></td>';
                            }

                            html += '       <td class="roleId">' + thiz.options.ActiveForms[i].bwRequestType + '</td>';
                            if (thiz.options.ActiveForms[i].bwFormActive == true) {
                                html += '       <td class="roleName" style="color:green;">✔ ' + thiz.options.ActiveForms[i].bwFormActive + '</td>';
                            } else {
                                html += '       <td class="roleName" style="color:gray;">' + thiz.options.ActiveForms[i].bwFormActive + '</td>';
                            }
                            html += '       <td class="roleDetails">' + thiz.options.ActiveForms[i].Created + '</td>';
                            html += '       <td class="roleDetails">' + thiz.options.ActiveForms[i].CreatedByFriendlyName + '</td>';
                            html += '       <td class="roleDetails">' + thiz.options.ActiveForms[i].Modified + '</td>';
                            html += '       <td class="roleDetails">' + thiz.options.ActiveForms[i].ModifiedByFriendlyName + '</td>';
                            html += '       <td class="roleDetails">' + thiz.options.ActiveForms[i].bwFormId + '</td>';

                            if (thiz.options.ActiveForms[i].bwFormHtml) {
                                html += '       <td class="roleDetails">Ok</td>';
                            } else {
                                html += '<td></td>';
                            }

                            //if (result.value[i].bwWorkflowActive == true) {
                            //    html += '   <td></td>';
                            //} else {
                            html += '   <td><input style="padding:5px 10px 5px 10px;width:100px;" id="btnActivateRaciConfiguration" type="button" value="Activate" onclick="$(\'.bwFormsEditor_NewTenant\').bwFormsEditor_NewTenant(\'displayActivateSelectedFormDialog\', \'' + thiz.options.ActiveForms[i].bwFormId + '\');" /></td>'; // thiz.options.LastSelectedRequestType
                            //}

                            html += '   <td><input style="padding:5px 10px 5px 10px;width:100px;" type="button" value="Edit HTML" onclick="$(\'.bwFormsEditor_NewTenant\').bwFormsEditor_NewTenant(\'displayEditFormHtmlDialog\', \'' + thiz.options.ActiveForms[i].bwFormId + '\');" /></td>';



                            html += '</tr>';
                        }
                        html += '</table>';

                        // File folder UI bottom section.
                        html += '<br />';
                        html += '                </span>';
                        html += '            </div>';
                        html += '        </div>';
                        html += '    </div>';
                        html += '</div>';
                        html += '<br />';
                        html += '    </td>';
                        html += '  </tr>';
                        html += '</table>';
                        // end File folder UI bottom section.

                        html += '<div style="display:none;" id="divDeleteFormsDialog">';
                        html += '   <table style="width:100%;">';
                        html += '       <tr>';
                        html += '           <td style="width:90%;">';
                        html += '               <span id="spanDeleteFormsDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;font-weight:bold;">Delete Forms</span>';
                        html += '           </td>';
                        html += '           <td style="width:9%;"></td>';
                        html += '           <td style="width:1%;cursor:pointer;vertical-align:top;">';
                        html += '               <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 30pt;font-weight:bold;" onclick="$(\'#divDeleteFormsDialog\').dialog(\'close\');">X</span>';
                        html += '           </td>';
                        html += '       </tr>';
                        html += '   </table>';
                        html += '   <br /><br />';
                        html += '   <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
                        html += '   <span id="spanDeleteFormsDialogContentText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 20pt;">';
                        html += '[spanDeleteFormsDialogContentText]';
                        html += '   </span>';
                        html += '   <br /><br /><br />';
                        html += '   <div class="divSignInButton" onclick="$(\'.bwFormsEditor_NewTenant\').bwFormsEditor_NewTenant(\'deleteSelectedForms\');" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;">';
                        html += '       Delete the Forms';
                        html += '   </div>';
                        html += '   <br /><br />';
                        html += '   <div class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em; font-weight: bold;" onclick="$(\'#divDeleteFormsDialog\').dialog(\'close\');">';
                        html += '       Cancel';
                        html += '   </div>';
                        html += '   <br /><br />';
                        html += '</div>';

                        document.getElementById('spanFormsMaintenanceDialogContent').innerHTML = html;
                        //}
                        //    } catch (e) {
                        //        console.log('Exception in displayFormsConfigurationDialog().done: ' + e.message + ', ' + e.stack);
                        //        alert('Exception in displayFormsConfigurationDialog().done: ' + e.message + ', ' + e.stack);
                        //    }
                        //}).fail(function (data, errorCode) {

                        //    //lpSpinner.Hide();
                        //    console.log(' : ' + JSON.stringify(data));
                        //    var msg;
                        //    if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                        //        msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                        //    } else {
                        //        msg = JSON.stringify(data);
                        //    }
                        //    alert('Exception in displayFormsConfigurationDialog().xx.Get: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                        //    console.log('Exception in displayFormsConfigurationDialog().xx.Get: ' + JSON.stringify(data));
                        //    //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                        //    //var error = JSON.parse(data.responseText)["odata.error"];
                        //    //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
                        //});










                    }
                } catch (e) {
                    //lpSpinner.Hide();
                    console.log('Exception in bwFormsEditor_NewTenant._create().Get.NewTenantFormsSettings.done():1: ' + e.message + ', ' + e.stack);
                }
            }).fail(function (data) {
                //lpSpinner.Hide();
                //debugger;
                //console.log('In xx.fail(): ' + JSON.stringify(data));
                var msg;
                if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                    msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                } else {
                    msg = JSON.stringify(data);
                }
                alert('Error in bwFormsEditor_NewTenant._create().Get.NewTenantFormsSettings.fail(): ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                console.log('Error in bwFormsEditor_NewTenant._create().Get.NewTenantFormsSettings.fail ' + JSON.stringify(data));
                //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                //var error = JSON.parse(data.responseText)["odata.error"];
                //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
            });









        } catch (e) {
            console.log('Exception in displayFormsConfigurationDialog(): ' + e.message + ', ' + e.stack)
        }
    },

    displayOfflineFormsConfigurationDialog: function () {
        try {
            console.log('In displayOfflineFormsConfigurationDialog().');
            alert('This functionality is incomplete. Coming soon! In displayOfflineFormsConfigurationDialog().');
            //debugger;
            //var isOpen = false;
            //var selectedRequestType = 'offlinerequest';
            //try {
            //    if ($('#divFormsConfigurationDialog').dialog('isOpen')) {
            //        isOpen = true;
            //        //$('#selectWorkflowRequestTypeDropDownInDialog2').find('option:selected').each(function (index, element) {
            //        //    selectedRequestType = element.value;
            //        //});
            //        //var bwRequestType;
            //        debugger;
            //        var requestTypeDropdown = $(this.element).find('#selectRequestTypeDropDown')[0];
            //        $(requestTypeDropdown).find('option:selected').each(function (index, element) {
            //            debugger;
            //            selectedRequestType = element.value;
            //        });
            //    }
            //} catch (e) {
            //    // do nothing.
            //}
            //if (isOpen == false) {
            //debugger;
            $('#divFormsConfigurationDialog').dialog({
                modal: true,
                resizable: false,
                //position: 'right',
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                width: '1200',
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {
                    $('.ui-widget-overlay').bind('click', function () {
                        $("#divFormsConfigurationDialog").dialog('close');
                    });

                    $('#divFormsConfigurationDialog').dialog("option", "position", 'right');

                    $.contextMenu({
                        selector: '.context-menu-formsconfiguration',
                        //trigger: 'hover',
                        //    delay : 500,
                        callback: function (key, options) {
                            //var m = "clicked: " + key;
                            //window.console && console.log(m) || alert(m);
                            if (key == 'editformhtml') {
                                //cmdDisplayArchivePageTrashbinContents();
                                //alert('This functionality is incomplete. Coming soon! ')
                                thiz.displayEditFormHtmlDialog('xcxdontknow123');
                            }
                        },
                        items: {
                            "editformhtml": {
                                name: "Edit Form HTML", icon: "edit"
                            }
                        }
                    });



                }
            });
            //$("#divCreateANewRoleDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
            //}

            // This can show up in a few places. On the "Configuration > Participants" page, in a modal dialog, etc.
            //console.log('In displayWorkflowsConfigurationDialog().'); //' + elementId + ').');
            var thiz = this;
            var html = '';
            debugger;
            $.ajax({
                url: thiz.options.operationUriPrefix + "odata/FormsConfiguration3/" + thiz.options.bwTenantId + '/' + thiz.options.bwWorkflowAppId + '/' + 'offlinerequest', //'all', //thiz.options.LastSelectedRequestType, //'budgetrequest', //
                dataType: "json",
                contentType: "application/json",
                type: "Get",
                timeout: thiz.options.ajaxTimeout
            }).done(function (result) {
                try {

                    //debugger;
                    if (result.message != 'SUCCESS') {
                        alert('ERROR');
                    } else {


                        var html = '';
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
                        html += '.alternatingRowDark:hover { background-color:lightgoldenrodyellow; }'; // 
                        html += '.roleName { white-space:nowrap; }';
                        html += '</style>';

                        // File folder UI.
                        html += '<table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                        html += '  <tr>';
                        html += '    <td>';
                        //
                        html += '<br />';
                        html += '<div class="codeSnippetContainer" id="code-snippet-4" xmlns="">';
                        html += '    <div class="codeSnippetContainerTabs">';
                        html += '        <div class="codeSnippetContainerTabSingle" dir="ltr"><a>&nbsp;&nbsp;Forms&nbsp;&nbsp;</a></div>';
                        html += '    </div>';
                        html += '    <div class="codeSnippetContainerCodeContainer">';
                        html += '        <div class="codeSnippetToolBar">';
                        html += '            <div class="codeSnippetToolBarText">';
                        html += '                <a name="CodeSnippetCopyLink" title="Copy to clipboard." style="display: none;" href="javascript:displayAlertDialog(\'Copy support is not yet implemented.\');">Copy</a>';
                        html += '            </div>';
                        html += '        </div>';
                        html += '        <div class="codeSnippetContainerCode" id="CodeSnippetContainerCode_5207fb9c-60fd-402f-8729-5795651a5ad3" dir="ltr">';
                        html += '            <div>';
                        html += '                <span id="spanBwParticipantsConfiguration" style="font-size:x-small;">';
                        // end File folder UI top section.

                        html += '<table class="dataGridTable">';

                        html += '  <tr style="font-size:10pt;font-weight:normal;color:black;">';
                        html += '    <td></td>';
                        html += '    <td colspan="9">';
                        html += '       <span style="padding: 4px 4px 4px 4px;border:1px solid lightblue;cursor:pointer;" onclick="$(\'.bwFormsEditor_NewTenant\').bwFormsEditor_NewTenant(\'cmdDisplayDeleteFormsDialog\');">';
                        html += '           <img title="xDelete" style="cursor:pointer;" src="images/trash-can.png">&nbsp;Delete';
                        html += '       </span>';
                        html += '    </td>';
                        html += '  </tr>';

                        html += '  <tr class="headerRow">';
                        html += '    <td><input type="checkbox" id="checkboxTogglePendingEmailCheckboxes" onchange="$(\'.bwFormsEditor_NewTenant\').bwFormsEditor_NewTenant(\'toggleFormConfigurationCheckboxes\', this);" /></td>';
                        html += '    <td>Request Type</td>';
                        html += '    <td>Active</td>';
                        html += '    <td>^Created Date</td>';
                        html += '    <td>Created By</td>';
                        html += '    <td>Last Modified Date</td>';
                        html += '    <td>Last Modified By</td>';
                        html += '    <td>Description</td>';
                        html += '    <td>bwFormHtml</td>';
                        html += '    <td></td>';
                        html += '    <td></td>';
                        html += '  </tr>';
                        var alternatingRow = 'light'; // Use this to color the rows.
                        //debugger;
                        for (var i = 0; i < result.value.length; i++) {
                            if (alternatingRow == 'light') {
                                html += '  <tr class="alternatingRowLight" style="cursor:pointer;" >';
                                alternatingRow = 'dark';
                            } else {
                                html += '  <tr class="alternatingRowDark" style="cursor:pointer;" >';
                                alternatingRow = 'light';
                            }
                            var isTheActiveWorkflow = Boolean(result.value[i].bwFormActive);
                            if (result.value[i].bwFormActive == true) {
                                html += '    <td><input disabled="" type="checkbox" class="formCheckbox" bwFormId="' + result.value[i].bwFormId + '" /></td>';
                            } else {
                                html += '    <td><input type="checkbox" class="formCheckbox" bwFormId="' + result.value[i].bwFormId + '" /></td>';
                            }

                            html += '       <td class="roleId">' + result.value[i].bwRequestType + '</td>';
                            if (result.value[i].bwFormActive == true) {
                                html += '       <td class="roleName" style="color:green;">✔ ' + result.value[i].bwFormActive + '</td>';
                            } else {
                                html += '       <td class="roleName" style="color:gray;">' + result.value[i].bwFormActive + '</td>';
                            }
                            html += '       <td class="roleDetails">' + result.value[i].Created + '</td>';
                            html += '       <td class="roleDetails">' + result.value[i].CreatedByFriendlyName + '</td>';
                            html += '       <td class="roleDetails">' + result.value[i].Modified + '</td>';
                            html += '       <td class="roleDetails">' + result.value[i].ModifiedByFriendlyName + '</td>';
                            html += '       <td class="roleDetails">' + result.value[i].bwFormId + '</td>';

                            if (result.value[i].bwFormHtml) {
                                html += '       <td class="roleDetails">Ok</td>';
                            } else {
                                html += '<td></td>';
                            }

                            //if (result.value[i].bwWorkflowActive == true) {
                            //    html += '   <td></td>';
                            //} else {
                            html += '   <td><input style="padding:5px 10px 5px 10px;width:100px;" id="btnActivateRaciConfiguration" type="button" value="Activate" onclick="$(\'.bwFormsEditor_NewTenant\').bwFormsEditor_NewTenant(\'displayActivateSelectedFormDialog\', \'' + result.value[i].bwFormId + '\');" /></td>'; // thiz.options.LastSelectedRequestType
                            //}

                            html += '   <td><input style="padding:5px 10px 5px 10px;width:100px;" type="button" value="Edit HTML" onclick="$(\'.bwFormsEditor_NewTenant\').bwFormsEditor_NewTenant(\'displayEditFormHtmlDialog\', \'' + result.value[i].bwFormId + '\');" /></td>';



                            html += '</tr>';
                        }
                        html += '</table>';

                        // File folder UI bottom section.
                        html += '<br />';
                        html += '                </span>';
                        html += '            </div>';
                        html += '        </div>';
                        html += '    </div>';
                        html += '</div>';
                        html += '<br />';
                        html += '    </td>';
                        html += '  </tr>';
                        html += '</table>';
                        // end File folder UI bottom section.

                        html += '<div style="display:none;" id="divDeleteFormsDialog">';
                        html += '   <table style="width:100%;">';
                        html += '       <tr>';
                        html += '           <td style="width:90%;">';
                        html += '               <span id="spanDeleteFormsDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;font-weight:bold;">Delete Forms</span>';
                        html += '           </td>';
                        html += '           <td style="width:9%;"></td>';
                        html += '           <td style="width:1%;cursor:pointer;vertical-align:top;">';
                        html += '               <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 30pt;font-weight:bold;" onclick="$(\'#divDeleteFormsDialog\').dialog(\'close\');">X</span>';
                        html += '           </td>';
                        html += '       </tr>';
                        html += '   </table>';
                        html += '   <br /><br />';
                        html += '   <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
                        html += '   <span id="spanDeleteFormsDialogContentText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 20pt;">';
                        html += '[spanDeleteFormsDialogContentText]';
                        html += '   </span>';
                        html += '   <br /><br /><br />';
                        html += '   <div class="divSignInButton" onclick="$(\'.bwFormsEditor_NewTenant\').bwFormsEditor_NewTenant(\'deleteSelectedForms\');" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;">';
                        html += '       Delete the Forms';
                        html += '   </div>';
                        html += '   <br /><br />';
                        html += '   <div class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em; font-weight: bold;" onclick="$(\'#divDeleteFormsDialog\').dialog(\'close\');">';
                        html += '       Cancel';
                        html += '   </div>';
                        html += '   <br /><br />';
                        html += '</div>';

                        document.getElementById('spanFormsMaintenanceDialogContent').innerHTML = html;
                    }
                } catch (e) {
                    console.log('Exception in displayOfflineFormsConfigurationDialog().done: ' + e.message + ', ' + e.stack);
                    alert('Exception in displayOfflineFormsConfigurationDialog().done: ' + e.message + ', ' + e.stack);
                }
            }).fail(function (data, errorCode) {

                //lpSpinner.Hide();
                console.log(' : ' + JSON.stringify(data));
                var msg;
                if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                    msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                } else {
                    msg = JSON.stringify(data);
                }
                alert('Exception in displayOfflineFormsConfigurationDialog().xx.Get: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                console.log('Exception in displayOfflineFormsConfigurationDialog().xx.Get: ' + JSON.stringify(data));
                //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                //var error = JSON.parse(data.responseText)["odata.error"];
                //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
            });
        } catch (e) {
            console.log('Exception in displayOfflineFormsConfigurationDialog(): ' + e.message + ', ' + e.stack)
        }
    },

    publishFormConfigurationAndActivate: function () {
        //debugger;
        var thiz = this;
        try {
            console.log('In publishFormConfigurationAndActivate().');

            //debugger;
            //alert('In publishFormConfigurationAndActivate().');
            // Get "budgetrequestform" html.
            var bwFormHtml = $(this.element).find('#budgetrequestform')[0].innerHTML;

            // Strip out the "xdTableOffsetRow-editor" class from the form before saving it. This class provides the hover and drag/drop functionality needed by the "Form Editor".
            bwFormHtml = bwFormHtml.replace(/xdTableOffsetRow-editor/g, '');

            //debugger;

            // No warning box just save it.

            var bwFormId, bwRequestType;
            var requestTypeDropdown = $(this.element).find('#selectRequestTypeDropDown')[0];
            $(requestTypeDropdown).find('option:selected').each(function (index, element) {
                bwFormId = element.value;
                bwRequestType = element.text;
            });


            //debugger;
            //if (this.options.DisplayAsNewTenantUserConfigurationEditor == true) {
            // THIS IS WHERE WE PUBLISH TO THE NEWUSER/TENANT TABLE. 5-28-2020.
            debugger; // MAKE SURE THE bwFormId IS POPULATED!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<************************&&&&&&&&&&&&&&&&^^^^^^^^^^^^^^^^^^^^^^^<<<<<<<<<<<<<<<<<<<<<<<<<
            var json = {
                bwFormId: bwFormId,
                bwRequestType: bwRequestType,
                bwFormHtml: bwFormHtml
            };
            $.ajax({
                url: thiz.options.operationUriPrefix + "_bw/PublishNewTenantFormsDefault",
                type: "Post",
                timeout: thiz.options.ajaxTimeout,
                data: json,
                headers: {
                    "Accept": "application/json; odata=verbose"
                }
            }).success(function (result) {
                try {
                    debugger;
                    if (result.message != 'SUCCESS') {
                        alert('ERROR: ' + result.message);
                    } else {
                        console.log('In PublishNewTenantBusinessModelDefault().post: Successfully updated DB. result: ' + JSON.stringify(result));


                        // Update the draftform so the publish button goes away.
                        // 
                        var html1 = $(thiz.element).find('#budgetrequestform')[0].innerHTML;
                        thiz.options.CurrentForm.DraftForm = html1;
                        thiz.options.CurrentForm.Form = html1;
                        thiz.checkIfWeHaveToDisplayThePublishChangesButton();


                        $("#divUndoFormActivationDialog").dialog({
                            modal: true,
                            resizable: false,
                            //closeText: "Cancel",
                            closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                            //title: 'Project Type picker',
                            width: '800',
                            dialogClass: 'no-close', // No close button in the upper right corner.
                            hide: false, // This means when hiding just disappear with no effects.
                            open: function () {
                                $('.ui-widget-overlay').bind('click', function () {
                                    $('#divUndoFormActivationDialog').dialog('close');
                                });

                                // re-sync this.options.store
                                //thiz.options.CurrentEmailTemplate.EmailTemplate = JSON.parse(JSON.stringify(json));
                                //thiz.options.CurrentEmailTemplate.DraftEmailTemplate = JSON.parse(JSON.stringify(json));
                                //thiz.checkIfWeHaveToDisplayThePublishChangesButton();

                            },
                            close: function () {
                                $('#divUndoFormActivationDialog').dialog("destroy");
                                //    //thiz._create(); // When the user closes this dialog, we regenerate the screen to reflect the newly created and activated workflow. <<< NOT NECESSARY!!!! ONLY USING FOR TESTING.
                                //    debugger;
                                //    thiz.checkIfWeHaveToDisplayThePublishChangesButton();
                            }
                        });
                        $('#divUndoFormActivationDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();
                    }

                } catch (e) {
                    console.log('Exception in PublishNewTenantBusinessModelDefault().xx.update: ' + e.message + ', ' + e.stack);
                    alert('Exception in PublishNewTenantBusinessModelDefault().xx.update: ' + e.message + ', ' + e.stack);
                }
            }).error(function (data, errorCode, errorMessage) {
                debugger;
                //thiz.hideProgress();
                var msg;
                if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                    msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                } else {
                    msg = JSON.stringify(data) + ', json: ' + JSON.stringify(json);
                }
                console.log('Fail in PublishNewTenantBusinessModelDefault().xx.update: ' + JSON.stringify(data) + ', json: ' + JSON.stringify(json));
                alert('Fail in PublishNewTenantBusinessModelDefault().xx.update: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                //var error = JSON.parse(data.responseText)["odata.error"];
                //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
            });


        } catch (e) {
            debugger;
            //thiz.hideProgress();
            alert('Exception in publishFormConfigurationAndActivate(): ' + e.message + ', ' + e.stack);
            console.log('Exception in publishFormConfigurationAndActivate(): ' + e.message + ', ' + e.stack);
        }
    },
    cancelChangesInDraftFormConfiguration: function () {
        try {
            console.log('In cancelChangesInDraftFormConfiguration().');
            this.options.CurrentForm["Form"] = this.options.CurrentForm["DraftForm"]; // Creating "DraftWorkflow" so we can tell if the workflow has been changed or not, and then inform the user that changes need to be published.
            this._create(); //renderFormsEditor(); // Definition is renderWorkflowEditor(assignmentRowChanged_ElementId).
        } catch (e) {
            console.log('Exception in cancelChangesInDraftFormConfiguration(): ' + e.message + ', ' + e.stack);
        }
    },
    checkIfWeHaveToDisplayThePublishChangesButton: function () {
        try {
            //debugger;
            console.log('In checkIfWeHaveToDisplayThePublishChangesButton().');

            if (!this.options.CurrentForm.Form) {
                alert('ERROR IN checkIfWeHaveToDisplayThePublishChangesButton: Form is not defined. ');
            }


            var thereHaveBeenChangesToTheForm = false;
            var oldJsonString = this.options.CurrentForm.Form;
            var newJsonString = this.options.CurrentForm.DraftForm;
            debugger;
            if (oldJsonString != newJsonString) {
                thereHaveBeenChangesToTheForm = true;
            }
            if (thereHaveBeenChangesToTheForm == true) {
                // The user has made changes to the workflow.
                //document.getElementById('spanThereAreChangesToPublishText').innerHTML = 'You have changes that won\'t be available until you publish: ';
                $(this.element).find('#spanThereAreChangesToPublishText')[0].innerHTML = 'You have changes that won\'t be available until you publish: ';
                var html = '';
                html += '<input style="padding:5px 10px 5px 10px;width:100px;" id="btnSaveWorkflowConfigurationAndActivate" type="button" value="Publish" onclick="$(\'.bwFormsEditor_NewTenant\').bwFormsEditor_NewTenant(\'publishFormConfigurationAndActivate\');" />';
                html += '&nbsp;<input style="padding:5px 10px 5px 10px;" id="btnCancelChangesInDraftWorkflowConfiguration" type="button" value="Cancel Changes" onclick="$(\'.bwFormsEditor_NewTenant\').bwFormsEditor_NewTenant(\'cancelChangesInDraftFormConfiguration\');" />';
                //document.getElementById('spanThereAreChangesToPublishButton').innerHTML = html;
                $(this.element).find('#spanThereAreChangesToPublishButton')[0].innerHTML = html;
            } else {
                // Do nothing because the user has made no changes to the workflow.
                $(this.element).find('#spanThereAreChangesToPublishText')[0].innerHTML = '';
                $(this.element).find('#spanThereAreChangesToPublishButton')[0].innerHTML = '';
            }
        } catch (e) {
            console.log('Exception in checkIfWeHaveToDisplayThePublishChangesButton(): ' + e.message + ', ' + e.stack);
        }
    },

    requestTypeDropDown_Onchange: function () {
        try {
            console.log('In requestTypeDropDown_Onchange().');
            var thiz = this;
            //var bwRequestType; // = 'budgetrequest'; // This is the default.
            //var requestTypeDropdown = $(this.element).find('#selectRequestTypeDropDown')[0];
            //$(requestTypeDropdown).find('option:selected').each(function (index, element) {
            //    //debugger;
            //    bwRequestType = element.value;
            //});

            //var html = '';
            ////html += '<div id="budgetrequestform" class="context-menu-newrequesteditor" align="left" bwbudgetrequestid="" bwrequesttype="' + bwRequestType + '">';

            //debugger;
            //var selectedFormIndex = -1;
            //for (var i = 0; i < this.options.ActiveForms.length; i++) {
            //    if (this.options.ActiveForms[i].bwRequestType == bwRequestType) {
            //        selectedFormIndex = i;
            //    }
            //}
            //if (selectedFormIndex == -1) {
            //    //html += 'ERROR: CANNOT FIND THE FORM FOR THIS SELECTED REQUEST TYPE IN THE DATABASE. This process cannot proceed. xcx2bwRequestType: ' + bwRequestType;
            //    html += '<table class="xdFormLayout" style="BORDER-TOP-STYLE: none; WORD-WRAP: break-word; BORDER-LEFT-STYLE: none; BORDER-COLLAPSE: collapse; TABLE-LAYOUT: fixed; BORDER-BOTTOM-STYLE: none; BORDER-RIGHT-STYLE: none; ">    <colgroup>        <col style="">    </colgroup>    <tbody>        <tr class="xdTableContentRow">            <td class="xdTableContentCell" style="display:block;BORDER-TOP: #d8d8d8 1pt solid; BORDER-RIGHT: #d8d8d8 1pt solid; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 0px; PADDING-TOP: 0px; PADDING-LEFT: 0px; BORDER-LEFT: #d8d8d8 1pt solid; PADDING-RIGHT: 0px">                <div></div>                <!--<span style="color:cornflowerblue;">Your currently selected budgeting network: BudgetWorkflow1</span>-->                <table style="width:100%;">                    <tbody><tr>                        <td colspan="4">                           <span id="divCreateRequestFormContent_requestOrgClickableBreadcrumb" style="color:purple;font-size:8pt;">[divCreateRequestFormContent_requestOrgClickableBreadcrumb]</span>                       </td>                    </tr>                    <tr>                        <td width="5"></td>                        <td>                   <span><img id="divCreateRequestFormContent_imgRequestOrgImage" style="width:100px;height:100px;" src="https://budgetworkflow.com/_files/6f308d4e-66fd-4e6f-925e-714b3135fef3/orgimages/root/orgimage.png">                   </span>                        </td>                        <td style="text-align:right;" colspan="2">                           &nbsp;&nbsp;<span class="xdlabel" id="spanRequestForm_Title">                               [spanRequestForm_Title]                           </span>                           <br>                           <span id="spanViewWorkflowParticipantsLink" style="text-decoration:underline;cursor:pointer;font-size:10pt;color:gray;" onclick="$(\'.bwRequest\').bwRequest(\'displayNewRequestWorkflowParticipantsDialog\', this);">View Workflow/Participants</span>                           <br>                           <span id="spanRequestForm_WorkflowAndRoleDetails">[spanRequestForm_WorkflowAndRoleDetails]</span>                           <span id="spanRequestForm_Checklists"></span>                        </td>                    </tr>                </tbody></table>                <div align="right">                    <span class="xdlabel">                        <em></em>                    </span>                </div>                <div align="right">                    <span class="xdlabel">                        <em>                            <font style="FONT-SIZE: 11pt">                                <span id="spanRequestForm_Instructions">[spanRequestForm_Instructionsxcx2]                                    &nbsp;                                </span>                            </font>                        </em>                    </span>                </div>                <div align="right">                    <span id="spanRequestForm_Buttons">                       [spanRequestForm_Buttons]                        &nbsp;                    </span>                </div>                <div align="right">                    <span title="" class="xdlabel" id="spanRequestForm_Error" style="color:tomato;" hidefocus="1">                        &nbsp;                    </span>                </div>                <div align="center">                    <span class="xdlabel"></span>                </div><div id="tableLeftTopRequestFormSection" style="display:inline-block;vertical-align:top;">                                        <div></div><div></div><div>                                               </div><table class="xdFormLayout xdTableStyleTwoCol" style="display:inline-block;border:1px solid aliceblue;width:765px;">                                            <colgroup>                                                <col style="WIDTH: 169px">                                                <col style="">                                            </colgroup>                                            <tbody valign="top">                                                <tr class="xdTableOffsetRow" id="trNewRequestRecurringExpenseSection" style="display:none;">                                                    <td class="xdTableOffsetCellLabel" style="text-align:left; BORDER-TOP: #d8d8d8 1pt; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px">                                                        <span class="xdlabel" id="spanNewRequestRecurringExpenseSectionTitle">Recurring expense:</span>                                                    </td>                                                    <td class="xdTableOffsetCellComponent" style="BORDER-TOP: #d8d8d8 1pt; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px">                                                        <!--<span id="spanNewRequestRecurringExpenseSecondSection"></span>-->                                                        <input disabled="" id="cbNewRequestRecurringExpenseSubmitImmediately" type="checkbox">                                                        <span style="font-size:10pt;color:lightgray;">Submit the first budget request immediately.</span>                                                        <br>                                                        <!--<span style="font-size:8pt;">This does not create the budget request, it only schedules the reminder for when the budget request should be submitted.</span>                                                        <br />-->                                                        <span style="font-size:10pt;">Reminder date:</span>                                                        <br>                                                        <input id="dtRecurringExpenseReminderDate" style="WIDTH: 60%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;TEXT-ALIGN: left;" type="text">                                                        <br>                                                        <span style="font-size:8pt;">You and the Manager will receive notifications prior to the reminder date so that you can initiate the next new request. Also, if anyone changes the date you will be notified.</span>                                                        <br>                                                    </td>                                                </tr>                                                <tr class="xdTableOffsetRow xdTableOffsetRow-editor" id="draggablerow_1" draggable="true" bwwidgetname="bwCommentsField">                            <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px">                                <span class="xdlabel">                                    Comments:                                </span>                               <span title="Select this asterick to make this a required field." class="ToggleRequiredAsterisk-Off" onclick="$(\'.bwFormsEditor\').bwFormsEditor(\'toggleFormRequiredField\', this);">*</span>                            </td>                            <td class="xdTableOffsetCellComponent" style="white-space:nowrap;text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px;">                                      <div>                                        <table width="100%">                                          <tbody><tr>                                            <td colspan="2">                                              <span title="" disabled="" class="xdTextBoxRequired" id="ReviewerComments" style="WORD-WRAP: break-word; HEIGHT: 90px; WHITE-SPACE: normal; OVERFLOW-X: auto; OVERFLOW-Y: auto; WIDTH: 100%;BACKGROUND-COLOR: white;" contenteditable="false" hidefocus="1" bwfieldname="ReviewerComments" bwdatatype="String" bwdatarequired="false" xd:datafmt="&quot;string&quot;,&quot;plainMultiline&quot;">                                              </span>                                            </td>                                          </tr>                                        </tbody></table>                                      </div>                            </td>                        </tr><tr class="xdTableOffsetRow xdTableOffsetRow-editor" draggable="true" bwwidgetname="bwDescriptionField" id="draggablerow_3">                            <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px">                                <span class="xdlabel">                                    Description:                                </span>                               <span title="Select this asterick to make this a required field." class="ToggleRequiredAsterisk-On" onclick="$(\'.bwFormsEditor\').bwFormsEditor(\'toggleFormRequiredField\', this);">*</span>                            </td>                            <td class="xdTableOffsetCellComponent" style="white-space:nowrap;text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px;">   <input disabled="" class="bwRequestJson" id="strProjectTitle" style="WIDTH: 100%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" contenteditable="false" onkeyup="$(\'.bwRequest\').bwRequest(\'editTextbox_OnKeyUp\', this);" type="text" bwfieldname="ProjectTitle" bwdatatype="string" bwdatarequired="true"> <!-- was 2.77em -->                            </td>                        </tr>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <tr>                                                    <td colspan="2">                                                        <span id="BudgetRequestId" style="visibility:hidden;display:none;"></span>                                                        <span id="RecurringExpenseId" style="visibility:hidden;display:none;"></span>                                                        <span id="OfflineRequestBudgetRequestId" style="visibility:hidden;display:none;"></span>                                                        <span id="OfflineRequestRecurringExpenseId" style="visibility:hidden;display:none;"></span>                                                    </td>                                                </tr>                                                                                                                                                                                                                                                                                                                                                                                         </tbody></table></div>                       <table style="width:665px;">                                               <tbody>                                                                                                                                 </tbody></table>           </td>       </tr>   </tbody></table>';

            //} else {
            //    var elementId = 'divFormsEditor'; //'xcxFormsEditorElementId'; // divFormsEditor
            //    html += this.options.ActiveForms[selectedFormIndex].bwFormHtml;
            //    html = html.replace("$('.bwRequest').bwRequest('displayNewRequestWorkflowParticipantsDialog', 'xcxElementId');", "$('.bwRequest').bwRequest('displayNewRequestWorkflowParticipantsDialog', '" + elementId + "');");

            //}
            //$(this.element).find('#budgetrequestform')[0].innerHTML = html;
            debugger;

            var promise = thiz.getRequestFormHtml(); //'divFormsEditor'); //'xcxFormsEditorElementId');
            //var promise = thiz.getRequestFormHtml('divFormsEditor');
            promise.then(function (html) {
                try {
                    debugger;
                    thiz.options.CurrentForm.Form = html;
                    thiz.options.CurrentForm.DraftForm = html;

                    $(thiz.element).find('#budgetrequestform')[0].innerHTML = html;
                    //thiz.renderFormsEditor(); // Render the forms editor.



                    // TODD ADDED 11-22-2021 NOT sure if this is the best way to do this and it is probably still buggy. :/
                    var draggableRows = $(thiz.element).find('.xdTableOffsetRow');
                    var offset = 0;
                    if (draggableRows && draggableRows.length && draggableRows.length > 0) {
                        offset = draggableRows.length + 1;
                    }
                    console.log('thiz.element draggableRows (xdTableOffsetRow): ' + draggableRows.length);
                    for (var i = 0; i < draggableRows.length; i++) {
                        if (draggableRows[i].style.display != 'none') {
                            var x = i + offset;
                            draggableRows[i].id = 'draggablerow_' + x; // Our approach requires id's.
                            draggableRows[i].classList.add('xdTableOffsetRow-editor'); // This gives us the hover style etc. which help out with the drag and drop.
                            draggableRows[i].draggable = 'true';
                            draggableRows[i].addEventListener('dragstart', thiz.onDragStart, false);
                            draggableRows[i].addEventListener('dragover', thiz.onDragOver, false);
                            draggableRows[i].addEventListener('drop', thiz.onDrop, false);
                        }
                    }

                    //var draggableRows = $('#FormsEditorToolbox').find('.xdTableOffsetRow');
                    //console.log('FormsEditorToolbox draggableRows (xdTableOffsetRow): ' + draggableRows.length);
                    //for (var i = 0; i < draggableRows.length; i++) {
                    //    if (draggableRows[i].style.display != 'none') {
                    //        draggableRows[i].id = 'toolboxdraggablerow_' + i; // Our approach requires id's.
                    //        draggableRows[i].classList.add('xdTableOffsetRow-editor'); // This gives us the hover style etc. which help out with the drag and drop.
                    //        draggableRows[i].draggable = 'true';
                    //        draggableRows[i].addEventListener('dragstart', thiz.onDragStart, false);
                    //        draggableRows[i].addEventListener('dragover', thiz.onDragOver, false);
                    //        draggableRows[i].addEventListener('drop', thiz.onDrop_FromToolbox, false);
                    //    }
                    //}








                    


                    var form = $(thiz.element).find('#budgetrequestform')[0];
                    var draggableRows = $(form).find('.xdTableOffsetRow'); //getElementsByClassName('xdTableOffsetRow');
                    console.log('In requestTypeDropDown_Onchange(). draggableRows (xdTableOffsetRow): ' + draggableRows.length);
                    for (var i = 0; i < draggableRows.length; i++) {
                        if (draggableRows[i].style.display != 'none') {
                            draggableRows[i].id = 'draggablerow_' + i; // Our approach requires id's.
                            draggableRows[i].classList.add('xdTableOffsetRow-editor'); // This gives us the hover style etc. which help out with the drag and drop.
                            draggableRows[i].draggable = 'true';
                            //debugger; // onDragStart xcx6
                            draggableRows[i].addEventListener('dragstart', this.onDragStart, false);
                            draggableRows[i].addEventListener('dragover', this.onDragOver, false);
                            debugger; // onDrop xcx5
                            draggableRows[i].addEventListener('drop', this.onDrop, false);
                        }
                    }

                } catch (e) {
                    console.log('Exception in bwFormsEditor_NewTenant._create().NewTenantFormsSettings.done():2: ' + e.message + ', ' + e.stack);
                }
            });





            

            

        } catch (e) {
            console.log('Exception in requestTypeDropDown_Onchange(): ' + e.message + ', ' + e.stack);
            $(this.element).find('#budgetrequestform')[0].innerHTML = 'Exception in requestTypeDropDown_Onchange(): ' + e.message + ', ' + e.stack;
        }
    },

    displayActivateSelectedFormDialog: function (bwFormId, bwRequestType) {
        try {
            console.log('In displayActivateSelectedFormDialog(). bwFormId: ' + bwFormId + ', bwRequestType: ' + bwRequestType);
            $('#divActivateSelectedFormDialog').dialog({
                modal: true,
                resizable: false,
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                width: '550',
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {
                    $('.ui-widget-overlay').bind('click', function () {
                        $("#divActivateSelectedFormDialog").dialog('close');
                    });
                    debugger;
                    //if (bwRequestType) {
                    //    // do nothing.
                    //} else {
                    var selectedRequestType;
                    $('#selectFormsRequestTypeDropDownInDialog2').find('option:selected').each(function (index, element) {
                        selectedRequestType = element.value;
                    });
                    //bwRequestType = selectedRequestType;
                    //}
                    //debugger;
                    //$('#selectFormsRequestTypeDropDownInDialog2 option[value="' + selectedRequestType + '"]').attr('selected', 'selected');
                    debugger; // check the values for bwRequestType to make sure they are there!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                    var html = '';
                    html += '        <div id="divActivateSelectedFormDialogReassignTasks" class="divSignInButton" onclick="$(\'.bwFormsEditor_NewTenant\').bwFormsEditor_NewTenant(\'activateSelectedForm\', \'' + bwFormId + '\', \'' + selectedRequestType + '\');" style="width:90%;text-align:center;line-height:0.8em;font-weight:bold;">';
                    html += '            Activate';
                    html += '        </div>';
                    document.getElementById('spanActivateSelectedFormButton').innerHTML = html;
                    //document.getElementById('txtCreateANewRoleDialog_RoleId').value = document.getElementById('textNewRoleId').value;
                    //document.getElementById('txtCreateANewRoleDialog_RoleName').value = document.getElementById('textNewRoleName').value;
                }
            });
            //$("#divActivateSelectedFormDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
        } catch (e) {
            console.log('Exception in displayActivateSelectedFormDialog(): ' + e.message + ', ' + e.stack);
        }
    },
    displayEditFormHtmlDialog: function (bwFormId) {
        try {
            console.log('In displayEditFormHtmlDialog(). bwFormId: ' + bwFormId);
            var thiz = this;
            $("#divDisplayHtmlDialog").dialog({
                modal: true,
                resizable: false,
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                width: '800',
                dialogClass: 'no-close', // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {
                    $('.ui-widget-overlay').bind('click', function () {
                        $('#divDisplayHtmlDialog').dialog('close');
                    });
                    document.getElementById('spanDisplayHtmlDialogTitle').innerHTML = 'Edit Form HTML';
                    document.getElementById('spanDisplayHtmlDialogContent').innerHTML = 'Form: ' + bwFormId;

                    document.getElementById('btnRunDiagnostics').innerHTML = '<span style="font-size:30pt;">⚠ Save/Update Form HTML</span>';
                    $('#btnRunDiagnostics').bind('click', function () {

                        // This is where we validate the JSON and save it back to the database, activating the new workflow JSON/Definition.
                        //var bwWorkflowJson = document.getElementById('txtDisplayJsonDialogJSON').value;
                        //var validJson = true;
                        //try {
                        //    var json2 = JSON.parse(bwWorkflowJson);
                        //} catch (e) {
                        //    validJson = false;
                        //}
                        //if (validJson != true) {
                        //    alert('INVALID JSON. Cannot proceed.');

                        //} else {
                        //alert('VALID JSON');
                        if (confirm("Are you certain you wish to activate this form? Save a copy in notepad in case something goes wrong!")) {
                            // Send JSON to the database for this workflow. // json
                            alert('This code is commented out. Please put it back!');
                            //debugger;
                            //var json = {
                            //    bwTenantId: thiz.options.bwTenantId,
                            //    bwWorkflowAppId: thiz.options.bwWorkflowAppId,
                            //    bwWorkflowId: bwWorkflowId,
                            //    ModifiedByFriendlyName: participantFriendlyName,
                            //    ModifiedById: participantId,
                            //    ModifiedByEmail: participantEmail,
                            //    Description: '',
                            //    bwWorkflowJson: bwWorkflowJson
                            //};
                            //$.ajax({
                            //    url: thiz.options.operationUriPrefix + "odata/publishworkflow2", // ???????????????????????????????????????????????????????????????????????????????????????????????????
                            //    type: "Post",
                            //    timeout: thiz.options.ajaxTimeout,
                            //    data: json,
                            //    headers: {
                            //        "Accept": "application/json; odata=verbose"
                            //    }
                            //}).success(function (result) {
                            //    try {
                            //        //debugger;
                            //        if (result == 'SUCCESS') {
                            //            console.log('In bwWorkflowEditor.js.displayEditWorkflowJsonDialog().post: Successfully updated DB. result: ' + JSON.stringify(result)); // using (' + JSON.stringify(json) + ').');
                            //            alert('In bwWorkflowEditor.js.displayEditWorkflowJsonDialog().post: Successfully updated DB.');
                            //        } else {
                            //            thiz.displayAlertDialog('Error in displayEditWorkflowJsonDialog(): ' + result);
                            //        }

                            //    } catch (e) {
                            //        console.log('Exception in bwWorkflowEditor.js.displayEditWorkflowJsonDialog().xx.update: ' + e.message + ', ' + e.stack);
                            //        alert('Exception in bwWorkflowEditor.js.displayEditWorkflowJsonDialog().xx.update: ' + e.message + ', ' + e.stack);
                            //    }
                            //}).error(function (data, errorCode, errorMessage) {
                            //    debugger;
                            //    //thiz.hideProgress();
                            //    var msg;
                            //    if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                            //        msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                            //    } else {
                            //        msg = JSON.stringify(data) + ', json: ' + JSON.stringify(json);
                            //    }
                            //    console.log('Fail in bwWorkflowEditor.js.displayEditWorkflowJsonDialog().xx.update: ' + JSON.stringify(data) + ', json: ' + JSON.stringify(json));
                            //    alert('Fail in bwWorkflowEditor.js.displayEditWorkflowJsonDialog().xx.update: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                            //    //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                            //    //var error = JSON.parse(data.responseText)["odata.error"];
                            //    //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
                            //});






                        }
                        //}
                    });

                    //debugger; // THIS WEB SERVICE DOESN'T EXIST YET! Copy from odata/WorkflowConfiguration4/
                    $.ajax({
                        url: thiz.options.operationUriPrefix + "odata/NewTenantFormConfiguration4/" + bwFormId,
                        dataType: "json",
                        contentType: "application/json",
                        type: "Get",
                        timeout: thiz.options.ajaxTimeout
                    }).done(function (result) {
                        try {
                            debugger;

                            var html = result.value[0].bwFormHtml;

                            $('#txtDisplayHtmlDialogDesign').empty();
                            $('#txtDisplayHtmlDialogDesign').append(html);


                            // This is how we display the actual HTML, not the rendered HTML.
                            html = html.replace(/</ig, '&lt;').replace(/>/ig, '&gt;'); // This is how we display the actual HTML, not the rendered HTML.

                            $('#txtDisplayHtmlDialogHTML').empty();
                            $('#txtDisplayHtmlDialogHTML').append(html);

                        } catch (e) {
                            console.log('Exception in displayEditFormHtmlDialog().done: ' + e.message + ', ' + e.stack);
                        }
                    }).fail(function (data, errorCode) {

                        //lpSpinner.Hide();
                        console.log(' : ' + JSON.stringify(data));
                        var msg;
                        if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                            msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                        } else {
                            msg = JSON.stringify(data);
                        }
                        alert('Exception in displayEditFormHtmlDialog().xx.Get: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                        console.log('Exception in displayEditFormHtmlDialog().xx.Get: ' + JSON.stringify(data));
                        //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                        //var error = JSON.parse(data.responseText)["odata.error"];
                        //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
                    });
                },
                close: function () {
                    //$('#divDisplayJsonDialog').dialog('destroy');
                }
            });
            //$('#divConfigureJsonAndUploadDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();
        } catch (e) {
            console.log('Exception in displayEditFormHtmlDialog(): ' + e.message + ', ' + e.stack);
        }
    },

    selectViewFormDesignOrHtml_Onchange: function () {
        try {
            console.log('In selectViewFormDesignOrHtml_Onchange().');
            //var checkedValue = document.getElementsByName('selectOrganizationWorkflowOrRolesView').checked; //('#selectOrganizationWorkflowOrRolesView option:checked').val();
            //alert('In selectOrganizationWorkflowOrRolesView_Onchange(). selectedValue: ' + selectedValue);
            if (document.getElementById('selectViewFormDesignOrHtml_ViewHtml').checked == true) {
                //debugger;
                //this.renderWorkflowPeoplePicker('spanWorkflowPeoplePicker_right');
            } else if (document.getElementById('selectViewFormDesignOrHtml_ViewDesign').checked == true) {
                //debugger;
                //this.renderRolesPeoplePicker('spanWorkflowPeoplePicker_right');
            }
        } catch (e) {
            console.log('Exception in selectViewFormDesignOrHtml_Onchange(): ' + e.message + ', ' + e.stack);
        }
    },

    displayAlertDialog: function (errorMessage) {
        try {
            //debugger;
            var element = $("#divAlertDialog");

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
                    //debugger;
                    var element2 = $(this).find('#spanErrorMessage')[0]; //
                    element2.innerHTML = errorMessage;
                    //$('#spanErrorMessage').innerHTML = errorMessage;
                },
                close: function () {
                    //$(this).dialog('destroy').remove();
                }
            });
            $(element).dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
        } catch (e) {
            console.log('Exception in bwFormsEditor_NewTenant.displayAlertDialog(): ' + e.message + ', ' + e.stack);
        }
    }

});