$.widget("bw.bwActivitySpinner", {
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
        This is the bwActivitySpinner.js jQuery Widget. 
        ===========================================================

           We instantiate this widget when a background process is executing. 
               - It is a modal dialog. The interaction with the backend code in Node.js relies on you hooking up the events appropriately. Global methods ShowActivitySpinner() and HideActivitySpinner() support this.
               - This seems to work great, not much improvement expected. 1-24-2024. 
                           
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

           [put your stuff here]

        ===========================================================
        
       */

        SpinnerType: 'modal', //, // 'small' if next to a text box, for example, and 'modal' is for the whole screen.
        HasBeenInitialized: null
    },
    _create: function () {
        this.element.addClass("bwActivitySpinner");
        var thiz = this; // Need this because of the asynchronous operations below.
        try {
            //debugger; // 11-25-2020 2-21pm adt
            var html = '';

            html += '<div id="divActivitySpinner_WorkingOnItDialog" style="display:inline;">';
            html += '   <div style="white-space:nowrap;color: rgb(38, 38, 38); font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif; font-size: 2.77em;">';
            html += '       &nbsp;&nbsp;<img style="width:100px;height:100px;vertical-align:middle;white-space:nowrap;" src="/images/ajax-loader.gif" />&nbsp;&nbsp;<span id="divActivitySpinner_WorkingOnItDialog_spinnerText" xcx="xcx3242577775" style="font-size:25pt;white-space:nowrap;">Working on it...xcx213123</span>';
            html += '   </div>';
            html += '</div>';

            $(this.element).html(html);
            this.options.HasBeenInitialized = true;

            console.log('In bwActivitySpinner._create(). The widget has been initialized.');
            //alert('In bwActivitySpinner._create(). The widget has been initialized.');

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwActivitySpinner</span>';
            html += '<br />';
            html += '<span style="">Exception in bwActivitySpinner.Create(): ' + e.message + ', ' + e.stack + '</span>';
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
            .removeClass("bwActivitySpinner")
            .text("");
    },
    show: function (spinnerText) {
        try {
            //console.log('In bwActivitySpinner.js.show().');
            //alert('In bwActivitySpinner.js.show().');

            if (spinnerText) {
                $('#divActivitySpinner_WorkingOnItDialog').find('#divActivitySpinner_WorkingOnItDialog_spinnerText').html(spinnerText); //'Uploading file. This may take a while...');
            } else {
                $('#divActivitySpinner_WorkingOnItDialog').find('#divActivitySpinner_WorkingOnItDialog_spinnerText').html('Working on it...');
            }

            try {
                $(this.element).style.display = 'inline';

            } catch (e) {
                if ($("#divActivitySpinner_WorkingOnItDialog").dialog && $("#divActivitySpinner_WorkingOnItDialog").display) {

                    $("#divActivitySpinner_WorkingOnItDialog").show();

                } else {

                    console.log('Displaying xcx432564 dialog at width 800.');

                    $("#divActivitySpinner_WorkingOnItDialog").dialog({
                        modal: true,
                        resizable: false,
                        closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                        title: 'Working on it...',
                        width: 800, // This determines the width. 8-10-2024.
                        height: "120",
                        minHeight: "120",
                        dialogClass: "no-close", // No close button in the upper right corner.
                        hide: false // This means when hiding just disappear with no effects.
                    });
                    $("#divActivitySpinner_WorkingOnItDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

                }
            }

        } catch (e) {
            debugger;
            console.log('Exception in bwActivitySpinner.show(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwActivitySpinner.show(): ' + e.message + ', ' + e.stack);
        }
    },
    show_Promise: function (spinnerText) {
        return new Promise(function (resolve, reject) {
            try {
                console.log('In bwActivitySpinner.js.show_Promise().');

                if (spinnerText) {
                    $('#divActivitySpinner_WorkingOnItDialog_spinnerText').html(spinnerText); //'Uploading file. This may take a while...');
                } else {
                    $('#divActivitySpinner_WorkingOnItDialog_spinnerText').html('Working on it...');
                }

                try {

                    $(this.element).style.display = 'inline';

                } catch (e) {
                    if ($("#divActivitySpinner_WorkingOnItDialog").dialog && $("#divActivitySpinner_WorkingOnItDialog").display) {

                        $("#divActivitySpinner_WorkingOnItDialog").show();

                        var imagePath = $('#divActivitySpinner_WorkingOnItDialog_spinnerText').closest('img')[0].src;
                        var img = new Image();
                        img.src = imagePath;
                        img.onload = function (e) {
                            resolve();
                        }

                    } else {

                        $("#divActivitySpinner_WorkingOnItDialog").dialog({
                            modal: true,
                            resizable: false,
                            closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                            title: 'Working on it...',
                            width: "950",
                            height: "120",
                            minHeight: "120",
                            dialogClass: "no-close", // No close button in the upper right corner.
                            hide: false, // This means when hiding just disappear with no effects.
                            open: function () {
                                //$('.ui-widget-overlay').bind('click', function () {
                                //    $("#divDeleteASlideDialog").dialog('close');
                                //});

                                //var imagePath = $('#divActivitySpinner_WorkingOnItDialog_spinnerText').closest('img')[0].src;
                                //var img = new Image();
                                //img.src = imagePath;
                                //img.onload = function (e) {
                                //    resolve();
                                //}


                            }
                        });
                        $("#divActivitySpinner_WorkingOnItDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
                    }

                }

              

            } catch (e) {
                
                reject();

                console.log('Exception in bwActivitySpinner.show(): ' + e.message + ', ' + e.stack);
                alert('Exception in bwActivitySpinner.show(): ' + e.message + ', ' + e.stack);
            }
        });
    },
    hide: function () {
        try {
            //console.log('In bwActivitySpinner.hide().');

            //$(this.element).style.display = 'none';
            try {
                $("#divActivitySpinner_WorkingOnItDialog").dialog('close');
            } catch (e) {
                // do nothing
            }

        } catch (e) {
            console.log('Exception in bwActivitySpinner.hide(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwActivitySpinner.hide(): ' + e.message + ', ' + e.stack);
        }
    }

});