
//
// This code is used by the webservices on the back end in the node 'routes' folder, and also used by the front end in the 'sharedclientandserverscripts' folder.
//

//var globalUrlPrefix = 'https://';
var globalUrl = 'shareandcollaborate.com';
var imageRootPath = 'https://' + globalUrl;
var httpsHostForInterServerCommunication = 'shareandcollaborate.com';

var https = require('https');

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
    exports.getBudgetWorkflowStandardizedDate = function (timestamp) {
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

        } catch (e) {

            if (timestamp.toString().toLowerCase().indexOf('invalid') > -1) {
                //return '[invalid date]' + '[' + timestamp + ']' + e.message + ', ' + e.stack;
                return '[invalid date]';
            } else {
                if (e.message.toString().toLowerCase().indexOf('invalid') > -1) {
                    return '[invalid date]';
                } else {
                    console.log('Exception in bwAUthentication.js.getBudgetWorkflowStandardizedDate(): timestamp: ' + timestamp + ', ' + e.message + ', ' + e.stack);
                    //displayAlertDialog('Exception in bwAUthentication.js.getBudgetWorkflowStandardizedDate(): timestamp: ' + timestamp + ', ' + e.message + ', ' + e.stack);
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

                var msg = 'In bwCommonScripts.js.getExecutiveSummaryHtml(). JUST A NOTE TO LET YOU KNOW I MADE IT HERE. 6-20-2024.';
                var threatLevel = 'elevated'; // severe, high, elevated, guarded, low.
                var source = 'bwCommonScripts.js.getExecutiveSummaryHtml()';
                var errorCode = null;
                WriteToErrorLog(threatLevel, source, errorCode, msg);

                var requestTypes = '[]'; // THIS CANNOT BE ON THE SERVER SO FIX THIS!!!!!!!!!!!!!!!!! // $('.bwAuthentication').bwAuthentication('option', 'bwEnabledRequestTypes').EnabledItems;

                var bwBudgetRequest = object;

                var bwWorkflowTaskItem = object;

                var htmlTop = '';
                var htmlBottom = '';

                if (objectType == 'bwBudgetRequest') {

                    htmlTop += '<br />';

                    if (bwBudgetRequest.Title) {

                        if (executiveSummaryElement) { // Check if client or server side.
                            // This is where we display the "Pin". If it is pinned, or if it is not pinned.
                            var pinnedRequestsArray = $('.bwAuthentication:first').bwAuthentication('option', 'PinnedRequests');
                            if (pinnedRequestsArray && pinnedRequestsArray.length) {

                                if (pinnedRequestsArray.indexOf(bwBudgetRequest.bwBudgetRequestId) > -1) {
                                    htmlTop += '   <span style="font-size:12pt;"><span style="color:black;font-size:18pt;font-weight:bold;">' + bwBudgetRequest.Title + '</span></span>';
                                    htmlTop += '           <div title="un-pin" class="pinButton" style="display:inline-block;font-size:18pt;cursor:pointer !important;float:right;" onclick="$(\'.bwRequest\').bwRequest(\'pinRequest\', \'' + bwBudgetRequest.bwBudgetRequestId + '\', \'' + 'requestDialogId' + '\', false);"><img src="/images/unpin.png" style="width:50px;height:50px;cursor:pointer !important;" /></div>';
                                } else {
                                    htmlTop += '   <span style="font-size:12pt;"><span style="color:black;font-size:18pt;font-weight:bold;">' + bwBudgetRequest.Title + '</span></span>';
                                    htmlTop += '           <div title="pin" class="pinButton" style="display:inline-block;font-size:18pt;cursor:pointer !important;float:right;" onclick="$(\'.bwRequest\').bwRequest(\'pinRequest\', \'' + bwBudgetRequest.bwBudgetRequestId + '\', \'' + 'requestDialogId' + '\', true);"><img src="/images/pin.png" style="width:50px;height:50px;cursor:pointer !important;" /></div>';
                                }

                            } else {

                                htmlTop += '   <span style="font-size:12pt;"><span style="color:black;font-size:18pt;font-weight:bold;">' + bwBudgetRequest.Title + '</span></span>';
                                htmlTop += '           <div title="pin" class="pinButton" style="display:inline-block;font-size:18pt;cursor:pointer !important;float:right;" onclick="$(\'.bwRequest\').bwRequest(\'pinRequest\', \'' + bwBudgetRequest.bwBudgetRequestId + '\', \'' + 'requestDialogId' + '\', true);"><img src="/images/pin.png" style="width:50px;height:50px;cursor:pointer !important;" /></div>';

                            }
                        } else {

                            htmlTop += '   <span style="font-size:12pt;"><span style="color:black;font-size:18pt;font-weight:bold;">' + bwBudgetRequest.Title + '</span></span>';

                        }

                    } else {
                        htmlTop += '   <span style="font-size:12pt;"><span style="color:lightgray;font-size:18pt;font-weight:bold;">New ' + requestType + '</span></span>'; // This is a new request.
                    }
                    htmlTop += '   <br />';
                    htmlTop += '   <span xcx="xcx2312-1-x" style="display:inline-block;color:black;font-size:30pt;font-weight:bold;overflow:hidden;white-space:normal;">' + bwBudgetRequest.ProjectTitle + '</span>';
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

                            var strippedHtml = tmpbwRequestJson.bwJustificationDetailsField.value.replace(/<br>/g, '\n').replace(/"/g, '&quot;');
                            strippedHtml = strippedHtml.replace(/<div>/g, '');
                            strippedHtml = strippedHtml.replace(/<\/div>/g, '\n');

                            strippedHtml = strippedHtml.replace(/<span>/g, '');
                            strippedHtml = strippedHtml.replace(/<\/span>/g, '');

                            strippedHtml = strippedHtml.replace(/</g, '&lt;');
                            strippedHtml = strippedHtml.replace(/>/g, '&gt;');

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
                            htmlTop += '   <span style="color:black;font-size:12pt;font-weight:normal;">Invoice total: <span style="color:purple;font-size:18pt;">' + InvoiceTotal_cleaned + isPaidText + '</span></span>';
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

                    htmlBottom += '   <hr style="color:skyblue;" />';

                    if (bwBudgetRequest.BudgetWorkflowStatus) {
                        if (bwBudgetRequest.BudgetWorkflowStatus.toString().toLowerCase() == 'collaboration') {
                            htmlBottom += '<span style="color:black;font-size:18pt;font-weight:bold;">Workflow step: ' + bwBudgetRequest.BudgetWorkflowStatus + '</span>';
                        } else {
                            htmlBottom += '<span style="color:black;font-size:18pt;font-weight:bold;">Workflow step: ' + bwBudgetRequest.BudgetWorkflowStatus + '</span>';
                        }
                    } else {
                        htmlBottom += '<span style="color:black;font-size:18pt;font-weight:bold;">Workflow step: ' + 'xcx99345 invalid BudgetWorkflowStatus' + '</span>';
                    }

                    htmlBottom += '   <br />';
                    htmlBottom += '   <span style="color:black;font-size:12pt;font-weight:normal;">Approvers: [xcxappovers1]</span>';
                    htmlBottom += '   <br />';
                    htmlBottom += '   <span style="color:black;font-size:12pt;font-weight:normal;">Collaborators: [xcxcollaborators]</span>';
                    htmlBottom += '   <br />';
                    htmlBottom += '   <span style="color:black;font-size:12pt;font-weight:normal;">Informed: [xcxinformed]</span>';
                    htmlBottom += '   <br />';

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

                    bwWorkflowTaskItem["bwBudgetRequestId"] = bwWorkflowTaskItem.bwRelatedItemId;


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
                    // Display the bwJustificationDetailsField in the executive summary. 
                    if (bwWorkflowTaskItem.bwRequestJson) {
                        var tmpbwRequestJson = JSON.parse(bwWorkflowTaskItem.bwRequestJson);
                        if (tmpbwRequestJson.bwJustificationDetailsField && tmpbwRequestJson.bwJustificationDetailsField.value) {
                            var ellippses = '';
                            if (String(tmpbwRequestJson.bwJustificationDetailsField.value).length > 255) {
                                ellippses = '...';
                            }

                            var strippedHtml = tmpbwRequestJson.bwJustificationDetailsField.value.replace(/<[^>]+>/g, '');
                            html += '   <div xcx="xcx2312-1-x2-2" style="color:darkgray;font-size:15pt;font-weight:bold;white-space:normal;max-width:750px;overflow:hidden;">' + String(strippedHtml).substring(0, 255) + ' ' + ellippses + '</div>';
                            html += '   <br />';
                        }
                    } else {
                        console.log('Error in bwCommonScripts.js.getExecutiveSummaryHtml(). No value for bwWorkflowTaskItem.bwRequestJson: ' + bwWorkflowTaskItem.bwRequestJson);
                        alert('Error in bwCommonScripts.js.getExecutiveSummaryHtml(). No value for bwWorkflowTaskItem.bwRequestJson: ' + bwWorkflowTaskItem.bwRequestJson);
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
                                    html += '   <div class="executiveSummaryInCarousel" id="' + 'carouselItem_Id' + '" title="Executive Summary for BR-2xxxxxx. Click to log in and view the request details. xcx231466534-7-2" alt="xcx231466534-7" bwbudgetrequestid="' + bwBudgetRequest.bwBudgetRequestId + '"  ';
                                    var ProjectTitle_clean = String(bwBudgetRequest.ProjectTitle).replace(/["]/g, '&quot;').replace(/[']/g, '\\&#39;'); //&#39;'); // This is done because if the ProjectTitle (description) has a quote in it, there will be issues! The click event will fail to invoke the method.
                                    html += '   xcx="342523326-2-9"    onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\', ' + bwBudgetRequest.TrashBin + ', \'' + bwBudgetRequest.bwBudgetRequestId + '\', \'' + bwBudgetRequest.Title + '\', \'' + ProjectTitle_clean + '\', \'' + bwBudgetRequest.Title + '\', \'' + bwRequestJson.bwAssignedToRaciRoleAbbreviation;
                                    html += '\', \'' + '7777xcx7777777-1' + '\');" ';
                                    html += '   >';
                                    //html += '<br />';

                                    //html += htmlTop + htmlMiddle + htmlBottom + '</div></div></a>';

                                    var msg = 'In webservices.bwCommonScripts.js.getExecutiveSummaryHtml(). xcx34265.';
                                    var threatLevel = 'elevated'; // severe, high, elevated, guarded, low.
                                    var source = 'webservices.bwCommonScripts.js.getExecutiveSummaryHtml()';
                                    var errorCode = null;
                                    WriteToErrorLog(threatLevel, source, errorCode, msg);


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
                                var threatLevel = 'severe'; // severe, high, elevated, guarded, low.
                                var source = 'start.js.bwCommonScripts.js.getExecutiveSummaryHtml()';
                                var errorCode = null;
                                WriteToErrorLog(threatLevel, source, errorCode, msg);

                                var result = {
                                    status: 'EXCEPTION',
                                    message: msg
                                }
                                reject(result);

                            }
                        }).catch(function (e) {

                            var msg = 'Exception in bwCommonScripts.js.getExecutiveSummaryHtml(): ' + JSON.stringify(e);
                            var threatLevel = 'severe'; // severe, high, elevated, guarded, low.
                            var source = 'start.js.bwCommonScripts.js.getExecutiveSummaryHtml()';
                            var errorCode = null;
                            WriteToErrorLog(threatLevel, source, errorCode, msg);

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
                        html += '   <div class="executiveSummaryAttachments" id="bwExecutiveSummariesCarousel_spanBwExecutiveSummariesCarouselPrimaryImages_MyUnsubmittedRequests_' + bwBudgetRequest.bwBudgetRequestId + '" style="text-align: center;"></div>';
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
                        var threatLevel = 'severe'; // severe, high, elevated, guarded, low.
                        var source = 'bwCommonScripts.js.getExecutiveSummaryHtml()';
                        var errorCode = null;
                        WriteToErrorLog(threatLevel, source, errorCode, msg);

                        console.log(msg);
                        //displayAlertDialog(msg);

                        var result = {
                            status: 'ERROR',
                            message: msg,
                            html: msg
                        }
                        reject(result);

                    }

                }

            } catch (e) {

                var msg = 'Exception in bwCommonScripts.js.getExecutiveSummaryHtml(): ' + e.message + ', ' + e.stack;
                var threatLevel = 'severe'; // severe, high, elevated, guarded, low.
                var source = 'bwCommonScripts.js.getExecutiveSummaryHtml()';
                var errorCode = null;
                WriteToErrorLog(threatLevel, source, errorCode, msg);

                console.log(msg);
                //displayAlertDialog('Exception in bwCommonScripts.js.getExecutiveSummaryHtml(): ' + e.message + ', ' + e.stack);

                var result = {
                    status: 'EXCEPTION',
                    message: msg,
                    html: 'Exception in bwCommonScripts.js.getExecutiveSummaryHtml(): ' + e.message + ', ' + e.stack
                }
                reject(result);

            }

        })
    }


    exports.renderInventoryItems_ForExecutiveSummary = function (bwBudgetRequestId, bwBudgetRequest, executiveSummaryElement, forceRenderTheImageThumbnail) { // forceRenderTheImageThumbnail is used for hover-overs, because most likely the user will want to see the thumbnail.
        var thiz = this;
        return new Promise(function (resolve, reject) {
            try {
                console.log('In bwCommonScripts.js.renderInventoryItems_ForExecutiveSummary().');

                var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

                // I have a couple of these. They are weird because there are so few JSON properties. Is it from a long time ago? Hmmm...:
                // ************Error in bwCommonScripts.js.renderInventoryItems_ForExecutiveSummary(). Invalid value for bwBudgetRequest.bwRequestJson. bwBudgetRequest: {"_id":"62df046c30a68c5a1869a196","bwBudgetRequestId":"b77120e7-0133-4aa1-bf16-a21bc65be10d","bwWorkflowAppId":"c48535a4-9a6b-4b95-9d67-c6569e9695d8","FileConversionQueued":false,"__v":0}
                // ************Error in bwCommonScripts.js.renderInventoryItems_ForExecutiveSummary(). Invalid value for bwBudgetRequest.bwRequestJson. bwBudgetRequest: {"_id":"62df03ddd81361e745819582","bwBudgetRequestId":"e2c262ab-1671-48bd-881f-83f16b3fd1cc","bwWorkflowAppId":"c48535a4-9a6b-4b95-9d67-c6569e9695d8","FileConversionQueued":false,"__v":0}
                if (!bwBudgetRequest.bwRequestJson) {
                    displayAlertDialog('************Error in bwCommonScripts.js.renderInventoryItems_ForExecutiveSummary(). Invalid value for bwBudgetRequest.bwRequestJson. bwBudgetRequest: ' + JSON.stringify(bwBudgetRequest));
                }

                var bwRequestJson = JSON.parse(bwBudgetRequest.bwRequestJson);

                // Display inventory images
                //
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

            } catch (e) {

                console.log('Exception in bwCommonScripts.js.renderInventoryItems_ForExecutiveSummary(): ' + e.message + ', ' + e.stack);
                displayAlertDialog('Exception in bwCommonScripts.js.renderInventoryItems_ForExecutiveSummary(): ' + e.message + ', ' + e.stack);
                var result = {
                    status: 'EXCEPTION',
                    message: 'Exception in bwCommonScripts.js.renderInventoryItems_ForExecutiveSummary(): ' + e.message + ', ' + e.stack
                }
                return result;

            }
        });
    }

    exports.renderAttachments_ForExecutiveSummary = function (bwBudgetRequestId, executiveSummaryElement, forceRenderTheImageThumbnail) { // forceRenderTheImageThumbnail is used for hover-overs, because most likely the user will want to see the thumbnail.
        var thiz = this;
        return new Promise(function (resolve, reject) {
            try {
                console.log('In bwCommonScripts.js.renderAttachments_ForExecutiveSummary().');

                forceRenderTheImageThumbnail = true; // I want to see the thumbnails at the moment, but will comment this line out when the optimized image loading is implemented. 8-26-2023.

                //if (!(bwBudgetRequestId && bwWorkflowTaskItemId)) {
                if (!(bwBudgetRequestId)) {

                    console.log('In bwCommonScripts.js.renderAttachments_ForExecutiveSummary(). Unexpected value(s) for bwBudgetRequestId and/or bwWorkflowTaskItemId. bwBudgetRequestId: ' + bwBudgetRequestId); //  + ', bwWorkflowTaskItemId: ' + bwWorkflowTaskItemId);
                    displayAlertDialog('In bwCommonScripts.js.renderAttachments_ForExecutiveSummary(). Unexpected value(s) for bwBudgetRequestId and/or bwWorkflowTaskItemId. bwBudgetRequestId: ' + bwBudgetRequestId); //  + ', bwWorkflowTaskItemId: ' + bwWorkflowTaskItemId);

                } else {

                    console.log('In bwCommonScripts.js.renderAttachments_ForExecutiveSummary(). bwBudgetRequestId: ' + bwBudgetRequestId); // + ', bwWorkflowTaskItemId: ' + bwWorkflowTaskItemId);
                    var thiz = this;

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

                                        var li = document.createElement('li');

                                        var extensionIndex = filename.split('.').length - 1;
                                        var fileExtension = filename.toLowerCase().split('.')[extensionIndex];
                                        if ((fileExtension == 'xlsx') || (fileExtension == 'xls')) {

                                            //html += '<img xcx="xcx443321-1" src="images/excelicon.png" style="width:100px;height:46px;cursor:pointer;" />';

                                            var img = document.createElement('img');
                                            img.style.height = '150px';
                                            img.style.border = '1px solid gray';
                                            img.setAttribute('xcx', 'xcx443321-8-1-new-3');
                                            img.setAttribute('bwsrc', fileUrl_Thumbnail);
                                            img.src = '/images/excelicon.png';

                                            li.append(img);

                                        } else if (fileExtension == 'pdf') {

                                            //
                                            //
                                            // THIS IS WHERE WE ARE TRYING TO IMPLEMENT IMG thumbnails which we can pause/stop the loading of, in order to improve responsiveness.
                                            //
                                            //

                                            var img = document.createElement('img');
                                            img.style.height = '150px';
                                            img.style.border = '1px solid gray';
                                            img.setAttribute('xcx', 'xcx443321-8-1-new-3');
                                            img.setAttribute('bwsrc', fileUrl_Thumbnail);
                                            img.src = '/images/noimageavailable.png';

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

                                                var img = document.createElement('img');
                                                img.style.height = '150px';
                                                img.style.border = '1px solid gray';
                                                img.setAttribute('xcx', 'xcx443321-8-1-new-3');
                                                if (!forceRenderTheImageThumbnail) {
                                                    img.setAttribute('bwsrc', fileUrl_Thumbnail);
                                                    img.src = '/images/noimageavailable.png';
                                                } else {
                                                    img.src = fileUrl_Thumbnail;
                                                }

                                                li.append(img);

                                            }

                                        } else if (fileExtension == 'rtf') {

                                            var img = document.createElement('img');
                                            img.style.height = '150px';
                                            img.style.border = '1px solid gray';
                                            img.setAttribute('xcx', 'xcx443321-8-1-new-3');
                                            img.setAttribute('bwsrc', fileUrl_Thumbnail);
                                            img.src = '/images/rtf.png';

                                            li.append(img);

                                        } else if (fileExtension == 'vob') {

                                            var img = document.createElement('img');
                                            img.style.height = '150px';
                                            img.style.border = '1px solid gray';
                                            img.setAttribute('xcx', 'xcx443321-8-1-new-3');
                                            img.setAttribute('bwsrc', fileUrl_Thumbnail);
                                            img.src = '/images/vob.png';

                                            li.append(img);

                                        } else if (fileExtension == 'mp3') {

                                            var img = document.createElement('img');
                                            img.style.height = '150px';
                                            img.style.border = '1px solid gray';
                                            img.setAttribute('xcx', 'xcx443321-8-1-new-3');
                                            img.setAttribute('bwsrc', fileUrl_Thumbnail);
                                            img.src = '/images/mp3.png';

                                            li.append(img);

                                        } else if (fileExtension == 'zip') {

                                            var img = document.createElement('img');
                                            img.style.height = '150px';
                                            img.style.border = '1px solid gray';
                                            img.setAttribute('xcx', 'xcx443321-8-1-new-3');
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

                                                var img = document.createElement('img');
                                                img.style.height = '150px';
                                                img.style.border = '1px solid gray';
                                                img.setAttribute('xcx', 'xcx443321-8-1-new-3');
                                                if (!forceRenderTheImageThumbnail) {
                                                    img.setAttribute('bwsrc', fileUrl_Thumbnail);
                                                    img.src = '/images/noimageavailable.png';
                                                } else {
                                                    img.src = fileUrl_Thumbnail;
                                                }

                                                li.append(img);

                                            } else {


                                                //
                                                //
                                                // THIS IS WHERE WE ARE TRYING TO IMPLEMENT IMG thumbnails which we can pause/stop the loading of, in order to improve responsiveness.
                                                //
                                                //

                                                var img = document.createElement('img');
                                                img.style.height = '150px';
                                                img.style.border = '1px solid gray';
                                                img.style.maxWidth = '500px';
                                                img.style.borderRadius = '0 30px 0 0';
                                                img.setAttribute('xcx', 'xcx443321-8-1-new-3');
                                                if (!forceRenderTheImageThumbnail) {
                                                    img.setAttribute('bwsrc', fileUrl_Thumbnail);
                                                    img.src = '/images/noimageavailable.png';
                                                } else {
                                                    img.src = fileUrl_Thumbnail;
                                                }

                                                li.append(img);

                                                var developerModeEnabled = $('.bwAuthentication').bwAuthentication('option', 'developerModeEnabled');

                                                if (developerModeEnabled == true) {
                                                    html += '   onmouseenter="$(\'.bwCoreComponent:first\').bwCoreComponent(\'showThumbnailHoverDetails\', \'' + bwEncodeURIComponent(JSON.stringify(results.data[i])) + '\', \'' + bwBudgetRequestId + '\', this);this.style.backgroundColor=\'lightgoldenrodyellow\';" ';
                                                    html += '   onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');"'; //this.style.backgroundColor=\'white\';"';
                                                }

                                            }

                                        }

                                        ul.appendChild(li);

                                    }

                                    var executiveSummaryAttachmentsElement = $(executiveSummaryElement).find('.executiveSummaryAttachments')[0];
                                    $(executiveSummaryAttachmentsElement).append(div);

                                }

                                var result = {
                                    status: 'SUCCESS',
                                    message: 'SUCCESS'
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
                        error: function (jqXHR, settings, errorThrown) {

                            //if (errorCode === 'timeout' && errorMessage === 'timeout') {
                            //    displayAlertDialog('SERVICE UNAVAILABLE. File services is not respondingxcx2. communication timeout is set at ' + ajaxTimeout / 1000 + ' seconds: ' + errorCode + ', ' + errorMessage);
                            //} else {

                            //    console.log('');
                            //    console.log('********************************************************************');
                            //    console.log('Error in bwExecutiveSummariesCarousel2.js.renderAttachments_ForExecutiveSummary:2:3 ' + errorCode + ', ' + errorMessage);
                            //    console.log('********************************************************************');
                            //    console.log('');

                            //    displayAlertDialog('Error in bwExecutiveSummariesCarousel2.js.renderAttachments_ForExecutiveSummary:2:3 ' + errorCode + ', ' + errorMessage);





                            // The latest error 1-17-2018 is errorCode:'error' and errorMessage:'Not Found'.
                            // What does this mean? You can replicate this error!
                            // at Url: https://budgetworkflow.com/ios8.html, view an offline (Un-submitted) request, and try to add an attachment.

                            //}


                            if (jqXHR.status == 401) { // HTTP 401 "Unauthorized".

                                console.log('HTTP 401 "Unauthorized".');
                                console.log('HTTP 401 "Unauthorized".');
                                console.log('Error in bwCommonScripts.js.renderAttachments_ForExecutiveSummary:2:3 Unauthorized. Please refresh your browser and log in again. jqXHR.status: ' + jqXHR.status + ', settings: ' + settings + ', errorThrown: ' + errorThrown);
                                console.log('HTTP 401 "Unauthorized".');
                                console.log('HTTP 401 "Unauthorized".');

                            } else {
                                var msg = 'Error in bwCommonScripts.js.renderAttachments_ForExecutiveSummary:2:3: ' + settings + ', ' + errorThrown + ' I suspect this may be a service unavailable error but not sure by any means! More investigation needed!' + JSON.stringify(jqXHR);
                                console.log(msg);
                                displayAlertDialog(msg);
                                var result = {
                                    status: 'ERROR',
                                    message: msg
                                }
                                reject(result);

                            }

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




    exports.generateHomePageNotificationScreenHtml3 = function (deferredIndex, appweburl, bwWorkflowAppId, invitationData, taskData, tenantData, participantsData, brData, myBrData, serverside) {
        try {
            console.log('In bwCommonScripts.js.generateHomePageNotificationScreenHtml3().');
            //alert('In bwCommonScripts.js.generateHomePageNotificationScreenHtml3().');

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
                renderFavicon(true);
            } else {
                document.title = 'No pending tasks'; // 4-18-2022 changed from 'No budget items'; //'My Budgetsxcx2';
                // Change the css to blue/blue.
                //swapStyleSheet("css/bw.core.colors.blue.blue.css");
                // Change the currency indicator to the one without the red dot. This obviously depends upon consistent naming!
                renderFavicon(false);
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

            displayAlertDialog('xcx2131341-3: PINNED_REQUESTS');

            var pinnedRequestsArray = $('.bwAuthentication:first').bwAuthentication('option', 'PinnedRequests');
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
            html += '                       <table id="buttonDisplayRequestsAsTiles_AllActiveRequests" class="divCarouselButton_Selected" onclick="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'renderExecutiveSummaries_AllActiveRequests\');">'; //, \'AllActiveRequests\', this);">';
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
            html += '       <td style="width:2%;" class="bwHPNDrillDownLinkCell2">xcx4443</td>';
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
                    var promise = $('.bwAuthentication').bwAuthentication('generateHomePageNotificationScreen', 1, queryData); // This calls bwCommonScripts.generateHomePageNotificationScreenHtml() eventually... // var func =
                    promise.then(function (result) {
                        try {

                            //displayAlertDialog(JSON.stringify(result));


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
                    }).catch(function () {

                        console.log('Exception in createEmailFromTemplate():4: ' + e.message + ', ' + e.stack);
                        var msg = 'Exception in createEmailFromTemplate():4: ' + e.message + ', ' + e.stack;
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
                    renderFavicon(true);
                } else {
                    document.title = 'No pending tasks'; // 4-18-2022 changed from 'No budget items'; //'My Budgetsxcx2';
                    // Change the css to blue/blue.
                    //swapStyleSheet("css/bw.core.colors.blue.blue.css");
                    // Change the currency indicator to the one without the red dot. This obviously depends upon consistent naming!
                    renderFavicon(false);
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

    exports.getThumbnails_64Bit = function (bwWorkflowAppId, bwBudgetRequestId) {
        return new Promise(function (resolve, reject) {
            try {
                console.log('In start.js.getThumbnails_64Bit(). bwWorkflowAppId: ' + bwWorkflowAppId + ', bwBudgetRequestId: ' + bwBudgetRequestId + ', httpsHostForInterServerCommunication: ' + httpsHostForInterServerCommunication); // HOW DO WE SECURE THIS WEB SERVICE CALL????????? We can't use the current users authorization because Timer services may be doing it sometimes via CreateParticipantTask().

                var passcode = 'dsaffsdhg980023497235kjl;gdfs98g734985ytgadfhjfgjkgdhkdgf3e5346t356j'; // This is an internally used code. The file services will only respond to this code from /_files/getprimaryimageforbudgetrequest_64bitString().

                //return https.get({
                https.get({
                    host: httpsHostForInterServerCommunication, // shareandcollaborate.com
                    path: '/_files/getprimaryimageforbudgetrequest_64bitString/' + bwWorkflowAppId + '/' + bwBudgetRequestId + '/' + passcode,
                    timeout: 2000 // If we can't get an immediate response, then forget it (2 seconds).... we don't want to hold up the UI when this is called when a user Approves etc. added not tested 5-22-2023 <<<<<<<<
                    //lookup: cacheable.lookup
                }, function (response) {
                    try {

                        var body = ''; // Continuously update stream with data

                        // >>>>> body is an array of this object:
                        //var fileData = {
                        //    bwBudgetRequestId: bwBudgetRequestId,
                        //    Filename: files[i],

                        //    File64bit: contents, 

                        //    Description: description
                        //};
                        //result.push(fileData);

                        response.on('error', function (error) {
                            try {

                                var msg = 'In getThumbnails_64Bit.response.error(): ' + error;
                                console.log(msg);
                                var threatLevel = 'high'; // severe, high, elevated, guarded, low.
                                var source = 'getThumbnails_64Bit()';
                                var errorCode = null;
                                WriteToErrorLog(threatLevel, source, errorCode, msg);

                                reject(msg);

                            } catch (e) {

                                var msg = 'Exception in getThumbnails_64Bit.response.error(): ' + e.message + ', ' + e.stack;
                                console.log(msg);
                                var threatLevel = 'severe'; // severe, high, elevated, guarded, low.
                                var source = 'getThumbnails_64Bit()';
                                var errorCode = null;
                                WriteToErrorLog(threatLevel, source, errorCode, msg);

                                reject(msg);

                            }
                        });

                        response.on('data', function (d) {
                            try {
                                body += d;
                            } catch (e) {

                                var msg = 'Exception in getThumbnails_64Bit.response.data(): ' + e.message + ', ' + e.stack;
                                console.log(msg);
                                var threatLevel = 'severe'; // severe, high, elevated, guarded, low.
                                var source = 'getThumbnails_64Bit()';
                                var errorCode = null;
                                WriteToErrorLog(threatLevel, source, errorCode, msg);

                            }
                        });

                        response.on('end', function () {
                            try {

                                console.log('');
                                console.log('');
                                console.log('In getThumbnails_64Bit(). THE FILE HAS BEEN retrieved from /_files/getprimaryimageforbudgetrequest_64bitString().');
                                console.log('');
                                console.log('');

                                var result = {
                                    status: 'SUCCESS',
                                    message: 'SUCCESS',
                                    files: body
                                }

                                resolve(result);

                            } catch (e) {

                                var msg = 'Exception in getThumbnails_64Bit.response.end():1: ' + e.message + ', ' + e.stack;
                                console.log(msg);
                                var threatLevel = 'severe'; // severe, high, elevated, guarded, low.
                                var source = 'getThumbnails_64Bit()';
                                var errorCode = null;
                                WriteToErrorLog(threatLevel, source, errorCode, msg);

                                reject(msg);

                            }
                        });
                    } catch (e) {

                        var msg = 'Exception in getThumbnails_64Bit():2: ' + e.message + ', ' + e.stack;
                        console.log(msg);
                        var threatLevel = 'severe'; // severe, high, elevated, guarded, low.
                        var source = 'getThumbnails_64Bit()';
                        var errorCode = null;
                        WriteToErrorLog(threatLevel, source, errorCode, msg);

                        reject(msg);

                    }
                });

            } catch (e) {

                var msg = 'Exception in getThumbnails_64Bit(): ' + e.message + ', ' + e.stack;
                console.log(msg);
                var threatLevel = 'severe'; // severe, high, elevated, guarded, low.
                var source = 'getThumbnails_64Bit()';
                var errorCode = null;
                WriteToErrorLog(threatLevel, source, errorCode, msg);

                reject(msg);

            }
        })
    }


})(typeof exports === 'undefined' ? this['bwCommonScripts'] = {} : exports);










