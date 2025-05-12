$.widget("bw.bwNotificationSound", {
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
        This is the bwNotificationSound.js jQuery Widget. 
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

        bwNotificationSoundMuted: null, // This is a value we should get from the database. We should persist if the user has decided to mute the notification sound. 3-18-2024.

        operationUriPrefix: null
    },
    _create: function () {
        this.element.addClass("bwNotificationSound");
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


            //this.renderFavicon(false); // This is where the favicon is initialized (with no red dot).

            console.log('In bwNotificationSound._create(). The widget has been initialized. Favicon has been initialized.');
            //alert('In bwNotificationSound._create(). The widget has been initialized.');

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwNotificationSound</span>';
            html += '<br />';
            html += '<span style="">Exception in bwNotificationSound.Create(): ' + e.message + ', ' + e.stack + '</span>';
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
            .removeClass("bwNotificationSound")
            .text("");
    },
    getData: function () {
        try {
            console.log('In bwNotificationSound.getData().');
            ////debugger;
            ////Come back and build out the JSON for this!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 7-27-2020
            //var value = $(this.element).find('#txtProjectManagerName')[0].value;
            return 'xcx12432341253';
        } catch (e) {
            console.log('Exception in bwNotificationSound.getData(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwNotificationSound.getData(): ' + e.message + ', ' + e.stack);
        }
    },

    renderFavicon: function (displayTheReddot) {
        try {
            // This sets the favicon. We are displaying the currency. With a red dot when there are tasks for the user to perform.
            // "selectedCurrencySymbol" is expected to exist as a global variable.
            console.log('In bwNotificationSound.js.renderFavicon().');
            //alert('In bwNotificationSound.js.renderFavicon().');

            var currencySymbolFavicon = '';
            if (displayTheReddot == true) {
                switch (selectedCurrencySymbol) {
                    case 'Dollar':
                        currencySymbolFavicon = 'favicon-dollar-reddot.ico';
                        break;
                    case 'Pound':
                        currencySymbolFavicon = 'favicon-pound-reddot.ico';
                        break;
                    case 'Euro':
                        currencySymbolFavicon = 'favicon-euro-reddot.ico';
                        break;
                    case 'Rand':
                        currencySymbolFavicon = 'favicon-rand-reddot.ico';
                        break;
                    case 'Franc':
                        currencySymbolFavicon = 'favicon-franc-reddot.ico';
                        break;
                    case 'Yen':
                        currencySymbolFavicon = 'favicon-yen-reddot.ico';
                        break;
                    case 'Rouble':
                        currencySymbolFavicon = 'favicon-rouble-reddot.ico';
                        break;
                    case 'Peso':
                        currencySymbolFavicon = 'favicon-peso-reddot.ico';
                        break;
                    case 'Rupee':
                        currencySymbolFavicon = 'favicon-rupee-reddot.ico';
                        break;
                    case 'Guilder':
                        currencySymbolFavicon = 'favicon-guilder-reddot.ico';
                        break;
                    default:
                        currencySymbolFavicon = 'favicon.ico';
                        break;
                }
            } else {
                switch (selectedCurrencySymbol) {
                    case 'Dollar':
                        currencySymbolFavicon = 'favicon-dollar.ico';
                        break;
                    case 'Pound':
                        currencySymbolFavicon = 'favicon-pound.ico';
                        break;
                    case 'Euro':
                        currencySymbolFavicon = 'favicon-euro.ico';
                        break;
                    case 'Rand':
                        currencySymbolFavicon = 'favicon-rand.ico';
                        break;
                    case 'Franc':
                        currencySymbolFavicon = 'favicon-franc.ico';
                        break;
                    case 'Yen':
                        currencySymbolFavicon = 'favicon-yen.ico';
                        break;
                    case 'Rouble':
                        currencySymbolFavicon = 'favicon-rouble.ico';
                        break;
                    case 'Peso':
                        currencySymbolFavicon = 'favicon-peso.ico';
                        break;
                    case 'Rupee':
                        currencySymbolFavicon = 'favicon-rupee.ico';
                        break;
                    case 'Guilder':
                        currencySymbolFavicon = 'favicon-guilder.ico';
                        break;
                    default:
                        currencySymbolFavicon = 'favicon.ico';
                        break;
                }
            }
            document.getElementById('bwFavicon').href = this.options.operationUriPrefix + currencySymbolFavicon;

        } catch (e) {
            console.log('Exception in bwNotificationSound.renderFavicon(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwNotificationSound.renderFavicon(): ' + e.message + ', ' + e.stack);
        }
    },

    renderTopBarUserSettings: function () {
        try {
            console.log('In bwNotificationSound.js.renderTopBarUserSettings().');

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');
            var participantRole = $('.bwAuthentication').bwAuthentication('option', 'participantRole');

            var html = '';

            html += '<style>';

            html += '   .bwNotificationSound_UserSettings {';
            html += '       display:table;';
            html += '       float:right;';
            html += '       margin-top:4px;'; // margin-top here is how we are vertically centering the element.
            html += '   }';

            html += '   .bwNotificationSound_UserSettings_Slider {';
            html += '       display:table-cell;';
            html += '       vertical-align: middle;';
            html += '       cursor:pointer;';
            html += '       width: 50px;';
            html += '   }';

            html += '   .bwNotificationSound_UserSettings_Slider:hover {';
            html += '       background-color:lightgray;';
            html += '       border-radius:30px 30px 30px 30px;';
            html += '       width: fit-content;'; // This is some cool css!
            html += '   }';

            html += '   .bwNotificationSound_UserSettings_VolumeIndicator {';
            html += '       display:none;';
            html += '   }';

            html += '   .bwNotificationSound_UserSettings_Slider:hover > .bwNotificationSound_UserSettings_VolumeIndicator {'; // If it's inside the element, use ">". If it is outside, use "+".
            html += '       display: inline-block;';
            html += '   }';

            html += '</style>';

            html += '<div id="bwNotificationSound_UserSettings" class="bwNotificationSound_UserSettings" onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayLoggedInUserDropDownInACircle\', true);" >';
            html += '   <div id="bwNotificationSound_UserSettings_Slider" class="bwNotificationSound_UserSettings_Slider" >';

            html += '           <div class="bwNotificationSound_UserSettings_VolumeIndicator" style="padding:10px 10px 5px 15px;">'; // border:2px solid yellow;
            html += participantFriendlyName + ' has the security role of  "' + participantRole + '" in this organization.';
            html += '           </div>';





            //var smallHeadPath = '/_files/' + workflowAppId + '/participantimages/' + participantId + '/' + 'userimage_50x50px.png';

            if (this.options.bwNotificationSoundMuted && (this.options.bwNotificationSoundMuted == true)) {
                html += '       <img id="bwNotificationSound_UserSettings_Slider_UserImage" src="/images/head_35x35_black.png" style="height:42px;float:right;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayLoggedInUserDropDownInACircle\', true);" />';
            } else {
                html += '       <img id="bwNotificationSound_UserSettings_Slider_UserImage" src="/images/head_35x35_black.png" style="height:42px;float:right;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayLoggedInUserDropDownInACircle\', true);" />';
            }

            html += '   </div>';
            html += '&nbsp;&nbsp;&nbsp;&nbsp;'; // This provides some spacing.
            html += '</div>';

            return html;



            //
            // This backfills the user small circle icon in the top bar. Trying to standardize this chunk of code so it can be used throughout. 12-27-2023.
            //

            //var lookForImage = function (imageElement, imagePath) {
            //    return new Promise(function (resolve, reject) {
            //        $.get(imagePath).done(function () {
            //            var img = new Image();
            //            img.src = imagePath;
            //            img.onload = function (e) {
            //                try {
            //                    // The image loaded, so it actually exists! It exists, so display it...
            //                    $(imageElement).attr('src', imagePath);

            //                    $(imageElement).off('mouseout').mouseout(function (error) {
            //                        console.log('In bwActiveMenu.js.xx.lookForImage.mouseout():1.');
            //                        this.src = imagePath; // Mouseout replaces the image with the actual one.
            //                    });

            //                } catch (e) {

            //                    console.log('Exception in bwActiveMenu.js.xx.lookForImage.img.onload(): ' + e.message + ', ' + e.stack);

            //                    $(imageElement).attr('src', '/images/head_35x35_black.png');

            //                    $(imageElement).off('mouseout').mouseout(function (error) {
            //                        console.log('In bwActiveMenu.js.xx.lookForImage.mouseout():2.');
            //                        this.src = '/images/head_35x35_black.png'; // Mouseout replaces the image with the actual one.
            //                    });

            //                    reject();
            //                }
            //            }
            //        }).fail(function () {

            //            $(imageElement).attr('src', '/images/head_35x35_black.png');

            //            $(imageElement).off('mouseout').mouseout(function (error) {
            //                console.log('In bwActiveMenu.js.xx.lookForImage.mouseout():3.');
            //                this.src = '/images/head_35x35_black.png'; // Mouseout replaces the image with the actual one.
            //            });

            //            resolve();
            //        });
            //    });
            //}

            //var imageElement = $('#bwNotificationSound_UserSettings_Slider_UserImage');
            //var smallHeadPath = '/_files/' + workflowAppId + '/participantimages/' + participantId + '/' + 'userimage_50x50px.png';

            //lookForImage(imageElement, smallHeadPath);

            //
            // end: This backfills the user small circle icon in the top bar. Trying to standardize this chunk of code so it can be used throughout.
            //

        } catch (e) {
            console.log('Exception in bwNotificationSound.js.renderTopBarUserSettings(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwNotificationSound.js.renderTopBarUserSettings(): ' + e.message + ', ' + e.stack);
        }
    },
    volumeControl_OnMouseEnterxx: function () {
        try {
            console.log('In bwNotificationSound.js.volumeControl_OnMouseEnter(). THIS FUNCTIONALITY IS INCOMPLETE. CURRENTLY THE SOUND CAN ONLY BE TURNED ON OR OFF (MUTED).');
            //alert('In bwNotificationSound.js.volumeControl_OnMouseEnter().');


        } catch (e) {
            console.log('Exception in bwNotificationSound.js.volumeControl_OnMouseEnter(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwNotificationSound.js.volumeControl_OnMouseEnter(): ' + e.message + ', ' + e.stack);
        }
    },
    volumeControl_OnClickxx: function () {
        try {
            console.log('In bwNotificationSound.js.volumeControl_OnClick().');
            var thiz = this;

            var image = document.getElementById('bwNotificationSound_VolumeControl_Slider_SpeakerImage');

            if (image.src.indexOf('speaker.png') > -1) {

                console.log('In bwNotificationSound.js.volumeControl_OnClick(). NOTIFICATION SOUNDS HAVE BEEN MUTED.');
                image.src = 'images/speaker_muted.png';
                this.options.bwNotificationSoundMuted = true; //  bwNotificationSoundMuted: null, // This is a value we should get from the database. We should persist if the user has decided to mute the notification sound. 3-18-2024.

                var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

                var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                data = {
                    bwParticipantId_LoggedIn: participantId,
                    bwActiveStateIdentifier: activeStateIdentifier,
                    bwWorkflowAppId_LoggedIn: workflowAppId,

                    bwNotificationSoundMuted: true
                };
                var operationUri = this.options.operationUriPrefix + "_bw/bwparticipant/updateuserconfigurationbehaviornotificationsoundmuted";
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

                                var msg = 'Error in bwNotificationSound.js.volumeControl_OnClick(). ' + results.status + ', ' + results.message;
                                console.log(msg);
                                displayAlertDialog(msg);

                            } else {

                                //var msg = 'Notification sound updated successfully in the database, but we still need to update the currently logged-in client(s).';
                                //console.log(msg);
                                //displayAlertDialog(msg);

                            }

                        } catch (e) {
                            console.log('Exception in bwNotificationSound.js.volumeControl_OnClick():2: ' + e.message + ', ' + e.stack);
                            displayAlertDialog('Exception in bwNotificationSound.js.volumeControl_OnClick():2: ' + e.message + ', ' + e.stack);
                        }
                    },
                    error: function (data, errorCode, errorMessage) {
                        console.log('Error in bwNotificationSound.js.volumeControl_OnClick(): ' + errorCode + ' ' + errorMessage);
                        displayAlertDialog('Error in bwNotificationSound.js.volumeControl_OnClick(): ' + errorCode + ' ' + errorMessage);
                    }
                });

            } else if (image.src.indexOf('speaker_muted.png') > -1) {

                console.log('In bwNotificationSound.js.volumeControl_OnClick(). NOTIFICATION SOUNDS HAVE BEEN TURNED ON.');
                image.src = 'images/speaker.png';
                this.options.bwNotificationSoundMuted = false; //  bwNotificationSoundMuted: null, // This is a value we should get from the database. We should persist if the user has decided to mute the notification sound. 3-18-2024.

                var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

                var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                data = {
                    bwParticipantId_LoggedIn: participantId,
                    bwActiveStateIdentifier: activeStateIdentifier,
                    bwWorkflowAppId_LoggedIn: workflowAppId,

                    bwNotificationSoundMuted: false
                };
                var operationUri = this.options.operationUriPrefix + "_bw/bwparticipant/updateuserconfigurationbehaviornotificationsoundmuted";
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

                                var msg = 'Error in bwNotificationSound.js.volumeControl_OnClick(). ' + results.status + ', ' + results.message;
                                console.log(msg);
                                displayAlertDialog(msg);

                            } else {

                                //var msg = 'Notification sound updated successfully in the database, but we still need to update the currently logged-in client(s).';
                                //console.log(msg);
                                //displayAlertDialog(msg);

                            }

                        } catch (e) {
                            console.log('Exception in bwNotificationSound.js.volumeControl_OnClick():2: ' + e.message + ', ' + e.stack);
                            displayAlertDialog('Exception in bwNotificationSound.js.volumeControl_OnClick():2: ' + e.message + ', ' + e.stack);
                        }
                    },
                    error: function (data, errorCode, errorMessage) {
                        console.log('Error in bwNotificationSound.js.volumeControl_OnClick(): ' + errorCode + ' ' + errorMessage);
                        displayAlertDialog('Error in bwNotificationSound.js.volumeControl_OnClick(): ' + errorCode + ' ' + errorMessage);
                    }
                });

            } else {

                var msg = 'Error in bwNotificationSound.js.volumeControl_OnClick(). Could not identify speaker image.';
                console.log(msg);
                displayAlertDialog(msg);

            }

        } catch (e) {
            console.log('Exception in bwNotificationSound.js.volumeControl_OnClick(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwNotificationSound.js.volumeControl_OnClick(): ' + e.message + ', ' + e.stack);
        }
    },



    renderTopBarVolumeControl: function () {
        try {
            console.log('In bwNotificationSound.js.renderTopBarVolumeControl().');

            var html = '';

            html += '<style>';

            html += '   .bwNotificationSound_VolumeControl {';
            html += '       display:table;';
            html += '       float:right;';
            html += '       margin-top:4px;'; // margin-top here is how we are vertically centering the element.
            html += '   }';

            html += '   .bwNotificationSound_VolumeControl_Slider {';
            html += '       display:table-cell;';
            html += '       vertical-align: middle;';
            html += '       cursor:pointer;';
            html += '       width: 50px;';
            html += '   }';

            html += '   .bwNotificationSound_VolumeControl_Slider:hover {';
            html += '       background-color:lightgray;';
            html += '       border-radius:30px 30px 30px 30px;';
            html += '       width: 200px;';
            html += '   }';

            html += '   .bwNotificationSound_VolumeControl_VolumeIndicator {';
            html += '       display:none;';
            html += '   }';

            html += '   .bwNotificationSound_VolumeControl_Slider:hover > .bwNotificationSound_VolumeControl_VolumeIndicator {'; // If it's inside the element, use ">". If it is outside, use "+".
            html += '       display: inline-block;';
            html += '   }';

            html += '</style>';

            html += '<div id="bwNotificationSound_VolumeControl" class="bwNotificationSound_VolumeControl" onclick="$(\'.bwNotificationSound\').bwNotificationSound(\'volumeControl_OnClick\');" >';
            html += '   <div id="bwNotificationSound_VolumeControl_Slider" class="bwNotificationSound_VolumeControl_Slider" >';

            html += '       <div class="bwNotificationSound_VolumeControl_VolumeIndicator" style="padding:16px 15px 12px 15px;">';
            html += '           <div class="bwNotificationSound_VolumeControl_VolumeIndicator_Slider" style="background-color:black;height:10px;border-radius:5px 5px 5px 5px;" >'; // onmouseenter="$(\'.bwNotificationSound\').bwNotificationSound(\'volumeControl_OnMouseEnter\');"
            html += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
            html += '           </div>';
            html += '       </div>';

            if (this.options.bwNotificationSoundMuted && (this.options.bwNotificationSoundMuted == true)) {
                html += '       <img id="bwNotificationSound_VolumeControl_Slider_SpeakerImage" src="images/speaker_muted.png" style="height:42px;float:right;" />'; // onclick="$(\'.bwNotificationSound\').bwNotificationSound(\'volumeControl_OnClick\');"
            } else {
                html += '       <img id="bwNotificationSound_VolumeControl_Slider_SpeakerImage" src="images/speaker.png" style="height:42px;float:right;" />'; // onclick="$(\'.bwNotificationSound\').bwNotificationSound(\'volumeControl_OnClick\');"
            }

            html += '   </div>';
            html += '&nbsp;&nbsp;&nbsp;&nbsp;'; // This provides some spacing.
            html += '</div>';

            return html;

        } catch (e) {
            console.log('Exception in bwNotificationSound.js.renderTopBarVolumeControl(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwNotificationSound.js.renderTopBarVolumeControl(): ' + e.message + ', ' + e.stack);
        }
    },

    renderPullBackAllPoppedOutWindowsToMasterWindow: function () { // 
        try {
            console.log('In bwNotificationSound.js.renderPullBackAllPoppedOutWindowsToMasterWindow().');

            var html = '';

            //html += '<style>';

            //html += '   .bwNotificationSound_VolumeControl {';
            //html += '       display:table;';
            //html += '       float:right;';
            //html += '       margin-top:4px;'; // margin-top here is how we are vertically centering the element.
            //html += '   }';

            //html += '   .bwNotificationSound_VolumeControl_Slider {';
            //html += '       display:table-cell;';
            //html += '       vertical-align: middle;';
            //html += '       cursor:pointer;';
            //html += '       width: 50px;';
            //html += '   }';

            //html += '   .bwNotificationSound_VolumeControl_Slider:hover {';
            //html += '       background-color:lightgray;';
            //html += '       border-radius:30px 30px 30px 30px;';
            //html += '       width: 200px;';
            //html += '   }';

            //html += '   .bwNotificationSound_VolumeControl_VolumeIndicator {';
            //html += '       display:none;';
            //html += '   }';

            //html += '   .bwNotificationSound_VolumeControl_Slider:hover > .bwNotificationSound_VolumeControl_VolumeIndicator {'; // If it's inside the element, use ">". If it is outside, use "+".
            //html += '       display: inline-block;';
            //html += '   }';

            //html += '</style>';

            //
            // This will only display when there is a popped out window.
            //
            html += '<div id="bwNotificationSound_PullBackAllPoppedOutWindowsToMasterWindow" style="" class="bwNotificationSound_PullBackAllPoppedOutWindowsToMasterWindow" onclick="$(\'.bwNotificationSound\').bwNotificationSound(\'volumeControl_OnClick\');" >';
            html += '   <div style="font-size:30pt;font-weight:bold;float:right;cursor:pointer;" onclick="$(\'.bwRequest:first\').bwRequest(\'pullBackAllPoppedOutWindowsToMasterWindow_OnClick\');event.stopPropagation();">&nbsp;&nbsp;☈&nbsp;&nbsp;</div>'; // This provides some spacing.
            html += '</div>';

            return html;

        } catch (e) {
            console.log('Exception in bwNotificationSound.js.renderPullBackAllPoppedOutWindowsToMasterWindow(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwNotificationSound.js.renderPullBackAllPoppedOutWindowsToMasterWindow(): ' + e.message + ', ' + e.stack);
        }
    },
    volumeControl_OnMouseEnter: function () {
        try {
            console.log('In bwNotificationSound.js.volumeControl_OnMouseEnter(). THIS FUNCTIONALITY IS INCOMPLETE. CURRENTLY THE SOUND CAN ONLY BE TURNED ON OR OFF (MUTED).');
            //alert('In bwNotificationSound.js.volumeControl_OnMouseEnter().');


        } catch (e) {
            console.log('Exception in bwNotificationSound.js.volumeControl_OnMouseEnter(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwNotificationSound.js.volumeControl_OnMouseEnter(): ' + e.message + ', ' + e.stack);
        }
    },
    volumeControl_OnClick: function () {
        try {
            console.log('In bwNotificationSound.js.volumeControl_OnClick().');
            var thiz = this;

            var image = document.getElementById('bwNotificationSound_VolumeControl_Slider_SpeakerImage');

            if (image.src.indexOf('speaker.png') > -1) {

                console.log('In bwNotificationSound.js.volumeControl_OnClick(). NOTIFICATION SOUNDS HAVE BEEN MUTED.');
                image.src = 'images/speaker_muted.png';
                this.options.bwNotificationSoundMuted = true; //  bwNotificationSoundMuted: null, // This is a value we should get from the database. We should persist if the user has decided to mute the notification sound. 3-18-2024.

                var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

                var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                data = {
                    bwParticipantId_LoggedIn: participantId,
                    bwActiveStateIdentifier: activeStateIdentifier,
                    bwWorkflowAppId_LoggedIn: workflowAppId,

                    bwNotificationSoundMuted: true
                };
                var operationUri = this.options.operationUriPrefix + "_bw/bwparticipant/updateuserconfigurationbehaviornotificationsoundmuted";
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

                                var msg = 'Error in bwNotificationSound.js.volumeControl_OnClick(). ' + results.status + ', ' + results.message;
                                console.log(msg);
                                displayAlertDialog(msg);

                            } else {

                                //var msg = 'Notification sound updated successfully in the database, but we still need to update the currently logged-in client(s).';
                                //console.log(msg);
                                //displayAlertDialog(msg);

                            }

                        } catch (e) {
                            console.log('Exception in bwNotificationSound.js.volumeControl_OnClick():2: ' + e.message + ', ' + e.stack);
                            displayAlertDialog('Exception in bwNotificationSound.js.volumeControl_OnClick():2: ' + e.message + ', ' + e.stack);
                        }
                    },
                    error: function (data, errorCode, errorMessage) {
                        console.log('Error in bwNotificationSound.js.volumeControl_OnClick(): ' + errorCode + ' ' + errorMessage);
                        displayAlertDialog('Error in bwNotificationSound.js.volumeControl_OnClick(): ' + errorCode + ' ' + errorMessage);
                    }
                });

            } else if (image.src.indexOf('speaker_muted.png') > -1) {

                console.log('In bwNotificationSound.js.volumeControl_OnClick(). NOTIFICATION SOUNDS HAVE BEEN TURNED ON.');
                image.src = 'images/speaker.png';
                this.options.bwNotificationSoundMuted = false; //  bwNotificationSoundMuted: null, // This is a value we should get from the database. We should persist if the user has decided to mute the notification sound. 3-18-2024.

                var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

                var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                data = {
                    bwParticipantId_LoggedIn: participantId,
                    bwActiveStateIdentifier: activeStateIdentifier,
                    bwWorkflowAppId_LoggedIn: workflowAppId,

                    bwNotificationSoundMuted: false
                };
                var operationUri = this.options.operationUriPrefix + "_bw/bwparticipant/updateuserconfigurationbehaviornotificationsoundmuted";
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

                                var msg = 'Error in bwNotificationSound.js.volumeControl_OnClick(). ' + results.status + ', ' + results.message;
                                console.log(msg);
                                displayAlertDialog(msg);

                            } else {

                                //var msg = 'Notification sound updated successfully in the database, but we still need to update the currently logged-in client(s).';
                                //console.log(msg);
                                //displayAlertDialog(msg);

                            }

                        } catch (e) {
                            console.log('Exception in bwNotificationSound.js.volumeControl_OnClick():2: ' + e.message + ', ' + e.stack);
                            displayAlertDialog('Exception in bwNotificationSound.js.volumeControl_OnClick():2: ' + e.message + ', ' + e.stack);
                        }
                    },
                    error: function (data, errorCode, errorMessage) {
                        console.log('Error in bwNotificationSound.js.volumeControl_OnClick(): ' + errorCode + ' ' + errorMessage);
                        displayAlertDialog('Error in bwNotificationSound.js.volumeControl_OnClick(): ' + errorCode + ' ' + errorMessage);
                    }
                });

            } else {

                var msg = 'Error in bwNotificationSound.js.volumeControl_OnClick(). Could not identify speaker image.';
                console.log(msg);
                displayAlertDialog(msg);

            }

        } catch (e) {
            console.log('Exception in bwNotificationSound.js.volumeControl_OnClick(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwNotificationSound.js.volumeControl_OnClick(): ' + e.message + ', ' + e.stack);
        }
    },
    checkIfWeNeedToPlayANotificationSound: function () {
        try {
            console.log('In bwNotificationSound.js.checkIfWeNeedToPlayANotificationSound(). this.options.bwNotificationSoundMuted: ' + this.options.bwNotificationSoundMuted);
            //alert('In bwNotificationSound.js.checkIfWeNeedToPlayANotificationSound().'); 
            var thiz = this;
            //
            // Call the web service to see if we need to play a notification sound.
            // This is a GET call, which updates the BwParticipant table "bwThereIsANotificationForThisParticipant" value to false. We subsequently check the nModified value to determine if it was previously set to true.
            // This is about as much performance as we can get out of this I think! :)
            // bwThereIsANotificationForThisParticipant: Boolean
            //



            // IS THIS BLOCK GOOD HERE??????????????????????????????????????????????
            //
            // This is a method called from bwNotificationSound.js.checkIfWeNeedToPlayANotificationSound().
            //  - bwEmailClient_Haraka will handle the smooth presentation and loading of the new email, but it doesn't check itself, it relies on being called from bwNotificationSound.js.checkIfWeNeedToPlayANotificationSound(). 6-18-2024.
            //  - WE NEED TO ADD HERE A CHECK ON options.Inbox to see if the email notification is not necessary, because the Inbox already has the new email,
            //    and the user may have already viewed it [TheUserHasReadThisEmail]. <<< 7-5-2024. <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
            //
            //







            //if (!(this.options.bwNotificationSoundMuted && (this.options.bwNotificationSoundMuted == true))) {

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

            var forcereturncount = 'false';
            if (this.options.NotificationCount && this.options.NotificationCount == -1) { // This is how we are populating it the first time around.
                forcereturncount = 'true';
            }

            //if (participantId) {

            var data = {
                bwParticipantId_LoggedIn: participantId,
                bwActiveStateIdentifier: activeStateIdentifier,
                bwWorkflowAppId_LoggedIn: workflowAppId,

                forcereturncount: forcereturncount
            };

            $.ajax({
                //url: this.options.operationUriPrefix + '_bw/doweneedtomakeanotificationsound/' + workflowAppId + '/' + participantId + '/' + activeStateIdentifier + '/' + forcereturncount,
                url: this.options.operationUriPrefix + '_bw/doweneedtomakeanotificationsound',
                type: 'POST',
                data: data,
                //contentType: 'application/json',
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (results) {
                    try {

                        if (results.status != 'SUCCESS') {

                            var msg = 'Error in bwNotificationSound.js.checkIfWeNeedToPlayANotificationSound(). Turning off polling for changes calling clearInterval(intervalTimedCheckForAlertsForIosBadgeUpdateUsingTitle). ' + results.status + ', ' + results.message;
                            console.log(msg);
                            displayAlertDialog(msg);

                            clearInterval(intervalTimedCheckForAlertsForIosBadgeUpdateUsingTitle); // This stops the polling.

                        } else {

                            console.log('Returned from _bw/doweneedtomakeanotificationsound(). xcx213523. results: ' + JSON.stringify(results));

                            //if (results && results.hasOwnProperty('bwThereIsANotificationForThisParticipant') && results.bwThereIsANotificationForThisParticipant == true) {
                            //    displayAlertDialog('xcx2155 bwThereIsANotificationForThisParticipant: ' + results.bwThereIsANotificationForThisParticipant + ', results: ' + JSON.stringify(results));
                            //}

                            if (results.hasOwnProperty('NotificationCount')) {

                                //displayAlertDialog('xcxw45436 results.NotificationCount: ' + results.NotificationCount + ', results: ' + JSON.stringify(results));

                                //alert('xcx423234 NotificationCount: ' + JSON.stringify(results.NotificationCount));
                                thiz.options.NotificationCount = results.NotificationCount;
                                thiz.renderTopBarSpeechBubble2();
                            }

                            if (!(thiz.options.bwNotificationSoundMuted && (thiz.options.bwNotificationSoundMuted == true))) {

                                //displayAlertDialog('xcx8657888');

                                if (results.bwThereIsANotificationForThisParticipant && (results.bwThereIsANotificationForThisParticipant == true)) {

                                    console.log('xcx5674589');

                                    //
                                    //
                                    // NOW WE NEED TO LOOK AT THE bwNotificationDetailsJson AND DECIDE IF WE SHOULD NOTIFY THIS USER.
                                    //    We don't notify them if:
                                    //      - They created a new request, and it was from their own task creation. They made it, they already know! :)
                                    //      -
                                    //
                                    //

                                    if (results.bwNotificationReason && results.bwNotificationReason.length && ((results.bwNotificationReason.indexOf('NEW_EMAIL') > -1) || (results.bwNotificationReason.indexOf('NEW_EMAIL_NEW_TASK') > -1))) {

                                        console.log('xcx745745');

                                        var msg = 'In bwNotificationSound.js.checkIfWeNeedToPlayANotificationSound(). THIS WAS A NEW EMAIL, AND IF YOU ARE ON THE INBOX SCREEN, IT SHOULD GET ADDED TO THE TOP OF THE RESULTSET Inbox and re-displayed, and maybe selected? Hmm.. No, well, maybe opacity 50%?';
                                        console.log(msg);
                                        //displayAlertDialog_Persistent(msg + '. results: ' + JSON.stringify(results)); // USE THIS FOR TESTING. KEEP IT FOR A WHILE, AS WE WILL HAVE NEW [bwNotificationReason] MOVING FORWARD. 8-9-2024.

                                        var bwNotificationDetailsJson = JSON.parse(results.bwNotificationDetailsJson); // This was stored as a string.

                                        if ((results.bwNotificationReason == 'NEW_EMAIL_NEW_TASK') && (bwNotificationDetailsJson[0].bwAuthorId == participantId)) { // && (results.bwNotificationDetailsJson[0].bwAssignedToId == participantId)) {

                                            displayAlertDialog('xcx546888 NEW_EMAIL_NEW_TASK created by self.');

                                            //
                                            // This user created this request [bwAuthorId == participantId]. They already know, so they don't need to be notified. DON'T PLAY THE SOUND.
                                            //

                                        } else {

                                            if (typeof ($.bw.bwEmailClient_Haraka) != 'undefined') {

                                                displayAlertDialog_QuickNotice(results.bwNotificationReason);

                                                // At this point, we know the widget.js file has loaded. Now we need to check if the widget has been instantiated.
                                                var widget = document.getElementsByClassName('bwEmailClient_Haraka');
                                                if (!(widget.length && (widget.length > 0))) {

                                                    displayAlertDialog('NEW EMAIL');

                                                    // It has not been instantiated.
                                                    var msg = 'Could not locate widget bwEmailClient_Haraka.js. This this Ok.';
                                                    console.log(msg);
                                                    //displayAlertDialog_Parsistent(msg);

                                                    console.log('In bwNotificationSound.js.checkIfWeNeedToPlayANotificationSound(). Yes, play the sound.');
                                                    thiz.playNotificationSound(null, results); // Yes, play the sound!

                                                } else {

                                                    //
                                                    // This is a method in bwEmailClient_Haraka which will handle the smooth presentation and loading of new email.
                                                    //   It doesn't check itself, it relies on being called from here. 6-18-2024.
                                                    //   IT IS IMPORTANT that it checks to see if it is displayed already. Also, it needs to check if it has been put in the TrashBin/Archive already.
                                                    //
                                                    //displayAlertDialog('CALLING bwEmailClient_Haraka.loadNewEmail_bwNotificationSound_Notification');
                                                    $('.bwEmailClient_Haraka').bwEmailClient_Haraka('loadNewEmail_bwNotificationSound_Notification', results).then(function (results) {
                                                        try {
                                                            //displayAlertDialog('xcx34322');
                                                            if (results.playTheSound == true) {
                                                                //displayAlertDialog('PLAY THE SOUND: xcx567999');
                                                                console.log('In bwNotificationSound.js.checkIfWeNeedToPlayANotificationSound(). Yes, play the sound.');
                                                                displayAlertDialog('NEW EMAIL');
                                                                thiz.playNotificationSound(null, results); // Yes, play the sound!

                                                            } else {
                                                                displayAlertDialog('DONT PLAY THE SOUND: xcx3454577');
                                                            }

                                                        } catch (e) {
                                                            var msg = 'Exception in bwNotificationSound.js.checkIfWeNeedToPlayANotificationSound(): ' + e.message + ', ' + e.stack;
                                                            console.log(msg);
                                                            displayAlertDialog(msg);
                                                        }

                                                    }).catch(function (e) {
                                                        var msg = 'Exception in bwNotificationSound.js.checkIfWeNeedToPlayANotificationSound(): ' + JSON.stringify(e);
                                                        console.log(msg);
                                                        displayAlertDialog(msg);
                                                    });


                                                }

                                            } else {

                                                displayAlertDialog('ERROR: xcx5464');


                                                var msg = 'Error: The bwTimelineAggregator.js widget has not been loaded. Inspect the index.html file to make sure it is specified to load. xcx23536.';
                                            }

                                        }

                                    } else {

                                        displayAlertDialog('ERROR: xcx21214');
                                        //if (!results.bwNotificationReason) {
                                        //    var msg = 'Error in bwNotificationSound.js.checkIfWeNeedToPlayANotificationSound(). Invalid value for results.bwNotificationReason: ' + results.bwNotificationReason;
                                        //    console.log(msg);
                                        //    displayAlertDialog(msg);

                                        //} else {

                                        //    console.log('In bwNotificationSound.js.checkIfWeNeedToPlayANotificationSound(). Yes, play the sound.');
                                        //    thiz.playNotificationSound(null, results); // Yes, play the sound!

                                        //}

                                    }


                                    //var playTheSound = true;
                                    //if (!results.bwNotificationReason) {

                                    //    var msg = 'Error in bwNotificationSound.js.checkIfWeNeedToPlayANotificationSound(). Invalid value for results.bwNotificationReason: ' + results.bwNotificationReason;
                                    //    console.log(msg);
                                    //    displayAlertDialog(msg);

                                    //} else {

                                    //    if (results.bwNotificationReason == 'NEW_EMAIL_NEW_TASK') {
                                    //        if ((results.bwNotificationDetailsJson[0].bwAuthorId == participantId) && (results.bwNotificationDetailsJson[0].WorkflowStepName == 'ADMIN')) {

                                    //            // This user likely just created a new request. They already know, so they don't need to be notified.
                                    //            playTheSound = false;

                                    //        }
                                    //    }

                                    //    if ((results.bwNotificationReason.indexOf('NEW_EMAIL') > -1) || (results.bwNotificationReason.indexOf('NEW_EMAIL_NEW_TASK') > -1)) {

                                    //        var msg = 'In bwNotificationSound.js.checkIfWeNeedToPlayANotificationSound(). THIS WAS A NEW EMAIL, AND IF YOU ARE ON THE INBOX SCREEN, IT SHOULD GET ADDED TO THE TOP OF THE RESULTSET Inbox and re-displayed, and maybe selected? Hmm.. No, well, maybe opacity 50%?';
                                    //        console.log(msg);
                                    //        //displayAlertDialog_Persistent(msg);

                                    //        var widget = $('.bwEmailClient_Haraka');

                                    //        if (widget) {
                                    //            debugger;
                                    //            //
                                    //            // This is a method in bwEmailClient_Haraka which will handle the smooth presentation and loading of new email.
                                    //            //   It doesn't check itself, it relies on being called from here. 6-18-2024.
                                    //            //   IT IS IMPORTANT that it checks to see if it is displayed already. Also, it needs to check if it has been put in the TrashBin/Archive already. 
                                    //            //
                                    //            $('.bwEmailClient_Haraka').bwEmailClient_Haraka('loadNewEmail_bwNotificationSound_Notification', results);

                                    //        } else {

                                    //            var msg = 'Could not locate widget bwEmailClient_Haraka.js. xcx1231234. Dev: Is this Ok?';
                                    //            console.log(msg);
                                    //            displayAlertDialog_Parsistent(msg);

                                    //        }

                                    //    }

                                    //}

                                    //if (playTheSound == true) {

                                    //    //
                                    //    // THIS IS THE ONLY PLACE WHERE WE SHOULD BE PLAYING THE SOUND.
                                    //    //

                                    //    console.log('In bwNotificationSound.js.checkIfWeNeedToPlayANotificationSound(). Yes, play the sound. THIS IS THE ONLY PLACE WHERE WE SHOULD BE PLAYING THE SOUND.');
                                    //    thiz.playNotificationSound(null, results); // Yes, play the sound!

                                    //}

                                } else {

                                    // bwThereIsANotificationForThisParticipant == false
                                    //displayAlertDialog('xcx7896789');

                                    console.log('In bwNotificationSound.js.checkIfWeNeedToPlayANotificationSound(). bwThereIsANotificationForThisParticipant == false. Don\'t play the sound.');

                                    //alert('xcx12353 playing the sound, although prob shouldnt be...');
                                    //thiz.playNotificationSound(); // Yes, play the sound!

                                }

                            } else {

                                displayAlertDialog('xcx454326');

                            }

                        }

                    } catch (e) {

                        console.log('Exception in bwNotificationSound.js.checkIfWeNeedToPlayANotificationSound():2: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwNotificationSound.js.checkIfWeNeedToPlayANotificationSound():2: ' + e.message + ', ' + e.stack);
                    }
                },
                //error: function (data, errorCode, errorMessage) { 
                error: function (jqXHR, settings, errorThrown) {

                    var msg = 'Error in bwNotificationSound.js.checkIfWeNeedToPlayANotificationSound(): ' + settings + ', ' + errorThrown + ' I suspect this may be a service unavailable error but not sure by any means! More investigation needed!' + JSON.stringify(jqXHR);

                    console.log(msg);
                    displayAlertDialog(msg);

                }
            });
            //}

        } catch (e) {

            console.log('Exception in bwNotificationSound.js.checkIfWeNeedToPlayANotificationSound(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwNotificationSound.js.checkIfWeNeedToPlayANotificationSound(): ' + e.message + ', ' + e.stack);
        }
    },


    renderTopBarSpeechBubble: function () {
        try {
            console.log('In bwNotificationSound.js.renderTopBarSpeechBubble().');
            //alert('In bwNotificationSound.js.renderTopBarSpeechBubble().');

            var html = '';

            html += '<style>';
            html += '   .divNotificationSpeechBubble {';
            html += '       background-image: url("/images/bwNotificationSound/speechbubble_37x37.png");';
            html += '       background-repeat: no-repeat;';
            html += '       width: 52px;';
            html += '       height: 40px;';
            html += '   }';
            html += '</style>';

            html += '<div class="divNotificationSpeechBubble">';

            //alert('this.options.NotificationCount: ' + this.options.NotificationCount);

            //if (this.options.NotificationCount > 0) {
            html += '   <div id="bwNotificationSound_SpeechBubble_NotificationCount" style="border:2px solid red;border-radius:30px 30px 30px 30px;align-content:flex-end;text-align:right;vertical-align:super;background-color:red;color:white;font-size:10pt;font-weight:bold;padding:0 5px 0 5px;float:right;">';
            html += this.options.NotificationCount;
            html += '   </div>';
            //}

            html += '</div>';

            return html;

        } catch (e) {
            console.log('Exception in bwNotificationSound.js.renderTopBarSpeechBubble(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwNotificationSound.js.renderTopBarSpeechBubble(): ' + e.message + ', ' + e.stack);
        }
    },

    renderTopBarSpeechBubble2: function () {
        try {
            console.log('In renderTopBarSpeechBubble2.js.getData().');

            var element = document.getElementsByClassName('divNotificationSpeechBubble')[0];

            if (!element) {

                console.log('Error in bwNotificationSound.js.renderTopBarSpeechBubble2(). Could not find element with class "divNotificationSpeechBubble".');

            } else {

                var html = '';

                if (this.options.NotificationCount > 0) {
                    html += '   <div id="bwNotificationSound_SpeechBubble_NotificationCount" style="border:2px solid red;border-radius:30px 30px 30px 30px;align-content:flex-end;text-align:right;vertical-align:super;background-color:red;color:white;font-size:10pt;font-weight:bold;padding:0 5px 0 5px;float:right;">';
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
            html += '       background-image: url("/images/bwNotificationSound/email-icon2.png");'; // 📧
            html += '       background-repeat: no-repeat;';
            html += '       width: 52px;';
            html += '       height: 40px;';
            html += '   }';
            html += '</style>';

            html += '<div class="divNotificationEmail">';

            if (this.options.NotificationCount > 0) {
                html += '   <div id="bwNotificationSound_Email_NotificationCount" style="border:2px solid red;border-radius:30px 30px 30px 30px;align-content:flex-end;text-align:right;vertical-align:super;background-color:red;color:white;font-size:10pt;font-weight:bold;padding:0 5px 0 5px;float:right;">';
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
                    html += '   <div id="bwNotificationSound_Email_NotificationCount" style="border:2px solid red;border-radius:30px 30px 30px 30px;align-content:flex-end;text-align:right;vertical-align:super;background-color:red;color:white;font-size:10pt;font-weight:bold;padding:0 5px 0 5px;float:right;">';
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
            html += '       background-image: url("/images/bwNotificationSound/telephone.png");';
            html += '       background-repeat: no-repeat;';
            html += '       width: 52px;';
            html += '       height: 40px;';
            html += '   }';
            html += '</style>';

            html += '<div class="divNotificationTelephone">';

            if (this.options.NotificationCount > 0) {
                html += '   <div id="bwNotificationSound_Telephone_NotificationCount" style="border:2px solid red;border-radius:30px 30px 30px 30px;align-content:flex-end;text-align:right;vertical-align:super;background-color:red;color:white;font-size:10pt;font-weight:bold;padding:0 5px 0 5px;float:right;">';
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
                    html += '   <div id="bwNotificationSound_Telephone_NotificationCount" style="border:2px solid red;border-radius:30px 30px 30px 30px;align-content:flex-end;text-align:right;vertical-align:super;background-color:red;color:white;font-size:10pt;font-weight:bold;padding:0 5px 0 5px;float:right;">';
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
            console.log('In bwNotificationSound.js.displayAIConversation().');
            //alert('In bwNotificationSound.js.displayAIConversation().');
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
                        console.log('Exception in bwNotificationSound.js.displayAIConversation(): ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwNotificationSound.js.displayAIConversation(): ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    console.log('Error in bwNotificationSound.js.displayAIConversation():' + errorCode + ', ' + errorMessage);
                    displayAlertDialog('Error in bwNotificationSound.js.displayAIConversation():' + errorCode + ', ' + errorMessage);
                }
            });

        } catch (e) {
            console.log('Exception in bwNotificationSound.js.displayAIConversation(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwNotificationSound.js.displayAIConversation(): ' + e.message + ', ' + e.stack);
        }
    },

    renderNotificationSoundUI: function () {
        try {
            console.log('In renderNotificationSoundUI().');

            var bwSelectedNotificationSound = $('.bwAuthentication').bwAuthentication('option', 'bwSelectedNotificationSound');

            var html = '';

            html += '<table>';
            html += '   <tr>';
            html += '       <td style="text-align:left;" class="bwSliderTitleCell">Selected notification sound:</td>';
            html += '       <td class="bwChartCalculatorLightCurrencyTableCell">';
            if (!bwSelectedNotificationSound || (bwSelectedNotificationSound == 'nosound')) {
                html += '           <input type="radio" checked="" style="cursor:pointer;" name="cbSelectNotificationSound" onclick="$(\'.bwNotificationSound\').bwNotificationSound(\'cbSelectNotificationSound_click\', \'nosound\');" />&nbsp;';
            } else {
                html += '           <input type="radio" style="cursor:pointer;" name="cbSelectNotificationSound" onclick="$(\'.bwNotificationSound\').bwNotificationSound(\'cbSelectNotificationSound_click\', \'nosound\');" />&nbsp;';
            }
            html += '           <span style="cursor:pointer;">';
            //html += '               <img src="images/playbutton.jpg" style="width:110px;height:70px;vertical-align:middle;" />';
            html += '           </span>';
            html += '           <span style="cursor:pointer;">No Sound</span>';
            html += '           <br />';
            html += '       </td>';
            html += '   </tr>';
            html += '   <tr>';
            html += '       <td></td>';
            html += '       <td class="bwChartCalculatorLightCurrencyTableCell">';
            if (bwSelectedNotificationSound == 'random') {
                html += '           <input type="radio" checked="" style="cursor:pointer;" name="cbSelectNotificationSound" onclick="$(\'.bwNotificationSound\').bwNotificationSound(\'cbSelectNotificationSound_click\', \'random\');" />&nbsp;';
            } else {
                html += '           <input type="radio" style="cursor:pointer;" name="cbSelectNotificationSound" onclick="$(\'.bwNotificationSound\').bwNotificationSound(\'cbSelectNotificationSound_click\', \'random\');" />&nbsp;';
            }
            html += '           <span style="cursor:pointer;" onclick="$(\'.bwNotificationSound\').bwNotificationSound(\'playNotificationSound\', \'random\');">';
            //html += '               <img src="images/playbutton.jpg" style="width:110px;height:70px;vertical-align:middle;" />';
            html += '               <span style="font-size:40pt;font-weight:bold;">▶</span>';
            html += '           </span>';
            html += '           <span style="cursor:pointer;" onclick="$(\'.bwNotificationSound\').bwNotificationSound(\'playNotificationSound\', \'random\');">Random</span>';
            html += '           <br />';
            if (bwSelectedNotificationSound == 'starpulse') {
                html += '           <input type="radio" checked="" style="cursor:pointer;" name="cbSelectNotificationSound" onclick="$(\'.bwNotificationSound\').bwNotificationSound(\'cbSelectNotificationSound_click\', \'starpulse\');" />&nbsp;';
            } else {
                html += '           <input type="radio" style="cursor:pointer;" name="cbSelectNotificationSound" onclick="$(\'.bwNotificationSound\').bwNotificationSound(\'cbSelectNotificationSound_click\', \'starpulse\');" />&nbsp;';
            }
            html += '           <span style="cursor:pointer;" onclick="$(\'.bwNotificationSound\').bwNotificationSound(\'playNotificationSound\', \'starpulse\');">';
            //html += '               <img src="images/playbutton.jpg" style="width:110px;height:70px;vertical-align:middle;" />';
            html += '               <span style="font-size:40pt;font-weight:bold;">▶</span>';
            html += '           </span>';
            html += '           <span style="cursor:pointer;" onclick="$(\'.bwNotificationSound\').bwNotificationSound(\'playNotificationSound\', \'starpulse\');">Star Pulse</span>';
            html += '           <br />';
            if (bwSelectedNotificationSound == 'cashregister') {
                html += '           <input type="radio" checked="" style="cursor:pointer;" name="cbSelectNotificationSound" onclick="$(\'.bwNotificationSound\').bwNotificationSound(\'cbSelectNotificationSound_click\', \'cashregister\');" />&nbsp;';
            } else {
                html += '           <input type="radio" style="cursor:pointer;" name="cbSelectNotificationSound" onclick="$(\'.bwNotificationSound\').bwNotificationSound(\'cbSelectNotificationSound_click\', \'cashregister\');" />&nbsp;';
            }
            html += '           <span style="cursor:pointer;" onclick="$(\'.bwNotificationSound\').bwNotificationSound(\'playNotificationSound\', \'cashregister\');">';
            //html += '               <img src="images/playbutton.jpg" style="width:110px;height:70px;vertical-align:middle;" />';
            html += '               <span style="font-size:40pt;font-weight:bold;">▶</span>';
            html += '           </span>';
            html += '           <span style="cursor:pointer;" onclick="$(\'.bwNotificationSound\').bwNotificationSound(\'playNotificationSound\', \'cashregister\');">Cash Register</span>';
            html += '           <br />';
            if (bwSelectedNotificationSound == 'crickets') {
                html += '           <input type="radio" checked="" style="cursor:pointer;" name="cbSelectNotificationSound" onclick="$(\'.bwNotificationSound\').bwNotificationSound(\'cbSelectNotificationSound_click\', \'crickets\');" />&nbsp;';
            } else {
                html += '           <input type="radio" style="cursor:pointer;" name="cbSelectNotificationSound" onclick="$(\'.bwNotificationSound\').bwNotificationSound(\'cbSelectNotificationSound_click\', \'crickets\');" />&nbsp;';
            }
            html += '           <span style="cursor:pointer;" onclick="$(\'.bwNotificationSound\').bwNotificationSound(\'playNotificationSound\', \'crickets\');">';
            //html += '               <img src="images/playbutton.jpg" style="width:110px;height:70px;vertical-align:middle;" />';
            html += '               <span style="font-size:40pt;font-weight:bold;">▶</span>';
            html += '           </span>';
            html += '           <span style="cursor:pointer;" onclick="$(\'.bwNotificationSound\').bwNotificationSound(\'playNotificationSound\', \'crickets\');">Crickets</span>';
            html += '       </td>';
            html += '   </tr>';
            html += '   <tr><td colspan="2">&nbsp;</td></tr>';
            html += '</table>';

            return html;

        } catch (e) {
            console.log('Exception in renderNotificationSoundUI: ' + e.message + ', ' + e.stack);
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwNotificationSound</span>';
            html += '<br />';
            html += '<span style="">Exception in bwNotificationSound.renderNotificationSoundUI(): ' + e.message + ', ' + e.stack + '</span>';
            thiz.element.html(html);
        }
    },
    cbSelectNotificationSound_click: function (selectedSound) {
        try {
            console.log('In bwNotificationSound.js.cbSelectNotificationSound_click(). selectedSound: ' + selectedSound);

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
                        console.log('Exception in bwNotificationSound.js.cbSelectNotificationSound_click():2: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwNotificationSound.js.cbSelectNotificationSound_click():2: ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    console.log('Error in bwNotificationSound.js.cbSelectNotificationSound_click(): ' + errorCode + ' ' + errorMessage);
                    displayAlertDialog('Error in bwNotificationSound.js.cbSelectNotificationSound_click(): ' + errorCode + ' ' + errorMessage);
                }
            });

        } catch (e) {
            console.log('Exception in bwNotificationSound.js.cbSelectNotificationSound_click(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwNotificationSound.js.cbSelectNotificationSound_click(): ' + e.message + ', ' + e.stack);
        }
    },

    playNotificationSound: function (sound, data) {
        try {
            console.log('In bwNotificationSound.js.playNotificationSound(). THIS HAS BEEN COMMENTED OUT.');
            //displayAlertDialog('In bwNotificationSound.js.playNotificationSound(). data: ' + JSON.stringify(data));

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

            var elementId = 'audio_bwNotificationSound';
            var audioElement = document.getElementById(elementId);

            if (audioElement) {
                delete audioElement;
            }

            var sourceElement;

            //if (!audioElement) {

            audioElement = document.createElement('audio');
            audioElement.id = elementId;

            sourceElement = document.createElement('source');

            sourceElement.src = 'CashRegisterSound.mp3'; // Default.


            sourceElement.type = 'audio/mpeg';
            audioElement.appendChild(sourceElement);

            document.body.appendChild(audioElement); // Place at beginning of the body element in the document.

            //}

            if (!sourceElement) {
                sourceElement = audioElement.getElementsByTagName('source')[0];
            }

            sourceElement.src = '';

            switch (selectedSound) {
                case 'random':

                    console.log('In bwNotificationSound.js.playNotificationSound(). PLAYING A RANDOM SOUND.');
                    //alert('In bwNotificationSound.js.playNotificationSound(). PLAYING A RANDOM SOUND.');

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

                    console.log('In bwNotificationSound.js.playNotificationSound(). PLAYING A RANDOM SOUND. bwSoundIndex: ' + bwSoundIndex + ', selectedSound: ' + selectedSound);
                    //alert('In bwNotificationSound.js.playNotificationSound(). PLAYING A RANDOM SOUND. bwSoundIndex: ' + bwSoundIndex + ', selectedSound: ' + selectedSound);

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
                case 'bloop-starting':
                    sourceElement.src = 'bloop-starting.mp3';
                    break;
                case 'bloop-working-on-it':
                    sourceElement.src = 'bloop-working-on-it.mp3';
                    break;
                case 'bloop-ending':
                    sourceElement.src = 'bloop-ending.mp3';
                    break;
                default:
                    // do nothing.?
                    break;
            }


            audioElement.play();

            // 5-1-2024. ['NEW_EMAIL', 'NEW_EMAIL_ONE_TIME_REMINDER', 'NEW_EMAIL_NEW_TASK']
            if (data && data.bwNotificationReason && (data.bwNotificationReason == 'NEW_EMAIL')) {

                var bwNotificationDetailsJson = JSON.parse(data.bwNotificationDetailsJson);

                var msg = `YOU HAVE A NEW EMAIL
                            <br /><br />
                            <span style="font-size:20pt;">
                                Email from ` + bwNotificationDetailsJson[0].from[0].address + `.<br />subject: "` + bwNotificationDetailsJson[0].subject + `". ` + bwNotificationDetailsJson[0].attachmentsCount + `<br />attachments.
                            </span>
                            <br /><br />
                            <span style="font-size:20pt;">[Add a Mark Email as Read button here xcx33-1.]
                                <br />
                                [checkbox: I like the sound, but you can turn off the dialog.]
                                <br />
                                [Select a special sound for this email address xcx31423-1.]
                            </span>`;

                displayAlertDialog(msg);

            } else if (data && data.bwNotificationReason && (data.bwNotificationReason == 'NEW_EMAIL_ONE_TIME_REMINDER')) {

                displayAlertDialog('YOU HAVE A NEW ONE TIME REMINDER EMAIL<br /><br />[Show details here... xMon May 6, 2:45pmx Hover for executive summary...] data: ' + data.bwNotificationDetailsJson); // This Request has an UPCOMING REMINDER. [Show details here... xMon May 6, 2:45pmx Hover for executive summary... In bwRequest.js.displayOneTimeReminder().

            } else if (data && data.bwNotificationReason && (data.bwNotificationReason == 'NEW_EMAIL_NEW_TASK')) {

                //
                // This JSON response is different than 2 2 above!!! It is a BwWorkflowTask object.
                //
                // data: {"bwTaskTitle":"Review request CODE-240114","TaskType":"BUDGET_REQUEST_WORKFLOW_TASK","bwWorkflowAppId":"c48535a4-9a6b-4b95-9d67-c6569e9695d8","WorkflowStepName":"Admin","bwStatus":"Admin","bwTaskOutcome":"null","bwPercentComplete":0,"bwRelatedItemId":"fa5857dc-407a-409e-9f57-89242f5ca73d","bwDueDate":"2024-05-07T12:16:28.534Z","RoleCategory":"Approver","bwHasBeenProcessedByTheWorkflowEngine":false,"bwAuthorId":"dcfbc697-7728-4e0f-8620-8d9ab6ed31c6","bwAuthorFriendlyName":"Todd Hiltz","bwAuthorEmail":"todd@budgetworkflow.com","bwAssignedToId":"dcfbc697-7728-4e0f-8620-8d9ab6ed31c6","bwAssignedToFriendlyName":"Todd Hiltz","bwAssignedToEmail":"todd@budgetworkflow.com","Created":"2024-05-06T12:16:28.534Z","bwAssignedToRaciRoleAbbreviation":"ADMIN","bwAssignedToRaciRoleName":"ADMIN"}
                //

                var bwNotificationDetailsJson = JSON.parse(data.bwNotificationDetailsJson);

                var msg = `YOU HAVE A NEW TASK EMAIL
                            <br /><br />` + bwNotificationDetailsJson[0].ProjectTitle + `<br />
                            <span style="font-size:20pt;">for ` + bwNotificationDetailsJson[0].Title + ` as [` + bwNotificationDetailsJson[0].bwAssignedToRaciRoleAbbreviation + `].
                                <br />
                                Submitted by ` + bwNotificationDetailsJson[0].bwAuthorEmail + `
                            </span>
                            <br /><br />
                            <span style="font-size:20pt;">[Add a Mark Email as Read button here xcx33-2.]
                                <br />
                                [checkbox: I like the sound, but you can turn off the dialog.]
                                <br />
                                [Select a special sound for this email address xcx31423-2.]
                            </span>`;

                displayAlertDialog(msg);

            }

            document.getElementById('imgMessagingNotificationRedDot').style.display = 'inline'; // Display the red dot.
            this.renderFavicon(true); // Turn on the red dot on the favicon.

        } catch (e) {
            console.log('Exception in bwNotificationSound.js.playNotificationSound(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwNotificationSound.js.playNotificationSound(): ' + e.message + ', ' + e.stack);
        }
    },

    slideOutAndDisplayNotificationsPanel: function () {
        try {
            console.log('In bwNotificationSound.js.slideOutAndDisplayNotificationsPanel().');
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
                html += '<div class="dialogXButton" style="font-size:25pt;cursor:pointer;width:100%;font-weight:bold;float:right;" onclick="$(\'.bwNotificationSound\').bwNotificationSound(\'slideOutAndDisplayNotificationsPanel\');">Notifications          X</div>';
                html += '<br />';
                html += '<br />';
                //html += 'Clear all notifications'; // TrashbinNotification

                html += '<br />';
                html += '<span onclick="$(\'.bwNotificationSound\').bwNotificationSound(\'TrashbinNotification\', \'' + 'ALL' + '\');" style="cursor:pointer;font-size:15pt;font-weight:normal;text-decoration:underline;color:blue;cursor:pointer;background-color:white;" >Clear all notifications</span>';


                html += '<br />';
                html += '<span style="cursor:pointer;font-size:15pt;font-weight:normal;cursor:pointer;background-color:white;" >';
                html += '   <input type="checkbox" selected="selected" style="cursor:pointer;" />&nbsp;Hide me (my notifications)';
                html += '</span>';

                // 12-23-2023.
                html += '<br />';
                html += '<span style="cursor:pointer;font-size:15pt;font-weight:normal;cursor:pointer;background-color:white;" >';
                html += '   <input type="radio" selected="selected" style="cursor:pointer;" />&nbsp;Verbose (display all)';
                html += '<br />';
                html += '   <input type="radio" selected="selected" style="cursor:pointer;" />&nbsp;Collapse to "Requests"';
                html += '<br />';
                html += '   <input type="radio" selected="selected" style="cursor:pointer;" />&nbsp;Collapse to "Participants"';
                html += '<br />';
                html += '   <input type="radio" selected="selected" style="cursor:pointer;" />&nbsp;Collapse to "Org-Units"';
                html += '<br />';
                html += '   <input type="radio" selected="selected" style="cursor:pointer;" />&nbsp;Collapse to "Request Types"';
                html += '</span>';




                html += '<br />';
                html += '<br />';



                //html += '<div style="margin:25px 25px 25px 25px;background-color:darkgray;padding:15px 15px 15px 15px;width:350px;">';
                //html += 'Todd Hiltz submitted a new Budget Request for you to review.';
                //html += '</div>';


                //html += '<div style="margin:25px 25px 25px 25px;background-color:darkgray;padding:15px 15px 15px 15px;width:350px;">';
                //html += 'A one-time reminder was sent for request "Go to the Dentist".';
                //html += '</div>';





                html += '<div id="bwNotificationSound_SlidingNotificationsPanel_Content"></div>'; // This is where we display all of the items.

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

                //// Slide right.
                //setTimeout(function () {
                //    $(div).toggleClass('animate_SlideRight');
                //}, 150);

                // Slide right. // 5-25-2024. Trying to speed it up.
                setTimeout(function () {
                    $(div).toggleClass('animate_SlideRight');
                }, 50);







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
                                    html += '<span onclick="$(\'.bwNotificationSound\').bwNotificationSound(\'TrashbinNotification\', \'' + results.result[i].bwAIConversation_UserActionsLogId + '\');" style="cursor:pointer;font-size:30pt;font-weight:bold;" >X&nbsp;</span>';







                                    var timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(results.result[i].Timestamp);
                                    html += '<span style="color:cornflowerblue;font-size:12pt;font-weight:normal;">' + timestamp4.toString() + '</span>';

                                    html += '<br />';

                                    html += '<span style="text-decoration:underline;cursor:pointer;" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'' + results.result[i].bwBudgetRequestId + '\', \'' + results.result[i].Title + '\', \'' + bwEncodeURIComponent(results.result[i].ProjectTitle) + '\', \'' + results.result[i].Title + '\', \'undefined\', \'7777xcx7777777-324-1-567\');">';
                                    html += results.result[i].Title + ' "' + results.result[i].ProjectTitle + '"</span> was updated by ';
                                    // $('.bwRequest').bwRequest('displayArInDialog', 'https://budgetworkflow.com', '9f69b8b5-7435-4ac6-b8ad-d8c611741481', 'TODO-230012', 'Pay bills', 'TODO-230012', 'undefined', '7777xcx7777777-324-1');

                                    html += '<span style="color:purple;font-weight:bold;cursor:pointer;" ';
                                    html += ' onclick="$(\'.bwCircleDialog2\').bwCircleDialog2(\'displayParticipantRoleMultiPickerInACircle\', true, \'\', \'' + results.result[i].ParticipantId + '\', \'' + results.result[i].ParticipantFriendlyName + '\', \'' + results.result[i].ParticipantEmail + '\', \'undefined\');" ';
                                    html += '>' + results.result[i].ParticipantFriendlyName + '</span>';

                                    html += '<br />';

                                    //html += '&nbsp;APPROVED/xcx555543&nbsp;';
                                    //html += '<span>' + results.result[i].Action_Message + '</span>';


                                    //html += ' :: results.result[i].ProjectTitle: ' + results.result[i].ProjectTitle;

                                    //html += '<br />';





                                    //
                                    // Action_Message
                                    //

                                    //html += '<span xcx="xcx123478" style="color:blue;text-decoration:underline;cursor:pointer;font-weight:bold;" onclick="';
                                    //html += '$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'' + results.result[i].bwBudgetRequestId + '\', \'BR-230011\', \'Hive #1\', \'BR-230011\', \'undefined\', \'xcx_bwWorkflowTaskItemId_novaluexcx12312\');';
                                    ////html += '" >"' + results.result[i].ProjectTitle + '"</span>';
                                    //html += '" >"' + results.result[i].Action_Message + '"</span>';

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

                            document.getElementById('bwNotificationSound_SlidingNotificationsPanel_Content').innerHTML = html;

                        } catch (e) {
                            console.log('Exception in bwNotificationSound.js.slideOutAndDisplayNotificationsPanel(): ' + e.message + ', ' + e.stack);
                            displayAlertDialog('Exception in bwNotificationSound.js.slideOutAndDisplayNotificationsPanel(): ' + e.message + ', ' + e.stack);
                        }
                    },
                    error: function (data, errorCode, errorMessage) {
                        displayAlertDialog('Error in bwNotificationSound.js.slideOutAndDisplayNotificationsPanel():' + errorCode + ', ' + errorMessage);
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
            console.log('Exception in bwNotificationSound.js.slideOutAndDisplayNotificationsPanel(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwNotificationSound.js.slideOutAndDisplayNotificationsPanel(): ' + e.message + ', ' + e.stack);
        }
    },

    slideOutAndDisplayNotificationsPanel_Email: function () {
        try {
            console.log('In bwNotificationSound.js.slideOutAndDisplayNotificationsPanel_Email().');
            var thiz = this;

            alert('This functionality is incomplete. Coming Soon!');

        } catch (e) {
            console.log('Exception in bwNotificationSound.js.slideOutAndDisplayNotificationsPanel_Email(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwNotificationSound.js.slideOutAndDisplayNotificationsPanel_Email(): ' + e.message + ', ' + e.stack);
        }
    },
    slideOutAndDisplayNotificationsPanel_Telephone: function () {
        try {
            console.log('In bwNotificationSound.js.slideOutAndDisplayNotificationsPanel_Telephone().');
            var thiz = this;

            alert('This functionality is incomplete. Coming Soon!');

        } catch (e) {
            console.log('Exception in bwNotificationSound.js.slideOutAndDisplayNotificationsPanel_Telephone(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwNotificationSound.js.slideOutAndDisplayNotificationsPanel_Telephone(): ' + e.message + ', ' + e.stack);
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
                        console.log('Exception in bwNotificationSound.js.TrashbinNotification(): ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwNotificationSound.js.TrashbinNotification(): ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    displayAlertDialog('Error in bwNotificationSound.js.TrashbinNotification():' + errorCode + ', ' + errorMessage);
                }
            });


        } catch (e) {
            console.log('Exception in TrashbinNotification().');
            displayAlertDialog('Exception in TrashbinNotification().');
        }
    },

});