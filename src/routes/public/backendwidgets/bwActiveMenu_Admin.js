$.widget("bw.bwActiveMenu_Admin", {
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
        This is the bwActiveMenu_Admin.js jQuery Widget. 
        ===========================================================

            [more to follow]
                          
        ===========================================================
        ===========================================================
        MORE DOCUMENTATION TO FOLLOW, JUST GETTING STARTED. Jan. 24, 2024.

            [put your stuff here]

        ===========================================================
       
        */

        operationUriPrefix: null,

        HasBeenInitialized: null,
        HomePage: true // We start off with this set to true, because the user is not logged in yet, it is a good default. :)

    },
    _create: function () {
        this.element.addClass("bwActiveMenu_Admin");
        //var thiz = this; // Need this because of the asynchronous operations below.
        try {

            selfDiscoverOperationUri(thiz); // This sets this.options.operationUriPrefix correctly.

            var developerModeEnabled = $('.bwAuthentication').bwAuthentication('option', 'developerModeEnabled');

            console.log('In bwActiveMenu_Admin.js._create(). >>>>>>>>>>>>>>>>>>>>> developerModeEnabled: ' + developerModeEnabled);

            if (this.options.HomePage == true) {
                this.renderHomePage();
            }

            this.options.HasBeenInitialized = true;




            // This displays the unauthenticated home screen.
            this.renderHomePageContent();
            //this.shrinkLeftMenu();
            //this.unshrinkLeftMenu();
            //this.RenderContentForButton(null, 'HOME_UNAUTHENTICATED');

            var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');
            if (!workflowAppTheme) { // Need to do this for the home page when not logged in.
                workflowAppTheme = 'brushedAluminum_admin';
            }
            var workflowAppTheme_SelectedButton = workflowAppTheme + '_SelectedButton';
            var x = $('#divWelcomeButton').hasClass('leftButton');
            if (x == true) {
                $('#divWelcomeButton').addClass(workflowAppTheme_SelectedButton).removeClass(workflowAppTheme);
            } else {
                console.log('In bwActiveMenu_Admin.js._create(). Error: Unable to locate class leftButton. xcx1-3ff.');
                alert('In bwActiveMenu_Admin.js._create(). Error: Unable to locate class leftButton. xcx1-3ff');
            }





            console.log('In bwActiveMenu_Admin.js._create(). The widget has been initialized.');

        } catch (e) {
            var html = '';
            html += '<span style="font-size:24pt;color:red;">CANNOT RENDER bwActiveMenu_Admin</span>';
            html += '<br />';
            html += '<span style="">Exception in bwActiveMenu_Admin.Create(): ' + e.message + ', ' + e.stack + '</span>';
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
            .removeClass("bwActiveMenu_Admin")
            .text("");
    },
    renderHomePage: function () {
        try {
            console.log('In bwActiveMenu_Admin.js.renderHomePage().');
            //alert('In bwActiveMenu_Admin.js.renderHomePage().');

            this.options.HomePage = true;
            this.renderMenu();

        } catch (e) {
            console.log('Exception in bwActiveMenu_Admin.js.renderHomePage(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwActiveMenu_Admin.js.renderHomePage(): ' + e.message + ', ' + e.stack);
        }
    },
    //populateCheckbox_ForestAdministratorToReviewEmailsBeforeSending: function () {
    //    try {
    //        console.log('In bwActiveMenu_Admin.js.populateCheckbox_ForestAdministratorToReviewEmailsBeforeSending().');

    //        $.ajax({
    //            url: this.options.operationUriPrefix + "_bw/getstatusofForestAdministratorToReviewEmailsBeforeSending",
    //            type: "GET",
    //            contentType: 'application/json',
    //            success: function (results) {
    //                try {

    //                    if (results.status != 'SUCCESS') {

    //                        var msg = 'Error in bwActiveMenu_Admin.js.populateCheckbox_ForestAdministratorToReviewEmailsBeforeSending(). ' + results.message;
    //                        console.log(msg);
    //                        displayAlertDialog(msg);

    //                    } else {
    //                        alert('xcx23123424 results: ' + JSON.stringify(results.results));

    //                        if (results.results.ForestAdministratorToReviewEmailsBeforeSending == true) {

    //                            alert('xcx2334 Set checkbox to true/checked.');

    //                            // Set checkbox to true/checked. // checkboxForestAdministratorToReviewEmailsBeforeSending
    //                            if (document.getElementById('configurationBehavior_ForestAdministratorToReviewEmailsBeforeSending_Slider')) {
    //                                //document.getElementById('configurationBehavior_ForestAdministratorToReviewEmailsBeforeSending_Slider').setAttribute('checked', 'checked');
    //                                $("input#configurationBehavior_ForestAdministratorToReviewEmailsBeforeSending_Slider").switchButton({ 'checked': true });
    //                            }

    //                        } else {

    //                            alert('xcx2334 Set checkbox to false/unchecked.');
    //                            // Set checkbox to false/unchecked.
    //                            if (document.getElementById('configurationBehavior_ForestAdministratorToReviewEmailsBeforeSending_Slider')) {
    //                                //document.getElementById('configurationBehavior_ForestAdministratorToReviewEmailsBeforeSending_Slider').removeAttribute('checked', '');
    //                                $("input#configurationBehavior_ForestAdministratorToReviewEmailsBeforeSending_Slider").switchButton({ 'checked': false });
    //                            }

    //                        }

    //                    }

    //                    //if (data && data[0] && data[0].NotifyForestAdministratorToReviewEmailsViaSms && data[0].NotifyForestAdministratorToReviewEmailsViaSms == true) {
    //                    //    // Set checkbox to true/checked. // checkboxForestAdministratorToReviewEmailsBeforeSending
    //                    //    if (document.getElementById('checkboxNotifyForestAdministratorToReviewEmailsViaSms')) {
    //                    //        document.getElementById('checkboxNotifyForestAdministratorToReviewEmailsViaSms').setAttribute('checked', 'checked');
    //                    //    }
    //                    //} else {
    //                    //    // Set checkbox to false/unchecked.
    //                    //    if (document.getElementById('checkboxNotifyForestAdministratorToReviewEmailsViaSms')) {
    //                    //        document.getElementById('checkboxNotifyForestAdministratorToReviewEmailsViaSms').removeAttribute('checked', '');
    //                    //    }
    //                    //}

    //                } catch (e) {
    //                    console.log('Exception in bwActiveMenu_Admin.js.populateCheckbox_ForestAdministratorToReviewEmailsBeforeSending(): ' + e.message + ', ' + e.stack);
    //                    displayAlertDialog('Exception in bwActiveMenu_Admin.js.populateCheckbox_ForestAdministratorToReviewEmailsBeforeSending(): ' + e.message + ', ' + e.stack);
    //                }
    //            },
    //            error: function (data, errorCode, errorMessage) {
    //                displayAlertDialog('Error in bwActiveMenu_Admin.js.populateCheckbox_ForestAdministratorToReviewEmailsBeforeSending()():' + errorCode + ', ' + errorMessage);
    //            }
    //        });

    //    } catch (e) {
    //        console.log('Exception in bwActiveMenu_Admin.js.populateCheckbox_ForestAdministratorToReviewEmailsBeforeSending(): ' + e.message + ', ' + e.stack);
    //        displayAlertDialog('Exception in bwActiveMenu_Admin.js.populateCheckbox_ForestAdministratorToReviewEmailsBeforeSending(): ' + e.message + ', ' + e.stack);
    //    }
    //},
    update_ForestAdministratorToReviewEmailsBeforeSending: function () {
        try {
            console.log('In bwActiveMenu_Admin.js.update_ForestAdministratorToReviewEmailsBeforeSending().');

            var ForestAdministratorToReviewEmailsBeforeSending = true;
            if (!document.getElementById('configurationBehavior_ForestAdministratorToReviewEmailsBeforeSending_Slider').checked) {
                ForestAdministratorToReviewEmailsBeforeSending = false;
            }

            var data = {
                ForestAdministratorToReviewEmailsBeforeSending: ForestAdministratorToReviewEmailsBeforeSending
            };

            var operationUri = this.options.operationUriPrefix + "_bw/UpdateForestAdministratorToReviewEmailsBeforeSending";
            $.ajax({
                url: operationUri,
                type: "POST",
                data: data,
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (results) {

                    if (results.status != 'SUCCESS') {

                        console.log('Error in bwActiveMenu_Admin.js.update_ForestAdministratorToReviewEmailsBeforeSending(). ' + results.message);
                        displayAlertDialog('Error in bwActiveMenu_Admin.js.update_ForestAdministratorToReviewEmailsBeforeSending(). ' + results.message);

                    } else {

                        displayAlertDialog('This operation has been completed successfully. Set ForestAdministratorToReviewEmailsBeforeSending: ' + ForestAdministratorToReviewEmailsBeforeSending);

                    }

                },
                error: function (data, errorCode, errorMessage) {
                    console.log('Error in bwActiveMenu_Admin.js.update_ForestAdministratorToReviewEmailsBeforeSending():1: ' + errorMessage);
                    displayAlertDialog('Error in bwActiveMenu_Admin.js.update_ForestAdministratorToReviewEmailsBeforeSending():1: ' + errorMessage);
                }
            });

        } catch (e) {
            console.log('Exception in bwActiveMenu_Admin.js.update_ForestAdministratorToReviewEmailsBeforeSending(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwActiveMenu_Admin.js.update_ForestAdministratorToReviewEmailsBeforeSending(): ' + e.message + ', ' + e.stack);
        }
    },
    unshrinkLeftMenu: function () {
        try {
            console.log('In unshrinkLeftMenu().');

            var leftMenuWidth = document.getElementById('divLeftMenuHeader').style.width.replace('px', '');

            if (leftMenuWidth < 200) {
                document.getElementById('divLeftMenuHeader').style.width = '250px';
                var cusid_ele = document.getElementsByClassName('leftButtonText');
                for (var i = 0; i < cusid_ele.length; ++i) {
                    var item = cusid_ele[i];
                    item.style.fontSize = '12pt';
                }

                console.log('Repositioning divPageContent1.');
                var leftSideMenu_BoundingClientRect = document.getElementById('tdLeftSideMenu').getBoundingClientRect();
                var left = leftSideMenu_BoundingClientRect.right;

                document.getElementById('divPageContent1').style.position = 'absolute';
                document.getElementById('divPageContent1').style.left = left + 'px';
                document.getElementById('divPageContent1').style.top = '85px'; // Corrects for the top spacing which changes after menu selections. 4-30-2022




                ////
                //// This positions the inner menus and content. Doesn't work on iOS. <<<<<<<<<<<<
                ////
                //var leftSideMenu_BoundingClientRect = document.getElementById('tdLeftSideMenu').getBoundingClientRect();
                //var divTopBar_Long_BoundingClientRect = document.getElementById('divTopBar_Long').getBoundingClientRect();
                //var top = divTopBar_Long_BoundingClientRect.bottom;
                //var left = leftSideMenu_BoundingClientRect.right; // 1st time: 259   // 2nd time: 104


                //top = top + 5;
                //left = left - 155;
                //console.log('In displayConfiguration(). top: ' + top + ', left: ' + left);
                //debugger;
                //document.getElementById('divPageContent1').style.position = 'absolute';
                //document.getElementById('divPageContent1').style.top = top + 'px';
                //document.getElementById('divPageContent1').style.left = left + 'px';
            }

        } catch (e) {
            console.log('Exception in unshrinkLeftMenu(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in unshrinkLeftMenu(): ' + e.message + ', ' + e.stack);
        }
    },

    shrinkLeftMenu: function () {
        try {
            console.log('In shrinkLeftMenu().');
            //
            // This positions the inner menus and content. Doesn't work on iOS. <<<<<<<<<<<<
            //
            var leftSideMenu_BoundingClientRect = document.getElementById('tdLeftSideMenu').getBoundingClientRect();
            var divTopBar_Long_BoundingClientRect = document.getElementById('divTopBar_Long').getBoundingClientRect();
            var top = divTopBar_Long_BoundingClientRect.bottom;
            var left = leftSideMenu_BoundingClientRect.right; // 1st time: 259   // 2nd time: 104


            top = top + 5;
            left = left - 155;
            console.log('In displayConfiguration(). top: ' + top + ', left: ' + left);
            //debugger;
            document.getElementById('divPageContent1').style.position = 'absolute';
            //alert('Setting divPageContent1.style.top: ' + top);
            document.getElementById('divPageContent1').style.top = top + 'px';
            document.getElementById('divPageContent1').style.left = left + 'px';

        } catch (e) {
            console.log('Exception in shrinkLeftMenu(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in shrinkLeftMenu(): ' + e.message + ', ' + e.stack);
        }
    },

    renderHomePageContent: function () {
        try {
            console.log('In bwActiveMenu_Admin.js.renderHomePageContent().');
            //alert('In bwActiveMenu_Admin.js.renderHomePageContent().');

            var html = '';

            html += '<div id="spanNotLoggedInBetaBannerxx" style="vertical-align:top;padding-top:10px;">';
            html += '    <span style="color:darkorange;font-weight:normal;vertical-align:top;">Welcome to the February 29, 2024 version of this software.</span>';
            html += '    <div style=""></div>';
            html += '    <br />';
            //html += '    <img src="images/beta_1355280.png" title="Beta version: Welcome to the December 15, 2022 version." style="cursor:help;width:100px;height:100px;position:absolute;top:0;left:0;z-index:2;opacity:0.85;" />';
            html += '    <span style="font-family:\'Courier New\';font-size:100pt;">BACKEND ADMINISTRATION TOOLS</span>';
            html += '    <br /><br /><br />';
            html += '    <table style="margin:auto;">';
            html += '        <tr>';
            html += '            <td colspan="2">';
            html += '                <span id="spanHomePageStatusText" style="margin:auto;"></span>';
            html += '            </td>';
            html += '        </tr>';
            html += '    </table>';
            html += '    <br /><br /><br />';
            html += '    <table style="margin:auto;">';
            html += '        <tr>';
            html += '            <td>';
            html += '                <div class="divSignInButton" style="width:195px;text-align: center; line-height: 1.1em; font-weight: bold;z-index:15;border:1px solid skyblue;" ';
            html += '                   onclick="$(\'.bwAuthentication\').bwAuthentication(\'displaySignInDialogForBackendAdministration\', true, null, null);">';
            html += '                    Sign In';
            html += '                </div>';
            html += '            </td>';
            html += '    </table>';
            html += '</div>';


            html += '        <br /><br /><br /><br /><br />';
            html += '        <hr style="border:0 none; border-bottom: 1px solid lightgray;" />';
            html += '        <div style="vertical-align:bottom;">';
            html += '            <table style="width:100%;">';
            html += '                <tr>';
            html += '                    <td style="text-align:left;padding-left:10px;">';
            //html += '                        <img src="sharepoint/sharepoint.png" style="height:50px;width:50px;vertical-align:middle;" />';
            //html += '                        <a class="bwLink" href="https://budgetworkflow.com/sharepoint/index.html">The SharePoint Add-In details are here.</a>';
            html += '                    </td>';
            html += '                    <td></td>';
            html += '                    <td style="text-align:right;">';
            html += '                        &nbsp;&nbsp;&nbsp;&nbsp;';
            html += '                        <a href="privacy.html" target="_blank" class="bwLink">Privacy</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="terms-of-use.html" target="_blank" class="bwLink">Terms of use</a>';
            html += '                        &nbsp;&nbsp;&nbsp;&nbsp;';
            html += '                      </td>';
            html += '                </tr>';
            html += '            </table>';
            html += '        </div>';

            $('#divPageContent1').html(html);


            //console.log('In bwActiveMenu_Admin.renderHomePageContent(). Instantiating bwHowDoesItWorkCarousel on element bwActiveMenu_Admin_divBwHowDoesItWorkCarousel.');
            //$('#bwActiveMenu_Admin_divBwHowDoesItWorkCarousel').bwHowDoesItWorkCarousel2({});





            this.adjustLeftSideMenu();

            //alert('In bwActiveMenu_Admin.js.renderHomePageContent(). Instantiating bwHowDoesItWorkCarousel widget using element divBwHowDoesItWorkCarousel.');
            //$('.bwHowDoesItWorkCarousel').bwHowDoesItWorkCarousel('displayHowDoesItWorkScreen'); // 8-4-2022

            //$('#divBwHowDoesItWorkCarousel').bwHowDoesItWorkCarousel({});

            if (document.getElementById('cbCustomLogonRememberMe')) {
                // Call this so we have it displaying the correct value of checked/not checked.
                var rememberme;
                rememberme = localStorage('customlogonrememberme');
                if (rememberme == 'selected') {
                    document.getElementById('cbCustomLogonRememberMe').checked = true;
                } else {
                    document.getElementById('cbCustomLogonRememberMe').checked = false;
                }
            }

            try {
                //debugger;
                if (document.getElementById('spanAzureADConnectionDetails')) {
                    // Bind the click event. This has to happen here because this module will be instantiated after the link is presented on the screen. A race condition I suppose.
                    //
                    $('#spanAzureADConnectionDetails').off('click').click(function (error) {
                        console.log('In bwAuthentication._create.spanAzureADConnectionDetails.click().');
                        if (document.getElementById('spanAzureADConnectionDetails').innerHTML.indexOf('Microsoft') > -1) {
                            thiz.displayAzureADConnectionDetails();
                        } else {
                            thiz.displayBudgetWorkflowTwoFactorAuthenticationDetails();
                        }
                    });
                }
            } catch (e) { }

        } catch (e) {
            console.log('Exception in bwActiveMenu_Admin.js.renderHomePageContent(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwActiveMenu_Admin.js.renderHomePageContent(): ' + e.message + ', ' + e.stack);
        }
    },

    renderAuthenticatedHomePage: function () {
        try {
            console.log('In bwActiveMenu_Admin.js.renderAuthenticatedHomePage().');
            //alert('In bwActiveMenu_Admin.js.renderAuthenticatedHomePage().');

            this.options.HomePage = false;
            this.renderMenu();

        } catch (e) {
            console.log('Exception in bwActiveMenu_Admin.js.renderHomePage(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwActiveMenu_Admin.js.renderHomePage(): ' + e.message + ', ' + e.stack);
        }
    },
    renderMenu: function () {
        try {
            console.log('In bwActiveMenu_Admin.js.renderMenu().');
            //alert('In bwActiveMenu_Admin.js.renderMenu().');

            var developerModeEnabled = $('.bwAuthentication').bwAuthentication('option', 'developerModeEnabled');

            if (this.options.HomePage == true) {

                //alert('xcx11111111111');

                // 4-12-2022 THIS IS THE NEW HOME PAGE MENU DISPLAY.
                console.log('In bwActiveMenu_Admin.js.renderMenu(). >>>>>> this.options.HomePage: ' + this.options.HomePage);


                //var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');

                //if (workflowAppTheme) {
                //    // Do nothing.
                //} else {

                // There was no theme, so we need to determine if this is the backend admin.. if so set to _admin theme.
                //// backendAdministrationLogin
                //var backendAdministrationLogin = $('.bwAuthentication').bwAuthentication('option', 'backendAdministrationLogin');
                //if (backendAdministrationLogin == true) {
                //    workflowAppTheme = 'brushedAluminum_admin'; // This is the admin default theme. 12-15-2022.
                //} else {
                //    workflowAppTheme = 'brushedAluminum_green'; // This is the client side default theme. 12-15-2022.
                //}
                //console.log('In bwActiveMenu_Admin.js.renderMenu(). xcx12314 Setting default theme to: ' + workflowAppTheme);

                //}




                $('.bwAuthentication').bwAuthentication({ workflowAppTheme: 'brushedAluminum_purple' });

                //var workflowAppTheme = 'brushedAluminum_admin'; // This is the admin default theme. 12-15-2022.
                var workflowAppTheme = 'brushedAluminum_purple'; // This is the admin default theme. 12-15-2022.

                console.log('In bwActiveMenu_Admin.js.renderMenu(). Rendering the menu with theme: ' + workflowAppTheme);
                //alert('In bwActiveMenu_Admin.js.renderMenu(). Rendering the menu with theme: ' + workflowAppTheme);

                var html = '';

                html += '<table id="tableMainMenu1" style="display:inline;width:100%;border-collapse: collapse;">';
                html += '        <tr>';

                html += '            <td style="width:1%;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                html += '                <div id="divLeftMenuHeader" class="' + workflowAppTheme + '_noanimation noanimation" style="border-radius:26px 0 0 0;width: 250px; float:left; height:75px; background-color:darkgray; ">';
                html += '                </div>';
                html += '            </td>';

                //html += '            <td style="width:0.1%;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                html += '            <td style="width:26px;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                html += '                    <div class="' + workflowAppTheme + '_noanimation noanimation" style="float:left;height:75px;width:26px;position:relative;background-color:darkgray;">';
                html += '                        <div style="position:absolute; bottom:0;float:left;width: 26px; height:26px; background-color:#f5f6fa; border-radius:26px 0 0 0;margin-left:1px;margin-bottom:-1px;"></div> <!-- The background-color is set to space white (#f5f6fa) here, for the "under the curve" color of this element. -->';
                html += '                    </div>';
                html += '                </div>';
                html += '            </td>';

                html += '            <td style="width:100%;vertical-align:top;padding:0 0 0 0;margin:0 0 0 -2px;border-width:0 0 0 0;">';
                html += '                <div id="divTopBar_Long" class="' + workflowAppTheme + '_noanimation noanimation" style="width: 100%; float:left; height:50px;  "></div>';
                html += '            </td>';

                html += '            <td style="vertical-align:top;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                html += '                <div xcx="xcx21312-1" id="divTopBar_OrganizationName" class="' + workflowAppTheme + '_noanimation noanimation" style="width: 100%; float:left; height:50px; background-color:darkgray; "></div>';
                html += '            </td>';

                html += '            <td style="width:1%;vertical-align:top;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                html += '                <div class="' + workflowAppTheme + '_noanimation noanimation" style="border-radius:0 26px 26px 0;width: 30px; float:left; height:49px; background-color:darkgray; "></div>';
                html += '            </td>';

                html += '        </tr>';

                html += '        <tr>';

                html += '            <td id="tdLeftSideMenu" style="width: 250px;vertical-align:top;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                html += '                <div weightedheightvalue="40" class="' + workflowAppTheme + '_noanimation noanimation" style="">';
                html += '                    <div class="leftButtonText">';
                html += '                        <span id="spanErrorLink" style="display:none;font-size:x-large;color:yellow;font-family:Chunkfive, Georgia, Palatino, Times New Roman, serif;font-weight:bold;cursor:pointer;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;" onclick="cmdDisplayCommunicationsError();">Error!&nbsp;&nbsp;&nbsp;&nbsp;</span>';
                html += '                    </div>';
                html += '                </div>';
                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:5px; background-color:white; "></div>';
                html += '                <div id="divLeftMenuTopSmallBar1" class="' + workflowAppTheme + '_noanimation noanimation" style="width: 100%; float:right; height:25px; background-color:#7788ff !important; color:white;font-family: \'Franklin Gothic Medium\', \'Arial Narrow\', Arial, sans-serif;display: flex !important;justify-content: flex-end !important;align-items: flex-end !important;"></div>';
                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:5px; background-color:white; "></div>';
                html += '                <div weightedheightvalue="40" class="leftButton_inactive ' + workflowAppTheme + '" style="" >';
                html += '                    <div class="leftButtonText">';
                //html += '                        tips';
                html += '                    </div>';
                html += '                </div>';
                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:5px; background-color:white; "></div>';
                html += '                <div id="divWelcomeButton" weightedheightvalue="150" class="leftButton ' + workflowAppTheme + '" style="display:none;background-color:darkkhaki;" ';
                html += 'onclick="$(\'.bwActiveMenu_Admin\').bwActiveMenu_Admin(\'RenderContentForButton\', this, \'HOME_UNAUTHENTICATED\');"';
                html += '>';
                html += '                    <div class="leftButtonText">HOME</div>';
                html += '                </div>';
                html += '';
                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';

                //html += '                <div id="divSlidesButton" weightedheightvalue="150" class="leftButton ' + workflowAppTheme + '" style="display:none;background-color:darkgray;" ';
                //html += 'onclick="$(\'.bwActiveMenu_Admin\').bwActiveMenu_Admin(\'RenderContentForButton\', this, \'SLIDES\');"';
                //html += '>';
                //html += '                    <div class="leftButtonText">SLIDES</div>';
                //html += '                </div>';

                //html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';

                html += '                <div id="divWalkthroughButton" weightedheightvalue="40" class="leftButton_inactive ' + workflowAppTheme + '" style="display:none;background-color:khaki;" ';
                //html += 'onclick="$(\'.bwActiveMenu_Admin\').bwActiveMenu_Admin(\'RenderContentForButton\', this, \'FEATURES\');"';
                html += '>';
                //html += '                    <div class="leftButtonText">WALKTHROUGH *beta</div>';
                html += '                </div>';





                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
                html += '                <div id="divVisualizationsButton" weightedheightvalue="40" class="leftButton_inactive ' + workflowAppTheme + '" style="display:none;background-color:darkkhaki;" ';
                //html += 'onclick="$(\'.bwActiveMenu_Admin\').bwActiveMenu_Admin(\'RenderContentForButton\', this, \'TRACK_SPENDING\');"';
                html += '>';
                //html += '                    <div class="leftButtonText">TRACK SPENDING</div>';
                html += '                </div>';
                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';



                html += '                <div id="divContactButton" weightedheightvalue="150" class="leftButton_inactive ' + workflowAppTheme + '" style="display:none;background-color:khaki;" ';
                //html += '                   onclick="$(\'.bwActiveMenu_Admin\').bwActiveMenu_Admin(\'RenderContentForButton\', this, \'CONTACT\');"';
                html += '                >';
                //html += '                    <div class="leftButtonText">ABOUT</div>';
                html += '                </div>';



                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
                html += '                <div weightedheightvalue="40" class="leftButton_inactive ' + workflowAppTheme + '" style="background-color:plum;" ';
                //html += 'onclick="$(\'.bwActiveMenu_Admin\').bwActiveMenu_Admin(\'RenderContentForButton\', this, \'USER\');"';
                html += '>';
                //html += '                    <div class="leftButtonText">USER: <span id="spanLoggedInUserWelcomePage" style="padding-right:1px;"></span></div>';
                html += '                </div>';
                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:5px; background-color:white; "></div>';



                html += '                <div id="divContactButton" weightedheightvalue="40" class="leftButton_inactive ' + workflowAppTheme + '" style="background-color:burlywood;" ';
                html += '>';
                //html += '                    <div class="leftButtonText">CONTACT</div>';
                html += '                </div>';



                html += '            </td>';

                html += '            <td colspan="4" style="vertical-align:top;">';
                html += '                <div id="divPageContent1" style="margin-left:25px;right:-15px;top:-15px;padding-left:0;padding-top:0;">';
                html += '                    <div style="border:1px dotted tomato;color:goldenrod;">';
                html += '                        divPageContent3';
                html += '                        <br />';
                html += '                        <br />';
                html += '                        <br />';
                html += '                        <br />xcx44456';
                html += '                        <br />';
                html += '                        <br />';
                html += '                        <br />';
                html += '                        <br />';
                html += '                    </div>';
                html += '                </div>';
                html += '            </td>';

                html += '        </tr>';
                html += '    </table>';

                html += '    <!-- Left inner menu -->';
                html += '    <table id="tableMainMenu2" style="display:none;width:100%;border-collapse: collapse;">';
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
                html += '                <div id="divPageContent2_Title" style="font-size:45px;color:black;white-space:nowrap;margin-top:-3px;font-weight:bolder;">[divPageContent2_Title]</div>';
                html += '            </td>';
                html += '            <td style="width:95%;vertical-align:top;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                html += '                <div class="' + workflowAppTheme + '_noanimation noanimation" style="border-radius:0 26px 26px 0;width: 100%; float:left; height:50px; background-color:gray; ">';
                html += '                </div>';
                html += '            </td>';
                html += '        </tr>';




                html += '        <tr>';
                html += '            <td id="tdInnerLeftSideMenu" style="vertical-align:top;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                html += '';
                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:5px; background-color:white; "></div>';
                html += '';
                html += '                <div id="divInnerLeftMenuTopSmallBar1" class="' + workflowAppTheme + '_noanimation noanimation" style="width: 100%; float:right; height:25px; background-color:#7788ff !important; color:white;font-family: \'Franklin Gothic Medium\', \'Arial Narrow\', Arial, sans-serif;display: flex !important;justify-content: flex-end !important;align-items: flex-end !important;"></div>';
                html += '';
                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
                html += '                <div id="divInnerLeftMenuButton_PersonalBehavior" weightedheightvalue="40" class="leftButton ' + workflowAppTheme + '" onclick="$(\'.bwActiveMenu_Admin\').bwActiveMenu_Admin(\'RenderContentForInnerLeftMenuButtons\', this, \'PERSONAL_BEHAVIOR\');">';
                html += '                    <div class="leftButtonText2">PERSONAL SETTINGS</div>';
                html += '                </div>';
                html += '';

                //html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
                //html += '                <div class="leftButton ' + workflowAppTheme + '" weightedheightvalue="125" style="display:none;height:125px;" onclick="$(\'.bwActiveMenu_Admin\').bwActiveMenu_Admin(\'RenderContentForInnerLeftMenuButtons\', this, \'ORGANIZATION\');">';
                //html += '                    <div class="leftButtonText2">ORGANIZATION</div>';
                //html += '                </div>';

                //html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
                //html += '                <div class="leftButton brushedAluminum" weightedheightvalue="40" style="display:none;" onclick="$(\'.bwActiveMenu_Admin\').bwActiveMenu_Admin(\'RenderContentForInnerLeftMenuButtons\', this, \'SETTINGS\');">';
                //html += '                    <div class="leftButtonText2">SETTINGS</div>';
                //html += '                </div>';

                html += '';
                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
                html += '                <div class="leftButton ' + workflowAppTheme + '" weightedheightvalue="40" style="display:none;" onclick="$(\'.bwActiveMenu_Admin\').bwActiveMenu_Admin(\'RenderContentForInnerLeftMenuButtons\', this, \'ROLES\');">';
                html += '                    <div class="leftButtonText2">ROLES</div>';
                html += '                </div>';
                html += '';
                //html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
                //html += '                <div class="leftButton ' + workflowAppTheme + '" weightedheightvalue="40" style="display:none;" onclick="$(\'.bwActiveMenu_Admin\').bwActiveMenu_Admin(\'RenderContentForInnerLeftMenuButtons\', this, \'PARTICIPANTS\');">';
                //html += '                    <div class="leftButtonText2">PARTICIPANTS</div>';
                //html += '                </div>';

                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
                html += '                <div class="leftButton ' + workflowAppTheme + '" weightedheightvalue="40" style="display:none;" onclick="$(\'.bwActiveMenu_Admin\').bwActiveMenu_Admin(\'RenderContentForInnerLeftMenuButtons\', this, \'INVENTORY\');">';
                html += '                    <div class="leftButtonText2">INVENTORY</div>';
                html += '                </div>';

                html += '';
                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
                html += '                <div class="leftButton ' + workflowAppTheme + '" weightedheightvalue="125" style="display:none;height:125px;" onclick="$(\'.bwActiveMenu_Admin\').bwActiveMenu_Admin(\'RenderContentForInnerLeftMenuButtons\', this, \'WORKFLOW_AND_EMAIL\');">';
                html += '                    <div class="leftButtonText2">WORKFLOWS</div>';
                html += '                </div>';

                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
                html += '                <div class="leftButton ' + workflowAppTheme + '" weightedheightvalue="40" style="display:none;" onclick="$(\'.bwActiveMenu_Admin\').bwActiveMenu_Admin(\'RenderContentForInnerLeftMenuButtons\', this, \'FORMS\');">';
                html += '                    <div class="leftButtonText2">FORMS</div>';
                html += '                </div>';

                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
                html += '                <div class="leftButton ' + workflowAppTheme + '" weightedheightvalue="40" style="display:none;" onclick="$(\'.bwActiveMenu_Admin\').bwActiveMenu_Admin(\'RenderContentForInnerLeftMenuButtons\', this, \'CHECKLISTS\');">';
                html += '                    <div class="leftButtonText2">CHECKLISTS</div>';
                html += '                </div>';


                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
                html += '                <div class="leftButton ' + workflowAppTheme + '" weightedheightvalue="80" style="display:none;" onclick="$(\'.bwActiveMenu_Admin\').bwActiveMenu_Admin(\'RenderContentForInnerLeftMenuButtons\', this, \'SETTINGS\');">';
                html += '                    <div class="leftButtonText2">ORGANIZATION SETTINGS</div>';
                html += '                </div>';
                //html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
                //html += '                <div class="leftButton ' + workflowAppTheme + '" weightedheightvalue="40" style="display:none;height:75px;" onclick="$(\'.bwActiveMenu_Admin\').bwActiveMenu_Admin(\'RenderContentForInnerLeftMenuButtons\', this, \'MONITOR_PLUS_TOOLS\');">';
                //html += '                    <div class="leftButtonText2">MONITORING & TOOLS</div>';
                //html += '                </div>';



                html += '            </td>';
                html += '            <td colspan="3" style="vertical-align:top;">';
                html += '                <div id="divPageContent2" style="padding-left:10px;">';
                html += '';
                html += '                    <div id="divPageContent3" style="right:-10px;top:-10px;padding-left:20px;padding-top:15px;">';
                html += '                        <div style="border:1px dotted tomato;color:goldenrod;">';
                html += '                            divPageContent3';
                html += '                            <br />';
                html += '                            <br />';
                html += '                            <br />xcx1234536';
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



                $(this.element).html(html);

                //alert('In bwActiveMenu_Admin.js.renderMenu(). xcx1231242 calling renderHomePageContent(). ****************** @@@@@@@@@@');

                //this.renderHomePageContent();

            } else {


                console.log('xcx1231414 the authenticated home page should be showing up here...');





                var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');

                if (workflowAppTheme) {
                    // Do nothing.
                } else {

                    // There was no theme, so we need to determine if this is the backend admin.. if so set to _admin theme.
                    // backendAdministrationLogin
                    //var backendAdministrationLogin = $('.bwAuthentication').bwAuthentication('option', 'backendAdministrationLogin');
                    //if (backendAdministrationLogin == true) {
                    workflowAppTheme = 'brushedAluminum_admin'; // This is the admin default theme. 12-15-2022.
                    //workflowAppTheme = 'brushedAluminum_purple'; // This is the admin default theme. 12-15-2022.
                    //} else {
                    //    workflowAppTheme = 'brushedAluminum_green'; // This is the client side default theme. 12-15-2022.
                    //}
                    console.log('In bwActiveMenu_Admin.js.renderMenu(). xcx12314 Setting default theme to: ' + workflowAppTheme);

                }

                console.log('In bwActiveMenu_Admin.js.renderMenu()xcx33. Rendering the menu with theme: ' + workflowAppTheme);
                //alert('In bwActiveMenu_Admin.js.renderMenu()xcx33. Rendering the menu with theme: ' + workflowAppTheme);









                var html = '';

                //html += '<table id="tableMainMenu1" style="display:none;width:100%;border-collapse: collapse;">';
                html += '<table id="tableMainMenu1" style="display:inline;width:100%;border-collapse: collapse;">'; // This is set not to display. style.display will be set to inline when the theme has been applied.
                html += '        <tr>';
                html += '            <td style="width:1%;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';





                html += '                <div id="divLeftMenuHeader" class="' + workflowAppTheme + '_noanimation noanimation" style="border-radius:26px 0 0 0;width: 250px; float:left; height:75px; background-color:darkgray; ">'; // Original 3-27-2022
                //
                // THE rest of hese are a good try, btu sticing with the original.... 3-27-2022 :)
                //
                //html += '                <div id="divLeftMenuHeader" class="brushedAluminum_noanimation noanimation" style="border-radius:52px 0 0 0;width: 250px; float:left; height:75px; background-color:darkgray; ">'; // closer
                //html += '                <div id="divLeftMenuHeader" class="brushedAluminum_noanimation noanimation" style="border-radius:100px 0 0 0;width: 250px; float:left; height:75px; background-color:darkgray; ">'; // even closer
                //html += '                <div id="divLeftMenuHeader" class="brushedAluminum_noanimation noanimation" style="border-radius:200px 0 0 0;width: 250px; float:left; height:75px; background-color:darkgray; ">';









                // The following is where you can change the diameter of the left top organization logo circle.
                console.log('In bwActiveMenu_Admin.js. THIS IS WHERE YOU CAN TURN ON THE orgImage_root_blueheaderbar IMG element. <<<<<<<<<<<<<<<< It is turned off for admin at the moment. 12-15-2022.');
                //html += '                    <img id="orgImage_root_blueheaderbar" style="z-index:5999;border:7px solid #066B8B;border-radius:50%;width:215px;height:215px;vertical-align:-1.9em;background-color:#066B8B;position:absolute;cursor:pointer !important;" src="images/corporeal.png" title="[xcxBwWorkflowAppId]" /><!---.75em too high. 40 x 40 is good, 53x53 is 1/3 larger...-->';


                html += '';
                html += '                </div>';
                html += '            </td>';
                html += '            <td style="width:0.1%;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                html += '                <div style="float:left;height:75px;width:26px;background-color:#cc88ff;margin-left:-2px;margin-right:-3px;">';
                html += '                    <div class="' + workflowAppTheme + '_noanimation noanimation" style="float:left;height:75px;width:26px;position:relative;background-color:darkgray;">';
                html += '                        <div style="position:absolute; bottom:0;float:left;width: 26px; height:26px; background-color:#f5f6fa; border-radius:26px 0 0 0;margin-left:1px;margin-bottom:-1px;"></div> <!-- The background-color is set to space white (#f5f6fa) here, for the "under the curve" color of this element. -->';
                html += '                    </div>';
                html += '                </div>';
                html += '            </td>';
                html += '            <td style="width:100%;vertical-align:top;padding:0 0 0 0;margin:0 0 0 -2px;border-width:0 0 0 0;">';
                html += '                <div id="divTopBar_Long" class="' + workflowAppTheme + '_noanimation noanimation" style="width: 100%; float:left; height:50px; "></div>';
                html += '            </td>';
                html += '            <td style="width:2%;vertical-align:top;padding:0 6px 0 6px;margin:0 0 0 0;border-width:0 0 0 0;">';
                html += '                <div xcx="xcx21312-2" id="divTopBar_OrganizationName" style="font-size:49px;color:skyblue;white-space:nowrap;margin-top:-5px;font-weight:bold;">BACKEND ADMINISTRATION TOOLS</div>';
                html += '            </td>';
                html += '            <td style="width:1%;vertical-align:top;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                html += '                <div class="' + workflowAppTheme + '_noanimation noanimation" style="border-radius:0 26px 26px 0;width: 30px; float:left; height:49px; background-color:darkgray; "></div>';
                html += '            </td>';
                html += '        </tr>';
                html += '        <tr>';
                html += '            <td id="tdLeftSideMenu" style="width: 250px;vertical-align:top;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                html += '';
                html += '                <div weightedheightvalue="40" class="' + workflowAppTheme + '_noanimation noanimation" style="">';
                html += '                    <div class="leftButtonText">';
                html += '                        <span id="spanErrorLink" style="display:none;font-size:x-large;color:yellow;font-family:Chunkfive, Georgia, Palatino, Times New Roman, serif;font-weight:bold;cursor:pointer;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;" onclick="cmdDisplayCommunicationsError();">Error!&nbsp;&nbsp;&nbsp;&nbsp;</span>';
                html += '                    </div>';
                html += '                </div>';
                html += '';
                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:5px; background-color:white; "></div>';
                html += '';
                html += '                <div id="divLeftMenuTopSmallBar1" class="' + workflowAppTheme + '_noanimation noanimation" style="width: 100%; float:right; height:25px; background-color:#7788ff !important; color:white;font-family: \'Franklin Gothic Medium\', \'Arial Narrow\', Arial, sans-serif;display: flex !important;justify-content: flex-end !important;align-items: flex-end !important;"></div>';
                html += '';
                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:5px; background-color:white; "></div>';
                html += '';


                if (developerModeEnabled == true) {
                    html += '                <div weightedheightvalue="40" class="leftButton ' + workflowAppTheme + '" style="" onclick="cmdDisplayToDoList();">';
                    html += '                    <div class="leftButtonText">';
                    html += '                        tips';
                    html += '                    </div>';
                    html += '                </div>';
                } else {
                    html += '                <div weightedheightvalue="40" class="leftButton ' + workflowAppTheme + '" style="" >';
                    html += '                    <div class="leftButtonText">';
                    //html += '                        tips';
                    html += '                    </div>';
                    html += '                </div>';
                }

                html += '';
                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:5px; background-color:white; "></div>';
                html += '                <div id="divWelcomeButton" weightedheightvalue="150" class="leftButton ' + workflowAppTheme + '" style="display:none;background-color:darkkhaki;" onclick="$(\'.bwActiveMenu_Admin\').bwActiveMenu_Admin(\'RenderContentForButton\', this, \'HOME\');">';
                html += '                    <div class="leftButtonText">HOME</div>';
                html += '                </div>';
                html += '';
                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
                html += '                <div id="divNewRequestButton" weightedheightvalue="150" class="leftButton ' + workflowAppTheme + '" style="display:none;background-color:khaki;" onclick="$(\'.bwActiveMenu_Admin\').bwActiveMenu_Admin(\'RenderContentForButton\', this, \'CONFIGURATION\');">';
                html += '                    <div class="leftButtonText">NEW TENANT CONFIGURATION</div>';
                html += '                </div>';

                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
                html += '                <div id="divArchiveButton" weightedheightvalue="75" class="leftButton ' + workflowAppTheme + '" style="display:none;background-color:darkgray;" onclick="$(\'.bwActiveMenu_Admin\').bwActiveMenu_Admin(\'RenderContentForButton\', this, \'EMAIL_CAMPAIGN\');">';
                html += '                    <div class="leftButtonText">EMAIL CAMPAIGNS</div>';
                html += '                </div>';

                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
                html += '                <div id="divArchiveButton" weightedheightvalue="75" class="leftButton ' + workflowAppTheme + '" style="display:none;background-color:darkgray;" onclick="$(\'.bwActiveMenu_Admin\').bwActiveMenu_Admin(\'RenderContentForButton\', this, \'HOME_PAGE_SLIDESHOW\');">';
                html += '                    <div class="leftButtonText">HOME PAGE SLIDESHOW</div>';
                html += '                </div>';
                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
                html += '                <div id="divVisualizationsButton" weightedheightvalue="75" class="leftButton ' + workflowAppTheme + '" style="display:none;background-color:darkkhaki;" ';
                html += 'onclick="$(\'.bwActiveMenu_Admin\').bwActiveMenu_Admin(\'RenderContentForButton\', this, \'GLOBAL_SETTINGS\');" ';
                html += ' >';
                html += '                    <div class="leftButtonText">GLOBAL SETTINGS</div>';
                html += '                </div>';
                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
                html += '                <div id="divConfigurationButton" weightedheightvalue="150" class="leftButton ' + workflowAppTheme + '" style="display:none;background-color:khaki;" ';
                html += ' onclick="$(\'.bwActiveMenu_Admin\').bwActiveMenu_Admin(\'RenderContentForButton\', this, \'SPECIAL_TASKS\');" ';
                html += ' >';
                html += '                    <div class="leftButtonText">SPECIAL TASKS</div>';
                html += '                </div>';



                // 8-26-2023.
                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
                html += '                <div id="divConfigurationButton" weightedheightvalue="150" class="leftButton ' + workflowAppTheme + '" style="display:none;background-color:khaki;" ';
                html += ' onclick="$(\'.bwActiveMenu_Admin\').bwActiveMenu_Admin(\'RenderContentForButton\', this, \'PUBLISH_CODE\');" ';
                html += ' >';
                html += '                    <div class="leftButtonText">EDIT & PUBLISH CODE</div>';
                html += '                </div>';




                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
                html += '                <div weightedheightvalue="40" class="leftButton ' + workflowAppTheme + '" style="background-color:plum;" onclick="$(\'.bwActiveMenu_Admin\').bwActiveMenu_Admin(\'RenderContentForButton\', this, \'USER\');">';
                html += '                    <div class="leftButtonText">USER: <span id="spanLoggedInUserWelcomePage" style="padding-right:1px;"></span></div>';
                html += '                </div>';
                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:5px; background-color:white; "></div>';
                html += '                <div weightedheightvalue="40" class="leftButton ' + workflowAppTheme + '" style="background-color:burlywood;" onclick="$(\'.bwActiveMenu_Admin\').bwActiveMenu_Admin(\'RenderContentForButton\', this, \'REPORT_AN_ERROR\');">';
                html += '                    <div class="leftButtonText">REPORT AN ERROR</div>';
                html += '                </div>';

                if (developerModeEnabled == true) {
                    html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:5px; background-color:white; "></div>';
                    html += '                <div weightedheightvalue="75" class="leftButton ' + workflowAppTheme + '" style="background-color:burlywood;" onclick="$(\'.bwActiveMenu_Admin\').bwActiveMenu_Admin(\'RenderContentForButton\', this, \'REPORT_AN_ERROR\');">';
                    html += '                    <div class="leftButtonText">VIDEO ASSISTANT</div>';
                    html += '                </div>';


                    html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:5px; background-color:white; "></div>';
                    html += '                <div weightedheightvalue="75" class="leftButton ' + workflowAppTheme + '" style="background-color:thistle;" onclick="$(\'.bwActiveMenu_Admin\').bwActiveMenu_Admin(\'RenderContentForButton\', this, \'PRINT\');">';
                    html += '                    <div class="leftButtonText">PRINT</div>';
                    html += '                </div>';
                    html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:5px; background-color:white; "></div>';
                    html += '                <div weightedheightvalue="40" class="leftButton ' + workflowAppTheme + '" style="" onclick="$(\'.bwActiveMenu_Admin\').bwActiveMenu_Admin(\'RenderContentForButton\', this, \'VIEW_MOBILE_VERSION\');">';
                    html += '                    <div class="leftButtonText">VIEW MOBILE VERSION</div>';
                    html += '                </div>';
                    html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:5px; background-color:white; "></div>';
                    html += '                <div weightedheightvalue="40" class="leftButton ' + workflowAppTheme + '" onclick="$(\'.bwActiveMenu_Admin\').bwActiveMenu_Admin(\'RenderContentForButton\', this, \'TILE_AND_BALLOON_WINDOWS\');">';
                    html += '                    <div class="leftButtonText">TILE AND BALLOON WINDOWS</div>';
                    html += '                </div>';
                    html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:5px; background-color:white; "></div>';
                    html += '                <div weightedheightvalue="40" class="leftButton ' + workflowAppTheme + '" style="" onclick="$(\'.bwActiveMenu_Admin\').bwActiveMenu_Admin(\'RenderContentForButton\', this, \'FOREST_ADMIN\');">';
                    html += '                    <div class="leftButtonText">FOREST ADMIN</div>';
                    html += '                </div>';
                    html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:5px; background-color:white; "></div>';
                    html += '                <div weightedheightvalue="40" class="leftButton ' + workflowAppTheme + '" style="" onclick="$(\'.bwActiveMenu_Admin\').bwActiveMenu_Admin(\'RenderContentForButton\', this, \'LIVE_STATUS\');">';
                    html += '                    <div class="leftButtonText">LIVE STATUS</div>';
                    html += '                </div>';
                    html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:20px; background-color:white; "></div>';
                    html += '                <div weightedheightvalue="40" class="leftButton ' + workflowAppTheme + '" style="" onclick="$(\'.bwActiveMenu_Admin\').bwActiveMenu_Admin(\'RenderContentForButton\', this, \'DONATE\');">';
                    html += '                    <div class="leftButtonText">DONATE</div>';
                    html += '                </div>';
                }

                html += '';
                html += '            </td>';
                html += '            <td colspan="4" style="vertical-align:top;">';
                html += '                <div id="divPageContent1" style="margin-left:25px;right:-15px;top:-15px;padding-left:0;padding-top:0;">';
                html += '                    <div style="border:1px dotted tomato;color:goldenrod;">';
                html += '                        divPageContent3';
                html += '                        <br />';
                html += '                        <br />';
                html += '                        <br />xcx2234';
                html += '                        <br />';
                html += '                        <br />';
                html += '                        <br />';
                html += '                        <br />';
                html += '                        <br />';
                html += '                    </div>';
                html += '                </div>';
                html += '            </td>';
                html += '        </tr>';
                html += '    </table>';
                html += '';
                html += '    <!-- Left inner menu -->';
                html += '    <table id="tableMainMenu2" style="display:none;width:100%;border-collapse: collapse;">';
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
                html += '                <div id="divPageContent2_Title" style="font-size:45px;color:black;white-space:nowrap;margin-top:-3px;font-weight:bolder;">[divPageContent2_Title]</div>';
                html += '            </td>';
                html += '            <td style="width:95%;vertical-align:top;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                html += '                <div class="' + workflowAppTheme + '_noanimation noanimation" style="border-radius:0 26px 26px 0;width: 100%; float:left; height:50px; background-color:gray; ">';
                html += '                </div>';
                html += '            </td>';
                html += '        </tr>';
                html += '        <tr>';
                html += '            <td id="tdInnerLeftSideMenu" style="vertical-align:top;padding:0 0 0 0;margin:0 0 0 0;border-width:0 0 0 0;">';
                html += '';
                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:5px; background-color:white; "></div>';
                html += '';
                html += '                <div id="divInnerLeftMenuTopSmallBar1" class="' + workflowAppTheme + '_noanimation noanimation" style="width: 100%; float:right; height:25px; background-color:#7788ff !important; color:white;font-family: \'Franklin Gothic Medium\', \'Arial Narrow\', Arial, sans-serif;display: flex !important;justify-content: flex-end !important;align-items: flex-end !important;"></div>';
                html += '';
                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
                html += '                <div id="divInnerLeftMenuButton_PersonalBehavior" weightedheightvalue="40" class="leftButton ' + workflowAppTheme + '" onclick="$(\'.bwActiveMenu_Admin\').bwActiveMenu_Admin(\'RenderContentForInnerLeftMenuButtons\', this, \'PERSONAL_BEHAVIOR\');">';
                html += '                    <div class="leftButtonText2">PERSONAL SETTINGS</div>';
                html += '                </div>';
                html += '';

                //html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
                //html += '                <div class="leftButton ' + workflowAppTheme + '" weightedheightvalue="125" style="display:none;height:125px;" onclick="$(\'.bwActiveMenu_Admin\').bwActiveMenu_Admin(\'RenderContentForInnerLeftMenuButtons\', this, \'ORGANIZATION\');">';
                //html += '                    <div class="leftButtonText2">ORGANIZATION</div>';
                //html += '                </div>';

                //html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
                //html += '                <div class="leftButton' + workflowAppTheme + '" weightedheightvalue="40" style="display:none;" onclick="$(\'.bwActiveMenu_Admin\').bwActiveMenu_Admin(\'RenderContentForInnerLeftMenuButtons\', this, \'SETTINGS\');">';
                //html += '                    <div class="leftButtonText2">SETTINGS</div>';
                //html += '                </div>';

                html += '';
                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
                html += '                <div class="leftButton ' + workflowAppTheme + '" weightedheightvalue="40" style="display:none;" onclick="$(\'.bwActiveMenu_Admin\').bwActiveMenu_Admin(\'RenderContentForInnerLeftMenuButtons\', this, \'ROLES\');">';
                html += '                    <div class="leftButtonText2">ROLES</div>';
                html += '                </div>';
                html += '';
                //html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
                //html += '                <div class="leftButton ' + workflowAppTheme + '" weightedheightvalue="40" style="display:none;" onclick="$(\'.bwActiveMenu_Admin\').bwActiveMenu_Admin(\'RenderContentForInnerLeftMenuButtons\', this, \'PARTICIPANTS\');">';
                //html += '                    <div class="leftButtonText2">PARTICIPANTS</div>';
                //html += '                </div>';

                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
                html += '                <div class="leftButton ' + workflowAppTheme + '" weightedheightvalue="40" style="display:none;" onclick="$(\'.bwActiveMenu_Admin\').bwActiveMenu_Admin(\'RenderContentForInnerLeftMenuButtons\', this, \'INVENTORY\');">';
                html += '                    <div class="leftButtonText2">INVENTORY</div>';
                html += '                </div>';

                html += '';
                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
                html += '                <div class="leftButton ' + workflowAppTheme + '" weightedheightvalue="125" style="display:none;height:125px;" onclick="$(\'.bwActiveMenu_Admin\').bwActiveMenu_Admin(\'RenderContentForInnerLeftMenuButtons\', this, \'WORKFLOW_AND_EMAIL\');">';
                html += '                    <div class="leftButtonText2">WORKFLOWS</div>';
                html += '                </div>';

                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
                html += '                <div class="leftButton ' + workflowAppTheme + '" weightedheightvalue="40" style="display:none;" onclick="$(\'.bwActiveMenu_Admin\').bwActiveMenu_Admin(\'RenderContentForInnerLeftMenuButtons\', this, \'FORMS\');">';
                html += '                    <div class="leftButtonText2">FORMS</div>';
                html += '                </div>';

                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
                html += '                <div class="leftButton ' + workflowAppTheme + '" weightedheightvalue="40" style="display:none;" onclick="$(\'.bwActiveMenu_Admin\').bwActiveMenu_Admin(\'RenderContentForInnerLeftMenuButtons\', this, \'CHECKLISTS\');">';
                html += '                    <div class="leftButtonText2">CHECKLISTS</div>';
                html += '                </div>';

                if (developerModeEnabled == true) {
                    html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:3px; background-color:white; "></div>';
                    html += '                <div class="leftButton ' + workflowAppTheme + '" weightedheightvalue="40" style="display:none;" onclick="$(\'.bwActiveMenu_Admin\').bwActiveMenu_Admin(\'RenderContentForInnerLeftMenuButtons\', this, \'FINANCIALAREAS\');">';
                    html += '                    <div class="leftButtonText2">FINANCIAL AREAS</div>';
                    html += '                </div>';
                }

                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
                html += '                <div class="leftButton ' + workflowAppTheme + '" weightedheightvalue="80" style="display:none;" onclick="$(\'.bwActiveMenu_Admin\').bwActiveMenu_Admin(\'RenderContentForInnerLeftMenuButtons\', this, \'SETTINGS\');">';
                html += '                    <div class="leftButtonText2">ORGANIZATION SETTINGS</div>';
                html += '                </div>';
                //html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
                //html += '                <div class="leftButton ' + workflowAppTheme + '" weightedheightvalue="40" style="display:none;height:75px;" onclick="$(\'.bwActiveMenu_Admin\').bwActiveMenu_Admin(\'RenderContentForInnerLeftMenuButtons\', this, \'MONITOR_PLUS_TOOLS\');">';
                //html += '                    <div class="leftButtonText2">MONITORING & TOOLS</div>';
                //html += '                </div>';

                html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';

                if (developerModeEnabled == true) {
                    html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
                    html += '                <div class="leftButton ' + workflowAppTheme + '" weightedheightvalue="40" style="display:none;" onclick="$(\'.bwActiveMenu_Admin\').bwActiveMenu_Admin(\'RenderContentForInnerLeftMenuButtons\', this, \'INVENTORY\');">';
                    html += '                    <div class="leftButtonText2">INVENTORY</div>';
                    html += '                </div>';
                    html += '                <div class="buttonSpacer" style="width: 100%; float:left; height:10px; background-color:white; "></div>';
                    html += '                <div class="leftButton ' + workflowAppTheme + '" weightedheightvalue="40" style="display:none;height:125px;" onclick="$(\'.bwActiveMenu_Admin\').bwActiveMenu_Admin(\'RenderContentForInnerLeftMenuButtons\', this, \'FUNCTIONAL_AREAS\');">';
                    html += '                    <div class="leftButtonText2">FUNCTIONAL AREAS</div>';
                    html += '                </div>';
                }

                html += '            </td>';
                html += '            <td colspan="3" style="vertical-align:top;">';
                html += '                <div id="divPageContent2" style="padding-left:10px;">';
                html += '';
                html += '                    <div id="divPageContent3" style="right:-10px;top:-10px;padding-left:20px;padding-top:15px;">';
                html += '                        <div style="border:1px dotted tomato;color:goldenrod;">';
                html += '                            divPageContent3';
                html += '                            <br />';
                html += '                            <br />';
                html += '                            <br />xcx88890';
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


                $(this.element).html(html);


                this.adjustLeftSideMenu();

            }




            // First we have to display them in the top bar.
            // if (participantLogonType) {
            //$('#spanLoggedInUserWelcomePage').text('participantFriendlyName');
            //$('#spanLoggedInUserNewRequestPage').text(participantFriendlyName);
            //$('#spanLoggedInUserArchivePage').text(participantFriendlyName);
            //$('#spanLoggedInUserSummaryReportPage').text(participantFriendlyName);
            //$('#spanLoggedInUserConfigurationPage').text(participantFriendlyName);
            //$('#spanLoggedInUserVisualizationsPage').text(participantFriendlyName);
            //$('#spanLoggedInUserHelpPage').text(participantFriendlyName);
            // }
            //alert('In bwActiveMenu_Admin.js.renderMenu(). Displaying user friendly name on USER button.');
            var participantFriendlyName = $('.bwAuthentication').bwAuthentication('option', 'participantFriendlyName');
            if (participantFriendlyName) {

                console.log('In bwActiveMenu_Admin.js.renderMenu(). Displaying user friendly name on USER button.');
                $('#spanLoggedInUserWelcomePage').text(participantFriendlyName);
            }




        } catch (e) {
            console.log('Exception in bwActiveMenu_Admin.js.renderMenu(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwActiveMenu_Admin.js.renderMenu(): ' + e.message + ', ' + e.stack);
        }
    },
    displayTopBarErrorMessage: function (message) {
        try {
            console.log('In displayTopBarErrorMessage().');



            var element = document.getElementById('divTopBar_Long');
            var topBarColor = window.getComputedStyle(element, null).getPropertyValue('background-color'); // returns rgb(140, 35, 213)
            var colorsPrefix = topBarColor.split('(')[1];
            var colors = colorsPrefix.split(')')[0];
            var red = colors.split(',')[0];
            var green = colors.split(',')[1];
            var blue = colors.split(',')[2];

            // Calculate complementary color.
            var temprgb = { r: red, g: green, b: blue };
            var temphsv = this.RGB2HSV(temprgb);
            //alert('temphsv: ' + JSON.stringify(temphsv)); // returns temphsv: {"saturation":-52,"hue":146,"value":55} // check whether V is < 0.5. If so, white, if not, black.

            //temphsv.hue = this.HueShift(temphsv.hue, 180.0);
            //var complementaryColorRgb = this.HSV2RGB(temphsv);
            // end: Calculate complementary color.

            var newSaturation = (temphsv.saturation * 2) * -1;
            var newHue = temphsv.hue * 2;
            var newValue = temphsv.value;
            var newhsv = {
                saturation: newSaturation,
                hue: newHue,
                value: newValue
            }
            var newColorRgb = this.HSV2RGB(temphsv);


            console.log('In bwActiveMenu_Admin.js.displayTopBarErrorMessage(). Color calculation before: ' + JSON.stringify(temphsv) + ', after: ' + JSON.stringify(newhsv));


            //var color = 'tomato';
            //if (temphsv.value > 50) { // Check whether V is < 0.5. If so, white, if not, black.
            //    color = 'white';
            //} else {
            //    color = 'black';
            //}



            var html = '';

            //html += '<span id="divTopBar_Long_ErrorMessage" style="color:rgb(' + complementaryColorRgb.r + ',' + complementaryColorRgb.g + ',' + complementaryColorRgb.b + ');padding-left:5px;">';
            //html += '<span id="divTopBar_Long_ErrorMessage" style="color:' + color + ';padding-left:5px;">';
            //html += '<span id="divTopBar_Long_ErrorMessage" style="color:rgb(' + newColorRgb.r + ',' + newColorRgb.g + ',' + newColorRgb.b + ');padding-left:5px;">';

            html += '<div id="divTopBar_Long_ErrorMessage" style="color:white;padding-left:5px;padding-top:3px;">';

            html += message;
            html += '</div>';

            $('#divTopBar_Long').html(html);

        } catch (e) {
            console.log('Exception in bwActiveMenu_Admin.js.displayTopBarErrorMessage(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwActiveMenu_Admin.js.displayTopBarErrorMessage(): ' + e.message + ', ' + e.stack);
        }
    },
    clearTopBarErrorMessage: function (message) {
        try {
            console.log('In clearTopBarErrorMessage().');

            var html = '';

            $('#divTopBar_Long').html(html);

        } catch (e) {
            console.log('Exception in bwActiveMenu_Admin.js.clearTopBarErrorMessage(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwActiveMenu_Admin.js.clearTopBarErrorMessage(): ' + e.message + ', ' + e.stack);
        }
    },




    RenderContentForButton: function (element, button) {
        try {
            console.log('In RenderContentForButton: ' + button);
            //alert('In RenderContentForButton: ' + button);
            var thiz = this;

            $('canvas').remove('.canvasBwBusinessModelEditor'); // Clear the business model editor canvas.

            window.scrollTo(0, 0); // Scroll to top on button click. This makes sure things render Ok, and also just seems like a nicer user experience.
            this.adjustLeftSideMenu();
            //$('.bwActiveMenu').bwActiveMenu('adjustLeftSideMenu'); // This makes sure our new stretchy-left-menu redraws Ok.

            var resetThePageAndButtons = true;

            // Clear any error message in the top bar.
            $('#divTopBar_Long').html('');

            // THIS IS THE SECOND TIME WE ARE USING setTimeout for the call to bwActiveMenu_Admin.adjustLeftSideMenu(). 4-25-2022
            setTimeout(function () { // Only needs to happen for Chrome.
                // menu should be re-done since the display has probably resized from the display of the email.
                //alert('Calling bwActiveMenu_Admin.adjustLeftSideMenu().');
                $('.bwActiveMenu_Admin').bwActiveMenu_Admin('adjustLeftSideMenu');
            }, 1000);



            switch (button) {
                case 'HOME':
                    this.unshrinkLeftMenu();

                    try {
                        $('#FormsEditorToolbox').dialog('close');
                    } catch (e) { }



                    //renderWelcomeScreen(); // This may be removed at some point to leave the screen as-is instead of going all the way back to the home screen, which may be neat...time will tell.
                    //renderHomePagePersonalizedSection();
                    $('#bwQuickLaunchMenuTd').css({
                        width: '0'
                    }); // This gets rid of the jumping around.

                    // 11-16-2022

                    if ($('.bwAuthentication').bwAuthentication('instance') && $('.bwAuthentication').bwAuthentication().length && ($('.bwAuthentication').bwAuthentication().length == 1)) {
                        $('.bwAuthentication').bwAuthentication('getRemainingParticipantDetailsAndWorkflowAppTitle');
                    } else {
                        alert('xcx12343412 There is an issue with the bwAuthentication widget instance(s) in the dom. Instance: ' + $('.bwAuthentication').bwAuthentication('instance') + ', length: ' + $('.bwAuthentication').bwAuthentication('instance').length);
                    }

                    //try {
                    //    $('#divBwAuthentication').bwAuthentication('getRemainingParticipantDetailsAndWorkflowAppTitle').then(function () {

                    //        alert('xcx213124234234 successful function call.');

                    //    }).catch(function (e) {

                    //        // We should never get here, because we want them to handle all of their own exceptions...?
                    //        alert('xcx213124234234 Promise exception returned from function call.');

                    //    });
                    //} catch (e) {

                    //    alert('Exception xcx213124234234 in experiment to validate method calls to bwAuthentication: ' + e.message + ', ' + e.stack);

                    //}





                    break;
                case 'EMAIL_CAMPAIGN':
                    this.unshrinkLeftMenu();

                    $('#divPageContent1').html('');


                    var html = '';

                    html += '<div id="divBwEmailCampaign"></div>';

                    $('#divPageContent1').html(html);

                    $('#divBwEmailCampaign').bwEmailCampaign({});


                    //populateStartPageItem('divConfiguration', 'Reports', '');

                    //this.displayConfiguration();

                    //unshrinkLeftMenu();
                    //$('.bwActiveMenu_Admin').bwActiveMenu_Admin('shrinkLeftMenuBar');
                    //this.shrinkLeftMenuBar();

                    //Personal / Behavior
                    //divWelcomePageLeftButtonsConfigurationButton
                    //populateStartPageItem('divConfiguration', 'Reports', '');

                    //$('#bwQuickLaunchMenuTd').css({
                    //    width: '0'
                    //}); // This gets rid of the jumping around.

                    //try {
                    //    $('#FormsEditorToolbox').dialog('close');
                    //} catch (e) { }

                    //generateConfigurationLeftSideMenu();
                    //renderLeftButtons('divConfigurationPageLeftButtons');




                    //$('.bwAuthentication').bwAuthentication('securityTrimTheLeftMenuButtons_ConfigurationSection');

                    ////if (selectedWorkflowAppRole == 'participant') {
                    //    // 9-7-2021: TURN OFF ALL BUTTONS IN INNER LEFT MENU, EXCEPT PERSONAL/BAHAVIOR
                    //debugger;

                    //// selectedOrganization.OrganizationRole
                    //var buttons = $('#tableMainMenu3').find('.leftButton');
                    //    $(buttons).each(function (index, value) {
                    //        if ($(buttons[index]).html().indexOf('PERSONAL/BEHAVIOR') > -1) {
                    //            // Do nothing, we always want to display this button.
                    //        } else {
                    //            $(buttons[index]).removeClass('leftButton');
                    //        }
                    //    });
                    ////}






                    //$('#divPageContent2_Title').html('PERSONAL SETTINGS');
                    //renderConfigurationPersonalBehavior();

                    break;

                case 'HOME_PAGE_SLIDESHOW':

                    this.unshrinkLeftMenu();

                    $('#divPageContent1').html('');

                    var html = '';
                    html += '<div id="divBwSlideshowAdmin"></div>';
                    $('#divPageContent1').html(html);

                    $('#divBwSlideshowAdmin').bwSlideshowAdmin({});
                    
                    break;

                case 'GLOBAL_SETTINGS':
                    this.unshrinkLeftMenu();

                    $('#divPageContent1').html('');


                    var html = '';

                    html += '<div id="divBwNewUserEmailEditor"></div>';

                    html += '<div id="divBwUnsubscribeUserEmailEditor"></div>';
                    html += '<div id="divBwResubscribeUserEmailEditor"></div>';


                    html += '<span xcx="xcx123123-1" class="spanButton" style="border-color:tomato;" onclick="$(\'.bwNewUserEmailEditor\').bwNewUserEmailEditor(\'displayConfigureIntroductoryEmailDialog\', \'Create\');"><span style="font-size:15pt;display:inline-block;">✉</span> Configure "Introductory Email"&nbsp;&nbsp;</span>';
                    html += '&nbsp;&nbsp;&nbsp;&nbsp;';
                    html += '<span xcx="xcx123123-2" class="spanButton" style="border-color:tomato;" onclick="$(\'.bwUnsubscribeUserEmailEditor\').bwUnsubscribeUserEmailEditor(\'displayConfigureUnsubscribeEmailDialog\', \'Create\');"><span style="font-size:15pt;display:inline-block;">✉</span> Configure "Unsubscribe Email"&nbsp;&nbsp;</span>';
                    html += '&nbsp;&nbsp;&nbsp;&nbsp;';
                    html += '<span xcx="xcx123123-3" class="spanButton" style="border-color:tomato;" onclick="$(\'.bwResubscribeUserEmailEditor\').bwResubscribeUserEmailEditor(\'displayConfigureResubscribeEmailDialog\', \'Create\');"><span style="font-size:15pt;display:inline-block;">✉</span> Configure "Resubscribe Email"&nbsp;&nbsp;</span>';

                    html += '<br />';
                    html += '<br />';


                    html += '<br />';
                    html += '<br />';

                    html += '<span style="color:black;font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #262626;font-size: 35pt;font-weight:bold;">';
                    html += '   Global Messaging Settings:';
                    html += '</span>';

                    // sending email
                    html += '<table>';
                    html += '  <tr>';
                    html += '    <td style="text-align:left;vertical-align:middle;white-space:nowrap;vertical-align:top;" class="bwSliderTitleCell">';
                    html += '       Email Enabled:&nbsp;';
                    html += '    </td>';
                    html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
                    html += '       <table>';
                    html += '           <tr>';
                    html += '               <td>';
                    html += '                   <label for="configurationBehaviorTurnOffEmailSlider"></label><input type="checkbox" name="configurationBehaviorTurnOffEmailSlider" id="configurationBehaviorTurnOffEmailSlider" />';
                    html += '               </td>';
                    html += '               <td>';
                    html += '                   &nbsp;&nbsp;';
                    html += '               </td>';
                    html += '               <td>';
                    html += '                   <span id="configurationBehaviorTurnOffEmailSlider_CurrentStatus"></span>';
                    html += '               </td>';
                    html += '               <td>';
                    html += '               </td>';
                    html += '               <td>';
                    html += '                   <span id="configurationBehaviorTurnOffEmailSlider_Description" style="font-size:normal;">[configurationBehaviorTurnOffEmailSlider_Description]</span>';
                    html += '               </td>';
                    html += '           </tr>';
                    html += '       </table>';
                    html += '    </td>';
                    html += '  </tr>';
                    html += '</table>';

                    // sending sms
                    html += '<table>';
                    html += '  <tr>';
                    html += '    <td style="text-align:left;vertical-align:middle;white-space:nowrap;vertical-align:top;" class="bwSliderTitleCell">';
                    html += '       SMS Enabled:&nbsp;';
                    html += '    </td>';
                    html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
                    html += '       <table>';
                    html += '           <tr>';
                    html += '               <td>';
                    html += '                   <label for="configurationBehaviorTurnOffEmailSlider"></label><input type="checkbox" name="configurationBehaviorTurnOffEmailSlider" id="configurationBehaviorTurnOffEmailSlider" />';
                    html += '               </td>';
                    html += '               <td>';
                    html += '                   &nbsp;&nbsp;';
                    html += '               </td>';
                    html += '               <td>';
                    html += '                   <span id="configurationBehaviorTurnOffEmailSlider_CurrentStatus"></span>';
                    html += '               </td>';
                    html += '               <td>';
                    html += '               </td>';
                    html += '               <td>';
                    html += '                   <span id="configurationBehaviorTurnOffEmailSlider_Description" style="font-size:normal;">[configurationBehaviorTurnOffEmailSlider_Description]</span>';
                    html += '               </td>';
                    html += '           </tr>';
                    html += '       </table>';
                    html += '    </td>';
                    html += '  </tr>';
                    html += '</table>';



                    html += '<table>';
                    html += '  <tr>';
                    html += '       <td>';

                    //
                    // Forest Administrator to review emails before sending.
                    //
                    html += '<table>';
                    html += '  <tr>';
                    html += '    <td xcx="xcx243325-1" style="text-align:left;vertical-align:middle;white-space:nowrap;vertical-align:top;" class="bwSliderTitleCell">';
                    html += '       Forest Admin to review emails before sending:&nbsp;';
                    html += '    </td>';
                    html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
                    html += '       <table>';
                    html += '           <tr>';
                    html += '               <td>';
                    html += '                   <label for="configurationBehavior_ForestAdministratorToReviewEmailsBeforeSending_Slider"></label><input type="checkbox" name="configurationBehavior_ForestAdministratorToReviewEmailsBeforeSending_Slider" id="configurationBehavior_ForestAdministratorToReviewEmailsBeforeSending_Slider" />';
                    html += '               </td>';
                    html += '           </tr>';
                    html += '       </table>';
                    html += '    </td>';
                    html += '  </tr>';
                    html += '</table>';

                    html += '       </td>';
                    html += '       <td>';
                    html += '       </td>';
                    html += '       <td>';

                    // Notify Forest Admin to review emails via SMS
                    html += '<table>';
                    html += '  <tr>';
                    html += '    <td style="text-align:left;vertical-align:middle;white-space:nowrap;vertical-align:top;" class="bwSliderTitleCell">';
                    html += '       Notify Forest Admin to review emails via SMS:&nbsp;';
                    html += '    </td>';
                    html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
                    html += '       <table>';
                    html += '           <tr>';
                    html += '               <td>';
                    html += '                   <label for="configurationBehaviorTurnOffEmailSlider"></label><input type="checkbox" name="configurationBehaviorTurnOffEmailSlider" id="configurationBehaviorTurnOffEmailSlider" />';
                    html += '               </td>';
                    html += '               <td>';
                    html += '                   &nbsp;&nbsp;';
                    html += '               </td>';
                    html += '               <td>';
                    html += '                   <span id="configurationBehaviorTurnOffEmailSlider_CurrentStatus"></span>';
                    html += '               </td>';
                    html += '               <td>';
                    html += '               </td>';
                    html += '               <td>';
                    html += '                   <span id="configurationBehaviorTurnOffEmailSlider_Description" style="font-size:normal;">[configurationBehaviorTurnOffEmailSlider_Description]</span>';
                    html += '               </td>';
                    html += '           </tr>';
                    html += '       </table>';
                    html += '    </td>';
                    html += '  </tr>';
                    html += '</table>';

                    html += '       </td>';
                    html += '   </tr>';
                    html += '</table>';





                    html += '<br />';
                    html += '<br />';
                    html += '<br />';
                    html += '<input id="xx" type="checkbox" onchange="xx();" />&nbsp;TODD - SHUT ALL EMAIL DOWN NOW!!!!!!!!!!!!! Even new user/sign-ups introductory emails. [this functionality is incomplete but coming soon]';
                    html += '<br />';

                    html += '<br />';
                    html += '<span style="font-size:xx-large;color:darkgray;">Turn off all SMS (this functionality is incomplete...coming soon.): </span><input id="checkboxNotifyForestAdministratorToReviewEmailsViaSmsxx" type="checkbox" onchange="update_NotifyForestAdministratorToReviewEmailsViaSmsxx();" />';
                    html += '<br />';

                    html += '<br />';
                    html += '<span style="font-size:xx-large;color:darkgray;">Forest Admin to review emails before sending xcx243325-2: </span>';

                    html += '<input id="checkboxForestAdministratorToReviewEmailsBeforeSending" type="checkbox" onchange="update_ForestAdministratorToReviewEmailsBeforeSending();" />&nbsp;<< UNCHECK THIS CHECKBOX TO ENABLE IMMEDIATE SENDING OF INTRODUCTORY/NEW-USER EMAIL. NOTE that if the workflow timers are running, this will send pending emails if the BwWorkflowApp has email turned on.';
                    html += '<br />';

                    html += '<br />';
                    html += '<span style="font-size:xx-large;color:darkgray;">Notify Forest Admin to review emails via SMS: </span><input id="checkboxNotifyForestAdministratorToReviewEmailsViaSms" type="checkbox" onchange="update_NotifyForestAdministratorToReviewEmailsViaSms();" />';
                    html += '<br />';





                    html += '<br /><br />';

                    html += '<br />';

                    html += '<div id="divBwChecklistsEditor_Admin"></div>';

                    $('#divPageContent1').html(html);

                    var $bwNewUserEmailEditor = $('#divBwNewUserEmailEditor').bwNewUserEmailEditor(options);

                    var $bwUnsubscribeUserEmailEditor = $('#divBwUnsubscribeUserEmailEditor').bwUnsubscribeUserEmailEditor({});
                    var $bwResubscribeUserEmailEditor = $('#divBwResubscribeUserEmailEditor').bwResubscribeUserEmailEditor({});

                    var $xx34234 = $('#divBwChecklistsEditor_Admin').bwChecklistsEditor_Admin({});


                    // Hook up the switchbutton "configurationBehavior_ForestAdministratorToReviewEmailsBeforeSending_Slider".
                    var ForestAdministratorToReviewEmailsBeforeSending_Options = {
                        checked: null, //requireStartEndDates,
                        show_labels: true,         // Should we show the on and off labels?
                        labels_placement: "left",  // Position of the labels: "both", "left" or "right"
                        on_label: "YES",            // Text to be displayed when checked
                        off_label: "NO",          // Text to be displayed when unchecked
                        width: 50,                 // Width of the button in pixels
                        height: 22,                // Height of the button in pixels
                        button_width: 24,         // Width of the sliding part in pixels
                        clear_after: null         // Override the element after which the clearing div should be inserted
                    };
                    $("input#configurationBehavior_ForestAdministratorToReviewEmailsBeforeSending_Slider").switchButton(ForestAdministratorToReviewEmailsBeforeSending_Options);

                    $.ajax({
                        url: this.options.operationUriPrefix + "_bw/getstatusofForestAdministratorToReviewEmailsBeforeSending",
                        type: "GET",
                        contentType: 'application/json',
                        success: function (results) {
                            try {

                                if (results.status != 'SUCCESS') {

                                    var msg = 'Error in bwActiveMenu_Admin.js.RenderContentForButton(GLOBAL_SETTINGS). ' +results.message;
                                    console.log(msg);
                                    displayAlertDialog(msg);

                                } else {
                                    //alert('xcx23123424 results: ' + JSON.stringify(results.results));

                                    if (results.results.ForestAdministratorToReviewEmailsBeforeSending == true) {

                                        //alert('xcx2334 Set checkbox to true/checked.');

                                        // Set checkbox to true/checked. // checkboxForestAdministratorToReviewEmailsBeforeSending
                                        if (document.getElementById('configurationBehavior_ForestAdministratorToReviewEmailsBeforeSending_Slider')) {
                                            //document.getElementById('configurationBehavior_ForestAdministratorToReviewEmailsBeforeSending_Slider').setAttribute('checked', 'checked');
                                            $("input#configurationBehavior_ForestAdministratorToReviewEmailsBeforeSending_Slider").switchButton({ 'checked': true });
                                        }

                                    } else {

                                        //alert('xcx2334 Set checkbox to false/unchecked.');
                                        // Set checkbox to false/unchecked.
                                        if (document.getElementById('configurationBehavior_ForestAdministratorToReviewEmailsBeforeSending_Slider')) {
                                            //document.getElementById('configurationBehavior_ForestAdministratorToReviewEmailsBeforeSending_Slider').removeAttribute('checked', '');
                                            $("input#configurationBehavior_ForestAdministratorToReviewEmailsBeforeSending_Slider").switchButton({
                                                'checked': false
                                            });
                                        }

                                    }

                                    // Then we hook up the event.
                                    $('#configurationBehavior_ForestAdministratorToReviewEmailsBeforeSending_Slider').change(function () {
                                        console.log('In configurationBehavior_ForestAdministratorToReviewEmailsBeforeSending_Slider.change(GLOBAL_SETTINGS). xcx21342342314.');

                                        thiz.update_ForestAdministratorToReviewEmailsBeforeSending();

                                    });

                                }

                                //if (data && data[0] && data[0].NotifyForestAdministratorToReviewEmailsViaSms && data[0].NotifyForestAdministratorToReviewEmailsViaSms == true) {
                                //    // Set checkbox to true/checked. // checkboxForestAdministratorToReviewEmailsBeforeSending
                                //    if (document.getElementById('checkboxNotifyForestAdministratorToReviewEmailsViaSms')) {
                                //        document.getElementById('checkboxNotifyForestAdministratorToReviewEmailsViaSms').setAttribute('checked', 'checked');
                                //    }
                                //} else {
                                //    // Set checkbox to false/unchecked.
                                //    if (document.getElementById('checkboxNotifyForestAdministratorToReviewEmailsViaSms')) {
                                //        document.getElementById('checkboxNotifyForestAdministratorToReviewEmailsViaSms').removeAttribute('checked', '');
                                //    }
                                //}

                            } catch (e) {
                                console.log('Exception in bwActiveMenu_Admin.js.RenderContentForButton(GLOBAL_SETTINGS): ' + e.message + ', ' + e.stack);
                                displayAlertDialog('Exception in bwActiveMenu_Admin.js.RenderContentForButton(GLOBAL_SETTINGS): ' + e.message + ', ' + e.stack);
                            }
                        },
                        error: function (data, errorCode, errorMessage) {
                            console.log('Error in bwActiveMenu_Admin.js.RenderContentForButton(GLOBAL_SETTINGS):' + errorCode + ', ' + errorMessage);
                            displayAlertDialog('Error in bwActiveMenu_Admin.js.RenderContentForButton(GLOBAL_SETTINGS):' + errorCode + ', ' + errorMessage);
                        }
                    });

                    break;

                case 'SPECIAL_TASKS':
                    this.unshrinkLeftMenu();

                    $('#divPageContent1').html('');


                    var html = '';

                    html += '<table>';
                    html += '<tr>';
                    html += '     <td style="text-align:left;vertical-align:top;" class="bwSliderTitleCell">';
                    html += '         <span style="font-size:12pt;white-space:normal;color:red;font-weight:bold;">';
                    html += '             Log in as "Tenant/Organization Owner":&nbsp;';
                    html += '         </span>';
                    html += '         <br />';
                    html += '         <br />';
                    html += '         <!--<span style="font-size:12pt;white-space:normal;color:green;">This is what the new user will experience after creating their account or accepting an invitation...</span>-->';
                    html += '     </td>';

                    html += '     <td class="bwChartCalculatorLightCurrencyTableCell" style="vertical-align:top;">';
                    html += '         <table>';
                    html += '             <tr>';
                    html += '                 <td>';
                    html += '                     <span id="xx" style="font-weight:bold;color:#009933;vertical-align:middle;"></span>';




                    html += '                     <span id="spanLogInAsTenantOrganizationOwnerDropDown" style="font-family: \'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;color: #3f3f3f;font-size: 22pt;font-weight:bold;vertical-align:top;">spanLogInAsTenantOrganizationOwnerDropDown</span>';
                    html += '                     &nbsp;&nbsp;';
                    html += '                     <span class="spanButton" onclick="$(\'.bwAuthentication\').bwAuthentication(\'logInAsTenantOrganizationOwner\', \'spanLogInAsTenantOrganizationOwnerDropDown\');"><span style="font-size:15pt;display:inline-block;">✉</span> Log In&nbsp;&nbsp;</span>';



                    html += '                     <!--<button class="BwSmallButton" onclick="alert(\'This functionality is incomplete. Coming soon!\');">Deploy</button>-->';

                    html += '                 </td>';
                    html += '             </tr>';
                    html += '         </table>';
                    html += '     </td>';
                    html += ' </tr>';


                    html += ' </table>';
                    html += '<br /><br />';




                    html += '<hr />';
                    html += 'Delete the User and Tenant owned by:';
                    html += '<span id="spanAdminTenantSelectListForDeleteDropDown"></span>&nbsp;&nbsp;<input type="button" value="Delete" onclick="cmdAdminDeleteSelectedTenant();" />&nbsp;<i>Everything goes into the TrashBin (TrashBin gets sent to true).</i>';
                    html += '<hr />';
                    html += '<br /><br />';


                    html += '<hr />';
                    html += 'PERMANENTLY Delete/Deregister the User and Tenant owned by:';
                    html += '<span id="spanAdminTenantSelectListForPermanentlyDeleteDropDown"></span>&nbsp;&nbsp;<input type="button" value="Delete" onclick="cmdAdminPermanentlyDeleteSelectedTenant();" />&nbsp;<i>Everything GETS PERMANENTLY DELETED.</i>';
                    html += '<hr />';
                    html += '<br /><br />';




                    html += '<br /><br />';
                    html += '[Add functionality here to allow the admin to delete a specific request... multiples also in case this ever happens.... it should never happen. dev: admin/forcedeleterequest]';







                    html += '<br /><br />';
                    html += '<div id="divBwStripePurchases"></div>';


                    html += '<br /><br />';
                    html += '<div id="divBwIncomingEmail"></div>';


                    $('#divPageContent1').html(html);

                    $('#divBwStripePurchases').bwStripePurchases({});

                    populateTheTenantToDeleteDropDown();

                    populateTheTenantToPermanentlyDeleteDropDown();


                    $.ajax({
                        url: "https://" + globalUrl + "/" + "_bw/bwtenantsfindall",
                        type: "POST",
                        contentType: 'application/json',
                        success: function (tenants) {
                            $.ajax({
                                url: "https://" + globalUrl + "/" + "_bw/bwworkflowapps",
                                type: "POST",
                                contentType: 'application/json',
                                success: function (workflowApps) {

                                    var html = '';
                                    html += '<select id="selectChangeUserRoleDialogOrganizationOwnerDropDown3" style="vertical-align:top;padding:5px 5px 5px 5px;">';
                                    html += '<option value="" >Select a Tenant/Organization...</option>'; // data[i].bwWorkflows: [{ id: String, title: String, url: String }],
                                    for (var i = 0; i < tenants.length; i++) {
                                        for (var w = 0; w < workflowApps.length; w++) {
                                            if (tenants[i].bwTenantId == workflowApps[w].bwTenantId) {
                                                //html += '<option value="' + workflowApps[w].bwTenantId + '|' + workflowApps[w].bwWorkflowAppTitle + '" >' + workflowApps[w].bwWorkflowAppTitle + ': ' + tenants[i].bwTenantOwnerFriendlyName + ' (' + tenants[i].bwTenantOwnerEmail + ')</option>'; // data[i].bwWorkflows: [{ id: String, title: String, url: String }],
                                                html += '<option value="' + workflowApps[w].bwTenantId + '|' + workflowApps[w].bwWorkflowAppId + '" >' + workflowApps[w].bwWorkflowAppTitle + ': ' + tenants[i].bwTenantOwnerFriendlyName + ' (' + tenants[i].bwTenantOwnerEmail + ')</option>'; // data[i].bwWorkflows: [{ id: String, title: String, url: String }],
                                            }
                                        }
                                    }
                                    html += '</select>';
                                    document.getElementById('spanLogInAsTenantOrganizationOwnerDropDown').innerHTML = html;

                                },
                                error: function (data, errorCode, errorMessage) {
                                    displayAlertDialog('Error in bwBackendAdministrationForAllParticipants.addThisUserToAnOrganization.bwworkflowapps():' + errorCode + ', ' + errorMessage);
                                }
                            });

                        },
                        error: function (data, errorCode, errorMessage) {
                            displayAlertDialog('Error in bwBackendAdministrationForAllParticipants.addThisUserToAnOrganization.bwtenantsfindall():' + errorCode + ', ' + errorMessage);
                        }
                    });






                    //html += '<div id="divBwLibreJs"></div>';






                    $('#divBwIncomingEmail').html(html);




                    //$('#divBwLibreJs').bwLibreJs({}); // Instantiate the widget. 12-18-2023.







                    
                    break;

                case 'PUBLISH_CODE':

                    this.unshrinkLeftMenu();

                    $('#divPageContent1').html('');

                    var html = '';
                    html += `CAN I EDIT AND PUBLISH CODE FROM HERE? THIS WOULD MAKE DEVELOPMENT AMAZING. MAYBE A HTTPS CONNECTION THAT CAN BE UTILIZED BY VISUAL STUDIO....???
                        <BR />
                        <ul>
                            <li>Edit client code - Open this link in visual studio as a web project: <span style="color:tomato;">https://shareandcollaborate.com/_tfs/budgetworkflow.com/client</span></li>
                            <li>Edit webservices code - Open this link in visual studio as a web project: <span style="color:tomato;">https://shareandcollaborate.com/_tfs/budgetworkflow.com/webservices</span></li>
                            <li>Edit fileservices code - Open this link in visual studio as a web project: <span style="color:tomato;">https://shareandcollaborate.com/_tfs/budgetworkflow.com/fileservices</span></li>
                        </ul>
                        <br />
                        <button class="BwSmallButton" onclick="alert('This functionality is incomplete. Coming soon! xcx123134499685-1.');">Click to Backup and Replace the Development code with the current production code</button>
                        <br /><br />
                        <button class="BwSmallButton" onclick="alert('This functionality is incomplete. Coming soon! xcx123134499685-2.');">Click to Backup and Replace the Production code with the current development code</button>
                        <br /><br />
                        <button class="BwSmallButton" onclick="alert('This functionality is incomplete. Coming soon! xcx123134499685-3.');">Click to Restart PM2 (on all servers)</button>
                        <br /><br /> <br /><br />
                    `;

                    //html += '<div id="divBwLibreJs"></div>';
                    html += '<div id="divBwCodeEditor"></div>';

                    $('#divPageContent1').html(html);

                    //$('#divBwLibreJs').bwLibreJs({}); // Instantiate the widget. 12-18-2023.
                    $('#divBwCodeEditor').bwCodeEditor({}); // Instantiate the widget. 12-18-2023.

                    break;

                case 'ALL_REQUESTS':


                    //alert('In my3.js.$(\'.bwActiveMenu_Admin\').bwActiveMenu_Admin(\'RenderContentForButton\', "ALL_REQUESTS") xcx23367.');
                    //debugger;
                    this.unshrinkLeftMenu();

                    var html = '';
                    html += '<div id="spanBwBudgetRequests"></div>';
                    $('#divPageContent1').html(html);

                    $('#spanBwBudgetRequests').bwDataGrid({}); // This creates the new instance.

                    //if ($('#spanBwBudgetRequests').bwDataGrid()) {
                    //    //debugger;
                    //    $('#spanBwBudgetRequests').bwDataGrid('displayAllRequests');
                    //} else {
                    //    //debugger;
                    //    var dataGridOptions = {};
                    //    var $datagrid = $('#spanBwBudgetRequests').bwDataGrid(dataGridOptions);

                    //    $('#spanBwBudgetRequests').bwDataGrid('displayAllRequests');
                    //}
                    //$('.bwDataGrid').bwDataGrid('displayAllRequests', ''); //'budgetrequest'); //'divPageContent1');

                    break;


                case 'TRACK_SPENDING':
                    //renderTrackSpending();

                    this.unshrinkLeftMenu();

                    $('#bwQuickLaunchMenuTd').css({
                        width: '0'
                    }); // This gets rid of the jumping around.

                    try {
                        $('#FormsEditorToolbox').dialog('close');
                    } catch (e) { }

                    //$('#liWelcome').hide();
                    //$('#liNewRequest').hide();
                    //$('#liHelp').hide();
                    //$('#liArchive').hide();
                    //$('#liConfiguration').hide();
                    //$('#liSummaryReport').hide();
                    //$('#liVisualizations').show();
                    //var e1 = document.getElementById('divSummaryReportMasterDiv');
                    //e1.style.borderRadius = '20px 0 0 20px';

                    var canvas = document.getElementById("myCanvas");
                    if (canvas) {
                        var ctx = canvas.getContext("2d");
                        ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas of it's lines
                        canvas.style.zIndex = -1;
                    }

                    //renderLeftButtons('divVisualizationsPageLeftButtons');

                    //$('#divFunctionalAreasMasterDiv').empty(); // Clear the div and rebuild it with out new 'Departments' title.
                    //$('#divFunctionalAreasMasterSubMenuDiv').hide(); //This si the top bar which we want to hide in this case.

                    //var html = '';
                    //html += '<table style="border-width: 0px; margin: 0px; padding: 0px; width: 100%;"><tbody><tr style="border-width: 0px; margin: 0px; padding: 0px;"><td style="border-width: 0px; margin: 0px; padding: 0px;">';
                    //html += 'Workflow: <span style="font-weight:bold;color:#95b1d3;">Configure your workflow and email for this organization...</span>';
                    //html += '</td></tr></tbody></table>';
                    //$('#divFunctionalAreasMasterDiv').html(html);
                    ////
                    ////disableDepartmentsButton();
                    //disableRaciSettingsButton();
                    //$('#divFunctionalAreasSubSubMenus').empty();


                    //var html = '';
                    //html += '<div id="divWorkflowEditor"></div>';
                    //$('#divFunctionalAreasSubSubMenus').html(html);
                    ////
                    //// Render the workflow editor.
                    ////

                    //$('#divBwVisualizations').bwTrackSpending();


                    //shrinkLeftMenuBar();

                    //debugger; //-THISNEEDSTOBECHANGED // This is the "Workflow Editor". >> RENAME TO: renderConfigurationWorkflow();
                    console.log('debugger; //-THISNEEDSTOBECHANGED // This is the "Workflow Editor". >> RENAME TO: renderConfigurationWorkflow();');

                    try {
                        $('#divPageContent1').bwTrackSpending('renderTrackSpending');
                    } catch (e) {
                        var options = {};
                        var $bwvisualizations = $("#divPageContent1").bwTrackSpending(options);
                    }



                    break;
                case 'CONFIGURATION':

                    // Prevent this code being executed when the configuration button is already selected.
                    //debugger;
                    if (document.getElementById('divConfigurationButton').className.indexOf('_SelectedButton') > -1) { // 2-2-2022
                        // This means the configuration button is already selected. Do nothing.
                        resetThePageAndButtons = false;
                    } else {

                        //populateStartPageItem('divConfiguration', 'Reports', '');

                        this.displayConfiguration();

                        //unshrinkLeftMenu();
                        //$('.bwActiveMenu_Admin').bwActiveMenu_Admin('shrinkLeftMenuBar');
                        this.shrinkLeftMenuBar();

                        //Personal / Behavior
                        //divWelcomePageLeftButtonsConfigurationButton
                        //populateStartPageItem('divConfiguration', 'Reports', '');

                        $('#bwQuickLaunchMenuTd').css({
                            width: '0'
                        }); // This gets rid of the jumping around.

                        try {
                            $('#FormsEditorToolbox').dialog('close');
                        } catch (e) { }

                        //generateConfigurationLeftSideMenu();
                        //renderLeftButtons('divConfigurationPageLeftButtons');




                        $('.bwAuthentication').bwAuthentication('securityTrimTheLeftMenuButtons_ConfigurationSection');

                        ////if (selectedWorkflowAppRole == 'participant') {
                        //    // 9-7-2021: TURN OFF ALL BUTTONS IN INNER LEFT MENU, EXCEPT PERSONAL/BAHAVIOR
                        //debugger;

                        //// selectedOrganization.OrganizationRole
                        //var buttons = $('#tableMainMenu3').find('.leftButton');
                        //    $(buttons).each(function (index, value) {
                        //        if ($(buttons[index]).html().indexOf('PERSONAL/BEHAVIOR') > -1) {
                        //            // Do nothing, we always want to display this button.
                        //        } else {
                        //            $(buttons[index]).removeClass('leftButton');
                        //        }
                        //    });
                        ////}






                        $('#divPageContent2_Title').html('PERSONAL SETTINGS');
                        renderConfigurationPersonalBehavior();
                    }
                    break;

                case 'USER':
                    //cmdDisplayLoggedInUserDetailsInDropDown('spanLoggedInUser');

                    //$('#spanLoggedInUserDropDownDialogTitle').html(participantFriendlyName);
                    $('.bwAuthentication').bwAuthentication('displayLoggedInUserDropDownInACircle', true);

                    resetThePageAndButtons = false;
                    break;
                case 'PRINT':
                    $('#divBwPrintButton').bwPrintButton('PrintMyPendingTasksReport');
                    break;
                case 'REPORT_AN_ERROR':
                    $('.bwCoreComponent').bwCoreComponent('reportAnErrorOrMakeASuggestion');
                    break;
                case 'VIEW_MOBILE_VERSION':
                    $('.bwAuthentication').bwAuthentication('logonWith_BudgetWorkflow_SwitchToMobileVersion');
                    break;
                case 'TILE_AND_BALLOON_WINDOWS':
                    $('.bwCoreComponent').bwCoreComponent('tileTheDialogs');
                    break;
                case 'FOREST_ADMIN':
                    window.location.href = 'https://budgetworkflow.com/admin2.html';
                    break;
                case 'LIVE_STATUS':
                    window.location.href = 'https://budgetworkflow.com/livestatus.html';
                    break;
                case 'DONATE':
                    $('.bwDonate').bwDonate('displayDonationDialog');
                    break;
                case 'HOME_UNAUTHENTICATED':

                    //alert('In bwActiveMenu_Admin.js.RenderContentForButton(HOME_UNAUTHENTICATED). xcx1231242 calling renderHomePageContent().');
                    console.log('In bwActiveMenu_Admin.js.RenderContentForButton(HOME_UNAUTHENTICATED). Calling bwActiveMenu_Admin.js.renderHomePageContent().');

                    this.renderHomePageContent();
                    this.unshrinkLeftMenu();
                    //$('#bwQuickLaunchMenuTd').css({
                    //    width: '0'
                    //}); // This gets rid of the jumping around.
                    //$('#divBwAuthentication').bwAuthentication('getRemainingParticipantDetailsAndWorkflowAppTitle');




                    //alert('In bwActiveMenu_Admin.js.xx(). Instantiating bwHowDoesItWorkCarousel widget using element divBwHowDoesItWorkCarousel.');




                    break;

                case 'FEATURES':

                    if (document.getElementById('divWalkthroughButton').className.indexOf('_SelectedButton') > -1) { // Prevent this code being executed when the configuration button is already selected.
                        // This means the configuration button is already selected. Do nothing.
                        resetThePageAndButtons = false;
                    } else {
                        this.displayConfiguration();
                        //$('.bwActiveMenu_Admin').bwActiveMenu_Admin('shrinkLeftMenuBar');
                        this.shrinkLeftMenuBar();
                        //$('#bwQuickLaunchMenuTd').css({
                        //    width: '0'
                        //}); // This gets rid of the jumping around.
                        //$('.bwAuthentication').bwAuthentication('securityTrimTheLeftMenuButtons_ConfigurationSection');
                        $('#divPageContent2_Title').html('WALKTHROUGH *beta');
                        renderConfigurationPersonalBehavior();
                    }
                    break;
                case 'SLIDES':
                    if (document.getElementById('divSlidesButton').className.indexOf('_SelectedButton') > -1) { // Prevent this code being executed when the configuration button is already selected.
                        // This means the configuration button is already selected. Do nothing.
                        resetThePageAndButtons = false;
                    } else {

                        //this.displaySlides();

                        //this.shrinkLeftMenuBar(); // Not sure, we may want to do this just to get more screen space.

                        $('#divPageContent2_Title').html('SLIDES');
                        //renderConfigurationPersonalBehavior();

                        // Set the "Personal/Behavior" left menu button as selected. We have to do this because this is the default that appears when the Configuration button is selected.
                        //var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');
                        //var workflowAppTheme_SelectedButton = workflowAppTheme + '_SelectedButton';
                        //$('#divInnerLeftMenuButton_PersonalBehavior').addClass(workflowAppTheme_SelectedButton).removeClass(workflowAppTheme);

                        document.getElementById('divPageContent1').innerHTML = '';


                        //displayHowDoesItWorkDialog
                        $('.bwHowDoesItWorkCarousel').bwHowDoesItWorkCarousel('displayHowDoesItWorkScreen');

                        this.unshrinkLeftMenu();








                    }
                    break;

                case 'CONTACT':
                    if (document.getElementById('divContactButton').className.indexOf('_SelectedButton') > -1) { // Prevent this code being executed when the configuration button is already selected.
                        // This means the configuration button is already selected. Do nothing.
                        resetThePageAndButtons = false;
                    } else {

                        //this.displaySlides();

                        //this.shrinkLeftMenuBar(); // Not sure, we may want to do this just to get more screen space.

                        $('#divPageContent2_Title').html('CONTACT');
                        //renderConfigurationPersonalBehavior();

                        // Set the "Personal/Behavior" left menu button as selected. We have to do this because this is the default that appears when the Configuration button is selected.
                        //var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');
                        //var workflowAppTheme_SelectedButton = workflowAppTheme + '_SelectedButton';
                        //$('#divInnerLeftMenuButton_PersonalBehavior').addClass(workflowAppTheme_SelectedButton).removeClass(workflowAppTheme);

                        document.getElementById('divPageContent1').innerHTML = '';

                        var html = '';

                        //html += '<span style="padding-left:1px;color:darkorange;font-weight:normal;vertical-align:top;">';
                        //html += '   Welcome to the August 1, 2022 version of this software.'; // Log in, try it out, invite your colleagues and customers.';
                        //html += '</span>';
                        //html += '<br />';






                        //html += '   <span style="font-family:\'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;font-size:50pt;">';
                        //html += '       Share and collaborate in a new and easier way.';
                        //html += '       <br />';
                        //html += '       Simplify your business forms, workflow, and inventory.';
                        //html += '   </span>'; 
                        html += '   <br /><br /><br />';



                        html += '<table>';


                        html += '<tr>';
                        html += '<td>';
                        //html += '<img src="todd2020-2.png" style="float:left;width:219px;padding:0 10px 5px 0;" alt="" />';
                        html += '<span class="spanAboutUsText" style="font-size:20pt;font-weight:normal;font-family:\'Segoe UI Light\',\'Segoe UI\',\'Segoe\',Tahoma,Helvetica,Arial,sans-serif;" >';
                        html += 'Hi! My name is Todd Hiltz, and I have created this software so that everyone can have their own budget request system.';
                        html += '<br /><br />';
                        html += 'Budget Request systems have traditionally been poorly implemented, expensive, and only available to large corporations and governments. They are a lot more complicated than you might think.';
                        html += '<br /><br />';
                        html += 'I have spent many years developing financial systems. This software is the result of many thousands of hours of research and development.';
                        html += '<br /><br />';
                        html += 'I am headquartered in the beautiful Annapolis Valley, Nova Scotia, Canada.';
                        html += '<br /><br />';
                        //html += '<u>Contact</u>';
                        //html += '<br /><br />';
                        //html += 'mail: Todd Hiltz, 61 Crescent Avenue, Kentville, Nova Scotia, Canada B4N 1R1';
                        //html += '<br />';
                        //html += 'tel/text: 902-385-1968';
                        //html += '<br />';
                        html += 'Contact me at todd@budgetworkflow.com. I want to make sure everyone gets the most out of this software!';
                        html += '<br /><br />';
                        html += 'You can start using it right now, just log in and invite whomever you wish.';
                        html += '<br />';
                        //html += 'twitter: @budgetworkflow (<a href="https://twitter.com/budgetworkflow">https://twitter.com/budgetworkflow</a>)';
                        //html += '<br />';
                        //html += 'youtube: <a href="https://www.youtube.com/channel/UCrSjwzcBA-9zVhvFdnuhRFg">budgetworkflow.com</a>';
                        //html += '<br />';
                        //html += 'facebook: http://facebook.com/budgetworkflow';
                        //html += '<br />';
                        //html += 'linkedin: http://www.linkedin.com/company/budgetworkflow-com';
                        html += '<br /><br />';
                        html += '</span>';
                        html += '</td>';
                        html += '</tr>   ';

                        html += '</table>';

                        html += '       <br />';
                        // <span style="padding-left:1px;color:darkorange;font-weight:normal;vertical-align:top;">   Welcome to the December 1, 2022 version of this software.</span>
                        html += '       <span style="font-size:15pt;padding-left:1px;color:goldenrod;font-weight:normal;vertical-align:top;"><span style="font-size:20pt;">This project is open source.</span> Sign Up, try it out, and email me to get approved for the source code. Generally approved for "Not For Resale" use, and some additional conditions may apply. Contact me at todd@budgetworkflow.com. On Twitter @budgetworkflow.</span>';
                        html += '       <br />';


                        document.getElementById('divPageContent1').innerHTML = html;

                        this.unshrinkLeftMenu();

                    }
                    break;

                    //case 'USE_CASES':

                    //    if (document.getElementById('divConfigurationButton').className.indexOf('_SelectedButton') > -1) { // Prevent this code being executed when the configuration button is already selected.
                    //        // This means the configuration button is already selected. Do nothing.
                    //        resetThePageAndButtons = false;
                    //    } else {
                    //        displayConfiguration();
                    //        $('.bwActiveMenu_Admin').bwActiveMenu_Admin('shrinkLeftMenuBar');
                    //        //$('#bwQuickLaunchMenuTd').css({
                    //        //    width: '0'
                    //        //}); // This gets rid of the jumping around.
                    //        //$('.bwAuthentication').bwAuthentication('securityTrimTheLeftMenuButtons_ConfigurationSection');
                    //        $('#divPageContent2_Title').html('USE CASES');
                    //        renderConfigurationPersonalBehavior();
                    //    }
                    //    break;

            }

            if (resetThePageAndButtons == true) {
                if ((button != 'USER') && (button != 'REPORT_AN_ERROR')) { // We don't want this button to be selected, since just the circle dialog will display. 

                    //$('#divPageContent2_Title').html(''); // Clear the title in the 2nd top menu bar. // removed 2-2-2022

                    //
                    // Ensure the correct left menu button is selected. We do this with the theme_SelectedButton classes. For example: brushedAluminum_green_SelectedButton
                    //
                    var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');
                    if (!workflowAppTheme) { // Need to do this for the home page when not logged in.
                        workflowAppTheme = 'brushedAluminum_admin';
                    }
                    var workflowAppTheme_SelectedButton = workflowAppTheme + '_SelectedButton';

                    // Step 1: Make all of the buttons un-selected.
                    $('#tdLeftSideMenu').find('.' + workflowAppTheme_SelectedButton).each(function (index, value) {
                        $(this).addClass(workflowAppTheme).removeClass(workflowAppTheme_SelectedButton);
                    });

                    // Step 2: Set the specified button as the selected one.
                    //console.log('In bwActiveMenu_Admin.js.RenderContentForButton(). Step 2: Set the specified button as the selected one.');
                    //debugger;
                    if (element && element == 'NEW_REQUEST_FORM_CANCEL_BUTTON') {
                        // Do nothing.
                    } else if (element == 'HOME_UNAUTHENTICATED_BUTTON') {
                        // This is the SLIDES button that is displayed before the user logs in.
                        var x = $('#divWelcomeButton').hasClass('leftButton');
                        if (x == true) {
                            //debugger;
                            $('#divWelcomeButton').addClass(workflowAppTheme_SelectedButton).removeClass(workflowAppTheme);
                        } else {
                            console.log('In $(\'.bwActiveMenu_Admin\').bwActiveMenu_Admin(\'RenderContentForButton\', ). Error: Unable to locate class leftButton. xcx1-3.');
                            alert('In $(\'.bwActiveMenu_Admin\').bwActiveMenu_Admin(\'RenderContentForButton\', ). Error: Unable to locate class leftButton. xcx1-3');
                        }

                    } else if (element == 'SLIDES_BUTTON') {
                        // This is the SLIDES button that is displayed before the user logs in.
                        var x = $('#divSlidesButton').hasClass('leftButton');
                        if (x == true) {
                            //debugger;
                            $('#divSlidesButton').addClass(workflowAppTheme_SelectedButton).removeClass(workflowAppTheme);
                        } else {
                            console.log('In $(\'.bwActiveMenu_Admin\').bwActiveMenu_Admin(\'RenderContentForButton\', ). Error: Unable to locate class leftButton. xcx1-2.');
                            alert('In $(\'.bwActiveMenu_Admin\').bwActiveMenu_Admin(\'RenderContentForButton\', ). Error: Unable to locate class leftButton. xcx1-2');
                        }

                    } else {
                        var x = $(element).hasClass('leftButton');
                        if (x == true) {
                            //debugger;
                            $(element).addClass(workflowAppTheme_SelectedButton).removeClass(workflowAppTheme);
                        } else {
                            console.log('In $(\'.bwActiveMenu_Admin\').bwActiveMenu_Admin(\'RenderContentForButton\', ). Error: Unable to locate class leftButton. xcx1.');
                            alert('In $(\'.bwActiveMenu_Admin\').bwActiveMenu_Admin(\'RenderContentForButton\', ). Error: Unable to locate class leftButton. xcx1');
                        }
                    }
                }
            }

        } catch (e) {
            console.log('Exception in bwActiveMenu_Admin.js.RenderContentForButton(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwActiveMenu_Admin.js.RenderContentForButton(): ' + e.message + ', ' + e.stack);
        }
    },
    displayConfiguration: function () {
        try {
            var html = '';
            html += '<table id="tableMainMenu3" style="margin-left:-25px;width:100%;border-collapse: collapse;">';
            html += document.getElementById('tableMainMenu2').innerHTML;
            html += '</table>';

            //document.getElementById('divPageContent1').style.paddingLeft = '30px';
            document.getElementById('divPageContent1').style.paddingLeft = '10px';

            this.shrinkLeftMenu();

            ////
            //// This positions the inner menus and content. Doesn't work on iOS. <<<<<<<<<<<<
            ////
            //var leftSideMenu_BoundingClientRect = document.getElementById('tdLeftSideMenu').getBoundingClientRect();
            //var divTopBar_Long_BoundingClientRect = document.getElementById('divTopBar_Long').getBoundingClientRect();
            //var top = divTopBar_Long_BoundingClientRect.bottom;
            //var left = leftSideMenu_BoundingClientRect.right; // 1st time: 259   // 2nd time: 104


            //top = top + 5;
            //left = left - 155;
            //console.log('In displayConfiguration(). top: ' + top + ', left: ' + left);
            //debugger;
            //document.getElementById('divPageContent1').style.position = 'absolute';
            //document.getElementById('divPageContent1').style.top = top + 'px';
            //document.getElementById('divPageContent1').style.left = left + 'px';




            document.getElementById('divPageContent1').innerHTML = html;

            // shrink left menu
            document.getElementById('divLeftMenuHeader').style.width = '100px';
            var cusid_ele = document.getElementsByClassName('leftButtonText');
            for (var i = 0; i < cusid_ele.length; ++i) {
                var item = cusid_ele[i];
                item.style.fontSize = '8pt';
            }



            // removed 12-13-2021
            //if (!(document.getElementById('tableMainMenu3'))) {
            //    console.log('In displayConfiguration(). Element tableMainMenu3 does not exist.');
            //} else {
            //    // zindex for the white overlay fix.
            //    console.log('>>In displayConfiguration(). Why are we getting z-index for element tableMainMenu3?');

            //    var zindex = document.getElementById('tableMainMenu3').style.zIndex; //getZIndex(document.getElementById('tableMainMenu3'));
            //    var zindex2 = document.getElementById('divInnerRoundWithWhiteOverlay').style.zIndex; // getZIndex(document.getElementById('divInnerRoundWithWhiteOverlay'));
            //    console.log('In displayConfiguration(). What is element tableMainMenu3? zindex: ' + zindex + ', zindex2:' + zindex2 + '.');

            //    document.getElementById('tableMainMenu3').style.zIndex = 100;
            //}

            console.log('Setting z-index for element "tableMainMenu3". Why are we doing this?');
            document.getElementById('tableMainMenu3').style.zIndex = 100;

        } catch (e) {
            console.log('Exception in displayConfiguration(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in displayConfiguration(): ' + e.message + ', ' + e.stack);
        }
    },


    RenderContentForInnerLeftMenuButtons: function (element, button) {
        try {
            console.log('In bwActiveMenu_Admin.js.RenderContentForInnerLeftMenuButtons(). button: ' + button);
            var thiz = this;

            var participantId = $('.bwAuthentication').bwAuthentication('option', 'participantId');

            $('canvas').remove('.canvasBwBusinessModelEditor'); // Clear the business model editor canvas.

            window.scrollTo(0, 0); // Scroll to top on button click. This makes sure things render Ok, and also just seems like a nicer user experience.
            //$('.bwActiveMenu').bwActiveMenu('adjustLeftSideMenu'); // This makes sure our new stretchy-left-menu redraws Ok.
            this.adjustLeftSideMenu(); // This makes sure our new stretchy-left-menu redraws Ok.

            $('#divPageContent2_Title').html('');





            // THIS IS THE SECOND TIME WE ARE USING setTimeout for the call to bwActiveMenu_Admin.adjustLeftSideMenu(). 4-25-2022
            setTimeout(function () { // Only needs to happen for Chrome.
                // menu should be re-done since the display has probably resized from the display of the email.
                //alert('Calling bwActiveMenu_Admin.adjustLeftSideMenu().');
                $('.bwActiveMenu_Admin').bwActiveMenu_Admin('adjustLeftSideMenu');
            }, 1000);





            //
            // Ensure the correct left menu button is selected. We do this with the them_SelectedButton classes. For example: brushedAluminum_green_SelectedButton
            //
            var workflowAppTheme = $('.bwAuthentication').bwAuthentication('option', 'workflowAppTheme');
            var workflowAppTheme_SelectedButton = workflowAppTheme + '_SelectedButton';

            // Step 1: Make all of the buttons un-selected.
            $('#tableMainMenu3').find('.' + workflowAppTheme_SelectedButton).each(function (index, value) {
                $(this).addClass(workflowAppTheme).removeClass(workflowAppTheme_SelectedButton);
            });

            // Step 2: Set the specified button as the selected one.
            var x = $(element).hasClass('leftButton');
            if (x == true) {
                //debugger;
                $(element).addClass(workflowAppTheme_SelectedButton).removeClass(workflowAppTheme);
            } else {
                console.log('In $(\'.bwActiveMenu_Admin\').bwActiveMenu_Admin(\'RenderContentForButton\', ). Error: Unable to locate class leftButton. xcx2');
                //alert('In $(\'.bwActiveMenu_Admin\').bwActiveMenu_Admin(\'RenderContentForButton\', ). Error: Unable to locate class leftButton. xcx2');
            }





            switch (button) {
                case 'PERSONAL_BEHAVIOR':
                    //populateStartPageItem('divConfiguration', 'Reports', '');

                    //Personal / Behavior
                    //divWelcomePageLeftButtonsConfigurationButton
                    //populateStartPageItem('divConfiguration', 'Reports', '');

                    $('#bwQuickLaunchMenuTd').css({
                        width: '0'
                    }); // This gets rid of the jumping around.

                    try {
                        $('#FormsEditorToolbox').dialog('close');
                    } catch (e) { }

                    //generateConfigurationLeftSideMenu();
                    //renderLeftButtons('divConfigurationPageLeftButtons');

                    $('#divPageContent2_Title').html('PERSONAL SETTINGS');

                    renderConfigurationPersonalBehavior();

                    break;
                    //case 'ORGANIZATION':

                    //    $('#bwQuickLaunchMenuTd').css({
                    //        width: '0'
                    //    }); // This gets rid of the jumping around.

                    //    try {
                    //        $('#FormsEditorToolbox').dialog('close');
                    //    } catch (e) { }

                    //    $('#divPageContent2_Title').html('ORGANIZATION');

                    //    $('#divPageContent3').html('');
                    //    $('.bwOrganizationEditor').bwOrganizationEditor('loadBusinessModelEditor', true); //loadAndRenderBusinessModelEditor'); // This way it now loads fresh every time it is displayed. This is better for when changes are made, such as the "Organization Name". The old way which didn't reload was to call: 'renderBusinessModelEditor'); 
                    //    // Exception in bwActiveMenu_Admin.js.RenderContentForInnerLeftMenuButtons(): loadAndRenderBusinessModelEditor is not defined, RenderContentForInnerLeftMenuButtons@https://www.budgetworkflow.com/widgets/bwActiveMenu_Admin.js?v=xcx11132022-3:1904:22 $.widget/

                    //    break;

                    //case 'PARTICIPANTS':
                    //    //divParticipantsButton
                    //    //renderConfigurationParticipants();
                    //    //console.log('In renderConfigurationOrgRoles().');
                    //    //var requestTypes = bwEnabledRequestTypes.EnabledItems;

                    //    $('#bwQuickLaunchMenuTd').css({
                    //        width: '0'
                    //    }); // This gets rid of the jumping around.

                    //    try {
                    //        $('#FormsEditorToolbox').dialog('close');
                    //    } catch (e) { }

                    //    //var canvas = document.getElementById("myCanvas");
                    //    //var ctx = canvas.getContext("2d");
                    //    //ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas of it's lines

                    //    $('#divPageContent2_Title').html('PARTICIPANTS');

                    //    $('#divPageContent3').empty(); // Clear the div and rebuild it with out new 'Departments' title.
                    //    //$('#divFunctionalAreasMasterSubMenuDiv').hide(); //This si the top bar which we want to hide in this case.

                    //    //var html = '';
                    //    //html += '<table style="border-width: 0px; margin: 0px; padding: 0px; width: 100%;"><tbody><tr style="border-width: 0px; margin: 0px; padding: 0px;"><td style="border-width: 0px; margin: 0px; padding: 0px;">';
                    //    //html += 'Participants...xcx1';
                    //    //html += '</td></tr></tbody></table>';
                    //    //$('#divPageContent3').html(html);
                    //    //
                    //    //disableDepartmentsButton();
                    //    //disableRaciSettingsButton();
                    //    //disableOrgRoleSettingsButton();
                    //    //$('#divFunctionalAreasSubSubMenus').empty();


                    //    var html = '';
                    //    html += '<div id="divBwParticipantsEditor"></div>';
                    //    $('#divPageContent3').append(html);
                    //    //$('#divFunctionalAreasSubSubMenus').html(html);


                    //    ////debugger;

                    //    //                $('#divFunctionalAreasSubSubMenus').html(html);


                    //    var options = {
                    //        displayWorkflowPicker: true,
                    //        bwTenantId: tenantId,
                    //        bwWorkflowAppId: workflowAppId,
                    //        bwEnabledRequestTypes: bwEnabledRequestTypes
                    //    };
                    //    var $bwparticipantseditor = $("#divBwParticipantsEditor").bwParticipantsEditor(options);
                    //    break;
                case 'ROLES':

                    $('#bwQuickLaunchMenuTd').css({
                        width: '0'
                    }); // This gets rid of the jumping around.

                    try {
                        $('#FormsEditorToolbox').dialog('close');
                    } catch (e) { }

                    var canvas = document.getElementById("myCanvas");
                    var ctx = canvas.getContext("2d");
                    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas of it's lines

                    $('#divPageContent2_Title').html('ROLES');

                    $('#divPageContent3').empty(); // Clear the div and rebuild it with out new 'Departments' title.

                    var html = '';
                    html += '<div id="divBwRolesEditor"></div>';
                    $('#divPageContent3').append(html);

                    //var options = {
                    //    displayWorkflowPicker: true,
                    //    bwTenantId: tenantId,
                    //    bwWorkflowAppId: workflowAppId,
                    //    bwEnabledRequestTypes: bwEnabledRequestTypes
                    //};
                    //var $bwparticipantseditor = $("#divBwParticipantsEditor").bwParticipantsEditor(options);
                    // Render the RACI role editor.
                    $('.bwCoreComponent').bwCoreComponent('renderBwRoles', 'divBwRolesEditor'); // THIS DISPLAYS the roles that are in the JSON org definition.

                    break;
                case 'WORKFLOW_AND_EMAIL':

                    $('#divPageContent2_Title').html('WORKFLOWS');

                    $('#divPageContent3').html('');

                    var html = '';

                    html += '<div id="divBwWorkflowEditor_NewTenant" style="height:100vh;"></div>';

                    $('#divPageContent3').html(html);

                    var $form = $("#divBwWorkflowEditor_NewTenant").bwWorkflowEditor_NewTenant({});

                    break;

                case 'CHECKLISTS':
                    //Checklists
                    //divChecklistsSettingsButton
                    $('#divPageContent2_Title').html('CHECKLISTS');
                    renderConfigurationChecklists();
                    break;
                case 'FORMS':
                    //Forms
                    //divFormsSettingsButton
                    $('#divPageContent2_Title').html('FORMS');
                    renderConfigurationForms();
                    break;
                case 'SETTINGS':
                    //Settings
                    //divWorkflowSettingsButton
                    $('#divPageContent2_Title').html('ORGANIZATION SETTINGS');
                    //renderConfigurationSettings();

                    $('#divPageContent3').html('');

                    var html = '';



                    // Sending email.
                    html += '<table>';
                    html += '  <tr>';
                    html += '    <td style="text-align:left;vertical-align:middle;white-space:nowrap;vertical-align:top;" class="bwSliderTitleCell">';
                    html += '       Sending email:&nbsp;';
                    html += '    </td>';
                    html += '    <td class="bwChartCalculatorLightCurrencyTableCell">';
                    html += '       <table>';
                    html += '           <tr>';
                    html += '               <td>';
                    html += '                   <label for="configurationBehaviorTurnOffEmailSlider"></label><input type="checkbox" name="configurationBehaviorTurnOffEmailSlider" id="configurationBehaviorTurnOffEmailSlider" />';
                    html += '               </td>';
                    html += '               <td>';
                    html += '                   &nbsp;&nbsp;';
                    html += '               </td>';
                    html += '               <td>';
                    html += '                   <span id="configurationBehaviorTurnOffEmailSlider_CurrentStatus"></span>';
                    html += '               </td>';
                    html += '               <td>';
                    html += '               </td>';
                    html += '               <td>';
                    html += '                   <span id="configurationBehaviorTurnOffEmailSlider_Description" style="font-size:normal;">[configurationBehaviorTurnOffEmailSlider_Description]</span>';
                    html += '               </td>';
                    html += '           </tr>';
                    html += '       </table>';
                    html += '    </td>';
                    html += '  </tr>';
                    html += '</table>';


                    html += '<br />';









                    html += '<div id="divBwRequestTypeEditor_NewTenant"></div>';

                    $('#divPageContent3').html(html);

                    $("#divBwRequestTypeEditor_NewTenant").bwRequestTypeEditor_NewTenant({});

                    break;

                case 'MONITOR_PLUS_TOOLS':
                    //Monitor + Tools
                    //divMonitoringToolsButton
                    $('#divPageContent2_Title').html('MONITORING + TOOLS');
                    renderConfigurationMonitoringTools();
                    break;
                case 'INVENTORY':

                    $('#divPageContent2_Title').html('INVENTORY');
                    renderConfigurationInventory();
                    break;

                case 'FUNCTIONAL_AREAS':
                    //Functional Areas
                    //divFunctionalAreasButton
                    $('#divPageContent2_Title').html('Functional Areas');
                    renderConfigurationFunctionalAreas();
                    break;
            }
        } catch (e) {
            console.log('Exception in bwActiveMenu_Admin.js.RenderContentForInnerLeftMenuButtons(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwActiveMenu_Admin.js.RenderContentForInnerLeftMenuButtons(): ' + e.message + ', ' + e.stack);
        }
    },


    adjustLeftSideMenu: function () {
        try {
            console.log('In bwActiveMenu_Admin.js.adjustLeftSideMenu(). Also adjusting length of the divTopBar_Long element.');
            var thiz = this;





            // On the macbook, in Safari, the top bar doesn't get wide enough. Safari must not handle the table and div tag combination properly.
            // So, here we set the width and that seems to fix it. 5-22-2022.

            var rect1 = document.getElementById('divTopBar_Long').getBoundingClientRect();
            var left1 = rect1.left;

            var rect2 = document.getElementById('divTopBar_OrganizationName').getBoundingClientRect();
            var width1 = rect2.right - rect2.left;
            if (width1 > 0) {
                width1 += 10; //  added 10 for buffer
            }

            var screenWidth = document.documentElement.clientWidth;
            var endPiece = 30 + 8;
            var desiredWidth = screenWidth - left1 - width1 - endPiece;
            document.getElementById('divTopBar_Long').style.width = desiredWidth + 'px'; // Does this fix the top bar on the mac (where it does not go completely across the screen..?) 5-22-2022














            //
            // Pixel window height indicator for testing while getting menu 100%.
            //
            var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

            console.log('In bwActiveMenu_Admin.js.adjustLeftSideMenu(). height: ' + height);

            //var divBottomOfMenuMarker = document.getElementById('divBottomOfMenuMarker');
            //if (!divBottomOfMenuMarker) {
            //    $(document.body).prepend('<div id="divBottomOfMenuMarker" style="display:block;position:absolute;">[divBottomOfMenuMarker]</div>');
            //}
            //document.getElementById('divBottomOfMenuMarker').style.top = height + "px";

            // Now we have to subtract the height of the top blue bar.
            var topBlueBar = $('#tableMainMenu1').find('tr')[0];
            var rect = topBlueBar.getBoundingClientRect();
            var topBlueBar_Height = rect.bottom - rect.top;
            height = Math.round(height - topBlueBar_Height);


            // 1-2-2022
            var developerModeEnabled = $('.bwAuthentication').bwAuthentication('option', 'developerModeEnabled');
            if (developerModeEnabled == true) {
                $('#divLeftMenuTopSmallBar1').html(height); // Display this height on the screen in the little top blue bar. 
            }




            // Now that we have the height, lets stretch the left menu the length of the screen, resizing each button according to:
            // - buttonHeight_WeightedValue << This value determines the height of the button. They all get added up, then comprise 100% of the height.

            var totalButtonSpacers_Height = 0;
            $('#tdLeftSideMenu').find('.buttonSpacer').each(function (index, value) {
                var tmpHeight = this.style.height.split('px')[0];
                totalButtonSpacers_Height += Number(tmpHeight);
            });

            var numberOfButtons = $('#tdLeftSideMenu').find('.leftButton,.leftButton_inactive').length;
            var weightedHeightValues_OneHundredPercent = 0; // This is used so we can calculate the spread percentage wise.
            $('#tdLeftSideMenu').find('.leftButton,.leftButton_inactive').each(function (index, value) {


                this.style.backgroundColor = 'darkgray'; // Button color override (for now) 8-28-2021



                if ($(this).attr('weightedheightvalue')) {
                    weightedHeightValues_OneHundredPercent += Number($(this).attr('weightedheightvalue'));
                }
            });


            // Good 9-20-2021 prior to adding minimum button height requirement.
            //var remainingHeight = height - totalButtonSpacers_Height;
            //$('#tdLeftSideMenu').find('.leftButton').each(function (index, value) {
            //    if ($(this).attr('weightedheightvalue')) {
            //        var weightedHeightValue = Number($(this).attr('weightedheightvalue'));
            //        var divisor = weightedHeightValue / weightedHeightValues_OneHundredPercent;
            //        var buttonHeight = remainingHeight * divisor;
            //        console.log('Setting height of button "' + this.id + '" to ' + buttonHeight + 'px.');
            //        this.style.height = buttonHeight + 'px';
            //    }
            //});


            // Rescale buttons with minimum button height. Not perfect, but getting there.
            var minimumButtonHeight = 30;
            var remainingHeight; // = height - totalButtonSpacers_Height;
            var buttonQuantity = $('#tdLeftSideMenu').find('.leftButton,.leftButton_inactive').length;
            $('#tdLeftSideMenu').find('.leftButton,.leftButton_inactive').each(function (index, value) {

                height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
                height = Math.round(height - topBlueBar_Height);
                remainingHeight = height - totalButtonSpacers_Height;

                if ($(this).attr('weightedheightvalue')) {
                    var weightedHeightValue = Number($(this).attr('weightedheightvalue'));
                    var divisor = weightedHeightValue / weightedHeightValues_OneHundredPercent;

                    // This gives us a correction so all the buttons fit on the screen. Rough but I am not a mathematician lol!
                    var buttonAdjuster;
                    if (buttonQuantity > 4) {
                        buttonAdjuster = 8;
                    } else {
                        buttonAdjuster = 16;
                    }

                    var buttonHeight = (remainingHeight * divisor) - buttonAdjuster; // This -8 makes it so the bottom button makes it onto the screen. 12-20-2021
                    if (minimumButtonHeight > buttonHeight) {
                        // The button is already at the minimum height, so do nothing, except recalculate the remaining height.
                        //console.log('Setting height of button "' + this.id + '" to minimum button height ' + buttonHeight + 'px.');
                        buttonHeight = minimumButtonHeight;
                        this.style.height = buttonHeight + 'px';
                    } else {
                        //console.log('Setting height of button "' + this.id + '" to ' + buttonHeight + 'px.');
                        this.style.height = buttonHeight + 'px';
                    }
                }
            });








            // Now that the left menu is done, do the inner left menu.
            thiz.adjustInnerLeftSideMenu();

        } catch (e) {
            console.log('Exception in adjustLeftSideMenu(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in adjustLeftSideMenu(): ' + e.message + ', ' + e.stack);
        }
    },

    shrinkLeftMenuBar: function () {
        try {
            console.log('In shrinkLeftMenuBar().');
            //var thiz = this;

            var html = '';

            // shrink left menu
            document.getElementById('divLeftMenuHeader').style.width = '100px';
            var cusid_ele = document.getElementsByClassName('leftButtonText');
            for (var i = 0; i < cusid_ele.length; ++i) {
                var item = cusid_ele[i];
                item.style.fontSize = '8pt';
            }

            // Now that the left menu is done, do the inner left menu.
            this.adjustInnerLeftSideMenu();

        } catch (e) {
            console.log('Exception in shrinkLeftMenuBar(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in shrinkLeftMenuBar(): ' + e.message + ', ' + e.stack);
        }
    },

    adjustInnerLeftSideMenu: function () {
        try {
            console.log('In adjustInnerLeftSideMenu().');
            var thiz = this;

            //debugger;
            //if (document.getElementById('tableMainMenu3').style.display == 'none') {
            //    // The inner left menu is not being displayed, so do nothing here.
            //} else {
            if ($('#tdInnerLeftSideMenu').is(':visible')) {
                //
                // Pixel window height indicator for testing while getting menu 100%.
                //
                var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

                // Now we have to subtract the height of the top blue bar.
                var topBlueBar = $('#tableMainMenu3').find('tr')[0];
                var rect = topBlueBar.getBoundingClientRect();
                var topBlueBar_Height = rect.bottom - rect.top;
                height = Math.round(height - topBlueBar_Height);



                // 1-2-2022
                var developerModeEnabled = $('.bwAuthentication').bwAuthentication('option', 'developerModeEnabled');
                if (developerModeEnabled == true) {
                    $('#divInnerLeftMenuTopSmallBar1').html(height); // Display this height on the screen in the little top blue bar. 
                }




                // Now that we have the height, lets stretch the left menu the length of the screen, resizing each button according to:
                // - buttonHeight_WeightedValue << This value determines the height of the button. They all get added up, then comprise 100% of the height.

                var totalButtonSpacers_Height = 0;
                $('#tdInnerLeftSideMenu').find('.buttonSpacer').each(function (index, value) {
                    var tmpHeight = this.style.height.split('px')[0];
                    totalButtonSpacers_Height += Number(tmpHeight);
                });

                var numberOfButtons = $('#tdInnerLeftSideMenu').find('.leftButton,.leftButton_inactive').length;
                //var numberOfInactiveButtons = $('#tdInnerLeftSideMenu').find('.leftButton_inactive').length;
                //var numberOfButtons = numberOfActiveButtons + numberOfInactiveButtons;
                var weightedHeightValues_OneHundredPercent = 0; // This is used so we can calculate the spread percentage wise.
                $('#tdInnerLeftSideMenu').find('.leftButton,.leftButton_inactive').each(function (index, value) {


                    this.style.backgroundColor = 'darkgray'; // Button color override (for now) 8-28-2021



                    if ($(this).attr('weightedheightvalue')) {
                        weightedHeightValues_OneHundredPercent += Number($(this).attr('weightedheightvalue'));
                    }
                });

                // Rescale buttons with minimum button height. Not perfect, but getting there.
                var minimumButtonHeight = 30;
                var remainingHeight; // = height - totalButtonSpacers_Height;
                $('#tdInnerLeftSideMenu').find('.leftButton,.leftButton_inactive').each(function (index, value) {


                    height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
                    height = Math.round(height - topBlueBar_Height);
                    remainingHeight = height - totalButtonSpacers_Height;


                    if ($(this).attr('weightedheightvalue')) {
                        var weightedHeightValue = Number($(this).attr('weightedheightvalue'));
                        var divisor = weightedHeightValue / weightedHeightValues_OneHundredPercent;
                        var buttonHeight = (remainingHeight * divisor) - 15; // This -10 makes it so the bottom button makes it onto the screen. 12-28-2021
                        if (minimumButtonHeight > buttonHeight) {
                            // The button is already at the minimum height, so do nothing, except recalculate the remaining height.
                            //console.log('Setting height of button "' + this.id + '" to minimum button height ' + buttonHeight + 'px.');
                            buttonHeight = minimumButtonHeight;
                            this.style.height = buttonHeight + 'px';
                        } else {
                            //console.log('Setting height of button "' + this.id + '" to ' + buttonHeight + 'px.');
                            this.style.height = buttonHeight + 'px';
                        }
                    }
                });
            }

        } catch (e) {
            console.log('Exception in adjustInnerLeftSideMenu(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in adjustInnerLeftSideMenu(): ' + e.message + ', ' + e.stack);
        }
    },


    //
    // The following methods are for determining the complimentary color of another color.
    //
    RGB2HSV: function (rgb) {
        try {
            hsv = new Object();
            max = this.max3(rgb.r, rgb.g, rgb.b);
            dif = max - this.min3(rgb.r, rgb.g, rgb.b);
            hsv.saturation = (max == 0.0) ? 0 : (100 * dif / max);
            if (hsv.saturation == 0) hsv.hue = 0;
            else if (rgb.r == max) hsv.hue = 60.0 * (rgb.g - rgb.b) / dif;
            else if (rgb.g == max) hsv.hue = 120.0 + 60.0 * (rgb.b - rgb.r) / dif;
            else if (rgb.b == max) hsv.hue = 240.0 + 60.0 * (rgb.r - rgb.g) / dif;
            if (hsv.hue < 0.0) hsv.hue += 360.0;
            hsv.value = Math.round(max * 100 / 255);
            hsv.hue = Math.round(hsv.hue);
            hsv.saturation = Math.round(hsv.saturation);
            return hsv;
        } catch (e) {
            console.log('Exception in bwActiveMenu_Admin.js.RGB2HSV(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwActiveMenu_Admin.js.RGB2HSV(): ' + e.message + ', ' + e.stack);
        }
    },
    HSV2RGB: function (hsv) {
        try {
            // 2-4-2022: This is from: https://stackoverflow.com/questions/1664140/js-function-to-calculate-complementary-colour
            // RGB2HSV and HSV2RGB are based on Color Match Remix [http://color.twysted.net/]
            // which is based on or copied from ColorMatch 5K [http://colormatch.dk/]
            var rgb = new Object();
            if (hsv.saturation == 0) {
                rgb.r = rgb.g = rgb.b = Math.round(hsv.value * 2.55);
            } else {
                hsv.hue /= 60;
                hsv.saturation /= 100;
                hsv.value /= 100;
                i = Math.floor(hsv.hue);
                f = hsv.hue - i;
                p = hsv.value * (1 - hsv.saturation);
                q = hsv.value * (1 - hsv.saturation * f);
                t = hsv.value * (1 - hsv.saturation * (1 - f));
                switch (i) {
                    case 0: rgb.r = hsv.value; rgb.g = t; rgb.b = p; break;
                    case 1: rgb.r = q; rgb.g = hsv.value; rgb.b = p; break;
                    case 2: rgb.r = p; rgb.g = hsv.value; rgb.b = t; break;
                    case 3: rgb.r = p; rgb.g = q; rgb.b = hsv.value; break;
                    case 4: rgb.r = t; rgb.g = p; rgb.b = hsv.value; break;
                    default: rgb.r = hsv.value; rgb.g = p; rgb.b = q;
                }
                rgb.r = Math.round(rgb.r * 255);
                rgb.g = Math.round(rgb.g * 255);
                rgb.b = Math.round(rgb.b * 255);
            }
            return rgb;
        } catch (e) {
            console.log('Exception in bwActiveMenu_Admin.js.HSV2RGB(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwActiveMenu_Admin.js.HSV2RGB(): ' + e.message + ', ' + e.stack);
        }
    },
    HueShift: function (h, s) {
        try {
            //Adding HueShift via Jacob (see comments)
            h += s; while (h >= 360.0) h -= 360.0; while (h < 0.0) h += 360.0; return h;
        } catch (e) {
            console.log('Exception in bwActiveMenu_Admin.js.HueShift(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwActiveMenu_Admin.js.HueShift(): ' + e.message + ', ' + e.stack);
        }
    },
    min3: function (a, b, c) {
        try {
            //min max via Hairgami_Master (see comments)
            return (a < b) ? ((a < c) ? a : c) : ((b < c) ? b : c);
        } catch (e) {
            console.log('Exception in bwActiveMenu_Admin.js.min3(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwActiveMenu_Admin.js.min3(): ' + e.message + ', ' + e.stack);
        }
    },
    max3: function (a, b, c) {
        try {
            return (a > b) ? ((a > c) ? a : c) : ((b > c) ? b : c);
        } catch (e) {
            console.log('Exception in bwActiveMenu_Admin.js.max3(): ' + e.message + ', ' + e.stack);
            displayAlertDialog('Exception in bwActiveMenu_Admin.js.max3(): ' + e.message + ', ' + e.stack);
        }
    }

});