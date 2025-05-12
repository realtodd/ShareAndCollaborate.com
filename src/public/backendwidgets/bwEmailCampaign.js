$.widget("bw.bwEmailCampaign", {
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
        This is the bwEmailCampaign.js jQuery Widget. 
        ===========================================================

            [more to follow]
                          
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

            [put your stuff here]

        ===========================================================
       
        */

        elementIdSuffix: null, // This is a custom guid which gets appended to element id's, making sure this widget keeps to itself.

        CurrentCampaigns: {
            CampaignSets: null,
            DraftCampaignSets: null
        },



        //tmp: {"folderName":"acdb01bf-12ea-44f1-ba66-86054329fb12","files":[{"fileName":"93de58f0-c09c-4730-b2b8-f82a706ec83d.png","sortOrder":0,"headerText":"Step 1: Hatch the idea.","descriptionText":""},{"fileName":"8b0a2bbc-e7d3-4ac9-8c71-72c0be31966d.jpg","sortOrder":1,"headerText":"Step 2: Build it out, do all the heavy lifting.","descriptionText":""},{"fileName":"58aa8cf7-b268-4199-90dc-1487568c3961.jfif","sortOrder":2,"headerText":"Step 3: Get customers, rocket into space.","descriptionText":""},{"fileName":"31278f73-684f-43e1-ba07-0fc86471d29a.png","sortOrder":3,"headerText":"Step 4: Success! Optimize any remaining engineering and mass produce it.","descriptionText":""}]},





        bwSoundIndex: null, // This helps us randomize the sounds when random is selected. It helps prevent the same sound being played twice in a row.

        operationUriPrefix: null,

        autoSenseDeviceType: false // Automatic UI based on device type. Alpha version so far.
    },
    _create: function () {
        this.element.addClass("bwEmailCampaign");
        var thiz = this; // Need this because of the asynchronous operations below.
        try {
            if (this.options.operationUriPrefix == null) {
                // This formulates the operationUri, which is used throughout.
                if (window.location.href.indexOf('https://') > -1) {
                    var url1 = window.location.href.split('https://')[1];
                    var url2 = url1.split('/')[0];
                    this.options.operationUriPrefix = 'https://' + url2 + '/';
                } else {
                    var url1 = window.location.href.split('http://')[1];
                    var url2 = url1.split('/')[0];
                    this.options.operationUriPrefix = 'http://' + url2 + '/';
                }
            }

            var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
            this.options.elementIdSuffix = guid;

            // 
            // Load this object first so we don't have to keep making web service calls.
            //
            if (this.options.CurrentCampaigns.DraftCampaignSets != null) {

                this.renderCampaigns();

            } else {

                this.loadEmailCampaignSets();

            }

            console.log('In bwEmailCampaign._create(). The widget has been initialized.');

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwEmailCampaign</span>';
            html += '<br />';
            html += '<span style="">Exception in bwEmailCampaign.Create(): ' + e.message + ', ' + e.stack + '</span>';
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
            .removeClass("bwEmailCampaign")
            .text("");
    },
    getData: function () {
        try {
            console.log('In bwEmailCampaign.getData().');
            ////debugger;
            ////Come back and build out the JSON for this!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 7-27-2020
            //var value = $(this.element).find('#txtProjectManagerName')[0].value;
            return 'xcx12432341253';
        } catch (e) {
            console.log('Exception in bwEmailCampaign.getData(): ' + e.message + ', ' + e.stack);
            alert('Exception in bwEmailCampaign.getData(): ' + e.message + ', ' + e.stack);
        }
    },
    renderEmailCampaignUI: function () {
        try {
            console.log('In renderEmailCampaignUI().');

            var html = '';

            html += 'In bwEmailCampaign.js.renderEmailCampaignUI().';
            html += '<ul>';
            html += '<li>Be able to create many email templates, see them in order, and be able to reorder. Similar to the homepage slideshow.</li>';
            html += '<li>Easily changeable</li>';
            html += '<li>Send email in bulk, but to 1 user at a time</li>';
            html += '</ul>';
            html += '';
            html += '';

            this.element.html(html);

        } catch (e) {
            console.log('Exception in renderEmailCampaignUI: ' + e.message + ', ' + e.stack);
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwEmailCampaign</span>';
            html += '<br />';
            html += '<span style="">Exception in bwEmailCampaign.renderEmailCampaignUI(): ' + e.message + ', ' + e.stack + '</span>';
            thiz.element.html(html);
        }
    },
    renderCampaigns: function () {
        try {
            console.log('In renderCampaigns().');
            var thiz = this;

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var externallyFacingUrlForAttachmentsSourceFolder = $('.bwAuthentication').bwAuthentication('option', 'externallyFacingUrlForAttachmentsSourceFolder');
            var externallyFacingUrlForAttachments = $('.bwAuthentication').bwAuthentication('option', 'externallyFacingUrlForAttachments');

            this.element.html('');

            if (!(this.options.CurrentCampaigns && this.options.CurrentCampaigns.DraftCampaignSets)) {

                // There are no folders and/or files. 
                var html = '';

                html += '<table>';
                html += '   <tr>';
                html += '       <td colspan="2" class="bwChartCalculatorLightCurrencyTableCell" style="width:100%;">';
                html += '           <span style="font-size:20pt;font-weight:normal;">Email Campaigns</span>';
                html += '           <br />';
                //html += '           <span style="font-size:small;font-style:italic;">Images that have been uploaded so that they can be displayed in the homepage slideshow (without logging in).xcx1</span>';
                html += '           <br />';
                html += '           <br />';
                html += '           There are no campaigns.';
                html += '           <br />';
                html += '           <br />';
                html += '       </td>';
                html += '   </tr>';
                html += '</table>';

                this.element.html(html);

            } else {

                //var filesandfolders = this.options.CurrentCampaigns.DraftCampaignSets.FilesAndFolders;

                //alert('filesandfolders: ' + JSON.stringify(filesandfolders));
                //// There are external folders and/or files.
                //var folders = [];
                //var files = [];
                //for (var i = 0; i < filesandfolders.length; i++) {
                //    if (filesandfolders[i].smbType == 'FOLDER') {
                //        folders.push(filesandfolders[i]);
                //    } else if (filesandfolders[i].smbType == 'FILE') {
                //        files.push(filesandfolders[i]);
                //    } else {
                //        // Unexpected smbType value.


                //    }
                //}

                //var folders2 = $.unique(folders.sort(function (a, b) { return a.folder.toLowerCase().localeCompare(b.folder.toLowerCase()) })).sort(function (a, b) { return a.folder.toLowerCase().localeCompare(b.folder.toLowerCase()) });
                //var files2 = $.unique(files.sort(function (a, b) { return a.file.toLowerCase().localeCompare(b.file.toLowerCase()) })).sort(function (a, b) { return a.file.toLowerCase().localeCompare(b.file.toLowerCase()) });

                var html = '';

                // Rename from "AttachmentsDialog1" to "bwEmailCampaign_SlidePropertiesDialog".
                html += '<div style="display:none;" id="bwEmailCampaign_SlidePropertiesDialog">';
                html += '<table style="width:100%;">';
                html += '    <tr>';
                html += '        <td style="width:90%;">';
                html += '            <span id="spanAttachmentsDialog1Title" style="color: #3f3f3f;font-size:30pt;font-weight:bold;">xcx34348</span>';
                html += '        </td>';
                html += '        <!--<td style="width:9%;"></td>';
                html += '    <td style="width:1%;cursor:pointer;vertical-align:top;">';
                html += '         <span class="dialogXButton" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:60pt;font-weight:bold;" onclick="$(\'#bwEmailCampaign_SlidePropertiesDialog\').dialog(\'close\');">X</span>';
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
                html += '        <td><textarea id="bwEmailCampaign_SlidePropertiesDialog_File_HeaderText" style="overflow:hidden;font-size:12pt;" rows="4" cols="55"></textarea></td>'; // change txtAttachmentsDialog1FileDescription to bwEmailCampaign_SlidePropertiesDialog_File_HeaderText
                html += '     </tr>';
                html += '    <tr>';
                html += '        <td style="vertical-align:top;"><span style="font-style:italic;font-size:18pt;color:gray;">Description text:</span></td>';
                html += '        <td><textarea id="bwEmailCampaign_SlidePropertiesDialog_File_DescriptionText" style="overflow:hidden;font-size:12pt;" rows="4" cols="55"></textarea></td>';
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
                html += '    <div id="xxxx" class="divDialogButton" onclick="$(\'#bwEmailCampaign_SlidePropertiesDialog\').dialog(\'close\');">';
                html += '        Close';
                html += '   </div>';
                html += '    <br /><br />';
                html += '</div>';




                html += '<table>';
                html += '   <tr>';
                html += '       <td colspan="2" class="bwChartCalculatorLightCurrencyTableCell" style="width:100%;">';
                html += '           <span style="font-size:20pt;font-weight:normal;">Email Campaigns</span>';
                html += '           <br />';
                html += '           <span style="font-size:small;font-style:italic;">Images that have been uploaded so that they can be displayed in the homepage slideshow (without logging in - unauthenticated).</span>';
                html += '           <br />';
                html += '           <br />';


                //html += '<span style="cursor:pointer;font-size:25pt;" onclick="$(\'.bwEmailCampaign:first\').bwEmailCampaign(\'publishSlideshow\');">[Publish Slideshow]</span>';

                html += '<table><tbody><tr>  <td>  </td>  <td style="text-align:right;">    <span id="spanThereAreChangesToPublishText" style="font-style:italic;color:tomato;">You have changes that won\'t be available until you publish: </span>  </td>  <td>    <span id="spanThereAreChangesToPublishButton"><input style="padding:5px 10px 5px 10px;width:100px;" id="btnSaveWorkflowConfigurationAndActivate" type="button" value="Publish" onclick="$(\'.bwEmailCampaign\').bwEmailCampaign(\'publishSlideshow\');">&nbsp;<input style="padding:5px 10px 5px 10px;" id="btnCancelChangesInDraftWorkflowConfiguration" type="button" value="Cancel Changes" onclick="$(\'.bwEmailCampaign\').bwEmailCampaign(\'cancelChangesInDraftSlideshow\');"></span>  </td></tr></tbody></table>';






                //if (folders2.length > 0) {
                //    html += '           There are no slideshow files, or the configuration has not been completed.';
                //    html += '           <br />';
                //    html += '           <br />';
                //}
                html += '       </td>';
                html += '   </tr>';

                //for (var i = 0; i < folders2.length; i++) {
                for (var i = 0; i < this.options.CurrentCampaigns.DraftCampaignSets.length; i++) { // var filesandfolders = this.options.CurrentCampaigns.DraftCampaignSets.FilesAndFolders;
                    html += '   <tr>';
                    html += '       <td colspan="2" class="bwChartCalculatorLightCurrencyTableCell" style="width:100%;">';

                    html += '           <br />';
                    html += '           <div id="bwEmailCampaign_bwSlideSet_' + i + '"></div>';
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
                html += '           <button onclick="$(\'.bwEmailCampaign\').bwEmailCampaign(\'createNewCampaignSet\');" class="BwButton300ForRequestForm" title="Create a new campaign set.">';
                html += '               Create new campaign set';
                html += '           </button>';
                html += '           <br />';
                html += '           <br />';
                //html += '           <div id="bwEmailCampaign_bwSlideSet12"></div>';
                html += '       </td>';
                html += '   </tr>';
                html += '</table>';














                html += '<table>';
                html += '   <tr>';
                html += '       <td colspan="2" class="bwChartCalculatorLightCurrencyTableCell" style="width:100%;">';

                html += '<span style="font-size:20pt;font-weight:normal;">Email Campaigns</span>';
                html += '<br />';
                html += '           <span style="font-size:small;font-style:italic;">Images that have been uploaded so that they can be displayed in the homepage slideshow (without logging in).xcx3</span>';
                html += '<br />';
                html += '<br />';
                html += '           There are no campaigns, or the configuration has not been completed.';
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
                html += '                                   <span id="spanOrgX_root" class="orgTreeNode" style="cursor:pointer;white-space:nowrap;" onclick="$(\'.bwEmailCampaign\').bwEmailCampaign(\'collapseOrExpandTree\', \'\', \'spanOrgX_root\', \'root\');" onmouseover="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderOrgRoleConnectorsToWorkflowxx\', true, \'root\');" onmouseout="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderOrgRoleConnectorsToWorkflowResetxx\', \'' + 'spanOrgX_root\', \'root\');">';

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
                //html += '                                   <span id="spanDivisionsTreeExpandCollapseButton" style="cursor:pointer;" onclick="$(\'.bwEmailCampaign\').bwEmailCampaign(\'collapseOrExpandTree\', \'\', \'spanDivisionsTreeExpandCollapseButton\', \'root\');">';
                //html += '                                       <img title="collapse" style="cursor:pointer;width:35px;height:35px;vertical-align:middle;" src="images/drawer-close.png"> ';
                //html += '                                   </span>';

                //var d = 0;

                ////html += '                               <span id="spanOrgX_' + d + '_' + 'GroupsNode' + '" class="orgTreeNode" style="cursor:pointer;font-weight:bold;" title="Collapse..." onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'collapseTree\', \'\', \'' + '' + '\');" onmouseout="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderOrgRoleConnectorsToWorkflowResetxx\', \'' + 'spanOrgX_' + d + '_' + 'GroupsNode' + '\', \'' + '' + '\', \'' + 'GroupsNode' + '\');" onmouseover="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderOrgRoleConnectorsToWorkflowxx\', true, \'' + '' + '\', \'' + 'GroupsNode' + '\');">';
                ////html += '                               Divisions &nbsp;&nbsp; ';
                ////html += '                               </span>';

                //html += '                               </td>';
                //html += '                           </tr>';

                //for (var i = 0; i < folders2.length; i++) { 
                for (var i = 0; i < this.options.CurrentCampaigns.DraftCampaignSets.length; i++) { // this.options.CurrentCampaigns.DraftCampaignSets
                    html += '           <tr class="trSubfolder">';
                    html += '               <td id="rootDivisionCell" style="padding-left:40px;white-space:nowrap;">';

                    html += '<span id="spanDivisionTreeExpandCollapseButton_' + i + '" style="cursor:pointer;" onclick="$(\'.bwEmailCampaign\').bwEmailCampaign(\'collapseOrExpandTree\', \'\', \'spanDivisionTreeExpandCollapseButton_' + i + '\', \'' + i + '\');">';
                    html += '   <img title="collapse" style="cursor:pointer;width:35px;height:35px;vertical-align:middle;" src="images/drawer-open.png">';
                    html += '</span>';

                    html += ' <span id="spanOrgX_' + i + '" class="orgTreeNode" style="cursor:pointer;white-space:nowrap;" onclick="window.scrollTo(0, 0);$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'displayOrgRoleEditorInACircle\', true, \'' + i + '\');" onmouseover="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderOrgRoleConnectorsToWorkflowxx\', true, \'' + i + '\');" onmouseout="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderOrgRoleConnectorsToWorkflowResetxx\', \'' + 'spanOrgX_' + i + '\', \'' + i + '\');">';
                    html += '   <img src="images/folder.png" style="cursor:pointer;width:40px;" />';
                    html += '   &nbsp;&nbsp;';
                    //html += '<span class="spanBwExternallySharedFiles_folder" bwexternallysharedfiles_folder="' + this.options.CurrentCampaigns.DraftCampaignSets[i].folderName + '" bwexternallysharedfiles_folder_filecount="' + this.options.CurrentCampaigns.DraftCampaignSets[i].files.length + '" >' + this.options.CurrentCampaigns.DraftCampaignSets[i].folderName + ' (' + this.options.CurrentCampaigns.DraftCampaignSets[i].files.length + ')</span>';

                    //html += '</span>';
                    html += '  <span id="spanWorkflowPeoplePicker_' + i + '"></span>';
                    html += '               </td>';
                    html += '           </tr>';

                    html += '           <tr class="trSubfolder-files" style="display:none;" id="trDivisionGroups_' + i + '">'; // This is the row that expans or collapses (display: none | table-row)
                    html += '               <td style="padding-left:40px;white-space:nowrap;">';
                    html += '                   <table style="padding-left:15px;">';
                    html += '                       <tr>';
                    html += '                           <td>';
                    html += '<div id="divBwExternallySharedFiles_' + thiz.options.elementIdSuffix + '_file" style="padding-left:120px;text-decoration:none;" class="context-menu-externallysharedfiles">';
                    //for (var j = 0; j < this.options.CurrentCampaigns.DraftCampaignSets[i].files.length; j++) {
                    //    html += '<span class="spanBwExternallySharedFiles_file" bwexternallysharedfiles_folder="' + this.options.CurrentCampaigns.DraftCampaignSets[i].folderName + '" bwexternallysharedfiles_folder_file="' + this.options.CurrentCampaigns.DraftCampaignSets[i].files[j] + '" >';
                    //    html += '   <a target="_blank" href="' + externallyFacingUrlForAttachments + '/' + this.options.CurrentCampaigns.DraftCampaignSets[i].folderName + '/' + this.options.CurrentCampaigns.DraftCampaignSets[i].files[j] + '">' + externallyFacingUrlForAttachments + '/' + this.options.CurrentCampaigns.DraftCampaignSets[i].folderName + '/' + this.options.CurrentCampaigns.DraftCampaignSets[i].files[j] + '</a>';
                    //    html += '</span>';
                    //    html += '</br></br>';
                    //}
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



                //
                // This is where we display the campaign sets. Previously this used the bwSlideSet.js widget. <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                //
                for (var i = 0; i < this.options.CurrentCampaigns.DraftCampaignSets.length; i++) {
                    //$('#bwEmailCampaign_bwSlideSet_' + i).bwCampaign({ elementIdSuffix: this.options.CurrentCampaigns.DraftCampaignSets[i].folderName, folderAndFiles: this.options.CurrentCampaigns.DraftCampaignSets[i] });
                    $('#bwEmailCampaign_bwSlideSet_' + i).bwCampaign({ elementIdSuffix: this.options.CurrentCampaigns.DraftCampaignSets[i].folderName, folderAndFiles: this.options.CurrentCampaigns.DraftCampaignSets[i] });
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
                            console.log('Exception in bwEmailCampaign.js.renderCampaigns.folder.contextMenu(): ' + e.message + ', ' + e.stack);
                            displayAlertDialog('Exception in bwEmailCampaign.js.renderCampaigns.folder.contextMenu(): ' + e.message + ', ' + e.stack);
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
                            console.log('Exception in bwEmailCampaign.js.renderCampaigns.file.contextMenu(): ' + e.message + ', ' + e.stack);
                            displayAlertDialog('Exception in bwEmailCampaign.js.renderCampaigns.file.contextMenu(): ' + e.message + ', ' + e.stack);
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
            console.log('Exception in bwEmailCampaign.js.renderCampaigns(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwEmailCampaign.js.renderCampaigns(): ' + e.message + ', ' + e.stack);
        }
    },
    loadEmailCampaignSets: function () {
        try {
            console.log('In bwEmailCampaign.js.loadEmailCampaignSets().');
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
                url: thiz.options.operationUriPrefix + "_bw/emailcampaignsets",
                type: 'GET',
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: function (results) {
                    try {
                        console.log('In bwEmailCampaign.js.loadEmailCampaignSets(). Got data from _files/slideshowslidesets(). ' + JSON.stringify(results));

                        if (results.status != 'SUCCESS') {

                            var msg = 'Error in bwEmailCampaign.js.loadEmailCampaignSets(). ' + results.status + ', ' + results.message;
                            console.log(msg);
                            displayAlertDialog(msg);

                        } else {

                            thiz.options.CurrentCampaigns.CampaignSets = JSON.parse(JSON.stringify(results.bwEmailCampaignSet));
                            thiz.options.CurrentCampaigns.DraftCampaignSets = JSON.parse(JSON.stringify(results.bwEmailCampaignSet));

                            //debugger;
                            //// Validate that our sortOrder is Ok everywhere.
                            //for (var i = 0; i < thiz.options.CurrentCampaigns.DraftCampaignSets.FilesAndFolders.length; i++) {
                            //    // Sort the files in this folder by sortOrder.
                            //    thiz.options.CurrentCampaigns.DraftCampaignSets.FilesAndFolders[i].files = thiz.options.CurrentCampaigns.DraftCampaignSets.FilesAndFolders[i].files.sort(function (a, b) {
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
                            //    for (var j = 0; j < thiz.options.CurrentCampaigns.DraftCampaignSets.FilesAndFolders[i].files.length; j++) {
                            //        thiz.options.CurrentCampaigns.DraftCampaignSets.FilesAndFolders[i].files[j].sortOrder = j;
                            //    }
                            //}

                            //thiz.checkIfWeHaveToDisplayThePublishChangesButton();

                            thiz.renderCampaigns(); // thiz.renderCampaignSets();
                        }

                    } catch (e) {
                        console.log('Exception in bwEmailCampaign.js.loadEmailCampaignSets():2: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwEmailCampaign.js.loadEmailCampaignSets():2: ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    console.log('Error in bwEmailCampaign.js.loadEmailCampaignSets.GetExternallySharedFiles():1: ' + errorCode + ', ' + errorMessage);
                    displayAlertDialog('Error in bwEmailCampaign.js.loadEmailCampaignSets.GetExternallySharedFiles():1: ' + errorCode + ', ' + errorMessage);
                }
            });

        } catch (e) {
            console.log('Exception in bwEmailCampaign.js.loadEmailCampaignSets(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwEmailCampaign.js.loadEmailCampaignSets(): ' + e.message + ', ' + e.stack);
        }
    },





    createNewCampaignSet: function () {
        try {
            console.log('In bwEmailCampaign.js.createNewCampaignSet().');
            var thiz = this;

            var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });

            var data = {
                CampaignSetGuid: guid
            };
            $.ajax({
                url: this.options.operationUriPrefix + "_bw/createnewcampaignsetset",
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: function (result) {
                    try {
                        console.log('In bwEmailCampaign.js.loadEmailCampaignSets(). Got data from _files/slideshowslidesets(). ' + JSON.stringify(result));
                        if (result.message != 'SUCCESS') {

                            displayAlertDialog(result.message);

                        } else {

                            displayAlertDialog_QuickNotice('The campaign set was created successfully.');
                            thiz.loadEmailCampaignSets(); // Reload.

                        }

                    } catch (e) {
                        console.log('Exception in bwEmailCampaign.js.createNewCampaignSet():2: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwEmailCampaign.js.createNewCampaignSet():2: ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    console.log('Error in bwEmailCampaign.js.createNewCampaignSet():1: ' + errorCode + ', ' + errorMessage);
                    displayAlertDialog('Error in bwEmailCampaign.js.createNewCampaignSet():1: ' + errorCode + ', ' + errorMessage);
                }
            });

        } catch (e) {
            console.log('Exception in bwEmailCampaign.js.createNewCampaignSet(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwEmailCampaign.js.createNewCampaignSet(): ' + e.message + ', ' + e.stack);
        }
    },

    publishSlideshow: function () {
        try {
            console.log('In bwEmailCampaign.js.publishSlideshow().');
            var thiz = this;

            // Take the draft version (DraftCampaignSets) and copy it into CampaignSets. This is how we publish.
            var draftJson = JSON.parse(JSON.stringify(this.options.CurrentCampaigns.DraftCampaignSets));
            this.options.CurrentCampaigns.CampaignSets = draftJson;

            var data = {
                CurrentCampaignsJson: this.options.CurrentCampaigns.CampaignSets
            };
            $.ajax({
                url: this.options.operationUriPrefix + "_files/publishslidesets",
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: function (result) {
                    try {
                        console.log('In bwEmailCampaign.js.publishSlideshow().');
                        if (result.message != 'SUCCESS') {

                            displayAlertDialog(result.message);

                        } else {

                            thiz.loadEmailCampaignSets();
                            //thiz.checkIfWeHaveToDisplayThePublishChangesButton();
                            //displayAlertDialog('Published successfully.');

                        }

                    } catch (e) {
                        console.log('Exception in bwEmailCampaign.js.publishSlideshow():2: ' + e.message + ', ' + e.stack);
                        displayAlertDialog('Exception in bwEmailCampaign.js.publishSlideshow():2: ' + e.message + ', ' + e.stack);
                    }
                },
                error: function (data, errorCode, errorMessage) {
                    console.log('Error in bwEmailCampaign.js.publishSlideshow():1: ' + errorCode + ', ' + errorMessage);
                    displayAlertDialog('Error in bwEmailCampaign.js.publishSlideshow():1: ' + errorCode + ', ' + errorMessage);
                }
            });

        } catch (e) {
            console.log('Exception in bwEmailCampaign.js.publishSlideshow(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwEmailCampaign.js.publishSlideshow(): ' + e.message + ', ' + e.stack);
        }
    },
    cancelChangesInDraftSlideshow: function () {
        try {
            console.log('In bwEmailCampaign.js.cancelChangesInDraftSlideshow().');

            var json = JSON.parse(JSON.stringify(this.options.CurrentCampaigns.CampaignSets));
            this.options.CurrentCampaigns.DraftCampaignSets = json;

            this.renderCampaignSets();

        } catch (e) {
            console.log('Exception in bwEmailCampaign.js.cancelChangesInDraftSlideshow(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwEmailCampaign.js.cancelChangesInDraftSlideshow(): ' + e.message + ', ' + e.stack);
        }
    },
    checkIfWeHaveToDisplayThePublishChangesButton: function () {
        try {
            console.log('In bwEmailCampaign.js.checkIfWeHaveToDisplayThePublishChangesButton().');
            debugger;
            var thereHaveBeenChangesToTheForm = false;
            var oldJsonString = JSON.stringify(this.options.CurrentCampaigns.CampaignSets);
            var newJsonString = JSON.stringify(this.options.CurrentCampaigns.DraftCampaignSets);
            if (oldJsonString != newJsonString) {
                thereHaveBeenChangesToTheForm = true;
            }
            if (thereHaveBeenChangesToTheForm == true) {
                // The user has made changes to the workflow.
                //document.getElementById('spanThereAreChangesToPublishText').innerHTML = 'You have changes that won\'t be available until you publish: ';
                $(this.element).find('#spanThereAreChangesToPublishText')[0].innerHTML = 'You have changes that won\'t be available until you publish: ';
                var html = '';
                html += '<input style="padding:5px 10px 5px 10px;width:100px;" id="btnSaveWorkflowConfigurationAndActivate" type="button" value="Publish" onclick="$(\'.bwEmailCampaign\').bwEmailCampaign(\'publishSlideshow\');" />';
                html += '&nbsp;<input style="padding:5px 10px 5px 10px;" id="btnCancelChangesInDraftWorkflowConfiguration" type="button" value="Cancel Changes" onclick="$(\'.bwEmailCampaign\').bwEmailCampaign(\'cancelChangesInDraftSlideshow\');" />';
                //document.getElementById('spanThereAreChangesToPublishButton').innerHTML = html;
                $(this.element).find('#spanThereAreChangesToPublishButton')[0].innerHTML = html;
            } else {
                // Do nothing because the user has made no changes to the workflow.
                $(this.element).find('#spanThereAreChangesToPublishText')[0].innerHTML = '';
                $(this.element).find('#spanThereAreChangesToPublishButton')[0].innerHTML = '';
            }
        } catch (e) {
            console.log('Exception in bwEmailCampaign.js.checkIfWeHaveToDisplayThePublishChangesButton(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwEmailCampaign.js.checkIfWeHaveToDisplayThePublishChangesButton(): ' + e.message + ', ' + e.stack);
        }
    },

});