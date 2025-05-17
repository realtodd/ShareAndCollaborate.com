$.widget("bw.bwTimelineAggregator", {
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
        This is the bwTimelineAggregator.js jQuery Widget. 
        ===========================================================

            This widget is intended to be invoked from the bwDataGrid.js (All Requests) widget ellipses menu.

            In the future, perhaps it can also manifest as a floating dialog, kind of like the Configuration > Forms > Toolbox.
                - A user could drag requests onto it, and it create a history which will be ordered on a timeline to view.

            Usage:
                - Currently, go to "All Requests". Use the request type picker, date pickers, etc. to produce your result set.
                    - Then select the ellipses menu "...", and choose "Produce Timeline".

            This widget has a bright future, it is very basic at the moment. 2-11-2024.

            ------------------------------------
            How is the timeline data aggregated?
            ------------------------------------
            Use Case #1: Currently, I have been entering information into the bwJustificationDetails.js form widget for my request type, Invoices. 
                            - This information is a record of labour performed every day. I always start each comment like "Tuesday, October 24, 2023 -".
                                - I am using this as the basis for scraping/parsing the comments and digging out a date and it's subsequent comments.
                                - The parsing relies on the format being [dd, mm dd, yyyy - comments]
                            - This is the first use case, and is very basic. As we develop this widget, we will be able to add a lot of complexity to it,
                            so that it starts to behave in an AI kind of way, but it will just be the result of some more complex logic.


            [more to follow]
                           
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

           [put your stuff here]

        ===========================================================
        
       */

        operationUriPrefix: null,
        weekdays: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
        months: ['january', 'jan', 'february', 'feb', 'march', 'mar', 'april', 'apr', 'may', 'june', 'jun', 'july', 'august', 'aug', 'september', 'sept', 'october', 'oct', 'november', 'nov', 'december', 'dec'],
        years: ['2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030']
    },
    _create: function () {
        this.element.addClass("bwTimelineAggregator");
        var thiz = this;
        try {

            selfDiscoverOperationUri(thiz); // This sets this.options.operationUriPrefix correctly.

            console.log('In bwTimelineAggregator._create(). The widget has been initialized.');

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">bwTimelineAggregator: CANNOT INITIALIZE widget bwTimelineAggregator.js.</span>';
            html += '<br />';
            html += '<span style="">Exception in bwTimelineAggregator._create(): ' + e.message + ', ' + e.stack + '</span>';
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
            .removeClass("bwTimelineAggregator")
            .text("");
    },

    displayDialog: function (strRecordSet) {
        try {
            console.log('In bwTimelineAggregator.js.displayDialog().');
            //alert('In bwTimelineAggregator.js.displayDialog().');
            //
            // This is Use Case #1 (see above), date format of [dd, mm dd, yyyy - comments].
            //

            var timelineArray = [];
            var timelineArray2 = [];
            //timelineArray is an array of objects like:
            //var timelineEntry = {
            //    bwBudgetRequestId: 'xxx-xxxx-xx-xx-xxx',
            //    Title: 'BR-240001',
            //    Date: Date,
            //    Comment: ''
            //}

            //var timelineText = '';
            debugger;
            // The data is coming from bwDataGrid.js.options.BudgetRequests_Filtered, so we have to iterate through it in order to get out our timeline information.
            //var BudgetRequests_Filtered = $('.bwDataGrid').bwDataGrid('option', 'BudgetRequests'); // changed 8-6-2024. // 'BudgetRequests_Filtered');
            // Added 8-6-2024.

            var BudgetRequests_Filtered;
            if (strRecordSet) {

                BudgetRequests_Filtered = $('.bwAuthentication:first').bwAuthentication('option', strRecordSet);

            } else {

                BudgetRequests_Filtered = $('.bwAuthentication:first').bwAuthentication('option', 'BudgetRequests');

            }

            for (var i = 0; i < BudgetRequests_Filtered.docs.length; i++) {

                var bwRequestJson = BudgetRequests_Filtered.docs[i].bwRequestJson; // bwRequestJson is where all the data from our form widgets is stored.
                var bwJustificationDetailsField = JSON.parse(bwRequestJson).bwJustificationDetailsField;
                var data = bwJustificationDetailsField.value;
                var dashArray = data.split('-');
                for (var j = 0; j < dashArray.length; j++) {

                    // Here we are looking for a date before the dash. This is Use Case #1 (see above), date format of [dd, mm dd, yyyy - comments].
                    var day = '', month = '', year = '', numberedDay = '';

                    var commaArray = dashArray[j].split(',');
                    if (commaArray.length > 2) {

                        var tmp1 = commaArray[commaArray.length - 3];

                        var foundTheDay = false;
                        // First try for a space.
                        var tmp1Array = tmp1.split(' ');
                        var day1 = tmp1Array[tmp1Array.length - 1].trim();
                        if (day1) {
                            if (this.options.weekdays.indexOf(day1.toLowerCase()) > -1) {

                                // We found a day, so this is likely to be a date.
                                //timelineText += day1 + commaArray[commaArray.length - 2] + commaArray[commaArray.length - 1] + '<br /><br />';
                                foundTheDay = true;

                            }
                        }

                        // Then try for a '>'.
                        if (foundTheDay != true) {
                            var tmp1Array = tmp1.split('>');
                            var day1 = tmp1Array[tmp1Array.length - 1];
                            if (day1) {
                                if (this.options.weekdays.indexOf(day1.toLowerCase()) > -1) {

                                    // We found a day, so this is likely to be a date.
                                    //timelineText += day1 + commaArray[commaArray.length - 2] + commaArray[commaArray.length - 1] + '<br /><br />';
                                    foundTheDay = true;

                                }
                            }
                        }

                        if (foundTheDay == true) {

                            //////////////////////////////
                            // WE HAVE THE DAY HERE
                            //////////////////////////////

                            day = day1;

                            //
                            // Now get the month.
                            //
                            var foundTheMonth = false;

                            var monthAndDay1 = commaArray[commaArray.length - 2].trim();
                            if (monthAndDay1) {

                                var month2 = monthAndDay1.split(' ')[0];
                                var numberedDay1 = monthAndDay1.split(' ')[1];

                                if (this.options.months.indexOf(month2.toLowerCase()) > -1) {

                                    // We found a month, so this is likely to be a date.
                                    //timelineText += day1 + commaArray[commaArray.length - 2] + commaArray[commaArray.length - 1] + '<br /><br />';
                                    month = month2;
                                    numberedDay = numberedDay1;
                                    foundTheMonth = true;

                                }
                            }

                            if (foundTheMonth == true) {

                                //
                                // Now get the year.
                                //
                                var foundTheYear = false;

                                var year1 = commaArray[commaArray.length - 1].trim();
                                if (year1) {
                                    if (this.options.years.indexOf(year1.toLowerCase()) > -1) {

                                        // We found a year, so this is likely to be a date.
                                        //timelineText += day1 + commaArray[commaArray.length - 2] + commaArray[commaArray.length - 1] + '<br /><br />';
                                        foundTheYear = true;

                                    }
                                }

                                if (foundTheYear == true) {

                                    // WE DID IT, WE FOUND A DATE.

                                    var timelineEntry = {
                                        bwBudgetRequestId: BudgetRequests_Filtered.docs[i].bwBudgetRequestId,
                                        Title: BudgetRequests_Filtered.docs[i].Title,
                                        Date: day + ' ' + month + ' ' + numberedDay + ' ' + year1,
                                        Day: day,
                                        Month: month,
                                        NumberedDay: numberedDay,
                                        Year: year1,
                                        Comment: ''//,
                                        //commentsStartIndex: 0 // If we have multiple date/entries, we can figure out where to stop gathering the comments, and the new date/comments begin.
                                    }

                                    timelineArray.push(timelineEntry);

                                }

                            }

                        }

                    } else {
                        // It's not a date in our expected format. Do nothing.
                    }

                }

            }

            //
            //
            // Now that we have timelineArray populated with dates, we need to go through the requests again, and get all of the comments that correspond to those dates.
            //
            //

            for (var i = 0; i < BudgetRequests_Filtered.docs.length; i++) {

                var bwRequestJson = BudgetRequests_Filtered.docs[i].bwRequestJson; // bwRequestJson is where all the data from our form widgets is stored.
                var bwJustificationDetailsField = JSON.parse(bwRequestJson).bwJustificationDetailsField;
                var data = bwJustificationDetailsField.value.replace(/<[^>]+>/g, ''); // Remove the html, so that we only get the text.

                var requestArray = []; // We get all the timeline entries for a request stored in this array to begin with, then we order them by date, and parse out the comments,
                // careful not to get the next dates comments.

                for (var j = 0; j < timelineArray.length; j++) {
                    if (BudgetRequests_Filtered.docs[i].bwBudgetRequestId == timelineArray[j].bwBudgetRequestId) {
                        requestArray.push(timelineArray[j]);
                    }
                }

                // Now that we have all of the timeline entries for a specific request, lets add an "EntryStartIndex" property.
                for (var k = 0; k < requestArray.length; k++) {
                    var dateString = requestArray[k].Day + ', ' + requestArray[k].Month + ' ' + requestArray[k].NumberedDay + ', ' + requestArray[k].Year + ' -';
                    var entryStartIndex = data.indexOf(dateString);
                    requestArray[k]["EntryStartIndex"] = entryStartIndex;
                    requestArray[k]["DateString"] = dateString;
                }

                //
                //
                // Now we can iterate through the timeline entries for this request, and fill in the comments.
                //
                //
                for (var k = 0; k < requestArray.length; k++) {

                    var entryStartIndex = requestArray[k]["EntryStartIndex"];
                    var dateStringLength = requestArray[k]["DateString"].length;
                    var startIndex = entryStartIndex + dateStringLength;
                    var endIndex = startIndex + 1000; // Max length is set here. Currently hardcoded at 1000 characters.

                    if (requestArray[k + 1]) {
                        var nextEntryStartIndex = requestArray[k + 1]["EntryStartIndex"];
                        if (endIndex > nextEntryStartIndex) {
                            endIndex = nextEntryStartIndex;
                        }
                    }

                    if (endIndex > data.length) {
                        endIndex = data.length - 1;
                    }

                    var comment = data.substring(startIndex, endIndex).trim();
                    requestArray[k].Comment = comment;

                    timelineArray2.push(requestArray[k]);

                }

            }

            //
            // Now we can take our json and create the UI.
            //
            var html = '';

            if (timelineArray2.length && (timelineArray2.length > 0)) {

                html += '<div style="font-size:10pt;">';

                var bwBudgetRequestId = '';
                for (var i = 0; i < timelineArray2.length; i++) {

                    if (timelineArray2[i].bwBudgetRequestId != bwBudgetRequestId) {
                        // Start a new title/section.
                        if (bwBudgetRequestId = '') {
                            html += timelineArray2[i].Title + '<br />';
                        } else {
                            html += '<br />' + timelineArray2[i].Title + '<br />';
                        }
                    }

                    bwBudgetRequestId = timelineArray2[i].bwBudgetRequestId;

                    html += '<span style="font-weight:bold;">' + timelineArray2[i].DateString + '</span> ' + timelineArray2[i].Comment + '<br />';

                }

                html += '</div>';

            } else {

                html += `<div style="">There are no timeline results to display for this record selection.</div>`;

            }

            displayAlertDialog(html);

        } catch (e) {
            var msg = 'Exception in bwTimelineAggregator.js.displayDialog(): ' + e.message + ', ' + e.stack;
            console.log(msg);
            displayAlertDialog(msg);
        }
    }

});