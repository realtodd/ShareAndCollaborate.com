
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



//
// This code is used by the webservices on the back end in the node 'routes' folder, and also used by the front end in the 'sharedclientandserverscripts' folder.
//


//var globalUrlPrefix = 'https://';
//var globalUrl = 'budgetworkflow.com';
var imageRootPath = 'https://' + globalUrl;

//function renderFavicon(displayTheReddot) {
//    // This sets the favicon. We are displaying the currency. With a red dot when there are tasks for the user to perform.
//    // "selectedCurrencySymbol" is expected to exist as a global variable.
//    var currencySymbolFavicon = '';
//    if (displayTheReddot == true) {
//        switch (selectedCurrencySymbol) {
//            case 'Dollar':
//                currencySymbolFavicon = 'favicon-dollar-reddot.ico';
//                break;
//            case 'Pound':
//                currencySymbolFavicon = 'favicon-pound-reddot.ico';
//                break;
//            case 'Euro':
//                currencySymbolFavicon = 'favicon-euro-reddot.ico';
//                break;
//            case 'Rand':
//                currencySymbolFavicon = 'favicon-rand-reddot.ico';
//                break;
//            case 'Franc':
//                currencySymbolFavicon = 'favicon-franc-reddot.ico';
//                break;
//            case 'Yen':
//                currencySymbolFavicon = 'favicon-yen-reddot.ico';
//                break;
//            case 'Rouble':
//                currencySymbolFavicon = 'favicon-rouble-reddot.ico';
//                break;
//            case 'Peso':
//                currencySymbolFavicon = 'favicon-peso-reddot.ico';
//                break;
//            case 'Rupee':
//                currencySymbolFavicon = 'favicon-rupee-reddot.ico';
//                break;
//            case 'Guilder':
//                currencySymbolFavicon = 'favicon-guilder-reddot.ico';
//                break;
//            default:
//                currencySymbolFavicon = 'favicon.ico';
//                break;
//        }
//    } else {
//        switch (selectedCurrencySymbol) {
//            case 'Dollar':
//                currencySymbolFavicon = 'favicon-dollar.ico';
//                break;
//            case 'Pound':
//                currencySymbolFavicon = 'favicon-pound.ico';
//                break;
//            case 'Euro':
//                currencySymbolFavicon = 'favicon-euro.ico';
//                break;
//            case 'Rand':
//                currencySymbolFavicon = 'favicon-rand.ico';
//                break;
//            case 'Franc':
//                currencySymbolFavicon = 'favicon-franc.ico';
//                break;
//            case 'Yen':
//                currencySymbolFavicon = 'favicon-yen.ico';
//                break;
//            case 'Rouble':
//                currencySymbolFavicon = 'favicon-rouble.ico';
//                break;
//            case 'Peso':
//                currencySymbolFavicon = 'favicon-peso.ico';
//                break;
//            case 'Rupee':
//                currencySymbolFavicon = 'favicon-rupee.ico';
//                break;
//            case 'Guilder':
//                currencySymbolFavicon = 'favicon-guilder.ico';
//                break;
//            default:
//                currencySymbolFavicon = 'favicon.ico';
//                break;
//        }
//    }
//    document.getElementById('bwFavicon').href = 'https://budgetworkflow.com/' + currencySymbolFavicon;
//}

// This way of exposing to client side and also NodeJs is from: https://caolan.uk/articles/writing-for-node-and-the-browser/
(function (exports) {

    exports.bwWorkflowAppId = null;
    exports.invitationData = null;
    exports.taskData = null; // Using this to cache the task data for reuse, so that we don't have to go get it again.
    exports.tenantData = null;
    exports.participantsData = null;
    exports.brData = null;
    exports.myBrData = null;

    //exports.myUnsubmittedRequests = null;


    exports.getBudgetWorkflowStandardizedCurrency = function (value) {
        try {
            console.log('In getBudgetWorkflowStandardizedCurrency(). value: ' + value);

            if (!value) {

                console.log('');
                console.log('==================================================');
                console.log('In bwAuthentication.js.getBudgetWorkflowStandardizedCurrency(). INVALID VALUE FOR value. This should only happen with old records and not ones created after Jan 30, 2022. Returning [no value available].');
                console.log('==================================================');
                console.log('');

                return '$0.00'; //'[no value available]';

            } else {

                try {
                    value = value.replace('$', ''); // There may be a dollar sign. Get rid of it.
                } catch (e) {
                    // Do nothing. Remove this someday please lol 2-17-2022
                }


                try {

                    if (Intl) {

                        var formatter = new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            // These options are needed to round to whole numbers if that's what you want.
                            //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
                            //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
                        });

                    }

                } catch (e) {

                }


                value1 = formatter.format(value); /* $2,500.00 */

                return value1;

            }

        } catch (e) {

            if (value.toString().toLowerCase().indexOf('invalid') > -1) {
                return '[invalid value]';
            } else {
                if (e.message.toString().toLowerCase().indexOf('invalid') > -1) {
                    return '[invalid value]';
                } else {
                    console.log('Exception in bwAuthentication.js.getBudgetWorkflowStandardizedCurrency(): value: ' + value + ', ' + e.message + ', ' + e.stack);
                    displayAlertDialog('Exception in bwAuthentication.js.getBudgetWorkflowStandardizedCurrency(): value: ' + value + ', ' + e.message + ', ' + e.stack);
                }
            }

        }
    }
    exports.getBudgetWorkflowStandardizedDate = function (timestamp, TZID) {
        try {
            console.log('In getBudgetWorkflowStandardizedDate(). timestamp: ' + timestamp);

            if (!timestamp) {

                //console.log('');
                //console.log('==================================================');
                //console.log('In bwAuthentication.js.getBudgetWorkflowStandardizedDate(). INVALID VALUE FOR timestamp. This should only happen with old records and not ones created after Jan 30, 2022. Returning [no date available].');
                //console.log('==================================================');
                //console.log('');

                return '[no date available]';

            } else {



                //Intl.supportedValuesOf("timeZone").forEach((timeZone) => {
                //    // "Africa/Abidjan", "Africa/Accra", "Africa/Addis_Ababa", "Africa/Algiers", etc.
                //});

                if (TZID) {

                    // TZID is specified for .ics files/calendar invites. This is where this happens.

                    debugger;

                    if (TZID = 'Eastern Standard Time') {
                        TZID = 'EST';
                    }

                    var userTimezone = TZID; // Intl.DateTimeFormat().resolvedOptions().timeZone; // For example, it returns for me: 'America/Halifax'
                    var userLocale = Intl.DateTimeFormat().resolvedOptions().locale; // For example, it returns for me: 'en-US'
                    // Specifying timeZone is what causes the conversion, the rest is just formatting.
                    var options;
                    try {
                        // If the browser supports .brands, then it probably supports longGeneric.
                        if (window.navigator.userAgentData.brands) {
                            // Returned on Windows 10 in Edge: navigator.userAgentData.brands: [{"brand":" Not;A Brand","version":"99"},{"brand":"Microsoft Edge","version":"97"},{"brand":"Chromium","version":"97"}]
                            // Doesn't work in Safari on my Mac.
                            console.log('In bwCommentsField.js.renderExistingComments(). Setting timeZoneName to longGeneric. window.navigator.userAgentData.brands: ' + JSON.stringify(window.navigator.userAgentData.brands));
                            options = {
                                year: '2-digit', month: '2-digit', day: '2-digit',
                                hour: '2-digit', minute: '2-digit', // second: '2-digit', // If we want seconds, just add this back.
                                timeZone: userTimezone,
                                timeZoneName: 'short' // 'longGeneric' // For example, 'short' = 'AST', 'long' = 'Atlantic Standard Time', 'longGeneric' = 'Atlantic Time'. NOTE: 'longGeneric' is not supported in Safari on Mac OS.
                            }
                        }

                    } catch (e) {
                        console.log('In bwCommentsField.js.renderExistingComments(). Setting timeZoneName to long. window.navigator.userAgentData.brands is not an available object.');
                        options = {
                            year: '2-digit', month: '2-digit', day: '2-digit',
                            hour: '2-digit', minute: '2-digit', // second: '2-digit', // If we want seconds, just add this back.
                            timeZone: userTimezone,
                            timeZoneName: 'short' // 'long' // For example, 'short' = 'AST', 'long' = 'Atlantic Standard Time', 'longGeneric' = 'Atlantic Time'. NOTE: 'longGeneric' is not supported in Safari on Mac OS.
                        }
                    }

                    var formatter = new Intl.DateTimeFormat(userLocale, options); // For example, Intl.DateTimeFormat('en-US', options); 


                    var timestampInNewTimezone = formatter.format(timestamp);


                    var timestamp3 = timestampInNewTimezone.toLocaleString();
                    var monthIndex = timestamp.getMonth();
                    var months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

                    var dayDate = timestamp.getDate();
                    var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                    var dayIndex = timestamp.getDay();

                    var year = timestamp.getFullYear();

                    var timestamp4 = days[dayIndex] + ' ' + months[monthIndex] + ' ' + dayDate + ' ' + year + ' ' + timestamp3.split(',')[1];

                    // This crazy section is all about getting rid of the leading 0 for the hour, if it exists. 2-3-2022
                    var prefixWithHour = timestamp4.split(':')[0];
                    var prefixWithoutHour = prefixWithHour.split(' ')[0] + ' ' + prefixWithHour.split(' ')[1] + ' ' + prefixWithHour.split(' ')[2] + ' ' + prefixWithHour.split(' ')[3];
                    var hourWithMaybeALeadingZero = prefixWithHour.split('  ')[1]; // Detect/split on 2 spaces, not 1!!
                    var suffixWithMinutes = timestamp4.split(':')[1];
                    var hourWithNoZeroPrefix;
                    if (hourWithMaybeALeadingZero.substring(0, 1) == '0') {
                        hourWithNoZeroPrefix = hourWithMaybeALeadingZero.substring(1); // Gets the first character to the end. Leaving out the zero!
                    } else {
                        hourWithNoZeroPrefix = hourWithMaybeALeadingZero;
                    }
                    // end: This crazy section is all about getting rid of the leading 0 for the hour, if it exists. 2-3-2022

                    var timestamp5 = prefixWithoutHour + ' ' + hourWithNoZeroPrefix + ':' + suffixWithMinutes;

                    return timestamp5;








                } else {


                    timestamp = new Date(timestamp); // This has to be done because the thing comes into this method as a string I believe, so has to be converted back to a valid date. That is my premise, hopefully correct, but it works in any case.




                    var userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone; // For example, it returns for me: 'America/Halifax'
                    var userLocale = Intl.DateTimeFormat().resolvedOptions().locale; // For example, it returns for me: 'en-US'
                    // Specifying timeZone is what causes the conversion, the rest is just formatting.
                    var options;
                    try {
                        // If the browser supports .brands, then it probably supports longGeneric.
                        if (window.navigator.userAgentData.brands) {
                            // Returned on Windows 10 in Edge: navigator.userAgentData.brands: [{"brand":" Not;A Brand","version":"99"},{"brand":"Microsoft Edge","version":"97"},{"brand":"Chromium","version":"97"}]
                            // Doesn't work in Safari on my Mac.
                            console.log('In bwCommentsField.js.renderExistingComments(). Setting timeZoneName to longGeneric. window.navigator.userAgentData.brands: ' + JSON.stringify(window.navigator.userAgentData.brands));
                            options = {
                                year: '2-digit', month: '2-digit', day: '2-digit',
                                hour: '2-digit', minute: '2-digit', // second: '2-digit', // If we want seconds, just add this back.
                                timeZone: userTimezone,
                                timeZoneName: 'short' // 'longGeneric' // For example, 'short' = 'AST', 'long' = 'Atlantic Standard Time', 'longGeneric' = 'Atlantic Time'. NOTE: 'longGeneric' is not supported in Safari on Mac OS.
                            }
                        }

                    } catch (e) {
                        console.log('In bwCommentsField.js.renderExistingComments(). Setting timeZoneName to long. window.navigator.userAgentData.brands is not an available object.');
                        options = {
                            year: '2-digit', month: '2-digit', day: '2-digit',
                            hour: '2-digit', minute: '2-digit', // second: '2-digit', // If we want seconds, just add this back.
                            timeZone: userTimezone,
                            timeZoneName: 'short' // 'long' // For example, 'short' = 'AST', 'long' = 'Atlantic Standard Time', 'longGeneric' = 'Atlantic Time'. NOTE: 'longGeneric' is not supported in Safari on Mac OS.
                        }
                    }

                    var formatter = new Intl.DateTimeFormat(userLocale, options); // For example, Intl.DateTimeFormat('en-US', options); 


                    var timestampInNewTimezone = formatter.format(timestamp);


                    var timestamp3 = timestampInNewTimezone.toLocaleString();
                    var monthIndex = timestamp.getMonth();
                    var months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

                    var dayDate = timestamp.getDate();
                    var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                    var dayIndex = timestamp.getDay();

                    var year = timestamp.getFullYear();

                    var timestamp4 = days[dayIndex] + ' ' + months[monthIndex] + ' ' + dayDate + ' ' + year + ' ' + timestamp3.split(',')[1];

                    // This crazy section is all about getting rid of the leading 0 for the hour, if it exists. 2-3-2022
                    var prefixWithHour = timestamp4.split(':')[0];
                    var prefixWithoutHour = prefixWithHour.split(' ')[0] + ' ' + prefixWithHour.split(' ')[1] + ' ' + prefixWithHour.split(' ')[2] + ' ' + prefixWithHour.split(' ')[3];
                    var hourWithMaybeALeadingZero = prefixWithHour.split('  ')[1]; // Detect/split on 2 spaces, not 1!!
                    var suffixWithMinutes = timestamp4.split(':')[1];
                    var hourWithNoZeroPrefix;
                    if (hourWithMaybeALeadingZero.substring(0, 1) == '0') {
                        hourWithNoZeroPrefix = hourWithMaybeALeadingZero.substring(1); // Gets the first character to the end. Leaving out the zero!
                    } else {
                        hourWithNoZeroPrefix = hourWithMaybeALeadingZero;
                    }
                    // end: This crazy section is all about getting rid of the leading 0 for the hour, if it exists. 2-3-2022

                    var timestamp5 = prefixWithoutHour + ' ' + hourWithNoZeroPrefix + ':' + suffixWithMinutes;

                    return timestamp5;

                }

            }

        } catch (e) {

            var msg = '';
            if (TZID) {
                msg = 'Exception in bwCommonScripts.js.getBudgetWorkflowStandardizedDate(): ' + e.message + ', ' + e.stack + ' :: ' + TZID;
            } else {
                msg = 'Exception in bwCommonScripts.js.getBudgetWorkflowStandardizedDate(): ' + e.message + ', ' + e.stack;
            }


            console.log(msg);
            displayAlertDialog_Persistent(msg);


            //if (timestamp.toString().toLowerCase().indexOf('invalid') > -1) {
            //    //return '[invalid date]' + '[' + timestamp + ']' + e.message + ', ' + e.stack;
            //    return '[invalid date]';
            //} else {
            //    if (e.message.toString().toLowerCase().indexOf('invalid') > -1) {
            //        return '[invalid date]';
            //    } else {
            //        console.log('Exception in bwAuthentication.js.getBudgetWorkflowStandardizedDate(): timestamp: ' + timestamp + ', ' + e.message + ', ' + e.stack);
            //        //displayAlertDialog('Exception in bwAUthentication.js.getBudgetWorkflowStandardizedDate(): timestamp: ' + timestamp + ', ' + e.message + ', ' + e.stack);
            //    }
            //}

        }
    }

    exports.getBudgetWorkflowStandardizedDate_NoTime = function (timestamp) {
        try {
            console.log('In getBudgetWorkflowStandardizedDate_NoTime(). timestamp: ' + timestamp);

            if (!timestamp) {

                //console.log('');
                //console.log('==================================================');
                //console.log('In bwAuthentication.js.getBudgetWorkflowStandardizedDate_NoTime(). INVALID VALUE FOR timestamp. This should only happen with old records and not ones created after Jan 30, 2022. Returning [no date available].');
                //console.log('==================================================');
                //console.log('');

                return '[no date available]';

            } else {


                timestamp = new Date(timestamp); // This has to be done because the thing comes into this method as a string I believe, so has to be converted back to a valid date. That is my premise, hopefully correct, but it works in any case.




                var userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone; // For example, it returns for me: 'America/Halifax'
                var userLocale = Intl.DateTimeFormat().resolvedOptions().locale; // For example, it returns for me: 'en-US'
                // Specifying timeZone is what causes the conversion, the rest is just formatting.
                var options;
                try {
                    // If the browser supports .brands, then it probably supports longGeneric.
                    if (window.navigator.userAgentData.brands) {
                        // Returned on Windows 10 in Edge: navigator.userAgentData.brands: [{"brand":" Not;A Brand","version":"99"},{"brand":"Microsoft Edge","version":"97"},{"brand":"Chromium","version":"97"}]
                        // Doesn't work in Safari on my Mac.
                        console.log('In bwCommentsField.js.renderExistingComments(). Setting timeZoneName to longGeneric. window.navigator.userAgentData.brands: ' + JSON.stringify(window.navigator.userAgentData.brands));
                        options = {
                            year: '2-digit', month: '2-digit', day: '2-digit',
                            hour: '2-digit', minute: '2-digit', // second: '2-digit', // If we want seconds, just add this back.
                            timeZone: userTimezone,
                            timeZoneName: 'short' // 'longGeneric' // For example, 'short' = 'AST', 'long' = 'Atlantic Standard Time', 'longGeneric' = 'Atlantic Time'. NOTE: 'longGeneric' is not supported in Safari on Mac OS.
                        }
                    }

                } catch (e) {
                    console.log('In bwCommentsField.js.renderExistingComments(). Setting timeZoneName to long. window.navigator.userAgentData.brands is not an available object.');
                    options = {
                        year: '2-digit', month: '2-digit', day: '2-digit',
                        hour: '2-digit', minute: '2-digit', // second: '2-digit', // If we want seconds, just add this back.
                        timeZone: userTimezone,
                        timeZoneName: 'short' // 'long' // For example, 'short' = 'AST', 'long' = 'Atlantic Standard Time', 'longGeneric' = 'Atlantic Time'. NOTE: 'longGeneric' is not supported in Safari on Mac OS.
                    }
                }

                var formatter = new Intl.DateTimeFormat(userLocale, options); // For example, Intl.DateTimeFormat('en-US', options); 


                var timestampInNewTimezone = formatter.format(timestamp);


                var timestamp3 = timestampInNewTimezone.toLocaleString();
                var monthIndex = timestamp.getMonth();
                var months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

                var dayDate = timestamp.getDate();
                var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                var dayIndex = timestamp.getDay();

                var year = timestamp.getFullYear();

                var timestamp4 = days[dayIndex] + ' ' + months[monthIndex] + ' ' + dayDate + ' ' + year + ' ' + timestamp3.split(',')[1];

                // This crazy section is all about getting rid of the leading 0 for the hour, if it exists. 2-3-2022
                var prefixWithHour = timestamp4.split(':')[0];
                var prefixWithoutHour = prefixWithHour.split(' ')[0] + ' ' + prefixWithHour.split(' ')[1] + ' ' + prefixWithHour.split(' ')[2] + ' ' + prefixWithHour.split(' ')[3];
                var hourWithMaybeALeadingZero = prefixWithHour.split('  ')[1]; // Detect/split on 2 spaces, not 1!!
                var suffixWithMinutes = timestamp4.split(':')[1];
                var hourWithNoZeroPrefix;
                if (hourWithMaybeALeadingZero.substring(0, 1) == '0') {
                    hourWithNoZeroPrefix = hourWithMaybeALeadingZero.substring(1); // Gets the first character to the end. Leaving out the zero!
                } else {
                    hourWithNoZeroPrefix = hourWithMaybeALeadingZero;
                }
                // end: This crazy section is all about getting rid of the leading 0 for the hour, if it exists. 2-3-2022

                var timestamp5 = prefixWithoutHour; // + ' ' + hourWithNoZeroPrefix + ':' + suffixWithMinutes;

                return timestamp5;
            }

        } catch (e) {

            if (timestamp.toString().toLowerCase().indexOf('invalid') > -1) {
                //return '[invalid date]' + '[' + timestamp + ']' + e.message + ', ' + e.stack;
                return '[invalid date]';
            } else {
                if (e.message.toString().toLowerCase().indexOf('invalid') > -1) {
                    return '[invalid date]';
                } else {
                    console.log('Exception in bwAuthentication.js.getBudgetWorkflowStandardizedDate_NoTime(): timestamp: ' + timestamp + ', ' + e.message + ', ' + e.stack);
                    //displayAlertDialog('Exception in bwAUthentication.js.getBudgetWorkflowStandardizedDate_NoTime(): timestamp: ' + timestamp + ', ' + e.message + ', ' + e.stack);
                }
            }

        }
    }

    exports.getBudgetWorkflowStandardizedDate_WithSeconds = function (timestamp) {
        try {
            console.log('In getBudgetWorkflowStandardizedDate_WithSeconds(). timestamp: ' + timestamp);

            if (!timestamp) {

                //console.log('');
                //console.log('==================================================');
                //console.log('In bwAuthentication.js.getBudgetWorkflowStandardizedDate_WithSeconds(). INVALID VALUE FOR timestamp. This should only happen with old records and not ones created after Jan 30, 2022. Returning [no date available].');
                //console.log('==================================================');
                //console.log('');

                return '[no date available]';

            } else {


                timestamp = new Date(timestamp); // This has to be done because the thing comes into this method as a string I believe, so has to be converted back to a valid date. That is my premise, hopefully correct, but it works in any case.




                var userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone; // For example, it returns for me: 'America/Halifax'
                var userLocale = Intl.DateTimeFormat().resolvedOptions().locale; // For example, it returns for me: 'en-US'
                // Specifying timeZone is what causes the conversion, the rest is just formatting.
                var options;
                try {
                    // If the browser supports .brands, then it probably supports longGeneric.
                    if (window.navigator.userAgentData.brands) {
                        // Returned on Windows 10 in Edge: navigator.userAgentData.brands: [{"brand":" Not;A Brand","version":"99"},{"brand":"Microsoft Edge","version":"97"},{"brand":"Chromium","version":"97"}]
                        // Doesn't work in Safari on my Mac.
                        console.log('In bwCommentsField.js.renderExistingComments(). Setting timeZoneName to longGeneric. window.navigator.userAgentData.brands: ' + JSON.stringify(window.navigator.userAgentData.brands));
                        options = {
                            year: '2-digit', month: '2-digit', day: '2-digit',
                            hour: '2-digit', minute: '2-digit', second: 'numeric', fractionalSecondDigits: 2, // second: '2-digit', // If we want seconds, just add this back.
                            timeZone: userTimezone,
                            timeZoneName: 'short' // 'longGeneric' // For example, 'short' = 'AST', 'long' = 'Atlantic Standard Time', 'longGeneric' = 'Atlantic Time'. NOTE: 'longGeneric' is not supported in Safari on Mac OS.
                        }
                    }

                } catch (e) {
                    console.log('In bwCommentsField.js.renderExistingComments(). Setting timeZoneName to long. window.navigator.userAgentData.brands is not an available object.');
                    options = {
                        year: '2-digit', month: '2-digit', day: '2-digit',
                        hour: '2-digit', minute: '2-digit', second: 'numeric', fractionalSecondDigits: 2, // second: '2-digit', // If we want seconds, just add this back.
                        timeZone: userTimezone,
                        timeZoneName: 'short' // 'long' // For example, 'short' = 'AST', 'long' = 'Atlantic Standard Time', 'longGeneric' = 'Atlantic Time'. NOTE: 'longGeneric' is not supported in Safari on Mac OS.
                    }
                }

                var formatter = new Intl.DateTimeFormat(userLocale, options); // For example, Intl.DateTimeFormat('en-US', options); 


                var timestampInNewTimezone = formatter.format(timestamp);


                var timestamp3 = timestampInNewTimezone.toLocaleString();
                //alert('timestamp3: ' + timestamp3);
                var monthIndex = timestamp.getMonth();
                var months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

                var dayDate = timestamp.getDate();
                var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                var dayIndex = timestamp.getDay();

                var year = timestamp.getFullYear();

                var timestamp4 = days[dayIndex] + ' ' + months[monthIndex] + ' ' + dayDate + ' ' + year + ' ' + timestamp3.split(',')[1];

                // This crazy section is all about getting rid of the leading 0 for the hour, if it exists. 2-3-2022
                var prefixWithHour = timestamp4.split(':')[0];
                var prefixWithoutHour = prefixWithHour.split(' ')[0] + ' ' + prefixWithHour.split(' ')[1] + ' ' + prefixWithHour.split(' ')[2] + ' ' + prefixWithHour.split(' ')[3];
                var hourWithMaybeALeadingZero = prefixWithHour.split('  ')[1]; // Detect/split on 2 spaces, not 1!!
                var suffixWithMinutes = timestamp4.split(':')[1];
                var suffixWithSeconds = timestamp4.split(':')[2];
                var hourWithNoZeroPrefix;
                if (hourWithMaybeALeadingZero.substring(0, 1) == '0') {
                    hourWithNoZeroPrefix = hourWithMaybeALeadingZero.substring(1); // Gets the first character to the end. Leaving out the zero!
                } else {
                    hourWithNoZeroPrefix = hourWithMaybeALeadingZero;
                }
                // end: This crazy section is all about getting rid of the leading 0 for the hour, if it exists. 2-3-2022

                var timestamp5 = prefixWithoutHour + ' ' + hourWithNoZeroPrefix + ':' + suffixWithMinutes + ':' + suffixWithSeconds;
                //alert('timestamp5: ' + timestamp5);
                return timestamp5;
            }

        } catch (e) {

            if (timestamp.toString().toLowerCase().indexOf('invalid') > -1) {
                return '[invalid date]';
            } else {
                if (e.message.toString().toLowerCase().indexOf('invalid') > -1) {
                    return '[invalid date]';
                } else {
                    console.log('Exception in bwAUthentication.js.getBudgetWorkflowStandardizedDate_WithSeconds(): timestamp: ' + timestamp + ', ' + e.message + ', ' + e.stack);
                    //displayAlertDialog('Exception in bwAUthentication.js.getBudgetWorkflowStandardizedDate_WithSeconds(): timestamp: ' + timestamp + ', ' + e.message + ', ' + e.stack);
                }
            }

        }
    }
    exports.getBudgetWorkflowStandardizedCurrencyWithoutDollarSign = function (num) {
        try {
            console.log('In bwAuthentication.js.getBudgetWorkflowStandardizedCurrencyWithoutDollarSign(). num: ' + num);

            if (!num) {

                console.log('');
                console.log('==================================================');
                console.log('In bwAuthentication.js.getBudgetWorkflowStandardizedCurrencyWithoutDollarSign(). INVALID VALUE FOR value. This should only happen with old records and not ones created after Jan 30, 2022. Returning [no value available].');
                console.log('==================================================');
                console.log('');

                return 0; //'[no value available]';

            } else {


                //function formatCurrencyWithoutDollarSign(num) {
                num = num.toString().replace(/\$|\,/g, '');
                if (isNaN(num))
                    num = "0";
                var sign = (num == (num = Math.abs(num)));
                num = Math.floor(num * 100 + 0.50000000001);
                var cents = num % 100;
                num = Math.floor(num / 100).toString();
                if (cents < 10)
                    cents = "0" + cents;
                for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
                    num = num.substring(0, num.length - (4 * i + 3)) + ',' +
                        num.substring(num.length - (4 * i + 3));
                return (((sign) ? '' : '-') + num + '.' + cents);
                //}

            }

        } catch (e) {

            if (num.toString().toLowerCase().indexOf('invalid') > -1) {
                return 0;
            } else {
                if (e.message.toString().toLowerCase().indexOf('invalid') > -1) {
                    return 0;
                } else {
                    console.log('Exception in bwAuthentication.js.getBudgetWorkflowStandardizedCurrencyWithoutDollarSign(): num: ' + num + ', ' + e.message + ', ' + e.stack);
                    displayAlertDialog('Exception in bwAuthentication.js.getBudgetWorkflowStandardizedCurrencyWithoutDollarSign(): num: ' + num + ', ' + e.message + ', ' + e.stack);
                }
            }

        }
    }

    exports.getExecutiveSummaryHtml = function (object, objectType, executiveSummaryElement, subjectTemplate, bodyTemplate) {
        //
        // object is the JSON object "bwBudgetRequest" or "bwWorkflowTaskItem".
        // objectType is either "bwBudgetRequest" or "bwWorkflowTaskItem".
        // executiveSummaryElement is the element if rendering in the browser.
        // If subjectTemplate and bodyTemplate are present, then return the Executive Summary for rendering in an email, using 64bit images.
        //
        var thiz = this;
        return new Promise(function (resolve, reject) {
            try {
                console.log('In bwCommonScripts.js.getExecutiveSummaryHtml().');
                //alert('In bwCommonScripts.js.getExecutiveSummaryHtml().');

                var requestTypes = '[]'; // THIS CANNOT BE ON THE SERVER SO FIX THIS!!!!!!!!!!!!!!!!! // $('.bwAuthentication').bwAuthentication('option', 'bwEnabledRequestTypes').EnabledItems;

                var bwBudgetRequest = object;

                var bwWorkflowTaskItem = object;

                var htmlTop = '';
                var htmlBottom = '';

                if (objectType == 'bwBudgetRequest') {

                    htmlTop += '<br />';

                    var supplementalRequestMessage;
                    if (bwBudgetRequest && bwBudgetRequest.IsSupplementalRequest && (bwBudgetRequest.IsSupplementalRequest == true)) {
                        supplementalRequestMessage = '&nbsp;&nbsp;SUPPLEMENTAL';
                    }

                    if (bwBudgetRequest.Title) {

                        if (executiveSummaryElement) { // Check if client or server side.

                            //
                            // This is where we display the "Pin". If it is pinned, or if it is not pinned.
                            //

                            var pinned = false;
                            var pinnedRequests = $('.bwAuthentication:first').bwAuthentication('option', 'PINNED_REQUESTS');
                            if (pinnedRequests && pinnedRequests.length) {
                                for (var i = 0; i < pinnedRequests.length; i++) {
                                    if (pinnedRequests[i].bwBudgetRequestId == bwBudgetRequest.bwBudgetRequestId) {
                                        pinned = true;
                                    }
                                }
                            }
                            if (pinned != true) {

                                console.log('xcx21314321: ' + JSON.stringify(bwBudgetRequest))



                                var bwEnabledRequestTypes = $('.bwAuthentication').bwAuthentication('option', 'bwEnabledRequestTypes');
                                var requestTypes = bwEnabledRequestTypes.EnabledItems; // Global, populated in the beginning when the app loads.
                                var bwRequestTypeId = bwBudgetRequest.bwRequestTypeId;
                                var requestType;
                                for (var i = 0; i < requestTypes.length; i++) {
                                    if (bwRequestTypeId == requestTypes[i].bwRequestTypeId) {
                                        requestType = requestTypes[i].SingletonName; // [PluralName, SingletonName].
                                        break;
                                    }
                                }



                                htmlTop += '   <span style="font-size:12pt;"><span style="color:black;font-size:18pt;font-weight:bold;" bwRequestTypeId="' + bwBudgetRequest.bwRequestTypeId + '" xcx="xcx3243677776"><span style="font-size: x-large;color:red;">' + requestType + ':</span> ' + bwBudgetRequest.Title + '</span></span>';
                                if (supplementalRequestMessage) {
                                    htmlTop += '<span style="color:orange;font-size:18pt;font-weight:bold;">' + supplementalRequestMessage + '</span>';
                                }
                                htmlTop += '           <div title="pin" class="pinButton" style="display:inline-block;font-size:18pt;cursor:pointer !important;float:right;" onclick="$(\'.bwRequest\').bwRequest(\'pinRequest\', \'' + bwBudgetRequest.bwBudgetRequestId + '\', \'' + 'requestDialogId' + '\', true);event.stopPropagation();"><img src="/images/pin.png" style="width:50px;height:50px;cursor:pointer !important;opacity:0.2;" /></div>';
                            } else {
                                htmlTop += '   <span style="font-size:12pt;"><span style="color:black;font-size:18pt;font-weight:bold;">' + bwBudgetRequest.Title + '</span></span>';
                                if (supplementalRequestMessage) {
                                    htmlTop += '<span style="color:orange;font-size:18pt;font-weight:bold;">' + supplementalRequestMessage + '</span>';
                                }
                                htmlTop += '           <div title="un-pin" class="pinButton" style="display:inline-block;font-size:18pt;cursor:pointer !important;float:right;" onclick="$(\'.bwRequest\').bwRequest(\'pinRequest\', \'' + bwBudgetRequest.bwBudgetRequestId + '\', \'' + 'requestDialogId' + '\', false);event.stopPropagation();"><img src="/images/unpin.png" style="width:50px;height:50px;cursor:pointer !important;opacity:0.2;" /></div>';
                            }



                            // Priority groups exclamation mark. 5-31-2024.
                            htmlTop += '<span style="font-size:28pt;font-weight:bold;float:right;border:1px solid cornflowerblue;padding:0 10px 0 10px;font-family:Courier New;opacity:0.2;" onclick="$(\'.bwRequest\').bwRequest(\'addToPriorityGrup\', \'' + bwBudgetRequest.bwBudgetRequestId + '\', \'' + 'requestDialogId' + '\', true);event.stopPropagation();">!</span>';



                            // One time reminder.
                            htmlTop += '<img src="images/clock_small.png" style="max-width:50px;opacity:0.1;float:right;" xcx="xcx1234255677771" onclick="$(\'.bwRequest\').bwRequest(\'displayOneTimeReminder\', \'' + bwBudgetRequest.bwBudgetRequestId + '\');event.stopPropagation();" />'; // I ALWAYS LOVE HOW THE [event] OBJECT IS AVAILABLE HERE, NAMED AS "event"!!!!!!!!!!!!!<<<<<<<<<<<<<<<<<<<<<<<<<<<<<






                        } else {

                            htmlTop += '   <span style="font-size:12pt;"><span style="color:black;font-size:18pt;font-weight:bold;">' + bwBudgetRequest.Title + '</span></span>';
                            if (supplementalRequestMessage) {
                                htmlTop += '<span style="color:orange;font-size:18pt;font-weight:bold;">' + supplementalRequestMessage + '</span>';
                            }

                        }

                    } else {

                        htmlTop += '   <span style="font-size:12pt;"><span style="color:lightgray;font-size:18pt;font-weight:bold;">New ' + requestType + '</span></span>'; // This is a new request.
                        if (supplementalRequestMessage) {
                            htmlTop += '<span style="color:orange;font-size:18pt;font-weight:bold;">' + supplementalRequestMessage + '</span>';
                        }

                    }
                    htmlTop += '   <br />';

                    // Changed to a div 8-8-2024.
                    //htmlTop += '   <span xcx="xcx2312-1-x-99" style="display:inline-block;color:black;font-size:30pt;font-weight:bold;overflow:hidden;white-space:normal;">' + bwBudgetRequest.ProjectTitle + '</span>';
                    htmlTop += '   <div xcx="xcx2312-1-x-99" style="color:black;font-size:30pt;font-weight:bold;overflow-wrap: break-word;white-space:normal;">' + bwBudgetRequest.ProjectTitle + '</div>';

                    htmlTop += '   <br />';

                    // Display the bwJustificationDetailsField in the executive summary. 
                    if (bwBudgetRequest.bwRequestJson) {
                        var tmpbwRequestJson = JSON.parse(bwBudgetRequest.bwRequestJson);
                        if (tmpbwRequestJson.bwJustificationDetailsField && tmpbwRequestJson.bwJustificationDetailsField.value) {

                            var ellippses = '';
                            if (String(tmpbwRequestJson.bwJustificationDetailsField.value).length > 255) {
                                ellippses = '...';
                            }

                            // This is the Justification Details, being displayed in the htmlTop hover over title and alt attributes. 12-13-2022.

                            //var strippedHtml = tmpbwRequestJson.bwJustificationDetailsField.value.replace(/<br>/g, '\n').replace(/"/g, '&quot;');
                            //strippedHtml = strippedHtml.replace(/<div>/g, '');
                            //strippedHtml = strippedHtml.replace(/<\/div>/g, '\n');

                            //strippedHtml = strippedHtml.replace(/<span>/g, '');
                            //strippedHtml = strippedHtml.replace(/<\/span>/g, '');

                            //strippedHtml = strippedHtml.replace(/</g, '&lt;');
                            //strippedHtml = strippedHtml.replace(/>/g, '&gt;');

                            // Changed to replaceAll 12-31-2023.
                            var strippedHtml = tmpbwRequestJson.bwJustificationDetailsField.value.replaceAll('<br>', '\n').replaceAll('"', '&quot;');
                            strippedHtml = strippedHtml.replaceAll('<div>', '');
                            strippedHtml = strippedHtml.replaceAll('</div>', '\n');

                            strippedHtml = strippedHtml.replaceAll('<span>', '');
                            strippedHtml = strippedHtml.replaceAll('</span>', '');

                            strippedHtml = strippedHtml.replaceAll('<', '&lt;');
                            strippedHtml = strippedHtml.replaceAll('>', '&gt;');


                            htmlTop += '   <span xcx="xcx2312-1-x2-1" style="display:inline-block;color:darkgray;font-size:15pt;font-weight:bold;white-space:normal;max-width:750px;overflow:hidden;" title="' + String(strippedHtml).substring(0, 255) + '" alt="' + String(strippedHtml).substring(0, 255) + '">' + String(strippedHtml).substring(0, 255) + ' ' + ellippses + '</span>';

                            htmlTop += '   <br />';
                        }
                    }

                    if (bwBudgetRequest.bwRequestJson) {
                        var bwRequestJson1 = JSON.parse(bwBudgetRequest.bwRequestJson);

                        if (bwRequestJson1.bwInvoiceGrid && bwRequestJson1.bwInvoiceGrid.value) {

                            // SAMPLE JSON:
                            // "bwInvoiceGrid":{"value":[
                            // {"Description":"Aug 15 Owls head ","Amount":250,"Tax":0,"Total":250},
                            // {"Description":"Aug 16 Owls head","Amount":250,"Tax":0,"Total":250},
                            // {"Description":"Aug 17 Owls head","Amount":250,"Tax":0,"Total":250},
                            // {"Description":"Aug 22 Owls head","Amount":250,"Tax":0,"Total":250},
                            // {"Description":"Aug 23 Owls head","Amount":250,"Tax":0,"Total":250},
                            // {"Description":"Aug 24 Owls head","Amount":250,"Tax":0,"Total":250}],
                            // "isPaid":false,
                            // "bwDataRequired":false,
                            // "bwDataType":"invoice",
                            // "tagName":"bwInvoiceGrid"},

                            // THIS WIDGET NEEDS ADDITIONAL PROPERTIES:
                            //   - status: { isPaid: false, datePaid: xx, hasBeenIssued: false, issuedDate: xx, history: [{THIS IS THE HISTORY OF ISSUING AND PAYMENTS}] }

                            // Invoice total.
                            var invoiceTotal = 0;
                            for (var j = 0; j < bwRequestJson1.bwInvoiceGrid.value.length; j++) {
                                invoiceTotal += Number(bwRequestJson1.bwInvoiceGrid.value[j].Total);
                            }
                            var InvoiceTotal_cleaned = exports.getBudgetWorkflowStandardizedCurrency(invoiceTotal);

                            var isPaidText;
                            if (bwRequestJson1.bwInvoiceGrid.isPaid != true) {
                                isPaidText = ' - NOT MARKED AS PAID';
                            } else {
                                isPaidText = ' - PAID IN FULL';
                            }

                            // Render invoice total htmlTop.
                            htmlTop += '   <span style="color:black;font-size:12pt;font-weight:normal;">Invoice total: <span style="color:orange;font-size:20pt;font-weight:bold;">' + InvoiceTotal_cleaned + isPaidText + '</span></span>';
                            htmlTop += '   <br />';

                        } else {

                            // Requested capital.
                            // var RequestedCapital_cleaned = $('.bwAuthentication').bwAuthentication('getBudgetWorkflowStandardizedCurrency', bwBudgetRequest.RequestedCapital);
                            var RequestedCapital_cleaned = exports.getBudgetWorkflowStandardizedCurrency(bwBudgetRequest.RequestedCapital);
                            htmlTop += '   <span style="color:black;font-size:12pt;font-weight:normal;">Requested capital: <span style="color:purple;font-size:18pt;">' + RequestedCapital_cleaned + '</span></span>';
                            htmlTop += '   <br />';

                        }
                    } else {

                        // Requested capital.
                        // var RequestedCapital_cleaned = $('.bwAuthentication').bwAuthentication('getBudgetWorkflowStandardizedCurrency', bwBudgetRequest.RequestedCapital);
                        var RequestedCapital_cleaned = exports.getBudgetWorkflowStandardizedCurrency(bwBudgetRequest.RequestedCapital);
                        htmlTop += '   <span style="color:black;font-size:12pt;font-weight:normal;">Requested capital: <span style="color:purple;font-size:18pt;">' + RequestedCapital_cleaned + '</span></span>';
                        htmlTop += '   <br />';

                    }

                    // Created by.
                    htmlTop += '   <span style="color:black;font-size:12pt;font-weight:normal;">Created by: ' + bwBudgetRequest.CreatedBy + '</span>';
                    htmlTop += '   <br />';

                    var timestamp4;
                    var requestCreatedDate;
                    requestCreatedDate = bwBudgetRequest.Created;
                    if (requestCreatedDate) {
                        //timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(requestCreatedDate);
                        timestamp4 = exports.getBudgetWorkflowStandardizedDate(requestCreatedDate);
                    } else {
                        timestamp4 = '[not available]';
                    }
                    htmlTop += '   <span style="color:black;font-size:12pt;font-weight:normal;">Created date: ' + timestamp4 + '</span>';
                    htmlTop += '   <br />';






                    var timestamp4_2;
                    var requestModifiedDate;
                    requestModifiedDate = bwBudgetRequest.Modified;
                    if (requestModifiedDate) {
                        timestamp4_2 = exports.getBudgetWorkflowStandardizedDate(requestModifiedDate);
                    } else {
                        timestamp4_2 = '[not available]';
                    }
                    htmlTop += '   <span style="color:black;font-size:12pt;font-weight:normal;">Last modified: ' + timestamp4_2 + '</span>';
                    htmlTop += '   <br />';














                    htmlTop += '   <span style="color:black;font-size:12pt;font-weight:normal;">Organization: <span style="">' + bwBudgetRequest.OrgName + '</span></span>';
                    htmlTop += '   <br />';
                    htmlTop += '   <br />';

                    // This is where the attachments get displayed.

                    htmlBottom += '   <hr style="color:skyblue;" xcx="xcx32423678889" />';





                    //
                    //
                    // THIS IS OUR NEW WORKFLOW STATUS UI. 6-1-2024.
                    //
                    //

                    //debugger;
                    var workflows = $('.bwAuthentication:first').bwAuthentication('option', 'Workflows');
                    var workflow1;

                    if (workflows && workflows.length) {
                        for (var i = 0; i < workflows.length; i++) {

                            if (workflows[i].bwRequestTypeId == bwBudgetRequest.bwRequestTypeId) {

                                workflow1 = workflows[i];
                                break;

                            }

                        }
                    }

                    if (!workflow1) {

                        console.log('Error in bwCommonScripts.js.getExecutiveSummaryHtml(). No workflow found. xcx23423778.');
                        console.log('Error in bwCommonScripts.js.getExecutiveSummaryHtml(). No workflow found. xcx23423778.');
                        console.log('Error in bwCommonScripts.js.getExecutiveSummaryHtml(). No workflow found. xcx23423778.');
                        //displayAlertDialog('Error in bwCommonScripts.js.getExecutiveSummaryHtml(). No workflow found. xcx23423778.');

                    } else {

                        var workflow = JSON.parse(workflow1.bwWorkflowJson);




                        // Get the Friendly Name for the workflow step, if there is one.
                        var workflowStepFriendlyName = bwBudgetRequest.BudgetWorkflowStatus;
                        for (var i = 0; i < workflow.Steps.Step.length; i++) {
                            if (workflow.Steps.Step[i]["@Name"] == bwBudgetRequest.BudgetWorkflowStatus) {
                                if (workflow.Steps.Step[i]["@FriendlyName"]) {
                                    workflowStepFriendlyName = workflow.Steps.Step[i]["@FriendlyName"];
                                }
                            }
                        }

                        //htmlBottom += '<div style="color:black;font-size:18pt;font-weight:bold;">Workflow step: ' + workflowStepFriendlyName + '</div>';









                        // Get the request type. For example: "Budget Request".
                        var bwEnabledRequestTypes = $('.bwAuthentication').bwAuthentication('option', 'bwEnabledRequestTypes');

                        if (!bwEnabledRequestTypes.EnabledItems) {

                            var msg = 'Error in bwCommonScripts.js.getExecutiveSummaryHtml(). Invalid value for bwEnabledRequestTypes.EnabledItems: ' + bwEnabledRequestTypes.EnabledItems;
                            console.log(msg);
                            alert(msg);

                        } else {


                        }



                        var requestTypes = bwEnabledRequestTypes.EnabledItems; // Global, populated in the beginning when the app loads.
                        debugger;
                        var bwRequestTypeId = bwBudgetRequest.bwRequestTypeId;
                        var requestType;
                        for (var i = 0; i < requestTypes.length; i++) {
                            if (bwRequestTypeId == requestTypes[i].bwRequestTypeId) {
                                requestType = requestTypes[i].SingletonName; // [PluralName, SingletonName].
                                break;
                            }
                        }
                        debugger;
                        if (!requestType) {

                            var msg = 'Error in bwCommonScripts.js.getExecutiveSummaryHtml(). Invalid value for requestType: ' + requestType + '. LOOK FOR // THIS IS THE ONLY PLACE WE SHOULD BE READING IN ENABLED REQUEST TYPES. Do we call getRemainingParticipantDetailsAndWorkflowAppTitle?';
                            console.log(msg);
                            //displayAlertDialog(msg);

                        } else {

                            var workflowDescription;
                            var vowels = ['a', 'e', 'i', 'o', 'u']; // Not this time: , 'y'
                            var firstChar = requestType.toLowerCase().substring(0, 1);
                            if (vowels.indexOf(firstChar) > -1) {
                                // The first character is a vowel.
                                //workflowDescription = 'This request is in an "' + requestType.toUpperCase()  + '" workflow.';
                                workflowDescription = '"' + requestType.toUpperCase() + '" workflow.';
                            } else {
                                // The first character is not a vowel.
                                //workflowDescription = 'This request is in a "' + requestType.toUpperCase() + '" workflow.';
                                workflowDescription = '"' + requestType.toUpperCase() + '" workflow.';
                            }

                            //htmlBottom += '<div style="color:black;font-size:18pt;font-weight:bold;">' + workflowDescription + '</div>';
                            //htmlBottom += '<div style="color:lightgray;font-size:14pt;font-weight:bold;">Current step: <span style="color:black;">' + workflowStepFriendlyName + '</span></div>';
                            //htmlBottom += '<div style="color:lightgray;font-size:14pt;font-weight:bold;">Current participants: ' + 'xcx21335775' + '</div>';









                            //if (bwBudgetRequest.BudgetWorkflowStatus) {
                            //    if (bwBudgetRequest.BudgetWorkflowStatus.toString().toLowerCase() == 'collaboration') {
                            //        htmlBottom += '<div style="color:black;font-size:18pt;font-weight:bold;">Workflow step: ' + workflowStepFriendlyName + '</div>';
                            //    } else {
                            //        htmlBottom += '<div style="color:black;font-size:18pt;font-weight:bold;">Workflow step: ' + workflowStepFriendlyName + '</div>';
                            //    }
                            //} else {
                            //    htmlBottom += '<div style="color:black;font-size:18pt;font-weight:bold;">Workflow step: ' + 'xcx99345 invalid BudgetWorkflowStatus' + '</div>';
                            //}

                            //htmlBottom += '<div style="color:darkgray;font-size:18pt;font-weight:bold;">Workflow';
                            //htmlBottom += ' <div id="" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'slideWorkflowViewer\', \'LEFT\', \'tableWorkflowForRequest_' + bwBudgetRequest.bwBudgetRequestId + '\');event.stopPropagation();">[<<<]</div>'; // bwBudgetRequest.bwBudgetRequestId // $(\'#bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'slideWorkflowViewer\', \'RIGHT\', this);
                            ////htmlBottom += ' &nbsp;&nbsp;';
                            //htmlBottom += ' <div id="" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'slideWorkflowViewer\', \'RIGHT\', \'tableWorkflowForRequest_' + bwBudgetRequest.bwBudgetRequestId + '\');event.stopPropagation();">[>>>]</div>';
                            //htmlBottom += '</div>';

                            //htmlBottom += '<br />';

                            var colspan1 = (workflow.Steps.Step.length * 2) - 1;

                            htmlBottom += `  <table id="tableWorkflowForRequest_` + bwBudgetRequest.bwBudgetRequestId + `" align="center" style="float:left;width:100%;border: 1px solid gray; border-radius: 10px;font-family:\'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;">
                                        <tr>
                                            <td colspan="` + colspan1 + `">`;

                            htmlBottom += `             <img class="xx" src="images/drawer-open.png" style="width:50px;height:50px;float:left;" onclick="$(\'.bwCoreComponent\').bwCoreComponent(\'collapseExecutiveRequestWorkflowSummary\', this);event.stopPropagation();">
                                    `;
                            htmlBottom += `            <img class="gridMagnifyingGlass" src ="images/zoom.jpg" style="width:50px;height:50px;float:right;" onclick="alert('DEV: Add the large workflow dialog here. Coming soon!');event.stopPropagation();">`;

                            htmlBottom += '<div style="color:black;font-size:18pt;font-weight:bold;">' + workflowDescription + '</div>';
                            htmlBottom += '<div style="color:lightgray;font-size:14pt;font-weight:bold;">Current step: <span style="color:black;">' + workflowStepFriendlyName + '</span></div>';
                            //htmlBottom += '<div style="color:lightgray;font-size:14pt;font-weight:bold;">Current participants: ' + 'xcx21335775' + '</div>';


                            htmlBottom += `                    </td>
                                        </tr>

                                        <tr style="display:none;">`;





                            //
                            //
                            // THIS IS WHERE WE DECIDE IF WE SHOW THE WHOLE WORKFLOW SUMMARY. 6-27-2024.
                            //
                            //
                            console.log('THIS IS WHERE WE DECIDE IF WE SHOW THE WHOLE WORKFLOW SUMMARY. 6-27-2024. xcx12213123.');

                            if (1 == 1) {




                                var activeStepIndex;
                                for (var i = 0; i < workflow.Steps.Step.length; i++) {

                                    if ((workflow.Steps.Step[i]["@Name"] != 'Revise') || (bwBudgetRequest.BudgetWorkflowStatus == 'Revise')) { // Don't display the [Revise] step, unless that is the [BudgetWorkflowStatus].

                                        // Note the workflow_step_userimages_ class has the step name appended to it. This is how we locate it ...
                                        if (workflow.Steps.Step[i]["@Name"] == bwBudgetRequest.BudgetWorkflowStatus) {
                                            htmlBottom += `<td bwworkflowstepactive="true" class="workflow_step_userimages_` + workflow.Steps.Step[i]["@Name"] + `" style="border:1px solid gray;cursor:pointer;text-align:center;" >`;
                                            htmlBottom += '<div style="display:block;">';
                                        } else {
                                            htmlBottom += `<td class="workflow_step_userimages_` + workflow.Steps.Step[i]["@Name"] + `" style="border:1px solid gray;cursor:pointer;text-align:center;height:80px;" >`; // 80px keeps it the correct height when no images are displayed.
                                            //htmlBottom += '<div style="display:none;">';
                                            htmlBottom += '<div style="display:block;overflow:hidden;width:50px;">'; // TRYING NEW APPROACH 6-4-2024.
                                        }

                                        if (workflow.Steps.Step[i]["@Name"] == bwBudgetRequest.BudgetWorkflowStatus) {

                                            htmlBottom += `<img src="images/userimage.png" style="width:75px;" />`;
                                            activeStepIndex = i;

                                        } else {

                                            //htmlBottom += `<img src="https://shareandcollaborate.com/_files/c48535a4-9a6b-4b95-9d67-c6569e9695d8/participantimages/dcfbc697-7728-4e0f-8620-8d9ab6ed31c6/userimage_50x50px.png" style="width:50px;" />`;
                                            htmlBottom += `<img src="images/userimage.png" style="width:50px;" />`;
                                        }

                                        htmlBottom += `</div></td>`;

                                        //if ((i + 1) != workflow.Steps.Step.length) {

                                        //    if (i >= activeStepIndex) {
                                        //        // After the current workflow step. darkgray. // → // &mdash;
                                        //        htmlBottom += ` <td style="border: 1px solid gray; font-size: 24px;font-weight:bold;color:darkgray;">

                                        //            →

                                        //        </td>`;
                                        //    } else {
                                        //        // Before the current workflow step. lawngreen.
                                        //        htmlBottom += ` <td style="border: 1px solid gray; font-size: 24px;font-weight:bold;color:lawngreen;">

                                        //            →

                                        //        </td>`;
                                        //    }



                                        //}

                                        htmlBottom += ` <td style="border: 1px solid gray; font-size: 24px;font-weight:bold;color:darkgray;"></td>`;

                                    }

                                    //htmlBottom += `</td>
                                    //    <td style="border:1px solid gray;">
                                    //    </td>`;

                                }

                                htmlBottom += `</tr>`;








                                htmlBottom += `<tr style="display:none;">`;


                                for (var i = 0; i < workflow.Steps.Step.length; i++) {

                                    if ((workflow.Steps.Step[i]["@Name"] != 'Revise') || (bwBudgetRequest.BudgetWorkflowStatus == 'Revise')) { // Don't display the [Revise] step, unless that is the [BudgetWorkflowStatus].

                                        if (workflow.Steps.Step[i]["@Name"] == bwBudgetRequest.BudgetWorkflowStatus) {
                                            htmlBottom += `<td bwworkflowstepactive="true" style="border: 1px solid gray; text-align: center;" onclick="$(\'.bwCoreComponent\').bwCoreComponent(\'slideWorkflowViewer2\', this);event.stopPropagation();" >`;
                                        } else {
                                            htmlBottom += `<td style="border: 1px solid gray; text-align: center;" onclick="$(\'.bwCoreComponent\').bwCoreComponent(\'slideWorkflowViewer2\', this);event.stopPropagation();" >`;
                                        }

                                        var name1 = '';
                                        if (workflow.Steps.Step[i]["@FriendlyName"]) {
                                            name1 = workflow.Steps.Step[i]["@FriendlyName"].replaceAll(' ', '<br />'); // Break on white space.
                                        } else {
                                            name1 = workflow.Steps.Step[i]["@Name"];
                                        }

                                        // If it is a collaboration step, also display the timeout.
                                        if (workflow.Steps.Step[i]["@Name"] == 'Collaboration') {
                                            var timeout = workflow.Steps.Step[i]["@Timeout"]
                                            var timeoutUnits = workflow.Steps.Step[i]["@TimeoutUnits"]

                                            name1 += '<br />(' + timeout + ' ' + timeoutUnits + ')';

                                            //
                                            // Only do the following when the workflow is at the "Collaboration" step.
                                            //

                                            if (bwBudgetRequest.BudgetWorkflowStatus == 'Collaboration') {

                                                //debugger;
                                                if (!bwBudgetRequest.BudgetWorkflowStatusModifiedTimestamp) {

                                                    name1 += '<br /><span style="color:red">Invalid value for BudgetWorkflowStatusModifiedTimestamp: ' + bwBudgetRequest.BudgetWorkflowStatusModifiedTimestamp + '</span>';

                                                } else {

                                                    var dtNow = new Date();
                                                    var totalBetween;
                                                    if (timeoutUnits == 'Days') {
                                                        totalBetween = Date.daysBetween(bwBudgetRequest.BudgetWorkflowStatusModifiedTimestamp, dtNow);
                                                    } else if (timeoutUnits == 'Hours') {
                                                        totalBetween = Date.hoursBetween(bwBudgetRequest.BudgetWorkflowStatusModifiedTimestamp, dtNow);
                                                    } else if (timeoutUnits == 'Minutes') {
                                                        totalBetween = Date.minutesBetween(bwBudgetRequest.BudgetWorkflowStatusModifiedTimestamp, dtNow);
                                                    }

                                                    timeoutUnits = timeoutUnits.toLowerCase();

                                                    var unitsRemainingBeforeTimeout = Number(timeout) - Number(totalBetween);

                                                    if (unitsRemainingBeforeTimeout < 0) {
                                                        name1 += '<br /><span style="color:red" xcx="xcx12324-1">' + (unitsRemainingBeforeTimeout * -1) + ' ' + timeoutUnits + ' overdue</span>';
                                                    } else {
                                                        name1 += '<br /><span style="color:red" xcx="xcx12324-2">' + unitsRemainingBeforeTimeout + ' ' + timeoutUnits + ' remaining</span>';
                                                    }

                                                }

                                            }

                                        }

                                        if (workflow.Steps.Step[i]["@Name"] == bwBudgetRequest.BudgetWorkflowStatus) {
                                            htmlBottom += `<div style="font-weight:bold;font-size:16pt;color:black;line-height:1em;text-decoration:underline;">` + name1 + `</div>`; // This is the current workflow step, rendered in BOLD.
                                        } else {
                                            htmlBottom += `<div style="font-weight:normal;font-size:10pt;line-height:1em;text-decoration:underline;">` + name1 + `</div>`;
                                        }


                                        htmlBottom += `</td>`;
                                        //<td style="border:1px solid gray;">
                                        //</td>`;



                                        if ((i + 1) != workflow.Steps.Step.length) {

                                            if (i >= activeStepIndex) {
                                                // After the current workflow step. darkgray. // → // &mdash;
                                                htmlBottom += ` <td style="border: 1px solid gray; font-size: 24px;font-weight:bold;color:darkgray;"> 

                                        →

                                    </td>`;
                                            } else {
                                                // Before the current workflow step. lawngreen.
                                                htmlBottom += ` <td style="border: 1px solid gray; font-size: 24px;font-weight:bold;color:lawngreen;">

                                        →

                                    </td>`;
                                            }



                                        }

                                    }

                                }



                                htmlBottom += `</tr>`;

                                htmlBottom += `<tr style="display:none;">`;

                                //    <tr>
                                //        <td style="border:1px solid gray;font-size:10pt;vertical-align:top;">

                                //            Creator:<br />
                                //            &nbsp;&nbsp;<span style="color:black;">Todd Hiltz</span>

                                //        </td>
                                //        <td style="border:1px solid gray;">
                                //        </td>
                                //        <td style="border: 1px solid gray; font-size: 10pt; vertical-align: top;">

                                //            Approver:<br />
                                //            &nbsp;&nbsp;<span style="color:orange;">Todd Hiltz</span>

                                //        </td>
                                //        <td style="border:1px solid gray;">
                                //        </td>

                                for (var i = 0; i < workflow.Steps.Step.length; i++) {

                                    if ((workflow.Steps.Step[i]["@Name"] != 'Revise') || (bwBudgetRequest.BudgetWorkflowStatus == 'Revise')) { // Don't display the [Revise] step, unless that is the [BudgetWorkflowStatus].

                                        if (workflow.Steps.Step[i]["@Name"] == bwBudgetRequest.BudgetWorkflowStatus) {
                                            htmlBottom += `<td bwworkflowstepactive="true" style="border: 1px solid gray; font-size: 10pt; vertical-align: top;">`;
                                            htmlBottom += `<div style="display:block;">`;
                                        } else {
                                            htmlBottom += `<td style="border: 1px solid gray; font-size: 10pt; vertical-align: top;">`;
                                            //htmlBottom += `<div style="display:none;">`;
                                            htmlBottom += `<div style="display:block;overflow:hidden;width:50px;">`; // TRYING NEW APPROACH 6-4-2024.
                                        }

                                        htmlBottom += `<div class="approvers_` + workflow.Steps.Step[i]["@Name"] + `" style="color:black;font-size:12pt;font-weight:normal;"></div>
                                            <div class="collaborators_` + workflow.Steps.Step[i]["@Name"] + `" style="color:black;font-size:12pt;font-weight:normal;"></div>
                                            <div class="informed_` + workflow.Steps.Step[i]["@Name"] + `" style="color:black;font-size:12pt;font-weight:normal;"></div>`;

                                        htmlBottom += '</div>';

                                        //if (workflow.Steps.Step[i]["@Name"] == bwBudgetRequest.BudgetWorkflowStatus) {

                                        //    htmlBottom += `<div class="approvers" style="color:black;font-size:12pt;font-weight:normal;"></div>
                                        //                <div class="collaborators" style="color:black;font-size:12pt;font-weight:normal;"></div>
                                        //                <div class="informed" style="color:black;font-size:12pt;font-weight:normal;"></div>`;

                                        //} else {

                                        //    // Original with just role abbreviations..
                                        //    if (workflow.Steps.Step[i].Assign && workflow.Steps.Step[i].Assign.length) {
                                        //        for (var j = 0; j < workflow.Steps.Step[i].Assign.length; j++) {

                                        //            var roleCategory = workflow.Steps.Step[i].Assign[j]["@RoleCategory"]; // eg: "Approver"
                                        //            var roleName = workflow.Steps.Step[i].Assign[j]["@Role"]; // eg: "ADMIN". Also property "@RoleName".

                                        //            htmlBottom += roleCategory + ':<br />';
                                        //            htmlBottom += '&nbsp;&nbsp;<span style="color: black;">' + roleName + '</span><br />';
                                        //        }
                                        //    }

                                        //}

                                        htmlBottom += `</td>
                            <td style="border:1px solid gray;">
                            </td>`;

                                    }

                                }



                                //        <td style="border: 1px solid gray; font-size: 10pt; vertical-align: top;">

                                //            Approvers:<br />
                                //            &nbsp;&nbsp;<span style="color: black;">Todd Hiltz</span><br />
                                //            &nbsp;&nbsp;<span style="color: black;">Barney Rubble</span><br />
                                //            Collaborator:<br />
                                //            &nbsp;&nbsp;<span style="color: black;">Todd Hiltz</span><br />
                                //            Informed:<br />
                                //            &nbsp;&nbsp;<span style="color: black;">Betty Rubble</span><br />

                                //        </td>
                                //        <td style="border:1px solid gray;">
                                //        </td>
                                //    </tr>
                                //</table>`;

                                htmlBottom += `</tr>


                    </table>`;

                            }
                            //
                            //
                            // end: THIS IS OUR NEW WORKFLOW STATUS UI. 6-1-2024.
                            //
                            //

                        }

                    }











                    //
                    //
                    // THIS IS OUR NEW WORKFLOW STATUS UI SAMPLE CODE. KEEP THIS FOR FUTURE USE AND CHANGES, IT WILL HELP. 6-1-2024.
                    //
                    //

                    //                htmlBottom += `  <table align="center" style="border: 1px solid gray; border-radius: 10px;font-family:\'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;">
                    //    <tr>
                    //        <td style="border:1px solid gray;cursor:pointer;text-align:center;" title="Todd Hiltz (todd@budgetworkflow.com)" alt="Todd Hiltz (todd@budgetworkflow.com)" onclick="alert('Display the user circle dialog. Coming soon!');">

                    //            <img src="https://shareandcollaborate.com/_files/c48535a4-9a6b-4b95-9d67-c6569e9695d8/participantimages/dcfbc697-7728-4e0f-8620-8d9ab6ed31c6/userimage_50x50px.png" style="width:50px;" />

                    //        </td>
                    //        <td style="border: 1px solid gray; font-size: 32px;font-weight:bold;color:lawngreen;">

                    //            &mdash;

                    //        </td>
                    //        <td style="border: 1px solid gray; cursor: pointer; text-align: center;" title="Todd Hiltz (todd@budgetworkflow.com)" alt="Todd Hiltz (todd@budgetworkflow.com)" onclick="alert('Display the user circle dialog. Coming soon!');">

                    //            <img src="https://shareandcollaborate.com/_files/c48535a4-9a6b-4b95-9d67-c6569e9695d8/participantimages/dcfbc697-7728-4e0f-8620-8d9ab6ed31c6/userimage_50x50px.png" style="width:75px;" />

                    //        </td>
                    //        <td style="border: 1px solid gray; font-size: 32px;font-weight:bold;color:lawngreen;">

                    //            &mdash;

                    //        </td>
                    //        <td style="border: 1px solid gray; cursor: pointer; text-align: center;" title="Todd Hiltz (todd@budgetworkflow.com)" alt="Todd Hiltz (todd@budgetworkflow.com)" onclick="alert('Display the user circle dialog. Coming soon!');">

                    //            <img src="https://shareandcollaborate.com/images/head_35x35_black.png" style="width:50px;" />

                    //        </td>
                    //        <td style="border: 1px solid gray; font-size: 32px;font-weight:bold;color:darkgray;">

                    //            &mdash;

                    //        </td>
                    //        <td style="border: 1px solid gray; cursor: pointer; text-align: center;" title="Todd Hiltz (todd@budgetworkflow.com)" alt="Todd Hiltz (todd@budgetworkflow.com)" onclick="alert('Display the user circle dialog. Coming soon!');">

                    //            <img src="https://shareandcollaborate.com/images/head_35x35_black.png" style="width:50px;" />

                    //        </td>
                    //        <td style="border:1px solid gray;">
                    //        </td>
                    //    </tr>
                    //    <tr>
                    //        <td style="border: 1px solid gray; text-align: center;">

                    //            Create<br />Request

                    //        </td>
                    //        <td style="border:1px solid gray;">
                    //        </td>
                    //        <td style="border: 1px solid gray; text-align: center;font-weight:bold;">

                    //            Admin<br />Review

                    //        </td>
                    //        <td style="border:1px solid gray;">
                    //        </td>
                    //        <td style="border: 1px solid gray; text-align: center;">

                    //            Review<br />Invoice

                    //        </td>
                    //        <td style="border:1px solid gray;">
                    //        </td>
                    //        <td style="border: 1px solid gray; text-align: center;">

                    //            Issue<br />Invoice

                    //        </td>
                    //        <td style="border:1px solid gray;">
                    //        </td>
                    //    </tr>
                    //    <tr>
                    //        <td colspan="7"></td>
                    //    </tr>
                    //    <tr>
                    //        <td style="border:1px solid gray;font-size:10pt;vertical-align:top;">

                    //            Creator:<br />
                    //            &nbsp;&nbsp;<span style="color:black;">Todd Hiltz</span>

                    //        </td>
                    //        <td style="border:1px solid gray;">
                    //        </td>
                    //        <td style="border: 1px solid gray; font-size: 10pt; vertical-align: top;">

                    //            Approver:<br />
                    //            &nbsp;&nbsp;<span style="color:orange;">Todd Hiltz</span>

                    //        </td>
                    //        <td style="border:1px solid gray;">
                    //        </td>
                    //        <td style="border: 1px solid gray; font-size: 10pt; vertical-align: top;">

                    //            Approvers:<br />
                    //            &nbsp;&nbsp;<span style="color: black;">
                    //                Todd Hiltz
                    //            </span><br />
                    //            &nbsp;&nbsp;<span style="color: black;">
                    //                Barney Rubble
                    //            </span><br />
                    //            Collaborator:<br />
                    //            &nbsp;&nbsp;<span style="color: black;">
                    //                Todd Hiltz
                    //            </span><br />
                    //            Informed:<br />
                    //            &nbsp;&nbsp;<span style="color: black;">Betty Rubble</span><br />

                    //        </td>
                    //        <td style="border:1px solid gray;">
                    //        </td>
                    //        <td style="border: 1px solid gray; font-size: 10pt; vertical-align: top;">

                    //            Approvers:<br />
                    //            &nbsp;&nbsp;<span style="color: black;">Todd Hiltz</span><br />
                    //            &nbsp;&nbsp;<span style="color: black;">Barney Rubble</span><br />
                    //            Collaborator:<br />
                    //            &nbsp;&nbsp;<span style="color: black;">Todd Hiltz</span><br />
                    //            Informed:<br />
                    //            &nbsp;&nbsp;<span style="color: black;">Betty Rubble</span><br />

                    //        </td>
                    //        <td style="border:1px solid gray;">
                    //        </td>
                    //    </tr>
                    //</table>`;

                    //
                    //
                    // end: THIS IS OUR NEW WORKFLOW STATUS UI SAMPLE CODE. KEEP THIS FOR FUTURE USE AND CHANGES, IT WILL HELP. 6-1-2024.
                    //
                    //




                    //
                    //
                    // THIS IS OUR ORIGINAL WORKFLOW STATUS UI. KEEP THIS FOR FUTURE REFERENCE. 6-1-2024.
                    //
                    //

                    //if (bwBudgetRequest.BudgetWorkflowStatus) {
                    //    if (bwBudgetRequest.BudgetWorkflowStatus.toString().toLowerCase() == 'collaboration') {
                    //        htmlBottom += '<span style="color:black;font-size:18pt;font-weight:bold;">Workflow step: ' + bwBudgetRequest.BudgetWorkflowStatus + '</span>';
                    //    } else {
                    //        htmlBottom += '<span style="color:black;font-size:18pt;font-weight:bold;">Workflow step: ' + bwBudgetRequest.BudgetWorkflowStatus + '</span>';
                    //    }
                    //} else {
                    //    htmlBottom += '<span style="color:black;font-size:18pt;font-weight:bold;">Workflow step: ' + 'xcx99345 invalid BudgetWorkflowStatus' + '</span>';
                    //}

                    //debugger; // Find out if we can get this from here, or if we have to have a backfill process. 2-19-2024.
                    //htmlBottom += '   <br />';
                    //htmlBottom += '   <span class="current_owners" style="color:black;font-size:12pt;font-weight:normal;">Current owner(s): [current_owners]</span>';
                    //htmlBottom += '   <br />';
                    //htmlBottom += '   <span class="approvers" style="color:black;font-size:12pt;font-weight:normal;">Approvers: [approvers]</span>';
                    //htmlBottom += '   <br />';
                    //htmlBottom += '   <span class="collaborators" style="color:black;font-size:12pt;font-weight:normal;">Collaborators: [collaborators]</span>';
                    //htmlBottom += '   <br />';
                    //htmlBottom += '   <span class="informed" style="color:black;font-size:12pt;font-weight:normal;">Informed: [informed]</span>';
                    //htmlBottom += '   <br />';

                    //
                    //
                    // end: THIS IS OUR ORIGINAL WORKFLOW STATUS UI. KEEP THIS FOR FUTURE REFERENCE. 6-1-2024.
                    //
                    //


















                } else if (objectType == 'bwWorkflowTaskItem') {

                    var html = '';

                    //if (carouselItem_Id) { // Only add the surrounding div lements when there is carouselItem_Id.
                    //html += '   <div id="' + 'null' + '" title="xcx231466534-8" alt="xcx231466534-8" class="executiveSummaryInCarousel" bwbudgetrequestid="' + bwBudgetRequestId + '" style="min-width:300px;max-width:550px;display:inline-block;white-space:nowrap;color: rgb(38, 38, 38); font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif; font-size: 1.25em;" ';
                    ////this.carouselItem_AddOnClick(carouselItem_Id, bwBudgetRequestId, this.options.taskData[i].Title, this.options.taskData[i].ProjectTitle, this.options.taskData[i].bwAssignedToRaciRoleAbbreviation, bwWorkflowTaskItemId);
                    //var ProjectTitle_clean = String(requestJson.ProjectTitle).replace(/["]/g, '&quot;').replace(/[']/g, '\\&#39;'); //&#39;'); // This is done because if the ProjectTitle (description) has a quote in it, there will be issues! The click event will fail to invoke the method.
                    //html += '   xcx="342523326-3"    onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'' + bwBudgetRequestId + '\', \'' + requestJson.Title + '\', \'' + ProjectTitle_clean + '\', \'' + requestJson.Title + '\', \'' + requestJson.bwAssignedToRaciRoleAbbreviation + '\', \'' + '' + '\');" ';
                    //html += '   >';
                    //}

                    var ProjectTitle_clean = String(bwWorkflowTaskItem.ProjectTitle).replace(/["]/g, '&quot;').replace(/[']/g, '\\&#39;'); //&#39;'); // This is done because if the ProjectTitle (description) has a quote in it, there will be issues! The click event will fail to invoke the method. 

                    html += '<br />';
                    html += '<span style="color:black;font-size:18pt;font-weight:bold;">' + bwWorkflowTaskItem.bwTaskTitle + '</span>';

                    html += '<span style="float:right;color:#f5f6fa;font-weight:bold;">TASK</span>'; // The color is set to space white (#f5f6fa) here.




                    //var bwBudgetRequestId = bwWorkflowTaskItem.bwRelatedItemId;

                    //bwWorkflowTaskItem["bwBudgetRequestId"] = bwWorkflowTaskItem.bwRelatedItemId;


                    //
                    //
                    // This is the home page task hover over behaviour. This displays current workflow status.
                    //
                    //


                    // Added 5-23-2023.

                    html += '<br />';

                    html += '<span style="display:inline-block;float:right;" ';
                    //html += ' onmouseenter="$(\'.bwRequest\').bwRequest(\'displayRequestWorkflowAuditTrailDialog2\', \'BR-230248\', \'Another email test of attachments\', \'0f4cde7c-5c1d-494d-90a3-ada45a3502b4\', \'93b8e938-be88-474c-9010-5e945a5d80a6\', \'1a15689f-aea5-434a-bf6b-27a8cf17e464\');this.style.backgroundColor=\'lightgoldenrodyellow\';" ';

                    //alert('requestJson: ' + JSON.stringify(requestJson) + ', requestJson.bwRequestTypeId: ' + requestJson.bwRequestTypeId + ', requestJson.bwWorkflowId: ' + requestJson.bwWorkflowId);


                    //debugger; // FIX THIS 8-25-2023.
                    //var bwRequestTypeId = JSON.parse(bwWorkflowTaskItem.bwRequestJson).bwRequestTypeId;
                    var bwRequestTypeId = bwWorkflowTaskItem.bwRequestTypeId;

                    //html += ' onmouseenter="$(\'.bwRequest\').bwRequest(\'displayRequestWorkflowAuditTrailDialog2\', \'' + requestJson.Title + '\', \'' + ProjectTitle_clean + '\', \'' + bwRequestTypeId + '\', \'' + bwBudgetRequestId + '\', \'' + '' + '\');this.style.backgroundColor=\'lightgoldenrodyellow\';" ';
                    html += ' onclick="$(\'.bwRequest\').bwRequest(\'displayRequestWorkflowAuditTrailDialog2\', \'' + bwWorkflowTaskItem.Title + '\', \'' + ProjectTitle_clean + '\', \'' + bwRequestTypeId + '\', \'' + bwWorkflowTaskItem.bwBudgetRequestId + '\', \'' + '' + '\');this.style.backgroundColor=\'lightgoldenrodyellow\';" ';


                    html += ' onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');this.style.backgroundColor=\'white\';"';
                    html += '>';

                    html += '   <img xcx="xcx122333" class="gridMagnifyingGlass" src="/images/zoom.jpg" style="width:50px;height:50px;" >';

                    html += '</span>';



                    //
                    //
                    // end: This is the home page task hover over behaviour. This displays current workflow status.
                    //
                    //











                    html += '<br />';
                    html += '<span style="color:black;font-size:12pt;font-weight:normal;">Your role: <span style="font-weight:bold;">' + bwWorkflowTaskItem.bwAssignedToRaciRoleName + ' (' + bwWorkflowTaskItem.bwAssignedToRaciRoleAbbreviation + ')</span></span>';

                    html += '<br />';
                    //var timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(bwWorkflowTaskItem.Created);
                    var timestamp4 = exports.getBudgetWorkflowStandardizedDate(bwWorkflowTaskItem.Created);
                    html += '<span style="color:black;font-size:12pt;font-weight:normal;">Task created: ' + timestamp4.toString() + '</span>';

                    var daysSinceTaskCreated = 0;
                    if (bwWorkflowTaskItem.Created) {
                        var cd = bwWorkflowTaskItem.Created;
                        var year = cd.split('-')[0];
                        var month = cd.split('-')[1];
                        var day = cd.split('-')[2].split('T')[0];
                        var taskCreatedDate = new Date(Number(year), Number(month) - 1, Number(day) - 1); // +1 because we're using overdue date.
                        var todaysDate = new Date();
                        var utc1 = Date.UTC(taskCreatedDate.getFullYear(), taskCreatedDate.getMonth(), taskCreatedDate.getDate());
                        var utc2 = Date.UTC(todaysDate.getFullYear(), todaysDate.getMonth(), todaysDate.getDate());
                        var _MS_PER_DAY = 1000 * 60 * 60 * 24;
                        daysSinceTaskCreated = Math.floor((utc2 - utc1) / _MS_PER_DAY) - 1;
                    } else {
                        daysSinceTaskCreated = '<span title="This is likely an old task, created before the Create date format was changed." alt="This is likely an old task, created before the Create date format was changed.">[error xcx232135-1-3-1]</span>';
                    }

                    html += '<br />';

                    // Added 12-30-2022 because I don't think I am using bwStatus correctly here, am I???
                    html += '<span style="font-weight:normal;">WorkflowStepName: <span xcx="xcx12312-234431" style="display:inline-block;max-width:350px;font-weight:bold;font-size:25pt;color:green;overflow:hidden;">' + bwWorkflowTaskItem.WorkflowStepName + ' </span>';
                    html += '<br />';
                    //debugger; // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                    if (!(bwWorkflowTaskItem && bwWorkflowTaskItem.bwStatus)) {

                        html += 'In bwCommonScripts.js.getExecutiveSummaryHtml(). Invalid value for bwWorkflowTaskItem.bwStatus: ' + bwWorkflowTaskItem.bwStatus + ', bwWorkflowTaskItem.Title: ' + bwWorkflowTaskItem.Title + ', bwWorkflowTaskItem.WorkflowStepName: ' + bwWorkflowTaskItem.WorkflowStepName + ', bwWorkflowTaskItem.bwAssignedToRaciRoleAbbreviation: ' + bwWorkflowTaskItem.bwAssignedToRaciRoleAbbreviation;

                        //alert('In bwCommonScripts.js.getExecutiveSummaryHtml(). Invalid value: ' + bwWorkflowTaskItem.bwStatus);
                        alert('In bwCommonScripts.js.getExecutiveSummaryHtml(). Invalid value for bwWorkflowTaskItem.bwStatus: ' + bwWorkflowTaskItem.bwStatus + ', bwWorkflowTaskItem.Title: ' + bwWorkflowTaskItem.Title + ', bwWorkflowTaskItem.WorkflowStepName: ' + bwWorkflowTaskItem.WorkflowStepName + ', bwWorkflowTaskItem.bwAssignedToRaciRoleAbbreviation: ' + bwWorkflowTaskItem.bwAssignedToRaciRoleAbbreviation);

                    } else {
                        if (bwWorkflowTaskItem.bwStatus.toString().toLowerCase() == 'collaboration') {
                            html += '<span style="font-weight:normal;">bwStatus: <span xcx="xcx12312-1" style="font-weight:bold;font-size:25pt;color:green;">' + bwWorkflowTaskItem.bwStatus + ' </span>';
                            html += '<span style="color:black;font-size:12pt;font-weight:normal;" bwtrace="xcx23488-1">';
                            //html += '[xx time left]';
                            if (daysSinceTaskCreated == 1) {
                                html += '&nbsp;&nbsp;' + daysSinceTaskCreated.toString() + ' day old&nbsp;&nbsp;';
                            } else {
                                html += '&nbsp;&nbsp;' + daysSinceTaskCreated.toString() + ' days old&nbsp;&nbsp;';
                            }
                            html += '</span></span>';
                        } else {
                            html += '<span style="font-weight:normal;">bwStatus: <span xcx="xcx12312-2" style="display:inline-block;max-width:350px;font-weight:bold;font-size:25pt;color:green;overflow:hidden;">' + bwWorkflowTaskItem.bwStatus + ' </span>';
                            html += '<span style="color:black;font-size:12pt;font-weight:normal;" bwtrace="xcx23488-2">';
                            //html += '[xx days old]';
                            if (daysSinceTaskCreated == 1) {
                                html += '&nbsp;&nbsp;' + daysSinceTaskCreated.toString() + ' day old&nbsp;&nbsp;';
                            } else {
                                html += '&nbsp;&nbsp;' + daysSinceTaskCreated.toString() + ' days old&nbsp;&nbsp;';
                            }
                            html += '</span></span>';
                        }
                    }

                    html += '<br />';
                    //var timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(bwWorkflowTaskItem.DailyOverdueTaskNotificationDate);
                    var timestamp4 = exports.getBudgetWorkflowStandardizedDate(bwWorkflowTaskItem.DailyOverdueTaskNotificationDate);
                    html += '<span style="font-size:12pt;color:black;font-weight:normal;cursor:help !important;" title="This is when the next reminder is scheduled to be sent..." alt="This is when the next reminder is scheduled to be sent...">Reminder: <span style="font-weight:normal;">' + timestamp4 + ' </span></span>'; // font-family: 'Segoe UI Light','Segoe UI','Segoe',Tahoma,Helvetica,Arial,sans-serif;

                    html += '<br />';
                    html += '<hr style="color:skyblue;" />';

                    html += '<span style="font-size:12pt;"><span style="color:black;font-size:18pt;font-weight:bold;">' + bwWorkflowTaskItem.Title + '</span></span>';



                    //html += '                        <div style="position:absolute; bottom:0;float:left;width: 26px; height:26px; background-color:#f5f6fa; border-radius:26px 0 0 0;margin-left:1px;margin-bottom:-1px;"></div> <!-- The background-color is set to space white (#f5f6fa) here, for the "under the curve" color of this element. -->';
                    // debugger; // 4-20222



                    var requestSingletonName = 'xcx324277';
                    //if (thiz.options.brData && thiz.options.brData.PendingBudgetRequests && thiz.options.brData.PendingBudgetRequests.length) {
                    //    for (var r = 0; r < thiz.options.brData.PendingBudgetRequests.length; r++) {
                    //        if (bwBudgetRequestId == thiz.options.brData.PendingBudgetRequests[r].bwBudgetRequestId) {
                    // We found it!
                    //var bwRequestTypeId = thiz.options.brData.PendingBudgetRequests[r].bwRequestTypeId;
                    //if (bwRequestTypeId) {
                    //    for (var s = 0; s < requestTypes.length; s++) {
                    //        if (bwRequestTypeId = requestTypes[s].bwRequestTypeId) {

                    //            console.log('In bwCommonScripts.js.getExecutiveSummaryHtml(). Getting requestTypes[s].SingletonName. Is this working now? 5-19-2023. bwRequestTypeId: ' + bwRequestTypeId + ', requestTypes[' + s + '].bwRequestTypeId: ' + requestTypes[s].bwRequestTypeId);
                    //            //// debugger;
                    //            requestSingletonName = requestTypes[s].SingletonName;
                    //            break;
                    //        }
                    //    }
                    //} else {
                    //    requestSingletonName = 'XCX44456';
                    //    break;
                    //}
                    //    }
                    //}
                    //}
                    //html += '<span xcx="xcx99871" style="float:right;color:#f5f6fa;font-weight:bold;">' + requestSingletonName + ' xcx1:' + bwRequestTypeId + '</span>'; // The color is set to space white (#f5f6fa) here.
                    html += '<span xcx="xcx99871" style="float:right;color:#f5f6fa;font-weight:bold;">' + requestSingletonName + '</span>'; // The color is set to space white (#f5f6fa) here.
                    html += '<br />';





                    //
                    // This font-size is meant to be larger, since it is the ProjectTile of the request. 5-24-2022
                    //
                    html += '<div xcx="xcx2312-1" style="color:black;font-size:30pt;font-weight:bold;overflow:hidden;white-space:normal;">' + bwWorkflowTaskItem.ProjectTitle + '</div>'; // modified 12-26-2022
                    html += '<br />';
                    //debugger; // 11-24-2022

                    if (bwWorkflowTaskItem.bwRequestJson.indexOf('no value') > -1) {

                        var msg = 'Error caught in sharedserverandclientscripts/bwCommonScripts.getExecutiveSummaryHtml(): The bwRequestJson is marked as having no value. xcx21341.';
                        console.log(msg);
                        displayAlertDialog(msg);

                    } else {

                        // Display the bwJustificationDetailsField in the executive summary. 
                        var tmpJustificationDetails = '[no value found]';
                        if (bwWorkflowTaskItem.bwRequestJson) {
                            tmpbwRequestJson = JSON.parse(bwWorkflowTaskItem.bwRequestJson);
                            if (tmpbwRequestJson.bwJustificationDetailsField && tmpbwRequestJson.bwJustificationDetailsField.value) {
                                var ellippses = '';
                                if (String(tmpbwRequestJson.bwJustificationDetailsField.value).length > 255) {
                                    ellippses = '...';
                                }

                                tmpJustificationDetails = tmpbwRequestJson.bwJustificationDetailsField.value.replace(/<[^>]+>/g, '');
                                html += '   <div xcx="xcx2312-1-x2-2" style="color:darkgray;font-size:15pt;font-weight:bold;white-space:normal;max-width:750px;overflow:hidden;">' + String(tmpJustificationDetails).substring(0, 255) + ' ' + ellippses + '</div>';
                                html += '   <br />';
                            }
                        } else {

                            console.log('Error in bwCommonScripts.js.getExecutiveSummaryHtml(). No value for bwWorkflowTaskItem.bwRequestJson: ' + bwWorkflowTaskItem.bwRequestJson);
                            displayAlertDialog('Error in bwCommonScripts.js.getExecutiveSummaryHtml(). No value for bwWorkflowTaskItem.bwRequestJson: ' + bwWorkflowTaskItem.bwRequestJson);

                            //html += '   <div xcx="xcx2312-1-x2-2" style="color:darkgray;font-size:15pt;font-weight:bold;white-space:normal;max-width:750px;overflow:hidden;">' + String(tmpJustificationDetails).substring(0, 255) + ' ' + ellippses + '</div>';
                            //html += '   <br />';

                        }








                        // Created by.
                        html += '<span style="color:black;font-size:12pt;font-weight:normal;">Requested by: ' + bwWorkflowTaskItem.CreatedBy + '</span>';
                        html += '<br />';
                        //var RequestedCapital_cleaned = $('.bwAuthentication').bwAuthentication('getBudgetWorkflowStandardizedCurrency', bwWorkflowTaskItem.RequestedCapital);
                        var RequestedCapital_cleaned = exports.getBudgetWorkflowStandardizedCurrency(bwWorkflowTaskItem.RequestedCapital);
                        html += '<span style="color:black;font-size:12pt;font-weight:normal;">Requested capital: <span style="color:purple;font-size:18pt;">' + RequestedCapital_cleaned + '</span></span>';
                        html += '<br />';


                        //html += '<span style="color:black;font-size:12pt;font-weight:normal;">Calculated capital: <span style="color:purple;font-size:18pt;">' + RequestedCapital_cleaned + '</span></span>';
                        //html += '<br />';



                        var timestamp4;
                        var requestCreatedDate;
                        //if (thiz.options.brData && thiz.options.brData.PendingBudgetRequests && thiz.options.brData.PendingBudgetRequests.length) {
                        //    for (var r = 0; r < thiz.options.brData.PendingBudgetRequests.length; r++) {
                        //        if (bwBudgetRequestId == thiz.options.brData.PendingBudgetRequests[r].bwBudgetRequestId) {
                        //            // We found it!
                        requestCreatedDate = bwWorkflowTaskItem.Created;
                        //        }
                        //    }
                        //}
                        if (requestCreatedDate) {
                            //timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(requestCreatedDate);
                            timestamp4 = exports.getBudgetWorkflowStandardizedDate(requestCreatedDate);
                        } else {
                            timestamp4 = '[not available]';
                        }
                        html += '<span style="color:black;font-size:12pt;font-weight:normal;">Request created: ' + timestamp4 + '</span>';
                        html += '<br />';

                        html += '<span style="color:black;font-size:12pt;font-weight:normal;">Org: <span style="">' + bwWorkflowTaskItem.OrgName + '</span></span>';
                        html += '<br />';
                        html += '<br />';

                        var bwWorkflowTaskItemId = bwWorkflowTaskItem.bwWorkflowTaskItemId;
                        html += '        <div class="executiveSummaryAttachments" id="bwExecutiveSummariesCarousel_spanBwExecutiveSummariesCarouselPrimaryImages_MyPendingTasks_' + bwWorkflowTaskItemId + '" style="text-align: center;">';
                        html += '        </div>';

                        if (!bwWorkflowTaskItem.bwRequestJson) {
                            console.log('@@@@@@@@@@@Error in bwCommonScripts.js.getExecutiveSummaryHtml(). Unexpected value for bwWorkflowTaskItem.bwRequestJson: ' + bwWorkflowTaskItem.bwRequestJson);
                        }

                    }

                }


                //
                //
                // NOW THAT WE HAVE THE HTML, PROCESS IT according if it is an email or display in the browser.
                //
                //

                if (subjectTemplate && bodyTemplate) {

                    if (!(bodyTemplate.indexOf('%Executive Summary%') > -1)) {

                        // The string "%Executive Summary%" does not exist in the bodyTemplate.
                        var result = {
                            status: 'SUCCESS',
                            message: 'The string "%Executive Summary%" does not exist in the bodyTemplate.',
                            html: '',
                            subjectTemplate: subjectTemplate,
                            bodyTemplate: bodyTemplate
                        }
                        resolve(result);

                    } else {

                        var bwRequestJson = JSON.parse(bwBudgetRequest.bwRequestJson);

                        var promise = exports.getThumbnails_64Bit(bwBudgetRequest.bwWorkflowAppId, bwBudgetRequest.bwBudgetRequestId);
                        promise.then(function (results) {
                            try {

                                // results comes back like this:
                                //var results = {
                                //    status: 'SUCCESS',
                                //    message: 'SUCCESS',
                                //    files: [ // an array.
                                //        {
                                //            bwBudgetRequestId: bwBudgetRequestId,
                                //            Filename: files[i],
                                //            File64bit: contents, 
                                //            Description: description
                                //        }]
                                //    }

                                if (results.status != 'SUCCESS') {

                                    var html3 = '';
                                    html3 += html;
                                    //html3 += '<img id="img_Email_Attachments_Test1" xcx="xcx2139994" src="' + results.data + '" />';
                                    html3 += html2;

                                    var result = {
                                        status: 'ERROR',
                                        message: 'Error: The executive summary has not had the attachment thumbnails included.',
                                        html: html3,
                                        subjectTemplate: subjectTemplate,
                                        bodyTemplate: bodyTemplate
                                    }
                                    reject(result);

                                } else {

                                    var files = [];
                                    if (results.files) {
                                        files = JSON.parse(results.files);
                                    }

                                    console.log('>>>>>>>> returned from getThumbnails_64Bit(). files.length: ' + files.length);

                                    var htmlMiddle = '';

                                    if (files.length > 0) {

                                        htmlMiddle += '<br />';
                                        htmlMiddle += '<span style="display:block;padding-top:5px;">'; // Using a span because a style impacts a div tag here.
                                        htmlMiddle += '<span style="color:black;font-size:12pt;font-weight:normal;float:left;" xcx="xcx1231sd2-2">Attachment(s): </span>';

                                        for (var i = 0; i < files.length; i++) {
                                            htmlMiddle += '<br />';
                                            htmlMiddle += '<img id="img_Email_Attachments_Test1" xcx="xcx2139994" src="' + files[i].File64bit + '" alt="' + files[i].Filename + '" style="height:150px;max-width:500px;border:1px solid gray;border-radius:0 30px 0 0;" />';
                                        }

                                    }

                                    // test. Please leave this comment.
                                    //html3 += '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==" alt="Red dot" />';

                                    //
                                    // Emails have a slightly different div tag configuration for some reason. Perhaps to accomodate the munging that email browsers do to obscure custom javascript and css.
                                    //

                                    var html = '';

                                    html += '<style>';
                                    html += '.executiveSummaryInCarousel { ';
                                    html += '  cursor:pointer;max-width:550px;display:inline-block;white-space:nowrap;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif; font-size: 1.25em;min-width: 300px;min-height: 300px;border:2px solid lightgray;border-radius:30px 30px 30px 30px;padding:0 10px 20px 10px;vertical-align:top;background-color:white;';
                                    html += '}';
                                    html += '.executiveSummaryInCarousel_wrap div:hover { ';
                                    html += '   background-color:aliceblue;';
                                    html += '   border:2px solid skyblue;';
                                    html += '   cursor:pointer !important;';
                                    html += '}';
                                    html += '</style>';


                                     //
                                    // REMOVED THIS ANCHOR TAG BECAUSE IT IS USED WHEN NOT IN THE APPLICATION. IF USING EXTERNAL EMAIL THE ANCHOR TAG IS NEEDED. NOT SURE HOW TO HANDLE THIS YET. 7-25-2024.
                                    //
                                    //html += '<a  href="https://' + globalUrl + '/index.html?request=' + bwBudgetRequest.bwBudgetRequestId + '&signin=1" style="text-decoration:none;">';



                                    html += '<div class="executiveSummaryInCarousel_wrap"  >'; // class="executiveSummaryInCarousel" >'; // Wrapping div.
                                    html += '   <div xcx="xcx3255645679" class="executiveSummaryInCarousel" id="' + 'carouselItem_Id' + '" title="Executive Summary for BR-2xxxxxx. Click to log in and view the request details. xcx231466534-7-2-5" alt="xcx231466534-7" bwbudgetrequestid="' + bwBudgetRequest.bwBudgetRequestId + '"  ';
                                    var ProjectTitle_clean = String(bwBudgetRequest.ProjectTitle).replace(/["]/g, '&quot;').replace(/[']/g, '\\&#39;'); //&#39;'); // This is done because if the ProjectTitle (description) has a quote in it, there will be issues! The click event will fail to invoke the method.
                                    html += '   xcx="342523326-2-2"    onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', ' + bwBudgetRequest.TrashBin + ', \'' + bwBudgetRequest.bwBudgetRequestId + '\', \'' + bwBudgetRequest.Title + '\', \'' + ProjectTitle_clean + '\', \'' + bwBudgetRequest.Title + '\', \'' + bwRequestJson.bwAssignedToRaciRoleAbbreviation;
                                    html += '\', \'' + '7777xcx7777777-2' + '\');" ';
                                    html += '   >';
                                    //html += '<br />';

                                    //html += htmlTop + htmlMiddle + htmlBottom + '</div></div></a>';

                                    html += htmlTop + htmlMiddle + htmlBottom + '</div></div>';

                                    var result = {
                                        status: 'SUCCESS',
                                        message: 'The executive summary has had the attachment thumbnails included.',
                                        html: html,
                                        subjectTemplate: subjectTemplate,
                                        bodyTemplate: bodyTemplate
                                    }
                                    resolve(result);

                                }

                            } catch (e) {

                                var msg = 'Exception in bwCommonScripts.js.getExecutiveSummaryHtml(): ' + e.message + ', ' + e.stack;
                                var threatLevel = 'elevated'; // severe, high, elevated, guarded, low.
                                var source = 'start.js.bwCommonScripts.js.getExecutiveSummaryHtml()';
                                var errorCode = null;
                                WriteToErrorLog(threatLevel, source, errorCode, msg);

                                console.log(msg);
                                displayAlertDialog(msg);

                                var result = {
                                    status: 'EXCEPTION',
                                    message: msg
                                }
                                reject(result);

                            }

                        }).catch(function (e) {

                            var msg = 'Exception in bwCommonScripts.js.getExecutiveSummaryHtml(): ' + JSON.stringify(e);
                            var threatLevel = 'elevated'; // severe, high, elevated, guarded, low.
                            var source = 'start.js.bwCommonScripts.js.getExecutiveSummaryHtml()';
                            var errorCode = null;
                            WriteToErrorLog(threatLevel, source, errorCode, msg);

                            console.log(msg);
                            displayAlertDialog(msg);

                            var result = {
                                status: 'EXCEPTION',
                                message: msg
                            }
                            reject(result);

                        });

                    }

                } else {

                    if (objectType == 'bwBudgetRequest') {

                        var bwBudgetRequest = object;

                        if (executiveSummaryElement) { // Check if client or server side.
                            // Get the request type. For example: "Budget Request".
                            var bwEnabledRequestTypes = $('.bwAuthentication').bwAuthentication('option', 'bwEnabledRequestTypes');
                            var requestTypes = bwEnabledRequestTypes.EnabledItems; // Global, populated in the beginning when the app loads.

                            var bwRequestTypeId = bwBudgetRequest.bwRequestTypeId;
                            var requestType;
                            for (var i = 0; i < requestTypes.length; i++) {
                                if (bwRequestTypeId == requestTypes[i].bwRequestTypeId) {
                                    requestType = requestTypes[i].SingletonName;
                                    break;
                                }
                            }
                        }

                        var html = '';

                        html += htmlTop;
                        html += '   <div class="executiveSummaryAttachments" id="bwExecutiveSummariesCarousel_spanBwExecutiveSummariesCarouselPrimaryImages_MyUnsubmittedRequests_' + bwBudgetRequest.bwBudgetRequestId + '" style="text-align: center;">';
                        //html += '       xcx8798790877777';
                        html += '   </div>';
                        html += htmlBottom;

                        var result = {
                            message: 'SUCCESS',
                            html: html,
                            bwBudgetRequestId: bwBudgetRequest.bwBudgetRequestId,
                            bwBudgetRequest: bwBudgetRequest,
                            executiveSummaryElement: executiveSummaryElement
                        }
                        resolve(result);

                    } else if (objectType == 'bwWorkflowTaskItem') {

                        var bwWorkflowTaskItem = object;

                        bwWorkflowTaskItem["bwBudgetRequestId"] = bwWorkflowTaskItem.bwRelatedItemId;

                        var result = {
                            status: 'SUCCESS',
                            message: 'SUCCESS',
                            html: html,
                            bwBudgetRequestId: bwWorkflowTaskItem.bwBudgetRequestId,
                            bwBudgetRequest: bwWorkflowTaskItem,
                            executiveSummaryElement: executiveSummaryElement
                        }
                        resolve(result);

                    } else {

                        // Unexpected objectType.
                        var msg = 'Error in bwCommonScripts.js.getExecutiveSummaryHtml(). Unexpected objectType: ' + objectType;
                        var threatLevel = 'elevated'; // severe, high, elevated, guarded, low.
                        var source = 'bwCommonScripts.js.getExecutiveSummaryHtml()';
                        var errorCode = null;
                        WriteToErrorLog(threatLevel, source, errorCode, msg);

                        console.log(msg);
                        displayAlertDialog(msg);

                        var result = {
                            html: msg
                        }
                        return result;

                    }

                }

            } catch (e) {

                var msg = 'Exception in bwCommonScripts.js.getExecutiveSummaryHtml(): ' + e.message + ', ' + e.stack;
                var threatLevel = 'elevated'; // severe, high, elevated, guarded, low.
                var source = 'bwCommonScripts.js.getExecutiveSummaryHtml()';
                var errorCode = null;
                WriteToErrorLog(threatLevel, source, errorCode, msg);

                console.log(msg);
                displayAlertDialog(msg);

                var result = {
                    html: 'Exception in bwCommonScripts.js.getExecutiveSummaryHtml(): ' + e.message + ', ' + e.stack
                }
                return result;
            }

        })
    }

    exports.renderInventoryItems_ForExecutiveSummary = function (bwBudgetRequestId, bwBudgetRequest, executiveSummaryElement, forceRenderTheImageThumbnail) { // forceRenderTheImageThumbnail is used for hover-overs, because most likely the user will want to see the thumbnail.
        return new Promise(function (resolve, reject) {
            try {
                console.log('In bwCommonScripts.js.renderInventoryItems_ForExecutiveSummary().');
                //alert('In bwCommonScripts.js.renderInventoryItems_ForExecutiveSummary().');

                var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

                // I have a couple of these. They are weird because there are so few JSON properties. Is it from a long time ago? Hmmm...:
                // ************Error in bwCommonScripts.js.renderInventoryItems_ForExecutiveSummary(). Invalid value for bwBudgetRequest.bwRequestJson. bwBudgetRequest: {"_id":"62df046c30a68c5a1869a196","bwBudgetRequestId":"b77120e7-0133-4aa1-bf16-a21bc65be10d","bwWorkflowAppId":"c48535a4-9a6b-4b95-9d67-c6569e9695d8","FileConversionQueued":false,"__v":0}
                // ************Error in bwCommonScripts.js.renderInventoryItems_ForExecutiveSummary(). Invalid value for bwBudgetRequest.bwRequestJson. bwBudgetRequest: {"_id":"62df03ddd81361e745819582","bwBudgetRequestId":"e2c262ab-1671-48bd-881f-83f16b3fd1cc","bwWorkflowAppId":"c48535a4-9a6b-4b95-9d67-c6569e9695d8","FileConversionQueued":false,"__v":0}

                if (!bwBudgetRequest.bwRequestJson) {

                    var msg = 'Error in bwCommonScripts.js.renderInventoryItems_ForExecutiveSummary(). No bwRequestJson property in bwBudgetRequest.';

                    var result = {
                        status: 'ERROR',
                        message: msg
                    }
                    reject(result);

                } else {

                    //var msg = 'xcx21312414124 Error in bwCommonScripts.js.renderInventoryItems_ForExecutiveSummary(). No value for bwBudgetRequest.bwRequestJson: ' + bwBudgetRequest.bwRequestJson;

                    //alert(msg);

                    var bwRequestJson;
                    try {
                        var bwRequestJson = JSON.parse(bwBudgetRequest.bwRequestJson);
                    } catch (e) {
                        var xx = 'COULD_NOT_PARSE';
                    }

                    if (!bwRequestJson) {

                        var msg = 'xcx21312414124 Error in bwCommonScripts.js.renderInventoryItems_ForExecutiveSummary(). No value for bwBudgetRequest.bwRequestJson: ' + xx; // bwBudgetRequest.bwRequestJson;

                        console.log(msg);
                        displayAlertDialog(msg);

                        var result = {
                            status: 'ERROR',
                            message: msg
                        }

                        reject(result);

                    } else {

                        


                        //
                        // Display inventory images
                        //

                        var InventoryItems = [];

                        if (bwRequestJson && bwRequestJson.bwSelectInventoryItems && bwRequestJson.bwSelectInventoryItems.value) {
                            InventoryItems = bwRequestJson.bwSelectInventoryItems.value;
                        }

                        if (InventoryItems.length > 0) {

                            var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                                return v.toString(16);
                            });
                            var html = '';

                            for (var j = 0; j < InventoryItems.length; j++) {

                                //var imagePath = globalUrlPrefix + globalUrl + '/_files/' + workflowAppId + '/inventoryimages/' + InventoryItems[j].bwInventoryItemId + '/inventoryimage.png?v=' + guid;
                                //html += '   <img xcx="xcx213467" src="' + imagePath + '" style="height:150px;" />';

                                var activeStateIdentifier = JSON.parse($('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier'));

                                if (activeStateIdentifier.status != 'SUCCESS') {

                                    html += '[No image. Unauthorized. xcx213124-3]';

                                } else {

                                    //html += '<img xcx="xcx443321-8-1" src="' + fileUrl_Thumbnail + '?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier + '" style="height:150px;max-width:500px;border:1px solid gray;border-radius:0 30px 0 0;" ';
                                    var imagePath = globalUrlPrefix + globalUrl + '/_files/' + workflowAppId + '/inventoryimages/' + InventoryItems[j].bwInventoryItemId + '/inventoryimage.png?v=' + guid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier;
                                    html += '   <img xcx="xcx443321-8-3" style="height:150px;display:inline-block;padding:0 10px 0 10px;" src="' + imagePath + '" />';

                                }


                            }


                            if (html != '') {

                                var html2 = '';
                                html2 += '<div xcx="xcx1324367-1">';
                                html2 += '<span style="color:black;font-size:12pt;font-weight:normal;float:left;">Inventory item(s): </span>'; // Add the title, since we have some items to display.
                                html2 += '<br />';
                                html2 += '<div xcx="xcx1324367-2" style="flex-wrap: wrap;display:flex;">'; // This will make all th eimages wrap and stay in their div container on the form.

                                html = html2 + html;

                                html += '</div>';
                                html += '</div>';





                                //$('#bwExecutiveSummariesCarousel_spanBwExecutiveSummariesCarouselPrimaryImages_MyUnsubmittedRequests_' + bwBudgetRequestId).append(html); 
                                //alert('Adding inventory images. xcx12321342534 InventoryItems.length: ' + InventoryItems.length + ', workflowTaskItemId: ' + workflowTaskItemId + ', html: ' + html);
                                //$('#bwExecutiveSummariesCarousel_spanBwExecutiveSummariesCarouselPrimaryImages_MyUnsubmittedRequests_' + workflowTaskItemId).append(html);


                                //var executiveSummaries = $(accordionDrawerElement).find('.executiveSummaryInCarousel');
                                //if (executiveSummaries && executiveSummaries.length && executiveSummaries.length > 0) {

                                //    //alert('executiveSummaries.length: ' + executiveSummaries.length);

                                //    for (var i = 0; i < executiveSummaries.length; i++) {
                                //var budgetRequestId = $(executiveSummaryElement).attr('bwbudgetrequestid');
                                //var workflowTaskItemId = $(executiveSummaryElement).attr('bwworkflowtaskitemid');
                                ////if ((bwBudgetRequestId == budgetRequestId) && (bwWorkflowTaskItemId == workflowTaskItemId)) {
                                //if ((bwBudgetRequestId == budgetRequestId)) {

                                //    //console.log('trying to locate attachments element....');

                                var executiveSummaryAttachmentsElement = $(executiveSummaryElement).find('.executiveSummaryAttachments')[0];
                                $(executiveSummaryAttachmentsElement).append(html); // Display the attachment.

                                //    //displayAlertDialog('>>>>>>>>> Rendering attachments in element [' + executiveSummaryAttachmentsElement.id + ']');

                                //    //        break;
                                //    //    }
                                //    //}
                                //}




                            }



                            //$('#bwExecutiveSummariesCarousel_spanBwExecutiveSummariesCarouselPrimaryImages_' + bwWorkflowTaskItemId).append(html);
                        }
                        //
                        // end: Display inventory images
                        //

                        var result = {
                            status: 'SUCCESS',
                            message: 'SUCCESS',
                            //html: html,
                            bwBudgetRequestId: bwBudgetRequestId,
                            bwBudgetRequest: bwBudgetRequest,
                            executiveSummaryElement: executiveSummaryElement
                        }
                        resolve(result);

                    }

                }

            } catch (e) {

                var msg = 'Exception in bwCommonScripts.js.renderInventoryItems_ForExecutiveSummary(): ' + e.message + ', ' + e.stack;

                console.log(msg);
                displayAlertDialog(msg);

                var result = {
                    status: 'EXCEPTION',
                    message: msg
                }
                reject(result);

            }
        });
    }

    exports.renderAttachments_ForExecutiveSummary = function (bwBudgetRequestId, bwBudgetRequest, executiveSummaryElement, forceRenderTheImageThumbnail) { // forceRenderTheImageThumbnail is used for hover-overs, because most likely the user will want to see the thumbnail.
        var thiz = this;
        return new Promise(function (resolve, reject) {
            try {
                console.log('In bwCommonScripts.js.renderAttachments_ForExecutiveSummary(). forceRenderTheImageThumbnail IS THE KEY TO THIS FUNCTIONALITY. SET THIS TO "not true" IN ORDER TO PERFORM OUR OPTIMIZATIONS AND INCREASE SPEED TO REALTIME LEVELS. 11-4-2023.');
                //alert('In bwCommonScripts.js.renderAttachments_ForExecutiveSummary(). forceRenderTheImageThumbnail IS THE KEY TO THIS FUNCTIONALITY. SET THIS TO "not true" IN ORDER TO PERFORM OUR OPTIMIZATIONS AND INCREASE SPEED TO REALTIME LEVELS. 11-4-2023.');

                //
                //
                // forceRenderTheImageThumbnail IS THE KEY TO THIS FUNCTIONALITY. SET THIS TO "not true" IN ORDER TO PERFORM OUR OPTIMIZATIONS AND INCREASE SPEED TO REALTIME LEVELS. 11-4-2023.
                //
                //
                //forceRenderTheImageThumbnail = true; // I want to see the thumbnails at the moment, but will comment this line out when the optimized image loading is implemented. 8-26-2023.


                if (forceRenderTheImageThumbnail == true) {
                    console.log('In bwCommonScripts.js.renderAttachments_ForExecutiveSummary(). forceRenderTheImageThumbnail is set to true. THIS MEANS NO IMAGES MAY DISPLAY UNTIL WE GET OUR OPTIMIZED IMAGE THUMBNAIL RENDERING IN POLACE.');
                } else {
                    console.log('In bwCommonScripts.js.renderAttachments_ForExecutiveSummary(). ');
                }


                //if (!(bwBudgetRequestId && bwWorkflowTaskItemId)) {
                if (!(bwBudgetRequestId)) {

                    console.log('In bwCommonScripts.js.renderAttachments_ForExecutiveSummary(). Unexpected value(s) for bwBudgetRequestId and/or bwWorkflowTaskItemId. bwBudgetRequestId: ' + bwBudgetRequestId); //  + ', bwWorkflowTaskItemId: ' + bwWorkflowTaskItemId);
                    displayAlertDialog('In bwCommonScripts.js.renderAttachments_ForExecutiveSummary(). Unexpected value(s) for bwBudgetRequestId and/or bwWorkflowTaskItemId. bwBudgetRequestId: ' + bwBudgetRequestId); //  + ', bwWorkflowTaskItemId: ' + bwWorkflowTaskItemId);

                } else {



                    console.log('In bwCommonScripts.js.renderAttachments_ForExecutiveSummary(). bwBudgetRequestId: ' + bwBudgetRequestId); // + ', bwWorkflowTaskItemId: ' + bwWorkflowTaskItemId);
                    //alert('In bwCommonScripts.js.renderAttachments_ForExecutiveSummary(). bwBudgetRequestId: ' + bwBudgetRequestId); // + ', bwWorkflowTaskItemId: ' + bwWorkflowTaskItemId);

                    var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                    var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

                    var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                    var data = {
                        bwParticipantId_LoggedIn: participantId,
                        bwActiveStateIdentifier: activeStateIdentifier,
                        bwWorkflowAppId_LoggedIn: workflowAppId,

                        bwWorkflowAppId: workflowAppId,
                        bwBudgetRequestId: bwBudgetRequestId
                    }

                    var operationUri = globalUrlPrefix + globalUrl + '/_files/' + 'getlistofattachmentsforbudgetrequest'; // _files allows us to use nginx to route these to a dedicated file server.
                    $.ajax({
                        url: operationUri,
                        method: 'POST',
                        data: data,
                        headers: {
                            "Accept": "application/json; odata=verbose"
                        },
                        success: function (results) {
                            try {

                                //alert('In bwCommonScripts.js.renderAttachments_ForExecutiveSummary(). results: ' + JSON.stringify(results));

                                if (results.data.length > 0) {

                                    var preventCachingGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                                        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                                        return v.toString(16);
                                    });

                                    var div = document.createElement('div');

                                    var span = document.createElement('span');
                                    span.style.color = 'black';
                                    span.style.fontSize = '12pt';
                                    span.style.fontWeight = 'normal';
                                    span.style.float = 'left';
                                    span.innerHTML = 'Attachment(s): ';

                                    var br = document.createElement('br');

                                    var ul = document.createElement('ul');
                                    ul.style.display = 'flex';
                                    ul.style.flexWrap = 'wrap';
                                    ul.style.listStyleType = 'none';

                                    div.appendChild(span);
                                    div.appendChild(br);
                                    div.appendChild(ul);

                                    for (var i = 0; i < results.data.length; i++) {

                                        var filename = results.data[i].Display_Filename;

                                        var fileUrl_Thumbnail = '';


                                        
                                        fileUrl_Thumbnail = "_files/" + workflowAppId + "/" + bwBudgetRequestId + "/" + results.data[i].Actual_Filename + '?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + JSON.parse(activeStateIdentifier).ActiveStateIdentifier;

                                        // 8-13-2024.
                                        //fileUrl_Thumbnail = "_files/" + workflowAppId + "/" + bwBudgetRequestId + "/" + results.data[i].Actual_Filename + '?v=' + preventCachingGuid; // + '&ActiveStateIdentifier=' + JSON.parse(activeStateIdentifier).ActiveStateIdentifier;


                                        var li = document.createElement('li');

                                        var extensionIndex = filename.split('.').length - 1;
                                        var fileExtension = filename.toLowerCase().split('.')[extensionIndex];
                                        if ((fileExtension == 'xlsx') || (fileExtension == 'xls')) {

                                            //html += '<img xcx="xcx443321-1" src="images/excelicon.png" style="width:100px;height:46px;cursor:pointer;" />';

                                            var img = document.createElement('img');
                                            img.style.height = '150px';
                                            img.style.border = '1px solid gray';
                                            img.setAttribute('xcx', 'xcx443321-8-1-new-3-1');
                                            img.setAttribute('bwsrc', fileUrl_Thumbnail);
                                            img.src = '/images/excelicon.png';

                                            li.append(img);

                                        } else if (fileExtension == 'ods') {

                                            //html += '<img xcx="xcx443321-1" src="images/excelicon.png" style="width:100px;height:46px;cursor:pointer;" />';

                                            var img = document.createElement('img');
                                            img.style.height = '150px';
                                            img.style.border = '1px solid gray';
                                            img.setAttribute('xcx', 'xcx443321-8-1-new-3-2');
                                            img.setAttribute('bwsrc', fileUrl_Thumbnail);
                                            img.src = '/images/ods.png';

                                            li.append(img);

                                        } else if (fileExtension == 'pdf') {

                                            //
                                            //
                                            // THIS IS WHERE WE ARE TRYING TO IMPLEMENT IMG thumbnails which we can pause/stop the loading of, in order to improve responsiveness.
                                            //
                                            //

                                            console.log('THIS IS WHERE WE ARE TRYING TO IMPLEMENT IMG thumbnails which we can pause/stop the loading of, in order to improve responsiveness. xcx213434');

                                            var img = document.createElement('img');
                                            img.style.height = '150px';
                                            img.style.border = '1px solid gray';
                                            img.style.borderRadius = '0px 30px 0px 0px';
                                            img.setAttribute('xcx', 'xcx443321-8-1-new-3-3');
                                            img.setAttribute('bwsrc', fileUrl_Thumbnail);
                                            img.src = fileUrl_Thumbnail;
                                            //img.src = '/images/noimageavailable.png';

                                            li.append(img);

                                        } else if (fileExtension == 'mp4') {

                                            if (!(results.data[i].Actual_Filename.indexOf('.mp4') > 0)) {

                                                // do nothing. We dont want to display.mp4 here, just their thumbnails.
                                            } else {

                                                //
                                                //
                                                // THIS IS WHERE WE ARE TRYING TO IMPLEMENT IMG thumbnails which we can pause/stop the loading of, in order to improve responsiveness.
                                                //
                                                //

                                                console.log('THIS IS WHERE WE ARE TRYING TO IMPLEMENT IMG thumbnails which we can pause/stop the loading of, in order to improve responsiveness. xcx4333');

                                                var img = document.createElement('img');
                                                img.style.height = '150px';
                                                img.style.border = '1px solid gray';
                                                img.setAttribute('xcx', 'xcx443321-8-1-new-3-4');
                                                if (!forceRenderTheImageThumbnail) {
                                                    img.setAttribute('bwsrc', fileUrl_Thumbnail);

                                                    // 12-14-2023. ALSO search for "xcx443321-8-1-new-3-4", "xcx443321-8-1-new-3-11", "xcx443321-8-1-new-3-12"
                                                    if (thumbnailLoadingEnabled) {
                                                        img.src = fileUrl_Thumbnail;
                                                    } else {
                                                        img.src = '/images/imagenotloaded.png';
                                                    }





                                                    //img.src = '/images/imagenotloaded.png';


                                                } else {
                                                    img.src = fileUrl_Thumbnail;
                                                }

                                                li.append(img);

                                            }

                                        } else if (fileExtension == 'rtf') {

                                            var img = document.createElement('img');
                                            img.style.height = '150px';
                                            img.style.border = '1px solid gray';
                                            img.setAttribute('xcx', 'xcx443321-8-1-new-3-5');
                                            img.setAttribute('bwsrc', fileUrl_Thumbnail);
                                            img.src = '/images/rtf.png';

                                            li.append(img);

                                        } else if (fileExtension == 'vob') {

                                            var img = document.createElement('img');
                                            img.style.height = '150px';
                                            img.style.border = '1px solid gray';
                                            img.setAttribute('xcx', 'xcx443321-8-1-new-3-6');
                                            img.setAttribute('bwsrc', fileUrl_Thumbnail);
                                            img.src = '/images/vob.png';

                                            li.append(img);

                                        } else if (fileExtension == 'mov') {

                                            var img = document.createElement('img');
                                            img.style.height = '150px';
                                            img.style.border = '1px solid gray';
                                            img.setAttribute('xcx', 'xcx443321-8-1-new-3-7');
                                            img.setAttribute('bwsrc', fileUrl_Thumbnail);
                                            img.src = '/images/mov.png';

                                            li.append(img);

                                        } else if (fileExtension == 'mp3') {

                                            var img = document.createElement('img');
                                            img.style.height = '150px';
                                            img.style.border = '1px solid gray';
                                            img.setAttribute('xcx', 'xcx443321-8-1-new-3-8');
                                            img.setAttribute('bwsrc', fileUrl_Thumbnail);
                                            img.src = '/images/mp3.png';

                                            li.append(img);

                                        } else if (fileExtension == 'm4a') {

                                            var img = document.createElement('img');
                                            img.style.height = '150px';
                                            img.style.border = '1px solid gray';
                                            img.setAttribute('xcx', 'xcx443321-8-1-new-3-8-2');
                                            img.setAttribute('bwsrc', fileUrl_Thumbnail);
                                            img.src = '/images/m4a.png';

                                            li.append(img);

                                        } else if (fileExtension == 'zip') {

                                            var img = document.createElement('img');
                                            img.style.height = '150px';
                                            img.style.border = '1px solid gray';
                                            img.setAttribute('xcx', 'xcx443321-8-1-new-3-9');
                                            img.setAttribute('bwsrc', fileUrl_Thumbnail);
                                            img.src = '/images/zip.png';

                                            li.append(img);

                                        } else {

                                            if (results.data[i].Thumbnail != true) { // Display thumbnails with a rounded corner. 

                                                //
                                                //
                                                // THIS IS WHERE WE ARE TRYING TO IMPLEMENT IMG thumbnails which we can pause/stop the loading of, in order to improve responsiveness.
                                                //
                                                //

                                                console.log('THIS IS WHERE WE ARE TRYING TO IMPLEMENT IMG thumbnails which we can pause/stop the loading of, in order to improve responsiveness. xcx1-1.');


                                                // TEMPORARILY COMMENTED OUT 9-23-2023.
                                                //var img = document.createElement('img');
                                                //img.style.height = '150px';
                                                //img.style.border = '1px solid gray';
                                                //img.setAttribute('xcx', 'xcx443321-8-1-new-3');
                                                //if (!forceRenderTheImageThumbnail) {
                                                //    img.setAttribute('bwsrc', fileUrl_Thumbnail);
                                                //    img.src = '/images/noimageavailable.png';
                                                //} else {
                                                //    img.src = fileUrl_Thumbnail;
                                                //}

                                                //li.append(img);

                                                console.log('This displays the file. WE DO NOT WANT TO DO THAT because they are so large. Display /images/nothumbnailavailable.png instead. 9-23-2023.');




                                                var img = document.createElement('img');
                                                img.style.height = '150px';
                                                img.style.border = '1px solid gray';
                                                img.setAttribute('xcx', 'xcx443321-8-1-new-3-11');
                                                //if (!forceRenderTheImageThumbnail) {
                                                img.setAttribute('bwsrc', fileUrl_Thumbnail);


                                                // 12-14-2023. ALSO search for "xcx443321-8-1-new-3-4", "xcx443321-8-1-new-3-11", "xcx443321-8-1-new-3-12"
                                                if (thumbnailLoadingEnabled) {
                                                    img.src = fileUrl_Thumbnail;
                                                } else {
                                                    img.src = '/images/imagenotloaded.png';
                                                }



                                                //img.src = '/images/imagenotloaded.png';
                                                //} else {
                                                //    img.src = fileUrl_Thumbnail;
                                                //}

                                                li.append(img);



                                            } else {


                                                //
                                                //
                                                // THIS IS WHERE WE ARE TRYING TO IMPLEMENT IMG thumbnails which we can pause/stop the loading of, in order to improve responsiveness.
                                                //
                                                //

                                                console.log('THIS IS WHERE WE ARE TRYING TO IMPLEMENT IMG thumbnails which we can pause/stop the loading of, in order to improve responsiveness. xcx1-2.');

                                                var img = document.createElement('img');
                                                img.style.height = '150px';
                                                img.style.border = '1px solid gray';
                                                img.style.maxWidth = '500px';
                                                img.style.borderRadius = '0 30px 0 0';
                                                img.setAttribute('xcx', 'xcx443321-8-1-new-3-12');
                                                if (!forceRenderTheImageThumbnail) {
                                                    img.setAttribute('bwsrc', fileUrl_Thumbnail);


                                                    // 12-14-2023. ALSO search for "xcx443321-8-1-new-3-4", "xcx443321-8-1-new-3-11", "xcx443321-8-1-new-3-12"
                                                    if (thumbnailLoadingEnabled) {
                                                        img.src = fileUrl_Thumbnail;
                                                    } else {
                                                        img.src = '/images/imagenotloaded.png';
                                                    }

                                                } else {
                                                    img.src = fileUrl_Thumbnail;
                                                }

                                                li.append(img);

                                                var developerModeEnabled = $('.bwAuthentication').bwAuthentication('option', 'developerModeEnabled');

                                                if (developerModeEnabled == true) {
                                                    //html += '   onmouseenter="$(\'.bwCoreComponent:first\').bwCoreComponent(\'showThumbnailHoverDetails\', \'' + bwEncodeURIComponent(JSON.stringify(results.data[i])) + '\', \'' + bwBudgetRequestId + '\', this);this.style.backgroundColor=\'lightgoldenrodyellow\';" ';
                                                    //html += '   onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');"'; //this.style.backgroundColor=\'white\';"';

                                                    img.setAttribute("onmouseenter", "$(\'.bwCoreComponent:first\').bwCoreComponent(\'showThumbnailHoverDetails\', \'' + bwEncodeURIComponent(JSON.stringify(results.data[i])) + '\', \'' + bwBudgetRequestId + '\', this);this.style.backgroundColor=\'lightgoldenrodyellow\';");
                                                    img.setAttribute("onmouseleave", "$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');");

                                                }

                                            }

                                        }

                                        ul.appendChild(li);

                                    }

                                    console.log('ADDING IMAGE ELEMENT xcx231234423.');
                                    //alert('ADDING IMAGE ELEMENT xcx231234423.');
                                    var executiveSummaryAttachmentsElement = $(executiveSummaryElement).find('.executiveSummaryAttachments')[0];
                                    $(executiveSummaryAttachmentsElement).append(div);

                                }

                                var result = {
                                    status: 'SUCCESS',
                                    message: 'SUCCESS',
                                    executiveSummaryElement: executiveSummaryElement,
                                    bwBudgetRequest: bwBudgetRequest
                                }
                                resolve(result);

                            } catch (e) {

                                var msg = 'Exception in bwCommonScripts.js.xx(): ' + e.message + ', ' + e.stack;
                                console.log(msg);
                                displayAlertDialog(msg);
                                var result = {
                                    status: 'EXCEPTION',
                                    message: msg
                                }
                                reject(result);


                                if (e.number) {
                                    displayAlertDialog('Error in renderAttachments_ForExecutiveSummary():1-1: ' + e.number + ', "' + e.message + '", ' + e.stack);
                                } else {
                                    // This most likely means that the folders are there on the file services server, but there is nothing in them.
                                    //
                                    // Fileservices has an error, so show nothing! We will put a red exclamation pin in the attachments section eventually! - 10-1-17 todd
                                    displayAlertDialog('Fileservices has an error: ' + ' "' + e.message + '". ' + e.stack);
                                }
                            }
                        },
                        error: function (data, errorCode, errorMessage) {

                            var msg = 'Error in bwCommonScripts.js.renderAttachments_ForExecutiveSummary.getlistofattachmentsforbudgetrequest(): ' + errorCode + ', ' + errorMessage + ', data: ' + JSON.stringify(data);
                            console.log(msg);
                            displayAlertDialog(msg);

                        }
                    });

                }

            } catch (e) {

                var msg = 'Exception in bwCommonScripts.js.renderAttachments_ForExecutiveSummary(): ' + e.message + ', ' + e.stack;
                console.log(msg);
                displayAlertDialog(msg);
                var result = {
                    status: 'EXCEPTION',
                    message: msg
                }
                reject(result);

            }
        });
    }




    exports.generateEmptyHomePageNotificationScreenHtml5 = function (documentCounts, serverside) {
        try {
            console.log('In bwCommonScripts.js.generateEmptyHomePageNotificationScreenHtml5().');
            //alert('In bwCommonScripts.js.generateEmptyHomePageNotificationScreenHtml5().');


            // ['PINNED_REQUESTS', 'MY_UNSUBMITTED_REQUESTS', 'MY_SUBMITTED_REQUESTS', 'ACTIVE_REQUESTS', 'MY_PENDING_TASKS']
            //var result = {
            //    status: 'SUCCESS',
            //    message: msg,

            //    MY_UNSUBMITTED_REQUESTS: brcResult_MY_UNSUBMITTED_REQUESTS, // Figure this out on the client side. These are one with matching CreatedById: bwParticipantId.
            //    MY_SUBMITTED_REQUESTS: brcResult_MY_SUBMITTED_REQUESTS, // Figure this out on the client side. These are one with matching CreatedById: bwParticipantId.
            //    ACTIVE_REQUESTS: brcResult_ACTIVE_REQUESTS,
            //    MY_PENDING_TASKS: wtcResult_MY_PENDING_TASKS, // These are tasks with bwPercentComplete: 0, bwAssignedToId: bwParticipantId.
            //}

            var deferredIndex = 0;
            var bwWorkflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            // Change the page title to indicate the # of tasks. This will show up in the browser tab and is a cool way to show the user they have alerts.
            if (documentCounts.MY_PENDING_TASKS > 0) {

                document.title = 'You have ' + documentCounts.MY_PENDING_TASKS + ' pending tasks...';

                // Change the css to red/orange.
                //swapStyleSheet("css/bw.core.colors.red.orange.css");
                // Change the currency indicator to the one with the red dot. This obviously depends upon consistent naming!
                //renderFavicon(true);
            } else {
                document.title = 'No pending tasks'; // 4-18-2022 changed from 'No budget items'; //'My Budgetsxcx2';
                // Change the css to blue/blue.
                //swapStyleSheet("css/bw.core.colors.blue.blue.css");
                // Change the currency indicator to the one without the red dot. This obviously depends upon consistent naming!
                //renderFavicon(false);
            }
            //} catch (e) { }

            var html = '';

            html += '<style>';
            html += '.bwExecutiveSummariesCarousel2_SelectorButton {';
            //html += '   border:2px solid gray;';
            //html += '   padding:3px 3px 3px 3px;';
            //html += '   border-radius:20px 20px 20px 20px;';
            //html += '   width:25px;height:25px;';
            //html += '   display:inline-block;';
            html += '   cursor:pointer;';
            html += '}';
            html += '.bwExecutiveSummariesCarousel2_SelectorButton:hover {';
            html += '   border:2px solid red;';
            html += '}';
            html += '</style>';
            //
            // Display the pending tasks.
            //
            if (documentCounts.MY_PENDING_TASKS == 0) {
                html += 'You have no pending tasks, and there are no pending requests that you are involved with.';
            }

            if (serverside && serverside == true) {
                html += '<table id="tblHomePageAlertSectionForWorkflow' + deferredIndex.toString() + '" style="cursor:default;opacity:0.5;" >'; // Makes the email/serverside rendering have an opacity setting.
            } else {
                html += '<table id="tblHomePageAlertSectionForWorkflow' + deferredIndex.toString() + '" style="cursor:default;" >';
            }

            // ['PINNED_REQUESTS', 'MY_UNSUBMITTED_REQUESTS', 'MY_SUBMITTED_REQUESTS', 'ACTIVE_REQUESTS', 'MY_PENDING_TASKS']







            //
            // Pinned requests.
            //

            var quantityOfPinnedRequests = 0;
            var pinnedRequestsArray = $('.bwAuthentication:first').bwAuthentication('option', 'UserData_PinnedRequestsArray');
            if (pinnedRequestsArray && pinnedRequestsArray.length) {
                quantityOfPinnedRequests = pinnedRequestsArray.length;
            }

            console.log('In bwCommonScripts.js.generateEmptyHomePageNotificationScreenHtml5(). Displaying quantityOfPinnedRequests: ' + quantityOfPinnedRequests);

            //if (pinnedRequestsArray && pinnedRequestsArray.length) {
            //    if (brData && brData.PendingBudgetRequests && brData.PendingBudgetRequests.length) {
            //        for (var i = 0; i < brData.PendingBudgetRequests.length; i++) {
            //            if (pinnedRequestsArray.indexOf(brData.PendingBudgetRequests[i].bwBudgetRequestId) > -1) {
            //                quantityOfPinnedRequests += 1;
            //            }
            //        }
            //    }
            //}

            if (quantityOfPinnedRequests > 0) {
                var rowId = 'functionalAreaRow_' + deferredIndex.toString() + '_6';
                var imageId = 'alertSectionImage_' + deferredIndex.toString() + '_6';
                var collapsibleRowId = 'alertSectionRow_' + deferredIndex.toString() + '_6';

                html += '<tr id="' + rowId + '" class="bwFunctionalAreaRow bwNoUserSelect" >';
                if (quantityOfPinnedRequests > 0) {
                    if (quantityOfPinnedRequests == 1) {
                        html += '<td style="width:11px;vertical-align:top;" class="bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\', \'PINNED_REQUESTS\');" ></td>';
                        html += '<td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\', \'PINNED_REQUESTS\');" >';
                        html += '   <img title="expand" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="' + imageRootPath + '/images/drawer-open.png">';
                    } else {
                        html += '<td style="width:11px;vertical-align:top;" class="bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" ></td>';
                        html += '<td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\', \'PINNED_REQUESTS\');" >';
                        html += '   <img title="expand" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;float:none;" src="' + imageRootPath + '/images/drawer-open.png">';
                    }
                } else {
                    html += '   <td style="width:11px;" class="bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" ></td>';
                    html += '   <td style="padding-left:60px;height:45px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\', \'PINNED_REQUESTS\');"  >';
                }
                html += '           <span class="bwNoUserSelect bwAccordionDrawerTitle"  >';
                //if (brData.PendingBudgetRequests.length == 1) {
                //    html += 'There is ' + brData.PendingBudgetRequests.length + ' active request.';
                //} else {
                //    html += 'There are ' + brData.PendingBudgetRequests.length + ' active requests.';
                //}
                //html += 'Pinned (' + brData.PendingBudgetRequests.length + ')&nbsp;&nbsp;<span style="color:tomato;font-size:8pt;font-weight:bold;">*Coming soon!</span>';
                html += 'Pinned (' + quantityOfPinnedRequests + ')'; //&nbsp;&nbsp;<span style="color:tomato;font-size:8pt;font-weight:bold;">*Coming soon!</span>';
                html += '           </span>';

                html += '       </td>';





                //html += '       <td style="width:2%;" class="bwHPNDrillDownLinkCell2">';

                ////
                //// New "Sort by" button. 9-16-2023.
                ////
                ////html += `<span id="spanArchiveAdditionalOptionsEllipsis" style="font-size:18pt;" class="bwEllipsis context-menu-one btn btn-neutral" title="Sort by...">...</span>`;
                //html += `<span xcx="xcx21342356-1" style="font-size:15pt;white-space:nowrap;" class="bwEllipsis context_menu_bwExecutiveSummariesCarousel2_PINNED_REQUESTS btn btn-neutral" title="Sort by..."></span>`; // Sort by: Newest ↑ // Oldest ↑  ↓

                //html += '</td>';





                html += '   </tr>';

                html += '   <tr id="' + collapsibleRowId + '" style="display:none;">';
                html += '       <td style="vertical-align:top;">';
                html += '       </td>';
                html += '       <td colspan="2">';

                html += '           <table>';
                html += '               <tr>';

                html += '                   <td style="vertical-align:top;width:60px;">';



                html += '                       <table id="buttonDisplayRequestsAsDetailedList_PinnedRequests" class="divCarouselButton" style="width:70px;padding: 4px 4px 4px 4px !important;" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_PinnedRequests\');">';
                html += '                           <tr>';
                html += '                               <td style="white-space:nowrap;">';
                html += '                                   <div style="width: 100%; overflow: hidden;vertical-align:middle;">';
                html += '                                       <div class="divCarouselButton_SmallButton2" style="float:left;vertical-align:middle;"></div><div style="float:right;vertical-align:middle;margin:-4px;color:gray;">-----</div>';
                html += '                                   </div>';
                html += '                               </td>';
                html += '                           </tr>';
                html += '                           <tr>';
                html += '                               <td style="white-space:nowrap;">';
                html += '                                   <div style="width: 100%; overflow: hidden;vertical-align:middle;">';
                html += '                                       <div class="divCarouselButton_SmallButton2" style="float:left;vertical-align:middle;"></div><div style="float:right;vertical-align:middle;margin:-4px;color:gray;">-----</div>';
                html += '                                   </div>';
                html += '                               </td>';
                html += '                           </tr>';
                html += '                           <tr>';
                html += '                               <td style="white-space:nowrap;">';
                html += '                                   <div style="width: 100%; overflow: hidden;vertical-align:middle;">';
                html += '                                       <div class="divCarouselButton_SmallButton2" style="float:left;vertical-align:middle;"></div><div style="float:right;vertical-align:middle;margin:-4px;color:gray;">-----</div>';
                html += '                                   </div>';
                html += '                               </td>';
                html += '                           </tr>';
                html += '                       </table>';
                html += '                       <div style="height:5px;"></div>'; // Button spacer. <br /> is too much.
                html += '                       <table id="buttonDisplayRequestsAsTiles_PinnedRequests" class="divCarouselButton_Selected" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderExecutiveSummaries_PINNED_REQUESTS\');">';
                html += '                           <tr>';
                html += '                               <td>';
                html += '                                   <div class="divCarouselButton_SmallButton"></div>';
                html += '                               </td>';
                html += '                               <td>';
                html += '                                   <div class="divCarouselButton_SmallButton"></div>';
                html += '                               </td>';
                html += '                               <td>';
                html += '                                   <div class="divCarouselButton_SmallButton"></div>';
                html += '                               </td>';
                html += '                           </tr>';
                html += '                           <tr>';
                html += '                               <td>';
                html += '                                   <div class="divCarouselButton_SmallButton"></div>';
                html += '                               </td>';
                html += '                               <td>';
                html += '                                   <div class="divCarouselButton_SmallButton"></div>';
                html += '                               </td>';
                html += '                               <td>';
                html += '                                   <div class="divCarouselButton_SmallButton"></div>';
                html += '                               </td>';
                html += '                           </tr>';
                html += '                       </table>';
                html += '                   </td>';
                html += '                   <td style="vertical-align:top;">';

                //html += '       <div id="divBwExecutiveSummariesCarousel_AllActiveRequests" class="bwAccordionDrawer" bwaccordiondrawertype="ACTIVE_REQUESTS" ></div>'; // Display as the executive summary carousel.
                html += '       <div id="divBwExecutiveSummariesCarousel_PinnedRequests" class="bwAccordionDrawer" bwaccordiondrawertype="PINNED_REQUESTS" >';
                html += '           &nbsp;&nbsp;<img style="width:100px;height:100px;vertical-align:middle;white-space:nowrap;padding-top:15px;" src="/images/ajax-loader.gif" />&nbsp;&nbsp;<span id="divActivitySpinner_WorkingOnItDialog_spinnerText" style="font-size:25pt;white-space:nowrap;vertical-align:middle;">Loading...</span>';
                html += '       </div>'; // Display as the executive summary carousel.

                html += '       </td>';
                html += '   </tr>';
                html += '</table>';
                html += '   </td>';
                html += '</tr>';
                //
                // end: Pinned requests.
                //
            }












































            if (documentCounts.MY_UNSUBMITTED_REQUESTS > 0) {


                //
                // New row, "My Un-submitted Requests" summary.
                //
                // First we have to see if we have any items to display here.
                //if (brData.PendingBudgetRequests && brData.PendingBudgetRequests.length) {
                //    var myUnsubmittedRequests = [];
                //    for (var i = 0; i < brData.PendingBudgetRequests.length; i++) {
                //        if (brData.PendingBudgetRequests[i].BudgetWorkflowStatus == 'NOT_SUBMITTED') {
                //            // This is one! Add it to the array.
                //            myUnsubmittedRequests.push(brData.PendingBudgetRequests[i]);
                //        }
                //    }

                // Changed 8-25-2022

                //alert('xcx232341 myBrData: ' + JSON.stringify(myBrData));


                //exports.myUnsubmittedRequests = myUnsubmittedRequests; // Loading it here. It just seems convenient....
                //if (myUnsubmittedRequests.length > 0) {
                // We have unsubmitted requests to display.
                var rowId = 'functionalAreaRow_' + deferredIndex.toString() + '_5';
                var imageId = 'alertSectionImage_' + deferredIndex.toString() + '_5';
                var collapsibleRowId = 'alertSectionRow_' + deferredIndex.toString() + '_5';
                //debugger;
                html += '   <tr id="' + rowId + '" class="bwFunctionalAreaRow bwNoUserSelect" >';
                if (documentCounts.MY_UNSUBMITTED_REQUESTS > 0) {
                    if (documentCounts.MY_UNSUBMITTED_REQUESTS == 1) {
                        html += '<td style="width:11px;vertical-align:top;" class="bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\', \'MY_UNSUBMITTED_REQUESTS\');" ></td>';
                        html += '<td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\', \'MY_UNSUBMITTED_REQUESTS\');" >';
                        html += '   <img title="expand" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="' + imageRootPath + '/images/drawer-open.png">';
                    } else {
                        html += '<td style="width:11px;vertical-align:top;" class="bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\', \'MY_UNSUBMITTED_REQUESTS\');" ></td>';
                        html += '<td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\', \'MY_UNSUBMITTED_REQUESTS\');" >';
                        html += '   <img title="expand" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;float:none;" src="' + imageRootPath + '/images/drawer-open.png">';
                    }
                } else {
                    html += '   <td style="width:11px;" class="bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\', \'MY_UNSUBMITTED_REQUESTS\');" ></td>';
                    html += '   <td style="padding-left:60px;height:45px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\', \'MY_UNSUBMITTED_REQUESTS\');"  >';
                }
                html += '           <span class="bwNoUserSelect bwAccordionDrawerTitle"  >';
                if (documentCounts.MY_UNSUBMITTED_REQUESTS == 1) {
                    html += 'You have ' + documentCounts.MY_UNSUBMITTED_REQUESTS + ' saved (un-submitted) request.';
                } else {
                    html += 'You have ' + documentCounts.MY_UNSUBMITTED_REQUESTS + ' saved (un-submitted) requests.';
                }
                html += '           </span>';

                html += '       </td>';




                //html += '       <td style="width:2%;" class="bwHPNDrillDownLinkCell2">';

                ////
                //// New "Sort by" button. 9-25-2023.
                ////
                ////html += `<span id="spanArchiveAdditionalOptionsEllipsis" style="font-size:18pt;" class="bwEllipsis context-menu-one btn btn-neutral" title="Sort by...">...</span>`;
                //html += `<span xcx="xcx21342356-2" style="font-size:15pt;white-space:nowrap;" class="bwEllipsis context_menu_bwExecutiveSummariesCarousel2_MY_UNSUBMITTED_REQUESTS btn btn-neutral" title="Sort by..."></span>`; // Sort by: Newest ↑ // Oldest ↑  ↓

                //html += '       </td>';


                html += '   </tr>';

                html += '   <tr id="' + collapsibleRowId + '" style="display:none;">';
                html += '       <td style="vertical-align:top;">';
                html += '       </td>';
                html += '       <td colspan="2">';

                html += '           <table>';
                html += '               <tr>';

                html += '                   <td style="vertical-align:top;width:60px;">';



                html += '                       <table id="buttonDisplayRequestsAsDetailedList_MyUnsubmittedRequests" class="divCarouselButton" style="width:70px;padding: 4px 4px 4px 4px !important;" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_MyUnsubmittedRequests\');">';
                html += '                           <tr>';
                html += '                               <td style="white-space:nowrap;">';
                html += '                                   <div style="width: 100%; overflow: hidden;vertical-align:middle;">';
                html += '                                       <div class="divCarouselButton_SmallButton2" style="float:left;vertical-align:middle;"></div><div style="float:right;vertical-align:middle;margin:-4px;color:gray;">-----</div>';
                html += '                                   </div>';
                html += '                               </td>';
                html += '                           </tr>';
                html += '                           <tr>';
                html += '                               <td style="white-space:nowrap;">';
                html += '                                   <div style="width: 100%; overflow: hidden;vertical-align:middle;">';
                html += '                                       <div class="divCarouselButton_SmallButton2" style="float:left;vertical-align:middle;"></div><div style="float:right;vertical-align:middle;margin:-4px;color:gray;">-----</div>';
                html += '                                   </div>';
                html += '                               </td>';
                html += '                           </tr>';
                html += '                           <tr>';
                html += '                               <td style="white-space:nowrap;">';
                html += '                                   <div style="width: 100%; overflow: hidden;vertical-align:middle;">';
                html += '                                       <div class="divCarouselButton_SmallButton2" style="float:left;vertical-align:middle;"></div><div style="float:right;vertical-align:middle;margin:-4px;color:gray;">-----</div>';
                html += '                                   </div>';
                html += '                               </td>';
                html += '                           </tr>';
                html += '                       </table>';
                html += '                       <div style="height:5px;"></div>'; // Button spacer. <br /> is too much.
                html += '                       <table id="buttonDisplayRequestsAsTiles_MyUnsubmittedRequests" class="divCarouselButton_Selected" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderExecutiveSummaries_MyUnsubmittedRequests\');">';
                html += '                           <tr>';
                html += '                               <td>';
                html += '                                   <div class="divCarouselButton_SmallButton"></div>';
                html += '                               </td>';
                html += '                               <td>';
                html += '                                   <div class="divCarouselButton_SmallButton"></div>';
                html += '                               </td>';
                html += '                               <td>';
                html += '                                   <div class="divCarouselButton_SmallButton"></div>';
                html += '                               </td>';
                html += '                           </tr>';
                html += '                           <tr>';
                html += '                               <td>';
                html += '                                   <div class="divCarouselButton_SmallButton"></div>';
                html += '                               </td>';
                html += '                               <td>';
                html += '                                   <div class="divCarouselButton_SmallButton"></div>';
                html += '                               </td>';
                html += '                               <td>';
                html += '                                   <div class="divCarouselButton_SmallButton"></div>';
                html += '                               </td>';
                html += '                           </tr>';
                html += '                       </table>';
                html += '                   </td>';
                html += '                   <td style="vertical-align:top;">';

                html += '                       <div id="divBwExecutiveSummariesCarousel_MyUnsubmittedRequests" class="bwAccordionDrawer" bwaccordiondrawertype="MY_UNSUBMITTED_REQUESTS" >';
                html += '                           &nbsp;&nbsp;<img style="width:100px;height:100px;vertical-align:middle;white-space:nowrap;padding-top:15px;" src="/images/ajax-loader.gif" />&nbsp;&nbsp;<span id="divActivitySpinner_WorkingOnItDialog_spinnerText" style="font-size:25pt;white-space:nowrap;vertical-align:middle;">Loading...</span>';
                html += '                       </div>'; // Display as the executive summary carousel.

                html += '                   </td>';
                html += '               </tr>';
                html += '           </table>';
                html += '       </td>';
                html += '   </tr>';

                //}


                //
                // end: xx row, "My unsubmitted requests" summary.
                //

            }










            if (documentCounts.MY_SUBMITTED_REQUESTS > 0) {

                //
                // Fourth section, "My Submitted Requests" summary.
                //
                var rowId = 'functionalAreaRow_' + deferredIndex.toString() + '_4';
                var imageId = 'alertSectionImage_' + deferredIndex.toString() + '_4';
                var collapsibleRowId = 'alertSectionRow_' + deferredIndex.toString() + '_4';

                html += '<tr id="' + rowId + '" class="bwFunctionalAreaRow bwNoUserSelect" >';
                //if (brData && brData.PendingBudgetRequests && brData.PendingBudgetRequests.length) {
                if (documentCounts.MY_SUBMITTED_REQUESTS > 0) {
                    if (documentCounts.MY_SUBMITTED_REQUESTS == 1) {
                        html += '<td style="width:11px;vertical-align:top;" class="bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\', \'MY_SUBMITTED_REQUESTS\');" ></td>';
                        html += '<td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\', \'MY_SUBMITTED_REQUESTS\');" >';
                        html += '   <img title="expand" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="' + imageRootPath + '/images/drawer-open.png">';
                    } else {
                        html += '<td style="width:11px;vertical-align:top;" class="bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\', \'MY_SUBMITTED_REQUESTS\');" ></td>';
                        html += '<td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\', \'MY_SUBMITTED_REQUESTS\');" >';
                        html += '   <img title="expand" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;float:none;" src="' + imageRootPath + '/images/drawer-open.png">';
                    }
                } else {
                    html += '   <td style="width:11px;" class="bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\', \'MY_SUBMITTED_REQUESTS\');" ></td>';
                    html += '   <td style="padding-left:60px;height:45px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\', \'MY_SUBMITTED_REQUESTS\');"  >';
                }
                //} else {
                //    html += '   <td style="width:11px;" class="bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" ></td>';
                //    html += '   <td style="padding-left:60px;height:45px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');"  >';
                //}
                html += '           <span class="bwNoUserSelect bwAccordionDrawerTitle"  >';
                //if (brData.PendingBudgetRequests.length == 1) {
                //    html += 'There are ' + brData.PendingBudgetRequests.length + ' active request.';
                //} else {
                //    html += 'There are ' + brData.PendingBudgetRequests.length + ' active requests.';
                //}



                // Changed 8-25-2022
                //var mySubmittedCount = 0;
                //if (myBrData && myBrData.MyRequests && myBrData.MyRequests.length) {
                //    for (var i = 0; i < myBrData.MyRequests.length; i++) {
                //        if (myBrData.MyRequests[i].BudgetWorkflowStatus != 'NOT_SUBMITTED') {
                //            mySubmittedCount += 1;
                //        }
                //    }
                //}
                if (documentCounts.MY_SUBMITTED_REQUESTS == 1) {
                    html += 'You have submitted ' + documentCounts.MY_SUBMITTED_REQUESTS + ' request.';
                } else {
                    html += 'You have submitted ' + documentCounts.MY_SUBMITTED_REQUESTS + ' requests.';
                }

                //if (myBrData && myBrData.MyRequests && myBrData.MyRequests.length && (myBrData.MyRequests.length == 1)) {
                //    html += 'You have submitted ' + myBrData.MyRequests.length + ' request.';
                //} else {
                //    html += 'You have submitted ' + myBrData.MyRequests.length + ' requests.';
                //}

                html += '           </span>';

                html += '       </td>';



                //html += '       <td style="width:2%;" class="bwHPNDrillDownLinkCell2">';

                ////
                //// New "Sort by" button. 9-25-2023.
                ////
                ////html += `<span id="spanArchiveAdditionalOptionsEllipsis" style="font-size:18pt;" class="bwEllipsis context-menu-one btn btn-neutral" title="Sort by...">...</span>`;
                //html += `<span xcx="xcx21342356-3" style="font-size:15pt;white-space:nowrap;" class="bwEllipsis context_menu_bwExecutiveSummariesCarousel2_MY_SUBMITTED_REQUESTS btn btn-neutral" title="Sort by..."></span>`; // Sort by: Newest ↑ // Oldest ↑  ↓



                //html += '       </td>';





                html += '   </tr>';

                html += '   <tr id="' + collapsibleRowId + '" style="display:none;">';
                html += '       <td style="vertical-align:top;">';
                html += '       </td>';
                html += '       <td colspan="2">';

                html += '           <table>';
                html += '               <tr>';

                html += '                   <td style="vertical-align:top;width:60px;">';



                html += '                       <table id="buttonDisplayRequestsAsDetailedList_MySubmittedRequests" class="divCarouselButton" style="width:70px;padding: 4px 4px 4px 4px !important;" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_MySubmittedRequests\');">'; //, \'MySubmittedRequests\', this);">';
                html += '                           <tr>';
                html += '                               <td style="white-space:nowrap;">';
                html += '                                   <div style="width: 100%; overflow: hidden;vertical-align:middle;">';
                html += '                                       <div class="divCarouselButton_SmallButton2" style="float:left;vertical-align:middle;"></div><div style="float:right;vertical-align:middle;margin:-4px;color:gray;">-----</div>';
                html += '                                   </div>';
                html += '                               </td>';
                html += '                           </tr>';
                html += '                           <tr>';
                html += '                               <td style="white-space:nowrap;">';
                html += '                                   <div style="width: 100%; overflow: hidden;vertical-align:middle;">';
                html += '                                       <div class="divCarouselButton_SmallButton2" style="float:left;vertical-align:middle;"></div><div style="float:right;vertical-align:middle;margin:-4px;color:gray;">-----</div>';
                html += '                                   </div>';
                html += '                               </td>';
                html += '                           </tr>';
                html += '                           <tr>';
                html += '                               <td style="white-space:nowrap;">';
                html += '                                   <div style="width: 100%; overflow: hidden;vertical-align:middle;">';
                html += '                                       <div class="divCarouselButton_SmallButton2" style="float:left;vertical-align:middle;"></div><div style="float:right;vertical-align:middle;margin:-4px;color:gray;">-----</div>';
                html += '                                   </div>';
                html += '                               </td>';
                html += '                           </tr>';
                html += '                       </table>';
                html += '                       <div style="height:5px;"></div>'; // Button spacer. <br /> is too much.
                html += '                       <table id="buttonDisplayRequestsAsTiles_MySubmittedRequests" class="divCarouselButton_Selected" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderExecutiveSummaries_MySubmittedRequests\');">'; //, \'MySubmittedRequests\', this);">';
                html += '                           <tr>';
                html += '                               <td>';
                html += '                                   <div class="divCarouselButton_SmallButton"></div>';
                html += '                               </td>';
                html += '                               <td>';
                html += '                                   <div class="divCarouselButton_SmallButton"></div>';
                html += '                               </td>';
                html += '                               <td>';
                html += '                                   <div class="divCarouselButton_SmallButton"></div>';
                html += '                               </td>';
                html += '                           </tr>';
                html += '                           <tr>';
                html += '                               <td>';
                html += '                                   <div class="divCarouselButton_SmallButton"></div>';
                html += '                               </td>';
                html += '                               <td>';
                html += '                                   <div class="divCarouselButton_SmallButton"></div>';
                html += '                               </td>';
                html += '                               <td>';
                html += '                                   <div class="divCarouselButton_SmallButton"></div>';
                html += '                               </td>';
                html += '                           </tr>';
                html += '                       </table>';
                html += '                   </td>';
                html += '                   <td style="vertical-align:top;">';

                html += '       <div id="divBwExecutiveSummariesCarousel_MySubmittedRequests" class="bwAccordionDrawer" bwaccordiondrawertype="MY_SUBMITTED_REQUESTS" >';
                html += '           &nbsp;&nbsp;<img style="width:100px;height:100px;vertical-align:middle;white-space:nowrap;padding-top:15px;" src="/images/ajax-loader.gif" />&nbsp;&nbsp;<span id="divActivitySpinner_WorkingOnItDialog_spinnerText" style="font-size:25pt;white-space:nowrap;vertical-align:middle;">Loading...</span>';
                html += '       </div>'; // Display as the executive summary carousel.

                html += '       </td>';
                html += '   </tr>';
                html += '</table>';
                html += '   </td>';
                html += '</tr>';

                //
                // end: Fourth section, "My Requests" summary.
                //

            }
































































            ////
            //// Third row, "Unclaimed Invitations" summary.
            ////
            //if (invitationData && invitationData.length && (invitationData.length != 0)) { // Only display this section if there is more than 0 invitations. If there are none, don't even bother displaying.
            //    var rowId = 'functionalAreaRow_' + deferredIndex.toString() + '_3';
            //    var imageId = 'alertSectionImage_' + deferredIndex.toString() + '_3';
            //    var collapsibleRowId = 'alertSectionRow_' + deferredIndex.toString() + '_3';
            //    html += '<tr id="' + rowId + '" class="bwFunctionalAreaRow" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" >';
            //    if (invitationData.length > 0) {
            //        if (invitationData.length == 1) {
            //            html += '<td style="width:11px;vertical-align:top;"></td>';
            //            html += '<td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2">';
            //            html += '<img title="expand" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="' + imageRootPath + '/images/drawer-open.png">';
            //        } else {
            //            html += '<td style="width:11px;vertical-align:top;"></td><td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2">';
            //            html += '<img title="expand" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="' + imageRootPath + '/images/drawer-open.png">';
            //        }
            //    } else {
            //        html += '<td style="width:11px;"></td>';
            //        html += '<td style="padding-left:60px;height:45px;" class="bwHPNDrillDownLinkCell2">';
            //    }
            //    html += '       <span>';
            //    if (invitationData.length == 1) {
            //        html += 'There is ' + invitationData.length + ' unclaimed invitation.';
            //    } else if (invitationData.length > 0) {
            //        html += 'There are ' + invitationData.length + ' unclaimed invitations.';
            //    } else {
            //        html += 'There are ' + invitationData.length + ' unclaimed invitations. Dont display this...';
            //    }
            //    html += '       </span>';
            //    html += '   </td>';

            //    html += '<td class="bwHPNDrillDownLinkCell2"></td>';


            //    html += '</tr>';
            //    // Third row, "Unclaimed Invitations" details.
            //    html += '<tr id="' + collapsibleRowId + '" style="display:none;">';
            //    html += '<td></td>';
            //    html += '<td colspan="2"><table><tbody>';
            //    for (var i = 0; i < invitationData.length; i++) {
            //        html += '   <tr>';
            //        html += '       <td style="width:10px;"></td>';
            //        html += '       <td style="width:10px;"></td>';
            //        html += '            <td style="width:90px;"></td>';
            //        html += '            <td>&nbsp;&nbsp;</td>';
            //        var invitationChar = (globalUrlPrefix + globalUrl + '?invitation=' + invitationData[i].bwInvitationId).indexOf('=') + 1; // notifications[ntypeindex][2][pi][0].indexOf('=') + 1;
            //        var invitationGuid = (globalUrlPrefix + globalUrl + '?invitation=' + invitationData[i].bwInvitationId).substring(invitationChar);
            //        html += '            <td colspan="5" class="tdHomePageSubNotificationIos8"><div id="tdUnclaimedInvitationLinkSwipeEnabled' + i + '"><a style="cursor:pointer;" onclick="cmdViewInvitation(\'' + invitationGuid + '\');" target="_blank" title="Send this link in an email to invite someone to participate in this workflow. You will be notified when they have confirmed their participation.">' + globalUrlPrefix + globalUrl + '?invitation=' + invitationData[i].bwInvitationId + '</a></div></td>';
            //        html += '        </tr>';
            //    }
            //    html += '</tbody></table></td>';
            //    html += '</tr>';
            //}
            ////
            //// end: Third row, "Unclaimed Invitations" summary.
            ////






            if (documentCounts.MY_PENDING_TASKS > 0) {

                //
                // Top row, "My Pending Tasks" summary.
                //
                var rowId = 'functionalAreaRow_' + deferredIndex.toString() + '_1';
                var imageId = 'alertSectionImage_' + deferredIndex.toString() + '_1';
                var collapsibleRowId = 'alertSectionRow_' + deferredIndex.toString() + '_1';

                html += '<tr id="' + rowId + '" class="bwFunctionalAreaRow bwNoUserSelect" >';
                //if (taskData && taskData.length) {
                if (documentCounts.MY_PENDING_TASKS > 0) {
                    if (documentCounts.MY_PENDING_TASKS == 1) {
                        //html += '<td style="width:11px;vertical-align:top;" class="bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" ><img src="' + imageRootPath + '/images/red-dot.png" width="11" height="11" alt="" style="cursor:pointer;vertical-align:top;float:right;" /></td>';
                        //html += '<td style="width:11px;vertical-align:top;" class="bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" ></td>';
                        html += '<td colspan="2" style="padding-left:11px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\', \'MY_PENDING_TASKS\');" >';
                        html += '   <img title="expand" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="' + imageRootPath + '/images/drawer-open.png">';
                    } else {
                        //html += '<td style="width:11px;vertical-align:top;" class="bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" ><img src="' + imageRootPath + '/images/red-dot.png" width="11" height="11" alt="" style="cursor:pointer;vertical-align:top;float:right;" /></td>';
                        //html += '<td style="width:11px;vertical-align:top;" class="bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" ></td>';
                        html += '<td colspan="2" style="padding-left:11px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\', \'MY_PENDING_TASKS\');" >';
                        html += '   <img title="expand" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;float:none;" src="' + imageRootPath + '/images/drawer-open.png">';
                    }
                } else {
                    //html += '   <td style="width:11px;" class="bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" ></td>';
                    html += '   <td colspan="2" style="padding-left:60px;height:45px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\', \'MY_PENDING_TASKS\');"  >';
                }
                //} else {

                //    html += '   <td colspan="2" style="padding-left:60px;height:45px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');"  >';


                //}
                html += '           <span class="bwNoUserSelect bwAccordionDrawerTitle"  >';
                //if (taskData && taskData.length) {
                if (documentCounts.MY_PENDING_TASKS == 1) {
                    html += 'You have ' + documentCounts.MY_PENDING_TASKS + ' pending task. <img src="' + imageRootPath + '/images/red-dot.png" width="11" height="11" alt="" style="cursor:pointer;vertical-align:top;float:left;" />';
                } else {
                    html += 'You have ' + documentCounts.MY_PENDING_TASKS + ' pending tasks. <img src="' + imageRootPath + '/images/red-dot.png" width="11" height="11" alt="" style="cursor:pointer;vertical-align:top;float:left;" />';
                }
                //} else {
                //    html += 'You have ' + '0' + ' pending tasks. <img src="' + imageRootPath + '/images/red-dot.png" width="11" height="11" alt="" style="cursor:pointer;vertical-align:top;float:left;" />';
                //}
                html += '           </span>';

                html += '       </td>';
                //html += '       <td style="width:2%;" class="bwHPNDrillDownLinkCell2">';

                ////
                //// New "Sort by" button. 9-25-2023.
                ////
                ////html += `<span id="spanArchiveAdditionalOptionsEllipsis" style="font-size:18pt;" class="bwEllipsis context-menu-one btn btn-neutral" title="Sort by...">...</span>`;
                //html += `<span xcx="xcx21342356-4" style="font-size:15pt;white-space:nowrap;" class="bwEllipsis context_menu_bwExecutiveSummariesCarousel2_MY_PENDING_TASKS btn btn-neutral" title="Sort by..."></span>`; // Sort by: Newest ↑ // Oldest ↑  ↓


                //html += '       </td>';
                html += '   </tr>';

                html += '   <tr id="' + collapsibleRowId + '" style="display:none;">';
                html += '       <td style="vertical-align:top;">';
                html += '       </td>';
                html += '       <td colspan="2">';

                html += '           <table>';
                html += '               <tr>';

                html += '                   <td style="vertical-align:top;width:60px;">';



                html += '                       <table id="buttonDisplayRequestsAsDetailedList_MyPendingTasks" class="divCarouselButton" style="width:70px;padding: 4px 4px 4px 4px !important;" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_MyPendingTasks\');">'; //, \'MyPendingTasks\', this);">';
                html += '                           <tr>';
                html += '                               <td style="white-space:nowrap;">';
                html += '                                   <div style="width: 100%; overflow: hidden;vertical-align:middle;">';
                html += '                                       <div class="divCarouselButton_SmallButton2" style="float:left;vertical-align:middle;"></div><div style="float:right;vertical-align:middle;margin:-4px;color:gray;">-----</div>';
                html += '                                   </div>';
                html += '                               </td>';
                html += '                           </tr>';
                html += '                           <tr>';
                html += '                               <td style="white-space:nowrap;">';
                html += '                                   <div style="width: 100%; overflow: hidden;vertical-align:middle;">';
                html += '                                       <div class="divCarouselButton_SmallButton2" style="float:left;vertical-align:middle;"></div><div style="float:right;vertical-align:middle;margin:-4px;color:gray;">-----</div>';
                html += '                                   </div>';
                html += '                               </td>';
                html += '                           </tr>';
                html += '                           <tr>';
                html += '                               <td style="white-space:nowrap;">';
                html += '                                   <div style="width: 100%; overflow: hidden;vertical-align:middle;">';
                html += '                                       <div class="divCarouselButton_SmallButton2" style="float:left;vertical-align:middle;"></div><div style="float:right;vertical-align:middle;margin:-4px;color:gray;">-----</div>';
                html += '                                   </div>';
                html += '                               </td>';
                html += '                           </tr>';
                html += '                       </table>';
                html += '                       <div style="height:5px;"></div>'; // Button spacer. <br /> is too much.
                html += '                       <table id="buttonDisplayRequestsAsTiles_MyPendingTasks" class="divCarouselButton_Selected" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderExecutiveSummaries_MyPendingTasks\');">'; //, \'MyPendingTasks\', this);">';
                html += '                           <tr>';
                html += '                               <td>';
                html += '                                   <div class="divCarouselButton_SmallButton"></div>';
                html += '                               </td>';
                html += '                               <td>';
                html += '                                   <div class="divCarouselButton_SmallButton"></div>';
                html += '                               </td>';
                html += '                               <td>';
                html += '                                   <div class="divCarouselButton_SmallButton"></div>';
                html += '                               </td>';
                html += '                           </tr>';
                html += '                           <tr>';
                html += '                               <td>';
                html += '                                   <div class="divCarouselButton_SmallButton"></div>';
                html += '                               </td>';
                html += '                               <td>';
                html += '                                   <div class="divCarouselButton_SmallButton"></div>';
                html += '                               </td>';
                html += '                               <td>';
                html += '                                   <div class="divCarouselButton_SmallButton"></div>';
                html += '                               </td>';
                html += '                           </tr>';
                html += '                       </table>';
                html += '                   </td>';



                html += '                   <td style="vertical-align:top;">';

                html += '                       <div id="divBwExecutiveSummariesCarousel_MyPendingTasks" class="bwAccordionDrawer" bwaccordiondrawertype="MY_PENDING_TASKS" >';
                html += '                           &nbsp;&nbsp;<img style="width:100px;height:100px;vertical-align:middle;white-space:nowrap;padding-top:15px;" src="/images/ajax-loader.gif" />&nbsp;&nbsp;<span id="divActivitySpinner_WorkingOnItDialog_spinnerText" style="font-size:25pt;white-space:nowrap;vertical-align:middle;">Loading...</span>';
                html += '                       </div>'; // Display as the executive summary carousel.

                html += '                   </td>';
                html += '               </tr>';
                html += '           </table>';
                html += '       </td>';
                html += '   </tr>';
                //
                // end: Top row, "My Tasks" details. // This one is the template for the rest of these sections. 4-6-2022.
                //

            }













            //
            // xx row, "All Active Requests" summary.
            //
            var rowId = 'functionalAreaRow_' + deferredIndex.toString() + '_2';
            var imageId = 'alertSectionImage_' + deferredIndex.toString() + '_2';
            var collapsibleRowId = 'alertSectionRow_' + deferredIndex.toString() + '_2';

            html += '<tr id="' + rowId + '" class="bwFunctionalAreaRow bwNoUserSelect" >';
            //if (brData && brData.PendingBudgetRequests && brData.PendingBudgetRequests.length) {
            if (documentCounts.ACTIVE_REQUESTS > 0) {
                if (documentCounts.ACTIVE_REQUESTS == 1) {
                    html += '<td style="width:11px;vertical-align:top;" class="bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\', \'ACTIVE_REQUESTS\');" ></td>';
                    html += '<td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\', \'ACTIVE_REQUESTS\');" >';
                    html += '   <img title="expand" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="' + imageRootPath + '/images/drawer-open.png">';
                } else {
                    html += '<td style="width:11px;vertical-align:top;" class="bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\', \'ACTIVE_REQUESTS\');" ></td>';
                    html += '<td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\', \'ACTIVE_REQUESTS\');" >';
                    html += '   <img title="expand" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;float:none;" src="' + imageRootPath + '/images/drawer-open.png">';
                }
            } else {
                html += '   <td style="width:11px;" class="bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\', \'ACTIVE_REQUESTS\');" ></td>';
                html += '   <td style="padding-left:60px;height:45px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\', \'ACTIVE_REQUESTS\');"  >';
            }
            //} else {
            //    html += '   <td style="width:11px;" class="bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" ></td>';
            //    html += '   <td style="padding-left:60px;height:45px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');"  >';
            //}
            html += '           <span class="bwNoUserSelect bwAccordionDrawerTitle"  >';

            if (documentCounts.ACTIVE_REQUESTS == 1) {
                html += 'You are involved in ?' + documentCounts.ACTIVE_REQUESTS + ' active request.';
            } else {
                html += 'You are involved in ?' + documentCounts.ACTIVE_REQUESTS + ' active requests.';
            }

            html += '           </span>';

            html += '       </td>';
            //html += '       <td style="width:2%;" class="bwHPNDrillDownLinkCell2">';

            ////
            //// New "Sort by" button. 9-25-2023.
            ////
            ////html += `<span id="spanArchiveAdditionalOptionsEllipsis" style="font-size:18pt;" class="bwEllipsis context-menu-one btn btn-neutral" title="Sort by...">...</span>`;
            //html += `<span xcx="xcx21342356-5" style="font-size:15pt;white-space:nowrap;" class="bwEllipsis context_menu_bwExecutiveSummariesCarousel2_ACTIVE_REQUESTS btn btn-neutral" title="Sort by..."></span>`; // Sort by: Newest ↑ // Oldest ↑  ↓


            //html += '       </td>';
            html += '   </tr>';

            html += '   <tr id="' + collapsibleRowId + '" style="display:none;">';
            html += '       <td style="vertical-align:top;">';
            html += '       </td>';
            html += '       <td colspan="2">';

            html += '           <table>';
            html += '               <tr>';

            html += '                   <td style="vertical-align:top;width:60px;">';



            html += '                       <table id="buttonDisplayRequestsAsDetailedList_AllActiveRequests" class="divCarouselButton" style="width:70px;padding: 4px 4px 4px 4px !important;" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_ACTIVE_REQUESTS\');">'; //, \'AllActiveRequests\', this);">';
            html += '                           <tr>';
            html += '                               <td style="white-space:nowrap;">';
            html += '                                   <div style="width: 100%; overflow: hidden;vertical-align:middle;">';
            html += '                                       <div class="divCarouselButton_SmallButton2" style="float:left;vertical-align:middle;"></div><div style="float:right;vertical-align:middle;margin:-4px;color:gray;">-----</div>';
            html += '                                   </div>';
            html += '                               </td>';
            html += '                           </tr>';
            html += '                           <tr>';
            html += '                               <td style="white-space:nowrap;">';
            html += '                                   <div style="width: 100%; overflow: hidden;vertical-align:middle;">';
            html += '                                       <div class="divCarouselButton_SmallButton2" style="float:left;vertical-align:middle;"></div><div style="float:right;vertical-align:middle;margin:-4px;color:gray;">-----</div>';
            html += '                                   </div>';
            html += '                               </td>';
            html += '                           </tr>';
            html += '                           <tr>';
            html += '                               <td style="white-space:nowrap;">';
            html += '                                   <div style="width: 100%; overflow: hidden;vertical-align:middle;">';
            html += '                                       <div class="divCarouselButton_SmallButton2" style="float:left;vertical-align:middle;"></div><div style="float:right;vertical-align:middle;margin:-4px;color:gray;">-----</div>';
            html += '                                   </div>';
            html += '                               </td>';
            html += '                           </tr>';
            html += '                       </table>';
            html += '                       <div style="height:5px;"></div>'; // Button spacer. <br /> is too much.
            html += '                       <table id="buttonDisplayRequestsAsTiles_AllActiveRequests" class="divCarouselButton_Selected" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderExecutiveSummaries_ACTIVE_REQUESTS\');">'; //, \'AllActiveRequests\', this);">';
            html += '                           <tr>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                           </tr>';
            html += '                           <tr>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                           </tr>';
            html += '                       </table>';
            html += '                   </td>';
            html += '                   <td style="vertical-align:top;">';

            html += '                       <div id="divBwExecutiveSummariesCarousel_AllActiveRequests" class="bwAccordionDrawer" bwaccordiondrawertype="ACTIVE_REQUESTS" >';
            html += '                           &nbsp;&nbsp;<img style="width:100px;height:100px;vertical-align:middle;white-space:nowrap;padding-top:15px;" src="/images/ajax-loader.gif" />&nbsp;&nbsp;<span id="divActivitySpinner_WorkingOnItDialog_spinnerText" style="font-size:25pt;white-space:nowrap;vertical-align:middle;">Loading...</span>';
            html += '                       </div>'; // Display as the executive summary carousel.






            html += '                   </td>';
            html += '               </tr>';
            html += '           </table>';






            html += '       </td>';





            html += '   </tr>';
            //
            // end: xx row, "Active Requests" summary.
            //













            //
            // xx row, "SOCIAL_NETWORK" summary.
            //
            var rowId = 'functionalAreaRow_' + deferredIndex.toString() + '_7';
            var imageId = 'alertSectionImage_' + deferredIndex.toString() + '_7';
            var collapsibleRowId = 'alertSectionRow_' + deferredIndex.toString() + '_7';

            html += '<tr id="' + rowId + '" class="bwFunctionalAreaRow bwNoUserSelect" >';
            //if (brData && brData.PendingBudgetRequests && brData.PendingBudgetRequests.length) {
            if (documentCounts.SOCIAL_NETWORK > 0) {
                if (documentCounts.SOCIAL_NETWORK == 1) {
                    html += '<td style="width:11px;vertical-align:top;" class="bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\', \'SOCIAL_NETWORK\');" ></td>';
                    html += '<td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\', \'SOCIAL_NETWORK\');" >';
                    html += '   <img title="expand" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="' + imageRootPath + '/images/drawer-open.png">';
                } else {
                    html += '<td style="width:11px;vertical-align:top;" class="bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\', \'SOCIAL_NETWORK\');" ></td>';
                    html += '<td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\', \'SOCIAL_NETWORK\');" >';
                    html += '   <img title="expand" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;float:none;" src="' + imageRootPath + '/images/drawer-open.png">';
                }
            } else {
                html += '   <td style="width:11px;" class="bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\', \'SOCIAL_NETWORK\');" ></td>';
                html += '   <td style="padding-left:60px;height:45px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\', \'SOCIAL_NETWORK\');"  >';
            }
            //} else {
            //    html += '   <td style="width:11px;" class="bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" ></td>';
            //    html += '   <td style="padding-left:60px;height:45px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');"  >';
            //}
            html += '           <span class="bwNoUserSelect bwAccordionDrawerTitle"  >';
            //if (brData && brData.PendingBudgetRequests && brData.PendingBudgetRequests.length) {
            if (documentCounts.SOCIAL_NETWORK == 1) {
                html += 'There is ' + documentCounts.SOCIAL_NETWORK + ' active request. <span style="color:red;font-weight:bold;">WELCOME TO THE SOCIAL NETWORK. THIS IS YOUR NEWS FEED. This is where your recent activity, and others, shows up right away.</span>';
            } else {
                html += 'There are ' + documentCounts.SOCIAL_NETWORK + ' active requests. <span style="color:red;font-weight:bold;">WELCOME TO THE SOCIAL NETWORK. THIS IS YOUR NEWS FEED. This is where your recent activity, and others, shows up right away.</span>';
            }
            //} else {
            //    html += 'There are ' + '0' + ' active requests.';
            //}
            html += '           </span>';

            html += '       </td>';
            //html += '       <td style="width:2%;" class="bwHPNDrillDownLinkCell2">';

            ////
            //// New "Sort by" button. 9-25-2023.
            ////
            ////html += `<span id="spanArchiveAdditionalOptionsEllipsis" style="font-size:18pt;" class="bwEllipsis context-menu-one btn btn-neutral" title="Sort by...">...</span>`;
            //html += `<span xcx="xcx21342356-6" style="font-size:15pt;white-space:nowrap;" class="bwEllipsis context_menu_bwExecutiveSummariesCarousel2_SOCIAL_NETWORK btn btn-neutral" title="Sort by..."></span>`; // Sort by: Newest ↑ // Oldest ↑  ↓


            //html += '       </td>';
            html += '   </tr>';

            html += '   <tr id="' + collapsibleRowId + '" style="display:none;">';
            html += '       <td style="vertical-align:top;">';
            html += '       </td>';
            html += '       <td colspan="2">';

            html += '           <table>';
            html += '               <tr>';

            html += '                   <td style="vertical-align:top;width:60px;">';



            html += '                       <table id="buttonDisplayRequestsAsDetailedList_AllActiveRequests" class="divCarouselButton" style="width:70px;padding: 4px 4px 4px 4px !important;" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_AllActiveRequests\');">'; //, \'AllActiveRequests\', this);">';
            html += '                           <tr>';
            html += '                               <td style="white-space:nowrap;">';
            html += '                                   <div style="width: 100%; overflow: hidden;vertical-align:middle;">';
            html += '                                       <div class="divCarouselButton_SmallButton2" style="float:left;vertical-align:middle;"></div><div style="float:right;vertical-align:middle;margin:-4px;color:gray;">-----</div>';
            html += '                                   </div>';
            html += '                               </td>';
            html += '                           </tr>';
            html += '                           <tr>';
            html += '                               <td style="white-space:nowrap;">';
            html += '                                   <div style="width: 100%; overflow: hidden;vertical-align:middle;">';
            html += '                                       <div class="divCarouselButton_SmallButton2" style="float:left;vertical-align:middle;"></div><div style="float:right;vertical-align:middle;margin:-4px;color:gray;">-----</div>';
            html += '                                   </div>';
            html += '                               </td>';
            html += '                           </tr>';
            html += '                           <tr>';
            html += '                               <td style="white-space:nowrap;">';
            html += '                                   <div style="width: 100%; overflow: hidden;vertical-align:middle;">';
            html += '                                       <div class="divCarouselButton_SmallButton2" style="float:left;vertical-align:middle;"></div><div style="float:right;vertical-align:middle;margin:-4px;color:gray;">-----</div>';
            html += '                                   </div>';
            html += '                               </td>';
            html += '                           </tr>';
            html += '                       </table>';
            html += '                       <div style="height:5px;"></div>'; // Button spacer. <br /> is too much.
            html += '                       <table id="buttonDisplayRequestsAsTiles_AllActiveRequests" class="divCarouselButton_Selected" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderExecutiveSummaries_ACTIVE_REQUESTS\');">'; //, \'AllActiveRequests\', this);">';
            html += '                           <tr>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                           </tr>';
            html += '                           <tr>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                           </tr>';
            html += '                       </table>';
            html += '                   </td>';
            html += '                   <td style="vertical-align:top;">';

            html += '                       <div id="divBwExecutiveSummariesCarousel_AllActiveRequests" class="bwAccordionDrawer" bwaccordiondrawertype="SOCIAL_NETWORK" >';
            html += '                           &nbsp;&nbsp;<img style="width:100px;height:100px;vertical-align:middle;white-space:nowrap;padding-top:15px;" src="/images/ajax-loader.gif" />&nbsp;&nbsp;<span id="divActivitySpinner_WorkingOnItDialog_spinnerText" style="font-size:25pt;white-space:nowrap;vertical-align:middle;">Loading...</span>';
            html += '                       </div>'; // Display as the executive summary carousel.






            html += '                   </td>';
            html += '               </tr>';
            html += '           </table>';






            html += '       </td>';





            html += '   </tr>';
            //
            // end: xx row, "SOCIAL_NETWORK" summary.
            //





























            //
            // Render all but the Fifth section.
            //
            var unitTable1 = '';
            unitTable1 += '<div id="BWFunctionalAreaDiv' + deferredIndex.toString() + '" style="cursor:pointer;" >';
            unitTable1 += '<table id="BWFunctionalArea' + deferredIndex.toString() + '" style="vertical-align:top;width:100%;">';
            unitTable1 += html;
            unitTable1 += '</tbody></table>';
            unitTable1 += '</div>';




            var result = {
                html: unitTable1
            }
            return result;

            //} catch (e) {
            //    console.log('Exception in generateHomePageNotificationScreenHtml():1335-1: ' + e.message + ', ' + e.stack);
            //    displayAlertDialog('Exception in generateHomePageNotificationScreenHtml():1335-1: ' + e.message + ', ' + e.stack);
            //    var result = {
            //        html: 'Exception in generateHomePageNotificationScreenHtml():1335-1: ' + e.message + ', ' + e.stack
            //    }
            //    return result;
            //}
        } catch (e) {
            console.log('Exception in bwCommonScripts.js.generateEmptyHomePageNotificationScreenHtml5():1335-1: ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwCommonScripts.js.generateEmptyHomePageNotificationScreenHtml5():1335-1: ' + e.message + ', ' + e.stack);
            var result = {
                html: 'Exception in bwCommonScripts.js.generateEmptyHomePageNotificationScreenHtml5():1335-1: ' + e.message + ', ' + e.stack
            }
            return result;
        }
    };









    exports.generateHomePageNotificationScreenHtml4 = function (taskData, brData, myBrData, serverside) {
        try {
            console.log('In bwCommonScripts.js.generateHomePageNotificationScreenHtml4().');
            alert('In bwCommonScripts.js.generateHomePageNotificationScreenHtml4().');

            //exports.invitationData = invitationData; // removed 8-18-2023.
            exports.taskData = taskData;
            //exports.participantsData = participantsData;
            exports.brData = brData;
            exports.myBrData = myBrData;

            //var taskData = this.options.taskData;
            //var brData = this.options.brData;
            //var myBrData = this.options.myBrData
            //var serverside = false;
            //var deferredIndex = this.options.deferredIndex;
            var deferredIndex = 0;
            var bwWorkflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var invitationData = null;

            // Change the page title to indicate the # of tasks. This will show up in the browser tab and is a cool way to show the user they have alerts.
            if (taskData && taskData.length && (taskData.length > 0)) {




                //alert('In xx(). taskData.length: ' + taskData.length);



                //// debugger;
                if (myBrData && myBrData.MyRequests && myBrData.MyRequests.length & myBrData.MyRequests.length > 0) {

                    document.title = 'You have ' + taskData.length + ' pending tasks...';

                } else {

                    document.title = 'You have ' + taskData.length + ' pending tasks...';

                }

                // Change the css to red/orange.
                //swapStyleSheet("css/bw.core.colors.red.orange.css");
                // Change the currency indicator to the one with the red dot. This obviously depends upon consistent naming!
                //renderFavicon(true);
            } else {
                document.title = 'No pending tasks'; // 4-18-2022 changed from 'No budget items'; //'My Budgetsxcx2';
                // Change the css to blue/blue.
                //swapStyleSheet("css/bw.core.colors.blue.blue.css");
                // Change the currency indicator to the one without the red dot. This obviously depends upon consistent naming!
                //renderFavicon(false);
            }
            //} catch (e) { }

            var html = '';

            html += '<style>';
            html += '.bwExecutiveSummariesCarousel2_SelectorButton {';
            //html += '   border:2px solid gray;';
            //html += '   padding:3px 3px 3px 3px;';
            //html += '   border-radius:20px 20px 20px 20px;';
            //html += '   width:25px;height:25px;';
            //html += '   display:inline-block;';
            html += '   cursor:pointer;';
            html += '}';
            html += '.bwExecutiveSummariesCarousel2_SelectorButton:hover {';
            html += '   border:2px solid red;';
            html += '}';
            html += '</style>';
            //
            // Display the pending tasks.
            //
            if (taskData && taskData.length) {
                if (taskData.length == 0 && brData.PendingBudgetRequests.length == 0 && brData.PendingPOBudgetRequests.length == 0) {
                    html += 'You have no pending tasks, and there are no pending requests.';
                }
            } else {
                html += 'You have no pending tasks, and there are no pending requests.';
            }

            if (serverside && serverside == true) {
                html += '<table id="tblHomePageAlertSectionForWorkflow' + deferredIndex.toString() + '" style="cursor:default;opacity:0.5;" >'; // Makes the email/serverside rendering have an opacity setting.
            } else {
                html += '<table id="tblHomePageAlertSectionForWorkflow' + deferredIndex.toString() + '" style="cursor:default;" >';
            }









            //
            // Pinned requests.
            //


            //var brData = this.options.brData;

            displayAlertDialog('xcx2131341: PINNED_REQUESTS');

            var pinnedRequestsArray = $('.bwAuthentication:first').bwAuthentication('option', 'PINNED_REQUESTS');
            var quantityOfPinnedRequests = 0;
            if (pinnedRequestsArray && pinnedRequestsArray.length) {
                if (brData && brData.PendingBudgetRequests && brData.PendingBudgetRequests.length) {
                    for (var i = 0; i < brData.PendingBudgetRequests.length; i++) {
                        if (pinnedRequestsArray.indexOf(brData.PendingBudgetRequests[i].bwBudgetRequestId) > -1) {
                            quantityOfPinnedRequests += 1;
                        }
                    }
                }
            }

            var rowId = 'functionalAreaRow_' + deferredIndex.toString() + '_6';
            var imageId = 'alertSectionImage_' + deferredIndex.toString() + '_6';
            var collapsibleRowId = 'alertSectionRow_' + deferredIndex.toString() + '_6';

            html += '<tr id="' + rowId + '" class="bwFunctionalAreaRow bwNoUserSelect" >';
            if (quantityOfPinnedRequests > 0) {
                if (quantityOfPinnedRequests == 1) {
                    html += '<td style="width:11px;vertical-align:top;" class="bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" ></td>';
                    html += '<td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" >';
                    html += '   <img title="expand" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="' + imageRootPath + '/images/drawer-open.png">';
                } else {
                    html += '<td style="width:11px;vertical-align:top;" class="bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" ></td>';
                    html += '<td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" >';
                    html += '   <img title="expand" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;float:none;" src="' + imageRootPath + '/images/drawer-open.png">';
                }
            } else {
                html += '   <td style="width:11px;" class="bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" ></td>';
                html += '   <td style="padding-left:60px;height:45px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');"  >';
            }
            html += '           <span class="bwNoUserSelect bwAccordionDrawerTitle"  >';
            //if (brData.PendingBudgetRequests.length == 1) {
            //    html += 'There is ' + brData.PendingBudgetRequests.length + ' active request.';
            //} else {
            //    html += 'There are ' + brData.PendingBudgetRequests.length + ' active requests.';
            //}
            //html += 'Pinned (' + brData.PendingBudgetRequests.length + ')&nbsp;&nbsp;<span style="color:tomato;font-size:8pt;font-weight:bold;">*Coming soon!</span>';
            html += 'Pinned (' + quantityOfPinnedRequests + ')'; //&nbsp;&nbsp;<span style="color:tomato;font-size:8pt;font-weight:bold;">*Coming soon!</span>';
            html += '           </span>';

            html += '       </td>';
            html += '       <td style="width:2%;" class="bwHPNDrillDownLinkCell2"></td>';
            html += '   </tr>';

            html += '   <tr id="' + collapsibleRowId + '" style="display:none;">';
            html += '       <td style="vertical-align:top;">';
            html += '       </td>';
            html += '       <td colspan="2">';

            html += '           <table>';
            html += '               <tr>';

            html += '                   <td style="vertical-align:top;width:60px;">';



            html += '                       <table id="buttonDisplayRequestsAsDetailedList_PinnedRequests" class="divCarouselButton" style="width:70px;padding: 4px 4px 4px 4px !important;" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_PinnedRequests\');">';
            html += '                           <tr>';
            html += '                               <td style="white-space:nowrap;">';
            html += '                                   <div style="width: 100%; overflow: hidden;vertical-align:middle;">';
            html += '                                       <div class="divCarouselButton_SmallButton2" style="float:left;vertical-align:middle;"></div><div style="float:right;vertical-align:middle;margin:-4px;color:gray;">-----</div>';
            html += '                                   </div>';
            html += '                               </td>';
            html += '                           </tr>';
            html += '                           <tr>';
            html += '                               <td style="white-space:nowrap;">';
            html += '                                   <div style="width: 100%; overflow: hidden;vertical-align:middle;">';
            html += '                                       <div class="divCarouselButton_SmallButton2" style="float:left;vertical-align:middle;"></div><div style="float:right;vertical-align:middle;margin:-4px;color:gray;">-----</div>';
            html += '                                   </div>';
            html += '                               </td>';
            html += '                           </tr>';
            html += '                           <tr>';
            html += '                               <td style="white-space:nowrap;">';
            html += '                                   <div style="width: 100%; overflow: hidden;vertical-align:middle;">';
            html += '                                       <div class="divCarouselButton_SmallButton2" style="float:left;vertical-align:middle;"></div><div style="float:right;vertical-align:middle;margin:-4px;color:gray;">-----</div>';
            html += '                                   </div>';
            html += '                               </td>';
            html += '                           </tr>';
            html += '                       </table>';
            html += '                       <div style="height:5px;"></div>'; // Button spacer. <br /> is too much.
            html += '                       <table id="buttonDisplayRequestsAsTiles_PinnedRequests" class="divCarouselButton_Selected" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderExecutiveSummaries_PINNED_REQUESTS\');">';
            html += '                           <tr>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                           </tr>';
            html += '                           <tr>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                           </tr>';
            html += '                       </table>';
            html += '                   </td>';
            html += '                   <td style="vertical-align:top;">';

            //html += '       <div id="divBwExecutiveSummariesCarousel_AllActiveRequests" class="bwAccordionDrawer" bwaccordiondrawertype="ACTIVE_REQUESTS" ></div>'; // Display as the executive summary carousel.
            html += '       <div id="divBwExecutiveSummariesCarousel_PinnedRequests" class="bwAccordionDrawer" bwaccordiondrawertype="PINNED_REQUESTS" ></div>'; // Display as the executive summary carousel.

            html += '       </td>';
            html += '   </tr>';
            html += '</table>';
            html += '   </td>';
            html += '</tr>';
            //
            // end: Pinned requests.
            //
















































            //
            // New row, "My Un-submitted Requests" summary.
            //
            // First we have to see if we have any items to display here.
            //if (brData.PendingBudgetRequests && brData.PendingBudgetRequests.length) {
            //    var myUnsubmittedRequests = [];
            //    for (var i = 0; i < brData.PendingBudgetRequests.length; i++) {
            //        if (brData.PendingBudgetRequests[i].BudgetWorkflowStatus == 'NOT_SUBMITTED') {
            //            // This is one! Add it to the array.
            //            myUnsubmittedRequests.push(brData.PendingBudgetRequests[i]);
            //        }
            //    }

            // Changed 8-25-2022

            //alert('xcx232341 myBrData: ' + JSON.stringify(myBrData));

            var myUnsubmittedRequests = [];
            if (myBrData && myBrData.MyRequests && myBrData.MyRequests.length) {
                if (myBrData.MyRequests && myBrData.MyRequests.length) {
                    for (var i = 0; i < myBrData.MyRequests.length; i++) {
                        if (myBrData.MyRequests[i].BudgetWorkflowStatus == 'NOT_SUBMITTED') {
                            // This is one! Add it to the array.
                            myUnsubmittedRequests.push(myBrData.MyRequests[i]);


                            //displayAlertDialog('xcx231243 NOT_SUBMITTED: ' + JSON.stringify(myBrData.MyRequests[i]));



                        }
                    }
                }
            }
            //exports.myUnsubmittedRequests = myUnsubmittedRequests; // Loading it here. It just seems convenient....
            //if (myUnsubmittedRequests.length > 0) {
            // We have unsubmitted requests to display.
            var rowId = 'functionalAreaRow_' + deferredIndex.toString() + '_5';
            var imageId = 'alertSectionImage_' + deferredIndex.toString() + '_5';
            var collapsibleRowId = 'alertSectionRow_' + deferredIndex.toString() + '_5';
            //debugger;
            html += '   <tr id="' + rowId + '" class="bwFunctionalAreaRow bwNoUserSelect" >';
            if (myUnsubmittedRequests.length > 0) {
                if (myUnsubmittedRequests.length == 1) {
                    html += '<td style="width:11px;vertical-align:top;" class="bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" ></td>';
                    html += '<td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" >';
                    html += '   <img title="expand" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="' + imageRootPath + '/images/drawer-open.png">';
                } else {
                    html += '<td style="width:11px;vertical-align:top;" class="bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" ></td>';
                    html += '<td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" >';
                    html += '   <img title="expand" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;float:none;" src="' + imageRootPath + '/images/drawer-open.png">';
                }
            } else {
                html += '   <td style="width:11px;" class="bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" ></td>';
                html += '   <td style="padding-left:60px;height:45px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');"  >';
            }
            html += '           <span class="bwNoUserSelect bwAccordionDrawerTitle"  >';
            if (myUnsubmittedRequests.length == 1) {
                html += 'You have ' + myUnsubmittedRequests.length + ' saved (un-submitted) request.';
            } else {
                html += 'You have ' + myUnsubmittedRequests.length + ' saved (un-submitted) requests.';
            }
            html += '           </span>';

            html += '       </td>';
            html += '       <td style="width:2%;" class="bwHPNDrillDownLinkCell2"></td>';
            html += '   </tr>';

            html += '   <tr id="' + collapsibleRowId + '" style="display:none;">';
            html += '       <td style="vertical-align:top;">';
            html += '       </td>';
            html += '       <td colspan="2">';

            html += '           <table>';
            html += '               <tr>';

            html += '                   <td style="vertical-align:top;width:60px;">';



            html += '                       <table id="buttonDisplayRequestsAsDetailedList_MyUnsubmittedRequests" class="divCarouselButton" style="width:70px;padding: 4px 4px 4px 4px !important;" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_MyUnsubmittedRequests\');">';
            html += '                           <tr>';
            html += '                               <td style="white-space:nowrap;">';
            html += '                                   <div style="width: 100%; overflow: hidden;vertical-align:middle;">';
            html += '                                       <div class="divCarouselButton_SmallButton2" style="float:left;vertical-align:middle;"></div><div style="float:right;vertical-align:middle;margin:-4px;color:gray;">-----</div>';
            html += '                                   </div>';
            html += '                               </td>';
            html += '                           </tr>';
            html += '                           <tr>';
            html += '                               <td style="white-space:nowrap;">';
            html += '                                   <div style="width: 100%; overflow: hidden;vertical-align:middle;">';
            html += '                                       <div class="divCarouselButton_SmallButton2" style="float:left;vertical-align:middle;"></div><div style="float:right;vertical-align:middle;margin:-4px;color:gray;">-----</div>';
            html += '                                   </div>';
            html += '                               </td>';
            html += '                           </tr>';
            html += '                           <tr>';
            html += '                               <td style="white-space:nowrap;">';
            html += '                                   <div style="width: 100%; overflow: hidden;vertical-align:middle;">';
            html += '                                       <div class="divCarouselButton_SmallButton2" style="float:left;vertical-align:middle;"></div><div style="float:right;vertical-align:middle;margin:-4px;color:gray;">-----</div>';
            html += '                                   </div>';
            html += '                               </td>';
            html += '                           </tr>';
            html += '                       </table>';
            html += '                       <div style="height:5px;"></div>'; // Button spacer. <br /> is too much.
            html += '                       <table id="buttonDisplayRequestsAsTiles_MyUnsubmittedRequests" class="divCarouselButton_Selected" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderExecutiveSummaries_MyUnsubmittedRequests\');">';
            html += '                           <tr>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                           </tr>';
            html += '                           <tr>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                           </tr>';
            html += '                       </table>';
            html += '                   </td>';
            html += '                   <td style="vertical-align:top;">';

            html += '                       <div id="divBwExecutiveSummariesCarousel_MyUnsubmittedRequests" class="bwAccordionDrawer" bwaccordiondrawertype="MY_UNSUBMITTED_REQUESTS" ></div>'; // Display as the executive summary carousel.

            html += '                   </td>';
            html += '               </tr>';
            html += '           </table>';
            html += '       </td>';
            html += '   </tr>';

            //}


            //
            // end: xx row, "My unsubmitted requests" summary.
            //













            //
            // Fourth section, "My Submitted Requests" summary.
            //
            var rowId = 'functionalAreaRow_' + deferredIndex.toString() + '_4';
            var imageId = 'alertSectionImage_' + deferredIndex.toString() + '_4';
            var collapsibleRowId = 'alertSectionRow_' + deferredIndex.toString() + '_4';

            html += '<tr id="' + rowId + '" class="bwFunctionalAreaRow bwNoUserSelect" >';
            if (brData && brData.PendingBudgetRequests && brData.PendingBudgetRequests.length) {
                if (brData.PendingBudgetRequests.length > 0) {
                    if (brData.PendingBudgetRequests.length == 1) {
                        html += '<td style="width:11px;vertical-align:top;" class="bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" ></td>';
                        html += '<td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" >';
                        html += '   <img title="expand" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="' + imageRootPath + '/images/drawer-open.png">';
                    } else {
                        html += '<td style="width:11px;vertical-align:top;" class="bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" ></td>';
                        html += '<td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" >';
                        html += '   <img title="expand" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;float:none;" src="' + imageRootPath + '/images/drawer-open.png">';
                    }
                } else {
                    html += '   <td style="width:11px;" class="bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" ></td>';
                    html += '   <td style="padding-left:60px;height:45px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');"  >';
                }
            } else {
                html += '   <td style="width:11px;" class="bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" ></td>';
                html += '   <td style="padding-left:60px;height:45px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');"  >';
            }
            html += '           <span class="bwNoUserSelect bwAccordionDrawerTitle"  >';
            //if (brData.PendingBudgetRequests.length == 1) {
            //    html += 'There are ' + brData.PendingBudgetRequests.length + ' active request.';
            //} else {
            //    html += 'There are ' + brData.PendingBudgetRequests.length + ' active requests.';
            //}



            // Changed 8-25-2022
            var mySubmittedCount = 0;
            if (myBrData && myBrData.MyRequests && myBrData.MyRequests.length) {
                for (var i = 0; i < myBrData.MyRequests.length; i++) {
                    if (myBrData.MyRequests[i].BudgetWorkflowStatus != 'NOT_SUBMITTED') {
                        mySubmittedCount += 1;
                    }
                }
            }
            if (mySubmittedCount == 1) {
                html += 'You have submitted ' + mySubmittedCount + ' request.';
            } else {
                html += 'You have submitted ' + mySubmittedCount + ' requests.';
            }

            //if (myBrData && myBrData.MyRequests && myBrData.MyRequests.length && (myBrData.MyRequests.length == 1)) {
            //    html += 'You have submitted ' + myBrData.MyRequests.length + ' request.';
            //} else {
            //    html += 'You have submitted ' + myBrData.MyRequests.length + ' requests.';
            //}

            html += '           </span>';

            html += '       </td>';
            html += '       <td style="width:2%;" class="bwHPNDrillDownLinkCell2"></td>';
            html += '   </tr>';

            html += '   <tr id="' + collapsibleRowId + '" style="display:none;">';
            html += '       <td style="vertical-align:top;">';
            html += '       </td>';
            html += '       <td colspan="2">';

            html += '           <table>';
            html += '               <tr>';

            html += '                   <td style="vertical-align:top;width:60px;">';



            html += '                       <table id="buttonDisplayRequestsAsDetailedList_MySubmittedRequests" class="divCarouselButton" style="width:70px;padding: 4px 4px 4px 4px !important;" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_MySubmittedRequests\');">'; //, \'MySubmittedRequests\', this);">';
            html += '                           <tr>';
            html += '                               <td style="white-space:nowrap;">';
            html += '                                   <div style="width: 100%; overflow: hidden;vertical-align:middle;">';
            html += '                                       <div class="divCarouselButton_SmallButton2" style="float:left;vertical-align:middle;"></div><div style="float:right;vertical-align:middle;margin:-4px;color:gray;">-----</div>';
            html += '                                   </div>';
            html += '                               </td>';
            html += '                           </tr>';
            html += '                           <tr>';
            html += '                               <td style="white-space:nowrap;">';
            html += '                                   <div style="width: 100%; overflow: hidden;vertical-align:middle;">';
            html += '                                       <div class="divCarouselButton_SmallButton2" style="float:left;vertical-align:middle;"></div><div style="float:right;vertical-align:middle;margin:-4px;color:gray;">-----</div>';
            html += '                                   </div>';
            html += '                               </td>';
            html += '                           </tr>';
            html += '                           <tr>';
            html += '                               <td style="white-space:nowrap;">';
            html += '                                   <div style="width: 100%; overflow: hidden;vertical-align:middle;">';
            html += '                                       <div class="divCarouselButton_SmallButton2" style="float:left;vertical-align:middle;"></div><div style="float:right;vertical-align:middle;margin:-4px;color:gray;">-----</div>';
            html += '                                   </div>';
            html += '                               </td>';
            html += '                           </tr>';
            html += '                       </table>';
            html += '                       <div style="height:5px;"></div>'; // Button spacer. <br /> is too much.
            html += '                       <table id="buttonDisplayRequestsAsTiles_MySubmittedRequests" class="divCarouselButton_Selected" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderExecutiveSummaries_MySubmittedRequests\');">'; //, \'MySubmittedRequests\', this);">';
            html += '                           <tr>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                           </tr>';
            html += '                           <tr>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                           </tr>';
            html += '                       </table>';
            html += '                   </td>';
            html += '                   <td style="vertical-align:top;">';

            html += '       <div id="divBwExecutiveSummariesCarousel_MySubmittedRequests" class="bwAccordionDrawer" bwaccordiondrawertype="MY_SUBMITTED_REQUESTS" ></div>'; // Display as the executive summary carousel.

            html += '       </td>';
            html += '   </tr>';
            html += '</table>';
            html += '   </td>';
            html += '</tr>';

            //
            // end: Fourth section, "My Requests" summary.
            //





























            //
            // Second row, "All Active Requests" summary.
            //
            var rowId = 'functionalAreaRow_' + deferredIndex.toString() + '_2';
            var imageId = 'alertSectionImage_' + deferredIndex.toString() + '_2';
            var collapsibleRowId = 'alertSectionRow_' + deferredIndex.toString() + '_2';

            html += '<tr id="' + rowId + '" class="bwFunctionalAreaRow bwNoUserSelect" >';
            if (brData && brData.PendingBudgetRequests && brData.PendingBudgetRequests.length) {
                if (brData.PendingBudgetRequests.length > 0) {
                    if (brData.PendingBudgetRequests.length == 1) {
                        html += '<td style="width:11px;vertical-align:top;" class="bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" ></td>';
                        html += '<td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" >';
                        html += '   <img title="expand" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="' + imageRootPath + '/images/drawer-open.png">';
                    } else {
                        html += '<td style="width:11px;vertical-align:top;" class="bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" ></td>';
                        html += '<td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" >';
                        html += '   <img title="expand" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;float:none;" src="' + imageRootPath + '/images/drawer-open.png">';
                    }
                } else {
                    html += '   <td style="width:11px;" class="bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" ></td>';
                    html += '   <td style="padding-left:60px;height:45px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');"  >';
                }
            } else {
                html += '   <td style="width:11px;" class="bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" ></td>';
                html += '   <td style="padding-left:60px;height:45px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');"  >';
            }
            html += '           <span class="bwNoUserSelect bwAccordionDrawerTitle"  >';
            if (brData && brData.PendingBudgetRequests && brData.PendingBudgetRequests.length) {
                if (brData.PendingBudgetRequests.length == 1) {
                    html += 'There is ' + brData.PendingBudgetRequests.length + ' active request.';
                } else {
                    html += 'There are ' + brData.PendingBudgetRequests.length + ' active requests.';
                }
            } else {
                html += 'There are ' + '0' + ' active requests.';
            }
            html += '           </span>';

            html += '       </td>';
            html += '       <td style="width:2%;" class="bwHPNDrillDownLinkCell2"></td>';
            html += '   </tr>';

            html += '   <tr id="' + collapsibleRowId + '" style="display:none;">';
            html += '       <td style="vertical-align:top;">';
            html += '       </td>';
            html += '       <td colspan="2">';

            html += '           <table>';
            html += '               <tr>';

            html += '                   <td style="vertical-align:top;width:60px;">';



            html += '                       <table id="buttonDisplayRequestsAsDetailedList_AllActiveRequests" class="divCarouselButton" style="width:70px;padding: 4px 4px 4px 4px !important;" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_AllActiveRequests\');">'; //, \'AllActiveRequests\', this);">';
            html += '                           <tr>';
            html += '                               <td style="white-space:nowrap;">';
            html += '                                   <div style="width: 100%; overflow: hidden;vertical-align:middle;">';
            html += '                                       <div class="divCarouselButton_SmallButton2" style="float:left;vertical-align:middle;"></div><div style="float:right;vertical-align:middle;margin:-4px;color:gray;">-----</div>';
            html += '                                   </div>';
            html += '                               </td>';
            html += '                           </tr>';
            html += '                           <tr>';
            html += '                               <td style="white-space:nowrap;">';
            html += '                                   <div style="width: 100%; overflow: hidden;vertical-align:middle;">';
            html += '                                       <div class="divCarouselButton_SmallButton2" style="float:left;vertical-align:middle;"></div><div style="float:right;vertical-align:middle;margin:-4px;color:gray;">-----</div>';
            html += '                                   </div>';
            html += '                               </td>';
            html += '                           </tr>';
            html += '                           <tr>';
            html += '                               <td style="white-space:nowrap;">';
            html += '                                   <div style="width: 100%; overflow: hidden;vertical-align:middle;">';
            html += '                                       <div class="divCarouselButton_SmallButton2" style="float:left;vertical-align:middle;"></div><div style="float:right;vertical-align:middle;margin:-4px;color:gray;">-----</div>';
            html += '                                   </div>';
            html += '                               </td>';
            html += '                           </tr>';
            html += '                       </table>';
            html += '                       <div style="height:5px;"></div>'; // Button spacer. <br /> is too much.
            html += '                       <table id="buttonDisplayRequestsAsTiles_AllActiveRequests" class="divCarouselButton_Selected" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderExecutiveSummaries_ACTIVE_REQUESTS\');">'; //, \'AllActiveRequests\', this);">';
            html += '                           <tr>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                           </tr>';
            html += '                           <tr>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                           </tr>';
            html += '                       </table>';
            html += '                   </td>';
            html += '                   <td style="vertical-align:top;">';

            html += '       <div id="divBwExecutiveSummariesCarousel_AllActiveRequests" class="bwAccordionDrawer" bwaccordiondrawertype="ACTIVE_REQUESTS" ></div>'; // Display as the executive summary carousel.

            html += '       </td>';
            html += '   </tr>';
            html += '</table>';
            html += '   </td>';
            html += '</tr>';
            //
            // end: Second row, "Active Requests" summary.
            //











































            ////
            //// Third row, "Unclaimed Invitations" summary.
            ////
            //if (invitationData && invitationData.length && (invitationData.length != 0)) { // Only display this section if there is more than 0 invitations. If there are none, don't even bother displaying.
            //    var rowId = 'functionalAreaRow_' + deferredIndex.toString() + '_3';
            //    var imageId = 'alertSectionImage_' + deferredIndex.toString() + '_3';
            //    var collapsibleRowId = 'alertSectionRow_' + deferredIndex.toString() + '_3';
            //    html += '<tr id="' + rowId + '" class="bwFunctionalAreaRow" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" >';
            //    if (invitationData.length > 0) {
            //        if (invitationData.length == 1) {
            //            html += '<td style="width:11px;vertical-align:top;"></td>';
            //            html += '<td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2">';
            //            html += '<img title="expand" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="' + imageRootPath + '/images/drawer-open.png">';
            //        } else {
            //            html += '<td style="width:11px;vertical-align:top;"></td><td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2">';
            //            html += '<img title="expand" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="' + imageRootPath + '/images/drawer-open.png">';
            //        }
            //    } else {
            //        html += '<td style="width:11px;"></td>';
            //        html += '<td style="padding-left:60px;height:45px;" class="bwHPNDrillDownLinkCell2">';
            //    }
            //    html += '       <span>';
            //    if (invitationData.length == 1) {
            //        html += 'There is ' + invitationData.length + ' unclaimed invitation.';
            //    } else if (invitationData.length > 0) {
            //        html += 'There are ' + invitationData.length + ' unclaimed invitations.';
            //    } else {
            //        html += 'There are ' + invitationData.length + ' unclaimed invitations. Dont display this...';
            //    }
            //    html += '       </span>';
            //    html += '   </td>';

            //    html += '<td class="bwHPNDrillDownLinkCell2"></td>';


            //    html += '</tr>';
            //    // Third row, "Unclaimed Invitations" details.
            //    html += '<tr id="' + collapsibleRowId + '" style="display:none;">';
            //    html += '<td></td>';
            //    html += '<td colspan="2"><table><tbody>';
            //    for (var i = 0; i < invitationData.length; i++) {
            //        html += '   <tr>';
            //        html += '       <td style="width:10px;"></td>';
            //        html += '       <td style="width:10px;"></td>';
            //        html += '            <td style="width:90px;"></td>';
            //        html += '            <td>&nbsp;&nbsp;</td>';
            //        var invitationChar = (globalUrlPrefix + globalUrl + '?invitation=' + invitationData[i].bwInvitationId).indexOf('=') + 1; // notifications[ntypeindex][2][pi][0].indexOf('=') + 1;
            //        var invitationGuid = (globalUrlPrefix + globalUrl + '?invitation=' + invitationData[i].bwInvitationId).substring(invitationChar);
            //        html += '            <td colspan="5" class="tdHomePageSubNotificationIos8"><div id="tdUnclaimedInvitationLinkSwipeEnabled' + i + '"><a style="cursor:pointer;" onclick="cmdViewInvitation(\'' + invitationGuid + '\');" target="_blank" title="Send this link in an email to invite someone to participate in this workflow. You will be notified when they have confirmed their participation.">' + globalUrlPrefix + globalUrl + '?invitation=' + invitationData[i].bwInvitationId + '</a></div></td>';
            //        html += '        </tr>';
            //    }
            //    html += '</tbody></table></td>';
            //    html += '</tr>';
            //}
            ////
            //// end: Third row, "Unclaimed Invitations" summary.
            ////








            //
            // Top row, "My Pending Tasks" summary.
            //
            var rowId = 'functionalAreaRow_' + deferredIndex.toString() + '_1';
            var imageId = 'alertSectionImage_' + deferredIndex.toString() + '_1';
            var collapsibleRowId = 'alertSectionRow_' + deferredIndex.toString() + '_1';

            html += '<tr id="' + rowId + '" class="bwFunctionalAreaRow bwNoUserSelect" >';
            if (taskData && taskData.length) {
                if (taskData.length > 0) {
                    if (taskData.length == 1) {
                        //html += '<td style="width:11px;vertical-align:top;" class="bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" ><img src="' + imageRootPath + '/images/red-dot.png" width="11" height="11" alt="" style="cursor:pointer;vertical-align:top;float:right;" /></td>';
                        //html += '<td style="width:11px;vertical-align:top;" class="bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" ></td>';
                        html += '<td colspan="2" style="padding-left:11px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" >';
                        html += '   <img title="expand" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="' + imageRootPath + '/images/drawer-open.png">';
                    } else {
                        //html += '<td style="width:11px;vertical-align:top;" class="bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" ><img src="' + imageRootPath + '/images/red-dot.png" width="11" height="11" alt="" style="cursor:pointer;vertical-align:top;float:right;" /></td>';
                        //html += '<td style="width:11px;vertical-align:top;" class="bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" ></td>';
                        html += '<td colspan="2" style="padding-left:11px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" >';
                        html += '   <img title="expand" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;float:none;" src="' + imageRootPath + '/images/drawer-open.png">';
                    }
                } else {
                    //html += '   <td style="width:11px;" class="bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" ></td>';
                    html += '   <td colspan="2" style="padding-left:60px;height:45px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');"  >';
                }
            } else {

                html += '   <td colspan="2" style="padding-left:60px;height:45px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');"  >';


            }
            html += '           <span class="bwNoUserSelect bwAccordionDrawerTitle"  >';
            if (taskData && taskData.length) {
                if (taskData.length == 1) {
                    html += 'You have ' + taskData.length + ' pending task. <img src="' + imageRootPath + '/images/red-dot.png" width="11" height="11" alt="" style="cursor:pointer;vertical-align:top;float:left;" />';
                } else {
                    html += 'You have ' + taskData.length + ' pending tasks. <img src="' + imageRootPath + '/images/red-dot.png" width="11" height="11" alt="" style="cursor:pointer;vertical-align:top;float:left;" />';
                }
            } else {
                html += 'You have ' + '0' + ' pending tasks. <img src="' + imageRootPath + '/images/red-dot.png" width="11" height="11" alt="" style="cursor:pointer;vertical-align:top;float:left;" />';
            }
            html += '           </span>';

            html += '       </td>';
            html += '       <td style="width:2%;" class="bwHPNDrillDownLinkCell2">xcx4443-2</td>';
            html += '   </tr>';

            html += '   <tr id="' + collapsibleRowId + '" style="display:none;">';
            html += '       <td style="vertical-align:top;">';
            html += '       </td>';
            html += '       <td colspan="2">';

            html += '           <table>';
            html += '               <tr>';

            html += '                   <td style="vertical-align:top;width:60px;">';



            html += '                       <table id="buttonDisplayRequestsAsDetailedList_MyPendingTasks" class="divCarouselButton" style="width:70px;padding: 4px 4px 4px 4px !important;" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_MyPendingTasks\');">'; //, \'MyPendingTasks\', this);">';
            html += '                           <tr>';
            html += '                               <td style="white-space:nowrap;">';
            html += '                                   <div style="width: 100%; overflow: hidden;vertical-align:middle;">';
            html += '                                       <div class="divCarouselButton_SmallButton2" style="float:left;vertical-align:middle;"></div><div style="float:right;vertical-align:middle;margin:-4px;color:gray;">-----</div>';
            html += '                                   </div>';
            html += '                               </td>';
            html += '                           </tr>';
            html += '                           <tr>';
            html += '                               <td style="white-space:nowrap;">';
            html += '                                   <div style="width: 100%; overflow: hidden;vertical-align:middle;">';
            html += '                                       <div class="divCarouselButton_SmallButton2" style="float:left;vertical-align:middle;"></div><div style="float:right;vertical-align:middle;margin:-4px;color:gray;">-----</div>';
            html += '                                   </div>';
            html += '                               </td>';
            html += '                           </tr>';
            html += '                           <tr>';
            html += '                               <td style="white-space:nowrap;">';
            html += '                                   <div style="width: 100%; overflow: hidden;vertical-align:middle;">';
            html += '                                       <div class="divCarouselButton_SmallButton2" style="float:left;vertical-align:middle;"></div><div style="float:right;vertical-align:middle;margin:-4px;color:gray;">-----</div>';
            html += '                                   </div>';
            html += '                               </td>';
            html += '                           </tr>';
            html += '                       </table>';
            html += '                       <div style="height:5px;"></div>'; // Button spacer. <br /> is too much.
            html += '                       <table id="buttonDisplayRequestsAsTiles_MyPendingTasks" class="divCarouselButton_Selected" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderExecutiveSummaries_MyPendingTasks\');">'; //, \'MyPendingTasks\', this);">';
            html += '                           <tr>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                           </tr>';
            html += '                           <tr>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                           </tr>';
            html += '                       </table>';
            html += '                   </td>';



            html += '                   <td style="vertical-align:top;">';

            html += '       <div id="divBwExecutiveSummariesCarousel_MyPendingTasks" class="bwAccordionDrawer" bwaccordiondrawertype="MY_PENDING_TASKS" ></div>'; // Display as the executive summary carousel.

            html += '                   </td>';
            html += '               </tr>';
            html += '           </table>';
            html += '       </td>';
            html += '   </tr>';
            //
            // end: Top row, "My Tasks" details. // This one is the template for the rest of these sections. 4-6-2022.
            //





            //
            // Render all but the Fifth section.
            //
            var unitTable1 = '';
            unitTable1 += '<div id="BWFunctionalAreaDiv' + deferredIndex.toString() + '" style="cursor:pointer;" >';
            unitTable1 += '<table id="BWFunctionalArea' + deferredIndex.toString() + '" style="vertical-align:top;width:100%;">';
            unitTable1 += html;
            unitTable1 += '</tbody></table>';
            unitTable1 += '</div>';




            var result = {
                html: unitTable1
            }
            return result;

            //} catch (e) {
            //    console.log('Exception in generateHomePageNotificationScreenHtml():1335-1: ' + e.message + ', ' + e.stack);
            //    displayAlertDialog('Exception in generateHomePageNotificationScreenHtml():1335-1: ' + e.message + ', ' + e.stack);
            //    var result = {
            //        html: 'Exception in generateHomePageNotificationScreenHtml():1335-1: ' + e.message + ', ' + e.stack
            //    }
            //    return result;
            //}
        } catch (e) {
            console.log('Exception in bwCommonScripts.js.generateHomePageNotificationScreenHtml4():1335-1: ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwCommonScripts.js.generateHomePageNotificationScreenHtml4():1335-1: ' + e.message + ', ' + e.stack);
            var result = {
                html: 'Exception in bwCommonScripts.js.generateHomePageNotificationScreenHtml4():1335-1: ' + e.message + ', ' + e.stack
            }
            return result;
        }
    };







    exports.generateHomePageNotificationScreenHtml3 = function (deferredIndex, appweburl, bwWorkflowAppId, invitationData, taskData, tenantData, participantsData, brData, myBrData, serverside) {
        try {
            console.log('In bwCommonScripts.js.generateHomePageNotificationScreenHtml3().');
            alert('In bwCommonScripts.js.generateHomePageNotificationScreenHtml3().');

            //exports.invitationData = invitationData; // removed 8-18-2023.
            exports.taskData = taskData;
            exports.participantsData = participantsData;
            exports.brData = brData;
            exports.myBrData = myBrData;

            //var taskData = this.options.taskData;
            //var brData = this.options.brData;
            //var myBrData = this.options.myBrData
            //var serverside = false;
            //var deferredIndex = this.options.deferredIndex;
            var bwWorkflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var invitationData = null;

            // Change the page title to indicate the # of tasks. This will show up in the browser tab and is a cool way to show the user they have alerts.
            if (taskData.length > 0) {




                //alert('In xx(). taskData.length: ' + taskData.length);



                //// debugger;
                if (myBrData && myBrData.MyRequests && myBrData.MyRequests.length & myBrData.MyRequests.length > 0) {

                    document.title = 'You have ' + taskData.length + ' pending tasks...';

                } else {

                    document.title = 'You have ' + taskData.length + ' pending tasks...';

                }

                // Change the css to red/orange.
                //swapStyleSheet("css/bw.core.colors.red.orange.css");
                // Change the currency indicator to the one with the red dot. This obviously depends upon consistent naming!
                //renderFavicon(true);
            } else {
                document.title = 'No pending tasks'; // 4-18-2022 changed from 'No budget items'; //'My Budgetsxcx2';
                // Change the css to blue/blue.
                //swapStyleSheet("css/bw.core.colors.blue.blue.css");
                // Change the currency indicator to the one without the red dot. This obviously depends upon consistent naming!
                //renderFavicon(false);
            }
            //} catch (e) { }

            var html = '';

            html += '<style>';
            html += '.bwExecutiveSummariesCarousel2_SelectorButton {';
            //html += '   border:2px solid gray;';
            //html += '   padding:3px 3px 3px 3px;';
            //html += '   border-radius:20px 20px 20px 20px;';
            //html += '   width:25px;height:25px;';
            //html += '   display:inline-block;';
            html += '   cursor:pointer;';
            html += '}';
            html += '.bwExecutiveSummariesCarousel2_SelectorButton:hover {';
            html += '   border:2px solid red;';
            html += '}';
            html += '</style>';
            //
            // Display the pending tasks.
            //
            if (taskData && taskData.length) {
                if (taskData.length == 0 && brData.PendingBudgetRequests.length == 0 && brData.PendingPOBudgetRequests.length == 0) {
                    html += 'You have no pending tasks, and there are no pending requests.';
                }
            } else {
                html += 'You have no pending tasks, and there are no pending requests.';
            }

            if (serverside && serverside == true) {
                html += '<table id="tblHomePageAlertSectionForWorkflow' + deferredIndex.toString() + '" style="cursor:default;opacity:0.5;" >'; // Makes the email/serverside rendering have an opacity setting.
            } else {
                html += '<table id="tblHomePageAlertSectionForWorkflow' + deferredIndex.toString() + '" style="cursor:default;" >';
            }









            //
            // Pinned requests.
            //


            //var brData = this.options.brData;

            displayAlertDialog('xcx2131341-2: PINNED_REQUESTS');

            var pinnedRequestsArray = $('.bwAuthentication:first').bwAuthentication('option', 'PINNED_REQUESTS');
            var quantityOfPinnedRequests = 0;
            if (pinnedRequestsArray && pinnedRequestsArray.length) {
                if (brData && brData.PendingBudgetRequests && brData.PendingBudgetRequests.length) {
                    for (var i = 0; i < brData.PendingBudgetRequests.length; i++) {
                        if (pinnedRequestsArray.indexOf(brData.PendingBudgetRequests[i].bwBudgetRequestId) > -1) {
                            quantityOfPinnedRequests += 1;
                        }
                    }
                }
            }

            var rowId = 'functionalAreaRow_' + deferredIndex.toString() + '_6';
            var imageId = 'alertSectionImage_' + deferredIndex.toString() + '_6';
            var collapsibleRowId = 'alertSectionRow_' + deferredIndex.toString() + '_6';

            html += '<tr id="' + rowId + '" class="bwFunctionalAreaRow bwNoUserSelect" >';
            if (quantityOfPinnedRequests > 0) {
                if (quantityOfPinnedRequests == 1) {
                    html += '<td style="width:11px;vertical-align:top;" class="bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" ></td>';
                    html += '<td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" >';
                    html += '   <img title="expand" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="' + imageRootPath + '/images/drawer-open.png">';
                } else {
                    html += '<td style="width:11px;vertical-align:top;" class="bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" ></td>';
                    html += '<td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" >';
                    html += '   <img title="expand" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;float:none;" src="' + imageRootPath + '/images/drawer-open.png">';
                }
            } else {
                html += '   <td style="width:11px;" class="bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" ></td>';
                html += '   <td style="padding-left:60px;height:45px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');"  >';
            }
            html += '           <span class="bwNoUserSelect bwAccordionDrawerTitle"  >';
            //if (brData.PendingBudgetRequests.length == 1) {
            //    html += 'There is ' + brData.PendingBudgetRequests.length + ' active request.';
            //} else {
            //    html += 'There are ' + brData.PendingBudgetRequests.length + ' active requests.';
            //}
            //html += 'Pinned (' + brData.PendingBudgetRequests.length + ')&nbsp;&nbsp;<span style="color:tomato;font-size:8pt;font-weight:bold;">*Coming soon!</span>';
            html += 'Pinned (' + quantityOfPinnedRequests + ')'; //&nbsp;&nbsp;<span style="color:tomato;font-size:8pt;font-weight:bold;">*Coming soon!</span>';
            html += '           </span>';

            html += '       </td>';
            html += '       <td style="width:2%;" class="bwHPNDrillDownLinkCell2"></td>';
            html += '   </tr>';

            html += '   <tr id="' + collapsibleRowId + '" style="display:none;">';
            html += '       <td style="vertical-align:top;">';
            html += '       </td>';
            html += '       <td colspan="2">';

            html += '           <table>';
            html += '               <tr>';

            html += '                   <td style="vertical-align:top;width:60px;">';



            html += '                       <table id="buttonDisplayRequestsAsDetailedList_PinnedRequests" class="divCarouselButton" style="width:70px;padding: 4px 4px 4px 4px !important;" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_PinnedRequests\');">';
            html += '                           <tr>';
            html += '                               <td style="white-space:nowrap;">';
            html += '                                   <div style="width: 100%; overflow: hidden;vertical-align:middle;">';
            html += '                                       <div class="divCarouselButton_SmallButton2" style="float:left;vertical-align:middle;"></div><div style="float:right;vertical-align:middle;margin:-4px;color:gray;">-----</div>';
            html += '                                   </div>';
            html += '                               </td>';
            html += '                           </tr>';
            html += '                           <tr>';
            html += '                               <td style="white-space:nowrap;">';
            html += '                                   <div style="width: 100%; overflow: hidden;vertical-align:middle;">';
            html += '                                       <div class="divCarouselButton_SmallButton2" style="float:left;vertical-align:middle;"></div><div style="float:right;vertical-align:middle;margin:-4px;color:gray;">-----</div>';
            html += '                                   </div>';
            html += '                               </td>';
            html += '                           </tr>';
            html += '                           <tr>';
            html += '                               <td style="white-space:nowrap;">';
            html += '                                   <div style="width: 100%; overflow: hidden;vertical-align:middle;">';
            html += '                                       <div class="divCarouselButton_SmallButton2" style="float:left;vertical-align:middle;"></div><div style="float:right;vertical-align:middle;margin:-4px;color:gray;">-----</div>';
            html += '                                   </div>';
            html += '                               </td>';
            html += '                           </tr>';
            html += '                       </table>';
            html += '                       <div style="height:5px;"></div>'; // Button spacer. <br /> is too much.
            html += '                       <table id="buttonDisplayRequestsAsTiles_PinnedRequests" class="divCarouselButton_Selected" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderExecutiveSummaries_PINNED_REQUESTS\');">';
            html += '                           <tr>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                           </tr>';
            html += '                           <tr>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                           </tr>';
            html += '                       </table>';
            html += '                   </td>';
            html += '                   <td style="vertical-align:top;">';

            //html += '       <div id="divBwExecutiveSummariesCarousel_AllActiveRequests" class="bwAccordionDrawer" bwaccordiondrawertype="ACTIVE_REQUESTS" ></div>'; // Display as the executive summary carousel.
            html += '       <div id="divBwExecutiveSummariesCarousel_PinnedRequests" class="bwAccordionDrawer" bwaccordiondrawertype="PINNED_REQUESTS" ></div>'; // Display as the executive summary carousel.

            html += '       </td>';
            html += '   </tr>';
            html += '</table>';
            html += '   </td>';
            html += '</tr>';
            //
            // end: Pinned requests.
            //
















































            //
            // New row, "My Un-submitted Requests" summary.
            //
            // First we have to see if we have any items to display here.
            //if (brData.PendingBudgetRequests && brData.PendingBudgetRequests.length) {
            //    var myUnsubmittedRequests = [];
            //    for (var i = 0; i < brData.PendingBudgetRequests.length; i++) {
            //        if (brData.PendingBudgetRequests[i].BudgetWorkflowStatus == 'NOT_SUBMITTED') {
            //            // This is one! Add it to the array.
            //            myUnsubmittedRequests.push(brData.PendingBudgetRequests[i]);
            //        }
            //    }

            // Changed 8-25-2022

            //alert('xcx232341 myBrData: ' + JSON.stringify(myBrData));

            var myUnsubmittedRequests = [];
            if (myBrData.MyRequests && myBrData.MyRequests.length) {
                for (var i = 0; i < myBrData.MyRequests.length; i++) {
                    if (myBrData.MyRequests[i].BudgetWorkflowStatus == 'NOT_SUBMITTED') {
                        // This is one! Add it to the array.
                        myUnsubmittedRequests.push(myBrData.MyRequests[i]);


                        //displayAlertDialog('xcx231243 NOT_SUBMITTED: ' + JSON.stringify(myBrData.MyRequests[i]));



                    }
                }
            }
            //exports.myUnsubmittedRequests = myUnsubmittedRequests; // Loading it here. It just seems convenient....
            //if (myUnsubmittedRequests.length > 0) {
            // We have unsubmitted requests to display.
            var rowId = 'functionalAreaRow_' + deferredIndex.toString() + '_5';
            var imageId = 'alertSectionImage_' + deferredIndex.toString() + '_5';
            var collapsibleRowId = 'alertSectionRow_' + deferredIndex.toString() + '_5';
            //debugger;
            html += '   <tr id="' + rowId + '" class="bwFunctionalAreaRow bwNoUserSelect" >';
            if (myUnsubmittedRequests.length > 0) {
                if (myUnsubmittedRequests.length == 1) {
                    html += '<td style="width:11px;vertical-align:top;" class="bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" ></td>';
                    html += '<td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" >';
                    html += '   <img title="expand" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="' + imageRootPath + '/images/drawer-open.png">';
                } else {
                    html += '<td style="width:11px;vertical-align:top;" class="bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" ></td>';
                    html += '<td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" >';
                    html += '   <img title="expand" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;float:none;" src="' + imageRootPath + '/images/drawer-open.png">';
                }
            } else {
                html += '   <td style="width:11px;" class="bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" ></td>';
                html += '   <td style="padding-left:60px;height:45px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');"  >';
            }
            html += '           <span class="bwNoUserSelect bwAccordionDrawerTitle"  >';
            if (myUnsubmittedRequests.length == 1) {
                html += 'You have ' + myUnsubmittedRequests.length + ' saved (un-submitted) request.';
            } else {
                html += 'You have ' + myUnsubmittedRequests.length + ' saved (un-submitted) requests.';
            }
            html += '           </span>';

            html += '       </td>';
            html += '       <td style="width:2%;" class="bwHPNDrillDownLinkCell2"></td>';
            html += '   </tr>';

            html += '   <tr id="' + collapsibleRowId + '" style="display:none;">';
            html += '       <td style="vertical-align:top;">';
            html += '       </td>';
            html += '       <td colspan="2">';

            html += '           <table>';
            html += '               <tr>';

            html += '                   <td style="vertical-align:top;width:60px;">';



            html += '                       <table id="buttonDisplayRequestsAsDetailedList_MyUnsubmittedRequests" class="divCarouselButton" style="width:70px;padding: 4px 4px 4px 4px !important;" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_MyUnsubmittedRequests\');">';
            html += '                           <tr>';
            html += '                               <td style="white-space:nowrap;">';
            html += '                                   <div style="width: 100%; overflow: hidden;vertical-align:middle;">';
            html += '                                       <div class="divCarouselButton_SmallButton2" style="float:left;vertical-align:middle;"></div><div style="float:right;vertical-align:middle;margin:-4px;color:gray;">-----</div>';
            html += '                                   </div>';
            html += '                               </td>';
            html += '                           </tr>';
            html += '                           <tr>';
            html += '                               <td style="white-space:nowrap;">';
            html += '                                   <div style="width: 100%; overflow: hidden;vertical-align:middle;">';
            html += '                                       <div class="divCarouselButton_SmallButton2" style="float:left;vertical-align:middle;"></div><div style="float:right;vertical-align:middle;margin:-4px;color:gray;">-----</div>';
            html += '                                   </div>';
            html += '                               </td>';
            html += '                           </tr>';
            html += '                           <tr>';
            html += '                               <td style="white-space:nowrap;">';
            html += '                                   <div style="width: 100%; overflow: hidden;vertical-align:middle;">';
            html += '                                       <div class="divCarouselButton_SmallButton2" style="float:left;vertical-align:middle;"></div><div style="float:right;vertical-align:middle;margin:-4px;color:gray;">-----</div>';
            html += '                                   </div>';
            html += '                               </td>';
            html += '                           </tr>';
            html += '                       </table>';
            html += '                       <div style="height:5px;"></div>'; // Button spacer. <br /> is too much.
            html += '                       <table id="buttonDisplayRequestsAsTiles_MyUnsubmittedRequests" class="divCarouselButton_Selected" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderExecutiveSummaries_MyUnsubmittedRequests\');">';
            html += '                           <tr>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                           </tr>';
            html += '                           <tr>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                           </tr>';
            html += '                       </table>';
            html += '                   </td>';
            html += '                   <td style="vertical-align:top;">';

            html += '                       <div id="divBwExecutiveSummariesCarousel_MyUnsubmittedRequests" class="bwAccordionDrawer" bwaccordiondrawertype="MY_UNSUBMITTED_REQUESTS" ></div>'; // Display as the executive summary carousel.

            html += '                   </td>';
            html += '               </tr>';
            html += '           </table>';
            html += '       </td>';
            html += '   </tr>';

            //}


            //
            // end: xx row, "My unsubmitted requests" summary.
            //













            //
            // Fourth section, "My Submitted Requests" summary.
            //
            var rowId = 'functionalAreaRow_' + deferredIndex.toString() + '_4';
            var imageId = 'alertSectionImage_' + deferredIndex.toString() + '_4';
            var collapsibleRowId = 'alertSectionRow_' + deferredIndex.toString() + '_4';

            html += '<tr id="' + rowId + '" class="bwFunctionalAreaRow bwNoUserSelect" >';
            if (brData && brData.PendingBudgetRequests && brData.PendingBudgetRequests.length) {
                if (brData.PendingBudgetRequests.length > 0) {
                    if (brData.PendingBudgetRequests.length == 1) {
                        html += '<td style="width:11px;vertical-align:top;" class="bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" ></td>';
                        html += '<td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" >';
                        html += '   <img title="expand" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="' + imageRootPath + '/images/drawer-open.png">';
                    } else {
                        html += '<td style="width:11px;vertical-align:top;" class="bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" ></td>';
                        html += '<td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" >';
                        html += '   <img title="expand" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;float:none;" src="' + imageRootPath + '/images/drawer-open.png">';
                    }
                } else {
                    html += '   <td style="width:11px;" class="bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" ></td>';
                    html += '   <td style="padding-left:60px;height:45px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');"  >';
                }
            } else {
                html += '   <td style="width:11px;" class="bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" ></td>';
                html += '   <td style="padding-left:60px;height:45px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');"  >';
            }
            html += '           <span class="bwNoUserSelect bwAccordionDrawerTitle"  >';
            //if (brData.PendingBudgetRequests.length == 1) {
            //    html += 'There are ' + brData.PendingBudgetRequests.length + ' active request.';
            //} else {
            //    html += 'There are ' + brData.PendingBudgetRequests.length + ' active requests.';
            //}



            // Changed 8-25-2022
            var mySubmittedCount = 0;
            if (myBrData && myBrData.MyRequests && myBrData.MyRequests.length) {
                for (var i = 0; i < myBrData.MyRequests.length; i++) {
                    if (myBrData.MyRequests[i].BudgetWorkflowStatus != 'NOT_SUBMITTED') {
                        mySubmittedCount += 1;
                    }
                }
            }
            if (mySubmittedCount == 1) {
                html += 'You have submitted ' + mySubmittedCount + ' request.';
            } else {
                html += 'You have submitted ' + mySubmittedCount + ' requests.';
            }

            //if (myBrData && myBrData.MyRequests && myBrData.MyRequests.length && (myBrData.MyRequests.length == 1)) {
            //    html += 'You have submitted ' + myBrData.MyRequests.length + ' request.';
            //} else {
            //    html += 'You have submitted ' + myBrData.MyRequests.length + ' requests.';
            //}

            html += '           </span>';

            html += '       </td>';
            html += '       <td style="width:2%;" class="bwHPNDrillDownLinkCell2"></td>';
            html += '   </tr>';

            html += '   <tr id="' + collapsibleRowId + '" style="display:none;">';
            html += '       <td style="vertical-align:top;">';
            html += '       </td>';
            html += '       <td colspan="2">';

            html += '           <table>';
            html += '               <tr>';

            html += '                   <td style="vertical-align:top;width:60px;">';



            html += '                       <table id="buttonDisplayRequestsAsDetailedList_MySubmittedRequests" class="divCarouselButton" style="width:70px;padding: 4px 4px 4px 4px !important;" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_MySubmittedRequests\');">'; //, \'MySubmittedRequests\', this);">';
            html += '                           <tr>';
            html += '                               <td style="white-space:nowrap;">';
            html += '                                   <div style="width: 100%; overflow: hidden;vertical-align:middle;">';
            html += '                                       <div class="divCarouselButton_SmallButton2" style="float:left;vertical-align:middle;"></div><div style="float:right;vertical-align:middle;margin:-4px;color:gray;">-----</div>';
            html += '                                   </div>';
            html += '                               </td>';
            html += '                           </tr>';
            html += '                           <tr>';
            html += '                               <td style="white-space:nowrap;">';
            html += '                                   <div style="width: 100%; overflow: hidden;vertical-align:middle;">';
            html += '                                       <div class="divCarouselButton_SmallButton2" style="float:left;vertical-align:middle;"></div><div style="float:right;vertical-align:middle;margin:-4px;color:gray;">-----</div>';
            html += '                                   </div>';
            html += '                               </td>';
            html += '                           </tr>';
            html += '                           <tr>';
            html += '                               <td style="white-space:nowrap;">';
            html += '                                   <div style="width: 100%; overflow: hidden;vertical-align:middle;">';
            html += '                                       <div class="divCarouselButton_SmallButton2" style="float:left;vertical-align:middle;"></div><div style="float:right;vertical-align:middle;margin:-4px;color:gray;">-----</div>';
            html += '                                   </div>';
            html += '                               </td>';
            html += '                           </tr>';
            html += '                       </table>';
            html += '                       <div style="height:5px;"></div>'; // Button spacer. <br /> is too much.
            html += '                       <table id="buttonDisplayRequestsAsTiles_MySubmittedRequests" class="divCarouselButton_Selected" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderExecutiveSummaries_MySubmittedRequests\');">'; //, \'MySubmittedRequests\', this);">';
            html += '                           <tr>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                           </tr>';
            html += '                           <tr>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                           </tr>';
            html += '                       </table>';
            html += '                   </td>';
            html += '                   <td style="vertical-align:top;">';

            html += '       <div id="divBwExecutiveSummariesCarousel_MySubmittedRequests" class="bwAccordionDrawer" bwaccordiondrawertype="MY_SUBMITTED_REQUESTS" ></div>'; // Display as the executive summary carousel.

            html += '       </td>';
            html += '   </tr>';
            html += '</table>';
            html += '   </td>';
            html += '</tr>';

            //
            // end: Fourth section, "My Requests" summary.
            //





























            //
            // Second row, "All Active Requests" summary.
            //
            var rowId = 'functionalAreaRow_' + deferredIndex.toString() + '_2';
            var imageId = 'alertSectionImage_' + deferredIndex.toString() + '_2';
            var collapsibleRowId = 'alertSectionRow_' + deferredIndex.toString() + '_2';

            html += '<tr id="' + rowId + '" class="bwFunctionalAreaRow bwNoUserSelect" >';
            if (brData && brData.PendingBudgetRequests && brData.PendingBudgetRequests.length) {
                if (brData.PendingBudgetRequests.length > 0) {
                    if (brData.PendingBudgetRequests.length == 1) {
                        html += '<td style="width:11px;vertical-align:top;" class="bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" ></td>';
                        html += '<td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" >';
                        html += '   <img title="expand" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="' + imageRootPath + '/images/drawer-open.png">';
                    } else {
                        html += '<td style="width:11px;vertical-align:top;" class="bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" ></td>';
                        html += '<td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" >';
                        html += '   <img title="expand" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;float:none;" src="' + imageRootPath + '/images/drawer-open.png">';
                    }
                } else {
                    html += '   <td style="width:11px;" class="bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" ></td>';
                    html += '   <td style="padding-left:60px;height:45px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');"  >';
                }
            } else {
                html += '   <td style="width:11px;" class="bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" ></td>';
                html += '   <td style="padding-left:60px;height:45px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');"  >';
            }
            html += '           <span class="bwNoUserSelect bwAccordionDrawerTitle"  >';
            if (brData && brData.PendingBudgetRequests && brData.PendingBudgetRequests.length) {
                if (brData.PendingBudgetRequests.length == 1) {
                    html += 'There is ' + brData.PendingBudgetRequests.length + ' active request.';
                } else {
                    html += 'There are ' + brData.PendingBudgetRequests.length + ' active requests.';
                }
            } else {
                html += 'There are ' + '0' + ' active requests.';
            }
            html += '           </span>';

            html += '       </td>';
            html += '       <td style="width:2%;" class="bwHPNDrillDownLinkCell2"></td>';
            html += '   </tr>';

            html += '   <tr id="' + collapsibleRowId + '" style="display:none;">';
            html += '       <td style="vertical-align:top;">';
            html += '       </td>';
            html += '       <td colspan="2">';

            html += '           <table>';
            html += '               <tr>';

            html += '                   <td style="vertical-align:top;width:60px;">';



            html += '                       <table id="buttonDisplayRequestsAsDetailedList_AllActiveRequests" class="divCarouselButton" style="width:70px;padding: 4px 4px 4px 4px !important;" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_AllActiveRequests\');">'; //, \'AllActiveRequests\', this);">';
            html += '                           <tr>';
            html += '                               <td style="white-space:nowrap;">';
            html += '                                   <div style="width: 100%; overflow: hidden;vertical-align:middle;">';
            html += '                                       <div class="divCarouselButton_SmallButton2" style="float:left;vertical-align:middle;"></div><div style="float:right;vertical-align:middle;margin:-4px;color:gray;">-----</div>';
            html += '                                   </div>';
            html += '                               </td>';
            html += '                           </tr>';
            html += '                           <tr>';
            html += '                               <td style="white-space:nowrap;">';
            html += '                                   <div style="width: 100%; overflow: hidden;vertical-align:middle;">';
            html += '                                       <div class="divCarouselButton_SmallButton2" style="float:left;vertical-align:middle;"></div><div style="float:right;vertical-align:middle;margin:-4px;color:gray;">-----</div>';
            html += '                                   </div>';
            html += '                               </td>';
            html += '                           </tr>';
            html += '                           <tr>';
            html += '                               <td style="white-space:nowrap;">';
            html += '                                   <div style="width: 100%; overflow: hidden;vertical-align:middle;">';
            html += '                                       <div class="divCarouselButton_SmallButton2" style="float:left;vertical-align:middle;"></div><div style="float:right;vertical-align:middle;margin:-4px;color:gray;">-----</div>';
            html += '                                   </div>';
            html += '                               </td>';
            html += '                           </tr>';
            html += '                       </table>';
            html += '                       <div style="height:5px;"></div>'; // Button spacer. <br /> is too much.
            html += '                       <table id="buttonDisplayRequestsAsTiles_AllActiveRequests" class="divCarouselButton_Selected" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderExecutiveSummaries_ACTIVE_REQUESTS\');">'; //, \'AllActiveRequests\', this);">';
            html += '                           <tr>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                           </tr>';
            html += '                           <tr>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                           </tr>';
            html += '                       </table>';
            html += '                   </td>';
            html += '                   <td style="vertical-align:top;">';

            html += '       <div id="divBwExecutiveSummariesCarousel_AllActiveRequests" class="bwAccordionDrawer" bwaccordiondrawertype="ACTIVE_REQUESTS" ></div>'; // Display as the executive summary carousel.

            html += '       </td>';
            html += '   </tr>';
            html += '</table>';
            html += '   </td>';
            html += '</tr>';
            //
            // end: Second row, "Active Requests" summary.
            //











































            ////
            //// Third row, "Unclaimed Invitations" summary.
            ////
            //if (invitationData && invitationData.length && (invitationData.length != 0)) { // Only display this section if there is more than 0 invitations. If there are none, don't even bother displaying.
            //    var rowId = 'functionalAreaRow_' + deferredIndex.toString() + '_3';
            //    var imageId = 'alertSectionImage_' + deferredIndex.toString() + '_3';
            //    var collapsibleRowId = 'alertSectionRow_' + deferredIndex.toString() + '_3';
            //    html += '<tr id="' + rowId + '" class="bwFunctionalAreaRow" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" >';
            //    if (invitationData.length > 0) {
            //        if (invitationData.length == 1) {
            //            html += '<td style="width:11px;vertical-align:top;"></td>';
            //            html += '<td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2">';
            //            html += '<img title="expand" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="' + imageRootPath + '/images/drawer-open.png">';
            //        } else {
            //            html += '<td style="width:11px;vertical-align:top;"></td><td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2">';
            //            html += '<img title="expand" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="' + imageRootPath + '/images/drawer-open.png">';
            //        }
            //    } else {
            //        html += '<td style="width:11px;"></td>';
            //        html += '<td style="padding-left:60px;height:45px;" class="bwHPNDrillDownLinkCell2">';
            //    }
            //    html += '       <span>';
            //    if (invitationData.length == 1) {
            //        html += 'There is ' + invitationData.length + ' unclaimed invitation.';
            //    } else if (invitationData.length > 0) {
            //        html += 'There are ' + invitationData.length + ' unclaimed invitations.';
            //    } else {
            //        html += 'There are ' + invitationData.length + ' unclaimed invitations. Dont display this...';
            //    }
            //    html += '       </span>';
            //    html += '   </td>';

            //    html += '<td class="bwHPNDrillDownLinkCell2"></td>';


            //    html += '</tr>';
            //    // Third row, "Unclaimed Invitations" details.
            //    html += '<tr id="' + collapsibleRowId + '" style="display:none;">';
            //    html += '<td></td>';
            //    html += '<td colspan="2"><table><tbody>';
            //    for (var i = 0; i < invitationData.length; i++) {
            //        html += '   <tr>';
            //        html += '       <td style="width:10px;"></td>';
            //        html += '       <td style="width:10px;"></td>';
            //        html += '            <td style="width:90px;"></td>';
            //        html += '            <td>&nbsp;&nbsp;</td>';
            //        var invitationChar = (globalUrlPrefix + globalUrl + '?invitation=' + invitationData[i].bwInvitationId).indexOf('=') + 1; // notifications[ntypeindex][2][pi][0].indexOf('=') + 1;
            //        var invitationGuid = (globalUrlPrefix + globalUrl + '?invitation=' + invitationData[i].bwInvitationId).substring(invitationChar);
            //        html += '            <td colspan="5" class="tdHomePageSubNotificationIos8"><div id="tdUnclaimedInvitationLinkSwipeEnabled' + i + '"><a style="cursor:pointer;" onclick="cmdViewInvitation(\'' + invitationGuid + '\');" target="_blank" title="Send this link in an email to invite someone to participate in this workflow. You will be notified when they have confirmed their participation.">' + globalUrlPrefix + globalUrl + '?invitation=' + invitationData[i].bwInvitationId + '</a></div></td>';
            //        html += '        </tr>';
            //    }
            //    html += '</tbody></table></td>';
            //    html += '</tr>';
            //}
            ////
            //// end: Third row, "Unclaimed Invitations" summary.
            ////








            //
            // Top row, "My Pending Tasks" summary.
            //
            var rowId = 'functionalAreaRow_' + deferredIndex.toString() + '_1';
            var imageId = 'alertSectionImage_' + deferredIndex.toString() + '_1';
            var collapsibleRowId = 'alertSectionRow_' + deferredIndex.toString() + '_1';

            html += '<tr id="' + rowId + '" class="bwFunctionalAreaRow bwNoUserSelect" >';
            if (taskData.length > 0) {
                if (taskData.length == 1) {
                    //html += '<td style="width:11px;vertical-align:top;" class="bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" ><img src="' + imageRootPath + '/images/red-dot.png" width="11" height="11" alt="" style="cursor:pointer;vertical-align:top;float:right;" /></td>';
                    //html += '<td style="width:11px;vertical-align:top;" class="bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" ></td>';
                    html += '<td colspan="2" style="padding-left:11px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" >';
                    html += '   <img title="expand" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="' + imageRootPath + '/images/drawer-open.png">';
                } else {
                    //html += '<td style="width:11px;vertical-align:top;" class="bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" ><img src="' + imageRootPath + '/images/red-dot.png" width="11" height="11" alt="" style="cursor:pointer;vertical-align:top;float:right;" /></td>';
                    //html += '<td style="width:11px;vertical-align:top;" class="bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" ></td>';
                    html += '<td colspan="2" style="padding-left:11px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" >';
                    html += '   <img title="expand" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;float:none;" src="' + imageRootPath + '/images/drawer-open.png">';
                }
            } else {
                //html += '   <td style="width:11px;" class="bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" ></td>';
                html += '   <td colspan="2" style="padding-left:60px;height:45px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'expandOrCollapseAlertsSection\', \'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');"  >';
            }
            html += '           <span class="bwNoUserSelect bwAccordionDrawerTitle"  >';
            if (taskData.length == 1) {
                html += 'You have ' + taskData.length + ' pending task. <img src="' + imageRootPath + '/images/red-dot.png" width="11" height="11" alt="" style="cursor:pointer;vertical-align:top;float:left;" />';
            } else {
                html += 'You have ' + taskData.length + ' pending tasks. <img src="' + imageRootPath + '/images/red-dot.png" width="11" height="11" alt="" style="cursor:pointer;vertical-align:top;float:left;" />';
            }
            html += '           </span>';

            html += '       </td>';
            html += '       <td style="width:2%;" class="bwHPNDrillDownLinkCell2">xcx4443-3</td>';
            html += '   </tr>';

            html += '   <tr id="' + collapsibleRowId + '" style="display:none;">';
            html += '       <td style="vertical-align:top;">';
            html += '       </td>';
            html += '       <td colspan="2">';

            html += '           <table>';
            html += '               <tr>';

            html += '                   <td style="vertical-align:top;width:60px;">';



            html += '                       <table id="buttonDisplayRequestsAsDetailedList_MyPendingTasks" class="divCarouselButton" style="width:70px;padding: 4px 4px 4px 4px !important;" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderDetailedList_MyPendingTasks\');">'; //, \'MyPendingTasks\', this);">';
            html += '                           <tr>';
            html += '                               <td style="white-space:nowrap;">';
            html += '                                   <div style="width: 100%; overflow: hidden;vertical-align:middle;">';
            html += '                                       <div class="divCarouselButton_SmallButton2" style="float:left;vertical-align:middle;"></div><div style="float:right;vertical-align:middle;margin:-4px;color:gray;">-----</div>';
            html += '                                   </div>';
            html += '                               </td>';
            html += '                           </tr>';
            html += '                           <tr>';
            html += '                               <td style="white-space:nowrap;">';
            html += '                                   <div style="width: 100%; overflow: hidden;vertical-align:middle;">';
            html += '                                       <div class="divCarouselButton_SmallButton2" style="float:left;vertical-align:middle;"></div><div style="float:right;vertical-align:middle;margin:-4px;color:gray;">-----</div>';
            html += '                                   </div>';
            html += '                               </td>';
            html += '                           </tr>';
            html += '                           <tr>';
            html += '                               <td style="white-space:nowrap;">';
            html += '                                   <div style="width: 100%; overflow: hidden;vertical-align:middle;">';
            html += '                                       <div class="divCarouselButton_SmallButton2" style="float:left;vertical-align:middle;"></div><div style="float:right;vertical-align:middle;margin:-4px;color:gray;">-----</div>';
            html += '                                   </div>';
            html += '                               </td>';
            html += '                           </tr>';
            html += '                       </table>';
            html += '                       <div style="height:5px;"></div>'; // Button spacer. <br /> is too much.
            html += '                       <table id="buttonDisplayRequestsAsTiles_MyPendingTasks" class="divCarouselButton_Selected" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderExecutiveSummaries_MyPendingTasks\');">'; //, \'MyPendingTasks\', this);">';
            html += '                           <tr>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                           </tr>';
            html += '                           <tr>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                               <td>';
            html += '                                   <div class="divCarouselButton_SmallButton"></div>';
            html += '                               </td>';
            html += '                           </tr>';
            html += '                       </table>';
            html += '                   </td>';



            html += '                   <td style="vertical-align:top;">';

            html += '       <div id="divBwExecutiveSummariesCarousel_MyPendingTasks" class="bwAccordionDrawer" bwaccordiondrawertype="MY_PENDING_TASKS" ></div>'; // Display as the executive summary carousel.

            html += '                   </td>';
            html += '               </tr>';
            html += '           </table>';
            html += '       </td>';
            html += '   </tr>';
            //
            // end: Top row, "My Tasks" details. // This one is the template for the rest of these sections. 4-6-2022.
            //





            //
            // Render all but the Fifth section.
            //
            var unitTable1 = '';
            unitTable1 += '<div id="BWFunctionalAreaDiv' + deferredIndex.toString() + '" style="cursor:pointer;" >';
            unitTable1 += '<table id="BWFunctionalArea' + deferredIndex.toString() + '" style="vertical-align:top;width:100%;">';
            unitTable1 += html;
            unitTable1 += '</tbody></table>';
            unitTable1 += '</div>';




            var result = {
                html: unitTable1
            }
            return result;

            //} catch (e) {
            //    console.log('Exception in generateHomePageNotificationScreenHtml():1335-1: ' + e.message + ', ' + e.stack);
            //    displayAlertDialog('Exception in generateHomePageNotificationScreenHtml():1335-1: ' + e.message + ', ' + e.stack);
            //    var result = {
            //        html: 'Exception in generateHomePageNotificationScreenHtml():1335-1: ' + e.message + ', ' + e.stack
            //    }
            //    return result;
            //}
        } catch (e) {
            console.log('Exception in bwCommonScripts.js.generateHomePageNotificationScreenHtml3():1335-1: ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwCommonScripts.js.generateHomePageNotificationScreenHtml3():1335-1: ' + e.message + ', ' + e.stack);
            var result = {
                html: 'Exception in bwCommonScripts.js.generateHomePageNotificationScreenHtml3():1335-1: ' + e.message + ', ' + e.stack
            }
            return result;
        }
    };

    exports.getEmailDataItemTemplateSample = function (template) {
        return new Promise(function (resolve, reject) {
            try {
                if (!template) {

                    var msg = 'In bwCommonScripts.createEmailFromTemplate(). template value does not exist.';
                    console.log(msg);

                    var result = {
                        message: msg,
                        Template: msg
                    }
                    resolve(result);

                } else {

                    var dataConversionJson = bwCommonScripts.getEmailTemplateConversionJson(); // Initialize the collection.


                    var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
                    var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
                    var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');
                    var bwWorkflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');


                    var queryData = {
                        bwWorkflowAppId: bwWorkflowAppId,
                        bwParticipantId: participantId,
                        bwParticipantEmail: participantEmail
                    };


                    var msg = 'Calling generateHomePageNotificationScreen(). queryData: ' + JSON.stringify(queryData);
                    console.log(msg);



                    var promise = $('.bwAuthentication').bwAuthentication('generateHomePageNotificationScreen', 1, queryData); // This calls bwCommonScripts.generateHomePageNotificationScreenHtml() eventually... // var func =
                    promise.then(function (result) {
                        try {

                            displayAlertDialog('xcx233213123. ' + JSON.stringify(result));


                            dataConversionJson.TaskSummarySection.Html = result.html.html; //.html; //'[TaskSummarySection]';


                            dataConversionJson.QtyOfBudgetRequestsWithTasks.Html = '1'; //bwParticipant.bwBudgetRequests.length;

                            dataConversionJson.QtyOfAssignedTasks.Html = '1'; // Need to work on this placeholder.

                            dataConversionJson.CompanyLogo.Html = '[CompanyLogo]'; // Need to work on this placeholder.


                            dataConversionJson.ParticipantFriendlyName.Html = participantFriendlyName; //bwParticipant.bwAssignedToFriendlyName;


                            dataConversionJson.ParticipantEmail.Html = participantEmail; //bwParticipant.bwAssignedToEmail;

                            var emailLink = '';
                            emailLink += '<a href="' + globalUrlPrefix + globalUrl + + '/index.html?request=' + '' + '">Click here to view the Budget Request "' + 'Test Budget Request 1' + '"</a>';
                            emailLink += '<br />';
                            dataConversionJson.BudgetRequestLink.Html = emailLink; //'xcxasdffgasdgsd'; //emailLink; //'[BudgetRequestLink]'; // // Need to work on this placeholder.

                            dataConversionJson.ConfigureEmailSettingsLink.Html = '[ConfigureEmailSettingsLink]'; // Need to work on this placeholder.
                            dataConversionJson.DisclaimerLegalText.Html = 'xcxasdffgasdgsd'; //''; // removed 4-4-2022 '[DisclaimerLegalText xcx1]'; // Need to work on this placeholder.


                            var unsubscribeUrl = globalUrlPrefix + globalUrl + '/index.html?unsubscribe=' + participantId;
                            var unsubscribeMessage = '<a href="' + unsubscribeUrl + '">If you wish to stop receiving these emails please click here to unsubscribe.</a>';
                            dataConversionJson.UnsubscribeLink.Html = unsubscribeMessage; //unsubscribeMessage; //'[UnsubscribeLink]'; // Need to work on this placeholder.

                            //dataConversionJson.BudgetRequestNumber.Html = '[BudgetRequestNumber]'; // Need to work on this placeholder.

                            dataConversionJson.BudgetRequestTitle.Html = '[BudgetRequestTitle]'; // Need to work on this placeholder.

                            dataConversionJson.BudgetRequestProjectTitle.Html = '[BudgetRequestProjectTitle]'; // Need to work on this placeholder.

                            dataConversionJson.NextAssignmentText.Html = '[NextAssignmentText]'; // Need to work on this placeholder.

                            dataConversionJson.RoleAbbreviation.Html = '[RoleAbbreviation]'; // Need to work on this placeholder.

                            dataConversionJson.RoleName.Html = '[RoleName]'; // Need to work on this placeholder.

                            var orgName = $('.bwAuthentication').bwAuthentication('option', 'SelectedOrganization')["OrganizationTitle"];
                            dataConversionJson.OrganizationName.Html = orgName + ' [' + bwWorkflowAppId + ']';

                            dataConversionJson.AttachmentAndInventoryImages.Html = '[AttachmentAndInventoryImages]';

                            var signInLink = ''; //'[SignInLink xcx34252565474876-3]';
                            signInLink += '<div class="x_brushedAluminum x_leftButton" style="width:140px; text-align:center; font-weight:bold; border:1px solid skyblue; color:white; padding:15px 15px 15px 15px;">';
                            signInLink += ' <a href="https://budgetworkflow.com">Sign In</a>                                ';
                            signInLink += '</div> ';
                            dataConversionJson.SignInLink.Html = signInLink; // added 4-5-2022
                            //dataConversionJson.SignInLink.Html = '[SignInLink xcx34252565474876-1]'; // added 4-5-2022

                            var keys = Object.keys(dataConversionJson);
                            for (var i = 0; i < keys.length; i++) {
                                try {
                                    template = template.replace(dataConversionJson[keys[i]].TemplateText, dataConversionJson[keys[i]].Html);
                                } catch (e) { }
                            }

                            var result = {
                                message: 'SUCCESS',
                                Template: template
                            }
                            resolve(result);

                        } catch (e) {

                            console.log('Exception in createEmailFromTemplate():3: ' + e.message + ', ' + e.stack);
                            var msg = 'Exception in createEmailFromTemplate():3: ' + e.message + ', ' + e.stack;
                            var result = {
                                message: msg,
                                Template: msg
                            }
                            resolve(result);

                        }
                    }).catch(function (e) {

                        console.log('Exception in createEmailFromTemplate():4: ' + JSON.stringify(e));
                        var msg = 'Exception in createEmailFromTemplate():4: ' + JSON.stringify(e);
                        var result = {
                            message: msg,
                            Template: msg
                        }
                        resolve(result);

                    });
                }

            } catch (e) {

                console.log('Exception in createEmailFromTemplate(): ' + e.message + ', ' + e.stack);
                var msg = 'Exception in createEmailFromTemplate(): ' + e.message + ', ' + e.stack;
                var result = {
                    message: msg,
                    Template: msg
                }
                resolve(result);

            }
        })
    };

    // This function generates the home page notification screen, and also generates the content for overdue emails.
    exports.generateHomePageNotificationScreenHtml = function (deferredIndex, appweburl, bwWorkflowAppId, invitationData, taskData, tenantData, participantsData, brData, myBrData, serverside) { //, taskData, brData, myBrData, invitationData) {
        try {
            console.log('In sharedclientandserverscripts.bwCommonScripts.js.generateHomePageNotificationScreenHtml().');

            alert('In bwCommonScripts.js.generateHomePageNotificationScreenHtml().');

            exports.bwWorkflowAppId = bwWorkflowAppId;

            //exports.invitationData = invitationData; // removed 8-18-2023.
            exports.taskData = taskData;
            exports.participantsData = participantsData;
            exports.brData = brData;
            exports.myBrData = myBrData;

            if (document && document.title) {
                // Change the page title to indicate the # of tasks. This will show up in the browser tab and is a cool way to show the user they have alerts.
                if (taskData.length > 0) {
                    if (myBrData && myBrData.MyRequests && myBrData.MyRequests.length & myBrData.MyRequests.length > 0) {
                        document.title = myBrData.MyRequests[0].OrgName + ' (' + taskData.length + ')';
                    } else {
                        //document.title = 'Budget items (' + taskData.length + ')';
                        document.title = taskData.length + ' budget items';
                    }

                    // Change the css to red/orange.
                    //swapStyleSheet("css/bw.core.colors.red.orange.css");
                    // Change the currency indicator to the one with the red dot. This obviously depends upon consistent naming!
                    //renderFavicon(true);
                } else {
                    document.title = 'No pending tasks'; // 4-18-2022 changed from 'No budget items'; //'My Budgetsxcx2';
                    // Change the css to blue/blue.
                    //swapStyleSheet("css/bw.core.colors.blue.blue.css");
                    // Change the currency indicator to the one without the red dot. This obviously depends upon consistent naming!
                    //renderFavicon(false);
                }
            }

            var html = '';

            //
            // Display the pending tasks.
            //
            if (taskData.length == 0 && brData.PendingBudgetRequests.length == 0 && brData.PendingPOBudgetRequests.length == 0) {
                html += 'You have no pending tasks, and there are no pending budget requests.';
            }
            //alert('serverside: ' + serverside);
            if (serverside && serverside == true) {
                html += '<table id="tblHomePageAlertSectionForWorkflow' + deferredIndex.toString() + '" style="cursor:default;opacity:0.5;" >'; // Makes the email/serverside rendering have an opacity setting.
            } else {
                html += '<table id="tblHomePageAlertSectionForWorkflow' + deferredIndex.toString() + '" style="cursor:default;" >';
            }
            html += '<tbody>';


            //
            // Top row, "My Tasks" summary.
            //
            var rowId = 'functionalAreaRow_' + deferredIndex.toString() + '_1';
            var imageId = 'alertSectionImage_' + deferredIndex.toString() + '_1';
            var collapsibleRowId = 'alertSectionRow_' + deferredIndex.toString() + '_1';




            html += '<tr id="' + rowId + '" class="bwFunctionalAreaRow bwNoUserSelect" >';
            if (taskData.length > 0) {
                if (taskData.length == 1) {
                    html += '<td style="width:11px;vertical-align:top;" class="bwNoUserSelect" onclick="expandOrCollapseAlertsSection(\'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" ><img src="' + imageRootPath + '/images/red-dot.png" width="11" height="11" alt="" style="cursor:pointer;vertical-align:top;" /></td>';
                    html += '<td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="expandOrCollapseAlertsSection(\'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" >';
                    html += '   <img title="collapse" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="' + imageRootPath + '/images/drawer-close.png">';
                    //html += '</td>';
                } else {
                    html += '<td style="width:11px;vertical-align:top;" class="bwNoUserSelect" onclick="expandOrCollapseAlertsSection(\'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" ><img src="' + imageRootPath + '/images/red-dot.png" width="11" height="11" alt="" style="cursor:pointer;vertical-align:top;" /></td>';
                    html += '<td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="expandOrCollapseAlertsSection(\'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" >';
                    html += '   <img title="collapse" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;float:none;" src="' + imageRootPath + '/images/drawer-close.png">';
                    //html += '</td>';
                }
            } else {
                html += '<td style="width:11px;" class="bwNoUserSelect" onclick="expandOrCollapseAlertsSection(\'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" ></td>';
                html += '<td style="padding-left:60px;height:45px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="expandOrCollapseAlertsSection(\'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');"  >';
            }

            html += '       <span class="bwNoUserSelect"  >';
            if (taskData.length == 1) {
                html += 'You have ' + taskData.length + ' pending task.';
            } else {
                html += 'You have ' + taskData.length + ' pending tasks.';
            }
            html += '       </span>';

            html += '   </td>';




            html += '<td style="width:2%;" class="bwHPNDrillDownLinkCell2">';
            html += '   <div style="float:right;padding-top:10px;">';// The new Expand/Collapse button for the executive summaries and image display. 10-15-2020.

            html += '       <span id="spanExpandOrCollapseRightSliderPaneButton" style="cursor:pointer;" onclick="bwCommonScripts.expandOrCollapseExecutiveSummaries();">';
            html += '           <span title="View executive summaries..." style="width:200px;padding:5px 10px 5px 10px;margin:0 0 0 20px;white-space:nowrap;vertical-align:top;border:1px solid lightblue;cursor:pointer;font-weight:normal;font-size:20pt;">';
            html += '               <span style="display:inline-block;">+/- Executive Summaries</span>';
            html += '           </span>';
            html += '           <span id="divEmailEditorHorizontalSliderPane" style="width:200px;display:inline;"></span>';
            html += '       </span>';
            html += '   </div>';
            html += '   </td>';


            html += '</tr>';


            // Top row, "My Tasks" details.
            html += '<tr id="' + collapsibleRowId + '" style="display:table-row;">';
            html += '   <td></td>';
            html += '   <td colspan="2"><table><tbody>';
            for (var i = 0; i < taskData.length; i++) {

                //debugger; // 12-23-2021 bwWorkflowTaskItemId xcx4

                var bwWorkflowTaskItemId = taskData[i].bwWorkflowTaskItemId; // added 12-23-2021

                var taskTitle = taskData[i].bwTaskTitle;
                var appWebUrl = appweburl;
                var budgetRequestId = taskData[i].bwRelatedItemId;
                var arName = taskData[i].Title; // DUPLICATE
                var brTitle = taskData[i].ProjectTitle;
                var title = taskData[i].Title;
                var budgetAmount = taskData[i].BudgetAmount;
                var requestedCapital = taskData[i].RequestedCapital;
                var requestedExpense = taskData[i].RequestedExpense;
                var taskType = taskData[i].TaskType;
                var bwAssignedToRaciRoleAbbreviation = taskData[i].bwAssignedToRaciRoleAbbreviation;
                var bwAssignedToRaciRoleName = taskData[i].bwAssignedToRaciRoleName;
                var orgId = taskData[i].OrgId;
                var orgName = taskData[i].OrgName;
                var currentAmount = 0;
                if (budgetAmount == 'null') {
                    currentAmount = Number(requestedCapital) + Number(requestedExpense);
                } else {
                    currentAmount = budgetAmount;
                }


                var daysSinceTaskCreated = 0;
                //try {

                // 2-15-2022 THIS WORKS WOOP! How did it ever work before using bwDueDate??????????????????????????????????????????????
                if (taskData[i].Created) {
                    var cd = taskData[i].Created;
                    var year = cd.split('-')[0];
                    var month = cd.split('-')[1];
                    var day = cd.split('-')[2].split('T')[0];
                    var taskCreatedDate = new Date(Number(year), Number(month) - 1, Number(day) - 1); // +1 because we're using overdue date.
                    var todaysDate = new Date();
                    var utc1 = Date.UTC(taskCreatedDate.getFullYear(), taskCreatedDate.getMonth(), taskCreatedDate.getDate());
                    var utc2 = Date.UTC(todaysDate.getFullYear(), todaysDate.getMonth(), todaysDate.getDate());
                    var _MS_PER_DAY = 1000 * 60 * 60 * 24;
                    daysSinceTaskCreated = Math.floor((utc2 - utc1) / _MS_PER_DAY);
                } else {
                    daysSinceTaskCreated = '[error xcx232135-1-1]';
                }

                //var cd = taskData[i].bwDueDate;
                //var year = cd.split('-')[0];
                //var month = cd.split('-')[1];
                //var day = cd.split('-')[2].split('T')[0];
                //var taskCreatedDate = new Date(Number(year), Number(month) - 1, Number(day) - 1); // +1 because we're using overdue date.
                //var todaysDate = new Date();
                //var utc1 = Date.UTC(taskCreatedDate.getFullYear(), taskCreatedDate.getMonth(), taskCreatedDate.getDate());
                //var utc2 = Date.UTC(todaysDate.getFullYear(), todaysDate.getMonth(), todaysDate.getDate());
                //var _MS_PER_DAY = 1000 * 60 * 60 * 24;
                //daysSinceTaskCreated = Math.floor((utc2 - utc1) / _MS_PER_DAY);


                // 2-15-2022
                //var cd = taskData[i].bwDueDate;
                //displayAlertDialog('taskData: ' + JSON.stringify(taskData[i]));



                //} catch (e) {
                //    // TODD: THIS NEEDS TO BE REEXAMINED, we are catching this error when the new recurring tasks came into play! //thisMustBeADifferentKindOfTask = true;
                //}



                html += '   <tr>';
                html += '       <td style="width:10px;"></td>';
                html += '       <td style="width:10px;"></td>';
                var functionalAreaId = taskData[i].FinancialAreaId; // Find the functional area name.
                var functionalAreaName = '';
                try {
                    if (BWMData[0]) {
                        for (var x = 0; x < BWMData[0].length; x++) {
                            if (BWMData[0][x][0] = bwWorkflowAppId) { // We have the correct workflow!
                                for (var fai = 0; fai < BWMData[0][x][4].length; fai++) {
                                    if (functionalAreaId == BWMData[0][x][4][fai][0]) {
                                        functionalAreaName = BWMData[0][x][4][fai][1];
                                    }
                                }
                            }
                        }
                    }
                } catch (e) { }
                if (taskType == 'RECURRING_EXPENSE_NOTIFICATION_TASK') {
                    html += '   <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;" colspan="5">';
                    html += '       <div style="display:inline-block;">';
                    html += '           <a style="cursor:pointer;" onclick="displayRecurringExpenseOnTheHomePage(\'' + budgetRequestId + '\', \'' + participantId + '\', \'' + title + '\');" target="_blank" title="Click to view the recurring expense...">' + daysSinceTaskCreated.toString() + ' days overduexcx1: Recurring expense <em>(' + brTitle + ' - ' + functionalAreaName + ') is due to be submitted</em></a>';
                    html += '       </div>';
                    html += '   </td>';
                } else if (taskType == 'BUDGET_REQUEST_WORKFLOW_TASK') {
                    html += '<td style="width:45px;"></td>';
                    html += '    <td style="background-color:white;" ';
                    html += 'onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'' + title + '\', \'' + brTitle + '\', \'' + '' + '\', \'' + bwWorkflowAppId + '\', \'' + budgetRequestId + '\', \'' + orgId + '\', \'' + orgName + '\', this);" ';
                    html += 'onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');" ';
                    html += '>';
                    html += '       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="' + imageRootPath + '/images/zoom.jpg" />';
                    html += '    </td>';
                    html += '<td colspan="3" style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" ';
                    html += 'onmouseenter="this.style.backgroundColor=\'lightgoldenrodyellow\';bwCommonScripts.highlightExecutiveSummaryForRequest(\'' + budgetRequestId + '\');" ';
                    html += 'onmouseleave="this.style.backgroundColor=\'#d8d8d8\';bwCommonScripts.unHighlightExecutiveSummaryForRequest(\'' + budgetRequestId + '\');"  ';
                    html += 'onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'' + appWebUrl + '\', \'' + budgetRequestId + '\', \'' + arName + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\', \'' + bwAssignedToRaciRoleAbbreviation + '\', \'' + bwWorkflowTaskItemId + '\');" ';
                    html += '>';
                    html += '       <div style="display:inline-block;" bwtrace="xcx778451">';
                    if (daysSinceTaskCreated == 1) {
                        html += '       &nbsp;&nbsp;' + daysSinceTaskCreated.toString() + ' day overduexcx1: ';
                    } else {
                        html += '       &nbsp;&nbsp;' + daysSinceTaskCreated.toString() + ' days overduexcx2: ';
                    }
                    html += '       <em>';
                    html += title + ' - ' + brTitle + ' - ' + formatCurrency(currentAmount) + ' - ' + functionalAreaName + ' ' + '[(' + bwAssignedToRaciRoleAbbreviation + ') ' + bwAssignedToRaciRoleName + ']';
                    html += '       </em>';
                    html += '       </div>';
                    html += '</td>';
                } else {
                    html += '            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;" colspan="5">UNKNOWN TASK TYPE</td>';
                }
                html += '</tr>';
            }
            html += '</tbody></table></td>';
            html += '</tr>';



            //
            // Second row, "Active Requests" summary.
            //
            var rowId = 'functionalAreaRow_' + deferredIndex.toString() + '_2';
            var imageId = 'alertSectionImage_' + deferredIndex.toString() + '_2';
            var collapsibleRowId = 'alertSectionRow_' + deferredIndex.toString() + '_2';
            html += '<tr style="white-space:nowrap;" id="' + rowId + '" class="bwFunctionalAreaRow bwNoUserSelect" onclick="expandOrCollapseAlertsSection(\'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" >';
            if (brData && brData.PendingBudgetRequests && brData.PendingBudgetRequests.length > 0) {
                if (brData.PendingBudgetRequests.length == 1) {
                    html += '<td style="width:11px;vertical-align:top;" class="bwNoUserSelect" onclick="expandOrCollapseAlertsSection(\'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');"></td>';
                    html += '<td style="padding-left:11px;white-space:nowrap;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="expandOrCollapseAlertsSection(\'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');">';
                    html += '<img title="expand" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="' + imageRootPath + '/images/drawer-open.png">';
                } else {
                    html += '<td style="width:11px;vertical-align:top;white-space:nowrap;" class="bwNoUserSelect" onclick="expandOrCollapseAlertsSection(\'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');"></td><td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="expandOrCollapseAlertsSection(\'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');">';
                    html += '<img title="expand" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="' + imageRootPath + '/images/drawer-open.png">';
                }
            } else {
                html += '<td style="width:11px;" class="bwNoUserSelect" onclick="expandOrCollapseAlertsSection(\'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');"></td>';
                html += '<td style="padding-left:60px;height:45px;white-space:nowrap;" class="bwHPNDrillDownLinkCell2 bwNoUserSelect" onclick="expandOrCollapseAlertsSection(\'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');">';
            }
            html += '       <span class="bwNoUserSelect" onclick="expandOrCollapseAlertsSection(\'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');">';
            if (brData && brData.PendingBudgetRequests && brData.PendingBudgetRequests.length == 1) {
                html += 'There is ' + brData.PendingBudgetRequests.length + ' budget request going through the approval process.';
            } else {
                if (brData && brData.PendingBudgetRequests && brData.PendingBudgetRequests.length) {
                    html += 'There are ' + brData.PendingBudgetRequests.length + ' budget requests going through the approval process.';
                } else {
                    html += 'There are ' + '0' + ' budget requests going through the approval process.';
                }
            }
            html += '       </span>';
            html += '   </td>';


            html += '<td class="bwHPNDrillDownLinkCell2"></td>';


            html += '</tr>';


            // Second row, "Active Requests" details.
            html += '<tr id="' + collapsibleRowId + '" style="display:none;">';
            html += '<td></td>';
            html += '<td colspan="2"><table><tbody>';
            if (brData && brData.PendingBudgetRequests && brData.PendingBudgetRequests.length) {
                for (var i = 0; i < brData.PendingBudgetRequests.length; i++) {
                    var appWebUrl = appweburl;
                    var budgetRequestId = brData.PendingBudgetRequests[i].bwBudgetRequestId;
                    var projectTitle = brData.PendingBudgetRequests[i].ProjectTitle;
                    var title = brData.PendingBudgetRequests[i].Title;
                    var budgetAmount = brData.PendingBudgetRequests[i].BudgetAmount;
                    var requestedCapital = brData.PendingBudgetRequests[i].RequestedCapital;
                    var requestedExpense = brData.PendingBudgetRequests[i].RequestedExpense;
                    var currentAmount = 0;
                    if (budgetAmount == 'null') {
                        currentAmount = Number(requestedCapital) + Number(requestedExpense);
                    } else {
                        currentAmount = budgetAmount;
                    }
                    html += '   <tr>';
                    html += '       <td style="width:10px;"></td>';
                    html += '       <td style="width:10px;"></td>';
                    var functionalAreaId = brData.PendingBudgetRequests[i].FinancialAreaId; // Find the functional area name.
                    var functionalAreaName = '';
                    try {
                        if (BWMData[0]) {
                            for (var x = 0; x < BWMData[0].length; x++) {
                                if (BWMData[0][x][0] = bwWorkflowAppId) { // We have the correct workflow!
                                    for (var fai = 0; fai < BWMData[0][x][4].length; fai++) {
                                        if (functionalAreaId == BWMData[0][x][4][fai][0]) {
                                            functionalAreaName = BWMData[0][x][4][fai][1];
                                        }
                                    }
                                }
                            }
                        }
                    } catch (e) { }
                    if (currentAmount == 0) {
                        html += '<td style="width:45px;"></td>';
                        html += '    <td style="background-color:white;" ';
                        html += 'onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'' + title + '\', \'' + projectTitle + '\', \'' + '' + '\', \'' + bwWorkflowAppId + '\', \'' + budgetRequestId + '\', \'' + orgId + '\', \'' + orgName + '\', this);" ';
                        html += 'onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');" ';
                        html += '>';
                        html += '       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="' + imageRootPath + '/images/zoom.jpg" />';
                        html += '    </td>';

                        html += '            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="4" xcx="xcx33999945-4" ';
                        html += 'onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + appWebUrl + '\', \'' + budgetRequestId + '\', \'' + title + '\', \'' + encodeHtmlAttribute(projectTitle) + '\', \'' + title + '\', \'' + '' + '\', \'' + bwWorkflowTaskItemId + '\');" target="_blank" >';
                        html += '' + title + ': <em>' + projectTitle + ' - ' + 'no budget assigned' + ' - ' + functionalAreaName + '</em>';
                        html += '</td>';
                    } else {
                        html += '<td style="width:45px;"></td>';
                        html += '    <td style="background-color:white;" ';
                        html += 'onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'' + title + '\', \'' + projectTitle + '\', \'' + '' + '\', \'' + bwWorkflowAppId + '\', \'' + budgetRequestId + '\', \'' + orgId + '\', \'' + orgName + '\', this);" ';
                        html += 'onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');" ';
                        html += '>';
                        html += '       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="' + imageRootPath + '/images/zoom.jpg" />';
                        html += '    </td>';

                        html += '            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="4" xcx="xcx33999945-5" ';
                        html += 'onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'' + appWebUrl + '\', \'' + budgetRequestId + '\', \'' + title + '\', \'' + encodeHtmlAttribute(projectTitle) + '\', \'' + title + '\', \'' + '' + '\', \'' + bwWorkflowTaskItemId + '\');" target="_blank" >' + title + ': <em>' + projectTitle + ' - ' + formatCurrency(currentAmount) + ' - ' + functionalAreaName + ' - waiting for ' + participantFriendlyName + '(' + 'participantEmailAddress xcx342' + ')' + ' to complete their task.' + '</em></td>';
                        html += '            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="4" xcx="xcx33999945-6" >';
                        html += '' + title + ': <em>' + projectTitle + ' - ' + 'no budget assigned' + ' - ' + functionalAreaName + '</em>';
                        html += '</td>';
                    }
                    html += '</tr>';
                }
            }
            html += '</tbody></table></td>';
            html += '</tr>';


            ////
            //// Third row, "Unclaimed Invitations" summary.
            ////
            //if (invitationData.length != 0) { // Only display this section if there is more than 0 invitations. If there are none, don't even bother displaying.
            //    var rowId = 'functionalAreaRow_' + deferredIndex.toString() + '_3';
            //    var imageId = 'alertSectionImage_' + deferredIndex.toString() + '_3';
            //    var collapsibleRowId = 'alertSectionRow_' + deferredIndex.toString() + '_3';
            //    html += '<tr id="' + rowId + '" class="bwFunctionalAreaRow" onclick="expandOrCollapseAlertsSection(\'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" >';
            //    if (invitationData.length > 0) {
            //        if (invitationData.length == 1) {
            //            html += '<td style="width:11px;vertical-align:top;"></td>';
            //            html += '<td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2">';
            //            html += '<img title="expand" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="' + imageRootPath + '/images/drawer-open.png">';
            //        } else {
            //            html += '<td style="width:11px;vertical-align:top;"></td><td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2">';
            //            html += '<img title="expand" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="' + imageRootPath + '/images/drawer-open.png">';
            //        }
            //    } else {
            //        html += '<td style="width:11px;"></td>';
            //        html += '<td style="padding-left:60px;height:45px;" class="bwHPNDrillDownLinkCell2">';
            //    }
            //    html += '       <span>';
            //    if (invitationData.length == 1) {
            //        html += 'There is ' + invitationData.length + ' unclaimed invitation.';
            //    } else if (invitationData.length > 0) {
            //        html += 'There are ' + invitationData.length + ' unclaimed invitations.';
            //    } else {
            //        html += 'There are ' + invitationData.length + ' unclaimed invitations. Dont display this...';
            //    }
            //    html += '       </span>';
            //    html += '   </td>';

            //    html += '<td class="bwHPNDrillDownLinkCell2"></td>';


            //    html += '</tr>';
            //    // Third row, "Unclaimed Invitations" details.
            //    html += '<tr id="' + collapsibleRowId + '" style="display:none;">';
            //    html += '<td></td>';
            //    html += '<td colspan="2"><table><tbody>';
            //    for (var i = 0; i < invitationData.length; i++) {
            //        html += '   <tr>';
            //        html += '       <td style="width:10px;"></td>';
            //        html += '       <td style="width:10px;"></td>';
            //        html += '            <td style="width:90px;"></td>';
            //        html += '            <td>&nbsp;&nbsp;</td>';
            //        var invitationChar = (globalUrlPrefix + globalUrl + '?invitation=' + invitationData[i].bwInvitationId).indexOf('=') + 1; // notifications[ntypeindex][2][pi][0].indexOf('=') + 1;
            //        var invitationGuid = (globalUrlPrefix + globalUrl + '?invitation=' + invitationData[i].bwInvitationId).substring(invitationChar);
            //        html += '            <td colspan="5" class="tdHomePageSubNotificationIos8"><div id="tdUnclaimedInvitationLinkSwipeEnabled' + i + '"><a style="cursor:pointer;" onclick="cmdViewInvitation(\'' + invitationGuid + '\');" target="_blank" title="Send this link in an email to invite someone to participate in this workflow. You will be notified when they have confirmed their participation.">' + globalUrlPrefix + globalUrl + '?invitation=' + invitationData[i].bwInvitationId + '</a></div></td>';
            //        html += '        </tr>';
            //    }
            //    html += '</tbody></table></td>';
            //    html += '</tr>';
            //}

            //
            // Fourth section, "My Requests" summary.
            //
            var rowId = 'functionalAreaRow_' + deferredIndex.toString() + '_4';
            var imageId = 'alertSectionImage_' + deferredIndex.toString() + '_4';
            var collapsibleRowId = 'alertSectionRow_' + deferredIndex.toString() + '_4';
            html += '<tr id="' + rowId + '" class="bwFunctionalAreaRow" onclick="expandOrCollapseAlertsSection(\'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" >';
            if (myBrData && myBrData.MyRequests && myBrData.MyRequests.length) {
                if (myBrData.MyRequests.length > 0) {
                    if (myBrData.MyRequests.length == 1) {
                        html += '<td style="width:11px;vertical-align:top;"></td>';
                        html += '<td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2">';
                        html += '<img title="collapse" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="' + imageRootPath + '/images/drawer-open.png">';
                    } else {
                        html += '<td style="width:11px;vertical-align:top;"></td>';
                        html += '<td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2">';
                        html += '<img title="collapse" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="' + imageRootPath + '/images/drawer-open.png">';
                    }
                } else {
                    html += '<td style="width:11px;"></td>';
                    html += '<td style="padding-left:60px;height:45px;" class="bwHPNDrillDownLinkCell2">';
                }
            }
            html += '       <span>';
            if (myBrData && myBrData.MyRequests && myBrData.MyRequests.length) {
                if (myBrData.MyRequests.length == 1) {
                    html += 'You have submitted ' + myBrData.MyRequests.length + ' request.';
                } else {
                    html += 'You have submitted ' + myBrData.MyRequests.length + ' requests.';
                }
            } else {
                html += 'You have submitted ' + '0' + ' requests.';
            }
            html += '       </span>';
            html += '   </td>';

            html += '<td class="bwHPNDrillDownLinkCell2"></td>';

            html += '</tr>';


            // Fourth section, "My Requests" details.
            html += '<tr id="' + collapsibleRowId + '" style="display:none;">';
            html += '   <td></td>';
            html += '   <td colspan="2"><table><tbody>';
            if (myBrData && myBrData.MyRequests && myBrData.MyRequests.length) {
                for (var i = 0; i < myBrData.MyRequests.length; i++) {
                    var taskTitle = myBrData.MyRequests[i].bwTaskTitle;
                    var appWebUrl = appweburl;
                    var budgetRequestId = myBrData.MyRequests[i].bwBudgetRequestId;
                    var arName = myBrData.MyRequests[i].Title; // DUPLICATE
                    var brTitle = myBrData.MyRequests[i].ProjectTitle;
                    var title = myBrData.MyRequests[i].Title;
                    var budgetAmount = myBrData.MyRequests[i].BudgetAmount;
                    var requestedCapital = myBrData.MyRequests[i].RequestedCapital;
                    var requestedExpense = myBrData.MyRequests[i].RequestedExpense;
                    var taskType = myBrData.MyRequests[i].TaskType;
                    var bwAssignedToRaciRoleAbbreviation = myBrData.MyRequests[i].bwAssignedToRaciRoleAbbreviation;
                    var bwAssignedToRaciRoleName = myBrData.MyRequests[i].bwAssignedToRaciRoleName;
                    var orgId = myBrData.MyRequests[i].OrgId;
                    var orgName = myBrData.MyRequests[i].OrgName;
                    var currentAmount = 0;
                    if (budgetAmount == 'null') {
                        currentAmount = Number(requestedCapital) + Number(requestedExpense);
                    } else {
                        currentAmount = budgetAmount;
                    }
                    var daysSinceTaskCreated = 0;
                    try {
                        var cd = myBrData.MyRequests[i].bwDueDate;
                        var year = cd.split('-')[0];
                        var month = cd.split('-')[1];
                        var day = cd.split('-')[2].split('T')[0];
                        var taskCreatedDate = new Date(Number(year), Number(month) - 1, Number(day) - 1); // +1 because we're using overdue date.
                        var todaysDate = new Date();
                        var utc1 = Date.UTC(taskCreatedDate.getFullYear(), taskCreatedDate.getMonth(), taskCreatedDate.getDate());
                        var utc2 = Date.UTC(todaysDate.getFullYear(), todaysDate.getMonth(), todaysDate.getDate());
                        var _MS_PER_DAY = 1000 * 60 * 60 * 24;
                        daysSinceTaskCreated = Math.floor((utc2 - utc1) / _MS_PER_DAY);
                    } catch (e) {
                        // TODD: THIS NEEDS TO BE REEXAMINED, we are catching this error when the new recurring tasks came into play! //thisMustBeADifferentKindOfTask = true;
                    }
                    html += '   <tr>';
                    html += '       <td style="width:10px;"></td>';
                    html += '       <td style="width:10px;"></td>';
                    var functionalAreaId = myBrData.MyRequests[i].FinancialAreaId; // Find the functional area name.
                    var functionalAreaName = '';
                    try {
                        if (BWMData[0]) {
                            for (var x = 0; x < BWMData[0].length; x++) {
                                if (BWMData[0][x][0] = bwWorkflowAppId) { // We have the correct workflow!
                                    for (var fai = 0; fai < BWMData[0][x][4].length; fai++) {
                                        if (functionalAreaId == BWMData[0][x][4][fai][0]) {
                                            functionalAreaName = BWMData[0][x][4][fai][1];
                                        }
                                    }
                                }
                            }
                        }
                    } catch (e) { }
                    html += '<td style="width:45px;"></td>';
                    html += '    <td style="background-color:white;" ';
                    //html += 'style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" ';
                    html += '       onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'' + title + '\', \'' + brTitle + '\', \'' + '' + '\', \'' + bwWorkflowAppId + '\', \'' + budgetRequestId + '\', \'' + orgId + '\', \'' + orgName + '\', this);" ';
                    html += '       onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');"  ';
                    //html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'' + appWebUrl + '\', \'' + budgetRequestId + '\', \'' + arName + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\', \'' + bwAssignedToRaciRoleAbbreviation + '\');" ';
                    html += '>';


                    html += '       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="' + imageRootPath + '/images/zoom.jpg" />';
                    html += '    </td>';

                    html += '            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="3" ';
                    html += 'onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'' + appWebUrl + '\', \'' + budgetRequestId + '\', \'' + arName + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\', \'' + bwAssignedToRaciRoleAbbreviation + '\', \'' + bwWorkflowTaskItemId + '\');" >';



                    html += '    <div style="display:inline-block;" bwtrace="xcx778451">';
                    html += daysSinceTaskCreated.toString() + ' days overduexcx3: ';
                    html += '        <em>';
                    html += title + ' - ' + brTitle + ' - ' + formatCurrency(currentAmount) + ' - ' + functionalAreaName + ' ' + '[(' + bwAssignedToRaciRoleAbbreviation + ') ' + bwAssignedToRaciRoleName + ']';
                    html += '        </em>';
                    html += '    </div>';
                    html += '</td>';

                    html += '</tr>';
                }
            }
            html += '</tbody></table>';
            html += '</td>';
            html += '</tr>';



            //
            // Render all but the Fifth section.
            //
            var unitTable1 = '';
            unitTable1 += '<div id="BWFunctionalAreaDiv' + deferredIndex.toString() + '" style="cursor:pointer;" >';
            unitTable1 += '<table id="BWFunctionalArea' + deferredIndex.toString() + '" style="vertical-align:top;width:100%;">';
            unitTable1 += html;
            unitTable1 += '</tbody></table>';
            unitTable1 += '</div>';




            //var test = '<div id="BWFunctionalAreaDiv1" style="cursor:pointer;"><table id="BWFunctionalArea1" style="vertical-align:top;width:100%;"></table><table id="tblHomePageAlertSectionForWorkflow1" style="cursor:default;"><tbody><tr id="functionalAreaRow_1_1" class="bwFunctionalAreaRow" onclick="expandOrCollapseAlertsSection(\'functionalAreaRow_1_1\', \'alertSectionImage_1_1\', \'alertSectionRow_1_1\');"><td style="width:11px;vertical-align:top;"><img src="/images/red-dot.png" width="11" height="11" alt="" style="cursor:pointer;vertical-align:top;"></td><td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2"><img title="collapse" id="alertSectionImage_1_1" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="images/drawer-close.png">       <span>You have 10 pending tasks.       </span>   </td></tr><tr id="alertSectionRow_1_1" style="display:table-row;">   <td></td>   <td><table>   <tbody><tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200002\', \'Pizza\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'c7c7836b-fb17-4d46-9f62-5bfac6795cea\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td><td colspan="3" style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" onmouseenter="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseleave="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'c7c7836b-fb17-4d46-9f62-5bfac6795cea\', \'BR-200002\', \'Pizza\', \'BR-200002\', \'ADMIN\');">       <div style="display:inline-block;" bwtrace="xcx778451">       &nbsp;&nbsp;34 days overdue:        <em>BR-200002 - Pizza - $0.00 -  [(ADMIN) ADMIN]       </em>       </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200003\', \'Tractor\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'cd2bf528-aaf7-4a66-8fa7-09235108244f\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td><td colspan="3" style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" onmouseenter="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseleave="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'cd2bf528-aaf7-4a66-8fa7-09235108244f\', \'BR-200003\', \'Tractor\', \'BR-200003\', \'ADMIN\');">       <div style="display:inline-block;" bwtrace="xcx778451">       &nbsp;&nbsp;34 days overdue:        <em>BR-200003 - Tractor - $0.00 -  [(ADMIN) ADMIN]       </em>       </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200004\', \'Car\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'4335e979-e768-4020-a74a-4041ecff56ee\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td><td colspan="3" style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" onmouseenter="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseleave="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'4335e979-e768-4020-a74a-4041ecff56ee\', \'BR-200004\', \'Car\', \'BR-200004\', \'ADMIN\');">       <div style="display:inline-block;" bwtrace="xcx778451">       &nbsp;&nbsp;24 days overdue:        <em>BR-200004 - Car - $0.00 -  [(ADMIN) ADMIN]       </em>       </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200005\', \'Supper\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'8827c5cc-4231-445c-8fb3-56895cdf1395\', \'xxxx-xxx-xcxccx-xxxxxx13\', \'Kentville\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td><td colspan="3" style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" onmouseenter="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseleave="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'8827c5cc-4231-445c-8fb3-56895cdf1395\', \'BR-200005\', \'Supper\', \'BR-200005\', \'ADMIN\');">       <div style="display:inline-block;" bwtrace="xcx778451">       &nbsp;&nbsp;24 days overdue:        <em>BR-200005 - Supper - $0.00 -  [(ADMIN) ADMIN]       </em>       </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200003\', \'Cupcake\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'2f8d6164-1dad-42e6-9853-c15cbc88c8c7\', \'94837554-76e3-4766-8fde-c95005ba110e\', \'Truro\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td><td colspan="3" style="background-color: rgb(216, 216, 216); padding: 10px; cursor: pointer;" onmouseenter="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseleave="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'2f8d6164-1dad-42e6-9853-c15cbc88c8c7\', \'BR-200003\', \'Cupcake\', \'BR-200003\', \'AVP\');">       <div style="display:inline-block;" bwtrace="xcx778451">       &nbsp;&nbsp;13 days overdue:        <em>BR-200003 - Cupcake - $0.00 -  [(AVP) Assistant Vice President]       </em>       </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200003\', \'Cupcake\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'2f8d6164-1dad-42e6-9853-c15cbc88c8c7\', \'94837554-76e3-4766-8fde-c95005ba110e\', \'Truro\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td><td colspan="3" style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" onmouseenter="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseleave="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'2f8d6164-1dad-42e6-9853-c15cbc88c8c7\', \'BR-200003\', \'Cupcake\', \'BR-200003\', \'VP\');">       <div style="display:inline-block;" bwtrace="xcx778451">       &nbsp;&nbsp;13 days overdue:        <em>BR-200003 - Cupcake - $0.00 -  [(VP) Vice President]       </em>       </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200003\', \'Cupcake\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'2f8d6164-1dad-42e6-9853-c15cbc88c8c7\', \'94837554-76e3-4766-8fde-c95005ba110e\', \'Truro\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td><td colspan="3" style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" onmouseenter="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseleave="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'2f8d6164-1dad-42e6-9853-c15cbc88c8c7\', \'BR-200003\', \'Cupcake\', \'BR-200003\', \'CIO\');">       <div style="display:inline-block;" bwtrace="xcx778451">       &nbsp;&nbsp;13 days overdue:        <em>BR-200003 - Cupcake - $0.00 -  [(CIO) Chief Information Officer]       </em>       </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200006\', \'35lb barbell\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'8ef7510d-a604-4d6a-83c5-88d5935486f5\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td><td colspan="3" style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" onmouseenter="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseleave="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'8ef7510d-a604-4d6a-83c5-88d5935486f5\', \'BR-200006\', \'35lb barbell\', \'BR-200006\', \'ADMIN\');">       <div style="display:inline-block;" bwtrace="xcx778451">       &nbsp;&nbsp;8 days overdue:        <em>BR-200006 - 35lb barbell - $0.00 -  [(ADMIN) ADMIN]       </em>       </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200007\', \'test of bwWorkflowId\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'b50b80e1-8812-4e02-8425-b6c7e1fb261c\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td><td colspan="3" style="background-color: rgb(216, 216, 216); padding: 10px; cursor: pointer;" onmouseenter="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseleave="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'b50b80e1-8812-4e02-8425-b6c7e1fb261c\', \'BR-200007\', \'test of bwWorkflowId\', \'BR-200007\', \'ADMIN\');">       <div style="display:inline-block;" bwtrace="xcx778451">       &nbsp;&nbsp;3 days overdue:        <em>BR-200007 - test of bwWorkflowId - $0.00 -  [(ADMIN) ADMIN]       </em>       </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200008\', \'Oatmeal\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'ce1c2c0b-3be5-4b96-8c99-837bd52c8211\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td><td colspan="3" style="background-color: rgb(216, 216, 216); padding: 10px; cursor: pointer;" onmouseenter="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseleave="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'ce1c2c0b-3be5-4b96-8c99-837bd52c8211\', \'BR-200008\', \'Oatmeal\', \'BR-200008\', \'ADMIN\');">       <div style="display:inline-block;" bwtrace="xcx778451">       &nbsp;&nbsp;1 day overdue:        <em>BR-200008 - Oatmeal - $0.00 -  [(ADMIN) ADMIN]       </em>       </div></td></tr></tbody></table></td></tr><tr id="functionalAreaRow_1_2" class="bwFunctionalAreaRow" onclick="expandOrCollapseAlertsSection(\'functionalAreaRow_1_2\', \'alertSectionImage_1_2\', \'alertSectionRow_1_2\');"><td style="width:11px;vertical-align:top;"></td><td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2"><img title="expand" id="alertSectionImage_1_2" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="images/drawer-open.png">       <span>There are 8 budget requests going through the approval process.       </span>   </td></tr><tr id="alertSectionRow_1_2" style="display:none;"><td></td><td><table>   <tbody><tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200003\', \'Cupcake\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'2f8d6164-1dad-42e6-9853-c15cbc88c8c7\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="4" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'2f8d6164-1dad-42e6-9853-c15cbc88c8c7\', \'BR-200003\', \'Cupcake\', \'BR-200003\');" target="_blank">BR-200003: <em>Cupcake - no budget assigned - </em></td>        </tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200002\', \'Pizza\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'c7c7836b-fb17-4d46-9f62-5bfac6795cea\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="4" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'c7c7836b-fb17-4d46-9f62-5bfac6795cea\', \'BR-200002\', \'Pizza\', \'BR-200002\');" target="_blank">BR-200002: <em>Pizza - no budget assigned - </em></td>        </tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200003\', \'Tractor\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'cd2bf528-aaf7-4a66-8fa7-09235108244f\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="4" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'cd2bf528-aaf7-4a66-8fa7-09235108244f\', \'BR-200003\', \'Tractor\', \'BR-200003\');" target="_blank">BR-200003: <em>Tractor - no budget assigned - </em></td>        </tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200005\', \'Supper\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'8827c5cc-4231-445c-8fb3-56895cdf1395\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="4" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'8827c5cc-4231-445c-8fb3-56895cdf1395\', \'BR-200005\', \'Supper\', \'BR-200005\');" target="_blank">BR-200005: <em>Supper - no budget assigned - </em></td>        </tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200004\', \'Car\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'4335e979-e768-4020-a74a-4041ecff56ee\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="4" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'4335e979-e768-4020-a74a-4041ecff56ee\', \'BR-200004\', \'Car\', \'BR-200004\');" target="_blank">BR-200004: <em>Car - no budget assigned - </em></td>        </tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200006\', \'35lb barbell\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'8ef7510d-a604-4d6a-83c5-88d5935486f5\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="4" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'8ef7510d-a604-4d6a-83c5-88d5935486f5\', \'BR-200006\', \'35lb barbell\', \'BR-200006\');" target="_blank">BR-200006: <em>35lb barbell - no budget assigned - </em></td>        </tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200007\', \'test of bwWorkflowId\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'b50b80e1-8812-4e02-8425-b6c7e1fb261c\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="4" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'b50b80e1-8812-4e02-8425-b6c7e1fb261c\', \'BR-200007\', \'test of bwWorkflowId\', \'BR-200007\');" target="_blank">BR-200007: <em>test of bwWorkflowId - no budget assigned - </em></td>        </tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200008\', \'Oatmeal\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'ce1c2c0b-3be5-4b96-8c99-837bd52c8211\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="4" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'ce1c2c0b-3be5-4b96-8c99-837bd52c8211\', \'BR-200008\', \'Oatmeal\', \'BR-200008\');" target="_blank">BR-200008: <em>Oatmeal - no budget assigned - </em></td>        </tr></tbody></table></td></tr><tr id="functionalAreaRow_1_3" class="bwFunctionalAreaRow" onclick="expandOrCollapseAlertsSection(\'functionalAreaRow_1_3\', \'alertSectionImage_1_3\', \'alertSectionRow_1_3\');"><td style="width:11px;vertical-align:top;"></td><td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2"><img title="expand" id="alertSectionImage_1_3" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="images/drawer-open.png">       <span>There are 2 unclaimed invitations.       </span>   </td></tr><tr id="alertSectionRow_1_3" style="display:none;"><td></td><td><table>   <tbody><tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td>            <td style="width:90px;"></td>            <td>&nbsp;&nbsp;</td>            <td colspan="5" class="tdHomePageSubNotificationIos8"><div id="tdUnclaimedInvitationLinkSwipeEnabled0"><a style="cursor:pointer;" onclick="cmdViewInvitation(\'df6eb834-644d-4158-aba7-4f1cd6e7fc28\');" target="_blank" title="Send this link in an email to invite someone to participate in this workflow. You will be notified when they have confirmed their participation.">https://budgetworkflow.com?invitation=df6eb834-644d-4158-aba7-4f1cd6e7fc28</a></div></td>        </tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td>            <td style="width:90px;"></td>            <td>&nbsp;&nbsp;</td>            <td colspan="5" class="tdHomePageSubNotificationIos8"><div id="tdUnclaimedInvitationLinkSwipeEnabled1"><a style="cursor:pointer;" onclick="cmdViewInvitation(\'155f6e08-15da-437f-b413-4816ef1d81b7\');" target="_blank" title="Send this link in an email to invite someone to participate in this workflow. You will be notified when they have confirmed their participation.">https://budgetworkflow.com?invitation=155f6e08-15da-437f-b413-4816ef1d81b7</a></div></td>        </tr></tbody></table></td></tr><tr id="functionalAreaRow_1_4" class="bwFunctionalAreaRow" onclick="expandOrCollapseAlertsSection(\'functionalAreaRow_1_4\', \'alertSectionImage_1_4\', \'alertSectionRow_1_4\');"><td style="width:11px;vertical-align:top;"></td><td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2"><img title="collapse" id="alertSectionImage_1_4" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="images/drawer-open.png">       <span>You have submitted 8 requests.       </span>   </td></tr><tr id="alertSectionRow_1_4" style="display:none;">   <td></td>   <td><table>   <tbody><tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200003\', \'Cupcake\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'2f8d6164-1dad-42e6-9853-c15cbc88c8c7\', \'94837554-76e3-4766-8fde-c95005ba110e\', \'Truro\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="3" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'2f8d6164-1dad-42e6-9853-c15cbc88c8c7\', \'BR-200003\', \'Cupcake\', \'BR-200003\', \'undefined\');">    <div style="display:inline-block;" bwtrace="xcx778451">0 days overduexcx3:         <em>BR-200003 - Cupcake - $0.00 -  [(undefined) undefined]        </em>    </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200002\', \'Pizza\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'c7c7836b-fb17-4d46-9f62-5bfac6795cea\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="3" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'c7c7836b-fb17-4d46-9f62-5bfac6795cea\', \'BR-200002\', \'Pizza\', \'BR-200002\', \'undefined\');">    <div style="display:inline-block;" bwtrace="xcx778451">0 days overduexcx3:         <em>BR-200002 - Pizza - $0.00 -  [(undefined) undefined]        </em>    </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200003\', \'Tractor\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'cd2bf528-aaf7-4a66-8fa7-09235108244f\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="3" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'cd2bf528-aaf7-4a66-8fa7-09235108244f\', \'BR-200003\', \'Tractor\', \'BR-200003\', \'undefined\');">    <div style="display:inline-block;" bwtrace="xcx778451">0 days overduexcx3:         <em>BR-200003 - Tractor - $0.00 -  [(undefined) undefined]        </em>    </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200005\', \'Supper\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'8827c5cc-4231-445c-8fb3-56895cdf1395\', \'xxxx-xxx-xcxccx-xxxxxx13\', \'Kentville\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="3" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'8827c5cc-4231-445c-8fb3-56895cdf1395\', \'BR-200005\', \'Supper\', \'BR-200005\', \'undefined\');">    <div style="display:inline-block;" bwtrace="xcx778451">0 days overduexcx3:         <em>BR-200005 - Supper - $0.00 -  [(undefined) undefined]        </em>    </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200004\', \'Car\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'4335e979-e768-4020-a74a-4041ecff56ee\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="3" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'4335e979-e768-4020-a74a-4041ecff56ee\', \'BR-200004\', \'Car\', \'BR-200004\', \'undefined\');">    <div style="display:inline-block;" bwtrace="xcx778451">0 days overduexcx3:         <em>BR-200004 - Car - $0.00 -  [(undefined) undefined]        </em>    </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200006\', \'35lb barbell\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'8ef7510d-a604-4d6a-83c5-88d5935486f5\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="3" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'8ef7510d-a604-4d6a-83c5-88d5935486f5\', \'BR-200006\', \'35lb barbell\', \'BR-200006\', \'undefined\');">    <div style="display:inline-block;" bwtrace="xcx778451">0 days overduexcx3:         <em>BR-200006 - 35lb barbell - $0.00 -  [(undefined) undefined]        </em>    </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200007\', \'test of bwWorkflowId\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'b50b80e1-8812-4e02-8425-b6c7e1fb261c\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="3" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'b50b80e1-8812-4e02-8425-b6c7e1fb261c\', \'BR-200007\', \'test of bwWorkflowId\', \'BR-200007\', \'undefined\');">    <div style="display:inline-block;" bwtrace="xcx778451">0 days overduexcx3:         <em>BR-200007 - test of bwWorkflowId - $0.00 -  [(undefined) undefined]        </em>    </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200008\', \'Oatmeal\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'ce1c2c0b-3be5-4b96-8c99-837bd52c8211\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="3" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'ce1c2c0b-3be5-4b96-8c99-837bd52c8211\', \'BR-200008\', \'Oatmeal\', \'BR-200008\', \'undefined\');">    <div style="display:inline-block;" bwtrace="xcx778451">0 days overduexcx3:         <em>BR-200008 - Oatmeal - $0.00 -  [(undefined) undefined]        </em>    </div></td></tr></tbody></table></td></tr></tbody></table></div>';





            var result = {
                html: unitTable1
            }
            return result;

            //} catch (e) {
            //    console.log('Exception in generateHomePageNotificationScreenHtml():1335-1: ' + e.message + ', ' + e.stack);
            //    var result = {
            //        html: 'Exception in generateHomePageNotificationScreenHtml():1335-1: ' + e.message + ', ' + e.stack
            //    }
            //    return result;
            //}
        } catch (e) {
            console.log('Exception in bwCommonScripts.js.generateHomePageNotificationScreenHtml():1335-1: ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwCommonScripts.js.generateHomePageNotificationScreenHtml():1335-1: ' + e.message + ', ' + e.stack);
            var result = {
                html: 'Exception in bwCommonScripts.js.generateHomePageNotificationScreenHtml():1335-1: ' + e.message + ', ' + e.stack
            }
            return result;
        }
    }

    exports.generateCustomerHomePageNotificationScreenHtml = function (deferredIndex, appweburl, bwWorkflowAppId, myBrData, serverside) {
        try {

            //try {
            //debugger; /////////////////////////////////////////////////
            //try {

            exports.bwWorkflowAppId = bwWorkflowAppId;
            //exports.invitationData = invitationData;
            //exports.taskData = taskData;


            debugger;

            // why is there no bwDueDate????????????????? 2-15-2022




            exports.myBrData = myBrData;

            var html = '';






            //
            // Fourth section, "My Requests" summary.
            //
            var rowId = 'functionalAreaRow_' + deferredIndex.toString() + '_4';
            var imageId = 'alertSectionImage_' + deferredIndex.toString() + '_4';
            var collapsibleRowId = 'alertSectionRow_' + deferredIndex.toString() + '_4';
            html += '<tr id="' + rowId + '" class="bwFunctionalAreaRow" onclick="expandOrCollapseAlertsSection(\'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" >';
            if (myBrData.MyRequests.length > 0) {
                if (myBrData.MyRequests.length == 1) {
                    html += '<td style="width:11px;vertical-align:top;"></td>';
                    html += '<td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2">';
                    html += '<img title="collapse" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="' + imageRootPath + '/images/drawer-open.png">';
                } else {
                    html += '<td style="width:11px;vertical-align:top;"></td>';
                    html += '<td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2">';
                    html += '<img title="collapse" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="' + imageRootPath + '/images/drawer-open.png">';
                }
            } else {
                html += '<td style="width:11px;"></td>';
                html += '<td style="padding-left:60px;height:45px;" class="bwHPNDrillDownLinkCell2">';
            }
            html += '       <span>';
            if (myBrData.MyRequests.length == 1) {
                html += 'You have submitted ' + myBrData.MyRequests.length + ' request.';
            } else {
                html += 'You have submitted ' + myBrData.MyRequests.length + ' requests.';
            }
            html += '       </span>';
            html += '   </td>';

            html += '<td class="bwHPNDrillDownLinkCell2"></td>';

            html += '</tr>';


            // Fourth section, "My Requests" details.
            html += '<tr id="' + collapsibleRowId + '" style="display:none;">';
            html += '   <td></td>';
            html += '   <td colspan="2"><table><tbody>';
            for (var i = 0; i < myBrData.MyRequests.length; i++) {
                var taskTitle = myBrData.MyRequests[i].bwTaskTitle;
                var appWebUrl = appweburl;
                var budgetRequestId = myBrData.MyRequests[i].bwBudgetRequestId;
                var arName = myBrData.MyRequests[i].Title; // DUPLICATE
                var brTitle = myBrData.MyRequests[i].ProjectTitle;
                var title = myBrData.MyRequests[i].Title;
                var budgetAmount = myBrData.MyRequests[i].BudgetAmount;
                var requestedCapital = myBrData.MyRequests[i].RequestedCapital;
                var requestedExpense = myBrData.MyRequests[i].RequestedExpense;
                var taskType = myBrData.MyRequests[i].TaskType;
                var bwAssignedToRaciRoleAbbreviation = myBrData.MyRequests[i].bwAssignedToRaciRoleAbbreviation;
                var bwAssignedToRaciRoleName = myBrData.MyRequests[i].bwAssignedToRaciRoleName;
                var orgId = myBrData.MyRequests[i].OrgId;
                var orgName = myBrData.MyRequests[i].OrgName;
                var currentAmount = 0;
                if (budgetAmount == 'null') {
                    currentAmount = Number(requestedCapital) + Number(requestedExpense);
                } else {
                    currentAmount = budgetAmount;
                }
                var daysSinceTaskCreated = 0;
                try {
                    var cd = myBrData.MyRequests[i].bwDueDate;
                    var year = cd.split('-')[0];
                    var month = cd.split('-')[1];
                    var day = cd.split('-')[2].split('T')[0];
                    var taskCreatedDate = new Date(Number(year), Number(month) - 1, Number(day) - 1); // +1 because we're using overdue date.
                    var todaysDate = new Date();
                    var utc1 = Date.UTC(taskCreatedDate.getFullYear(), taskCreatedDate.getMonth(), taskCreatedDate.getDate());
                    var utc2 = Date.UTC(todaysDate.getFullYear(), todaysDate.getMonth(), todaysDate.getDate());
                    var _MS_PER_DAY = 1000 * 60 * 60 * 24;
                    daysSinceTaskCreated = Math.floor((utc2 - utc1) / _MS_PER_DAY);
                } catch (e) {
                    // TODD: THIS NEEDS TO BE REEXAMINED, we are catching this error when the new recurring tasks came into play! //thisMustBeADifferentKindOfTask = true;
                }
                html += '   <tr>';
                html += '       <td style="width:10px;"></td>';
                html += '       <td style="width:10px;"></td>';
                var functionalAreaId = myBrData.MyRequests[i].FinancialAreaId; // Find the functional area name.
                var functionalAreaName = '';
                try {
                    if (BWMData[0]) {
                        for (var x = 0; x < BWMData[0].length; x++) {
                            if (BWMData[0][x][0] = bwWorkflowAppId) { // We have the correct workflow!
                                for (var fai = 0; fai < BWMData[0][x][4].length; fai++) {
                                    if (functionalAreaId == BWMData[0][x][4][fai][0]) {
                                        functionalAreaName = BWMData[0][x][4][fai][1];
                                    }
                                }
                            }
                        }
                    }
                } catch (e) { }
                html += '<td style="width:45px;"></td>';
                html += '    <td style="background-color:white;" ';
                //html += 'style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" ';
                html += '       onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'' + title + '\', \'' + brTitle + '\', \'' + '' + '\', \'' + bwWorkflowAppId + '\', \'' + budgetRequestId + '\', \'' + orgId + '\', \'' + orgName + '\', this);" ';
                html += '       onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');"  ';
                //html += '       onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'' + appWebUrl + '\', \'' + budgetRequestId + '\', \'' + arName + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\', \'' + bwAssignedToRaciRoleAbbreviation + '\');" ';
                html += '>';


                html += '       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="' + imageRootPath + '/images/zoom.jpg" />';
                html += '    </td>';

                html += '            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="3" ';
                html += 'onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'' + appWebUrl + '\', \'' + budgetRequestId + '\', \'' + arName + '\', \'' + encodeHtmlAttribute(brTitle) + '\', \'' + title + '\', \'' + bwAssignedToRaciRoleAbbreviation + '\', \'' + bwWorkflowTaskItemId + '\');" >';



                html += '    <div style="display:inline-block;" bwtrace="xcx778451">';
                html += daysSinceTaskCreated.toString() + ' days overduexcx3: ';
                html += '        <em>';
                html += title + ' - ' + brTitle + ' - ' + formatCurrency(currentAmount) + ' - ' + functionalAreaName + ' ' + '[(' + bwAssignedToRaciRoleAbbreviation + ') ' + bwAssignedToRaciRoleName + ']';
                html += '        </em>';
                html += '    </div>';
                html += '</td>';

                html += '</tr>';
            }
            html += '</tbody></table>';
            html += '</td>';
            html += '</tr>';



            //
            // Render all but the Fifth section.
            //
            var unitTable1 = '';
            unitTable1 += '<div id="BWFunctionalAreaDiv' + deferredIndex.toString() + '" style="cursor:pointer;" >';
            unitTable1 += '<table id="BWFunctionalArea' + deferredIndex.toString() + '" style="vertical-align:top;width:100%;">';
            unitTable1 += html;
            unitTable1 += '</tbody></table>';
            unitTable1 += '</div>';




            //var test = '<div id="BWFunctionalAreaDiv1" style="cursor:pointer;"><table id="BWFunctionalArea1" style="vertical-align:top;width:100%;"></table><table id="tblHomePageAlertSectionForWorkflow1" style="cursor:default;"><tbody><tr id="functionalAreaRow_1_1" class="bwFunctionalAreaRow" onclick="expandOrCollapseAlertsSection(\'functionalAreaRow_1_1\', \'alertSectionImage_1_1\', \'alertSectionRow_1_1\');"><td style="width:11px;vertical-align:top;"><img src="/images/red-dot.png" width="11" height="11" alt="" style="cursor:pointer;vertical-align:top;"></td><td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2"><img title="collapse" id="alertSectionImage_1_1" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="images/drawer-close.png">       <span>You have 10 pending tasks.       </span>   </td></tr><tr id="alertSectionRow_1_1" style="display:table-row;">   <td></td>   <td><table>   <tbody><tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200002\', \'Pizza\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'c7c7836b-fb17-4d46-9f62-5bfac6795cea\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td><td colspan="3" style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" onmouseenter="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseleave="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'c7c7836b-fb17-4d46-9f62-5bfac6795cea\', \'BR-200002\', \'Pizza\', \'BR-200002\', \'ADMIN\');">       <div style="display:inline-block;" bwtrace="xcx778451">       &nbsp;&nbsp;34 days overdue:        <em>BR-200002 - Pizza - $0.00 -  [(ADMIN) ADMIN]       </em>       </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200003\', \'Tractor\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'cd2bf528-aaf7-4a66-8fa7-09235108244f\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td><td colspan="3" style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" onmouseenter="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseleave="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'cd2bf528-aaf7-4a66-8fa7-09235108244f\', \'BR-200003\', \'Tractor\', \'BR-200003\', \'ADMIN\');">       <div style="display:inline-block;" bwtrace="xcx778451">       &nbsp;&nbsp;34 days overdue:        <em>BR-200003 - Tractor - $0.00 -  [(ADMIN) ADMIN]       </em>       </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200004\', \'Car\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'4335e979-e768-4020-a74a-4041ecff56ee\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td><td colspan="3" style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" onmouseenter="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseleave="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'4335e979-e768-4020-a74a-4041ecff56ee\', \'BR-200004\', \'Car\', \'BR-200004\', \'ADMIN\');">       <div style="display:inline-block;" bwtrace="xcx778451">       &nbsp;&nbsp;24 days overdue:        <em>BR-200004 - Car - $0.00 -  [(ADMIN) ADMIN]       </em>       </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200005\', \'Supper\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'8827c5cc-4231-445c-8fb3-56895cdf1395\', \'xxxx-xxx-xcxccx-xxxxxx13\', \'Kentville\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td><td colspan="3" style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" onmouseenter="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseleave="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'8827c5cc-4231-445c-8fb3-56895cdf1395\', \'BR-200005\', \'Supper\', \'BR-200005\', \'ADMIN\');">       <div style="display:inline-block;" bwtrace="xcx778451">       &nbsp;&nbsp;24 days overdue:        <em>BR-200005 - Supper - $0.00 -  [(ADMIN) ADMIN]       </em>       </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200003\', \'Cupcake\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'2f8d6164-1dad-42e6-9853-c15cbc88c8c7\', \'94837554-76e3-4766-8fde-c95005ba110e\', \'Truro\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td><td colspan="3" style="background-color: rgb(216, 216, 216); padding: 10px; cursor: pointer;" onmouseenter="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseleave="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'2f8d6164-1dad-42e6-9853-c15cbc88c8c7\', \'BR-200003\', \'Cupcake\', \'BR-200003\', \'AVP\');">       <div style="display:inline-block;" bwtrace="xcx778451">       &nbsp;&nbsp;13 days overdue:        <em>BR-200003 - Cupcake - $0.00 -  [(AVP) Assistant Vice President]       </em>       </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200003\', \'Cupcake\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'2f8d6164-1dad-42e6-9853-c15cbc88c8c7\', \'94837554-76e3-4766-8fde-c95005ba110e\', \'Truro\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td><td colspan="3" style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" onmouseenter="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseleave="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'2f8d6164-1dad-42e6-9853-c15cbc88c8c7\', \'BR-200003\', \'Cupcake\', \'BR-200003\', \'VP\');">       <div style="display:inline-block;" bwtrace="xcx778451">       &nbsp;&nbsp;13 days overdue:        <em>BR-200003 - Cupcake - $0.00 -  [(VP) Vice President]       </em>       </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200003\', \'Cupcake\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'2f8d6164-1dad-42e6-9853-c15cbc88c8c7\', \'94837554-76e3-4766-8fde-c95005ba110e\', \'Truro\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td><td colspan="3" style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" onmouseenter="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseleave="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'2f8d6164-1dad-42e6-9853-c15cbc88c8c7\', \'BR-200003\', \'Cupcake\', \'BR-200003\', \'CIO\');">       <div style="display:inline-block;" bwtrace="xcx778451">       &nbsp;&nbsp;13 days overdue:        <em>BR-200003 - Cupcake - $0.00 -  [(CIO) Chief Information Officer]       </em>       </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200006\', \'35lb barbell\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'8ef7510d-a604-4d6a-83c5-88d5935486f5\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td><td colspan="3" style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" onmouseenter="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseleave="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'8ef7510d-a604-4d6a-83c5-88d5935486f5\', \'BR-200006\', \'35lb barbell\', \'BR-200006\', \'ADMIN\');">       <div style="display:inline-block;" bwtrace="xcx778451">       &nbsp;&nbsp;8 days overdue:        <em>BR-200006 - 35lb barbell - $0.00 -  [(ADMIN) ADMIN]       </em>       </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200007\', \'test of bwWorkflowId\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'b50b80e1-8812-4e02-8425-b6c7e1fb261c\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td><td colspan="3" style="background-color: rgb(216, 216, 216); padding: 10px; cursor: pointer;" onmouseenter="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseleave="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'b50b80e1-8812-4e02-8425-b6c7e1fb261c\', \'BR-200007\', \'test of bwWorkflowId\', \'BR-200007\', \'ADMIN\');">       <div style="display:inline-block;" bwtrace="xcx778451">       &nbsp;&nbsp;3 days overdue:        <em>BR-200007 - test of bwWorkflowId - $0.00 -  [(ADMIN) ADMIN]       </em>       </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200008\', \'Oatmeal\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'ce1c2c0b-3be5-4b96-8c99-837bd52c8211\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td><td colspan="3" style="background-color: rgb(216, 216, 216); padding: 10px; cursor: pointer;" onmouseenter="this.style.backgroundColor=\'lightgoldenrodyellow\';" onmouseleave="this.style.backgroundColor=\'#d8d8d8\';" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'ce1c2c0b-3be5-4b96-8c99-837bd52c8211\', \'BR-200008\', \'Oatmeal\', \'BR-200008\', \'ADMIN\');">       <div style="display:inline-block;" bwtrace="xcx778451">       &nbsp;&nbsp;1 day overdue:        <em>BR-200008 - Oatmeal - $0.00 -  [(ADMIN) ADMIN]       </em>       </div></td></tr></tbody></table></td></tr><tr id="functionalAreaRow_1_2" class="bwFunctionalAreaRow" onclick="expandOrCollapseAlertsSection(\'functionalAreaRow_1_2\', \'alertSectionImage_1_2\', \'alertSectionRow_1_2\');"><td style="width:11px;vertical-align:top;"></td><td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2"><img title="expand" id="alertSectionImage_1_2" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="images/drawer-open.png">       <span>There are 8 budget requests going through the approval process.       </span>   </td></tr><tr id="alertSectionRow_1_2" style="display:none;"><td></td><td><table>   <tbody><tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200003\', \'Cupcake\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'2f8d6164-1dad-42e6-9853-c15cbc88c8c7\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="4" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'2f8d6164-1dad-42e6-9853-c15cbc88c8c7\', \'BR-200003\', \'Cupcake\', \'BR-200003\');" target="_blank">BR-200003: <em>Cupcake - no budget assigned - </em></td>        </tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200002\', \'Pizza\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'c7c7836b-fb17-4d46-9f62-5bfac6795cea\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="4" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'c7c7836b-fb17-4d46-9f62-5bfac6795cea\', \'BR-200002\', \'Pizza\', \'BR-200002\');" target="_blank">BR-200002: <em>Pizza - no budget assigned - </em></td>        </tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200003\', \'Tractor\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'cd2bf528-aaf7-4a66-8fa7-09235108244f\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="4" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'cd2bf528-aaf7-4a66-8fa7-09235108244f\', \'BR-200003\', \'Tractor\', \'BR-200003\');" target="_blank">BR-200003: <em>Tractor - no budget assigned - </em></td>        </tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200005\', \'Supper\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'8827c5cc-4231-445c-8fb3-56895cdf1395\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="4" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'8827c5cc-4231-445c-8fb3-56895cdf1395\', \'BR-200005\', \'Supper\', \'BR-200005\');" target="_blank">BR-200005: <em>Supper - no budget assigned - </em></td>        </tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200004\', \'Car\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'4335e979-e768-4020-a74a-4041ecff56ee\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="4" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'4335e979-e768-4020-a74a-4041ecff56ee\', \'BR-200004\', \'Car\', \'BR-200004\');" target="_blank">BR-200004: <em>Car - no budget assigned - </em></td>        </tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200006\', \'35lb barbell\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'8ef7510d-a604-4d6a-83c5-88d5935486f5\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="4" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'8ef7510d-a604-4d6a-83c5-88d5935486f5\', \'BR-200006\', \'35lb barbell\', \'BR-200006\');" target="_blank">BR-200006: <em>35lb barbell - no budget assigned - </em></td>        </tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200007\', \'test of bwWorkflowId\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'b50b80e1-8812-4e02-8425-b6c7e1fb261c\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="4" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'b50b80e1-8812-4e02-8425-b6c7e1fb261c\', \'BR-200007\', \'test of bwWorkflowId\', \'BR-200007\');" target="_blank">BR-200007: <em>test of bwWorkflowId - no budget assigned - </em></td>        </tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200008\', \'Oatmeal\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'ce1c2c0b-3be5-4b96-8c99-837bd52c8211\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="4" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', \'https://budgetworkflow.com\', \'ce1c2c0b-3be5-4b96-8c99-837bd52c8211\', \'BR-200008\', \'Oatmeal\', \'BR-200008\');" target="_blank">BR-200008: <em>Oatmeal - no budget assigned - </em></td>        </tr></tbody></table></td></tr><tr id="functionalAreaRow_1_3" class="bwFunctionalAreaRow" onclick="expandOrCollapseAlertsSection(\'functionalAreaRow_1_3\', \'alertSectionImage_1_3\', \'alertSectionRow_1_3\');"><td style="width:11px;vertical-align:top;"></td><td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2"><img title="expand" id="alertSectionImage_1_3" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="images/drawer-open.png">       <span>There are 2 unclaimed invitations.       </span>   </td></tr><tr id="alertSectionRow_1_3" style="display:none;"><td></td><td><table>   <tbody><tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td>            <td style="width:90px;"></td>            <td>&nbsp;&nbsp;</td>            <td colspan="5" class="tdHomePageSubNotificationIos8"><div id="tdUnclaimedInvitationLinkSwipeEnabled0"><a style="cursor:pointer;" onclick="cmdViewInvitation(\'df6eb834-644d-4158-aba7-4f1cd6e7fc28\');" target="_blank" title="Send this link in an email to invite someone to participate in this workflow. You will be notified when they have confirmed their participation.">https://budgetworkflow.com?invitation=df6eb834-644d-4158-aba7-4f1cd6e7fc28</a></div></td>        </tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td>            <td style="width:90px;"></td>            <td>&nbsp;&nbsp;</td>            <td colspan="5" class="tdHomePageSubNotificationIos8"><div id="tdUnclaimedInvitationLinkSwipeEnabled1"><a style="cursor:pointer;" onclick="cmdViewInvitation(\'155f6e08-15da-437f-b413-4816ef1d81b7\');" target="_blank" title="Send this link in an email to invite someone to participate in this workflow. You will be notified when they have confirmed their participation.">https://budgetworkflow.com?invitation=155f6e08-15da-437f-b413-4816ef1d81b7</a></div></td>        </tr></tbody></table></td></tr><tr id="functionalAreaRow_1_4" class="bwFunctionalAreaRow" onclick="expandOrCollapseAlertsSection(\'functionalAreaRow_1_4\', \'alertSectionImage_1_4\', \'alertSectionRow_1_4\');"><td style="width:11px;vertical-align:top;"></td><td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2"><img title="collapse" id="alertSectionImage_1_4" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="images/drawer-open.png">       <span>You have submitted 8 requests.       </span>   </td></tr><tr id="alertSectionRow_1_4" style="display:none;">   <td></td>   <td><table>   <tbody><tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200003\', \'Cupcake\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'2f8d6164-1dad-42e6-9853-c15cbc88c8c7\', \'94837554-76e3-4766-8fde-c95005ba110e\', \'Truro\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="3" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'2f8d6164-1dad-42e6-9853-c15cbc88c8c7\', \'BR-200003\', \'Cupcake\', \'BR-200003\', \'undefined\');">    <div style="display:inline-block;" bwtrace="xcx778451">0 days overduexcx3:         <em>BR-200003 - Cupcake - $0.00 -  [(undefined) undefined]        </em>    </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200002\', \'Pizza\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'c7c7836b-fb17-4d46-9f62-5bfac6795cea\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="3" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'c7c7836b-fb17-4d46-9f62-5bfac6795cea\', \'BR-200002\', \'Pizza\', \'BR-200002\', \'undefined\');">    <div style="display:inline-block;" bwtrace="xcx778451">0 days overduexcx3:         <em>BR-200002 - Pizza - $0.00 -  [(undefined) undefined]        </em>    </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200003\', \'Tractor\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'cd2bf528-aaf7-4a66-8fa7-09235108244f\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="3" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'cd2bf528-aaf7-4a66-8fa7-09235108244f\', \'BR-200003\', \'Tractor\', \'BR-200003\', \'undefined\');">    <div style="display:inline-block;" bwtrace="xcx778451">0 days overduexcx3:         <em>BR-200003 - Tractor - $0.00 -  [(undefined) undefined]        </em>    </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200005\', \'Supper\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'8827c5cc-4231-445c-8fb3-56895cdf1395\', \'xxxx-xxx-xcxccx-xxxxxx13\', \'Kentville\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="3" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'8827c5cc-4231-445c-8fb3-56895cdf1395\', \'BR-200005\', \'Supper\', \'BR-200005\', \'undefined\');">    <div style="display:inline-block;" bwtrace="xcx778451">0 days overduexcx3:         <em>BR-200005 - Supper - $0.00 -  [(undefined) undefined]        </em>    </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200004\', \'Car\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'4335e979-e768-4020-a74a-4041ecff56ee\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="3" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'4335e979-e768-4020-a74a-4041ecff56ee\', \'BR-200004\', \'Car\', \'BR-200004\', \'undefined\');">    <div style="display:inline-block;" bwtrace="xcx778451">0 days overduexcx3:         <em>BR-200004 - Car - $0.00 -  [(undefined) undefined]        </em>    </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200006\', \'35lb barbell\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'8ef7510d-a604-4d6a-83c5-88d5935486f5\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="3" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'8ef7510d-a604-4d6a-83c5-88d5935486f5\', \'BR-200006\', \'35lb barbell\', \'BR-200006\', \'undefined\');">    <div style="display:inline-block;" bwtrace="xcx778451">0 days overduexcx3:         <em>BR-200006 - 35lb barbell - $0.00 -  [(undefined) undefined]        </em>    </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200007\', \'test of bwWorkflowId\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'b50b80e1-8812-4e02-8425-b6c7e1fb261c\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="3" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'b50b80e1-8812-4e02-8425-b6c7e1fb261c\', \'BR-200007\', \'test of bwWorkflowId\', \'BR-200007\', \'undefined\');">    <div style="display:inline-block;" bwtrace="xcx778451">0 days overduexcx3:         <em>BR-200007 - test of bwWorkflowId - $0.00 -  [(undefined) undefined]        </em>    </div></td></tr>   <tr>       <td style="width:10px;"></td>       <td style="width:10px;"></td><td style="width:45px;"></td>    <td style="background-color:white;" onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'BR-200008\', \'Oatmeal\', \'\', \'6f308d4e-66fd-4e6f-925e-714b3135fef3\', \'ce1c2c0b-3be5-4b96-8c99-837bd52c8211\', \'root\', \'Stark Enterprises\', this);" onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">       <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">    </td>            <td style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" colspan="3" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'ce1c2c0b-3be5-4b96-8c99-837bd52c8211\', \'BR-200008\', \'Oatmeal\', \'BR-200008\', \'undefined\');">    <div style="display:inline-block;" bwtrace="xcx778451">0 days overduexcx3:         <em>BR-200008 - Oatmeal - $0.00 -  [(undefined) undefined]        </em>    </div></td></tr></tbody></table></td></tr></tbody></table></div>';





            var result = {
                html: unitTable1
            }
            return result;

            //} catch (e) {
            //    console.log('Exception in generateHomePageNotificationScreenHtml():1335-1: ' + e.message + ', ' + e.stack);
            //    var result = {
            //        html: 'Exception in generateHomePageNotificationScreenHtml():1335-1: ' + e.message + ', ' + e.stack
            //    }
            //    return result;
            //}
        } catch (e) {
            console.log('Exception in bwCommonScripts.js.generateCustomerHomePageNotificationScreenHtml():1335-1: ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwCommonScripts.js.generateCustomerHomePageNotificationScreenHtml():1335-1: ' + e.message + ', ' + e.stack);
            var result = {
                html: 'Exception in bwCommonScripts.js.generateCustomerHomePageNotificationScreenHtml():1335-1: ' + e.message + ', ' + e.stack
            }
            return result;
        }
    }

    exports.createEmailFromTemplate = function (subjectTemplate, bodyTemplate, dataConversionJson) {
        return new Promise(function (resolve, reject) {
            try {
                if (!subjectTemplate) {
                    console.log('In bwCommonScripts.createEmailFromTemplate(). subjectTemplate value does not exist in the workflow JSON.xcx1');
                    subjectTemplate = 'In bwCommonScripts.createEmailFromTemplate(). subjectTemplate value does not exist in the workflow JSON.xcx1';
                }
                if (!bodyTemplate) {
                    console.log('In bwCommonScripts.createEmailFromTemplate(). bodyTemplate value does not exist in the workflow JSON.xcx1');
                    bodyTemplate = 'In bwCommonScripts.createEmailFromTemplate(). bodyTemplate value does not exist in the workflow JSON.xcx1';
                }
                var keys = Object.keys(dataConversionJson);
                for (var i = 0; i < keys.length; i++) {
                    try {
                        subjectTemplate = subjectTemplate.replace(dataConversionJson[keys[i]].TemplateText, dataConversionJson[keys[i]].Html);
                    } catch (e) { }
                    try {
                        bodyTemplate = bodyTemplate.replace(dataConversionJson[keys[i]].TemplateText, dataConversionJson[keys[i]].Html);
                    } catch (e) { }
                }

                var result = {
                    subject: subjectTemplate,
                    body: bodyTemplate
                }
                resolve(result);

            } catch (e) {
                console.log('Exception in createEmailFromTemplate(): ' + e.message + ', ' + e.stack);
                var msg = 'Exception in createEmailFromTemplate(): ' + e.message + ', ' + e.stack;
                var result = {
                    message: msg
                }
                resolve(result);
            }
        })
    };

    exports.getEmailTemplateConversionJson = function () {
        console.log('In bwCommonScripts.js.getEmailTemplateConversionJson().');

        var dataConversionJson = {
            ExecutiveSummary: {
                TemplateText: '%Executive Summary%',
                //Html: '{ExecutiveSummary.DataElement}'
                Html: function (bwBudgetRequest) {
                    // 2-10-2023
                    // bwBudgetRequest is BwBudgetRequest JSON. We create the UI using the request data here, and return it so it can be included in the email.
                    //

                    var html = '';

                    html += 'this is a test of supplanting the data into the UI here.... HELLO WORLD.? ' + bwBudgetRequest.Title + ': ' + bwBudgetRequest.ProjectTitle;

                    return html;
                }
            },
            TaskSummarySection: {
                TemplateText: '%Task Summary Section%',
                Html: '{QtyOfBudgetRequestsWithTasks.TaskSummarySection}'
            },
            QtyOfBudgetRequestsWithTasks: {
                TemplateText: '%# Qty of Budget Requests with Tasks%',
                Html: '{QtyOfBudgetRequestsWithTasks.DataElement}'
            },
            QtyOfAssignedTasks: {
                TemplateText: '%# Qty of Assigned Tasks%',
                Html: '{QtyOfAssignedTasks.DataElement}'
            },

            TaskDaysOverdue: {
                TemplateText: '%Task Days Overdue%',
                Html: '{TaskDaysOverdue.DataElement}'
            },

            CompanyLogo: {
                TemplateText: '%⧉ Company Logo%',
                Html: '{CompanyLogo.DataElement}'
            },
            ParticipantFriendlyName: {
                TemplateText: '%⚇ Participant Friendly Name%',
                Html: '{ParticipantFriendlyName.DataElement}'
            },
            ParticipantEmail: {
                TemplateText: '%✉ Participant Email%',
                Html: '{ParticipantEmail.DataElement}'
            },
            BudgetRequestLink: {
                TemplateText: '%✈ Budget Request Link%',
                Html: '{BudgetRequestLink.DataElement}'
            },
            ConfigureEmailSettingsLink: {
                TemplateText: '%✉ Configure Email Settings Link%',
                Html: '{ConfigureEmailSettingsLink.DataElement}'
            },
            DisclaimerLegalText: {
                TemplateText: '%☯ Disclaimer/Legal Text%',
                Html: '{DisclaimerLegalText.DataElement}'
            },
            UnsubscribeLink: {
                TemplateText: '%☒ Unsubscribe Link%',
                Html: '{UnsubscribeLink.DataElement}'
            },
            //BudgetRequestNumber: {
            //    TemplateText: '%Budget Request Number%',
            //    Html: '{BudgetRequestNumber.DataElement}'
            //},
            BudgetRequestTitle: {
                TemplateText: '%Budget Request Title%',
                Html: '{BudgetRequestTitle.DataElement}'
            },
            BudgetRequestProjectTitle: {
                TemplateText: '%Budget Request Project Title%',
                Html: '{BudgetRequestProjectTitle.DataElement}'
            },
            NextAssignmentText: {
                TemplateText: '%Next Task Assignment Text%',
                Html: '{NextAssignmentText.DataElement}'
            },
            RoleAbbreviation: {
                TemplateText: '%Role Abbreviation%',
                Html: '{RoleAbbreviation.DataElement}'
            },
            RoleName: {
                TemplateText: '%Role Name%',
                Html: '{RoleName.DataElement}'
            },
            OrganizationName: {
                TemplateText: '%Organization Name%',
                Html: '{Organization.DataElement}'
            },
            AttachmentAndInventoryImages: { // 3-5-2022
                TemplateText: '%Attachment and Inventory Images%',
                Html: '{AttachmentAndInventoryItemImages.DataElement}'
            },
            SignInLink: { // 3-5-2022
                TemplateText: '%Sign In Link%',
                Html: '{SignInLink.DataElement}'
            }
        }

        return dataConversionJson;
    };

    exports.expandOrCollapseExecutiveSummaries = function () {
        try {
            console.log('In bwCommonScripts.js.expandOrCollapseExecutiveSummaries(). <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< 10-15-2020.');
            alert('In bwCommonScripts.js.expandOrCollapseExecutiveSummaries(). <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< 10-15-2020.');
            // The state of the Executive Summaries is saved in BwParticipant.bwLastSelectedExecutiveSummariesExpandedOrCollapsed field.

            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            var bwLastSelectedExecutiveSummariesExpandedOrCollapsed;
            var element = document.getElementById('tdExecutiveSummaries');
            debugger; // 1-21-2022
            if (element.style.display != 'none') {
                element.style.display = 'none';
                bwLastSelectedExecutiveSummariesExpandedOrCollapsed = 'collapsed';
            } else {
                element.style.display = 'inline';
                var html = '';
                // Create and display the executive summary boxes.
                html += bwCommonScripts.generateExecutiveSummaryHtml();
                element.innerHTML = html;

                bwCommonScripts.populateExecutiveSummaryHtml_PrimaryImages();
                bwLastSelectedExecutiveSummariesExpandedOrCollapsed = 'expanded';
            }


            // 9-9-2021
            var data = {
                bwParticipantId: participantId,
                bwLastSelectedExecutiveSummariesExpandedOrCollapsed: bwLastSelectedExecutiveSummariesExpandedOrCollapsed
            };
            var operationUri = webserviceurl + "/bwparticipant/updateuserconfigurationslastselectedexecutivesummariesexpandedorcollapsed";
            $.ajax({
                url: operationUri,
                type: "POST", timeout: ajaxTimeout,
                data: data,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (data) {
                    if (data != 'SUCCESS') {
                        displayAlertDialog(data);
                    } else {
                        console.log('Saved BwParticipant.bwLastSelectedExecutiveSummariesExpandedOrCollapsed: ' + bwLastSelectedExecutiveSummariesExpandedOrCollapsed);
                        // do nothing
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    displayAlertDialog('Error in my.js.cmdChooseSelectedWorkflow(): ' + errorCode + ' ' + errorMessage);
                }
            });






        } catch (e) {
            console.log('Exception in bwCommonScripts.js.expandOrCollapseExecutiveSummaries(): ' + e.message + ', ' + e.stack);
        }
    };

    exports.highlightExecutiveSummaryForRequest = function (bwBudgetRequestId) {
        try {
            console.log('In highlightExecutiveSummaryForRequest(). bwBudgetRequestId: ' + bwBudgetRequestId);

            var elementId = 'divExecutiveSummaryCard_' + bwBudgetRequestId;
            if (document.getElementById(elementId) && (document.getElementById(elementId) != null)) {
                document.getElementById(elementId).style.border = '2px solid red';
                document.getElementById(elementId).style.backgroundColor = 'lightgoldenrodyellow';
            }


        } catch (e) {
            console.log('Exception in highlightExecutiveSummaryForRequest(): ' + e.message + ', ' + e.stack);
        }
    };

    exports.unHighlightExecutiveSummaryForRequest = function (bwBudgetRequestId) {
        try {
            console.log('In unHighlightExecutiveSummaryForRequest(). bwBudgetRequestId: ' + bwBudgetRequestId);

            var elementId = 'divExecutiveSummaryCard_' + bwBudgetRequestId;
            if (document.getElementById(elementId) && (document.getElementById(elementId) != null)) {
                document.getElementById(elementId).style.border = '2px dotted green';
                document.getElementById(elementId).style.backgroundColor = 'white';
            }

        } catch (e) {
            console.log('Exception in unHighlightExecutiveSummaryForRequest(): ' + e.message + ', ' + e.stack);
        }
    };

    exports.generateExecutiveSummaryHtml = function () { //title, projectTitle, briefDescriptionOfProject, bwWorkflowAppId, bwBudgetRequestId, bwOrgid, bwOrgName, element) {
        try {
            console.log('In bwCommonScripts.js.generateExecutiveSummaryHtml().');
            alert('In bwCommonScripts.js.generateExecutiveSummaryHtml().');

            // These get loaded when the "generateHomePageNotificationScreenHtml()" method gets called.
            //var bwWorkflowAppId = bwCommonScripts.bwWorkflowAppId;
            //var invitationData = bwCommonScripts.invitationData;
            var taskData = bwCommonScripts.taskData;
            //var tenantData = bwCommonScripts.tenantData;
            //var participantsData = bwCommonScripts.participantsData;
            //var brData = bwCommonScripts.brData;
            //var myBrData = bwCommonScripts.myBrData;

            var thiz = this;

            var html = '';
            var renderedBudgetRequests = [];
            for (var i = 0; i < taskData.length; i++) {
                var budgetRequestId = taskData[i].bwRelatedItemId;
                if (renderedBudgetRequests.indexOf(budgetRequestId) > -1) {
                    // Do nothing, this one is already displayed.
                } else {
                    renderedBudgetRequests.push(budgetRequestId);

                    var taskTitle = taskData[i].bwTaskTitle;
                    var appWebUrl = appweburl;
                    var arName = taskData[i].Title; // DUPLICATE
                    var projectTitle = taskData[i].ProjectTitle;
                    var title = taskData[i].Title;
                    var budgetAmount = taskData[i].BudgetAmount;
                    var requestedCapital = taskData[i].RequestedCapital;
                    var requestedExpense = taskData[i].RequestedExpense;
                    var taskType = taskData[i].TaskType;
                    var bwAssignedToRaciRoleAbbreviation = taskData[i].bwAssignedToRaciRoleAbbreviation;
                    var bwAssignedToRaciRoleName = taskData[i].bwAssignedToRaciRoleName;
                    var orgId = taskData[i].OrgId;
                    var orgName = taskData[i].OrgName;
                    var currentAmount = 0;
                    if (budgetAmount == 'null') {
                        currentAmount = Number(requestedCapital) + Number(requestedExpense);
                    } else {
                        currentAmount = budgetAmount;
                    }
                    var daysSinceTaskCreated = 0;
                    try {
                        var cd = taskData[i].bwDueDate;
                        var year = cd.split('-')[0];
                        var month = cd.split('-')[1];
                        var day = cd.split('-')[2].split('T')[0];
                        var taskCreatedDate = new Date(Number(year), Number(month) - 1, Number(day) - 1); // +1 because we're using overdue date.
                        var todaysDate = new Date();
                        var utc1 = Date.UTC(taskCreatedDate.getFullYear(), taskCreatedDate.getMonth(), taskCreatedDate.getDate());
                        var utc2 = Date.UTC(todaysDate.getFullYear(), todaysDate.getMonth(), todaysDate.getDate());
                        var _MS_PER_DAY = 1000 * 60 * 60 * 24;
                        daysSinceTaskCreated = Math.floor((utc2 - utc1) / _MS_PER_DAY);
                    } catch (e) {
                        // TODD: THIS NEEDS TO BE REEXAMINED, we are catching this error when the new recurring tasks came into play! //thisMustBeADifferentKindOfTask = true;
                    }







                    // 1-12-2022
                    //html += '<div style="float:left;" onclick="alert(\'This functionality is incomplete. Coming soon! budgetRequestId: ' + budgetRequestId + '\');">';
                    html += '<div style="float:left;" onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'' + budgetRequestId + '\', \'\', \'\', \'\', \'\', \'\');">';

                    // onclick="$('.bwRequest').bwRequest('displayArInDialog','https://budgetworkflow.com', \'' + budgetRequestId + '\', 'BR-200004', 'Car', 'BR-200004', 'ADMIN', '00903c76-5072-4aa3-b344-e57d6df175bd');"













                    html += '<table class="tdExecutiveSummaries"  id="divExecutiveSummaryCard_' + budgetRequestId + '" style="border:2px dotted green;">';
                    html += '  <tr>';
                    html += '    <td style="text-align:center;vertical-align:top;">';
                    html += '      <img id="imgRequestOrgImage2" src="' + globalUrlPrefix + globalUrl + '/images/corporeal.png" style="width:60px;height:60px;" />';

                    html += '        <br />';
                    // The "under the org image" text
                    html += '<span style="font-size:10pt;">';
                    html += orgName;
                    html += '</span>';

                    html += '    </td>';
                    html += '    <td style="vertical-align:top;">';
                    html += '      <span id="spanRowHoverDetails_AuditTrail_CurrentRACIStatus" style="font-size:10pt;">';
                    html += '        <span style="font-size:30pt;font-weight:bold;">' + title + ': ' + projectTitle + '</span>';
                    html += '        <br />';
                    html += '        <span id="spanExecutiveSummaryPrimaryImages_' + budgetRequestId + '">';
                    html += '           [no image]';
                    html += '        </span>';
                    html += '      </span>';
                    html += '    </td>';
                    html += '  </tr>';
                    html += '</table>';
                    html += '</div>';
                }
            }

            return html;

        } catch (e) {
            console.log('Exception in generateExecutiveSummaryHtml(): ' + e.message + ', ' + e.stack);
            alert('Exception in generateExecutiveSummaryHtml(): ' + e.message + ', ' + e.stack);
        }
    };

    exports.populateExecutiveSummaryHtml_PrimaryImages = function () {
        try {
            console.log('In bwCommonScripts.js.populateExecutiveSummaryHtml_PrimaryImages().');
            alert('In bwCommonScripts.js.populateExecutiveSummaryHtml_PrimaryImages().');

            var taskData = bwCommonScripts.taskData;
            for (var i = 0; i < taskData.length; i++) {
                var bwWorkflowAppId = bwCommonScripts.bwWorkflowAppId;
                var bwBudgetRequestId = taskData[i].bwRelatedItemId;
                //debugger;
                var operationUri = globalUrlPrefix + globalUrl + '/_files/' + 'getprimaryimageforbudgetrequest/' + bwWorkflowAppId + '/' + bwBudgetRequestId; // _files allows us to use nginx to route these to a dedicated file server.
                $.ajax({
                    url: operationUri,
                    method: "GET",
                    timeout: ajaxTimeout,
                    headers: { "Accept": "application/json; odata=verbose" },
                    success: function (data) {
                        try {
                            //debugger;


                            //
                            var bwBudgetRequestId;
                            if (data[0]) {
                                bwBudgetRequestId = data[0].bwBudgetRequestId;
                            }
                            var html = '';
                            try {
                                for (var i = 0; i < data.length; i++) {
                                    if (bwBudgetRequestId) {
                                        var fileName = data[i].Filename;
                                        if (fileName.toUpperCase().indexOf('.XLSX') > -1 || fileName.toUpperCase().indexOf('.XLS') > -1) {
                                            html += '<img src="images/excelicon.png" style="width:100px;height:46px;cursor:pointer;" />';
                                        } else {
                                            var imageUrl = globalUrlPrefix + globalUrl + '/_files/' + bwWorkflowAppId + '/' + bwBudgetRequestId + '/' + fileName;
                                            html += '<img src="' + imageUrl + '" style="height:150px;" />';
                                        }
                                    }
                                }

                            } catch (e) {
                                console.log('Didn\'t find an image for data: ' + JSON.stringify(data));
                                html = '[no image found]';
                                //document.getElementById('spanExecutiveSummaryPrimaryImages_' + bwBudgetRequestId).innerHTML = html;
                            }
                            if (bwBudgetRequestId) {
                                document.getElementById('spanExecutiveSummaryPrimaryImages_' + bwBudgetRequestId).innerHTML = html;
                            }
                        } catch (e) {
                            if (e.number) {
                                displayAlertDialog('Error in populateExecutiveSummaryHtml_PrimaryImages():1-1: ' + e.number + ', "' + e.message + '", ' + e.stack);
                            } else {
                                // This most likely means that the folders are there on the file services server, but there is nothing in them.
                                //
                                // Fileservices has an error, so show nothing! We will put a red exclamation pin in the attachments section eventually! - 10-1-17 todd
                                //displayAlertDialog('Fileservices has an error: ' + ' "' + e.message + '"');
                            }
                        }
                    },
                    error: function (data, errorCode, errorMessage) {
                        if (errorCode === 'timeout' && errorMessage === 'timeout') {
                            displayAlertDialog('SERVICE UNAVAILABLE. File services is not respondingxcx2. communication timeout is set at ' + ajaxTimeout / 1000 + ' seconds: ' + errorCode + ', ' + errorMessage);
                        } else {

                            console.log('Error in populateExecutiveSummaryHtml_PrimaryImages:2:1 ' + errorCode + ', ' + errorMessage);

                            displayAlertDialog('Error in populateExecutiveSummaryHtml_PrimaryImages:2:1 ' + errorCode + ', ' + errorMessage);
                            // The latest error 1-17-2018 is errorCode:'error' and errorMessage:'Not Found'.
                            // What does this mean? You can replicate this error!
                            // at Url: https://budgetworkflow.com/ios8.html, view an offline (Un-submitted) request, and try to add an attachment.
                        }
                    }
                });
            }
        } catch (e) {
            console.log('Exception in bwCommonScripts.js.populateExecutiveSummaryHtml_PrimaryImages(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwCommonScripts.js.populateExecutiveSummaryHtml_PrimaryImages(): ' + e.message + ', ' + e.stack);
        }
    };


})(typeof exports === 'undefined' ? this['bwCommonScripts'] = {} : exports);










