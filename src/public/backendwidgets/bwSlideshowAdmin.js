$.widget("bw.bwSlideshowAdmin", {
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
        This is the bwSlideshowAdmin.js jQuery Widget. 
        ===========================================================

            [more to follow]
                          
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

            [put your stuff here]

        ===========================================================
       
        */

        elementIdSuffix: null, // This is a custom guid which gets appended to element id's, making sure this widget keeps to itself.

        CurrentSlides: {
            SlideSets: {
                PublishedSlideSet: null,
                FilesAndFolders: null
            },
            DraftSlideSets: {
                PublishedSlideSet: null,
                FilesAndFolders: null
            }
        },

        value: 0,
        json: null,
        //jsonTreeState: null, // This contains the org structure and roles.
        //DraftOrgStructureAndRoles: null, // This contains the org structure and roles.
        workflow: null, // Storing it here so we can use it to see which roles are available. I think the workflow should be the origin for roles, but we will see if that is the case in the end... :)

        color: {
            Default: 'black',
            Active: '#ff0000', // red // used for hover etc.
            Inactive: 'lightgrey', //'aqua', // red // used for hover etc.
            Global: '#0066ff', // blue
            Division: '#0066ff', // blue
            Group: '#ffff00', // yellow
            LegalEntity: '#ff9900', // orange
            LegalEntity2: '#29685F', // galapagos green
            Location: '#009933', // green
            ChildNode: '#95b1d3' // that nice light blue/grey color also using at top of section pages...
        },
        Checklists: null,
        //bwTenantId: null,
        //bwWorkflowAppId: null,
        bwEnabledRequestTypes: null, // An array of the following: ['Budget Request', 'Quote Request', 'Reimbursement Request', 'Recurring Expense', 'Capital Plan Project', 'Work Order']
        operationUriPrefix: null,
      


        //quill: null, // was this used somewhere? 6-29-2020
        quill: null, // Email body editor.
        quillSubjectEditor: null, // Email subject editor.





        displayOrgRolesPicker: false, //true, // Should be false by default but this is good for now.
        displayRoleIdColumn: false,
        autoSenseDeviceType: false // Automatic UI based on device type. Alpha version so far.
    },
    _create: function (assignmentRowChanged_ElementId) {
        this.element.addClass("bwSlideshowAdmin");
        var thiz = this; // Need this because of the asynchronous operations below.

        try {
            if (this.options.operationUriPrefix == null) {
                // This formulates the operationUri, which is used throughout.
                var url1 = window.location.href.split('https://')[1];
                var url2 = url1.split('/')[0];
                this.options.operationUriPrefix = 'https://' + url2 + '/';
            }

            var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
            this.options.elementIdSuffix = guid;

            // 
            // Load this object first so we don't have to keep making web service calls.
            //
            if (this.options.CurrentSlides.DraftSlideSets.FilesAndFolders != null) {

                this.renderSlideSets();

            } else {

                this.loadFoldersAndFiles();

            }

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">bwSlideshowAdmin: CANNOT RENDER</span>';
            html += '<br />';
            html += '<span style="">Exception in bwSlideshowAdmin.js._create(): ' + e.message + ', ' + e.stack + '</span>';
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
            .removeClass("bwSlideshowAdmin")
            .text("");
    },
    loadFoldersAndFiles: function () {
        try {
            console.log('In bwSlideshowAdmin.js.loadFoldersAndFiles().');
            alert('In bwSlideshowAdmin.js.loadFoldersAndFiles().');
            var thiz = this;

            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
            var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

            var data = {
                bwParticipantId: participantId,
                bwParticipantEmail: participantEmail,
                bwParticipantFriendlyName: participantFriendlyName
            };
            $.ajax({
                url: thiz.options.operationUriPrefix + "_files/slideshowslidesets",
                type: 'GET',
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: function (result) {
                    try {
                        console.log('In bwSlideshowAdmin.js.loadFoldersAndFiles(). Got data from _files/slideshowslidesets(). ' + JSON.stringify(result));
                        //alert('In bwSlideshowAdmin.js.loadFoldersAndFiles(). Got data from _files/slideshowslidesets(). ' + JSON.stringify(result));

                        // WE NEED TO GET THESE LOADING ALSO WITH THE CURRENTLY PUBLISHED SLIDESET!!!!!!!!!!!!!!<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                        // As per the code lines commented out below. This means a change to the web service:
                   
                        thiz.options.CurrentSlides.SlideSets = JSON.parse(JSON.stringify(result.filesandfolders));
                        thiz.options.CurrentSlides.DraftSlideSets = JSON.parse(JSON.stringify(result.filesandfolders));
                 
                        //// Validate that our sortOrder is Ok everywhere.
                        //for (var i = 0; i < thiz.options.CurrentSlides.DraftSlideSets.FilesAndFolders.length; i++) {
                        //    // Sort the files in this folder by sortOrder.
                        //    thiz.options.CurrentSlides.DraftSlideSets.FilesAndFolders[i].files = thiz.options.CurrentSlides.DraftSlideSets.FilesAndFolders[i].files.sort(function (a, b) {
                        //        var nameA = a.sortOrder;
                        //        var nameB = b.sortOrder;
                        //        if (nameA < nameB) {
                        //            return -1; //nameA comes first
                        //        }
                        //        if (nameA > nameB) {
                        //            return 1; // nameB comes first
                        //        }
                        //        return 0;  // names must be equal
                        //    });
                        //    // Now that it is sorted, lets re-number to make sure it is Ok.
                        //    for (var j = 0; j < thiz.options.CurrentSlides.DraftSlideSets.FilesAndFolders[i].files.length; j++) {
                        //        thiz.options.CurrentSlides.DraftSlideSets.FilesAndFolders[i].files[j].sortOrder = j;
                        //    }
                        //}
                        
                        thiz.renderSlideSets();

                    } catch (e) {
                        console.log('Exception in bwSlideshowAdmin.js.loadFoldersAndFiles():2: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwSlideshowAdmin.js.loadFoldersAndFiles():2: ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    console.log('Error in bwSlideshowAdmin.js.loadFoldersAndFiles.GetExternallySharedFiles():1: ' + errorCode + ', ' + errorMessage);
                    displayAlertDialog('Error in bwSlideshowAdmin.js.loadFoldersAndFiles.GetExternallySharedFiles():1: ' + errorCode + ', ' + errorMessage);
                }
            });

        } catch (e) {
            console.log('Exception in bwSlideshowAdmin.js.loadFoldersAndFiles(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwSlideshowAdmin.js.loadFoldersAndFiles(): ' + e.message + ', ' + e.stack);
        }
    },
    renderSlideSets: function () {
        try {
            console.log('In bwSlideshowAdmin.js.renderSlideSets().');
            alert('In bwSlideshowAdmin.js.renderSlideSets().');
            var thiz = this;

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var externallyFacingUrlForAttachmentsSourceFolder = $('.bwAuthentication').bwAuthentication('option', 'externallyFacingUrlForAttachmentsSourceFolder');
            var externallyFacingUrlForAttachments = $('.bwAuthentication').bwAuthentication('option', 'externallyFacingUrlForAttachments');

            this.element.html('');

            if (!(this.options.CurrentSlides && this.options.CurrentSlides.DraftSlideSets && this.options.CurrentSlides.DraftSlideSets.FilesAndFolders)) {

                // There are no folders and/or files. 
                var html = '';

                html += '<table>';
                html += '   <tr>';
                html += '       <td colspan="2" class="bwChartCalculatorLightCurrencyTableCell" style="width:100%;">';
                html += '           <span style="font-size:20pt;font-weight:normal;">Slideshow slides (unauthenticated)</span>';
                html += '           <br />';
                html += '           <span style="font-size:small;font-style:italic;">Images that have been uploaded so that they can be displayed in the homepage slideshow (without logging in).xcx1</span>';
                html += '           <br />';
                html += '           <br />';
                html += '           There are no slideshow files, or the configuration has not been completed.';
                html += '           <br />';
                html += '           <br />';
                html += '       </td>';
                html += '   </tr>';
                html += '</table>';

                this.element.html(html);

            } else {

                var filesandfolders = this.options.CurrentSlides.DraftSlideSets.FilesAndFolders;

                var html = '';

                // Rename from "AttachmentsDialog1" to "bwSlideshowAdmin_SlidePropertiesDialog".
                html += '<div style="display:none;" id="bwSlideshowAdmin_SlidePropertiesDialog">';
                html += '<table style="width:100%;">';
                html += '    <tr>';
                html += '        <td style="width:90%;">';
                html += '            <span id="spanAttachmentsDialog1Title" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">xcx34348</span>';
                html += '        </td>';
                html += '        <!--<td style="width:9%;"></td>';
                html += '    <td style="width:1%;cursor:pointer;vertical-align:top;">';
                html += '         <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:60pt;font-weight:bold;" onclick="$(\'#bwSlideshowAdmin_SlidePropertiesDialog\').dialog(\'close\');">X</span>';
                html += '    </td>-->';
                html += '     </tr>';
                html += '</table>';
                html += '<br /><br />';
                html += '<input type="text" autofocus="true" style="display:none;" /> <!-- This is here to prevent the first visible field from getting the cursor and showing the keyboard. -->';
                html += '<div id="divAttachmentsDialog1Contents" class="divDialogAttachment"></div>';
                html += '<br /><br />';
                //html += '[x] Viewable by Participants';
                //html += '<br />';
                //html += '[x] Viewable by Participants and Customers';
                //html += '<br />';
                //html += '[x] Viewable by Participants and Vendors';
                //html += '<br />';
                //html += '[x] Viewable by Participants, Customers, and Vendors';
                //html += '<br />';
                //html += '[x] Viewable by Everyone (public) *beta Share this link with anyone, and they will be able to view this file without logging in.';
                //html += '<br /><br />';
                html += '<table>';
                html += '    <tr>';
                html += '       <td><span style="font-style:italic;color:gray;font-size:18pt;">file name:</span></td>';
                html += '      <td>';
                html += '            <input type="text" id="txtAttachmentsDialog1Filename" style="width:290px;font-size:18pt;" />';
                html += '            &nbsp;<span id="spanAttachmentsDialog1FileExtension" style="font-style:italic;font-size:16pt;color:gray;"></span>';
                html += '            <!--<br /><span style="font-style:italic;font-size:22pt;color:gray;">(don\'t include a file extension)</span>-->';
                html += '        </td>';
                html += '    </tr>';
                html += '    <tr>';
                html += '        <td></td>';
                html += '        <td></td>';
                html += '     </tr>';
                html += '    <tr>';
                html += '        <td style="vertical-align:top;"><span style="font-style:italic;font-size:18pt;color:gray;">Header text:</span></td>';
                html += '        <td><textarea id="bwSlideshowAdmin_SlidePropertiesDialog_File_HeaderText" style="overflow:hidden;font-size:12pt;" rows="4" cols="55"></textarea></td>'; // change txtAttachmentsDialog1FileDescription to bwSlideshowAdmin_SlidePropertiesDialog_File_HeaderText
                html += '     </tr>';
                html += '    <tr>';
                html += '        <td style="vertical-align:top;"><span style="font-style:italic;font-size:18pt;color:gray;">Description text:</span></td>';
                html += '        <td><textarea id="bwSlideshowAdmin_SlidePropertiesDialog_File_DescriptionText" style="overflow:hidden;font-size:12pt;" rows="4" cols="55"></textarea></td>';
                html += '     </tr>';
                //html += '     <!--<tr>';
                //html += '    <td colspan="2" style="text-align:right;font-size:40pt;">';
                //html += '        <button name="btnUploadTheFileNowxxxx" title="Click here to upload the attachment." class="BwButton" id="btnUploadTheFileNow">Save</button>';
                //html += '        <button name="btnDeleteTheFileNowxxxx" title="Click here to delete the attachment." class="BwButton" id="btnDeleteTheFileNow">Delete</button>';
                //html += '        <button name="btnCancelUploadTheFileNowxxxx" title="" class="BwButton" id="btnCancelUploadTheFileNow">Close</button>';
                //html += '    </td>';
                //html += '</tr>-->';
                html += '</table>';
                html += '    <span id="spanAttachmentsDialog1SaveMetadataButton"></span>';
                html += '    <br /><br />';
                //html += '    <!--<div id="btnAttachmentsDialog1SaveMetadata" class="divDialogButton">';
                //html += '    Save';
                //html += '</div>-->';
                //html += '     <span id="spanAttachmentsDialog1DeleteAttachmentButton"></span>';
                //html += '     <br /><br />';
                //html += '     <!--<div id="btnAttachmentsDialog1DeleteAttachment" class="divDialogButton">';
                //html += '     Delete';
                //html += '</div>-->';
                html += '    <div id="xxxx" class="divDialogButton" onclick="$(\'#bwSlideshowAdmin_SlidePropertiesDialog\').dialog(\'close\');">';
                html += '        Close';
                html += '   </div>';
                html += '    <br /><br />';
                html += '</div>';




                html += '<table>';
                html += '   <tr>';
                html += '       <td colspan="2" class="bwChartCalculatorLightCurrencyTableCell" style="width:100%;">';
                html += '           <span style="font-size:20pt;font-weight:normal;">Slideshow slides</span>';
                html += '           <br />';
                html += '           <span style="font-size:small;font-style:italic;">Images that have been uploaded so that they can be displayed in the homepage slideshow (without logging in - unauthenticated).</span>';
                html += '           <br />';
                html += '           <br />';


                //html += '<span style="cursor:pointer;font-size:25pt;" onclick="$(\'.bwSlideshowAdmin:first\').bwSlideshowAdmin(\'publishSlideshow\');">[Publish Slideshow]</span>';

                html += '<table><tbody><tr>  <td>  </td>  <td style="text-align:right;">    <span id="spanThereAreChangesToPublishText" style="font-style:italic;color:tomato;">You have changes that won\'t be available until you publish: </span>  </td>  <td>    <span id="spanThereAreChangesToPublishButton"><input style="padding:5px 10px 5px 10px;width:100px;" id="btnSaveWorkflowConfigurationAndActivate" type="button" value="Publish" onclick="$(\'.bwSlideshowAdmin\').bwSlideshowAdmin(\'publishSlideshow\');">&nbsp;<input style="padding:5px 10px 5px 10px;" id="btnCancelChangesInDraftWorkflowConfiguration" type="button" value="Cancel Changes" onclick="$(\'.bwSlideshowAdmin\').bwSlideshowAdmin(\'cancelChangesInDraftSlideshow\');"></span>  </td></tr></tbody></table>';






                //if (folders2.length > 0) {
                //    html += '           There are no slideshow files, or the configuration has not been completed.';
                //    html += '           <br />';
                //    html += '           <br />';
                //}
                html += '       </td>';
                html += '   </tr>';

                //for (var i = 0; i < folders2.length; i++) {
                for (var i = 0; i < filesandfolders.length; i++) {
                    html += '   <tr>';
                    html += '       <td colspan="2" class="bwChartCalculatorLightCurrencyTableCell" style="width:100%;">';

                    html += '           <br />';
                    html += '           <div id="bwSlideshowAdmin_bwSlideSet_' + i + '"></div>';
                    html += '           <br />';
                    html += '           <br />';
                    html += '       </td>';
                    html += '   </tr>';
                }

                html += '   <tr>';
                html += '       <td colspan="2" class="bwChartCalculatorLightCurrencyTableCell" style="width:100%;">';
                html += '           <br />';
                html += '           <br />';
                html += '           <br />';
                //html += '           [create new slide set]';
                html += '           <button onclick="$(\'.bwSlideshowAdmin\').bwSlideshowAdmin(\'createNewSlideSet\');" class="BwButton250ForRequestForm" title="Create a new slide set.">';
                html += '               Create new slide set';
                html += '           </button>';
                html += '           <br />';
                html += '           <br />';
                //html += '           <div id="bwSlideshowAdmin_bwSlideSet12"></div>';
                html += '       </td>';
                html += '   </tr>';
                html += '</table>';














                html += '<table>';
                html += '   <tr>';
                html += '       <td colspan="2" class="bwChartCalculatorLightCurrencyTableCell" style="width:100%;">';

                html += '<span style="font-size:20pt;font-weight:normal;">Slideshow slides (unauthenticated)</span>';
                html += '<br />';
                html += '           <span style="font-size:small;font-style:italic;">Images that have been uploaded so that they can be displayed in the homepage slideshow (without logging in).xcx3</span>';
                html += '<br />';
                html += '<br />';
                html += '           There are no slideshow files, or the configuration has not been completed.';
                html += '           <br />';
                html += '           <br />';

                html += '<table  class="context-menu-externallysharedfiles">';
                html += '   <tr>';
                html += '       <td style="vertical-align:top;">';
                html += '           <table>';
                html += '               <tr id="orgrow_d_g_e_l">';
                html += '                   <td></td>';
                html += '                   <td>';
                //html += '                       <table id="tableBwExternallySharedFiles_' + this.options.elementIdSuffix + '_subfolders" style="padding-left:15px;">';
                html += '                       <table style="padding-left:15px;">';
                html += '                           <tr>';
                html += '                               <td>';
                html += '                                   <span id="spanOrgX_root" class="orgTreeNode" style="cursor:pointer;white-space:nowrap;" onclick="$(\'.bwSlideshowAdmin\').bwSlideshowAdmin(\'collapseOrExpandTree\', \'\', \'spanOrgX_root\', \'root\');" onmouseover="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderOrgRoleConnectorsToWorkflowxx\', true, \'root\');" onmouseout="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderOrgRoleConnectorsToWorkflowResetxx\', \'' + 'spanOrgX_root\', \'root\');">';

                html += '                                       <span style="font-weight:normal;">';
                html += '<img src="images/drawer-open.png" style="cursor:pointer;width:46px;height:46px;" />';
                html += '&nbsp;&nbsp;';
                html += '<img src="images/folder.png" style="cursor:pointer;width:60px;" />';
                html += '&nbsp;&nbsp;' + externallyFacingUrlForAttachmentsSourceFolder;
                html += '<br />';
                html += '<br />';
                html += '                                       </span> ';

                html += '                                   </span> ';
                html += '                               </td>';
                html += '                           </tr>';


                //html += '                           <tr>';
                //html += '                               <td>';
                //html += '                                   <span id="spanDivisionsTreeExpandCollapseButton" style="cursor:pointer;" onclick="$(\'.bwSlideshowAdmin\').bwSlideshowAdmin(\'collapseOrExpandTree\', \'\', \'spanDivisionsTreeExpandCollapseButton\', \'root\');">';
                //html += '                                       <img title="collapse" style="cursor:pointer;width:35px;height:35px;vertical-align:middle;" src="images/drawer-close.png"> ';
                //html += '                                   </span>';

                //var d = 0;

                ////html += '                               <span id="spanOrgX_' + d + '_' + 'GroupsNode' + '" class="orgTreeNode" style="cursor:pointer;font-weight:bold;" title="Collapse..." onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'collapseTree\', \'\', \'' + '' + '\');" onmouseout="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderOrgRoleConnectorsToWorkflowResetxx\', \'' + 'spanOrgX_' + d + '_' + 'GroupsNode' + '\', \'' + '' + '\', \'' + 'GroupsNode' + '\');" onmouseover="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderOrgRoleConnectorsToWorkflowxx\', true, \'' + '' + '\', \'' + 'GroupsNode' + '\');">';
                ////html += '                               Divisions &nbsp;&nbsp; ';
                ////html += '                               </span>';

                //html += '                               </td>';
                //html += '                           </tr>';

                //for (var i = 0; i < folders2.length; i++) { 
                for (var i = 0; i < filesandfolders.length; i++) {
                    html += '           <tr class="trSubfolder">';
                    html += '               <td id="rootDivisionCell" style="padding-left:40px;white-space:nowrap;">';

                    html += '<span id="spanDivisionTreeExpandCollapseButton_' + i + '" style="cursor:pointer;" onclick="$(\'.bwSlideshowAdmin\').bwSlideshowAdmin(\'collapseOrExpandTree\', \'\', \'spanDivisionTreeExpandCollapseButton_' + i + '\', \'' + i + '\');">';
                    html += '   <img title="collapse" style="cursor:pointer;width:35px;height:35px;vertical-align:middle;" src="images/drawer-open.png">';
                    html += '</span>';

                    html += ' <span id="spanOrgX_' + i + '" class="orgTreeNode" style="cursor:pointer;white-space:nowrap;" onclick="window.scrollTo(0, 0);$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'displayOrgRoleEditorInACircle\', true, \'' + i + '\');" onmouseover="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderOrgRoleConnectorsToWorkflowxx\', true, \'' + i + '\');" onmouseout="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderOrgRoleConnectorsToWorkflowResetxx\', \'' + 'spanOrgX_' + i + '\', \'' + i + '\');">';
                    html += '   <img src="images/folder.png" style="cursor:pointer;width:40px;" />';
                    html += '   &nbsp;&nbsp;';
                    html += '<span class="spanBwExternallySharedFiles_folder" bwexternallysharedfiles_folder="' + filesandfolders[i].folderName + '" bwexternallysharedfiles_folder_filecount="' + filesandfolders[i].files.length + '" >' + filesandfolders[i].folderName + ' (' + filesandfolders[i].files.length + ')</span>';

                    html += '</span>';
                    html += '  <span id="spanWorkflowPeoplePicker_' + i + '"></span>';
                    html += '               </td>';
                    html += '           </tr>';

                    html += '           <tr class="trSubfolder-files" style="display:none;" id="trDivisionGroups_' + i + '">'; // This is the row that expans or collapses (display: none | table-row)
                    html += '               <td style="padding-left:40px;white-space:nowrap;">';
                    html += '                   <table style="padding-left:15px;">';
                    html += '                       <tr>';
                    html += '                           <td>';
                    html += '<div id="divBwExternallySharedFiles_' + thiz.options.elementIdSuffix + '_file" style="padding-left:120px;text-decoration:none;" class="context-menu-externallysharedfiles">';
                    for (var j = 0; j < filesandfolders[i].files.length; j++) {
                        html += '<span class="spanBwExternallySharedFiles_file" bwexternallysharedfiles_folder="' + filesandfolders[i].folderName + '" bwexternallysharedfiles_folder_file="' + filesandfolders[i].files[j] + '" >';
                        html += '   <a target="_blank" href="' + externallyFacingUrlForAttachments + '/' + filesandfolders[i].folderName + '/' + filesandfolders[i].files[j] + '">' + externallyFacingUrlForAttachments + '/' + filesandfolders[i].folderName + '/' + filesandfolders[i].files[j] + '</a>';
                        html += '</span>';
                        html += '</br></br>';
                    }
                    html += '</div>';
                    html += '                           </td>';
                    html += '                       </tr>';
                    html += '                   </table>';
                    html += '               </td>';
                    html += '           </tr>';
                }
                html += '           </table>';
                html += '       </td>';
                html += '   </tr>';
                html += '</table>';

                html += '       </td>';
                html += '   </tr>';
                html += '</table>';

                thiz.element.html(html);

                this.checkIfWeHaveToDisplayThePublishChangesButton();

                for (var i = 0; i < filesandfolders.length; i++) {
                    $('#bwSlideshowAdmin_bwSlideSet_' + i).bwSlideSet({ elementIdSuffix: filesandfolders[i].folderName, folderAndFiles: filesandfolders[i] });
                }






                // Start off with the whole thing collapsed.
                $('.trSubfolder-files').css("display", "none");
                $('.trSubfolder').css("display", "none");

                // These are our right-click context menus. MIT license and code at: https://swisnl.github.io/jQuery-contextMenu/demo/trigger-custom.html

                // Folder right-click menu.
                $('.context-menu-externallysharedfiles').contextMenu({
                    selector: '.spanBwExternallySharedFiles_folder',
                    callback: function (key, options) {
                        try {
                            //var m = "clicked: " + key + " on " + $(this).text();
                            //window.console && console.log(m) || alert(m);

                            if (key == 'delete') {
                                var folder = $(this).attr('bwexternallysharedfiles_folder');
                                var fileCount = $(this).attr('bwexternallysharedfiles_folder_filecount');
                                alert('Are you sure you wish to delete folder "' + folder + '", which contains ' + fileCount + ' files? This functionality is incomplete. Coming soon!');
                            }
                        } catch (e) {
                            console.log('Exception in bwSlideshowAdmin.js.renderSlideSets.folder.contextMenu(): ' + e.message + ', ' + e.stack);
                            displayAlertDialog('Exception in bwSlideshowAdmin.js.renderSlideSets.folder.contextMenu(): ' + e.message + ', ' + e.stack);
                        }
                    },
                    items: {
                        //"edit": { name: "Edit", icon: "edit" },
                        //"cut": { name: "Cut", icon: "cut" },
                        //"copy": { name: "Copy", icon: "copy" },
                        //"paste": { name: "Paste", icon: "paste" },
                        "delete": { name: "Delete", icon: "delete" }//,
                        //"sep1": "---------",
                        //"quit": { name: "Quit", icon: function ($element, key, item) { return 'context-menu-icon context-menu-icon-quit'; } }
                    }
                });

                // File right-click menu.
                $('.context-menu-externallysharedfiles').contextMenu({
                    selector: '.spanBwExternallySharedFiles_file',
                    callback: function (key, options) {
                        try {
                            //var m = "clicked: " + key + " on " + $(this).text();
                            //window.console && console.log(m) || alert(m);

                            if (key == 'delete') {
                                var folder = $(this).attr('bwexternallysharedfiles_folder');
                                var file = $(this).attr('bwexternallysharedfiles_folder_file');
                                alert('Are you sure you wish to delete file "' + file + '" from folder "' + folder + '"? This functionality is incomplete. Coming soon!');
                            }
                        } catch (e) {
                            console.log('Exception in bwSlideshowAdmin.js.renderSlideSets.file.contextMenu(): ' + e.message + ', ' + e.stack);
                            displayAlertDialog('Exception in bwSlideshowAdmin.js.renderSlideSets.file.contextMenu(): ' + e.message + ', ' + e.stack);
                        }
                    },
                    items: {
                        //"edit": { name: "Edit", icon: "edit" },
                        //"cut": { name: "Cut", icon: "cut" },
                        //"copy": { name: "Copy", icon: "copy" },
                        //"paste": { name: "Paste", icon: "paste" },
                        "delete": { name: "Delete", icon: "delete" }//,
                        //"sep1": "---------",
                        //"quit": { name: "Quit", icon: function ($element, key, item) { return 'context-menu-icon context-menu-icon-quit'; } }
                    }
                });

            }

        } catch (e) {
            console.log('Exception in bwSlideshowAdmin.js.renderSlideSets(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwSlideshowAdmin.js.renderSlideSets(): ' + e.message + ', ' + e.stack);
        }
    },
    addSubSlide: function () {
        try {
            console.log('In addSubSlide().');


            alert('In addSubSlide().');



        } catch (e) {
            console.log('Exception in addSubSlide(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in addSubSlide(): ' + e.message + ', ' + e.stack);
        }
    },
    copyAndPaste_Copy: function (folderAndFile) {
        try {
            console.log('In copyAndPaste_Copy(). folderAndFile: ' + folderAndFile);

            localStorage.setItem('bwCopyAndPaste_OriginFolderAndFile', folderAndFile);

            // Paste button.
            $('.bwCopyAndPaste_Paste').removeClass('bwCopyAndPaste_Disabled');
            $('.bwCopyAndPaste_Paste').addClass('bwCopyAndPaste_Enabled');
            // Clear button.
            $('.bwCopyAndPaste_Clear').removeClass('bwCopyAndPaste_Disabled');
            $('.bwCopyAndPaste_Clear').addClass('bwCopyAndPaste_Enabled');

        } catch (e) {
            console.log('Exception in copyAndPaste_Copy(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in copyAndPaste_Copy(): ' + e.message + ', ' + e.stack);
        }
    },
    copyAndPaste_Paste: function (destinationFolderName) {
        try {
            console.log('In copyAndPaste_Paste(). destinationFolderName: ' + destinationFolderName);
            var thiz = this;

            var originFolderAndFile = localStorage.getItem('bwCopyAndPaste_OriginFolderAndFile');
            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier'); 

            //alert('In copyAndPaste_Paste(). WE NEED TO CALL THE "bwCopyAndPaste_Paste(ActiveStateIdentifier, originFilePath, destinationFilePath)" WEBSERVICE TO COPY THE SLIDE!!!!!!!!!!! destinationFolderName: ' + destinationFolderName + ', originFolderAndFile: ' + originFolderAndFile + ', activeStateIdentifier: ' + activeStateIdentifier);

            data = {
                ActiveStateIdentifier: activeStateIdentifier,
                OriginFolderAndFile: originFolderAndFile,
                DestinationFolderName: destinationFolderName
            };
            var operationUri = this.options.operationUriPrefix + '_files/' + 'bwCopyAndPaste_Paste'; 
            $.ajax({
                url: operationUri,
                type: "PUT",
                data: data,
                headers: { "Accept": "application/json; odata=verbose" },
                timeout: 15000,
                success: function (result) {
                    try {
                       
                        if (result == 'SUCCESS') {

                            localStorage.setItem('bwCopyAndPaste_OriginFolderAndFile', '');

                            thiz.loadFoldersAndFiles(); // Reload and redraw.

                            //// Paste button.
                            //$('.bwCopyAndPaste_Paste').removeClass('bwCopyAndPaste_Enabled');
                            //$('.bwCopyAndPaste_Paste').addClass('bwCopyAndPaste_Disabled');
                            //// Clear button.
                            //$('.bwCopyAndPaste_Clear').removeClass('bwCopyAndPaste_Enabled');
                            //$('.bwCopyAndPaste_Clear').addClass('bwCopyAndPaste_Disabled');

                        } else {
                            displayAlertDialog(result);
                        }
                       
                    } catch (e) {
                        console.log('Exception in copyAndPaste_Paste():2: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in copyAndPaste_Paste():2: ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    try {
                        //$('#divWorkingOnItDialog').dialog('close'); // Close the "Working on it..." dialog.
                        HideActivitySpinner();
                        console.log('Error in performUpload(): ' + errorMessage);
                        debugger;
                        if (errorMessage == 'timeout') {
                            displayAlertDialog('The file server could not be contacted. Please try again in a few minutes.');
                        } else {
                            displayAlertDialog('Error in copyAndPaste_Paste():xcx1: ' + errorMessage);
                        }
                    } catch (e) {
                        console.log('Exception in copyAndPaste_Paste():3: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in copyAndPaste_Paste():3: ' + e.message + ', ' + e.stack);
                    }
                }
            });

        } catch (e) {
            console.log('Exception in copyAndPaste_Paste(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in copyAndPaste_Paste(): ' + e.message + ', ' + e.stack);
        }
    },
    copyAndPaste_Clear: function () {
        try {
            console.log('In copyAndPaste_Clear().');

            localStorage.setItem('bwCopyAndPaste_OriginFolderAndFile', '');

            // Paste button.
            $('.bwCopyAndPaste_Paste').removeClass('bwCopyAndPaste_Enabled');
            $('.bwCopyAndPaste_Paste').addClass('bwCopyAndPaste_Disabled');
            // Clear button.
            $('.bwCopyAndPaste_Clear').removeClass('bwCopyAndPaste_Enabled');
            $('.bwCopyAndPaste_Clear').addClass('bwCopyAndPaste_Disabled');


        } catch (e) {
            console.log('Exception in copyAndPaste_Clear(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in copyAndPaste_Clear(): ' + e.message + ', ' + e.stack);
        }
    },
    cmdSaveSlideMetadata: function (bwBudgetRequestId, fileName, folderName) {
        try {
            console.log('In bwSlideshowAdmin.js.cmdSaveSlideMetadata(). fileName: ' + fileName + ', folderName: ' + folderName);

            var headerText = document.getElementById('bwSlideshowAdmin_SlidePropertiesDialog_File_HeaderText').value.replace(/["']/g, '');
            var descriptionText = document.getElementById('bwSlideshowAdmin_SlidePropertiesDialog_File_DescriptionText').value.replace(/["']/g, '');

            for (var i = 0; i < this.options.CurrentSlides.DraftSlideSets.FilesAndFolders.length; i++) {
                if (folderName == this.options.CurrentSlides.DraftSlideSets.FilesAndFolders[i].folderName) {
                    for (var j = 0; j < this.options.CurrentSlides.DraftSlideSets.FilesAndFolders[i].files.length; j++) {
                        if (fileName == this.options.CurrentSlides.DraftSlideSets.FilesAndFolders[i].files[j].fileName) {
                            this.options.CurrentSlides.DraftSlideSets.FilesAndFolders[i].files[j]["headerText"] = headerText;
                            this.options.CurrentSlides.DraftSlideSets.FilesAndFolders[i].files[j]["descriptionText"] = descriptionText;
                            break;
                        }
                    }
                    break;
                }
            }

            $('#bwSlideshowAdmin_SlidePropertiesDialog').dialog('close');
            $('.bwSlideshowAdmin').bwSlideshowAdmin('renderSlideSets');

        } catch (e) {
            console.log('Exception in bwSlideshowAdmin.js.cmdSaveSlideMetadata():2: ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwSlideshowAdmin.js.cmdSaveSlideMetadata():2: ' + e.message + ', ' + e.stack);
        }
    },
    cmdSaveSlideMetadata_subslide: function (FileId, fileName, folderName) {
        try {
            console.log('In bwSlideshowAdmin.js.cmdSaveSlideMetadata_subslide(). FileId: ' + FileId + ', fileName: ' + fileName + ', folderName: ' + folderName);

            var headerText = document.getElementById('bwSlideshowAdmin_SlidePropertiesDialog_File_HeaderText').value.replace(/["']/g, '');
            var descriptionText = document.getElementById('bwSlideshowAdmin_SlidePropertiesDialog_File_DescriptionText').value.replace(/["']/g, '');

            for (var i = 0; i < this.options.CurrentSlides.DraftSlideSets.FilesAndFolders.length; i++) {
                if (folderName == this.options.CurrentSlides.DraftSlideSets.FilesAndFolders[i].folderName) {
                    for (var j = 0; j < this.options.CurrentSlides.DraftSlideSets.FilesAndFolders[i].files.length; j++) {
                        if (FileId == this.options.CurrentSlides.DraftSlideSets.FilesAndFolders[i].files[j].FileId) {
                            this.options.CurrentSlides.DraftSlideSets.FilesAndFolders[i].files[j]["headerText"] = headerText;
                            this.options.CurrentSlides.DraftSlideSets.FilesAndFolders[i].files[j]["descriptionText"] = descriptionText;
                            break;
                        }
                    }
                }
            }

            //this.checkIfWeHaveToDisplayThePublishChangesButton();

            $('#bwSlideshowAdmin_SlidePropertiesDialog').dialog('close');

            $('.bwSlideshowAdmin').bwSlideshowAdmin('renderSlideSets');
            //$('#bwSlideshowAdmin_SlidePropertiesDialog').dialog('close');
           

        } catch (e) {
            console.log('Exception in bwSlideshowAdmin.js.cmdSaveSlideMetadata_subslide():2: ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwSlideshowAdmin.js.cmdSaveSlideMetadata_subslide():2: ' + e.message + ', ' + e.stack);
        }
    },
    displaySlidePropertiesInDialog: function (fileUrl, filename, descriptionText, bwBudgetRequestId, headerText, folderName) {
        try {
            console.log('In bwSlideshowAdmin.js.displaySlidePropertiesInDialog().');
            console.log('ADD THE ZOOM SLIDER TO THIS DIALOG!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
            console.log('*********************************************************************');
            console.log('In bwSlideshowAdmin.js.displaySlidePropertiesInDialog("' + fileUrl + '", "' + filename + '", "' + descriptionText + '", "' + bwBudgetRequestId + '").');
            console.log('*********************************************************************');
            console.log('');

            var thiz = this;

            window.scrollTo(0, 0); // Scroll to top on button click. This makes sure things render Ok, and also just seems like a nicer user experience.
            $('.bwActiveMenu_Admin').bwActiveMenu_Admin('adjustLeftSideMenu'); // This makes sure our new stretchy-left-menu redraws Ok.

            $('#divAttachmentsDialog1Contents').empty(); // We have to empty the contents of the dialog before it is displayed.

            document.getElementById('bwSlideshowAdmin_SlidePropertiesDialog_File_HeaderText').value = headerText;
            document.getElementById('bwSlideshowAdmin_SlidePropertiesDialog_File_DescriptionText').value = descriptionText;

            $("#bwSlideshowAdmin_SlidePropertiesDialog").dialog({
                modal: false,
                resizable: true,
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                width: "720px",
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false,//, // This means when hiding just disappear with no effects.
                position: {
                    my: "middle top+12",
                    at: "middle top",
                    of: window
                },
                close: function () {
                    $('#divAttachmentsDialog1Contents').html(''); // Theoretically, clearing this will stop a .mp4 from playing...... ????? 3-19-2022. CONFIRMED! It works with Safari on MacBook! Woop!
                    $(this).dialog('destroy');
                },
                open: function () {
                    try {
                        debugger; // 1-8-2022
                        var requestDialogId = 'bwSlideshowAdmin_SlidePropertiesDialog';

                        $('#' + requestDialogId).css('overflow', 'hidden'); // This keeps the scroll bars from showing up on the form dialog!!!!!!!! 7-13-2020

                        var element = document.getElementById(requestDialogId).parentNode; // This is the best way to get a handle on the jquery dialog.
                        var requestDialogParentId = requestDialogId + '_Parent'; // We need to have an id value so we can refer to this. It doesn't have one unless we add it here.
                        element.id = requestDialogParentId; // We need to have an id value so we can refer to this. It doesn't have one unless we add it here.

                        // This creates the custom header/draggable bar on the dialog!!! 4-2-2020. // ☈ ☇ https://www.toptal.com/designers/htmlarrows/symbols/thunderstorm/
                        var html = '';

                        html += '<table style="width:100%;" onclick="$(\'.bwRequest\').bwRequest(\'pinRequestDialog\');">'; // This click event is like "pin". Once the user clicks the header of the request dialog, it no longer is modal and persists on the screen until they choose to close it.
                        html += '   <tr>';
                        html += '       <td style="width:95%;">';
                        //html += '           <div id="slider_' + budgetRequestId + '" style="width:20%;cursor:pointer;"></div>';
                        html += '           <div id="slider_' + requestDialogId + '" style="width:20%;cursor:pointer;"></div>';
                        html += '       </td>';



                        html += '       <td style="vertical-align:middle;width:5%;padding:0;border:0;margin:0;">';


                        // 2-11-2022
                        //html += '           <div title="pin" class="pinButton" style="display:inline-block;font-size:18pt;cursor:pointer !important;" onclick="$(\'.bwRequest\').bwRequest(\'pinAttachmentsDialog\');"><img src="/images/pin2.jpeg" style="width:50px;height:50px;cursor:pointer !important;" onclick="$(\'.bwRequest\').bwRequest(\'pinAttachmentsDialog\');" /></div>';


                        html += '       </td>';

                        html += '       <td style="vertical-align:middle;width:5%;padding:0;border:0;margin:0;">';






                        html += '           <div title="print" class="printButton" style="display:inline-block;font-size:18pt;cursor:pointer !important;" onclick="$(\'.bwPrintButton\').bwPrintButton(\'PrintIndividualRequestReport\', \'' + 'divAttachmentsDialog1Contents' + '\');"><img src="/images/iosprinter_blue.png" style="width:50px;height:50px;cursor:pointer !important;"  /></div>';





                        html += '       </td>';
                        html += '       <td>&nbsp;&nbsp;</td>';
                        html += '       <td>';
                        html += '           <span class="dialogXButton" style="font-size:25pt;cursor:pointer;width:100%;font-weight:bold;" onclick="$(\'#bwSlideshowAdmin_SlidePropertiesDialog\').dialog(\'close\');">X</span>';
                        html += '       </td>';
                        html += '   </tr>';
                        html += '</table>';
                        document.getElementById(requestDialogId).parentNode.querySelector(".ui-dialog-titlebar").innerHTML = html;

                        $("#slider_" + requestDialogId).slider({
                            min: 50,
                            max: 200,
                            value: 100, // It starts off full size.
                            slide: function (event, ui) {
                                //thiz.setZoom(ui.value, requestDialogId);
                                $('.bwRequest').bwRequest('setZoom', ui.value, requestDialogId);
                            }//,
                            //change: function (event, ui) {
                            //    thiz.setZoom(ui.value, requestDialogId);
                            //}
                        });
                        try {
                            $('.bwRequest').bwRequest('setZoom', '100', requestDialogId);
                        } catch (e) { } // This is here because the backend doesn't use the bwRequest.js widget.
                    } catch (e) {
                        console.log('Exception in bwSlideshowAdmin.js.bwSlideshowAdmin_SlidePropertiesDialog.dialog.open(): ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwSlideshowAdmin.js.bwSlideshowAdmin_SlidePropertiesDialog.dialog.open(): ' + e.message + ', ' + e.stack);
                    }
                }
            });
            //$("#AttachmentsDialog1").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();




            // We need to add these files extensions below!
            // .MP3 (audio), .MP4 (audio), .M4A (audio), .M4V (video), .M4R ("tones"), 




            var html = '';
            //debugger;
            // We need to present these by using file extension. This displays all images. .jpg, .png, .xx << Todd: need work here.
            if (fileUrl.toUpperCase().indexOf('.XLSX') > -1 || fileUrl.toUpperCase().indexOf('.XLS') > -1) {

                // Excel attachments.
                $('#spanAttachmentsDialog1Title').html('<span style="font-size:30pt;font-weight:bold;color:lightgray;">Slide</span> Select the link below to view the EXCEL document...');
                html += '<a href="' + fileUrl + '" target="_blank"><img src="images/excelicon.png" style="width:100px;height:46px;cursor:pointer;" /></a>';
                html += '<a href="' + fileUrl + '" target="_blank">Click here to view in EXCEL</a>';
                //html += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
                //html += '<a href="javascript:displayExcelDocumentInBrowser(\'' + fileUrl + '\');" target="_blank">Click here to view in browser</a>';

            } else if (fileUrl.toUpperCase().indexOf('.JFIF') > -1 || fileUrl.toUpperCase().indexOf('.PNG') > -1 || fileUrl.toUpperCase().indexOf('.JPG') > -1 || fileUrl.toUpperCase().indexOf('.JPEG') > -1 || fileUrl.toUpperCase().indexOf('.BMP') > -1 || fileUrl.toUpperCase().indexOf('.GIF') > -1 || fileUrl.toUpperCase().indexOf('.TIFF') > -1 || fileUrl.toUpperCase().indexOf('.SVG') > -1 || fileUrl.toUpperCase().indexOf('.WEBP') > -1) {
                // Images.


                $('#spanAttachmentsDialog1Title').html('<span style="font-size:30pt;font-weight:bold;color:lightgray;">Slide</span>');




                html += '<img src="' + fileUrl + '" style="width:700px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;" onclick="displayFullSizedAttachmentInDialog(\'' + fileUrl + '\');" />';
            } else if (fileUrl.toUpperCase().indexOf('.PDF') > -1 || fileUrl.toUpperCase().indexOf('.RTF') > -1 || fileUrl.toUpperCase().indexOf('.DOC') > -1 || fileUrl.toUpperCase().indexOf('.DOCX') > -1 || fileUrl.toUpperCase().indexOf('.TXT') > -1 || fileUrl.toUpperCase().indexOf('.ODT') > -1 || fileUrl.toUpperCase().indexOf('.ODS') > -1 || fileUrl.toUpperCase().indexOf('.ODP') > -1) {
                // Documents.
                $('#spanAttachmentsDialog1Title').html('<span style="font-size:30pt;font-weight:bold;color:lightgray;">Slide</span> Select the link below to view the document...');
                html += '<a href="' + fileUrl + '" target="_blank">Click here to view the document</a>';
            } else if (fileUrl.toUpperCase().indexOf('.MP3') > -1 || fileUrl.toUpperCase().indexOf('.M4A') > -1 || fileUrl.toUpperCase().indexOf('.M4R') > -1) {
                // Audio.
                $('#spanAttachmentsDialog1Title').html('<span style="font-size:30pt;font-weight:bold;color:lightgray;">Slide</span> Select the link below to listen...');
                if (iOSApp == 'YES') {
                    html += '<a href="' + fileUrl + '">Click here to listen</a>';
                } else {
                    html += '<div style="text-align:center;"><audio src="' + fileUrl + '" controls="controls">Click here to listen</audio></div>';
                }



                html += '<br />';
                html += '<a style="float:right;" href="' + fileUrl + '" download>Click here to download...</a>'; // This is the first a element with a download attribute... more to follow... 4-14-2022.






            } else if (fileUrl.toUpperCase().indexOf('.M4V') > -1 || fileUrl.toUpperCase().indexOf('.AVI') > -1 || fileUrl.toUpperCase().indexOf('.MOV') > -1 || fileUrl.toUpperCase().indexOf('.MP4') > -1) {
                //// Video.
                //$('#spanAttachmentsDialog1Title').html('Select the link below to view...');
                //if (iOSApp == 'YES') {
                //    html += '<a href="' + fileUrl + '">Click here to view</a>';
                //} else {
                //    html += '<audio src="' + fileUrl + '" controls="controls">Click here to view</audio>';
                //}


                // Video.
                $('#spanAttachmentsDialog1Title').html('<span style="font-size:30pt;font-weight:bold;color:lightgray;">Slide</span>');
                if (iOSApp == 'YES') {
                    html += '<a href="' + fileUrl + '">Click here to view</a>';
                } else {
                    html += '<div style="text-align:center;"><video controls="controls" width="650" ><source src="' + fileUrl + '" type="video/mp4"></video></div>'; // This sets the size of the video control\element.
                }
            } else {
                $('#spanAttachmentsDialog1Title').html('<span style="font-size:30pt;font-weight:bold;color:lightgray;">Slide</span> This attachment has an unknown file extension...');
                html += '<a xcx="xcx21432356-1" href="' + fileUrl + '" target="_blank">Click here to try to open this file</a>';
                //html += '<span style="font-size:40pt;">Unknown file extension</span>';
            }
            $('#divAttachmentsDialog1Contents').html(html);



            // Create the "Save" button.
            html = '';
            //html += '<div id="btnAttachmentsDialog1SaveMetadata" class="divDialogButton" onclick="$(\'.bwAttachments\').bwAttachments(\'cmdSaveAttachmentMetadata\', \'' + bwBudgetRequestId + '\', \'' + filename + '\');">Save</div>';
            html += '<div id="btnAttachmentsDialog1SaveMetadata" class="divDialogButton" onclick="$(\'.bwSlideshowAdmin\').bwSlideshowAdmin(\'cmdSaveSlideMetadata\', \'' + bwBudgetRequestId + '\', \'' + filename + '\', \'' + folderName + '\');">Save</div>';
            $('#spanAttachmentsDialog1SaveMetadataButton').html(html);

            //// Create the "Delete" button.
            //html = '';
            ////html += '<div id="btnAttachmentsDialog1DeleteAttachment" class="divDialogButton" onclick="$(\'.bwAttachments\').bwAttachments(\'cmdDeleteAttachment\', \'' + bwBudgetRequestId + '\', \'' + filename + '\');">Delete</div>';
            //html += '<div id="btnAttachmentsDialog1DeleteAttachment" class="divDialogButton" onclick="$(\'.bwSlideshowAdmin\').bwSlideshowAdmin(\'cmdDeleteAttachment\', \'' + bwBudgetRequestId + '\', \'' + filename + '\');">Delete</div>';
            //$('#spanAttachmentsDialog1DeleteAttachmentButton').html(html);

            //// Bind the "Save" button.
            //$('#btnAttachmentsDialog1SaveMetadata').click(function (error) {
            //    cmdSaveAttachmentMetadata(bwBudgetRequestId, filename);
            //});

            //// Bind the "Delete" button.
            //$('#btnAttachmentsDialog1DeleteAttachment').click(function (error) {
            //    cmdDeleteAttachment(bwBudgetRequestId, filename);
            //});









            // Populate the dialog with the filename and description.
            if (filename != 'undefined') {
                var extensionIndex = filename.lastIndexOf('.');
                var filenamePrefix = filename.substring(0, extensionIndex);
                var fileExtension = '.' + filename.substring(extensionIndex + 1, filename.length);
                document.getElementById('txtAttachmentsDialog1Filename').value = filenamePrefix;
                document.getElementById('spanAttachmentsDialog1FileExtension').innerHTML = fileExtension;
            } else {
                document.getElementById('txtAttachmentsDialog1Filename').value = '';
            }

            //if (filename != 'description') document.getElementById('bwSlideshowAdmin_SlidePropertiesDialog_File_HeaderText').value = description;
            //else document.getElementById('bwSlideshowAdmin_SlidePropertiesDialog_File_HeaderText').value = '';

            //document.getElementById('bwSlideshowAdmin_SlidePropertiesDialog_File_HeaderText').value = headerText;
            //document.getElementById('bwSlideshowAdmin_SlidePropertiesDialog_File_DescriptionText').value = descriptionText;

        } catch (e) {
            console.log('Exception in bwSlideshowAdmin.js.displaySlidePropertiesInDialog():2:' + e.message + ', fileUrl: ' + fileUrl + ', ' + e.stack);
            displayAlertDialog('Exception in bwSlideshowAdmin.js.displaySlidePropertiesInDialog():2:' + e.message + ', fileUrl: ' + fileUrl + ', ' + e.stack);
        }
    },
    displaySlidePropertiesInDialog_subslide: function (fileUrl, filename, descriptionText, FileId, headerText, folderName) {
        try {
            console.log('In bwSlideshowAdmin.js.displaySlidePropertiesInDialog_subslide().');
            console.log('ADD THE ZOOM SLIDER TO THIS DIALOG!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
            console.log('*********************************************************************');
            console.log('In bwSlideshowAdmin.js.displaySlidePropertiesInDialog_subslide("' + fileUrl + '", "' + filename + '", "' + descriptionText + '", "' + FileId + '").');
            console.log('*********************************************************************');
            console.log('');
            debugger;
            var thiz = this;

            window.scrollTo(0, 0); // Scroll to top on button click. This makes sure things render Ok, and also just seems like a nicer user experience.
            $('.bwActiveMenu_Admin').bwActiveMenu_Admin('adjustLeftSideMenu'); // This makes sure our new stretchy-left-menu redraws Ok.

            $('#divAttachmentsDialog1Contents').empty(); // We have to empty the contents of the dialog before it is displayed.

            document.getElementById('bwSlideshowAdmin_SlidePropertiesDialog_File_HeaderText').value = headerText;
            document.getElementById('bwSlideshowAdmin_SlidePropertiesDialog_File_DescriptionText').value = descriptionText;

            $("#bwSlideshowAdmin_SlidePropertiesDialog").dialog({
                modal: false,
                resizable: true,
                closeOnEscape: false, // Hit the ESC key to hide! Yeah!
                width: "720px",
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false,//, // This means when hiding just disappear with no effects.
                position: {
                    my: "middle top+12",
                    at: "middle top",
                    of: window
                },
                close: function () {
                    $('#divAttachmentsDialog1Contents').html(''); // Theoretically, clearing this will stop a .mp4 from playing...... ????? 3-19-2022. CONFIRMED! It works with Safari on MacBook! Woop!
                    $(this).dialog('destroy');
                },
                open: function () {
                    try {
                        debugger; // 1-8-2022
                        var requestDialogId = 'bwSlideshowAdmin_SlidePropertiesDialog';

                        $('#' + requestDialogId).css('overflow', 'hidden'); // This keeps the scroll bars from showing up on the form dialog!!!!!!!! 7-13-2020

                        var element = document.getElementById(requestDialogId).parentNode; // This is the best way to get a handle on the jquery dialog.
                        var requestDialogParentId = requestDialogId + '_Parent'; // We need to have an id value so we can refer to this. It doesn't have one unless we add it here.
                        element.id = requestDialogParentId; // We need to have an id value so we can refer to this. It doesn't have one unless we add it here.

                        // This creates the custom header/draggable bar on the dialog!!! 4-2-2020. // ☈ ☇ https://www.toptal.com/designers/htmlarrows/symbols/thunderstorm/
                        var html = '';

                        html += '<table style="width:100%;" onclick="$(\'.bwRequest\').bwRequest(\'pinRequestDialog\');">'; // This click event is like "pin". Once the user clicks the header of the request dialog, it no longer is modal and persists on the screen until they choose to close it.
                        html += '   <tr>';
                        html += '       <td style="width:95%;">';
                        //html += '           <div id="slider_' + budgetRequestId + '" style="width:20%;cursor:pointer;"></div>';
                        html += '           <div id="slider_' + requestDialogId + '" style="width:20%;cursor:pointer;"></div>';
                        html += '       </td>';



                        html += '       <td style="vertical-align:middle;width:5%;padding:0;border:0;margin:0;">';


                        // 2-11-2022
                        //html += '           <div title="pin" class="pinButton" style="display:inline-block;font-size:18pt;cursor:pointer !important;" onclick="$(\'.bwRequest\').bwRequest(\'pinAttachmentsDialog\');"><img src="/images/pin2.jpeg" style="width:50px;height:50px;cursor:pointer !important;" onclick="$(\'.bwRequest\').bwRequest(\'pinAttachmentsDialog\');" /></div>';


                        html += '       </td>';

                        html += '       <td style="vertical-align:middle;width:5%;padding:0;border:0;margin:0;">';






                        html += '           <div title="print" class="printButton" style="display:inline-block;font-size:18pt;cursor:pointer !important;" onclick="$(\'.bwPrintButton\').bwPrintButton(\'PrintIndividualRequestReport\', \'' + 'divAttachmentsDialog1Contents' + '\');"><img src="/images/iosprinter_blue.png" style="width:50px;height:50px;cursor:pointer !important;"  /></div>';





                        html += '       </td>';
                        html += '       <td>&nbsp;&nbsp;</td>';
                        html += '       <td>';
                        html += '           <span class="dialogXButton" style="font-size:25pt;cursor:pointer;width:100%;font-weight:bold;" onclick="$(\'#bwSlideshowAdmin_SlidePropertiesDialog\').dialog(\'close\');">X</span>';
                        html += '       </td>';
                        html += '   </tr>';
                        html += '</table>';
                        document.getElementById(requestDialogId).parentNode.querySelector(".ui-dialog-titlebar").innerHTML = html;

                        $("#slider_" + requestDialogId).slider({
                            min: 50,
                            max: 200,
                            value: 100, // It starts off full size.
                            slide: function (event, ui) {
                                //thiz.setZoom(ui.value, requestDialogId);
                                $('.bwRequest').bwRequest('setZoom', ui.value, requestDialogId);
                            }//,
                            //change: function (event, ui) {
                            //    thiz.setZoom(ui.value, requestDialogId);
                            //}
                        });
                        try {
                            $('.bwRequest').bwRequest('setZoom', '100', requestDialogId);
                        } catch (e) { } // This is here because the backend doesn't use the bwRequest.js widget.
                    } catch (e) {
                        console.log('Exception in bwSlideshowAdmin.js.bwSlideshowAdmin_SlidePropertiesDialog.dialog.open(): ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwSlideshowAdmin.js.bwSlideshowAdmin_SlidePropertiesDialog.dialog.open(): ' + e.message + ', ' + e.stack);
                    }
                }
            });
            //$("#AttachmentsDialog1").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();




            // We need to add these files extensions below!
            // .MP3 (audio), .MP4 (audio), .M4A (audio), .M4V (video), .M4R ("tones"), 




            var html = '';
            //debugger;
            // We need to present these by using file extension. This displays all images. .jpg, .png, .xx << Todd: need work here.
            if (fileUrl.toUpperCase().indexOf('.XLSX') > -1 || fileUrl.toUpperCase().indexOf('.XLS') > -1) {

                // Excel attachments.
                $('#spanAttachmentsDialog1Title').html('<span style="font-size:30pt;font-weight:bold;color:lightgray;">Slide</span> Select the link below to view the EXCEL document...');
                html += '<a href="' + fileUrl + '" target="_blank"><img src="images/excelicon.png" style="width:100px;height:46px;cursor:pointer;" /></a>';
                html += '<a href="' + fileUrl + '" target="_blank">Click here to view in EXCEL</a>';
                //html += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
                //html += '<a href="javascript:displayExcelDocumentInBrowser(\'' + fileUrl + '\');" target="_blank">Click here to view in browser</a>';

            } else if (fileUrl.toUpperCase().indexOf('.JFIF') > -1 || fileUrl.toUpperCase().indexOf('.PNG') > -1 || fileUrl.toUpperCase().indexOf('.JPG') > -1 || fileUrl.toUpperCase().indexOf('.JPEG') > -1 || fileUrl.toUpperCase().indexOf('.BMP') > -1 || fileUrl.toUpperCase().indexOf('.GIF') > -1 || fileUrl.toUpperCase().indexOf('.TIFF') > -1 || fileUrl.toUpperCase().indexOf('.SVG') > -1 || fileUrl.toUpperCase().indexOf('.WEBP') > -1) {
                // Images.


                $('#spanAttachmentsDialog1Title').html('<span style="font-size:30pt;font-weight:bold;color:lightgray;">Slide</span>');




                html += '<img src="' + fileUrl + '" style="width:700px;display:block;margin-left:auto;margin-right:auto;cursor:pointer;" onclick="displayFullSizedAttachmentInDialog(\'' + fileUrl + '\');" />';
            } else if (fileUrl.toUpperCase().indexOf('.PDF') > -1 || fileUrl.toUpperCase().indexOf('.RTF') > -1 || fileUrl.toUpperCase().indexOf('.DOC') > -1 || fileUrl.toUpperCase().indexOf('.DOCX') > -1 || fileUrl.toUpperCase().indexOf('.TXT') > -1 || fileUrl.toUpperCase().indexOf('.ODT') > -1 || fileUrl.toUpperCase().indexOf('.ODS') > -1 || fileUrl.toUpperCase().indexOf('.ODP') > -1) {
                // Documents.
                $('#spanAttachmentsDialog1Title').html('<span style="font-size:30pt;font-weight:bold;color:lightgray;">Slide</span> Select the link below to view the document...');
                html += '<a href="' + fileUrl + '" target="_blank">Click here to view the document</a>';
            } else if (fileUrl.toUpperCase().indexOf('.MP3') > -1 || fileUrl.toUpperCase().indexOf('.M4A') > -1 || fileUrl.toUpperCase().indexOf('.M4R') > -1) {
                // Audio.
                $('#spanAttachmentsDialog1Title').html('<span style="font-size:30pt;font-weight:bold;color:lightgray;">Slide</span> Select the link below to listen...');
                if (iOSApp == 'YES') {
                    html += '<a href="' + fileUrl + '">Click here to listen</a>';
                } else {
                    html += '<div style="text-align:center;"><audio src="' + fileUrl + '" controls="controls">Click here to listen</audio></div>';
                }



                html += '<br />';
                html += '<a style="float:right;" href="' + fileUrl + '" download>Click here to download...</a>'; // This is the first a element with a download attribute... more to follow... 4-14-2022.






            } else if (fileUrl.toUpperCase().indexOf('.M4V') > -1 || fileUrl.toUpperCase().indexOf('.AVI') > -1 || fileUrl.toUpperCase().indexOf('.MOV') > -1 || fileUrl.toUpperCase().indexOf('.MP4') > -1) {
                //// Video.
                //$('#spanAttachmentsDialog1Title').html('Select the link below to view...');
                //if (iOSApp == 'YES') {
                //    html += '<a href="' + fileUrl + '">Click here to view</a>';
                //} else {
                //    html += '<audio src="' + fileUrl + '" controls="controls">Click here to view</audio>';
                //}


                // Video.
                $('#spanAttachmentsDialog1Title').html('<span style="font-size:30pt;font-weight:bold;color:lightgray;">Slide</span>');
                if (iOSApp == 'YES') {
                    html += '<a href="' + fileUrl + '">Click here to view</a>';
                } else {
                    html += '<div style="text-align:center;"><video controls="controls" width="650" ><source src="' + fileUrl + '" type="video/mp4"></video></div>'; // This sets the size of the video control\element.
                }
            } else {
                $('#spanAttachmentsDialog1Title').html('<span style="font-size:30pt;font-weight:bold;color:lightgray;">Slide</span> This attachment has an unknown file extension...');
                html += '<a xcx="xcx21432356-2" href="' + fileUrl + '" target="_blank">Click here to try to open this file</a>';
                //html += '<span style="font-size:40pt;">Unknown file extension</span>';
            }
            $('#divAttachmentsDialog1Contents').html(html);



            // Create the "Save" button.
            html = '';
            //html += '<div id="btnAttachmentsDialog1SaveMetadata" class="divDialogButton" onclick="$(\'.bwAttachments\').bwAttachments(\'cmdSaveAttachmentMetadata\', \'' + bwBudgetRequestId + '\', \'' + filename + '\');">Save</div>';
            html += '<div id="btnAttachmentsDialog1SaveMetadata" class="divDialogButton" onclick="$(\'.bwSlideshowAdmin\').bwSlideshowAdmin(\'cmdSaveSlideMetadata_subslide\', \'' + FileId + '\', \'' + filename + '\', \'' + folderName + '\');">Save</div>';
            $('#spanAttachmentsDialog1SaveMetadataButton').html(html);

            //// Create the "Delete" button.
            //html = '';
            ////html += '<div id="btnAttachmentsDialog1DeleteAttachment" class="divDialogButton" onclick="$(\'.bwAttachments\').bwAttachments(\'cmdDeleteAttachment\', \'' + bwBudgetRequestId + '\', \'' + filename + '\');">Delete</div>';
            //html += '<div id="btnAttachmentsDialog1DeleteAttachment" class="divDialogButton" onclick="$(\'.bwSlideshowAdmin\').bwSlideshowAdmin(\'cmdDeleteAttachment\', \'' + bwBudgetRequestId + '\', \'' + filename + '\');">Delete</div>';
            //$('#spanAttachmentsDialog1DeleteAttachmentButton').html(html);

            //// Bind the "Save" button.
            //$('#btnAttachmentsDialog1SaveMetadata').click(function (error) {
            //    cmdSaveAttachmentMetadata(bwBudgetRequestId, filename);
            //});

            //// Bind the "Delete" button.
            //$('#btnAttachmentsDialog1DeleteAttachment').click(function (error) {
            //    cmdDeleteAttachment(bwBudgetRequestId, filename);
            //});









            // Populate the dialog with the filename and description.
            if (filename != 'undefined') {
                var extensionIndex = filename.lastIndexOf('.');
                var filenamePrefix = filename.substring(0, extensionIndex);
                var fileExtension = '.' + filename.substring(extensionIndex + 1, filename.length);
                document.getElementById('txtAttachmentsDialog1Filename').value = filenamePrefix;
                document.getElementById('spanAttachmentsDialog1FileExtension').innerHTML = fileExtension;
            } else {
                document.getElementById('txtAttachmentsDialog1Filename').value = '';
            }

            //if (filename != 'description') document.getElementById('bwSlideshowAdmin_SlidePropertiesDialog_File_HeaderText').value = description;
            //else document.getElementById('bwSlideshowAdmin_SlidePropertiesDialog_File_HeaderText').value = '';

            //document.getElementById('bwSlideshowAdmin_SlidePropertiesDialog_File_HeaderText').value = headerText;
            //document.getElementById('bwSlideshowAdmin_SlidePropertiesDialog_File_DescriptionText').value = descriptionText;

        } catch (e) {
            console.log('Exception in bwSlideshowAdmin.js.displaySlidePropertiesInDialog_subslide():2:' + e.message + ', fileUrl: ' + fileUrl + ', ' + e.stack);
            displayAlertDialog('Exception in bwSlideshowAdmin.js.displaySlidePropertiesInDialog_subslide():2:' + e.message + ', fileUrl: ' + fileUrl + ', ' + e.stack);
        }
    },

    publishSlideshow: function () {
        try {
            console.log('In bwSlideshowAdmin.js.publishSlideshow().');
            var thiz = this;

            // Take the draft version (DraftSlideSets) and copy it into SlideSets. This is how we publish.
            var draftJson = JSON.parse(JSON.stringify(this.options.CurrentSlides.DraftSlideSets));
            this.options.CurrentSlides.SlideSets = draftJson;

            var data = {
                CurrentSlidesJson: this.options.CurrentSlides.SlideSets
            };
            $.ajax({
                url: this.options.operationUriPrefix + "_files/publishslidesets",
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: function (result) {
                    try {
                        console.log('In bwSlideshowAdmin.js.publishSlideshow().');
                        if (result.message != 'SUCCESS') {

                            displayAlertDialog(result.message);

                        } else {

                            thiz.loadFoldersAndFiles();
                            //thiz.checkIfWeHaveToDisplayThePublishChangesButton();
                            //displayAlertDialog('Published successfully.');

                        }

                    } catch (e) {
                        console.log('Exception in bwSlideshowAdmin.js.publishSlideshow():2: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwSlideshowAdmin.js.publishSlideshow():2: ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    console.log('Error in bwSlideshowAdmin.js.publishSlideshow():1: ' + errorCode + ', ' + errorMessage);
                    displayAlertDialog('Error in bwSlideshowAdmin.js.publishSlideshow():1: ' + errorCode + ', ' + errorMessage);
                }
            });

        } catch (e) {
            console.log('Exception in bwSlideshowAdmin.js.publishSlideshow(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwSlideshowAdmin.js.publishSlideshow(): ' + e.message + ', ' + e.stack);
        }
    },
    cancelChangesInDraftSlideshow: function () {
        try {
            console.log('In bwSlideshowAdmin.js.cancelChangesInDraftSlideshow().');

            var json = JSON.parse(JSON.stringify(this.options.CurrentSlides.SlideSets));
            this.options.CurrentSlides.DraftSlideSets = json;

            this.renderSlideSets();

        } catch (e) {
            console.log('Exception in bwSlideshowAdmin.js.cancelChangesInDraftSlideshow(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwSlideshowAdmin.js.cancelChangesInDraftSlideshow(): ' + e.message + ', ' + e.stack);
        }
    },
    checkIfWeHaveToDisplayThePublishChangesButton: function () {
        try {
            console.log('In bwSlideshowAdmin.js.checkIfWeHaveToDisplayThePublishChangesButton().');
            debugger;
            var thereHaveBeenChangesToTheForm = false;
            var oldJsonString = JSON.stringify(this.options.CurrentSlides.SlideSets);
            var newJsonString = JSON.stringify(this.options.CurrentSlides.DraftSlideSets);
            if (oldJsonString != newJsonString) {
                thereHaveBeenChangesToTheForm = true;
            }
            if (thereHaveBeenChangesToTheForm == true) {
                // The user has made changes to the workflow.
                //document.getElementById('spanThereAreChangesToPublishText').innerHTML = 'You have changes that won\'t be available until you publish: ';
                $(this.element).find('#spanThereAreChangesToPublishText')[0].innerHTML = 'You have changes that won\'t be available until you publish: ';
                var html = '';
                html += '<input style="padding:5px 10px 5px 10px;width:100px;" id="btnSaveWorkflowConfigurationAndActivate" type="button" value="Publish" onclick="$(\'.bwSlideshowAdmin\').bwSlideshowAdmin(\'publishSlideshow\');" />';
                html += '&nbsp;<input style="padding:5px 10px 5px 10px;" id="btnCancelChangesInDraftWorkflowConfiguration" type="button" value="Cancel Changes" onclick="$(\'.bwSlideshowAdmin\').bwSlideshowAdmin(\'cancelChangesInDraftSlideshow\');" />';
                //document.getElementById('spanThereAreChangesToPublishButton').innerHTML = html;
                $(this.element).find('#spanThereAreChangesToPublishButton')[0].innerHTML = html;
            } else {
                // Do nothing because the user has made no changes to the workflow.
                $(this.element).find('#spanThereAreChangesToPublishText')[0].innerHTML = '';
                $(this.element).find('#spanThereAreChangesToPublishButton')[0].innerHTML = '';
            }
        } catch (e) {
            console.log('Exception in bwSlideshowAdmin.js.checkIfWeHaveToDisplayThePublishChangesButton(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwSlideshowAdmin.js.checkIfWeHaveToDisplayThePublishChangesButton(): ' + e.message + ', ' + e.stack);
        }
    },
    

    createNewSlideSet: function () {
        try {
            console.log('In bwSlideshowAdmin.js.createNewSlideSet().');
            var thiz = this;

            var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });

            var data = {
                SlideSetGuid: guid
            };
            $.ajax({
                url: this.options.operationUriPrefix + "_files/createnewslideshowslideset",
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: function (result) {
                    try {
                        console.log('In bwSlideshowAdmin.js.loadFoldersAndFiles(). Got data from _files/slideshowslidesets(). ' + JSON.stringify(result));
                        if (result.message != 'SUCCESS') {

                            displayAlertDialog(result.message);

                        } else {

                            thiz.loadFoldersAndFiles(); // Reload.

                        }

                    } catch (e) {
                        console.log('Exception in bwSlideshowAdmin.js.createNewSlideSet():2: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwSlideshowAdmin.js.createNewSlideSet():2: ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    console.log('Error in bwSlideshowAdmin.js.createNewSlideSet():1: ' + errorCode + ', ' + errorMessage);
                    displayAlertDialog('Error in bwSlideshowAdmin.js.createNewSlideSet():1: ' + errorCode + ', ' + errorMessage);
                }
            });

        } catch (e) {
            console.log('Exception in bwSlideshowAdmin.js.createNewSlideSet(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwSlideshowAdmin.js.createNewSlideSet(): ' + e.message + ', ' + e.stack);
        }
    },

    collapseOrExpandTree: function (instructions, elementId, divisionIndex, groupIndex, entityIndex) {
        try {
            console.log('In collapseOrExpandTree(). instructions: ' + instructions + ', elementId: ' + elementId + ', divisionIndex: ' + divisionIndex + ', groupIndex: ' + groupIndex + ', entityIndex: ' + entityIndex);

            var externallyFacingUrlForAttachmentsSourceFolder = $('.bwAuthentication').bwAuthentication('option', 'externallyFacingUrlForAttachmentsSourceFolder');

            //var tableSubfolders = 'tableBwExternallySharedFiles_' + this.options.elementIdSuffix + '_subfolders';

            if (divisionIndex == 'root') {
                if (document.getElementById(elementId).innerHTML.indexOf('drawer-open.png') > -1) {
                    // Expand all of the divisions.

                    //document.getElementById(tableSubfolders).style.display = 'inline';
                    $('.trSubfolder').css("display", "table-row");

                    var html = '';
                    html += '                                       <span style="font-weight:normal;">';
                    html += '<img src="images/drawer-close.png" style="cursor:pointer;width:46px;height:46px;" />';
                    html += '&nbsp;&nbsp;';
                    html += '<img src="images/folder.png" style="cursor:pointer;width:60px;" />';
                    html += '&nbsp;&nbsp;' + externallyFacingUrlForAttachmentsSourceFolder;
                    html += '<br />';
                    html += '<br />';
                    html += '                                       </span> ';



                    document.getElementById(elementId).innerHTML = html; //'<img title="collapse" style="cursor:pointer;width:35px;height:35px;vertical-align:middle;" src="images/drawer-close.png" /> ';
                    //    var json = this.options.store;
                    //    for (var d = 0; d < json.Global.Divisions.Items.length; d++) {
                    //        // expand
                    //        var elementId = 'trDivisionGroups_' + d;
                    //        document.getElementById(elementId).style.display = 'table-row';
                    //        // change the icon
                    //        document.getElementById('spanDivisionTreeExpandCollapseButton_' + d).innerHTML = '<img title="collapse" style="cursor:pointer;width:35px;height:35px;vertical-align:middle;" src="images/drawer-close.png" /> '; // This is the division root node
                    //    }
                } else {
                    // Collapse all of the divisions.

                    //document.getElementById(tableSubfolders).style.display = 'none';
                    $('.trSubfolder-files').css("display", "none");
                    $('.trSubfolder').css("display", "none");

                    var html = '';
                    html += '                                       <span style="font-weight:normal;">';
                    html += '<img src="images/drawer-open.png" style="cursor:pointer;width:46px;height:46px;" />';
                    html += '&nbsp;&nbsp;';
                    html += '<img src="images/folder.png" style="cursor:pointer;width:60px;" />';
                    html += '&nbsp;&nbsp;' + externallyFacingUrlForAttachmentsSourceFolder;
                    html += '<br />';
                    html += '<br />';
                    html += '                                       </span> ';

                    document.getElementById(elementId).innerHTML = html; //'<img title="collapse" style="cursor:pointer;width:35px;height:35px;vertical-align:middle;" src="images/drawer-open.png" /> '; // This is the root global node.
                    //    var json = this.options.store;
                    //    for (var d = 0; d < json.Global.Divisions.Items.length; d++) {
                    //        // collapse
                    //        var elementId = 'trDivisionGroups_' + d;
                    //        document.getElementById(elementId).style.display = 'none';
                    //        // change the icon
                    //        document.getElementById('spanDivisionTreeExpandCollapseButton_' + d).innerHTML = '<img title="collapse" style="cursor:pointer;width:35px;height:35px;vertical-align:middle;" src="images/drawer-open.png" /> '; // This is the division root node
                    //    }
                }
            } else {


                if (entityIndex || entityIndex > -1) {
                    //debugger;
                    //this.options.store.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items[entityIndex].Locations.Style = 'display:none;'; // Collapse!
                    //this._create();


                    if (document.getElementById(elementId).innerHTML.indexOf('drawer-open.png') > -1) {
                        // Expand all of the divisions.
                        document.getElementById(elementId).innerHTML = '<img title="collapse" style="cursor:pointer;width:35px;height:35px;vertical-align:middle;" src="images/drawer-close.png" /> ';
                        //var json = this.options.store;
                        //for (var g = 0; g < json.Global.Divisions.Items[divisionIndex].Groups.Items.length; g++) {
                        // expand
                        //debugger;
                        var elementId2 = 'trDivisionGroupsGroupLegalEntitiesLocations_' + divisionIndex + '_' + groupIndex + '_' + entityIndex;
                        //try {
                        document.getElementById(elementId2).style.display = 'table-row';
                        //} catch (e) { }
                        // change the icon
                        //document.getElementById('spanDivisionTreeExpandCollapseButton_' + divisionIndex).innerHTML = '⚊ '; // This is the division root node
                        //}
                    } else {
                        // Collapse all of the divisions.
                        document.getElementById(elementId).innerHTML = '<img title="collapse" style="cursor:pointer;width:35px;height:35px;vertical-align:middle;" src="images/drawer-open.png" /> '; // This is the root global node.
                        //var json = this.options.store;
                        //for (var g = 0; g < json.Global.Divisions.Items[divisionIndex].Groups.Items.length; g++) {
                        // collapse
                        //debugger;
                        var elementId2 = 'trDivisionGroupsGroupLegalEntitiesLocations_' + divisionIndex + '_' + groupIndex + '_' + entityIndex;
                        //try {
                        document.getElementById(elementId2).style.display = 'none';
                        //} catch (e) { }
                        // change the icon
                        //document.getElementById('spanDivisionTreeExpandCollapseButton_' + divisionIndex).innerHTML = '✚ '; // This is the division root node
                        //}
                    }



                } else if (groupIndex || groupIndex > -1) {
                    //this.options.store.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Style = 'display:none;'; // Collapse!
                    //this._create();
                    //debugger;
                    if (instructions == 'legalentitiesnode') {
                        if (document.getElementById(elementId).innerHTML.indexOf('drawer-open.png') > -1) {
                            // Expand all of the divisions.
                            document.getElementById(elementId).innerHTML = '<img title="collapse" style="cursor:pointer;width:35px;height:35px;vertical-align:middle;" src="images/drawer-close.png" /> ';
                            var json = this.options.store;
                            for (var e = 0; e < json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items.length; e++) {
                                // expand
                                //var elementId2 = 'trDivisionGroupsGroupLegalEntities_' + divisionIndex + '_' + groupIndex + '_' + e;
                                //document.getElementById(elementId2).style.display = 'table-row';

                                var elementId3 = 'trDivisionGroupsGroupLegalEntitiesLocations_' + divisionIndex + '_' + groupIndex + '_' + e; // + '_' + l;
                                document.getElementById(elementId3).style.display = 'table-row';

                            }
                        } else {
                            // Collapse all of the divisions.
                            document.getElementById(elementId).innerHTML = '<img title="collapse" style="cursor:pointer;width:35px;height:35px;vertical-align:middle;" src="images/drawer-open.png" /> '; // This is the root global node.
                            var json = this.options.store;
                            for (var e = 0; e < json.Global.Divisions.Items[divisionIndex].Groups.Items[groupIndex].LegalEntities.Items.length; e++) {
                                // expand
                                //var elementId2 = 'trDivisionGroupsGroupLegalEntities_' + divisionIndex + '_' + groupIndex + '_' + e;
                                //document.getElementById(elementId2).style.display = 'none';

                                var elementId3 = 'trDivisionGroupsGroupLegalEntitiesLocations_' + divisionIndex + '_' + groupIndex + '_' + e; // + '_' + l;
                                document.getElementById(elementId3).style.display = 'none';

                            }
                        }

                    } else {
                        if (document.getElementById(elementId).innerHTML.indexOf('drawer-open.png') > -1) {
                            // Expand all of the divisions.
                            document.getElementById(elementId).innerHTML = '<img title="collapse" style="cursor:pointer;width:35px;height:35px;vertical-align:middle;" src="images/drawer-close.png" /> ';
                            //var json = this.options.store;
                            //for (var g = 0; g < json.Global.Divisions.Items[divisionIndex].Groups.Items.length; g++) {
                            // expand
                            var elementId2 = 'trDivisionGroupsGroup_' + divisionIndex + '_' + groupIndex;
                            try {
                                document.getElementById(elementId2).style.display = 'table-row';
                            } catch (e) { }
                            // change the icon
                            //document.getElementById('spanDivisionTreeExpandCollapseButton_' + divisionIndex).innerHTML = '⚊ '; // This is the division root node
                            //}
                        } else {
                            // Collapse all of the divisions.
                            document.getElementById(elementId).innerHTML = '<img title="collapse" style="cursor:pointer;width:35px;height:35px;vertical-align:middle;" src="images/drawer-open.png" /> '; // This is the root global node.
                            //var json = this.options.store;
                            //for (var g = 0; g < json.Global.Divisions.Items[divisionIndex].Groups.Items.length; g++) {
                            // collapse
                            var elementId2 = 'trDivisionGroupsGroup_' + divisionIndex + '_' + groupIndex;
                            try {
                                document.getElementById(elementId2).style.display = 'none';
                            } catch (e) { }
                            // change the icon
                            //document.getElementById('spanDivisionTreeExpandCollapseButton_' + divisionIndex).innerHTML = '✚ '; // This is the division root node
                            //}
                        }
                    }






                } else if (divisionIndex || divisionIndex > -1) {
                    if (instructions == 'groupsnode') {
                        //debugger;
                        if (document.getElementById(elementId).innerHTML.indexOf('drawer-open.png') > -1) {
                            // Expand all of the divisions.
                            document.getElementById(elementId).innerHTML = '<img title="collapse" style="cursor:pointer;width:35px;height:35px;vertical-align:middle;" src="images/drawer-close.png" /> ';
                            var json = this.options.store;
                            for (var g = 0; g < json.Global.Divisions.Items[divisionIndex].Groups.Items.length; g++) {
                                // expand
                                var elementId2 = 'trDivisionGroupsGroup_' + divisionIndex + '_' + g;
                                document.getElementById(elementId2).style.display = 'table-row';
                                // change the icon
                                //document.getElementById('spanDivisionTreeExpandCollapseButton_' + divisionIndex).innerHTML = '⚊ '; // This is the division root node
                            }
                        } else {
                            // Collapse all of the divisions.
                            document.getElementById(elementId).innerHTML = '<img title="collapse" style="cursor:pointer;width:35px;height:35px;vertical-align:middle;" src="images/drawer-open.png" /> '; // This is the root global node.
                            var json = this.options.store;
                            for (var g = 0; g < json.Global.Divisions.Items[divisionIndex].Groups.Items.length; g++) {
                                // collapse
                                var elementId2 = 'trDivisionGroupsGroup_' + divisionIndex + '_' + g;
                                document.getElementById(elementId2).style.display = 'none';
                                // change the icon
                                //document.getElementById('spanDivisionTreeExpandCollapseButton_' + divisionIndex).innerHTML = '✚ '; // This is the division root node
                            }
                        }









                        //} else if (divisionIndex == 'root') {
                        //    if (document.getElementById(elementId).innerHTML.indexOf('drawer-open.png') > -1) {
                        //        // Expand all of the divisions.
                        //        document.getElementById(elementId).innerHTML = '<img title="collapse" style="cursor:pointer;width:35px;height:35px;vertical-align:middle;" src="images/drawer-close.png" /> ';
                        //        var json = this.options.store;
                        //        for (var d = 0; d < json.Global.Divisions.Items.length; d++) {
                        //            // expand
                        //            var elementId = 'trDivisionGroups_' + d;
                        //            document.getElementById(elementId).style.display = 'table-row';
                        //            // change the icon
                        //            document.getElementById('spanDivisionTreeExpandCollapseButton_' + d).innerHTML = '<img title="collapse" style="cursor:pointer;width:35px;height:35px;vertical-align:middle;" src="images/drawer-close.png" /> '; // This is the division root node
                        //        }
                        //    } else {
                        //        // Collapse all of the divisions.
                        //        document.getElementById(elementId).innerHTML = '<img title="collapse" style="cursor:pointer;width:35px;height:35px;vertical-align:middle;" src="images/drawer-open.png" /> '; // This is the root global node.
                        //        var json = this.options.store;
                        //        for (var d = 0; d < json.Global.Divisions.Items.length; d++) {
                        //            // collapse
                        //            var elementId = 'trDivisionGroups_' + d;
                        //            document.getElementById(elementId).style.display = 'none';
                        //            // change the icon
                        //            document.getElementById('spanDivisionTreeExpandCollapseButton_' + d).innerHTML = '<img title="collapse" style="cursor:pointer;width:35px;height:35px;vertical-align:middle;" src="images/drawer-open.png" /> '; // This is the division root node
                        //        }
                        //    }
                    } else {
                        //debugger;
                        if (document.getElementById(elementId).innerHTML.indexOf('drawer-open.png') > -1) {
                            // Expand all of the divisions.
                            document.getElementById(elementId).innerHTML = '<img title="collapse" style="cursor:pointer;width:35px;height:35px;vertical-align:middle;" src="images/drawer-close.png" /> ';
                            var json = this.options.store;
                            //for (var d = 0; d < json.Global.Divisions.Items.length; d++) {
                            // expand
                            var elementId = 'trDivisionGroups_' + divisionIndex;
                            document.getElementById(elementId).style.display = 'table-row';
                            // change the icon
                            document.getElementById('spanDivisionTreeExpandCollapseButton_' + divisionIndex).innerHTML = '<img title="collapse" style="cursor:pointer;width:35px;height:35px;vertical-align:middle;" src="images/drawer-close.png" /> '; // This is the division root node
                            //}
                        } else {
                            // Collapse all of the divisions.
                            document.getElementById(elementId).innerHTML = '<img title="collapse" style="cursor:pointer;width:35px;height:35px;vertical-align:middle;" src="images/drawer-open.png" /> '; // This is the root global node.
                            var json = this.options.store;
                            //for (var d = 0; d < json.Global.Divisions.Items.length; d++) {
                            // collapse
                            var elementId = 'trDivisionGroups_' + divisionIndex;
                            document.getElementById(elementId).style.display = 'none';
                            // change the icon
                            document.getElementById('spanDivisionTreeExpandCollapseButton_' + divisionIndex).innerHTML = '<img title="collapse" style="cursor:pointer;width:35px;height:35px;vertical-align:middle;" src="images/drawer-open.png" /> '; // This is the division root node
                            //}
                        }
                    }
                } else {
                    debugger;
                    alert('Error: Unexpected parameter in collapseOrExpandTree().');
                }
            }

        } catch (e) {
            console.log('Exception in collapseOrExpandTree(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in collapseOrExpandTree(): ' + e.message + ', ' + e.stack);
        }
    },

    cmdViewInvitation: function () {
        try {
            console.log('In bwSlideshowAdmin.js.cmdViewInvitation().');

            alert('This functionality is incomplete. Coming soon!');

        } catch (e) {
            console.log('Exception in bwSlideshowAdmin.js.cmdViewInvitation(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwSlideshowAdmin.js.cmdViewInvitation(): ' + e.message + ', ' + e.stack);
        }
    },


    viewInvitationDialog: function (invitationId, selectedSecurityRole) { // cmdViewInvitation
        try {
            console.log('In bwSlideshowAdmin.js.viewInvitationDialog().');

            //displayAlertDialog('This functionality is incomplete. Coming soon! cmdViewInvitation().');

            $("#ViewInvitationDialog").dialog({
                modal: true,
                resizable: false,
                closeText: "Cancel",
                closeOnEscape: true, // Hit the ESC key to hide! Yeah!
                title: 'Invitation',
                width: "800px",
                dialogClass: "no-close", // No close button in the upper right corner.
                hide: false, // This means when hiding just disappear with no effects.
                //buttons: {
                //"Copy to clipboard": {
                //    text: 'Copy to clipboard',
                //    id: 'btnCopyInvitationToClipboard',
                //    style: "'Segoe UI Light','Segoe UI','Segoe',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;color:black;",
                //    //disabled: 'true',
                //    click: function () {
                //        copyInvitationToClipboard();
                //    }
                //},
                //    "Close":  {
                //        text: 'Close',
                //        style: "'Segoe UI Light','Segoe UI','Segoe',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 30pt;color:black;",
                //        click: function () {
                //            $(this).dialog("close");
                //        }
                //    }
                //},,
                close: function () {

                    document.getElementById('tooltipUpdateSecurityRoleForInvitation').innerHTML = ''; // Clear the contents
                    document.getElementById('tooltipUpdateSecurityRoleForInvitation').style.display = 'none'; // Hide it.

                    $('#ViewInvitationDialog').dialog('destroy');

                },
                open: function (event, ui) {
                    try {
                        $('.ui-widget-overlay').bind('click', function () {
                            $("#ViewInvitationDialog").dialog('close');
                        });
                        var invitationUrl = globalUrlPrefix + globalUrl + '?invitation=' + invitationId;
                        document.getElementById('textareaViewInvitationDialogInvitationDetails').innerHTML = invitationUrl;
                        document.getElementById('textareaViewInvitationDialogInvitationDetails').blur();

                        var roles = document.getElementsByName('rbChangeUserRole');
                        for (var i = 0; i < roles.length; i++) {
                            if (roles[i].value == selectedSecurityRole) {
                                roles[i].checked = true;
                            } else {
                                roles[i].checked = false;
                            }
                        }

                    } catch (e) {
                        console.log('Exception in cmdViewInvitation.open(): ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in cmdViewInvitation.open(): ' + e.message + ', ' + e.stack);
                    }
                }
            });

            // Hide the title bar.
            $("#ViewInvitationDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").remove();

        } catch (e) {
            console.log('Exception in bwSlideshowAdmin.js.cmdViewInvitation(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwSlideshowAdmin.js.cmdViewInvitation(): ' + e.message + ', ' + e.stack);
        }
    },












    //renderSlideSets_original: function () {
    //    try {
    //        console.log('In renderSlideSets().');
    //        var thiz = this;

    //        var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
    //        var externallyFacingUrlForAttachmentsSourceFolder = $('.bwAuthentication').bwAuthentication('option', 'externallyFacingUrlForAttachmentsSourceFolder');

    //        this.element.html('');

    //        var filesandfolders = this.options.filesAndFolders;

    //        var html = '';

    //        html += '           <span style="font-size:20pt;font-weight:normal;">Externally Shared Files (unauthenticated)</span>';
    //        html += '<br />';
    //        html += '<span style="font-size:small;font-style:italic;">Files that have been externally shared so that they can be shared using links (without logging in).</span>';

    //        html += '<br />';
    //        html += '<br />';
    //        html += '<img src="images/drawer-close.png" style="cursor:pointer;width:48px;height:47px;" />';
    //        html += '&nbsp;&nbsp;';
    //        html += '<img src="images/folder.png" style="cursor:pointer;width:60px;" />';
    //        html += '&nbsp;&nbsp;' + externallyFacingUrlForAttachmentsSourceFolder;

    //        html += '<br />';
    //        html += '<br />';
    //        if (filesandfolders.length == 0) {
    //            html += 'There are no external files.';
    //        } else {
    //            // There are external folders and/or files.
    //            var folders = [];
    //            var files = [];
    //            for (var i = 0; i < filesandfolders.length; i++) {
    //                if (filesandfolders[i].smbType == 'FOLDER') {
    //                    folders.push(filesandfolders[i]);
    //                } else if (filesandfolders[i].smbType == 'FILE') {
    //                    files.push(filesandfolders[i]);
    //                } else {
    //                    // Unexpected smbType value.


    //                }
    //            }

    //            //var folders2 = $.unique(folders.sort(function (a, b) { return a.toLowerCase().localeCompare(b.toLowerCase()) })).sort(function (a, b) { return a.toLowerCase().localeCompare(b.toLowerCase()) });
    //            //var files2 = $.unique(files.sort(function (a, b) { return a.toLowerCase().localeCompare(b.toLowerCase()) })).sort(function (a, b) { return a.toLowerCase().localeCompare(b.toLowerCase()) });

    //            var folders2 = $.unique(folders.sort(function (a, b) { return a.folder.toLowerCase().localeCompare(b.folder.toLowerCase()) })).sort(function (a, b) { return a.folder.toLowerCase().localeCompare(b.folder.toLowerCase()) });
    //            var files2 = $.unique(files.sort(function (a, b) { return a.file.toLowerCase().localeCompare(b.file.toLowerCase()) })).sort(function (a, b) { return a.file.toLowerCase().localeCompare(b.file.toLowerCase()) });

    //            for (var i = 0; i < folders2.length; i++) {
    //                html += '<div id="divBwExternallySharedFiles_' + thiz.options.elementIdSuffix + '_folder" style="padding-left:50px;" class="context-menu-externallysharedfiles">';
    //                html += '   <img src="images/drawer-open.png" style="cursor:pointer;" />';
    //                html += '   &nbsp;&nbsp;';
    //                html += '   <img src="images/folder.png" style="cursor:pointer;width:40px;" />';
    //                html += '   &nbsp;&nbsp;';
    //                html += '<span class="spanBwExternallySharedFiles_folder">' + folders2[i].folder + ' (' + folders2[i].files.length + ')</span>';
    //                html += '</div>';
    //                //html += '<br />';
    //            }
    //            html += '<br />';
    //            //html += '<br />';
    //            for (var i = 0; i < files2.length; i++) {
    //                html += '<div id="divBwExternallySharedFiles_' + thiz.options.elementIdSuffix + '_file" style="padding-left:120px;" class="context-menu-externallysharedfiles">';
    //                html += '<span class="spanBwExternallySharedFiles_file"><a href="' + files2[i].file + '">' + files2[i].file + '</a></span>';
    //                html += '</div>';
    //                html += '<br />';
    //            }
    //        }

    //        html += '</div>';
    //        html += '<br />';
    //        html += '                </span>';
    //        html += '            </div>';
    //        html += '        </div>';
    //        html += '    </div>';
    //        html += '</div>';
    //        //

    //        html += '                </span>';
    //        html += '            </div>';

    //        html += '        </div>';
    //        html += '    </div>';
    //        html += '</div>';

    //        html += '    </td>';
    //        html += '  </tr>';
    //        html += '</table>';

    //        html += '</div>';

    //        // Render the html. THIS WAY IS PREFERABLE COME BACK AND FIX SOMETIME
    //        thiz.element.html(html);

    //        // This is our right-click context menu. MIT license and code at: https://swisnl.github.io/jQuery-contextMenu/demo/trigger-custom.html
    //        $.contextMenu({
    //            selector: '.context-menu-externallysharedfiles',
    //            callback: function (key, options) {
    //                try {
    //                    if (key == 'deletefolder') {
    //                        var thisDiv = $(this).closest('div')[0]; //.id
    //                        thisDiv.style.backgroundColor = 'aliceblue';

    //                        if (thisDiv.id.indexOf('_folder') > -1) {
    //                            var folderName = $(thisDiv).find('.spanBwExternallySharedFiles_folder').text().trim();
    //                            alert('Are you certain you wish to delete the contents of folder "' + folderName + '"?');
    //                            alert('This functionality is incomplete. Coming soon!');
    //                        } else if (thisDiv.id.indexOf('_file') > -1) {
    //                            var fileName = $(thisDiv).find('.spanBwExternallySharedFiles_file').text().trim();
    //                            alert('Are you certain you wish to delete the contents of file "' + fileName + '"?');
    //                            alert('This functionality is incomplete. Coming soon!');
    //                        } else {
    //                            alert('Unexpected value for id:2: ' + thisDiv.id);
    //                        }

    //                    }
    //                } catch (e) {
    //                    displayAlertDialog('Exception in xx(): ' + e.message + ', ' + e.stack);
    //                }
    //            },
    //            items: {
    //                "deletefolder": {
    //                    name: "Delete", icon: "edit"
    //                }//,
    //                //"editorganizationjson": {
    //                //    name: "Edit Organization JSON", icon: "edit"
    //                //},
    //            }
    //        });

    //    } catch (e) {
    //        console.log('Exception in bwSlideshowAdmin.js.renderSlideSets(): ' + e.message + ', ' + e.stack);
    //        displayAlertDialog('Exception in bwSlideshowAdmin.js.renderSlideSets(): ' + e.message + ', ' + e.stack);
    //    }
    //},
    cmdDeleteInvitation: function (invitationId) {
        try {
            console.log('In bwInvitationAdmin.js.cmdDeleteInvitation(). invitationId: ' + invitationId);
            var thiz = this;

            invitation = {
                bwInvitationId: invitationId
            };
            var operationUri = this.options.operationUriPrefix + "_bw/bwinvitationsunclaimed/deletethisinvitation";
            $.ajax({
                url: operationUri,
                type: "POST",
                data: invitation,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (data) {
                    if (data.n == 1 && data.ok == 1) {
                        // Re-render the screen.
                        //populateStartPageItem('divParticipants', 'Reports', '');
                        //renderConfigurationParticipants();
                        thiz.loadFoldersAndFiles();
                    } else {
                        // Something went wrong!
                        displayAlertDialog('There was a problem deleting this invitation. Error: ' + JSON.stringify(data));
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    displayAlertDialog('Error in cmdDeleteInvitation()xcx1: ' + errorMessage);
                }
            });
        } catch (e) {
            console.log('Exception in bwInvitationAdmin.js.cmdDeleteInvitation(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwInvitationAdmin.js.cmdDeleteInvitation(): ' + e.message + ', ' + e.stack);
        }
    },

    updateInvitationSecurityRole_Mouseout: function (element) {
        try {
            console.log('In bwSlideshowAdmin.js.updateInvitationSecurityRole_Mouseout().');

            //var tooltip = document.getElementById('tooltipUpdateSecurityRoleForInvitation');

            //tooltip.innerHTML = '';
            //tooltip.style.backgroundColor = '#555';
            //tooltip.style.color = 'white';

        } catch (e) {
            console.log('Exception in bwSlideshowAdmin.js.updateInvitationSecurityRole_Mouseout(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwSlideshowAdmin.js.updateInvitationSecurityRole_Mouseout(): ' + e.message + ', ' + e.stack);
        }
    },
    selectInvitationUserRole_Onchange: function (element) {
        try {
            console.log('In bwSlideshowAdmin.js.selectInvitationUserRole_Onchange(). selectedValue: ' + element.value);
            var thiz = this;

            var tenantId = $('.bwAuthentication').bwAuthentication('option', 'tenantId');
            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            //var workflowAppTitle = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTitle');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
            var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');

            var bwInvitationId = document.getElementById('textareaViewInvitationDialogInvitationDetails').value.split('?invitation=')[1];

            var newRole;
            var roles = document.getElementsByName('rbChangeUserRole');
            for (var i = 0; i < roles.length; i++) {
                if (roles[i].checked) newRole = roles[i].value;
            }

            data = {
                bwTenantId: tenantId,
                bwWorkflowAppId: workflowAppId,
                bwInvitationId: bwInvitationId,
                bwInvitationParticipantRole: newRole,
                bwParticipantLogonType: 'budgetworkflow.com',
                ModifiedById: participantId,
                ModifiedByFriendlyName: participantFriendlyName,
                ModifiedByEmail: participantEmail
            };
            var operationUri = webserviceurl + "/bwparticipant/updateinvitationsecurityrole";
            $.ajax({
                url: operationUri,
                type: "POST",
                data: data,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (data) {

                    var tooltip = document.getElementById('tooltipUpdateSecurityRoleForInvitation');

                    var roleFriendlyName = '';
                    if (newRole == 'customer') {
                        roleFriendlyName = 'Customer';
                    } else if (newRole == 'participant') {
                        roleFriendlyName = 'Participant';
                    } else if (newRole == 'vendor') {
                        roleFriendlyName = 'Vendor or Partner';
                    } else if (newRole == 'archiveviewer') {
                        roleFriendlyName = 'Archive Viewer';
                    } else if (newRole == 'reportviewer') {
                        roleFriendlyName = 'Report Viewer';
                    } else if (newRole == 'configurationmanager') {
                        roleFriendlyName = 'Configuration Manager';
                    }

                    tooltip.innerHTML = 'The security role for this invitation has been updated to ' + roleFriendlyName + '.'; //<br /><br />The invitation has been copied and is ready to paste.';
                    tooltip.style.backgroundColor = 'seagreen';
                    tooltip.style.color = 'white';
                    tooltip.style.padding = '5px 5px 5px 5px';
                    tooltip.style.display = 'inline'; // Show it.

                    thiz.copyToClipboard_Invitation(tooltip);
                    //thiz.copyToClipboardMouseout();

                    // This line has been commented out, but if we create an invitation, we do want it to show up on the screen in the inventory widget.. more work needed here maybe.?
                    // renderConfigurationParticipants(); // redraw the perticipants editor.

                },
                error: function (data, errorCode, errorMessage) {
                    console.log('Error in selectInvitationUserRole_Onchange(): ' + errorMessage + ' ' + JSON.stringify(data));
                    displayAlertDialog('Error in selectInvitationUserRole_Onchange(): ' + errorMessage + ' ' + JSON.stringify(data));
                }
            });

        } catch (e) {
            console.log('Exception in bwSlideshowAdmin.js.selectInvitationUserRole_Onchange(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwSlideshowAdmin.js.selectInvitationUserRole_Onchange(): ' + e.message + ', ' + e.stack);
        }
    },

    // Begin: Copy invitation link to clipboard.
    copyToClipboard_Invitation: function (element) {
        try {
            console.log('In bwSlideshowAdmin.js.copyToClipboard_Invitation().');

            var copyElement = document.getElementById('textareaViewInvitationDialogInvitationDetails');
            var copyText = copyElement.value;

            console.log('In copyToClipboard().2');
            if (!copyText) {
                alert('No text to copy.');
            } else {
                console.log('In copyToClipboard().3');

                var browserString = navigator.userAgent;
                if ((browserString.indexOf("Macintosh") > -1) && (browserString.indexOf("Safari") > -1)) { // Macintosh Safari 

                    // Safari and Android WebView do not support navigator.permissions.
                    console.log('In copyToClipboard().3.5 browserString: ' + browserString);
                    displayAlertDialog('In copyToClipboard().3.5 browserString: ' + browserString);

                } else {
                    console.log('In copyToClipboard().4 browserString: ' + browserString);
                    var permissions = navigator.permissions;
                    permissions.query({ name: 'clipboard-write' }).then(function (result) {
                        try {

                            console.log('result.state: ' + result.state);

                            if (result.state === 'granted') {
                                console.log('In copyToClipboard().5');
                                //const type = 'text/plain';
                                //const blob = new Blob([message], { type });
                                //let data = [new ClipboardItem({ [type]: blob })];
                                //navigator.clipboard.write(data).then(function() {
                                //    $.growl.notice({ message: ResourceService.getKey("CopyToClipboardSuccess"), location: "tc", title: "" });
                                //}, function() {
                                //    $.growl.error({ message: ResourceService.getKey("CopyToClipboardError"), location: "tc", title: "" });
                                //});
                                var data = [new ClipboardItem({ "text/plain": new Blob([copyText], { type: "text/plain" }) })];
                                navigator.clipboard.write(data).then(function () {
                                    try {

                                        console.log('In copyToClipboard().6');
                                        element.innerHTML += '<br /><br />The invitation has been copied and is ready to paste.';

                                    } catch (e) {
                                        console.log('Exception3: ' + e.message + ', ' + e.stack);
                                    }
                                }, function (e) {
                                    console.log("Unable to write to clipboard. :-(");

                                    //element.innerHTML += '<br /><br />Unable to write to clipboard: ' + JSON.stringify(e);

                                }).catch(function (e) {

                                    console.log('Exception2. If we get here, it is likely that we need to use the document.execCommand("copy") function.... Does it work? needs testing.: ' + e.message + ', ' + e.stack);

                                    // If we get here, it is likely that we need to use the document.execCommand("copy") function....
                                    copyElement.select();
                                    copyElement.setSelectionRange(0, 99999);
                                    document.execCommand('copy');
                                    console.log('Copied: ' + copyElement.value);

                                });

                                console.log('In copyToClipboard().7');
                            } else {

                                console.log('NO PERMISSIONS xcx326');

                            }
                        } catch (e) {
                            console.log('Exception1: ' + e.message + ', ' + e.stack);
                        }
                    }).catch(function (e) {
                        console.log('Exception2.5 xcx99385: ' + e.message + ', ' + e.stack);
                    });

                }

            }

            //but Clipboard API and events are still working draft, I recommend using an alternatives like clipboard.js
            // iOS Safari: https://stackoverflow.com/questions/34045777/copy-to-clipboard-using-javascript-in-ios

        } catch (e) {
            console.log('Exception in bwSlideshowAdmin.js.copyToClipboard_Invitation(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwSlideshowAdmin.js.copyToClipboard_Invitation(): ' + e.message + ', ' + e.stack);
        }
        //if (elementId) {
        //    var copyText = document.getElementById(elementId);
        //} else {
        //    var copyText = document.getElementById('textareaViewInvitationDialogInvitationDetails');
        //}
        //copyText.select();
        //copyText.setSelectionRange(0, 99999);
        //document.execCommand('copy');

        //if (tooltipElementId) {
        //    var tooltip = document.getElementById(tooltipElementId);
        //} else {
        //    var tooltip = document.getElementById('myTooltip');
        //}
        ////tooltip.innerHTML = "Copied: " + copyText.value;
        //tooltip.innerHTML = 'Copied successfully. Now go and paste it! :)';
        //tooltip.style.backgroundColor = 'seagreen';
        //tooltip.style.color = 'white';
    },

    copyToClipboardMouseout: function (elementId) {
        console.log('In bwSlideshowAdmin.js.copyToClipboardMouseoutx');
        if (elementId) {
            var tooltip = document.getElementById(elementId);
        } else {
            var tooltip = document.getElementById('myTooltip');
        }
        tooltip.innerHTML = 'Copy to clipboard';
        tooltip.style.backgroundColor = '#555';
        tooltip.style.color = 'white';
    }
    // End: Copy invitation link to clipboard.

});