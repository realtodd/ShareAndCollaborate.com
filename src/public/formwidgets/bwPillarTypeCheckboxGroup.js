$.widget("bw.bwPillarTypeCheckboxGroup", {
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
        This is the bwPillarTypeCheckboxGroup.js jQuery Widget. 
        ===========================================================

            [more to follow]
                          
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

            [put your stuff here]

        ===========================================================
       
        */

        fieldTitle: '', // This is the title, which shows up on the form in the left column.

        jsonData: [],

        ConditionString: null,

        //pillarTypes: [],

        //requestDialogId: null, // This is the unique id of the request dialog being displayed. We prepend this to id's in order to make sure we can display many dialogs at one time on screen and make them unique in the dom.
        //commentsAreRequired: false, // If comments are required the background is that light blue color to indicate data entry is required. 
        //consolidatedCommentsJson: null,

        //bwTenantId: null,
        //bwWorkflowAppId: null,

        operationUriPrefix: null,
        ajaxTimeout: 15000,
        autoSenseDeviceType: false // Automatic UI based on device type. Alpha version so far.
    },
    _create: function () {
        this.element.addClass("bwPillarTypeCheckboxGroup");
        var thiz = this; // Need this because of the asynchronous operations below.
        try {

            //var tenantId = $('.bwAuthentication').bwAuthentication('option', 'tenantId');
            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            if (this.options.operationUriPrefix == null) {
                // This formulates the operationUri, which is used throughout.
                var url1 = window.location.href.split('https://')[1];
                var url2 = url1.split('/')[0];
                this.options.operationUriPrefix = 'https://' + url2 + '/';
            }
            // 
            // Load this object first so we don't have to keep making web service calls.
            //
            //if (this.options.pillarTypes.length > 0) {
            //    this.renderAndPopulatePillarTypeCheckboxGroup();
            //} else {
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
                            thiz.options.jsonData = result.PillarTypes;
                            //thiz.renderPillarTypeEditor();
                            thiz.renderAndPopulatePillarTypeCheckboxGroup();

                            console.log('In bwPillarTypeCheckboxGroup._create(). The dialog has been initialized.');
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
            //}

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">bwWorkflowPicker: CANNOT RENDER bwPillarTypeCheckboxGroup</span>';
            html += '<br />';
            html += '<span style="">Exception in bwPillarTypeCheckboxGroup.Create(): ' + e.message + ', ' + e.stack + '</span>';
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
            .removeClass("bwPillarTypeCheckboxGroup")
            .text("");
    },
    getData: function () {
        try {
            console.log('In bwPillarTypeCheckboxGroup.getData().');
            //return 'This getData method is incomplete.';
            return null;
        } catch (e) {
            console.log('Exception in bwPillarTypeCheckboxGroup.getData(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwPillarTypeCheckboxGroup.getData(): ' + e.message + ', ' + e.stack);
        }
    },
    isARequiredField: function () {
        try {
            console.log('In bwPillarTypeCheckboxGroup.isARequiredField().');
            return this.options.renderAsARequiredField;
        } catch (e) {
            console.log('Exception in bwPillarTypeCheckboxGroup.isARequiredField(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwPillarTypeCheckboxGroup.isARequiredField(): ' + e.message + ', ' + e.stack);
        }
    },
    getfieldTitle: function () {
        try {
            console.log('In bwPillarTypeCheckboxGroup.getfieldTitle().');
            return this.options.fieldTitle;
        } catch (e) {
            console.log('Exception in bwPillarTypeCheckboxGroup.getfieldTitle(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwPillarTypeCheckboxGroup.getfieldTitle(): ' + e.message + ', ' + e.stack);
        }
    },
    renderAndPopulatePillarTypeCheckboxGroup: function (requestDialogId) {
        try {
            console.log('In renderAndPopulatePillarTypeCheckboxGroup().');
            var thiz = this;
            var html = '';

            html += '<table style="width:100%;">';
            html += '                        <tbody><tr class="xdTableOffsetRow" bwwidgetname="bwPillarTypeCheckboxGroup">';
            html += '                            <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px">';
            html += '                                <span class="xdlabel">';
            html += '                                    Pillars:';
            html += '                                </span>';
            //html += '                                <span style="color:red;font-size:medium;">*</span>';
            html += '                            </td>';
            html += '                            <td class="xdTableOffsetCellComponent" style="white-space:nowrap;text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px;">';
            
            html += '   <div>';

            html += '     <span >';
            //html += '       <select id="selectPillarType" class="bwRequestJson" bwfieldname="PillarType" bwdatatype="String" bwdatarequired="true" style="WIDTH: 60%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;TEXT-ALIGN: right;" onchange="$(\'.bwRequest\').bwRequest(\'selectPillarType_OnChange\', this);" size="1" >';


            if (this.options.jsonData.length == 0) {
                html += '<span style="white-space:nowrap;">No pillar types exist in the database.</span>';
            } else {
                // THE @COND IS CHANGING!!!!!!!!!!!!!!!! (to accomodate "Project Types" and "Pillar Types".
                // OLD:
                //     $IsLease=True$IsLegal=True$IsExec=True&$ChecklistsRequired~f830e44a-d29f-4261-80c6-756236355e96,cebeba6a-e89b-48c8-a8c7-52083fd429a9
                // NEW:
                //     $ProjectTypes~xxx-xx-xx-xx,xx-xx-xx-xx&$PillarTypes~xx-xxxxx-xx-xxxx-xx-xx,xx-xxxx-xx-xxxx-xx&$ChecklistsRequired~f830e44a-d29f-4261-80c6-756236355e96,cebeba6a-e89b-48c8-a8c7-52083fd429a9
                var conditionString = this.options.ConditionString;
                //debugger;
                var conditionStringPillarTypes = []; // var conditionStringPillarTypes = ['xx-xxxxx-xx-xxxx-xx-xx,xx-xxxx-xx-xxxx-xx', 'xx-xxxxx-xx-xxxx-xx-xx,xx-xxxx-xx-xxxx-xx'];
                if (conditionString.includes('$PillarTypes~')) {
                    var conditionStringArray = conditionString.split('&');
                    for (var i = 0; i < conditionStringArray.length; i++) {
                        if (conditionStringArray[i].indexOf('$PillarTypes~') > -1) {
                            // We found the Pillar Type section.
                            var tmp = conditionStringArray[i].split('~')[1];
                            var pillarTypeGuidsArray = tmp.split(',');
                            for (var j = 0; j < pillarTypeGuidsArray.length; j++) {
                                conditionStringPillarTypes.push(String(pillarTypeGuidsArray[j]));
                            }
                        }
                    }
                }

                for (var i = 0; i < thiz.options.jsonData.length; i++) {
                    if (thiz.options.jsonData[i].isActive == true) {
                        if (conditionStringPillarTypes.includes(String(thiz.options.jsonData[i].bwPillarTypeId))) {
                            // Checked.
                            html += '<span style="white-space:nowrap;"><input bwPillarTypeId="' + thiz.options.jsonData[i].bwPillarTypeId + '" id="' + 'cbPillarType_' + thiz.options.jsonData[i].bwPillarTypeId + '" type="checkbox" checked onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'cbPillarType_CheckChanged\', this);" />&nbsp;' + thiz.options.jsonData[i].Abbreviation + ' - ' + thiz.options.jsonData[i].PillarType + '&nbsp;</span>';
                        } else {
                            // Not checked.
                            html += '<span style="white-space:nowrap;"><input bwPillarTypeId="' + thiz.options.jsonData[i].bwPillarTypeId + '" id="' + 'cbPillarType_' + thiz.options.jsonData[i].bwPillarTypeId + '" type="checkbox" onchange="$(\'.bwWorkflowEditor\').bwWorkflowEditor(\'cbPillarType_CheckChanged\', this);" />&nbsp;' + thiz.options.jsonData[i].Abbreviation + ' - ' + thiz.options.jsonData[i].PillarType + '&nbsp;</span>';
                        }
                        html += '<br />';
                    }
                }
            }

            html += '     </span>';
            html += '   </div>';
            
            html += '                            </td>';
            html += '                        </tr>';
            html += '                    </tbody>';
            html += '</table>';

            // Render the html.
            if (this.options.inFormsEditor != true) {
                // THIS IS VERY IMPORTANT AND NEEDS TO BE IN EVERY WIDGET!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 7-12-2020
                // Even though the widget regenerates itself (re-renders), the parent TR tag gets missed!!! Therefore we have to handle getting rid of our form editor draggable attribute here.
                this.element.closest('tr').removeAttr('draggable');
            }
            this.element.html(html);
            ////debugger;
            ////$('.bwCoreComponent').bwCoreComponent('populateThePillarTypeDropdown', 'selectPillarType', false); // Populate the pillar type drop-down.

            //// If we have jsonData, populate the element.
            //if (this.options.jsonData != null) {
            //    var dataElement = $(this.element).find('.bwRequestJson')[0];
            //    var bwFieldName = dataElement.getAttribute('bwfieldname');
            //    var value = this.options.jsonData[bwFieldName].value;
            //    //debugger;
            //    dataElement.value = value;
            //}

        } catch (e) {
            console.log('Exception in renderAndPopulatePillarTypeCheckboxGroup: ' + e.message + ', ' + e.stack);
        }
    }


});