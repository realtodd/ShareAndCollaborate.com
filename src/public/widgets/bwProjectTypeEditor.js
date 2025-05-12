$.widget("bw.bwProjectTypeEditor", {
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
        This is the bwProjectTypeEditor.js jQuery Widget. 
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

        projectTypes: null,

        autoSenseDeviceType: false // Automatic UI based on device type. Alpha version so far.
    },
    _create: function (assignmentRowChanged_ElementId) {
        this.element.addClass("bwProjectTypeEditor");
        var thiz = this; // Need this because of the asynchronous operations below.
        //debugger;
        try {
            if (this.options.operationUriPrefix == null) {
                // This formulates the operationUri, which is used throughout.
                var url1 = window.location.href.split('https://')[1];
                var url2 = url1.split('/')[0];
                this.options.operationUriPrefix = 'https://' + url2 + '/';
            }

            var tenantId = $('.bwAuthentication').bwAuthentication('option', 'tenantId');
            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            //var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            //var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
            //var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

            // 
            // Load this object first so we don't have to keep making web service calls.
            //
            if (this.options.projectTypes != null) {
                this.renderProjectTypeEditor();
            } else {
                //debugger;
                $.ajax({
                    url: this.options.operationUriPrefix + "odata/ProjectTypes/" + workflowAppId + "/true", //
                    dataType: "json",
                    contentType: "application/json",
                    type: "Get",
                    timeout: this.options.ajaxTimeout
                }).done(function (result) {
                    try {
                        //debugger;
                        if (result.message != 'SUCCESS') {
                            var html = '';
                            html += '<span style="font-size:24pt;color:red;">bwProjectTypeEditor: CANNOT RENDER</span>';
                            html += '<br />';
                            html += '<span style="">Error in bwProjectTypeEditor.Create(): ' + result.message + '</span>';
                            thiz.element.html(html);
                        } else {
                            //debugger;
                            thiz.options.projectTypes = result.ProjectTypes;
                            thiz.renderProjectTypeEditor();
                        }
                    } catch (e) {
                        console.log('Exception in bwProjectTypeEditor._create().xx.Get:1: ' + e.message + ', ' + e.stack);
                    }

                }).fail(function (data) {
                    //lpSpinner.Hide();
                    debugger;
                    console.log('In bwProjectTypeEditor._create.ProjectTypes.fail(): ' + JSON.stringify(data));
                    var msg;
                    if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                        msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                    } else {
                        msg = JSON.stringify(data);
                    }
                    alert('Exception in bwProjectTypeEditor._create().xx.Get:2: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                    console.log('Exception in bwProjectTypeEditor._create().xx.Get:2: ' + JSON.stringify(data));
                    //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                    //var error = JSON.parse(data.responseText)["odata.error"];
                    //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
                });
            }
        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">bwProjectTypeEditor: CANNOT RENDER</span>';
            html += '<br />';
            html += '<span style="">Exception in bwProjectTypeEditor.Create(): ' + e.message + ', ' + e.stack + '</span>';
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

    renderProjectTypeEditor: function () {
        try {
            console.log('In renderProjectTypeEditor().');
            var thiz = this;
            var html = '';

            html += '<div style="display:none;" id="divManageProjectTypeDialog">';
            html += '   <table style="width:100%;">';
            html += '       <tr>';
            html += '           <td style="width:90%;">';
            html += '               <span id="spanAddAnOrgItemDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;font-weight:bold;">[spanAddAnOrgItemDialogTitle]</span>';
            html += '           </td>';
            html += '           <td style="width:9%;"></td>';
            html += '           <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '               <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 30pt;font-weight:bold;" onclick="$(\'#divManageProjectTypeDialog\').dialog(\'close\');">X</span>';
            html += '           </td>';
            html += '       </tr>';
            html += '   </table>';
            html += '   <br /><br />';
            html += '   <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
            html += '   <span id="spanAddAnOrgItemDialogInvitationDescriptionText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 20pt;"></span>';
            html += '   <span style="font-family: calibri;">Name</span>';
            html += '   <br />';
            html += '   <input type="text" id="txtManageProjectTypeDialog_Name" style="WIDTH: 95%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" />';
            html += '   <br /><br />';
            html += '   <span style="font-family: calibri;">Abbreviation</span>';
            html += '   <br />';
            html += '   <input type="text" id="txtManageProjectTypeDialog_Abbreviation" style="width:25%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" />';
            html += '   <br /><br />';
            html += '   <span style="font-family: calibri;">Id</span>';
            html += '   <br />';
            html += '   <input id="txtManageProjectTypeDialog_Id" type="text" disabled style="WIDTH: 95%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" /><br />';
            //html += '   <br /><br />';
            //html += '   <span style="white-space:nowrap;"><input id="checkboxAddANewPersonDialogActive" type="checkbox" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" />Active</span>';
            html += '   <br /><br /><br />';
            html += '   <div id="divManageProjectTypeDialogSubmitButton" class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;">';
            html += '       Add the xx';
            html += '   </div>';

            //html += '   <br /><br />';
            //html += '   <div id="divManageProjectTypeDialogDeleteButton" class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;">';
            //html += '       Delete';
            //html += '   </div>';

            html += '   <br /><br />';
            html += '   <div class="divSignInButton" style="width: 90%; text-align: center; line-height: 1.1em; font-weight: bold;" onclick="$(\'#divManageProjectTypeDialog\').dialog(\'close\');">';
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
            html += '       Project Types:&nbsp;';
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
            html += '    <td>bwProjectTypeId</td>';
            html += '    <td></td>';
            html += '    <td></td>';
            html += '  </tr>';

            var alternatingRow = 'light'; // Use this to color the rows.
            //debugger;
            if (thiz.options.projectTypes.length == 0) {
                html += '  <tr class="alternatingRowLight" style="cursor:pointer;">';
                html += '   <td colspan="5"><span style="color:tomato;">No project types exist in the database.</span></td>';
                html += '  </tr>';
            } else {
                for (var i = 0; i < thiz.options.projectTypes.length; i++) {
                    if (alternatingRow == 'light') {
                        html += '  <tr class="alternatingRowLight" style="cursor:pointer;">';
                        alternatingRow = 'dark';
                    } else {
                        html += '  <tr class="alternatingRowDark" style="cursor:pointer;">';
                        alternatingRow = 'light';
                    }
                    html += '    <td>' + thiz.options.projectTypes[i].Abbreviation + '</td>';
                    html += '    <td>' + thiz.options.projectTypes[i].ProjectType + '</td>';
                    html += '    <td>' + thiz.options.projectTypes[i].isActive + '</td>';
                    html += '    <td>' + thiz.options.projectTypes[i].bwProjectTypeId + '</td>';
                    html += '    <td><button class="BwSmallButton" onclick="$(\'.bwProjectTypeEditor\').bwProjectTypeEditor(\'editAProjectType\', \'' + thiz.options.projectTypes[i].bwProjectTypeId + '\', \'' + thiz.options.projectTypes[i].ProjectType + '\', \'' + thiz.options.projectTypes[i].Abbreviation + '\');">edit</button></td>';
                    html += '    <td><img src="images/trash-can.png" onclick="$(\'.bwProjectTypeEditor\').bwProjectTypeEditor(\'deleteAProjectType\', \'' + thiz.options.projectTypes[i].bwProjectTypeId + '\', \'' + thiz.options.projectTypes[i].ProjectType + '\', \'' + thiz.options.projectTypes[i].Abbreviation + '\');" title="Delete" style="cursor:pointer;" /></td>';
                    html += '  </tr>';
                }
            }
            html += '</table>';
            html += '<br />';
            html += '<input style="padding:5px 10px 5px 10px;" id="btnCreateRole2" onclick="$(\'.bwProjectTypeEditor\').bwProjectTypeEditor(\'addAProjectType\');" type="button" value="Add a Project type...">';
            // $('.bwOrganizationEditor').bwOrganizationEditor('addAGroup', 'json.Global.Divisions.Items[d].Id', '', '', '');



            // Render the html. THIS WAY IS PREFERABLE COME BACK AND FIX SOMETIME
            thiz.element.html(html);

        } catch (e) {
            console.log('Exception in renderProjectTypeEditor(): ' + e.message + ', ' + e.stack);
        }
    },
    addAProjectType: function () {
        try {
            console.log('In addAProjectType().');
            var thiz = this;
            $('#divManageProjectTypeDialog').find('#spanAddAnOrgItemDialogTitle')[0].innerHTML = 'Add a new Project Type';
            $('#divManageProjectTypeDialog').find('#divManageProjectTypeDialogSubmitButton')[0].innerHTML = 'Add the new Project Type';

            $('#divManageProjectTypeDialog').find('#txtManageProjectTypeDialog_Name')[0].value = '';
            $('#divManageProjectTypeDialog').find('#txtManageProjectTypeDialog_Abbreviation')[0].value = '';
            $('#divManageProjectTypeDialog').find('#txtManageProjectTypeDialog_Id')[0].value = '';
            //
            // ToDo: Add the click event to this Save button!
            //
            $("#divManageProjectTypeDialog").dialog({
                modal: true,
                resizable: false,
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                width: '500',
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {
                    $('.ui-widget-overlay').bind('click', function () {
                        $("#divManageProjectTypeDialog").dialog('close');
                    });
                },
                close: function () {
                    $('#divManageProjectTypeDialog').dialog('destroy');
                }
            });
            //$("#divManageProjectTypeDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

            $('#divManageProjectTypeDialogSubmitButton').off('click').click(function (error) {
                try {
                    //debugger;
                    console.log('In addAProjectType.divManageProjectTypeDialogSubmitButton.click().');
                    alert('In addAProjectType.divManageProjectTypeDialogSubmitButton.click().');


                    var projectType = $('#divManageProjectTypeDialog').find('#txtManageProjectTypeDialog_Name').val().trim();
                    var abbreviation = $('#divManageProjectTypeDialog').find('#txtManageProjectTypeDialog_Abbreviation').val().trim();


                    if (projectType.length > 4 && abbreviation.length > 1) {
                        // Save the new project type entry.
                        var bwProjectTypeId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                            return v.toString(16);
                        });
                        var projectTypeJson = {
                            bwTenantId: tenantId,
                            bwWorkflowAppId: workflowAppId,
                            bwParticipantId: participantId,
                            bwParticipantFriendlyName: participantFriendlyName,
                            bwParticipantEmail: participantEmail,
                            bwProjectTypeId: bwProjectTypeId,
                            Abbreviation: abbreviation,
                            ProjectType: projectType,
                            isActive: true
                        };
                        
                        //debugger;
                        // WE NEED TO SAVE THE NEW PROJECT TYPE TO THE DATABASE HERE!!!!!!!!!!!!!!
                        $.ajax({
                            url: thiz.options.operationUriPrefix + "_bw/SaveProjectType",
                            type: "Post",
                            timeout: thiz.options.ajaxTimeout,
                            data: projectTypeJson,
                            headers: {
                                "Accept": "application/json; odata=verbose"
                            }
                        }).success(function (result) {
                            try {
                                if (result.message != 'SUCCESS') {
                                    thiz.displayAlertDialog('ERROR: ' + result.message);
                                } else {
                                    thiz.options.projectTypes.push(projectTypeJson); // This updates the widget data.
                                    $("#divManageProjectTypeDialog").dialog('close');
                                    thiz.renderProjectTypeEditor();
                                }
                            } catch (e) {
                                console.log('Exception in addAProjectType.SaveProjectType: ' + e.message + ', ' + e.stack);
                                alert('Exception in addAProjectType.SaveProjectType: ' + e.message + ', ' + e.stack);
                            }
                        }).error(function (data, errorCode, errorMessage) {
                            //thiz.hideProgress();
                            var msg;
                            if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                                msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                            } else {
                                msg = JSON.stringify(data) + ', json: ' + JSON.stringify(json);
                            }
                            console.log('Fail in addAProjectType.SaveProjectType: ' + JSON.stringify(data) + ', json: ' + JSON.stringify(json));
                            alert('Fail in addAProjectType.SaveProjectType: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                            //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                            //var error = JSON.parse(data.responseText)["odata.error"];
                            //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
                        });
                    } else {
                        alert('Please enter a project type name (5 characters or more) and an abbreviation (2 characters or more).');
                    }
                } catch (e) {
                    console.log('Exception in addAProjectType.click(): ' + e.message + ', ' + e.stack);
                }
            });

        } catch (e) {
            console.log('Exception in addAProjectType(): ' + e.message + ', ' + e.stack);
        }
    },
    editAProjectType: function (bwProjectTypeId, ProjectType, Abbreviation) {
        try {
            console.log('In editAProjectType(). bwProjectTypeId: ' + bwProjectTypeId);
            //debugger;
            var thiz = this;
            $('#divManageProjectTypeDialog').find('#spanAddAnOrgItemDialogTitle')[0].innerHTML = 'Edit this Project Type';
            $('#divManageProjectTypeDialog').find('#divManageProjectTypeDialogSubmitButton')[0].innerHTML = 'Save the Project Type';

            $('#divManageProjectTypeDialog').find('#txtManageProjectTypeDialog_Name')[0].value = ProjectType;
            $('#divManageProjectTypeDialog').find('#txtManageProjectTypeDialog_Abbreviation')[0].value = Abbreviation;
            $('#divManageProjectTypeDialog').find('#txtManageProjectTypeDialog_Id')[0].value = bwProjectTypeId;

            //
            // ToDo: Add the click event to this Save button!
            //
            $("#divManageProjectTypeDialog").dialog({
                modal: true,
                resizable: false,
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                width: '500',
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {
                    $('.ui-widget-overlay').bind('click', function () {
                        $("#divManageProjectTypeDialog").dialog('close');
                    });
                },
                close: function () {
                    $('#divManageProjectTypeDialog').dialog('destroy');
                }
            });
            //$("#divManageProjectTypeDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

            $('#divManageProjectTypeDialogSubmitButton').off('click').click(function (error) {
                try {
                    console.log('In editAProjectType.divManageProjectTypeDialogSubmitButton.click().');
                    var projectType = $('#divManageProjectTypeDialog').find('#txtManageProjectTypeDialog_Name').val().trim();
                    var abbreviation = $('#divManageProjectTypeDialog').find('#txtManageProjectTypeDialog_Abbreviation').val().trim();
                    var bwProjectTypeId = $('#divManageProjectTypeDialog').find('#txtManageProjectTypeDialog_Id').val().trim();
                    if (projectType.length > 4 && abbreviation.length > 1) {
                        // Save the project type entry.
                        var projectTypeJson = {
                            bwTenantId: tenantId,
                            bwWorkflowAppId: workflowAppId,
                            bwParticipantId: participantId,
                            bwParticipantFriendlyName: participantFriendlyName,
                            bwParticipantEmail: participantEmail,
                            bwProjectTypeId: bwProjectTypeId,
                            Abbreviation: abbreviation,
                            ProjectType: projectType,
                            isActive: true
                        };

                        //debugger;
                        // WE NEED TO SAVE THE NEW PROJECT TYPE TO THE DATABASE HERE!!!!!!!!!!!!!!
                        $.ajax({
                            url: thiz.options.operationUriPrefix + "_bw/EditProjectType", //SaveProjectType",
                            type: "Post",
                            timeout: thiz.options.ajaxTimeout,
                            data: projectTypeJson,
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
                                    for (var i = 0; i < thiz.options.projectTypes.length; i++) {
                                        if (thiz.options.projectTypes[i].bwProjectTypeId == bwProjectTypeId) {
                                            thiz.options.projectTypes[i].Abbreviation = abbreviation;
                                            thiz.options.projectTypes[i].ProjectType = projectType;
                                            break;
                                        }
                                    }
                                    $("#divManageProjectTypeDialog").dialog('close');
                                    thiz.renderProjectTypeEditor();
                                }
                            } catch (e) {
                                console.log('Exception in editAProjectType.SaveProjectType: ' + e.message + ', ' + e.stack);
                                alert('Exception in editAProjectType.SaveProjectType: ' + e.message + ', ' + e.stack);
                            }
                        }).error(function (data, errorCode, errorMessage) {
                            //thiz.hideProgress();
                            var msg;
                            if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                                msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                            } else {
                                msg = JSON.stringify(data) + ', json: ' + JSON.stringify(json);
                            }
                            console.log('Fail in editAProjectType.SaveProjectType: ' + JSON.stringify(data) + ', json: ' + JSON.stringify(json));
                            alert('Fail in editAProjectType.SaveProjectType: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                            //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                            //var error = JSON.parse(data.responseText)["odata.error"];
                            //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
                        });
                    } else {
                        alert('Please enter a project type name (5 characters or more) and an abbreviation (2 characters or more).');
                    }
                } catch (e) {
                    console.log('Exception in editAProjectType.click(): ' + e.message + ', ' + e.stack);
                }
            });

        } catch (e) {
            console.log('Exception in editAProjectType(): ' + e.message + ', ' + e.stack);
        }
    },
    deleteAProjectType: function (bwProjectTypeId, ProjectType, Abbreviation) {
        try {
            console.log('In deleteAProjectType(). bwProjectTypeId: ' + bwProjectTypeId);
            //debugger;
            var thiz = this;
            $('#divManageProjectTypeDialog').find('#spanAddAnOrgItemDialogTitle')[0].innerHTML = 'Delete this Project Type';
            $('#divManageProjectTypeDialog').find('#divManageProjectTypeDialogSubmitButton')[0].innerHTML = 'Delete the Project Type';

            $('#divManageProjectTypeDialog').find('#txtManageProjectTypeDialog_Name')[0].value = ProjectType;
            $('#divManageProjectTypeDialog').find('#txtManageProjectTypeDialog_Abbreviation')[0].value = Abbreviation;
            $('#divManageProjectTypeDialog').find('#txtManageProjectTypeDialog_Id')[0].value = bwProjectTypeId;

            //
            // ToDo: Add the click event to this Save button!
            //
            $("#divManageProjectTypeDialog").dialog({
                modal: true,
                resizable: false,
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                width: '500',
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {
                    $('.ui-widget-overlay').bind('click', function () {
                        $("#divManageProjectTypeDialog").dialog('close');
                    });
                },
                close: function () {
                    $('#divManageProjectTypeDialog').dialog('destroy');
                }
            });
            //$("#divManageProjectTypeDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

            $('#divManageProjectTypeDialogSubmitButton').off('click').click(function (error) {
                try {
                    console.log('In deleteAProjectType.divManageProjectTypeDialogSubmitButton.click().');

                    thiz.displayAlertDialog('Deleting is disabled. Additional logic needs to be added here first. Coming soon!');
                } catch (e) {
                    console.log('Exception in deleteAProjectType.click(): ' + e.message + ', ' + e.stack);
                }
            });

        } catch (e) {
            console.log('Exception in deleteAProjectType(): ' + e.message + ', ' + e.stack);
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