$.widget("bw.bwCoreComponent", {
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
        This is the bwCoreComponent.js jQuery Widget. 
        ===========================================================

           [more to follow]
                           
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

           [put your stuff here]

        ===========================================================
        
       */

        //value: 0,
        store: null,
        Checklists: null,

        //bwTenantId: null,
        //bwWorkflowAppId: null,
        bwWorkflowAppTitle: null, // THIS IS NOT GETTING POPULATED YET WE NEED TO DO THIS!
        //bwParticipantId: null,
        workflow: null, // Not using this 100% yet. Perhaps this should load once and get referenced, instead of loading multiple times throughout the app. It is the core component so it should be the central repository perhaps? ...
        bwEnabledRequestTypes: null, // An array of the following: ['Budget Request', 'Quote Request', 'Reimbursement Request', 'Recurring Expense', 'Capital Plan Project', 'Work Order']

        bwSoundIndex: null,

        db: null,
        objectStoreCachedRequests: null,
        OfflineAttachedFiles: null,

        indexDBVersion: 1, // Index DB Version. // In Edge, if we specify 0, it raises an error, SO JUST MAKE IT GREATER THAN 1! OLD NOTES: This is arbitrary and decided by us to manage improvements to our database structure moving forward. Starting with version 0 because Edge doesn't seem to work with versions, or perhaps my edge clears history... not sure yet.
        indexDBName: 'BudgetNet-ca-Requests-TempV4', // This can be changed when you want to start fresh!!
        indexedDBInstance: null,


        operationUriPrefix: null,
        ajaxTimeout: 15000,
        quill: null,
        displayWorkflowPicker: false,
        displayRoleIdColumn: false,
        autoSenseDeviceType: false, // Automatic UI based on device type. Alpha version so far.
        temporaryConcurrencyStorageArea: null
    },
    _create: function () {
        this.element.addClass("bwCoreComponent");
        var thiz = this;
        console.log('In bwCoreComponent.js._create().');
        //debugger; // we need this to handle the IndexDB stuff and provide the db variable reference which we will use globally!
        try {
            if (this.options.operationUriPrefix == null) {
                // This formulates the operationUri, which is used throughout.
                var url1;
                if (window.location.href.indexOf('https://') > -1) {
                    url1 = window.location.href.split('https://')[1];
                    this.options.operationUriPrefix = 'https://';
                } else {
                    url1 = window.location.href.split('http://')[1]; // fallback to http.
                    this.options.operationUriPrefix = 'http://';
                }
                var url2 = url1.split('/')[0];
                this.options.operationUriPrefix += url2 + '/';
            }

            var html = '';

            html += '<style>';
            html += '.executiveSummaryInCarousel_divRowHoverDetails { ';
            html += '   min-width: 300px;'; // This is where the minimum size of the carousel tasks is set.
            html += '   min-height: 300px;'; // This is where the minimum size of the carousel tasks is set.
            html += '   border:2px solid lightgray;border-radius:30px 30px 30px 30px;padding:0 10px 20px 10px;';
            html += '   vertical-align:top;';
            html += '   background-color:white;';
            html += '}';
            html += '.executiveSummaryInCarousel_divRowHoverDetails:hover { ';
            html += '   background-color:aliceblue;';
            html += '   border:2px solid skyblue;';
            html += '   cursor:pointer !important;';
            html += '}';
            html += '</style>';

            // Include the bwPrintButton widget.
            html += '<div id="divBwPrintButton"></div>';

            //
            // This catches cntrl-p! This is where we deal with printing!!!!!!!!!!!!!! <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< PRINTING <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
            //
            var findOutWhatToPrint = function () {
                //
                // Determine which page is displayed, and call the appropriate method to generate the report.
                //
                if ($('#divRequestFormDialog').is(':visible')) { // This has to be at the top because one of the elements below could also be visible, but if the request is on top, that is what the user wants to print! :D
                    //debugger;
                    //$('.bwPrintButton').bwPrintButton('PrintIndividualRequestReport'); // THIS SHOULD PASS IN THE ORGID!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<???????????????????????????? 2-23-2020 
                    //return false; // returning false to stop the print dialog from showing.
                } else if ($('#divWelcomeMessage').is(':visible')) {
                    //$('.bwPrintButton').bwPrintButton('PrintMyPendingTasksReport');
                    //return false; // returning false to stop the print dialog from showing.
                } else if ($('#divArchive').is(':visible')) {
                    //debugger;
                    //$('.bwPrintButton').bwPrintButton('PrintCurrentYearBudgetRequestsReport');
                    //return false; // returning false to stop the print dialog from showing.
                } else {
                    // If we get here, we just let the web browser print the page as it wants.
                    //debugger;
                    cmdPrintForm();
                }
            }

            $(document).bind("keyup keydown", function (e) {
                if (e.ctrlKey && e.keyCode == 80) {
                    //alert('in bwCoreComponent._create(). The cntrl-p event has been captured!!!! returning false to stop the print dialog from showing. This is where code needs to be put.<<<<<<<<<<<<<<<<< PRINTING <<<<<<<<<<<<<<<<<<<<<');
                    findOutWhatToPrint();
                    return false;
                } else if ((e.keyCode == 224 || e.keyCode == 17 || e.keyCode == 91 || e.keyCode == 93) && e.keyCode == 80) {
                    // ToDo: 2-2-2020
                    // We can add MAC command-p capabilities here. It looks like keycode 224, 17, 91, 93 for the command key... different browsers apparently return different codes for the command key.
                    // https://stackoverflow.com/questions/3902635/how-does-one-capture-a-macs-command-key-via-javascript
                    //
                    //alert('in bwCoreComponent._create(). The command-p event has been captured (on a MAC)!!!! returning false to stop the print dialog from showing. This is where code needs to be put.<<<<<<<<<<<<<<<<< PRINTING <<<<<<<<<<<<<<<<<<<<<');
                    findOutWhatToPrint();
                    return false; // returning false to stop the print dialog from showing.
                } //else if (e.keyCode == 116) { // F5 key.
                // F5 was pressed. We want to stop that from happening because the whole browser will be forced to reload otherwise... we don't want that!
                //    console.log('F5 was pressed. We are stopping that from happening because the whole browser would be forced to reload otherwise... we don\'t want that!');
                //    return false;
                //}
            });


            // The hover dialog.
            html += '<div style="display:none;" id="divRowHoverDetails" >';
            html += '<div  class="executiveSummaryInCarousel_divRowHoverDetails" >';
            //html += '   <table id="tableRowHoverDetails" style="width:100%;" >';
            //html += '       <tr>';
            //html += '           <td style="width:90%;text-align:top;">';
            //html += '               <span id="spanRowHoverDetailsDialogTitleAndCurrentRACIStatus" style="color: #3f3f3f;"></span>';
            //html += '           </td>';
            //html += '           <td style="width:9%;"></td>';
            //html += '           <td style="width:1%;cursor:pointer;vertical-align:top;">';
            //html += '           </td>';
            //html += '       </tr>';
            //html += '   </table>';
            //html += '   <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
            html += '   <span id="spanRowHoverDetails_DialogContents"></span>';
            html += '</div>';
            html += '</div>';



            html += '<div style="display:none;" id="divConfirmFileUploadDialog_ForIdentifyingImage">';
            html += '            <table style="width:100%;">';
            html += '                <tr>';
            html += '                    <td style="width:90%;">';
            html += '                        <span id="spanConfirmFileUploadDialogTitle" style="color: #3f3f3f;font-size: 60pt;font-weight:bold;">';
            html += '                            Select the \'Upload\' button...';
            html += '                        </span>';
            html += '                    </td>';
            html += '                    <td style="width:9%;"></td>';
            html += '                    <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '                        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 120pt;font-weight:bold;" onclick="$(\'#divConfirmFileUploadDialog\').dialog(\'close\');">X</span>';
            html += '                    </td>';
            html += '                </tr>';
            html += '            </table>';
            html += '            <br /><br />';
            html += '            <span style="font-style:italic;color:gray;font-size:15pt;">The image will look the best if it is a 400 pixel (or greater) square.</span>';
            html += '            <br /><br />';


            html += '            <img id="ConfirmFileUploadDialog_ForIdentifyingImage_ImagePreview" src="#" alt="your image" />';

            //html += '            <img id="ConfirmFileUploadDialog_ForIdentifyingImage_ImagePreview2" src="#" alt="your image" />';


            //html += '            <!--<div id="btnUploadTheFileNow" class="divDialogButton" title="Click here to upload the attachment.">';
            //html += '                Upload';
            //html += '            </div>';
            //html += '            <br /><br />';
            //html += '            <div id="btnCancelUploadTheFileNow" class="divDialogButton" onclick="$(\'#divConfirmFileUploadDialog\').dialog(\'close\');">';
            //html += '                Cancel';
            //html += '            </div>-->';
            html += '        </div>';





            //// 1-12-2022
            //html += '<div style="display:none;" id="divConfirmFileUploadDialog_ForAttachments">';
            //html += '        <table style="width:100%;">';
            //html += '            <tr>';
            //html += '                <td style="width:90%;">';
            //html += '                    <span id="spanConfirmFileUploadDialogTitle" style="color: #3f3f3f;font-size: 60pt;font-weight:bold;">';
            //html += '                        Select the \'Upload\' button...';
            //html += '                    </span>';
            //html += '                </td>';
            //html += '                <td style="width:9%;"></td>';
            //html += '                <td style="width:1%;cursor:pointer;vertical-align:top;">';
            //html += '                    <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 120pt;font-weight:bold;" onclick="$(\'#divConfirmFileUploadDialog_ForAttachments\').dialog(\'close\');">X</span>';
            //html += '                </td>';
            //html += '            </tr>';
            //html += '        </table>';


            //// 4-17-2022
            //html += '<input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';


            //html += '        <br /><br />';
            //html += '        <span style="font-style:italic;color:gray;font-size:15pt;">The file name and description are not required because they can be changed later on.' + '<br />xcx66574</span>';
            //html += '        <br /><br />';

            //html += '            <img id="ConfirmFileUploadDialog_ImagePreview" src="#" alt="your image" />';

            //html += '        <table>';
            //html += '            <tr>';
            //html += '                <td><span style="font-style:italic;color:gray;font-size:20pt;">file name:</span></td>';
            //html += '                <td>';
            //html += '                    <input type="text" id="txtConfirmFileUploadDialogFilename" style="width:380px;font-size:20pt;" />&nbsp;<span style="font-style:italic;font-size:11pt;color:gray;">';
            //html += '                        <br />(don\'t include a file extension)';
            //html += '                    </span>';
            //html += '                </td>';
            //html += '            </tr>';
            //html += '            <tr>';
            //html += '                <td></td>';
            //html += '                <td></td>';
            //html += '            </tr>';
            //html += '            <tr>';
            //html += '                <td style="vertical-align:top;"><span style="font-style:italic;font-size:20pt;color:gray;">description:</span></td>';
            //html += '                <td><textarea id="txtConfirmFileUploadDialogFileDescription" style="overflow:hidden;font-size:20pt;" rows="4" cols="30"></textarea></td>';
            //html += '            </tr>';
            //html += '        </table>';
            //html += '        <div id="btnUploadTheFileNow" class="divDialogButton" title="Click here to upload the attachment." onclick="$(\'.bwAttachments\').bwAttachments(\'UploadButton_OnClick\');">';
            //html += '            Upload';
            //html += '        </div>';
            //html += '        <br /><br />';
            //html += '        <div id="btnCancelUploadTheFileNow" class="divDialogButton" onclick="$(\'.bwAttachments\').bwAttachments(\'CancelButton_OnClick\');">';
            //html += '            Cancel';
            //html += '        </div>';
            //html += '    </div>';















            html += '<div style="display:none;" id="divDisplayJsonDialog">';
            html += '  <table style="width:100%;">';
            html += '    <tr>';
            html += '      <td style="width:90%;">';
            html += '        <span id="spanDisplayJsonDialogTitle" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">[spanDisplayJsonDialogTitle]</span>';
            html += '      </td>';
            html += '      <td style="width:9%;"></td>';
            html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#divDisplayJsonDialog\').dialog(\'close\');">X</span>';
            html += '      </td>';
            html += '    </tr>';
            html += '  </table>';
            html += '  <br /><br />';
            html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
            html += '  <span id="spanDisplayJsonDialogContent" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:20pt;">[spanDisplayJsonDialogContent]</span>';
            html += '  <br />';
            html += '  <br />';
            // Copy to clipboard.
            html += '<div class="tooltip">';
            html += '   <button onclick="copyToClipboard(\'txtDisplayJsonDialogJSON\', \'spanDisplayJsonDialogCopyJsonTooltip\')" onmouseout="copyToClipboardMouseout(\'spanDisplayJsonDialogCopyJsonTooltip\')">';
            html += '       <span class="tooltiptext" id="spanDisplayJsonDialogCopyJsonTooltip">Copy JSON to the clipboard</span>';
            html += '       Copy'; // JSON...';
            html += '   </button>';
            html += '</div>';
            // end Copy to clipboard.
            html += '  <textarea id="txtDisplayJsonDialogJSON" rows="30" cols="130" style="padding-top:4px;font-size:8pt;"></textarea>';
            //html += '  <pre id="txtDisplayJsonDialogJSON" style="overflow:auto;padding-top:4px;font-size:8pt;width:98%;height:300px;border:1px solid gainsboro;"></pre>';
            html += '  <br />';
            html += '  <br />';
            html += '  <div id="btnRunDiagnostics" class="divDialogButton" title="Click here to run diagnostics...">';
            html += '   Run Diagnostics...';
            html += '  </div>';
            html += '  <br /><br />';
            html += '  <div class="divDialogButton" onclick="$(\'#divDisplayJsonDialog\').dialog(\'close\');">';
            html += '   Close';
            html += '  </div>';
            html += '  <br />';
            html += '  <br />';
            html += '</div>';




            html += '<div style="display:none;" id="divDisplayHtmlDialog">';
            html += '  <table style="width:100%;">';
            html += '    <tr>';
            html += '      <td style="width:90%;">';
            html += '        <span id="spanDisplayHtmlDialogTitle" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">[spanDisplayHtmlDialogTitle]</span>';
            html += '      </td>';
            html += '      <td style="width:9%;"></td>';
            html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#divDisplayHtmlDialog\').dialog(\'close\');">X</span>';
            html += '      </td>';
            html += '    </tr>';
            html += '  </table>';
            html += '  <br /><br />';
            html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
            html += '  <span id="spanDisplayHtmlDialogContent" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size:20pt;">[spanDisplayHtmlDialogContent]</span>';
            html += '  <br />';
            html += '  <br />';
            // Copy to clipboard.
            html += '<div class="tooltip" style="float:left;">';
            html += '   <button onclick="copyToClipboard(\'txtDisplayHtmlDialogHTML\', \'spanDisplayHtmlDialogCopyHtmlTooltip\')" onmouseout="copyToClipboardMouseout(\'spanDisplayHtmlDialogCopyHtmlTooltip\')">';
            html += '       <span class="tooltiptext" id="spanDisplayHtmlDialogCopyHtmlTooltip">Copy HTML to the clipboard</span>';
            html += '       Copy'; // JSON...';
            html += '   </button>';
            html += '</div>';
            // end Copy to clipboard.
            html += '<div style="float:right;">';
            html += '<input type="radio" id="selectViewFormDesignOrHtml_ViewHtml" name="selectViewFormDesignOrHtml" onchange="$(\'.bwFormsEditor\').bwFormsEditor(\'selectViewFormDesignOrHtml_Onchange\');" />&nbsp;View HTML';
            html += '&nbsp;&nbsp';
            html += '<input type="radio" id="selectViewFormDesignOrHtml_ViewDesign" name="selectViewFormDesignOrHtml" checked onchange="$(\'.bwFormsEditor\').bwFormsEditor(\'selectViewFormDesignOrHtml_Onchange\');" />&nbsp;View Form      ';
            html += '</div>';

            html += '  <textarea id="txtDisplayHtmlDialogHTML" rows="30" cols="130" style="padding-top:4px;font-size:8pt;"></textarea>';

            html += '  <textarea id="txtDisplayHtmlDialogDesign" rows="30" cols="130" style="padding-top:4px;font-size:8pt;"></textarea>';

            //html += '  <pre id="txtDisplayJsonDialogJSON" style="overflow:auto;padding-top:4px;font-size:8pt;width:98%;height:300px;border:1px solid gainsboro;"></pre>';


            html += '  <br />';
            html += '  <br />';
            html += '  <div id="btnRunDiagnostics" class="divDialogButton" title="Click here to run diagnostics...">';
            html += '   Run Diagnostics...';
            html += '  </div>';
            html += '  <br /><br />';
            html += '  <div class="divDialogButton" onclick="$(\'#divDisplayHtmlDialog\').dialog(\'close\');">';
            html += '   Close';
            html += '  </div>';
            html += '  <br />';
            html += '  <br />';
            html += '</div>';






            html += '<div style="display:none;" id="divCreateANewRoleDialog">';
            html += '  <table style="width:100%;">';
            html += '    <tr>';
            html += '      <td style="width:90%;">';
            html += '        <span id="spanCreateANewRoleDialogTitle" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">Create a new Role</span>';
            html += '      </td>';
            html += '      <td style="width:9%;"></td>';
            html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#divCreateANewRoleDialog\').dialog(\'close\');">X</span>';
            html += '      </td>';
            html += '    </tr>';
            html += '  </table>';
            html += '  <br /><br />';
            html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
            html += '  <span id="spanCustomSignUpDialogInvitationDescriptionText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;"></span><br />';
            html += '  <span style="font-family: calibri;">Role Abbreviation</span><br />';
            html += '  <input type="text" id="txtCreateANewRoleDialog_RoleId" style="WIDTH: 93%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 40pt;" /><br /><br />';
            html += '  <span style="font-family: calibri;">Role Name</span><br />';
            html += '  <input type="text" id="txtCreateANewRoleDialog_RoleName" style="WIDTH: 93%;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 40pt;" /><br /><br />';
            html += '  <br />';
            html += '  <input type="checkbox" id="txtCreateANewRoleDialog_Singleton" />&nbsp;This role can only have a single member in the entire organization';
            html += '  <br />';
            html += '  <br />';
            html += '  <br />';
            html += '  <table style="width:100%;">';
            html += '     <tr>';
            html += '       <td style="text-align:center;">';
            html += '  <input type="button" value="Create your new role now!" style="height:30pt;" onclick="$(\'.bwCoreComponent\').bwCoreComponent(\'createANewRole\');" />';
            html += '       </td>';
            html += '     </tr>';
            html += '  </table>';
            html += '  <br /><br />';
            html += '</div>';


            html += '<div style="display:none;" id="divEditRoleDialog">';
            html += '  <table style="width:100%;">';
            html += '    <tr>';
            html += '      <td style="width:90%;">';
            html += '        <span id="spanEditRoleDialogTitle" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">Edit Organization Role</span>';
            html += '      </td>';
            html += '      <td style="width:9%;"></td>';
            html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#divEditRoleDialog\').dialog(\'close\');">X</span>';
            html += '      </td>';
            html += '    </tr>';
            html += '  </table>';
            html += '  <br /><br />';
            html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
            //html += '  <span id="spanEditRoleDialogDescriptionText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;"></span><br />';
            //html += '  <br /><br />';
            html += '  <span id="spanOldBwRole" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;"></span>';
            html += '  <input type="hidden" id="txtEditRoleDialog_bwRoleId" />'; // Our guid identifier.
            html += '  <br /><br />';
            html += '  <span style="font-family: calibri;">Role Abbreviation</span><br />';
            html += '  <input type="text" id="txtEditRoleDialog_RoleId" style="width:23%;font-family:\'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 40pt;" /><br /><br />';
            html += '  <span style="font-family: calibri;">Role Name</span><br />';
            html += '  <input type="text" id="txtEditRoleDialog_RoleName" style="width:93%;font-family:\'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 40pt;" /><br /><br />';
            html += '  <br />';
            html += '  <input type="checkbox" id="txtEditRoleDialog_Singleton" />&nbsp;This role can only have a single member in the entire organization';
            html += '  <br />';
            html += '  <br />';
            html += '  <br />';
            html += '  <table style="width:100%;">';
            html += '     <tr>';
            html += '       <td style="text-align:center;">';
            //html += '  <input type="button" value="Save/Update role" style="height:30pt;" onclick="$(\'.bwCoreComponent\').bwCoreComponent(\'updateOrganizationRole\');" />';
            html += '  <input type="button" value="Save/Update role" style="height:30pt;" onclick="$(\'.bwCoreComponent\').bwCoreComponent(\'editBwRole\');" />';
            html += '       </td>';
            html += '     </tr>';
            html += '  </table>';
            html += '  <br /><br />';
            html += '</div>';







            html += '<div style="display:none;" id="divReassignWorkflowAdministratorRoleDialog">';
            html += '  <table style="width:100%;">';
            html += '    <tr>';
            html += '      <td style="width:90%;">';
            html += '        <span id="spanReassignWorkflowAdministratorRoleDialogTitle" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">Re-assign Workflow Administrator (ADMIN) Role</span>';
            html += '      </td>';
            html += '      <td style="width:9%;"></td>';
            html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#divReassignWorkflowAdministratorRoleDialog\').dialog(\'close\');">X</span>';
            html += '      </td>';
            html += '    </tr>';
            html += '  </table>';
            html += '  <br /><br />';
            html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
            //html += '  <span id="spanEditRoleDialogDescriptionText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;"></span><br />';
            //html += '  <br /><br />';
            html += '  <span id="spanOldBwRole" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;"></span>';
            html += '  <input type="hidden" id="txtReassignWorkflowAdministratorRoleDialog_bwRoleId" />'; // Our guid identifier.
            html += '  <br /><br />';
            html += '  <span style="font-family: calibri;">Participant Id</span><br />';
            html += '  <input type="text" id="txtReassignWorkflowAdministratorRoleDialog_ParticipantId" style="width:23%;font-family:\'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 40pt;" /><br /><br />';
            html += '  <span style="font-family: calibri;">Participant Email</span><br />';
            html += '  <input type="text" id="txtReassignWorkflowAdministratorRoleDialog_ParticipantEmail" style="width:93%;font-family:\'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 40pt;" /><br /><br />';


            html += '  <span style="font-family: calibri;">Participant Name</span><br />';
            html += '  <input type="text" id="txtReassignWorkflowAdministratorRoleDialog_ParticipantFriendlyName" style="width:93%;font-family:\'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 40pt;" /><br /><br />';


            //html += '  <br />';
            //html += '  <input type="checkbox" id="txtReassignWorkflowAdministratorRoleDialog_Singleton" />&nbsp;This role can only have a single member in the entire organization';
            //html += '  <br />';
            html += '  <br />';
            html += '  <br />';
            html += '  <table style="width:100%;">';
            html += '     <tr>';
            html += '       <td style="text-align:center;">';
            //html += '  <input type="button" value="Save/Update role" style="height:30pt;" onclick="$(\'.bwCoreComponent\').bwCoreComponent(\'updateOrganizationRole\');" />';
            html += '  <input id="buttonReassignWorkflowAdministratorRoleDialog_SaveUpdateADMINRole" type="button" value="Save/Update role" style="height:30pt;" onclick="$(\'.bwCoreComponent\').bwCoreComponent(\'reassignAdminRole\');" />';
            html += '       </td>';
            html += '     </tr>';
            html += '  </table>';
            html += '  <br /><br />';
            html += '</div>';








            html += '<div style="display:none;" id="divDeleteRoleDialog">';
            html += '  <table style="width:100%;">';
            html += '    <tr>';
            html += '      <td style="width:90%;">';
            html += '        <span id="spanDeleteRoleDialogTitle" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">Delete Organization Role</span>';
            html += '      </td>';
            html += '      <td style="width:9%;"></td>';
            html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#divDeleteRoleDialog\').dialog(\'close\');">X</span>';
            html += '      </td>';
            html += '    </tr>';
            html += '  </table>';
            html += '  <br /><br />';
            html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
            //html += '  <span id="spanEditRoleDialogDescriptionText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;"></span><br />';
            //html += '  <br /><br />';
            //html += '  <span id="spanOldBwRole" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;"></span>';
            html += '  <input type="hidden" id="txtDeleteRoleDialog_bwRoleId" />'; // Our guid identifier.
            //html += '  <br /><br />';
            html += '  <span style="font-family: calibri;">Role Abbreviation</span><br />';
            html += '  <input type="text" id="txtDeleteRoleDialog_RoleId" readonly="readonly" style="width:23%;font-family:\'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 40pt;" /><br /><br />';
            html += '  <span style="font-family: calibri;">Role Name</span><br />';
            html += '  <input type="text" id="txtDeleteRoleDialog_RoleName" readonly="readonly" style="width:93%;font-family:\'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 40pt;" /><br /><br />';
            html += '  <br />';
            html += '  <input type="checkbox" id="txtDeleteRoleDialog_Singleton" readonly="readonly" />&nbsp;This role can only have a single member in the entire organization';
            html += '  <br />';
            html += '  <br />';
            html += '  <span id="spanDeleteRoleDialogConfirmationText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;"></span><br />';
            html += '  <br />';
            html += '  <table style="width:100%;">';
            html += '     <tr>';
            html += '       <td style="text-align:center;">';
            //html += '  <input type="button" value="Save/Update role" style="height:30pt;" onclick="$(\'.bwCoreComponent\').bwCoreComponent(\'updateOrganizationRole\');" />';
            html += '<span id="spanDeleteRoleDialog_BottomButton">';
            html += '  <input type="button" value="Delete role" style="height:30pt;" onclick="$(\'.bwCoreComponent\').bwCoreComponent(\'deleteBwRole\');" />';
            html += '</span>';
            html += '       </td>';
            html += '     </tr>';
            html += '  </table>';
            html += '  <br /><br />';
            html += '</div>';



            html += '<div style="display:none;" id="divEditRolesDialog">';
            html += '  <table style="width:100%;">';
            html += '    <tr>';
            html += '      <td style="width:90%;">';
            html += '        <span id="spanEditRolesDialogTitle" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">Edit Organization Roles</span>';
            html += '      </td>';
            html += '      <td style="width:9%;"></td>';
            html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:30pt;font-weight:bold;" onclick="$(\'#divEditRolesDialog\').dialog(\'close\');">X</span>';
            html += '      </td>';
            html += '    </tr>';
            html += '  </table>';
            html += '  <br /><br />';
            html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
            html += '  <span id="spanEditRolesDialogDescriptionText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 20pt;">';
            html += 'This is the master list of roles for this global organization. The roles are assigned by clicking on the Orgs in the org tree, and assigning people there. Also they can be assigned in the Workflow screen.';
            html += '  </span>';
            html += '  <br />';
            html += '  <span id="spanEditRolesDialogContent" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;"></span><br />';
            html += '  <br /><br />';
            html += '</div>';


            html += '<div style="display:none;" id="ChangeAdminRoleDialog">';
            html += '            <table style="width:100%;">';
            html += '                <tr>';
            html += '                    <td style="width:90%;">';
            html += '                        <span id="spanChangeAdminRoleDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;font-weight:bold;">Change the ADMIN role assignment.</span>';
            html += '                    </td>';
            html += '                    <td style="width:9%;"></td>';
            html += '                    <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '                        <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 30pt;font-weight:bold;" onclick="$(\'#ChangeAdminRoleDialog\').dialog(\'close\');">X</span>';
            html += '                    </td>';
            html += '                </tr>';
            html += '            </table>';
            html += '            <br />';
            html += '            <!--<span id="spanChangeAdminRoleDialogTitle" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 22pt;font-weight:bold;">Change the role for...</span><br /><br />-->';
            //html += '            <input type="radio" name="xxrbChangeUserRole" id="xxrbChangeUserRole1" value="vendor" disabled />&nbsp;<span style="font-style:italic;color:lightgray;"><span style="color:red;">Vendor or Partner (coming soon!)</span></span><br />';
            //html += '            <input type="radio" name="rbChangeUserRole" id="rbChangeUserRole1" value="participant" />&nbsp;Participant<br />';
            //html += '            <input type="radio" name="rbChangeUserRole" id="rbChangeUserRole1" value="archiveviewer" />&nbsp;Archive Viewer<br />';
            //html += '            <input type="radio" name="rbChangeUserRole" id="rbChangeUserRole1" value="reportviewer" />&nbsp;Report Viewer<br />';
            //html += '            <input type="radio" name="rbChangeUserRole" id="rbChangeUserRole1" value="configurationmanager" />&nbsp;Configuration Manager<br />';
            html += '            <span id="spanChangeAdminRoleDialogContentTop" style="color:grey;font-size:smaller;" >';
            // html += '[spanChangeAdminRoleDialogContentTop]';
            html += '            Only 1 person can be assigned this rolexcx1.<br /><ul><li>This role has to approve all new requests before they continue through the approval process.</li><li>This role receives tasks when no one has been specified for a role in the organization.</li><li>This is the only role that can perform actions on behalf of other roles.</li></ul>';
            html += '            </span>';
            html += '            <br /><br />';
            html += '            <span id="spanChangeAdminRoleDialogContent" style="color:tomato;">[spanChangeAdminRoleDialogContent]</span>';
            html += '            <br /><br />';
            html += '            <input type="checkbox" id="cbChangeAdminRoleDialogEmailMessage" />&nbsp;';
            html += '            <span id="spanChangeAdminRoleDialogEmailMessageText">Send email notification to xxFriendly Name (xxEmail). You can include an additional message as well:</span>';
            html += '            <textarea id="txtChangeAdminRoleDialogEmailMessage" rows="4" cols="60"></textarea>';
            html += '            <br /><br />';
            html += '            <div id="btnChangeAdminRoleDialogChangeRole" class="divSignInButton" style="width:90%;text-align:center;line-height:0.8em;font-weight:bold;">';
            html += '                Change Role';
            html += '            </div>';
            html += '            <br /><br />';
            html += '            <div id="xxxx" class="divSignInButton" style="width:90%;text-align:center;line-height:0.8em;font-weight:bold;" onclick="$(\'#ChangeAdminRoleDialog\').dialog(\'close\');">';
            html += '                Close';
            html += '            </div>';
            html += '            <br /><br />';
            html += '</div>';


            html += '<div style="display:none;" id="divBackfillRolesConfirmationDialog">';
            html += '  <table style="width:100%;">';
            html += '    <tr>';
            html += '      <td style="width:90%;">';
            html += '        <span id="spanEditRolesDialogTitle" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">Backfill Organization Roles</span>';
            html += '      </td>';
            html += '      <td style="width:9%;"></td>';
            html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '        <span class="dialogXButton" style="font-size:30pt;font-weight:bold;cursor:pointer;" onclick="$(\'#divBackfillRolesConfirmationDialog\').dialog(\'close\');">X</span>';
            html += '      </td>';
            html += '    </tr>';
            html += '  </table>';
            html += '  <br /><br />';
            html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
            html += '  <span id="spanBackfillRolesConfirmationDialogDescriptionText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 20pt;">';
            html += 'These roles (from the Org and Workflow(s) JSON) will be backfilled into the BwRole table. This action cannot be undone.';
            html += '  </span>';
            html += '  <br />';
            html += '  <span id="spanBackfillRolesConfirmationDialogContent" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;"></span><br />';
            html += '  <br /><br />';
            html += '</div>';

            html += '<div style="display:none;" id="divReportAnErrorOrMakeASuggestion">';
            html += '  <table style="width:100%;">';
            html += '    <tr>';
            html += '      <td style="width:90%;">';
            html += '        <span id="spanEditRolesDialogTitle" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">Report an error or make a suggestion</span>';
            html += '      </td>';
            html += '      <td style="width:9%;"></td>';
            html += '      <td style="width:1%;cursor:pointer;vertical-align:top;">';
            html += '        <span class="dialogXButton" style="font-size:30pt;font-weight:bold;cursor:pointer;" onclick="$(\'#divReportAnErrorOrMakeASuggestion\').dialog(\'close\');">X</span>';
            html += '      </td>';
            html += '    </tr>';
            html += '  </table>';
            //html += '  <br /><br />';
            html += '  <input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';


            html += '  <span id="spanBackfillRolesConfirmationDialogDescriptionText" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 20pt;">';
            html += 'A screenshot of the current screen will be included with the report, along with the browser logs. These logs may contain information you do not wish to share, so be cautious when submitting this. Also, this user agent string will be included:';
            html += '  </span>';

            html += '<br /><span style="font-size:10pt;">' + navigator.userAgent + '</span>';

            //html += '  <br />';
            //html += '  <span id="spanReportAnErrorOrMakeASuggestionDialogContent" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;"></span><br />';
            html += '  <br /><br />';
            // put textbox here
            html += 'Enter the details here:<br /><textarea id="txtReportAnErrorOrMakeASuggestionDialogDescription" rows="10" cols="100"></textarea>';
            //html += '  <br /><br />';
            //html += '<div class="divDialogButton" onclick="$(\'.bwCoreComponent\').bwCoreComponent(\'takeScreenshot\');">Add a Screenshot</div>';
            html += '  <br /><br />';
            html += '<div class="divDialogButton" onclick="$(\'.bwCoreComponent\').bwCoreComponent(\'sendScreenshotNow2\');">Send Now</div>';
            html += '  <br /><br />';
            html += '<div class="divDialogButton" onclick="$(\'#divReportAnErrorOrMakeASuggestion\').dialog(\'close\');">Close</div>';
            html += '  <br /><br />';
            html += '</div>';

            this.element.html(html);

            //debugger; // do we need to do this here?
            //var authenticationOptions = {};
            //var $authentication = $("#divBwAuthentication").bwAuthentication(authenticationOptions);

            //html = '';

            //html += '<div id="spanNotLoggedInBetaBannerxx" style="vertical-align:top;padding-top:10px;">';
            //html += '    <span style="padding-left:100px;color:darkorange;font-weight:normal;vertical-align:top;">Welcome to the October 15, 2022 version.</span>';
            //html += '    <div style=""></div>';
            //html += '    <br />';
            //html += '    <img src="images/beta_1355280.png" title="Beta version: Welcome to the October 15, 2022 version." style="cursor:help;width:100px;height:100px;position:absolute;top:0;left:0;z-index:2;opacity:0.85;" />';
            //html += '    <span style="font-family:\'Courier New\';font-size:100pt;">BACKEND ADMINISTRATION TOOLS</span>';
            //html += '    <br /><br /><br />';
            //html += '    <table style="margin:auto;">';
            //html += '        <tr>';
            //html += '            <td colspan="2">';
            //html += '                <span id="spanHomePageStatusText" style="margin:auto;"></span>';
            //html += '            </td>';
            //html += '        </tr>';
            //html += '    </table>';
            //html += '    <br /><br /><br />';
            //html += '    <table style="margin:auto;">';
            //html += '        <tr>';
            //html += '            <td>';
            //html += '                <div class="divSignInButton" style="width:195px;text-align: center; line-height: 1.1em; font-weight: bold;z-index:15;border:1px solid skyblue;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'displaySignInDialogForBackendAdministration\', true);">';
            //html += '                    Sign In';
            //html += '                </div>';
            //html += '            </td>';
            //html += '    </table>';
            //html += '</div>';
            //alert('xcx12312341 is it displaying?');
            //$('#divPageContent3').html(html);



            //debugger; // 11-15-2020
            //
            // ALL IndexDB STUFF ORIGINATES FROM HERE! THIS IS the only place where we should be connecting to the database to get the global variable db for reuse everywhere.
            //
            try {
                thiz.options.indexedDBInstance = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.OIndexedDB || window.msIndexedDB; // Initialize IndexDB
            } catch (e) {
                console.log('Error instantiating this.indexedDBInstance: ' + e.message + ', ' + e.stack);
            }

            // Check if we have created the indexDB. If not, load the XSL files that we will need in case of losing the network connection.
            // Create/open database
            if (thiz.options.indexDBVersion > 0) { // In Edge, if we specify 0, it raises an error.
                thiz.options.db = thiz.options.indexedDBInstance.open(thiz.options.indexDBName, thiz.options.indexDBVersion);
            } else {
                thiz.options.db = thiz.options.indexedDBInstance.open(thiz.options.indexDBName);
            }

            thiz.options.db.onblocked = function (event) {
                debugger;
                console.log('In index.js.document.ready.openRequestsDatabase.onblocked(): errorCode: ' + event.target.error.name);
                thiz.displayAlertDialog('In index.js.document.ready.openRequestsDatabase.onblocked(): errorCode: ' + event.target.error.name);
            };
            thiz.options.db.onabort = function (event) {
                debugger;
                console.log('In index.js.document.ready.openRequestsDatabase.onabort(): errorCode: ' + event.target.error.name);
                thiz.displayAlertDialog('In index.js.document.ready.openRequestsDatabase.onabort(): errorCode: ' + event.target.error.name);
            };
            thiz.options.db.onerror = function (event) {
                debugger;
                console.log('In index.js.document.ready.openRequestsDatabase.onerror(): errorCode: ' + event.target.error.name); // AbortError
                //thiz.displayAlertDialog('In index.js.document.ready.openRequestsDatabase.onerror(): errorCode: ' + event.target.error.name);
                //initializeTheLogon();

                //renderWelcomePageOffline(); // TODD: DO THIS ANYWAY. MOST LIKELY THE MACHINE RAN OUT OF MEMORY AND DELETED THE INDEXDB DATABASES.

            };
            thiz.options.db.onsuccess = function (event) {
                console.log('In IndexDb.onsuccess() for the database "' + thiz.options.indexDBName + '", version: ' + thiz.options.indexDBVersion + '.');
                var db = event.target.result;
                try {
                    thiz.options.db = db; // THIS IS WHERE WE ACTUALLY GET THE CORRECT OBJECT SAVED!!!!!!!!!!!!!!!!! IT SHOULD ONLY HAPPEN HERE WHERE THIS HAPPENS. 7-15-2020.

                    // This is only done to make sure an exception happens if these don't exist!
                    db.OfflineAttachedFiles = db.transaction('OfflineAttachedFiles', 'readwrite');
                    db.objectStoreCachedRequests = db.transaction('objectStoreCachedRequests', 'readwrite');








                    //debugger; // 10-17-2020 We want to get the "Create offline request" functionality started here.

                    //$('#divHomePageAlert_NotLoggedIn').html('READY TO DISPLAY INDEXDB');



                    console.log('');
                    console.log('In bwCoreComponent.js._create(). COME BACK HERE WHEN WE WANT TO DISPLAY IndexDb REQUESTS WITHOUT BEING LOGGED IN. FOR NOW TURNING THIS OFF UNTIL WE CAN COME BACK TO IT.');
                    console.log('');
                    //thiz.renderAlerts3();







                } catch (e) {
                    //debugger;
                    if (e.message == 'NotFoundError') {
                        // The database has been destroyed by the browser, or did not get created properly in the beginning.
                        console.log('In bw.offline.core.js.ProcessOfflineUpload(). The database has been destroyed by the browser, or did not get created properly in the beginning.');
                        //thiz.displayAlertDialog('In bw.offline.core.js.ProcessOfflineUpload(). The database has been destroyed by the browser, or did not get created properly in the beginning.');
                        var objectStoreOfflineFiles = db.createObjectStore("OfflineAttachedFiles", { autoIncrement: true, keyPath: "id" }); // Offline file attachments. This may seem weird with the keypath, but it fixes iPhone behaviour.
                        //objectStoreOfflineFiles.createIndex("encodingType", "encodingType", { unique: false }); // This has the following so far: 'blob', 'uInt8Array', 
                        //objectStoreOfflineFiles.createIndex("fileContents", "fileContents", { unique: false });
                        //objectStoreOfflineFiles.createIndex("fileName", "fileName", { unique: false });
                        //objectStoreOfflineFiles.createIndex("fileDescription", "fileDescription", { unique: false });
                        //objectStoreOfflineFiles.createIndex("bwBudgetRequestId", "bwBudgetRequestId", { unique: false });
                        objectStoreOfflineFiles.transaction.oncomplete = function (event) {
                            console.log('In xxx.objectStoreOfflineFiles.transaction.oncomplete(). Preparing to create indexes.');
                            objectStoreOfflineFiles.createIndex("encodingType", "encodingType", { unique: false }); // This has the following so far: 'blob', 'uInt8Array', 
                            objectStoreOfflineFiles.createIndex("fileContents", "fileContents", { unique: false });
                            objectStoreOfflineFiles.createIndex("fileName", "fileName", { unique: false });
                            objectStoreOfflineFiles.createIndex("fileDescription", "fileDescription", { unique: false });
                            objectStoreOfflineFiles.createIndex("bwBudgetRequestId", "bwBudgetRequestId", { unique: false });
                            console.log('In xxx.objectStoreOfflineFiles.transaction.oncomplete(). Successfully created indexes.');

                            //var transaction = db.transaction("OfflineAttachedFiles", 'readwrite'); //IDBTransaction.READ_WRITE); 
                        };
                    } else {
                        console.log('In bw.offline.core.js.ProcessOfflineUpload(). ERROR ACCESSING OfflineAttachedFiles DATABASE33!!!!!!!!!!!!' + e.message + ', ' + e.stack);
                        thiz.displayAlertDialog('In bw.offline.core.js.ProcessOfflineUpload(). ERROR ACCESSING OfflineAttachedFiles DATABASE33!!!!!!!!!!!!' + e.message + ', ' + e.stack);
                    }
                }


                //displayAlertDialog('renderWelcomePageOffline');
                //renderWelcomePageOffline();
                //initializeTheLogon();
            };
            thiz.options.db.onupgradeneeded = function (event) {
                // This happens if the database doesn't exist. This is where we create the database and load it with the content we need for the application.
                console.log('In IndexDb.onupgradeneeded() for the database "' + thiz.options.indexDBName + '", version: ' + thiz.options.indexDBVersion + '. Not sure why this is happening every time! oldVersion: ' + event.oldVersion); //  did not exist, so it is being created.');
                //displayAlertDialog('The database "' + indexDBName + '" did not exist, so it is being created.');

                var db = event.target.result;
                debugger;
                var objectStoreCachedRequests = db.createObjectStore("objectStoreCachedRequests", { autoIncrement: true }); // Requests.
                var test = 'test'

                objectStoreCachedRequests.transaction.oncomplete = function (event) {
                    // Don't need to do anything here, it just ensures the object store is created successfully.
                    debugger;
                    console.log('In $(document).ready().objectStoreCachedRequests.transaction.oncomplete().');
                    //this.displayAlertDialog('1');
                    console.log('1');
                };

                var objectStoreOfflineFiles = db.createObjectStore("OfflineAttachedFiles", { autoIncrement: true, keyPath: "id" }); // Offline file attachments. This may seem weird with the keypath, but it fixes iPhone behaviour.
                //objectStoreOfflineFiles.createIndex("encodingType", "encodingType", { unique: false }); // This has the following so far: 'blob', 'uInt8Array', 
                //objectStoreOfflineFiles.createIndex("fileContents", "fileContents", { unique: false });
                //objectStoreOfflineFiles.createIndex("fileName", "fileName", { unique: false });
                //objectStoreOfflineFiles.createIndex("fileDescription", "fileDescription", { unique: false });
                //objectStoreOfflineFiles.createIndex("bwBudgetRequestId", "bwBudgetRequestId", { unique: false });
                objectStoreOfflineFiles.transaction.oncomplete = function (event) {
                    //this.displayAlertDialog('2');
                    console.log('2');
                    console.log('In $(document).ready().objectStoreOfflineFiles.transaction.oncomplete(). Preparing to create indexes.');
                    objectStoreOfflineFiles.createIndex("encodingType", "encodingType", { unique: false }); // This has the following so far: 'blob', 'uInt8Array', 
                    objectStoreOfflineFiles.createIndex("fileContents", "fileContents", { unique: false });
                    objectStoreOfflineFiles.createIndex("fileName", "fileName", { unique: false });
                    objectStoreOfflineFiles.createIndex("fileDescription", "fileDescription", { unique: false });
                    objectStoreOfflineFiles.createIndex("bwBudgetRequestId", "bwBudgetRequestId", { unique: false });
                    console.log('In $(document).ready().objectStoreOfflineFiles.transaction.oncomplete(). Successfully created indexes.');
                };

                //var objectStoreXsltFiles = db.createObjectStore("objectStoreCachedXsltFiles"); // XSLT files.
                //objectStoreXsltFiles.transaction.oncomplete = function (event) {
                //    //displayAlertDialog('3');

                //    debugger;
                //    console.log('In $(document).ready().objectStoreXsltFiles.transaction.oncomplete().');
                //    thiz.loadXslFiles();
                //};
            };












        } catch (e) {

            var msg = 'Exception in bwCoreComponent.js._create(): ' + e.message + ', ' + e.stack;
            console.log(msg);
            displayAlertDialog(msg);

            var html = '';
            html += '<span style="font-size:24pt;color:red;">bwCoreComponent: Exception in _create()</span>';
            html += '<br />';
            html += '<span style="">Exception in bwCoreComponent.Create(): ' + e.message + ', ' + e.stack + '</span>';
            this.element.html(html);
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
            .removeClass("bwCoreComponent")
            .text("");
    },
    getIndexDbInstance: function () {
        try {
            console.log('In bwCoreComponent.getIndexDbInstance().');
            return this.options.db;
        } catch (e) {
            console.log('Exception in bwCoreComponent.getIndexDbInstance(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwCoreComponent.getIndexDbInstance(): ' + e.message + ', ' + e.stack);
        }
    },

    copyAttachmentToAnEmailAndOpenEmail: function (attachmentDialogId) {
        try {
            console.log('In bwCoreComponent.js.copyAttachmentToAnEmailAndOpenEmail().');
            //alert('In bwCoreComponent.js.copyAttachmentToAnEmailAndOpenEmail(). attachmentDialogId: ' + JSON.stringify(attachmentDialogId));
            var thiz = this;

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

            var fileUrl = document.getElementById(attachmentDialogId).getAttribute('bwfileurl'); // Using attachmentDialogId, we can get the bwfileurl attribute, which is what we need to be able to find the file and copy it to an email.
            // Sample fileUrl: https://shareandcollaborate.com/_files/c48535a4-9a6b-4b95-9d67-c6569e9695d8/7cd8f74f-ccd6-4d37-9459-5bc542ceb233/Historical Handout for St Thomas September 2022 (2).pdf?v=d918f553-4db8-4064-89b7-6eac626c8c9f&ActiveStateIdentifier=968b5ddb-c685-4f56-a383-e21fedbd9fa7

            var data = {
                bwParticipantId_LoggedIn: participantId,
                bwActiveStateIdentifier: activeStateIdentifier,
                bwWorkflowAppId_LoggedIn: workflowAppId,

                fileUrl: fileUrl
            };

            var operationUri = this.options.operationUriPrefix + '_files/bwCutAndPaste_Attachment_To_Email';
            $.ajax({
                url: operationUri,
                type: 'POST',
                data: data,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (results) {
                    try {

                        if (results.status != 'SUCCESS') {

                            HideActivitySpinner();

                            var msg = 'Error in bwCoreComponent.js.copyAttachmentToAnEmailAndOpenEmail(). ' + results.status + ', ' + results.message;
                            console.log(msg);
                            displayAlertDialog(msg);

                        } else {

                            displayAlertDialog_Persistent('xcx1231231. ' + JSON.stringify(results.results));

                        }

                    } catch (e) {
                        HideActivitySpinner();
                        var msg = 'Exception in bwCoreComponent.js.copyAttachmentToAnEmailAndOpenEmail():2: ' + e.message + ', ' + e.stack;
                        console.log(msg);
                        displayAlertDialog(msg);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    HideActivitySpinner();
                    var msg = 'Error in bwCoreComponent.js.copyAttachmentToAnEmailAndOpenEmail(): ' + errorCode + ', ' + errorMessage + ' :: ' + JSON.stringify(data);
                    console.log(msg);
                    displayAlertDialog(msg);
                }
            });

        } catch (e) {
            HideActivitySpinner();
            var msg = 'Exception in bwCoreComponent.js.copyAttachmentToAnEmailAndOpenEmail(): ' + e.message + ', ' + e.stack;
            console.log(msg);
            displayAlertDialog(msg);
        }
    },

    collapseExecutiveRequestWorkflowSummary: function (element) { // element is the 'img' element. This is used by bwExecutiveSummariesCarousel2.js and bwDataGrid.js.
        try {
            console.log('In bwCoreComponent.js.collapseExecutiveRequestWorkflowSummary().');
            //alert('In bwCoreComponent.js.collapseExecutiveRequestWorkflowSummary().');

            if (element.src.indexOf('drawer-close.png') > -1) {

                var rows = $(element).closest('table').find('tr');

                for (var i = 1; i < rows.length; i++) {
                    rows[i].style.display = 'none';
                }

                element.src = 'images/drawer-open.png';

            } else if (element.src.indexOf('drawer-open.png') > -1) {

                var rows = $(element).closest('table').find('tr');

                for (var i = 1; i < rows.length; i++) {
                    rows[i].style.display = 'table-row';
                }

                element.src = 'images/drawer-close.png';

            } else {

                var msg = 'Error in In bwCoreComponent.js.collapseExecutiveRequestWorkflowSummary(). Unexpected value for src: ' + src;
                console.log(msg);
                displayAlertDialog(msg);

            }

        } catch (e) {
            var msg = 'Exception in bwCoreComponent.js.collapseExecutiveRequestWorkflowSummary(): ' + e.message + ', ' + e.stack;
            console.log(msg);
            displayAlertDialog(msg);
        }
    },



    slideWorkflowViewer2: function (element) { // The element is a td element in the middle row. The cell that displays the "Workflow step name".
        try {
            console.log('In bwCoreComponent.js.slideWorkflowViewer2().');
            //alert('In bwCoreComponent.js.slideWorkflowViewer2().');

            var table = $(element).closest('table');

            var middleRowElement = $(table).find('tr')[2];

            var cellIndex;
            var foundCellIndex = false;
            var middleCells = $(middleRowElement).find('td');
            for (var i = 0; i < middleCells.length; i++) {
                if ($(middleCells[i]).get(0) == element) { // Comparing elements: https://stackoverflow.com/questions/7703160/jquery-how-to-check-if-two-elements-are-the-same
                    // This is the workflow step. This is the cell thst the user wishes to view/toggle [expand/collapse].
                    foundCellIndex = true;
                    cellIndex = i;
                }
            }

            if (!foundCellIndex) {

                alert('FATAL ERROR xcx231235265665. foundCellIndex is false.');

            } else {

                var topRowElement = $(table).find('tr')[1];
                var topCells = $(topRowElement).find('td');
                for (var i = 0; i < topCells.length; i++) {
                    var x1 = $(topCells[i]).find('div');
                    var div1 = x1.get(0);
                    if (div1) {
                        if (i == cellIndex) {
                            debugger;
                            // This is the workflow step. Don't clear this cell.
                            //div1.style.display = 'block';
                            div1.style.overflow = 'auto';
                            div1.style.width = '100%';
                        } else {
                            //div1.style.display = 'none'; // display:block;overflow:hidden;width:50px;
                            //div1.style.display = 'block';
                            div1.style.overflow = 'hidden';
                            div1.style.width = '50px';
                        }
                    }
                }

                var middleRowElement = $(table).find('tr')[2];
                var middleCells = $(middleRowElement).find('td');
                for (var i = 0; i < middleCells.length; i++) {
                    var x1 = $(middleCells[i]).find('div');
                    var div1 = x1.get(0);
                    if (div1) {
                        if (i == cellIndex) {
                            debugger;
                            // This is the workflow step. Don't clear this cell.
                            //div1.style.display = 'block';
                            div1.style.overflow = 'auto';
                            div1.style.width = '100%';
                        } else {
                            //div1.style.display = 'none'; // display:block;overflow:hidden;width:50px;
                            //div1.style.display = 'block';
                            div1.style.overflow = 'hidden';
                            div1.style.width = '50px';
                        }
                    }
                }

                var bottomRowElement = $(table).find('tr')[3];
                var bottomCells = $(bottomRowElement).find('td');
                for (var i = 0; i < bottomCells.length; i++) {
                    var div2 = $(bottomCells[i]).find('div').get(0);
                    if (div2) {
                        if (i == cellIndex) {
                            // This is the workflow step. Don't clear this cell.
                            //div2.style.display = 'block';
                            div2.style.overflow = 'auto';
                            div2.style.width = '100%';
                        } else {
                            //div2.style.display = 'none'; // display:block;overflow:hidden;width:50px;
                            div2.style.overflow = 'hidden';
                            div2.style.width = '50px';
                        }
                    }
                }

            }

        } catch (e) {
            var msg = 'Exception in bwCoreComponent.js.slideWorkflowViewer2(): ' + e.message + ', ' + e.stack;
            console.log(msg);
            alert(msg);
        }
    },


    displayImageThumbnail: function (imgId, thumbnailUrl) {
        try {
            console.log('In bwCoreComponent.js.displayImageThumbnail().');
            //alert('In bwCoreComponent.js.displayImageThumbnail(). imgId: ' + imgId + ', thumbnailUrl: ' + thumbnailUrl);

            // 11-16-2022 Added this to ensure we don't inadvertently try to open a .mp4 file, for example. This really messes things up, stopping all other processes.
            var extensionIndex = thumbnailUrl.split('.').length - 1;
            var fileExtension = thumbnailUrl.toLowerCase().split('.')[extensionIndex];

            var fileExtensions = ['png', 'jpg', 'jpeg', 'jfif', 'webp', 'gif'];

            if (!(fileExtensions.indexOf(fileExtension) > -1)) {

                console.log('Error in bwCoreComponent.js.displayImageThumbnail(). Trying to load a file which is probably not a thumbnail image: ' + thumbnailUrl);

            } else {

                console.log('In bwCoreComponent.js.displayImageThumbnail(). imgId: ' + imgId + ', thumbnailUrl: ' + thumbnailUrl);

                var operationUri = this.options.operationUriPrefix + thumbnailUrl;
                $.ajax({
                    url: thumbnailUrl,
                    success: function () {
                        try {
                            var img = new Image();
                            img.src = thumbnailUrl;
                            img.onload = function (e) {
                                try {
                                    console.log('In bwCoreComponent.js.displayImageThumbnail.success.img.onload(). This means SUCCESS? imgId: ' + imgId + ', thumbnailUrl: ' + thumbnailUrl);
                                    displayAlertDialog('In bwCoreComponent.js.displayImageThumbnail.success.img.onload(). This means SUCCESS? imgId: ' + imgId + ', thumbnailUrl: ' + thumbnailUrl);
                                    document.getElementById(imgId).src = thumbnailUrl; // There is a thumbnail, so display it.
                                } catch (e) {
                                    console.log('Exception in bwCoreComponent.js.displayImageThumbnail.success.img.onload(). Displaying mp4.jfif xcx566787');
                                    displayAlertDialog('Exception in bwCoreComponent.js.displayImageThumbnail.success.img.onload(). Displaying mp4.jfif xcx566787');
                                    document.getElementById(imgId).src = globalUrlPrefix + globalUrl + '/images/mp4.jfif'; // There is no thumbnail, so display the icon.
                                }
                            }
                        } catch (e) {
                            console.log('Exception in bwCoreComponent.js.displayImageThumbnail.success(): ' + e.message + ', ' + e.stack);
                            displayAlertDialog('Exception in bwCoreComponent.js.displayImageThumbnail.success(): ' + e.message + ', ' + e.stack);
                        }
                    },
                    error: function () {
                        try {
                            console.log('Error in bwCoreComponent.js.displayImageThumbnail.get(). Displaying mp4.jfif xcx566787-2');
                            displayAlertDialog('Error in bwCoreComponent.js.displayImageThumbnail.get(). Displaying mp4.jfif xcx566787-2');
                            document.getElementById(imgId).src = globalUrlPrefix + globalUrl + '/images/mp4.jfif'; // There is no thumbnail, so display the icon.
                        } catch (e) {
                            console.log('Exception in bwCoreComponent.js.displayImageThumbnail.error(): ' + e.message + ', ' + e.stack);
                            displayAlertDialog('Exception in bwCoreComponent.js.displayImageThumbnail.error(): ' + e.message + ', ' + e.stack);
                        }
                    }
                });

            }



            //$.get(thumbnailUrl).done(function () {
            //    try {
            //        var img = new Image();
            //        img.src = thumbnailUrl;
            //        img.onload = function (e) {
            //            try {
            //                console.log('In bwCoreComponent.js.displayImageThumbnail.img.onload(). This means SUCCESS? imgId: ' + imgId + ', thumbnailUrl: ' + thumbnailUrl);
            //                document.getElementById(imgId).src = thumbnailUrl; // There is a thumbnail, so display it.
            //            } catch (e) {
            //                console.log('Exception in bwCoreComponent.js.displayImageThumbnail.img.onload(). Displaying mp4.jfif xcx566787');
            //                document.getElementById(imgId).src = globalUrlPrefix + globalUrl + '/images/mp4.jfif'; // There is no thumbnail, so display the icon.
            //            }
            //        }
            //    } catch (e) {
            //        console.log('Exception in bwCoreComponent.js.displayImageThumbnail.done(): ' + e.message + ', ' + e.stack);
            //        alert('Exception in bwCoreComponent.js.displayImageThumbnail.done(): ' + e.message + ', ' + e.stack);
            //    }
            //}).fail(function () {
            //    console.log('Fail in bwCoreComponent.js.displayImageThumbnail.get(). Displaying mp4.jfif xcx566787-2');
            //    document.getElementById(imgId).src = globalUrlPrefix + globalUrl + '/images/mp4.jfif'; // There is no thumbnail, so display the icon.
            //});

        } catch (e) {
            console.log('Exception in bwCoreComponent.js.displayImageThumbnail(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwCoreComponent.js.displayImageThumbnail(): ' + e.message + ', ' + e.stack);
        }
    },
    createHtmlToDisplayTheListOfAttachments_ForExecutiveSummary: function (elementIdSuffix, workflowAppId, bwBudgetRequestId, bwWorkflowTaskItemId, results) {
        try {
            console.log('In bwCoreComponent.js.createHtmlToDisplayTheListOfAttachments_ForExecutiveSummary(). bwBudgetRequestId: ' + bwBudgetRequestId);
            //displayAlertDialog('In bwCoreComponent.js.createHtmlToDisplayTheListOfAttachments_ForExecutiveSummary(). bwBudgetRequestId: ' + bwBudgetRequestId);

            var activeStateIdentifier = JSON.parse($('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier'));

            var preventCachingGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });

            var html = '';

            html += '<ul style="display:flex;flex-wrap:wrap;list-style-type:none;">';

            for (var i = 0; i < results.data.length; i++) {

                var filename = results.data[i].Display_Filename;



                // OLD
                //var fileUrl_Thumbnail = "_files/" + workflowAppId + "/" + bwBudgetRequestId + "/" + results.data[i].Actual_Filename + '?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier;
                // end: OLD

                // 12-14-2023. not tested properly...
                var fileUrl_Thumbnail = '';
                var fileUrl_Thumbnail_ChosenImage = '';

                if (true) { // Here is where we can implement our bnew checkbox/slider in Configuration > Personal. 12-14-2023.
                    debugger;
                    if (!(results.data[i].Actual_Filename.indexOf('.jpg') > 0)) {

                        // If it is not a .jpg, then it is not a thumbnail. Do not display it, because it could be a .mp4, for example. So, do nothing.
                        fileUrl_Thumbnail_ChosenImage = results.data[i].Actual_Filename; // '/images/noimageavailable.png';

                    } else {

                        fileUrl_Thumbnail = "_files/" + workflowAppId + "/" + bwBudgetRequestId + "/" + results.data[i].Actual_Filename + '?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier;
                        fileUrl_Thumbnail_ChosenImage = "_files/" + workflowAppId + "/" + bwBudgetRequestId + "/" + results.data[i].Actual_Filename + '?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier;
                    }

                } else {

                    fileUrl_Thumbnail = "_files/" + workflowAppId + "/" + bwBudgetRequestId + "/" + results.data[i].Actual_Filename + '?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier;
                    fileUrl_Thumbnail_ChosenImage = '/images/noimageavailable.png';

                }




                html += '<li>';

                var extensionIndex = filename.split('.').length - 1;
                var fileExtension = filename.toLowerCase().split('.')[extensionIndex];
                if ((fileExtension == 'xlsx') || (fileExtension == 'xls')) {

                    html += '<img xcx="xcx443321-1" src="images/excelicon.png" style="width:100px;height:46px;cursor:pointer;" />';

                } else if (fileExtension == 'ods') {

                    html += '<img xcx="xcx443321-1" src="images/ods.png" style="width:100px;height:46px;cursor:pointer;" />';

                } else if (fileExtension == 'pdf') {

                    //html += '<img xcx="xcx443321-2" src="images/pdf.png" style="width:100px;cursor:pointer;" />';
                    //html += '<img xcx="xcx443321-7-1" src="' + fileUrl_Thumbnail + '" style="height:150px;border:1px solid gray;" />';

                    //html += '<li>';




                    //
                    //
                    // THIS IS WHERE WE ARE TRYING TO IMPLEMENT IMG thumbnails which we can pause/stop the loading of, in order to improve responsiveness.
                    //
                    //

                    html += '<img xcx="xcx443321-8-1-new-3-2" bwsrc="' + fileUrl_Thumbnail + '" src="/images/pdf.png" style="height:150px;border:1px solid gray;" />';






                    //<div class="overlay"><span>Image title</span></div>
                    //html += '</li>';




                } else if (fileExtension == 'mp4') {

                    if (!(results.data[i].Actual_Filename.indexOf('.mp4') > 0)) {

                        // do nothing. We dont want to display.mp4 here, just their thumbnails.
                    } else {

                        //var thumbnailUrl = "_files/" + workflowAppId + "/" + bwBudgetRequestId + "/" + results.data[i].Actual_Filename + '?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier;





                        //
                        //
                        // THIS IS WHERE WE ARE TRYING TO IMPLEMENT IMG thumbnails which we can pause/stop the loading of, in order to improve responsiveness.
                        //
                        //

                        var imgId = 'img_bwExecutiveSummariesCarousel2_' + elementIdSuffix + '_' + bwBudgetRequestId + '_' + bwWorkflowTaskItemId + '_' + i;
                        html += '<img xcx="xcx443321-3-1" id="' + imgId + '" style="height:120px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;max-width:250px;border:1px solid gray;border-radius:0 30px 0 0;" alt="" ';
                        html += ' bwsrc="' + fileUrl_Thumbnail + '" src="/images/noimageavailable.png" ';
                        html += ' />';
                        html += '<br />';

                        //this.displayImageThumbnail(imgId, fileUrl_Thumbnail);

                    }







                } else if (fileExtension == 'rtf') {

                    html += '<img xcx="xcx443321-4" src="images/rtf.png" style="width:100px;cursor:pointer;" />';

                } else if (fileExtension == 'vob') {

                    html += '<img xcx="xcx443321-5" src="images/vob.png" style="width:100px;cursor:pointer;" />';

                } else if (fileExtension == 'mp3') {

                    html += '<img xcx="xcx443321-6" src="images/mp3.png" style="width:100px;cursor:pointer;" />';

                } else if (fileExtension == 'zip') {

                    html += '<img xcx="xcx443321-6" src="images/zip.png" style="width:100px;cursor:pointer;" />';

                } else {

                    if (activeStateIdentifier.status != 'SUCCESS') {

                        html += '[No image. Unauthorized. xcx213124-1]';

                    } else {


                        if (results.data[i].Thumbnail != true) { // Display thumbnails with a rounded corner.


                            //
                            //
                            // THIS IS WHERE WE ARE TRYING TO IMPLEMENT IMG thumbnails which we can pause/stop the loading of, in order to improve responsiveness.
                            //
                            //

                            html += '<img xcx="xcx443321-8-1-new-2" bwsrc="' + fileUrl_Thumbnail + '" src="' + fileUrl_Thumbnail_ChosenImage + '" style="height:150px;max-width:500px;" />';


                        } else {


                            //
                            //
                            // THIS IS WHERE WE ARE TRYING TO IMPLEMENT IMG thumbnails which we can pause/stop the loading of, in order to improve responsiveness.
                            //
                            //

                            html += '<img xcx="xcx443321-8-1-new" bwsrc="' + fileUrl_Thumbnail + '" src="' + fileUrl_Thumbnail_ChosenImage + '" style="height:150px;max-width:500px;border:1px solid gray;border-radius:0 30px 0 0;" ';





                            //html += '<img xcx="xcx443321-8-1" src="' + fileUrl_Thumbnail + '" style="height:150px;max-width:500px;border:1px solid gray;border-radius:0 30px 0 0;" ';

                            var developerModeEnabled = $('.bwAuthentication').bwAuthentication('option', 'developerModeEnabled');

                            if (developerModeEnabled == true) {
                                html += '   onmouseenter="$(\'.bwCoreComponent:first\').bwCoreComponent(\'showThumbnailHoverDetails\', \'' + bwEncodeURIComponent(JSON.stringify(results.data[i])) + '\', \'' + bwBudgetRequestId + '\', this);this.style.backgroundColor=\'lightgoldenrodyellow\';" ';
                                html += '   onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');"'; //this.style.backgroundColor=\'white\';"';
                            }
                            html += ' />';

                        }

                    }

                    html += '<br />';

                }

                html += '</li>';

            }

            html += '<ul>';

            return html;

        } catch (e) {
            console.log('Exception in bwCoreComponent.js.createHtmlToDisplayTheListOfAttachments_ForExecutiveSummary(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwCoreComponent.js.createHtmlToDisplayTheListOfAttachments_ForExecutiveSummary(): ' + e.message + ', ' + e.stack);
        }
    },
    createHtmlToDisplayTheListOfAttachments_ForBwAttachmentsWidget: function (elementIdSuffix, bwWorkflowAppId, bwBudgetRequestId, results) {
        try {
            console.log('In bwCoreComponent.js.createHtmlToDisplayTheListOfAttachments_ForBwAttachmentsWidget().');
            //displayAlertDialog('In bwCoreComponent.js.createHtmlToDisplayTheListOfAttachments(). results: ' + JSON.stringify(results));
            var thiz = this;

            var html = '';

            if (results.status != 'SUCCESS') {

                html += '<span xcx="xcx22945-1" style="color:tomato;">' + results.message + '</span>';

            } else {

                if (results.data.length <= 0) {

                    html += '<span xcx="xcx22945-2" style="color:tomato;">' + results.message + '</span>';

                } else {

                    var requestDialogId = 'divRequestFormDialog_' + bwBudgetRequestId;
                    var buttonId = requestDialogId + '_buttonEmailAttachmentsExternally'; // eg: divRequestFormDialog_c8704c8c-8128-4600-a4fd-1ff30220e2ed_buttonEmailAttachmentsExternally
                    if (document.getElementById(buttonId) && document.getElementById(buttonId).style && document.getElementById(buttonId).style.display) {
                        document.getElementById(buttonId).style.display = 'inline';
                    }

                    buttonId = requestDialogId + '_buttonOCRAttachments'; // eg: divRequestFormDialog_c8704c8c-8128-4600-a4fd-1ff30220e2ed_buttonEmailAttachmentsExternally
                    if (document.getElementById(buttonId) && document.getElementById(buttonId).style && document.getElementById(buttonId).style.display) {
                        document.getElementById(buttonId).style.display = 'inline';
                    }

                    ////
                    //// Display the image thumbnail.
                    ////
                    //var displayImageThumbnail = function (imgId, thumbnailUrl) {
                    //    $.get(thumbnailUrl).done(function () {
                    //        var img = new Image();
                    //        img.src = thumbnailUrl;
                    //        img.onload = function (e) {
                    //            try {
                    //                //alert('Displaying thumbnail 2: ' + thumbnailUrl);
                    //                document.getElementById(imgId).src = thumbnailUrl; // There is a thumbnail, so display it.
                    //            } catch (e) {
                    //                alert('xcx2312 exception 2: ' + e.message + ', ' + e.stack);
                    //                document.getElementById(imgId).src = globalUrlPrefix + globalUrl + '/images/mp4.jfif'; // There is no thumbnail, so display the icon.
                    //            }
                    //        }
                    //    }).fail(function () {

                    //        //alert('fail in Displaying thumbnail 2: ' + thumbnailUrl);

                    //        document.getElementById(imgId).src = globalUrlPrefix + globalUrl + '/images/mp4.jfif'; // There is no thumbnail, so display the icon.
                    //    });
                    //}

                    var activeStateIdentifier1 = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');
                    debugger; // 7-12-2024.
                    var activeStateIdentifier = JSON.parse(activeStateIdentifier1);

                    var preventCachingGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                    });


                    debugger; // We may just have to add a status attribute earlier on in the code... 7-12-2024.
                    if (activeStateIdentifier.status != 'SUCCESS') {

                        alert('xcx21321534-2 [No image. Unauthorized. xcx213124-3-1]');
                        html += '[No image. Unauthorized. xcx213124-3]';

                    } else {


                        for (var i = 0; i < results.data.length; i++) {

                            //Filename: filename,
                            //Description: description

                            //var filename = data[i].Filename;
                            //if (filename && filename.indexOf('_thumbnail_') > -1) {
                            //    //
                            //    // This is a thumbnail. Do not display as an attachment.
                            //    //
                            //} else {
                            // This is an actual attachment. Display it!

                            var description = results.data[i].Description;

                            var size = results.data[i].Size;
                            try {
                                size = (Number(size) / 1000000).toFixed(2);
                            } catch (e) { }

                            var timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(results.data[i].Birthtime);
                            var birthtime = timestamp4.toString();

                            var fileUrl;
                            var fileUrl_Thumbnail;
                            debugger;
                            if (activeStateIdentifier.status != 'SUCCESS') {
                                console.log('xcx21321534 [No image. Unauthorized. xcx213124-3-1]');
                                html += '[No image. Unauthorized. xcx213124-3]';

                            } else {


                                console.log('THIS IS WHERE WE CAN CHANGE THE RESOLUTION OF ATTACHMENTS WHEN THEY ARE DISPLAYED IN A REQUEST bwAttachments.js form widget. xcx2312345366.');
                                // /'/g, "%27"

                                fileUrl = "_files/" + bwWorkflowAppId + "/" + bwBudgetRequestId + "/" + encodeURI(results.data[i].Display_Filename).replace(/'/g, "%27") + '?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier;
                                //fileUrl_Thumbnail = "_files/" + bwWorkflowAppId + "/" + bwBudgetRequestId + "/" + encodeURI(results.data[i].Display_Filename).replace(/'/g, "%27") + '?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier;


                                // This is the format for the fast small thumbnails. I have been looking for this section for a long time. Here we go! Requests are going to render a whole lot faster. 7-30-2024.
                                // GOPR0247.JPG >>>> GOPR0247.JPG_320px_.jpg
                                var thumbnailFilename = results.data[i].Display_Filename + '_320px_.png'; // 8-1-2024 changed from jpg to png.
                                console.log('FOR SOME REASON 320px IS THE SMALLEST THUMBNAIL FOR THIS IMAGE. WE NEED SMALLER ONES FOR FASTER RENDERING.'); // 7-30-2024.
                                //var thumbnailFilename = results.data[i].Display_Filename + '_60px_.jpg'; 

                                fileUrl_Thumbnail = "_files/" + bwWorkflowAppId + "/" + bwBudgetRequestId + "/" + encodeURI(thumbnailFilename).replace(/'/g, "%27") + '?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier;





                            }

                            // Centered on the screen.
                            var width = 800;
                            var height = 600;
                            //var left = (screen.width - width) / 2;
                            //var top = (screen.height - height) / 2;

                            html += '<table style="width:100%;">';
                            html += '  <tr>';
                            html += '    <td style="width:10%;">';

                            var extensionIndex = results.data[i].Display_Filename.split('.').length - 1;
                            var fileExtension = results.data[i].Display_Filename.toLowerCase().split('.')[extensionIndex];

                            var thisFileHasAnUnknownFileExtension = false; // Using this to display out message about repairing the file.

                            if (['png', 'jpg', 'jpeg', 'jfif', 'webp', 'gif'].indexOf(fileExtension) > -1) {

                                if (results.data[i].Thumbnail != true) { // Display thumbnails with a rounded corner.

                                    // This displays the file. WE DO NOT WANT TO DO THAT because they are so large. Display /images/nothumbnailavailable.png instead. 9-23-2023.
                                    //html += '<img id="attachmentstest1" xcx="xcx2312-2-1" src="' + thiz.options.operationUriPrefix + fileUrl_Thumbnail + '?v=' + preventCachingGuid + '" style="height:120px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;max-width:250px;" alt="" ';
                                    html += '<img id="attachmentstest1" xcx="xcx2312-2-1" src="' + thiz.options.operationUriPrefix + '/images/nothumbnailavailable.png' + '?v=' + preventCachingGuid + '" style="height:120px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;max-width:250px;" alt="" ';
                                    console.log('This displays the file. WE DO NOT WANT TO DO THAT because they are so large. Display /images/nothumbnailavailable.png instead. 9-23-2023.');

                                } else {

                                    html += '<img id="attachmentstest1" xcx="xcx2312-2-2-2-1" src="' + thiz.options.operationUriPrefix + fileUrl_Thumbnail + '" style="height:120px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;max-width:250px;border:1px solid gray;border-radius:0 30px 0 0;" alt="" ';

                                }

                                var developerModeEnabled = $('.bwAuthentication').bwAuthentication('option', 'developerModeEnabled');

                                if (developerModeEnabled == true) {
                                    html += '   onmouseenter="$(\'.bwCoreComponent:first\').bwCoreComponent(\'showThumbnailHoverDetails\', \'' + bwEncodeURIComponent(JSON.stringify(results.data[i])) + '\', \'' + bwBudgetRequestId + '\', this);this.style.backgroundColor=\'lightgoldenrodyellow\';" ';
                                    html += '   onmouseleave="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'hideRowHoverDetails\');"'; //this.style.backgroundColor=\'white\';"';
                                }


                                // 2-16-2024 Implementing new bwAttachmentDialog.js widget.
                                //html += 'onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + results.data[i].Display_Filename + '\', \'' + bwEncodeURIComponent(description) + '\', \'' + bwBudgetRequestId + '\');" ';
                                html += 'onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + results.data[i].Display_Filename + '\', \'' + bwEncodeURIComponent(description) + '\', \'' + bwBudgetRequestId + '\');" ';




                                html += ' />';

                            } else if (['xlsx', 'xls'].indexOf(fileExtension) > -1) {

                                //html += '<img src="images/excelicon.png" style="width:100px;height:46px;" />';
                                // We need an if statement here to choose between iOS and Windows.
                                if (Platform == 'IOS8') {
                                    html += '<img src="images/excelicon.png" style="width:100px;cursor:pointer;" onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + results.data[i].Display_Filename + '\', \'' + bwEncodeURIComponent(description) + '\', \'' + bwBudgetRequestId + '\');" />';
                                    //html += '<div class="attachmentsSectionFileLink" style="height:50px;border:1px thin red;" onclick="displayAttachmentInDialog(\'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');">';
                                } else {
                                    html += '<img src="images/excelicon.png" style="width:100px;cursor:pointer;" onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + results.data[i].Display_Filename + '\', \'' + bwEncodeURIComponent(description) + '\', \'' + bwBudgetRequestId + '\');" />';
                                    //html += '<div style="cursor:pointer;" class="attachmentsSectionFileLink" onclick="displayAttachmentInDialog(\'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');">';
                                }

                            } else if (['ods'].indexOf(fileExtension) > -1) {

                                html += '<img src="images/ods.png" style="width:100px;cursor:pointer;" onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + results.data[i].Display_Filename + '\', \'' + bwEncodeURIComponent(description) + '\', \'' + bwBudgetRequestId + '\');" />';

                            } else if (['doc', 'docx', 'pdf'].indexOf(fileExtension) > -1) {

                                var thumbnailUrl = "_files/" + bwWorkflowAppId + "/" + bwBudgetRequestId + "/" + results.data[i].Actual_Filename + '?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier;

                                var imgId = 'img_bwAttachments_' + thiz.options.elementIdSuffix + '_' + bwBudgetRequestId + '_' + i;
                                html += '<img xcx="xcx55999923" id="' + imgId + '" style="height:120px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;border:1px solid gray;border-radius:0px 30px 0px 0px;" alt="" ';
                                html += ' src="' + thumbnailUrl + '" ';
                                html += '   onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + results.data[i].Display_Filename + '\', \'' + bwEncodeURIComponent(description) + '\', \'' + bwBudgetRequestId + '\');" ';
                                html += ' />';

                                this.displayImageThumbnail(imgId, thumbnailUrl);

                            } else if (fileExtension == 'mp4') {

                                var thumbnailUrl = "_files/" + bwWorkflowAppId + "/" + bwBudgetRequestId + "/" + results.data[i].Actual_Filename + '?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier;
                                var imgId = 'img_bwAttachments_' + thiz.options.elementIdSuffix + '_' + bwBudgetRequestId + '_' + i;
                                html += '<img id="' + imgId + '" style="height:120px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;max-width:250px;border:1px solid gray;border-radius:0 30px 0 0;" alt="" ';
                                html += ' src="' + thumbnailUrl + '" ';
                                html += '   onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + results.data[i].Display_Filename + '\', \'' + bwEncodeURIComponent(description) + '\', \'' + bwBudgetRequestId + '\');" ';
                                html += ' />';

                            } else if (fileExtension == 'rtf') {

                                html += '<img src="images/rtf.png" style="width:50px;cursor:pointer;" ';
                                html += 'onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + results.data[i].Display_Filename + '\', \'' + bwEncodeURIComponent(description) + '\', \'' + bwBudgetRequestId + '\');" ';
                                html += ' />';

                            } else if (fileExtension == 'vob') {

                                html += '<img src="images/vob.png" style="width:50px;cursor:pointer;" ';
                                html += 'onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + results.data[i].Display_Filename + '\', \'' + bwEncodeURIComponent(description) + '\', \'' + bwBudgetRequestId + '\');" ';
                                html += ' />';

                            } else if (fileExtension == 'xcf') {

                                html += '<img src="images/xcf.png" style="height:120px;cursor:pointer;" ';
                                html += 'onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + results.data[i].Display_Filename + '\', \'' + bwEncodeURIComponent(description) + '\', \'' + bwBudgetRequestId + '\');" ';
                                html += ' />';


                            } else if (fileExtension == 'mov') {

                                html += '<img src="images/mov.png" style="width:50px;cursor:pointer;" ';
                                html += 'onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + results.data[i].Display_Filename + '\', \'' + bwEncodeURIComponent(description) + '\', \'' + bwBudgetRequestId + '\');" ';
                                html += ' />';

                            } else if (fileExtension == 'mp3') {

                                html += '<img src="images/mp3.png" xcx="xcx4325346" style="width:50px;cursor:pointer;" ';
                                html += 'onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + results.data[i].Display_Filename + '\', \'' + bwEncodeURIComponent(description) + '\', \'' + bwBudgetRequestId + '\');" ';
                                html += ' />';

                            } else if (fileExtension == 'm4a') {

                                html += '<img src="images/m4a.png" xcx="xcx4325346" style="width:50px;cursor:pointer;" ';
                                html += 'onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + results.data[i].Display_Filename + '\', \'' + bwEncodeURIComponent(description) + '\', \'' + bwBudgetRequestId + '\');" ';
                                html += ' />';

                            } else if (fileExtension == 'zip') {

                                // Tried using a direct download link, but we need to show the dialog so there is a way to delete the file if they want to.
                                //html += '<a href="' + thiz.options.operationUriPrefix + fileUrl + '" download style="cursor:pointer;">';
                                html += '   <img src="images/zip.png" xcx="xcx4325346" style="width:50px;cursor:pointer;" ';
                                html += '   onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + results.data[i].Display_Filename + '\', \'' + bwEncodeURIComponent(description) + '\', \'' + bwBudgetRequestId + '\');" ';
                                html += '   />';
                                //html += '</a>';

                            } else {

                                if (!fileExtension) {

                                    alert('xcx21312-2 This file has no file extension: ' + fileExtension + '. Would you like to make an attempt at determining the file extension and repairing the file name?');

                                } else {

                                    thisFileHasAnUnknownFileExtension = true;
                                    //alert('xcx21312-2 This file has an unknown file extension: ' + fileExtension + '. Would you like to make an attempt at determining the file extension and repairing the file name?');

                                    if (results.data[i].Thumbnail != true) { // Display thumbnails with a rounded corner.
                                        html += '<img xcx="xcx44923-1-2" src="' + thiz.options.operationUriPrefix + fileUrl_Thumbnail + '?v=' + preventCachingGuid + '" style="height:120px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;" '; ///>';
                                    } else {
                                        //html += '<img xcx="xcx443321-8" src="' + fileUrl_Thumbnail + '?v=' + preventCachingGuid + '" style="height:150px;border-radius:0 30px 0 0;" />';
                                        html += '<img xcx="xcx44923-1-2" src="' + thiz.options.operationUriPrefix + fileUrl_Thumbnail + '?v=' + preventCachingGuid + '" style="height:120px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;border:1px solid gray;border-radius:0 30px 0 0;" '; ///>';
                                    }

                                    //var imageUrl = globalUrlPrefix + globalUrl + '/_files/' + bwWorkflowAppId + '/' + bwBudgetRequestId + '/' + filename;
                                    //html += '<img xcx="xcx44923-1-2" src="' + thiz.options.operationUriPrefix + fileUrl_Thumbnail + '?v=' + preventCachingGuid + '" style="height:120px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;" '; ///>';
                                    html += 'onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + results.data[i].Display_Filename + '\', \'' + bwEncodeURIComponent(description) + '\', \'' + bwBudgetRequestId + '\');" ';
                                    html += ' />';
                                    html += '<br />';
                                }

                            }

                            html += '    </td>';
                            html += '    <td style="width:90%;white-space:normal;vertical-align:top;" xcx="xcx223546">';

                            if (fileExtension == 'zip') {

                                html += '<a href="' + thiz.options.operationUriPrefix + fileUrl + '" download style="text-decoration:none;cursor:pointer;">';
                                // We need an if statement here to choose between iOS and Windows.
                                if (Platform == 'IOS8') {
                                    html += '<div xcx="xcx21342346-4" class="attachmentsSectionFileLink" style="height:50px;border:1px thin red;" >';
                                } else {
                                    html += '<div xcx="xcx21342346-5-1" class="attachmentsSectionFileLink" style="cursor:pointer;" >';
                                }

                                html += results.data[i].Display_Filename;

                                // Display the file attachment description.
                                if (description.length > 0) {
                                    //$('#' + attachmentsSectionId).append('&nbsp;&nbsp;<span class="attachmentsSectionDescription"> - "' + description + '"</span>');

                                    html += '<br /><span class="attachmentsSectionDescription"> - "' + description + '"</span>';
                                    //html += '<br /><span class="attachmentsSectionSize"> - ' + size + ' mb</span>';
                                } else {
                                    //$('#' + attachmentsSectionId).append('&nbsp;&nbsp;<span class="attachmentsSectionDescription"> - [no description]' + description + '</span>'); // Leave the description variable here because then we will know if something unexpected happens.

                                    html += '<br /><span class="attachmentsSectionDescription"> - [no description]' + description + '</span>';

                                }

                                if (size.toLowerCase() == 'na') {
                                    html += '<br /><span xcx="xcx1123-1" class="attachmentsSectionDescription" style="">[size unavailable]</span>';
                                } else {
                                    html += '<br /><span xcx="xcx1123-2" class="attachmentsSectionDescription">' + size + ' MB</span>';
                                }

                                // birthtime
                                if (!birthtime) {
                                    html += '<br /><span class="attachmentsSectionDescription" style="">[birthtime unavailable]</span>';
                                } else {
                                    html += '<br /><span class="attachmentsSectionDescription">' + birthtime + '</span>';
                                }

                                if (!results.data[i].bwParticipantFriendlyName) {
                                    html += '<br /><span class="attachmentsSectionDescription" style="">[participantFriendlyName unavailable]</span>';
                                } else {

                                    html += '<br /><span class="attachmentsSectionDescription">Uploaded/modified by: <span xcx="xcx123884-1" style="color:purple;cursor:pointer;" ';
                                    html += ' onclick="$(\'.bwCircleDialog2\').bwCircleDialog2(\'displayParticipantRoleMultiPickerInACircle\', true, \'\', \'' + results.data[i].bwParticipantId + '\', \'' + results.data[i].bwParticipantFriendlyName + '\', \'' + results.data[i].bwParticipantEmail + '\', \'custom\');" >';
                                    html += results.data[i].bwParticipantFriendlyName + '</span></span>';

                                }

                                //if (showRemoveAttachmentButton && (showRemoveAttachmentButton == 'true')) {
                                //    html += '&nbsp;&nbsp;<input type="button" style="cursor:pointer;" id="removeBudgetRequestAttachment' + i + '" value="Remove" onclick="removeAttachment(\'' + results.data[i].Display_Filename + '\', \'' + attachmentsTagId + '\', \'' + bwWorkflowAppId + '\', \'' + bwBudgetRequestId + '\');" />';
                                //}

                                html += '</div>';

                                html += '</a>';

                            }

                            if (thisFileHasAnUnknownFileExtension == true) {

                                html += '<div xcx="xcx21342346-3" class="attachmentsSectionFileLink" style="cursor:pointer;" onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + results.data[i].Display_Filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');">';
                                html += results.data[i].Display_Filename;

                                html += '<br /><span class="attachmentsSectionDescription">' + 'This file has an unknown file extension: ' + fileExtension + '. Would you like to make an attempt at determining the file extension and repairing the file name?' + '</span>';


                                // Display the file attachment description.
                                //if (description.length > 0) {
                                //    //$('#' + attachmentsSectionId).append('&nbsp;&nbsp;<span class="attachmentsSectionDescription"> - "' + description + '"</span>');

                                //    html += '<br /><span class="attachmentsSectionDescription"> - "' + description + '"</span>';
                                //    //html += '<br /><span class="attachmentsSectionSize"> - ' + size + ' mb</span>';
                                //} else {
                                //    //$('#' + attachmentsSectionId).append('&nbsp;&nbsp;<span class="attachmentsSectionDescription"> - [no description]' + description + '</span>'); // Leave the description variable here because then we will know if something unexpected happens.

                                //    html += '<br /><span class="attachmentsSectionDescription"> - [no description]' + description + '</span>';

                                //}

                                //if (size.toLowerCase() == 'na') {
                                //    html += '<br /><span class="attachmentsSectionDescription" style="">[size unavailable]</span>';
                                //} else {
                                //    html += '<br /><span class="attachmentsSectionDescription">' + size + ' MB</span>';
                                //}

                                //if (showRemoveAttachmentButton && (showRemoveAttachmentButton == 'true')) {
                                //    html += '&nbsp;&nbsp;<input type="button" style="cursor:pointer;" id="removeBudgetRequestAttachment' + i + '" value="Remove" onclick="removeAttachment(\'' + results.data[i].Display_Filename + '\', \'' + attachmentsTagId + '\', \'' + bwWorkflowAppId + '\', \'' + bwBudgetRequestId + '\');" />';
                                //}

                                html += '</div>';

                            } else {

                                if (fileExtension != 'zip') { // zip is done above.

                                    // We need an if statement here to choose between iOS and Windows.
                                    //if (Platform == 'IOS8') {
                                    //    html += '<div xcx="xcx21342346-4" class="attachmentsSectionFileLink" style="height:50px;border:1px thin red;" onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + results.data[i].Display_Filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');">';
                                    //} else {
                                    // THIS IS WHAT MAKES THE LINK WORK 5-30-2024: [encodeURI(results.data[i].Display_Filename).replace(/'/g, "%27")]
                                    html += '<div xcx="xcx21342346-5-2-1" class="attachmentsSectionFileLink" style="cursor:pointer;vertical-align:top;" onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + encodeURI(results.data[i].Display_Filename).replace(/'/g, "%27") + '\', \'' + encodeURI(description) + '\', \'' + bwBudgetRequestId + '\');">'; // encodeURI(JSON.stringify(products)).replace(/'/g, "%27")
                                    //}

                                    //html += results.data[i].Display_Filename;
                                    // encodeURI(results.data[i].Display_Filename).replace(/'/g, '&#39;')

                                    //html += encodeURI(results.data[i].Display_Filename).replace(/'/g, "%27");
                                    html += results.data[i].Display_Filename;

                                    // Display the file attachment description.
                                    if (description && description.length && (description.length > 0)) {
                                        //$('#' + attachmentsSectionId).append('&nbsp;&nbsp;<span class="attachmentsSectionDescription"> - "' + description + '"</span>');

                                        html += '<br /><span class="attachmentsSectionDescription"> - "' + description + '"</span>';
                                        //html += '<br /><span class="attachmentsSectionSize"> - ' + size + ' mb</span>';
                                    } else {
                                        //$('#' + attachmentsSectionId).append('&nbsp;&nbsp;<span class="attachmentsSectionDescription"> - [no description]' + description + '</span>'); // Leave the description variable here because then we will know if something unexpected happens.

                                        html += '<br /><span class="attachmentsSectionDescription"> - [no description]' + description + '</span>';

                                    }

                                    if (size.toLowerCase() == 'na') {
                                        html += '<br /><span xcx="xcx1123-1" class="attachmentsSectionDescription" style="">[size unavailable]</span>';
                                    } else {
                                        html += '<br /><span xcx="xcx1123-2" class="attachmentsSectionDescription">' + size + ' MB</span>';
                                    }

                                    // birthtime
                                    if (!birthtime) {
                                        html += '<br /><span class="attachmentsSectionDescription" style="">[birthtime unavailable]</span>';
                                    } else {
                                        html += '<br /><span class="attachmentsSectionDescription">' + birthtime + '</span>';
                                    }

                                    if (!results.data[i].bwParticipantFriendlyName) {
                                        html += '<br /><span class="attachmentsSectionDescription" style="">[participantFriendlyName unavailable]</span>';
                                    } else {

                                        html += '<br /><span class="attachmentsSectionDescription">Uploaded/modified by: <span xcx="xcx123884-2" style="color:purple;cursor:pointer;" ';
                                        html += ' onclick="$(\'.bwCircleDialog2\').bwCircleDialog2(\'displayParticipantRoleMultiPickerInACircle\', true, \'\', \'' + results.data[i].bwParticipantId + '\', \'' + results.data[i].bwParticipantFriendlyName + '\', \'' + results.data[i].bwParticipantEmail + '\', \'custom\');" >';
                                        html += results.data[i].bwParticipantFriendlyName + '</span></span>';

                                    }


                                    if (results.data[i].FileConversionStatus) {

                                        if (results.data[i].FileConversionStatus.length > 0) {

                                            var latestMessageIndex = results.data[i].FileConversionStatus.length - 1;

                                            html += '<br /><span onclick="$(\'.bwAttachments\').bwAttachments(\'GetStatusUpdateForMediaFileConversion\', \'' + encodeURI(JSON.stringify(results.data[i])) + '\', \'' + bwWorkflowAppId + '\', \'' + bwBudgetRequestId + '\');event.stopPropagation();" title="Click here to get a status update...">♻<span class="attachmentsSectionDescription">Status: </span></span><span xcx="xcx123884-44" class="attachmentsSectionDescription" style="color:tomato;font-weight:bold;cursor:pointer;" >';
                                            html += results.data[i].FileConversionStatus[latestMessageIndex].message + '</span>';

                                        } else {

                                            html += '<br /><span onclick="$(\'.bwAttachments\').bwAttachments(\'GetStatusUpdateForMediaFileConversion\', \'' + encodeURI(JSON.stringify(results.data[i])) + '\', \'' + bwWorkflowAppId + '\', \'' + bwBudgetRequestId + '\');event.stopPropagation();" title="Click here to get a status update...">♻<span class="attachmentsSectionDescription">Status: </span></span><span xcx="xcx123884-44" class="attachmentsSectionDescription" style="color:tomato;font-weight:bold;cursor:pointer;" >';
                                            html += '[empty FileConversionStatus]' + '</span>';

                                        }

                                    }


                                    //if (showRemoveAttachmentButton && (showRemoveAttachmentButton == 'true')) {
                                    //    html += '&nbsp;&nbsp;<input type="button" style="cursor:pointer;" id="removeBudgetRequestAttachment' + i + '" value="Remove" onclick="removeAttachment(\'' + results.data[i].Display_Filename + '\', \'' + attachmentsTagId + '\', \'' + bwWorkflowAppId + '\', \'' + bwBudgetRequestId + '\');" />';
                                    //}

                                    html += '</div>';

                                }
                            }

                            html += '</br>';


                            //$(attachmentWidget).find('#newrequestattachments').append(html);



                            function handleDragStart(e) {
                                try {
                                    console.log('In handleDragStart().');
                                    //this.style.opacity = '0.4';  // this / e.target is the source node.

                                    thiz.options.dragSourceAttachmentElement = this;

                                    e.dataTransfer.effectAllowed = 'copy';
                                    e.dataTransfer.dropEffect = 'copy';
                                    e.dataTransfer.setData('text/html', this.src); //.innerHTML);
                                } catch (e) {
                                    console.log('Exception in handleDragStart(): ' + e.message + ', ' + e.stack);
                                }
                            }
                            //function handleDragOver(e) {
                            //    console.log('In handleDragOver().');
                            //    if (e.preventDefault) {
                            //        e.preventDefault(); // Necessary. Allows us to drop.
                            //    }
                            //    e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
                            //    return false;
                            //}
                            //function handleDragEnter(e) {
                            //    console.log('In handleDragEnter().');
                            //    // this / e.target is the current hover target.
                            //    this.classList.add('over');
                            //}
                            //function handleDragLeave(e) {
                            //    console.log('In handleDragLeave().');
                            //    this.classList.remove('over');  // this / e.target is previous target element.
                            //}
                            // dragstart="$(\'.bwRequest\').bwRequest(\'dragstart\');"
                            //document.getElementById('attachmentstest1').addEventListener('dragstart', $('.bwRequest').bwRequest('dragstart'), false);
                            //var element1 = document.getElementById('attachmentstest1'); // $('#' + requestDialogId).find('#budgetrequestform')[0].getAttribute('bwbudgetrequestid');
                            try {
                                //var element1 = $(thiz.element).find('#attachmentstest1'); // document.getElementById('attachmentstest1'); // 
                                var element1 = $(attachmentWidget).find('#attachmentstest1');
                                element1.addEventListener('dragstart', handleDragStart, false);
                            } catch (e) { }

                            //element1.addEventListener('dragenter', handleDragEnter, false);
                            //element1.addEventListener('dragover', handleDragOver, false);
                            //element1.addEventListener('dragleave', handleDragLeave, false);

                            //var element2 = document.getElementById('dropzone1');
                            //element2.addEventListener('dragstart', handleDragStart, false);
                            //}
                            html += '    </td>';
                            html += '  </tr>';
                            html += '</table>';
                        }

                    }






                    //} else if (data) {

                    //    //$(thiz.element).find('#newrequestattachments')[0].innerHTML = '<span style="color:tomato;">No attachments found: ' + JSON.stringify(data) + '</span>';
                    //    $(attachmentWidget).find('#newrequestattachments')[0].innerHTML = '<span style="color:tomato;">No attachments found: ' + JSON.stringify(data) + '</span>';

                }
            }


            //if (!results.data) {

            //    html += '<span xcx="xcx2312111" style="font-style:italic;font-size:8pt;">' + results.message + '</span>';

            //} else if (results.data.code == 'ENOENT') {
            //    // No such file or directory

            //    console.log('[Server response: No such file or directory: ' + results.data.path + ']. This is probably Ok.?');

            //} else if (results.data && results.data.length > 0) {

            //    //$(thiz.element).find('#newrequestattachments')[0].innerHTML = ''; // It worked, and here were attachments, so get rid of the message.
            //    //$(attachmentWidget).find('#newrequestattachments')[0].innerHTML = ''; // It worked, and here were attachments, so get rid of the message.

            //    // There are attachments, so display the button.

            //} else {
            //    //$(thiz.element).find('#newrequestattachments')[0].innerHTML = '<span style="color:tomato;">ERROR: Unexpected response: ' + JSON.stringify(data) + '</span>';
            //    //$(attachmentWidget).find('#newrequestattachments')[0].innerHTML = '<span xcx="xcx22945-2" style="color:tomato;">ERROR: Unexpected response: ' + JSON.stringify(results) + '</span>';
            //    html += '<span xcx="xcx22945-2" style="color:tomato;">ERROR: Unexpected response: ' + JSON.stringify(results) + '</span>';
            //}

            return html;

        } catch (e) {
            console.log('Exception in bwCoreComponent.js.createHtmlToDisplayTheListOfAttachments_ForBwAttachmentsWidget(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwCoreComponent.js.createHtmlToDisplayTheListOfAttachments_ForBwAttachmentsWidget(): ' + e.message + ', ' + e.stack);
        }
    },
    createHtmlToDisplayTheListOfAttachments_ForBwAttachments_MusicPlaylistWidget: function (elementIdSuffix, bwWorkflowAppId, bwBudgetRequestId, results) {
        try {
            console.log('In bwCoreComponent.js.createHtmlToDisplayTheListOfAttachments_ForBwAttachments_MusicPlaylistWidget().');
            //displayAlertDialog('In bwCoreComponent.js.createHtmlToDisplayTheListOfAttachments_ForBwAttachments_MusicPlaylistWidget(). results: ' + JSON.stringify(results));
            var thiz = this;

            var html = '';

            if (results.status != 'SUCCESS') {

                html += '<span xcx="xcx22945-1" style="color:tomato;">' + results.message + '</span>';

            } else {

                if (results.data.length <= 0) {

                    html += '<span xcx="xcx22945-2" style="color:tomato;">' + results.message + '</span>';

                } else {

                    var requestDialogId = 'divRequestFormDialog_' + bwBudgetRequestId;
                    var buttonId = requestDialogId + '_buttonEmailAttachmentsExternally'; // eg: divRequestFormDialog_c8704c8c-8128-4600-a4fd-1ff30220e2ed_buttonEmailAttachmentsExternally
                    if (document.getElementById(buttonId) && document.getElementById(buttonId).style && document.getElementById(buttonId).style.display) {
                        document.getElementById(buttonId).style.display = 'inline';
                    }

                    buttonId = requestDialogId + '_buttonOCRAttachments'; // eg: divRequestFormDialog_c8704c8c-8128-4600-a4fd-1ff30220e2ed_buttonEmailAttachmentsExternally
                    if (document.getElementById(buttonId) && document.getElementById(buttonId).style && document.getElementById(buttonId).style.display) {
                        document.getElementById(buttonId).style.display = 'inline';
                    }

                    ////
                    //// Display the image thumbnail.
                    ////
                    //var displayImageThumbnail = function (imgId, thumbnailUrl) {
                    //    $.get(thumbnailUrl).done(function () {
                    //        var img = new Image();
                    //        img.src = thumbnailUrl;
                    //        img.onload = function (e) {
                    //            try {
                    //                //alert('Displaying thumbnail 2: ' + thumbnailUrl);
                    //                document.getElementById(imgId).src = thumbnailUrl; // There is a thumbnail, so display it.
                    //            } catch (e) {
                    //                alert('xcx2312 exception 2: ' + e.message + ', ' + e.stack);
                    //                document.getElementById(imgId).src = globalUrlPrefix + globalUrl + '/images/mp4.jfif'; // There is no thumbnail, so display the icon.
                    //            }
                    //        }
                    //    }).fail(function () {

                    //        //alert('fail in Displaying thumbnail 2: ' + thumbnailUrl);

                    //        document.getElementById(imgId).src = globalUrlPrefix + globalUrl + '/images/mp4.jfif'; // There is no thumbnail, so display the icon.
                    //    });
                    //}

                    var activeStateIdentifier1 = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');
                    debugger; // 7-12-2024.
                    var activeStateIdentifier = JSON.parse(activeStateIdentifier1);

                    var preventCachingGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                    });


                    debugger; // We may just have to add a status attribute earlier on in the code... 7-12-2024.
                    if (activeStateIdentifier.status != 'SUCCESS') {

                        alert('xcx21321534-2 [No image. Unauthorized. xcx213124-3-1]');
                        html += '[No image. Unauthorized. xcx213124-3]';

                    } else {


                        for (var i = 0; i < results.data.length; i++) {

                            //Filename: filename,
                            //Description: description

                            //var filename = data[i].Filename;
                            //if (filename && filename.indexOf('_thumbnail_') > -1) {
                            //    //
                            //    // This is a thumbnail. Do not display as an attachment.
                            //    //
                            //} else {
                            // This is an actual attachment. Display it!

                            var description = results.data[i].Description;

                            var size = results.data[i].Size;
                            try {
                                size = (Number(size) / 1000000).toFixed(2);
                            } catch (e) { }

                            var timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(results.data[i].Birthtime);
                            var birthtime = timestamp4.toString();

                            var fileUrl;
                            var fileUrl_Thumbnail;
                            debugger;
                            if (activeStateIdentifier.status != 'SUCCESS') {
                                console.log('xcx21321534 [No image. Unauthorized. xcx213124-3-1]');
                                html += '[No image. Unauthorized. xcx213124-3]';

                            } else {


                                console.log('THIS IS WHERE WE CAN CHANGE THE RESOLUTION OF ATTACHMENTS WHEN THEY ARE DISPLAYED IN A REQUEST bwAttachments.js form widget. xcx2312345366.');
                                // /'/g, "%27"

                                fileUrl = "_files/" + bwWorkflowAppId + "/" + bwBudgetRequestId + "/" + encodeURI(results.data[i].Display_Filename).replace(/'/g, "%27") + '?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier;
                                //fileUrl_Thumbnail = "_files/" + bwWorkflowAppId + "/" + bwBudgetRequestId + "/" + encodeURI(results.data[i].Display_Filename).replace(/'/g, "%27") + '?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier;


                                // This is the format for the fast small thumbnails. I have been looking for this section for a long time. Here we go! Requests are going to render a whole lot faster. 7-30-2024.
                                // GOPR0247.JPG >>>> GOPR0247.JPG_320px_.jpg
                                var thumbnailFilename = results.data[i].Display_Filename + '_320px_.png'; // 8-1-2024 changed from jpg to png.
                                console.log('FOR SOME REASON 320px IS THE SMALLEST THUMBNAIL FOR THIS IMAGE. WE NEED SMALLER ONES FOR FASTER RENDERING.'); // 7-30-2024.
                                //var thumbnailFilename = results.data[i].Display_Filename + '_60px_.jpg'; 

                                fileUrl_Thumbnail = "_files/" + bwWorkflowAppId + "/" + bwBudgetRequestId + "/" + encodeURI(thumbnailFilename).replace(/'/g, "%27") + '?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier;





                            }

                            // Centered on the screen.
                            var width = 800;
                            var height = 600;
                            //var left = (screen.width - width) / 2;
                            //var top = (screen.height - height) / 2;

                            html += '<table style="width:100%;">';
                            html += '  <tr>';
                            html += '    <td style="width:10%;vertical-align:top;" xcx="xcx3242526">';

                            var extensionIndex = results.data[i].Display_Filename.split('.').length - 1;
                            var fileExtension = results.data[i].Display_Filename.toLowerCase().split('.')[extensionIndex];

                            var thisFileHasAnUnknownFileExtension = false; // Using this to display out message about repairing the file.

                            if (['png', 'jpg', 'jpeg', 'jfif', 'webp', 'gif'].indexOf(fileExtension) > -1) {

                                if (results.data[i].Thumbnail != true) { // Display thumbnails with a rounded corner.

                                    // This displays the file. WE DO NOT WANT TO DO THAT because they are so large. Display /images/nothumbnailavailable.png instead. 9-23-2023.
                                    //html += '<img id="attachmentstest1" xcx="xcx2312-2-1" src="' + thiz.options.operationUriPrefix + fileUrl_Thumbnail + '?v=' + preventCachingGuid + '" style="height:120px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;max-width:250px;" alt="" ';
                                    html += '<img id="attachmentstest1" xcx="xcx2312-2-1" src="' + thiz.options.operationUriPrefix + '/images/nothumbnailavailable.png' + '?v=' + preventCachingGuid + '" style="height:120px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;max-width:250px;" alt="" ';
                                    console.log('This displays the file. WE DO NOT WANT TO DO THAT because they are so large. Display /images/nothumbnailavailable.png instead. 9-23-2023.');

                                } else {

                                    html += '<img id="attachmentstest1" xcx="xcx2312-2-2-2-1" src="' + thiz.options.operationUriPrefix + fileUrl_Thumbnail + '" style="height:120px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;max-width:250px;border:1px solid gray;border-radius:0 30px 0 0;" alt="" ';

                                }

                                var developerModeEnabled = $('.bwAuthentication').bwAuthentication('option', 'developerModeEnabled');

                                if (developerModeEnabled == true) {
                                    html += '   onmouseenter="$(\'.bwCoreComponent:first\').bwCoreComponent(\'showThumbnailHoverDetails\', \'' + bwEncodeURIComponent(JSON.stringify(results.data[i])) + '\', \'' + bwBudgetRequestId + '\', this);this.style.backgroundColor=\'lightgoldenrodyellow\';" ';
                                    html += '   onmouseleave="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'hideRowHoverDetails\');"'; //this.style.backgroundColor=\'white\';"';
                                }


                                // 2-16-2024 Implementing new bwAttachmentDialog.js widget.
                                //html += 'onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + results.data[i].Display_Filename + '\', \'' + bwEncodeURIComponent(description) + '\', \'' + bwBudgetRequestId + '\');" ';
                                html += 'onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + results.data[i].Display_Filename + '\', \'' + bwEncodeURIComponent(description) + '\', \'' + bwBudgetRequestId + '\');" ';




                                html += ' />';

                            } else if (['xlsx', 'xls'].indexOf(fileExtension) > -1) {

                                //html += '<img src="images/excelicon.png" style="width:100px;height:46px;" />';
                                // We need an if statement here to choose between iOS and Windows.
                                if (Platform == 'IOS8') {
                                    html += '<img src="images/excelicon.png" style="width:100px;cursor:pointer;" onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + results.data[i].Display_Filename + '\', \'' + bwEncodeURIComponent(description) + '\', \'' + bwBudgetRequestId + '\');" />';
                                    //html += '<div class="attachmentsSectionFileLink" style="height:50px;border:1px thin red;" onclick="displayAttachmentInDialog(\'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');">';
                                } else {
                                    html += '<img src="images/excelicon.png" style="width:100px;cursor:pointer;" onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + results.data[i].Display_Filename + '\', \'' + bwEncodeURIComponent(description) + '\', \'' + bwBudgetRequestId + '\');" />';
                                    //html += '<div style="cursor:pointer;" class="attachmentsSectionFileLink" onclick="displayAttachmentInDialog(\'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');">';
                                }

                            } else if (['ods'].indexOf(fileExtension) > -1) {

                                html += '<img src="images/ods.png" style="width:100px;cursor:pointer;" onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + results.data[i].Display_Filename + '\', \'' + bwEncodeURIComponent(description) + '\', \'' + bwBudgetRequestId + '\');" />';

                            } else if (['doc', 'docx', 'pdf'].indexOf(fileExtension) > -1) {

                                var thumbnailUrl = "_files/" + bwWorkflowAppId + "/" + bwBudgetRequestId + "/" + results.data[i].Actual_Filename + '?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier;

                                var imgId = 'img_bwAttachments_' + thiz.options.elementIdSuffix + '_' + bwBudgetRequestId + '_' + i;
                                html += '<img xcx="xcx55999923" id="' + imgId + '" style="height:120px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;border:1px solid gray;border-radius:0px 30px 0px 0px;" alt="" ';
                                html += ' src="' + thumbnailUrl + '" ';
                                html += '   onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + results.data[i].Display_Filename + '\', \'' + bwEncodeURIComponent(description) + '\', \'' + bwBudgetRequestId + '\');" ';
                                html += ' />';

                                this.displayImageThumbnail(imgId, thumbnailUrl);

                            } else if (fileExtension == 'mp4') {

                                var thumbnailUrl = "_files/" + bwWorkflowAppId + "/" + bwBudgetRequestId + "/" + results.data[i].Actual_Filename + '?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier;
                                var imgId = 'img_bwAttachments_' + thiz.options.elementIdSuffix + '_' + bwBudgetRequestId + '_' + i;
                                html += '<img id="' + imgId + '" style="height:120px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;max-width:250px;border:1px solid gray;border-radius:0 30px 0 0;" alt="" ';
                                html += ' src="' + thumbnailUrl + '" ';
                                html += '   onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + results.data[i].Display_Filename + '\', \'' + bwEncodeURIComponent(description) + '\', \'' + bwBudgetRequestId + '\');" ';
                                html += ' />';

                            } else if (fileExtension == 'rtf') {

                                html += '<img src="images/rtf.png" style="width:50px;cursor:pointer;" ';
                                html += 'onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + results.data[i].Display_Filename + '\', \'' + bwEncodeURIComponent(description) + '\', \'' + bwBudgetRequestId + '\');" ';
                                html += ' />';

                            } else if (fileExtension == 'vob') {

                                html += '<img src="images/vob.png" style="width:50px;cursor:pointer;" ';
                                html += 'onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + results.data[i].Display_Filename + '\', \'' + bwEncodeURIComponent(description) + '\', \'' + bwBudgetRequestId + '\');" ';
                                html += ' />';

                            } else if (fileExtension == 'xcf') {

                                html += '<img src="images/xcf.png" style="height:120px;cursor:pointer;" ';
                                html += 'onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + results.data[i].Display_Filename + '\', \'' + bwEncodeURIComponent(description) + '\', \'' + bwBudgetRequestId + '\');" ';
                                html += ' />';


                            } else if (fileExtension == 'mov') {

                                html += '<img src="images/mov.png" style="width:50px;cursor:pointer;" ';
                                html += 'onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + results.data[i].Display_Filename + '\', \'' + bwEncodeURIComponent(description) + '\', \'' + bwBudgetRequestId + '\');" ';
                                html += ' />';

                            } else if (fileExtension == 'mp3') {

                                html += '<img src="images/mp3.png" style="width:100px;cursor:pointer;" ';
                                html += 'onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + results.data[i].Display_Filename + '\', \'' + bwEncodeURIComponent(description) + '\', \'' + bwBudgetRequestId + '\');" ';
                                html += ' />';

                            } else if (fileExtension == 'm4a') {

                                html += '<img src="images/m4a.png" style="width:50px;cursor:pointer;" ';
                                html += 'onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + results.data[i].Display_Filename + '\', \'' + bwEncodeURIComponent(description) + '\', \'' + bwBudgetRequestId + '\');" ';
                                html += ' />';

                            } else if (fileExtension == 'zip') {

                                // Tried using a direct download link, but we need to show the dialog so there is a way to delete the file if they want to.
                                //html += '<a href="' + thiz.options.operationUriPrefix + fileUrl + '" download style="cursor:pointer;">';
                                html += '   <img src="images/zip.png" style="width:50px;cursor:pointer;" ';
                                html += '   onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + results.data[i].Display_Filename + '\', \'' + bwEncodeURIComponent(description) + '\', \'' + bwBudgetRequestId + '\');" ';
                                html += '   />';
                                //html += '</a>';

                            } else {

                                if (!fileExtension) {

                                    alert('xcx21312-2 This file has no file extension: ' + fileExtension + '. Would you like to make an attempt at determining the file extension and repairing the file name?');

                                } else {

                                    thisFileHasAnUnknownFileExtension = true;
                                    //alert('xcx21312-2 This file has an unknown file extension: ' + fileExtension + '. Would you like to make an attempt at determining the file extension and repairing the file name?');

                                    if (results.data[i].Thumbnail != true) { // Display thumbnails with a rounded corner.
                                        html += '<img xcx="xcx44923-1-2" src="' + thiz.options.operationUriPrefix + fileUrl_Thumbnail + '?v=' + preventCachingGuid + '" style="height:120px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;" '; ///>';
                                    } else {
                                        //html += '<img xcx="xcx443321-8" src="' + fileUrl_Thumbnail + '?v=' + preventCachingGuid + '" style="height:150px;border-radius:0 30px 0 0;" />';
                                        html += '<img xcx="xcx44923-1-2" src="' + thiz.options.operationUriPrefix + fileUrl_Thumbnail + '?v=' + preventCachingGuid + '" style="height:120px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;border:1px solid gray;border-radius:0 30px 0 0;" '; ///>';
                                    }

                                    //var imageUrl = globalUrlPrefix + globalUrl + '/_files/' + bwWorkflowAppId + '/' + bwBudgetRequestId + '/' + filename;
                                    //html += '<img xcx="xcx44923-1-2" src="' + thiz.options.operationUriPrefix + fileUrl_Thumbnail + '?v=' + preventCachingGuid + '" style="height:120px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;" '; ///>';
                                    html += 'onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + results.data[i].Display_Filename + '\', \'' + bwEncodeURIComponent(description) + '\', \'' + bwBudgetRequestId + '\');" ';
                                    html += ' />';
                                    html += '<br />';
                                }

                            }

                            html += '    </td>';
                            html += '    <td style="width:90%;white-space:normal;vertical-align:top;" xcx="xcx4235236744">';

                            if (fileExtension == 'zip') {

                                html += '<a href="' + thiz.options.operationUriPrefix + fileUrl + '" download style="text-decoration:none;cursor:pointer;">';
                                // We need an if statement here to choose between iOS and Windows.
                                if (Platform == 'IOS8') {
                                    html += '<div xcx="xcx21342346-4" class="attachmentsSectionFileLink" style="height:50px;border:1px thin red;" >';
                                } else {
                                    html += '<div xcx="xcx21342346-5-1" class="attachmentsSectionFileLink" style="cursor:pointer;" >';
                                }

                                html += results.data[i].Display_Filename;

                                // Display the file attachment description.
                                if (description.length > 0) {
                                    //$('#' + attachmentsSectionId).append('&nbsp;&nbsp;<span class="attachmentsSectionDescription"> - "' + description + '"</span>');

                                    html += '<br /><span class="attachmentsSectionDescription"> - "' + description + '"</span>';
                                    //html += '<br /><span class="attachmentsSectionSize"> - ' + size + ' mb</span>';
                                } else {
                                    //$('#' + attachmentsSectionId).append('&nbsp;&nbsp;<span class="attachmentsSectionDescription"> - [no description]' + description + '</span>'); // Leave the description variable here because then we will know if something unexpected happens.

                                    html += '<br /><span class="attachmentsSectionDescription"> - [no description]' + description + '</span>';

                                }

                                if (size.toLowerCase() == 'na') {
                                    html += '<br /><span xcx="xcx1123-1" class="attachmentsSectionDescription" style="">[size unavailable]</span>';
                                } else {
                                    html += '<br /><span xcx="xcx1123-2" class="attachmentsSectionDescription">' + size + ' MB</span>';
                                }

                                // birthtime
                                if (!birthtime) {
                                    html += '<br /><span class="attachmentsSectionDescription" style="">[birthtime unavailable]</span>';
                                } else {
                                    html += '<br /><span class="attachmentsSectionDescription">' + birthtime + '</span>';
                                }

                                if (!results.data[i].bwParticipantFriendlyName) {
                                    html += '<br /><span class="attachmentsSectionDescription" style="">[participantFriendlyName unavailable]</span>';
                                } else {

                                    html += '<br /><span class="attachmentsSectionDescription">Uploaded/modified by: <span xcx="xcx123884-1" style="color:purple;cursor:pointer;" ';
                                    html += ' onclick="$(\'.bwCircleDialog2\').bwCircleDialog2(\'displayParticipantRoleMultiPickerInACircle\', true, \'\', \'' + results.data[i].bwParticipantId + '\', \'' + results.data[i].bwParticipantFriendlyName + '\', \'' + results.data[i].bwParticipantEmail + '\', \'custom\');" >';
                                    html += results.data[i].bwParticipantFriendlyName + '</span></span>';

                                }

                                //if (showRemoveAttachmentButton && (showRemoveAttachmentButton == 'true')) {
                                //    html += '&nbsp;&nbsp;<input type="button" style="cursor:pointer;" id="removeBudgetRequestAttachment' + i + '" value="Remove" onclick="removeAttachment(\'' + results.data[i].Display_Filename + '\', \'' + attachmentsTagId + '\', \'' + bwWorkflowAppId + '\', \'' + bwBudgetRequestId + '\');" />';
                                //}

                                html += '</div>';

                                html += '</a>';

                            }

                            if (thisFileHasAnUnknownFileExtension == true) {

                                html += '<div xcx="xcx21342346-3" class="attachmentsSectionFileLink" style="cursor:pointer;" onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + results.data[i].Display_Filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');">';
                                html += results.data[i].Display_Filename;

                                html += '<br /><span class="attachmentsSectionDescription">' + 'This file has an unknown file extension: ' + fileExtension + '. Would you like to make an attempt at determining the file extension and repairing the file name?' + '</span>';


                                // Display the file attachment description.
                                //if (description.length > 0) {
                                //    //$('#' + attachmentsSectionId).append('&nbsp;&nbsp;<span class="attachmentsSectionDescription"> - "' + description + '"</span>');

                                //    html += '<br /><span class="attachmentsSectionDescription"> - "' + description + '"</span>';
                                //    //html += '<br /><span class="attachmentsSectionSize"> - ' + size + ' mb</span>';
                                //} else {
                                //    //$('#' + attachmentsSectionId).append('&nbsp;&nbsp;<span class="attachmentsSectionDescription"> - [no description]' + description + '</span>'); // Leave the description variable here because then we will know if something unexpected happens.

                                //    html += '<br /><span class="attachmentsSectionDescription"> - [no description]' + description + '</span>';

                                //}

                                //if (size.toLowerCase() == 'na') {
                                //    html += '<br /><span class="attachmentsSectionDescription" style="">[size unavailable]</span>';
                                //} else {
                                //    html += '<br /><span class="attachmentsSectionDescription">' + size + ' MB</span>';
                                //}

                                //if (showRemoveAttachmentButton && (showRemoveAttachmentButton == 'true')) {
                                //    html += '&nbsp;&nbsp;<input type="button" style="cursor:pointer;" id="removeBudgetRequestAttachment' + i + '" value="Remove" onclick="removeAttachment(\'' + results.data[i].Display_Filename + '\', \'' + attachmentsTagId + '\', \'' + bwWorkflowAppId + '\', \'' + bwBudgetRequestId + '\');" />';
                                //}

                                html += '</div>';

                            } else {

                                if (fileExtension != 'zip') { // zip is done above.

                                    // We need an if statement here to choose between iOS and Windows.
                                    //if (Platform == 'IOS8') {
                                    //    html += '<div xcx="xcx21342346-4" class="attachmentsSectionFileLink" style="height:50px;border:1px thin red;" onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + results.data[i].Display_Filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');">';
                                    //} else {


                                    // THIS IS WHAT MAKES THE LINK WORK 5-30-2024: [encodeURI(results.data[i].Display_Filename).replace(/'/g, "%27")]
                                    //html += '<div xcx="xcx21342346-5-2-1" class="attachmentsSectionFileLink" style="cursor:pointer;" onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + encodeURI(results.data[i].Display_Filename).replace(/'/g, "%27") + '\', \'' + encodeURI(description) + '\', \'' + bwBudgetRequestId + '\');">'; // encodeURI(JSON.stringify(products)).replace(/'/g, "%27")
                                    html += '<div xcx="xcx21342346-5-2-1" class="attachmentsSectionFileLink" style="cursor:pointer;vertical-align:top;" >'; // encodeURI(JSON.stringify(products)).replace(/'/g, "%27")





                                    //}

                                    //html += results.data[i].Display_Filename;
                                    // encodeURI(results.data[i].Display_Filename).replace(/'/g, '&#39;')

                                    //html += encodeURI(results.data[i].Display_Filename).replace(/'/g, "%27");
                                    html += '<span style="font-size:25pt;color:black;font-weight:bold;" >' + results.data[i].Display_Filename.substring(0, 70) + '...</span>';

                                    // 12-27-2024.

                                    if (fileExtension == 'mp3') {

                                        var activeStateIdentifier = JSON.parse($('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier'));

                                        var preventCachingGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                                            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                                            return v.toString(16);
                                        });

                                        var audioElementId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                                            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                                            return v.toString(16);
                                        });

                                        html += `<audio id="` + audioElementId + `" xcx="xcx436677" src="` + thiz.options.operationUriPrefix + fileUrl + `?v=` + preventCachingGuid + `&amp;ActiveStateIdentifier=` + activeStateIdentifier.ActiveStateIdentifier + `" 
                                                                controls="controls" style="zoom:1.75">Click here to listen</audio>`;

                                        html += `<table>
                                                <tr>
                                                    <td>
                                                        <img src="/images/audio-stop-button.png" style="width:140px;height:140px;cursor:pointer;" onclick="$('.bwAttachments_MusicPlaylist').bwAttachments_MusicPlaylist('stopAudio', '` + audioElementId + `');" />
                                                        <img src="/images/audio-play-button.png" style="width:140px;height:140px;" onclick="$('.bwAttachments_MusicPlaylist').bwAttachments_MusicPlaylist('playAudio', '` + audioElementId + `');" />
                                                    </td>
                                                    <td>`;
                                        // Display the file attachment description
                                        if (description && description.length && (description.length > 0)) {
                                            //$('#' + attachmentsSectionId).append('&nbsp;&nbsp;<span class="attachmentsSectionDescription"> - "' + description + '"</span>');

                                            html += '<br /><span class="attachmentsSectionDescription" style="font-size:15pt;"> - "' + description + '"</span>';
                                            //html += '<br /><span class="attachmentsSectionSize"> - ' + size + ' mb</span>';
                                        } else {
                                            //$('#' + attachmentsSectionId).append('&nbsp;&nbsp;<span class="attachmentsSectionDescription"> - [no description]' + description + '</span>'); // Leave the description variable here because then we will know if something unexpected happens.

                                            html += '<br /><span class="attachmentsSectionDescription" style="font-size:15pt;"> - [no description]' + description + '</span>';

                                        }

                                        if (size.toLowerCase() == 'na') {
                                            html += '<br /><span xcx="xcx1123-1" class="attachmentsSectionDescription" style="font-size:15pt;">[size unavailable]</span>';
                                        } else {
                                            html += '<br /><span xcx="xcx1123-2" class="attachmentsSectionDescription" style="font-size:15pt;">' + size + ' MB</span>';
                                        }

                                        // birthtime
                                        if (!birthtime) {
                                            html += '<br /><span class="attachmentsSectionDescription" style="">[birthtime unavailable]</span>';
                                        } else {
                                            html += '<br /><span class="attachmentsSectionDescription" style="">' + birthtime + '</span>';
                                        }

                                        if (!results.data[i].bwParticipantFriendlyName) {
                                            html += '<br /><span class="attachmentsSectionDescription" style="">[participantFriendlyName unavailable]</span>';
                                        } else {

                                            html += '<br /><span class="attachmentsSectionDescription" style="">Uploaded/modified by: <span xcx="xcx123884-2" style="color:purple;cursor:pointer;" ';
                                            html += ' onclick="$(\'.bwCircleDialog2\').bwCircleDialog2(\'displayParticipantRoleMultiPickerInACircle\', true, \'\', \'' + results.data[i].bwParticipantId + '\', \'' + results.data[i].bwParticipantFriendlyName + '\', \'' + results.data[i].bwParticipantEmail + '\', \'custom\');" >';
                                            html += results.data[i].bwParticipantFriendlyName + '</span></span>';

                                        }


                                        if (results.data[i].FileConversionStatus) {

                                            if (results.data[i].FileConversionStatus.length > 0) {

                                                var latestMessageIndex = results.data[i].FileConversionStatus.length - 1;

                                                html += '<br /><span onclick="$(\'.bwAttachments\').bwAttachments(\'GetStatusUpdateForMediaFileConversion\', \'' + encodeURI(JSON.stringify(results.data[i])) + '\', \'' + bwWorkflowAppId + '\', \'' + bwBudgetRequestId + '\');event.stopPropagation();" title="Click here to get a status update...">♻<span class="attachmentsSectionDescription">Status: </span></span><span xcx="xcx123884-44" class="attachmentsSectionDescription" style="color:tomato;font-weight:bold;cursor:pointer;" >';
                                                html += results.data[i].FileConversionStatus[latestMessageIndex].message + '</span>';

                                            } else {

                                                html += '<br /><span onclick="$(\'.bwAttachments\').bwAttachments(\'GetStatusUpdateForMediaFileConversion\', \'' + encodeURI(JSON.stringify(results.data[i])) + '\', \'' + bwWorkflowAppId + '\', \'' + bwBudgetRequestId + '\');event.stopPropagation();" title="Click here to get a status update...">♻<span class="attachmentsSectionDescription">Status: </span></span><span xcx="xcx123884-44" class="attachmentsSectionDescription" style="color:tomato;font-weight:bold;cursor:pointer;" >';
                                                html += '[empty FileConversionStatus]' + '</span>';

                                            }

                                        }
                                        html += `       </td>
                                                </tr>
                                            </table>`;


                                    }


                                    


                                    


                                    //if (showRemoveAttachmentButton && (showRemoveAttachmentButton == 'true')) {
                                    //    html += '&nbsp;&nbsp;<input type="button" style="cursor:pointer;" id="removeBudgetRequestAttachment' + i + '" value="Remove" onclick="removeAttachment(\'' + results.data[i].Display_Filename + '\', \'' + attachmentsTagId + '\', \'' + bwWorkflowAppId + '\', \'' + bwBudgetRequestId + '\');" />';
                                    //}

                                    html += '</div>';



                                  









                                }
                            }

                            html += '</br>';


                            //$(attachmentWidget).find('#newrequestattachments').append(html);



                            function handleDragStart(e) {
                                try {
                                    console.log('In handleDragStart().');
                                    //this.style.opacity = '0.4';  // this / e.target is the source node.

                                    thiz.options.dragSourceAttachmentElement = this;

                                    e.dataTransfer.effectAllowed = 'copy';
                                    e.dataTransfer.dropEffect = 'copy';
                                    e.dataTransfer.setData('text/html', this.src); //.innerHTML);
                                } catch (e) {
                                    console.log('Exception in handleDragStart(): ' + e.message + ', ' + e.stack);
                                }
                            }
                            //function handleDragOver(e) {
                            //    console.log('In handleDragOver().');
                            //    if (e.preventDefault) {
                            //        e.preventDefault(); // Necessary. Allows us to drop.
                            //    }
                            //    e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
                            //    return false;
                            //}
                            //function handleDragEnter(e) {
                            //    console.log('In handleDragEnter().');
                            //    // this / e.target is the current hover target.
                            //    this.classList.add('over');
                            //}
                            //function handleDragLeave(e) {
                            //    console.log('In handleDragLeave().');
                            //    this.classList.remove('over');  // this / e.target is previous target element.
                            //}
                            // dragstart="$(\'.bwRequest\').bwRequest(\'dragstart\');"
                            //document.getElementById('attachmentstest1').addEventListener('dragstart', $('.bwRequest').bwRequest('dragstart'), false);
                            //var element1 = document.getElementById('attachmentstest1'); // $('#' + requestDialogId).find('#budgetrequestform')[0].getAttribute('bwbudgetrequestid');
                            try {
                                //var element1 = $(thiz.element).find('#attachmentstest1'); // document.getElementById('attachmentstest1'); // 
                                var element1 = $(attachmentWidget).find('#attachmentstest1');
                                element1.addEventListener('dragstart', handleDragStart, false);
                            } catch (e) { }

                            //element1.addEventListener('dragenter', handleDragEnter, false);
                            //element1.addEventListener('dragover', handleDragOver, false);
                            //element1.addEventListener('dragleave', handleDragLeave, false);

                            //var element2 = document.getElementById('dropzone1');
                            //element2.addEventListener('dragstart', handleDragStart, false);
                            //}
                            html += '    </td>';
                            html += '  </tr>';
                            html += '</table>';
                        }

                    }






                    //} else if (data) {

                    //    //$(thiz.element).find('#newrequestattachments')[0].innerHTML = '<span style="color:tomato;">No attachments found: ' + JSON.stringify(data) + '</span>';
                    //    $(attachmentWidget).find('#newrequestattachments')[0].innerHTML = '<span style="color:tomato;">No attachments found: ' + JSON.stringify(data) + '</span>';

                }
            }


            //if (!results.data) {

            //    html += '<span xcx="xcx2312111" style="font-style:italic;font-size:8pt;">' + results.message + '</span>';

            //} else if (results.data.code == 'ENOENT') {
            //    // No such file or directory

            //    console.log('[Server response: No such file or directory: ' + results.data.path + ']. This is probably Ok.?');

            //} else if (results.data && results.data.length > 0) {

            //    //$(thiz.element).find('#newrequestattachments')[0].innerHTML = ''; // It worked, and here were attachments, so get rid of the message.
            //    //$(attachmentWidget).find('#newrequestattachments')[0].innerHTML = ''; // It worked, and here were attachments, so get rid of the message.

            //    // There are attachments, so display the button.

            //} else {
            //    //$(thiz.element).find('#newrequestattachments')[0].innerHTML = '<span style="color:tomato;">ERROR: Unexpected response: ' + JSON.stringify(data) + '</span>';
            //    //$(attachmentWidget).find('#newrequestattachments')[0].innerHTML = '<span xcx="xcx22945-2" style="color:tomato;">ERROR: Unexpected response: ' + JSON.stringify(results) + '</span>';
            //    html += '<span xcx="xcx22945-2" style="color:tomato;">ERROR: Unexpected response: ' + JSON.stringify(results) + '</span>';
            //}

            return html;

        } catch (e) {
            console.log('Exception in bwCoreComponent.js.createHtmlToDisplayTheListOfAttachments_ForBwAttachments_MusicPlaylistWidget(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwCoreComponent.js.createHtmlToDisplayTheListOfAttachments_ForBwAttachments_MusicPlaylistWidget(): ' + e.message + ', ' + e.stack);
        }
    },
    createHtmlToDisplayTheListOfAttachments_ForbwAttachments_ForEmailWidget: function (attachmentOrInline, bwWorkflowAppId, bwDraftEmailId, results) {
        try {
            console.log('In bwCoreComponent.js.createHtmlToDisplayTheListOfAttachments_ForbwAttachments_ForEmailWidget().');
            //displayAlertDialog('In bwCoreComponent.js.createHtmlToDisplayTheListOfAttachments_ForbwAttachments_ForEmailWidget(). results: ' + JSON.stringify(results));
            var thiz = this;

            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            var html = '';

            if (results.status != 'SUCCESS') {

                html += '<span xcx="xcx22945-1" style="color:tomato;">' + results.message + '</span>';

            } else {

                if (results.data.length <= 0) {

                    html += '<span xcx="xcx22945-2" style="color:tomato;">' + results.message + '</span>';

                } else {

                    var requestDialogId = 'divRequestFormDialog_' + bwDraftEmailId;
                    var buttonId = requestDialogId + '_buttonEmailAttachmentsExternally'; // eg: divRequestFormDialog_c8704c8c-8128-4600-a4fd-1ff30220e2ed_buttonEmailAttachmentsExternally
                    if (document.getElementById(buttonId) && document.getElementById(buttonId).style && document.getElementById(buttonId).style.display) {
                        document.getElementById(buttonId).style.display = 'inline';
                    }

                    buttonId = requestDialogId + '_buttonOCRAttachments'; // eg: divRequestFormDialog_c8704c8c-8128-4600-a4fd-1ff30220e2ed_buttonEmailAttachmentsExternally
                    if (document.getElementById(buttonId) && document.getElementById(buttonId).style && document.getElementById(buttonId).style.display) {
                        document.getElementById(buttonId).style.display = 'inline';
                    }

                    ////
                    //// Display the image thumbnail.
                    ////
                    //var displayImageThumbnail = function (imgId, thumbnailUrl) {
                    //    $.get(thumbnailUrl).done(function () {
                    //        var img = new Image();
                    //        img.src = thumbnailUrl;
                    //        img.onload = function (e) {
                    //            try {
                    //                //alert('Displaying thumbnail 2: ' + thumbnailUrl);
                    //                document.getElementById(imgId).src = thumbnailUrl; // There is a thumbnail, so display it.
                    //            } catch (e) {
                    //                alert('xcx2312 exception 2: ' + e.message + ', ' + e.stack);
                    //                document.getElementById(imgId).src = globalUrlPrefix + globalUrl + '/images/mp4.jfif'; // There is no thumbnail, so display the icon.
                    //            }
                    //        }
                    //    }).fail(function () {

                    //        //alert('fail in Displaying thumbnail 2: ' + thumbnailUrl);

                    //        document.getElementById(imgId).src = globalUrlPrefix + globalUrl + '/images/mp4.jfif'; // There is no thumbnail, so display the icon.
                    //    });
                    //}

                    var activeStateIdentifier = JSON.parse($('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier'));

                    var preventCachingGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                    });

                    for (var i = 0; i < results.data.length; i++) {

                        //Filename: filename,
                        //Description: description

                        //var filename = data[i].Filename;
                        //if (filename && filename.indexOf('_thumbnail_') > -1) {
                        //    //
                        //    // This is a thumbnail. Do not display as an attachment.
                        //    //
                        //} else {
                        // This is an actual attachment. Display it!

                        var description = results.data[i].Description;

                        var size = results.data[i].Size;
                        try {
                            size = (Number(size) / 1000000).toFixed(2);
                        } catch (e) { }

                        var timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(results.data[i].Birthtime);
                        var birthtime = timestamp4.toString();

                        var fileUrl;
                        var fileUrl_Thumbnail;
                        debugger;
                        if (activeStateIdentifier.status != 'SUCCESS') {
                            alert('xcx21321534 [No image. Unauthorized. xcx213124-3-2]');
                            html += '[No image. Unauthorized. xcx213124-3]';

                        } else {

                            //fileUrl = "_files/" + bwWorkflowAppId + "/" + bwBudgetRequestId + "/" + encodeURI(results.data[i].Display_Filename) + '?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier;
                            //fileUrl_Thumbnail = "_files/" + bwWorkflowAppId + "/" + bwBudgetRequestId + "/" + encodeURI(results.data[i].Display_Filename) + '?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier;

                            //fileUrl = "_files/_draftEmailAttachments/" + participantId + "/" + bwDraftEmailId + "/" + attachmentOrInline + "/" + encodeURI(results.data[i].Display_Filename) + '?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier;
                            //fileUrl_Thumbnail = "_files/_draftEmailAttachments/" + participantId + "/" + bwDraftEmailId + "/" + attachmentOrInline + "/" + encodeURI(results.data[i].Display_Filename) + '?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier;
                            // 7-15-2024.
                            fileUrl = "_files/_emailAttachments/" + participantId + "/" + bwDraftEmailId + "/" + attachmentOrInline + "/" + encodeURI(results.data[i].Display_Filename) + '?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier;
                            fileUrl_Thumbnail = "_files/_emailAttachments/" + participantId + "/" + bwDraftEmailId + "/" + attachmentOrInline + "/" + encodeURI(results.data[i].Display_Filename) + '?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier;

                        }

                        // Centered on the screen.
                        var width = 800;
                        var height = 600;
                        //var left = (screen.width - width) / 2;
                        //var top = (screen.height - height) / 2;

                        html += '<table style="width:100%;">';
                        html += '  <tr>';
                        html += '    <td style="width:10%;">';

                        var extensionIndex = results.data[i].Display_Filename.split('.').length - 1;
                        var fileExtension = results.data[i].Display_Filename.toLowerCase().split('.')[extensionIndex];

                        var thisFileHasAnUnknownFileExtension = false; // Using this to display out message about repairing the file.

                        if (['png', 'jpg', 'jpeg', 'jfif', 'webp', 'gif'].indexOf(fileExtension) > -1) {

                            if (results.data[i].Thumbnail != true) { // Display thumbnails with a rounded corner.

                                // This displays the file. WE DO NOT WANT TO DO THAT because they are so large. Display /images/nothumbnailavailable.png instead. 9-23-2023.
                                //html += '<img id="attachmentstest1" xcx="xcx2312-2-1" src="' + thiz.options.operationUriPrefix + fileUrl_Thumbnail + '?v=' + preventCachingGuid + '" style="height:120px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;max-width:250px;" alt="" ';
                                html += '<img id="attachmentstest1" xcx="xcx2312-2-1" src="' + thiz.options.operationUriPrefix + '/images/nothumbnailavailable.png' + '?v=' + preventCachingGuid + '" style="height:120px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;max-width:250px;" alt="" ';
                                console.log('This displays the file. WE DO NOT WANT TO DO THAT because they are so large. Display /images/nothumbnailavailable.png instead. 9-23-2023.');

                            } else {

                                html += '<img id="attachmentstest1" xcx="xcx2312-2-2-2-2" src="' + thiz.options.operationUriPrefix + fileUrl_Thumbnail + '" style="height:120px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;max-width:250px;border:1px solid gray;border-radius:0 30px 0 0;" alt="" ';

                            }

                            var developerModeEnabled = $('.bwAuthentication').bwAuthentication('option', 'developerModeEnabled');

                            if (developerModeEnabled == true) {
                                html += '   onmouseenter="$(\'.bwCoreComponent:first\').bwCoreComponent(\'showThumbnailHoverDetails\', \'' + bwEncodeURIComponent(JSON.stringify(results.data[i])) + '\', \'' + bwDraftEmailId + '\', this);this.style.backgroundColor=\'lightgoldenrodyellow\';" ';
                                html += '   onmouseleave="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'hideRowHoverDetails\');"'; //this.style.backgroundColor=\'white\';"';
                            }


                            // 2-16-2024 Implementing new bwAttachmentDialog.js widget.
                            //html += 'onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + results.data[i].Display_Filename + '\', \'' + bwEncodeURIComponent(description) + '\', \'' + bwBudgetRequestId + '\');" ';
                            html += 'onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + results.data[i].Display_Filename + '\', \'' + bwEncodeURIComponent(description) + '\', \'' + bwDraftEmailId + '\');" ';




                            html += ' />';

                        } else if (['xlsx', 'xls'].indexOf(fileExtension) > -1) {

                            //html += '<img src="images/excelicon.png" style="width:100px;height:46px;" />';
                            // We need an if statement here to choose between iOS and Windows.
                            if (Platform == 'IOS8') {
                                html += '<img src="images/excelicon.png" style="width:100px;cursor:pointer;" onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + results.data[i].Display_Filename + '\', \'' + bwEncodeURIComponent(description) + '\', \'' + bwDraftEmailId + '\');" />';
                                //html += '<div class="attachmentsSectionFileLink" style="height:50px;border:1px thin red;" onclick="displayAttachmentInDialog(\'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');">';
                            } else {
                                html += '<img src="images/excelicon.png" style="width:100px;cursor:pointer;" onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + results.data[i].Display_Filename + '\', \'' + bwEncodeURIComponent(description) + '\', \'' + bwDraftEmailId + '\');" />';
                                //html += '<div style="cursor:pointer;" class="attachmentsSectionFileLink" onclick="displayAttachmentInDialog(\'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + bwBudgetRequestId + '\');">';
                            }

                        } else if (['ods'].indexOf(fileExtension) > -1) {

                            html += '<img src="images/ods.png" style="width:100px;cursor:pointer;" onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + results.data[i].Display_Filename + '\', \'' + bwEncodeURIComponent(description) + '\', \'' + bwDraftEmailId + '\');" />';

                        } else if (['doc', 'docx', 'pdf'].indexOf(fileExtension) > -1) {

                            var thumbnailUrl = "_files/" + bwWorkflowAppId + "/" + bwDraftEmailId + "/ATTACHMENTS/" + results.data[i].Actual_Filename + '?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier;

                            var imgId = 'img_bwAttachments_' + thiz.options.elementIdSuffix + '_' + bwDraftEmailId + '_' + i;
                            html += '<img xcx="xcx55999923" id="' + imgId + '" style="height:120px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;border:1px solid gray;border-radius:0px 30px 0px 0px;" alt="" ';
                            html += ' src="' + thumbnailUrl + '" ';
                            html += '   onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + results.data[i].Display_Filename + '\', \'' + bwEncodeURIComponent(description) + '\', \'' + bwDraftEmailId + '\');" ';
                            html += ' />';

                            this.displayImageThumbnail(imgId, thumbnailUrl);

                        } else if (fileExtension == 'mp4') {

                            var thumbnailUrl = "_files/" + bwWorkflowAppId + "/" + bwDraftEmailId + "/" + results.data[i].Actual_Filename + '?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier;
                            var imgId = 'img_bwAttachments_' + thiz.options.elementIdSuffix + '_' + bwDraftEmailId + '_' + i;
                            html += '<img id="' + imgId + '" style="height:120px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;max-width:250px;border:1px solid gray;border-radius:0 30px 0 0;" alt="" ';
                            html += ' src="' + thumbnailUrl + '" ';
                            html += '   onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + results.data[i].Display_Filename + '\', \'' + bwEncodeURIComponent(description) + '\', \'' + bwDraftEmailId + '\');" ';
                            html += ' />';

                        } else if (fileExtension == 'rtf') {

                            html += '<img src="images/rtf.png" style="width:50px;cursor:pointer;" ';
                            html += 'onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + results.data[i].Display_Filename + '\', \'' + bwEncodeURIComponent(description) + '\', \'' + bwDraftEmailId + '\');" ';
                            html += ' />';

                        } else if (fileExtension == 'vob') {

                            html += '<img src="images/vob.png" style="width:50px;cursor:pointer;" ';
                            html += 'onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + results.data[i].Display_Filename + '\', \'' + bwEncodeURIComponent(description) + '\', \'' + bwDraftEmailId + '\');" ';
                            html += ' />';

                        } else if (fileExtension == 'xcf') {

                            html += '<img src="images/xcf.png" style="height:120px;cursor:pointer;" ';
                            html += 'onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + results.data[i].Display_Filename + '\', \'' + bwEncodeURIComponent(description) + '\', \'' + bwDraftEmailId + '\');" ';
                            html += ' />';


                        } else if (fileExtension == 'mov') {

                            html += '<img src="images/mov.png" style="width:50px;cursor:pointer;" ';
                            html += 'onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + results.data[i].Display_Filename + '\', \'' + bwEncodeURIComponent(description) + '\', \'' + bwDraftEmailId + '\');" ';
                            html += ' />';

                        } else if (fileExtension == 'mp3') {

                            html += '<img src="images/mp3.png" style="width:50px;cursor:pointer;" ';
                            html += 'onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + results.data[i].Display_Filename + '\', \'' + bwEncodeURIComponent(description) + '\', \'' + bwDraftEmailId + '\');" ';
                            html += ' />';

                        } else if (fileExtension == 'm4a') {

                            html += '<img src="images/m4a.png" style="width:50px;cursor:pointer;" ';
                            html += 'onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + results.data[i].Display_Filename + '\', \'' + bwEncodeURIComponent(description) + '\', \'' + bwDraftEmailId + '\');" ';
                            html += ' />';

                        } else if (fileExtension == 'zip') {

                            // Tried using a direct download link, but we need to show the dialog so there is a way to delete the file if they want to.
                            //html += '<a href="' + thiz.options.operationUriPrefix + fileUrl + '" download style="cursor:pointer;">';
                            html += '   <img src="images/zip.png" style="width:50px;cursor:pointer;" ';
                            html += '   onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + results.data[i].Display_Filename + '\', \'' + bwEncodeURIComponent(description) + '\', \'' + bwDraftEmailId + '\');" ';
                            html += '   />';
                            //html += '</a>';

                        } else {

                            if (!fileExtension) {

                                alert('xcx21312-2 This file has no file extension: ' + fileExtension + '. Would you like to make an attempt at determining the file extension and repairing the file name?');

                            } else {

                                thisFileHasAnUnknownFileExtension = true;
                                //alert('xcx21312-2 This file has an unknown file extension: ' + fileExtension + '. Would you like to make an attempt at determining the file extension and repairing the file name?');

                                if (results.data[i].Thumbnail != true) { // Display thumbnails with a rounded corner.
                                    html += '<img xcx="xcx44923-1-2" src="' + thiz.options.operationUriPrefix + fileUrl_Thumbnail + '?v=' + preventCachingGuid + '" style="height:120px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;" '; ///>';
                                } else {
                                    //html += '<img xcx="xcx443321-8" src="' + fileUrl_Thumbnail + '?v=' + preventCachingGuid + '" style="height:150px;border-radius:0 30px 0 0;" />';
                                    html += '<img xcx="xcx44923-1-2" src="' + thiz.options.operationUriPrefix + fileUrl_Thumbnail + '?v=' + preventCachingGuid + '" style="height:120px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;border:1px solid gray;border-radius:0 30px 0 0;" '; ///>';
                                }

                                //var imageUrl = globalUrlPrefix + globalUrl + '/_files/' + bwWorkflowAppId + '/' + bwBudgetRequestId + '/' + filename;
                                //html += '<img xcx="xcx44923-1-2" src="' + thiz.options.operationUriPrefix + fileUrl_Thumbnail + '?v=' + preventCachingGuid + '" style="height:120px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;" '; ///>';
                                html += 'onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + results.data[i].Display_Filename + '\', \'' + bwEncodeURIComponent(description) + '\', \'' + bwDraftEmailId + '\');" ';
                                html += ' />';
                                html += '<br />';
                            }

                        }

                        html += '    </td>';
                        html += '    <td style="width:90%;white-space:normal;">';

                        if (fileExtension == 'zip') {

                            html += '<a href="' + thiz.options.operationUriPrefix + fileUrl + '" download style="text-decoration:none;cursor:pointer;">';
                            // We need an if statement here to choose between iOS and Windows.
                            if (Platform == 'IOS8') {
                                html += '<div xcx="xcx21342346-4" class="attachmentsSectionFileLink" style="height:50px;border:1px thin red;" >';
                            } else {
                                html += '<div xcx="xcx21342346-5-1" class="attachmentsSectionFileLink" style="cursor:pointer;" >';
                            }

                            html += results.data[i].Display_Filename;

                            // Display the file attachment description.
                            if (description.length > 0) {
                                //$('#' + attachmentsSectionId).append('&nbsp;&nbsp;<span class="attachmentsSectionDescription"> - "' + description + '"</span>');

                                html += '<br /><span class="attachmentsSectionDescription"> - "' + description + '"</span>';
                                //html += '<br /><span class="attachmentsSectionSize"> - ' + size + ' mb</span>';
                            } else {
                                //$('#' + attachmentsSectionId).append('&nbsp;&nbsp;<span class="attachmentsSectionDescription"> - [no description]' + description + '</span>'); // Leave the description variable here because then we will know if something unexpected happens.

                                html += '<br /><span class="attachmentsSectionDescription"> - [no description]' + description + '</span>';

                            }

                            if (size.toLowerCase() == 'na') {
                                html += '<br /><span xcx="xcx1123-1" class="attachmentsSectionDescription" style="">[size unavailable]</span>';
                            } else {
                                html += '<br /><span xcx="xcx1123-2" class="attachmentsSectionDescription">' + size + ' MB</span>';
                            }

                            // birthtime
                            if (!birthtime) {
                                html += '<br /><span class="attachmentsSectionDescription" style="">[birthtime unavailable]</span>';
                            } else {
                                html += '<br /><span class="attachmentsSectionDescription">' + birthtime + '</span>';
                            }

                            if (!results.data[i].bwParticipantFriendlyName) {
                                html += '<br /><span class="attachmentsSectionDescription" style="">[participantFriendlyName unavailable]</span>';
                            } else {

                                html += '<br /><span class="attachmentsSectionDescription">Uploaded/modified by: <span xcx="xcx123884-3" style="color:purple;cursor:pointer;" ';
                                html += ' onclick="$(\'.bwCircleDialog2\').bwCircleDialog2(\'displayParticipantRoleMultiPickerInACircle\', true, \'\', \'' + results.data[i].bwParticipantId + '\', \'' + results.data[i].bwParticipantFriendlyName + '\', \'' + results.data[i].bwParticipantEmail + '\', \'custom\');" >';
                                html += results.data[i].bwParticipantFriendlyName + '</span></span>';

                            }

                            //if (showRemoveAttachmentButton && (showRemoveAttachmentButton == 'true')) {
                            //    html += '&nbsp;&nbsp;<input type="button" style="cursor:pointer;" id="removeBudgetRequestAttachment' + i + '" value="Remove" onclick="removeAttachment(\'' + results.data[i].Display_Filename + '\', \'' + attachmentsTagId + '\', \'' + bwWorkflowAppId + '\', \'' + bwBudgetRequestId + '\');" />';
                            //}

                            html += '</div>';

                            html += '</a>';

                        }

                        if (thisFileHasAnUnknownFileExtension == true) {

                            html += '<div xcx="xcx21342346-3" class="attachmentsSectionFileLink" style="cursor:pointer;" onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + results.data[i].Display_Filename + '\', \'' + description + '\', \'' + bwDraftEmailId + '\');">';
                            html += results.data[i].Display_Filename;

                            html += '<br /><span class="attachmentsSectionDescription">' + 'This file has an unknown file extension: ' + fileExtension + '. Would you like to make an attempt at determining the file extension and repairing the file name?' + '</span>';


                            // Display the file attachment description.
                            //if (description.length > 0) {
                            //    //$('#' + attachmentsSectionId).append('&nbsp;&nbsp;<span class="attachmentsSectionDescription"> - "' + description + '"</span>');

                            //    html += '<br /><span class="attachmentsSectionDescription"> - "' + description + '"</span>';
                            //    //html += '<br /><span class="attachmentsSectionSize"> - ' + size + ' mb</span>';
                            //} else {
                            //    //$('#' + attachmentsSectionId).append('&nbsp;&nbsp;<span class="attachmentsSectionDescription"> - [no description]' + description + '</span>'); // Leave the description variable here because then we will know if something unexpected happens.

                            //    html += '<br /><span class="attachmentsSectionDescription"> - [no description]' + description + '</span>';

                            //}

                            //if (size.toLowerCase() == 'na') {
                            //    html += '<br /><span class="attachmentsSectionDescription" style="">[size unavailable]</span>';
                            //} else {
                            //    html += '<br /><span class="attachmentsSectionDescription">' + size + ' MB</span>';
                            //}

                            //if (showRemoveAttachmentButton && (showRemoveAttachmentButton == 'true')) {
                            //    html += '&nbsp;&nbsp;<input type="button" style="cursor:pointer;" id="removeBudgetRequestAttachment' + i + '" value="Remove" onclick="removeAttachment(\'' + results.data[i].Display_Filename + '\', \'' + attachmentsTagId + '\', \'' + bwWorkflowAppId + '\', \'' + bwBudgetRequestId + '\');" />';
                            //}

                            html += '</div>';

                        } else {

                            if (fileExtension != 'zip') { // zip is done above.

                                // We need an if statement here to choose between iOS and Windows.
                                if (Platform == 'IOS8') {
                                    html += '<div xcx="xcx21342346-4" class="attachmentsSectionFileLink" style="height:50px;border:1px thin red;" onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + results.data[i].Display_Filename + '\', \'' + description + '\', \'' + bwDraftEmailId + '\');">';
                                } else {
                                    html += '<div xcx="xcx21342346-5-2-2" class="attachmentsSectionFileLink" style="cursor:pointer;" onclick="$(\'.bwAttachmentDialog\').bwAttachmentDialog(\'displayAttachmentInDialog\', \'' + thiz.options.operationUriPrefix + fileUrl + '\', \'' + results.data[i].Display_Filename + '\', \'' + description + '\', \'' + bwDraftEmailId + '\');">';
                                }

                                html += results.data[i].Display_Filename;

                                // Display the file attachment description.
                                if (description.length > 0) {
                                    //$('#' + attachmentsSectionId).append('&nbsp;&nbsp;<span class="attachmentsSectionDescription"> - "' + description + '"</span>');

                                    html += '<br /><span class="attachmentsSectionDescription"> - "' + description + '"</span>';
                                    //html += '<br /><span class="attachmentsSectionSize"> - ' + size + ' mb</span>';
                                } else {
                                    //$('#' + attachmentsSectionId).append('&nbsp;&nbsp;<span class="attachmentsSectionDescription"> - [no description]' + description + '</span>'); // Leave the description variable here because then we will know if something unexpected happens.

                                    html += '<br /><span class="attachmentsSectionDescription"> - [no description]' + description + '</span>';

                                }

                                if (size.toLowerCase() == 'na') {
                                    html += '<br /><span xcx="xcx1123-1" class="attachmentsSectionDescription" style="">[size unavailable]</span>';
                                } else {
                                    html += '<br /><span xcx="xcx1123-2" class="attachmentsSectionDescription">' + size + ' MB</span>';
                                }

                                // birthtime
                                if (!birthtime) {
                                    html += '<br /><span class="attachmentsSectionDescription" style="">[birthtime unavailable]</span>';
                                } else {
                                    html += '<br /><span class="attachmentsSectionDescription">' + birthtime + '</span>';
                                }

                                if (!results.data[i].bwParticipantFriendlyName) {
                                    html += '<br /><span class="attachmentsSectionDescription" style="">[participantFriendlyName unavailable]</span>';
                                } else {

                                    html += '<br /><span class="attachmentsSectionDescription">Uploaded/modified by: <span xcx="xcx123884-4" style="color:purple;cursor:pointer;" ';
                                    html += ' onclick="$(\'.bwCircleDialog2\').bwCircleDialog2(\'displayParticipantRoleMultiPickerInACircle\', true, \'\', \'' + results.data[i].bwParticipantId + '\', \'' + results.data[i].bwParticipantFriendlyName + '\', \'' + results.data[i].bwParticipantEmail + '\', \'custom\');" >';
                                    html += results.data[i].bwParticipantFriendlyName + '</span></span>';

                                }


                                if (results.data[i].FileConversionStatus) {

                                    if (results.data[i].FileConversionStatus.length > 0) {

                                        var latestMessageIndex = results.data[i].FileConversionStatus.length - 1;

                                        html += '<br /><span onclick="$(\'.bwAttachments\').bwAttachments(\'GetStatusUpdateForMediaFileConversion\', \'' + encodeURI(JSON.stringify(results.data[i])) + '\', \'' + bwWorkflowAppId + '\', \'' + bwDraftEmailId + '\');event.stopPropagation();" title="Click here to get a status update...">♻<span class="attachmentsSectionDescription">Status: </span></span><span xcx="xcx123884-44" class="attachmentsSectionDescription" style="color:tomato;font-weight:bold;cursor:pointer;" >';
                                        html += results.data[i].FileConversionStatus[latestMessageIndex].message + '</span>';

                                    } else {

                                        html += '<br /><span onclick="$(\'.bwAttachments\').bwAttachments(\'GetStatusUpdateForMediaFileConversion\', \'' + encodeURI(JSON.stringify(results.data[i])) + '\', \'' + bwWorkflowAppId + '\', \'' + bwDraftEmailId + '\');event.stopPropagation();" title="Click here to get a status update...">♻<span class="attachmentsSectionDescription">Status: </span></span><span xcx="xcx123884-44" class="attachmentsSectionDescription" style="color:tomato;font-weight:bold;cursor:pointer;" >';
                                        html += '[empty FileConversionStatus]' + '</span>';

                                    }

                                }


                                //if (showRemoveAttachmentButton && (showRemoveAttachmentButton == 'true')) {
                                //    html += '&nbsp;&nbsp;<input type="button" style="cursor:pointer;" id="removeBudgetRequestAttachment' + i + '" value="Remove" onclick="removeAttachment(\'' + results.data[i].Display_Filename + '\', \'' + attachmentsTagId + '\', \'' + bwWorkflowAppId + '\', \'' + bwBudgetRequestId + '\');" />';
                                //}

                                html += '</div>';

                            }
                        }

                        html += '</br>';


                        //$(attachmentWidget).find('#newrequestattachments').append(html);



                        function handleDragStart(e) {
                            try {
                                console.log('In handleDragStart().');
                                //this.style.opacity = '0.4';  // this / e.target is the source node.

                                thiz.options.dragSourceAttachmentElement = this;

                                e.dataTransfer.effectAllowed = 'copy';
                                e.dataTransfer.dropEffect = 'copy';
                                e.dataTransfer.setData('text/html', this.src); //.innerHTML);
                            } catch (e) {
                                console.log('Exception in handleDragStart(): ' + e.message + ', ' + e.stack);
                            }
                        }
                        //function handleDragOver(e) {
                        //    console.log('In handleDragOver().');
                        //    if (e.preventDefault) {
                        //        e.preventDefault(); // Necessary. Allows us to drop.
                        //    }
                        //    e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
                        //    return false;
                        //}
                        //function handleDragEnter(e) {
                        //    console.log('In handleDragEnter().');
                        //    // this / e.target is the current hover target.
                        //    this.classList.add('over');
                        //}
                        //function handleDragLeave(e) {
                        //    console.log('In handleDragLeave().');
                        //    this.classList.remove('over');  // this / e.target is previous target element.
                        //}
                        // dragstart="$(\'.bwRequest\').bwRequest(\'dragstart\');"
                        //document.getElementById('attachmentstest1').addEventListener('dragstart', $('.bwRequest').bwRequest('dragstart'), false);
                        //var element1 = document.getElementById('attachmentstest1'); // $('#' + requestDialogId).find('#budgetrequestform')[0].getAttribute('bwbudgetrequestid');
                        try {
                            //var element1 = $(thiz.element).find('#attachmentstest1'); // document.getElementById('attachmentstest1'); // 
                            var element1 = $(attachmentWidget).find('#attachmentstest1');
                            element1.addEventListener('dragstart', handleDragStart, false);
                        } catch (e) { }

                        //element1.addEventListener('dragenter', handleDragEnter, false);
                        //element1.addEventListener('dragover', handleDragOver, false);
                        //element1.addEventListener('dragleave', handleDragLeave, false);

                        //var element2 = document.getElementById('dropzone1');
                        //element2.addEventListener('dragstart', handleDragStart, false);
                        //}
                        html += '    </td>';
                        html += '  </tr>';
                        html += '</table>';
                    }







                    //} else if (data) {

                    //    //$(thiz.element).find('#newrequestattachments')[0].innerHTML = '<span style="color:tomato;">No attachments found: ' + JSON.stringify(data) + '</span>';
                    //    $(attachmentWidget).find('#newrequestattachments')[0].innerHTML = '<span style="color:tomato;">No attachments found: ' + JSON.stringify(data) + '</span>';

                }
            }


            //if (!results.data) {

            //    html += '<span xcx="xcx2312111" style="font-style:italic;font-size:8pt;">' + results.message + '</span>';

            //} else if (results.data.code == 'ENOENT') {
            //    // No such file or directory

            //    console.log('[Server response: No such file or directory: ' + results.data.path + ']. This is probably Ok.?');

            //} else if (results.data && results.data.length > 0) {

            //    //$(thiz.element).find('#newrequestattachments')[0].innerHTML = ''; // It worked, and here were attachments, so get rid of the message.
            //    //$(attachmentWidget).find('#newrequestattachments')[0].innerHTML = ''; // It worked, and here were attachments, so get rid of the message.

            //    // There are attachments, so display the button.

            //} else {
            //    //$(thiz.element).find('#newrequestattachments')[0].innerHTML = '<span style="color:tomato;">ERROR: Unexpected response: ' + JSON.stringify(data) + '</span>';
            //    //$(attachmentWidget).find('#newrequestattachments')[0].innerHTML = '<span xcx="xcx22945-2" style="color:tomato;">ERROR: Unexpected response: ' + JSON.stringify(results) + '</span>';
            //    html += '<span xcx="xcx22945-2" style="color:tomato;">ERROR: Unexpected response: ' + JSON.stringify(results) + '</span>';
            //}

            return html;

        } catch (e) {
            console.log('Exception in bwCoreComponent.js.createHtmlToDisplayTheListOfAttachments_ForbwAttachments_ForEmailWidget(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwCoreComponent.js.createHtmlToDisplayTheListOfAttachments_ForbwAttachments_ForEmailWidget(): ' + e.message + ', ' + e.stack);
        }
    },



    renderAlerts3: function (invocationLocation) {
        //debugger;
        var thiz = this;
        // Render the pending items. Only do this if the home page is displayed!!!
        console.log('In renderAlerts3(). invocationLocation: ' + invocationLocation);

        //
        // Fifth section, "Saved on My Device" summary.
        //
        try {
            // Check if we have created the indexDB. If not, load the XSL files that we will need in case of losing the network connection.




            //var db = $('.bwCoreComponent').bwCoreComponent('getIndexDbInstance');

            //debugger; // 11-15-2020

            var deferredIndex = 1;



            if (!(this.options.db && this.options.db.objectStoreCachedRequests)) {

                var msg = 'Error. Invalid value for this.options.db: ' + this.options.db;
                //console.log(msg); 
                displayAlertDialog(msg, false);

            } else {
                var transaction = thiz.options.db.transaction('objectStoreCachedRequests', 'readonly');
                var request = transaction.objectStore('objectStoreCachedRequests').count();

                transaction.oncomplete = function (event) {
                    var numberOfRequests = event.target.result;
                };

                transaction.onerror = function (event) {
                    //debugger;
                };

                request.onsuccess = function (event) {
                    var html2 = '';
                    var rowId = 'functionalAreaRow_' + deferredIndex.toString() + '_5';
                    var imageId = 'alertSectionImage_' + deferredIndex.toString() + '_5';
                    var collapsibleRowId = 'alertSectionRow_' + deferredIndex.toString() + '_5';
                    html2 += '<tr id="' + rowId + '" class="bwFunctionalAreaRow" onclick="expandOrCollapseAlertsSection(\'' + rowId + '\', \'' + imageId + '\', \'' + collapsibleRowId + '\');" >';
                    var numberOfRequests = event.target.result;
                    if (numberOfRequests > 0) {
                        // Display the requests stored on this device.
                        console.log('If this device is in PRIVACY mode, your web browser will delete them without asking you when you close the browser.xcx2');
                        if (numberOfRequests == 1) {
                            html2 += '<td style="width:11px;vertical-align:top;"></td>';
                            html2 += '<td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2">';
                            html2 += '<img title="collapse" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="images/drawer-open.png">';
                            html2 += '<span>You have ' + numberOfRequests + ' un-submitted request saved on this device.</span>';
                        } else if (numberOfRequests > 1) {
                            html2 += '<td style="width:11px;vertical-align:top;"></td>';
                            html2 += '<td style="padding-left:11px;" class="bwHPNDrillDownLinkCell2">';
                            html2 += '<img title="collapse" id="' + imageId + '" style="cursor:pointer;width:45px;height:45px;vertical-align:middle;" src="images/drawer-open.png">';
                            html2 += '<span>You have ' + numberOfRequests + ' un-submitted requests saved on this device.</span>';
                        }
                        html2 += '    </td>';
                        html2 += '    <td></td>';
                        html2 += '  </tr>';

                        html2 += '  <tr id="' + collapsibleRowId + '" style="display:none;">';
                        html2 += '    <td colspan="4" style="padding-left:24px;">';
                        html2 += '      <table style="width:100%;">';
                        html2 += '        <tr>';
                        html2 += '          <td colspan="4">';
                        html2 += '          </td>';
                        html2 += '        </tr>';
                        var objectStore = thiz.options.db.transaction("objectStoreCachedRequests").objectStore("objectStoreCachedRequests");
                        objectStore.openCursor().onsuccess = function (event) {
                            try {
                                var cursor = event.target.result;
                                //debugger;
                                if (cursor) {
                                    var projectTitle = '';
                                    console.log('Retrieved request: ' + cursor.value.ProjectTitle.value + ': ' + cursor.value.bwBudgetRequestId);
                                    html2 += '<tr>';
                                    //html2 += '  <td colspan="2"></td>';
                                    html2 += '  <td style="width:10px;"></td>';
                                    html2 += '  <td style="width:10px;"></td>';
                                    html2 += '  <td style="width:45px;"></td>';

                                    html2 += '  <td style="background-color:white;width:25px;" ';
                                    //debugger;
                                    html2 += '      onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'' + '' + '\', \'' + cursor.value.ProjectTitle.value + '\', \'' + '' + '\', \'' + workflowAppId + '\', \'' + cursor.value.bwBudgetRequestId + '\', \'' + cursor.value.bwOrgId + '\', \'' + cursor.value.bwOrgName + '\', this);" ';
                                    html2 += '      onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');">';
                                    html2 += '    <img class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg">';
                                    html2 += '  </td>';

                                    html2 += '  <td style="padding:10px;cursor:pointer;background-color:#d8d8d8;" onclick="cmdRenderAndLoadNewRequestFormWithUnsubmittedRequest_loggedin_IndexDb(\'' + cursor.value.bwBudgetRequestId + '\');" onMouseOver="this.style.backgroundColor=\'lightgoldenrodyellow\';" onMouseOut="this.style.backgroundColor=\'#d8d8d8\';">';

                                    html2 += '    <div style="display:inline-block;" bwtrace="xcx778452">';
                                    html2 += '      &nbsp;&nbsp;' + cursor.value.ProjectTitle.value;
                                    html2 += '      &nbsp;&nbsp;<img src="images/trash-can.png" onclick="cmdDisplayDeleteUnsubmittedBudgetRequestDialog(\'' + cursor.value.bwBudgetRequestId + '\', \'' + cursor.value.ProjectTitle.value + '\');" title="Delete" style="cursor:pointer;" />';
                                    html2 += '    </div>';
                                    html2 += '  </td>';
                                    html2 += '</tr>';
                                    cursor.continue();
                                } else {
                                    console.log('In bwCoreComponent.renderAlerts3(). Done looping, so rendering. In the future cache and compare to determine if rendering is necessary.');
                                    html2 += '</table>';
                                    //debugger;
                                    // All done, close the table tags.
                                    html2 += '    </td>';
                                    html2 += '  </tr>';
                                    //$('#tblHomePageAlertSectionForWorkflow1 > tbody:last-child').append(html2);





                                    //debugger; // WHAT DOES THIS LOOK LIKE?? WHY DOESNT IT DISPLAY?
                                    $('#divHomePageAlert_NotLoggedIn').html(html2);
                                    alert('xcx2131234 populating [divPageContent1].');
                                    $('#divPageContent1').html(html2);

                                }
                            } catch (e) {
                                console.log('bwCoreComponent. xxyyyfgError XCX2: ' + e.message + ', ' + e.stack);
                            }
                        };

                    }
                };

                request.onerror = function (evt) {
                    console.error('In bwCoreComponent.renderAlerts3(). add error', this.error);
                    displayAlertDialog('In bwCoreComponent.renderAlerts3(). add error', this.error);
                };
            }

        } catch (e) {
            console.log('Exception in bwCoreComponent.renderAlerts3():1334: ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwCoreComponent.renderAlerts3():1334: ' + e.message + ', ' + e.stack, false);
        }
    },



    getobjectStoreCachedRequests: function () {
        try {
            console.log('In bwCoreComponent.getobjectStoreCachedRequests().');
            return this.options.objectStoreCachedRequests;
        } catch (e) {
            console.log('Exception in bwCoreComponent.getobjectStoreCachedRequests(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwCoreComponent.getobjectStoreCachedRequests(): ' + e.message + ', ' + e.stack);
        }
    },
    takeScreenshot: function () {
        try {
            console.log('In bwCoreComponent.js.takeScreenshot().');
            var thiz = this;

            $('#divReportAnErrorOrMakeASuggestion').on('dialogclose', function (event) {
                html2canvas(document.body).then(function (canvas) {
                    var img = canvas.toDataURL("image/png");
                    var html = '';
                    html += '<img id="imgReportAnErrorOrMakeASuggestionDialogImage1" src="' + img + '" style="width:750px;" />';
                    document.getElementById('spanReportAnErrorOrMakeASuggestionDialogContent').innerHTML = html;
                    $("#divReportAnErrorOrMakeASuggestion").dialog({
                        modal: true,
                        resizable: false,
                        closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                        width: '800',
                        dialogClass: "no-close", // No close button in the upper right corner.
                        hide: false, // This means when hiding just disappear with no effects.
                        //open: function () {
                        //    $('.ui-widget-overlay').bind('click', function () {
                        //        $("#divReportAnErrorOrMakeASuggestion").dialog('close');
                        //    });

                        //    $('#divReportAnErrorOrMakeASuggestion').off('dialogclose');
                        //},
                        open: function () {
                            try {

                                $('.ui-widget-overlay').bind('click', function () {
                                    $("#divReportAnErrorOrMakeASuggestion").dialog('close');
                                });

                                $('#divReportAnErrorOrMakeASuggestion').off('dialogclose');

                                var requestDialogId = 'divReportAnErrorOrMakeASuggestion';

                                var element2 = document.getElementById(requestDialogId).parentNode; // This is the best way to get a handle on the jquery dialog.
                                var requestDialogParentId = requestDialogId + '_Parent'; // We need to have an id value so we can refer to this. It doesn't have one unless we add it here.
                                element2.id = requestDialogParentId; // We need to have an id value so we can refer to this. It doesn't have one unless we add it here.

                                // This creates the custom header/draggable bar on the dialog!!! 4-2-2020. // ☈ ☇ https://www.toptal.com/designers/htmlarrows/symbols/thunderstorm/
                                var html = '';
                                html += '<table style="width:100%;" onclick="$(\'.bwRequest\').bwRequest(\'pinRequestDialog\');">'; // This click event is like "pin". Once the user clicks the header of the request dialog, it no longer is modal and persists on the screen until they choose to close it.
                                html += '   <tr>';
                                html += '       <td style="width:95%;">';
                                html += '           <div id="slider_' + requestDialogId + '" style="width:20%;cursor:pointer;"></div>';
                                html += '       </td>';
                                html += '       <td>';
                                html += '           <span class="dialogXButton" style="font-size:25pt;cursor:pointer;width:100%;" onclick="$(\'#' + requestDialogId.replace('_Parent', '') + '\').dialog(\'close\');">X</span>';
                                html += '       </td>';
                                html += '   </tr>';
                                html += '</table>';

                                document.getElementById(requestDialogId).parentNode.querySelector(".ui-dialog-titlebar").innerHTML = html;

                                $("#slider_" + requestDialogId).slider({
                                    min: 50,
                                    max: 200,
                                    value: 100, // It starts off full size.
                                    slide: function (event, ui) {
                                        $('.bwCoreComponent').bwCoreComponent('setZoom', ui.value, requestDialogId);
                                    }//,
                                    //change: function (event, ui) {
                                    //    thiz.setZoom(ui.value, requestDialogId);
                                    //}
                                });
                                //thiz.setZoom(100, requestDialogId);
                                $('.bwCoreComponent').bwCoreComponent('setZoom', 100, requestDialogId);

                                //var html = '';
                                //html += '   <table>';
                                //html += '       <tr>';
                                //html += '           <td>';
                                //html += '               <div id="jsGridCosts_large" style="font-size:60%;"></div>';
                                //html += '           </td>';
                                //html += '       </tr>';
                                //html += '       <tr>';
                                //html += '           <td style="text-align:right;">';
                                //html += '<br />';
                                //html += '               <span class="xdlabel" style="font-size:15pt;font-weight:bold;">Total Costs:</span>';
                                //html += '               <input id="grandTotal_large" disabled style="color:black;WIDTH: 140px;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size: 18pt;TEXT-ALIGN: right;" type="text">';
                                //html += '               &nbsp;&nbsp;';
                                //html += '               <br /><br /><br />';
                                //html += '           </td>';
                                //html += '       </tr>';
                                //html += '   </table';
                                //document.getElementById(requestDialogParentId + '_Content').innerHTML = html;


                            } catch (e) {
                                console.log('Exception in divReportAnErrorOrMakeASuggestion.dialog.open(): ' + e.message + ', ' + e.stack);
                                $('#spanBwCostsGrid_Error')[0].innerHTML = 'Exception in divReportAnErrorOrMakeASuggestion.dialog.open(): ' + e.message + ', ' + e.stack;
                            }
                        }
                    });
                    //$("#divReportAnErrorOrMakeASuggestion").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
                });
            });

            $('#divReportAnErrorOrMakeASuggestion').dialog('close');

        } catch (e) {
            console.log('Exception in takeScreenshot(): ' + e.message + ', ' + e.stack);
        }
    },
    setZoom: function (originalZoom, elementId) {
        try {
            console.log('In bwCoreComponent.js.setZoom(' + originalZoom + ', ' + elementId + ')');
            var thiz = this;
            if (originalZoom > 20) { // Don't make any smaller than this!
                var zoom = originalZoom / 100;
                elementId = elementId.replace('_Parent', '');
                elementId += '_Parent'; // This just makes sure it is here! :)
                var el = document.getElementById(elementId); //("#elementId"); //.slider("element");

                transformOrigin = [0, 0];
                //try {
                //    el = el || instance.getContainer();
                //} catch(e) { }

                var p = ["webkit", "moz", "ms", "o"],
                    s = "scale(" + zoom + ")",
                    oString = (transformOrigin[0] * 100) + "% " + (transformOrigin[1] * 100) + "%";

                for (var i = 0; i < p.length; i++) {
                    el.style[p[i] + "Transform"] = s;
                    el.style[p[i] + "TransformOrigin"] = oString;
                }

                el.style["transform"] = s;
                el.style["transformOrigin"] = oString;


                this.pinRequestDialog(); // Gets rid of the clickable greyed out background... Makes the dialog not-modal.

                //elementId.draggable("option", "containment", "window");
                //$(".selector").draggable("option", "containment", "window");

                // New attempt to use the entire browser screen/window. 4-24-2020.
                //window.addEventListener("resize", function () {
                //    try {

                //var body = document.getElementsByTagName('body')[0];
                //var clientWidth = body.scrollWidth; //offsetWidth; //getBoundingClientRect().width +; //body.clientWidth; offsetHeight
                ////var clientHeight = Math.max(body.scrollHeight, document.documentElement.clientHeight, window.innerHeight || 0); //offsetHeight; //getBoundingClientRect().height; //body.clientHeight;
                //var clientHeight = Math.max(
                //    body.scrollHeight, document.documentElement.scrollHeight,
                //    body.offsetHeight, document.documentElement.offsetHeight,
                //    body.clientHeight, document.documentElement.clientHeight
                //);

                //    } catch (e) {
                //        //alert('Exception in xxxxx: ' + e.message + ', ' + e.stack);
                //    }
                //}, false);


            }
        } catch (e) {
            console.log('Exception in bwCoreComponent.js.setZoom(): ' + e.message + ', ' + e.stack);
        }
    },
    //sendScreenshotNow: function () {
    //    // SEARCH FOR "take a screenshot with javascript" to find this functionality!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 6-30-2020 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    //    try {
    //        console.log('In sendScreenshotNow().');
    //        var thiz = this;

    //        var tenantId = $('.bwAuthentication').bwAuthentication('option', 'tenantId');
    //        var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
    //        var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
    //        var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
    //        var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

    //        var description = document.getElementById('txtReportAnErrorOrMakeASuggestionDialogDescription').value;
    //        var json = {
    //            bwTenantId: tenantId,
    //            bwWorkflowAppId: workflowAppId,
    //            Description: description,
    //            CreatedByFriendlyName: participantFriendlyName,
    //            CreatedById: participantId,
    //            CreatedByEmail: participantEmail
    //        };
    //        $.ajax({
    //            url: thiz.options.operationUriPrefix + "_bw/ReportAnErrorOrMakeASuggestion",
    //            type: "Post",
    //            timeout: thiz.options.ajaxTimeout,
    //            data: json,
    //            headers: {
    //                "Accept": "application/json; odata=verbose"
    //            }
    //        }).success(function (result) {
    //            try {
    //                if (result.message == 'SUCCESS') {
    //                    // Now we have to upload the screenshot(s).
    //                    var bwErrorOrSuggestionId = result.bwErrorOrSuggestionId;
    //                    var filenameGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    //                        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    //                        return v.toString(16);
    //                    });
    //                    var filename = filenameGuid + '.png';
    //                    var dataURL = document.getElementById('imgReportAnErrorOrMakeASuggestionDialogImage1').src; // This is a DataURL!
    //                    const arr = dataURL.split(',');
    //                    const mime = arr[0].match(/:(.*?);/)[1];
    //                    return (fetch(dataURL)
    //                        .then(function (result) {
    //                            // Now that we have ArrayBuffer, 
    //                            var promise = result.arrayBuffer();
    //                            promise.then(function (result2) {
    //                                try {
    //                                    var fileData = '';
    //                                    var buffer = result2; //event.target.result;
    //                                    var byteArray = new Uint8Array(buffer);
    //                                    for (var i = 0; i < byteArray.byteLength; i++) {
    //                                        fileData += String.fromCharCode(byteArray[i])
    //                                    }
    //                                    data = {
    //                                        bwWorkflowAppId: workflowAppId,
    //                                        bwErrorOrSuggestionId: bwErrorOrSuggestionId,
    //                                        Filename: filename,
    //                                        FileContent: fileData,
    //                                        Description: description
    //                                    };
    //                                    var operationUri = thiz.options.operationUriPrefix + '_files/' + 'uploaderrororsuggestionscreenshot'; // _files allows us to use nginx to route these to a dedicated file server.
    //                                    $.ajax({
    //                                        url: operationUri,
    //                                        type: "PUT",
    //                                        data: data,
    //                                        headers: { "Accept": "application/json; odata=verbose" },
    //                                        timeout: thiz.options.ajaxTimeout,
    //                                        success: function (result) {
    //                                            try {
    //                                                //debugger;
    //                                                thiz.displayAlertDialog('Thanks for your report!<br />It has been sent for review.');
    //                                                ////displayAlertDialog("Success! Your file was uploaded to SharePoint.");
    //                                                $('#divReportAnErrorOrMakeASuggestion').dialog('close'); // Close the dialog.
    //                                                //$(thiz.element).find('#inputFile').replaceWith($('#inputFile').clone()); // Clear the file upload box. May not work in all browsers doing it this way.
    //                                                ////debugger; 
    //                                                //thiz.populateAttachments(workflowAppId, bwBudgetRequestId, 'newrequestattachments', true); //'attachments'); // This lists the attachments in the <p> tag with id='attachments'.

    //                                            } catch (e) {
    //                                                console.log('Exception in performUpload():2: ' + e.message + ', ' + e.stack);
    //                                                $(thiz.element).find('#newrequestattachments')[0].innerHTML = 'Exception in bwAttachments.performUpload:2: ' + e.message + ', ' + e.stack;
    //                                            }
    //                                        },
    //                                        error: function (data, errorCode, errorMessage) {
    //                                            $('#divWorkingOnItDialog').dialog('close'); // Close the "Working on it..." dialog.
    //                                            console.log('Error in performUpload(): ' + errorMessage);
    //                                            debugger;
    //                                            if (errorMessage == 'timeout') {
    //                                                thiz.displayAlertDialog('The file server could not be contacted. Please try again in a few minutes.');
    //                                            } else {
    //                                                thiz.displayAlertDialog('Error in performUpload(): ' + errorMessage);
    //                                            }
    //                                        }
    //                                    });
    //                                } catch (e) {
    //                                    console.log('Exception in xx(): ' + e.message + ', ' + e.stack);
    //                                }
    //                            });

    //                        }));

    //                } else {
    //                    // There was an error!
    //                    thiz.displayAlertDialog(result.message);
    //                }
    //            } catch (e) {
    //                console.log('Exception in sendScreenshotNow: ' + e.message + ', ' + e.stack);
    //                alert('Exception in sendScreenshotNow: ' + e.message + ', ' + e.stack);
    //            }
    //        }).error(function (data, errorCode, errorMessage) {
    //            //thiz.hideProgress();
    //            var msg;
    //            if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
    //                msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
    //            } else {
    //                msg = JSON.stringify(data) + ', json: ' + JSON.stringify(json);
    //            }
    //            console.log('Fail in sendScreenshotNow: ' + JSON.stringify(data) + ', json: ' + JSON.stringify(json));
    //            alert('Fail in sendScreenshotNow: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
    //            //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
    //            //var error = JSON.parse(data.responseText)["odata.error"];
    //            //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
    //        });

    //    } catch (e) {
    //        console.log('Exception in sendScreenshotNow(): ' + e.message + ', ' + e.stack);
    //    }
    //},

    sendScreenshotNow2: function () {
        // SEARCH FOR "take a screenshot with javascript" to find this functionality!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 6-30-2020 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        try {
            console.log('In bwCoreComponent.js.sendScreenshotNow2().');
            //alert('In bwCoreComponent.js.sendScreenshotNow2().');
            var thiz = this;

            $('#divReportAnErrorOrMakeASuggestion').dialog('close');

            ShowActivitySpinner_Promise('Taking screenshot and copying logs...')
                .then(function (results) {
                    try {
                        //var tenantId = $('.bwAuthentication').bwAuthentication('option', 'tenantId');
                        var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                        var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
                        var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
                        var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

                        var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                        var description = document.getElementById('txtReportAnErrorOrMakeASuggestionDialogDescription').value;

                        //var logs = JSON.stringify(console.logs);



                        //
                        //
                        // 4-5-2024. FIX THIS>>> should be JSON not an html string...... limiting the entries so we get a successful web service call. The ajax can only support xx characters..<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                        //
                        //

                        var logs = '';

                        var html = '';

                        try {
                            //var logs2 = JSON.parse(console.logs);
                            var logs2 = console.logs;


                            //for (var i = 0; i < logs2.length; i++) {
                            for (var i = 0; i < 500; i++) {
                                html += logs2[i].timestamp + ': ' + logs2[i].message;
                                html += '<br />';
                            }

                            logs += html;
                        } catch (e) {

                            var msg = 'THERE WAS AN ERROR PARSING THE LOGS. xcx2133421-1: ' + e.message + ', ' + e.stack;
                            logs += msg;
                            alert(msg);

                        }




                        var data = {
                            bwParticipantId_LoggedIn: participantId,
                            bwActiveStateIdentifier: activeStateIdentifier,
                            bwWorkflowAppId_LoggedIn: workflowAppId,

                            bwWorkflowAppId: workflowAppId,
                            Description: description,
                            Logs: logs,
                            CreatedByFriendlyName: participantFriendlyName,
                            CreatedById: participantId,
                            CreatedByEmail: participantEmail
                        };

                        console.log('Calling _bw/reportanerrorormakeasuggestion(). bwWorkflowAppId: ' + workflowAppId);

                        $.ajax({
                            url: thiz.options.operationUriPrefix + "_bw/reportanerrorormakeasuggestion",
                            type: 'POST',
                            data: data,
                            headers: {
                                "Accept": "application/json; odata=verbose"
                            },
                            success: function (results) {
                                try {
                                    if (results.status != 'SUCCESS') {

                                        HideActivitySpinner();

                                        console.log('Error in bwCoreComponent.js.sendScreenshotNow2(). results: ' + JSON.stringify(results));
                                        displayAlertDialog('bwCoreComponent.js.sendScreenshotNow2(). url: ' + thiz.options.operationUriPrefix + "_bw/ReportAnErrorOrMakeASuggestion" + ', results: ' + JSON.stringify(results));

                                    } else {

                                        // Now we have to upload the screenshot(s).
                                        var bwErrorOrSuggestionId = results.bwErrorOrSuggestionId;
                                        //var filenameGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                                        //    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                                        //    return v.toString(16);
                                        //});
                                        //var filename = filenameGuid + '.png';

                                        var filename = results.filename;

                                        var errorLoggedTo_bwWorkflowAppId = workflowAppId;

                                        //HideActivitySpinner();

                                        var node = document.getElementById('divBwActiveMenu');

                                        html2canvas(node)
                                            .then(function (canvas) {
                                                ShowActivitySpinner_Promise('Processing screenshot...')
                                                    .then(function (results) {
                                                        try {
                                                            //var dataURL = canvas.toDataURL("image/png");  //  document.getElementById('imgReportAnErrorOrMakeASuggestionDialogImage1').src; // This is a DataURL!
                                                            var dataURL = canvas.toDataURL('image/jpeg', 0.05); // Low quality jpeg. Originally used png, but it cannot be compressed/it isnt lossy... so trying jpeg. 3-23-2024. // https://stackoverflow.com/questions/35866750/how-to-reduce-image-quality-in-html2canvas
                                                            const arr = dataURL.split(',');
                                                            const mime = arr[0].match(/:(.*?);/)[1];

                                                            if (!window.fetch) {
                                                                // do something with XMLHttpRequest?
                                                                alert('This browser does not support fetch.');

                                                            } else {
                                                                // run my fetch request here

                                                                return (fetch(dataURL) // THIS IS WHERE THE ERROR IS HAPPENING ON THE iPad!!!!!!!! fetch not supported, so convert this code to jquery ajax.<<<<<<<<<<<<<<<<<<<<<<<< 4-12-2023 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                                                                    .then(function (results) {
                                                                        try {
                                                                            // Now that we have ArrayBuffer,
                                                                            var promise = results.arrayBuffer();
                                                                            promise.then(function (results2) {
                                                                                try {
                                                                                    var fileData = '';
                                                                                    var buffer = results2; //event.target.result;
                                                                                    var byteArray = new Uint8Array(buffer);
                                                                                    for (var i = 0; i < byteArray.byteLength; i++) {
                                                                                        fileData += String.fromCharCode(byteArray[i])
                                                                                    }
                                                                                    data = {
                                                                                        bwWorkflowAppId: workflowAppId,
                                                                                        bwErrorOrSuggestionId: bwErrorOrSuggestionId,
                                                                                        Filename: filename,
                                                                                        FileContent: fileData,
                                                                                        Description: description
                                                                                    };
                                                                                    var operationUri = thiz.options.operationUriPrefix + '_files/' + 'uploaderrororsuggestionscreenshot'; // _files allows us to use nginx to route these to a dedicated file server.
                                                                                    $.ajax({
                                                                                        url: operationUri,
                                                                                        type: "PUT",
                                                                                        data: data,
                                                                                        headers: { "Accept": "application/json; odata=verbose" },
                                                                                        timeout: 30000,
                                                                                        success: function (results) {
                                                                                            try {
                                                                                                HideActivitySpinner();

                                                                                                if (results.status != 'SUCCESS') {

                                                                                                    console.log(results.message);
                                                                                                    displayAlertDialog(results.message);

                                                                                                } else {

                                                                                                    //
                                                                                                    // We need to ask the user to type in the details of the error. Anything notable on the screen and note that they are confirming that it is ok to store the screen shot.
                                                                                                    //


                                                                                                    //thiz.displayAlertDialog('Thanks for your report.<br />It has been sent for review.');
                                                                                                    displayAlertDialog('Thanks for your report.<br />It has been sent for review.'); // errorLoggedTo_bwWorkflowAppId: ' + errorLoggedTo_bwWorkflowAppId + ', message: ' + results.message);

                                                                                                    $('#divReportAnErrorOrMakeASuggestion').dialog('close'); // Close the dialog.

                                                                                                }

                                                                                            } catch (e) {
                                                                                                HideActivitySpinner();
                                                                                                console.log('Exception in performUpload():2: ' + e.message + ', ' + e.stack);
                                                                                                displayAlertDialog('Exception in performUpload():2: ' + e.message + ', ' + e.stack);
                                                                                                //$(thiz.element).find('#newrequestattachments')[0].innerHTML = 'Exception in bwAttachments.performUpload:2: ' + e.message + ', ' + e.stack;
                                                                                            }
                                                                                        },
                                                                                        error: function (data, errorCode, errorMessage) {
                                                                                            HideActivitySpinner();
                                                                                            //$('#divWorkingOnItDialog').dialog('close'); // Close the "Working on it..." dialog.
                                                                                            console.log('Error in bwCoreComponent.js.sendScreenshotNow2.performUpload(): ' + errorMessage);
                                                                                            displayAlertDialog('Error in bwCoreComponent.js.sendScreenshotNow2.performUpload(): ' + errorMessage);
                                                                                            //debugger;
                                                                                            //if (errorMessage == 'timeout') {
                                                                                            //    thiz.displayAlertDialog('The file server could not be contacted. Please try again in a few minutes.');
                                                                                            //} else {
                                                                                            //    thiz.displayAlertDialog('Error in performUpload(): ' + errorMessage);
                                                                                            //}
                                                                                        }
                                                                                    });
                                                                                } catch (e) {
                                                                                    HideActivitySpinner();
                                                                                    console.log('Exception in xcx123446-3(): ' + e.message + ', ' + e.stack);
                                                                                    displayAlertDialog('Exception in xcx123446-3(): ' + e.message + ', ' + e.stack);
                                                                                }
                                                                            });
                                                                        } catch (e) {
                                                                            HideActivitySpinner();
                                                                            console.log('Exception in xcx123446-3-2(): ' + e.message + ', ' + e.stack);
                                                                            displayAlertDialog('Exception in xcx123446-3-2(): ' + e.message + ', ' + e.stack);
                                                                        }
                                                                    })
                                                                    .catch(function (e) {
                                                                        HideActivitySpinner();
                                                                        console.log('Exception in xcx123446-2(): ' + JSON.stringify(e));
                                                                        displayAlertDialog('Exception in xcx123446-2(): ' + JSON.stringify(e));
                                                                    }));

                                                            }







                                                        } catch (e) {
                                                            HideActivitySpinner();
                                                            console.log('Exception in sendScreenshotNow2:xcx3454: ' + e.message + ', ' + e.stack);
                                                            alert('Exception in sendScreenshotNow2:xcx3454: ' + e.message + ', ' + e.stack);
                                                        }

                                                    })
                                                    .catch(function (e) {
                                                        HideActivitySpinner();
                                                        console.log('Exception in xcx123446(): ' + JSON.stringify(e));
                                                        displayAlertDialog('Exception in xcx123446(): ' + JSON.stringify(e));
                                                    });
                                            })
                                            .catch(function (e) {
                                                HideActivitySpinner();
                                                console.log('Exception in xcx123446-2(): ' + JSON.stringify(e));
                                                displayAlertDialog('Exception in xcx123446-2(): ' + JSON.stringify(e));
                                            });





                                    }
                                } catch (e) {
                                    HideActivitySpinner();
                                    console.log('Exception in sendScreenshotNow2: ' + e.message + ', ' + e.stack);
                                    alert('Exception in sendScreenshotNow2: ' + e.message + ', ' + e.stack);
                                }
                            },
                            error: function (data, errorCode, errorMessage) {
                                HideActivitySpinner();

                                //thiz.hideProgress();
                                var msg = 'Fail in sendScreenshotNow2: ' + JSON.stringify(data) + ', ' + errorCode + ', ' + errorMessage;
                                //if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                                //    msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                                //} else {
                                //    msg = JSON.stringify(data) + ', json: ' + JSON.stringify(json);
                                //}
                                console.log(msg);
                                alert(msg); //+ error.message.value + ' ' + error.innererror.message);
                                //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                                //var error = JSON.parse(data.responseText)["odata.error"];
                                //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
                            }
                        });

                    } catch (e) {
                        HideActivitySpinner();

                        var msg = 'Exception in sendScreenshotNow2():22-1-1: ' + e.message + ', ' + e.stack;
                        console.log(msg);
                        displayAlertDialog(msg);
                    }

                })
                .catch(function (e) {
                    HideActivitySpinner();

                    console.log('Exception in sendScreenshotNow2():22-1-2: ' + JSON.stringify(e));
                    displayAlertDialog('Exception in sendScreenshotNow2():22-1-2: ' + JSON.stringify(e));
                });

        } catch (e) {
            console.log('Exception in sendScreenshotNow2(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in sendScreenshotNow2(): ' + e.message + ', ' + e.stack);
        }
    },

    reportAnErrorOrMakeASuggestion: function () {
        // SEARCH FOR "take a screenshot with javascript" to find this functionality!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 6-30-2020 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        try {
            console.log('In reportAnErrorOrMakeASuggestion().');

            //// DONT NEED TO DO THIS. I thought we did 3-24-2023 but then I tried again and it got the whole screen. Maybe Configuration > Organization has something weird going on with it, but I am leaving this issue behind for now.
            //var body = document.body.getBoundingClientRect();
            //var top = body.top;
            //var left = body.left; // 1st time: 259   // 2nd time: 104
            //var x = top;
            //var y = left;
            //console.log('In reportAnErrorOrMakeASuggestion(). x: ' + x + ', y: ' + y);

            $("#divReportAnErrorOrMakeASuggestion").dialog({
                modal: true,
                resizable: false,
                closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                width: '800',
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {

                    $('.ui-widget-overlay').bind('click', function () {
                        $("#divReportAnErrorOrMakeASuggestion").dialog('close');
                    });

                    //window.scrollTo(x, y); // This makes the screen scroll to where the user had it originally. This makes sure that the screen shot will include "What the user was looking at". 3-24-2023.

                    try {
                        document.getElementById('imgReportAnErrorOrMakeASuggestionDialogImage1').src = '';
                    } catch (e) { }

                }
            });

        } catch (e) {
            console.log('Exception in reportAnErrorOrMakeASuggestion(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in reportAnErrorOrMakeASuggestion(): ' + e.message + ', ' + e.stack);
        }
    },
    whatAmILookingAt: function () {
        try {
            console.log('In whatAmILookingAt().');
            this.displayAlertDialog('This functionality is incomplete. Coming soon! This is going to describe what you are looking at.');

        } catch (e) {
            console.log('Exception in whatAmILookingAt(): ' + e.message + ', ' + e.stack);
        }
    },

    displayADMINParticipantInCircleDialog: function () {
        try {
            // Display the ADMIN participant in a circle dialog. If the user clicks on the ADMIN role row, it will display the participant circle dialog for the person who is the ADMIN.
            console.log('In displayADMINParticipantInCircleDialog().');
            debugger;

            if (this.options.store.BwWorkflowUserRoleAdmin && this.options.store.BwWorkflowUserRoleAdmin.length == 1) {
                $('.bwCircleDialog2').bwCircleDialog2('displayParticipantRoleMultiPickerInACircle', true, '', '' + this.options.store.BwWorkflowUserRoleAdmin[0].bwParticipantId + '', '' + this.options.store.BwWorkflowUserRoleAdmin[0].bwParticipantFriendlyName + '', '' + this.options.store.BwWorkflowUserRoleAdmin[0].bwParticipantEmail + '', '' + this.options.store.BwWorkflowUserRoleAdmin[0].bwParticipantLogonType + '');
            }

        } catch (e) {
            console.log('Exception in displayADMINParticipantInCircleDialog(): ' + e.message + ', ' + e.stack);
        }
    },







    reassignAdminRole: function () { // assignToId, assignToFriendlyName, assignToEmail, modifiedById, modifiedByFriendlyName, modifiedByEmail) {
        try {
            console.log('In bwCoreComponent.js.reassignAdminRole().'); // assignToId: ' + assignToId + ', assignToFriendlyName: ' + assignToFriendlyName + ', assignToEmail: ' + assignToEmail + ', modifiedById: ' + modifiedById + ', modifiedByFriendlyName: ' + modifiedByFriendlyName + ', modifiedByEmail: ' + modifiedByEmail);
            var thiz = this;

            var tenantId = $('.bwAuthentication').bwAuthentication('option', 'tenantId');
            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
            var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

            var assignToId = $('#txtReassignWorkflowAdministratorRoleDialog_ParticipantId').val();
            var assignToFriendlyName = $('#txtReassignWorkflowAdministratorRoleDialog_ParticipantFriendlyName').val();
            var assignToEmail = $('#txtReassignWorkflowAdministratorRoleDialog_ParticipantEmail').val();

            debugger;
            //$('#btnChangeAdminRoleDialogChangeRole').unbind();

            // We need to be able to reassign the ADMIN role here!!!
            if (!(assignToId && assignToFriendlyName && assignToEmail && participantId && participantFriendlyName && participantEmail)) {
                alert('Not all information was specified for reassignAdminRole(). This process cannot continue.');
            } else {
                // BwWorkflowUserRole
                //alert('In reassignAdminRole(). This functionality is incomplete. Coming soon!');
                var json = {
                    bwTenantId: tenantId,
                    bwWorkflowAppId: workflowAppId,
                    bwParticipantId: assignToId,
                    bwParticipantFriendlyName: assignToFriendlyName,
                    bwParticipantEmail: assignToEmail,
                    ModifiedByFriendlyName: participantFriendlyName,
                    ModifiedById: participantId,
                    ModifiedByEmail: participantEmail
                };
                $.ajax({
                    url: thiz.options.operationUriPrefix + "odata/ReassignAdminRole",
                    type: "Post",
                    timeout: thiz.options.ajaxTimeout,
                    data: json,
                    headers: {
                        "Accept": "application/json; odata=verbose"
                    }
                }).success(function (result) {
                    try {
                        debugger;

                        alert(result.message);
                        // CLEAN UP and reload bwRolesEditor.
                        $("#divReassignWorkflowAdministratorRoleDialog").dialog('close');
                        $('.bwCircleDialog').bwCircleDialog('hideAndDestroyCircleDialog');
                        // Also clear the data as it needs reloading.
                        //thiz.options.store = null;
                        //thiz._create();

                        // Recreate the display so that the new ADMIN is displayed.
                        thiz.renderBwRoles('divBwRolesEditor'); // THIS DISPLAYS the roles that are in the JSON org definition.

                    } catch (e) {
                        console.log('Exception in bwCoreComponent.js.reassignAdminRole: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwCoreComponent.js.reassignAdminRole: ' + e.message + ', ' + e.stack);
                    }
                }).error(function (data, errorCode, errorMessage) {
                    //thiz.hideProgress();
                    var msg;
                    if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                        msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                    } else {
                        msg = JSON.stringify(data) + ', json: ' + JSON.stringify(json);
                    }
                    console.log('Fail in bwCoreComponent.js.reassignAdminRole: ' + JSON.stringify(data) + ', json: ' + JSON.stringify(json));
                    displayAlertDialog('Fail in bwCoreComponent.js.reassignAdminRole: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                    //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                    //var error = JSON.parse(data.responseText)["odata.error"];
                    //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
                });
            }
        } catch (e) {
            console.log('Exception in bwCoreComponent.js.reassignAdminRole(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwCoreComponent.js.reassignAdminRole(): ' + e.message + ', ' + e.stack);
        }
    },













    tileTheDialogs: function () {
        try {
            // Tile and balloon the windows!
            console.log('In tileTheDialogs().');
            var dialogs = $(document).find('.ui-dialog');
            var visibleWindowCount = 0;
            for (var i = 0; i < dialogs.length; i++) {
                if ($(dialogs[i]).is(':visible')) {
                    visibleWindowCount += 1;
                }
            }
            this.displayAlertDialog('Found ' + visibleWindowCount + ' visible windows. The tiling and ballooning functionality is incomplete. Coming soon!');




            // NEED TO GET THESE TILING AND BALLOONING!!!!!!!! 7-26-2020.
            console.log('In tileTheDialogs(). NEED TO GET THESE TILING AND BALLOONING!!!!!!!! 7-26-2020.');






        } catch (e) {
            console.log('Exception in tileTheDialogs(): ' + e.message + ', ' + e.stack);
        }
    },

    renderParticipantTasks: function (bwParticipantId, elementId, bwParticipantFriendlyName) {
        console.log('In bwCoreComponent.js.renderParticipantTasks(' + bwParticipantId + ', ' + elementId + ', ' + bwParticipantFriendlyName + ').');
        //alert('In bwCoreComponent.js.renderParticipantTasks(' + bwParticipantId + ', ' + elementId + ', ' + bwParticipantFriendlyName + ').');
        var thiz = this;

        var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
        var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

        var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

        var data = {
            bwParticipantId_LoggedIn: participantId,
            bwActiveStateIdentifier: activeStateIdentifier,
            bwWorkflowAppId_LoggedIn: workflowAppId,

            bwWorkflowAppId: workflowAppId,
            bwParticipantId: bwParticipantId,
            bwParticipantEmail: participantEmail
        };

        var operationUri = webserviceurl + '/bwtasksoutstanding';
        $.ajax({
            url: operationUri,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (taskData) {
                try {

                    var html = '';

                    var bwParticipantFirstName = bwParticipantFriendlyName.split(' ')[0];

                    if (taskData.length == 0) {

                        // This participant has no pending tasks.
                        document.getElementById('participantCircleDialogSectionTitle_2_' + bwParticipantId).innerHTML = bwParticipantFirstName + ' has no pending tasks.';

                    } else {

                        if (taskData.length == 1) {
                            document.getElementById('participantCircleDialogSectionTitle_2_' + bwParticipantId).innerHTML = bwParticipantFirstName + ' has ' + taskData.length + ' pending task:';
                        } else {
                            document.getElementById('participantCircleDialogSectionTitle_2_' + bwParticipantId).innerHTML = bwParticipantFirstName + ' has ' + taskData.length + ' pending tasks:';
                        }

                        html += '<table>';

                        if (taskData.length > 0) {

                            for (var i = 0; i < taskData.length; i++) {

                                html += '<tr onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'' + thiz.options.operationUriPrefix + '\', \'' + taskData[i].bwRelatedItemId + '\', \'' + taskData[i].Title + '\', \'' + bwEncodeURIComponent(taskData[i].ProjectTitle) + '\', \'' + taskData[i].Title + '\');event.preventDefault();">';

                                html += '    <td style="background-color:white;" ';
                                //html += 'onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'' + taskData[i].Title + '\', \'' + taskData[i].ProjectTitle + '\', \'BriefDescriptionOfProject\', \'' + workflowAppId + '\', \'' + taskData[i].bwRelatedItemId + '\', \'xcxOrgId2\', \'xcxOrgName\');" ';
                                html += 'onmouseenter="$(\'.bwCoreComponent\').bwCoreComponent(\'showRowHoverDetails\', \'' + bwEncodeURIComponent(JSON.stringify(taskData[i])) + '\', ' + true + ', this);" ';
                                html += 'onmouseleave="$(\'.bwCoreComponent\').bwCoreComponent(\'hideRowHoverDetails\');" ';
                                html += '>';
                                html += '       <img xcx="xcx235998" class="gridMagnifyingGlass" style="vertical-align:middle;width:25px;height:25px;" src="/images/zoom.jpg" />';
                                html += '    </td>';

                                html += '<td colspan="3" style="background-color:#d8d8d8;padding:10px 10px 10px 10px;cursor:pointer;" ';
                                html += 'onmouseenter="this.style.backgroundColor=\'lightgoldenrodyellow\';" ';
                                html += 'onmouseleave="this.style.backgroundColor=\'#d8d8d8\';"  ';
                                html += 'onclick="$(\'.bwRequest\').bwRequest(\'displayArInDialog\',\'' + thiz.options.operationUriPrefix + '\', \'' + taskData[i].bwRelatedItemId + '\', \'' + taskData[i].Title + '\', \'' + taskData[i].ProjectTitle + '\', \'' + taskData[i].Title + '\');" ';
                                html += '>';

                                var daysOverdue = Date.daysBetween(taskData[i].bwDueDate, new Date());
                                html += '    <div xcx="xcx44555" style="display:inline-block;">' + daysOverdue + ' days overdue: <em>' + taskData[i].Title + ' - ' + taskData[i].ProjectTitle + ' - ' + taskData[i].BudgetAmount + ' -  [(' + taskData[i].bwAssignedToRaciRoleAbbreviation + ') ' + taskData[i].bwAssignedToRaciRoleName + ']</em></div>';
                                html += '  </td>';

                                html += '</tr>';

                            }

                        }

                        html += '</table>';

                    }

                    $('#' + elementId).html(html);

                } catch (e) {
                    console.log('Exception in bwCoreComponent.js.renderParticipantTasks(): ' + e.message + ', ' + e.stack);
                    displayAlertDialog('Exception in bwCoreComponent.js.renderParticipantTasks(): ' + e.message + ', ' + e.stack);
                }

            },
            error: function (data, errorCode, errorMessage) {
                console.log('Error in bwCoreComponent.js.renderParticipantTasks():4:' + errorCode + ', ' + errorMessage + ', ' + JSON.stringify(data));
                displayAlertDialog('Error in bwCoreComponent.js.renderParticipantTasks():4:' + errorCode + ', ' + errorMessage + ', ' + JSON.stringify(data));
            }
        });

    },

    renderMasterRoleListForEditing: function (elementId) {
        try {
            // This can show up in a few places. On the "Configuration > Participants" page, in a modal dialog, etc.
            console.log('In renderMasterRoleListForEditing(' + elementId + ').');
            var thiz = this;
            var html = '';

            //var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');



            //html += '<span id="spanMasterRoleListForEditing_IdentificationText"></span>'; // This will display workflow guid and request type.




            html += '<table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
            html += '  <tr>';
            html += '    <td>';
            //
            html += '<br />';
            html += '<div class="codeSnippetContainer" id="code-snippet-4" xmlns="">';
            html += '    <div class="codeSnippetContainerTabs">';
            html += '        <div class="codeSnippetContainerTabSingle" dir="ltr"><a>&nbsp;&nbsp;Organization Roles&nbsp;&nbsp;</a></div>';
            html += '    </div>';
            html += '    <div class="codeSnippetContainerCodeContainer">';
            html += '        <div class="codeSnippetToolBar">';
            html += '            <div class="codeSnippetToolBarText">';
            html += '                <a name="CodeSnippetCopyLink" title="Copy to clipboard." style="display: none;" href="javascript:displayAlertDialog(\'Copy support is not yet implemented.\');">Copy</a>';
            html += '            </div>';
            html += '        </div>';
            html += '        <div class="codeSnippetContainerCode" id="CodeSnippetContainerCode_5207fb9c-60fd-402f-8729-5795651a5ad3" dir="ltr">';
            html += '            <div>';
            html += '                <span id="spanBwParticipantsConfiguration" style="font-size:x-small;">';



            //debugger;



            //
            var data = {
                "bwWorkflowAppId": workflowAppId
            };
            $.ajax({
                //url: appweburl + "/bwparticipants",
                url: this.options.operationUriPrefix + "_bw/workflow/participants",
                type: "DELETE",
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: function (data1) {
                    var data = data1.BwWorkflowUsers;
                    html += '<style>';
                    html += '.dataGridTable { border: 1px solid gainsboro; font-size:14px; font-family: "Helvetica Neue","Segoe UI",Helvetica,Verdana,sans-serif; }';
                    html += '.dataGridTable td { border-left: 0px; border-right: 1px solid gainsboro; }';
                    html += '.headerRow { background-color:white; color:gray;border-bottom:1px solid gainsboro; }';
                    html += '.headerRow td { border-bottom:1px solid gainsboro; padding-top:3px;padding-bottom:5px;padding-right:10px;padding-left:10px; }';
                    html += '.filterRow td { border-bottom:1px solid whitesmoke; padding-top:3px;padding-bottom:5px;padding-right:10px;padding-left:10px; }';
                    html += '.alternatingRowLight { background-color:white; }';
                    html += '.alternatingRowLight td { padding-top:3px;padding-bottom:5px;padding-right:10px;padding-left:10px; }';
                    html += '.alternatingRowLight:hover { background-color:lightgoldenrodyellow; }';
                    html += '.alternatingRowDark { background-color:whitesmoke; }';
                    html += '.alternatingRowDark td { padding-top:3px;padding-bottom:5px;padding-right:10px;padding-left:10px; }';
                    html += '.alternatingRowDark:hover { background-color:lightgoldenrodyellow; }'; // 
                    html += '.roleName { white-space:nowrap; }';
                    html += '</style>';





                    //var car = $('.bwWorkflowEditor').bwWorkflowEditor('xx', 'xx');


                    // Now get the workflow
                    $.ajax({
                        url: thiz.options.operationUriPrefix + "odata/WorkflowConfiguration/" + thiz.options.bwTenantId + '/' + thiz.options.bwWorkflowAppId + "/true", //?$filter=Active eq true", //('eCarWorkflow')", // Get the eCarWorkflow json/definition from the database.
                        dataType: "json",
                        contentType: "application/json",
                        type: "Get",
                        timeout: thiz.options.ajaxTimeout
                    }).done(function (result2) {
                        try {


                            //console.log('The user is not logged in, so displaying the default WorkflowEditor.');
                            //var orgRoles;
                            var workflow;
                            var roles;

                            //if (!participantId) {
                            //    // The user is not logged in.
                            //    debugger;
                            //    console.log('The user is not logged in, so displaying the default WorkflowEditor.');
                            //    //orgRoles = result.value[0].ConfigurationValues; // Works when the user is not logged in. 
                            //    workflow = result2.value[0].ConfigurationValues; // Works when the user is not logged in. 
                            //} else {
                            //    // The user is logged in.
                            //    //debugger;
                            //    //orgRoles = result.value; // Works when the user is logged in.
                            //    workflow = result2.value; // Works when the user is logged in.
                            //}
                            //debugger;

                            //var x = {
                            //    Global: orgRoles
                            //}

                            //if (!orgRoles.Global) {
                            //    var x = {
                            //        Global: orgRoles
                            //    };
                            //    orgRoles = JSON.parse(JSON.stringify(x));
                            //}
                            //debugger;
                            //var draftGlobal = JSON.parse(JSON.stringify(orgRoles.Global));
                            //thiz.options.store = {
                            //    DraftGlobal: draftGlobal,
                            //    Global: orgRoles.Global
                            //}
                            //debugger;

                            workflow = JSON.parse(result2.value[0].bwWorkflowJson); // Works when the user is logged in.

                            thiz.options.workflow = workflow;

                            var car = thiz.options.workflow;





                            html += '<table class="dataGridTable">';
                            html += '  <tr class="headerRow">';
                            html += '    <td>Role Id</td>';
                            html += '    <td>Role Name</td>';
                            html += '    <td>Role Details</td>';
                            //html += '    <td></td>';
                            html += '    <td></td>';
                            html += '    <td></td>';
                            html += '  </tr>';






                            //var alternatingRow = 'light'; // Use this to color the rows.
                            //for (var i = 0; i < data.length; i++) {
                            //    if (alternatingRow == 'light') {
                            //        html += '  <tr class="alternatingRowLight" style="cursor:pointer;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayParticipantRoleMultiPickerInACircle\', true, \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantEmail + '\');">';
                            //        alternatingRow = 'dark';
                            //    } else {
                            //        html += '  <tr class="alternatingRowDark" style="cursor:pointer;" onclick="$(\'.bwAuthentication\').bwAuthentication(\'displayParticipantRoleMultiPickerInACircle\', true, \'' + 'btnEditRaciRoles_' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantEmail + '\');">';
                            //        alternatingRow = 'light';
                            //    }
                            //    html += '    <td>' + data[i].bwParticipantFriendlyName + '</td>';
                            //    html += '    <td>' + data[i].bwParticipantEmail + '</td>';
                            //    //html += '    <td>' + data[i].bwParticipantRole + '</td>';
                            //    if ((data[i].bwParticipantId == participantId) || (data[i].bwParticipantRole == 'owner')) {
                            //        //html += '    <td id="btnEditRaciRoles_' + data[i].bwParticipantId + '">';
                            //        //html += '    </td>';

                            //        //html += '    <td></td>'; // We need to be able to reassign the owner's responsibilities to someone else.
                            //        html += '    <td><button class="BwSmallButton" onclick="cmdDisplayReassignUserTasksDialog(\'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantEmail + '\', \'' + data[i].bwParticipantRole + '\', \'' + data[i].bwParticipantLogonType + '\');">Edit Role</button></td>';
                            //        html += '    <td></td>';
                            //    } else {
                            //        //html += '    <td><button class="BwSmallButton" onclick="cmdDisplayChangeUserRoleDialog(\'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantEmail + '\', \'' + data[i].bwParticipantRole + '\', \'' + data[i].bwParticipantLogonType + '\');">change<br />role</button></td>';
                            //        html += '    <td><button class="BwSmallButton" onclick="cmdDisplayReassignUserTasksDialog(\'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantEmail + '\', \'' + data[i].bwParticipantRole + '\', \'' + data[i].bwParticipantLogonType + '\');">Edit Role</button></td>';
                            //        html += '    <td><img src="images/trash-can.png" onclick="cmdDisplayDeleteUserDialog(\'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantEmail + '\', \'' + data[i].bwParticipantRole + '\', \'' + data[i].bwParticipantLogonType + '\');" title="Delete" style="cursor:pointer;" /></td>';
                            //    }
                            //    html += '  </tr>';
                            //}
                            //html += '</table>';























                            //var html = '';
                            //html += '<table>';
                            // Iterate through the steps. Then the informs, then the assigns. Make an array of the roles. { RoleId, RoleName }
                            //debugger;
                            var alternatingRow = 'light'; // Use this to color the rows.
                            //debugger;
                            for (var i = 0; i < car.Steps.Step.length; i++) {
                                var stepName = car.Steps.Step[i]["@Name"];
                                if (stepName == 'Create' || stepName == 'Revise') { // || stepName == 'Admin') {
                                    // Do nothing, not displaying these steps.
                                } else {
                                    // Display Inform roles.
                                    if (car.Steps.Step[i].Inform && car.Steps.Step[i].Inform.length) {
                                        if (car.Steps.Step[i].Inform.length > 0) {
                                            for (var j = 0; j < car.Steps.Step[i].Inform.length; j++) {
                                                //html += '<tr class="orgRow">';


                                                if (alternatingRow == 'light') {
                                                    html += '  <tr class="alternatingRowLight" style="cursor:pointer;" >';
                                                    alternatingRow = 'dark';
                                                } else {
                                                    html += '  <tr class="alternatingRowDark" style="cursor:pointer;" >';
                                                    alternatingRow = 'light';
                                                }








                                                var isSelected = false;
                                                var userOrgsForRole = [];
                                                if (roles) {
                                                    for (var r = 0; r < roles.length; r++) {
                                                        if (roles[r].RoleId == car.Steps.Step[i].Inform[j]["@Role"]) {
                                                            userOrgsForRole.push(roles[r].OrgId);
                                                            isSelected = true;
                                                        }
                                                    }
                                                }
                                                //if (isSelected) {
                                                //    html += '   <td>xcx80<input id="' + 'roleCheckbox_' + j + '" type="checkbox" checked /></td>';
                                                //} else {
                                                //    html += '   <td>xcx81<input id="' + 'roleCheckbox_' + j + '" type="checkbox" /></td>';
                                                //}
                                                html += '       <td class="roleId">' + car.Steps.Step[i].Inform[j]["@Role"] + '</td>';
                                                //html += '       <td>&nbsp;</td>';
                                                html += '       <td class="roleName">' + car.Steps.Step[i].Inform[j]["@RoleName"] + '</td>';



                                                html += '       <td class="roleDetails">' + '' + '</td>';

                                                // Display orgs for user role
                                                //html += '       <td>&nbsp;</td>';
                                                //if (isSelected) {
                                                //    html += '   <td>' + userOrgsForRole + '</td>';
                                                //} else {
                                                //    html += '       <td></td>';
                                                //}


                                                html += '    <td><button class="BwSmallButton" onclick="$(\'.bwCoreComponent\').bwCoreComponent(\'displayEditARoleDialog\', \'' + car.Steps.Step[i].Inform[j]["@Role"] + '\');">xEdit Role</button></td>';
                                                html += '    <td><img src="images/trash-can.png" onclick="cmdDisplayDeleteUserDialog(\'' + car.Steps.Step[i].Inform[j]["@Role"] + '\');" title="Delete" style="cursor:pointer;" /></td>';


                                                html += '</tr>';
                                            }
                                        }
                                    }
                                    // Display Assign roles.
                                    if (car.Steps.Step[i].Assign) {
                                        if (car.Steps.Step[i].Assign.length > 0) {
                                            for (var j = 0; j < car.Steps.Step[i].Assign.length; j++) {
                                                //html += '<tr class="orgRow">';

                                                if (alternatingRow == 'light') {
                                                    html += '  <tr class="alternatingRowLight" style="cursor:pointer;" >';
                                                    alternatingRow = 'dark';
                                                } else {
                                                    html += '  <tr class="alternatingRowDark" style="cursor:pointer;" >';
                                                    alternatingRow = 'light';
                                                }


                                                var isSelected = false;
                                                var userOrgsForRole = [];
                                                if (roles) {
                                                    for (var r = 0; r < roles.length; r++) {
                                                        if (roles[r].RoleId == car.Steps.Step[i].Assign[j]["@Role"]) {
                                                            userOrgsForRole.push(roles[r].OrgId);
                                                            isSelected = true;
                                                        }
                                                    }
                                                }
                                                //if (isSelected) {
                                                //    html += '   <td>xcx83<input id="' + 'roleCheckbox_' + i + '" type="checkbox" checked onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'OrgRoleCheckbox_Onchange\', \'' + 'orgRoleCheckbox_' + i + '\', \'' + '' + '\', \'' + '' + '\', \'' + '' + '\', \'' + '' + '\', \'' + '' + '\', \'' + '' + '\');" /></td>';
                                                //} else {
                                                //    html += '   <td>xcx84<input id="' + 'roleCheckbox_' + i + '" type="checkbox" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'OrgRoleCheckbox_Onchange\', \'' + 'orgRoleCheckbox_' + i + '\', \'' + '' + '\', \'' + '' + '\', \'' + '' + '\', \'' + '' + '\', \'' + '' + '\', \'' + '' + '\');" /></td>';
                                                //}
                                                html += '       <td class="roleId">' + car.Steps.Step[i].Assign[j]["@Role"] + '</td>';
                                                //html += '       <td>&nbsp;</td>';
                                                html += '       <td class="roleName">' + car.Steps.Step[i].Assign[j]["@RoleName"] + '</td>';


                                                html += '       <td class="roleDetails">' + '' + '</td>';

                                                //html += '       <td>&nbsp;</td>';
                                                //if (isSelected) {
                                                //    html += '   <td>' + userOrgsForRole + '</td>';
                                                //} else {
                                                //    html += '       <td></td>';
                                                //}

                                                html += '    <td><button class="BwSmallButton" onclick="$(\'.bwCoreComponent\').bwCoreComponent(\'displayEditARoleDialog\',\'' + car.Steps.Step[i].Assign["@Role"] + '\');">yEdit Role</button></td>';
                                                html += '    <td><img src="images/trash-can.png" onclick="cmdDisplayDeleteUserDialog(\'' + car.Steps.Step[i].Assign["@Role"] + '\');" title="Delete" style="cursor:pointer;" /></td>';


                                                html += '</tr>';
                                            }
                                        }
                                        //
                                        // Just in case it is not an array but just a single item/role.
                                        //
                                        //debugger;
                                        if (car.Steps.Step[i].Assign["@Role"]) {
                                            //html += '<tr class="orgRow">';


                                            if (car.Steps.Step[i].Assign["@Role"] == 'ADMIN') {
                                                //
                                                // If the user clicks on the ADMIN role row, it will display the participant circle dialog for the person who is the ADMIN.
                                                //
                                                if (alternatingRow == 'light') {
                                                    //html += '  <tr class="alternatingRowLight" style="cursor:pointer;" onclick="$(\'.bwCoreComponent\').bwCoreComponent(\'displayADMINParticipantInCircleDialog\');" >'; // We use this id to attach a click event later on. If the user clicks on the ADMIN role row, it will display the participant circle dialog for the person who is the ADMIN.
                                                    html += '  <tr class="alternatingRowLight" style="cursor:pointer;" onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'displayADMINParticipantInCircleDialog\');" >'; // We use this id to attach a click event later on. If the user clicks on the ADMIN role row, it will display the participant circle dialog for the person who is the ADMIN.
                                                    alternatingRow = 'dark';
                                                } else {
                                                    html += '  <tr class="alternatingRowDark" style="cursor:pointer;" >'; // We use this id to attach a click event later on. If the user clicks on the ADMIN role row, it will display the participant circle dialog for the person who is the ADMIN.
                                                    alternatingRow = 'light';
                                                }


                                            } else {
                                                if (alternatingRow == 'light') {
                                                    html += '  <tr class="alternatingRowLight" style="cursor:pointer;" >';
                                                    alternatingRow = 'dark';
                                                } else {
                                                    html += '  <tr class="alternatingRowDark" style="cursor:pointer;" >';
                                                    alternatingRow = 'light';
                                                }
                                            }


                                            var isSelected = false;
                                            var userOrgsForRole = [];
                                            if (roles) {
                                                for (var r = 0; r < roles.length; r++) {
                                                    if (roles[r].RoleId == car.Steps.Step[i].Assign["@Role"]) {
                                                        userOrgsForRole.push(roles[r].OrgId);
                                                        isSelected = true;
                                                    }
                                                }
                                            }
                                            //if (isSelected) {
                                            //    html += '   <td>xcx85<input id="' + 'roleCheckbox_' + i + '" type="checkbox" checked onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'OrgRoleCheckbox_Onchange\', \'' + 'orgRoleCheckbox_' + i + '\', \'' + '' + '\', \'' + '' + '\', \'' + '' + '\', \'' + '' + '\', \'' + '' + '\', \'' + '' + '\');" /></td>';
                                            //} else {
                                            //    html += '   <td>xcx86<input id="' + 'roleCheckbox_' + i + '" type="checkbox"onclick="$(\'.bwParticipantsEditor\').bwParticipantsEditor(\'OrgRoleCheckbox_Onchange\', \'' + 'orgRoleCheckbox_' + i + '\', \'' + '' + '\', \'' + '' + '\', \'' + '' + '\', \'' + '' + '\', \'' + '' + '\', \'' + '' + '\');"  /></td>';
                                            //}
                                            html += '       <td class="roleId">' + car.Steps.Step[i].Assign["@Role"] + '</td>';
                                            //html += '       <td>&nbsp;</td>';






                                            if (car.Steps.Step[i].Assign["@Role"] == 'ADMIN') {
                                                if (car.Steps.Step[i].Assign["@RoleName"]) {
                                                    html += '       <td class="roleName">' + car.Steps.Step[i].Assign["@RoleName"] + '</td>';
                                                } else {
                                                    html += '       <td class="roleName">' + 'Workflow Administrator' + '</td>';
                                                }

                                                html += '       <td class="roleDetails">';
                                                html += '       Only 1 person can be assigned this rolexcx2.<br /><ul><li>This role has to approve all new requests before they continue through the approval process.</li><li>This role receives tasks when no one has been specified for a role in the organization.</li><li>This is the only role that can perform actions on behalf of other roles.</li></ul>';
                                                html += '       </td>';

                                                //html += '       <td>&nbsp;</td>';
                                                //if (isSelected) {
                                                //    html += '   <td>' + userOrgsForRole + '</td>';
                                                //} else {
                                                //    html += '       <td></td>';
                                                //}

                                                //html += '    <td><button class="BwSmallButton" onclick="$(\'.bwCoreComponent\').bwCoreComponent(\'displayEditARoleDialog\',\'' + car.Workflow.Steps.Step[i].Assign["@Role"] + '\');">zEdit Role</button></td>';
                                                //html += '    <td><img src="images/trash-can.png" onclick="cmdDisplayDeleteUserDialog(\'' + car.Workflow.Steps.Step[i].Assign["@Role"] + '\');" title="Delete" style="cursor:pointer;" /></td>';
                                                html += '<td></td>';
                                                html += '<td></td>';
                                            } else {
                                                if (car.Steps.Step[i].Assign["@RoleName"]) {
                                                    html += '       <td class="roleName">' + car.Steps.Step[i].Assign["@RoleName"] + '</td>';
                                                } else {
                                                    html += '       <td class="roleName">' + '' + '</td>';
                                                }

                                                html += '       <td class="roleDetails">' + '' + '</td>';

                                                //html += '       <td>&nbsp;</td>';
                                                //if (isSelected) {
                                                //    html += '   <td>' + userOrgsForRole + '</td>';
                                                //} else {
                                                //    html += '       <td></td>';
                                                //}

                                                html += '    <td><button class="BwSmallButton" onclick="$(\'.bwCoreComponent\').bwCoreComponent(\'displayEditARoleDialog\',\'' + car.Steps.Step[i].Assign["@Role"] + '\');">zEdit Role</button></td>';
                                                html += '    <td><img src="images/trash-can.png" onclick="cmdDisplayDeleteUserDialog(\'' + car.Steps.Step[i].Assign["@Role"] + '\');" title="Delete" style="cursor:pointer;" /></td>';
                                                //html += '<td></td>';
                                                //html += '<td></td>';
                                            }

                                            html += '</tr>';
                                        }

                                    }
                                }
                            }
                            html += '</table>';
























                            html += '<br />';

                            html += '<input style="padding:5px 10px 5px 10px;" id="btnCreateRole2" onclick="$(\'.bwCoreComponent\').bwCoreComponent(\'displayCreateANewRoleDialog\');" type="button" value="Add a Role...">'; // $('.bwCoreComponent').bwCoreComponent('displayCreateANewRoleDialog');

                            //html += '&nbsp;<input style="padding:5px 10px 5px 10px;" id="btnInviteNewParticipant" onclick="cmdInviteNewParticipant();" type="button" value="Generate a new invitation link">';

                            //
                            html += '                </span>';
                            html += '            </div>';
                            html += '        </div>';
                            html += '    </div>';
                            html += '</div>';
                            //
                            html += '<br />';
                            //html += '<div class="codeSnippetContainer" id="code-snippet-4" xmlns="">';
                            //html += '    <div class="codeSnippetContainerTabs">';
                            //html += '        <div class="codeSnippetContainerTabSingle" dir="ltr"><a>&nbsp;&nbsp;Unclaimed Invitations&nbsp;&nbsp;</a></div>';
                            //html += '    </div>';
                            //html += '    <div class="codeSnippetContainerCodeContainer">';
                            //html += '        <div class="codeSnippetToolBar">';
                            //html += '            <div class="codeSnippetToolBarText">';
                            //html += '                <a name="CodeSnippetCopyLink" title="Copy to clipboard." style="display: none;" href="javascript:displayAlertDialog(\'Copy support is not yet implemented.\');">Copy</a>';
                            //html += '            </div>';
                            //html += '        </div>';
                            //html += '        <div class="codeSnippetContainerCode" id="CodeSnippetContainerCode_5207fb9c-60fd-402f-8729-5795651a5ad3" dir="ltr">';
                            //html += '            <div>';
                            //html += '                <span id="spanBwInvitations" style="font-size:x-small;">';
                            ////

                            ////
                            //html += '                </span>';
                            //html += '            </div>';
                            //html += '        </div>';
                            //html += '    </div>';
                            //html += '</div>';
                            ////
                            //html += '<br />';



                            //html += '<div class="codeSnippetContainer" id="code-snippet-4" xmlns="">';
                            //html += '<div class="codeSnippetContainerTabs">';
                            //html += '<div class="codeSnippetContainerTabSingle" dir="ltr">';
                            //html == '  <a>&nbsp;&nbsp;Invite a participant to your budget workflow by emailing them this link&nbsp;&nbsp;</a>';
                            //html += '</div>';
                            //html += '</div>';
                            //html += '<div class="codeSnippetContainerCodeContainer">';
                            //html += '    <div class="codeSnippetToolBar">';
                            //html += '        <div class="codeSnippetToolBarText">';
                            //html += '            <a name="CodeSnippetCopyLink" title="Copy to clipboard." style="display: none;" href="javascript:displayAlertDialog(\'Copy support is not yet implemented.\');">Copy</a>';
                            //html += '        </div>';
                            //html += '    </div>';
                            //html += '    <div class="codeSnippetContainerCode" id="CodeSnippetContainerCode_5207fb9c-60fd-402f-8729-5795651a5ad3" dir="ltr">';
                            //html += '        <div style="color:Black;"><pre>';
                            //html += '<span id="invitationLink"></span>';
                            //html += '           </pre>';
                            ////html += '<table style="width:100%;text-align:right;"><tr><td><button id="btnInviteNewParticipant" onclick="cmdInviteNewParticipant();" class="BwButton350">Generate a new invitation link</button></td></tr></table>';
                            //html += '               </div>';
                            //html += '                   </div>';
                            //html += '               </div>';
                            //html += '           </div>';




                            //
                            //html += '<span style="font-size:small;font-style:italic;">When a person accepts an invitation and logs in for the first time, they receive the lowest permissions role of "Participant". You will receive an email when they have joined, then you can come back here and use the "change role" button to increase their permissions.</span>';
                            //


                            //html += '<br />';
                            //html += '<input id="btnCreateRole2" onclick="displayAddANewPersonDialog();" type="button" value="Add a Person...">';
                            ////html += '<input id="btnCreateRole2" onclick="alert(\'why isnt this working!!!\');" type="button" value="Add a Person...">';

                            // *************************************************************************
                            // todd added 12-23-19 3-36pm ast may casuse issues keep an eye on this
                            //html += '<div id="divRolePickerDropDown2" style="display:none;height:300px;width:400px;border:1px solid #066b8b;background-color:white;position:absolute;z-index:10;">'; // Scrollable div wrapper for the role picker. // dark blue border. // position and z-index makes it show up on top and to not move the other elements around.

                            //html += '<div id="divParticipantSummaryDialog" style="display:none;height:600px;width:600px;border:1px solid #066b8b;background-color:white;position:absolute;z-index:10;"></div>'; // Scrollable div wrapper for the role picker. // dark blue border. // position and z-index makes it show up on top and to not move the other elements around.
                            //html += '<div style="height:100vh;"></div>'; // todd added 12-23-19 is this necessary? It may help the circle participant dialogs

                            html += '    </td>';
                            html += '  </tr>';

                            html += '</table>';

                            //debugger;

                            // Render the html. THIS WAY IS PREFERABLE COME BACK AND FIX SOMETIME

                            var html2 = '';
                            //debugger;
                            html2 += '&nbsp;<span style="color:gainsboro;" >' + result2.value[0].bwWorkflowId + ' (' + result2.value[0].bwRequestType + ')</span>';
                            html = html2 + html;

                            document.getElementById(elementId).innerHTML = html;




                            //var html = '';
                            //html += '[spanMasterRoleListForEditing_IdentificationText]';
                            //document.getElementById('spanMasterRoleListForEditing_IdentificationText').innerHTML = html;










                        } catch (e) {
                            //lpSpinner.Hide();
                            console.log('Exception in bwOrganizationEditor._create().xx.Get:1: ' + e.message + ', ' + e.stack);
                        }
                    }).fail(function (data) {
                        //lpSpinner.Hide();
                        debugger;
                        console.log('In xx.fail(): ' + JSON.stringify(data));
                        var msg;
                        if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                            msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                        } else {
                            msg = JSON.stringify(data);
                        }
                        alert('Exception in bwOrganizationEditor._create().xx.Get:2: ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                        console.log('Exception in bwOrganizationEditor._create().xx.Get:2: ' + JSON.stringify(data));
                        //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                        //var error = JSON.parse(data.responseText)["odata.error"];
                        //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
                    });



                },
                error: function (data, errorCode, errorMessage) {
                    //window.waitDialog.close();
                    //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
                    displayAlertDialog('Error in my.js.renderMasterRoleListForEditing(' + elementId + '):2:' + errorCode + ', ' + errorMessage);
                }
            });



        } catch (e) {
            console.log('Exception in renderMasterRoleListForEditing(' + elementId + '): ' + e.message + ', ' + e.stack);
        }
    },

    renderBwRoles: function (elementId) {
        try {
            // This can show up in a few places. On the "Configuration > Participants" page, in a modal dialog, etc.
            console.log('In renderBwRoles(' + elementId + ').');
            var thiz = this;

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            var html = '';
            html += '<table style="padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;" class="context-menu-bwroleseditor">';
            html += '  <tr>';
            html += '    <td>';
            //
            html += '<br />';
            html += '<div class="codeSnippetContainer" id="code-snippet-4" xmlns="">';
            html += '    <div class="codeSnippetContainerTabs">';
            html += '        <div class="codeSnippetContainerTabSingle" dir="ltr"><a>&nbsp;&nbsp;BwRole Roles&nbsp;&nbsp;</a></div>';
            html += '    </div>';
            html += '    <div class="codeSnippetContainerCodeContainer">';
            html += '        <div class="codeSnippetToolBar">';
            html += '            <div class="codeSnippetToolBarText">';
            html += '                <a name="CodeSnippetCopyLink" title="Copy to clipboard." style="display: none;" href="javascript:displayAlertDialog(\'Copy support is not yet implemented.\');">Copy</a>';
            html += '            </div>';
            html += '        </div>';
            html += '        <div class="codeSnippetContainerCode" id="CodeSnippetContainerCode_5207fb9c-60fd-402f-8729-5795651a5ad3" dir="ltr">';
            html += '            <div>';
            html += '                <span id="spanBwParticipantsConfiguration" style="font-size:x-small;">';

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
                url: this.options.operationUriPrefix + '_bw/bwrolesandworkflowadministrator', // Changed 1-16-2022 to include the ADMIN participant so we just have to make 1 call.   '_bw/bwroles',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: function (result) {

                    html += '<style>';
                    html += '.dataGridTable { border: 1px solid gainsboro; font-size:14px; font-family: "Helvetica Neue","Segoe UI",Helvetica,Verdana,sans-serif; }';
                    html += '.dataGridTable td { border-left: 0px; border-right: 1px solid gainsboro; }';
                    html += '.headerRow { background-color:white; color:gray;border-bottom:1px solid gainsboro; }';
                    html += '.headerRow td { border-bottom:1px solid gainsboro; padding-top:3px;padding-bottom:5px;padding-right:10px;padding-left:10px; }';
                    html += '.filterRow td { border-bottom:1px solid whitesmoke; padding-top:3px;padding-bottom:5px;padding-right:10px;padding-left:10px; }';
                    html += '.alternatingRowLight { background-color:white; }';
                    html += '.alternatingRowLight td { padding-top:3px;padding-bottom:5px;padding-right:10px;padding-left:10px; }';
                    html += '.alternatingRowLight:hover { background-color:lightgoldenrodyellow; }';
                    html += '.alternatingRowDark { background-color:whitesmoke; }';
                    html += '.alternatingRowDark td { padding-top:3px;padding-bottom:5px;padding-right:10px;padding-left:10px; }';
                    html += '.alternatingRowDark:hover { background-color:lightgoldenrodyellow; }'; // 
                    html += '.roleName { white-space:nowrap; }';
                    html += '</style>';

                    html += '<table class="dataGridTable">';
                    html += '  <tr class="headerRow">';
                    html += '    <td>Role Id</td>';
                    html += '    <td>Role Name</td>';
                    html += '    <td>Role Details</td>';
                    html += '    <td>Singleton</td>';
                    html += '    <td></td>';
                    html += '    <td></td>';
                    html += '  </tr>';
                    var tempHtml = '';
                    var alternatingRow = 'light'; // Use this to color the rows.
                    for (var i = 0; i < result.data.length; i++) {
                        if (result.data[i].RoleId == 'ADMIN') { // ADMIN ROLE

                            // 1-16-2022 We want to display the ADMIN here, so that the ADMIN role can be re-assigned.
                            if (result.ADMIN) {
                                if (alternatingRow == 'light') {
                                    html += '  <tr class="alternatingRowLight" style="cursor:pointer;" onclick="$(\'.bwCircleDialog2\').bwCircleDialog2(\'displayParticipantRoleMultiPickerInACircle\', true, \'\', \'' + result.ADMIN.participantId + '\', \'' + result.ADMIN.participantFriendlyName + '\', \'' + result.ADMIN.participantEmail + '\', \'' + result.ADMIN.participantLogonType + '\');" >';
                                    alternatingRow = 'dark';
                                } else {
                                    html += '  <tr class="alternatingRowLight" style="cursor:pointer;" onclick="$(\'.bwCircleDialog2\').bwCircleDialog2(\'displayParticipantRoleMultiPickerInACircle\', true, \'\', \'' + result.ADMIN.participantId + '\', \'' + result.ADMIN.participantFriendlyName + '\', \'' + result.ADMIN.participantEmail + '\', \'' + result.ADMIN.participantLogonType + '\');" >';
                                    alternatingRow = 'light';
                                }

                                html += '       <td class="roleId">' + result.data[i].RoleId + '</td>';
                                html += '       <td class="roleName">' + result.data[i].RoleName + '<br />' + result.ADMIN.participantFriendlyName + ' (' + result.ADMIN.participantEmail + ')</td>';
                                html += '       <td class="roleDetails">' + 'Only 1 person can be assigned this role.<br /><ul><li>This role has to approve all new requests before they continue through the approval process.</li><li>This role receives tasks when no one has been specified for a role in the organization.</li><li>This is the only role that can perform actions on behalf of other roles.</li></ul>' + '</td>';
                                html += '       <td class="roleSingleton">' + 'true' + '</td>';
                                html += '       <td><button class="BwSmallButton" onclick="$(\'.bwCoreComponent\').bwCoreComponent(\'reassignWorkflowAdministrator\', \'' + result.data[i].RoleId + '\', \'' + result.data[i].RoleName + '\', \'' + result.data[i].bwRoleId + '\');">Reassign ADMIN</button></td>';
                                html += '       <td></td>';
                                html += '</tr>';

                            } else {
                                displayAlertDialog('ERROR: ADMIN missing from resultset. xcx123425: ' + result.errormessage);

                                if (alternatingRow == 'light') {
                                    html += '  <tr class="alternatingRowLight" style="cursor:pointer;"  >';
                                    alternatingRow = 'dark';
                                } else {
                                    html += '  <tr class="alternatingRowLight" style="cursor:pointer;"  >';
                                    alternatingRow = 'light';
                                }

                                html += '       <td class="roleId">' + 'ADMIN' + '</td>';
                                html += '       <td class="roleName">' + 'Workflow Administrator' + '<br />' + '' + ' (' + '' + ')</td>';
                                html += '       <td class="roleDetails">' + 'Only 1 person can be assigned this role.<br /><ul><li>This role has to approve all new requests before they continue through the approval process.</li><li>This role receives tasks when no one has been specified for a role in the organization.</li><li>This is the only role that can perform actions on behalf of other roles.</li></ul>' + '</td>';
                                html += '       <td class="roleSingleton">' + 'true' + '</td>';
                                html += '       <td><button class="BwSmallButton" onclick="$(\'.bwCoreComponent\').bwCoreComponent(\'reassignWorkflowAdministrator\', \'' + 'ADMIN' + '\', \'' + 'Workflow Administrator' + '\', \'' + 'ADMIN' + '\');">Reassign ADMIN</button></td>';
                                html += '       <td></td>';
                                html += '</tr>';
                            }

                            //html += '       <td class="roleId">' + result.data[i].RoleId + '</td>';
                            //html += '       <td class="roleName">' + result.data[i].RoleName + '<br />' + result.ADMIN.participantFriendlyName + ' (' + result.ADMIN.participantEmail + ')</td>';
                            //html += '       <td class="roleDetails">' + 'Only 1 person can be assigned this rolexcx3.<br /><ul><li>This role has to approve all new requests before they continue through the approval process.</li><li>This role receives tasks when no one has been specified for a role in the organization.</li><li>This is the only role that can perform actions on behalf of other roles.</li></ul>' + '</td>';
                            //html += '       <td class="roleSingleton">' + 'true' + '</td>';
                            //html += '       <td><button class="BwSmallButton" onclick="$(\'.bwCoreComponent\').bwCoreComponent(\'reassignWorkflowAdministrator\', \'' + result.data[i].RoleId + '\', \'' + result.data[i].RoleName + '\', \'' + result.data[i].bwRoleId + '\');">Reassign ADMIN</button></td>';
                            //html += '       <td></td>';
                            //html += '</tr>';
                        } else {
                            if (alternatingRow == 'light') {
                                tempHtml += '  <tr class="alternatingRowLight" style="cursor:pointer;" >';
                                alternatingRow = 'dark';
                            } else {
                                tempHtml += '  <tr class="alternatingRowDark" style="cursor:pointer;" >';
                                alternatingRow = 'light';
                            }
                            tempHtml += '       <td class="roleId">' + result.data[i].RoleId + '</td>';
                            tempHtml += '       <td class="roleName">' + result.data[i].RoleName + '</td>';
                            tempHtml += '       <td class="roleDetails">' + '' + '</td>';
                            tempHtml += '       <td class="roleSingleton">' + result.data[i].Singleton + '</td>';
                            tempHtml += '    <td><button class="BwSmallButton" onclick="$(\'.bwCoreComponent\').bwCoreComponent(\'displayEditARoleDialog\', \'' + result.data[i].RoleId + '\', \'' + result.data[i].RoleName + '\', \'' + result.data[i].bwRoleId + '\');">Edit Role</button></td>';
                            tempHtml += '    <td><img src="images/trash-can.png" onclick="$(\'.bwCoreComponent\').bwCoreComponent(\'displayDeleteARoleDialog\', \'' + result.data[i].RoleId + '\', \'' + result.data[i].RoleName + '\', \'' + result.data[i].bwRoleId + '\');" title="Delete" style="cursor:pointer;" /></td>';
                            tempHtml += '</tr>';
                        }
                    }
                    html += tempHtml; // this is done just to make sure the 'ADMIN' role appears at the top of the list, and has the detailed description.
                    html += '</table>';

                    html += '<br />';
                    html += '<input style="padding:5px 10px 5px 10px;" id="btnCreateRole2" onclick="$(\'.bwCoreComponent\').bwCoreComponent(\'displayCreateANewRoleDialog\');" type="button" value="Add a Role...">'; // $('.bwCoreComponent').bwCoreComponent('displayCreateANewRoleDialog');
                    html += '                </span>';
                    html += '            </div>';
                    html += '        </div>';
                    html += '    </div>';
                    html += '</div>';
                    html += '<br />';
                    html += '    </td>';
                    html += '  </tr>';
                    html += '</table>';

                    html += '<div id="divBwOrganizationEditor2" style="display:none;"></div>'; // This is not the right way to do this! It currently means the whole thing gets rendered invisibly.... need to move this part of the architecture around somehow in the future.

                    // Render the html. 
                    document.getElementById(elementId).innerHTML = html;

                    //
                    // This is our right-click context menu. MIT license and code at: https://swisnl.github.io/jQuery-contextMenu/demo/trigger-custom.html
                    $.contextMenu({
                        selector: '.context-menu-bwroleseditor',
                        callback: function (key, options) {
                            try {

                                //var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

                                //var m = "clicked: " + key;
                                //window.console && console.log(m) || alert(m);
                                if (key == 'runrolediagnostics') {
                                    $('.bwCoreComponent').bwCoreComponent('displayEditRolesDialog');
                                } else if (key == 'runuserrolediagnostics') {

                                    //debugger;
                                    //var options = {
                                    //    displayWorkflowPicker: true,
                                    //    //bwTenantId: tenantId,
                                    //    bwWorkflowAppId: workflowAppId,
                                    //    bwEnabledRequestTypes: bwEnabledRequestTypes
                                    //};
                                    //var $bworgroleseditor = $("#divBwOrganizationEditor2").bwOrganizationEditor(options); // This is not the right way to do this! It currently means the whole thing gets rendered invisibly.... need to move this part of the architecture around somehow in the future.

                                    //setTimeout(function () { $('.bwOrganizationEditor').bwOrganizationEditor('downloadOrganizationJson'); }, 500);
                                    $('.bwOrganizationEditor').bwOrganizationEditor('downloadOrganizationJson');

                                    //thiz.downloadOrganizationJson();
                                } else if (key == 'backfillrolesfromorgandworkflowjson') {



                                    thiz.createBackfillRolesArrayFromOrgAndWorkflowsJson();


                                }
                            } catch (e) {
                                console.log('Exception in context-menu-bwroleseditor.callback(): ' + e.message + ', ' + e.stack);
                            }
                        },
                        items: {
                            "runrolediagnostics": { name: "Run Role Diagnostics", icon: "edit" },
                            "runuserrolediagnostics": { name: "Run User-Role Diagnostics", icon: "edit" },
                            "backfillrolesfromorgandworkflowjson": { name: "Backfill roles from Org and Workflow(s) json...", icon: "edit" }
                            //"downloadjson": { name: "Organization Roles Diagnostics", icon: "edit" },
                            //"viewtrashbincontents": { name: "View Trashbin contents", icon: "fa-trash" }//, // images/trash-can.png  // 🗑
                            //"viewextendedinformation": { name: "View Extended information", icon: "edit" }
                            //copy: { name: "Copy", icon: "copy" },
                            //"paste": { name: "Paste", icon: "paste" },
                            //"delete": { name: "Delete", icon: "delete" },
                            //"sep1": "---------",
                            //"quit": {
                            //    name: "Quit", icon: function () {
                            //        return 'context-menu-icon context-menu-icon-quit';
                            //    }
                            //}
                        }
                    });
                    // End: This is our right-click context menu.
                    //

                },
                error: function (data, errorCode, errorMessage) {
                    //window.waitDialog.close();
                    //handleExceptionWithAlert('Error in index.js.cmdCreateANewTenant()', errorCode + ', ' + errorMessage);
                    displayAlertDialog('Error in renderBwRoles(' + elementId + '):2:' + errorCode + ', ' + errorMessage);
                }
            });
        } catch (e) {
            console.log('Exception in renderBwRoles(' + elementId + '): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in renderBwRoles(' + elementId + '): ' + e.message + ', ' + e.stack);
        }
    },

    createBackfillRolesArrayFromOrgAndWorkflowsJson: function () {
        try {
            console.log('In createBackfillRolesArrayFromOrgAndWorkflowsJson().');
            // This does just what it says. 
            var thiz = this;

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            var json = {
                //bwTenantId: tenantId, //this.options.bwTenantId,
                bwWorkflowAppId: workflowAppId //this.options.bwWorkflowAppId//,
                //Created: String,
                //CreatedById: participantId,
                //CreatedByFriendlyName: participantFriendlyName,
                //CreatedByEmail: participantEmail
            };
            $.ajax({
                url: this.options.operationUriPrefix + "_bw/backfillroles1",
                contentType: "application/json",
                type: "Post",
                data: JSON.stringify(json)
            }).done(function (result) {
                try {

                    if (result.message != 'SUCCESS') {
                        alert(result.message);
                    } else {
                        var html = '';
                        html += '<br />';
                        html += '<table class="dataGridTable">';
                        html += '  <tr class="headerRow">';
                        html += '    <td>Role Id</td>';
                        html += '    <td>Role Name</td>';
                        html += '  </tr>';
                        var alternatingRow = 'light'; // Use this to color the rows.
                        for (var i = 0; i < result.Roles.length; i++) {
                            if (alternatingRow == 'light') {
                                html += '  <tr class="alternatingRowLight" style="cursor:pointer;" >';
                                alternatingRow = 'dark';
                            } else {
                                html += '  <tr class="alternatingRowDark" style="cursor:pointer;" >';
                                alternatingRow = 'light';
                            }
                            html += '       <td class="roleId">' + result.Roles[i].RoleId + '</td>';
                            html += '       <td class="roleName">' + result.Roles[i].RoleName + '</td>';
                            html += '</tr>';
                        }
                        html += '</table>';
                        //html += '<br /><br />';
                        thiz.options.temporaryConcurrencyStorageArea = result.Roles; // The next method will look here to make sure the concurrency is Ok.
                        html += '<span style="text-align:center;"><input style="height:30pt;" onclick="$(\'.bwCoreComponent\').bwCoreComponent(\'confirmBackfillRolesArrayFromOrgAndWorkflowsJson\');" type="button" value="Backfill the roles now!"></span>';

                        document.getElementById('spanBackfillRolesConfirmationDialogContent').innerHTML = html;

                        // divBackfillRolesConfirmationDialog // spanBackfillRolesConfirmationDialogDescriptionText // spanBackfillRolesConfirmationDialogContent
                        $("#divBackfillRolesConfirmationDialog").dialog({
                            modal: true,
                            resizable: false,
                            closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                            width: '800',
                            height: '1000',
                            dialogClass: "no-close", // No close button in the upper right corner.
                            hide: false, // This means when hiding just disappear with no effects.
                            open: function () {
                                //$('.ui-widget-overlay').bind('click', function () {
                                //    $("#divBackfillRolesConfirmationDialog").dialog('close');
                                //});
                            }//,
                            //close: function () {
                            //    //$(this).dialog('destroy').remove();
                            //}
                        });
                        //$("#divBackfillRolesConfirmationDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
                    }

                } catch (e) {
                    console.log('Exception in bwCoreComponent.createBackfillRolesArrayFromOrgAndWorkflowsJson(): ' + e.message + ', ' + e.stack);
                }
            }).fail(function (data) {
                var msg;
                if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                    msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                } else {
                    msg = JSON.stringify(data) + ', json: ' + JSON.stringify(json);
                }
                alert('Fail in bwCoreComponent.createBackfillRolesArrayFromOrgAndWorkflowsJson(): ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                console.log('Fail in bwCoreComponent.createBackfillRolesArrayFromOrgAndWorkflowsJson(): ' + JSON.stringify(data) + ', json: ' + JSON.stringify(json));
                //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                //var error = JSON.parse(data.responseText)["odata.error"];
                //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
            });
        } catch (e) {
            console.log('Exception in createBackfillRolesArrayFromOrgAndWorkflowsJson():  ' + e.message + ', ' + e.stack);
        }
    },
    confirmBackfillRolesArrayFromOrgAndWorkflowsJson: function () {
        try {
            var confirmRoles = this.options.temporaryConcurrencyStorageArea;
            console.log('In confirmBackfillRolesArrayFromOrgAndWorkflowsJson(). confirmRoles: ' + confirmRoles);
            // This does just what it says. 
            var thiz = this;

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            alert('In bwCoreComponent.js.confirmBackfillRolesArrayFromOrgAndWorkflowsJson(). THIS FUNCTIONALITY HAS BEEN COMMENTED OUT UNTIL IT HAS BEEN TESTED FURTHER. 12-29-2021');

            //var json = {
            //    bwWorkflowAppId: workflowAppId, 
            //    confirmRoles: confirmRoles
            //    //Created: String,
            //    //CreatedById: participantId,
            //    //CreatedByFriendlyName: participantFriendlyName,
            //    //CreatedByEmail: participantEmail
            //};
            //$.ajax({
            //    url: this.options.operationUriPrefix + "_bw/backfillroles2",
            //    contentType: "application/json",
            //    type: "Post",
            //    data: JSON.stringify(json)
            //}).done(function (result) {
            //    try {
            //        thiz.options.temporaryConcurrencyStorageArea = null; // Clear this out.
            //        if (result.message == 'SUCCESS') {
            //            thiz.displayAlertDialog(result.message);
            //        } else {
            //            thiz.displayAlertDialog(result.message);
            //        }
            //    } catch (e) {
            //        console.log('Exception in bwCoreComponent.confirmBackfillRolesArrayFromOrgAndWorkflowsJson(): ' + e.message + ', ' + e.stack);
            //    }
            //}).fail(function (data) {
            //    var msg;
            //    if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
            //        msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
            //    } else {
            //        msg = JSON.stringify(data) + ', json: ' + JSON.stringify(json);
            //    }
            //    alert('Fail in bwCoreComponent.confirmBackfillRolesArrayFromOrgAndWorkflowsJson(): ' + msg); //+ error.message.value + ' ' + error.innererror.message);
            //    console.log('Fail in bwCoreComponent.confirmBackfillRolesArrayFromOrgAndWorkflowsJson(): ' + JSON.stringify(data) + ', json: ' + JSON.stringify(json));
            //    //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
            //    //var error = JSON.parse(data.responseText)["odata.error"];
            //    //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
            //});
        } catch (e) {
            console.log('Exception in confirmBackfillRolesArrayFromOrgAndWorkflowsJson():  ' + e.message + ', ' + e.stack);
        }
    },

    editBwRole: function () {
        try {
            console.log('In editBwRole().');
            var thiz = this;

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            //var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
            //var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

            var tmpOldBwRole = document.getElementById('spanOldBwRole').innerHTML;
            var oldRoleId = tmpOldBwRole.split(':')[0];
            var oldRoleName = tmpOldBwRole.split(':')[1].trim();
            console.log('In editBwRole(). oldRoleId: ' + oldRoleId + ', oldRoleName: ' + oldRoleName);

            var bwRoleId = document.getElementById('txtEditRoleDialog_bwRoleId').value;
            var newRoleId = document.getElementById('txtEditRoleDialog_RoleId').value;
            var newRoleName = document.getElementById('txtEditRoleDialog_RoleName').value;
            var newSingleton = document.getElementById('txtEditRoleDialog_Singleton').checked;
            if (newRoleId && newRoleName) {
                // Make sure the RoleId is 2 or more charcaters. Make sure the RoleName is longer than 5 characters.
                if (newRoleId.length > 1 && newRoleName.length > 4) {
                    //alert('We need to build in the logic to update the org json, and the workflow(s) json roles in the web service method: _bw/editbwrole.');

                    var data = {
                        bwParticipantId_LoggedIn: participantId,
                        bwActiveStateIdentifier: activeStateIdentifier,
                        bwWorkflowAppId_LoggedIn: workflowAppId,

                        bwRoleId: bwRoleId,
                        bwTenantId: tenantId, //this.options.bwTenantId,
                        bwWorkflowAppId: workflowAppId, //this.options.bwWorkflowAppId,
                        OldRoleId: oldRoleId,
                        OldRoleName: oldRoleName,
                        NewRoleId: newRoleId,
                        NewRoleName: newRoleName,
                        Singleton: newSingleton, // For instance, the CEO can only belong at the root of the organization, so in his/her case, this would be true
                        RoleBits: 17,
                        //bwRoleActive: true // Checking for this value on the server side in order to reactive an existing role, and handle the cleanup type of logic. Mostly though, will just create a new entry and mark it as active on the server side..
                        ModifiedById: participantId,
                        ModifiedByFriendlyName: participantFriendlyName,
                        ModifiedByEmail: participantEmail
                    };
                    $.ajax({
                        url: this.options.operationUriPrefix + '_bw/editbwrole',
                        contentType: "application/json",
                        type: 'POST',
                        data: JSON.stringify(data),
                        success: function (result) {
                            try {

                                $("#divEditRoleDialog").dialog('close');
                                if (result.message == 'SUCCESS') {
                                    thiz.renderBwRoles('spanConfigurationParticipantsBwRoleEditor');
                                    thiz.displayAlertDialog('This role has been updated. ' + oldRoleId + ': "' + oldRoleName + '". roleUpdatedMessage: ' + result.roleUpdatedMessage);
                                } else {
                                    thiz.displayAlertDialog(result.message);
                                }

                            } catch (e) {
                                console.log('Exception in bwCoreComponent.js.editBwRole(): ' + e.message + ', ' + e.stack);
                                displayAlertDialog('Exception in bwCoreComponent.js.editBwRole(): ' + e.message + ', ' + e.stack);
                            }
                        },
                        error: function (data, errorCode, errorMessage) {

                            var msg = 'Error in bwCoreComponent.js.editBwRole(): ' + errorCode + ', ' + errorMessage + ', data: ' + JSON.stringify(data);
                            console.log(msg);
                            displayAlertDialog(msg);

                        }
                    });

                } else {

                    alert('ERROR: Cannot save these values. RoleId must be 2 or more characters, and RoleName must be 5 or more charcters.');

                }

            } else {

                alert('ERROR: Cannot save these values. RoleId must be 2 or more characters, and RoleName must be 5 or more charcters.');

            }

        } catch (e) {
            console.log('Exception in bwCoreComponent.editBwRole(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwCoreComponent.editBwRole(): ' + e.message + ', ' + e.stack);
        }
    },

    deleteBwRole: function () {
        try {
            console.log('In deleteBwRole().');
            var thiz = this;

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');
            var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');

            var bwRoleId = document.getElementById('txtDeleteRoleDialog_bwRoleId').value;
            var roleId = document.getElementById('txtDeleteRoleDialog_RoleId').value;
            var roleName = document.getElementById('txtDeleteRoleDialog_RoleName').value;

            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');
            debugger;
            //var singleton = document.getElementById('txtDeleteRoleDialog_Singleton').checked;
            var data = {
                bwParticipantId_LoggedIn: participantId,
                bwActiveStateIdentifier: activeStateIdentifier,
                bwWorkflowAppId_LoggedIn: workflowAppId,

                bwRoleId: bwRoleId,
                bwWorkflowAppId: workflowAppId,
                RoleId: roleId,
                RoleName: roleName,
                ModifiedById: participantId,
                ModifiedByFriendlyName: participantFriendlyName,
                ModifiedByEmail: participantEmail
            };
            $.ajax({
                url: this.options.operationUriPrefix + "_bw/deletebwrole1",
                type: "POST",
                data: data,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (result) {
                    try {
                        debugger;
                        if (result.status != 'SUCCESS') {

                            $('#divDeleteRoleDialog').dialog('close');
                            displayAlertDialog(result.message);

                        } else {

                            $('#divDeleteRoleDialog').dialog('close');
                            thiz.renderBwRoles('divBwRolesEditor'); // THIS DISPLAYS the roles that are in the JSON org definition.

                            displayAlertDialog(result.message);

                        }
                    } catch (e) {
                        console.log('Exception in bwCoreComponent.deleteBwRole(): ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwCoreComponent.deleteBwRole(): ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data) {
                    var msg = 'In bwCoreComponent.js.deleteBwRole.error(). ' + JSON.stringify(data);
                    console.log(msg);
                    displayAlertDialog(msg);
                    alert(msg);

                }
            });
        } catch (e) {
            console.log('Exception in bwCoreComponent.deleteBwRole(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwCoreComponent.deleteBwRole(): ' + e.message + ', ' + e.stack);
        }
    },
    deleteBwRoleConfirmed: function () {
        try {
            var deleteConfirmationMessage = this.options.temporaryConcurrencyStorageArea;
            console.log('In deleteBwRoleConfirmed(). deleteConfirmationMessage: ' + deleteConfirmationMessage);
            // This does just what it says. 
            var thiz = this;
            var bwRoleId = document.getElementById('txtDeleteRoleDialog_bwRoleId').value;
            var roleId = document.getElementById('txtDeleteRoleDialog_RoleId').value;
            var roleName = document.getElementById('txtDeleteRoleDialog_RoleName').value;
            var json = {
                bwRoleId: bwRoleId,
                bwTenantId: tenantId, //this.options.bwTenantId,
                bwWorkflowAppId: workflowAppId, //this.options.bwWorkflowAppId,
                RoleId: roleId,
                RoleName: roleName,
                deleteConfirmationMessage: deleteConfirmationMessage
                //Created: String,
                //CreatedById: participantId,
                //CreatedByFriendlyName: participantFriendlyName,
                //CreatedByEmail: participantEmail
            };
            $.ajax({
                url: this.options.operationUriPrefix + "_bw/deletebwrole2",
                contentType: "application/json",
                type: "Post",
                data: JSON.stringify(json)
            }).done(function (result) {
                try {
                    thiz.options.temporaryConcurrencyStorageArea = null; // Clear this out.
                    if (result.message == 'SUCCESS') {
                        $("#divDeleteRoleDialog").dialog('close');
                        thiz.renderBwRoles('spanConfigurationParticipantsBwRoleEditor');
                        thiz.displayAlertDialog('The role has been deleted.');


                    } else {
                        thiz.displayAlertDialog(result.message);
                    }
                } catch (e) {
                    console.log('Exception in bwCoreComponent.deleteBwRoleConfirmed(): ' + e.message + ', ' + e.stack);
                }
            }).fail(function (data) {
                var msg;
                if (JSON.stringify(data).indexOf('The specified URL cannot be found.') > -1) {
                    msg = 'There has been an error contacting the server. A firewall or network appliance may be interrupting this traffic.';
                } else {
                    msg = JSON.stringify(data) + ', json: ' + JSON.stringify(json);
                }
                alert('Fail in bwCoreComponent.deleteBwRoleConfirmed(): ' + msg); //+ error.message.value + ' ' + error.innererror.message);
                console.log('Fail in bwCoreComponent.deleteBwRoleConfirmed(): ' + JSON.stringify(data) + ', json: ' + JSON.stringify(json));
                //console.log('Fail in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + JSON.stringify(data));
                //var error = JSON.parse(data.responseText)["odata.error"];
                //alert('Exception in CarForm3.aspx.populateSpendForecastNotReadOnly().spendForecastItems.update: ' + error.message.value + ' ' + error.innererror.message); // + ', EntityValidationErrors: ' + data.EntityValidationErrors);
            });
        } catch (e) {
            console.log('Exception in bwCoreComponent.deleteBwRoleConfirmed(): ' + e.message + ', ' + e.stack);
        }
    },

    displayEditARoleDialog: function (roleId, roleName, bwRoleId) {
        try {
            console.log('In bwCoreComponent.displayEditARoleDialog().');
            //debugger;
            $("#divEditRoleDialog").dialog({
                modal: true,
                resizable: false,
                //closeText: "Cancel",
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                //title: 'Create a new Role',
                width: '800',
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {
                    $('.ui-widget-overlay').bind('click', function () {
                        $("#divEditRoleDialog").dialog('close');
                    });

                    document.getElementById('txtEditRoleDialog_bwRoleId').value = bwRoleId;
                    document.getElementById('txtEditRoleDialog_RoleId').value = roleId;
                    document.getElementById('txtEditRoleDialog_RoleName').value = roleName;

                    var html = roleId + ': ' + roleName;
                    document.getElementById('spanOldBwRole').innerHTML = html;
                    //document.getElementById('txtCreateANewRoleDialog_RoleId').value = document.getElementById('textNewRoleId').value;
                    //document.getElementById('txtCreateANewRoleDialog_RoleName').value = document.getElementById('textNewRoleName').value;
                },
                close: function () {
                    //$(this).dialog('destroy').remove();
                }
            });
            //$("#divCreateANewRoleDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
        } catch (e) {
            console.log('Exception in bwCoreComponent.displayEditARoleDialog(): ' + e.message + ', ' + e.stack);
        }
    },

    reassignWorkflowAdministrator: function (roleId, roleName, bwRoleId) {
        try {
            console.log('In bwCoreComponent.js.reassignWorkflowAdministrator().');

            //this.displayAlertDialog('In bwCoreComponent.reassignWorkflowAdministrator(). This functionality is incomplete. Coming soon!');

            //debugger;
            $("#divReassignWorkflowAdministratorRoleDialog").dialog({
                modal: true,
                resizable: false,
                //closeText: "Cancel",
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                //title: 'Create a new Role',
                width: '800',
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {
                    try {
                        $('.ui-widget-overlay').bind('click', function () {
                            $("#divReassignWorkflowAdministratorRoleDialog").dialog('close');
                        });

                        document.getElementById('txtEditRoleDialog_bwRoleId').value = bwRoleId;
                        document.getElementById('txtEditRoleDialog_RoleId').value = roleId;
                        document.getElementById('txtEditRoleDialog_RoleName').value = roleName;

                        var html = roleId + ': ' + roleName;
                        document.getElementById('spanOldBwRole').innerHTML = html;
                        //document.getElementById('txtCreateANewRoleDialog_RoleId').value = document.getElementById('textNewRoleId').value;
                        //document.getElementById('txtCreateANewRoleDialog_RoleName').value = document.getElementById('textNewRoleName').value;





                    } catch (e) {
                        console.log('Exception in bwCoreComponent.reassignWorkflowAdministrator():2: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwCoreComponent.reassignWorkflowAdministrator():2: ' + e.message + ', ' + e.stack);
                    }
                },
                close: function () {
                    //$(this).dialog('destroy').remove();
                }
            });
            $("#divReassignWorkflowAdministratorRoleDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();


            // displayPeoplePickerDialog: function (friendlyNameSourceField, idSourceField, emailSourceField, buttonToEnable) {
            $('.bwCoreComponent').bwCoreComponent('displayPeoplePickerDialog', 'txtReassignWorkflowAdministratorRoleDialog_ParticipantFriendlyName', 'txtReassignWorkflowAdministratorRoleDialog_ParticipantId', 'txtReassignWorkflowAdministratorRoleDialog_ParticipantEmail', 'buttonReassignWorkflowAdministratorRoleDialog_SaveUpdateADMINRole');








        } catch (e) {
            console.log('Exception in bwCoreComponent.reassignWorkflowAdministrator(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwCoreComponent.reassignWorkflowAdministrator(): ' + e.message + ', ' + e.stack);
        }
    },

    displayDeleteARoleDialog: function (roleId, roleName, bwRoleId) {
        try {
            console.log('In bwCoreComponent.displayDeleteARoleDialog().');
            //debugger;
            $("#divDeleteRoleDialog").dialog({
                modal: true,
                resizable: false,
                //closeText: "Cancel",
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                //title: 'Create a new Role',
                width: '800',
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {
                    $('.ui-widget-overlay').bind('click', function () {
                        $("#divDeleteRoleDialog").dialog('close');
                    });

                    document.getElementById('txtDeleteRoleDialog_bwRoleId').value = bwRoleId;
                    document.getElementById('txtDeleteRoleDialog_RoleId').value = roleId;
                    document.getElementById('txtDeleteRoleDialog_RoleName').value = roleName;

                    //var html = roleId + ': ' + roleName;
                    //document.getElementById('spanOldBwRole').innerHTML = html;
                    //document.getElementById('txtCreateANewRoleDialog_RoleId').value = document.getElementById('textNewRoleId').value;
                    //document.getElementById('txtCreateANewRoleDialog_RoleName').value = document.getElementById('textNewRoleName').value;

                    // reset these elements
                    document.getElementById('spanDeleteRoleDialogConfirmationText').innerHTML = '';
                    html = '<input style="height:30pt;" onclick="$(\'.bwCoreComponent\').bwCoreComponent(\'deleteBwRole\');" type="button" value="Delete role">';
                    document.getElementById('spanDeleteRoleDialog_BottomButton').innerHTML = html;

                }//,
                //close: function () {
                //    //$(this).dialog('destroy').remove();
                //}
            });
            //$("#divCreateANewRoleDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
        } catch (e) {
            console.log('Exception in bwCoreComponent.displayDeleteARoleDialog(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwCoreComponent.displayDeleteARoleDialog(): ' + e.message + ', ' + e.stack);
        }
    },

    createANewRole: function () {
        try {
            console.log('In bwCoreComponent.js.createANewRole().');
            // Make sure the RoleId is 2 or more charcaters. Make sure the RoleName is longer than 5 characters.
            var thiz = this;
            var roleId = document.getElementById('txtCreateANewRoleDialog_RoleId').value;
            var roleName = document.getElementById('txtCreateANewRoleDialog_RoleName').value;
            var singleton = document.getElementById('txtCreateANewRoleDialog_Singleton').checked;
            if (roleId && roleName) {
                if (roleId.length > 1 && roleName.length > 4) {

                    // Create a new role in the organization.
                    var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
                    var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
                    var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

                    var data = {
                        bwParticipantId_LoggedIn: participantId,
                        bwActiveStateIdentifier: activeStateIdentifier,
                        bwWorkflowAppId_LoggedIn: workflowAppId,

                        bwWorkflowAppId: workflowAppId,
                        //Created: String,
                        CreatedById: participantId,
                        CreatedByFriendlyName: participantFriendlyName,
                        CreatedByEmail: participantEmail,
                        RoleId: roleId,
                        RoleName: roleName,
                        Singleton: singleton, // For instance, the CEO can only belong at the root of the organization, so in his/her case, this would be true
                        RoleBits: 17//,
                        //bwRoleActive: true // Checking for this value on the server side in order to reactive an existing role, and handle the cleanup type of logic. Mostly though, will just create a new entry and mark it as active on the server side..
                    };
                    $.ajax({
                        url: this.options.operationUriPrefix + "_bw/addbwrole",
                        type: "POST",
                        data: data,
                        headers: {
                            "Accept": "application/json; odata=verbose"
                        },
                        success: function (result) {
                            try {

                                $("#divCreateANewRoleDialog").dialog('close');
                                if (result.status == 'SUCCESS') {

                                    thiz.renderBwRoles('divBwRolesEditor'); // Redisplay to include the newly created role.
                                    thiz.displayAlertDialog('This role has been created. ' + roleId + ': "' + roleName + '"');

                                } else {

                                    thiz.displayAlertDialog(result.message);

                                }

                            } catch (e) {
                                console.log('Exception in bwCoreComponent.createANewRole.success(): ' + e.message + ', ' + e.stack);
                                displayAlertDialog('Exception in bwCoreComponent.createANewRole.success(): ' + e.message + ', ' + e.stack);
                            }
                        },
                        error: function (data) {
                            try {
                                var msg = 'In bwCoreComponent.createANewRole.error(). ' + JSON.stringify(data);
                                alert(msg);
                                console.log(mag);
                            } catch (e) {
                                console.log('Exception in bwCoreComponent.createANewRole.error(): ' + e.message + ', ' + e.stack);
                                displayAlertDialog('Exception in bwCoreComponent.createANewRole.error(): ' + e.message + ', ' + e.stack);
                            }
                        }
                    });
                } else {
                    alert('ERROR: Cannot save these values. RoleId must be 2 or more characters, and RoleName must be 5 or more charcters.');
                }
            } else {
                alert('ERROR: Cannot save these values. RoleId must be 2 or more characters, and RoleName must be 5 or more charcters.');
            }
        } catch (e) {
            console.log('Exception in bwCoreComponent.createANewRole(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwCoreComponent.createANewRole(): ' + e.message + ', ' + e.stack);
        }
    },



    uploadAttachment_IdentifyingImage: function (displayAttachmentsTagName, identityType, parm1, parm2, parm3) { // identityType: ['participant', 'org']
        try {
            console.log('In bwCoreComponent.js.uploadAttachment_IdentifyingImage().');

            console.log('xxxxxxxxxxxxxxxxxxxxxxxx23453578');
            //alert('xxxxxxxxxxxxxxxxxxxxxxxx23453578');
            //HideActivitySpinner();

            //ShowActivitySpinner_FileUpload();

            debugger;
            if (identityType == 'participant') {
                // The user is uploading a participant image.
                var identityJson = {
                    bwParticipantId: parm1,
                    bwParticipantFriendlyName: parm2,
                    bwParticipantEmail: parm3
                };

            } else {
                // The user must be uploading an org image.
                var identityJson = {
                    bwOrgId: parm1,
                    bwOrgName: parm2,
                    bwOrgPath: parm3
                };


            }



            //debugger;
            //var _budgetRequestId = this.options.bwBudgetRequestId; // document.getElementById('BudgetRequestId').innerHTML; //$('span[xd\\:binding = "my:BudgetRequestId"]')[0].innerHTML;

            //displayAlertDialog('uploadAttachment() _budgetRequestId: ' + _budgetRequestId);
            var x = document.getElementById('inputFile_ForIdentifyingImage');
            var file = x.files[0];
            if (file.size > 100000000) {
                // Don't allow files over 5MB.
                displayAlertDialog('Currently the system does not allow files over 100MB.');
                $('#inputFile_ForIdentifyingImage').replaceWith($('#inputFile_ForIdentifyingImage').clone()); // Clear the file upload box. May not work in all browsers doing it this way.
            } else {
                //HideActivitySpinner();
                this.cmdDisplayConfirmFileUploadDialog_ForIdentifyingImage(displayAttachmentsTagName, identityType, identityJson); // identityType: ['participant', 'org']
                //displayAlertDialog('In uploadAttachment(). Result: ' + upload);

                //var upload = confirm("Click OK to upload the file...");
                //if (upload) {
                //    $("#divWorkingOnItDialog").dialog({
                //        modal: true,
                //        resizable: false,
                //        //closeText: "Cancel",
                //        closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                //        title: 'Working on it...',
                //        width: "360",
                //        dialogClass: "no-close", // No close button in the upper right corner.
                //        hide: false//, // This means when hiding just disappear with no effects.
                //        //buttons: {
                //        //    "Close": function () {
                //        //        $(this).dialog("close");
                //        //    }
                //        //}
                //    });
                //    $("#divWorkingOnItDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

                //    ProcessUpload(displayAttachmentsTagName, _budgetRequestId);
                //} else {
                //    $('#inputFile').replaceWith($('#inputFile').clone()); // Clear the file upload box. May not work in all browsers doing it this way.
                //    //populateAttachments();
                //}
            }
        } catch (e) {
            displayAlertDialog('Error in bwCoreComponent.js.uploadAttachment_IdentifyingImage(' + displayAttachmentsTagName + '): ' + e.message);
            HideActivitySpinner();
        }
        // TODD: MAY HAVE TO ADD THIS LATER!!!!
        //// Ensure the HTML5 FileReader API is supported
        //if (window.FileReader) {
        //    var parts = document.getElementById("inputFile").value.split("\\");
        //    var filename = parts[parts.length - 1];
        //    file = document.getElementById("inputFile").files[0];
        //    //BW.Jsom.Libs.upload("Documents", filename, file);

        //    var fr = new FileReader();
        //    fr.onload = receivedBinary;
        //    fr.readAsDataURL(file);

        //} else {
        //    displayAlertDialog("The HTML5 FileSystem APIs are not fully supported in this browser.");
        //}

    },

    uploadAttachment_IdentifyingImage_Blur: function () { // identityType: ['participant', 'org']
        try {
            console.log('In uploadAttachment_IdentifyingImage_Blur().');

            HideActivitySpinner();

        } catch (e) {
            console.log('Error in uploadAttachment_IdentifyingImage_Blur(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Error in uploadAttachment_IdentifyingImage_Blur(): ' + e.message + ', ' + e.stack);
            HideActivitySpinner();
        }

    },
    uploadAttachment_IdentifyingImage_Focus: function () { // identityType: ['participant', 'org']
        try {
            console.log('In uploadAttachment_IdentifyingImage_Focus().');

            HideActivitySpinner();

        } catch (e) {
            console.log('Error in uploadAttachment_IdentifyingImage_Focus(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Error in uploadAttachment_IdentifyingImage_Focus(): ' + e.message + ', ' + e.stack);
            HideActivitySpinner();
        }

    },


    cmdDisplayConfirmFileUploadDialog_ForIdentifyingImage: function (displayAttachmentsTagName, identityType, identityJson) { // identityType: ['participant', 'org']
        try {
            console.log('In bwCoreComponent.js.cmdDisplayConfirmFileUploadDialog_ForIdentifyingImage().');
            var thiz = this;

            // Populate the filename text box!
            var x = document.getElementById('inputFile_ForIdentifyingImage');
            var file = x.files[0];
            var originalFilename = file.name.trim().split('.')[0];
            //document.getElementById('txtConfirmFileUploadDialogFilename').value = originalFilename;

            // Clear the description, because this may have the description from the last time it was displayed.
            //document.getElementById('txtConfirmFileUploadDialogFileDescription').innerHTML = '';
            //debugger;
            $("#divConfirmFileUploadDialog_ForIdentifyingImage").dialog({
                modal: true,
                resizable: false,
                closeText: "Cancel",
                closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                title: '',
                width: "720px",
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                buttons: {
                    "xxxx": {
                        text: 'Upload',
                        id: 'btnUploadTheFileNow',
                        //disabled: 'false',
                        click: function () {
                            try {
                                //var proceed = confirm('This action cannot be undone.\n\n\nClick the OK button to proceed...');
                                //if (proceed) {
                                //    cmdDeleteBudgetRequest(requestId);
                                //displayAlertDialog('This functionality is incomplete. Coming soon!');



                                $(this).dialog("close"); // PUT THIS BACK!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

                                $("#divWorkingOnItDialog").dialog({
                                    modal: true,
                                    resizable: false,
                                    //closeText: "Cancel",
                                    closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                                    title: 'Working on it...',
                                    width: "800",
                                    dialogClass: "no-close", // No close button in the upper right corner.
                                    hide: false//, // This means when hiding just disappear with no effects.
                                    //buttons: {
                                    //    "Close": function () {
                                    //        $(this).dialog("close");
                                    //    }
                                    //}
                                });
                                $("#divWorkingOnItDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();


                                //var x = document.getElementById('inputFile');
                                //var file = x.files[0];

                                //// Check if the user specified a new filename. If so, make sure the file extension is the same!
                                //var originalFilename = file.name;
                                //var filename;
                                //if (document.getElementById('txtConfirmFileUploadDialogFilename').value.trim() == '') {
                                //    filename = file.name;
                                //} else {
                                //    filename = document.getElementById('txtConfirmFileUploadDialogFilename').value.trim().split('.')[0] + '.' + originalFilename.split('.')[1]; // Put the same extension on it.
                                //}




                                //var _budgetRequestId = document.getElementById('BudgetRequestId').innerHTML;
                                //debugger;
                                thiz.processUpload_ForIdentifyingImage(displayAttachmentsTagName, identityType, identityJson); // identityType: ['participant', 'org']

                                //return true;
                                //}
                            } catch (e) {
                                console.log('Exception in cmdDisplayConfirmFileUploadDialog_ForIdentifyingImage.divConfirmFileUploadDialog_ForIdentifyingImage.click(): ' + e.message + ', ' + e.stack);
                                thiz.displayAlertDialog('Exception in cmdDisplayConfirmFileUploadDialog_ForIdentifyingImage.divConfirmFileUploadDialog_ForIdentifyingImage.click(): ' + e.message + ', ' + e.stack);
                            }
                        }
                    },
                    "Cancel": function () {
                        try {
                            $(this).dialog("close");

                            $('#inputFile_ForIdentifyingImage').replaceWith($('#inputFile_ForIdentifyingImage').clone()); // Clear the file upload box. May not work in all browsers doing it this way.
                            //return false;
                        } catch (e) {
                            console.log('Exception in cmdDisplayConfirmFileUploadDialog_ForIdentifyingImage.divConfirmFileUploadDialog_ForIdentifyingImage.click.cancel(): ' + e.message + ', ' + e.stack);
                            thiz.displayAlertDialog('Exception in cmdDisplayConfirmFileUploadDialog_ForIdentifyingImage.divConfirmFileUploadDialog_ForIdentifyingImage.click.cancel(): ' + e.message + ', ' + e.stack);
                        }
                    }
                },
                open: function (event, ui) {
                    $('.ui-widget-overlay').bind('click', function () {
                        $('#divConfirmFileUploadDialog_ForIdentifyingImage').dialog('close');
                    });

                    // 1-24-2020 ToDo: Display the image prior to uploading!
                    var x = document.getElementById('inputFile_ForIdentifyingImage');
                    var file = x.files[0];

                    //
                    // First get the dimensions of the image.
                    var _URL = window.URL || window.webkitURL;
                    var img;
                    //if ((file = this.files[0])) {
                    img = new Image();
                    var objectUrl = _URL.createObjectURL(file);
                    img.onload = function () {
                        //alert(this.width + " " + this.height);
                        _URL.revokeObjectURL(objectUrl);


                        //if (this.width < 400 || this.height < 400) {
                        if (this.width < 50 || this.height < 50) {
                            $('#divConfirmFileUploadDialog_ForIdentifyingImage').dialog('close');
                            //alert('The image must be a 400px square. This image is too small.');
                            alert('The image must be a 50px square. This image is too small.');
                        } else {
                            // Now display it.
                            var reader = new FileReader();
                            reader.onload = function (e) {
                                $('#ConfirmFileUploadDialog_ForIdentifyingImage_ImagePreview').attr('src', e.target.result);
                                $('#ConfirmFileUploadDialog_ForIdentifyingImage_ImagePreview').attr('style', 'width:400px;'); // 3-12-2022 only specify 1 dimension so the image is rendered in it's correct proportions.  // height:400px;');
                            }
                            reader.readAsDataURL(file);
                        }
                    };
                    img.src = objectUrl;
                    //}




                    //// Now display it.
                    //var reader = new FileReader();

                    //reader.onload = function (e) {
                    //    $('#ConfirmFileUploadDialog_ForIdentifyingImage_ImagePreview').attr('src', e.target.result);
                    //}

                    //reader.readAsDataURL(file);




                } // This allows the dialog to close when clicked outside of the dialog. Only works for modal dialogs.

            });

            // Hide the title bar.
            $("#divConfirmFileUploadDialog_ForIdentifyingImage").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
            // Set the title.
            //document.getElementById('spanDeleteABudgetRequestDialogTitle').innerHTML = 'Confirm file uploadx';

            //$('#btnUploadTheFileNow').bind('click', function (error) { 
            //    try {
            //        console.log('Preparing to call ProcessUpload(' + displayAttachmentsTagName + ', ' + _budgetRequestId);
            //        $('#divConfirmFileUploadDialog').dialog('close');
            //        ProcessUpload(displayAttachmentsTagName, _budgetRequestId);
            //    } catch (e) {
            //        displayAlertDialog('Exception in my.js.xx.btnUploadTheFileNow.click: ' + e.message);
            //    }
            //});

            //$('#btnCancelUploadTheFileNow').bind('click', function (error) {  
            //    try {
            //        console.log('In my.js.xx.btnCancelUploadTheFileNow.click().');
            //        $('#divConfirmFileUploadDialog').dialog('close');
            //        $('#inputFile').replaceWith($('#inputFile').clone()); // Clear the file upload box. May not work in all browsers doing it this way.
            //    } catch (e) {
            //        displayAlertDialog('Exception in my.js.xx.btnCancelUploadTheFileNow.click: ' + e.message);
            //    }
            //});
        } catch (e) {
            displayAlertDialog('Exception in cmdDisplayConfirmFileUploadDialog_ForIdentifyingImage(): ' + e.message);
        }
    },


    processUpload_ForIdentifyingImage: function (displayAttachmentsTagName, identityType, identityJson) { // identityType: ['participant', 'org']
        try {
            console.log('In processUpload_ForIdentifyingImage(). identityType: ' + identityType + ', identityJson: ' + JSON.stringify(identityJson));
            alert('In processUpload_ForIdentifyingImage(). identityType: ' + identityType + ', identityJson: ' + JSON.stringify(identityJson));
            var thiz = this;

            //
            // The user has clicked the "Upload now" button. This is the identifying image which shows up in the small circle of a circle dialog.
            //
            //debugger;

            var x = document.getElementById('inputFile_ForIdentifyingImage');
            var file = x.files[0];















            // Check if the user specified a new filename. If so, make sure the file extension is the same!
            var originalFilename = file.name;
            var filename;
            if (document.getElementById('txtConfirmFileUploadDialogFilename') && document.getElementById('txtConfirmFileUploadDialogFilename').value.trim() == '') {
                filename = file.name;
            } else if (document.getElementById('txtConfirmFileUploadDialogFilename')) {
                filename = document.getElementById('txtConfirmFileUploadDialogFilename').value.trim().split('.')[0] + '.' + originalFilename.split('.')[1]; // Put the same extension on it.
            } else {
                //var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                //    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                //    return v.toString(16);
                //});
                filename = originalFilename; //guid;
            }

            if (filename.indexOf('.xml') > 0) {
                // XML files add 3 characters to the start of the file when using readAsArrayBuffer, so using readAsText instead!
                var reader = new FileReader();
                reader.onload = function (event) {
                    var fileData = reader.result;
                    //displayAlertDialog('fileData prior to ws call:' + fileData);
                    debugger;
                    thiz.performUpload_ForIdentifyingImage(fileData, filename, displayAttachmentsTagName, identityType, identityJson); // identityType: ['participant', 'org']
                };
                reader.readAsText(file);
            } else {



                //
                // This is where we should be resizing the file. Assume it is a .png for the moment.
                //
                var calculateAspectRatioFit = function (srcWidth, srcHeight, maxWidth, maxHeight) {
                    var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

                    var width = srcWidth * ratio;
                    var height = srcHeight * ratio;

                    var dx = 0;
                    if (width < maxWidth) dx = (maxWidth - width) / 2;
                    var dy = 0;
                    if (height < maxHeight) dy = (maxHeight - height) / 2;


                    //return { width: srcWidth * ratio, height: srcHeight * ratio, sx: 150, sy: 150 }; // sx and sy place the image in the center of the 512 x 512 square we are working with.
                    return { width: width, height: height, dx: dx, dy: dy }; // sx and sy place the image in the center of the 512 x 512 square we are working with.
                };

                var fileReader = new FileReader();
                var filterType = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;

                fileReader.onload = function (event) {
                    try {
                        var image = new Image();

                        image.onload = function () {
                            //debugger;
                            document.getElementById("ConfirmFileUploadDialog_ForIdentifyingImage_ImagePreview").src = image.src;
                            var canvas = document.createElement("canvas");
                            var ctx = canvas.getContext("2d");

                            var resizedImage = calculateAspectRatioFit(image.width, image.height, 512, 512);

                            canvas.width = 512; //resizedImage.width;
                            canvas.height = 512; //resizedImage.height;

                            var smallCircleRadius = 256;
                            var smallCircleCenterX = 256;
                            var smallCircleCenterY = 256;
                            ctx.arc(smallCircleCenterX, smallCircleCenterY, smallCircleRadius, 0, 2 * Math.PI);
                            ctx.stroke();
                            ctx.fillStyle = 'aliceblue';
                            ctx.fill();
                            ctx.closePath();
                            ctx.clip();

                            ctx.drawImage(image,
                                0, // ok. We want to resize the entire image.
                                0, // ok. We want to resize the entire image.
                                image.width, // ok. We want to resize the entire image.
                                image.height, // ok We want to resize the entire image.
                                resizedImage.dx, // x destination
                                resizedImage.dy, // y destination
                                resizedImage.width, // width scaling value
                                resizedImage.height // height scaling value
                            );
                            //debugger;
                            ctx.arc(smallCircleCenterX, smallCircleCenterY, smallCircleRadius, 0, 2 * Math.PI);
                            ctx.clip();
                            ctx.closePath();
                            ctx.restore();

                            //debugger;
                            //document.getElementById("ConfirmFileUploadDialog_ForIdentifyingImage_ImagePreview2").src = canvas.toDataURL();

                            var dataURL = canvas.toDataURL();
                            var blobBin = atob(dataURL.split(',')[1]);
                            var array = [];
                            for (var i = 0; i < blobBin.length; i++) {
                                array.push(blobBin.charCodeAt(i));
                            }
                            var file2 = new Blob([new Uint8Array(array)], { type: 'image/png' });



                            ////// THIS WORKS JUST COMMENTING OUT FOR A MOMENT
                            var reader = new FileReader();
                            reader.onload = function (event) {
                                var fileData = '';
                                var buffer = event.target.result;
                                var byteArray = new Uint8Array(buffer);
                                for (var i = 0; i < byteArray.byteLength; i++) {
                                    fileData += String.fromCharCode(byteArray[i])
                                }
                                //displayAlertDialog('fileData prior to ws call:' + fileData);
                                //displayAlertDialog('size2: ' + fileData.length);
                                //PerformUpload(fileData, file.name, displayAttachmentsTagName, _budgetRequestId);
                                //debugger;
                                thiz.performUpload_ForIdentifyingImage(fileData, filename, displayAttachmentsTagName, identityType, identityJson); // identityType: ['participant', 'org']
                            };
                            reader.readAsArrayBuffer(file2); // This works for text. 
                            //var img2 = canvas.toDataURL();
                            //// Convert Base64 image to binary
                            ////var file2 = dataURItoBlob(img2);
                            //reader.readAsArrayBuffer(file2); // This works for text. 











                            //// At this point we have the image displayed to the user, but we need to convert it to a file then an array buffer to send to the server.
                            //var fileReader2 = new FileReader();
                            //fileReader2.onload = function (event) {
                            //    var fileData = '';
                            //    var buffer = event.target.result;
                            //    var byteArray = new Uint8Array(buffer);
                            //    for (var i = 0; i < byteArray.byteLength; i++) {
                            //        fileData += String.fromCharCode(byteArray[i])
                            //    }
                            //    //displayAlertDialog('fileData prior to ws call:' + fileData);
                            //    //displayAlertDialog('size2: ' + fileData.length);
                            //    //PerformUpload(fileData, file.name, displayAttachmentsTagName, _budgetRequestId);
                            //    debugger;
                            //    thiz.performUpload_ForIdentifyingImage(fileData, filename, displayAttachmentsTagName, identityType, identityJson); // identityType: ['participant', 'org']
                            //};
                            //debugger;
                            ////var x = document.getElementById("ConfirmFileUploadDialog_ForIdentifyingImage_ImagePreview2");
                            //// Use the resized image to do what you want
                            //var x = canvas.toDataURL("image/png");
                            ////fileReader2.readAsDataURL(x);
                            //thiz.performUpload_ForIdentifyingImage(x, filename, displayAttachmentsTagName, identityType, identityJson); // identityType: ['participant', 'org']




                            //var buffer = canvas.toDataURL();
                            //var byteArray = new Uint8Array(buffer);
                            //for (var i = 0; i < byteArray.byteLength; i++) {
                            //    fileData += String.fromCharCode(byteArray[i])
                            //}
                            //debugger;
                            //thiz.performUpload_ForIdentifyingImage(fileData, filename, displayAttachmentsTagName, identityType, identityJson); // identityType: ['participant', 'org']






                            ////// THIS WORKS JUST COMMENTING OUT FOR A MOMENT
                            //var reader = new FileReader();
                            //reader.onload = function (event) {
                            //    var fileData = '';
                            //    var buffer = event.target.result;
                            //    var byteArray = new Uint8Array(buffer);
                            //    for (var i = 0; i < byteArray.byteLength; i++) {
                            //        fileData += String.fromCharCode(byteArray[i])
                            //    }
                            //    //displayAlertDialog('fileData prior to ws call:' + fileData);
                            //    //displayAlertDialog('size2: ' + fileData.length);
                            //    //PerformUpload(fileData, file.name, displayAttachmentsTagName, _budgetRequestId);
                            //    //debugger;
                            //    thiz.performUpload_ForIdentifyingImage(fileData, filename, displayAttachmentsTagName, identityType, identityJson); // identityType: ['participant', 'org']
                            //};
                            //reader.readAsArrayBuffer(file); // This works for text. 
                            //var img2 = canvas.toDataURL();
                            //// Convert Base64 image to binary
                            ////var file2 = dataURItoBlob(img2);
                            //reader.readAsArrayBuffer(file2); // This works for text. 















                        }
                        image.src = event.target.result;
                    } catch (e) {
                        console.log('Exception in processUpload_ForIdentifyingImage.fileReader.onload(): ' + e.message + ', ' + e.stack);
                        alert('Exception in processUpload_ForIdentifyingImage.fileReader.onload(): ' + e.message + ', ' + e.stack); // 7-5-2023.
                    }
                };

                var loadImageFile = function () {
                    try {
                        var uploadImage = document.getElementById("inputFile_ForIdentifyingImage");

                        //check and retuns the length of uploded file.
                        if (uploadImage.files.length === 0) {
                            return;
                        }

                        //Is Used for validate a valid file.
                        var uploadFile = document.getElementById("inputFile_ForIdentifyingImage").files[0];
                        if (!filterType.test(uploadFile.type)) {

                            // This regex test often identifies that there is no file extension., Going to just stick ".png" on the end of the filename. Nopt doing that yet, mor ethis THINK ABOUT HERE!!!!!!!!!!! < 4-25-2023.
                            alert("Please select a valid image. xcx12343.");
                            return;
                        }

                        fileReader.readAsDataURL(uploadFile);
                    } catch (e) {
                        console.log('Exception in bwCoreComponent.loadImageFile(): ' + e.message + ', ' + e.stack);
                    }
                }

                //debugger;
                loadImageFile();





                ////// THIS WORKS JUST COMMENTING OUT FOR A MOMENT
                //var reader = new FileReader();
                //reader.onload = function (event) {
                //    var fileData = '';
                //    var buffer = event.target.result;
                //    var byteArray = new Uint8Array(buffer);
                //    for (var i = 0; i < byteArray.byteLength; i++) {
                //        fileData += String.fromCharCode(byteArray[i])
                //    }
                //    //displayAlertDialog('fileData prior to ws call:' + fileData);
                //    //displayAlertDialog('size2: ' + fileData.length);
                //    //PerformUpload(fileData, file.name, displayAttachmentsTagName, _budgetRequestId);
                //    debugger;
                //    thiz.performUpload_ForIdentifyingImage(fileData, filename, displayAttachmentsTagName, identityType, identityJson); // identityType: ['participant', 'org']
                //};
                //reader.readAsArrayBuffer(file); // This works for text. 
            }


        } catch (e) {
            console.log('Exception in processUpload_ForIdentifyingImage() catch for second attempt...: ' + e.message + ', ' + e.stack);
            alert('Exception in processUpload_ForIdentifyingImage() catch for second attempt...: ' + e.message + ', ' + e.stack); // 7-5-2023.
            try {
                //displayAlertDialog('bw.initar.ore.js.ProcessUpload():2');
                // this section is here to support older IE browsers.
                //var filePath = f:\oo.txt;
                var fso = new ActiveXObject("Scripting.FileSystemObject");
                var textStream = fso.OpenTextFile(fileInput);
                var fileData = file.ReadAll();

                //var fileName = '',
                //     libraryName = '',
                //     fileData = '';

                //var byteArray = new Uint8Array(result.target.result)
                //for (var i = 0; i < byteArray.byteLength; i++) {
                //    fileData += String.fromCharCode(byteArray[i])
                //}

                // once we have the file perform the actual upload
                debugger; // TODD: Do we ever get here? does this even work?
                thiz.performUpload_ForIdentifyingImage(fileData);
            } catch (e2) {
                //window.waitDialog.close();
                try {
                    $('#divWorkingOnItDialog').dialog('close'); // Close the create your account dialog.
                } catch (e) { }
                displayAlertDialog('Exception in processUpload_ForIdentifyingImage(): Uploading files doesn\'t seem to be supported in your browser: ' + e2.number + ': ' + e2.message + ', ' + e2.stack);
            }
        }
    },
    performUpload_ForIdentifyingImage: function (fileData, filename, displayAttachmentsTagName, identityType, identityJson) { // identityType: ['participant', 'org']
        try {
            console.log('In performUpload_ForIdentifyingImage(): identityJson: ' + JSON.stringify(identityJson));
            alert('In performUpload_ForIdentifyingImage(): identityJson: ' + JSON.stringify(identityJson));
            var thiz = this;

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            ShowActivitySpinner_FileUpload();
            //debugger;
            //
            // This is where the actual upload happens.
            //
            if (identityType == 'participant') {

                // The user is uploading a participant image.
                var description = 'This is bwParticipantId: ' + identityJson.bwParticipantId + '. ' + identityJson.bwParticipantFriendlyName + ' (' + identityJson.bwParticipantEmail + ')';
                var thiz = this;
                //debugger;
                var data = [];
                data = {
                    bwWorkflowAppId: workflowAppId, //thiz.options.bwWorkflowAppId,
                    bwParticipantId: identityJson.bwParticipantId,
                    Filename: 'userimage.png', //filename,
                    FileContent: fileData,
                    Description: description
                };
                var operationUri = this.options.operationUriPrefix + '_files/' + 'uploadidentifyingimageforparticipant'; // 'uploadattachment'; // _files allows us to use nginx to route these to a dedicated file server.
                $.ajax({
                    url: operationUri,
                    type: "PUT",
                    data: data,
                    headers: { "Accept": "application/json; odata=verbose" },
                    success: function (data) {
                        try {

                            HideActivitySpinner_FileUpload();
                            $('#divWorkingOnItDialog').dialog('close'); // Close the "Working on it..." dialog.
                            $('#inputFile_ForIdentifyingImage').replaceWith($('#inputFile_ForIdentifyingImage').clone()); // Clear the file upload box. May not work in all browsers doing it this way.

                            // Close the dialog.
                            $('#divUploadANewSmallCircleImageDialog').dialog('close');

                            //
                            // This prevents caching of participant image when uploading a new one!
                            //
                            // https://budgetworkflow.com/_files/6f308d4e-66fd-4e6f-925e-714b3135fef3/orgimages/root/orgimage.png
                            var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                                return v.toString(16);
                            });


                            alert('Need activeStateIdentifier on this image path xcx121231-1');

                            //var imagePath = thiz.options.operationUriPrefix + '_files/' + workflowAppId + '/orgimages/' + identityJson.bwOrgId + '/orgimage.png?v=' + guid;
                            var imagePath = thiz.options.operationUriPrefix + '_files/' + workflowAppId + '/participantimages/' + identityJson.bwParticipantId + '/userimage.png?v=' + guid;
                            //document.getElementById("orgImage_root_blueheaderbar1").src = imageUrl;
                            //document.getElementById("orgImage_root_blueheaderbar2").src = imageUrl;
                            //document.getElementById("orgImage_root_blueheaderbar3").src = imageUrl;
                            //document.getElementById("orgImage_root_blueheaderbar4").src = imageUrl;
                            //document.getElementById("orgImage_root_blueheaderbar5").src = imageUrl;
                            //document.getElementById("orgImage_root_blueheaderbar6").src = imageUrl;
                            // end: This prevents caching of image when uploading a new one!

                            //
                            // This prevents caching of org image when uploading a new one!
                            //
                            var lookForParticipantImage = function (imagePath) { // , i) {
                                return new Promise(function (resolve, reject) {
                                    $.get(imagePath).done(function () {
                                        try {
                                            debugger;
                                            var img = new Image();
                                            img.src = imagePath;
                                            img.onload = function (e) {
                                                try {

                                                    console.log('xcx214324 identityJson: ' + JSON.stringify(identityJson));

                                                    $('.bwCircleDialog').bwCircleDialog('drawCircle', null, imagePath, 512, 512, true, identityJson, true);

                                                    resolve();

                                                } catch (e) {

                                                    console.log('Exception in bwCoreComponent.js.performUpload_ForIdentifyingImage().ParticipantImage.img.onload(): ' + e.message + ', ' + e.stack);
                                                    displayAlertDialog('Exception in bwCoreComponent.js.performUpload_ForIdentifyingImage().ParticipantImage.img.onload(): ' + e.message + ', ' + e.stack);

                                                    reject();

                                                }
                                            }
                                        } catch (e) {

                                            console.log('Exception in bwCoreComponent.js.performUpload_ForIdentifyingImage().ParticipantImage.get(imagePath).done(): ' + e.message + ', ' + e.stack);
                                            displayAlertDialog('Exception in bwCoreComponent.js.performUpload_ForIdentifyingImage().ParticipantImage.get(imagePath).done(): ' + e.message + ', ' + e.stack);

                                            reject();

                                        }
                                    }).fail(function () {

                                        alert('In bwCoreComponent.js.performUpload_ForIdentifyingImage().ParticipantImage.get(imagePath).fail(): Didn\'t find the image. imagePath: ' + imagePath);

                                        // do nothing, it just didn't find an image.
                                        resolve();

                                    });
                                });
                            }
                            lookForParticipantImage(imagePath).then(function () {

                                //alert('DONE SUCCESSFULLY.');

                                console.log('xcx123245 In bwCoreComponent.js.performUpload_ForIdentifyingImage.lookForParticipantImage.then(). Success.');

                                //alert('xcx1243234 identityJson: ' + JSON.stringify(identityJson));
                                //$('.bwCircleDialog').bwCircleDialog('displaySmallCircleDialog', 'participant', identityJson.bwParticipantId, identityJson.bwParticipantFriendlyName, identityJson.bwParticipantEmail); //'04274595-c264-4045-91aa-58eb1da15121', 'Tony Stark', 'tony@budgetworkflow.com');


                            }).catch(function (e) {

                                console.log('Exception in bwCoreComponent.js.performUpload_ForIdentifyingImage.lookForParticipantImage xcx346: ' + e);
                                displayAlertDialog('Exception in bwCoreComponent.js.performUpload_ForIdentifyingImage.lookForParticipantImage xcx346: ' + e);

                            });






                        } catch (e) {
                            HideActivitySpinner_FileUpload();
                            console.log('Exception in performUpload_ForIdentifyingImage():2: ' + e.message + ', ' + e.stack);
                            displayAlertDialog('Exception in performUpload_ForIdentifyingImage():2: ' + e.message + ', ' + e.stack);
                        }
                    },
                    error: function (data, errorCode, errorMessage) {
                        try {
                            $('#divWorkingOnItDialog').dialog('close'); // Close the "Working on it..." dialog.
                            console.log('Error in performUpload(): ' + errorMessage);
                            debugger;
                            if (errorMessage == 'timeout') {
                                displayAlertDialog('The file server could not be contacted. Please try again in a few minutes.');
                            } else {
                                displayAlertDialog('Error in performUpload_ForIdentifyingImage(): ' + errorMessage);
                            }
                        } catch (e) {
                            console.log('Exception in performUpload_ForIdentifyingImage():3: ' + e.message + ', ' + e.stack);
                            displayAlertDialog('Exception in performUpload_ForIdentifyingImage():3: ' + e.message + ', ' + e.stack);
                        }
                    }
                });

            } else {
                // The user must be uploading an org image.



                //alert('Unexpected value in bwCoreComponent.performUpload_ForIdentifyingImage().');
                // The user is uploading a participant image.
                var description = 'This is bwOrgId: ' + identityJson.bwOrgId + '. ' + identityJson.bwOrgName + ' (' + identityJson.bwOrgPath + ')';
                var thiz = this;
                //debugger;
                var data = [];
                data = {
                    bwWorkflowAppId: workflowAppId, // thiz.options.bwWorkflowAppId,
                    bwOrgId: identityJson.bwOrgId,
                    Filename: 'orgimage.png', //filename,
                    FileContent: fileData,
                    Description: description
                };

                //displayAlertDialog('fileData from json object:' + data.FileContent);
                //displayAlertDialog('size3: ' + data.FileContent.length);
                //debugger;
                var operationUri = this.options.operationUriPrefix + '_files/' + 'uploadidentifyingimagefororg'; // 'uploadattachment'; // _files allows us to use nginx to route these to a dedicated file server.
                //var operationUri = this.options.operationUriPrefix + '_files/' + 'uploadidentifyingimagefororg';
                //var operationUri = this.options.operationUriPrefix + '_files/' + 'uploadidentifyingimageforrequesttype';
                $.ajax({
                    url: operationUri,
                    type: "PUT",
                    //contentType: "image/png",
                    data: data,
                    headers: { "Accept": "application/json; odata=verbose" },
                    timeout: this.options.ajaxTimeout,
                    success: function (data) {
                        try {
                            //displayAlertDialog('bw.initar.core.js.PerformUpload(): ' + JSON.stringify(data));
                            HideActivitySpinner_FileUpload();
                            //debugger;

                            //displayAlertDialog("Success! Your file was uploaded to SharePoint.");
                            $('#divWorkingOnItDialog').dialog('close'); // Close the "Working on it..." dialog.
                            $('#inputFile_ForIdentifyingImage').replaceWith($('#inputFile_ForIdentifyingImage').clone()); // Clear the file upload box. May not work in all browsers doing it this way.

                            //thiz.populateAttachments(thiz.options.bwWorkflowAppId, thiz.options.bwBudgetRequestId, 'newrequestattachments', true); //'attachments'); // This lists the attachments in the <p> tag with id='attachments'.

                            // Close the dialog.
                            $('#divUploadANewSmallCircleImageDialog').dialog('close');

                            // 1-24-2020 ToDo: Update the circle dialog with the new small circle image!


                            debugger;

                            //
                            // This prevents caching of org image when uploading a new one!
                            //
                            // https://budgetworkflow.com/_files/6f308d4e-66fd-4e6f-925e-714b3135fef3/orgimages/root/orgimage.png
                            //var imageVersionGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                            //    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                            //    return v.toString(16);
                            //});


                            //alert('xcx213121243214234-6 fix the image url here....');

                            //var imagePath = thiz.options.operationUriPrefix + '_files/' + thiz.options.bwWorkflowAppId + '/orgimages/' + identityJson.bwOrgId + '/orgimage.png?v=' + imageVersionGuid;
                            //document.getElementById('orgImage_' + identityJson.bwOrgId).src = imagePath; // This is the business model editor org treeview image.




                            var preventCachingGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                                return v.toString(16);
                            });

                            var imagePath;

                            var activeStateIdentifier = JSON.parse($('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier'));

                            if (activeStateIdentifier.status != 'SUCCESS') {

                                imagePath = '[No image. Unauthorized. xcx213124-34556-34-234-3245-xx-55-1]';

                            } else {

                                if (!thiz.options.bwWorkflowAppId) {
                                    alert('ERROR xcx21342352523');
                                }

                                alert('xcx223423');
                                //imagePath2 = this.options.operationUriPrefix + '_files/' + workflowAppId + '/orgimages/' + bwOrgId + '/' + 'orgimage.png?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier;
                                imagePath = thiz.options.operationUriPrefix + '_files/' + thiz.options.bwWorkflowAppId + '/orgimages/' + identityJson.bwOrgId + '/orgimage.png?v=' + preventCachingGuid + '&ActiveStateIdentifier=' + activeStateIdentifier.ActiveStateIdentifier;

                                var lookForOrgImage = function (imagePath) { // , i) {
                                    return new Promise(function (resolve, reject) {
                                        $.get(imagePath).done(function () {
                                            try {
                                                debugger;
                                                var img = new Image();
                                                img.src = imagePath;
                                                img.onload = function (e) {
                                                    try {
                                                        //document.getElementById('orgImage_' + identityJson.bwOrgId).src = imagePath; // This is the business model editor org treeview image.

                                                        console.log('In bwCoreComponent.js.lookForOrgImage.get.done(). THIS IS AN INTERESTING SPOT IN THE CODE. For instance, if the user has the Configuration > Organization screen open, when this org image is changed, it also wants to be changed in the display as well. Live UI! Also, would other users have this go through bwNotificationSound to update their screens as well, behind th escenes???? Hmmm... xcx32453493.');

                                                        if (identityJson.bwOrgId == 'root') {
                                                            if (document.getElementById("orgImage_root_blueheaderbar")) {
                                                                document.getElementById("orgImage_root_blueheaderbar").src = imagePath;
                                                            }
                                                        }

                                                        $('.bwCircleDialog').bwCircleDialog('drawCircle', null, imagePath, 512, 512, true, identityJson, true);

                                                        resolve();
                                                        //$('.bwCircleDialog').bwCircleDialog('displayOrgRoleEditorInACircle', true, identityJson.bwOrgId);


                                                        //var html = '';
                                                        //html += '<img id="orgImage2_' + '' + '" style="width:30px;height:30px;vertical-align:middle;" src="' + imagePath + '" />';
                                                        ////This element might not exist!
                                                        //var parentElementId;
                                                        //try {
                                                        //    parentElementId = $(thiz.options.requestForm).closest('.ui-dialog-content')[0].id; // If it is in a dialog, this returns the dialog id.
                                                        //} catch (e) { }
                                                        //if (!parentElementId) {
                                                        //    // It is not in a dialog, so it must be a new request.
                                                        //    parentElementId = 'divCreateRequestFormContent';
                                                        //}
                                                        //try {
                                                        //    //debugger;
                                                        //    //document.getElementById(orgsImageFetchingInformation[i].spanOrgId).innerHTML = html; //imagePath;
                                                        //    $('#' + parentElementId).find('#' + orgsImageFetchingInformation[i].spanOrgId)[0].innerHTML = html; //imagePath;
                                                        //    resolve();
                                                        //} catch (e) {
                                                        //    // ACTUALLY WE SHOUDL BE LOADING THE ELEMENT HERE MAYBE? IT USED TO WORK! 2-5-2020
                                                        //    //document.getElementById(orgsImageFetchingInformation[i].imageId).src = imagePath;
                                                        //    $('#' + parentElementId).find('#' + orgsImageFetchingInformation[i].imageId)[0].src = imagePath;
                                                        //    //console.log('Exception in bwOrganizationEditor.js.renderOrgRolesEditor(): span tag with id="' + orgsImageFetchingInformation[i].spanOrgId + '" does not exist! ' + e.message + ', ' + e.stack);
                                                        //    resolve();
                                                        //}

                                                    } catch (e) {

                                                        console.log('Exception in bwCoreComponent.js.performUpload_ForIdentifyingImage().OrgImage.img.onload(): ' + e.message + ', ' + e.stack);
                                                        displayAlertDialog('Exception in bwCoreComponent.js.performUpload_ForIdentifyingImage().OrgImage.img.onload(): ' + e.message + ', ' + e.stack);

                                                        reject();

                                                    }
                                                }
                                            } catch (e) {

                                                console.log('Exception in bwCoreComponent.js.performUpload_ForIdentifyingImage().OrgImage.get(imagePath).done(): ' + e.message + ', ' + e.stack);
                                                displayAlertDialog('Exception in bwCoreComponent.js.performUpload_ForIdentifyingImage().OrgImage.get(imagePath).done(): ' + e.message + ', ' + e.stack);

                                                reject();

                                            }
                                        }).fail(function () {

                                            // do nothing, it just didn't find an image.
                                            resolve();

                                        });
                                    });
                                }
                                lookForOrgImage(imagePath); //, i);


                            }














                            












                            debugger;



                            //if (identityJson.bwOrgId == 'root') {
                            //    document.getElementById("orgImage_root_blueheaderbar1").src = imagePath;
                            //    document.getElementById("orgImage_root_blueheaderbar2").src = imagePath;
                            //    document.getElementById("orgImage_root_blueheaderbar3").src = imagePath;
                            //    document.getElementById("orgImage_root_blueheaderbar4").src = imagePath;
                            //    document.getElementById("orgImage_root_blueheaderbar5").src = imagePath;
                            //    document.getElementById("orgImage_root_blueheaderbar6").src = imagePath;
                            //}


                            //$('.bwCircleDialog').bwCircleDialog('displayOrgRoleEditorInACircle', true, identityJson.bwOrgId);
                            // end: This prevents caching of image when uploading a new one!

                            //$.get(imagePath).done(function () {
                            //    //debugger;
                            //    var img = new Image();
                            //    img.src = imagePath; //img.src = 'images/orgimage.png';
                            //    img.onload = function (e) {
                            //        try {
                            //            debugger;
                            //            document.getElementById('orgImage_' + identityJson.bwOrgId).src = imagePath;
                            //        } catch (e) {
                            //            console.log('Exception in displaySmallCircleDialog().img.onload(): ' + e.message + ', ' + e.stack);
                            //        }
                            //    }
                            //}).fail(function () {
                            //    //debugger;
                            //    //alert("This org has no image."); // do nothing 
                            //    //var x = 'failed';
                            //});









                        } catch (e) {
                            console.log('Exception in performUpload_ForIdentifyingImage():4: ' + e.message + ', ' + e.stack);
                            displayAlertDialog('Exception in performUpload_ForIdentifyingImage():4: ' + e.message + ', ' + e.stack);
                        }
                    },
                    error: function (data, errorCode, errorMessage) {
                        try {
                            $('#divWorkingOnItDialog').dialog('close'); // Close the "Working on it..." dialog.
                            console.log('Error in performUpload(): ' + errorMessage);
                            debugger;
                            if (errorMessage == 'timeout') {
                                displayAlertDialog('The file server could not be contacted. Please try again in a few minutes.');
                            } else {
                                displayAlertDialog('Error in performUpload_ForIdentifyingImage(): ' + errorMessage);
                            }
                        } catch (e) {
                            console.log('Exception in performUpload_ForIdentifyingImage():5: ' + e.message + ', ' + e.stack);
                            displayAlertDialog('Exception in performUpload_ForIdentifyingImage():5: ' + e.message + ', ' + e.stack);
                        }
                    }
                });


            }

        } catch (e) {
            console.log('Exception in performUpload_ForIdentifyingImage(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in performUpload_ForIdentifyingImage(): ' + e.message + ', ' + e.stack);
        }
    },




    showRowHoverDetails: function (bwBudgetRequest1, task, hoverElement) {
        try {
            // If task is true, then we lookup the request below to get details from the bwRequestJson (which is not immediately available to a task).
            console.log('In bwCoreComponent.js.showRowHoverDetails(). THIS GENERATES AN EXECUTIVE SUMMARY. THIS SHOULD BE HAPPENING IN bwCommonScripts.js.');
            var thiz = this;

            var objectType;
            if (task == true) {
                objectType = 'bwWorkflowTaskItem';
            } else {
                objectType = 'bwBudgetRequest';
            }

            try {
                //displayAlertDialog_Persistent('xcx123123: bwBudgetRequest: ' + JSON.stringify(bwBudgetRequest));
                var bwBudgetRequest = JSON.parse(decodeURIComponent(bwBudgetRequest1)); // This came from a hover-over, so we have to convert it back into JSON.
                //bwBudgetRequest = JSON.parse(decodeURI(bwBudgetRequest)); // This came from a hover-over, so we have to convert it back into JSON.
            } catch (e) {

                // We do this to catch and record a bad one. Still getting this exception once in a while. 7-19-2024.
                var msg = 'Exception in bwCoreComponent.js.showRowHoverDetails(): ' + e.message + ', ' + e.stack + ' :: bwBudgetRequest1: ' + bwBudgetRequest1;
                console.log(msg);
                displayAlertDialog(msg);

            }

            var executiveSummaryElement = document.getElementById('spanRowHoverDetails_DialogContents');

            console.log('Calling bwCommonScripts.getExecutiveSummaryHtml(). xcx1-4. <<<<<<< I CHANGED THIS FROM AN alert() BECAUSE IT WAS DISTURBING THE USER. <<');
            //alert('Calling bwCommonScripts.getExecutiveSummaryHtml(). xcx1-4.');
            var promise = bwCommonScripts.getExecutiveSummaryHtml(bwBudgetRequest, objectType, executiveSummaryElement);
            promise.then(function (results) {
                try {

                    $(results.executiveSummaryElement).html(results.html);

                    promise2 = bwCommonScripts.renderInventoryItems_ForExecutiveSummary(results.bwBudgetRequest.bwBudgetRequestId, results.bwBudgetRequest, results.executiveSummaryElement);
                    promise2.then(function (results) {
                        try {

                            console.log('In bwCoreComponent.js.showRowHoverDetails(). Returned from call to bwCommonScripts.renderInventoryItems_ForExecutiveSummary.');

                            debugger;
                            //var promise3 = bwCommonScripts.renderAttachments_ForExecutiveSummary(results.bwBudgetRequestId, results.executiveSummaryElement, true); // This sets forceRenderTheImageThumbnail to true.
                            var promise3 = bwCommonScripts.renderAttachments_ForExecutiveSummary(results.bwBudgetRequest.bwBudgetRequestId, results.bwBudgetRequest, results.executiveSummaryElement, true); // This sets forceRenderTheImageThumbnail to true.
                            promise3.then(function (results) {
                                try {
                                    debugger;
                                    console.log('In bwCoreComponent.js.showRowHoverDetails(). Returned from call to bwCommonScripts.renderAttachments_ForExecutiveSummary.');

                                    var position = {};
                                    if (hoverElement) {
                                        // This is intended to prevent the magnifying glass from appearing under the hover-dialog... which will prevent all the screen flash etc.
                                        // If we have the hoverElement (the magnifying glass), we can display the hover-dialog to the right to prevent the "collision".

                                        var magnifyingGlassElement = $(hoverElement).find('.gridMagnifyingGlass:first');

                                        if (magnifyingGlassElement && magnifyingGlassElement.length && (magnifyingGlassElement.length > 0)) {
                                            position = {
                                                my: "left+60 top-60",
                                                at: "right top",
                                                of: magnifyingGlassElement
                                            };
                                        } else {

                                            // 4-6-2024.
                                            // divRequestFormDialog_be1d5f1e-07cf-491c-8e8d-aef3e1fea278
                                            //var formElement =
                                            //debugger;
                                            //var dialogId = 'divRequestFormDialog_' + bwBudgetRequest.bwBudgetRequestId; // results.bwBudgetRequest.bwBudgetRequestId;
                                            //var dialogElement = $(dialogId);

                                            position = {
                                                my: "left+60 top-60",
                                                at: "right top",
                                                of: $(hoverElement)
                                            };

                                        }

                                    }

                                    $('#divRowHoverDetails').dialog({
                                        resizable: false,
                                        draggable: false,
                                        width: "760",
                                        position: position,
                                        open: function (event, ui) {
                                            try {

                                                $(this).unbind('click').bind('click', function () {
                                                    console.log('Displaying the request in the dialog [calling displayArInDialog()].');
                                                    $('.bwRequest').bwRequest('displayArInDialog', thiz.options.operationUriPrefix, bwBudgetRequest1.BwBudgetRequestId, bwBudgetRequest1.Title, bwBudgetRequest1.ProjectTitle, bwBudgetRequest1.Title);
                                                    thiz.hideRowHoverDetails();
                                                });

                                            } catch (e) {
                                                console.log('Exception in bwCoreComponent.js.showRowHoverDetails.divRowHoverDetails.dialog.open(): ' + e.message + ', ' + e.stack);
                                                displayAlertDialog('Exception in bwCoreComponent.js.showRowHoverDetails.divRowHoverDetails.dialog.open(): ' + e.message + ', ' + e.stack);
                                            }
                                        },
                                        close: function () {
                                            $('#divRowHoverDetails').dialog('destroy');
                                        }
                                    });
                                    $('#divRowHoverDetails').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();

                                } catch (e) {

                                    var msg = 'Exception in bwCoreComponent.js.showRowHoverDetails():2-2-2-1: ' + e.message + ', ' + e.stack;
                                    console.log(msg);
                                    displayAlertDialog(msg);
                                    var result = {
                                        status: 'EXCEPTION',
                                        message: msg
                                    }
                                    reject(result);

                                }
                            }).catch(function (e) {

                                var msg = 'Exception in bwCoreComponent.js.showRowHoverDetails():2-2-2-2: ' + JSON.stringify(e);
                                console.log(msg);
                                displayAlertDialog(msg);
                                var result = {
                                    status: 'EXCEPTION',
                                    message: msg
                                }
                                reject(result);

                            });

                        } catch (e) {

                            var msg = 'Exception in bwCoreComponent.js.showRowHoverDetails():2-2-2-3: ' + e.message + ', ' + e.stack;
                            console.log(msg);
                            displayAlertDialog(msg);
                            var result = {
                                status: 'EXCEPTION',
                                message: msg
                            }
                            reject(result);

                        }
                    }).catch(function (e) {

                        var msg = 'Exception in bwCoreComponent.js.showRowHoverDetails():2-2-2-3: ' + JSON.stringify(e);
                        console.log(msg);
                        displayAlertDialog(msg);
                        var result = {
                            status: 'EXCEPTION',
                            message: msg
                        }
                        reject(result);

                    });

                } catch (e) {

                    var msg = 'Exception in bwCoreComponent.js.showRowHoverDetails():xcx2131234234: ' + e.message + ', ' + e.stack;
                    console.log(msg);
                    displayAlertDialog(msg);
                    var result = {
                        status: 'EXCEPTION',
                        message: msg
                    }
                    reject(result);

                }

            }).catch(function (e) {

                var msg = 'Exception in bwCoreComponent.js.showRowHoverDetails():2-2-2-3: ' + JSON.stringify(e);
                console.log(msg);
                displayAlertDialog(msg);
                var result = {
                    status: 'EXCEPTION',
                    message: msg
                }
                reject(result);

            });

            //var position = {};
            //if (hoverElement) {
            //    // This is intended to prevent the magnifying glass from appearing under the hover-dialog... which will prevent all the screen flash etc.
            //    // If we have the hoverElement (the magnifying glass), we can display the hover-dialog to the right to prevent the "collision".

            //    var magnifyingGlassElement = $(hoverElement).find('.gridMagnifyingGlass:first');

            //    position = {
            //        my: "left+60 top-60",
            //        at: "right top",
            //        of: magnifyingGlassElement
            //    };

            //}

            //$('#divRowHoverDetails').dialog({
            //    resizable: false,
            //    draggable: false,
            //    width: "760",
            //    position: position,
            //    open: function (event, ui) {
            //        try {

            //            //$('#divRowHoverDetails').unbind('click', function () { }); // removed 11-30-2022

            //            $(this).unbind('click').bind('click', function () {
            //                console.log('Displaying the request in the dialog [calling displayArInDialog()].');
            //                $('.bwRequest').bwRequest('displayArInDialog', thiz.options.operationUriPrefix, bwBudgetRequest1.BwBudgetRequestId, bwBudgetRequest1.Title, bwBudgetRequest1.ProjectTitle, bwBudgetRequest1.Title);
            //                thiz.hideRowHoverDetails();
            //            });

            //        } catch (e) {
            //            console.log('Exception in bwCoreComponent.js.showRowHoverDetails.divRowHoverDetails.dialog.open(): ' + e.message + ', ' + e.stack);
            //            displayAlertDialog('Exception in bwCoreComponent.js.showRowHoverDetails.divRowHoverDetails.dialog.open(): ' + e.message + ', ' + e.stack);
            //        }
            //    },
            //    close: function () {
            //        $('#divRowHoverDetails').dialog('destroy');
            //    }
            //});
            //$('#divRowHoverDetails').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();

            ////alert('xcx1`3123 imagePath2: ' + imagePath2 + ', json: ' + JSON.stringify(json));
            //$.get(imagePath2).done(function () {
            //    setTimeout(function () { // Only needs to happen for Chrome.
            //        //var img = document.getElementById('imgRequestOrgImage');
            //        //img.attr.src = imagePath2;
            //        $('#imgRequestOrgImage2').attr('src', imagePath2);
            //    }, 500);
            //}).fail(function () {
            //    //alert("This org has no image."); // do nothing 
            //});
            //// End: Getting the custom image
            ////

        } catch (e) {
            console.log('Exception in bwCoreComponent.js.showRowHoverDetails(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwCoreComponent.js.showRowHoverDetails(): ' + e.message + ', ' + e.stack);
        }
    },

    showThumbnailHoverDetails: function (imageJson, bwBudgetRequestId, hoverElement) {
        try {
            // If task is true, then we lookup the request below to get details from the bwRequestJson (which is not immediately available to a task).
            console.log('In bwCoreComponent.js.showThumbnailHoverDetails().');
            var thiz = this;
            debugger;
            //displayAlertDialog('In bwCoreComponent.js.showThumbnailHoverDetails(). imageJson: ' + decodeURIComponent(imageJson));
            var json = JSON.parse(decodeURIComponent(imageJson));

            var bwWorkflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            var preventCachingGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });

            //debugger;

            //var filename = json.Display_Filename; // json.Actual_Filename;
            var imageUrl = thiz.options.operationUriPrefix + '_files/' + bwWorkflowAppId + '/' + bwBudgetRequestId + '/' + json.Display_Filename;
            //alert('xcx123143 imageUrl: ' + imageUrl);
            var html = '';
            html += '<table>';

            html += '<tr>';

            html += '   <td>';

            html += json.Display_Filename;

            // Display the file attachment description.
            if (json.Description.length > 0) {
                //$('#' + attachmentsSectionId).append('&nbsp;&nbsp;<span class="attachmentsSectionDescription"> - "' + description + '"</span>');

                html += '<br /><span class="attachmentsSectionDescription"> - "' + json.Description + '"</span>';
                //html += '<br /><span class="attachmentsSectionSize"> - ' + size + ' mb</span>';
            } else {
                //$('#' + attachmentsSectionId).append('&nbsp;&nbsp;<span class="attachmentsSectionDescription"> - [no description]' + description + '</span>'); // Leave the description variable here because then we will know if something unexpected happens.

                html += '<br /><span class="attachmentsSectionDescription"> - [no description]' + json.Description + '</span>';

            }

            //if (json.Size && json.Size.toLowerCase() && (json.Size.toLowerCase() == 'na')) {
            //    html += '<br /><span xcx="xcx1123-1" class="attachmentsSectionDescription" style="">[size unavailable]</span>';
            //} else {
            html += '<br /><span xcx="xcx1123-2" class="attachmentsSectionDescription">' + json.Size + ' MB</span>';
            //}

            // birthtime
            var timestamp4 = bwCommonScripts.getBudgetWorkflowStandardizedDate(json.Birthtime);
            var birthtime = timestamp4.toString();
            if (!birthtime) {
                html += '<br /><span class="attachmentsSectionDescription" style="">[birthtime unavailable]</span>';
            } else {
                html += '<br /><span class="attachmentsSectionDescription">' + birthtime + '</span>';
            }

            if (!json.bwParticipantFriendlyName) {
                html += '<br /><span class="attachmentsSectionDescription" style="">[participantFriendlyName unavailable]</span>';
            } else {
                html += '<br /><span class="attachmentsSectionDescription">' + json.bwParticipantFriendlyName + '</span>';
            }

            //if (showRemoveAttachmentButton && (showRemoveAttachmentButton == 'true')) {
            //    html += '&nbsp;&nbsp;<input type="button" style="cursor:pointer;" id="removeBudgetRequestAttachment' + i + '" value="Remove" onclick="removeAttachment(\'' + results.data[i].Display_Filename + '\', \'' + attachmentsTagId + '\', \'' + bwWorkflowAppId + '\', \'' + bwBudgetRequestId + '\');" />';
            //}

            html += '</td>';






            html += '</tr>';

            html += '<tr>';
            html += '   <td>';

            var extensionIndex = json.Display_Filename.split('.').length - 1;
            var fileExtension = json.Display_Filename.toLowerCase().split('.')[extensionIndex];
            if ((fileExtension == 'xlsx') || (fileExtension == 'xls')) {

                html += '<img xcx="xcx443321-1" src="images/excelicon.png" style="" />';

            } else if (fileExtension == 'pdf') {

                //html += '<img xcx="xcx443321-2" src="images/pdf.png" style="width:100px;cursor:pointer;" />';
                html += '<img xcx="xcx443321-7-3" src="' + imageUrl + '?v=' + preventCachingGuid + '" style="border:1px solid gray;" />';

            } else if (fileExtension == 'mp4') {

                var imgId = 'img_bwExecutiveSummariesCarousel2_' + elementIdSuffix + '_' + bwBudgetRequestId + '_' + bwWorkflowTaskItemId + '_' + i;
                html += '<img xcx="xcx443321-3-2" id="' + imgId + '" style="display:block;margin-left:auto;margin-right:auto;" alt="" />';
                html += '<br />';

                this.displayImageThumbnail(imgId, imageUrl);

            } else if (fileExtension == 'rtf') {

                html += '<img xcx="xcx443321-4" src="images/rtf.png" style="" />';

            } else if (fileExtension == 'vob') {

                html += '<img xcx="xcx443321-5" src="images/vob.png" style="" />';

            } else if (fileExtension == 'mp3') {

                html += '<img xcx="xcx443321-6" src="images/mp3.png" style="" />';

            } else {

                if (json.Thumbnail != true) { // Display thumbnails with a rounded corner.
                    html += '<img xcx="xcx443321-7-4" src="' + imageUrl + '?v=' + preventCachingGuid + '" style="max-width:1000px;" />';
                } else {
                    //html += '<img xcx="xcx443321-8" src="' + fileUrl_Thumbnail + '?v=' + preventCachingGuid + '" style="height:150px;max-width:500px;border:1px solid gray;border-radius:0 30px 0 0;" />';

                    html += '<img xcx="xcx443321-8-2" src="' + imageUrl + '?v=' + preventCachingGuid + '" style="max-width:1000px;border:1px solid gray;border-radius:0 30px 0 0;" ';
                    //html += '   onmouseenter="$(\'.bwCoreComponent:first\').bwCoreComponent(\'showThumbnailHoverDetails\', \'' + bwEncodeURIComponent(JSON.stringify(results.data[i])) + '\');this.style.backgroundColor=\'lightgoldenrodyellow\';" ';
                    //html += '   onmouseleave="$(\'.bwExecutiveSummariesCarousel2\').bwExecutiveSummariesCarousel2(\'hideRowHoverDetails\');"'; //this.style.backgroundColor=\'white\';"';
                    html += ' />';

                }
                html += '<br />';

            }

            html += '   </td>';
            html += '</tr>';




            html += '</table>';

            document.getElementById('spanRowHoverDetails_DialogContents').innerHTML = html;

            var position = {};
            if (hoverElement) {
                // This is intended to prevent the magnifying glass from appearing under the hover-dialog... which will prevent all the screen flash etc.
                // If we have the hoverElement (the magnifying glass), we can display the hover-dialog to the right to prevent the "collision".

                //var magnifyingGlassElement = $(hoverElement).find('.gridMagnifyingGlass:first');

                position = {
                    my: "left+60 top-200",
                    at: "right top",
                    of: hoverElement
                };

            }

            $('#divRowHoverDetails').dialog({
                resizable: false,
                draggable: false,
                width: "760",
                position: position,
                open: function (event, ui) {
                    try {

                        //$('#divRowHoverDetails').unbind('click', function () { }); // removed 11-30-2022

                        //$(this).unbind('click').bind('click', function () {
                        //    console.log('Displaying the request in the dialog [calling displayArInDialog()].');
                        //    $('.bwRequest').bwRequest('displayArInDialog', thiz.options.operationUriPrefix, json.BwBudgetRequestId, json.Title, json.ProjectTitle, json.Title);
                        //    thiz.hideRowHoverDetails();
                        //});

                    } catch (e) {
                        console.log('Exception in bwCoreComponent.js.showThumbnailHoverDetails.divRowHoverDetails.dialog.open(): ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwCoreComponent.js.showThumbnailHoverDetails.divRowHoverDetails.dialog.open(): ' + e.message + ', ' + e.stack);
                    }
                },
                close: function () {
                    $('#divRowHoverDetails').dialog('destroy');
                }
            });
            $('#divRowHoverDetails').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();

        } catch (e) {
            console.log('Exception in bwCoreComponent.js.showThumbnailHoverDetails(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwCoreComponent.js.showThumbnailHoverDetails(): ' + e.message + ', ' + e.stack);
        }
    },



    showRowHoverDetails_OrgSmall: function (title, projectTitle, briefDescriptionOfProject, bwWorkflowAppId, bwBudgetRequestId) {
        try {
            console.log('In showRowHoverDetails_OrgSmall().');
            var thiz = this;
            //debugger;
            //var x = event.target;
            $('#divRowHoverDetails').dialog({
                resizable: false,
                draggable: false,
                width: "200"
            });
            $('#divRowHoverDetails').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();



            //
            // Display the header for the hover over details dialog.
            var html = '';
            html += '<table>';
            html += '  <tr>';
            html += '    <td style="text-align:center;">';
            html += '      <img src="' + thiz.options.operationUriPrefix + 'images/corporeal.png" style="width:180px;height:180px;" />';
            html += '        <br />';
            // The "under the org image" text
            html += '<span style="font-size:10pt;">';
            html += workflowAppTitle;
            html += '</span>';

            html += '    </td>';
            html += '    <td style="vertical-align:top;">';
            html += '      <span id="spanRowHoverDetails_AuditTrail_CurrentRACIStatus" style="font-size:10pt;">';
            html += '        <span style="font-size:30pt;font-weight:bold;">' + title + '</span>';
            html += '        <br />';
            html += '        [spanRowHoverDetails_AuditTrail_CurrentRACIStatus]';
            html += '      </span>';
            html += '    </td>';
            html += '  </tr>';
            html += '</table>';
            document.getElementById('spanRowHoverDetailsDialogTitleAndCurrentRACIStatus').innerHTML = html;
            // End: Display the header for the hover over details dialog.
            //



            html = projectTitle + '<br />' + briefDescriptionOfProject;
            document.getElementById('spanRowHoverDetails_DialogContents').innerHTML = html;

            $('#tableRowHoverDetails').off('click').click(function (error) { // This is so that if the dialog is in the way, the user can still click on it and the AR will be displayted. 
                //alert('YEEEEEAAAAAAAAAAAAAAHHHHHHHHHHHHHH!');
                thiz.hideRowHoverDetails();
                $('.bwRequest').bwRequest('displayArInDialog', this.options.operationUriPrefix, bwBudgetRequestId, title, projectTitle, title);
            });



            //
            // Ajax call to get the primary image.
            //
            var operationUri = this.options.operationUriPrefix + '_files/' + 'getprimaryimageforbudgetrequest/' + bwWorkflowAppId + '/' + bwBudgetRequestId; // _files allows us to use nginx to route these to a dedicated file server.
            $.ajax({
                url: operationUri,
                method: "GET",
                timeout: ajaxTimeout,
                headers: { "Accept": "application/json; odata=verbose" },
                success: function (data) {
                    //debugger;
                    //displayAlertDialog('bw.initar.core.js.populateAttachments().getlistofattachmentsforbudgetrequest: ' + JSON.stringify(data));

                    //if (JSON.stringify(data).indexOf('ENOENT') > -1) {
                    //    //ENOENT: no such file or directory)

                    //    $('#' + attachmentsSectionId).empty();
                    //    $('#' + attachmentsSectionId).append('<span style="font-style:italic;font-size:22pt;">' + '[Error occurred on the file server]' + '</span>');

                    //    WriteToErrorLog('Error in bw.initar.core.js.populateAttachments()', JSON.stringify(data));

                    //} else {
                    //displayAlertDialog('bw.initar.core.js.populateAttachments().getlistofattachmentsforbudgetrequest: ' + JSON.stringify(data));
                    //displayAlertDialog('Number of attachments: ' + data.length);
                    // Now we iterate through all of the files and add them to the attachments list on the page.
                    //$('#' + attachmentsTagId).empty();
                    try {
                        //for (var i = 0; i < data.length; i++) {

                        //    //Filename: filename,
                        //    //Description: description


                        //    var filename = data[i].Filename;
                        //    var description = data[i].Description;

                        //    console.log('In bw.initar.core.js.populateAttachments(). description: ' + description);

                        //    var fileUrl = "_files/" + _workflowAppId + "/" + _budgetRequestId + "/" + filename;
                        //    //$('#' + attachmentsSectionId).append("<span style=\"WIDTH: 100%; contentEditable=false;\" >");
                        //    //$('#' + attachmentsSectionId).append("<a target=\"_blank\" href=\"" + fileUrl + "\">" + filename + "</a>");
                        //    //$('#' + attachmentsSectionId).append("<input type=\"button\" id=\"removeBudgetRequestAttachment" + i + "\" value=\"Remove\" onclick=\"removeAttachment('" + filename + "');\" />");
                        //    //$('#' + attachmentsSectionId).append("</span></br>");


                        //    //$('span[xd\\:binding = "my:Location"]')[0].innerHTML = 'filename: ' + filename; // THIS IS just the way I am debugging by putting text in the field.
                        //    //$('#' + attachmentsSectionId)[0].innerHTML = 'filename: ' + filename;

                        //    // Centered on the screen.
                        //    var width = 800;
                        //    var height = 600;
                        //    var left = (screen.width - width) / 2;
                        //    var top = (screen.height - height) / 2;
                        //    //$('#' + attachmentsSectionId).append('<span style="WIDTH: 100%;" onclick="window.open(\'' + fileUrl + '\', \'window1\', \'width=600, height=100\');return false;">' + filename + '</span>'); 



                        //    //$('#' + attachmentsSectionId).append('<div style="height:50px;border:1px thin red;">'); // This is the height of the link for the attachment!!!

                        //    var html = '';

                        //    html += '<table style="width:100%;">';
                        //    html += '  <tr>';
                        //    html += '    <td style="width:10%;">';
                        //    // Display the image thumbnail.
                        //    if (filename.toLowerCase().indexOf('.png') > -1 || filename.toLowerCase().indexOf('.jpg') > -1 || filename.toLowerCase().indexOf('.jpeg') > -1) {
                        //        html += '<img src="' + globalUrlPrefix + globalUrlForWebServices + '/' + fileUrl + '" style="height:120px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;" alt="" ';
                        //        if (Platform == 'IOS8') {
                        //            //html += 'onclick="displayAttachmentInDialog(\'' + globalUrlPrefix + globalUrlForWebServices + '/' + fileUrl + '\', \'' + description + '\', \'' + _budgetRequestId + '\', \'' + attachmentsTagId + '\');"';
                        //            html += 'onclick="displayAttachmentInDialog(\'' + globalUrlPrefix + globalUrlForWebServices + '/' + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + _budgetRequestId + '\');"';
                        //        } else {
                        //            //html += 'onclick="window.open(\'' + fileUrl + '\', \'window1\', \'width=' + width + ', height=' + height + ', top=' + top + ', left=' + left + ', resizable=yes\');return false;"';
                        //            html += 'onclick="displayAttachmentInDialog(\'' + globalUrlPrefix + globalUrlForWebServices + '/' + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + _budgetRequestId + '\');" ';

                        //        }
                        //        html += ' />';
                        //    }
                        //    html += '    </td>';
                        //    html += '    <td style="width:90%;">';

                        //    // We need an if statement here to choose between iOS and Windows.
                        //    if (Platform == 'IOS8') {
                        //        //html += '<div class="attachmentsSectionFileLink" style="height:50px;border:1px thin red;" onclick="displayAttachmentInDialog(\'' + globalUrlPrefix + globalUrlForWebServices + '/' + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + _budgetRequestId + '\');">';
                        //        html += '<div class="attachmentsSectionFileLink" style="height:50px;border:1px thin red;" onclick="displayAttachmentInDialog(\'' + globalUrlPrefix + globalUrlForWebServices + '/' + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + _budgetRequestId + '\');">';
                        //    } else {

                        //        //html += '<div class="attachmentsSectionFileLink" style="height:50px;border:1px thin red;" onclick="window.open(\'' + fileUrl + '\', \'window1\', \'width=' + width + ', height=' + height + ', top=' + top + ', left=' + left + ', resizable=yes\');return false;">';
                        //        //html += '<div style="cursor:pointer;" class="attachmentsSectionFileLink" onclick="displayAttachmentInDialog(\'' + globalUrlPrefix + globalUrlForWebServices + '/' + fileUrl + '\', \'' + description + '\', \'' + _budgetRequestId + '\', \'' + attachmentsTagId + '\');">';
                        //        html += '<div style="cursor:pointer;" class="attachmentsSectionFileLink" onclick="displayAttachmentInDialog(\'' + globalUrlPrefix + globalUrlForWebServices + '/' + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + _budgetRequestId + '\');">';

                        //    }

                        //    html += filename;

                        //    // Display the file attachment description.
                        //    if (description.length > 0) {
                        //        //$('#' + attachmentsSectionId).append('&nbsp;&nbsp;<span class="attachmentsSectionDescription"> - "' + description + '"</span>');

                        //        html += '&nbsp;&nbsp;<span class="attachmentsSectionDescription"> - "' + description + '"</span>';
                        //    } else {
                        //        //$('#' + attachmentsSectionId).append('&nbsp;&nbsp;<span class="attachmentsSectionDescription"> - [no description]' + description + '</span>'); // Leave the description variable here because then we will know if something unexpected happens.

                        //        html += '&nbsp;&nbsp;<span class="attachmentsSectionDescription"> - [no description]' + description + '</span>';
                        //    }

                        //    if (showRemoveAttachmentButton == 'true') {
                        //        //$('#' + attachmentsSectionId).append("&nbsp;&nbsp;<input type=\"button\" style=\"cursor:pointer;\" id=\"removeBudgetRequestAttachment" + i + "\" value=\"Remove\" onclick=\"removeAttachment('" + filename + "', '" + attachmentsSectionId + "', '" + _workflowAppId + "', '" + _budgetRequestId + "');\" />");

                        //        html += '&nbsp;&nbsp;<input type="button" style="cursor:pointer;" id="removeBudgetRequestAttachment' + i + '" value="Remove" onclick="removeAttachment(\'' + filename + '\', \'' + attachmentsTagId + '\', \'' + _workflowAppId + '\', \'' + _budgetRequestId + '\');" />';
                        //    }

                        //    //$('#' + attachmentsSectionId).append("</br>");
                        //    //html += '</br>';

                        //    html += '</div>';

                        //    html += '</br>';
                        //    //$('#' + attachmentsSectionId).append('</div>');

                        //    $('#' + attachmentsTagId).append(html);
                        //}






                        //debugger;
                        document.getElementById('spanImageXXx').innerHTML = '';
                        try {
                            for (var i = 0; i < data.length; i++) {
                                var fileName = data[i].Filename;
                                var imageUrl = thiz.options.operationUriPrefix + '_files/' + bwWorkflowAppId + '/' + bwBudgetRequestId + '/' + fileName;

                                html = '<img src="' + imageUrl + '" style="height:300px;" />';
                                document.getElementById('spanImageXXx').innerHTML += html;
                            }
                        } catch (e) {
                            console.log('Didn\'t find an image for data: ' + JSON.stringify(data));
                            html = '[no image found]';
                            document.getElementById('spanImageXXx').innerHTML = html;
                        }


                    } catch (e) {
                        if (e.number) {
                            displayAlertDialog('Error in populateAttachments():1-2: ' + e.number + ', "' + e.message + '", ' + e.stack);
                        } else {
                            // This most likely means that the folders are there on the file services server, but there is nothing in them.
                            //
                            // Fileservices has an error, so show nothing! We will put a red exclamation pin in the attachments section eventually! - 10-1-17 todd
                            //displayAlertDialog('Fileservices has an error: ' + ' "' + e.message + '"');
                        }
                    }
                    //}
                },
                error: function (data, errorCode, errorMessage) {

                    if (errorCode === 'timeout' && errorMessage === 'timeout') {
                        displayAlertDialog('File services is not respondingxcx3. communication timeout is set at ' + ajaxTimeout / 1000 + ' seconds: ' + errorCode + ', ' + errorMessage);
                    } else {

                        console.log('Error in showRowHoverDetails_OrgSmall:2: ' + errorCode + ', ' + errorMessage);


                        displayAlertDialog('Error in showRowHoverDetails_OrgSmall:2: ' + errorCode + ', ' + errorMessage);
                        // The latest error 1-17-2018 is errorCode:'error' and errorMessage:'Not Found'.
                        // What does this mean? You can replicate this error!
                        // at Url: https://budgetworkflow.com/ios8.html, view an offline (Un-submitted) request, and try to add an attachment.





                    }

                }
            });
























        } catch (e) {
            console.log('Exception in showRowHoverDetails_OrgSmall(): ' + e.message + ', ' + e.stack);
        }
    },


    hideRowHoverDetails: function (e) {
        try {
            console.log('In hideRowHoverDetails().');
            if (document.getElementById('divRowHoverDetails').style.display != 'none') {
                //// This means the dialog is being displayed.
                //var isMouseInBox = false;

                ////function isMouseInBox(e) {
                //var textbox = document.getElementById('divRowHoverDetails');

                //    // Box position & sizes
                //    var boxX = textbox.offsetLeft;
                //    var boxY = textbox.offsetTop;
                //    var boxWidth = textbox.offsetWidth;
                //    var boxHeight = textbox.offsetHeight;

                //    // Mouse position comes from the 'mousemove' event
                //    var mouseX = e.pageX;
                //    var mouseY = e.pageY;
                //    if (mouseX >= boxX && mouseX <= boxX + boxWidth) {
                //        if (mouseY >= boxY && mouseY <= boxY + boxHeight) {
                //            // Mouse is in the box
                //            isMouseInBox = true;
                //            //debugger;
                //        }
                //    }
                ////}


                //    if (isMouseInBox == false) {
                $('#divRowHoverDetails').dialog('close');
                //}
            }
        } catch (e) {
            console.log('Exception in hideRowHoverDetails(): ' + e.message + ', ' + e.stack);
        }
    },


    showEmailRowHoverDetails: function (email) { // \'' + 'To: ' + data[i].ToParticipantEmail + '\', \'' + 'budgetRequests[i].ProjectTitle' + '\', \'' + data[i].Body + '
        try {
            //debugger;


            console.log('In showEmailRowHoverDetails(). email: ' + JSON.stringify(email));

            var email2 = JSON.parse(email);

            var thiz = this;
            //debugger;
            //var x = event.target;
            $('#divRowHoverDetails').dialog({
                resizable: false,
                draggable: false,
                width: "760"
            });

            $('#divRowHoverDetails').dialog().parents('.ui-dialog').find('.ui-dialog-titlebar').remove();

            var html = '';
            html += email.ToParticipantEmail;
            document.getElementById('spanRowHoverDetailsDialogTitle').innerHTML = html;

            html = email.ProjectTitle + '<br />' + email.BriefDescriptionOfProject;
            document.getElementById('spanRowHoverDetails_DialogContents').innerHTML = html;




            //
            // Ajax call to get the primary image.
            //
            var operationUri = this.options.operationUriPrefix + '_files/' + 'getprimaryimageforbudgetrequest/' + bwWorkflowAppId + '/' + bwBudgetRequestId; // _files allows us to use nginx to route these to a dedicated file server.
            $.ajax({
                url: operationUri,
                method: "GET",
                timeout: ajaxTimeout,
                headers: { "Accept": "application/json; odata=verbose" },
                success: function (data) {
                    //debugger;
                    //displayAlertDialog('bw.initar.core.js.populateAttachments().getlistofattachmentsforbudgetrequest: ' + JSON.stringify(data));

                    //if (JSON.stringify(data).indexOf('ENOENT') > -1) {
                    //    //ENOENT: no such file or directory)

                    //    $('#' + attachmentsSectionId).empty();
                    //    $('#' + attachmentsSectionId).append('<span style="font-style:italic;font-size:22pt;">' + '[Error occurred on the file server]' + '</span>');

                    //    WriteToErrorLog('Error in bw.initar.core.js.populateAttachments()', JSON.stringify(data));

                    //} else {
                    //displayAlertDialog('bw.initar.core.js.populateAttachments().getlistofattachmentsforbudgetrequest: ' + JSON.stringify(data));
                    //displayAlertDialog('Number of attachments: ' + data.length);
                    // Now we iterate through all of the files and add them to the attachments list on the page.
                    //$('#' + attachmentsTagId).empty();
                    try {
                        //for (var i = 0; i < data.length; i++) {

                        //    //Filename: filename,
                        //    //Description: description


                        //    var filename = data[i].Filename;
                        //    var description = data[i].Description;

                        //    console.log('In bw.initar.core.js.populateAttachments(). description: ' + description);

                        //    var fileUrl = "_files/" + _workflowAppId + "/" + _budgetRequestId + "/" + filename;
                        //    //$('#' + attachmentsSectionId).append("<span style=\"WIDTH: 100%; contentEditable=false;\" >");
                        //    //$('#' + attachmentsSectionId).append("<a target=\"_blank\" href=\"" + fileUrl + "\">" + filename + "</a>");
                        //    //$('#' + attachmentsSectionId).append("<input type=\"button\" id=\"removeBudgetRequestAttachment" + i + "\" value=\"Remove\" onclick=\"removeAttachment('" + filename + "');\" />");
                        //    //$('#' + attachmentsSectionId).append("</span></br>");


                        //    //$('span[xd\\:binding = "my:Location"]')[0].innerHTML = 'filename: ' + filename; // THIS IS just the way I am debugging by putting text in the field.
                        //    //$('#' + attachmentsSectionId)[0].innerHTML = 'filename: ' + filename;

                        //    // Centered on the screen.
                        //    var width = 800;
                        //    var height = 600;
                        //    var left = (screen.width - width) / 2;
                        //    var top = (screen.height - height) / 2;
                        //    //$('#' + attachmentsSectionId).append('<span style="WIDTH: 100%;" onclick="window.open(\'' + fileUrl + '\', \'window1\', \'width=600, height=100\');return false;">' + filename + '</span>'); 



                        //    //$('#' + attachmentsSectionId).append('<div style="height:50px;border:1px thin red;">'); // This is the height of the link for the attachment!!!

                        //    var html = '';

                        //    html += '<table style="width:100%;">';
                        //    html += '  <tr>';
                        //    html += '    <td style="width:10%;">';
                        //    // Display the image thumbnail.
                        //    if (filename.toLowerCase().indexOf('.png') > -1 || filename.toLowerCase().indexOf('.jpg') > -1 || filename.toLowerCase().indexOf('.jpeg') > -1) {
                        //        html += '<img src="' + globalUrlPrefix + globalUrlForWebServices + '/' + fileUrl + '" style="height:120px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;" alt="" ';
                        //        if (Platform == 'IOS8') {
                        //            //html += 'onclick="displayAttachmentInDialog(\'' + globalUrlPrefix + globalUrlForWebServices + '/' + fileUrl + '\', \'' + description + '\', \'' + _budgetRequestId + '\', \'' + attachmentsTagId + '\');"';
                        //            html += 'onclick="displayAttachmentInDialog(\'' + globalUrlPrefix + globalUrlForWebServices + '/' + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + _budgetRequestId + '\');"';
                        //        } else {
                        //            //html += 'onclick="window.open(\'' + fileUrl + '\', \'window1\', \'width=' + width + ', height=' + height + ', top=' + top + ', left=' + left + ', resizable=yes\');return false;"';
                        //            html += 'onclick="displayAttachmentInDialog(\'' + globalUrlPrefix + globalUrlForWebServices + '/' + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + _budgetRequestId + '\');" ';

                        //        }
                        //        html += ' />';
                        //    }
                        //    html += '    </td>';
                        //    html += '    <td style="width:90%;">';

                        //    // We need an if statement here to choose between iOS and Windows.
                        //    if (Platform == 'IOS8') {
                        //        //html += '<div class="attachmentsSectionFileLink" style="height:50px;border:1px thin red;" onclick="displayAttachmentInDialog(\'' + globalUrlPrefix + globalUrlForWebServices + '/' + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + _budgetRequestId + '\');">';
                        //        html += '<div class="attachmentsSectionFileLink" style="height:50px;border:1px thin red;" onclick="displayAttachmentInDialog(\'' + globalUrlPrefix + globalUrlForWebServices + '/' + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + _budgetRequestId + '\');">';
                        //    } else {

                        //        //html += '<div class="attachmentsSectionFileLink" style="height:50px;border:1px thin red;" onclick="window.open(\'' + fileUrl + '\', \'window1\', \'width=' + width + ', height=' + height + ', top=' + top + ', left=' + left + ', resizable=yes\');return false;">';
                        //        //html += '<div style="cursor:pointer;" class="attachmentsSectionFileLink" onclick="displayAttachmentInDialog(\'' + globalUrlPrefix + globalUrlForWebServices + '/' + fileUrl + '\', \'' + description + '\', \'' + _budgetRequestId + '\', \'' + attachmentsTagId + '\');">';
                        //        html += '<div style="cursor:pointer;" class="attachmentsSectionFileLink" onclick="displayAttachmentInDialog(\'' + globalUrlPrefix + globalUrlForWebServices + '/' + fileUrl + '\', \'' + filename + '\', \'' + description + '\', \'' + _budgetRequestId + '\');">';

                        //    }

                        //    html += filename;

                        //    // Display the file attachment description.
                        //    if (description.length > 0) {
                        //        //$('#' + attachmentsSectionId).append('&nbsp;&nbsp;<span class="attachmentsSectionDescription"> - "' + description + '"</span>');

                        //        html += '&nbsp;&nbsp;<span class="attachmentsSectionDescription"> - "' + description + '"</span>';
                        //    } else {
                        //        //$('#' + attachmentsSectionId).append('&nbsp;&nbsp;<span class="attachmentsSectionDescription"> - [no description]' + description + '</span>'); // Leave the description variable here because then we will know if something unexpected happens.

                        //        html += '&nbsp;&nbsp;<span class="attachmentsSectionDescription"> - [no description]' + description + '</span>';
                        //    }

                        //    if (showRemoveAttachmentButton == 'true') {
                        //        //$('#' + attachmentsSectionId).append("&nbsp;&nbsp;<input type=\"button\" style=\"cursor:pointer;\" id=\"removeBudgetRequestAttachment" + i + "\" value=\"Remove\" onclick=\"removeAttachment('" + filename + "', '" + attachmentsSectionId + "', '" + _workflowAppId + "', '" + _budgetRequestId + "');\" />");

                        //        html += '&nbsp;&nbsp;<input type="button" style="cursor:pointer;" id="removeBudgetRequestAttachment' + i + '" value="Remove" onclick="removeAttachment(\'' + filename + '\', \'' + attachmentsTagId + '\', \'' + _workflowAppId + '\', \'' + _budgetRequestId + '\');" />';
                        //    }

                        //    //$('#' + attachmentsSectionId).append("</br>");
                        //    //html += '</br>';

                        //    html += '</div>';

                        //    html += '</br>';
                        //    //$('#' + attachmentsSectionId).append('</div>');

                        //    $('#' + attachmentsTagId).append(html);
                        //}






                        //debugger;
                        document.getElementById('spanImageXXx').innerHTML = '';
                        try {
                            for (var i = 0; i < data.length; i++) {
                                var fileName = data[i].Filename;
                                var imageUrl = thiz.options.operationUriPrefix + '_files/' + bwWorkflowAppId + '/' + bwBudgetRequestId + '/' + fileName;

                                html = '<img src="' + imageUrl + '" style="height:300px;" />';
                                document.getElementById('spanImageXXx').innerHTML += html;
                            }
                        } catch (e) {
                            console.log('Didn\'t find an image for data: ' + JSON.stringify(data));
                            html = '[no image found]';
                            document.getElementById('spanImageXXx').innerHTML = html;
                        }


                    } catch (e) {
                        if (e.number) {
                            displayAlertDialog('Error in populateAttachments():1-3: ' + e.number + ', "' + e.message + '", ' + e.stack);
                        } else {
                            // This most likely means that the folders are there on the file services server, but there is nothing in them.
                            //
                            // Fileservices has an error, so show nothing! We will put a red exclamation pin in the attachments section eventually! - 10-1-17 todd
                            //displayAlertDialog('Fileservices has an error: ' + ' "' + e.message + '"');
                        }
                    }
                    //}
                },
                error: function (data, errorCode, errorMessage) {

                    if (errorCode === 'timeout' && errorMessage === 'timeout') {
                        displayAlertDialog('File services is not respondingxcx4. communication timeout is set at ' + ajaxTimeout / 1000 + ' seconds: ' + errorCode + ', ' + errorMessage);
                    } else {

                        console.log('Error in showEmailRowHoverDetails:2: ' + errorCode + ', ' + errorMessage);


                        displayAlertDialog('Error in showEmailRowHoverDetails:2: ' + errorCode + ', ' + errorMessage);
                        // The latest error 1-17-2018 is errorCode:'error' and errorMessage:'Not Found'.
                        // What does this mean? You can replicate this error!
                        // at Url: https://budgetworkflow.com/ios8.html, view an offline (Un-submitted) request, and try to add an attachment.





                    }

                }
            });

        } catch (e) {
            console.log('Exception in showEmailRowHoverDetails(): ' + e.message + ', ' + e.stack);
        }
    },


    populateTheYearDropdown: function (elementId, isQuotes) {
        try {
            console.log('In bwCoreComponent.js.populateTheYearDropdown(). DO WE NEED THIS? COME BACK AND CHECK THIS CODE. 1-30-2024.');
            //displayAlertDialog_Persistent('In bwCoreComponent.js.populateTheYearDropdown().');

            //if (BWMData.length > 0) {
            //    if (BWMData[1] && BWMData[1][0]) {
            //        var functionalAreaYearsForBudgetRequests = BWMData[1][0];
            //        //var functionalAreaYearsForBudgetRequests = ['2020'];
            //        //var functionalAreaYearsForQuotes = BWMData[1][1];


            // Changed this 1-24-2022. Do we still need all this old code??? Not sure how much we are using BWMData any more.
            //var thisYear = new Date().getFullYear();
            var thisYear = $('.bwAuthentication').bwAuthentication('option', 'workflowAppFiscalYear'); // new Date().getFullYear(); // 

            //debugger;
            ////var selectedYear = $('#ddlYear').val();
            //var selectedYear = null;
            //isQuotes = false;
            //$('#' + elementId).empty(); // was ddlYear
            //if (selectedYear == null) {
            //    // Nothing is in the drop down, so we have to populate it and select a default value.
            //    //debugger;
            //    if (isQuotes == false) {
            //        //var xx = functionalAreaYearsForBudgetRequests.includes(Number(thisYear)); // THIS DOESN't work for number arrays... just a quick fix so doing a loop here.
            //        var selectThisYear = false;
            //        for (var y = 0; y < functionalAreaYearsForBudgetRequests.length; y++) {
            //            if (functionalAreaYearsForBudgetRequests[y] == thisYear) {
            //                selectThisYear = true;
            //            }
            //        }
            //        if (selectThisYear == true) {
            //            // thisYear is present.
            //            //debugger;
            //            for (var i = 0; i < functionalAreaYearsForBudgetRequests.length; i++) {
            //                if (functionalAreaYearsForBudgetRequests[i] == thisYear) {
            //                    $("<option value='" + functionalAreaYearsForBudgetRequests[i].toString() + "' selected>" + functionalAreaYearsForBudgetRequests[i].toString() + "</option>").appendTo($('#' + elementId));
            //                } else {
            //                    $("<option value='" + functionalAreaYearsForBudgetRequests[i].toString() + "'>" + functionalAreaYearsForBudgetRequests[i].toString() + "</option>").appendTo($('#' + elementId));
            //                }
            //            }
            //        } else {
            //            // thisYear is NOT present, so just select the latest one. For instance, if 2014, 2015 and it is 2016, then 2015 should be selected.
            //            var latestYear = null;
            //            for (var x = 0; x < functionalAreaYearsForBudgetRequests.length; x++) {
            //                // The functionalAreaYearsForBudgetRequests array is in order (eg. 2013, 2014, 2015), so we just go through the whole thing.
            //                if (functionalAreaYearsForBudgetRequests[x] < thisYear) latestYear = functionalAreaYearsForBudgetRequests[x];
            //            }
            //            for (var i = 0; i < functionalAreaYearsForBudgetRequests.length; i++) {
            //                if (functionalAreaYearsForBudgetRequests[i] == latestYear) {
            //                    $("<option value='" + functionalAreaYearsForBudgetRequests[i].toString() + "' selected>" + functionalAreaYearsForBudgetRequests[i].toString() + "</option>").appendTo($('#' + elementId));
            //                } else {
            //                    $("<option value='" + functionalAreaYearsForBudgetRequests[i].toString() + "'>" + functionalAreaYearsForBudgetRequests[i].toString() + "</option>").appendTo($('#' + elementId));
            //                }
            //            }
            //        }


            //        // 9-1-2021 Added this to fix not seeing 2021 in the list. Once functional areas are working again this may go away.
            //        var wasThisYearIncluded = false;
            //        for (var i = 0; i < functionalAreaYearsForBudgetRequests.length; i++) {
            //            if (functionalAreaYearsForBudgetRequests[i] == thisYear) {
            //                wasThisYearIncluded = true;
            //            }
            //        }
            //        if (wasThisYearIncluded != true) {


            //            // changed 2-17-2022
            //            //$("<option value='" + thisYear.toString() + "' selected>" + thisYear.toString() + "</option>").appendTo($('#' + elementId));
            //            $("<option value='" + thisYear + "' selected>" + thisYear + "</option>").appendTo($('#' + elementId));


            //        }
            //        // end 9-1-2021



            //    } else if (isQuotes == true) {
            //        if (functionalAreaYearsForQuotes.indexOf(thisYear) > -1) {
            //            // thisYear is present.
            //            for (var i = 0; i < functionalAreaYearsForQuotes.length; i++) {
            //                if (functionalAreaYearsForQuotes[i] == thisYear) {
            //                    $("<option value='" + functionalAreaYearsForQuotes[i].toString() + "' selected>" + functionalAreaYearsForQuotes[i].toString() + "</option>").appendTo($('#' + elementId));
            //                } else {
            //                    $("<option value='" + functionalAreaYearsForQuotes[i].toString() + "'>" + functionalAreaYearsForQuotes[i].toString() + "</option>").appendTo($('#' + elementId));
            //                }
            //            }
            //        } else {
            //            // thisYear is NOT present, so just select the latest one. For instance, if 2014, 2015 and it is 2016, then 2015 should be selected.
            //            var latestYear = null;
            //            for (var x = 0; x < functionalAreaYearsForQuotes.length; x++) {
            //                // The functionalAreaYearsForQuotes array is in order (eg. 2013, 2014, 2015), so we just go through the whole thing.
            //                if (functionalAreaYearsForQuotes[x] < thisYear) latestYear = functionalAreaYearsForQuotes[x];
            //            }
            //            for (var i = 0; i < functionalAreaYearsForQuotes.length; i++) {
            //                if (functionalAreaYearsForQuotes[i] == latestYear) {
            //                    $("<option value='" + functionalAreaYearsForQuotes[i].toString() + "' selected>" + functionalAreaYearsForQuotes[i].toString() + "</option>").appendTo($('#' + elementId));
            //                } else {
            //                    $("<option value='" + functionalAreaYearsForQuotes[i].toString() + "'>" + functionalAreaYearsForQuotes[i].toString() + "</option>").appendTo($('#' + elementId));
            //                }
            //            }
            //        }
            //    }
            //} else {
            //    // A year had been selected. We need to populate the year drop down with the year that had already been selected.
            //    if (isQuotes == false) {
            //        if (functionalAreaYearsForBudgetRequests.indexOf(selectedYear) > -1) {
            //            // selectedYear is present.
            //            for (var i = 0; i < functionalAreaYearsForBudgetRequests.length; i++) {
            //                if (functionalAreaYearsForBudgetRequests[i] == selectedYear) {
            //                    $("<option value='" + functionalAreaYearsForBudgetRequests[i].toString() + "' selected>" + functionalAreaYearsForBudgetRequests[i].toString() + "</option>").appendTo($('#' + elementId));
            //                } else {
            //                    $("<option value='" + functionalAreaYearsForBudgetRequests[i].toString() + "'>" + functionalAreaYearsForBudgetRequests[i].toString() + "</option>").appendTo($('#' + elementId));
            //                }
            //            }
            //        } else {

            //            // selectedYear is NOT present, so just select the latest one. For instance, if 2014, 2015 and it is 2016, then 2015 should be selected.
            //            var latestYear = null;
            //            for (var x = 0; x < functionalAreaYearsForBudgetRequests.length; x++) {
            //                // The functionalAreaYearsForQuotes array is in order (eg. 2013, 2014, 2015), so we just go through the whole thing.
            //                if (functionalAreaYearsForBudgetRequests[x] < thisYear) latestYear = functionalAreaYearsForBudgetRequests[x];
            //            }
            //            for (var i = 0; i < functionalAreaYearsForBudgetRequests.length; i++) {
            //                if (functionalAreaYearsForBudgetRequests[i] == latestYear) {
            //                    $("<option value='" + functionalAreaYearsForBudgetRequests[i].toString() + "' selected>" + functionalAreaYearsForBudgetRequests[i].toString() + "</option>").appendTo($('#' + elementId));
            //                } else {
            //                    $("<option value='" + functionalAreaYearsForBudgetRequests[i].toString() + "'>" + functionalAreaYearsForBudgetRequests[i].toString() + "</option>").appendTo($('#' + elementId));
            //                }
            //            }
            //        }
            //    } else if (isQuotes == true) {
            //        if (functionalAreaYearsForQuotes.indexOf(selectedYear) > -1) {
            //            // selectedYear is present.
            //            for (var i = 0; i < functionalAreaYearsForQuotes.length; i++) {
            //                if (functionalAreaYearsForQuotes[i] == selectedYear) {
            //                    $("<option value='" + functionalAreaYearsForQuotes[i].toString() + "' selected>" + functionalAreaYearsForQuotes[i].toString() + "</option>").appendTo($('#' + elementId));
            //                } else {
            //                    $("<option value='" + functionalAreaYearsForQuotes[i].toString() + "'>" + functionalAreaYearsForQuotes[i].toString() + "</option>").appendTo($('#' + elementId));
            //                }
            //            }
            //        } else {
            //            // selectedYear is NOT present, so just select the latest one. For instance, if 2014, 2015 and it is 2016, then 2015 should be selected.
            //            var latestYear = null;
            //            for (var x = 0; x < functionalAreaYearsForQuotes.length; x++) {
            //                // The functionalAreaYearsForQuotes array is in order (eg. 2013, 2014, 2015), so we just go through the whole thing.
            //                if (functionalAreaYearsForQuotes[x] < thisYear) latestYear = functionalAreaYearsForQuotes[x];
            //            }
            //            for (var i = 0; i < functionalAreaYearsForQuotes.length; i++) {
            //                if (functionalAreaYearsForQuotes[i] == selectedYear) {
            //                    $("<option value='" + functionalAreaYearsForQuotes[i].toString() + "' selected>" + functionalAreaYearsForQuotes[i].toString() + "</option>").appendTo($('#' + elementId));
            //                } else {
            //                    $("<option value='" + functionalAreaYearsForQuotes[i].toString() + "'>" + functionalAreaYearsForQuotes[i].toString() + "</option>").appendTo($('#' + elementId));
            //                }
            //            }
            //        }
            //    }
            //}
            //    }
            //}
        } catch (e) {
            console.log('Exception in bwCoreComponent.js.populateTheYearDropdown(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwCoreComponent.js.populateTheYearDropdown(): ' + e.message + ', ' + e.stack);
        }
    },

    eliminateDuplicates: function (arr) {
        var i,
            len = arr.length,
            out = [],
            obj = {};

        for (i = 0; i < len; i++) {
            obj[arr[i]] = 0;
        }
        for (i in obj) {
            out.push(i);
        }
        return out;
    },

    loadWorkflowAppConfigurationDetails9: function () {
        // Load BWMData so that we don't have to keep reaching out for it.
        try {
            //console.log('In loadWorkflowAppConfigurationDetails9(). Load BWMData so that we don\'t have to keep reaching out for it.');
            console.log('In loadWorkflowAppConfigurationDetails9(). WE DONT NEED THIS SO REMOVE THE METHOD CALLS.');
            //alert('In loadWorkflowAppConfigurationDetails9(). Load BWMData so that we don\'t have to keep reaching out for it.');
            //debugger;
            if (this.options.bwParticipantId == null) {
                // This didn't get initialized properly so doing it here.


                //var tenantId = $('.bwAuthentication').bwAuthentication('option', 'tenantId');
                //var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');


                this.options.bwTenantId = $('.bwAuthentication').bwAuthentication('option', 'tenantId'); //tenantId;
                this.options.bwWorkflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId'); //workflowAppId;
                this.options.bwWorkflowAppTitle = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTitle'); //workflowAppTitle;
                this.options.bwParticipantId = $('.bwAuthentication').bwAuthentication('option', 'participantId'); //participantId;
                this.options.bwParticipantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail'); //participantEmail;
                this.options.bwParticipantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName'); //participantFriendlyName;
                this.options.bwEnabledRequestTypes = $('.bwAuthentication').bwAuthentication('option', 'bwEnabledRequestTypes'); //bwEnabledRequestTypes;
            }
            //var thiz = this;
            //var operationUri = this.options.operationUriPrefix + "_bw/getdatatopopulatebwmdata/" + this.options.bwParticipantId; // bwworkflowappsthattheparticipantbelongsto/" + participantId;
            //$.ajax({
            //    url: operationUri,
            //    method: "GET",
            //    headers: {
            //        "Accept": "application/json; odata=verbose"
            //    },
            //    success: function (data) {
            //        //debugger; // todd is this 11-27-19?
            //        if (data.d.results.length > 0) {
            //            GetWorkflowAppConfigurationData = [];
            //            GetWorkflowAppConfigurationData.length = data.d.results.length; // Initialize the callback array.
            //            BWMData[0] = new Array(data.d.results.length); // Initialize the array which contains the details for each of the workflows.
            //            BWMData[1] = new Array(2); // Initialize the array which contains the Functional Area Years. These are used to populate the year drop down.
            //            BWMData[1][0] = []; // Budget Requests.
            //            BWMData[1][1] = []; // Quotes.
            //            var workflowDataRetrievalCount = 0;
            //            for (var i = 0; i < data.d.results.length; i++) {
            //                var wfDetails = new Array(5); // TODD: ORIGINALLY THIS WAS 5 UNTIL WE REMOVED THE PARTICIPANTS SECTION.
            //                wfDetails[0] = data.d.results[i].bwWorkflowAppId;
            //                wfDetails[1] = null; // removed during conversion 9-25-16 data.d.results[i].bwWorkflowAppWebUrl;
            //                wfDetails[2] = data.d.results[i].bwWorkflowAppTitle;
            //                wfDetails[3] = ''; // This is where we will store Total Yearly Budget.
            //                wfDetails[4] = new Array(); // This is where we will store Functional Area data.
            //                BWMData[0][i] = wfDetails;
            //                GetWorkflowAppConfigurationData[i] = $.Deferred();
            //                GetWorkflowAppConfigurationData[i]
            //                    .done(function () {
            //                        workflowDataRetrievalCount += 1; // Increment the count!
            //                        // Now check if all the data has come back yet. If so, create the pie chart.
            //                        if (workflowDataRetrievalCount == data.d.results.length) {
            //                            // Now we get rid of dupicates and order the years in the list.
            //                            var functionalAreaYearsForBudgetRequests2;
            //                            functionalAreaYearsForBudgetRequests2 = thiz.eliminateDuplicates(BWMData[1][0]);
            //                            functionalAreaYearsForBudgetRequests2.sort(function (a, b) {
            //                                return parseFloat(a.price) - parseFloat(b.price)
            //                            });
            //                            BWMData[1][0] = functionalAreaYearsForBudgetRequests2;
            //                            //
            //                            var functionalAreaYearsForQuotes2 = thiz.eliminateDuplicates(BWMData[1][1]);
            //                            functionalAreaYearsForQuotes2.sort(function (a, b) {
            //                                return parseFloat(a.price) - parseFloat(b.price)
            //                            });
            //                            BWMData[1][1] = functionalAreaYearsForQuotes2;
            //                            //debugger;
            //                            //GetWorkflowAppConfigurationData[i].resolve(); // Callback.
            //                            // Now that we have the data, render the stuff!!!
            //                            //populateTheYearDropdown(false);
            //                            //if (!$('#financialOrParticipantSummary').is(':checked')) {
            //                            //    // "Financial Summary" has been selected.
            //                            //    if (!$('#budgetRequestsOrQuotes').is(':checked')) {
            //                            //        renderFinancialSummary(false);
            //                            //    } else if ($('#budgetRequestsOrQuotes').is(':checked')) {
            //                            //        renderFinancialSummary(true);
            //                            //    }
            //                            //} else if ($('#financialOrParticipantSummary').is(':checked')) {
            //                            //    // "Participant Summary" has been selected.
            //                            //    if (!$('#budgetRequestsOrQuotes').is(':checked')) {
            //                            //        renderParticipantSummary(false);
            //                            //    } else if ($('#budgetRequestsOrQuotes').is(':checked')) {
            //                            //        renderParticipantSummary(true);
            //                            //    }
            //                            //}
            //                        }
            //                    })
            //                    .fail(function () {
            //                        handleExceptionWithAlert('Error in loadWorkflowAppConfigurationDetails9()', 'GetWorkflowAppConfigurationData[' + i.toString() + '].fail()');
            //                    });
            //                thiz.loadSingleWorkflowConfigurationDetails9(data.d.results[i].AppWebURL, i, data.d.results[i].Id, data.d.results[i].Title);
            //            }
            //        } else {
            //            //displayAlertDialog('There are no connected workflows.');
            //            thereAreNoConnectedWorkflowsSoDisplayTheConfigurationScreenAppropriately();
            //        }
            //    },
            //    error: function (data, errorCode, errorMessage) {
            //        handleExceptionWithAlert('Error in loadWorkflowAppConfigurationDetails9()', '1:' + JSON.stringify(data) + '::' + errorCode + ', ' + errorMessage);
            //    }
            //});

        } catch (e) {
            handleExceptionWithAlert('Error in loadWorkflowAppConfigurationDetails9()', '2:' + e.message);
        }
    },


    loadSingleWorkflowConfigurationDetails9: function (appWebUrl, deferredIndex, appWebListItemId, appWebListItemTitle) {
        try {
            //console.log('In loadSingleWorkflowConfigurationDetails9().');
            console.log('In loadSingleWorkflowConfigurationDetails9(). WE DONT NEED THIS SO REMOVE THE METHOD CALLS.');
            //alert('In loadSingleWorkflowConfigurationDetails9().');

            //var operationUri = this.options.operationUriPrefix + "_bw/getfunctionalareasbyappid/" + workflowAppId + "/" + "RETURNALL";
            //$.ajax({
            //    url: operationUri,
            //    method: "GET",
            //    headers: {
            //        "Accept": "application/json; odata=verbose"
            //    },
            //    success: function (faData) {
            //        try {

            //            // Todd broke out this section from below 1-21-2020. Now it returns all of the FA years! We use this to populate the year drop downs.
            //            for (var i = 0; i < faData.d.results.length; i++) {
            //                var yearItem = [Number(faData.d.results[i].bwFunctionalAreaYear)];
            //                if (faData.d.results[i].bwFunctionalAreaQuote == true) {
            //                    //debugger;
            //                    BWMData[1][1].push(yearItem);
            //                } else {
            //                    //debugger;
            //                    BWMData[1][0].push(yearItem);
            //                }
            //            }

            //            for (var i = 0; i < faData.d.results.length; i++) {

            //                //var yearItem = [Number(faData.d.results[i].bwFunctionalAreaYear)];
            //                //if (faData.d.results[i].bwFunctionalAreaQuote == true) {
            //                //    debugger;
            //                //    BWMData[1][1].push(yearItem);
            //                //} else {
            //                //    debugger;
            //                //    BWMData[1][0].push(yearItem);
            //                //}
            //                // Load the Functional Areas details.
            //                BWMData[0][deferredIndex][4].length = faData.d.results.length; // Initialize the Functional Area data.
            //                for (var i = 0; i < faData.d.results.length; i++) {
            //                    var _overdueTasks = new Array(); // We populate this below.
            //                    var approver1item = [faData.d.results[i].Approver1Id, faData.d.results[i].Approver1FriendlyName, faData.d.results[i].Approver1Email];
            //                    var approver2item = [faData.d.results[i].Approver2Id, faData.d.results[i].Approver2FriendlyName, faData.d.results[i].Approver2Email];
            //                    var approver3item = [faData.d.results[i].Approver3Id, faData.d.results[i].Approver3FriendlyName, faData.d.results[i].Approver3Email, faData.d.results[i].Approval3BudgetThreshold];
            //                    var approver4item = [faData.d.results[i].Approver4Id, faData.d.results[i].Approver4FriendlyName, faData.d.results[i].Approver4Email, faData.d.results[i].Approval4BudgetThreshold];
            //                    var approver5item = [faData.d.results[i].Approver5Id, faData.d.results[i].Approver5FriendlyName, faData.d.results[i].Approver5Email, faData.d.results[i].Approval5BudgetThreshold];
            //                    var approver6item = [faData.d.results[i].Approver6Id, faData.d.results[i].Approver6FriendlyName, faData.d.results[i].Approver6Email, faData.d.results[i].Approval6BudgetThreshold];
            //                    var approver7item = [faData.d.results[i].Approver7Id, faData.d.results[i].Approver7FriendlyName, faData.d.results[i].Approver7Email, faData.d.results[i].Approval7BudgetThreshold];
            //                    var approver8item = [faData.d.results[i].Approver8Id, faData.d.results[i].Approver8FriendlyName, faData.d.results[i].Approver8Email, faData.d.results[i].Approval8BudgetThreshold];
            //                    var approver9item = [faData.d.results[i].Approver9Id, faData.d.results[i].Approver9FriendlyName, faData.d.results[i].Approver9Email, faData.d.results[i].Approval9BudgetThreshold];
            //                    var approver10item = [faData.d.results[i].Approver10Id, faData.d.results[i].Approver10FriendlyName, faData.d.results[i].Approver10Email, faData.d.results[i].Approval10BudgetThreshold];
            //                    var _additionalApprovers = [approver3item, approver4item, approver5item, approver6item, approver7item, approver8item, approver9item, approver10item];
            //                    var faItem = [faData.d.results[i].bwFunctionalAreaId, faData.d.results[i].bwFunctionalAreaTitle, faData.d.results[i].bwFunctionalAreaQuote, Number(faData.d.results[i].bwFunctionalAreaYear), Number(faData.d.results[i].bwFunctionalAreaYearlyBudget), approver1item, approver2item, _additionalApprovers, 0, 0, 0, _overdueTasks, null, faData.d.results[i].IsHidden];
            //                    BWMData[0][deferredIndex][4][i] = faItem;
            //                }
            //            }
            //            GetWorkflowAppConfigurationData[deferredIndex].resolve(); // Callback.
            //        } catch (e) {
            //            console.log('Exception in loadSingleWorkflowConfigurationDetails9(): ' + e.message + ', ' + e.stack);
            //        }
            //    },
            //    error: function (data, errorCode, errorMessage) {
            //        if (errorCode == '-1002') {
            //            // The connected Budget Workflow cannot be found. This most likely means it has been removed from the site so we will have to remove it from the appwebs list.
            //            //var url = appweburl + "/_api/web/lists/getbytitle('BudgetWorkflowAppWebs')/items(" + appWebListItemId + ")";
            //            //var executor = new SP.RequestExecutor(appweburl);
            //            //executor.executeAsync({
            //            //    url: url,
            //            //    method: "POST",
            //            //    headers: {
            //            //        "Accept": "application/json; odata=verbose",
            //            //        "X-RequestDigest": $("#__REQUESTDIGEST").val(),
            //            //        "X-HTTP-Method": "DELETE",
            //            //        "IF-MATCH": "*"
            //            //    },
            //            //    success: function (data) {
            //            //        GetWorkflowAppConfigurationData[deferredIndex].resolve(); // Callback.
            //            //        displayAlertDialog('The ' + appWebListItemTitle + ' workflow could not be contacted. It must have been removed.');
            //            //    },
            //            //    error: function (data, errorCode, errorMessage) {
            //            //        GetWorkflowAppConfigurationData[deferredIndex].resolve(); // Callback.
            //            handleExceptionWithAlert('Error in loadSingleWorkflowConfigurationDetails9()', '1:' + errorCode + ', ' + errorMessage);
            //            //    }
            //            //});
            //        } else {
            //            GetWorkflowAppConfigurationData[deferredIndex].resolve(); // Callback.
            //            handleExceptionWithAlert('Error in loadSingleWorkflowConfigurationDetails9()', '2:' + errorCode + ', ' + errorMessage);
            //        }
            //    }
            //});
        } catch (e) {
            GetWorkflowAppConfigurationData[deferredIndex].resolve(); // Callback.
            handleExceptionWithAlert('Error in loadSingleWorkflowConfigurationDetails9()', '3:' + e.message);
        }
    },




    displayPeoplePickerDialog: function (friendlyNameSourceField, idSourceField, emailSourceField, buttonToEnable) {
        try {
            console.log('In bwCoreComponent.displayPeoplePickerDialog().');
            var thiz = this;

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            if (!participantId) {
                console.log('In displayPeoplePickerDialog(). User is not logged in, so displaying the logon.');
                displayAlertDialog('In displayPeoplePickerDialog(). User is not logged in, so displaying the logon.');
                initializeTheLogon(); // The user needs to be logged in before they add anyone.
            } else {
                $('#txtPeoplePickerDialogSearchBox').empty(); // Clear the search text box.
                $('#PeoplePickerDialog').dialog({
                    modal: true,
                    resizable: false,
                    closeText: "Cancel",
                    closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                    //title: "Select a person...", //"Enter your early adopter code...",
                    width: "570px",
                    dialogClass: "no-close", // No close button in the upper right corner.
                    hide: false, // This means when hiding just disappear with no effects.
                    open: function () {
                        try {
                            $('.ui-widget-overlay').bind('click', function () {
                                $("#PeoplePickerDialog").dialog('close');
                            });



                            thiz.renderAllParticipantsInThePeoplePicker(friendlyNameSourceField, idSourceField, emailSourceField, buttonToEnable); // We do this the first time to make sure they are all displayed.


                        } catch (e) {
                            console.log('Exception in bwCoreComponent.displayPeoplePickerDialog():4: ' + e.message + ', ' + e.stack);
                            displayAlertDialog('Exception in bwCoreComponent.displayPeoplePickerDialog():4: ' + e.message + ', ' + e.stack);
                        }
                    } // This allows the dialog to close when clicked outside of the dialog. Only works for modal dialogs.
                });
                $("#PeoplePickerDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

                $('#spanPeoplePickerDialogTitle').html('Select a person...');

                // Now we can hook up the Participant text box for autocomplete.
                $("#txtPeoplePickerDialogSearchBox").autocomplete({
                    source: function (request, response) {
                        if (request.term == '') {
                            thiz.renderAllParticipantsInThePeoplePicker(); // Nothing is in the search box, so show all participants.
                        } else {
                            $.ajax({
                                //url: appweburl + "/tenant/" + tenantId + "/participants/" + request.term,
                                url: webserviceurl + "/workflow/" + workflowAppId + "/participants/" + request.term,
                                dataType: "json",
                                success: function (data) {
                                    try {
                                        $('#spanPeoplePickerParticipantsList').empty();
                                        var html = '';
                                        if (data.participants.length > 0) {
                                            //var searchArray = [];
                                            for (var i = 0; i < data.participants.length; i++) {
                                                //searchArray[i] = data.participants[i].participant;
                                                //var strParticipant = '<a href="">' + data.participants[i].participant.split('|')[0] + ' <i>(' + data.participants[i].participant.split('|')[2] + ')</i></a>';

                                                html += '<a style="cursor:pointer;text-decoration:underline;" onclick="$(\'.bwCoreComponent\').bwCoreComponent(\'cmdReturnParticipantIdToField\', \'' + friendlyNameSourceField + '\', \'' + idSourceField + '\', \'' + emailSourceField + '\', \'' + data.participants[i].participant.split('|')[0] + '\', \'' + data.participants[i].participant.split('|')[1] + '\', \'' + data.participants[i].participant.split('|')[2] + '\', \'' + buttonToEnable + '\');">' + data.participants[i].participant.split('|')[0] + '&nbsp;&nbsp;<i>(' + data.participants[i].participant.split('|')[2] + ')</i></a>';


                                                //html += strParticipant; //data.participants[i].participant;
                                                html += '<br />';
                                                //response(searchArray);
                                            }
                                        } else {
                                            // There were no results.
                                            html += '<span><i>There were no results</i></span>';
                                        }
                                        $('#spanPeoplePickerParticipantsList').append(html);
                                    } catch (e) {
                                        console.log('Exception in bwCoreComponent.displayPeoplePickerDialog():2: ' + e.message + ', ' + e.stack);
                                        displayAlertDialog('Exception in bwCoreComponent.displayPeoplePickerDialog():2: ' + e.message + ', ' + e.stack);
                                    }
                                }
                            });
                        }
                    },
                    minLength: 0, // minLength specifies how many characters have to be typed before this gets invoked.
                    select: function (event, ui) {
                        //log(ui.item ? "Selected: " + ui.item.label : "Nothing selected, input was " + this.value);
                        //document.getElementById('btnSearch').disabled = false; // Enable the search button when there is valid content in it.
                    },
                    open: function () {
                        //$(this).removeClass("ui-corner-all").addClass("ui-corner-top");
                        //document.getElementById('btnSearch').disabled = true; // Disable the search button until there is valid content in it.
                    },
                    close: function () {
                        try {
                            //$(this).removeClass("ui-corner-top").addClass("ui-corner-all");
                            var peoplePickerParticipantName = this.value.split('|')[0];
                            var peoplePickerParticipantId = this.value.split('|')[1];
                            var peoplePickerParticipantEmail = this.value.split('|')[2];

                            if (peoplePickerParticipantName.indexOf('undefined') > -1) {
                                document.getElementById('txtPeoplePickerDialogSearchBox').value = '';
                                document.getElementById('txtPeoplePickerDialogParticipantId').value = '';
                                document.getElementById('txtPeoplePickerDialogParticipantEmail').value = '';
                            } else {
                                document.getElementById('txtPeoplePickerDialogSearchBox').value = peoplePickerParticipantName; //this.value.split(' ')[0] + ' ' + this.value.split(' ')[1]; // Just shows the Loan Number parameter (removing the borrower name) so it fits in the text box.
                                document.getElementById('txtPeoplePickerDialogParticipantId').value = peoplePickerParticipantId;
                                document.getElementById('txtPeoplePickerDialogParticipantEmail').value = peoplePickerParticipantEmail;
                            }
                        } catch (e) {
                            console.log('Exception in bwCoreComponent.displayPeoplePickerDialog():3: ' + e.message + ', ' + e.stack);
                            displayAlertDialog('Exception in bwCoreComponent.displayPeoplePickerDialog():3: ' + e.message + ', ' + e.stack);
                        }
                    }
                });

                // List all participants.
                //debugger;
                //thiz.renderAllParticipantsInThePeoplePicker(friendlyNameSourceField, idSourceField, emailSourceField, buttonToEnable); // We do this the first time to make sure they are all displayed.
            }
        } catch (e) {
            console.log('Exception in bwCoreComponent.displayPeoplePickerDialog: ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwCoreComponent.displayPeoplePickerDialog: ' + e.message + ', ' + e.stack);
        }
    },

    renderAllParticipantsInThePeoplePicker: function (friendlyNameSourceField, idSourceField, emailSourceField, buttonToEnable) {
        try {
            console.log('In renderAllParticipantsInThePeoplePicker().');

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');

            $('#spanPeoplePickerParticipantsList').empty();
            var data = {
                "bwWorkflowAppId": workflowAppId
            };
            $.ajax({
                url: webserviceurl + "/workflow/participants",
                type: "DELETE",
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: function (data1) {
                    try {
                        debugger;
                        var data = data1.BwWorkflowUsers;
                        var html = '';
                        for (var i = 0; i < data.length; i++) {
                            html += '<a style="cursor:pointer;text-decoration:underline;" onclick="$(\'.bwCoreComponent\').bwCoreComponent(\'cmdReturnParticipantIdToField\', \'' + friendlyNameSourceField + '\', \'' + idSourceField + '\', \'' + emailSourceField + '\', \'' + data[i].bwParticipantFriendlyName + '\', \'' + data[i].bwParticipantId + '\', \'' + data[i].bwParticipantEmail + '\', \'' + buttonToEnable + '\');">' + data[i].bwParticipantFriendlyName + '&nbsp;&nbsp;<i>(' + data[i].bwParticipantEmail + ')</i></a>';
                            html += '<br />';
                        }
                        $('#spanPeoplePickerParticipantsList').append(html);
                    } catch (e) {
                        console.log('Exception in bwCoreComponent.renderAllParticipantsInThePeoplePicker():2: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwCoreComponent.renderAllParticipantsInThePeoplePicker():2: ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    var msg = 'Error in bwCoreComponent.js.renderAllParticipantsInThePeoplePicker(): ' + errorCode + ', ' + errorMessage + ', : ' + JSON.stringify(data);
                    console.log(msg);
                    displayAlertDialog(msg);
                }
            });
        } catch (e) {
            console.log('Exception in bwCoreComponent.js.renderAllParticipantsInThePeoplePicker(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwCoreComponent.js.renderAllParticipantsInThePeoplePicker(): ' + e.message + ', ' + e.stack);
        }
    },
    cmdReturnParticipantIdToField: function (friendlyNameSourceField, idSourceField, emailSourceField, selectedParticipantFriendlyName, selectedParticipantId, selectedParticipantEmail, buttonToEnable) {
        try {
            console.log('In bwCoreComponent.js.cmdReturnParticipantIdToField().');

            debugger;
            // The people picker calls this and 
            //displayAlertDialog('You selected participant ' + selectedParticipantFriendlyName + ' to go in friendly name field ' + friendlyNameSourceField + '.\n\nThis functionality is incomplete. Coming soon!');
            document.getElementById(friendlyNameSourceField).value = selectedParticipantFriendlyName;
            document.getElementById(friendlyNameSourceField).setAttribute('title', selectedParticipantEmail);
            document.getElementById(idSourceField).value = selectedParticipantId;
            document.getElementById(emailSourceField).value = selectedParticipantEmail;

            //$('#' + friendlyNameSourceField).val(selectedParticipantFriendlyName);
            //$('#' + idSourceField).val(selectedParticipantId);
            //$('#' + emailSourceField).val(selectedParticipantEmail);

            // This enables the save button that may be next to the text box.
            if (buttonToEnable && buttonToEnable != 'undefined') document.getElementById(buttonToEnable).disabled = false;

            $('#PeoplePickerDialog').dialog('close');

            // The following doesn't work for some reason.
            //$('#' + friendlyNameSourceField).blur(); // Removes the focus from the field so that the user can't type in it.
            //document.getElementById(friendlyNameSourceField).blur();
        } catch (e) {
            console.log('Exception in bwCoreComponent.cmdReturnParticipantIdToField(): ' + e.message + ', ' + e.stack);
        }
    },

    displayCreateANewRoleDialog: function () {
        try {
            console.log('In bwCoreComponent.displayCreateANewRoleDialog().');
            $("#divCreateANewRoleDialog").dialog({
                modal: true,
                resizable: false,
                //closeText: "Cancel",
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                //title: 'Create a new Role',
                width: '800',
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {
                    $('.ui-widget-overlay').bind('click', function () {
                        $("#divCreateANewRoleDialog").dialog('close');
                    });
                    //document.getElementById('txtCreateANewRoleDialog_RoleId').value = document.getElementById('textNewRoleId').value;
                    //document.getElementById('txtCreateANewRoleDialog_RoleName').value = document.getElementById('textNewRoleName').value;
                },
                close: function () {
                    //$(this).dialog('destroy').remove();
                }
            });
            //$("#divCreateANewRoleDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
        } catch (e) {
            console.log('Exception in bwCoreComponent.displayCreateANewRoleDialog(): ' + e.message + ', ' + e.stack);
        }
    },



    displayEditRolesDialog: function () {
        try {
            console.log('In bwCoreComponent.displayEditRolesDialog().');
            $("#divEditRolesDialog").dialog({
                modal: true,
                resizable: false,
                //closeText: "Cancel",
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                //title: 'Create a new Role',
                width: '800',
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {
                    $('.ui-widget-overlay').bind('click', function () {
                        $("#divEditRolesDialog").dialog('close');
                    });
                    //document.getElementById('txtCreateANewRoleDialog_RoleId').value = document.getElementById('textNewRoleId').value;
                    //document.getElementById('txtCreateANewRoleDialog_RoleName').value = document.getElementById('textNewRoleName').value;
                },
                close: function () {
                    //$(this).dialog('destroy').remove();
                }
            });
            //$("#divCreateANewRoleDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();



            // spanEditRolesDialogContent
            // Render the RACI role editor.
            //$('.bwCoreComponent').bwCoreComponent('renderMasterRoleListForEditing', 'spanConfigurationParticipantsRaciRoleEditor');
            this.renderMasterRoleListForEditing('spanEditRolesDialogContent');


        } catch (e) {
            console.log('Exception in bwCoreComponent.displayEditRolesDialog(): ' + e.message + ', ' + e.stack);
        }
    },


    displayAlertDialog: function (errorMessage) {
        try {
            document.getElementById('spanErrorMessage').innerHTML = errorMessage;
            $("#divAlertDialog").dialog({
                modal: true,
                resizable: false,
                //closeText: "Cancel",
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                //title: 'Add a New Person',
                width: '800',
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                open: function () {
                    $('.ui-widget-overlay').bind('click', function () {
                        $("#divAlertDialog").dialog('close');
                    });
                },
                close: function () {
                    //$(this).dialog('destroy').remove();
                }
            });
            $("#divAlertDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
        } catch (e) {
            console.log('Exception in bwCoreComponent.js.displayAlertDialog(): ' + e.message + ', ' + e.stack);
        }
    }

});