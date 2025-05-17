$.widget("bw.bwPillarTypeEditor", {
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
        This is the bwPillarTypeEditor.js jQuery Widget. 
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

        pillarTypes: null,

        autoSenseDeviceType: false // Automatic UI based on device type. Alpha version so far.
    },
    _create: function (assignmentRowChanged_ElementId) {
        this.element.addClass("bwPillarTypeEditor");
        var thiz = this; // Need this because of the asynchronous operations below.
        //debugger;
        try {

            selfDiscoverOperationUri(thiz); // This sets this.options.operationUriPrefix correctly.

            var tenantId = $('.bwAuthentication').bwAuthentication('option', 'tenantId');
            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            //var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            //var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
            //var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

            // 
            // Load this object first so we don't have to keep making web service calls.
            //
            if (this.options.pillarTypes != null) {
                this.renderPillarTypeEditor();
            } else {
                $.ajax({
                    url: this.options.operationUriPrefix + "odata/PillarTypes/" + workflowAppId + "/true", //
                    dataType: "json",
                    contentType: "application/json",
                    type: "Get",
                    timeout: this.options.ajaxTimeout
                }).done(function (result) {
                    try {
                        //debugger;
                        if (result.message != 'SUCCESS') {
                            var html = '';
                            html += '<span style="font-size:24pt;color:red;">bwPillarTypeEditor: CANNOT RENDER</span>';
                            html += '<br />';
                            html += '<span style="">Error in bwPillarTypeEditor.Create(): ' + result.message + '</span>';
                            thiz.element.html(html);
                        } else {
                            //debugger;
                            thiz.options.pillarTypes = result.PillarTypes;
                            thiz.renderPillarTypeEditor();
                        }
                    } catch (e) {
                        console.log('Exception in bwPillarTypeEditor._create().xx.Get:1: ' + e.message + ', ' + e.stack);
                    }

                }).fail(function (data) {
                    //lpSpinner.Hide();
                    debugger;
                    console.log('In bwPillarTypeEditor._create.PillarTypes.fail(): ' + JSON.stringify(data));
                    var msg;
                    if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                        msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                    } else {
                        msg = JSON.stringify(data);
                    }
                    alert('Exception in bwPillarTypeEditor._create().xx.Get:2: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                    console.log('Exception in bwPillarTypeEditor._create().xx.Get:2: ' + JSON.stringify(data));
                    //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                    //var error = JSON.parse(data.responseText)["odata.error"];
                    //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
                });
            }
        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">bwPillarTypeEditor: CANNOT RENDER</span>';
            html += '<br />';
            html += '<span style="">Exception in bwPillarTypeEditor.Create(): ' + e.message + ', ' + e.stack + '</span>';
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

    renderPillarTypeEditor: function () {
        try {
            console.log('In renderPillarTypeEditor().');
            var thiz = this;
            var html = '';

            html += '<div style="display:none;" id="divManagePillarTypeDialog">';
            html += '   <table style="width:100%;">';
            html += '       <tr>';
            html += '           <td style="width:90%;">';
            html += '               <span id="spanAddAnOrgItemDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;font-weight:bold;">[spanAddAnOrgItemDialogTitle]</span>';
            html += '           </td>';
            html += '           <td style="width:9%;"></td>';
            html += '           <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '               <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 30pt;font-weight:bold;" onclick="$(\'#divManagePillarTypeDialog\').dialog(\'close\');">X</span>';
            html += '           </td>';
            html += '       </tr>';
            html += '   </table>';
            html += '   <br /><br />';
            html += '   <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
            html += '   <span id="spanAddAnOrgItemDialogInvitationDescriptionText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 20pt;"></span>';
            html += '   <span style="font-family: calibri;">Name</span>';
            html += '   <br />';
            html += '   <input type="text" id="txtManagePillarTypeDialog_Name" style="WIDTH: 95%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" />';
            html += '   <br /><br />';
            html += '   <span style="font-family: calibri;">Abbreviation</span>';
            html += '   <br />';
            html += '   <input type="text" id="txtManagePillarTypeDialog_Abbreviation" style="width:25%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" />';
            html += '   <br /><br />';
            html += '   <span style="font-family: calibri;">Id</span>';
            html += '   <br />';
            html += '   <input id="txtManagePillarTypeDialog_Id" type="text" disabled style="WIDTH: 95%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" /><br />';
            html += '   <br /><br />';
            html += '   <span style="white-space:nowrap;"><input id="checkboxManagePillarTypeDialog_Active" type="checkbox" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" />Active</span>';
            html += '   <br /><br /><br />';
            html += '   <div id="divManagePillarTypeDialogSubmitButton" class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;">';
            html += '       Add the xx';
            html += '   </div>';
            html += '   <br /><br />';
            html += '   <div class="divSignInButton" style="width: 90%; text-align: center; line-height: 1.1em; font-weight: bold;" onclick="$(\'#divManagePillarTypeDialog\').dialog(\'close\');">';
            html += '       Close';
            html += '   </div>';
            html += '   <br /><br />';
            html += '</div>';



            //html += '<br /><br />';
            html += '<table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
            html += '  <tr>';
            html += '    <td>';
            //html += '        <span style="font-size:small;font-style:italic;">The title of the person responsible for completing the details of a New Request. This is displayed on the Budget Request forms. The default is "Manager".</span>';
            html += '    </td></tr>';
            html += '</table>';
            html += '<table>';
            html += '  <tr>';
            html += '    <td style="text-align:left;vertical-align:top;" class="bwSliderTitleCell">';
            html += '       Pillar Types:&nbsp;';
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

            html += '<table class="dataGridTable">';
            html += '  <tr class="headerRow">';
            html += '    <td>Abbreviation</td>';
            html += '    <td>Title</td>';
            html += '    <td>isActive</td>';
            html += '    <td>bwPillarTypeId</td>';
            html += '    <td></td>';
            html += '    <td></td>';
            html += '  </tr>';

            var alternatingRow = 'light'; // Use this to color the rows.
            //debugger;
            if (!thiz.options.pillarTypes) {
                html += '  <tr class="alternatingRowLight" style="cursor:pointer;">';
                html += '   <td colspan="5"><span style="color:tomato;">No data. Is the webservice responding correctly?</span></td>';
                html += '  </tr>';
            } else if (thiz.options.pillarTypes.length == 0) {
                html += '  <tr class="alternatingRowLight" style="cursor:pointer;">';
                html += '   <td colspan="4"><span style="color:tomato;">No pillar types exist in the database.</span></td>';
                html += '  </tr>';
            } else {
                for (var i = 0; i < thiz.options.pillarTypes.length; i++) {
                    if (alternatingRow == 'light') {
                        html += '  <tr class="alternatingRowLight" style="cursor:pointer;">';
                        alternatingRow = 'dark';
                    } else {
                        html += '  <tr class="alternatingRowDark" style="cursor:pointer;">';
                        alternatingRow = 'light';
                    }
                    html += '    <td>' + thiz.options.pillarTypes[i].Abbreviation + '</td>';
                    html += '    <td>' + thiz.options.pillarTypes[i].PillarType + '</td>';
                    html += '    <td>' + thiz.options.pillarTypes[i].isActive + '</td>';
                    html += '    <td>' + thiz.options.pillarTypes[i].bwPillarTypeId + '</td>';
                    html += '    <td><button class="BwSmallButton" onclick="$(\'.bwPillarTypeEditor\').bwPillarTypeEditor(\'editAPillarType\', \'' + thiz.options.pillarTypes[i].bwPillarTypeId + '\', \'' + thiz.options.pillarTypes[i].PillarType + '\', \'' + thiz.options.pillarTypes[i].Abbreviation + '\');">edit</button></td>';
                    html += '    <td><img src="images/trash-can.png" onclick="$(\'.bwPillarTypeEditor\').bwPillarTypeEditor(\'deleteAPillarType\', \'' + thiz.options.pillarTypes[i].bwPillarTypeId + '\', \'' + thiz.options.pillarTypes[i].PillarType + '\', \'' + thiz.options.pillarTypes[i].Abbreviation + '\');" title="Delete" style="cursor:pointer;" /></td>';
                    html += '  </tr>';
                }
            }
            html += '</table>';
            html += '<br />';
            html += '<input style="padding:5px 10px 5px 10px;" id="btnCreateRole2" onclick="$(\'.bwPillarTypeEditor\').bwPillarTypeEditor(\'addAPillarType\');" type="button" value="Add a Pillar type...">';
            // $('.bwOrganizationEditor').bwOrganizationEditor('addAGroup', 'json.Global.Divisions.Items[d].Id', '', '', '');



            // Render the html. THIS WAY IS PREFERABLE COME BACK AND FIX SOMETIME
            thiz.element.html(html);

        } catch (e) {
            console.log('Exception in renderPillarTypeEditor(): ' + e.message + ', ' + e.stack);
        }
    },
    addAPillarType: function () {
        try {
            console.log('In addAPillarType().');
            var thiz = this;
            $('#divManagePillarTypeDialog').find('#spanAddAnOrgItemDialogTitle')[0].innerHTML = 'Add a new Pillar Type';
            $('#divManagePillarTypeDialog').find('#divManagePillarTypeDialogSubmitButton')[0].innerHTML = 'Add the new Pillar Type';
            //debugger;
            $('#divManagePillarTypeDialog').find('#txtManagePillarTypeDialog_Name')[0].value = '';
            $('#divManagePillarTypeDialog').find('#txtManagePillarTypeDialog_Abbreviation')[0].value = '';
            $('#divManagePillarTypeDialog').find('#txtManagePillarTypeDialog_Id')[0].value = '';
            //
            // ToDo: Add the click event to this Save button!
            //
            $("#divManagePillarTypeDialog").dialog({
                modal: true,
                resizable: false,
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                width: '500',
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {
                    $('.ui-widget-overlay').bind('click', function () {
                        $("#divManagePillarTypeDialog").dialog('close');
                    });
                },
                close: function () {
                    $('#divManagePillarTypeDialog').dialog('destroy');
                }
            });
            //$("#divManagePillarTypeDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

            $('#divManagePillarTypeDialogSubmitButton').off('click').click(function (error) {
                try {
                    //debugger;
                    console.log('In addAPillarType.divManagePillarTypeDialogSubmitButton.click().');
                    var pillarType = $('#divManagePillarTypeDialog').find('#txtManagePillarTypeDialog_Name').val().trim();
                    var abbreviation = $('#divManagePillarTypeDialog').find('#txtManagePillarTypeDialog_Abbreviation').val().trim();
                    if (pillarType.length > 4 && abbreviation.length > 1) {
                        // Save the new Pillar type entry.
                        var bwPillarTypeId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                            return v.toString(16);
                        });
                        var pillarTypeJson = {
                            bwTenantId: tenantId,
                            bwWorkflowAppId: workflowAppId,
                            bwParticipantId: participantId,
                            bwParticipantFriendlyName: participantFriendlyName,
                            bwParticipantEmail: participantEmail,
                            bwPillarTypeId: bwPillarTypeId,
                            Abbreviation: abbreviation,
                            PillarType: pillarType,
                            isActive: true
                        };

                        //debugger;
                        // WE NEED TO SAVE THE NEW Pillar TYPE TO THE DATABASE HERE!!!!!!!!!!!!!!
                        $.ajax({
                            url: thiz.options.operationUriPrefix + "_bw/SavePillarType",
                            type: "Post",
                            timeout: thiz.options.ajaxTimeout,
                            data: pillarTypeJson,
                            headers: {
                                "Accept": "application/json; odata=verbose"
                            }
                        }).success(function (result) {
                            try {
                                if (result.message != 'SUCCESS') {
                                    thiz.displayAlertDialog('ERROR: ' + result.message);
                                } else {
                                    thiz.options.pillarTypes.push(pillarTypeJson); // This updates the widget data.
                                    $("#divManagePillarTypeDialog").dialog('close');
                                    thiz.renderPillarTypeEditor();
                                }
                            } catch (e) {
                                console.log('Exception in addAPillarType.SavePillarType: ' + e.message + ', ' + e.stack);
                                alert('Exception in addAPillarType.SavePillarType: ' + e.message + ', ' + e.stack);
                            }
                        }).error(function (data, errorCode, errorMessage) {
                            //thiz.hideProgress();
                            var msg;
                            if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                                msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                            } else {
                                msg = JSON.stringify(data) + ', json: ' + JSON.stringify(json);
                            }
                            console.log('Fail in addAPillarType.SavePillarType: ' + JSON.stringify(data) + ', json: ' + JSON.stringify(json));
                            alert('Fail in addAPillarType.SavePillarType: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                            //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                            //var error = JSON.parse(data.responseText)["odata.error"];
                            //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
                        });
                    } else {
                        alert('Please enter a Pillar type name (5 characters or more) and an abbreviation (2 characters or more).');
                    }
                } catch (e) {
                    console.log('Exception in addAPillarType.click(): ' + e.message + ', ' + e.stack);
                }
            });

        } catch (e) {
            console.log('Exception in addAPillarType(): ' + e.message + ', ' + e.stack);
        }
    },
    editAPillarType: function (bwPillarTypeId, PillarType, Abbreviation) {
        try {
            console.log('In editAPillarType(). bwPillarTypeId: ' + bwPillarTypeId);
            //debugger;
            var thiz = this;
            $('#divManagePillarTypeDialog').find('#spanAddAnOrgItemDialogTitle')[0].innerHTML = 'Edit this Pillar Type';
            $('#divManagePillarTypeDialog').find('#divManagePillarTypeDialogSubmitButton')[0].innerHTML = 'Save the Pillar Type';

            $('#divManagePillarTypeDialog').find('#txtManagePillarTypeDialog_Name')[0].value = PillarType;
            $('#divManagePillarTypeDialog').find('#txtManagePillarTypeDialog_Abbreviation')[0].value = Abbreviation;
            $('#divManagePillarTypeDialog').find('#txtManagePillarTypeDialog_Id')[0].value = bwPillarTypeId;

            //
            // ToDo: Add the click event to this Save button!
            //
            $("#divManagePillarTypeDialog").dialog({
                modal: true,
                resizable: false,
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                width: '500',
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {
                    $('.ui-widget-overlay').bind('click', function () {
                        $("#divManagePillarTypeDialog").dialog('close');
                    });
                },
                close: function () {
                    $('#divManagePillarTypeDialog').dialog('destroy');
                }
            });
            //$("#divManagePillarTypeDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

            $('#divManagePillarTypeDialogSubmitButton').off('click').click(function (error) {
                try {
                    console.log('In editAPillarType.divManagePillarTypeDialogSubmitButton.click().');
                    var PillarType = $('#divManagePillarTypeDialog').find('#txtManagePillarTypeDialog_Name').val().trim();
                    var abbreviation = $('#divManagePillarTypeDialog').find('#txtManagePillarTypeDialog_Abbreviation').val().trim();
                    var bwPillarTypeId = $('#divManagePillarTypeDialog').find('#txtManagePillarTypeDialog_Id').val().trim();
                    if (PillarType.length > 4 && abbreviation.length > 1) {
                        // Save the Pillar type entry.
                        var PillarTypeJson = {
                            bwTenantId: tenantId,
                            bwWorkflowAppId: workflowAppId,
                            bwParticipantId: participantId,
                            bwParticipantFriendlyName: participantFriendlyName,
                            bwParticipantEmail: participantEmail,
                            bwPillarTypeId: bwPillarTypeId,
                            Abbreviation: abbreviation,
                            PillarType: PillarType,
                            isActive: true
                        };

                        //debugger;
                        // WE NEED TO SAVE THE NEW Pillar TYPE TO THE DATABASE HERE!!!!!!!!!!!!!!
                        $.ajax({
                            url: thiz.options.operationUriPrefix + "_bw/EditPillarType", //SavePillarType",
                            type: "Post",
                            timeout: thiz.options.ajaxTimeout,
                            data: PillarTypeJson,
                            headers: {
                                "Accept": "application/json; odata=verbose"
                            }
                        }).success(function (result) {
                            try {
                                //debugger;
                                if (result.message != 'SUCCESS') {
                                    thiz.displayAlertDialog('ERROR: ' + result.message);
                                } else {
                                    // This updates the widget data.
                                    for (var i = 0; i < thiz.options.pillarTypes.length; i++) {
                                        if (thiz.options.pillarTypes[i].bwPillarTypeId == bwPillarTypeId) {
                                            thiz.options.pillarTypes[i].Abbreviation = abbreviation;
                                            thiz.options.pillarTypes[i].PillarType = PillarType;
                                            break;
                                        }
                                    }
                                    $("#divManagePillarTypeDialog").dialog('close');
                                    thiz.renderPillarTypeEditor();
                                }
                            } catch (e) {
                                console.log('Exception in editAPillarType.SavePillarType: ' + e.message + ', ' + e.stack);
                                alert('Exception in editAPillarType.SavePillarType: ' + e.message + ', ' + e.stack);
                            }
                        }).error(function (data, errorCode, errorMessage) {
                            //thiz.hideProgress();
                            var msg;
                            if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                                msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                            } else {
                                msg = JSON.stringify(data) + ', json: ' + JSON.stringify(json);
                            }
                            console.log('Fail in editAPillarType.SavePillarType: ' + JSON.stringify(data) + ', json: ' + JSON.stringify(json));
                            alert('Fail in editAPillarType.SavePillarType: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                            //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                            //var error = JSON.parse(data.responseText)["odata.error"];
                            //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
                        });
                    } else {
                        alert('Please enter a Pillar type name (5 characters or more) and an abbreviation (2 characters or more).');
                    }
                } catch (e) {
                    console.log('Exception in editAPillarType.click(): ' + e.message + ', ' + e.stack);
                }
            });

        } catch (e) {
            console.log('Exception in editAPillarType(): ' + e.message + ', ' + e.stack);
        }
    },
    deleteAPillarType: function (bwPillarTypeId, PillarType, Abbreviation) {
        try {
            console.log('In deleteAPillarType(). bwPillarTypeId: ' + bwPillarTypeId);
            //debugger;
            var thiz = this;
            $('#divManagePillarTypeDialog').find('#spanAddAnOrgItemDialogTitle')[0].innerHTML = 'Delete this Pillar Type';
            $('#divManagePillarTypeDialog').find('#divManagePillarTypeDialogSubmitButton')[0].innerHTML = 'Delete the Pillar Type';

            $('#divManagePillarTypeDialog').find('#txtManagePillarTypeDialog_Name')[0].value = PillarType;
            $('#divManagePillarTypeDialog').find('#txtManagePillarTypeDialog_Abbreviation')[0].value = Abbreviation;
            $('#divManagePillarTypeDialog').find('#txtManagePillarTypeDialog_Id')[0].value = bwPillarTypeId;

            //
            // ToDo: Add the click event to this Save button!
            //
            $("#divManagePillarTypeDialog").dialog({
                modal: true,
                resizable: false,
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                width: '500',
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {
                    $('.ui-widget-overlay').bind('click', function () {
                        $("#divManagePillarTypeDialog").dialog('close');
                    });
                },
                close: function () {
                    $('#divManagePillarTypeDialog').dialog('destroy');
                }
            });
            //$("#divManagePillarTypeDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

            $('#divManagePillarTypeDialogSubmitButton').off('click').click(function (error) {
                try {
                    console.log('In deleteAPillarType.divManagePillarTypeDialogSubmitButton.click().');

                    thiz.displayAlertDialog('Deleting is disabled. Additional logic needs to be added here first. Coming soon!');
                } catch (e) {
                    console.log('Exception in deleteAPillarType.click(): ' + e.message + ', ' + e.stack);
                }
            });

        } catch (e) {
            console.log('Exception in deleteAPillarType(): ' + e.message + ', ' + e.stack);
        }
    },
    displayAlertDialog: function (errorMessage) {
        try {
            //debugger;
            var element = $("#divAlertDialog");
            $(element).find('#spanErrorMessage')[0].innerHTML = errorMessage;
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
                },
                close: function () {
                    //$(this).dialog('destroy').remove();
                }
            });
            $(element).dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
        } catch (e) {
            console.log('Exception in bwAttachments.displayAlertDialog(): ' + e.message + ', ' + e.stack);
        }
    }


});