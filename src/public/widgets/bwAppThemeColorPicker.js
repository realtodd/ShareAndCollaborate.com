$.widget("bw.bwAppThemeColorPicker", {
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
       This is the bwAppThemeColorPicker.js jQuery Widget. 
       ===========================================================

          [more to follow] 
                          
       ===========================================================
       ===========================================================
       MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

          [put your stuff here]

       ===========================================================
       
      */

    },
    _create: function () {
        this.element.addClass("bwAppThemeColorPicker");
        var thiz = this; // Need this because of the asynchronous operations below.
        try {

            var html = '';

            html += '<style>';
            html += '.clean {';
            html += '    clear: both;';
            html += '}';
            html += '';
            html += '.dayContainer {';
            html += '    float: left;';
            html += '    line-height: 20px;';
            html += '    margin-right: 8px;';
            html += '    width: 65px;';
            html += '    font-size: 11px;';
            html += '    font-weight: bold;';
            html += '}';
            html += '';
            html += '.colorBox {';
            html += '    cursor: pointer;';
            html += '    height: 45px;';
            html += '    border: 2px solid #888;';
            html += '    -webkit-border-radius: 4px;';
            html += '    -moz-border-radius: 4px;';
            html += '    border-radius: 4px;';
            html += '}';
            html += '';
            html += '.colorBox.WorkingDayState {';
            html += '    border: 2px solid #4E8059;';
            //html += '    background-color: #8ade8f;'; 
            html += '    background-color: #BFDCAE;';
            html += '}';
            html += '';
            html += '.colorBox.RestDayState {';
            html += '    border: 2px solid #7a1c44;';
            //html += '    background-color: #de5962;';
            html += '    background-color: aliceblue;';
            html += '}';
            html += '';
            html += '.operationTime .mini-time {';
            html += '    width: 40px;';
            html += '    padding: 3px;';
            html += '    font-size: 12px;';
            html += '    font-weight: normal;';
            html += '}';
            html += '';
            html += '.dayContainer .add-on {';
            html += '    padding: 4px 2px;';
            html += '}';
            html += '';
            html += '.colorBoxLabel {';
            html += '    clear: both;';
            html += '    font-size: 12px;';
            html += '    font-weight: bold;';
            html += '}';
            html += '';
            html += ' .invisible {';
            html += '    visibility: hidden;';
            html += '}';
            html += '';
            html += '.operationTime {';
            html += '    margin-top: 5px;';
            html += '}';
            html += '</style>';

            html += '       <table style="width:100%;">';
            html += '           <tr>';
            html += '               <td>';
            html += '                   <div data-original-title="" class="colorBox WorkingDayState brushedAluminum_blue" onclick="$(\'.bwAppThemeColorPicker\').bwAppThemeColorPicker(\'changeThemeTo\', \'brushedAluminum_blue\');" ><input type="checkbox" class="invisible operationState" ></div>';
            html += '               </td>';
            html += '               <td>';
            html += '                   <div data-original-title="" class="colorBox WorkingDayState brushedAluminum_purple" onclick="$(\'.bwAppThemeColorPicker\').bwAppThemeColorPicker(\'changeThemeTo\', \'brushedAluminum_purple\');" ><input type="checkbox" class="invisible operationState" ></div>';
            html += '               </td>';
            html += '               <td>';
            html += '                   <div data-original-title="" class="colorBox WorkingDayState brushedAluminum_green" onclick="$(\'.bwAppThemeColorPicker\').bwAppThemeColorPicker(\'changeThemeTo\', \'brushedAluminum_green\');" ><input type="checkbox" class="invisible operationState" ></div>';
            html += '               </td>';
            html += '               <td>';
            html += '                   <div data-original-title="" class="colorBox WorkingDayState brushedAluminum" onclick="$(\'.bwAppThemeColorPicker\').bwAppThemeColorPicker(\'changeThemeTo\', \'brushedAluminum\');" ><input type="checkbox" class="invisible operationState" ></div>';
            html += '               </td>';
            html += '               <td>';
            html += '                   <div data-original-title="" class="colorBox WorkingDayState brushedAluminum_yellow" onclick="$(\'.bwAppThemeColorPicker\').bwAppThemeColorPicker(\'changeThemeTo\', \'brushedAluminum_yellow\');" ><input type="checkbox" class="invisible operationState" ></div>';
            html += '               </td>';
            html += '               <td>';
            html += '                   <div data-original-title="" class="colorBox WorkingDayState brushedAluminum_skyblue" onclick="$(\'.bwAppThemeColorPicker\').bwAppThemeColorPicker(\'changeThemeTo\', \'brushedAluminum_skyblue\');" ><input type="checkbox" class="invisible operationState" ></div>';
            html += '               </td>';
            html += '               <td>';
            html += '                   <div data-original-title="" class="colorBox WorkingDayState brushedAluminum_gray2" onclick="$(\'.bwAppThemeColorPicker\').bwAppThemeColorPicker(\'changeThemeTo\', \'brushedAluminum_gray2\');" ><input type="checkbox" class="invisible operationState" ></div>';
            html += '               </td>';
            html += '               <td>';
            html += '                   <div data-original-title="" class="colorBox WorkingDayState brushedAluminum_orange" onclick="$(\'.bwAppThemeColorPicker\').bwAppThemeColorPicker(\'changeThemeTo\', \'brushedAluminum_orange\');" ><input type="checkbox" class="invisible operationState" ></div>';
            html += '               </td>';
            html += '           </tr>';
            html += '       </table>';

            $(this.element).html(html);


            var newThemeClassName = localStorage.getItem('selectedAppTheme'); // WE SAVE THIS HERE SO THAT USERS CAN CONFIGURE THE COLOR WHEN NOT LOGGED IN ON THEIR DEVICE. 5-31-2024.
            console.log('In bwAppThemeColorPicker.js._create(). Not logged in, so reading the value from localStorage. newThemeClassName: ' + newThemeClassName);
            if (newThemeClassName) {
                this.changeThemeTo(newThemeClassName);
            }

            console.log('In bwAppThemeColorPicker._create(). The widget has been initialized.');

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwAppThemeColorPicker</span>';
            html += '<br />';
            html += '<span style="">Exception in bwAppThemeColorPicker.Create(): ' + e.message + ', ' + e.stack + '</span>';
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
            .removeClass("bwAppThemeColorPicker")
            .text("");
    },
    
    changeThemeTo: function (newThemeClassName) {
        try {
            console.log('In bwAppThemeColorPicker.js.changeThemeTo(): ' + newThemeClassName);
            //alert('In bwAppThemeColorPicker.js.changeThemeTo(): ' + newThemeClassName);

            //
            // This is similar to bwAuthentication.js.setTheTheme().
            //

            if (!newThemeClassName) {
                console.log('In changeThemeTo(). NO THEME PARAMETER, .brushedAluminum.');
                displayAlertDialog('In changeThemeTo(). NO THEME PARAMETER, .brushedAluminum.');
            } else {

                console.log('In changeThemeTo(). THEME: ' + newThemeClassName);

                var elements = $('.bwColoredMenuItem');
                for (var i = 0; i < elements.length; i++) {

                    var classRemovalArray = [];
                    for (var j = 0; j < elements[i].classList.length; j++) {
                        if ((elements[i].classList[j].indexOf('brushedAluminum') > -1)) { // All of our theme classes have [brushedAluminum] in the name.
                            classRemovalArray.push(elements[i].classList[j]);
                        }
                    }
                    for (var k = 0; k < classRemovalArray.length; k++) {
                        elements[i].classList.remove(classRemovalArray[k]);
                    }

                    if (elements[i].classList.contains('noanimation')) {
                        elements[i].classList.add(newThemeClassName + '_noanimation');
                    } else {
                        elements[i].classList.add(newThemeClassName); // Now that the old theme has been removed, add the selected theme.
                    }
                }


                // 1-26-2025.
                $('.bwActiveMenu:first').bwActiveMenu('renderOutsideCurveInTheMenuBar');
                $('.bwActiveMenu:first').bwActiveMenu('renderInsideCurveInTheMenuBar');
                





















                ////
                //// Rendering the inside curve in the top menu bar.
                ////
                //console.log('Rendering the inside curve in the top menu bar. xcx2342353733');

                //// Step 1: Get the color from our selected theme.
                //var element = document.getElementById('divLeftMenuHeader'); // This is a good element to check.
                //var style = window.getComputedStyle(element);



                //var backgroundColor = style.getPropertyValue('background-color');


                ////var backgroundColor = '#FF9E0D';
                ////var backgroundColor = '#FFA500';

                //console.log('xcx121231-1. backgroundColor: ' + backgroundColor);

                //var canvas = document.getElementById('bwActiveMenu_CanvasTopBarInsideCircle');
                //var ctx = canvas.getContext("2d");
                //ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas of it's lines
                //var x = canvas.width;
                //var y = canvas.width;
                //var radius = canvas.width;
                //var startAngle = 1 * Math.PI;
                //var endAngle = 1.5 * Math.PI;

                ////ctx.fillStyle = '#FFA500';
                //ctx.fillStyle = backgroundColor;

                //ctx.beginPath();
                //ctx.arc(x, y, radius, startAngle, endAngle, false);
                //ctx.lineTo(0, 0);
                //ctx.lineTo(0, canvas.width);
                //ctx.fill();
                ////
                //// end: Rendering the inside curve in the top menu bar.
                ////

                // Now that we are all done, make the web service call to save the theme setting.
                //$('.bwAuthentication').bwAuthentication({ selectedAppTheme: newThemeClassName });
                $('.bwAuthentication').bwAuthentication({ workflowAppTheme: newThemeClassName });

                this.saveWorkflowAppTheme(newThemeClassName);

            }

        } catch (e) {
            console.log('Exception in bwAppThemeColorPicker.js.changeThemeTo(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwAppThemeColorPicker.js.changeThemeTo(): ' + e.message + ', ' + e.stack);
        }
    },
    saveWorkflowAppTheme: function (newThemeClassName) {
        try {
            console.log('In bwAppThemeColorPicker.js.saveWorkflowAppTheme(' + newThemeClassName + ').');
            //alert('In bwAppThemeColorPicker.js.saveWorkflowAppTheme(' + newThemeClassName + ').');

            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            if (!participantId) {

                console.log('In bwAppThemeColorPicker.js.saveWorkflowAppTheme(). Not logged in, so saving the value to localStorage. newThemeClassName: ' + newThemeClassName);
                localStorage.setItem('selectedAppTheme', newThemeClassName); // WE SAVE THIS HERE SO THAT USERS CAN CONFIGURE THE COLOR WHEN NOT LOGGED IN ON THEIR DEVICE. 5-31-2024.

            } else {

                var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
                var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

                var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                data = {
                    bwParticipantId_LoggedIn: participantId,
                    bwActiveStateIdentifier: activeStateIdentifier,
                    bwWorkflowAppId_LoggedIn: workflowAppId,

                    bwWorkflowAppId: workflowAppId,
                    bwWorkflowAppTheme: newThemeClassName,
                    ModifiedByFriendlyName: participantFriendlyName,
                    ModifiedById: participantId,
                    ModifiedByEmail: participantEmail
                };
                var operationUri = webserviceurl + "/bwworkflowapp/updateworkflowapptheme";
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

                                console.log('Error in bwAppThemeColorPicker.js.saveWorkflowAppTheme(). Call to updateworkflowapptheme failed: ' + JSON.stringify(results));
                                displayAlertDialog('Error in bwAppThemeColorPicker.js.saveWorkflowAppTheme(). Call to updateworkflowapptheme failed: ' + JSON.stringify(results));

                            } else {

                                // We don't need to alert the user, as the colors will change immediately anyways.
                                console.log('In bwAppThemeColorPicker.js.saveWorkflowAppTheme(). results: ' + JSON.stringify(results));

                            }

                        } catch (e) {
                            console.log('Exception in bwAppThemeColorPicker.js.saveWorkflowAppTheme():2: ' + e.message + ', ' + e.stack);
                            displayAlertDialog('Exception in bwAppThemeColorPicker.js.saveWorkflowAppTheme():2: ' + e.message + ', ' + e.stack);
                        }
                    },
                    error: function (data, errorCode, errorMessage) {
                        console.log('Error in bwAppThemeColorPicker.js.saveWorkflowAppTheme(): ' + errorCode + ' ' + errorMessage + ', ' + JSON.stringify(data));
                        displayAlertDialog('Error in bwAppThemeColorPicker.js.saveWorkflowAppTheme(): ' + errorCode + ' ' + errorMessage + ', ' + JSON.stringify(data));
                    }
                });

            }

        } catch (e) {
            console.log('Exception in bwAppThemeColorPicker.js.saveWorkflowAppTheme(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwAppThemeColorPicker.js.saveWorkflowAppTheme(): ' + e.message + ', ' + e.stack);
        }
    }

    //changeThemeTo: function (newThemeClassName) {
    //    try {
    //        console.log('In bwAppThemeColorPicker.js.changeThemeTo(' + newThemeClassName + ').');
    //        //alert('In bwAppThemeColorPicker.js.changeThemeTo(' + newThemeClassName + ').');
    //        var thiz = this;

    //        var currentClassName;
    //        if ($('.brushedAluminum') && $('.brushedAluminum').length && $('.brushedAluminum').length > 2) { // There should always be more than 1.
    //            var x = $('.brushedAluminum').length;
    //            currentClassName = 'brushedAluminum';
    //        } else if ($('.brushedAluminum_blue') && $('.brushedAluminum_blue').length && $('.brushedAluminum_blue').length > 2) { // There should always be more than 1.
    //            var x = $('.brushedAluminum_blue').length;
    //            currentClassName = 'brushedAluminum_blue';
    //        } else if ($('.brushedAluminum_purple') && $('.brushedAluminum_purple').length && $('.brushedAluminum_purple').length > 2) { // There should always be more than 1.
    //            var x = $('.brushedAluminum_purple').length;
    //            currentClassName = 'brushedAluminum_purple';
    //        } else if ($('.brushedAluminum_green') && $('.brushedAluminum_green').length && $('.brushedAluminum_green').length > 2) { // There should always be more than 1.
    //            var x = $('.brushedAluminum_green').length;
    //            currentClassName = 'brushedAluminum_green';
    //        } else if ($('.brushedAluminum_yellow') && $('.brushedAluminum_yellow').length && $('.brushedAluminum_yellow').length > 2) { // There should always be more than 1.
    //            var x = $('.brushedAluminum_yellow').length;
    //            currentClassName = 'brushedAluminum_yellow';
    //        } else if ($('.brushedAluminum_skyblue') && $('.brushedAluminum_skyblue').length && $('.brushedAluminum_skyblue').length > 2) { // There should always be more than 1.
    //            var x = $('.brushedAluminum_skyblue').length;
    //            currentClassName = 'brushedAluminum_skyblue';
    //        } else if ($('.brushedAluminum_gray2') && $('.brushedAluminum_gray2').length && $('.brushedAluminum_gray2').length > 2) { // There should always be more than 1.
    //            var x = $('.brushedAluminum_gray2').length;
    //            currentClassName = 'brushedAluminum_gray2'; // This class is so that we can change Goldenrod text to black for better visibility. 10-26-2022
    //        } else if ($('.brushedAluminum_orange') && $('.brushedAluminum_orange').length && $('.brushedAluminum_orange').length > 2) { // There should always be more than 1.
    //            var x = $('.brushedAluminum_orange').length;
    //            currentClassName = 'brushedAluminum_orange'; // This class is so that we can change Goldenrod text to black for better visibility. 10-26-2022
    //        } else if ($('.brushedAluminum_yellow') && $('.brushedAluminum_yellow').length && $('.brushedAluminum_yellow').length > 2) { // There should always be more than 1.
    //            var x = $('.brushedAluminum_yellow').length;
    //            currentClassName = 'brushedAluminum_yellow'; // This class is so that we can change Goldenrod text to black for better visibility. 10-26-2022
    //        }

    //        if (currentClassName == newThemeClassName) {
    //            // Do nothing.

    //            console.log('Rendering the inside curve in the top menu bar. WITH THE CURRENT COLOR.'); //: ' + backgroundColor);



    //        } else {

    //            // Iterate through all of the elements, leaving the ones on the configuration > settings page alone.
    //            var elements = $('.' + currentClassName);
    //            for (var i = 0; i < elements.length; i++) {
    //                var isThisAColorBox = $(elements[i]).hasClass('colorBox');
    //                if (isThisAColorBox == true) {
    //                    // Do nothing.
    //                } else {
    //                    $(elements[i]).addClass(newThemeClassName).removeClass(currentClassName);
    //                }
    //            }

    //            var currentClassName_noanimation = currentClassName + '_noanimation';
    //            var elements2 = $('.' + currentClassName_noanimation);
    //            for (var i = 0; i < elements2.length; i++) {
    //                var isThisAColorBox = $(elements2[i]).hasClass('colorBox');
    //                if (isThisAColorBox == true) {
    //                    // Do nothing.
    //                } else {
    //                    var newThemeClassName_noanimation = newThemeClassName + '_noanimation';
    //                    $(elements2[i]).addClass(newThemeClassName_noanimation).removeClass(currentClassName_noanimation);
    //                }
    //            }








    //            // Experimental 6-13-2024. <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

    //            setTimeout(function () {

    //                var element = document.getElementById('divLeftMenuHeader');
    //                var style = window.getComputedStyle(element);
    //                var backgroundColor = style.getPropertyValue('background-color');

    //                console.log('xcx121231-2. backgroundColor: ' + backgroundColor);

    //                //
    //                // Rendering the inside curve in the top menu bar.
    //                //
    //                console.log('Rendering the inside curve in the top menu bar. WITH THE CURRENT COLOR: ' + backgroundColor);
    //                console.log('Rendering the inside curve in the top menu bar. WITH THE CURRENT COLOR: ' + backgroundColor);
    //                console.log('Rendering the inside curve in the top menu bar. WITH THE CURRENT COLOR: ' + backgroundColor);

    //                //alert('Rendering the inside curve in the top menu bar. WITH THE CURRENT COLOR: ' + backgroundColor);


    //                var canvas = document.getElementById('bwActiveMenu_CanvasTopBarInsideCircle');
    //                var ctx = canvas.getContext("2d");
    //                ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas of it's lines
    //                var x = canvas.width;
    //                var y = canvas.width;
    //                var radius = canvas.width;
    //                var startAngle = 1 * Math.PI;
    //                var endAngle = 1.5 * Math.PI;

    //                ctx.fillStyle = backgroundColor;

    //                ctx.beginPath();
    //                ctx.arc(x, y, radius, startAngle, endAngle, false);
    //                ctx.lineTo(0, 0);
    //                ctx.lineTo(0, canvas.width);
    //                ctx.fill();
    //                //
    //                // end: Rendering the inside curve in the top menu bar.
    //                //

    //            }, 5);














    //            // Now that we are all done, make the web service call to save the theme setting.
    //            //$('.bwAuthentication').bwAuthentication({ selectedAppTheme: newThemeClassName });
    //            $('.bwAuthentication').bwAuthentication({ workflowAppTheme: newThemeClassName });

    //            thiz.saveWorkflowAppTheme(newThemeClassName);

    //        }

    //    } catch (e) {
    //        console.log('Exception in bwAppThemeColorPicker.js.changeThemeTo(): ' + e.message + ', ' + e.stack);
    //        alert('Exception in bwAppThemeColorPicker.js.changeThemeTo(): ' + e.message + ', ' + e.stack);
    //    }
    //},


});