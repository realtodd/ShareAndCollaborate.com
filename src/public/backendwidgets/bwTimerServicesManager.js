$.widget("bw.bwTimerServicesManager", {
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
        This is the bwTimerServicesManager.js jQuery Widget. 
        ===========================================================

            [more to follow]
                          
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

            [put your stuff here]

        ===========================================================
       
        */

        ReadOnly: true, // Default to read-only mode. This is safer. 2-18-2022

        operationUriPrefix: null,
        ajaxTimeout: 15000,

        requestTypes: null,

        TimerServices: null,

        autoSenseDeviceType: false // Automatic UI based on device type. Alpha version so far.
    },
    _create: function (assignmentRowChanged_ElementId) {
        this.element.addClass("bwTimerServicesManager");
        var thiz = this; // Need this because of the asynchronous operations below.

        try {
            if (this.options.operationUriPrefix == null) {
                // This formulates the operationUri, which is used throughout.
                var url1 = window.location.href.split('https://')[1];
                var url2 = url1.split('/')[0];
                this.options.operationUriPrefix = 'https://' + url2 + '/';
            }


            this.loadDataFromTheDatabaseAndRender();


        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">bwTimerServicesManager: CANNOT RENDER</span>';
            html += '<br />';
            html += '<span style="">Exception in bwTimerServicesManager.Create(): ' + e.message + ', ' + e.stack + '</span>';
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

    loadDataFromTheDatabaseAndRender: function () {
        try {
            console.log('In loadDataFromTheDatabaseAndRender().');
            var thiz = this; // Need this because of the asynchronous operations below.

            // 
            // Load this object first so we don't have to keep making web service calls.
            //
            //if (this.options.TimerServices != null) {
            //    this.renderTimerServicesManager();
            //} else {
            $.ajax({
                url: this.options.operationUriPrefix + "_bw/getstatusofworkflowtimer2",
                dataType: "json",
                contentType: "application/json",
                type: "Get"
            }).done(function (result) {
                try {

                    if (result.status != 'SUCCESS') {

                        var html = '';
                        html += '<span style="font-size:24pt;color:red;">bwTimerServicesManager: CANNOT RENDER</span>';
                        html += '<br />';
                        html += '<span style="">Error in bwTimerServicesManager.loadDataFromTheDatabaseAndRender(): ' + result.message + '</span>';
                        thiz.element.html(html);

                    } else {

                        if (!result.ForestConfiguration) {

                            var msg = 'Error in bwTimerServicesManager.js.loadDataFromTheDatabaseAndRender(). Invalid value for result.ForestConfiguration: ' + result.ForestConfiguration;
                            console.log(msg);
                            displayAlertDialog(msg);

                        } else {

                            var data = result.ForestConfiguration;
                            //debugger;
                            //
                            // Morph this data to put it into our expected JSON format.
                            //

                            var timerServices = {
                                //WorkflowTimers_ElectedThreadId: data.WorkflowTimers_ElectedThreadId,
                                ThreadRegistry: result.ThreadRegistry,
                                TimerServices: [
                                    {
                                        TimerServiceId: 'SMTP_SERVER', // 6-3-2023.
                                        Title: 'SMTP Server',
                                        Description: 'SMTP. Haraka??',
                                        TimerInterval: 'NA', //data.SMTP_SERVER_Interval, 
                                        isActive: data.SMTP_SERVER_Running,
                                        LastRunTimestamp: data.SMTP_SERVER_LastRunTimestamp,
                                        disabled: false
                                    },
                                    {
                                        TimerServiceId: 'MONGO_DATABASE_RESPONDING_TIMER',
                                        Title: 'Mongo database Timer',
                                        Description: 'This keeps the database connection alive after a mongoose error is raised. This gives any server thread the permission to turn on and check that all the other services are running Ok. They will check the database and make sure the Elected Timer Thread is running, as well as other services as we see fit. In development. More to follow...',
                                        TimerInterval: data.MONGO_DATABASE_RESPONDING_TIMER_Interval, 
                                        isActive: data.MONGO_DATABASE_RESPONDING_TIMER_Running, 
                                        LastRunTimestamp: data.MONGO_DATABASE_RESPONDING_TIMER_LastRunTimestamp, 
                                        disabled: false
                                    },
                                     {
                                         TimerServiceId: 'FILE_CONVERSION_TIMER',
                                         Title: 'File Conversion Timer',
                                         Description: 'Checks if there are uploaded files/attachments which need to be converted. For instance, a .vob will get converted to a .mp4. The current list 11-13-2022 is [.vob, .mov, .mp4, .amr, .m4a, .mp3].',
                                         TimerInterval: data.FILE_CONVERSION_TIMER_Interval,
                                         isActive: data.FILE_CONVERSION_TIMER_Running,
                                         LastRunTimestamp: data.FILE_CONVERSION_TIMER_LastRunTimestamp,
                                         disabled: false
                                     },

                                     //
                                     // 10-21-2022 Move functions from the NEW_TASKS_TIMER to the workflow processing... so that requests do not stall as they move through the process, when the Timers aren't running. 
                                     //
                                    {
                                        TimerServiceId: 'NEW_TASKS_TIMER',
                                        Title: 'New Tasks Timer',
                                        Description: 'THIS SERVICE NEEDS WORK!!! >>>> Checks for new tasks, sets bwHasBeenProcessedByTheWorkflowEngine = true, updates DailyOverdueTaskNotificationDate to tomorrow, and sends emails. If email is turned off, they will go into the Pending Email queue. If this timer is not running, new tasks will stall, not send reminders, etc.',
                                        TimerInterval: data.NEW_TASKS_TIMER_Interval,
                                        isActive: data.NEW_TASKS_TIMER_Running,
                                        LastRunTimestamp: data.NEW_TASKS_TIMER_LastRunTimestamp,
                                        disabled: false
                                    },
                                    {
                                        TimerServiceId: 'OVERDUE_TASKS_TIMER',
                                        Title: 'Overdue Tasks Timer',
                                        Description: 'Checks for overdue tasks and sends emails. At the moment an overdue task is one which is over 1 day old. If email is turned off, they will go into the Pending Email queue.',
                                        TimerInterval: data.OVERDUE_TASKS_TIMER_Interval,
                                        isActive: data.OVERDUE_TASKS_TIMER_Running,
                                        LastRunTimestamp: data.OVERDUE_TASKS_TIMER_LastRunTimestamp,
                                        disabled: false
                                    },
                                    {
                                        TimerServiceId: 'COLLABORATION_TIMEOUT_TIMER',
                                        Title: 'Collaboration Timeout Timer',
                                        Description: 'Times-out Collaboration workflow steps, then creates tasks for the subsequent step. It needs the NEW_TASKS_TIMER running to deliver the emails for the new tasks.',
                                        TimerInterval: data.COLLABORATION_TIMEOUT_TIMER_Interval,
                                        isActive: data.COLLABORATION_TIMEOUT_TIMER_Running,
                                        LastRunTimestamp: data.COLLABORATION_TIMEOUT_TIMER_LastRunTimestamp,
                                        disabled: false
                                    },



                                    {
                                        TimerServiceId: 'PENDING_EMAIL_SENDING_TIMER',
                                        Title: 'Pending Emails Timer',
                                        Description: 'This sends pending emails that may be hanging around because email was turned off previously. Note that the user is prompted about the amount of Pending Emails that will be sent when email is turned back on.',
                                        TimerInterval: data.PENDING_EMAIL_SENDING_TIMER_Interval,
                                        isActive: data.PENDING_EMAIL_SENDING_TIMER_Running,
                                        LastRunTimestamp: data.PENDING_EMAIL_SENDING_TIMER_LastRunTimestamp,
                                        disabled: false
                                    },
                                    {
                                        TimerServiceId: 'AGGREGATED_EMAIL_TIMER',
                                        Title: 'Aggregated Emails Timer',
                                        Description: 'Sends aggregated emails to users who have chosen this setting. If email is turned off, no emails will get sent and they do not go into the Pending Email queue.',
                                        TimerInterval: data.AGGREGATED_EMAIL_TIMER_Interval,
                                        isActive: data.AGGREGATED_EMAIL_TIMER_Running,
                                        LastRunTimestamp: data.AGGREGATED_EMAIL_TIMER_LastRunTimestamp,
                                        disabled: false
                                    },
                                    {
                                        TimerServiceId: 'ONE_TIME_REMINDERS_TIMER',
                                        Title: 'One-time Reminders Timer',
                                        Description: 'This sends a user a one-time reminder about a request. These are set by the user for requests that they want to be reminded about.',
                                        TimerInterval: data.ONE_TIME_REMINDERS_TIMER_Interval,
                                        isActive: data.ONE_TIME_REMINDERS_TIMER_Running,
                                        LastRunTimestamp: data.ONE_TIME_REMINDERS_TIMER_LastRunTimestamp,
                                        disabled: false
                                    },
                                    {
                                        TimerServiceId: 'RECURRING_EXPENSES_TIMER',
                                        Title: 'RecurringExpenses Timer',
                                        Description: 'xx',
                                        TimerInterval: data.RECURRING_EXPENSES_TIMER_Interval,
                                        isActive: data.RECURRING_EXPENSES_TIMER_Running,
                                        LastRunTimestamp: data.RECURRING_EXPENSES_TIMER_LastRunTimestamp,
                                        disabled: true
                                    },

                                    {
                                        TimerServiceId: 'LICENSING_AND_INVOICING_TIMER',
                                        Title: 'LicenseAndInvoicing Timer',
                                        Description: 'xx',
                                        TimerInterval: data.LICENSING_AND_INVOICING_TIMER_Interval,
                                        isActive: data.LICENSING_AND_INVOICING_TIMER_Running,
                                        LastRunTimestamp: data.LICENSING_AND_INVOICING_TIMER_LastRunTimestamp,
                                        disabled: true
                                    },

                                    {
                                        TimerServiceId: 'ATTACHMENT_FILE_CLEANUP_TIMER',
                                        Title: 'AttachmentFileCleanup Timer',
                                        Description: 'xx',
                                        TimerInterval: data.ATTACHMENT_FILE_CLEANUP_TIMER_Interval,
                                        isActive: data.ATTACHMENT_FILE_CLEANUP_TIMER_Running,
                                        LastRunTimestamp: data.ATTACHMENT_FILE_CLEANUP_TIMER_LastRunTimestamp,
                                        disabled: true
                                    },

                                    {
                                        TimerServiceId: 'NEW_USER_TIMER',
                                        Title: 'NewUser Timer',
                                        Description: '[deprecated] When a new user sign\'s up, that email gets sent immediately.',
                                        TimerInterval: data.NEW_USER_TIMER_Interval,
                                        isActive: data.NEW_USER_TIMER_Running,
                                        LastRunTimestamp: data.NEW_USER_TIMER_LastRunTimestamp,
                                        disabled: true
                                    }
                                ]
                            };

                            thiz.options.TimerServices = timerServices;

                            if (thiz.options.ReadOnly == true) {
                                thiz.renderTimerServicesManager_ReadOnly();
                            } else {
                                thiz.renderTimerServicesManager();
                            }

                        }

                    }
                } catch (e) {
                    console.log('Exception in bwTimerServicesManager.loadDataFromTheDatabaseAndRender().xx.Get:1: ' + e.message + ', ' + e.stack);
                }

            }).fail(function (data) {

                debugger;
                console.log('In bwTimerServicesManager.loadDataFromTheDatabaseAndRender.RequestTypes.fail(): ' + JSON.stringify(data));
                var msg;
                if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                    msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                } else {
                    msg = JSON.stringify(data);
                }
                alert('Exception in bwTimerServicesManager.loadDataFromTheDatabaseAndRender().xx.Get:2: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                console.log('Exception in bwTimerServicesManager.loadDataFromTheDatabaseAndRender().xx.Get:2: ' + JSON.stringify(data));
                //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                //var error = JSON.parse(data.responseText)["odata.error"];
                //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
            });
            //}
        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">bwTimerServicesManager: CANNOT RENDER</span>';
            html += '<br />';
            html += '<span style="">Exception in bwTimerServicesManager.loadDataFromTheDatabaseAndRender(): ' + e.message + ', ' + e.stack + '</span>';
            thiz.element.html(html);
        }
    },

    renderTimerServicesManager_ReadOnly: function () {
        try {
            console.log('In renderTimerServicesManager_ReadOnly().');
            var thiz = this;
            var html = '';

            html += '<div style="display:none;" id="divManageTimerServiceDialog">'; // divManageTimerServiceDialog
            html += '   <table style="width:100%;">';
            html += '       <tr>';
            html += '           <td style="width:90%;">';
            html += '               <span id="spanAddAnOrgItemDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;font-weight:bold;">[spanAddAnOrgItemDialogTitle]</span>';
            html += '           </td>';
            html += '           <td style="width:9%;"></td>';
            html += '           <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '               <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 30pt;font-weight:bold;" onclick="$(\'#divManageTimerServiceDialog\').dialog(\'close\');">X</span>';
            html += '           </td>';
            html += '       </tr>';
            html += '   </table>';
            html += '   <br /><br />';
            html += '   <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
            html += '   <span id="spanAddAnOrgItemDialogInvitationDescriptionText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 20pt;"></span>';

            // 12-31-2021
            html += '   <span style="font-family: calibri;">Interval (milliseconds)</span>';
            html += '   <br />';
            html += '   <input type="text" id="txtManageRequestTypeDialog_IntervalInMilliseconds" style="WIDTH: 95%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" />';
            html += '   <br />';
            html += '   <span style="font-family: calibri;">seconds</span>';
            html += '   <br />';
            html += '   <input type="text" id="txtManageRequestTypeDialog_IntervalInSeconds" style="WIDTH: 95%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" disabled />';
            html += '   <br />';
            html += '   <span style="font-family: calibri;">minute(s)</span>';
            html += '   <br />';
            html += '   <input type="text" id="txtManageRequestTypeDialog_IntervalInMinutes" style="width:95%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" disabled />';
            html += '   <br /><br />';
            html += '   <span style="font-family: calibri;">Id</span>';
            html += '   <br />';
            html += '   <input id="txtManageRequestTypeDialog_Id" type="text" disabled style="WIDTH: 95%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" /><br />';
            //html += '   <br /><br />';
            //html += '   <span style="white-space:nowrap;"><input id="checkboxManageRequestTypeDialog_Active" type="checkbox" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" />Active</span>';
            html += '   <br /><br /><br />';
            html += '   <div id="divManageTimerServiceDialogSubmitButton" class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;">';
            html += '       Add the xx';
            html += '   </div>';
            html += '   <br /><br />';
            html += '   <div class="divSignInButton" style="width: 90%; text-align: center; line-height: 1.1em; font-weight: bold;" onclick="$(\'#divManageTimerServiceDialog\').dialog(\'close\');">';
            html += '       Close';
            html += '   </div>';
            html += '   <br /><br />';
            html += '</div>';


            //html += '<table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
            //html += '  <tr>';
            //html += '    <td>';
            //html += '       <span style="font-size:small;font-style:italic;">The request types you wish to enable:</span>';
            //html += '    </td></tr>';
            //html += '</table>';
            html += '<table>';
            html += '  <tr>';
            html += '    <td style="text-align:left;vertical-align:top;" class="bwSliderTitleCell">';
            html += '       <span style="font-size:xx-large;color:darkgray;">';
            html += '           Timer Services:&nbsp;';
            html += '           <br />';
            html += '           <input type="text" class="spanButton" value="Refresh" style="" onclick="$(\'#divBwTimerServicesManager\').bwTimerServicesManager(\'loadDataFromTheDatabaseAndRender\');" />';
            html += '       </span>';
            html += '       <br /><br />';
            //html += '       <span style="font-size:12pt;color:darkgray;">';
            //html += '           ElectedThreadId: ' + thiz.options.TimerServices.WorkflowTimers_ElectedThreadId + '';
            //html += '       </span>';
            //html += '       <br /><br />';
            html += '       <div style="font-size:8pt;color:black;width:350px;">';
            //html += '           Note that if NodeJS is recycled on the server, these Timer Services will not be running, and need to be restarted (because the Elected Thread disappeared).';
            //html += '           <br /><br />';
            //html += '           Thus, stop all the Timer Services, then turn on the ones you want running. You will see a new ElectedThreadId will be displayed here.';
            //html += '           <br /><br />';
            //html += '           The "Services Responding Checker" will address this issue. This functionality is incomplete. Coming Soon!';
            //html += '           <br /><br />';
            html += '           If a Timer Service is 1 minute late running, it displays <span style="background-color:pink">pink</span> to let you know there is a problem. xcx1';
            html += '       </div>';
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
            html += '    <td>Title</td>';
            html += '    <td>Description</td>';
            html += '    <td>Timer Interval</td>';
            html += '    <td>isActive</td>';
            html += '    <td>LastRunTimestamp</td>';
            //html += '    <td></td>';
            //html += '    <td></td>';
            //html += '    <td></td>';
            html += '  </tr>';

            var alternatingRow = 'light'; // Use this to color the rows.
            //debugger;
            if (!thiz.options.TimerServices.TimerServices) {
                html += '  <tr class="alternatingRowLight" style="cursor:pointer;">';
                html += '   <td colspan="5"><span style="color:tomato;">No data. Is the webservice responding correctly?</span></td>';
                html += '  </tr>';
            } else if (thiz.options.TimerServices.TimerServices.length == 0) {
                html += '  <tr class="alternatingRowLight" style="cursor:pointer;">';
                html += '   <td colspan="4"><span style="color:tomato;">No request types exist in the database.</span></td>';
                html += '  </tr>';
            } else {
                for (var i = 0; i < thiz.options.TimerServices.TimerServices.length; i++) {





                    var intervalInMinutes = ((thiz.options.TimerServices.TimerServices[i].TimerInterval / 1000) / 60);
                    var paddedIntervalInMinutes = ((thiz.options.TimerServices.TimerServices[i].TimerInterval / 1000) / 60) + 1; // Adding a minute to allow for heavy load.
                    var TIMER_NOT_RUNNING = false;

                    if (thiz.options.TimerServices.TimerServices[i].LastRunTimestamp) {

                        // Decide if this timer service has not run lately...!! 3-1-2022
                        var then = new Date(thiz.options.TimerServices.TimerServices[i].LastRunTimestamp);
                        then.setMinutes(then.getMinutes() + paddedIntervalInMinutes);
                        var now = new Date();
                        if (now > then) {
                            //alert('(weAreInTrouble > then) now: ' + now + ', then: ' + then + ', thiz.options.TimerServices.TimerServices[i].LastRunTimestamp: ' + thiz.options.TimerServices.TimerServices[i].LastRunTimestamp);
                            TIMER_NOT_RUNNING = true;
                        } else {
                            // Do nothing, the timer service must be running Ok.
                            //alert('xcx12342564 !(weAreInTrouble > then) now: ' + now + ', then: ' + then + ', thiz.options.TimerServices.TimerServices[i].LastRunTimestamp: ' + thiz.options.TimerServices.TimerServices[i].LastRunTimestamp);
                            TIMER_NOT_RUNNING = false;
                        }

                    }

                    var style = '';
                    if (TIMER_NOT_RUNNING == true) {
                        var style = 'cursor:pointer;background-color:pink;'; // The timer service has not been running, so make it pink to let the user know there is a problem!!!
                    } else {
                        var style = 'cursor:pointer;';
                    }








                    if (thiz.options.TimerServices.TimerServices[i].disabled == true) {
                        // This is the read-only method, so don't show the disabled ones.
                    } else {
                        //var style = 'cursor:pointer;';
                        if (thiz.options.TimerServices.TimerServices[i].disabled == true) {
                            style = 'cursor:pointer;color:lightgray;';
                        }
                        if (alternatingRow == 'light') {
                            html += '  <tr class="alternatingRowLight" style="' + style + '">';
                            alternatingRow = 'dark';
                        } else {
                            html += '  <tr class="alternatingRowDark" style="' + style + '">';
                            alternatingRow = 'light';
                        }
                        html += '    <td>' + thiz.options.TimerServices.TimerServices[i].Title + '</td>';
                        html += '    <td>' + thiz.options.TimerServices.TimerServices[i].Description + '</td>';


                        if (thiz.options.TimerServices.TimerServices[i].TimerInterval) {
                            var interval = (thiz.options.TimerServices.TimerServices[i].TimerInterval / 1000) / 60;
                            html += '    <td>' + interval + ' minute(s)</td>';
                        } else {
                            html += '    <td></td>';
                        }





                        // New request type functionality 7-8-2020.
                        //html += '    <td>' + thiz.options.TimerServices[i].isActive + '</td>';
                        //html += '       <label for="configurationBehaviorEnableBudgetRequestsSlider"></label><input type="checkbox" name="configurationBehaviorEnableBudgetRequestsSlider" id="configurationBehaviorEnableBudgetRequestsSlider" />';
                        html += '    <td>';
                        if (thiz.options.TimerServices.TimerServices[i].disabled != true) {
                            html += '       <label for="configurationBehaviorEnable' + thiz.options.TimerServices.TimerServices[i].TimerServiceId + 'Slider"></label><input type="checkbox" name="configurationBehaviorEnable' + thiz.options.TimerServices.TimerServices[i].TimerServiceId + 'Slider" id="configurationBehaviorEnable' + thiz.options.TimerServices.TimerServices[i].TimerServiceId + 'Slider" />';
                        } else {
                            html += '[disabled xcx3346]';
                        }
                        html += '    </td>';

                        var tmpLastRunTimestamp = bwCommonScripts.getBudgetWorkflowStandardizedDate(thiz.options.TimerServices.TimerServices[i].LastRunTimestamp);
                        html += '    <td>' + tmpLastRunTimestamp + '</td>';

                        //html += '    <td>' + thiz.options.TimerServices.TimerServices[i].TimerServiceId + '</td>';
                        //html += '    <td><button class="BwSmallButton" onclick="$(\'.bwTimerServicesManager\').bwTimerServicesManager(\'editATimerService\', \'' + thiz.options.TimerServices.TimerServices[i].TimerServiceId + '\', \'' + thiz.options.TimerServices.TimerServices[i].RequestType + '\', \'' + thiz.options.TimerServices.TimerServices[i].Abbreviation + '\', \'' + thiz.options.TimerServices.TimerServices[i].SingletonName + '\', \'' + thiz.options.TimerServices.TimerServices[i].PluralName + '\');">edit</button></td>';
                        //html += '    <td><img src="images/trash-can.png" onclick="$(\'.bwTimerServicesManager\').bwTimerServicesManager(\'deleteARequestType\', \'' + thiz.options.TimerServices.TimerServices[i].TimerServiceId + '\', \'' + thiz.options.TimerServices.TimerServices[i].RequestType + '\', \'' + thiz.options.TimerServices.TimerServices[i].Abbreviation + '\', \'' + thiz.options.TimerServices.TimerServices[i].SingletonName + '\', \'' + thiz.options.TimerServices.TimerServices[i].PluralName + '\');" title="Delete" style="cursor:pointer;" /></td>';
                        //html += '    <td></td>';
                        //html += '    <td></td>';
                        //html += '    <td></td>';
                        html += '  </tr>';

                    }
                }
            }
            html += '</table>';
            html += '<br />';
            //html += '<input style="padding:5px 10px 5px 10px;" id="btnCreateRole2" onclick="$(\'.bwTimerServicesManager\').bwTimerServicesManager(\'addARequestType\');" type="button" value="Add a Request type...">';
            // $('.bwOrganizationEditor').bwOrganizationEditor('addAGroup', 'json.Global.Divisions.Items[d].Id', '', '', '');



            // Render the html. THIS WAY IS PREFERABLE COME BACK AND FIX SOMETIME
            thiz.element.html(html);

            // Hook up the switch buttons.
            for (var i = 0; i < thiz.options.TimerServices.TimerServices.length; i++) {
                //var configurationBehaviorEnableBudgetRequestsOptions = {
                //debugger;

                if (thiz.options.TimerServices.TimerServices[i].disabled != true) {

                    var configurationBehaviorOptions = {
                        checked: thiz.options.TimerServices.TimerServices[i].isActive, //bwEnabledRequestTypes.Details.BudgetRequests.Enabled, //quotingEnabled,
                        show_labels: true,         // Should we show the on and off labels?
                        labels_placement: "left",  // Position of the labels: "both", "left" or "right"
                        on_label: "YES",            // Text to be displayed when checked
                        off_label: "NO",          // Text to be displayed when unchecked
                        width: 50,                 // Width of the button in pixels
                        height: 22,                // Height of the button in pixels
                        button_width: 24,         // Width of the sliding part in pixels
                        clear_after: null         // Override the element after which the clearing div should be inserted 
                    };

                    $('input#configurationBehaviorEnable' + thiz.options.TimerServices.TimerServices[i].TimerServiceId + 'Slider').switchButton(configurationBehaviorOptions).change(function (e) {

                        // We don't want the user to be able to change the slider, so this is a simple way to do that.
                        alert('Currently, only the Forest Administrator can turn this on. xcx1232356766.');
                        if ($(this).prop("checked") == true) {
                            $(this).prop("checked") = false;
                        } else {
                            $(this).prop("checked") = true;
                        }

                    });

                }

            }

        } catch (e) {
            console.log('Exception in renderTimerServicesManager_ReadOnly(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in renderTimerServicesManager_ReadOnly(): ' + e.message + ', ' + e.stack);
        }
    },

    cbAutomaticallyKeepTimerServicesRunning_OnChange: function () {
        try {
            console.log('In cbAutomaticallyKeepTimerServicesRunning_OnChange().');

            displayAlertDialog('In cbAutomaticallyKeepTimerServicesRunning_OnChange(). This functionality is incomplete. Coming soon!');

        } catch (e) {
            console.log('Exception in cbAutomaticallyKeepTimerServicesRunning_OnChange(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in cbAutomaticallyKeepTimerServicesRunning_OnChange(): ' + e.message + ', ' + e.stack);
        }
    },

    renderTimerServicesManager: function () {
        try {
            console.log('In bwTimerServicesManager.js.renderTimerServicesManager().');
            var thiz = this;
            var html = '';

            html += '<div style="display:none;" id="divManageTimerServiceDialog">'; 
            html += '   <table style="width:100%;">';
            html += '       <tr>';
            html += '           <td style="width:90%;">';
            html += '               <span id="spanAddAnOrgItemDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;font-weight:bold;">[spanAddAnOrgItemDialogTitle]</span>';
            html += '           </td>';
            html += '           <td style="width:9%;"></td>';
            html += '           <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '               <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 30pt;font-weight:bold;" onclick="$(\'#divManageTimerServiceDialog\').dialog(\'close\');">X</span>';
            html += '           </td>';
            html += '       </tr>';
            html += '   </table>';
            html += '   <br /><br />';
            html += '   <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
            html += '   <span id="spanAddAnOrgItemDialogInvitationDescriptionText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 20pt;"></span>';

            // 12-31-2021
            html += '   <span style="font-family: calibri;">Interval (milliseconds)</span>';
            html += '   <br />';
            html += '   <input type="text" id="txtManageRequestTypeDialog_IntervalInMilliseconds" style="WIDTH: 95%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" />';
            html += '   <br />';
            html += '   <span style="font-family: calibri;">seconds</span>';
            html += '   <br />';
            html += '   <input type="text" id="txtManageRequestTypeDialog_IntervalInSeconds" style="WIDTH: 95%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" disabled />';
            html += '   <br />';
            html += '   <span style="font-family: calibri;">minute(s)</span>';
            html += '   <br />';
            html += '   <input type="text" id="txtManageRequestTypeDialog_IntervalInMinutes" style="width:95%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" disabled />';
            html += '   <br /><br />';
            html += '   <span style="font-family: calibri;">Id</span>';
            html += '   <br />';
            html += '   <input id="txtManageRequestTypeDialog_Id" type="text" disabled style="WIDTH: 95%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 20pt;" /><br />';
            html += '   <br /><br /><br />';
            html += '   <div id="divManageTimerServiceDialogSubmitButton" class="divSignInButton" style="width:90%;text-align:center;line-height:1.1em;font-weight:bold;">';
            html += '       Add the xx';
            html += '   </div>';
            html += '   <br /><br />';
            html += '   <div class="divSignInButton" style="width: 90%; text-align: center; line-height: 1.1em; font-weight: bold;" onclick="$(\'#divManageTimerServiceDialog\').dialog(\'close\');">';
            html += '       Close';
            html += '   </div>';
            html += '   <br /><br />';
            html += '</div>';

            html += '<table>';
            html += '  <tr>';
            html += '    <td style="text-align:left;vertical-align:top;" class="bwSliderTitleCell">';
            html += '       <span style="font-size:xx-large;color:darkgray;">';
            html += '           Timer Services:&nbsp;';
            html += '           <br />';
            html += '           <input type="text" class="spanButton" value="Refresh" style="" onclick="$(\'#divBwTimerServicesManager\').bwTimerServicesManager(\'loadDataFromTheDatabaseAndRender\');" />';
            html += '       </span>';
            html += '       <br /><br />';
            html += '       <span style="font-size:12pt;color:darkgray;">';
            //html += '           ElectedThreadId: ' + thiz.options.TimerServices.WorkflowTimers_ElectedThreadId + '';
            html += '           Registered Threads: <br />'; // ' + JSON.stringify(thiz.options.TimerServices.ThreadRegistry) + '';

            for (var i = 0; i < thiz.options.TimerServices.ThreadRegistry.length; i++) { // thiz.options.TimerServices.ThreadRegistry
                if (thiz.options.TimerServices.ThreadRegistry[i].ThreadType == 'WEB_SERVICE_TIMER_SERVICE') {
                    var tmpEntryCreated = bwCommonScripts.getBudgetWorkflowStandardizedDate(thiz.options.TimerServices.ThreadRegistry[i].EntryCreated);
                    html += '<span style="font-size:11pt;color:black;">' + tmpEntryCreated + ' (' + thiz.options.TimerServices.ThreadRegistry[i].bwThreadId + ')</span>';
                    html += '<br />';
                }
            }

            html += '       </span>';
            html += '       <br /><br />';
            html += '       <div style="font-size:8pt;color:black;width:350px;">';
            html += '           Note that if NodeJS is recycled on the server, these Timer Services will not be running, and need to be restarted (because the Elected Thread disappeared).';
            html += '           <br /><br />';
            html += '           Thus, stop all the Timer Services, then turn on the ones you want running. You will see a new ElectedThreadId will be displayed here.';
            html += '           <br /><br />';
            html += '           The "Services Responding Checker" will address this issue. This functionality is incomplete. Coming Soon!';
            html += '           <br /><br />';
            html += '           If a Timer Service is 1 minute late running, it displays <span style="background-color:pink">pink</span> to let you know there is a problem.';

            html += '           <br /><br />';
            html += '           <input type="checkbox" id="cbAutomaticallyKeepTimerServicesRunning" onchange="$(\'.bwTimerServicesManager:first\').bwTimerServicesManager(\'cbAutomaticallyKeepTimerServicesRunning_OnChange\');" />&nbsp;&nbsp;Automatically Keep the Timers Running. Auto-Keep-Running. Use intelligence to select available thread in order to keep Timer Services running.';

            html += '       </div>';
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
            html += '    <td>Title</td>';
            html += '    <td>Description</td>';
            html += '    <td>Timer Interval</td>';
            html += '    <td>isActive</td>';
            html += '    <td>LastRunTimestamp</td>';
            html += '    <td>TimerServiceId</td>';
            html += '    <td></td>';
            html += '    <td></td>';
            html += '  </tr>';

            var alternatingRow = 'light'; // Use this to color the rows.

            if (!thiz.options.TimerServices.TimerServices) {
                html += '  <tr class="alternatingRowLight" style="cursor:pointer;">';
                html += '   <td colspan="5"><span style="color:tomato;">No data. Is the webservice responding correctly?</span></td>';
                html += '  </tr>';
            } else if (thiz.options.TimerServices.TimerServices.length == 0) {
                html += '  <tr class="alternatingRowLight" style="cursor:pointer;">';
                html += '   <td colspan="4"><span style="color:tomato;">No TimerServices exist in the database.</span></td>';
                html += '  </tr>';
            } else {

                for (var i = 0; i < thiz.options.TimerServices.TimerServices.length; i++) {

                    var intervalInMinutes = ((thiz.options.TimerServices.TimerServices[i].TimerInterval / 1000) / 60);
                    var paddedIntervalInMinutes = ((thiz.options.TimerServices.TimerServices[i].TimerInterval / 1000) / 60) + 1; // Adding a minute to allow for heavy load.
                    var TIMER_NOT_RUNNING = false;

                    if (thiz.options.TimerServices.TimerServices[i].LastRunTimestamp) {

                        // Decide if this timer service has not run lately...!! 3-1-2022
                        var then = new Date(thiz.options.TimerServices.TimerServices[i].LastRunTimestamp);
                        then.setMinutes(then.getMinutes() + paddedIntervalInMinutes);
                        var now = new Date();
                        if (now > then) {
                            TIMER_NOT_RUNNING = true;
                        } else {
                            // Do nothing, the timer service must be running Ok.
                            TIMER_NOT_RUNNING = false;
                        }

                    }

                    var style = '';
                    if (TIMER_NOT_RUNNING == true) {
                        var style = 'cursor:pointer;background-color:pink;'; // The timer service has not been running, so make it pink to let the user know there is a problem!!!
                    } else {
                        var style = 'cursor:pointer;';
                    }

                    if (thiz.options.TimerServices.TimerServices[i].disabled == true) {
                        style = 'cursor:pointer;color:lightgray;';
                    }
                    if (alternatingRow == 'light') {
                        html += '  <tr class="alternatingRowLight" style="' + style + '">';
                        alternatingRow = 'dark';
                    } else {
                        html += '  <tr class="alternatingRowDark" style="' + style + '">';
                        alternatingRow = 'light';
                    }
                    html += '    <td>' + thiz.options.TimerServices.TimerServices[i].Title + '</td>';
                    html += '    <td>' + thiz.options.TimerServices.TimerServices[i].Description + '</td>';

                    if (thiz.options.TimerServices.TimerServices[i].TimerInterval) {
                        html += '    <td>' + intervalInMinutes + ' minute(s)</td>';
                    } else {
                        html += '    <td></td>';
                    }

                    html += '    <td>';
                    if (thiz.options.TimerServices.TimerServices[i].disabled != true) {
                        html += '       <label for="configurationBehaviorEnable' + thiz.options.TimerServices.TimerServices[i].TimerServiceId + 'Slider"></label><input xcx="xcx110005" type="checkbox" name="configurationBehaviorEnable' + thiz.options.TimerServices.TimerServices[i].TimerServiceId + 'Slider" id="configurationBehaviorEnable' + thiz.options.TimerServices.TimerServices[i].TimerServiceId + 'Slider" />';
                    } else {
                        html += '[disabled xcx3346]';
                    }
                    html += '    </td>';

                    var tmpLastRunTimestamp = bwCommonScripts.getBudgetWorkflowStandardizedDate(thiz.options.TimerServices.TimerServices[i].LastRunTimestamp);
                    html += '    <td>' + tmpLastRunTimestamp + '</td>';

                    html += '    <td>' + thiz.options.TimerServices.TimerServices[i].TimerServiceId + '</td>';

                    html += '    <td><button class="BwSmallButton" onclick="$(\'.bwTimerServicesManager\').bwTimerServicesManager(\'editATimerService\', \'' + thiz.options.TimerServices.TimerServices[i].TimerServiceId + '\', \'' + thiz.options.TimerServices.TimerServices[i].RequestType + '\', \'' + thiz.options.TimerServices.TimerServices[i].Abbreviation + '\', \'' + thiz.options.TimerServices.TimerServices[i].SingletonName + '\', \'' + thiz.options.TimerServices.TimerServices[i].PluralName + '\');">edit</button></td>';
                    html += '    <td><img src="images/trash-can.png" onclick="$(\'.bwTimerServicesManager\').bwTimerServicesManager(\'deleteARequestType\', \'' + thiz.options.TimerServices.TimerServices[i].TimerServiceId + '\', \'' + thiz.options.TimerServices.TimerServices[i].RequestType + '\', \'' + thiz.options.TimerServices.TimerServices[i].Abbreviation + '\', \'' + thiz.options.TimerServices.TimerServices[i].SingletonName + '\', \'' + thiz.options.TimerServices.TimerServices[i].PluralName + '\');" title="Delete" style="cursor:pointer;" /></td>';
                    html += '  </tr>';
                }
            }

            html += '</table>';
            html += '<br />';
            
            // Render the html. THIS WAY IS PREFERABLE COME BACK AND FIX SOMETIME
            thiz.element.html(html);

            // Hook up the switch buttons.
            for (var i = 0; i < thiz.options.TimerServices.TimerServices.length; i++) {

                if (thiz.options.TimerServices.TimerServices[i].disabled != true) {

                    var configurationBehaviorOptions = {
                        checked: thiz.options.TimerServices.TimerServices[i].isActive, //bwEnabledRequestTypes.Details.BudgetRequests.Enabled, //quotingEnabled,
                        show_labels: true,         // Should we show the on and off labels?
                        labels_placement: "left",  // Position of the labels: "both", "left" or "right"
                        on_label: "YES",            // Text to be displayed when checked
                        off_label: "NO",          // Text to be displayed when unchecked
                        width: 50,                 // Width of the button in pixels
                        height: 22,                // Height of the button in pixels
                        button_width: 24,         // Width of the sliding part in pixels
                        clear_after: null         // Override the element after which the clearing div should be inserted 
                    };
                    $('input#configurationBehaviorEnable' + thiz.options.TimerServices.TimerServices[i].TimerServiceId + 'Slider').switchButton(configurationBehaviorOptions);

                    $('#configurationBehaviorEnable' + thiz.options.TimerServices.TimerServices[i].TimerServiceId + 'Slider').change(function () {
                        try {
                            console.log('In bwTimerServicesManager.js.renderTimerServicesManager.configurationBehaviorEnableRequestTypeSlider.change().');

                            var timerServiceId = this.id.split('configurationBehaviorEnable')[1].split('Slider')[0]; //'configurationBehaviorEnable' + thiz.options.TimerServices[i].TimerServiceId + 'Slider';
                            var isActive = this.checked; // This is what the user has just chosen to do.

                            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

                            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                            var data = {
                                bwParticipantId_LoggedIn: participantId,
                                bwActiveStateIdentifier: activeStateIdentifier,
                                bwWorkflowAppId_LoggedIn: workflowAppId,

                                TimerServiceId: timerServiceId,
                                isActive: isActive
                            };
                            var operationUri = thiz.options.operationUriPrefix + "_bw/startorstopworkflowtimer2";
                            $.ajax({
                                url: operationUri,
                                type: 'POST',
                                data: data,
                                headers: {
                                    "Accept": "application/json; odata=verbose"
                                },
                                success: function (results) {
                                    try {

                                        if (results.status == 'ERROR') {

                                            var msg = 'Error updating the service ' + results.TimerServiceId + '. Mod: ' + JSON.stringify(results.Mod);
                                            console.log(msg);
                                            displayAlertDialog(msg);

                                        } else if (results.status == 'WORKFLOW_TIMER_STARTED') {

                                            var msg = 'Successfully started the ' + results.TimerServiceId + '. The allocated thread for this service should start shortly.';
                                            console.log(msg);
                                            displayAlertDialog(msg);

                                            thiz.loadDataFromTheDatabaseAndRender();

                                        } else if (results.status == 'WORKFLOW_TIMER_STOPPED') {

                                            var msg = 'Successfully stopped the ' + results.TimerServiceId + '. The allocated thread for this service should stop shortly.';
                                            console.log(msg);
                                            displayAlertDialog(msg);

                                            thiz.loadDataFromTheDatabaseAndRender();

                                        } else {

                                            var msg = 'Unexpected error updating the service ' + results.TimerServiceId + '. Mod: ' + JSON.stringify(results.Mod);
                                            console.log(msg);
                                            displayAlertDialog(msg);

                                        }

                                    } catch (e) {
                                        console.log('Exception in bwTimerServicesManager.js.renderTimerServicesManager.configurationBehaviorEnableRequestTypeSlider.change():2: ' + e.message + ', ' + e.stack);
                                        displayAlertDialog('Exception in bwTimerServicesManager.js.renderTimerServicesManager.configurationBehaviorEnableRequestTypeSlider.change():2: ' + e.message + ', ' + e.stack);
                                    }

                                },
                                error: function (data, errorCode, errorMessage) {
                                    console.log('Error in bwTimerServicesManager.renderTimerServicesManager.configurationBehaviorEnableRequestTypeSlider.change(): ' + errorCode + ' ' + errorMessage);
                                    displayAlertDialog('Error in bwTimerServicesManager.renderTimerServicesManager.configurationBehaviorEnableRequestTypeSlider.change(): ' + errorCode + ' ' + errorMessage);
                                }

                            });

                        } catch (e) {
                            console.log('Exception in bwTimerServicesManager.js.renderTimerServicesManager.configurationBehaviorEnableRequestTypeSlider.change(): ' + e.message + ', ' + e.stack);
                            displayAlertDialog('Exception in bwTimerServicesManager.js.renderTimerServicesManager.configurationBehaviorEnableRequestTypeSlider.change(): ' + e.message + ', ' + e.stack);
                        }

                    });

                }

            }

        } catch (e) {
            console.log('Exception in bwTimerServicesManager.js.renderTimerServicesManager(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwTimerServicesManager.js.renderTimerServicesManager(): ' + e.message + ', ' + e.stack);
        }
    },

    editATimerService: function (timerServiceId, RequestType, Abbreviation, SingletonName, PluralName) {
        try {
            console.log('In editATimerService(). bwRequestTypeId: ' + timerServiceId);
            var thiz = this;
            debugger;
            $('#divManageTimerServiceDialog').find('#spanAddAnOrgItemDialogTitle')[0].innerHTML = 'Edit this Timer Service';
            $('#divManageTimerServiceDialog').find('#divManageTimerServiceDialogSubmitButton')[0].innerHTML = 'Save the Timer Service';

            //$('#divManageTimerServiceDialog').find('#txtManageRequestTypeDialog_Name')[0].value = RequestType;

            $('#divManageTimerServiceDialog').find('#txtManageRequestTypeDialog_IntervalInMilliseconds')[0].value = SingletonName; // 12-31-2021
            $('#divManageTimerServiceDialog').find('#txtManageRequestTypeDialog_IntervalInSeconds')[0].value = PluralName; // 12-31-2021

            $('#divManageTimerServiceDialog').find('#txtManageRequestTypeDialog_IntervalInMinutes')[0].value = Abbreviation;
            $('#divManageTimerServiceDialog').find('#txtManageRequestTypeDialog_Id')[0].value = timerServiceId;

            //
            // ToDo: Add the click event to this Save button!
            //
            $("#divManageTimerServiceDialog").dialog({
                modal: true,
                resizable: false,
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                width: '500',
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {
                    $('.ui-widget-overlay').bind('click', function () {
                        $("#divManageTimerServiceDialog").dialog('close');
                    });
                },
                close: function () {
                    $('#divManageTimerServiceDialog').dialog('destroy');
                }
            });
            //$("#divManageTimerServiceDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

            $('#divManageTimerServiceDialogSubmitButton').off('click').click(function (error) {
                try {
                    console.log('In editARequestType.divManageTimerServiceDialogSubmitButton.click().');

                    var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                    var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
                    var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
                    var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

                    //var requestType = $('#divManageTimerServiceDialog').find('#txtManageRequestTypeDialog_Name').val().trim();

                    var SingletonName = $('#divManageTimerServiceDialog').find('#txtManageRequestTypeDialog_SingletonName').val().trim(); // 12-31-2021
                    var PluralName = $('#divManageTimerServiceDialog').find('#txtManageRequestTypeDialog_PluralName').val().trim(); // 12-31-2021

                    var abbreviation = $('#divManageTimerServiceDialog').find('#txtManageRequestTypeDialog_Abbreviation').val().trim();
                    var timerServiceId = $('#divManageTimerServiceDialog').find('#txtManageRequestTypeDialog_Id').val().trim();
                    if (SingletonName.length > 4 && PluralName.length > 4 && abbreviation.length > 1) {
                        // Save the project type entry.
                        var requestTypeJson = {
                            //bwTenantId: tenantId,
                            bwWorkflowAppId: workflowAppId,
                            bwParticipantId: participantId,
                            bwParticipantFriendlyName: participantFriendlyName,
                            bwParticipantEmail: participantEmail,
                            timerServiceId: timerServiceId,
                            Abbreviation: abbreviation,
                            //RequestType: requestType,

                            SingletonName: SingletonName,
                            PluralName: PluralName,

                            isActive: true
                        };

                        //debugger;
                        // WE NEED TO SAVE THE NEW PROJECT TYPE TO THE DATABASE HERE!!!!!!!!!!!!!!
                        $.ajax({
                            url: thiz.options.operationUriPrefix + "_bw/EditRequestTypexx", //SaveRequestType",
                            type: "Post",
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

                                    $("#divManageTimerServiceDialog").dialog('close');
                                    thiz.renderRequestTypeEditor();
                                }
                            } catch (e) {
                                console.log('Exception in editATimerService: ' + e.message + ', ' + e.stack);
                                alert('Exception in editATimerService: ' + e.message + ', ' + e.stack);
                            }
                        }).error(function (data, errorCode, errorMessage) {
                            //thiz.hideProgress();
                            var msg;
                            if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                                msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                            } else {
                                msg = JSON.stringify(data) + ', json: ' + JSON.stringify(json);
                            }
                            console.log('Fail in editATimerService: ' + JSON.stringify(data) + ', json: ' + JSON.stringify(json));
                            alert('Fail in editATimerService: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                            //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                            //var error = JSON.parse(data.responseText)["odata.error"];
                            //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
                        });
                    } else {
                        alert('Please enter names (5 characters or more) and an abbreviation (2 characters or more).');
                    }
                } catch (e) {
                    console.log('Exception in editATimerService.click(): ' + e.message + ', ' + e.stack);
                }
            });

        } catch (e) {
            console.log('Exception in editATimerService(): ' + e.message + ', ' + e.stack);
        }
    },



});