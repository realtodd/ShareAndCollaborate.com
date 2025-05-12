$.widget("bw.bwActivitySpinner_FileUpload", {
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
         This is the bwActivitySpinner_FileUpload.js jQuery Widget. 
         ===========================================================

            We instantiate this widget when a file is uploading. 
                - It is a modal dialog. The uploading interaction with the backend code in Node.js gives us all the events needed for a great progress bar, using multer. 
                - The fileservices code is where the backed exists for this. Nginx, Varnish, UFW, and other configurations are required to support this.
                - This seems to work great, not much improvement expected. 1-24-2024. 
                            
         ===========================================================
         ===========================================================
         MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

            [put your stuff here]

         ===========================================================
         
        */


        SpinnerType: 'modal', //, // 'small' if next to a text box, for example, and 'modal' is for the whole screen.
        IdPrefix: '', // Use this to differentiate the element Id's for this widget.
        HasBeenInitialized: null
    },
    _create: function () {
        this.element.addClass("bwActivitySpinner_FileUpload");
        var thiz = this; // Need this because of the asynchronous operations below.
        try {
            //alert('In bwActivitySpinner_FileUpload._create().');
            var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
            this.options.IdPrefix = guid + '_'; // The underscore makes it look nice and more readable.

            var html = '';

            html += '<div id="' + this.options.IdPrefix + 'divActivitySpinner_WorkingOnItDialog" class="bwActivitySpinner" style="display:inline;">';
            html += '   <div style="white-space:nowrap;color: rgb(38, 38, 38); font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif; font-size: 2.77em;">';
            html += '       &nbsp;&nbsp;<img style="width:100px;height:100px;vertical-align:middle;white-space:nowrap;" src="/images/ajax-loader.gif" />&nbsp;&nbsp;<span id="' + this.options.IdPrefix + 'divActivitySpinner_WorkingOnItDialog_spinnerText" style="font-size:25pt;white-space:nowrap;">Working on it...</span>';
            html += '   </div>';


            ////var workflowAppTheme;
            //var tmpTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');
            ////alert('Selected theme: ' + tmpTheme);
            //if (tmpTheme && (tmpTheme != 'brushedAluminum_skyblue')) { // Selected theme: brushedAluminum_skyblue
            //    // temporary fix ... the theme "brushedAluminum_skyblue" has the same color as the bar, so it doesn't display progress. In this case, use green. 8-6-2022
            //    //console.log('In bwActivitySpinner_FileUpload(). Temporary fix ... the theme "brushedAluminum_skyblue" has the same color as the bar (lightgray), so it doesnt display progress. In this case, use green. 8-6-2022');
            //    //workflowAppTheme = tmpTheme;
            //} else {
            //    //alert('Setting theme to: ' + 'brushedAluminum_green');
            //    //workflowAppTheme = 'brushedAluminum_green';
            //}

            html += '   <div style="width:100%;background-color:lightgray;border:1px solid gray;">';

            var tmpTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');
            if (tmpTheme && (tmpTheme != 'brushedAluminum_skyblue')) { // Selected theme: brushedAluminum_skyblue
                html += '   <div id="divBwActivitySpinner_FileUpload_ProgressBar" class="' + tmpTheme + '" style="width:0px;height:25px;color:white;padding:10px 10px 10px 10px;vertical-align:middle;">';
            } else {
                html += '   <div id="divBwActivitySpinner_FileUpload_ProgressBar" class="' + 'brushedAluminum_green' + '" style="background-color:green;width:0px;height:25px;color:white;padding:10px 10px 10px 10px;vertical-align:middle;">';
            }
            html += '       </div>';

            html += '   </div>';

            // Our new status text element.
            html += '   <div id="divBwActivitySpinner_FileUpload_ProgressBar_StatusText"></div>';

            html += '</div>';

            $(this.element).html(html);

            this.options.HasBeenInitialized = true;

            console.log('In bwActivitySpinner_FileUpload._create(). The widget has been initialized.');

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwActivitySpinner_FileUpload</span>';
            html += '<br />';
            html += '<span style="">Exception in bwActivitySpinner_FileUpload.Create(): ' + e.message + ', ' + e.stack + '</span>';
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
            .removeClass("bwActivitySpinner_FileUpload")
            .text("");
    },
    show: function (spinnerText) {
        try {
            console.log('In bwActivitySpinner_FileUpload.show().');

            if (spinnerText) {
                $('#' + this.options.IdPrefix + 'divActivitySpinner_WorkingOnItDialog_spinnerText').html(spinnerText); //'Uploading file. This may take a while...');
            } else {
                $('#' + this.options.IdPrefix + 'divActivitySpinner_WorkingOnItDialog_spinnerText').html('Working on it...');
            }

            try {
                $(this.element).style.display = 'inline';
            } catch (e) {
                if ($('#' + this.options.IdPrefix + 'divActivitySpinner_WorkingOnItDialog').dialog && $('#' + this.options.IdPrefix + 'divActivitySpinner_WorkingOnItDialog').display) {

                    $('#' + this.options.IdPrefix + 'divActivitySpinner_WorkingOnItDialog').show();

                } else {

                    console.log('Displaying xcx4325 dialog at width 1100.');

                    $('#' + this.options.IdPrefix + 'divActivitySpinner_WorkingOnItDialog').dialog({
                        modal: true,
                        resizable: false,
                        closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                        title: 'Working on it...',
                        width: 1100, // This is where the width is set. 8-10-2024.
                        height: "120",
                        minHeight: "120",
                        dialogClass: "no-close", // No close button in the upper right corner.
                        hide: false // This means when hiding just disappear with no effects.
                    });
                    $('#' + this.options.IdPrefix + 'divActivitySpinner_WorkingOnItDialog').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();
                }
            }

        } catch (e) {
            console.log('Exception in bwActivitySpinner_FileUpload.show(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwActivitySpinner_FileUpload.show(): ' + e.message + ', ' + e.stack);
        }
    },
    hide: function () {
        try {
            //console.log('In bwActivitySpinner_FileUpload.hide().');

            //$(this.element).style.display = 'none';
            try {
                $('#' + this.options.IdPrefix + 'divActivitySpinner_WorkingOnItDialog').dialog('close');
            } catch (e) {
                // do nothing
            }

        } catch (e) {
            console.log('Exception in bwActivitySpinner_FileUpload.hide(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwActivitySpinner_FileUpload.hide(): ' + e.message + ', ' + e.stack);
        }
    }

});