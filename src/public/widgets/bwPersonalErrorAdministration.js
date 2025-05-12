$.widget("bw.bwPersonalErrorAdministration", {
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
        This is the bwPersonalErrorAdministration.js jQuery Widget. 
        ===========================================================

            [more to follow]
                          
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

            [put your stuff here]

        ===========================================================
       
        */

        bwSoundIndex: null, // This helps us randomize the sounds when random is selected. It helps prevent the same sound being played twice in a row.
        NotificationCount: -1,

        NotificationCount_SpeechBubble: -1, // New 5-16-2023.
        NotificationCount_Email: -1, // New 5-16-2023.
        NotificationCount_Telephone: -1, // New 5-16-2023.

        operationUriPrefix: null,

        autoSenseDeviceType: false // Automatic UI based on device type. Alpha version so far.
    },
    _create: function () {
        this.element.addClass("bwPersonalErrorAdministration");
        var thiz = this; // Need this because of the asynchronous operations below.
        try {
            if (this.options.operationUriPrefix == null) {
                // This formulates the operationUri, which is used throughout.
                if (window.location.href.indexOf('https://') > -1) {
                    var url1 = window.location.href.split('https://')[1];
                    var url2 = url1.split('/')[0];
                    this.options.operationUriPrefix = 'https://' + url2 + '/';
                } else {
                    var url1 = window.location.href.split('http://')[1];
                    var url2 = url1.split('/')[0];
                    this.options.operationUriPrefix = 'http://' + url2 + '/';
                }
            }

            //this.checkIfWeNeedToPlayANotificationSound('true');

            console.log('In bwPersonalErrorAdministration._create(). The widget has been initialized.');
            //alert('In bwPersonalErrorAdministration._create(). The widget has been initialized.');

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwPersonalErrorAdministration</span>';
            html += '<br />';
            html += '<span style="">Exception in bwPersonalErrorAdministration.Create(): ' + e.message + ', ' + e.stack + '</span>';
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
            .removeClass("bwPersonalErrorAdministration")
            .text("");
    },
    getData: function () {
        try {
            console.log('In bwPersonalErrorAdministration.getData().');
            ////debugger;
            ////Come back and build out the JSON for this!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 7-27-2020
            //var value = $(this.element).find('#txtProjectManagerName')[0].value;
            return 'xcx12432341253';
        } catch (e) {
            console.log('Exception in bwPersonalErrorAdministration.getData(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwPersonalErrorAdministration.getData(): ' + e.message + ', ' + e.stack);
        }
    },
    renderTopBarSpeechBubble: function () {
        try {
            console.log('In renderTopBarSpeechBubble.js.getData().');

            var html = '';

            html += '<style>';
            html += '   .divNotificationSpeechBubble {';
            html += '       background-image: url("/images/bwPersonalErrorAdministration/speechbubble_37x37.png");';
            html += '       background-repeat: no-repeat;';
            html += '       width: 52px;';
            html += '       height: 40px;';
            html += '   }';
            html += '</style>';

            html += '<div class="divNotificationSpeechBubble">';

            if (this.options.NotificationCount > 0) {
                html += '   <div id="bwPersonalErrorAdministration_SpeechBubble_NotificationCount" style="border:2px solid red;border-radius:30px 30px 30px 30px;align-content:flex-end;text-align:right;vertical-align:super;background-color:red;color:white;font-size:10pt;font-weight:bold;padding:0 5px 0 5px;float:right;">';
                html += this.options.NotificationCount;
                html += '   </div>';
            }

            html += '</div>';

            return html;

        } catch (e) {
            console.log('Exception in renderTopBarSpeechBubble.js.getData(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in renderTopBarSpeechBubble.js.getData(): ' + e.message + ', ' + e.stack);
        }
    },
    renderTopBarSpeechBubble2: function () {
        try {
            console.log('In renderTopBarSpeechBubble2.js.getData().');

            var element = document.getElementsByClassName('divNotificationSpeechBubble')[0];

            if (!element) {

                displayAlertDialog('Could not find element with class "divNotificationSpeechBubble".');

            } else {

                var html = '';

                if (this.options.NotificationCount > 0) {
                    html += '   <div id="bwPersonalErrorAdministration_SpeechBubble_NotificationCount" style="border:2px solid red;border-radius:30px 30px 30px 30px;align-content:flex-end;text-align:right;vertical-align:super;background-color:red;color:white;font-size:10pt;font-weight:bold;padding:0 5px 0 5px;float:right;">';
                    html += this.options.NotificationCount;
                    html += '   </div>';
                }

                element.innerHTML = html;

            }

        } catch (e) {
            console.log('Exception in renderTopBarSpeechBubble2.js.getData(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in renderTopBarSpeechBubble2.js.getData(): ' + e.message + ', ' + e.stack);
        }
    },



    renderTopBarEmail: function () {
        try {
            console.log('In renderTopBarSpeechBubble.js.getData().');

            var html = '';

            html += '<style>';
            html += '   .divNotificationEmail {';
            html += '       background-image: url("/images/bwPersonalErrorAdministration/email-icon2.png");'; // 📧
            html += '       background-repeat: no-repeat;';
            html += '       width: 52px;';
            html += '       height: 40px;';
            html += '   }';
            html += '</style>';

            html += '<div class="divNotificationEmail">';

            if (this.options.NotificationCount > 0) {
                html += '   <div id="bwPersonalErrorAdministration_Email_NotificationCount" style="border:2px solid red;border-radius:30px 30px 30px 30px;align-content:flex-end;text-align:right;vertical-align:super;background-color:red;color:white;font-size:10pt;font-weight:bold;padding:0 5px 0 5px;float:right;">';
                html += this.options.NotificationCount;
                html += '   </div>';
            }

            html += '</div>';

            return html;

        } catch (e) {
            console.log('Exception in renderTopBarEmail.js.getData(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in renderTopBarEmail.js.getData(): ' + e.message + ', ' + e.stack);
        }
    },
    renderTopBarEmail2: function () {
        try {
            console.log('In renderTopBarEmail2.js.getData().');

            var element = document.getElementsByClassName('divNotificationSpeechBubble')[0];

            if (!element) {

                displayAlertDialog('Could not find element with class "divNotificationSpeechBubble".');

            } else {

                var html = '';

                if (this.options.NotificationCount > 0) {
                    html += '   <div id="bwPersonalErrorAdministration_Email_NotificationCount" style="border:2px solid red;border-radius:30px 30px 30px 30px;align-content:flex-end;text-align:right;vertical-align:super;background-color:red;color:white;font-size:10pt;font-weight:bold;padding:0 5px 0 5px;float:right;">';
                    html += this.options.NotificationCount;
                    html += '   </div>';
                }

                element.innerHTML = html;

            }

        } catch (e) {
            console.log('Exception in renderTopBarEmail2.js.getData(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in renderTopBarEmail2.js.getData(): ' + e.message + ', ' + e.stack);
        }
    },


    renderTopBarTelephone: function () {
        try {
            console.log('In renderTopBarTelephone.js.getData().');

            var html = '';

            html += '<style>';
            html += '   .divNotificationTelephone {';
            html += '       background-image: url("/images/bwPersonalErrorAdministration/telephone.png");';
            html += '       background-repeat: no-repeat;';
            html += '       width: 52px;';
            html += '       height: 40px;';
            html += '   }';
            html += '</style>';

            html += '<div class="divNotificationTelephone">';

            if (this.options.NotificationCount > 0) {
                html += '   <div id="bwPersonalErrorAdministration_Telephone_NotificationCount" style="border:2px solid red;border-radius:30px 30px 30px 30px;align-content:flex-end;text-align:right;vertical-align:super;background-color:red;color:white;font-size:10pt;font-weight:bold;padding:0 5px 0 5px;float:right;">';
                html += this.options.NotificationCount;
                html += '   </div>';
            }

            html += '</div>';

            return html;

        } catch (e) {
            console.log('Exception in renderTopBarTelephone.js.getData(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in renderTopBarTelephone.js.getData(): ' + e.message + ', ' + e.stack);
        }
    },
    renderTopBarTelephone2: function () {
        try {
            console.log('In renderTopBarTelephone2.js.getData().');

            var element = document.getElementsByClassName('divNotificationTelephone')[0];

            if (!element) {

                displayAlertDialog('Could not find element with class "divNotificationTelephone".');

            } else {

                var html = '';

                if (this.options.NotificationCount > 0) {
                    html += '   <div id="bwPersonalErrorAdministration_Telephone_NotificationCount" style="border:2px solid red;border-radius:30px 30px 30px 30px;align-content:flex-end;text-align:right;vertical-align:super;background-color:red;color:white;font-size:10pt;font-weight:bold;padding:0 5px 0 5px;float:right;">';
                    html += this.options.NotificationCount;
                    html += '   </div>';
                }

                element.innerHTML = html;

            }

        } catch (e) {
            console.log('Exception in renderTopBarTelephone2.js.getData(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in renderTopBarTelephone2.js.getData(): ' + e.message + ', ' + e.stack);
        }
    },


    displayAIConversation: function () {
        try {
            console.log('In bwPersonalErrorAdministration.js.displayAIConversation().');
            //alert('In bwPersonalErrorAdministration.js.displayAIConversation().');
            var thiz = this;

            //var bwWorkflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

            var data = {
                bwParticipantId_LoggedIn: participantId,
                bwActiveStateIdentifier: activeStateIdentifier,
                bwWorkflowAppId_LoggedIn: workflowAppId,

                bwWorkflowAppId: workflowAppId
            };

            $.ajax({
                url: webserviceurl + "/getaiconversationlogfororganization",
                type: "POST",
                data: data,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (results) {
                    try {

                        var html = '';

                        if (!(results.result && results.result.length)) {

                            // Must be a new user. Nothing to talk about yet!
                            html += 'This must be a new organization. There is nothing to talk about yet.';

                        } else {

                            html += '<ul>';
                            for (var i = 0; i < results.result.length; i++) {
                                html += '<li>' + results.result[i].Action_Message + '</li>';
                            }
                            html += '</ul>';

                        }

                        displayAlertDialog(html);

                    } catch (e) {
                        console.log('Exception in bwPersonalErrorAdministration.js.displayAIConversation(): ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwPersonalErrorAdministration.js.displayAIConversation(): ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    console.log('Error in bwPersonalErrorAdministration.js.displayAIConversation():' + errorCode + ', ' + errorMessage);
                    displayAlertDialog('Error in bwPersonalErrorAdministration.js.displayAIConversation():' + errorCode + ', ' + errorMessage);
                }
            });

        } catch (e) {
            console.log('Exception in bwPersonalErrorAdministration.js.displayAIConversation(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwPersonalErrorAdministration.js.displayAIConversation(): ' + e.message + ', ' + e.stack);
        }
    },

    renderPersonalErrorAdministrationUI: function () {
        try {
            console.log('In renderPersonalErrorAdministrationUI().');
            //alert('In renderPersonalErrorAdministrationUI().');

            var bwSelectedNotificationSound = $('.bwAuthentication').bwAuthentication('option', 'bwSelectedNotificationSound');

            var html = '';

            html += '<table>';
            html += '   <tr>';
            html += '       <td style="text-align:left;" class="bwSliderTitleCell">Personal error administration:</td>';
            html += '       <td class="bwChartCalculatorLightCurrencyTableCell">';
            if (!bwSelectedNotificationSound || (bwSelectedNotificationSound == 'nosound')) {
                html += '           <input type="radio" checked="" style="cursor:pointer;" name="cbSelectNotificationSound" onclick="$(\'.bwPersonalErrorAdministration\').bwPersonalErrorAdministration(\'cbSelectNotificationSound_click\', \'nosound\');" />&nbsp;';
            } else {
                html += '           <input type="radio" style="cursor:pointer;" name="cbSelectNotificationSound" onclick="$(\'.bwPersonalErrorAdministration\').bwPersonalErrorAdministration(\'cbSelectNotificationSound_click\', \'nosound\');" />&nbsp;';
            }
            html += '           <span style="cursor:pointer;">';
            //html += '               <img src="images/playbutton.jpg" style="width:110px;height:70px;vertical-align:middle;" />';
            html += '           </span>';
            html += '           <span style="cursor:pointer;">No Errors xcx1243777 +speech synthesis see Stark Industries TODO-230011.</span>';
            html += '           <br />';
            html += '       </td>';
            html += '   </tr>';
            html += '   <tr>';
            html += '       <td></td>';
            html += '       <td class="bwChartCalculatorLightCurrencyTableCell">';
            if (bwSelectedNotificationSound == 'random') {
                html += '           <input type="radio" checked="" style="cursor:pointer;" name="cbSelectNotificationSound" onclick="$(\'.bwPersonalErrorAdministration\').bwPersonalErrorAdministration(\'cbSelectNotificationSound_click\', \'random\');" />&nbsp;';
            } else {
                html += '           <input type="radio" style="cursor:pointer;" name="cbSelectNotificationSound" onclick="$(\'.bwPersonalErrorAdministration\').bwPersonalErrorAdministration(\'cbSelectNotificationSound_click\', \'random\');" />&nbsp;';
            }
            html += '           <span style="cursor:pointer;" onclick="$(\'.bwPersonalErrorAdministration\').bwPersonalErrorAdministration(\'playNotificationSound\', \'random\');">';
            //html += '               <img src="images/playbutton.jpg" style="width:110px;height:70px;vertical-align:middle;" />';
            //html += '               <span style="font-size:40pt;font-weight:bold;">▶</span>';
            html += '               <img src="images/audio-play-button.png" style="width:110px;height:70px;vertical-align:middle;" />';
            html += '           </span>';
            html += '           <span style="cursor:pointer;" onclick="$(\'.bwPersonalErrorAdministration\').bwPersonalErrorAdministration(\'playNotificationSound\', \'random\');">Random</span>';
            html += '           <br />';
            if (bwSelectedNotificationSound == 'starpulse') {
                html += '           <input type="radio" checked="" style="cursor:pointer;" name="cbSelectNotificationSound" onclick="$(\'.bwPersonalErrorAdministration\').bwPersonalErrorAdministration(\'cbSelectNotificationSound_click\', \'starpulse\');" />&nbsp;';
            } else {
                html += '           <input type="radio" style="cursor:pointer;" name="cbSelectNotificationSound" onclick="$(\'.bwPersonalErrorAdministration\').bwPersonalErrorAdministration(\'cbSelectNotificationSound_click\', \'starpulse\');" />&nbsp;';
            }
            html += '           <span style="cursor:pointer;" onclick="$(\'.bwPersonalErrorAdministration\').bwPersonalErrorAdministration(\'playNotificationSound\', \'starpulse\');">';
            //html += '               <img src="images/playbutton.jpg" style="width:110px;height:70px;vertical-align:middle;" />';
            //html += '               <span style="font-size:40pt;font-weight:bold;">▶</span>';
            html += '               <img src="images/audio-play-button.png" style="width:110px;height:70px;vertical-align:middle;" />';
            html += '           </span>';
            html += '           <span style="cursor:pointer;" onclick="$(\'.bwPersonalErrorAdministration\').bwPersonalErrorAdministration(\'playNotificationSound\', \'starpulse\');">Star Pulse</span>';
            html += '           <br />';
            if (bwSelectedNotificationSound == 'cashregister') {
                html += '           <input type="radio" checked="" style="cursor:pointer;" name="cbSelectNotificationSound" onclick="$(\'.bwPersonalErrorAdministration\').bwPersonalErrorAdministration(\'cbSelectNotificationSound_click\', \'cashregister\');" />&nbsp;';
            } else {
                html += '           <input type="radio" style="cursor:pointer;" name="cbSelectNotificationSound" onclick="$(\'.bwPersonalErrorAdministration\').bwPersonalErrorAdministration(\'cbSelectNotificationSound_click\', \'cashregister\');" />&nbsp;';
            }
            html += '           <span style="cursor:pointer;" onclick="$(\'.bwPersonalErrorAdministration\').bwPersonalErrorAdministration(\'playNotificationSound\', \'cashregister\');">';
            //html += '               <img src="images/playbutton.jpg" style="width:110px;height:70px;vertical-align:middle;" />';
            //html += '               <span style="font-size:40pt;font-weight:bold;">▶</span>';
            html += '               <img src="images/audio-play-button.png" style="width:110px;height:70px;vertical-align:middle;" />';
            html += '           </span>';
            html += '           <span style="cursor:pointer;" onclick="$(\'.bwPersonalErrorAdministration\').bwPersonalErrorAdministration(\'playNotificationSound\', \'cashregister\');">Cash Register</span>';
            html += '           <br />';
            if (bwSelectedNotificationSound == 'crickets') {
                html += '           <input type="radio" checked="" style="cursor:pointer;" name="cbSelectNotificationSound" onclick="$(\'.bwPersonalErrorAdministration\').bwPersonalErrorAdministration(\'cbSelectNotificationSound_click\', \'crickets\');" />&nbsp;';
            } else {
                html += '           <input type="radio" style="cursor:pointer;" name="cbSelectNotificationSound" onclick="$(\'.bwPersonalErrorAdministration\').bwPersonalErrorAdministration(\'cbSelectNotificationSound_click\', \'crickets\');" />&nbsp;';
            }
            html += '           <span style="cursor:pointer;" onclick="$(\'.bwPersonalErrorAdministration\').bwPersonalErrorAdministration(\'playNotificationSound\', \'crickets\');">';
            //html += '               <img src="images/playbutton.jpg" style="width:110px;height:70px;vertical-align:middle;" />';
            //html += '               <span style="font-size:40pt;font-weight:bold;">▶</span>';
            html += '               <img src="images/audio-play-button.png" style="width:110px;height:70px;vertical-align:middle;" />';
            html += '           </span>';
            html += '           <span style="cursor:pointer;" onclick="$(\'.bwPersonalErrorAdministration\').bwPersonalErrorAdministration(\'playNotificationSound\', \'crickets\');">Crickets</span>';
            html += '       </td>';
            html += '   </tr>';
            html += '   <tr><td colspan="2">&nbsp;</td></tr>';
            html += '</table>';

            return html;

        } catch (e) {
            console.log('Exception in renderPersonalErrorAdministrationUI: ' + e.message + ', ' + e.stack);
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwPersonalErrorAdministration</span>';
            html += '<br />';
            html += '<span style="">Exception in bwPersonalErrorAdministration.renderPersonalErrorAdministrationUI(): ' + e.message + ', ' + e.stack + '</span>';
            thiz.element.html(html);
        }
    },
    cbSelectNotificationSound_click: function (selectedSound) {
        try {
            console.log('In bwPersonalErrorAdministration.js.cbSelectNotificationSound_click(). selectedSound: ' + selectedSound);

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            var data = {
                bwWorkflowAppId: workflowAppId,
                bwParticipantId: participantId,
                selectedSound: selectedSound
            };

            var operationUri = this.options.operationUriPrefix + "_bw/bwparticipant/updateuserconfigurationbehaviorselectednotificationsound";
            $.ajax({
                url: operationUri,
                type: "POST",
                data: data,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (results) {
                    try {

                        if (results.status != 'SUCCESS') {

                            var msg = 'Error in cbSelectNotificationSound_click(). ' + results.status + ', ' + results.message;
                            console.log(msg);
                            displayAlertDialog(msg);

                        } else {

                            var msg = 'Notification sound updated successfully in the database, but we still need to update the currently logged-in client(s).';
                            console.log(msg);
                            displayAlertDialog(msg);

                        }
                    } catch (e) {
                        console.log('Exception in bwPersonalErrorAdministration.js.cbSelectNotificationSound_click():2: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwPersonalErrorAdministration.js.cbSelectNotificationSound_click():2: ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    console.log('Error in bwPersonalErrorAdministration.js.cbSelectNotificationSound_click(): ' + errorCode + ' ' + errorMessage);
                    displayAlertDialog('Error in bwPersonalErrorAdministration.js.cbSelectNotificationSound_click(): ' + errorCode + ' ' + errorMessage);
                }
            });

        } catch (e) {
            console.log('Exception in bwPersonalErrorAdministration.js.cbSelectNotificationSound_click(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwPersonalErrorAdministration.js.cbSelectNotificationSound_click(): ' + e.message + ', ' + e.stack);
        }
    },
    checkIfWeNeedToPlayANotificationSound: function () {
        try {
            console.log('In bwPersonalErrorAdministration.js.checkIfWeNeedToPlayANotificationSound().');
            alert('In bwPersonalErrorAdministration.js.checkIfWeNeedToPlayANotificationSound(). forcereturncount: ' + forcereturncount);
            var thiz = this;
            //
            // Call the web service to see if we need to play a notification sound.
            // This is a GET call, which updates the BwParticipant table "bwThereIsANotificationForThisParticipant" value to false. We subsequently check the nModified value to determine if it was previously set to true.
            // This is about as much performance as we can get out of this I think! :)
            // bwThereIsANotificationForThisParticipant: Boolean
            //

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            var forcereturncount = 'false';
            if (this.options.NotificationCount == -1) { // This is how we are populating it the first time around.
                forcereturncount = 'true';
            }

            if (participantId) {
                $.ajax({
                    url: this.options.operationUriPrefix + '_bw/doweneedtomakeanotificationsound/' + workflowAppId + '/' + participantId + '/' + forcereturncount,
                    type: 'GET',
                    contentType: 'application/json',
                    success: function (results) {
                        try {

                            if (results.status != 'SUCCESS') {

                                var msg = 'Error in bwPersonalErrorAdministration.js.checkIfWeNeedToPlayANotificationSound(). ' + results.status + ', ' + results.message;
                                console.log(msg);
                                displayAlertDialog(msg);

                            } else {

                                if (results.hasOwnProperty('NotificationCount')) {
                                    //alert('xcx423234 NotificationCount: ' + JSON.stringify(results.NotificationCount));
                                    thiz.options.NotificationCount = results.NotificationCount;
                                    thiz.renderTopBarSpeechBubble2();
                                }

                                if (results.bwThereIsANotificationForThisParticipant && (results.bwThereIsANotificationForThisParticipant == true)) {

                                    console.log('In bwPersonalErrorAdministration.js.checkIfWeNeedToPlayANotificationSound(). Yes, play the sound. TEMPORARILY TURNED OFF<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
                                    thiz.playNotificationSound(); // Yes, play the sound!

                                } else {

                                    console.log('In bwPersonalErrorAdministration.js.checkIfWeNeedToPlayANotificationSound(). Don\'t play the sound.');

                                    //alert('xcx12353 playing the sound, although prob shouldnt be...');
                                    //thiz.playNotificationSound(); // Yes, play the sound!

                                }

                            }

                        } catch (e) {
                            console.log('Exception in bwPersonalErrorAdministration.js.checkIfWeNeedToPlayANotificationSound():2: ' + e.message + ', ' + e.stack);
                            displayAlertDialog('Exception in bwPersonalErrorAdministration.js.checkIfWeNeedToPlayANotificationSound():2: ' + e.message + ', ' + e.stack);
                        }
                    },
                    error: function (data, errorCode, errorMessage) {
                        console.log('Error in bwPersonalErrorAdministration.js.checkIfWeNeedToPlayANotificationSound(). data: ' + JSON.stringify(data) + ', ' + errorCode + ', ' + errorMessage);
                        displayAlertDialog('Error in bwPersonalErrorAdministration.js.checkIfWeNeedToPlayANotificationSound(). data: ' + JSON.stringify(data) + ', ' + errorCode + ', ' + errorMessage);
                    }
                });
            }

        } catch (e) {
            console.log('Exception in bwPersonalErrorAdministration.js.checkIfWeNeedToPlayANotificationSound(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwPersonalErrorAdministration.js.checkIfWeNeedToPlayANotificationSound(): ' + e.message + ', ' + e.stack);
        }
    },
    playNotificationSound: function (sound) {
        try {
            console.log('In bwPersonalErrorAdministration.js.playNotificationSound().');

            // If a sound gets passed, use it, otherwise look up the one the user has selected.
            var selectedSound;

            if (sound) {
                selectedSound = sound;
            } else {
                selectedSound = $('.bwAuthentication').bwAuthentication('option', 'bwSelectedNotificationSound');
            }

            if (!selectedSound) {
                selectedSound = 'random'; // Default.
            }

            var elementId = 'audio_bwPersonalErrorAdministration';
            var audioElement = document.getElementById(elementId);

            var sourceElement; // = audioElement.getElementsByTagName('source')[0];

            if (!audioElement) {

                audioElement = document.createElement('audio');
                audioElement.id = elementId;

                sourceElement = document.createElement('source');

                sourceElement.src = 'CashRegisterSound.mp3'; // Default.


                sourceElement.type = 'audio/mpeg';
                audioElement.appendChild(sourceElement);

                document.body.appendChild(audioElement); // Place at beginning of the body element in the document.

            }

            if (!sourceElement) {
                sourceElement = audioElement.getElementsByTagName('source')[0];
            }
            debugger;
            switch (selectedSound) {
                case 'random':

                    alert('In bwPersonalErrorAdministration.js.playNotificationSound(). PLAYING A RANDOM SOUND.');

                    var soundsArray = ['bwDefaultAlertSound1.mp3', 'CashRegisterSound.mp3', 'crickets.mp3'];

                    var min = 1;
                    var max = soundsArray.length - 1;
                    var bwSoundIndex;

                    if (this.options.bwSoundIndex) {

                        bwSoundIndex = Math.floor(Math.random() * (max - min + 1) + min);
                        if (bwSoundIndex == this.options.bwSoundIndex) {
                            bwSoundIndex = Math.floor(Math.random() * (max - min + 1) + min); // Do it again to lessen the chance of playing the same sound twice. Ideally we would use an aray to make sure each sound gets played as much as any other! Coming soon...
                        }

                    } else {

                        bwSoundIndex = Math.floor(Math.random() * (max - min + 1) + min);

                    }
                    this.options.bwSoundIndex = bwSoundIndex;

                    //alert('bwSoundIndex: ' + bwSoundIndex);

                    sourceElement.src = soundsArray[bwSoundIndex];

                    alert('In bwPersonalErrorAdministration.js.playNotificationSound(). PLAYING A RANDOM SOUND. bwSoundIndex: ' + bwSoundIndex + ', selectedSound: ' + selectedSound);

                    break;
                case 'starpulse':
                    sourceElement.src = 'bwDefaultAlertSound1.mp3';
                    break;
                case 'cashregister':
                    sourceElement.src = 'CashRegisterSound.mp3';
                    break;
                case 'crickets':
                    //alert('xcx2123 cickets');
                    sourceElement.src = 'crickets.mp3';
                    break;
                default:
                    // do nothing.?
                    break;
            }


            audioElement.play();



















            //console.log('In bwPersonalErrorAdministration.js.playNotificationSound(). selectedSound: ' + selectedSound);
            //alert('In bwPersonalErrorAdministration.js.playNotificationSound(). selectedSound: ' + selectedSound);

            //if (selectedSound && (selectedSound != 'nosound')) {

            //    var expectedSounds = ['nosound', 'random', 'starpulse', 'cashregister', 'crickets'];
            //    if (expectedSounds.indexOf(selectedSound) > -1) {

            //        //alert('Adding audio element and playing');

            //        var elementId = 'audio_bwPersonalErrorAdministration';
            //        var audio = document.getElementById(elementId);
            //        var source;

            //        if (!audio) {

            //            audio = document.createElement('audio');
            //            audio.id = elementId;

            //            source = document.createElement('source');

            //            //source.src = 'CashRegisterSound.mp3';


            //            source.type = 'audio/mpeg';
            //            audio.appendChild(source);

            //            document.body.prepend(audio); // Place at beginning of the body element in the document.

            //        }

            //        if (!source) {
            //            source = audio.getElementsByTagName('source')[0];
            //        }

            //        switch (selectedSound) {
            //            case 'random':

            //                alert('In bwPersonalErrorAdministration.js.playNotificationSound(). PLAYING A RANDOM SOUND.');

            //                var soundsArray = ['bwDefaultAlertSound1.mp3', 'CashRegisterSound.mp3', 'crickets.mp3'];

            //                var min = 1;
            //                var max = soundsArray.length - 1;
            //                var bwSoundIndex;

            //                if (this.options.bwSoundIndex) {

            //                    bwSoundIndex = Math.floor(Math.random() * (max - min + 1) + min);
            //                    if (bwSoundIndex == this.options.bwSoundIndex) {
            //                        bwSoundIndex = Math.floor(Math.random() * (max - min + 1) + min); // Do it again to lessen the chance of playing the same sound twice. Ideally we would use an aray to make sure each sound gets played as much as any other! Coming soon...
            //                    }

            //                } else {

            //                    bwSoundIndex = Math.floor(Math.random() * (max - min + 1) + min);

            //                }
            //                this.options.bwSoundIndex = bwSoundIndex;

            //                //alert('bwSoundIndex: ' + bwSoundIndex);

            //                source.src = soundsArray[bwSoundIndex];

            //                alert('In bwPersonalErrorAdministration.js.playNotificationSound(). PLAYING A RANDOM SOUND. bwSoundIndex: ' + bwSoundIndex);

            //                break;
            //            case 'starpulse':
            //                source.src = 'bwDefaultAlertSound1.mp3';
            //                break;
            //            case 'cashregister':
            //                source.src = 'CashRegisterSound.mp3';
            //                break;
            //            case 'crickets':
            //                source.src = 'crickets.mp3';
            //                break;
            //            default:
            //                // do nothing.?
            //                break;
            //        }

            //        console.log('In bwPersonalErrorAdministration.js.playNotificationSound(). Playing "' + source.src + '".');
            //        audio.play();

            //    } else {

            //        console.log('Unexpected value in bwPersonalErrorAdministration.js.playNotificationSound(). selectedSound: ' + selectedSound);
            //        displayAlertDialog('Unexpected value in bwPersonalErrorAdministration.js.playNotificationSound(). selectedSound: ' + selectedSound);

            //    }

            //}






            // 1-22-2022
            //
            // https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement/Audio
            //




            //function playAudio() {
            //x.play();
            //}

            //function pauseAudio() {
            //    x.pause();
            //}

        } catch (e) {
            console.log('Exception in bwPersonalErrorAdministration.js.playNotificationSound(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwPersonalErrorAdministration.js.playNotificationSound(): ' + e.message + ', ' + e.stack);
        }
    },

    slideOutAndDisplayNotificationsPanel: function () {
        try {
            console.log('In bwPersonalErrorAdministration.js.slideOutAndDisplayNotificationsPanel().');
            var thiz = this;

            var div = document.getElementById('bwActiveMenu_SlidingNotificationsPanel');

            if (!div) {

                div = document.createElement('div');
                div.id = 'bwActiveMenu_SlidingNotificationsPanel';
                div.style.display = 'none';
                div.style.backgroundColor = 'gray';
                div.style.zIndex = 99999;
                div.style.opacity = 0.95;
                document.body.appendChild(div); // Place at end of document

                var width = $(window).width();
                var height = $(window).height();

                var notificationsPanel_Width = 500;

                div.style.height = height + 'px';

                div.style.position = 'absolute';
                div.style.left = 0;
                div.style.top = 0;


                var html = '';

                html += '<style>';

                html += '.slideRight {';
                html += '    transform: translate3d(-' + notificationsPanel_Width + 'px, 0, 0);';
                html += '    -webkit-transform: translate3d(-' + notificationsPanel_Width + 'px, 0, 0);';
                html += '    -webkit-transition: transform 1s ease;';
                html += '}';

                html += '.slideRight.animate_SlideRight {';
                html += '    transform: translate3d(' + (width - notificationsPanel_Width) + 'px, 0, 0);';
                html += '    -webkit-transform: translate3d(' + (width - notificationsPanel_Width) + 'px, 0, 0);';
                html += '    -webkit-transition: transform 1s ease;';
                html += '}';

                html += '</style>';

                html += '<br />';
                html += '<div class="dialogXButton" style="font-size:25pt;cursor:pointer;width:100%;font-weight:bold;float:right;" onclick="$(\'.bwPersonalErrorAdministration\').bwPersonalErrorAdministration(\'slideOutAndDisplayNotificationsPanel\');">Notifications          X</div>';
                html += '<br />';
                html += '<br />';
                //html += 'Clear all notifications'; // TrashbinNotification

                html += '<br />';
                html += '<span onclick="$(\'.bwPersonalErrorAdministration\').bwPersonalErrorAdministration(\'TrashbinNotification\', \'' + 'ALL' + '\');" style="cursor:pointer;font-size:15pt;font-weight:normal;text-decoration:underline;color:blue;cursor:pointer;background-color:white;" >Clear all notifications</span>';


                html += '<br />';
                html += '<span style="cursor:pointer;font-size:15pt;font-weight:normal;cursor:pointer;background-color:white;" >';
                html += '<input type="checkbox" selected="selected" style="cursor:pointer;" />&nbsp;hide my notifications';
                html += '</span>';




                html += '<br />';
                html += '<br />';



                //html += '<div style="margin:25px 25px 25px 25px;background-color:darkgray;padding:15px 15px 15px 15px;width:350px;">';
                //html += 'Todd Hiltz submitted a new Budget Request for you to review.';
                //html += '</div>';


                //html += '<div style="margin:25px 25px 25px 25px;background-color:darkgray;padding:15px 15px 15px 15px;width:350px;">';
                //html += 'A one-time reminder was sent for request "Go to the Dentist".';
                //html += '</div>';





                html += '<div id="bwPersonalErrorAdministration_SlidingNotificationsPanel_Content"></div>'; // This is where we display all of the items.

                html += '';
                html += '';
                html += '';
                html += '';
                html += '';
                html += '';
                html += '';
                html += '';
                html += '';

                div.innerHTML = html;

                div.style.display = 'inline-block';

                div.classList.add('slideRight');

                // Slide right.
                setTimeout(function () {
                    $(div).toggleClass('animate_SlideRight');
                }, 150);

                var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
                var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                var data = {
                    bwParticipantId_LoggedIn: participantId,
                    bwActiveStateIdentifier: activeStateIdentifier,
                    bwWorkflowAppId_LoggedIn: workflowAppId,

                    bwWorkflowAppId: workflowAppId
                };

                $.ajax({
                    url: this.options.operationUriPrefix + '_bw/getaiconversationlogfororganization',
                    type: 'POST',
                    data: data,
                    headers: {
                        "Accept": "application/json; odata=verbose"
                    },
                    success: function (results) {
                        try {

                            var html = '';

                            if (!(results.result && results.result.length)) {

                                // Must be a new user. Nothing to talk about yet!
                                html += '<div style="margin:25px 25px 25px 25px;background-color:white;padding:15px 15px 15px 15px;width:350px;">';
                                html += 'This must be a new organization, or all of the entries have been deleted/addressed. There is nothing to talk about yet.';
                                html += '</div>';

                            } else {

                                //html += '<ul>';
                                //for (var i = 0; i < results.result.length; i++) {
                                //    html += '<li>' + results.result[i].Action_Message + '</li>';
                                //}
                                //html += '</ul>';

                                thiz.options.NotificationCount = results.result.length;
                                thiz.renderTopBarSpeechBubble2();

                                for (var i = 0; i < results.result.length; i++) {


                                    //displayAlertDialog('xcx2132354 results.result[i]: ' + JSON.stringify(results.result[i]));
                                    html += '<div style="margin:25px 25px 25px 25px;background-color:white;padding:15px 15px 15px 15px;width:350px;">';





                                    //html += '<span onclick="alert(\'trashbin xcx3321\');" style="cursor:pointer;font-size:30pt;" >🗑&nbsp;</span>';
                                    html += '<span onclick="$(\'.bwPersonalErrorAdministration\').bwPersonalErrorAdministration(\'TrashbinNotification\', \'' + results.result[i].bwAIConversation_UserActionsLogId + '\');" style="cursor:pointer;font-size:30pt;font-weight:bold;" >X&nbsp;</span>';







                                    var timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(results.result[i].Timestamp);
                                    html += '<span style="color:cornflowerblue;font-size:12pt;font-weight:normal;">' + timestamp4.toString() + '</span>';

                                    html += '<br />';

                                    html += '<span style="color:purple;font-weight:bold;cursor:pointer;" ';
                                    html += ' onclick="$(\'.bwCircleDialog2\').bwCircleDialog2(\'displayParticipantRoleMultiPickerInACircle\', true, \'\', \'' + results.result[i].ParticipantId + '\', \'' + results.result[i].ParticipantFriendlyName + '\', \'' + results.result[i].ParticipantEmail + '\', \'undefined\');" ';
                                    html += '>' + results.result[i].ParticipantFriendlyName + '</span>';

                                    html += '<br />';

                                    //html += '&nbsp;APPROVED/xcx555543&nbsp;';
                                    //html += '<span>' + results.result[i].Action_Message + '</span>';




                                    //
                                    // Action_Message
                                    //

                                    html += '<span xcx="xcx123478" style="color:blue;text-decoration:underline;cursor:pointer;font-weight:bold;" onclick="';
                                    html += '$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'' + results.result[i].bwBudgetRequestId + '\', \'BR-230011\', \'Hive #1\', \'BR-230011\', \'undefined\', \'xcx_bwWorkflowTaskItemId_novaluexcx12312\');';
                                    //html += '" >"' + results.result[i].ProjectTitle + '"</span>';
                                    html += '" >"' + results.result[i].Action_Message + '"</span>';

                                    //
                                    // end: Action_Message
                                    //


                                    html += '<br />';
                                    html += '<img class="gridMagnifyingGlass" src="/images/zoom.jpg" style="width:25px;height:25px;float:right;">';

                                    //
                                    // This is some other useful json accessible like: results.result[i].Action 4-14-2023.
                                    // "Action":"saved/published","Action_ObjectContext":"request","Action_Message":"Todd Hiltz has saved/published request undefined: \"rtsrt - sound test\"
                                    //

                                    html += '</div>';
                                }

                            }

                            //displayAlertDialog(html);

                            document.getElementById('bwPersonalErrorAdministration_SlidingNotificationsPanel_Content').innerHTML = html;

                        } catch (e) {
                            console.log('Exception in bwPersonalErrorAdministration.js.slideOutAndDisplayNotificationsPanel(): ' + e.message + ', ' + e.stack);
                            displayAlertDialog('Exception in bwPersonalErrorAdministration.js.slideOutAndDisplayNotificationsPanel(): ' + e.message + ', ' + e.stack);
                        }
                    },
                    error: function (data, errorCode, errorMessage) {
                        displayAlertDialog('Error in bwPersonalErrorAdministration.js.slideOutAndDisplayNotificationsPanel():' + errorCode + ', ' + errorMessage);
                    }
                });

            } else {

                // Slide left.
                $(div).toggleClass('animate_SlideRight');

                setTimeout(function () {
                    div.remove(); // This is very important, because if the div is not removed, the next time th euser goes to look at it, the data will NOT have been refreshed. The setTimeout gives the UI time to slide across the screen in a visually pleasing way. 4-14-2023.
                }, 1000);

            }

        } catch (e) {
            console.log('Exception in bwPersonalErrorAdministration.js.slideOutAndDisplayNotificationsPanel(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwPersonalErrorAdministration.js.slideOutAndDisplayNotificationsPanel(): ' + e.message + ', ' + e.stack);
        }
    },

    slideOutAndDisplayNotificationsPanel_Email: function () {
        try {
            console.log('In bwPersonalErrorAdministration.js.slideOutAndDisplayNotificationsPanel_Email().');
            var thiz = this;

            alert('This functionality is incomplete. Coming Soon!');

        } catch (e) {
            console.log('Exception in bwPersonalErrorAdministration.js.slideOutAndDisplayNotificationsPanel_Email(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwPersonalErrorAdministration.js.slideOutAndDisplayNotificationsPanel_Email(): ' + e.message + ', ' + e.stack);
        }
    },
    slideOutAndDisplayNotificationsPanel_Telephone: function () {
        try {
            console.log('In bwPersonalErrorAdministration.js.slideOutAndDisplayNotificationsPanel_Telephone().');
            var thiz = this;

            alert('This functionality is incomplete. Coming Soon!');

        } catch (e) {
            console.log('Exception in bwPersonalErrorAdministration.js.slideOutAndDisplayNotificationsPanel_Telephone(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwPersonalErrorAdministration.js.slideOutAndDisplayNotificationsPanel_Telephone(): ' + e.message + ', ' + e.stack);
        }
    },




    TrashbinNotification: function (bwAIConversation_UserActionsLogId) {
        try {
            console.log('In TrashbinNotification(). Mark this record, with TrashBin = true. bwAIConversation_UserActionsLogId: ' + bwAIConversation_UserActionsLogId);
            var thiz = this;

            // Mark this record, bwAIConversation_UserActionsLogId, with TrashBin = true.
            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

            var data = {
                bwParticipantId_LoggedIn: participantId,
                bwActiveStateIdentifier: activeStateIdentifier,
                bwWorkflowAppId_LoggedIn: workflowAppId,

                bwWorkflowAppId: workflowAppId,
                bwAIConversation_UserActionsLogId: bwAIConversation_UserActionsLogId
            };

            $.ajax({
                url: this.options.operationUriPrefix + '_bw/deleteFromAIConversation_UserActionsLog',
                type: 'POST',
                data: data,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (results) {
                    try {

                        if (results.status != 'SUCCESS') {

                            displayAlertDialog('xcx231234234 FAILED. results: ' + JSON.stringify(results));

                        } else {

                            //displayAlertDialog('xcx231234234 SUCCESS. results: ' + JSON.stringify(results));

                            thiz.slideOutAndDisplayNotificationsPanel(); // In

                            ShowActivitySpinner('Deleting notification...');
                            setTimeout(function () {

                                thiz.slideOutAndDisplayNotificationsPanel(); // Back out.
                                HideActivitySpinner();
                            }, 1000);


                        }

                    } catch (e) {
                        console.log('Exception in bwPersonalErrorAdministration.js.TrashbinNotification(): ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwPersonalErrorAdministration.js.TrashbinNotification(): ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    displayAlertDialog('Error in bwPersonalErrorAdministration.js.TrashbinNotification():' + errorCode + ', ' + errorMessage);
                }
            });


        } catch (e) {
            console.log('Exception in TrashbinNotification().');
            displayAlertDialog('Exception in TrashbinNotification().');
        }
    },

});