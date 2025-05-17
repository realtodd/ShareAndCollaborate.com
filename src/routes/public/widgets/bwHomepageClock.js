$.widget("bw.bwHomepageClock", {
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
        This is the bwHomepageClock.js jQuery Widget. 
        ===========================================================

           [more to follow]
                           
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

           [put your stuff here]

        ===========================================================
        
       */
        color: 'white', // This is the font color.
        clockTimer: null,
        clockHealthCheckTimer: null,
        mostRecentlyDisplayedDate: null

    },
    _create: function () {
        this.element.addClass("bwHomepageClock");
        var thiz = this; // Need this because of the asynchronous operations below.
        try {

            //
            // We want the clock to switch on the minute, in coordination with the browser/system time on the device.
            // This means we have to calculate when the minute is going to change again. This part is unfinished. It's close enough for now... 8-1-2024.
            //
            //var now = new Date();
            //var ms = now.getMilliseconds();

            // OUTDATED::::This value is 61 seconds. 1 second longer than the interval time of 60 seconds. This ensures that the recycle button isn't displayed erroneously. [animation-duration: 61s] 
            //var styles = `
            //            .bw_browser_activity_refresh_button {
            //                opacity: 1;
            //                font-size:96pt;
            //                color: tomato;
            //                cursor:pointer;

            //                animation-name: bw_browser_activity_refresh_button1;
            //                animation-duration: 60s; 
            //                animation-delay: 0s;
            //            }
            //            .bw_browser_activity_refresh_button:hover {
            //                color:green;
            //            }
            //            @keyframes bw_browser_activity_refresh_button1 {
            //                0% {
            //                    opacity: 0;
            //                }
            //                99% {
            //                    opacity:0;
            //                }
            //            }
            //        `;

            //var styleSheet = document.createElement("style") // https://stackoverflow.com/questions/707565/how-do-you-add-css-with-javascript
            //styleSheet.textContent = styles
            //document.head.appendChild(styleSheet)

            var html = '';

            html += `<div style="float:right;">
                        <div id="bwActiveMenu_HomepageClock" style="padding:0 0 0 75px;width:90%;color:` + this.options.color + `;">[bwActiveMenu_HomepageClock]</div>
                    </div>`;

            this.element.html(html);

            var now = new Date();

            var year = now.getFullYear();
            var month = now.getMonth();
            var date = now.getDate();
            var hour = now.getHours();
            var minutes = now.getMinutes() + 1;

            var future = new Date(year, month, date, hour, minutes, 0);

            var millisecondsTillNextMinute = future - now;

            this.options.clockTimer = setInterval(function () {
                try {
                    //displayAlertDialog('Interval!! 1');
                    thiz.displayClock();
                    clearInterval(thiz.options.clockTimer);

                    thiz.options.clockTimer = setInterval(function () { // Now that the time is synced up, continue every 60 seconds.
                        //displayAlertDialog('Interval!! 2');
                        thiz.displayClock();
                    }, 60000); // 60000 is 1 minute. Check every minute and update the time and date.

                } catch (e) {
                    var msg = 'Exception in bwHomepageClock.js._create(): ' + e.message + ', ' + e.stack;
                    console.log(msg);
                    displayAlertDialog(msg);
                }
            }, millisecondsTillNextMinute); // 60000 is 1 minute. Check every minute and update the time and date.

            this.options.clockHealthCheckTimer = setInterval(function () {
                try {
                    thiz.clockHealthCheck();
                } catch (e) {
                    var msg = 'Exception in bwHomepageClock.js._create(): ' + e.message + ', ' + e.stack;
                    console.log(msg);
                    displayAlertDialog(msg);
                }
            }, 1000); // 1000 is 1 second. Check every second. This is specifically for a device when it wakes up, and we want the time to update immediately.

            this.displayClock();

            console.log('In bwHomepageClock._create(). The widget has been initialized.');

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">bwHomepageClock: CANNOT INITIALIZE widget bwHomepageClock.js.</span>';
            html += '<br />';
            html += '<span style="">Exception in bwHomepageClock.Create(): ' + e.message + ', ' + e.stack + '</span>';
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
            .removeClass("bwHomepageClock")
            .text("");
    },

    displayClock: function () {
        try {
            console.log('In bwHomepageClock.js.displayClock().');

            var now = new Date();

            this.options.mostRecentlyDisplayedDate = now;

            var ordinal_suffix_of = function (i) {
                let j = i % 10,
                    k = i % 100;
                if (j === 1 && k !== 11) {
                    return i + "st";
                }
                if (j === 2 && k !== 12) {
                    return i + "nd";
                }
                if (j === 3 && k !== 13) {
                    return i + "rd";
                }
                return i + "th";
            }

            // Global arrays: monthNames, dayNames.
            var month = monthNames[now.getMonth()];
            var day = dayNames[now.getDay()];
            var date1 = now.getDate();
            var date = ordinal_suffix_of(date1);
            var year = now.getFullYear()

            var time1 = now.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
            var time = time1.split(' ')[0];
            var ampm = time1.split(' ')[1].toLowerCase();

            var html = '';

            html += '<div style="font-size:24pt;white-space:nowrap;opacity:0.7;">' + day + ', ' + month + ' ' + date + ', ' + year + '</div>';
            html += '<div style="font-size:64pt;font-weight:lighter;white-space:nowrap;">' + time + '' + ampm + '</div>';
            //html += `<div style="font-size:12pt;font-weight:lighter;white-space:nowrap;">
            //            <span class="bw_browser_activity_refresh_button" onclick="$('.bwHomepageClock').bwHomepageClock('restartClock');">♻</span>
            //         </div>`;

            $('#bwActiveMenu_HomepageClock').html(html);

        } catch (e) {
            var msg = 'Exception in bwHomepageClock.js.displayClock(): ' + e.message + ', ' + e.stack;
            console.log(msg);
            displayAlertDialog(msg);
        }
    },
    restartClock: function () {
        try {
            console.log('In bwHomepageClock.js.restartClock().');
            var thiz = this;

            clearInterval(this.options.clockTimer);

            this.options.clockTimer = setInterval(function () {
                //displayAlertDialog('Interval!!');
                thiz.displayClock();
            }, 60000); // 60000 is 1 minute. Check every minute and update the time and date.

            this.displayClock();

        } catch (e) {
            var msg = 'Exception in bwHomepageClock.js.restartClock(): ' + e.message + ', ' + e.stack;
            console.log(msg);
            displayAlertDialog(msg);
        }
    },
    clockHealthCheck: function () {
        try {
            console.log('In bwHomepageClock.js.clockHealthCheck().');

            var now = new Date();

            var timespan = now - this.options.mostRecentlyDisplayedDate;
            
            if (timespan > 180000) { // 60000 = 1 minute. This is 3 seconds, which I am hoping performs the same, but with way less computational activity. 8-5-2024.
                //displayAlertDialog('timespan greater than 1 minute. The device must have been paused.');
                this.displayClock();
            }
            
        } catch (e) {
            var msg = 'Exception in bwHomepageClock.js.clockHealthCheck(): ' + e.message + ', ' + e.stack;
            console.log(msg);
            displayAlertDialog(msg);
        }
    }

});