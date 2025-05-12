$.widget("bw.bwExternallySharedFiles", {
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
        This is the bwExternallySharedFiles.js jQuery Widget. 
        ===========================================================

           [more to follow]
                           
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

           [put your stuff here]

        ===========================================================
        
       */

        elementIdSuffix: null, // This is a custom guid which gets appended to element id's, making sure this widget keeps to itself.

        filesAndFolders: null,
        //externallyFacingUrlForAttachmentsSourceFolder: null, 



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
        ajaxTimeout: 15000,


        //quill: null, // was this used somewhere? 6-29-2020
        quill: null, // Email body editor.
        quillSubjectEditor: null, // Email subject editor.





        displayOrgRolesPicker: false, //true, // Should be false by default but this is good for now.
        displayRoleIdColumn: false,
        autoSenseDeviceType: false // Automatic UI based on device type. Alpha version so far.
    },
    _create: function (assignmentRowChanged_ElementId) {
        this.element.addClass("bwExternallySharedFiles");
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
            if (this.options.filesAndFolders != null) {
                this.renderFileExplorer();
            } else {

                this.loadFoldersAndFiles();

            }
        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">bwExternallySharedFiles: CANNOT RENDER</span>';
            html += '<br />';
            html += '<span style="">Exception in bwExternallySharedFiles.js._create(): ' + e.message + ', ' + e.stack + '</span>';
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
            .removeClass("bwExternallySharedFiles")
            .text("");
    },
    loadFoldersAndFiles: function () {
        try {
            console.log('In bwExternallySharedFiles.js.loadFoldersAndFiles().');
            //alert('In bwExternallySharedFiles.js.loadFoldersAndFiles().');
            var thiz = this;

            var html = '';
            html += '<table>';
            html += '   <tr>';
            html += '       <td style="text-align:left;vertical-align:middle;white-space:nowrap;vertical-align:top;" class="bwSliderTitleCell">Externally shared files:&nbsp;</td>';
            html += '       <td class="bwChartCalculatorLightCurrencyTableCell">';
            html += '           <table>';
            html += '           <tbody>';
            html += '               <tr>';
            html += '                   <td><img src="/images/ajax-loader.gif" width="25px" /><span style="color:tomato;">Loading externally shared files...</span></td>';
            html += '               </tr>';
            html += '           </tbody></table>';
            html += '       </td>';
            html += '   </tr>';
            html += '</table>';
            this.element.html(html);

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');
            var participantEmail = $('.bwAuthentication').bwAuthentication('option', 'participantEmail');
            var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');
            var externallyFacingUrlForAttachmentsSourceFolder = $('.bwAuthentication').bwAuthentication('option', 'externallyFacingUrlForAttachmentsSourceFolder');

            var activeStateIdentifier = $('.bwAuthentication:first').bwAuthentication('getActiveStateIdentifier');

            //alert('Getting directory listing from ' + externallyFacingUrlForAttachmentsSourceFolder);

            //debugger;
            var data = {
                bwParticipantId_LoggedIn: participantId,
                bwActiveStateIdentifier: activeStateIdentifier,
                bwWorkflowAppId_LoggedIn: workflowAppId,

                bwWorkflowAppId: workflowAppId,
                bwParticipantId: participantId,
                bwParticipantFriendlyName: participantFriendlyName,
                bwParticipantEmail: participantEmail,
                externallyFacingUrlForAttachmentsSourceFolder: externallyFacingUrlForAttachmentsSourceFolder
            };
            $.ajax({
                url: thiz.options.operationUriPrefix + "_files/GetExternallySharedFiles",
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: function (results) {
                    try {
                        debugger;
                        if (results.status != 'SUCCESS') {

                            //displayAlertDialog(results.message);

                            //thiz.element.html('<span style="color:tomato;font-weight:bold;">' + results.message + '</span>');

                            var html = '';
                            html += '<table>';
                            html += '   <tr>';
                            html += '       <td style="text-align:left;vertical-align:middle;white-space:nowrap;vertical-align:top;" class="bwSliderTitleCell">Externally shared files:&nbsp;</td>';
                            html += '       <td class="bwChartCalculatorLightCurrencyTableCell">';
                            html += '           <table>';
                            html += '           <tbody>';
                            html += '               <tr>';
                            html += '                   <td><span style="color:tomato;">Error: ' + results.message + '</span></td>';
                            html += '               </tr>';
                            html += '           </tbody></table>';
                            html += '       </td>';
                            html += '   </tr>';
                            html += '</table>';
                            thiz.element.html(html);

                        } else {

                            thiz.options.filesAndFolders = results.filesandfolders;
                            thiz.options.externallyFacingUrlForAttachmentsSourceFolder = results.externallyFacingUrlForAttachmentsSourceFolder;

                            thiz.renderFileExplorer();

                        }

                    } catch (e) {

                        var msg = 'Exception in bwExternallySharedFiles.js.loadFoldersAndFiles():2: ' + e.message + ', ' + e.stack;
                        console.log(msg);
                        alert(msg);

                        thiz.element.html('<span style="color:tomato;">' + msg + '</span>');

                    }
                },
                error: function (data, errorCode, errorMessage) {

                    var msg = 'Error in bwExternallySharedFiles.js.loadFoldersAndFiles.GetExternallySharedFiles():1: ' + errorCode + ', ' + errorMessage;
                    console.log(msg);
                    alert(msg);

                    
                    var html = '';
                    html += '<table>';
                    html += '   <tr>';
                    html += '       <td style="text-align:left;vertical-align:middle;white-space:nowrap;vertical-align:top;" class="bwSliderTitleCell">Externally shared files:&nbsp;</td>';
                    html += '       <td class="bwChartCalculatorLightCurrencyTableCell">';
                    html += '           <table>';
                    html += '           <tbody>';
                    html += '               <tr>';
                    html += '                   <td><span style="color:tomato;font-weight:bold;font-style:italic;">Error loading externally shared files: ' + errorCode + '</span></td>';
                    html += '               </tr>';
                    html += '           </tbody></table>';
                    html += '       </td>';
                    html += '   </tr>';
                    html += '</table>';

                    thiz.element.html(html);

                }
            });

        } catch (e) {
            console.log('Exception in bwExternallySharedFiles.js.loadFoldersAndFiles(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwExternallySharedFiles.js.loadFoldersAndFiles(): ' + e.message + ', ' + e.stack);
        }
    },
    renderFileExplorer: function () {
        try {
            console.log('In renderFileExplorer().');
            var thiz = this;

            var workflowAppId = $('.bwAuthentication').bwAuthentication('option', 'workflowAppId');
            var externallyFacingUrlForAttachmentsSourceFolder = $('.bwAuthentication').bwAuthentication('option', 'externallyFacingUrlForAttachmentsSourceFolder');
            var externallyFacingUrlForAttachments = $('.bwAuthentication').bwAuthentication('option', 'externallyFacingUrlForAttachments');

            this.element.html('Loading externally shared files...');

            if (!this.options.filesAndFolders) {

                // There are no folders and/or files. 
                var html = '';

                html += '<table>';
                html += '   <tr>';
                html += '       <td colspan="2" class="bwChartCalculatorLightCurrencyTableCell" style="width:100%;">';
                html += '           <span xcx="xcx55934-1" style="font-size:20pt;font-weight:normal;">Externally Shared Files (unauthenticated)</span>';
                html += '           <br />';
                html += '           <span style="font-size:small;font-style:italic;">Files that have been externally shared so that they can be shared using links (without logging in).</span>';
                html += '           <br />';
                html += '           <br />';
                html += '           There are no externally shared files, or the configuration has not been completed.';
                html += '           <br />';
                html += '           <br />';
                html += '       </td>';
                html += '   </tr>';
                html += '</table>';

                this.element.html(html);

            } else {

                var filesandfolders = this.options.filesAndFolders;
                // There are external folders and/or files.
                var folders = [];
                var files = [];
                for (var i = 0; i < filesandfolders.length; i++) {
                    if (filesandfolders[i].smbType == 'FOLDER') {
                        folders.push(filesandfolders[i]);
                    } else if (filesandfolders[i].smbType == 'FILE') {
                        files.push(filesandfolders[i]);
                    } else {
                        // Unexpected smbType value.


                    }
                }

                var folders2 = $.unique(folders.sort(function (a, b) { return a.folder.toLowerCase().localeCompare(b.folder.toLowerCase()) })).sort(function (a, b) { return a.folder.toLowerCase().localeCompare(b.folder.toLowerCase()) });
                var files2 = $.unique(files.sort(function (a, b) { return a.file.toLowerCase().localeCompare(b.file.toLowerCase()) })).sort(function (a, b) { return a.file.toLowerCase().localeCompare(b.file.toLowerCase()) });

                var html = '';

                html += '<table>';
                html += '   <tr>';
                html += '       <td colspan="2" class="bwChartCalculatorLightCurrencyTableCell" style="width:100%;">';

                html += '<span xcx="xcx55934-2" style="font-size:20pt;font-weight:normal;">Externally Shared Files (unauthenticated)</span>';
                html += '<br />';
                html += '<span style="font-size:small;font-style:italic;">Files that have been externally shared so that they can be shared using links (without logging in).</span>';
                html += '<br />';
                html += '<br />';

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
                html += '                                   <span id="spanOrgX_root" class="orgTreeNode" style="cursor:pointer;white-space:nowrap;" onclick="$(\'.bwExternallySharedFiles\').bwExternallySharedFiles(\'collapseOrExpandTree\', \'\', \'spanOrgX_root\', \'root\');" onmouseover="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderOrgRoleConnectorsToWorkflowxx\', true, \'root\');" onmouseout="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderOrgRoleConnectorsToWorkflowResetxx\', \'' + 'spanOrgX_root\', \'root\');">';

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
                //html += '                                   <span id="spanDivisionsTreeExpandCollapseButton" style="cursor:pointer;" onclick="$(\'.bwExternallySharedFiles\').bwExternallySharedFiles(\'collapseOrExpandTree\', \'\', \'spanDivisionsTreeExpandCollapseButton\', \'root\');">';
                //html += '                                       <img title="collapse" style="cursor:pointer;width:35px;height:35px;vertical-align:middle;" src="images/drawer-close.png"> ';
                //html += '                                   </span>';

                //var d = 0;

                ////html += '                               <span id="spanOrgX_' + d + '_' + 'GroupsNode' + '" class="orgTreeNode" style="cursor:pointer;font-weight:bold;" title="Collapse..." onclick="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'collapseTree\', \'\', \'' + '' + '\');" onmouseout="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderOrgRoleConnectorsToWorkflowResetxx\', \'' + 'spanOrgX_' + d + '_' + 'GroupsNode' + '\', \'' + '' + '\', \'' + 'GroupsNode' + '\');" onmouseover="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderOrgRoleConnectorsToWorkflowxx\', true, \'' + '' + '\', \'' + 'GroupsNode' + '\');">';
                ////html += '                               Divisions &nbsp;&nbsp; ';
                ////html += '                               </span>';

                //html += '                               </td>';
                //html += '                           </tr>';

                for (var i = 0; i < folders2.length; i++) {
                    html += '           <tr class="trSubfolder">';
                    html += '               <td id="rootDivisionCell" style="padding-left:40px;white-space:nowrap;">';

                    html += '<span id="spanDivisionTreeExpandCollapseButton_' + i + '" style="cursor:pointer;" onclick="$(\'.bwExternallySharedFiles\').bwExternallySharedFiles(\'collapseOrExpandTree\', \'\', \'spanDivisionTreeExpandCollapseButton_' + i + '\', \'' + i + '\');">';
                    html += '   <img title="collapse" style="cursor:pointer;width:35px;height:35px;vertical-align:middle;" src="images/drawer-open.png">';
                    html += '</span>';

                    html += ' <span id="spanOrgX_' + i + '" class="orgTreeNode" style="cursor:pointer;white-space:nowrap;" onclick="window.scrollTo(0, 0);$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'displayOrgRoleEditorInACircle\', true, \'' + i + '\');" onmouseover="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderOrgRoleConnectorsToWorkflowxx\', true, \'' + i + '\');" onmouseout="$(\'.bwOrganizationEditor\').bwOrganizationEditor(\'renderOrgRoleConnectorsToWorkflowResetxx\', \'' + 'spanOrgX_' + i + '\', \'' + i + '\');">';
                    html += '   <img src="images/folder.png" style="cursor:pointer;width:40px;" />';
                    html += '   &nbsp;&nbsp;';
                    html += '<span class="spanBwExternallySharedFiles_folder" bwexternallysharedfiles_folder="' + folders2[i].folder + '" bwexternallysharedfiles_folder_filecount="' + folders2[i].files.length + '" >' + folders2[i].folder + ' (' + folders2[i].files.length + ')</span>';

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
                    for (var j = 0; j < folders2[i].files.length; j++) {
                        html += '<span class="spanBwExternallySharedFiles_file" bwexternallysharedfiles_folder="' + folders2[i].folder + '" bwexternallysharedfiles_folder_file="' + folders2[i].files[j] + '" >';
                        html += '   <a target="_blank" href="' + externallyFacingUrlForAttachments + '/' + folders2[i].folder + '/' + folders2[i].files[j] + '">' + externallyFacingUrlForAttachments + '/' + folders2[i].folder + '/' + folders2[i].files[j] + '</a>';
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
                            console.log('Exception in bwExternallySharedFiles.js.renderFileExplorer.folder.contextMenu(): ' + e.message + ', ' + e.stack);
                            displayAlertDialog('Exception in bwExternallySharedFiles.js.renderFileExplorer.folder.contextMenu(): ' + e.message + ', ' + e.stack);
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
                            console.log('Exception in bwExternallySharedFiles.js.renderFileExplorer.file.contextMenu(): ' + e.message + ', ' + e.stack);
                            displayAlertDialog('Exception in bwExternallySharedFiles.js.renderFileExplorer.file.contextMenu(): ' + e.message + ', ' + e.stack);
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
            console.log('Exception in bwExternallySharedFiles.js.renderFileExplorer(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwExternallySharedFiles.js.renderFileExplorer(): ' + e.message + ', ' + e.stack);
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
            console.log('In bwExternallySharedFiles.js.cmdViewInvitation().');

            alert('This functionality is incomplete. Coming soon!');

        } catch (e) {
            console.log('Exception in bwExternallySharedFiles.js.cmdViewInvitation(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwExternallySharedFiles.js.cmdViewInvitation(): ' + e.message + ', ' + e.stack);
        }
    },


    viewInvitationDialog: function (invitationId, selectedSecurityRole) { // cmdViewInvitation
        try {
            console.log('In bwExternallySharedFiles.js.viewInvitationDialog().');

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
            console.log('Exception in bwExternallySharedFiles.js.cmdViewInvitation(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwExternallySharedFiles.js.cmdViewInvitation(): ' + e.message + ', ' + e.stack);
        }
    },












    //renderFileExplorer_original: function () {
    //    try {
    //        console.log('In renderFileExplorer().');
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
    //        console.log('Exception in bwExternallySharedFiles.js.renderFileExplorer(): ' + e.message + ', ' + e.stack);
    //        displayAlertDialog('Exception in bwExternallySharedFiles.js.renderFileExplorer(): ' + e.message + ', ' + e.stack);
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
            console.log('In bwExternallySharedFiles.js.updateInvitationSecurityRole_Mouseout().');

            //var tooltip = document.getElementById('tooltipUpdateSecurityRoleForInvitation');

            //tooltip.innerHTML = '';
            //tooltip.style.backgroundColor = '#555';
            //tooltip.style.color = 'white';

        } catch (e) {
            console.log('Exception in bwExternallySharedFiles.js.updateInvitationSecurityRole_Mouseout(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwExternallySharedFiles.js.updateInvitationSecurityRole_Mouseout(): ' + e.message + ', ' + e.stack);
        }
    },
    selectInvitationUserRole_Onchange: function (element) {
        try {
            console.log('In bwExternallySharedFiles.js.selectInvitationUserRole_Onchange(). selectedValue: ' + element.value);
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
            console.log('Exception in bwExternallySharedFiles.js.selectInvitationUserRole_Onchange(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwExternallySharedFiles.js.selectInvitationUserRole_Onchange(): ' + e.message + ', ' + e.stack);
        }
    },

    // Begin: Copy invitation link to clipboard.
    copyToClipboard_Invitation: function (element) {
        try {
            console.log('In bwExternallySharedFiles.js.copyToClipboard_Invitation().');

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
            console.log('Exception in bwExternallySharedFiles.js.copyToClipboard_Invitation(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwExternallySharedFiles.js.copyToClipboard_Invitation(): ' + e.message + ', ' + e.stack);
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
        console.log('In bwExternallySharedFiles.js.copyToClipboardMouseoutx');
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