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

$.widget("bw.bwPageScrollingHandler", {
    options: {

       
        /*
        ===========================================================
        This is the bwPageScrollingHandler.js jQuery Widget. 
        ===========================================================

            [more to follow]
                          
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

            [put your stuff here]

        ===========================================================
       
        */

        PreventNextWindowScrollEvent: false
    },
    _create: function () {
        this.element.addClass("bwPageScrollingHandler");
        try {
            console.log('In bwPageScrollingHandler._create(). The widget has been initialized.');
            //alert('In bwPageScrollingHandler._create(). The widget has been initialized.');
            var thiz = this;

            $(document).scroll(function (event) {
                try { 
                    //console.log('In document.scroll(). event.target: ' + event.target);
                    //if (thiz.options.PreventNextWindowScrollEvent == true) {
                    //    console.log('Trying: PreventNextWindowScrollEvent.');
                    //    thiz.options.PreventNextWindowScrollEvent = false;
                    //    //$('#' + dialogElement).dialog('close');
                    //    //$(window).scrollTop(0);
                    //    event.preventDefault();
                    //}
                } catch (e) {
                    console.log('Exception in xx(): ' + e.stack);
                }
            });

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT INITIALIZE bwPageScrollingHandler</span>';
            html += '<br />';
            html += '<span style="">Exception in bwPageScrollingHandler.Create(): ' + e.message + ', ' + e.stack + '</span>';
            this.element.html(html);
        }
    },
    //ScrollToTopOnNextScrollEvent: function () {
    //    try { // codemarker 4-10-2021
    //        console.log('In ScrollToTopOnNextScrollEvent().');
    //        this.options.ScrollToTopOnNextScrollEvent = true;
    //    } catch (e) {
    //        console.log('Exception in xx(): ' + e.stack);
    //    }
    //},
    CloseDialogAndPreventNextWindowScrollEvent: function (dialogElement) {
        try { 
            console.log('In bwPageScrollingHandler.js.CloseDialogAndPreventNextWindowScrollEvent(). dialogElement: ' + dialogElement);
            //alert('In bwPageScrollingHandler.js.CloseDialogAndPreventNextWindowScrollEvent(). dialogElement: ' + dialogElement);
            //this.options.PreventNextWindowScrollEvent = true;

            if (window.opener) {

                console.log('In CloseDialogAndPreventNextWindowScrollEvent(). The request form is being closed. We need to check if the user may be losing any changes. This functionality is incomplete. Coming soon! dialogElement: ' + dialogElement + '. xcx12312-1');

                // This is the top-right 'X', close dialog ... If it is a popout window, close the whole window. 8-24-2022
                //window.close(); // IF WE WANT THE WHOLE WINDOW TO CLOSE, BUT MAYBE A CHECK TO SEE IF ANYTHING IS WORTH SAVING.... CHECK FOR CHANGES!!!!!!!




                $('#' + dialogElement).dialog('close'); // This is not calling close properly...hmmm..........






                // ANOTHER WAY TO DO THIS>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                //$('.bwRequest').bwRequest('LaunchIntoHomeWindow', 'cc35bc98-bc20-4d55-8276-ee907afa2fae');






            } else {

                console.log('');
                console.log('==========================================');
                console.log('In xcx34-2(). The request form is being closed. We need to check if the user may be losing any changes. This functionality is incomplete. Coming soon! xcx12312-x-1');
                console.log('==========================================');
                console.log('');

                //displayAlertDialog('In CloseDialogAndPreventNextWindowScrollEvent(). The request form is being closed. We need to check if the user may be losing any changes. This functionality is incomplete. Coming soon! xcx12312-2');

                // This is open in the same browser window, so just close the dialog. 8-24-2022
                $('#' + dialogElement).dialog('close');

                $(window).scrollTop(0);

            }
            
            

        } catch (e) {
            console.log('Exception in CloseDialogAndPreventNextWindowScrollEvent(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in CloseDialogAndPreventNextWindowScrollEvent(): ' + e.message + ', ' + e.stack);
        }
    }
    
});
