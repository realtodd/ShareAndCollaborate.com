$.widget("bw.bwJustificationDetailsField", {
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
        This is the bwJustificationDetailsField.js jQuery Widget. 
        ===========================================================

            [more to follow]
                          
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

            [put your stuff here]

        ===========================================================
       
        */

        fieldTitle: 'Justification Details', // This is the title, which shows up on the form in the left column.

        jsonData: null,

        summernote: null, // This is the summernote editor. We can use this access it's functionality without the danger of instantiating it a second time.

        allowRequestModifications: false,
        renderAsARequiredField: null, // If this is true, then just display the red asterisk.

        inFormsEditor: null, // This is when forms are being designed. This prevents the widget from hitting the database (going asynchronous) when this is true. If that happens, a race condition may occur and addition to the toolbox may partially fail.

        requestDialogId: null, // This is the unique id of the request dialog being displayed. We prepend this to id's in order to make sure we can display many dialogs at one time on screen and make them unique in the dom.
        commentsAreRequired: false, // If comments are required the background is that light blue color to indicate data entry is required. 
        consolidatedCommentsJson: null,

        bwTenantId: null,
        bwWorkflowAppId: null,

        operationUriPrefix: null,
        ajaxTimeout: 15000,
        autoSenseDeviceType: false // Automatic UI based on device type. Alpha version so far.
    },
    _create: function () {
        this.element.addClass("bwJustificationDetailsField");
        var thiz = this; // Need this because of the asynchronous operations below.
        try {

            selfDiscoverOperationUri(thiz); // This sets this.options.operationUriPrefix correctly.

            if (this.options.inFormsEditor == true) {
                //this.options.store = {}; // Need to provide this because if it tries to hit the database and poopulate, it won't render in time to be used in the toolbox!!!! 6-28-2020
                this.renderAndPopulateJustificationDetailsField_ReadOnly(); // Need to render, not allowing the user to make modifications.
            } else if (this.options.allowRequestModifications == false) {
                this.renderAndPopulateJustificationDetailsField_ReadOnly(this.options.jsonData.requestDialogId); // Need to render, not allowing the user to make modifications.
            } else if (this.options.allowRequestModifications == true) {
                this.renderAndPopulateJustificationDetailsField(this.options.jsonData.requestDialogId);
            } else {
                var html = '';
                html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwJustificationDetailsField</span>';
                html += '<br />';
                html += '<span style="">Invalid value for allowRequestModifications: ' + this.options.allowRequestModifications + '</span>';
                this.element.html(html);
            }
            //alert('In bwJustificationDetailsField._create(). The widget has been initialized.');
            console.log('In bwJustificationDetailsField._create(). The widget has been initialized.');

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwJustificationDetailsField</span>';
            html += '<br />';
            html += '<span style="">Exception in bwJustificationDetailsField._create(): ' + e.message + ', ' + e.stack + '</span>';
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
            .removeClass("bwJustificationDetailsField")
            .text("");
    },
    getData: function () {
        try {
            console.log('In bwJustificationDetailsField.js.getData().');
            //alert('In bwJustificationDetailsField.js.getData().');

            var value = $(this.element).find('#JustificationDetails').summernote('code').trim();

            return value;

        } catch (e) {
            console.log('Exception in bwJustificationDetailsField.js.getData(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwJustificationDetailsField.js.getData(): ' + e.message + ', ' + e.stack);
        }
    },
    getDataType: function () {
        try {
            console.log('In bwJustificationDetailsField.js.getDataType().');

            return 'string';
        } catch (e) {
            console.log('Exception in bwJustificationDetailsField.js.getDataType(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwJustificationDetailsField.js.getDataType(): ' + e.message + ', ' + e.stack);
        }
    },
    isARequiredField: function () {
        try {
            console.log('In bwJustificationDetailsField.isARequiredField().');
            return this.options.renderAsARequiredField;
        } catch (e) {
            console.log('Exception in bwJustificationDetailsField.isARequiredField(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwJustificationDetailsField.isARequiredField(): ' + e.message + ', ' + e.stack);
        }
    },
    getfieldTitle: function () {
        try {
            console.log('In bwJustificationDetailsField.getfieldTitle().');
            return this.options.fieldTitle;
        } catch (e) {
            console.log('Exception in bwJustificationDetailsField.getfieldTitle(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwJustificationDetailsField.getfieldTitle(): ' + e.message + ', ' + e.stack);
        }
    },
    ToggleExpandJustificationDetails: function () {
        try {
            console.log('In bwJustificationDetailsField.ToggleExpandJustificationDetails().');
            //alert('In bwJustificationDetailsField.ToggleExpandJustificationDetails().');

            debugger;
            var image = $(this.element).find('#imgExpandJustificationDetails')[0]; // document.getElementById('imgExpandComments');
            if (image) {

                if (image.src.toString().indexOf('drawer-open.png') > -1) {
                    displayAlertDialog('Opening drawer.');
                    image.src = '../images/drawer-close.png';

                    $(this.element).find('div.note-editable')[0].height(50);



                    //var element = $(this.element).find('#JustificationDetails').get(0); //.style.height = 'auto';
                    //element.style.height = 'auto';
                    //$(this.element).find('#JustificationDetails').attr('style', 'height: auto; min-height: 100% !important;WORD-WRAP: break-word; WHITE-SPACE: normal; OVERFLOW-X: auto; OVERFLOW-Y: auto; WIDTH: 100%;BACKGROUND-COLOR: white;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 15pt;');

                    //var bodyElement = $(this.element).find('#JustificationDetails');
                    //$(this.element).summernote({ maxHeight: 'auto' });

                    //$(this.element).summernote('fullscreen.toggle');

                    //$('.summernote:first').summernote('fullscreen.toggle');




                    //var bodyElement = $(thiz.element).find('#JustificationDetails')[0];

                    //$(bodyElement).summernote({ height: 50 });
                    //debugger;

                    //$(this.options.summernote).summernote('option', 'height', 50);
                    //$(this.options.summernote).summernote('fullscreen.toggle');

                } else {
                    displayAlertDialog('Closing drawer.');
                    image.src = '../images/drawer-open.png';

                    $(this.element).find('div.note-editable')[0].height(500);


                    //var element = $(this.element).find('#JustificationDetails').get(0); //.style.height = 'auto';
                    //element.style.height = '100';
                    //$(this.element).find('#JustificationDetails').attr('style', 'height:100px;min-height: 100% !important;WORD-WRAP: break-word; WHITE-SPACE: normal; OVERFLOW-X: auto; OVERFLOW-Y: auto; WIDTH: 100%;BACKGROUND-COLOR: white;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 15pt;');


                    //var bodyElement = $(this.element).find('#JustificationDetails');
                    //$(this.element).summernote({ maxHeight: 400 });

                    //$(this.options.summernote).summernote('option', 'height', 50);
                    //$(this.options.summernote).summernote('fullscreen.toggle');


                }

            }

        } catch (e) {
            console.log('Exception in bwJustificationDetailsField.ToggleExpandJustificationDetails(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwJustificationDetailsField.ToggleExpandJustificationDetails(): ' + e.message + ', ' + e.stack);
        }
    },
    renderAndPopulateJustificationDetailsField: function (requestDialogId) {
        try {
            console.log('In bwJustificationDetailsField.js.renderAndPopulateJustificationDetailsField().');
            var thiz = this;

            var html = '';

            html += '<table style="width:100%;">';
            //html += '<table style="max-width:700px;">';
            html += '                        <tr class="xdTableOffsetRow xdTableOffsetRow-editor" id="toolboxdraggablerow_2" draggable="true" bwwidgetname="bwJustificationDetailsField">';
            html += '                            <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px">';
            html += '                                <span class="xdlabel">';
            html += '                                    Justification Details:';

            html += '<br />';

            // Magnifying glass.
            //html += '   <img id="imgExpandJustificationDetails" src="../images/zoom.jpg" style="text-align:left; cursor:pointer;width:35px;height:35px;float:right;margin-right:10px;" onclick="$(\'#' + 'divPageContent1' + '\').find(\'.bwJustificationDetailsField\').bwJustificationDetailsField(\'viewInLargeWindow\');">';



            // Getting rid of the expand/collapse icons for now. 7-24-2024.
            //if (!requestDialogId) {

            //    // We are making an assumption here, that this is a new request. Not a fan of this approach, maybe come back and tidy this kind of thing up a bit somehow. This needs to consider the entire approach to this sort fo thing. 6-19-2024.

            //    html += '<a onclick="$(\'#' + 'divPageContent1' + '\').find(\'.bwJustificationDetailsField\').bwJustificationDetailsField(\'ToggleExpandJustificationDetails\');">';
            //    html += '   <img id="imgExpandJustificationDetails" src="../images/drawer-open.png" style="text-align:left; cursor:pointer;width:35px;height:35px;float:right;margin-right:10px;">';
            //    html += '</a>';

            //} else {

            //    html += '<a onclick="$(\'#' + requestDialogId + '\').find(\'.bwJustificationDetailsField\').bwJustificationDetailsField(\'ToggleExpandJustificationDetails\');">';
            //    html += '   <img id="imgExpandJustificationDetails" src="../images/drawer-open.png" style="text-align:left; cursor:pointer;width:35px;height:35px;float:right;margin-right:10px;">';
            //    html += '</a>';

            //}



            // removed 8-14-2023.
            //html += '                       <span style="font-size:20pt;cursor:zoom-in;" onclick="$(\'#' + requestDialogId + '\').find(\'.bwJustificationDetailsField\').bwJustificationDetailsField(\'viewInLargeWindow\');"><img class="gridMagnifyingGlass" src="/images/zoom.jpg" style="width:50px;height:50px;" /></span>';



            var developerModeEnabled = $('.bwAuthentication').bwAuthentication('option', 'developerModeEnabled');

            if (developerModeEnabled == true) {
                // <span title="print" class="printButton" dev="xcx32424-1-1" style="font-size:18pt;cursor:pointer !important;" onclick="$('.bwPrintButton').bwPrintButton('PrintIndividualRequestReport', 'divRequestFormDialog_d90bc2bc-a602-4af7-bffa-50625849da3a');">               <img src="/images/iosprinter_blue.png" style="width:50px;height:50px;cursor:pointer !important;">           </span>
                var printTitle = 'xcx32433788 Description would be cool here... maybe Title, and ProjectTitle.';
                html += '                       <span title="print" class="printButton" dev="xcx32424-1-1" style="font-size:18pt;cursor:pointer !important;" onclick="$(\'.bwPrintButton\').bwPrintButton(\'PrintHtml\', \'' + requestDialogId + '\', \'' + printTitle + '\');"><img src="/images/iosprinter_blue.png" style="width:50px;height:50px;cursor:pointer !important;"></span>';
            }





            html += '                                </span>';
            //html += '                                <span style="color:red;font-size:medium;">*</span>';

            if (this.options.renderAsARequiredField == true) {
                html += '                               <span style="color:red;font-size:medium;">*</span>';
            } else if (this.options.renderAsARequiredField == false) {
                //
            } else {
                html += '                               <span class="ToggleRequiredAsterisk" title="Select this asterick to make this a required field." onclick="$(\'.bwFormsEditor\').bwFormsEditor(\'toggleFormRequiredField\', this);">*</span>';
            }

            html += '                            </td>';





            //html += '                            <td class="xdTableOffsetCellComponent" xcx="xcx1234235" style="max-width:700px;white-space:nowrap;text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px;">';
            html += '                            <td class="xdTableOffsetCellComponent" xcx="xcx1234235" style="max-width:700px;text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px;">';



            // Summernote 6-30-2024. See below for instantiation.
            html += '                                              <div id="JustificationDetails" class="bwRequestJson" bwDataRequired="true" bwFieldname="JustificationDetails" style="max-width:700px;overflow-x: hidden !important;">'; // nO STYLE ATTRIBUTE WHEN USING SUMMERNOTE!!
            html += '                                              </div>';

            
            //html += `<div id="summernote" style="display: none;"><p><br></p></div>`;



            html += '                            </td>';
            html += '                        </tr>';
            //html += '                    </tbody>';
            html += '</table>';

            // Render the html.
            if (this.options.inFormsEditor != true) {
                // THIS IS VERY IMPORTANT AND NEEDS TO BE IN EVERY WIDGET!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 7-12-2020
                // Even though the widget regenerates itself (re-renders), the parent TR tag gets missed!!! Therefore we have to handle getting rid of our form editor draggable attribute here.
                this.element.closest('tr').removeAttr('draggable');
            }
            this.element.html(html);










            //
            // Summernote 6-30-2024. See above for element declaration.
            //
            //This was the original, non-summernote UI.
            //html += '                                              <div id="JustificationDetails" class="xdTextBoxRequired bwRequestJson" contentEditable="true" bwDataRequired="true" bwFieldname="JustificationDetails"  title="" style="height:100px; min-height: 100% !important;WORD-WRAP: break-word; WHITE-SPACE: normal; OVERFLOW-X: auto; OVERFLOW-Y: auto; WIDTH: 100%;BACKGROUND-COLOR: white;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 15pt;">';
            //html += '                                              </div>';
            //end: This was the original, non-summernote UI.

            var bodyElement = $(thiz.element).find('#JustificationDetails')[0];

            //
            // We have to do this to make the [enter] key work as expected, without inserting p/paragraph elemenets.
            //

            console.log('In bwJustificationDetailsField.js.renderAndPopulateJustificationDetailsField(). THIS IS THE ONLY PLACE WHERE THE SUMMERNOTE OBJECT SHOULD BE INSTANTIATED.');





            //// "Is it possible to default to <br> instead of <p> on enter?" YES. See here: https://github.com/summernote/summernote/issues/546
            //$.summernote.dom.emptyPara = "<div><br></div>"; // monkeypatch.

            //$.extend($.summernote.plugins, {
            //    'brenter': function (context) {
            //        this.events = {
            //            'summernote.enter': function (we, e) {
            //                //get hold of the enter event and trigger a shift+enter keypress

            //                e.trigger($.Event("keydown", {
            //                    keyCode: 13, // ENTER
            //                    shiftKey: true
            //                }));

            //                //stop the normal event from happening
            //                e.preventDefault();
            //            }
            //        };
            //    }
            //});







            //
            // end: We have to do this to make the [enter] key work as expected, without inserting p/paragraph elemenets.
            //
            console.log('set summernote height xcx28888565. <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<setting the height here doesnt work for some reason.');

            //
            // Documentation: https://summernote.org/deep-dive/
            //

            this.options.summernote = $(bodyElement).summernote({
                fontName: 'Calibri',
                fontSize: '12',

                spellCheck: true,

                height: 250,                 // Set editor height. The user can resize it. This is a good size for when the request is first displayed.
                //minHeight: 500,             // set minimum height of editor
                //maxHeight: 75,             // set maximum height of editor
                //maxWidth: 700,             // set maximum width of editor
                //width: 500,

                //overflowX: 'hidden',
                //placeholder: '', // 'Hello stand alone ui',
                //tabsize: 2,

                //disableResizeEditor: true, // This indeed disables the horizontal resize, but it doesn't solve the text wrapping I am trying to get working.

                //lineWrapping: true,

                //codemirror: {
                //    //mode: 'text/html',
                //    //htmlMode: true,
                //    //lineNumbers: true,
                //    lineWrapping: true
                //    //theme: 'monokai'
                //},
                     codemirror: {
                    mode: 'text/html',
                    htmlMode: true,
                    lineNumbers: true,
                    lineWrapping: true,
                    theme: 'monokai'
                },

                //height: 400, // If you don’t set the height, editable area’s height will change according to contents. See: https://github.com/summernote/summernote/issues/1441 // 6-20-2024.
                //airMode: true,
                toolbar: [
                    ['style', ['style']],
                    ['fontsize', ['fontsize']],
                    ['font', ['bold', 'underline', 'clear', 'strikethrough']],

                    ['color', ['color']],
                    //['para', ['ul', 'ol', 'paragraph']],
                    //['table', ['table']],
                    //['insert', ['link', 'picture', 'video']],
                    ['insert', ['link', 'picture', 'video']],
                    //['height', ['height']],
                    ['view', ['fullscreen']]
                ]

            });




            // Have you tried wrapping the element you're calling Summernote on with a set width element, and not using `maxWidth',
            // Summernote by default fills its container element, so if that is set to change dynamically, or to a set width Summernote should fill that container.



            
            //
            // end: Summernote 6-30-2024. See above for element declaration.
            //














            //
            // If we have jsonData, populate the element.
            //
            if (this.options.jsonData) {
                var dataElement = $(this.element).find('.bwRequestJson:first');
                if (dataElement) {
                    if (this.options.jsonData[this.widgetName] && this.options.jsonData[this.widgetName].value) {
                        var value = this.options.jsonData[this.widgetName].value;
                        //$(dataElement).html(value);
                        $(dataElement).summernote('code', value);
                        console.log('In bwJustificationDetailsField.js.renderAndPopulateJustificationDetailsField(). Displayed jsonData for form widget: ' + this.widgetName + ', data: ' + JSON.stringify(this.options.jsonData[this.widgetName]));
                    }
                } else {
                    console.log('Error in form widget "' + this.widgetName + '". Could not find the display element.');
                    var html = '';
                    html += '<span style="font-size:24pt;color:red;">Error in form widget bwJustificationDetailsField. Could not find the display element.</span>';
                    html += '<br />';
                    html += '<span style="">Exception in bwJustificationDetailsField.js.renderAndPopulateJustificationDetailsField(): ' + e.message + ', ' + e.stack + '</span>';
                    thiz.element.html(html);
                }
            }
            //
            // end: If we have jsonData, populate the element.
            //

        } catch (e) {
            console.log('Exception in renderAndPopulateJustificationDetailsField: ' + e.message + ', ' + e.stack);
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwJustificationDetailsField</span>';
            html += '<br />';
            html += '<span style="">Exception in bwJustificationDetailsField.js.renderAndPopulateJustificationDetailsField(): ' + e.message + ', ' + e.stack + '</span>';
            thiz.element.html(html);
        }
    },

    renderAndPopulateJustificationDetailsField_ReadOnly: function (requestDialogId) {
        try {
            console.log('In renderAndPopulateJustificationDetailsField_ReadOnly().');
            //displayAlertDialog('In renderAndPopulateJustificationDetailsField_ReadOnly().');
            var thiz = this;

            var html = '';

            html += '<table style="width:100%;">';
            html += '                        <tbody><tr class="xdTableOffsetRow xdTableOffsetRow-editor" id="toolboxdraggablerow_2" draggable="true" bwwidgetname="bwJustificationDetailsField">';
            html += '                            <td class="xdTableOffsetCellLabel" style="text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 22px; BORDER-LEFT: #d8d8d8 1pt; PADDING-RIGHT: 5px">';
            html += '                                <span class="xdlabel">';
            html += '                                    Justification Details:';
            html += '<br />';

            if (requestDialogId) {
                html += '<a onclick="$(\'#' + requestDialogId + '\').find(\'.bwJustificationDetailsField\').bwJustificationDetailsField(\'ToggleExpandJustificationDetails\');">';
                html += '   <img id="imgExpandJustificationDetails" src="../images/drawer-open.png" style="text-align:left; cursor:pointer;width:35px;height:35px;float:right;margin-right:10px;">';
                html += '</a>';
            } else {
                //html += '<a onclick="$(\'#' + requestDialogId + '\').find(\'.bwJustificationDetailsField\').bwJustificationDetailsField(\'ToggleExpandJustificationDetails\');">';
                html += '   <img id="imgExpandJustificationDetails" src="../images/drawer-open.png" style="text-align:left; cursor:pointer;width:35px;height:35px;float:right;margin-right:10px;">';
                //html += '</a>';
            }


            html += '                                </span>';
            //html += '                                <span style="color:red;font-size:medium;">*</span>';

            if (this.options.inFormsEditor == true) {
                html += '                               <span class="ToggleRequiredAsterisk" title="Select this asterick to make this a required field." onclick="$(\'.bwFormsEditor\').bwFormsEditor(\'toggleFormRequiredField\', this);">*</span>';
            } else if (this.options.renderAsARequiredField == true) {
                html += '                               <span style="color:red;font-size:medium;">*</span>';
            } else if (this.options.renderAsARequiredField == false) {
                //
            }

            html += '                            </td>';
            html += '                            <td class="xdTableOffsetCellComponent" style="white-space:nowrap;text-align:left; VERTICAL-ALIGN: top; PADDING-BOTTOM: 4px; PADDING-TOP: 4px; PADDING-LEFT: 5px; PADDING-RIGHT: 22px;">';



            html += '                                      <div>';
            html += '                                        <table width="100%">';
            html += '                                          <tr>';
            //if (this.options.commentsAreRequired == true) { // If comments are required the background is that light blue color to indicate data entry is required. 
            html += '                                            <td colspan="2">';
            if (this.options.commentsAreRequired == false) {
                //html += '                                              <span id="' + this.options.requestDialogId + '_JustificationDetails" class="xdTextBoxRequired bwRequestJson" bwDataRequired="false" bwFieldname="JustificationDetails"  title="" hideFocus="1" contentEditable="true" tabIndex="0" xd:datafmt="&quot;string&quot;,&quot;plainMultiline&quot;" style="WORD-WRAP: break-word; HEIGHT: 90px; WHITE-SPACE: normal; OVERFLOW-X: auto; OVERFLOW-Y: auto; WIDTH: 100%;BACKGROUND-COLOR: white;">';
                html += '                                              <span id="JustificationDetails" class="xdTextBoxRequired bwRequestJson" contentEditable="false" bwDataRequired="false" bwFieldname="JustificationDetails"  title="" style="WORD-WRAP: break-word; HEIGHT: 90px; WHITE-SPACE: normal; OVERFLOW-X: auto; OVERFLOW-Y: auto; WIDTH: 100%;BACKGROUND-COLOR: white;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 15pt;">';
            } else {
                //html += '                                              <span id="' + this.options.requestDialogId + '_JustificationDetails" class="xdTextBoxRequired bwRequestJson" bwDataRequired="true" bwFieldname="JustificationDetails"  title="" hideFocus="1" contentEditable="true" tabIndex="0" xd:datafmt="&quot;string&quot;,&quot;plainMultiline&quot;" style="WORD-WRAP: break-word; HEIGHT: 90px; WHITE-SPACE: normal; OVERFLOW-X: auto; OVERFLOW-Y: auto; WIDTH: 100%;BACKGROUND-COLOR: white;">';
                html += '                                              <span id="JustificationDetails" class="xdTextBoxRequired bwRequestJson" contentEditable="false" bwDataRequired="true" bwFieldname="JustificationDetails"  title="" style="WORD-WRAP: break-word; HEIGHT: 90px; WHITE-SPACE: normal; OVERFLOW-X: auto; OVERFLOW-Y: auto; WIDTH: 100%;BACKGROUND-COLOR: white;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 15pt;">';
            }
            //} else {
            //    html += '                                            <td colspan="2" class="xdTableOffsetCellComponent">';
            //    html += '                                              <span id="' + this.options.requestDialogId + '_JustificationDetails"  title="" class="xdTextBox" hideFocus="1" contentEditable="true" tabIndex="0" xd:xctname="PlainText" xd:CtrlId="CTRL136" xd:binding="my:JustificationDetails" xd:datafmt="&quot;string&quot;,&quot;plainMultiline&quot;" style="WORD-WRAP: break-word; HEIGHT: 120px; WHITE-SPACE: normal; OVERFLOW-X: auto; OVERFLOW-Y: auto; WIDTH: 100%">';
            //}
            html += '                                              </span>';
            html += '                                            </td>';
            html += '                                          </tr>';

            html += '                                        </table>';
            html += '                                      </div>';





            html += '                            </td>';
            html += '                        </tr>';
            html += '                    </tbody>';
            html += '</table>';

            // Render the html.
            if (this.options.inFormsEditor != true) {
                // THIS IS VERY IMPORTANT AND NEEDS TO BE IN EVERY WIDGET!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 7-12-2020
                // Even though the widget regenerates itself (re-renders), the parent TR tag gets missed!!! Therefore we have to handle getting rid of our form editor draggable attribute here.
                this.element.closest('tr').removeAttr('draggable');
            }
            this.element.html(html);

            //
            // If we have jsonData, populate the element.
            //
            if (this.options.jsonData) {
                var dataElement = $(this.element).find('.bwRequestJson:first');
                if (dataElement) {
                    if (this.options.jsonData[this.widgetName] && this.options.jsonData[this.widgetName].value) {
                        var value = this.options.jsonData[this.widgetName].value;
                        $(dataElement).html(value);
                        console.log('In bwJustificationDetailsField.js.renderAndPopulateJustificationDetailsField(). Displayed jsonData for form widget: ' + this.widgetName + ', data: ' + JSON.stringify(this.options.jsonData[this.widgetName]));
                    }
                } else {
                    console.log('Error in form widget "' + this.widgetName + '". Could not find the display element.');
                    var html = '';
                    html += '<span style="font-size:24pt;color:red;">Error in form widget bwJustificationDetailsField. Could not find the display element.</span>';
                    html += '<br />';
                    html += '<span style="">Exception in bwJustificationDetailsField.js.renderAndPopulateJustificationDetailsField(): ' + e.message + ', ' + e.stack + '</span>';
                    thiz.element.html(html);
                }
            }
            //
            // end: If we have jsonData, populate the element.
            //








            ////// If we have jsonData, populate the element.
            //////if (this.options.jsonData != null) {
            ////if (this.options && this.options.jsonData && this.options.jsonData[bwFieldName] && this.options.jsonData[bwFieldName].value) {
            ////    var dataElement = $(this.element).find('.bwRequestJson')[0];
            ////    var bwFieldName = dataElement.getAttribute('bwfieldname');
            ////    //if (this.options && this.options.jsonData && this.options.jsonData[bwFieldName] && this.options.jsonData[bwFieldName].value) {
            ////    dataElement.innerHTML = this.options.jsonData[bwFieldName].value;
            ////    //}
            ////}

            //if (this.options.jsonData != null) {
            //    var dataElement = $(this.element).find('.bwRequestJson:first');
            //    var bwFieldName = $(dataElement).attr('bwfieldname');
            //    if (this.options.jsonData[bwFieldName] && this.options.jsonData[bwFieldName].value) {
            //        var value = this.options.jsonData[bwFieldName].value;
            //        //dataElement.value = value;
            //        $(dataElement).val(value);
            //    }
            //}

        } catch (e) {
            console.log('Exception in renderAndPopulateJustificationDetailsField_ReadOnly: ' + e.message + ', ' + e.stack);
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwJustificationDetailsField</span>';
            html += '<br />';
            html += '<span style="">Exception in bwJustificationDetailsField.renderAndPopulateJustificationDetailsField_ReadOnly(): ' + e.message + ', ' + e.stack + '</span>';
            thiz.element.html(html);
        }
    },

    viewInLargeWindow: function () {
        try {
            console.log('In bwJustificationDetailsField.js.viewInLargeWindow().');
            alert('In bwJustificationDetailsField.js.viewInLargeWindow().');
            var thiz = this;

            window.scrollTo(0, 0);
            $('.bwActiveMenu').bwActiveMenu('adjustLeftSideMenu'); // This makes sure our new stretchy-left-menu redraws Ok.

            var bwBudgetRequestId = $(this.element).closest('#budgetrequestform')[0].getAttribute('bwbudgetrequestid');
            var bwRequestType = $(this.element).closest('#budgetrequestform')[0].getAttribute('bwrequesttype');
            var bwRequestTitle = $(this.element).closest('#budgetrequestform')[0].getAttribute('bwrequesttitle');
            this.pinRequestDialog();
            var requestDialogId = 'divZoomedBwCostsGridDialog_' + bwBudgetRequestId;
            if ($('#' + requestDialogId).is(':visible')) {
                $('#' + requestDialogId).dialog('close');
            }
            var html = '';
            //html += '<div style="display:none;" id="divRequestFormDialog">';
            html += '        <table style="width:100%;">';
            html += '            <tr>';
            html += '                <td style="width:90%;">';
            //html += '                    <span id="divRequestWorkflowAuditTrailContent"></span>';
            html += '                    <span id="divRequestFormContent"></span>';
            html += '                </td>';
            html += '            </tr>';
            html += '        </table>';
            html += '        <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and zooming in on the iPhone. -->';
            html += '        <br /><br />';
            //html += '    </div>';

            //
            // THIS IS PART OF THE PIN FUNCTIONALITY 4-1-2020
            //
            var div = document.getElementById(requestDialogId); // 4-1-2020 12-28pm adt.
            if (!div) { // for some reason this gets added twice to the DOM. Figure this out someday, but for now this seems to fix it and is a good safety I suppose.
                div = document.createElement('div');
                div.id = requestDialogId;
                document.body.appendChild(div); // to place at end of document
            }
            div.innerHTML = html;
            // Now that it is part of the DOM, we can display it!
            $('#' + requestDialogId).dialog({
                modal: false,
                resizable: true,
                closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                width: '900px',
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                position: {
                    my: "middle top+12",
                    at: "middle top",
                    of: window
                },
                open: function () {
                    try {
                        var element2 = document.getElementById(requestDialogId).parentNode; // This is the best way to get a handle on the jquery dialog.
                        var requestDialogParentId = requestDialogId + '_Parent'; // We need to have an id value so we can refer to this. It doesn't have one unless we add it here.
                        element2.id = requestDialogParentId; // We need to have an id value so we can refer to this. It doesn't have one unless we add it here.

                        // This creates the custom header/draggable bar on the dialog!!! 4-2-2020. // ☈ ☇ https://www.toptal.com/designers/htmlarrows/symbols/thunderstorm/
                        var html = '';
                        html += '<table style="width:100%;" onclick="$(\'.bwRequest\').bwRequest(\'pinRequestDialog\');" ondblclick="$(\'.bwRequest\').bwRequest(\'zoomAndCenter\', \'' + requestDialogId + '\');">'; // This click event is like "pin". Once the user clicks the header of the request dialog, it no longer is modal and persists on the screen until they choose to close it.
                        html += '   <tr>';
                        html += '       <td style="width:95%;">';
                        html += '           <div id="slider_' + requestDialogId + '" style="width:20%;cursor:pointer;"></div>';
                        html += '       </td>';
                        html += '       <td>';
                        html += '           <span class="dialogXButton" style="font-size:25pt;cursor:pointer;width:100%;font-weight:bold;" onclick="$(\'#' + requestDialogId.replace('_Parent', '') + '\').dialog(\'close\');">X</span>';
                        html += '       </td>';
                        html += '   </tr>';
                        html += '</table>';

                        document.getElementById(requestDialogId).parentNode.querySelector(".ui-dialog-titlebar").innerHTML = html;

                        html = '';
                        //var form = $('#divNewRequest').find('#budgetrequestform'); // var bwBudgetRequestId = $(element).closest('#budgetrequestform')[0].getAttribute('bwbudgetrequestid');
                        var bwOrgId = $(thiz.element).closest('#budgetrequestform')[0].getAttribute('bworgid'); // $('#' + requestDialogId).find('#budgetrequestform')[0].getAttribute('bworgid'); // document.getElementById('budgetrequestform').getAttribute('bworgid'); // selected OrgId on the new request form: txtLocationPickerFilter attribute bworgid
                        var bwOrgName = $(thiz.element).closest('#budgetrequestform')[0].getAttribute('bworgname'); // document.getElementById('budgetrequestform').getAttribute('bworgname'); // selected OrgId on the new request form: txtLocationPickerFilter attribute bworgid

                        html += '<div id="budgetrequestworkflowparticipantsdialog" class="context-menu-newrequesteditorxx" align="left" bwbudgetrequestid="" bwrequesttype="" orgid="" orgname="">';
                        html += '<table style="BORDER-TOP-STYLE: none; WORD-WRAP: break-word; BORDER-LEFT-STYLE: none; BORDER-COLLAPSE: collapse; TABLE-LAYOUT: fixed; BORDER-BOTTOM-STYLE: none; BORDER-RIGHT-STYLE: none; " class="xdFormLayout">';
                        html += '    <colgroup>';
                        html += '        <col style="" />';
                        html += '    </colgroup>';
                        html += '    <tbody>';
                        html += '        <tr class="xdTableContentRow">';
                        html += '            <td style="display:block;BORDER-TOP: #d8d8d8 1pt solid; BORDER-RIGHT: #d8d8d8 1pt solid; VERTICAL-ALIGN: top; BORDER-BOTTOM: #d8d8d8 1pt solid; PADDING-BOTTOM: 0px; PADDING-TOP: 0px; PADDING-LEFT: 0px; BORDER-LEFT: #d8d8d8 1pt solid; PADDING-RIGHT: 0px" class="xdTableContentCell">';
                        html += '                <div />';
                        html += '                <table style="width:100%;">';
                        html += '                    <tr>';
                        html += '                        <td colspan="4">';
                        html += '                           <span id="' + requestDialogId + '_requestOrgClickableBreadcrumb" style="color:purple;font-size:8pt;">' + bwOrgName + '</span>';
                        html += '                       </td>';
                        html += '                    </tr>';
                        html += '                    <tr>';
                        html += '                        <td width="5px"></td>';
                        html += '                        <td>';
                        html += '                   <span>';
                        html += '<img id="' + requestDialogId + '_imgRequestOrgImage" src="' + thiz.options.operationUriPrefix + 'images/corporeal.png" style="width:150px;height:150px;"/>';




                        // Try to get a custom image. If none found, use the OOB one.
                        var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');


                        var imagePath;

                        var preventCachingGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                            return v.toString(16);
                        });

                        var activeStateIdentifier = JSON.parse($('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier'));

                        if (activeStateIdentifier.status != 'SUCCESS') {

                            imagePath += '[No image. Unauthorized. xcx213124-3-6664323]';

                        } else {

                            imagePath = thiz.options.operationUriPrefix + '_files/' + workflowAppId + '/orgimages/' + bwOrgId + '/' + 'orgimage.png?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier;

                        }

                        $.get(imagePath).done(function () {
                            setTimeout(function () { // Only needs to happen for Chrome.
                                $('#' + requestDialogId + '_imgRequestOrgImage').attr('src', imagePath);
                            }, 500);
                        }).fail(function () {
                            //alert("This org has no image."); // do nothing 
                        });
                        // End: Getting the custom image






                        html += '                   </span>';
                        html += '                        </td>';
                        html += '                        <td colspan="2" style="text-align:left;vertical-align:top;">';

                        //html += '                           <span id="' + requestDialogParentId + '_BwRequestType" style="font-size:1em;">';
                        //html += '                               [._BwRequestType]';
                        //html += '                           </span>';
                        html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 40pt;font-weight:bold;">Costs</span>';

                        html += '                           <br />';
                        //html += '                           <span id="' + requestDialogParentId + '_WorkflowGuid" style="color:gray;">[._WorkflowGuid]</span>';
                        if (bwRequestTitle == 'New') {
                            html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 25pt;font-weight:bold;">for New Budget Request</span>';
                        } else {
                            html += '<span style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 25pt;font-weight:bold;cursor:pointer;text-decoration:underline;" '; // + '</span>';
                            html += 'onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'https://budgetworkflow.com\', \'' + bwBudgetRequestId + '\', \'' + bwRequestTitle + '\', \'\', \'' + bwRequestTitle + '\', \'\');" >';
                            html += 'for Budget Request: ' + bwRequestTitle + '</span>';
                        }

                        html += '                        </td>';
                        html += '                    </tr>';


                        html += '<tr>';
                        html += '   <td colspan="4" style="height:15px;">';
                        html += '       <span class="xdlabel" id="spanBwCostsGrid_Error" style="color:tomato;" hidefocus="1"></span>'; // Errors and exceptions get displayed here.
                        html += '   </td>';
                        html += '</tr>';



                        html += '                </table>';

                        html += '<span id="' + requestDialogParentId + '_Content"></span>';
                        document.getElementById(requestDialogId).innerHTML = html;

                        $("#slider_" + requestDialogId).slider({
                            min: 50,
                            max: 200,
                            value: 100, // It starts off full size.
                            slide: function (event, ui) {
                                thiz.setZoom(ui.value, requestDialogId);
                            }//,
                            //change: function (event, ui) {
                            //    thiz.setZoom(ui.value, requestDialogId);
                            //}
                        });
                        thiz.setZoom(100, requestDialogId);

                        var html = '';
                        html += '   <table>';
                        html += '       <tr>';
                        html += '           <td>';
                        html += '               <div id="jsGridCosts_large" style="font-size:60%;"></div>';
                        html += '           </td>';
                        html += '       </tr>';
                        html += '       <tr>';
                        html += '           <td style="text-align:right;">';
                        html += '<br />';
                        html += '               <span class="xdlabel" style="font-size:15pt;font-weight:bold;">Total Costs:</span>';
                        html += '               <input id="grandTotal_large" disabled style="color:black;WIDTH: 140px;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 18pt;TEXT-ALIGN: right;" type="text">';
                        html += '               &nbsp;&nbsp;';
                        html += '               <br /><br /><br />';
                        html += '           </td>';
                        html += '       </tr>';
                        html += '   </table';
                        document.getElementById(requestDialogParentId + '_Content').innerHTML = html;

                        // If we have jsonData, populate the element.
                        if (thiz.options.jsonData["bwJustificationDetailsField"]) {
                            // already have data
                        } else {
                            // no data yet
                            thiz.options.jsonData["bwJustificationDetailsField"] = {
                                value: null
                            }
                        }

                        $('#' + requestDialogParentId + '_Content').find("#jsGridCosts_large").jsGrid({
                            width: "100%",
                            //height: "100%", 
                            maxHeight: 'auto',

                            inserting: true,
                            editing: true,
                            sorting: true,
                            paging: true,

                            confirmDeleting: false, // false prevents the alert from popping up

                            data: thiz.options.jsonData["bwJustificationDetailsField"].value,
                            noDataContent: "Click the \"Plus\" (<span style='color:green;font-weight:bold;font-size:x-large;'>+</span>) sign to add a Cost item...",

                            onInit: function () {
                                try {
                                    console.log('In bwJustificationDetailsField.onInit-large().');
                                    var grandTotal = Number(0);
                                    for (var i = 0; i < this.data.length; i++) { // Iterate through the rows and calculate the totals and grand total.
                                        var total = Number(0);
                                        if (this.data[i].Lease) total += Number(this.data[i].Lease);
                                        if (this.data[i].Expense) total += Number(this.data[i].Expense);
                                        if (this.data[i].Capital) total += Number(this.data[i].Capital);
                                        this.data[i].Total = total;
                                        grandTotal += Number(total);
                                    }
                                    if ($('#' + requestDialogParentId + '_Content').find('#grandTotal_large')[0]) {
                                        $('#' + requestDialogParentId + '_Content').find('#grandTotal_large')[0].value = formatCurrencyNoDecimal(grandTotal); // Update the grand total in the large window.
                                    }
                                    //$(thiz.element).closest('#budgetrequestform').find("#grandTotal")[0].value = formatCurrencyNoDecimal(grandTotal); // Update the smaller grid grand total.
                                } catch (e) {
                                    console.log('Exception in bwJustificationDetailsField.onInit: ' + e.message + ', ' + e.stack);
                                }
                            },

                            onRefreshed: function (args) { // jsGridCosts_large
                                try {

                                    var totalLease = Number(0);
                                    var totalExpense = Number(0);
                                    var totalCapital = Number(0);
                                    if (this.data && this.data.forEach) {
                                        this.data.forEach(function (item) {
                                            var total = Number(0);
                                            if (item.Lease) {
                                                totalLease += Number(item.Lease);
                                                total += Number(item.Lease);
                                            }
                                            if (item.Expense) {
                                                totalExpense += Number(item.Expense);
                                                total += Number(item.Expense);
                                            }
                                            if (item.Capital) {
                                                totalCapital += Number(item.Capital);
                                                total += Number(item.Capital);
                                            }
                                            if (item.Total) {
                                                item.Total = total;
                                            }
                                        });
                                    }
                                    var grandTotal = totalLease + totalExpense + totalCapital;

                                    var html = '';
                                    html += '<tr>';

                                    html += '<td>';
                                    html == 'Total Costs';
                                    html += '</td>';

                                    html += '<td class="jsgrid-cell" style="text-align:right;">';
                                    html += formatCurrencyNoDecimalNoDollarSign(totalLease);
                                    html += '</td>';

                                    html += '<td class="jsgrid-cell" style="text-align:right;">';
                                    html += formatCurrencyNoDecimalNoDollarSign(totalExpense);
                                    html += '</td>';

                                    html += '<td class="jsgrid-cell" style="text-align:right;">';
                                    html += formatCurrencyNoDecimalNoDollarSign(totalCapital);
                                    html += '</td>';

                                    html += '<td class="jsgrid-cell" style="text-align:right;">';
                                    html += formatCurrencyNoDecimalNoDollarSign(grandTotal);
                                    html += '</td>';

                                    html += '</tr>';
                                    this._content.append(html);

                                    thiz.options.jsonData["bwJustificationDetailsField"].value = this.data; // Store in the widget.

                                    $(thiz.element).closest('#budgetrequestform').find("#grandTotal_small")[0].value = formatCurrencyNoDecimal(grandTotal); // Update the smaller grid grand total.

                                } catch (e) {
                                    console.log('Exception in bwJustificationDetailsField.onRefreshed:xcx4323-2: ' + e.message + ', ' + e.stack);
                                    $('#spanBwCostsGrid_Error')[0].innerHTML = 'Exception in bwJustificationDetailsField.onRefreshed:xcx4323-2: ' + e.message + ', ' + e.stack;
                                }
                            },

                            onItemInserted: function () { // jsGridCosts_large
                                try {
                                    //console.log('In bwJustificationDetailsField.onItemInserted().');
                                    //        var grandTotal = Number(0);
                                    //        for (var i = 0; i < this.data.length; i++) { // Iterate through the rows and calculate the totals and grand total.
                                    //            var total = Number(0);
                                    //            if (this.data[i].Lease) total += Number(this.data[i].Lease);
                                    //            if (this.data[i].Expense) total += Number(this.data[i].Expense);
                                    //            if (this.data[i].Capital) total += Number(this.data[i].Capital);
                                    //            this.data[i].Total = total;
                                    //            grandTotal += Number(total);
                                    //        }
                                    //        thiz.options.jsonData["bwJustificationDetailsField"].value = this.data; // Store in the widget.
                                    //        $('#' + requestDialogParentId + '_Content').find('#grandTotal_large')[0].value = formatCurrencyNoDecimal(grandTotal); // Update the grand total in the large window.
                                    $(thiz.element).closest('#budgetrequestform').find("#jsGridCosts_small").jsGrid("option", "data", thiz.options.jsonData["bwJustificationDetailsField"].value); // Update the smaller grid.
                                    //        $(thiz.element).closest('#budgetrequestform').find("#grandTotal_small")[0].value = formatCurrencyNoDecimal(grandTotal); // Update the smaller grid grand total.

                                } catch (e) {
                                    console.log('Exception in bwJustificationDetailsField.onItemInserted: ' + e.message + ', ' + e.stack);
                                    $('#spanBwCostsGrid_Error')[0].innerHTML = 'Exception in bwJustificationDetailsField.onItemInserted: ' + e.message + ', ' + e.stack;
                                }
                            },
                            onItemUpdated: function () { // jsGridCosts_large
                                try {
                                    //console.log('In bwJustificationDetailsField.onItemInserted().');
                                    //        var grandTotal = Number(0);
                                    //        for (var i = 0; i < this.data.length; i++) { // Iterate through the rows and calculate the totals and grand total.
                                    //            var total = Number(0);
                                    //            if (this.data[i].Lease) total += Number(this.data[i].Lease);
                                    //            if (this.data[i].Expense) total += Number(this.data[i].Expense);
                                    //            if (this.data[i].Capital) total += Number(this.data[i].Capital);
                                    //            this.data[i].Total = total;
                                    //            grandTotal += Number(total);
                                    //        }
                                    //        thiz.options.jsonData["bwJustificationDetailsField"].value = this.data; // Store in the widget.
                                    //        $('#' + requestDialogParentId + '_Content').find('#grandTotal_large')[0].value = formatCurrencyNoDecimal(grandTotal); // Update the grand total in the large window.
                                    $(thiz.element).closest('#budgetrequestform').find("#jsGridCosts_small").jsGrid("option", "data", thiz.options.jsonData["bwJustificationDetailsField"].value); // Update the smaller grid.
                                    //        $(thiz.element).closest('#budgetrequestform').find("#grandTotal_small")[0].value = formatCurrencyNoDecimal(grandTotal); // Update the smaller grid grand total.

                                } catch (e) {
                                    console.log('Exception in bwJustificationDetailsField.onItemInserted: ' + e.message + ', ' + e.stack);
                                    $('#spanBwCostsGrid_Error')[0].innerHTML = 'Exception in bwJustificationDetailsField.onItemUpdated: ' + e.message + ', ' + e.stack;
                                }
                            },
                            onItemDeleted: function () { // jsGridCosts_large
                                try {
                                    //console.log('In bwJustificationDetailsField.onItemInserted().');
                                    //        var grandTotal = Number(0);
                                    //        for (var i = 0; i < this.data.length; i++) { // Iterate through the rows and calculate the totals and grand total.
                                    //            var total = Number(0);
                                    //            if (this.data[i].Lease) total += Number(this.data[i].Lease);
                                    //            if (this.data[i].Expense) total += Number(this.data[i].Expense);
                                    //            if (this.data[i].Capital) total += Number(this.data[i].Capital);
                                    //            this.data[i].Total = total;
                                    //            grandTotal += Number(total);
                                    //        }
                                    //        thiz.options.jsonData["bwJustificationDetailsField"].value = this.data; // Store in the widget.
                                    //        $('#' + requestDialogParentId + '_Content').find('#grandTotal_large')[0].value = formatCurrencyNoDecimal(grandTotal); // Update the grand total in the large window.
                                    $(thiz.element).closest('#budgetrequestform').find("#jsGridCosts_small").jsGrid("option", "data", thiz.options.jsonData["bwJustificationDetailsField"].value); // Update the smaller grid.
                                    //        $(thiz.element).closest('#budgetrequestform').find("#grandTotal_small")[0].value = formatCurrencyNoDecimal(grandTotal); // Update the smaller grid grand total.

                                } catch (e) {
                                    console.log('Exception in bwJustificationDetailsField.onItemInserted: ' + e.message + ', ' + e.stack);
                                    $('#spanBwCostsGrid_Error')[0].innerHTML = 'Exception in bwJustificationDetailsField.onItemDeleted: ' + e.message + ', ' + e.stack;
                                }
                            },
                            fields: [
                                {
                                    name: "Description", type: "text", width: 150, validate: "required", editing: true
                                },
                                {
                                    name: "Lease", type: "number", width: 50, editing: true,
                                    itemTemplate: function (value) {
                                        if (value) {
                                            return formatCurrencyNoDecimalNoDollarSign(value);
                                        } else {
                                            return '';
                                        }
                                    },
                                },
                                {
                                    name: "Expense", type: "number", width: 50, editing: true,
                                    itemTemplate: function (value) {
                                        if (value) {
                                            return formatCurrencyNoDecimalNoDollarSign(value);
                                        } else {
                                            return '';
                                        }
                                    },
                                },
                                {
                                    name: "Capital", type: "number", width: 50, editing: true,
                                    itemTemplate: function (value) {
                                        if (value) {
                                            return formatCurrencyNoDecimalNoDollarSign(value);
                                        } else {
                                            return '';
                                        }
                                    },
                                },
                                {
                                    name: "Total", type: "number", width: 50, editing: false,
                                    itemTemplate: function (value) {
                                        if (value) {
                                            return formatCurrencyNoDecimalNoDollarSign(value);
                                        } else {
                                            return '';
                                        }
                                    },
                                },
                                { type: "control" }
                            ]
                        });

                        //{ JSGRID DOCS:
                        //    onDataLoading: function(args) {},    // before controller.loadData
                        //    onDataLoaded: function(args) {},     // on done of controller.loadData

                        //    onError: function(args) {},          // on fail of any controller call
                        //    onInit: function(args) {},           // after grid initialization 

                        //    onItemInserting: function(args) {},  // before controller.insertItem
                        //    onItemInserted: function(args) {},   // on done of controller.insertItem
                        //    onItemUpdating: function(args) {},   // before controller.updateItem
                        //    onItemUpdated: function(args) {},    // on done of controller.updateItem
                        //    onItemDeleting: function(args) {},   // before controller.deleteItem
                        //    onItemDeleted: function(args) {},    // on done of controller.deleteItem
                        //    onItemInvalid: function(args) {},    // after item validation, in case data is invalid

                        //    onOptionChanging: function(args) {}, // before changing the grid option
                        //    onOptionChanged: function(args) {},  // after changing the grid option

                        //    onPageChanged: function(args) {},    // after changing the current page    

                        //    onRefreshing: function(args) {},     // before grid refresh
                        //    onRefreshed: function(args) {},      // after grid refresh
                        //    }

                    } catch (e) {
                        console.log('Exception in bwJustificationDetailsField.viewInLargeWindow().dialog.open(): ' + e.message + ', ' + e.stack);
                        $('#spanBwCostsGrid_Error')[0].innerHTML = 'Exception in bwJustificationDetailsField.viewInLargeWindow().dialog.open(): ' + e.message + ', ' + e.stack;
                    }
                }
            });
            try {
                $('.ui-widget-overlay')[0].style.zIndex = 9;
                $('#' + requestDialogId).dialog().parents('.ui-dialog')[0].style.zIndex = 10; // THIS IS A HACK ?? IS THIS THE BEST PLACE FOR THIS ?? >>>>>>>>>>>>>>>>>>>>>>>>>>>> 2-15-2020
            } catch (e) {

            }
        } catch (e) {
            console.log('Exception in bwJustificationDetailsField.viewInLargeWindow(): ' + e.message + ', ' + e.stack);
            $('#spanBwCostsGrid_Error')[0].innerHTML = 'Exception in bwJustificationDetailsField.viewInLargeWindow(): ' + e.message + ', ' + e.stack;
        }
    },

});