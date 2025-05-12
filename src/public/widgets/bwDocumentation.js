$.widget("bw.bwDocumentation", {
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
        This is the bwDocumentation.js jQuery Widget. 
        ===========================================================

           [more to follow]
                           
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

           [put your stuff here]

        ===========================================================
        
       */

        operationUriPrefix: null
    },
    _create: function () {
        this.element.addClass("bwDocumentation");
        var thiz = this;
        try {
            if (this.options.operationUriPrefix == null) {
                // This formulates the operationUri, which is used throughout.
                var url1 = window.location.href.split('https://')[1];
                var url2 = url1.split('/')[0];
                this.options.operationUriPrefix = 'https://' + url2 + '/';
            }

            var workflowAppTheme = 'brushedAluminum_orange'; // $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');
            //alert('xcx8769 workflowAppTheme: ' + workflowAppTheme);

            // The inner left menu uses the same name for "Configuration", and in the future other functionality that uses the inner left menu. Therefore we make sure it is removed from the DOM before we put it back again. No duplicates!
            var element = document.getElementById('tableMainMenu2');
            if (element) {
                element.remove();
            }

            var html = '';

            //html += '<table id="tableMainMenu3" style="margin-left:-25px;width:100%;border-collapse: collapse;">';

            html += '    <!-- Left inner menu -->';
            html += '    <table id="tableMainMenu2" style="margin-left:-20px;margin-top:-25px;width:100%;border-collapse: collapse;z-index:1000;">';
            html += '        <tr>';
            html += '            <td style="width:1%;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
            html += '                <div class="' + workflowAppTheme + '_noanimation noanimation" style="border-radius:20px 0 0 0;width: 225px; float:left; height:85px; background-color:gray; "></div>';
            html += '            </td>';
            html += '            <td style="width:0.1%;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
            html += '                <div style="float:left;height:85px;width:26px;background-color:gray;margin-left:-2px;margin-right:-2px;">';
            html += '                    <div class="' + workflowAppTheme + '_noanimation noanimation" style="float:left;height:85px;width:26px;position:relative;background-color:gray;">';
            html += '                        <div id="divInnerRoundWithWhiteOverlay" style="position:absolute; bottom:0;float:left;width: 26px; height:36px; background-color:#f5f6fa; border-radius:26px 0 0 0;margin-left:1px;margin-bottom:-1px;"></div> <!-- The background-color is set to space white (#f5f6fa) here, for the "under the curve" color of this element. -->';
            html += '                    </div>';
            html += '                </div>';
            html += '            </td>';
            html += '            <td style="width:2%;vertical-align:top;padding:0 6px 0 6px;margin:0 0 0 0;border-width:0 0 0 0;">';
            html += '                <div id="divPageContent2_Title" style="font-size:45px;color:black;white-space:nowrap;margin-top:-3px;font-weight:bolder;">DOCUMENTATION</div>';
            html += '            </td>';
            html += '            <td style="width:95%;vertical-align:top;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
            html += '                <div class="' + workflowAppTheme + '_noanimation noanimation" style="border-radius:0 26px 26px 0;width: 100%; float:left; height:50px; background-color:gray;" xcx="xcx213153">';
            html += '                </div>';
            html += '            </td>';
            html += '        </tr>';

            html += '        <tr>';
            html += '            <td id="tdInnerLeftSideMenu" style="vertical-align:top;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
            html += '';
            html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:5px; background-color:white; "></div>';
            html += '';

            html += '                <div id="divInnerLeftMenuTopSmallBar1" class="' + workflowAppTheme + '_noanimation noanimation" style="width: 100%; float:right; height:25px; background-color:#7788ff !important; color:white;font-family: \'Franklin Gothic Medium\', \'Arial Narrow\', Arial, sans-serif;display: flex !important;justify-content: flex-end !important;align-items: flex-end !important;">';
            //html += '🔊';
            html += '                </div>';

            html += '';
            html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
            html += '                <div id="divInnerLeftMenuButton_Introduction" class="leftButton ' + workflowAppTheme + '" weightedheightvalue="125" style="display:none;height:125px;" onclick="$(\'.bwDocumentation:first\').bwDocumentation(\'displayIntroduction\');">';
            html += '                    <div class="leftButtonText2">INTRODUCTION</div>';
            html += '                </div>';
            html += '';
            html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
            html += '                <div id="divInnerLeftMenuButton_Inbox" class="leftButton ' + workflowAppTheme + '" weightedheightvalue="125" style="display:none;height:125px;" onclick="$(\'.bwDocumentation:first\').bwDocumentation(\'loadAndRenderDocumentation\');">';
            //html += '                    <div class="leftButtonText2">DOCUMENTATION</div>';
            html += '                </div>';
            html += '';
            html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
            html += '                <div class="leftButton ' + workflowAppTheme + '" weightedheightvalue="40" style="display:none;" onclick="$(\'.bwDocumentation:first\').bwDocumentation(\'loadAndRenderDocumentation_Sent\');">';
            //html += '                    <div class="leftButtonText2">SENT</div>';
            html += '                </div>';
            html += '';
            html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
            html += '                <div class="leftButton ' + workflowAppTheme + '" weightedheightvalue="30" style="display:none;" onclick="$(\'.bwDocumentation:first\').bwDocumentation(\'loadAndRenderDocumentation_Drafts\');">';
            //html += '                    <div class="leftButtonText2">DRAFTS</div>';
            html += '                </div>';

            html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
            html += '                <div class="leftButton ' + workflowAppTheme + '" weightedheightvalue="20" style="display:none;" onclick="$(\'.bwDocumentation:first\').bwDocumentation(\'loadAndRenderDocumentation_Junk\');">';
            //html += '                    <div class="leftButtonText2">JUNK</div>';
            html += '                </div>';

            html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
            html += '                <div class="leftButton ' + workflowAppTheme + '" weightedheightvalue="30" style="display:none;" onclick="$(\'.bwDocumentation:first\').bwDocumentation(\'loadAndRenderDocumentation_Archived\');">';
            //html += '                    <div class="leftButtonText2">ARCHIVED</div>';
            html += '                </div>';

            html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
            html += '                <div class="leftButton ' + workflowAppTheme + '" weightedheightvalue="30" style="display:none;" onclick="$(\'.bwDocumentation:first\').bwDocumentation(\'loadAndRenderDocumentation_TrashBin\');">';
            //html += '                    <div class="leftButtonText2"><span><span class="bwDocumentation_LeftMenuButton_UnicodeImage"><img src="/images/trashbin.png" style="height:40px;"></span></span></div>';
            html += '                </div>';

            html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';

            var developerModeEnabled = $('.bwAuthentication').bwAuthentication('option', 'developerModeEnabled');

            if (developerModeEnabled == true) {

                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
                html += '                <div class="leftButton ' + workflowAppTheme + '" weightedheightvalue="40" style="display:none;" onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForInnerLeftMenuButtons\', this, \'FORMS\');">';
                html += '                    <div class="leftButtonText2">✉ Pending Inbox. Emails waiting to be sent to you.</div>';
                html += '                </div>';

                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
                html += '                <div class="leftButton ' + workflowAppTheme + '" weightedheightvalue="40" style="display:none;" onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForInnerLeftMenuButtons\', this, \'WORKFLOW_AND_EMAIL\');">';
                html += '                    <div class="leftButtonText2"><span><span class="bwDocumentation_LeftMenuButton_UnicodeImage">☎</span>&nbsp;Text Message INBOX</span></div>';
                html += '                </div>';

                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
                html += '                <div class="leftButton ' + workflowAppTheme + '" weightedheightvalue="40" style="display:none;" onclick="$(\'.bwActiveMenu\').bwActiveMenu(\'RenderContentForInnerLeftMenuButtons\', this, \'WORKFLOW_AND_EMAIL\');">';
                html += '                    <div class="leftButtonText2"><span><span class="bwDocumentation_LeftMenuButton_UnicodeImage">☎</span>&nbsp;SENT Text Message(s)</span></div>';
                html += '                </div>';



                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
                html += '                <div class="leftButton ' + workflowAppTheme + '" weightedheightvalue="125" style="display:none;height:125px;" onclick="$(\'.bwDocumentation:first\').bwDocumentation(\'displayAIConversation\');">';
                html += '                    <div class="leftButtonText2"><span><span class="bwDocumentation_LeftMenuButton_UnicodeImage">🔊</span>&nbsp;AI Conversation</span><br><span style="font-size:10pt;font-style:italic;color:gray;">The system engages you in a <br>conversation about the <br>requests that you are <br>involved with.</span></div>';
                html += '                </div>';

            }

            html += '            </td>';
            html += '            <td colspan="3" style="vertical-align:top;">';
            html += '                <div id="divPageContent2" style="padding-left:10px;">';
            html += '';
            html += '                    <div id="divPageContent3" style="right:-10px;top:-10px;padding-left:20px;padding-top:15px;">';
            //html += '                        <div style="border:1px dotted tomato;color:goldenrod;">';
            //html += '                            divPageContent3';
            html += '                        <div>';
            //html += '                            divPageContent3';
            html += '                            <br />';
            html += '                            <br />';
            html += '                            <br />';
            html += '                            <br />';
            html += '                            <br />';
            html += '                            <br />';
            html += '                            <br />';
            html += '                            <br />';
            html += '                        </div>';
            html += '                    </div>';
            html += '';
            html += '                </div>';
            html += '            </td>';
            html += '        </tr>';
            html += '    </table>';

            //html += '</table>';

            this.element.html(html);

            //document.getElementById('divPageContent1').style.paddingLeft = '10px';

            this.loadAndRenderDocumentation(); // This is a good user experinece, displaying the sent emails first. If the user wants to view pending emails, they can choose to do that.

            console.log('In bwDocumentation._create(). Printing has been initialized.');

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">bwDocumentation: CANNOT INITIALIZE THE WIDGET</span>';
            html += '<br />';
            html += '<span style="">Exception in bwDocumentation.Create(): ' + e.message + ', ' + e.stack + '</span>';
            thiz.element.html(html);

            var msg = 'Exception in bwDocumentation.js._create(): ' + e.message + ', ' + e.stack;
            displayAlertDialog(msg);

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
            .removeClass("bwDocumentation")
            .text("");
    },

    loadAndRenderDocumentation: function (bwWorkflowAppId) {
        try {
            console.log('In bwDocumentation.js.loadAndRenderDocumentation(). bwWorkflowAppId: ' + bwWorkflowAppId);
            //alert('In bwDocumentation.js.loadAndRenderDocumentation(). bwWorkflowAppId: ' + bwWorkflowAppId);
            var thiz = this;

            $('#divPageContent2_Title').html('DOCUMENTATION');


            //
            // Rendering the layout, within the divPageContent3 element.
            //

            var html = '';

            //html += '<style>';
            //html += '   .bwDocumentation_LeftMenuButton {';
            //html += '       font-size:14pt;white-space:nowrap;cursor:pointer;padding:10px 40px 10px 40px;'; // T R B L
            //html += '   }';
            //html += '   .bwDocumentation_LeftMenuButton:hover {';
            //html += '       cursor:pointer;background-color:lightgray;';
            //html += '   }';
            //html += '   .bwDocumentation_LeftMenuButton_Selected {';
            //html += '       font-size:14pt;white-space:nowrap;cursor:pointer;padding:10px 40px 10px 40px;background-color:#DEECF9;';
            //html += '   }';
            //html += '   .bwDocumentation_LeftMenuButton_UnicodeImage {';
            //html += '       font-size:30px;color:gray;'; // T L B R
            //html += '   }';

            //html += '   .bwDocumentation_InnerLeftMenuButton {';
            //html += '       font-size:14pt;white-space:nowrap;cursor:pointer;padding:10px 40px 10px 40px;'; // T R B L
            //// border:1px solid gainsboro;font-size:10pt;padding:10px 10px 10px 10px; <<< This is the style attribute values in the code.
            //html += '   }';
            //html += '   .bwDocumentation_InnerLeftMenuButton:hover {';
            //html += '       cursor:pointer;background-color:aliceblue;';
            //html += '   }';

            //html += '   .bwDocumentation_InnerLeftMenuButton_Selected {';
            ////html += '       font-size:14pt;white-space:nowrap;cursor:pointer;padding:10px 40px 10px 40px;';
            //html += '       cursor:pointer;background-color:aliceblue;';
            //html += '   }';



            //html += '   .bwDocumentation_Trashbin {';
            //html += '       cursor:pointer;background-color:aliceblue;'; // T R B L
            //html += '   }';
            //html += '   .bwDocumentation_Trashbin:hover {';
            //html += '       cursor:pointer;background-color:salmon;color:tomato;';
            //html += '   }';

            //html += '</style>';

            

            html += '<table style="width:100%;" xcx="xcx232536">';
            html += '   <tr>';
            html += '       <td style="width:100%;">';
            html += '           <div id="displayedemaildetails" bwPendingEmailId="" bwSentEmailId="" bwerrororsuggestionid=""></div>'; // This is where we look when we want to know the type and GUID of the displayed email!


            html += '                       <span id="spanDocumentation1" style="font-size:13pt;font-weight:normal;">[spanDocumentation1]</span>';


            html += '       </td>';
            html += '   </tr>';
            html += '</table>';

            // Render the html.
            $('#divPageContent3').html(html);

            $('.bwActiveMenu').bwActiveMenu('adjustInnerLeftSideMenu'); // This makes sure our new stretchy-left-menu redraws Ok.





            // Vertically stretchy button.
            var documentationIntroductionButton = document.getElementById('divInnerLeftMenuButton_Introduction');
            var height = Number(documentationIntroductionButton.style.height.split('px')[0]);

            console.log('xcxs21321312 >>> SETTING divInnerLeftMenuButton_Introduction OriginalHeight to: ' + height);
            //alert('xcxs21321312 >>> SETTING divInnerLeftMenuButton_Introduction OriginalHeight to: ' + height);

            $('.bwActiveMenu').bwActiveMenu('option', 'divInnerLeftMenuButton_Introduction_OriginalHeight', height);







            this.displayIntroduction();

        } catch (e) {
            console.log('Exception in loadAndRenderDocumentation(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in loadAndRenderDocumentation(): ' + e.message + ', ' + e.stack);
        }
    },

    displayIntroduction: function () {
        try {
            console.log('In displayIntroduction().');

            var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');
            var workflowAppTheme_SelectedButton = workflowAppTheme + '_SelectedButton';

            // Make all of the buttons un-selected.
            $('.' + workflowAppTheme_SelectedButton).each(function (index, value) {
                $(this).addClass(workflowAppTheme).removeClass(workflowAppTheme_SelectedButton);
            });

            // Set the specified button as the selected one.
            $('#divLeftMenuButton_Documentation').addClass(workflowAppTheme_SelectedButton).removeClass(workflowAppTheme);



            var html = '';

            html += `Introduction<br /><br />

ShareAndCollaborate.com is a Node.js social network for organization-centric financial/other decision making.
<br />
<br />In other words, an organization-centric financial CAPEX/OPEX/Project-Management Request System (project management social network) with inventory, workflow, reconciliation, invoicing.
<br /><br />It is an extensible framework and collection of jQuery widgets. Intended as a 1-stop shop for an organizations' financial/other decision making and management. 
<br /><br />Capital Expenditure Planning (CAPEX), Operational (OPEX), and as it turns out, great for almost any kind of paperwork based process that needs to be archived, searchable, shared.
 
 <br /> <br />


    <span style="font-weight:bold;">Free (as in freedom) and Open Source, fully licensed under GNU AGPLv3.</span>
    <br />
    <br />

<img src="../images/under-construction.jpg" style="width:300px;">
<br /><br />
How is this software constructed? Well, there are a lot of considerations. 
<br /><br />
This software has been created over a long period of time, and there are numerous other ways to view the engineered construction of the software. More to follow soon...
<br /><br />
<br />
==============================================================================<br />
How do we render so much information in such a quick and responsive UI?<br />
==============================================================================
<br /><br />
When you log in to the software, the Home screen displays Executive Summaries. These are rectangular gray-outlined blocks with curved corners. They can be created client or server side, because we have a file bwCommonScripts.js, which exists in both locations. This means on the server side, we can send emails with the Executive Summarie(s) UI included.
<br /><br />
These Executive Summaries use a dataset from a previously stored web service call, in the jQuery widget "option" JSON property. This means we can generate a UI with blinding speed, because the data is already present on the client side.
<br /><br />
However, there are some pieces of data that take more time to aquire.<br />
&nbsp;&nbsp;- Current workflow step participants<br />
&nbsp;&nbsp;&nbsp;&nbsp;- In the code, once they are all rendered, we call a webservice to get the workflow step and current participants for the particular Org/Location. We find the executive summary class in the DOM, and backfill the workflow participants for the current workflow step, and Org level. This is keyed on OrgId and bwRequestTypeId...  in other words, for a request type, participants are in roles which are accountable at that step in the workflow (for that request type/Org).<br />
&nbsp;&nbsp;- Attachment thumbnails and metadata<br />
&nbsp;&nbsp;&nbsp;&nbsp;- Lazy loaded, hopefully showing the most relevant and visible ones first. I need to optimize that, so currently not visible ones don't interfere with other CPU activity.<br />
&nbsp;&nbsp;- Inventory thumbnails and metadata<br />
&nbsp;&nbsp;&nbsp;&nbsp;- Lazy loaded, hopefully showing the most relevant and visible ones first. I need to optimize that, so currently not visible ones don't interfere with other CPU activity.<br />
<br /><br />
I call this "Backfilling". 
<br /><br />
<br />
==============================================================================<br />
What is "Triggering Recognition"?<br />
==============================================================================
<br /><br />
Triggering Recognition is an approach which presents desireable and needed information in an always-available fashion. Colors, and many other considerations make this a real human augmentation device.
<br /><br />
For instance, the bwActiveMenu.js jQuery widget provides menu buttons in a cascading/drill-down fashion, so that functionality is always available. The buttons are weighted to provide ease of use/recognition for important or often used functionality.
<br />
It is a left-side button menu, with wrap over top-bar, and weighted vertical button sizes, animated to provide liveliness, in a drill down and always-available-functionality kind of way.
<br /><br />
Another example is the bwOrganizationEditor.js widget. This is an exandable tree-view of the organization, with a side panel which displays the roles for an Org-unit, or the workflow participants, for a selected request type. 
<br /><br />
Users can drill down to see the Org-Unit roles and participants. See and drill down to participants' outstanding tasks, and roles throughout the organization. 
<br /><br />
A new and better way to view your Org Chart, and a way to immediately begin collaborating with users, participate in a request, and decide which requests are important to you.
<br /><br />
As the user uses this functionality, last selections are remember so that repeated tasks are immediately available moreso as the user uses the system. 
<br /><br />
This is akin to training/tailoring the software for you. Resulting in less clicks, less figuring things out, and more instantly available things that you need.
<br /><br />
<br />
I call this "Triggering Recognition". 
<br /><br />
<br />
==============================================================================<br />
The bwCircleDialog.js jQuery widget.<br />
==============================================================================
<br /><br />
When a user signs up, or signs in, they get a circle dialog. That is this widget.
<br /><br />
Once logged in, it is also used for displaying the Organization, it's Org-Units, and Participants.
<br /><br />
These are important core pieces of the system. Every part of the organization has participants. Participants belong to Org-Units, in specific role(s).
<br /><br />
People heads are round, and a corporate entity is a person without a head (not really a person, but kind of...), so it all ties together into a sensible way to Trigger Recognition, with many intuitive benefits.
<br /><br />
<br />
==============================================================================<br />
What are Request Types, and why do they form the basis for all of this functionality?<br />
==============================================================================
<br /><br />
Request Types are keyed on a GUID, in the property named bwRequestTypeId.
<br /><br />
This means that, for example, a Request type of "Budget Request", has a Form, and a Workflow.
<br /><br />
When you create a new request of type "Budget Request", you are presented the form to fill out, upload attachments, record audio, anything that is possible in modern web browsers.
<br /><br />
You can just save your form for yourself, but you can also Submit it to the organization. Once you click "Submit", the workflow specified for this request type is invoked. 
<br /><br />
Role assignments for the Org-Unit discovers the Participants, and magically, everyone becomes involved in the request.
<br /><br />
<br />
Workflows are easily created and modified using the bwWorkflowEditor.js widget. Forms are designed using a drag-and-drop interface in the bwFormsEditor.js widget.
<br /><br />
<br />
==============================================================================<br />
What about Printing?<br />
==============================================================================
<br /><br />
The bwPrintButton.js widget is the central spot for all printing.
<br /><br />
The widget, when instantiated, displays a clickable printer icon. It shows up in many places in the software. Anywhere you would want to print something.
<br /><br />
Requests, executive summaries, participant tasks, and many other reports are currently built into this widget. As we move forward with this software, this is the place to add all of that.
<br /><br />
<br />
==============================================================================<br />
What about Authentication?<br />
==============================================================================
<br /><br />
The bwAuthentication.js widget is the central spot for all authentication/authorization.
<br /><br />
The widget is instantiated by the bwActiveMenu.js widget, and is a singleton. It is also a place to store global type information in a JSON format.
<br /><br />
I have created this mechanism from scratch, and it provides secure database storage, 2-factor authentication, multi-logon/display support, IP Address and ActiveStateIdentifier GUID validated.
<br /><br />
<br />
==============================================================================<br />
Agile UI.<br />
==============================================================================
<br /><br />
The bwKeypressAndMouseEventHandler.js widget allows us to create our own way to interact with the user.
<br /><br />
A lot of standard browser behavior is not 100% suited to what we want to do, when presenting the user with the UI.
<br /><br />
Put all of your custom behavior here, considering what is there already.
<br /><br />
This widget really allows us to do anything we want within the browser window.
<br /><br />
<br />
==============================================================================<br />
Form Widgets<br />
==============================================================================
<br /><br />
Form widgets show up in the bwFormsEditor.js widget Toolbox. They can be drag and dropped on and off of a form for a request type.
<br /><br />
Form widgets can do anything that is supported in a modern web browser.
<br /><br />
Some of the form widgets include:
<br /><br />
bwLocation.js - This widget is present on all forms, so that the Org-Unit is selectable and established, because this is an organization centric system. The organization is edited in the bwOrganizationEditor.js Configuration > Organization, and is comprised of the standard, one size fits all “Division”, “Group” > “Legal Entity” > “Location”.
<br /><br />
bwAttachments.js - This widget has advanced uploading, including zip and ffmpeg wasms to speed up multiple file uploads, and video processing.
<br /><br />
bwInvoiceGrid.js - This widget takes invoice description and billing amounts. Entries are totalled, and the Issue Invoice button is a quick way to print the invoice. The executive summary displays invoice totals and if it is paid or unpaid.
<br /><br />
bwCostsGrid.js, bwSpendGrid.js, bwPaybackGrid.js - These form widgets take financial entries.
<br /><br />
bwJustificationDetails.js - The Justification Details section of the form is useful because anything can be pasted in here, shared and retained. It remains collapsed so that the user can view the entire form, but expanded to see as many details as you wish to put into it.
<br /><br />
bwInventoryItems.js - Select from your inventory. Manage inventory at Configuration > Inventory. (bwInventoryEditor.js widget).
<br /><br />
<br />
==============================================================================<br />
Business Intelligence<br />
==============================================================================
<br /><br />
The bwTrackSpending.js is the first of many widgets which display graphs and views of the organizations costs, spending, invoicing, etc.
<br /><br />
This is where this software really shines, and has a huge potential for realizing business benefits.
<br /><br />
<br />
==============================================================================<br />
Messaging<br />
==============================================================================
<br /><br />
The bwEmailClient_Haraka.js widget is an email client similar to most modern email clients. It is always accessible via the “Messaging” button.

<br /><br />
<br />
==============================================================================<br />
Code Editing and Publishing<br />
==============================================================================
<br /><br />
The bwCodeEditor.js widget is a code editor. Yes, you can change all of this software by using this software. A new way to look at development, and maintenance of your code. This is available using the Backend Administration, at https://budgetworkflow.com/admin.html.
There is a lot there to explain...
<br /><br />
<br />

==============================================================================<br />
Customer Sharing<br />
==============================================================================
<br /><br />
The bwPeoplePicker_Customer.js form widget allows the selection of customers that can view the request. For instance, select a customer to allow them to view an invoice. This comes under the broader topic, "Turning on the Social Network". [more coming soon...]
<br /><br />
<br />



<br />
<br /><br />
[more documentation coming soon]

<br /><br /><br /><br /><br /><br /><br /><br /><br /><br />









`;

            $('#spanDocumentation1').html(html);

            debugger;
            // Select the HOME button here. 1-4-2024.
            //var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');
            var workflowAppTheme = 'brushedAluminum_orange'; // $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');

            var workflowAppTheme_SelectedButton = workflowAppTheme + '_SelectedButton';

            // Step 1: Make all of the buttons un-selected.
            $('.bwDocumentation:first').find('.' + workflowAppTheme_SelectedButton).each(function (index, value) {
                $(this).addClass(workflowAppTheme).removeClass(workflowAppTheme_SelectedButton);
            });

            // Step 2: Set the specified button as the selected one.
            $('#divInnerLeftMenuButton_Introduction').addClass(workflowAppTheme_SelectedButton).removeClass(workflowAppTheme);


        } catch (e) {
            console.log('Exception in loadAndRenderDocumentation(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in loadAndRenderDocumentation(): ' + e.message + ', ' + e.stack);
        }
    }

});